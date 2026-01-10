"""Benchmarks for mesh validation operations."""

from __future__ import annotations

from typing import TYPE_CHECKING

import numpy as np
import pytest

from mmgpy._validation import _check_duplicate_vertices

if TYPE_CHECKING:
    from numpy.typing import NDArray
    from pytest_benchmark.fixture import BenchmarkFixture


def _generate_random_vertices_3d(
    n_vertices: int,
    *,
    seed: int = 42,
) -> NDArray[np.float64]:
    """Generate random 3D vertices."""
    rng = np.random.default_rng(seed)
    return rng.random((n_vertices, 3)).astype(np.float64)


def _generate_random_vertices_2d(
    n_vertices: int,
    *,
    seed: int = 42,
) -> NDArray[np.float64]:
    """Generate random 2D vertices."""
    rng = np.random.default_rng(seed)
    return rng.random((n_vertices, 2)).astype(np.float64)


@pytest.fixture(scope="session")
def vertices_10k() -> NDArray[np.float64]:
    """10,000 random 3D vertices."""
    return _generate_random_vertices_3d(10_000)


@pytest.fixture(scope="session")
def vertices_100k() -> NDArray[np.float64]:
    """100,000 random 3D vertices."""
    return _generate_random_vertices_3d(100_000)


@pytest.fixture(scope="session")
def vertices_1m() -> NDArray[np.float64]:
    """1,000,000 random 3D vertices."""
    return _generate_random_vertices_3d(1_000_000)


class TestDuplicateVertexDetectionBenchmarks:
    """Benchmarks for duplicate vertex detection using KD-tree."""

    @pytest.mark.benchmark(group="duplicate-detection")
    def test_duplicate_detection_10k(
        self,
        benchmark: BenchmarkFixture,
        vertices_10k: NDArray[np.float64],
    ) -> None:
        """Benchmark duplicate detection on 10k vertices."""
        issues: list = []

        def detect() -> None:
            issues.clear()
            _check_duplicate_vertices(vertices_10k, issues)

        benchmark(detect)

    @pytest.mark.benchmark(group="duplicate-detection")
    def test_duplicate_detection_100k(
        self,
        benchmark: BenchmarkFixture,
        vertices_100k: NDArray[np.float64],
    ) -> None:
        """Benchmark duplicate detection on 100k vertices."""
        issues: list = []

        def detect() -> None:
            issues.clear()
            _check_duplicate_vertices(vertices_100k, issues)

        benchmark(detect)

    @pytest.mark.benchmark(group="duplicate-detection")
    @pytest.mark.slow
    def test_duplicate_detection_1m(
        self,
        benchmark: BenchmarkFixture,
        vertices_1m: NDArray[np.float64],
    ) -> None:
        """Benchmark duplicate detection on 1M vertices (stress test)."""
        issues: list = []

        def detect() -> None:
            issues.clear()
            _check_duplicate_vertices(vertices_1m, issues)

        benchmark(detect)
