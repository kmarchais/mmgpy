"""Interactive sizing editor using PyVista.

This module provides a visual interface for defining mesh sizing constraints
by clicking on the mesh to place refinement regions.
"""

from __future__ import annotations

from dataclasses import dataclass
from enum import Enum, auto
from typing import TYPE_CHECKING

import numpy as np
import pyvista as pv

from mmgpy.sizing import BoxSize, CylinderSize, PointSize, SizingConstraint, SphereSize

if TYPE_CHECKING:
    from numpy.typing import NDArray

    from mmgpy import Mesh
    from mmgpy._mmgpy import MmgMesh2D, MmgMesh3D, MmgMeshS


class ConstraintMode(Enum):
    """Interaction mode for constraint placement."""

    NONE = auto()
    SPHERE = auto()
    BOX = auto()
    CYLINDER = auto()
    POINT = auto()


@dataclass
class ConstraintVisual:
    """Visual representation of a sizing constraint."""

    constraint: SizingConstraint
    actor: pv.Actor
    label_actor: pv.Actor | None = None


@dataclass
class EditorState:
    """State for multi-click constraint creation."""

    mode: ConstraintMode = ConstraintMode.NONE
    first_point: NDArray[np.float64] | None = None
    preview_actor: pv.Actor | None = None


_DEFAULT_SIZE = 0.01
_DEFAULT_RADIUS = 0.1
_DEFAULT_NEAR_SIZE = 0.01
_DEFAULT_FAR_SIZE = 0.1
_DEFAULT_INFLUENCE_RADIUS = 0.5

_SPHERE_COLOR = "red"
_BOX_COLOR = "blue"
_CYLINDER_COLOR = "green"
_POINT_COLOR = "orange"
_CONSTRAINT_OPACITY = 0.3
_PREVIEW_OPACITY = 0.5

_MIN_SIZE = 0.001
_MAX_SIZE = 1.0
_MIN_RADIUS = 0.01
_MAX_RADIUS = 10.0

_DIMS_2D = 2
_DIMS_3D = 3


