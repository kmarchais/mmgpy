"""Test the MmgMesh class."""

import numpy as np
import numpy.testing as npt

from mmgpy import MmgMesh


def create_test_mesh() -> tuple[np.ndarray, np.ndarray]:
    """Create a simple tetrahedral mesh for testing."""
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


def test_solution_fields() -> None:
    """Test setting and getting solution fields."""
    vertices, elements = create_test_mesh()
    mesh = MmgMesh(vertices, elements)

    # Test metric field (isotropic)
    metric = np.array([[0.1], [0.2], [0.15], [0.1]], dtype=np.float64)
    mesh.set_metric_field(metric)
    npt.assert_array_almost_equal(mesh.get_metric_field(), metric)

    # Test displacement field
    displacement = np.array(
        [
            [0.1, 0.0, 0.0],  # Move vertex 0 in x direction
            [0.0, 0.1, 0.0],  # Move vertex 1 in y direction
            [0.0, 0.0, 0.1],  # Move vertex 2 in z direction
            [0.1, 0.1, 0.1],  # Move vertex 3 in all directions
        ],
        dtype=np.float64,
    )
    mesh.set_displacement_field(displacement)
    npt.assert_array_almost_equal(mesh.get_displacement_field(), displacement)

    # Test level set field
    levelset = np.array([[1.0], [-1.0], [0.5], [-0.5]], dtype=np.float64)
    mesh.set_levelset_field(levelset)
    npt.assert_array_almost_equal(mesh.get_levelset_field(), levelset)


def visualize_mmg_mesh() -> None:
    """Visualize a simple MmgMesh using PyVista."""
    import pyvista as pv

    vertices, elements = create_test_mesh()
    mesh = MmgMesh(vertices, elements)

    # Create PyVista mesh
    cells = [4, *mesh.get_elements().ravel()]  # [4, v1, v2, v3, v4]
    celltypes = [pv.CellType.TETRA]  # Single tetrahedron
    pv_mesh = pv.UnstructuredGrid(cells, celltypes, mesh.get_vertices())

    # Add solution fields as point data
    metric = np.array([[0.1], [0.2], [0.15], [0.1]], dtype=np.float64)
    displacement = np.array(
        [
            [0.1, 0.0, 0.0],
            [0.0, 0.1, 0.0],
            [0.0, 0.0, 0.1],
            [0.1, 0.1, 0.1],
        ],
        dtype=np.float64,
    )
    levelset = np.array([[1.0], [-1.0], [0.5], [-0.5]], dtype=np.float64)

    mesh.set_metric_field(metric)
    mesh.set_displacement_field(displacement)
    mesh.set_levelset_field(levelset)

    pv_mesh.point_data["metric"] = mesh.get_metric_field()
    pv_mesh.point_data["displacement"] = mesh.get_displacement_field()
    pv_mesh.point_data["levelset"] = mesh.get_levelset_field()

    # Visualize
    plotter = pv.Plotter()
    plotter.add_mesh(pv_mesh, show_edges=True, scalars="levelset")
    plotter.show_axes()
    plotter.show()


if __name__ == "__main__":
    test_mesh_construction()
    test_solution_fields()
    visualize_mmg_mesh()
