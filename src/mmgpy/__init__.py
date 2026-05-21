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

# Eagerly imported: numpy-only (no pyvista, no scipy in their transitive
# closure). These stay available even in slim distributions that ship mmgpy
# without those heavy deps (e.g. the Blender add-on).
from . import progress, sizing
from ._mmgpy import (  # type: ignore[attr-defined]
    MMG_VERSION,
    MmgMesh2D,
    MmgMesh3D,
    MmgMeshS,
)
from ._options import Mmg2DOptions, Mmg3DOptions, MmgSOptions
from ._progress import CancellationError, ProgressEvent, rich_progress
from ._remesh import SolPaths, mmg2d, mmg3d, mmgs  # noqa: F401
from ._result import RemeshResult
from .sizing import (
    BoxSize,
    CylinderSize,
    PointSize,
    SizingConstraint,
    SphereSize,
    apply_sizing_constraints,
)

if TYPE_CHECKING:
    # Surface pyvista- and scipy-coupled names to type checkers without
    # importing the heavy deps at runtime. Real loading happens on first
    # attribute access via the __getattr__ below.
    from . import interactive, lagrangian, metrics, repair
    from ._io import read
    from ._mesh import MeshKind
    from ._pyvista import from_pyvista, polydata_from_2d_triangles, to_pyvista
    from ._reorder import reorder_cuthill_mckee
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

# Maps lazy attribute name -> (relative module path, attribute on module or
# None for the module itself). Slim distributions can omit these modules
# entirely; attempting to access them there raises ImportError, which is the
# desired behaviour. Relative paths keep this working under vendoring.
_LAZY_IMPORTS: dict[str, tuple[str, str | None]] = {
    # PyVista-coupled
    "interactive": (".interactive", None),
    "read": ("._io", "read"),
    "MeshKind": ("._mesh", "MeshKind"),
    "from_pyvista": ("._pyvista", "from_pyvista"),
    "polydata_from_2d_triangles": ("._pyvista", "polydata_from_2d_triangles"),
    "to_pyvista": ("._pyvista", "to_pyvista"),
    "reorder_cuthill_mckee": ("._reorder", "reorder_cuthill_mckee"),
    # scipy-coupled
    "lagrangian": (".lagrangian", None),
    "metrics": (".metrics", None),
    "repair": (".repair", None),
    "detect_boundary_vertices": (".lagrangian", "detect_boundary_vertices"),
    "move_mesh": (".lagrangian", "move_mesh"),
    "propagate_displacement": (".lagrangian", "propagate_displacement"),
    "propagate_displacement_elasticity": (
        ".lagrangian",
        "propagate_displacement_elasticity",
    ),
    "interpolate_field": ("._transfer", "interpolate_field"),
    "transfer_fields": ("._transfer", "transfer_fields"),
    "IssueSeverity": ("._validation", "IssueSeverity"),
    "QualityStats": ("._validation", "QualityStats"),
    "ValidationError": ("._validation", "ValidationError"),
    "ValidationIssue": ("._validation", "ValidationIssue"),
    "ValidationReport": ("._validation", "ValidationReport"),
}


def __getattr__(name: str) -> Any:  # noqa: ANN401  -- value is a module or attribute
    target = _LAZY_IMPORTS.get(name)
    if target is None:
        msg = f"module {__name__!r} has no attribute {name!r}"
        raise AttributeError(msg)
    module_name, attr_name = target
    module = importlib.import_module(module_name, package=__name__)
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
    "MmgMesh2D",
    "MmgMesh3D",
    "MmgMeshS",
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
