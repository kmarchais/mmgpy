"""PyVista 0.48 plugin: Medit reader/writer + ``.mmg`` dataset accessor.

Activated via entry points declared in ``pyproject.toml``:

* ``pyvista.readers``: ``.mesh``, ``.meshb``
* ``pyvista.writers``: ``.mesh``, ``.meshb``
* ``pyvista.accessors``: ``mmg``

Once ``mmgpy`` is installed, every PyVista user transparently gains:

>>> import pyvista as pv
>>> mesh = pv.read("brain.mesh")           # Medit text format
>>> mesh = pv.read("brain.meshb")          # Medit binary format
>>> remeshed = mesh.mmg.remesh(hsiz=0.1)   # accessor-driven remeshing
>>> mesh.save("out.mesh")                  # round-trip back to Medit

When reading ``foo.mesh``/``foo.meshb``, a sibling ``foo.sol``/``foo.solb``
is auto-loaded into ``point_data``/``cell_data`` if present.
"""

from __future__ import annotations

import logging
from pathlib import Path
from typing import TYPE_CHECKING, Any

import pyvista as pv

if TYPE_CHECKING:
    from collections.abc import Mapping

    import numpy as np
    from numpy.typing import NDArray

    from mmgpy._mesh import Mesh as _Mesh
    from mmgpy._mesh import MeshKind
    from mmgpy._validation import ValidationReport

logger = logging.getLogger("mmgpy")

_MEDIT_EXTENSIONS = (".mesh", ".meshb")
_SOL_EXTENSIONS = (".sol", ".solb")


def _find_companion_sol(mesh_path: Path) -> Path | None:
    """Return the sibling ``.sol``/``.solb`` for *mesh_path* if one exists."""
    for ext in _SOL_EXTENSIONS:
        candidate = mesh_path.with_suffix(ext)
        if candidate.exists():
            return candidate
    return None


def _attach_sol_fields(
    dataset: pv.DataSet,
    sol_path: Path,
) -> None:
    """Parse a Medit ``.sol`` file and attach its arrays to *dataset*.

    Vertex-located fields land in ``point_data``; element-located fields
    land in ``cell_data``. Binary ``.solb`` files are not parsed in
    Python: the C++ MMG library handles those, so for now they round-trip
    via the accessor (``mesh.mmg.load_sol(...)``) instead of auto-pairing.
    """
    if sol_path.suffix.lower() == ".solb":
        logger.debug(
            "Skipping auto-pair of binary .solb %s; use mesh.mmg.load_sol()",
            sol_path,
        )
        return

    from mmgpy._sol import parse_sol_file  # noqa: PLC0415

    try:
        content = sol_path.read_text(encoding="utf-8")
    except (OSError, UnicodeDecodeError) as exc:
        logger.warning(
            "Could not read companion .sol file %s: %s; skipping auto-pair.",
            sol_path,
            exc,
        )
        return

    try:
        fields = parse_sol_file(content)
    except (ValueError, KeyError, IndexError) as exc:
        logger.warning(
            "Could not parse companion .sol file %s: %s; skipping auto-pair.",
            sol_path,
            exc,
        )
        return

    n_points = dataset.n_points
    n_cells = dataset.n_cells
    for name, payload in fields.items():
        data: NDArray[np.float64] = payload["data"]
        location = payload["location"]
        if location == "vertices" and len(data) == n_points:
            dataset.point_data[name] = data
        elif location in {"triangles", "tetrahedra"} and len(data) == n_cells:
            dataset.cell_data[name] = data
        else:
            logger.debug(
                "Skipping .sol field %r: length %d does not match "
                "dataset (%d points, %d cells)",
                name,
                len(data),
                n_points,
                n_cells,
            )


_LOCAL_SIZING_SHAPES = ("sphere", "box", "cylinder", "from_point")
_MMG_FIELD_NAMES = ("metric", "displacement", "levelset", "tensor")


def _build_mesh_with_mmg_fields(dataset: pv.UnstructuredGrid | pv.PolyData) -> _Mesh:
    """Construct a ``Mesh`` from *dataset* with MMG fields pushed into the C++ impl.

    ``mmgpy._io.read`` deliberately strips the four MMG-recognized point_data
    keys (``metric``, ``displacement``, ``levelset``, ``tensor``) into a lazy
    source instead of forwarding them to MMG. The accessor's contract is the
    opposite: a user's ``dataset.point_data["metric"]`` is the source of truth
    for any subsequent operation. This helper bridges the gap by re-applying
    those fields through ``Mesh.__setitem__``, which routes them to the C++
    layer.
    """
    import numpy as np  # noqa: PLC0415

    # Use mmgpy.read instead of Mesh(dataset) to bypass the deprecation
    # warning: read returns a Mesh built via Mesh._from_impl, which does
    # not run __init__.
    from mmgpy._io import read as _read_mesh  # noqa: PLC0415

    mesh = _read_mesh(dataset)
    for key in _MMG_FIELD_NAMES:
        if key not in dataset.point_data:
            continue
        arr = np.asarray(dataset.point_data[key], dtype=np.float64)
        # MMG's scalar metric / levelset bindings want an Nx1 array; PyVista
        # users naturally store these as 1D, so reshape on the way through.
        if arr.ndim == 1 and key in ("metric", "levelset"):
            arr = arr.reshape(-1, 1)
        mesh[key] = arr
    return mesh


