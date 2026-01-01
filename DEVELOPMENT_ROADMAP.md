# mmgpy Development Roadmap

> Last updated: 2026-01-01

## Open GitHub Issues

| Issue                                               | Description                    |
| --------------------------------------------------- | ------------------------------ |
| [#44](https://github.com/kmarchais/mmgpy/issues/44) | Reduce pre-commit rule ignores |

---

## Pending Features by Priority

### 🟠 High Priority

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

| Feature                | Description            |
| ---------------------- | ---------------------- |
| RemeshResult dataclass | Rich return values     |
| Context manager        | `with MmgMesh() as m:` |
| Performance benchmarks | pytest-benchmark       |
| ARM64 Linux wheels     | aarch64 support        |
| ParMmg integration     | Parallel remeshing     |
