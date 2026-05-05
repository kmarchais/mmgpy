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
    import numpy as np
    from numpy.typing import NDArray

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

    def remesh(
        self,
        **options: Any,  # noqa: ANN401  -- forwarded to Mesh.remesh; see docstring
    ) -> pv.UnstructuredGrid | pv.PolyData:
        """Remesh the underlying dataset and return a new PyVista dataset.

        Parameters
        ----------
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
        from mmgpy._mesh import Mesh  # noqa: PLC0415

        mesh = Mesh(self._dataset)
        mesh.remesh(**options)
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


__all__ = ["MmgAccessor", "read_mesh", "write_mesh"]
