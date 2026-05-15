# SPDX-FileCopyrightText: 2026 Kevin Marchais
# SPDX-License-Identifier: GPL-3.0-or-later
"""Blender operators for MMGpy remeshing."""

from __future__ import annotations

import math
from typing import TYPE_CHECKING, Any, ClassVar

import bpy
import mathutils
from bpy.props import FloatProperty, IntProperty
from bpy.types import Operator

from . import utils

if TYPE_CHECKING:
    from bpy.types import Context, Event

    from .properties import MMGPYSettings

try:
    import mmgpy  # noqa: F401 -- registers the .mmg PyVista accessor

    _MMGPY_IMPORT_ERROR: ImportError | None = None
except ImportError as exc:
    _MMGPY_IMPORT_ERROR = exc

# Errors we expect from mmgpy / PyVista / numpy on bad geometry or option
# combinations. Anything outside this set is genuinely unexpected and bubbles
# up to Blender's own error popup with a full traceback.
_REMESH_EXC_TYPES = (RuntimeError, ValueError, TypeError, OSError)

# Above this raw triangle estimate we round to 2 significant figures for the
# confirmation dialog instead of showing the noisy float.
_ROUND_TO_2SF_ABOVE = 100


class MMGPY_OT_remesh(Operator):
    """Remesh the selected mesh using MMGpy."""

    bl_idname = "mmgpy.remesh"
    bl_label = "MMGpy Remesh"
    bl_description = "Remesh the selected mesh using MMGpy"
    bl_options: ClassVar[set[str]] = {"REGISTER", "UNDO"}

    # Threshold for the confirmation dialog
    TRIANGLE_WARNING_THRESHOLD = 1_000_000

    @classmethod
    def poll(cls, context: Context) -> bool:
        """Check if operator can run.

        Returns
        -------
        bool
            ``True`` when the active object is a mesh.

        """
        obj = context.active_object
        return obj is not None and obj.type == "MESH"

    @staticmethod
    def _estimate_triangles(context: Context) -> int | None:
        """Estimate the triangle count the remesh would produce.

        Returns
        -------
        int or None
            Estimated triangle count, or ``None`` when no usable size
            parameter is set (cannot estimate).

        """
        obj = context.active_object
        settings = context.scene.mmgpy

        if settings.use_hsiz:
            h = settings.hsiz
        elif settings.use_hmax:
            h = settings.hmax
        else:
            return None

        if h <= 0:
            return None

        # Compute surface area from mesh polygons, scaled to world space.
        scale = obj.matrix_world.to_scale()
        avg_scale_sq = (scale.x**2 + scale.y**2 + scale.z**2) / 3
        area = sum(p.area for p in obj.data.polygons) * avg_scale_sq

        # Equilateral triangle with edge h has area = (sqrt(3)/4) * h^2.
        tri_area = (math.sqrt(3) / 4) * h**2
        raw = area / tri_area

        if raw >= _ROUND_TO_2SF_ABOVE:
            digits = math.floor(math.log10(raw)) - 1
            return int(round(raw, -digits))
        return int(raw)

    def invoke(self, context: Context, event: Event) -> set[str]:
        """Confirm before running when the estimated triangle count is high.

        Returns
        -------
        set of str
            Blender operator status flags.

        """
        estimate = self._estimate_triangles(context)
        if estimate is not None and estimate > self.TRIANGLE_WARNING_THRESHOLD:
            return context.window_manager.invoke_confirm(
                self,
                event,
                title="High triangle count",
                message=(
                    f"Estimated ~{estimate:,} triangles. This may take a long time."
                ),
                confirm_text="Remesh anyway",
            )
        return self.execute(context)

    def execute(self, context: Context) -> set[str]:
        """Execute the remeshing operation.

        Returns
        -------
        set of str
            Blender operator status flags.

        """
        if _MMGPY_IMPORT_ERROR is not None:
            self.report(
                {"ERROR"},
                f"mmgpy is not installed or failed to import: {_MMGPY_IMPORT_ERROR}",
            )
            return {"CANCELLED"}

        obj = context.active_object
        settings = context.scene.mmgpy

        try:
            vertices, triangles = utils.blender_to_arrays(obj)
        except _REMESH_EXC_TYPES as e:
            self.report({"ERROR"}, f"Failed to convert mesh: {e}")
            return {"CANCELLED"}

        n_verts_before = len(vertices)
        n_tris_before = len(triangles)

        try:
            polydata = utils.arrays_to_polydata(vertices, triangles)
        except _REMESH_EXC_TYPES as e:
            self.report({"ERROR"}, f"Failed to build PyVista mesh: {e}")
            return {"CANCELLED"}

        remesh_kwargs = self._build_remesh_options(settings)
        local_sizing = self._build_local_sizing(settings)

        try:
            result = polydata.mmg.remesh(
                local_sizing=local_sizing or None,
                **remesh_kwargs,
            )
        except _REMESH_EXC_TYPES as e:
            self.report({"ERROR"}, f"Remeshing failed: {e}")
            return {"CANCELLED"}

        new_vertices, new_triangles = utils.polydata_to_arrays(result)

        utils.replace_mesh_data(obj, new_vertices, new_triangles)

        self.report(
            {"INFO"},
            f"Remeshed: {n_verts_before:,} -> {len(new_vertices):,} vertices, "
            f"{n_tris_before:,} -> {len(new_triangles):,} elements",
        )

        return {"FINISHED"}

    @staticmethod
    def _build_remesh_options(settings: MMGPYSettings) -> dict[str, Any]:
        """Translate settings into ``polydata.mmg.remesh`` keyword arguments.

        Returns
        -------
        dict
            Keyword arguments to forward to the accessor.

        """
        kwargs: dict[str, Any] = {"verbose": settings.verbose}

        # Preset gradation (may be overridden by use_hgrad below).
        preset_hgrad = {"FINE": 1.2, "COARSE": 1.5}.get(settings.preset)
        if preset_hgrad is not None:
            kwargs["hgrad"] = preset_hgrad

        # ``hsiz`` is mutually exclusive with ``hmin`` / ``hmax``.
        if settings.use_hsiz:
            kwargs["hsiz"] = settings.hsiz
        else:
            for flag, name in (("use_hmin", "hmin"), ("use_hmax", "hmax")):
                if getattr(settings, flag):
                    kwargs[name] = getattr(settings, name)

        toggleable = (
            ("use_hausd", "hausd"),
            ("use_ar", "ar"),
            ("use_hgrad", "hgrad"),
        )
        for flag, name in toggleable:
            if getattr(settings, flag):
                kwargs[name] = getattr(settings, name)

        for name in ("optim", "noinsert", "noswap", "nomove"):
            if getattr(settings, name):
                kwargs[name] = 1

        return kwargs

    @staticmethod
    def _build_local_sizing(settings: MMGPYSettings) -> list[dict[str, Any]]:
        """Translate sizing-constraint empties into ``.mmg.remesh`` specs.

        Each sphere/box empty becomes one entry in the ``local_sizing`` list
        forwarded to :meth:`mmgpy.MmgAccessor.remesh`. Empties without a
        target object are skipped.

        Returns
        -------
        list of dict
            One spec per active sphere/box constraint.

        """
        specs: list[dict[str, Any]] = []
        for constraint in settings.sizing_constraints:
            empty = constraint.empty_object
            if empty is None:
                continue

            location = empty.location
            size = constraint.target_size

            if constraint.constraint_type == "SPHERE":
                specs.append(
                    {
                        "shape": "sphere",
                        "center": [location.x, location.y, location.z],
                        "radius": empty.empty_display_size,
                        "size": size,
                    },
                )
            elif constraint.constraint_type == "BOX":
                half_size = empty.empty_display_size
                specs.append(
                    {
                        "shape": "box",
                        "bounds": [
                            [
                                location.x - half_size,
                                location.y - half_size,
                                location.z - half_size,
                            ],
                            [
                                location.x + half_size,
                                location.y + half_size,
                                location.z + half_size,
                            ],
                        ],
                        "size": size,
                    },
                )
        return specs


