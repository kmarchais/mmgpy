"""Python bindings for the MMG library."""

from __future__ import annotations

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

_logger = get_logger()

# Version info
try:
    from . import _version  # type: ignore[attr-defined]

    __version__ = _version.__version__
except ImportError:
    __version__ = "unknown"

# Core C++ bindings
from . import interactive, lagrangian, metrics, progress, repair, sizing
from ._io import read
from ._mesh import Mesh, MeshCheckpoint, MeshKind
from ._mmgpy import (  # type: ignore[attr-defined]
    MMG_VERSION,
    mmg2d,  # noqa: F401  # Available for advanced users
    mmg3d,  # noqa: F401  # Available for advanced users
    mmgs,  # noqa: F401  # Available for advanced users
)
from ._options import Mmg2DOptions, Mmg3DOptions, MmgSOptions
from ._progress import CancellationError, ProgressEvent, rich_progress
from ._pyvista import from_pyvista, to_pyvista
from ._result import RemeshResult
from ._transfer import interpolate_field, transfer_fields
from ._validation import (
    IssueSeverity,
    QualityStats,
    ValidationError,
    ValidationIssue,
    ValidationReport,
)
from .lagrangian import detect_boundary_vertices, move_mesh, propagate_displacement
from .sizing import (
    BoxSize,
    CylinderSize,
    PointSize,
    SizingConstraint,
    SphereSize,
    apply_sizing_constraints,
)

__all__ = [
    "MMG_VERSION",
    "BoxSize",
    "CancellationError",
    "CylinderSize",
    "IssueSeverity",
    "Mesh",
    "MeshCheckpoint",
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
    "progress",
    "propagate_displacement",
    "read",
    "repair",
    "rich_progress",
    "set_log_file",
    "set_log_level",
    "sizing",
    "to_pyvista",
    "transfer_fields",
]
