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
"""Generate a family of meshes by rescaling the mesh-implied metric.

Given an existing tetrahedral mesh, ``MmgMesh.build_size_map(aniso=True)``
recovers the anisotropic metric tensor whose unit ball matches the
shape and size of the elements around each vertex. Scaling that tensor
by a factor ``c`` rescales target edge lengths by ``1/sqrt(c)``, so:

* ``c > 1`` refines the mesh,
* ``c == 1`` reproduces the input sizing,
* ``c < 1`` coarsens the mesh.

This is the workflow from issue #255: load a hand-crafted mesh, build
its implied metric, and produce coarser/finer variants without going
back to a CAD source or a solution field.
"""

from __future__ import annotations

import numpy as np
import pyvista as pv

import mmgpy  # noqa: F401  -- registers the .mmg accessor


def make_unit_cube(n: int = 12) -> pv.UnstructuredGrid:
    """Tetrahedralized unit cube on [0, 1]^3 with a regular n^3 grid."""
    rg = pv.RectilinearGrid(
        np.linspace(0.0, 1.0, n),
        np.linspace(0.0, 1.0, n),
        np.linspace(0.0, 1.0, n),
    )
    return rg.cast_to_unstructured_grid().triangulate()


def family_from_metric(
    base: pv.UnstructuredGrid,
    factors: list[float],
) -> list[tuple[float, pv.UnstructuredGrid]]:
    """Rescale the mesh-implied metric of ``base`` by each factor and remesh.

    Returns a list of (factor, remeshed_grid) pairs in the same order as
    ``factors``.
    """
    metric = base.mmg.build_size_map(aniso=True)
    print(
        f"Mesh-implied metric: shape={metric.shape}, "
        f"min eig per vertex (median): "
        f"{np.median(_min_eig(metric)):.3f}",
    )

    results: list[tuple[float, pv.UnstructuredGrid]] = []
    for c in factors:
        grid = base.copy(deep=True)
        grid.point_data["metric"] = metric * c
        remeshed = grid.mmg.remesh(hgrad=2.0, verbose=False)
        results.append((c, remeshed))
    return results


def _min_eig(metric_3d: np.ndarray) -> np.ndarray:
    """Smallest eigenvalue of each ``(N, 6)`` symmetric tensor."""
    a, b, c, d, e, f = (metric_3d[:, i] for i in range(6))
    mats = np.empty((len(metric_3d), 3, 3), dtype=np.float64)
    mats[:, 0, 0] = a
    mats[:, 0, 1] = mats[:, 1, 0] = b
    mats[:, 0, 2] = mats[:, 2, 0] = c
    mats[:, 1, 1] = d
    mats[:, 1, 2] = mats[:, 2, 1] = e
    mats[:, 2, 2] = f
    return np.linalg.eigvalsh(mats)[:, 0]


def _tet_count(grid: pv.UnstructuredGrid) -> int:
    return grid.cells_dict.get(pv.CellType.TETRA, np.empty((0, 4))).shape[0]


def main() -> None:
    """Build a family of remeshes by rescaling the mesh-implied metric."""
    base = make_unit_cube()
    print(f"Input: {base.n_points} vertices, {_tet_count(base)} tetrahedra")

    factors = [0.25, 1.0, 4.0]
    family = family_from_metric(base, factors)

    for c, grid in family:
        print(
            f"  c = {c:>4.2f}  ->  {grid.n_points} vertices, "
            f"{_tet_count(grid)} tetrahedra",
        )

    pl = pv.Plotter(shape=(1, len(family)), window_size=(1700, 600))
    for col, (c, grid) in enumerate(family):
        pl.subplot(0, col)
        pl.add_mesh(
            grid.clip_box(bounds=(0.5, 1.05, 0.5, 1.05, 0.5, 1.05), invert=True),
            show_edges=True,
            edge_color="black",
            line_width=0.4,
            color="lightsteelblue",
        )
        pl.add_text(
            f"c = {c}\n{grid.n_points} verts, {_tet_count(grid)} tets",
            font_size=10,
        )
        pl.show_axes()
    pl.link_views()
    pl.camera_position = [(2.6, 2.4, 2.6), (0.5, 0.5, 0.5), (0, 0, 1)]
    pl.show()


if __name__ == "__main__":
    main()
