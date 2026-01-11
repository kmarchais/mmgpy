"""Element repair operations for mmgpy.

This module provides functions for repairing element-related mesh issues
including degenerate elements, inverted elements, and duplicate elements.
"""

from __future__ import annotations

from typing import TYPE_CHECKING

import numpy as np

if TYPE_CHECKING:
    from mmgpy import Mesh

_GEOMETRY_TOLERANCE = 1e-10


def _compute_tetra_volumes(
    vertices: np.ndarray,
    tetrahedra: np.ndarray,
) -> np.ndarray:
    """Compute signed volumes for tetrahedra."""
    tet_verts = vertices[tetrahedra]
    v0, v1, v2, v3 = tet_verts[:, 0], tet_verts[:, 1], tet_verts[:, 2], tet_verts[:, 3]
    edge_matrices = np.stack([v1 - v0, v2 - v0, v3 - v0], axis=-1)
    return np.linalg.det(edge_matrices) / 6.0


def _compute_triangle_areas_2d(
    vertices: np.ndarray,
    triangles: np.ndarray,
) -> np.ndarray:
    """Compute signed areas for 2D triangles."""
    tri_verts = vertices[triangles]
    v0, v1, v2 = tri_verts[:, 0], tri_verts[:, 1], tri_verts[:, 2]
    cross_z = (v1[:, 0] - v0[:, 0]) * (v2[:, 1] - v0[:, 1]) - (v2[:, 0] - v0[:, 0]) * (
        v1[:, 1] - v0[:, 1]
    )
    return 0.5 * cross_z


def _compute_triangle_areas_3d(
    vertices: np.ndarray,
    triangles: np.ndarray,
) -> np.ndarray:
    """Compute areas for 3D triangles (unsigned)."""
    tri_verts = vertices[triangles]
    v0, v1, v2 = tri_verts[:, 0], tri_verts[:, 1], tri_verts[:, 2]
    edge1 = v1 - v0
    edge2 = v2 - v0
    cross = np.cross(edge1, edge2)
    return 0.5 * np.linalg.norm(cross, axis=1)


def remove_degenerate_elements(
    mesh: Mesh,
    tolerance: float = 1e-10,
) -> tuple[Mesh, int]:
    """Remove elements with zero or near-zero volume/area.

    Parameters
    ----------
    mesh : Mesh
        The mesh to repair.
    tolerance : float, optional
        Tolerance for considering an element as degenerate.
        Default is 1e-10.

    Returns
    -------
    tuple[Mesh, int]
        The repaired mesh and the number of elements removed.

    Examples
    --------
    >>> from mmgpy import Mesh
    >>> from mmgpy.repair import remove_degenerate_elements
    >>> mesh = Mesh(vertices, cells)
    >>> mesh, removed_count = remove_degenerate_elements(mesh)
    >>> print(f"Removed {removed_count} degenerate elements")

    """
    from mmgpy import Mesh, MeshKind  # noqa: PLC0415
    from mmgpy.repair._vertices import remove_orphan_vertices  # noqa: PLC0415

    vertices = mesh.get_vertices()

    if mesh.kind == MeshKind.TETRAHEDRAL:
        elements = mesh.get_tetrahedra()
        if len(elements) == 0:
            return mesh, 0
        volumes = _compute_tetra_volumes(vertices, elements)
        valid_mask = np.abs(volumes) >= tolerance
    elif mesh.kind == MeshKind.TRIANGULAR_2D:
        elements = mesh.get_triangles()
        if len(elements) == 0:
            return mesh, 0
        areas = _compute_triangle_areas_2d(vertices, elements)
        valid_mask = np.abs(areas) >= tolerance
    else:  # TRIANGULAR_SURFACE
        elements = mesh.get_triangles()
        if len(elements) == 0:
            return mesh, 0
        areas = _compute_triangle_areas_3d(vertices, elements)
        valid_mask = areas >= tolerance

    removed_count = int(np.sum(~valid_mask))

    if removed_count == 0:
        return mesh, 0

    new_elements = elements[valid_mask]
    new_mesh = Mesh(vertices.copy(), new_elements)
    new_mesh, _ = remove_orphan_vertices(new_mesh)

    return new_mesh, removed_count


