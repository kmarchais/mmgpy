# MMG C API Binding Coverage

This document tracks every public function in the MMG C library and whether it has a
corresponding Python binding in mmgpy. Functions are sourced from the official MMG headers
(`libmmg2d.h`, `libmmg3d.h`, `libmmgs.h`).

## Coverage Summary

| Library | Total | Bound | Indirect | Not Bound | Functional Coverage |
| ------- | ----: | ----: | -------: | --------: | ------------------: |
| MMG3D   |   142 |    60 |       26 |        56 |                 61% |
| MMG2D   |   119 |    51 |       15 |        53 |                 55% |
| MMGS    |   110 |    49 |       12 |        49 |                 55% |

**Functional coverage** = (Bound + Indirect) / Total. "Indirect" means the functionality
is available in the Python API through an alternative implementation (e.g. direct struct
access or reimplementation).

Many "not bound" functions fall into categories that are intentionally excluded:

- **Bulk variants**: Individual element setters/getters are used in loops instead of bulk
  C functions, or bulk getters access internal structures directly. The Python API still
  exposes bulk operations (e.g. `set_vertices()`, `get_triangles()`).
- **Format-specific I/O**: mmgpy uses `loadMesh`/`saveMesh` (Medit format) at the C level;
  other formats (VTK, Gmsh, etc.) are handled at the Python level via PyVista.
- **Internal/implicit**: Functions called internally by other bound functions
  (e.g. `Init_fileNames` is called by `Init_mesh`).
- **CLI utilities**: Command-line parsing and help functions irrelevant to a Python library.
- **Granular memory management**: `Free_all` is used instead of individual free functions.

## Status Legend

| Status    | Meaning                                                                                                                           |
| --------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Bound     | C function is directly called in the pybind11 bindings                                                                            |
| Indirect  | Functionality is available via alternative implementation (direct struct access, reimplementation, or loop over individual calls) |
| Not bound | Functionality is not exposed to Python                                                                                            |

---

## MMG3D (3D Volumetric Mesh)

### Initialization & Memory Management

| Function                | Status    | Notes                                                 |
| ----------------------- | --------- | ----------------------------------------------------- |
| `MMG3D_Init_mesh`       | Bound     | `MmgMesh3D()` constructor; `mmg3d.remesh()`           |
| `MMG3D_Init_fileNames`  | Not bound | Called internally by `Init_mesh`                      |
| `MMG3D_Init_parameters` | Not bound | Called internally by `Init_mesh`                      |
| `MMG3D_Free_all`        | Bound     | Called in `MmgMesh3D` destructor and `mmg3d.remesh()` |
| `MMG3D_Free_structures` | Not bound | `Free_all` used instead                               |
| `MMG3D_Free_names`      | Not bound | `Free_all` used instead                               |
| `MMG3D_Free_allSols`    | Not bound | `Free_all` used instead                               |
| `MMG3D_Free_solutions`  | Not bound | `Free_all` used instead                               |

### Mesh Size & Validation

| Function                 | Status    | Notes                                                |
| ------------------------ | --------- | ---------------------------------------------------- |
| `MMG3D_Set_meshSize`     | Bound     | `MmgMesh3D.set_mesh_size()`                          |
| `MMG3D_Get_meshSize`     | Bound     | `MmgMesh3D.get_mesh_size()`                          |
| `MMG3D_Chk_meshData`     | Not bound | Called internally by MMG before remeshing            |
| `MMG3D_Set_constantSize` | Not bound | Could be useful; use `hsiz` parameter as alternative |

### Vertex Operations

| Function                   | Status    | Notes                                                          |
| -------------------------- | --------- | -------------------------------------------------------------- |
| `MMG3D_Set_vertex`         | Bound     | `MmgMesh3D.set_vertex()` and loops in `set_vertices()`         |
| `MMG3D_Set_vertices`       | Indirect  | `set_vertices()` loops over `Set_vertex` instead               |
| `MMG3D_Get_vertex`         | Bound     | `MmgMesh3D.get_vertex()` (by iteration index)                  |
| `MMG3D_GetByIdx_vertex`    | Bound     | Used in `get_vertex()` (by absolute index)                     |
| `MMG3D_Get_vertices`       | Indirect  | `get_vertices()` accesses struct directly                      |
| `MMG3D_Add_vertex`         | Not bound | Dynamic vertex addition; could be useful for mesh construction |
| `MMG3D_Set_normalAtVertex` | Bound     | `MmgMesh3D.set_normal_at_vertices()`                           |
| `MMG3D_Get_normalAtVertex` | Bound     | `MmgMesh3D.get_normal_at_vertices()`                           |

### Tetrahedron Operations

| Function                       | Status    | Notes                                                           |
| ------------------------------ | --------- | --------------------------------------------------------------- |
| `MMG3D_Set_tetrahedron`        | Bound     | `MmgMesh3D.set_tetrahedron()` and loops in `set_tetrahedra()`   |
| `MMG3D_Set_tetrahedra`         | Indirect  | `set_tetrahedra()` loops over `Set_tetrahedron` instead         |
| `MMG3D_Get_tetrahedron`        | Bound     | `MmgMesh3D.get_tetrahedron()`                                   |
| `MMG3D_Get_tetrahedra`         | Indirect  | `get_tetrahedra()` accesses struct directly                     |
| `MMG3D_Get_tetrahedronQuality` | Bound     | `MmgMesh3D.get_element_quality()` / `get_element_qualities()`   |
| `MMG3D_Add_tetrahedron`        | Not bound | Dynamic element addition; could be useful for mesh construction |

### Triangle Operations

| Function              | Status   | Notes                                                     |
| --------------------- | -------- | --------------------------------------------------------- |
| `MMG3D_Set_triangle`  | Bound    | `MmgMesh3D.set_triangle()` and loops in `set_triangles()` |
| `MMG3D_Set_triangles` | Indirect | `set_triangles()` loops over `Set_triangle` instead       |
| `MMG3D_Get_triangle`  | Bound    | `MmgMesh3D.get_triangle()`                                |
| `MMG3D_Get_triangles` | Indirect | `get_triangles()` accesses struct directly                |

### Prism Operations

