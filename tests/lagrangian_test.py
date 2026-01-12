"""Tests for the pure Python Lagrangian motion implementation."""

import numpy as np
import numpy.testing as npt
import pytest

from mmgpy._mmgpy import MmgMesh2D, MmgMesh3D, MmgMeshS
from mmgpy.lagrangian import (
    _build_adjacency_from_elements,
    detect_boundary_vertices,
    move_mesh,
    propagate_displacement,
    remesh_lagrangian_surface,
)


def create_2d_test_mesh() -> tuple[np.ndarray, np.ndarray]:
    """Create a simple 2D square mesh for testing."""
    vertices = np.array(
        [
            [0.0, 0.0],  # 0
            [1.0, 0.0],  # 1
            [1.0, 1.0],  # 2
            [0.0, 1.0],  # 3
            [0.5, 0.5],  # 4 - interior point
        ],
        dtype=np.float64,
    )
    triangles = np.array(
        [
            [0, 1, 4],
            [1, 2, 4],
            [2, 3, 4],
            [3, 0, 4],
        ],
        dtype=np.int32,
    )
    return vertices, triangles


def create_3d_test_mesh() -> tuple[np.ndarray, np.ndarray]:
    """Create a cube mesh with an interior point for testing."""
    vertices = np.array(
        [
            # Cube corners
            [0.0, 0.0, 0.0],  # 0
            [1.0, 0.0, 0.0],  # 1
            [1.0, 1.0, 0.0],  # 2
            [0.0, 1.0, 0.0],  # 3
            [0.0, 0.0, 1.0],  # 4
            [1.0, 0.0, 1.0],  # 5
            [1.0, 1.0, 1.0],  # 6
            [0.0, 1.0, 1.0],  # 7
            # Interior point
            [0.5, 0.5, 0.5],  # 8
        ],
        dtype=np.float64,
    )

    # Tetrahedra connecting corners to center
    elements = np.array(
        [
            [0, 1, 3, 8],
            [1, 2, 3, 8],
            [0, 1, 4, 8],
            [1, 5, 4, 8],
            [1, 2, 5, 8],
            [2, 6, 5, 8],
            [2, 3, 6, 8],
            [3, 7, 6, 8],
            [0, 3, 4, 8],
            [3, 7, 4, 8],
            [4, 5, 6, 8],
            [4, 6, 7, 8],
        ],
        dtype=np.int32,
    )

    return vertices, elements


class TestBuildAdjacency:
    """Tests for adjacency building."""

    def test_triangle_adjacency(self) -> None:
        """Test adjacency building from triangles."""
        elements = np.array([[0, 1, 2]], dtype=np.int32)
        adj = _build_adjacency_from_elements(3, elements)

        assert len(adj) == 3
        assert set(adj[0]) == {1, 2}
        assert set(adj[1]) == {0, 2}
        assert set(adj[2]) == {0, 1}

    def test_tetrahedral_adjacency(self) -> None:
        """Test adjacency building from tetrahedra."""
        elements = np.array([[0, 1, 2, 3]], dtype=np.int32)
        adj = _build_adjacency_from_elements(4, elements)

        assert len(adj) == 4
        # Each vertex should be connected to all others
        for i in range(4):
            expected = set(range(4)) - {i}
            assert set(adj[i]) == expected


