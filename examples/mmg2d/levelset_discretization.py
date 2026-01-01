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
"""Level-set discretization example: Circle extraction from a square domain.

This example demonstrates how to use level-set discretization to extract
a circular region from a 2D mesh. This is a typical use case for:
- Material interface meshing
- Phase field simulations
- Domain decomposition

The level-set function is the signed distance to the circle:
    phi(x,y) = sqrt((x-cx)^2 + (y-cy)^2) - radius

After discretization, MMG creates elements with different refs:
- ref=2: exterior region (where phi > 0)
- ref=3: interior region (where phi < 0, inside the circle)
"""

from pathlib import Path

import numpy as np
import pyvista as pv
from scipy.spatial import Delaunay

from mmgpy import MmgMesh2D


def create_square_mesh(
    xmin: float = 0.0,
    xmax: float = 1.0,
    ymin: float = 0.0,
    ymax: float = 1.0,
    resolution: int = 30,
) -> tuple[np.ndarray, np.ndarray]:
    """Create a triangular mesh of a rectangular domain."""
    x = np.linspace(xmin, xmax, resolution)
    y = np.linspace(ymin, ymax, resolution)
    xx, yy = np.meshgrid(x, y)
    points = np.column_stack([xx.ravel(), yy.ravel()])

    tri = Delaunay(points)
    return points.astype(np.float64), tri.simplices.astype(np.int32)


def circle_levelset(
    vertices: np.ndarray,
    center: tuple[float, float] = (0.5, 0.5),
    radius: float = 0.3,
) -> np.ndarray:
    """Compute signed distance to a circle.

    Negative inside, positive outside.
    """
    cx, cy = center
    distances = np.sqrt((vertices[:, 0] - cx) ** 2 + (vertices[:, 1] - cy) ** 2)
    return (distances - radius).reshape(-1, 1)


def extract_region_edges(
    mesh: MmgMesh2D,
    element_ref: int = 3,
) -> pv.PolyData:
    """Extract edges of a region as a PyVista PolyData for visualization."""
    vertices = mesh.get_vertices()
    triangles, refs = mesh.get_triangles_with_refs()

    # Get triangles with the target ref
    target_triangles = triangles[refs == element_ref]

    if len(target_triangles) == 0:
        msg = f"No elements with ref {element_ref}. Refs: {np.unique(refs)}"
        raise ValueError(msg)

    # Add z=0 coordinate for PyVista
    vertices_3d = np.column_stack([vertices, np.zeros(len(vertices))])

    # Create faces in VTK format
    faces = np.hstack(
        [
            np.full((len(target_triangles), 1), 3),
            target_triangles,
        ],
    ).ravel()

    return pv.PolyData(vertices_3d, faces=faces)


def main() -> None:
    """Demonstrate 2D level-set discretization with circle extraction."""
    print("Creating initial square mesh...")
    vertices, triangles = create_square_mesh(resolution=30)
    print(f"Initial mesh: {len(vertices)} vertices, {len(triangles)} triangles")

    # Create mesh and compute level-set
    mesh = MmgMesh2D(vertices, triangles)
    levelset = circle_levelset(vertices, center=(0.5, 0.5), radius=0.3)

    print("\nApplying level-set discretization...")
    mesh.remesh_levelset(levelset, hmax=0.05, verbose=False)

    new_vertices = mesh.get_vertices()
    new_triangles, refs = mesh.get_triangles_with_refs()
    print(f"Result mesh: {len(new_vertices)} vertices, {len(new_triangles)} triangles")
    print(f"Element refs: {np.unique(refs)}")

    # Extract regions
    interior = extract_region_edges(mesh, element_ref=3)
    exterior = extract_region_edges(mesh, element_ref=2)

    # Visualization
    pl = pv.Plotter(shape=(1, 2), window_size=(1400, 700), off_screen=True)

    pl.subplot(0, 0)
    pl.add_mesh(
        exterior,
        show_edges=True,
        color="lightgray",
        edge_color="darkgray",
        line_width=0.5,
    )
    pl.add_mesh(
        interior,
        show_edges=True,
        color="steelblue",
        edge_color="darkblue",
        line_width=0.5,
    )
    pl.add_title("After Level-Set Discretization\n(Circle extracted)")
    pl.view_xy()

    pl.subplot(0, 1)
    # Show initial mesh for comparison
    initial_vertices_3d = np.column_stack([vertices, np.zeros(len(vertices))])
    initial_faces = np.hstack(
        [
            np.full((len(triangles), 1), 3),
            triangles,
        ],
    ).ravel()
    initial_mesh = pv.PolyData(initial_vertices_3d, faces=initial_faces)
    pl.add_mesh(
        initial_mesh,
        show_edges=True,
        color="lightyellow",
        edge_color="orange",
        line_width=0.5,
    )
    pl.add_title("Initial Square Mesh\n(Before level-set)")
    pl.view_xy()

    # Save image
    output_path = Path(__file__).parent / "levelset_discretization.png"
    pl.screenshot(str(output_path))
    print(f"\nImage saved to: {output_path}")


if __name__ == "__main__":
    main()
