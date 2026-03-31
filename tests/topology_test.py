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


class TestAdvancedTopology3D:
    """Tests for advanced 3D topology queries."""

    def test_get_tet_from_tria(
        self,
        cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test getting tetrahedron from triangle (requires remesh first)."""
        vertices, elements = cube_mesh

        mesh = MmgMesh3D(vertices, elements)
        mesh.remesh(verbose=False)

        # After remesh, the mesh has boundary triangles
        mesh_size = mesh.get_mesh_size()
        n_triangles = mesh_size[3]
        if n_triangles > 0:
            result = mesh.get_tet_from_tria(0)
            assert isinstance(result, tuple)
            assert len(result) == 2
            tet_idx, face_idx = result
            assert isinstance(tet_idx, int)
            assert isinstance(face_idx, int)

    def test_get_tets_from_tria(
        self,
        cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test getting both tetrahedra from triangle (requires remesh first)."""
        vertices, elements = cube_mesh

        mesh = MmgMesh3D(vertices, elements)
        mesh.remesh(verbose=False)

        mesh_size = mesh.get_mesh_size()
        n_triangles = mesh_size[3]
        if n_triangles > 0:
            result = mesh.get_tets_from_tria(0)
            assert isinstance(result, tuple)
            assert len(result) == 2
            (tet0, face0), (_tet1, _face1) = result
            assert isinstance(tet0, int)
            assert isinstance(face0, int)

    def test_get_non_boundary_triangles(
        self,
        cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test getting non-boundary triangles."""
        vertices, elements = cube_mesh

        mesh = MmgMesh3D()
        mesh.set_mesh_size(vertices=len(vertices), tetrahedra=len(elements))
        mesh.set_vertices(vertices)
        mesh.set_tetrahedra(elements)

        verts, refs = mesh.get_non_boundary_triangles()
        assert verts.ndim == 2
        assert verts.shape[1] == 3
        assert refs.ndim == 1
        assert verts.shape[0] == refs.shape[0]

    def test_invalid_tri_index(
        self,
        cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test that invalid triangle index raises error."""
        vertices, elements = cube_mesh

        triangles = np.array([[0, 1, 3]], dtype=np.int32)

        mesh = MmgMesh3D()
        mesh.set_mesh_size(
            vertices=len(vertices),
            tetrahedra=len(elements),
            triangles=len(triangles),
        )
        mesh.set_vertices(vertices)
        mesh.set_tetrahedra(elements)
        mesh.set_triangles(triangles)

        with pytest.raises(RuntimeError, match="out of range"):
            mesh.get_tet_from_tria(100)

        with pytest.raises(RuntimeError, match="out of range"):
            mesh.get_tets_from_tria(100)


class TestAdvancedTopology2D:
    """Tests for advanced 2D topology queries."""

    def test_get_tri_from_edge(
        self,
        square_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test getting triangle from edge (requires remesh first)."""
        vertices, triangles = square_mesh

        mesh = MmgMesh2D(vertices, triangles)
        mesh.remesh(verbose=False)

        mesh_size = mesh.get_mesh_size()
        n_edges = mesh_size[3]
        if n_edges > 0:
            result = mesh.get_tri_from_edge(0)
            assert isinstance(result, tuple)
            assert len(result) == 2

    def test_get_tris_from_edge(
        self,
        square_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test getting both triangles from edge (requires remesh first)."""
        vertices, triangles = square_mesh

        mesh = MmgMesh2D(vertices, triangles)
        mesh.remesh(verbose=False)

        mesh_size = mesh.get_mesh_size()
        n_edges = mesh_size[3]
        if n_edges > 0:
            result = mesh.get_tris_from_edge(0)
            assert isinstance(result, tuple)
            assert len(result) == 2

    def test_get_non_boundary_edges(
        self,
        square_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test getting non-boundary edges."""
        vertices, triangles = square_mesh

        mesh = MmgMesh2D()
        mesh.set_mesh_size(vertices=len(vertices), triangles=len(triangles))
        mesh.set_vertices(vertices)
        mesh.set_triangles(triangles)

        verts, refs = mesh.get_non_boundary_edges()
        assert verts.ndim == 2
        assert verts.shape[1] == 2
        assert refs.ndim == 1
        assert verts.shape[0] == refs.shape[0]

    def test_invalid_edge_index(
        self,
        square_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test that invalid edge index raises error."""
        vertices, triangles = square_mesh

        edges = np.array([[0, 1]], dtype=np.int32)

        mesh = MmgMesh2D()
        mesh.set_mesh_size(
            vertices=len(vertices),
            triangles=len(triangles),
            edges=len(edges),
        )
        mesh.set_vertices(vertices)
        mesh.set_triangles(triangles)
        mesh.set_edges(edges)

        with pytest.raises(RuntimeError, match="out of range"):
            mesh.get_tri_from_edge(100)


class TestAdvancedTopologySurface:
    """Tests for advanced surface mesh topology queries."""

    def test_get_non_boundary_edges(
        self,
        tetrahedron_surface_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test getting non-boundary edges for surface mesh."""
        vertices, triangles = tetrahedron_surface_mesh

        mesh = MmgMeshS()
        mesh.set_mesh_size(vertices=len(vertices), triangles=len(triangles))
        mesh.set_vertices(vertices)
        mesh.set_triangles(triangles)

        verts, refs = mesh.get_non_boundary_edges()
        assert verts.ndim == 2
        assert verts.shape[1] == 2
        assert refs.ndim == 1
        assert verts.shape[0] == refs.shape[0]
