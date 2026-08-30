---
icon: material/checkbox-marked-outline
---

# MMG C API Binding Coverage

This document tracks every public function in the MMG C library and whether it has a
corresponding Python binding in mmgpy. Functions are sourced from the official MMG headers
(`libmmg2d.h`, `libmmg3d.h`, `libmmgs.h`).

## Coverage Summary

| Library | Total | Bound | Indirect | Candidate | Excluded | Skipped | Functional Coverage |
| ------- | ----: | ----: | -------: | --------: | -------: | ------: | ------------------: |
| MMG3D   |   140 |    72 |       49 |         0 |       18 |       1 |                 86% |
| MMG2D   |   119 |    61 |       42 |         0 |       15 |       1 |                 87% |
| MMGS    |   109 |    61 |       37 |         0 |       11 |       0 |                 90% |

**Functional coverage** = (Bound + Indirect) / Total. "Indirect" means the functionality
is available in the Python API through an alternative implementation (e.g. direct struct
access or reimplementation).

The table is checked against the callable declarations in the public headers of the MMG
version pinned by `pyproject.toml`; a mismatched source tree is rejected. Direct C/C++
symbol use is detected automatically; indirect and intentionally omitted functionality
stays explicitly classified here. Run:

```bash
python scripts/check_mmg_api_coverage.py
```

The command fails if MMG adds or removes a public callable, a bound symbol has a stale
status, or the summary drifts. Here, **Bound** means that the binding implementation calls
the C symbol; it does not promise a one-to-one public Python method. Memory-management
symbols such as `Free_allSols` remain internal implementation details. After changing
bindings, `--write` updates direct-binding statuses and counts. Newly introduced MMG
callables always require a human-written row and rationale rather than receiving a guessed
classification.

Public parameter enums are audited too. All 101 parameters in MMG 5.8.0 are accounted
for: 97 are mapped directly, while native Lagrangian motion (`MMG3D_IPARAM_lag` and
`MMG2D_IPARAM_lag`) and Scotch renumbering (`MMG3D_IPARAM_renum` and
`MMGS_IPARAM_renum`) have portable mmgpy alternatives. The checker fails if a new MMG
parameter is not mapped or explicitly classified.

### Non-callable C API

The public common header also exposes C representation details. These are accounted for at
the capability level, but are not included in the callable totals above:

| C API group                                             | Disposition | Python treatment                                                                     |
| ------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------ |
| `MMG5_type` solution enum                               | Indirect    | Inferred from NumPy field shape and exposed through field arrays                     |
| `MMG5_entities` enum                                    | Indirect    | Represented by mesh kind and typed element methods                                   |
| `MMG5_Format` enum                                      | Indirect    | Selected from path extensions by native MMG or PyVista-backed I/O                    |
| `MMG5_SUCCESS`, `MMG5_LOWFAILURE`, `MMG5_STRONGFAILURE` | Indirect    | Converted to results, warnings, and Python exceptions                                |
| `MMG5_MMAT_*` constants                                 | Indirect    | Multi-material split behavior is exposed through typed methods                       |
| `MMG5_ARG_*` variadic tags                              | Excluded    | C allocation protocol hidden by constructors and RAII                                |
| `MMG5_*` structs and pointer typedefs                   | Excluded    | Private ABI representation; exposing it would bypass validation and ownership safety |
| Compile-time limits and buffer-size macros              | Excluded    | Implementation limits, not stable Python API                                         |

The deterministic checker covers callable declarations and parameter enums. The grouped
ABI dispositions above are a reviewed policy boundary rather than a promise to mirror C
types and macros one-to-one.

Excluded functions fall into categories that should not become one-to-one Python methods:

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
| Candidate | User-facing MMG capability is missing and is reasonable to expose                                                                 |
| Excluded  | Deliberately not ported: internal plumbing, redundant C API shape, legacy helper, or unsafe low-level operation                   |
| Skipped   | Upstream capability cannot be shipped consistently in supported mmgpy builds                                                      |

---

## MMG3D (3D Volumetric Mesh)

### Initialization & Memory Management

| Function                | Status   | Notes                                                     |
| ----------------------- | -------- | --------------------------------------------------------- |
| `MMG3D_Init_mesh`       | Bound    | `MmgMesh3D()` constructor; `mmg3d.remesh()`               |
| `MMG3D_Init_fileNames`  | Excluded | Called internally by `Init_mesh`                          |
| `MMG3D_Init_parameters` | Excluded | Called internally by `Init_mesh`                          |
| `MMG3D_Free_all`        | Bound    | Called in `MmgMesh3D` destructor and `mmg3d.remesh()`     |
| `MMG3D_Free_structures` | Excluded | `Free_all` used instead                                   |
| `MMG3D_Free_names`      | Excluded | `Free_all` used instead                                   |
| `MMG3D_Free_allSols`    | Bound    | Internal cleanup for multi-solution I/O; no Python method |
| `MMG3D_Free_solutions`  | Excluded | `Free_all` used instead                                   |

### Mesh Size & Validation

