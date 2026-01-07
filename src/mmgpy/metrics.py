"""Metric tensor utilities for anisotropic mesh adaptation.

This module provides helper functions for creating, validating, and manipulating
metric tensors used in anisotropic mesh adaptation with MMG.

Metric tensors define the desired element size and shape at each vertex:
- **Isotropic metric**: Single scalar h → equilateral elements of size h
- **Anisotropic metric**: Symmetric tensor → stretched elements aligned with
  principal directions

Tensor storage format (row-major, upper triangular):
- **3D**: [m11, m12, m13, m22, m23, m33] (6 components)
- **2D**: [m11, m12, m22] (3 components)

The metric eigenvalues encode element sizes: size_i = 1 / sqrt(eigenvalue_i)

Examples
--------
Create an isotropic metric with uniform size h=0.1:

>>> import numpy as np
>>> from mmgpy.metrics import create_isotropic_metric
>>> n_vertices = 100
>>> h = 0.1
>>> metric = create_isotropic_metric(h, n_vertices, dim=3)
>>> metric.shape
(100, 6)

Create an anisotropic metric with different sizes in each direction:

>>> from mmgpy.metrics import create_anisotropic_metric
>>> sizes = np.array([0.1, 0.5, 0.1])  # Small in x,z, large in y
>>> directions = np.eye(3)  # Aligned with coordinate axes
>>> metric = create_anisotropic_metric(sizes, directions)
>>> metric.shape
(6,)

"""

from __future__ import annotations

from typing import TYPE_CHECKING

import numpy as np

if TYPE_CHECKING:
    from numpy.typing import NDArray


def create_isotropic_metric(
    h: float | NDArray[np.float64],
    n_vertices: int | None = None,
    dim: int = 3,
) -> NDArray[np.float64]:
    """Create an isotropic metric field from scalar sizing values.

    Parameters
    ----------
    h : float or array_like
        Desired element size(s). If scalar, same size at all vertices.
        If array, must have shape (n_vertices,) or (n_vertices, 1).
    n_vertices : int, optional
        Number of vertices. Required if h is a scalar.
    dim : int, optional
        Mesh dimension (2 or 3). Default is 3.

    Returns
    -------
    NDArray[np.float64]
        Metric tensor array with shape (n_vertices, n_components) where
        n_components is 6 for 3D and 3 for 2D.

    Examples
    --------
    >>> metric = create_isotropic_metric(0.1, n_vertices=100, dim=3)
    >>> metric.shape
    (100, 6)

    >>> sizes = np.linspace(0.1, 0.5, 100)
    >>> metric = create_isotropic_metric(sizes, dim=3)
    >>> metric.shape
    (100, 6)

    """
    if dim not in (2, 3):
        msg = f"dim must be 2 or 3, got {dim}"
        raise ValueError(msg)

    h = np.asarray(h, dtype=np.float64)
    if h.ndim == 0:
        if n_vertices is None:
            msg = "n_vertices required when h is a scalar"
            raise ValueError(msg)
        h = np.full(n_vertices, h.item(), dtype=np.float64)
    elif h.ndim == 2 and h.shape[1] == 1:
        h = h.ravel()

    if h.ndim != 1:
        msg = f"h must be scalar or 1D array, got shape {h.shape}"
        raise ValueError(msg)

    n_verts = len(h)

    eigenvalue = 1.0 / (h * h)

    if dim == 3:
        metric = np.zeros((n_verts, 6), dtype=np.float64)
        metric[:, 0] = eigenvalue  # m11
        metric[:, 3] = eigenvalue  # m22
        metric[:, 5] = eigenvalue  # m33
    else:
        metric = np.zeros((n_verts, 3), dtype=np.float64)
        metric[:, 0] = eigenvalue  # m11
        metric[:, 2] = eigenvalue  # m22

    return metric


