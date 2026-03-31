"""Tests for unified Mesh class and MeshKind enum."""

from pathlib import Path
from tempfile import TemporaryDirectory

import meshio
import numpy as np
import pytest
import pyvista as pv

from mmgpy import Mesh, MeshKind, read

# Test fixtures


@pytest.fixture
def tetra_vertices() -> np.ndarray:
    """Vertices for a simple tetrahedral mesh."""
    return np.array(
        [
            [0.0, 0.0, 0.0],
            [1.0, 0.0, 0.0],
            [0.5, 1.0, 0.0],
            [0.5, 0.5, 1.0],
        ],
        dtype=np.float64,
    )


@pytest.fixture
def tetra_cells() -> np.ndarray:
    """Tetrahedra connectivity."""
    return np.array([[0, 1, 2, 3]], dtype=np.int32)


@pytest.fixture
def triangle_2d_vertices() -> np.ndarray:
    """2D vertices for triangular mesh."""
    return np.array(
        [
            [0.0, 0.0],
            [1.0, 0.0],
            [0.5, 1.0],
        ],
        dtype=np.float64,
    )


@pytest.fixture
def triangle_3d_vertices() -> np.ndarray:
    """3D surface vertices."""
    return np.array(
        [
            [0.0, 0.0, 0.0],
            [1.0, 0.0, 0.0],
            [0.5, 1.0, 0.5],
        ],
        dtype=np.float64,
    )


@pytest.fixture
def triangle_cells() -> np.ndarray:
    """Triangle connectivity."""
    return np.array([[0, 1, 2]], dtype=np.int32)


# MeshKind tests


class TestMeshKind:
    """Tests for MeshKind enum."""

    def test_enum_values(self) -> None:
        """Test that enum has expected values."""
        assert MeshKind.TETRAHEDRAL.value == "tetrahedral"
        assert MeshKind.TRIANGULAR_2D.value == "triangular_2d"
        assert MeshKind.TRIANGULAR_SURFACE.value == "triangular_surface"

    def test_enum_members(self) -> None:
        """Test that all expected members exist."""
        members = list(MeshKind)
        assert len(members) == 3
        assert MeshKind.TETRAHEDRAL in members
        assert MeshKind.TRIANGULAR_2D in members
        assert MeshKind.TRIANGULAR_SURFACE in members


# Mesh constructor tests


