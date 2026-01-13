"""Field transfer utilities for mesh-to-mesh interpolation.

This module provides functions for transferring solution fields (scalars, vectors,
tensors) from one mesh to another via interpolation. This is essential for adaptive
simulation workflows where solutions must be preserved across remeshing operations.

Example:
    >>> from mmgpy import Mesh
    >>> from mmgpy._transfer import transfer_fields
    >>>
    >>> old_mesh = Mesh(old_vertices, old_cells)
    >>> new_mesh = Mesh(new_vertices, new_cells)
    >>>
    >>> # Transfer temperature field
    >>> new_temperature = transfer_fields(
    ...     source_vertices=old_mesh.get_vertices(),
    ...     source_elements=old_mesh.get_tetrahedra(),
    ...     target_points=new_mesh.get_vertices(),
    ...     fields={"temperature": temperature_array},
    ... )

"""

from __future__ import annotations

from typing import TYPE_CHECKING

import numpy as np
from scipy.spatial import Delaunay, cKDTree

if TYPE_CHECKING:
    from numpy.typing import NDArray

_TOLERANCE = 1e-15
_TETRA_VERTICES = 4


def _compute_barycentric_tetra(
    points: NDArray[np.float64],
    tetra_vertices: NDArray[np.float64],
) -> NDArray[np.float64]:
    """Compute barycentric coordinates for points in tetrahedra.

    Parameters
    ----------
    points : ndarray
        Query points, shape (n_points, 3).
    tetra_vertices : ndarray
        Tetrahedron vertices, shape (n_points, 4, 3).
        Each row contains the 4 vertices of the tetrahedron containing
        the corresponding point.

    Returns
    -------
    ndarray
        Barycentric coordinates, shape (n_points, 4).
        Each row sums to 1 and represents the weight of each tetrahedron vertex.

    """
    v0 = tetra_vertices[:, 0]
    v1 = tetra_vertices[:, 1]
    v2 = tetra_vertices[:, 2]
    v3 = tetra_vertices[:, 3]

    e1 = v1 - v0
    e2 = v2 - v0
    e3 = v3 - v0
    p = points - v0

    det = np.einsum("ij,ij->i", e1, np.cross(e2, e3))
    det = np.where(np.abs(det) < _TOLERANCE, _TOLERANCE, det)

    b1 = np.einsum("ij,ij->i", p, np.cross(e2, e3)) / det
    b2 = np.einsum("ij,ij->i", e1, np.cross(p, e3)) / det
    b3 = np.einsum("ij,ij->i", e1, np.cross(e2, p)) / det
    b0 = 1.0 - b1 - b2 - b3

    return np.column_stack([b0, b1, b2, b3])


def _compute_barycentric_tri(
    points: NDArray[np.float64],
    tri_vertices: NDArray[np.float64],
) -> NDArray[np.float64]:
    """Compute barycentric coordinates for points in triangles.

    Parameters
    ----------
    points : ndarray
        Query points, shape (n_points, 2) or (n_points, 3).
    tri_vertices : ndarray
        Triangle vertices, shape (n_points, 3, dim).
        Each row contains the 3 vertices of the triangle containing
        the corresponding point.

    Returns
    -------
    ndarray
        Barycentric coordinates, shape (n_points, 3).

    """
    v0 = tri_vertices[:, 0]
    v1 = tri_vertices[:, 1]
    v2 = tri_vertices[:, 2]

    e0 = v1 - v0
    e1 = v2 - v0
    p = points - v0

    d00 = np.einsum("ij,ij->i", e0, e0)
    d01 = np.einsum("ij,ij->i", e0, e1)
    d11 = np.einsum("ij,ij->i", e1, e1)
    d20 = np.einsum("ij,ij->i", p, e0)
    d21 = np.einsum("ij,ij->i", p, e1)

    denom = d00 * d11 - d01 * d01
    denom = np.where(np.abs(denom) < _TOLERANCE, _TOLERANCE, denom)

    b1 = (d11 * d20 - d01 * d21) / denom
    b2 = (d00 * d21 - d01 * d20) / denom
    b0 = 1.0 - b1 - b2

    return np.column_stack([b0, b1, b2])


