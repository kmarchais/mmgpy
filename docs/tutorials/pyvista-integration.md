# PyVista Integration

This tutorial covers how mmgpy plugs into PyVista for visualization and mesh interoperability.

## Overview

PyVista is a powerful 3D visualization library for Python. mmgpy registers itself with PyVista on import:

- A Medit reader/writer plugin so `pv.read("foo.mesh")` and `dataset.save("foo.mesh")` work end-to-end.
- A `.mmg` dataset accessor so `dataset.mmg.remesh(...)` operates directly on `pv.UnstructuredGrid` / `pv.PolyData`.

This means the rest of mmgpy's API composes with PyVista without an intermediate wrapper.

## Quick Visualization

PyVista's built-in `plot()` works on the dataset directly:

```python
import pyvista as pv
import mmgpy  # noqa: F401  -- registers reader/writer + accessor

mesh = pv.read("input.mesh")
remeshed = mesh.mmg.remesh(hmax=0.1)

# One-liner visualization
remeshed.plot(show_edges=True)

# Customize with any PyVista plot options
remeshed.plot(color="lightblue", opacity=0.8, show_edges=False)
```

## Custom Plotter Integration

For more complex visualizations, use any standard PyVista plotter:

```python
import pyvista as pv
import mmgpy  # noqa: F401

mesh = pv.read("input.mesh")
remeshed = mesh.mmg.remesh(hmax=0.1)

plotter = pv.Plotter()
plotter.add_mesh(remeshed, show_edges=True, color="lightblue")
plotter.show()
```

## Working with PyVista datasets directly

The `.mmg` accessor lets you operate on PyVista datasets without ever wrapping them:

```python
import pyvista as pv
import mmgpy  # noqa: F401

# Surface mesh — accessor returns PolyData
sphere = pv.Sphere(radius=1.0)
remeshed_surface = sphere.mmg.remesh(hsiz=0.1)

# Volume mesh — accessor returns UnstructuredGrid
cube = pv.Box().triangulate().delaunay_3d()
remeshed_volume = cube.mmg.remesh(hsiz=0.2)
```

The accessor auto-detects the mesh kind (`mesh.mmg.kind` returns the matching `MeshKind` enum). For Medit `.mesh`/`.meshb` files, `pv.read("foo.mesh")` works directly via mmgpy's reader plugin.

## Visualization Examples

### Side-by-Side Comparison

Compare before and after remeshing:

```python
import pyvista as pv
import mmgpy  # noqa: F401

mesh = pv.read("input.mesh")
remeshed = mesh.mmg.remesh(hmax=0.1)

pl = pv.Plotter(shape=(1, 2))

pl.subplot(0, 0)
pl.add_mesh(mesh, show_edges=True, color="lightblue")
pl.add_text("Before", font_size=12)

pl.subplot(0, 1)
pl.add_mesh(remeshed, show_edges=True, color="lightgreen")
pl.add_text("After", font_size=12)

pl.link_views()
pl.show()
```

### Quality Visualization

Visualize element quality with PyVista's built-in cell metrics:

```python
import pyvista as pv
import mmgpy  # noqa: F401

mesh = pv.read("input.mesh")
remeshed = mesh.mmg.remesh(hmax=0.1)

quality = remeshed.cell_quality("scaled_jacobian")
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
import pyvista as pv
import mmgpy  # noqa: F401

mesh = pv.read("input.mesh")
remeshed = mesh.mmg.remesh(hmax=0.5, verbose=-1)

pl = pv.Plotter()
actor = pl.add_mesh(remeshed, show_edges=True)
pl.show(interactive_update=True, auto_close=False)

for hmax in [0.5, 0.3, 0.2, 0.15, 0.1]:
    remeshed = mesh.mmg.remesh(hmax=hmax, verbose=-1)
    actor.mapper.SetInputData(remeshed)
    pl.update()

pl.close()
```

## Working with Mesh Data

### Per-Vertex Scalar Fields

User-defined `point_data` survives on the dataset; `transfer_fields=True` interpolates non-MMG scalars onto the remeshed dataset:

```python
import numpy as np
import pyvista as pv
import mmgpy  # noqa: F401

mesh = pv.read("input.mesh")

vertices = np.asarray(mesh.points)
mesh.point_data["temperature"] = np.sin(vertices[:, 0] * 2 * np.pi)

remeshed = mesh.mmg.remesh(hmax=0.1, transfer_fields=True)
remeshed.plot(scalars="temperature", show_edges=True, cmap="coolwarm")
```

