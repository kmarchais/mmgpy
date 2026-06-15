# File Formats

mmgpy supports numerous file formats. The native Medit `.mesh`/`.meshb` reader and writer are registered with PyVista on import, so `pv.read("foo.mesh")` and `dataset.save("foo.mesh")` go through MMG's native I/O. Other formats are handled by PyVista directly. Formats not natively supported by VTK (e.g. `.msh`, `.med`, `.inp`) require `pip install pyvista[io]`, which pulls in meshio.

## Native MMG Format

The `.mesh` (ASCII) and `.meshb` (binary) formats are the native MMG formats and are recommended for best compatibility.

### .mesh Format Structure

```
MeshVersionFormatted 2
Dimension 3

Vertices
4
0.0 0.0 0.0 0
1.0 0.0 0.0 0
0.0 1.0 0.0 0
0.0 0.0 1.0 0

Triangles
4
1 2 3 0
1 2 4 0
1 3 4 0
2 3 4 0

Tetrahedra
1
1 2 3 4 0

End
```

## Supported Formats

### Volume Mesh Formats (3D)

| Format     | Extensions        | Read | Write   | Notes               |
| ---------- | ----------------- | ---- | ------- | ------------------- |
| MMG        | `.mesh`, `.meshb` | Yes  | Yes     | Native, recommended |
| VTK Legacy | `.vtk`            | Yes  | Yes     | Universal           |
| VTK XML    | `.vtu`            | Yes  | Yes     | Modern VTK          |
| GMSH       | `.msh`            | Yes  | Yes     | Popular for FEM     |
| Abaqus     | `.inp`            | Yes  | Yes     | FEM                 |
| CGNS       | `.cgns`           | Yes  | Yes     | CFD                 |
| Exodus II  | `.e`, `.exo`      | Yes  | Yes     | Sandia              |
| MED        | `.med`            | Yes  | Yes     | Salome              |
| NASTRAN    | `.bdf`, `.nas`    | Yes  | Limited | FEM                 |

### Surface Mesh Formats

| Format | Extensions | Read | Write | Notes            |
| ------ | ---------- | ---- | ----- | ---------------- |
| STL    | `.stl`     | Yes  | Yes   | CAD export       |
| OBJ    | `.obj`     | Yes  | Yes   | Graphics         |
| PLY    | `.ply`     | Yes  | Yes   | Point cloud/mesh |
| OFF    | `.off`     | Yes  | Yes   | Simple format    |
| VTK    | `.vtp`     | Yes  | Yes   | VTK polygonal    |

### 2D Mesh Formats

| Format | Extensions     | Read | Write | Notes         |
| ------ | -------------- | ---- | ----- | ------------- |
| MMG    | `.mesh`        | Yes  | Yes   | Native        |
| VTK    | `.vtk`, `.vtu` | Yes  | Yes   | Universal     |
| SVG    | `.svg`         | No   | Yes   | Visualization |

## Format Selection Guide

```python
import pyvista as pv
import mmgpy  # noqa: F401  -- registers reader/writer + accessor

mesh = pv.read("input.mesh")
```

### For MMG Processing

Use `.mesh` format:

<!-- pytest-codeblocks:cont -->

```python
mesh.save("output.mesh")
```

- Best compatibility with MMG
- Supports all MMG-specific features (ridges, required entities, reference markers)
- Companion `.sol` files are auto-loaded on read and round-trip via `mesh.mmg.save_sol(...)`

### For Visualization (ParaView)

Use VTK formats:

<!-- pytest-codeblocks:cont -->

```python
mesh.save("output.vtk")   # Legacy
mesh.save("output.vtu")   # XML (preferred)
```

### For CAD/3D Printing

Use STL:

```python
import pyvista as pv
import mmgpy  # noqa: F401

# Surface meshes only
surface_mesh = pv.read("model.stl")
surface_mesh.save("output.stl")
```

### For Other Software

| Software | Recommended Format     |
| -------- | ---------------------- |
| ParaView | `.vtu`, `.vtk`         |
| GMSH     | `.msh`                 |
| Abaqus   | `.inp`                 |
| Salome   | `.med`                 |
| Blender  | `.obj`, `.stl`, `.ply` |
| FreeCAD  | `.stl`, `.obj`         |

## Solution Files

MMG supports solution files (`.sol` / `.solb`) containing:

- Scalar fields (temperature, pressure, level set, isotropic metric)
- Vector fields (velocity, displacement)
- Tensor fields (stress, anisotropic metric)

When reading a `.mesh` / `.meshb` file, a sibling `.sol` (same stem, same directory) is auto-loaded into `point_data` / `cell_data`. The reserved keys `metric`, `displacement`, `levelset`, `tensor` are routed to MMG's solution channel on remesh.

### Writing companion `.sol` files

```python
import numpy as np
import pyvista as pv
import mmgpy  # noqa: F401

mesh = pv.read("input.mesh")

# Scalar field on vertices
mesh.point_data["temperature"] = np.random.rand(mesh.n_points)

# Save every numeric vertex / cell array as a multi-block `.sol`
mesh.mmg.save_all_sols("output.sol")

# Or write only the MMG-reserved fields (metric / displacement / ...) with save_sol
mesh.mmg.save_sol("output_metric.sol")
```

### Loading solution files

```python
import pyvista as pv
import mmgpy  # noqa: F401

mesh = pv.read("input.mesh")

# Attach extra fields from a separately-stored .sol
mesh.mmg.load_all_sols("input_fields.sol")

# Vertex-located arrays land in point_data; element-located arrays land in cell_data
if "temperature" in mesh.point_data:
    temp = mesh.point_data["temperature"]
```

## Binary vs ASCII

| Aspect         | ASCII (.mesh)       | Binary (.meshb) |
| -------------- | ------------------- | --------------- |
| File size      | Larger              | Smaller         |
| Read speed     | Slower              | Faster          |
| Human readable | Yes                 | No              |
| Precision      | Text representation | Full precision  |

<!-- pytest-codeblocks:cont -->

```python
# ASCII
mesh.save("output.mesh")

# Binary
mesh.save("output.meshb")
```

## Format Detection

PyVista (and mmgpy's registered Medit reader) automatically detect the format from the file extension:

```python
import pyvista as pv
import mmgpy  # noqa: F401

mesh = pv.read("model.stl")
mesh = pv.read("simulation.vtu")
mesh = pv.read("domain.msh")
mesh = pv.read("domain.mesh")  # Medit reader (provided by mmgpy)
```

## Troubleshooting

### Unsupported Format

If a format is not recognized:

1. Check the extension is correct.
2. Install `pyvista[io]` if the format is meshio-backed (`.msh`, `.med`, `.inp`, ...).
3. Try converting to `.mesh` or `.vtk` first.

### Lost Data

Some formats do not support all features:

| Data Type     | .mesh    | .vtk | .stl |
| ------------- | -------- | ---- | ---- |
| Vertices      | Yes      | Yes  | Yes  |
| Triangles     | Yes      | Yes  | Yes  |
| Tetrahedra    | Yes      | Yes  | No   |
| Scalar fields | Via .sol | Yes  | No   |
| Vector fields | Via .sol | Yes  | No   |
| Material IDs  | Yes      | Yes  | No   |

### Large Files

For large meshes:

<!-- pytest-codeblocks:cont -->

```python
# Use binary format
mesh.save("large_mesh.meshb")

# Or compressed VTK
mesh.save("large_mesh.vtu")  # XML VTK supports compression
```
