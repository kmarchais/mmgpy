"""Test the MmgMesh class."""

import numpy as np

from mmgpy import MmgMesh


def test_mmg_mesh() -> None:
    """Test the MmgMesh class."""
    # Create a simple tetrahedral mesh (a single tetrahedron)
    vertices = np.array(
        [
            [0.0, 0.0, 0.0],  # vertex 0
            [1.0, 0.0, 0.0],  # vertex 1
            [0.0, 1.0, 0.0],  # vertex 2
            [0.0, 0.0, 1.0],  # vertex 3
        ],
        dtype=np.float64,
    )

    elements = np.array(
        [
            [0, 1, 2, 3],  # single tetrahedron using vertex indices
        ],
        dtype=np.int32,
    )

    mesh1 = MmgMesh()

    mesh1.set_vertices_and_elements(vertices, elements)

    MmgMesh(vertices, elements)


if __name__ == "__main__":
    test_mmg_mesh()
