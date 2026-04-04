"""Benchmarks for non-remeshing operations at medium mesh scale.

These benchmarks detect regressions in data-transfer and Python-side
code paths: construction, file I/O, PyVista conversion, quality
computation, validation, and metric field access.
"""

from __future__ import annotations

from pathlib import Path
from typing import TYPE_CHECKING

import numpy as np
import pytest

from mmgpy import Mesh
from mmgpy._mmgpy import MmgMesh3D

if TYPE_CHECKING:
    from numpy.typing import NDArray
    from pytest_benchmark.fixture import BenchmarkFixture


class TestOperations:
    """Benchmarks for cheap operations at scale."""

    @pytest.mark.benchmark(group="operations")
    def test_construction_3d(
        self,
        benchmark: BenchmarkFixture,
        mesh_3d_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Construct MmgMesh3D from arrays."""
        vertices, tetrahedra = mesh_3d_medium

        def run() -> MmgMesh3D:
            return MmgMesh3D(vertices, tetrahedra)

        result = benchmark(run)
        assert len(result.get_vertices()) == len(vertices)

    @pytest.mark.benchmark(group="operations")
    def test_io_roundtrip_3d(
        self,
        benchmark: BenchmarkFixture,
        mesh_3d_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
        tmp_mesh_dir: Path,
    ) -> None:
        """Write then read a medium 3D mesh."""
        vertices, tetrahedra = mesh_3d_medium
        mesh = MmgMesh3D(vertices, tetrahedra)
        path = str(tmp_mesh_dir / "roundtrip.mesh")

        def run() -> MmgMesh3D:
            mesh.save(path)
            return MmgMesh3D(path)

        result = benchmark(run)
        assert len(result.get_vertices()) > 0

    @pytest.mark.benchmark(group="operations")
    def test_pyvista_roundtrip_3d(
        self,
        benchmark: BenchmarkFixture,
        mesh_3d_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Mesh -> PyVista -> Mesh roundtrip."""
        vertices, tetrahedra = mesh_3d_medium
        mesh = Mesh(vertices, tetrahedra)

        def run() -> Mesh:
            pv_obj = mesh.to_pyvista()
            return Mesh(pv_obj)

        result = benchmark(run)
        assert len(result.get_vertices()) > 0

    @pytest.mark.benchmark(group="operations")
    def test_quality_and_validate(
        self,
        benchmark: BenchmarkFixture,
        mesh_3d_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Quality computation + validation."""
        vertices, tetrahedra = mesh_3d_medium
        mesh_low = MmgMesh3D(vertices, tetrahedra)
        mesh_high = Mesh(vertices, tetrahedra)

        def run() -> None:
            _ = mesh_low.get_element_qualities()
            mesh_high.validate()

        benchmark(run)

    @pytest.mark.benchmark(group="operations")
    def test_metric_field_set_get(
        self,
        benchmark: BenchmarkFixture,
        mesh_3d_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Set then get metric field."""
        vertices, tetrahedra = mesh_3d_medium
        mesh = MmgMesh3D(vertices, tetrahedra)
        field = np.full((len(vertices), 1), 0.1, dtype=np.float64)

        def run() -> np.ndarray:
            mesh["metric"] = field
            return mesh["metric"]

        result = benchmark(run)
        assert len(result) == len(vertices)
