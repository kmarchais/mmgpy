"""Tests for compute_hessian in the metrics module."""

import numpy as np
import numpy.testing as npt
import pytest
from scipy.spatial import Delaunay

from mmgpy.metrics import compute_hessian, create_metric_from_hessian


def _make_structured_2d_mesh(n=10):
    """Create a structured 2D triangular mesh on [0,1]^2."""
    x = np.linspace(0, 1, n)
    y = np.linspace(0, 1, n)
    xx, yy = np.meshgrid(x, y)
    vertices = np.column_stack([xx.ravel(), yy.ravel()]).astype(np.float64)
    tri = Delaunay(vertices)
    elements = tri.simplices.astype(np.int32)
    return vertices, elements


def _make_structured_3d_mesh(n=5):
    """Create a simple 3D tetrahedral mesh on [0,1]^3."""
    x = np.linspace(0, 1, n)
    y = np.linspace(0, 1, n)
    z = np.linspace(0, 1, n)
    xx, yy, zz = np.meshgrid(x, y, z)
    vertices = np.column_stack([xx.ravel(), yy.ravel(), zz.ravel()]).astype(np.float64)
    tri = Delaunay(vertices)
    elements = tri.simplices.astype(np.int32)
    return vertices, elements


class TestComputeHessian:
    """Tests for compute_hessian function."""

    def test_quadratic_field_2d(self):
        """Hessian of f(x,y) = x^2 should give H11=2, H12=0, H22=0."""
        vertices, elements = _make_structured_2d_mesh(15)
        field = vertices[:, 0] ** 2  # f = x^2

        hessian = compute_hessian(vertices, elements, field)

        assert hessian.shape == (len(vertices), 3)

        # Interior nodes (away from boundary) should have accurate Hessian
        interior = (
            (vertices[:, 0] > 0.15)
            & (vertices[:, 0] < 0.85)
            & (vertices[:, 1] > 0.15)
            & (vertices[:, 1] < 0.85)
        )
        npt.assert_array_almost_equal(hessian[interior, 0], 2.0, decimal=1)  # H11
        npt.assert_array_almost_equal(hessian[interior, 1], 0.0, decimal=1)  # H12
        npt.assert_array_almost_equal(hessian[interior, 2], 0.0, decimal=1)  # H22

    def test_mixed_quadratic_2d(self):
        """Hessian of f(x,y) = x*y should give H12=1."""
        vertices, elements = _make_structured_2d_mesh(15)
        field = vertices[:, 0] * vertices[:, 1]  # f = x*y

        hessian = compute_hessian(vertices, elements, field)

        interior = (
            (vertices[:, 0] > 0.15)
            & (vertices[:, 0] < 0.85)
            & (vertices[:, 1] > 0.15)
            & (vertices[:, 1] < 0.85)
        )
        npt.assert_array_almost_equal(hessian[interior, 0], 0.0, decimal=1)  # H11
        npt.assert_array_almost_equal(hessian[interior, 1], 1.0, decimal=1)  # H12
        npt.assert_array_almost_equal(hessian[interior, 2], 0.0, decimal=1)  # H22

    def test_linear_field_2d(self):
        """Hessian of a linear field should be zero."""
        vertices, elements = _make_structured_2d_mesh(10)
        field = 3.0 * vertices[:, 0] + 2.0 * vertices[:, 1]

        hessian = compute_hessian(vertices, elements, field)

        npt.assert_array_almost_equal(hessian, 0.0, decimal=1)

    def test_quadratic_field_3d(self):
        """Hessian of f(x,y,z) = x^2 in 3D."""
        vertices, elements = _make_structured_3d_mesh(6)
        field = vertices[:, 0] ** 2

        hessian = compute_hessian(vertices, elements, field)

        assert hessian.shape == (len(vertices), 6)

        interior = (
            (vertices[:, 0] > 0.2)
            & (vertices[:, 0] < 0.8)
            & (vertices[:, 1] > 0.2)
            & (vertices[:, 1] < 0.8)
            & (vertices[:, 2] > 0.2)
            & (vertices[:, 2] < 0.8)
        )
        if np.any(interior):
            npt.assert_array_almost_equal(
                hessian[interior, 0], 2.0, decimal=0,
            )  # H11

    def test_output_shape(self):
        """Output shape matches vertex count and dimension."""
        verts_2d, elms_2d = _make_structured_2d_mesh(5)
        field_2d = np.ones(len(verts_2d))
        h2d = compute_hessian(verts_2d, elms_2d, field_2d)
        assert h2d.shape == (len(verts_2d), 3)

        verts_3d, elms_3d = _make_structured_3d_mesh(4)
        field_3d = np.ones(len(verts_3d))
        h3d = compute_hessian(verts_3d, elms_3d, field_3d)
        assert h3d.shape == (len(verts_3d), 6)

    def test_validation_error(self):
        """Wrong field length raises ValueError."""
        vertices, elements = _make_structured_2d_mesh(5)
        with pytest.raises(ValueError, match="field length"):
            compute_hessian(vertices, elements, np.ones(len(vertices) + 1))

    def test_hessian_to_metric_pipeline(self):
        """Full pipeline: field → hessian → metric produces valid metric."""
        vertices, elements = _make_structured_2d_mesh(10)
        field = vertices[:, 0] ** 2 + vertices[:, 1] ** 2

        hessian = compute_hessian(vertices, elements, field)
        metric = create_metric_from_hessian(hessian, target_error=0.01, hmax=1.0)

        assert metric.shape == (len(vertices), 3)
        # All diagonal entries should be positive
        assert np.all(metric[:, 0] > 0)
        assert np.all(metric[:, 2] > 0)
