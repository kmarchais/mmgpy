#!/usr/bin/env python3
# SPDX-FileCopyrightText: 2026 Kevin Marchais
# SPDX-License-Identifier: MIT
"""Sync version from pyproject.toml to blender_manifest.toml.

This script reads the version from the main pyproject.toml and updates
the blender_manifest.toml to match. It also updates the __init__.py bl_info.

Usage:
    python sync_version.py
    python sync_version.py --check  # Only check, don't modify
"""

from __future__ import annotations

import re
import sys
from pathlib import Path


def get_mmgpy_version() -> str:
    """Read version from pyproject.toml."""
    pyproject_path = Path(__file__).parent.parent / "pyproject.toml"
    content = pyproject_path.read_text()

    # Match: version = "x.y.z" or version = "x.y.z.devN"
    match = re.search(r'^version\s*=\s*"([^"]+)"', content, re.MULTILINE)
    if not match:
        msg = "Could not find version in pyproject.toml"
        raise ValueError(msg)

    version = match.group(1)

    # For dev versions like "0.6.0.dev0", Blender manifest needs "0.6.0"
    # Blender only accepts semantic versioning (x.y.z)
    if ".dev" in version:
        version = version.split(".dev")[0]

    return version


def version_to_tuple(version: str) -> tuple[int, int, int]:
    """Convert version string to tuple for bl_info."""
    parts = version.split(".")
    return (int(parts[0]), int(parts[1]), int(parts[2]))


def update_manifest(version: str, *, check_only: bool = False) -> bool:
    """Update blender_manifest.toml with new version.

    Returns True if file was (or would be) modified.
    """
    manifest_path = Path(__file__).parent / "blender_manifest.toml"
    content = manifest_path.read_text()

    # Replace version line
    new_content = re.sub(
        r'^version\s*=\s*"[^"]+"',
        f'version = "{version}"',
        content,
        count=1,
        flags=re.MULTILINE,
    )

    # Also update the mmgpy dependency to match
    new_content = re.sub(
        r'"mmgpy>=[^"]+"',
        f'"mmgpy>={version}"',
        new_content,
    )

    if new_content != content:
        if not check_only:
            manifest_path.write_text(new_content)
            print(f"Updated blender_manifest.toml to version {version}")
        return True
    return False


def update_init(version: str, *, check_only: bool = False) -> bool:
    """Update __init__.py bl_info with new version.

    Returns True if file was (or would be) modified.
    """
    init_path = Path(__file__).parent / "__init__.py"
    content = init_path.read_text()

    version_tuple = version_to_tuple(version)

    # Replace version tuple in bl_info
    new_content = re.sub(
        r'"version":\s*\([^)]+\)',
        f'"version": {version_tuple}',
        content,
    )

    if new_content != content:
        if not check_only:
            init_path.write_text(new_content)
            print(f"Updated __init__.py bl_info to version {version_tuple}")
        return True
    return False


def main() -> int:
    """Main entry point."""
    check_only = "--check" in sys.argv

    try:
        version = get_mmgpy_version()
        print(f"mmgpy version: {version}")

        manifest_changed = update_manifest(version, check_only=check_only)
        init_changed = update_init(version, check_only=check_only)

        if check_only:
            if manifest_changed or init_changed:
                print("Version mismatch detected. Run without --check to update.")
                return 1
            print("Versions are in sync.")
            return 0

        if not manifest_changed and not init_changed:
            print("Versions already in sync.")

        return 0

    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
