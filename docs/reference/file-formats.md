# File Formats

mmgpy supports numerous file formats through its integration with meshio.

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

### For MMG Processing

Use `.mesh` format:

```python
mesh.save("output.mesh")
```

- Best compatibility with MMG
- Supports all MMG-specific features
- Can include solution/metric files

### For Visualization (ParaView)

Use VTK formats:

```python
mesh.save("output.vtk")   # Legacy
mesh.save("output.vtu")   # XML (preferred)
```

### For CAD/3D Printing

Use STL:

```python
# Surface meshes only
mesh.save("output.stl")
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

MMG supports solution files (`.sol`) containing:

- Scalar fields (temperature, pressure)
- Vector fields (velocity, displacement)
- Tensor fields (stress, metric)

### Creating Solution Files

```python
import numpy as np

mesh = mmgpy.read("input.mesh")

# Add scalar field
temperature = np.random.rand(mesh.get_mesh_size()["vertices"])
mesh["temperature"] = temperature

# Save mesh and solution
mesh.save("output.mesh")  # Also saves output.sol if fields exist
```

### Loading Solution Files

```python
# Solution file is loaded automatically if present
mesh = mmgpy.read("input.mesh")

# Access fields
if "temperature" in mesh:
    temp = mesh["temperature"]
```

## Binary vs ASCII

| Aspect         | ASCII (.mesh)       | Binary (.meshb) |
| -------------- | ------------------- | --------------- |
| File size      | Larger              | Smaller         |
| Read speed     | Slower              | Faster          |
| Human readable | Yes                 | No              |
| Precision      | Text representation | Full precision  |

```python
# ASCII
mesh.save("output.mesh")

# Binary
mesh.save("output.meshb")
```

## Format Detection

mmgpy automatically detects format from extension:

```python
# Auto-detected from extension
mesh = mmgpy.read("model.stl")
mesh = mmgpy.read("simulation.vtu")
mesh = mmgpy.read("domain.msh")
```

## Troubleshooting

### Unsupported Format

If a format is not recognized:

1. Check the extension is correct
2. Ensure meshio supports the format
3. Try converting to `.mesh` or `.vtk` first

### Lost Data

Some formats don't support all features:

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

```python
# Use binary format
mesh.save("large_mesh.meshb")

# Or compressed VTK
mesh.save("large_mesh.vtu")  # XML VTK supports compression
```
