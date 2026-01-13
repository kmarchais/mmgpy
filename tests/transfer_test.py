"""Tests for field transfer during remeshing."""

import numpy as np
import pytest
from scipy.spatial import Delaunay

from mmgpy import Mesh


@pytest.fixture
def dense_cube_mesh() -> tuple[np.ndarray, np.ndarray]:
    """Create a dense tetrahedral mesh of a unit cube."""
    import pyvista as pv

    resolution = 6
    x = np.linspace(0, 1, resolution)
    y = np.linspace(0, 1, resolution)
    z = np.linspace(0, 1, resolution)
    xx, yy, zz = np.meshgrid(x, y, z, indexing="ij")
    points = np.column_stack([xx.ravel(), yy.ravel(), zz.ravel()])
    cloud = pv.PolyData(points)
    tetra = cloud.delaunay_3d()
    vertices = np.array(tetra.points, dtype=np.float64)
    elements = tetra.cells_dict[pv.CellType.TETRA].astype(np.int32)
    return vertices, elements


@pytest.fixture
def dense_square_mesh() -> tuple[np.ndarray, np.ndarray]:
    """Create a dense triangular mesh of a unit square."""
    resolution = 10
    x = np.linspace(0, 1, resolution)
    y = np.linspace(0, 1, resolution)
    xx, yy = np.meshgrid(x, y)
    points = np.column_stack([xx.ravel(), yy.ravel()])
    tri = Delaunay(points)
    return points.astype(np.float64), tri.simplices.astype(np.int32)


