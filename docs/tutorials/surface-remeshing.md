# Surface Remeshing

This tutorial covers remeshing 3D surface meshes with mmgpy.

## Loading Surface Meshes

Surface meshes can be loaded from various formats via PyVista:

```python
import pyvista as pv
import mmgpy  # noqa: F401  -- registers reader/writer + accessor

# From STL (common CAD export format)
mesh = pv.read("model.stl")

# From OBJ
mesh = pv.read("model.obj")

# From MMG native format (mmgpy registers a Medit reader)
mesh = pv.read("surface.mesh")
```

## Basic Surface Remeshing

Remesh a surface with target edge lengths:

```python
import pyvista as pv
import mmgpy  # noqa: F401

mesh = pv.read("surface.stl")

remeshed = mesh.mmg.remesh(
    hmin=0.01,
    hmax=0.1,
    verbose=1,
)

print(f"Triangles: {mesh.n_cells} -> {remeshed.n_cells}")
```

## Geometric Fidelity

The `hausd` parameter is crucial for surface meshes - it controls how closely the remeshed surface approximates the original:

<!-- pytest-codeblocks:cont -->

```python
# Tight approximation (more triangles, better geometry)
tight = mesh.mmg.remesh(hmax=0.1, hausd=0.0001)

# Looser approximation (fewer triangles)
loose = mesh.mmg.remesh(hmax=0.1, hausd=0.01)
```

!!! warning "Hausdorff Distance"
Setting `hausd` too large can cause loss of geometric features. Start with small values (0.001) and increase if needed.

## Sharp Feature Detection

MMG can detect and preserve sharp edges based on the angle between adjacent faces:

<!-- pytest-codeblocks:cont -->

```python
remeshed = mesh.mmg.remesh(
    hmax=0.1,
    hausd=0.001,
    ar=45,  # Edges sharper than 45° are preserved as ridges
)
```

## Preserving Boundaries

To prevent vertex movement during remeshing (vertices stay in place, but edges may still be swapped or split):

<!-- pytest-codeblocks:cont -->

```python
remeshed = mesh.mmg.remesh(
    hmax=0.1,
    nomove=1,
)
```

## Smooth Surface Remeshing

For smooth surfaces without sharp features:

<!-- pytest-codeblocks:cont -->

```python
from mmgpy import MmgSOptions

opts = MmgSOptions(
    hmax=0.1,
    hausd=0.0001,  # Tight approximation
    hgrad=1.1,     # Gentle size gradation
    ar=180,        # No ridge detection
)

remeshed = mesh.mmg.remesh(opts)
```

## Mechanical Part Remeshing

For industrial/CAD parts with sharp edges:

<!-- pytest-codeblocks:cont -->

```python
from mmgpy import MmgSOptions

opts = MmgSOptions(
    hmax=0.1,
    hausd=0.001,
    hgrad=1.3,
    ar=30,
)

remeshed = mesh.mmg.remesh(opts)
```

## From PyVista Primitives

The accessor works on any PyVista geometry without an intermediate wrapper:

```python
import pyvista as pv
import mmgpy  # noqa: F401

sphere = pv.Sphere(radius=1.0, theta_resolution=20, phi_resolution=20)
remeshed = sphere.mmg.remesh(hmax=0.1)
remeshed.plot(show_edges=True)
```

## Visualization

Visualize before and after:

```python
import pyvista as pv
import mmgpy  # noqa: F401

mesh = pv.read("surface.stl")
remeshed = mesh.mmg.remesh(hmax=0.1, hausd=0.001)

pl = pv.Plotter(shape=(1, 2))

pl.subplot(0, 0)
pl.add_mesh(mesh, show_edges=True)
pl.add_text("Before", font_size=12)

pl.subplot(0, 1)
pl.add_mesh(remeshed, show_edges=True)
pl.add_text("After", font_size=12)

pl.link_views()
pl.show()
```

## Complete Example

```python
import pyvista as pv
import mmgpy  # noqa: F401
from mmgpy import MmgSOptions

mesh = pv.read("mechanical_part.stl")

# Check initial state
report = mesh.mmg.validate(detailed=True)
print(f"Initial quality: {report.quality.mean:.3f}")

opts = MmgSOptions(
    hmin=0.005,
    hmax=0.05,
    hausd=0.0005,
    hgrad=1.2,
    ar=30,
    verbose=1,
)

remeshed = mesh.mmg.remesh(opts)

q_after = remeshed.mmg.element_qualities()
print(f"Triangles: {mesh.n_cells} -> {remeshed.n_cells}")
print(f"Mean quality (after): {q_after.mean():.3f}")

remeshed.save("output_surface.vtk")
```

## Tips for Surface Remeshing

1. **Start conservative**: Use small `hausd` values first to preserve geometry
2. **Check quality**: Use `dataset.mmg.validate(detailed=True)` to inspect results
3. **Ridge preservation**: Lower `ar` values preserve more sharp edges
4. **Gradation**: Use `hgrad` close to 1.0 for smoother size transitions
5. **Visualization**: Always visualize results with PyVista to verify

## Next Steps

- [Adaptive Sizing](adaptive-sizing.md) - Local refinement regions
- [Level-Set Extraction](levelset-extraction.md) - Extract surfaces from volumes
