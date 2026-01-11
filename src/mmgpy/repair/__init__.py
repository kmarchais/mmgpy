"""Mesh repair utilities module for mmgpy.

This module provides utilities for repairing common mesh issues including
duplicate vertices, orphan vertices, degenerate elements, and inverted elements.

Example:
    >>> from mmgpy import Mesh
    >>> from mmgpy.repair import auto_repair, remove_duplicate_vertices
    >>>
    >>> mesh = Mesh(vertices, cells)
    >>> mesh, report = auto_repair(mesh)
    >>> print(report)

"""

from mmgpy.repair._core import RepairReport, auto_repair
from mmgpy.repair._elements import (
    fix_inverted_elements,
    remove_degenerate_elements,
    remove_duplicate_elements,
)
from mmgpy.repair._vertices import (
    merge_close_vertices,
    remove_duplicate_vertices,
    remove_orphan_vertices,
)

__all__ = [
    "RepairReport",
    "auto_repair",
    "fix_inverted_elements",
    "merge_close_vertices",
    "remove_degenerate_elements",
    "remove_duplicate_elements",
    "remove_duplicate_vertices",
    "remove_orphan_vertices",
]
