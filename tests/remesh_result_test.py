"""Tests for RemeshResult dataclass."""

import numpy as np
import pytest

from mmgpy import Mesh, RemeshResult


def create_test_cube() -> tuple[np.ndarray, np.ndarray]:
    """Create a simple cube mesh for testing."""
    vertices = np.array(
        [
            [0.0, 0.0, 0.0],
            [1.0, 0.0, 0.0],
            [1.0, 1.0, 0.0],
            [0.0, 1.0, 0.0],
            [0.0, 0.0, 1.0],
            [1.0, 0.0, 1.0],
            [1.0, 1.0, 1.0],
            [0.0, 1.0, 1.0],
        ],
        dtype=np.float64,
    )
    elements = np.array(
        [
            [0, 1, 3, 4],
            [1, 2, 3, 6],
            [1, 4, 5, 6],
            [3, 4, 6, 7],
            [1, 3, 4, 6],
        ],
        dtype=np.int32,
    )
    return vertices, elements


def create_test_square() -> tuple[np.ndarray, np.ndarray]:
    """Create a simple 2D square mesh for testing."""
    vertices = np.array(
        [
            [0.0, 0.0],
            [1.0, 0.0],
            [1.0, 1.0],
            [0.0, 1.0],
        ],
        dtype=np.float64,
    )
    triangles = np.array(
        [
            [0, 1, 2],
            [0, 2, 3],
        ],
        dtype=np.int32,
    )
    return vertices, triangles


def create_test_surface() -> tuple[np.ndarray, np.ndarray]:
    """Create a simple 3D surface mesh for testing."""
    vertices = np.array(
        [
            [0.0, 0.0, 0.0],
            [1.0, 0.0, 0.0],
            [1.0, 1.0, 0.0],
            [0.0, 1.0, 0.0],
        ],
        dtype=np.float64,
    )
    triangles = np.array(
        [
            [0, 1, 2],
            [0, 2, 3],
        ],
        dtype=np.int32,
    )
    return vertices, triangles


class TestRemeshResult3D:
    """Tests for RemeshResult with 3D meshes."""

    def test_remesh_returns_result(self) -> None:
        """remesh() returns a RemeshResult instance."""
        vertices, elements = create_test_cube()
        mesh = Mesh(vertices, elements)

        result = mesh.remesh(hsiz=0.5, verbose=-1)

        assert isinstance(result, RemeshResult)

    def test_remesh_result_has_counts(self) -> None:
        """RemeshResult has element and vertex counts."""
        vertices, elements = create_test_cube()
        mesh = Mesh(vertices, elements)

        result = mesh.remesh(hsiz=0.5, verbose=-1)

        assert result.vertices_before == len(vertices)
        assert result.elements_before == len(elements)
        assert result.vertices_after > 0
        assert result.elements_after > 0

    def test_remesh_result_success(self) -> None:
        """RemeshResult.success indicates successful remeshing."""
        vertices, elements = create_test_cube()
        mesh = Mesh(vertices, elements)

        result = mesh.remesh(hsiz=0.5, verbose=-1)

        assert result.success
        assert result.return_code == 0

    def test_remesh_result_timing(self) -> None:
        """RemeshResult.duration_seconds captures timing."""
        vertices, elements = create_test_cube()
        mesh = Mesh(vertices, elements)

        result = mesh.remesh(hsiz=0.5, verbose=-1)

        assert result.duration_seconds >= 0
        assert result.duration_seconds < 60  # Reasonable upper bound

    def test_remesh_result_quality_metrics(self) -> None:
        """RemeshResult has quality metrics before and after."""
        vertices, elements = create_test_cube()
        mesh = Mesh(vertices, elements)

        result = mesh.remesh(hsiz=0.5, verbose=-1)

        assert 0 <= result.quality_min_before <= 1
        assert 0 <= result.quality_min_after <= 1
        assert 0 <= result.quality_mean_before <= 1
        assert 0 <= result.quality_mean_after <= 1

    def test_remesh_result_vertex_change(self) -> None:
        """RemeshResult.vertex_change computes difference."""
        vertices, elements = create_test_cube()
        mesh = Mesh(vertices, elements)

        result = mesh.remesh(hsiz=0.5, verbose=-1)

        expected = result.vertices_after - result.vertices_before
        assert result.vertex_change == expected

    def test_remesh_result_element_change(self) -> None:
        """RemeshResult.element_change computes difference."""
        vertices, elements = create_test_cube()
        mesh = Mesh(vertices, elements)

        result = mesh.remesh(hsiz=0.5, verbose=-1)

        expected = result.elements_after - result.elements_before
        assert result.element_change == expected

    def test_remesh_result_quality_improvement(self) -> None:
        """RemeshResult.quality_improvement computes ratio."""
        vertices, elements = create_test_cube()
        mesh = Mesh(vertices, elements)

        result = mesh.remesh(hsiz=0.5, verbose=-1)

        if result.quality_mean_before > 0:
            expected = result.quality_mean_after / result.quality_mean_before
            assert result.quality_improvement == pytest.approx(expected)

    def test_remesh_result_str(self) -> None:
        """RemeshResult has readable string representation."""
        vertices, elements = create_test_cube()
        mesh = Mesh(vertices, elements)

        result = mesh.remesh(hsiz=0.5, verbose=-1)
        s = str(result)

        assert "vertices" in s
        assert "elements" in s
        assert "quality" in s
        assert "duration" in s

    def test_remesh_result_is_frozen(self) -> None:
        """RemeshResult is immutable."""
        vertices, elements = create_test_cube()
        mesh = Mesh(vertices, elements)

        result = mesh.remesh(hsiz=0.5, verbose=-1)

        with pytest.raises(AttributeError):
            result.vertices_before = 100  # type: ignore[misc]

    def test_remesh_uniform_returns_result(self) -> None:
        """remesh_uniform() returns a RemeshResult."""
        vertices, elements = create_test_cube()
        mesh = Mesh(vertices, elements)

        result = mesh.remesh_uniform(0.5, verbose=-1)

        assert isinstance(result, RemeshResult)

    def test_remesh_optimize_returns_result(self) -> None:
        """remesh_optimize() returns a RemeshResult."""
        vertices, elements = create_test_cube()
        mesh = Mesh(vertices, elements)

        result = mesh.remesh_optimize(verbose=-1)

        assert isinstance(result, RemeshResult)


