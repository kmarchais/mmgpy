"""Vertex/element reordering for cache-friendly mesh layouts.

Replaces the historical ``renum=1`` MMG kwarg, which was a silent no-op
because the bundled MMG is built without SCOTCH. ``reorder_cuthill_mckee``
is a pure-Python implementation on top of :mod:`scipy.sparse.csgraph`,
producing a permutation that minimizes vertex-vertex bandwidth.
"""

from __future__ import annotations

from typing import TYPE_CHECKING, cast

import numpy as np
import pyvista as pv
from scipy.sparse import csgraph, csr_matrix

from mmgpy._topology import vertex_adjacency

if TYPE_CHECKING:
    from numpy.typing import NDArray

    from mmgpy._mesh import Mesh
    from mmgpy._mmgpy import MmgMesh3D


def _split_legacy_cells(
    flat: NDArray[np.integer],
) -> list[NDArray[np.int32]]:
    """Split a legacy ``[n0, v0, ..., v0_{n0-1}, n1, ...]`` array by cell width.

    Returns
    -------
    list of ndarray of int32
        One ``(n_cells_of_width, width)`` block per distinct cell width.

    """
    if flat.size == 0:
        return []
    arr = np.asarray(flat, dtype=np.int64)
    blocks_by_width: dict[int, list[NDArray[np.int32]]] = {}
    i = 0
    while i < arr.size:
        n = int(arr[i])
        if n >= 2:  # noqa: PLR2004
            row = arr[i + 1 : i + 1 + n].astype(np.int32, copy=False)
            blocks_by_width.setdefault(n, []).append(row)
        i += 1 + n
    return [np.vstack(rows) for rows in blocks_by_width.values()]


def _collect_element_blocks(
    dataset: pv.UnstructuredGrid | pv.PolyData,
) -> list[NDArray[np.int32]]:
    """Return per-cell-type ``(n_cells_of_type, n_per_cell)`` connectivity blocks.

    Returns
    -------
    list of ndarray of int32
        One block per cell type present in the dataset.

    """
    if isinstance(dataset, pv.PolyData):
        blocks: list[NDArray[np.int32]] = []
        for section in (dataset.lines, dataset.faces, dataset.strips):
            if section is None or len(section) == 0:
                continue
            blocks.extend(_split_legacy_cells(np.asarray(section)))
        return blocks

    out: list[NDArray[np.int32]] = []
    for conn in dataset.cells_dict.values():
        arr = np.asarray(conn, dtype=np.int32)
        if arr.ndim == 2 and arr.shape[1] >= 2:  # noqa: PLR2004
            out.append(arr)
    return out


def _build_adjacency(
    n_vertices: int,
    blocks: list[NDArray[np.int32]],
) -> csr_matrix:
    """Symmetric vertex-vertex adjacency from one or more element blocks.

    Returns
    -------
    scipy.sparse.csr_matrix
        Symmetric adjacency with ``1.0`` for every connected vertex pair.

    """
    adj = vertex_adjacency(n_vertices, blocks[0])
    for extra in blocks[1:]:
        adj += vertex_adjacency(n_vertices, extra)
    adj.data[:] = 1.0
    return adj


def _compute_rcm_permutation(
    n_vertices: int,
    blocks: list[NDArray[np.int32]],
    *,
    symmetric_mode: bool = True,
) -> tuple[NDArray[np.int64], NDArray[np.int64]]:
    """Return ``(perm, inv_perm)`` for the merged adjacency of *blocks*.

    ``perm[i]`` is the original index of the vertex now at position ``i``;
    ``inv_perm`` is its inverse and is what cell connectivity must be
    indexed with to remap from old to new vertex IDs.

    Returns
    -------
    tuple of (ndarray of int64, ndarray of int64)
        ``(perm, inv_perm)``.

    """
    adj = _build_adjacency(n_vertices, blocks)
    perm = np.asarray(
        csgraph.reverse_cuthill_mckee(adj, symmetric_mode=symmetric_mode),
        dtype=np.int64,
    )
    inv_perm = np.empty_like(perm)
    inv_perm[perm] = np.arange(perm.size, dtype=perm.dtype)
    return perm, inv_perm


def _bandwidth(adj: csr_matrix) -> int:
    """Maximum ``|i - j|`` over all (i, j) edges in the CSR adjacency.

    Returns
    -------
    int
        Bandwidth of the adjacency, or ``0`` when no edges are present.

    """
    if adj.nnz == 0:
        return 0
    n = adj.shape[0]
    rows = np.repeat(np.arange(n, dtype=np.int64), np.diff(adj.indptr))
    return int(np.abs(adj.indices.astype(np.int64) - rows).max(initial=0))