### From PyVista Primitives with Data

```python
import pyvista as pv
import mmgpy  # noqa: F401

sphere = pv.Sphere()
sphere.point_data["elevation"] = sphere.points[:, 2]

remeshed = sphere.mmg.remesh(hsiz=0.1, transfer_fields=True)
elevation = remeshed.point_data["elevation"]
print(f"Elevation range: {elevation.min():.2f} to {elevation.max():.2f}")
```

## Interactive Workflows

### Interactive Refinement

<!-- pytest.mark.skip -->

```python
import pyvista as pv
import mmgpy  # noqa: F401
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

<!-- pytest.mark.skip -->

```python
import pyvista as pv
import mmgpy  # noqa: F401

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
import pyvista as pv
import mmgpy  # noqa: F401

torus = pv.ParametricTorus(ringradius=1.0, crosssectionradius=0.3)
print(f"Original: {torus.n_faces} triangles")

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

1. **Memory**: Large meshes may use significant memory. Consider streaming through files for very large meshes.
2. **Cell types**: PyVista supports many cell types, but mmgpy requires triangles (surface/2D) or tetrahedra (3D). Use `triangulate()` if needed.
3. **Coordinates**: PyVista uses 0-indexed arrays throughout. MMG-specific accessor methods (`adjacent_elements`, `vertex_neighbors`) use 1-based indexing for parity with the underlying library.
4. **Performance**: For real-time visualization, use `interactive_update=True` and batch updates.

## The `.mmg` Dataset Accessor

When mmgpy is installed, every PyVista `UnstructuredGrid` and `PolyData` instance gains a `.mmg` accessor exposing MMG operations directly. The accessor takes and returns PyVista datasets.

### Remeshing variants

<!-- pytest.mark.skip -->

```python
import pyvista as pv
import mmgpy  # noqa: F401

mesh = pv.read("brain.mesh")

# Standard adaptive remeshing
remeshed = mesh.mmg.remesh(hsiz=0.1)

# Quality optimization without topology changes
optimized = mesh.mmg.remesh_optimize()

# Uniform target edge size
uniform = mesh.mmg.remesh_uniform(0.05)

# Lagrangian (moving-mesh) — supports TET, 2D, and surface meshes
moved = mesh.mmg.move(displacement, hmax=0.1)

# Level-set discretization — extracts the zero isosurface as a boundary
carved = mesh.mmg.remesh_levelset(levelset)
```

### Local sizing constraints

Pass a `local_sizing` keyword to any remesh variant. Each constraint is a dict whose `"shape"` selects the geometry:

<!-- pytest.mark.skip -->

```python
constrained = mesh.mmg.remesh(
    nosizreq=True,
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

<!-- pytest.mark.skip -->

```python
mesh.point_data["metric"] = my_metric
mesh.mmg.save_sol("out.sol")

other = pv.read("foo.mesh")
other.mmg.load_sol("foo.sol")
```

### Validation and quality

<!-- pytest.mark.skip -->

```python
report = mesh.mmg.validate(detailed=True)  # ValidationReport
print(report.quality.mean, report.is_valid)

# MMG's in-radius ratio (distinct from PyVista's cell_quality)
qualities = mesh.mmg.element_qualities()
```

### MMG-specific topology and centroid

PyVista exposes 0-based VTK adjacency via `dataset.cell_neighbors(idx)` and `dataset.point_neighbors(idx)`. When you specifically need MMG's 1-based adjacency or its volume/area-weighted centroid (distinct from `dataset.center`, which is the unweighted arithmetic mean), use the accessor:

<!-- pytest.mark.skip -->

```python
mesh.mmg.adjacent_elements(1)   # MMG-adjacent elements of element 1
mesh.mmg.vertex_neighbors(1)    # MMG-adjacent vertices of vertex 1
mesh.mmg.center_of_mass()       # volume-weighted (3D) or area-weighted (2D)
```

### Mesh kind

<!-- pytest.mark.skip -->

```python
print(mesh.mmg.kind)  # MeshKind.TETRAHEDRAL / TRIANGULAR_2D / TRIANGULAR_SURFACE
```

## Next Steps

- [Level-Set Extraction](levelset-extraction.md) - Extract isosurfaces
- [API Reference](../api/index.md) - Detailed API documentation
