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
"""Build a strictly periodic gyroid volume mesh — pure pyvista, no CAD.

The straight mmgpy path (``examples/mmg3d/gyroid_unit_cube.py``) is great
for a single-cell mesh, but its boundary nodes drift independently on
opposite cube faces because mmg-LS isn't periodicity-aware. For an FEM
problem with periodic boundary conditions, the boundary node positions
on opposite faces have to match exactly under translation.

The trick is to bypass mmg-LS for the volume creation. A *structured*
grid of ``[0, 1]^3`` already has identical node positions on opposite
faces, and clipping it by the gyroid level set preserves the property —
both the grid and the level-set field are periodic with the cube's
period, so opposite faces see identical clipping. Each new vertex
inserted on a cell edge that crosses the iso lands at the same
parametric position on its periodic counterpart edge, so the output's
boundary node sets are byte-identical between opposite faces.

This recipe is one ``pv.ImageData(...).clip_scalar(...)`` call. No mmg
involved for the periodic structure, no CAD dependency.

If you then want to *refine* this mesh while keeping it periodic, the
follow-up tool is ``mesh.mmg.remesh(..., required_triangles=...)`` from
this PR — see ``examples/mmg3d/periodic_remesh.py``. ``clip_scalar``
emits mixed cell types (TETRA, HEXAHEDRON, WEDGE, PYRAMID), so a direct
mmg quality pass needs a ``triangulate()`` + orientation fix first; the
benchmark in ``examples/mmg3d/gyroid_benchmark.py`` walks through the
caveats.

Run::

    uv run examples/mmg3d/periodic_gyroid.py
"""

from __future__ import annotations

import numpy as np
import pyvista as pv

import mmgpy  # noqa: F401  -- registers the .mmg accessor

PERIOD = 1.0
THICKNESS = 1.0
HALF = THICKNESS / 2.0


def gyroid_f(points: np.ndarray) -> np.ndarray:
    """Evaluate the standard gyroid scalar field, period = ``PERIOD``."""
    k = 2.0 * np.pi / PERIOD
    sx, cx = np.sin(k * points[:, 0]), np.cos(k * points[:, 0])
    sy, cy = np.sin(k * points[:, 1]), np.cos(k * points[:, 1])
    sz, cz = np.sin(k * points[:, 2]), np.cos(k * points[:, 2])
    return sx * cy + sy * cz + sz * cx


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
    # Structured grid of [0, PERIOD]^3 with the gyroid shell scalar attached.
    # f^2 - (t/2)^2 is negative inside the shell, positive outside.
    n = 30
    img = pv.ImageData(
        dimensions=(n + 1,) * 3,
        spacing=(PERIOD / n,) * 3,
    )
    f = gyroid_f(np.asarray(img.points))
    img.point_data["shell_levelset"] = f * f - HALF * HALF

    # Keep cells where the scalar is negative (inside the shell). The clip
    # produces an UnstructuredGrid with mixed cell types — mostly TETRA from
    # voxels fully inside the shell, plus HEXAHEDRON / WEDGE / PYRAMID from
    # cells the iso-surface intersects.
    shell = img.clip_scalar(
        scalars="shell_levelset",
        value=0.0,
        invert=True,
    )
    bounds = tuple(round(b, 3) for b in shell.bounds)
    print(
        f"clip_scalar shell: {shell.n_cells} cells, "
        f"{shell.n_points} points, bounds {bounds}",
    )

    pts = np.asarray(shell.points)
    counts = face_node_counts(pts)
    print("\nCube-face node counts (matched on opposite faces):")
    for axis in "xyz":
        m, p = counts[f"{axis}-"], counts[f"{axis}+"]
        print(f"  {axis}- : {m:4d}    {axis}+ : {p:4d}    delta {abs(m - p)}")

    print(f"\nis_periodic(tol=1e-9) = {is_periodic(pts, 1e-9)}")

    celltypes = np.asarray(shell.celltypes)
    type_names = {10: "TETRA", 12: "HEXAHEDRON", 13: "WEDGE", 14: "PYRAMID"}
    bins = dict(zip(*np.unique(celltypes, return_counts=True), strict=True))
    print("\nCell-type breakdown:")
    for t, count in bins.items():
        print(f"  {type_names.get(int(t), f'type {t}')}: {count}")

    surface = shell.extract_surface(algorithm="dataset_surface")
    print(f"\nBoundary triangulation: {surface.n_cells} faces")

    pl = pv.Plotter(shape=(1, 2), window_size=(1500, 750))

    pl.subplot(0, 0)
    pl.add_mesh(shell, show_edges=True, color="steelblue", line_width=0.3)
    pl.add_mesh(
        pv.Cube(center=(PERIOD / 2,) * 3),
        opacity=0.1,
        color="white",
        show_edges=True,
        edge_color="gray",
    )
    pl.add_title(
        f"Periodic gyroid volume\n{shell.n_cells} cells",
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
