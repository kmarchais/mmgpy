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
from typing import TYPE_CHECKING, Any

if TYPE_CHECKING:
    from collections.abc import Callable

    from ._mesh import Mesh


def _get_cli_logger() -> logging.Logger:  # pragma: no cover
    """Get a simple stdlib logger for CLI errors and warnings.

    Uses plain StreamHandler to avoid Rich console issues on Windows pipes.

    Returns
    -------
    logging.Logger
        A configured ``mmgpy.cli`` logger writing to stderr, prefixed by level.

    """
    logger = logging.getLogger("mmgpy.cli")
    if not logger.handlers:
        handler = logging.StreamHandler(sys.stderr)
        handler.setFormatter(logging.Formatter("%(levelname)s: %(message)s"))
        logger.addHandler(handler)
        logger.setLevel(logging.DEBUG)
    return logger


def _get_cli_stdout_logger() -> logging.Logger:  # pragma: no cover
    """Get a plain stdout logger for CLI help / version output.

    Separate from :func:`_get_cli_logger` so help and version messages go
    to stdout without a ``LEVEL: `` prefix (the conventional shape for
    ``--help`` / ``--version`` so callers can pipe them through ``grep``).

    Returns
    -------
    logging.Logger
        Logger emitting raw ``%(message)s`` to stdout.

    """
    logger = logging.getLogger("mmgpy.cli.out")
    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        handler.setFormatter(logging.Formatter("%(message)s"))
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


def _check_exe(path: Path) -> str | None:  # pragma: no cover
    """Return ``str(path)`` after marking it executable, or ``None`` if missing.

    Returns
    -------
    str or None
        Full path to *path* when it exists, ``None`` otherwise.

    """
    if not path.exists():
        return None
    _ensure_executable(path)
    return str(path)


def _find_in_package_bin(exe_name: str) -> str | None:  # pragma: no cover
    """Look up *exe_name* in ``mmgpy/bin/`` relative to this package.

    Returns
    -------
    str or None
        Path under this package's ``bin/`` directory (wheel install), or ``None``.

    """
    return _check_exe(Path(__file__).parent / "bin" / exe_name)


def _find_in_site_packages_bin(exe_name: str) -> str | None:  # pragma: no cover
    """Look up *exe_name* in ``site-packages/mmgpy/bin/`` (editable install).

    Returns
    -------
    str or None
        Path under the site-packages ``mmgpy/bin/`` directory, or ``None``.

    """
    site_packages_list = site.getsitepackages()
    # On Windows, prefer the actual site-packages over the venv root.
    site_packages = Path(
        site_packages_list[1]
        if sys.platform == "win32" and len(site_packages_list) > 1
        else site_packages_list[0],
    )
    return _check_exe(site_packages / "mmgpy" / "bin" / exe_name)


def _find_in_venv_bin(exe_name: str) -> str | None:  # pragma: no cover
    """Look up *exe_name* in the venv ``bin/`` or ``Scripts/`` directory.

    Returns
    -------
    str or None
        Path to a real native executable in the venv, or ``None`` (small
        files are rejected to skip Python entry-point shims of the same name).

    """
    venv_bin_name = "Scripts" if sys.platform == "win32" else "bin"
    venv_bin = Path(sys.prefix) / venv_bin_name / exe_name
    min_native_exe_size = 1024
    if not venv_bin.exists() or venv_bin.stat().st_size <= min_native_exe_size:
        return None
    _ensure_executable(venv_bin)
    return str(venv_bin)


def _find_in_build_dir(exe_name: str) -> str | None:  # pragma: no cover
    """Look up *exe_name* in the scikit-build-core build dir (editable installs).

    Returns
    -------
    str or None
        Path under ``build/*/mmgpy/bin/``, or ``None`` if not in an editable tree.

    """
    package_dir = Path(__file__).parent
    if "src" not in str(package_dir):
        return None
    build_dir = package_dir.parent.parent / "build"
    if not build_dir.exists():
        return None
    for build_subdir in build_dir.iterdir():
        if not build_subdir.is_dir():
            continue
        hit = _check_exe(build_subdir / "mmgpy" / "bin" / exe_name)
        if hit is not None:
            return hit
    return None


def _find_mmg_executable(base_name: str) -> str | None:  # pragma: no cover
    """Find an MMG executable in mmgpy/bin, venv bin, or system PATH.

    .. note:: No longer used by the CLI entry point (the unified ``mmg``
       command calls the Python API directly).  Kept for the public
       re-export in ``__init__.py`` and for test usage.

    Parameters
    ----------
    base_name : str
        Base name of executable (e.g., ``"mmg3d_O3"``).

    Returns
    -------
    str or None
        Full path to executable, or ``None`` if not found.

    """
    exe_name = f"{base_name}.exe" if sys.platform == "win32" else base_name

    for strategy in (
        _find_in_package_bin,
        _find_in_site_packages_bin,
        _find_in_venv_bin,
        _find_in_build_dir,
    ):
        hit = strategy(exe_name)
        if hit is not None:
            return hit

    # Last resort: check system PATH via shutil.which()
    import shutil  # noqa: PLC0415

    return shutil.which(base_name)


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
    "-rn",  # renum (0/1) → routed to mmgpy.reorder_cuthill_mckee
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


