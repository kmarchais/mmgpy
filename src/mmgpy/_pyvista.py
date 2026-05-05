"""PyVista integration for mmgpy mesh classes.

This module provides conversion functions between PyVista mesh types
and mmgpy mesh classes.

Example:
    >>> import pyvista as pv
    >>> from mmgpy import Mesh
    >>>
    >>> # Load mesh and convert to mmgpy
    >>> grid = pv.read("mesh.vtk")
    >>> mesh = Mesh(grid)
    >>>
    >>> # Remesh and convert back
    >>> mesh.remesh(hmax=0.1)
    >>> result = mesh.to_pyvista()

"""

from __future__ import annotations

import logging
from typing import TYPE_CHECKING, overload

import numpy as np
import pyvista as pv

from mmgpy._mmgpy import MmgMesh2D, MmgMesh3D, MmgMeshS

logger = logging.getLogger("mmgpy")

if TYPE_CHECKING:
    from collections.abc import Mapping
    from typing import Any

    from numpy.typing import NDArray

    CellsDict = Mapping[Any, Any]

_DIMS_2D = 2
_DIMS_3D = 3
_TRIANGLE_VERTS = 3
_2D_DETECTION_TOLERANCE = 1e-8

_TRIANGULATION_WARNING = (
    "Input mesh contains non-triangular elements (quads, polygons). "
    "Converting to triangles. Note: output will always be triangular "
    "as MMG only supports triangular elements."
)

_REF_FIELDS = ("refs", "gmsh:physical", "medit:ref")
_LINE_VERTS = 2


def _all_faces_are_triangles(mesh: pv.PolyData) -> bool:
    """Return True if every polygonal face in the mesh has 3 vertices."""
    faces = np.asarray(mesh.faces)
    i = 0
    while i < len(faces):
        n_verts = int(faces[i])
        if n_verts != _TRIANGLE_VERTS:
            return False
        i += n_verts + 1
    return True


def _strip_lines(mesh: pv.PolyData) -> pv.PolyData:
    """Return `mesh` without its line cells.

    Used before `triangulate()` because PyVista's triangulate corrupts
    cell_data alignment when both line and face cells are present.

    Fast path: if the mesh has no line cells, the original object is
    returned unchanged (no copy). Otherwise a copy is returned with
    `lines` cleared and any per-cell `cell_data` trimmed to drop the
    entries that belonged to the removed lines (PyVista does not do
    this automatically). Callers must not mutate the result.
    """
    if not hasattr(mesh, "lines") or len(np.asarray(mesh.lines)) == 0:
        return mesh
    n_verts = int(mesh.n_verts)
    n_lines = int(mesh.n_lines)
    n_cells_original = int(mesh.n_cells)
    stripped = mesh.copy()
    stripped.lines = np.array([], dtype=np.int32)
    for key in list(stripped.cell_data):
        arr = np.asarray(stripped.cell_data[key])
        if arr.shape[0] == n_cells_original:
            stripped.cell_data[key] = np.concatenate(
                [arr[:n_verts], arr[n_verts + n_lines :]],
            )
    return stripped


def _triangulate_if_needed(mesh: pv.PolyData) -> tuple[pv.PolyData, bool]:
    """Triangulate mesh if it contains non-triangular faces.

    Parameters
    ----------
    mesh : pv.PolyData
        Input mesh that may contain quads or other polygons.

    Returns
    -------
    tuple[pv.PolyData, bool]
        Tuple of (triangulated_mesh, was_triangulated).
        If mesh was already all triangles, returns (mesh, False).
        Line cells are dropped before triangulation since the caller
        is expected to have extracted them already.

    """
    if mesh.n_cells == 0:
        return mesh, False

    if mesh.is_all_triangles:
        return mesh, False

    if _all_faces_are_triangles(mesh):
        # All polygonal faces are already triangles, but the mesh has line
        # cells too. Drop those (the caller has already extracted them via
        # `_extract_edges`) so subsequent code only sees triangles.
        return _strip_lines(mesh), False

    triangulated = _strip_lines(mesh).triangulate()
    return triangulated, True


def _is_2d_mesh(points: NDArray[np.floating]) -> bool:
    """Check if points are essentially 2D (z coordinates are zero or near-zero)."""
    if points.shape[1] == _DIMS_2D:
        return True
    if points.shape[1] == _DIMS_3D:
        z_coords = points[:, 2]
        return bool(np.allclose(z_coords, 0, atol=_2D_DETECTION_TOLERANCE))
    return False


