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
import mmgpy
import numpy as np

# Load or create a background mesh
mesh = mmgpy.Mesh("background.mesh")

# Get vertex coordinates
vertices = mesh.get_vertices()

# Define level-set: signed distance to a sphere
center = np.array([0.5, 0.5, 0.5])
radius = 0.3
levelset = np.linalg.norm(vertices - center, axis=1) - radius

# Remesh with level-set discretization
result = mesh.remesh_levelset(levelset)

print(f"Extracted surface with {result.triangles_after} triangles")
```

## Creating Background Meshes

The background mesh should encompass the region where the level-set is defined:

```python
import mmgpy
import numpy as np

# Create a simple cubic mesh
# (In practice, load from file or create with another tool)

# For a unit cube background
n = 10  # Resolution per edge
x = np.linspace(0, 1, n)
y = np.linspace(0, 1, n)
z = np.linspace(0, 1, n)

# Create tetrahedral mesh from grid
# (Simplified - real implementation would need proper tetrahedralization)
mesh = mmgpy.Mesh("unit_cube.mesh")
```

## Implicit Function Examples

### Sphere

```python
def sphere_levelset(coords, center=(0.5, 0.5, 0.5), radius=0.3):
    return np.linalg.norm(coords - np.array(center), axis=1) - radius

levelset = sphere_levelset(mesh.get_vertices())
```

### Torus

```python
def torus_levelset(coords, R=0.5, r=0.15):
    x, y, z = coords[:, 0], coords[:, 1], coords[:, 2]
    # Translate to center at (0.5, 0.5, 0.5)
    x, y, z = x - 0.5, y - 0.5, z - 0.5
    q = np.sqrt(x**2 + y**2) - R
    return np.sqrt(q**2 + z**2) - r

levelset = torus_levelset(mesh.get_vertices())
```

### Gyroid

```python
def gyroid_levelset(coords, scale=2*np.pi):
    x = coords[:, 0] * scale
    y = coords[:, 1] * scale
    z = coords[:, 2] * scale
    return np.sin(x)*np.cos(y) + np.sin(y)*np.cos(z) + np.sin(z)*np.cos(x)

levelset = gyroid_levelset(mesh.get_vertices())
```

### Boolean Operations

Combine shapes using min/max operations:

```python
# Union: min of level-sets
def union(ls1, ls2):
    return np.minimum(ls1, ls2)

# Intersection: max of level-sets
def intersection(ls1, ls2):
    return np.maximum(ls1, ls2)

# Subtraction: max of ls1 and negated ls2
def subtract(ls1, ls2):
    return np.maximum(ls1, -ls2)

# Example: sphere with cylindrical hole
sphere = sphere_levelset(vertices, center=(0.5, 0.5, 0.5), radius=0.4)
cylinder = cylinder_levelset(vertices)  # Define appropriately

result_ls = subtract(sphere, cylinder)
```

## 2D Level-Set Remeshing

Level-set extraction also works with 2D meshes:

```python
import mmgpy
import numpy as np

mesh = mmgpy.Mesh("background_2d.mesh")
vertices = mesh.get_vertices()

# Circle level-set
center = np.array([0.5, 0.5])
radius = 0.3
levelset = np.linalg.norm(vertices[:, :2] - center, axis=1) - radius

result = mesh.remesh_levelset(levelset)
```

## Surface Level-Set Remeshing

For surface meshes, level-set can extract curves:

```python
import mmgpy
import numpy as np

mesh = mmgpy.Mesh("surface.mesh")
vertices = mesh.get_vertices()

# Level-set based on z-coordinate (extracts z=0 curve)
levelset = vertices[:, 2]

result = mesh.remesh_levelset(levelset)
```

## Controlling Output Quality

Combine level-set extraction with size parameters:

```python
result = mesh.remesh_levelset(
    levelset,
    hmin=0.005,
    hmax=0.05,
    hausd=0.0001,  # Tight approximation
    verbose=1,
)
```

## Complete Example: Implicit Domain Meshing

```python
import mmgpy
import numpy as np

# Load background mesh
mesh = mmgpy.Mesh("domain.mesh")
vertices = mesh.get_vertices()

# Define a complex implicit function: two intersecting spheres
def double_sphere(coords):
    center1 = np.array([0.35, 0.5, 0.5])
    center2 = np.array([0.65, 0.5, 0.5])
    radius = 0.25

    d1 = np.linalg.norm(coords - center1, axis=1) - radius
    d2 = np.linalg.norm(coords - center2, axis=1) - radius

    return np.minimum(d1, d2)  # Union

levelset = double_sphere(vertices)

# Extract the isosurface
result = mesh.remesh_levelset(
    levelset,
    hmax=0.03,
    hausd=0.001,
    verbose=1,
)

print(f"Extracted {result.triangles_after} triangles")
print(f"Quality: {result.quality_mean_after:.3f}")

# Save result
mesh.save("double_sphere.vtk")
```

## Visualization

```python
import pyvista as pv

# Visualize the extracted surface
pv_mesh = mesh.to_pyvista()
pv_mesh.plot(show_edges=True)
```

## Tips

1. **Background mesh quality**: Use a sufficiently fine background mesh for accurate level-set discretization

2. **Signed distance**: For best results, use signed distance functions (negative inside, positive outside)

3. **Narrow band**: If your level-set is only valid near the surface, ensure the background mesh is refined in that region

4. **Validation**: After extraction, validate the mesh to ensure quality:

   ```python
   assert mesh.validate(), "Extracted mesh has quality issues"
   ```

5. **Multiple materials**: For multi-material interfaces, use multiple level-set operations

## Next Steps

- [Metrics](../api/metrics.md) - Anisotropic metric fields
- [Lagrangian Motion](../api/lagrangian.md) - Moving mesh remeshing