class TestMeshConstructor:
    """Tests for Mesh constructor."""

    def test_tetrahedral_from_arrays(
        self,
        tetra_vertices: np.ndarray,
        tetra_cells: np.ndarray,
    ) -> None:
        """Test creating tetrahedral mesh from arrays."""
        mesh = Mesh(tetra_vertices, tetra_cells)

        assert mesh.kind == MeshKind.TETRAHEDRAL
        assert len(mesh.get_vertices()) == 4
        assert len(mesh.get_tetrahedra()) == 1

    def test_2d_from_arrays(
        self,
        triangle_2d_vertices: np.ndarray,
        triangle_cells: np.ndarray,
    ) -> None:
        """Test creating 2D mesh from arrays."""
        mesh = Mesh(triangle_2d_vertices, triangle_cells)

        assert mesh.kind == MeshKind.TRIANGULAR_2D
        assert len(mesh.get_vertices()) == 3
        assert len(mesh.get_triangles()) == 1

    def test_surface_from_arrays(
        self,
        triangle_3d_vertices: np.ndarray,
        triangle_cells: np.ndarray,
    ) -> None:
        """Test creating surface mesh from arrays."""
        mesh = Mesh(triangle_3d_vertices, triangle_cells)

        assert mesh.kind == MeshKind.TRIANGULAR_SURFACE
        assert len(mesh.get_vertices()) == 3
        assert len(mesh.get_triangles()) == 1

    def test_2d_detection_with_z_zero(
        self,
        triangle_cells: np.ndarray,
    ) -> None:
        """Test that z≈0 triangles are detected as 2D."""
        vertices_z_zero = np.array(
            [
                [0.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [0.5, 1.0, 0.0],
            ],
            dtype=np.float64,
        )
        mesh = Mesh(vertices_z_zero, triangle_cells)

        assert mesh.kind == MeshKind.TRIANGULAR_2D

    def test_from_file(
        self,
        tetra_vertices: np.ndarray,
        tetra_cells: np.ndarray,
    ) -> None:
        """Test creating mesh from file."""
        with TemporaryDirectory() as tmpdir:
            filepath = Path(tmpdir) / "mesh.vtk"
            meshio.Mesh(tetra_vertices, [("tetra", tetra_cells)]).write(filepath)

            mesh = Mesh(filepath)

            assert mesh.kind == MeshKind.TETRAHEDRAL
            assert len(mesh.get_vertices()) == 4

    def test_from_pyvista(
        self,
        tetra_vertices: np.ndarray,
        tetra_cells: np.ndarray,
    ) -> None:
        """Test creating mesh from PyVista object."""
        grid = pv.UnstructuredGrid({pv.CellType.TETRA: tetra_cells}, tetra_vertices)

        mesh = Mesh(grid)

        assert mesh.kind == MeshKind.TETRAHEDRAL
        assert len(mesh.get_vertices()) == 4

    def test_missing_cells_raises(self, tetra_vertices: np.ndarray) -> None:
        """Test that missing cells parameter raises error."""
        with pytest.raises(ValueError, match="cells parameter is required"):
            Mesh(tetra_vertices)


# Method delegation tests


class TestMeshMethods:
    """Tests for Mesh method delegation."""

    def test_get_vertices(
        self,
        tetra_vertices: np.ndarray,
        tetra_cells: np.ndarray,
    ) -> None:
        """Test get_vertices delegates correctly."""
        mesh = Mesh(tetra_vertices, tetra_cells)

        np.testing.assert_allclose(mesh.get_vertices(), tetra_vertices)

    def test_get_triangles_tetrahedral(
        self,
        tetra_vertices: np.ndarray,
        tetra_cells: np.ndarray,
    ) -> None:
        """Test get_triangles works for tetrahedral mesh (boundary faces)."""
        mesh = Mesh(tetra_vertices, tetra_cells)

        # Tetrahedral mesh should have boundary triangles
        triangles = mesh.get_triangles()
        assert triangles.shape[1] == 3

    def test_get_tetrahedra(
        self,
        tetra_vertices: np.ndarray,
        tetra_cells: np.ndarray,
    ) -> None:
        """Test get_tetrahedra for tetrahedral mesh."""
        mesh = Mesh(tetra_vertices, tetra_cells)

        np.testing.assert_array_equal(mesh.get_tetrahedra(), tetra_cells)

    def test_get_tetrahedra_raises_for_2d(
        self,
        triangle_2d_vertices: np.ndarray,
        triangle_cells: np.ndarray,
    ) -> None:
        """Test get_tetrahedra raises for non-tetrahedral mesh."""
        mesh = Mesh(triangle_2d_vertices, triangle_cells)

        with pytest.raises(TypeError, match="only available for TETRAHEDRAL"):
            mesh.get_tetrahedra()

    def test_get_elements_alias(
        self,
        tetra_vertices: np.ndarray,
        tetra_cells: np.ndarray,
    ) -> None:
        """Test get_elements is alias for get_tetrahedra."""
        mesh = Mesh(tetra_vertices, tetra_cells)

        np.testing.assert_array_equal(mesh.get_elements(), mesh.get_tetrahedra())

    def test_field_operations(
        self,
        tetra_vertices: np.ndarray,
        tetra_cells: np.ndarray,
    ) -> None:
        """Test dictionary-style field set/get with metric field."""
        mesh = Mesh(tetra_vertices, tetra_cells)
        # Use "metric" field which is recognized by MMG
        field = np.array([[0.1], [0.1], [0.1], [0.1]])

        mesh["metric"] = field
        result = mesh["metric"]

        np.testing.assert_allclose(result, field)

    def test_dict_access(
        self,
        tetra_vertices: np.ndarray,
        tetra_cells: np.ndarray,
    ) -> None:
        """Test dictionary-style field access with metric field."""
        mesh = Mesh(tetra_vertices, tetra_cells)
        # Use "metric" field which is recognized by MMG
        field = np.array([[0.1], [0.1], [0.1], [0.1]])

        mesh["metric"] = field
        result = mesh["metric"]

        np.testing.assert_allclose(result, field)

    def test_dict_access_tensor_metric_3d(
        self,
        tetra_vertices: np.ndarray,
        tetra_cells: np.ndarray,
    ) -> None:
        """Test mesh['metric'] = tensor_field round-trips for 3D mesh."""
        mesh = Mesh(tetra_vertices, tetra_cells)
        n = len(tetra_vertices)
        # Nx6 tensor (symmetric 3x3: xx, xy, xz, yy, yz, zz)
        tensor = np.tile([1.0, 0.0, 0.0, 1.0, 0.0, 1.0], (n, 1))

        mesh["metric"] = tensor
        result = mesh["metric"]

        np.testing.assert_allclose(result, tensor)

    def test_dict_access_tensor_metric_2d(
        self,
        triangle_2d_vertices: np.ndarray,
        triangle_cells: np.ndarray,
    ) -> None:
        """Test mesh['metric'] = tensor_field round-trips for 2D mesh."""
        mesh = Mesh(triangle_2d_vertices, triangle_cells)
        n = len(triangle_2d_vertices)
        # Nx3 tensor (symmetric 2x2: xx, xy, yy)
        tensor = np.tile([1.0, 0.0, 1.0], (n, 1))

        mesh["metric"] = tensor
        result = mesh["metric"]

        np.testing.assert_allclose(result, tensor)

    def test_dict_access_user_field_scalar(
        self,
        tetra_vertices: np.ndarray,
        tetra_cells: np.ndarray,
    ) -> None:
        """Test mesh['temperature'] = values stores as user field."""
        mesh = Mesh(tetra_vertices, tetra_cells)
        n = len(tetra_vertices)
        temperature = np.arange(n, dtype=np.float64)

        mesh["temperature"] = temperature
        result = mesh["temperature"]

        np.testing.assert_allclose(result, temperature)
        assert mesh.has_user_field("temperature")

    def test_dict_access_user_field_vector(
        self,
        tetra_vertices: np.ndarray,
        tetra_cells: np.ndarray,
    ) -> None:
        """Test mesh['velocity'] = vector_values stores as user field."""
        mesh = Mesh(tetra_vertices, tetra_cells)
        n = len(tetra_vertices)
        velocity = np.random.default_rng(42).random((n, 3))

        mesh["velocity"] = velocity
        result = mesh["velocity"]

        np.testing.assert_allclose(result, velocity)
        assert mesh.has_user_field("velocity")

    def test_dict_access_user_field_getitem_missing(
        self,
        tetra_vertices: np.ndarray,
        tetra_cells: np.ndarray,
    ) -> None:
        """Test mesh['nonexistent'] raises KeyError."""
        mesh = Mesh(tetra_vertices, tetra_cells)

        with pytest.raises(KeyError, match="not found"):
            _ = mesh["nonexistent"]

    def test_dict_access_known_fields_passthrough(
        self,
        tetra_vertices: np.ndarray,
        tetra_cells: np.ndarray,
    ) -> None:
        """Test that known MMG fields like 'tensor' still work directly."""
        mesh = Mesh(tetra_vertices, tetra_cells)
        n = len(tetra_vertices)
        tensor = np.tile([1.0, 0.0, 0.0, 1.0, 0.0, 1.0], (n, 1))

        mesh["tensor"] = tensor
        result = mesh["tensor"]

        np.testing.assert_allclose(result, tensor)

    def test_dict_access_tensor_metric_invalid_components(
        self,
        tetra_vertices: np.ndarray,
        tetra_cells: np.ndarray,
    ) -> None:
        """Test mesh['metric'] = Nx4 raises ValueError for invalid component count."""
        mesh = Mesh(tetra_vertices, tetra_cells)
        n = len(tetra_vertices)
        bad_tensor = np.ones((n, 4))

        with pytest.raises(ValueError, match=r"3 \(2D\) or 6 \(3D\) components"):
            mesh["metric"] = bad_tensor

    def test_contains_user_field(
        self,
        tetra_vertices: np.ndarray,
        tetra_cells: np.ndarray,
    ) -> None:
        """Test 'field_name' in mesh works for user fields."""
        mesh = Mesh(tetra_vertices, tetra_cells)

        assert "temperature" not in mesh
        mesh["temperature"] = np.ones(len(tetra_vertices))
        assert "temperature" in mesh

    def test_contains_mmg_field(
        self,
        tetra_vertices: np.ndarray,
        tetra_cells: np.ndarray,
    ) -> None:
        """Test 'field_name' in mesh works for MMG fields."""
        mesh = Mesh(tetra_vertices, tetra_cells)

        mesh["metric"] = np.ones((len(tetra_vertices), 1)) * 0.1
        assert "metric" in mesh

    def test_getitem_unset_mmg_field_raises_keyerror(self) -> None:
        """Test that accessing unset MMG field raises KeyError, not RuntimeError."""
        # Use a fresh mesh from file to avoid C++ memory reuse from prior tests
        import pyvista as pv

        tetra = pv.Tetrahedron()
        mesh = Mesh(tetra)

        with pytest.raises(KeyError):
            _ = mesh["levelset"]

    def test_save(
        self,
        tetra_vertices: np.ndarray,
        tetra_cells: np.ndarray,
    ) -> None:
        """Test save method."""
        mesh = Mesh(tetra_vertices, tetra_cells)

        with TemporaryDirectory() as tmpdir:
            filepath = Path(tmpdir) / "output.mesh"
            mesh.save(filepath)

            assert filepath.exists()

    def test_save_non_native_format(
        self,
        tetra_vertices: np.ndarray,
        tetra_cells: np.ndarray,
    ) -> None:
        """Test save to non-native format via meshio."""
        mesh = Mesh(tetra_vertices, tetra_cells)

        with TemporaryDirectory() as tmpdir:
            filepath = Path(tmpdir) / "output.vtk"
            mesh.save(filepath)

            assert filepath.exists()
            assert filepath.stat().st_size > 0

    def test_to_pyvista(
        self,
        tetra_vertices: np.ndarray,
        tetra_cells: np.ndarray,
    ) -> None:
        """Test to_pyvista conversion."""
        mesh = Mesh(tetra_vertices, tetra_cells)

        result = mesh.to_pyvista()

        assert isinstance(result, pv.UnstructuredGrid)
        assert result.n_points == 4
        assert result.n_cells == 1


# Remeshing tests


class TestMeshRemeshing:
    """Tests for Mesh remeshing operations."""

    def test_remesh(self) -> None:
        """Test basic remeshing."""
        x = np.linspace(0, 1, 4)
        y = np.linspace(0, 1, 4)
        z = np.linspace(0, 1, 4)
        xx, yy, zz = np.meshgrid(x, y, z, indexing="ij")
        points = np.column_stack([xx.ravel(), yy.ravel(), zz.ravel()])
        cloud = pv.PolyData(points)
        tetra = cloud.delaunay_3d()

        mesh = Mesh(tetra)
        initial_count = len(mesh.get_tetrahedra())

        mesh.remesh(hmax=0.3, verbose=-1)

        assert len(mesh.get_tetrahedra()) != initial_count

    @pytest.mark.skip(reason="Requires MMG compiled with USE_ELAS flag")
    def test_remesh_lagrangian_tetrahedral(self) -> None:
        """Test Lagrangian remeshing for tetrahedral mesh."""
        x = np.linspace(0, 1, 4)
        y = np.linspace(0, 1, 4)
        z = np.linspace(0, 1, 4)
        xx, yy, zz = np.meshgrid(x, y, z, indexing="ij")
        points = np.column_stack([xx.ravel(), yy.ravel(), zz.ravel()])
        cloud = pv.PolyData(points)
        tetra = cloud.delaunay_3d()

        mesh = Mesh(tetra)
        displacement = np.zeros((len(mesh.get_vertices()), 3))
        displacement[:, 0] = 0.01  # Small x displacement

        # Should not raise
        mesh.remesh_lagrangian(displacement, verbose=-1)

    def test_remesh_lagrangian_raises_for_surface(
        self,
        triangle_3d_vertices: np.ndarray,
        triangle_cells: np.ndarray,
    ) -> None:
        """Test remesh_lagrangian raises for surface mesh."""
        mesh = Mesh(triangle_3d_vertices, triangle_cells)
        displacement = np.zeros((3, 3))

        with pytest.raises(TypeError, match="not available for TRIANGULAR_SURFACE"):
            mesh.remesh_lagrangian(displacement)


# Sizing methods tests


class TestMeshSizing:
    """Tests for Mesh sizing methods."""

    def test_set_size_sphere(self) -> None:
        """Test set_size_sphere method."""
        x = np.linspace(0, 1, 4)
        y = np.linspace(0, 1, 4)
        z = np.linspace(0, 1, 4)
        xx, yy, zz = np.meshgrid(x, y, z, indexing="ij")
        points = np.column_stack([xx.ravel(), yy.ravel(), zz.ravel()])
        cloud = pv.PolyData(points)
        tetra = cloud.delaunay_3d()

        mesh = Mesh(tetra)
        mesh.set_size_sphere(center=[0.5, 0.5, 0.5], radius=0.3, size=0.05)

        assert mesh.get_local_sizing_count() == 1

    def test_clear_local_sizing(self) -> None:
        """Test clear_local_sizing method."""
        x = np.linspace(0, 1, 4)
        y = np.linspace(0, 1, 4)
        z = np.linspace(0, 1, 4)
        xx, yy, zz = np.meshgrid(x, y, z, indexing="ij")
        points = np.column_stack([xx.ravel(), yy.ravel(), zz.ravel()])
        cloud = pv.PolyData(points)
        tetra = cloud.delaunay_3d()

        mesh = Mesh(tetra)
        mesh.set_size_sphere(center=[0.5, 0.5, 0.5], radius=0.3, size=0.05)
        mesh.clear_local_sizing()

        assert mesh.get_local_sizing_count() == 0

    def test_set_size_cylinder_2d_raises(
        self,
        triangle_2d_vertices: np.ndarray,
        triangle_cells: np.ndarray,
    ) -> None:
        """Test set_size_cylinder raises for 2D mesh."""
        mesh = Mesh(triangle_2d_vertices, triangle_cells)

        with pytest.raises(TypeError, match="not available for TRIANGULAR_2D"):
            mesh.set_size_cylinder([0, 0, 0], [0, 0, 1], 0.1, 0.05)


# read() function tests


class TestReadFunction:
    """Tests for read() function returning Mesh."""

    def test_read_file_returns_mesh(
        self,
        tetra_vertices: np.ndarray,
        tetra_cells: np.ndarray,
    ) -> None:
        """Test read() from file returns Mesh."""
        with TemporaryDirectory() as tmpdir:
            filepath = Path(tmpdir) / "mesh.vtk"
            meshio.Mesh(tetra_vertices, [("tetra", tetra_cells)]).write(filepath)

            result = read(filepath)

            assert isinstance(result, Mesh)
            assert result.kind == MeshKind.TETRAHEDRAL

    def test_read_pyvista_returns_mesh(
        self,
        tetra_vertices: np.ndarray,
        tetra_cells: np.ndarray,
    ) -> None:
        """Test read() from PyVista returns Mesh."""
        grid = pv.UnstructuredGrid({pv.CellType.TETRA: tetra_cells}, tetra_vertices)

        result = read(grid)

        assert isinstance(result, Mesh)
        assert result.kind == MeshKind.TETRAHEDRAL

    def test_read_with_forced_mesh_kind(
        self,
        triangle_3d_vertices: np.ndarray,
        triangle_cells: np.ndarray,
    ) -> None:
        """Test read() with forced mesh_kind parameter."""
        with TemporaryDirectory() as tmpdir:
            filepath = Path(tmpdir) / "mesh.vtk"
            # This would auto-detect as TRIANGULAR_SURFACE due to 3D coords
            meshio.Mesh(triangle_3d_vertices, [("triangle", triangle_cells)]).write(
                filepath,
            )

            # Force it to be read as 2D (vertices will be projected to 2D)
            result = read(filepath, mesh_kind=MeshKind.TRIANGULAR_2D)

            assert isinstance(result, Mesh)
            assert result.kind == MeshKind.TRIANGULAR_2D
            # Vertices should be 2D
            assert result.get_vertices().shape[1] == 2

    def test_read_unsupported_element_type_raises(self) -> None:
        """Test read() raises for unsupported element types like hexahedra."""
        vertices = np.array(
            [
                [0, 0, 0],
                [1, 0, 0],
                [1, 1, 0],
                [0, 1, 0],
                [0, 0, 1],
                [1, 0, 1],
                [1, 1, 1],
                [0, 1, 1],
            ],
            dtype=np.float64,
        )
        hexahedra = np.array([[0, 1, 2, 3, 4, 5, 6, 7]], dtype=np.int32)

        with TemporaryDirectory() as tmpdir:
            filepath = Path(tmpdir) / "hex_mesh.vtk"
            meshio.Mesh(vertices, [("hexahedron", hexahedra)]).write(filepath)

            with pytest.raises(ValueError, match="Unsupported element types"):
                read(filepath)

    def test_read_multiple_triangle_blocks(
        self,
        triangle_3d_vertices: np.ndarray,
    ) -> None:
        """Test read() concatenates multiple triangle blocks."""
        # Create two separate triangle blocks
        tri_block1 = np.array([[0, 1, 2]], dtype=np.int32)
        tri_block2 = np.array([[0, 2, 1]], dtype=np.int32)

        with TemporaryDirectory() as tmpdir:
            filepath = Path(tmpdir) / "mesh.vtk"
            meshio.Mesh(
                triangle_3d_vertices,
                [("triangle", tri_block1), ("triangle", tri_block2)],
            ).write(filepath)

            result = read(filepath)

            assert isinstance(result, Mesh)
            # Should have 2 triangles from concatenated blocks
            assert len(result.get_triangles()) == 2


# Module exports test


def test_mesh_exported() -> None:
    """Test that Mesh and MeshKind are exported from main package."""
    import mmgpy

    assert hasattr(mmgpy, "Mesh")
    assert hasattr(mmgpy, "MeshKind")
    assert mmgpy.Mesh is Mesh
    assert mmgpy.MeshKind is MeshKind