| Function                 | Status   | Notes                                                |
| ------------------------ | -------- | ---------------------------------------------------- |
| `MMG3D_Set_meshSize`     | Bound    | `MmgMesh3D.set_mesh_size()`                          |
| `MMG3D_Get_meshSize`     | Bound    | `MmgMesh3D.get_mesh_size()`                          |
| `MMG3D_Chk_meshData`     | Indirect | Called internally by MMG before remeshing            |
| `MMG3D_Set_constantSize` | Indirect | Could be useful; use `hsiz` parameter as alternative |

### Vertex Operations

| Function                   | Status   | Notes                                                  |
| -------------------------- | -------- | ------------------------------------------------------ |
| `MMG3D_Set_vertex`         | Bound    | `MmgMesh3D.set_vertex()` and loops in `set_vertices()` |
| `MMG3D_Set_vertices`       | Indirect | `set_vertices()` loops over `Set_vertex` instead       |
| `MMG3D_Get_vertex`         | Bound    | `MmgMesh3D.get_vertex()` (by iteration index)          |
| `MMG3D_GetByIdx_vertex`    | Bound    | Used in `get_vertex()` (by absolute index)             |
| `MMG3D_Get_vertices`       | Indirect | `get_vertices()` accesses struct directly              |
| `MMG3D_Add_vertex`         | Indirect | Python constructs meshes from complete arrays instead  |
| `MMG3D_Set_normalAtVertex` | Bound    | `MmgMesh3D.set_normal_at_vertices()`                   |
| `MMG3D_Get_normalAtVertex` | Bound    | `MmgMesh3D.get_normal_at_vertices()`                   |

### Tetrahedron Operations

| Function                       | Status   | Notes                                                         |
| ------------------------------ | -------- | ------------------------------------------------------------- |
| `MMG3D_Set_tetrahedron`        | Bound    | `MmgMesh3D.set_tetrahedron()` and loops in `set_tetrahedra()` |
| `MMG3D_Set_tetrahedra`         | Indirect | `set_tetrahedra()` loops over `Set_tetrahedron` instead       |
| `MMG3D_Get_tetrahedron`        | Bound    | `MmgMesh3D.get_tetrahedron()`                                 |
| `MMG3D_Get_tetrahedra`         | Indirect | `get_tetrahedra()` accesses struct directly                   |
| `MMG3D_Get_tetrahedronQuality` | Bound    | `MmgMesh3D.get_element_quality()` / `get_element_qualities()` |
| `MMG3D_Add_tetrahedron`        | Indirect | Python constructs meshes from complete arrays instead         |

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

| Function               | Status   | Notes                                                   |
| ---------------------- | -------- | ------------------------------------------------------- |
| `MMG3D_Set_solSize`    | Bound    | Called internally when setting fields via `set_field()` |
| `MMG3D_Get_solSize`    | Indirect | Could be useful for querying solution state             |
| `MMG3D_Set_scalarSol`  | Indirect | `Set_scalarSols` (bulk) used instead                    |
| `MMG3D_Set_scalarSols` | Bound    | Used in `set_field("metric")` / `set_field("levelset")` |
| `MMG3D_Get_scalarSol`  | Indirect | `Get_scalarSols` (bulk) used instead                    |
| `MMG3D_Get_scalarSols` | Bound    | Used in `get_field("metric")` / `get_field("levelset")` |
| `MMG3D_Set_vectorSol`  | Indirect | `Set_vectorSols` (bulk) used instead                    |
| `MMG3D_Set_vectorSols` | Bound    | Used in `set_field("displacement")`                     |
| `MMG3D_Get_vectorSol`  | Indirect | `Get_vectorSols` (bulk) used instead                    |
| `MMG3D_Get_vectorSols` | Bound    | Used in `get_field("displacement")`                     |
| `MMG3D_Set_tensorSol`  | Indirect | `Set_tensorSols` (bulk) used instead                    |
| `MMG3D_Set_tensorSols` | Bound    | Used in `set_field("tensor")`                           |
| `MMG3D_Get_tensorSol`  | Indirect | `Get_tensorSols` (bulk) used instead                    |
| `MMG3D_Get_tensorSols` | Bound    | Used in `get_field("tensor")`                           |

### Multi-Solution Support

| Function                             | Status   | Notes                                     |
| ------------------------------------ | -------- | ----------------------------------------- |
| `MMG3D_Set_solsAtVerticesSize`       | Bound    | Used by `save_all_sols()`                 |
| `MMG3D_Get_solsAtVerticesSize`       | Bound    | Used by `load_all_sols()`                 |
| `MMG3D_Set_ithSol_inSolsAtVertices`  | Indirect | Set individual values in multi-solution   |
| `MMG3D_Set_ithSols_inSolsAtVertices` | Bound    | Used by `save_all_sols()`                 |
| `MMG3D_Get_ithSol_inSolsAtVertices`  | Indirect | Get individual values from multi-solution |
| `MMG3D_Get_ithSols_inSolsAtVertices` | Bound    | Used by `load_all_sols()`                 |

### Parameters

