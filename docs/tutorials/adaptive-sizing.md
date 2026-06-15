# Adaptive Sizing

This tutorial covers local mesh refinement using sizing constraints.

## Overview

While global parameters like `hmax` apply to the entire mesh, adaptive sizing lets you refine specific regions. mmgpy supports several sizing constraint shapes via the `local_sizing` argument to `dataset.mmg.remesh(...)`:

- **`"sphere"`**: Refine within a spherical region
- **`"box"`**: Refine within an axis-aligned box
- **`"cylinder"`**: Refine within a cylindrical region (3D only)
- **`"from_point"`**: Distance-based sizing from a reference point

Each constraint is a `dict` with a `"shape"` key plus the shape-specific parameters; you pass a list of them to `remesh`.

## Spherical Refinement

Refine mesh within a sphere:

```python
import pyvista as pv
import mmgpy  # noqa: F401

mesh = pv.read("input.mesh")

remeshed = mesh.mmg.remesh(
    hmax=0.1,
    verbose=-1,
    local_sizing=[
        {
            "shape": "sphere",
            "center": (0.5, 0.5, 0.5),
            "radius": 0.2,
            "size": 0.01,
        },
    ],
)
```

Multiple spheres can be combined; where they overlap, the minimum size wins:

```python
remeshed = mesh.mmg.remesh(
    hmax=0.1,
    local_sizing=[
        {
            "shape": "sphere",
            "center": (0, 0, 0),
            "radius": 0.1,
            "size": 0.005,
        },
        {
            "shape": "sphere",
            "center": (1, 1, 1),
            "radius": 0.3,
            "size": 0.02,
        },
    ],
)
```

## Box Refinement

Refine within an axis-aligned bounding box:

```python
import pyvista as pv
import mmgpy  # noqa: F401

mesh = pv.read("input.mesh")

remeshed = mesh.mmg.remesh(
    hmax=0.1,
    local_sizing=[
        {
            "shape": "box",
            "bounds": [[0, 0, 0], [0.3, 0.3, 0.3]],
            "size": 0.01,
        },
    ],
)
```

For 2D meshes pass 2D bounds:

<!-- mmgpy-test:skip -->

```python
remeshed = mesh.mmg.remesh(
    hmax=0.1,
    local_sizing=[
        {
            "shape": "box",
            "bounds": [[0, 0], [0.5, 0.5]],
            "size": 0.01,
        },
    ],
)
```

## Cylindrical Refinement

Refine within a cylindrical region (3D meshes only):

```python
import pyvista as pv
import mmgpy  # noqa: F401

mesh = pv.read("input.mesh")

remeshed = mesh.mmg.remesh(
    hmax=0.1,
    local_sizing=[
        {
            "shape": "cylinder",
            "point1": (0, 0.5, 0.5),
            "point2": (1, 0.5, 0.5),
            "radius": 0.1,
            "size": 0.01,
        },
    ],
)
```

## Distance-Based Sizing

Create a graded mesh with size varying by distance from a point:

```python
import pyvista as pv
import mmgpy  # noqa: F401

mesh = pv.read("input.mesh")

# Size varies from 0.01 at the point to 0.1 at influence_radius
remeshed = mesh.mmg.remesh(
    local_sizing=[
        {
            "shape": "from_point",
            "point": (0.5, 0.5, 0.5),
            "near_size": 0.01,
            "far_size": 0.1,
            "influence_radius": 0.5,
        },
    ],
)
```

This creates a smooth gradation from fine to coarse mesh.

## Combining Constraints

Multiple sizing constraints can be combined. Where they overlap, the minimum size wins:

```python
import pyvista as pv
import mmgpy  # noqa: F401

mesh = pv.read("input.mesh")

remeshed = mesh.mmg.remesh(
    hmax=0.1,
    local_sizing=[
        {
            "shape": "sphere",
            "center": (0.5, 0.5, 0.5),
            "radius": 0.1,
            "size": 0.005,
        },
        {
            "shape": "box",
            "bounds": [[0.3, 0.3, 0.3], [0.7, 0.7, 0.7]],
            "size": 0.02,
        },
        {
            "shape": "from_point",
            "point": (0, 0, 0),
            "near_size": 0.01,
            "far_size": 0.1,
            "influence_radius": 0.5,
        },
    ],
)
```

## Custom Metric Fields

For total control, compute the per-vertex sizing metric yourself and place it on `point_data["metric"]`. The accessor will pick it up:

```python
import numpy as np
from mmgpy.sizing import (
    SphereSize,
    compute_sizes_from_constraints,
    sizes_to_metric,
)

verts = np.asarray(mesh.points)
constraints = [
    SphereSize(center=np.array([0.5, 0.5, 0.5]), radius=0.2, size=0.01),
]

sizes = compute_sizes_from_constraints(verts, constraints)
finite_mask = np.isfinite(sizes)
if not np.all(finite_mask):
    sizes[~finite_mask] = sizes[finite_mask].max() * 10

mesh.point_data["metric"] = sizes_to_metric(sizes)
remeshed = mesh.mmg.remesh(nosizreq=True, hgrad=1.3, verbose=-1)
```

## Complete Example: CFD Boundary Layer

Create a refined mesh near a surface for CFD simulations:

```python
import pyvista as pv
import mmgpy  # noqa: F401

mesh = pv.read("domain.mesh")

remeshed = mesh.mmg.remesh(
    hmax=0.05,
    hgrad=1.2,
    verbose=1,
    local_sizing=[
        {
            "shape": "box",
            "bounds": [[-0.1, -0.1, -0.1], [0.1, 1.1, 1.1]],
            "size": 0.005,
        },
        {
            "shape": "cylinder",
            "point1": (0.5, 0.5, 0),
            "point2": (0.5, 0.5, 1),
            "radius": 0.2,
            "size": 0.01,
        },
        *[
            {"shape": "sphere", "center": pt, "radius": 0.1, "size": 0.003}
            for pt in [(0.5, 0.5, 0), (0.5, 0.5, 1)]
        ],
    ],
)

print(f"Cells: {mesh.n_cells} -> {remeshed.n_cells}")
remeshed.save("refined_domain.vtk")
```

## Next Steps

- [PyVista Integration](pyvista-integration.md) - Visualize adaptive meshes
- [Metrics](../api/metrics.md) - Advanced anisotropic sizing
