# mmgpy

This is a Python package that provides bindings for the [MMG software](https://www.mmgtools.org) for mesh generation and optimization.

## Installation

To install the package, run the following command:

```bash
pip install mmgpy
```

Or directly from this repository:

```bash
pip install git+https://github.com/kmarchais/mmgpy.git
```

for `uv` users:

```bash
uv pip install mmgpy
```

## Build dependencies

- pybind11: Used for Python bindings

  - BSD 3-Clause License
  - Copyright (c) 2016 Wenzel Jakob <wenzel.jakob@epfl.ch>

- CMake (>= 3.0): Build system

  - BSD 3-Clause License
  - Copyright 2000-2024 Kitware, Inc. and Contributors

- scikit-build: Python build system integration

  - MIT License
  - Copyright (c) 2014 Mike Sarahan

- pytest: Testing framework

  - MIT License
  - Copyright (c) 2004 Holger Krekel and others