| Function                     | Status   | Notes                                                      |
| ---------------------------- | -------- | ---------------------------------------------------------- |
| `MMG3D_Set_iparameter`       | Bound    | Used in `remesh()` for integer options                     |
| `MMG3D_Set_dparameter`       | Bound    | Used in `remesh()` for float options (hmin, hmax, etc.)    |
| `MMG3D_Get_iparameter`       | Bound    | `MmgMesh3D.get_iparameter()`                               |
| `MMG3D_Set_localParameter`   | Bound    | `MmgMesh3D.set_local_parameters()`                         |
| `MMG3D_Set_multiMat`         | Bound    | `MmgMesh3D.set_multi_materials()`                          |
| `MMG3D_Set_lsBaseReference`  | Bound    | `MmgMesh3D.set_ls_base_references()`                       |
| `MMG3D_Set_handGivenMesh`    | Excluded | Only needed after direct writes to opaque MMG C structures |
| `MMG3D_switch_metricStorage` | Excluded | Advanced metric storage control                            |

### I/O Configuration

| Function                   | Status | Notes                                   |
| -------------------------- | ------ | --------------------------------------- |
| `MMG3D_Set_inputMeshName`  | Bound  | Used in `mmg3d.remesh()` file-based API |
| `MMG3D_Set_outputMeshName` | Bound  | Used in `mmg3d.remesh()` file-based API |
| `MMG3D_Set_inputSolName`   | Bound  | Used in `mmg3d.remesh()` file-based API |
| `MMG3D_Set_outputSolName`  | Bound  | Used in `mmg3d.remesh()` file-based API |
| `MMG3D_Set_inputParamName` | Bound  | `MmgMesh3D.set_input_parameter_name()`  |

### File I/O

| Function                        | Status   | Notes                                                           |
| ------------------------------- | -------- | --------------------------------------------------------------- |
| `MMG3D_loadMesh`                | Bound    | Used in `mmg3d.remesh()` and `MmgMesh3D(filename)`              |
| `MMG3D_saveMesh`                | Bound    | Used in `mmg3d.remesh()` and `MmgMesh3D.save()`                 |
| `MMG3D_loadSol`                 | Bound    | Used in `mmg3d.remesh()` and `MmgMesh3D.load_sol()`             |
| `MMG3D_saveSol`                 | Bound    | Used in `mmg3d.remesh()` and `MmgMesh3D.save_sol()`             |
| `MMG3D_loadGenericMesh`         | Indirect | Auto-detect format; `loadMesh` used + PyVista for other formats |
| `MMG3D_saveGenericMesh`         | Indirect | Auto-detect format; `saveMesh` used + PyVista for other formats |
| `MMG3D_loadMshMesh`             | Indirect | Gmsh format; handled by PyVista instead                         |
| `MMG3D_loadMshMesh_and_allData` | Indirect | Gmsh format with all data                                       |
| `MMG3D_saveMshMesh`             | Indirect | Gmsh format output                                              |
| `MMG3D_saveMshMesh_and_allData` | Indirect | Gmsh format with all data                                       |
| `MMG3D_loadVtkMesh`             | Indirect | VTK format; handled by PyVista instead                          |
| `MMG3D_loadVtkMesh_and_allData` | Indirect | VTK format with all data                                        |
| `MMG3D_saveVtkMesh`             | Indirect | VTK format output                                               |
| `MMG3D_saveVtkMesh_and_allData` | Indirect | VTK format with all data                                        |
| `MMG3D_loadVtuMesh`             | Indirect | VTU format; handled by PyVista instead                          |
| `MMG3D_loadVtuMesh_and_allData` | Indirect | VTU format with all data                                        |
| `MMG3D_saveVtuMesh`             | Indirect | VTU format output                                               |
| `MMG3D_saveVtuMesh_and_allData` | Indirect | VTU format with all data                                        |
| `MMG3D_loadAllSols`             | Bound    | `MmgMesh3D.load_all_sols()`                                     |
| `MMG3D_saveAllSols`             | Bound    | `MmgMesh3D.save_all_sols()`                                     |
| `MMG3D_saveTetgenMesh`          | Bound    | `MmgMesh3D.save_tetgen()`                                       |

### Topology Queries

| Function                            | Status | Notes                                  |
| ----------------------------------- | ------ | -------------------------------------- |
| `MMG3D_Get_adjaTet`                 | Bound  | `MmgMesh3D.get_adjacent_elements()`    |
| `MMG3D_Get_tetFromTria`             | Bound  | `MmgMesh3D.get_tet_from_tria()`        |
| `MMG3D_Get_tetsFromTria`            | Bound  | `MmgMesh3D.get_tets_from_tria()`       |
| `MMG3D_Get_numberOfNonBdyTriangles` | Bound  | Used in `get_non_boundary_triangles()` |
| `MMG3D_Get_nonBdyTriangle`          | Bound  | Used in `get_non_boundary_triangles()` |

### Remeshing Functions

| Function         | Status  | Notes                                                                                   |
| ---------------- | ------- | --------------------------------------------------------------------------------------- |
| `MMG3D_mmg3dlib` | Bound   | `MmgMesh3D.remesh()` (standard remeshing)                                               |
| `MMG3D_mmg3dls`  | Bound   | `MmgMesh3D.remesh_levelset()`                                                           |
| `MMG3D_mmg3dmov` | Skipped | Requires the ELAS dependency; mmgpy ships `mmgpy.move_mesh` (Laplacian / fedoo) instead |

### CLI & Internal Utilities

