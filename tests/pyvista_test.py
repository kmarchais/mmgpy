"""Tests for PyVista integration."""

import numpy as np
import pytest
import pyvista as pv

from mmgpy import from_pyvista, to_pyvista
from mmgpy._mmgpy import MmgMesh2D, MmgMesh3D, MmgMeshS

# Test fixtures


@pytest.fixture
def tetra_grid() -> pv.UnstructuredGrid:
    """Create a simple tetrahedral UnstructuredGrid."""
    vertices = np.array(
        [
            [0.0, 0.0, 0.0],
            [1.0, 0.0, 0.0],
            [0.5, 1.0, 0.0],
            [0.5, 0.5, 1.0],
            [1.0, 1.0, 0.0],
            [1.0, 0.5, 1.0],
        ],
        dtype=np.float64,
    )
    cells = np.array([[0, 1, 2, 3], [1, 4, 2, 5]], dtype=np.int32)
    return pv.UnstructuredGrid({pv.CellType.TETRA: cells}, vertices)


@pytest.fixture
def triangle_polydata_2d() -> pv.PolyData:
    """Create a simple 2D triangular PolyData (z=0)."""
    vertices = np.array(
        [
            [0.0, 0.0, 0.0],
            [1.0, 0.0, 0.0],
            [1.0, 1.0, 0.0],
            [0.0, 1.0, 0.0],
        ],
        dtype=np.float64,
    )
    faces = np.array([3, 0, 1, 2, 3, 0, 2, 3])
    return pv.PolyData(vertices, faces=faces)


@pytest.fixture
def triangle_polydata_3d() -> pv.PolyData:
    """Create a simple 3D surface triangular PolyData."""
    vertices = np.array(
        [
            [0.0, 0.0, 0.0],
            [1.0, 0.0, 0.0],
            [0.5, 1.0, 0.0],
            [0.5, 0.5, 1.0],
        ],
        dtype=np.float64,
    )
    faces = np.array([3, 0, 1, 2, 3, 0, 1, 3, 3, 1, 2, 3, 3, 0, 2, 3])
    return pv.PolyData(vertices, faces=faces)


@pytest.fixture
def mmg3d_mesh() -> MmgMesh3D:
    """Create a simple MmgMesh3D."""
    vertices = np.array(
        [
            [0.0, 0.0, 0.0],
            [1.0, 0.0, 0.0],
            [0.5, 1.0, 0.0],
            [0.5, 0.5, 1.0],
        ],
        dtype=np.float64,
    )
    elements = np.array([[0, 1, 2, 3]], dtype=np.int32)
    return MmgMesh3D(vertices, elements)


@pytest.fixture
def mmg2d_mesh() -> MmgMesh2D:
    """Create a simple MmgMesh2D."""
    vertices = np.array(
        [
            [0.0, 0.0],
            [1.0, 0.0],
            [1.0, 1.0],
            [0.0, 1.0],
        ],
        dtype=np.float64,
    )
    triangles = np.array([[0, 1, 2], [0, 2, 3]], dtype=np.int32)
    return MmgMesh2D(vertices, triangles)


@pytest.fixture
def mmgs_mesh() -> MmgMeshS:
    """Create a simple MmgMeshS."""
    vertices = np.array(
        [
            [0.0, 0.0, 0.0],
            [1.0, 0.0, 0.0],
            [0.5, 1.0, 0.0],
            [0.5, 0.5, 1.0],
        ],
        dtype=np.float64,
    )
    triangles = np.array([[0, 1, 2], [0, 1, 3], [1, 2, 3], [0, 2, 3]], dtype=np.int32)
    return MmgMeshS(vertices, triangles)


# from_pyvista tests


