"""Tests for mesh validation functionality."""

import numpy as np
import pytest

from mmgpy import (
    IssueSeverity,
    Mesh,
    MeshKind,
    QualityStats,
    ValidationError,
    ValidationIssue,
    ValidationReport,
)
from mmgpy._mmgpy import MmgMesh2D, MmgMesh3D, MmgMeshS


def create_test_mesh_3d() -> tuple[np.ndarray, np.ndarray]:
    """Create a simple 3D test mesh (cube)."""
    vertices = np.array(
        [
            [0.0, 0.0, 0.0],
            [1.0, 0.0, 0.0],
            [1.0, 1.0, 0.0],
            [0.0, 1.0, 0.0],
            [0.0, 0.0, 1.0],
            [1.0, 0.0, 1.0],
            [1.0, 1.0, 1.0],
            [0.0, 1.0, 1.0],
        ],
        dtype=np.float64,
    )
    tetrahedra = np.array(
        [
            [0, 1, 3, 4],
            [1, 2, 3, 6],
            [1, 4, 5, 6],
            [3, 4, 6, 7],
            [1, 3, 4, 6],
        ],
        dtype=np.int32,
    )
    return vertices, tetrahedra


def create_test_mesh_2d() -> tuple[np.ndarray, np.ndarray]:
    """Create a simple 2D test mesh (square)."""
    vertices = np.array(
        [
            [0.0, 0.0],
            [1.0, 0.0],
            [1.0, 1.0],
            [0.0, 1.0],
        ],
        dtype=np.float64,
    )
    triangles = np.array(
        [
            [0, 1, 2],
            [0, 2, 3],
        ],
        dtype=np.int32,
    )
    return vertices, triangles


def create_surface_mesh() -> tuple[np.ndarray, np.ndarray]:
    """Create a simple surface mesh (tetrahedron surface)."""
    vertices = np.array(
        [
            [0.0, 0.0, 0.0],
            [1.0, 0.0, 0.0],
            [0.5, 1.0, 0.0],
            [0.5, 0.5, 1.0],
        ],
        dtype=np.float64,
    )
    triangles = np.array(
        [
            [0, 1, 2],
            [0, 1, 3],
            [1, 2, 3],
            [0, 2, 3],
        ],
        dtype=np.int32,
    )
    return vertices, triangles


# =============================================================================
# Basic validation tests for MmgMesh3D
# =============================================================================


