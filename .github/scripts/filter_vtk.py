#!/usr/bin/env python3
"""Filter VTK libraries to keep only essential modules before auditwheel.

This script runs BEFORE auditwheel to reduce the number of libraries
it needs to process, significantly speeding up wheel repair.
"""

from __future__ import annotations

import sys
from pathlib import Path

from vtk_modules import ESSENTIAL_VTK_MODULES, VTK_MAJOR_MINOR


def get_vtk_module_name(filename: str) -> str | None:
    """Extract VTK module name from library filename.

    Handles patterns like:
    - libvtkCommonCore-9.4.so (Linux symlink)
    - libvtkCommonCore-9.4.so.1 (Linux real file)
    - libvtkCommonCore-9.4.dylib (macOS)
    - libvtkCommonCore-9.4.9.4.dylib (macOS versioned)
    """
    if not filename.startswith("libvtk"):
        return None
    name = filename[6:]  # Remove "libvtk"
    version_marker = f"-{VTK_MAJOR_MINOR}"
    if version_marker not in name:
        return None
    return name.split(version_marker)[0]


def is_vtk_shared_library(filename: str) -> bool:
    """Check if file is a VTK shared library (Linux .so or macOS .dylib)."""
    return filename.startswith("libvtk") and (".so" in filename or ".dylib" in filename)


def filter_vtk_libs(vtk_lib_dir: str) -> None:
    """Remove non-essential VTK libraries from the given directory.

    Handles both real files and symlinks properly to avoid leaving
    dangling symlinks behind.
    """
    lib_path = Path(vtk_lib_dir)
    if not lib_path.is_dir():
        print(f"ERROR: VTK lib directory not found: {vtk_lib_dir}")
        sys.exit(1)

    print(f"VTK filter: using VTK version {VTK_MAJOR_MINOR}")

    to_remove_symlinks: list[Path] = []
    to_remove_files: list[Path] = []
    kept = 0

    for filepath in lib_path.iterdir():
        if filepath.is_dir() and not filepath.is_symlink():
            continue

        if not is_vtk_shared_library(filepath.name):
            continue

        module = get_vtk_module_name(filepath.name)
        if module is None:
            continue

        if module in ESSENTIAL_VTK_MODULES:
            kept += 1
        elif filepath.is_symlink():
            to_remove_symlinks.append(filepath)
        else:
            to_remove_files.append(filepath)

    for filepath in to_remove_symlinks:
        filepath.unlink()
    for filepath in to_remove_files:
        filepath.unlink()

    removed = len(to_remove_symlinks) + len(to_remove_files)
    print(
        f"VTK filter: kept {kept} essential libraries, "
        f"removed {removed} non-essential ({len(to_remove_symlinks)} symlinks)",
    )


def main() -> None:
    """Filter VTK libraries in the specified directory."""
    if len(sys.argv) < 2:
        print("Usage: filter_vtk.py <vtk_lib_directory>")
        print("Example: filter_vtk.py /tmp/vtk/lib64")
        sys.exit(1)

    vtk_lib_dir = sys.argv[1]
    filter_vtk_libs(vtk_lib_dir)


if __name__ == "__main__":
    main()
