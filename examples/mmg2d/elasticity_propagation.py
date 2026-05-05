# /// script
# requires-python = ">=3.10"
# dependencies = [
#     "mmgpy[fem]",
#     "matplotlib",
#     "numpy",
# ]
#
# [tool.uv.sources]
# mmgpy = { path = "../.." }
# ///
"""Compare Laplacian vs elasticity propagation for 2D Lagrangian motion.

This example moves the right edge of a unit square to the right while
holding the left edge fixed, then propagates the prescribed boundary
displacement to the interior using two methods:

* ``"laplacian"``: solves a Laplace equation on the mesh graph (default,
  no extra dependency).
* ``"elasticity"``: solves a fictitious linear elasticity problem on the
  mesh via the optional ``fedoo`` backend. It tends to produce smoother,
  physically meaningful interior displacements for large deformations.

Run with ``uv run examples/mmg2d/elasticity_propagation.py``. ``fedoo``
is required for the elasticity panel, hence the ``mmgpy[fem]`` extra.
"""

from __future__ import annotations

import matplotlib.pyplot as plt
import matplotlib.tri as mtri
import numpy as np

import mmgpy  # noqa: F401  -- registers the .mmg accessor
from mmgpy import polydata_from_2d_triangles


def make_unit_square(n: int = 9) -> tuple[np.ndarray, np.ndarray]:
    """Structured triangulation of [0, 1]^2 with n x n vertices."""
    grid = np.linspace(0.0, 1.0, n)
    xx, yy = np.meshgrid(grid, grid)
    vertices = np.column_stack([xx.ravel(), yy.ravel()]).astype(np.float64)
    triangles = mtri.Triangulation(vertices[:, 0], vertices[:, 1]).triangles
    return vertices, triangles.astype(np.int32)


def shear_displacement(
    vertices: np.ndarray,
    *,
    shear: float = 0.4,
) -> tuple[np.ndarray, np.ndarray]:
    """Build a boundary-only displacement and matching boundary_mask.

    The left edge is pinned (zero displacement), the right edge is sheared
    upward, and the top/bottom edges are translated proportionally.
    Interior values are left as zeros and will be filled by the propagator.
    """
    x = vertices[:, 0]
    y = vertices[:, 1]

    on_left = np.isclose(x, 0.0)
    on_right = np.isclose(x, 1.0)
    on_bottom = np.isclose(y, 0.0)
    on_top = np.isclose(y, 1.0)
    boundary = on_left | on_right | on_top | on_bottom

    disp = np.zeros_like(vertices)
    disp[on_right, 1] = shear
    disp[on_top, 1] = shear * x[on_top]
    disp[on_bottom, 1] = shear * x[on_bottom]
    return disp, boundary


def plot_mesh(ax: plt.Axes, points: np.ndarray, tris: np.ndarray, title: str) -> None:
    """Render a triangulation onto the given axes with a labelled title."""
    ax.triplot(points[:, 0], points[:, 1], tris, color="0.3", linewidth=0.4)
    ax.plot(points[:, 0], points[:, 1], ".", color="C0", markersize=2)
    ax.set_title(title)
    ax.set_aspect("equal")
    ax.set_xlim(-0.05, 1.15)
    ax.set_ylim(-0.05, 1.55)


def main() -> None:
    """Run both propagation methods on the same boundary problem and plot."""
    vertices, triangles = make_unit_square(n=9)
    displacement, boundary = shear_displacement(vertices)
    pv_mesh = polydata_from_2d_triangles(vertices, triangles)

    moved_lap = pv_mesh.mmg.move(
        displacement,
        boundary_mask=boundary,
        propagation_method="laplacian",
        hmax=0.18,
        verbose=False,
    )

    try:
        moved_ela = pv_mesh.mmg.move(
            displacement,
            boundary_mask=boundary,
            propagation_method="elasticity",
            hmax=0.18,
            verbose=False,
        )
    except ImportError as exc:
        print(f"Elasticity propagation unavailable ({exc}); skipping that panel.")
        moved_ela = None

    fig, axes = plt.subplots(1, 3, figsize=(15, 5))
    plot_mesh(axes[0], vertices, triangles, "Initial mesh")
    plot_mesh(
        axes[1],
        np.asarray(moved_lap.points[:, :2]),
        moved_lap.regular_faces,
        "Laplacian propagation",
    )
    if moved_ela is None:
        axes[2].text(
            0.5,
            0.5,
            "fedoo not installed\nrun:  uv add fedoo",
            ha="center",
            va="center",
            transform=axes[2].transAxes,
        )
        axes[2].set_axis_off()
    else:
        plot_mesh(
            axes[2],
            np.asarray(moved_ela.points[:, :2]),
            moved_ela.regular_faces,
            "Elasticity propagation (fedoo)",
        )

    fig.tight_layout()
    plt.show()


if __name__ == "__main__":
    main()
