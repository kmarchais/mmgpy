# mmgpy Development Roadmap

> Last updated: 2026-01-01

## Open GitHub Issues

| Issue                                               | Description                    | Status  |
| --------------------------------------------------- | ------------------------------ | ------- |
| [#44](https://github.com/kmarchais/mmgpy/issues/44) | Reduce pre-commit rule ignores |         |
| [#47](https://github.com/kmarchais/mmgpy/issues/47) | Migrate to Trusted Publishing  | ✅ Done |
| [#41](https://github.com/kmarchais/mmgpy/issues/41) | Optimize wheel sizes           | ✅ Done |

---

## Pending Features by Priority

### 🟠 High Priority

#### ~~In-Memory Remeshing API~~ ✅ Done

```python
mesh = MmgMesh3D(vertices, elements)
mesh.remesh(hmax=0.1, verbose=False)  # No temp files, kwargs API
```

#### Element Attributes

```python
mesh.set_corner(vertex_indices)
mesh.set_required_vertices(indices)
mesh.set_ridge_edges(indices)
```

#### Topology Queries

```python
mesh.get_adjacent_elements(idx)
mesh.get_vertex_neighbors(idx)
mesh.get_element_quality(idx)
```

#### Level-Set Discretization

```python
mmg3d.remesh_levelset(mesh, levelset, metric)
```

#### ~~Lagrangian Motion~~ ✅ Done

Two approaches available:

**1. Pure Python (works everywhere, no extra dependencies):**

```python
from mmgpy import MmgMesh3D, move_mesh

mesh = MmgMesh3D(vertices, elements)
move_mesh(mesh, displacement, hmax=0.1, verbose=False)

# With boundary propagation (Laplacian smoothing):
move_mesh(mesh, displacement, boundary_mask=boundary_mask, propagate=True)
```

**2. C++ (requires ELAS library):**

```python
mesh = MmgMesh3D(vertices, elements)
mesh.remesh_lagrangian(displacement, hmax=0.1, verbose=False)
```

> **Note:** The C++ method requires building with `USE_ELAS=ON` in CMake (disabled by default).
> The Python `move_mesh()` function works on all platforms without additional dependencies.

### 🟡 Medium Priority

| Feature                    | Description                      |
| -------------------------- | -------------------------------- |
| PyVista/meshio integration | `from_pyvista()`, `to_pyvista()` |
| Typed options              | `TypedDict` for discoverability  |
| Gmsh format support        | `.msh` files                     |
| Local parameters           | Per-region sizing                |
| Mesh validation            | `mesh.validate()`                |
| API documentation          | MkDocs site                      |
| CONTRIBUTING guide         | Development docs                 |

### 🟢 Low Priority

| Feature                | Description             |
| ---------------------- | ----------------------- |
| Progress callback      | Long operation feedback |
| RemeshResult dataclass | Rich return values      |
| Context manager        | `with MmgMesh() as m:`  |
| Performance benchmarks | pytest-benchmark        |
| ARM64 Linux wheels     | aarch64 support         |
| ParMmg integration     | Parallel remeshing      |

---

## Code Quality Items

| Priority | Item                                       | Location                                 | Status    |
| -------- | ------------------------------------------ | ---------------------------------------- | --------- |
| 🟡       | ~~Initialize `success = false` in switch~~ | ~~`mmg3d.cpp`, `mmg2d.cpp`, `mmgs.cpp`~~ | ✅ Done   |
| 🟡       | ~~Centralize VTK version string~~          | ~~Multiple files~~                       | ✅ PR #61 |
| 🟢       | Use `logging` module                       | `__init__.py`                            |           |
