---
icon: lucide/history
---

# Changelog

All notable changes to mmgpy are documented here.
This project follows [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Removed

- `mmg2d`, `mmg3d`, `mmgs` CLI commands — use the unified `mmg` command instead

## [0.9.0] - 2026-04-01

### Added

- `set_required_triangles` API and tests ([#206](https://github.com/kmarchais/mmgpy/pull/206))
- Complete constraint marker coverage and unset variants ([#208](https://github.com/kmarchais/mmgpy/pull/208))
- Set/get normal vectors at vertices for 3D and surface meshes ([#209](https://github.com/kmarchais/mmgpy/pull/209))
- `set_local_parameters` for region-specific mesh sizing ([#210](https://github.com/kmarchais/mmgpy/pull/210))
- Advanced topology queries ([#211](https://github.com/kmarchais/mmgpy/pull/211))
- Multi-material and level-set base reference support ([#212](https://github.com/kmarchais/mmgpy/pull/212))

### Changed

- Removed VTK bundling from build pipeline ([#204](https://github.com/kmarchais/mmgpy/pull/204))

## [0.8.0] - 2026-03-18

### Added

- Python 3.14 support
- Free-threaded Python 3.14 (`cp314t`) wheel builds for Linux

### Changed

- Upgrade build-time VTK from 9.5.2 to 9.6.0
- Build Linux x86_64 wheels with `manylinux_2_28`
- Widen VTK constraint from `>=9.5,<9.6` to `>=9.5,<9.7`
- Bump `pyvista` lower bound to `>=0.47`
- Add upper bounds to all runtime and optional dependencies
- Bump cibuildwheel from v3.0 to v3.4

## [0.7.1] - 2026-03-16

### Fixed

- Update examples to use `Mesh` class instead of deprecated `MmgMesh2D`/`3D`/`S` ([#186](https://github.com/kmarchais/mmgpy/pull/186))

## [0.7.0] - 2026-03-15

### Added

- Support for system-installed MMG via mmgsuite ([#183](https://github.com/kmarchais/mmgpy/pull/183))
- conda-forge package support ([#179](https://github.com/kmarchais/mmgpy/pull/179))

### Fixed

- Release GIL during remeshing, detect mesh corruption, fix stderr capture ([#177](https://github.com/kmarchais/mmgpy/pull/177))
- Set execute permissions on bundled executables for `uvx` installs ([#174](https://github.com/kmarchais/mmgpy/pull/174))

## [0.6.0] - 2026-03-08

### Added

- Editable install with automatic C++ rebuild ([#170](https://github.com/kmarchais/mmgpy/pull/170))

### Fixed

- Use stdlib logging in CLI error paths to fix Windows subprocess hang ([#172](https://github.com/kmarchais/mmgpy/pull/172))

### Changed

- Update dependencies to fix security alerts ([#167](https://github.com/kmarchais/mmgpy/pull/167))

## [0.5.2] - 2026-01-21

### Fixed

- Fix `PermissionError` when running `uvx mmgpy` commands on Linux/macOS ([#174](https://github.com/kmarchais/mmgpy/pull/174))

## [0.5.1] - 2026-01-20

### Added

- Enable editable install with automatic C++ rebuild

### Fixed

- Use stdlib logging in CLI error paths to fix Windows subprocess hang ([#172](https://github.com/kmarchais/mmgpy/pull/172))

### Changed

- Update dependencies to fix security alerts ([#167](https://github.com/kmarchais/mmgpy/pull/167))

## [0.5.0] - 2026-01-19

### Added

- Web-based mesh viewer and remeshing interface with trame ([#158](https://github.com/kmarchais/mmgpy/pull/158))
- Enhanced UI with dark mode, new options, and CLI entry point ([#161](https://github.com/kmarchais/mmgpy/pull/161))
- Unified `Mesh` class and `mmgpy.read()` function ([#85](https://github.com/kmarchais/mmgpy/pull/85))
- `RemeshResult` dataclass with statistics ([#87](https://github.com/kmarchais/mmgpy/pull/87))
- `mesh.validate()` method with comprehensive quality checks ([#88](https://github.com/kmarchais/mmgpy/pull/88))
- `mesh.plot()`, `mesh.vtk`, and unified `mmg` command ([#90](https://github.com/kmarchais/mmgpy/pull/90))
- Context manager support for mesh operations ([#93](https://github.com/kmarchais/mmgpy/pull/93))
- Solution field transfer during remeshing ([#156](https://github.com/kmarchais/mmgpy/pull/156))
- Progress callbacks with cancellation support ([#149](https://github.com/kmarchais/mmgpy/pull/149))
- File logging support and external logger integration ([#148](https://github.com/kmarchais/mmgpy/pull/148))
- Capture MMG warnings from stderr during remeshing ([#151](https://github.com/kmarchais/mmgpy/pull/151))
- Auto-triangulate non-triangular meshes (quads, polygons) ([#155](https://github.com/kmarchais/mmgpy/pull/155))
- Native MMG loading for Medit (.mesh) files ([#159](https://github.com/kmarchais/mmgpy/pull/159))
- Mesh repair utilities module ([#144](https://github.com/kmarchais/mmgpy/pull/144))
- Geometry convenience methods ([#139](https://github.com/kmarchais/mmgpy/pull/139))
- Interactive sizing editor for visual constraint definition ([#132](https://github.com/kmarchais/mmgpy/pull/132))
- Duplicate vertex detection with KD-tree ([#137](https://github.com/kmarchais/mmgpy/pull/137))
- Test coverage reporting with pytest-cov ([#131](https://github.com/kmarchais/mmgpy/pull/131))
- Performance benchmarks with pytest-benchmark ([#92](https://github.com/kmarchais/mmgpy/pull/92))
- MkDocs documentation site with API reference and tutorials ([#89](https://github.com/kmarchais/mmgpy/pull/89))
- CONTRIBUTING.md guide ([#94](https://github.com/kmarchais/mmgpy/pull/94))

### Fixed

- Save displacement and levelset fields during checkpoint ([#154](https://github.com/kmarchais/mmgpy/pull/154))
- `NotImplementedError` for unsupported Lagrangian motion in MMGS ([#153](https://github.com/kmarchais/mmgpy/pull/153))
- Standardize array initialization types to `py::ssize_t` in bindings ([#141](https://github.com/kmarchais/mmgpy/pull/141))
- Type validation for option casting in C++ bindings ([#138](https://github.com/kmarchais/mmgpy/pull/138))

### Changed

- Replace monkey-patching with Mesh wrapper class ([#142](https://github.com/kmarchais/mmgpy/pull/142))
- Simplify RPATH handling by removing Python runtime fixes ([#147](https://github.com/kmarchais/mmgpy/pull/147))

## [0.4.0] - 2026-01-18

Same content as [0.5.0] — released as a pre-release before the final 0.5.0.

## [0.3.0] - 2026-01-05

### Changed

- Updated VTK from 9.3.1/9.4.1 to 9.5.2
- Simplified Linux wheel builds to manylinux only (dropped musllinux)
- Aligned manylinux versions with PyPI VTK wheel availability
- Removed redundant CI workflow files

## [0.2.0] - 2026-01-01

### Added

- In-memory remeshing API for all mesh classes ([#63](https://github.com/kmarchais/mmgpy/pull/63))
- Lagrangian motion remeshing API ([#64](https://github.com/kmarchais/mmgpy/pull/64))
- Logging module and progress callbacks with Rich integration ([#65](https://github.com/kmarchais/mmgpy/pull/65))
- Element attributes API (`set_corners`, `set_required_vertices`, `set_ridge_edges`) ([#66](https://github.com/kmarchais/mmgpy/pull/66))
- Topology query methods (`get_adjacent_elements`, `get_vertex_neighbors`) ([#67](https://github.com/kmarchais/mmgpy/pull/67))
- Level-set discretization API ([#68](https://github.com/kmarchais/mmgpy/pull/68))
- PyVista integration (`mesh.to_pyvista()`, `mmgpy.from_pyvista()`) ([#69](https://github.com/kmarchais/mmgpy/pull/69))
- Typed options dataclasses with factory methods (`.fine()`, `.coarse()`, `.optimize_only()`) ([#70](https://github.com/kmarchais/mmgpy/pull/70))
- Local sizing parameters API (`set_size_sphere`, `set_size_box`, `set_size_cylinder`, `set_size_from_point`) ([#81](https://github.com/kmarchais/mmgpy/pull/81))

## [0.1.5] - 2025-12-31

### Added

- First PyPI release with `pip install mmgpy`
- Pre-built wheels for Windows, macOS, and Linux

### Changed

- Updated bundled VTK to 9.4.1
- Optimized wheel sizes (all under 100MB)

## [0.1.4] - 2025-08-29

Maintenance release with version bump.

## [0.1.1] - 2024-12-21

### Added

- MMG compiled with VTK support
- Python 3.9 support
- pre-commit configuration

## [0.1.0] - 2024

### Added

- Initial release
- Basic pybind11 bindings for MMG library
- CMake build system with scikit-build-core

---

## Links

- [GitHub Releases](https://github.com/kmarchais/mmgpy/releases)
- [PyPI](https://pypi.org/project/mmgpy/)

[0.9.0]: https://github.com/kmarchais/mmgpy/compare/v0.8.0...v0.9.0
[0.8.0]: https://github.com/kmarchais/mmgpy/compare/v0.7.1...v0.8.0
[0.7.1]: https://github.com/kmarchais/mmgpy/compare/v0.7.0...v0.7.1
[0.7.0]: https://github.com/kmarchais/mmgpy/compare/v0.6.0...v0.7.0
[0.6.0]: https://github.com/kmarchais/mmgpy/compare/v0.5.2...v0.6.0
[0.5.2]: https://github.com/kmarchais/mmgpy/compare/v0.5.1...v0.5.2
[0.5.1]: https://github.com/kmarchais/mmgpy/compare/v0.5.0...v0.5.1
[0.5.0]: https://github.com/kmarchais/mmgpy/compare/v0.3.0...v0.5.0
[0.4.0]: https://github.com/kmarchais/mmgpy/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/kmarchais/mmgpy/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/kmarchais/mmgpy/compare/v0.1.5...v0.2.0
[0.1.5]: https://github.com/kmarchais/mmgpy/compare/v0.1.4...v0.1.5
[0.1.4]: https://github.com/kmarchais/mmgpy/compare/v0.1.1...v0.1.4
[0.1.1]: https://github.com/kmarchais/mmgpy/compare/v0.0.1...v0.1.1