class TestUserFields:
    """Tests for user field storage on Mesh class."""

    def test_set_get_scalar_field(
        self,
        dense_cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test setting and getting a scalar field."""
        vertices, elements = dense_cube_mesh
        mesh = Mesh(vertices, elements)

        field = np.random.default_rng(42).random(len(vertices))
        mesh.set_user_field("temperature", field)

        result = mesh.get_user_field("temperature")
        np.testing.assert_array_equal(result, field)

    def test_set_get_vector_field(
        self,
        dense_cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test setting and getting a vector field."""
        vertices, elements = dense_cube_mesh
        mesh = Mesh(vertices, elements)

        field = np.random.default_rng(42).random((len(vertices), 3))
        mesh.set_user_field("velocity", field)

        result = mesh.get_user_field("velocity")
        np.testing.assert_array_equal(result, field)

    def test_get_all_user_fields(
        self,
        dense_cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test getting all user fields."""
        vertices, elements = dense_cube_mesh
        mesh = Mesh(vertices, elements)

        temp = np.random.default_rng(42).random(len(vertices))
        velocity = np.random.default_rng(43).random((len(vertices), 3))

        mesh.set_user_field("temperature", temp)
        mesh.set_user_field("velocity", velocity)

        fields = mesh.get_user_fields()
        assert "temperature" in fields
        assert "velocity" in fields
        np.testing.assert_array_equal(fields["temperature"], temp)
        np.testing.assert_array_equal(fields["velocity"], velocity)

    def test_has_user_field(
        self,
        dense_cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test checking for field existence."""
        vertices, elements = dense_cube_mesh
        mesh = Mesh(vertices, elements)

        assert not mesh.has_user_field("temperature")
        mesh.set_user_field("temperature", np.ones(len(vertices)))
        assert mesh.has_user_field("temperature")

    def test_clear_user_fields(
        self,
        dense_cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test clearing all user fields."""
        vertices, elements = dense_cube_mesh
        mesh = Mesh(vertices, elements)

        mesh.set_user_field("temperature", np.ones(len(vertices)))
        mesh.set_user_field("velocity", np.ones((len(vertices), 3)))
        mesh.clear_user_fields()

        assert not mesh.has_user_field("temperature")
        assert not mesh.has_user_field("velocity")
        assert len(mesh.get_user_fields()) == 0

    def test_get_missing_field_raises(
        self,
        dense_cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test that getting a missing field raises KeyError."""
        vertices, elements = dense_cube_mesh
        mesh = Mesh(vertices, elements)

        with pytest.raises(KeyError, match="not found"):
            mesh.get_user_field("nonexistent")

    def test_set_wrong_size_field_raises(
        self,
        dense_cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test that setting a field with wrong size raises ValueError."""
        vertices, elements = dense_cube_mesh
        mesh = Mesh(vertices, elements)

        with pytest.raises(ValueError, match="values but mesh has"):
            mesh.set_user_field("bad", np.ones(10))


class TestFieldTransfer:
    """Tests for field transfer during remeshing."""

    def test_transfer_linear_scalar_field_3d(
        self,
        dense_cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test that linear scalar fields are transferred accurately."""
        vertices, elements = dense_cube_mesh
        mesh = Mesh(vertices, elements)

        linear_field = vertices[:, 0] + 2 * vertices[:, 1] + 3 * vertices[:, 2]
        mesh.set_user_field("linear", linear_field)

        mesh.remesh(hmax=0.3, transfer_fields=True, progress=False)

        new_vertices = mesh.get_vertices()
        expected = new_vertices[:, 0] + 2 * new_vertices[:, 1] + 3 * new_vertices[:, 2]
        actual = mesh.get_user_field("linear")

        np.testing.assert_allclose(actual, expected, rtol=1e-5, atol=1e-14)

    def test_transfer_linear_scalar_field_2d(
        self,
        dense_square_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test that linear scalar fields are transferred accurately in 2D."""
        vertices, triangles = dense_square_mesh
        mesh = Mesh(vertices, triangles)

        linear_field = vertices[:, 0] + 2 * vertices[:, 1]
        mesh.set_user_field("linear", linear_field)

        mesh.remesh(hmax=0.2, transfer_fields=True, progress=False)

        new_vertices = mesh.get_vertices()
        expected = new_vertices[:, 0] + 2 * new_vertices[:, 1]
        actual = mesh.get_user_field("linear")

        np.testing.assert_allclose(actual, expected, rtol=1e-5, atol=1e-14)

    def test_transfer_vector_field(
        self,
        dense_cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test that vector fields are transferred correctly."""
        vertices, elements = dense_cube_mesh
        mesh = Mesh(vertices, elements)

        velocity = np.column_stack(
            [vertices[:, 0], vertices[:, 1] * 2, vertices[:, 2] * 3],
        )
        mesh.set_user_field("velocity", velocity)

        mesh.remesh(hmax=0.3, transfer_fields=True, progress=False)

        new_vertices = mesh.get_vertices()
        expected = np.column_stack(
            [new_vertices[:, 0], new_vertices[:, 1] * 2, new_vertices[:, 2] * 3],
        )
        actual = mesh.get_user_field("velocity")

        np.testing.assert_allclose(actual, expected, rtol=1e-5, atol=1e-14)

    def test_transfer_multiple_fields(
        self,
        dense_cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test transferring multiple fields at once."""
        vertices, elements = dense_cube_mesh
        mesh = Mesh(vertices, elements)

        temp = vertices[:, 0] + vertices[:, 1]
        pressure = vertices[:, 2] * 2
        mesh.set_user_field("temperature", temp)
        mesh.set_user_field("pressure", pressure)

        mesh.remesh(hmax=0.3, transfer_fields=True, progress=False)

        new_vertices = mesh.get_vertices()
        np.testing.assert_allclose(
            mesh.get_user_field("temperature"),
            new_vertices[:, 0] + new_vertices[:, 1],
            rtol=1e-5,
            atol=1e-14,
        )
        np.testing.assert_allclose(
            mesh.get_user_field("pressure"),
            new_vertices[:, 2] * 2,
            rtol=1e-5,
            atol=1e-14,
        )

    def test_transfer_selected_fields(
        self,
        dense_cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test transferring only selected fields."""
        vertices, elements = dense_cube_mesh
        mesh = Mesh(vertices, elements)

        temp = vertices[:, 0]
        pressure = vertices[:, 1]
        mesh.set_user_field("temperature", temp)
        mesh.set_user_field("pressure", pressure)

        mesh.remesh(hmax=0.3, transfer_fields=["temperature"], progress=False)

        assert mesh.has_user_field("temperature")
        assert not mesh.has_user_field("pressure")

    def test_transfer_missing_field_raises(
        self,
        dense_cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test that requesting transfer of missing field raises KeyError."""
        vertices, elements = dense_cube_mesh
        mesh = Mesh(vertices, elements)

        with pytest.raises(KeyError, match="not found"):
            mesh.remesh(hmax=0.3, transfer_fields=["nonexistent"], progress=False)

    def test_invalid_interpolation_method_raises(
        self,
        dense_cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test that invalid interpolation method raises ValueError."""
        vertices, elements = dense_cube_mesh
        mesh = Mesh(vertices, elements)

        with pytest.raises(ValueError, match="Invalid interpolation method"):
            mesh.remesh(hmax=0.3, interpolation="invalid", progress=False)

    def test_no_transfer_by_default(
        self,
        dense_cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test that fields are cleared by default (not transferred)."""
        vertices, elements = dense_cube_mesh
        mesh = Mesh(vertices, elements)

        mesh.set_user_field("temperature", np.ones(len(vertices)))

        mesh.remesh(hmax=0.3, progress=False)

        # Fields should be cleared when transfer_fields=False (default)
        assert not mesh.has_user_field("temperature")
        assert len(mesh.get_user_fields()) == 0

    def test_transfer_with_nearest_interpolation(
        self,
        dense_cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test nearest-neighbor interpolation."""
        vertices, elements = dense_cube_mesh
        mesh = Mesh(vertices, elements)

        field = np.arange(len(vertices), dtype=np.float64)
        mesh.set_user_field("index", field)

        mesh.remesh(
            hmax=0.3,
            transfer_fields=True,
            interpolation="nearest",
            progress=False,
        )

        result = mesh.get_user_field("index")
        assert len(result) == len(mesh.get_vertices())


class TestInterpolateFieldModule:
    """Tests for the _transfer module functions directly."""

    def test_interpolate_scalar_inside_tetra(self) -> None:
        """Test interpolation at points inside tetrahedra."""
        from mmgpy._transfer import interpolate_field

        vertices = np.array(
            [
                [0.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [0.0, 1.0, 0.0],
                [0.0, 0.0, 1.0],
            ],
            dtype=np.float64,
        )
        elements = np.array([[0, 1, 2, 3]], dtype=np.int32)

        field = vertices[:, 0] + 2 * vertices[:, 1] + 3 * vertices[:, 2]

        target = np.array([[0.25, 0.25, 0.25]], dtype=np.float64)

        result = interpolate_field(vertices, elements, target, field)
        expected = target[0, 0] + 2 * target[0, 1] + 3 * target[0, 2]

        np.testing.assert_allclose(result, expected, rtol=1e-10)

    def test_interpolate_outside_uses_nearest(self) -> None:
        """Test that points outside mesh use nearest-neighbor."""
        from mmgpy._transfer import interpolate_field

        vertices = np.array(
            [
                [0.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [0.0, 1.0, 0.0],
                [0.0, 0.0, 1.0],
            ],
            dtype=np.float64,
        )
        elements = np.array([[0, 1, 2, 3]], dtype=np.int32)

        field = np.array([0.0, 1.0, 2.0, 3.0])

        target = np.array([[-0.1, -0.1, -0.1]], dtype=np.float64)

        result = interpolate_field(vertices, elements, target, field)

        np.testing.assert_allclose(result, 0.0, atol=1e-14)

    def test_transfer_fields_multiple(self) -> None:
        """Test transfer_fields with multiple fields."""
        from mmgpy._transfer import transfer_fields

        vertices = np.array(
            [
                [0.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [0.0, 1.0, 0.0],
                [0.0, 0.0, 1.0],
            ],
            dtype=np.float64,
        )
        elements = np.array([[0, 1, 2, 3]], dtype=np.int32)

        fields = {
            "f1": np.array([1.0, 2.0, 3.0, 4.0]),
            "f2": np.array([10.0, 20.0, 30.0, 40.0]),
        }

        target = np.array([[0.25, 0.25, 0.25]], dtype=np.float64)

        result = transfer_fields(vertices, elements, target, fields)

        assert "f1" in result
        assert "f2" in result
        r1 = np.atleast_1d(result["f1"])
        r2 = np.atleast_1d(result["f2"])
        assert len(r1) == 1
        assert len(r2) == 1


class TestFieldTransferSurface:
    """Tests for field transfer on surface meshes."""

    @pytest.mark.skip(
        reason="Surface mesh transfer requires 2D parameterization",
    )
    def test_transfer_on_surface_mesh(self) -> None:
        """Test field transfer on surface meshes.

        Note: Currently field transfer for surface meshes requires the mesh
        to have sufficient 3D variation for scipy.spatial.Delaunay to work.
        Pure surface meshes that are nearly planar will fail.
        A future enhancement would use 2D parameterization for surface meshes.
        """
        vertices = np.array(
            [
                [0.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [1.0, 1.0, 0.5],
                [0.0, 1.0, 0.5],
                [0.5, 0.5, 0.25],
            ],
            dtype=np.float64,
        )
        triangles = np.array(
            [
                [0, 1, 4],
                [1, 2, 4],
                [2, 3, 4],
                [3, 0, 4],
            ],
            dtype=np.int32,
        )
        mesh = Mesh(vertices, triangles)

        field = vertices[:, 0] + vertices[:, 1]
        mesh.set_user_field("test", field)

        mesh.remesh(hmax=0.3, transfer_fields=True, progress=False)

        new_vertices = mesh.get_vertices()
        expected = new_vertices[:, 0] + new_vertices[:, 1]
        actual = mesh.get_user_field("test")

        np.testing.assert_allclose(actual, expected, rtol=0.2, atol=1e-14)
