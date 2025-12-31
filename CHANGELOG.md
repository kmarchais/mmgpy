# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

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

### Changed

- License changed to MIT ([#48](https://github.com/kmarchais/mmgpy/pull/48))
- Updated README to reflect Linux wheel availability on PyPI ([#56](https://github.com/kmarchais/mmgpy/pull/56))

### Removed

- Deprecated GitHub Actions workflows (`publish.yml`, `build-with-cmake.yml`) ([#58](https://github.com/kmarchais/mmgpy/pull/58))

## [0.1.5] - 2024-12-15

### Added

- Initial release with MMG2D, MMG3D, and MMGS Python bindings
- File-based remeshing API
- Pre-built wheels for Windows, macOS (x86_64, arm64), and Linux (x86_64)
- Bundled MMG executables (`mmg2d_O3`, `mmg3d_O3`, `mmgs_O3`)

[Unreleased]: https://github.com/kmarchais/mmgpy/compare/v0.1.5...HEAD
[0.1.5]: https://github.com/kmarchais/mmgpy/releases/tag/v0.1.5