class TestRemeshResult2D:
    """Tests for RemeshResult with 2D meshes."""

    def test_remesh_returns_result(self) -> None:
        """remesh() returns a RemeshResult instance."""
        vertices, triangles = create_test_square()
        mesh = Mesh(vertices, triangles)

        result = mesh.remesh(hsiz=0.3, verbose=-1)

        assert isinstance(result, RemeshResult)

    def test_remesh_result_success(self) -> None:
        """RemeshResult.success for 2D meshes."""
        vertices, triangles = create_test_square()
        mesh = Mesh(vertices, triangles)

        result = mesh.remesh(hsiz=0.3, verbose=-1)

        assert result.success
        assert result.vertices_before == len(vertices)
        assert result.elements_before == len(triangles)


class TestRemeshResultSurface:
    """Tests for RemeshResult with surface meshes."""

    def test_remesh_returns_result(self) -> None:
        """remesh() returns a RemeshResult instance."""
        vertices, triangles = create_test_surface()
        mesh = Mesh(vertices, triangles)

        result = mesh.remesh(hsiz=0.3, verbose=-1)

        assert isinstance(result, RemeshResult)

    def test_remesh_result_success(self) -> None:
        """RemeshResult.success for surface meshes."""
        vertices, triangles = create_test_surface()
        mesh = Mesh(vertices, triangles)

        result = mesh.remesh(hsiz=0.3, verbose=-1)

        assert result.success
        assert result.vertices_before == len(vertices)
        assert result.elements_before == len(triangles)


