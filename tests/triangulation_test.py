"""Tests for automatic triangulation of non-triangular meshes."""

from __future__ import annotations

import logging
from typing import TYPE_CHECKING

import numpy as np
import pytest
import pyvista as pv

import mmgpy
from mmgpy import Mesh, MeshKind

if TYPE_CHECKING:
    from pathlib import Path

    from _pytest.logging import LogCaptureFixture
    from _pytest.tmpdir import TempPathFactory


@pytest.fixture
def quad_plane() -> pv.PolyData:
    """Create a simple plane mesh with quad faces at z=0 (2D)."""
    plane = pv.Plane(i_resolution=2, j_resolution=2)
    assert not plane.is_all_triangles
    return plane


@pytest.fixture
def quad_surface() -> pv.PolyData:
    """Create a 3D surface mesh with quad faces (not at z=0)."""
    plane = pv.Plane(i_resolution=2, j_resolution=2, direction=(1, 1, 1))
    assert not plane.is_all_triangles
    return plane


@pytest.fixture
def triangular_sphere() -> pv.PolyData:
    """Create a triangular sphere mesh."""
    sphere = pv.Sphere()
    assert sphere.is_all_triangles
    return sphere


@pytest.fixture
def quad_mesh_file(tmp_path_factory: TempPathFactory) -> Path:
    """Create a temporary mesh file with quad faces using meshio-compatible format."""
    import meshio

    tmp_dir = tmp_path_factory.mktemp("quad_mesh")
    mesh_path = tmp_dir / "quad_plane.msh"
    points = np.array(
        [
            [0.0, 0.0, 1.0],
            [1.0, 0.0, 1.0],
            [1.0, 1.0, 1.0],
            [0.0, 1.0, 1.0],
            [2.0, 0.0, 1.0],
            [2.0, 1.0, 1.0],
        ],
    )
    cells = [("quad", np.array([[0, 1, 2, 3], [1, 4, 5, 2]]))]
    mesh = meshio.Mesh(points, cells)
    mesh.write(mesh_path)
    return mesh_path


@pytest.fixture
def mixed_cells_mesh_file(tmp_path_factory: TempPathFactory) -> Path:
    """Create mesh file with quads AND non-surface cells (edges)."""
    import meshio

    tmp_dir = tmp_path_factory.mktemp("mixed_mesh")
    mesh_path = tmp_dir / "mixed.vtk"
    # Create a 3x3 grid of quads (9 quads = 18 triangles after triangulation)
    points = np.array([[i, j, 1.0] for j in range(4) for i in range(4)], dtype=float)

    quads = []
    for j in range(3):
        for i in range(3):
            p0 = j * 4 + i
            p1 = p0 + 1
            p2 = p1 + 4
            p3 = p0 + 4
            quads.append([p0, p1, p2, p3])
    quads = np.array(quads)

    cells = [
        ("quad", quads),
        ("line", np.array([[0, 1], [1, 2]])),  # Non-surface cells
    ]
    meshio.Mesh(points, cells).write(mesh_path)
    return mesh_path


@pytest.fixture
def no_surface_cells_mesh_file(tmp_path_factory: TempPathFactory) -> Path:
    """Create mesh file with ONLY non-surface cells (lines)."""
    import meshio

    tmp_dir = tmp_path_factory.mktemp("no_surface")
    mesh_path = tmp_dir / "lines_only.vtk"
    points = np.array([[0, 0, 0], [1, 0, 0], [2, 0, 0]], dtype=float)
    cells = [("line", np.array([[0, 1], [1, 2]]))]
    meshio.Mesh(points, cells).write(mesh_path)
    return mesh_path


@pytest.fixture
def quad_2d_mesh_file(tmp_path_factory: TempPathFactory) -> Path:
    """Create mesh file with 2D quads (z=0) for mmg2d triangulation path."""
    import meshio

    tmp_dir = tmp_path_factory.mktemp("quad_2d")
    mesh_path = tmp_dir / "quad_2d.vtk"
    points = np.array([[i, j, 0.0] for j in range(4) for i in range(4)], dtype=float)
    quads = []
    for j in range(3):
        for i in range(3):
            p0 = j * 4 + i
            p1 = p0 + 1
            p2 = p1 + 4
            p3 = p0 + 4
            quads.append([p0, p1, p2, p3])
    quads = np.array(quads)
    meshio.Mesh(points, [("quad", quads)]).write(mesh_path)
    return mesh_path


