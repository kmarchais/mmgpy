"""Main trame application for mmgpy."""

from __future__ import annotations

import base64
import logging
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

from mmgpy.ui.parsers import parse_sol_file
from mmgpy.ui.remeshing import RemeshingMixin
from mmgpy.ui.samples import get_sample_mesh
from mmgpy.ui.utils import (
    DEFAULT_REMESH_MODE_ITEMS,
    DEFAULT_SCALAR_FIELD_OPTIONS,
    DEFAULT_STATE,
    reset_solution_state,
)
from mmgpy.ui.viewer import ViewerMixin

if TYPE_CHECKING:
    from mmgpy import Mesh

logger = logging.getLogger(__name__)

pv.OFF_SCREEN = True


class MmgpyApp(ViewerMixin, RemeshingMixin):
    """Main mmgpy web application.

    Inherits visualization functionality from ViewerMixin and
    remeshing functionality from RemeshingMixin.
    """

    def __init__(
        self,
        server: str | None = None,
        mesh: Mesh | None = None,
        debug: bool = False,
    ) -> None:
        """Initialize the application.

        Parameters
        ----------
        server : str | None
            Server name for trame. If None, creates a new server.
        mesh : Mesh | None
            Pre-loaded mesh to display.
        debug : bool
            Enable debug mode with HTML structure printing.

        """
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
        # Apply default state values
        for key, value in DEFAULT_STATE.items():
            self.state.setdefault(key, value)

        # Set complex defaults that need special handling
        self.state.setdefault("scalar_field_options", DEFAULT_SCALAR_FIELD_OPTIONS)
        self.state.setdefault("remesh_mode_items", DEFAULT_REMESH_MODE_ITEMS)

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
            self._original_mesh = Mesh(tmp_path)
            self._update_mesh_state_after_load(client_file.name)
        except Exception:
            logger.exception("Error loading mesh file: %s", client_file.name)
            self.state.mesh_info = "Error loading mesh. Check file format."
        finally:
            self.state.file_upload = None
            self.state.flush()
            Path(tmp_path).unlink(missing_ok=True)

    def _update_mesh_state_after_load(self, filename: str) -> None:
        """Update state after loading a mesh."""
        self._update_mesh_info()
        self._apply_adaptive_defaults()
        self._update_viewer()
        self.state.mesh_loaded = True
        self.state.mesh_filename = filename
        self.state.remesh_result = None

        # Reset solution state
        for key, value in reset_solution_state().items():
            setattr(self.state, key, value)
        self._solution_metric = None
        self._solution_fields = {}
        self._original_solution_metric = None
        self._original_solution_fields = {}

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

            self._process_valid_solution_fields(valid_fields, client_file.name)

        except Exception:
            logger.exception("Error loading solution file: %s", client_file.name)
            self.state.remesh_result = {"error": "Error loading solution file"}
        finally:
            self.state.sol_file_upload = None

    def _process_valid_solution_fields(
        self,
        valid_fields: dict,
        filename: str,
    ) -> None:
        """Process and store valid solution fields."""
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

                if has_negative or has_zero_or_negative:
                    # Signed distance field or ambiguous -> use as levelset
                    self.state.solution_type = "levelset"
                    self.state.use_solution_as_levelset = True
                    self.state.use_solution_as_metric = False
                    self.state.remesh_mode = "levelset"
                else:
                    # All positive -> use as metric (sizing field)
                    self.state.solution_type = "metric"
                    self.state.use_solution_as_metric = True
                    self.state.use_solution_as_levelset = False

        self._update_viewer(reset_camera=False)
        self.state.sol_filename = filename

    def _update_scalar_field_options(self) -> None:
        """Update scalar field dropdown options based on available fields."""
        base_options = list(DEFAULT_SCALAR_FIELD_OPTIONS)

        if self._solution_fields:
            base_options.append({"type": "subheader", "title": "-- Solution --"})
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

        pv_mesh = get_sample_mesh(sample_name)
        if pv_mesh is None:
            logger.warning("Unknown sample mesh: %s", sample_name)
            return

        self._mesh = Mesh(pv_mesh)
        self._original_mesh = Mesh(pv_mesh)
        self._update_mesh_state_after_load(f"sample:{sample_name}")

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
        quality_stats = None
        try:
            qualities = self._mesh.get_element_qualities()
            quality_stats = {
                "min": float(np.min(qualities)),
                "max": float(np.max(qualities)),
                "mean": float(np.mean(qualities)),
                "std": float(np.std(qualities)),
            }
        except Exception:
            logger.debug("Could not compute quality statistics")

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

    def _export_mesh(self) -> None:
        """Export mesh to file and trigger download."""
        if self._mesh is None:
            return

        export_format = self.state.export_format
        filename = self.state.mesh_filename.split(":")[
            -1
        ]  # Remove "sample:" prefix if present
        if not filename:
            filename = "mesh"

        # Remove existing extension and add new one
        base_name = Path(filename).stem
        new_filename = f"{base_name}.{export_format}"

        try:
            # Export to temporary file
            with tempfile.NamedTemporaryFile(
                suffix=f".{export_format}",
                delete=False,
            ) as tmp:
                tmp_path = tmp.name

            pv_mesh = self._mesh.to_pyvista()
            pv_mesh.save(tmp_path)

            # Read file and encode as base64 for download
            with Path(tmp_path).open("rb") as f:
                content = f.read()

            # Trigger download via JavaScript
            b64_content = base64.b64encode(content).decode("utf-8")

            # Determine MIME type
            mime_types = {
                "vtk": "application/octet-stream",
                "vtu": "application/octet-stream",
                "stl": "model/stl",
                "obj": "model/obj",
                "ply": "application/x-ply",
                "mesh": "application/octet-stream",
            }
            mime_type = mime_types.get(export_format, "application/octet-stream")

            # Execute JavaScript to trigger download
            self.server.js_call(
                "utils",
                "download",
                new_filename,
                f"data:{mime_type};base64,{b64_content}",
            )

            logger.info("Exported mesh to %s", new_filename)

        except Exception:
            logger.exception("Failed to export mesh")
            self.state.remesh_result = {"error": "Failed to export mesh"}
        finally:
            if "tmp_path" in locals():
                Path(tmp_path).unlink(missing_ok=True)

    def _reset_mesh(self) -> None:
        """Reset to original mesh state."""
        self._mesh = None
        self._original_mesh = None
        self._solution_metric = None
        self._solution_fields = {}
        self._original_solution_metric = None
        self._original_solution_fields = {}

        self.state.mesh_loaded = False
        self.state.mesh_info = ""
        self.state.mesh_kind = ""
        self.state.mesh_filename = ""
        self.state.mesh_stats = None
        self.state.validation_report = None
        self.state.remesh_result = None
        self.state.scalar_field_options = list(DEFAULT_SCALAR_FIELD_OPTIONS)

        for key, value in reset_solution_state().items():
            setattr(self.state, key, value)

        # Clear plotter contents but keep it alive to avoid invalidating _view widget
        if self._plotter is not None:
            self._plotter.clear()
            # Render the cleared state
            if self._render_window is not None:
                self._render_window.Render()
            if hasattr(self, "_view") and self._view is not None:
                self._view.update()
        self.state.flush()

    def _build_ui(self):
        """Build the trame UI."""
        with SinglePageWithDrawerLayout(self.server, full_height=True) as layout:
            layout.title.set_text("mmgpy")
            layout.icon.click = "drawer_open = !drawer_open"

            # Add JavaScript utility for file download
            html.Script(
                """
                window.utils = {
                    download: function(filename, dataUrl) {
                        const link = document.createElement('a');
                        link.href = dataUrl;
                        link.download = filename;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }
                };
                """,
            )

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

        # Show detected solution type
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

        # Use solution as metric option
        v3.VCheckbox(
            v_model=("use_solution_as_metric",),
            label="Use solution as metric (sizing field)",
            density="compact",
            hide_details=True,
            classes="mb-1",
            disabled=("!sol_filename || remesh_mode !== 'standard'",),
            title="Use loaded solution values to control local mesh size",
        )

        # Use solution as levelset option
        v3.VCheckbox(
            v_model=("use_solution_as_levelset",),
            label="Use solution as levelset (iso-surface at 0)",
            density="compact",
            hide_details=True,
            classes="mb-3",
            disabled=("!sol_filename || remesh_mode !== 'levelset'",),
            title="Use loaded solution as the levelset field for iso-surface extraction",
        )

        # Mode selection
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

        # Preset buttons
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

        # Size control
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

        # Optimization options
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

        # Warning when all options disabled
        v3.VAlert(
            text="Warning: No Insert + No Swap + No Move disables most improvements",
            type="warning",
            density="compact",
            variant="tonal",
            v_show="selected_options.includes('noinsert') && selected_options.includes('noswap') && selected_options.includes('nomove')",
            classes="mb-3",
        )

        # Levelset options
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

        # Lagrangian options
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

        # Result alerts
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
                        self._plotter.add_axes()
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
                    self._build_viewer_toolbar()

                # Right info panel
                with v3.VCol(
                    cols="auto",
                    classes="fill-height pa-0",
                    v_show="mesh_loaded && info_panel_open",
                    style="max-width: 300px; min-width: 280px;",
                ):
                    self._build_info_panel()

    def _build_viewer_toolbar(self) -> None:
        """Build the viewer toolbar overlay."""
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

                # Remesh result section
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
