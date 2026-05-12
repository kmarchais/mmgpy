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
``f(p) = tanh(40 * (||p - 0.5|| - 0.3))``, and proceeds in two phases:

1. **Adapt.** Recover the Hessian on the initial uniform mesh and run
   anisotropic remeshing so the new mesh refines along the front and
   stays coarse elsewhere.
2. **Refinement family.** Recover the mesh-implied metric tensor from
   the adapted mesh via ``build_size_map(aniso=True)`` and rescale it
   by factors ``c in {1/4, 4}``. Multiplying the metric by ``c``
   rescales target edge lengths by ``1/sqrt(c)``, producing coarser
   and finer variants that *preserve* the front-aligned anisotropy
   (issue #255).

Each panel is cut at ``z = 0.5`` so the full top face cross-section
through the spherical front is visible.
"""

from __future__ import annotations

import numpy as np
import pyvista as pv

import mmgpy  # noqa: F401  -- registers the .mmg accessor
from mmgpy.metrics import compute_hessian, create_metric_from_hessian


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


def adapt_to_field(base: pv.UnstructuredGrid) -> pv.UnstructuredGrid:
    """Hessian-recover a metric from the front field and remesh ``base``."""
    vertices = np.asarray(base.points, dtype=np.float64)
    elements = base.cells_dict[pv.CellType.TETRA].astype(np.int32)
    field = front_field(vertices)
    hessian = compute_hessian(vertices, elements, field)
    metric = create_metric_from_hessian(
        hessian,
        target_error=1e-2,
        hmin=1e-2,
        hmax=0.15,
    )
    src = base.copy(deep=True)
    src.point_data["metric"] = metric
    return src.mmg.remesh(hgrad=2.0, verbose=False)


def family_from_source(
    source: pv.UnstructuredGrid,
    factors: tuple[float, ...],
) -> list[tuple[float, pv.UnstructuredGrid]]:
    """Recover the implied metric of ``source`` and remesh under each scale."""
    metric = source.mmg.build_size_map(aniso=True)
    family: list[tuple[float, pv.UnstructuredGrid]] = []
    for c in factors:
        grid = source.copy(deep=True)
        grid.point_data["metric"] = metric * c
        family.append((c, grid.mmg.remesh(hgrad=2.0, verbose=False)))
    return family


def _tet_count(grid: pv.UnstructuredGrid) -> int:
    return grid.cells_dict.get(pv.CellType.TETRA, np.empty((0, 4))).shape[0]


def _clip_half(grid: pv.UnstructuredGrid) -> pv.UnstructuredGrid:
    """Cut at ``z = 0.5`` and keep the lower half so a full face is exposed."""
    return grid.clip(normal="z", origin=(0.5, 0.5, 0.5), crinkle=True)


def main() -> None:
    """Adapt to the front, then build a refinement family by rescaling."""
    base = make_unit_cube()
    print(
        f"Uniform base:        {base.n_points:>6d} verts, {_tet_count(base):>6d} tets",
    )

    source = adapt_to_field(base)
    print(
        f"Hessian-adapted src: {source.n_points:>6d} verts, "
        f"{_tet_count(source):>6d} tets",
    )

    factors = (0.25, 4.0)
    family = family_from_source(source, factors)
    print()
    for c, grid in family:
        print(
            f"  implied metric x {c:<5.2g}  ->  {grid.n_points:>6d} verts, "
            f"{_tet_count(grid):>6d} tets",
        )

    panels: list[tuple[str, pv.UnstructuredGrid]] = [
        (f"Uniform base\n({base.n_points} verts)", base),
        (f"Hessian-adapted source\n({source.n_points} verts)", source),
        *[
            (
                f"Implied metric x {c}\n({grid.n_points} verts)",
                grid,
            )
            for c, grid in family
        ],
    ]

    sphere = pv.Sphere(radius=0.3, center=(0.5, 0.5, 0.5)).clip(
        normal="z",
        origin=(0.5, 0.5, 0.5),
    )

    pl = pv.Plotter(shape=(1, len(panels)), window_size=(1900, 600))
    for col, (name, grid) in enumerate(panels):
        clipped = _clip_half(grid)
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
        pl.add_text(name, font_size=10)
        pl.show_axes()
    pl.link_views()
    pl.camera_position = [(2.4, 2.6, 2.4), (0.5, 0.5, 0.3), (0, 0, 1)]
    pl.show()


if __name__ == "__main__":
    main()
