"""Tests for the MmgMesh2D class."""

from pathlib import Path

import numpy as np
import numpy.testing as npt
import pytest

from mmgpy._mmgpy import MmgMesh2D


class TestConstruction:
    """Tests for MmgMesh2D construction."""

    def test_constructor_with_data(
        self,
        square_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test MmgMesh2D construction."""
        vertices, triangles = square_mesh
        mesh = MmgMesh2D(vertices, triangles)
        npt.assert_array_almost_equal(mesh.get_vertices(), vertices)
        npt.assert_array_equal(mesh.get_triangles(), triangles)

    def test_file_io(
        self,
        square_mesh: tuple[np.ndarray, np.ndarray],
        tmp_path: Path,
    ) -> None:
        """Test MmgMesh2D file I/O."""
        vertices, triangles = square_mesh
        mesh = MmgMesh2D(vertices, triangles)

        mesh_file = tmp_path / "test_2d.mesh"
        mesh.save(mesh_file)

        loaded = MmgMesh2D(mesh_file)
        npt.assert_array_almost_equal(loaded.get_vertices(), vertices)
        npt.assert_array_equal(loaded.get_triangles(), triangles)


class TestMeshSize:
    """Tests for MmgMesh2D mesh size operations."""

    def test_set_mesh_size_and_get_mesh_size(self) -> None:
        """Test MmgMesh2D set_mesh_size and get_mesh_size."""
        mesh = MmgMesh2D()

        expected_vertices = 4
        expected_triangles = 2
        expected_edges = 4
        mesh.set_mesh_size(
            vertices=expected_vertices,
            triangles=expected_triangles,
            edges=expected_edges,
        )

        nv, nt, nquad, ne = mesh.get_mesh_size()
        assert nv == expected_vertices
        assert nt == expected_triangles
        assert nquad == 0
        assert ne == expected_edges


class TestBulkOperations:
    """Tests for MmgMesh2D bulk set/get operations."""

    def test_bulk_operations(self, square_mesh: tuple[np.ndarray, np.ndarray]) -> None:
        """Test MmgMesh2D bulk set/get operations."""
        vertices, triangles = square_mesh

        edges = np.array(
            [
                [0, 1],  # bottom
                [1, 2],  # right
                [2, 3],  # top
                [3, 0],  # left
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

        npt.assert_array_almost_equal(mesh.get_vertices(), vertices)
        npt.assert_array_equal(mesh.get_triangles(), triangles)
        npt.assert_array_equal(mesh.get_edges(), edges)

    def test_with_refs(self, square_mesh: tuple[np.ndarray, np.ndarray]) -> None:
        """Test MmgMesh2D with reference IDs."""
        vertices, triangles = square_mesh
        vertex_refs = np.array([1, 2, 3, 4], dtype=np.int64)
        tri_refs = np.array([10, 20], dtype=np.int64)

        mesh = MmgMesh2D()
        mesh.set_mesh_size(vertices=len(vertices), triangles=len(triangles))
        mesh.set_vertices(vertices, refs=vertex_refs)
        mesh.set_triangles(triangles, refs=tri_refs)

        verts_out, refs_out = mesh.get_vertices_with_refs()
        npt.assert_array_almost_equal(verts_out, vertices)
        npt.assert_array_equal(refs_out, vertex_refs)

        tris_out, refs_out = mesh.get_triangles_with_refs()
        npt.assert_array_equal(tris_out, triangles)
        npt.assert_array_equal(refs_out, tri_refs)


class TestSingleElementOperations:
    """Tests for MmgMesh2D single element setters/getters."""

    def test_single_element_operations(self) -> None:
        """Test MmgMesh2D single element setters/getters."""
        mesh = MmgMesh2D()
        mesh.set_mesh_size(vertices=3, triangles=1, edges=1)

        vertex_ref = 1
        mesh.set_vertex(0.0, 0.0, ref=vertex_ref, idx=0)
        mesh.set_vertex(1.0, 0.0, ref=vertex_ref, idx=1)
        mesh.set_vertex(0.5, 1.0, ref=vertex_ref, idx=2)

        tri_ref = 10
        mesh.set_triangle(0, 1, 2, ref=tri_ref, idx=0)

        edge_ref = 100
        mesh.set_edge(0, 1, ref=edge_ref, idx=0)

        x, y, ref = mesh.get_vertex(0)
        assert (x, y) == (0.0, 0.0)
        assert ref == vertex_ref

        v0, v1, v2, ref = mesh.get_triangle(0)
        assert (v0, v1, v2) == (0, 1, 2)
        assert ref == tri_ref

        v0, v1, ref = mesh.get_edge(0)
        assert (v0, v1) == (0, 1)
        assert ref == edge_ref


class TestSolutionFields:
    """Tests for MmgMesh2D solution fields."""

    def test_displacement_field(
        self,
        square_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test setting and getting displacement field for MmgMesh2D."""
        vertices, triangles = square_mesh
        mesh = MmgMesh2D(vertices, triangles)

        n_vertices = vertices.shape[0]
        rng = np.random.default_rng(42)
        displacement = rng.random((n_vertices, 2)).astype(np.float64) * 0.1

        mesh["displacement"] = displacement
        retrieved = mesh["displacement"]

        npt.assert_array_almost_equal(retrieved, displacement)


class TestRemeshing:
    """Tests for MmgMesh2D in-memory remeshing."""

    def test_remesh(self, square_mesh: tuple[np.ndarray, np.ndarray]) -> None:
        """Test in-memory remeshing for MmgMesh2D."""
        vertices, triangles = square_mesh
        mesh = MmgMesh2D(vertices, triangles)

        mesh.remesh(hmax=0.3, verbose=False)

        output_vertices = mesh.get_vertices()
        output_triangles = mesh.get_triangles()

        assert output_vertices.shape[0] > 0, "Mesh should have vertices after remeshing"
        assert output_vertices.shape[1] == 2, "Vertices should be 2D"
        assert output_triangles.shape[0] > 0, (
            "Mesh should have triangles after remeshing"
        )
        assert output_triangles.shape[1] == 3, "Triangles should have 3 vertices"


class TestLagrangianRemeshing:
    """Tests for MmgMesh2D Lagrangian motion remeshing.

    Note: Lagrangian motion requires the optional ELAS library.
    The feature is disabled by default (USE_ELAS=OFF in CMake).
    Tests are skipped if the feature is not available.
    """

    @staticmethod
    def _lagrangian_available(square_mesh: tuple[np.ndarray, np.ndarray]) -> bool:
        """Check if Lagrangian motion is available for 2D meshes."""
        try:
            vertices, triangles = square_mesh
            mesh = MmgMesh2D(vertices, triangles)
            displacement = np.zeros((vertices.shape[0], 2), dtype=np.float64)
            mesh.remesh_lagrangian(displacement, verbose=False)
        except RuntimeError as e:
            if "lagrangian motion" in str(e).lower() or "lag" in str(e).lower():
                return False
            raise
        else:
            return True

    def test_remesh_lagrangian(
        self,
        square_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test Lagrangian motion remeshing for MmgMesh2D."""
        if not self._lagrangian_available(square_mesh):
            pytest.skip("Lagrangian motion requires USE_ELAS=ON at build time")

        vertices, triangles = square_mesh
        mesh = MmgMesh2D(vertices, triangles)

        n_vertices = vertices.shape[0]
        displacement = np.zeros((n_vertices, 2), dtype=np.float64)
        displacement[:, 0] = 0.05

        mesh.remesh_lagrangian(displacement, verbose=False)

        output_vertices = mesh.get_vertices()
        output_triangles = mesh.get_triangles()

        assert output_vertices.shape[0] > 0, "Should have vertices after remeshing"
        assert output_vertices.shape[1] == 2, "Vertices should be 2D"
        assert output_triangles.shape[0] > 0, "Should have triangles after remeshing"
        assert output_triangles.shape[1] == 3, "Triangles should have 3 vertices"
