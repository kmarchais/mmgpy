# SPDX-FileCopyrightText: 2026 Kevin Marchais
# SPDX-License-Identifier: GPL-3.0-or-later
"""Synchronise the project version across every file that pins it.

The source of truth is ``pyproject.toml``. This script rewrites the other
files (conda recipe, Blender manifest) to match it. With ``--set X.Y.Z``
it rewrites all files (including pyproject.toml) to a new version, which
is how the release workflow bumps the project.

Usage::

    python .github/scripts/sync_versions.py            # sync from pyproject
    python .github/scripts/sync_versions.py --check    # verify sync, exit 1 on drift
    python .github/scripts/sync_versions.py --set 0.14.0
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
PYPROJECT = ROOT / "pyproject.toml"
CONDA_RECIPE = ROOT / "conda" / "recipe.yaml"
BLENDER_MANIFEST = ROOT / "blender_mmgpy" / "blender_manifest.toml"


def _log(message: str) -> None:
    sys.stdout.write(message + "\n")


def _err(message: str) -> None:
    sys.stderr.write(message + "\n")


def python_to_semver(version: str) -> str:
    """Convert PEP 440 to SemVer for the Blender manifest.

    ``0.6.0.dev0`` -> ``0.6.0-dev.0``; ``0.6.0a1`` -> ``0.6.0-alpha.1``;
    ``0.6.0b1`` -> ``0.6.0-beta.1``; ``0.6.0rc1`` -> ``0.6.0-rc.1``;
    ``0.6.0.post1`` -> ``0.6.0-post.1``; ``0.6.0`` -> ``0.6.0``.
    """
    if ".dev" in version:
        base, dev = version.split(".dev")
        return f"{base}-dev.{dev}"
    if ".post" in version:
        base, post = version.split(".post")
        return f"{base}-post.{post}"
    for suffix, label in (("a", "alpha"), ("b", "beta"), ("rc", "rc")):
        match = re.match(rf"^(\d+\.\d+\.\d+){suffix}(\d+)$", version)
        if match:
            return f"{match.group(1)}-{label}.{match.group(2)}"
    return version


def read_pyproject_version() -> str:
    """Return the ``version = "..."`` value from ``pyproject.toml``."""
    content = PYPROJECT.read_text()
    match = re.search(r'^version\s*=\s*"([^"]+)"', content, re.MULTILINE)
    if not match:
        msg = 'Could not find `version = "..."` in pyproject.toml'
        raise ValueError(msg)
    return match.group(1)


def _rewrite(path: Path, pattern: str, replacement: str, *, check_only: bool) -> bool:
    content = path.read_text()
    new_content = re.sub(pattern, replacement, content, count=1, flags=re.MULTILINE)
    if new_content == content:
        return False
    if not check_only:
        path.write_text(new_content)
    return True


def sync_pyproject(version: str, *, check_only: bool) -> bool:
    """Rewrite ``pyproject.toml``'s ``version`` field. Return True if changed."""
    return _rewrite(
        PYPROJECT,
        r'^version\s*=\s*"[^"]+"',
        f'version = "{version}"',
        check_only=check_only,
    )


def sync_conda(version: str, *, check_only: bool) -> bool:
    """Rewrite ``conda/recipe.yaml``'s ``version`` context. Return True if changed."""
    return _rewrite(
        CONDA_RECIPE,
        r'^(\s*version:\s*)"[^"]+"',
        rf'\g<1>"{version}"',
        check_only=check_only,
    )


def sync_blender(version: str, *, check_only: bool) -> bool:
    """Rewrite the Blender manifest's ``version`` to the SemVer form.

    Returns True if changed.
    """
    return _rewrite(
        BLENDER_MANIFEST,
        r'^version\s*=\s*"[^"]+"',
        f'version = "{python_to_semver(version)}"',
        check_only=check_only,
    )


def main() -> int:
    """CLI entry point. Return a process exit code."""
    parser = argparse.ArgumentParser(description=__doc__)
    group = parser.add_mutually_exclusive_group()
    group.add_argument(
        "--check",
        action="store_true",
        help="Verify all files match pyproject.toml; exit 1 on drift.",
    )
    group.add_argument(
        "--set",
        dest="target",
        metavar="VERSION",
        help="Rewrite every file (including pyproject.toml) to VERSION.",
    )
    args = parser.parse_args()

    if args.target:
        version = args.target
        try:
            pyproject_changed = sync_pyproject(version, check_only=False)
        except (OSError, re.error) as exc:
            _err(f"Error: {exc}")
            return 1
    else:
        try:
            version = read_pyproject_version()
        except (OSError, ValueError, re.error) as exc:
            _err(f"Error: {exc}")
            return 1
        pyproject_changed = False

    _log(f"Target version: {version} (SemVer: {python_to_semver(version)})")

    try:
        conda_changed = sync_conda(version, check_only=args.check)
        blender_changed = sync_blender(version, check_only=args.check)
    except (OSError, re.error) as exc:
        _err(f"Error: {exc}")
        return 1

    drift = {
        "conda/recipe.yaml": conda_changed,
        "blender_mmgpy/blender_manifest.toml": blender_changed,
    }
    if args.check:
        out_of_sync = [name for name, changed in drift.items() if changed]
        if out_of_sync:
            _err("Version mismatch in: " + ", ".join(out_of_sync))
            _err("Run `python .github/scripts/sync_versions.py` to fix.")
            return 1
        try:
            from packaging.version import InvalidVersion, Version
        except ImportError:
            _err(
                "The 'packaging' package is required for --check. "
                "Run via `uv run --no-project --with packaging python ...` "
                "or install it in the active environment.",
            )
            return 1
        try:
            Version(version)
        except InvalidVersion as exc:
            _err(f"Version {version!r} in pyproject.toml is not valid PEP 440: {exc}")
            return 1
        _log("All version files in sync.")
        return 0

    touched = [name for name, changed in drift.items() if changed]
    if pyproject_changed:
        touched.insert(0, "pyproject.toml")
    if touched:
        _log("Updated: " + ", ".join(touched))
    else:
        _log("All version files already in sync.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
