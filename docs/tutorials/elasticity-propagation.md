# Elasticity-Based Displacement Propagation

When you prescribe displacements on a subset of mesh vertices (e.g. a moving
boundary, a deformable inclusion, an injection face) and need a smooth field
on the rest of the mesh, mmgpy ships two propagators:

- `propagate_displacement` — solves Laplace's equation on the mesh graph,
  no extra dependency.
- `propagate_displacement_elasticity` — solves a linear elasticity problem
  on the mesh via the optional [`fedoo`](https://github.com/3MAH/fedoo) backend.

The two methods give noticeably different fields whenever the geometry
involves bending, re-entrant corners, or large boundary displacements. The
elasticity-based propagator captures the bending kinematics and concentrates
strain at re-entrant corners; the Laplacian one only knows about graph
distances.

## When to use the elasticity-based path

| Scenario                                  | Recommended                               |
| ----------------------------------------- | ----------------------------------------- |
| Small displacements, smooth geometry      | Laplacian (cheap, no dependency)          |
| Cantilevers, brackets, levers             | Elasticity (captures bending)             |
| Sharp re-entrant corners under load       | Elasticity (correct stress concentration) |
| Large deformations near element inversion | Elasticity (resists inversion better)     |

## 2D demo: L-bracket cantilever

The free tip of the foot is pinned and the top of the post is pulled
upward. The Laplacian field linearly interpolates the prescribed values
along graph distances, so the bracket pivots like a rigid body. Linear
elasticity captures the bending: the post curves backward at the
re-entrant corner and the foot bows visibly.

![Laplacian vs elasticity on a 2D L-bracket](../assets/elasticity_propagation_2d.gif)

<!-- mmgpy-test:skip -->

```python
from mmgpy.lagrangian import (
    propagate_displacement,
    propagate_displacement_elasticity,
)

# vertices: (N, 2), elements: (M, 3), boundary_mask: (N,) bool
# boundary_displacement: (N, 2), zero on interior, prescribed on boundary

field_lap = propagate_displacement(
    vertices, elements, boundary_mask, boundary_displacement,
)
field_ela = propagate_displacement_elasticity(
    vertices, elements, boundary_mask, boundary_displacement,
    E=1e6, nu=0.3,
)
```

Full script:
[`examples/mmg2d/elasticity_propagation.py`](https://github.com/kmarchais/mmgpy/blob/main/examples/mmg2d/elasticity_propagation.py).

## 3D demo: extruded L-bracket

Same geometry extruded in z. The pure Laplacian solver moves only the
prescribed face and produces a rigid pivot. Elasticity propagates the
loading through the corner, bending the entire bracket.

![Laplacian vs elasticity on a 3D L-bracket](../assets/elasticity_propagation_3d.gif)

Full script:
[`examples/mmg3d/elasticity_propagation.py`](https://github.com/kmarchais/mmgpy/blob/main/examples/mmg3d/elasticity_propagation.py).

## PyVista accessor

The accessor's `move()` method exposes the propagator via the
`propagation_method` keyword:

<!-- mmgpy-test:skip -->

```python
import numpy as np
import pyvista as pv
import mmgpy  # noqa: F401  -- registers the .mmg accessor

mesh = pv.read("bracket.mesh")
displacement = np.zeros((mesh.n_points, 3))
# ...prescribe values on the boundary indices you care about...

# Default Laplacian
moved_lap = mesh.mmg.move(displacement, propagate=True)

# Elasticity-based propagation (requires fedoo)
moved_ela = mesh.mmg.move(
    displacement,
    propagate=True,
    propagation_method="elasticity",
)
```

## Installing the `fedoo` extra

<!-- mmgpy-test:skip -->

```bash
uv sync --extra fem
# or
pip install "mmgpy[fem]"
```

`fedoo` is an optional dependency; mmgpy still imports cleanly without it
and the Laplacian path keeps working. Only `propagate_displacement_elasticity`
and `propagation_method="elasticity"` need it.

### conda-forge users

`fedoo` is published on PyPI but not on conda-forge, so the `[fem]` extra
isn't reachable via `conda install mmgpy`. Install fedoo separately into
the same environment:

<!-- mmgpy-test:skip -->

```bash
conda install -c conda-forge mmgpy
pip install fedoo                # PyPI (recommended)
# or:
conda install -c set3MAH fedoo   # the upstream maintainers' personal channel
```

## See also

- [API reference: Lagrangian Motion](../api/lagrangian.md) for the full
  function signatures and accessor options.
- [Hessian-Based Adaptation](hessian-adaptation.md) — the natural
  follow-up: after deforming a mesh you may want to refine where a
  solution field has high curvature.
