# Contributing to mmgpy

Thank you for your interest in contributing! This guide covers everything you need to get started.

## Table of Contents

- [Development Setup](#development-setup)
- [Project Architecture](#project-architecture)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [C++ Bindings Development](#c-bindings-development)

---

## Development Setup

### Prerequisites

- Python 3.9+
- C++17 compiler (GCC 9+, Clang 10+, MSVC 2019+)
- CMake 3.18+
- Git

### Quick Start

```bash
# Clone repository
git clone https://github.com/kmarchais/mmgpy.git
cd mmgpy

# Create virtual environment and install dev dependencies
uv sync

# Build C++ extension (editable install)
uv pip install -e .

# Verify installation
uv run pytest tests/ -v
```

### IDE Setup

**VS Code** (recommended):

```json
// .vscode/settings.json
{
  "python.defaultInterpreterPath": ".venv/bin/python",
  "python.analysis.typeCheckingMode": "basic",
  "[python]": {
    "editor.defaultFormatter": "charliermarsh.ruff",
    "editor.formatOnSave": true
  }
}
```

---

## Project Architecture

```
mmgpy/
├── src/
│   ├── mmgpy/           # Python package
│   │   ├── __init__.py  # Public API, RPATH fixing
│   │   ├── _options.py  # Typed options dataclasses
│   │   └── _mmgpy.pyi   # Type stubs for C++ extension
│   └── bindings/        # pybind11 C++ bindings
│       ├── bindings.cpp # Module definition
│       ├── mmg3d.cpp    # MMG3D wrapper
│       ├── mmg2d.cpp    # MMG2D wrapper
│       └── mmgs.cpp     # MMGS wrapper
├── extern/
│   └── CMakeLists.txt   # Fetches MMG library
├── tests/               # pytest test suite
└── pyproject.toml       # Build configuration
```

### Key Components

| Component       | Purpose                                   |
| --------------- | ----------------------------------------- |
| `_mmgpy`        | C++ extension module (pybind11)           |
| `MmgMesh*`      | Mesh classes wrapping MMG data structures |
| `mmg*.remesh()` | Static remeshing functions                |
| `_options.py`   | Typed configuration dataclasses           |

---

## Coding Standards

### Python

- **Formatter**: Ruff (runs automatically via pre-commit)
- **Linter**: Ruff with nearly all rules enabled
- **Type hints**: Required for all public functions
- **Docstrings**: NumPy style

```python
def example_function(mesh: MmgMesh3D, *, hmax: float) -> int:
    """Short description of function.

    Longer description if needed.

    Parameters
    ----------
    mesh : MmgMesh3D
        The mesh to process.
    hmax : float
        Maximum edge length.

    Returns
    -------
    int
        Number of elements created.

    Raises
    ------
    ValueError
        If hmax is not positive.

    Examples
    --------
    >>> result = example_function(mesh, hmax=0.1)
    >>> print(result)
    42
    """
    ...
```

### C++

- **Standard**: C++17
- **Style**: clang-format (Mozilla style, modified)
- **Naming**: snake_case for functions, PascalCase for classes

---

## Testing

### Running Tests

```bash
# All tests
uv run pytest

# Specific file
uv run pytest tests/mmg3d_test.py -v

# With coverage
uv run pytest --cov=mmgpy --cov-report=html
```

### Writing Tests

```python
import numpy as np
import pytest
from mmgpy import MmgMesh3D

class TestNewFeature:
    """Tests for new feature."""

    @pytest.fixture
    def sample_mesh(self) -> MmgMesh3D:
        """Create a simple test mesh."""
        vertices = np.array([[0,0,0], [1,0,0], [0,1,0], [0,0,1]], dtype=np.float64)
        elements = np.array([[0,1,2,3]], dtype=np.int32)
        return MmgMesh3D(vertices, elements)

    def test_feature_basic(self, sample_mesh: MmgMesh3D) -> None:
        """Test basic functionality."""
        result = sample_mesh.new_feature()
        assert result is not None

    def test_feature_edge_case(self, sample_mesh: MmgMesh3D) -> None:
        """Test edge case handling."""
        with pytest.raises(ValueError, match="invalid input"):
            sample_mesh.new_feature(invalid=True)
```

---

## Pull Request Process

### Before Submitting

1. **Create branch**: `git checkout -b feat/your-feature`
2. **Make changes**: Follow coding standards
3. **Add tests**: Cover new functionality
4. **Run checks**:
   ```bash
   uv run ruff check src/ tests/
   uv run ruff format src/ tests/
   uv run mypy src/mmgpy/
   uv run pytest
   ```
5. **Commit**: Use conventional commits (`feat:`, `fix:`, `docs:`, etc.)

### Review Process

1. CI must pass (tests, linting, type checking)
2. Maintainer reviews code
3. Address feedback
4. Squash merge when approved

---

## C++ Bindings Development

### Adding New Bindings

1. **Implement in C++**:

   ```cpp
   // src/bindings/mmg3d.cpp
   void MmgMesh3D_new_method(MmgMesh3D& self, double param) {
       // Implementation using MMG API
       MMG3D_Set_dparameter(self.mesh, self.sol, MMG3D_DPARAM_..., param);
   }
   ```

2. **Bind with pybind11**:

   ```cpp
   // src/bindings/bindings.cpp
   mesh3d_class.def("new_method", &MmgMesh3D_new_method,
       py::arg("param"),
       "Docstring for new method.");
   ```

3. **Update type stubs**:

   ```python
   # src/mmgpy/_mmgpy.pyi
   class MmgMesh3D:
       def new_method(self, param: float) -> None: ...
   ```

4. **Rebuild**: C++ changes are automatically rebuilt on import. For faster incremental builds:
   ```bash
   cmake --build build  # Fast incremental rebuild
   ```

### Debugging C++ Code

```bash
# Build with debug symbols
CMAKE_BUILD_TYPE=Debug uv pip install -e .

# Run with gdb
gdb --args python -c "import mmgpy; ..."
```

---

## Questions?

- Open an [issue](https://github.com/kmarchais/mmgpy/issues) for questions
- Join [discussions](https://github.com/kmarchais/mmgpy/discussions) for broader topics
- Tag @kmarchais for urgent matters