def _extract_triangles_from_polydata(mesh: pv.PolyData) -> NDArray[np.int32]:
    """Extract triangle connectivity from PolyData faces array."""
    if hasattr(mesh, "cells_dict") and pv.CellType.TRIANGLE in mesh.cells_dict:
        return mesh.cells_dict[pv.CellType.TRIANGLE].astype(np.int32)

    faces = mesh.faces
    if len(faces) == 0:
        msg = "PolyData has no faces"
        raise ValueError(msg)

    triangles = []
    i = 0
    while i < len(faces):
        n_verts = faces[i]
        if n_verts != _TRIANGLE_VERTS:
            msg = f"Expected triangles (3 vertices), got {n_verts}-vertex polygon"
            raise ValueError(msg)
        triangles.append(faces[i + 1 : i + 4])
        i += n_verts + 1

    return np.array(triangles, dtype=np.int32)


def _extract_lines_from_polydata(mesh: pv.PolyData) -> NDArray[np.int32] | None:
    """Extract line connectivity from a PolyData.lines stream.

    Returns None if the mesh has no line cells.
    """
    if not hasattr(mesh, "lines"):
        return None
    raw = np.asarray(mesh.lines)
    if raw.size == 0:
        return None
    edges: list[NDArray[np.int32]] = []
    i = 0
    while i < len(raw):
        n_verts = int(raw[i])
        if n_verts != _LINE_VERTS:
            # Polylines (n>2) are not supported by MMG; skip them.
            i += n_verts + 1
            continue
        edges.append(raw[i + 1 : i + 3].astype(np.int32))
        i += n_verts + 1
    if not edges:
        return None
    return np.asarray(edges, dtype=np.int32)


def _line_connectivity(
    mesh: pv.UnstructuredGrid | pv.PolyData,
    cells_dict: CellsDict | None = None,
) -> NDArray[np.int32] | None:
    """Return LINE cell connectivity, or None if there are no lines.

    ``cells_dict`` may be supplied to avoid recomputing ``mesh.cells_dict``;
    in PyVista 0.48 this property is O(n_cells) per access (per-cell
    ``CellType`` enum lookup), so callers in a hot path should pass a
    pre-computed dict.
    """
    if cells_dict is None and hasattr(mesh, "cells_dict"):
        cells_dict = mesh.cells_dict
    if cells_dict is not None and pv.CellType.LINE in cells_dict:
        edges = cells_dict[pv.CellType.LINE].astype(np.int32)
    elif isinstance(mesh, pv.PolyData):
        edges = _extract_lines_from_polydata(mesh)
    else:
        edges = None
    if edges is None or len(edges) == 0:
        return None
    return edges


def _refs_for_unstructured_grid_cells(
    mesh: pv.UnstructuredGrid,
    cell_type: int,
    n_target: int,
) -> NDArray[np.int64] | None:
    """Slice cell_data refs to just the cells matching `cell_type`.

    Recognises `_REF_FIELDS` aliases. Returns the field already pre-sliced
    to `n_target` if its length matches, otherwise filters a per-cell array
    via the `celltypes` mask.
    """
    celltypes = np.asarray(mesh.celltypes)
    cell_mask = celltypes == cell_type
    for field in _REF_FIELDS:
        if field not in mesh.cell_data:
            continue
        arr = np.asarray(mesh.cell_data[field])
        if arr.ndim != 1:
            continue
        if len(arr) == n_target:
            return arr.astype(np.int64)
        if len(arr) == len(celltypes):
            return arr[cell_mask].astype(np.int64)
    return None


def _refs_for_polydata_lines(
    mesh: pv.PolyData,
    n_edges: int,
) -> NDArray[np.int64] | None:
    """Slice cell_data refs to just the LINE cells of a PolyData.

    PolyData stores cells in a fixed order: verts, lines, polys, strips
    (see https://vtk.org/doc/nightly/html/classvtkPolyData.html).
    """
    n_verts = int(mesh.n_verts)
    n_lines = int(mesh.n_lines)
    for field in _REF_FIELDS:
        if field not in mesh.cell_data:
            continue
        arr = np.asarray(mesh.cell_data[field])
        if arr.ndim != 1:
            continue
        if len(arr) == n_edges:
            return arr.astype(np.int64)
        if len(arr) == mesh.n_cells and n_lines == n_edges:
            return arr[n_verts : n_verts + n_lines].astype(np.int64)
    return None


