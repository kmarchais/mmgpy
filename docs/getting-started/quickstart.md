# Quick Start

Get started with mmgpy in 5 minutes.

## Your First Remesh

The simplest way to use mmgpy is to load a mesh, remesh it, and save the result:

```python
import pyvista as pv
import mmgpy  # noqa: F401  -- registers the .mmg accessor + Medit reader/writer

# Load a mesh from any supported format
mesh = pv.read("input.mesh")

# Remesh with a target edge size
remeshed = mesh.mmg.remesh(hmax=0.1)

print(f"Vertices: {mesh.n_points} -> {remeshed.n_points}")
print(f"Cells:    {mesh.n_cells} -> {remeshed.n_cells}")

# Save to any supported format
remeshed.save("output.vtk")
```

## Using Options Objects

For more control, use typed options objects with IDE autocomplete:

=== "3D Mesh"

    ```python
    import pyvista as pv
    from mmgpy import Mmg3DOptions

    mesh = pv.read("volume.mesh")

    opts = Mmg3DOptions(
        hmin=0.01,       # Minimum edge size
        hmax=0.1,        # Maximum edge size
        hausd=0.001,     # Geometric approximation tolerance
        verbose=1,       # Show progress
    )

    remeshed = mesh.mmg.remesh(opts)
    ```

=== "2D Mesh"

    ```python
    import pyvista as pv
    from mmgpy import Mmg2DOptions

    mesh = pv.read("planar.mesh")

    opts = Mmg2DOptions(
        hmin=0.01,
        hmax=0.1,
        verbose=1,
    )

    remeshed = mesh.mmg.remesh(opts)
    ```

=== "Surface Mesh"

    ```python
    import pyvista as pv
    from mmgpy import MmgSOptions

    mesh = pv.read("surface.stl")

    opts = MmgSOptions(
        hmin=0.01,
        hmax=0.1,
        hausd=0.001,
        verbose=1,
    )

    remeshed = mesh.mmg.remesh(opts)
    ```

## Factory Presets

Options classes provide convenient factory methods for common use cases:

```python
from mmgpy import Mmg3DOptions

# Fine mesh (small elements)
fine_opts = Mmg3DOptions.fine(hmax=0.01)

# Coarse mesh (large elements)
coarse_opts = Mmg3DOptions.coarse(hmax=1.0)

# Optimization only (no topology changes)
opt_opts = Mmg3DOptions.optimize_only()
```

## Local Sizing Control

Refine the mesh in specific regions:

```python
import pyvista as pv
import mmgpy  # noqa: F401

mesh = pv.read("input.mesh")

remeshed = mesh.mmg.remesh(
    hmax=0.1,
    verbose=-1,
    local_sizing=[
        {
            "shape": "sphere",
            "center": (0.5, 0.5, 0.5),
            "radius": 0.2,
            "size": 0.01,
        },
        {
            "shape": "box",
            "bounds": [[0, 0, 0], [0.3, 0.3, 0.3]],
            "size": 0.02,
        },
    ],
)
```

## PyVista Visualization

Visualize meshes with PyVista's `plot()` method:

```python
import pyvista as pv
import mmgpy  # noqa: F401

# Load and remesh
mesh = pv.read("input.mesh")
remeshed = mesh.mmg.remesh(hmax=0.1)

# Quick visualization with edges
remeshed.plot(show_edges=True)

# Or customize with PyVista options
remeshed.plot(color="lightblue", opacity=0.8)
```

For custom plotters, use the dataset directly:

<!-- pytest-codeblocks:cont -->

```python
plotter = pv.Plotter()
plotter.add_mesh(remeshed, show_edges=True)
plotter.show()
```

Remesh from PyVista geometry:

```python
import pyvista as pv
import mmgpy  # noqa: F401

# Create a PyVista mesh
sphere = pv.Sphere(radius=1.0)

# Remesh and visualize directly via the accessor
remeshed = sphere.mmg.remesh(hmax=0.1)
remeshed.plot(show_edges=True)
```

## Mesh Validation

Check mesh quality before and after remeshing:

```python
import pyvista as pv
import mmgpy  # noqa: F401

mesh = pv.read("input.mesh")

# Quick validation (returns bool)
if mesh.mmg.validate():
    print("Mesh is valid")
else:
    print("Mesh has issues")

# Detailed validation report
report = mesh.mmg.validate(detailed=True)
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
