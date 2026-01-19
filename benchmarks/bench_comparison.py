"""Benchmarks comparing executable, CLI script, and Python API performance.

Note on timing methodology:
- Executable benchmarks measure wall-clock time including subprocess overhead
- "internal" benchmarks parse MMG's reported ELAPSED TIME for fair comparison
- API benchmarks measure direct library call time
"""

from __future__ import annotations

import re
import subprocess
import tempfile
import time
from pathlib import Path
from typing import TYPE_CHECKING

import pytest

import mmgpy
from mmgpy import Mesh, mmg3d
from mmgpy._mmgpy import MmgMesh3D


def _get_executable_or_skip(name: str) -> str:
    """Get the full path to an MMG executable, or skip if not found."""
    exe_path = mmgpy._find_mmg_executable(name)  # noqa: SLF001
    if exe_path is None:
        pytest.skip(f"{name} executable not found in mmgpy/bin/")
    assert exe_path is not None  # for type checker (skip raises)
    return exe_path


if TYPE_CHECKING:
    import numpy as np
    from numpy.typing import NDArray
    from pytest_benchmark.fixture import BenchmarkFixture


def _parse_mmg_elapsed_time(output: str) -> float | None:
    """Parse MMG's internal elapsed time from output.

    Looks for pattern like "ELAPSED TIME  0.362s" in MMG output.
    Returns time in seconds, or None if not found.
    """
    match = re.search(r"ELAPSED TIME\s+([\d.]+)s", output)
    if match:
        return float(match.group(1))
    return None


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

    @pytest.mark.benchmark(group="comparison-3d-wallclock")
    def test_mmg3d_executable_wallclock(
        self,
        benchmark: BenchmarkFixture,
        mesh_file: Path,
    ) -> None:
        """Benchmark mmg3d_O3 executable (wall-clock, includes subprocess overhead)."""
        exe_path = _get_executable_or_skip("mmg3d_O3")

        def run_executable() -> None:
            with tempfile.NamedTemporaryFile(suffix=".mesh", delete=False) as f:
                output_path = f.name
            subprocess.run(
                [
                    exe_path,
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

    def test_timing_comparison_report(
        self,
        mesh_file: Path,
        tmp_path: Path,
    ) -> None:
        """Report timing comparison: executable internal time vs API time.

        This is not a benchmark - it runs once and prints a comparison.

        Note on verbosity:
        - Executable uses -v 1 to get the internal timing output
        - MMG's "ELAPSED TIME" is measured internally before output is printed
        - API uses verbose=1 to match conditions (output captured)
        """
        exe_path = _get_executable_or_skip("mmg3d_O3")
        output_path = tmp_path / "output.mesh"

        # Run executable with verbose=1 to get internal timing
        result = subprocess.run(
            [
                exe_path,
                "-in",
                str(mesh_file),
                "-out",
                str(output_path),
                "-hmax",
                "0.15",
                "-v",
                "1",
            ],
            check=True,
            capture_output=True,
            text=True,
        )
        exe_internal_time = _parse_mmg_elapsed_time(result.stdout + result.stderr)

        # Run Python API from SAME file to ensure identical input
        # (avoids floating-point differences from file I/O vs direct arrays)
        mesh = MmgMesh3D(str(mesh_file))

        import io
        import sys

        # Capture stdout to match exe conditions (both produce output)
        old_stdout = sys.stdout
        sys.stdout = io.StringIO()
        try:
            start = time.perf_counter()
            mesh.remesh(hmax=0.15, verbose=1)
            api_time = time.perf_counter() - start
        finally:
            sys.stdout = old_stdout

        # Load exe output mesh for comparison
        exe_mesh = MmgMesh3D(str(output_path))
        exe_n_vertices = len(exe_mesh.get_vertices())
        exe_n_tetrahedra = len(exe_mesh.get_tetrahedra())
        exe_qualities = exe_mesh.get_element_qualities()

        # Get API mesh stats
        api_n_vertices = len(mesh.get_vertices())
        api_n_tetrahedra = len(mesh.get_tetrahedra())
        api_qualities = mesh.get_element_qualities()

        # Report comparison
        print("\n" + "=" * 60)
        print("TIMING COMPARISON (3D remeshing, ~5000 elements)")
        print("=" * 60)
        print(f"mmg3d_O3 internal time:  {exe_internal_time:.3f}s (verbose=1)")
        print(f"Python API time:         {api_time:.3f}s (verbose=1)")
        if exe_internal_time:
            ratio = api_time / exe_internal_time
            print(f"Ratio (API/exe):         {ratio:.2f}x")
        print("-" * 60)
        print("RESULT VALIDATION:")
        print(f"  Vertices:    exe={exe_n_vertices}, api={api_n_vertices}")
        print(f"  Tetrahedra:  exe={exe_n_tetrahedra}, api={api_n_tetrahedra}")
        exe_min, api_min = exe_qualities.min(), api_qualities.min()
        exe_avg, api_avg = exe_qualities.mean(), api_qualities.mean()
        print(f"  Quality min: exe={exe_min:.3f}, api={api_min:.3f}")
        print(f"  Quality avg: exe={exe_avg:.3f}, api={api_avg:.3f}")
        print("=" * 60)

        # Verify results are equivalent (within 5% tolerance)
        assert abs(exe_n_vertices - api_n_vertices) / exe_n_vertices < 0.05, (
            f"Vertex count differs: exe={exe_n_vertices}, api={api_n_vertices}"
        )
        assert abs(exe_n_tetrahedra - api_n_tetrahedra) / exe_n_tetrahedra < 0.05, (
            f"Tetrahedra count differs: exe={exe_n_tetrahedra}, api={api_n_tetrahedra}"
        )
        assert abs(exe_avg - api_avg) < 0.05, (
            f"Quality differs: exe={exe_avg:.3f}, api={api_avg:.3f}"
        )

        # Basic assertion - API shouldn't be drastically slower
        if exe_internal_time:
            assert api_time < exe_internal_time * 2, "API is >2x slower than exe"

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


class TestAutoDetectionOverhead:
    """Measure overhead of automatic mesh type detection."""

    @pytest.fixture
    def mesh_file_3d(
        self,
        mesh_3d_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
        tmp_path: Path,
    ) -> Path:
        """Create a temporary 3D mesh file."""
        vertices, tetrahedra = mesh_3d_medium
        mesh = MmgMesh3D(vertices, tetrahedra)
        input_path = tmp_path / "input_3d.mesh"
        mesh.save(str(input_path))
        return input_path

    @pytest.mark.benchmark(group="autodetect-exe")
    def test_mmg3d_executable_direct(
        self,
        benchmark: BenchmarkFixture,
        mesh_file_3d: Path,
    ) -> None:
        """Benchmark mmg3d_O3 executable directly (no auto-detection)."""
        exe_path = _get_executable_or_skip("mmg3d_O3")

        def run_direct() -> None:
            with tempfile.NamedTemporaryFile(suffix=".mesh", delete=False) as f:
                output_path = f.name
            subprocess.run(
                [
                    exe_path,
                    "-in",
                    str(mesh_file_3d),
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

        benchmark(run_direct)

    @pytest.mark.benchmark(group="autodetect-exe")
    def test_mmg_script_autodetect(
        self,
        benchmark: BenchmarkFixture,
        mesh_file_3d: Path,
    ) -> None:
        """Benchmark mmg unified script (with auto-detection)."""

        def run_autodetect() -> None:
            with tempfile.NamedTemporaryFile(suffix=".mesh", delete=False) as f:
                output_path = f.name
            subprocess.run(
                [
                    "mmg",
                    "-in",
                    str(mesh_file_3d),
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

        benchmark(run_autodetect)

    @pytest.mark.benchmark(group="autodetect-api")
    def test_mmgmesh3d_direct(
        self,
        benchmark: BenchmarkFixture,
        mesh_3d_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Benchmark MmgMesh3D directly (no auto-detection)."""
        vertices, tetrahedra = mesh_3d_medium

        def run_direct() -> MmgMesh3D:
            mesh = MmgMesh3D(vertices, tetrahedra)
            mesh.remesh(hmax=0.15, verbose=-1)
            return mesh

        result = benchmark(run_direct)
        assert len(result.get_tetrahedra()) > 0

    @pytest.mark.benchmark(group="autodetect-api")
    def test_mesh_autodetect(
        self,
        benchmark: BenchmarkFixture,
        mesh_3d_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Benchmark Mesh with auto-detection."""
        vertices, tetrahedra = mesh_3d_medium

        def run_autodetect() -> Mesh:
            mesh = Mesh(vertices, tetrahedra)
            mesh.remesh(hmax=0.15, verbose=-1)
            return mesh

        result = benchmark(run_autodetect)
        assert len(result.get_elements()) > 0

    def test_autodetection_overhead_report(
        self,
        mesh_file_3d: Path,
        mesh_3d_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Report auto-detection overhead for both exe and API."""
        exe_path = _get_executable_or_skip("mmg3d_O3")
        vertices, tetrahedra = mesh_3d_medium

        # Measure executable times
        exe_times_direct: list[float] = []
        exe_times_auto: list[float] = []

        for _ in range(3):
            with tempfile.NamedTemporaryFile(suffix=".mesh", delete=False) as f:
                output_path = f.name

            start = time.perf_counter()
            subprocess.run(
                [
                    exe_path,
                    "-in",
                    str(mesh_file_3d),
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
            exe_times_direct.append(time.perf_counter() - start)
            Path(output_path).unlink(missing_ok=True)

            start = time.perf_counter()
            subprocess.run(
                [
                    "mmg",
                    "-in",
                    str(mesh_file_3d),
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
            exe_times_auto.append(time.perf_counter() - start)
            Path(output_path).unlink(missing_ok=True)

        # Measure API times
        api_times_direct: list[float] = []
        api_times_auto: list[float] = []

        for _ in range(3):
            start = time.perf_counter()
            mesh = MmgMesh3D(vertices, tetrahedra)
            mesh.remesh(hmax=0.15, verbose=-1)
            api_times_direct.append(time.perf_counter() - start)

            start = time.perf_counter()
            mesh = Mesh(vertices, tetrahedra)
            mesh.remesh(hmax=0.15, verbose=-1)
            api_times_auto.append(time.perf_counter() - start)

        # Calculate averages
        exe_direct_avg = sum(exe_times_direct) / len(exe_times_direct)
        exe_auto_avg = sum(exe_times_auto) / len(exe_times_auto)
        api_direct_avg = sum(api_times_direct) / len(api_times_direct)
        api_auto_avg = sum(api_times_auto) / len(api_times_auto)

        # Report
        print("\n" + "=" * 60)
        print("AUTO-DETECTION OVERHEAD (3D remeshing)")
        print("=" * 60)
        print("EXECUTABLE (subprocess):")
        print(f"  mmg3d_O3 (direct): {exe_direct_avg:.3f}s")
        print(f"  mmg (autodetect):  {exe_auto_avg:.3f}s")
        exe_oh_ms = (exe_auto_avg - exe_direct_avg) * 1000
        exe_oh_pct = (exe_auto_avg / exe_direct_avg - 1) * 100
        print(f"  Overhead:          {exe_oh_ms:.1f}ms ({exe_oh_pct:.1f}%)")
        print("-" * 60)
        print("PYTHON API (in-memory):")
        print(f"  MmgMesh3D (direct): {api_direct_avg:.3f}s")
        print(f"  Mesh (autodetect):  {api_auto_avg:.3f}s")
        api_oh_ms = (api_auto_avg - api_direct_avg) * 1000
        api_oh_pct = (api_auto_avg / api_direct_avg - 1) * 100
        print(f"  Overhead:           {api_oh_ms:.1f}ms ({api_oh_pct:.1f}%)")
        print("=" * 60)


class TestRemesh2DComparison:
    """Compare performance: mmg2d_O3 executable vs mmg script vs Python API."""

    @pytest.fixture
    def mesh_file_2d(
        self,
        mesh_2d_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
        tmp_path: Path,
    ) -> Path:
        """Create a temporary 2D mesh file."""
        from mmgpy._mmgpy import MmgMesh2D

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
        exe_path = _get_executable_or_skip("mmg2d_O3")

        def run_executable() -> None:
            with tempfile.NamedTemporaryFile(suffix=".mesh", delete=False) as f:
                output_path = f.name
            subprocess.run(
                [
                    exe_path,
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
        from mmgpy._mmgpy import MmgMesh2D

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
        from mmgpy._mmgpy import MmgMeshS

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
        exe_path = _get_executable_or_skip("mmgs_O3")

        def run_executable() -> None:
            with tempfile.NamedTemporaryFile(suffix=".mesh", delete=False) as f:
                output_path = f.name
            subprocess.run(
                [
                    exe_path,
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
        from mmgpy._mmgpy import MmgMeshS

        vertices, triangles = mesh_surface_medium

        def run_api_memory() -> MmgMeshS:
            mesh = MmgMeshS(vertices, triangles)
            mesh.remesh(hmax=0.2, verbose=-1)
            return mesh

        result = benchmark(run_api_memory)
        assert len(result.get_triangles()) > 0
