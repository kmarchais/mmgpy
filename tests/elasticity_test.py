"""Tests for elasticity-based displacement propagation (fedoo integration)."""

import numpy as np
import numpy.testing as npt
import pytest

fedoo = pytest.importorskip("fedoo", reason="fedoo not installed")

from mmgpy._mmgpy import MmgMesh2D, MmgMesh3D
from mmgpy.lagrangian import (
    move_mesh,
    propagate_displacement_elasticity,
)


def create_2d_test_mesh():
    """Create a simple 2D square mesh for testing."""
    vertices = np.array(
        [
            [0.0, 0.0],  # 0
            [1.0, 0.0],  # 1
            [1.0, 1.0],  # 2
            [0.0, 1.0],  # 3
            [0.5, 0.5],  # 4 - interior point
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
    return vertices, triangles


def create_3d_test_mesh():
    """Create a cube mesh with an interior point for testing."""
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
            [0.5, 0.5, 0.5],  # interior point
        ],
        dtype=np.float64,
    )
    elements = np.array(
        [
            [0, 1, 3, 8],
            [1, 2, 3, 8],
            [0, 1, 4, 8],
            [1, 5, 4, 8],
            [1, 2, 5, 8],
            [2, 6, 5, 8],
            [2, 3, 6, 8],
            [3, 7, 6, 8],
            [0, 3, 4, 8],
            [3, 7, 4, 8],
            [4, 5, 6, 8],
            [4, 6, 7, 8],
        ],
        dtype=np.int32,
    )
    return vertices, elements


class TestPropagateDisplacementElasticity:
    """Tests for elasticity-based displacement propagation."""

    def test_all_boundary(self):
        """All-boundary case returns input displacement."""
        vertices, triangles = create_2d_test_mesh()
        n = len(vertices)

        boundary_mask = np.ones(n, dtype=bool)
        displacement = np.full((n, 2), [0.1, 0.0], dtype=np.float64)

        result = propagate_displacement_elasticity(
            vertices, triangles, boundary_mask, displacement,
        )
        npt.assert_array_almost_equal(result, displacement)

    def test_no_boundary(self):
        """No-boundary case returns zeros."""
        vertices, triangles = create_2d_test_mesh()
        n = len(vertices)

        boundary_mask = np.zeros(n, dtype=bool)
        displacement = np.full((n, 2), [0.1, 0.0], dtype=np.float64)

        result = propagate_displacement_elasticity(
            vertices, triangles, boundary_mask, displacement,
        )
        npt.assert_array_almost_equal(result, np.zeros_like(vertices))

    def test_uniform_boundary_2d(self):
        """Uniform boundary displacement propagates uniformly to interior."""
        vertices, triangles = create_2d_test_mesh()
        n = len(vertices)

        boundary_mask = np.array([True, True, True, True, False], dtype=bool)
        displacement = np.zeros((n, 2), dtype=np.float64)
        displacement[:4] = [0.1, 0.0]

        result = propagate_displacement_elasticity(
            vertices, triangles, boundary_mask, displacement,
        )

        # Boundary keeps original values
        npt.assert_array_almost_equal(result[:4], displacement[:4])
        # Interior should get approximately the same (rigid body translation)
        assert abs(result[4, 0] - 0.1) < 0.05
        assert abs(result[4, 1]) < 0.05

    def test_non_uniform_propagation_2d(self):
        """Non-uniform boundary: interior gets intermediate values."""
        vertices, triangles = create_2d_test_mesh()
        n = len(vertices)

        boundary_mask = np.array([True, True, True, True, False], dtype=bool)
        displacement = np.zeros((n, 2), dtype=np.float64)
        displacement[0] = [0.1, 0.0]  # bottom-left
        displacement[3] = [0.1, 0.0]  # top-left

        result = propagate_displacement_elasticity(
            vertices, triangles, boundary_mask, displacement,
        )

        # Interior point should be between 0 and 0.1
        assert 0.0 < result[4, 0] < 0.1

    def test_3d_propagation(self):
        """3D propagation: uniform boundary displacement."""
        vertices, elements = create_3d_test_mesh()
        n = len(vertices)

        boundary_mask = np.ones(n, dtype=bool)
        boundary_mask[8] = False  # center is interior

        displacement = np.zeros((n, 3), dtype=np.float64)
        displacement[:8] = [0.05, 0.0, 0.0]

        result = propagate_displacement_elasticity(
            vertices, elements, boundary_mask, displacement,
        )

        npt.assert_array_almost_equal(result[:8], displacement[:8])
        # Interior should get approximately 0.05 in x
        assert abs(result[8, 0] - 0.05) < 0.02

    def test_validation_errors(self):
        """Validation errors for invalid input."""
        vertices, triangles = create_2d_test_mesh()
        n = len(vertices)
        mask = np.ones(n, dtype=bool)
        disp = np.zeros((n, 2), dtype=np.float64)

        with pytest.raises(ValueError, match="boundary_mask length"):
            propagate_displacement_elasticity(
                vertices, triangles, np.ones(n + 1, dtype=bool), disp,
            )

        with pytest.raises(ValueError, match="boundary_displacement rows"):
            propagate_displacement_elasticity(
                vertices, triangles, mask, np.zeros((n + 1, 2)),
            )

        with pytest.raises(ValueError, match="boundary_displacement columns"):
            propagate_displacement_elasticity(
                vertices, triangles, mask, np.zeros((n, 3)),
            )


