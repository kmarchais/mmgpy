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


def python_version_to_semver(version: str) -> str:
    """Convert Python PEP 440 version to SemVer format for Blender.

    Blender requires semantic versioning (semver.org) which uses hyphens
    for prerelease identifiers, while Python uses dots or suffixes.

    Examples:
        0.6.0.dev0 -> 0.6.0-dev.0
        0.6.0a1    -> 0.6.0-alpha.1
        0.6.0b1    -> 0.6.0-beta.1
        0.6.0rc1   -> 0.6.0-rc.1
        0.6.0      -> 0.6.0 (unchanged)

    """
    # Handle .devN format (e.g., 0.6.0.dev0)
    if ".dev" in version:
        base, dev = version.split(".dev")
        return f"{base}-dev.{dev}"

    # Handle aN format (e.g., 0.6.0a1)
    match = re.match(r"^(\d+\.\d+\.\d+)a(\d+)$", version)
    if match:
        return f"{match.group(1)}-alpha.{match.group(2)}"

    # Handle bN format (e.g., 0.6.0b1)
    match = re.match(r"^(\d+\.\d+\.\d+)b(\d+)$", version)
    if match:
        return f"{match.group(1)}-beta.{match.group(2)}"

    # Handle rcN format (e.g., 0.6.0rc1)
    match = re.match(r"^(\d+\.\d+\.\d+)rc(\d+)$", version)
    if match:
        return f"{match.group(1)}-rc.{match.group(2)}"

    # Regular version, return as-is
    return version


def get_mmgpy_version() -> tuple[str, str]:
    """Read version from pyproject.toml.

    Returns
    -------
    tuple[str, str]
        (semver_version, python_version) - SemVer for manifest, Python for deps.

    """
    pyproject_path = Path(__file__).parent.parent / "pyproject.toml"
    content = pyproject_path.read_text()

    # Match: version = "x.y.z" or version = "x.y.z.devN"
    match = re.search(r'^version\s*=\s*"([^"]+)"', content, re.MULTILINE)
    if not match:
        msg = "Could not find version in pyproject.toml"
        raise ValueError(msg)

    python_version = match.group(1)
    semver_version = python_version_to_semver(python_version)
    return semver_version, python_version


def version_to_tuple(version: str) -> tuple[int, int, int]:
    """Convert version string to tuple for bl_info.

    bl_info only supports (major, minor, patch) integers,
    so prerelease suffixes are stripped.
    """
    # Strip prerelease suffix (e.g., "0.6.0-dev.0" -> "0.6.0")
    base_version = version.split("-")[0]
    parts = base_version.split(".")
    return (int(parts[0]), int(parts[1]), int(parts[2]))


def update_manifest(
    semver_version: str,
    python_version: str,
    *,
    check_only: bool = False,
) -> bool:
    """Update blender_manifest.toml with new version.

    Parameters
    ----------
    semver_version : str
        SemVer format version for the manifest version field.
    python_version : str
        Python PEP 440 format for the dependency specifier.
    check_only : bool
        If True, don't modify files, just check if they need updating.

    Returns
    -------
    bool
        True if file was (or would be) modified.

    """
    manifest_path = Path(__file__).parent / "blender_manifest.toml"
    content = manifest_path.read_text()

    # Replace version line (uses SemVer)
    new_content = re.sub(
        r'^version\s*=\s*"[^"]+"',
        f'version = "{semver_version}"',
        content,
        count=1,
        flags=re.MULTILINE,
    )

    # Also update the mmgpy dependency to match (uses Python PEP 440)
    new_content = re.sub(
        r'"mmgpy>=[^"]+"',
        f'"mmgpy>={python_version}"',
        new_content,
    )

    if new_content != content:
        if not check_only:
            manifest_path.write_text(new_content)
            print(f"Updated blender_manifest.toml to version {semver_version}")
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
        semver_version, python_version = get_mmgpy_version()
        print(f"mmgpy version: {python_version} (SemVer: {semver_version})")

        manifest_changed = update_manifest(
            semver_version,
            python_version,
            check_only=check_only,
        )
        init_changed = update_init(semver_version, check_only=check_only)

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
