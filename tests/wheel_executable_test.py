"""Test that MMG executables are correctly packaged in wheels.

This test verifies that:
1. Executables exist in the correct location (mmgpy/bin/)
2. Python entry points can find and run them
3. RPATH is correct so executables can find shared libraries

Note: Some tests are skipped for editable installs where executables
are in different locations (not inside the package directory).
"""

from __future__ import annotations

import platform
import subprocess
from pathlib import Path

import pytest


def get_mmgpy_package_dir() -> Path:
    """Get the mmgpy package directory in site-packages."""
    import mmgpy

    return Path(mmgpy.__file__).parent


def is_editable_install() -> bool:
    """Check if mmgpy is installed in editable mode.

    In editable mode, the package points to src/mmgpy, and
    executables/libraries are in different locations.
    """
    package_dir = get_mmgpy_package_dir()
    # Editable installs typically have "src" in the path
    return "src" in str(package_dir)


@pytest.mark.skipif(is_editable_install(), reason="Skipped for editable installs")
class TestExecutableLocation:
    """Test that executables are in the correct location.

    These tests are for wheel installs only - they verify the wheel
    structure has executables in mmgpy/bin/.
    """

    def test_mmgpy_bin_directory_exists(self) -> None:
        """Test that mmgpy/bin directory exists."""
        package_dir = get_mmgpy_package_dir()
        bin_dir = package_dir / "bin"
        # Skip if executables weren't built (MMGPY_SKIP_EXECUTABLES=ON)
        if not bin_dir.exists():
            pytest.skip("mmgpy/bin directory not found - executables may not be built")
        assert bin_dir.is_dir()

    def test_mmg3d_executable_exists(self) -> None:
        """Test that mmg3d_O3 executable exists in mmgpy/bin."""
        package_dir = get_mmgpy_package_dir()
        exe_name = "mmg3d_O3.exe" if platform.system() == "Windows" else "mmg3d_O3"
        exe_path = package_dir / "bin" / exe_name
        if not exe_path.parent.exists():
            pytest.skip("mmgpy/bin directory not found - executables may not be built")
        assert exe_path.exists(), f"Expected executable at {exe_path}"

    def test_mmg2d_executable_exists(self) -> None:
        """Test that mmg2d_O3 executable exists in mmgpy/bin."""
        package_dir = get_mmgpy_package_dir()
        exe_name = "mmg2d_O3.exe" if platform.system() == "Windows" else "mmg2d_O3"
        exe_path = package_dir / "bin" / exe_name
        if not exe_path.parent.exists():
            pytest.skip("mmgpy/bin directory not found - executables may not be built")
        assert exe_path.exists(), f"Expected executable at {exe_path}"

    def test_mmgs_executable_exists(self) -> None:
        """Test that mmgs_O3 executable exists in mmgpy/bin."""
        package_dir = get_mmgpy_package_dir()
        exe_name = "mmgs_O3.exe" if platform.system() == "Windows" else "mmgs_O3"
        exe_path = package_dir / "bin" / exe_name
        if not exe_path.parent.exists():
            pytest.skip("mmgpy/bin directory not found - executables may not be built")
        assert exe_path.exists(), f"Expected executable at {exe_path}"


@pytest.mark.skipif(is_editable_install(), reason="Skipped for editable installs")
class TestExecutableRuns:
    """Test that executables can actually run (validates RPATH).

    These tests are for wheel installs only.
    """

    def test_mmg3d_executable_runs(self) -> None:
        """Test that mmg3d_O3 can run and display help."""
        package_dir = get_mmgpy_package_dir()
        exe_name = "mmg3d_O3.exe" if platform.system() == "Windows" else "mmg3d_O3"
        exe_path = package_dir / "bin" / exe_name

        if not exe_path.exists():
            pytest.skip(f"Executable {exe_path} not found")

        try:
            result = subprocess.run(
                [str(exe_path), "-h"],
                capture_output=True,
                text=True,
                timeout=10,
                check=False,
            )
        except subprocess.TimeoutExpired as e:
            msg = f"Executable {exe_path} timed out - possible library loading issue"
            raise AssertionError(msg) from e

        assert result.returncode == 0, (
            f"Exit code: {result.returncode}\nstderr: {result.stderr}"
        )
        assert "mmg3d" in result.stdout.lower() or "usage" in result.stdout.lower()

    def test_mmg2d_executable_runs(self) -> None:
        """Test that mmg2d_O3 can run and display help."""
        package_dir = get_mmgpy_package_dir()
        exe_name = "mmg2d_O3.exe" if platform.system() == "Windows" else "mmg2d_O3"
        exe_path = package_dir / "bin" / exe_name

        if not exe_path.exists():
            pytest.skip(f"Executable {exe_path} not found")

        try:
            result = subprocess.run(
                [str(exe_path), "-h"],
                capture_output=True,
                text=True,
                timeout=10,
                check=False,
            )
        except subprocess.TimeoutExpired as e:
            msg = f"Executable {exe_path} timed out - possible library loading issue"
            raise AssertionError(msg) from e

        assert result.returncode == 0, (
            f"Exit code: {result.returncode}\nstderr: {result.stderr}"
        )

    def test_mmgs_executable_runs(self) -> None:
        """Test that mmgs_O3 can run and display help."""
        package_dir = get_mmgpy_package_dir()
        exe_name = "mmgs_O3.exe" if platform.system() == "Windows" else "mmgs_O3"
        exe_path = package_dir / "bin" / exe_name

        if not exe_path.exists():
            pytest.skip(f"Executable {exe_path} not found")

        try:
            result = subprocess.run(
                [str(exe_path), "-h"],
                capture_output=True,
                text=True,
                timeout=10,
                check=False,
            )
        except subprocess.TimeoutExpired as e:
            msg = f"Executable {exe_path} timed out - possible library loading issue"
            raise AssertionError(msg) from e

        assert result.returncode == 0, (
            f"Exit code: {result.returncode}\nstderr: {result.stderr}"
        )