class TestFromPyvista:
    """Tests for from_pyvista function."""

    def test_unstructured_grid_to_mmg3d(self, tetra_grid: pv.UnstructuredGrid) -> None:
        """Test converting UnstructuredGrid to MmgMesh3D."""
        mesh = from_pyvista(tetra_grid)

        assert isinstance(mesh, MmgMesh3D)
        assert len(mesh.get_vertices()) == 6
        assert len(mesh.get_elements()) == 2

    def test_unstructured_grid_explicit_type(
        self,
        tetra_grid: pv.UnstructuredGrid,
    ) -> None:
        """Test explicit mesh_type parameter."""
        mesh = from_pyvista(tetra_grid, mesh_type=MmgMesh3D)

        assert isinstance(mesh, MmgMesh3D)

    def test_polydata_2d_to_mmg2d(self, triangle_polydata_2d: pv.PolyData) -> None:
        """Test converting 2D PolyData to MmgMesh2D."""
        mesh = from_pyvista(triangle_polydata_2d)

        assert isinstance(mesh, MmgMesh2D)
        assert len(mesh.get_vertices()) == 4
        assert len(mesh.get_triangles()) == 2

    def test_polydata_2d_explicit_type(self, triangle_polydata_2d: pv.PolyData) -> None:
        """Test explicit MmgMesh2D type."""
        mesh = from_pyvista(triangle_polydata_2d, mesh_type=MmgMesh2D)

        assert isinstance(mesh, MmgMesh2D)

    def test_polydata_3d_to_mmgs(self, triangle_polydata_3d: pv.PolyData) -> None:
        """Test converting 3D PolyData to MmgMeshS."""
        mesh = from_pyvista(triangle_polydata_3d)

        assert isinstance(mesh, MmgMeshS)
        assert len(mesh.get_vertices()) == 4
        assert len(mesh.get_triangles()) == 4

    def test_polydata_3d_explicit_type(self, triangle_polydata_3d: pv.PolyData) -> None:
        """Test explicit MmgMeshS type."""
        mesh = from_pyvista(triangle_polydata_3d, mesh_type=MmgMeshS)

        assert isinstance(mesh, MmgMeshS)

    def test_vertices_preserved(self, tetra_grid: pv.UnstructuredGrid) -> None:
        """Test that vertex coordinates are preserved."""
        mesh = from_pyvista(tetra_grid)
        original_vertices = np.array(tetra_grid.points)
        converted_vertices = mesh.get_vertices()

        np.testing.assert_allclose(original_vertices, converted_vertices)

    def test_elements_preserved(self, tetra_grid: pv.UnstructuredGrid) -> None:
        """Test that element connectivity is preserved."""
        mesh = from_pyvista(tetra_grid)
        original_cells = tetra_grid.cells_dict[pv.CellType.TETRA]
        converted_elements = mesh.get_elements()

        np.testing.assert_array_equal(original_cells, converted_elements)

    def test_error_on_wrong_type_combination(
        self,
        triangle_polydata_2d: pv.PolyData,
    ) -> None:
        """Test error when mesh_type doesn't match input type."""
        with pytest.raises(ValueError, match="MmgMesh3D requires UnstructuredGrid"):
            from_pyvista(triangle_polydata_2d, mesh_type=MmgMesh3D)

    def test_error_on_no_tetrahedra(self) -> None:
        """Test error when UnstructuredGrid has no tetrahedra."""
        vertices = np.array([[0, 0, 0], [1, 0, 0], [0.5, 1, 0]])
        cells = {pv.CellType.TRIANGLE: np.array([[0, 1, 2]])}
        grid = pv.UnstructuredGrid(cells, vertices)

        with pytest.raises(ValueError, match="must contain tetrahedra"):
            from_pyvista(grid)


# to_pyvista tests


