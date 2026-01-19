# mmgpy

[![PyPI](https://img.shields.io/pypi/v/mmgpy)](https://pypi.org/project/mmgpy/)
[![Python](https://img.shields.io/pypi/pyversions/mmgpy)](https://pypi.org/project/mmgpy/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Docs](https://img.shields.io/badge/docs-online-blue)](https://kmarchais.github.io/mmgpy)
[![codecov](https://codecov.io/gh/kmarchais/mmgpy/graph/badge.svg)](https://codecov.io/gh/kmarchais/mmgpy)

**mmgpy** brings the power of [MMG](https://www.mmgtools.org) mesh adaptation to Python. Generate, optimize, and refine 2D, 3D, and surface meshes with a clean API.

```python
import mmgpy

mesh = mmgpy.read("input.vtk")
mesh.remesh(hmax=0.1)
mesh.save("output.vtk")
```

![Mechanical piece remeshing](assets/mechanical_piece_remeshing.png)

## Try It

No installation needed — run directly with [uvx](https://docs.astral.sh/uv/):

```bash
# Remesh a mesh file
uvx mmgpy input.stl -o output.mesh -hmax 0.1

# Launch the interactive UI
uvx --from "mmgpy[ui]" mmgpy-ui
```

## Installation

```bash
pip install mmgpy

# With UI support
pip install "mmgpy[ui]"
```

Using [uv](https://docs.astral.sh/uv/)?

```bash
uv add mmgpy                 # add to project dependencies
uv pip install mmgpy         # install in current environment
uv pip install "mmgpy[ui]"   # install with UI support
uv tool install mmgpy        # install CLI tools globally
uv tool install "mmgpy[ui]"  # install CLI tools + UI globally
```

## Features

- **Multi-dimensional** — 2D triangular, 3D tetrahedral, and surface meshes
- **Local refinement** — Control mesh density with spheres, boxes, cylinders
- **Anisotropic adaptation** — Metric tensors for directional refinement
- **Level-set discretization** — Extract isosurfaces from implicit functions
- **Lagrangian motion** — Remesh while tracking displacement fields
- **PyVista integration** — Visualize and convert meshes seamlessly
- **40+ file formats** — VTK, STL, OBJ, GMSH, and more

## Usage

### Basic Remeshing

```python
import mmgpy

mesh = mmgpy.read("input.mesh")
result = mesh.remesh(hmax=0.1)

print(f"Quality: {result.quality_mean_before:.2f} → {result.quality_mean_after:.2f}")
mesh.save("output.vtk")
```

### Local Sizing

```python
mesh = mmgpy.read("input.mesh")

# Fine mesh near a point
mesh.set_size_sphere(center=[0.5, 0.5, 0.5], radius=0.2, size=0.01)

# Fine mesh in a region
mesh.set_size_box(bounds=[[0, 0, 0], [0.3, 0.3, 0.3]], size=0.02)

mesh.remesh(hmax=0.1)
```

### Typed Options

```python
from mmgpy import Mmg3DOptions

opts = Mmg3DOptions(hmin=0.01, hmax=0.1, hausd=0.001)
mesh.remesh(opts)

# Or use presets
mesh.remesh(Mmg3DOptions.fine())
```

### Visualization

```python
mesh.plot()  # Quick plot with edges

# Or for custom plotting:
import pyvista as pv
plotter = pv.Plotter()
plotter.add_mesh(mesh.vtk, show_edges=True, color="lightblue")
plotter.show()
```

## Command Line

MMG executables are included and available after installation:

```bash
# Auto-detect mesh type
mmg input.mesh -o output.mesh -hmax 0.1

# Or use specific commands
mmg3d input.mesh -o output.mesh -hmax 0.1
mmgs surface.stl -o refined.mesh -hausd 0.001
mmg2d domain.mesh -o refined.mesh -hmax 0.05

# Check versions
mmg --version
```

The `_O3` suffix variants (`mmg3d_O3`, etc.) are also available for compatibility.

## Gallery

![Surface remeshing](assets/mechanical_piece_remeshing.png)

![Smooth surface optimization](assets/smooth_surface_remeshing.png)

![3D quality improvement](assets/3d_mesh.png)

## Documentation

**[kmarchais.github.io/mmgpy](https://kmarchais.github.io/mmgpy)**

- [Quick Start](https://kmarchais.github.io/mmgpy/getting-started/quickstart/)
- [Tutorials](https://kmarchais.github.io/mmgpy/tutorials/basic-remeshing/)
- [API Reference](https://kmarchais.github.io/mmgpy/api/)
- [Examples](https://kmarchais.github.io/mmgpy/examples/)

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup, coding standards, and the pull request process.

## License

MIT
