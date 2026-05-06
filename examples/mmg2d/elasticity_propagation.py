# /// script
# requires-python = ">=3.10"
# dependencies = [
#     "mmgpy[fem]",
#     "matplotlib",
#     "numpy",
#     "scipy",
# ]
#
# [tool.uv.sources]
# mmgpy = { path = "../.." }
# ///
"""Animate Laplacian vs elasticity propagation on an L-bracket.

The geometry is a classic cantilever L-bracket: a vertical post sharing
its base with a horizontal foot. The free tip of the foot is pinned and
the top of the post is pulled upward. The prescribed boundary
displacement is propagated to the interior using two methods:

* ``"laplacian"``: solves a Laplace equation on the mesh graph (default,
  no extra dependency).
* ``"elasticity"``: solves a linear elasticity problem on the mesh via
  the optional ``fedoo`` backend.

For a cantilever, Laplacian smoothing has no notion of bending: it
linearly interpolates the prescribed-displacement values along graph
distances. Linear elasticity, in contrast, captures the bending
kinematics and the stress concentration at the re-entrant corner.

The script writes ``elasticity_propagation.gif`` next to itself.
``fedoo`` is required for the elasticity panel, hence the
``mmgpy[fem]`` extra.
"""

from __future__ import annotations

import tempfile
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy.spatial import Delaunay

import mmgpy  # noqa: F401  -- registers the .mmg accessor
from mmgpy import polydata_from_2d_triangles
from mmgpy.lagrangian import (
    propagate_displacement,
    propagate_displacement_elasticity,
)

# L geometry: foot is [0, FOOT_LEN] x [0, ARM_W], post is [0, ARM_W] x [0, POST_LEN].
FOOT_LEN = 1.4
POST_LEN = 1.0
ARM_W = 0.3
LIFT = 0.45  # vertical displacement applied to the free tip of the foot.


def _interp(a: np.ndarray, b: np.ndarray, n: int) -> np.ndarray:
    return np.column_stack(
        [
            np.linspace(a[0], b[0], n, endpoint=False),
            np.linspace(a[1], b[1], n, endpoint=False),
        ],
    )


def make_l_bracket(
    target_h: float = 0.045,
) -> tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    """Triangulated L-bracket, remeshed by MMG.

    Returns ``(vertices, triangles, fixed_mask, loaded_mask)``.
    ``fixed_mask`` flags vertices on the post's left edge (clamp);
    ``loaded_mask`` flags vertices on the foot's free tip (loaded face).
    """
    corners = [
        np.array([0.0, 0.0]),
        np.array([FOOT_LEN, 0.0]),
        np.array([FOOT_LEN, ARM_W]),
        np.array([ARM_W, ARM_W]),
        np.array([ARM_W, POST_LEN]),
        np.array([0.0, POST_LEN]),
    ]

    edges = []
    for a, b in zip(corners, [*corners[1:], corners[0]], strict=True):
        n_seg = max(2, round(np.linalg.norm(b - a) / target_h))
        edges.append(_interp(a, b, n_seg))
    seed = np.vstack(edges).astype(np.float64)

    tri = Delaunay(seed)
    cx, cy = seed[tri.simplices].mean(axis=1).T
    in_foot = (cx >= 0.0) & (cx <= FOOT_LEN) & (cy >= 0.0) & (cy <= ARM_W)
    in_post = (cx >= 0.0) & (cx <= ARM_W) & (cy >= 0.0) & (cy <= POST_LEN)
    triangles = tri.simplices[in_foot | in_post].astype(np.int32)

    pv_mesh = polydata_from_2d_triangles(seed, triangles)
    remeshed = pv_mesh.mmg.remesh(
        hmax=target_h,
        hmin=target_h * 0.4,
        verbose=False,
    )

    vertices = np.asarray(remeshed.points[:, :2], dtype=np.float64)
    triangles = np.asarray(remeshed.regular_faces, dtype=np.int32)

    fixed_mask = np.isclose(vertices[:, 0], FOOT_LEN)
    loaded_mask = np.isclose(vertices[:, 1], POST_LEN) & (
        vertices[:, 0] <= ARM_W + 1e-9
    )
    return vertices, triangles, fixed_mask, loaded_mask


def lift_displacement(
    vertices: np.ndarray,
    *,
    fixed_mask: np.ndarray,
    loaded_mask: np.ndarray,
    lift: float,
) -> tuple[np.ndarray, np.ndarray]:
    """Pin the foot's free tip, push the post's top up by ``lift``."""
    boundary = fixed_mask | loaded_mask
    disp = np.zeros_like(vertices)
    disp[loaded_mask, 1] = lift
    return disp, boundary


