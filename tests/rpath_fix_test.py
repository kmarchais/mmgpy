"""Test that MMG executables can run (validates RPATH is correct)."""

import platform
import subprocess
from pathlib import Path

import pytest

import mmgpy


def _find_executable(base_name: str) -> str | None:
    """Find an MMG executable using mmgpy's helper function.

    This mirrors the logic in mmgpy._find_mmg_executable() to find
    executables in mmgpy/bin/ directory.
    """
    exe_name = f"{base_name}.exe" if platform.system() == "Windows" else base_name

    # Check mmgpy/bin relative to the package
    package_bin = Path(mmgpy.__file__).parent / "bin" / exe_name
    if package_bin.exists():
        return str(package_bin)

    return None


def test_mmg3d_executable_can_run() -> None:
    """Test that mmg3d_O3 executable can actually run.

    This is the real test of RPATH correctness - if the executable can run
    and display help, then the dynamic linker can find all required libraries.
    """
    exe_path = _find_executable("mmg3d_O3")
    if exe_path is None:
        pytest.skip("mmg3d_O3 executable not found in mmgpy/bin/")

    try:
        result = subprocess.run(
            [exe_path, "-h"],
            capture_output=True,
            text=True,
            timeout=10,
            check=False,
        )
    except subprocess.TimeoutExpired as e:
        msg = f"Executable {exe_path} timed out - possible library loading issue"
        raise AssertionError(msg) from e

    assert result.returncode == 0
    assert "mmg3d" in result.stdout.lower() or "usage" in result.stdout.lower()


def test_mmg2d_executable_can_run() -> None:
    """Test that mmg2d_O3 executable can actually run."""
    exe_path = _find_executable("mmg2d_O3")
    if exe_path is None:
        pytest.skip("mmg2d_O3 executable not found in mmgpy/bin/")

    try:
        result = subprocess.run(
            [exe_path, "-h"],
            capture_output=True,
            text=True,
            timeout=10,
            check=False,
        )
    except subprocess.TimeoutExpired as e:
        msg = f"Executable {exe_path} timed out - possible library loading issue"
        raise AssertionError(msg) from e

    assert result.returncode == 0


def test_mmgs_executable_can_run() -> None:
    """Test that mmgs_O3 executable can actually run."""
    exe_path = _find_executable("mmgs_O3")
    if exe_path is None:
        pytest.skip("mmgs_O3 executable not found in mmgpy/bin/")

    try:
        result = subprocess.run(
            [exe_path, "-h"],
            capture_output=True,
            text=True,
            timeout=10,
            check=False,
        )
    except subprocess.TimeoutExpired as e:
        msg = f"Executable {exe_path} timed out - possible library loading issue"
        raise AssertionError(msg) from e

    assert result.returncode == 0
