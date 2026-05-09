# /// script
# requires-python = ">=3.10"
# dependencies = [
#     "mmgpy",
#     "microgen",
#     "numpy",
#     "pyvista",
# ]
#
# [tool.uv.sources]
# mmgpy = { path = "../.." }
# ///
"""Build a strictly periodic gyroid volume mesh.

The straight mmgpy path (``examples/mmg3d/gyroid_unit_cube.py``) is great
for a single-cell mesh, but its boundary nodes drift independently on
opposite cube faces because mmg-LS isn't periodicity-aware. For an FEM
problem with periodic boundary conditions, the boundary node positions
on opposite faces have to match exactly under translation.

The trick is to bypass mmg-LS for the volume creation: a *structured*
grid of ``[0, 1]^3`` already has identical node positions on opposite
faces, and clipping that grid by the gyroid level set preserves the
property — both the grid and the level-set field are periodic with the
cube's period, so opposite faces see identical clipping.

That's exactly what ``microgen.Tpms.grid_sheet`` returns. This example:

1. Calls ``Tpms(...).grid_sheet`` to get a periodic gyroid shell volume
   on ``[-0.5, 0.5]^3``.
2. Translates it to ``[0, 1]^3`` so it lines up with the rest of the
   periodic-remesh recipes.
3. Verifies strict periodicity with the inline copy of
   ``microgen.mesh.is_periodic``.

If you then want to *refine* this mesh while keeping it periodic, the
follow-up tool is ``mesh.mmg.remesh(..., required_triangles=...)`` from
this PR — see ``examples/mmg3d/periodic_remesh.py`` for that recipe.
(``grid_sheet`` produces mixed cell types — TETRA, HEXAHEDRON, WEDGE,
PYRAMID — and a couple of non-manifold edges, so a direct mmg quality
pass will not always succeed; in practice you triangulate, flip
inverted tets, then quality-optimize.)

Run::

    uv run examples/mmg3d/periodic_gyroid.py
"""

from __future__ import annotations

import numpy as np
import pyvista as pv
from microgen.shape import surface_functions
from microgen.shape.tpms import Tpms

import mmgpy  # noqa: F401  -- registers the .mmg accessor

PERIOD = 1.0
THICKNESS = 1.0
HALF = THICKNESS / 2.0


def is_periodic(points: np.ndarray, tol: float = 1e-9) -> bool:
    """Inline copy of ``microgen.mesh.is_periodic`` (mesh.py:246).

    Sorts opposite-face nodes by their lateral coordinates and checks the
    componentwise difference is below *tol*.
    """
    dim = points.shape[1]
    axes = "xyz"[:dim]
    pmin, pmax = points.min(axis=0), points.max(axis=0)
    faces: dict[str, np.ndarray] = {}
    for i, axis in enumerate(axes):
        faces[f"{axis}-"] = np.where(np.abs(points[:, i] - pmin[i]) < tol)[0]
        faces[f"{axis}+"] = np.where(np.abs(points[:, i] - pmax[i]) < tol)[0]
    rounded = int(-np.log10(tol) - 1)
    comp = {"x": (1, 2), "y": (0, 2), "z": (0, 1)}
    for axis in axes:
        for sign in "-+":
            face = f"{axis}{sign}"
            i_a, i_b = comp[axis]
            faces[face] = faces[face][
                np.lexsort(
                    (
                        points[faces[face], i_a],
                        points[faces[face], i_b].round(rounded),
                    ),
                )
            ]
    for axis in axes:
        m, p = faces[f"{axis}-"], faces[f"{axis}+"]
        if len(m) != len(p):
            return False
        slc = comp[axis]
        if (np.abs(points[p][:, slc] - points[m][:, slc]) > tol).any():
            return False
    return True


def face_node_counts(points: np.ndarray, tol: float = 1e-9) -> dict[str, int]:
    """Count nodes within *tol* of each cube face (uses point bounds)."""
    pmin, pmax = points.min(axis=0), points.max(axis=0)
    return {
        f"{axis}{sign}": int(
            (
                np.abs(
                    points[:, i] - (pmin[i] if sign == "-" else pmax[i]),
                )
                < tol
            ).sum(),
        )
        for i, axis in enumerate("xyz")
        for sign in "-+"
    }


def main() -> None:
    """Build and verify a strictly periodic gyroid volume mesh."""
    tpms = Tpms(
        surface_function=surface_functions.gyroid,
        offset=HALF,
        cell_size=PERIOD,
        repeat_cell=1,
        resolution=30,
    )
    grid_sheet = tpms.grid_sheet
    grid_sheet.points = np.asarray(grid_sheet.points) + np.array(
        [PERIOD / 2, PERIOD / 2, PERIOD / 2],
    )
    bounds = tuple(round(b, 3) for b in grid_sheet.bounds)
    print(
        f"microgen.Tpms.grid_sheet: {grid_sheet.n_cells} cells, "
        f"{grid_sheet.n_points} points, bounds {bounds}",
    )

    pts = np.asarray(grid_sheet.points)
    counts = face_node_counts(pts)
    print("\nCube-face node counts (matched on opposite faces):")
    for axis in "xyz":
        m, p = counts[f"{axis}-"], counts[f"{axis}+"]
        print(f"  {axis}- : {m:4d}    {axis}+ : {p:4d}    delta {abs(m - p)}")

    # is_periodic uses *tol* both to detect face nodes AND to compare opposite
    # pairs; loosening it past the actual node-snap tolerance pulls in nearby
    # interior points that have no twin, so the strict 1e-9 reading is the
    # meaningful one for grid_sheet's exact grid coordinates.
    print(f"\nis_periodic(tol=1e-9) = {is_periodic(pts, 1e-9)}")

    # Diagnostic: cell-type breakdown (grid_sheet produces mixed cells, not
    # pure tets — the mesh is FEM-usable but won't pass through mmg.remesh
    # cleanly without a triangulate + orientation-fix step).
    celltypes = np.asarray(grid_sheet.celltypes)
    type_names = {10: "TETRA", 12: "HEXAHEDRON", 13: "WEDGE", 14: "PYRAMID"}
    bins = dict(zip(*np.unique(celltypes, return_counts=True), strict=True))
    print("\nCell-type breakdown:")
    for t, count in bins.items():
        print(f"  {type_names.get(int(t), f'type {t}')}: {count}")

    surface = grid_sheet.extract_surface(algorithm="dataset_surface")
    print(f"\nBoundary triangulation: {surface.n_cells} faces")

    pl = pv.Plotter(shape=(1, 2), window_size=(1500, 750))

    pl.subplot(0, 0)
    pl.add_mesh(grid_sheet, show_edges=True, color="steelblue", line_width=0.3)
    pl.add_mesh(
        pv.Cube(center=(0.5, 0.5, 0.5)),
        opacity=0.1,
        color="white",
        show_edges=True,
        edge_color="gray",
    )
    pl.add_title(
        f"Periodic gyroid volume\n{grid_sheet.n_cells} cells",
        font_size=10,
    )

    pl.subplot(0, 1)
    pl.add_mesh(surface, show_edges=True, color="coral", line_width=0.3)
    pl.add_title(
        f"Boundary surface\n{surface.n_cells} faces",
        font_size=10,
    )
    pl.link_views()
    pl.camera_position = "iso"
    pl.show()


if __name__ == "__main__":
    main()
