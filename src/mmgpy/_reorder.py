"""Vertex/element reordering for cache-friendly mesh layouts.

Replaces the historical ``renum=1`` MMG kwarg, which was a silent no-op
because the bundled MMG is built without SCOTCH. ``reorder_cuthill_mckee``
is a pure-Python implementation on top of :mod:`scipy.sparse.csgraph`,
producing a permutation that minimizes vertex-vertex bandwidth.
"""

from __future__ import annotations

from typing import TYPE_CHECKING

import numpy as np
import pyvista as pv
from scipy.sparse import csgraph

from mmgpy._topology import vertex_adjacency

if TYPE_CHECKING:
    from numpy.typing import NDArray


def _split_legacy_cells(
    flat: NDArray[np.integer],
) -> list[NDArray[np.int32]]:
    """Split a legacy ``[n0, v0, ..., v0_{n0-1}, n1, ...]`` array by cell width.

    Cells of identical width go into the same ``(k, n_per_cell)`` block. Used
    to feed PolyData's per-section cell arrays into :func:`vertex_adjacency`.
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

    Used as input to :func:`vertex_adjacency`. Cells of fewer than two vertices
    are skipped — they contribute no edges to the adjacency graph.
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


def _bandwidth(adj_indices_per_row: list[NDArray[np.intp]]) -> int:
    """Maximum ``|i - j|`` over all (i, j) edges in the adjacency."""
    bw = 0
    for i, neighbors in enumerate(adj_indices_per_row):
        if neighbors.size == 0:
            continue
        diff = int(np.max(np.abs(neighbors - i)))
        bw = max(bw, diff)
    return bw


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

    # Build a single (n_vertices, k_max) connectivity table by stacking each
    # block padded to the widest cell; vertex_adjacency only reads edges via
    # triu_indices, so duplicate entries from padding never become edges as
    # long as we mark them as self-edges. Easier: just call vertex_adjacency
    # per block and OR the matrices together.
    adj = vertex_adjacency(n_vertices, blocks[0])
    for extra in blocks[1:]:
        adj = adj + vertex_adjacency(n_vertices, extra)
    adj.data[:] = 1.0  # collapse duplicates from overlapping element types

    perm = np.asarray(
        csgraph.reverse_cuthill_mckee(adj, symmetric_mode=symmetric_mode),
        dtype=np.int64,
    )
    inv_perm = np.empty_like(perm)
    inv_perm[perm] = np.arange(perm.size, dtype=perm.dtype)

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
    """Rewrite vertex indices in *dataset*'s VTK cell arrays in place."""
    from vtkmodules.util.numpy_support import vtk_to_numpy  # noqa: PLC0415

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
        conn = vtk_to_numpy(ca.GetConnectivityArray())
        # vtk_to_numpy returns a writable view onto the VTK buffer; mutating
        # conn[:] propagates back to the dataset without a re-set call.
        conn[:] = inv_perm[conn]


__all__ = ["reorder_cuthill_mckee"]