class TestPropagateDisplacement:
    """Tests for displacement propagation."""

    def test_all_boundary(self) -> None:
        """Test that all-boundary case returns input displacement."""
        vertices, triangles = create_2d_test_mesh()
        n = len(vertices)

        boundary_mask = np.ones(n, dtype=bool)
        rng = np.random.default_rng(42)
        displacement = rng.random((n, 2)).astype(np.float64)

        result = propagate_displacement(
            vertices,
            triangles,
            boundary_mask,
            displacement,
        )
        npt.assert_array_almost_equal(result, displacement)

    def test_no_boundary(self) -> None:
        """Test that no-boundary case returns zeros."""
        vertices, triangles = create_2d_test_mesh()
        n = len(vertices)

        boundary_mask = np.zeros(n, dtype=bool)
        rng = np.random.default_rng(42)
        displacement = rng.random((n, 2)).astype(np.float64)

        result = propagate_displacement(
            vertices,
            triangles,
            boundary_mask,
            displacement,
        )
        npt.assert_array_almost_equal(result, np.zeros_like(vertices))

    def test_interior_propagation_2d(self) -> None:
        """Test that interior displacement is propagated from boundary."""
        vertices, triangles = create_2d_test_mesh()
        n = len(vertices)

        # Mark only corners as boundary, center as interior
        boundary_mask = np.array([True, True, True, True, False], dtype=bool)

        # Set uniform boundary displacement
        displacement = np.zeros((n, 2), dtype=np.float64)
        displacement[:4] = [0.1, 0.0]  # All boundary vertices move right

        result = propagate_displacement(
            vertices,
            triangles,
            boundary_mask,
            displacement,
        )

        # Boundary should keep original values
        npt.assert_array_almost_equal(result[:4], displacement[:4])

        # Interior point should get interpolated value (weighted average)
        # For uniform boundary displacement, interior should get same value
        npt.assert_array_almost_equal(result[4], [0.1, 0.0])

    def test_interior_propagation_3d(self) -> None:
        """Test that interior displacement is propagated from boundary in 3D."""
        vertices, elements = create_3d_test_mesh()
        n = len(vertices)

        # Mark only cube corners as boundary, center as interior
        boundary_mask = np.ones(n, dtype=bool)
        boundary_mask[8] = False  # Center point is interior

        # Set uniform boundary displacement
        displacement = np.zeros((n, 3), dtype=np.float64)
        displacement[:8] = [0.05, 0.0, 0.0]  # All corners move right

        result = propagate_displacement(vertices, elements, boundary_mask, displacement)

        # Boundary should keep original values
        npt.assert_array_almost_equal(result[:8], displacement[:8])

        # Interior point should get interpolated value
        npt.assert_array_almost_equal(result[8], [0.05, 0.0, 0.0])

    def test_non_uniform_propagation(self) -> None:
        """Test propagation with non-uniform boundary displacement."""
        vertices, triangles = create_2d_test_mesh()
        n = len(vertices)

        # Mark only corners as boundary
        boundary_mask = np.array([True, True, True, True, False], dtype=bool)

        # Set varying boundary displacement (left side moves, right stays)
        displacement = np.zeros((n, 2), dtype=np.float64)
        displacement[0] = [0.1, 0.0]  # Bottom-left
        displacement[3] = [0.1, 0.0]  # Top-left
        displacement[1] = [0.0, 0.0]  # Bottom-right
        displacement[2] = [0.0, 0.0]  # Top-right

        result = propagate_displacement(
            vertices,
            triangles,
            boundary_mask,
            displacement,
        )

        # Interior point (center) should get average of neighbors
        # Center is connected to all corners, so it averages their displacements
        assert 0.0 < result[4, 0] < 0.1  # Between min and max

    def test_validation_errors(self) -> None:
        """Test that validation errors are raised for invalid input."""
        vertices, triangles = create_2d_test_mesh()
        n = len(vertices)

        boundary_mask = np.ones(n, dtype=bool)
        rng = np.random.default_rng(42)
        displacement = rng.random((n, 2)).astype(np.float64)

        # Wrong boundary_mask size
        with pytest.raises(ValueError, match="boundary_mask length"):
            propagate_displacement(
                vertices,
                triangles,
                np.ones(n + 1, dtype=bool),
                displacement,
            )

        # Wrong displacement rows
        with pytest.raises(ValueError, match="boundary_displacement rows"):
            propagate_displacement(
                vertices,
                triangles,
                boundary_mask,
                np.zeros((n + 1, 2)),
            )

        # Wrong displacement columns
        with pytest.raises(ValueError, match="boundary_displacement columns"):
            propagate_displacement(
                vertices,
                triangles,
                boundary_mask,
                np.zeros((n, 3)),
            )


