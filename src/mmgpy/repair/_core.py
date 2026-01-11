"""Core repair functionality for mmgpy.

This module provides the auto_repair convenience function and the RepairReport
dataclass for summarizing repair operations.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from mmgpy import Mesh


@dataclass(frozen=True, slots=True)
class RepairReport:
    """Report summarizing mesh repair operations.

    Attributes
    ----------
    duplicate_vertices_removed : int
        Number of duplicate vertices removed.
    orphan_vertices_removed : int
        Number of orphan vertices removed.
    degenerate_elements_removed : int
        Number of degenerate elements removed.
    inverted_elements_fixed : int
        Number of inverted elements fixed.
    duplicate_elements_removed : int
        Number of duplicate elements removed.
    vertices_before : int
        Number of vertices before repair.
    vertices_after : int
        Number of vertices after repair.
    elements_before : int
        Number of elements before repair.
    elements_after : int
        Number of elements after repair.
    operations_applied : tuple[str, ...]
        Names of repair operations that were applied.

    Examples
    --------
    >>> from mmgpy.repair import auto_repair
    >>> mesh, report = auto_repair(mesh)
    >>> print(report)
    RepairReport:
      Duplicate vertices removed: 12
      Orphan vertices removed: 3
      Degenerate elements removed: 2
      Inverted elements fixed: 5
    >>> print(f"Vertices: {report.vertices_before} -> {report.vertices_after}")

    """

    duplicate_vertices_removed: int = 0
    orphan_vertices_removed: int = 0
    degenerate_elements_removed: int = 0
    inverted_elements_fixed: int = 0
    duplicate_elements_removed: int = 0
    vertices_before: int = 0
    vertices_after: int = 0
    elements_before: int = 0
    elements_after: int = 0
    operations_applied: tuple[str, ...] = field(default_factory=tuple)

    @property
    def total_repairs(self) -> int:
        """Total number of repairs made."""
        return (
            self.duplicate_vertices_removed
            + self.orphan_vertices_removed
            + self.degenerate_elements_removed
            + self.inverted_elements_fixed
            + self.duplicate_elements_removed
        )

    @property
    def was_modified(self) -> bool:
        """True if any repairs were made."""
        return self.total_repairs > 0

    def __str__(self) -> str:
        """Return a human-readable summary."""
        lines = ["RepairReport:"]

        if self.duplicate_vertices_removed > 0:
            lines.append(
                f"  Duplicate vertices removed: {self.duplicate_vertices_removed}",
            )
        if self.orphan_vertices_removed > 0:
            lines.append(f"  Orphan vertices removed: {self.orphan_vertices_removed}")
        if self.degenerate_elements_removed > 0:
            lines.append(
                f"  Degenerate elements removed: {self.degenerate_elements_removed}",
            )
        if self.inverted_elements_fixed > 0:
            lines.append(f"  Inverted elements fixed: {self.inverted_elements_fixed}")
        if self.duplicate_elements_removed > 0:
            lines.append(
                f"  Duplicate elements removed: {self.duplicate_elements_removed}",
            )

        if len(lines) == 1:
            lines.append("  No repairs needed")
        else:
            lines.append(
                f"  Vertices: {self.vertices_before} -> {self.vertices_after}",
            )
            lines.append(f"  Elements: {self.elements_before} -> {self.elements_after}")

        return "\n".join(lines)


def auto_repair(
    mesh: Mesh,
    *,
    duplicate_tolerance: float = 1e-10,
    degenerate_tolerance: float = 1e-10,
) -> tuple[Mesh, RepairReport]:
    """Apply all safe repair operations to the mesh.

    This convenience function applies the following repairs in order:
    1. Remove duplicate vertices
    2. Remove degenerate elements
    3. Fix inverted elements
    4. Remove duplicate elements
    5. Remove orphan vertices (cleanup)

    Parameters
    ----------
    mesh : Mesh
        The mesh to repair.
    duplicate_tolerance : float, optional
        Tolerance for duplicate vertex detection. Default is 1e-10.
    degenerate_tolerance : float, optional
        Tolerance for degenerate element detection. Default is 1e-10.

    Returns
    -------
    tuple[Mesh, RepairReport]
        The repaired mesh and a report summarizing the operations.

    Examples
    --------
    >>> from mmgpy import Mesh
    >>> from mmgpy.repair import auto_repair
    >>> mesh = Mesh(vertices, cells)
    >>> mesh, report = auto_repair(mesh)
    >>> if report.was_modified:
    ...     print(f"Applied {report.total_repairs} repairs")
    ...     print(report)

    """
    from mmgpy import MeshKind  # noqa: PLC0415
    from mmgpy.repair._elements import (  # noqa: PLC0415
        fix_inverted_elements,
        remove_degenerate_elements,
        remove_duplicate_elements,
    )
    from mmgpy.repair._vertices import (  # noqa: PLC0415
        remove_duplicate_vertices,
        remove_orphan_vertices,
    )

    vertices_before = len(mesh.get_vertices())
    if mesh.kind == MeshKind.TETRAHEDRAL:
        elements_before = len(mesh.get_tetrahedra())
    else:
        elements_before = len(mesh.get_triangles())

    operations_applied: list[str] = []

    mesh, duplicate_verts = remove_duplicate_vertices(
        mesh,
        tolerance=duplicate_tolerance,
    )
    if duplicate_verts > 0:
        operations_applied.append("remove_duplicate_vertices")

    mesh, degenerate_elems = remove_degenerate_elements(
        mesh,
        tolerance=degenerate_tolerance,
    )
    if degenerate_elems > 0:
        operations_applied.append("remove_degenerate_elements")

    mesh, inverted_elems = fix_inverted_elements(mesh)
    if inverted_elems > 0:
        operations_applied.append("fix_inverted_elements")

    mesh, duplicate_elems = remove_duplicate_elements(mesh)
    if duplicate_elems > 0:
        operations_applied.append("remove_duplicate_elements")

    mesh, orphan_verts = remove_orphan_vertices(mesh)
    if orphan_verts > 0:
        operations_applied.append("remove_orphan_vertices")

    vertices_after = len(mesh.get_vertices())
    if mesh.kind == MeshKind.TETRAHEDRAL:
        elements_after = len(mesh.get_tetrahedra())
    else:
        elements_after = len(mesh.get_triangles())

    report = RepairReport(
        duplicate_vertices_removed=duplicate_verts,
        orphan_vertices_removed=orphan_verts,
        degenerate_elements_removed=degenerate_elems,
        inverted_elements_fixed=inverted_elems,
        duplicate_elements_removed=duplicate_elems,
        vertices_before=vertices_before,
        vertices_after=vertices_after,
        elements_before=elements_before,
        elements_after=elements_after,
        operations_applied=tuple(operations_applied),
    )

    return mesh, report


__all__ = [
    "RepairReport",
    "auto_repair",
]
