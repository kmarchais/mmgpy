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
import warnings
from pathlib import Path
from typing import TYPE_CHECKING, Any, cast

import numpy as np
import pyvista as pv

if TYPE_CHECKING:
    from collections.abc import Mapping, Sequence
    from typing import TypeGuard

    from numpy.typing import NDArray

    from mmgpy._mesh import Mesh as _Mesh
    from mmgpy._mesh import MeshKind
    from mmgpy._options import Mmg2DOptions, Mmg3DOptions, MmgSOptions
    from mmgpy._sol import Location as _SolLocation
    from mmgpy._validation import ValidationReport

    MmgOptions = Mmg2DOptions | Mmg3DOptions | MmgSOptions

logger = logging.getLogger("mmgpy")

_MEDIT_EXTENSIONS = (".mesh", ".meshb")
_SOL_EXTENSIONS = (".sol", ".solb")


def _find_companion_sol(mesh_path: Path) -> Path | None:
    """Return the sibling ``.sol``/``.solb`` for *mesh_path* if one exists.

    Returns
    -------
    Path or None
        Path to the existing companion sol file, or ``None`` when neither
        ``.sol`` nor ``.solb`` is present.

    """
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


def _is_line_only_polydata(
    dataset: pv.UnstructuredGrid | pv.PolyData,
) -> TypeGuard[pv.PolyData]:
    """Return True if *dataset* is a PolyData carrying only LINE cells.

    Used by the ``.mmg.remesh`` accessor to detect inputs that should go
    through the mmg2d edge-triangulation path
    (:func:`mmgpy.mmg2d.generate`) instead of the standard remesh pipeline.

    Returns
    -------
    bool
        ``True`` when *dataset* is a :class:`pyvista.PolyData` whose only
        non-vertex cells are LINEs.

    """
    if not isinstance(dataset, pv.PolyData):
        return False
    n_lines = int(dataset.n_lines)
    if n_lines == 0:
        return False
    n_polys = (
        int(dataset.n_cells) - int(dataset.n_verts) - n_lines - int(dataset.n_strips)
    )
    return n_polys == 0


def _generate_from_line_polydata(
    dataset: pv.PolyData,
    options: dict[str, Any],
) -> pv.PolyData:
    """Run :func:`mmgpy.mmg2d.generate` on a line-only PolyData.

    Returns
    -------
    pv.PolyData
        The triangulated 2D mesh.

    Raises
    ------
    ValueError
        If the LINE cells cannot be extracted as paired vertex indices,
        or the geometry is not planar (z varies across vertices).

    """
    from mmgpy._generate import generate  # noqa: PLC0415
    from mmgpy._pyvista import (  # noqa: PLC0415
        _extract_lines_from_polydata,
        _refs_for_polydata_lines,
    )

    edges = _extract_lines_from_polydata(dataset)
    if edges is None:
        msg = "PolyData has line cells but no extractable LINE pairs"
        raise ValueError(msg)
    refs = _refs_for_polydata_lines(dataset, len(edges))
    points = np.asarray(dataset.points, dtype=np.float64)
    z_span = float(np.ptp(points[:, 2]))
    xy_span = float(np.ptp(points[:, :2]))
    if z_span > max(1e-9, 1e-6 * xy_span):
        msg = (
            "mmg2d.generate routing requires a planar (z=const) PolyData; "
            f"got z range {z_span:.3g} over xy span {xy_span:.3g}"
        )
        raise ValueError(msg)
    vertices = points[:, :2]
    return generate(vertices, edges, refs=refs, **options)


def _build_mesh_with_mmg_fields(dataset: pv.UnstructuredGrid | pv.PolyData) -> _Mesh:
    """Construct a ``Mesh`` from *dataset* with MMG fields pushed into the C++ impl.

    ``mmgpy._io.read`` deliberately strips the four MMG-recognized point_data
    keys (``metric``, ``displacement``, ``levelset``, ``tensor``) into a lazy
    source instead of forwarding them to MMG. The accessor's contract is the
    opposite: a user's ``dataset.point_data["metric"]`` is the source of truth
    for any subsequent operation. This helper bridges the gap by re-applying
    those fields through ``Mesh.__setitem__``, which routes them to the C++
    layer.

    Returns
    -------
    Mesh
        A fresh :class:`mmgpy._mesh.Mesh` with any reserved MMG fields
        already pushed through the C++ layer.

    """
    from mmgpy._io import _read_mesh_internal as _read_mesh  # noqa: PLC0415

    mesh = _read_mesh(dataset)
    for key in _MMG_FIELD_NAMES:
        if key not in dataset.point_data:
            continue
        arr = np.asarray(dataset.point_data[key], dtype=np.float64)
        # MMG's scalar metric / levelset bindings want an Nx1 array; PyVista
        # users naturally store these as 1D, so reshape on the way through.
        if arr.ndim == 1 and key in {"metric", "levelset"}:
            arr = arr.reshape(-1, 1)
        mesh[key] = arr
    return mesh


def _to_pyvista_with_user_fields(
    mesh: _Mesh,
) -> pv.UnstructuredGrid | pv.PolyData:
    """Convert *mesh* back to PyVista, restoring any non-MMG point_data.

    ``Mesh.to_pyvista`` only ships the geometry plus reference markers; user
    scalar/vector fields live in ``Mesh._user_fields``. The accessor exposes
    the dataset as the unit of state, so we copy those fields back onto the
    returned dataset (after a remesh-with-``transfer_fields`` they have been
    interpolated to the new vertex set).

    Returns
    -------
    pv.UnstructuredGrid or pv.PolyData
        The PyVista dataset with user fields re-attached where their
        length matches the new vertex count.

    """
    result = mesh.to_pyvista(include_refs=True, include_edges=True)
    n_points = result.n_points
    for name, arr in mesh.get_user_fields().items():
        if arr.shape[0] != n_points:
            logger.debug(
                "Dropping user field %r: length %d does not match remeshed "
                "vertex count %d. Pass transfer_fields=True to remesh() to "
                "interpolate user fields onto the new vertex set.",
                name,
                arr.shape[0],
                n_points,
            )
            continue
        result.point_data[name] = arr
    return result


