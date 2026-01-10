"""Tests for mesh geometry convenience methods."""

from unittest.mock import patch

import numpy as np
import numpy.testing as npt
import pytest
import pyvista as pv

from mmgpy import Mesh, MeshKind


class TestEmptyMesh:
    """Tests for edge cases with empty meshes using mocking."""

    def test_get_bounds_raises_for_empty_vertices(self) -> None:
        """Test get_bounds raises ValueError for mesh with no vertices."""
        vertices = np.array(
            [[0.0, 0.0, 0.0], [1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 1.0]],
            dtype=np.float64,
        )
        cells = np.array([[0, 1, 2, 3]], dtype=np.int32)
        mesh = Mesh(vertices, cells)

        # Mock get_vertices at class level
        with (
            patch.object(Mesh, "get_vertices", return_value=np.array([]).reshape(0, 3)),
            pytest.raises(ValueError, match="no vertices"),
        ):
            mesh.get_bounds()

    def test_get_diagonal_raises_for_empty_vertices(self) -> None:
        """Test get_diagonal raises ValueError for mesh with no vertices."""
        vertices = np.array(
            [[0.0, 0.0, 0.0], [1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 1.0]],
            dtype=np.float64,
        )
        cells = np.array([[0, 1, 2, 3]], dtype=np.int32)
        mesh = Mesh(vertices, cells)

        # Mock get_vertices at class level
        with (
            patch.object(Mesh, "get_vertices", return_value=np.array([]).reshape(0, 3)),
            pytest.raises(ValueError, match="no vertices"),
        ):
            mesh.get_diagonal()

    def test_center_of_mass_empty_tetrahedra(self) -> None:
        """Test center_of_mass falls back to vertex mean when tetrahedra are empty."""
        vertices = np.array(
            [[0.0, 0.0, 0.0], [2.0, 0.0, 0.0], [0.0, 2.0, 0.0], [0.0, 0.0, 2.0]],
            dtype=np.float64,
        )
        cells = np.array([[0, 1, 2, 3]], dtype=np.int32)
        mesh = Mesh(vertices, cells)

        # Mock get_tetrahedra at class level
        with patch.object(
            Mesh,
            "get_tetrahedra",
            return_value=np.array([]).reshape(0, 4),
        ):
            center = mesh.get_center_of_mass()
            expected = vertices.mean(axis=0)
            npt.assert_array_almost_equal(center, expected)

    def test_center_of_mass_empty_triangles(self) -> None:
        """Test center_of_mass falls back to vertex mean when triangles are empty."""
        vertices = np.array(
            [[0.0, 0.0, 0.0], [2.0, 0.0, 0.0], [0.0, 2.0, 0.5]],
            dtype=np.float64,
        )
        cells = np.array([[0, 1, 2]], dtype=np.int32)
        mesh = Mesh(vertices, cells)

        # Mock get_triangles at class level
        with patch.object(
            Mesh,
            "get_triangles",
            return_value=np.array([]).reshape(0, 3),
        ):
            center = mesh.get_center_of_mass()
            expected = vertices.mean(axis=0)
            npt.assert_array_almost_equal(center, expected)

    def test_compute_volume_empty_tetrahedra(self) -> None:
        """Test compute_volume returns 0.0 for mesh with no tetrahedra."""
        vertices = np.array(
            [[0.0, 0.0, 0.0], [1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 1.0]],
            dtype=np.float64,
        )
        cells = np.array([[0, 1, 2, 3]], dtype=np.int32)
        mesh = Mesh(vertices, cells)

        # Mock get_tetrahedra at class level
        with patch.object(
            Mesh,
            "get_tetrahedra",
            return_value=np.array([]).reshape(0, 4),
        ):
            volume = mesh.compute_volume()
            assert volume == 0.0

    def test_compute_surface_area_empty_triangles(self) -> None:
        """Test compute_surface_area returns 0.0 for mesh with no triangles."""
        vertices = np.array(
            [[0.0, 0.0, 0.0], [1.0, 0.0, 0.0], [0.0, 1.0, 0.5]],
            dtype=np.float64,
        )
        cells = np.array([[0, 1, 2]], dtype=np.int32)
        mesh = Mesh(vertices, cells)

        # Mock get_triangles at class level
        with patch.object(
            Mesh,
            "get_triangles",
            return_value=np.array([]).reshape(0, 3),
        ):
            area = mesh.compute_surface_area()
            assert area == 0.0


