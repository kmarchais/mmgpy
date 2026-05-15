# SPDX-FileCopyrightText: 2026 Kevin Marchais
# SPDX-License-Identifier: GPL-3.0-or-later
"""Class registration for the MMGpy Blender add-on.

The add-on entry points (``bl_info``, ``register``, ``unregister``) live
here so that ``__init__.py`` can be a pure re-export shim.
"""

from __future__ import annotations

import bpy

from . import operators, panels, preferences, properties

bl_info = {
    "name": "MMGpy Remesh",
    "author": "Kevin Marchais",
    "version": (0, 9, 0),
    "blender": (4, 2, 0),
    "location": "View3D > Sidebar > MMGpy",
    "description": "Powerful mesh remeshing using MMG library",
    "warning": "",
    "doc_url": "https://github.com/kmarchais/mmgpy",
    "category": "Mesh",
}

# Property groups must be registered before anything that points at them
# via ``PointerProperty``.
classes = (
    properties.MMGPYSizingConstraint,
    properties.MMGPYSettings,
    operators.MMGPY_OT_autofit,
    operators.MMGPY_OT_remesh,
    operators.MMGPY_OT_add_sizing_sphere,
    operators.MMGPY_OT_add_sizing_box,
    operators.MMGPY_OT_remove_sizing_constraint,
    operators.MMGPY_OT_clear_sizing_constraints,
    panels.MMGPY_PT_main_panel,
    panels.MMGPY_PT_size_control,
    panels.MMGPY_PT_geometry,
    panels.MMGPY_PT_visualization,
    panels.MMGPY_PT_local_refinement,
    preferences.MMGPYPreferences,
)


def register() -> None:
    """Register every add-on class and the scene-level settings pointer."""
    for cls in classes:
        bpy.utils.register_class(cls)
    bpy.types.Scene.mmgpy = bpy.props.PointerProperty(type=properties.MMGPYSettings)


def unregister() -> None:
    """Unregister the scene pointer and every add-on class (reverse order)."""
    del bpy.types.Scene.mmgpy
    for cls in reversed(classes):
        bpy.utils.unregister_class(cls)
