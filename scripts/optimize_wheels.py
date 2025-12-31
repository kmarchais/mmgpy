#!/usr/bin/env python3
"""Optimize wheel files by removing VTK duplicates and development files."""

import base64
import hashlib
import os
import shutil
import sys
import tempfile
import zipfile

from vtk_modules import ESSENTIAL_VTK_MODULES, VTK_MAJOR_MINOR


def get_vtk_module_name(filename):
    """Extract VTK module name from library filename.

    Handles patterns like:
    - libvtkCommonCore-9.4.so
    - libvtkCommonCore-9.4.so.1
    - libvtkCommonCore-9.4.so.9.4
    - libvtkCommonCore-9.4.dylib
    - libvtkCommonCore-9.4.1.dylib
    - libvtkCommonCore-9.4.9.4.dylib
    """
    if not filename.startswith("libvtk"):
        return None

    # Remove libvtk prefix
    name = filename[6:]  # Remove "libvtk"

    # Find the version marker (e.g., "-9.4", "-9.5")
    version_marker = f"-{VTK_MAJOR_MINOR}"
    if version_marker not in name:
        return None

    # Extract module name (everything before version marker)
    module = name.split(version_marker)[0]
    return module


def is_vtk_library(filename):
    """Check if file is a VTK shared library."""
    version_marker = f"-{VTK_MAJOR_MINOR}"
    return (
        filename.startswith("libvtk")
        and version_marker in filename
        and (".so" in filename or ".dylib" in filename)
    )


def update_record(wheel_dir):
    """Regenerate RECORD file after wheel modifications.

    This is required because PyPI validates that the RECORD manifest
    matches the actual wheel contents. See:
    https://blog.pypi.org/posts/2025-08-07-wheel-archive-confusion-attacks/
    """
    # Find the .dist-info directory
    dist_info = None
    for item in os.listdir(wheel_dir):
        if item.endswith(".dist-info"):
            dist_info = os.path.join(wheel_dir, item)
            break

    if not dist_info:
        print("  Warning: No .dist-info directory found")
        return

    record_path = os.path.join(dist_info, "RECORD")
    records = []

    for root, _dirs, files in os.walk(wheel_dir):
        for f in files:
            filepath = os.path.join(root, f)
            relpath = os.path.relpath(filepath, wheel_dir)

            if relpath.endswith("RECORD"):
                # RECORD itself has no hash
                records.append(f"{relpath},,")
            else:
                with open(filepath, "rb") as fp:
                    digest = hashlib.sha256(fp.read()).digest()
                    hash_b64 = base64.urlsafe_b64encode(digest).rstrip(b"=").decode()
                    size = os.path.getsize(filepath)
                    records.append(f"{relpath},sha256={hash_b64},{size}")

    with open(record_path, "w") as fp:
        fp.write("\n".join(sorted(records)) + "\n")

    print(f"  Updated RECORD with {len(records)} entries")


def optimize_wheel(wheel_path):
    """Optimize a single wheel by removing duplicates and dev files."""
    original_size = os.path.getsize(wheel_path) // 1024 // 1024
    print(f"Processing {wheel_path} ({original_size}MB)")

    temp_dir = tempfile.mkdtemp()
    try:
        with zipfile.ZipFile(wheel_path) as zf:
            zf.extractall(temp_dir)

        vtk_removed = 0
        other_removed = 0
        libs_removed = 0

        # Remove auditwheel's .libs directory (duplicates of mmgpy/lib/)
        # auditwheel bundles libraries to <package>.libs/ but we already have
        # them in mmgpy/lib/ from CMake install, so .libs is all duplicates
        for item in os.listdir(temp_dir):
            if item.endswith(".libs"):
                libs_dir = os.path.join(temp_dir, item)
                if os.path.isdir(libs_dir):
                    libs_count = len(os.listdir(libs_dir))
                    shutil.rmtree(libs_dir, ignore_errors=True)
                    libs_removed += libs_count
                    print(
                        f"  Removed auditwheel duplicates: {item}/ ({libs_count} files)",
                    )

        # Walk through all files and remove unwanted ones
        for root, dirs, files in os.walk(temp_dir, topdown=False):
            # Remove development directories
            for d in ["include", "cmake"]:
                dir_path = os.path.join(root, d)
                if os.path.isdir(dir_path):
                    shutil.rmtree(dir_path, ignore_errors=True)
                    print(
                        f"  Removed dev directory: {os.path.relpath(dir_path, temp_dir)}",
                    )

            # Process files
            for f in files:
                filepath = os.path.join(root, f)
                relpath = os.path.relpath(filepath, temp_dir)

                # Check if it's a VTK library
                if is_vtk_library(f):
                    module = get_vtk_module_name(f)
                    if module and module not in ESSENTIAL_VTK_MODULES:
                        os.remove(filepath)
                        vtk_removed += 1
                        # Only print first few to avoid spam
                        if vtk_removed <= 10:
                            print(f"  Removed VTK: {f} (module: {module})")
                        elif vtk_removed == 11:
                            print("  ... (more VTK removals)")

                # Remove duplicate directories (lib64/, bin/ with MMG binaries)
                elif "/lib64/" in relpath or relpath.startswith("lib64/"):
                    os.remove(filepath)
                    other_removed += 1
                elif "/bin/" in relpath or relpath.startswith("bin/"):
                    # Keep executables in mmgpy/bin/ but remove top-level bin/
                    if not relpath.startswith("mmgpy/"):
                        os.remove(filepath)
                        other_removed += 1

        # Remove empty directories
        for root, dirs, files in os.walk(temp_dir, topdown=False):
            for d in dirs:
                dir_path = os.path.join(root, d)
                try:
                    if not os.listdir(dir_path):
                        os.rmdir(dir_path)
                except OSError:
                    pass

        print(
            f"  Removed {vtk_removed} VTK libraries, {libs_removed} auditwheel duplicates, "
            f"{other_removed} other files",
        )

        # Regenerate RECORD file to match actual wheel contents
        update_record(temp_dir)

        # Recreate wheel as zip
        zip_path = wheel_path.replace(".whl", "")
        shutil.make_archive(zip_path, "zip", temp_dir)
        shutil.move(zip_path + ".zip", wheel_path)

        new_size = os.path.getsize(wheel_path) // 1024 // 1024
        print(f"  Optimized: {original_size}MB -> {new_size}MB")

    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)


def main():
    """Main function to optimize wheels."""
    if len(sys.argv) < 2:
        print("Usage: optimize_wheels.py <wheel_file_or_directory>")
        return

    target = sys.argv[1]

    if target.endswith(".whl") and os.path.isfile(target):
        print(f"=== Optimizing single wheel: {target} ===")
        optimize_wheel(target)
    else:
        import glob

        wheels = glob.glob(os.path.join(target, "*.whl"))
        print(f"=== Found {len(wheels)} wheels in {target} ===")
        for wheel in wheels:
            optimize_wheel(wheel)

    print("=== Optimization complete ===")


if __name__ == "__main__":
    main()
