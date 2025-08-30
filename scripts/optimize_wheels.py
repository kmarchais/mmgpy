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

    # VTK modules that are kept in Windows wheels (minimal required set)
    windows_vtk_modules = {
        "CommonColor",
        "CommonComputationalGeometry",
        "CommonCore",
        "CommonDataModel",
        "CommonExecutionModel",
        "CommonMath",
        "CommonMisc",
        "CommonSystem",
        "CommonTransforms",
        "DICOMParser",
        "FiltersCellGrid",
        "FiltersCore",
        "FiltersExtraction",
        "FiltersGeneral",
        "FiltersGeometry",
        "FiltersHybrid",
        "FiltersHyperTree",
        "FiltersModeling",
        "FiltersParallel",
        "FiltersReduction",
        "FiltersSources",
        "FiltersStatistics",
        "FiltersTexture",
        "FiltersVerdict",
        "IOCellGrid",
        "IOCore",
        "IOGeometry",
        "IOImage",
        "IOLegacy",
        "IOParallel",
        "IOParallelXML",
        "IOXML",
        "IOXMLParser",
        "ImagingCore",
        "ImagingSources",
        "ParallelCore",
        "ParallelDIY",
        "RenderingCore",
        "doubleconversion",
        "expat",
        "fmt",
        "jpeg",
        "jsoncpp",
        "kissfft",
        "loguru",
        "lz4",
        "lzma",
        "metaio",
        "png",
        "pugixml",
        "sys",
        "tiff",
        "token",
        "verdict",
        "zlib",
    }

    # Extract wheel to temp directory
    temp_dir = tempfile.mkdtemp()
    try:
        with zipfile.ZipFile(wheel_path) as zf:
            zf.extractall(temp_dir)

        vtk_removed = 0
        removed_dirs = 0

        # Find all VTK libraries
        vtk_libs = []
        for root, dirs, files in os.walk(temp_dir):
            vtk_libs.extend(
                [
                    (root, f)
                    for f in files
                    if f.startswith("libvtk") and f.endswith((".dylib", ".so"))
                ],
            )

        # Remove VTK libraries that are not in Windows minimal set
        for root, lib in vtk_libs:
            # Extract module name (e.g., "CommonCore" from "libvtkCommonCore-9.4.9.4.dylib")
            if "-9.4.9.4." in lib:
                module_name = lib.split("libvtk")[1].split("-9.4.9.4.")[0]
                if module_name not in windows_vtk_modules:
                    os.remove(os.path.join(root, lib))
                    vtk_removed += 1
                    print(f"  Removed unused VTK module: {lib}")

        # Map base library names to their 9.4.9.4 versions (for remaining libraries)
        base_libs = {}
        remaining_vtk_libs = []
        for root, dirs, files in os.walk(temp_dir):
            remaining_vtk_libs.extend(
                [
                    (root, f)
                    for f in files
                    if f.startswith("libvtk") and f.endswith((".dylib", ".so"))
                ],
            )

        for root, lib in remaining_vtk_libs:
            if "-9.4.9.4." in lib:
                base = lib.split("-9.4.9.4.")[0]
                base_libs[base] = lib

        # Remove duplicate versions (keep only 9.4.9.4)
        for root, lib in remaining_vtk_libs:
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
    """Main function to optimize wheels."""
    import time

    if len(sys.argv) < 2:
        print("Usage: optimize_wheels.py <wheel_file_or_directory>")
        return

    target = sys.argv[1]

    # Wait a bit for any wheels still being written
    time.sleep(2)

    # Check if target is a single wheel file or directory
    if target.endswith(".whl") and os.path.isfile(target):
        # Single wheel optimization (for repair-wheel-command)
        print(f"=== Optimizing single wheel: {target} ===")
        try:
            optimize_wheel(target)
        except Exception as e:
            print(f"Error optimizing {target}: {e}")
    else:
        # Directory optimization (for before-test)
        wheelhouse = target
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
