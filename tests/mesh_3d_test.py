"""Tests for the MmgMesh3D class."""

from pathlib import Path

import numpy as np
import numpy.testing as npt
import pytest

from mmgpy._mmgpy import MmgMesh3D


class TestConstruction:
    """Tests for MmgMesh3D construction."""

    def test_empty_constructor(self, cube_mesh: tuple[np.ndarray, np.ndarray]) -> None:
        """Test empty constructor and setter."""
        vertices, elements = cube_mesh
        mesh = MmgMesh3D()
        mesh.set_vertices_and_elements(vertices, elements)
        npt.assert_array_almost_equal(mesh.get_vertices(), vertices)
        npt.assert_array_equal(mesh.get_elements(), elements)

    def test_constructor_with_data(
        self,
        cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test constructor with data."""
        vertices, elements = cube_mesh
        mesh = MmgMesh3D(vertices, elements)
        npt.assert_array_almost_equal(mesh.get_vertices(), vertices)
        npt.assert_array_equal(mesh.get_elements(), elements)

    def test_load_mesh(
        self,
        cube_mesh: tuple[np.ndarray, np.ndarray],
        tmp_path: Path,
    ) -> None:
        """Test loading a mesh from file."""
        vertices, elements = cube_mesh
        mesh = MmgMesh3D(vertices, elements)
        mesh_file = tmp_path / "test_mesh.mesh"
        mesh.save(mesh_file)

        loaded = MmgMesh3D(mesh_file)
        npt.assert_array_almost_equal(loaded.get_vertices(), vertices)
        npt.assert_array_equal(loaded.get_elements(), elements)

    def test_load_nonexistent_file_no_crash(self, tmp_path: Path) -> None:
        """Test that loading a non-existent file raises and doesn't cause memory issues.

        This tests the cleanup() path in the constructor: when file loading fails,
        cleanup() is called before throwing. Previously, cleanup() didn't null
        pointers after freeing, which could cause double-free issues.
        """
        nonexistent_file = tmp_path / "does_not_exist.mesh"
        for _ in range(10):
            with pytest.raises(RuntimeError, match="Failed to load mesh"):
                MmgMesh3D(nonexistent_file)


class TestMeshSize:
    """Tests for mesh size operations."""

    def test_set_mesh_size_and_get_mesh_size(self) -> None:
        """Test set_mesh_size and get_mesh_size methods."""
        mesh = MmgMesh3D()
        expected_vertices = 8
        expected_tetrahedra = 5
        mesh.set_mesh_size(vertices=expected_vertices, tetrahedra=expected_tetrahedra)

        np_v, ne, nprism, nt, nquad, na = mesh.get_mesh_size()
        assert np_v == expected_vertices
        assert ne == expected_tetrahedra
        assert nprism == 0
        assert nt == 0
        assert nquad == 0
        assert na == 0


class TestBulkOperations:
    """Tests for bulk set/get operations."""

    def test_set_vertices_bulk(self, cube_mesh: tuple[np.ndarray, np.ndarray]) -> None:
        """Test bulk vertex setting."""
        vertices, elements = cube_mesh
        mesh = MmgMesh3D()
        mesh.set_mesh_size(vertices=len(vertices), tetrahedra=len(elements))
        mesh.set_vertices(vertices)
        mesh.set_tetrahedra(elements)
        npt.assert_array_almost_equal(mesh.get_vertices(), vertices)

    def test_set_vertices_with_refs(
        self,
        cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test bulk vertex setting with reference IDs."""
        vertices, elements = cube_mesh
        refs = np.array([1, 2, 3, 4, 5, 6, 7, 8], dtype=np.int64)

        mesh = MmgMesh3D()
        mesh.set_mesh_size(vertices=len(vertices), tetrahedra=len(elements))
        mesh.set_vertices(vertices, refs=refs)
        mesh.set_tetrahedra(elements)

        verts_out, refs_out = mesh.get_vertices_with_refs()
        npt.assert_array_almost_equal(verts_out, vertices)
        npt.assert_array_equal(refs_out, refs)

    def test_set_tetrahedra_bulk(
        self,
        cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test bulk tetrahedra setting."""
        vertices, elements = cube_mesh
        mesh = MmgMesh3D()
        mesh.set_mesh_size(vertices=len(vertices), tetrahedra=len(elements))
        mesh.set_vertices(vertices)
        mesh.set_tetrahedra(elements)
        npt.assert_array_equal(mesh.get_elements(), elements)

    def test_set_tetrahedra_with_refs(
        self,
        cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test bulk tetrahedra setting with reference IDs (material IDs)."""
        vertices, elements = cube_mesh
        elem_refs = np.array([10, 20, 30, 40, 50], dtype=np.int64)

        mesh = MmgMesh3D()
        mesh.set_mesh_size(vertices=len(vertices), tetrahedra=len(elements))
        mesh.set_vertices(vertices)
        mesh.set_tetrahedra(elements, refs=elem_refs)

        elems_out, refs_out = mesh.get_elements_with_refs()
        npt.assert_array_equal(elems_out, elements)
        npt.assert_array_equal(refs_out, elem_refs)

    def test_set_triangles(self, cube_mesh: tuple[np.ndarray, np.ndarray]) -> None:
        """Test bulk triangle setting for boundary faces."""
        vertices, elements = cube_mesh
        triangles = np.array(
            [
                [0, 1, 3],  # bottom face triangle 1
                [1, 2, 3],  # bottom face triangle 2
                [4, 5, 7],  # top face triangle 1
                [5, 6, 7],  # top face triangle 2
            ],
            dtype=np.int32,
        )
        tri_refs = np.array([1, 1, 2, 2], dtype=np.int64)

        mesh = MmgMesh3D()
        mesh.set_mesh_size(
            vertices=len(vertices),
            tetrahedra=len(elements),
            triangles=len(triangles),
        )
        mesh.set_vertices(vertices)
        mesh.set_tetrahedra(elements)
        mesh.set_triangles(triangles, refs=tri_refs)

        tris_out = mesh.get_triangles()
        npt.assert_array_equal(tris_out, triangles)

        tris_out, refs_out = mesh.get_triangles_with_refs()
        npt.assert_array_equal(tris_out, triangles)
        npt.assert_array_equal(refs_out, tri_refs)

    def test_set_edges(self, cube_mesh: tuple[np.ndarray, np.ndarray]) -> None:
        """Test bulk edge setting for ridge edges."""
        vertices, elements = cube_mesh
        edges = np.array(
            [
                [0, 1],  # bottom edge
                [1, 2],  # bottom edge
                [4, 5],  # top edge
                [5, 6],  # top edge
            ],
            dtype=np.int32,
        )
        edge_refs = np.array([100, 100, 200, 200], dtype=np.int64)

        mesh = MmgMesh3D()
        mesh.set_mesh_size(
            vertices=len(vertices),
            tetrahedra=len(elements),
            edges=len(edges),
        )
        mesh.set_vertices(vertices)
        mesh.set_tetrahedra(elements)
        mesh.set_edges(edges, refs=edge_refs)

        edges_out = mesh.get_edges()
        npt.assert_array_equal(edges_out, edges)

        edges_out, refs_out = mesh.get_edges_with_refs()
        npt.assert_array_equal(edges_out, edges)
        npt.assert_array_equal(refs_out, edge_refs)

    def test_get_tetrahedra_alias(
        self,
        cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test that get_tetrahedra() works as an alias for get_elements()."""
        vertices, elements = cube_mesh
        mesh = MmgMesh3D(vertices, elements)
        npt.assert_array_equal(mesh.get_tetrahedra(), mesh.get_elements())

        elem_refs = np.array([1, 2, 3, 4, 5], dtype=np.int64)
        mesh2 = MmgMesh3D()
        mesh2.set_mesh_size(vertices=len(vertices), tetrahedra=len(elements))
        mesh2.set_vertices(vertices)
        mesh2.set_tetrahedra(elements, refs=elem_refs)

        elems1, refs1 = mesh2.get_elements_with_refs()
        elems2, refs2 = mesh2.get_tetrahedra_with_refs()
        npt.assert_array_equal(elems1, elems2)
        npt.assert_array_equal(refs1, refs2)


class TestSingleElementOperations:
    """Tests for single element setters/getters."""

    def test_set_vertex_single(self) -> None:
        """Test setting a single vertex."""
        mesh = MmgMesh3D()
        mesh.set_mesh_size(vertices=3, tetrahedra=0)

        vertex_refs = [1, 2, 3]
        mesh.set_vertex(0.0, 0.0, 0.0, ref=vertex_refs[0], idx=0)
        mesh.set_vertex(1.0, 0.0, 0.0, ref=vertex_refs[1], idx=1)
        mesh.set_vertex(0.5, 1.0, 0.0, ref=vertex_refs[2], idx=2)

        x, y, z, ref = mesh.get_vertex(0)
        assert (x, y, z) == (0.0, 0.0, 0.0)
        assert ref == vertex_refs[0]

        x, y, z, ref = mesh.get_vertex(1)
        assert (x, y, z) == (1.0, 0.0, 0.0)
        assert ref == vertex_refs[1]

        x, y, z, ref = mesh.get_vertex(2)
        assert (x, y, z) == (0.5, 1.0, 0.0)
        assert ref == vertex_refs[2]

    def test_set_tetrahedron_single(
        self,
        cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test setting a single tetrahedron."""
        vertices, _ = cube_mesh
        mesh = MmgMesh3D()
        mesh.set_mesh_size(vertices=len(vertices), tetrahedra=1)
        mesh.set_vertices(vertices)

        tet_ref = 100
        mesh.set_tetrahedron(0, 1, 3, 4, ref=tet_ref, idx=0)

        v0, v1, v2, v3, ref = mesh.get_tetrahedron(0)
        assert (v0, v1, v2, v3) == (0, 1, 3, 4)
        assert ref == tet_ref

    def test_set_triangle_single(
        self,
        cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test setting a single triangle."""
        vertices, elements = cube_mesh
        mesh = MmgMesh3D()
        mesh.set_mesh_size(
            vertices=len(vertices),
            tetrahedra=len(elements),
            triangles=1,
        )
        mesh.set_vertices(vertices)
        mesh.set_tetrahedra(elements)

        tri_ref = 50
        mesh.set_triangle(0, 1, 2, ref=tri_ref, idx=0)

        v0, v1, v2, ref = mesh.get_triangle(0)
        assert (v0, v1, v2) == (0, 1, 2)
        assert ref == tri_ref

    def test_set_edge_single(self, cube_mesh: tuple[np.ndarray, np.ndarray]) -> None:
        """Test setting a single edge."""
        vertices, elements = cube_mesh
        mesh = MmgMesh3D()
        mesh.set_mesh_size(vertices=len(vertices), tetrahedra=len(elements), edges=1)
        mesh.set_vertices(vertices)
        mesh.set_tetrahedra(elements)

        edge_ref = 25
        mesh.set_edge(0, 1, ref=edge_ref, idx=0)

        v0, v1, ref = mesh.get_edge(0)
        assert (v0, v1) == (0, 1)
        assert ref == edge_ref

    def test_single_element_mixed_construction(self) -> None:
        """Test building a mesh using a mix of single and bulk operations."""
        expected_vertices = 4
        expected_tetrahedra = 1
        expected_triangles = 4

        tet_ref = 100
        tri_refs = [10, 20, 30, 40]

        mesh = MmgMesh3D()
        mesh.set_mesh_size(
            vertices=expected_vertices,
            tetrahedra=expected_tetrahedra,
            triangles=expected_triangles,
        )

        mesh.set_vertex(0.0, 0.0, 0.0, ref=1, idx=0)
        mesh.set_vertex(1.0, 0.0, 0.0, ref=2, idx=1)
        mesh.set_vertex(0.5, 1.0, 0.0, ref=3, idx=2)
        mesh.set_vertex(0.5, 0.5, 1.0, ref=4, idx=3)

        mesh.set_tetrahedron(0, 1, 2, 3, ref=tet_ref, idx=0)

        mesh.set_triangle(0, 1, 2, ref=tri_refs[0], idx=0)
        mesh.set_triangle(0, 1, 3, ref=tri_refs[1], idx=1)
        mesh.set_triangle(1, 2, 3, ref=tri_refs[2], idx=2)
        mesh.set_triangle(0, 2, 3, ref=tri_refs[3], idx=3)

        np_v, ne, _, nt, _, _ = mesh.get_mesh_size()
        assert np_v == expected_vertices
        assert ne == expected_tetrahedra
        assert nt == expected_triangles

        _, _, _, _, ref = mesh.get_tetrahedron(0)
        assert ref == tet_ref

        _, _, _, ref = mesh.get_triangle(0)
        assert ref == tri_refs[0]
        _, _, _, ref = mesh.get_triangle(3)
        assert ref == tri_refs[3]


class TestProgrammaticConstruction:
    """Tests for complete programmatic mesh construction workflow."""

    def test_programmatic_mesh_construction(
        self,
        single_tetrahedron: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test complete programmatic mesh construction (Issue #50 use case)."""
        vertices, tetrahedra = single_tetrahedron
        triangles = np.array(
            [
                [0, 1, 2],  # bottom
                [0, 1, 3],  # front
                [1, 2, 3],  # right
                [0, 2, 3],  # left
            ],
            dtype=np.int32,
        )

        mesh = MmgMesh3D()
        mesh.set_mesh_size(
            vertices=len(vertices),
            tetrahedra=len(tetrahedra),
            triangles=len(triangles),
        )
        mesh.set_vertices(vertices)
        mesh.set_tetrahedra(tetrahedra)
        mesh.set_triangles(triangles)

        np_v, ne, _nprism, nt, _nquad, _na = mesh.get_mesh_size()
        assert np_v == len(vertices)
        assert ne == len(tetrahedra)
        assert nt == len(triangles)

        npt.assert_array_almost_equal(mesh.get_vertices(), vertices)
        npt.assert_array_equal(mesh.get_elements(), tetrahedra)
        npt.assert_array_equal(mesh.get_triangles(), triangles)


class TestPrismOperations:
    """Tests for prism operations."""

    def test_set_prism_single(self, prism_mesh: tuple[np.ndarray, np.ndarray]) -> None:
        """Test setting a single prism."""
        vertices, _ = prism_mesh

        mesh = MmgMesh3D()
        mesh.set_mesh_size(vertices=len(vertices), prisms=1)
        mesh.set_vertices(vertices)

        prism_ref = 42
        mesh.set_prism(0, 1, 2, 3, 4, 5, ref=prism_ref, idx=0)

        v0, v1, v2, v3, v4, v5, ref = mesh.get_prism(0)
        assert (v0, v1, v2, v3, v4, v5) == (0, 1, 2, 3, 4, 5)
        assert ref == prism_ref

    def test_set_prisms_bulk(
        self,
        stacked_prisms: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test bulk prism setting."""
        vertices, prisms = stacked_prisms
        prism_refs = np.array([10, 20], dtype=np.int64)

        mesh = MmgMesh3D()
        mesh.set_mesh_size(vertices=len(vertices), prisms=len(prisms))
        mesh.set_vertices(vertices)
        mesh.set_prisms(prisms, refs=prism_refs)

        prisms_out = mesh.get_prisms()
        npt.assert_array_equal(prisms_out, prisms)

        prisms_out, refs_out = mesh.get_prisms_with_refs()
        npt.assert_array_equal(prisms_out, prisms)
        npt.assert_array_equal(refs_out, prism_refs)


class TestQuadrilateralOperations:
    """Tests for quadrilateral operations."""

    def test_set_quadrilateral_single(
        self,
        cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test setting a single quadrilateral."""
        vertices, elements = cube_mesh

        mesh = MmgMesh3D()
        mesh.set_mesh_size(
            vertices=len(vertices),
            tetrahedra=len(elements),
            quadrilaterals=1,
        )
        mesh.set_vertices(vertices)
        mesh.set_tetrahedra(elements)

        quad_ref = 77
        mesh.set_quadrilateral(0, 1, 2, 3, ref=quad_ref, idx=0)

        v0, v1, v2, v3, ref = mesh.get_quadrilateral(0)
        assert (v0, v1, v2, v3) == (0, 1, 2, 3)
        assert ref == quad_ref

    def test_set_quadrilaterals_bulk(
        self,
        cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test bulk quadrilateral setting."""
        vertices, elements = cube_mesh

        quads = np.array(
            [
                [0, 1, 2, 3],  # bottom face
                [4, 5, 6, 7],  # top face
            ],
            dtype=np.int32,
        )
        quad_refs = np.array([100, 200], dtype=np.int64)

        mesh = MmgMesh3D()
        mesh.set_mesh_size(
            vertices=len(vertices),
            tetrahedra=len(elements),
            quadrilaterals=len(quads),
        )
        mesh.set_vertices(vertices)
        mesh.set_tetrahedra(elements)
        mesh.set_quadrilaterals(quads, refs=quad_refs)

        quads_out = mesh.get_quadrilaterals()
        npt.assert_array_equal(quads_out, quads)

        quads_out, refs_out = mesh.get_quadrilaterals_with_refs()
        npt.assert_array_equal(quads_out, quads)
        npt.assert_array_equal(refs_out, quad_refs)


class TestSolutionFields:
    """Tests for solution fields (metric, displacement, tensor)."""

    def test_scalar_field(self, cube_mesh: tuple[np.ndarray, np.ndarray]) -> None:
        """Test scalar field (one value per vertex)."""
        vertices, elements = cube_mesh
        mesh = MmgMesh3D(vertices, elements)

        metric = np.array(
            [
                [0.1],
                [0.2],
                [0.15],
                [0.1],
                [0.2],
                [0.15],
                [0.1],
                [0.2],
            ],
            dtype=np.float64,
        )
        mesh["metric"] = metric
        npt.assert_array_almost_equal(mesh["metric"], metric)

    def test_vector_field(self, cube_mesh: tuple[np.ndarray, np.ndarray]) -> None:
        """Test vector field (3D displacement per vertex)."""
        vertices, elements = cube_mesh
        mesh = MmgMesh3D(vertices, elements)

        displacement = np.array(
            [
                [0.1, 0.0, 0.0],
                [0.0, 0.1, 0.0],
                [0.0, 0.0, 0.1],
                [0.1, 0.1, 0.1],
                [0.1, 0.0, 0.1],
                [0.0, 0.1, 0.1],
                [0.1, 0.1, 0.0],
                [0.0, 0.0, 0.2],
            ],
            dtype=np.float64,
        )
        mesh["displacement"] = displacement
        npt.assert_array_almost_equal(mesh["displacement"], displacement)

    def test_tensor_field(self, cube_mesh: tuple[np.ndarray, np.ndarray]) -> None:
        """Test tensor field (symmetric 3x3 matrix, 6 components per vertex)."""
        vertices, elements = cube_mesh
        mesh = MmgMesh3D(vertices, elements)

        tensor = np.array(
            [
                [1.0, 0.0, 0.0, 1.0, 0.0, 1.0],  # xx, xy, xz, yy, yz, zz
                [1.0, 0.1, 0.0, 1.0, 0.0, 1.0],
                [1.0, 0.0, 0.1, 1.0, 0.1, 1.0],
                [1.0, 0.1, 0.1, 1.0, 0.1, 1.0],
                [1.1, 0.0, 0.0, 1.1, 0.0, 1.1],
                [1.1, 0.1, 0.0, 1.1, 0.0, 1.1],
                [1.1, 0.0, 0.1, 1.1, 0.1, 1.1],
                [1.1, 0.1, 0.1, 1.1, 0.1, 1.1],
            ],
            dtype=np.float64,
        )
        mesh["tensor"] = tensor
        npt.assert_array_almost_equal(mesh["tensor"], tensor)


class TestRemeshing:
    """Tests for in-memory remeshing."""

    def test_remesh(self, cube_mesh: tuple[np.ndarray, np.ndarray]) -> None:
        """Test in-memory remeshing for MmgMesh3D."""
        vertices, elements = cube_mesh
        mesh = MmgMesh3D(vertices, elements)

        mesh.remesh(hmax=0.5, verbose=False)

        output_vertices = mesh.get_vertices()
        output_elements = mesh.get_elements()

        assert output_vertices.shape[0] > 0, "Mesh should have vertices after remeshing"
        assert output_vertices.shape[1] == 3, "Vertices should be 3D"
        assert output_elements.shape[0] > 0, "Mesh should have elements after remeshing"
        assert output_elements.shape[1] == 4, "Elements should be tetrahedra"
        assert not np.isnan(output_vertices).any(), "Vertices should not contain NaN"

    def test_remesh_with_metric(self, cube_mesh: tuple[np.ndarray, np.ndarray]) -> None:
        """Test in-memory remeshing with a metric field."""
        vertices, elements = cube_mesh
        mesh = MmgMesh3D(vertices, elements)

        metric = np.ones((len(vertices), 1), dtype=np.float64) * 0.3
        mesh["metric"] = metric

        mesh.remesh(verbose=False)

        output_vertices = mesh.get_vertices()
        output_elements = mesh.get_elements()

        assert output_vertices.shape[0] > 0
        assert output_elements.shape[0] > 0

    def test_remesh_no_options(self, cube_mesh: tuple[np.ndarray, np.ndarray]) -> None:
        """Test remeshing with default options."""
        vertices, elements = cube_mesh
        mesh = MmgMesh3D(vertices, elements)

        mesh.remesh(verbose=False)

        assert mesh.get_vertices().shape[0] > 0
        assert mesh.get_elements().shape[0] > 0

    def test_remesh_verbose_int(self, cube_mesh: tuple[np.ndarray, np.ndarray]) -> None:
        """Test that verbose accepts both bool and int."""
        vertices, elements = cube_mesh
        mesh = MmgMesh3D(vertices, elements)

        mesh.remesh(hmax=0.5, verbose=-1)

        assert mesh.get_vertices().shape[0] > 0
        assert mesh.get_elements().shape[0] > 0


class TestLagrangianRemeshing:
    """Tests for Lagrangian motion remeshing.

    Note: Lagrangian motion requires the optional ELAS library.
    The feature is disabled by default (USE_ELAS=OFF in CMake).
    Tests are skipped if the feature is not available.
    """

    @staticmethod
    def _lagrangian_available(cube_mesh: tuple[np.ndarray, np.ndarray]) -> bool:
        """Check if Lagrangian motion is available for 3D meshes."""
        try:
            vertices, elements = cube_mesh
            mesh = MmgMesh3D(vertices, elements)
            displacement = np.zeros((vertices.shape[0], 3), dtype=np.float64)
            mesh.remesh_lagrangian(displacement, verbose=False)
        except RuntimeError as e:
            if "lagrangian motion" in str(e).lower() or "lag" in str(e).lower():
                return False
            raise
        else:
            return True

    def test_remesh_lagrangian(self, cube_mesh: tuple[np.ndarray, np.ndarray]) -> None:
        """Test Lagrangian motion remeshing for MmgMesh3D."""
        if not self._lagrangian_available(cube_mesh):
            pytest.skip("Lagrangian motion requires USE_ELAS=ON at build time")

        vertices, elements = cube_mesh
        mesh = MmgMesh3D(vertices, elements)

        n_vertices = vertices.shape[0]
        displacement = np.zeros((n_vertices, 3), dtype=np.float64)
        displacement[:, 0] = 0.1

        mesh.remesh_lagrangian(displacement, verbose=False)

        output_vertices = mesh.get_vertices()
        output_elements = mesh.get_elements()

        assert output_vertices.shape[0] > 0, "Should have vertices after remeshing"
        assert output_vertices.shape[1] == 3, "Vertices should be 3D"
        assert output_elements.shape[0] > 0, "Should have elements after remeshing"
        assert output_elements.shape[1] == 4, "Elements should be tetrahedra"

    def test_remesh_lagrangian_with_options(
        self,
        cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test Lagrangian motion remeshing with additional options."""
        if not self._lagrangian_available(cube_mesh):
            pytest.skip("Lagrangian motion requires USE_ELAS=ON at build time")

        vertices, elements = cube_mesh
        mesh = MmgMesh3D(vertices, elements)

        n_vertices = vertices.shape[0]
        displacement = np.zeros((n_vertices, 3), dtype=np.float64)
        displacement[:, 1] = 0.05

        mesh.remesh_lagrangian(displacement, hmax=0.3, verbose=False)

        output_vertices = mesh.get_vertices()
        assert output_vertices.shape[0] > 0
