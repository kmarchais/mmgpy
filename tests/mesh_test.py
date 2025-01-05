"""Test the MmgMesh class."""

import numpy as np
import numpy.testing as npt

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

    # Verify vertices and elements match
    npt.assert_array_almost_equal(mesh1.get_vertices(), vertices)
    npt.assert_array_equal(mesh1.get_elements(), elements)

    # Test constructor with data
    mesh2 = MmgMesh(vertices, elements)

    # Verify vertices and elements match for second constructor
    npt.assert_array_almost_equal(mesh2.get_vertices(), vertices)
    npt.assert_array_equal(mesh2.get_elements(), elements)


def visualize_mmg_mesh() -> None:
    """Visualize a simple MmgMesh using PyVista."""
    import pyvista as pv

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

    mesh = MmgMesh()
    mesh.set_vertices_and_elements(vertices, elements)

    # Create PyVista mesh
    cells = [4, *mesh.get_elements().ravel()]  # [4, v1, v2, v3, v4]
    celltypes = [pv.CellType.TETRA]  # Single tetrahedron

    pv_mesh = pv.UnstructuredGrid(cells, celltypes, mesh.get_vertices())

    # Visualize
    plotter = pv.Plotter()
    plotter.add_mesh(pv_mesh, show_edges=True)
    plotter.show_axes()
    plotter.show()


if __name__ == "__main__":
    test_mmg_mesh()
    visualize_mmg_mesh()
