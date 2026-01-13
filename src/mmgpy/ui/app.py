"""Main trame application for mmgpy."""

from __future__ import annotations

import re
import tempfile
from pathlib import Path
from typing import TYPE_CHECKING

import numpy as np
import pyvista as pv
from trame.app import get_server
from trame.app.file_upload import ClientFile
from trame.ui.vuetify3 import SinglePageWithDrawerLayout
from trame.widgets import html
from trame.widgets import vtk as vtk_widgets
from trame.widgets import vuetify3 as v3

if TYPE_CHECKING:
    from mmgpy import Mesh

pv.OFF_SCREEN = True


def parse_sol_file(content: str) -> dict[str, dict]:
    """Parse a Medit .sol file and return solution fields.

    Parameters
    ----------
    content : str
        Content of the .sol file.

    Returns
    -------
    dict[str, dict]
        Dictionary mapping field names to dicts with:
        - "data": numpy array
        - "location": "vertices", "triangles", or "tetrahedra"

    """
    lines = content.strip().split("\n")
    fields: dict[str, dict] = {}

    i = 0
    dimension = 3

    # Map keyword to location name
    location_map = {
        "SolAtVertices": "vertices",
        "SolAtTriangles": "triangles",
        "SolAtTetrahedra": "tetrahedra",
    }

    while i < len(lines):
        line = lines[i].strip()

        if line.startswith("Dimension"):
            match = re.search(r"\d+", line)
            if match:
                dimension = int(match.group())
            elif i + 1 < len(lines):
                i += 1
                dimension = int(lines[i].strip())
            i += 1
            continue

        # Check for any SolAt* keyword
        location = None
        for keyword, loc_name in location_map.items():
            if line.startswith(keyword):
                location = loc_name
                break

        if location is not None:
            i += 1
            if i >= len(lines):
                break

            n_entities = int(lines[i].strip())
            i += 1
            if i >= len(lines):
                break

            type_line = lines[i].strip().split()
            n_solutions = int(type_line[0])
            sol_types = [int(t) for t in type_line[1 : 1 + n_solutions]]

            i += 1
            values: list[list[float]] = []
            while len(values) < n_entities and i < len(lines):
                line = lines[i].strip()
                if line == "End" or line.startswith(("Mesh", "Sol")):
                    break
                if line == "":
                    i += 1
                    continue
                row_values = [float(v) for v in line.split()]
                values.append(row_values)
                i += 1

            if values:
                data = np.array(values, dtype=np.float64)
                col_idx = 0
                for sol_idx, sol_type in enumerate(sol_types):
                    if sol_type == 1:
                        base = f"solution_{sol_idx}" if n_solutions > 1 else "solution"
                        name = f"{base}@{location}"
                        if data.ndim == 1:
                            fields[name] = {"data": data, "location": location}
                        else:
                            fields[name] = {
                                "data": data[:, col_idx],
                                "location": location,
                            }
                        col_idx += 1
                    elif sol_type == 2:
                        base = f"vector_{sol_idx}" if n_solutions > 1 else "vector"
                        name = f"{base}@{location}"
                        fields[name] = {
                            "data": data[:, col_idx : col_idx + dimension],
                            "location": location,
                        }
                        col_idx += dimension
                    elif sol_type == 3:
                        tensor_size = 6 if dimension == 3 else 3
                        base = f"tensor_{sol_idx}" if n_solutions > 1 else "tensor"
                        name = f"{base}@{location}"
                        fields[name] = {
                            "data": data[:, col_idx : col_idx + tensor_size],
                            "location": location,
                        }
                        col_idx += tensor_size
            continue

        i += 1

    return fields


