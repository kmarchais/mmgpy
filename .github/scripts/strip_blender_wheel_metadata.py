# SPDX-FileCopyrightText: 2026 Kevin Marchais
# SPDX-License-Identifier: GPL-3.0-or-later
"""Derive a slim "core" variant of an mmgpy wheel for the Blender bundle.

Rewrites the wheel's ``*.dist-info/METADATA`` in place to drop runtime deps
the Blender extension code path does not reach (``pyvista``, ``scipy``,
``rich``, ``patchelf``, ``typing-extensions``) and to widen the ``numpy``
floor so Blender 4.2 LTS (numpy 1.26) is covered alongside Blender 5.0
(numpy 2.x). The compiled ``_mmgpy.so`` and every Python module in the
wheel are left untouched — this is a METADATA-only strip.

The PyPI ``mmgpy`` wheel keeps its full ``Requires-Dist``; only the copy
that ends up inside the Blender extension zip is rewritten.

Usage::

    python .github/scripts/strip_blender_wheel_metadata.py path/to/mmgpy-X.whl
"""

from __future__ import annotations

import argparse
import base64
import hashlib
import re
import shutil
import sys
import tempfile
import zipfile
from pathlib import Path

# Hard-coded by design: this script encodes the Blender add-on's contract
# with mmgpy, not a general-purpose wheel surgery tool.
STRIP_DEPS: frozenset[str] = frozenset(
    {"pyvista", "scipy", "rich", "patchelf", "typing-extensions"},
)
# Blender 4.2 LTS ships numpy 1.26.x; Blender 5.0 ships numpy 2.x.
# mmgpy's compiled extension is built against numpy's stable ABI so both
# work at runtime; the bundled METADATA just needs to advertise that.
NUMPY_REQUIREMENT = "numpy>=1.26,<3"


def _normalize(name: str) -> str:
    """Lower-case + dash-canonicalise a PEP 503 distribution name."""
    return re.sub(r"[-_.]+", "-", name).lower()


def _b64_sha256(data: bytes) -> str:
    """Format a sha256 digest as ``sha256=<urlsafe_b64 no padding>``."""
    digest = hashlib.sha256(data).digest()
    return "sha256=" + base64.urlsafe_b64encode(digest).rstrip(b"=").decode()


def rewrite_metadata(text: str) -> str:
    """Return ``text`` with stripped ``Requires-Dist`` lines and a loose numpy.

    Lines are matched on the leading PEP 503-normalised distribution name;
    environment markers and version specifiers on the right-hand side are
    not parsed. The ``numpy`` line (if present) is replaced wholesale with
    ``NUMPY_REQUIREMENT``; other lines in ``STRIP_DEPS`` are removed.
    """
    out: list[str] = []
    saw_numpy = False
    for line in text.splitlines(keepends=True):
        match = re.match(r"^Requires-Dist:\s*([A-Za-z0-9_.\-]+)", line)
        if match is None:
            out.append(line)
            continue
        pkg = _normalize(match.group(1))
        if pkg in STRIP_DEPS:
            continue
        if pkg == "numpy":
            saw_numpy = True
            out.append(f"Requires-Dist: {NUMPY_REQUIREMENT}\n")
            continue
        out.append(line)

    if not saw_numpy:
        msg = (
            "no Requires-Dist: numpy line found in METADATA; refusing to "
            "produce a wheel that does not declare its numpy dependency"
        )
        raise SystemExit(msg)
    return "".join(out)


def rewrite_record(
    record_text: str,
    metadata_path_in_record: str,
    new_metadata: bytes,
) -> str:
    """Return ``record_text`` with the METADATA line updated to match ``new_metadata``.

    ``RECORD`` is comma-separated ``path,hash,size`` per line; the line for
    ``RECORD`` itself has empty hash and size by convention and is left
    alone.
    """
    new_hash = _b64_sha256(new_metadata)
    new_size = str(len(new_metadata))

    updated = False
    out_lines: list[str] = []
    for line in record_text.splitlines():
        parts = line.split(",")
        # Tolerate a literal comma in any field by reassembling on the
        # known structure: path is everything before the last two commas.
        if len(parts) >= 3 and parts[0] == metadata_path_in_record:
            out_lines.append(f"{metadata_path_in_record},{new_hash},{new_size}")
            updated = True
        else:
            out_lines.append(line)

    if not updated:
        msg = f"RECORD has no entry for {metadata_path_in_record!r}"
        raise SystemExit(msg)
    return "\n".join(out_lines) + "\n"


def strip_wheel(wheel_path: Path) -> None:
    """Rewrite ``wheel_path`` in place so its METADATA matches the slim contract."""
    if not wheel_path.is_file() or wheel_path.suffix != ".whl":
        msg = f"not a wheel file: {wheel_path}"
        raise SystemExit(msg)

    with tempfile.TemporaryDirectory() as tmp:
        work = Path(tmp)
        with zipfile.ZipFile(wheel_path) as zf:
            zf.extractall(work)

        dist_info_dirs = [p for p in work.iterdir() if p.name.endswith(".dist-info")]
        if len(dist_info_dirs) != 1:
            msg = f"expected exactly one *.dist-info dir, found {dist_info_dirs}"
            raise SystemExit(msg)
        dist_info = dist_info_dirs[0]

        metadata_path = dist_info / "METADATA"
        record_path = dist_info / "RECORD"
        if not metadata_path.exists() or not record_path.exists():
            msg = "wheel is missing METADATA or RECORD"
            raise SystemExit(msg)

        original_metadata = metadata_path.read_text(encoding="utf-8")
        rewritten_metadata = rewrite_metadata(original_metadata)
        metadata_bytes = rewritten_metadata.encode("utf-8")
        metadata_path.write_bytes(metadata_bytes)

        metadata_record_key = f"{dist_info.name}/METADATA"
        rewritten_record = rewrite_record(
            record_path.read_text(encoding="utf-8"),
            metadata_record_key,
            metadata_bytes,
        )
        record_path.write_text(rewritten_record, encoding="utf-8")

        tmp_wheel = wheel_path.with_suffix(".whl.tmp")
        with zipfile.ZipFile(tmp_wheel, "w", zipfile.ZIP_DEFLATED) as zf:
            for path in sorted(work.rglob("*")):
                if path.is_file():
                    zf.write(path, path.relative_to(work).as_posix())
        shutil.move(tmp_wheel, wheel_path)


def main(argv: list[str] | None = None) -> int:
    """Parse ``argv`` and rewrite the requested wheel; return the exit code."""
    parser = argparse.ArgumentParser(
        description=(
            "Rewrite an mmgpy wheel's METADATA to the slim contract used "
            "by the Blender extension bundle (drop pyvista/scipy/rich, "
            "loosen numpy)."
        ),
    )
    parser.add_argument(
        "wheel",
        type=Path,
        help="Path to the mmgpy .whl to rewrite in place.",
    )
    args = parser.parse_args(argv)

    strip_wheel(args.wheel)
    sys.stdout.write(f"Rewrote {args.wheel}\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