| Function           | Status   | Notes                                                 |
| ------------------ | -------- | ----------------------------------------------------- |
| `MMG3D_Set_prism`  | Bound    | `MmgMesh3D.set_prism()` and loops in `set_prisms()`   |
| `MMG3D_Set_prisms` | Indirect | `set_prisms()` loops over `Set_prism` instead         |
| `MMG3D_Get_prism`  | Indirect | `get_prism()` / `get_prisms()` access struct directly |
| `MMG3D_Get_prisms` | Indirect | `get_prisms()` accesses struct directly               |

### Quadrilateral Operations

| Function                   | Status   | Notes                                                                 |
| -------------------------- | -------- | --------------------------------------------------------------------- |
| `MMG3D_Set_quadrilateral`  | Bound    | `MmgMesh3D.set_quadrilateral()` and loops in `set_quadrilaterals()`   |
| `MMG3D_Set_quadrilaterals` | Indirect | `set_quadrilaterals()` loops over `Set_quadrilateral` instead         |
| `MMG3D_Get_quadrilateral`  | Indirect | `get_quadrilateral()` / `get_quadrilaterals()` access struct directly |
| `MMG3D_Get_quadrilaterals` | Indirect | `get_quadrilaterals()` accesses struct directly                       |

### Edge Operations

| Function          | Status   | Notes                                             |
| ----------------- | -------- | ------------------------------------------------- |
| `MMG3D_Set_edge`  | Bound    | `MmgMesh3D.set_edge()` and loops in `set_edges()` |
| `MMG3D_Set_edges` | Indirect | `set_edges()` loops over `Set_edge` instead       |
| `MMG3D_Get_edge`  | Bound    | `MmgMesh3D.get_edge()`                            |
| `MMG3D_Get_edges` | Indirect | `get_edges()` accesses struct directly            |

### Element Attributes

| Function                          | Status   | Notes                                           |
| --------------------------------- | -------- | ----------------------------------------------- |
| `MMG3D_Set_corner`                | Bound    | Used in `MmgMesh3D.set_corners()`               |
| `MMG3D_Unset_corner`              | Bound    | Used in `MmgMesh3D.unset_corners()`             |
| `MMG3D_Set_requiredVertex`        | Bound    | Used in `MmgMesh3D.set_required_vertices()`     |
| `MMG3D_Unset_requiredVertex`      | Bound    | Used in `MmgMesh3D.unset_required_vertices()`   |
| `MMG3D_Set_requiredTetrahedron`   | Bound    | Used in `MmgMesh3D.set_required_tetrahedra()`   |
| `MMG3D_Unset_requiredTetrahedron` | Bound    | Used in `MmgMesh3D.unset_required_tetrahedra()` |
| `MMG3D_Set_requiredTetrahedra`    | Indirect | Loops over `Set_requiredTetrahedron` instead    |
| `MMG3D_Unset_requiredTetrahedra`  | Indirect | Loops over `Unset_requiredTetrahedron` instead  |
| `MMG3D_Set_requiredTriangle`      | Bound    | Used in `MmgMesh3D.set_required_triangles()`    |
| `MMG3D_Unset_requiredTriangle`    | Bound    | Used in `MmgMesh3D.unset_required_triangles()`  |
| `MMG3D_Set_requiredTriangles`     | Indirect | Loops over `Set_requiredTriangle` instead       |
| `MMG3D_Unset_requiredTriangles`   | Indirect | Loops over `Unset_requiredTriangle` instead     |
| `MMG3D_Set_requiredEdge`          | Bound    | Used in `MmgMesh3D.set_required_edges()`        |
| `MMG3D_Unset_requiredEdge`        | Bound    | Used in `MmgMesh3D.unset_required_edges()`      |
| `MMG3D_Set_ridge`                 | Bound    | Used in `MmgMesh3D.set_ridge_edges()`           |
| `MMG3D_Unset_ridge`               | Bound    | Used in `MmgMesh3D.unset_ridge_edges()`         |
| `MMG3D_Set_parallelTriangle`      | Bound    | Used in `MmgMesh3D.set_parallel_triangles()`    |
| `MMG3D_Unset_parallelTriangle`    | Bound    | Used in `MmgMesh3D.unset_parallel_triangles()`  |
| `MMG3D_Set_parallelTriangles`     | Indirect | Loops over `Set_parallelTriangle` instead       |
| `MMG3D_Unset_parallelTriangles`   | Indirect | Loops over `Unset_parallelTriangle` instead     |

### Solution / Metric Fields

| Function               | Status    | Notes                                                   |
| ---------------------- | --------- | ------------------------------------------------------- |
| `MMG3D_Set_solSize`    | Bound     | Called internally when setting fields via `set_field()` |
| `MMG3D_Get_solSize`    | Not bound | Could be useful for querying solution state             |
| `MMG3D_Set_scalarSol`  | Indirect  | `Set_scalarSols` (bulk) used instead                    |
| `MMG3D_Set_scalarSols` | Bound     | Used in `set_field("metric")` / `set_field("levelset")` |
| `MMG3D_Get_scalarSol`  | Indirect  | `Get_scalarSols` (bulk) used instead                    |
| `MMG3D_Get_scalarSols` | Bound     | Used in `get_field("metric")` / `get_field("levelset")` |
| `MMG3D_Set_vectorSol`  | Indirect  | `Set_vectorSols` (bulk) used instead                    |
| `MMG3D_Set_vectorSols` | Bound     | Used in `set_field("displacement")`                     |
| `MMG3D_Get_vectorSol`  | Indirect  | `Get_vectorSols` (bulk) used instead                    |
| `MMG3D_Get_vectorSols` | Bound     | Used in `get_field("displacement")`                     |
| `MMG3D_Set_tensorSol`  | Indirect  | `Set_tensorSols` (bulk) used instead                    |
| `MMG3D_Set_tensorSols` | Bound     | Used in `set_field("tensor")`                           |
| `MMG3D_Get_tensorSol`  | Indirect  | `Get_tensorSols` (bulk) used instead                    |
| `MMG3D_Get_tensorSols` | Bound     | Used in `get_field("tensor")`                           |

### Multi-Solution Support

