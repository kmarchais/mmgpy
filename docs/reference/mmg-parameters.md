# MMG Parameters Reference

```python
import pyvista as pv
import mmgpy  # noqa: F401  -- registers reader/writer + .mmg accessor
mesh = pv.read("input.mesh")
```

Complete reference for the keyword arguments accepted by `dataset.mmg.remesh(...)` (and its variants `remesh_optimize`, `remesh_uniform`, `remesh_levelset`, `move`). Each call returns a fresh PyVista dataset; the input is not mutated.

## Native parameter files

All three engines accept MMG's native local-parameter files through the
`parameter_file` keyword. Pass a `.mmg3d` file for tetrahedral meshes, a
`.mmg2d` file for planar meshes, or a `.mmgs` file for surface meshes:

<!-- mmgpy-test:skip -->

```python
from pathlib import Path

parameter_file = Path("local.mmg3d")
remeshed = mesh.mmg.remesh(
    parameter_file=parameter_file,
    verbose=-1,
)
```

The same keyword is available on `Mesh.remesh(...)`,
`Mesh.remesh_levelset(...)`, and the file APIs such as
`mmgpy.mmg3d.remesh("in.mesh", "out.mesh", parameter_file=parameter_file)`.
Both strings and path-like objects are accepted. Missing or unreadable files
raise a `RuntimeError` before remeshing starts.

mmgpy uses the same parser for all three engines and applies the parsed values
through each engine's public MMG setters.

MMG parameter files define local sizing by entity reference. For example, this
`.mmg3d` file targets tetrahedra whose reference is `7`:

```text
parameters
1
7 tetrahedra 0.02 0.08 0.01
```

The final three values are `hmin`, `hmax`, and `hausd`. MMG3D accepts
`triangle(s)` and `tetrahedron(s)` references, MMG2D accepts `edge(s)` and
`triangle(s)`, and MMGS accepts `triangle(s)`. Native `lsreferences` and
`lsbasereferences` sections are supported as well.

Parameter files are parsed first. Explicit Python options are applied second,
so Python settings take precedence when both configure the same MMG parameter.

## Size Parameters

### hmin

Minimum edge length.

| Property | Value         |
| -------- | ------------- |
| Type     | `float`       |
| Default  | Auto-computed |
| Range    | > 0           |

```python
remeshed = mesh.mmg.remesh(hmin=0.01)
```

Edges shorter than `hmin` will be collapsed or lengthened.

---

### hmax

Maximum edge length.

| Property | Value         |
| -------- | ------------- |
| Type     | `float`       |
| Default  | Auto-computed |
| Range    | > hmin        |

```python
remeshed = mesh.mmg.remesh(hmax=0.1)
```

Edges longer than `hmax` will be split.

---

### hsiz

Uniform target edge size.

| Property | Value   |
| -------- | ------- |
| Type     | `float` |
| Default  | None    |
| Range    | > 0     |

```python
remeshed = mesh.mmg.remesh(hsiz=0.05)
```

When set, overrides `hmin` and `hmax` with uniform sizing.

---

### hgrad

Gradation parameter controlling size transition.

| Property | Value   |
| -------- | ------- |
| Type     | `float` |
| Default  | 1.3     |
| Range    | >= 1.0  |

```python
remeshed = mesh.mmg.remesh(hgrad=1.2)
```

- `hgrad=1.0`: No size variation allowed
- `hgrad=1.3`: Default, allows 30% size change between adjacent edges
- `hgrad=2.0`: Large size variations allowed

---

## Geometric Parameters

### hausd

Hausdorff distance, maximum distance between input and output geometry.

| Property | Value                         |
| -------- | ----------------------------- |
| Type     | `float`                       |
| Default  | 0.01 \* bounding box diagonal |
| Range    | > 0                           |

```python
remeshed = mesh.mmg.remesh(hausd=0.001)
```

Smaller values produce a closer geometric approximation at the cost of more elements.

---

### ar

Ridge detection angle (degrees).

| Property | Value   |
| -------- | ------- |
| Type     | `float` |
| Default  | 45.0    |
| Range    | 0 - 180 |

```python
remeshed = mesh.mmg.remesh(ar=30)
```

- Edges with dihedral angle greater than `ar` are treated as ridges and preserved during remeshing.
- `ar=180` effectively disables ridge detection. The typed
  `detect_ridges=False` option is the explicit equivalent of CLI `-nr`.

---

### detect_ridges

Enable ridge detection in typed options. `None` leaves MMG's default
unchanged; `False` maps to `MMG*_IPARAM_angle=0` (CLI `-nr`).

