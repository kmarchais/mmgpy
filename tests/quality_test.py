"""Tests for mesh quality computation and array contiguity validation."""

import numpy as np
import numpy.testing as npt
import pytest

from mmgpy._mmgpy import MmgMesh2D, MmgMesh3D, MmgMeshS


class TestElementQuality3D:
    """Tests for 3D element quality computation."""

    def test_get_element_quality(
        self,
        cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test getting element quality for MmgMesh3D."""
        vertices, elements = cube_mesh

        mesh = MmgMesh3D()
        mesh.set_mesh_size(vertices=len(vertices), tetrahedra=len(elements))
        mesh.set_vertices(vertices)
        mesh.set_tetrahedra(elements)

        for i in range(len(elements)):
            quality = mesh.get_element_quality(i)
            assert isinstance(quality, float)
            assert quality >= 0.0

    def test_get_element_qualities(
        self,
        cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test getting all element qualities for MmgMesh3D."""
        vertices, elements = cube_mesh

        mesh = MmgMesh3D()
        mesh.set_mesh_size(vertices=len(vertices), tetrahedra=len(elements))
        mesh.set_vertices(vertices)
        mesh.set_tetrahedra(elements)

        qualities = mesh.get_element_qualities()
        assert qualities.shape == (len(elements),)
        assert qualities.dtype == np.float64
        assert np.all(qualities >= 0.0)

    def test_invalid_index(self, cube_mesh: tuple[np.ndarray, np.ndarray]) -> None:
        """Test that invalid index raises error."""
        vertices, elements = cube_mesh

        mesh = MmgMesh3D()
        mesh.set_mesh_size(vertices=len(vertices), tetrahedra=len(elements))
        mesh.set_vertices(vertices)
        mesh.set_tetrahedra(elements)

        with pytest.raises(RuntimeError, match="out of range"):
            mesh.get_element_quality(100)


class TestElementQuality2D:
    """Tests for 2D element quality computation."""

    def test_get_element_quality(
        self,
        square_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test getting element quality for MmgMesh2D."""
        vertices, triangles = square_mesh

        mesh = MmgMesh2D()
        mesh.set_mesh_size(vertices=len(vertices), triangles=len(triangles))
        mesh.set_vertices(vertices)
        mesh.set_triangles(triangles)

        for i in range(len(triangles)):
            quality = mesh.get_element_quality(i)
            assert isinstance(quality, float)
            assert quality >= 0.0

    def test_get_element_qualities(
        self,
        square_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test getting all element qualities for MmgMesh2D."""
        vertices, triangles = square_mesh

        mesh = MmgMesh2D()
        mesh.set_mesh_size(vertices=len(vertices), triangles=len(triangles))
        mesh.set_vertices(vertices)
        mesh.set_triangles(triangles)

        qualities = mesh.get_element_qualities()
        assert qualities.shape == (len(triangles),)
        assert qualities.dtype == np.float64
        assert np.all(qualities >= 0.0)


class TestElementQualitySurface:
    """Tests for surface mesh element quality computation."""

    def test_get_element_quality(
        self,
        tetrahedron_surface_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test getting element quality for MmgMeshS."""
        vertices, triangles = tetrahedron_surface_mesh

        mesh = MmgMeshS()
        mesh.set_mesh_size(vertices=len(vertices), triangles=len(triangles))
        mesh.set_vertices(vertices)
        mesh.set_triangles(triangles)

        for i in range(len(triangles)):
            quality = mesh.get_element_quality(i)
            assert isinstance(quality, float)
            assert quality >= 0.0

    def test_get_element_qualities(
        self,
        tetrahedron_surface_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test getting all element qualities for MmgMeshS."""
        vertices, triangles = tetrahedron_surface_mesh

        mesh = MmgMeshS()
        mesh.set_mesh_size(vertices=len(vertices), triangles=len(triangles))
        mesh.set_vertices(vertices)
        mesh.set_triangles(triangles)

        qualities = mesh.get_element_qualities()
        assert qualities.shape == (len(triangles),)
        assert qualities.dtype == np.float64
        assert np.all(qualities >= 0.0)


class TestCContiguityValidation:
    """Tests for C-contiguity validation."""

    def test_non_contiguous_array_rejected(self) -> None:
        """Test that non-contiguous arrays are rejected with clear error message."""
        mesh = MmgMesh3D()
        mesh.set_mesh_size(vertices=4, tetrahedra=1)

        # Create a Fortran-order (column-major) array which is not C-contiguous
        vertices_f = np.array(
            [
                [0.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [0.5, 1.0, 0.0],
                [0.5, 0.5, 1.0],
            ],
            dtype=np.float64,
            order="F",
        )

        assert not vertices_f.flags["C_CONTIGUOUS"]

        with pytest.raises(RuntimeError, match="C-contiguous"):
            mesh.set_vertices(vertices_f)

    def test_sliced_array_rejected(self) -> None:
        """Test that sliced arrays (non-contiguous) are rejected."""
        mesh = MmgMesh3D()
        mesh.set_mesh_size(vertices=4, tetrahedra=1)

        large_vertices = np.array(
            [
                [0.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [0.5, 1.0, 0.0],
                [0.5, 0.5, 1.0],
                [2.0, 0.0, 0.0],
                [2.5, 1.0, 0.0],
                [2.5, 0.5, 1.0],
                [3.0, 0.0, 0.0],
            ],
            dtype=np.float64,
        )

        # Slice every other row - this creates a non-contiguous view
        vertices_sliced = large_vertices[::2]

        assert not vertices_sliced.flags["C_CONTIGUOUS"]

        with pytest.raises(RuntimeError, match="C-contiguous"):
            mesh.set_vertices(vertices_sliced)

    def test_contiguous_copy_accepted(self) -> None:
        """Test that making a contiguous copy of non-contiguous data works."""
        mesh = MmgMesh3D()
        mesh.set_mesh_size(vertices=4, tetrahedra=1)

        # Create a Fortran-order array
        vertices_f = np.array(
            [
                [0.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [0.5, 1.0, 0.0],
                [0.5, 0.5, 1.0],
            ],
            dtype=np.float64,
            order="F",
        )

        # Make a C-contiguous copy
        vertices_c = np.ascontiguousarray(vertices_f)

        assert vertices_c.flags["C_CONTIGUOUS"]

        mesh.set_vertices(vertices_c)
        npt.assert_array_almost_equal(mesh.get_vertices(), vertices_c)