| Function               | Status   | Notes                                                 |
| ---------------------- | -------- | ----------------------------------------------------- |
| `MMG3D_defaultValues`  | Excluded | Prints default values to stdout; CLI utility          |
| `MMG3D_parsar`         | Excluded | Command-line argument parser; not relevant for Python |
| `MMG3D_parsop`         | Indirect | Native format handled by mmgpy's shared safe parser   |
| `MMG3D_usage`          | Excluded | Prints usage text; CLI utility                        |
| `MMG3D_Set_commonFunc` | Excluded | Internal MMG function pointer setup                   |
| `MMG3D_setfunc`        | Bound    | Initializes `MMG3D_doSol` for `build_size_map()`      |
| `MMG3D_stockOptions`   | Excluded | Internal: saves options to mesh structure             |
| `MMG3D_destockOptions` | Excluded | Internal: restores options from mesh structure        |
| `MMG3D_Compute_eigenv` | Indirect | `metrics.compute_metric_eigenpairs()` / NumPy         |
| `MMG3D_Clean_isoSurf`  | Bound    | `MmgMesh3D.clean_iso_surface()`                       |
| `MMG3D_hashTetra`      | Excluded | Internal hash table construction                      |
| `MMG3D_searchqua`      | Excluded | Internal: search for worst quality elements           |
| `MMG3D_searchlen`      | Excluded | Internal: search for worst edge lengths               |
| `MMG3D_mmg3dcheck`     | Excluded | Internal mesh consistency check                       |

### Function Pointers

| Function           | Status   | Notes                                                                                   |
| ------------------ | -------- | --------------------------------------------------------------------------------------- |
| `MMG3D_doSol`      | Bound    | Used by `MmgMesh3D.build_size_map()`                                                    |
| `MMG3D_lenedgCoor` | Excluded | External function pointer for custom edge length computation; advanced C-level callback |

---

## MMG2D (2D Planar Mesh)

### Initialization & Memory Management

| Function                | Status   | Notes                                                     |
| ----------------------- | -------- | --------------------------------------------------------- |
| `MMG2D_Init_mesh`       | Bound    | `MmgMesh2D()` constructor; `mmg2d.remesh()`               |
| `MMG2D_Init_fileNames`  | Excluded | Called internally by `Init_mesh`                          |
| `MMG2D_Init_parameters` | Excluded | Called internally by `Init_mesh`                          |
| `MMG2D_Free_all`        | Bound    | Called in `MmgMesh2D` destructor and `mmg2d.remesh()`     |
| `MMG2D_Free_structures` | Excluded | `Free_all` used instead                                   |
| `MMG2D_Free_names`      | Excluded | `Free_all` used instead                                   |
| `MMG2D_Free_allSols`    | Bound    | Internal cleanup for multi-solution I/O; no Python method |
| `MMG2D_Free_solutions`  | Excluded | `Free_all` used instead                                   |
| `MMG2D_Free_triangles`  | Excluded | `Free_all` used instead                                   |
| `MMG2D_Free_edges`      | Excluded | `Free_all` used instead                                   |

### Mesh Size & Validation

| Function                 | Status   | Notes                                                |
| ------------------------ | -------- | ---------------------------------------------------- |
| `MMG2D_Set_meshSize`     | Bound    | `MmgMesh2D.set_mesh_size()`                          |
| `MMG2D_Get_meshSize`     | Bound    | `MmgMesh2D.get_mesh_size()`                          |
| `MMG2D_Chk_meshData`     | Indirect | Called internally by MMG before remeshing            |
| `MMG2D_Set_constantSize` | Indirect | Could be useful; use `hsiz` parameter as alternative |

### Vertex Operations

| Function                   | Status   | Notes                                                  |
| -------------------------- | -------- | ------------------------------------------------------ |
| `MMG2D_Set_vertex`         | Bound    | `MmgMesh2D.set_vertex()` and loops in `set_vertices()` |
| `MMG2D_Set_vertices`       | Indirect | `set_vertices()` loops over `Set_vertex` instead       |
| `MMG2D_Get_vertex`         | Bound    | `MmgMesh2D.get_vertex()` (by iteration index)          |
| `MMG2D_GetByIdx_vertex`    | Bound    | Used in `get_vertex()` (by absolute index)             |
| `MMG2D_Get_vertices`       | Indirect | `get_vertices()` accesses struct directly              |
| `MMG2D_Reset_verticestags` | Excluded | Resets all vertex tags; niche use case                 |

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

| Function               | Status   | Notes                                                   |
| ---------------------- | -------- | ------------------------------------------------------- |
| `MMG2D_Set_solSize`    | Bound    | Called internally when setting fields via `set_field()` |
| `MMG2D_Get_solSize`    | Indirect | Could be useful for querying solution state             |
| `MMG2D_Set_scalarSol`  | Indirect | `Set_scalarSols` (bulk) used instead                    |
| `MMG2D_Set_scalarSols` | Bound    | Used in `set_field("metric")` / `set_field("levelset")` |
| `MMG2D_Get_scalarSol`  | Indirect | `Get_scalarSols` (bulk) used instead                    |
| `MMG2D_Get_scalarSols` | Bound    | Used in `get_field("metric")` / `get_field("levelset")` |
| `MMG2D_Set_vectorSol`  | Indirect | `Set_vectorSols` (bulk) used instead                    |
| `MMG2D_Set_vectorSols` | Bound    | Used in `set_field("displacement")`                     |
| `MMG2D_Get_vectorSol`  | Indirect | `Get_vectorSols` (bulk) used instead                    |
| `MMG2D_Get_vectorSols` | Bound    | Used in `get_field("displacement")`                     |
| `MMG2D_Set_tensorSol`  | Indirect | `Set_tensorSols` (bulk) used instead                    |
| `MMG2D_Set_tensorSols` | Bound    | Used in `set_field("tensor")`                           |
| `MMG2D_Get_tensorSol`  | Indirect | `Get_tensorSols` (bulk) used instead                    |
| `MMG2D_Get_tensorSols` | Bound    | Used in `get_field("tensor")`                           |

