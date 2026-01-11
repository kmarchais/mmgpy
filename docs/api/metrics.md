# Metrics

This page documents the metric tensor operations in the `mmgpy.metrics` module.

## Overview

Metric tensors control anisotropic mesh adaptation. A metric at each vertex specifies:

- **Isotropic**: Target edge length (single scalar)
- **Anisotropic**: Target lengths along different directions (tensor)

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
import mmgpy
import mmgpy.metrics as metrics
import numpy as np

mesh = mmgpy.read("input.mesh")
n_vertices = mesh.get_mesh_size()["vertices"]

# Uniform size everywhere
sizes = np.ones(n_vertices) * 0.1
metric = metrics.create_isotropic_metric(sizes)

# Apply to mesh
mesh["metric"] = metric

# Remesh using the metric
result = mesh.remesh()
```

### Variable Size Metric

Size varying with position:

```python
import numpy as np

vertices = mesh.get_vertices()

# Size increases with distance from origin
distances = np.linalg.norm(vertices, axis=1)
sizes = 0.01 + 0.1 * distances

metric = metrics.create_isotropic_metric(sizes)
mesh["metric"] = metric
```

### Anisotropic Metric

Different sizes in different directions:

```python
import numpy as np

n_vertices = mesh.get_mesh_size()["vertices"]

# Define principal directions and sizes at each vertex
# directions: (n_vertices, 3, 3) - orthonormal basis at each vertex
# sizes: (n_vertices, 3) - sizes along each principal direction

# Example: stretch along z-axis
directions = np.tile(np.eye(3), (n_vertices, 1, 1))  # Identity basis
sizes = np.tile([0.1, 0.1, 0.05], (n_vertices, 1))   # Smaller in z

metric = metrics.create_anisotropic_metric(directions, sizes)
mesh["metric"] = metric
```

### Metric from Hessian

Adapt mesh to solution curvature:

```python
# Solution field (e.g., temperature)
solution = np.sin(vertices[:, 0] * 2 * np.pi)

# Compute Hessian (second derivatives) - requires additional computation
# hessian shape: (n_vertices, 6) for symmetric 3x3 tensor
hessian = compute_hessian(solution, mesh)  # Implementation needed

# Create metric from Hessian
metric = metrics.create_metric_from_hessian(
    hessian,
    epsilon=0.01,  # Target interpolation error
)

mesh["metric"] = metric
```

### Metric Intersection

Combine multiple metrics (minimum size wins):

```python
# Two different metrics
metric1 = metrics.create_isotropic_metric(sizes1)
metric2 = metrics.create_isotropic_metric(sizes2)

# Intersect: take minimum size in all directions
combined = metrics.intersect_metrics(metric1, metric2)
mesh["metric"] = combined
```

### Extracting Metric Information

```python
# Get current metric
metric = mesh["metric"]

# Extract eigenvalues and eigenvectors
eigenvalues, eigenvectors = metrics.compute_metric_eigenpairs(metric)

# eigenvalues shape: (n_vertices, 3) - 1/size^2 along each direction
# eigenvectors shape: (n_vertices, 3, 3) - principal directions

# Convert to sizes
sizes = 1.0 / np.sqrt(eigenvalues)
print(f"Size range: {sizes.min():.4f} to {sizes.max():.4f}")
```

### Tensor Format Conversion

MMG uses symmetric tensors in Voigt notation:

```python
# 3D: 6 components per vertex
# [M11, M12, M13, M22, M23, M33]

# 2D: 3 components per vertex
# [M11, M12, M22]

# Convert tensor to full matrix
tensor = mesh["metric"][0]  # First vertex
matrix = metrics.tensor_to_matrix(tensor)
print(matrix.shape)  # (3, 3)

# Convert matrix back to tensor
tensor_back = metrics.matrix_to_tensor(matrix)
```

### Validation

Check metric tensor validity:

```python
metric = mesh["metric"]

# Validate: must be symmetric positive definite
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

Metric field shape: `(n_vertices, 6)`

### 2D Metrics (TRIANGULAR_2D)

Symmetric 2x2 tensor stored as 3 components:

```
    [M11  M12]
M = [M12  M22]  -> [M11, M12, M22]
```

Metric field shape: `(n_vertices, 3)`

### Surface Metrics (TRIANGULAR_SURFACE)

Same as 3D: `(n_vertices, 6)`

## Tips

1. **Isotropic first**: Start with isotropic metrics, add anisotropy only when needed

2. **Size bounds**: Ensure metric sizes are within reasonable bounds relative to domain size

3. **Gradation**: MMG's `hgrad` parameter controls size gradation regardless of metric

4. **Validation**: Always validate metric tensors before remeshing

5. **Combination**: Use `intersect_metrics` to combine sizing from different sources
