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
import pyvista as pv

import mmgpy  # noqa: F401  -- registers the .mmg accessor
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
        triangles.append([idx, idx + 1, idx + n])
        triangles.append([idx + 1, idx + n + 1, idx + n])

vertices = np.array(points, dtype=np.float64)
triangles_arr = np.array(triangles, dtype=np.int32)

# Build a PyVista PolyData (with z=0); the .mmg accessor auto-detects
# TRIANGULAR_2D from the planar coordinate.
verts_3d = np.column_stack([vertices, np.zeros(len(vertices))])
faces = np.column_stack(
    [np.full(len(triangles_arr), 3), triangles_arr],
).ravel()
pv_mesh = pv.PolyData(verts_3d, faces=faces)

# Define sizing constraints
corner_size = 0.015
corner_radius = 0.15
corners = [[0.0, 0.0], [1.0, 0.0], [0.0, 1.0], [1.0, 1.0]]
constraints = [
    SphereSize(center=np.array(corner), radius=corner_radius, size=corner_size)
    for corner in corners
]
constraints.append(
    PointSize(
        point=np.array([0.5, 0.5]),
        near_size=0.02,
        far_size=0.08,
        influence_radius=0.5,
    ),
)

print(f"Number of sizing constraints: {len(constraints)}")

# Compute the sizing field for visualization, then convert it to a scalar
# metric on the dataset's point_data. The accessor picks it up on remesh.
verts = vertices
sizes = compute_sizes_from_constraints(verts, constraints)
finite_mask = np.isfinite(sizes)
if not np.all(finite_mask):
    sizes[~finite_mask] = sizes[finite_mask].max() * 10
print(f"Size range: {sizes.min():.4f} - {sizes.max():.4f}")

pv_mesh.point_data["metric"] = sizes_to_metric(sizes)

# Remesh: nosizreq=True respects the metric we built, hgrad bounds gradation.
pv_mesh_output = pv_mesh.mmg.remesh(nosizreq=True, hgrad=1.3, verbose=-1)
print(
    f"Remeshed: {pv_mesh_output.n_points} vertices, {pv_mesh_output.n_faces} triangles",
)

# Compute triangle areas for coloring. The accessor's remesh keeps MMG
# ridges as LINE cells alongside the triangles, so slice the cell-size
# array to the polygon prefix (PolyData stores faces before lines).
pv_mesh_output = pv_mesh_output.compute_cell_sizes(
    area=True,
    length=False,
    volume=False,
)
output_areas = pv_mesh_output["Area"][: pv_mesh_output.n_faces]

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
axes[1].set_title(
    f"Output: Remeshed ({pv_mesh_output.n_points} vertices, "
    f"{pv_mesh_output.n_faces} triangles)",
)
axes[1].set_xlabel("x")
axes[1].set_ylabel("y")

output_path = Path(__file__).parent / "local_sizing_demo.png"
plt.savefig(output_path, dpi=150)
print(f"Saved to: {output_path}")