| Function                             | Status    | Notes                                          |
| ------------------------------------ | --------- | ---------------------------------------------- |
| `MMG3D_Set_solsAtVerticesSize`       | Not bound | Needed for multiple solution fields per vertex |
| `MMG3D_Get_solsAtVerticesSize`       | Not bound | Query multi-solution dimensions                |
| `MMG3D_Set_ithSol_inSolsAtVertices`  | Not bound | Set individual values in multi-solution        |
| `MMG3D_Set_ithSols_inSolsAtVertices` | Not bound | Set bulk values in multi-solution              |
| `MMG3D_Get_ithSol_inSolsAtVertices`  | Not bound | Get individual values from multi-solution      |
| `MMG3D_Get_ithSols_inSolsAtVertices` | Not bound | Get bulk values from multi-solution            |

### Parameters

| Function                     | Status    | Notes                                                          |
| ---------------------------- | --------- | -------------------------------------------------------------- |
| `MMG3D_Set_iparameter`       | Bound     | Used in `remesh()` for integer options                         |
| `MMG3D_Set_dparameter`       | Bound     | Used in `remesh()` for float options (hmin, hmax, etc.)        |
| `MMG3D_Get_iparameter`       | Not bound | Reading back parameter values; could be useful                 |
| `MMG3D_Set_localParameter`   | Bound     | `MmgMesh3D.set_local_parameters()`                             |
| `MMG3D_Set_multiMat`         | Bound     | `MmgMesh3D.set_multi_materials()`                              |
| `MMG3D_Set_lsBaseReference`  | Bound     | `MmgMesh3D.set_ls_base_references()`                           |
| `MMG3D_Set_handGivenMesh`    | Not bound | Tells MMG the mesh was built programmatically; could be useful |
| `MMG3D_switch_metricStorage` | Not bound | Advanced metric storage control                                |

### I/O Configuration

| Function                   | Status    | Notes                                                 |
| -------------------------- | --------- | ----------------------------------------------------- |
| `MMG3D_Set_inputMeshName`  | Bound     | Used in `mmg3d.remesh()` file-based API               |
| `MMG3D_Set_outputMeshName` | Bound     | Used in `mmg3d.remesh()` file-based API               |
| `MMG3D_Set_inputSolName`   | Bound     | Used in `mmg3d.remesh()` file-based API               |
| `MMG3D_Set_outputSolName`  | Bound     | Used in `mmg3d.remesh()` file-based API               |
| `MMG3D_Set_inputParamName` | Not bound | For MMG `.mmg3d` parameter files; not commonly needed |

### File I/O

| Function                        | Status    | Notes                                                           |
| ------------------------------- | --------- | --------------------------------------------------------------- |
| `MMG3D_loadMesh`                | Bound     | Used in `mmg3d.remesh()` and `MmgMesh3D(filename)`              |
| `MMG3D_saveMesh`                | Bound     | Used in `mmg3d.remesh()` and `MmgMesh3D.save()`                 |
| `MMG3D_loadSol`                 | Bound     | Used in `mmg3d.remesh()` and `MmgMesh3D.load_sol()`             |
| `MMG3D_saveSol`                 | Bound     | Used in `mmg3d.remesh()` and `MmgMesh3D.save_sol()`             |
| `MMG3D_loadGenericMesh`         | Not bound | Auto-detect format; `loadMesh` used + PyVista for other formats |
| `MMG3D_saveGenericMesh`         | Not bound | Auto-detect format; `saveMesh` used + PyVista for other formats |
| `MMG3D_loadMshMesh`             | Not bound | Gmsh format; handled by PyVista instead                         |
| `MMG3D_loadMshMesh_and_allData` | Not bound | Gmsh format with all data                                       |
| `MMG3D_saveMshMesh`             | Not bound | Gmsh format output                                              |
| `MMG3D_saveMshMesh_and_allData` | Not bound | Gmsh format with all data                                       |
| `MMG3D_loadVtkMesh`             | Not bound | VTK format; handled by PyVista instead                          |
| `MMG3D_loadVtkMesh_and_allData` | Not bound | VTK format with all data                                        |
| `MMG3D_saveVtkMesh`             | Not bound | VTK format output                                               |
| `MMG3D_saveVtkMesh_and_allData` | Not bound | VTK format with all data                                        |
| `MMG3D_loadVtuMesh`             | Not bound | VTU format; handled by PyVista instead                          |
| `MMG3D_loadVtuMesh_and_allData` | Not bound | VTU format with all data                                        |
| `MMG3D_saveVtuMesh`             | Not bound | VTU format output                                               |
| `MMG3D_saveVtuMesh_and_allData` | Not bound | VTU format with all data                                        |
| `MMG3D_loadAllSols`             | Not bound | Multi-solution file loading                                     |
| `MMG3D_saveAllSols`             | Not bound | Multi-solution file saving                                      |
| `MMG3D_saveTetgenMesh`          | Not bound | TetGen format output                                            |

### Topology Queries

| Function                            | Status | Notes                                  |
| ----------------------------------- | ------ | -------------------------------------- |
| `MMG3D_Get_adjaTet`                 | Bound  | `MmgMesh3D.get_adjacent_elements()`    |
| `MMG3D_Get_tetFromTria`             | Bound  | `MmgMesh3D.get_tet_from_tria()`        |
| `MMG3D_Get_tetsFromTria`            | Bound  | `MmgMesh3D.get_tets_from_tria()`       |
| `MMG3D_Get_numberOfNonBdyTriangles` | Bound  | Used in `get_non_boundary_triangles()` |
| `MMG3D_Get_nonBdyTriangle`          | Bound  | Used in `get_non_boundary_triangles()` |

### Remeshing Functions

| Function         | Status | Notes                                     |
| ---------------- | ------ | ----------------------------------------- |
| `MMG3D_mmg3dlib` | Bound  | `MmgMesh3D.remesh()` (standard remeshing) |
| `MMG3D_mmg3dls`  | Bound  | `MmgMesh3D.remesh_levelset()`             |
| `MMG3D_mmg3dmov` | Bound  | `MmgMesh3D.remesh_lagrangian()`           |

### CLI & Internal Utilities