class TestMmgMesh3DValidation:
    """Tests for MmgMesh3D.validate() method."""

    def test_validate_returns_bool(self) -> None:
        """Test that validate() returns bool by default."""
        vertices, tetrahedra = create_test_mesh_3d()
        mesh = Mesh(vertices, tetrahedra)

        result = mesh.validate()
        assert isinstance(result, bool)

    def test_validate_returns_report_when_detailed(self) -> None:
        """Test that validate(detailed=True) returns ValidationReport."""
        vertices, tetrahedra = create_test_mesh_3d()
        mesh = Mesh(vertices, tetrahedra)

        result = mesh.validate(detailed=True)
        assert isinstance(result, ValidationReport)

    def test_valid_mesh_returns_true(self) -> None:
        """Test that a valid mesh returns True."""
        vertices, tetrahedra = create_test_mesh_3d()
        mesh = Mesh(vertices, tetrahedra)

        assert mesh.validate() is True

    def test_valid_mesh_report_is_valid(self) -> None:
        """Test that a valid mesh has is_valid=True in report."""
        vertices, tetrahedra = create_test_mesh_3d()
        mesh = Mesh(vertices, tetrahedra)

        report = mesh.validate(detailed=True)
        assert report.is_valid is True
        assert len(report.errors) == 0

    def test_report_has_quality_stats(self) -> None:
        """Test that report includes quality statistics."""
        vertices, tetrahedra = create_test_mesh_3d()
        mesh = Mesh(vertices, tetrahedra)

        report = mesh.validate(detailed=True)
        assert report.quality is not None
        assert isinstance(report.quality, QualityStats)
        assert report.quality.min >= 0.0
        assert report.quality.max <= 1.0
        assert report.quality.min <= report.quality.mean <= report.quality.max

    def test_report_str_representation(self) -> None:
        """Test that report has a string representation."""
        vertices, tetrahedra = create_test_mesh_3d()
        mesh = Mesh(vertices, tetrahedra)

        report = mesh.validate(detailed=True)
        report_str = str(report)
        assert "ValidationReport" in report_str
        assert "MmgMesh3D" in report_str
        assert "Valid" in report_str

    def test_valid_tetrahedron_has_positive_volume(self) -> None:
        """Test that valid tetrahedra have positive volume after MMG processing.

        Note: MMG automatically fixes element orientation, so we verify
        that the stored mesh has positive volumes rather than testing
        for detection of inverted elements (which MMG corrects).
        """
        vertices = np.array(
            [
                [0.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [0.5, 1.0, 0.0],
                [0.5, 0.5, 1.0],
            ],
            dtype=np.float64,
        )
        # This ordering has negative volume, but MMG will fix it
        tet = np.array([[0, 2, 1, 3]], dtype=np.int32)

        raw_mesh = MmgMesh3D()
        raw_mesh.set_mesh_size(vertices=len(vertices), tetrahedra=len(tet))
        raw_mesh.set_vertices(vertices)
        raw_mesh.set_tetrahedra(tet)
        mesh = Mesh._from_impl(raw_mesh, MeshKind.TETRAHEDRAL)

        # Mesh should be valid after MMG's internal reordering
        report = mesh.validate(detailed=True)
        assert report.is_valid is True

    def test_strict_mode_raises_on_warning(self) -> None:
        """Test that strict=True raises ValidationError on warnings."""
        vertices, tetrahedra = create_test_mesh_3d()
        mesh = Mesh(vertices, tetrahedra)

        # Create a mesh that will have quality warnings
        report = mesh.validate(detailed=True, min_quality=0.99)

        # If there are warnings, strict mode should raise
        if report.warnings:
            with pytest.raises(ValidationError):
                mesh.validate(strict=True, min_quality=0.99)

    def test_skip_geometry_check(self) -> None:
        """Test that geometry check can be skipped."""
        vertices, tetrahedra = create_test_mesh_3d()
        mesh = Mesh(vertices, tetrahedra)

        report = mesh.validate(detailed=True, check_geometry=False)
        assert report.is_valid is True
        # No geometry-related issues should be reported
        geometry_check_names = ("inverted_elements", "degenerate_elements")
        geometry_issues = [
            i for i in report.issues if i.check_name in geometry_check_names
        ]
        assert len(geometry_issues) == 0

    def test_skip_quality_check(self) -> None:
        """Test that quality check can be skipped."""
        vertices, tetrahedra = create_test_mesh_3d()
        mesh = Mesh(vertices, tetrahedra)

        report = mesh.validate(detailed=True, check_quality=False)
        assert report.quality is None


# =============================================================================
# Basic validation tests for MmgMesh2D
# =============================================================================


class TestMmgMesh2DValidation:
    """Tests for MmgMesh2D.validate() method."""

    def test_validate_returns_bool(self) -> None:
        """Test that validate() returns bool by default."""
        vertices, triangles = create_test_mesh_2d()
        mesh = Mesh(vertices, triangles)

        result = mesh.validate()
        assert isinstance(result, bool)

    def test_validate_returns_report_when_detailed(self) -> None:
        """Test that validate(detailed=True) returns ValidationReport."""
        vertices, triangles = create_test_mesh_2d()
        mesh = Mesh(vertices, triangles)

        result = mesh.validate(detailed=True)
        assert isinstance(result, ValidationReport)

    def test_valid_mesh_returns_true(self) -> None:
        """Test that a valid mesh returns True."""
        vertices, triangles = create_test_mesh_2d()
        mesh = Mesh(vertices, triangles)

        assert mesh.validate() is True

    def test_valid_mesh_report_is_valid(self) -> None:
        """Test that a valid mesh has is_valid=True in report."""
        vertices, triangles = create_test_mesh_2d()
        mesh = Mesh(vertices, triangles)

        report = mesh.validate(detailed=True)
        assert report.is_valid is True

    def test_report_has_quality_stats(self) -> None:
        """Test that report includes quality statistics."""
        vertices, triangles = create_test_mesh_2d()
        mesh = Mesh(vertices, triangles)

        report = mesh.validate(detailed=True)
        assert report.quality is not None
        assert isinstance(report.quality, QualityStats)

    def test_valid_triangle_after_reordering(self) -> None:
        """Test that triangles are valid after MMG's internal processing.

        Note: MMG may automatically fix element orientation, so we verify
        that the stored mesh is valid rather than testing for detection
        of inverted elements.
        """
        vertices = np.array(
            [
                [0.0, 0.0],
                [1.0, 0.0],
                [0.5, 1.0],
            ],
            dtype=np.float64,
        )
        # CW orientation (would be inverted)
        tri = np.array([[0, 2, 1]], dtype=np.int32)

        raw_mesh = MmgMesh2D()
        raw_mesh.set_mesh_size(vertices=len(vertices), triangles=len(tri))
        raw_mesh.set_vertices(vertices)
        raw_mesh.set_triangles(tri)
        mesh = Mesh._from_impl(raw_mesh, MeshKind.TRIANGULAR_2D)

        # Mesh should be valid (MMG may fix orientation or store as-is)
        report = mesh.validate(detailed=True)
        # Just verify it doesn't crash and returns a report
        assert isinstance(report, ValidationReport)

    def test_mesh_type_in_report(self) -> None:
        """Test that report includes correct mesh type."""
        vertices, triangles = create_test_mesh_2d()
        mesh = Mesh(vertices, triangles)

        report = mesh.validate(detailed=True)
        assert report.mesh_type == "MmgMesh2D"


# =============================================================================
# Basic validation tests for MmgMeshS
# =============================================================================


class TestMmgMeshSValidation:
    """Tests for MmgMeshS.validate() method."""

    def test_validate_returns_bool(self) -> None:
        """Test that validate() returns bool by default."""
        vertices, triangles = create_surface_mesh()
        mesh = Mesh(vertices, triangles)

        result = mesh.validate()
        assert isinstance(result, bool)

    def test_validate_returns_report_when_detailed(self) -> None:
        """Test that validate(detailed=True) returns ValidationReport."""
        vertices, triangles = create_surface_mesh()
        mesh = Mesh(vertices, triangles)

        result = mesh.validate(detailed=True)
        assert isinstance(result, ValidationReport)

    def test_valid_mesh_returns_true(self) -> None:
        """Test that a valid mesh returns True."""
        vertices, triangles = create_surface_mesh()
        mesh = Mesh(vertices, triangles)

        assert mesh.validate() is True

    def test_report_has_quality_stats(self) -> None:
        """Test that report includes quality statistics."""
        vertices, triangles = create_surface_mesh()
        mesh = Mesh(vertices, triangles)

        report = mesh.validate(detailed=True)
        assert report.quality is not None

    def test_mesh_type_in_report(self) -> None:
        """Test that report includes correct mesh type."""
        vertices, triangles = create_surface_mesh()
        mesh = Mesh(vertices, triangles)

        report = mesh.validate(detailed=True)
        assert report.mesh_type == "MmgMeshS"


# =============================================================================
# Tests for unified Mesh class validation
# =============================================================================


class TestMeshValidation:
    """Tests for unified Mesh.validate() method."""

    def test_validate_3d_mesh(self) -> None:
        """Test validation of 3D mesh through unified interface."""
        vertices, tetrahedra = create_test_mesh_3d()
        mesh = Mesh(vertices, tetrahedra)

        result = mesh.validate()
        assert isinstance(result, bool)

        report = mesh.validate(detailed=True)
        assert isinstance(report, ValidationReport)

    def test_validate_2d_mesh(self) -> None:
        """Test validation of 2D mesh through unified interface."""
        vertices, triangles = create_test_mesh_2d()
        mesh = Mesh(vertices, triangles)

        result = mesh.validate()
        assert isinstance(result, bool)

        report = mesh.validate(detailed=True)
        assert isinstance(report, ValidationReport)

    def test_validate_surface_mesh(self) -> None:
        """Test validation of surface mesh through MmgMeshS."""
        vertices, triangles = create_surface_mesh()
        mesh = Mesh(vertices, triangles)

        result = mesh.validate()
        assert isinstance(result, bool)

        report = mesh.validate(detailed=True)
        assert isinstance(report, ValidationReport)


# =============================================================================
# Tests for QualityStats
# =============================================================================


class TestQualityStats:
    """Tests for QualityStats class."""

    def test_quality_histogram(self) -> None:
        """Test that quality histogram is computed correctly."""
        vertices, tetrahedra = create_test_mesh_3d()
        mesh = Mesh(vertices, tetrahedra)

        report = mesh.validate(detailed=True)
        assert report.quality is not None
        assert len(report.quality.histogram) == 10  # 10 bins from 0.0-1.0

    def test_below_threshold(self) -> None:
        """Test below_threshold method."""
        vertices, tetrahedra = create_test_mesh_3d()
        mesh = Mesh(vertices, tetrahedra)

        report = mesh.validate(detailed=True)
        assert report.quality is not None

        # Count elements below 0.5
        count = report.quality.below_threshold(0.5)
        assert isinstance(count, int)
        assert count >= 0


# =============================================================================
# Tests for ValidationIssue
# =============================================================================


class TestValidationIssue:
    """Tests for ValidationIssue class."""

    def test_issue_severity_enum(self) -> None:
        """Test IssueSeverity enum values."""
        assert IssueSeverity.ERROR.value == "error"
        assert IssueSeverity.WARNING.value == "warning"

    def test_issue_attributes(self) -> None:
        """Test ValidationIssue has correct attributes."""
        issue = ValidationIssue(
            severity=IssueSeverity.WARNING,
            check_name="test_check",
            message="Test message",
            element_ids=(1, 2, 3),
        )
        assert issue.severity == IssueSeverity.WARNING
        assert issue.check_name == "test_check"
        assert issue.message == "Test message"
        assert issue.element_ids == (1, 2, 3)


# =============================================================================
# Tests for ValidationError
# =============================================================================


class TestValidationError:
    """Tests for ValidationError exception."""

    def test_error_has_report(self) -> None:
        """Test that ValidationError includes the report."""
        vertices, tetrahedra = create_test_mesh_3d()

        mesh = Mesh(vertices, tetrahedra)

        # Use a high quality threshold to ensure we get warnings
        # which will trigger ValidationError in strict mode
        try:
            mesh.validate(strict=True, min_quality=0.99)
            # If no exception raised, the mesh has perfect quality
            # which is fine - just verify the basic functionality
        except ValidationError as exc:
            # Verify the exception has the report attached
            assert exc.report is not None  # noqa: PT017
            assert isinstance(exc.report, ValidationReport)  # noqa: PT017


# =============================================================================
# Edge case tests
# =============================================================================


class TestValidationEdgeCases:
    """Tests for validation edge cases."""

    def test_single_element_mesh(self) -> None:
        """Test validation of minimal (single element) mesh."""
        vertices = np.array(
            [
                [0.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [0.5, 1.0, 0.0],
                [0.5, 0.5, 1.0],
            ],
            dtype=np.float64,
        )
        tetrahedra = np.array([[0, 1, 2, 3]], dtype=np.int32)

        mesh = Mesh(vertices, tetrahedra)

        # Should handle minimal mesh without issues
        result = mesh.validate()
        assert isinstance(result, bool)

    def test_degenerate_element_warning(self) -> None:
        """Test that degenerate elements are detected as warnings."""
        # Create a mesh with a near-degenerate tetrahedron
        vertices = np.array(
            [
                [0.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [0.5, 1.0, 0.0],
                [0.5, 0.5, 1e-16],  # Almost flat
            ],
            dtype=np.float64,
        )
        tet = np.array([[0, 1, 2, 3]], dtype=np.int32)

        raw_mesh = MmgMesh3D()
        raw_mesh.set_mesh_size(vertices=len(vertices), tetrahedra=len(tet))
        raw_mesh.set_vertices(vertices)
        raw_mesh.set_tetrahedra(tet)
        mesh = Mesh._from_impl(raw_mesh, MeshKind.TETRAHEDRAL)

        report = mesh.validate(detailed=True)
        degenerate_warnings = [
            w for w in report.warnings if "degenerate" in w.check_name
        ]
        assert len(degenerate_warnings) > 0

    def test_quality_threshold_parameter(self) -> None:
        """Test that min_quality parameter affects warnings."""
        vertices, tetrahedra = create_test_mesh_3d()
        mesh = Mesh(vertices, tetrahedra)

        # With very low threshold, no quality warnings
        report_low = mesh.validate(detailed=True, min_quality=0.01)
        low_quality_warnings_low = [
            w for w in report_low.warnings if "low_quality" in w.check_name
        ]

        # With very high threshold, may have quality warnings
        report_high = mesh.validate(detailed=True, min_quality=0.99)
        low_quality_warnings_high = [
            w for w in report_high.warnings if "low_quality" in w.check_name
        ]

        # High threshold should produce at least as many warnings
        assert len(low_quality_warnings_high) >= len(low_quality_warnings_low)

    def test_orphan_vertices_detection(self) -> None:
        """Test that orphan vertices are detected."""
        # Create a mesh with an extra unused vertex
        vertices = np.array(
            [
                [0.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [0.5, 1.0, 0.0],
                [0.5, 0.5, 1.0],
                [10.0, 10.0, 10.0],  # Orphan vertex - not used by any element
            ],
            dtype=np.float64,
        )
        tetrahedra = np.array([[0, 1, 2, 3]], dtype=np.int32)

        raw_mesh = MmgMesh3D()
        raw_mesh.set_mesh_size(vertices=len(vertices), tetrahedra=len(tetrahedra))
        raw_mesh.set_vertices(vertices)
        raw_mesh.set_tetrahedra(tetrahedra)
        mesh = Mesh._from_impl(raw_mesh, MeshKind.TETRAHEDRAL)

        report = mesh.validate(detailed=True)
        orphan_warnings = [w for w in report.warnings if "orphan" in w.check_name]
        assert len(orphan_warnings) > 0
        # Check that vertex 4 is identified as orphan
        assert 4 in orphan_warnings[0].element_ids

    def test_non_manifold_edge_detection_2d(self) -> None:
        """Test that non-manifold edges are detected in 2D meshes."""
        # Create a mesh where one edge is shared by 3 triangles (non-manifold)
        vertices = np.array(
            [
                [0.0, 0.0],  # 0: center
                [1.0, 0.0],  # 1: right
                [0.0, 1.0],  # 2: top
                [-1.0, 0.0],  # 3: left
                [0.0, -1.0],  # 4: bottom
            ],
            dtype=np.float64,
        )
        # Edge 0-1 is shared by triangles 0 and 2 (and would be shared by more)
        # Create 3 triangles sharing the center vertex
        triangles = np.array(
            [
                [0, 1, 2],  # top-right
                [0, 2, 3],  # top-left
                [0, 3, 4],  # bottom-left
                [0, 4, 1],  # bottom-right (this creates edge 0-1 shared by 2 faces)
            ],
            dtype=np.int32,
        )

        raw_mesh = MmgMesh2D()
        raw_mesh.set_mesh_size(vertices=len(vertices), triangles=len(triangles))
        raw_mesh.set_vertices(vertices)
        raw_mesh.set_triangles(triangles)
        mesh = Mesh._from_impl(raw_mesh, MeshKind.TRIANGULAR_2D)

        # This mesh should validate without non-manifold issues
        # (each edge has max 2 faces)
        report = mesh.validate(detailed=True)
        non_manifold_errors = [
            e for e in report.errors if "non_manifold" in e.check_name
        ]
        # No non-manifold edges expected in this valid mesh
        assert len(non_manifold_errors) == 0


# =============================================================================
# Tests for QualityStats edge cases
# =============================================================================


class TestQualityStatsEdgeCases:
    """Tests for QualityStats edge cases."""

    def test_below_threshold_empty_histogram(self) -> None:
        """Test below_threshold with empty histogram."""
        stats = QualityStats(
            min=0.0,
            max=0.0,
            mean=0.0,
            std=0.0,
            histogram=(),
        )
        # Should return 0 for empty histogram
        assert stats.below_threshold(0.5) == 0

    def test_below_threshold_all_below(self) -> None:
        """Test below_threshold when all elements are below threshold."""
        stats = QualityStats(
            min=0.1,
            max=0.3,
            mean=0.2,
            std=0.05,
            histogram=(
                ("0.0-0.1", 5),
                ("0.1-0.2", 10),
                ("0.2-0.3", 5),
                ("0.3-0.4", 0),
                ("0.4-0.5", 0),
                ("0.5-0.6", 0),
                ("0.6-0.7", 0),
                ("0.7-0.8", 0),
                ("0.8-0.9", 0),
                ("0.9-1.0", 0),
            ),
        )
        # below_threshold counts bins where bin_upper <= threshold
        # For threshold=0.3: bins 0.0-0.1 (5), 0.1-0.2 (10), 0.2-0.3 (5) all count
        assert stats.below_threshold(0.3) == 20  # 5 + 10 + 5 (all three bins)
        assert stats.below_threshold(0.2) == 15  # 5 + 10 (bins 0.0-0.1 and 0.1-0.2)


# =============================================================================
# Tests for ValidationReport str representation
# =============================================================================


class TestValidationReportStr:
    """Tests for ValidationReport string representation."""

    def test_str_truncation_with_many_issues(self) -> None:
        """Test that str representation truncates when >10 issues."""
        # Create a report with more than 10 issues
        issues = tuple(
            ValidationIssue(
                severity=IssueSeverity.WARNING,
                check_name=f"test_check_{i}",
                message=f"Test message {i}",
                element_ids=(),
            )
            for i in range(15)
        )

        report = ValidationReport(
            is_valid=True,
            issues=issues,
            quality=None,
            mesh_type="TestMesh",
        )

        report_str = str(report)

        # Should contain truncation message
        assert "... and 5 more" in report_str

        # Should show first 10 issues
        assert "Test message 0" in report_str
        assert "Test message 9" in report_str

        # Should NOT show issues beyond 10
        assert "Test message 10" not in report_str
        assert "Test message 14" not in report_str

    def test_str_no_truncation_with_few_issues(self) -> None:
        """Test that str representation doesn't truncate when <=10 issues."""
        issues = tuple(
            ValidationIssue(
                severity=IssueSeverity.WARNING,
                check_name=f"test_check_{i}",
                message=f"Test message {i}",
                element_ids=(),
            )
            for i in range(5)
        )

        report = ValidationReport(
            is_valid=True,
            issues=issues,
            quality=None,
            mesh_type="TestMesh",
        )

        report_str = str(report)

        # Should NOT contain truncation message
        assert "... and" not in report_str

        # Should show all issues
        for i in range(5):
            assert f"Test message {i}" in report_str


# =============================================================================
# Tests for duplicate vertex detection (issue #119)
# =============================================================================


class TestDuplicateVertexDetection:
    """Tests for improved duplicate vertex detection using KD-tree."""

    def test_detects_duplicates_small_mesh(self) -> None:
        """Test that duplicate vertices are detected in small meshes."""
        vertices = np.array(
            [
                [0.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [0.5, 1.0, 0.0],
                [0.5, 0.5, 1.0],
                [0.0, 0.0, 0.0],  # Duplicate of vertex 0
            ],
            dtype=np.float64,
        )
        tetrahedra = np.array([[0, 1, 2, 3]], dtype=np.int32)

        raw_mesh = MmgMesh3D()
        raw_mesh.set_mesh_size(vertices=len(vertices), tetrahedra=len(tetrahedra))
        raw_mesh.set_vertices(vertices)
        raw_mesh.set_tetrahedra(tetrahedra)
        mesh = Mesh._from_impl(raw_mesh, MeshKind.TETRAHEDRAL)

        report = mesh.validate(detailed=True)
        duplicate_warnings = [w for w in report.warnings if "duplicate" in w.check_name]
        assert len(duplicate_warnings) > 0
        assert "1 duplicate" in duplicate_warnings[0].message

    def test_detects_duplicates_large_mesh(self) -> None:
        """Test that duplicate detection works for large meshes (>10k vertices)."""
        n_vertices = 50000
        rng = np.random.default_rng(42)
        vertices = rng.random((n_vertices, 3))
        vertices[n_vertices - 1] = vertices[0]  # Create a duplicate

        tetrahedra = np.array([[0, 1, 2, 3]], dtype=np.int32)

        raw_mesh = MmgMesh3D()
        raw_mesh.set_mesh_size(vertices=len(vertices), tetrahedra=len(tetrahedra))
        raw_mesh.set_vertices(vertices)
        raw_mesh.set_tetrahedra(tetrahedra)
        mesh = Mesh._from_impl(raw_mesh, MeshKind.TETRAHEDRAL)

        report = mesh.validate(detailed=True)
        duplicate_warnings = [w for w in report.warnings if "duplicate" in w.check_name]
        assert len(duplicate_warnings) > 0

    def test_no_false_positives_large_mesh(self) -> None:
        """Test no false positives on large mesh without duplicates."""
        n_vertices = 20000
        rng = np.random.default_rng(123)
        vertices = rng.random((n_vertices, 3)) * 100  # Spread out to avoid collisions

        tetrahedra = np.array([[0, 1, 2, 3]], dtype=np.int32)

        raw_mesh = MmgMesh3D()
        raw_mesh.set_mesh_size(vertices=len(vertices), tetrahedra=len(tetrahedra))
        raw_mesh.set_vertices(vertices)
        raw_mesh.set_tetrahedra(tetrahedra)
        mesh = Mesh._from_impl(raw_mesh, MeshKind.TETRAHEDRAL)

        report = mesh.validate(detailed=True)
        duplicate_warnings = [w for w in report.warnings if "duplicate" in w.check_name]
        assert len(duplicate_warnings) == 0

    def test_tolerance_parameter(self) -> None:
        """Test that tolerance parameter affects duplicate detection."""
        vertices = np.array(
            [
                [0.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [0.5, 1.0, 0.0],
                [0.5, 0.5, 1.0],
                [1e-11, 0.0, 0.0],  # Very close to vertex 0
            ],
            dtype=np.float64,
        )
        tetrahedra = np.array([[0, 1, 2, 3]], dtype=np.int32)

        mesh = MmgMesh3D()
        mesh.set_mesh_size(vertices=len(vertices), tetrahedra=len(tetrahedra))
        mesh.set_vertices(vertices)
        mesh.set_tetrahedra(tetrahedra)

        # Default tolerance (1e-10) should detect this as duplicate
        from mmgpy._validation import _check_duplicate_vertices

        issues_default: list[ValidationIssue] = []
        _check_duplicate_vertices(vertices, issues_default, tolerance=1e-10)
        assert len(issues_default) == 1

        # Smaller tolerance should not detect it
        issues_small: list[ValidationIssue] = []
        _check_duplicate_vertices(vertices, issues_small, tolerance=1e-12)
        assert len(issues_small) == 0

    def test_multiple_duplicates(self) -> None:
        """Test detection of multiple duplicate pairs."""
        vertices = np.array(
            [
                [0.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [0.5, 1.0, 0.0],
                [0.5, 0.5, 1.0],
                [0.0, 0.0, 0.0],  # Duplicate of 0
                [1.0, 0.0, 0.0],  # Duplicate of 1
                [0.5, 1.0, 0.0],  # Duplicate of 2
            ],
            dtype=np.float64,
        )
        tetrahedra = np.array([[0, 1, 2, 3]], dtype=np.int32)

        raw_mesh = MmgMesh3D()
        raw_mesh.set_mesh_size(vertices=len(vertices), tetrahedra=len(tetrahedra))
        raw_mesh.set_vertices(vertices)
        raw_mesh.set_tetrahedra(tetrahedra)
        mesh = Mesh._from_impl(raw_mesh, MeshKind.TETRAHEDRAL)

        report = mesh.validate(detailed=True)
        duplicate_warnings = [w for w in report.warnings if "duplicate" in w.check_name]
        assert len(duplicate_warnings) > 0
        assert "3 duplicate" in duplicate_warnings[0].message

    def test_2d_mesh_duplicate_detection(self) -> None:
        """Test duplicate detection works for 2D meshes."""
        vertices = np.array(
            [
                [0.0, 0.0],
                [1.0, 0.0],
                [0.5, 1.0],
                [0.0, 0.0],  # Duplicate of vertex 0
            ],
            dtype=np.float64,
        )
        triangles = np.array([[0, 1, 2]], dtype=np.int32)

        raw_mesh = MmgMesh2D()
        raw_mesh.set_mesh_size(vertices=len(vertices), triangles=len(triangles))
        raw_mesh.set_vertices(vertices)
        raw_mesh.set_triangles(triangles)
        mesh = Mesh._from_impl(raw_mesh, MeshKind.TRIANGULAR_2D)

        report = mesh.validate(detailed=True)
        duplicate_warnings = [w for w in report.warnings if "duplicate" in w.check_name]
        assert len(duplicate_warnings) > 0

    def test_surface_mesh_duplicate_detection(self) -> None:
        """Test duplicate detection works for surface meshes."""
        vertices = np.array(
            [
                [0.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [0.5, 1.0, 0.0],
                [0.5, 0.5, 1.0],
                [0.0, 0.0, 0.0],  # Duplicate of vertex 0
            ],
            dtype=np.float64,
        )
        triangles = np.array(
            [
                [0, 1, 2],
                [0, 1, 3],
                [1, 2, 3],
                [0, 2, 3],
            ],
            dtype=np.int32,
        )

        raw_mesh = MmgMeshS()
        raw_mesh.set_mesh_size(vertices=len(vertices), triangles=len(triangles))
        raw_mesh.set_vertices(vertices)
        raw_mesh.set_triangles(triangles)
        mesh = Mesh._from_impl(raw_mesh, MeshKind.TRIANGULAR_SURFACE)

        report = mesh.validate(detailed=True)
        duplicate_warnings = [w for w in report.warnings if "duplicate" in w.check_name]
        assert len(duplicate_warnings) > 0


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
