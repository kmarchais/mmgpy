# SPDX-FileCopyrightText: 2026 Kevin Marchais
# SPDX-License-Identifier: GPL-3.0-or-later
"""Addon preferences for MMGpy Blender extension."""

from __future__ import annotations

from typing import TYPE_CHECKING

from bpy.props import BoolProperty
from bpy.types import AddonPreferences

from .translations import CONTEXT, iface_

if TYPE_CHECKING:
    from bpy.types import Context

try:
    import mmgpy

    _MMGPY_IMPORT_ERROR: ImportError | None = None
except ImportError as exc:
    mmgpy = None  # type: ignore[assignment]
    _MMGPY_IMPORT_ERROR = exc


class MMGPYPreferences(AddonPreferences):
    """Preferences for MMGpy addon."""

    bl_idname = __package__

    # Debug mode
    debug_mode: BoolProperty(
        translation_context=CONTEXT,
        name="Debug Mode",
        description="Enable debug output in console",
        default=False,
    )

    # Auto-hide original after remesh
    hide_original: BoolProperty(
        translation_context=CONTEXT,
        name="Hide Original",
        description="Hide the original mesh after remeshing",
        default=False,
    )

    # Delete original after remesh
    delete_original: BoolProperty(
        translation_context=CONTEXT,
        name="Delete Original",
        description="Delete the original mesh after remeshing (cannot undo)",
        default=False,
    )

    def draw(self, _context: Context) -> None:
        """Draw the preferences panel."""
        layout = self.layout

        box = layout.box()
        col = box.column(align=True)
        if mmgpy is not None:
            col.label(text_ctxt=CONTEXT, text="mmgpy Status:", icon="CHECKMARK")
            col.label(
                text=iface_("mmgpy version: {version}").format(
                    version=mmgpy.__version__
                ),
                translate=False,
            )
            col.label(
                text=iface_("MMG version: {version}").format(version=mmgpy.MMG_VERSION),
                translate=False,
            )
        else:
            col.label(text_ctxt=CONTEXT, text="mmgpy Status:", icon="ERROR")
            col.label(
                text=iface_("Not installed or import error: {error}").format(
                    error=_MMGPY_IMPORT_ERROR,
                ),
                translate=False,
            )
            col.separator()
            col.label(
                text_ctxt=CONTEXT,
                text="Please reinstall the extension with wheels included.",
            )

        layout.separator()

        # General preferences
        layout.label(text_ctxt=CONTEXT, text="General:", icon="PREFERENCES")
        col = layout.column(align=True)
        col.prop(self, "hide_original")
        col.prop(self, "delete_original")

        layout.separator()

        # Debug options
        layout.label(text_ctxt=CONTEXT, text="Debug:", icon="CONSOLE")
        layout.prop(self, "debug_mode")