class SizingEditor:
    """Interactive editor for mesh sizing constraints.

    This class provides a PyVista-based GUI for visually defining local
    mesh sizing constraints by clicking on the mesh.

    Parameters
    ----------
    mesh : Mesh | MmgMesh3D | MmgMesh2D | MmgMeshS
        The mesh to edit sizing for.

    Attributes
    ----------
    constraints : list[SizingConstraint]
        List of sizing constraints defined through interaction.

    Examples
    --------
    >>> from mmgpy import Mesh
    >>> from mmgpy.interactive import SizingEditor
    >>>
    >>> mesh = Mesh("model.mesh")
    >>> editor = SizingEditor(mesh)
    >>> editor.add_sphere_tool()
    >>> editor.run()
    >>>
    >>> # Get and apply constraints
    >>> for c in editor.get_constraints():
    ...     print(c)
    >>> editor.apply_to_mesh()

    """

    def __init__(
        self,
        mesh: Mesh | MmgMesh3D | MmgMesh2D | MmgMeshS,
    ) -> None:
        """Initialize the sizing editor.

        Parameters
        ----------
        mesh : Mesh | MmgMesh3D | MmgMesh2D | MmgMeshS
            The mesh to edit sizing for.

        """
        # Wrap raw MmgMesh* objects in a Mesh wrapper
        from mmgpy import Mesh as MeshClass
        from mmgpy import MeshKind
        from mmgpy._mmgpy import MmgMesh2D, MmgMesh3D, MmgMeshS

        if isinstance(mesh, MmgMesh3D):
            self._mesh: Mesh = MeshClass._from_impl(mesh, MeshKind.TETRAHEDRAL)  # noqa: SLF001
        elif isinstance(mesh, MmgMesh2D):
            self._mesh = MeshClass._from_impl(mesh, MeshKind.TRIANGULAR_2D)  # noqa: SLF001
        elif isinstance(mesh, MmgMeshS):
            self._mesh = MeshClass._from_impl(mesh, MeshKind.TRIANGULAR_SURFACE)  # noqa: SLF001
        else:
            self._mesh = mesh
        self._pv_mesh: pv.PolyData | pv.UnstructuredGrid | None = None
        self._plotter: pv.Plotter | None = None

        self._constraints: list[SizingConstraint] = []
        self._visuals: list[ConstraintVisual] = []
        self._state = EditorState()

        self._current_size = _DEFAULT_SIZE
        self._current_radius = _DEFAULT_RADIUS
        self._current_near_size = _DEFAULT_NEAR_SIZE
        self._current_far_size = _DEFAULT_FAR_SIZE
        self._current_influence_radius = _DEFAULT_INFLUENCE_RADIUS

        self._is_3d = self._detect_mesh_dimension()

    def _detect_mesh_dimension(self) -> bool:
        """Detect if mesh is 3D (vs 2D planar)."""
        from mmgpy import MeshKind

        return self._mesh.kind != MeshKind.TRIANGULAR_2D

    def _get_pyvista_mesh(self) -> pv.PolyData | pv.UnstructuredGrid:
        """Get PyVista representation of the mesh."""
        if self._pv_mesh is None:
            self._pv_mesh = self._mesh.to_pyvista()
        return self._pv_mesh

    def add_sphere_tool(self) -> SizingEditor:
        """Enable sphere constraint placement mode.

        In sphere mode, click on the mesh to place the center of a
        spherical refinement region. Use the radius slider to adjust
        the sphere size.

        Returns
        -------
        SizingEditor
            Self for method chaining.

        """
        self._state.mode = ConstraintMode.SPHERE
        return self

    def add_box_tool(self) -> SizingEditor:
        """Enable box constraint placement mode.

        In box mode, click twice on the mesh to define two opposite
        corners of a box refinement region.

        Returns
        -------
        SizingEditor
            Self for method chaining.

        """
        self._state.mode = ConstraintMode.BOX
        return self

    def add_cylinder_tool(self) -> SizingEditor:
        """Enable cylinder constraint placement mode.

        In cylinder mode, click twice on the mesh to define the axis
        of a cylindrical refinement region. Use the radius slider to
        adjust the cylinder radius.

        Returns
        -------
        SizingEditor
            Self for method chaining.

        Raises
        ------
        TypeError
            If the mesh is 2D (cylinder not supported for 2D meshes).

        """
        if not self._is_3d:
            msg = "Cylinder tool is not available for 2D meshes"
            raise TypeError(msg)
        self._state.mode = ConstraintMode.CYLINDER
        return self

    def add_point_tool(self) -> SizingEditor:
        """Enable point-based sizing mode.

        In point mode, click on the mesh to place a reference point
        for distance-based sizing. Size varies linearly from near_size
        at the point to far_size at influence_radius distance.

        Returns
        -------
        SizingEditor
            Self for method chaining.

        """
        self._state.mode = ConstraintMode.POINT
        return self

    def run(self) -> None:
        """Launch the interactive editor window.

        Opens a PyVista plotter window with the mesh and interactive
        controls for placing sizing constraints.

        """
        self._plotter = pv.Plotter(title="mmgpy Sizing Editor")

        pv_mesh = self._get_pyvista_mesh()
        self._plotter.add_mesh(
            pv_mesh,
            show_edges=True,
            pickable=True,
            name="mesh",
        )

        self._setup_picking()
        self._setup_sliders()
        self._setup_buttons()
        self._setup_help_panel()
        self._setup_instructions()

        self._plotter.show()

    def _setup_help_panel(self) -> None:
        """Set up help text panel."""
        if self._plotter is None:
            return

        help_text = (
            "HOW TO USE:\n"
            "1. Select a tool (colored buttons, bottom-left)\n"
            "2. Adjust sliders (bottom) for size/radius\n"
            "3. Click on mesh to place constraints\n"
            "4. Close window when done\n"
            "\n"
            "TOOLS:\n"
            "  Sphere: Click once for center\n"
            "  Box: Click twice for corners\n"
            "  Cylinder: Click twice for axis\n"
            "  Point: Click for gradual refinement"
        )
        self._plotter.add_text(
            help_text,
            position="upper_left",
            font_size=9,
            name="help_panel",
        )

    def _setup_picking(self) -> None:
        """Set up point picking callback."""
        if self._plotter is None:
            return

        self._plotter.enable_point_picking(
            callback=self._on_point_picked,
            show_message=False,
            pickable_window=False,
            left_clicking=True,
            show_point=True,
            point_size=10,
        )

    def _setup_sliders(self) -> None:
        """Set up slider widgets for parameters."""
        if self._plotter is None:
            return

        self._plotter.add_slider_widget(
            callback=self._on_size_changed,
            rng=[_MIN_SIZE, _MAX_SIZE],
            value=self._current_size,
            title="Target Size",
            pointa=(0.025, 0.1),
            pointb=(0.31, 0.1),
            style="modern",
        )

        self._plotter.add_slider_widget(
            callback=self._on_radius_changed,
            rng=[_MIN_RADIUS, _MAX_RADIUS],
            value=self._current_radius,
            title="Radius",
            pointa=(0.35, 0.1),
            pointb=(0.64, 0.1),
            style="modern",
        )

        self._plotter.add_slider_widget(
            callback=self._on_influence_changed,
            rng=[_MIN_RADIUS, _MAX_RADIUS],
            value=self._current_influence_radius,
            title="Influence Radius",
            pointa=(0.67, 0.1),
            pointb=(0.98, 0.1),
            style="modern",
        )

    def _setup_buttons(self) -> None:
        """Set up mode selection buttons."""
        if self._plotter is None:
            return

        button_size = 30
        x_start = 10
        y_start = 10
        spacing = 40

        self._plotter.add_checkbox_button_widget(
            callback=lambda state: self._set_mode(
                ConstraintMode.SPHERE if state else ConstraintMode.NONE,
            ),
            value=self._state.mode == ConstraintMode.SPHERE,
            position=(x_start, y_start + 3 * spacing),
            size=button_size,
            color_on=_SPHERE_COLOR,
            color_off="white",
        )
        self._plotter.add_text(
            "Sphere",
            position=(x_start + button_size + 5, y_start + 3 * spacing + 5),
            font_size=10,
            name="sphere_label",
        )

        self._plotter.add_checkbox_button_widget(
            callback=lambda state: self._set_mode(
                ConstraintMode.BOX if state else ConstraintMode.NONE,
            ),
            value=self._state.mode == ConstraintMode.BOX,
            position=(x_start, y_start + 2 * spacing),
            size=button_size,
            color_on=_BOX_COLOR,
            color_off="white",
        )
        self._plotter.add_text(
            "Box",
            position=(x_start + button_size + 5, y_start + 2 * spacing + 5),
            font_size=10,
            name="box_label",
        )

        if self._is_3d:
            self._plotter.add_checkbox_button_widget(
                callback=lambda state: self._set_mode(
                    ConstraintMode.CYLINDER if state else ConstraintMode.NONE,
                ),
                value=self._state.mode == ConstraintMode.CYLINDER,
                position=(x_start, y_start + spacing),
                size=button_size,
                color_on=_CYLINDER_COLOR,
                color_off="white",
            )
            self._plotter.add_text(
                "Cylinder",
                position=(x_start + button_size + 5, y_start + spacing + 5),
                font_size=10,
                name="cylinder_label",
            )

        self._plotter.add_checkbox_button_widget(
            callback=lambda state: self._set_mode(
                ConstraintMode.POINT if state else ConstraintMode.NONE,
            ),
            value=self._state.mode == ConstraintMode.POINT,
            position=(x_start, y_start),
            size=button_size,
            color_on=_POINT_COLOR,
            color_off="white",
        )
        self._plotter.add_text(
            "Point",
            position=(x_start + button_size + 5, y_start + 5),
            font_size=10,
            name="point_label",
        )

    def _setup_instructions(self) -> None:
        """Set up instruction text."""
        if self._plotter is None:
            return

        self._update_instructions()

    def _get_status_text(self) -> str:
        """Get current status text including mode and constraint count."""
        mode_names = {
            ConstraintMode.NONE: "None",
            ConstraintMode.SPHERE: "SPHERE",
            ConstraintMode.BOX: "BOX",
            ConstraintMode.CYLINDER: "CYLINDER",
            ConstraintMode.POINT: "POINT",
        }
        mode_instructions = {
            ConstraintMode.NONE: "Select a tool below",
            ConstraintMode.SPHERE: "Click mesh to place sphere",
            ConstraintMode.BOX: (
                "Click mesh for second corner"
                if self._state.first_point is not None
                else "Click mesh for first corner"
            ),
            ConstraintMode.CYLINDER: (
                "Click mesh for second axis point"
                if self._state.first_point is not None
                else "Click mesh for first axis point"
            ),
            ConstraintMode.POINT: "Click mesh to place point",
        }

        mode = mode_names.get(self._state.mode, "")
        instruction = mode_instructions.get(self._state.mode, "")
        count = len(self._constraints)

        return f"Mode: {mode}\n{instruction}\n\nConstraints: {count}"

    def _set_mode(self, mode: ConstraintMode) -> None:
        """Set the current interaction mode."""
        self._state.mode = mode
        self._state.first_point = None
        self._clear_preview()
        self._update_instructions()

    def _update_instructions(self) -> None:
        """Update instruction text based on current mode and state."""
        if self._plotter is None:
            return

        self._plotter.add_text(
            self._get_status_text(),
            position="upper_right",
            font_size=11,
            name="instructions",
        )

    def _on_size_changed(self, value: float) -> None:
        """Handle size slider change."""
        self._current_size = value
        self._current_near_size = value
        self._current_far_size = value * 10

    def _on_radius_changed(self, value: float) -> None:
        """Handle radius slider change."""
        self._current_radius = value
        self._update_preview()

    def _on_influence_changed(self, value: float) -> None:
        """Handle influence radius slider change."""
        self._current_influence_radius = value

    def _on_point_picked(self, point: NDArray[np.float64]) -> None:
        """Handle point picking callback."""
        if self._state.mode == ConstraintMode.NONE:
            return

        point = np.asarray(point, dtype=np.float64)

        if self._state.mode == ConstraintMode.SPHERE:
            self._add_sphere_constraint(point)
        elif self._state.mode == ConstraintMode.BOX:
            self._handle_box_click(point)
        elif self._state.mode == ConstraintMode.CYLINDER:
            self._handle_cylinder_click(point)
        elif self._state.mode == ConstraintMode.POINT:
            self._add_point_constraint(point)

    def _add_sphere_constraint(self, center: NDArray[np.float64]) -> None:
        """Add a sphere constraint at the given center."""
        constraint = SphereSize(
            center=center,
            radius=self._current_radius,
            size=self._current_size,
        )
        self._constraints.append(constraint)
        self._visualize_constraint(constraint)
        self._update_instructions()

    def _handle_box_click(self, point: NDArray[np.float64]) -> None:
        """Handle click in box mode."""
        if self._state.first_point is None:
            self._state.first_point = point
            self._show_preview_point(point, _BOX_COLOR)
            self._update_instructions()
        else:
            self._add_box_constraint(self._state.first_point, point)
            self._state.first_point = None
            self._clear_preview()
            self._update_instructions()

    def _add_box_constraint(
        self,
        point1: NDArray[np.float64],
        point2: NDArray[np.float64],
    ) -> None:
        """Add a box constraint between two points."""
        min_corner = np.minimum(point1, point2)
        max_corner = np.maximum(point1, point2)

        if not self._is_3d:
            min_corner = min_corner[:2]
            max_corner = max_corner[:2]

        constraint = BoxSize(
            bounds=np.array([min_corner, max_corner]),
            size=self._current_size,
        )
        self._constraints.append(constraint)
        self._visualize_constraint(constraint)

    def _handle_cylinder_click(self, point: NDArray[np.float64]) -> None:
        """Handle click in cylinder mode."""
        if self._state.first_point is None:
            self._state.first_point = point
            self._show_preview_point(point, _CYLINDER_COLOR)
            self._update_instructions()
        else:
            self._add_cylinder_constraint(self._state.first_point, point)
            self._state.first_point = None
            self._clear_preview()
            self._update_instructions()

    def _add_cylinder_constraint(
        self,
        point1: NDArray[np.float64],
        point2: NDArray[np.float64],
    ) -> None:
        """Add a cylinder constraint between two axis points."""
        constraint = CylinderSize(
            point1=point1,
            point2=point2,
            radius=self._current_radius,
            size=self._current_size,
        )
        self._constraints.append(constraint)
        self._visualize_constraint(constraint)

    def _add_point_constraint(self, point: NDArray[np.float64]) -> None:
        """Add a point-based sizing constraint."""
        if not self._is_3d:
            point = point[:2]

        constraint = PointSize(
            point=point,
            near_size=self._current_near_size,
            far_size=self._current_far_size,
            influence_radius=self._current_influence_radius,
        )
        self._constraints.append(constraint)
        self._visualize_constraint(constraint)
        self._update_instructions()

    def _visualize_constraint(self, constraint: SizingConstraint) -> None:
        """Add visual representation of a constraint."""
        if self._plotter is None:
            return

        actor: pv.Actor | None = None

        if isinstance(constraint, SphereSize):
            sphere = pv.Sphere(
                center=constraint.center,
                radius=constraint.radius,
            )
            actor = self._plotter.add_mesh(
                sphere,
                color=_SPHERE_COLOR,
                opacity=_CONSTRAINT_OPACITY,
                name=f"constraint_{len(self._visuals)}",
            )

        elif isinstance(constraint, BoxSize):
            bounds = constraint.bounds
            if len(bounds[0]) == _DIMS_2D:
                box = pv.Rectangle(
                    [
                        [bounds[0][0], bounds[0][1], 0],
                        [bounds[1][0], bounds[0][1], 0],
                        [bounds[1][0], bounds[1][1], 0],
                        [bounds[0][0], bounds[1][1], 0],
                    ],
                )
            else:
                box = pv.Box(
                    bounds=[
                        bounds[0][0],
                        bounds[1][0],
                        bounds[0][1],
                        bounds[1][1],
                        bounds[0][2],
                        bounds[1][2],
                    ],
                )
            actor = self._plotter.add_mesh(
                box,
                color=_BOX_COLOR,
                opacity=_CONSTRAINT_OPACITY,
                name=f"constraint_{len(self._visuals)}",
            )

        elif isinstance(constraint, CylinderSize):
            direction = constraint.point2 - constraint.point1
            height = np.linalg.norm(direction)
            center = (constraint.point1 + constraint.point2) / 2
            cylinder = pv.Cylinder(
                center=center,
                direction=direction,
                radius=constraint.radius,
                height=height,
            )
            actor = self._plotter.add_mesh(
                cylinder,
                color=_CYLINDER_COLOR,
                opacity=_CONSTRAINT_OPACITY,
                name=f"constraint_{len(self._visuals)}",
            )

        elif isinstance(constraint, PointSize):
            point_3d = (
                constraint.point
                if len(constraint.point) == _DIMS_3D
                else np.array([constraint.point[0], constraint.point[1], 0.0])
            )
            sphere = pv.Sphere(
                center=point_3d,
                radius=constraint.influence_radius,
            )
            actor = self._plotter.add_mesh(
                sphere,
                color=_POINT_COLOR,
                opacity=_CONSTRAINT_OPACITY * 0.5,
                name=f"constraint_{len(self._visuals)}",
            )

            inner_sphere = pv.Sphere(
                center=point_3d,
                radius=constraint.influence_radius * 0.1,
            )
            self._plotter.add_mesh(
                inner_sphere,
                color=_POINT_COLOR,
                opacity=_CONSTRAINT_OPACITY,
                name=f"constraint_{len(self._visuals)}_inner",
            )

        if actor is not None:
            self._visuals.append(ConstraintVisual(constraint=constraint, actor=actor))

    def _show_preview_point(
        self,
        point: NDArray[np.float64],
        color: str,
    ) -> None:
        """Show preview marker at a point."""
        if self._plotter is None:
            return

        self._clear_preview()
        sphere = pv.Sphere(center=point, radius=self._current_radius * 0.2)
        self._state.preview_actor = self._plotter.add_mesh(
            sphere,
            color=color,
            opacity=_PREVIEW_OPACITY,
            name="preview",
        )

    def _update_preview(self) -> None:
        """Update preview based on current state."""
        if self._state.first_point is None or self._plotter is None:
            return

        color = (
            _BOX_COLOR if self._state.mode == ConstraintMode.BOX else _CYLINDER_COLOR
        )
        self._show_preview_point(self._state.first_point, color)

    def _clear_preview(self) -> None:
        """Clear any preview visualization."""
        if self._plotter is not None and self._state.preview_actor is not None:
            self._plotter.remove_actor(self._state.preview_actor)
            self._state.preview_actor = None

    def get_constraints(self) -> list[SizingConstraint]:
        """Get the list of defined constraints.

        Returns
        -------
        list[SizingConstraint]
            List of sizing constraints defined through interaction.

        """
        return list(self._constraints)

    def apply_to_mesh(self) -> None:
        """Apply the defined constraints to the mesh.

        This adds all constraints to the mesh's sizing system, ready
        for the next remesh operation.

        """
        for constraint in self._constraints:
            if isinstance(constraint, SphereSize):
                self._mesh.set_size_sphere(
                    center=constraint.center,
                    radius=constraint.radius,
                    size=constraint.size,
                )
            elif isinstance(constraint, BoxSize):
                self._mesh.set_size_box(
                    bounds=constraint.bounds,
                    size=constraint.size,
                )
            elif isinstance(constraint, CylinderSize):
                self._mesh.set_size_cylinder(
                    point1=constraint.point1,
                    point2=constraint.point2,
                    radius=constraint.radius,
                    size=constraint.size,
                )
            elif isinstance(constraint, PointSize):
                self._mesh.set_size_from_point(
                    point=constraint.point,
                    near_size=constraint.near_size,
                    far_size=constraint.far_size,
                    influence_radius=constraint.influence_radius,
                )

    def clear_constraints(self) -> None:
        """Clear all defined constraints."""
        self._constraints.clear()
        if self._plotter is not None:
            for visual in self._visuals:
                self._plotter.remove_actor(visual.actor)
                if visual.label_actor is not None:
                    self._plotter.remove_actor(visual.label_actor)
        self._visuals.clear()

    def remove_constraint(self, index: int) -> None:
        """Remove a constraint by index.

        Parameters
        ----------
        index : int
            Index of the constraint to remove.

        Raises
        ------
        IndexError
            If index is out of range.

        """
        if index < 0 or index >= len(self._constraints):
            msg = f"Constraint index {index} out of range"
            raise IndexError(msg)

        self._constraints.pop(index)
        if self._plotter is not None:
            visual = self._visuals.pop(index)
            self._plotter.remove_actor(visual.actor)
            if visual.label_actor is not None:
                self._plotter.remove_actor(visual.label_actor)
