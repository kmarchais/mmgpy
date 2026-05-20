"""Python bindings for the MMG library."""

from __future__ import annotations

import importlib
from typing import TYPE_CHECKING, Any

from ._cli import _find_mmg_executable  # noqa: F401  # Used by tests
from ._logging import (
    configure_logging,
    disable_logging,
    enable_debug,
    get_log_file,
    get_logger,
    set_log_file,
    set_log_level,
)

# Version info
try:
    from . import _version  # type: ignore[attr-defined]

    __version__ = _version.__version__
except ImportError:
    __version__ = "unknown"

# Eagerly imported: numpy-only, no PyVista in their transitive closure. These
# stay available even in headless distributions that ship mmgpy without
# pyvista (e.g. the Blender add-on).
from . import lagrangian, metrics, progress, repair, sizing
from ._mmgpy import MMG_VERSION  # type: ignore[attr-defined]
from ._options import Mmg2DOptions, Mmg3DOptions, MmgSOptions
from ._progress import CancellationError, ProgressEvent, rich_progress
from ._remesh import SolPaths, mmg2d, mmg3d, mmgs  # noqa: F401
from ._result import RemeshResult
from ._transfer import interpolate_field, transfer_fields
from ._validation import (
    IssueSeverity,
    QualityStats,
    ValidationError,
    ValidationIssue,
    ValidationReport,
)
from .lagrangian import (
    detect_boundary_vertices,
    move_mesh,
    propagate_displacement,
    propagate_displacement_elasticity,
)
from .sizing import (
    BoxSize,
    CylinderSize,
    PointSize,
    SizingConstraint,
    SphereSize,
    apply_sizing_constraints,
)

if TYPE_CHECKING:
    # Surface PyVista-coupled names to type checkers without importing pyvista
    # at runtime. Real loading happens on first attribute access via the
    # __getattr__ below.
    from . import interactive
    from ._io import read
    from ._mesh import MeshKind
    from ._pyvista import from_pyvista, polydata_from_2d_triangles, to_pyvista
    from ._reorder import reorder_cuthill_mckee

# Maps lazy attribute name -> (module path, attribute on module or None for the
# module itself). The Blender subset omits these modules entirely; attempting
# to access them there will raise ImportError, which is the desired behaviour.
_LAZY_IMPORTS: dict[str, tuple[str, str | None]] = {
    "interactive": ("mmgpy.interactive", None),
    "read": ("mmgpy._io", "read"),
    "MeshKind": ("mmgpy._mesh", "MeshKind"),
    "from_pyvista": ("mmgpy._pyvista", "from_pyvista"),
    "polydata_from_2d_triangles": ("mmgpy._pyvista", "polydata_from_2d_triangles"),
    "to_pyvista": ("mmgpy._pyvista", "to_pyvista"),
    "reorder_cuthill_mckee": ("mmgpy._reorder", "reorder_cuthill_mckee"),
}


def __getattr__(name: str) -> Any:  # noqa: ANN401  -- value is a module or attribute
    target = _LAZY_IMPORTS.get(name)
    if target is None:
        msg = f"module 'mmgpy' has no attribute {name!r}"
        raise AttributeError(msg)
    module_name, attr_name = target
    module = importlib.import_module(module_name)
    value = module if attr_name is None else getattr(module, attr_name)
    globals()[name] = value
    return value


__all__ = [
    "MMG_VERSION",
    "BoxSize",
    "CancellationError",
    "CylinderSize",
    "IssueSeverity",
    "MeshKind",
    "Mmg2DOptions",
    "Mmg3DOptions",
    "MmgSOptions",
    "PointSize",
    "ProgressEvent",
    "QualityStats",
    "RemeshResult",
    "SizingConstraint",
    "SphereSize",
    "ValidationError",
    "ValidationIssue",
    "ValidationReport",
    "__version__",
    "apply_sizing_constraints",
    "configure_logging",
    "detect_boundary_vertices",
    "disable_logging",
    "enable_debug",
    "from_pyvista",
    "get_log_file",
    "get_logger",
    "interactive",
    "interpolate_field",
    "lagrangian",
    "metrics",
    "move_mesh",
    "polydata_from_2d_triangles",
    "progress",
    "propagate_displacement",
    "propagate_displacement_elasticity",
    "read",
    "reorder_cuthill_mckee",
    "repair",
    "rich_progress",
    "set_log_file",
    "set_log_level",
    "sizing",
    "to_pyvista",
    "transfer_fields",
]