| Function               | Status    | Notes                                                 |
| ---------------------- | --------- | ----------------------------------------------------- |
| `MMG3D_defaultValues`  | Not bound | Prints default values to stdout; CLI utility          |
| `MMG3D_parsar`         | Not bound | Command-line argument parser; not relevant for Python |
| `MMG3D_parsop`         | Not bound | Parameter file parser; not relevant for Python        |
| `MMG3D_usage`          | Not bound | Prints usage text; CLI utility                        |
| `MMG3D_Set_commonFunc` | Not bound | Internal MMG function pointer setup                   |
| `MMG3D_setfunc`        | Not bound | Internal function pointer initialization              |
| `MMG3D_stockOptions`   | Not bound | Internal: saves options to mesh structure             |
| `MMG3D_destockOptions` | Not bound | Internal: restores options from mesh structure        |
| `MMG3D_Compute_eigenv` | Not bound | Eigenvalue utility; rarely needed from Python         |
| `MMG3D_Clean_isoSurf`  | Not bound | Internal cleanup after level-set discretization       |
| `MMG3D_hashTetra`      | Not bound | Internal hash table construction                      |
| `MMG3D_searchqua`      | Not bound | Internal: search for worst quality elements           |
| `MMG3D_searchlen`      | Not bound | Internal: search for worst edge lengths               |
| `MMG3D_mmg3dcheck`     | Not bound | Internal mesh consistency check                       |

### Function Pointers

| Function           | Status    | Notes                                                                                   |
| ------------------ | --------- | --------------------------------------------------------------------------------------- |
| `MMG3D_doSol`      | Not bound | External function pointer for custom solution computation; advanced C-level callback    |
| `MMG3D_lenedgCoor` | Not bound | External function pointer for custom edge length computation; advanced C-level callback |

---

## MMG2D (2D Planar Mesh)

### Initialization & Memory Management

| Function                | Status    | Notes                                                 |
| ----------------------- | --------- | ----------------------------------------------------- |
| `MMG2D_Init_mesh`       | Bound     | `MmgMesh2D()` constructor; `mmg2d.remesh()`           |
| `MMG2D_Init_fileNames`  | Not bound | Called internally by `Init_mesh`                      |
| `MMG2D_Init_parameters` | Not bound | Called internally by `Init_mesh`                      |
| `MMG2D_Free_all`        | Bound     | Called in `MmgMesh2D` destructor and `mmg2d.remesh()` |
| `MMG2D_Free_structures` | Not bound | `Free_all` used instead                               |
| `MMG2D_Free_names`      | Not bound | `Free_all` used instead                               |
| `MMG2D_Free_allSols`    | Not bound | `Free_all` used instead                               |
| `MMG2D_Free_solutions`  | Not bound | `Free_all` used instead                               |
| `MMG2D_Free_triangles`  | Not bound | `Free_all` used instead                               |
| `MMG2D_Free_edges`      | Not bound | `Free_all` used instead                               |

### Mesh Size & Validation

| Function                 | Status    | Notes                                                |
| ------------------------ | --------- | ---------------------------------------------------- |
| `MMG2D_Set_meshSize`     | Bound     | `MmgMesh2D.set_mesh_size()`                          |
| `MMG2D_Get_meshSize`     | Bound     | `MmgMesh2D.get_mesh_size()`                          |
| `MMG2D_Chk_meshData`     | Not bound | Called internally by MMG before remeshing            |
| `MMG2D_Set_constantSize` | Not bound | Could be useful; use `hsiz` parameter as alternative |

### Vertex Operations

| Function                   | Status    | Notes                                                  |
| -------------------------- | --------- | ------------------------------------------------------ |
| `MMG2D_Set_vertex`         | Bound     | `MmgMesh2D.set_vertex()` and loops in `set_vertices()` |
| `MMG2D_Set_vertices`       | Indirect  | `set_vertices()` loops over `Set_vertex` instead       |
| `MMG2D_Get_vertex`         | Bound     | `MmgMesh2D.get_vertex()` (by iteration index)          |
| `MMG2D_GetByIdx_vertex`    | Bound     | Used in `get_vertex()` (by absolute index)             |
| `MMG2D_Get_vertices`       | Indirect  | `get_vertices()` accesses struct directly              |
| `MMG2D_Reset_verticestags` | Not bound | Resets all vertex tags; niche use case                 |

### Triangle Operations

| Function                    | Status   | Notes                                                         |
| --------------------------- | -------- | ------------------------------------------------------------- |
| `MMG2D_Set_triangle`        | Bound    | `MmgMesh2D.set_triangle()` and loops in `set_triangles()`     |
| `MMG2D_Set_triangles`       | Indirect | `set_triangles()` loops over `Set_triangle` instead           |
| `MMG2D_Get_triangle`        | Bound    | `MmgMesh2D.get_triangle()`                                    |
| `MMG2D_Get_triangles`       | Indirect | `get_triangles()` accesses struct directly                    |
| `MMG2D_Get_triangleQuality` | Bound    | `MmgMesh2D.get_element_quality()` / `get_element_qualities()` |

### Quadrilateral Operations

| Function                   | Status   | Notes                                                               |
| -------------------------- | -------- | ------------------------------------------------------------------- |
| `MMG2D_Set_quadrilateral`  | Bound    | `MmgMesh2D.set_quadrilateral()` and loops in `set_quadrilaterals()` |
| `MMG2D_Set_quadrilaterals` | Indirect | `set_quadrilaterals()` loops over `Set_quadrilateral` instead       |
| `MMG2D_Get_quadrilateral`  | Indirect | `get_quadrilateral()` accesses struct directly                      |
| `MMG2D_Get_quadrilaterals` | Indirect | `get_quadrilaterals()` accesses struct directly                     |

### Edge Operations

| Function          | Status   | Notes                                             |
| ----------------- | -------- | ------------------------------------------------- |
| `MMG2D_Set_edge`  | Bound    | `MmgMesh2D.set_edge()` and loops in `set_edges()` |
| `MMG2D_Set_edges` | Indirect | `set_edges()` loops over `Set_edge` instead       |
| `MMG2D_Get_edge`  | Bound    | `MmgMesh2D.get_edge()`                            |
| `MMG2D_Get_edges` | Indirect | `get_edges()` accesses struct directly            |

### Element Attributes

