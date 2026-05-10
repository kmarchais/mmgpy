# /// script
# requires-python = ">=3.9"
# dependencies = [
#     "mmgpy",
#     "matplotlib",
#     "numpy",
# ]
#
# [tool.uv.sources]
# mmgpy = { path = "../.." }
# ///

"""Triangulate a 2D domain from its boundary outline.

When MMG2D is given a vertex+edge input with no triangles it switches to its
mesh-generation path and produces a Delaunay triangulation that conforms to
the supplied edges. ``mmgpy.mmg2d.generate`` exposes that path so a closed
polygon (here a NACA-like airfoil contour) can be triangulated without going
through a ``.mesh`` file or a temporary triangulation.

Run::

    uv run examples/mmg2d/triangulate_outline.py
"""

from __future__ import annotations

from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
from matplotlib.tri import Triangulation

from mmgpy import mmg2d


def naca_airfoil(n: int = 80, thickness: float = 0.12) -> np.ndarray:
    """Sample points along a NACA 4-digit symmetric airfoil contour."""
    beta = np.linspace(0.0, np.pi, n // 2 + 1)
    x = 0.5 * (1.0 - np.cos(beta))
    yt = (
        5.0
        * thickness
        * (
            0.2969 * np.sqrt(x)
            - 0.1260 * x
            - 0.3516 * x**2
            + 0.2843 * x**3
            - 0.1036 * x**4
        )
    )
    upper = np.column_stack([x, yt])
    lower = np.column_stack([x[-2:0:-1], -yt[-2:0:-1]])
    return np.vstack([upper, lower])


def closed_polygon_edges(n_points: int) -> np.ndarray:
    """Return the (n, 2) edge connectivity for a closed polygon."""
    idx = np.arange(n_points, dtype=np.int32)
    return np.column_stack([idx, np.roll(idx, -1)])


def main() -> None:
    """Triangulate a NACA airfoil contour and plot the result."""
    contour = naca_airfoil(n=80)
    edges = closed_polygon_edges(len(contour))

    mesh = mmg2d.generate(contour, edges, hmax=0.05, hgrad=1.3, verbose=-1)
    points = np.asarray(mesh.points[:, :2])
    triangles = np.asarray(mesh.regular_faces)

    print(f"input  : {len(contour)} boundary vertices, {len(edges)} edges")
    print(f"output : {mesh.n_points} vertices, {len(triangles)} triangles")

    fig, axes = plt.subplots(1, 2, figsize=(11, 4))

    axes[0].plot(
        np.append(contour[:, 0], contour[0, 0]),
        np.append(contour[:, 1], contour[0, 1]),
        "k-",
        linewidth=1.0,
    )
    axes[0].fill(contour[:, 0], contour[:, 1], color="0.85")
    axes[0].set_title(f"Input outline ({len(contour)} pts)")
    axes[0].set_aspect("equal")

    tri = Triangulation(points[:, 0], points[:, 1], triangles)
    axes[1].triplot(tri, "C0-", linewidth=0.4)
    axes[1].set_title(f"Triangulation ({len(triangles)} tris)")
    axes[1].set_aspect("equal")

    for ax in axes:
        ax.set_xlim(-0.05, 1.05)
        ax.set_ylim(-0.2, 0.2)
        ax.set_xticks([0, 0.5, 1])
        ax.set_yticks([-0.1, 0, 0.1])

    fig.suptitle("mmg2d.generate: triangulating a NACA airfoil outline")
    fig.tight_layout()

    out = Path(__file__).with_suffix(".png")
    fig.savefig(out, dpi=150, bbox_inches="tight", facecolor="white")
    print(f"figure saved to {out}")


if __name__ == "__main__":
    main()