def main() -> None:  # noqa: C901
    """Compute both propagated displacement fields and save an animated GIF."""
    vertices, triangles, fixed_mask, loaded_mask = make_l_bracket()
    print(f"Mesh: {len(vertices)} vertices, {len(triangles)} triangles")

    bdy_disp, boundary = lift_displacement(
        vertices,
        fixed_mask=fixed_mask,
        loaded_mask=loaded_mask,
        lift=LIFT,
    )

    full_lap = propagate_displacement(vertices, triangles, boundary, bdy_disp)
    try:
        full_ela = propagate_displacement_elasticity(
            vertices,
            triangles,
            boundary,
            bdy_disp,
            nu=0.3,
        )
        ela_available = True
    except ImportError as exc:
        print(f"Elasticity propagation unavailable ({exc}); right panels will skip.")
        full_ela = np.zeros_like(full_lap)
        ela_available = False

    mag_lap = np.linalg.norm(full_lap, axis=1)
    mag_ela = np.linalg.norm(full_ela, axis=1) if ela_available else mag_lap
    vmax = float(max(mag_lap.max(), mag_ela.max()))

    n_frames = 60
    phase = np.linspace(0.0, 2.0 * np.pi, n_frames, endpoint=False)
    ts = 0.5 * (1.0 - np.cos(phase))

    fig, axes = plt.subplots(1, 2, figsize=(11, 5.5))
    # Transparent figure + axes so the GIF reads on light or dark themes
    # once it's quantised below. Labels are added by PIL post-render so
    # they're readable on either background.
    fig.patch.set_alpha(0.0)
    panel_labels = ["Laplacian propagation", "Elasticity propagation (fedoo)"]
    for ax in axes:
        ax.patch.set_alpha(0.0)
        ax.set_aspect("equal")
        ax.set_xlim(-0.1, FOOT_LEN + 0.1)
        ax.set_ylim(-0.05, POST_LEN + LIFT + 0.1)
        ax.set_xticks([])
        ax.set_yticks([])
        for spine in ax.spines.values():
            spine.set_visible(False)
    if not ela_available:
        axes[1].text(
            0.5,
            0.5,
            "fedoo not installed\n(uv add fedoo)",
            ha="center",
            va="center",
            transform=axes[1].transAxes,
        )

    font = ImageFont.truetype(
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        size=20,
    )

    def add_pill_labels(rendered: Image.Image) -> Image.Image:
        """Composite translucent pill labels at the top of each panel."""
        header_h = 56
        width, height = rendered.size
        canvas = Image.new("RGBA", (width, height + header_h), (0, 0, 0, 0))
        canvas.paste(rendered, (0, header_h), rendered)
        draw = ImageDraw.Draw(canvas, "RGBA")
        for i, text in enumerate(panel_labels):
            cx = width * (i + 0.5) / len(panel_labels)
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
            draw.text(
                (cx, cy),
                text,
                fill=(244, 246, 248, 255),
                font=font,
                anchor="mm",
            )
        return canvas

    def render_panel(
        ax: plt.Axes,
        points: np.ndarray,
        magnitude: np.ndarray,
        max_mag: float,
        cmap: str,
    ) -> None:
        for coll in list(ax.collections):
            coll.remove()
        for line in list(ax.lines):
            line.remove()
        ax.tripcolor(
            points[:, 0],
            points[:, 1],
            triangles,
            magnitude,
            cmap=cmap,
            shading="gouraud",
            vmin=0.0,
            vmax=max_mag,
        )
        ax.triplot(
            points[:, 0],
            points[:, 1],
            triangles,
            color="0.15",
            linewidth=0.25,
            alpha=0.6,
        )

    out_path = Path(__file__).with_suffix(".gif")
    # Render each frame to a transparent PNG, then assemble into a GIF
    # whose palette reserves one slot for fully transparent pixels. Goes
    # through PIL because matplotlib's own PillowWriter bakes in the
    # figure facecolour and ignores per-frame alpha.
    with tempfile.TemporaryDirectory(prefix="mmg2d_anim_") as tmp:
        tmp_dir = Path(tmp)
        for i, t in enumerate(ts):
            render_panel(axes[0], vertices + t * full_lap, t * mag_lap, vmax, "viridis")
            if ela_available:
                render_panel(
                    axes[1],
                    vertices + t * full_ela,
                    t * mag_ela,
                    vmax,
                    "viridis",
                )
            fig.savefig(
                tmp_dir / f"frame_{i:03d}.png",
                dpi=110,
                transparent=True,
                bbox_inches="tight",
            )

        paths = sorted(tmp_dir.glob("frame_*.png"))
        labelled = [add_pill_labels(Image.open(p).convert("RGBA")) for p in paths]
        ref = (
            labelled[len(labelled) // 2]
            .convert("RGB")
            .quantize(
                colors=255,
                method=Image.Quantize.MEDIANCUT,
                dither=Image.Dither.NONE,
            )
        )
        gif_frames: list[Image.Image] = []
        for rgba in labelled:
            alpha = rgba.split()[-1]
            quant = rgba.convert("RGB").quantize(
                palette=ref,
                dither=Image.Dither.NONE,
            )
            quant.paste(255, mask=alpha.point(lambda v: 255 if v < 128 else 0))
            quant.info["transparency"] = 255
            gif_frames.append(quant)
        gif_frames[0].save(
            out_path,
            save_all=True,
            append_images=gif_frames[1:],
            duration=40,
            loop=0,
            disposal=2,
            transparency=255,
            optimize=True,
        )
    print(f"Wrote {out_path}")

    plt.show()


if __name__ == "__main__":
    main()