| Function                       | Status | Notes                                          |
| ------------------------------ | ------ | ---------------------------------------------- |
| `MMG2D_Set_corner`             | Bound  | Used in `MmgMesh2D.set_corners()`              |
| `MMG2D_Unset_corner`           | Bound  | Used in `MmgMesh2D.unset_corners()`            |
| `MMG2D_Set_requiredVertex`     | Bound  | Used in `MmgMesh2D.set_required_vertices()`    |
| `MMG2D_Unset_requiredVertex`   | Bound  | Used in `MmgMesh2D.unset_required_vertices()`  |
| `MMG2D_Set_requiredTriangle`   | Bound  | Used in `MmgMesh2D.set_required_triangles()`   |
| `MMG2D_Unset_requiredTriangle` | Bound  | Used in `MmgMesh2D.unset_required_triangles()` |
| `MMG2D_Set_requiredEdge`       | Bound  | Used in `MmgMesh2D.set_required_edges()`       |
| `MMG2D_Unset_requiredEdge`     | Bound  | Used in `MmgMesh2D.unset_required_edges()`     |
| `MMG2D_Set_parallelEdge`       | Bound  | Used in `MmgMesh2D.set_parallel_edges()`       |

### Solution / Metric Fields

| Function               | Status    | Notes                                                   |
| ---------------------- | --------- | ------------------------------------------------------- |
| `MMG2D_Set_solSize`    | Bound     | Called internally when setting fields via `set_field()` |
| `MMG2D_Get_solSize`    | Not bound | Could be useful for querying solution state             |
| `MMG2D_Set_scalarSol`  | Indirect  | `Set_scalarSols` (bulk) used instead                    |
| `MMG2D_Set_scalarSols` | Bound     | Used in `set_field("metric")` / `set_field("levelset")` |
| `MMG2D_Get_scalarSol`  | Indirect  | `Get_scalarSols` (bulk) used instead                    |
| `MMG2D_Get_scalarSols` | Bound     | Used in `get_field("metric")` / `get_field("levelset")` |
| `MMG2D_Set_vectorSol`  | Indirect  | `Set_vectorSols` (bulk) used instead                    |
| `MMG2D_Set_vectorSols` | Bound     | Used in `set_field("displacement")`                     |
| `MMG2D_Get_vectorSol`  | Indirect  | `Get_vectorSols` (bulk) used instead                    |
| `MMG2D_Get_vectorSols` | Bound     | Used in `get_field("displacement")`                     |
| `MMG2D_Set_tensorSol`  | Indirect  | `Set_tensorSols` (bulk) used instead                    |
| `MMG2D_Set_tensorSols` | Bound     | Used in `set_field("tensor")`                           |
| `MMG2D_Get_tensorSol`  | Indirect  | `Get_tensorSols` (bulk) used instead                    |
| `MMG2D_Get_tensorSols` | Bound     | Used in `get_field("tensor")`                           |

### Multi-Solution Support

| Function                             | Status    | Notes                                          |
| ------------------------------------ | --------- | ---------------------------------------------- |
| `MMG2D_Set_solsAtVerticesSize`       | Not bound | Needed for multiple solution fields per vertex |
| `MMG2D_Get_solsAtVerticesSize`       | Not bound | Query multi-solution dimensions                |
| `MMG2D_Set_ithSol_inSolsAtVertices`  | Not bound | Set individual values in multi-solution        |
| `MMG2D_Set_ithSols_inSolsAtVertices` | Not bound | Set bulk values in multi-solution              |
| `MMG2D_Get_ithSol_inSolsAtVertices`  | Not bound | Get individual values from multi-solution      |
| `MMG2D_Get_ithSols_inSolsAtVertices` | Not bound | Get bulk values from multi-solution            |

### Parameters

| Function                    | Status | Notes                                                   |
| --------------------------- | ------ | ------------------------------------------------------- |
| `MMG2D_Set_iparameter`      | Bound  | Used in `remesh()` for integer options                  |
| `MMG2D_Set_dparameter`      | Bound  | Used in `remesh()` for float options (hmin, hmax, etc.) |
| `MMG2D_Set_localParameter`  | Bound  | `MmgMesh2D.set_local_parameters()`                      |
| `MMG2D_Set_multiMat`        | Bound  | `MmgMesh2D.set_multi_materials()`                       |
| `MMG2D_Set_lsBaseReference` | Bound  | `MmgMesh2D.set_ls_base_references()`                    |

### I/O Configuration

| Function                   | Status    | Notes                                                 |
| -------------------------- | --------- | ----------------------------------------------------- |
| `MMG2D_Set_inputMeshName`  | Bound     | Used in `mmg2d.remesh()` file-based API               |
| `MMG2D_Set_outputMeshName` | Bound     | Used in `mmg2d.remesh()` file-based API               |
| `MMG2D_Set_inputSolName`   | Bound     | Used in `mmg2d.remesh()` file-based API               |
| `MMG2D_Set_outputSolName`  | Bound     | Used in `mmg2d.remesh()` file-based API               |
| `MMG2D_Set_inputParamName` | Not bound | For MMG `.mmg2d` parameter files; not commonly needed |

### File I/O

| Function                        | Status    | Notes                                                           |
| ------------------------------- | --------- | --------------------------------------------------------------- |
| `MMG2D_loadMesh`                | Bound     | Used in `mmg2d.remesh()` and `MmgMesh2D(filename)`              |
| `MMG2D_saveMesh`                | Bound     | Used in `mmg2d.remesh()` and `MmgMesh2D.save()`                 |
| `MMG2D_loadSol`                 | Bound     | Used in `mmg2d.remesh()` and `MmgMesh2D.load_sol()`             |
| `MMG2D_saveSol`                 | Bound     | Used in `mmg2d.remesh()` and `MmgMesh2D.save_sol()`             |
| `MMG2D_loadGenericMesh`         | Not bound | Auto-detect format; `loadMesh` used + PyVista for other formats |
| `MMG2D_saveGenericMesh`         | Not bound | Auto-detect format; `saveMesh` used + PyVista for other formats |
| `MMG2D_loadMshMesh`             | Not bound | Gmsh format; handled by PyVista instead                         |
| `MMG2D_loadMshMesh_and_allData` | Not bound | Gmsh format with all data                                       |
| `MMG2D_saveMshMesh`             | Not bound | Gmsh format output                                              |
| `MMG2D_saveMshMesh_and_allData` | Not bound | Gmsh format with all data                                       |
| `MMG2D_loadVtkMesh`             | Not bound | VTK format; handled by PyVista instead                          |
| `MMG2D_loadVtkMesh_and_allData` | Not bound | VTK format with all data                                        |
| `MMG2D_saveVtkMesh`             | Not bound | VTK format output                                               |
| `MMG2D_saveVtkMesh_and_allData` | Not bound | VTK format with all data                                        |
| `MMG2D_loadVtpMesh`             | Not bound | VTP format; handled by PyVista instead                          |
| `MMG2D_loadVtpMesh_and_allData` | Not bound | VTP format with all data                                        |
| `MMG2D_saveVtpMesh`             | Not bound | VTP format output                                               |
| `MMG2D_saveVtpMesh_and_allData` | Not bound | VTP format with all data                                        |
| `MMG2D_loadVtuMesh`             | Not bound | VTU format; handled by PyVista instead                          |
| `MMG2D_loadVtuMesh_and_allData` | Not bound | VTU format with all data                                        |
| `MMG2D_saveVtuMesh`             | Not bound | VTU format output                                               |
| `MMG2D_saveVtuMesh_and_allData` | Not bound | VTU format with all data                                        |
| `MMG2D_loadVect`                | Not bound | Vector field loading (legacy)                                   |
| `MMG2D_saveVect`                | Not bound | Vector field saving (legacy)                                    |
| `MMG2D_loadAllSols`             | Not bound | Multi-solution file loading                                     |
| `MMG2D_saveAllSols`             | Not bound | Multi-solution file saving                                      |
| `MMG2D_saveTetgenMesh`          | Not bound | TetGen format output                                            |