# Dispatch table for ``-flag value`` pairs.  Each entry is
# ``(field_name, cast, on_remesh_options)``: ``on_remesh_options=False`` writes
# to a named ``_ParsedArgs`` attribute, ``True`` writes into
# ``parsed.remesh_options[field_name]`` for later forwarding to ``mesh.remesh``.
# MMG's ``-rn 0/1`` toggles SCOTCH renumbering; the bundled MMG has no SCOTCH,
# so mmgpy reroutes the kwarg to a Python-side reverse Cuthill-McKee in
# ``_pop_renum_redirect``.
_VALUE_FLAG_FIELDS: dict[str, tuple[str, Callable[[str], Any], bool]] = {
    "-in": ("input_mesh", str, False),
    "-o": ("output_mesh", str, False),
    "-out": ("output_mesh", str, False),
    "-sol": ("sol_file", str, False),
    "-met": ("met_file", str, False),
    "-ls": ("ls_value", float, False),
    "-lag": ("lag_value", int, False),
    "-v": ("verbose", int, True),
    "-m": ("mem", int, True),
    "-rn": ("renum", int, True),
}


def _apply_value_flag(parsed: _ParsedArgs, flag: str, value: str) -> None:
    """Apply a ``-flag value`` pair to *parsed*. Unknown flags are silently skipped."""
    field_spec = _VALUE_FLAG_FIELDS.get(flag)
    if field_spec is not None:
        name, cast, on_options = field_spec
        cast_value = cast(value)
        if on_options:
            parsed.remesh_options[name] = cast_value
        else:
            setattr(parsed, name, cast_value)
        return
    if flag in _NUMERIC_OPTION_FLAGS:
        parsed.remesh_options[flag.lstrip("-")] = float(value)
    # -nr and other unknown value-flags are silently skipped.


def _parse_args(args: list[str]) -> _ParsedArgs:
    """Parse MMG-style CLI arguments into structured form.

    Handles ``-flag value`` pairs, boolean flags, and positional input file
    detection.  Unknown flags are silently ignored so that the CLI remains
    forward-compatible with new MMG options.

    Returns
    -------
    _ParsedArgs
        The structured CLI arguments.

    """
    parsed = _ParsedArgs()
    i = 0
    while i < len(args):
        arg = args[i]

        if arg in _FLAGS_WITH_VALUE and i + 1 < len(args):
            _apply_value_flag(parsed, arg, args[i + 1])
            i += 2
            continue

        if arg in _BOOLEAN_OPTION_FLAGS:
            parsed.remesh_options[arg.lstrip("-")] = 1
            i += 1
            continue

        # Positional: first non-flag existing file is the input mesh.
        if not arg.startswith("-") and parsed.input_mesh is None and Path(arg).exists():
            parsed.input_mesh = arg

        i += 1

    return parsed


def _default_output_path(input_path: str) -> str:
    """Derive the default output path following MMG convention.

    ``input.mesh`` → ``input.o.mesh``

    Returns
    -------
    str
        Default output path next to ``input_path``.

    """
    p = Path(input_path)
    return str(p.with_name(f"{p.stem}.o{p.suffix}"))


# -- Main entry point -------------------------------------------------------


_HELP_TEXT = (
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
    "  -lag <val>      Lagrangian motion (move + remesh; reads "
    "'displacement' field from -sol)\n"
    "  -v <val>        Verbosity (-1=silent, 0=errors, 1=info)\n"
    "  -m <val>        Maximum memory (MB)\n"
    "  -noinsert       Disable point insertion\n"
    "  -noswap         Disable edge/face swapping\n"
    "  -nomove         Disable point relocation\n"
    "  -nosurf         Disable surface modifications\n"
    "  -optim          Optimization mode (no topology changes)\n"
    "  -rn <0|1>       Renumber vertices (reverse Cuthill-McKee)\n"
    "  -h, --help      Show this help message\n"
    "  -V, --version   Show version information"
)


def _print_version() -> None:  # pragma: no cover
    """Emit ``mmgpy`` and bundled MMG library versions to stdout."""
    try:
        from . import _version  # type: ignore[attr-defined]  # noqa: PLC0415

        version = _version.__version__
    except ImportError:
        version = "unknown"
    from ._mmgpy import MMG_VERSION  # noqa: PLC0415

    out = _get_cli_stdout_logger()
    out.info("mmgpy %s", version)
    out.info("MMG   %s", MMG_VERSION)


