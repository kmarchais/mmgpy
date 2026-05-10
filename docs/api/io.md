# I/O

This page documents how to load and save meshes with mmgpy.

mmgpy registers a Medit reader/writer plugin with PyVista on import, so `pv.read("foo.mesh")` and `dataset.save("foo.mesh")` both go through MMG's native I/O. Other formats are handled by PyVista directly (which uses meshio under the hood).

## Reading Meshes

::: mmgpy.read
options:
show_root_heading: true

`mmgpy.read` is **deprecated in 0.13 and will be removed in 0.14**. It still returns the same internal `Mesh` wrapper as in 0.12 (so existing `mesh = mmgpy.read(...); mesh.remesh(...)` code keeps running), but it emits a `DeprecationWarning`. New code should call `pv.read(...)` directly and use the `.mmg` accessor: `pv.read(...)` works for any PyVista-supported format, and with `mmgpy` installed it additionally handles `.mesh` / `.meshb` via the registered Medit reader plugin.

### Supported Formats

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
import pyvista as pv
import mmgpy  # noqa: F401  -- registers reader/writer + accessor

# Auto-detect format from extension
mesh = pv.read("input.mesh")
mesh = pv.read("input.vtk")
mesh = pv.read("input.stl")

print(f"Kind: {mesh.mmg.kind}")  # MeshKind.TETRAHEDRAL, etc.
```

## From PyVista Primitives

The accessor works on any `pv.UnstructuredGrid` or `pv.PolyData`, so you don't need an explicit conversion:

```python
import pyvista as pv
import mmgpy  # noqa: F401

# Surface
sphere = pv.Sphere(radius=1.0)
remeshed_surface = sphere.mmg.remesh(hsiz=0.1)

# Volume (needs tetrahedral cells)
volume = pv.Box().triangulate().delaunay_3d()
remeshed_volume = volume.mmg.remesh(hsiz=0.2)

# 2D plane
plane = pv.Plane()
remeshed_plane = plane.mmg.remesh(hsiz=0.1)
```

## Saving Meshes

Use PyVista's `save()`:

<!-- pytest-codeblocks:cont -->

```python
# MMG native (registered reader/writer)
remeshed_volume.save("output.mesh")

# VTK formats (handled by PyVista)
remeshed_volume.save("output.vtk")
remeshed_volume.save("output.vtu")

# Surface meshes also support .stl
remeshed_surface.save("output.stl")
```

Format is inferred from the file extension.

## Complete Example

```python
import pyvista as pv
import mmgpy  # noqa: F401

mesh = pv.read("input.mesh")
print(f"Loaded {mesh.mmg.kind} mesh")

remeshed = mesh.mmg.remesh(hmax=0.1)

# Save to different formats
remeshed.save("output.mesh")   # MMG native (fast)
remeshed.save("output.vtk")    # For ParaView
remeshed.save("output.vtu")    # VTK XML format

# Or build from a PyVista primitive
torus = pv.ParametricTorus()
remeshed_torus = torus.mmg.remesh(hmax=0.1)
remeshed_torus.save("torus.mesh")
```

## Generating a 2D Mesh from Boundary Edges

`mmgpy.mmg2d.generate` triangulates a 2D domain described by a vertex+edge outline. Internally it drives the same `MMG2D_mmg2dmesh` entry point that the standalone executable uses when fed a `.mesh` file with no triangles.

```python
import numpy as np
import pyvista as pv
import mmgpy  # noqa: F401  -- registers the accessor
from mmgpy import mmg2d

verts = np.array(
    [[0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0]],
    dtype=np.float64,
)
edges = np.array([[0, 1], [1, 2], [2, 3], [3, 0]], dtype=np.int32)

mesh = mmg2d.generate(verts, edges, hmax=0.1)

# Equivalent via the .mmg accessor: a line-only PolyData is auto-routed
# through the same generation path.
verts_3d = np.column_stack([verts, np.zeros(len(verts))])
lines = np.column_stack([np.full(len(edges), 2), edges]).ravel()
outline = pv.PolyData(verts_3d, lines=lines)
mesh = outline.mmg.remesh(hmax=0.1)
```

## Tips

1. **MMG native format**: Use `.mesh` for fastest I/O with MMG (mmgpy's reader plugin handles ridges and reference markers natively).
2. **VTK for visualization**: Use `.vtk` or `.vtu` for ParaView.
3. **Surface formats**: STL and OBJ are surface-only.
4. **Binary formats**: Some formats support binary (faster, smaller).
5. **Field data**: Most formats preserve scalar/vector fields via `point_data`/`cell_data`.
