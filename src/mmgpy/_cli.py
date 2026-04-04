"""Lightweight CLI entry point for the unified ``mmg`` command.

The ``mmg`` command auto-detects the mesh type (2D, 3D, surface) from the
input file and remeshes it using the Python API — no subprocess is spawned,
and the file is read only once.

All standard MMG flags (``-hmax``, ``-hausd``, ``-hgrad``, etc.) are supported
and mapped directly to the underlying C++ library calls.
"""

from __future__ import annotations

import logging
import site
import stat
import sys
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any


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


def _ensure_executable(path: Path) -> None:  # pragma: no cover
    """Ensure a file has execute permissions (Unix only).

    .. note:: Kept for the public API re-export in ``__init__.py``
       (used by tests and downstream code).
    """
    if sys.platform == "win32":
        return

    try:
        current_mode = path.stat().st_mode
        new_mode = current_mode | (
            (current_mode & stat.S_IRUSR and stat.S_IXUSR)
            | (current_mode & stat.S_IRGRP and stat.S_IXGRP)
            | (current_mode & stat.S_IROTH and stat.S_IXOTH)
        )
        if new_mode != current_mode:
            path.chmod(new_mode)
    except OSError:
        pass


def _find_mmg_executable(base_name: str) -> str | None:  # pragma: no cover
    """Find an MMG executable in mmgpy/bin, venv bin, or system PATH.

    .. note:: No longer used by the CLI entry point (the unified ``mmg``
       command calls the Python API directly).  Kept for the public
       re-export in ``__init__.py`` and for test usage.

    Args:
        base_name: Base name of executable (e.g., "mmg3d_O3")

    Returns:
        Full path to executable, or None if not found

    """
    exe_name = f"{base_name}.exe" if sys.platform == "win32" else base_name

    # Check mmgpy/bin relative to this package (works for wheel installs)
    package_bin = Path(__file__).parent / "bin" / exe_name
    if package_bin.exists():
        _ensure_executable(package_bin)
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
        _ensure_executable(exe_path)
        return str(exe_path)

    # Check venv bin/Scripts directory (executables copied there by CMake)
    venv_bin_name = "Scripts" if sys.platform == "win32" else "bin"
    venv_bin = Path(sys.prefix) / venv_bin_name / exe_name
    # Only use if it's an actual executable (not a Python entry point script)
    min_native_exe_size = 1024
    if venv_bin.exists() and venv_bin.stat().st_size > min_native_exe_size:
        _ensure_executable(venv_bin)
        return str(venv_bin)

    # For editable installs, check the scikit-build-core build directory
    package_dir = Path(__file__).parent
    if "src" in str(package_dir):
        project_root = package_dir.parent.parent
        build_dir = project_root / "build"
        if build_dir.exists():
            for build_subdir in build_dir.iterdir():
                if build_subdir.is_dir():
                    exe_path = build_subdir / "mmgpy" / "bin" / exe_name
                    if exe_path.exists():
                        _ensure_executable(exe_path)
                        return str(exe_path)

    # Last resort: check system PATH via shutil.which()
    import shutil  # noqa: PLC0415

    result = shutil.which(base_name)
    if result:
        return result

    return None


# -- Argument parsing --------------------------------------------------------

