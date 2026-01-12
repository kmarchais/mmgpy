# Lagrangian Motion

This page documents the Lagrangian mesh motion functions in the `mmgpy.lagrangian` module.

## Overview

Lagrangian remeshing handles moving meshes by:

1. Applying a displacement field to the mesh
2. Remeshing to maintain quality
3. Preserving boundary conditions

This is useful for:

- Moving mesh simulations
- Shape optimization
- Fluid-structure interaction
- Morphing between shapes

## Functions

::: mmgpy.move_mesh
options:
show_root_heading: true

::: mmgpy.propagate_displacement
options:
show_root_heading: true

::: mmgpy.detect_boundary_vertices
options:
show_root_heading: true

::: mmgpy.remesh_lagrangian_surface
options:
show_root_heading: true

## Mesh Method

Meshes have a `remesh_lagrangian()` method for direct use:

```python
import mmgpy
import numpy as np

mesh = mmgpy.Mesh("input.mesh")

# Define displacement field (3D vector at each vertex)
n_vertices = mesh.get_mesh_size()["vertices"]
displacement = np.zeros((n_vertices, 3))
displacement[:, 0] = 0.1  # Move all vertices 0.1 in x

# Remesh with displacement
result = mesh.remesh_lagrangian(displacement)
```

## Usage Examples

### Basic Lagrangian Remeshing

```python
import mmgpy
import numpy as np

mesh = mmgpy.read("input.mesh")
vertices = mesh.get_vertices()
n_vertices = len(vertices)

# Create displacement: radial expansion
center = vertices.mean(axis=0)
directions = vertices - center
distances = np.linalg.norm(directions, axis=1, keepdims=True)
directions = directions / (distances + 1e-10)

# 10% radial expansion
displacement = directions * 0.1 * distances

# Apply and remesh
result = mesh.remesh_lagrangian(displacement)

print(f"Quality: {result.quality_mean_after:.3f}")
```

### Boundary-Only Displacement

Move only boundary vertices:

```python
from mmgpy import detect_boundary_vertices

mesh = mmgpy.read("input.mesh")
vertices = mesh.get_vertices()

# Find boundary vertices
boundary_mask = detect_boundary_vertices(mesh)

# Create displacement (only boundary moves)
displacement = np.zeros((len(vertices), 3))
displacement[boundary_mask, 2] = 0.05  # Move boundary up in z

# Remesh
result = mesh.remesh_lagrangian(displacement)
```

### Propagate Displacement to Interior

Start with boundary displacement and propagate to interior:

```python
from mmgpy import detect_boundary_vertices, propagate_displacement

mesh = mmgpy.read("input.mesh")
vertices = mesh.get_vertices()

# Boundary displacement
boundary_mask = detect_boundary_vertices(mesh)
boundary_disp = np.zeros((len(vertices), 3))
boundary_disp[boundary_mask, 0] = 0.1

# Propagate to interior (smooth interpolation)
full_disp = propagate_displacement(mesh, boundary_disp, boundary_mask)

# Remesh
result = mesh.remesh_lagrangian(full_disp)
```

### Move Mesh Without Remeshing

Apply displacement without topology changes:

```python
from mmgpy import move_mesh

mesh = mmgpy.read("input.mesh")
vertices = mesh.get_vertices()

# Displacement
displacement = np.zeros_like(vertices)
displacement[:, 1] = 0.05  # Translate in y

# Apply displacement (modifies mesh in-place)
move_mesh(mesh, displacement)

# Now mesh vertices are moved
new_vertices = mesh.get_vertices()
```

### Iterative Motion

For large deformations, use multiple small steps:

```python
import mmgpy
import numpy as np

mesh = mmgpy.read("input.mesh")

# Total displacement
total_disp = compute_total_displacement(mesh)

# Apply in 10 steps
n_steps = 10
for i in range(n_steps):
    step_disp = total_disp / n_steps
    result = mesh.remesh_lagrangian(step_disp, verbose=-1)
    print(f"Step {i+1}: quality={result.quality_mean_after:.3f}")

mesh.save("final.mesh")
```

### With Quality Control

Combine with remeshing parameters:

```python
result = mesh.remesh_lagrangian(
    displacement,
    hmin=0.01,
    hmax=0.1,
    hausd=0.001,
    verbose=1,
)
```

## Complete Example

Deform a sphere into an ellipsoid:

```python
import mmgpy
import numpy as np

# Load sphere mesh
mesh = mmgpy.Mesh("sphere.mesh")
vertices = mesh.get_vertices()

# Compute displacement: stretch in z, compress in x and y
center = vertices.mean(axis=0)
relative = vertices - center

# Scale factors
scale = np.array([0.7, 0.7, 1.5])  # Compress x,y, stretch z

# Displacement to achieve scaling
new_positions = center + relative * scale
displacement = new_positions - vertices

# Apply with Lagrangian remeshing
result = mesh.remesh_lagrangian(
    displacement,
    hmax=0.1,
    verbose=1,
)

print(f"Remeshed ellipsoid:")
print(f"  Vertices: {result.vertices_before} -> {result.vertices_after}")
print(f"  Quality: {result.quality_mean_before:.3f} -> {result.quality_mean_after:.3f}")

# Save result
mesh.save("ellipsoid.vtk")
```

## Surface Mesh Support

Surface meshes (`MmgMeshS`) now support Lagrangian motion via a Python implementation.
While MMGS does not natively support Lagrangian motion (unlike MMG3D and MMG2D),
mmgpy provides equivalent functionality using Laplacian smoothing for displacement
propagation combined with standard MMGS remeshing.

### Surface Mesh Example

```python
import mmgpy
import numpy as np

# Create or load a surface mesh
mesh = mmgpy.MmgMeshS(vertices, triangles)

# Define displacement (radial expansion)
center = vertices.mean(axis=0)
directions = vertices - center
norms = np.linalg.norm(directions, axis=1, keepdims=True)
directions = directions / (norms + 1e-10)
displacement = directions * 0.1  # 10% expansion

# Apply Lagrangian motion
result = mesh.remesh_lagrangian(
    displacement,
    n_steps=2,      # Multiple steps for large deformations
    hausd=0.01,     # Hausdorff distance for surface approximation
    verbose=False,
)

print(f"Vertices: {result['before']['vertices']} -> {result['after']['vertices']}")
print(f"Quality: {result['before']['quality_mean']:.3f} -> {result['after']['quality_mean']:.3f}")
```

### API Notes for Surface Meshes

The `MmgMeshS.remesh_lagrangian()` method accepts additional parameters:

- `boundary_mask`: Optional array indicating boundary vertices with prescribed displacement
- `propagate`: If True (default), propagate boundary displacement to interior using Laplacian smoothing
- `n_steps`: Number of incremental steps (useful for large displacements)

!!! note "Implementation Note"
Unlike MmgMesh3D and MmgMesh2D which use MMG's native Lagrangian implementation
(requiring the ELAS library), MmgMeshS uses a pure Python implementation.
This provides comparable results for smooth displacement fields but may
differ for complex deformations.

## Tips

1. **Small steps**: For large deformations, use multiple small steps
2. **Quality monitoring**: Check quality after each step
3. **Boundary handling**: Use `propagate_displacement` for interior smoothness
4. **Remesh parameters**: Combine with `hmax`, `hausd` for size control
5. **Validation**: Validate mesh after each Lagrangian step
6. **Surface meshes**: Use `n_steps` parameter for smoother deformation on surface meshes
