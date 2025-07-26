"""Python bindings for the MMG library."""

import os
import sys
from pathlib import Path

# Handle DLL loading on Windows
if sys.platform == "win32":
    # Get the directory containing this file
    _module_dir = Path(__file__).absolute().parent

    # Always add the module directory to DLL search path (for MMG DLLs)
    os.add_dll_directory(str(_module_dir))

# Let delvewheel handle the rest of the imports
# Import after DLL setup is complete
try:
    from . import _version  # type: ignore[attr-defined]

    __version__ = _version.__version__
except ImportError:
    __version__ = "unknown"

# Main imports
from ._mmgpy import (  # type: ignore[attr-defined]
    MMG_VERSION,
    MmgMesh,
    mmg2d,
    mmg3d,
    mmgs,
)


def _run_mmg2d() -> None:
    """Run the mmg2d_O3 executable."""
    import site
    import subprocess
    import sys
    from pathlib import Path

    # Find the executable in site-packages for installed package
    site_packages = Path(site.getsitepackages()[0])
    exe_path = site_packages / "bin" / "mmg2d_O3"

    if exe_path.exists():
        # S603: This is safe - we control the executable path and only pass user args
        subprocess.run([str(exe_path)] + sys.argv[1:], check=False)
    else:
        print(f"mmg2d_O3 executable not found at {exe_path}", file=sys.stderr)
        sys.exit(1)


def _run_mmg3d() -> None:
    """Run the mmg3d_O3 executable."""
    import site
    import subprocess
    import sys
    from pathlib import Path

    # Find the executable in site-packages for installed package
    site_packages = Path(site.getsitepackages()[0])
    exe_path = site_packages / "bin" / "mmg3d_O3"

    if exe_path.exists():
        # S603: This is safe - we control the executable path and only pass user args
        subprocess.run([str(exe_path)] + sys.argv[1:], check=False)
    else:
        print(f"mmg3d_O3 executable not found at {exe_path}", file=sys.stderr)
        sys.exit(1)


def _run_mmgs() -> None:
    """Run the mmgs_O3 executable."""
    import site
    import subprocess
    import sys
    from pathlib import Path

    # Find the executable in site-packages for installed package
    site_packages = Path(site.getsitepackages()[0])
    exe_path = site_packages / "bin" / "mmgs_O3"

    if exe_path.exists():
        # S603: This is safe - we control the executable path and only pass user args
        subprocess.run([str(exe_path)] + sys.argv[1:], check=False)
    else:
        print(f"mmgs_O3 executable not found at {exe_path}", file=sys.stderr)
        sys.exit(1)


def _fix_rpath() -> None:
    """Fix RPATH for MMG executables - post-install utility."""
    import platform
    import subprocess

    # Only run on macOS
    if platform.system() != "Darwin":
        print("RPATH fix only needed on macOS", file=sys.stderr)
        return

    try:
        _fix_rpath_macos()
    except (OSError, subprocess.SubprocessError) as e:
        print(f"Error fixing RPATH: {e}", file=sys.stderr)
        raise


def _fix_rpath_macos() -> None:
    """Fix RPATH for MMG executables on macOS."""
    import site
    from pathlib import Path

    # Find site-packages directory
    site_packages = Path(site.getsitepackages()[0])
    print(f"Site packages: {site_packages}", file=sys.stderr)

    # Find all MMG executables
    bin_dir = site_packages / "bin"
    if not bin_dir.exists():
        print(f"Warning: {bin_dir} does not exist", file=sys.stderr)
        return

    executables = list(bin_dir.glob("mmg*_O3"))
    if not executables:
        print("No MMG executables found", file=sys.stderr)
        return

    print(f"Found {len(executables)} executables to fix", file=sys.stderr)

    for exe in executables:
        _fix_single_executable_rpath(exe)


def _fix_single_executable_rpath(exe: "Path") -> None:
    """Fix RPATH for a single executable."""
    print(f"Fixing RPATH for {exe.name}...", file=sys.stderr)

    # Check if executable exists and is executable
    if not exe.exists() or not exe.is_file():
        print(f"  Skipping {exe.name} - not a valid file", file=sys.stderr)
        return

    target_rpath = "@loader_path/../mmgpy/lib"

    # Check current RPATH
    if _has_correct_rpath(exe, target_rpath):
        print(f"  RPATH already correct for {exe.name}", file=sys.stderr)
        return

    # Remove existing @rpath entries and add correct one
    _remove_old_rpath(exe)
    if _add_new_rpath(exe, target_rpath):
        _verify_rpath_fix(exe, target_rpath)


def _has_correct_rpath(exe: "Path", target_rpath: str) -> bool:
    """Check if executable has the correct RPATH."""
    import subprocess

    result = subprocess.run(
        ["/usr/bin/otool", "-l", str(exe)],
        capture_output=True,
        text=True,
        check=False,
    )
    return result.returncode == 0 and target_rpath in result.stdout


def _remove_old_rpath(exe: "Path") -> None:
    """Remove existing @rpath entries from executable."""
    import subprocess

    subprocess.run(
        ["/usr/bin/install_name_tool", "-delete_rpath", "@rpath", str(exe)],
        check=False,
        capture_output=True,
    )


def _add_new_rpath(exe: "Path", target_rpath: str) -> bool:
    """Add new RPATH to executable. Returns True if successful."""
    import subprocess

    result = subprocess.run(
        ["/usr/bin/install_name_tool", "-add_rpath", target_rpath, str(exe)],
        capture_output=True,
        text=True,
        check=False,
    )

    if result.returncode == 0:
        print(f"  Successfully fixed RPATH for {exe.name}", file=sys.stderr)
        return True
    print(f"  Failed to fix RPATH for {exe.name}: {result.stderr}", file=sys.stderr)
    return False


def _verify_rpath_fix(exe: "Path", target_rpath: str) -> None:
    """Verify that RPATH fix was successful."""
    import subprocess

    verify_result = subprocess.run(
        ["/usr/bin/otool", "-l", str(exe)],
        capture_output=True,
        text=True,
        check=False,
    )

    if target_rpath in verify_result.stdout:
        print(f"  RPATH verification successful for {exe.name}", file=sys.stderr)
    else:
        print(f"  RPATH verification failed for {exe.name}", file=sys.stderr)


__all__ = [
    "MMG_VERSION",
    "MmgMesh",
    "__version__",
    "mmg2d",
    "mmg3d",
    "mmgs",
]
