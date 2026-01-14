"""Remeshing mixin for mmgpy UI - handles remeshing operations."""

from __future__ import annotations

import logging
from typing import TYPE_CHECKING

import numpy as np

from mmgpy.ui.parsers import evaluate_levelset_formula
from mmgpy.ui.utils import (
    compute_preset_values,
    get_mesh_diagonal,
    reset_solution_state,
    to_float,
)

if TYPE_CHECKING:
    from mmgpy import Mesh

logger = logging.getLogger(__name__)

# Random number generator for reproducible displacement fields
# Using fixed seed for deterministic Lagrangian motion demo
_rng = np.random.default_rng(42)


class RemeshingMixin:
    """Mixin class providing remeshing functionality.

    This mixin provides methods for:
    - Executing remeshing operations (standard, levelset, lagrangian, optimize)
    - Building remesh options from UI state
    - Transferring solution fields between meshes
    - Managing sizing constraints
    - Applying presets
    """

    # These attributes are expected to be defined by the main class
    _mesh: Mesh | None
    _original_mesh: Mesh | None
    _solution_metric: np.ndarray | None
    _solution_fields: dict[str, dict]
    _original_solution_metric: np.ndarray | None
    _original_solution_fields: dict[str, dict]
    _applying_preset: bool
    state: object

    # These methods are expected to be defined by other mixins or the main class
    def _update_mesh_info(self) -> None: ...
    def _update_viewer(self, *, reset_camera: bool = True) -> None: ...
    def _update_scalar_field_options(self) -> None: ...

    def _apply_adaptive_defaults(self) -> None:
        """Set default remeshing parameters based on mesh scale.

        Uses the 'medium' preset values to initialize parameters.
        """
        diagonal = get_mesh_diagonal(self._mesh)
        values = compute_preset_values("medium", diagonal)

        self._applying_preset = True
        try:
            self.state.hmax = values.get("hmax")
            self.state.hausd = values.get("hausd")
            self.state.hgrad = values.get("hgrad", 1.3)
            self.state.hmin = None
            self.state.use_preset = "medium"
        finally:
            self._applying_preset = False
        self.state.flush()

    def _apply_preset_trigger(self, preset: str) -> None:
        """Trigger handler for preset buttons."""
        self.state.use_preset = preset
        self._apply_preset(preset)

    def _apply_preset(self, preset: str) -> None:
        """Apply a remeshing preset scaled to mesh size."""
        if preset == "custom":
            return

        diagonal = get_mesh_diagonal(self._mesh)
        values = compute_preset_values(preset, diagonal)

        if values:
            self._applying_preset = True
            try:
                for key, value in values.items():
                    setattr(self.state, key, value)
            finally:
                self._applying_preset = False
            self.state.flush()

    def _run_remesh(self) -> None:
        """Execute remeshing operation."""
        from mmgpy import Mesh

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

            # Store old mesh info for field transfer
            old_vertices = source_mesh.get_vertices()
            kind = source_mesh.kind.value
            if kind == "tetrahedral":
                old_elements = source_mesh.get_tetrahedra()
            else:
                old_elements = source_mesh.get_triangles()

            # For tetrahedral meshes, preserve boundary triangle refs
            # (they're stored separately in MMG and lost during PyVista round-trip)
            boundary_triangles = None
            boundary_refs = None
            if kind == "tetrahedral":
                try:
                    boundary_triangles, boundary_refs = (
                        source_mesh.get_triangles_with_refs()
                    )
                except Exception:
                    pass

            # Create a fresh Mesh object
            pv_mesh = source_mesh.to_pyvista()
            self._mesh = Mesh(pv_mesh)

            # Restore boundary triangle refs for tetrahedral meshes
            # Need to resize mesh to include triangles before setting them
            if boundary_triangles is not None and boundary_refs is not None:
                try:
                    # Access internal implementation to resize mesh
                    impl = self._mesh._impl  # noqa: SLF001
                    vertices = self._mesh.get_vertices()
                    tetrahedra = self._mesh.get_tetrahedra()
                    impl.set_mesh_size(
                        vertices=len(vertices),
                        tetrahedra=len(tetrahedra),
                        triangles=len(boundary_triangles),
                    )
                    # Re-set vertices and tetrahedra after resize
                    _, vert_refs = impl.get_vertices_with_refs()
                    _, tet_refs = impl.get_tetrahedra_with_refs()
                    impl.set_vertices(vertices, vert_refs)
                    impl.set_tetrahedra(tetrahedra, tet_refs)
                    impl.set_triangles(boundary_triangles, boundary_refs)
                except Exception:
                    logger.debug("Could not restore boundary triangle refs")

            # Apply solution as metric if enabled
            if self.state.use_solution_as_metric and source_solution_metric is not None:
                n_vertices = len(self._mesh.get_vertices())
                if len(source_solution_metric) == n_vertices:
                    metric = source_solution_metric
                    if metric.ndim == 1:
                        metric = metric.reshape(-1, 1)
                    self._mesh.set_field("metric", metric.astype(np.float64))

            options = self._build_remesh_options()
            result = self._execute_remesh(source_solution_metric, options)

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

            # Transfer solution fields
            self._transfer_solution_fields(
                source_solution_fields,
                old_vertices,
                old_elements,
            )

            self._update_mesh_info()
            self._update_viewer(reset_camera=False)

        except Exception as e:
            logger.exception("Remeshing failed")
            self.state.remesh_result = {"error": str(e)}
        finally:
            self.state.is_remeshing = False
            self.state.flush()

    def _build_remesh_options(self) -> dict:
        """Build options dictionary for remeshing."""
        options = {}

        hmin = to_float(self.state.hmin)
        hmax = to_float(self.state.hmax)
        hsiz = to_float(self.state.hsiz)
        hausd = to_float(self.state.hausd)
        hgrad = to_float(self.state.hgrad)
        ar = to_float(self.state.ar)

        # Validate parameters
        if hmin is not None and hmin <= 0:
            msg = "hmin must be > 0"
            raise ValueError(msg)
        if hmax is not None and hmax <= 0:
            msg = "hmax must be > 0"
            raise ValueError(msg)
        if hsiz is not None and hsiz <= 0:
            msg = "hsiz must be > 0"
            raise ValueError(msg)
        if hausd is not None and hausd <= 0:
            msg = "hausd must be > 0"
            raise ValueError(msg)
        if hgrad is not None and hgrad <= 1.0:
            msg = "hgrad must be > 1.0"
            raise ValueError(msg)
        if hmin is not None and hmax is not None and hmin > hmax:
            msg = "hmin must be <= hmax"
            raise ValueError(msg)

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

        # Memory limit
        mem = to_float(self.state.mem)
        if mem is not None:
            if mem <= 0:
                msg = "mem must be > 0"
                raise ValueError(msg)
            options["mem"] = int(mem)

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
        if "nreg" in selected:
            options["nreg"] = 1
        if "opnbdy" in selected and self.state.mesh_kind == "tetrahedral":
            options["opnbdy"] = 1

        return options

    def _execute_remesh(self, source_solution_metric, options: dict):
        """Execute the appropriate remesh operation."""
        mode = self.state.remesh_mode

        if mode == "standard":
            return self._mesh.remesh(progress=False, **options)

        if mode == "levelset":
            if (
                self.state.use_solution_as_levelset
                and source_solution_metric is not None
            ):
                levelset = source_solution_metric
                if levelset.ndim == 1:
                    levelset = levelset.reshape(-1, 1)
            else:
                levelset = self._compute_levelset()
            # Add levelset isovalue (ls) parameter
            ls_value = to_float(self.state.levelset_isovalue)
            if ls_value is not None:
                options["ls"] = ls_value
            return self._mesh.remesh_levelset(levelset, progress=False, **options)

        if mode == "lagrangian":
            displacement = self._compute_displacement()
            return self._mesh.remesh_lagrangian(
                displacement,
                progress=False,
                **options,
            )

        # Fallback to standard remesh
        return self._mesh.remesh(progress=False, **options)

    def _transfer_solution_fields(
        self,
        source_solution_fields: dict,
        old_vertices: np.ndarray,
        old_elements: np.ndarray,
    ) -> None:
        """Transfer solution fields to new mesh."""
        if not source_solution_fields:
            return

        from mmgpy._transfer import transfer_fields

        new_vertices = self._mesh.get_vertices()
        vertex_fields = {
            name: info["data"]
            for name, info in source_solution_fields.items()
            if info["location"] == "vertices"
        }

        if not vertex_fields:
            return

        try:
            transferred = transfer_fields(
                source_vertices=old_vertices,
                source_elements=old_elements,
                target_points=new_vertices,
                fields=vertex_fields,
            )
            for name, new_data in transferred.items():
                if name in self._solution_fields:
                    self._solution_fields[name]["data"] = new_data
                else:
                    loc = source_solution_fields[name]["location"]
                    self._solution_fields[name] = {
                        "data": new_data,
                        "location": loc,
                    }
            first_field = next(iter(vertex_fields.keys()))
            self._solution_metric = transferred[first_field].copy()
            self._update_scalar_field_options()
        except Exception:
            logger.warning(
                "Failed to transfer solution fields, clearing solution state",
            )
            for key, value in reset_solution_state().items():
                setattr(self.state, key, value)
            self._solution_fields = {}
            self._solution_metric = None
            if self.state.show_scalar.startswith("user_"):
                self.state.show_scalar = "quality"
            self._update_scalar_field_options()

    def _compute_levelset(self) -> np.ndarray:
        """Compute levelset field from formula using safe evaluation."""
        vertices = self._mesh.get_vertices()
        x, y, z = vertices[:, 0], vertices[:, 1], vertices[:, 2]

        formula = self.state.levelset_formula
        return evaluate_levelset_formula(formula, x, y, z)

    def _compute_displacement(self) -> np.ndarray:
        """Compute displacement field."""
        vertices = self._mesh.get_vertices()
        n_verts = len(vertices)
        dim = vertices.shape[1]

        scale = float(self.state.displacement_scale)
        displacement = _rng.standard_normal((n_verts, dim)) * scale

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

        self._update_viewer()

    def _clear_sizing_constraints(self) -> None:
        """Clear all sizing constraints."""
        if self._mesh is not None:
            self._mesh.clear_local_sizing()
        self.state.sizing_constraints = []
        self._update_viewer()
