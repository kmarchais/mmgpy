# PyVista Integration

This tutorial covers the integration between mmgpy and PyVista for visualization and mesh interoperability.

## Overview

PyVista is a powerful 3D visualization library for Python. mmgpy provides seamless conversion to and from PyVista meshes, enabling:

- Interactive visualization of meshes
- Loading meshes from PyVista geometric primitives
- Quality inspection and comparison
- Integration with PyVista workflows

## Quick Visualization

The simplest way to visualize a mesh is using the built-in `plot()` method:

```python
import mmgpy

mesh = mmgpy.read("input.mesh")
mesh.remesh(hmax=0.1)

# One-liner visualization with edges shown by default
mesh.plot()

# Customize with any PyVista plot options
mesh.plot(color="lightblue", opacity=0.8, show_edges=False)
```

## Custom Plotter Integration

For more complex visualizations, use the `vtk` property to access the PyVista mesh:

```python
import mmgpy
import pyvista as pv

mesh = mmgpy.read("input.mesh")
mesh.remesh(hmax=0.1)

# Use mesh.vtk with any PyVista plotter
plotter = pv.Plotter()
plotter.add_mesh(mesh.vtk, show_edges=True, color="lightblue")
plotter.show()
```

## Converting to PyVista

For full control, convert to a PyVista object with `to_pyvista()`:

```python
import mmgpy
import pyvista as pv

# Load and remesh
mesh = mmgpy.read("input.mesh")
mesh.remesh(hmax=0.1)

# Convert to PyVista (same as mesh.vtk)
pv_mesh = mesh.to_pyvista()

# Visualize
pv_mesh.plot(show_edges=True)
```

## Working with PyVista datasets directly

The `.mmg` accessor (registered automatically when you `import mmgpy`) lets you operate on PyVista datasets without ever wrapping them in `mmgpy.Mesh`:

```python
import mmgpy  # noqa: F401  -- registers the accessor
import pyvista as pv

# Surface mesh — accessor returns PolyData
sphere = pv.Sphere(radius=1.0)
remeshed_surface = sphere.mmg.remesh(hsiz=0.1)

# Volume mesh — accessor returns UnstructuredGrid
cube = pv.Box().triangulate().delaunay_3d()
remeshed_volume = cube.mmg.remesh(hsiz=0.2)
```

The accessor auto-detects the mesh kind (`mesh.mmg.kind` returns the matching `MeshKind` enum). For Medit `.mesh`/`.meshb` files, `pv.read("foo.mesh")` works directly via mmgpy's reader plugin.

## Visualization Examples

### Basic Visualization

```python
import mmgpy

mesh = mmgpy.read("input.mesh")
mesh.plot()  # Simple one-liner with edges
```

### Side-by-Side Comparison

Compare before and after remeshing:

```python
import mmgpy
import pyvista as pv

mesh = mmgpy.read("input.mesh")
before = mesh.to_pyvista()

mesh.remesh(hmax=0.1)
after = mesh.to_pyvista()

pl = pv.Plotter(shape=(1, 2))

pl.subplot(0, 0)
pl.add_mesh(before, show_edges=True, color="lightblue")
pl.add_text("Before", font_size=12)

pl.subplot(0, 1)
pl.add_mesh(after, show_edges=True, color="lightgreen")
pl.add_text("After", font_size=12)

pl.link_views()
pl.show()
```

### Quality Visualization

Visualize element quality:

```python
import mmgpy
import pyvista as pv
import numpy as np

mesh = mmgpy.read("input.mesh")
mesh.remesh(hmax=0.1)

pv_mesh = mesh.to_pyvista()

# Compute quality (PyVista has built-in quality metrics)
quality = pv_mesh.cell_quality("scaled_jacobian")

# Plot with quality colormap
quality.plot(
    scalars="scaled_jacobian",
    cmap="RdYlGn",
    show_edges=True,
    scalar_bar_args={"title": "Quality"},
)
```

### Animation

Animate a remeshing sequence:

