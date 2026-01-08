"""Shared fixtures for mmgpy tests."""

import numpy as np
import pytest


@pytest.fixture
def cube_mesh() -> tuple[np.ndarray, np.ndarray]:
    """Create a cube mesh made of tetrahedra for testing.

    Returns 8 vertices (cube corners) and 5 tetrahedra.
    """
    vertices = np.array(
        [
            # Bottom square
            [0.0, 0.0, 0.0],  # 0
            [1.0, 0.0, 0.0],  # 1
            [1.0, 1.0, 0.0],  # 2
            [0.0, 1.0, 0.0],  # 3
            # Top square
            [0.0, 0.0, 1.0],  # 4
            [1.0, 0.0, 1.0],  # 5
            [1.0, 1.0, 1.0],  # 6
            [0.0, 1.0, 1.0],  # 7
        ],
        dtype=np.float64,
    )

    # Split cube into 5 tetrahedra
    elements = np.array(
        [
            [0, 1, 3, 4],  # Front-left
            [1, 2, 3, 6],  # Front-right
            [1, 4, 5, 6],  # Right-back
            [3, 4, 6, 7],  # Left-back
            [1, 3, 4, 6],  # Center diagonal
        ],
        dtype=np.int32,
    )

    return vertices, elements


@pytest.fixture
def square_mesh() -> tuple[np.ndarray, np.ndarray]:
    """Create a simple 2D square mesh for testing.

    Returns 4 vertices (square corners) and 2 triangles.
    """
    vertices = np.array(
        [
            [0.0, 0.0],  # 0
            [1.0, 0.0],  # 1
            [1.0, 1.0],  # 2
            [0.0, 1.0],  # 3
        ],
        dtype=np.float64,
    )

    triangles = np.array(
        [
            [0, 1, 2],
            [0, 2, 3],
        ],
        dtype=np.int32,
    )

    return vertices, triangles


@pytest.fixture
def tetrahedron_surface_mesh() -> tuple[np.ndarray, np.ndarray]:
    """Create a simple surface mesh (tetrahedron surface in 3D) for testing.

    Returns 4 vertices and 4 triangles forming a closed tetrahedron surface.
    """
    vertices = np.array(
        [
            [0.0, 0.0, 0.0],  # 0
            [1.0, 0.0, 0.0],  # 1
            [0.5, 1.0, 0.0],  # 2
            [0.5, 0.5, 1.0],  # 3
        ],
        dtype=np.float64,
    )

    triangles = np.array(
        [
            [0, 1, 2],  # bottom
            [0, 1, 3],  # front
            [1, 2, 3],  # right
            [0, 2, 3],  # left
        ],
        dtype=np.int32,
    )

    return vertices, triangles


@pytest.fixture
def single_tetrahedron() -> tuple[np.ndarray, np.ndarray]:
    """Create a single tetrahedron for testing.

    Returns 4 vertices and 1 tetrahedron.
    """
    vertices = np.array(
        [
            [0.0, 0.0, 0.0],
            [1.0, 0.0, 0.0],
            [0.5, 1.0, 0.0],
            [0.5, 0.5, 1.0],
        ],
        dtype=np.float64,
    )

    tetrahedra = np.array([[0, 1, 2, 3]], dtype=np.int32)

    return vertices, tetrahedra


@pytest.fixture
def prism_mesh() -> tuple[np.ndarray, np.ndarray]:
    """Create vertices for a single prism.

    Returns 6 vertices forming a triangular prism.
    """
    vertices = np.array(
        [
            [0.0, 0.0, 0.0],  # 0
            [1.0, 0.0, 0.0],  # 1
            [0.5, 1.0, 0.0],  # 2
            [0.0, 0.0, 1.0],  # 3
            [1.0, 0.0, 1.0],  # 4
            [0.5, 1.0, 1.0],  # 5
        ],
        dtype=np.float64,
    )

    prisms = np.array([[0, 1, 2, 3, 4, 5]], dtype=np.int32)

    return vertices, prisms


