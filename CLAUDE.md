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

## UI Development

The interface is built with **trame** (PyVista + Vuetify 3). Main file: `src/mmgpy/ui/app.py`

### Running the UI

```bash
# Start UI as desktop app (default)
uv run python -m mmgpy.ui

# Run in browser instead
uv run python -m mmgpy.ui --browser

# For development: use fixed port + --server to avoid opening new tabs
uv run python -m mmgpy.ui --browser --port 8080 --server

# With debug mode
uv run python -m mmgpy.ui --browser --port 8080 --server --debug
```

### Development Workflow

**IMPORTANT:** Do NOT run the UI from Claude's background processes - it doesn't work reliably. The user should run it directly from their terminal:

```bash
uv run python -m mmgpy.ui --browser --port 8080 --server
```

When debugging the UI:

1. **User runs the server** in their terminal (not Claude)
2. **Use a fixed port** (`--port 8080`) so the URL stays the same after restarts
3. **Use `--server`** to prevent opening new browser tabs on each restart
4. After code changes: user kills and restarts the server, then reloads the browser

### Trame/Vuetify Patterns

- **State binding**: `v_model=("state_var",)` - tuple with state variable name
- **Unique items for VSelect**: Each dropdown needs unique state name for items: `items=("unique_name", [...])`
- **Callbacks**: `@self.state.change("var1", "var2")` for reactive updates
- **Triggers**: `self.server.trigger("name")(func)` + `click="trigger('name')"`
- **VSelect groups**: Use `{"type": "subheader", "title": "..."}` and `{"type": "divider"}` for separators

### Quality Metrics

- **In-Radius Ratio** (MMG): `quality = area / sum(edge²)` for triangles, `volume / (sum(edge²))^(3/2)` for tetrahedra
- **Scaled Jacobian** (PyVista/VTK): `pv_mesh.cell_quality(quality_measure="scaled_jacobian")`
- Both normalize to 1.0 for equilateral elements
