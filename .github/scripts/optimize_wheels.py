#!/usr/bin/env python3
"""Optimize wheel files by removing VTK duplicates and development files."""

from __future__ import annotations

import base64
import hashlib
import re
import shutil
import sys
import tempfile
import zipfile
from pathlib import Path

from vtk_modules import ESSENTIAL_VTK_MODULES, VTK_MAJOR_MINOR


def get_vtk_module_name(filename: str) -> str | None:
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

    name = filename[6:]  # Remove "libvtk"

    version_marker = f"-{VTK_MAJOR_MINOR}"
    if version_marker not in name:
        return None

    return name.split(version_marker)[0]


def is_vtk_library(filename: str) -> bool:
    """Check if file is a VTK shared library."""
    version_marker = f"-{VTK_MAJOR_MINOR}"
    return (
        filename.startswith("libvtk")
        and version_marker in filename
        and (".so" in filename or ".dylib" in filename)
    )


def is_removable_vtk_duplicate(filename: str, existing_files: set[str]) -> bool:
    """Check if VTK file is a duplicate that can be removed.

    Library versioning structure:
    Linux:
    - libvtkXXX-9.5.so       (linker name - remove if .so.1 exists)
    - libvtkXXX-9.5.so.1     (SONAME - KEEP, loader needs this!)
    - libvtkXXX-9.5.so.9.5   (full version - remove)

    macOS:
    - libvtkXXX-9.5.dylib       (base - KEEP)
    - libvtkXXX-9.5.9.5.dylib   (versioned - remove)

    Returns:
        True if file can be safely removed.

    """
    # Linux: Full version files (.so.X.Y) - always removable
    if re.search(r"\.so\.\d+\.\d+", filename):
        return True

    # macOS: Versioned dylib files (X.Y.dylib where X.Y is version) - remove
    # Pattern: libvtkXXX-9.5.9.5.dylib (has extra .X.Y before .dylib)
    if re.search(r"-\d+\.\d+\.\d+\.\d+\.dylib$", filename):
        return True

    # Linux: Base .so files - removable if SONAME version exists
    # e.g., libvtkCommonCore-9.5.so -> remove if libvtkCommonCore-9.5.so.1 exists
    if filename.endswith(".so"):
        soname_pattern = filename + ".1"
        if soname_pattern in existing_files:
            return True

    return False


def update_record(wheel_dir: Path) -> None:
    """Regenerate RECORD file after wheel modifications.

    This is required because PyPI validates that the RECORD manifest
    matches the actual wheel contents. See:
    https://blog.pypi.org/posts/2025-08-07-wheel-archive-confusion-attacks/
    """
    dist_info = None
    for item in wheel_dir.iterdir():
        if item.name.endswith(".dist-info"):
            dist_info = item
            break

    if not dist_info:
        print("  Warning: No .dist-info directory found")
        return

    record_path = dist_info / "RECORD"
    records = []

    for filepath in wheel_dir.rglob("*"):
        if filepath.is_dir():
            continue
        relpath = filepath.relative_to(wheel_dir).as_posix()

        if relpath.endswith("RECORD"):
            records.append(f"{relpath},,")
        else:
            digest = hashlib.sha256(filepath.read_bytes()).digest()
            hash_b64 = base64.urlsafe_b64encode(digest).rstrip(b"=").decode()
            size = filepath.stat().st_size
            records.append(f"{relpath},sha256={hash_b64},{size}")

    record_path.write_text("\n".join(sorted(records)) + "\n")

    print(f"  Updated RECORD with {len(records)} entries")