def create_anisotropic_metric(
    sizes: NDArray[np.float64],
    directions: NDArray[np.float64] | None = None,
) -> NDArray[np.float64]:
    """Create an anisotropic metric tensor from principal sizes and directions.

    The metric tensor M is constructed as: M = R @ D @ R.T
    where D is diagonal with D[i,i] = 1/sizes[i]^2 and R contains the
    principal direction vectors as columns.

    Parameters
    ----------
    sizes : array_like
        Principal element sizes. Shape (3,) for 3D, (2,) for 2D.
        Can also be (n_vertices, 3) or (n_vertices, 2) for per-vertex sizes.
    directions : array_like, optional
        Principal direction vectors. Shape (3, 3) or (2, 2) for single metric,
        or (n_vertices, 3, 3) or (n_vertices, 2, 2) for per-vertex directions.
        Columns are eigenvectors. If None, uses identity (coordinate-aligned).

    Returns
    -------
    NDArray[np.float64]
        Metric tensor(s). Shape (6,) for single 3D metric, (3,) for single 2D,
        or (n_vertices, 6) / (n_vertices, 3) for per-vertex metrics.

    Examples
    --------
    Create a metric with 10x stretch in x-direction:

    >>> sizes = np.array([0.1, 1.0, 1.0])  # Small in x, large in y,z
    >>> metric = create_anisotropic_metric(sizes)
    >>> metric
    array([100.,   0.,   0.,   1.,   0.,   1.])

    Create a rotated metric:

    >>> import numpy as np
    >>> theta = np.pi / 4  # 45 degrees
    >>> R = np.array([[np.cos(theta), -np.sin(theta), 0],
    ...               [np.sin(theta),  np.cos(theta), 0],
    ...               [0,              0,             1]])
    >>> sizes = np.array([0.1, 1.0, 1.0])
    >>> metric = create_anisotropic_metric(sizes, R)

    """
    sizes = np.asarray(sizes, dtype=np.float64)

    if sizes.ndim == 1:
        dim = len(sizes)
        single_metric = True
        sizes = sizes.reshape(1, dim)
        n_vertices = 1
    elif sizes.ndim == 2:
        n_vertices, dim = sizes.shape
        single_metric = False
    else:
        msg = f"sizes must be 1D or 2D array, got shape {sizes.shape}"
        raise ValueError(msg)

    if dim not in (2, 3):
        msg = f"sizes must have 2 or 3 components, got {dim}"
        raise ValueError(msg)

    if directions is None:
        directions = np.eye(dim, dtype=np.float64)
        if not single_metric:
            directions = np.broadcast_to(directions, (n_vertices, dim, dim)).copy()

    directions = np.asarray(directions, dtype=np.float64)

    if single_metric and directions.ndim == 2:
        directions = directions.reshape(1, dim, dim)

    if directions.shape[-2:] != (dim, dim):
        msg = f"directions must have shape (..., {dim}, {dim}), got {directions.shape}"
        raise ValueError(msg)

    eigenvalues = 1.0 / (sizes * sizes)
    D = np.zeros((n_vertices, dim, dim), dtype=np.float64)
    for i in range(dim):
        D[:, i, i] = eigenvalues[:, i]

    M = np.einsum("...ij,...jk,...lk->...il", directions, D, directions)

    if dim == 3:
        metric = np.zeros((n_vertices, 6), dtype=np.float64)
        metric[:, 0] = M[:, 0, 0]  # m11
        metric[:, 1] = M[:, 0, 1]  # m12
        metric[:, 2] = M[:, 0, 2]  # m13
        metric[:, 3] = M[:, 1, 1]  # m22
        metric[:, 4] = M[:, 1, 2]  # m23
        metric[:, 5] = M[:, 2, 2]  # m33
    else:
        metric = np.zeros((n_vertices, 3), dtype=np.float64)
        metric[:, 0] = M[:, 0, 0]  # m11
        metric[:, 1] = M[:, 0, 1]  # m12
        metric[:, 2] = M[:, 1, 1]  # m22

    if single_metric:
        return metric[0]
    return metric


