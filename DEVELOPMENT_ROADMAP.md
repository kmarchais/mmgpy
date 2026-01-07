# mmgpy Development Roadmap

> Last updated: 2026-01-07

## Recently Completed

| Feature                  | PR  | Description                                                   |
| ------------------------ | --- | ------------------------------------------------------------- |
| Mesh validation          | #88 | `mesh.validate()` with geometry, topology, and quality checks |
| RemeshResult dataclass   | #87 | Rich return values with topology, quality, and timing stats   |
| Unified Mesh class       | #85 | Single `Mesh` class with auto-detection via `MeshKind` enum   |
| Unified mesh I/O         | #83 | `mmgpy.read()` for any format (meshio + PyVista)              |
| Typed options            | #80 | `Mmg3DOptions`, `Mmg2DOptions`, `MmgSOptions` dataclasses     |
| ARM64 Linux wheels       | #82 | aarch64 manylinux wheel builds                                |
| Local parameters         | #81 | Per-region sizing control                                     |
| PyVista integration      | #69 | `from_pyvista()`, `to_pyvista()` conversions                  |
| Level-set discretization | #68 | `remesh_levelset()` for isosurface extraction                 |
| Progress callbacks       | #65 | Real-time progress events during remeshing                    |
| Topology queries         | #64 | Vertex/edge/face neighbor lookups                             |

---

## Open GitHub Issues

| Issue                                               | Description                    |
| --------------------------------------------------- | ------------------------------ |
| [#44](https://github.com/kmarchais/mmgpy/issues/44) | Reduce pre-commit rule ignores |

---

## Pending Features by Priority

### 🟠 High Priority

| Feature           | Description | Recommended Next |
| ----------------- | ----------- | ---------------- |
| API documentation | MkDocs site | ⭐ Yes           |

### 🟡 Medium Priority

| Feature            | Description      |
| ------------------ | ---------------- |
| CONTRIBUTING guide | Development docs |

### 🟢 Low Priority

| Feature                      | Description                                                      |
| ---------------------------- | ---------------------------------------------------------------- |
| Simplify executable wrappers | Install MMG executables directly to venv/bin instead of wrappers |
| Context manager              | `with MmgMesh() as m:`                                           |
| Performance benchmarks       | pytest-benchmark                                                 |
| ParMmg integration           | Parallel remeshing                                               |

---

## Recommended Next: API Documentation

**Why:** The library has grown significantly with typed options, unified Mesh class, validation, and RemeshResult. Users need comprehensive API documentation to discover and use these features effectively.

**Scope:**

- MkDocs site with Material theme
- Auto-generated API reference from docstrings
- Usage examples for common workflows
- Tutorial notebooks

**Implementation:**

1. Set up MkDocs with mkdocstrings plugin
2. Configure API reference generation
3. Write getting started guide
4. Add example gallery (remeshing, validation, PyVista integration)
5. Deploy to GitHub Pages
