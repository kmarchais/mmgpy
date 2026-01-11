"""Python bindings for the MMG library."""

import os
import platform
import site
import subprocess
import sys
from pathlib import Path

from ._logging import (
    disable_logging,
    enable_debug,
    get_logger,
    set_log_level,
)

_logger = get_logger()

# Handle DLL loading on Windows
if sys.platform == "win32":  # pragma: no cover
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
                _logger.debug("Added DLL directory: %s", dll_dir)
            except (OSError, AttributeError):
                os.environ.setdefault("PATH", "")
                if str(dll_dir) not in os.environ["PATH"]:
                    os.environ["PATH"] = str(dll_dir) + os.pathsep + os.environ["PATH"]
                    _logger.debug("Added to PATH: %s", dll_dir)

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
        mmg2d,  # noqa: F401  # Available for advanced users
        mmg3d,  # noqa: F401  # Available for advanced users
        mmgs,  # noqa: F401  # Available for advanced users
    )

except ImportError:  # pragma: no cover
    if sys.platform == "win32":
        _module_dir = Path(__file__).absolute().parent
        available_files = list(_module_dir.glob("*"))
        lib_files = list(_module_dir.glob("**/*.dll")) + list(
            _module_dir.glob("**/*.pyd"),
        )

        _logger.exception(
            "Failed to import _mmgpy module on Windows.\n"
            "Module directory: %s\n"
            "Available files: %s\n"
            "Found DLLs/PYDs: %s\n"
            "To debug, set MMGPY_DEBUG=1 or call mmgpy.enable_debug().",
            _module_dir,
            [f.name for f in available_files],
            [str(f) for f in lib_files],
        )
    raise


def _run_mmg2d() -> None:  # pragma: no cover
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
        subprocess.run([str(exe_path), *sys.argv[1:]], check=False)
    else:
        _logger.error("mmg2d_O3 executable not found at %s", exe_path)
        sys.exit(1)


def _run_mmg3d() -> None:  # pragma: no cover
    """Run the mmg3d_O3 executable."""
    site_packages_list = site.getsitepackages()
    if sys.platform == "win32" and len(site_packages_list) > 1:
        site_packages = Path(site_packages_list[1])
    else:
        site_packages = Path(site_packages_list[0])

    scripts_dir = "bin"
    exe_name = "mmg3d_O3.exe" if sys.platform == "win32" else "mmg3d_O3"
    exe_path = site_packages / scripts_dir / exe_name

    if exe_path.exists():
        subprocess.run([str(exe_path), *sys.argv[1:]], check=False)
    else:
        _logger.error("mmg3d_O3 executable not found at %s", exe_path)
        sys.exit(1)


def _run_mmgs() -> None:  # pragma: no cover
    """Run the mmgs_O3 executable."""
    site_packages_list = site.getsitepackages()
    if sys.platform == "win32" and len(site_packages_list) > 1:
        site_packages = Path(site_packages_list[1])
    else:
        site_packages = Path(site_packages_list[0])

    scripts_dir = "bin"
    exe_name = "mmgs_O3.exe" if sys.platform == "win32" else "mmgs_O3"
    exe_path = site_packages / scripts_dir / exe_name

    if exe_path.exists():
        subprocess.run([str(exe_path), *sys.argv[1:]], check=False)
    else:
        _logger.error("mmgs_O3 executable not found at %s", exe_path)
        sys.exit(1)


