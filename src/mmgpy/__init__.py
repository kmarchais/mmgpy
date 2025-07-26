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
    import site
    import subprocess
    import sys
    from pathlib import Path

    try:
        # Find site-packages directory
        site_packages = Path(site.getsitepackages()[0])

        # Find all MMG executables
        bin_dir = site_packages / "bin"
        if not bin_dir.exists():
            msg = f"Warning: {bin_dir} does not exist"
            print(msg, file=sys.stderr)
            return

        executables = list(bin_dir.glob("mmg*_O3"))
        if not executables:
            print("No MMG executables found", file=sys.stderr)
            return

        for exe in executables:
            print(f"Fixing RPATH for {exe.name}...", file=sys.stderr)

            # Check if RPATH already exists
            # S603: Safe - using absolute paths to system tools with controlled input
            result = subprocess.run(
                ["/usr/bin/otool", "-l", str(exe)],
                capture_output=True,
                text=True,
                check=False,
            )

            if "@loader_path/../mmgpy/lib" in result.stdout:
                print(f"  RPATH already correct for {exe.name}", file=sys.stderr)
                continue

            # Remove any existing incorrect RPATH entries
            # S603: Safe - using absolute paths to system tools with controlled input
            subprocess.run(
                ["/usr/bin/install_name_tool", "-delete_rpath", "@rpath", str(exe)],
                check=False,
                capture_output=True,
            )

            # Add correct RPATH
            # S603: Safe - using absolute paths to system tools with controlled input
            result = subprocess.run(
                [
                    "/usr/bin/install_name_tool",
                    "-add_rpath",
                    "@loader_path/../mmgpy/lib",
                    str(exe),
                ],
                check=False,
                capture_output=True,
                text=True,  # Fix mypy error - ensure text mode
            )

            if result.returncode == 0:
                print(f"  Successfully fixed RPATH for {exe.name}", file=sys.stderr)
            else:
                print(f"  Warning: Failed to fix RPATH for {exe.name}", file=sys.stderr)

    except (OSError, subprocess.SubprocessError) as e:
        print(f"Error fixing RPATH: {e}", file=sys.stderr)
        sys.exit(1)


__all__ = [
    "MMG_VERSION",
    "MmgMesh",
    "__version__",
    "mmg2d",
    "mmg3d",
    "mmgs",
]
