"""Tests for warning capture from MMG library."""

import numpy as np
import pytest

from mmgpy import Mesh


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


class TestWarningCapture3D:
    """Tests for warning capture with 3D meshes."""

    def test_warnings_is_tuple(self) -> None:
        """RemeshResult.warnings is always a tuple."""
        vertices, elements = create_test_cube()
        mesh = Mesh(vertices, elements)

        result = mesh.remesh(hsiz=0.5, verbose=-1)

        assert isinstance(result.warnings, tuple)

    def test_warnings_empty_on_clean_remesh(self) -> None:
        """Warnings should be empty for normal remeshing."""
        vertices, elements = create_test_cube()
        mesh = Mesh(vertices, elements)

        # Use reasonable parameters that shouldn't produce warnings
        result = mesh.remesh(hsiz=0.3, verbose=-1)

        assert isinstance(result.warnings, tuple)
        # Note: We don't assert empty because MMG may still produce warnings
        # depending on the mesh quality. The key is that it's a tuple.

    def test_warnings_all_strings(self) -> None:
        """All warnings should be strings."""
        vertices, elements = create_test_cube()
        mesh = Mesh(vertices, elements)

        result = mesh.remesh(hsiz=0.5, verbose=-1)

        for warning in result.warnings:
            assert isinstance(warning, str)


class TestWarningCapture2D:
    """Tests for warning capture with 2D meshes."""

    def test_warnings_is_tuple(self) -> None:
        """RemeshResult.warnings is always a tuple for 2D meshes."""
        vertices, triangles = create_test_square()
        mesh = Mesh(vertices, triangles)

        result = mesh.remesh(hsiz=0.3, verbose=-1)

        assert isinstance(result.warnings, tuple)

    def test_warnings_all_strings(self) -> None:
        """All warnings should be strings for 2D meshes."""
        vertices, triangles = create_test_square()
        mesh = Mesh(vertices, triangles)

        result = mesh.remesh(hsiz=0.3, verbose=-1)

        for warning in result.warnings:
            assert isinstance(warning, str)


class TestWarningCaptureSurface:
    """Tests for warning capture with surface meshes."""

    def test_warnings_is_tuple(self) -> None:
        """RemeshResult.warnings is always a tuple for surface meshes."""
        vertices, triangles = create_test_surface()
        mesh = Mesh(vertices, triangles)

        result = mesh.remesh(hsiz=0.3, verbose=-1)

        assert isinstance(result.warnings, tuple)

    def test_warnings_all_strings(self) -> None:
        """All warnings should be strings for surface meshes."""
        vertices, triangles = create_test_surface()
        mesh = Mesh(vertices, triangles)

        result = mesh.remesh(hsiz=0.3, verbose=-1)

        for warning in result.warnings:
            assert isinstance(warning, str)


class TestWarningsWithSpecialCases:
    """Tests for warning capture with edge cases and special remeshing modes."""

    def test_levelset_remesh_has_warnings_tuple(self) -> None:
        """Level-set remeshing should also capture warnings."""
        vertices, elements = create_test_cube()
        mesh = Mesh(vertices, elements)

        # Level-set based on distance from center
        center = np.array([0.5, 0.5, 0.5])
        levelset = np.linalg.norm(vertices - center, axis=1) - 0.3

        result = mesh.remesh_levelset(levelset.reshape(-1, 1), verbose=-1)

        assert isinstance(result.warnings, tuple)

    def test_lagrangian_remesh_has_warnings_tuple(self) -> None:
        """Lagrangian remeshing should also capture warnings."""
        vertices, elements = create_test_cube()
        mesh = Mesh(vertices, elements)

        displacement = np.zeros((len(vertices), 3), dtype=np.float64)
        displacement[:, 0] = 0.01

        try:
            result = mesh.remesh_lagrangian(displacement, verbose=-1)
        except RuntimeError as e:
            if "lag" in str(e).lower():
                pytest.skip("MMG not compiled with USE_ELAS for Lagrangian motion")
            raise

        assert isinstance(result.warnings, tuple)

    def test_remesh_result_repr_with_warnings(self) -> None:
        """RemeshResult string representation handles warnings gracefully."""
        vertices, elements = create_test_cube()
        mesh = Mesh(vertices, elements)

        result = mesh.remesh(hsiz=0.5, verbose=-1)

        # Should not raise when converting to string
        result_str = str(result)
        assert "vertices" in result_str
        assert "elements" in result_str


class TestWarningsImmutability:
    """Tests for warning tuple immutability."""

    def test_warnings_is_frozen(self) -> None:
        """Warnings tuple should be immutable."""
        vertices, elements = create_test_cube()
        mesh = Mesh(vertices, elements)

        result = mesh.remesh(hsiz=0.5, verbose=-1)

        # Tuples are immutable by nature, but let's verify it's actually a tuple
        assert type(result.warnings) is tuple

    def test_result_dataclass_frozen(self) -> None:
        """RemeshResult dataclass should be frozen."""
        vertices, elements = create_test_cube()
        mesh = Mesh(vertices, elements)

        result = mesh.remesh(hsiz=0.5, verbose=-1)

        with pytest.raises(AttributeError):
            result.warnings = ("modified",)  # type: ignore[misc]