def reorder_cuthill_mckee(
    mesh: pv.UnstructuredGrid | pv.PolyData,
    *,
    symmetric_mode: bool = True,
) -> pv.UnstructuredGrid | pv.PolyData:
    """Return a copy of *mesh* with vertices permuted via reverse Cuthill-McKee.

    Vertex ordering is replaced by the RCM permutation of the vertex-vertex
    adjacency graph; element connectivity is remapped so each cell still
    references the same vertices. ``point_data`` arrays are reordered to
    follow the permutation; ``cell_data`` and ``field_data`` are unchanged.

    Replaces MMG's SCOTCH-based renumbering, which the bundled MMG cannot
    invoke (the library is built ``USE_SCOTCH=OFF``). The Python-side path
    has no extra dependencies and produces an equivalent bandwidth reduction.

    Parameters
    ----------
    mesh : pyvista.UnstructuredGrid or pyvista.PolyData
        Source mesh. The input is not modified.
    symmetric_mode : bool, default True
        Forwarded to :func:`scipy.sparse.csgraph.reverse_cuthill_mckee`.
        Leave at ``True`` for symmetric vertex-vertex adjacencies (the case
        for any consistent mesh).

    Returns
    -------
    same type as *mesh*
        New dataset with reordered vertices, remapped connectivity, and
        permuted ``point_data``.

    Raises
    ------
    TypeError
        If ``mesh`` is not an :class:`pyvista.UnstructuredGrid` or
        :class:`pyvista.PolyData`.

    Examples
    --------
    >>> import pyvista as pv
    >>> import mmgpy
    >>> mesh = pv.read("brain.vtu")
    >>> reordered = mmgpy.reorder_cuthill_mckee(mesh)
    >>> # Or via the PyVista accessor:
    >>> reordered = mesh.mmg.reorder_cuthill_mckee()

    """
    if not isinstance(mesh, (pv.UnstructuredGrid, pv.PolyData)):
        msg = (
            f"reorder_cuthill_mckee expects a pyvista UnstructuredGrid or "
            f"PolyData, got {type(mesh).__name__}"
        )
        raise TypeError(msg)

    n_vertices = int(mesh.n_points)
    if n_vertices == 0:
        return mesh.copy()

    blocks = _collect_element_blocks(mesh)
    if not blocks:
        return mesh.copy()

    perm, inv_perm = _compute_rcm_permutation(
        n_vertices,
        blocks,
        symmetric_mode=symmetric_mode,
    )

    out = mesh.copy(deep=True)
    out.points = np.asarray(mesh.points)[perm]

    _remap_connectivity(out, inv_perm)

    for name in list(mesh.point_data.keys()):
        out.point_data[name] = np.asarray(mesh.point_data[name])[perm]

    return out


def _remap_connectivity(
    dataset: pv.UnstructuredGrid | pv.PolyData,
    inv_perm: NDArray[np.int64],
) -> None:
    """Rewrite vertex indices in *dataset*'s VTK cell arrays."""
    from vtkmodules.util.numpy_support import (  # noqa: PLC0415
        numpy_to_vtk,
        vtk_to_numpy,
    )

    if isinstance(dataset, pv.UnstructuredGrid):
        cell_arrays = [dataset.GetCells()]
    else:  # PolyData: four sections, each its own vtkCellArray
        cell_arrays = [
            dataset.GetVerts(),
            dataset.GetLines(),
            dataset.GetPolys(),
            dataset.GetStrips(),
        ]

    for ca in cell_arrays:
        if ca is None or ca.GetNumberOfCells() == 0:
            continue
        conn_vtk = ca.GetConnectivityArray()
        conn = np.asarray(vtk_to_numpy(conn_vtk)).copy()
        remapped = inv_perm[conn].astype(conn.dtype, copy=False)
        new_vtk = numpy_to_vtk(remapped, deep=True, array_type=conn_vtk.GetDataType())
        new_vtk.SetName(conn_vtk.GetName() or "")
        conn_vtk.DeepCopy(new_vtk)