```python
from mmgpy import Mmg3DOptions

remeshed = mesh.mmg.remesh(Mmg3DOptions(detect_ridges=False, hmax=0.1))
```

---

## Control Flags

### surface_only

Restrict level-set discretization to the mesh boundary. This keyword is available only
on `remesh_levelset(...)`.

| Property    | Value                                |
| ----------- | ------------------------------------ |
| Type        | `bool`                               |
| Default     | `False`                              |
| MMG mapping | `-lssurf`; `MMG*_IPARAM_isosurf = 1` |

<!-- mmgpy-test:skip -->

```python
boundary_split = mesh.mmg.remesh_levelset(levelset, surface_only=True)
```

For MMG3D this splits boundary faces without splitting the interior volume into
level-set regions. MMG2D and MMGS apply the mode to boundary or referenced edges.

---

### optim

Enable optimization mode (no topology changes).

| Property | Value           |
| -------- | --------------- |
| Type     | `int`           |
| Default  | 0               |
| Values   | 0 (off), 1 (on) |

```python
remeshed = mesh.mmg.remesh(optim=1)
```

When enabled, only moves vertices to improve quality.

---

### noinsert

Disable vertex insertion.

| Property | Value           |
| -------- | --------------- |
| Type     | `int`           |
| Default  | 0               |
| Values   | 0 (off), 1 (on) |

```python
remeshed = mesh.mmg.remesh(noinsert=1)
```

Prevents adding new vertices during remeshing.

---

### noswap

Disable edge/face swapping.

```python
remeshed = mesh.mmg.remesh(noswap=1)
```

Prevents topology changes via edge/face swaps.

---

### nomove

Disable vertex movement.

```python
remeshed = mesh.mmg.remesh(nomove=1)
```

Keeps vertices at their original positions.

---

### nosurf

Preserve surface vertices.

```python
remeshed = mesh.mmg.remesh(nosurf=1)
```

Prevents modification of surface mesh vertices.

---

## Output Control

### verbose

Verbosity level.

| Property | Value    |
| -------- | -------- |
| Type     | `int`    |
| Default  | 1        |
| Range    | -1 to 10 |

```python
silent = mesh.mmg.remesh(verbose=-1)  # Silent
errors = mesh.mmg.remesh(verbose=0)   # Errors only
info = mesh.mmg.remesh(verbose=1)     # Standard info
debug = mesh.mmg.remesh(verbose=5)    # Debug output
```

---

## Common Combinations

### Quality optimization only

```python
optimized = mesh.mmg.remesh(optim=1, noinsert=1)
```

Or use the convenience method:

```python
optimized = mesh.mmg.remesh_optimize()
```

---

### Uniform remeshing

```python
uniform = mesh.mmg.remesh(hsiz=0.05)
```

Or use the convenience method:

```python
uniform = mesh.mmg.remesh_uniform(size=0.05)
```

---

### High-quality surface approximation

```python
remeshed = mesh.mmg.remesh(
    hmax=0.1,
    hausd=0.0001,  # Tight geometric tolerance
    hgrad=1.1,     # Smooth size transition
)
```

---

### Preserve sharp features

```python
remeshed = mesh.mmg.remesh(
    hmax=0.1,
    ar=20,         # Detect more ridges
    hausd=0.001,
)
```

---

### Fast coarse remeshing

```python
remeshed = mesh.mmg.remesh(
    hmax=0.5,
    hgrad=2.0,     # Allow large size variations
    verbose=-1,
)
```

---

### Volume interior only

```python
remeshed = mesh.mmg.remesh(
    hmax=0.1,
    nosurf=1,      # Keep surface fixed
)
```

---

## Parameter Interactions

| Parameters                   | Effect                    |
| ---------------------------- | ------------------------- |
| `optim=1, noinsert=1`        | Quality optimization only |
| `hmin=hmax`                  | Near-uniform sizing       |
| `hausd` small + `hmax` large | More elements on surface  |
| `ar=180`                     | No ridge preservation     |
| `hgrad=1.0`                  | No size gradation         |

## Best Practices

1. **Start with defaults**, MMG auto-computes reasonable values.
2. **Set `hmax` first**, it is the most important parameter.
3. **Add `hausd` for surfaces**, it controls geometric fidelity.
4. **Tune `hgrad`**, lower values give smoother transitions.
5. **Use `verbose=-1`** for batch processing.
6. **Validate results** with `dataset.mmg.validate(detailed=True)` after remeshing.
