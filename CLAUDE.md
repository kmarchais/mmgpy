# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**mmgpy** is a Python package providing pybind11 bindings for the MMG mesh generation/optimization library (https://www.mmgtools.org). It enables 2D, 3D, and surface mesh remeshing through both a Python API and bundled executables.

- **Build system:** CMake + scikit-build-core
- **Package manager:** uv (with pip fallback)
- **Python support:** 3.9 - 3.13

## Common Commands

```bash
# Install dev environment
uv sync

# Run tests
uv run pytest                           # All tests
uv run pytest tests/mmg3d_test.py -v    # Specific test file

# Linting and formatting
uv run ruff check --fix src/ tests/
uv run ruff format src/ tests/
uv run mypy src/mmgpy/

# Build wheel
python -m build --wheel
```

## Architecture

```
src/
├── mmgpy/              # Python package
│   ├── __init__.py     # Entry point, RPATH fixing, executable wrappers
│   └── _mmgpy.pyi      # Type stubs for C++ extension
├── bindings/           # pybind11 C++ bindings
│   ├── bindings.cpp    # Main pybind11 module
│   ├── mmg3d.cpp       # MMG3D wrapper
│   ├── mmg2d.cpp       # MMG2D wrapper
│   ├── mmgs.cpp        # MMGS wrapper
│   ├── mmg_mesh.cpp    # MmgMesh class implementation
│   └── mmg_common.cpp  # Shared utilities (mesh/option conversion)
└── CMakeLists.txt

extern/
└── CMakeLists.txt      # Fetches MMG library via FetchContent

tests/
├── mmg3d_test.py       # 3D remeshing with PyVista quality validation
├── mmg2d_test.py       # 2D remeshing
├── mesh_test.py        # MmgMesh class tests
└── rpath_fix_test.py   # macOS/Linux RPATH validation
```

## Key Python API

- `mmg3d.remesh(input, output, options)` - 3D mesh remeshing
- `mmg2d.remesh(input, output, options)` - 2D mesh remeshing
- `mmgs.remesh(input, output, options)` - Surface mesh remeshing
- `MmgMesh` - Low-level mesh class with field storage (scalars, vectors, tensors)

## Platform-Specific Considerations

- **macOS/Linux:** RPATH auto-fixing runs at import time; uses `patchelf` (Linux) or `install_name_tool` (macOS)
- **Windows:** DLL loading via `os.add_dll_directory()` and PATH manipulation
- **Debug:** Set `MMGPY_DEBUG=1` for verbose output

## Build Pipeline

1. CMake builds MMG via FetchContent (from extern/)
2. pybind11 compiles C++ bindings into `_mmgpy` extension
3. scikit-build-core integrates CMake with Python wheel building
4. Platform-specific VTK handling (bundled from pre-built binaries, not system packages)

## Ruff Configuration Notes

All rules enabled except INP001. Per-file exceptions exist in pyproject.toml for tests (S101, T201, SLF001) and **init**.py (S603, E402, C901 for subprocess/lazy loading patterns).