def interpolate_field(
    source_vertices: NDArray[np.float64],
    source_elements: NDArray[np.int32],
    target_points: NDArray[np.float64],
    field: NDArray[np.float64],
    *,
    method: str = "linear",
) -> NDArray[np.float64]:
    """Interpolate a field from source mesh to target points.

    Parameters
    ----------
    source_vertices : ndarray
        Vertices of the source mesh, shape (n_source_vertices, dim).
    source_elements : ndarray
        Element connectivity of the source mesh.
        Shape (n_elements, 4) for tetrahedra or (n_elements, 3) for triangles.
    target_points : ndarray
        Points where field values are needed, shape (n_target_points, dim).
    field : ndarray
        Field values at source vertices, shape (n_source_vertices,) or
        (n_source_vertices, n_components).
    method : str, default="linear"
        Interpolation method: "linear" for barycentric interpolation,
        "nearest" for nearest vertex interpolation.

    Returns
    -------
    ndarray
        Interpolated field values at target points.
        Shape matches input field shape with n_target_points replacing
        n_source_vertices.

    """
    n_element_verts = source_elements.shape[1]

    field = np.atleast_2d(field)
    if field.shape[0] == 1 and field.shape[1] == len(source_vertices):
        field = field.T
    n_components = field.shape[1]

    delaunay = Delaunay(source_vertices)
    simplex_indices = delaunay.find_simplex(target_points)

    outside_mask = simplex_indices < 0

    # Build KDTree once if needed (for nearest method or fallback for outside points)
    tree: cKDTree | None = None
    if method == "nearest" or np.any(outside_mask):
        tree = cKDTree(source_vertices)

    if method == "nearest":
        assert tree is not None  # noqa: S101
        _, nearest_idx = tree.query(target_points)
        return field[nearest_idx].reshape(len(target_points), n_components).squeeze()

    result = np.zeros((len(target_points), n_components), dtype=np.float64)

    inside_mask = ~outside_mask
    inside_indices = np.where(inside_mask)[0]

    if len(inside_indices) > 0:
        inside_simplices = simplex_indices[inside_indices]
        element_vertex_indices = delaunay.simplices[inside_simplices]

        element_vertices = source_vertices[element_vertex_indices]

        if n_element_verts == _TETRA_VERTICES:
            bary = _compute_barycentric_tetra(
                target_points[inside_indices],
                element_vertices,
            )
        else:
            bary = _compute_barycentric_tri(
                target_points[inside_indices],
                element_vertices,
            )

        field_at_vertices = field[element_vertex_indices]
        result[inside_indices] = np.einsum("ij,ijk->ik", bary, field_at_vertices)

    if np.any(outside_mask):
        assert tree is not None  # noqa: S101
        outside_indices = np.where(outside_mask)[0]
        _, nearest_idx = tree.query(target_points[outside_indices])
        result[outside_indices] = field[nearest_idx]

    return result.squeeze()


def transfer_fields(
    source_vertices: NDArray[np.float64],
    source_elements: NDArray[np.int32],
    target_points: NDArray[np.float64],
    fields: dict[str, NDArray[np.float64]],
    *,
    method: str = "linear",
) -> dict[str, NDArray[np.float64]]:
    """Transfer multiple fields from source mesh to target points.

    Parameters
    ----------
    source_vertices : ndarray
        Vertices of the source mesh.
    source_elements : ndarray
        Element connectivity of the source mesh.
    target_points : ndarray
        Points where field values are needed.
    fields : dict[str, ndarray]
        Dictionary mapping field names to field values at source vertices.
    method : str, default="linear"
        Interpolation method: "linear" or "nearest".

    Returns
    -------
    dict[str, ndarray]
        Dictionary mapping field names to interpolated values at target points.

    Examples
    --------
    >>> result = transfer_fields(
    ...     source_vertices=old_vertices,
    ...     source_elements=old_tetrahedra,
    ...     target_points=new_vertices,
    ...     fields={
    ...         "temperature": temperature,
    ...         "velocity": velocity,
    ...     },
    ... )
    >>> new_temperature = result["temperature"]

    """
    return {
        name: interpolate_field(
            source_vertices,
            source_elements,
            target_points,
            field,
            method=method,
        )
        for name, field in fields.items()
    }


__all__ = [
    "interpolate_field",
    "transfer_fields",
]
