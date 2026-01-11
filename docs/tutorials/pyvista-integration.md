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
plotter.add_mesh(other_mesh.vtk, color="red", opacity=0.5)
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

## Converting from PyVista

Create mmgpy meshes from PyVista geometry:

```python
import mmgpy
import pyvista as pv

# Create PyVista geometry
sphere = pv.Sphere(radius=1.0)

# Convert to surface mesh
mesh = mmgpy.from_pyvista(sphere, mesh_type="surface")

# Or for volumetric meshes (requires tetrahedral cells)
cube = pv.Box().triangulate().delaunay_3d()
mesh_3d = mmgpy.from_pyvista(cube, mesh_type="3d")
```

Mesh type options:

| `mesh_type` | Description                 |
| ----------- | --------------------------- |
| `"surface"` | Surface triangular mesh     |
| `"3d"`      | Volumetric tetrahedral mesh |
| `"2d"`      | 2D triangular mesh          |

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
quality = pv_mesh.compute_cell_quality(quality_measure="scaled_jacobian")

# Plot with quality colormap
quality.plot(
    scalars="CellQuality",
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

# Convert to PyVista - fields are preserved
pv_mesh = mesh.to_pyvista()

# Plot with scalar field
pv_mesh.plot(scalars="temperature", show_edges=True, cmap="coolwarm")
```

### From PyVista with Data

```python
import mmgpy
import pyvista as pv
import numpy as np

# Create PyVista mesh with data
sphere = pv.Sphere()
sphere["elevation"] = sphere.points[:, 2]

# Convert to mmgpy
mesh = mmgpy.from_pyvista(sphere, mesh_type="surface")

# Access the field
elevation = mesh["elevation"]
print(f"Elevation range: {elevation.min():.2f} to {elevation.max():.2f}")
```

## Interactive Workflows

### Interactive Refinement

```python
import mmgpy
import pyvista as pv
from pyvista import examples

# Load example mesh
bunny = examples.download_bunny()

# Convert to mmgpy surface mesh
mesh = mmgpy.from_pyvista(bunny, mesh_type="surface")

def remesh_callback(value):
    mesh.remesh(hmax=value, verbose=-1)
    pl.update()

pl = pv.Plotter()
actor = pl.add_mesh(mesh.to_pyvista(), show_edges=True)
pl.add_slider_widget(
    remesh_callback,
    rng=[0.01, 0.1],
    value=0.05,
    title="hmax",
)
pl.show()
```

### Picking Points for Refinement

```python
import mmgpy
import pyvista as pv

mesh = mmgpy.read("input.mesh")
pv_mesh = mesh.to_pyvista()

def add_refinement(point):
    mesh.set_size_sphere(center=point, radius=0.1, size=0.01)
    mesh.remesh(hmax=0.1, verbose=-1)
    actor.mapper.SetInputData(mesh.to_pyvista())
    pl.update()

pl = pv.Plotter()
actor = pl.add_mesh(pv_mesh, show_edges=True, pickable=True)
pl.enable_point_picking(callback=add_refinement, show_message="Click to add refinement")
pl.show()
```

## Complete Example

Full workflow from PyVista primitive to remeshed output:

```python
import mmgpy
import pyvista as pv
import numpy as np

# Create a complex geometry in PyVista
torus = pv.ParametricTorus(ringradius=1.0, crosssectionradius=0.3)

# Convert to mmgpy surface mesh
mesh = mmgpy.from_pyvista(torus, mesh_type="surface")

print(f"Original: {mesh.get_mesh_size()['triangles']} triangles")

# Remesh with adaptive sizing
mesh.set_size_sphere(center=[1.0, 0, 0], radius=0.3, size=0.02)
result = mesh.remesh(hmax=0.1, hausd=0.001, verbose=1)

print(f"Remeshed: {result.triangles_after} triangles")
print(f"Quality: {result.quality_mean_after:.3f}")

# Visualize result
pv_result = mesh.to_pyvista()

pl = pv.Plotter()
pl.add_mesh(pv_result, show_edges=True, edge_color="gray")
pl.add_text(f"Quality: {result.quality_mean_after:.3f}", font_size=10)
pl.show()
```

## Tips

1. **Memory**: Large meshes may use significant memory when converted. Consider saving to file for very large meshes.

2. **Cell types**: PyVista supports many cell types, but mmgpy requires triangles (surface/2D) or tetrahedra (3D). Use `triangulate()` if needed.

3. **Coordinates**: mmgpy uses 0-indexed arrays. PyVista point/cell IDs match directly.

4. **Performance**: For real-time visualization, use `interactive_update=True` and batch updates.

## Next Steps

- [Level-Set Extraction](levelset-extraction.md) - Extract isosurfaces
- [API Reference](../api/index.md) - Detailed API documentation
