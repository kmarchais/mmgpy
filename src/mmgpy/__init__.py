"""Python bindings for the MMG library."""

import os
import platform
import site
import subprocess
import sys
from pathlib import Path

# Handle DLL loading on Windows
if sys.platform == "win32":
    # Get the directory containing this file
    _module_dir = Path(__file__).absolute().parent

    # Add common DLL directories to search path
    dll_search_dirs = [
        _module_dir,  # Module directory itself
        _module_dir / "lib",  # Common lib subdirectory
        _module_dir / "Scripts",  # Common bin subdirectory
        _module_dir / ".libs",  # delvewheel directory
        Path("C:/vcpkg/installed/x64-windows/bin"),  # VTK DLLs from vcpkg
    ]

    for dll_dir in dll_search_dirs:
        if dll_dir.exists() and dll_dir.is_dir():
            try:
                os.add_dll_directory(str(dll_dir))
                # Debug: print which directories were added (only in debug mode)
                if os.environ.get("MMGPY_DEBUG"):
                    print(f"Added DLL directory: {dll_dir}", file=sys.stderr)
            except (OSError, AttributeError):
                # Fallback for older Python versions or if add_dll_directory fails
                os.environ.setdefault("PATH", "")
                if str(dll_dir) not in os.environ["PATH"]:
                    os.environ["PATH"] = str(dll_dir) + os.pathsep + os.environ["PATH"]
                    if os.environ.get("MMGPY_DEBUG"):
                        print(f"Added to PATH: {dll_dir}", file=sys.stderr)

# Let delvewheel handle the rest of the imports
# Import after DLL setup is complete
try:
    from . import _version  # type: ignore[attr-defined]

    __version__ = _version.__version__
except ImportError:
    __version__ = "unknown"

# Main imports
try:
    from ._mmgpy import (  # type: ignore[attr-defined]
        MMG_VERSION,
        MmgMesh,
        mmg2d,
        mmg3d,
        mmgs,
    )
except ImportError as e:
    if sys.platform == "win32":
        # On Windows, provide helpful debugging information
        _module_dir = Path(__file__).absolute().parent
        available_files = list(_module_dir.glob("*"))
        lib_files = list(_module_dir.glob("**/*.dll")) + list(
            _module_dir.glob("**/*.pyd"),
        )

        error_msg = (
            f"Failed to import _mmgpy module on Windows.\n"
            f"Error: {e}\n"
            f"Module directory: {_module_dir}\n"
            f"Available files: {[f.name for f in available_files]}\n"
            f"Found DLLs/PYDs: {[str(f) for f in lib_files]}\n"
            f"To debug, set MMGPY_DEBUG=1 environment variable."
        )
        print(error_msg, file=sys.stderr)
    raise


def _run_mmg2d() -> None:
    """Run the mmg2d_O3 executable."""
    # Find the executable in site-packages for installed package
    site_packages_list = site.getsitepackages()
    # On Windows, prefer the actual site-packages over the venv root
    if sys.platform == "win32" and len(site_packages_list) > 1:
        site_packages = Path(site_packages_list[1])
    else:
        site_packages = Path(site_packages_list[0])
    
    scripts_dir = "bin"  # Always use bin for the actual MMG executables
    exe_name = "mmg2d_O3.exe" if sys.platform == "win32" else "mmg2d_O3"
    exe_path = site_packages / scripts_dir / exe_name

    if exe_path.exists():
        # S603: This is safe - we control the executable path and only pass user args
        subprocess.run([str(exe_path)] + sys.argv[1:], check=False)
    else:
        print(f"mmg2d_O3 executable not found at {exe_path}", file=sys.stderr)
        sys.exit(1)


