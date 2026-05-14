# API Reference

This section provides detailed API documentation for all public classes and functions in mmgpy.

## Quick Reference

### Core Classes

| Class                         | Description                                                  |
| ----------------------------- | ------------------------------------------------------------ |
| `MmgAccessor` (`dataset.mmg`) | PyVista accessor exposing all MMG operations on `pv.DataSet` |
| `MeshKind`                    | Enumeration of mesh types                                    |

### Options Classes

| Class                                           | Description                   |
| ----------------------------------------------- | ----------------------------- |
| [`Mmg3DOptions`](options.md#mmgpy.Mmg3DOptions) | Options for 3D remeshing      |
| [`Mmg2DOptions`](options.md#mmgpy.Mmg2DOptions) | Options for 2D remeshing      |
| [`MmgSOptions`](options.md#mmgpy.MmgSOptions)   | Options for surface remeshing |

### Result Classes

| Class                                                              | Description                    |
| ------------------------------------------------------------------ | ------------------------------ |
| [`RemeshResult`](results-validation.md#mmgpy.RemeshResult)         | Remeshing operation statistics |
| [`ValidationReport`](results-validation.md#mmgpy.ValidationReport) | Mesh validation results        |
| [`QualityStats`](results-validation.md#mmgpy.QualityStats)         | Element quality statistics     |

### Sizing Constraints

| Class                                          | Description                   |
| ---------------------------------------------- | ----------------------------- |
| [`SphereSize`](sizing.md#mmgpy.SphereSize)     | Spherical refinement region   |
| [`BoxSize`](sizing.md#mmgpy.BoxSize)           | Box refinement region         |
| [`CylinderSize`](sizing.md#mmgpy.CylinderSize) | Cylindrical refinement region |
| [`PointSize`](sizing.md#mmgpy.PointSize)       | Distance-based sizing         |

### I/O Functions

| Function                                     | Description                                                     |
| -------------------------------------------- | --------------------------------------------------------------- |
| `pv.read(...)` (PyVista)                     | Handles `.mesh` / `.meshb` via mmgpy's reader plugin            |
| `dataset.save(...)` (PyVista)                | Handles `.mesh` / `.meshb` via mmgpy's writer plugin            |
| [`from_pyvista()`](io.md#mmgpy.from_pyvista) | Low-level: convert PyVista dataset to an `MmgMesh*` impl        |
| [`to_pyvista()`](io.md#mmgpy.to_pyvista)     | Low-level: convert an `MmgMesh*` impl back to a PyVista dataset |

!!! warning "Deprecated: `mmgpy.read`"
`mmgpy.read(...)` emits a `DeprecationWarning` since 0.13 and will be
removed in 0.14. Use `pv.read(...)` and the `.mmg` accessor instead.

### Modules

| Module                              | Description               |
| ----------------------------------- | ------------------------- |
| [`mmgpy.metrics`](metrics.md)       | Metric tensor operations  |
| [`mmgpy.lagrangian`](lagrangian.md) | Lagrangian mesh motion    |
| [`mmgpy.sizing`](sizing.md)         | Sizing constraint classes |

## Module Structure

```
mmgpy
├── Core
│   └── MeshKind          # Mesh type enumeration (returned by dataset.mmg.kind)
│
├── Options
│   ├── Mmg3DOptions      # 3D options
│   ├── Mmg2DOptions      # 2D options
│   └── MmgSOptions       # Surface options
│
├── Results & Validation
│   ├── RemeshResult      # Operation statistics
│   ├── ValidationReport  # Validation results
│   ├── ValidationIssue   # Individual issues
│   └── QualityStats      # Quality metrics
│
├── Sizing
│   ├── SphereSize        # Spherical region
│   ├── BoxSize           # Box region
│   ├── CylinderSize      # Cylinder region
│   └── PointSize         # Point-based sizing
│
├── I/O Functions
│   ├── from_pyvista()    # From PyVista
│   └── to_pyvista()      # To PyVista
│
├── mmgpy.metrics         # Metric operations
│   ├── create_isotropic_metric()
│   ├── create_anisotropic_metric()
│   └── intersect_metrics()
│
└── mmgpy.lagrangian      # Mesh motion
    ├── move_mesh()
    └── propagate_displacement()
```

## Basic Usage Pattern

```python
import pyvista as pv
import mmgpy  # noqa: F401  -- registers reader/writer + accessor

mesh = pv.read("input.mesh")

opts = mmgpy.Mmg3DOptions(hmax=0.1)
remeshed = mesh.mmg.remesh(opts)

report = remeshed.mmg.validate(detailed=True)
remeshed.save("output.vtk")
```

## Type Hints

All public APIs are fully typed. Use with a type-aware IDE for autocomplete:

```python
import pyvista as pv
import mmgpy  # noqa: F401
from mmgpy import Mmg3DOptions

mesh: pv.UnstructuredGrid = pv.read("input.mesh")
opts: Mmg3DOptions = Mmg3DOptions(hmax=0.1)
remeshed: pv.UnstructuredGrid = mesh.mmg.remesh(opts)
```

## Version Information

```python
import mmgpy

print(f"mmgpy version: {mmgpy.__version__}")
print(f"MMG version: {mmgpy.MMG_VERSION}")
```
