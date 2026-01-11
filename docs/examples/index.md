# Examples Gallery

This page showcases complete examples from the mmgpy repository.

## 3D Volume Meshing (mmg3d)

### Mesh Quality Improvement

Improve mesh quality without changing topology.

```python
"""Mesh quality improvement with mean edge length preservation."""
import mmgpy

# Load mesh
mesh = mmgpy.Mesh("input.mesh")

# Optimize quality only (no vertex insertion/removal)
result = mesh.remesh_optimize()

print(f"Quality: {result.quality_mean_before:.3f} -> {result.quality_mean_after:.3f}")
```

[View full example](https://github.com/kmarchais/mmgpy/blob/main/examples/mmg3d/mesh_quality_improvement.py)

---

### Open Boundary Remeshing

Remesh volumetric mesh with open boundaries.

```python
"""Remeshing with open boundary handling."""
import mmgpy

mesh = mmgpy.Mesh("domain_with_holes.mesh")

result = mesh.remesh(
    hmax=0.1,
    hausd=0.001,
)
```

[View full example](https://github.com/kmarchais/mmgpy/blob/main/examples/mmg3d/open_boundary_remeshing.py)

---

### Lagrangian Motion

Remesh while applying mesh displacement.

```python
"""Lagrangian mesh motion remeshing."""
import mmgpy
import numpy as np

mesh = mmgpy.Mesh("input.mesh")
vertices = mesh.get_vertices()

# Define displacement field
displacement = np.zeros_like(vertices)
displacement[:, 0] = 0.1 * np.sin(vertices[:, 1] * np.pi)

# Remesh with motion
result = mesh.remesh_lagrangian(displacement)
```

[View full example](https://github.com/kmarchais/mmgpy/blob/main/examples/mmg3d/lagrangian_motion.py)

---

### Level-Set Discretization

Extract isosurface from implicit function.

```python
"""Level-set based surface extraction."""
import mmgpy
import numpy as np

mesh = mmgpy.Mesh("background.mesh")
vertices = mesh.get_vertices()

# Sphere level-set
levelset = np.linalg.norm(vertices - [0.5, 0.5, 0.5], axis=1) - 0.3

result = mesh.remesh_levelset(levelset)
```

[View full example](https://github.com/kmarchais/mmgpy/blob/main/examples/mmg3d/levelset_discretization.py)

---

## 2D Meshing (mmg2d)

### Local Sizing Control

Apply regional mesh refinement.

```python
"""Per-region mesh density control."""
import mmgpy

mesh = mmgpy.Mesh("domain.mesh")

# Fine mesh in center
mesh.set_size_sphere(center=[0.5, 0.5], radius=0.2, size=0.01)

# Coarser mesh elsewhere
result = mesh.remesh(hmax=0.1)
```

[View full example](https://github.com/kmarchais/mmgpy/blob/main/examples/mmg2d/local_sizing.py)

---

### Solution-Based Adaptation

Adapt mesh to solution field.

```python
"""Mesh adaptation to solution gradients."""
import mmgpy
import mmgpy.metrics as metrics
import numpy as np

mesh = mmgpy.Mesh("domain.mesh")
vertices = mesh.get_vertices()

# Solution field
solution = np.sin(vertices[:, 0] * 4 * np.pi) * np.cos(vertices[:, 1] * 4 * np.pi)

# Create metric from solution gradients
# (simplified - full implementation computes Hessian)
sizes = 0.01 + 0.1 * np.abs(solution)
metric = metrics.create_isotropic_metric(sizes)
mesh["metric"] = metric

result = mesh.remesh()
```

[View full example](https://github.com/kmarchais/mmgpy/blob/main/examples/mmg2d/mesh_adaptation_to_a_solution.py)

---

### Anisotropic Mesh Adaptation

Directional mesh refinement.

```python
"""Anisotropic mesh adaptation."""
import mmgpy
import mmgpy.metrics as metrics
import numpy as np

mesh = mmgpy.Mesh("domain.mesh")
n_vertices = mesh.get_mesh_size()["vertices"]

# Create anisotropic metric (stretch in x direction)
directions = np.tile(np.eye(2), (n_vertices, 1, 1))
sizes = np.tile([0.1, 0.02], (n_vertices, 1))  # Larger in x, smaller in y

metric = metrics.create_anisotropic_metric(directions, sizes)
mesh["metric"] = metric

result = mesh.remesh()
```

[View full example](https://github.com/kmarchais/mmgpy/blob/main/examples/mmg2d/anisotropic_mesh_adaptation.py)

---

### Implicit 2D Domain Meshing

Generate mesh from implicit function.

```python
"""Generate 2D mesh from implicit domain definition."""
import mmgpy
import numpy as np

mesh = mmgpy.Mesh("background.mesh")
vertices = mesh.get_vertices()

# Circle level-set
levelset = np.linalg.norm(vertices[:, :2] - [0.5, 0.5], axis=1) - 0.3

result = mesh.remesh_levelset(levelset)
```

[View full example](https://github.com/kmarchais/mmgpy/blob/main/examples/mmg2d/implicit_2d_domain_meshing.py)

---

## Surface Meshing (mmgs)

### Mechanical Piece Remeshing

Industrial part surface remeshing.

```python
"""Mechanical part surface optimization."""
import mmgpy

mesh = mmgpy.Mesh("part.stl")

result = mesh.remesh(
    hmax=0.05,
    hausd=0.001,
    angle=30.0,  # Preserve sharp edges
)
```

![Mechanical piece remeshing](https://raw.githubusercontent.com/kmarchais/mmgpy/main/assets/mechanical_piece_remeshing.png)

[View full example](https://github.com/kmarchais/mmgpy/blob/main/examples/mmgs/mechanical_piece_remeshing.py)

---

### Smooth Surface Remeshing

Surface smoothing and refinement.

```python
"""Smooth surface mesh optimization."""
import mmgpy

mesh = mmgpy.Mesh("surface.mesh")

result = mesh.remesh(
    hmax=0.1,
    hausd=0.0001,  # Tight approximation
    hgrad=1.1,     # Smooth gradation
)
```

![Smooth surface remeshing](https://raw.githubusercontent.com/kmarchais/mmgpy/main/assets/smooth_surface_remeshing.png)

[View full example](https://github.com/kmarchais/mmgpy/blob/main/examples/mmgs/smooth_surface_remeshing.py)

---

### Implicit Surface Meshing

Generate surface from implicit function.

```python
"""Generate surface mesh from implicit function."""
import mmgpy
import numpy as np

mesh = mmgpy.Mesh("background_surface.mesh")
vertices = mesh.get_vertices()

# Torus level-set
R, r = 0.5, 0.15
x, y, z = vertices[:, 0] - 0.5, vertices[:, 1] - 0.5, vertices[:, 2] - 0.5
q = np.sqrt(x**2 + y**2) - R
levelset = np.sqrt(q**2 + z**2) - r

result = mesh.remesh_levelset(levelset)
```

[View full example](https://github.com/kmarchais/mmgpy/blob/main/examples/mmgs/implicit_surface_domain_meshing.py)

---

## Running Examples

Clone the repository and run examples:

```bash
git clone https://github.com/kmarchais/mmgpy.git
cd mmgpy

# Install with examples dependencies
pip install -e ".[dev]"

# Run an example
python examples/mmgs/mechanical_piece_remeshing.py
```

Each example includes detailed comments and visualization using PyVista.
