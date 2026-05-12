# /// script
# requires-python = ">=3.10"
# dependencies = [
#     "mmgpy",
#     "matplotlib",
#     "numpy",
#     "pillow",
# ]
#
# [tool.uv.sources]
# mmgpy = { path = "../.." }
# ///
"""Solution-adaptive 2D remeshing via patch-based Hessian recovery.

Given a scalar field defined on a mesh, ``mmgpy.metrics.compute_hessian``
recovers the Hessian by least-squares on a patch around each vertex, and
``create_metric_from_hessian`` turns the Hessian into an anisotropic
metric that MMG can use for adaptive remeshing.

The script adapts a uniform mesh to a sharp circular front,
``f(x, y) = tanh(40 * (sqrt((x-0.5)^2 + (y-0.5)^2) - 0.3))``, then
recovers the mesh-implied metric tensor of the adapted mesh via
``build_size_map(aniso=True)`` and rescales it by ``c in {1/4, 4}``.
Multiplying the metric by ``c`` rescales target edge lengths by
``1/sqrt(c)`` (``c > 1`` refines, ``c < 1`` coarsens) while preserving
the front-aligned anisotropy.

Writes ``hessian_adaptation.png`` next to itself.
"""

from __future__ import annotations

import io
from pathlib import Path

import matplotlib.pyplot as plt
import matplotlib.tri as mtri
import numpy as np
from matplotlib.collections import LineCollection
from PIL import Image, ImageDraw, ImageFont

import mmgpy  # noqa: F401  -- registers the .mmg accessor
from mmgpy import polydata_from_2d_triangles
from mmgpy.metrics import compute_hessian, create_metric_from_hessian

Panel = tuple[str, np.ndarray, np.ndarray]


# ---------------------------------------------------------------------------
# Mesh processing
# ---------------------------------------------------------------------------


def make_unit_square(n: int = 30) -> tuple[np.ndarray, np.ndarray]:
    """Structured triangulation of [0, 1]^2 with n x n vertices."""
    grid = np.linspace(0.0, 1.0, n)
    xx, yy = np.meshgrid(grid, grid)
    vertices = np.column_stack([xx.ravel(), yy.ravel()]).astype(np.float64)
    triangles = mtri.Triangulation(vertices[:, 0], vertices[:, 1]).triangles
    return vertices, triangles.astype(np.int32)


def front_field(vertices: np.ndarray) -> np.ndarray:
    """Analytic field with a thin transition along a circle of radius 0.3."""
    dx = vertices[:, 0] - 0.5
    dy = vertices[:, 1] - 0.5
    r = np.sqrt(dx * dx + dy * dy)
    return np.tanh(40.0 * (r - 0.3))


def build_panels() -> list[Panel]:
    """Adapt to the front, then rescale the implied metric."""
    base_v, base_t = make_unit_square(n=30)

    # Hessian-adapt to the front.
    hessian = compute_hessian(base_v, base_t, front_field(base_v))
    metric = create_metric_from_hessian(
        hessian,
        target_error=5e-3,
        hmin=3e-3,
        hmax=0.08,
    )
    pv_mesh = polydata_from_2d_triangles(base_v, base_t)
    pv_mesh.point_data["metric"] = metric
    adapted = pv_mesh.mmg.remesh(hgrad=2.0, verbose=False)
    src_v = np.asarray(adapted.points[:, :2])
    src_t = adapted.regular_faces

    # Recover the adapted mesh's implied metric and remesh at rescaled versions.
    src_pv = polydata_from_2d_triangles(src_v, src_t)
    implied = src_pv.mmg.build_size_map(aniso=True)
    scaled: list[Panel] = []
    for c in (0.25, 4.0):
        grid_pv = polydata_from_2d_triangles(src_v, src_t)
        grid_pv.point_data["metric"] = implied * c
        out = grid_pv.mmg.remesh(hgrad=2.0, verbose=False)
        scaled.append(
            (f"Implied x {c}", np.asarray(out.points[:, :2]), out.regular_faces),
        )

    return [
        ("Uniform", base_v, base_t),
        ("Hessian-adapted", src_v, src_t),
        *scaled,
    ]


# ---------------------------------------------------------------------------
# Visualization
# ---------------------------------------------------------------------------


def _colored_edges(
    vertices: np.ndarray,
    triangles: np.ndarray,
    field: np.ndarray,
) -> LineCollection:
    """Edge segments coloured by the mean of their endpoints' field values."""
    pairs = np.concatenate(
        [triangles[:, [0, 1]], triangles[:, [1, 2]], triangles[:, [2, 0]]],
    )
    pairs.sort(axis=1)
    edges = np.unique(pairs, axis=0)
    return LineCollection(
        vertices[edges],
        array=0.5 * (field[edges[:, 0]] + field[edges[:, 1]]),
        cmap="RdBu_r",
        norm=plt.Normalize(vmin=-1.0, vmax=1.0),
        linewidth=0.7,
    )


def _add_pill_labels(
    rendered: Image.Image,
    labels: list[str],
    *,
    header_h: int = 56,
    font_size: int = 20,
) -> Image.Image:
    """Composite translucent pill labels above ``rendered`` (one per panel)."""
    n = len(labels)
    width, height = rendered.size
    canvas = Image.new("RGBA", (width, height + header_h), (0, 0, 0, 0))
    canvas.paste(rendered, (0, header_h), rendered)

    draw = ImageDraw.Draw(canvas, "RGBA")
    font = ImageFont.load_default(size=font_size)
    for i, text in enumerate(labels):
        cx = width * (i + 0.5) / n
        cy = header_h / 2
        bbox = draw.textbbox((cx, cy), text, font=font, anchor="mm")
        pad_x, pad_y = 16, 8
        pill = (bbox[0] - pad_x, bbox[1] - pad_y, bbox[2] + pad_x, bbox[3] + pad_y)
        radius = (pill[3] - pill[1]) // 2
        draw.rounded_rectangle(pill, radius=radius, fill=(22, 28, 34, 220))
        draw.text((cx, cy), text, fill=(244, 246, 248, 255), font=font, anchor="mm")
    return canvas


def render(panels: list[Panel], out_path: Path) -> None:
    """Render ``panels`` as a horizontal strip and save to ``out_path``."""
    fig, axes = plt.subplots(1, len(panels), figsize=(4.0 * len(panels), 4.2))
    fig.patch.set_alpha(0.0)
    for ax, (_, v, t) in zip(axes, panels, strict=True):
        ax.set_aspect("equal")
        ax.set_xlim(0.0, 1.0)
        ax.set_ylim(0.0, 1.0)
        ax.set_axis_off()
        ax.patch.set_alpha(0.0)
        ax.add_collection(_colored_edges(v, t, front_field(v)))
    fig.tight_layout()

    buffer = io.BytesIO()
    fig.savefig(buffer, format="png", dpi=140, bbox_inches="tight", transparent=True)
    plt.close(fig)
    buffer.seek(0)
    rendered = Image.open(buffer).convert("RGBA")

    labels = [f"{name}  ({len(v)} v, {len(t)} t)" for name, v, t in panels]
    _add_pill_labels(rendered, labels=labels).save(out_path, format="PNG")


def main() -> None:
    """Build the mesh panels and render them to a PNG next to this script."""
    panels = build_panels()
    for name, v, t in panels:
        print(f"{name:>20s}: {len(v):>6d} verts, {len(t):>6d} triangles")

    out_path = Path(__file__).with_suffix(".png")
    render(panels, out_path)
    print(f"Wrote {out_path}")


if __name__ == "__main__":
    main()