def _run_mmg3d() -> None:
    """Run the mmg3d_O3 executable."""
    # Find the executable in site-packages for installed package
    site_packages_list = site.getsitepackages()
    # On Windows, prefer the actual site-packages over the venv root
    if sys.platform == "win32" and len(site_packages_list) > 1:
        site_packages = Path(site_packages_list[1])
    else:
        site_packages = Path(site_packages_list[0])
    
    scripts_dir = "bin"  # Always use bin for the actual MMG executables
    exe_name = "mmg3d_O3.exe" if sys.platform == "win32" else "mmg3d_O3"
    exe_path = site_packages / scripts_dir / exe_name

    if exe_path.exists():
        # S603: This is safe - we control the executable path and only pass user args
        subprocess.run([str(exe_path)] + sys.argv[1:], check=False)
    else:
        print(f"mmg3d_O3 executable not found at {exe_path}", file=sys.stderr)
        sys.exit(1)


def _run_mmgs() -> None:
    """Run the mmgs_O3 executable."""
    # Find the executable in site-packages for installed package
    site_packages_list = site.getsitepackages()
    # On Windows, prefer the actual site-packages over the venv root
    if sys.platform == "win32" and len(site_packages_list) > 1:
        site_packages = Path(site_packages_list[1])
    else:
        site_packages = Path(site_packages_list[0])
    
    scripts_dir = "bin"  # Always use bin for the actual MMG executables
    exe_name = "mmgs_O3.exe" if sys.platform == "win32" else "mmgs_O3"
    exe_path = site_packages / scripts_dir / exe_name

    if exe_path.exists():
        # S603: This is safe - we control the executable path and only pass user args
        subprocess.run([str(exe_path)] + sys.argv[1:], check=False)
    else:
        print(f"mmgs_O3 executable not found at {exe_path}", file=sys.stderr)
        sys.exit(1)


def _fix_rpath() -> None:
    """Fix RPATH for MMG executables - post-install utility."""
    system = platform.system()
    if system == "Darwin":
        try:
            _fix_rpath_macos()
        except (OSError, subprocess.SubprocessError) as e:
            print(f"Error fixing RPATH: {e}", file=sys.stderr)
            raise
    elif system == "Linux":
        try:
            _fix_rpath_linux()
        except (OSError, subprocess.SubprocessError) as e:
            print(f"Error fixing RPATH: {e}", file=sys.stderr)
            raise
    else:
        print(f"RPATH fix not needed for {system}", file=sys.stderr)
        return


def _fix_rpath_macos() -> None:
    """Fix RPATH for MMG executables on macOS."""
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
    result = subprocess.run(
        ["/usr/bin/otool", "-l", str(exe)],
        capture_output=True,
        text=True,
        check=False,
    )
    return result.returncode == 0 and target_rpath in result.stdout


def _remove_old_rpath(exe: "Path") -> None:
    """Remove existing @rpath entries from executable."""
    subprocess.run(
        ["/usr/bin/install_name_tool", "-delete_rpath", "@rpath", str(exe)],
        check=False,
        capture_output=True,
    )


def _add_new_rpath(exe: "Path", target_rpath: str) -> bool:
    """Add new RPATH to executable. Returns True if successful."""
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


def _fix_rpath_linux() -> None:
    """Fix RPATH for MMG executables on Linux using patchelf."""
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

    # Library directories to add to RPATH
    lib_dirs = [
        str(site_packages / "lib"),
        str(site_packages / "mmgpy" / "lib"),
    ]

    for exe in executables:
        _fix_single_executable_rpath_linux(exe, lib_dirs)


