# SPDX-FileCopyrightText: 2026 Kevin Marchais
# SPDX-License-Identifier: GPL-3.0-or-later
"""MMGpy Blender Extension - Powerful mesh remeshing using the MMG library.

This extension provides a user-friendly interface for remeshing meshes directly
within Blender using the mmgpy library (Python bindings for MMG).

Features:
- Remesh selected mesh objects with customizable parameters
- Presets for quick remeshing (Fine, Medium, Coarse)
- Local refinement via Empty objects (spheres, boxes)
- Batch processing of multiple objects
- Full undo/redo support
"""

from ._register import register, unregister

__all__ = ["register", "unregister"]
