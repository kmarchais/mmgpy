"""Tests for the repair module."""

import numpy as np

from mmgpy import Mesh, MeshKind


class TestRemoveDuplicateVertices:
    """Tests for remove_duplicate_vertices function."""

    def test_no_duplicates(self) -> None:
        """Test mesh with no duplicate vertices."""
        from mmgpy.repair import remove_duplicate_vertices

        vertices = np.array(
            [
                [0.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [0.5, 1.0, 0.0],
                [0.5, 0.5, 1.0],
            ],
            dtype=np.float64,
        )
        cells = np.array([[0, 1, 2, 3]], dtype=np.int32)
        mesh = Mesh(vertices, cells)

        result, removed = remove_duplicate_vertices(mesh)

        assert removed == 0
        assert len(result.get_vertices()) == 4

    def test_with_exact_duplicates(self) -> None:
        """Test mesh with exact duplicate vertices."""
        from mmgpy.repair import remove_duplicate_vertices

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
        cells = np.array([[4, 1, 2, 3]], dtype=np.int32)
        mesh = Mesh(vertices, cells)

        result, removed = remove_duplicate_vertices(mesh)

        assert removed == 1
        assert len(result.get_vertices()) == 4

    def test_with_near_duplicates(self) -> None:
        """Test mesh with near-duplicate vertices within tolerance."""
        from mmgpy.repair import remove_duplicate_vertices

        vertices = np.array(
            [
                [0.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [0.5, 1.0, 0.0],
                [0.5, 0.5, 1.0],
                [1e-12, 1e-12, 1e-12],  # Near duplicate of vertex 0
            ],
            dtype=np.float64,
        )
        cells = np.array([[4, 1, 2, 3]], dtype=np.int32)
        mesh = Mesh(vertices, cells)

        result, removed = remove_duplicate_vertices(mesh, tolerance=1e-10)

        assert removed == 1
        assert len(result.get_vertices()) == 4

    def test_2d_mesh(self) -> None:
        """Test duplicate removal on 2D mesh."""
        from mmgpy.repair import remove_duplicate_vertices

        vertices = np.array(
            [
                [0.0, 0.0],
                [1.0, 0.0],
                [0.5, 1.0],
                [0.0, 0.0],  # Duplicate
            ],
            dtype=np.float64,
        )
        cells = np.array([[3, 1, 2]], dtype=np.int32)
        mesh = Mesh(vertices, cells)

        result, removed = remove_duplicate_vertices(mesh)

        assert removed == 1
        assert len(result.get_vertices()) == 3
        assert result.kind == MeshKind.TRIANGULAR_2D


class TestRemoveOrphanVertices:
    """Tests for remove_orphan_vertices function."""

    def test_no_orphans(self) -> None:
        """Test mesh with no orphan vertices."""
        from mmgpy.repair import remove_orphan_vertices

        vertices = np.array(
            [
                [0.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [0.5, 1.0, 0.0],
                [0.5, 0.5, 1.0],
            ],
            dtype=np.float64,
        )
        cells = np.array([[0, 1, 2, 3]], dtype=np.int32)
        mesh = Mesh(vertices, cells)

        result, removed = remove_orphan_vertices(mesh)

        assert removed == 0
        assert len(result.get_vertices()) == 4

    def test_with_orphans(self) -> None:
        """Test mesh with orphan vertices."""
        from mmgpy.repair import remove_orphan_vertices

        vertices = np.array(
            [
                [0.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [0.5, 1.0, 0.0],
                [0.5, 0.5, 1.0],
                [5.0, 5.0, 5.0],  # Orphan vertex
                [6.0, 6.0, 6.0],  # Another orphan
            ],
            dtype=np.float64,
        )
        cells = np.array([[0, 1, 2, 3]], dtype=np.int32)
        mesh = Mesh(vertices, cells)

        result, removed = remove_orphan_vertices(mesh)

        assert removed == 2
        assert len(result.get_vertices()) == 4

    def test_preserves_element_connectivity(self) -> None:
        """Test that element connectivity is preserved after orphan removal."""
        from mmgpy.repair import remove_orphan_vertices

        vertices = np.array(
            [
                [0.0, 0.0, 0.0],
                [5.0, 5.0, 5.0],  # Orphan
                [1.0, 0.0, 0.0],
                [0.5, 1.0, 0.0],
                [0.5, 0.5, 1.0],
            ],
            dtype=np.float64,
        )
        cells = np.array([[0, 2, 3, 4]], dtype=np.int32)
        mesh = Mesh(vertices, cells)

        result, removed = remove_orphan_vertices(mesh)

        assert removed == 1
        assert len(result.get_vertices()) == 4
        tetra = result.get_tetrahedra()
        assert tetra.shape == (1, 4)
        assert np.all(tetra < 4)


class TestRemoveDegenerateElements:
    """Tests for remove_degenerate_elements function."""

    def test_no_degenerate(self) -> None:
        """Test mesh with no degenerate elements."""
        from mmgpy.repair import remove_degenerate_elements

        vertices = np.array(
            [
                [0.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [0.5, 1.0, 0.0],
                [0.5, 0.5, 1.0],
            ],
            dtype=np.float64,
        )
        cells = np.array([[0, 1, 2, 3]], dtype=np.int32)
        mesh = Mesh(vertices, cells)

        result, removed = remove_degenerate_elements(mesh)

        assert removed == 0
        assert len(result.get_tetrahedra()) == 1

    def test_with_near_zero_volume_tetra(self) -> None:
        """Test mesh with near-zero volume tetrahedron (very flat)."""
        from mmgpy.repair import remove_degenerate_elements

        vertices = np.array(
            [
                [0.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [0.5, 1.0, 0.0],
                [0.5, 0.5, 1.0],
                [0.25, 0.25, 0.0],
                [0.75, 0.25, 0.0],
                [0.5, 0.75, 0.0],
                [0.5, 0.5, 1e-12],  # Nearly coplanar (very small z)
            ],
            dtype=np.float64,
        )
        cells = np.array(
            [
                [0, 1, 2, 3],  # Valid tetra
                [4, 5, 6, 7],  # Nearly degenerate tetra
            ],
            dtype=np.int32,
        )
        mesh = Mesh(vertices, cells)

        result, removed = remove_degenerate_elements(mesh, tolerance=1e-10)

        assert removed == 1
        assert len(result.get_tetrahedra()) == 1

    def test_2d_near_degenerate_triangle(self) -> None:
        """Test 2D mesh with near-degenerate triangle."""
        from mmgpy.repair import remove_degenerate_elements

        vertices = np.array(
            [
                [0.0, 0.0],
                [1.0, 0.0],
                [0.5, 1.0],
                [0.0, 0.0],
                [0.5, 0.0],
                [1.0, 1e-12],  # Nearly collinear
            ],
            dtype=np.float64,
        )
        cells = np.array(
            [
                [0, 1, 2],  # Valid triangle
                [3, 4, 5],  # Nearly degenerate triangle
            ],
            dtype=np.int32,
        )
        mesh = Mesh(vertices, cells)

        result, removed = remove_degenerate_elements(mesh, tolerance=1e-10)

        assert removed == 1
        assert len(result.get_triangles()) == 1


class TestFixInvertedElements:
    """Tests for fix_inverted_elements function."""

    def test_no_inverted(self) -> None:
        """Test mesh with no inverted elements."""
        from mmgpy.repair import fix_inverted_elements

        vertices = np.array(
            [
                [0.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [0.5, 1.0, 0.0],
                [0.5, 0.5, 1.0],
            ],
            dtype=np.float64,
        )
        cells = np.array([[0, 1, 2, 3]], dtype=np.int32)
        mesh = Mesh(vertices, cells)

        _, fixed = fix_inverted_elements(mesh)

        assert fixed == 0

    def test_with_inverted_tetra(self) -> None:
        """Test detection and fixing of inverted tetrahedron at array level.

        Note: MMG automatically normalizes element orientation when creating
        the mesh, so we test the volume computation directly.
        """
        from mmgpy.repair._elements import _compute_tetra_volumes

        vertices = np.array(
            [
                [0.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [0.5, 1.0, 0.0],
                [0.5, 0.5, 1.0],
            ],
            dtype=np.float64,
        )
        cells_normal = np.array([[0, 1, 2, 3]], dtype=np.int32)
        cells_inverted = np.array([[0, 2, 1, 3]], dtype=np.int32)

        volume_normal = _compute_tetra_volumes(vertices, cells_normal)[0]
        volume_inverted = _compute_tetra_volumes(vertices, cells_inverted)[0]

        assert volume_normal > 0
        assert volume_inverted < 0

        mesh = Mesh(vertices, cells_normal)
        from mmgpy.repair import fix_inverted_elements

        _, fixed = fix_inverted_elements(mesh)
        assert fixed == 0

    def test_with_inverted_2d_triangle(self) -> None:
        """Test detection of inverted 2D triangle at array level.

        Note: MMG automatically normalizes element orientation when creating
        the mesh, so we test the area computation directly.
        """
        from mmgpy.repair._elements import _compute_triangle_areas_2d

        vertices = np.array(
            [
                [0.0, 0.0],
                [1.0, 0.0],
                [0.5, 1.0],
            ],
            dtype=np.float64,
        )
        cells_normal = np.array([[0, 1, 2]], dtype=np.int32)
        cells_inverted = np.array([[0, 2, 1]], dtype=np.int32)

        area_normal = _compute_triangle_areas_2d(vertices, cells_normal)[0]
        area_inverted = _compute_triangle_areas_2d(vertices, cells_inverted)[0]

        assert area_normal > 0
        assert area_inverted < 0

        mesh = Mesh(vertices, cells_normal)
        from mmgpy.repair import fix_inverted_elements

        _, fixed = fix_inverted_elements(mesh)
        assert fixed == 0


class TestRemoveDuplicateElements:
    """Tests for remove_duplicate_elements function."""

    def test_no_duplicates(self) -> None:
        """Test mesh with no duplicate elements."""
        from mmgpy.repair import remove_duplicate_elements

        vertices = np.array(
            [
                [0.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [0.5, 1.0, 0.0],
                [0.5, 0.5, 1.0],
            ],
            dtype=np.float64,
        )
        cells = np.array([[0, 1, 2, 3]], dtype=np.int32)
        mesh = Mesh(vertices, cells)

        result, removed = remove_duplicate_elements(mesh)

        assert removed == 0
        assert len(result.get_tetrahedra()) == 1

    def test_with_exact_duplicate(self) -> None:
        """Test mesh with exact duplicate element."""
        from mmgpy.repair import remove_duplicate_elements

        vertices = np.array(
            [
                [0.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [0.5, 1.0, 0.0],
                [0.5, 0.5, 1.0],
            ],
            dtype=np.float64,
        )
        cells = np.array(
            [
                [0, 1, 2, 3],
                [0, 1, 2, 3],  # Exact duplicate
            ],
            dtype=np.int32,
        )
        mesh = Mesh(vertices, cells)

        result, removed = remove_duplicate_elements(mesh)

        assert removed == 1
        assert len(result.get_tetrahedra()) == 1

    def test_with_reordered_duplicate(self) -> None:
        """Test mesh with duplicate element in different vertex order."""
        from mmgpy.repair import remove_duplicate_elements

        vertices = np.array(
            [
                [0.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [0.5, 1.0, 0.0],
                [0.5, 0.5, 1.0],
            ],
            dtype=np.float64,
        )
        cells = np.array(
            [
                [0, 1, 2, 3],
                [3, 2, 1, 0],  # Same vertices, different order
            ],
            dtype=np.int32,
        )
        mesh = Mesh(vertices, cells)

        result, removed = remove_duplicate_elements(mesh)

        assert removed == 1
        assert len(result.get_tetrahedra()) == 1


class TestMergeCloseVertices:
    """Tests for merge_close_vertices function."""

    def test_merge_close_vertices(self) -> None:
        """Test merging close vertices."""
        from mmgpy.repair import merge_close_vertices

        vertices = np.array(
            [
                [0.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [0.5, 1.0, 0.0],
                [0.5, 0.5, 1.0],
                [1e-7, 1e-7, 1e-7],  # Close to vertex 0
            ],
            dtype=np.float64,
        )
        cells = np.array([[4, 1, 2, 3]], dtype=np.int32)
        mesh = Mesh(vertices, cells)

        result, merged = merge_close_vertices(mesh, tolerance=1e-6)

        assert merged == 1
        assert len(result.get_vertices()) == 4


class TestAutoRepair:
    """Tests for auto_repair function."""

    def test_clean_mesh(self) -> None:
        """Test auto_repair on a clean mesh."""
        from mmgpy.repair import auto_repair

        vertices = np.array(
            [
                [0.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [0.5, 1.0, 0.0],
                [0.5, 0.5, 1.0],
            ],
            dtype=np.float64,
        )
        cells = np.array([[0, 1, 2, 3]], dtype=np.int32)
        mesh = Mesh(vertices, cells)

        result, report = auto_repair(mesh)

        assert not report.was_modified
        assert report.total_repairs == 0
        assert len(result.get_vertices()) == 4

    def test_mesh_with_multiple_issues(self) -> None:
        """Test auto_repair on mesh with multiple issues."""
        from mmgpy.repair import auto_repair

        vertices = np.array(
            [
                [0.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [0.5, 1.0, 0.0],
                [0.5, 0.5, 1.0],
                [0.0, 0.0, 0.0],  # Duplicate of vertex 0
                [5.0, 5.0, 5.0],  # Orphan vertex
            ],
            dtype=np.float64,
        )
        cells = np.array([[4, 1, 2, 3]], dtype=np.int32)
        mesh = Mesh(vertices, cells)

        result, report = auto_repair(mesh)

        assert report.was_modified
        assert report.duplicate_vertices_removed >= 1
        assert len(report.operations_applied) > 0
        assert len(result.get_vertices()) == 4

    def test_report_str(self) -> None:
        """Test RepairReport string representation."""
        from mmgpy.repair import RepairReport

        report = RepairReport(
            duplicate_vertices_removed=5,
            orphan_vertices_removed=2,
            vertices_before=100,
            vertices_after=93,
            elements_before=50,
            elements_after=50,
        )

        report_str = str(report)
        assert "Duplicate vertices removed: 5" in report_str
        assert "Orphan vertices removed: 2" in report_str
        assert "100 -> 93" in report_str

    def test_report_properties(self) -> None:
        """Test RepairReport properties."""
        from mmgpy.repair import RepairReport

        report = RepairReport(
            duplicate_vertices_removed=5,
            degenerate_elements_removed=2,
            inverted_elements_fixed=1,
        )

        assert report.total_repairs == 8
        assert report.was_modified


class TestSurfaceMesh:
    """Tests for repair operations on surface meshes."""

    def test_remove_orphan_surface(self) -> None:
        """Test orphan removal on surface mesh."""
        from mmgpy.repair import remove_orphan_vertices

        vertices = np.array(
            [
                [0.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [0.5, 1.0, 0.5],
                [5.0, 5.0, 5.0],  # Orphan
            ],
            dtype=np.float64,
        )
        cells = np.array([[0, 1, 2]], dtype=np.int32)
        mesh = Mesh(vertices, cells)

        assert mesh.kind == MeshKind.TRIANGULAR_SURFACE

        result, removed = remove_orphan_vertices(mesh)

        assert removed == 1
        assert len(result.get_vertices()) == 3
        assert result.kind == MeshKind.TRIANGULAR_SURFACE


class TestEdgeCases:
    """Tests for edge cases and boundary conditions."""

    def test_valid_mesh_no_repairs_needed(self) -> None:
        """Test auto_repair returns valid result on a clean mesh."""
        from mmgpy.repair import auto_repair

        vertices = np.array(
            [
                [0.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [0.5, 1.0, 0.0],
                [0.5, 0.5, 1.0],
            ],
            dtype=np.float64,
        )
        cells = np.array([[0, 1, 2, 3]], dtype=np.int32)
        mesh = Mesh(vertices, cells)

        result, report = auto_repair(mesh)

        assert result is not None
        assert isinstance(report.total_repairs, int)

    def test_single_vertex_mesh(self) -> None:
        """Test duplicate removal on mesh with single vertex."""
        from mmgpy.repair import remove_duplicate_vertices

        vertices = np.array(
            [
                [0.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [0.5, 1.0, 0.0],
                [0.5, 0.5, 1.0],
            ],
            dtype=np.float64,
        )
        cells = np.array([[0, 1, 2, 3]], dtype=np.int32)
        mesh = Mesh(vertices, cells)

        result, removed = remove_duplicate_vertices(mesh)

        assert removed == 0
        assert len(result.get_vertices()) == 4

    def test_single_element(self) -> None:
        """Test repair on single element mesh."""
        from mmgpy.repair import auto_repair

        vertices = np.array(
            [
                [0.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [0.5, 1.0, 0.0],
                [0.5, 0.5, 1.0],
            ],
            dtype=np.float64,
        )
        cells = np.array([[0, 1, 2, 3]], dtype=np.int32)
        mesh = Mesh(vertices, cells)

        result, _ = auto_repair(mesh)

        assert len(result.get_tetrahedra()) == 1

    def test_chained_duplicates(self) -> None:
        """Test handling of chained duplicate vertices (A=B, B=C)."""
        from mmgpy.repair import remove_duplicate_vertices

        vertices = np.array(
            [
                [0.0, 0.0, 0.0],
                [0.0, 0.0, 0.0],  # Duplicate of 0
                [0.0, 0.0, 0.0],  # Duplicate of 0 and 1
                [1.0, 0.0, 0.0],
                [0.5, 1.0, 0.0],
                [0.5, 0.5, 1.0],
            ],
            dtype=np.float64,
        )
        cells = np.array([[2, 3, 4, 5]], dtype=np.int32)
        mesh = Mesh(vertices, cells)

        result, removed = remove_duplicate_vertices(mesh)

        assert removed == 2
        assert len(result.get_vertices()) == 4


class TestSurfaceMeshRepair:
    """Additional tests for surface mesh repair operations."""

    def test_surface_mesh_degenerate_removal(self) -> None:
        """Test degenerate element removal on surface mesh."""
        from mmgpy.repair import remove_degenerate_elements

        vertices = np.array(
            [
                [0.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [0.5, 1.0, 0.5],
                [0.0, 0.0, 0.0],
                [0.5, 0.0, 0.0],
                [1.0, 0.0, 0.0],  # Collinear with 3 and 4
            ],
            dtype=np.float64,
        )
        cells = np.array(
            [
                [0, 1, 2],  # Valid surface triangle
                [3, 4, 5],  # Degenerate (collinear points)
            ],
            dtype=np.int32,
        )
        mesh = Mesh(vertices, cells)

        assert mesh.kind == MeshKind.TRIANGULAR_SURFACE

        result, removed = remove_degenerate_elements(mesh, tolerance=1e-10)

        assert removed == 1
        assert len(result.get_triangles()) == 1

    def test_surface_mesh_fix_inverted_noop(self) -> None:
        """Test that fix_inverted_elements is a no-op for surface meshes."""
        from mmgpy.repair import fix_inverted_elements

        vertices = np.array(
            [
                [0.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [0.5, 1.0, 0.5],
            ],
            dtype=np.float64,
        )
        cells = np.array([[0, 1, 2]], dtype=np.int32)
        mesh = Mesh(vertices, cells)

        assert mesh.kind == MeshKind.TRIANGULAR_SURFACE

        result, fixed = fix_inverted_elements(mesh)

        assert fixed == 0
        assert len(result.get_triangles()) == 1

    def test_surface_mesh_duplicate_elements(self) -> None:
        """Test duplicate element removal on surface mesh."""
        from mmgpy.repair import remove_duplicate_elements

        vertices = np.array(
            [
                [0.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [0.5, 1.0, 0.5],
            ],
            dtype=np.float64,
        )
        cells = np.array(
            [
                [0, 1, 2],
                [2, 1, 0],  # Same vertices, different order
            ],
            dtype=np.int32,
        )
        mesh = Mesh(vertices, cells)

        assert mesh.kind == MeshKind.TRIANGULAR_SURFACE

        result, removed = remove_duplicate_elements(mesh)

        assert removed == 1
        assert len(result.get_triangles()) == 1

    def test_surface_mesh_auto_repair(self) -> None:
        """Test auto_repair on surface mesh to cover triangle element counting."""
        from mmgpy.repair import auto_repair

        vertices = np.array(
            [
                [0.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [0.5, 1.0, 0.5],
                [5.0, 5.0, 5.0],  # Orphan
            ],
            dtype=np.float64,
        )
        cells = np.array([[0, 1, 2]], dtype=np.int32)
        mesh = Mesh(vertices, cells)

        assert mesh.kind == MeshKind.TRIANGULAR_SURFACE

        result, report = auto_repair(mesh)

        assert report.orphan_vertices_removed == 1
        assert report.elements_before == 1
        assert report.elements_after == 1
        assert len(result.get_vertices()) == 3


class TestAutoRepair2D:
    """Tests for auto_repair on 2D meshes."""

    def test_auto_repair_2d_mesh(self) -> None:
        """Test auto_repair on 2D triangular mesh."""
        from mmgpy.repair import auto_repair

        vertices = np.array(
            [
                [0.0, 0.0],
                [1.0, 0.0],
                [0.5, 1.0],
                [5.0, 5.0],  # Orphan
            ],
            dtype=np.float64,
        )
        cells = np.array([[0, 1, 2]], dtype=np.int32)
        mesh = Mesh(vertices, cells)

        assert mesh.kind == MeshKind.TRIANGULAR_2D

        _, report = auto_repair(mesh)

        assert report.orphan_vertices_removed == 1
        assert report.elements_before == 1
        assert report.elements_after == 1


class TestRepairReportFormatting:
    """Tests for RepairReport string formatting."""

    def test_report_no_repairs(self) -> None:
        """Test report string when no repairs were made."""
        from mmgpy.repair import RepairReport

        report = RepairReport()

        report_str = str(report)
        assert "No repairs needed" in report_str

    def test_report_with_all_repair_types(self) -> None:
        """Test report string with all types of repairs."""
        from mmgpy.repair import RepairReport

        report = RepairReport(
            duplicate_vertices_removed=5,
            orphan_vertices_removed=2,
            degenerate_elements_removed=3,
            inverted_elements_fixed=1,
            duplicate_elements_removed=4,
            vertices_before=100,
            vertices_after=93,
            elements_before=50,
            elements_after=43,
        )

        report_str = str(report)
        assert "Duplicate vertices removed: 5" in report_str
        assert "Orphan vertices removed: 2" in report_str
        assert "Degenerate elements removed: 3" in report_str
        assert "Inverted elements fixed: 1" in report_str
        assert "Duplicate elements removed: 4" in report_str
        assert "100 -> 93" in report_str
        assert "50 -> 43" in report_str


class TestComputeTriangleAreas3D:
    """Tests for 3D triangle area computation."""

    def test_compute_triangle_areas_3d(self) -> None:
        """Test 3D triangle area computation directly."""
        from mmgpy.repair._elements import _compute_triangle_areas_3d

        vertices = np.array(
            [
                [0.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [0.0, 1.0, 0.0],
            ],
            dtype=np.float64,
        )
        triangles = np.array([[0, 1, 2]], dtype=np.int32)

        areas = _compute_triangle_areas_3d(vertices, triangles)

        assert len(areas) == 1
        assert np.isclose(areas[0], 0.5)  # Area of right triangle with legs 1,1

    def test_compute_triangle_areas_3d_tilted(self) -> None:
        """Test 3D triangle area on tilted plane."""
        from mmgpy.repair._elements import _compute_triangle_areas_3d

        vertices = np.array(
            [
                [0.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [0.5, 1.0, 1.0],  # Tilted triangle
            ],
            dtype=np.float64,
        )
        triangles = np.array([[0, 1, 2]], dtype=np.int32)

        areas = _compute_triangle_areas_3d(vertices, triangles)

        assert len(areas) == 1
        assert areas[0] > 0


class TestInvertedElementFix:
    """Tests for inverted element fixing."""

    def test_fix_inverted_tetra_array(self) -> None:
        """Test fixing inverted tetrahedra using raw array manipulation."""
        from mmgpy.repair._elements import (
            _GEOMETRY_TOLERANCE,
            _compute_tetra_volumes,
        )

        vertices = np.array(
            [
                [0.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [0.5, 1.0, 0.0],
                [0.5, 0.5, 1.0],
            ],
            dtype=np.float64,
        )

        inverted_cells = np.array([[0, 2, 1, 3]], dtype=np.int32)

        volumes_before = _compute_tetra_volumes(vertices, inverted_cells)
        assert volumes_before[0] < -_GEOMETRY_TOLERANCE

        inverted_mask = volumes_before < -_GEOMETRY_TOLERANCE
        inverted_cells[inverted_mask] = inverted_cells[inverted_mask][:, [0, 2, 1, 3]]

        volumes_after = _compute_tetra_volumes(vertices, inverted_cells)
        assert volumes_after[0] > _GEOMETRY_TOLERANCE

    def test_fix_inverted_2d_triangle_array(self) -> None:
        """Test fixing inverted 2D triangles using raw array manipulation."""
        from mmgpy.repair._elements import (
            _GEOMETRY_TOLERANCE,
            _compute_triangle_areas_2d,
        )

        vertices = np.array(
            [
                [0.0, 0.0],
                [1.0, 0.0],
                [0.5, 1.0],
            ],
            dtype=np.float64,
        )

        inverted_cells = np.array([[0, 2, 1]], dtype=np.int32)

        areas_before = _compute_triangle_areas_2d(vertices, inverted_cells)
        assert areas_before[0] < -_GEOMETRY_TOLERANCE

        inverted_mask = areas_before < -_GEOMETRY_TOLERANCE
        inverted_cells[inverted_mask] = inverted_cells[inverted_mask][:, [0, 2, 1]]

        areas_after = _compute_triangle_areas_2d(vertices, inverted_cells)
        assert areas_after[0] > _GEOMETRY_TOLERANCE


class TestAutoRepairOperations:
    """Tests for auto_repair operation tracking."""

    def test_auto_repair_tracks_duplicate_elements(self) -> None:
        """Test that auto_repair tracks duplicate element removal."""
        from mmgpy.repair import auto_repair

        vertices = np.array(
            [
                [0.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [0.5, 1.0, 0.0],
                [0.5, 0.5, 1.0],
            ],
            dtype=np.float64,
        )
        cells = np.array(
            [
                [0, 1, 2, 3],
                [0, 1, 2, 3],  # Exact duplicate
            ],
            dtype=np.int32,
        )
        mesh = Mesh(vertices, cells)

        _, report = auto_repair(mesh)

        assert report.duplicate_elements_removed >= 1
        assert "remove_duplicate_elements" in report.operations_applied