### Multi-Solution Support

| Function                             | Status   | Notes                                     |
| ------------------------------------ | -------- | ----------------------------------------- |
| `MMG2D_Set_solsAtVerticesSize`       | Bound    | Used by `save_all_sols()`                 |
| `MMG2D_Get_solsAtVerticesSize`       | Bound    | Used by `load_all_sols()`                 |
| `MMG2D_Set_ithSol_inSolsAtVertices`  | Indirect | Set individual values in multi-solution   |
| `MMG2D_Set_ithSols_inSolsAtVertices` | Bound    | Used by `save_all_sols()`                 |
| `MMG2D_Get_ithSol_inSolsAtVertices`  | Indirect | Get individual values from multi-solution |
| `MMG2D_Get_ithSols_inSolsAtVertices` | Bound    | Used by `load_all_sols()`                 |

### Parameters

| Function                    | Status | Notes                                                   |
| --------------------------- | ------ | ------------------------------------------------------- |
| `MMG2D_Set_iparameter`      | Bound  | Used in `remesh()` for integer options                  |
| `MMG2D_Set_dparameter`      | Bound  | Used in `remesh()` for float options (hmin, hmax, etc.) |
| `MMG2D_Set_localParameter`  | Bound  | `MmgMesh2D.set_local_parameters()`                      |
| `MMG2D_Set_multiMat`        | Bound  | `MmgMesh2D.set_multi_materials()`                       |
| `MMG2D_Set_lsBaseReference` | Bound  | `MmgMesh2D.set_ls_base_references()`                    |

### I/O Configuration

| Function                   | Status | Notes                                   |
| -------------------------- | ------ | --------------------------------------- |
| `MMG2D_Set_inputMeshName`  | Bound  | Used in `mmg2d.remesh()` file-based API |
| `MMG2D_Set_outputMeshName` | Bound  | Used in `mmg2d.remesh()` file-based API |
| `MMG2D_Set_inputSolName`   | Bound  | Used in `mmg2d.remesh()` file-based API |
| `MMG2D_Set_outputSolName`  | Bound  | Used in `mmg2d.remesh()` file-based API |
| `MMG2D_Set_inputParamName` | Bound  | `MmgMesh2D.set_input_parameter_name()`  |

### File I/O

| Function                        | Status   | Notes                                                           |
| ------------------------------- | -------- | --------------------------------------------------------------- |
| `MMG2D_loadMesh`                | Bound    | Used in `mmg2d.remesh()` and `MmgMesh2D(filename)`              |
| `MMG2D_saveMesh`                | Bound    | Used in `mmg2d.remesh()` and `MmgMesh2D.save()`                 |
| `MMG2D_loadSol`                 | Bound    | Used in `mmg2d.remesh()` and `MmgMesh2D.load_sol()`             |
| `MMG2D_saveSol`                 | Bound    | Used in `mmg2d.remesh()` and `MmgMesh2D.save_sol()`             |
| `MMG2D_loadGenericMesh`         | Indirect | Auto-detect format; `loadMesh` used + PyVista for other formats |
| `MMG2D_saveGenericMesh`         | Indirect | Auto-detect format; `saveMesh` used + PyVista for other formats |
| `MMG2D_loadMshMesh`             | Indirect | Gmsh format; handled by PyVista instead                         |
| `MMG2D_loadMshMesh_and_allData` | Indirect | Gmsh format with all data                                       |
| `MMG2D_saveMshMesh`             | Indirect | Gmsh format output                                              |
| `MMG2D_saveMshMesh_and_allData` | Indirect | Gmsh format with all data                                       |
| `MMG2D_loadVtkMesh`             | Indirect | VTK format; handled by PyVista instead                          |
| `MMG2D_loadVtkMesh_and_allData` | Indirect | VTK format with all data                                        |
| `MMG2D_saveVtkMesh`             | Indirect | VTK format output                                               |
| `MMG2D_saveVtkMesh_and_allData` | Indirect | VTK format with all data                                        |
| `MMG2D_loadVtpMesh`             | Indirect | VTP format; handled by PyVista instead                          |
| `MMG2D_loadVtpMesh_and_allData` | Indirect | VTP format with all data                                        |
| `MMG2D_saveVtpMesh`             | Indirect | VTP format output                                               |
| `MMG2D_saveVtpMesh_and_allData` | Indirect | VTP format with all data                                        |
| `MMG2D_loadVtuMesh`             | Indirect | VTU format; handled by PyVista instead                          |
| `MMG2D_loadVtuMesh_and_allData` | Indirect | VTU format with all data                                        |
| `MMG2D_saveVtuMesh`             | Indirect | VTU format output                                               |
| `MMG2D_saveVtuMesh_and_allData` | Indirect | VTU format with all data                                        |
| `MMG2D_loadVect`                | Excluded | Vector field loading (legacy)                                   |
| `MMG2D_saveVect`                | Excluded | Vector field saving (legacy)                                    |
| `MMG2D_loadAllSols`             | Bound    | `MmgMesh2D.load_all_sols()`                                     |
| `MMG2D_saveAllSols`             | Bound    | `MmgMesh2D.save_all_sols()`                                     |
| `MMG2D_saveTetgenMesh`          | Bound    | `MmgMesh2D.save_tetgen()`                                       |

