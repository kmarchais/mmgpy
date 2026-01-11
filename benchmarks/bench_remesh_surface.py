"""Benchmarks for surface mesh remeshing operations."""

from __future__ import annotations

from typing import TYPE_CHECKING

import pytest

from mmgpy import Mesh
from mmgpy._mmgpy import MmgMeshS

if TYPE_CHECKING:
    import numpy as np
    from numpy.typing import NDArray
    from pytest_benchmark.fixture import BenchmarkFixture


class TestRemeshSurfaceBaseline:
    """Baseline benchmarks for surface remeshing at different mesh sizes."""

    @pytest.mark.benchmark(group="remesh-surface-baseline")
    def test_remesh_small(
        self,
        benchmark: BenchmarkFixture,
        mesh_surface_small: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Baseline: ~320 element mesh."""
        vertices, triangles = mesh_surface_small

        def remesh() -> MmgMeshS:
            mesh = MmgMeshS(vertices, triangles)
            mesh.remesh(hmax=0.5, verbose=-1)
            return mesh

        result = benchmark(remesh)
        assert len(result.get_triangles()) > 0

    @pytest.mark.benchmark(group="remesh-surface-baseline")
    def test_remesh_medium(
        self,
        benchmark: BenchmarkFixture,
        mesh_surface_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Medium: ~5,120 element mesh."""
        vertices, triangles = mesh_surface_medium

        def remesh() -> MmgMeshS:
            mesh = MmgMeshS(vertices, triangles)
            mesh.remesh(hmax=0.2, verbose=-1)
            return mesh

        result = benchmark(remesh)
        assert len(result.get_triangles()) > 0

    @pytest.mark.benchmark(group="remesh-surface-baseline")
    def test_remesh_large(
        self,
        benchmark: BenchmarkFixture,
        mesh_surface_large: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Large: ~20,480 element mesh."""
        vertices, triangles = mesh_surface_large

        def remesh() -> MmgMeshS:
            mesh = MmgMeshS(vertices, triangles)
            mesh.remesh(hmax=0.1, verbose=-1)
            return mesh

        result = benchmark(remesh)
        assert len(result.get_triangles()) > 0


class TestRemeshSurfaceModes:
    """Benchmarks for different surface remeshing modes."""

    @pytest.mark.benchmark(group="remesh-surface-modes")
    def test_remesh_default(
        self,
        benchmark: BenchmarkFixture,
        mesh_surface_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Default remeshing with adaptive sizing."""
        vertices, triangles = mesh_surface_medium

        def remesh() -> MmgMeshS:
            mesh = MmgMeshS(vertices, triangles)
            mesh.remesh(hmax=0.2, verbose=-1)
            return mesh

        benchmark(remesh)

    @pytest.mark.benchmark(group="remesh-surface-modes")
    def test_remesh_optimize(
        self,
        benchmark: BenchmarkFixture,
        mesh_surface_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Optimization without topology changes."""
        vertices, triangles = mesh_surface_medium

        def optimize() -> Mesh:
            mesh = Mesh(vertices, triangles)
            mesh.remesh_optimize(verbose=-1)
            return mesh

        benchmark(optimize)

    @pytest.mark.benchmark(group="remesh-surface-modes")
    def test_remesh_uniform(
        self,
        benchmark: BenchmarkFixture,
        mesh_surface_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Uniform sizing remesh."""
        vertices, triangles = mesh_surface_medium

        def uniform() -> Mesh:
            mesh = Mesh(vertices, triangles)
            mesh.remesh_uniform(0.2, verbose=-1)
            return mesh

        benchmark(uniform)


class TestRemeshSurfaceOptions:
    """Benchmarks for different surface remeshing options."""

    @pytest.mark.benchmark(group="remesh-surface-options")
    def test_remesh_hmax_fine(
        self,
        benchmark: BenchmarkFixture,
        mesh_surface_small: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Fine mesh with small hmax (more elements)."""
        vertices, triangles = mesh_surface_small

        def remesh_fine() -> MmgMeshS:
            mesh = MmgMeshS(vertices, triangles)
            mesh.remesh(hmax=0.15, verbose=-1)
            return mesh

        benchmark(remesh_fine)

    @pytest.mark.benchmark(group="remesh-surface-options")
    def test_remesh_hmax_coarse(
        self,
        benchmark: BenchmarkFixture,
        mesh_surface_small: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Coarse mesh with large hmax (fewer elements)."""
        vertices, triangles = mesh_surface_small

        def remesh_coarse() -> MmgMeshS:
            mesh = MmgMeshS(vertices, triangles)
            mesh.remesh(hmax=0.8, verbose=-1)
            return mesh

        benchmark(remesh_coarse)

    @pytest.mark.benchmark(group="remesh-surface-options")
    def test_remesh_with_hausd(
        self,
        benchmark: BenchmarkFixture,
        mesh_surface_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Remeshing with Hausdorff distance constraint."""
        vertices, triangles = mesh_surface_medium

        def remesh_hausd() -> MmgMeshS:
            mesh = MmgMeshS(vertices, triangles)
            mesh.remesh(hmax=0.2, hausd=0.01, verbose=-1)
            return mesh

        benchmark(remesh_hausd)

    @pytest.mark.benchmark(group="remesh-surface-options")
    def test_remesh_with_hgrad(
        self,
        benchmark: BenchmarkFixture,
        mesh_surface_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Remeshing with gradation control."""
        vertices, triangles = mesh_surface_medium

        def remesh_hgrad() -> MmgMeshS:
            mesh = MmgMeshS(vertices, triangles)
            mesh.remesh(hmax=0.2, hgrad=1.3, verbose=-1)
            return mesh

        benchmark(remesh_hgrad)


class TestRemeshSurfaceQuality:
    """Benchmarks for surface mesh quality operations."""

    @pytest.mark.benchmark(group="remesh-surface-quality")
    def test_get_element_qualities(
        self,
        benchmark: BenchmarkFixture,
        mesh_surface_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Benchmark quality computation."""
        vertices, triangles = mesh_surface_medium
        mesh = MmgMeshS(vertices, triangles)

        result = benchmark(mesh.get_element_qualities)
        assert len(result) == len(triangles)

    @pytest.mark.benchmark(group="remesh-surface-quality")
    def test_validate_mesh(
        self,
        benchmark: BenchmarkFixture,
        mesh_surface_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Benchmark mesh validation."""
        vertices, triangles = mesh_surface_medium
        mesh = Mesh(vertices, triangles)

        result = benchmark(mesh.validate)
        assert result is True