class MMGPY_OT_autofit(Operator):
    """Auto-fit sizing parameters to the active mesh dimensions."""

    bl_idname = "mmgpy.autofit"
    bl_label = "Auto-fit to Mesh"
    bl_description = "Set sizing parameters based on the active mesh dimensions"
    bl_options: ClassVar[set[str]] = {"REGISTER", "UNDO"}

    @classmethod
    def poll(cls, context: Context) -> bool:
        """Check if operator can run.

        Returns
        -------
        bool
            ``True`` when the active object is a mesh.

        """
        obj = context.active_object
        return obj is not None and obj.type == "MESH"

    def execute(self, context: Context) -> set[str]:
        """Apply size defaults scaled to the active mesh's bounding box.

        Returns
        -------
        set of str
            Blender operator status flags.

        """
        obj = context.active_object
        settings = context.scene.mmgpy

        # Bounding box diagonal in world space.
        bbox = [obj.matrix_world @ mathutils.Vector(v) for v in obj.bound_box]
        min_corner = mathutils.Vector(
            (
                min(v.x for v in bbox),
                min(v.y for v in bbox),
                min(v.z for v in bbox),
            ),
        )
        max_corner = mathutils.Vector(
            (
                max(v.x for v in bbox),
                max(v.y for v in bbox),
                max(v.z for v in bbox),
            ),
        )
        diagonal = (max_corner - min_corner).length

        if diagonal == 0:
            self.report({"WARNING"}, "Mesh has zero size")
            return {"CANCELLED"}

        # Defaults are tuned for a ~1.0 unit mesh; scale by power of 10.
        scale = 10 ** math.floor(math.log10(diagonal))

        settings.hmin = 0.001 * scale
        settings.hmax = 0.1 * scale
        settings.hsiz = 0.05 * scale
        settings.hausd = 0.01 * scale

        self.report(
            {"INFO"},
            f"Auto-fit: bbox diagonal = {diagonal:.4g}, scale = {scale:g}",
        )
        return {"FINISHED"}