def _apply_local_sizing_specs(
    mesh: _Mesh,
    specs: list[Mapping[str, Any]] | None,
) -> None:
    """Register sizing constraints from a list of dict specs and apply them.

    Each spec is a dict with a ``"shape"`` key (one of ``"sphere"``, ``"box"``,
    ``"cylinder"``, ``"from_point"``) plus the parameters that the matching
    ``Mesh.set_size_*`` method expects. ``Mesh.remesh`` auto-applies sizing,
    but the lagrangian/levelset/optimize/uniform variants do not, so we apply
    explicitly here for uniform behavior across all accessor methods.
    """
    if not specs:
        return
    for spec in specs:
        shape = spec.get("shape")
        if shape == "sphere":
            mesh.set_size_sphere(spec["center"], spec["radius"], spec["size"])
        elif shape == "box":
            mesh.set_size_box(spec["bounds"], spec["size"])
        elif shape == "cylinder":
            mesh.set_size_cylinder(
                spec["point1"],
                spec["point2"],
                spec["radius"],
                spec["size"],
            )
        elif shape == "from_point":
            mesh.set_size_from_point(
                spec["point"],
                spec["near_size"],
                spec["far_size"],
                spec["influence_radius"],
            )
        else:
            msg = (
                f"Unknown local sizing shape {shape!r}; "
                f"expected one of {_LOCAL_SIZING_SHAPES}."
            )
            raise ValueError(msg)
    mesh.apply_local_sizing()


def read_mesh(
    path: str,
    **kwargs: object,  # noqa: ARG001
) -> pv.UnstructuredGrid | pv.PolyData:
    """Read a Medit ``.mesh``/``.meshb`` file and return a PyVista dataset.

    Registered for the ``.mesh`` and ``.meshb`` extensions via the
    ``pyvista.readers`` entry point group. A sibling ``.sol`` file (same
    stem, same directory) is auto-loaded into ``point_data``/``cell_data``
    if present.

    Returns
    -------
    pv.UnstructuredGrid or pv.PolyData
        ``UnstructuredGrid`` for tetrahedral meshes, ``PolyData`` for 2D
        and surface triangular meshes. MMG's ridges and boundary edges
        survive as ``LINE`` cells (``include_edges=True`` internally).

    """
    from mmgpy._io import _load_medit_native  # noqa: PLC0415
    from mmgpy._pyvista import to_pyvista  # noqa: PLC0415

    mesh_path = Path(path)
    impl = _load_medit_native(mesh_path, mesh_kind=None)
    dataset = to_pyvista(impl, include_refs=True, include_edges=True)

    sol_path = _find_companion_sol(mesh_path)
    if sol_path is not None:
        _attach_sol_fields(dataset, sol_path)

    return dataset


def write_mesh(
    dataset: pv.DataSet,
    path: str,
    **kwargs: object,  # noqa: ARG001
) -> None:
    """Write *dataset* to a Medit ``.mesh``/``.meshb`` file.

    Registered for the ``.mesh`` and ``.meshb`` extensions via the
    ``pyvista.writers`` entry point group. Lets ``mesh.save("out.mesh")``
    round-trip through MMG without going through the ``Mesh`` wrapper.
    """
    from mmgpy._pyvista import from_pyvista  # noqa: PLC0415

    if not isinstance(dataset, (pv.UnstructuredGrid, pv.PolyData)):
        msg = (
            f"Cannot write {type(dataset).__name__} to Medit format: "
            "MMG only handles UnstructuredGrid (tetrahedra) and PolyData "
            "(triangles)."
        )
        raise TypeError(msg)

    impl = from_pyvista(dataset)
    impl.save(str(path))


# ---------------------------------------------------------------------------
# .mmg dataset accessor
# ---------------------------------------------------------------------------