@pytest.fixture
def stacked_prisms() -> tuple[np.ndarray, np.ndarray]:
    """Create vertices for 2 stacked prisms.

    Returns 9 vertices and 2 prisms.
    """
    vertices = np.array(
        [
            [0.0, 0.0, 0.0],  # 0
            [1.0, 0.0, 0.0],  # 1
            [0.5, 1.0, 0.0],  # 2
            [0.0, 0.0, 1.0],  # 3
            [1.0, 0.0, 1.0],  # 4
            [0.5, 1.0, 1.0],  # 5
            [0.0, 0.0, 2.0],  # 6
            [1.0, 0.0, 2.0],  # 7
            [0.5, 1.0, 2.0],  # 8
        ],
        dtype=np.float64,
    )

    prisms = np.array(
        [
            [0, 1, 2, 3, 4, 5],  # bottom prism
            [3, 4, 5, 6, 7, 8],  # top prism
        ],
        dtype=np.int32,
    )

    return vertices, prisms


@pytest.fixture
def dense_3d_mesh() -> tuple[np.ndarray, np.ndarray]:
    """Create a dense tetrahedral mesh of a unit cube for level-set testing.

    Level-set discretization requires interior points to work properly.
    Uses PyVista's delaunay_3d for better quality tetrahedra.
    """
    import pyvista as pv

    resolution = 5
    x = np.linspace(0, 1, resolution)
    y = np.linspace(0, 1, resolution)
    z = np.linspace(0, 1, resolution)
    xx, yy, zz = np.meshgrid(x, y, z, indexing="ij")
    points = np.column_stack([xx.ravel(), yy.ravel(), zz.ravel()])
    cloud = pv.PolyData(points)
    tetra = cloud.delaunay_3d()
    vertices = np.array(tetra.points, dtype=np.float64)
    elements = tetra.cells_dict[pv.CellType.TETRA].astype(np.int32)
    return vertices, elements


@pytest.fixture
def dense_3d_mesh_fine() -> tuple[np.ndarray, np.ndarray]:
    """Create a finer dense tetrahedral mesh for level-set interface tests."""
    import pyvista as pv

    resolution = 6
    x = np.linspace(0, 1, resolution)
    y = np.linspace(0, 1, resolution)
    z = np.linspace(0, 1, resolution)
    xx, yy, zz = np.meshgrid(x, y, z, indexing="ij")
    points = np.column_stack([xx.ravel(), yy.ravel(), zz.ravel()])
    cloud = pv.PolyData(points)
    tetra = cloud.delaunay_3d()
    vertices = np.array(tetra.points, dtype=np.float64)
    elements = tetra.cells_dict[pv.CellType.TETRA].astype(np.int32)
    return vertices, elements


@pytest.fixture
def dense_2d_mesh() -> tuple[np.ndarray, np.ndarray]:
    """Create a dense triangular mesh of a unit square for level-set testing."""
    from scipy.spatial import Delaunay

    resolution = 10
    x = np.linspace(0, 1, resolution)
    y = np.linspace(0, 1, resolution)
    xx, yy = np.meshgrid(x, y)
    points = np.column_stack([xx.ravel(), yy.ravel()])
    tri = Delaunay(points)
    return points.astype(np.float64), tri.simplices.astype(np.int32)


@pytest.fixture
def dense_2d_mesh_fine() -> tuple[np.ndarray, np.ndarray]:
    """Create a finer dense triangular mesh for level-set interface tests."""
    from scipy.spatial import Delaunay

    resolution = 15
    x = np.linspace(0, 1, resolution)
    y = np.linspace(0, 1, resolution)
    xx, yy = np.meshgrid(x, y)
    points = np.column_stack([xx.ravel(), yy.ravel()])
    tri = Delaunay(points)
    return points.astype(np.float64), tri.simplices.astype(np.int32)
