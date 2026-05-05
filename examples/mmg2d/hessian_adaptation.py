# /// script
# requires-python = ">=3.10"
# dependencies = [
#     "mmgpy",
#     "matplotlib",
#     "numpy",
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
mesh refines along the front and stays coarse elsewhere.
"""

from __future__ import annotations

import matplotlib.pyplot as plt
import matplotlib.tri as mtri
import numpy as np

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

    print(
        f"Initial: {len(vertices)} vertices, {len(triangles)} triangles\n"
        f"Adapted: {adapted.n_points} vertices, {len(adapted.regular_faces)} triangles",
    )

    fig, axes = plt.subplots(1, 2, figsize=(12, 5))

    axes[0].tricontourf(
        vertices[:, 0],
        vertices[:, 1],
        triangles,
        field,
        levels=20,
        cmap="RdBu_r",
    )
    axes[0].triplot(
        vertices[:, 0],
        vertices[:, 1],
        triangles,
        color="0.2",
        linewidth=0.3,
    )
    axes[0].set_title(f"Initial uniform mesh ({len(vertices)} vertices)")
    axes[0].set_aspect("equal")

    adapted_pts = np.asarray(adapted.points[:, :2])
    adapted_tris = adapted.regular_faces
    axes[1].triplot(
        adapted_pts[:, 0],
        adapted_pts[:, 1],
        adapted_tris,
        color="0.2",
        linewidth=0.3,
    )
    axes[1].set_title(
        f"Hessian-based adapted mesh ({adapted.n_points} vertices)",
    )
    axes[1].set_aspect("equal")

    fig.tight_layout()
    plt.show()


if __name__ == "__main__":
    main()
