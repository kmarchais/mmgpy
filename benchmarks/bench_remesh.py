"""Isolation matrix benchmarks for remeshing regression detection.

Each benchmark exercises a unique combination of remesh options across
3D, 2D, and surface meshes.  When multiple benchmarks regress, the
intersection of their feature sets identifies the likely culprit.

Feature coverage matrix (8 features, 10 benchmarks):

+--------+------+------+-------+-------+----------+---------+--------+-------+
| Bench  | hmin | hmax | hausd | hgrad | optimize | uniform | metric | angle |
+========+======+======+=======+=======+==========+=========+========+=======+
| B1  3D |  x   |  x   |   x   |       |          |         |        |       |
| B2  3D |      |      |       |   x   |          |         |   x    |       |
| B3  3D |      |      |       |       |    x     |         |        |       |
| B4  2D |      |  x   |       |   x   |          |         |        |   x   |
| B5  2D |  x   |      |   x   |       |          |         |   x    |       |
| B6  2D |      |      |       |       |          |    x    |        |   x   |
| B7  Sf |  x   |      |       |   x   |          |         |        |       |
| B8  Sf |      |  x   |   x   |       |          |         |   x    |   x   |
| B9  Sf |      |      |       |       |    x     |         |        |       |
| B10 Sf |      |      |       |       |          |    x    |        |       |
+--------+------+------+-------+-------+----------+---------+--------+-------+

Feature signatures are unique within each dimension — the dimension axis
provides additional isolation.
"""

from __future__ import annotations

from typing import TYPE_CHECKING

import numpy as np
import pytest

from mmgpy._mmgpy import MmgMesh2D, MmgMesh3D, MmgMeshS

if TYPE_CHECKING:
    from numpy.typing import NDArray
    from pytest_benchmark.fixture import BenchmarkFixture


# ── 3D benchmarks ──────────────────────────────────────────────────────────


