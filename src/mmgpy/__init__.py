"""Python bindings for the MMG library."""

from __future__ import annotations

import os
import platform
import site
import subprocess
import sys
from pathlib import Path
from typing import Any

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


# RPATH utilities
# ================
# RPATH is normally set by CMake at install time. These utilities are provided
# for diagnostics and manual fixing if needed.


def check_rpath() -> dict[str, Any]:  # pragma: no cover
    """Check RPATH status of MMG executables and libraries.

    Returns a dict with 'executables' and 'libraries' keys, each containing
    a list of dicts with 'name', 'path', 'rpath', 'expected', and 'ok' keys.
    On Windows, also includes a 'message' key explaining RPATH is not used.

    Example:
        >>> import mmgpy
        >>> status = mmgpy.check_rpath()
        >>> for exe in status['executables']:
        ...     print(f"{exe['name']}: {'OK' if exe['ok'] else 'NEEDS FIX'}")

    """
    system = platform.system()
    if system == "Windows":
        return {
            "executables": [],
            "libraries": [],
            "message": "RPATH not used on Windows",
        }

    site_packages = Path(site.getsitepackages()[0])
    result: dict[str, Any] = {
        "executables": [],
        "libraries": [],
    }

    bin_dir = site_packages / "bin"
    lib_dir = site_packages / "mmgpy" / "lib"

    if system == "Darwin":
        expected_exe_rpath = "@loader_path/../mmgpy/lib"
        expected_lib_rpath = "@loader_path"
    else:
        expected_exe_rpath = "$ORIGIN/../mmgpy/lib"
        expected_lib_rpath = "$ORIGIN"

    if bin_dir.exists():
        for exe in bin_dir.glob("mmg*_O3"):
            rpath = _get_rpath(exe, system)
            result["executables"].append(
                {
                    "name": exe.name,
                    "path": str(exe),
                    "rpath": rpath,
                    "expected": expected_exe_rpath,
                    "ok": expected_exe_rpath in rpath if rpath else False,
                },
            )

    if lib_dir.exists():
        pattern = "libmmg*.dylib" if system == "Darwin" else "libmmg*.so*"
        for lib in lib_dir.glob(pattern):
            if lib.is_symlink():
                continue
            rpath = _get_rpath(lib, system)
            result["libraries"].append(
                {
                    "name": lib.name,
                    "path": str(lib),
                    "rpath": rpath,
                    "expected": expected_lib_rpath,
                    "ok": expected_lib_rpath in rpath if rpath else False,
                },
            )

    return result


def _get_rpath(binary: Path, system: str) -> str:  # pragma: no cover
    """Get RPATH of a binary file."""
    if system == "Darwin":
        proc = subprocess.run(
            ["/usr/bin/otool", "-l", str(binary)],
            capture_output=True,
            text=True,
            check=False,
        )
        if proc.returncode != 0:
            return ""
        rpaths = []
        lines = proc.stdout.split("\n")
        for i, line in enumerate(lines):
            if "LC_RPATH" in line and i + 2 < len(lines):
                path_line = lines[i + 2].strip()
                if path_line.startswith("path "):
                    rpaths.append(path_line.split()[1])
        return ":".join(rpaths)
    proc = subprocess.run(
        ["patchelf", "--print-rpath", str(binary)],
        capture_output=True,
        text=True,
        check=False,
    )
    return proc.stdout.strip() if proc.returncode == 0 else ""


def _fix_rpath() -> None:  # pragma: no cover
    """Fix RPATH for MMG executables (manual utility).

    Normally RPATH is set by CMake at install time. Use this function only if
    executables fail to find their libraries after installation.

    Example:
        >>> import mmgpy
        >>> mmgpy._fix_rpath()  # Only if check_rpath() shows issues

    """
    system = platform.system()
    if system not in ("Darwin", "Linux"):
        _logger.debug("RPATH fix not applicable for %s", system)
        return

    site_packages = Path(site.getsitepackages()[0])
    bin_dir = site_packages / "bin"

    if not bin_dir.exists():
        _logger.warning("Bin directory not found: %s", bin_dir)
        return

    executables = list(bin_dir.glob("mmg*_O3"))
    if not executables:
        _logger.info("No MMG executables found to fix")
        return

    if system == "Darwin":
        target_rpath = "@loader_path/../mmgpy/lib"
        for exe in executables:
            subprocess.run(
                ["/usr/bin/install_name_tool", "-delete_rpath", "@rpath", str(exe)],
                capture_output=True,
                check=False,
            )
            result = subprocess.run(
                ["/usr/bin/install_name_tool", "-add_rpath", target_rpath, str(exe)],
                capture_output=True,
                text=True,
                check=False,
            )
            if result.returncode == 0:
                _logger.info("Fixed RPATH for %s", exe.name)
            else:
                _logger.error("Failed to fix %s: %s", exe.name, result.stderr)
    else:
        target_rpath = "$ORIGIN/../mmgpy/lib"
        patchelf = "patchelf"
        venv_patchelf = Path(sys.executable).parent / "patchelf"
        if venv_patchelf.exists():
            patchelf = str(venv_patchelf)

        for exe in executables:
            result = subprocess.run(
                [patchelf, "--set-rpath", target_rpath, str(exe)],
                capture_output=True,
                text=True,
                check=False,
            )
            if result.returncode == 0:
                _logger.info("Fixed RPATH for %s", exe.name)
            else:
                _logger.error("Failed to fix %s: %s", exe.name, result.stderr)


from . import interactive, lagrangian, metrics, progress, repair, sizing
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
    "check_rpath",
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
    "repair",
    "rich_progress",
    "set_log_level",
    "sizing",
    "to_pyvista",
]
