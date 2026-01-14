"""Utility functions for the mmgpy UI."""

from __future__ import annotations

import logging
from math import floor, log10
from typing import TYPE_CHECKING, Any

import numpy as np

if TYPE_CHECKING:
    from mmgpy import Mesh

logger = logging.getLogger(__name__)


def round_to_significant(x: float, sig: int = 2) -> float:
    """Round a number to a specified number of significant figures.

    Parameters
    ----------
    x : float
        The number to round.
    sig : int, default=2
        Number of significant figures.

    Returns
    -------
    float
        The rounded number.

    Examples
    --------
    >>> round_to_significant(0.0123456, 2)
    0.012
    >>> round_to_significant(1234.5678, 3)
    1230.0
    >>> round_to_significant(0.0, 2)
    0.0

    """
    if x == 0:
        return 0.0
    return round(x, -int(floor(log10(abs(x)))) + (sig - 1))


def get_mesh_diagonal(mesh: Mesh | None) -> float:
    """Get the diagonal length of the mesh bounding box.

    Parameters
    ----------
    mesh : Mesh | None
        The mesh to measure.

    Returns
    -------
    float
        The diagonal length, or 1.0 if mesh is None.

    Examples
    --------
    >>> get_mesh_diagonal(None)
    1.0

    """
    if mesh is None:
        return 1.0
    bounds = mesh.get_bounds()
    size = bounds[1] - bounds[0]
    return float(np.linalg.norm(size))


def to_float(val: Any) -> float | None:
    """Safely convert a value to float.

    Handles None, empty string, and other edge cases.

    Parameters
    ----------
    val : Any
        The value to convert.

    Returns
    -------
    float | None
        The converted float, or None if conversion not possible.

    Examples
    --------
    >>> to_float(3.14)
    3.14
    >>> to_float("2.5")
    2.5
    >>> to_float(None) is None
    True
    >>> to_float("") is None
    True

    """
    if val is None or val == "":
        return None
    try:
        return float(val)
    except (ValueError, TypeError):
        return None


# Default state values for the UI
DEFAULT_STATE: dict[str, Any] = {
    # UI state
    "drawer_open": True,
    "active_tab": "remesh",
    # Mesh state
    "mesh_loaded": False,
    "mesh_info": "",
    "mesh_kind": "",
    "mesh_stats": None,
    "info_panel_open": True,
    # Remeshing parameters (None = use MMG defaults)
    "hmin": None,
    "hmax": None,
    "hsiz": None,
    "hausd": None,
    "hgrad": None,
    "ar": None,
    "verbose": 1,
    # Advanced parameters
    "mem": None,
    "nreg": False,
    # Options
    "selected_options": [],
    "nosurf": False,
    "use_preset": "default",
    "remesh_mode": "standard",
    "remesh_source": "original",
    # Levelset/Lagrangian
    "levelset_formula": "x**2 + y**2 + z**2 - 0.25",
    "levelset_isovalue": 0.0,
    "displacement_scale": 0.1,
    "use_solution_as_metric": False,
    "use_solution_as_levelset": False,
    "solution_type": "",
    # Sizing
    "sizing_mode": "sphere",
    "sizing_constraints": [],
    # Results
    "validation_report": None,
    "remesh_result": None,
    "is_remeshing": False,
    # Viewer settings
    "show_edges": True,
    "show_scalar": "none",
    "show_original_mesh": False,
    "has_original_mesh": False,
    "color_map": "RdYlBu",
    "opacity": 1.0,
    "smooth_shading": False,
    # Slice view
    "slice_enabled": False,
    "slice_axis": 0,
    "slice_threshold": 0.5,
    # File state
    "file_upload": None,
    "sol_file_upload": None,
    "mesh_filename": "",
    "sol_filename": "",
    "solution_fields": {},
    "export_format": "vtk",
    # Camera
    "current_view": "isometric",
    "parallel_projection": False,
    # Theme
    "theme_name": "light",  # "light" or "dark" - system preference detected on load
}

# Default scalar field options
DEFAULT_SCALAR_FIELD_OPTIONS: list[dict[str, str]] = [
    {"title": "No Color", "value": "none"},
    {"type": "subheader", "title": "-- Quality --"},
    {"title": "In-Radius Ratio", "value": "quality"},
    {"title": "Scaled Jacobian", "value": "pv_quality"},
    {"type": "subheader", "title": "-- Sizing --"},
    {"title": "Edge Length", "value": "edge_length"},
    {"type": "subheader", "title": "-- Orientation --"},
    {"title": "Face Orientation", "value": "face_sides"},
    {"type": "subheader", "title": "-- Other --"},
    {"title": "Area/Volume", "value": "area_volume"},
    {"title": "Refs", "value": "refs"},
]

# Default remesh mode items (Optimize Only is handled by the toggle button)
DEFAULT_REMESH_MODE_ITEMS: list[dict[str, str]] = [
    {"title": "Standard Remesh", "value": "standard"},
    {"title": "Levelset Discretization", "value": "levelset"},
    {"title": "Lagrangian Motion", "value": "lagrangian"},
]

# Preset ratios for adaptive defaults
PRESET_RATIOS: dict[str, dict[str, float | bool | None]] = {
    "default": {"clear_all": True},  # Let MMG use its internal defaults
    "fine": {"hmax_ratio": 1 / 50, "hausd_ratio": 1 / 1000, "hgrad": 1.2},
    "medium": {"hmax_ratio": 1 / 25, "hausd_ratio": 1 / 500, "hgrad": 1.3},
    "coarse": {"hmax_ratio": 1 / 10, "hausd_ratio": 1 / 200, "hgrad": 1.5},
    "optimize": {"optim": True, "noinsert": True},  # Optimize only, no size change
}


def compute_preset_values(preset: str, diagonal: float) -> dict[str, Any]:
    """Compute parameter values for a preset based on mesh diagonal.

    Parameters
    ----------
    preset : str
        Preset name: "default", "fine", "medium", "coarse".
    diagonal : float
        The mesh bounding box diagonal length.

    Returns
    -------
    dict[str, Any]
        Parameter values for the preset.

    Examples
    --------
    >>> values = compute_preset_values("medium", 10.0)
    >>> "hmax" in values
    True
    >>> values["hgrad"]
    1.3

    """
    if preset not in PRESET_RATIOS:
        return {}

    ratios = PRESET_RATIOS[preset]
    values: dict[str, Any] = {}

    # Default preset: clear all size parameters to let MMG use its defaults
    if ratios.get("clear_all"):
        values["hsiz"] = None
        values["hmin"] = None
        values["hmax"] = None
        values["hausd"] = None
        values["hgrad"] = None
        values["ar"] = None
        return values

    # Optimize preset: set optimization flags
    if ratios.get("optim"):
        values["optim"] = True
        if ratios.get("noinsert"):
            values["noinsert"] = True
        return values

    if "hmax_ratio" in ratios:
        values["hmax"] = round_to_significant(diagonal * ratios["hmax_ratio"])
    if "hausd_ratio" in ratios:
        values["hausd"] = round_to_significant(diagonal * ratios["hausd_ratio"])
    if "hgrad" in ratios:
        values["hgrad"] = ratios["hgrad"]

    return values


def reset_solution_state() -> dict[str, Any]:
    """Get state values for resetting solution-related state.

    Returns
    -------
    dict[str, Any]
        State values to reset solution state.

    """
    return {
        "sol_filename": "",
        "solution_fields": {},
        "use_solution_as_metric": False,
        "use_solution_as_levelset": False,
        "solution_type": "",
    }
