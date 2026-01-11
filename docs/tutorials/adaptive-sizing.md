# Adaptive Sizing

This tutorial covers local mesh refinement using sizing constraints.

## Overview

While global parameters like `hmax` apply to the entire mesh, adaptive sizing lets you refine specific regions. mmgpy supports several sizing constraints:

- **Sphere**: Refine within a spherical region
- **Box**: Refine within an axis-aligned box
- **Cylinder**: Refine within a cylindrical region (3D only)
- **Point**: Distance-based sizing from a reference point

## Spherical Refinement

Refine mesh within a sphere:

```python
import mmgpy

mesh = mmgpy.read("input.mesh")

# Add spherical refinement zone
mesh.set_size_sphere(
    center=[0.5, 0.5, 0.5],  # Sphere center
    radius=0.2,              # Sphere radius
    size=0.01,               # Target edge size inside sphere
)

# Remesh with global hmax (local sizing takes precedence where defined)
result = mesh.remesh(hmax=0.1, verbose=-1)
```

Multiple spheres can be combined:

```python
# Fine region near origin
mesh.set_size_sphere(center=[0, 0, 0], radius=0.1, size=0.005)

# Medium region elsewhere
mesh.set_size_sphere(center=[1, 1, 1], radius=0.3, size=0.02)

result = mesh.remesh(hmax=0.1)
```

## Box Refinement

Refine within an axis-aligned bounding box:

```python
import mmgpy

mesh = mmgpy.read("input.mesh")

# Add box refinement zone
mesh.set_size_box(
    bounds=[[0, 0, 0], [0.3, 0.3, 0.3]],  # [[xmin, ymin, zmin], [xmax, ymax, zmax]]
    size=0.01,
)

result = mesh.remesh(hmax=0.1)
```

For 2D meshes:

```python
mesh.set_size_box(
    bounds=[[0, 0], [0.5, 0.5]],  # [[xmin, ymin], [xmax, ymax]]
    size=0.01,
)
```

## Cylindrical Refinement

Refine within a cylindrical region (3D meshes only):

```python
import mmgpy

mesh = mmgpy.Mesh("input.mesh")

# Cylinder along x-axis
mesh.set_size_cylinder(
    point1=[0, 0.5, 0.5],    # First endpoint of axis
    point2=[1, 0.5, 0.5],    # Second endpoint of axis
    radius=0.1,              # Cylinder radius
    size=0.01,               # Target edge size
)

result = mesh.remesh(hmax=0.1)
```

## Distance-Based Sizing

Create graded mesh with size varying by distance from a point:

```python
import mmgpy

mesh = mmgpy.read("input.mesh")

# Size varies from 0.01 at the point to 0.1 at influence_radius
mesh.set_size_from_point(
    point=[0.5, 0.5, 0.5],
    near_size=0.01,          # Size at the reference point
    far_size=0.1,            # Size at and beyond influence_radius
    influence_radius=0.5,    # Distance over which size transitions
)

result = mesh.remesh()
```

This creates a smooth gradation from fine to coarse mesh.

## Combining Constraints

Multiple sizing constraints can be combined. Where they overlap, the minimum size wins:

```python
import mmgpy

mesh = mmgpy.read("input.mesh")

# Fine refinement in a small sphere
mesh.set_size_sphere(center=[0.5, 0.5, 0.5], radius=0.1, size=0.005)

# Medium refinement in a larger box
mesh.set_size_box(bounds=[[0.3, 0.3, 0.3], [0.7, 0.7, 0.7]], size=0.02)

# Gradient from a corner
mesh.set_size_from_point(
    point=[0, 0, 0],
    near_size=0.01,
    far_size=0.1,
    influence_radius=0.5,
)

# Apply with global hmax
result = mesh.remesh(hmax=0.1)
```

## Managing Constraints

Check and clear sizing constraints:

```python
# Check number of active constraints
n_constraints = mesh.get_local_sizing_count()
print(f"Active constraints: {n_constraints}")

# Clear all constraints
mesh.clear_local_sizing()

# Verify cleared
assert mesh.get_local_sizing_count() == 0
```

## Manual Application

Sizing constraints are automatically applied before remeshing. You can also apply them manually to inspect the resulting metric field:

```python
# Add constraints
mesh.set_size_sphere(center=[0.5, 0.5, 0.5], radius=0.2, size=0.01)

# Apply constraints to metric field (without remeshing)
mesh.apply_local_sizing()

# Inspect the metric field
metric = mesh["metric"]
print(f"Metric field shape: {metric.shape}")

# Now remesh uses the pre-computed metric
result = mesh.remesh()
```

## Complete Example: CFD Boundary Layer

Create refined mesh near a surface for CFD simulations:

```python
import mmgpy
import numpy as np

# Load a 3D domain mesh
mesh = mmgpy.read("domain.mesh")

# Fine mesh near inlet (box region)
mesh.set_size_box(
    bounds=[[-0.1, -0.1, -0.1], [0.1, 1.1, 1.1]],
    size=0.005,
)

# Medium refinement near cylinder (boundary layer)
mesh.set_size_cylinder(
    point1=[0.5, 0.5, 0],
    point2=[0.5, 0.5, 1],
    radius=0.2,
    size=0.01,
)

# Fine mesh at critical points
for point in [[0.5, 0.5, 0], [0.5, 0.5, 1]]:
    mesh.set_size_sphere(center=point, radius=0.1, size=0.003)

# Remesh with gradual size transition
result = mesh.remesh(hmax=0.05, hgrad=1.2, verbose=1)

print(f"Elements: {result.elements_before} -> {result.elements_after}")
mesh.save("refined_domain.vtk")
```

## Using Sizing Constraint Classes Directly

For programmatic use, you can use the sizing constraint classes directly:

```python
from mmgpy import SphereSize, BoxSize, CylinderSize, PointSize
from mmgpy.sizing import apply_sizing_constraints
import numpy as np

mesh = mmgpy.read("input.mesh")

# Create constraint objects
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

# Apply directly
apply_sizing_constraints(mesh, constraints)

result = mesh.remesh(hmax=0.1)
```

## Next Steps

- [PyVista Integration](pyvista-integration.md) - Visualize adaptive meshes
- [Metrics](../api/metrics.md) - Advanced anisotropic sizing
