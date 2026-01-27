# SPDX-FileCopyrightText: 2026 Kevin Marchais
# SPDX-License-Identifier: MIT
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

from __future__ import annotations

import bpy

from . import operators, panels, preferences, properties

bl_info = {
    "name": "MMGpy Remesh",
    "author": "Kevin Marchais",
    "version": (0, 6, 0),
    "blender": (4, 2, 0),
    "location": "View3D > Sidebar > MMGpy",
    "description": "Powerful mesh remeshing using MMG library",
    "warning": "",
    "doc_url": "https://github.com/kmarchais/mmgpy",
    "category": "Mesh",
}

# All classes to register
classes = (
    # Properties (must be registered first)
    properties.MMGPYSettings,
    properties.MMGPYSizingConstraint,
    # Operators
    operators.MMGPY_OT_remesh,
    operators.MMGPY_OT_add_sizing_sphere,
    operators.MMGPY_OT_add_sizing_box,
    operators.MMGPY_OT_remove_sizing_constraint,
    operators.MMGPY_OT_clear_sizing_constraints,
    # UI Panels
    panels.MMGPY_PT_main_panel,
    panels.MMGPY_PT_size_control,
    panels.MMGPY_PT_geometry,
    panels.MMGPY_PT_local_refinement,
    # Preferences
    preferences.MMGPYPreferences,
)


def register() -> None:
    """Register the addon classes and properties."""
    for cls in classes:
        bpy.utils.register_class(cls)

    # Register scene properties
    bpy.types.Scene.mmgpy = bpy.props.PointerProperty(type=properties.MMGPYSettings)


def unregister() -> None:
    """Unregister the addon classes and properties."""
    # Unregister scene properties
    del bpy.types.Scene.mmgpy

    # Unregister classes in reverse order
    for cls in reversed(classes):
        bpy.utils.unregister_class(cls)


if __name__ == "__main__":
    register()