class TestMoveMesh:
    """Tests for move_mesh function."""

    def test_uniform_displacement_2d(self) -> None:
        """Test moving 2D mesh with uniform displacement."""
        vertices, triangles = create_2d_test_mesh()
        mesh = MmgMesh2D(vertices, triangles)

        n = len(vertices)
        displacement = np.full((n, 2), [0.1, 0.0], dtype=np.float64)

        move_mesh(mesh, displacement, hmax=0.5, verbose=False)

        output_vertices = mesh.get_vertices()

        # Mesh should still be valid
        assert len(output_vertices) > 0
        assert len(mesh.get_triangles()) > 0

    def test_uniform_displacement_3d(self) -> None:
        """Test moving 3D mesh with uniform displacement."""
        vertices, elements = create_3d_test_mesh()
        mesh = MmgMesh3D(vertices, elements)

        n = len(vertices)
        displacement = np.full((n, 3), [0.1, 0.0, 0.0], dtype=np.float64)

        move_mesh(mesh, displacement, hmax=0.5, verbose=False)

        output_vertices = mesh.get_vertices()
        output_elements = mesh.get_elements()

        # Mesh should still be valid
        assert len(output_vertices) > 0
        assert len(output_elements) > 0

    def test_with_propagation_2d(self) -> None:
        """Test move_mesh with displacement propagation in 2D."""
        vertices, triangles = create_2d_test_mesh()
        mesh = MmgMesh2D(vertices, triangles)

        n = len(vertices)

        # Only specify displacement for boundary vertices
        boundary_mask = np.array([True, True, True, True, False], dtype=bool)
        displacement = np.zeros((n, 2), dtype=np.float64)
        displacement[:4] = [0.05, 0.0]

        move_mesh(
            mesh,
            displacement,
            boundary_mask=boundary_mask,
            propagate=True,
            hmax=0.5,
            verbose=False,
        )

        output_vertices = mesh.get_vertices()
        assert len(output_vertices) > 0
        assert len(mesh.get_triangles()) > 0

    def test_with_propagation_3d(self) -> None:
        """Test move_mesh with displacement propagation in 3D."""
        vertices, elements = create_3d_test_mesh()
        mesh = MmgMesh3D(vertices, elements)

        n = len(vertices)

        # Only specify displacement for boundary (cube corners)
        boundary_mask = np.ones(n, dtype=bool)
        boundary_mask[8] = False  # Center is interior

        displacement = np.zeros((n, 3), dtype=np.float64)
        displacement[:8] = [0.05, 0.0, 0.0]

        move_mesh(
            mesh,
            displacement,
            boundary_mask=boundary_mask,
            propagate=True,
            hmax=0.5,
            verbose=False,
        )

        output_vertices = mesh.get_vertices()
        output_elements = mesh.get_elements()

        assert len(output_vertices) > 0
        assert len(output_elements) > 0

    def test_multi_step(self) -> None:
        """Test move_mesh with multiple steps."""
        vertices, triangles = create_2d_test_mesh()
        mesh = MmgMesh2D(vertices, triangles)

        n = len(vertices)
        displacement = np.full((n, 2), [0.2, 0.0], dtype=np.float64)

        # Use multiple steps for large displacement
        move_mesh(mesh, displacement, n_steps=2, hmax=0.5, verbose=False)

        output_vertices = mesh.get_vertices()
        assert len(output_vertices) > 0

    def test_validation_errors(self) -> None:
        """Test that validation errors are raised."""
        vertices, triangles = create_2d_test_mesh()
        mesh = MmgMesh2D(vertices, triangles)

        n = len(vertices)

        # Wrong displacement rows
        with pytest.raises(ValueError, match="Displacement rows"):
            move_mesh(mesh, np.zeros((n + 1, 2)))

        # Wrong displacement columns
        with pytest.raises(ValueError, match="Displacement columns"):
            move_mesh(mesh, np.zeros((n, 3)))


class TestDetectBoundaryVertices:
    """Tests for boundary vertex detection."""

    def test_detect_2d_boundaries(self) -> None:
        """Test boundary detection for 2D mesh."""
        vertices, triangles = create_2d_test_mesh()
        mesh = MmgMesh2D(vertices, triangles)

        # Set up boundary edges
        mesh.set_mesh_size(
            vertices=len(vertices),
            triangles=len(triangles),
            edges=4,
        )
        mesh.set_vertices(vertices)
        mesh.set_triangles(triangles)
        mesh.set_edges(
            np.array([[0, 1], [1, 2], [2, 3], [3, 0]], dtype=np.int32),
        )

        boundary_mask = detect_boundary_vertices(mesh)

        # Should detect corner vertices as boundary
        assert boundary_mask[0]  # Corner
        assert boundary_mask[1]  # Corner
        assert boundary_mask[2]  # Corner
        assert boundary_mask[3]  # Corner

    def test_detect_3d_boundaries(self) -> None:
        """Test boundary detection for 3D mesh."""
        vertices, elements = create_3d_test_mesh()
        mesh = MmgMesh3D(vertices, elements)

        # Set up surface triangles
        mesh.set_mesh_size(
            vertices=len(vertices),
            tetrahedra=len(elements),
            triangles=4,  # Just add some surface triangles
        )
        mesh.set_vertices(vertices)
        mesh.set_tetrahedra(elements)
        # Add a few surface triangles (bottom face)
        mesh.set_triangles(
            np.array([[0, 1, 2], [0, 2, 3], [0, 1, 4], [1, 4, 5]], dtype=np.int32),
        )

        boundary_mask = detect_boundary_vertices(mesh)

        # Vertices on surface triangles should be boundary
        assert boundary_mask[0]
        assert boundary_mask[1]
        assert boundary_mask[2]


