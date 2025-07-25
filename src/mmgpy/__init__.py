"""Python bindings for the MMG library."""


def _setup_dll_loading() -> None:
    """Set up DLL loading on Windows."""
    import os
    import sys
    from pathlib import Path

    if sys.platform != "win32":
        return

    # Get the directory containing this file
    module_dir = Path(__file__).parent

    # Check if delvewheel has created a .libs directory
    libs_dir = module_dir / ".." / "mmgpy.libs"
    if libs_dir.exists():
        os.add_dll_directory(str(libs_dir.absolute()))

    # Add the module directory itself
    if module_dir.exists():
        os.add_dll_directory(str(module_dir.absolute()))

    # For development: check common build directories
    project_root = module_dir.parent.parent
    possible_dll_dirs = [
        project_root / "build" / "_deps" / "mmg-build" / "lib" / "Release",
        project_root / "build" / "_deps" / "mmg-build" / "lib",
        project_root / "build" / "Release",
        project_root / "build",
    ]

    for dll_dir in possible_dll_dirs:
        if dll_dir.exists():
            os.add_dll_directory(str(dll_dir.absolute()))


# Set up DLL loading before imports
_setup_dll_loading()

# Import after DLL setup is complete
try:
    from . import _version  # type: ignore[attr-defined]

    __version__ = _version.__version__
except ImportError:
    __version__ = "unknown"

# Main imports
from ._mmgpy import (  # type: ignore[attr-defined] #noqa: E402
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
