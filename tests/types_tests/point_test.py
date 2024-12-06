"""Tests for the Point class."""

# import numpy as np

from mmgpy import Point


def test_basic_usage() -> None:
    """Test basic usage of the Point class."""
    # Create a point
    p = Point()

    # # Set coordinates
    # coords = np.array([1.0, 2.0, 3.0])
    # p.c = coords
    # assert np.allclose(p.c, coords)

    # Test reference setting
    ref = 42
    p.ref = ref
    assert p.ref == ref


# def test_point_repr() -> None:
#     """Test the __repr__ method of the Point class."""
#     p = Point()
#     assert str(p) == "<MMG5_Point at (0.000000,0.000000,0.000000)>"

#     p.c = np.array([1.0, 2.5, -3.7])
#     assert repr(p) == "<MMG5_Point at (1.000000,2.500000,-3.700000)>"

#     p.c = np.array([0.1, 0.0, -0.1])
#     assert str(p) == "<MMG5_Point at (0.100000,0.000000,-0.100000)>"
