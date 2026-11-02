# SPDX-FileCopyrightText: 2026 Kevin Marchais
# SPDX-License-Identifier: GPL-3.0-or-later
"""UI panels for MMGpy Blender extension."""

from __future__ import annotations

from typing import TYPE_CHECKING, ClassVar

import bpy
from bpy.types import Panel

from . import utils
from .translations import CONTEXT, iface_

if TYPE_CHECKING:
    from bpy.types import Context, Node, Object, PropertyGroup, UILayout

    QualityStats = dict[str, float] | None


class MMGPY_PT_main_panel(Panel):
    """Main panel for MMGpy in the 3D View sidebar."""

    bl_label = "MMGpy Remesh"
    bl_translation_context = CONTEXT
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
        row.prop(settings, "preset", text_ctxt=CONTEXT, text="Preset")

        # Main remesh button
        layout.separator()
        row = layout.row(align=True)
        row.scale_y = 1.5
        row.operator(
            "mmgpy.remesh", text_ctxt=CONTEXT, text="Remesh", icon="MOD_REMESH"
        )

        # Show active object info
        obj = context.active_object
        if obj is not None and obj.type == "MESH":
            box = layout.box()
            col = box.column(align=True)
            col.label(
                text=iface_("Object: {name}").format(name=obj.name),
                icon="MESH_DATA",
                translate=False,
            )
            col.label(
                text=iface_("Vertices: {count:,}").format(count=len(obj.data.vertices)),
                translate=False,
            )
            col.label(
                text=iface_("Faces: {count:,}").format(count=len(obj.data.polygons)),
                translate=False,
            )


class MMGPY_PT_size_control(Panel):
    """Size control sub-panel."""

    bl_label = "Size Control"
    bl_translation_context = CONTEXT
    bl_idname = "MMGPY_PT_size_control"
    bl_space_type = "VIEW_3D"
    bl_region_type = "UI"
    bl_category = "MMGpy"
    bl_parent_id = "MMGPY_PT_main_panel"
    bl_options: ClassVar[set[str]] = {"DEFAULT_CLOSED"}

    def draw(self, context: Context) -> None:
        """Draw the panel."""
        layout = self.layout
        settings = context.scene.mmgpy

        # Auto-fit button
        layout.operator(
            "mmgpy.autofit",
            text_ctxt=CONTEXT,
            text="Auto-fit to Mesh",
            icon="FULLSCREEN_ENTER",
        )
        layout.separator()

        # Uniform size option
        col = layout.column(align=True)
        row = col.row()
        row.prop(settings, "use_hsiz", text="")
        sub = row.row()
        sub.active = settings.use_hsiz
        sub.prop(settings, "hsiz", text_ctxt=CONTEXT, text="Uniform Size")

        # Min/Max size (disabled when uniform is used)
        layout.separator()
        col = layout.column(align=True)
        col.active = not settings.use_hsiz

        row = col.row()
        row.prop(settings, "use_hmin", text="")
        sub = row.row()
        sub.active = settings.use_hmin and not settings.use_hsiz
        sub.prop(settings, "hmin", text_ctxt=CONTEXT, text="Min Size")

        row = col.row()
        row.prop(settings, "use_hmax", text="")
        sub = row.row()
        sub.active = settings.use_hmax and not settings.use_hsiz
        sub.prop(settings, "hmax", text_ctxt=CONTEXT, text="Max Size")

        # Gradation
        layout.separator()
        row = layout.row()
        row.prop(settings, "use_hgrad", text="")
        sub = row.row()
        sub.active = settings.use_hgrad
        sub.prop(settings, "hgrad", text_ctxt=CONTEXT, text="Gradation")


