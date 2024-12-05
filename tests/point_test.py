"""Tests for the Point class."""

import numpy as np

from mmgpy import Point


def test_basic_usage() -> None:
    """Test basic usage of the Point class."""
    # Create a point
    p = Point()

    # Set coordinates
    coords = np.array([1.0, 2.0, 3.0])
    p.c = coords
    assert np.allclose(p.c, coords)

    # Test string representation
    assert repr(p) == f"<MMG5_Point at ({coords})>"

    # Test reference setting
    ref = 42
    p.ref = ref
    assert p.ref == ref
