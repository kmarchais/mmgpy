"""Tests for the mmgpy logging module."""

from __future__ import annotations

import logging
from logging.handlers import RotatingFileHandler
from pathlib import Path
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
    assert "set_log_file" in mmgpy.__all__
    assert "get_log_file" in mmgpy.__all__
    assert "get_logger" in mmgpy.__all__
    assert "configure_logging" in mmgpy.__all__


class TestFileLogging:
    """Tests for file logging functionality."""

    def test_set_log_file_creates_file(self, tmp_path: Path) -> None:
        """Test that set_log_file creates a log file."""
        log_file = tmp_path / "test.log"
        mmgpy.set_log_file(log_file)

        try:
            # Log a message
            mmgpy.set_log_level("INFO")
            logger = get_logger()
            logger.info("Test file logging message")

            # Flush handlers to ensure content is written
            for handler in logger.handlers:
                handler.flush()

            # Check file was created and contains the message
            assert log_file.exists()
            content = log_file.read_text()
            assert "Test file logging message" in content
        finally:
            mmgpy.set_log_file(None)

    def test_get_log_file_returns_path(self, tmp_path: Path) -> None:
        """Test that get_log_file returns the correct path."""
        log_file = tmp_path / "test.log"

        # Before setting, should return None
        mmgpy.set_log_file(None)
        assert mmgpy.get_log_file() is None

        # After setting, should return the path
        mmgpy.set_log_file(log_file)
        try:
            result = mmgpy.get_log_file()
            assert result is not None
            assert result.name == "test.log"
        finally:
            mmgpy.set_log_file(None)

    def test_set_log_file_none_disables(self, tmp_path: Path) -> None:
        """Test that set_log_file(None) disables file logging."""
        log_file = tmp_path / "test.log"
        mmgpy.set_log_file(log_file)
        mmgpy.set_log_file(None)

        assert mmgpy.get_log_file() is None

    def test_set_log_file_with_level(self, tmp_path: Path) -> None:
        """Test that file handler respects custom level."""
        log_file = tmp_path / "debug.log"

        # Set logger to WARNING, but file to DEBUG
        mmgpy.set_log_level("DEBUG")
        mmgpy.set_log_file(log_file, level="DEBUG")

        try:
            logger = get_logger()
            logger.debug("Debug message for file")

            # Flush handlers to ensure content is written
            for handler in logger.handlers:
                handler.flush()

            content = log_file.read_text()
            assert "Debug message for file" in content
        finally:
            mmgpy.set_log_file(None)

    def test_set_log_file_with_string_level(self, tmp_path: Path) -> None:
        """Test that set_log_file accepts string level."""
        log_file = tmp_path / "test.log"
        mmgpy.set_log_file(log_file, level="INFO")

        try:
            # Verify handler has correct level
            from mmgpy._logging import _file_handler

            assert _file_handler is not None
            assert _file_handler.level == logging.INFO
        finally:
            mmgpy.set_log_file(None)

    def test_set_log_file_with_int_level(self, tmp_path: Path) -> None:
        """Test that set_log_file accepts integer level."""
        log_file = tmp_path / "test.log"
        mmgpy.set_log_file(log_file, level=logging.ERROR)

        try:
            from mmgpy._logging import _file_handler

            assert _file_handler is not None
            assert _file_handler.level == logging.ERROR
        finally:
            mmgpy.set_log_file(None)

    def test_set_log_file_creates_parent_dirs(self, tmp_path: Path) -> None:
        """Test that set_log_file creates parent directories."""
        log_file = tmp_path / "subdir" / "nested" / "test.log"
        mmgpy.set_log_file(log_file)

        try:
            assert log_file.parent.exists()
        finally:
            mmgpy.set_log_file(None)

    def test_set_log_file_replaces_existing(self, tmp_path: Path) -> None:
        """Test that setting a new file replaces the old handler."""
        log_file1 = tmp_path / "first.log"
        log_file2 = tmp_path / "second.log"

        mmgpy.set_log_file(log_file1)
        mmgpy.set_log_file(log_file2)

        try:
            # Only the second file should be active
            result = mmgpy.get_log_file()
            assert result is not None
            assert result.name == "second.log"
        finally:
            mmgpy.set_log_file(None)

    def test_file_handler_is_rotating(self, tmp_path: Path) -> None:
        """Test that file handler uses RotatingFileHandler."""
        log_file = tmp_path / "test.log"
        mmgpy.set_log_file(log_file, max_bytes=1000, backup_count=3)

        try:
            from mmgpy._logging import _file_handler

            assert isinstance(_file_handler, RotatingFileHandler)
            assert _file_handler.maxBytes == 1000
            assert _file_handler.backupCount == 3
        finally:
            mmgpy.set_log_file(None)

    def test_file_logging_format(self, tmp_path: Path) -> None:
        """Test that file logs have proper timestamp format."""
        log_file = tmp_path / "test.log"
        mmgpy.set_log_file(log_file)
        mmgpy.set_log_level("INFO")

        try:
            logger = get_logger()
            logger.info("Format test message")

            # Flush handlers to ensure content is written
            for handler in logger.handlers:
                handler.flush()

            content = log_file.read_text()
            # Check format includes timestamp, name, level, and message
            assert "mmgpy" in content
            assert "INFO" in content
            assert "Format test message" in content
            # Timestamp should have date pattern
            assert "-" in content  # Date separators
        finally:
            mmgpy.set_log_file(None)