def _refs_for_polydata_polys(
    mesh: pv.PolyData,
    n_polys: int,
) -> NDArray[np.int64] | None:
    """Slice cell_data refs to just the polygon (face) cells of a PolyData.

    PolyData stores cells in a fixed order: verts, lines, polys, strips
    (see https://vtk.org/doc/nightly/html/classvtkPolyData.html).
    """
    n_verts = int(mesh.n_verts)
    n_lines = int(mesh.n_lines)
    for field in _REF_FIELDS:
        if field not in mesh.cell_data:
            continue
        arr = np.asarray(mesh.cell_data[field])
        if arr.ndim != 1:
            continue
        if len(arr) == n_polys:
            return arr.astype(np.int64)
        if len(arr) == mesh.n_cells:
            start = n_verts + n_lines
            return arr[start : start + n_polys].astype(np.int64)
    return None


def _extract_edges(
    mesh: pv.UnstructuredGrid | pv.PolyData,
    cells_dict: CellsDict | None = None,
) -> tuple[NDArray[np.int32] | None, NDArray[np.int64] | None]:
    """Extract LINE cells and matching reference markers from a PyVista mesh.

    Returns (edges, refs) where either may be None. Recognised cell_data
    field aliases for refs include `"refs"`, `"gmsh:physical"` (used by
    meshio when reading `.msh` files) and `"medit:ref"`.

    ``cells_dict`` may be supplied to skip recomputing ``mesh.cells_dict``
    in callers that already hold one.
    """
    edges = _line_connectivity(mesh, cells_dict=cells_dict)
    if edges is None:
        return None, None

    if isinstance(mesh, pv.UnstructuredGrid):
        return edges, _refs_for_unstructured_grid_cells(
            mesh,
            pv.CellType.LINE,
            len(edges),
        )
    if isinstance(mesh, pv.PolyData):
        return edges, _refs_for_polydata_lines(mesh, len(edges))
    return edges, None


def _extract_element_refs(
    mesh: pv.UnstructuredGrid | pv.PolyData,
    n_elements: int,
    *,
    cell_type: int | None = None,
) -> NDArray[np.int64] | None:
    """Find element refs in cell_data, recognising `_REF_FIELDS` aliases.

    Handles the mixed-cell-type case (e.g. a `.msh` file with both lines
    and triangles) by slicing the appropriate range out of a concatenated
    cell_data array. `cell_type` is required for UnstructuredGrid inputs
    so the right cells can be filtered.
    """
    if isinstance(mesh, pv.UnstructuredGrid):
        if cell_type is None:
            return None
        return _refs_for_unstructured_grid_cells(mesh, cell_type, n_elements)
    if isinstance(mesh, pv.PolyData):
        return _refs_for_polydata_polys(mesh, n_elements)
    return None


def _from_pyvista_to_mmg3d(
    mesh: pv.UnstructuredGrid,
    cells_dict: CellsDict | None = None,
) -> MmgMesh3D:
    """Convert UnstructuredGrid with tetrahedra to MmgMesh3D.

    PyVista 0.48 made ``mesh.cells_dict`` O(n_cells) per access (it
    instantiates a ``CellType`` enum value per cell). For the common
    all-tetrahedra case we bypass it entirely by reshaping
    ``cell_connectivity``, falling back to ``cells_dict`` only for mixed
    cell types (e.g. a tet mesh with LINE ridges). Callers that already
    hold a ``cells_dict`` may pass it via the keyword to skip the
    rebuild on the mixed path.
    """
    celltypes = np.asarray(mesh.celltypes)
    tetra_type = int(pv.CellType.TETRA)
    is_all_tetra = celltypes.size > 0 and bool((celltypes == tetra_type).all())

    if is_all_tetra:
        elements = np.asarray(mesh.cell_connectivity).reshape(-1, 4).astype(np.int32)
        edges, edge_refs = None, None
    else:
        if cells_dict is None:
            cells_dict = mesh.cells_dict
        if pv.CellType.TETRA not in cells_dict:
            msg = "UnstructuredGrid must contain tetrahedra (CellType.TETRA)"
            raise ValueError(msg)
        elements = cells_dict[pv.CellType.TETRA].astype(np.int32)
        edges, edge_refs = _extract_edges(mesh, cells_dict=cells_dict)

    vertices = np.array(mesh.points, dtype=np.float64)
    elem_refs = _extract_element_refs(
        mesh,
        len(elements),
        cell_type=pv.CellType.TETRA,
    )

    if edges is None:
        mmg_mesh = MmgMesh3D(vertices, elements)
    else:
        mmg_mesh = MmgMesh3D()
        mmg_mesh.set_mesh_size(
            vertices=len(vertices),
            tetrahedra=len(elements),
            edges=len(edges),
        )
        mmg_mesh.set_vertices(vertices)
        mmg_mesh.set_tetrahedra(elements)

    if elem_refs is not None:
        mmg_mesh.set_tetrahedra(elements, elem_refs)

    if edges is not None:
        mmg_mesh.set_edges(edges, edge_refs)

    return mmg_mesh