def optimize_wheel(wheel_path: str) -> None:
    """Optimize a single wheel by removing duplicates and dev files."""
    path = Path(wheel_path)
    original_size = path.stat().st_size // 1024 // 1024
    print(f"Processing {wheel_path} ({original_size}MB)")

    temp_dir = Path(tempfile.mkdtemp())
    try:
        with zipfile.ZipFile(wheel_path) as zf:
            zf.extractall(temp_dir)

        vtk_removed = 0
        vtk_duplicates_removed = 0
        other_removed = 0
        libs_removed = 0

        # Remove auditwheel's .libs directory (duplicates of mmgpy/lib/)
        for item in temp_dir.iterdir():
            if item.name.endswith(".libs") and item.is_dir():
                libs_count = len(list(item.iterdir()))
                shutil.rmtree(item, ignore_errors=True)
                libs_removed += libs_count
                print(f"  Removed duplicates: {item.name}/ ({libs_count} files)")

        # Collect all filenames for duplicate detection
        all_filenames = {f.name for f in temp_dir.rglob("*") if f.is_file()}

        # Walk through all files and remove unwanted ones
        for filepath in list(temp_dir.rglob("*")):
            if not filepath.exists():
                continue

            # Remove development directories
            if filepath.is_dir() and filepath.name in ("include", "cmake"):
                shutil.rmtree(filepath, ignore_errors=True)
                print(f"  Removed dev directory: {filepath.relative_to(temp_dir)}")
                continue

            if not filepath.is_file():
                continue

            relpath = filepath.relative_to(temp_dir).as_posix()

            # Check if it's a VTK library
            if is_vtk_library(filepath.name):
                # Remove duplicates (Linux: .so if .so.1 exists, .so.9.5)
                # macOS: remove versioned dylibs like -9.5.9.5.dylib
                if is_removable_vtk_duplicate(filepath.name, all_filenames):
                    filepath.unlink()
                    vtk_duplicates_removed += 1
                    continue

                # Filter non-essential VTK modules (both Linux and macOS)
                module = get_vtk_module_name(filepath.name)
                if module and module not in ESSENTIAL_VTK_MODULES:
                    filepath.unlink()
                    vtk_removed += 1
                    if vtk_removed <= 10:
                        print(f"  Removed VTK: {filepath.name} (module: {module})")
                    elif vtk_removed == 11:
                        print("  ... (more VTK removals)")

            # Remove duplicate directories (lib64/, bin/ with MMG binaries)
            elif "/lib64/" in relpath or relpath.startswith("lib64/"):
                filepath.unlink()
                other_removed += 1
            elif "/bin/" in relpath or relpath.startswith("bin/"):
                # Keep executables in mmgpy/bin/ but remove top-level bin/
                if not relpath.startswith("mmgpy/"):
                    filepath.unlink()
                    other_removed += 1

        # Remove empty directories
        for dirpath in sorted(
            temp_dir.rglob("*"),
            key=lambda p: len(p.parts),
            reverse=True,
        ):
            if dirpath.is_dir() and not any(dirpath.iterdir()):
                dirpath.rmdir()

        print(
            f"  Removed {vtk_removed} non-essential VTK, "
            f"{vtk_duplicates_removed} versioned duplicates, "
            f"{libs_removed} auditwheel duplicates, {other_removed} other files",
        )

        # Regenerate RECORD file to match actual wheel contents
        update_record(temp_dir)

        # Recreate wheel as zip
        zip_path = wheel_path.replace(".whl", "")
        shutil.make_archive(zip_path, "zip", temp_dir)
        shutil.move(zip_path + ".zip", wheel_path)

        new_size = Path(wheel_path).stat().st_size // 1024 // 1024
        print(f"  Optimized: {original_size}MB -> {new_size}MB")

    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)


def main() -> None:
    """Optimize wheels by removing duplicates and non-essential files."""
    if len(sys.argv) < 2:
        print("Usage: optimize_wheels.py <wheel_file_or_directory>")
        return

    target = sys.argv[1]
    target_path = Path(target)

    if target.endswith(".whl") and target_path.is_file():
        print(f"=== Optimizing single wheel: {target} ===")
        optimize_wheel(target)
    else:
        wheels = list(target_path.glob("*.whl"))
        print(f"=== Found {len(wheels)} wheels in {target} ===")
        for wheel in wheels:
            optimize_wheel(str(wheel))

    print("=== Optimization complete ===")


if __name__ == "__main__":
    main()
