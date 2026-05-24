# Level-Set Extraction

This tutorial covers extracting and remeshing isosurfaces using level-set functions.

## Overview

Level-set remeshing extracts an isosurface from a scalar field defined on a mesh. This is useful for:

- Extracting surfaces from signed distance functions
- Generating meshes from implicit functions
- Multi-material interface meshing
- Shape optimization

## Basic Level-Set Remeshing

Define a level-set function and extract the zero isosurface:

```python
import numpy as np
import pyvista as pv
import mmgpy  # noqa: F401  -- registers reader/writer + accessor

# Load or create a background mesh
mesh = pv.read("background.mesh")

# Get vertex coordinates
vertices = np.asarray(mesh.points)

# Define level-set: signed distance to a sphere
center = np.array([0.5, 0.5, 0.5])
radius = 0.3
levelset = (np.linalg.norm(vertices - center, axis=1) - radius).reshape(-1, 1)

# Remesh with level-set discretization
discretized = mesh.mmg.remesh_levelset(levelset)

print(f"Extracted dataset has {discretized.n_cells} cells")
```

## Creating Background Meshes

The background mesh should encompass the region where the level-set is defined:

```python
import numpy as np
import pyvista as pv
import mmgpy  # noqa: F401

# In practice, load from file or build with another tool. PyVista has
# helpers like delaunay_3d, voxelize, etc. for quick prototyping.
mesh = pv.read("unit_cube.mesh")
```

## Implicit Function Examples

### Sphere

```python
def sphere_levelset(coords, center=(0.5, 0.5, 0.5), radius=0.3):
    return (np.linalg.norm(coords - np.array(center), axis=1) - radius).reshape(-1, 1)


levelset = sphere_levelset(np.asarray(mesh.points))
```

### Torus

```python
def torus_levelset(coords, R=0.5, r=0.15):
    x, y, z = coords[:, 0], coords[:, 1], coords[:, 2]
    x, y, z = x - 0.5, y - 0.5, z - 0.5
    q = np.sqrt(x**2 + y**2) - R
    return (np.sqrt(q**2 + z**2) - r).reshape(-1, 1)


levelset = torus_levelset(np.asarray(mesh.points))
```

### Gyroid

```python
def gyroid_levelset(coords, scale=2 * np.pi):
    x = coords[:, 0] * scale
    y = coords[:, 1] * scale
    z = coords[:, 2] * scale
    return (
        np.sin(x) * np.cos(y) + np.sin(y) * np.cos(z) + np.sin(z) * np.cos(x)
    ).reshape(-1, 1)


levelset = gyroid_levelset(np.asarray(mesh.points))
```

### Boolean Operations

Combine shapes using min/max operations:

<!-- mmgpy-test:skip -->

```python
def union(ls1, ls2):
    return np.minimum(ls1, ls2)


def intersection(ls1, ls2):
    return np.maximum(ls1, ls2)


def subtract(ls1, ls2):
    return np.maximum(ls1, -ls2)


sphere = sphere_levelset(vertices, center=(0.5, 0.5, 0.5), radius=0.4)
cylinder = cylinder_levelset(vertices)  # Define appropriately
result_ls = subtract(sphere, cylinder)
```

## 2D Level-Set Remeshing

Level-set extraction also works with 2D meshes:

```python
import numpy as np
import pyvista as pv
import mmgpy  # noqa: F401

mesh = pv.read("background_2d.mesh")
vertices = np.asarray(mesh.points)

# Circle level-set (uses x,y; z is 0 for the planar embedding)
center = np.array([0.5, 0.5])
radius = 0.3
levelset = (np.linalg.norm(vertices[:, :2] - center, axis=1) - radius).reshape(-1, 1)

discretized = mesh.mmg.remesh_levelset(levelset)
```

## Surface Level-Set Remeshing

For surface meshes, level-set can extract curves:

```python
import numpy as np
import pyvista as pv
import mmgpy  # noqa: F401

mesh = pv.read("surface.mesh")
vertices = np.asarray(mesh.points)

# Level-set based on z-coordinate (extracts z=0 curve)
levelset = vertices[:, 2].reshape(-1, 1)

discretized = mesh.mmg.remesh_levelset(levelset)
```

## Controlling Output Quality

Combine level-set extraction with size parameters:

<!-- mmgpy-test:skip -->

```python
discretized = mesh.mmg.remesh_levelset(
    levelset,
    hmin=0.005,
    hmax=0.05,
    hausd=0.0001,
    verbose=1,
)
```

## Complete Example: Implicit Domain Meshing

<!-- mmgpy-test:skip -->

```python
import numpy as np
import pyvista as pv
import mmgpy  # noqa: F401

mesh = pv.read("domain.mesh")
vertices = np.asarray(mesh.points)


def double_sphere(coords):
    center1 = np.array([0.35, 0.5, 0.5])
    center2 = np.array([0.65, 0.5, 0.5])
    radius = 0.25
    d1 = np.linalg.norm(coords - center1, axis=1) - radius
    d2 = np.linalg.norm(coords - center2, axis=1) - radius
    return np.minimum(d1, d2)


levelset = double_sphere(vertices).reshape(-1, 1)

discretized = mesh.mmg.remesh_levelset(
    levelset,
    hmax=0.03,
    hausd=0.001,
    verbose=1,
)

q = discretized.mmg.element_qualities()
print(f"Cells: {discretized.n_cells}, mean quality: {q.mean():.3f}")
discretized.save("double_sphere.vtk")
```

## Visualization

```python
discretized.plot(show_edges=True)
```

## Tips

1. **Background mesh quality**: Use a sufficiently fine background mesh for accurate level-set discretization
2. **Signed distance**: For best results, use signed distance functions (negative inside, positive outside)
3. **Narrow band**: If your level-set is only valid near the surface, ensure the background mesh is refined in that region
4. **Validation**: After extraction, validate the mesh to ensure quality:

   <!-- mmgpy-test:skip -->

   ```python
   assert discretized.mmg.validate(), "Extracted mesh has quality issues"
   ```

5. **Multiple materials**: For multi-material interfaces, use multiple level-set operations

## Next Steps

- [Metrics](../api/metrics.md) - Anisotropic metric fields
- [Lagrangian Motion](../api/lagrangian.md) - Moving mesh remeshing