def _from_pyvista_to_mmg2d(mesh: pv.PolyData) -> MmgMesh2D:
    """Convert PolyData with 2D triangles to MmgMesh2D."""
    edges, edge_refs = _extract_edges(mesh)

    mesh, was_triangulated = _triangulate_if_needed(mesh)
    if was_triangulated:
        logger.warning(_TRIANGULATION_WARNING)

    points = np.array(mesh.points, dtype=np.float64)
    if points.shape[1] == _DIMS_3D:
        vertices = np.ascontiguousarray(points[:, :2])
    else:
        vertices = points
    triangles = _extract_triangles_from_polydata(mesh)
    elem_refs = _extract_element_refs(mesh, len(triangles))

    if edges is None:
        mmg_mesh = MmgMesh2D(vertices, triangles)
    else:
        mmg_mesh = MmgMesh2D()
        mmg_mesh.set_mesh_size(
            vertices=len(vertices),
            triangles=len(triangles),
            edges=len(edges),
        )
        mmg_mesh.set_vertices(vertices)
        mmg_mesh.set_triangles(triangles)

    if elem_refs is not None:
        mmg_mesh.set_triangles(triangles, elem_refs)

    if edges is not None:
        mmg_mesh.set_edges(edges, edge_refs)

    return mmg_mesh


def _from_pyvista_to_mmgs(mesh: pv.PolyData) -> MmgMeshS:
    """Convert PolyData with 3D surface triangles to MmgMeshS."""
    edges, edge_refs = _extract_edges(mesh)

    mesh, was_triangulated = _triangulate_if_needed(mesh)
    if was_triangulated:
        logger.warning(_TRIANGULATION_WARNING)

    vertices = np.array(mesh.points, dtype=np.float64)
    triangles = _extract_triangles_from_polydata(mesh)
    elem_refs = _extract_element_refs(mesh, len(triangles))

    if edges is None:
        mmg_mesh = MmgMeshS(vertices, triangles)
    else:
        mmg_mesh = MmgMeshS()
        mmg_mesh.set_mesh_size(
            vertices=len(vertices),
            triangles=len(triangles),
            edges=len(edges),
        )
        mmg_mesh.set_vertices(vertices)
        mmg_mesh.set_triangles(triangles)

    if elem_refs is not None:
        mmg_mesh.set_triangles(triangles, elem_refs)

    if edges is not None:
        mmg_mesh.set_edges(edges, edge_refs)

    return mmg_mesh


def _from_pyvista_with_explicit_type(
    mesh: pv.UnstructuredGrid | pv.PolyData,
    mesh_type: type[MmgMesh3D | MmgMesh2D | MmgMeshS],
) -> MmgMesh3D | MmgMesh2D | MmgMeshS:
    """Convert PyVista mesh to mmgpy mesh with explicit type."""
    if mesh_type is MmgMesh3D:
        if not isinstance(mesh, pv.UnstructuredGrid):
            msg = "MmgMesh3D requires UnstructuredGrid input"
            raise ValueError(msg)
        return _from_pyvista_to_mmg3d(mesh)

    if mesh_type is MmgMesh2D:
        if isinstance(mesh, pv.UnstructuredGrid):
            mesh = mesh.extract_surface(algorithm=None)
        return _from_pyvista_to_mmg2d(mesh)

    if mesh_type is MmgMeshS:
        if isinstance(mesh, pv.UnstructuredGrid):
            mesh = mesh.extract_surface(algorithm=None)
        return _from_pyvista_to_mmgs(mesh)

    msg = f"Unknown mesh type: {mesh_type}"
    raise ValueError(msg)


