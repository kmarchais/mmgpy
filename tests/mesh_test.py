"""Test the MmgMesh class."""

from pathlib import Path

import numpy as np
import numpy.testing as npt

from mmgpy import MmgMesh


def create_test_mesh() -> tuple[np.ndarray, np.ndarray]:
    """Create a cube mesh made of tetrahedra for testing."""
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


def test_mesh_construction() -> None:
    """Test basic mesh construction and geometry."""
    vertices, elements = create_test_mesh()

    # Test empty constructor and setter
    mesh1 = MmgMesh()
    mesh1.set_vertices_and_elements(vertices, elements)
    npt.assert_array_almost_equal(mesh1.get_vertices(), vertices)
    npt.assert_array_equal(mesh1.get_elements(), elements)

    # Test constructor with data
    mesh2 = MmgMesh(vertices, elements)
    npt.assert_array_almost_equal(mesh2.get_vertices(), vertices)
    npt.assert_array_equal(mesh2.get_elements(), elements)


def test_mmg_mesh() -> None:
    """Test the MmgMesh class."""
    vertices, elements = create_test_mesh()

    mesh = MmgMesh(vertices, elements)

    # Test scalar field (one value per vertex)
    metric = np.array(
        [
            [0.1],  # vertex 0
            [0.2],  # vertex 1
            [0.15],  # vertex 2
            [0.1],  # vertex 3
            [0.2],  # vertex 4
            [0.15],  # vertex 5
            [0.1],  # vertex 6
            [0.2],  # vertex 7
        ],
        dtype=np.float64,
    )
    mesh["metric"] = metric
    npt.assert_array_almost_equal(mesh["metric"], metric)

    # Test vector field (3D displacement per vertex)
    displacement = np.array(
        [
            [0.1, 0.0, 0.0],  # vertex 0
            [0.0, 0.1, 0.0],  # vertex 1
            [0.0, 0.0, 0.1],  # vertex 2
            [0.1, 0.1, 0.1],  # vertex 3
            [0.1, 0.0, 0.1],  # vertex 4
            [0.0, 0.1, 0.1],  # vertex 5
            [0.1, 0.1, 0.0],  # vertex 6
            [0.0, 0.0, 0.2],  # vertex 7
        ],
        dtype=np.float64,
    )
    mesh["displacement"] = displacement
    npt.assert_array_almost_equal(mesh["displacement"], displacement)

    # Test tensor field (symmetric 3x3 matrix stored as 6 components per vertex)
    tensor = np.array(
        [
            [1.0, 0.0, 0.0, 1.0, 0.0, 1.0],  # vertex 0: xx, xy, xz, yy, yz, zz
            [1.0, 0.1, 0.0, 1.0, 0.0, 1.0],  # vertex 1
            [1.0, 0.0, 0.1, 1.0, 0.1, 1.0],  # vertex 2
            [1.0, 0.1, 0.1, 1.0, 0.1, 1.0],  # vertex 3
            [1.1, 0.0, 0.0, 1.1, 0.0, 1.1],  # vertex 4
            [1.1, 0.1, 0.0, 1.1, 0.0, 1.1],  # vertex 5
            [1.1, 0.0, 0.1, 1.1, 0.1, 1.1],  # vertex 6
            [1.1, 0.1, 0.1, 1.1, 0.1, 1.1],  # vertex 7
        ],
        dtype=np.float64,
    )
    mesh["tensor"] = tensor
    npt.assert_array_almost_equal(mesh["tensor"], tensor)


def test_load_mesh() -> None:
    """Test loading a mesh from file."""
    vertices, elements = create_test_mesh()

    # Save mesh to file
    mesh = MmgMesh(vertices, elements)
    mesh.save(Path(__file__).parent / "test_mesh.mesh")

    # Load mesh from file
    mesh = MmgMesh(Path(__file__).parent / "test_mesh.mesh")
    npt.assert_array_almost_equal(mesh.get_vertices(), vertices)
    npt.assert_array_equal(mesh.get_elements(), elements)


def visualize_mmg_mesh() -> None:
    """Visualize a simple MmgMesh using PyVista."""
    import pyvista as pv

    vertices, elements = create_test_mesh()
    mesh = MmgMesh(vertices, elements)

    # Create PyVista mesh
    cells = []
    for elem in mesh.get_elements():
        cells.extend([4, *elem])  # [4, v1, v2, v3, v4] for each tetrahedron
    celltypes = [pv.CellType.TETRA] * len(mesh.get_elements())
    pv_mesh = pv.UnstructuredGrid(cells, celltypes, mesh.get_vertices())

    # Add solution fields as point data
    metric = np.array(
        [[0.1], [0.2], [0.15], [0.1], [0.2], [0.15], [0.1], [0.2]],
        dtype=np.float64,
    )
    displacement = np.array(
        [
            [0.1, 0.0, 0.0],
            [0.0, 0.1, 0.0],
            [0.0, 0.0, 0.1],
            [0.1, 0.1, 0.1],
            [0.1, 0.0, 0.1],
            [0.0, 0.1, 0.1],
            [0.1, 0.1, 0.0],
            [0.0, 0.0, 0.2],
        ],
        dtype=np.float64,
    )
    levelset = np.array(
        [[1.0], [-1.0], [0.5], [-0.5], [0.8], [-0.8], [0.3], [-0.3]],
        dtype=np.float64,
    )

    mesh["metric"] = metric
    mesh["displacement"] = displacement
    mesh["levelset"] = levelset

    pv_mesh.point_data["metric"] = mesh["metric"]
    pv_mesh.point_data["displacement"] = mesh["displacement"]
    pv_mesh.point_data["levelset"] = mesh["levelset"]

    # Visualize
    plotter = pv.Plotter()
    plotter.add_mesh(pv_mesh, show_edges=True, scalars="levelset")
    plotter.show_axes()
    plotter.show()


if __name__ == "__main__":
    test_mesh_construction()
    test_mmg_mesh()
    visualize_mmg_mesh()
