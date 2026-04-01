"""Tests for topology query functionality."""

import numpy as np
import pytest

from mmgpy._mmgpy import MmgMesh2D, MmgMesh3D, MmgMeshS


class TestTopologyQueries3D:
    """Tests for 3D topology queries."""

    def test_get_adjacent_elements(
        self,
        cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test getting adjacent elements for MmgMesh3D."""
        vertices, elements = cube_mesh

        mesh = MmgMesh3D()
        mesh.set_mesh_size(vertices=len(vertices), tetrahedra=len(elements))
        mesh.set_vertices(vertices)
        mesh.set_tetrahedra(elements)

        # Test for the center tetrahedron (index 4) which shares faces with others
        adjacent = mesh.get_adjacent_elements(4)
        assert adjacent.shape == (4,), "Should return 4 adjacent elements (per face)"
        assert adjacent.dtype == np.int32

        # -1 indicates boundary (no neighbor on that face)
        # Valid neighbors are 0-based indices
        for idx in adjacent:
            assert idx >= -1
            assert idx < len(elements)

    def test_get_vertex_neighbors(
        self,
        cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test getting vertex neighbors for MmgMesh3D."""
        vertices, elements = cube_mesh

        mesh = MmgMesh3D()
        mesh.set_mesh_size(vertices=len(vertices), tetrahedra=len(elements))
        mesh.set_vertices(vertices)
        mesh.set_tetrahedra(elements)

        # Test for vertex 3 which is connected to multiple tetrahedra
        neighbors = mesh.get_vertex_neighbors(3)
        assert neighbors.dtype == np.int32
        assert len(neighbors) > 0, "Vertex should have neighbors"

        for idx in neighbors:
            assert idx >= 0
            assert idx < len(vertices)

        assert 3 not in neighbors, "Vertex 3 is not in its own neighbors"

    def test_invalid_indices(self, cube_mesh: tuple[np.ndarray, np.ndarray]) -> None:
        """Test that invalid indices raise errors for topology queries."""
        vertices, elements = cube_mesh

        mesh = MmgMesh3D()
        mesh.set_mesh_size(vertices=len(vertices), tetrahedra=len(elements))
        mesh.set_vertices(vertices)
        mesh.set_tetrahedra(elements)

        with pytest.raises(RuntimeError, match="out of range"):
            mesh.get_adjacent_elements(100)

        with pytest.raises(RuntimeError, match="out of range"):
            mesh.get_vertex_neighbors(100)


class TestTopologyQueries2D:
    """Tests for 2D topology queries."""

    def test_get_adjacent_elements(
        self,
        square_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test getting adjacent elements for MmgMesh2D."""
        vertices, triangles = square_mesh

        mesh = MmgMesh2D()
        mesh.set_mesh_size(vertices=len(vertices), triangles=len(triangles))
        mesh.set_vertices(vertices)
        mesh.set_triangles(triangles)

        adjacent = mesh.get_adjacent_elements(0)
        assert adjacent.shape == (3,), "Should return 3 adjacent elements (per edge)"
        assert adjacent.dtype == np.int32

        for idx in adjacent:
            assert idx >= -1
            assert idx < len(triangles)

    def test_get_vertex_neighbors(
        self,
        square_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test getting vertex neighbors for MmgMesh2D."""
        vertices, triangles = square_mesh

        mesh = MmgMesh2D()
        mesh.set_mesh_size(vertices=len(vertices), triangles=len(triangles))
        mesh.set_vertices(vertices)
        mesh.set_triangles(triangles)

        neighbors = mesh.get_vertex_neighbors(0)
        assert neighbors.dtype == np.int32
        assert len(neighbors) > 0

        for idx in neighbors:
            assert idx >= 0
            assert idx < len(vertices)

        assert 0 not in neighbors


class TestTopologyQueriesSurface:
    """Tests for surface mesh topology queries."""

    def test_get_adjacent_elements(
        self,
        tetrahedron_surface_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test getting adjacent elements for MmgMeshS."""
        vertices, triangles = tetrahedron_surface_mesh

        mesh = MmgMeshS()
        mesh.set_mesh_size(vertices=len(vertices), triangles=len(triangles))
        mesh.set_vertices(vertices)
        mesh.set_triangles(triangles)

        adjacent = mesh.get_adjacent_elements(0)
        assert adjacent.shape == (3,)
        assert adjacent.dtype == np.int32

        for idx in adjacent:
            assert idx >= -1
            assert idx < len(triangles)

    def test_get_vertex_neighbors(
        self,
        tetrahedron_surface_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test getting vertex neighbors for MmgMeshS."""
        vertices, triangles = tetrahedron_surface_mesh

        mesh = MmgMeshS()
        mesh.set_mesh_size(vertices=len(vertices), triangles=len(triangles))
        mesh.set_vertices(vertices)
        mesh.set_triangles(triangles)

        neighbors = mesh.get_vertex_neighbors(0)
        assert neighbors.dtype == np.int32
        assert len(neighbors) > 0

        for idx in neighbors:
            assert idx >= 0
            assert idx < len(vertices)

        assert 0 not in neighbors


class TestNormalVectors3D:
    """Tests for normal vector operations on MmgMesh3D."""

    def test_set_normal_at_vertices(
        self,
        cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test setting normals at vertices."""
        vertices, elements = cube_mesh

        mesh = MmgMesh3D()
        mesh.set_mesh_size(vertices=len(vertices), tetrahedra=len(elements))
        mesh.set_vertices(vertices)
        mesh.set_tetrahedra(elements)

        indices = np.array([0, 1, 2], dtype=np.int32)
        normals = np.array(
            [[0.0, 0.0, 1.0], [0.0, 1.0, 0.0], [1.0, 0.0, 0.0]],
            dtype=np.float64,
        )
        mesh.set_normal_at_vertices(indices, normals)

    def test_set_and_get_round_trip(
        self,
        cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test that set then get returns the same normals."""
        vertices, elements = cube_mesh

        mesh = MmgMesh3D()
        mesh.set_mesh_size(vertices=len(vertices), tetrahedra=len(elements))
        mesh.set_vertices(vertices)
        mesh.set_tetrahedra(elements)

        indices = np.array([0, 3, 5], dtype=np.int32)
        normals = np.array(
            [[0.0, 0.0, 1.0], [0.0, 1.0, 0.0], [1.0, 0.0, 0.0]],
            dtype=np.float64,
        )
        mesh.set_normal_at_vertices(indices, normals)
        result = mesh.get_normal_at_vertices(indices)

        assert result.shape == (3, 3)
        assert result.dtype == np.float64
        np.testing.assert_allclose(result, normals)

    def test_shape_validation(
        self,
        cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test that mismatched shapes raise errors."""
        vertices, elements = cube_mesh

        mesh = MmgMesh3D()
        mesh.set_mesh_size(vertices=len(vertices), tetrahedra=len(elements))
        mesh.set_vertices(vertices)
        mesh.set_tetrahedra(elements)

        indices = np.array([0, 1], dtype=np.int32)
        wrong_normals = np.array([[0.0, 0.0, 1.0]], dtype=np.float64)

        with pytest.raises(RuntimeError, match="same length"):
            mesh.set_normal_at_vertices(indices, wrong_normals)

    def test_normals_must_be_nx3(
        self,
        cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test that normals must be Nx3."""
        vertices, elements = cube_mesh

        mesh = MmgMesh3D()
        mesh.set_mesh_size(vertices=len(vertices), tetrahedra=len(elements))
        mesh.set_vertices(vertices)
        mesh.set_tetrahedra(elements)

        indices = np.array([0], dtype=np.int32)
        wrong_shape = np.array([[0.0, 0.0]], dtype=np.float64)

        with pytest.raises(RuntimeError, match="Nx3"):
            mesh.set_normal_at_vertices(indices, wrong_shape)

    def test_invalid_index(
        self,
        cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test out-of-range vertex index."""
        vertices, elements = cube_mesh

        mesh = MmgMesh3D()
        mesh.set_mesh_size(vertices=len(vertices), tetrahedra=len(elements))
        mesh.set_vertices(vertices)
        mesh.set_tetrahedra(elements)

        indices = np.array([100], dtype=np.int32)
        normals = np.array([[0.0, 0.0, 1.0]], dtype=np.float64)

        with pytest.raises(RuntimeError, match="out of range"):
            mesh.set_normal_at_vertices(indices, normals)

        with pytest.raises(RuntimeError, match="out of range"):
            mesh.get_normal_at_vertices(indices)

    def test_empty_arrays(
        self,
        cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test that empty arrays work correctly."""
        vertices, elements = cube_mesh

        mesh = MmgMesh3D()
        mesh.set_mesh_size(vertices=len(vertices), tetrahedra=len(elements))
        mesh.set_vertices(vertices)
        mesh.set_tetrahedra(elements)

        indices = np.array([], dtype=np.int32)
        normals = np.empty((0, 3), dtype=np.float64)
        mesh.set_normal_at_vertices(indices, normals)
        result = mesh.get_normal_at_vertices(indices)
        assert result.shape == (0, 3)


class TestNormalVectorsSurface:
    """Tests for normal vector operations on MmgMeshS."""

    def test_set_normal_at_vertices(
        self,
        tetrahedron_surface_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test setting normals at vertices for surface mesh."""
        vertices, triangles = tetrahedron_surface_mesh

        mesh = MmgMeshS()
        mesh.set_mesh_size(vertices=len(vertices), triangles=len(triangles))
        mesh.set_vertices(vertices)
        mesh.set_triangles(triangles)

        indices = np.array([0, 1], dtype=np.int32)
        normals = np.array(
            [[0.0, 0.0, 1.0], [0.0, 1.0, 0.0]],
            dtype=np.float64,
        )
        mesh.set_normal_at_vertices(indices, normals)

    def test_set_and_get_round_trip(
        self,
        tetrahedron_surface_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test that set then get returns the same normals for surface mesh."""
        vertices, triangles = tetrahedron_surface_mesh

        mesh = MmgMeshS()
        mesh.set_mesh_size(vertices=len(vertices), triangles=len(triangles))
        mesh.set_vertices(vertices)
        mesh.set_triangles(triangles)

        indices = np.array([0, 2], dtype=np.int32)
        normals = np.array(
            [[0.0, 0.0, 1.0], [1.0, 0.0, 0.0]],
            dtype=np.float64,
        )
        mesh.set_normal_at_vertices(indices, normals)
        result = mesh.get_normal_at_vertices(indices)

        assert result.shape == (2, 3)
        assert result.dtype == np.float64
        np.testing.assert_allclose(result, normals)

    def test_invalid_index(
        self,
        tetrahedron_surface_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test out-of-range vertex index for surface mesh."""
        vertices, triangles = tetrahedron_surface_mesh

        mesh = MmgMeshS()
        mesh.set_mesh_size(vertices=len(vertices), triangles=len(triangles))
        mesh.set_vertices(vertices)
        mesh.set_triangles(triangles)

        indices = np.array([100], dtype=np.int32)
        normals = np.array([[0.0, 0.0, 1.0]], dtype=np.float64)

        with pytest.raises(RuntimeError, match="out of range"):
            mesh.set_normal_at_vertices(indices, normals)

        with pytest.raises(RuntimeError, match="out of range"):
            mesh.get_normal_at_vertices(indices)


class TestElementAttributes3D:
    """Tests for 3D element attributes."""

    def test_set_corners(self, cube_mesh: tuple[np.ndarray, np.ndarray]) -> None:
        """Test setting corner vertices for MmgMesh3D."""
        vertices, elements = cube_mesh

        mesh = MmgMesh3D()
        mesh.set_mesh_size(vertices=len(vertices), tetrahedra=len(elements))
        mesh.set_vertices(vertices)
        mesh.set_tetrahedra(elements)

        corner_indices = np.array([0, 2, 4, 6], dtype=np.int32)
        mesh.set_corners(corner_indices)

        for idx in corner_indices:
            is_corner, _ = mesh.get_vertex_flags(idx)
            assert is_corner, f"Vertex {idx} should be marked as corner"

        non_corner = 1
        is_corner, _ = mesh.get_vertex_flags(non_corner)
        assert not is_corner, f"Vertex {non_corner} should not be corner"

    def test_set_required_vertices(
        self,
        cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test setting required vertices for MmgMesh3D."""
        vertices, elements = cube_mesh

        mesh = MmgMesh3D()
        mesh.set_mesh_size(vertices=len(vertices), tetrahedra=len(elements))
        mesh.set_vertices(vertices)
        mesh.set_tetrahedra(elements)

        required_indices = np.array([0, 1, 2, 3], dtype=np.int32)
        mesh.set_required_vertices(required_indices)

        for idx in required_indices:
            _, is_required = mesh.get_vertex_flags(idx)
            assert is_required, f"Vertex {idx} should be marked as required"

        non_required = 4
        _, is_required = mesh.get_vertex_flags(non_required)
        assert not is_required, f"Vertex {non_required} should not be required"

    def test_set_required_triangles(
        self,
        cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test setting required triangles for MmgMesh3D."""
        vertices, elements = cube_mesh

        triangles = np.array(
            [
                [0, 1, 3],
                [1, 2, 3],
                [4, 5, 7],
                [5, 6, 7],
            ],
            dtype=np.int32,
        )

        mesh = MmgMesh3D()
        mesh.set_mesh_size(
            vertices=len(vertices),
            tetrahedra=len(elements),
            triangles=len(triangles),
        )
        mesh.set_vertices(vertices)
        mesh.set_tetrahedra(elements)
        mesh.set_triangles(triangles)

        required_indices = np.array([0, 2], dtype=np.int32)
        mesh.set_required_triangles(required_indices)

    def test_set_required_edges(
        self,
        cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test setting required edges for MmgMesh3D."""
        vertices, elements = cube_mesh

        edges = np.array(
            [
                [0, 1],
                [1, 2],
                [2, 3],
                [3, 0],
            ],
            dtype=np.int32,
        )

        mesh = MmgMesh3D()
        mesh.set_mesh_size(
            vertices=len(vertices),
            tetrahedra=len(elements),
            edges=len(edges),
        )
        mesh.set_vertices(vertices)
        mesh.set_tetrahedra(elements)
        mesh.set_edges(edges)

        required_indices = np.array([0, 2], dtype=np.int32)
        mesh.set_required_edges(required_indices)

    def test_set_required_tetrahedra(
        self,
        cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test setting required tetrahedra for MmgMesh3D."""
        vertices, elements = cube_mesh

        mesh = MmgMesh3D()
        mesh.set_mesh_size(vertices=len(vertices), tetrahedra=len(elements))
        mesh.set_vertices(vertices)
        mesh.set_tetrahedra(elements)

        required_indices = np.array([0, 2], dtype=np.int32)
        mesh.set_required_tetrahedra(required_indices)

    def test_set_ridge_edges(self, cube_mesh: tuple[np.ndarray, np.ndarray]) -> None:
        """Test setting ridge edges for MmgMesh3D."""
        vertices, elements = cube_mesh

        edges = np.array(
            [
                [0, 1],
                [1, 2],
                [2, 3],
                [3, 0],
            ],
            dtype=np.int32,
        )

        mesh = MmgMesh3D()
        mesh.set_mesh_size(
            vertices=len(vertices),
            tetrahedra=len(elements),
            edges=len(edges),
        )
        mesh.set_vertices(vertices)
        mesh.set_tetrahedra(elements)
        mesh.set_edges(edges)

        ridge_indices = np.array([0, 2], dtype=np.int32)
        mesh.set_ridge_edges(ridge_indices)

    def test_set_parallel_triangles(
        self,
        cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test setting parallel triangles for MmgMesh3D."""
        vertices, elements = cube_mesh

        triangles = np.array(
            [
                [0, 1, 3],
                [1, 2, 3],
                [4, 5, 7],
                [5, 6, 7],
            ],
            dtype=np.int32,
        )

        mesh = MmgMesh3D()
        mesh.set_mesh_size(
            vertices=len(vertices),
            tetrahedra=len(elements),
            triangles=len(triangles),
        )
        mesh.set_vertices(vertices)
        mesh.set_tetrahedra(elements)
        mesh.set_triangles(triangles)

        parallel_indices = np.array([0, 2], dtype=np.int32)
        mesh.set_parallel_triangles(parallel_indices)

    def test_invalid_indices(self, cube_mesh: tuple[np.ndarray, np.ndarray]) -> None:
        """Test that invalid indices raise errors."""
        vertices, elements = cube_mesh

        mesh = MmgMesh3D()
        mesh.set_mesh_size(vertices=len(vertices), tetrahedra=len(elements))
        mesh.set_vertices(vertices)
        mesh.set_tetrahedra(elements)

        with pytest.raises(RuntimeError, match="out of range"):
            mesh.set_corners(np.array([100], dtype=np.int32))

        with pytest.raises(RuntimeError, match="out of range"):
            mesh.set_required_vertices(np.array([-1], dtype=np.int32))

        with pytest.raises(RuntimeError, match="out of range"):
            mesh.set_required_tetrahedra(np.array([100], dtype=np.int32))

    def test_empty_array(self, cube_mesh: tuple[np.ndarray, np.ndarray]) -> None:
        """Test that empty arrays work correctly."""
        vertices, elements = cube_mesh

        mesh = MmgMesh3D()
        mesh.set_mesh_size(vertices=len(vertices), tetrahedra=len(elements))
        mesh.set_vertices(vertices)
        mesh.set_tetrahedra(elements)

        mesh.set_corners(np.array([], dtype=np.int32))
        mesh.set_required_vertices(np.array([], dtype=np.int32))


class TestElementAttributes2D:
    """Tests for 2D element attributes."""

    def test_set_corners(self, square_mesh: tuple[np.ndarray, np.ndarray]) -> None:
        """Test setting corner vertices for MmgMesh2D."""
        vertices, triangles = square_mesh

        mesh = MmgMesh2D()
        mesh.set_mesh_size(vertices=len(vertices), triangles=len(triangles))
        mesh.set_vertices(vertices)
        mesh.set_triangles(triangles)

        corner_indices = np.array([0, 1, 2, 3], dtype=np.int32)
        mesh.set_corners(corner_indices)

        for idx in corner_indices:
            is_corner, _ = mesh.get_vertex_flags(idx)
            assert is_corner

    def test_set_required_vertices(
        self,
        square_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test setting required vertices for MmgMesh2D."""
        vertices, triangles = square_mesh

        mesh = MmgMesh2D()
        mesh.set_mesh_size(vertices=len(vertices), triangles=len(triangles))
        mesh.set_vertices(vertices)
        mesh.set_triangles(triangles)

        required_indices = np.array([0, 2], dtype=np.int32)
        mesh.set_required_vertices(required_indices)

        for idx in required_indices:
            _, is_required = mesh.get_vertex_flags(idx)
            assert is_required

    def test_set_required_triangles(
        self,
        square_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test setting required triangles for MmgMesh2D."""
        vertices, triangles = square_mesh

        mesh = MmgMesh2D()
        mesh.set_mesh_size(vertices=len(vertices), triangles=len(triangles))
        mesh.set_vertices(vertices)
        mesh.set_triangles(triangles)

        required_indices = np.array([0], dtype=np.int32)
        mesh.set_required_triangles(required_indices)

    def test_set_required_edges(
        self,
        square_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test setting required edges for MmgMesh2D."""
        vertices, triangles = square_mesh

        edges = np.array(
            [
                [0, 1],
                [1, 2],
                [2, 3],
                [3, 0],
            ],
            dtype=np.int32,
        )

        mesh = MmgMesh2D()
        mesh.set_mesh_size(
            vertices=len(vertices),
            triangles=len(triangles),
            edges=len(edges),
        )
        mesh.set_vertices(vertices)
        mesh.set_triangles(triangles)
        mesh.set_edges(edges)

        required_edge_indices = np.array([0, 1], dtype=np.int32)
        mesh.set_required_edges(required_edge_indices)

    def test_set_parallel_edges(
        self,
        square_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test setting parallel edges for MmgMesh2D."""
        vertices, triangles = square_mesh

        edges = np.array(
            [
                [0, 1],
                [1, 2],
                [2, 3],
                [3, 0],
            ],
            dtype=np.int32,
        )

        mesh = MmgMesh2D()
        mesh.set_mesh_size(
            vertices=len(vertices),
            triangles=len(triangles),
            edges=len(edges),
        )
        mesh.set_vertices(vertices)
        mesh.set_triangles(triangles)
        mesh.set_edges(edges)

        parallel_indices = np.array([0, 2], dtype=np.int32)
        mesh.set_parallel_edges(parallel_indices)


class TestElementAttributesSurface:
    """Tests for surface mesh element attributes."""

    def test_set_corners(
        self,
        tetrahedron_surface_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test setting corner vertices for MmgMeshS."""
        vertices, triangles = tetrahedron_surface_mesh

        mesh = MmgMeshS()
        mesh.set_mesh_size(vertices=len(vertices), triangles=len(triangles))
        mesh.set_vertices(vertices)
        mesh.set_triangles(triangles)

        corner_indices = np.array([0, 1, 2, 3], dtype=np.int32)
        mesh.set_corners(corner_indices)

        for idx in corner_indices:
            is_corner, _ = mesh.get_vertex_flags(idx)
            assert is_corner

    def test_set_required_vertices(
        self,
        tetrahedron_surface_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test setting required vertices for MmgMeshS."""
        vertices, triangles = tetrahedron_surface_mesh

        mesh = MmgMeshS()
        mesh.set_mesh_size(vertices=len(vertices), triangles=len(triangles))
        mesh.set_vertices(vertices)
        mesh.set_triangles(triangles)

        required_indices = np.array([0, 2], dtype=np.int32)
        mesh.set_required_vertices(required_indices)

        for idx in required_indices:
            _, is_required = mesh.get_vertex_flags(idx)
            assert is_required

    def test_set_required_triangles(
        self,
        tetrahedron_surface_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test setting required triangles for MmgMeshS."""
        vertices, triangles = tetrahedron_surface_mesh

        mesh = MmgMeshS()
        mesh.set_mesh_size(vertices=len(vertices), triangles=len(triangles))
        mesh.set_vertices(vertices)
        mesh.set_triangles(triangles)

        required_indices = np.array([0, 2], dtype=np.int32)
        mesh.set_required_triangles(required_indices)

    def test_set_required_edges(
        self,
        tetrahedron_surface_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test setting required edges for MmgMeshS."""
        vertices, triangles = tetrahedron_surface_mesh

        edges = np.array(
            [
                [0, 1],
                [1, 2],
                [2, 3],
                [3, 0],
            ],
            dtype=np.int32,
        )

        mesh = MmgMeshS()
        mesh.set_mesh_size(
            vertices=len(vertices),
            triangles=len(triangles),
            edges=len(edges),
        )
        mesh.set_vertices(vertices)
        mesh.set_triangles(triangles)
        mesh.set_edges(edges)

        required_indices = np.array([0, 2], dtype=np.int32)
        mesh.set_required_edges(required_indices)

    def test_set_ridge_edges(
        self,
        tetrahedron_surface_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test setting ridge edges for MmgMeshS."""
        vertices, triangles = tetrahedron_surface_mesh

        edges = np.array(
            [
                [0, 1],
                [1, 2],
                [2, 3],
                [3, 0],
            ],
            dtype=np.int32,
        )

        mesh = MmgMeshS()
        mesh.set_mesh_size(
            vertices=len(vertices),
            triangles=len(triangles),
            edges=len(edges),
        )
        mesh.set_vertices(vertices)
        mesh.set_triangles(triangles)
        mesh.set_edges(edges)

        ridge_indices = np.array([0, 2], dtype=np.int32)
        mesh.set_ridge_edges(ridge_indices)


class TestUnsetAttributes3D:
    """Tests for unsetting 3D element attributes."""

    def test_unset_corners(self, cube_mesh: tuple[np.ndarray, np.ndarray]) -> None:
        """Test setting then unsetting corners for MmgMesh3D."""
        vertices, elements = cube_mesh

        mesh = MmgMesh3D()
        mesh.set_mesh_size(vertices=len(vertices), tetrahedra=len(elements))
        mesh.set_vertices(vertices)
        mesh.set_tetrahedra(elements)

        indices = np.array([0, 2, 4], dtype=np.int32)
        mesh.set_corners(indices)

        for idx in indices:
            is_corner, _ = mesh.get_vertex_flags(idx)
            assert is_corner

        mesh.unset_corners(indices)

        for idx in indices:
            is_corner, _ = mesh.get_vertex_flags(idx)
            assert not is_corner

    def test_unset_required_vertices(
        self,
        cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test setting then unsetting required vertices for MmgMesh3D."""
        vertices, elements = cube_mesh

        mesh = MmgMesh3D()
        mesh.set_mesh_size(vertices=len(vertices), tetrahedra=len(elements))
        mesh.set_vertices(vertices)
        mesh.set_tetrahedra(elements)

        indices = np.array([0, 1, 2], dtype=np.int32)
        mesh.set_required_vertices(indices)

        for idx in indices:
            _, is_required = mesh.get_vertex_flags(idx)
            assert is_required

        mesh.unset_required_vertices(indices)

        for idx in indices:
            _, is_required = mesh.get_vertex_flags(idx)
            assert not is_required

    def test_unset_required_triangles(
        self,
        cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test setting then unsetting required triangles for MmgMesh3D."""
        vertices, elements = cube_mesh

        triangles = np.array(
            [[0, 1, 3], [1, 2, 3], [4, 5, 7], [5, 6, 7]],
            dtype=np.int32,
        )

        mesh = MmgMesh3D()
        mesh.set_mesh_size(
            vertices=len(vertices),
            tetrahedra=len(elements),
            triangles=len(triangles),
        )
        mesh.set_vertices(vertices)
        mesh.set_tetrahedra(elements)
        mesh.set_triangles(triangles)

        indices = np.array([0, 2], dtype=np.int32)
        mesh.set_required_triangles(indices)
        mesh.unset_required_triangles(indices)

    def test_unset_required_edges(
        self,
        cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test setting then unsetting required edges for MmgMesh3D."""
        vertices, elements = cube_mesh

        edges = np.array([[0, 1], [1, 2], [2, 3], [3, 0]], dtype=np.int32)

        mesh = MmgMesh3D()
        mesh.set_mesh_size(
            vertices=len(vertices),
            tetrahedra=len(elements),
            edges=len(edges),
        )
        mesh.set_vertices(vertices)
        mesh.set_tetrahedra(elements)
        mesh.set_edges(edges)

        indices = np.array([0, 2], dtype=np.int32)
        mesh.set_required_edges(indices)
        mesh.unset_required_edges(indices)

    def test_unset_required_tetrahedra(
        self,
        cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test setting then unsetting required tetrahedra for MmgMesh3D."""
        vertices, elements = cube_mesh

        mesh = MmgMesh3D()
        mesh.set_mesh_size(vertices=len(vertices), tetrahedra=len(elements))
        mesh.set_vertices(vertices)
        mesh.set_tetrahedra(elements)

        indices = np.array([0, 2], dtype=np.int32)
        mesh.set_required_tetrahedra(indices)
        mesh.unset_required_tetrahedra(indices)

    def test_unset_ridge_edges(
        self,
        cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test setting then unsetting ridge edges for MmgMesh3D."""
        vertices, elements = cube_mesh

        edges = np.array([[0, 1], [1, 2], [2, 3], [3, 0]], dtype=np.int32)

        mesh = MmgMesh3D()
        mesh.set_mesh_size(
            vertices=len(vertices),
            tetrahedra=len(elements),
            edges=len(edges),
        )
        mesh.set_vertices(vertices)
        mesh.set_tetrahedra(elements)
        mesh.set_edges(edges)

        indices = np.array([0, 2], dtype=np.int32)
        mesh.set_ridge_edges(indices)
        mesh.unset_ridge_edges(indices)

    def test_unset_parallel_triangles(
        self,
        cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test setting then unsetting parallel triangles for MmgMesh3D."""
        vertices, elements = cube_mesh

        triangles = np.array(
            [[0, 1, 3], [1, 2, 3], [4, 5, 7], [5, 6, 7]],
            dtype=np.int32,
        )

        mesh = MmgMesh3D()
        mesh.set_mesh_size(
            vertices=len(vertices),
            tetrahedra=len(elements),
            triangles=len(triangles),
        )
        mesh.set_vertices(vertices)
        mesh.set_tetrahedra(elements)
        mesh.set_triangles(triangles)

        indices = np.array([0, 2], dtype=np.int32)
        mesh.set_parallel_triangles(indices)
        mesh.unset_parallel_triangles(indices)

    def test_unset_invalid_indices(
        self,
        cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test that invalid indices raise errors for unset operations."""
        vertices, elements = cube_mesh

        mesh = MmgMesh3D()
        mesh.set_mesh_size(vertices=len(vertices), tetrahedra=len(elements))
        mesh.set_vertices(vertices)
        mesh.set_tetrahedra(elements)

        with pytest.raises(RuntimeError, match="out of range"):
            mesh.unset_corners(np.array([100], dtype=np.int32))

        with pytest.raises(RuntimeError, match="out of range"):
            mesh.unset_required_tetrahedra(np.array([100], dtype=np.int32))


class TestUnsetAttributes2D:
    """Tests for unsetting 2D element attributes."""

    def test_unset_corners(self, square_mesh: tuple[np.ndarray, np.ndarray]) -> None:
        """Test setting then unsetting corners for MmgMesh2D."""
        vertices, triangles = square_mesh

        mesh = MmgMesh2D()
        mesh.set_mesh_size(vertices=len(vertices), triangles=len(triangles))
        mesh.set_vertices(vertices)
        mesh.set_triangles(triangles)

        indices = np.array([0, 1, 2], dtype=np.int32)
        mesh.set_corners(indices)

        for idx in indices:
            is_corner, _ = mesh.get_vertex_flags(idx)
            assert is_corner

        mesh.unset_corners(indices)

        for idx in indices:
            is_corner, _ = mesh.get_vertex_flags(idx)
            assert not is_corner

    def test_unset_required_vertices(
        self,
        square_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test setting then unsetting required vertices for MmgMesh2D."""
        vertices, triangles = square_mesh

        mesh = MmgMesh2D()
        mesh.set_mesh_size(vertices=len(vertices), triangles=len(triangles))
        mesh.set_vertices(vertices)
        mesh.set_triangles(triangles)

        indices = np.array([0, 2], dtype=np.int32)
        mesh.set_required_vertices(indices)

        for idx in indices:
            _, is_required = mesh.get_vertex_flags(idx)
            assert is_required

        mesh.unset_required_vertices(indices)

        for idx in indices:
            _, is_required = mesh.get_vertex_flags(idx)
            assert not is_required

    def test_unset_required_triangles(
        self,
        square_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test setting then unsetting required triangles for MmgMesh2D."""
        vertices, triangles = square_mesh

        mesh = MmgMesh2D()
        mesh.set_mesh_size(vertices=len(vertices), triangles=len(triangles))
        mesh.set_vertices(vertices)
        mesh.set_triangles(triangles)

        indices = np.array([0], dtype=np.int32)
        mesh.set_required_triangles(indices)
        mesh.unset_required_triangles(indices)

    def test_unset_required_edges(
        self,
        square_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test setting then unsetting required edges for MmgMesh2D."""
        vertices, triangles = square_mesh

        edges = np.array([[0, 1], [1, 2], [2, 3], [3, 0]], dtype=np.int32)

        mesh = MmgMesh2D()
        mesh.set_mesh_size(
            vertices=len(vertices),
            triangles=len(triangles),
            edges=len(edges),
        )
        mesh.set_vertices(vertices)
        mesh.set_triangles(triangles)
        mesh.set_edges(edges)

        indices = np.array([0, 1], dtype=np.int32)
        mesh.set_required_edges(indices)
        mesh.unset_required_edges(indices)


class TestUnsetAttributesSurface:
    """Tests for unsetting surface mesh element attributes."""

    def test_unset_corners(
        self,
        tetrahedron_surface_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test setting then unsetting corners for MmgMeshS."""
        vertices, triangles = tetrahedron_surface_mesh

        mesh = MmgMeshS()
        mesh.set_mesh_size(vertices=len(vertices), triangles=len(triangles))
        mesh.set_vertices(vertices)
        mesh.set_triangles(triangles)

        indices = np.array([0, 1, 2], dtype=np.int32)
        mesh.set_corners(indices)

        for idx in indices:
            is_corner, _ = mesh.get_vertex_flags(idx)
            assert is_corner

        mesh.unset_corners(indices)

        for idx in indices:
            is_corner, _ = mesh.get_vertex_flags(idx)
            assert not is_corner

    def test_unset_required_vertices(
        self,
        tetrahedron_surface_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test setting then unsetting required vertices for MmgMeshS."""
        vertices, triangles = tetrahedron_surface_mesh

        mesh = MmgMeshS()
        mesh.set_mesh_size(vertices=len(vertices), triangles=len(triangles))
        mesh.set_vertices(vertices)
        mesh.set_triangles(triangles)

        indices = np.array([0, 2], dtype=np.int32)
        mesh.set_required_vertices(indices)

        for idx in indices:
            _, is_required = mesh.get_vertex_flags(idx)
            assert is_required

        mesh.unset_required_vertices(indices)

        for idx in indices:
            _, is_required = mesh.get_vertex_flags(idx)
            assert not is_required

    def test_unset_required_triangles(
        self,
        tetrahedron_surface_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test setting then unsetting required triangles for MmgMeshS."""
        vertices, triangles = tetrahedron_surface_mesh

        mesh = MmgMeshS()
        mesh.set_mesh_size(vertices=len(vertices), triangles=len(triangles))
        mesh.set_vertices(vertices)
        mesh.set_triangles(triangles)

        indices = np.array([0, 2], dtype=np.int32)
        mesh.set_required_triangles(indices)
        mesh.unset_required_triangles(indices)

    def test_unset_required_edges(
        self,
        tetrahedron_surface_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test setting then unsetting required edges for MmgMeshS."""
        vertices, triangles = tetrahedron_surface_mesh

        edges = np.array([[0, 1], [1, 2], [2, 3], [3, 0]], dtype=np.int32)

        mesh = MmgMeshS()
        mesh.set_mesh_size(
            vertices=len(vertices),
            triangles=len(triangles),
            edges=len(edges),
        )
        mesh.set_vertices(vertices)
        mesh.set_triangles(triangles)
        mesh.set_edges(edges)

        indices = np.array([0, 2], dtype=np.int32)
        mesh.set_required_edges(indices)
        mesh.unset_required_edges(indices)

    def test_unset_ridge_edges(
        self,
        tetrahedron_surface_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test setting then unsetting ridge edges for MmgMeshS."""
        vertices, triangles = tetrahedron_surface_mesh

        edges = np.array([[0, 1], [1, 2], [2, 3], [3, 0]], dtype=np.int32)

        mesh = MmgMeshS()
        mesh.set_mesh_size(
            vertices=len(vertices),
            triangles=len(triangles),
            edges=len(edges),
        )
        mesh.set_vertices(vertices)
        mesh.set_triangles(triangles)
        mesh.set_edges(edges)

        indices = np.array([0, 2], dtype=np.int32)
        mesh.set_ridge_edges(indices)
        mesh.unset_ridge_edges(indices)


class TestLocalParameters3D:
    """Tests for local parameters on MmgMesh3D."""

    def test_set_local_parameters(
        self,
        cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test setting local parameters for MmgMesh3D."""
        vertices, elements = cube_mesh

        triangles = np.array(
            [[0, 1, 3], [1, 2, 3], [4, 5, 7], [5, 6, 7]],
            dtype=np.int32,
        )

        mesh = MmgMesh3D()
        mesh.set_mesh_size(
            vertices=len(vertices),
            tetrahedra=len(elements),
            triangles=len(triangles),
        )
        mesh.set_vertices(vertices)
        mesh.set_tetrahedra(elements)
        mesh.set_triangles(
            triangles,
            refs=np.array([1, 1, 2, 2], dtype=np.int64),
        )

        mesh.set_local_parameters(
            [
                {
                    "type": "triangle",
                    "ref": 1,
                    "hmin": 0.01,
                    "hmax": 0.1,
                    "hausd": 0.01,
                },
                {
                    "type": "triangle",
                    "ref": 2,
                    "hmin": 0.05,
                    "hmax": 0.5,
                    "hausd": 0.05,
                },
            ],
        )

    def test_empty_parameters(
        self,
        cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test that empty parameter list works."""
        vertices, elements = cube_mesh

        mesh = MmgMesh3D()
        mesh.set_mesh_size(vertices=len(vertices), tetrahedra=len(elements))
        mesh.set_vertices(vertices)
        mesh.set_tetrahedra(elements)

        mesh.set_local_parameters([])

    def test_invalid_entity_type(
        self,
        cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test that invalid entity type raises error."""
        vertices, elements = cube_mesh

        mesh = MmgMesh3D()
        mesh.set_mesh_size(vertices=len(vertices), tetrahedra=len(elements))
        mesh.set_vertices(vertices)
        mesh.set_tetrahedra(elements)

        with pytest.raises(RuntimeError, match="Unknown entity type"):
            mesh.set_local_parameters(
                [
                    {
                        "type": "invalid",
                        "ref": 1,
                        "hmin": 0.01,
                        "hmax": 0.1,
                        "hausd": 0.01,
                    },
                ],
            )


class TestLocalParameters2D:
    """Tests for local parameters on MmgMesh2D."""

    def test_set_local_parameters(
        self,
        square_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test setting local parameters for MmgMesh2D."""
        vertices, triangles = square_mesh

        mesh = MmgMesh2D()
        mesh.set_mesh_size(vertices=len(vertices), triangles=len(triangles))
        mesh.set_vertices(vertices)
        mesh.set_triangles(
            triangles,
            refs=np.array([1, 2], dtype=np.int64),
        )

        mesh.set_local_parameters(
            [
                {
                    "type": "triangle",
                    "ref": 1,
                    "hmin": 0.01,
                    "hmax": 0.1,
                    "hausd": 0.01,
                },
            ],
        )


class TestLocalParametersSurface:
    """Tests for local parameters on MmgMeshS."""

    def test_set_local_parameters(
        self,
        tetrahedron_surface_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test setting local parameters for MmgMeshS."""
        vertices, triangles = tetrahedron_surface_mesh

        mesh = MmgMeshS()
        mesh.set_mesh_size(vertices=len(vertices), triangles=len(triangles))
        mesh.set_vertices(vertices)
        mesh.set_triangles(
            triangles,
            refs=np.array([1, 1, 2, 2], dtype=np.int64),
        )

        mesh.set_local_parameters(
            [
                {
                    "type": "triangle",
                    "ref": 1,
                    "hmin": 0.01,
                    "hmax": 0.1,
                    "hausd": 0.01,
                },
                {
                    "type": "triangle",
                    "ref": 2,
                    "hmin": 0.05,
                    "hmax": 0.5,
                    "hausd": 0.05,
                },
            ],
        )
