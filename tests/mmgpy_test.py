"""Tests for the mmgpy package."""

import mmgpy


def test_version() -> None:
    """Test that the version is correct."""
    assert mmgpy.__version__ == "0.5.1"


def test_mmg_version() -> None:
    """Test that mmg's version is correct."""
    assert mmgpy.MMG_VERSION == "5.8.0"
