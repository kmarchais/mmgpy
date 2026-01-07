#!/usr/bin/env python3
"""Analyze wheel contents to understand structure."""

from __future__ import annotations

import sys
import zipfile
from pathlib import Path


def analyze_wheel(wheel_path: str) -> None:
    """Analyze a wheel to understand its contents."""
    path = Path(wheel_path)
    print(f"Analyzing {wheel_path}")
    print(f"Wheel size: {path.stat().st_size // 1024 // 1024}MB")

    with zipfile.ZipFile(wheel_path, "r") as zf:
        all_files = zf.namelist()
        print(f"Total files in wheel: {len(all_files)}")

        lib_files = [
            f for f in all_files if any(x in f for x in [".so", ".dylib", ".dll"])
        ]
        vtk_files = [f for f in lib_files if "vtk" in f.lower()]
        mmg_files = [f for f in lib_files if "mmg" in f.lower()]

        print(f"\nLibrary files: {len(lib_files)}")
        print(f"VTK files: {len(vtk_files)}")
        print(f"MMG files: {len(mmg_files)}")

        file_sizes = []
        for filename in all_files:
            info = zf.getinfo(filename)
            file_sizes.append((filename, info.file_size))

        file_sizes.sort(key=lambda x: x[1], reverse=True)

        print("\nTop 20 largest files:")
        total_size = 0
        for filename, size in file_sizes[:20]:
            size_mb = size / (1024 * 1024)
            total_size += size
            print(f"  {filename}: {size_mb:.1f}MB")

        print(f"\nTop 20 files account for: {total_size / (1024 * 1024):.1f}MB")

        if vtk_files:
            print("\nVTK files found:")
            for vtk_file in vtk_files[:10]:
                info = zf.getinfo(vtk_file)
                size_mb = info.file_size / (1024 * 1024)
                print(f"  {vtk_file}: {size_mb:.1f}MB")
            if len(vtk_files) > 10:
                print(f"  ... and {len(vtk_files) - 10} more")
        else:
            print("\nNo VTK files found!")

        dirs: set[str] = set()
        for f in all_files:
            parts = f.split("/")
            for i in range(1, len(parts)):
                dirs.add("/".join(parts[:i]))

        print("\nDirectory structure:")
        for d in sorted(dirs):
            files_in_dir = [
                f
                for f in all_files
                if f.startswith(d + "/") and f.count("/") == d.count("/") + 1
            ]
            if files_in_dir:
                print(f"  {d}/ ({len(files_in_dir)} files)")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: analyze_wheel.py <wheel_file>")
        sys.exit(1)

    analyze_wheel(sys.argv[1])