class TestGetBounds:
    """Tests for get_bounds() method."""

    def test_bounds_tetrahedral_mesh(self) -> None:
        """Test bounds for a tetrahedral mesh."""
        vertices = np.array(
            [
                [0.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [0.0, 1.0, 0.0],
                [0.0, 0.0, 1.0],
            ],
            dtype=np.float64,
        )
        cells = np.array([[0, 1, 2, 3]], dtype=np.int32)
        mesh = Mesh(vertices, cells)

        min_pt, max_pt = mesh.get_bounds()

        npt.assert_array_almost_equal(min_pt, [0.0, 0.0, 0.0])
        npt.assert_array_almost_equal(max_pt, [1.0, 1.0, 1.0])

    def test_bounds_2d_mesh(self) -> None:
        """Test bounds for a 2D mesh."""
        vertices = np.array(
            [
                [0.0, 0.0],
                [2.0, 0.0],
                [1.0, 3.0],
            ],
            dtype=np.float64,
        )
        cells = np.array([[0, 1, 2]], dtype=np.int32)
        mesh = Mesh(vertices, cells)

        min_pt, max_pt = mesh.get_bounds()

        npt.assert_array_almost_equal(min_pt, [0.0, 0.0])
        npt.assert_array_almost_equal(max_pt, [2.0, 3.0])

    def test_bounds_surface_mesh(self) -> None:
        """Test bounds for a surface mesh."""
        vertices = np.array(
            [
                [0.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [0.5, 1.0, 0.5],
            ],
            dtype=np.float64,
        )
        cells = np.array([[0, 1, 2]], dtype=np.int32)
        mesh = Mesh(vertices, cells)

        min_pt, max_pt = mesh.get_bounds()

        npt.assert_array_almost_equal(min_pt, [0.0, 0.0, 0.0])
        npt.assert_array_almost_equal(max_pt, [1.0, 1.0, 0.5])


class TestGetDiagonal:
    """Tests for get_diagonal() method."""

    def test_diagonal_unit_cube(self) -> None:
        """Test diagonal for a unit cube."""
        x = np.linspace(0, 1, 3)
        xx, yy, zz = np.meshgrid(x, x, x, indexing="ij")
        points = np.column_stack([xx.ravel(), yy.ravel(), zz.ravel()])
        cloud = pv.PolyData(points)
        tetra = cloud.delaunay_3d()
        mesh = Mesh(tetra)

        diagonal = mesh.get_diagonal()

        expected = np.sqrt(3)
        assert abs(diagonal - expected) < 0.01

    def test_diagonal_2d(self) -> None:
        """Test diagonal for a 2D mesh."""
        vertices = np.array(
            [
                [0.0, 0.0],
                [3.0, 0.0],
                [0.0, 4.0],
            ],
            dtype=np.float64,
        )
        cells = np.array([[0, 1, 2]], dtype=np.int32)
        mesh = Mesh(vertices, cells)

        diagonal = mesh.get_diagonal()

        expected = 5.0
        assert abs(diagonal - expected) < 0.01


class TestGetCenterOfMass:
    """Tests for get_center_of_mass() method."""

    def test_center_of_mass_symmetric_tetrahedron(self) -> None:
        """Test centroid for a symmetric tetrahedron."""
        vertices = np.array(
            [
                [0.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [0.5, np.sqrt(3) / 2, 0.0],
                [0.5, np.sqrt(3) / 6, np.sqrt(2 / 3)],
            ],
            dtype=np.float64,
        )
        cells = np.array([[0, 1, 2, 3]], dtype=np.int32)
        mesh = Mesh(vertices, cells)

        center = mesh.get_center_of_mass()

        expected = vertices.mean(axis=0)
        npt.assert_array_almost_equal(center, expected)

    def test_center_of_mass_2d_triangle(self) -> None:
        """Test centroid for a 2D triangle."""
        vertices = np.array(
            [
                [0.0, 0.0],
                [3.0, 0.0],
                [0.0, 3.0],
            ],
            dtype=np.float64,
        )
        cells = np.array([[0, 1, 2]], dtype=np.int32)
        mesh = Mesh(vertices, cells)

        center = mesh.get_center_of_mass()

        expected = np.array([1.0, 1.0])
        npt.assert_array_almost_equal(center, expected)

    def test_center_of_mass_surface_mesh(self) -> None:
        """Test centroid for a surface mesh (single triangle)."""
        vertices = np.array(
            [
                [0.0, 0.0, 0.0],
                [3.0, 0.0, 0.0],
                [0.0, 3.0, 1.0],
            ],
            dtype=np.float64,
        )
        cells = np.array([[0, 1, 2]], dtype=np.int32)
        mesh = Mesh(vertices, cells)

        center = mesh.get_center_of_mass()

        expected = np.array([1.0, 1.0, 1.0 / 3.0])
        npt.assert_array_almost_equal(center, expected)

    def test_center_of_mass_cube_mesh(self) -> None:
        """Test centroid for a cube mesh is at center."""
        x = np.linspace(0, 2, 3)
        xx, yy, zz = np.meshgrid(x, x, x, indexing="ij")
        points = np.column_stack([xx.ravel(), yy.ravel(), zz.ravel()])
        cloud = pv.PolyData(points)
        tetra = cloud.delaunay_3d()
        mesh = Mesh(tetra)

        center = mesh.get_center_of_mass()

        expected = np.array([1.0, 1.0, 1.0])
        npt.assert_array_almost_equal(center, expected, decimal=1)


class TestComputeVolume:
    """Tests for compute_volume() method."""

    def test_volume_unit_tetrahedron(self) -> None:
        """Test volume of a single tetrahedron."""
        vertices = np.array(
            [
                [0.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [0.0, 1.0, 0.0],
                [0.0, 0.0, 1.0],
            ],
            dtype=np.float64,
        )
        cells = np.array([[0, 1, 2, 3]], dtype=np.int32)
        mesh = Mesh(vertices, cells)

        volume = mesh.compute_volume()

        expected = 1.0 / 6.0
        assert abs(volume - expected) < 0.01

    def test_volume_unit_cube(self) -> None:
        """Test volume of a cube mesh is approximately 1.0."""
        x = np.linspace(0, 1, 3)
        xx, yy, zz = np.meshgrid(x, x, x, indexing="ij")
        points = np.column_stack([xx.ravel(), yy.ravel(), zz.ravel()])
        cloud = pv.PolyData(points)
        tetra = cloud.delaunay_3d()
        mesh = Mesh(tetra)

        volume = mesh.compute_volume()

        assert abs(volume - 1.0) < 0.01

    def test_volume_scaled_cube(self) -> None:
        """Test volume of a 2x2x2 cube is approximately 8.0."""
        x = np.linspace(0, 2, 4)
        xx, yy, zz = np.meshgrid(x, x, x, indexing="ij")
        points = np.column_stack([xx.ravel(), yy.ravel(), zz.ravel()])
        cloud = pv.PolyData(points)
        tetra = cloud.delaunay_3d()
        mesh = Mesh(tetra)

        volume = mesh.compute_volume()

        assert abs(volume - 8.0) < 0.1

    def test_volume_raises_for_2d(self) -> None:
        """Test compute_volume raises for 2D mesh."""
        vertices = np.array(
            [
                [0.0, 0.0],
                [1.0, 0.0],
                [0.5, 1.0],
            ],
            dtype=np.float64,
        )
        cells = np.array([[0, 1, 2]], dtype=np.int32)
        mesh = Mesh(vertices, cells)

        with pytest.raises(TypeError, match="only available for TETRAHEDRAL"):
            mesh.compute_volume()

    def test_volume_raises_for_surface(self) -> None:
        """Test compute_volume raises for surface mesh."""
        vertices = np.array(
            [
                [0.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [0.5, 1.0, 0.5],
            ],
            dtype=np.float64,
        )
        cells = np.array([[0, 1, 2]], dtype=np.int32)
        mesh = Mesh(vertices, cells)

        with pytest.raises(TypeError, match="only available for TETRAHEDRAL"):
            mesh.compute_volume()


class TestComputeSurfaceArea:
    """Tests for compute_surface_area() method."""

    def test_surface_area_single_triangle(self) -> None:
        """Test area of a single triangle."""
        vertices = np.array(
            [
                [0.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [0.0, 1.0, 0.0],
            ],
            dtype=np.float64,
        )
        cells = np.array([[0, 1, 2]], dtype=np.int32)
        mesh = Mesh(vertices, cells)

        area = mesh.compute_surface_area()

        expected = 0.5
        assert abs(area - expected) < 0.01

    def test_surface_area_2d_triangle(self) -> None:
        """Test area of a 2D triangle."""
        vertices = np.array(
            [
                [0.0, 0.0],
                [2.0, 0.0],
                [0.0, 2.0],
            ],
            dtype=np.float64,
        )
        cells = np.array([[0, 1, 2]], dtype=np.int32)
        mesh = Mesh(vertices, cells)

        area = mesh.compute_surface_area()

        expected = 2.0
        assert abs(area - expected) < 0.01

    def test_surface_area_cube_boundary(self) -> None:
        """Test surface area of a cube's boundary faces after remeshing."""
        x = np.linspace(0, 1, 3)
        xx, yy, zz = np.meshgrid(x, x, x, indexing="ij")
        points = np.column_stack([xx.ravel(), yy.ravel(), zz.ravel()])
        cloud = pv.PolyData(points)
        tetra = cloud.delaunay_3d()
        mesh = Mesh(tetra)
        mesh.remesh(hmax=0.5, verbose=-1)

        area = mesh.compute_surface_area()

        expected = 6.0
        assert abs(area - expected) < 0.5

    def test_surface_area_sphere_approximation(self) -> None:
        """Test surface area of a sphere approximation (should be close to 4*pi)."""
        sphere = pv.Sphere(radius=1.0, theta_resolution=30, phi_resolution=30)
        mesh = Mesh(sphere)

        area = mesh.compute_surface_area()

        expected = 4 * np.pi
        assert abs(area - expected) / expected < 0.05

    def test_tetrahedral_mesh_boundary_area_vs_volume(self) -> None:
        """Test surface area is consistent with volume for tetrahedral mesh.

        For a unit cube, volume=1 and surface_area=6. This test verifies
        that compute_surface_area returns the boundary area (not internal
        faces) by checking the ratio is approximately 6:1.

        Note: remesh() is needed to populate boundary triangles from tetrahedra.
        """
        x = np.linspace(0, 1, 5)
        xx, yy, zz = np.meshgrid(x, x, x, indexing="ij")
        points = np.column_stack([xx.ravel(), yy.ravel(), zz.ravel()])
        cloud = pv.PolyData(points)
        tetra = cloud.delaunay_3d()
        mesh = Mesh(tetra)

        # Remesh to populate boundary triangles
        mesh.remesh(hmax=0.5, verbose=-1)

        volume = mesh.compute_volume()
        area = mesh.compute_surface_area()

        # For a unit cube: volume=1, surface_area=6
        # The ratio should be approximately 6
        ratio = area / volume
        expected_ratio = 6.0
        assert abs(ratio - expected_ratio) < 0.5


class TestIntegration:
    """Integration tests for geometry methods."""

    def test_all_methods_work_on_remeshed_cube(self) -> None:
        """Test all geometry methods work after remeshing."""
        x = np.linspace(0, 1, 4)
        xx, yy, zz = np.meshgrid(x, x, x, indexing="ij")
        points = np.column_stack([xx.ravel(), yy.ravel(), zz.ravel()])
        cloud = pv.PolyData(points)
        tetra = cloud.delaunay_3d()
        mesh = Mesh(tetra)

        mesh.remesh(hmax=0.3, verbose=-1)

        min_pt, max_pt = mesh.get_bounds()
        center = mesh.get_center_of_mass()
        volume = mesh.compute_volume()
        area = mesh.compute_surface_area()
        diagonal = mesh.get_diagonal()

        npt.assert_array_almost_equal(min_pt, [0.0, 0.0, 0.0], decimal=1)
        npt.assert_array_almost_equal(max_pt, [1.0, 1.0, 1.0], decimal=1)
        npt.assert_array_almost_equal(center, [0.5, 0.5, 0.5], decimal=1)
        assert abs(volume - 1.0) < 0.1
        assert abs(area - 6.0) < 0.5
        assert abs(diagonal - np.sqrt(3)) < 0.1

    def test_mesh_kind_preservation(self) -> None:
        """Test that mesh kind is correctly determined for all types."""
        tetra_verts = np.array(
            [[0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1]],
            dtype=np.float64,
        )
        tetra_cells = np.array([[0, 1, 2, 3]], dtype=np.int32)
        tetra_mesh = Mesh(tetra_verts, tetra_cells)
        assert tetra_mesh.kind == MeshKind.TETRAHEDRAL

        tri_2d_verts = np.array([[0, 0], [1, 0], [0.5, 1]], dtype=np.float64)
        tri_cells = np.array([[0, 1, 2]], dtype=np.int32)
        tri_2d_mesh = Mesh(tri_2d_verts, tri_cells)
        assert tri_2d_mesh.kind == MeshKind.TRIANGULAR_2D

        surf_verts = np.array([[0, 0, 0], [1, 0, 0], [0.5, 1, 0.5]], dtype=np.float64)
        surf_mesh = Mesh(surf_verts, tri_cells)
        assert surf_mesh.kind == MeshKind.TRIANGULAR_SURFACE
