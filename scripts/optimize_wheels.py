#!/usr/bin/env python3
"""Optimize wheel files by removing VTK duplicates and development files."""

import glob
import os
import shutil
import sys
import tempfile
import zipfile


def optimize_wheel(wheel_path):
    """Optimize a single wheel by removing duplicates and dev files."""
    print(f"Processing {wheel_path} ({os.path.getsize(wheel_path) // 1024 // 1024}MB)")

    # Extract wheel to temp directory
    temp_dir = tempfile.mkdtemp()
    try:
        with zipfile.ZipFile(wheel_path) as zf:
            zf.extractall(temp_dir)

        vtk_removed = 0
        removed_dirs = 0

        # Find all VTK libraries and identify base libraries (9.4.9.4 versions)
        vtk_libs = []
        for root, dirs, files in os.walk(temp_dir):
            vtk_libs.extend(
                [
                    (root, f)
                    for f in files
                    if f.startswith("libvtk") and f.endswith((".dylib", ".so"))
                ],
            )

        # Map base library names to their 9.4.9.4 versions
        base_libs = {}
        for root, lib in vtk_libs:
            if "-9.4.9.4." in lib:
                base = lib.split("-9.4.9.4.")[0]
                base_libs[base] = lib

        # Remove duplicate versions (keep only 9.4.9.4)
        for root, lib in vtk_libs:
            if lib not in base_libs.values():
                # Check if this is a duplicate of a base library
                for base in base_libs:
                    if lib.startswith(base + "-9.4."):
                        os.remove(os.path.join(root, lib))
                        vtk_removed += 1
                        print(f"  Removed duplicate: {lib}")
                        break

        # Remove development directories
        for root, dirs, files in os.walk(temp_dir):
            for d in dirs[:]:  # Use slice to avoid modifying list while iterating
                if d in ["include", "cmake"]:
                    shutil.rmtree(os.path.join(root, d), ignore_errors=True)
                    removed_dirs += 1
                    print(f"  Removed dev directory: {d}")

        print(f"  Removed {vtk_removed} VTK duplicates, {removed_dirs} dev directories")

        # Recreate wheel
        zip_path = wheel_path.replace(".whl", "")
        shutil.make_archive(zip_path, "zip", temp_dir)
        shutil.move(zip_path + ".zip", wheel_path)

        print(f"  Optimized to {os.path.getsize(wheel_path) // 1024 // 1024}MB")

    finally:
        shutil.rmtree(temp_dir)


def main():
    """Main function to optimize all wheels in wheelhouse."""
    import time

    wheelhouse = sys.argv[1] if len(sys.argv) > 1 else "./wheelhouse"

    # Wait a bit for any wheels still being written
    time.sleep(2)

    wheels = glob.glob(os.path.join(wheelhouse, "*.whl"))
    print(f"=== Found {len(wheels)} wheels in {wheelhouse} ===")

    if not wheels:
        print("No wheels found! Checking directory contents:")
        try:
            import subprocess

            result = subprocess.run(
                ["ls", "-la", wheelhouse],
                capture_output=True,
                text=True,
                check=False,
            )
            print(result.stdout)
        except Exception as e:
            print(f"Could not list directory: {e}")
        return

    print(f"=== Optimizing {len(wheels)} wheels ===")
    for wheel in wheels:
        try:
            optimize_wheel(wheel)
        except Exception as e:
            print(f"Error optimizing {wheel}: {e}")
            continue

    print("=== Optimization complete ===")


if __name__ == "__main__":
    main()
