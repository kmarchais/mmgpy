# Metrics

This page documents the metric tensor operations in the `mmgpy.metrics` module.

## Overview

Metric tensors control anisotropic mesh adaptation. A metric at each vertex specifies:

- **Isotropic**, target edge length (single scalar or `(n,1)` array).
- **Anisotropic**, target lengths along principal directions (a symmetric tensor in Voigt form).

The metric is attached to the dataset as `point_data["metric"]`; `dataset.mmg.remesh(...)` automatically picks it up.

## Metric Creation

::: mmgpy.metrics.create_isotropic_metric
options:
show_root_heading: true

::: mmgpy.metrics.create_anisotropic_metric
options:
show_root_heading: true

::: mmgpy.metrics.create_metric_from_hessian
options:
show_root_heading: true

## Hessian Recovery

::: mmgpy.metrics.compute_hessian
options:
show_root_heading: true

Pairing `compute_hessian` with `create_metric_from_hessian` enables
solution-adaptive remeshing: the same vertex budget concentrates
elements where the field has high curvature.

![2D uniform vs Hessian-adapted mesh](../assets/hessian_adaptation_2d.png)
![3D uniform vs Hessian-adapted mesh](../assets/hessian_adaptation_3d.png)

For an end-to-end walk-through of the solve → recover → adapt loop, see
the [Hessian-Based Adaptation tutorial](../tutorials/hessian-adaptation.md).

## Metric Operations

::: mmgpy.metrics.intersect_metrics
options:
show_root_heading: true

::: mmgpy.metrics.compute_metric_eigenpairs
options:
show_root_heading: true

## Tensor Utilities

::: mmgpy.metrics.tensor_to_matrix
options:
show_root_heading: true

::: mmgpy.metrics.matrix_to_tensor
options:
show_root_heading: true

::: mmgpy.metrics.validate_metric_tensor
options:
show_root_heading: true

## Usage Examples

### Isotropic Metric

Create a metric for uniform element sizes:

```python
import pyvista as pv
import mmgpy  # noqa: F401  -- registers reader/writer + accessor
import mmgpy.metrics as metrics
import numpy as np

mesh = pv.read("input.mesh")

sizes = np.ones(mesh.n_points) * 0.1
mesh.point_data["metric"] = metrics.create_isotropic_metric(sizes)

remeshed = mesh.mmg.remesh()
```

### Variable Size Metric

Size varying with position:

<!-- pytest-codeblocks:cont -->

```python
import numpy as np

vertices = np.asarray(mesh.points)

# Size increases with distance from origin
distances = np.linalg.norm(vertices, axis=1)
sizes = 0.01 + 0.1 * distances

mesh.point_data["metric"] = metrics.create_isotropic_metric(sizes)
remeshed = mesh.mmg.remesh()
```

### Anisotropic Metric

Different sizes in different directions:

<!-- pytest-codeblocks:cont -->

```python
import numpy as np

# sizes: desired element sizes along each principal direction
sizes = np.array([0.1, 0.1, 0.05])  # Smaller in z

single_tensor = metrics.create_anisotropic_metric(sizes)
mesh.point_data["metric"] = np.tile(single_tensor, (mesh.n_points, 1))

remeshed = mesh.mmg.remesh()
```

### Metric from Hessian

Adapt mesh to solution curvature:

<!-- pytest.mark.skip -->

```python
from mmgpy.metrics import compute_hessian, create_metric_from_hessian

solution = np.sin(vertices[:, 0] * 2 * np.pi)
hessian = compute_hessian(vertices, triangles, solution)

mesh.point_data["metric"] = create_metric_from_hessian(
    hessian,
    target_error=0.01,
    hmin=1e-3,
    hmax=1e-1,
)

adapted = mesh.mmg.remesh(hgrad=2.0)
```

### Metric Intersection

Combine multiple metrics (minimum size wins):

<!-- pytest-codeblocks:cont -->

```python
sizes1 = np.ones(mesh.n_points) * 0.05
sizes2 = np.ones(mesh.n_points) * 0.08
metric1 = metrics.create_isotropic_metric(sizes1)
metric2 = metrics.create_isotropic_metric(sizes2)

combined = metrics.intersect_metrics(metric1, metric2)
mesh.point_data["metric"] = combined
```

### Extracting Metric Information

<!-- pytest-codeblocks:cont -->

```python
metric = np.asarray(mesh.point_data["metric"])

sizes, directions = metrics.compute_metric_eigenpairs(metric)

# sizes shape: (n_vertices, dim) — element sizes along each principal direction
# directions shape: (n_vertices, dim, dim) — principal directions as columns

print(f"Size range: {sizes.min():.4f} to {sizes.max():.4f}")
```

### Tensor Format Conversion

MMG uses symmetric tensors in Voigt notation:

<!-- pytest-codeblocks:cont -->

```python
# 3D: 6 components per vertex
# [M11, M12, M13, M22, M23, M33]

# 2D: 3 components per vertex
# [M11, M12, M22]

tensor = np.asarray(mesh.point_data["metric"])[0]  # First vertex
matrix = metrics.tensor_to_matrix(tensor)
print(matrix.shape)  # (3, 3)

tensor_back = metrics.matrix_to_tensor(matrix)
```

### Validation

Check metric tensor validity:

<!-- pytest-codeblocks:cont -->

```python
metric = np.asarray(mesh.point_data["metric"])

is_valid = metrics.validate_metric_tensor(metric)
if not is_valid:
    print("Warning: invalid metric tensor")
```

## Metric Formats

### 3D Metrics (TETRAHEDRAL)

Symmetric 3x3 tensor stored as 6 components:

```
    [M11  M12  M13]
M = [M12  M22  M23]  -> [M11, M12, M13, M22, M23, M33]
    [M13  M23  M33]
```

Metric field shape: `(n_vertices, 6)`.

### 2D Metrics (TRIANGULAR_2D)

Symmetric 2x2 tensor stored as 3 components:

```
    [M11  M12]
M = [M12  M22]  -> [M11, M12, M22]
```

Metric field shape: `(n_vertices, 3)`.

### Surface Metrics (TRIANGULAR_SURFACE)

Same as 3D: `(n_vertices, 6)`.

## Tips

1. **Isotropic first**, start with isotropic metrics, add anisotropy only when needed.
2. **Size bounds**, ensure metric sizes are within reasonable bounds relative to the domain.
3. **Gradation**, MMG's `hgrad` parameter controls size gradation regardless of metric.
4. **Validation**, always validate metric tensors before remeshing.
5. **Combination**, use `intersect_metrics` to combine sizing from different sources.
