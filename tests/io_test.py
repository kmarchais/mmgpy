"""Tests for unified mesh I/O (mmgpy.read)."""

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
            [1.0, 1.0, 0.0],
            [1.0, 0.5, 1.0],
        ],
        dtype=np.float64,
    )


@pytest.fixture
def tetra_cells() -> np.ndarray:
    """Tetrahedra connectivity."""
    return np.array([[0, 1, 2, 3], [1, 4, 2, 5]], dtype=np.int32)


@pytest.fixture
def triangle_2d_vertices() -> np.ndarray:
    """2D vertices for triangular mesh."""
    return np.array(
        [
            [0.0, 0.0],
            [1.0, 0.0],
            [1.0, 1.0],
            [0.0, 1.0],
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
            [0.5, 1.0, 0.0],
            [0.5, 0.5, 1.0],
        ],
        dtype=np.float64,
    )


@pytest.fixture
def triangle_cells() -> np.ndarray:
    """Triangle connectivity."""
    return np.array([[0, 1, 2], [0, 2, 3]], dtype=np.int32)


@pytest.fixture
def surface_triangle_cells() -> np.ndarray:
    """Surface triangle connectivity."""
    return np.array([[0, 1, 2], [0, 1, 3], [1, 2, 3], [0, 2, 3]], dtype=np.int32)


@pytest.fixture
def tetra_grid(
    tetra_vertices: np.ndarray,
    tetra_cells: np.ndarray,
) -> pv.UnstructuredGrid:
    """Create a simple tetrahedral UnstructuredGrid."""
    return pv.UnstructuredGrid({pv.CellType.TETRA: tetra_cells}, tetra_vertices)


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
def triangle_polydata_3d(
    triangle_3d_vertices: np.ndarray,
    surface_triangle_cells: np.ndarray,
) -> pv.PolyData:
    """Create a simple 3D surface triangular PolyData."""
    n_cells = len(surface_triangle_cells)
    faces = np.hstack([np.full((n_cells, 1), 3), surface_triangle_cells]).ravel()
    return pv.PolyData(triangle_3d_vertices, faces=faces)


# PyVista reading tests


class TestReadPyvista:
    """Tests for reading from PyVista objects."""

    def test_read_unstructured_grid(self, tetra_grid: pv.UnstructuredGrid) -> None:
        """Test reading from UnstructuredGrid."""
        mesh = read(tetra_grid)

        assert isinstance(mesh, Mesh)
        assert mesh.kind == MeshKind.TETRAHEDRAL
        assert len(mesh.get_vertices()) == 6
        assert len(mesh.get_elements()) == 2

    def test_read_polydata_2d(self, triangle_polydata_2d: pv.PolyData) -> None:
        """Test reading 2D PolyData (z=0)."""
        mesh = read(triangle_polydata_2d)

        assert isinstance(mesh, Mesh)
        assert mesh.kind == MeshKind.TRIANGULAR_2D
        assert len(mesh.get_vertices()) == 4
        assert len(mesh.get_triangles()) == 2

    def test_read_polydata_3d(self, triangle_polydata_3d: pv.PolyData) -> None:
        """Test reading 3D surface PolyData."""
        mesh = read(triangle_polydata_3d)

        assert isinstance(mesh, Mesh)
        assert mesh.kind == MeshKind.TRIANGULAR_SURFACE
        assert len(mesh.get_vertices()) == 4
        assert len(mesh.get_triangles()) == 4

    def test_read_pyvista_explicit_3d(self, tetra_grid: pv.UnstructuredGrid) -> None:
        """Test explicit mesh_kind=TETRAHEDRAL."""
        mesh = read(tetra_grid, mesh_kind=MeshKind.TETRAHEDRAL)

        assert isinstance(mesh, Mesh)
        assert mesh.kind == MeshKind.TETRAHEDRAL

    def test_read_pyvista_explicit_2d(self, triangle_polydata_2d: pv.PolyData) -> None:
        """Test explicit mesh_kind=TRIANGULAR_2D."""
        mesh = read(triangle_polydata_2d, mesh_kind=MeshKind.TRIANGULAR_2D)

        assert isinstance(mesh, Mesh)
        assert mesh.kind == MeshKind.TRIANGULAR_2D

    def test_read_pyvista_explicit_surface(
        self,
        triangle_polydata_3d: pv.PolyData,
    ) -> None:
        """Test explicit mesh_kind=TRIANGULAR_SURFACE."""
        mesh = read(triangle_polydata_3d, mesh_kind=MeshKind.TRIANGULAR_SURFACE)

        assert isinstance(mesh, Mesh)
        assert mesh.kind == MeshKind.TRIANGULAR_SURFACE


