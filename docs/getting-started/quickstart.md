# Quick Start

Get started with mmgpy in 5 minutes.

## Your First Remesh

The simplest way to use mmgpy is to load a mesh, remesh it, and save the result:

```python
import mmgpy

# Load a mesh from any supported format
mesh = mmgpy.read("input.mesh")

# Remesh with a target edge size
result = mesh.remesh(hmax=0.1)

# Check the results
print(f"Vertices: {result.vertices_before} -> {result.vertices_after}")
print(f"Quality: {result.quality_mean_before:.3f} -> {result.quality_mean_after:.3f}")

# Save to any supported format
mesh.save("output.vtk")
```

## Using Options Objects

For more control, use typed options objects with IDE autocomplete:

=== "3D Mesh"

    ```python
    from mmgpy import Mmg3DOptions, read

    mesh = read("volume.mesh")

    opts = Mmg3DOptions(
        hmin=0.01,       # Minimum edge size
        hmax=0.1,        # Maximum edge size
        hausd=0.001,     # Geometric approximation tolerance
        verbose=1,       # Show progress
    )

    result = mesh.remesh(opts)
    ```

=== "2D Mesh"

    ```python
    from mmgpy import Mmg2DOptions, read

    mesh = read("planar.mesh")

    opts = Mmg2DOptions(
        hmin=0.01,
        hmax=0.1,
        verbose=1,
    )

    result = mesh.remesh(opts)
    ```

=== "Surface Mesh"

    ```python
    from mmgpy import MmgSOptions, read

    mesh = read("surface.stl")

    opts = MmgSOptions(
        hmin=0.01,
        hmax=0.1,
        hausd=0.001,
        verbose=1,
    )

    result = mesh.remesh(opts)
    ```

## Factory Presets

Options classes provide convenient factory methods for common use cases:

```python
from mmgpy import Mmg3DOptions

# Fine mesh (small elements)
fine_opts = Mmg3DOptions.fine()

# Coarse mesh (large elements)
coarse_opts = Mmg3DOptions.coarse()

# Optimization only (no topology changes)
opt_opts = Mmg3DOptions.optimize_only()
```

## Local Sizing Control

Refine the mesh in specific regions:

```python
import mmgpy

mesh = mmgpy.read("input.mesh")

# Fine mesh in a spherical region
mesh.set_size_sphere(
    center=[0.5, 0.5, 0.5],
    radius=0.2,
    size=0.01,
)

# Fine mesh in a box region
mesh.set_size_box(
    bounds=[[0, 0, 0], [0.3, 0.3, 0.3]],
    size=0.02,
)

# Remesh with global hmax, local sizing takes precedence
result = mesh.remesh(hmax=0.1, verbose=-1)
```

## PyVista Visualization

Visualize meshes with the built-in `plot()` method:

```python
import mmgpy

# Load and remesh
mesh = mmgpy.read("input.mesh")
mesh.remesh(hmax=0.1)

# Quick visualization with edges
mesh.plot()

# Or customize with PyVista options
mesh.plot(color="lightblue", opacity=0.8)
```

For custom plotters, use the `vtk` property:

```python
import pyvista as pv

plotter = pv.Plotter()
plotter.add_mesh(mesh.vtk, show_edges=True)
plotter.show()
```

Load from PyVista:

```python
import mmgpy
import pyvista as pv

# Create a PyVista mesh
sphere = pv.Sphere(radius=1.0)

# Convert to mmgpy mesh
mesh = mmgpy.from_pyvista(sphere, mesh_type="surface")

# Remesh and visualize
mesh.remesh(hmax=0.1)
mesh.plot()
```

## Mesh Validation

Check mesh quality before and after remeshing:

```python
import mmgpy

mesh = mmgpy.read("input.mesh")

# Quick validation (returns bool)
if mesh.validate():
    print("Mesh is valid")
else:
    print("Mesh has issues")

# Detailed validation report
report = mesh.validate(detailed=True)
print(f"Valid: {report.is_valid}")
print(f"Mean quality: {report.quality.mean:.3f}")
print(f"Min quality: {report.quality.min:.3f}")

for issue in report.issues:
    print(f"  {issue.severity}: {issue.message}")
```

## Next Steps

- [Core Concepts](concepts.md) - Understand mesh types and remeshing strategies
- [Basic Remeshing Tutorial](../tutorials/basic-remeshing.md) - In-depth remeshing guide
- [API Reference](../api/index.md) - Complete API documentation
