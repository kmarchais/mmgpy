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

| Parameter   | Type   | Description                                                         |
| ----------- | ------ | ------------------------------------------------------------------- |
| `optim`     | `bool` | Optimize element quality without other topology changes             |
| `optim_les` | `bool` | (3D only) Optimize for LES anisotropic boundary layers (`optimLES`) |
| `noinsert`  | `bool` | Disable vertex insertion (no new vertices)                          |
| `nosurf`    | `bool` | (3D / 2D) Preserve surface or boundary, don't move them             |
| `nomove`    | `bool` | Disable vertex motion (no smoothing)                                |
| `noswap`    | `bool` | Disable edge swapping (no topology changes)                         |
| `opnbdy`    | `bool` | (3D / 2D) Preserve open boundaries / non-manifold edges             |
| `nofem`     | `bool` | (3D / 2D) Skip the final FEM-friendly element-quality cleanup pass  |
| `nreg`      | `bool` | Use vertex normals to smooth the mesh (normal regularization)       |
| `anisosize` | `bool` | Treat the size map as anisotropic (otherwise treated as isotropic)  |
| `keep_ref`  | `bool` | (Surface only) Keep edge references in the output (`keepRef`)       |

### Niche Parameters (kwargs only)

These are accepted as keyword arguments to `remesh(...)` but are not
exposed as fields on the dataclasses:

| Parameter      | Mesh kinds | Description                                        |
| -------------- | ---------- | -------------------------------------------------- |
| `octree`       | 3D         | Octree-based search (advanced)                     |
| `numsubdomain` | all        | Restrict remeshing to a subdomain by reference     |
| `isoref`       | all        | Reference value for the implicit-domain interface  |
| `nosizreq`     | all        | Disable required-entity size enforcement           |
| `xreg`         | all        | Enable coordinate-field regularization             |
| `xreg_val`     | all        | Strength of `xreg` regularization                  |
| `rmc`          | all        | Remove small connected components (level-set mode) |
| `3dmedit`      | 2D         | Toggle the 3D-Medit file-format flag               |

### Output Parameters

| Parameter | Type  | Description                                      |
| --------- | ----- | ------------------------------------------------ |
| `verbose` | `int` | Verbosity: -1=silent, 0=errors, 1=info, 2+=debug |

## Usage Examples

### Basic Usage

```python
import pyvista as pv
import mmgpy  # noqa: F401  -- registers reader/writer + accessor
from mmgpy import Mmg3DOptions

mesh = pv.read("input.mesh")

opts = Mmg3DOptions(
    hmin=0.01,
    hmax=0.1,
    hausd=0.001,
    verbose=1,
)

remeshed = mesh.mmg.remesh(opts)
```

### Factory Methods

```python
from mmgpy import Mmg3DOptions

# Fine mesh (small elements)
fine_opts = Mmg3DOptions.fine(hmax=0.01)

# Coarse mesh (large elements)
coarse_opts = Mmg3DOptions.coarse(hmax=1.0)

# Optimization only (no topology changes)
opt_opts = Mmg3DOptions.optimize_only()
```

### Converting to Dictionary

<!-- pytest-codeblocks:skip -->

```python
opts = Mmg3DOptions(hmax=0.1, hausd=0.001)

# Get as dictionary
params = opts.to_dict()
print(params)  # {'hmax': 0.1, 'hausd': 0.001}

# Unpack into remesh
remeshed = mesh.mmg.remesh(**opts.to_dict())
```

### Customizing Presets

<!-- pytest-codeblocks:cont -->

```python
# Start with fine preset values, then customize
custom = Mmg3DOptions(hmax=0.05, hausd=0.01, hgrad=1.2, verbose=1)
```

### Combining with Keyword Arguments

Options objects and keyword arguments cannot be mixed:

<!-- pytest-codeblocks:skip -->

```python
# Correct: use options object
remeshed = mesh.mmg.remesh(opts)

# Correct: use keyword arguments
remeshed = mesh.mmg.remesh(hmax=0.1, hausd=0.001)

# Error: mixing both
remeshed = mesh.mmg.remesh(opts, verbose=1)  # TypeError!
```

## Recommended Values

### For Quality Optimization

<!-- pytest-codeblocks:cont -->

```python
opts = Mmg3DOptions(
    optim=1,       # Enable optimization mode
    noinsert=1,    # Don't add vertices
    hgrad=1.1,     # Gentle gradation
)
```

### For Surface Preservation

<!-- pytest-codeblocks:cont -->

```python
opts = Mmg3DOptions(
    hmax=0.1,
    hausd=0.0001,  # Tight approximation
    nosurf=1,      # Preserve surface vertices
)
```

### For CFD Meshes

<!-- pytest-codeblocks:cont -->

```python
opts = Mmg3DOptions(
    hmin=0.001,
    hmax=0.1,
    hgrad=1.2,     # Smooth size transition
    hausd=0.001,
    ar=20,       # Detect more ridges
)
```

### For FEM Meshes

<!-- pytest-codeblocks:cont -->

```python
opts = Mmg3DOptions(
    hmin=0.01,
    hmax=0.1,
    hgrad=1.3,
    verbose=1,
)
```
