# Changelog

All notable changes to mmgpy are documented here.

## [Unreleased]

### Added

- Comprehensive API documentation site with MkDocs
- Tutorials for common workflows
- Examples gallery

## [0.4.0] - In Development

### Added

- `mesh.validate()` method with comprehensive quality checks (#88)
- `RemeshResult` dataclass with detailed statistics from remeshing operations (#87)
- Unified `Mesh` class with auto-detection and `mmgpy.read()` function (#85)

### Changed

- Remeshing methods now return `RemeshResult` instead of `bool`

## [0.3.0] - 2024

### Added

- Local sizing parameters API for per-region mesh control (#81)
  - `set_size_sphere()`, `set_size_box()`, `set_size_cylinder()`, `set_size_from_point()`
- Typed options dataclasses: `Mmg3DOptions`, `Mmg2DOptions`, `MmgSOptions` (#70)
  - Factory methods: `.fine()`, `.coarse()`, `.optimize_only()`
- PyVista integration for mesh conversion (#69)
  - `mesh.to_pyvista()` and `mmgpy.from_pyvista()`
- Level-set discretization API (#68)
  - `mesh.remesh_levelset(levelset_field)`
- Topology query methods (#67)
  - `get_adjacent_elements()`, `get_vertex_neighbors()`
- Element attributes API (#66)
  - `set_corners()`, `set_required_vertices()`, `set_ridge_edges()`
- Logging module with Rich integration (#65)
  - `enable_debug()`, `set_log_level()`, `rich_progress()`
- Lagrangian motion remeshing (#64)
  - `mesh.remesh_lagrangian(displacement)`
- Field storage via `__getitem__`/`__setitem__` (#63)
  - `mesh["temperature"] = values`
- Convenience remeshing methods (#62)
  - `remesh_optimize()`, `remesh_uniform(size)`
- Bulk data operations for all mesh types (#61)

### Changed

- Updated VTK to 9.5.2 (#82)
- Improved wheel size optimization

## [0.2.0] - 2024

### Added

- Initial PyPI release
- Pre-built wheels for Windows, macOS, and Linux
- Support for Python 3.10 - 3.13
- `MmgMesh3D`, `MmgMesh2D`, `MmgMeshS` classes
- File-based remeshing: `mmg3d.remesh()`, `mmg2d.remesh()`, `mmgs.remesh()`
- Bundled MMG executables

### Fixed

- RPATH handling on macOS and Linux
- DLL loading on Windows

## [0.1.0] - 2024

### Added

- Initial release
- Basic pybind11 bindings for MMG library
- CMake build system with scikit-build-core

---

## Version Numbering

mmgpy follows [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking API changes
- **MINOR**: New features, backward compatible
- **PATCH**: Bug fixes, backward compatible

## Links

- [GitHub Releases](https://github.com/kmarchais/mmgpy/releases)
- [PyPI](https://pypi.org/project/mmgpy/)
