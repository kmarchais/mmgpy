"""Python bindings for the MMG library."""

import os
import sys
from pathlib import Path

# Handle DLL loading on Windows
if sys.platform == "win32":
    # Get the directory containing this file
    _module_dir = Path(__file__).absolute().parent

    # Always add the module directory to DLL search path (for MMG DLLs)
    os.add_dll_directory(str(_module_dir))

# Let delvewheel handle the rest of the imports
# Import after DLL setup is complete
try:
    from . import _version  # type: ignore[attr-defined]

    __version__ = _version.__version__
except ImportError:
    __version__ = "unknown"

# Main imports
from ._mmgpy import (  # type: ignore[attr-defined]
    MMG_VERSION,
    MmgMesh,
    mmg2d,
    mmg3d,
    mmgs,
)

__all__ = [
    "MMG_VERSION",
    "MmgMesh",
    "__version__",
    "mmg2d",
    "mmg3d",
    "mmgs",
]
