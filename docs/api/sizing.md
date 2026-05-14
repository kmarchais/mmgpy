# Sizing Constraints

This page documents the sizing constraint classes for local mesh refinement.

## Overview

Sizing constraints define regions where specific element sizes should be used. Multiple constraints can be combined: where they overlap, the minimum size wins.

The recommended way to apply sizing constraints is to pass them as a `local_sizing=[...]` list of dicts to `dataset.mmg.remesh(...)`. The corresponding dataclasses (`SphereSize`, `BoxSize`, ...) are also exported for callers that prefer typed objects.

## Sizing Classes

### SphereSize

::: mmgpy.SphereSize
options:
show_root_heading: true

### BoxSize

::: mmgpy.BoxSize
options:
show_root_heading: true

### CylinderSize

::: mmgpy.CylinderSize
options:
show_root_heading: true

### PointSize

::: mmgpy.PointSize
options:
show_root_heading: true

### SizingConstraint (Base Class)

::: mmgpy.SizingConstraint
options:
show_root_heading: true

## Accessor Usage

Pass sizing specifications to `mesh.mmg.remesh(...)` via the `local_sizing` keyword. Each entry is a dict with a `"shape"` key (`"sphere"`, `"box"`, `"cylinder"`, or `"from_point"`) plus the matching parameters:

```python
import pyvista as pv
import mmgpy  # noqa: F401  -- registers reader/writer + accessor

mesh = pv.read("input.mesh")

remeshed = mesh.mmg.remesh(
    hmax=0.1,
    local_sizing=[
        {"shape": "sphere", "center": [0.5, 0.5, 0.5], "radius": 0.2, "size": 0.01},
        {"shape": "box", "bounds": [[0, 0, 0], [0.3, 0.3, 0.3]], "size": 0.02},
        {
            "shape": "cylinder",
            "point1": [0, 0, 0],
            "point2": [0, 0, 1],
            "radius": 0.1,
            "size": 0.01,
        },
        {
            "shape": "from_point",
            "point": [0.5, 0.5, 0.5],
            "near_size": 0.01,
            "far_size": 0.1,
            "influence_radius": 0.5,
        },
    ],
)
```

### Available shapes

| Shape        | Required parameters                                                  |
| ------------ | -------------------------------------------------------------------- |
| `sphere`     | `center`, `radius`, `size`                                           |
| `box`        | `bounds` (a `[[xmin, ymin, zmin], [xmax, ymax, zmax]]` pair), `size` |
| `cylinder`   | `point1`, `point2`, `radius`, `size` (3D only)                       |
| `from_point` | `point`, `near_size`, `far_size`, `influence_radius`                 |

## Utility Functions

::: mmgpy.sizing.apply_sizing_constraints
options:
show_root_heading: true

::: mmgpy.sizing.compute_sizes_from_constraints
options:
show_root_heading: true

::: mmgpy.sizing.sizes_to_metric
options:
show_root_heading: true

## Usage Examples

### Basic Usage

```python
import pyvista as pv
import mmgpy  # noqa: F401

mesh = pv.read("input.mesh")

remeshed = mesh.mmg.remesh(
    hmax=0.1,
    local_sizing=[
        {"shape": "sphere", "center": [0.5, 0.5, 0.5], "radius": 0.2, "size": 0.01},
    ],
)
```

### Multiple Regions

<!-- pytest-codeblocks:cont -->

```python
remeshed = mesh.mmg.remesh(
    hmax=0.1,
    local_sizing=[
        # Fine region
        {"shape": "sphere", "center": [0.3, 0.5, 0.5], "radius": 0.1, "size": 0.005},
        # Medium region
        {"shape": "box", "bounds": [[0.5, 0, 0], [1, 1, 1]], "size": 0.02},
        # Graded region
        {
            "shape": "from_point",
            "point": [0.8, 0.5, 0.5],
            "near_size": 0.01,
            "far_size": 0.05,
            "influence_radius": 0.3,
        },
    ],
)
```

### Using the Dataclasses Directly

```python
import numpy as np
import pyvista as pv
import mmgpy  # noqa: F401
from mmgpy import SphereSize, BoxSize
from mmgpy.sizing import compute_sizes_from_constraints, sizes_to_metric

mesh = pv.read("input.mesh")

constraints = [
    SphereSize(
        center=np.array([0.5, 0.5, 0.5]),
        radius=0.2,
        size=0.01,
    ),
    BoxSize(
        bounds=np.array([[0, 0, 0], [0.3, 0.3, 0.3]]),
        size=0.02,
    ),
]

# Convert directly to an isotropic metric and remesh through point_data
vertices = np.asarray(mesh.points)
sizes = compute_sizes_from_constraints(vertices, constraints)
mesh.point_data["metric"] = sizes_to_metric(sizes)
remeshed = mesh.mmg.remesh()
```

### Workflow with Validation

```python
import pyvista as pv
import mmgpy  # noqa: F401

mesh = pv.read("input.mesh")

remeshed = mesh.mmg.remesh(
    hmax=0.1,
    verbose=-1,
    local_sizing=[
        {"shape": "sphere", "center": [0.5, 0.5, 0.5], "radius": 0.2, "size": 0.01},
    ],
)

# Inspect the size map MMG used (also writes point_data["metric"] in place)
sizes = remeshed.mmg.build_size_map()
print(f"Metric sizes: {sizes.min():.4f} to {sizes.max():.4f}")

assert remeshed.mmg.validate(), "remeshed mesh failed validation"
```

## How Sizing Works

1. **Constraint Definition**, each constraint defines a region and a target size.
2. **Size Computation**, for each vertex, MMG computes the size implied by every constraint.
3. **Minimum Selection**, where constraints overlap, the smallest size wins.
4. **Metric Conversion**, sizes are converted to isotropic metric tensors.
5. **Remeshing**, MMG uses the metric field to guide remeshing.

Constraints become the `point_data["metric"]` array on the remeshed dataset (an isotropic scalar). Build it manually if you want full control:

```python
import numpy as np
import pyvista as pv
import mmgpy  # noqa: F401
from mmgpy import SphereSize, BoxSize
from mmgpy.sizing import compute_sizes_from_constraints
import mmgpy.metrics as metrics

mesh = pv.read("input.mesh")
vertices = np.asarray(mesh.points)

constraints = [
    SphereSize(center=np.array([0.5, 0.5, 0.5]), radius=0.2, size=0.01),
    BoxSize(bounds=np.array([[0, 0, 0], [0.3, 0.3, 0.3]]), size=0.02),
]
sizes = compute_sizes_from_constraints(vertices, constraints)

mesh.point_data["metric"] = metrics.create_isotropic_metric(sizes)
remeshed = mesh.mmg.remesh()
```

## Tips

1. **Constraint order does not matter**, the minimum size wins at every vertex.
2. **Many constraints have minimal overhead**, fold them into one `remesh` call.
3. **Combine with `hmax`**, `local_sizing` only tightens the metric inside its regions, the global `hmax` still applies elsewhere.
4. **Debugging**, call `dataset.mmg.build_size_map()` to inspect the metric the accessor would feed to MMG.