### Topology Queries

| Function                        | Status   | Notes                                                               |
| ------------------------------- | -------- | ------------------------------------------------------------------- |
| `MMG2D_Get_adjaTri`             | Bound    | `MmgMesh2D.get_adjacent_elements()`                                 |
| `MMG2D_Get_adjaVertices`        | Indirect | Requires adjacency tables that may not be available after remeshing |
| `MMG2D_Get_adjaVerticesFast`    | Indirect | Same limitation as `Get_adjaVertices`                               |
| `MMG2D_Get_triFromEdge`         | Bound    | `MmgMesh2D.get_tri_from_edge()`                                     |
| `MMG2D_Get_trisFromEdge`        | Bound    | `MmgMesh2D.get_tris_from_edge()`                                    |
| `MMG2D_Get_numberOfNonBdyEdges` | Bound    | Used in `get_non_boundary_edges()`                                  |
| `MMG2D_Get_nonBdyEdge`          | Bound    | Used in `get_non_boundary_edges()`                                  |

### Remeshing Functions

| Function          | Status  | Notes                                                                                   |
| ----------------- | ------- | --------------------------------------------------------------------------------------- |
| `MMG2D_mmg2dlib`  | Bound   | `MmgMesh2D.remesh()` (standard remeshing)                                               |
| `MMG2D_mmg2dls`   | Bound   | `MmgMesh2D.remesh_levelset()`                                                           |
| `MMG2D_mmg2dmov`  | Skipped | Requires the ELAS dependency; mmgpy ships `mmgpy.move_mesh` (Laplacian / fedoo) instead |
| `MMG2D_mmg2dmesh` | Bound   | Auto-selected by `remesh()` when mesh has no triangles (edge-only mesh generation)      |

### CLI & Internal Utilities

| Function               | Status   | Notes                                                 |
| ---------------------- | -------- | ----------------------------------------------------- |
| `MMG2D_defaultValues`  | Excluded | Prints default values to stdout; CLI utility          |
| `MMG2D_parsar`         | Excluded | Command-line argument parser; not relevant for Python |
| `MMG2D_parsop`         | Indirect | Native format handled by mmgpy's shared safe parser   |
| `MMG2D_usage`          | Excluded | Prints usage text; CLI utility                        |
| `MMG2D_Set_commonFunc` | Excluded | Internal MMG function pointer setup                   |
| `MMG2D_setfunc`        | Bound    | Initializes `MMG2D_doSol` for `build_size_map()`      |
| `MMG2D_Compute_eigenv` | Indirect | `metrics.compute_metric_eigenpairs()` / NumPy         |
| `MMG2D_scaleMesh`      | Excluded | Internal mesh scaling for numerical stability         |

### Function Pointers

| Function      | Status | Notes                                |
| ------------- | ------ | ------------------------------------ |
| `MMG2D_doSol` | Bound  | Used by `MmgMesh2D.build_size_map()` |

---

## MMGS (Surface Mesh)

### Initialization & Memory Management

| Function               | Status   | Notes                                                     |
| ---------------------- | -------- | --------------------------------------------------------- |
| `MMGS_Init_mesh`       | Bound    | `MmgMeshS()` constructor; `mmgs.remesh()`                 |
| `MMGS_Init_fileNames`  | Excluded | Called internally by `Init_mesh`                          |
| `MMGS_Init_parameters` | Excluded | Called internally by `Init_mesh`                          |
| `MMGS_Free_all`        | Bound    | Called in `MmgMeshS` destructor and `mmgs.remesh()`       |
| `MMGS_Free_structures` | Excluded | `Free_all` used instead                                   |
| `MMGS_Free_names`      | Excluded | `Free_all` used instead                                   |
| `MMGS_Free_allSols`    | Bound    | Internal cleanup for multi-solution I/O; no Python method |
| `MMGS_Free_solutions`  | Excluded | `Free_all` used instead                                   |

### Mesh Size & Validation

| Function                | Status   | Notes                                                |
| ----------------------- | -------- | ---------------------------------------------------- |
| `MMGS_Set_meshSize`     | Bound    | `MmgMeshS.set_mesh_size()`                           |
| `MMGS_Get_meshSize`     | Bound    | `MmgMeshS.get_mesh_size()`                           |
| `MMGS_Chk_meshData`     | Indirect | Called internally by MMG before remeshing            |
| `MMGS_Set_constantSize` | Indirect | Could be useful; use `hsiz` parameter as alternative |

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

