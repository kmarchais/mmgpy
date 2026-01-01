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
        MmgMesh2D,
        MmgMesh3D,
        MmgMeshS,
        mmg2d,
        mmg3d,
        mmgs,
    )

except ImportError:
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
        subprocess.run([str(exe_path)] + sys.argv[1:], check=False)
    else:
        _logger.error("mmg2d_O3 executable not found at %s", exe_path)
        sys.exit(1)


def _run_mmg3d() -> None:
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
        subprocess.run([str(exe_path)] + sys.argv[1:], check=False)
    else:
        _logger.error("mmg3d_O3 executable not found at %s", exe_path)
        sys.exit(1)


def _run_mmgs() -> None:
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
        subprocess.run([str(exe_path)] + sys.argv[1:], check=False)
    else:
        _logger.error("mmgs_O3 executable not found at %s", exe_path)
        sys.exit(1)


def _fix_rpath() -> None:
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


def _fix_rpath_macos() -> None:
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


def _fix_single_executable_rpath(exe: "Path") -> None:
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
        _logger.info("Successfully fixed RPATH for %s", exe.name)
        return True
    _logger.error("Failed to fix RPATH for %s: %s", exe.name, result.stderr)
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
        _logger.debug("RPATH verification successful for %s", exe.name)
    else:
        _logger.warning("RPATH verification failed for %s", exe.name)


def _fix_rpath_linux() -> None:
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


def _fix_single_executable_rpath_linux(exe: "Path", lib_dirs: list[str]) -> None:
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


from . import lagrangian, metrics, progress
from ._options import Mmg2DOptions, Mmg3DOptions, MmgSOptions
from ._progress import ProgressEvent, rich_progress
from ._pyvista import add_pyvista_methods, from_pyvista, to_pyvista
from .lagrangian import detect_boundary_vertices, move_mesh, propagate_displacement

# Add from_pyvista/to_pyvista methods to mesh classes
add_pyvista_methods()


def _add_convenience_methods() -> None:
    """Add convenience remeshing methods and wrap remesh() to accept options objects."""
    from collections.abc import Callable  # noqa: PLC0415
    from typing import Any  # noqa: PLC0415

    # Wrap remesh() to accept options objects directly
    _original_remesh_3d = MmgMesh3D.remesh
    _original_remesh_2d = MmgMesh2D.remesh
    _original_remesh_s = MmgMeshS.remesh

    def _make_remesh_wrapper(
        original_remesh: Callable[..., None],
    ) -> Callable[..., None]:
        def _wrapped_remesh(
            self: MmgMesh3D | MmgMesh2D | MmgMeshS,
            options: Mmg3DOptions | Mmg2DOptions | MmgSOptions | None = None,
            **kwargs: Any,  # noqa: ANN401
        ) -> None:
            if options is not None:
                if kwargs:
                    msg = (
                        "Cannot pass both options object and keyword arguments. "
                        "Use one or the other."
                    )
                    raise TypeError(msg)
                # Options object passed - convert to kwargs
                kwargs = options.to_dict()
            original_remesh(self, **kwargs)

        return _wrapped_remesh

    MmgMesh3D.remesh = _make_remesh_wrapper(_original_remesh_3d)  # type: ignore[method-assign]
    MmgMesh2D.remesh = _make_remesh_wrapper(_original_remesh_2d)  # type: ignore[method-assign]
    MmgMeshS.remesh = _make_remesh_wrapper(_original_remesh_s)  # type: ignore[method-assign]

    def _remesh_optimize(
        self: MmgMesh3D | MmgMesh2D | MmgMeshS,
        *,
        verbose: int | None = None,
    ) -> None:
        """Optimize mesh quality without changing topology.

        Only moves vertices to improve element quality.
        No points are inserted or removed.

        Parameters
        ----------
        verbose : int | None
            Verbosity level (-1=silent, 0=errors, 1=info).

        """
        opts: dict[str, int] = {"optim": 1, "noinsert": 1}
        if verbose is not None:
            opts["verbose"] = verbose
        self.remesh(**opts)  # type: ignore[arg-type]

    def _remesh_uniform(
        self: MmgMesh3D | MmgMesh2D | MmgMeshS,
        size: float,
        *,
        verbose: int | None = None,
    ) -> None:
        """Remesh with uniform element size.

        Parameters
        ----------
        size : float
            Target edge size for all elements.
        verbose : int | None
            Verbosity level (-1=silent, 0=errors, 1=info).

        """
        opts: dict[str, float | int] = {"hsiz": size}
        if verbose is not None:
            opts["verbose"] = verbose
        self.remesh(**opts)  # type: ignore[arg-type]

    MmgMesh3D.remesh_optimize = _remesh_optimize  # type: ignore[attr-defined]
    MmgMesh3D.remesh_uniform = _remesh_uniform  # type: ignore[attr-defined]

    MmgMesh2D.remesh_optimize = _remesh_optimize  # type: ignore[attr-defined]
    MmgMesh2D.remesh_uniform = _remesh_uniform  # type: ignore[attr-defined]

    MmgMeshS.remesh_optimize = _remesh_optimize  # type: ignore[attr-defined]
    MmgMeshS.remesh_uniform = _remesh_uniform  # type: ignore[attr-defined]


_add_convenience_methods()

__all__ = [
    "MMG_VERSION",
    "Mmg2DOptions",
    "Mmg3DOptions",
    "MmgMesh2D",
    "MmgMesh3D",
    "MmgMeshS",
    "MmgSOptions",
    "ProgressEvent",
    "__version__",
    "detect_boundary_vertices",
    "disable_logging",
    "enable_debug",
    "from_pyvista",
    "lagrangian",
    "metrics",
    "mmg2d",
    "mmg3d",
    "mmgs",
    "move_mesh",
    "progress",
    "propagate_displacement",
    "rich_progress",
    "set_log_level",
    "to_pyvista",
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
            _logger.info("Auto-fixing RPATH for MMG executables...")
            _fix_rpath()

    except Exception:
        # Don't let RPATH fixing break package import
        pass


# Run RPATH auto-fix on import
_auto_fix_rpath_on_import()