# MMG flags that take a numeric or path argument.
_FLAGS_WITH_VALUE = {
    "-in",
    "-o",
    "-out",
    "-sol",
    "-met",
    "-ls",
    "-lag",
    "-ar",
    "-nr",  # consumed but intentionally unhandled (MMG no-ridge flag)
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

# Flags that map directly to remesh **kwargs (flag name minus leading dash).
_NUMERIC_OPTION_FLAGS = {
    "-hmin",
    "-hmax",
    "-hsiz",
    "-hausd",
    "-hgrad",
    "-hgradreq",
    "-ar",
    "-xreg",
    "-nreg",
    "-nsd",
}

# Boolean flags (no value) that map to remesh **kwargs = 1.
_BOOLEAN_OPTION_FLAGS = {
    "-noinsert",
    "-noswap",
    "-nomove",
    "-nosurf",
    "-optim",
}


@dataclass
class _ParsedArgs:
    """Structured representation of parsed CLI arguments."""

    input_mesh: str | None = None
    output_mesh: str | None = None
    sol_file: str | None = None
    met_file: str | None = None
    ls_value: float | None = None
    lag_value: int | None = None
    remesh_options: dict[str, Any] = field(default_factory=dict)


def _parse_args(args: list[str]) -> _ParsedArgs:
    """Parse MMG-style CLI arguments into structured form.

    Handles ``-flag value`` pairs, boolean flags, and positional input file
    detection.  Unknown flags are silently ignored so that the CLI remains
    forward-compatible with new MMG options.
    """
    parsed = _ParsedArgs()
    i = 0
    while i < len(args):
        arg = args[i]

        # -- flags with a value argument -------------------------------------
        if arg in _FLAGS_WITH_VALUE and i + 1 < len(args):
            value = args[i + 1]
            if arg == "-in":
                parsed.input_mesh = value
            elif arg in ("-o", "-out"):
                parsed.output_mesh = value
            elif arg == "-sol":
                parsed.sol_file = value
            elif arg == "-met":
                parsed.met_file = value
            elif arg == "-ls":
                parsed.ls_value = float(value)
            elif arg == "-lag":
                parsed.lag_value = int(value)
            elif arg == "-v":
                parsed.remesh_options["verbose"] = int(value)
            elif arg == "-m":
                parsed.remesh_options["mem"] = int(value)
            elif arg in _NUMERIC_OPTION_FLAGS:
                key = arg.lstrip("-")
                parsed.remesh_options[key] = float(value)
            # -nr and other unknown value-flags are skipped
            i += 2
            continue

        # -- boolean flags (no value) ----------------------------------------
        if arg in _BOOLEAN_OPTION_FLAGS:
            key = arg.lstrip("-")
            parsed.remesh_options[key] = 1
            i += 1
            continue

        # -- positional: first non-flag existing file is input ---------------
        if not arg.startswith("-") and parsed.input_mesh is None and Path(arg).exists():
            parsed.input_mesh = arg

        i += 1

    return parsed


def _default_output_path(input_path: str) -> str:
    """Derive the default output path following MMG convention.

    ``input.mesh`` → ``input.o.mesh``
    """
    p = Path(input_path)
    return str(p.with_name(f"{p.stem}.o{p.suffix}"))


# -- Main entry point -------------------------------------------------------


def _run_mmg() -> None:  # pragma: no cover
    """Run the unified ``mmg`` command.

    Auto-detects mesh type from the input file, then remeshes via the
    Python API (single read, no subprocess).
    """
    args = sys.argv[1:]

    # -- help ----------------------------------------------------------------
    if not args or args[0] in ("-h", "--help"):
        print(
            "mmg - Unified mesh remeshing tool with auto-detection\n\n"
            "Usage: mmg [options] <input_mesh>\n"
            "       mmg <input_mesh> [options]\n\n"
            "This command automatically detects the mesh type and remeshes\n"
            "using the appropriate MMG library (mmg2d, mmg3d, or mmgs).\n\n"
            "Options:\n"
            "  -in <file>      Input mesh file (or pass as positional arg)\n"
            "  -o <file>       Output mesh file (default: <input>.o.<ext>)\n"
            "  -sol <file>     Input solution file (.sol/.solb)\n"
            "  -met <file>     Input metric file (.sol/.solb)\n"
            "  -hmin <val>     Minimum edge size\n"
            "  -hmax <val>     Maximum edge size\n"
            "  -hsiz <val>     Constant edge size\n"
            "  -hausd <val>    Hausdorff distance for geometry approximation\n"
            "  -hgrad <val>    Gradation parameter (>= 1.0)\n"
            "  -hgradreq <val> Gradation on required entities\n"
            "  -ar <val>       Angle detection threshold (degrees)\n"
            "  -ls <val>       Level-set mode with isovalue\n"
            "  -lag <val>      Lagrangian mode (0, 1, or 2)\n"
            "  -v <val>        Verbosity (-1=silent, 0=errors, 1=info)\n"
            "  -m <val>        Maximum memory (MB)\n"
            "  -noinsert       Disable point insertion\n"
            "  -noswap         Disable edge/face swapping\n"
            "  -nomove         Disable point relocation\n"
            "  -nosurf         Disable surface modifications\n"
            "  -optim          Optimization mode (no topology changes)\n"
            "  -h, --help      Show this help message\n"
            "  -V, --version   Show version information",
        )
        sys.exit(0)

    # -- version -------------------------------------------------------------
    if args[0] in ("-V", "--version"):
        try:
            from . import _version  # type: ignore[attr-defined]  # noqa: PLC0415

            version = _version.__version__
        except ImportError:
            version = "unknown"
        from ._mmgpy import MMG_VERSION  # noqa: PLC0415

        print(f"mmgpy {version}")
        print(f"MMG   {MMG_VERSION}")
        sys.exit(0)

    # -- parse arguments -----------------------------------------------------
    parsed = _parse_args(args)

    if parsed.input_mesh is None:
        _get_cli_logger().error("No input mesh file found in arguments")
        sys.exit(1)

    input_path = Path(str(parsed.input_mesh))
    if not input_path.exists():
        _get_cli_logger().error("Input file does not exist: %s", input_path)
        sys.exit(1)

    # -- read mesh (single read, auto-detects type) --------------------------
    from ._io import read as _read  # noqa: PLC0415
    from ._logging import get_logger  # noqa: PLC0415

    try:
        mesh = _read(str(input_path))
    except Exception:  # noqa: BLE001
        _get_cli_logger().exception(
            "Failed to read mesh from '%s'",
            input_path,
        )
        sys.exit(1)

    get_logger().info("Detected %s mesh", mesh.kind.value)

    # -- load solution / metric files ----------------------------------------
    if parsed.sol_file is not None and parsed.met_file is not None:
        _get_cli_logger().error(
            "-sol and -met cannot both be specified "
            "(the second would overwrite the first)",
        )
        sys.exit(1)

    if parsed.sol_file is not None:
        mesh._impl.load_sol(str(parsed.sol_file))  # noqa: SLF001

    if parsed.met_file is not None:
        mesh._impl.load_sol(str(parsed.met_file))  # noqa: SLF001

    # -- remesh --------------------------------------------------------------
    try:
        if parsed.ls_value is not None:
            if "levelset" not in mesh:
                _get_cli_logger().error(
                    "-ls requires a 'levelset' field in the mesh; "
                    "load one with -sol or set it via the Python API",
                )
                sys.exit(1)
            result = mesh.remesh_levelset(
                mesh["levelset"],
                ls=parsed.ls_value,
                progress=False,
                **parsed.remesh_options,
            )
        elif parsed.lag_value is not None:
            if "displacement" not in mesh:
                _get_cli_logger().error(
                    "-lag requires a 'displacement' field in the mesh; "
                    "load one with -sol or set it via the Python API",
                )
                sys.exit(1)
            result = mesh.remesh_lagrangian(
                mesh["displacement"],
                progress=False,
                **parsed.remesh_options,
            )
        else:
            result = mesh.remesh(
                progress=False,
                **parsed.remesh_options,
            )
    except Exception:  # noqa: BLE001
        _get_cli_logger().exception("Remeshing failed")
        sys.exit(1)

    # -- save output ---------------------------------------------------------
    output_path = parsed.output_mesh or _default_output_path(str(input_path))

    try:
        mesh.save(output_path)
    except Exception:  # noqa: BLE001
        _get_cli_logger().exception("Failed to save output to '%s'", output_path)
        sys.exit(1)

    # Save solution alongside output if one was loaded
    if parsed.sol_file is not None or parsed.met_file is not None:
        output_sol_path = Path(output_path).with_suffix(".sol")
        try:
            mesh._impl.save_sol(str(output_sol_path))  # noqa: SLF001
        except Exception:  # noqa: BLE001
            _get_cli_logger().warning(
                "Failed to save solution to '%s'",
                output_sol_path,
            )

    if not result.success:
        _get_cli_logger().error("Remeshing completed with errors")
        sys.exit(1)

    sys.exit(0)
