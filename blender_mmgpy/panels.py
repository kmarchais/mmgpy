# SPDX-FileCopyrightText: 2026 Kevin Marchais
# SPDX-License-Identifier: MIT
"""UI panels for MMGpy Blender extension."""

from __future__ import annotations

from typing import TYPE_CHECKING

from bpy.types import Panel

if TYPE_CHECKING:
    from bpy.types import Context


class MMGPY_PT_main_panel(Panel):
    """Main panel for MMGpy in the 3D View sidebar."""

    bl_label = "MMGpy Remesh"
    bl_idname = "MMGPY_PT_main_panel"
    bl_space_type = "VIEW_3D"
    bl_region_type = "UI"
    bl_category = "MMGpy"

    def draw(self, context: Context) -> None:
        """Draw the panel."""
        layout = self.layout
        settings = context.scene.mmgpy

        # Preset selection
        row = layout.row()
        row.prop(settings, "preset", text="Preset")

        # Main remesh button
        layout.separator()
        row = layout.row(align=True)
        row.scale_y = 1.5
        row.operator("mmgpy.remesh", text="Remesh", icon="MOD_REMESH")

        # Show active object info
        obj = context.active_object
        if obj is not None and obj.type == "MESH":
            box = layout.box()
            col = box.column(align=True)
            col.label(text=f"Object: {obj.name}", icon="MESH_DATA")
            col.label(text=f"Vertices: {len(obj.data.vertices)}")
            col.label(text=f"Faces: {len(obj.data.polygons)}")


class MMGPY_PT_size_control(Panel):
    """Size control sub-panel."""

    bl_label = "Size Control"
    bl_idname = "MMGPY_PT_size_control"
    bl_space_type = "VIEW_3D"
    bl_region_type = "UI"
    bl_category = "MMGpy"
    bl_parent_id = "MMGPY_PT_main_panel"
    bl_options = {"DEFAULT_CLOSED"}

    def draw(self, context: Context) -> None:
        """Draw the panel."""
        layout = self.layout
        settings = context.scene.mmgpy

        # Uniform size option
        col = layout.column(align=True)
        row = col.row()
        row.prop(settings, "use_hsiz", text="")
        sub = row.row()
        sub.active = settings.use_hsiz
        sub.prop(settings, "hsiz", text="Uniform Size")

        # Min/Max size (disabled when uniform is used)
        layout.separator()
        col = layout.column(align=True)
        col.active = not settings.use_hsiz

        row = col.row()
        row.prop(settings, "use_hmin", text="")
        sub = row.row()
        sub.active = settings.use_hmin and not settings.use_hsiz
        sub.prop(settings, "hmin", text="Min Size")

        row = col.row()
        row.prop(settings, "use_hmax", text="")
        sub = row.row()
        sub.active = settings.use_hmax and not settings.use_hsiz
        sub.prop(settings, "hmax", text="Max Size")

        # Gradation
        layout.separator()
        row = layout.row()
        row.prop(settings, "use_hgrad", text="")
        sub = row.row()
        sub.active = settings.use_hgrad
        sub.prop(settings, "hgrad", text="Gradation")


class MMGPY_PT_geometry(Panel):
    """Geometry control sub-panel."""

    bl_label = "Geometry"
    bl_idname = "MMGPY_PT_geometry"
    bl_space_type = "VIEW_3D"
    bl_region_type = "UI"
    bl_category = "MMGpy"
    bl_parent_id = "MMGPY_PT_main_panel"
    bl_options = {"DEFAULT_CLOSED"}

    def draw(self, context: Context) -> None:
        """Draw the panel."""
        layout = self.layout
        settings = context.scene.mmgpy

        # Hausdorff distance
        col = layout.column(align=True)
        row = col.row()
        row.prop(settings, "use_hausd", text="")
        sub = row.row()
        sub.active = settings.use_hausd
        sub.prop(settings, "hausd", text="Hausdorff")

        # Angle detection
        layout.separator()
        row = layout.row()
        row.prop(settings, "use_ar", text="")
        sub = row.row()
        sub.active = settings.use_ar
        sub.prop(settings, "ar", text="Angle Detection")

        # Advanced options toggle
        layout.separator()
        layout.prop(
            settings,
            "show_advanced",
            text="Advanced Options",
            icon="DOWNARROW_HLT" if settings.show_advanced else "RIGHTARROW",
        )

        if settings.show_advanced:
            box = layout.box()
            col = box.column(align=True)
            col.prop(settings, "optim", text="Optimize Only")
            col.prop(settings, "noinsert", text="No Insert")
            col.prop(settings, "noswap", text="No Swap")
            col.prop(settings, "nomove", text="No Move")
            col.separator()
            col.prop(settings, "verbose", text="Verbosity")


class MMGPY_PT_local_refinement(Panel):
    """Local refinement sub-panel."""

    bl_label = "Local Refinement"
    bl_idname = "MMGPY_PT_local_refinement"
    bl_space_type = "VIEW_3D"
    bl_region_type = "UI"
    bl_category = "MMGpy"
    bl_parent_id = "MMGPY_PT_main_panel"
    bl_options = {"DEFAULT_CLOSED"}

    def draw(self, context: Context) -> None:
        """Draw the panel."""
        layout = self.layout
        settings = context.scene.mmgpy

        # Add buttons
        row = layout.row(align=True)
        row.operator("mmgpy.add_sizing_sphere", text="Add Sphere", icon="SPHERE")
        row.operator("mmgpy.add_sizing_box", text="Add Box", icon="CUBE")

        # List of constraints
        if settings.sizing_constraints:
            layout.separator()
            box = layout.box()

            for i, constraint in enumerate(settings.sizing_constraints):
                row = box.row(align=True)

                # Icon based on type
                icon = "SPHERE" if constraint.constraint_type == "SPHERE" else "CUBE"
                row.label(text="", icon=icon)

                # Empty object selector
                row.prop(constraint, "empty_object", text="")

                # Target size
                row.prop(constraint, "target_size", text="Size")

                # Remove button
                op = row.operator("mmgpy.remove_sizing_constraint", text="", icon="X")
                op.index = i

            # Clear all button
            layout.separator()
            layout.operator(
                "mmgpy.clear_sizing_constraints",
                text="Clear All",
                icon="TRASH",
            )
        else:
            layout.label(text="No constraints defined", icon="INFO")
            layout.label(text="Add spheres or boxes to define")
            layout.label(text="local refinement zones.")