def _run_mmg() -> None:  # pragma: no cover
    """Run the appropriate mmg executable based on auto-detected mesh type.

    This unified command automatically detects the mesh type from the input file
    and delegates to the appropriate mmg2d_O3, mmg3d_O3, or mmgs_O3 executable.
    """
    import meshio  # noqa: PLC0415

    from ._io import _detect_mesh_kind  # noqa: PLC0415
    from ._mesh import MeshKind  # noqa: PLC0415

    args = sys.argv[1:]
    if not args or args[0] in ("-h", "--help"):
        print(  # noqa: T201
            "mmg - Unified mesh remeshing tool with auto-detection\n\n"
            "Usage: mmg <input_mesh> [options]\n\n"
            "This command automatically detects the mesh type and delegates to:\n"
            "  - mmg2d (or mmg2d_O3) for 2D planar meshes (triangles with z~=0)\n"
            "  - mmg3d (or mmg3d_O3) for 3D volumetric meshes (tetrahedra)\n"
            "  - mmgs (or mmgs_O3) for 3D surface meshes (triangles in 3D space)\n\n"
            "All standard mmg options are passed through to the executable.\n"
            "Run 'mmg3d -h', 'mmg2d -h', or 'mmgs -h' for specific options.",
        )
        sys.exit(0)

    if args[0] in ("-v", "--version"):
        print(f"mmgpy {__version__}")  # noqa: T201
        print(f"MMG   {MMG_VERSION}")  # noqa: T201
        sys.exit(0)

    # MMG flags that take an argument (skip the next arg when detecting input file)
    flags_with_args = {
        "-o",
        "-out",
        "-sol",
        "-met",
        "-ls",
        "-lag",
        "-ar",
        "-nr",
        "-hmin",
        "-hmax",
        "-hsiz",
        "-hausd",
        "-hgrad",
        "-hgradreq",
        "-m",
        "-v",
        "-xreg",
        "-nreg",
        "-nsd",
    }

    # Find the input mesh file (first positional argument that's a file)
    input_mesh = None
    skip_next = False
    for arg in args:
        if skip_next:
            skip_next = False
            continue
        if arg in flags_with_args:
            skip_next = True
            continue
        if not arg.startswith("-") and Path(arg).exists():
            input_mesh = arg
            break

    if input_mesh is None:
        _logger.error("No input mesh file found in arguments")
        sys.exit(1)

    # Detect mesh type
    try:
        meshio_mesh = meshio.read(input_mesh)
        mesh_kind = _detect_mesh_kind(meshio_mesh)
    except Exception:
        _logger.exception(
            "Failed to detect mesh type from '%s'. "
            "Try using a specific command instead: mmg3d, mmg2d, or mmgs",
            input_mesh,
        )
        sys.exit(1)

    # Map mesh kind to executable
    exe_map = {
        MeshKind.TETRAHEDRAL: ("mmg3d_O3", _run_mmg3d),
        MeshKind.TRIANGULAR_2D: ("mmg2d_O3", _run_mmg2d),
        MeshKind.TRIANGULAR_SURFACE: ("mmgs_O3", _run_mmgs),
    }

    exe_name, run_func = exe_map[mesh_kind]
    _logger.info("Detected %s mesh, using %s", mesh_kind.value, exe_name)

    # Delegate to the appropriate executable
    run_func()


def _fix_rpath() -> None:  # pragma: no cover
    """Fix RPATH for MMG executables - post-install utility."""
    system = platform.system()
    if system == "Darwin":
        try:
            _fix_rpath_macos()
        except (OSError, subprocess.SubprocessError):
            _logger.exception("Error fixing RPATH")
            raise
    elif system == "Linux":
        try:
            _fix_rpath_linux()
        except (OSError, subprocess.SubprocessError):
            _logger.exception("Error fixing RPATH")
            raise
    else:
        _logger.debug("RPATH fix not needed for %s", system)


def _fix_rpath_macos() -> None:  # pragma: no cover
    """Fix RPATH for MMG executables on macOS."""
    site_packages = Path(site.getsitepackages()[0])
    _logger.debug("Site packages: %s", site_packages)

    bin_dir = site_packages / "bin"
    if not bin_dir.exists():
        _logger.warning("Bin directory does not exist: %s", bin_dir)
        return

    executables = list(bin_dir.glob("mmg*_O3"))
    if not executables:
        _logger.warning("No MMG executables found")
        return

    _logger.debug("Found %d executables to fix", len(executables))

    for exe in executables:
        _fix_single_executable_rpath(exe)


