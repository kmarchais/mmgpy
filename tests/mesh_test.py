"""Tests for the mesh module."""

import numpy as np

from mmgpy import MmgMesh


def test_mmg_mesh() -> None:
    """Test creating a simple tetrahedral mesh using MmgMesh."""
    # Create a simple tetrahedral mesh (a single tetrahedron)
    _ = np.array(
        [
            [0.0, 0.0, 0.0],  # vertex 0
            [1.0, 0.0, 0.0],  # vertex 1
            [0.0, 1.0, 0.0],  # vertex 2
            [0.0, 0.0, 1.0],  # vertex 3
        ],
        dtype=np.float64,
    )

    _ = np.array(
        [
            [0, 1, 2, 3],  # single tetrahedron using vertex indices
        ],
        dtype=np.int32,
    )

    MmgMesh()