class TestToPyvista:
    """Tests for to_pyvista function."""

    def test_mmg3d_to_unstructured_grid(self, mmg3d_mesh: MmgMesh3D) -> None:
        """Test converting MmgMesh3D to UnstructuredGrid."""
        grid = to_pyvista(mmg3d_mesh)

        assert isinstance(grid, pv.UnstructuredGrid)
        assert grid.n_points == 4
        assert grid.n_cells == 1
        assert pv.CellType.TETRA in grid.cells_dict

    def test_mmg2d_to_polydata(self, mmg2d_mesh: MmgMesh2D) -> None:
        """Test converting MmgMesh2D to PolyData."""
        polydata = to_pyvista(mmg2d_mesh)

        assert isinstance(polydata, pv.PolyData)
        assert polydata.n_points == 4
        assert polydata.n_cells == 2

    def test_mmg2d_vertices_padded_to_3d(self, mmg2d_mesh: MmgMesh2D) -> None:
        """Test that 2D vertices are padded with zeros for z coordinate."""
        polydata = to_pyvista(mmg2d_mesh)
        z_coords = polydata.points[:, 2]

        np.testing.assert_allclose(z_coords, 0.0)

    def test_mmgs_to_polydata(self, mmgs_mesh: MmgMeshS) -> None:
        """Test converting MmgMeshS to PolyData."""
        polydata = to_pyvista(mmgs_mesh)

        assert isinstance(polydata, pv.PolyData)
        assert polydata.n_points == 4
        assert polydata.n_cells == 4

    def test_refs_included_by_default(self, mmg3d_mesh: MmgMesh3D) -> None:
        """Test that element refs are included by default."""
        grid = to_pyvista(mmg3d_mesh)

        assert "refs" in grid.cell_data

    def test_refs_excluded_when_disabled(self, mmg3d_mesh: MmgMesh3D) -> None:
        """Test that refs can be excluded."""
        grid = to_pyvista(mmg3d_mesh, include_refs=False)

        assert "refs" not in grid.cell_data

    def test_vertices_preserved(self, mmg3d_mesh: MmgMesh3D) -> None:
        """Test that vertex coordinates are preserved."""
        grid = to_pyvista(mmg3d_mesh)
        original_vertices = mmg3d_mesh.get_vertices()

        np.testing.assert_allclose(grid.points, original_vertices)

    def test_elements_preserved(self, mmg3d_mesh: MmgMesh3D) -> None:
        """Test that element connectivity is preserved."""
        grid = to_pyvista(mmg3d_mesh)
        original_elements = mmg3d_mesh.get_elements()
        converted_cells = grid.cells_dict[pv.CellType.TETRA]

        np.testing.assert_array_equal(converted_cells, original_elements)


# Round-trip tests


class TestRoundTrip:
    """Tests for round-trip conversions."""

    def test_mmg3d_round_trip(self, mmg3d_mesh: MmgMesh3D) -> None:
        """Test MmgMesh3D → PyVista → MmgMesh3D preserves data."""
        grid = to_pyvista(mmg3d_mesh)
        mesh_back = from_pyvista(grid)

        np.testing.assert_allclose(mmg3d_mesh.get_vertices(), mesh_back.get_vertices())
        np.testing.assert_array_equal(
            mmg3d_mesh.get_elements(),
            mesh_back.get_elements(),
        )

    def test_mmg2d_round_trip(self, mmg2d_mesh: MmgMesh2D) -> None:
        """Test MmgMesh2D → PyVista → MmgMesh2D preserves data."""
        polydata = to_pyvista(mmg2d_mesh)
        mesh_back = from_pyvista(polydata, mesh_type=MmgMesh2D)

        np.testing.assert_allclose(mmg2d_mesh.get_vertices(), mesh_back.get_vertices())
        np.testing.assert_array_equal(
            mmg2d_mesh.get_triangles(),
            mesh_back.get_triangles(),
        )

    def test_mmgs_round_trip(self, mmgs_mesh: MmgMeshS) -> None:
        """Test MmgMeshS → PyVista → MmgMeshS preserves data."""
        polydata = to_pyvista(mmgs_mesh)
        mesh_back = from_pyvista(polydata, mesh_type=MmgMeshS)

        np.testing.assert_allclose(mmgs_mesh.get_vertices(), mesh_back.get_vertices())
        np.testing.assert_array_equal(
            mmgs_mesh.get_triangles(),
            mesh_back.get_triangles(),
        )

    def test_pyvista_round_trip_3d(self, tetra_grid: pv.UnstructuredGrid) -> None:
        """Test PyVista → mmgpy → PyVista preserves data."""
        mesh = from_pyvista(tetra_grid)
        grid_back = to_pyvista(mesh)

        np.testing.assert_allclose(tetra_grid.points, grid_back.points)
        np.testing.assert_array_equal(
            tetra_grid.cells_dict[pv.CellType.TETRA],
            grid_back.cells_dict[pv.CellType.TETRA],
        )

    def test_mmg3d_round_trip_preserves_refs(self, mmg3d_mesh: MmgMesh3D) -> None:
        """Test MmgMesh3D → PyVista → MmgMesh3D preserves refs."""
        # Set refs on the original mesh
        elements = mmg3d_mesh.get_elements()
        refs = np.array([i % 3 for i in range(len(elements))], dtype=np.int32)
        mmg3d_mesh.set_tetrahedra(elements, refs)

        # Round-trip
        grid = to_pyvista(mmg3d_mesh)
        mesh_back = from_pyvista(grid)

        # Check refs are preserved
        _, refs_back = mesh_back.get_tetrahedra_with_refs()
        np.testing.assert_array_equal(refs, refs_back)

    def test_mmg2d_round_trip_preserves_refs(self, mmg2d_mesh: MmgMesh2D) -> None:
        """Test MmgMesh2D → PyVista → MmgMesh2D preserves refs."""
        # Set refs on the original mesh
        triangles = mmg2d_mesh.get_triangles()
        refs = np.array([i % 5 for i in range(len(triangles))], dtype=np.int32)
        mmg2d_mesh.set_triangles(triangles, refs)

        # Round-trip
        polydata = to_pyvista(mmg2d_mesh)
        mesh_back = from_pyvista(polydata, mesh_type=MmgMesh2D)

        # Check refs are preserved
        _, refs_back = mesh_back.get_triangles_with_refs()
        np.testing.assert_array_equal(refs, refs_back)

    def test_mmgs_round_trip_preserves_refs(self, mmgs_mesh: MmgMeshS) -> None:
        """Test MmgMeshS → PyVista → MmgMeshS preserves refs."""
        # Set refs on the original mesh
        triangles = mmgs_mesh.get_triangles()
        refs = np.array([i % 4 for i in range(len(triangles))], dtype=np.int32)
        mmgs_mesh.set_triangles(triangles, refs)

        # Round-trip
        polydata = to_pyvista(mmgs_mesh)
        mesh_back = from_pyvista(polydata, mesh_type=MmgMeshS)

        # Check refs are preserved
        _, refs_back = mesh_back.get_triangles_with_refs()
        np.testing.assert_array_equal(refs, refs_back)


