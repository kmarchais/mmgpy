# Mesh Classes

This page documents the mesh classes provided by mmgpy.

## Unified Mesh Class

The `Mesh` class provides a unified interface that auto-detects mesh type:

::: mmgpy.Mesh
options:
members: - **init** - kind - save - get_vertices - get_triangles - get_tetrahedra - get_edges - get_mesh_size - remesh - remesh_optimize - remesh_uniform - remesh_levelset - remesh_lagrangian - validate - to_pyvista - set_size_sphere - set_size_box - set_size_cylinder - set_size_from_point - clear_local_sizing - get_local_sizing_count

::: mmgpy.MeshKind
options:
show_root_heading: true

## 3D Volume Mesh

::: mmgpy.MmgMesh3D
options:
members: - **init** - from_pyvista - save - get_mesh_size - get_vertices - set_vertices - get_tetrahedra - set_tetrahedra - get_triangles - set_triangles - get_edges - set_edges - get_element_quality - get_adjacent_elements - get_vertex_neighbors - remesh - remesh_optimize - remesh_uniform - remesh_lagrangian - remesh_levelset - validate - set_field - get_field - **getitem** - **setitem** - to_pyvista - set_size_sphere - set_size_box - set_size_cylinder - set_size_from_point - clear_local_sizing - get_local_sizing_count - apply_local_sizing - set_corners - set_required_vertices - set_ridge_edges

## 2D Planar Mesh

::: mmgpy.MmgMesh2D
options:
members: - **init** - from_pyvista - save - get_mesh_size - get_vertices - set_vertices - get_triangles - set_triangles - get_edges - set_edges - get_element_quality - remesh - remesh_optimize - remesh_uniform - remesh_lagrangian - remesh_levelset - validate - set_field - get_field - **getitem** - **setitem** - to_pyvista - set_size_sphere - set_size_box - set_size_from_point - clear_local_sizing - get_local_sizing_count - apply_local_sizing

## 3D Surface Mesh

::: mmgpy.MmgMeshS
options:
members: - **init** - from_pyvista - save - get_mesh_size - get_vertices - set_vertices - get_triangles - set_triangles - get_edges - set_edges - get_element_quality - remesh - remesh_optimize - remesh_uniform - remesh_levelset - validate - set_field - get_field - **getitem** - **setitem** - to_pyvista - set_size_sphere - set_size_box - set_size_cylinder - set_size_from_point - clear_local_sizing - get_local_sizing_count - apply_local_sizing

## Usage Examples

### Creating Meshes

```python
import mmgpy
import numpy as np

# From file
mesh = mmgpy.MmgMesh3D("input.mesh")

# From arrays
vertices = np.array([
    [0, 0, 0],
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
], dtype=np.float64)

tetrahedra = np.array([[0, 1, 2, 3]], dtype=np.int32)

mesh = mmgpy.MmgMesh3D(vertices, tetrahedra)
```

### Accessing Mesh Data

```python
# Get mesh statistics
size = mesh.get_mesh_size()
print(f"Vertices: {size['vertices']}")
print(f"Tetrahedra: {size['tetrahedra']}")
print(f"Triangles: {size['triangles']}")

# Get arrays
vertices = mesh.get_vertices()      # Shape: (n_vertices, 3)
tetrahedra = mesh.get_tetrahedra()  # Shape: (n_tetrahedra, 4)
triangles = mesh.get_triangles()    # Shape: (n_triangles, 3)
```

### Working with Fields

```python
import numpy as np

# Set a scalar field
temperatures = np.random.rand(mesh.get_mesh_size()['vertices'])
mesh["temperature"] = temperatures

# Get a field
temps = mesh["temperature"]

# Set using method
mesh.set_field("velocity", velocity_vectors)

# Get using method
vel = mesh.get_field("velocity")
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
```
