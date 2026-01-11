"""Tests for the metrics module."""

from __future__ import annotations

import numpy as np
import numpy.testing as npt
import pytest

from mmgpy import metrics
from mmgpy._mmgpy import MmgMesh2D, MmgMesh3D, MmgMeshS


class TestCreateIsotropicMetric:
    """Tests for create_isotropic_metric function."""

    def test_scalar_size_3d(self) -> None:
        """Test creating isotropic 3D metric from scalar size."""
        h = 0.1
        n_vertices = 10
        metric = metrics.create_isotropic_metric(h, n_vertices, dim=3)

        assert metric.shape == (n_vertices, 6)
        expected_eigval = 1.0 / (h * h)  # 100.0
        npt.assert_array_almost_equal(metric[:, 0], expected_eigval)  # m11
        npt.assert_array_almost_equal(metric[:, 1], 0.0)  # m12
        npt.assert_array_almost_equal(metric[:, 2], 0.0)  # m13
        npt.assert_array_almost_equal(metric[:, 3], expected_eigval)  # m22
        npt.assert_array_almost_equal(metric[:, 4], 0.0)  # m23
        npt.assert_array_almost_equal(metric[:, 5], expected_eigval)  # m33

    def test_scalar_size_2d(self) -> None:
        """Test creating isotropic 2D metric from scalar size."""
        h = 0.5
        n_vertices = 5
        metric = metrics.create_isotropic_metric(h, n_vertices, dim=2)

        assert metric.shape == (n_vertices, 3)
        expected_eigval = 1.0 / (h * h)  # 4.0
        npt.assert_array_almost_equal(metric[:, 0], expected_eigval)  # m11
        npt.assert_array_almost_equal(metric[:, 1], 0.0)  # m12
        npt.assert_array_almost_equal(metric[:, 2], expected_eigval)  # m22

    def test_array_size_3d(self) -> None:
        """Test creating isotropic 3D metric from array of sizes."""
        sizes = np.array([0.1, 0.2, 0.3, 0.4, 0.5])
        metric = metrics.create_isotropic_metric(sizes, dim=3)

        assert metric.shape == (5, 6)
        for i, h in enumerate(sizes):
            expected_eigval = 1.0 / (h * h)
            assert metric[i, 0] == pytest.approx(expected_eigval)
            assert metric[i, 3] == pytest.approx(expected_eigval)
            assert metric[i, 5] == pytest.approx(expected_eigval)

    def test_missing_n_vertices_raises(self) -> None:
        """Test that missing n_vertices raises ValueError for scalar h."""
        with pytest.raises(ValueError, match="n_vertices required"):
            metrics.create_isotropic_metric(0.1, dim=3)

    def test_invalid_dim_raises(self) -> None:
        """Test that invalid dim raises ValueError."""
        with pytest.raises(ValueError, match="dim must be 2 or 3"):
            metrics.create_isotropic_metric(0.1, 10, dim=4)


class TestCreateAnisotropicMetric:
    """Tests for create_anisotropic_metric function."""

    def test_identity_directions_3d(self) -> None:
        """Test anisotropic metric with identity directions (axis-aligned)."""
        sizes = np.array([0.1, 1.0, 1.0])  # Small in x, large in y,z
        metric = metrics.create_anisotropic_metric(sizes)

        assert metric.shape == (6,)
        # m11 should be large (1/0.1^2 = 100)
        assert metric[0] == pytest.approx(100.0)
        # m22, m33 should be small (1/1.0^2 = 1)
        assert metric[3] == pytest.approx(1.0)
        assert metric[5] == pytest.approx(1.0)
        # Off-diagonal should be zero
        assert metric[1] == pytest.approx(0.0)
        assert metric[2] == pytest.approx(0.0)
        assert metric[4] == pytest.approx(0.0)

    def test_identity_directions_2d(self) -> None:
        """Test anisotropic metric in 2D."""
        sizes = np.array([0.1, 1.0])
        metric = metrics.create_anisotropic_metric(sizes)

        assert metric.shape == (3,)
        assert metric[0] == pytest.approx(100.0)  # m11
        assert metric[1] == pytest.approx(0.0)  # m12
        assert metric[2] == pytest.approx(1.0)  # m22

    def test_rotated_metric_3d(self) -> None:
        """Test that rotated metric preserves eigenvalues."""
        sizes = np.array([0.1, 0.5, 1.0])
        theta = np.pi / 4  # 45 degree rotation around z-axis
        R = np.array(
            [
                [np.cos(theta), -np.sin(theta), 0],
                [np.sin(theta), np.cos(theta), 0],
                [0, 0, 1],
            ],
        )

        metric = metrics.create_anisotropic_metric(sizes, R)
        extracted_sizes, _ = metrics.compute_metric_eigenpairs(metric)

        # Sizes should be preserved (possibly reordered)
        npt.assert_array_almost_equal(np.sort(extracted_sizes), np.sort(sizes))

    def test_batch_metrics(self) -> None:
        """Test creating multiple metrics at once."""
        n_vertices = 10
        rng = np.random.default_rng(42)
        sizes = rng.uniform(0.1, 1.0, (n_vertices, 3))
        metric = metrics.create_anisotropic_metric(sizes)

        assert metric.shape == (n_vertices, 6)

        # Verify each metric has correct eigenvalues
        for i in range(n_vertices):
            extracted_sizes, _ = metrics.compute_metric_eigenpairs(metric[i])
            npt.assert_array_almost_equal(
                np.sort(extracted_sizes),
                np.sort(sizes[i]),
            )