def _read_input_mesh(input_path: Path) -> Mesh:  # pragma: no cover
    """Read the input mesh, exiting on failure.

    Returns
    -------
    Mesh
        The loaded :class:`mmgpy.Mesh`.

    """
    from ._io import _read_mesh_internal as _read  # noqa: PLC0415

    try:
        return _read(str(input_path))
    except Exception:  # noqa: BLE001
        _get_cli_logger().exception("Failed to read mesh from '%s'", input_path)
        sys.exit(1)


def _apply_sol_or_met(mesh: Mesh, parsed: _ParsedArgs) -> None:  # pragma: no cover
    """Load the supplied ``-sol`` or ``-met`` file onto *mesh* (mutually exclusive)."""
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


def _dispatch_remesh(mesh: Mesh, parsed: _ParsedArgs) -> bool:  # pragma: no cover
    """Run the appropriate remesh entry point based on parsed flags.

    The level-set and standard paths return a ``RemeshResult`` whose
    ``.success`` is the source of truth; the ``-lag`` path goes through
    ``mmgpy.move_mesh`` which has no return value but raises on failure,
    so reaching the call's return point is itself the success signal.

    Returns
    -------
    bool
        ``True`` when remeshing reported success, ``False`` on a clean
        completion with errors. Hard failures call :func:`sys.exit`.

    """
    if parsed.ls_value is not None:
        if "levelset" not in mesh:
            _get_cli_logger().error(
                "-ls requires a 'levelset' field in the mesh; "
                "load one with -sol or set it via the Python API",
            )
            sys.exit(1)
        return mesh.remesh_levelset(
            mesh["levelset"],
            ls=parsed.ls_value,
            progress=False,
            **parsed.remesh_options,
        ).success

    if parsed.lag_value is not None:
        if "displacement" not in mesh:
            _get_cli_logger().error(
                "-lag requires a 'displacement' field in the mesh; "
                "load one with -sol or set it via the Python API",
            )
            sys.exit(1)
        from mmgpy.lagrangian import move_mesh as _move_mesh  # noqa: PLC0415

        # `move_mesh` doesn't accept a `progress` kwarg; it doesn't emit
        # progress events either, so passing the standard CLI options
        # straight through is correct. `verbose` (if present in
        # `parsed.remesh_options`) still controls MMG verbosity.
        _move_mesh(mesh, mesh["displacement"], **parsed.remesh_options)
        return True

    return mesh.remesh(progress=False, **parsed.remesh_options).success


def _save_output(  # pragma: no cover
    mesh: Mesh,
    parsed: _ParsedArgs,
    input_path: Path,
) -> None:
    """Save the remeshed mesh, plus a sibling ``.sol`` if one was loaded."""
    output_path = parsed.output_mesh or _default_output_path(str(input_path))

    try:
        mesh.save(output_path)
    except Exception:  # noqa: BLE001
        _get_cli_logger().exception("Failed to save output to '%s'", output_path)
        sys.exit(1)

    if parsed.sol_file is None and parsed.met_file is None:
        return
    output_sol_path = Path(output_path).with_suffix(".sol")
    try:
        mesh._impl.save_sol(str(output_sol_path))  # noqa: SLF001
    except Exception:  # noqa: BLE001
        _get_cli_logger().warning(
            "Failed to save solution to '%s'",
            output_sol_path,
        )


def _run_mmg() -> None:  # pragma: no cover
    """Run the unified ``mmg`` command.

    Auto-detects mesh type from the input file, then remeshes via the
    Python API (single read, no subprocess).
    """
    args = sys.argv[1:]

    if not args or args[0] in {"-h", "--help"}:
        _get_cli_stdout_logger().info(_HELP_TEXT)
        sys.exit(0)
    if args[0] in {"-V", "--version"}:
        _print_version()
        sys.exit(0)

    parsed = _parse_args(args)

    if parsed.input_mesh is None:
        _get_cli_logger().error("No input mesh file found in arguments")
        sys.exit(1)

    input_path = Path(str(parsed.input_mesh))
    if not input_path.exists():
        _get_cli_logger().error("Input file does not exist: %s", input_path)
        sys.exit(1)

    mesh = _read_input_mesh(input_path)

    from ._logging import get_logger  # noqa: PLC0415

    get_logger().info("Detected %s mesh", mesh.kind.value)

    _apply_sol_or_met(mesh, parsed)

    try:
        success = _dispatch_remesh(mesh, parsed)
    except Exception:  # noqa: BLE001
        _get_cli_logger().exception("Remeshing failed")
        sys.exit(1)

    _save_output(mesh, parsed, input_path)

    if not success:
        _get_cli_logger().error("Remeshing completed with errors")
        sys.exit(1)

    sys.exit(0)
