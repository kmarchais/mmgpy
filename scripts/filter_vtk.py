#!/usr/bin/env python3
"""Filter VTK libraries to keep only essential modules before auditwheel.

This script runs BEFORE auditwheel to reduce the number of libraries
it needs to process, significantly speeding up wheel repair.
"""

import os
import sys

from vtk_modules import ESSENTIAL_VTK_MODULES, VTK_MAJOR_MINOR


def get_vtk_module_name(filename):
    """Extract VTK module name from library filename.

    Handles patterns like:
    - libvtkCommonCore-9.4.so (symlink)
    - libvtkCommonCore-9.4.so.1 (real file)
    """
    if not filename.startswith("libvtk"):
        return None
    name = filename[6:]  # Remove "libvtk"
    version_marker = f"-{VTK_MAJOR_MINOR}"
    if version_marker not in name:
        return None
    return name.split(version_marker)[0]


def filter_vtk_libs(vtk_lib_dir):
    """Remove non-essential VTK libraries from the given directory.

    Handles both real files and symlinks properly to avoid leaving
    dangling symlinks behind.
    """
    if not os.path.isdir(vtk_lib_dir):
        print(f"ERROR: VTK lib directory not found: {vtk_lib_dir}")
        sys.exit(1)

    print(f"VTK filter: using VTK version {VTK_MAJOR_MINOR}")

    # Collect files to remove (process symlinks first to avoid dangling refs)
    to_remove_symlinks = []
    to_remove_files = []
    kept = 0

    for filename in os.listdir(vtk_lib_dir):
        filepath = os.path.join(vtk_lib_dir, filename)

        # Skip directories
        if os.path.isdir(filepath) and not os.path.islink(filepath):
            continue

        # Only process VTK shared libraries
        if not (filename.startswith("libvtk") and ".so" in filename):
            continue

        module = get_vtk_module_name(filename)
        if module is None:
            continue

        if module in ESSENTIAL_VTK_MODULES:
            kept += 1
        elif os.path.islink(filepath):
            to_remove_symlinks.append(filepath)
        else:
            to_remove_files.append(filepath)

    # Remove symlinks first, then real files (avoids dangling symlink issues)
    for filepath in to_remove_symlinks:
        os.remove(filepath)
    for filepath in to_remove_files:
        os.remove(filepath)

    removed = len(to_remove_symlinks) + len(to_remove_files)
    print(
        f"VTK filter: kept {kept} essential libraries, "
        f"removed {removed} non-essential ({len(to_remove_symlinks)} symlinks)",
    )


def main():
    """Filter VTK libraries in the specified directory."""
    if len(sys.argv) < 2:
        print("Usage: filter_vtk.py <vtk_lib_directory>")
        print("Example: filter_vtk.py /tmp/vtk/lib64")
        sys.exit(1)

    vtk_lib_dir = sys.argv[1]
    filter_vtk_libs(vtk_lib_dir)


if __name__ == "__main__":
    main()
