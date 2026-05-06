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

This example uses an analytic field with a sharp circular front,
``f(x, y) = tanh(40 * (sqrt((x-0.5)^2 + (y-0.5)^2) - 0.3))``, computes the
Hessian on the initial mesh, and runs anisotropic remeshing so the new
mesh refines along the front and stays coarse elsewhere. The script
writes ``hessian_adaptation.png`` next to itself.
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


def _unique_edges(triangles: np.ndarray) -> np.ndarray:
    pairs = np.concatenate(
        [triangles[:, [0, 1]], triangles[:, [1, 2]], triangles[:, [2, 0]]],
    )
    pairs.sort(axis=1)
    return np.unique(pairs, axis=0)


def _colored_edges(
    vertices: np.ndarray,
    triangles: np.ndarray,
    field: np.ndarray,
    *,
    cmap: str,
    vmin: float,
    vmax: float,
    linewidth: float = 0.9,
) -> LineCollection:
    """Edge segments coloured by the average of their endpoints' field values."""
    edges = _unique_edges(triangles)
    segments = vertices[edges]
    values = 0.5 * (field[edges[:, 0]] + field[edges[:, 1]])
    return LineCollection(
        segments,
        array=values,
        cmap=cmap,
        norm=plt.Normalize(vmin=vmin, vmax=vmax),
        linewidth=linewidth,
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
    font = ImageFont.truetype(
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        size=font_size,
    )
    for i, text in enumerate(labels):
        cx = width * (i + 0.5) / n
        cy = header_h / 2
        bbox = draw.textbbox((cx, cy), text, font=font, anchor="mm")
        pad_x, pad_y = 16, 8
        pill = (
            bbox[0] - pad_x,
            bbox[1] - pad_y,
            bbox[2] + pad_x,
            bbox[3] + pad_y,
        )
        radius = (pill[3] - pill[1]) // 2
        draw.rounded_rectangle(pill, radius=radius, fill=(22, 28, 34, 220))
        draw.text((cx, cy), text, fill=(244, 246, 248, 255), font=font, anchor="mm")
    return canvas


def main() -> None:
    """Build a uniform mesh, recover the Hessian, and remesh adaptively."""
    vertices, triangles = make_unit_square(n=30)
    field = front_field(vertices)

    hessian = compute_hessian(vertices, triangles, field)
    metric = create_metric_from_hessian(
        hessian,
        target_error=5e-3,
        hmin=3e-3,
        hmax=0.08,
    )

    pv_mesh = polydata_from_2d_triangles(vertices, triangles)
    pv_mesh.point_data["solution"] = field
    pv_mesh.point_data["metric"] = metric

    adapted = pv_mesh.mmg.remesh(hgrad=2.0, verbose=False)
    adapted_pts = np.asarray(adapted.points[:, :2])
    adapted_tris = adapted.regular_faces
    adapted_field = front_field(adapted_pts)

    print(
        f"Initial: {len(vertices)} vertices, {len(triangles)} triangles\n"
        f"Adapted: {adapted.n_points} vertices, {len(adapted_tris)} triangles",
    )

    vmin, vmax = float(field.min()), float(field.max())
    cmap = "RdBu_r"

    fig, axes = plt.subplots(1, 2, figsize=(11, 5.2))
    fig.patch.set_alpha(0.0)
    for ax in axes:
        ax.set_aspect("equal")
        ax.set_xlim(0.0, 1.0)
        ax.set_ylim(0.0, 1.0)
        ax.set_axis_off()
        ax.patch.set_alpha(0.0)

    axes[0].add_collection(
        _colored_edges(vertices, triangles, field, cmap=cmap, vmin=vmin, vmax=vmax),
    )
    axes[1].add_collection(
        _colored_edges(
            adapted_pts,
            adapted_tris,
            adapted_field,
            cmap=cmap,
            vmin=vmin,
            vmax=vmax,
            linewidth=0.7,
        ),
    )

    fig.tight_layout()
    out_path = Path(__file__).with_suffix(".png")

    buffer = io.BytesIO()
    fig.savefig(buffer, format="png", dpi=140, bbox_inches="tight", transparent=True)
    plt.close(fig)
    buffer.seek(0)
    rendered = Image.open(buffer).convert("RGBA")

    labelled = _add_pill_labels(
        rendered,
        labels=[
            f"Uniform mesh ({len(vertices)} vertices)",
            f"Hessian-adapted mesh ({adapted.n_points} vertices)",
        ],
    )
    labelled.save(out_path, format="PNG")
    print(f"Wrote {out_path}")


if __name__ == "__main__":
    main()
