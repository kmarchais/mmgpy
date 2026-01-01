# mmgpy Development Roadmap

> Last updated: 2026-01-01

## Recently Completed

| Feature                  | PR  | Description                                   |
| ------------------------ | --- | --------------------------------------------- |
| Level-set discretization | #68 | `remesh_levelset()` for isosurface extraction |
| Progress callbacks       | #65 | Real-time progress events during remeshing    |
| Topology queries         | #64 | Vertex/edge/face neighbor lookups             |

---

## Open GitHub Issues

| Issue                                               | Description                    |
| --------------------------------------------------- | ------------------------------ |
| [#44](https://github.com/kmarchais/mmgpy/issues/44) | Reduce pre-commit rule ignores |

---

## Pending Features by Priority

### 🟠 High Priority

| Feature                    | Description                      | Recommended Next |
| -------------------------- | -------------------------------- | ---------------- |
| PyVista/meshio integration | `from_pyvista()`, `to_pyvista()` | ⭐ Yes           |
| Typed options              | `TypedDict` for discoverability  |                  |

### 🟡 Medium Priority

| Feature             | Description       |
| ------------------- | ----------------- |
| Gmsh format support | `.msh` files      |
| Local parameters    | Per-region sizing |
| Mesh validation     | `mesh.validate()` |
| API documentation   | MkDocs site       |
| CONTRIBUTING guide  | Development docs  |

### 🟢 Low Priority

| Feature                | Description            |
| ---------------------- | ---------------------- |
| RemeshResult dataclass | Rich return values     |
| Context manager        | `with MmgMesh() as m:` |
| Performance benchmarks | pytest-benchmark       |
| ARM64 Linux wheels     | aarch64 support        |
| ParMmg integration     | Parallel remeshing     |

---

## Recommended Next: PyVista Integration

**Why:** Examples already use PyVista extensively for visualization. Adding native integration eliminates boilerplate and makes mmgpy a natural fit in the PyVista ecosystem.

**Scope:**

```python
# Target API
from mmgpy import MmgMesh3D
import pyvista as pv

# Load from PyVista
grid = pv.read("model.vtk")
mesh = MmgMesh3D.from_pyvista(grid)

# Remesh and export back
mesh.remesh(hmax=0.1)
result = mesh.to_pyvista()  # Returns pv.UnstructuredGrid
```

**Implementation:**

1. Add `from_pyvista()` class methods to `MmgMesh3D`, `MmgMesh2D`, `MmgMeshS`
2. Add `to_pyvista()` instance methods returning appropriate PyVista types
3. Handle field data transfer (scalars, vectors, tensors)
4. Make PyVista an optional dependency (soft import)
5. Add tests and update examples to use the new API
