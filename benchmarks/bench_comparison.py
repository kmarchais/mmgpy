"""Benchmarks comparing executable, CLI script, and Python API performance."""

from __future__ import annotations

import subprocess
import tempfile
from pathlib import Path
from typing import TYPE_CHECKING

import pytest

from mmgpy import MmgMesh3D, mmg3d

if TYPE_CHECKING:
    import numpy as np
    from numpy.typing import NDArray
    from pytest_benchmark.fixture import BenchmarkFixture


class TestRemesh3DComparison:
    """Compare performance: mmg3d_O3 executable vs mmg script vs Python API."""

    @pytest.fixture
    def mesh_file(
        self,
        mesh_3d_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
        tmp_path: Path,
    ) -> Path:
        """Create a temporary mesh file for executable/script benchmarks."""
        vertices, tetrahedra = mesh_3d_medium
        mesh = MmgMesh3D(vertices, tetrahedra)
        input_path = tmp_path / "input.mesh"
        mesh.save(str(input_path))
        return input_path

    @pytest.mark.benchmark(group="comparison-3d")
    def test_mmg3d_executable(
        self,
        benchmark: BenchmarkFixture,
        mesh_file: Path,
    ) -> None:
        """Benchmark mmg3d_O3 executable directly."""

        def run_executable() -> None:
            with tempfile.NamedTemporaryFile(suffix=".mesh", delete=False) as f:
                output_path = f.name
            subprocess.run(
                [
                    "mmg3d_O3",
                    "-in",
                    str(mesh_file),
                    "-out",
                    output_path,
                    "-hmax",
                    "0.15",
                    "-v",
                    "-1",
                ],
                check=True,
                capture_output=True,
            )
            Path(output_path).unlink(missing_ok=True)

        benchmark(run_executable)

    @pytest.mark.benchmark(group="comparison-3d")
    def test_mmg_script(
        self,
        benchmark: BenchmarkFixture,
        mesh_file: Path,
    ) -> None:
        """Benchmark mmg unified script (auto-detection)."""

        def run_script() -> None:
            with tempfile.NamedTemporaryFile(suffix=".mesh", delete=False) as f:
                output_path = f.name
            subprocess.run(
                [
                    "mmg",
                    "-in",
                    str(mesh_file),
                    "-out",
                    output_path,
                    "-hmax",
                    "0.15",
                    "-v",
                    "-1",
                ],
                check=True,
                capture_output=True,
            )
            Path(output_path).unlink(missing_ok=True)

        benchmark(run_script)

    @pytest.mark.benchmark(group="comparison-3d")
    def test_python_api_file_based(
        self,
        benchmark: BenchmarkFixture,
        mesh_file: Path,
    ) -> None:
        """Benchmark Python API with file-based remeshing (mmg3d.remesh)."""

        def run_api_file() -> None:
            with tempfile.NamedTemporaryFile(suffix=".mesh", delete=False) as f:
                output_path = f.name
            mmg3d.remesh(
                input_mesh=mesh_file,
                output_mesh=output_path,
                options={"hmax": 0.15, "verbose": -1},
            )
            Path(output_path).unlink(missing_ok=True)

        benchmark(run_api_file)

    @pytest.mark.benchmark(group="comparison-3d")
    def test_python_api_in_memory(
        self,
        benchmark: BenchmarkFixture,
        mesh_3d_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Benchmark Python API with in-memory remeshing (MmgMesh3D.remesh)."""
        vertices, tetrahedra = mesh_3d_medium

        def run_api_memory() -> MmgMesh3D:
            mesh = MmgMesh3D(vertices, tetrahedra)
            mesh.remesh(hmax=0.15, verbose=-1)
            return mesh

        result = benchmark(run_api_memory)
        assert len(result.get_tetrahedra()) > 0


class TestRemesh2DComparison:
    """Compare performance: mmg2d_O3 executable vs mmg script vs Python API."""

    @pytest.fixture
    def mesh_file_2d(
        self,
        mesh_2d_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
        tmp_path: Path,
    ) -> Path:
        """Create a temporary 2D mesh file."""
        from mmgpy import MmgMesh2D

        vertices, triangles = mesh_2d_medium
        mesh = MmgMesh2D(vertices, triangles)
        input_path = tmp_path / "input_2d.mesh"
        mesh.save(str(input_path))
        return input_path

    @pytest.mark.benchmark(group="comparison-2d")
    def test_mmg2d_executable(
        self,
        benchmark: BenchmarkFixture,
        mesh_file_2d: Path,
    ) -> None:
        """Benchmark mmg2d_O3 executable directly."""

        def run_executable() -> None:
            with tempfile.NamedTemporaryFile(suffix=".mesh", delete=False) as f:
                output_path = f.name
            subprocess.run(
                [
                    "mmg2d_O3",
                    "-in",
                    str(mesh_file_2d),
                    "-out",
                    output_path,
                    "-hmax",
                    "0.05",
                    "-v",
                    "-1",
                ],
                check=True,
                capture_output=True,
            )
            Path(output_path).unlink(missing_ok=True)

        benchmark(run_executable)

    @pytest.mark.benchmark(group="comparison-2d")
    def test_mmg_script_2d(
        self,
        benchmark: BenchmarkFixture,
        mesh_file_2d: Path,
    ) -> None:
        """Benchmark mmg unified script for 2D."""

        def run_script() -> None:
            with tempfile.NamedTemporaryFile(suffix=".mesh", delete=False) as f:
                output_path = f.name
            subprocess.run(
                [
                    "mmg",
                    "-in",
                    str(mesh_file_2d),
                    "-out",
                    output_path,
                    "-hmax",
                    "0.05",
                    "-v",
                    "-1",
                ],
                check=True,
                capture_output=True,
            )
            Path(output_path).unlink(missing_ok=True)

        benchmark(run_script)

    @pytest.mark.benchmark(group="comparison-2d")
    def test_python_api_2d_in_memory(
        self,
        benchmark: BenchmarkFixture,
        mesh_2d_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Benchmark Python API with in-memory 2D remeshing."""
        from mmgpy import MmgMesh2D

        vertices, triangles = mesh_2d_medium

        def run_api_memory() -> MmgMesh2D:
            mesh = MmgMesh2D(vertices, triangles)
            mesh.remesh(hmax=0.05, verbose=-1)
            return mesh

        result = benchmark(run_api_memory)
        assert len(result.get_triangles()) > 0


class TestRemeshSurfaceComparison:
    """Compare performance: mmgs_O3 executable vs mmg script vs Python API."""

    @pytest.fixture
    def mesh_file_surface(
        self,
        mesh_surface_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
        tmp_path: Path,
    ) -> Path:
        """Create a temporary surface mesh file."""
        from mmgpy import MmgMeshS

        vertices, triangles = mesh_surface_medium
        mesh = MmgMeshS(vertices, triangles)
        input_path = tmp_path / "input_surface.mesh"
        mesh.save(str(input_path))
        return input_path

    @pytest.mark.benchmark(group="comparison-surface")
    def test_mmgs_executable(
        self,
        benchmark: BenchmarkFixture,
        mesh_file_surface: Path,
    ) -> None:
        """Benchmark mmgs_O3 executable directly."""

        def run_executable() -> None:
            with tempfile.NamedTemporaryFile(suffix=".mesh", delete=False) as f:
                output_path = f.name
            subprocess.run(
                [
                    "mmgs_O3",
                    "-in",
                    str(mesh_file_surface),
                    "-out",
                    output_path,
                    "-hmax",
                    "0.2",
                    "-v",
                    "-1",
                ],
                check=True,
                capture_output=True,
            )
            Path(output_path).unlink(missing_ok=True)

        benchmark(run_executable)

    @pytest.mark.benchmark(group="comparison-surface")
    def test_mmg_script_surface(
        self,
        benchmark: BenchmarkFixture,
        mesh_file_surface: Path,
    ) -> None:
        """Benchmark mmg unified script for surface."""

        def run_script() -> None:
            with tempfile.NamedTemporaryFile(suffix=".mesh", delete=False) as f:
                output_path = f.name
            subprocess.run(
                [
                    "mmg",
                    "-in",
                    str(mesh_file_surface),
                    "-out",
                    output_path,
                    "-hmax",
                    "0.2",
                    "-v",
                    "-1",
                ],
                check=True,
                capture_output=True,
            )
            Path(output_path).unlink(missing_ok=True)

        benchmark(run_script)

    @pytest.mark.benchmark(group="comparison-surface")
    def test_python_api_surface_in_memory(
        self,
        benchmark: BenchmarkFixture,
        mesh_surface_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Benchmark Python API with in-memory surface remeshing."""
        from mmgpy import MmgMeshS

        vertices, triangles = mesh_surface_medium

        def run_api_memory() -> MmgMeshS:
            mesh = MmgMeshS(vertices, triangles)
            mesh.remesh(hmax=0.2, verbose=-1)
            return mesh

        result = benchmark(run_api_memory)
        assert len(result.get_triangles()) > 0