class MMGPY_OT_add_sizing_sphere(Operator):
    """Add a spherical sizing constraint."""

    bl_idname = "mmgpy.add_sizing_sphere"
    bl_label = "Add Sphere"
    bl_description = "Add a spherical local refinement zone"
    bl_options: ClassVar[set[str]] = {"REGISTER", "UNDO"}

    radius: FloatProperty(
        name="Radius",
        description="Radius of the refinement sphere",
        default=0.1,
        min=0.001,
    )

    target_size: FloatProperty(
        name="Target Size",
        description="Target edge size within the sphere",
        default=0.01,
        min=0.0001,
    )

    def execute(self, context: Context) -> set[str]:
        """Create the sphere empty and register a sizing constraint for it.

        Returns
        -------
        set of str
            Blender operator status flags.

        """
        location = (
            context.active_object.location.copy()
            if context.active_object
            else context.scene.cursor.location.copy()
        )

        empty = utils.create_sizing_empty(
            context,
            location=tuple(location),
            constraint_type="SPHERE",
            radius=self.radius,
        )

        settings = context.scene.mmgpy
        constraint = settings.sizing_constraints.add()
        constraint.constraint_type = "SPHERE"
        constraint.empty_object = empty
        constraint.target_size = self.target_size

        self.report({"INFO"}, "Added spherical sizing constraint")
        return {"FINISHED"}

    def invoke(self, context: Context, _event: Event) -> set[str]:
        """Open the radius/target-size properties dialog before executing.

        Returns
        -------
        set of str
            Blender operator status flags.

        """
        return context.window_manager.invoke_props_dialog(self)