### Topology Queries

| Function                        | Status    | Notes                                                               |
| ------------------------------- | --------- | ------------------------------------------------------------------- |
| `MMG2D_Get_adjaTri`             | Bound     | `MmgMesh2D.get_adjacent_elements()`                                 |
| `MMG2D_Get_adjaVertices`        | Not bound | Requires adjacency tables that may not be available after remeshing |
| `MMG2D_Get_adjaVerticesFast`    | Not bound | Same limitation as `Get_adjaVertices`                               |
| `MMG2D_Get_triFromEdge`         | Bound     | `MmgMesh2D.get_tri_from_edge()`                                     |
| `MMG2D_Get_trisFromEdge`        | Bound     | `MmgMesh2D.get_tris_from_edge()`                                    |
| `MMG2D_Get_numberOfNonBdyEdges` | Bound     | Used in `get_non_boundary_edges()`                                  |
| `MMG2D_Get_nonBdyEdge`          | Bound     | Used in `get_non_boundary_edges()`                                  |

### Remeshing Functions

| Function          | Status | Notes                                                                              |
| ----------------- | ------ | ---------------------------------------------------------------------------------- |
| `MMG2D_mmg2dlib`  | Bound  | `MmgMesh2D.remesh()` (standard remeshing)                                          |
| `MMG2D_mmg2dls`   | Bound  | `MmgMesh2D.remesh_levelset()`                                                      |
| `MMG2D_mmg2dmov`  | Bound  | `MmgMesh2D.remesh_lagrangian()`                                                    |
| `MMG2D_mmg2dmesh` | Bound  | Auto-selected by `remesh()` when mesh has no triangles (edge-only mesh generation) |

### CLI & Internal Utilities

| Function               | Status    | Notes                                                 |
| ---------------------- | --------- | ----------------------------------------------------- |
| `MMG2D_defaultValues`  | Not bound | Prints default values to stdout; CLI utility          |
| `MMG2D_parsar`         | Not bound | Command-line argument parser; not relevant for Python |
| `MMG2D_parsop`         | Not bound | Parameter file parser; not relevant for Python        |
| `MMG2D_usage`          | Not bound | Prints usage text; CLI utility                        |
| `MMG2D_Set_commonFunc` | Not bound | Internal MMG function pointer setup                   |
| `MMG2D_setfunc`        | Not bound | Internal function pointer initialization              |
| `MMG2D_Compute_eigenv` | Not bound | Eigenvalue utility; rarely needed from Python         |
| `MMG2D_scaleMesh`      | Not bound | Internal mesh scaling for numerical stability         |

### Function Pointers

| Function      | Status    | Notes                                                                                |
| ------------- | --------- | ------------------------------------------------------------------------------------ |
| `MMG2D_doSol` | Not bound | External function pointer for custom solution computation; advanced C-level callback |

---

## MMGS (Surface Mesh)

### Initialization & Memory Management

| Function               | Status    | Notes                                               |
| ---------------------- | --------- | --------------------------------------------------- |
| `MMGS_Init_mesh`       | Bound     | `MmgMeshS()` constructor; `mmgs.remesh()`           |
| `MMGS_Init_fileNames`  | Not bound | Called internally by `Init_mesh`                    |
| `MMGS_Init_parameters` | Not bound | Called internally by `Init_mesh`                    |
| `MMGS_Free_all`        | Bound     | Called in `MmgMeshS` destructor and `mmgs.remesh()` |
| `MMGS_Free_structures` | Not bound | `Free_all` used instead                             |
| `MMGS_Free_names`      | Not bound | `Free_all` used instead                             |
| `MMGS_Free_allSols`    | Not bound | `Free_all` used instead                             |
| `MMGS_Free_solutions`  | Not bound | `Free_all` used instead                             |

### Mesh Size & Validation

| Function                | Status    | Notes                                                |
| ----------------------- | --------- | ---------------------------------------------------- |
| `MMGS_Set_meshSize`     | Bound     | `MmgMeshS.set_mesh_size()`                           |
| `MMGS_Get_meshSize`     | Bound     | `MmgMeshS.get_mesh_size()`                           |
| `MMGS_Chk_meshData`     | Not bound | Called internally by MMG before remeshing            |
| `MMGS_Set_constantSize` | Not bound | Could be useful; use `hsiz` parameter as alternative |

### Vertex Operations

| Function                  | Status   | Notes                                                 |
| ------------------------- | -------- | ----------------------------------------------------- |
| `MMGS_Set_vertex`         | Bound    | `MmgMeshS.set_vertex()` and loops in `set_vertices()` |
| `MMGS_Set_vertices`       | Indirect | `set_vertices()` loops over `Set_vertex` instead      |
| `MMGS_Get_vertex`         | Bound    | `MmgMeshS.get_vertex()` (by iteration index)          |
| `MMGS_GetByIdx_vertex`    | Bound    | Used in `get_vertex()` (by absolute index)            |
| `MMGS_Get_vertices`       | Indirect | `get_vertices()` accesses struct directly             |
| `MMGS_Set_normalAtVertex` | Bound    | `MmgMeshS.set_normal_at_vertices()`                   |
| `MMGS_Get_normalAtVertex` | Bound    | `MmgMeshS.get_normal_at_vertices()`                   |

