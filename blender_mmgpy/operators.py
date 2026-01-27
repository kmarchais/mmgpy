# SPDX-FileCopyrightText: 2026 Kevin Marchais
# SPDX-License-Identifier: MIT
"""Blender operators for MMGpy remeshing."""

from __future__ import annotations

from typing import TYPE_CHECKING

import bpy
from bpy.props import FloatProperty, IntProperty
from bpy.types import Operator

if TYPE_CHECKING:
    from bpy.types import Context, Event


class MMGPY_OT_remesh(Operator):
    """Remesh the selected mesh using MMGpy."""

    bl_idname = "mmgpy.remesh"
    bl_label = "MMGpy Remesh"
    bl_description = "Remesh the selected mesh using MMGpy"
    bl_options = {"REGISTER", "UNDO"}

    @classmethod
    def poll(cls, context: Context) -> bool:
        """Check if operator can run."""
        obj = context.active_object
        return obj is not None and obj.type == "MESH"

    def execute(self, context: Context) -> set[str]:
        """Execute the remeshing operation."""
        try:
            import mmgpy
        except ImportError as e:
            self.report(
                {"ERROR"},
                f"mmgpy is not installed or failed to import: {e}",
            )
            return {"CANCELLED"}

        from . import utils

        obj = context.active_object
        settings = context.scene.mmgpy

        # Convert Blender mesh to arrays
        try:
            vertices, triangles = utils.blender_to_arrays(obj)
        except Exception as e:
            self.report({"ERROR"}, f"Failed to convert mesh: {e}")
            return {"CANCELLED"}

        # Create mmgpy Mesh
        try:
            mesh = mmgpy.Mesh(vertices, triangles)
        except Exception as e:
            self.report({"ERROR"}, f"Failed to create mmgpy mesh: {e}")
            return {"CANCELLED"}

        # Build remesh options based on settings
        remesh_kwargs = self._build_remesh_options(settings)

        # Apply local sizing constraints
        self._apply_sizing_constraints(mesh, settings)

        # Perform remeshing
        try:
            result = mesh.remesh(progress=False, **remesh_kwargs)
        except Exception as e:
            self.report({"ERROR"}, f"Remeshing failed: {e}")
            return {"CANCELLED"}

        # Get result arrays
        new_vertices = mesh.get_vertices()
        new_triangles = mesh.get_triangles()

        # Create new object
        new_obj = utils.arrays_to_blender(
            new_vertices,
            new_triangles,
            f"{obj.name}_remeshed",
        )

        # Link to scene and set transform
        context.collection.objects.link(new_obj)
        new_obj.matrix_world = obj.matrix_world

        # Copy materials
        for mat in obj.data.materials:
            new_obj.data.materials.append(mat)

        # Select new object
        obj.select_set(False)
        new_obj.select_set(True)
        context.view_layer.objects.active = new_obj

        # Report results
        self.report(
            {"INFO"},
            f"Remeshed: {result.vertices_before} -> {result.vertices_after} vertices, "
            f"{result.elements_before} -> {result.elements_after} elements",
        )

        return {"FINISHED"}

    def _build_remesh_options(self, settings) -> dict:
        """Build remesh keyword arguments from settings."""
        kwargs = {}

        # Apply preset first
        if settings.preset == "FINE":
            kwargs["hgrad"] = 1.2
        elif settings.preset == "COARSE":
            kwargs["hgrad"] = 1.5

        # Size control
        if settings.use_hsiz:
            kwargs["hsiz"] = settings.hsiz
        else:
            if settings.use_hmin:
                kwargs["hmin"] = settings.hmin
            if settings.use_hmax:
                kwargs["hmax"] = settings.hmax

        # Geometry
        if settings.use_hausd:
            kwargs["hausd"] = settings.hausd

        # Angle detection
        if settings.use_ar:
            kwargs["ar"] = settings.ar

        # Gradation
        if settings.use_hgrad:
            kwargs["hgrad"] = settings.hgrad

        # Verbosity
        kwargs["verbose"] = settings.verbose

        # Optimization flags
        if settings.optim:
            kwargs["optim"] = 1
        if settings.noinsert:
            kwargs["noinsert"] = 1
        if settings.noswap:
            kwargs["noswap"] = 1
        if settings.nomove:
            kwargs["nomove"] = 1

        return kwargs

    def _apply_sizing_constraints(self, mesh, settings) -> None:
        """Apply local sizing constraints to the mesh."""
        for constraint in settings.sizing_constraints:
            empty = constraint.empty_object
            if empty is None:
                continue

            location = empty.location
            size = constraint.target_size

            if constraint.constraint_type == "SPHERE":
                radius = empty.empty_display_size
                mesh.set_size_sphere(
                    center=[location.x, location.y, location.z],
                    radius=radius,
                    size=size,
                )
            elif constraint.constraint_type == "BOX":
                # For box, use empty scale to determine bounds
                scale = empty.empty_display_size
                half_size = scale
                mesh.set_size_box(
                    bounds=[
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
                    size=size,
                )


class MMGPY_OT_add_sizing_sphere(Operator):
    """Add a spherical sizing constraint."""

    bl_idname = "mmgpy.add_sizing_sphere"
    bl_label = "Add Sphere"
    bl_description = "Add a spherical local refinement zone"
    bl_options = {"REGISTER", "UNDO"}

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
        """Execute the operator."""
        from . import utils

        # Get location from 3D cursor or active object center
        if context.active_object:
            location = context.active_object.location.copy()
        else:
            location = context.scene.cursor.location.copy()

        # Create empty
        empty = utils.create_sizing_empty(
            context,
            location=tuple(location),
            constraint_type="SPHERE",
            radius=self.radius,
        )

        # Add to constraints collection
        settings = context.scene.mmgpy
        constraint = settings.sizing_constraints.add()
        constraint.constraint_type = "SPHERE"
        constraint.empty_object = empty
        constraint.target_size = self.target_size

        self.report({"INFO"}, "Added spherical sizing constraint")
        return {"FINISHED"}

    def invoke(self, context: Context, event: Event) -> set[str]:
        """Invoke with dialog."""
        return context.window_manager.invoke_props_dialog(self)


class MMGPY_OT_add_sizing_box(Operator):
    """Add a box-shaped sizing constraint."""

    bl_idname = "mmgpy.add_sizing_box"
    bl_label = "Add Box"
    bl_description = "Add a box-shaped local refinement zone"
    bl_options = {"REGISTER", "UNDO"}

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
        """Execute the operator."""
        from . import utils

        # Get location from 3D cursor or active object center
        if context.active_object:
            location = context.active_object.location.copy()
        else:
            location = context.scene.cursor.location.copy()

        # Create empty
        empty = utils.create_sizing_empty(
            context,
            location=tuple(location),
            constraint_type="BOX",
            radius=self.size,
        )

        # Add to constraints collection
        settings = context.scene.mmgpy
        constraint = settings.sizing_constraints.add()
        constraint.constraint_type = "BOX"
        constraint.empty_object = empty
        constraint.target_size = self.target_size

        self.report({"INFO"}, "Added box sizing constraint")
        return {"FINISHED"}

    def invoke(self, context: Context, event: Event) -> set[str]:
        """Invoke with dialog."""
        return context.window_manager.invoke_props_dialog(self)


class MMGPY_OT_remove_sizing_constraint(Operator):
    """Remove a sizing constraint."""

    bl_idname = "mmgpy.remove_sizing_constraint"
    bl_label = "Remove Constraint"
    bl_description = "Remove the selected sizing constraint"
    bl_options = {"REGISTER", "UNDO"}

    index: IntProperty(
        name="Index",
        description="Index of constraint to remove",
        default=0,
    )

    @classmethod
    def poll(cls, context: Context) -> bool:
        """Check if operator can run."""
        settings = context.scene.mmgpy
        return len(settings.sizing_constraints) > 0

    def execute(self, context: Context) -> set[str]:
        """Execute the operator."""
        settings = context.scene.mmgpy

        if 0 <= self.index < len(settings.sizing_constraints):
            constraint = settings.sizing_constraints[self.index]

            # Optionally delete the empty object
            if constraint.empty_object is not None:
                bpy.data.objects.remove(constraint.empty_object, do_unlink=True)

            settings.sizing_constraints.remove(self.index)

            # Update active index
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
    bl_options = {"REGISTER", "UNDO"}

    @classmethod
    def poll(cls, context: Context) -> bool:
        """Check if operator can run."""
        settings = context.scene.mmgpy
        return len(settings.sizing_constraints) > 0

    def execute(self, context: Context) -> set[str]:
        """Execute the operator."""
        settings = context.scene.mmgpy

        # Delete all empty objects
        for constraint in settings.sizing_constraints:
            if constraint.empty_object is not None:
                bpy.data.objects.remove(constraint.empty_object, do_unlink=True)

        # Clear collection
        settings.sizing_constraints.clear()
        settings.active_constraint_index = 0

        self.report({"INFO"}, "Cleared all sizing constraints")
        return {"FINISHED"}

    def invoke(self, context: Context, event: Event) -> set[str]:
        """Confirm before clearing."""
        return context.window_manager.invoke_confirm(self, event)