def _fix_single_executable_rpath(exe: "Path") -> None:  # pragma: no cover
    """Fix RPATH for a single executable."""
    _logger.debug("Fixing RPATH for %s...", exe.name)

    if not exe.exists() or not exe.is_file():
        _logger.debug("Skipping %s - not a valid file", exe.name)
        return

    target_rpath = "@loader_path/../mmgpy/lib"

    if _has_correct_rpath(exe, target_rpath):
        _logger.debug("RPATH already correct for %s", exe.name)
        return

    _remove_old_rpath(exe)
    if _add_new_rpath(exe, target_rpath):
        _verify_rpath_fix(exe, target_rpath)


def _has_correct_rpath(exe: "Path", target_rpath: str) -> bool:  # pragma: no cover
    """Check if executable has the correct RPATH."""
    result = subprocess.run(
        ["/usr/bin/otool", "-l", str(exe)],
        capture_output=True,
        text=True,
        check=False,
    )
    return result.returncode == 0 and target_rpath in result.stdout


def _remove_old_rpath(exe: "Path") -> None:  # pragma: no cover
    """Remove existing @rpath entries from executable."""
    subprocess.run(
        ["/usr/bin/install_name_tool", "-delete_rpath", "@rpath", str(exe)],
        check=False,
        capture_output=True,
    )


def _add_new_rpath(exe: "Path", target_rpath: str) -> bool:  # pragma: no cover
    """Add new RPATH to executable. Returns True if successful."""
    result = subprocess.run(
        ["/usr/bin/install_name_tool", "-add_rpath", target_rpath, str(exe)],
        capture_output=True,
        text=True,
        check=False,
    )

    if result.returncode == 0:
        _logger.info("Successfully fixed RPATH for %s", exe.name)
        return True
    _logger.error("Failed to fix RPATH for %s: %s", exe.name, result.stderr)
    return False


def _verify_rpath_fix(exe: "Path", target_rpath: str) -> None:  # pragma: no cover
    """Verify that RPATH fix was successful."""
    verify_result = subprocess.run(
        ["/usr/bin/otool", "-l", str(exe)],
        capture_output=True,
        text=True,
        check=False,
    )

    if target_rpath in verify_result.stdout:
        _logger.debug("RPATH verification successful for %s", exe.name)
    else:
        _logger.warning("RPATH verification failed for %s", exe.name)


def _fix_rpath_linux() -> None:  # pragma: no cover
    """Fix RPATH for MMG executables on Linux using patchelf."""
    site_packages = Path(site.getsitepackages()[0])
    _logger.debug("Site packages: %s", site_packages)

    bin_dir = site_packages / "bin"
    if not bin_dir.exists():
        _logger.warning("Bin directory does not exist: %s", bin_dir)
        return

    executables = list(bin_dir.glob("mmg*_O3"))
    if not executables:
        _logger.warning("No MMG executables found")
        return

    _logger.debug("Found %d executables to fix", len(executables))

    lib_dirs = [
        str(site_packages / "lib"),
        str(site_packages / "mmgpy" / "lib"),
    ]

    for exe in executables:
        _fix_single_executable_rpath_linux(exe, lib_dirs)


