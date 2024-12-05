"""Python bindings for the MMG library."""

from . import _version  # type: ignore[attr-defined]
from ._mmgpy import MMG_VERSION, mmg2d, mmg3d, mmgs  # type: ignore[attr-defined]

__version__ = _version.__version__

__all__ = [
    "MMG_VERSION",
    "__version__",
    "mmg2d",
    "mmg3d",
    "mmgs",
]
