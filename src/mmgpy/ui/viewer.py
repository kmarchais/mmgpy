"""Viewer mixin for mmgpy UI - handles visualization and rendering."""

from __future__ import annotations

import logging
from typing import TYPE_CHECKING

import numpy as np
import pyvista as pv

if TYPE_CHECKING:
    from mmgpy import Mesh

logger = logging.getLogger(__name__)


class ViewerMixin:
    """Mixin class providing viewer and visualization functionality.

    This mixin provides methods for:
    - Updating the 3D viewer with mesh data
    - Computing and visualizing scalar fields
    - Camera control and view settings
    - Constraint visualization
    """

    # These attributes are expected to be defined by the main class
    _mesh: Mesh | None
    _plotter: pv.Plotter | None
    _render_window: object
    _solution_fields: dict[str, dict]
    state: object

    def _set_view(self, view: str) -> None:
        """Set the viewer to a predefined view."""
        if self._plotter is None:
            return

        self.state.current_view = view

        view_methods = {
            "xy": lambda: self._plotter.view_xy(),
            "-xy": lambda: self._plotter.view_xy(negative=True),
            "xz": lambda: self._plotter.view_xz(),
            "-xz": lambda: self._plotter.view_xz(negative=True),
            "yz": lambda: self._plotter.view_yz(),
            "-yz": lambda: self._plotter.view_yz(negative=True),
            "isometric": lambda: self._plotter.view_isometric(),
        }

        if view in view_methods:
            view_methods[view]()

        if self._render_window is not None:
            self._render_window.Render()
        if hasattr(self, "_view") and self._view is not None:
            self._view.update()
        self.state.flush()

    def _toggle_parallel_projection(self) -> None:
        """Toggle between parallel and perspective projection."""
        if self._plotter is None:
            return

        self.state.parallel_projection = not self.state.parallel_projection

        if self.state.parallel_projection:
            self._plotter.enable_parallel_projection()
        else:
            self._plotter.disable_parallel_projection()

        if self._render_window is not None:
            self._render_window.Render()
        if hasattr(self, "_view") and self._view is not None:
            self._view.update()
        self.state.flush()

    def _update_viewer(self, *, reset_camera: bool = True) -> None:
        """Update the 3D viewer with current mesh."""
        if self._mesh is None or self._plotter is None:
            return

        self._plotter.clear()

        # Determine which mesh to display (original or current)
        display_mesh = self._mesh
        if (
            getattr(self.state, "show_original_mesh", False)
            and self._original_mesh is not None
        ):
            display_mesh = self._original_mesh

        # Check if we need to show boundary refs for tetrahedral mesh
        show_boundary_refs = (
            self.state.show_scalar == "boundary_refs"
            and self.state.mesh_kind == "tetrahedral"
        )

        if show_boundary_refs:
            # Extract boundary surface and color by boundary refs
            pv_mesh = self._get_boundary_surface_with_refs(mesh=display_mesh)
            if pv_mesh is None:
                # Fallback to regular mesh
                pv_mesh = display_mesh.to_pyvista()
        else:
            pv_mesh = display_mesh.to_pyvista()

        # Compute normals for smooth shading
        if pv_mesh.n_cells > 0 and hasattr(pv_mesh, "compute_normals"):
            try:
                pv_mesh = pv_mesh.compute_normals(
                    cell_normals=True,
                    point_normals=True,
                    split_vertices=True,
                )
            except Exception:
                logger.debug("Could not compute normals for mesh")

        scalars = self._compute_scalars(pv_mesh)
        cmap, scalar_bar_title = self._get_colormap_settings(scalars)

        # Apply slice/threshold for tetrahedral meshes
        pv_mesh = self._apply_slice_if_needed(pv_mesh)

        # Determine text color based on theme
        is_dark = getattr(self.state, "theme_name", "light") == "dark"
        text_color = "white" if is_dark else "black"

        # Build scalar bar args with theme-aware colors
        scalar_bar_args = None
        if scalar_bar_title:
            scalar_bar_args = {
                "title": scalar_bar_title,
                "title_font_size": 14,
                "label_font_size": 12,
                "color": text_color,
            }

        # Check if using face sides visualization (special backface coloring)
        use_face_sides = self.state.show_scalar == "face_sides"

        # Add mesh with rendering settings
        actor = self._plotter.add_mesh(
            pv_mesh,
            show_edges=self.state.show_edges,
            opacity=self.state.opacity,
            scalars=scalars,
            color="dodgerblue"
            if use_face_sides
            else ("white" if scalars is None else None),
            cmap=cmap,
            show_scalar_bar=scalars is not None and not use_face_sides,
            scalar_bar_args=scalar_bar_args,
            smooth_shading=self.state.smooth_shading,
            pbr=False,
            metallic=0.0,
            roughness=0.5,
            diffuse=0.8,
            ambient=0.2,
            specular=0.3,
            specular_power=30,
        )

        # Apply backface coloring for face sides visualization
        if use_face_sides and actor is not None:
            import vtk

            back_prop = vtk.vtkProperty()
            back_prop.SetColor(1.0, 0.3, 0.3)  # Red for back faces (inward)
            back_prop.SetOpacity(self.state.opacity)
            actor.SetBackfaceProperty(back_prop)

            # Add legend for face orientation (bottom right, stacked)
            self._plotter.add_text(
                "Outward",
                position=(0.85, 0.08),
                font_size=10,
                color="dodgerblue",
                name="face_legend_out",
                viewport=True,
            )
            self._plotter.add_text(
                "Inward",
                position=(0.85, 0.03),
                font_size=10,
                color=(1.0, 0.3, 0.3),
                name="face_legend_in",
                viewport=True,
            )

        self._visualize_constraints()
        self._plotter.enable_lightkit()

        # Add axes with theme-aware colors
        self._add_axes_with_theme(is_dark)

        if reset_camera:
            self._setup_camera_for_mesh(pv_mesh)

        # Update the view
        if self._render_window is not None:
            self._render_window.Render()
        if hasattr(self, "_view") and self._view is not None:
            self._view.update()
        self.state.flush()

    def _compute_scalars(self, pv_mesh) -> str | None:
        """Compute scalar field for visualization."""
        scalars = None
        show_scalar = self.state.show_scalar

        if show_scalar == "quality":
            try:
                qualities = self._mesh.get_element_qualities()
                if len(qualities) == pv_mesh.n_cells:
                    pv_mesh.cell_data["quality"] = qualities
                    scalars = "quality"
            except Exception:
                logger.debug("Could not compute quality scalars")

        elif show_scalar == "pv_quality":
            try:
                pv_mesh_quality = pv_mesh.cell_quality(
                    quality_measure="scaled_jacobian",
                )
                pv_mesh.cell_data["scaled_jacobian"] = pv_mesh_quality.cell_data[
                    "scaled_jacobian"
                ]
                scalars = "scaled_jacobian"
            except Exception:
                logger.debug("Could not compute PyVista quality scalars")

        elif show_scalar == "area_volume":
            try:
                pv_mesh_sizes = pv_mesh.compute_cell_sizes(
                    length=False,
                    area=True,
                    volume=True,
                )
                if (
                    "Volume" in pv_mesh_sizes.cell_data
                    and pv_mesh_sizes.cell_data["Volume"].max() > 0
                ):
                    pv_mesh.cell_data["Volume"] = pv_mesh_sizes.cell_data["Volume"]
                    scalars = "Volume"
                elif "Area" in pv_mesh_sizes.cell_data:
                    pv_mesh.cell_data["Area"] = pv_mesh_sizes.cell_data["Area"]
                    scalars = "Area"
            except Exception:
                logger.debug("Could not compute area/volume scalars")

        elif show_scalar == "edge_length":
            try:
                edge_lengths = self._compute_edge_lengths_per_cell(pv_mesh)
                if edge_lengths is not None:
                    pv_mesh.cell_data["edge_length"] = edge_lengths
                    scalars = "edge_length"
            except Exception:
                logger.debug("Could not compute edge length scalars")

        elif show_scalar == "refs":
            if "refs" in pv_mesh.cell_data:
                scalars = "refs"

        elif show_scalar == "boundary_refs":
            # For tetrahedral meshes, visualize boundary triangle refs
            # This is handled specially in _update_viewer
            scalars = "boundary_refs"

        elif show_scalar.startswith("user_"):
            scalars = self._compute_user_scalars(pv_mesh, show_scalar[5:])

        return scalars

    def _compute_user_scalars(self, pv_mesh, field_name: str) -> str | None:
        """Compute user-defined scalar field."""
        if field_name not in self._solution_fields:
            return None

        try:
            field_info = self._solution_fields[field_name]
            field_data = field_info["data"]
            location = field_info["location"]

            # Flatten if needed
            if field_data.ndim == 1:
                values = field_data
            elif field_data.shape[1] == 1:
                values = field_data[:, 0]
            else:
                values = np.linalg.norm(field_data, axis=1)

            # Add to appropriate data array based on location
            if location == "vertices":
                pv_mesh.point_data[field_name] = values
            else:
                pv_mesh.cell_data[field_name] = values
        except Exception:
            logger.debug("Could not compute user scalars for %s", field_name)
            return None
        else:
            return field_name

    def _get_colormap_settings(
        self,
        scalars: str | None,
    ) -> tuple[str | None, str | None]:
        """Get colormap and scalar bar title based on scalar field."""
        if scalars is None:
            return None, None

        show_scalar = self.state.show_scalar

        colormap_map = {
            "quality": ("RdYlGn", "In-Radius Ratio"),
            "pv_quality": ("RdYlGn", "Scaled Jacobian"),
            "edge_length": ("viridis", "Edge Length"),
            "refs": ("tab10", "Reference"),
            "boundary_refs": ("tab10", "Boundary Ref"),
            "area_volume": ("viridis", "Area" if scalars == "Area" else "Volume"),
        }

        if show_scalar in colormap_map:
            return colormap_map[show_scalar]

        if show_scalar.startswith("user_"):
            return "viridis", show_scalar[5:]

        return "viridis", None

    def _apply_slice_if_needed(self, pv_mesh):
        """Apply slice/threshold for tetrahedral meshes."""
        if not (self.state.slice_enabled and self.state.mesh_kind == "tetrahedral"):
            return pv_mesh

        try:
            axis = int(self.state.slice_axis)
            threshold = float(self.state.slice_threshold)
            bounds = pv_mesh.bounds
            min_val = bounds[axis * 2]
            max_val = bounds[axis * 2 + 1]
            cut_value = min_val + threshold * (max_val - min_val)
            cell_centers = pv_mesh.cell_centers().points[:, axis]
            mask = cell_centers < cut_value
            if mask.any():
                return pv_mesh.extract_cells(mask)
        except Exception:
            logger.debug("Could not apply slice to mesh")

        return pv_mesh

    def _setup_camera_for_mesh(self, pv_mesh) -> None:
        """Set up camera based on mesh type."""
        self._plotter.reset_camera()

        is_2d_mesh = False
        if self.state.mesh_kind == "triangular_2d":
            bounds = pv_mesh.bounds
            z_range = bounds[5] - bounds[4]
            xy_range = max(bounds[1] - bounds[0], bounds[3] - bounds[2])
            is_2d_mesh = z_range < xy_range * 0.01

        if is_2d_mesh:
            self._plotter.view_xy()
            self._plotter.enable_parallel_projection()
            self.state.current_view = "xy"
            self.state.parallel_projection = True
        else:
            self._plotter.view_isometric()
            self._plotter.disable_parallel_projection()
            self.state.current_view = "isometric"
            self.state.parallel_projection = False

    def _add_axes_with_theme(self, is_dark: bool) -> None:
        """Add axes widget with theme-aware colors."""
        if self._plotter is None:
            return

        # Set axes label colors based on theme
        text_color = "white" if is_dark else "black"

        # Add axes with custom colors
        self._plotter.add_axes(
            xlabel="X",
            ylabel="Y",
            zlabel="Z",
            color=text_color,
            x_color="red",
            y_color="green",
            z_color="blue",
        )

    def _visualize_constraints(self) -> None:
        """Visualize sizing constraints on the plotter."""
        if self._plotter is None:
            return

        constraints = self.state.sizing_constraints or []

        for constraint in constraints:
            constraint_type = constraint.get("type")
            params = constraint.get("params", {})

            if constraint_type == "sphere":
                center = params.get("center", [0, 0, 0])
                radius = params.get("radius", 0.5)
                sphere = pv.Sphere(
                    center=center,
                    radius=radius,
                    theta_resolution=16,
                    phi_resolution=16,
                )
                self._plotter.add_mesh(
                    sphere,
                    color="orange",
                    opacity=0.3,
                    style="wireframe",
                    line_width=2,
                )

            elif constraint_type == "box":
                bounds_data = params.get(
                    "bounds",
                    [[-0.5, -0.5, -0.5], [0.5, 0.5, 0.5]],
                )
                min_pt = bounds_data[0]
                max_pt = bounds_data[1]
                box = pv.Box(
                    bounds=[
                        min_pt[0],
                        max_pt[0],
                        min_pt[1],
                        max_pt[1],
                        min_pt[2],
                        max_pt[2],
                    ],
                )
                self._plotter.add_mesh(
                    box,
                    color="cyan",
                    opacity=0.3,
                    style="wireframe",
                    line_width=2,
                )

            elif constraint_type == "point":
                point = params.get("point", [0, 0, 0])
                influence_radius = params.get("influence_radius", 0.5)
                point_sphere = pv.Sphere(center=point, radius=0.02)
                self._plotter.add_mesh(point_sphere, color="red")
                influence_sphere = pv.Sphere(
                    center=point,
                    radius=influence_radius,
                    theta_resolution=16,
                    phi_resolution=16,
                )
                self._plotter.add_mesh(
                    influence_sphere,
                    color="red",
                    opacity=0.2,
                    style="wireframe",
                    line_width=1,
                )

    def _get_boundary_surface_with_refs(self, mesh=None):
        """Extract boundary surface from tetrahedral mesh with boundary refs.

        Parameters
        ----------
        mesh : Mesh, optional
            The mesh to extract from. Defaults to self._mesh.

        Returns
        -------
        pv.PolyData or None
            PolyData mesh of the boundary triangles colored by their refs.

        """
        if mesh is None:
            mesh = self._mesh
        if mesh is None:
            return None

        try:
            # Get boundary triangles and their refs from the mesh
            triangles, refs = mesh.get_triangles_with_refs()
            vertices = mesh.get_vertices()

            if len(triangles) == 0:
                return None

            # Create PolyData from boundary triangles
            faces = np.column_stack(
                [
                    np.full(len(triangles), 3, dtype=np.int64),
                    triangles,
                ],
            ).ravel()

            boundary_mesh = pv.PolyData(vertices, faces)

            # Add refs as cell data for coloring
            boundary_mesh.cell_data["boundary_refs"] = refs

        except Exception:
            logger.debug("Could not extract boundary surface with refs")
            return None

        return boundary_mesh

    def _compute_edge_lengths_per_cell(self, pv_mesh) -> np.ndarray | None:
        """Compute average edge length per cell for visualization.

        Returns an array of average edge lengths, one per cell.
        """
        points = np.array(pv_mesh.points)

        if pv_mesh.n_cells == 0:
            return None

        # Handle UnstructuredGrid (tetrahedra)
        if hasattr(pv_mesh, "cells_dict") and pv.CellType.TETRA in pv_mesh.cells_dict:
            tets = pv_mesh.cells_dict[pv.CellType.TETRA]
            v0, v1, v2, v3 = (points[tets[:, i]] for i in range(4))

            # 6 edges per tetrahedron
            e01 = np.linalg.norm(v1 - v0, axis=1)
            e02 = np.linalg.norm(v2 - v0, axis=1)
            e03 = np.linalg.norm(v3 - v0, axis=1)
            e12 = np.linalg.norm(v2 - v1, axis=1)
            e13 = np.linalg.norm(v3 - v1, axis=1)
            e23 = np.linalg.norm(v3 - v2, axis=1)

            return (e01 + e02 + e03 + e12 + e13 + e23) / 6

        # Handle PolyData (triangles)
        if hasattr(pv_mesh, "is_all_triangles") and pv_mesh.is_all_triangles:
            faces = pv_mesh.faces.reshape(-1, 4)[:, 1:4]
            v0, v1, v2 = points[faces[:, 0]], points[faces[:, 1]], points[faces[:, 2]]

            # 3 edges per triangle
            e01 = np.linalg.norm(v1 - v0, axis=1)
            e12 = np.linalg.norm(v2 - v1, axis=1)
            e20 = np.linalg.norm(v0 - v2, axis=1)

            return (e01 + e12 + e20) / 3

        return None

    def _compute_all_edge_lengths(self, pv_mesh) -> np.ndarray | None:
        """Compute all edge lengths in the mesh for statistics.

        Returns an array of all edge lengths (with duplicates for shared edges).
        """
        points = np.array(pv_mesh.points)

        if pv_mesh.n_cells == 0:
            return None

        # Handle UnstructuredGrid (tetrahedra)
        if hasattr(pv_mesh, "cells_dict") and pv.CellType.TETRA in pv_mesh.cells_dict:
            tets = pv_mesh.cells_dict[pv.CellType.TETRA]
            v0, v1, v2, v3 = (points[tets[:, i]] for i in range(4))

            edges = [
                np.linalg.norm(v1 - v0, axis=1),
                np.linalg.norm(v2 - v0, axis=1),
                np.linalg.norm(v3 - v0, axis=1),
                np.linalg.norm(v2 - v1, axis=1),
                np.linalg.norm(v3 - v1, axis=1),
                np.linalg.norm(v3 - v2, axis=1),
            ]
            return np.concatenate(edges)

        # Handle PolyData (triangles)
        if hasattr(pv_mesh, "is_all_triangles") and pv_mesh.is_all_triangles:
            faces = pv_mesh.faces.reshape(-1, 4)[:, 1:4]
            v0, v1, v2 = points[faces[:, 0]], points[faces[:, 1]], points[faces[:, 2]]

            edges = [
                np.linalg.norm(v1 - v0, axis=1),
                np.linalg.norm(v2 - v1, axis=1),
                np.linalg.norm(v0 - v2, axis=1),
            ]
            return np.concatenate(edges)

        return None
