# mmgpy

Python bindings for the [MMG](https://www.mmgtools.org) remeshing library.

[Get Started :material-arrow-right:](getting-started/quickstart.md){ .md-button .md-button--primary }
[API Reference :material-arrow-right:](api/index.md){ .md-button }

---

## Features

|                                                   |                                                   |
| ------------------------------------------------- | ------------------------------------------------- |
| :material-cube-outline: **3D Volume Meshing**     | Tetrahedral remeshing                             |
| :material-triangle-outline: **2D Meshing**        | Triangular remeshing for planar domains           |
| :material-shape-outline: **Surface Meshing**      | 3D surface remeshing and optimization             |
| :material-resize: **Local Sizing**                | Sphere, box, cylinder, and point-based refinement |
| :material-chart-line: **Anisotropic Metrics**     | Custom metric tensors for directional adaptation  |
| :material-layers-outline: **Level-Set**           | Extract isosurfaces from implicit functions       |
| :material-arrow-expand-all: **Lagrangian Motion** | Remesh while preserving displacement fields       |
| :material-eye: **PyVista Integration**            | Seamless conversion for visualization             |
| :material-file-multiple: **40+ File Formats**     | VTK, STL, OBJ, GMSH, and more via meshio          |

## Quick Start

```python
import mmgpy

# Load a mesh from any supported format
mesh = mmgpy.read("input.mesh")

# Remesh with target edge size
result = mesh.remesh(hmax=0.1)
print(f"Quality: {result.quality_mean_before:.2f} → {result.quality_mean_after:.2f}")

# Save the result
mesh.save("output.vtk")
```

## Installation

=== "pip"

    ```bash
    pip install mmgpy
    ```

=== "uv"

    ```bash
    uv pip install mmgpy
    # or: uv add mmgpy (project dependency)
    # or: uv tool install mmgpy (mmg2d_O3, mmg3d_O3, mmgs_O3 globally)
    ```

## Gallery

![Mechanical piece remeshing](https://raw.githubusercontent.com/kmarchais/mmgpy/main/assets/mechanical_piece_remeshing.png)
_Surface remeshing of a mechanical part_

![Smooth surface remeshing](https://raw.githubusercontent.com/kmarchais/mmgpy/main/assets/smooth_surface_remeshing.png)
_Smooth surface mesh optimization_

![3D mesh quality improvement](https://raw.githubusercontent.com/kmarchais/mmgpy/main/assets/3d_mesh.png)
_3D volumetric mesh quality improvement_

## Learn More

- **[Quick Start](getting-started/quickstart.md)** — Get started in 5 minutes
- **[Tutorials](tutorials/basic-remeshing.md)** — Step-by-step guides
- **[API Reference](api/index.md)** — Complete documentation
- **[Examples](examples/index.md)** — Real-world use cases
