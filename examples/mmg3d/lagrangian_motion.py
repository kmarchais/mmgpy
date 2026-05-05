# /// script
# requires-python = ">=3.9"
# dependencies = [
#     "mmgpy",
#     "numpy",
#     "pyvista",
#     "scipy",
# ]
#
# [tool.uv.sources]
# mmgpy = { path = "../.." }
# ///
"""3D Lagrangian motion remeshing example.

This example demonstrates how to use the pure Python Lagrangian motion
implementation to deform a 3D mesh while maintaining mesh quality.

The Python implementation uses Laplacian smoothing to propagate boundary
displacements to interior nodes, then applies the motion and remeshes.
This works on all platforms without requiring the ELAS library.
"""

import numpy as np
import pyvista as pv

import mmgpy  # noqa: F401  -- registers the .mmg accessor


def create_unit_cube_mesh() -> tuple[np.ndarray, np.ndarray]:
    """Create a simple unit cube mesh using PyVista."""
    cube = pv.Cube().triangulate().subdivide(2)
    tetra = cube.delaunay_3d()
    vertices = np.array(tetra.points, dtype=np.float64)
    elements = tetra.cells_dict[pv.CellType.TETRA].astype(np.int32)
    return vertices, elements


def main() -> None:
    """Demonstrate 3D Lagrangian motion using pure Python implementation."""
    vertices, elements = create_unit_cube_mesh()
    print(f"Initial mesh: {len(vertices)} vertices, {len(elements)} tetrahedra")

    original = pv.UnstructuredGrid({pv.CellType.TETRA: elements}, vertices)

    n_vertices = vertices.shape[0]
    displacement = np.zeros((n_vertices, 3), dtype=np.float64)
    center = np.array([0.0, 0.0, 0.0])
    for i in range(n_vertices):
        r = np.linalg.norm(vertices[i] - center)
        if r > 0.01:
            direction = (vertices[i] - center) / r
            displacement[i] = direction * 0.1 * (1.0 - r)

    print("Applying Lagrangian motion (pure Python implementation)...")
    deformed = original.mmg.move(displacement, hmax=0.2, verbose=False)

    n_tets = deformed.cells_dict.get(pv.CellType.TETRA, np.empty((0, 4))).shape[0]
    print(f"Output mesh: {deformed.n_points} vertices, {n_tets} tetrahedra")

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