class TestTensorMatrixConversion:
    """Tests for tensor/matrix conversion functions."""

    def test_tensor_to_matrix_3d(self) -> None:
        """Test converting 3D tensor to matrix."""
        tensor = np.array([1.0, 0.5, 0.3, 2.0, 0.2, 3.0])
        M = metrics.tensor_to_matrix(tensor)

        assert M.shape == (3, 3)
        npt.assert_array_almost_equal(
            M,
            [[1.0, 0.5, 0.3], [0.5, 2.0, 0.2], [0.3, 0.2, 3.0]],
        )

    def test_tensor_to_matrix_2d(self) -> None:
        """Test converting 2D tensor to matrix."""
        tensor = np.array([1.0, 0.5, 2.0])
        M = metrics.tensor_to_matrix(tensor)

        assert M.shape == (2, 2)
        npt.assert_array_almost_equal(M, [[1.0, 0.5], [0.5, 2.0]])

    def test_matrix_to_tensor_3d(self) -> None:
        """Test converting 3D matrix to tensor."""
        M = np.array([[1.0, 0.5, 0.3], [0.5, 2.0, 0.2], [0.3, 0.2, 3.0]])
        tensor = metrics.matrix_to_tensor(M)

        assert tensor.shape == (6,)
        npt.assert_array_almost_equal(tensor, [1.0, 0.5, 0.3, 2.0, 0.2, 3.0])

    def test_roundtrip_3d(self) -> None:
        """Test tensor -> matrix -> tensor roundtrip."""
        original = np.array([1.0, 0.5, 0.3, 2.0, 0.2, 3.0])
        M = metrics.tensor_to_matrix(original)
        recovered = metrics.matrix_to_tensor(M)
        npt.assert_array_almost_equal(recovered, original)

    def test_batch_conversion(self) -> None:
        """Test batch tensor/matrix conversion."""
        rng = np.random.default_rng(42)
        tensors = rng.uniform(0.1, 2.0, (5, 6))
        matrices = metrics.tensor_to_matrix(tensors)
        assert matrices.shape == (5, 3, 3)

        recovered = metrics.matrix_to_tensor(matrices)
        npt.assert_array_almost_equal(recovered, tensors)


