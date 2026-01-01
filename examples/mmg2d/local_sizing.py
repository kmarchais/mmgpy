# /// script
# requires-python = ">=3.9"
# dependencies = [
#     "mmgpy",
#     "pyvista",
#     "matplotlib",
# ]
#
# [tool.uv.sources]
# mmgpy = { path = "../.." }
# ///

"""Local sizing example: per-region mesh density control.

This example demonstrates the local sizing API for controlling mesh density
in different regions without manually constructing metric fields.

Features demonstrated:
- SphereSize: Fine mesh in circular regions (corners)
- PointSize: Gradual mesh refinement from center outward
- Combining multiple sizing constraints (minimum size wins)
- Visualizing the remeshed result colored by triangle area
"""

from pathlib import Path

import matplotlib as mpl
import matplotlib.tri as mtri

mpl.use("Agg")  # Use non-interactive backend
import matplotlib.pyplot as plt
import numpy as np

from mmgpy import MmgMesh2D
from mmgpy.sizing import (
    PointSize,
    SphereSize,
    compute_sizes_from_constraints,
    sizes_to_metric,
)

# Create a simple square mesh
n = 20
x = np.linspace(0, 1, n)
y = np.linspace(0, 1, n)
xx, yy = np.meshgrid(x, y)
points = np.column_stack([xx.ravel(), yy.ravel()])

# Create triangles using Delaunay-like pattern
triangles = []
for i in range(n - 1):
    for j in range(n - 1):
        idx = i * n + j
        # Two triangles per cell
        triangles.append([idx, idx + 1, idx + n])
        triangles.append([idx + 1, idx + n + 1, idx + n])

vertices = np.array(points, dtype=np.float64)
triangles_arr = np.array(triangles, dtype=np.int32)

# Create MMG mesh
mesh = MmgMesh2D(vertices, triangles_arr)

# Define sizing constraints
constraints = []

# Fine mesh in corners using SphereSize (circle in 2D)
corner_size = 0.015
corner_radius = 0.15
corners = [[0.0, 0.0], [1.0, 0.0], [0.0, 1.0], [1.0, 1.0]]
for corner in corners:
    constraints.append(
        SphereSize(
            center=np.array(corner),
            radius=corner_radius,
            size=corner_size,
        ),
    )

# Gradual refinement from center using PointSize
constraints.append(
    PointSize(
        point=np.array([0.5, 0.5]),
        near_size=0.02,
        far_size=0.08,
        influence_radius=0.5,
    ),
)

print(f"Number of sizing constraints: {len(constraints)}")

# Compute the sizing field manually using low-level API
verts = mesh.get_vertices()
sizes = compute_sizes_from_constraints(verts, constraints)

# Handle infinite values (vertices outside all region constraints)
finite_mask = np.isfinite(sizes)
if not np.all(finite_mask):
    max_finite = np.max(sizes[finite_mask])
    sizes[~finite_mask] = max_finite * 10

print(f"Size range: {sizes.min():.4f} - {sizes.max():.4f}")

# Convert to metric and set on mesh
metric = sizes_to_metric(sizes)
mesh["metric"] = metric

# Remesh with the metric field
# nosizreq=True tells MMG to use our metric as-is
# hgrad controls the gradation (size ratio between neighbors)
mesh.remesh(nosizreq=True, hgrad=1.3, verbose=-1)

n_verts = len(mesh.get_vertices())
n_tris = len(mesh.get_triangles())
print(f"Remeshed: {n_verts} vertices, {n_tris} triangles")

# Convert to PyVista for visualization
pv_mesh_output = mesh.to_pyvista()

# Compute triangle areas for coloring
pv_mesh_output = pv_mesh_output.compute_cell_sizes(
    area=True,
    length=False,
    volume=False,
)
output_areas = pv_mesh_output["Area"]

# Plot side by side: sizing field (left) and output mesh (right)
fig, axes = plt.subplots(1, 2, figsize=(16, 8), constrained_layout=True)

# Left: Show the input sizing field
scatter = axes[0].scatter(
    verts[:, 0],
    verts[:, 1],
    c=sizes,
    cmap="viridis_r",
    s=30,
    edgecolors="black",
    linewidth=0.3,
)
fig.colorbar(scatter, ax=axes[0], label="Target edge size", shrink=0.8)

# Add sizing region indicators
for corner in corners:
    circle = plt.Circle(
        corner,
        corner_radius,
        fill=False,
        color="red",
        linestyle="--",
        linewidth=2,
    )
    axes[0].add_patch(circle)
center_circle = plt.Circle(
    [0.5, 0.5],
    0.5,
    fill=False,
    color="white",
    linestyle="--",
    linewidth=2,
)
axes[0].add_patch(center_circle)

axes[0].set_xlim(-0.05, 1.05)
axes[0].set_ylim(-0.05, 1.05)
axes[0].set_aspect("equal")
axes[0].set_title("Input: Sizing field (target edge size)")
axes[0].set_xlabel("x")
axes[0].set_ylabel("y")

# Right: Show the output mesh colored by triangle area
tri_points = pv_mesh_output.points
cells = pv_mesh_output.faces.reshape(-1, 4)[:, 1:4]
triang = mtri.Triangulation(tri_points[:, 0], tri_points[:, 1], cells)
tripcolor = axes[1].tripcolor(
    triang,
    output_areas,
    cmap="viridis_r",
    edgecolors="black",
    linewidth=0.3,
)
fig.colorbar(tripcolor, ax=axes[1], label="Triangle area", shrink=0.8)

axes[1].set_xlim(-0.05, 1.05)
axes[1].set_ylim(-0.05, 1.05)
axes[1].set_aspect("equal")
axes[1].set_title(f"Output: Remeshed ({n_verts} vertices, {n_tris} triangles)")
axes[1].set_xlabel("x")
axes[1].set_ylabel("y")

output_path = Path(__file__).parent / "local_sizing_demo.png"
plt.savefig(output_path, dpi=150)
print(f"Saved to: {output_path}")
