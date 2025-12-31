# mmgpy Development Roadmap

> Last updated: 2025-12-31

## Progress Summary

**11 PRs merged** (#48-60) bringing MMG API coverage from ~5% to ~25%.

| Milestone                        | Status                        |
| -------------------------------- | ----------------------------- |
| v0.2.0 - Stability & Compliance  | ✅ Complete                   |
| v0.3.0 - Testing & Documentation | 🟡 In Progress (2 items left) |
| v0.4.0 - Advanced Features       | ⏳ Planned                    |

---

## v0.3.0 Remaining Items

- [x] **Add CHANGELOG.md** - Document PRs #48-60
- [ ] **Set up Trusted Publishing** - Configure on PyPI (#47)

---

## Open GitHub Issues

| Issue                                               | Description                    |
| --------------------------------------------------- | ------------------------------ |
| [#47](https://github.com/kmarchais/mmgpy/issues/47) | Migrate to Trusted Publishing  |
| [#44](https://github.com/kmarchais/mmgpy/issues/44) | Reduce pre-commit rule ignores |
| [#41](https://github.com/kmarchais/mmgpy/issues/41) | Optimize wheel sizes           |

---

## Pending Features by Priority

### 🟠 High Priority

#### In-Memory Remeshing API

```python
mesh = MmgMesh(vertices, elements)
result = mmg3d.remesh(mesh, options={"hmax": 0.1})  # No temp files
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

#### Lagrangian Motion

```python
mmg3d.remesh_with_motion(mesh, displacement)
```

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

| Priority | Item                                   | Location                                         |
| -------- | -------------------------------------- | ------------------------------------------------ |
| 🟡       | Initialize `success = false` in switch | `mmg3d.cpp:187`, `mmg2d.cpp:215`, `mmgs.cpp:195` |
| 🟡       | Centralize VTK version string          | Multiple files                                   |
| 🟡       | Add CI dependency caching              | Workflows                                        |
| 🟢       | Use `logging` module                   | `__init__.py`                                    |

---

## Future Milestones

### v0.4.0 - Advanced Features

- Element attributes (corner, ridge, required)
- Topology queries (adjacency, quality)
- In-memory remeshing
- Mesh validation

### v0.5.0 - Integrations

- PyVista/meshio integration
- Lagrangian motion (`mmg3dmov`)
- Level-set discretization (`mmg3dls`)
- Gmsh format support

### v1.0.0 - Feature Complete

- 60%+ MMG API coverage
- Full documentation
- Stable API

---

## Quick Reference: What's Been Done

<details>
<summary>Merged PRs (click to expand)</summary>

| PR  | Description                     |
| --- | ------------------------------- |
| #48 | MIT license                     |
| #49 | Memory safety fix               |
| #52 | Low-level mesh API              |
| #53 | C-contiguity validation         |
| #54 | Tensor metric support           |
| #55 | MMGS test suite                 |
| #56 | README Linux update             |
| #57 | Quality test fix                |
| #58 | Remove deprecated workflows     |
| #59 | RECORD file + skip selector fix |
| #60 | Test cleanup with tmp_path      |

</details>
