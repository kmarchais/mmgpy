"""Test that MMG executables can run (validates RPATH is correct)."""

import platform
import subprocess

import pytest


def test_mmg3d_executable_can_run() -> None:
    """Test that mmg3d_O3 executable can actually run.

    This is the real test of RPATH correctness - if the executable can run
    and display help, then the dynamic linker can find all required libraries.
    """
    exe = "mmg3d_O3.exe" if platform.system() == "Windows" else "mmg3d_O3"

    try:
        result = subprocess.run(
            [exe, "-h"],
            capture_output=True,
            text=True,
            timeout=10,
            check=False,
        )
    except FileNotFoundError:
        pytest.skip(f"Executable {exe} not found in PATH")
    except subprocess.TimeoutExpired as e:
        msg = f"Executable {exe} timed out - possible library loading issue"
        raise AssertionError(msg) from e

    assert result.returncode == 0
    assert "mmg3d" in result.stdout.lower() or "usage" in result.stdout.lower()


def test_mmg2d_executable_can_run() -> None:
    """Test that mmg2d_O3 executable can actually run."""
    exe = "mmg2d_O3.exe" if platform.system() == "Windows" else "mmg2d_O3"

    try:
        result = subprocess.run(
            [exe, "-h"],
            capture_output=True,
            text=True,
            timeout=10,
            check=False,
        )
    except FileNotFoundError:
        pytest.skip(f"Executable {exe} not found in PATH")
    except subprocess.TimeoutExpired as e:
        msg = f"Executable {exe} timed out - possible library loading issue"
        raise AssertionError(msg) from e

    assert result.returncode == 0


def test_mmgs_executable_can_run() -> None:
    """Test that mmgs_O3 executable can actually run."""
    exe = "mmgs_O3.exe" if platform.system() == "Windows" else "mmgs_O3"

    try:
        result = subprocess.run(
            [exe, "-h"],
            capture_output=True,
            text=True,
            timeout=10,
            check=False,
        )
    except FileNotFoundError:
        pytest.skip(f"Executable {exe} not found in PATH")
    except subprocess.TimeoutExpired as e:
        msg = f"Executable {exe} timed out - possible library loading issue"
        raise AssertionError(msg) from e

    assert result.returncode == 0
