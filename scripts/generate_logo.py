# SPDX-FileCopyrightText: 2026 Kevin Marchais
# SPDX-License-Identifier: GPL-3.0-or-later
"""Generate the mmgpy wireframe-icosphere logo as an SVG.

The logo is a front-facing icosphere with a density gradient: the upper
hemisphere is subdivided more times than the lower one, so the
triangulation visibly densifies from bottom to top. This says
"remeshing" without copying MMG's panda mark.

Run::

    uv run --no-project python scripts/generate_logo.py

Output: ``assets/mmgpy-logo.svg`` (256x256, viewBox-driven so it
scales without re-running).
"""

from __future__ import annotations

import math
from collections.abc import Callable
from pathlib import Path

Vec3 = tuple[float, float, float]
Face = tuple[int, int, int]
Predicate = Callable[[Face, list[Vec3]], bool]

PHI = (1 + math.sqrt(5)) / 2
SIZE = 256
MARGIN = 16
RADIUS = (SIZE - 2 * MARGIN) / 2
CENTER = SIZE / 2

# Blender's UI accent orange. Mid-saturation, mid-lightness, so it stays
# legible against both white and Blender's near-black panel background.
STROKE = "#E87D0D"
DISC_FILL = "none"
DISC_STROKE = STROKE


def normalize(v: Vec3) -> Vec3:
    """Project a 3D vector onto the unit sphere."""
    n = math.sqrt(sum(x * x for x in v))
    return (v[0] / n, v[1] / n, v[2] / n)


def midpoint(
    v1: Vec3,
    v2: Vec3,
) -> Vec3:
    """Spherical midpoint of two unit-sphere points."""
    return normalize(((v1[0] + v2[0]) / 2, (v1[1] + v2[1]) / 2, (v1[2] + v2[2]) / 2))


def make_icosahedron() -> tuple[
    list[Vec3],
    list[Face],
]:
    """Return the 12 vertices and 20 faces of a unit icosahedron."""
    verts = [
        normalize((-1, PHI, 0)),
        normalize((1, PHI, 0)),
        normalize((-1, -PHI, 0)),
        normalize((1, -PHI, 0)),
        normalize((0, -1, PHI)),
        normalize((0, 1, PHI)),
        normalize((0, -1, -PHI)),
        normalize((0, 1, -PHI)),
        normalize((PHI, 0, -1)),
        normalize((PHI, 0, 1)),
        normalize((-PHI, 0, -1)),
        normalize((-PHI, 0, 1)),
    ]
    faces = [
        (0, 11, 5),
        (0, 5, 1),
        (0, 1, 7),
        (0, 7, 10),
        (0, 10, 11),
        (1, 5, 9),
        (5, 11, 4),
        (11, 10, 2),
        (10, 7, 6),
        (7, 1, 8),
        (3, 9, 4),
        (3, 4, 2),
        (3, 2, 6),
        (3, 6, 8),
        (3, 8, 9),
        (4, 9, 5),
        (2, 4, 11),
        (6, 2, 10),
        (8, 6, 7),
        (9, 8, 1),
    ]
    return verts, faces


def subdivide_selected(
    faces: list[Face],
    verts: list[Vec3],
    predicate: Predicate,
) -> list[Face]:
    """Subdivide each face matching ``predicate`` into 4 sub-faces.

    Vertices are appended to ``verts`` in place; the midpoint cache is
    local to one call (so T-junctions can appear between selectively
    subdivided neighbours — acceptable at logo scale).
    """
    cache: dict[tuple[int, int], int] = {}

    def mid(i: int, j: int) -> int:
        key = (min(i, j), max(i, j))
        if key not in cache:
            cache[key] = len(verts)
            verts.append(midpoint(verts[i], verts[j]))
        return cache[key]

    result: list[Face] = []
    for a, b, c in faces:
        if predicate((a, b, c), verts):
            ab, bc, ca = mid(a, b), mid(b, c), mid(c, a)
            result.extend(
                [(a, ab, ca), (b, bc, ab), (c, ca, bc), (ab, bc, ca)],
            )
        else:
            result.append((a, b, c))
    return result


def face_center_y(
    face: Face,
    verts: list[Vec3],
) -> float:
    """Average y of the three vertices of ``face``."""
    return sum(verts[i][1] for i in face) / 3


def face_normal_z(
    face: Face,
    verts: list[Vec3],
) -> float:
    """Z component of the face normal (positive == front-facing)."""
    a, b, c = (verts[i] for i in face)
    ux, uy = b[0] - a[0], b[1] - a[1]
    vx, vy = c[0] - a[0], c[1] - a[1]
    return ux * vy - uy * vx


def project(v: Vec3) -> tuple[float, float]:
    """Orthographic projection onto the SVG plane (y flipped)."""
    return (CENTER + v[0] * RADIUS, CENTER - v[1] * RADIUS)


def build_mesh() -> tuple[
    list[Vec3],
    list[Face],
]:
    """Build the icosphere with a top-heavy density gradient."""
    verts, faces = make_icosahedron()
    # Always subdivide once so the bottom hemisphere is at least 4x base.
    faces = subdivide_selected(faces, verts, lambda _f, _v: True)
    # Upper hemisphere: one more level (16x base).
    faces = subdivide_selected(faces, verts, lambda f, v: face_center_y(f, v) > 0)
    # Top cap: one more level still (64x base).
    faces = subdivide_selected(faces, verts, lambda f, v: face_center_y(f, v) > 0.55)
    return verts, faces


def render(verts: list[Vec3], faces: list[Face]) -> str:
    """Render visible (front-facing) faces as an SVG wireframe."""
    visible = sorted(
        (f for f in faces if face_normal_z(f, verts) > 0),
        key=lambda f: -sum(verts[i][2] for i in f) / 3,  # back-to-front draw
    )
    projected = [project(v) for v in verts]

    svg_open = (
        f'<svg xmlns="http://www.w3.org/2000/svg" '
        f'viewBox="0 0 {SIZE} {SIZE}" width="{SIZE}" height="{SIZE}">'
    )
    disc = (
        f'  <circle cx="{CENTER}" cy="{CENTER}" r="{RADIUS}" '
        f'fill="{DISC_FILL}" stroke="{DISC_STROKE}" stroke-width="2"/>'
    )
    lines = [svg_open, disc]
    for face in visible:
        pts = " ".join(f"{projected[i][0]:.2f},{projected[i][1]:.2f}" for i in face)
        lines.append(
            f'  <polygon points="{pts}" fill="none" stroke="{STROKE}" '
            f'stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round"/>',
        )
    lines.append("</svg>")
    return "\n".join(lines) + "\n"


def main() -> None:
    """Generate the SVG and write it to ``assets/mmgpy-logo.svg``."""
    verts, faces = build_mesh()
    svg = render(verts, faces)
    out = Path(__file__).resolve().parent.parent / "assets" / "mmgpy-logo.svg"
    out.write_text(svg, encoding="utf-8")
    visible = sum(1 for f in faces if face_normal_z(f, verts) > 0)
    print(f"Wrote {out} ({visible} visible triangles, {len(faces)} total)")


if __name__ == "__main__":
    main()