class MMGPY_OT_add_sizing_box(Operator):
    """Add a box-shaped sizing constraint."""

    bl_idname = "mmgpy.add_sizing_box"
    bl_label = "Add Box"
    bl_description = "Add a box-shaped local refinement zone"
    bl_options: ClassVar[set[str]] = {"REGISTER", "UNDO"}

    size: FloatProperty(
        name="Size",
        description="Size of the refinement box",
        default=0.1,
        min=0.001,
    )

    target_size: FloatProperty(
        name="Target Size",
        description="Target edge size within the box",
        default=0.01,
        min=0.0001,
    )

    def execute(self, context: Context) -> set[str]:
        """Create the box empty and register a sizing constraint for it.

        Returns
        -------
        set of str
            Blender operator status flags.

        """
        location = (
            context.active_object.location.copy()
            if context.active_object
            else context.scene.cursor.location.copy()
        )

        empty = utils.create_sizing_empty(
            context,
            location=tuple(location),
            constraint_type="BOX",
            radius=self.size,
        )

        settings = context.scene.mmgpy
        constraint = settings.sizing_constraints.add()
        constraint.constraint_type = "BOX"
        constraint.empty_object = empty
        constraint.target_size = self.target_size

        self.report({"INFO"}, "Added box sizing constraint")
        return {"FINISHED"}

    def invoke(self, context: Context, _event: Event) -> set[str]:
        """Open the size/target-size properties dialog before executing.

        Returns
        -------
        set of str
            Blender operator status flags.

        """
        return context.window_manager.invoke_props_dialog(self)


class MMGPY_OT_remove_sizing_constraint(Operator):
    """Remove a sizing constraint."""

    bl_idname = "mmgpy.remove_sizing_constraint"
    bl_label = "Remove Constraint"
    bl_description = "Remove the selected sizing constraint"
    bl_options: ClassVar[set[str]] = {"REGISTER", "UNDO"}

    index: IntProperty(
        name="Index",
        description="Index of constraint to remove",
        default=0,
    )

    @classmethod
    def poll(cls, context: Context) -> bool:
        """Check if at least one constraint exists to remove.

        Returns
        -------
        bool
            ``True`` when the scene carries any sizing constraints.

        """
        settings = context.scene.mmgpy
        return len(settings.sizing_constraints) > 0

    def execute(self, context: Context) -> set[str]:
        """Remove the constraint at ``self.index`` and its backing empty.

        Returns
        -------
        set of str
            Blender operator status flags.

        """
        settings = context.scene.mmgpy

        if 0 <= self.index < len(settings.sizing_constraints):
            constraint = settings.sizing_constraints[self.index]

            if constraint.empty_object is not None:
                bpy.data.objects.remove(constraint.empty_object, do_unlink=True)

            settings.sizing_constraints.remove(self.index)

            if settings.active_constraint_index >= len(settings.sizing_constraints):
                settings.active_constraint_index = max(
                    0,
                    len(settings.sizing_constraints) - 1,
                )

            self.report({"INFO"}, "Removed sizing constraint")
        else:
            self.report({"WARNING"}, "Invalid constraint index")

        return {"FINISHED"}


class MMGPY_OT_clear_sizing_constraints(Operator):
    """Clear all sizing constraints."""

    bl_idname = "mmgpy.clear_sizing_constraints"
    bl_label = "Clear All Constraints"
    bl_description = "Remove all sizing constraints"
    bl_options: ClassVar[set[str]] = {"REGISTER", "UNDO"}

    @classmethod
    def poll(cls, context: Context) -> bool:
        """Check if there is at least one constraint to clear.

        Returns
        -------
        bool
            ``True`` when the scene carries any sizing constraints.

        """
        settings = context.scene.mmgpy
        return len(settings.sizing_constraints) > 0

    def execute(self, context: Context) -> set[str]:
        """Remove every sizing constraint and its backing empty.

        Returns
        -------
        set of str
            Blender operator status flags.

        """
        settings = context.scene.mmgpy

        for constraint in settings.sizing_constraints:
            if constraint.empty_object is not None:
                bpy.data.objects.remove(constraint.empty_object, do_unlink=True)

        settings.sizing_constraints.clear()
        settings.active_constraint_index = 0

        self.report({"INFO"}, "Cleared all sizing constraints")
        return {"FINISHED"}

    def invoke(self, context: Context, event: Event) -> set[str]:
        """Show a confirmation dialog before clearing every constraint.

        Returns
        -------
        set of str
            Blender operator status flags.

        """
        return context.window_manager.invoke_confirm(self, event)
