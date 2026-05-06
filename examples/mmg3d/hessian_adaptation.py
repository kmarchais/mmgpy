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

This example uses an analytic field with a sharp spherical front,
``f(p) = tanh(40 * (||p - 0.5|| - 0.3))``, computes the Hessian on the
initial uniform mesh, and runs anisotropic remeshing so the new mesh
refines along the front and stays coarse elsewhere.

A corner of the cube is clipped away so the interior refinement around
the spherical front is visible. The script writes
``hessian_adaptation.png`` next to itself.
"""

from __future__ import annotations

from pathlib import Path

import numpy as np
import pyvista as pv

import mmgpy  # noqa: F401  -- registers the .mmg accessor
from mmgpy.metrics import compute_hessian, create_metric_from_hessian


def make_unit_cube(n: int = 13) -> tuple[np.ndarray, np.ndarray]:
    """Tetrahedralized unit cube on [0, 1]^3 with a regular n^3 grid."""
    rg = pv.RectilinearGrid(
        np.linspace(0.0, 1.0, n),
        np.linspace(0.0, 1.0, n),
        np.linspace(0.0, 1.0, n),
    )
    tetra = rg.cast_to_unstructured_grid().triangulate()
    vertices = np.asarray(tetra.points, dtype=np.float64)
    elements = tetra.cells_dict[pv.CellType.TETRA].astype(np.int32)
    return vertices, elements


def front_field(vertices: np.ndarray) -> np.ndarray:
    """Analytic field with a thin transition along a sphere of radius 0.3."""
    r = np.linalg.norm(vertices - 0.5, axis=1)
    return np.tanh(40.0 * (r - 0.3))


def clip_corner(grid: pv.UnstructuredGrid) -> pv.UnstructuredGrid:
    """Carve away the +x +y +z corner so the interior is visible."""
    return grid.clip_box(
        bounds=(0.5, 1.05, 0.5, 1.05, 0.5, 1.05),
        invert=True,
        crinkle=True,
    )


def main() -> None:
    """Build a uniform mesh, recover the Hessian, and remesh adaptively."""
    vertices, elements = make_unit_cube()
    field = front_field(vertices)

    hessian = compute_hessian(vertices, elements, field)
    metric = create_metric_from_hessian(
        hessian,
        target_error=1e-2,
        hmin=1e-2,
        hmax=0.15,
    )

    original = pv.UnstructuredGrid({pv.CellType.TETRA: elements}, vertices)
    original.point_data["solution"] = field
    original.point_data["metric"] = metric

    adapted = original.mmg.remesh(hgrad=2.0, verbose=False)
    adapted.point_data["solution"] = front_field(np.asarray(adapted.points))

    n_tets_in = elements.shape[0]
    n_tets_out = adapted.cells_dict.get(pv.CellType.TETRA, np.empty((0, 4))).shape[0]
    print(
        f"Initial: {len(vertices)} vertices, {n_tets_in} tetrahedra\n"
        f"Adapted: {adapted.n_points} vertices, {n_tets_out} tetrahedra",
    )

    pl = pv.Plotter(shape=(1, 2), off_screen=True, window_size=(1300, 650))
    sphere = pv.Sphere(radius=0.3, center=(0.5, 0.5, 0.5)).clip_box(
        bounds=(0.5, 1.05, 0.5, 1.05, 0.5, 1.05),
        invert=True,
    )

    pl.subplot(0, 0)
    pl.add_mesh(
        clip_corner(original),
        scalars="solution",
        cmap="RdBu_r",
        show_edges=True,
        edge_color="black",
        line_width=0.4,
        scalar_bar_args={"title": "f(p)"},
    )
    pl.add_mesh(sphere, color="white", opacity=0.25, show_edges=False)
    pl.add_text(
        f"Uniform mesh ({len(vertices)} verts, {n_tets_in} tets)",
        font_size=10,
    )
    pl.show_axes()

    pl.subplot(0, 1)
    pl.add_mesh(
        clip_corner(adapted),
        scalars="solution",
        cmap="RdBu_r",
        show_edges=True,
        edge_color="black",
        line_width=0.4,
        show_scalar_bar=False,
    )
    pl.add_mesh(sphere, color="white", opacity=0.25, show_edges=False)
    pl.add_text(
        f"Hessian-adapted mesh ({adapted.n_points} verts, {n_tets_out} tets)",
        font_size=10,
    )
    pl.show_axes()
    pl.link_views()
    pl.camera_position = [(2.6, 2.4, 2.6), (0.5, 0.5, 0.5), (0, 0, 1)]

    out_path = Path(__file__).with_suffix(".png")
    pl.show(screenshot=str(out_path))
    print(f"Wrote {out_path}")


if __name__ == "__main__":
    main()
