# mmgpy Development Roadmap

> Last updated: 2026-01-01

## Recently Completed

| Feature                  | PR  | Description                                   |
| ------------------------ | --- | --------------------------------------------- |
| PyVista integration      | #69 | `from_pyvista()`, `to_pyvista()` conversions  |
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

| Feature       | Description                     | Recommended Next |
| ------------- | ------------------------------- | ---------------- |
| Typed options | `TypedDict` for discoverability | ⭐ Yes           |

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

## Recommended Next: Typed Options

**Why:** The current `remesh()` methods accept `**kwargs` with no IDE autocompletion or type checking. Adding `TypedDict` definitions would improve developer experience with better discoverability and validation.

**Scope:**

```python
# Target API
from mmgpy import MmgMesh3D, Mmg3DOptions

# With TypedDict, IDE shows available options
options: Mmg3DOptions = {
    "hmin": 0.01,
    "hmax": 0.1,
    "hausd": 0.001,
    "hgrad": 1.3,
}
mesh.remesh(**options)

# Or directly with autocomplete
mesh.remesh(hmin=0.01, hmax=0.1, hausd=0.001)
```

**Implementation:**

1. Define `TypedDict` classes for each mesh type's options (`Mmg3DOptions`, `Mmg2DOptions`, `MmgSOptions`)
2. Update method signatures to use these types
3. Add validation for invalid option names
4. Document all options with docstrings
5. Ensure backward compatibility with existing code