class TestPyVistaTriangulation:
    """Tests for PyVista mesh triangulation."""

    def test_quad_mesh_is_triangulated_2d(self, quad_plane: pv.PolyData) -> None:
        """Test that 2D quad meshes are automatically triangulated."""
        mesh = Mesh(quad_plane)
        assert mesh.kind == MeshKind.TRIANGULAR_2D
        triangles = mesh.get_triangles()
        assert triangles.shape[1] == 3
        assert len(triangles) > 0

    def test_quad_mesh_is_triangulated_surface(self, quad_surface: pv.PolyData) -> None:
        """Test that 3D surface quad meshes are automatically triangulated."""
        mesh = Mesh(quad_surface)
        assert mesh.kind == MeshKind.TRIANGULAR_SURFACE
        triangles = mesh.get_triangles()
        assert triangles.shape[1] == 3
        assert len(triangles) > 0

    def test_triangular_mesh_unchanged(self, triangular_sphere: pv.PolyData) -> None:
        """Test that already triangular meshes are not modified."""
        original_n_cells = triangular_sphere.n_cells
        mesh = Mesh(triangular_sphere)
        assert mesh.kind == MeshKind.TRIANGULAR_SURFACE
        triangles = mesh.get_triangles()
        assert len(triangles) == original_n_cells

    def test_warning_issued_on_triangulation(
        self,
        quad_plane: pv.PolyData,
        caplog: LogCaptureFixture,
    ) -> None:
        """Test that a warning is issued when triangulating."""
        with caplog.at_level(logging.WARNING, logger="mmgpy"):
            Mesh(quad_plane)
        assert "non-triangular elements" in caplog.text
        assert "quads" in caplog.text.lower()

    def test_no_warning_for_triangular_mesh(
        self,
        triangular_sphere: pv.PolyData,
        caplog: LogCaptureFixture,
    ) -> None:
        """Test that no warning is issued for triangular meshes."""
        with caplog.at_level(logging.WARNING, logger="mmgpy"):
            Mesh(triangular_sphere)
        assert "non-triangular" not in caplog.text


class TestFileTriangulation:
    """Tests for file-based mesh triangulation."""

    def test_quad_file_is_triangulated(self, quad_mesh_file: Path) -> None:
        """Test that quad meshes loaded from files are triangulated."""
        mesh = mmgpy.read(quad_mesh_file)
        assert mesh.kind == MeshKind.TRIANGULAR_SURFACE
        triangles = mesh.get_triangles()
        assert triangles.shape[1] == 3
        assert len(triangles) > 0

    def test_warning_issued_on_file_triangulation(
        self,
        quad_mesh_file: Path,
        caplog: LogCaptureFixture,
    ) -> None:
        """Test that a warning is issued when triangulating from file."""
        with caplog.at_level(logging.WARNING, logger="mmgpy"):
            mmgpy.read(quad_mesh_file)
        assert "non-triangular elements" in caplog.text

    def test_mixed_cells_mesh_triangulated(self, mixed_cells_mesh_file: Path) -> None:
        """Test mesh with mixed surface and non-surface cells is triangulated."""
        mesh = mmgpy.read(mixed_cells_mesh_file)
        triangles = mesh.get_triangles()
        assert triangles.shape[1] == 3
        assert len(triangles) == 18  # 9 quads become 18 triangles

    def test_no_surface_cells_raises_error(
        self,
        no_surface_cells_mesh_file: Path,
    ) -> None:
        """Test that mesh with no surface cells raises ValueError."""
        with pytest.raises(ValueError, match="Cannot determine mesh kind"):
            mmgpy.read(no_surface_cells_mesh_file)

    def test_meshio_to_pyvista_no_surface_cells(self) -> None:
        """Test _meshio_to_pyvista_polydata raises error when no surface cells."""
        import meshio

        from mmgpy._io import _meshio_to_pyvista_polydata

        # Create mesh with only line cells (no surface cells)
        points = np.array([[0, 0, 0], [1, 0, 0], [2, 0, 0]], dtype=float)
        mesh = meshio.Mesh(points, [("line", np.array([[0, 1], [1, 2]]))])
        with pytest.raises(ValueError, match="No surface cells"):
            _meshio_to_pyvista_polydata(mesh)

    def test_2d_quad_file_is_triangulated(self, quad_2d_mesh_file: Path) -> None:
        """Test that 2D quad meshes from files are triangulated via mmg2d path."""
        mesh = mmgpy.read(quad_2d_mesh_file)
        assert mesh.kind == MeshKind.TRIANGULAR_2D
        triangles = mesh.get_triangles()
        assert triangles.shape[1] == 3
        assert len(triangles) == 18  # 9 quads become 18 triangles

    def test_triangulate_if_needed_empty_mesh(self) -> None:
        """Test _triangulate_if_needed handles empty mesh without error."""
        from mmgpy._pyvista import _triangulate_if_needed

        empty = pv.PolyData()
        result, was_triangulated = _triangulate_if_needed(empty)
        assert result.n_cells == 0
        assert was_triangulated is False


