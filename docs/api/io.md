---
icon: lucide/file-input
---

# I/O Functions

This page documents the input/output functions for loading and saving meshes.

## Reading Meshes

::: mmgpy.read
options:
show_root_heading: true

### Supported Formats

mmgpy supports 40+ file formats via meshio:

| Format           | Extensions        | Notes                          |
| ---------------- | ----------------- | ------------------------------ |
| MMG native       | `.mesh`, `.meshb` | Recommended for MMG            |
| VTK Legacy       | `.vtk`            | Universal, ParaView compatible |
| VTK XML          | `.vtu`, `.vtp`    | Modern VTK format              |
| STL              | `.stl`            | Surface meshes only            |
| OBJ              | `.obj`            | Surface meshes only            |
| PLY              | `.ply`            | Point cloud / mesh             |
| GMSH             | `.msh`            | Popular for FEM                |
| Abaqus           | `.inp`            | FEM format                     |
| CGNS             | `.cgns`           | CFD format                     |
| Exodus II        | `.e`, `.exo`      | Sandia format                  |
| ANSYS            | `.ansys`          | FEM format                     |
| MED              | `.med`            | Salome format                  |
| And many more... |                   | See meshio documentation       |

### Usage

```python
import mmgpy

# Auto-detect format from extension
mesh = mmgpy.read("input.mesh")
mesh = mmgpy.read("input.vtk")
mesh = mmgpy.read("input.stl")

# Returns unified Mesh object
print(f"Type: {mesh.kind}")  # MeshKind.TETRAHEDRAL, etc.
```

## PyVista Conversion

::: mmgpy.from_pyvista
options:
show_root_heading: true

::: mmgpy.to_pyvista
options:
show_root_heading: true

### From PyVista

```python
import mmgpy
import pyvista as pv

# Create PyVista geometry
sphere = pv.Sphere(radius=1.0)

# Convert to surface mesh
mesh = mmgpy.Mesh(sphere)

# For volumetric meshes (needs tetrahedral cells)
volume = pv.Box().triangulate().delaunay_3d()
mesh_3d = mmgpy.Mesh(volume)

# For 2D meshes
plane = pv.Plane()
mesh_2d = mmgpy.Mesh(plane)
```

### To PyVista

```python
import mmgpy

mesh = mmgpy.read("input.mesh")

# Convert to PyVista
pv_mesh = mesh.to_pyvista()

# Or using method
pv_mesh = mesh.to_pyvista()

# Visualize
pv_mesh.plot(show_edges=True)
```

## Saving Meshes

Meshes are saved using the `save()` method:

<!-- pytest-codeblocks:cont -->

```python
# Volume meshes: .mesh, .vtk, .vtu
mesh.save("output.mesh")  # MMG native
mesh.save("output.vtk")   # VTK format

# Surface meshes: also support .stl
surface = mmgpy.read("model.stl")
surface.save("output.stl")
```

Format is inferred from the file extension.

## Direct Class Loading

Each mesh class can also load from files directly:

```python
import mmgpy

# 3D mesh
mesh_3d = mmgpy.Mesh("volume.mesh")

# 2D mesh
mesh_2d = mmgpy.Mesh("planar.mesh")

# Surface mesh
mesh_s = mmgpy.Mesh("surface.stl")
```

## Complete Example

```python
import mmgpy
import pyvista as pv

# Load from file
mesh = mmgpy.read("input.mesh")
print(f"Loaded {mesh.kind} mesh")

# Remesh
mesh.remesh(hmax=0.1)

# Save to different formats
mesh.save("output.mesh")   # MMG native (fast)
mesh.save("output.vtk")    # For ParaView
mesh.save("output.vtu")    # VTK XML format

# Convert to PyVista for visualization
pv_mesh = mesh.to_pyvista()
pv_mesh.save("output_pv.vtk")

# Or create from PyVista
torus = pv.ParametricTorus()
torus_mesh = mmgpy.Mesh(torus)
torus_mesh.remesh(hmax=0.1)
torus_mesh.save("torus.mesh")
```

## Tips

1. **MMG native format**: Use `.mesh` for fastest I/O with MMG
2. **VTK for visualization**: Use `.vtk` or `.vtu` for ParaView
3. **Surface formats**: STL and OBJ are surface-only
4. **Binary formats**: Some formats support binary (faster, smaller)
5. **Field data**: Most formats preserve scalar/vector fields