# Integration tests with remeshing


class TestRemeshingIntegration:
    """Tests for PyVista integration with remeshing."""

    def test_remesh_from_pyvista_grid(self) -> None:
        """Test remeshing a mesh loaded from PyVista."""
        x = np.linspace(0, 1, 5)
        y = np.linspace(0, 1, 5)
        z = np.linspace(0, 1, 5)
        xx, yy, zz = np.meshgrid(x, y, z, indexing="ij")
        points = np.column_stack([xx.ravel(), yy.ravel(), zz.ravel()])

        cloud = pv.PolyData(points)
        tetra = cloud.delaunay_3d()

        mesh = from_pyvista(tetra)
        original_n_elements = len(mesh.get_elements())

        mesh.remesh(hmax=0.3, verbose=False)

        result = to_pyvista(mesh)
        assert isinstance(result, pv.UnstructuredGrid)
        assert result.n_cells != original_n_elements

    def test_levelset_workflow(self) -> None:
        """Test level-set discretization with PyVista conversion."""
        x = np.linspace(0, 1, 8)
        y = np.linspace(0, 1, 8)
        z = np.linspace(0, 1, 8)
        xx, yy, zz = np.meshgrid(x, y, z, indexing="ij")
        points = np.column_stack([xx.ravel(), yy.ravel(), zz.ravel()])

        cloud = pv.PolyData(points)
        tetra = cloud.delaunay_3d()

        mesh = from_pyvista(tetra)
        vertices = mesh.get_vertices()

        center = np.array([0.5, 0.5, 0.5])
        radius = 0.3
        levelset = (np.linalg.norm(vertices - center, axis=1) - radius).reshape(-1, 1)

        mesh.remesh_levelset(levelset, hmax=0.15, verbose=False)

        result = to_pyvista(mesh, include_refs=True)
        assert "refs" in result.cell_data

        refs = result.cell_data["refs"]
        unique_refs = np.unique(refs)
        assert len(unique_refs) >= 2


# Class method and instance method tests


# Module exports test


def test_module_exports() -> None:
    """Test that pyvista functions are exported from main package."""
    import mmgpy

    assert hasattr(mmgpy, "from_pyvista")
    assert hasattr(mmgpy, "to_pyvista")
    assert callable(mmgpy.from_pyvista)
    assert callable(mmgpy.to_pyvista)
