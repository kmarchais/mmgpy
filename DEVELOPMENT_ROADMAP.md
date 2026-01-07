# mmgpy Development Roadmap

> Last updated: 2026-01-07

## Recently Completed

| Feature                | PR  | Description                                                   |
| ---------------------- | --- | ------------------------------------------------------------- |
| UX improvements        | #90 | `mesh.plot()`, `mesh.vtk`, unified `mmg` command              |
| API documentation      | #89 | MkDocs site with tutorials, API reference, examples           |
| Mesh validation        | #88 | `mesh.validate()` with geometry, topology, and quality checks |
| RemeshResult dataclass | #87 | Rich return values with topology, quality, and timing stats   |
| Unified Mesh class     | #85 | Single `Mesh` class with auto-detection via `MeshKind` enum   |
| ARM64 Linux wheels     | #82 | aarch64 manylinux wheel builds                                |
| Local parameters       | #81 | Per-region sizing control                                     |
| Typed options          | #70 | `Mmg3DOptions`, `Mmg2DOptions`, `MmgSOptions` dataclasses     |
| PyVista integration    | #69 | `from_pyvista()`, `to_pyvista()` conversions                  |
| Level-set              | #68 | `remesh_levelset()` for isosurface extraction                 |
| Progress callbacks     | #65 | Real-time progress events during remeshing                    |

---

## Open GitHub Issues

| Issue                                               | Description                                      |
| --------------------------------------------------- | ------------------------------------------------ |
| [#86](https://github.com/kmarchais/mmgpy/issues/86) | CAD-to-mesh workflow (CadQuery + TetGen)         |
| [#84](https://github.com/kmarchais/mmgpy/issues/84) | Optimize CI build times (aarch64: 90min → 15min) |
| [#80](https://github.com/kmarchais/mmgpy/issues/80) | ParMmg integration for parallel remeshing        |
| [#78](https://github.com/kmarchais/mmgpy/issues/78) | Performance benchmarks with pytest-benchmark     |
| [#77](https://github.com/kmarchais/mmgpy/issues/77) | Context manager support (`with mesh:`)           |
| [#75](https://github.com/kmarchais/mmgpy/issues/75) | CONTRIBUTING.md guide                            |
| [#44](https://github.com/kmarchais/mmgpy/issues/44) | Reduce pre-commit rule ignores                   |
| [#41](https://github.com/kmarchais/mmgpy/issues/41) | Optimize wheel sizes (Linux 86MB → ~20MB)        |

---

## Blockers

### Python 3.14 Compatibility

**Status:** Blocked by VTK 9.5 (supports Python ≤3.13 only)

**Resolution:** VTK 9.6 release (expected soon) will add Python 3.14 support.

**Action:** Update to VTK 9.6 as soon as it's released, then build and publish 3.14 wheels.

---

## Pending Features by Priority

### 🟠 High Priority

| Feature              | Issue | Description                                    |
| -------------------- | ----- | ---------------------------------------------- |
| Python 3.14 support  | —     | Blocked by VTK 9.5; awaiting VTK 9.6 release   |
| CONTRIBUTING guide   | #75   | Enable community contributions                 |
| CI optimization      | #84   | Faster builds, especially aarch64 (quick wins) |
| Wheel size reduction | #41   | Match Windows ~20MB by filtering VTK modules   |

### 🟡 Medium Priority

| Feature                | Issue | Description                                       |
| ---------------------- | ----- | ------------------------------------------------- |
| Performance benchmarks | #78   | pytest-benchmark for regression tracking          |
| Context manager        | #77   | `with mesh.checkpoint():` for transactional edits |
| CAD-to-mesh workflow   | #86   | CadQuery → MMGS → TetGen → MMG3D (Python ≤3.13)   |

### 🟢 Low Priority / Long-term

| Feature            | Issue | Description                                     |
| ------------------ | ----- | ----------------------------------------------- |
| ParMmg integration | #80   | Parallel remeshing for large meshes (MPI-based) |
| Pre-commit cleanup | #44   | Reduce per-file rule ignores                    |

---

## Recommended Next: Quick Wins

Three small-to-medium tasks that improve developer and user experience:

### 1. CONTRIBUTING.md (#75)

**Why:** Enables community contributions, low effort.

**Scope:**

- Development setup instructions
- Coding standards (Ruff, type hints)
- PR process and checklist
- C++ bindings development guide

### 2. CI Optimization Phase 1 (#84)

**Why:** aarch64 builds take 90 minutes; quick wins can cut 15-20 minutes.

**Quick wins (no infrastructure changes):**

- Cache VTK downloads between jobs
- Share VTK artifacts across matrix
- Set `CMAKE_BUILD_PARALLEL_LEVEL`

### 3. Wheel Size Reduction (#41)

**Why:** Linux wheels are 86MB vs Windows 19MB. Same VTK filtering logic needed.

**Approach:**

- Reduce `ESSENTIAL_VTK_MODULES` in `scripts/optimize_wheels.py`
- Match Windows delvewheel's minimal set (~20 modules vs 55)
- Verify all mesh I/O tests still pass

---

## Future: CAD-to-Mesh Pipeline (#86)

**Blocker:** CadQuery requires Python ≤3.13 (no 3.14 wheels). This feature can only be offered as an optional extra for Python 3.10-3.13 until CadQuery adds 3.14 support.

Complete CAD-to-simulation mesh workflow:

```
CadQuery (CAD) → VTK PolyData → MMGS (surface) → TetGen (tets) → MMG3D (optimize)
```

**Proposed API:**

```python
mesh = mmgpy.Mesh.from_cadquery(shape, tolerance=0.1)
mesh.remesh(hausd=0.01)      # Surface optimization
mesh = mesh.tetrahedralize()  # TetGen
mesh.remesh(hmax=0.5)         # Volume optimization
```

**Dependencies:** `pip install mmgpy[cad]` → cadquery, tetgen

---

## Future: ParMmg Integration (#80)

Parallel remeshing for million+ element meshes.

**Phase 1:** Subprocess-based (multiprocessing + METIS partitioning)
**Phase 2:** Full MPI integration with ParMmg library

**Complexity:** High (MPI, partitioning, boundary stitching)
