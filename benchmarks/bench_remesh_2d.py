"""Benchmarks for 2D mesh remeshing operations."""

from __future__ import annotations

from typing import TYPE_CHECKING

import pytest

from mmgpy import Mesh
from mmgpy._mmgpy import MmgMesh2D

if TYPE_CHECKING:
    import numpy as np
    from numpy.typing import NDArray
    from pytest_benchmark.fixture import BenchmarkFixture


class TestRemesh2DBaseline:
    """Baseline benchmarks for 2D remeshing at different mesh sizes."""

    @pytest.mark.benchmark(group="remesh-2d-baseline")
    def test_remesh_small(
        self,
        benchmark: BenchmarkFixture,
        mesh_2d_small: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Baseline: ~200 element mesh."""
        vertices, triangles = mesh_2d_small

        def remesh() -> MmgMesh2D:
            mesh = MmgMesh2D(vertices, triangles)
            mesh.remesh(hmax=0.2, verbose=-1)
            return mesh

        result = benchmark(remesh)
        assert len(result.get_triangles()) > 0

    @pytest.mark.benchmark(group="remesh-2d-baseline")
    def test_remesh_medium(
        self,
        benchmark: BenchmarkFixture,
        mesh_2d_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Medium: ~5,000 element mesh."""
        vertices, triangles = mesh_2d_medium

        def remesh() -> MmgMesh2D:
            mesh = MmgMesh2D(vertices, triangles)
            mesh.remesh(hmax=0.05, verbose=-1)
            return mesh

        result = benchmark(remesh)
        assert len(result.get_triangles()) > 0

    @pytest.mark.benchmark(group="remesh-2d-baseline")
    def test_remesh_large(
        self,
        benchmark: BenchmarkFixture,
        mesh_2d_large: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Large: ~20,000 element mesh."""
        vertices, triangles = mesh_2d_large

        def remesh() -> MmgMesh2D:
            mesh = MmgMesh2D(vertices, triangles)
            mesh.remesh(hmax=0.02, verbose=-1)
            return mesh

        result = benchmark(remesh)
        assert len(result.get_triangles()) > 0


class TestRemesh2DModes:
    """Benchmarks for different 2D remeshing modes."""

    @pytest.mark.benchmark(group="remesh-2d-modes")
    def test_remesh_default(
        self,
        benchmark: BenchmarkFixture,
        mesh_2d_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Default remeshing with adaptive sizing."""
        vertices, triangles = mesh_2d_medium

        def remesh() -> MmgMesh2D:
            mesh = MmgMesh2D(vertices, triangles)
            mesh.remesh(hmax=0.05, verbose=-1)
            return mesh

        benchmark(remesh)

    @pytest.mark.benchmark(group="remesh-2d-modes")
    def test_remesh_optimize(
        self,
        benchmark: BenchmarkFixture,
        mesh_2d_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Optimization without topology changes."""
        vertices, triangles = mesh_2d_medium

        def optimize() -> Mesh:
            mesh = Mesh(vertices, triangles)
            mesh.remesh_optimize(verbose=-1)
            return mesh

        benchmark(optimize)

    @pytest.mark.benchmark(group="remesh-2d-modes")
    def test_remesh_uniform(
        self,
        benchmark: BenchmarkFixture,
        mesh_2d_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Uniform sizing remesh."""
        vertices, triangles = mesh_2d_medium

        def uniform() -> Mesh:
            mesh = Mesh(vertices, triangles)
            mesh.remesh_uniform(0.05, verbose=-1)
            return mesh

        benchmark(uniform)


class TestRemesh2DOptions:
    """Benchmarks for different 2D remeshing options."""

    @pytest.mark.benchmark(group="remesh-2d-options")
    def test_remesh_hmax_fine(
        self,
        benchmark: BenchmarkFixture,
        mesh_2d_small: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Fine mesh with small hmax (more elements)."""
        vertices, triangles = mesh_2d_small

        def remesh_fine() -> MmgMesh2D:
            mesh = MmgMesh2D(vertices, triangles)
            mesh.remesh(hmax=0.05, verbose=-1)
            return mesh

        benchmark(remesh_fine)

    @pytest.mark.benchmark(group="remesh-2d-options")
    def test_remesh_hmax_coarse(
        self,
        benchmark: BenchmarkFixture,
        mesh_2d_small: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Coarse mesh with large hmax (fewer elements)."""
        vertices, triangles = mesh_2d_small

        def remesh_coarse() -> MmgMesh2D:
            mesh = MmgMesh2D(vertices, triangles)
            mesh.remesh(hmax=0.3, verbose=-1)
            return mesh

        benchmark(remesh_coarse)

    @pytest.mark.benchmark(group="remesh-2d-options")
    def test_remesh_with_hausd(
        self,
        benchmark: BenchmarkFixture,
        mesh_2d_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Remeshing with Hausdorff distance constraint."""
        vertices, triangles = mesh_2d_medium

        def remesh_hausd() -> MmgMesh2D:
            mesh = MmgMesh2D(vertices, triangles)
            mesh.remesh(hmax=0.05, hausd=0.005, verbose=-1)
            return mesh

        benchmark(remesh_hausd)

    @pytest.mark.benchmark(group="remesh-2d-options")
    def test_remesh_with_angle_detection(
        self,
        benchmark: BenchmarkFixture,
        mesh_2d_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Remeshing with angle detection."""
        vertices, triangles = mesh_2d_medium

        def remesh_ar() -> MmgMesh2D:
            mesh = MmgMesh2D(vertices, triangles)
            mesh.remesh(hmax=0.05, ar=30, verbose=-1)
            return mesh

        benchmark(remesh_ar)


class TestRemesh2DQuality:
    """Benchmarks for 2D mesh quality operations."""

    @pytest.mark.benchmark(group="remesh-2d-quality")
    def test_get_element_qualities(
        self,
        benchmark: BenchmarkFixture,
        mesh_2d_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Benchmark quality computation."""
        vertices, triangles = mesh_2d_medium
        mesh = MmgMesh2D(vertices, triangles)

        result = benchmark(mesh.get_element_qualities)
        assert len(result) == len(triangles)

    @pytest.mark.benchmark(group="remesh-2d-quality")
    def test_validate_mesh(
        self,
        benchmark: BenchmarkFixture,
        mesh_2d_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Benchmark mesh validation."""
        vertices, triangles = mesh_2d_medium
        mesh = Mesh(vertices, triangles)

        result = benchmark(mesh.validate)
        assert result is True
