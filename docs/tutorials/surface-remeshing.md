# Surface Remeshing

This tutorial covers remeshing 3D surface meshes with mmgpy.

## Loading Surface Meshes

Surface meshes can be loaded from various formats:

```python
import mmgpy

# From STL (common CAD export format)
mesh = mmgpy.read("model.stl")

# From OBJ
mesh = mmgpy.read("model.obj")

# From MMG native format
mesh = mmgpy.Mesh("surface.mesh")
```

## Basic Surface Remeshing

Remesh a surface with target edge lengths:

```python
import mmgpy

mesh = mmgpy.read("surface.stl")

result = mesh.remesh(
    hmin=0.01,    # Minimum edge length
    hmax=0.1,     # Maximum edge length
    verbose=1,
)

print(f"Triangles: {result.triangles_before} -> {result.triangles_after}")
```

## Geometric Fidelity

The `hausd` parameter is crucial for surface meshes - it controls how closely the remeshed surface approximates the original:

```python
# Tight approximation (more triangles, better geometry)
result = mesh.remesh(hmax=0.1, hausd=0.0001)

# Looser approximation (fewer triangles)
result = mesh.remesh(hmax=0.1, hausd=0.01)
```

!!! warning "Hausdorff Distance"
Setting `hausd` too large can cause loss of geometric features. Start with small values (0.001) and increase if needed.

## Sharp Feature Detection

MMG can detect and preserve sharp edges based on the angle between adjacent faces:

```python
result = mesh.remesh(
    hmax=0.1,
    hausd=0.001,
    angle=45.0,  # Edges sharper than 45° are preserved as ridges
)
```

## Preserving Boundaries

To keep boundary edges fixed during remeshing:

```python
result = mesh.remesh(
    hmax=0.1,
    nosurf=1,  # Preserve surface points
)
```

## Smooth Surface Remeshing

For smooth surfaces without sharp features:

```python
from mmgpy import MmgSOptions

opts = MmgSOptions(
    hmax=0.1,
    hausd=0.0001,  # Tight approximation
    hgrad=1.1,     # Gentle size gradation
    angle=180.0,   # No ridge detection
)

result = mesh.remesh(opts)
```

## Mechanical Part Remeshing

For industrial/CAD parts with sharp edges:

```python
from mmgpy import MmgSOptions

opts = MmgSOptions(
    hmax=0.1,
    hausd=0.001,
    hgrad=1.3,
    angle=30.0,    # Detect sharp edges
)

result = mesh.remesh(opts)
```

## Converting from PyVista

Create surface meshes from PyVista geometry:

```python
import mmgpy
import pyvista as pv

# Create a PyVista surface
sphere = pv.Sphere(radius=1.0, theta_resolution=20, phi_resolution=20)

# Convert to mmgpy surface mesh
mesh = mmgpy.from_pyvista(sphere, mesh_type="surface")

# Remesh
mesh.remesh(hmax=0.1)

# Visualize
mesh.to_pyvista().plot(show_edges=True)
```

## Visualization

Visualize before and after:

```python
import mmgpy
import pyvista as pv

# Load and convert to PyVista
mesh = mmgpy.read("surface.stl")
before = mesh.to_pyvista()

# Remesh
mesh.remesh(hmax=0.1, hausd=0.001)
after = mesh.to_pyvista()

# Side-by-side comparison
pl = pv.Plotter(shape=(1, 2))

pl.subplot(0, 0)
pl.add_mesh(before, show_edges=True)
pl.add_text("Before", font_size=12)

pl.subplot(0, 1)
pl.add_mesh(after, show_edges=True)
pl.add_text("After", font_size=12)

pl.link_views()
pl.show()
```

## Complete Example

```python
import mmgpy
from mmgpy import MmgSOptions

# Load a mechanical part
mesh = mmgpy.read("mechanical_part.stl")

# Check initial state
report = mesh.validate(detailed=True)
print(f"Initial: {report.n_triangles} triangles, quality={report.quality.mean:.3f}")

# Configure remeshing
opts = MmgSOptions(
    hmin=0.005,
    hmax=0.05,
    hausd=0.0005,
    hgrad=1.2,
    angle=30.0,
    verbose=1,
)

# Remesh
result = mesh.remesh(opts)

print(f"\nRemeshed in {result.duration_seconds:.2f}s")
print(f"Triangles: {result.triangles_before} -> {result.triangles_after}")
print(f"Quality: {result.quality_mean_before:.3f} -> {result.quality_mean_after:.3f}")

# Save result
mesh.save("output_surface.vtk")
```

## Tips for Surface Remeshing

1. **Start conservative**: Use small `hausd` values first to preserve geometry
2. **Check quality**: Use `mesh.validate(detailed=True)` to inspect results
3. **Ridge preservation**: Lower `angle` values preserve more sharp edges
4. **Gradation**: Use `hgrad` close to 1.0 for smoother size transitions
5. **Visualization**: Always visualize results with PyVista to verify

## Next Steps

- [Adaptive Sizing](adaptive-sizing.md) - Local refinement regions
- [Level-Set Extraction](levelset-extraction.md) - Extract surfaces from volumes
