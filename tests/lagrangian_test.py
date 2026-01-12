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


class TestMmgMeshSLagrangianNotSupported:
    """Tests for MmgMeshS Lagrangian motion not being supported."""

    def test_remesh_lagrangian_raises_runtime_error(self) -> None:
        """Test that MmgMeshS.remesh_lagrangian raises RuntimeError."""
        # Create a simple surface mesh (icosahedron)
        t = (1.0 + np.sqrt(5.0)) / 2.0
        vertices = np.array(
            [
                [-1, t, 0],
                [1, t, 0],
                [-1, -t, 0],
                [1, -t, 0],
                [0, -1, t],
                [0, 1, t],
                [0, -1, -t],
                [0, 1, -t],
                [t, 0, -1],
                [t, 0, 1],
                [-t, 0, -1],
                [-t, 0, 1],
            ],
            dtype=np.float64,
        )
        # Normalize to unit sphere
        vertices /= np.linalg.norm(vertices[0])

        triangles = np.array(
            [
                [0, 11, 5],
                [0, 5, 1],
                [0, 1, 7],
                [0, 7, 10],
                [0, 10, 11],
                [1, 5, 9],
                [5, 11, 4],
                [11, 10, 2],
                [10, 7, 6],
                [7, 1, 8],
                [3, 9, 4],
                [3, 4, 2],
                [3, 2, 6],
                [3, 6, 8],
                [3, 8, 9],
                [4, 9, 5],
                [2, 4, 11],
                [6, 2, 10],
                [8, 6, 7],
                [9, 8, 1],
            ],
            dtype=np.int32,
        )

        mesh = MmgMeshS(vertices, triangles)
        displacement = np.zeros((len(vertices), 3), dtype=np.float64)
        displacement[:, 0] = 0.1  # Try to move in x

        with pytest.raises(
            RuntimeError,
            match="not supported for surface meshes",
        ):
            mesh.remesh_lagrangian(displacement)

    def test_error_message_suggests_alternative(self) -> None:
        """Test that the error message suggests move_mesh as an alternative."""
        vertices = np.array(
            [[0, 0, 0], [1, 0, 0], [0.5, 1, 0]],
            dtype=np.float64,
        )
        triangles = np.array([[0, 1, 2]], dtype=np.int32)

        mesh = MmgMeshS(vertices, triangles)
        displacement = np.zeros((3, 3), dtype=np.float64)

        with pytest.raises(RuntimeError) as exc_info:
            mesh.remesh_lagrangian(displacement)

        error_msg = str(exc_info.value)
        assert "move_mesh" in error_msg
        assert "ELAS" in error_msg or "elasticity" in error_msg
