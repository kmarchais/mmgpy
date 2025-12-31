# /// script
# requires-python = ">=3.9"
# dependencies = [
#     "mmgpy",
#     "numpy",
#     "matplotlib",
#     "scipy",
# ]
#
# [tool.uv.sources]
# mmgpy = { path = "../.." }
# ///
"""2D Lagrangian motion remeshing example.

This example demonstrates how to use the pure Python Lagrangian motion
implementation to deform a 2D mesh while maintaining mesh quality.

The Python implementation uses Laplacian smoothing to propagate boundary
displacements to interior nodes, then applies the motion and remeshes.
This works on all platforms without requiring the ELAS library.
"""

import matplotlib.pyplot as plt
import matplotlib.tri as mtri
import numpy as np

from mmgpy import MmgMesh2D, move_mesh


def create_unit_square_mesh() -> tuple[np.ndarray, np.ndarray]:
    """Create a simple unit square mesh."""
    n = 5
    x = np.linspace(0, 1, n)
    y = np.linspace(0, 1, n)
    xx, yy = np.meshgrid(x, y)
    vertices = np.column_stack([xx.ravel(), yy.ravel()]).astype(np.float64)

    tri = mtri.Triangulation(vertices[:, 0], vertices[:, 1])
    triangles = tri.triangles.astype(np.int32)

    return vertices, triangles


def main() -> None:
    """Demonstrate 2D Lagrangian motion using pure Python implementation."""
    vertices, triangles = create_unit_square_mesh()
    print(f"Initial mesh: {len(vertices)} vertices, {len(triangles)} triangles")

    mesh = MmgMesh2D(vertices, triangles)

    # Create radial expansion displacement field
    n_vertices = vertices.shape[0]
    displacement = np.zeros((n_vertices, 2), dtype=np.float64)

    center = np.array([0.5, 0.5])
    for i in range(n_vertices):
        r = np.linalg.norm(vertices[i] - center)
        if r > 0.01:
            direction = (vertices[i] - center) / r
            displacement[i] = direction * 0.05

    print("Applying Lagrangian motion (pure Python implementation)...")
    move_mesh(mesh, displacement, hmax=0.15, verbose=False)

    output_vertices = mesh.get_vertices()
    output_triangles = mesh.get_triangles()
    print(
        f"Output mesh: {len(output_vertices)} vertices, "
        f"{len(output_triangles)} triangles",
    )

    _fig, axes = plt.subplots(1, 2, figsize=(12, 5))

    axes[0].triplot(vertices[:, 0], vertices[:, 1], triangles, "b-", linewidth=0.5)
    axes[0].plot(vertices[:, 0], vertices[:, 1], "b.", markersize=3)
    axes[0].set_title("Original Mesh")
    axes[0].set_aspect("equal")
    axes[0].set_xlim(-0.1, 1.1)
    axes[0].set_ylim(-0.1, 1.1)

    axes[1].triplot(
        output_vertices[:, 0],
        output_vertices[:, 1],
        output_triangles,
        "r-",
        linewidth=0.5,
    )
    axes[1].plot(output_vertices[:, 0], output_vertices[:, 1], "r.", markersize=3)
    axes[1].set_title("After Lagrangian Motion")
    axes[1].set_aspect("equal")
    axes[1].set_xlim(-0.1, 1.1)
    axes[1].set_ylim(-0.1, 1.1)

    plt.tight_layout()
    plt.show()


if __name__ == "__main__":
    main()
