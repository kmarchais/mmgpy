# /// script
# requires-python = ">=3.10"
# dependencies = [
#     "mmgpy",
#     "numpy",
#     "pyvista",
# ]
#
# [tool.uv.sources]
# mmgpy = { path = "../.." }
# ///
"""Solution-adaptive 3D remeshing via patch-based Hessian recovery.

Given a scalar field defined on a tetrahedral mesh,
``mmgpy.metrics.compute_hessian`` recovers the Hessian by least-squares
on a 2-ring patch around each vertex, and ``create_metric_from_hessian``
turns the Hessian into an anisotropic metric that MMG can use for
adaptive remeshing.

The script adapts a uniform mesh to a sharp spherical front,
``f(p) = tanh(40 * (||p - 0.5|| - 0.3))``, then recovers the
mesh-implied metric tensor of the adapted mesh via
``build_size_map(aniso=True)`` and rescales it by ``c in {1/4, 4}``.
Multiplying the metric by ``c`` rescales target edge lengths by
``1/sqrt(c)`` (``c > 1`` refines, ``c < 1`` coarsens) while preserving
the front-aligned anisotropy. Each panel is cut at ``z = 0.5`` so the
top-face cross-section through the front is visible.
"""

from __future__ import annotations

import numpy as np
import pyvista as pv

import mmgpy  # noqa: F401  -- registers the .mmg accessor
from mmgpy.metrics import compute_hessian, create_metric_from_hessian

Panel = tuple[str, pv.UnstructuredGrid]


# ---------------------------------------------------------------------------
# Mesh processing
# ---------------------------------------------------------------------------


def make_unit_cube(n: int = 21) -> pv.UnstructuredGrid:
    """Tetrahedralized unit cube on [0, 1]^3 with a regular n^3 grid."""
    rg = pv.RectilinearGrid(
        np.linspace(0.0, 1.0, n),
        np.linspace(0.0, 1.0, n),
        np.linspace(0.0, 1.0, n),
    )
    return rg.cast_to_unstructured_grid().triangulate()


def front_field(points: np.ndarray) -> np.ndarray:
    """Analytic field with a thin transition along a sphere of radius 0.3."""
    r = np.linalg.norm(points - 0.5, axis=1)
    return np.tanh(40.0 * (r - 0.3))


def _tet_count(grid: pv.UnstructuredGrid) -> int:
    return grid.cells_dict.get(pv.CellType.TETRA, np.empty((0, 4))).shape[0]


def build_panels() -> list[Panel]:
    """Adapt to the front, then rescale the implied metric."""
    base = make_unit_cube()

    # Hessian-adapt to the front.
    vertices = np.asarray(base.points, dtype=np.float64)
    elements = base.cells_dict[pv.CellType.TETRA].astype(np.int32)
    hessian = compute_hessian(vertices, elements, front_field(vertices))
    metric = create_metric_from_hessian(
        hessian,
        target_error=1e-2,
        hmin=1e-2,
        hmax=0.15,
    )
    src = base.copy(deep=True)
    src.point_data["metric"] = metric
    source = src.mmg.remesh(hgrad=2.0, verbose=False)

    # Recover the implied metric and remesh at rescaled versions.
    implied = source.mmg.build_size_map(aniso=True)
    scaled: list[Panel] = []
    for c in (0.25, 4.0):
        grid = source.copy(deep=True)
        grid.point_data["metric"] = implied * c
        scaled.append((f"Implied x {c}", grid.mmg.remesh(hgrad=2.0, verbose=False)))

    return [
        ("Uniform", base),
        ("Hessian-adapted", source),
        *scaled,
    ]


# ---------------------------------------------------------------------------
# Visualization
# ---------------------------------------------------------------------------


def render(panels: list[Panel]) -> None:
    """Render ``panels`` side-by-side, clipped at z = 0.5."""
    sphere = pv.Sphere(radius=0.3, center=(0.5, 0.5, 0.5)).clip(
        normal="z",
        origin=(0.5, 0.5, 0.5),
    )

    pl = pv.Plotter(shape=(1, len(panels)), window_size=(1900, 600))
    for col, (name, grid) in enumerate(panels):
        clipped = grid.clip(normal="z", origin=(0.5, 0.5, 0.5), crinkle=True)
        clipped.point_data["solution"] = front_field(np.asarray(clipped.points))
        pl.subplot(0, col)
        pl.add_mesh(
            clipped,
            scalars="solution",
            cmap="RdBu_r",
            show_edges=True,
            edge_color="black",
            line_width=0.4,
            show_scalar_bar=col == 0,
            scalar_bar_args={"title": "front", "vertical": True},
        )
        pl.add_mesh(sphere, color="white", opacity=0.2, show_edges=False)
        pl.add_text(f"{name} ({grid.n_points} verts)", font_size=10)
        pl.show_axes()
    pl.link_views()
    pl.camera_position = [(2.4, 2.6, 2.4), (0.5, 0.5, 0.3), (0, 0, 1)]
    pl.show()


def main() -> None:
    """Build the mesh panels and open an interactive comparison view."""
    panels = build_panels()
    for name, g in panels:
        print(f"{name:>20s}: {g.n_points:>6d} verts, {_tet_count(g):>6d} tets")
    render(panels)


if __name__ == "__main__":
    main()
