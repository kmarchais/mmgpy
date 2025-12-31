# /// script
# requires-python = ">=3.9"
# dependencies = [
#     "mmgpy",
#     "numpy",
#     "pyvista",
# ]
#
# [tool.uv.sources]
# mmgpy = { path = "../.." }
# ///
"""Lagrangian motion remeshing example.

This example demonstrates how to use the Lagrangian motion remeshing feature
to deform a mesh while maintaining mesh quality. The mesh is deformed by
applying a displacement field to all vertices.
"""

import numpy as np
import pyvista as pv

from mmgpy import MmgMesh3D


def create_unit_cube_mesh() -> tuple[np.ndarray, np.ndarray]:
    """Create a simple unit cube mesh using PyVista."""
    cube = pv.Cube().triangulate().subdivide(2)
    tetra = cube.delaunay_3d()
    vertices = np.array(tetra.points, dtype=np.float64)
    elements = tetra.cells_dict[pv.CellType.TETRA].astype(np.int32)
    return vertices, elements


def main() -> None:
    """Demonstrate Lagrangian motion remeshing."""
    vertices, elements = create_unit_cube_mesh()
    print(f"Initial mesh: {len(vertices)} vertices, {len(elements)} tetrahedra")

    mesh = MmgMesh3D(vertices, elements)

    n_vertices = vertices.shape[0]
    displacement = np.zeros((n_vertices, 3), dtype=np.float64)

    center = np.array([0.0, 0.0, 0.0])
    for i in range(n_vertices):
        r = np.linalg.norm(vertices[i] - center)
        if r > 0.01:
            direction = (vertices[i] - center) / r
            displacement[i] = direction * 0.1 * (1.0 - r)

    print("Applying Lagrangian motion remeshing...")
    mesh.remesh_lagrangian(displacement, hmax=0.2, verbose=False)

    output_vertices = mesh.get_vertices()
    output_elements = mesh.get_elements()
    print(
        f"Output mesh: {len(output_vertices)} vertices, "
        f"{len(output_elements)} tetrahedra",
    )

    original = pv.UnstructuredGrid(
        {pv.CellType.TETRA: elements},
        vertices,
    )
    deformed = pv.UnstructuredGrid(
        {pv.CellType.TETRA: output_elements},
        output_vertices,
    )

    pl = pv.Plotter(shape=(1, 2))

    pl.subplot(0, 0)
    pl.add_mesh(original, show_edges=True, opacity=0.7)
    pl.add_title("Original Mesh")

    pl.subplot(0, 1)
    pl.add_mesh(deformed, show_edges=True, opacity=0.7)
    pl.add_title("After Lagrangian Motion")

    pl.link_views()
    pl.show()


if __name__ == "__main__":
    main()
