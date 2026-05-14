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

    Parameters
    ----------
    n_vertices : int
        Number of vertices in the mesh.
    elements : ndarray
        ``(M, k)`` connectivity array; ``k`` >= 2.

    Returns
    -------
    scipy.sparse.csr_matrix
        ``(n_vertices, n_vertices)`` CSR matrix. For vertex ``i``,
        ``adj.indices[adj.indptr[i]:adj.indptr[i + 1]]`` lists its
        1-ring.

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


def two_ring_patches(adj: sparse.csr_matrix) -> list[NDArray[np.intp]]:
    """For each vertex i, return its closed 2-ring (i and all 1- and 2-step neighbours).

    Computed as the nonzero pattern of ``I + A + A @ A``. The matrix product
    runs in C and is dramatically cheaper than per-vertex Python set unions,
    especially for high-order elements.

    Returns
    -------
    list of ndarray of intp
        ``out[i]`` is the sorted vertex indices in the closed 2-ring of
        vertex ``i``.

    """
    n = adj.shape[0]
    closed = (adj + adj @ adj + sparse.eye(n, format="csr")).tocsr()
    closed.eliminate_zeros()
    indptr = closed.indptr
    indices = closed.indices
    return [indices[indptr[i] : indptr[i + 1]] for i in range(n)]
