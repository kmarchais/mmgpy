"""Python bindings for the MMG library."""

from . import _version  # type: ignore[attr-defined]
from ._mmgpy import MMG_VERSION, Point, Tetra  # type: ignore[attr-defined]
from .remesh import mmg2d, mmg3d, mmgs

__version__ = _version.__version__

__all__ = [
    "MMG_VERSION",
    "Point",
    "Tetra",
    "__version__",
    "mmg2d",
    "mmg3d",
    "mmgs",
]
