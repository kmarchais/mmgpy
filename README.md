# mmgpy

This is a Python package that provides bindings for the [MMG software](https://www.mmgtools.org) for mesh generation and optimization.
The goal in the end is to provide a pythonic interface to mmg's capabilities.

Example from [`examples/mmgs/mechanical_piece_remeshing.py`](https://github.com/kmarchais/mmgpy/blob/main/examples/mmgs/mechanical_piece_remeshing.py) ([original tutorial](https://www.mmgtools.org/mmg-remesher-try-mmg/mmg-remesher-tutorials/mmg-remesher-mmgs/mmg-remesher-mechanical-piece-remeshing)):
![Mechanical piece remeshing](assets/mechanical_piece_remeshing.png)

Example from [`examples/mmgs/smooth_surface_remeshing.py`](https://github.com/kmarchais/mmgpy/blob/main/examples/mmgs/smooth_surface_remeshing.py) ([original tutorial](https://www.mmgtools.org/mmg-remesher-try-mmg/mmg-remesher-tutorials/mmg-remesher-mmgs/mmg-remesher-smooth-surface-remeshing)):
![Smooth surface remeshing](assets/smooth_surface_remeshing.png)

Example from [`examples/mmg3d/mesh_quality_improvement.py`](https://github.com/kmarchais/mmgpy/blob/main/examples/mmg3d/mesh_quality_improvement.py) ([original tutorial](https://www.mmgtools.org/mmg-remesher-try-mmg/mmg-remesher-tutorials/mmg-remesher-mmg3d/mesh-quality-improvement-with-mean-edge-lengths-preservation)):
![Mesh quality improvement with mean edge lengths preservation](assets/3d_mesh.png)

## Installation

Install from PyPI (Windows, macOS, and Linux):

```bash
pip install mmgpy
```

Or with `uv`:

```bash
uv pip install mmgpy
```

To install directly from the repository:

```bash
pip install git+https://github.com/kmarchais/mmgpy.git
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