def tensor_to_matrix(
    tensor: NDArray[np.float64],
    dim: int | None = None,
) -> NDArray[np.float64]:
    """Convert tensor storage format to full symmetric matrix.

    Parameters
    ----------
    tensor : array_like
        Tensor in storage format. Shape (6,) or (n, 6) for 3D,
        (3,) or (n, 3) for 2D.
    dim : int, optional
        Dimension (2 or 3). Inferred from tensor shape if not provided.

    Returns
    -------
    NDArray[np.float64]
        Full symmetric matrix. Shape (3, 3) or (n, 3, 3) for 3D,
        (2, 2) or (n, 2, 2) for 2D.

    """
    tensor = np.asarray(tensor, dtype=np.float64)
    single = tensor.ndim == 1
    if single:
        tensor = tensor.reshape(1, -1)

    n_components = tensor.shape[1]
    if dim is None:
        dim = 3 if n_components == 6 else 2

    n = tensor.shape[0]
    M = np.zeros((n, dim, dim), dtype=np.float64)

    if dim == 3:
        M[:, 0, 0] = tensor[:, 0]  # m11
        M[:, 0, 1] = tensor[:, 1]  # m12
        M[:, 0, 2] = tensor[:, 2]  # m13
        M[:, 1, 0] = tensor[:, 1]  # m21 = m12
        M[:, 1, 1] = tensor[:, 3]  # m22
        M[:, 1, 2] = tensor[:, 4]  # m23
        M[:, 2, 0] = tensor[:, 2]  # m31 = m13
        M[:, 2, 1] = tensor[:, 4]  # m32 = m23
        M[:, 2, 2] = tensor[:, 5]  # m33
    else:
        M[:, 0, 0] = tensor[:, 0]  # m11
        M[:, 0, 1] = tensor[:, 1]  # m12
        M[:, 1, 0] = tensor[:, 1]  # m21 = m12
        M[:, 1, 1] = tensor[:, 2]  # m22

    if single:
        return M[0]
    return M


def matrix_to_tensor(
    M: NDArray[np.float64],
) -> NDArray[np.float64]:
    """Convert full symmetric matrix to tensor storage format.

    Parameters
    ----------
    M : array_like
        Full symmetric matrix. Shape (3, 3) or (n, 3, 3) for 3D,
        (2, 2) or (n, 2, 2) for 2D.

    Returns
    -------
    NDArray[np.float64]
        Tensor in storage format. Shape (6,) or (n, 6) for 3D,
        (3,) or (n, 3) for 2D.

    """
    M = np.asarray(M, dtype=np.float64)
    single = M.ndim == 2
    if single:
        M = M.reshape(1, *M.shape)

    dim = M.shape[1]
    n = M.shape[0]

    if dim == 3:
        tensor = np.zeros((n, 6), dtype=np.float64)
        tensor[:, 0] = M[:, 0, 0]  # m11
        tensor[:, 1] = M[:, 0, 1]  # m12
        tensor[:, 2] = M[:, 0, 2]  # m13
        tensor[:, 3] = M[:, 1, 1]  # m22
        tensor[:, 4] = M[:, 1, 2]  # m23
        tensor[:, 5] = M[:, 2, 2]  # m33
    else:
        tensor = np.zeros((n, 3), dtype=np.float64)
        tensor[:, 0] = M[:, 0, 0]  # m11
        tensor[:, 1] = M[:, 0, 1]  # m12
        tensor[:, 2] = M[:, 1, 1]  # m22

    if single:
        return tensor[0]
    return tensor


def validate_metric_tensor(
    tensor: NDArray[np.float64],
    dim: int | None = None,
    *,
    raise_on_invalid: bool = True,
) -> tuple[bool, str]:
    """Validate that metric tensor(s) are positive-definite.

    A valid metric tensor must be symmetric positive-definite, meaning
    all eigenvalues must be strictly positive.

    Parameters
    ----------
    tensor : array_like
        Tensor(s) to validate. Shape (6,) or (n, 6) for 3D,
        (3,) or (n, 3) for 2D.
    dim : int, optional
        Dimension (2 or 3). Inferred from tensor shape if not provided.
    raise_on_invalid : bool, optional
        If True, raises ValueError on invalid tensors. Default is True.

    Returns
    -------
    tuple[bool, str]
        (is_valid, message) tuple.

    Raises
    ------
    ValueError
        If raise_on_invalid is True and tensor is not valid.

    Examples
    --------
    >>> valid_tensor = np.array([1.0, 0.0, 0.0, 1.0, 0.0, 1.0])
    >>> validate_metric_tensor(valid_tensor)
    (True, 'Valid positive-definite metric tensor')

    >>> invalid_tensor = np.array([-1.0, 0.0, 0.0, 1.0, 0.0, 1.0])
    >>> validate_metric_tensor(invalid_tensor, raise_on_invalid=False)
    (False, 'Tensor has non-positive eigenvalues...')

    """
    tensor = np.asarray(tensor, dtype=np.float64)
    M = tensor_to_matrix(tensor, dim)

    single = M.ndim == 2
    if single:
        M = M.reshape(1, *M.shape)

    all_valid = True
    messages = []

    for i, m in enumerate(M):
        eigvals = np.linalg.eigvalsh(m)

        if not np.all(eigvals > 0):
            all_valid = False
            prefix = f"Tensor {i}: " if not single else ""
            messages.append(
                f"{prefix}Has non-positive eigenvalues: {eigvals}. "
                "Metric tensors must be positive-definite.",
            )

    if all_valid:
        msg = "Valid positive-definite metric tensor"
        if not single:
            msg += "s"
        return (True, msg)

    error_msg = "; ".join(messages)
    if raise_on_invalid:
        raise ValueError(error_msg)
    return (False, error_msg)