class TestRemeshingWithTriangulation:
    """Tests for remeshing after triangulation."""

    def test_remesh_triangulated_mesh(self, quad_plane: pv.PolyData) -> None:
        """Test that remeshing works after triangulation."""
        mesh = Mesh(quad_plane)
        result = mesh.remesh(hmax=0.5, verbose=-1, progress=False)
        assert result.success
        assert result.vertices_after > 0
        assert result.triangles_after > 0

    def test_remesh_preserves_bounds(self, quad_plane: pv.PolyData) -> None:
        """Test that remeshing preserves approximate mesh bounds."""
        original_bounds = quad_plane.bounds
        mesh = Mesh(quad_plane)
        mesh.remesh(hmax=0.3, verbose=-1, progress=False)
        new_bounds = mesh.get_bounds()
        min_pt, max_pt = new_bounds
        assert np.allclose(min_pt[0], original_bounds[0], rtol=0.1)
        assert np.allclose(max_pt[0], original_bounds[1], rtol=0.1)


class TestTriangulationCorrectness:
    """Tests for correctness of triangulation."""

    def test_quad_becomes_two_triangles(self) -> None:
        """Test that each quad is split into two triangles."""
        plane = pv.Plane(i_resolution=1, j_resolution=1)
        n_quads = plane.n_cells
        mesh = Mesh(plane)
        triangles = mesh.get_triangles()
        assert len(triangles) == n_quads * 2

    def test_vertex_count_preserved(self, quad_plane: pv.PolyData) -> None:
        """Test that vertex count is preserved during triangulation."""
        original_n_points = quad_plane.n_points
        mesh = Mesh(quad_plane)
        vertices = mesh.get_vertices()
        assert len(vertices) == original_n_points

    def test_triangulated_mesh_is_valid(self, quad_plane: pv.PolyData) -> None:
        """Test that triangulated mesh passes validation."""
        mesh = Mesh(quad_plane)
        assert mesh.validate()


class TestEdgeCases:
    """Tests for edge cases in triangulation."""

    def test_empty_mesh_no_crash(self) -> None:
        """Test that empty mesh handling doesn't crash."""
        empty = pv.PolyData()
        with pytest.raises(ValueError, match=r"No surface cells|no faces"):
            Mesh(empty)

    def test_mixed_triangles_and_quads(self) -> None:
        """Test mesh with mixed triangle and quad cells."""
        tri_points = np.array(
            [
                [0.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [0.5, 1.0, 0.0],
                [2.0, 0.0, 0.0],
                [2.0, 1.0, 0.0],
                [1.0, 1.0, 0.0],
            ],
        )
        faces = np.array([3, 0, 1, 2, 4, 1, 3, 4, 5])
        mixed = pv.PolyData(tri_points, faces=faces)
        mesh = Mesh(mixed)
        triangles = mesh.get_triangles()
        assert triangles.shape[1] == 3
        assert len(triangles) >= 2

    def test_2d_quad_mesh(self) -> None:
        """Test that 2D quad meshes are triangulated correctly."""
        points = np.array(
            [
                [0.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [1.0, 1.0, 0.0],
                [0.0, 1.0, 0.0],
            ],
        )
        faces = np.array([4, 0, 1, 2, 3])
        quad_2d = pv.PolyData(points, faces=faces)
        mesh = Mesh(quad_2d)
        assert mesh.kind == MeshKind.TRIANGULAR_2D
        triangles = mesh.get_triangles()
        assert len(triangles) == 2
