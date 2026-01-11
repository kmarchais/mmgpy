# Options Classes

This page documents the options classes for configuring remeshing operations.

## Overview

Each mesh kind has a corresponding options class:

| Mesh Kind            | Options Class  |
| -------------------- | -------------- |
| `TETRAHEDRAL`        | `Mmg3DOptions` |
| `TRIANGULAR_2D`      | `Mmg2DOptions` |
| `TRIANGULAR_SURFACE` | `MmgSOptions`  |

Options classes are immutable dataclasses with:

- Type-checked parameters
- IDE autocomplete support
- Factory methods for common configurations
- Conversion to dictionary for `remesh()`

## 3D Options

::: mmgpy.Mmg3DOptions
options:
show_root_heading: true
members: - **init** - fine - coarse - optimize_only - to_dict

## 2D Options

::: mmgpy.Mmg2DOptions
options:
show_root_heading: true
members: - **init** - fine - coarse - optimize_only - to_dict

## Surface Options

::: mmgpy.MmgSOptions
options:
show_root_heading: true
members: - **init** - fine - coarse - optimize_only - to_dict

## Parameter Reference

### Size Parameters

| Parameter | Type    | Description                                                |
| --------- | ------- | ---------------------------------------------------------- |
| `hmin`    | `float` | Minimum edge length                                        |
| `hmax`    | `float` | Maximum edge length                                        |
| `hsiz`    | `float` | Uniform target edge length                                 |
| `hgrad`   | `float` | Gradation: max ratio between adjacent edges (default: 1.3) |

### Geometric Parameters

| Parameter | Type    | Description                                        |
| --------- | ------- | -------------------------------------------------- |
| `hausd`   | `float` | Hausdorff distance: max distance to input geometry |
| `angle`   | `float` | Ridge detection angle in degrees (default: 45.0)   |

### Control Parameters

| Parameter  | Type  | Description                                       |
| ---------- | ----- | ------------------------------------------------- |
| `optim`    | `int` | Optimization mode: 1 = optimize only              |
| `noinsert` | `int` | Disable vertex insertion: 1 = no new vertices     |
| `nosurf`   | `int` | Preserve surface: 1 = don't move surface vertices |
| `nomove`   | `int` | Disable vertex motion: 1 = no vertex smoothing    |
| `noswap`   | `int` | Disable edge swapping: 1 = no topology changes    |

### Output Parameters

| Parameter | Type  | Description                                      |
| --------- | ----- | ------------------------------------------------ |
| `verbose` | `int` | Verbosity: -1=silent, 0=errors, 1=info, 2+=debug |

## Usage Examples

### Basic Usage

```python
from mmgpy import Mesh, Mmg3DOptions

mesh = Mesh("input.mesh")

# Create options
opts = Mmg3DOptions(
    hmin=0.01,
    hmax=0.1,
    hausd=0.001,
    verbose=1,
)

# Use with remesh
result = mesh.remesh(opts)
```

### Factory Methods

```python
from mmgpy import Mmg3DOptions

# Fine mesh (small elements)
fine_opts = Mmg3DOptions.fine()

# Coarse mesh (large elements)
coarse_opts = Mmg3DOptions.coarse()

# Optimization only (no topology changes)
opt_opts = Mmg3DOptions.optimize_only()
```

### Converting to Dictionary

```python
opts = Mmg3DOptions(hmax=0.1, hausd=0.001)

# Get as dictionary
params = opts.to_dict()
print(params)  # {'hmax': 0.1, 'hausd': 0.001}

# Unpack into remesh
result = mesh.remesh(**opts.to_dict())
```

### Customizing Presets

```python
from dataclasses import replace

# Start with a preset
base = Mmg3DOptions.fine()

# Customize using replace
custom = replace(base, hmax=0.05, verbose=1)
```

### Combining with Keyword Arguments

Options objects and keyword arguments cannot be mixed:

```python
# Correct: use options object
result = mesh.remesh(opts)

# Correct: use keyword arguments
result = mesh.remesh(hmax=0.1, hausd=0.001)

# Error: mixing both
result = mesh.remesh(opts, verbose=1)  # TypeError!
```

## Recommended Values

### For Quality Optimization

```python
opts = Mmg3DOptions(
    optim=1,       # Enable optimization mode
    noinsert=1,    # Don't add vertices
    hgrad=1.1,     # Gentle gradation
)
```

### For Surface Preservation

```python
opts = Mmg3DOptions(
    hmax=0.1,
    hausd=0.0001,  # Tight approximation
    nosurf=1,      # Preserve surface vertices
)
```

### For CFD Meshes

```python
opts = Mmg3DOptions(
    hmin=0.001,
    hmax=0.1,
    hgrad=1.2,     # Smooth size transition
    hausd=0.001,
    angle=20.0,    # Detect more ridges
)
```

### For FEM Meshes

```python
opts = Mmg3DOptions(
    hmin=0.01,
    hmax=0.1,
    hgrad=1.3,
    verbose=1,
)
```