class MmgpyApp:
    """Main mmgpy web application."""

    def __init__(
        self,
        server: str | None = None,
        mesh: Mesh | None = None,
        debug: bool = False,
    ) -> None:
        """Initialize the application."""
        self.server = get_server(server, client_type="vue3")
        self.state = self.server.state
        self.ctrl = self.server.controller
        self._debug = debug

        self._mesh: Mesh | None = mesh
        self._original_mesh: Mesh | None = mesh  # Store original for re-remeshing
        self._solution_metric: np.ndarray | None = None  # Current solution for metric
        self._solution_fields: dict[str, dict] = {}  # name -> {data, location}
        # Store original solution for remeshing from original mesh
        self._original_solution_metric: np.ndarray | None = None
        self._original_solution_fields: dict[str, dict] = {}
        self._plotter: pv.Plotter | None = None
        self._render_window = None

        self._init_state()
        self._setup_callbacks()
        self.ui = self._build_ui()

        if mesh is not None:
            self._update_viewer()

    def _init_state(self) -> None:
        """Initialize application state."""
        self.state.setdefault("drawer_open", True)
        self.state.setdefault("active_tab", "remesh")

        self.state.setdefault("mesh_loaded", False)
        self.state.setdefault("mesh_info", "")
        self.state.setdefault("mesh_kind", "")
        self.state.setdefault("mesh_stats", None)
        self.state.setdefault("info_panel_open", True)

        self.state.setdefault("hmin", None)
        self.state.setdefault("hmax", 0.1)
        self.state.setdefault("hsiz", None)
        self.state.setdefault("hausd", 0.01)
        self.state.setdefault("hgrad", 1.3)
        self.state.setdefault("ar", 45.0)
        self.state.setdefault("verbose", 1)

        self.state.setdefault(
            "selected_options",
            [],
        )  # Multi-select: optim, noinsert, noswap, nomove
        self.state.setdefault("nosurf", False)

        self.state.setdefault("use_preset", "custom")
        self.state.setdefault("remesh_mode", "standard")
        self.state.setdefault("remesh_source", "original")  # "original" or "current"

        self.state.setdefault("levelset_formula", "x**2 + y**2 + z**2 - 0.25")
        self.state.setdefault("displacement_scale", 0.1)
        self.state.setdefault("use_solution_as_metric", False)
        self.state.setdefault("use_solution_as_levelset", False)
        self.state.setdefault("solution_type", "")  # "levelset" or "metric"

        self.state.setdefault("sizing_mode", "sphere")
        self.state.setdefault("sizing_constraints", [])

        self.state.setdefault("validation_report", None)
        self.state.setdefault("remesh_result", None)
        self.state.setdefault("is_remeshing", False)

        self.state.setdefault("show_edges", True)
        self.state.setdefault("show_scalar", "none")
        self.state.setdefault("color_map", "RdYlBu")
        self.state.setdefault(
            "scalar_field_options",
            [
                {"title": "No Color", "value": "none"},
                {"type": "subheader", "title": "— Quality —"},
                {"title": "In-Radius Ratio", "value": "quality"},
                {"title": "Scaled Jacobian", "value": "pv_quality"},
                {"type": "subheader", "title": "— Other —"},
                {"title": "Area/Volume", "value": "area_volume"},
                {"title": "Refs", "value": "refs"},
            ],
        )
        self.state.setdefault("opacity", 1.0)
        self.state.setdefault("smooth_shading", False)

        # Slice view for tetrahedral meshes (extract cells, not clip)
        self.state.setdefault("slice_enabled", False)
        self.state.setdefault("slice_axis", 0)  # 0=X, 1=Y, 2=Z
        self.state.setdefault("slice_threshold", 0.5)  # 0-1 relative to bounds

        self.state.setdefault("file_upload", None)
        self.state.setdefault("sol_file_upload", None)
        self.state.setdefault("mesh_filename", "")
        self.state.setdefault("sol_filename", "")
        self.state.setdefault("solution_fields", {})  # name -> array
        self.state.setdefault("export_format", "vtk")

        self.state.setdefault("current_view", "isometric")
        self.state.setdefault("parallel_projection", False)

        self.state.setdefault(
            "remesh_mode_items",
            [
                {"title": "Standard Remesh", "value": "standard"},
                {"title": "Levelset Discretization", "value": "levelset"},
                {"title": "Lagrangian Motion", "value": "lagrangian"},
                {"title": "Optimize Only", "value": "optimize"},
            ],
        )

    def _setup_callbacks(self) -> None:
        """Set up state change callbacks."""
        self._applying_preset = False  # Flag to prevent feedback loop

        @self.state.change("file_upload")
        def on_file_upload(file_upload, **_):
            if file_upload is None:
                return
            self._handle_file_upload(file_upload)

        @self.state.change("sol_file_upload")
        def on_sol_file_upload(sol_file_upload, **_):
            if sol_file_upload is None:
                return
            self._handle_sol_file_upload(sol_file_upload)

        @self.state.change(
            "show_edges",
            "opacity",
            "show_scalar",
            "smooth_shading",
            "slice_enabled",
            "slice_axis",
            "slice_threshold",
        )
        def on_view_settings_change(**_):
            if self._mesh is not None:
                self._update_viewer()

        @self.state.change("mesh_kind")
        def on_mesh_kind_change(mesh_kind, **_):
            base_modes = [
                {"title": "Standard Remesh", "value": "standard"},
                {"title": "Levelset Discretization", "value": "levelset"},
                {"title": "Optimize Only", "value": "optimize"},
            ]
            if mesh_kind != "triangular_surface":
                base_modes.insert(
                    2,
                    {"title": "Lagrangian Motion", "value": "lagrangian"},
                )
            self.state.remesh_mode_items = base_modes
            if (
                self.state.remesh_mode == "lagrangian"
                and mesh_kind == "triangular_surface"
            ):
                self.state.remesh_mode = "standard"

        self.ctrl.load_sample_mesh = self._load_sample_mesh
        self.ctrl.run_remesh = self._run_remesh
        self.ctrl.run_validation = self._run_validation
        self.ctrl.export_mesh = self._export_mesh
        self.ctrl.reset_mesh = self._reset_mesh
        self.ctrl.add_sizing_constraint = self._add_sizing_constraint
        self.ctrl.clear_sizing_constraints = self._clear_sizing_constraints

        self.server.trigger("run_remesh")(self._run_remesh)
        self.server.trigger("run_validation")(self._run_validation)
        self.server.trigger("reset_mesh")(self._reset_mesh)
        self.server.trigger("export_mesh")(self._export_mesh)
        self.server.trigger("load_sample_mesh")(self._load_sample_mesh)
        self.server.trigger("clear_sizing_constraints")(self._clear_sizing_constraints)
        self.server.trigger("add_sizing_constraint")(self._add_sizing_constraint)
        self.server.trigger("apply_preset")(self._apply_preset_trigger)
        self.server.trigger("set_custom_preset")(self._set_custom_preset)
        self.server.trigger("set_view")(self._set_view)
        self.server.trigger("toggle_parallel_projection")(
            self._toggle_parallel_projection,
        )

    def _set_custom_preset(self) -> None:
        """Set preset to custom when user manually changes values."""
        if self.state.use_preset != "custom":
            self.state.use_preset = "custom"

    def _set_view(self, view: str) -> None:
        """Set the viewer to a predefined view."""
        if self._plotter is None:
            return

        self.state.current_view = view

        if view == "xy":
            self._plotter.view_xy()
        elif view == "-xy":
            self._plotter.view_xy(negative=True)
        elif view == "xz":
            self._plotter.view_xz()
        elif view == "-xz":
            self._plotter.view_xz(negative=True)
        elif view == "yz":
            self._plotter.view_yz()
        elif view == "-yz":
            self._plotter.view_yz(negative=True)
        elif view == "isometric":
            self._plotter.view_isometric()

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

    def _handle_file_upload(self, file_upload) -> None:
        """Handle uploaded mesh file."""
        from mmgpy import Mesh

        client_file = ClientFile(file_upload)
        suffix = Path(client_file.name).suffix

        with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
            tmp.write(client_file.content)
            tmp_path = tmp.name

        try:
            self._mesh = Mesh(tmp_path)
            self._original_mesh = Mesh(tmp_path)  # Store original for re-remeshing
            self._update_mesh_info()
            self._apply_adaptive_defaults()  # Set params based on mesh scale
            self._update_viewer()
            self.state.mesh_loaded = True
            self.state.mesh_filename = client_file.name
            self.state.sol_filename = ""
            self.state.remesh_result = None
            self.state.solution_fields = {}
            self.state.use_solution_as_metric = False
            self.state.use_solution_as_levelset = False
            self.state.solution_type = ""
            self._solution_metric = None
            self._solution_fields = {}
            self._original_solution_metric = None
            self._original_solution_fields = {}
        except Exception as e:
            self.state.mesh_info = f"Error loading mesh: {e}"
        finally:
            self.state.file_upload = None
            self.state.flush()
            Path(tmp_path).unlink(missing_ok=True)

    def _handle_sol_file_upload(self, sol_file_upload) -> None:
        """Handle uploaded solution file."""
        if self._mesh is None:
            return

        client_file = ClientFile(sol_file_upload)
        content = client_file.content.decode("utf-8")

        try:
            fields = parse_sol_file(content)

            # Get mesh entity counts for validation
            n_vertices = len(self._mesh.get_vertices())
            kind = self._mesh.kind.value
            if kind == "tetrahedral":
                n_elements = len(self._mesh.get_tetrahedra())
                element_type = "tetrahedra"
            else:
                n_elements = len(self._mesh.get_triangles())
                element_type = "triangles"

            # Map location to expected count
            expected_counts = {
                "vertices": n_vertices,
                "triangles": n_elements if element_type == "triangles" else 0,
                "tetrahedra": n_elements if element_type == "tetrahedra" else 0,
            }

            # Check which fields match the mesh
            valid_fields = {}
            mismatched_fields = {}
            for name, field_info in fields.items():
                data = field_info["data"]
                location = field_info["location"]
                expected = expected_counts.get(location, 0)

                if len(data) == expected and expected > 0:
                    valid_fields[name] = {"data": data, "location": location}
                else:
                    mismatched_fields[name] = {
                        "count": len(data),
                        "location": location,
                        "expected": expected,
                    }

            # Warn user if fields were skipped due to count mismatch
            if mismatched_fields and not valid_fields:
                # Build informative error message
                field_parts = []
                for name, info in mismatched_fields.items():
                    field_parts.append(
                        f"{name}: {info['count']} values "
                        f"(expected {info['expected']} {info['location']})",
                    )
                field_info_str = "; ".join(field_parts)
                mesh_info = f"{n_vertices} vertices, {n_elements} {element_type}"
                self.state.remesh_result = {
                    "error": (
                        f"Solution file mismatch: {field_info_str}. "
                        f"Mesh has {mesh_info}."
                    ),
                }
                self.state.sol_filename = ""
                return

            # Store solution fields in app instance for visualization
            self._solution_fields = valid_fields
            # Store deep copy as original (for remeshing from original mesh)
            self._original_solution_fields = {
                name: {"data": info["data"].copy(), "location": info["location"]}
                for name, info in valid_fields.items()
            }
            self.state.solution_fields = {
                name: {
                    "shape": info["data"].shape,
                    "location": info["location"],
                }
                for name, info in valid_fields.items()
            }
            self._update_scalar_field_options()

            if valid_fields:
                first_field = next(iter(valid_fields.keys()))
                self.state.show_scalar = f"user_{first_field}"
                first_info = valid_fields[first_field]

                # Only use vertex-based solutions for metric/levelset
                if first_info["location"] == "vertices":
                    data = first_info["data"]
                    self._solution_metric = data.copy()
                    self._original_solution_metric = data.copy()

                    # Auto-detect: levelset (has negatives) vs metric (all positive)
                    has_negative = np.any(data < 0)
                    has_zero_or_negative = np.any(data <= 0)

                    if has_negative:
                        # Signed distance field → use as levelset
                        self.state.solution_type = "levelset"
                        self.state.use_solution_as_levelset = True
                        self.state.use_solution_as_metric = False
                        self.state.remesh_mode = "levelset"
                    elif has_zero_or_negative:
                        # Has zeros but no negatives → ambiguous, default to levelset
                        self.state.solution_type = "levelset"
                        self.state.use_solution_as_levelset = True
                        self.state.use_solution_as_metric = False
                        self.state.remesh_mode = "levelset"
                    else:
                        # All positive → use as metric (sizing field)
                        self.state.solution_type = "metric"
                        self.state.use_solution_as_metric = True
                        self.state.use_solution_as_levelset = False

            self._update_viewer(reset_camera=False)
            self.state.sol_filename = client_file.name
        except Exception as e:
            self.state.remesh_result = {"error": f"Error loading solution: {e}"}
        finally:
            self.state.sol_file_upload = None

    def _update_scalar_field_options(self) -> None:
        """Update scalar field dropdown options based on available fields."""
        base_options = [
            {"title": "No Color", "value": "none"},
            {"type": "subheader", "title": "— Quality —"},
            {"title": "In-Radius Ratio", "value": "quality"},
            {"title": "Scaled Jacobian", "value": "pv_quality"},
            {"type": "subheader", "title": "— Other —"},
            {"title": "Area/Volume", "value": "area_volume"},
            {"title": "Refs", "value": "refs"},
        ]

        if self._solution_fields:
            base_options.append({"type": "subheader", "title": "— Solution —"})
            for name, info in self._solution_fields.items():
                # Create display name: "solution (vertices)" or "solution (triangles)"
                base_name = name.split("@")[0] if "@" in name else name
                location = info["location"]
                display_name = f"{base_name} ({location})"
                base_options.append({"title": display_name, "value": f"user_{name}"})

        self.state.scalar_field_options = base_options

    def _load_sample_mesh(self, sample_name: str) -> None:
        """Load a sample mesh."""
        from mmgpy import Mesh

        def create_tetra_cube():
            """Create a tetrahedral cube mesh from interior points."""
            # Create a grid of points inside the cube
            n = 5  # Points per axis
            x = np.linspace(-0.5, 0.5, n)
            y = np.linspace(-0.5, 0.5, n)
            z = np.linspace(-0.5, 0.5, n)
            xx, yy, zz = np.meshgrid(x, y, z)
            points = np.column_stack([xx.ravel(), yy.ravel(), zz.ravel()])
            cloud = pv.PolyData(points)
            return cloud.delaunay_3d()

        def create_tetra_sphere():
            """Create a tetrahedral sphere mesh from structured interior points."""
            # Create structured points inside a sphere using spherical shells
            points = [[0, 0, 0]]  # Center point
            n_shells = 3
            for shell in range(1, n_shells + 1):
                r = shell / n_shells
                # Number of points increases with shell radius
                n_phi = 4 + shell * 2
                n_theta = 8 + shell * 4
                for i in range(n_phi):
                    phi = np.pi * (i + 0.5) / n_phi  # Avoid poles
                    for j in range(n_theta):
                        theta = 2 * np.pi * j / n_theta
                        x = r * np.sin(phi) * np.cos(theta)
                        y = r * np.sin(phi) * np.sin(theta)
                        z = r * np.cos(phi)
                        points.append([x, y, z])
            points = np.array(points)
            cloud = pv.PolyData(points)
            return cloud.delaunay_3d()

        def create_2d_disc():
            """Create a 2D triangular disc mesh with good quality."""
            # Use small inner radius to avoid degenerate center triangles
            # Then use delaunay_2d for better quality
            n_rings = 5
            n_sectors = 16
            points = []
            for i in range(n_rings + 1):
                r = 0.1 + 0.9 * i / n_rings  # Start from r=0.1 to avoid center issues
                if i == 0:
                    # Add center point
                    points.append([0, 0, 0])
                else:
                    for j in range(n_sectors):
                        theta = 2 * np.pi * j / n_sectors
                        points.append([r * np.cos(theta), r * np.sin(theta), 0])
            points = np.array(points)
            cloud = pv.PolyData(points)
            return cloud.delaunay_2d()

        def create_2d_rectangle():
            """Create a 2D triangular rectangle mesh."""
            plane = pv.Plane(i_resolution=10, j_resolution=10)
            return plane.triangulate()

        samples = {
            # Surface meshes (mmgs)
            "sphere": lambda: pv.Sphere(theta_resolution=20, phi_resolution=20),
            "cube": lambda: pv.Cube().triangulate(),
            "cylinder": lambda: pv.Cylinder(resolution=20).triangulate(),
            "cone": lambda: pv.Cone(resolution=20).triangulate(),
            "torus": lambda: pv.ParametricTorus(u_res=30, v_res=30),
            "bunny": lambda: pv.examples.download_bunny(),
            # Tetrahedral meshes (mmg3d)
            "tetra_cube": create_tetra_cube,
            "tetra_sphere": create_tetra_sphere,
            # 2D meshes (mmg2d)
            "disc_2d": create_2d_disc,
            "rect_2d": create_2d_rectangle,
        }

        if sample_name not in samples:
            return

        pv_mesh = samples[sample_name]()

        if hasattr(pv_mesh, "triangulate") and pv_mesh.n_cells > 0:
            # Only triangulate if not already tetrahedral
            if not (hasattr(pv_mesh, "celltypes") and 10 in pv_mesh.celltypes):
                pv_mesh = pv_mesh.triangulate()

        self._mesh = Mesh(pv_mesh)
        self._original_mesh = Mesh(pv_mesh)  # Store original for re-remeshing
        self._update_mesh_info()
        self._apply_adaptive_defaults()  # Set params based on mesh scale
        self._update_viewer()
        self.state.mesh_loaded = True
        self.state.mesh_filename = f"sample:{sample_name}"
        self.state.sol_filename = ""
        self.state.solution_fields = {}
        self.state.use_solution_as_metric = False
        self.state.use_solution_as_levelset = False
        self.state.solution_type = ""
        self._solution_metric = None
        self._solution_fields = {}
        self._original_solution_metric = None
        self._original_solution_fields = {}
        self.state.remesh_result = None

    def _update_mesh_info(self) -> None:
        """Update mesh information display."""
        if self._mesh is None:
            self.state.mesh_info = ""
            self.state.mesh_kind = ""
            self.state.mesh_stats = None
            return

        vertices = self._mesh.get_vertices()
        n_verts = len(vertices)
        kind = self._mesh.kind.value

        mmg_module_map = {
            "tetrahedral": "mmg3d",
            "triangular_2d": "mmg2d",
            "triangular_surface": "mmgs",
        }
        mmg_module = mmg_module_map.get(kind, "unknown")

        if kind == "tetrahedral":
            n_elements = len(self._mesh.get_tetrahedra())
            elem_type = "tetrahedra"
        else:
            n_elements = len(self._mesh.get_triangles())
            elem_type = "triangles"

        bounds = self._mesh.get_bounds()
        size = bounds[1] - bounds[0]

        # Compute quality statistics
        try:
            qualities = self._mesh.get_element_qualities()
            quality_stats = {
                "min": float(np.min(qualities)),
                "max": float(np.max(qualities)),
                "mean": float(np.mean(qualities)),
                "std": float(np.std(qualities)),
            }
        except Exception:
            quality_stats = None

        # Build detailed mesh stats
        self.state.mesh_stats = {
            "vertices": n_verts,
            "elements": n_elements,
            "element_type": elem_type,
            "kind": kind,
            "mmg_module": mmg_module,
            "bounds": {
                "min": bounds[0].tolist()
                if hasattr(bounds[0], "tolist")
                else list(bounds[0]),
                "max": bounds[1].tolist()
                if hasattr(bounds[1], "tolist")
                else list(bounds[1]),
            },
            "size": size.tolist() if hasattr(size, "tolist") else list(size),
            "quality": quality_stats,
        }

        self.state.mesh_info = (
            f"Vertices: {n_verts:,} | {elem_type.title()}: {n_elements:,}\n"
            f"Size: {size[0]:.3f} × {size[1]:.3f} × {size[2]:.3f}"
            if len(size) == 3
            else f"Vertices: {n_verts:,} | {elem_type.title()}: {n_elements:,}\n"
            f"Size: {size[0]:.3f} × {size[1]:.3f}"
        )
        self.state.mesh_kind = kind
        self._update_scalar_field_options()

    def _update_viewer(self, *, reset_camera: bool = True) -> None:
        """Update the 3D viewer with current mesh."""
        if self._mesh is None:
            return

        if self._plotter is None:
            return

        self._plotter.clear()

        pv_mesh = self._mesh.to_pyvista()

        # Compute normals for smooth shading (only for PolyData, not UnstructuredGrid)
        if pv_mesh.n_cells > 0 and hasattr(pv_mesh, "compute_normals"):
            try:
                pv_mesh = pv_mesh.compute_normals(
                    cell_normals=True,
                    point_normals=True,
                    split_vertices=True,
                )
            except Exception:
                pass  # Skip if normals computation fails

        scalars = None
        if self.state.show_scalar == "quality":
            try:
                qualities = self._mesh.get_element_qualities()
                if len(qualities) == pv_mesh.n_cells:
                    pv_mesh.cell_data["quality"] = qualities
                    scalars = "quality"
            except Exception:
                pass
        elif self.state.show_scalar == "pv_quality":
            try:
                pv_mesh = pv_mesh.cell_quality(quality_measure="scaled_jacobian")
                scalars = "scaled_jacobian"
            except Exception:
                pass
        elif self.state.show_scalar == "area_volume":
            try:
                pv_mesh = pv_mesh.compute_cell_sizes(
                    length=False,
                    area=True,
                    volume=True,
                )
                # Use Area for 2D/surface meshes, Volume for 3D
                if (
                    "Volume" in pv_mesh.cell_data
                    and pv_mesh.cell_data["Volume"].max() > 0
                ):
                    scalars = "Volume"
                elif "Area" in pv_mesh.cell_data:
                    scalars = "Area"
            except Exception:
                pass
        elif self.state.show_scalar == "refs":
            if "refs" in pv_mesh.cell_data:
                scalars = "refs"
        elif self.state.show_scalar.startswith("user_"):
            field_name = self.state.show_scalar[5:]
            try:
                if field_name in self._solution_fields:
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
                    else:  # triangles or tetrahedra
                        pv_mesh.cell_data[field_name] = values
                    scalars = field_name
            except Exception:
                pass

        # Select colormap and scalar bar title based on field type
        scalar_bar_title = None
        if scalars is None:
            cmap = None
        elif self.state.show_scalar == "quality":
            cmap = "RdYlGn"  # Quality fields: red (bad) -> yellow -> green (good)
            scalar_bar_title = "In-Radius Ratio"
        elif self.state.show_scalar == "pv_quality":
            cmap = "RdYlGn"
            scalar_bar_title = "Scaled Jacobian"
        elif self.state.show_scalar == "refs":
            cmap = "tab10"  # Discrete colormap for reference markers
            scalar_bar_title = "Reference"
        elif self.state.show_scalar == "area_volume":
            cmap = "viridis"
            scalar_bar_title = "Area" if scalars == "Area" else "Volume"
        elif self.state.show_scalar.startswith("user_"):
            cmap = "viridis"
            scalar_bar_title = self.state.show_scalar[5:]
        else:
            cmap = "viridis"

        # Apply slice/threshold for tetrahedral meshes to see inside
        if self.state.slice_enabled and self.state.mesh_kind == "tetrahedral":
            try:
                axis = int(self.state.slice_axis)
                threshold = float(self.state.slice_threshold)
                bounds = pv_mesh.bounds
                # Convert threshold (0-1) to actual coordinate
                min_val = bounds[axis * 2]
                max_val = bounds[axis * 2 + 1]
                cut_value = min_val + threshold * (max_val - min_val)
                # Extract cells where cell center is below threshold
                cell_centers = pv_mesh.cell_centers().points[:, axis]
                mask = cell_centers < cut_value
                if mask.any():
                    pv_mesh = pv_mesh.extract_cells(mask)
            except Exception:
                pass

        # Add mesh with improved rendering settings
        self._plotter.add_mesh(
            pv_mesh,
            show_edges=self.state.show_edges,
            opacity=self.state.opacity,
            scalars=scalars,
            color="white" if scalars is None else None,
            cmap=cmap,
            show_scalar_bar=scalars is not None,
            scalar_bar_args={"title": scalar_bar_title} if scalar_bar_title else None,
            smooth_shading=self.state.smooth_shading,
            pbr=False,
            metallic=0.0,
            roughness=0.5,
            diffuse=0.8,
            ambient=0.2,
            specular=0.3,
            specular_power=30,
        )

        # Visualize sizing constraints
        self._visualize_constraints()

        # Setup lighting
        self._plotter.enable_lightkit()

        if reset_camera:
            self._plotter.reset_camera()

            # Set default view based on mesh type
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

        # Update the view - render and push to client
        if self._render_window is not None:
            self._render_window.Render()
        # Use the view's update method directly if available
        if hasattr(self, "_view") and self._view is not None:
            self._view.update()
        # Also flush state to ensure client receives update
        self.state.flush()

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
                # Show point as a small sphere
                point_sphere = pv.Sphere(center=point, radius=0.02)
                self._plotter.add_mesh(
                    point_sphere,
                    color="red",
                )
                # Show influence radius as wireframe sphere
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

    def _get_mesh_diagonal(self) -> float:
        """Get the diagonal length of the mesh bounding box."""
        if self._mesh is None:
            return 1.0  # Default for no mesh
        bounds = self._mesh.get_bounds()
        size = bounds[1] - bounds[0]
        return float(np.linalg.norm(size))

    def _round_to_significant(self, x: float, sig: int = 2) -> float:
        """Round a number to a specified number of significant figures."""
        if x == 0:
            return 0.0
        from math import floor, log10

        return round(x, -int(floor(log10(abs(x)))) + (sig - 1))

    def _apply_adaptive_defaults(self) -> None:
        """Set default remeshing parameters based on mesh scale."""
        diagonal = self._get_mesh_diagonal()

        # Medium preset as default (relative to mesh diagonal)
        self._applying_preset = True
        try:
            self.state.hmax = self._round_to_significant(
                diagonal / 25,
            )  # ~4% of diagonal
            self.state.hausd = self._round_to_significant(
                diagonal / 500,
            )  # ~0.2% of diagonal
            self.state.hgrad = 1.3
            self.state.hmin = None
            self.state.use_preset = "medium"
        finally:
            self._applying_preset = False
        # Force UI update
        self.state.flush()

    def _apply_preset_trigger(self, preset: str) -> None:
        """Trigger handler for preset buttons."""
        self.state.use_preset = preset
        self._apply_preset(preset)

    def _apply_preset(self, preset: str) -> None:
        """Apply a remeshing preset scaled to mesh size."""
        if preset == "custom":
            return  # Don't change values for custom

        diagonal = self._get_mesh_diagonal()

        # Presets as fractions of mesh diagonal
        # hmax: controls target edge length
        # hausd: controls geometric deviation (accuracy)
        # hgrad: gradation ratio (scale-independent)
        preset_ratios = {
            "fine": {"hmax": diagonal / 50, "hausd": diagonal / 1000, "hgrad": 1.2},
            "medium": {"hmax": diagonal / 25, "hausd": diagonal / 500, "hgrad": 1.3},
            "coarse": {"hmax": diagonal / 10, "hausd": diagonal / 200, "hgrad": 1.5},
            "optimize": {"optim": True, "noinsert": True},
        }

        if preset in preset_ratios:
            self._applying_preset = True
            try:
                for key, value in preset_ratios[preset].items():
                    if isinstance(value, float) and key != "hgrad":
                        # Round to 2 significant figures for nicer display
                        value = self._round_to_significant(value)
                    setattr(self.state, key, value)
            finally:
                self._applying_preset = False
            # Force UI update
            self.state.flush()

    def _run_remesh(self) -> None:
        """Execute remeshing operation."""
        from mmgpy import Mesh
        from mmgpy._transfer import transfer_fields

        if self._mesh is None:
            return

        self.state.is_remeshing = True

        try:
            # Choose source mesh and solution based on option
            use_original = (
                self.state.remesh_source == "original"
                and self._original_mesh is not None
            )
            if use_original:
                source_mesh = self._original_mesh
                source_solution_fields = self._original_solution_fields
                source_solution_metric = self._original_solution_metric
            else:
                source_mesh = self._mesh
                source_solution_fields = self._solution_fields
                source_solution_metric = self._solution_metric

            # Store old mesh info for field transfer (before creating fresh mesh)
            old_vertices = source_mesh.get_vertices()
            kind = source_mesh.kind.value
            if kind == "tetrahedral":
                old_elements = source_mesh.get_tetrahedra()
            else:
                old_elements = source_mesh.get_triangles()

            # Create a fresh Mesh object to avoid MMG internal state issues
            # (e.g., metric fields from previous remesh conflicting with optim option)
            pv_mesh = source_mesh.to_pyvista()
            self._mesh = Mesh(pv_mesh)

            # Apply solution as metric if enabled
            if self.state.use_solution_as_metric and source_solution_metric is not None:
                n_vertices = len(self._mesh.get_vertices())
                if len(source_solution_metric) == n_vertices:
                    metric = source_solution_metric
                    if metric.ndim == 1:
                        metric = metric.reshape(-1, 1)
                    self._mesh.set_field("metric", metric.astype(np.float64))

            options = {}

            # Helper to safely convert to float (handles None, empty string, etc.)
            def to_float(val):
                if val is None or val == "":
                    return None
                return float(val)

            hmin = to_float(self.state.hmin)
            hmax = to_float(self.state.hmax)
            hsiz = to_float(self.state.hsiz)
            hausd = to_float(self.state.hausd)
            hgrad = to_float(self.state.hgrad)
            ar = to_float(self.state.ar)

            # Validate parameters
            if hmin is not None and hmin <= 0:
                raise ValueError("hmin must be > 0")
            if hmax is not None and hmax <= 0:
                raise ValueError("hmax must be > 0")
            if hsiz is not None and hsiz <= 0:
                raise ValueError("hsiz must be > 0")
            if hausd is not None and hausd <= 0:
                raise ValueError("hausd must be > 0")
            if hgrad is not None and hgrad <= 1.0:
                raise ValueError("hgrad must be > 1.0")
            if hmin is not None and hmax is not None and hmin > hmax:
                raise ValueError("hmin must be <= hmax")

            if hmin is not None:
                options["hmin"] = hmin
            if hmax is not None:
                options["hmax"] = hmax
            if hsiz is not None:
                options["hsiz"] = hsiz
            if hausd is not None:
                options["hausd"] = hausd
            if hgrad is not None:
                options["hgrad"] = hgrad
            if ar is not None:
                options["ar"] = ar

            options["verbose"] = int(self.state.verbose or 1)

            # Get selected options from multi-select button group
            selected = self.state.selected_options or []
            if "optim" in selected:
                options["optim"] = 1
            if "noinsert" in selected:
                options["noinsert"] = 1
            if "noswap" in selected:
                options["noswap"] = 1
            if "nomove" in selected:
                options["nomove"] = 1
            if "nosurf" in selected and self.state.mesh_kind == "tetrahedral":
                options["nosurf"] = 1

            mode = self.state.remesh_mode

            if mode == "standard":
                result = self._mesh.remesh(progress=False, **options)
            elif mode == "levelset":
                # Use solution file as levelset if enabled, otherwise compute from formula
                if (
                    self.state.use_solution_as_levelset
                    and source_solution_metric is not None
                ):
                    levelset = source_solution_metric
                    if levelset.ndim == 1:
                        levelset = levelset.reshape(-1, 1)
                else:
                    levelset = self._compute_levelset()
                result = self._mesh.remesh_levelset(levelset, progress=False, **options)
            elif mode == "lagrangian":
                displacement = self._compute_displacement()
                result = self._mesh.remesh_lagrangian(
                    displacement,
                    progress=False,
                    **options,
                )
            elif mode == "optimize":
                result = self._mesh.remesh_optimize(progress=False)
            else:
                result = self._mesh.remesh(progress=False, **options)

            self.state.remesh_result = {
                "vertices_before": result.vertices_before,
                "vertices_after": result.vertices_after,
                "elements_before": result.elements_before,
                "elements_after": result.elements_after,
                "quality_before": f"{result.quality_mean_before:.3f}",
                "quality_after": f"{result.quality_mean_after:.3f}",
                "duration": f"{result.duration_seconds:.2f}s",
                "warnings": list(result.warnings),
            }

            # Transfer solution fields to new mesh via interpolation
            if source_solution_fields:
                new_vertices = self._mesh.get_vertices()
                # Only transfer vertex-based fields
                vertex_fields = {
                    name: info["data"]
                    for name, info in source_solution_fields.items()
                    if info["location"] == "vertices"
                }
                if vertex_fields:
                    try:
                        transferred = transfer_fields(
                            source_vertices=old_vertices,
                            source_elements=old_elements,
                            target_points=new_vertices,
                            fields=vertex_fields,
                        )
                        # Update current solution fields with transferred values
                        for name, new_data in transferred.items():
                            if name in self._solution_fields:
                                self._solution_fields[name]["data"] = new_data
                            else:
                                loc = source_solution_fields[name]["location"]
                                self._solution_fields[name] = {
                                    "data": new_data,
                                    "location": loc,
                                }
                        # Update current solution metric
                        first_field = next(iter(vertex_fields.keys()))
                        self._solution_metric = transferred[first_field].copy()
                        self._update_scalar_field_options()
                    except Exception:
                        # If transfer fails, clear solution state
                        self.state.sol_filename = ""
                        self.state.solution_fields = {}
                        self._solution_fields = {}
                        self._solution_metric = None
                        self.state.use_solution_as_metric = False
                        self.state.use_solution_as_levelset = False
                        self.state.solution_type = ""
                        if self.state.show_scalar.startswith("user_"):
                            self.state.show_scalar = "quality"
                        self._update_scalar_field_options()

            self._update_mesh_info()
            self._update_viewer(reset_camera=False)

        except Exception as e:
            self.state.remesh_result = {"error": str(e)}
        finally:
            self.state.is_remeshing = False
            # Ensure remesh result is pushed to client
            self.state.flush()

    def _compute_levelset(self) -> np.ndarray:
        """Compute levelset field from formula."""
        vertices = self._mesh.get_vertices()
        x, y, z = vertices[:, 0], vertices[:, 1], vertices[:, 2]

        formula = self.state.levelset_formula
        levelset = eval(formula, {"x": x, "y": y, "z": z, "np": np})

        return np.asarray(levelset, dtype=np.float64).reshape(-1, 1)

    def _compute_displacement(self) -> np.ndarray:
        """Compute displacement field."""
        vertices = self._mesh.get_vertices()
        n_verts = len(vertices)
        dim = vertices.shape[1]

        scale = float(self.state.displacement_scale)
        displacement = np.random.randn(n_verts, dim) * scale

        return displacement.astype(np.float64)

    def _run_validation(self) -> None:
        """Run mesh validation."""
        if self._mesh is None:
            return

        report = self._mesh.validate(detailed=True)

        quality_data = None
        if report.quality:
            quality_data = {
                "min": f"{report.quality.min:.3f}",
                "max": f"{report.quality.max:.3f}",
                "mean": f"{report.quality.mean:.3f}",
                "std": f"{report.quality.std:.3f}",
                "histogram": list(report.quality.histogram),
            }

        self.state.validation_report = {
            "is_valid": report.is_valid,
            "mesh_type": report.mesh_type,
            "errors": [
                {"check": i.check_name, "message": i.message} for i in report.errors
            ],
            "warnings": [
                {"check": i.check_name, "message": i.message} for i in report.warnings
            ],
            "quality": quality_data,
        }

    def _add_sizing_constraint(self, constraint_type: str, params: dict) -> None:
        """Add a sizing constraint."""
        if self._mesh is None:
            return

        if constraint_type == "sphere":
            self._mesh.set_size_sphere(
                center=params["center"],
                radius=params["radius"],
                size=params["size"],
            )
        elif constraint_type == "box":
            self._mesh.set_size_box(
                bounds=params["bounds"],
                size=params["size"],
            )
        elif constraint_type == "point":
            self._mesh.set_size_from_point(
                point=params["point"],
                near_size=params["near_size"],
                far_size=params["far_size"],
                influence_radius=params["influence_radius"],
            )

        constraints = list(self.state.sizing_constraints)
        constraints.append({"type": constraint_type, "params": params})
        self.state.sizing_constraints = constraints

        # Update viewer to show the new constraint
        self._update_viewer()

    def _clear_sizing_constraints(self) -> None:
        """Clear all sizing constraints."""
        if self._mesh is not None:
            self._mesh.clear_local_sizing()
        self.state.sizing_constraints = []

        # Update viewer to remove constraint visualizations
        self._update_viewer()

    def _export_mesh(self) -> None:
        """Export mesh to file (triggers download)."""

    def _reset_mesh(self) -> None:
        """Reset to original mesh state."""
        self._mesh = None
        self.state.mesh_loaded = False
        self.state.mesh_info = ""
        self.state.mesh_kind = ""
        self.state.validation_report = None
        self.state.remesh_result = None

        if self._plotter is not None:
            self._plotter.close()
            self._plotter = None
            self._render_window = None

    def _build_ui(self):
        """Build the trame UI."""
        with SinglePageWithDrawerLayout(self.server, full_height=True) as layout:
            layout.title.set_text("mmgpy")
            layout.icon.click = "drawer_open = !drawer_open"

            with layout.toolbar:
                v3.VSpacer()
                self._build_toolbar()

            with layout.drawer as drawer:
                drawer.width = 320
                self._build_drawer()

            with layout.content:
                self._build_content()

            if self._debug:
                with layout.footer:
                    v3.VBtn(
                        "Print HTML",
                        click=lambda: print(layout.html),
                        variant="text",
                        size="small",
                    )

        return layout

    def _build_toolbar(self) -> None:
        """Build toolbar content."""
        # Sample meshes menu
        with v3.VMenu():
            with v3.Template(v_slot_activator="{ props }"):
                v3.VBtn(
                    icon="mdi-shape",
                    v_bind="props",
                    title="Load sample mesh",
                    variant="text",
                )
            with v3.VList(density="compact"):
                v3.VListSubheader("Surface Meshes (mmgs)")
                v3.VListItem(
                    title="Sphere",
                    click="trigger('load_sample_mesh', ['sphere'])",
                    prepend_icon="mdi-sphere",
                )
                v3.VListItem(
                    title="Cube",
                    click="trigger('load_sample_mesh', ['cube'])",
                    prepend_icon="mdi-cube-outline",
                )
                v3.VListItem(
                    title="Torus",
                    click="trigger('load_sample_mesh', ['torus'])",
                    prepend_icon="mdi-circle-double",
                )
                v3.VListItem(
                    title="Bunny",
                    click="trigger('load_sample_mesh', ['bunny'])",
                    prepend_icon="mdi-rabbit",
                )
                v3.VDivider()
                v3.VListSubheader("Tetrahedral Meshes (mmg3d)")
                v3.VListItem(
                    title="Tetra Cube",
                    click="trigger('load_sample_mesh', ['tetra_cube'])",
                    prepend_icon="mdi-cube",
                )
                v3.VListItem(
                    title="Tetra Sphere",
                    click="trigger('load_sample_mesh', ['tetra_sphere'])",
                    prepend_icon="mdi-sphere",
                )
                v3.VDivider()
                v3.VListSubheader("2D Meshes (mmg2d)")
                v3.VListItem(
                    title="Disc",
                    click="trigger('load_sample_mesh', ['disc_2d'])",
                    prepend_icon="mdi-circle",
                )
                v3.VListItem(
                    title="Rectangle",
                    click="trigger('load_sample_mesh', ['rect_2d'])",
                    prepend_icon="mdi-rectangle",
                )

        v3.VDivider(vertical=True, classes="mx-2")

        v3.VBtn(
            icon="mdi-refresh",
            click="trigger('reset_mesh')",
            title="Reset mesh",
            variant="text",
            disabled=("!mesh_loaded",),
        )

        v3.VDivider(vertical=True, classes="mx-2")

        # Export menu
        with v3.VMenu():
            with v3.Template(v_slot_activator="{ props }"):
                v3.VBtn(
                    icon="mdi-download",
                    v_bind="props",
                    title="Export mesh",
                    variant="text",
                    disabled=("!mesh_loaded",),
                )
            with v3.VList(density="compact"):
                v3.VListItem(
                    title="VTK (.vtk)",
                    click="export_format = 'vtk'; trigger('export_mesh')",
                )
                v3.VListItem(
                    title="VTU (.vtu)",
                    click="export_format = 'vtu'; trigger('export_mesh')",
                )
                v3.VListItem(
                    title="STL (.stl)",
                    click="export_format = 'stl'; trigger('export_mesh')",
                )
                v3.VListItem(
                    title="OBJ (.obj)",
                    click="export_format = 'obj'; trigger('export_mesh')",
                )
                v3.VListItem(
                    title="PLY (.ply)",
                    click="export_format = 'ply'; trigger('export_mesh')",
                )
                v3.VListItem(
                    title="Medit (.mesh)",
                    click="export_format = 'mesh'; trigger('export_mesh')",
                )

    def _build_drawer(self) -> None:
        """Build drawer content - single panel layout."""
        with v3.VContainer(classes="pa-2"):
            self._build_remesh_panel()

    def _build_remesh_panel(self) -> None:
        """Build remeshing options panel."""
        # File upload
        v3.VFileInput(
            v_model=("file_upload",),
            label=("mesh_filename ? `Mesh: ${mesh_filename}` : 'Upload Mesh'",),
            accept=".vtk,.vtu,.vtp,.stl,.obj,.ply,.mesh,.msh",
            prepend_icon="mdi-upload",
            density="compact",
            variant="outlined",
            hide_details=True,
            clearable=True,
            classes="mb-2",
            title="Supported formats: VTK, VTU, VTP, STL, OBJ, PLY, Medit (.mesh), Gmsh (.msh)",
            click="file_upload = null",
        )

        # Solution file upload
        v3.VFileInput(
            v_model=("sol_file_upload",),
            label=(
                "sol_filename ? `Solution: ${sol_filename}` : 'Upload Solution (.sol)'",
            ),
            accept=".sol",
            prepend_icon="mdi-chart-line",
            density="compact",
            variant="outlined",
            hide_details=True,
            clearable=True,
            classes="mb-2",
            disabled=("!mesh_loaded",),
            title="Load solution file to visualize scalar/vector fields",
            click="sol_file_upload = null",
        )

        # Show detected solution type (two separate alerts for proper rendering)
        v3.VAlert(
            text="Solution detected as levelset (signed distance)",
            type="info",
            density="compact",
            variant="tonal",
            v_show="sol_filename && solution_type === 'levelset'",
            classes="mb-2",
        )
        v3.VAlert(
            text="Solution detected as metric (sizing field)",
            type="success",
            density="compact",
            variant="tonal",
            v_show="sol_filename && solution_type === 'metric'",
            classes="mb-2",
        )

        # Use solution as metric option (for standard remeshing)
        v3.VCheckbox(
            v_model=("use_solution_as_metric",),
            label="Use solution as metric (sizing field)",
            density="compact",
            hide_details=True,
            classes="mb-1",
            disabled=("!sol_filename || remesh_mode !== 'standard'",),
            title="Use loaded solution values to control local mesh size",
        )

        # Use solution as levelset option (for levelset mode)
        v3.VCheckbox(
            v_model=("use_solution_as_levelset",),
            label="Use solution as levelset (iso-surface at 0)",
            density="compact",
            hide_details=True,
            classes="mb-3",
            disabled=("!sol_filename || remesh_mode !== 'levelset'",),
            title="Use loaded solution as the levelset field for iso-surface extraction",
        )

        # Mode selection (Lagrangian not available for surface meshes)
        v3.VSelect(
            v_model=("remesh_mode",),
            label="Mode",
            items=("remesh_mode_items",),
            density="compact",
            variant="outlined",
            hide_details=True,
            classes="mb-3",
            title="Standard: global remesh | Levelset: iso-surface | Lagrangian: move vertices | Optimize: quality only",
        )

        # Preset buttons (values adapt to mesh scale) - disabled when Optimize is checked
        with v3.VBtnToggle(
            v_model=("use_preset",),
            density="compact",
            mandatory=True,
            divided=True,
            classes="mb-3",
            disabled=("selected_options.includes('optim')",),
        ):
            v3.VBtn(
                value="fine",
                text="Fine",
                size="small",
                title="2% of diagonal, high accuracy",
                click="trigger('apply_preset', ['fine'])",
            )
            v3.VBtn(
                value="medium",
                text="Medium",
                size="small",
                title="4% of diagonal, balanced",
                click="trigger('apply_preset', ['medium'])",
            )
            v3.VBtn(
                value="coarse",
                text="Coarse",
                size="small",
                title="10% of diagonal, fast",
                click="trigger('apply_preset', ['coarse'])",
            )
            v3.VBtn(
                value="custom",
                text="Custom",
                size="small",
                title="Custom parameters",
                click="trigger('apply_preset', ['custom'])",
            )

        # Size control - disabled when Optimize is checked (size params have no effect)
        with v3.VRow(dense=True):
            with v3.VCol(cols=6):
                v3.VTextField(
                    v_model=("hmax",),
                    label="hmax",
                    type="number",
                    min=0.001,
                    step=0.01,
                    density="compact",
                    variant="outlined",
                    hide_details=True,
                    title="Maximum edge length (must be > 0)",
                    change="trigger('set_custom_preset')",
                    disabled=("selected_options.includes('optim')",),
                )
            with v3.VCol(cols=6):
                v3.VTextField(
                    v_model=("hmin",),
                    label="hmin",
                    type="number",
                    min=0.001,
                    step=0.01,
                    density="compact",
                    variant="outlined",
                    hide_details=True,
                    clearable=True,
                    title="Minimum edge length (optional, must be > 0)",
                    change="trigger('set_custom_preset')",
                    disabled=("selected_options.includes('optim')",),
                )
        with v3.VRow(dense=True, classes="mb-2"):
            with v3.VCol(cols=6):
                v3.VTextField(
                    v_model=("hausd",),
                    label="hausd",
                    type="number",
                    min=0.0001,
                    step=0.001,
                    density="compact",
                    variant="outlined",
                    hide_details=True,
                    title="Hausdorff distance (must be > 0)",
                    change="trigger('set_custom_preset')",
                    disabled=("selected_options.includes('optim')",),
                )
            with v3.VCol(cols=6):
                v3.VTextField(
                    v_model=("hgrad",),
                    label="hgrad",
                    type="number",
                    min=1.01,
                    step=0.1,
                    density="compact",
                    variant="outlined",
                    hide_details=True,
                    title="Gradation (size ratio between neighbors)",
                    change="trigger('set_custom_preset')",
                    disabled=("selected_options.includes('optim')",),
                )
        with v3.VRow(dense=True, classes="mb-2"):
            with v3.VCol(cols=6):
                v3.VTextField(
                    v_model=("ar",),
                    label="ar",
                    type="number",
                    min=0,
                    max=180,
                    step=5,
                    density="compact",
                    variant="outlined",
                    hide_details=True,
                    title="Angle detection threshold (degrees). Sharp edges below this angle are preserved.",
                )

        # Optimization options (two rows of connected button toggles)
        html.Div("Options", classes="text-caption text-grey mb-1")
        with v3.VBtnToggle(
            v_model=("selected_options",),
            density="compact",
            multiple=True,
            divided=True,
            style="width: 100%;",
        ):
            v3.VBtn(
                value="optim",
                text="Optimize",
                size="small",
                style="flex: 1;",
                title="ONLY optimize quality, don't change mesh size",
            )
            v3.VBtn(
                value="noinsert",
                text="No Insert",
                size="small",
                style="flex: 1;",
                title="Disable vertex insertion (no refinement)",
            )
        with v3.VBtnToggle(
            v_model=("selected_options",),
            density="compact",
            multiple=True,
            divided=True,
            style="width: 100%;",
        ):
            v3.VBtn(
                value="noswap",
                text="No Swap",
                size="small",
                style="flex: 1;",
                title="Disable edge/face swapping",
            )
            v3.VBtn(
                value="nomove",
                text="No Move",
                size="small",
                style="flex: 1;",
                title="Keep vertices fixed",
            )
        # nosurf option - only for tetrahedral meshes
        with v3.VBtnToggle(
            v_model=("selected_options",),
            density="compact",
            multiple=True,
            divided=True,
            style="width: 100%;",
            v_show="mesh_kind === 'tetrahedral'",
        ):
            v3.VBtn(
                value="nosurf",
                text="No Surf",
                size="small",
                style="flex: 1;",
                title="Don't modify surface mesh (3D only)",
            )

        # Warning when all modification options are disabled
        v3.VAlert(
            text="Warning: No Insert + No Swap + No Move disables most improvements",
            type="warning",
            density="compact",
            variant="tonal",
            v_show="selected_options.includes('noinsert') && selected_options.includes('noswap') && selected_options.includes('nomove')",
            classes="mb-3",
        )

        # Levelset options (shown only for levelset mode, disabled when using solution)
        v3.VTextField(
            v_model=("levelset_formula",),
            label=(
                "use_solution_as_levelset ? "
                "'Using solution file as levelset' : 'Levelset Formula'",
            ),
            density="compact",
            variant="outlined",
            hide_details=True,
            classes="mb-3",
            v_show="remesh_mode === 'levelset'",
            disabled=("use_solution_as_levelset",),
            title="Python expression using x, y, z, np (iso-surface at 0)",
        )

        # Lagrangian options (shown only for lagrangian mode)
        v3.VSlider(
            v_model=("displacement_scale",),
            label="Displacement Scale",
            min=0.01,
            max=1.0,
            step=0.01,
            density="compact",
            hide_details=True,
            thumb_label=True,
            classes="mb-3",
            v_show="remesh_mode === 'lagrangian'",
            title="Scale factor for vertex displacement",
        )

        # Source mesh option
        html.Div("Remesh from", classes="text-caption text-grey mb-1")
        with v3.VBtnToggle(
            v_model=("remesh_source",),
            density="compact",
            mandatory=True,
            divided=True,
            classes="mb-3",
        ):
            v3.VBtn(
                value="original",
                text="Original",
                size="small",
                title="Remesh from original loaded mesh",
            )
            v3.VBtn(
                value="current",
                text="Current",
                size="small",
                title="Remesh from last result (iterative)",
            )

        # Run button
        v3.VBtn(
            "Run Remesh",
            click="trigger('run_remesh')",
            color="primary",
            block=True,
            disabled=("!mesh_loaded || is_remeshing",),
            loading=("is_remeshing",),
            prepend_icon="mdi-play",
            title="Execute remeshing",
        )

        # Result alert
        v3.VAlert(
            text="Remesh complete!",
            type="success",
            density="compact",
            variant="tonal",
            v_show="remesh_result && !remesh_result.error",
            classes="mt-3",
        )
        v3.VAlert(
            text=("`Error: ${remesh_result?.error}`",),
            type="error",
            density="compact",
            variant="tonal",
            v_show="remesh_result?.error",
            classes="mt-3",
        )

    def _build_content(self) -> None:
        """Build main content area with 3D viewer."""
        with v3.VContainer(fluid=True, classes="fill-height pa-0"):
            with v3.VRow(classes="fill-height ma-0"):
                # Main viewer column
                with v3.VCol(classes="fill-height pa-0", style="position: relative;"):
                    # Empty state
                    with (
                        v3.VCard(
                            classes="fill-height",
                            variant="flat",
                            v_show="!mesh_loaded",
                        ),
                        v3.VCardText(
                            classes=(
                                "fill-height d-flex flex-column "
                                "align-center justify-center"
                            ),
                        ),
                    ):
                        v3.VIcon(
                            icon="mdi-cube-outline",
                            size="128",
                            color="grey-lighten-1",
                        )
                        html.Span(
                            "Load a mesh to get started",
                            classes="text-h6 text-grey mt-4",
                        )
                        with v3.VRow(classes="mt-4"):
                            v3.VBtn(
                                "Load Sample",
                                click="trigger('load_sample_mesh', ['sphere'])",
                                color="primary",
                                variant="outlined",
                                prepend_icon="mdi-cube-outline",
                                classes="mx-2",
                            )

                    # Initialize plotter
                    if self._plotter is None:
                        self._plotter = pv.Plotter()
                        self._plotter.add_mesh(pv.Sphere(), opacity=0.0)
                        self._plotter.add_axes()  # Add orientation gizmo
                        self._render_window = self._plotter.ren_win

                    # 3D viewer
                    self._view = vtk_widgets.VtkRemoteView(
                        self._render_window,
                        v_show="mesh_loaded",
                        style="width: 100%; height: 100%;",
                        interactive_ratio=1,
                    )

                    self.ctrl.view_update = self._view.update
                    self.ctrl.view_reset_camera = self._view.reset_camera

                    # Top-right toolbar overlay
                    with v3.VCard(
                        classes="position-absolute",
                        style="top: 8px; right: 8px; z-index: 10;",
                        variant="elevated",
                        v_show="mesh_loaded",
                    ):
                        with v3.VToolbar(density="compact", color="surface"):
                            v3.VSelect(
                                v_model=("show_scalar",),
                                items=("scalar_field_options",),
                                density="compact",
                                variant="outlined",
                                hide_details=True,
                                style="min-width: 160px;",
                                title="Color by scalar field",
                            )
                            v3.VBtn(
                                icon=("show_edges ? 'mdi-grid' : 'mdi-grid-off'",),
                                click="show_edges = !show_edges",
                                title="Toggle edges",
                                variant="text",
                                classes="ml-1",
                            )
                            v3.VBtn(
                                icon=("smooth_shading ? 'mdi-blur' : 'mdi-blur-off'",),
                                click="smooth_shading = !smooth_shading",
                                title="Toggle smooth shading",
                                variant="text",
                            )
                            # Opacity menu
                            with v3.VMenu(close_on_content_click=False):
                                with v3.Template(v_slot_activator="{ props }"):
                                    v3.VBtn(
                                        icon="mdi-opacity",
                                        v_bind="props",
                                        title="Opacity",
                                        variant="text",
                                    )
                                with v3.VCard(classes="pa-2", style="width: 150px;"):
                                    v3.VSlider(
                                        v_model=("opacity",),
                                        min=0.1,
                                        max=1.0,
                                        step=0.1,
                                        density="compact",
                                        hide_details=True,
                                        thumb_label=True,
                                    )
                            # Slice control for tetrahedral meshes
                            with v3.VMenu(
                                v_show="mesh_kind === 'tetrahedral'",
                                close_on_content_click=False,
                            ):
                                with v3.Template(v_slot_activator="{ props }"):
                                    v3.VBtn(
                                        icon=(
                                            "slice_enabled ? 'mdi-box-cutter' : 'mdi-cube-scan'",
                                        ),
                                        v_bind="props",
                                        title="Slice view (see inside tetrahedra)",
                                        variant="text",
                                    )
                                with v3.VCard(classes="pa-3", style="width: 200px;"):
                                    v3.VSwitch(
                                        v_model=("slice_enabled",),
                                        label="Enable slice",
                                        density="compact",
                                        hide_details=True,
                                        classes="mb-2",
                                    )
                                    html.Span(
                                        "Axis",
                                        classes="text-caption text-grey mb-1",
                                    )
                                    with v3.VBtnToggle(
                                        v_model=("slice_axis",),
                                        density="compact",
                                        mandatory=True,
                                        divided=True,
                                        classes="mb-3",
                                        disabled=("!slice_enabled",),
                                    ):
                                        v3.VBtn(value=0, text="X", size="small")
                                        v3.VBtn(value=1, text="Y", size="small")
                                        v3.VBtn(value=2, text="Z", size="small")
                                    v3.VSlider(
                                        v_model=("slice_threshold",),
                                        label="Position",
                                        min=0.0,
                                        max=1.0,
                                        step=0.01,
                                        density="compact",
                                        hide_details=True,
                                        thumb_label=True,
                                        disabled=("!slice_enabled",),
                                    )
                            # View controls menu
                            with v3.VMenu(close_on_content_click=False):
                                with v3.Template(v_slot_activator="{ props }"):
                                    v3.VBtn(
                                        icon="mdi-video-3d",
                                        v_bind="props",
                                        title="Camera views",
                                        variant="text",
                                    )
                                with v3.VCard(
                                    classes="pa-3",
                                    style="min-width: 220px;",
                                ):
                                    html.Span(
                                        "View",
                                        classes="text-caption text-grey mb-1",
                                    )
                                    with v3.VBtnToggle(
                                        v_model=("current_view",),
                                        density="compact",
                                        mandatory=True,
                                        divided=True,
                                        classes="mb-2",
                                        style="width: 100%;",
                                    ):
                                        v3.VBtn(
                                            value="xy",
                                            text="+Z",
                                            size="small",
                                            title="Top (XY plane)",
                                            click="trigger('set_view', ['xy'])",
                                        )
                                        v3.VBtn(
                                            value="-xy",
                                            text="-Z",
                                            size="small",
                                            title="Bottom (XY plane)",
                                            click="trigger('set_view', ['-xy'])",
                                        )
                                        v3.VBtn(
                                            value="xz",
                                            text="+Y",
                                            size="small",
                                            title="Front (XZ plane)",
                                            click="trigger('set_view', ['xz'])",
                                        )
                                        v3.VBtn(
                                            value="-xz",
                                            text="-Y",
                                            size="small",
                                            title="Back (XZ plane)",
                                            click="trigger('set_view', ['-xz'])",
                                        )
                                    with v3.VBtnToggle(
                                        v_model=("current_view",),
                                        density="compact",
                                        mandatory=True,
                                        divided=True,
                                        classes="mb-3",
                                        style="width: 100%;",
                                    ):
                                        v3.VBtn(
                                            value="yz",
                                            text="+X",
                                            size="small",
                                            title="Right (YZ plane)",
                                            click="trigger('set_view', ['yz'])",
                                        )
                                        v3.VBtn(
                                            value="-yz",
                                            text="-X",
                                            size="small",
                                            title="Left (YZ plane)",
                                            click="trigger('set_view', ['-yz'])",
                                        )
                                        v3.VBtn(
                                            value="isometric",
                                            text="ISO",
                                            size="small",
                                            title="Isometric view",
                                            click="trigger('set_view', ['isometric'])",
                                        )
                                    v3.VDivider(classes="mb-3")
                                    v3.VSwitch(
                                        v_model=("parallel_projection",),
                                        label="Parallel projection",
                                        density="compact",
                                        hide_details=True,
                                        click="trigger('toggle_parallel_projection')",
                                    )
                            v3.VBtn(
                                icon="mdi-information-outline",
                                click="info_panel_open = !info_panel_open",
                                title="Toggle info panel",
                                variant="text",
                            )

                # Right info panel
                with v3.VCol(
                    cols="auto",
                    classes="fill-height pa-0",
                    v_show="mesh_loaded && info_panel_open",
                    style="max-width: 300px; min-width: 280px;",
                ):
                    self._build_info_panel()

    def _build_info_panel(self) -> None:
        """Build the right-side mesh info panel."""
        with v3.VCard(
            classes="fill-height overflow-auto",
            variant="flat",
            style="border-left: 1px solid rgba(0,0,0,0.12);",
        ):
            v3.VCardTitle("Mesh Info", classes="text-subtitle-1 py-2")
            with v3.VCardText(classes="pa-2"):
                # Geometry section
                with v3.VList(density="compact"):
                    v3.VListSubheader("Geometry")
                    v3.VListItem(
                        title="Type",
                        subtitle=(
                            "`${mesh_stats?.kind || '-'} (${mesh_stats?.mmg_module || '-'})`",
                        ),
                    )
                    v3.VListItem(
                        title="Vertices",
                        subtitle=(
                            "`${mesh_stats?.vertices?.toLocaleString() || '-'}`",
                        ),
                    )
                    v3.VListItem(
                        title="Elements",
                        subtitle=(
                            "`${mesh_stats?.elements?.toLocaleString() || '-'} "
                            "${mesh_stats?.element_type || ''}`",
                        ),
                    )

                v3.VDivider(classes="my-1")

                # Bounding Box section
                with v3.VList(density="compact"):
                    v3.VListSubheader("Bounding Box")
                    v3.VListItem(
                        title="Min",
                        subtitle=(
                            "`[${mesh_stats?.bounds?.min?.map(v => v.toFixed(3)).join(', ') || '-'}]`",
                        ),
                    )
                    v3.VListItem(
                        title="Max",
                        subtitle=(
                            "`[${mesh_stats?.bounds?.max?.map(v => v.toFixed(3)).join(', ') || '-'}]`",
                        ),
                    )
                    v3.VListItem(
                        title="Size",
                        subtitle=(
                            "`${mesh_stats?.size?.map(v => v.toFixed(3)).join(' × ') || '-'}`",
                        ),
                    )

                v3.VDivider(classes="my-1")

                # Quality section
                with v3.VList(density="compact"):
                    v3.VListSubheader("Element Quality (In-Radius Ratio)")
                    v3.VListItem(
                        title="Min / Max",
                        subtitle=(
                            "`${mesh_stats?.quality?.min?.toFixed(4) || '-'} / "
                            "${mesh_stats?.quality?.max?.toFixed(4) || '-'}`",
                        ),
                    )
                    v3.VListItem(
                        title="Mean ± Std",
                        subtitle=(
                            "`${mesh_stats?.quality?.mean?.toFixed(4) || '-'} ± "
                            "${mesh_stats?.quality?.std?.toFixed(4) || '-'}`",
                        ),
                    )

                # Remesh result section (shown after successful remeshing)
                with v3.VCard(
                    variant="tonal",
                    color="success",
                    classes="mt-3",
                    v_show="remesh_result && !remesh_result.error",
                ):
                    v3.VCardTitle("Remesh Result", classes="text-subtitle-2 py-2")
                    with v3.VCardText(classes="pa-2"):
                        with v3.VList(density="compact", bg_color="transparent"):
                            v3.VListItem(
                                title="Vertices",
                                subtitle=(
                                    "`${remesh_result?.vertices_before} → "
                                    "${remesh_result?.vertices_after}`",
                                ),
                            )
                            v3.VListItem(
                                title="Elements",
                                subtitle=(
                                    "`${remesh_result?.elements_before} → "
                                    "${remesh_result?.elements_after}`",
                                ),
                            )
                            v3.VListItem(
                                title="Quality (In-Radius Ratio)",
                                subtitle=(
                                    "`${remesh_result?.quality_before} → "
                                    "${remesh_result?.quality_after}`",
                                ),
                            )
                            v3.VListItem(
                                title="Duration",
                                subtitle=("`${remesh_result?.duration}`",),
                            )