# ---------------------------------------------------------------------------
# Constraint markers (required entities, corners, ridges, parallel)
# ---------------------------------------------------------------------------
#
# MMG's constraint API locks specific vertices / edges / triangles / tetrahedra
# in place during remeshing (the analogue of microgen's ``RequiredTriangles``
# trick used by ``remesh_keeping_boundaries_for_fem``). The C++ bindings expose
# these on ``MmgMesh`` / ``MmgMesh2D`` / ``MmgMeshS`` as ``set_required_*`` /
# ``set_corners`` / ``set_ridge_edges`` / ``set_parallel_*`` methods. The
# accessor surfaces them two ways:
#
# 1. **Per-call kwargs** on ``remesh()``, ``remesh_levelset()``, etc. — pass a
#    1D int array of 0-indexed entity ids (the binding does the +1 conversion
#    to MMG's 1-based indexing).
# 2. **Reserved data tags** on the dataset — set
#    ``dataset.point_data["mmg_required_vertices"]`` (etc.) to a length-N bool
#    array; the accessor reads these tags at remesh time. Useful for keeping
#    constraints with the mesh through ``copy()`` / file round-trip.
#
# Kwargs override tags, so a user can locally clear a tag with
# ``remesh(required_triangles=np.array([], dtype=np.int32))``.

# Reserved kwarg names; each maps to the matching ``MmgMesh*.set_<name>`` call.
_CONSTRAINT_KWARGS: tuple[str, ...] = (
    "required_vertices",
    "required_triangles",
    "required_edges",
    "required_tetrahedra",
    "corners",
    "ridge_edges",
    "parallel_triangles",
    "parallel_edges",
)

# Reserved point_data tag names → kwarg name (length-n_points bool arrays).
_POINT_TAG_TO_KWARG: dict[str, str] = {
    "mmg_required_vertices": "required_vertices",
    "mmg_corners": "corners",
}

# Reserved cell_data tag names → (kwarg name, cell type filter).
# Length-n_cells bool arrays; only the matching cell-type rows count.
_CELL_TAG_TO_KWARG: dict[str, tuple[str, pv.CellType]] = {
    "mmg_required_triangles": ("required_triangles", pv.CellType.TRIANGLE),
    "mmg_required_edges": ("required_edges", pv.CellType.LINE),
    "mmg_required_tetrahedra": ("required_tetrahedra", pv.CellType.TETRA),
    "mmg_ridge_edges": ("ridge_edges", pv.CellType.LINE),
    "mmg_parallel_triangles": ("parallel_triangles", pv.CellType.TRIANGLE),
    "mmg_parallel_edges": ("parallel_edges", pv.CellType.LINE),
}


def _per_type_indices_marked(
    dataset: pv.UnstructuredGrid | pv.PolyData,
    cell_type: int,
    mask: NDArray[np.bool_],
) -> NDArray[np.int32]:
    """Translate a length-n_cells bool mask to per-cell-type 0-indexed indices.

    PyVista numbers cells globally; MMG numbers each entity type separately
    (triangles 1..nt, tets 1..ne, edges 1..na). UnstructuredGrid carries
    explicit per-cell types in ``celltypes``, so we reduce via
    ``cumsum(types == cell_type) - 1``. PolyData stores cells in a fixed
    section order (verts, lines, polys, strips) — pick the matching slice
    of *mask* and return the local indices.

    Returns
    -------
    ndarray of int32
        Zero-indexed positions among cells of the requested type (an
        empty array when none of the matching cells are marked).

    """
    if isinstance(dataset, pv.PolyData):
        n_verts = int(dataset.n_verts)
        n_lines = int(dataset.n_lines)
        n_strips = int(dataset.n_strips)
        n_polys = int(dataset.n_cells) - n_verts - n_lines - n_strips
        if cell_type == pv.CellType.LINE:
            start, length = n_verts, n_lines
        elif cell_type in {pv.CellType.TRIANGLE, pv.CellType.QUAD}:
            start, length = n_verts + n_lines, n_polys
        elif cell_type == pv.CellType.VERTEX:
            start, length = 0, n_verts
        else:
            return np.array([], dtype=np.int32)
        if length <= 0:
            return np.array([], dtype=np.int32)
        section_mask = mask[start : start + length]
        return np.where(section_mask)[0].astype(np.int32, copy=False)

    types = np.asarray(dataset.celltypes)
    of_type = types == cell_type
    per_type_idx = np.cumsum(of_type) - 1
    matching = mask & of_type
    return per_type_idx[matching].astype(np.int32, copy=False)


def _collect_constraints_from_data(
    dataset: pv.UnstructuredGrid | pv.PolyData,
) -> dict[str, NDArray[np.int32]]:
    """Read reserved point_data / cell_data tags into kwarg-name → index map.

    Returns
    -------
    dict[str, ndarray of int32]
        Mapping from MMG constraint kwarg name to the (zero-indexed)
        per-entity indices marked by the dataset's reserved tag arrays.

    Raises
    ------
    ValueError
        If any reserved tag array does not match ``dataset.n_points`` or
        ``dataset.n_cells``.

    """
    out: dict[str, NDArray[np.int32]] = {}

    for tag_name, kwarg_name in _POINT_TAG_TO_KWARG.items():
        if tag_name not in dataset.point_data:
            continue
        mask = np.asarray(dataset.point_data[tag_name]).astype(bool, copy=False)
        if mask.shape[0] != dataset.n_points:
            msg = (
                f"point_data[{tag_name!r}] length {mask.shape[0]} does not "
                f"match dataset.n_points {dataset.n_points}"
            )
            raise ValueError(msg)
        out[kwarg_name] = np.where(mask)[0].astype(np.int32, copy=False)

    cell_tags_present = [
        (tag_name, kwarg_name, cell_type)
        for tag_name, (kwarg_name, cell_type) in _CELL_TAG_TO_KWARG.items()
        if tag_name in dataset.cell_data
    ]
    if not cell_tags_present:
        return out

    # For UnstructuredGrid we cache `celltypes` and per-cell-type cumsums
    # across all cell tags (the loop visits up to 6 tags but at most 3
    # distinct cell types). PolyData stays on the per-tag fast path in
    # `_per_type_indices_marked` since its slicing is already O(1) lookups.
    is_unstructured = isinstance(dataset, pv.UnstructuredGrid)
    types_arr = np.asarray(dataset.celltypes) if is_unstructured else None
    per_type_cache: dict[int, tuple[NDArray[np.bool_], NDArray[np.intp]]] = {}

    for tag_name, kwarg_name, cell_type in cell_tags_present:
        mask = np.asarray(dataset.cell_data[tag_name]).astype(bool, copy=False)
        if mask.shape[0] != dataset.n_cells:
            msg = (
                f"cell_data[{tag_name!r}] length {mask.shape[0]} does not "
                f"match dataset.n_cells {dataset.n_cells}"
            )
            raise ValueError(msg)

        if types_arr is None:
            out[kwarg_name] = _per_type_indices_marked(dataset, cell_type, mask)
            continue

        cached = per_type_cache.get(int(cell_type))
        if cached is None:
            of_type = types_arr == cell_type
            per_type_idx = np.cumsum(of_type) - 1
            cached = (of_type, per_type_idx)
            per_type_cache[int(cell_type)] = cached
        of_type, per_type_idx = cached
        matching = mask & of_type
        out[kwarg_name] = per_type_idx[matching].astype(np.int32, copy=False)

    return out


