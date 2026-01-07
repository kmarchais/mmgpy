# mmgpy

Python bindings for the [MMG](https://www.mmgtools.org) mesh generation and optimization library.

<div class="grid cards" markdown>

- :material-rocket-launch:{ .lg .middle } **Quick Start**

  ***

  Get started with mmgpy in under 5 minutes

  [:octicons-arrow-right-24: Getting started](getting-started/quickstart.md)

- :material-book-open-variant:{ .lg .middle } **Tutorials**

  ***

  Step-by-step guides for common workflows

  [:octicons-arrow-right-24: Tutorials](tutorials/basic-remeshing.md)

- :material-code-tags:{ .lg .middle } **API Reference**

  ***

  Complete API documentation with examples

  [:octicons-arrow-right-24: API Reference](api/index.md)

- :material-cube-outline:{ .lg .middle } **Examples**

  ***

  Real-world examples and use cases

  [:octicons-arrow-right-24: Examples](examples/index.md)

</div>

## Features

- **3D Volume Meshing** - Tetrahedral mesh generation and optimization with `MmgMesh3D`
- **2D Meshing** - Triangular mesh generation for planar domains with `MmgMesh2D`
- **Surface Meshing** - 3D surface mesh remeshing with `MmgMeshS`
- **PyVista Integration** - Seamless conversion to/from PyVista for visualization
- **40+ File Formats** - Load meshes from VTK, STL, OBJ, GMSH, and many more via meshio
- **Local Sizing Control** - Sphere, box, cylinder, and point-based mesh refinement
- **Metric Fields** - Anisotropic mesh adaptation with custom metric tensors
- **Validation** - Comprehensive mesh quality checks and statistics

## Basic Usage

```python
import mmgpy

# Load a mesh from any supported format
mesh = mmgpy.read("input.mesh")

# Remesh with target edge size
result = mesh.remesh(hmax=0.1)
print(f"Quality improved: {result.quality_mean_before:.2f} -> {result.quality_mean_after:.2f}")

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
    ```

=== "From source"

    ```bash
    pip install git+https://github.com/kmarchais/mmgpy.git
    ```

## Gallery

<figure markdown>
  ![Mechanical piece remeshing](https://raw.githubusercontent.com/kmarchais/mmgpy/main/assets/mechanical_piece_remeshing.png){ width="600" }
  <figcaption>Surface remeshing of a mechanical part</figcaption>
</figure>

<figure markdown>
  ![Smooth surface remeshing](https://raw.githubusercontent.com/kmarchais/mmgpy/main/assets/smooth_surface_remeshing.png){ width="600" }
  <figcaption>Smooth surface mesh optimization</figcaption>
</figure>

<figure markdown>
  ![3D mesh quality improvement](https://raw.githubusercontent.com/kmarchais/mmgpy/main/assets/3d_mesh.png){ width="600" }
  <figcaption>3D volumetric mesh quality improvement</figcaption>
</figure>
