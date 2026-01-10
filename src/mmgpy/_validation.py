"""Mesh validation module for mmgpy.

This module provides mesh validation capabilities including geometry checks,
topology checks, and quality assessment.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum
from typing import TYPE_CHECKING

import numpy as np
from scipy.spatial import cKDTree

if TYPE_CHECKING:
    from numpy.typing import NDArray

    from ._mmgpy import MmgMesh2D, MmgMesh3D, MmgMeshS

# Tolerance for geometry checks (volume/area near zero)
_GEOMETRY_TOLERANCE = 1e-15

# Maximum number of issues to display in summary
_MAX_DISPLAYED_ISSUES = 10

# Maximum faces per edge for manifold mesh
_MAX_FACES_PER_MANIFOLD_EDGE = 2

# Minimum vertices for duplicate check
_MIN_VERTICES_FOR_DUPLICATE_CHECK = 2


class IssueSeverity(Enum):
    """Severity level for validation issues."""

    ERROR = "error"
    WARNING = "warning"


@dataclass(frozen=True, slots=True)
class ValidationIssue:
    """A single validation issue found in the mesh.

    Attributes
    ----------
    severity : IssueSeverity
        Whether this is an error (mesh unusable) or warning (may cause issues).
    check_name : str
        Name of the validation check that found this issue.
    message : str
        Human-readable description of the issue.
    element_ids : tuple[int, ...]
        Indices of affected elements (empty for global issues).

    """

    severity: IssueSeverity
    check_name: str
    message: str
    element_ids: tuple[int, ...] = field(default_factory=tuple)


@dataclass(frozen=True, slots=True)
class QualityStats:
    """Statistics about mesh element quality.

    Quality values are normalized to [0, 1] where 1 is a perfect element.

    Attributes
    ----------
    min : float
        Minimum element quality.
    max : float
        Maximum element quality.
    mean : float
        Mean element quality.
    std : float
        Standard deviation of element quality.
    histogram : tuple[tuple[str, int], ...]
        Quality distribution as (bin_label, count) pairs.

    """

    min: float
    max: float
    mean: float
    std: float
    histogram: tuple[tuple[str, int], ...]

    def below_threshold(self, threshold: float) -> int:
        """Count elements below a quality threshold.

        Parameters
        ----------
        threshold : float
            Quality threshold (0-1).

        Returns
        -------
        int
            Number of elements with quality below threshold.

        """
        total = 0
        for bin_label, count in self.histogram:
            bin_upper = float(bin_label.split("-")[1])
            if bin_upper <= threshold:
                total += count
        return total


@dataclass(frozen=True, slots=True)
class ValidationReport:
    """Complete validation report for a mesh.

    Attributes
    ----------
    is_valid : bool
        True if no errors were found (warnings are OK).
    issues : tuple[ValidationIssue, ...]
        All validation issues found.
    quality : QualityStats | None
        Quality statistics (None if quality check was skipped).
    mesh_type : str
        Type of mesh that was validated.

    """

    is_valid: bool
    issues: tuple[ValidationIssue, ...]
    quality: QualityStats | None
    mesh_type: str

    @property
    def errors(self) -> list[ValidationIssue]:
        """Get all error-level issues."""
        return [i for i in self.issues if i.severity == IssueSeverity.ERROR]

    @property
    def warnings(self) -> list[ValidationIssue]:
        """Get all warning-level issues."""
        return [i for i in self.issues if i.severity == IssueSeverity.WARNING]

    def __str__(self) -> str:
        """Return a human-readable summary."""
        lines = [
            f"ValidationReport({self.mesh_type}):",
            f"  Valid: {self.is_valid}",
            f"  Errors: {len(self.errors)}",
            f"  Warnings: {len(self.warnings)}",
        ]
        if self.quality:
            lines.extend(
                [
                    "  Quality:",
                    f"    Min: {self.quality.min:.3f}",
                    f"    Max: {self.quality.max:.3f}",
                    f"    Mean: {self.quality.mean:.3f}",
                ],
            )
        if self.issues:
            lines.append("  Issues:")
            for issue in self.issues[:_MAX_DISPLAYED_ISSUES]:
                severity = "ERROR" if issue.severity == IssueSeverity.ERROR else "WARN"
                lines.append(f"    [{severity}] {issue.message}")
            if len(self.issues) > _MAX_DISPLAYED_ISSUES:
                remaining = len(self.issues) - _MAX_DISPLAYED_ISSUES
                lines.append(f"    ... and {remaining} more")
        return "\n".join(lines)


class ValidationError(Exception):
    """Exception raised when strict validation fails."""

    def __init__(self, report: ValidationReport) -> None:
        """Initialize with a validation report."""
        self.report = report
        issues = report.errors if report.errors else report.warnings
        messages = [i.message for i in issues[:3]]
        super().__init__(f"Mesh validation failed: {'; '.join(messages)}")


def _compute_quality_stats(qualities: NDArray[np.float64]) -> QualityStats:
    """Compute quality statistics from an array of quality values."""
    if len(qualities) == 0:
        return QualityStats(
            min=0.0,
            max=0.0,
            mean=0.0,
            std=0.0,
            histogram=(),
        )

    # Compute histogram with fixed bins
    bins = [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
    hist_counts, _ = np.histogram(qualities, bins=bins)

    histogram = []
    for i, count in enumerate(hist_counts):
        bin_label = f"{bins[i]:.1f}-{bins[i + 1]:.1f}"
        histogram.append((bin_label, int(count)))

    return QualityStats(
        min=float(np.min(qualities)),
        max=float(np.max(qualities)),
        mean=float(np.mean(qualities)),
        std=float(np.std(qualities)),
        histogram=tuple(histogram),
    )


def _check_geometry_3d(
    mesh: MmgMesh3D,
    issues: list[ValidationIssue],
) -> None:
    """Check 3D mesh geometry (positive volumes, valid areas)."""
    vertices = mesh.get_vertices()
    elements = mesh.get_tetrahedra()

    if len(elements) == 0:
        return

    # Vectorized volume computation for all tetrahedra
    # Get vertices for each tetrahedron: shape (n_elements, 4, 3)
    tet_verts = vertices[elements]
    v0, v1, v2, v3 = tet_verts[:, 0], tet_verts[:, 1], tet_verts[:, 2], tet_verts[:, 3]

    # Build edge vectors: shape (n_elements, 3, 3)
    edge_matrices = np.stack([v1 - v0, v2 - v0, v3 - v0], axis=-1)

    # Compute signed volumes using determinant
    volumes = np.linalg.det(edge_matrices) / 6.0

    # Find inverted and degenerate elements
    inverted_mask = volumes < -_GEOMETRY_TOLERANCE
    degenerate_mask = np.abs(volumes) < _GEOMETRY_TOLERANCE

    inverted_indices = np.where(inverted_mask)[0]
    degenerate_indices = np.where(degenerate_mask)[0]

    if len(inverted_indices) > 0:
        issues.append(
            ValidationIssue(
                severity=IssueSeverity.ERROR,
                check_name="inverted_elements",
                message=f"Found {len(inverted_indices)} inverted tetrahedra "
                f"with negative volume",
                element_ids=tuple(int(i) for i in inverted_indices[:100]),
            ),
        )

    if len(degenerate_indices) > 0:
        issues.append(
            ValidationIssue(
                severity=IssueSeverity.WARNING,
                check_name="degenerate_elements",
                message=f"Found {len(degenerate_indices)} degenerate tetrahedra "
                f"with near-zero volume",
                element_ids=tuple(int(i) for i in degenerate_indices[:100]),
            ),
        )


def _check_geometry_2d(
    mesh: MmgMesh2D,
    issues: list[ValidationIssue],
) -> None:
    """Check 2D mesh geometry (positive areas)."""
    vertices = mesh.get_vertices()
    triangles = mesh.get_triangles()

    if len(triangles) == 0:
        return

    # Vectorized area computation for all triangles
    # Get vertices for each triangle: shape (n_elements, 3, 2)
    tri_verts = vertices[triangles]
    v0, v1, v2 = tri_verts[:, 0], tri_verts[:, 1], tri_verts[:, 2]

    # Compute signed area using cross product (2D)
    cross_z = (v1[:, 0] - v0[:, 0]) * (v2[:, 1] - v0[:, 1]) - (v2[:, 0] - v0[:, 0]) * (
        v1[:, 1] - v0[:, 1]
    )
    areas = 0.5 * cross_z

    # Find inverted and degenerate elements
    inverted_mask = areas < -_GEOMETRY_TOLERANCE
    degenerate_mask = np.abs(areas) < _GEOMETRY_TOLERANCE

    inverted_indices = np.where(inverted_mask)[0]
    degenerate_indices = np.where(degenerate_mask)[0]

    if len(inverted_indices) > 0:
        issues.append(
            ValidationIssue(
                severity=IssueSeverity.ERROR,
                check_name="inverted_elements",
                message=f"Found {len(inverted_indices)} inverted triangles "
                f"with negative area",
                element_ids=tuple(int(i) for i in inverted_indices[:100]),
            ),
        )

    if len(degenerate_indices) > 0:
        issues.append(
            ValidationIssue(
                severity=IssueSeverity.WARNING,
                check_name="degenerate_elements",
                message=f"Found {len(degenerate_indices)} degenerate triangles "
                f"with near-zero area",
                element_ids=tuple(int(i) for i in degenerate_indices[:100]),
            ),
        )


def _check_geometry_surface(
    mesh: MmgMeshS,
    issues: list[ValidationIssue],
) -> None:
    """Check surface mesh geometry (positive areas)."""
    vertices = mesh.get_vertices()
    triangles = mesh.get_triangles()

    if len(triangles) == 0:
        return

    # Vectorized area computation for all triangles
    # Get vertices for each triangle: shape (n_elements, 3, 3)
    tri_verts = vertices[triangles]
    v0, v1, v2 = tri_verts[:, 0], tri_verts[:, 1], tri_verts[:, 2]

    # Compute area using cross product (3D)
    edge1 = v1 - v0
    edge2 = v2 - v0
    cross = np.cross(edge1, edge2)
    areas = 0.5 * np.linalg.norm(cross, axis=1)

    # Find degenerate elements
    degenerate_mask = areas < _GEOMETRY_TOLERANCE
    degenerate_indices = np.where(degenerate_mask)[0]

    if len(degenerate_indices) > 0:
        issues.append(
            ValidationIssue(
                severity=IssueSeverity.WARNING,
                check_name="degenerate_elements",
                message=f"Found {len(degenerate_indices)} degenerate triangles "
                f"with near-zero area",
                element_ids=tuple(int(i) for i in degenerate_indices[:100]),
            ),
        )


def _check_topology_surface(
    mesh: MmgMeshS | MmgMesh2D,
    issues: list[ValidationIssue],
    mesh_type: str,
) -> None:
    """Check surface/2D mesh topology (manifold edges, watertight)."""
    triangles = mesh.get_triangles()

    if len(triangles) == 0:
        return

    # Build edge-to-face mapping
    edge_faces: dict[tuple[int, int], list[int]] = {}
    for face_idx, tri in enumerate(triangles):
        for j in range(3):
            v1, v2 = int(tri[j]), int(tri[(j + 1) % 3])
            edge = (min(v1, v2), max(v1, v2))
            if edge not in edge_faces:
                edge_faces[edge] = []
            edge_faces[edge].append(face_idx)

    # Check for non-manifold edges (shared by >2 faces)
    non_manifold_edges = []
    boundary_edges = []

    for edge, faces in edge_faces.items():
        if len(faces) > _MAX_FACES_PER_MANIFOLD_EDGE:
            non_manifold_edges.append(edge)
        elif len(faces) == 1:
            boundary_edges.append(edge)

    if non_manifold_edges:
        issues.append(
            ValidationIssue(
                severity=IssueSeverity.ERROR,
                check_name="non_manifold_edges",
                message=f"Found {len(non_manifold_edges)} non-manifold edges "
                f"(shared by more than 2 faces)",
                element_ids=(),
            ),
        )

    if boundary_edges and mesh_type == "surface":
        issues.append(
            ValidationIssue(
                severity=IssueSeverity.WARNING,
                check_name="open_boundary",
                message=f"Found {len(boundary_edges)} boundary edges "
                f"(mesh is not watertight)",
                element_ids=(),
            ),
        )


def _check_orphan_vertices(
    vertices: NDArray[np.float64],
    elements: NDArray[np.int32],
    issues: list[ValidationIssue],
) -> None:
    """Check for vertices not referenced by any element."""
    if len(vertices) == 0 or len(elements) == 0:
        return

    used_vertices = set(elements.flatten())
    all_vertices = set(range(len(vertices)))
    orphan_vertices = all_vertices - used_vertices

    if orphan_vertices:
        issues.append(
            ValidationIssue(
                severity=IssueSeverity.WARNING,
                check_name="orphan_vertices",
                message=f"Found {len(orphan_vertices)} orphan vertices "
                f"not referenced by any element",
                element_ids=tuple(sorted(orphan_vertices)[:100]),
            ),
        )


def _check_quality(
    qualities: NDArray[np.float64],
    min_quality: float,
    issues: list[ValidationIssue],
) -> None:
    """Check element quality against threshold."""
    if len(qualities) == 0:
        return

    low_quality_mask = qualities < min_quality
    low_quality_count = int(np.sum(low_quality_mask))

    if low_quality_count > 0:
        low_quality_indices = np.where(low_quality_mask)[0]
        issues.append(
            ValidationIssue(
                severity=IssueSeverity.WARNING,
                check_name="low_quality",
                message=f"Found {low_quality_count} elements with quality "
                f"below {min_quality:.2f}",
                element_ids=tuple(int(i) for i in low_quality_indices[:100]),
            ),
        )


def _check_duplicate_vertices(
    vertices: NDArray[np.float64],
    issues: list[ValidationIssue],
    tolerance: float = 1e-10,
) -> None:
    """Check for duplicate (coincident) vertices using KD-tree.

    Time complexity: O(n log n) for tree construction, O(n) expected for queries.
    Space complexity: O(n)
    """
    if len(vertices) < _MIN_VERTICES_FOR_DUPLICATE_CHECK:
        return

    tree = cKDTree(vertices)
    pairs = tree.query_pairs(r=tolerance, output_type="ndarray")

    if len(pairs) > 0:
        issues.append(
            ValidationIssue(
                severity=IssueSeverity.WARNING,
                check_name="duplicate_vertices",
                message=f"Found {len(pairs)} duplicate vertex pairs "
                f"within tolerance {tolerance}",
                element_ids=(),
            ),
        )


def validate_mesh_3d(
    mesh: MmgMesh3D,
    *,
    check_geometry: bool = True,
    check_topology: bool = True,
    check_quality: bool = True,
    min_quality: float = 0.1,
) -> ValidationReport:
    """Validate a 3D tetrahedral mesh.

    Parameters
    ----------
    mesh : MmgMesh3D
        The mesh to validate.
    check_geometry : bool
        Check for geometric issues (inverted/degenerate elements).
    check_topology : bool
        Check for topological issues (orphan vertices).
    check_quality : bool
        Check element quality against threshold.
    min_quality : float
        Minimum acceptable element quality (0-1).

    Returns
    -------
    ValidationReport
        Complete validation report.

    """
    issues: list[ValidationIssue] = []
    quality_stats: QualityStats | None = None

    vertices = mesh.get_vertices()
    elements = mesh.get_tetrahedra()

    if check_geometry:
        _check_geometry_3d(mesh, issues)
        _check_duplicate_vertices(vertices, issues)

    if check_topology:
        _check_orphan_vertices(vertices, elements, issues)

    if check_quality and len(elements) > 0:
        qualities = mesh.get_element_qualities()
        quality_stats = _compute_quality_stats(qualities)
        _check_quality(qualities, min_quality, issues)

    has_errors = any(i.severity == IssueSeverity.ERROR for i in issues)

    return ValidationReport(
        is_valid=not has_errors,
        issues=tuple(issues),
        quality=quality_stats,
        mesh_type="MmgMesh3D",
    )


def validate_mesh_2d(
    mesh: MmgMesh2D,
    *,
    check_geometry: bool = True,
    check_topology: bool = True,
    check_quality: bool = True,
    min_quality: float = 0.1,
) -> ValidationReport:
    """Validate a 2D planar mesh.

    Parameters
    ----------
    mesh : MmgMesh2D
        The mesh to validate.
    check_geometry : bool
        Check for geometric issues (inverted/degenerate elements).
    check_topology : bool
        Check for topological issues (orphan vertices, non-manifold edges).
    check_quality : bool
        Check element quality against threshold.
    min_quality : float
        Minimum acceptable element quality (0-1).

    Returns
    -------
    ValidationReport
        Complete validation report.

    """
    issues: list[ValidationIssue] = []
    quality_stats: QualityStats | None = None

    vertices = mesh.get_vertices()
    triangles = mesh.get_triangles()

    if check_geometry:
        _check_geometry_2d(mesh, issues)
        _check_duplicate_vertices(vertices, issues)

    if check_topology:
        _check_orphan_vertices(vertices, triangles, issues)
        _check_topology_surface(mesh, issues, "2d")

    if check_quality and len(triangles) > 0:
        qualities = mesh.get_element_qualities()
        quality_stats = _compute_quality_stats(qualities)
        _check_quality(qualities, min_quality, issues)

    has_errors = any(i.severity == IssueSeverity.ERROR for i in issues)

    return ValidationReport(
        is_valid=not has_errors,
        issues=tuple(issues),
        quality=quality_stats,
        mesh_type="MmgMesh2D",
    )


def validate_mesh_surface(
    mesh: MmgMeshS,
    *,
    check_geometry: bool = True,
    check_topology: bool = True,
    check_quality: bool = True,
    min_quality: float = 0.1,
) -> ValidationReport:
    """Validate a surface mesh.

    Parameters
    ----------
    mesh : MmgMeshS
        The mesh to validate.
    check_geometry : bool
        Check for geometric issues (degenerate elements).
    check_topology : bool
        Check for topological issues (orphan vertices, non-manifold edges).
    check_quality : bool
        Check element quality against threshold.
    min_quality : float
        Minimum acceptable element quality (0-1).

    Returns
    -------
    ValidationReport
        Complete validation report.

    """
    issues: list[ValidationIssue] = []
    quality_stats: QualityStats | None = None

    vertices = mesh.get_vertices()
    triangles = mesh.get_triangles()

    if check_geometry:
        _check_geometry_surface(mesh, issues)
        _check_duplicate_vertices(vertices, issues)

    if check_topology:
        _check_orphan_vertices(vertices, triangles, issues)
        _check_topology_surface(mesh, issues, "surface")

    if check_quality and len(triangles) > 0:
        qualities = mesh.get_element_qualities()
        quality_stats = _compute_quality_stats(qualities)
        _check_quality(qualities, min_quality, issues)

    has_errors = any(i.severity == IssueSeverity.ERROR for i in issues)

    return ValidationReport(
        is_valid=not has_errors,
        issues=tuple(issues),
        quality=quality_stats,
        mesh_type="MmgMeshS",
    )


__all__ = [
    "IssueSeverity",
    "QualityStats",
    "ValidationError",
    "ValidationIssue",
    "ValidationReport",
    "validate_mesh_2d",
    "validate_mesh_3d",
    "validate_mesh_surface",
]