class MMGPY_PT_geometry(Panel):
    """Geometry control sub-panel."""

    bl_label = "Geometry"
    bl_translation_context = CONTEXT
    bl_idname = "MMGPY_PT_geometry"
    bl_space_type = "VIEW_3D"
    bl_region_type = "UI"
    bl_category = "MMGpy"
    bl_parent_id = "MMGPY_PT_main_panel"
    bl_options: ClassVar[set[str]] = {"DEFAULT_CLOSED"}

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
        sub.prop(settings, "hausd", text_ctxt=CONTEXT, text="Hausdorff")

        # Angle detection
        layout.separator()
        row = layout.row()
        row.prop(settings, "use_ar", text="")
        sub = row.row()
        sub.active = settings.use_ar
        sub.prop(settings, "ar", text_ctxt=CONTEXT, text="Angle Detection")

        # Advanced options toggle
        layout.separator()
        layout.prop(
            settings,
            "show_advanced",
            text_ctxt=CONTEXT,
            text="Advanced Options",
            icon="DOWNARROW_HLT" if settings.show_advanced else "RIGHTARROW",
        )

        if settings.show_advanced:
            box = layout.box()
            col = box.column(align=True)
            col.prop(settings, "optim", text_ctxt=CONTEXT, text="Optimize Only")
            col.prop(settings, "noinsert", text_ctxt=CONTEXT, text="No Insert")
            col.prop(settings, "noswap", text_ctxt=CONTEXT, text="No Swap")
            col.prop(settings, "nomove", text_ctxt=CONTEXT, text="No Move")
            col.separator()
            col.prop(settings, "verbose", text_ctxt=CONTEXT, text="Verbosity")


def _find_quality_ramp_node() -> Node | None:
    """Return the ColorRamp node from the MMGpy_Quality material, or None.

    Returns
    -------
    bpy.types.Node or None
        The ``ShaderNodeValToRGB`` node, or ``None`` when the material
        is missing / has no nodes.

    """
    mat = bpy.data.materials.get(utils.QUALITY_MATERIAL_NAME)
    if mat is None or not mat.use_nodes:
        return None
    return next(
        (n for n in mat.node_tree.nodes if n.bl_idname == "ShaderNodeValToRGB"),
        None,
    )


def _quality_axis_labels(
    settings: PropertyGroup,
    stats: QualityStats,
) -> tuple[str, str]:
    """Compute the left/right axis hint labels for the active ramp mode.

    Returns
    -------
    tuple of (str, str)
        ``(low_label, high_label)`` describing the ramp's endpoints.

    """
    mode = settings.quality_colormap_mode
    if mode == "AUTO" and stats is not None:
        lo, hi = stats["min"], stats["max"]
    elif mode == "CUSTOM":
        lo = min(settings.quality_custom_min, settings.quality_custom_max)
        hi = max(settings.quality_custom_min, settings.quality_custom_max)
    else:
        return (iface_("0 — poor"), iface_("best — 1"))
    return (
        iface_("{value:.2f} — poor").format(value=lo),
        iface_("best — {value:.2f}").format(value=hi),
    )


def _draw_quality_ramp_controls(
    layout: UILayout,
    settings: PropertyGroup,
    ramp_node: Node,
    stats: QualityStats,
) -> None:
    """Heading, range dropdown, custom sliders, ColorRamp, axis hints."""
    # Two-line heading so we don't depend on the panel being wide enough
    # for "Mesh quality: In-radius ratio" on one row.
    header = layout.column(align=True)
    header.label(text_ctxt=CONTEXT, text="Mesh quality")
    header.label(text_ctxt=CONTEXT, text="(MMG in-radius ratio)")
    # ``text="Range"`` puts a label to the left of the dropdown instead
    # of using the property's name.
    layout.prop(settings, "quality_colormap_mode", text_ctxt=CONTEXT, text="Range")
    if settings.quality_colormap_mode == "CUSTOM":
        custom_col = layout.column(align=True)
        custom_col.prop(settings, "quality_custom_min", text_ctxt=CONTEXT, text="Min")
        custom_col.prop(settings, "quality_custom_max", text_ctxt=CONTEXT, text="Max")
    layout.template_color_ramp(ramp_node, "color_ramp", expand=False)
    # Endpoint hints. AUTO / CUSTOM expand the ramp across non-default
    # values, so surface the actual numbers.
    lo_label, hi_label = _quality_axis_labels(settings, stats)
    row = layout.row()
    row.alignment = "EXPAND"
    row.label(text=lo_label, translate=False)
    sub = row.row()
    sub.alignment = "RIGHT"
    sub.label(text=hi_label, translate=False)