def _from_pyvista_auto_detect(
    mesh: pv.UnstructuredGrid | pv.PolyData,
) -> MmgMesh3D | MmgMesh2D | MmgMeshS:
    """Convert PyVista mesh to mmgpy mesh with auto-detection."""
    if isinstance(mesh, pv.UnstructuredGrid):
        celltypes = np.asarray(mesh.celltypes)
        tetra_type = int(pv.CellType.TETRA)
        has_tetra = bool((celltypes == tetra_type).any())
        if has_tetra:
            return _from_pyvista_to_mmg3d(mesh)
        # UnstructuredGrid with no tets, extract surface and treat as 2D/surface
        polydata = mesh.extract_surface(algorithm=None)
        if polydata.n_cells > 0:
            logger.warning(
                "UnstructuredGrid has no tetrahedra; extracting surface for MMG. "
                "Volume element types (hex, wedge, pyramid) are not supported by MMG.",
            )
            if _is_2d_mesh(polydata.points):
                return _from_pyvista_to_mmg2d(polydata)
            return _from_pyvista_to_mmgs(polydata)
        msg = "UnstructuredGrid must contain tetrahedra or triangles for auto-detection"
        raise ValueError(msg)

    if isinstance(mesh, pv.PolyData):
        if _is_2d_mesh(mesh.points):
            return _from_pyvista_to_mmg2d(mesh)
        return _from_pyvista_to_mmgs(mesh)

    msg = f"Unsupported PyVista mesh type: {type(mesh)}"
    raise TypeError(msg)


@overload
def from_pyvista(
    mesh: pv.UnstructuredGrid | pv.PolyData,
    mesh_type: type[MmgMesh3D],
) -> MmgMesh3D: ...


@overload
def from_pyvista(
    mesh: pv.UnstructuredGrid | pv.PolyData,
    mesh_type: type[MmgMesh2D],
) -> MmgMesh2D: ...


@overload
def from_pyvista(
    mesh: pv.UnstructuredGrid | pv.PolyData,
    mesh_type: type[MmgMeshS],
) -> MmgMeshS: ...


@overload
def from_pyvista(
    mesh: pv.UnstructuredGrid | pv.PolyData,
    mesh_type: None = None,
) -> MmgMesh3D | MmgMesh2D | MmgMeshS: ...


def from_pyvista(
    mesh: pv.UnstructuredGrid | pv.PolyData,
    mesh_type: type[MmgMesh3D | MmgMesh2D | MmgMeshS] | None = None,
) -> MmgMesh3D | MmgMesh2D | MmgMeshS:
    """Convert a PyVista mesh to an mmgpy mesh.

    Args:
        mesh: PyVista mesh (UnstructuredGrid or PolyData).
        mesh_type: Target mesh class. If None, auto-detects based on:
            - UnstructuredGrid with tetrahedra → MmgMesh3D
            - PolyData with 2D points (z~=0) -> MmgMesh2D
            - PolyData with 3D points → MmgMeshS

    Returns:
        The appropriate mmgpy mesh instance.

    Raises:
        ValueError: If mesh type cannot be determined or is incompatible.

    Note:
        When auto-detecting mesh type for PolyData, a mesh is considered 2D
        (and converted to MmgMesh2D) if all z-coordinates are within 1e-8 of zero.
        For thin 3D meshes near z=0, explicitly specify ``mesh_type=MmgMeshS``.

    Example:
        >>> import pyvista as pv
        >>> from mmgpy import from_pyvista, MmgMeshS
        >>>
        >>> # Auto-detect mesh type
        >>> grid = pv.read("tetra_mesh.vtk")
        >>> mesh3d = from_pyvista(grid)
        >>>
        >>> # Explicit mesh type for thin 3D surfaces
        >>> surface = pv.read("surface.stl")
        >>> mesh_s = from_pyvista(surface, MmgMeshS)

    """
    if mesh_type is not None:
        return _from_pyvista_with_explicit_type(mesh, mesh_type)
    return _from_pyvista_auto_detect(mesh)