def _collect_mesh_element_blocks(
    mesh: Mesh,
) -> tuple[
    list[NDArray[np.int32]],
    tuple[NDArray[np.int32], NDArray[np.int64]] | None,
    tuple[NDArray[np.int32], NDArray[np.int64]] | None,
    tuple[NDArray[np.int32], NDArray[np.int64]],
]:
    """Pull element blocks needed for both adjacency and re-application.

    Returns
    -------
    tuple
        ``(blocks, tets, tris, (edges, edge_refs))``. ``tets`` and
        ``tris`` are ``None`` when the corresponding element type is
        absent.

    """
    from mmgpy._mesh import MeshKind  # noqa: PLC0415

    blocks: list[NDArray[np.int32]] = []
    tets: tuple[NDArray[np.int32], NDArray[np.int64]] | None = None
    tris: tuple[NDArray[np.int32], NDArray[np.int64]] | None = None

    if mesh.kind == MeshKind.TETRAHEDRAL:
        tetrahedra, tetrahedra_refs = mesh.get_tetrahedra_with_refs()
        if tetrahedra.size:
            tets = (tetrahedra, tetrahedra_refs)
            blocks.append(tetrahedra)

    triangles, triangle_refs = mesh.get_triangles_with_refs()
    if triangles.size:
        tris = (triangles, triangle_refs)
        blocks.append(triangles)

    edges, edge_refs = mesh.get_edges_with_refs()
    if edges.size:
        blocks.append(edges)

    return blocks, tets, tris, (edges, edge_refs)


def _snapshot_permuted_fields(
    mesh: Mesh,
    perm: NDArray[np.int64],
    n_vertices: int,
) -> tuple[dict[str, NDArray[np.float64]], dict[str, NDArray[np.float64]]]:
    """Snapshot + permute all fields before any in-place mutation.

    Returns
    -------
    tuple of (dict[str, ndarray], dict[str, ndarray])
        ``(mmg_snapshots, user_snapshots)``. Both dicts are keyed by
        field name and hold permuted float64 arrays.

    """
    mmg_snapshots: dict[str, NDArray[np.float64]] = {}
    for name in mesh._MMG_FIELDS:  # noqa: SLF001
        data = mesh._try_get_field(name)  # noqa: SLF001
        if data is not None and len(data) == n_vertices:
            mmg_snapshots[name] = np.asarray(data)[perm]

    user_snapshots = {
        name: np.asarray(values)[perm]
        for name, values in mesh._user_fields.items()  # noqa: SLF001
        if len(values) == n_vertices
    }
    return mmg_snapshots, user_snapshots


def _apply_permuted_elements(
    mesh: Mesh,
    inv_perm32: NDArray[np.int32],
    tets: tuple[NDArray[np.int32], NDArray[np.int64]] | None,
    tris: tuple[NDArray[np.int32], NDArray[np.int64]] | None,
    edge_block: tuple[NDArray[np.int32], NDArray[np.int64]],
) -> None:
    """Write each element block back to *mesh* with vertex indices remapped."""
    from mmgpy._mesh import MeshKind  # noqa: PLC0415

    if mesh.kind == MeshKind.TETRAHEDRAL and tets is not None:
        tetrahedra, tetrahedra_refs = tets
        impl_3d = cast("MmgMesh3D", mesh._impl)  # noqa: SLF001
        impl_3d.set_tetrahedra(inv_perm32[tetrahedra], tetrahedra_refs)
    if tris is not None:
        triangles, triangle_refs = tris
        mesh.set_triangles(inv_perm32[triangles], triangle_refs)
    edges, edge_refs = edge_block
    if edges.size:
        mesh.set_edges(inv_perm32[edges], edge_refs)


def _apply_rcm_to_mesh(mesh: Mesh) -> None:
    """In-place reverse Cuthill-McKee reordering of a :class:`Mesh`.

    Permutes vertices, every element block (tetrahedra / triangles / edges),
    every MMG-known field stored on the C++ side (metric, displacement,
    levelset, tensor), and every user field. Sizes are preserved.
    """
    vertices, vertex_refs = mesh.get_vertices_with_refs()
    n_vertices = len(vertices)
    if n_vertices == 0:
        return

    blocks, tets, tris, edge_block = _collect_mesh_element_blocks(mesh)
    if not blocks:
        return

    perm, inv_perm = _compute_rcm_permutation(n_vertices, blocks)
    inv_perm32 = inv_perm.astype(np.int32, copy=False)

    mmg_snapshots, user_snapshots = _snapshot_permuted_fields(mesh, perm, n_vertices)

    mesh.set_vertices(vertices[perm], vertex_refs[perm])
    _apply_permuted_elements(mesh, inv_perm32, tets, tris, edge_block)

    for name, permuted in mmg_snapshots.items():
        mesh._impl.set_field(name, permuted)  # noqa: SLF001
    for name, permuted in user_snapshots.items():
        mesh._user_fields[name] = permuted  # noqa: SLF001

    if mesh._lazy_source is not None:  # noqa: SLF001
        mesh._lazy_source.invalidate()  # noqa: SLF001
        mesh._lazy_source = None  # noqa: SLF001


__all__ = ["reorder_cuthill_mckee"]
