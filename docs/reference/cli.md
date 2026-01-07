# CLI Tools

mmgpy includes bundled MMG executables that can be used directly from the command line.

## Available Executables

| Command    | Description                              |
| ---------- | ---------------------------------------- |
| `mmg2d_O3` | 2D mesh generation and optimization      |
| `mmg3d_O3` | 3D mesh generation and optimization      |
| `mmgs_O3`  | Surface mesh generation and optimization |

## Installation

The executables are installed automatically with mmgpy:

```bash
pip install mmgpy
```

After installation, the executables are available in your PATH.

## Basic Usage

### mmg3d_O3 (3D Meshing)

```bash
# Basic remeshing
mmg3d_O3 input.mesh -o output.mesh

# Set maximum edge size
mmg3d_O3 input.mesh -o output.mesh -hmax 0.1

# Set size range
mmg3d_O3 input.mesh -o output.mesh -hmin 0.01 -hmax 0.1

# Silent mode
mmg3d_O3 input.mesh -o output.mesh -v 0

# With solution file
mmg3d_O3 input.mesh -sol input.sol -o output.mesh
```

### mmg2d_O3 (2D Meshing)

```bash
# Basic remeshing
mmg2d_O3 input.mesh -o output.mesh

# With parameters
mmg2d_O3 input.mesh -o output.mesh -hmax 0.1 -hausd 0.001
```

### mmgs_O3 (Surface Meshing)

```bash
# Basic surface remeshing
mmgs_O3 input.mesh -o output.mesh

# Preserve sharp features
mmgs_O3 input.mesh -o output.mesh -ar 30

# Tight surface approximation
mmgs_O3 input.mesh -o output.mesh -hausd 0.0001
```

## Common Options

### Size Control

| Option       | Description                        |
| ------------ | ---------------------------------- |
| `-hmin val`  | Minimum edge size                  |
| `-hmax val`  | Maximum edge size                  |
| `-hsiz val`  | Uniform target size                |
| `-hgrad val` | Gradation parameter (default: 1.3) |

### Geometric Parameters

| Option       | Description                      |
| ------------ | -------------------------------- |
| `-hausd val` | Hausdorff distance tolerance     |
| `-ar angle`  | Ridge detection angle in degrees |

### Mode Control

| Option      | Description                            |
| ----------- | -------------------------------------- |
| `-optim`    | Optimization mode (no point insertion) |
| `-noinsert` | Disable vertex insertion               |
| `-noswap`   | Disable edge/face swapping             |
| `-nomove`   | Disable vertex movement                |
| `-nosurf`   | Don't modify surface                   |

### Input/Output

| Option      | Description          |
| ----------- | -------------------- |
| `-in file`  | Input mesh file      |
| `-o file`   | Output mesh file     |
| `-sol file` | Solution/metric file |
| `-out file` | Output solution file |

### Verbosity

| Option | Description                |
| ------ | -------------------------- |
| `-v n` | Verbosity level (-1 to 10) |
| `-h`   | Display help               |

## Examples

### Quality Optimization

```bash
# Optimize mesh quality without topology changes
mmg3d_O3 input.mesh -o output.mesh -optim -noinsert
```

### Uniform Remeshing

```bash
# Remesh with uniform target size
mmg3d_O3 input.mesh -o output.mesh -hsiz 0.05
```

### Surface Preservation

```bash
# Remesh volume while preserving surface
mmg3d_O3 input.mesh -o output.mesh -nosurf -hmax 0.1
```

### With Metric File

```bash
# Use custom metric for anisotropic remeshing
mmg3d_O3 input.mesh -sol metric.sol -o output.mesh
```

## RPATH Fixing

On macOS and Linux, if the executables fail to find libraries:

```bash
# Run the RPATH fix utility
fix-mmg-rpath
```

Or from Python:

```python
import mmgpy
mmgpy._fix_rpath()
```

## Python Wrappers

For programmatic CLI access, mmgpy provides wrapper functions:

```python
import mmgpy

# These call the underlying executables
mmgpy.mmg3d.remesh("input.mesh", output_mesh="output.mesh", hmax=0.1)
mmgpy.mmg2d.remesh("input.mesh", output_mesh="output.mesh", hmax=0.1)
mmgpy.mmgs.remesh("input.mesh", output_mesh="output.mesh", hmax=0.1)
```

## Full Documentation

For complete MMG documentation, see:

- [MMG Official Documentation](https://www.mmgtools.org/mmg-remesher-downloads/mmg-remesher-documentation)
- [MMG GitHub Wiki](https://github.com/MmgTools/mmg/wiki)
