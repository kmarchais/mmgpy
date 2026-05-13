# Core Concepts

This page explains the fundamental concepts behind mmgpy and mesh remeshing.

mmgpy operates on PyVista datasets via the `.mmg` accessor. Importing `mmgpy` registers the accessor on every `pv.UnstructuredGrid` and `pv.PolyData`, plus a Medit reader/writer for `.mesh` / `.meshb` files.

## Mesh Types

The accessor automatically detects three mesh kinds. Inspect via `dataset.mmg.kind`:

### 3D Volumetric Meshes (`MeshKind.TETRAHEDRAL`)

Tetrahedral meshes representing 3D volumes. Used for:

- Finite element analysis (FEA)
- Computational fluid dynamics (CFD)
- Structural simulations

```python
import pyvista as pv
import mmgpy  # noqa: F401

mesh = pv.read("volume.mesh")
print(mesh.mmg.kind)  # MeshKind.TETRAHEDRAL
```

### 2D Planar Meshes (`MeshKind.TRIANGULAR_2D`)

Triangular meshes in 2D. Used for:

- 2D simulations
- Planar domain meshing
- Height field representations

```python
import pyvista as pv
import mmgpy  # noqa: F401

mesh = pv.read("planar.mesh")
print(mesh.mmg.kind)  # MeshKind.TRIANGULAR_2D
```

### 3D Surface Meshes (`MeshKind.TRIANGULAR_SURFACE`)

Triangular meshes representing 3D surfaces. Used for:

- Surface remeshing
- CAD model preparation
- Graphics and visualization

```python
import pyvista as pv
import mmgpy  # noqa: F401

mesh = pv.read("surface.stl")
print(mesh.mmg.kind)  # MeshKind.TRIANGULAR_SURFACE
```

## Building Datasets

You can use any PyVista construction path. The accessor detects the kind from cell types and coordinate dimensions:

```python
import numpy as np
import pyvista as pv
import mmgpy  # noqa: F401

# 3D vertices + tetrahedra → TETRAHEDRAL
vertices_3d = np.array([[0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1]], dtype=np.float64)
tetrahedra = np.array([[0, 1, 2, 3]], dtype=np.int32)
mesh_3d = pv.UnstructuredGrid({pv.CellType.TETRA: tetrahedra}, vertices_3d)
print(mesh_3d.mmg.kind)  # MeshKind.TETRAHEDRAL

# 2D vertices + triangles → TRIANGULAR_2D (embed at z=0 in PolyData)
vertices_2d = np.array(
    [[0, 0, 0], [1, 0, 0], [0.5, 1, 0]],
    dtype=np.float64,
)
triangles = np.array([[0, 1, 2]], dtype=np.int32)
faces = np.column_stack([np.full(len(triangles), 3), triangles]).ravel()
mesh_2d = pv.PolyData(vertices_2d, faces=faces)
print(mesh_2d.mmg.kind)  # MeshKind.TRIANGULAR_2D
```

## Remeshing Operations

### Standard Remeshing

The default `remesh()` operation modifies the mesh topology to achieve target element sizes:

<!-- pytest-codeblocks:cont -->

```python
remeshed = mesh_3d.mmg.remesh(
    hmin=0.01,
    hmax=0.1,
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
import pyvista as pv
import mmgpy  # noqa: F401

mesh = pv.read("input.mesh")
optimized = mesh.mmg.remesh_optimize()
```

Or equivalently:

```python
import pyvista as pv
import mmgpy  # noqa: F401

mesh = pv.read("input.mesh")
optimized = mesh.mmg.remesh(optim=1, noinsert=1)
```

### Uniform Remeshing

To remesh with a single target size everywhere:

```python
import pyvista as pv
import mmgpy  # noqa: F401

mesh = pv.read("input.mesh")
uniform = mesh.mmg.remesh_uniform(size=0.05)
```

### Level-Set Remeshing

Extract and remesh an isosurface:

```python
import numpy as np
import pyvista as pv
import mmgpy  # noqa: F401


def levelset_func(coords: np.ndarray) -> np.ndarray:
    return (np.linalg.norm(coords - [0.5, 0.5, 0.5], axis=1) - 0.3).reshape(-1, 1)


mesh = pv.read("background.mesh")
levelset = levelset_func(np.asarray(mesh.points))
discretized = mesh.mmg.remesh_levelset(levelset)
```

### Lagrangian Remeshing

Remesh while preserving a displacement field (useful for moving meshes):

<!-- pytest-codeblocks:skip -->

```python
displacement = np.zeros((mesh.n_points, 3))
displacement[:, 0] = 0.1  # Move all vertices in x

moved = mesh.mmg.move(displacement, hmax=0.1)
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

Refine specific regions with sizing constraints passed to `remesh()`:

<!-- pytest-codeblocks:cont -->

```python
remeshed = mesh.mmg.remesh(
    hmax=0.1,
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
        {
            "shape": "cylinder",
            "point1": (0, 0, 0),
            "point2": (1, 0, 0),
            "radius": 0.1,
            "size": 0.01,
        },
        {
            "shape": "from_point",
            "point": (0.5, 0.5, 0.5),
            "near_size": 0.01,
            "far_size": 0.1,
            "influence_radius": 0.5,
        },
    ],
)
```

### Metric Fields

For anisotropic remeshing, define a metric tensor at each vertex via `point_data`:

```python
import numpy as np
import pyvista as pv
import mmgpy  # noqa: F401
import mmgpy.metrics as metrics

mesh = pv.read("input.mesh")

sizes = np.ones(mesh.n_points) * 0.1
mesh.point_data["metric"] = metrics.create_isotropic_metric(sizes)

remeshed = mesh.mmg.remesh()
```

## Quality Metrics

mmgpy uses normalized quality measures:

- **Quality = 1.0** - Perfect element (equilateral tetrahedron/triangle)
- **Quality = 0.0** - Degenerate element (collapsed)

Per-element quality is available via the accessor:

<!-- pytest-codeblocks:cont -->

```python
qualities = remeshed.mmg.element_qualities()

print(f"Min quality:  {qualities.min():.3f}")
print(f"Mean quality: {qualities.mean():.3f}")
```

## File Formats

mmgpy supports 40+ file formats through PyVista. VTK-native formats (`.vtk`, `.vtu`, `.vtp`, `.stl`, `.ply`, ...) work out of the box; install `pyvista[io]` for meshio-backed formats (`.msh`, `.med`, `.inp`, ...):

| Format     | Extension      | Notes                                          |
| ---------- | -------------- | ---------------------------------------------- |
| MMG native | `.mesh`        | Recommended for MMG (mmgpy registers a reader) |
| VTK        | `.vtk`, `.vtu` | Good for ParaView                              |
| STL        | `.stl`         | Surface meshes only                            |
| OBJ        | `.obj`         | Surface meshes only                            |
| GMSH       | `.msh`         | Popular for FEM                                |
| PLY        | `.ply`         | Point cloud/mesh                               |

Use `pv.read` and `dataset.save` for everything:

<!-- pytest-codeblocks:cont -->

```python
mesh = pv.read("model.stl")
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

<!-- pytest-codeblocks:cont -->

```python
silent = mesh.mmg.remesh(hmax=0.1, verbose=-1)
loud = mesh.mmg.remesh(hmax=0.1, verbose=1)
```