class TestIntegration:
    """Integration tests for the full workflow."""

    def test_full_workflow_2d(self) -> None:
        """Test complete 2D Lagrangian motion workflow."""
        # Create mesh
        n = 5
        x = np.linspace(0, 1, n)
        y = np.linspace(0, 1, n)
        xx, yy = np.meshgrid(x, y)
        vertices = np.column_stack([xx.ravel(), yy.ravel()]).astype(np.float64)

        # Create triangulation
        from scipy.spatial import Delaunay

        tri = Delaunay(vertices)
        triangles = tri.simplices.astype(np.int32)

        mesh = MmgMesh2D(vertices, triangles)

        # Create radial expansion displacement
        n_vertices = len(vertices)
        center = np.array([0.5, 0.5])
        displacement = np.zeros((n_vertices, 2), dtype=np.float64)

        for i in range(n_vertices):
            r = np.linalg.norm(vertices[i] - center)
            if r > 0.01:
                direction = (vertices[i] - center) / r
                displacement[i] = direction * 0.05

        # Move mesh
        move_mesh(mesh, displacement, hmax=0.3, verbose=False)

        output_vertices = mesh.get_vertices()
        output_triangles = mesh.get_triangles()

        # Verify mesh is valid
        assert len(output_vertices) > 0
        assert len(output_triangles) > 0

    def test_full_workflow_3d(self) -> None:
        """Test complete 3D Lagrangian motion workflow."""
        vertices, elements = create_3d_test_mesh()
        mesh = MmgMesh3D(vertices, elements)

        # Create expansion displacement
        n_vertices = len(vertices)
        center = np.array([0.5, 0.5, 0.5])
        displacement = np.zeros((n_vertices, 3), dtype=np.float64)

        for i in range(n_vertices):
            r = np.linalg.norm(vertices[i] - center)
            if r > 0.01:
                direction = (vertices[i] - center) / r
                displacement[i] = direction * 0.05

        # Move mesh
        move_mesh(mesh, displacement, hmax=0.5, verbose=False)

        output_vertices = mesh.get_vertices()
        output_elements = mesh.get_elements()

        # Verify mesh is valid
        assert len(output_vertices) > 0
        assert len(output_elements) > 0


def create_surface_mesh() -> tuple[np.ndarray, np.ndarray]:
    """Create a simple surface mesh (sphere approximation) for testing.

    Returns vertices and triangles for a small icosahedron-based sphere.
    """
    # Create a simple octahedron (6 vertices, 8 triangles)
    # This is a minimal surface mesh that works well for testing
    vertices = np.array(
        [
            [1.0, 0.0, 0.0],  # +X
            [-1.0, 0.0, 0.0],  # -X
            [0.0, 1.0, 0.0],  # +Y
            [0.0, -1.0, 0.0],  # -Y
            [0.0, 0.0, 1.0],  # +Z
            [0.0, 0.0, -1.0],  # -Z
        ],
        dtype=np.float64,
    )

    triangles = np.array(
        [
            [0, 2, 4],  # +X +Y +Z
            [0, 4, 3],  # +X -Y +Z
            [0, 3, 5],  # +X -Y -Z
            [0, 5, 2],  # +X +Y -Z
            [1, 4, 2],  # -X +Y +Z
            [1, 3, 4],  # -X -Y +Z
            [1, 5, 3],  # -X -Y -Z
            [1, 2, 5],  # -X +Y -Z
        ],
        dtype=np.int32,
    )

    return vertices, triangles


