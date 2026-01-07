# Sizing Constraints

This page documents the sizing constraint classes for local mesh refinement.

## Overview

Sizing constraints define regions where specific element sizes should be used. Multiple constraints can be combined - where they overlap, the minimum size wins.

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

## Mesh Methods

All mesh classes have convenience methods for adding sizing constraints:

### set_size_sphere

```python
mesh.set_size_sphere(
    center=[0.5, 0.5, 0.5],  # Center of sphere
    radius=0.2,              # Sphere radius
    size=0.01,               # Target edge size
)
```

### set_size_box

```python
mesh.set_size_box(
    bounds=[[0, 0, 0], [0.3, 0.3, 0.3]],  # [[min], [max]]
    size=0.01,
)
```

### set_size_cylinder

```python
# 3D meshes only
mesh.set_size_cylinder(
    point1=[0, 0, 0],    # First axis endpoint
    point2=[0, 0, 1],    # Second axis endpoint
    radius=0.1,          # Cylinder radius
    size=0.01,
)
```

### set_size_from_point

```python
mesh.set_size_from_point(
    point=[0.5, 0.5, 0.5],
    near_size=0.01,       # Size at reference point
    far_size=0.1,         # Size at influence_radius
    influence_radius=0.5,
)
```

### clear_local_sizing

```python
# Remove all sizing constraints
mesh.clear_local_sizing()
```

### get_local_sizing_count

```python
# Check number of active constraints
n = mesh.get_local_sizing_count()
```

### apply_local_sizing

```python
# Manually apply constraints to metric field
mesh.apply_local_sizing()
```

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
import mmgpy

mesh = mmgpy.read("input.mesh")

# Add refinement region
mesh.set_size_sphere(center=[0.5, 0.5, 0.5], radius=0.2, size=0.01)

# Remesh (sizing constraints applied automatically)
result = mesh.remesh(hmax=0.1)
```

### Multiple Regions

```python
# Fine region
mesh.set_size_sphere(center=[0.3, 0.5, 0.5], radius=0.1, size=0.005)

# Medium region
mesh.set_size_box(bounds=[[0.5, 0, 0], [1, 1, 1]], size=0.02)

# Graded region
mesh.set_size_from_point(
    point=[0.8, 0.5, 0.5],
    near_size=0.01,
    far_size=0.05,
    influence_radius=0.3,
)

result = mesh.remesh(hmax=0.1)
```

### Direct Class Usage

```python
from mmgpy import SphereSize, BoxSize
from mmgpy.sizing import apply_sizing_constraints
import numpy as np

mesh = mmgpy.read("input.mesh")

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

apply_sizing_constraints(mesh, constraints)
result = mesh.remesh(hmax=0.1)
```

### Workflow with Validation

```python
import mmgpy

mesh = mmgpy.read("input.mesh")

# Add sizing constraints
mesh.set_size_sphere(center=[0.5, 0.5, 0.5], radius=0.2, size=0.01)

# Check constraint count
print(f"Active constraints: {mesh.get_local_sizing_count()}")

# Preview metric field
mesh.apply_local_sizing()
metric = mesh["metric"]
print(f"Metric sizes: {metric.min():.4f} to {metric.max():.4f}")

# Remesh
result = mesh.remesh(hmax=0.1, verbose=-1)

# Clear for next iteration
mesh.clear_local_sizing()
```

## How Sizing Works

1. **Constraint Definition**: Each constraint defines a region and target size
2. **Size Computation**: For each vertex, compute size from all constraints
3. **Minimum Selection**: Where constraints overlap, minimum size wins
4. **Metric Conversion**: Sizes are converted to isotropic metric tensors
5. **Remeshing**: MMG uses the metric field to guide remeshing

```python
from mmgpy.sizing import compute_sizes_from_constraints, sizes_to_metric
import numpy as np

# Get vertex coordinates
vertices = mesh.get_vertices()

# Compute sizes from constraints
constraints = [SphereSize(...), BoxSize(...)]
sizes = compute_sizes_from_constraints(vertices, constraints)

# Convert to metric field
metric = sizes_to_metric(sizes)

# Apply to mesh
mesh["metric"] = metric
```

## Tips

1. **Constraint Order**: Order doesn't matter - minimum size wins everywhere
2. **Performance**: Many constraints have minimal overhead
3. **Clearing**: Always clear constraints between different remeshing runs if needed
4. **Debugging**: Use `apply_local_sizing()` to preview the metric field before remeshing