### Triangle Operations

| Function                   | Status   | Notes                                                                                                                             |
| -------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `MMGS_Set_triangle`        | Bound    | `MmgMeshS.set_triangle()` and loops in `set_triangles()`                                                                          |
| `MMGS_Set_triangles`       | Indirect | `set_triangles()` loops over `Set_triangle` instead                                                                               |
| `MMGS_Get_triangle`        | Bound    | `MmgMeshS.get_triangle()`                                                                                                         |
| `MMGS_Get_triangles`       | Indirect | `get_triangles()` accesses struct directly                                                                                        |
| `MMGS_Get_triangleQuality` | Bound    | `MmgMeshS.get_element_quality()` / `get_element_qualities()`. Manual fallback on Windows due to missing DLL export in MMG v5.8.0. |

### Edge Operations

| Function         | Status   | Notes                                            |
| ---------------- | -------- | ------------------------------------------------ |
| `MMGS_Set_edge`  | Bound    | `MmgMeshS.set_edge()` and loops in `set_edges()` |
| `MMGS_Set_edges` | Indirect | `set_edges()` loops over `Set_edge` instead      |
| `MMGS_Get_edge`  | Bound    | `MmgMeshS.get_edge()`                            |
| `MMGS_Get_edges` | Indirect | `get_edges()` accesses struct directly           |

### Element Attributes

| Function                      | Status | Notes                                         |
| ----------------------------- | ------ | --------------------------------------------- |
| `MMGS_Set_corner`             | Bound  | Used in `MmgMeshS.set_corners()`              |
| `MMGS_Unset_corner`           | Bound  | Used in `MmgMeshS.unset_corners()`            |
| `MMGS_Set_requiredVertex`     | Bound  | Used in `MmgMeshS.set_required_vertices()`    |
| `MMGS_Unset_requiredVertex`   | Bound  | Used in `MmgMeshS.unset_required_vertices()`  |
| `MMGS_Set_requiredTriangle`   | Bound  | Used in `MmgMeshS.set_required_triangles()`   |
| `MMGS_Unset_requiredTriangle` | Bound  | Used in `MmgMeshS.unset_required_triangles()` |
| `MMGS_Set_requiredEdge`       | Bound  | Used in `MmgMeshS.set_required_edges()`       |
| `MMGS_Unset_requiredEdge`     | Bound  | Used in `MmgMeshS.unset_required_edges()`     |
| `MMGS_Set_ridge`              | Bound  | Used in `MmgMeshS.set_ridge_edges()`          |
| `MMGS_Unset_ridge`            | Bound  | Used in `MmgMeshS.unset_ridge_edges()`        |

### Solution / Metric Fields

| Function              | Status    | Notes                                                   |
| --------------------- | --------- | ------------------------------------------------------- |
| `MMGS_Set_solSize`    | Bound     | Called internally when setting fields via `set_field()` |
| `MMGS_Get_solSize`    | Not bound | Could be useful for querying solution state             |
| `MMGS_Set_scalarSol`  | Indirect  | `Set_scalarSols` (bulk) used instead                    |
| `MMGS_Set_scalarSols` | Bound     | Used in `set_field("metric")` / `set_field("levelset")` |
| `MMGS_Get_scalarSol`  | Indirect  | `Get_scalarSols` (bulk) used instead                    |
| `MMGS_Get_scalarSols` | Bound     | Used in `get_field("metric")` / `get_field("levelset")` |
| `MMGS_Set_vectorSol`  | Indirect  | `Set_vectorSols` (bulk) used instead                    |
| `MMGS_Set_vectorSols` | Bound     | Used in `set_field("displacement")`                     |
| `MMGS_Get_vectorSol`  | Indirect  | `Get_vectorSols` (bulk) used instead                    |
| `MMGS_Get_vectorSols` | Bound     | Used in `get_field("displacement")`                     |
| `MMGS_Set_tensorSol`  | Indirect  | `Set_tensorSols` (bulk) used instead                    |
| `MMGS_Set_tensorSols` | Bound     | Used in `set_field("tensor")`                           |
| `MMGS_Get_tensorSol`  | Indirect  | `Get_tensorSols` (bulk) used instead                    |
| `MMGS_Get_tensorSols` | Bound     | Used in `get_field("tensor")`                           |

### Multi-Solution Support

| Function                            | Status    | Notes                                          |
| ----------------------------------- | --------- | ---------------------------------------------- |
| `MMGS_Set_solsAtVerticesSize`       | Not bound | Needed for multiple solution fields per vertex |
| `MMGS_Get_solsAtVerticesSize`       | Not bound | Query multi-solution dimensions                |
| `MMGS_Set_ithSol_inSolsAtVertices`  | Not bound | Set individual values in multi-solution        |
| `MMGS_Set_ithSols_inSolsAtVertices` | Not bound | Set bulk values in multi-solution              |
| `MMGS_Get_ithSol_inSolsAtVertices`  | Not bound | Get individual values from multi-solution      |
| `MMGS_Get_ithSols_inSolsAtVertices` | Not bound | Get bulk values from multi-solution            |

### Parameters

| Function                   | Status    | Notes                                                   |
| -------------------------- | --------- | ------------------------------------------------------- |
| `MMGS_Set_iparameter`      | Bound     | Used in `remesh()` for integer options                  |
| `MMGS_Set_dparameter`      | Bound     | Used in `remesh()` for float options (hmin, hmax, etc.) |
| `MMGS_Get_iparameter`      | Not bound | Reading back parameter values; could be useful          |
| `MMGS_Set_localParameter`  | Bound     | `MmgMeshS.set_local_parameters()`                       |
| `MMGS_Set_multiMat`        | Bound     | `MmgMeshS.set_multi_materials()`                        |
| `MMGS_Set_lsBaseReference` | Bound     | `MmgMeshS.set_ls_base_references()`                     |

### I/O Configuration

| Function                  | Status    | Notes                                                |
| ------------------------- | --------- | ---------------------------------------------------- |
| `MMGS_Set_inputMeshName`  | Bound     | Used in `mmgs.remesh()` file-based API               |
| `MMGS_Set_outputMeshName` | Bound     | Used in `mmgs.remesh()` file-based API               |
| `MMGS_Set_inputSolName`   | Bound     | Used in `mmgs.remesh()` file-based API               |
| `MMGS_Set_outputSolName`  | Bound     | Used in `mmgs.remesh()` file-based API               |
| `MMGS_Set_inputParamName` | Not bound | For MMG `.mmgs` parameter files; not commonly needed |

