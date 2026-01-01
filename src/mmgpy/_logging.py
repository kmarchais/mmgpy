"""Logging configuration for mmgpy with Rich integration."""

from __future__ import annotations

import functools
import logging
import os
from typing import TYPE_CHECKING

from rich.logging import RichHandler

if TYPE_CHECKING:
    from typing import Literal

    LogLevel = Literal["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"]


@functools.lru_cache(maxsize=1)
def get_logger() -> logging.Logger:
    """Get or create the mmgpy logger.

    Returns
    -------
    logging.Logger
        The mmgpy logger instance, configured with RichHandler.

    """
    logger = logging.getLogger("mmgpy")

    if not logger.handlers:
        _configure_logger(logger)

    return logger


def _configure_logger(logger: logging.Logger) -> None:
    """Configure the logger with RichHandler."""
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


def set_log_level(level: LogLevel | int) -> None:
    """Set the logging level for mmgpy.

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
