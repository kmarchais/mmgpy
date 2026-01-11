# Core Concepts

This page explains the fundamental concepts behind mmgpy and mesh remeshing.

## Mesh Types

mmgpy supports three types of meshes through the unified `Mesh` class:

### 3D Volumetric Meshes (`MeshKind.TETRAHEDRAL`)

Tetrahedral meshes representing 3D volumes. Used for:

- Finite element analysis (FEA)
- Computational fluid dynamics (CFD)
- Structural simulations

```python
import mmgpy

# Load a volumetric mesh
mesh = mmgpy.Mesh("volume.mesh")
print(mesh.kind)  # MeshKind.TETRAHEDRAL
```

### 2D Planar Meshes (`MeshKind.TRIANGULAR_2D`)

Triangular meshes in 2D. Used for:

- 2D simulations
- Planar domain meshing
- Height field representations

```python
import mmgpy

mesh = mmgpy.Mesh("planar.mesh")
print(mesh.kind)  # MeshKind.TRIANGULAR_2D
```

### 3D Surface Meshes (`MeshKind.TRIANGULAR_SURFACE`)

Triangular meshes representing 3D surfaces. Used for:

- Surface remeshing
- CAD model preparation
- Graphics and visualization

```python
import mmgpy

mesh = mmgpy.Mesh("surface.stl")
print(mesh.kind)  # MeshKind.TRIANGULAR_SURFACE
```

## The Unified Mesh Class

The `Mesh` class is the primary public API for mmgpy. It auto-detects the mesh type based on input data:

```python
import mmgpy

# Auto-detect mesh type from file
mesh = mmgpy.Mesh("input.mesh")
print(f"Mesh type: {mesh.kind}")  # MeshKind.TETRAHEDRAL, TRIANGULAR_2D, or TRIANGULAR_SURFACE

# From arrays - type is detected from vertex dimensions and cell type
import numpy as np

# 3D vertices + tetrahedra → TETRAHEDRAL
vertices_3d = np.array([[0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1]], dtype=np.float64)
tetrahedra = np.array([[0, 1, 2, 3]], dtype=np.int32)
mesh_3d = mmgpy.Mesh(vertices_3d, tetrahedra)

# 2D vertices + triangles → TRIANGULAR_2D
vertices_2d = np.array([[0, 0], [1, 0], [0.5, 1]], dtype=np.float64)
triangles = np.array([[0, 1, 2]], dtype=np.int32)
mesh_2d = mmgpy.Mesh(vertices_2d, triangles)
```

## Remeshing Operations

### Standard Remeshing

The default `remesh()` operation modifies the mesh topology to achieve target element sizes:

```python
result = mesh.remesh(
    hmin=0.01,   # Minimum edge length
    hmax=0.1,    # Maximum edge length
)
```

This may:

- Insert new vertices
- Remove vertices
- Swap edges
- Split/collapse elements

### Optimization Only

To improve quality without changing topology:

```python
result = mesh.remesh_optimize()
```

Or equivalently:

```python
result = mesh.remesh(optim=1, noinsert=1)
```

### Uniform Remeshing

To remesh with a single target size everywhere:

```python
result = mesh.remesh_uniform(size=0.05)
```

### Level-Set Remeshing

Extract and remesh an isosurface:

```python
import numpy as np

# Define a level-set function (distance to sphere)
def levelset_func(coords):
    return np.linalg.norm(coords - [0.5, 0.5, 0.5], axis=1) - 0.3

mesh = mmgpy.Mesh("background.mesh")
levelset = levelset_func(mesh.get_vertices())

result = mesh.remesh_levelset(levelset)
```

### Lagrangian Remeshing

Remesh while preserving a displacement field (useful for moving meshes):

```python
# Displacement field at each vertex
displacement = np.zeros((n_vertices, 3))
displacement[:, 0] = 0.1  # Move all vertices in x

result = mesh.remesh_lagrangian(displacement)
```

## Mesh Size Control

### Global Sizing

Control edge lengths globally:

| Parameter | Description                                  |
| --------- | -------------------------------------------- |
| `hmin`    | Minimum edge length                          |
| `hmax`    | Maximum edge length                          |
| `hsiz`    | Uniform target edge length                   |
| `hausd`   | Hausdorff distance (geometric approximation) |

### Local Sizing

Refine specific regions with sizing constraints:

```python
# Spherical refinement region
mesh.set_size_sphere(center=[0.5, 0.5, 0.5], radius=0.2, size=0.01)

# Box refinement region
mesh.set_size_box(bounds=[[0, 0, 0], [0.3, 0.3, 0.3]], size=0.02)

# Cylindrical refinement region (3D only)
mesh.set_size_cylinder(point1=[0, 0, 0], point2=[1, 0, 0], radius=0.1, size=0.01)

# Distance-based sizing from a point
mesh.set_size_from_point(
    point=[0.5, 0.5, 0.5],
    near_size=0.01,
    far_size=0.1,
    influence_radius=0.5,
)
```

### Metric Fields

For anisotropic remeshing, define a metric tensor at each vertex:

```python
import mmgpy.metrics as metrics

# Create isotropic metric from sizes
sizes = np.ones(n_vertices) * 0.1
metric = metrics.create_isotropic_metric(sizes)
mesh["metric"] = metric

result = mesh.remesh()
```

## Quality Metrics

mmgpy uses normalized quality measures:

- **Quality = 1.0** - Perfect element (equilateral tetrahedron/triangle)
- **Quality = 0.0** - Degenerate element (collapsed)

The `RemeshResult` class provides quality statistics:

```python
result = mesh.remesh(hmax=0.1)

print(f"Min quality: {result.quality_min_after:.3f}")
print(f"Mean quality: {result.quality_mean_after:.3f}")
```

## File Formats

mmgpy supports 40+ file formats via meshio:

| Format     | Extension      | Notes               |
| ---------- | -------------- | ------------------- |
| MMG native | `.mesh`        | Recommended for MMG |
| VTK        | `.vtk`, `.vtu` | Good for ParaView   |
| STL        | `.stl`         | Surface meshes only |
| OBJ        | `.obj`         | Surface meshes only |
| GMSH       | `.msh`         | Popular for FEM     |
| PLY        | `.ply`         | Point cloud/mesh    |

Load any format with `mmgpy.Mesh()` or `mmgpy.read()`:

```python
mesh = mmgpy.Mesh("model.stl")
mesh.save("output.vtk")
```

## Verbosity Levels

Control output verbosity:

| Level | Description        |
| ----- | ------------------ |
| `-1`  | Silent (no output) |
| `0`   | Errors only        |
| `1`   | Standard info      |
| `2+`  | Debug output       |

```python
result = mesh.remesh(hmax=0.1, verbose=-1)  # Silent
result = mesh.remesh(hmax=0.1, verbose=1)   # Standard
```
