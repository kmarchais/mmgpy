"""Python bindings for the MMG library."""

from __future__ import annotations

import logging
import site
import subprocess
import sys
from pathlib import Path

from ._logging import (
    configure_logging,
    disable_logging,
    enable_debug,
    get_log_file,
    get_logger,
    set_log_file,
    set_log_level,
)

_logger = get_logger()

# Version info
try:
    from . import _version  # type: ignore[attr-defined]

    __version__ = _version.__version__
except ImportError:
    __version__ = "unknown"

# Core C++ bindings
from ._mmgpy import (  # type: ignore[attr-defined]
    MMG_VERSION,
    mmg2d,  # noqa: F401  # Available for advanced users
    mmg3d,  # noqa: F401  # Available for advanced users
    mmgs,  # noqa: F401  # Available for advanced users
)


def _get_cli_logger() -> logging.Logger:  # pragma: no cover
    """Get a simple stdlib logger for CLI entry points.

    Uses plain StreamHandler to avoid Rich console issues on Windows pipes.
    """
    logger = logging.getLogger("mmgpy.cli")
    if not logger.handlers:
        handler = logging.StreamHandler(sys.stderr)
        handler.setFormatter(logging.Formatter("%(levelname)s: %(message)s"))
        logger.addHandler(handler)
        logger.setLevel(logging.DEBUG)
    return logger


def _find_mmg_executable(base_name: str) -> str | None:  # pragma: no cover
    """Find an MMG executable in mmgpy/bin or venv bin directory.

    Note: We do NOT use shutil.which() because it would find the Python
    entry point scripts in venv/bin/, causing infinite recursion.

    Args:
        base_name: Base name of executable (e.g., "mmg3d_O3")

    Returns:
        Full path to executable, or None if not found

    """
    exe_name = f"{base_name}.exe" if sys.platform == "win32" else base_name

    # Check mmgpy/bin relative to this package (works for wheel installs)
    package_bin = Path(__file__).parent / "bin" / exe_name
    if package_bin.exists():
        return str(package_bin)

    # Fall back to mmgpy/bin in site-packages (for editable installs)
    site_packages_list = site.getsitepackages()
    # On Windows, prefer the actual site-packages over the venv root
    if sys.platform == "win32" and len(site_packages_list) > 1:
        site_packages = Path(site_packages_list[1])
    else:
        site_packages = Path(site_packages_list[0])

    exe_path = site_packages / "mmgpy" / "bin" / exe_name
    if exe_path.exists():
        return str(exe_path)

    # Check venv bin/Scripts directory (executables copied there by CMake)
    # This is the fallback for editable installs where CMake copies executables
    venv_bin_name = "Scripts" if sys.platform == "win32" else "bin"
    venv_bin = Path(sys.prefix) / venv_bin_name / exe_name
    # Only use if it's an actual executable (not a Python entry point script)
    # Native executables are typically larger than 1KB (Python scripts are ~300 bytes)
    min_native_exe_size = 1024
    if venv_bin.exists() and venv_bin.stat().st_size > min_native_exe_size:
        return str(venv_bin)

    # For editable installs, check the scikit-build-core build directory
    # The build directory is typically at the project root (parent of src/)
    package_dir = Path(__file__).parent
    if "src" in str(package_dir):
        # Editable install - look in build directory
        project_root = package_dir.parent.parent  # src/mmgpy -> src -> project_root
        build_dir = project_root / "build"
        if build_dir.exists():
            # Search for executable in any build subdirectory
            for build_subdir in build_dir.iterdir():
                if build_subdir.is_dir():
                    exe_path = build_subdir / "mmgpy" / "bin" / exe_name
                    if exe_path.exists():
                        return str(exe_path)

    return None


def _run_mmg2d() -> None:  # pragma: no cover
    """Run the mmg2d_O3 executable."""
    exe_path = _find_mmg_executable("mmg2d_O3")
    if exe_path:
        subprocess.run([exe_path, *sys.argv[1:]], check=False)
    else:
        _get_cli_logger().error("mmg2d_O3 executable not found")
        sys.exit(1)


def _run_mmg3d() -> None:  # pragma: no cover
    """Run the mmg3d_O3 executable."""
    exe_path = _find_mmg_executable("mmg3d_O3")
    if exe_path:
        subprocess.run([exe_path, *sys.argv[1:]], check=False)
    else:
        _get_cli_logger().error("mmg3d_O3 executable not found")
        sys.exit(1)


def _run_mmgs() -> None:  # pragma: no cover
    """Run the mmgs_O3 executable."""
    exe_path = _find_mmg_executable("mmgs_O3")
    if exe_path:
        subprocess.run([exe_path, *sys.argv[1:]], check=False)
    else:
        _get_cli_logger().error("mmgs_O3 executable not found")
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
        _get_cli_logger().error("No input mesh file found in arguments")
        sys.exit(1)

    # Detect mesh type
    try:
        meshio_mesh = meshio.read(input_mesh)
        mesh_kind = _detect_mesh_kind(meshio_mesh)
    except Exception:  # noqa: BLE001
        _get_cli_logger().exception(
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


from . import interactive, lagrangian, metrics, progress, repair, sizing
from ._io import read
from ._mesh import Mesh, MeshCheckpoint, MeshKind
from ._options import Mmg2DOptions, Mmg3DOptions, MmgSOptions
from ._progress import CancellationError, ProgressEvent, rich_progress
from ._pyvista import from_pyvista, to_pyvista
from ._result import RemeshResult
from ._transfer import interpolate_field, transfer_fields
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
    "CancellationError",
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
    "configure_logging",
    "detect_boundary_vertices",
    "disable_logging",
    "enable_debug",
    "from_pyvista",
    "get_log_file",
    "get_logger",
    "interactive",
    "interpolate_field",
    "lagrangian",
    "metrics",
    "move_mesh",
    "progress",
    "propagate_displacement",
    "read",
    "repair",
    "rich_progress",
    "set_log_file",
    "set_log_level",
    "sizing",
    "to_pyvista",
    "transfer_fields",
]
