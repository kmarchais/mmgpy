# Installation

## Requirements

- Python 3.10 or higher
- A supported operating system: Windows, macOS, or Linux

## Installing from PyPI

The fastest way to install mmgpy:

=== "uv (recommended)"

    ```bash
    uv pip install mmgpy
    ```

=== "pip"

    <!-- pytest-codeblocks:skip -->

    ```bash
    pip install mmgpy
    ```

=== "pipx (CLI only)"

    ```bash
    pipx install mmgpy
    ```

Pre-built wheels are available for:

| Platform | Architectures   |
| -------- | --------------- |
| Windows  | x86_64          |
| macOS    | arm64, x86_64   |
| Linux    | x86_64, aarch64 |

PyPI wheels bundle all native libraries (MMG, VTK), so no compiler or system packages are needed.

## Installing from conda-forge

If you use conda or mamba for scientific computing:

<!-- pytest-codeblocks:skip -->

```bash
conda install -c conda-forge mmgpy
```

or with [pixi](https://pixi.sh/):

<!-- pytest-codeblocks:skip -->

```bash
pixi add mmgpy
```

### PyPI vs conda-forge

|                   | PyPI (pip/uv)                 | conda-forge (Linux/macOS)           |
| ----------------- | ----------------------------- | ----------------------------------- |
| **Install speed** | Fast (pre-built wheels)       | Slower (solver + download)          |
| **Dependencies**  | Bundled (self-contained)      | Shared across packages              |
| **Disk usage**    | Larger (duplicate VTK/libs)   | Smaller in conda environments       |
| **Best for**      | Quick setup, isolated use, CI | Scientific stacks sharing VTK/NumPy |

Use **PyPI** for the fastest, most portable setup. Use **conda-forge** when you already have a conda environment with VTK, PyVista, or other scientific packages.

Lagrangian motion is available on every install channel via `mmgpy.move_mesh`. The default Laplacian propagator has no extra dependencies; the elasticity propagator requires the optional [`fedoo`](https://github.com/3MAH/fedoo) extra:

<!-- pytest-codeblocks:skip -->

```bash
uv pip install "mmgpy[fem]"
```

## Installing from Source

To install the latest development version:

<!-- pytest-codeblocks:skip -->

```bash
pip install git+https://github.com/kmarchais/mmgpy.git
```

### Build Requirements

Building from source requires:

- CMake >= 3.25
- C++ compiler with C++17 support
- pybind11 >= 3.0.4
- scikit-build-core >= 0.12.2

## Verifying Installation

After installation, verify that mmgpy is working correctly:

```python
import mmgpy

print(f"mmgpy version: {mmgpy.__version__}")
print(f"MMG version: {mmgpy.MMG_VERSION}")
```

Test basic functionality:

```python
import numpy as np
import pyvista as pv
import mmgpy  # noqa: F401  -- registers the .mmg accessor

# Create a simple tetrahedral mesh
vertices = np.array([
    [0, 0, 0],
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
], dtype=np.float64)

tetrahedra = np.array([[0, 1, 2, 3]], dtype=np.int32)

mesh = pv.UnstructuredGrid({pv.CellType.TETRA: tetrahedra}, vertices)
print(f"Created mesh with {mesh.n_points} vertices ({mesh.mmg.kind.name})")
```

## Optional Dependencies

mmgpy works with several visualization and mesh I/O libraries:

| Package     | Purpose                                                        |
| ----------- | -------------------------------------------------------------- |
| pyvista     | 3D visualization and mesh conversion (installed with mmgpy)    |
| pyvista[io] | Pulls in meshio for extended file format support (`.msh`, ...) |
| rich        | Progress bars and formatted output                             |

## Troubleshooting

### Import Errors on Windows

If you encounter DLL loading errors on Windows:

1. Ensure Visual C++ Redistributable is installed
2. Try enabling debug mode to see DLL search paths:

```python
import mmgpy
mmgpy.enable_debug()
```

### Debug Logging

Enable detailed logging to diagnose issues:

```python
import mmgpy

mmgpy.enable_debug()  # Show all debug messages
# or
mmgpy.set_log_level("DEBUG")  # Equivalent
```