```python
import mmgpy
import pyvista as pv

mesh = mmgpy.read("input.mesh")

pl = pv.Plotter()
actor = pl.add_mesh(mesh.to_pyvista(), show_edges=True)
pl.show(interactive_update=True, auto_close=False)

for hmax in [0.5, 0.3, 0.2, 0.15, 0.1]:
    mesh.remesh(hmax=hmax, verbose=-1)
    actor.mapper.SetInputData(mesh.to_pyvista())
    pl.update()

pl.close()
```

## Working with Mesh Data

### Transferring Scalar Fields

```python
import mmgpy
import pyvista as pv
import numpy as np

mesh = mmgpy.read("input.mesh")

# Add a scalar field to the mesh
vertices = mesh.get_vertices()
scalar_field = np.sin(vertices[:, 0] * 2 * np.pi)
mesh["temperature"] = scalar_field

# Convert to PyVista and add user fields manually
pv_mesh = mesh.to_pyvista()
pv_mesh["temperature"] = mesh["temperature"]

# Plot with scalar field
pv_mesh.plot(scalars="temperature", show_edges=True, cmap="coolwarm")
```

### From PyVista with Data

<!-- pytest-codeblocks:skip -->

```python
import mmgpy  # noqa: F401  -- registers the accessor
import pyvista as pv

# User-defined point_data survives on the dataset; for interpolation onto
# a remeshed dataset, pass transfer_fields=True (requires the underlying
# Mesh path; full accessor support lands in a follow-up PR).
sphere = pv.Sphere()
sphere.point_data["elevation"] = sphere.points[:, 2]

remeshed = sphere.mmg.remesh(hsiz=0.1, transfer_fields=True)
elevation = remeshed.point_data["elevation"]
print(f"Elevation range: {elevation.min():.2f} to {elevation.max():.2f}")
```

## Interactive Workflows

### Interactive Refinement

<!-- pytest-codeblocks:skip -->

```python
import mmgpy  # noqa: F401  -- registers the accessor
import pyvista as pv
from pyvista import examples

bunny = examples.download_bunny()

def remesh_callback(value):
    remeshed = bunny.mmg.remesh(hmax=value, verbose=-1)
    actor.mapper.SetInputData(remeshed)
    pl.render()

pl = pv.Plotter()
actor = pl.add_mesh(bunny, show_edges=True)
pl.add_slider_widget(
    remesh_callback,
    rng=[0.01, 0.1],
    value=0.05,
    title="hmax",
    interaction_event="always",
)
pl.show()
```

### Picking Points for Refinement

<!-- pytest-codeblocks:skip -->

```python
import mmgpy  # noqa: F401  -- registers reader plugin + accessor
import pyvista as pv

mesh = pv.read("input.mesh")
pinned_sizing = []

def add_refinement(point):
    pinned_sizing.append(
        {"shape": "sphere", "center": point, "radius": 0.1, "size": 0.01},
    )
    remeshed = mesh.mmg.remesh(hmax=0.1, local_sizing=pinned_sizing, verbose=-1)
    actor.mapper.SetInputData(remeshed)
    pl.render()

pl = pv.Plotter()
actor = pl.add_mesh(mesh, show_edges=True, pickable=True)
pl.enable_point_picking(callback=add_refinement, show_message="Click to add refinement")
pl.show()
```

## Complete Example

Full workflow from PyVista primitive to remeshed output:

```python
import mmgpy  # noqa: F401  -- registers the accessor
import pyvista as pv

torus = pv.ParametricTorus(ringradius=1.0, crosssectionradius=0.3)
print(f"Original: {torus.n_faces} triangles")

# Remesh with adaptive sizing — sphere constraint near (1, 0, 0)
remeshed = torus.mmg.remesh(
    hmax=0.1,
    hausd=0.001,
    verbose=1,
    local_sizing=[
        {"shape": "sphere", "center": (1.0, 0, 0), "radius": 0.3, "size": 0.02},
    ],
)
print(f"Remeshed: {remeshed.n_faces} triangles")

quality_mean = remeshed.mmg.element_qualities().mean()
print(f"Quality: {quality_mean:.3f}")

pl = pv.Plotter()
pl.add_mesh(remeshed, show_edges=True, edge_color="gray")
pl.add_text(f"Quality: {quality_mean:.3f}", font_size=10)
pl.show()
```

