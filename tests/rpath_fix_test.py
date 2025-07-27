"""Test RPATH fixing utility."""

import platform
import subprocess
from pathlib import Path


def test_rpath_fix_utility() -> None:  # noqa: PLR0912, C901
    """Test that the RPATH fix utility works and provides debugging info."""
    if platform.system() != "Darwin":
        print("RPATH fix test only relevant on macOS")
        return

    # Run our RPATH fix utility explicitly
    print("=== Running RPATH fix utility ===")
    try:
        import mmgpy

        mmgpy._fix_rpath()
    except Exception as e:
        print(f"RPATH fix utility failed: {e}")
        raise

    # Check if MMG executables exist and have correct RPATH
    import site

    site_packages = Path(site.getsitepackages()[0])
    bin_dir = site_packages / "bin"

    print(f"\n=== Checking executables in {bin_dir} ===")
    if not bin_dir.exists():
        print(f"ERROR: {bin_dir} does not exist!")
        return

    executables = list(bin_dir.glob("mmg*_O3"))
    print(f"Found executables: {[exe.name for exe in executables]}")

    for exe in executables:
        print(f"\n--- Checking {exe.name} ---")
        if not exe.exists():
            print(f"ERROR: {exe} does not exist!")
            continue

        # Check RPATH using otool
        result = subprocess.run(  # noqa: S603
            ["/usr/bin/otool", "-l", str(exe)],
            capture_output=True,
            text=True,
            check=False,
        )

        if result.returncode == 0:
            if "@loader_path/../mmgpy/lib" in result.stdout:
                print(f"✓ {exe.name} has correct RPATH")
            else:
                print(f"✗ {exe.name} missing correct RPATH")
                # Show actual RPATH entries
                lines = result.stdout.split("\n")
                for i, line in enumerate(lines):
                    if "LC_RPATH" in line:
                        print(f"  Found LC_RPATH at line {i}")
                        # Print next few lines to show the path
                        for j in range(i, min(i + 4, len(lines))):
                            if lines[j].strip():
                                print(f"    {lines[j]}")
        else:
            print(f"ERROR: Could not read {exe.name} with otool: {result.stderr}")


def test_mmg_executable_can_run() -> None:
    """Test that MMG executable can actually run (RPATH test)."""
    exe = "mmg3d_O3.exe" if platform.system() == "Windows" else "mmg3d_O3"

    # Try to run the executable with --help to see if RPATH works
    try:
        result = subprocess.run(  # noqa: S603
            [exe, "--help"],
            capture_output=True,
            text=True,
            timeout=10,
            check=False,
        )
        print(f"\n=== Testing {exe} execution ===")
        print(f"Return code: {result.returncode}")
        if result.returncode == 0:
            print("✓ Executable runs successfully")
        else:
            print(f"✗ Executable failed: {result.stderr}")
    except FileNotFoundError:
        print(f"✗ Executable {exe} not found in PATH")
    except subprocess.TimeoutExpired:
        print(f"✗ Executable {exe} timed out")
    except Exception as e:
        print(f"✗ Unexpected error running {exe}: {e}")
