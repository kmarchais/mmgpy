import numpy as np
from mmgpy import Point


def test_basic_usage():
    # Create a point
    p = Point()

    # Set coordinates
    coords = np.array([1.0, 2.0, 3.0])
    p.c = coords
    assert np.allclose(p.c, coords)

    # Test string representation
    print(p)  # Should print coordinates

    # Test reference setting
    p.ref = 42
    assert p.ref == 42


if __name__ == "__main__":
    test_basic_usage()
    print("Test passed!")
