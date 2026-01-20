# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.5.1] - 2026-01-20

### Added

- Enable editable install with automatic C++ rebuild

### Fixed

- Use stdlib logging in CLI error paths to fix Windows subprocess hang ([#172](https://github.com/kmarchais/mmgpy/pull/172))

### Changed

- Update dependencies to fix security alerts ([#167](https://github.com/kmarchais/mmgpy/pull/167))

## [0.5.0] - 2026-01-19

### Added

- `uvx mmgpy-ui` entry point for running UI without installation ([#164](https://github.com/kmarchais/mmgpy/pull/164))

### Fixed

- Include MMG executables in wheel packages ([#163](https://github.com/kmarchais/mmgpy/pull/163))
- Windows executable support with proper DLL handling ([#164](https://github.com/kmarchais/mmgpy/pull/164))
- Dependency check workflow issues ([#162](https://github.com/kmarchais/mmgpy/pull/162))

## [0.4.0] - 2026-01-18

### Added

- Web-based mesh viewer and remeshing interface with trame ([#158](https://github.com/kmarchais/mmgpy/pull/158))
- Enhanced UI with dark mode, new options, and CLI entry point `mmgpy-ui` ([#161](https://github.com/kmarchais/mmgpy/pull/161))
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
- Geometry convenience methods for mesh classes ([#139](https://github.com/kmarchais/mmgpy/pull/139))
- Interactive sizing editor for visual constraint definition ([#132](https://github.com/kmarchais/mmgpy/pull/132))
- Test coverage reporting with pytest-cov ([#131](https://github.com/kmarchais/mmgpy/pull/131))
- Performance benchmarks with pytest-benchmark ([#92](https://github.com/kmarchais/mmgpy/pull/92))
- MkDocs documentation site with API reference and tutorials ([#89](https://github.com/kmarchais/mmgpy/pull/89))
- CONTRIBUTING.md and GitHub templates ([#94](https://github.com/kmarchais/mmgpy/pull/94))

### Fixed

- Save displacement and levelset fields during checkpoint ([#154](https://github.com/kmarchais/mmgpy/pull/154))
- Add NotImplementedError for unsupported Lagrangian motion in MMGS ([#153](https://github.com/kmarchais/mmgpy/pull/153))
- Standardize array initialization types to py::ssize_t in bindings ([#141](https://github.com/kmarchais/mmgpy/pull/141))
- Type validation for option casting in C++ bindings ([#138](https://github.com/kmarchais/mmgpy/pull/138))

### Changed

- Improved duplicate vertex detection with KD-tree ([#137](https://github.com/kmarchais/mmgpy/pull/137))
- Replace monkey-patching with Mesh wrapper class ([#142](https://github.com/kmarchais/mmgpy/pull/142))
- Simplify RPATH handling by removing Python runtime fixes ([#147](https://github.com/kmarchais/mmgpy/pull/147))
- Improved type stubs with comprehensive documentation ([#143](https://github.com/kmarchais/mmgpy/pull/143))
- Centralize VTK version in pyproject.toml ([#145](https://github.com/kmarchais/mmgpy/pull/145))
- Centralize MMG version in pyproject.toml ([#146](https://github.com/kmarchais/mmgpy/pull/146))
- Optimize build times with native ARM64 and VTK caching ([#91](https://github.com/kmarchais/mmgpy/pull/91))
- Calibrate benchmark thresholds based on CI variance ([#135](https://github.com/kmarchais/mmgpy/pull/135))
- Split mesh_test.py into focused test modules ([#133](https://github.com/kmarchais/mmgpy/pull/133))
- Reduce per-file ignores by fixing ruff violations ([#103](https://github.com/kmarchais/mmgpy/pull/103), [#104](https://github.com/kmarchais/mmgpy/pull/104))

## [0.3.0] - 2026-01-05

### Changed

- Update VTK from 9.3.1/9.4.1 to 9.5.2 ([#82](https://github.com/kmarchais/mmgpy/pull/82))
- Simplify Linux wheel builds to manylinux only (dropped musllinux support)
- Align manylinux versions with PyPI VTK wheel availability (x86_64: manylinux2014, aarch64: manylinux_2_28)

### Removed

- Redundant workflow files: `publish-to-pypi.yml` and `publish-wheels.yml` ([#82](https://github.com/kmarchais/mmgpy/pull/82))

## [0.2.0] - 2026-01-01

### Added

- In-memory remeshing API for all mesh classes ([#63](https://github.com/kmarchais/mmgpy/pull/63))
- Lagrangian motion remeshing API ([#64](https://github.com/kmarchais/mmgpy/pull/64))
- Logging module and progress callbacks with Rich integration ([#65](https://github.com/kmarchais/mmgpy/pull/65))
- Element attributes API for mesh classes ([#66](https://github.com/kmarchais/mmgpy/pull/66))
- Topology query methods for mesh analysis ([#67](https://github.com/kmarchais/mmgpy/pull/67))
- Level-set discretization API for mesh classes ([#68](https://github.com/kmarchais/mmgpy/pull/68))
- PyVista integration for mesh conversion ([#69](https://github.com/kmarchais/mmgpy/pull/69))
- Typed options dataclasses and convenience methods ([#70](https://github.com/kmarchais/mmgpy/pull/70))
- Local sizing parameters API for per-region mesh control ([#81](https://github.com/kmarchais/mmgpy/pull/81))
- Comprehensive MMGS (surface mesh) test suite with PyVista quality validation ([#55](https://github.com/kmarchais/mmgpy/pull/55))
- Tensor metric support for anisotropic mesh adaptation ([#54](https://github.com/kmarchais/mmgpy/pull/54))
- Low-level mesh construction API exposing MMG internal functions ([#52](https://github.com/kmarchais/mmgpy/pull/52))
- C-contiguity validation for NumPy arrays to prevent silent data corruption ([#53](https://github.com/kmarchais/mmgpy/pull/53))
- RECORD file regeneration in wheel optimization script for PyPI compliance ([#59](https://github.com/kmarchais/mmgpy/pull/59))
- Test cleanup using pytest `tmp_path` fixture ([#60](https://github.com/kmarchais/mmgpy/pull/60))

### Fixed

- Memory safety issue with mesh data lifetime management ([#49](https://github.com/kmarchais/mmgpy/pull/49))
- Quality test early return bug causing incomplete test coverage ([#57](https://github.com/kmarchais/mmgpy/pull/57))
- Invalid cibuildwheel skip selector syntax ([#59](https://github.com/kmarchais/mmgpy/pull/59))
- Initialize success variable to prevent undefined behavior ([#62](https://github.com/kmarchais/mmgpy/pull/62))

### Changed

- License changed to MIT ([#48](https://github.com/kmarchais/mmgpy/pull/48))
- Update README to reflect Linux wheel availability on PyPI ([#56](https://github.com/kmarchais/mmgpy/pull/56))
- Update Python versions and optimize PR builds in CI ([#61](https://github.com/kmarchais/mmgpy/pull/61))

### Removed

- Deprecated GitHub Actions workflows (`publish.yml`, `build-with-cmake.yml`) ([#58](https://github.com/kmarchais/mmgpy/pull/58))

## [0.1.5] - 2025-12-31

### Added

- Initial PyPI release with pre-built wheels for Windows, macOS (x86_64, arm64), and Linux (x86_64)
- MMG2D, MMG3D, and MMGS Python bindings
- File-based remeshing API
- Bundled MMG executables (`mmg2d_O3`, `mmg3d_O3`, `mmgs_O3`)
- Bundled VTK 9.4.1 libraries

### Changed

- Optimized wheel sizes (under 100MB) for PyPI upload
- Linux manylinux wheels with proper platform tags

[Unreleased]: https://github.com/kmarchais/mmgpy/compare/v0.5.1...HEAD
[0.5.1]: https://github.com/kmarchais/mmgpy/compare/v0.5.0...v0.5.1
[0.5.0]: https://github.com/kmarchais/mmgpy/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/kmarchais/mmgpy/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/kmarchais/mmgpy/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/kmarchais/mmgpy/compare/v0.1.5...v0.2.0
[0.1.5]: https://github.com/kmarchais/mmgpy/releases/tag/v0.1.5
