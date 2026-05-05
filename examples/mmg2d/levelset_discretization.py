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
"""Level-set discretization example: Mesh conforming to an interface.

This example demonstrates the key feature of level-set discretization:
**the mesh edges conform to the level-set interface** (where phi = 0).

The level-set function is the signed distance to a circle:
    phi(x,y) = sqrt((x-cx)^2 + (y-cy)^2) - radius

Before discretization: mesh edges cross the interface arbitrarily
After discretization: mesh edges align with the interface

This is essential for:
- Multi-material simulations (sharp interface between materials)
- Phase field methods
- Fluid-structure interaction
"""

from pathlib import Path

import numpy as np
import pyvista as pv
from scipy.spatial import Delaunay

import mmgpy  # noqa: F401  -- registers the .mmg accessor


def create_square_mesh(
    xmin: float = 0.0,
    xmax: float = 1.0,
    ymin: float = 0.0,
    ymax: float = 1.0,
    resolution: int = 20,
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
    """Compute signed distance to a circle (negative inside, positive outside)."""
    cx, cy = center
    distances = np.sqrt((vertices[:, 0] - cx) ** 2 + (vertices[:, 1] - cy) ** 2)
    return (distances - radius).reshape(-1, 1)


def to_pyvista_mesh(
    vertices: np.ndarray,
    triangles: np.ndarray,
    levelset: np.ndarray | None = None,
) -> pv.PolyData:
    """Build a PyVista PolyData from 2D arrays with an optional level-set scalar."""
    vertices_3d = np.column_stack([vertices, np.zeros(len(vertices))])
    faces = np.hstack([np.full((len(triangles), 1), 3), triangles]).ravel()
    mesh = pv.PolyData(vertices_3d, faces=faces)
    if levelset is not None:
        mesh.point_data["levelset"] = levelset.ravel()
    return mesh


def extract_interface(result: pv.PolyData) -> pv.PolyData:
    """Extract interface edges (boundary between ref=2 and ref=3 regions).

    The accessor's ``remesh_levelset`` returns a PolyData containing both
    triangles and the MMG-tagged ridge edges. Ridge edges between triangles
    of differing material refs are exactly the interface; everything else
    is mesh boundary or interior.
    """
    triangles = result.regular_faces
    triangle_refs = result.cell_data["refs"][result.n_lines :]
    vertices_3d = result.points

    edge_triangles: dict[tuple[int, int], list[int]] = {}
    for tri_idx, tri in enumerate(triangles):
        for i in range(3):
            v1, v2 = tri[i], tri[(i + 1) % 3]
            edge = (min(v1, v2), max(v1, v2))
            edge_triangles.setdefault(edge, []).append(tri_idx)

    interface_edges = [
        edge
        for edge, tri_indices in edge_triangles.items()
        if len(tri_indices) == 2
        and triangle_refs[tri_indices[0]] != triangle_refs[tri_indices[1]]
    ]

    if not interface_edges:
        return pv.PolyData()

    lines = []
    for v1, v2 in interface_edges:
        lines.extend([2, v1, v2])

    return pv.PolyData(vertices_3d, lines=lines)


def main() -> None:
    """Demonstrate mesh conforming to a level-set interface."""
    center = (0.5, 0.5)
    radius = 0.3

    print("Creating initial square mesh...")
    vertices, triangles = create_square_mesh(resolution=20)
    levelset = circle_levelset(vertices, center=center, radius=radius)
    print(f"Initial mesh: {len(vertices)} vertices, {len(triangles)} triangles")

    initial_mesh = to_pyvista_mesh(vertices, triangles, levelset)

    print("\nApplying level-set discretization...")
    result = initial_mesh.mmg.remesh_levelset(levelset, hmax=0.08, verbose=False)

    new_vertices = np.asarray(result.points[:, :2])
    new_triangles = result.regular_faces
    new_levelset = circle_levelset(new_vertices, center=center, radius=radius)
    print(f"Result mesh: {len(new_vertices)} vertices, {len(new_triangles)} triangles")

    interface = extract_interface(result)

    theta = np.linspace(0, 2 * np.pi, 100)
    circle_points = np.column_stack(
        [
            center[0] + radius * np.cos(theta),
            center[1] + radius * np.sin(theta),
            np.zeros(100),
        ],
    )
    circle = pv.Spline(circle_points, 100)

    pl = pv.Plotter(shape=(1, 2), window_size=(1400, 700), off_screen=True)

    pl.subplot(0, 0)
    pl.add_mesh(
        initial_mesh,
        scalars="levelset",
        cmap="RdBu_r",
        clim=[-0.5, 0.5],
        show_edges=True,
        edge_color="gray",
        line_width=0.5,
    )
    pl.add_mesh(circle, color="black", line_width=3, label="Interface (φ=0)")
    pl.add_title("Before: Mesh edges cross interface")
    pl.view_xy()

    pl.subplot(0, 1)
    result_mesh = to_pyvista_mesh(new_vertices, new_triangles, new_levelset)
    pl.add_mesh(
        result_mesh,
        scalars="levelset",
        cmap="RdBu_r",
        clim=[-0.5, 0.5],
        show_edges=True,
        edge_color="gray",
        line_width=0.5,
    )
    if interface.n_points > 0:
        pl.add_mesh(
            interface,
            color="black",
            line_width=3,
            label="Interface (mesh edges)",
        )
    pl.add_title("After: Mesh edges conform to interface")
    pl.view_xy()

    output_path = Path(__file__).parent / "levelset_discretization.png"
    pl.screenshot(output_path)
    print(f"\nImage saved to: {output_path}")


if __name__ == "__main__":
    main()