def fix_inverted_elements(mesh: Mesh) -> tuple[Mesh, int]:
    """Fix inverted elements by reversing their vertex order.

    Inverted elements have negative volume (tetrahedra) or negative area
    (2D triangles). This function flips the orientation to make them positive.

    Note
    ----
    For surface meshes (TRIANGULAR_SURFACE), this function returns immediately
    without making changes. Surface mesh orientation is determined by normal
    direction which requires additional context (e.g., inside/outside knowledge)
    that cannot be inferred from geometry alone. Use mesh-specific tools for
    surface normal correction if needed.

    Parameters
    ----------
    mesh : Mesh
        The mesh to repair.

    Returns
    -------
    tuple[Mesh, int]
        The repaired mesh and the number of elements fixed.

    Examples
    --------
    >>> from mmgpy import Mesh
    >>> from mmgpy.repair import fix_inverted_elements
    >>> mesh = Mesh(vertices, cells)
    >>> mesh, fixed_count = fix_inverted_elements(mesh)
    >>> print(f"Fixed {fixed_count} inverted elements")

    """
    from mmgpy import Mesh, MeshKind  # noqa: PLC0415

    vertices = mesh.get_vertices()

    if mesh.kind == MeshKind.TETRAHEDRAL:
        elements = mesh.get_tetrahedra().copy()
        if len(elements) == 0:
            return mesh, 0
        volumes = _compute_tetra_volumes(vertices, elements)
        inverted_mask = volumes < -_GEOMETRY_TOLERANCE
        elements[inverted_mask] = elements[inverted_mask][:, [0, 2, 1, 3]]
    elif mesh.kind == MeshKind.TRIANGULAR_2D:
        elements = mesh.get_triangles().copy()
        if len(elements) == 0:
            return mesh, 0
        areas = _compute_triangle_areas_2d(vertices, elements)
        inverted_mask = areas < -_GEOMETRY_TOLERANCE
        elements[inverted_mask] = elements[inverted_mask][:, [0, 2, 1]]
    else:  # TRIANGULAR_SURFACE
        return mesh, 0

    fixed_count = int(np.sum(inverted_mask))

    if fixed_count == 0:
        return mesh, 0

    new_mesh = Mesh(vertices.copy(), elements)
    return new_mesh, fixed_count


def remove_duplicate_elements(mesh: Mesh) -> tuple[Mesh, int]:
    """Remove duplicate elements (same vertices, any order).

    Elements are considered duplicates if they reference the same set
    of vertices, regardless of the vertex ordering.

    Parameters
    ----------
    mesh : Mesh
        The mesh to repair.

    Returns
    -------
    tuple[Mesh, int]
        The repaired mesh and the number of elements removed.

    Examples
    --------
    >>> from mmgpy import Mesh
    >>> from mmgpy.repair import remove_duplicate_elements
    >>> mesh = Mesh(vertices, cells)
    >>> mesh, removed_count = remove_duplicate_elements(mesh)
    >>> print(f"Removed {removed_count} duplicate elements")

    """
    from mmgpy import Mesh, MeshKind  # noqa: PLC0415
    from mmgpy.repair._vertices import remove_orphan_vertices  # noqa: PLC0415

    vertices = mesh.get_vertices()

    if mesh.kind == MeshKind.TETRAHEDRAL:
        elements = mesh.get_tetrahedra()
    else:
        elements = mesh.get_triangles()

    if len(elements) == 0:
        return mesh, 0

    sorted_elements = np.sort(elements, axis=1)
    _, unique_indices = np.unique(sorted_elements, axis=0, return_index=True)
    unique_indices = np.sort(unique_indices)

    removed_count = len(elements) - len(unique_indices)

    if removed_count == 0:
        return mesh, 0

    new_elements = elements[unique_indices]
    new_mesh = Mesh(vertices.copy(), new_elements)
    new_mesh, _ = remove_orphan_vertices(new_mesh)

    return new_mesh, removed_count


__all__ = [
    "fix_inverted_elements",
    "remove_degenerate_elements",
    "remove_duplicate_elements",
]