# File reading tests


class TestReadFile:
    """Tests for reading from files."""

    def test_read_vtk_tetrahedra(
        self,
        tetra_vertices: np.ndarray,
        tetra_cells: np.ndarray,
    ) -> None:
        """Test reading VTK file with tetrahedra."""
        with TemporaryDirectory() as tmpdir:
            filepath = Path(tmpdir) / "mesh.vtk"

            meshio_mesh = meshio.Mesh(
                points=tetra_vertices,
                cells=[("tetra", tetra_cells)],
            )
            meshio_mesh.write(filepath)

            mesh = read(filepath)

            assert isinstance(mesh, Mesh)
            assert mesh.kind == MeshKind.TETRAHEDRAL
            assert len(mesh.get_vertices()) == 6
            assert len(mesh.get_elements()) == 2

    def test_read_vtk_surface(
        self,
        triangle_3d_vertices: np.ndarray,
        surface_triangle_cells: np.ndarray,
    ) -> None:
        """Test reading VTK file with surface triangles."""
        with TemporaryDirectory() as tmpdir:
            filepath = Path(tmpdir) / "surface.vtk"

            meshio_mesh = meshio.Mesh(
                points=triangle_3d_vertices,
                cells=[("triangle", surface_triangle_cells)],
            )
            meshio_mesh.write(filepath)

            mesh = read(filepath)

            assert isinstance(mesh, Mesh)
            assert mesh.kind == MeshKind.TRIANGULAR_SURFACE
            assert len(mesh.get_vertices()) == 4
            assert len(mesh.get_triangles()) == 4

    def test_read_vtk_2d(
        self,
        triangle_2d_vertices: np.ndarray,
        triangle_cells: np.ndarray,
    ) -> None:
        """Test reading VTK file with 2D triangles (z=0)."""
        with TemporaryDirectory() as tmpdir:
            filepath = Path(tmpdir) / "mesh2d.vtk"

            # Add z=0 column for VTK format
            n_verts = len(triangle_2d_vertices)
            vertices_3d = np.column_stack([triangle_2d_vertices, np.zeros(n_verts)])

            meshio_mesh = meshio.Mesh(
                points=vertices_3d,
                cells=[("triangle", triangle_cells)],
            )
            meshio_mesh.write(filepath)

            mesh = read(filepath)

            assert isinstance(mesh, Mesh)
            assert mesh.kind == MeshKind.TRIANGULAR_2D
            assert len(mesh.get_vertices()) == 4
            assert len(mesh.get_triangles()) == 2

    def test_read_gmsh_format(
        self,
        tetra_vertices: np.ndarray,
        tetra_cells: np.ndarray,
    ) -> None:
        """Test reading Gmsh .msh file."""
        with TemporaryDirectory() as tmpdir:
            filepath = Path(tmpdir) / "mesh.msh"

            meshio_mesh = meshio.Mesh(
                points=tetra_vertices,
                cells=[("tetra", tetra_cells)],
            )
            meshio_mesh.write(filepath)

            mesh = read(filepath)

            assert isinstance(mesh, Mesh)
            assert mesh.kind == MeshKind.TETRAHEDRAL
            assert len(mesh.get_vertices()) == 6

    def test_read_stl_format(self, triangle_polydata_3d: pv.PolyData) -> None:
        """Test reading STL file."""
        with TemporaryDirectory() as tmpdir:
            filepath = Path(tmpdir) / "surface.stl"
            triangle_polydata_3d.save(filepath)

            mesh = read(filepath)

            assert isinstance(mesh, Mesh)
            assert mesh.kind == MeshKind.TRIANGULAR_SURFACE

    def test_read_explicit_mesh_kind(
        self,
        triangle_3d_vertices: np.ndarray,
        surface_triangle_cells: np.ndarray,
    ) -> None:
        """Test explicit mesh_kind parameter with file."""
        with TemporaryDirectory() as tmpdir:
            filepath = Path(tmpdir) / "mesh.vtk"

            meshio_mesh = meshio.Mesh(
                points=triangle_3d_vertices,
                cells=[("triangle", surface_triangle_cells)],
            )
            meshio_mesh.write(filepath)

            # Force surface mesh kind
            mesh = read(filepath, mesh_kind=MeshKind.TRIANGULAR_SURFACE)

            assert isinstance(mesh, Mesh)
            assert mesh.kind == MeshKind.TRIANGULAR_SURFACE

    def test_read_path_object(
        self,
        tetra_vertices: np.ndarray,
        tetra_cells: np.ndarray,
    ) -> None:
        """Test reading with Path object."""
        with TemporaryDirectory() as tmpdir:
            filepath = Path(tmpdir) / "mesh.vtk"

            meshio_mesh = meshio.Mesh(
                points=tetra_vertices,
                cells=[("tetra", tetra_cells)],
            )
            meshio_mesh.write(filepath)

            mesh = read(filepath)

            assert isinstance(mesh, Mesh)
            assert mesh.kind == MeshKind.TETRAHEDRAL