class TestValidateMetricTensor:
    """Tests for validate_metric_tensor function."""

    def test_valid_identity_metric(self) -> None:
        """Test that identity metric is valid."""
        tensor = np.array([1.0, 0.0, 0.0, 1.0, 0.0, 1.0])
        is_valid, msg = metrics.validate_metric_tensor(tensor)
        assert is_valid
        assert "Valid" in msg

    def test_valid_anisotropic_metric(self) -> None:
        """Test that anisotropic positive-definite metric is valid."""
        sizes = np.array([0.1, 0.5, 1.0])
        tensor = metrics.create_anisotropic_metric(sizes)
        is_valid, _msg = metrics.validate_metric_tensor(tensor)
        assert is_valid

    def test_invalid_negative_diagonal(self) -> None:
        """Test that metric with negative diagonal is invalid."""
        tensor = np.array([-1.0, 0.0, 0.0, 1.0, 0.0, 1.0])
        with pytest.raises(ValueError, match="non-positive eigenvalues"):
            metrics.validate_metric_tensor(tensor)

    def test_invalid_not_positive_definite(self) -> None:
        """Test that non-positive-definite metric is invalid."""
        # Create a matrix that's not positive definite
        tensor = np.array([1.0, 2.0, 0.0, 1.0, 0.0, 1.0])  # off-diagonal too large
        is_valid, _ = metrics.validate_metric_tensor(tensor, raise_on_invalid=False)
        assert not is_valid

    def test_batch_validation(self) -> None:
        """Test validating multiple tensors at once."""
        tensors = metrics.create_isotropic_metric(0.1, 5, dim=3)
        is_valid, _msg = metrics.validate_metric_tensor(tensors)
        assert is_valid


class TestComputeMetricEigenpairs:
    """Tests for compute_metric_eigenpairs function."""

    def test_isotropic_metric(self) -> None:
        """Test eigenpair extraction from isotropic metric."""
        h = 0.1
        tensor = metrics.create_isotropic_metric(h, 1, dim=3)[0]
        sizes, _directions = metrics.compute_metric_eigenpairs(tensor)

        # All sizes should be h
        npt.assert_array_almost_equal(sizes, [h, h, h])

    def test_anisotropic_metric(self) -> None:
        """Test eigenpair extraction from anisotropic metric."""
        input_sizes = np.array([0.1, 0.5, 1.0])
        tensor = metrics.create_anisotropic_metric(input_sizes)
        sizes, directions = metrics.compute_metric_eigenpairs(tensor)

        # Sizes should match (possibly reordered)
        npt.assert_array_almost_equal(np.sort(sizes), np.sort(input_sizes))

        # Directions should be orthonormal
        npt.assert_array_almost_equal(directions @ directions.T, np.eye(3), decimal=10)


class TestIntersectMetrics:
    """Tests for intersect_metrics function."""

    def test_same_metrics(self) -> None:
        """Test that intersecting same metrics returns the same metric."""
        m1 = metrics.create_isotropic_metric(0.1, 1, dim=3)[0]
        result = metrics.intersect_metrics(m1, m1)
        npt.assert_array_almost_equal(result, m1)

    def test_finer_metric_wins(self) -> None:
        """Test that intersection produces finer metric in each direction."""
        # m1: small in x (0.1), large in y,z (1.0)
        m1 = metrics.create_anisotropic_metric(np.array([0.1, 1.0, 1.0]))
        # m2: small in y (0.1), large in x,z (1.0)
        m2 = metrics.create_anisotropic_metric(np.array([1.0, 0.1, 1.0]))

        result = metrics.intersect_metrics(m1, m2)
        sizes, _ = metrics.compute_metric_eigenpairs(result)

        # Result should be small in both x and y
        assert np.min(sizes) < 0.2  # At least one small direction
        assert np.sum(sizes < 0.2) >= 2  # At least two small directions

    def test_shape_mismatch_raises(self) -> None:
        """Test that mismatched shapes raise ValueError."""
        m1 = metrics.create_isotropic_metric(0.1, 5, dim=3)
        m2 = metrics.create_isotropic_metric(0.1, 3, dim=3)
        with pytest.raises(ValueError, match="same shape"):
            metrics.intersect_metrics(m1, m2)