class TestConfigureLogging:
    """Tests for configure_logging functionality."""

    def test_configure_logging_disable_console(self) -> None:
        """Test that configure_logging can disable console output."""
        from rich.logging import RichHandler

        logger = get_logger()

        # Should have RichHandler by default
        rich_handlers = [h for h in logger.handlers if isinstance(h, RichHandler)]
        initial_count = len(rich_handlers)

        # Disable console logging
        mmgpy.configure_logging(enable_console=False)

        # RichHandler should be removed
        rich_handlers = [h for h in logger.handlers if isinstance(h, RichHandler)]
        assert len(rich_handlers) < initial_count or initial_count == 0

    def test_configure_logging_allows_custom_handler(self, tmp_path: Path) -> None:
        """Test that users can add their own handlers after disabling console."""
        mmgpy.configure_logging(enable_console=False)

        # Add a custom file handler
        log_file = tmp_path / "custom.log"
        custom_handler = logging.FileHandler(log_file)
        custom_handler.setFormatter(
            logging.Formatter("CUSTOM: %(levelname)s - %(message)s"),
        )

        logger = get_logger()
        logger.addHandler(custom_handler)

        try:
            mmgpy.set_log_level("INFO")
            logger.info("Custom handler test")

            content = log_file.read_text()
            assert "CUSTOM:" in content
            assert "Custom handler test" in content
        finally:
            logger.removeHandler(custom_handler)
            custom_handler.close()


class TestExternalLoggerIntegration:
    """Tests for integration with external logging setups."""

    def test_get_logger_exported(self) -> None:
        """Test that get_logger is accessible from mmgpy."""
        logger = mmgpy.get_logger()
        assert isinstance(logger, logging.Logger)
        assert logger.name == "mmgpy"

    def test_logger_namespace(self) -> None:
        """Test that logger uses 'mmgpy' namespace for external integration."""
        # External loggers can capture mmgpy logs via the namespace
        logger = logging.getLogger("mmgpy")
        assert logger is get_logger()

    def test_file_and_console_coexist(
        self,
        tmp_path: Path,
        caplog: LogCaptureFixture,
    ) -> None:
        """Test that file and console logging can work simultaneously."""
        log_file = tmp_path / "test.log"
        mmgpy.set_log_file(log_file)
        mmgpy.set_log_level("INFO")

        try:
            logger = get_logger()

            with caplog.at_level(logging.INFO, logger="mmgpy"):
                logger.info("Dual output test")

            # Flush handlers to ensure content is written
            for handler in logger.handlers:
                handler.flush()

            # Check file has the message
            file_content = log_file.read_text()
            assert "Dual output test" in file_content

            # Check caplog captured it too
            assert "Dual output test" in caplog.text
        finally:
            mmgpy.set_log_file(None)

    def test_different_levels_for_handlers(
        self,
        tmp_path: Path,
        caplog: LogCaptureFixture,
    ) -> None:
        """Test file and console can have different log levels."""
        log_file = tmp_path / "debug.log"

        # Logger at DEBUG, file at DEBUG, console effectively at WARNING
        mmgpy.set_log_level("DEBUG")
        mmgpy.set_log_file(log_file, level="DEBUG")

        try:
            logger = get_logger()

            with caplog.at_level(logging.DEBUG, logger="mmgpy"):
                logger.debug("Debug only message")
                logger.warning("Warning message")

            # Flush handlers to ensure content is written
            for handler in logger.handlers:
                handler.flush()

            # File should have debug message
            file_content = log_file.read_text()
            assert "Debug only message" in file_content
            assert "Warning message" in file_content

            # Caplog captures everything at DEBUG level in this test context
            assert "Debug only message" in caplog.text
        finally:
            mmgpy.set_log_file(None)


@pytest.fixture(autouse=True)
def reset_logging_state() -> None:
    """Reset logging state after each test."""
    yield
    # Reset log level
    mmgpy.set_log_level("WARNING")
    # Disable file logging
    mmgpy.set_log_file(None)
