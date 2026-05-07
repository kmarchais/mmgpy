# Mesh Classes

!!! warning "Deprecated in 0.12, removed in 0.13"
`mmgpy.Mesh` and `mmgpy.MeshCheckpoint` are deprecated. New code should use the `.mmg` PyVista accessor (`pv.read("foo.mesh").mmg.remesh(...)`). See the [migration guide](../migrating-from-mesh.md) for a method-by-method mapping. `MeshKind` survives in 0.13 and is still returned by `dataset.mmg.kind`.

## Unified Mesh Class

::: mmgpy.Mesh
options:
members: - **init** - kind - save - get_vertices - get_triangles - get_tetrahedra - get_edges - remesh - remesh_optimize - remesh_uniform - remesh_levelset - remesh_lagrangian - validate - to_pyvista - set_size_sphere - set_size_box - set_size_cylinder - set_size_from_point - clear_local_sizing - get_local_sizing_count

## Mesh Kind Enumeration

::: mmgpy.MeshKind
options:
show_root_heading: true

## Legacy Usage Examples

The snippets below illustrate the deprecated `Mesh` API. For new code, see [`pyvista-integration.md`](../tutorials/pyvista-integration.md) and the [migration guide](../migrating-from-mesh.md).

### Creating Meshes

<!-- pytest-codeblocks:skip -->

```python
import mmgpy
import numpy as np

mesh = mmgpy.Mesh("input.mesh")  # deprecated — use pv.read("input.mesh")

vertices = np.array(
    [[0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1]],
    dtype=np.float64,
)
tetrahedra = np.array([[0, 1, 2, 3]], dtype=np.int32)
mesh = mmgpy.Mesh(vertices, tetrahedra)  # deprecated
```

### Checking Mesh Type

<!-- pytest-codeblocks:skip -->

```python
from mmgpy import MeshKind

mesh = mmgpy.Mesh(vertices, tetrahedra)  # deprecated

if mesh.kind == MeshKind.TETRAHEDRAL:
    print("3D volume mesh")
elif mesh.kind == MeshKind.TRIANGULAR_2D:
    print("2D planar mesh")
elif mesh.kind == MeshKind.TRIANGULAR_SURFACE:
    print("3D surface mesh")
```

### Remeshing

<!-- pytest-codeblocks:skip -->

```python
from mmgpy import Mmg3DOptions

opts = Mmg3DOptions(hmax=0.1, hausd=0.001)
result = mesh.remesh(opts)  # deprecated; prefer pv_dataset.mmg.remesh(opts)
```

### Validation

<!-- pytest-codeblocks:skip -->

```python
report = mesh.validate(detailed=True)  # deprecated; prefer dataset.mmg.validate(detailed=True)
```