class TestRemesh3D:
    """3D remeshing benchmarks (B1-B3)."""

    @pytest.mark.benchmark(group="remesh-3d")
    def test_3d_adaptive_hmin_hmax_hausd(
        self,
        benchmark: BenchmarkFixture,
        mesh_3d_large: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """B1: 3D adaptive — hmin + hmax + hausd."""
        vertices, tetrahedra = mesh_3d_large

        def run() -> MmgMesh3D:
            mesh = MmgMesh3D(vertices, tetrahedra)
            mesh.remesh(hmin=0.02, hmax=0.06, hausd=0.01, verbose=-1)
            return mesh

        result = benchmark(run)
        assert len(result.get_tetrahedra()) > 0

    @pytest.mark.benchmark(group="remesh-3d")
    def test_3d_metric_hgrad(
        self,
        benchmark: BenchmarkFixture,
        mesh_3d_large: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """B2: 3D metric-driven — hgrad + metric field."""
        vertices, tetrahedra = mesh_3d_large
        metric = np.full((len(vertices), 1), 0.04, dtype=np.float64)

        def run() -> MmgMesh3D:
            mesh = MmgMesh3D(vertices, tetrahedra)
            mesh["metric"] = metric
            mesh.remesh(hgrad=1.3, verbose=-1)
            return mesh

        result = benchmark(run)
        assert len(result.get_tetrahedra()) > 0

    @pytest.mark.benchmark(group="remesh-3d")
    def test_3d_optimize(
        self,
        benchmark: BenchmarkFixture,
        mesh_3d_large: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """B3: 3D optimization-only (no topology changes)."""
        vertices, tetrahedra = mesh_3d_large

        def run() -> MmgMesh3D:
            mesh = MmgMesh3D(vertices, tetrahedra)
            mesh.remesh(optim=1, noinsert=1, verbose=-1)
            return mesh

        result = benchmark(run)
        assert len(result.get_tetrahedra()) > 0


# ── 2D benchmarks ──────────────────────────────────────────────────────────


class TestRemesh2D:
    """2D remeshing benchmarks (B4-B6)."""

    @pytest.mark.benchmark(group="remesh-2d")
    def test_2d_adaptive_hmax_hgrad_angle(
        self,
        benchmark: BenchmarkFixture,
        mesh_2d_large: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """B4: 2D adaptive — hmax + hgrad + angle detection."""
        vertices, triangles = mesh_2d_large

        def run() -> MmgMesh2D:
            mesh = MmgMesh2D(vertices, triangles)
            mesh.remesh(hmax=0.008, hgrad=1.3, ar=30, verbose=-1)
            return mesh

        result = benchmark(run)
        assert len(result.get_triangles()) > 0

    @pytest.mark.benchmark(group="remesh-2d")
    def test_2d_metric_hmin_hausd(
        self,
        benchmark: BenchmarkFixture,
        mesh_2d_large: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """B5: 2D metric-driven — hmin + hausd + metric field."""
        vertices, triangles = mesh_2d_large
        metric = np.full((len(vertices), 1), 0.008, dtype=np.float64)

        def run() -> MmgMesh2D:
            mesh = MmgMesh2D(vertices, triangles)
            mesh["metric"] = metric
            mesh.remesh(hmin=0.004, hausd=0.002, verbose=-1)
            return mesh

        result = benchmark(run)
        assert len(result.get_triangles()) > 0

    @pytest.mark.benchmark(group="remesh-2d")
    def test_2d_uniform_angle(
        self,
        benchmark: BenchmarkFixture,
        mesh_2d_large: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """B6: 2D uniform sizing + angle detection."""
        vertices, triangles = mesh_2d_large

        def run() -> MmgMesh2D:
            mesh = MmgMesh2D(vertices, triangles)
            mesh.remesh(hsiz=0.008, ar=30, verbose=-1)
            return mesh

        result = benchmark(run)
        assert len(result.get_triangles()) > 0


# ── Surface benchmarks ─────────────────────────────────────────────────────


class TestRemeshSurface:
    """Surface remeshing benchmarks (B7-B10)."""

    @pytest.mark.benchmark(group="remesh-surface")
    def test_surface_adaptive_hmin_hgrad(
        self,
        benchmark: BenchmarkFixture,
        mesh_surface_large: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """B7: Surface adaptive — hmin + hgrad."""
        vertices, triangles = mesh_surface_large

        def run() -> MmgMeshS:
            mesh = MmgMeshS(vertices, triangles)
            mesh.remesh(hmin=0.02, hgrad=1.3, verbose=-1)
            return mesh

        result = benchmark(run)
        assert len(result.get_triangles()) > 0

    @pytest.mark.benchmark(group="remesh-surface")
    def test_surface_metric_hmax_hausd_angle(
        self,
        benchmark: BenchmarkFixture,
        mesh_surface_large: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """B8: Surface metric-driven — hmax + hausd + metric + angle."""
        vertices, triangles = mesh_surface_large
        metric = np.full((len(vertices), 1), 0.03, dtype=np.float64)

        def run() -> MmgMeshS:
            mesh = MmgMeshS(vertices, triangles)
            mesh["metric"] = metric
            mesh.remesh(hmax=0.06, hausd=0.01, ar=30, verbose=-1)
            return mesh

        result = benchmark(run)
        assert len(result.get_triangles()) > 0

    @pytest.mark.benchmark(group="remesh-surface")
    def test_surface_optimize(
        self,
        benchmark: BenchmarkFixture,
        mesh_surface_large: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """B9: Surface optimization-only (no topology changes)."""
        vertices, triangles = mesh_surface_large

        def run() -> MmgMeshS:
            mesh = MmgMeshS(vertices, triangles)
            mesh.remesh(optim=1, noinsert=1, verbose=-1)
            return mesh

        result = benchmark(run)
        assert len(result.get_triangles()) > 0

    @pytest.mark.benchmark(group="remesh-surface")
    def test_surface_uniform(
        self,
        benchmark: BenchmarkFixture,
        mesh_surface_large: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """B10: Surface uniform sizing."""
        vertices, triangles = mesh_surface_large

        def run() -> MmgMeshS:
            mesh = MmgMeshS(vertices, triangles)
            mesh.remesh(hsiz=0.04, verbose=-1)
            return mesh

        result = benchmark(run)
        assert len(result.get_triangles()) > 0