class MMGPY_PT_visualization(Panel):
    """Visualization sub-panel — wireframe overlay and quality coloring."""

    bl_label = "Visualization"
    bl_translation_context = CONTEXT
    bl_idname = "MMGPY_PT_visualization"
    bl_space_type = "VIEW_3D"
    bl_region_type = "UI"
    bl_category = "MMGpy"
    bl_parent_id = "MMGPY_PT_main_panel"
    bl_options: ClassVar[set[str]] = {"DEFAULT_CLOSED"}

    def draw(self, context: Context) -> None:
        """Draw the panel."""
        layout = self.layout
        settings = context.scene.mmgpy

        obj = context.active_object
        active_is_mesh = obj is not None and obj.type == "MESH"

        col = layout.column(align=True)
        col.active = active_is_mesh
        col.prop(settings, "show_wire", icon="MOD_WIREFRAME")
        col.prop(settings, "show_quality", icon="COLOR")

        if settings.show_quality and active_is_mesh and obj is not None:
            layout.separator()
            self._draw_quality_section(layout, settings, obj)

    @staticmethod
    def _draw_quality_section(
        layout: UILayout,
        settings: PropertyGroup,
        obj: Object,
    ) -> None:
        """Draw the ramp + range controls + stats block when quality is on."""
        ramp_node = _find_quality_ramp_node()
        stats = utils.get_quality_stats(obj.data)

        if ramp_node is not None:
            _draw_quality_ramp_controls(layout, settings, ramp_node, stats)

        if stats is None:
            layout.label(
                text_ctxt=CONTEXT, text="(toggle off/on to compute)", icon="QUESTION"
            )
            return

        layout.separator()
        layout.label(
            text=iface_("Triangles: {count:,}").format(count=stats["n"]),
            icon="MESH_DATA",
            translate=False,
        )
        stats_col = layout.column(align=True)
        stats_col.label(
            text=iface_("min:  {value:.3f}").format(value=stats["min"]),
            translate=False,
        )
        stats_col.label(
            text=iface_("mean: {value:.3f}").format(value=stats["mean"]),
            translate=False,
        )
        stats_col.label(
            text=iface_("max:  {value:.3f}").format(value=stats["max"]),
            translate=False,
        )


class MMGPY_PT_local_refinement(Panel):
    """Local refinement sub-panel."""

    bl_label = "Local Refinement"
    bl_translation_context = CONTEXT
    bl_idname = "MMGPY_PT_local_refinement"
    bl_space_type = "VIEW_3D"
    bl_region_type = "UI"
    bl_category = "MMGpy"
    bl_parent_id = "MMGPY_PT_main_panel"
    bl_options: ClassVar[set[str]] = {"DEFAULT_CLOSED"}

    def draw(self, context: Context) -> None:
        """Draw the panel."""
        layout = self.layout
        settings = context.scene.mmgpy

        # Add buttons
        row = layout.row(align=True)
        row.operator(
            "mmgpy.add_sizing_sphere",
            text_ctxt=CONTEXT,
            text="Add Sphere",
            icon="SPHERE",
        )
        row.operator(
            "mmgpy.add_sizing_box", text_ctxt=CONTEXT, text="Add Box", icon="CUBE"
        )

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
                row.prop(constraint, "target_size", text_ctxt=CONTEXT, text="Size")

                # Remove button
                op = row.operator("mmgpy.remove_sizing_constraint", text="", icon="X")
                op.index = i

            # Clear all button
            layout.separator()
            layout.operator(
                "mmgpy.clear_sizing_constraints",
                text_ctxt=CONTEXT,
                text="Clear All",
                icon="TRASH",
            )
        else:
            layout.label(text_ctxt=CONTEXT, text="No constraints defined", icon="INFO")
            layout.label(text_ctxt=CONTEXT, text="Add a sphere or box.")
            layout.label(text_ctxt=CONTEXT, text="It defines a local refinement zone.")