def _split_constraint_kwargs(
    options: dict[str, Any],
) -> dict[str, NDArray[np.int32]]:
    """Pop reserved constraint kwargs from ``options`` and normalize to int32.

    Returns
    -------
    dict[str, ndarray of int32]
        Mapping from constraint kwarg name to its contiguous index array.
        ``options`` is mutated in place: every key that was consumed is
        removed.

    """
    out: dict[str, NDArray[np.int32]] = {}
    for name in _CONSTRAINT_KWARGS:
        if name not in options:
            continue
        val = options.pop(name)
        if val is None:
            continue
        arr = np.ascontiguousarray(np.asarray(val).ravel(), dtype=np.int32)
        out[name] = arr
    return out


def _apply_constraint_markers(
    mesh: _Mesh,
    dataset: pv.UnstructuredGrid | pv.PolyData,
    explicit: dict[str, NDArray[np.int32]],
) -> None:
    """Apply MMG constraint markers from data tags + explicit kwargs.

    Tags on ``dataset`` are read first; ``explicit`` overrides them. Each
    marker is forwarded to the matching ``MmgMesh*.set_<name>`` binding.

    Raises
    ------
    ValueError
        If a constraint is not supported by this mesh kind's binding.

    """
    combined = _collect_constraints_from_data(dataset)
    combined.update(explicit)
    if not combined:
        return

    impl = mesh._impl  # noqa: SLF001
    for name, idx in combined.items():
        # Empty array clears the constraint: an explicit ``required_X=array([])``
        # in `explicit` overrides any tag in `combined` after the merge above,
        # then falls through to skipping the setter. Must run AFTER
        # `combined.update(explicit)` so the override semantics hold.
        if idx.size == 0:
            continue
        setter = getattr(impl, f"set_{name}", None)
        if setter is None:
            available = ", ".join(
                n for n in _CONSTRAINT_KWARGS if hasattr(impl, f"set_{n}")
            )
            msg = (
                f"Constraint {name!r} is not supported for this mesh kind "
                f"(available: {available})"
            )
            raise ValueError(msg)
        setter(idx)


_MMG_CONFIG_KEY_MULTI_MATERIALS = "mmg_multi_materials"
_MMG_CONFIG_KEY_LOCAL_PARAMETERS = "mmg_local_parameters"
_MMG_CONFIG_KEY_LS_BASE_REFERENCES = "mmg_ls_base_references"


def _apply_pending_mmg_config(
    mesh: _Mesh,
    dataset: pv.UnstructuredGrid | pv.PolyData,
) -> None:
    """Push multi-material / local-parameter / LS config from user_dict into MMG.

    The accessor methods ``set_multi_materials`` / ``set_local_parameters`` /
    ``set_ls_base_references`` stash their already-normalized specs in
    ``dataset.user_dict`` so the configuration survives the fresh ``Mesh``
    built on every accessor call. The data was validated when stashed, so we
    forward directly to the C++ binding without re-normalizing.
    """
    user_dict = dataset.user_dict
    materials = user_dict.get(_MMG_CONFIG_KEY_MULTI_MATERIALS)
    if materials is not None:
        mesh._impl.set_multi_materials(list(materials))  # noqa: SLF001
    parameters = user_dict.get(_MMG_CONFIG_KEY_LOCAL_PARAMETERS)
    if parameters is not None:
        mesh._impl.set_local_parameters(list(parameters))  # noqa: SLF001
    references = user_dict.get(_MMG_CONFIG_KEY_LS_BASE_REFERENCES)
    if references is not None:
        mesh._impl.set_ls_base_references(list(references))  # noqa: SLF001


