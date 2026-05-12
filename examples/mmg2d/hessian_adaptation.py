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
``f(x, y) = tanh(40 * (sqrt((x-0.5)^2 + (y-0.5)^2) - 0.3))``, and
proceeds in two phases:

1. **Adapt.** Recover the Hessian on the initial uniform mesh and run
   anisotropic remeshing so the new mesh refines along the front and
   stays coarse elsewhere.
2. **Refinement family.** Recover the mesh-implied metric tensor from
   the adapted mesh via ``build_size_map(aniso=True)`` and rescale it
   by factors ``c in {1/4, 4}``. Multiplying the metric by ``c``
   rescales target edge lengths by ``1/sqrt(c)``, producing coarser
   and finer variants that *preserve* the front-aligned anisotropy
   (issue #255).

The script writes ``hessian_adaptation.png`` next to itself.
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
    linewidth: float = 0.7,
) -> LineCollection:
    """Edge segments coloured by the mean of their endpoints' field values."""
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
    font = ImageFont.load_default(size=font_size)
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


def adapt_to_field(
    vertices: np.ndarray,
    triangles: np.ndarray,
) -> tuple[np.ndarray, np.ndarray]:
    """Hessian-recover a metric from the front field and remesh."""
    field = front_field(vertices)
    hessian = compute_hessian(vertices, triangles, field)
    metric = create_metric_from_hessian(
        hessian,
        target_error=5e-3,
        hmin=3e-3,
        hmax=0.08,
    )
    pv_mesh = polydata_from_2d_triangles(vertices, triangles)
    pv_mesh.point_data["metric"] = metric
    adapted = pv_mesh.mmg.remesh(hgrad=2.0, verbose=False)
    return np.asarray(adapted.points[:, :2]), adapted.regular_faces


def remesh_with_scaled_metric(
    vertices: np.ndarray,
    triangles: np.ndarray,
    metric: np.ndarray,
    factor: float,
) -> tuple[np.ndarray, np.ndarray]:
    """Scale a recovered metric tensor and remesh the same source mesh."""
    pv_mesh = polydata_from_2d_triangles(vertices, triangles)
    pv_mesh.point_data["metric"] = metric * factor
    grid = pv_mesh.mmg.remesh(hgrad=2.0, verbose=False)
    return np.asarray(grid.points[:, :2]), grid.regular_faces


def main() -> None:
    """Adapt to the front, then build a refinement family by rescaling."""
    base_vertices, base_triangles = make_unit_square(n=30)
    print(
        f"Uniform base:        {len(base_vertices):>6d} verts, "
        f"{len(base_triangles):>6d} triangles",
    )

    src_vertices, src_triangles = adapt_to_field(base_vertices, base_triangles)
    print(
        f"Hessian-adapted src: {len(src_vertices):>6d} verts, "
        f"{len(src_triangles):>6d} triangles",
    )

    # Recover the source's mesh-implied anisotropic metric tensor.
    src_pv = polydata_from_2d_triangles(src_vertices, src_triangles)
    src_metric = src_pv.mmg.build_size_map(aniso=True)

    factors = (0.25, 4.0)
    family: list[tuple[float, np.ndarray, np.ndarray]] = []
    for c in factors:
        v, t = remesh_with_scaled_metric(src_vertices, src_triangles, src_metric, c)
        family.append((c, v, t))
    print()
    for c, v, t in family:
        print(
            f"  implied metric x {c:<5.2g}  ->  {len(v):>6d} verts, "
            f"{len(t):>6d} triangles",
        )

    panels: list[tuple[str, np.ndarray, np.ndarray]] = [
        ("Uniform base", base_vertices, base_triangles),
        ("Hessian-adapted source", src_vertices, src_triangles),
        *[(f"Implied metric x {c}", v, t) for c, v, t in family],
    ]

    cmap = "RdBu_r"
    vmin, vmax = -1.0, 1.0

    fig, axes = plt.subplots(1, len(panels), figsize=(4.0 * len(panels), 4.2))
    fig.patch.set_alpha(0.0)
    for ax, (_, v, t) in zip(axes, panels, strict=True):
        ax.set_aspect("equal")
        ax.set_xlim(0.0, 1.0)
        ax.set_ylim(0.0, 1.0)
        ax.set_axis_off()
        ax.patch.set_alpha(0.0)
        ax.add_collection(
            _colored_edges(v, t, front_field(v), cmap=cmap, vmin=vmin, vmax=vmax),
        )

    fig.tight_layout()

    buffer = io.BytesIO()
    fig.savefig(buffer, format="png", dpi=140, bbox_inches="tight", transparent=True)
    plt.close(fig)
    buffer.seek(0)
    rendered = Image.open(buffer).convert("RGBA")

    labels = [f"{name}  ({len(v)} v, {len(t)} t)" for name, v, t in panels]
    labelled = _add_pill_labels(rendered, labels=labels)

    out_path = Path(__file__).with_suffix(".png")
    labelled.save(out_path, format="PNG")
    print(f"\nWrote {out_path}")


if __name__ == "__main__":
    main()