class TestMoveMeshPropagationMethod:
    """Tests for move_mesh with propagation_method parameter."""

    def test_invalid_method_raises(self):
        """Invalid propagation_method raises ValueError."""
        vertices, triangles = create_2d_test_mesh()
        mesh = MmgMesh2D(vertices, triangles)
        n = len(vertices)
        displacement = np.full((n, 2), [0.1, 0.0], dtype=np.float64)

        with pytest.raises(ValueError, match="propagation_method"):
            move_mesh(mesh, displacement, propagation_method="invalid")

    def test_elasticity_method_2d(self):
        """move_mesh with propagation_method='elasticity' works in 2D."""
        vertices, triangles = create_2d_test_mesh()
        mesh = MmgMesh2D(vertices, triangles)

        n = len(vertices)
        boundary_mask = np.array([True, True, True, True, False], dtype=bool)
        displacement = np.zeros((n, 2), dtype=np.float64)
        displacement[:4] = [0.05, 0.0]

        move_mesh(
            mesh,
            displacement,
            boundary_mask=boundary_mask,
            propagation_method="elasticity",
            hmax=0.5,
            verbose=False,
        )

        output_vertices = mesh.get_vertices()
        assert len(output_vertices) > 0
        assert len(mesh.get_triangles()) > 0

    def test_elasticity_method_3d(self):
        """move_mesh with propagation_method='elasticity' works in 3D."""
        vertices, elements = create_3d_test_mesh()
        mesh = MmgMesh3D(vertices, elements)

        n = len(vertices)
        boundary_mask = np.ones(n, dtype=bool)
        boundary_mask[8] = False

        displacement = np.zeros((n, 3), dtype=np.float64)
        displacement[:8] = [0.05, 0.0, 0.0]

        move_mesh(
            mesh,
            displacement,
            boundary_mask=boundary_mask,
            propagation_method="elasticity",
            hmax=0.5,
            verbose=False,
        )

        output_vertices = mesh.get_vertices()
        output_elements = mesh.get_elements()

        assert len(output_vertices) > 0
        assert len(output_elements) > 0

    def test_laplacian_still_default(self):
        """Default propagation_method is laplacian (backward compatible)."""
        vertices, triangles = create_2d_test_mesh()
        mesh = MmgMesh2D(vertices, triangles)

        n = len(vertices)
        displacement = np.full((n, 2), [0.1, 0.0], dtype=np.float64)

        # Should work without specifying propagation_method
        move_mesh(mesh, displacement, hmax=0.5, verbose=False)

        assert len(mesh.get_vertices()) > 0
