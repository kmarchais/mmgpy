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

|                       | PyPI (pip/uv)                 | conda-forge (Linux/macOS)                           |
| --------------------- | ----------------------------- | --------------------------------------------------- |
| **Install speed**     | Fast (pre-built wheels)       | Slower (solver + download)                          |
| **Dependencies**      | Bundled (self-contained)      | Shared across packages                              |
| **Disk usage**        | Larger (duplicate VTK/libs)   | Smaller in conda environments                       |
| **Lagrangian motion** | No (ELAS library not bundled) | Yes (includes iscd-linearelasticity on Linux/macOS) |
| **Best for**          | Quick setup, isolated use, CI | Scientific stacks sharing VTK/NumPy                 |

Use **PyPI** for the fastest, most portable setup. Use **conda-forge** when you already have a conda environment with VTK, PyVista, or other scientific packages — it also includes the [ELAS](https://github.com/ISCDtoolbox/LinearElasticity) library (via iscd-linearelasticity) for Lagrangian motion on Linux and macOS.

## Installing from Source

To install the latest development version:

<!-- pytest-codeblocks:skip -->

```bash
pip install git+https://github.com/kmarchais/mmgpy.git
```

### Build Requirements

Building from source requires:

- CMake >= 3.15
- C++ compiler with C++17 support
- pybind11 >= 3.0.0
- scikit-build-core >= 0.11.5

## Verifying Installation

After installation, verify that mmgpy is working correctly:

```python
import mmgpy

print(f"mmgpy version: {mmgpy.__version__}")
print(f"MMG version: {mmgpy.MMG_VERSION}")
```

Test basic functionality:

```python
import mmgpy
import numpy as np

# Create a simple tetrahedral mesh
vertices = np.array([
    [0, 0, 0],
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
], dtype=np.float64)

tetrahedra = np.array([[0, 1, 2, 3]], dtype=np.int32)

mesh = mmgpy.Mesh(vertices, tetrahedra)
print(f"Created mesh with {len(mesh.get_vertices())} vertices")
```

## Optional Dependencies

mmgpy works with several visualization and mesh I/O libraries:

| Package | Purpose                              |
| ------- | ------------------------------------ |
| pyvista | 3D visualization and mesh conversion |
| meshio  | Extended file format support         |
| rich    | Progress bars and formatted output   |

These are installed automatically with mmgpy.

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
