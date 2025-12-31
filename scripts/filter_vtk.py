#!/usr/bin/env python3
"""Filter VTK libraries to keep only essential modules before auditwheel.

This script runs BEFORE auditwheel to reduce the number of libraries
it needs to process, significantly speeding up wheel repair.
"""

import os
import sys

from vtk_modules import ESSENTIAL_VTK_MODULES


def get_vtk_module_name(filename):
    """Extract VTK module name from library filename."""
    if not filename.startswith("libvtk"):
        return None
    name = filename[6:]  # Remove "libvtk"
    if "-9.4" not in name:
        return None
    return name.split("-9.4")[0]


def filter_vtk_libs(vtk_lib_dir):
    """Remove non-essential VTK libraries from the given directory."""
    if not os.path.isdir(vtk_lib_dir):
        print(f"ERROR: VTK lib directory not found: {vtk_lib_dir}")
        sys.exit(1)

    removed = 0
    kept = 0

    for filename in os.listdir(vtk_lib_dir):
        filepath = os.path.join(vtk_lib_dir, filename)
        if not os.path.isfile(filepath):
            continue

        # Only process VTK shared libraries
        if not (filename.startswith("libvtk") and ".so" in filename):
            continue

        module = get_vtk_module_name(filename)
        if module is None:
            continue

        if module in ESSENTIAL_VTK_MODULES:
            kept += 1
        else:
            os.remove(filepath)
            removed += 1

    print(
        f"VTK filter: kept {kept} essential libraries, removed {removed} non-essential",
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
