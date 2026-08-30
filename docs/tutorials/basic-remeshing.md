# Basic Remeshing

This tutorial covers the fundamentals of mesh remeshing with mmgpy.

mmgpy operates on PyVista datasets through the `.mmg` accessor. Importing `mmgpy` registers a Medit reader/writer for `.mesh`/`.meshb` files plus a `.mmg` accessor on every `pv.UnstructuredGrid` and `pv.PolyData`.

## Loading a Mesh

PyVista handles 40+ file formats out of the box. mmgpy adds Medit `.mesh`/`.meshb`:

```python
import pyvista as pv
import mmgpy  # noqa: F401  -- registers reader/writer + accessor

# Same call works for tetrahedral, planar, and surface inputs
mesh_3d = pv.read("volume.mesh")
mesh_2d = pv.read("planar.mesh")
mesh_s = pv.read("surface.stl")
```

The accessor auto-detects the kind from cell types and coordinate dimensions; access via `dataset.mmg.kind`.

## Simple Remeshing

The simplest remeshing operation specifies only the maximum edge length:

```python
import pyvista as pv
import mmgpy  # noqa: F401

mesh = pv.read("input.mesh")

# Remesh with maximum edge length of 0.1
remeshed = mesh.mmg.remesh(hmax=0.1)

print(f"Vertices: {mesh.n_points} -> {remeshed.n_points}")
print(f"Cells:    {mesh.n_cells} -> {remeshed.n_cells}")
```

## Inspecting the Result

`dataset.mmg.remesh(...)` returns a fresh PyVista dataset. Stats come from the dataset itself plus the accessor's quality helpers:

```python
qualities_before = mesh.mmg.element_qualities()
qualities_after = remeshed.mmg.element_qualities()

print(f"Vertices: {mesh.n_points} -> {remeshed.n_points}")
print(f"Cells:    {mesh.n_cells} -> {remeshed.n_cells}")
print(f"Min quality:  {qualities_before.min():.3f} -> {qualities_after.min():.3f}")
print(f"Mean quality: {qualities_before.mean():.3f} -> {qualities_after.mean():.3f}")
```

## Edge Length Control

Control the range of edge lengths in the output mesh:

```python
remeshed = mesh.mmg.remesh(
    hmin=0.01,  # Minimum edge length (prevents over-refinement)
    hmax=0.1,   # Maximum edge length
)
```

For a uniform mesh with a single target size:

```python
# Using hsiz parameter
mesh = pv.read("input.mesh")
uniform = mesh.mmg.remesh(hsiz=0.05)

# Or using the convenience method
mesh = pv.read("input.mesh")
uniform = mesh.mmg.remesh_uniform(size=0.05)
```

## Geometric Approximation

The `hausd` parameter controls how closely the output mesh approximates the input geometry:

```python
remeshed = mesh.mmg.remesh(
    hmax=0.1,
    hausd=0.001,  # Maximum Hausdorff distance to input surface
)
```

!!! tip "Choosing hausd" - Smaller `hausd` = better surface approximation but more elements - Typical values: 0.001 to 0.01 of the model size - For smooth surfaces, use smaller values

## Using Options Objects

For complex configurations, use typed options objects:

```python
from mmgpy import Mmg3DOptions

opts = Mmg3DOptions(
    hmin=0.01,
    hmax=0.1,
    hausd=0.001,
    hgrad=1.3,      # Gradation: max ratio between adjacent edges
    ar=45,          # Ridge detection angle (degrees)
    verbose=1,
)

remeshed = mesh.mmg.remesh(opts)
```

Options can also be unpacked as kwargs:

```python
remeshed = mesh.mmg.remesh(**opts.to_dict())
```

## Optimization Without Topology Changes

To improve quality without inserting/removing vertices:

```python
mesh = pv.read("input.mesh")
optimized = mesh.mmg.remesh_optimize()

# Equivalent to
mesh = pv.read("input.mesh")
optimized = mesh.mmg.remesh(optim=1, noinsert=1)
```

This only moves existing vertices to improve element quality.

## Factory Presets

Options classes provide factory methods for common scenarios:

```python
from mmgpy import Mmg3DOptions

mesh = pv.read("input.mesh")
fine_opts = Mmg3DOptions.fine(hmax=0.05)
fine = mesh.mmg.remesh(fine_opts)

mesh = pv.read("input.mesh")
coarse_opts = Mmg3DOptions.coarse(hmax=1.0)
coarse = mesh.mmg.remesh(coarse_opts)

mesh = pv.read("input.mesh")
opt_opts = Mmg3DOptions.optimize_only()
optimized = mesh.mmg.remesh(opt_opts)
```

## Saving Results

Save the remeshed output to any supported format:

```python
# Save to MMG native format
remeshed.save("output.mesh")

# Save to VTK for ParaView
remeshed.save("output.vtk")
```

## Complete Example

```python
import pyvista as pv
import mmgpy  # noqa: F401
from mmgpy import Mmg3DOptions

mesh = pv.read("input.mesh")

# Check initial quality
report = mesh.mmg.validate(detailed=True)
print(f"Initial quality: {report.quality.mean:.3f}")

opts = Mmg3DOptions(
    hmin=0.01,
    hmax=0.1,
    hausd=0.001,
    verbose=1,
)

remeshed = mesh.mmg.remesh(opts)

# Report results
print(f"Vertices: {mesh.n_points} -> {remeshed.n_points}")
qualities_after = remeshed.mmg.element_qualities()
print(f"Mean quality (after): {qualities_after.mean():.3f}")

# Validate final mesh
assert remeshed.mmg.validate(), "Mesh validation failed"

# Save result
remeshed.save("output.vtk")
```

## Next Steps

- [Surface Remeshing](surface-remeshing.md) - Working with surface meshes
- [Adaptive Sizing](adaptive-sizing.md) - Local mesh refinement
- [PyVista Integration](pyvista-integration.md) - Visualization workflows