@pv.register_dataset_accessor("mmg", pv.UnstructuredGrid)
@pv.register_dataset_accessor("mmg", pv.PolyData)
class MmgAccessor:
    """``mesh.mmg.<method>`` accessor for MMG operations on PyVista datasets.

    Methods take and return PyVista datasets, so the accessor composes with
    the rest of the PyVista API. Internally each call constructs an mmgpy
    ``Mesh`` from the dataset, runs the operation, and returns a fresh
    PyVista dataset.

    Examples
    --------
    >>> import pyvista as pv
    >>> import mmgpy  # noqa: F401  -- registers the accessor
    >>> mesh = pv.read("brain.mesh")
    >>> remeshed = mesh.mmg.remesh(hsiz=0.1)
    >>> remeshed.n_cells > 0
    True

    """

    def __init__(self, dataset: pv.UnstructuredGrid | pv.PolyData) -> None:
        self._dataset = dataset

    @property
    def kind(self) -> MeshKind:
        """Return the MMG mesh kind (TETRAHEDRAL, TRIANGULAR_2D, or TRIANGULAR_SURFACE).

        Inferred from the dataset's cell types via the same auto-detection
        path used by ``mesh.mmg.remesh``.
        """
        from mmgpy._io import read as _read_mesh  # noqa: PLC0415

        return _read_mesh(self._dataset).kind

    def remesh(
        self,
        *,
        local_sizing: list[Mapping[str, Any]] | None = None,
        **options: Any,  # noqa: ANN401  -- forwarded to Mesh.remesh; see docstring
    ) -> pv.UnstructuredGrid | pv.PolyData:
        """Remesh the underlying dataset and return a new PyVista dataset.

        Parameters
        ----------
        local_sizing : list of dict, optional
            Sizing constraints applied before remeshing. Each dict has a
            ``"shape"`` key (``"sphere"``, ``"box"``, ``"cylinder"``, or
            ``"from_point"``) plus the parameters of the matching
            ``Mesh.set_size_*`` method.
        **options : object
            Forwarded to :meth:`mmgpy.Mesh.remesh`. Common knobs include
            ``hmin``, ``hmax``, ``hsiz``, and ``hausd``.

        Returns
        -------
        pv.UnstructuredGrid or pv.PolyData
            Tetrahedral results come back as ``UnstructuredGrid``;
            2D and surface results as ``PolyData``. Element references
            survive in ``cell_data["refs"]`` and MMG edges in ``LINE``
            cells.

        """
        mesh = _build_mesh_with_mmg_fields(self._dataset)
        _apply_local_sizing_specs(mesh, local_sizing)
        mesh.remesh(**options)
        return mesh.to_pyvista(include_refs=True, include_edges=True)

    def remesh_lagrangian(
        self,
        displacement: NDArray[np.float64],
        *,
        local_sizing: list[Mapping[str, Any]] | None = None,
        **options: Any,  # noqa: ANN401  -- forwarded to Mesh.remesh_lagrangian
    ) -> pv.UnstructuredGrid | pv.PolyData:
        """Lagrangian (moving-mesh) remeshing.

        Only available for TETRAHEDRAL and TRIANGULAR_2D datasets.

        Parameters
        ----------
        displacement : ndarray
            Per-vertex displacement field, shape ``(n_points, dim)``.
        local_sizing : list of dict, optional
            Sizing constraints; see :meth:`remesh`.
        **options : object
            Forwarded to :meth:`mmgpy.Mesh.remesh_lagrangian`.

        """
        mesh = _build_mesh_with_mmg_fields(self._dataset)
        _apply_local_sizing_specs(mesh, local_sizing)
        mesh.remesh_lagrangian(displacement, **options)
        return mesh.to_pyvista(include_refs=True, include_edges=True)

    def remesh_levelset(
        self,
        levelset: NDArray[np.float64],
        *,
        local_sizing: list[Mapping[str, Any]] | None = None,
        **options: Any,  # noqa: ANN401  -- forwarded to Mesh.remesh_levelset
    ) -> pv.UnstructuredGrid | pv.PolyData:
        """Level-set discretization remeshing.

        Parameters
        ----------
        levelset : ndarray
            Per-vertex level-set field; the zero isosurface becomes an
            explicit boundary in the output mesh.
        local_sizing : list of dict, optional
            Sizing constraints; see :meth:`remesh`.
        **options : object
            Forwarded to :meth:`mmgpy.Mesh.remesh_levelset`.

        """
        mesh = _build_mesh_with_mmg_fields(self._dataset)
        _apply_local_sizing_specs(mesh, local_sizing)
        mesh.remesh_levelset(levelset, **options)
        return mesh.to_pyvista(include_refs=True, include_edges=True)

    def remesh_optimize(
        self,
        **options: Any,  # noqa: ANN401  -- forwarded to Mesh.remesh_optimize
    ) -> pv.UnstructuredGrid | pv.PolyData:
        """Quality optimization without topology changes.

        No vertices are inserted or removed; only positions move to improve
        element quality. Equivalent to ``remesh(optim=1, noinsert=1)``.
        """
        mesh = _build_mesh_with_mmg_fields(self._dataset)
        mesh.remesh_optimize(**options)
        return mesh.to_pyvista(include_refs=True, include_edges=True)

    def remesh_uniform(
        self,
        size: float,
        **options: Any,  # noqa: ANN401  -- forwarded to Mesh.remesh_uniform
    ) -> pv.UnstructuredGrid | pv.PolyData:
        """Remesh with a uniform target edge size.

        Parameters
        ----------
        size : float
            Target edge length applied uniformly across the mesh.
        **options : object
            Forwarded to :meth:`mmgpy.Mesh.remesh_uniform`.

        """
        mesh = _build_mesh_with_mmg_fields(self._dataset)
        mesh.remesh_uniform(size, **options)
        return mesh.to_pyvista(include_refs=True, include_edges=True)

    def load_sol(self, path: str | Path) -> None:
        """Load a Medit ``.sol`` file and attach its fields to the dataset.

        Vertex-located fields populate ``point_data``; element-located
        fields populate ``cell_data``. Modifies the dataset in place.

        Binary ``.solb`` files are not yet supported through this entry
        point; route them through the ``Mesh`` wrapper if needed.
        """
        sol_path = Path(path)
        if sol_path.suffix.lower() == ".solb":
            msg = (
                "Binary .solb files are not yet supported via mesh.mmg.load_sol(); "
                "use the Mesh wrapper for now."
            )
            raise NotImplementedError(msg)
        _attach_sol_fields(self._dataset, sol_path)

    def save_sol(self, path: str | Path) -> None:
        """Write the dataset's MMG fields to a Medit ``.sol``/``.solb`` file.

        Reads ``point_data["metric"]``, ``["displacement"]``, ``["levelset"]``,
        and ``["tensor"]`` (whichever are present) and writes them through the
        MMG C library, which handles both text and binary formats.
        """
        _build_mesh_with_mmg_fields(self._dataset).save_sol(path)

    def validate(  # noqa: PLR0913
        self,
        *,
        detailed: bool = False,
        strict: bool = False,
        check_geometry: bool = True,
        check_topology: bool = True,
        check_quality: bool = True,
        min_quality: float = 0.1,
    ) -> bool | ValidationReport:
        """Validate the mesh and return either a bool or a detailed report.

        See :meth:`mmgpy.Mesh.validate` for parameter semantics.
        """
        from mmgpy._io import read as _read_mesh  # noqa: PLC0415

        return _read_mesh(self._dataset).validate(
            detailed=detailed,
            strict=strict,
            check_geometry=check_geometry,
            check_topology=check_topology,
            check_quality=check_quality,
            min_quality=min_quality,
        )

    def element_quality(self, idx: int) -> float:
        """Return MMG's in-radius-ratio quality for one element (1-indexed).

        Distinct from :meth:`pyvista.DataSet.cell_quality`, which exposes
        VTK's metrics (e.g. scaled jacobian, aspect ratio).
        """
        from mmgpy._io import read as _read_mesh  # noqa: PLC0415

        return _read_mesh(self._dataset).get_element_quality(idx)

    def element_qualities(self) -> NDArray[np.float64]:
        """Return MMG in-radius-ratio quality for every element."""
        from mmgpy._io import read as _read_mesh  # noqa: PLC0415

        return _read_mesh(self._dataset).get_element_qualities()

    def adjacent_elements(self, idx: int) -> NDArray[np.int32]:
        """Return MMG-adjacency neighbors of element *idx* (1-indexed).

        Distinct from :meth:`pyvista.DataSet.cell_neighbors`, which uses
        VTK's 0-based topology. Useful when migrating code that relied on
        ``Mesh.get_adjacent_elements``.
        """
        from mmgpy._io import read as _read_mesh  # noqa: PLC0415

        return _read_mesh(self._dataset).get_adjacent_elements(idx)

    def vertex_neighbors(self, idx: int) -> NDArray[np.int32]:
        """Return MMG-adjacency neighbors of vertex *idx* (1-indexed).

        Distinct from :meth:`pyvista.DataSet.point_neighbors`, which uses
        VTK's 0-based topology. Useful when migrating code that relied on
        ``Mesh.get_vertex_neighbors``.
        """
        from mmgpy._io import read as _read_mesh  # noqa: PLC0415

        return _read_mesh(self._dataset).get_vertex_neighbors(idx)

    def center_of_mass(self) -> NDArray[np.float64]:
        """Return the volume-weighted (3D) or area-weighted (2D/surface) centroid.

        Distinct from :attr:`pyvista.DataSet.center`, which is the
        arithmetic mean of point coordinates without volume/area
        weighting.
        """
        from mmgpy._io import read as _read_mesh  # noqa: PLC0415

        return _read_mesh(self._dataset).get_center_of_mass()


__all__ = ["MmgAccessor", "read_mesh", "write_mesh"]
