"""Benchmarks for 3D mesh remeshing operations."""

from __future__ import annotations

from typing import TYPE_CHECKING

import pytest

from mmgpy import Mesh
from mmgpy._mmgpy import MmgMesh3D

if TYPE_CHECKING:
    import numpy as np
    from numpy.typing import NDArray
    from pytest_benchmark.fixture import BenchmarkFixture


class TestRemesh3DBaseline:
    """Baseline benchmarks for 3D remeshing at different mesh sizes."""

    @pytest.mark.benchmark(group="remesh-3d-baseline")
    def test_remesh_small(
        self,
        benchmark: BenchmarkFixture,
        mesh_3d_small: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Baseline: ~500 element mesh."""
        vertices, tetrahedra = mesh_3d_small

        def remesh() -> MmgMesh3D:
            mesh = MmgMesh3D(vertices, tetrahedra)
            mesh.remesh(hmax=0.3, verbose=-1)
            return mesh

        result = benchmark(remesh)
        assert len(result.get_tetrahedra()) > 0

    @pytest.mark.benchmark(group="remesh-3d-baseline")
    def test_remesh_medium(
        self,
        benchmark: BenchmarkFixture,
        mesh_3d_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Medium: ~5,000 element mesh."""
        vertices, tetrahedra = mesh_3d_medium

        def remesh() -> MmgMesh3D:
            mesh = MmgMesh3D(vertices, tetrahedra)
            mesh.remesh(hmax=0.15, verbose=-1)
            return mesh

        result = benchmark(remesh)
        assert len(result.get_tetrahedra()) > 0

    @pytest.mark.benchmark(group="remesh-3d-baseline")
    def test_remesh_large(
        self,
        benchmark: BenchmarkFixture,
        mesh_3d_large: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Large: ~40,000 element mesh."""
        vertices, tetrahedra = mesh_3d_large

        def remesh() -> MmgMesh3D:
            mesh = MmgMesh3D(vertices, tetrahedra)
            mesh.remesh(hmax=0.08, verbose=-1)
            return mesh

        result = benchmark(remesh)
        assert len(result.get_tetrahedra()) > 0


class TestRemesh3DModes:
    """Benchmarks for different remeshing modes."""

    @pytest.mark.benchmark(group="remesh-3d-modes")
    def test_remesh_default(
        self,
        benchmark: BenchmarkFixture,
        mesh_3d_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Default remeshing with adaptive sizing."""
        vertices, tetrahedra = mesh_3d_medium

        def remesh() -> MmgMesh3D:
            mesh = MmgMesh3D(vertices, tetrahedra)
            mesh.remesh(hmax=0.15, verbose=-1)
            return mesh

        benchmark(remesh)

    @pytest.mark.benchmark(group="remesh-3d-modes")
    def test_remesh_optimize(
        self,
        benchmark: BenchmarkFixture,
        mesh_3d_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Optimization without topology changes."""
        vertices, tetrahedra = mesh_3d_medium

        def optimize() -> Mesh:
            mesh = Mesh(vertices, tetrahedra)
            mesh.remesh_optimize(verbose=-1)
            return mesh

        benchmark(optimize)

    @pytest.mark.benchmark(group="remesh-3d-modes")
    def test_remesh_uniform(
        self,
        benchmark: BenchmarkFixture,
        mesh_3d_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Uniform sizing remesh."""
        vertices, tetrahedra = mesh_3d_medium

        def uniform() -> Mesh:
            mesh = Mesh(vertices, tetrahedra)
            mesh.remesh_uniform(0.1, verbose=-1)
            return mesh

        benchmark(uniform)


class TestRemesh3DOptions:
    """Benchmarks for different remeshing options."""

    @pytest.mark.benchmark(group="remesh-3d-options")
    def test_remesh_hmax_fine(
        self,
        benchmark: BenchmarkFixture,
        mesh_3d_small: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Fine mesh with small hmax (more elements)."""
        vertices, tetrahedra = mesh_3d_small

        def remesh_fine() -> MmgMesh3D:
            mesh = MmgMesh3D(vertices, tetrahedra)
            mesh.remesh(hmax=0.1, verbose=-1)
            return mesh

        benchmark(remesh_fine)

    @pytest.mark.benchmark(group="remesh-3d-options")
    def test_remesh_hmax_coarse(
        self,
        benchmark: BenchmarkFixture,
        mesh_3d_small: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Coarse mesh with large hmax (fewer elements)."""
        vertices, tetrahedra = mesh_3d_small

        def remesh_coarse() -> MmgMesh3D:
            mesh = MmgMesh3D(vertices, tetrahedra)
            mesh.remesh(hmax=0.5, verbose=-1)
            return mesh

        benchmark(remesh_coarse)

    @pytest.mark.benchmark(group="remesh-3d-options")
    def test_remesh_with_hausd(
        self,
        benchmark: BenchmarkFixture,
        mesh_3d_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Remeshing with Hausdorff distance constraint."""
        vertices, tetrahedra = mesh_3d_medium

        def remesh_hausd() -> MmgMesh3D:
            mesh = MmgMesh3D(vertices, tetrahedra)
            mesh.remesh(hmax=0.15, hausd=0.01, verbose=-1)
            return mesh

        benchmark(remesh_hausd)

    @pytest.mark.benchmark(group="remesh-3d-options")
    def test_remesh_with_hgrad(
        self,
        benchmark: BenchmarkFixture,
        mesh_3d_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Remeshing with gradation control."""
        vertices, tetrahedra = mesh_3d_medium

        def remesh_hgrad() -> MmgMesh3D:
            mesh = MmgMesh3D(vertices, tetrahedra)
            mesh.remesh(hmax=0.15, hgrad=1.3, verbose=-1)
            return mesh

        benchmark(remesh_hgrad)


class TestRemesh3DQuality:
    """Benchmarks for mesh quality operations."""

    @pytest.mark.benchmark(group="remesh-3d-quality")
    def test_get_element_qualities(
        self,
        benchmark: BenchmarkFixture,
        mesh_3d_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Benchmark quality computation."""
        vertices, tetrahedra = mesh_3d_medium
        mesh = MmgMesh3D(vertices, tetrahedra)

        result = benchmark(mesh.get_element_qualities)
        assert len(result) == len(tetrahedra)

    @pytest.mark.benchmark(group="remesh-3d-quality")
    def test_validate_mesh(
        self,
        benchmark: BenchmarkFixture,
        mesh_3d_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Benchmark mesh validation."""
        vertices, tetrahedra = mesh_3d_medium
        mesh = Mesh(vertices, tetrahedra)

        result = benchmark(mesh.validate)
        assert result is True
