# Migrating from `mmgpy.Mesh` to the `.mmg` accessor

`mmgpy.Mesh` is deprecated in 0.12 and will be removed in 0.13. The replacement is the PyVista 0.48 dataset accessor that ships with mmgpy:

```python
import pyvista as pv
import mmgpy  # noqa: F401  -- registers the accessor

mesh = pv.read("brain.mesh")          # uses mmgpy's Medit reader plugin
remeshed = mesh.mmg.remesh(hsiz=0.1)  # accessor-driven remeshing
mesh.save("out.mesh")                 # uses mmgpy's Medit writer plugin
```

Every MMG-specific operation that used to live on `Mesh` now lives on the accessor; everything else (vertex coordinates, cell connectivity, geometry queries, `.save()`, `.plot()`, scalar field storage) is available through PyVista's native API.

## Quick reference

| `Mesh` method                                                  | Replacement                                                                       |
| -------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `Mesh(pv_dataset)`                                             | `pv_dataset` directly — no wrapper needed                                         |
| `mesh.kind`                                                    | `dataset.mmg.kind`                                                                |
| `mesh.remesh(**opts)`                                          | `new = dataset.mmg.remesh(**opts)`                                                |
| `mesh.remesh_lagrangian(displacement, **opts)`                 | `new = dataset.mmg.remesh_lagrangian(displacement, **opts)`                       |
| `mesh.remesh_levelset(levelset, **opts)`                       | `new = dataset.mmg.remesh_levelset(levelset, **opts)`                             |
| `mesh.remesh_optimize(**opts)`                                 | `new = dataset.mmg.remesh_optimize(**opts)`                                       |
| `mesh.remesh_uniform(size, **opts)`                            | `new = dataset.mmg.remesh_uniform(size, **opts)`                                  |
| `mesh.set_size_sphere(...)` etc. + `mesh.remesh()`             | `dataset.mmg.remesh(local_sizing=[{"shape": "sphere", ...}])`                     |
| `mesh.load_sol(path)`                                          | `dataset.mmg.load_sol(path)`                                                      |
| `mesh.save_sol(path)`                                          | `dataset.mmg.save_sol(path)`                                                      |
| `mesh.validate(detailed=True)`                                 | `dataset.mmg.validate(detailed=True)`                                             |
| `mesh.get_element_quality(idx)`                                | `dataset.mmg.element_quality(idx)`                                                |
| `mesh.get_element_qualities()`                                 | `dataset.mmg.element_qualities()`                                                 |
| `mesh.get_adjacent_elements(idx)`                              | `dataset.mmg.adjacent_elements(idx)`                                              |
| `mesh.get_vertex_neighbors(idx)`                               | `dataset.mmg.vertex_neighbors(idx)`                                               |
| `mesh.get_center_of_mass()`                                    | `dataset.mmg.center_of_mass()`                                                    |
| `mesh.get_vertices()` / `mesh.set_vertices(v)`                 | `dataset.points` (read/write)                                                     |
| `mesh.get_triangles()` / `mesh.get_tetrahedra()`               | `dataset.cells_dict[pv.CellType.TRIANGLE]` / `[pv.CellType.TETRA]`                |
| `mesh.get_edges()`                                             | `dataset.cells_dict[pv.CellType.LINE]` (when `include_edges=True`)                |
| `mesh.compute_volume()`                                        | `dataset.volume` (tet meshes)                                                     |
| `mesh.compute_surface_area()`                                  | `dataset.area`                                                                    |
| `mesh.get_bounds()`                                            | `dataset.bounds` (note: returns `(xmin, xmax, ymin, ymax, zmin, zmax)`)           |
| `mesh.get_diagonal()`                                          | `np.linalg.norm(np.array(dataset.bounds[1::2]) - np.array(dataset.bounds[0::2]))` |
| `mesh["metric"] = arr`                                         | `dataset.point_data["metric"] = arr`                                              |
| `mesh["temperature"] = arr`                                    | `dataset.point_data["temperature"] = arr`                                         |
| `mesh.set_user_field(name, arr)` / `mesh.get_user_field(name)` | `dataset.point_data[name]`                                                        |
| `mesh.to_pyvista()` / `mesh.vtk`                               | `dataset` (already PyVista)                                                       |
| `mesh.plot(**kwargs)`                                          | `dataset.plot(**kwargs)`                                                          |
| `mesh.save(path)`                                              | `dataset.save(path)` (mmgpy's writer plugin handles `.mesh`/`.meshb`)             |
| `mesh.copy()`                                                  | `dataset.copy()`                                                                  |
| `mesh.checkpoint()`                                            | snapshot via `snap = dataset.copy()`, reassign on success (see below)             |

## Three concrete migrations

### 1. Read, remesh, save

<!-- pytest-codeblocks:skip -->

```python
# Before
import mmgpy
mesh = mmgpy.Mesh("brain.mesh")
mesh.remesh(hsiz=0.1)
mesh.save("brain_fine.mesh")

# After
import pyvista as pv
import mmgpy  # noqa: F401  -- registers reader/writer plugins + accessor
mesh = pv.read("brain.mesh")
remeshed = mesh.mmg.remesh(hsiz=0.1)
remeshed.save("brain_fine.mesh")
```

### 2. Local sizing

<!-- pytest-codeblocks:skip -->

```python
# Before
mesh = mmgpy.Mesh(vertices, triangles)
mesh.set_size_sphere(center=[0, 0, 0], radius=0.3, size=0.05)
mesh.set_size_box(bounds=[[0.5, 0, 0], [1, 0.5, 0]], size=0.02)
mesh.remesh(hsiz=0.2)

# After
import pyvista as pv
grid = pv.UnstructuredGrid({pv.CellType.TETRA: triangles}, vertices)
remeshed = grid.mmg.remesh(
    hsiz=0.2,
    local_sizing=[
        {"shape": "sphere", "center": (0, 0, 0), "radius": 0.3, "size": 0.05},
        {"shape": "box", "bounds": [[0.5, 0, 0], [1, 0.5, 0]], "size": 0.02},
    ],
)
```

### 3. Checkpoint / rollback

<!-- pytest-codeblocks:skip -->

```python
# Before — Mesh.checkpoint with auto-rollback on exception
mesh = mmgpy.Mesh("brain.mesh")
with mesh.checkpoint() as snap:
    mesh.remesh(hsiz=0.01)
    if not mesh.validate():
        raise RuntimeError  # auto-rollback
    snap.commit()  # keep the result

# After — explicit snapshot, reassign on success
mesh = pv.read("brain.mesh")
snap = mesh.copy()
try:
    candidate = mesh.mmg.remesh(hsiz=0.01)
    if not candidate.mmg.validate():
        raise RuntimeError
    mesh = candidate
except Exception:
    mesh = snap  # roll back
    raise
```

The accessor returns a fresh dataset on every call, so you never need to undo anything: just don't reassign on failure.

## Subtle differences

- **`mesh.get_center_of_mass()` was volume- (3D) or area-weighted (2D/surface). PyVista's `dataset.center` is the unweighted arithmetic mean of point coordinates.** Use `dataset.mmg.center_of_mass()` to get the same number you had before.
- **`mesh.get_*_neighbors(idx)` and `mesh.get_adjacent_elements(idx)` use 1-based indexing (MMG convention).** PyVista's `dataset.point_neighbors(idx)` and `dataset.cell_neighbors(idx)` use 0-based indexing (VTK convention) and may use a different adjacency rule. If you need MMG's exact behavior, use the accessor methods (`dataset.mmg.vertex_neighbors`, `dataset.mmg.adjacent_elements`).
- **MMG-specific point_data fields (`metric`, `displacement`, `levelset`, `tensor`)** survive on the dataset's `point_data` and are picked up automatically by `dataset.mmg.remesh*`. Set them with `dataset.point_data["metric"] = my_array`. Scalar fields can be 1D `(n,)`; the accessor reshapes to `(n, 1)` internally.

## Removal timeline

- **0.12 (now)**: `DeprecationWarning` on `Mesh` instantiation and `Mesh.checkpoint()`. Internal mmgpy code paths are silent.
- **0.13**: `Mesh` and `MeshCheckpoint` removed. `MeshKind` survives (still returned by `dataset.mmg.kind`).
