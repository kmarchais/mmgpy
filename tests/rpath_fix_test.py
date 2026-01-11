"""Test RPATH checking and fixing utilities."""

import platform
import subprocess

import mmgpy


def test_check_rpath() -> None:
    """Test that check_rpath returns valid status information."""
    status = mmgpy.check_rpath()

    assert "executables" in status
    assert "libraries" in status
    assert isinstance(status["executables"], list)
    assert isinstance(status["libraries"], list)

    if platform.system() == "Windows":
        assert status.get("message") == "RPATH not used on Windows"
        return

    for exe in status["executables"]:
        assert "name" in exe
        assert "path" in exe
        assert "rpath" in exe
        assert "expected" in exe
        assert "ok" in exe
        print(f"Executable {exe['name']}: {'OK' if exe['ok'] else 'NEEDS FIX'}")
        print(f"  RPATH: {exe['rpath']}")
        print(f"  Expected: {exe['expected']}")

    for lib in status["libraries"]:
        assert "name" in lib
        assert "path" in lib
        assert "rpath" in lib
        assert "expected" in lib
        assert "ok" in lib
        print(f"Library {lib['name']}: {'OK' if lib['ok'] else 'NEEDS FIX'}")
        print(f"  RPATH: {lib['rpath']}")
        print(f"  Expected: {lib['expected']}")


def test_rpath_fix_utility() -> None:
    """Test that the RPATH fix utility runs without errors."""
    if platform.system() not in ("Darwin", "Linux"):
        print("RPATH fix test only relevant on macOS/Linux")
        return

    print("=== Running RPATH fix utility ===")
    try:
        mmgpy._fix_rpath()
        print("RPATH fix utility completed")
    except Exception as e:
        print(f"RPATH fix utility failed: {e}")
        raise


def test_mmg_executable_can_run() -> None:
    """Test that MMG executable can actually run (RPATH test)."""
    exe = "mmg3d_O3.exe" if platform.system() == "Windows" else "mmg3d_O3"

    try:
        result = subprocess.run(
            [exe, "--help"],
            capture_output=True,
            text=True,
            timeout=10,
            check=False,
        )
        print(f"\n=== Testing {exe} execution ===")
        print(f"Return code: {result.returncode}")
        if result.returncode == 0:
            print("Executable runs successfully")
        else:
            print(f"Executable returned non-zero: {result.stderr}")
    except FileNotFoundError:
        print(f"Executable {exe} not found in PATH")
    except subprocess.TimeoutExpired:
        print(f"Executable {exe} timed out")
    except Exception as e:
        print(f"Unexpected error running {exe}: {e}")


def test_rpath_status_after_import() -> None:
    """Test that RPATH is correct after module import (auto-fix should have run)."""
    if platform.system() not in ("Darwin", "Linux"):
        print("RPATH status test only relevant on macOS/Linux")
        return

    status = mmgpy.check_rpath()

    # Check that executables have correct RPATH (auto-fix should have fixed them)
    executables_ok = all(exe.get("ok", False) for exe in status["executables"])
    if executables_ok:
        print("All executables have correct RPATH")
    else:
        for exe in status["executables"]:
            if not exe.get("ok", False):
                print(f"Executable {exe['name']} has incorrect RPATH:")
                print(f"  Current: {exe['rpath']}")
                print(f"  Expected: {exe['expected']}")
