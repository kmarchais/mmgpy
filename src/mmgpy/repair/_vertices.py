"""Vertex repair operations for mmgpy.

This module provides functions for repairing vertex-related mesh issues
including duplicate vertices, orphan vertices, and close vertices.

Note:
    Choosing between ``remove_duplicate_vertices`` and ``merge_close_vertices``:

    - Use ``remove_duplicate_vertices`` (default tolerance=1e-10) for exact or
      near-exact duplicates that result from numerical precision issues or
      mesh generation artifacts.

    - Use ``merge_close_vertices`` (default tolerance=1e-6) when you want to
      merge vertices that are geometrically close but not necessarily duplicates,
      such as when simplifying meshes or cleaning up imported geometry.

    The ``auto_repair`` function uses ``remove_duplicate_vertices`` (strict
    tolerance) to avoid unintentionally merging distinct vertices. Call
    ``merge_close_vertices`` separately if aggressive vertex merging is desired.

"""

from __future__ import annotations

import logging
from typing import TYPE_CHECKING

import numpy as np
from scipy.spatial import cKDTree

if TYPE_CHECKING:
    from mmgpy import Mesh

_logger = logging.getLogger(__name__)

_LARGE_PAIR_THRESHOLD = 100_000


def remove_duplicate_vertices(
    mesh: Mesh,
    tolerance: float = 1e-10,
) -> tuple[Mesh, int]:
    """Remove exact duplicate vertices from the mesh.

    Uses KD-tree for O(n log n) duplicate detection. Vertices within
    the tolerance distance are considered duplicates.

    Parameters
    ----------
    mesh : Mesh
        The mesh to repair.
    tolerance : float, optional
        Distance tolerance for considering vertices as duplicates.
        Default is 1e-10.

    Returns
    -------
    tuple[Mesh, int]
        The repaired mesh and the number of vertices removed.

    Examples
    --------
    >>> from mmgpy import Mesh
    >>> from mmgpy.repair import remove_duplicate_vertices
    >>> mesh = Mesh(vertices, cells)
    >>> mesh, removed_count = remove_duplicate_vertices(mesh)
    >>> print(f"Removed {removed_count} duplicate vertices")

    """
    from mmgpy import Mesh, MeshKind  # noqa: PLC0415

    vertices = mesh.get_vertices()
    n_vertices = len(vertices)
    min_vertices_for_duplicates = 2

    if n_vertices < min_vertices_for_duplicates:
        return mesh, 0

    tree = cKDTree(vertices)
    pairs = tree.query_pairs(r=tolerance, output_type="ndarray")

    if len(pairs) == 0:
        return mesh, 0

    if len(pairs) > _LARGE_PAIR_THRESHOLD:
        _logger.warning(
            "Found %d vertex pairs within tolerance %g. This may indicate "
            "the tolerance is too large or the mesh has many near-coincident "
            "vertices. Consider using a smaller tolerance.",
            len(pairs),
            tolerance,
        )

    mapping = np.arange(n_vertices)
    for i, j in pairs:
        canonical = min(mapping[i], mapping[j])
        mapping[i] = canonical
        mapping[j] = canonical

    for i in range(n_vertices):
        root = i
        while mapping[root] != root:
            root = mapping[root]
        mapping[i] = root

    unique_indices = np.where(mapping == np.arange(n_vertices))[0]
    new_vertices = vertices[unique_indices]

    old_to_new = np.zeros(n_vertices, dtype=np.int32)
    for new_idx, old_idx in enumerate(unique_indices):
        old_to_new[old_idx] = new_idx

    final_mapping = old_to_new[mapping]

    if mesh.kind == MeshKind.TETRAHEDRAL:
        elements = mesh.get_tetrahedra()
        new_elements = final_mapping[elements]
    else:
        elements = mesh.get_triangles()
        new_elements = final_mapping[elements]

    new_mesh = Mesh(new_vertices, new_elements)
    removed_count = n_vertices - len(new_vertices)

    return new_mesh, removed_count


def remove_orphan_vertices(mesh: Mesh) -> tuple[Mesh, int]:
    """Remove vertices not referenced by any element.

    Parameters
    ----------
    mesh : Mesh
        The mesh to repair.

    Returns
    -------
    tuple[Mesh, int]
        The repaired mesh and the number of vertices removed.

    Examples
    --------
    >>> from mmgpy import Mesh
    >>> from mmgpy.repair import remove_orphan_vertices
    >>> mesh = Mesh(vertices, cells)
    >>> mesh, removed_count = remove_orphan_vertices(mesh)
    >>> print(f"Removed {removed_count} orphan vertices")

    """
    from mmgpy import Mesh, MeshKind  # noqa: PLC0415

    vertices = mesh.get_vertices()
    n_vertices = len(vertices)

    if mesh.kind == MeshKind.TETRAHEDRAL:
        elements = mesh.get_tetrahedra()
    else:
        elements = mesh.get_triangles()

    if len(elements) == 0:
        return mesh, 0

    used_vertices = np.unique(elements.flatten())

    if len(used_vertices) == n_vertices:
        return mesh, 0

    new_vertices = vertices[used_vertices]

    old_to_new = np.full(n_vertices, -1, dtype=np.int32)
    old_to_new[used_vertices] = np.arange(len(used_vertices), dtype=np.int32)

    new_elements = old_to_new[elements]

    new_mesh = Mesh(new_vertices, new_elements)
    removed_count = n_vertices - len(new_vertices)

    return new_mesh, removed_count


def merge_close_vertices(
    mesh: Mesh,
    tolerance: float = 1e-6,
) -> tuple[Mesh, int]:
    """Merge vertices that are within tolerance distance of each other.

    Similar to remove_duplicate_vertices but with a larger default tolerance.
    This is useful for meshes with vertices that are nearly coincident but
    not exactly duplicate.

    Parameters
    ----------
    mesh : Mesh
        The mesh to repair.
    tolerance : float, optional
        Distance tolerance for merging vertices. Default is 1e-6.

    Returns
    -------
    tuple[Mesh, int]
        The repaired mesh and the number of vertices merged.

    Examples
    --------
    >>> from mmgpy import Mesh
    >>> from mmgpy.repair import merge_close_vertices
    >>> mesh = Mesh(vertices, cells)
    >>> mesh, merged_count = merge_close_vertices(mesh, tolerance=1e-6)
    >>> print(f"Merged {merged_count} close vertices")

    """
    return remove_duplicate_vertices(mesh, tolerance=tolerance)


__all__ = [
    "merge_close_vertices",
    "remove_duplicate_vertices",
    "remove_orphan_vertices",
]