class TestCreateMetricFromHessian:
    """Tests for create_metric_from_hessian function."""

    def test_zero_hessian(self) -> None:
        """Test that zero Hessian produces bounded metric."""
        hessian = np.array([0.0, 0.0, 0.0, 0.0, 0.0, 0.0])
        metric = metrics.create_metric_from_hessian(hessian, hmax=1.0)

        # Should produce minimum metric (bounded by hmax)
        is_valid, _ = metrics.validate_metric_tensor(metric)
        assert is_valid

    def test_high_curvature_produces_refinement(self) -> None:
        """Test that high curvature in one direction produces refinement."""
        # High curvature in x direction
        hessian = np.array([100.0, 0.0, 0.0, 1.0, 0.0, 1.0])
        metric = metrics.create_metric_from_hessian(hessian, target_error=1e-3)

        sizes, _ = metrics.compute_metric_eigenpairs(metric)
        # x-direction should have smaller size (more refinement)
        assert np.min(sizes) < np.max(sizes)

    def test_size_bounds(self) -> None:
        """Test that hmin/hmax bounds are respected."""
        hessian = np.array([1000.0, 0.0, 0.0, 0.001, 0.0, 0.001])
        metric = metrics.create_metric_from_hessian(
            hessian,
            target_error=1e-3,
            hmin=0.01,
            hmax=1.0,
        )

        sizes, _ = metrics.compute_metric_eigenpairs(metric)
        assert np.all(sizes >= 0.01 - 1e-10)
        assert np.all(sizes <= 1.0 + 1e-10)


class TestMmgMeshTensorIntegration:
    """Integration tests for tensor metrics with MmgMesh3D class."""

    def test_mmg_mesh_tensor_field_3d(self) -> None:
        """Test setting and getting tensor field on 3D mesh."""
        vertices = np.array(
            [
                [0.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [0.5, 1.0, 0.0],
                [0.5, 0.5, 1.0],
            ],
            dtype=np.float64,
        )
        elements = np.array([[0, 1, 2, 3]], dtype=np.int32)

        mesh = MmgMesh3D(vertices, elements)

        # Create anisotropic metric
        tensor = metrics.create_isotropic_metric(0.1, len(vertices), dim=3)
        mesh["tensor"] = tensor

        # Retrieve and verify
        retrieved = mesh["tensor"]
        npt.assert_array_almost_equal(retrieved, tensor)

    def test_mmg_mesh_2d_tensor_field(self) -> None:
        """Test setting and getting tensor field on 2D mesh."""
        vertices = np.array(
            [[0.0, 0.0], [1.0, 0.0], [0.5, 1.0]],
            dtype=np.float64,
        )
        triangles = np.array([[0, 1, 2]], dtype=np.int32)

        mesh = MmgMesh2D(vertices, triangles)

        # Create 2D anisotropic metric
        tensor = metrics.create_isotropic_metric(0.1, len(vertices), dim=2)
        mesh["tensor"] = tensor

        # Retrieve and verify
        retrieved = mesh["tensor"]
        npt.assert_array_almost_equal(retrieved, tensor)

    def test_mmg_mesh_s_tensor_field(self) -> None:
        """Test setting and getting tensor field on surface mesh."""
        vertices = np.array(
            [
                [0.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [0.5, 1.0, 0.0],
            ],
            dtype=np.float64,
        )
        triangles = np.array([[0, 1, 2]], dtype=np.int32)

        mesh = MmgMeshS(vertices, triangles)

        # Surface mesh uses 6-component tensors (3D embedding)
        tensor = metrics.create_isotropic_metric(0.1, len(vertices), dim=3)
        mesh["tensor"] = tensor

        # Retrieve and verify
        retrieved = mesh["tensor"]
        npt.assert_array_almost_equal(retrieved, tensor)

    def test_anisotropic_metric_values(self) -> None:
        """Test that anisotropic metric values are correctly stored."""
        vertices = np.array(
            [
                [0.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [0.5, 1.0, 0.0],
                [0.5, 0.5, 1.0],
            ],
            dtype=np.float64,
        )
        elements = np.array([[0, 1, 2, 3]], dtype=np.int32)

        mesh = MmgMesh3D(vertices, elements)

        # Create different anisotropic metric at each vertex
        tensors = np.zeros((4, 6), dtype=np.float64)
        for i in range(4):
            sizes = np.array([0.1 * (i + 1), 0.2 * (i + 1), 0.3 * (i + 1)])
            tensors[i] = metrics.create_anisotropic_metric(sizes)

        mesh["tensor"] = tensors
        retrieved = mesh["tensor"]

        # Verify eigenvalues are preserved
        for i in range(4):
            original_sizes, _ = metrics.compute_metric_eigenpairs(tensors[i])
            retrieved_sizes, _ = metrics.compute_metric_eigenpairs(retrieved[i])
            npt.assert_array_almost_equal(
                np.sort(original_sizes),
                np.sort(retrieved_sizes),
            )


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