@overload
def to_pyvista(
    mesh: MmgMesh3D,
    *,
    include_refs: bool = True,
    include_edges: bool = False,
) -> pv.UnstructuredGrid: ...


@overload
def to_pyvista(
    mesh: MmgMesh2D,
    *,
    include_refs: bool = True,
    include_edges: bool = False,
) -> pv.PolyData: ...


@overload
def to_pyvista(
    mesh: MmgMeshS,
    *,
    include_refs: bool = True,
    include_edges: bool = False,
) -> pv.PolyData: ...


def to_pyvista(
    mesh: MmgMesh3D | MmgMesh2D | MmgMeshS,
    *,
    include_refs: bool = True,
    include_edges: bool = False,
) -> pv.UnstructuredGrid | pv.PolyData:
    """Convert an mmgpy mesh to a PyVista mesh.

    Args:
        mesh: mmgpy mesh instance (MmgMesh3D, MmgMesh2D, or MmgMeshS).
        include_refs: If True, include element references as cell_data.
        include_edges: If True, include MMG edges (ridges, boundary edges)
            as LINE cells in the output. Defaults to False so the returned
            mesh contains only the primary cell type, matching common
            downstream expectations (e.g. matplotlib tripcolor). Set True
            for round-trip / file-save workflows that must preserve edge
            markers.

    Returns:
        PyVista mesh:
            - MmgMesh3D → UnstructuredGrid with tetrahedra
            - MmgMesh2D → PolyData with triangular faces (z=0)
            - MmgMeshS → PolyData with triangular faces

    Raises:
        TypeError: If mesh is not an mmgpy mesh type.

    Example:
        >>> from mmgpy import MmgMesh3D, to_pyvista
        >>>
        >>> mesh = MmgMesh3D(vertices, elements)
        >>> mesh.remesh(hmax=0.1)
        >>> grid = to_pyvista(mesh)
        >>> grid.plot()

    """
    if isinstance(mesh, MmgMesh3D):
        return _mmg3d_to_pyvista(
            mesh,
            include_refs=include_refs,
            include_edges=include_edges,
        )
    if isinstance(mesh, MmgMesh2D):
        return _mmg2d_to_pyvista(
            mesh,
            include_refs=include_refs,
            include_edges=include_edges,
        )
    if isinstance(mesh, MmgMeshS):
        return _mmgs_to_pyvista(
            mesh,
            include_refs=include_refs,
            include_edges=include_edges,
        )

    msg = f"Unsupported mesh type: {type(mesh)}"
    raise TypeError(msg)


def _build_lines_array(edges: NDArray[np.int32]) -> NDArray[np.int32]:
    """Build a VTK-style flat lines array (each entry: [2, v0, v1])."""
    return np.hstack(
        [np.full((len(edges), 1), _LINE_VERTS), edges],
    ).ravel()


def _mmg3d_to_pyvista(
    mesh: MmgMesh3D,
    *,
    include_refs: bool,
    include_edges: bool,
) -> pv.UnstructuredGrid:
    """Convert MmgMesh3D to PyVista UnstructuredGrid."""
    vertices = mesh.get_vertices()

    if include_refs:
        elements, refs = mesh.get_elements_with_refs()
    else:
        elements = mesh.get_elements()
        refs = None

    edges, edge_refs = (np.empty((0, 2), dtype=np.int32), None)
    if include_edges:
        if include_refs:
            edges, edge_refs = mesh.get_edges_with_refs()
        else:
            edges = mesh.get_edges()

    cells_dict: dict[int, NDArray[np.int32]] = {pv.CellType.TETRA: elements}
    if len(edges) > 0:
        cells_dict[pv.CellType.LINE] = edges
    grid = pv.UnstructuredGrid(cells_dict, vertices)

    if refs is not None:
        if len(edges) > 0 and edge_refs is not None:
            grid.cell_data["refs"] = np.concatenate([refs, edge_refs])
        else:
            grid.cell_data["refs"] = refs

    return grid


