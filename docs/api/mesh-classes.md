# Mesh Classes

This page documents the mesh classes provided by mmgpy.

## Unified Mesh Class

The `Mesh` class is the primary public API for mmgpy. It provides a unified interface that auto-detects mesh type based on input data:

::: mmgpy.Mesh
options:
members: - **init** - kind - save - get_vertices - get_triangles - get_tetrahedra - get_edges - get_mesh_size - remesh - remesh_optimize - remesh_uniform - remesh_levelset - remesh_lagrangian - validate - to_pyvista - set_size_sphere - set_size_box - set_size_cylinder - set_size_from_point - clear_local_sizing - get_local_sizing_count

## Mesh Kind Enumeration

::: mmgpy.MeshKind
options:
show_root_heading: true

## Usage Examples

### Creating Meshes

```python
import mmgpy
import numpy as np

# From file
mesh = mmgpy.Mesh("input.mesh")

# From arrays - 3D tetrahedral mesh
vertices = np.array([
    [0, 0, 0],
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
], dtype=np.float64)

tetrahedra = np.array([[0, 1, 2, 3]], dtype=np.int32)

mesh = mmgpy.Mesh(vertices, tetrahedra)

# From arrays - 2D triangular mesh
vertices_2d = np.array([
    [0, 0],
    [1, 0],
    [0.5, 1],
], dtype=np.float64)

triangles = np.array([[0, 1, 2]], dtype=np.int32)

mesh_2d = mmgpy.Mesh(vertices_2d, triangles)

# From PyVista
import pyvista as pv
grid = pv.read("mesh.vtk")
mesh = mmgpy.Mesh(grid)
```

### Checking Mesh Type

```python
from mmgpy import MeshKind

mesh = mmgpy.Mesh(vertices, elements)

if mesh.kind == MeshKind.TETRAHEDRAL:
    print("3D volume mesh")
elif mesh.kind == MeshKind.TRIANGULAR_2D:
    print("2D planar mesh")
elif mesh.kind == MeshKind.TRIANGULAR_SURFACE:
    print("3D surface mesh")
```

### Accessing Mesh Data

```python
# Get vertices and elements
vertices = mesh.get_vertices()      # Shape: (n_vertices, 2 or 3)
triangles = mesh.get_triangles()    # Shape: (n_triangles, 3)
tetrahedra = mesh.get_tetrahedra()  # Shape: (n_tetrahedra, 4) - 3D only

# Get mesh statistics
size = mesh.get_mesh_size()
print(f"Vertices: {size['vertices']}")
```

### Working with Fields

```python
import numpy as np

# Set a scalar field (metric for sizing)
metric = np.ones(len(mesh.get_vertices()), dtype=np.float64) * 0.1
mesh["metric"] = metric

# Get a field
m = mesh["metric"]
```

### Remeshing

```python
from mmgpy import Mmg3DOptions

# With options object
opts = Mmg3DOptions(hmax=0.1, hausd=0.001)
result = mesh.remesh(opts)

# With keyword arguments
result = mesh.remesh(hmax=0.1, hausd=0.001)

# Convenience methods
result = mesh.remesh_optimize()        # Quality only
result = mesh.remesh_uniform(size=0.1) # Uniform size

# Check results
print(f"Vertices: {result.vertices_before} -> {result.vertices_after}")
print(f"Quality: {result.quality_mean_before:.3f} -> {result.quality_mean_after:.3f}")
```

### Local Sizing

```python
# Set local refinement regions
mesh.set_size_sphere(center=[0.5, 0.5, 0.5], radius=0.2, size=0.01)
mesh.set_size_box(bounds=[[0, 0, 0], [0.3, 0.3, 0.3]], size=0.02)

# Remesh with local sizing applied
result = mesh.remesh(hmax=0.1)

# Clear sizing constraints
mesh.clear_local_sizing()
```

### Validation

```python
# Simple validation
if mesh.validate():
    print("Mesh is valid")

# Detailed validation report
report = mesh.validate(detailed=True)
print(f"Valid: {report.is_valid}")
print(f"Quality: min={report.quality.min:.3f}, mean={report.quality.mean:.3f}")

# Strict mode (raises on issues)
mesh.validate(strict=True)
```

### PyVista Integration

```python
import pyvista as pv

# Convert to PyVista
grid = mesh.to_pyvista()

# Quick plot
grid.plot(show_edges=True)

# Or use the vtk property
plotter = pv.Plotter()
plotter.add_mesh(mesh.vtk, show_edges=True)
plotter.show()
```