class TestSurfaceMeshLagrangian:
    """Tests for surface mesh Lagrangian motion."""

    def test_move_mesh_surface(self) -> None:
        """Test moving a surface mesh with uniform displacement."""
        vertices, triangles = create_surface_mesh()
        mesh = MmgMeshS(vertices, triangles)

        n = len(vertices)
        # Small uniform displacement
        displacement = np.full((n, 3), [0.05, 0.0, 0.0], dtype=np.float64)

        move_mesh(mesh, displacement, hausd=0.1, verbose=False)

        output_vertices = mesh.get_vertices()
        output_triangles = mesh.get_triangles()

        # Mesh should still be valid
        assert len(output_vertices) > 0
        assert len(output_triangles) > 0

    def test_remesh_lagrangian_surface_function(self) -> None:
        """Test remesh_lagrangian_surface function returns proper stats."""
        vertices, triangles = create_surface_mesh()
        mesh = MmgMeshS(vertices, triangles)

        n = len(vertices)
        displacement = np.full((n, 3), [0.05, 0.0, 0.0], dtype=np.float64)

        result = remesh_lagrangian_surface(mesh, displacement, hausd=0.1, verbose=False)

        # Check result structure
        assert "before" in result
        assert "after" in result
        assert "duration" in result
        assert "return_code" in result
        assert "warnings" in result

        # Check stats content
        assert result["before"]["vertices"] > 0
        assert result["before"]["triangles"] > 0
        assert result["after"]["vertices"] > 0
        assert result["after"]["triangles"] > 0
        assert result["duration"] >= 0
        assert result["return_code"] == 1

    def test_mmgmeshs_remesh_lagrangian_method(self) -> None:
        """Test MmgMeshS.remesh_lagrangian method (monkey-patched)."""
        vertices, triangles = create_surface_mesh()
        mesh = MmgMeshS(vertices, triangles)

        n = len(vertices)
        displacement = np.full((n, 3), [0.05, 0.0, 0.0], dtype=np.float64)

        # Use the method directly on MmgMeshS (monkey-patched)
        result = mesh.remesh_lagrangian(displacement, hausd=0.1, verbose=False)

        # Check result structure
        assert "before" in result
        assert "after" in result
        assert "duration" in result
        assert result["return_code"] == 1

    def test_radial_expansion_surface(self) -> None:
        """Test radial expansion displacement on surface mesh."""
        vertices, triangles = create_surface_mesh()
        mesh = MmgMeshS(vertices, triangles)

        # Create radial expansion: move vertices outward from center
        center = np.array([0.0, 0.0, 0.0])
        n = len(vertices)
        displacement = np.zeros((n, 3), dtype=np.float64)

        for i in range(n):
            r = np.linalg.norm(vertices[i] - center)
            if r > 0.01:
                direction = (vertices[i] - center) / r
                displacement[i] = direction * 0.1  # 10% expansion

        result = mesh.remesh_lagrangian(displacement, hausd=0.1, verbose=False)

        output_vertices = mesh.get_vertices()

        # After expansion, mesh should still be valid
        assert len(output_vertices) > 0
        assert result["after"]["triangles"] > 0

    def test_surface_mesh_with_n_steps(self) -> None:
        """Test surface mesh Lagrangian with multiple steps."""
        vertices, triangles = create_surface_mesh()
        mesh = MmgMeshS(vertices, triangles)

        n = len(vertices)
        # Larger displacement that benefits from multiple steps
        displacement = np.full((n, 3), [0.2, 0.0, 0.0], dtype=np.float64)

        result = mesh.remesh_lagrangian(
            displacement,
            n_steps=3,
            hausd=0.1,
            verbose=False,
        )

        output_vertices = mesh.get_vertices()
        output_triangles = mesh.get_triangles()

        assert len(output_vertices) > 0
        assert len(output_triangles) > 0
        assert result["return_code"] == 1

    def test_surface_with_remesh_options(self) -> None:
        """Test surface mesh Lagrangian with various remesh options."""
        vertices, triangles = create_surface_mesh()
        mesh = MmgMeshS(vertices, triangles)

        n = len(vertices)
        displacement = np.full((n, 3), [0.05, 0.0, 0.0], dtype=np.float64)

        result = mesh.remesh_lagrangian(
            displacement,
            hausd=0.05,
            hmax=0.5,
            verbose=False,
        )

        assert result["return_code"] == 1
        assert result["after"]["vertices"] > 0

    def test_displacement_validation_surface(self) -> None:
        """Test that displacement validation works for surface meshes."""
        vertices, triangles = create_surface_mesh()
        mesh = MmgMeshS(vertices, triangles)

        n = len(vertices)

        # Wrong displacement rows
        with pytest.raises(ValueError, match="Displacement rows"):
            mesh.remesh_lagrangian(np.zeros((n + 1, 3)))

        # Wrong displacement columns
        with pytest.raises(ValueError, match="Displacement columns"):
            mesh.remesh_lagrangian(np.zeros((n, 2)))

    def test_quality_stats_surface(self) -> None:
        """Test that quality statistics are collected for surface mesh."""
        vertices, triangles = create_surface_mesh()
        mesh = MmgMeshS(vertices, triangles)

        n = len(vertices)
        displacement = np.full((n, 3), [0.03, 0.0, 0.0], dtype=np.float64)

        result = mesh.remesh_lagrangian(displacement, hausd=0.1, verbose=False)

        # Check quality stats
        assert "quality_min" in result["before"]
        assert "quality_mean" in result["before"]
        assert "quality_min" in result["after"]
        assert "quality_mean" in result["after"]

        # Quality should be in valid range [0, 1]
        assert 0 <= result["before"]["quality_min"] <= 1
        assert 0 <= result["before"]["quality_mean"] <= 1
        assert 0 <= result["after"]["quality_min"] <= 1
        assert 0 <= result["after"]["quality_mean"] <= 1


