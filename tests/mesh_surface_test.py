"""Tests for the MmgMeshS class (surface meshes)."""

from pathlib import Path

import numpy as np
import numpy.testing as npt

from mmgpy._mmgpy import MmgMeshS


class TestConstruction:
    """Tests for MmgMeshS construction."""

    def test_constructor_with_data(
        self,
        tetrahedron_surface_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test MmgMeshS construction."""
        vertices, triangles = tetrahedron_surface_mesh
        mesh = MmgMeshS(vertices, triangles)
        npt.assert_array_almost_equal(mesh.get_vertices(), vertices)
        npt.assert_array_equal(mesh.get_triangles(), triangles)

    def test_file_io(
        self,
        tetrahedron_surface_mesh: tuple[np.ndarray, np.ndarray],
        tmp_path: Path,
    ) -> None:
        """Test MmgMeshS file I/O."""
        vertices, triangles = tetrahedron_surface_mesh
        mesh = MmgMeshS(vertices, triangles)

        mesh_file = tmp_path / "test_s.mesh"
        mesh.save(mesh_file)

        loaded = MmgMeshS(mesh_file)
        npt.assert_array_almost_equal(loaded.get_vertices(), vertices)
        npt.assert_array_equal(loaded.get_triangles(), triangles)


class TestMeshSize:
    """Tests for MmgMeshS mesh size operations."""

    def test_set_mesh_size_and_get_mesh_size(self) -> None:
        """Test MmgMeshS set_mesh_size and get_mesh_size."""
        mesh = MmgMeshS()

        expected_vertices = 4
        expected_triangles = 4
        expected_edges = 6
        mesh.set_mesh_size(
            vertices=expected_vertices,
            triangles=expected_triangles,
            edges=expected_edges,
        )

        nv, nt, ne = mesh.get_mesh_size()
        assert nv == expected_vertices
        assert nt == expected_triangles
        assert ne == expected_edges


class TestBulkOperations:
    """Tests for MmgMeshS bulk set/get operations."""

    def test_bulk_operations(
        self,
        tetrahedron_surface_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test MmgMeshS bulk set/get operations."""
        vertices, triangles = tetrahedron_surface_mesh

        edges = np.array(
            [
                [0, 1],
                [1, 2],
                [2, 0],
                [0, 3],
                [1, 3],
                [2, 3],
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

        npt.assert_array_almost_equal(mesh.get_vertices(), vertices)
        npt.assert_array_equal(mesh.get_triangles(), triangles)
        npt.assert_array_equal(mesh.get_edges(), edges)

    def test_with_refs(
        self,
        tetrahedron_surface_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test MmgMeshS with reference IDs."""
        vertices, triangles = tetrahedron_surface_mesh
        vertex_refs = np.array([1, 2, 3, 4], dtype=np.int64)
        tri_refs = np.array([10, 20, 30, 40], dtype=np.int64)

        mesh = MmgMeshS()
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
    """Tests for MmgMeshS single element setters/getters."""

    def test_single_element_operations(self) -> None:
        """Test MmgMeshS single element setters/getters."""
        mesh = MmgMeshS()
        mesh.set_mesh_size(vertices=3, triangles=1, edges=1)

        vertex_ref = 1
        mesh.set_vertex(0.0, 0.0, 0.0, ref=vertex_ref, idx=0)
        mesh.set_vertex(1.0, 0.0, 0.0, ref=vertex_ref, idx=1)
        mesh.set_vertex(0.5, 1.0, 0.5, ref=vertex_ref, idx=2)

        tri_ref = 10
        mesh.set_triangle(0, 1, 2, ref=tri_ref, idx=0)

        edge_ref = 100
        mesh.set_edge(0, 1, ref=edge_ref, idx=0)

        x, y, z, ref = mesh.get_vertex(0)
        assert (x, y, z) == (0.0, 0.0, 0.0)
        assert ref == vertex_ref

        v0, v1, v2, ref = mesh.get_triangle(0)
        assert (v0, v1, v2) == (0, 1, 2)
        assert ref == tri_ref

        v0, v1, ref = mesh.get_edge(0)
        assert (v0, v1) == (0, 1)
        assert ref == edge_ref


class TestRemeshing:
    """Tests for MmgMeshS in-memory remeshing."""

    def test_remesh(
        self,
        tetrahedron_surface_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test in-memory remeshing for MmgMeshS."""
        vertices, triangles = tetrahedron_surface_mesh
        mesh = MmgMeshS(vertices, triangles)

        mesh.remesh(hmax=0.5, verbose=False)

        output_vertices = mesh.get_vertices()
        output_triangles = mesh.get_triangles()

        assert output_vertices.shape[0] > 0, "Mesh should have vertices after remeshing"
        assert output_vertices.shape[1] == 3, "Vertices should be 3D"
        assert output_triangles.shape[0] > 0, (
            "Mesh should have triangles after remeshing"
        )
        assert output_triangles.shape[1] == 3, "Triangles should have 3 vertices"