def _fix_single_executable_rpath_linux(  # pragma: no cover
    exe: "Path",
    lib_dirs: list[str],
) -> None:
    """Fix RPATH for a single executable on Linux."""
    _logger.debug("Fixing RPATH for %s...", exe.name)

    if not exe.exists() or not exe.is_file():
        _logger.debug("Skipping %s - not a valid file", exe.name)
        return

    try:
        rpath = ":".join(lib_dirs)
        result = subprocess.run(
            ["patchelf", "--set-rpath", rpath, str(exe)],  # noqa: S607
            capture_output=True,
            text=True,
            check=False,
        )

        if result.returncode == 0:
            _logger.info("Successfully fixed RPATH for %s", exe.name)
            _verify_rpath_fix_linux(exe, lib_dirs)
        else:
            _logger.error("Failed to fix RPATH for %s: %s", exe.name, result.stderr)

    except FileNotFoundError:
        _logger.debug("patchelf not found - trying venv patchelf...")
        venv_patchelf = Path(sys.executable).parent / "patchelf"
        if venv_patchelf.exists():
            result = subprocess.run(
                [str(venv_patchelf), "--set-rpath", ":".join(lib_dirs), str(exe)],
                capture_output=True,
                text=True,
                check=False,
            )
            if result.returncode == 0:
                _logger.info("Successfully fixed RPATH for %s", exe.name)
            else:
                _logger.error(  # noqa: TRY400
                    "Failed to fix RPATH for %s: %s",
                    exe.name,
                    result.stderr,
                )
        else:
            _logger.warning(
                "patchelf not available - RPATH fix skipped for %s",
                exe.name,
            )


def _verify_rpath_fix_linux(  # pragma: no cover
    exe: "Path",
    lib_dirs: list[str],
) -> None:
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
            _logger.debug("Current RPATH: %s", current_rpath)

            rpath_dirs = current_rpath.split(":")
            missing_dirs = [d for d in lib_dirs if d not in rpath_dirs]

            if not missing_dirs:
                _logger.debug("RPATH verification successful for %s", exe.name)
            else:
                _logger.warning(
                    "RPATH verification failed for %s - missing: %s",
                    exe.name,
                    missing_dirs,
                )
        else:
            _logger.warning(
                "RPATH verification failed for %s: %s",
                exe.name,
                verify_result.stderr,
            )
    except FileNotFoundError:
        _logger.debug(
            "Could not verify RPATH for %s - patchelf not available",
            exe.name,
        )


from . import interactive, lagrangian, metrics, progress, sizing
from ._io import read
from ._mesh import Mesh, MeshCheckpoint, MeshKind
from ._options import Mmg2DOptions, Mmg3DOptions, MmgSOptions
from ._progress import ProgressEvent, rich_progress
from ._pyvista import from_pyvista, to_pyvista
from ._result import RemeshResult
from ._validation import (
    IssueSeverity,
    QualityStats,
    ValidationError,
    ValidationIssue,
    ValidationReport,
)
from .lagrangian import detect_boundary_vertices, move_mesh, propagate_displacement
from .sizing import (
    BoxSize,
    CylinderSize,
    PointSize,
    SizingConstraint,
    SphereSize,
    apply_sizing_constraints,
)

__all__ = [
    "MMG_VERSION",
    "BoxSize",
    "CylinderSize",
    "IssueSeverity",
    "Mesh",
    "MeshCheckpoint",
    "MeshKind",
    "Mmg2DOptions",
    "Mmg3DOptions",
    "MmgSOptions",
    "PointSize",
    "ProgressEvent",
    "QualityStats",
    "RemeshResult",
    "SizingConstraint",
    "SphereSize",
    "ValidationError",
    "ValidationIssue",
    "ValidationReport",
    "__version__",
    "apply_sizing_constraints",
    "detect_boundary_vertices",
    "disable_logging",
    "enable_debug",
    "from_pyvista",
    "interactive",
    "lagrangian",
    "metrics",
    "move_mesh",
    "progress",
    "propagate_displacement",
    "read",
    "rich_progress",
    "set_log_level",
    "sizing",
    "to_pyvista",
]


# Auto-fix RPATH on import if needed (macOS only)
def _auto_fix_rpath_on_import() -> None:  # pragma: no cover
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
            _logger.info("Auto-fixing RPATH for MMG executables...")
            _fix_rpath()

    except Exception:
        # Don't let RPATH fixing break package import
        pass


# Run RPATH auto-fix on import
_auto_fix_rpath_on_import()
