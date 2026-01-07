# MMG Parameters Reference

Complete reference for all MMG remeshing parameters.

## Size Parameters

### hmin

Minimum edge length.

| Property | Value         |
| -------- | ------------- |
| Type     | `float`       |
| Default  | Auto-computed |
| Range    | > 0           |

```python
result = mesh.remesh(hmin=0.01)
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
result = mesh.remesh(hmax=0.1)
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
result = mesh.remesh(hsiz=0.05)
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
result = mesh.remesh(hgrad=1.2)
```

- `hgrad=1.0`: No size variation allowed
- `hgrad=1.3`: Default, allows 30% size change between adjacent edges
- `hgrad=2.0`: Large size variations allowed

---

## Geometric Parameters

### hausd

Hausdorff distance - maximum distance between input and output geometry.

| Property | Value                         |
| -------- | ----------------------------- |
| Type     | `float`                       |
| Default  | 0.01 \* bounding box diagonal |
| Range    | > 0                           |

```python
result = mesh.remesh(hausd=0.001)
```

Smaller values = better geometric approximation but more elements.

---

### angle

Ridge detection angle in degrees.

| Property | Value   |
| -------- | ------- |
| Type     | `float` |
| Default  | 45.0    |
| Range    | 0 - 180 |

```python
result = mesh.remesh(angle=30.0)
```

- Edges with dihedral angle > `angle` are treated as ridges
- Ridges are preserved during remeshing
- `angle=180`: No ridge detection

---

## Control Flags

### optim

Enable optimization mode.

| Property | Value           |
| -------- | --------------- |
| Type     | `int`           |
| Default  | 0               |
| Values   | 0 (off), 1 (on) |

```python
result = mesh.remesh(optim=1)
```

When enabled, only moves vertices to improve quality (no topology changes).

---

### noinsert

Disable vertex insertion.

| Property | Value           |
| -------- | --------------- |
| Type     | `int`           |
| Default  | 0               |
| Values   | 0 (off), 1 (on) |

```python
result = mesh.remesh(noinsert=1)
```

Prevents adding new vertices during remeshing.

---

### noswap

Disable edge/face swapping.

| Property | Value           |
| -------- | --------------- |
| Type     | `int`           |
| Default  | 0               |
| Values   | 0 (off), 1 (on) |

```python
result = mesh.remesh(noswap=1)
```

Prevents topology changes via edge/face swaps.

---

### nomove

Disable vertex movement.

| Property | Value           |
| -------- | --------------- |
| Type     | `int`           |
| Default  | 0               |
| Values   | 0 (off), 1 (on) |

```python
result = mesh.remesh(nomove=1)
```

Keeps vertices at their original positions.

---

### nosurf

Preserve surface vertices.

| Property | Value           |
| -------- | --------------- |
| Type     | `int`           |
| Default  | 0               |
| Values   | 0 (off), 1 (on) |

```python
result = mesh.remesh(nosurf=1)
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
result = mesh.remesh(verbose=-1)  # Silent
result = mesh.remesh(verbose=0)   # Errors only
result = mesh.remesh(verbose=1)   # Standard info
result = mesh.remesh(verbose=5)   # Debug output
```

---

## Common Combinations

### Quality Optimization Only

```python
result = mesh.remesh(optim=1, noinsert=1)
```

Or use the convenience method:

```python
result = mesh.remesh_optimize()
```

---

### Uniform Remeshing

```python
result = mesh.remesh(hsiz=0.05)
```

Or use the convenience method:

```python
result = mesh.remesh_uniform(size=0.05)
```

---

### High-Quality Surface Approximation

```python
result = mesh.remesh(
    hmax=0.1,
    hausd=0.0001,  # Tight geometric tolerance
    hgrad=1.1,     # Smooth size transition
)
```

---

### Preserve Sharp Features

```python
result = mesh.remesh(
    hmax=0.1,
    angle=20.0,  # Detect more ridges
    hausd=0.001,
)
```

---

### Fast Coarse Remeshing

```python
result = mesh.remesh(
    hmax=0.5,
    hgrad=2.0,  # Allow large size variations
    verbose=-1,
)
```

---

### Volume Interior Only

```python
result = mesh.remesh(
    hmax=0.1,
    nosurf=1,  # Keep surface fixed
)
```

---

## Parameter Interactions

| Parameters                   | Effect                    |
| ---------------------------- | ------------------------- |
| `optim=1, noinsert=1`        | Quality optimization only |
| `hmin=hmax`                  | Near-uniform sizing       |
| `hausd` small + `hmax` large | More elements on surface  |
| `angle=180`                  | No ridge preservation     |
| `hgrad=1.0`                  | No size gradation         |

## Best Practices

1. **Start with defaults**: MMG auto-computes reasonable defaults
2. **Set `hmax` first**: Most important parameter
3. **Add `hausd` for surfaces**: Controls geometric fidelity
4. **Tune `hgrad`**: Lower for smoother transitions
5. **Use `verbose=-1`**: For batch processing
6. **Validate results**: Always check mesh quality after remeshing