## Tips

1. **Memory**: Large meshes may use significant memory when converted. Consider saving to file for very large meshes.

2. **Cell types**: PyVista supports many cell types, but mmgpy requires triangles (surface/2D) or tetrahedra (3D). Use `triangulate()` if needed.

3. **Coordinates**: mmgpy uses 0-indexed arrays. PyVista point/cell IDs match directly.

4. **Performance**: For real-time visualization, use `interactive_update=True` and batch updates.

## The `.mmg` Dataset Accessor

When mmgpy is installed, every PyVista `UnstructuredGrid` and `PolyData` instance gains a `.mmg` accessor exposing MMG operations directly. The accessor takes and returns PyVista datasets, so it composes with the rest of the PyVista API without manually constructing an `mmgpy.Mesh`.

### Remeshing variants

<!-- pytest-codeblocks:skip -->

```python
import pyvista as pv
import mmgpy  # noqa: F401  -- registers the accessor

mesh = pv.read("brain.mesh")

# Standard adaptive remeshing
remeshed = mesh.mmg.remesh(hsiz=0.1)

# Quality optimization without topology changes
optimized = mesh.mmg.remesh_optimize()

# Uniform target edge size
uniform = mesh.mmg.remesh_uniform(0.05)

# Lagrangian (moving-mesh) — TET or 2D only
moved = mesh.mmg.remesh_lagrangian(displacement)

# Level-set discretization — extracts the zero isosurface as a boundary
carved = mesh.mmg.remesh_levelset(levelset)
```

### Local sizing constraints

Pass a `local_sizing` keyword to any remesh variant. Each constraint is a dict whose `"shape"` selects the geometry:

<!-- pytest-codeblocks:skip -->

```python
constrained = mesh.mmg.remesh(
    nosizreq=True,  # respect the metric we built
    hgrad=1.3,
    local_sizing=[
        {"shape": "sphere", "center": (0, 0, 0), "radius": 0.4, "size": 0.05},
        {"shape": "box", "bounds": [[0, 0, 0], [1, 1, 1]], "size": 0.1},
        {"shape": "cylinder", "point1": (0, 0, 0), "point2": (1, 0, 0), "radius": 0.2, "size": 0.05},
        {"shape": "from_point", "point": (0.5, 0.5, 0.5), "near_size": 0.02, "far_size": 0.1, "influence_radius": 0.5},
    ],
)
```

### Solution I/O

`.sol`/`.solb` files round-trip through the accessor; sibling `.sol` files are auto-loaded on `pv.read("foo.mesh")`:

<!-- pytest-codeblocks:skip -->

```python
mesh.point_data["metric"] = my_metric
mesh.mmg.save_sol("out.sol")

other = pv.read("foo.mesh")
other.mmg.load_sol("foo.sol")
```

### Validation and quality

<!-- pytest-codeblocks:skip -->

```python
report = mesh.mmg.validate(detailed=True)  # ValidationReport
print(report.quality.mean, report.is_valid)

# MMG's in-radius ratio (distinct from PyVista's cell_quality)
qualities = mesh.mmg.element_qualities()
```

### MMG-specific topology and centroid

PyVista exposes 0-based VTK adjacency via `dataset.cell_neighbors(idx)` and `dataset.point_neighbors(idx)`. When you specifically need MMG's 1-based adjacency or its volume/area-weighted centroid (distinct from `dataset.center`, which is the unweighted arithmetic mean), use the accessor:

<!-- pytest-codeblocks:skip -->

```python
mesh.mmg.adjacent_elements(1)   # MMG-adjacent elements of element 1
mesh.mmg.vertex_neighbors(1)    # MMG-adjacent vertices of vertex 1
mesh.mmg.center_of_mass()       # volume-weighted (3D) or area-weighted (2D)
```

### Mesh kind

<!-- pytest-codeblocks:skip -->

```python
print(mesh.mmg.kind)  # MeshKind.TETRAHEDRAL / TRIANGULAR_2D / TRIANGULAR_SURFACE
```

## Next Steps

- [Level-Set Extraction](levelset-extraction.md) - Extract isosurfaces
- [API Reference](../api/index.md) - Detailed API documentation
