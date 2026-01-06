# mmgpy Development Roadmap

> Last updated: 2026-01-06

## Recently Completed

| Feature                  | PR  | Description                                                 |
| ------------------------ | --- | ----------------------------------------------------------- |
| Unified Mesh class       | #84 | Single `Mesh` class with auto-detection via `MeshKind` enum |
| Unified mesh I/O         | #83 | `mmgpy.read()` for any format (meshio + PyVista)            |
| Typed options            | #80 | `Mmg3DOptions`, `Mmg2DOptions`, `MmgSOptions` dataclasses   |
| ARM64 Linux wheels       | #82 | aarch64 manylinux wheel builds                              |
| Local parameters         | #81 | Per-region sizing control                                   |
| PyVista integration      | #69 | `from_pyvista()`, `to_pyvista()` conversions                |
| Level-set discretization | #68 | `remesh_levelset()` for isosurface extraction               |
| Progress callbacks       | #65 | Real-time progress events during remeshing                  |
| Topology queries         | #64 | Vertex/edge/face neighbor lookups                           |

---

## Open GitHub Issues

| Issue                                               | Description                    |
| --------------------------------------------------- | ------------------------------ |
| [#44](https://github.com/kmarchais/mmgpy/issues/44) | Reduce pre-commit rule ignores |

---

## Pending Features by Priority

### 🟠 High Priority

| Feature         | Description       | Recommended Next |
| --------------- | ----------------- | ---------------- |
| Mesh validation | `mesh.validate()` | ⭐ Yes           |

### 🟡 Medium Priority

| Feature            | Description      |
| ------------------ | ---------------- |
| API documentation  | MkDocs site      |
| CONTRIBUTING guide | Development docs |

### 🟢 Low Priority

| Feature                | Description            |
| ---------------------- | ---------------------- |
| RemeshResult dataclass | Rich return values     |
| Context manager        | `with MmgMesh() as m:` |
| Performance benchmarks | pytest-benchmark       |
| ParMmg integration     | Parallel remeshing     |

---

## Recommended Next: Mesh Validation

**Why:** Users need to validate mesh quality before and after remeshing operations. A `validate()` method would check for common mesh issues like inverted elements, non-manifold edges, or disconnected components.

**Scope:**

```python
from mmgpy import Mesh

mesh = Mesh(vertices, cells)

# Validate mesh and get report
issues = mesh.validate()
if issues:
    print(f"Found {len(issues)} issues")
    for issue in issues:
        print(f"  - {issue}")
```

**Implementation:**

1. Define validation checks (inverted elements, quality thresholds, etc.)
2. Implement `validate()` method returning list of issues
3. Add element quality computation (already partially done via `get_element_qualities()`)
4. Consider adding auto-fix capabilities for simple issues
5. Add tests for various mesh defect scenarios