def _fix_single_executable_rpath_linux(exe: "Path", lib_dirs: list[str]) -> None:
    """Fix RPATH for a single executable on Linux."""
    print(f"Fixing RPATH for {exe.name}...", file=sys.stderr)

    # Check if executable exists and is executable
    if not exe.exists() or not exe.is_file():
        print(f"  Skipping {exe.name} - not a valid file", file=sys.stderr)
        return

    try:
        # Set RPATH to include both library directories
        rpath = ":".join(lib_dirs)
        result = subprocess.run(
            ["patchelf", "--set-rpath", rpath, str(exe)],  # noqa: S607
            capture_output=True,
            text=True,
            check=False,
        )

        if result.returncode == 0:
            print(f"  Successfully fixed RPATH for {exe.name}", file=sys.stderr)
            _verify_rpath_fix_linux(exe, lib_dirs)
        else:
            print(
                f"  Failed to fix RPATH for {exe.name}: {result.stderr}",
                file=sys.stderr,
            )

    except FileNotFoundError:
        print("  patchelf not found - trying venv patchelf...", file=sys.stderr)
        # Try to use the patchelf from the virtual environment
        venv_patchelf = Path(sys.executable).parent / "patchelf"
        if venv_patchelf.exists():
            result = subprocess.run(
                [str(venv_patchelf), "--set-rpath", ":".join(lib_dirs), str(exe)],
                capture_output=True,
                text=True,
                check=False,
            )
            if result.returncode == 0:
                print(f"  Successfully fixed RPATH for {exe.name}", file=sys.stderr)
            else:
                print(
                    f"  Failed to fix RPATH for {exe.name}: {result.stderr}",
                    file=sys.stderr,
                )
        else:
            print(
                f"  patchelf not available - RPATH fix skipped for {exe.name}",
                file=sys.stderr,
            )


def _verify_rpath_fix_linux(exe: "Path", lib_dirs: list[str]) -> None:
    """Verify that RPATH fix was successful on Linux."""
    try:
        verify_result = subprocess.run(
            ["patchelf", "--print-rpath", str(exe)],  # noqa: S607
            capture_output=True,
            text=True,
            check=False,
        )

        if verify_result.returncode == 0:
            current_rpath = verify_result.stdout.strip()
            print(f"  Current RPATH: {current_rpath}", file=sys.stderr)

            # Check if all required lib dirs are in RPATH
            rpath_dirs = current_rpath.split(":")
            missing_dirs = [d for d in lib_dirs if d not in rpath_dirs]

            if not missing_dirs:
                print(
                    f"  RPATH verification successful for {exe.name}",
                    file=sys.stderr,
                )
            else:
                print(
                    f"  RPATH verification failed for {exe.name} "
                    "- missing: {missing_dirs}",
                    file=sys.stderr,
                )
        else:
            print(
                f"  RPATH verification failed for {exe.name}: {verify_result.stderr}",
                file=sys.stderr,
            )
    except FileNotFoundError:
        print(
            f"  Could not verify RPATH for {exe.name} - patchelf not available",
            file=sys.stderr,
        )


__all__ = [
    "MMG_VERSION",
    "MmgMesh",
    "__version__",
    "mmg2d",
    "mmg3d",
    "mmgs",
]


# Auto-fix RPATH on import if needed (macOS only)
def _auto_fix_rpath_on_import() -> None:
    """Automatically fix RPATH on import if executables need it."""
    # Skip RPATH fixing on Windows entirely
    if sys.platform == "win32":
        return

    system = platform.system()
    if system not in ("Darwin", "Linux"):
        return

    try:
        # Quick check if RPATH fix is needed
        site_packages = Path(site.getsitepackages()[0])
        bin_dir = site_packages / "bin"

        if not bin_dir.exists():
            return

        executables = list(bin_dir.glob("mmg*_O3"))
        if not executables:
            return

        # Check if any executable needs RPATH fix
        needs_fix = False
        if system == "Darwin":
            for exe in executables:
                if not _has_correct_rpath(exe, "@loader_path/../mmgpy/lib"):
                    needs_fix = True
                    break
        elif system == "Linux":
            # For Linux, check if libraries can be found

            for exe in executables:
                result = subprocess.run(
                    ["ldd", str(exe)],  # noqa: S607
                    capture_output=True,
                    text=True,
                    check=False,
                )
                if "not found" in result.stdout:
                    needs_fix = True
                    break

        if needs_fix:
            print("Auto-fixing RPATH for MMG executables...", file=sys.stderr)
            _fix_rpath()

    except Exception:
        # Don't let RPATH fixing break package import
        pass


# Run RPATH auto-fix on import
_auto_fix_rpath_on_import()