def _mmg2d_to_pyvista(
    mesh: MmgMesh2D,
    *,
    include_refs: bool,
    include_edges: bool,
) -> pv.PolyData:
    """Convert MmgMesh2D to PyVista PolyData."""
    vertices_2d = mesh.get_vertices()
    vertices_3d = np.column_stack([vertices_2d, np.zeros(len(vertices_2d))])

    if include_refs:
        triangles, refs = mesh.get_triangles_with_refs()
    else:
        triangles = mesh.get_triangles()
        refs = None

    edges, edge_refs = (np.empty((0, 2), dtype=np.int32), None)
    if include_edges:
        if include_refs:
            edges, edge_refs = mesh.get_edges_with_refs()
        else:
            edges = mesh.get_edges()

    faces = np.hstack(
        [np.full((len(triangles), 1), _TRIANGLE_VERTS), triangles],
    ).ravel()
    lines = _build_lines_array(edges) if len(edges) > 0 else None
    polydata = pv.PolyData(vertices_3d, faces=faces, lines=lines)

    if refs is not None:
        # PolyData cell ordering: verts, lines, polys (faces), strips.
        if len(edges) > 0 and edge_refs is not None:
            polydata.cell_data["refs"] = np.concatenate([edge_refs, refs])
        else:
            polydata.cell_data["refs"] = refs

    return polydata


def _mmgs_to_pyvista(
    mesh: MmgMeshS,
    *,
    include_refs: bool,
    include_edges: bool,
) -> pv.PolyData:
    """Convert MmgMeshS to PyVista PolyData."""
    vertices = mesh.get_vertices()

    if include_refs:
        triangles, refs = mesh.get_triangles_with_refs()
    else:
        triangles = mesh.get_triangles()
        refs = None

    edges, edge_refs = (np.empty((0, 2), dtype=np.int32), None)
    if include_edges:
        if include_refs:
            edges, edge_refs = mesh.get_edges_with_refs()
        else:
            edges = mesh.get_edges()

    faces = np.hstack(
        [np.full((len(triangles), 1), _TRIANGLE_VERTS), triangles],
    ).ravel()
    lines = _build_lines_array(edges) if len(edges) > 0 else None
    polydata = pv.PolyData(vertices, faces=faces, lines=lines)

    if refs is not None:
        # PolyData cell ordering: verts, lines, polys (faces), strips.
        if len(edges) > 0 and edge_refs is not None:
            polydata.cell_data["refs"] = np.concatenate([edge_refs, refs])
        else:
            polydata.cell_data["refs"] = refs

    return polydata


def polydata_from_2d_triangles(
    vertices: NDArray[np.floating],
    triangles: NDArray[np.integer],
    *,
    z: float = 0.0,
) -> pv.PolyData:
    """Build a ``pv.PolyData`` from 2D vertices and triangle connectivity.

    Embeds the planar mesh in 3D at ``z=z`` so the result can flow through
    the ``.mmg`` accessor, which auto-detects ``TRIANGULAR_2D`` from the
    constant-z coordinate.

    Parameters
    ----------
    vertices : ndarray, shape ``(n, 2)`` or ``(n, 3)``
        Vertex coordinates. 2D arrays are extended with the constant ``z``;
        3D arrays are used as-is.
    triangles : ndarray, shape ``(m, 3)``
        Triangle connectivity (zero-indexed).
    z : float, default ``0.0``
        Plane height used when embedding 2D vertices.

    Returns
    -------
    pv.PolyData
        Planar PolyData carrying ``triangles`` as its faces.

    """
    verts = np.asarray(vertices, dtype=np.float64)
    if verts.ndim != _DIMS_2D or verts.shape[1] not in (_DIMS_2D, _DIMS_3D):
        msg = f"vertices must have shape (n, 2) or (n, 3); got {verts.shape}"
        raise ValueError(msg)
    if verts.shape[1] == _DIMS_2D:
        verts = np.column_stack([verts, np.full(len(verts), z, dtype=np.float64)])

    tris = np.asarray(triangles, dtype=np.int32)
    if tris.ndim != _DIMS_2D or tris.shape[1] != _TRIANGLE_VERTS:
        msg = f"triangles must have shape (m, 3); got {tris.shape}"
        raise ValueError(msg)

    faces = np.column_stack(
        [np.full(len(tris), _TRIANGLE_VERTS, dtype=np.int32), tris],
    ).ravel()
    return pv.PolyData(verts, faces=faces)


__all__ = ["from_pyvista", "polydata_from_2d_triangles", "to_pyvista"]
