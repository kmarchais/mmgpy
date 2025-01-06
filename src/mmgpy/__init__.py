"""Python bindings for the MMG library."""

from . import _version  # type: ignore[attr-defined]
from ._mmgpy import (  # type: ignore[attr-defined]
    MMG_VERSION,
    MmgMesh,
    mmg2d,
    mmg3d,
    mmgs,
)

__version__ = _version.__version__

__all__ = [
    "MMG_VERSION",
    "MmgMesh",
    "__version__",
    "mmg2d",
    "mmg3d",
    "mmgs",
]