class TestRemeshResultDataclass:
    """Tests for RemeshResult dataclass behavior."""

    def test_remesh_result_warnings_tuple(self) -> None:
        """RemeshResult.warnings is a tuple."""
        vertices, elements = create_test_cube()
        mesh = Mesh(vertices, elements)

        result = mesh.remesh(hsiz=0.5, verbose=-1)

        assert isinstance(result.warnings, tuple)

    def test_remesh_result_slots(self) -> None:
        """RemeshResult uses slots for memory efficiency."""
        assert hasattr(RemeshResult, "__slots__")

    def test_quality_improvement_zero_before(self) -> None:
        """quality_improvement handles zero quality_before with nonzero after."""
        result = RemeshResult(
            vertices_before=10,
            vertices_after=20,
            elements_before=5,
            elements_after=15,
            triangles_before=0,
            triangles_after=0,
            edges_before=0,
            edges_after=0,
            quality_min_before=0.0,
            quality_min_after=0.5,
            quality_mean_before=0.0,
            quality_mean_after=0.5,
            duration_seconds=0.1,
            warnings=(),
            return_code=0,
        )

        assert result.quality_improvement == float("inf")

    def test_quality_improvement_both_zero(self) -> None:
        """quality_improvement returns 1.0 when both before and after are zero."""
        result = RemeshResult(
            vertices_before=10,
            vertices_after=20,
            elements_before=0,
            elements_after=0,
            triangles_before=0,
            triangles_after=0,
            edges_before=0,
            edges_after=0,
            quality_min_before=0.0,
            quality_min_after=0.0,
            quality_mean_before=0.0,
            quality_mean_after=0.0,
            duration_seconds=0.1,
            warnings=(),
            return_code=0,
        )

        # No change (both zero) should return 1.0, not 0.0
        assert result.quality_improvement == 1.0


class TestRemeshMethodsReturnResult:
    """Tests for remesh methods returning RemeshResult."""

    def test_remesh_lagrangian_3d_returns_result(self) -> None:
        """remesh_lagrangian() returns a RemeshResult for 3D meshes."""
        vertices, elements = create_test_cube()
        mesh = Mesh(vertices, elements)

        # Small displacement field
        displacement = np.zeros((len(vertices), 3), dtype=np.float64)
        displacement[:, 0] = 0.01  # Small x displacement

        try:
            result = mesh.remesh_lagrangian(displacement, verbose=-1)
        except RuntimeError as e:
            if "lag" in str(e).lower():
                pytest.skip("MMG not compiled with USE_ELAS for Lagrangian motion")
            raise

        assert isinstance(result, RemeshResult)
        assert result.success

    def test_remesh_lagrangian_2d_returns_result(self) -> None:
        """remesh_lagrangian() returns a RemeshResult for 2D meshes."""
        vertices, triangles = create_test_square()
        mesh = Mesh(vertices, triangles)

        # Small displacement field
        displacement = np.zeros((len(vertices), 2), dtype=np.float64)
        displacement[:, 0] = 0.01  # Small x displacement

        try:
            result = mesh.remesh_lagrangian(displacement, verbose=-1)
        except RuntimeError as e:
            if "lag" in str(e).lower():
                pytest.skip("MMG not compiled with USE_ELAS for Lagrangian motion")
            raise

        assert isinstance(result, RemeshResult)
        assert result.success

    def test_remesh_levelset_3d_returns_result(self) -> None:
        """remesh_levelset() returns a RemeshResult for 3D meshes."""
        vertices, elements = create_test_cube()
        mesh = Mesh(vertices, elements)

        # Level-set based on distance from center
        center = np.array([0.5, 0.5, 0.5])
        levelset = np.linalg.norm(vertices - center, axis=1) - 0.3

        result = mesh.remesh_levelset(levelset.reshape(-1, 1), verbose=-1)

        assert isinstance(result, RemeshResult)
        assert result.success

    def test_remesh_levelset_2d_returns_result(self) -> None:
        """remesh_levelset() returns a RemeshResult for 2D meshes."""
        vertices, triangles = create_test_square()
        mesh = Mesh(vertices, triangles)

        # Level-set based on distance from center
        center = np.array([0.5, 0.5])
        levelset = np.linalg.norm(vertices - center, axis=1) - 0.3

        result = mesh.remesh_levelset(levelset.reshape(-1, 1), verbose=-1)

        assert isinstance(result, RemeshResult)
        assert result.success

    def test_remesh_levelset_surface_returns_result(self) -> None:
        """remesh_levelset() returns a RemeshResult for surface meshes."""
        vertices, triangles = create_test_surface()
        mesh = Mesh(vertices, triangles)

        # Level-set based on x coordinate
        levelset = vertices[:, 0] - 0.5

        result = mesh.remesh_levelset(levelset.reshape(-1, 1), verbose=-1)

        assert isinstance(result, RemeshResult)
        assert result.success
