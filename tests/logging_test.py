"""Tests for the mmgpy logging module."""

from __future__ import annotations

import logging
from typing import TYPE_CHECKING

import pytest

import mmgpy
from mmgpy._logging import get_logger

if TYPE_CHECKING:
    from _pytest.logging import LogCaptureFixture


def test_get_logger_returns_logger() -> None:
    """Test that get_logger returns a logging.Logger instance."""
    logger = get_logger()
    assert isinstance(logger, logging.Logger)
    assert logger.name == "mmgpy"


def test_get_logger_is_singleton() -> None:
    """Test that get_logger returns the same logger instance."""
    logger1 = get_logger()
    logger2 = get_logger()
    assert logger1 is logger2


def test_set_log_level_with_string() -> None:
    """Test that set_log_level accepts string levels."""
    mmgpy.set_log_level("DEBUG")
    logger = get_logger()
    assert logger.level == logging.DEBUG

    mmgpy.set_log_level("WARNING")
    assert logger.level == logging.WARNING


def test_set_log_level_with_int() -> None:
    """Test that set_log_level accepts integer levels."""
    mmgpy.set_log_level(logging.INFO)
    logger = get_logger()
    assert logger.level == logging.INFO


def test_enable_debug() -> None:
    """Test that enable_debug sets level to DEBUG."""
    mmgpy.enable_debug()
    logger = get_logger()
    assert logger.level == logging.DEBUG


def test_disable_logging() -> None:
    """Test that disable_logging suppresses all output."""
    mmgpy.disable_logging()
    logger = get_logger()
    assert logger.level > logging.CRITICAL


def test_logger_outputs_debug_messages(caplog: LogCaptureFixture) -> None:
    """Test that debug messages are logged when debug level is set."""
    mmgpy.set_log_level("DEBUG")
    logger = get_logger()

    with caplog.at_level(logging.DEBUG, logger="mmgpy"):
        logger.debug("Test debug message")

    assert "Test debug message" in caplog.text


def test_exports_in_all() -> None:
    """Test that logging functions are exported in __all__."""
    assert "set_log_level" in mmgpy.__all__
    assert "enable_debug" in mmgpy.__all__
    assert "disable_logging" in mmgpy.__all__


@pytest.fixture(autouse=True)
def reset_log_level() -> None:
    """Reset log level after each test."""
    yield
    mmgpy.set_log_level("WARNING")
