"""Internal mesh topology helpers shared across modules."""

from __future__ import annotations

from typing import TYPE_CHECKING

import numpy as np
from scipy import sparse

if TYPE_CHECKING:
    from numpy.typing import NDArray


def vertex_adjacency(
    n_vertices: int,
    elements: NDArray[np.int32],
) -> sparse.csr_matrix:
    """Symmetric vertex-vertex adjacency from an element connectivity table.

    Pair indices for one element are built once with ``np.triu_indices``, then
    broadcast across all elements and assembled into a single sparse matrix.
    This avoids the per-element Python loop and the per-vertex ``set``/``list``
    churn of the naive construction.

    The returned CSR has zero diagonal and stores 1.0 at every (i, j) where
    vertices i and j share at least one element.

    Args:
        n_vertices: Number of vertices in the mesh.
        elements: ``(M, k)`` connectivity array; ``k`` ≥ 2.

    Returns:
        ``(n_vertices, n_vertices)`` CSR matrix. For vertex ``i``,
        ``adj.indices[adj.indptr[i]:adj.indptr[i + 1]]`` lists its 1-ring.

    """
    n_per_elm = int(elements.shape[1])
    if n_per_elm < 2:  # noqa: PLR2004 - lone vertices have no edges
        return sparse.csr_matrix((n_vertices, n_vertices), dtype=np.float64)

    ii, jj = np.triu_indices(n_per_elm, k=1)
    rows = elements[:, ii].ravel()
    cols = elements[:, jj].ravel()
    all_rows = np.concatenate([rows, cols])
    all_cols = np.concatenate([cols, rows])
    data = np.ones(all_rows.size, dtype=np.float64)
    csr = sparse.coo_matrix(
        (data, (all_rows, all_cols)),
        shape=(n_vertices, n_vertices),
    ).tocsr()
    # tocsr sums duplicate (i, j) entries from elements sharing an edge;
    # collapse them back to plain 0/1 adjacency.
    csr.data[:] = 1.0
    return csr


def two_ring_csr(adj: sparse.csr_matrix) -> sparse.csr_matrix:
    """CSR sparsity pattern of the closed 2-ring (``I + A + A @ A``).

    Each row ``i`` of the returned matrix lists vertex ``i`` together with all
    of its 1- and 2-step neighbours. Computed via a sparse matmul in C, which
    is dramatically cheaper than per-vertex Python set unions.
    """
    n = adj.shape[0]
    closed = (adj + adj @ adj + sparse.eye(n, format="csr")).tocsr()
    closed.eliminate_zeros()
    return closed


def two_ring_patches(adj: sparse.csr_matrix) -> list[NDArray[np.intp]]:
    """For each vertex i, return its closed 2-ring as a Python list of arrays.

    Convenience wrapper around :func:`two_ring_csr` for callers that want a
    Python-iterable view; consumers that can stay in CSR land should use the
    CSR helper directly to avoid the per-row slice.
    """
    closed = two_ring_csr(adj)
    indptr = closed.indptr
    indices = closed.indices
    return [indices[indptr[i] : indptr[i + 1]] for i in range(closed.shape[0])]
