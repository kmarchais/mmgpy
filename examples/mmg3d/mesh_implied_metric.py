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
"""Generate a refinement family from a Hessian-adapted source mesh.

Issue #255 use case: you already have a mesh whose sizing pattern you
like (hand-graded, solution-adapted, ...) and you want coarser/finer
variants for a mesh-convergence study, *without* redoing the
adaptation.

``MmgMesh.build_size_map(aniso=True)`` recovers the anisotropic metric
tensor whose unit ball matches the local element shape and size at
every vertex. Multiplying that tensor by a factor c rescales target
edge lengths by ``1/sqrt(c)``: ``c > 1`` refines, ``c < 1`` coarsens,
and the *pattern* of anisotropy is preserved.

Pipeline:

1. Take a uniform tetrahedral cube.
2. Adapt it to a scalar field with a sharp spherical front via
   Hessian recovery. The result has thin cells aligned with the
   front, coarse cells away from it.
3. Recover its mesh-implied metric tensor with
   ``build_size_map(aniso=True)``.
4. Scale the tensor by ``c in {1/4, 1, 4}`` and remesh, producing a
   coarser, identity, and finer mesh that all keep the front-aligned
   anisotropy.
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
    """Sharp transition along a sphere of radius 0.3 around (0.5, 0.5, 0.5)."""
    r = np.linalg.norm(points - 0.5, axis=1)
    return np.tanh(40.0 * (r - 0.3))


def adapt_to_field(base: pv.UnstructuredGrid) -> pv.UnstructuredGrid:
    """Build a Hessian-adapted source mesh for the scalar front field."""
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
    base = base.copy(deep=True)
    base.point_data["metric"] = metric
    return base.mmg.remesh(hgrad=2.0, verbose=False)


def family_from_source(
    source: pv.UnstructuredGrid,
    factors: tuple[float, ...],
) -> list[tuple[float, pv.UnstructuredGrid]]:
    """Scale the source's mesh-implied metric by each factor and remesh."""
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
    """Cut at z=0.5 and keep the z<=0.5 half so a full face is exposed."""
    return grid.clip(normal="z", origin=(0.5, 0.5, 0.5), crinkle=True)


def main() -> None:
    """Adapt once, then rescale the implied metric to get a refinement family."""
    base = make_unit_cube()
    print(
        f"Uniform base:        {base.n_points:>6d} verts, {_tet_count(base):>6d} tets",
    )

    source = adapt_to_field(base)
    print(
        f"Hessian-adapted src: {source.n_points:>6d} verts, "
        f"{_tet_count(source):>6d} tets",
    )

    factors = (0.25, 1.0, 4.0)
    family = family_from_source(source, factors)
    print()
    for c, grid in family:
        print(
            f"  metric x {c:<5.2g}  ->  {grid.n_points:>6d} verts, "
            f"{_tet_count(grid):>6d} tets",
        )

    sphere = pv.Sphere(radius=0.3, center=(0.5, 0.5, 0.5)).clip(
        normal="z",
        origin=(0.5, 0.5, 0.5),
    )

    panels: list[tuple[str, pv.UnstructuredGrid]] = [
        ("Hessian-adapted source", source),
        *[(f"c = {c}  (mesh-implied metric x c)", grid) for c, grid in family],
    ]

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
        pl.add_text(
            f"{name}\n{grid.n_points} verts, {_tet_count(grid)} tets",
            font_size=10,
        )
        pl.show_axes()
    pl.link_views()
    pl.camera_position = [(2.4, 2.6, 2.4), (0.5, 0.5, 0.3), (0, 0, 1)]
    pl.show()


if __name__ == "__main__":
    main()
