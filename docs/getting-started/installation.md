# Installation

## Requirements

- Python 3.10 or higher
- A supported operating system: Windows, macOS, or Linux

## Installing from PyPI

The easiest way to install mmgpy is from PyPI:

=== "pip"

    ```bash
    pip install mmgpy
    ```

=== "uv"

    ```bash
    uv pip install mmgpy
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

## Installing from Source

To install the latest development version:

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
print(f"Created mesh with {mesh.get_mesh_size()['vertices']} vertices")
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
