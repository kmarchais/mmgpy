"""Benchmarks for mesh construction and initialization operations."""

from __future__ import annotations

from typing import TYPE_CHECKING

import numpy as np
import pytest

from mmgpy._mmgpy import MmgMesh2D, MmgMesh3D, MmgMeshS

if TYPE_CHECKING:
    from numpy.typing import NDArray
    from pytest_benchmark.fixture import BenchmarkFixture


class TestMeshConstruction3D:
    """Benchmarks for 3D mesh construction."""

    @pytest.mark.benchmark(group="mesh-construction-3d")
    def test_construct_from_arrays_small(
        self,
        benchmark: BenchmarkFixture,
        mesh_3d_small: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Benchmark small mesh construction from NumPy arrays."""
        vertices, tetrahedra = mesh_3d_small

        def construct() -> MmgMesh3D:
            return MmgMesh3D(vertices, tetrahedra)

        result = benchmark(construct)
        assert len(result.get_tetrahedra()) > 0

    @pytest.mark.benchmark(group="mesh-construction-3d")
    def test_construct_from_arrays_medium(
        self,
        benchmark: BenchmarkFixture,
        mesh_3d_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Benchmark medium mesh construction from NumPy arrays."""
        vertices, tetrahedra = mesh_3d_medium

        def construct() -> MmgMesh3D:
            return MmgMesh3D(vertices, tetrahedra)

        result = benchmark(construct)
        assert len(result.get_tetrahedra()) > 0

    @pytest.mark.benchmark(group="mesh-construction-3d")
    def test_construct_from_arrays_large(
        self,
        benchmark: BenchmarkFixture,
        mesh_3d_large: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Benchmark large mesh construction from NumPy arrays."""
        vertices, tetrahedra = mesh_3d_large

        def construct() -> MmgMesh3D:
            return MmgMesh3D(vertices, tetrahedra)

        result = benchmark(construct)
        assert len(result.get_tetrahedra()) > 0


class TestMeshConstruction2D:
    """Benchmarks for 2D mesh construction."""

    @pytest.mark.benchmark(group="mesh-construction-2d")
    def test_construct_from_arrays_small(
        self,
        benchmark: BenchmarkFixture,
        mesh_2d_small: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Benchmark small mesh construction from NumPy arrays."""
        vertices, triangles = mesh_2d_small

        def construct() -> MmgMesh2D:
            return MmgMesh2D(vertices, triangles)

        result = benchmark(construct)
        assert len(result.get_triangles()) > 0

    @pytest.mark.benchmark(group="mesh-construction-2d")
    def test_construct_from_arrays_medium(
        self,
        benchmark: BenchmarkFixture,
        mesh_2d_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Benchmark medium mesh construction from NumPy arrays."""
        vertices, triangles = mesh_2d_medium

        def construct() -> MmgMesh2D:
            return MmgMesh2D(vertices, triangles)

        result = benchmark(construct)
        assert len(result.get_triangles()) > 0

    @pytest.mark.benchmark(group="mesh-construction-2d")
    def test_construct_from_arrays_large(
        self,
        benchmark: BenchmarkFixture,
        mesh_2d_large: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Benchmark large mesh construction from NumPy arrays."""
        vertices, triangles = mesh_2d_large

        def construct() -> MmgMesh2D:
            return MmgMesh2D(vertices, triangles)

        result = benchmark(construct)
        assert len(result.get_triangles()) > 0


class TestMeshConstructionSurface:
    """Benchmarks for surface mesh construction."""

    @pytest.mark.benchmark(group="mesh-construction-surface")
    def test_construct_from_arrays_small(
        self,
        benchmark: BenchmarkFixture,
        mesh_surface_small: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Benchmark small mesh construction from NumPy arrays."""
        vertices, triangles = mesh_surface_small

        def construct() -> MmgMeshS:
            return MmgMeshS(vertices, triangles)

        result = benchmark(construct)
        assert len(result.get_triangles()) > 0

    @pytest.mark.benchmark(group="mesh-construction-surface")
    def test_construct_from_arrays_medium(
        self,
        benchmark: BenchmarkFixture,
        mesh_surface_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Benchmark medium mesh construction from NumPy arrays."""
        vertices, triangles = mesh_surface_medium

        def construct() -> MmgMeshS:
            return MmgMeshS(vertices, triangles)

        result = benchmark(construct)
        assert len(result.get_triangles()) > 0

    @pytest.mark.benchmark(group="mesh-construction-surface")
    def test_construct_from_arrays_large(
        self,
        benchmark: BenchmarkFixture,
        mesh_surface_large: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Benchmark large mesh construction from NumPy arrays."""
        vertices, triangles = mesh_surface_large

        def construct() -> MmgMeshS:
            return MmgMeshS(vertices, triangles)

        result = benchmark(construct)
        assert len(result.get_triangles()) > 0


class TestLowLevelConstruction3D:
    """Benchmarks for low-level mesh construction API."""

    @pytest.mark.benchmark(group="mesh-lowlevel-3d")
    def test_set_mesh_size_and_data(
        self,
        benchmark: BenchmarkFixture,
        mesh_3d_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Benchmark low-level mesh construction with set_mesh_size."""
        vertices, tetrahedra = mesh_3d_medium
        n_vertices = len(vertices)
        n_tetrahedra = len(tetrahedra)

        def construct() -> MmgMesh3D:
            mesh = MmgMesh3D()
            mesh.set_mesh_size(vertices=n_vertices, tetrahedra=n_tetrahedra)
            mesh.set_vertices(vertices)
            mesh.set_tetrahedra(tetrahedra)
            return mesh

        result = benchmark(construct)
        assert len(result.get_tetrahedra()) == n_tetrahedra

    @pytest.mark.benchmark(group="mesh-lowlevel-3d")
    def test_set_vertices_with_refs(
        self,
        benchmark: BenchmarkFixture,
        mesh_3d_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Benchmark setting vertices with reference array."""
        vertices, tetrahedra = mesh_3d_medium
        n_vertices = len(vertices)
        n_tetrahedra = len(tetrahedra)
        refs = np.ones(n_vertices, dtype=np.int64)

        def construct() -> MmgMesh3D:
            mesh = MmgMesh3D()
            mesh.set_mesh_size(vertices=n_vertices, tetrahedra=n_tetrahedra)
            mesh.set_vertices(vertices, refs)
            mesh.set_tetrahedra(tetrahedra)
            return mesh

        result = benchmark(construct)
        assert len(result.get_vertices()) == n_vertices


class TestFieldOperations:
    """Benchmarks for solution field operations."""

    @pytest.mark.benchmark(group="mesh-fields")
    def test_set_metric_field(
        self,
        benchmark: BenchmarkFixture,
        mesh_3d_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Benchmark setting a metric field."""
        vertices, tetrahedra = mesh_3d_medium
        mesh = MmgMesh3D(vertices, tetrahedra)
        field = np.full((len(vertices), 1), 0.1, dtype=np.float64)

        benchmark(mesh.set_field, "metric", field)

    @pytest.mark.benchmark(group="mesh-fields")
    def test_get_metric_field(
        self,
        benchmark: BenchmarkFixture,
        mesh_3d_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Benchmark getting a metric field."""
        vertices, tetrahedra = mesh_3d_medium
        mesh = MmgMesh3D(vertices, tetrahedra)
        field = np.full((len(vertices), 1), 0.1, dtype=np.float64)
        mesh.set_field("metric", field)

        result = benchmark(mesh.get_field, "metric")
        assert len(result) == len(vertices)


class TestTopologyQueries:
    """Benchmarks for mesh topology query operations."""

    @pytest.mark.benchmark(group="mesh-topology")
    def test_get_mesh_size(
        self,
        benchmark: BenchmarkFixture,
        mesh_3d_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Benchmark mesh size query."""
        vertices, tetrahedra = mesh_3d_medium
        mesh = MmgMesh3D(vertices, tetrahedra)

        result = benchmark(mesh.get_mesh_size)
        assert result[0] == len(vertices)

    @pytest.mark.benchmark(group="mesh-topology")
    def test_get_adjacent_elements(
        self,
        benchmark: BenchmarkFixture,
        mesh_3d_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Benchmark adjacent element query."""
        vertices, tetrahedra = mesh_3d_medium
        mesh = MmgMesh3D(vertices, tetrahedra)

        result = benchmark(mesh.get_adjacent_elements, 0)
        assert isinstance(result, np.ndarray)

    @pytest.mark.benchmark(group="mesh-topology")
    def test_get_vertex_neighbors(
        self,
        benchmark: BenchmarkFixture,
        mesh_3d_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Benchmark vertex neighbor query."""
        vertices, tetrahedra = mesh_3d_medium
        mesh = MmgMesh3D(vertices, tetrahedra)

        result = benchmark(mesh.get_vertex_neighbors, 0)
        assert isinstance(result, np.ndarray)