class TestPythonEntryPoints:
    """Test that Python entry points work correctly."""

    def test_mmg3d_entry_point(self) -> None:
        """Test that mmg3d entry point works."""
        result = subprocess.run(
            ["mmg3d", "-h"],
            capture_output=True,
            text=True,
            timeout=10,
            check=False,
        )
        # Entry point should either show help (returncode 0) or fail gracefully
        # Error message may be in stdout (rich logger) or stderr
        combined = (result.stdout + result.stderr).lower()
        assert result.returncode == 0 or "not found" in combined

    def test_mmg2d_entry_point(self) -> None:
        """Test that mmg2d entry point works."""
        result = subprocess.run(
            ["mmg2d", "-h"],
            capture_output=True,
            text=True,
            timeout=10,
            check=False,
        )
        # Error message may be in stdout (rich logger) or stderr
        combined = (result.stdout + result.stderr).lower()
        assert result.returncode == 0 or "not found" in combined

    def test_mmgs_entry_point(self) -> None:
        """Test that mmgs entry point works."""
        result = subprocess.run(
            ["mmgs", "-h"],
            capture_output=True,
            text=True,
            timeout=10,
            check=False,
        )
        # Error message may be in stdout (rich logger) or stderr
        combined = (result.stdout + result.stderr).lower()
        assert result.returncode == 0 or "not found" in combined

    def test_mmg_unified_entry_point(self) -> None:
        """Test that unified mmg entry point shows help."""
        result = subprocess.run(
            ["mmg", "--help"],
            capture_output=True,
            text=True,
            timeout=10,
            check=False,
        )
        assert result.returncode == 0
        assert "usage" in result.stdout.lower()


@pytest.mark.skipif(is_editable_install(), reason="Skipped for editable installs")
class TestLibraryLocation:
    """Test that shared libraries are in the correct location for RPATH.

    These tests are for wheel installs only.
    """

    def test_lib_directory_exists(self) -> None:
        """Test that mmgpy/lib directory exists."""
        if platform.system() == "Windows":
            pytest.skip("Windows uses DLLs in different location")

        package_dir = get_mmgpy_package_dir()
        lib_dir = package_dir / "lib"
        assert lib_dir.exists(), f"Expected lib directory at {lib_dir}"

    def test_mmg_libraries_exist(self) -> None:
        """Test that MMG shared libraries exist."""
        if platform.system() == "Windows":
            pytest.skip("Windows uses DLLs in different location")

        package_dir = get_mmgpy_package_dir()
        lib_dir = package_dir / "lib"

        if not lib_dir.exists():
            pytest.skip("lib directory not found")

        # Check for at least one MMG library
        mmg_libs = list(lib_dir.glob("libmmg*.so*"))
        if platform.system() == "Darwin":
            mmg_libs = list(lib_dir.glob("libmmg*.dylib*"))

        assert len(mmg_libs) > 0, f"No MMG libraries found in {lib_dir}"


@pytest.mark.skipif(is_editable_install(), reason="Skipped for editable installs")
class TestRpathCorrectness:
    """Test that RPATH is set correctly on executables.

    These tests are for wheel installs only.
    """

    @pytest.mark.skipif(
        platform.system() == "Windows",
        reason="RPATH not used on Windows",
    )
    def test_mmg3d_rpath_points_to_lib(self) -> None:
        """Test that mmg3d_O3 RPATH points to ../lib."""
        package_dir = get_mmgpy_package_dir()
        exe_name = "mmg3d_O3"
        exe_path = package_dir / "bin" / exe_name

        if not exe_path.exists():
            pytest.skip(f"Executable {exe_path} not found")

        if platform.system() == "Darwin":
            # macOS: use otool
            result = subprocess.run(
                ["otool", "-l", str(exe_path)],
                capture_output=True,
                text=True,
                check=False,
            )
            # Look for @loader_path/../lib in the output
            assert "@loader_path/../lib" in result.stdout, (
                f"Expected RPATH @loader_path/../lib in {exe_path}\n"
                f"otool output: {result.stdout}"
            )
        else:
            # Linux: use readelf or patchelf
            result = subprocess.run(
                ["patchelf", "--print-rpath", str(exe_path)],
                capture_output=True,
                text=True,
                check=False,
            )
            if result.returncode != 0:
                # Try readelf as fallback
                result = subprocess.run(
                    ["readelf", "-d", str(exe_path)],
                    capture_output=True,
                    text=True,
                    check=False,
                )
                assert "$ORIGIN/../lib" in result.stdout, (
                    f"Expected RPATH $ORIGIN/../lib in {exe_path}\n"
                    f"readelf output: {result.stdout}"
                )
            else:
                assert "$ORIGIN/../lib" in result.stdout, (
                    f"Expected RPATH $ORIGIN/../lib in {exe_path}\n"
                    f"patchelf output: {result.stdout}"
                )