class TestSurfaceMeshIntegration:
    """Integration tests for surface mesh Lagrangian motion."""

    def test_complete_workflow(self) -> None:
        """Test complete surface mesh Lagrangian motion workflow."""
        # Create a slightly more complex surface mesh (subdivided octahedron)
        vertices, triangles = create_surface_mesh()
        mesh = MmgMeshS(vertices, triangles)

        original_vertices = mesh.get_vertices().copy()

        # Apply displacement
        n = len(original_vertices)
        center = np.array([0.0, 0.0, 0.0])
        displacement = np.zeros((n, 3), dtype=np.float64)

        for i in range(n):
            r = np.linalg.norm(original_vertices[i] - center)
            if r > 0.01:
                direction = (original_vertices[i] - center) / r
                displacement[i] = direction * 0.15  # 15% expansion

        # Perform Lagrangian motion
        result = mesh.remesh_lagrangian(
            displacement,
            n_steps=2,
            hausd=0.1,
            verbose=False,
        )

        final_vertices = mesh.get_vertices()
        final_triangles = mesh.get_triangles()

        # Verify mesh is valid
        assert len(final_vertices) > 0
        assert len(final_triangles) > 0
        assert result["return_code"] == 1
        assert result["duration"] > 0

    def test_api_consistency_with_3d(self) -> None:
        """Test that surface mesh API is consistent with 3D mesh API."""
        # Create both surface and 3D meshes
        surface_vertices, surface_triangles = create_surface_mesh()
        surface_mesh = MmgMeshS(surface_vertices, surface_triangles)

        volume_vertices, volume_elements = create_3d_test_mesh()
        volume_mesh = MmgMesh3D(volume_vertices, volume_elements)

        # Both should have remesh_lagrangian method
        assert hasattr(surface_mesh, "remesh_lagrangian")
        assert hasattr(volume_mesh, "remesh_lagrangian")

        # Surface mesh method signature should work similarly
        n_surface = len(surface_vertices)
        disp_value = [0.05, 0.0, 0.0]
        surface_displacement = np.full((n_surface, 3), disp_value, dtype=np.float64)

        surface_result = surface_mesh.remesh_lagrangian(
            surface_displacement,
            hausd=0.1,
            verbose=False,
        )

        # Check that result has similar structure
        assert "before" in surface_result
        assert "after" in surface_result
        assert "duration" in surface_result

    def test_detect_boundary_surface(self) -> None:
        """Test boundary detection for surface mesh."""
        vertices, triangles = create_surface_mesh()
        mesh = MmgMeshS(vertices, triangles)

        # For surface meshes, detect_boundary should work via triangles fallback
        boundary_mask = detect_boundary_vertices(mesh)

        # Should return a boolean array
        assert boundary_mask.dtype == bool
        assert len(boundary_mask) == len(vertices)
