# """Tests for the Tetra class."""

# import numpy as np
# import pytest

# from mmgpy import Tetra


# def test_tetra_creation() -> None:
#     """Test basic tetrahedron creation."""
#     t = Tetra()
#     assert isinstance(t, Tetra)


# def test_vertices() -> None:
#     """Test setting and getting vertices."""
#     t = Tetra()

#     # Test setting vertices
#     vertices = np.array([1, 2, 3, 4], dtype=np.int64)
#     t.v = vertices

#     # Test getting vertices
#     np.testing.assert_array_equal(t.v, vertices)

#     # Test wrong size array
#     with pytest.raises(RuntimeError):
#         t.v = np.array([1, 2, 3], dtype=np.int64)  # Should be length 4


# def test_quality() -> None:
#     """Test quality property."""
#     t = Tetra()
#     t.qual = 0.95
#     assert np.isclose(t.qual, 0.95)


# def test_reference() -> None:
#     """Test reference property."""
#     ref = 42

#     t = Tetra()
#     t.ref = ref
#     assert t.ref == ref


# def test_other_properties() -> None:
#     """Test other integer properties."""
#     t = Tetra()

#     t.base = 1
#     assert t.base == 1

#     five = 5

#     t.mark = five
#     assert t.mark == five

#     t.xt = five
#     assert t.xt == five

#     t.flag = five
#     assert t.flag == five

#     t.tag = five
#     assert t.tag == five


# def test_repr() -> None:
#     """Test string representation."""
#     t = Tetra()
#     t.v = np.array([1, 2, 3, 4], dtype=np.int64)
#     t.ref = 42
#     t.qual = 0.95

#     expected = "<MMG5_Tetra with vertices (1,2,3,4), ref=42, qual=0.950000>"
#     assert str(t) == expected