def _apply_local_sizing_specs(
    mesh: _Mesh,
    specs: list[Mapping[str, Any]] | None,
) -> None:
    """Register sizing constraints from a list of dict specs and apply them.

    Each spec is a dict with a ``"shape"`` key (one of ``"sphere"``, ``"box"``,
    ``"cylinder"``, ``"from_point"``) plus the parameters that the matching
    ``Mesh.set_size_*`` method expects. ``Mesh.remesh`` auto-applies sizing,
    but the levelset/optimize/uniform variants do not, so we apply explicitly
    here for uniform behavior across all accessor methods.

    Raises
    ------
    ValueError
        If a spec's ``"shape"`` is not one of the supported values.

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

    Raises
    ------
    TypeError
        If ``dataset`` is not an :class:`pyvista.UnstructuredGrid` or
        :class:`pyvista.PolyData` (MMG only handles those two).

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
# Multi-sol field collection helpers
# ---------------------------------------------------------------------------


def _is_numeric_sol_array(arr: NDArray[Any]) -> bool:
    """Return True if *arr* is a numeric, non-boolean ndarray usable as a sol block.

    Returns
    -------
    bool
        ``True`` for numeric dtypes (int / float / complex) excluding
        boolean.

    """
    return np.issubdtype(arr.dtype, np.number) and not np.issubdtype(
        arr.dtype,
        np.bool_,
    )


def _is_valid_sol_shape(arr: NDArray[Any], dim: int) -> bool:
    """Return True if *arr*'s shape matches scalar / vector / tensor for *dim*.

    Returns
    -------
    bool
        ``True`` for 1D arrays or 2D arrays whose last dimension is 1
        (scalar), ``dim`` (vector), or ``dim * (dim + 1) // 2`` (tensor).

    """
    if arr.ndim == 1:
        return True
    if arr.ndim != 2:  # noqa: PLR2004  -- sol arrays are 1D scalar or 2D
        return False
    n_cols = arr.shape[1]
    tensor_size = dim * (dim + 1) // 2
    return n_cols in {1, dim, tensor_size}


# PyVista-reserved point/cell arrays that match valid sol shapes but aren't
# physics solutions; skipped during auto-collection.
_PV_RESERVED_ARRAYS = frozenset({"Normals", "TCoords"})


def _auto_collect_sol_arrays(
    data: Mapping[str, NDArray[Any]],
    n_entities: int,
    *,
    dim: int,
) -> dict[str, NDArray[np.float64]]:
    """Auto-collect numeric arrays matching ``n_entities`` and a sol shape.

    Keeps only arrays whose shape maps to a valid scalar / vector / tensor
    layout for ``dim``; skips ``mmg_*`` constraint tags and PyVista-reserved
    arrays (``Normals``, ``TCoords``).

    Returns
    -------
    dict[str, ndarray of float64]
        The kept arrays cast to ``float64``.

    """
    out: dict[str, NDArray[np.float64]] = {}
    if n_entities <= 0:
        return out
    for name, raw in data.items():
        if name in _PV_RESERVED_ARRAYS or name.startswith("mmg_"):
            continue
        arr = np.asarray(raw)
        if (
            arr.shape[0] == n_entities
            and _is_numeric_sol_array(arr)
            and _is_valid_sol_shape(arr, dim)
        ):
            out[name] = arr.astype(np.float64, copy=False)
    return out


def _explicit_collect_sol_arrays(
    data: Mapping[str, NDArray[Any]],
    n_entities: int,
    keys: list[str],
    *,
    dim: int,
) -> dict[str, NDArray[np.float64]]:
    """Validate and pull each named key from ``data``.

    Raises on any mismatch (missing key, wrong length, non-numeric dtype,
    bad shape) so the caller's intent is honored exactly.

    Returns
    -------
    dict[str, ndarray of float64]
        The requested arrays cast to ``float64``.

    Raises
    ------
    ValueError
        If the dataset has no eligible entities, a requested key is
        missing, an array's length differs from ``n_entities``, the
        dtype is non-numeric, or the shape does not match a scalar /
        vector / tensor layout for ``dim``.

    """
    if n_entities <= 0:
        msg = (
            f"save_all_sols: dataset has no entities of the matching kind "
            f"but {keys!r} were requested"
        )
        raise ValueError(msg)

    out: dict[str, NDArray[np.float64]] = {}
    for name in keys:
        if name not in data:
            msg = f"save_all_sols: requested key {name!r} not found"
            raise ValueError(msg)
        arr = np.asarray(data[name])
        if arr.shape[0] != n_entities:
            msg = (
                f"save_all_sols: requested key {name!r} has length "
                f"{arr.shape[0]}, expected {n_entities}"
            )
            raise ValueError(msg)
        if not _is_numeric_sol_array(arr):
            msg = (
                f"save_all_sols: requested key {name!r} has dtype {arr.dtype}; "
                f"sol blocks must be numeric (non-boolean)"
            )
            raise ValueError(msg)
        if not _is_valid_sol_shape(arr, dim):
            tensor_size = dim * (dim + 1) // 2
            msg = (
                f"save_all_sols: requested key {name!r} has shape {arr.shape}; "
                f"expected scalar (N,) / (N,1), vector (N,{dim}), or tensor "
                f"(N,{tensor_size}) at dim={dim}"
            )
            raise ValueError(msg)
        out[name] = arr.astype(np.float64, copy=False)
    return out


def _primary_cell_count(dataset: pv.UnstructuredGrid | pv.PolyData) -> int:
    """Return the count of the dataset's primary cell type.

    For an ``UnstructuredGrid`` we count TETRA cells (3D meshes after the
    mmg round-trip); for a ``PolyData`` we count its polys (triangles in
    every mmg surface / 2D context). Falls back to total cell count when
    no specific signal exists so the caller's length check still works.

    Mixed-cell grids (tets + tris in one UnstructuredGrid) are not
    supported: only the dominant type's cell_data round-trips. MMG itself
    assumes a homogeneous mesh, so callers should split mixed datasets
    before going through the .sol path.

    Returns
    -------
    int
        Count of the dominant cell type, or ``n_cells`` as a fallback.

    """
    if isinstance(dataset, pv.UnstructuredGrid):
        types = np.asarray(dataset.celltypes)
        tet_count = int(np.sum(types == pv.CellType.TETRA))
        if tet_count > 0:
            return tet_count
        tri_count = int(np.sum(types == pv.CellType.TRIANGLE))
        if tri_count > 0:
            return tri_count
    if isinstance(dataset, pv.PolyData):
        n_polys = (
            int(dataset.n_cells)
            - int(dataset.n_verts)
            - int(dataset.n_lines)
            - int(dataset.n_strips)
        )
        if n_polys > 0:
            return n_polys
    return int(dataset.n_cells)


def _coerce_metric_kwarg(
    metric: NDArray[np.float64],
    n_points: int,
) -> NDArray[np.float64]:
    """Validate and coerce a user-supplied metric to ``(n_points, k)``.

    Accepts a 1D scalar array of length ``n_points`` (reshaped to ``(n, 1)``)
    or a 2D array with last dimension 1 (scalar), 3 (2D tensor), or 6 (3D
    tensor).

    Returns
    -------
    ndarray of float64
        The metric reshaped to a contiguous ``(n_points, k)`` array.

    Raises
    ------
    ValueError
        If the shape does not match ``(n_points,)``, ``(n_points, 1)``,
        ``(n_points, 3)``, or ``(n_points, 6)``.

    """
    arr = np.asarray(metric, dtype=np.float64)
    if arr.ndim == 1:
        arr = arr.reshape(-1, 1)
    if arr.ndim != 2 or arr.shape[0] != n_points:  # noqa: PLR2004
        msg = (
            f"metric must have shape (n_points,), (n_points, 1), "
            f"(n_points, 3) or (n_points, 6); got shape "
            f"{tuple(np.asarray(metric).shape)} for n_points={n_points}"
        )
        raise ValueError(msg)
    if arr.shape[1] not in {1, 3, 6}:
        msg = (
            f"metric last dimension must be 1 (scalar), 3 (2D tensor) "
            f"or 6 (3D tensor); got {arr.shape[1]}"
        )
        raise ValueError(msg)
    return arr


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
        from mmgpy._io import _read_mesh_internal as _read_mesh  # noqa: PLC0415

        return _read_mesh(self._dataset).kind

    def remesh(
        self,
        opts: MmgOptions | None = None,
        *,
        metric: NDArray[np.float64] | None = None,
        local_sizing: list[Mapping[str, Any]] | None = None,
        **options: Any,  # noqa: ANN401  -- forwarded to Mesh.remesh; see docstring
    ) -> pv.UnstructuredGrid | pv.PolyData:
        """Remesh the underlying dataset and return a new PyVista dataset.

        Parameters
        ----------
        opts : Mmg2DOptions | Mmg3DOptions | MmgSOptions, optional
            Typed options object. Mutually exclusive with ``**options``.
        metric : ndarray, optional
            Per-vertex size map driving the remeshing. Shape ``(n, 1)``
            (or ``(n,)``) for an isotropic scalar target, or ``(n, 3)`` /
            ``(n, 6)`` for an anisotropic tensor (2D / 3D). Overrides any
            ``point_data["metric"]`` on the dataset; the dataset itself
            is not mutated.
        local_sizing : list of dict, optional
            Sizing constraints applied before remeshing. Each dict has a
            ``"shape"`` key (``"sphere"``, ``"box"``, ``"cylinder"``, or
            ``"from_point"``) plus the parameters of the matching
            ``Mesh.set_size_*`` method.
        **options : object
            Forwarded to :meth:`mmgpy.Mesh.remesh`. Common knobs include
            ``hmin``, ``hmax``, ``hsiz``, and ``hausd``. The reserved
            kwargs ``required_vertices``, ``required_triangles``,
            ``required_edges``, ``required_tetrahedra``, ``corners``,
            ``ridge_edges``, ``parallel_triangles``, ``parallel_edges``
            (each a 1D int array of 0-indexed entity ids) lock the
            corresponding entities in place during remeshing. Equivalent
            tags can be set on the dataset via
            ``point_data["mmg_required_vertices"]``,
            ``cell_data["mmg_required_triangles"]``, etc. — bool arrays
            of the matching length. Kwargs override tags.

        Returns
        -------
        pv.UnstructuredGrid or pv.PolyData
            Tetrahedral results come back as ``UnstructuredGrid``;
            2D and surface results as ``PolyData``. Element references
            survive in ``cell_data["refs"]`` and MMG edges in ``LINE``
            cells.

        Raises
        ------
        TypeError
            If both ``opts`` and ``**options`` are supplied.
        ValueError
            On the LINE-only auto-routed path, when ``local_sizing`` or
            ``metric`` is supplied (neither is supported there).

        Notes
        -----
        If the dataset is a ``PolyData`` carrying only ``LINE`` cells,
        ``remesh()`` is auto-routed through :func:`mmgpy.mmg2d.generate`
        to triangulate the outline. The dataset must be planar
        (constant ``z``); ``local_sizing`` is not supported on this path.

        """
        if isinstance(self._dataset, pv.PolyData) and _is_line_only_polydata(
            self._dataset,
        ):
            if opts is not None:
                if options:
                    msg = "pass either an options object or kwargs, not both"
                    raise TypeError(msg)
                options = dict(opts.to_dict())
            if local_sizing:
                msg = (
                    "local_sizing is not supported when generating a 2D mesh "
                    "from a line-only PolyData"
                )
                raise ValueError(msg)
            if metric is not None:
                msg = (
                    "metric is not supported when generating a 2D mesh "
                    "from a line-only PolyData"
                )
                raise ValueError(msg)
            return _generate_from_line_polydata(self._dataset, options)

        constraints = _split_constraint_kwargs(options)
        mesh = _build_mesh_with_mmg_fields(self._dataset)
        if metric is not None:
            # Smart routing in Mesh.__setitem__ dispatches to the scalar or
            # tensor channel based on shape; overrides any metric loaded
            # from point_data above without mutating self._dataset.
            mesh["metric"] = _coerce_metric_kwarg(
                metric,
                int(self._dataset.n_points),
            )
        _apply_constraint_markers(mesh, self._dataset, constraints)
        _apply_local_sizing_specs(mesh, local_sizing)
        _apply_pending_mmg_config(mesh, self._dataset)
        # ``renum`` is popped + handled inside ``Mesh.remesh`` (one-time
        # FutureWarning + in-place reverse Cuthill-McKee). Forwarding it
        # through here keeps the PyVista-side path single-pass.
        if opts is not None:
            if options:
                msg = "pass either an options object or kwargs, not both"
                raise TypeError(msg)
            mesh.remesh(opts)
        else:
            mesh.remesh(**options)
        return _to_pyvista_with_user_fields(mesh)

    def remesh_lagrangian(
        self,
        displacement: NDArray[np.float64],
        **options: Any,  # noqa: ANN401  -- forwarded to .mmg.move
    ) -> pv.UnstructuredGrid | pv.PolyData:
        """Forward to :meth:`move` (deprecated alias).

        Historically this method called MMG's ELAS-bound Lagrangian path; the
        bundled MMG is built ``USE_ELAS=OFF``, so it never produced anything
        useful. The accessor now forwards to :meth:`move`, which works on
        every mesh kind via the pure-Python Laplacian propagator (or the
        optional fedoo-backed elasticity solver). The shim exists only to
        avoid breaking callers and will be removed in a future release.

        Returns
        -------
        pv.UnstructuredGrid or pv.PolyData
            The moved-and-remeshed dataset.

        """
        warnings.warn(
            "dataset.mmg.remesh_lagrangian() is deprecated; use "
            "dataset.mmg.move() instead. The two are now equivalent — both "
            "go through the pure-Python Laplacian / fedoo elasticity "
            "propagator since the ELAS-bound MMG path is no longer linked.",
            DeprecationWarning,
            stacklevel=2,
        )
        return self.move(displacement, **options)

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
            Forwarded to :meth:`mmgpy.Mesh.remesh_levelset`. The reserved
            constraint kwargs documented on :meth:`remesh` are honored
            here as well.

        Returns
        -------
        pv.UnstructuredGrid or pv.PolyData
            The level-set-discretized dataset.

        """
        constraints = _split_constraint_kwargs(options)
        mesh = _build_mesh_with_mmg_fields(self._dataset)
        _apply_constraint_markers(mesh, self._dataset, constraints)
        _apply_local_sizing_specs(mesh, local_sizing)
        _apply_pending_mmg_config(mesh, self._dataset)
        mesh.remesh_levelset(levelset, **options)
        return _to_pyvista_with_user_fields(mesh)

    def remesh_optimize(
        self,
        **options: Any,  # noqa: ANN401  -- forwarded to Mesh.remesh_optimize
    ) -> pv.UnstructuredGrid | pv.PolyData:
        """Quality optimization without topology changes.

        No vertices are inserted or removed; only positions move to improve
        element quality. Equivalent to ``remesh(optim=1, noinsert=1)``. The
        reserved constraint kwargs documented on :meth:`remesh` are honored.

        Returns
        -------
        pv.UnstructuredGrid or pv.PolyData
            The optimized dataset.

        """
        constraints = _split_constraint_kwargs(options)
        mesh = _build_mesh_with_mmg_fields(self._dataset)
        _apply_constraint_markers(mesh, self._dataset, constraints)
        _apply_pending_mmg_config(mesh, self._dataset)
        mesh.remesh_optimize(**options)
        return _to_pyvista_with_user_fields(mesh)

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
            Forwarded to :meth:`mmgpy.Mesh.remesh_uniform`. The reserved
            constraint kwargs documented on :meth:`remesh` are honored.

        Returns
        -------
        pv.UnstructuredGrid or pv.PolyData
            The uniformly remeshed dataset.

        """
        constraints = _split_constraint_kwargs(options)
        mesh = _build_mesh_with_mmg_fields(self._dataset)
        _apply_constraint_markers(mesh, self._dataset, constraints)
        _apply_pending_mmg_config(mesh, self._dataset)
        mesh.remesh_uniform(size, **options)
        return _to_pyvista_with_user_fields(mesh)

    def move(
        self,
        displacement: NDArray[np.float64],
        *,
        boundary_mask: NDArray[np.bool_] | None = None,
        propagate: bool = True,
        propagation_method: str = "laplacian",
        n_steps: int = 1,
        **remesh_options: Any,  # noqa: ANN401  -- forwarded to mesh.remesh
    ) -> pv.UnstructuredGrid | pv.PolyData:
        """Apply a displacement field and remesh to maintain quality.

        Returns a fresh dataset; the input is not modified.

        Parameters
        ----------
        displacement : ndarray
            Per-vertex displacement, shape ``(n_points, dim)``. When
            ``boundary_mask`` is given and ``propagate`` is True, only
            boundary entries need to be correct.
        boundary_mask : ndarray of bool, optional
            Marks vertices with prescribed displacement. ``None`` treats
            every vertex as prescribed.
        propagate : bool, default True
            With ``boundary_mask``, propagate boundary values into the
            interior using ``propagation_method``.
        propagation_method : {"laplacian", "elasticity"}, default "laplacian"
            How to propagate boundary displacements into the interior.
            ``"elasticity"`` solves a linear elasticity problem via the
            optional ``fedoo`` package (``pip install fedoo``); it produces
            physically meaningful displacements better suited to large
            deformations and complex geometries.
        n_steps : int, default 1
            Number of incremental sub-steps. Use more steps for large
            displacements to avoid mesh inversion.
        **remesh_options : object
            Forwarded to ``mesh.remesh()`` between sub-steps (``hmax``,
            ``hmin``, ``hgrad``, ``verbose``, ...).

        Returns
        -------
        pv.UnstructuredGrid or pv.PolyData
            A new dataset of the same kind as the input.

        """
        from mmgpy.lagrangian import move_mesh as _move_mesh  # noqa: PLC0415

        mesh = _build_mesh_with_mmg_fields(self._dataset)
        _move_mesh(
            mesh,
            displacement,
            boundary_mask=boundary_mask,
            propagate=propagate,
            propagation_method=propagation_method,
            n_steps=n_steps,
            **remesh_options,
        )
        return _to_pyvista_with_user_fields(mesh)

    def set_local_parameters(
        self,
        parameters: Sequence[Mapping[str, Any]],
    ) -> None:
        """Stash region-specific sizing parameters for the next ``remesh()``.

        Mirrors :meth:`mmgpy.Mesh.set_local_parameters`. The spec list is
        stored in ``dataset.user_dict["mmg_local_parameters"]`` and applied
        to the underlying ``MmgMesh`` at the start of every subsequent
        ``remesh`` / ``remesh_levelset`` / ``remesh_optimize`` /
        ``remesh_uniform`` call. Pass an empty list to clear.
        """
        from mmgpy._mesh import _normalize_local_parameters  # noqa: PLC0415

        if parameters:
            normalized = _normalize_local_parameters(parameters, self.kind)
            self._dataset.user_dict[_MMG_CONFIG_KEY_LOCAL_PARAMETERS] = normalized
        elif _MMG_CONFIG_KEY_LOCAL_PARAMETERS in self._dataset.user_dict:
            del self._dataset.user_dict[_MMG_CONFIG_KEY_LOCAL_PARAMETERS]

    def set_multi_materials(
        self,
        materials: Sequence[Mapping[str, Any]],
    ) -> None:
        """Stash multi-material configuration for the next ``remesh_levelset()``.

        Mirrors :meth:`mmgpy.Mesh.set_multi_materials`. The spec list is
        stored in ``dataset.user_dict["mmg_multi_materials"]`` and applied
        to the underlying ``MmgMesh`` at the start of every subsequent
        accessor remesh call. Pass an empty list to clear.
        """
        from mmgpy._mesh import _normalize_multi_materials  # noqa: PLC0415

        if materials:
            normalized = _normalize_multi_materials(materials)
            self._dataset.user_dict[_MMG_CONFIG_KEY_MULTI_MATERIALS] = normalized
        elif _MMG_CONFIG_KEY_MULTI_MATERIALS in self._dataset.user_dict:
            del self._dataset.user_dict[_MMG_CONFIG_KEY_MULTI_MATERIALS]

    def set_ls_base_references(self, references: Sequence[int]) -> None:
        """Restrict level-set splitting to the given references on the next call.

        Mirrors :meth:`mmgpy.Mesh.set_ls_base_references`. The list is
        stored in ``dataset.user_dict["mmg_ls_base_references"]`` and applied
        to the underlying ``MmgMesh`` at the start of every subsequent
        accessor remesh call. Pass an empty list to clear.
        """
        from mmgpy._mesh import _normalize_ls_base_references  # noqa: PLC0415

        if references:
            normalized = _normalize_ls_base_references(references)
            self._dataset.user_dict[_MMG_CONFIG_KEY_LS_BASE_REFERENCES] = normalized
        elif _MMG_CONFIG_KEY_LS_BASE_REFERENCES in self._dataset.user_dict:
            del self._dataset.user_dict[_MMG_CONFIG_KEY_LS_BASE_REFERENCES]

    def build_size_map(self, *, aniso: bool = False) -> NDArray[np.float64]:
        """Build a size map from edges incident to each vertex.

        Wraps MMG's ``doSol`` entry point. The result is also stored on
        the dataset as ``point_data["metric"]`` so subsequent ``remesh()``
        calls pick it up as the target sizemap.

        Parameters
        ----------
        aniso : bool, default False
            If False, build an isotropic size map of shape
            ``(n_points, 1)``. If True, build the anisotropic
            mesh-implied metric tensor (shape ``(n_points, 6)`` for 3D /
            surface meshes, ``(n_points, 3)`` for 2D meshes). Scaling
            the tensor by ``c`` rescales target edge lengths by
            ``1/sqrt(c)``.

        Returns
        -------
        ndarray of float64
            The freshly built size map, also stored on the dataset as
            ``point_data["metric"]``.

        """
        mesh = _build_mesh_with_mmg_fields(self._dataset)
        sizes = mesh.build_size_map(aniso=aniso)
        self._dataset.point_data["metric"] = sizes if aniso else sizes.reshape(-1)
        return sizes

    def clean_iso_surface(self) -> pv.UnstructuredGrid | pv.PolyData:
        """Remove isolated triangles / edges from a level-set discretization.

        Wraps ``MMG3D_Clean_isoSurf`` / ``MMGS_Clean_isoSurf``. Returns a
        fresh dataset; the input is not modified. Not available on 2D
        meshes, MMG2D has no equivalent entry point.

        Returns
        -------
        pv.UnstructuredGrid or pv.PolyData
            The cleaned dataset with the same vertex set as the input
            and ``cell_data`` dropped (see Notes).

        Notes
        -----
        The vertex set is preserved, so ``point_data`` flows through to the
        returned dataset. ``cell_data`` is dropped: ``Clean_isoSurf`` removes
        triangles/edges, so any positional cell array on the input would no
        longer align with the cleaned topology. A warning is emitted when
        the input carries ``cell_data`` so the loss is not silent. The
        underlying binding rejects ``TRIANGULAR_2D`` inputs.

        """
        if len(self._dataset.cell_data) > 0:
            warnings.warn(
                "clean_iso_surface() drops cell_data: Clean_isoSurf removes "
                "triangles/edges, so positional cell arrays would no longer "
                f"align with the cleaned mesh. Lost keys: "
                f"{sorted(self._dataset.cell_data.keys())}.",
                UserWarning,
                stacklevel=2,
            )
        mesh = _build_mesh_with_mmg_fields(self._dataset)
        mesh.clean_iso_surface()
        return _to_pyvista_with_user_fields(mesh)

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

    def load_all_sols(self, path: str | Path) -> None:
        """Read every solution block from a Medit ``.sol`` file.

        Modifies the dataset in place. ``SolAtVertices`` blocks land in
        ``point_data``; ``SolAtTriangles`` / ``SolAtTetrahedra`` blocks
        land in ``cell_data``.

        Generated key names follow the existing single-channel reader:
        ``solution_i`` for scalar blocks, ``vector_i`` / ``tensor_i`` for
        vector / tensor blocks, and a ``@vertices`` / ``@triangles`` /
        ``@tetrahedra`` suffix to disambiguate location.

        Binary ``.solb`` is not supported here. MMG's binary writer
        interleaves stray newlines between values (see Mmg #commit-list),
        so even single-channel ``.solb`` round-trips return garbage; the
        multi-sol path inherits the same defect. Route binary I/O through
        the lower-level ``Mesh.load_all_sols`` if you must, but expect
        broken data on the way back in.

        Parameters
        ----------
        path : str or Path
            Source ``.sol`` text file.

        """
        sol_path = Path(path)
        if sol_path.suffix.lower() == ".solb":
            msg = (
                "Binary .solb files are not supported via "
                "mesh.mmg.load_all_sols() — MMG's .solb round-trip is "
                "broken at the library level."
            )
            raise NotImplementedError(msg)
        _attach_sol_fields(self._dataset, sol_path)

    def save_all_sols(
        self,
        path: str | Path,
        *,
        point_keys: list[str] | None = None,
        cell_keys: list[str] | None = None,
    ) -> None:
        """Write multiple solution blocks to a Medit ``.sol``/``.solb`` file.

        Each numeric ``point_data`` array becomes a ``SolAtVertices`` block;
        each numeric ``cell_data`` array becomes a ``SolAtTriangles`` /
        ``SolAtTetrahedra`` block. Block type (scalar / vector / tensor)
        is inferred from each array's shape against the mesh dimension.

        Parameters
        ----------
        path : str or Path
            Destination file; ``.sol`` (text) or ``.solb`` (binary).
        point_keys : list of str, optional
            Restrict to these ``point_data`` keys. Defaults to every
            numeric array of length ``n_points`` whose name doesn't start
            with ``mmg_`` (reserved constraint tags).
        cell_keys : list of str, optional
            Restrict to these ``cell_data`` keys. Defaults to every
            numeric array whose length matches the count of the mesh's
            primary cell type (triangles for 2D / surface, tetrahedra
            for 3D). Cell blocks require a text ``.sol`` destination —
            ``.solb`` only carries vertex blocks through MMG's C API,
            so cell_keys for a ``.solb`` target raises.

        Raises
        ------
        NotImplementedError
            If ``path`` is a binary ``.solb`` file.
        ValueError
            If no eligible point or cell arrays are available to write.

        """
        from mmgpy._mesh import MeshKind  # noqa: PLC0415
        from mmgpy._sol import write_sol_file  # noqa: PLC0415

        sol_path = Path(path)
        if sol_path.suffix.lower() == ".solb":
            msg = (
                "Binary .solb files are not supported via "
                "mesh.mmg.save_all_sols() — MMG's .solb writer interleaves "
                "stray newlines that break round-trip. Use .sol (text)."
            )
            raise NotImplementedError(msg)

        mesh = _build_mesh_with_mmg_fields(self._dataset)
        dim = mesh.solution_dim
        # PyVista's DataSetAttributes is dict-like but doesn't formally
        # implement Mapping; the cast keeps the helper's static type intact.
        point_data = cast("Mapping[str, NDArray[Any]]", self._dataset.point_data)
        cell_data = cast("Mapping[str, NDArray[Any]]", self._dataset.cell_data)
        cell_count = _primary_cell_count(self._dataset)
        point_arrays = (
            _explicit_collect_sol_arrays(
                point_data,
                self._dataset.n_points,
                point_keys,
                dim=dim,
            )
            if point_keys is not None
            else _auto_collect_sol_arrays(point_data, self._dataset.n_points, dim=dim)
        )
        cell_arrays = (
            _explicit_collect_sol_arrays(cell_data, cell_count, cell_keys, dim=dim)
            if cell_keys is not None
            else _auto_collect_sol_arrays(cell_data, cell_count, dim=dim)
        )

        if not point_arrays and not cell_arrays:
            msg = (
                "save_all_sols: no eligible point_data or cell_data arrays "
                "to write; populate the dataset or pass point_keys/cell_keys."
            )
            raise ValueError(msg)

        primary_location: _SolLocation = (
            "tetrahedra" if mesh.kind == MeshKind.TETRAHEDRAL else "triangles"
        )
        fields: list[tuple[str, NDArray[np.float64], _SolLocation]] = [
            (name, np.ascontiguousarray(arr, dtype=np.float64), "vertices")
            for name, arr in point_arrays.items()
        ]
        fields.extend(
            (name, np.ascontiguousarray(arr, dtype=np.float64), primary_location)
            for name, arr in cell_arrays.items()
        )
        write_sol_file(sol_path, fields, dim)

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

        Returns
        -------
        bool or ValidationReport
            A bool when ``detailed=False`` (default), otherwise a
            :class:`mmgpy.ValidationReport` with full diagnostics.

        """
        from mmgpy._io import _read_mesh_internal as _read_mesh  # noqa: PLC0415

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

        Returns
        -------
        float
            MMG's in-radius-ratio quality in ``[0, 1]``.

        """
        from mmgpy._io import _read_mesh_internal as _read_mesh  # noqa: PLC0415

        return _read_mesh(self._dataset).get_element_quality(idx)

    def element_qualities(self) -> NDArray[np.float64]:
        """Return MMG in-radius-ratio quality for every element.

        Returns
        -------
        ndarray of float64
            One quality value per element, each in ``[0, 1]``.

        """
        from mmgpy._io import _read_mesh_internal as _read_mesh  # noqa: PLC0415

        return _read_mesh(self._dataset).get_element_qualities()

    def adjacent_elements(self, idx: int) -> NDArray[np.int32]:
        """Return MMG-adjacency neighbors of element *idx* (1-indexed).

        Distinct from :meth:`pyvista.DataSet.cell_neighbors`, which uses
        VTK's 0-based topology. Useful when migrating code that relied on
        ``Mesh.get_adjacent_elements``.

        Returns
        -------
        ndarray of int32
            1-indexed element neighbours, as MMG reports them.

        """
        from mmgpy._io import _read_mesh_internal as _read_mesh  # noqa: PLC0415

        return _read_mesh(self._dataset).get_adjacent_elements(idx)

    def vertex_neighbors(self, idx: int) -> NDArray[np.int32]:
        """Return MMG-adjacency neighbors of vertex *idx* (1-indexed).

        Distinct from :meth:`pyvista.DataSet.point_neighbors`, which uses
        VTK's 0-based topology. Useful when migrating code that relied on
        ``Mesh.get_vertex_neighbors``.

        Returns
        -------
        ndarray of int32
            1-indexed vertex neighbours, as MMG reports them.

        """
        from mmgpy._io import _read_mesh_internal as _read_mesh  # noqa: PLC0415

        return _read_mesh(self._dataset).get_vertex_neighbors(idx)

    def reorder_cuthill_mckee(
        self,
        *,
        symmetric_mode: bool = True,
    ) -> pv.UnstructuredGrid | pv.PolyData:
        """Return a copy of the dataset reordered via reverse Cuthill-McKee.

        Replaces MMG's SCOTCH-based ``renum=1``, which the bundled MMG
        cannot run. See :func:`mmgpy.reorder_cuthill_mckee` for details.

        Returns
        -------
        pv.UnstructuredGrid or pv.PolyData
            A reordered copy of the dataset.

        """
        from mmgpy._reorder import reorder_cuthill_mckee  # noqa: PLC0415

        return reorder_cuthill_mckee(self._dataset, symmetric_mode=symmetric_mode)

    def center_of_mass(self) -> NDArray[np.float64]:
        """Return the volume-weighted (3D) or area-weighted (2D/surface) centroid.

        Distinct from :attr:`pyvista.DataSet.center`, which is the
        arithmetic mean of point coordinates without volume/area
        weighting.

        Returns
        -------
        ndarray of float64
            The weighted centroid coordinates.

        """
        from mmgpy._io import _read_mesh_internal as _read_mesh  # noqa: PLC0415

        return _read_mesh(self._dataset).get_center_of_mass()


__all__ = ["MmgAccessor", "read_mesh", "write_mesh"]