| Function                   | Status   | Notes                                                                                                                                                                                                         |
| -------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `MMGS_Set_triangle`        | Bound    | `MmgMeshS.set_triangle()` and loops in `set_triangles()`                                                                                                                                                      |
| `MMGS_Set_triangles`       | Indirect | `set_triangles()` loops over `Set_triangle` instead                                                                                                                                                           |
| `MMGS_Get_triangle`        | Bound    | `MmgMeshS.get_triangle()`                                                                                                                                                                                     |
| `MMGS_Get_triangles`       | Indirect | `get_triangles()` accesses struct directly                                                                                                                                                                    |
| `MMGS_Get_triangleQuality` | Bound    | `MmgMeshS.get_element_quality()` / `get_element_qualities()`. Public header drops `LIBMMGS_EXPORT` in MMG v5.8.0; wheel builds export via `WINDOWS_EXPORT_ALL_SYMBOLS`, conda Windows uses a manual fallback. |

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

| Function              | Status   | Notes                                                   |
| --------------------- | -------- | ------------------------------------------------------- |
| `MMGS_Set_solSize`    | Bound    | Called internally when setting fields via `set_field()` |
| `MMGS_Get_solSize`    | Indirect | Could be useful for querying solution state             |
| `MMGS_Set_scalarSol`  | Indirect | `Set_scalarSols` (bulk) used instead                    |
| `MMGS_Set_scalarSols` | Bound    | Used in `set_field("metric")` / `set_field("levelset")` |
| `MMGS_Get_scalarSol`  | Indirect | `Get_scalarSols` (bulk) used instead                    |
| `MMGS_Get_scalarSols` | Bound    | Used in `get_field("metric")` / `get_field("levelset")` |
| `MMGS_Set_vectorSol`  | Indirect | `Set_vectorSols` (bulk) used instead                    |
| `MMGS_Set_vectorSols` | Bound    | Used in `set_field("displacement")`                     |
| `MMGS_Get_vectorSol`  | Indirect | `Get_vectorSols` (bulk) used instead                    |
| `MMGS_Get_vectorSols` | Bound    | Used in `get_field("displacement")`                     |
| `MMGS_Set_tensorSol`  | Indirect | `Set_tensorSols` (bulk) used instead                    |
| `MMGS_Set_tensorSols` | Bound    | Used in `set_field("tensor")`                           |
| `MMGS_Get_tensorSol`  | Indirect | `Get_tensorSols` (bulk) used instead                    |
| `MMGS_Get_tensorSols` | Bound    | Used in `get_field("tensor")`                           |

### Multi-Solution Support

| Function                            | Status   | Notes                                     |
| ----------------------------------- | -------- | ----------------------------------------- |
| `MMGS_Set_solsAtVerticesSize`       | Bound    | Used by `save_all_sols()`                 |
| `MMGS_Get_solsAtVerticesSize`       | Bound    | Used by `load_all_sols()`                 |
| `MMGS_Set_ithSol_inSolsAtVertices`  | Indirect | Set individual values in multi-solution   |
| `MMGS_Set_ithSols_inSolsAtVertices` | Bound    | Used by `save_all_sols()`                 |
| `MMGS_Get_ithSol_inSolsAtVertices`  | Indirect | Get individual values from multi-solution |
| `MMGS_Get_ithSols_inSolsAtVertices` | Bound    | Used by `load_all_sols()`                 |

### Parameters

| Function                   | Status | Notes                                                   |
| -------------------------- | ------ | ------------------------------------------------------- |
| `MMGS_Set_iparameter`      | Bound  | Used in `remesh()` for integer options                  |
| `MMGS_Set_dparameter`      | Bound  | Used in `remesh()` for float options (hmin, hmax, etc.) |
| `MMGS_Get_iparameter`      | Bound  | `MmgMeshS.get_iparameter()`                             |
| `MMGS_Set_localParameter`  | Bound  | `MmgMeshS.set_local_parameters()`                       |
| `MMGS_Set_multiMat`        | Bound  | `MmgMeshS.set_multi_materials()`                        |
| `MMGS_Set_lsBaseReference` | Bound  | `MmgMeshS.set_ls_base_references()`                     |

### I/O Configuration

| Function                  | Status | Notes                                                       |
| ------------------------- | ------ | ----------------------------------------------------------- |
| `MMGS_Set_inputMeshName`  | Bound  | Used in `mmgs.remesh()` file-based API                      |
| `MMGS_Set_outputMeshName` | Bound  | Used in `mmgs.remesh()` file-based API                      |
| `MMGS_Set_inputSolName`   | Bound  | Used in `mmgs.remesh()` file-based API                      |
| `MMGS_Set_outputSolName`  | Bound  | Used in `mmgs.remesh()` file-based API                      |
| `MMGS_Set_inputParamName` | Bound  | `MmgMeshS.set_input_parameter_name()` and `parameter_file=` |

### File I/O

