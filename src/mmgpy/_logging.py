"""Logging configuration for mmgpy with Rich integration and file logging support."""

from __future__ import annotations

import functools
import logging
import os
from logging.handlers import RotatingFileHandler
from pathlib import Path
from typing import TYPE_CHECKING

from rich.logging import RichHandler

if TYPE_CHECKING:
    from typing import Literal

    LogLevel = Literal["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"]

# Module-level state for file handler
_file_handler: RotatingFileHandler | None = None

# Track whether console handler is enabled
_console_enabled: bool = True


@functools.lru_cache(maxsize=1)
def get_logger() -> logging.Logger:
    """Get or create the mmgpy logger.

    This returns the underlying logger instance, which can be used for:
    - Direct logging calls
    - Integration with external logging frameworks
    - Custom handler configuration

    Returns
    -------
    logging.Logger
        The mmgpy logger instance.

    Examples
    --------
    >>> import mmgpy
    >>> logger = mmgpy.get_logger()
    >>> logger.info("Custom message")

    Integration with external loggers:

    >>> import logging
    >>> # Configure your own handler before importing mmgpy
    >>> handler = logging.StreamHandler()
    >>> handler.setFormatter(logging.Formatter('%(name)s - %(message)s'))
    >>>
    >>> import mmgpy
    >>> mmgpy.configure_logging(enable_console=False)  # Disable Rich
    >>> mmgpy.get_logger().addHandler(handler)  # Use your own handler

    """
    logger = logging.getLogger("mmgpy")

    if not logger.handlers:
        _configure_logger(logger)

    return logger


def _configure_logger(logger: logging.Logger) -> None:
    """Configure the logger with RichHandler."""
    if _console_enabled:
        handler = RichHandler(
            rich_tracebacks=True,
            show_path=False,
            markup=True,
        )
        handler.setFormatter(logging.Formatter("%(message)s"))
        logger.addHandler(handler)

    if os.environ.get("MMGPY_DEBUG"):
        logger.setLevel(logging.DEBUG)
    else:
        logger.setLevel(logging.WARNING)


def configure_logging(*, enable_console: bool = True) -> None:
    """Configure mmgpy logging behavior.

    This function allows customization of mmgpy's logging setup,
    particularly useful when integrating with external logging frameworks.

    Parameters
    ----------
    enable_console : bool, default True
        Whether to enable the default Rich console handler.
        Set to False when using your own logging handlers.

    Notes
    -----
    This function should be called BEFORE any other mmgpy operations
    if you want to disable the default console handler. Once the logger
    is initialized, use `get_logger()` to add your own handlers.

    Examples
    --------
    Using mmgpy with a custom logging setup:

    >>> import mmgpy
    >>> # Disable default Rich handler
    >>> mmgpy.configure_logging(enable_console=False)
    >>>
    >>> # Add your own handler
    >>> import logging
    >>> handler = logging.FileHandler("app.log")
    >>> handler.setFormatter(logging.Formatter(
    ...     '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    ... ))
    >>> mmgpy.get_logger().addHandler(handler)

    Integration with structlog or loguru:

    >>> import mmgpy
    >>> mmgpy.configure_logging(enable_console=False)
    >>> # Now configure your preferred logging library
    >>> # mmgpy logs will go to the "mmgpy" logger namespace

    """
    global _console_enabled  # noqa: PLW0603
    logger = logging.getLogger("mmgpy")

    if not enable_console:
        _console_enabled = False
        # Remove existing Rich handlers if logger already initialized
        for handler in logger.handlers[:]:
            if isinstance(handler, RichHandler):
                logger.removeHandler(handler)
                handler.close()


def set_log_file(
    path: str | Path | None,
    max_bytes: int = 10_000_000,
    backup_count: int = 5,
    level: int | str | None = None,
) -> None:
    """Configure file logging for mmgpy.

    Enables logging to a file with optional rotation. This can be used
    alongside console logging - logs will go to both destinations.

    Parameters
    ----------
    path : str | Path | None
        Log file path, or None to disable file logging.
    max_bytes : int, default 10_000_000
        Maximum file size in bytes before rotation (default 10 MB).
        Set to 0 to disable rotation.
    backup_count : int, default 5
        Number of backup files to keep after rotation.
    level : int | str | None, default None
        Logging level for the file handler. Can be a string like "DEBUG"
        or an integer constant from the logging module.
        If None, uses the same level as the logger.

    Examples
    --------
    Basic file logging:

    >>> import mmgpy
    >>> mmgpy.set_log_file("mmgpy.log")
    >>> mesh = mmgpy.read("input.mesh")
    >>> mesh.remesh(hmax=0.1, verbose=1)  # Output goes to file and console

    With rotation settings:

    >>> mmgpy.set_log_file(
    ...     "mmgpy.log",
    ...     max_bytes=5_000_000,  # 5 MB
    ...     backup_count=3
    ... )

    Debug level for file only (console stays at WARNING):

    >>> mmgpy.set_log_file("debug.log", level="DEBUG")

    Disable file logging:

    >>> mmgpy.set_log_file(None)

    """
    global _file_handler  # noqa: PLW0603
    logger = get_logger()

    # Remove existing file handler
    if _file_handler is not None:
        logger.removeHandler(_file_handler)
        _file_handler.close()
        _file_handler = None

    if path is None:
        return

    # Create parent directories if needed
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)

    # Create new file handler with rotation
    _file_handler = RotatingFileHandler(
        path,
        maxBytes=max_bytes,
        backupCount=backup_count,
    )

    # Set formatter for file output (more detailed than console)
    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    )
    _file_handler.setFormatter(formatter)

    # Set level for file handler
    # Use NOTSET (0) by default so handler defers to logger's level
    if level is not None:
        if isinstance(level, str):
            level = getattr(logging, level.upper())
        _file_handler.setLevel(level)
    else:
        _file_handler.setLevel(logging.NOTSET)

    logger.addHandler(_file_handler)


def get_log_file() -> Path | None:
    """Get the current log file path.

    Returns
    -------
    Path | None
        The current log file path, or None if file logging is disabled.

    Examples
    --------
    >>> import mmgpy
    >>> mmgpy.set_log_file("output.log")
    >>> print(mmgpy.get_log_file())
    output.log
    >>> mmgpy.set_log_file(None)
    >>> print(mmgpy.get_log_file())
    None

    """
    if _file_handler is None:
        return None
    return Path(_file_handler.baseFilename)


def set_log_level(level: LogLevel | int) -> None:
    """Set the logging level for mmgpy.

    This sets the level for the logger itself. Individual handlers
    (console, file) may have their own levels set separately.

    Parameters
    ----------
    level : LogLevel | int
        The logging level. Can be a string like "DEBUG", "INFO", "WARNING",
        "ERROR", "CRITICAL" or an integer constant from the logging module.

    Examples
    --------
    >>> import mmgpy
    >>> mmgpy.set_log_level("DEBUG")  # Show all debug messages
    >>> mmgpy.set_log_level("INFO")   # Show info and above
    >>> mmgpy.set_log_level("WARNING")  # Default - show warnings and errors

    """
    logger = get_logger()
    if isinstance(level, str):
        level = getattr(logging, level.upper())
    logger.setLevel(level)


def enable_debug() -> None:
    """Enable debug logging for mmgpy.

    This is equivalent to calling `set_log_level("DEBUG")` or setting
    the `MMGPY_DEBUG` environment variable.
    """
    set_log_level(logging.DEBUG)


def disable_logging() -> None:
    """Disable all logging output from mmgpy."""
    set_log_level(logging.CRITICAL + 1)