### File I/O

| Function                       | Status    | Notes                                                           |
| ------------------------------ | --------- | --------------------------------------------------------------- |
| `MMGS_loadMesh`                | Bound     | Used in `mmgs.remesh()` and `MmgMeshS(filename)`                |
| `MMGS_saveMesh`                | Bound     | Used in `mmgs.remesh()` and `MmgMeshS.save()`                   |
| `MMGS_loadSol`                 | Bound     | Used in `mmgs.remesh()` and `MmgMeshS.load_sol()`               |
| `MMGS_saveSol`                 | Bound     | Used in `mmgs.remesh()` and `MmgMeshS.save_sol()`               |
| `MMGS_loadGenericMesh`         | Not bound | Auto-detect format; `loadMesh` used + PyVista for other formats |
| `MMGS_saveGenericMesh`         | Not bound | Auto-detect format; `saveMesh` used + PyVista for other formats |
| `MMGS_loadMshMesh`             | Not bound | Gmsh format; handled by PyVista instead                         |
| `MMGS_loadMshMesh_and_allData` | Not bound | Gmsh format with all data                                       |
| `MMGS_saveMshMesh`             | Not bound | Gmsh format output                                              |
| `MMGS_saveMshMesh_and_allData` | Not bound | Gmsh format with all data                                       |
| `MMGS_loadVtkMesh`             | Not bound | VTK format; handled by PyVista instead                          |
| `MMGS_loadVtkMesh_and_allData` | Not bound | VTK format with all data                                        |
| `MMGS_saveVtkMesh`             | Not bound | VTK format output                                               |
| `MMGS_saveVtkMesh_and_allData` | Not bound | VTK format with all data                                        |
| `MMGS_loadVtpMesh`             | Not bound | VTP format; handled by PyVista instead                          |
| `MMGS_loadVtpMesh_and_allData` | Not bound | VTP format with all data                                        |
| `MMGS_saveVtpMesh`             | Not bound | VTP format output                                               |
| `MMGS_saveVtpMesh_and_allData` | Not bound | VTP format with all data                                        |
| `MMGS_loadVtuMesh`             | Not bound | VTU format; handled by PyVista instead                          |
| `MMGS_loadVtuMesh_and_allData` | Not bound | VTU format with all data                                        |
| `MMGS_saveVtuMesh`             | Not bound | VTU format output                                               |
| `MMGS_saveVtuMesh_and_allData` | Not bound | VTU format with all data                                        |
| `MMGS_loadAllSols`             | Not bound | Multi-solution file loading                                     |
| `MMGS_saveAllSols`             | Not bound | Multi-solution file saving                                      |

### Topology Queries

| Function                       | Status    | Notes                                                               |
| ------------------------------ | --------- | ------------------------------------------------------------------- |
| `MMGS_Get_adjaTri`             | Bound     | `MmgMeshS.get_adjacent_elements()`                                  |
| `MMGS_Get_adjaVerticesFast`    | Not bound | Requires adjacency tables that may not be available after remeshing |
| `MMGS_Get_numberOfNonBdyEdges` | Bound     | Used in `get_non_boundary_edges()`                                  |
| `MMGS_Get_nonBdyEdge`          | Bound     | Used in `get_non_boundary_edges()`                                  |

### Remeshing Functions

| Function       | Status | Notes                                            |
| -------------- | ------ | ------------------------------------------------ |
| `MMGS_mmgslib` | Bound  | `MmgMeshS.remesh()` (standard surface remeshing) |
| `MMGS_mmgsls`  | Bound  | `MmgMeshS.remesh_levelset()`                     |

### CLI & Internal Utilities

| Function              | Status    | Notes                                                 |
| --------------------- | --------- | ----------------------------------------------------- |
| `MMGS_defaultValues`  | Not bound | Prints default values to stdout; CLI utility          |
| `MMGS_parsar`         | Not bound | Command-line argument parser; not relevant for Python |
| `MMGS_usage`          | Not bound | Prints usage text; CLI utility                        |
| `MMGS_Set_commonFunc` | Not bound | Internal MMG function pointer setup                   |
| `MMGS_setfunc`        | Not bound | Internal function pointer initialization              |
| `MMGS_stockOptions`   | Not bound | Internal: saves options to mesh structure             |
| `MMGS_destockOptions` | Not bound | Internal: restores options from mesh structure        |
| `MMGS_Compute_eigenv` | Not bound | Eigenvalue utility; rarely needed from Python         |
| `MMGS_Clean_isoSurf`  | Not bound | Internal cleanup after level-set discretization       |

### Function Pointers

| Function     | Status    | Notes                                                                                |
| ------------ | --------- | ------------------------------------------------------------------------------------ |
| `MMGS_doSol` | Not bound | External function pointer for custom solution computation; advanced C-level callback |

---

## Potential Future Additions

Functions that could provide value if bound:

| Function Pattern                             | Libraries   | Rationale                                                                   |
| -------------------------------------------- | ----------- | --------------------------------------------------------------------------- |
| `*_Get_iparameter`                           | MMG3D, MMGS | Read back integer parameter values for debugging/introspection              |
| `*_Get_solSize`                              | All         | Query solution field dimensions                                             |
| `*_Set_solsAtVerticesSize` / `*_*ithSol*`    | All         | Multi-solution support for advanced workflows (e.g. multiple metric fields) |
| `*_loadAllSols` / `*_saveAllSols`            | All         | File I/O for multi-solution data                                            |
| `*_Set_constantSize`                         | All         | Shortcut for uniform mesh sizing                                            |
| `*_Get_adjaVertices*`                        | MMG2D, MMGS | Vertex adjacency queries (requires adjacency table availability)            |
| `MMG3D_Add_vertex` / `MMG3D_Add_tetrahedron` | MMG3D       | Dynamic mesh construction without pre-allocating size                       |
| `MMG3D_Set_handGivenMesh`                    | MMG3D       | Optimization hint for programmatically built meshes                         |

| `*_loadGenericMesh` / `*_saveGenericMesh` | All | Auto-detect format (currently handled by PyVista) |