# Error handling tests


class TestReadErrors:
    """Tests for error handling."""

    def test_file_not_found(self) -> None:
        """Test error when file doesn't exist."""
        with pytest.raises(FileNotFoundError, match="File not found"):
            read("/nonexistent/path/mesh.vtk")

    def test_unsupported_source_type(self) -> None:
        """Test error for unsupported source type."""
        with pytest.raises(TypeError, match="Unsupported source type"):
            read({"invalid": "source"})  # type: ignore[arg-type]


# Data preservation tests


class TestDataPreservation:
    """Tests for data preservation during reading."""

    def test_vertices_preserved(
        self,
        tetra_vertices: np.ndarray,
        tetra_cells: np.ndarray,
    ) -> None:
        """Test that vertex coordinates are preserved."""
        with TemporaryDirectory() as tmpdir:
            filepath = Path(tmpdir) / "mesh.vtk"

            meshio_mesh = meshio.Mesh(
                points=tetra_vertices,
                cells=[("tetra", tetra_cells)],
            )
            meshio_mesh.write(filepath)

            mesh = read(filepath)

            np.testing.assert_allclose(mesh.get_vertices(), tetra_vertices)

    def test_elements_preserved(
        self,
        tetra_vertices: np.ndarray,
        tetra_cells: np.ndarray,
    ) -> None:
        """Test that element connectivity is preserved."""
        with TemporaryDirectory() as tmpdir:
            filepath = Path(tmpdir) / "mesh.vtk"

            meshio_mesh = meshio.Mesh(
                points=tetra_vertices,
                cells=[("tetra", tetra_cells)],
            )
            meshio_mesh.write(filepath)

            mesh = read(filepath)

            np.testing.assert_array_equal(mesh.get_elements(), tetra_cells)


# Module export test


def test_read_exported() -> None:
    """Test that read is exported from main package."""
    import mmgpy

    assert hasattr(mmgpy, "read")
    assert callable(mmgpy.read)