def compute_metric_eigenpairs(
    tensor: NDArray[np.float64],
    dim: int | None = None,
) -> tuple[NDArray[np.float64], NDArray[np.float64]]:
    """Extract principal sizes and directions from metric tensor(s).

    Parameters
    ----------
    tensor : array_like
        Metric tensor(s). Shape (6,) or (n, 6) for 3D, (3,) or (n, 3) for 2D.
    dim : int, optional
        Dimension (2 or 3). Inferred from tensor shape if not provided.

    Returns
    -------
    tuple[NDArray, NDArray]
        (sizes, directions) where:
        - sizes: Principal element sizes, shape (3,) or (n, 3) for 3D
        - directions: Eigenvector matrices, shape (3, 3) or (n, 3, 3) for 3D
          Columns are eigenvectors corresponding to sizes.

    Examples
    --------
    >>> tensor = np.array([100., 0., 0., 1., 0., 1.])  # 10x stretch in x
    >>> sizes, directions = compute_metric_eigenpairs(tensor)
    >>> sizes
    array([0.1, 1. , 1. ])

    """
    M = tensor_to_matrix(tensor, dim)

    single = M.ndim == 2
    if single:
        M = M.reshape(1, *M.shape)

    n = M.shape[0]
    actual_dim = M.shape[1]

    sizes = np.zeros((n, actual_dim), dtype=np.float64)
    directions = np.zeros((n, actual_dim, actual_dim), dtype=np.float64)

    for i, m in enumerate(M):
        eigvals, eigvecs = np.linalg.eigh(m)
        sizes[i] = 1.0 / np.sqrt(eigvals)
        directions[i] = eigvecs

    if single:
        return sizes[0], directions[0]
    return sizes, directions


