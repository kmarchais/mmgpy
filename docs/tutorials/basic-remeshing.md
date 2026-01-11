# Basic Remeshing

This tutorial covers the fundamentals of mesh remeshing with mmgpy.

## Loading a Mesh

mmgpy can load meshes from 40+ file formats:

```python
import mmgpy

# Using the unified read function (recommended)
mesh = mmgpy.read("input.mesh")

# Or use specific mesh classes directly
mesh_3d = mmgpy.Mesh("volume.mesh")
mesh_2d = mmgpy.Mesh("planar.mesh")
mesh_s = mmgpy.Mesh("surface.stl")
```

The `read()` function automatically detects the mesh type and returns the appropriate class wrapped in a unified `Mesh` interface.

## Simple Remeshing

The simplest remeshing operation specifies only the maximum edge length:

```python
import mmgpy

mesh = mmgpy.read("input.mesh")

# Remesh with maximum edge length of 0.1
result = mesh.remesh(hmax=0.1)

print(f"Vertices: {result.vertices_before} -> {result.vertices_after}")
print(f"Elements: {result.elements_before} -> {result.elements_after}")
```

## Understanding RemeshResult

Every remeshing operation returns a `RemeshResult` object with statistics:

```python
result = mesh.remesh(hmax=0.1)

# Vertex counts
print(f"Vertices before: {result.vertices_before}")
print(f"Vertices after: {result.vertices_after}")

# Element counts
print(f"Elements before: {result.elements_before}")
print(f"Elements after: {result.elements_after}")

# Quality metrics
print(f"Min quality before: {result.quality_min_before:.3f}")
print(f"Min quality after: {result.quality_min_after:.3f}")
print(f"Mean quality before: {result.quality_mean_before:.3f}")
print(f"Mean quality after: {result.quality_mean_after:.3f}")

# Timing
print(f"Duration: {result.duration_seconds:.2f} seconds")

# Warnings from MMG
for warning in result.warnings:
    print(f"Warning: {warning}")
```

## Edge Length Control

Control the range of edge lengths in the output mesh:

```python
result = mesh.remesh(
    hmin=0.01,  # Minimum edge length (prevents over-refinement)
    hmax=0.1,   # Maximum edge length
)
```

For a uniform mesh with a single target size:

```python
# Using hsiz parameter
result = mesh.remesh(hsiz=0.05)

# Or using the convenience method
result = mesh.remesh_uniform(size=0.05)
```

## Geometric Approximation

The `hausd` parameter controls how closely the output mesh approximates the input geometry:

```python
result = mesh.remesh(
    hmax=0.1,
    hausd=0.001,  # Maximum Hausdorff distance to input surface
)
```

!!! tip "Choosing hausd" - Smaller `hausd` = better surface approximation but more elements - Typical values: 0.001 to 0.01 of the model size - For smooth surfaces, use smaller values

## Using Options Objects

For complex configurations, use typed options objects:

```python
from mmgpy import Mmg3DOptions

# Create options with all parameters
opts = Mmg3DOptions(
    hmin=0.01,
    hmax=0.1,
    hausd=0.001,
    hgrad=1.3,      # Gradation: max ratio between adjacent edges
    angle=45.0,     # Ridge detection angle (degrees)
    verbose=1,
)

result = mesh.remesh(opts)
```

Options can be unpacked directly into `remesh()`:

```python
result = mesh.remesh(**opts.to_dict())
```

## Optimization Without Topology Changes

To improve quality without inserting/removing vertices:

```python
# Using the convenience method
result = mesh.remesh_optimize()

# Equivalent to
result = mesh.remesh(optim=1, noinsert=1)
```

This only moves existing vertices to improve element quality.

## Factory Presets

Options classes provide factory methods for common scenarios:

```python
from mmgpy import Mmg3DOptions

# Fine mesh preset
fine_opts = Mmg3DOptions.fine()
result = mesh.remesh(fine_opts)

# Coarse mesh preset
coarse_opts = Mmg3DOptions.coarse()
result = mesh.remesh(coarse_opts)

# Optimization-only preset
opt_opts = Mmg3DOptions.optimize_only()
result = mesh.remesh(opt_opts)
```

## Saving Results

Save the remeshed output to any supported format:

```python
# Save to MMG native format
mesh.save("output.mesh")

# Save to VTK for ParaView
mesh.save("output.vtk")

# Save to other formats
mesh.save("output.stl")  # Surface only
mesh.save("output.ply")
```

## Complete Example

```python
import mmgpy
from mmgpy import Mmg3DOptions

# Load mesh
mesh = mmgpy.read("input.mesh")

# Check initial quality
report = mesh.validate(detailed=True)
print(f"Initial quality: {report.quality.mean:.3f}")

# Create options
opts = Mmg3DOptions(
    hmin=0.01,
    hmax=0.1,
    hausd=0.001,
    verbose=1,
)

# Remesh
result = mesh.remesh(opts)

# Report results
print(f"\nRemeshing complete in {result.duration_seconds:.2f}s")
print(f"Vertices: {result.vertices_before} -> {result.vertices_after}")
print(f"Quality: {result.quality_mean_before:.3f} -> {result.quality_mean_after:.3f}")

# Validate final mesh
assert mesh.validate(), "Mesh validation failed"

# Save result
mesh.save("output.vtk")
```

## Next Steps

- [Surface Remeshing](surface-remeshing.md) - Working with surface meshes
- [Adaptive Sizing](adaptive-sizing.md) - Local mesh refinement
- [PyVista Integration](pyvista-integration.md) - Visualization workflows