| Function                       | Status   | Notes                                                           |
| ------------------------------ | -------- | --------------------------------------------------------------- |
| `MMGS_loadMesh`                | Bound    | Used in `mmgs.remesh()` and `MmgMeshS(filename)`                |
| `MMGS_saveMesh`                | Bound    | Used in `mmgs.remesh()` and `MmgMeshS.save()`                   |
| `MMGS_loadSol`                 | Bound    | Used in `mmgs.remesh()` and `MmgMeshS.load_sol()`               |
| `MMGS_saveSol`                 | Bound    | Used in `mmgs.remesh()` and `MmgMeshS.save_sol()`               |
| `MMGS_loadGenericMesh`         | Indirect | Auto-detect format; `loadMesh` used + PyVista for other formats |
| `MMGS_saveGenericMesh`         | Indirect | Auto-detect format; `saveMesh` used + PyVista for other formats |
| `MMGS_loadMshMesh`             | Indirect | Gmsh format; handled by PyVista instead                         |
| `MMGS_loadMshMesh_and_allData` | Indirect | Gmsh format with all data                                       |
| `MMGS_saveMshMesh`             | Indirect | Gmsh format output                                              |
| `MMGS_saveMshMesh_and_allData` | Indirect | Gmsh format with all data                                       |
| `MMGS_loadVtkMesh`             | Indirect | VTK format; handled by PyVista instead                          |
| `MMGS_loadVtkMesh_and_allData` | Indirect | VTK format with all data                                        |
| `MMGS_saveVtkMesh`             | Indirect | VTK format output                                               |
| `MMGS_saveVtkMesh_and_allData` | Indirect | VTK format with all data                                        |
| `MMGS_loadVtpMesh`             | Indirect | VTP format; handled by PyVista instead                          |
| `MMGS_loadVtpMesh_and_allData` | Indirect | VTP format with all data                                        |
| `MMGS_saveVtpMesh`             | Indirect | VTP format output                                               |
| `MMGS_saveVtpMesh_and_allData` | Indirect | VTP format with all data                                        |
| `MMGS_loadVtuMesh`             | Indirect | VTU format; handled by PyVista instead                          |
| `MMGS_loadVtuMesh_and_allData` | Indirect | VTU format with all data                                        |
| `MMGS_saveVtuMesh`             | Indirect | VTU format output                                               |
| `MMGS_saveVtuMesh_and_allData` | Indirect | VTU format with all data                                        |
| `MMGS_loadAllSols`             | Bound    | `MmgMeshS.load_all_sols()`                                      |
| `MMGS_saveAllSols`             | Bound    | `MmgMeshS.save_all_sols()`                                      |

### Topology Queries

| Function                       | Status   | Notes                                                               |
| ------------------------------ | -------- | ------------------------------------------------------------------- |
| `MMGS_Get_adjaTri`             | Bound    | `MmgMeshS.get_adjacent_elements()`                                  |
| `MMGS_Get_adjaVerticesFast`    | Indirect | Requires adjacency tables that may not be available after remeshing |
| `MMGS_Get_numberOfNonBdyEdges` | Bound    | Used in `get_non_boundary_edges()`                                  |
| `MMGS_Get_nonBdyEdge`          | Bound    | Used in `get_non_boundary_edges()`                                  |

### Remeshing Functions

| Function       | Status | Notes                                            |
| -------------- | ------ | ------------------------------------------------ |
| `MMGS_mmgslib` | Bound  | `MmgMeshS.remesh()` (standard surface remeshing) |
| `MMGS_mmgsls`  | Bound  | `MmgMeshS.remesh_levelset()`                     |

### CLI & Internal Utilities

| Function              | Status   | Notes                                                 |
| --------------------- | -------- | ----------------------------------------------------- |
| `MMGS_defaultValues`  | Excluded | Prints default values to stdout; CLI utility          |
| `MMGS_parsar`         | Excluded | Command-line argument parser; not relevant for Python |
| `MMGS_usage`          | Excluded | Prints usage text; CLI utility                        |
| `MMGS_Set_commonFunc` | Excluded | Internal MMG function pointer setup                   |
| `MMGS_setfunc`        | Bound    | Initializes `MMGS_doSol` for `build_size_map()`       |
| `MMGS_stockOptions`   | Excluded | Internal: saves options to mesh structure             |
| `MMGS_destockOptions` | Excluded | Internal: restores options from mesh structure        |
| `MMGS_Compute_eigenv` | Indirect | `metrics.compute_metric_eigenpairs()` / NumPy         |
| `MMGS_Clean_isoSurf`  | Bound    | `MmgMeshS.clean_iso_surface()`                        |

### Function Pointers

| Function     | Status | Notes                               |
| ------------ | ------ | ----------------------------------- |
| `MMGS_doSol` | Bound  | Used by `MmgMeshS.build_size_map()` |

---

## Direct API Candidates

There are no remaining direct-binding candidates. Everything marked **Excluded** in the
detailed tables has been reviewed and should not be ported one-to-one.

## Capability-Level Differences

Some differences do not correspond to a missing C callable:

- Mixed tetrahedron/prism meshes are supported by the low-level MMG3D bindings, but the
  PyVista conversion path does not currently round-trip VTK wedge cells.
- Native `MMG3D_mmg3dmov` and `MMG2D_mmg2dmov` are skipped because ELAS is not available
  consistently across supported platforms; mmgpy supplies a portable, non-identical mesh
  motion workflow ([#374](https://github.com/kmarchais/mmgpy/issues/374)).
- Text multi-solution I/O is bound. Binary `.solb` multi-solution I/O remains disabled
  pending a reliable upstream MMG round-trip
  ([#375](https://github.com/kmarchais/mmgpy/issues/375)).