def intersect_metrics(
    m1: NDArray[np.float64],
    m2: NDArray[np.float64],
    dim: int | None = None,
) -> NDArray[np.float64]:
    """Compute the intersection of two metric tensors.

    The intersection produces a metric that is at least as refined as both
    input metrics in all directions. This is useful for combining metrics
    from different sources (e.g., boundary layer + feature-based).

    The intersection is computed via simultaneous diagonalization:
    M_intersect = M1^(1/2) @ N @ M1^(1/2)
    where N is diagonal with max eigenvalues of M1^(-1/2) @ M2 @ M1^(-1/2).

    Parameters
    ----------
    m1, m2 : array_like
        Metric tensors to intersect. Must have same shape.
        Shape (6,) or (n, 6) for 3D, (3,) or (n, 3) for 2D.
    dim : int, optional
        Dimension (2 or 3). Inferred from tensor shape if not provided.

    Returns
    -------
    NDArray[np.float64]
        Intersected metric tensor(s), same shape as inputs.

    """
    m1 = np.asarray(m1, dtype=np.float64)
    m2 = np.asarray(m2, dtype=np.float64)

    if m1.shape != m2.shape:
        msg = f"Metrics must have same shape: {m1.shape} vs {m2.shape}"
        raise ValueError(msg)

    M1 = tensor_to_matrix(m1, dim)
    M2 = tensor_to_matrix(m2, dim)

    single = M1.ndim == 2
    if single:
        M1 = M1.reshape(1, *M1.shape)
        M2 = M2.reshape(1, *M2.shape)

    n = M1.shape[0]
    M_intersect = np.zeros_like(M1)

    for i in range(n):
        eigvals1, eigvecs1 = np.linalg.eigh(M1[i])

        # Guard against near-singular metrics (eigenvalues close to zero)
        # Use machine epsilon scaled by max eigenvalue for numerical stability
        eps = np.finfo(np.float64).eps * np.max(np.abs(eigvals1)) * 100
        eigvals1 = np.maximum(eigvals1, eps)

        sqrt_eigvals1 = np.sqrt(eigvals1)
        inv_sqrt_eigvals1 = 1.0 / sqrt_eigvals1

        M1_sqrt = eigvecs1 @ np.diag(sqrt_eigvals1) @ eigvecs1.T
        M1_inv_sqrt = eigvecs1 @ np.diag(inv_sqrt_eigvals1) @ eigvecs1.T

        P = M1_inv_sqrt @ M2[i] @ M1_inv_sqrt

        eigvals_P, eigvecs_P = np.linalg.eigh(P)

        max_eigvals = np.maximum(eigvals_P, 1.0)

        M_intersect[i] = (
            M1_sqrt @ eigvecs_P @ np.diag(max_eigvals) @ eigvecs_P.T @ M1_sqrt
        )

    return matrix_to_tensor(M_intersect if not single else M_intersect[0])


def create_metric_from_hessian(
    hessian: NDArray[np.float64],
    target_error: float = 1e-3,
    hmin: float | None = None,
    hmax: float | None = None,
) -> NDArray[np.float64]:
    """Create metric tensor from Hessian matrix for interpolation error control.

    Given a Hessian H of a solution field, constructs a metric M such that
    the interpolation error is bounded by target_error. This is used for
    solution-adaptive mesh refinement.

    The metric eigenvalues are: lambda_i = c * |hessian_eigenvalue_i| / target_error
    where c is a constant depending on the interpolation order.

    Parameters
    ----------
    hessian : array_like
        Hessian tensor(s). Shape (6,) or (n, 6) for 3D, (3,) or (n, 3) for 2D.
        Components: [H11, H12, H13, H22, H23, H33] for 3D.
    target_error : float, optional
        Target interpolation error. Default is 1e-3.
    hmin : float, optional
        Minimum element size. Limits maximum metric eigenvalues.
    hmax : float, optional
        Maximum element size. Limits minimum metric eigenvalues.

    Returns
    -------
    NDArray[np.float64]
        Metric tensor(s) for adaptive remeshing.

    Notes
    -----
    For P1 interpolation, the interpolation error is bounded by:
        e <= (1/8) * h^2 * |d²u/ds²|_max

    This function computes the metric that achieves a specified error bound.

    """
    hessian = np.asarray(hessian, dtype=np.float64)
    H = tensor_to_matrix(hessian)

    single = H.ndim == 2
    if single:
        H = H.reshape(1, *H.shape)

    n = H.shape[0]
    M = np.zeros_like(H)

    c = 1.0 / 8.0

    for i in range(n):
        eigvals, eigvecs = np.linalg.eigh(H[i])
        abs_eigvals = np.abs(eigvals)

        metric_eigvals = c * abs_eigvals / target_error

        # Floor eigenvalues to avoid singular metrics when Hessian is near-zero.
        # 1e-12 corresponds to element sizes up to ~1e6, sufficient for most meshes.
        # This is applied before hmin/hmax bounds which may further constrain values.
        eps = 1e-12
        metric_eigvals = np.maximum(metric_eigvals, eps)

        if hmin is not None:
            max_eigval = 1.0 / (hmin * hmin)
            metric_eigvals = np.minimum(metric_eigvals, max_eigval)

        if hmax is not None:
            min_eigval = 1.0 / (hmax * hmax)
            metric_eigvals = np.maximum(metric_eigvals, min_eigval)

        M[i] = eigvecs @ np.diag(metric_eigvals) @ eigvecs.T

    return matrix_to_tensor(M if not single else M[0])
