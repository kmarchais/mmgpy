# /// script
# requires-python = ">=3.10"
# dependencies = [
#     "mmgpy",
#     "numpy",
#     "pyvista",
#     "scipy",
# ]
#
# [tool.uv.sources]
# mmgpy = { path = "../.." }
# ///
"""Periodic-gyroid mesh attempt via MMG-LS + boundary repair.

This example chains the gyroid level-set workflow
(``examples/mmg3d/gyroid_unit_cube.py``) with the periodic-boundary
recipe (``examples/mmg3d/periodic_remesh.py``):

1. Build a voxel-triangulated tet box of ``[0, 1]^3``. The resulting mesh
   is periodic by construction — opposite cube faces have matching node
   positions because each voxel splits into the same six-tet pattern.
2. Sample the thick-gyroid level-set ``f^2 - (t/2)^2`` at every vertex.
3. Run ``mesh.mmg.remesh_levelset(...)``. The output has the gyroid
   iso-surface as an explicit interface (refs 2 = void, 3 = solid).

The catch: MMG3D's level-set adaptation is *not* periodicity-aware. It
inserts iso/cube-face crossing nodes on each cube face independently,
so opposite faces end up with different node counts (typically a
few-percent mismatch). After ``mmg-LS``, this script attempts to recover
periodicity by snapping nodes that drifted within a tolerance of a cube
face back onto the face — that pulls the bulk of the boundary into
place but doesn't fix the count mismatch. The script reports the
residual error so you can see where the workflow stops short.

For strict periodicity, the established path is gmsh's
``setPeriodic`` constraint (used by ``microgen.mesh_periodic``) for the
initial mesh, then ``mesh.mmg.remesh(..., required_triangles=...)`` for
quality optimization without disturbing the boundary — see
``examples/mmg3d/periodic_remesh.py`` for the second half of that
recipe.

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


def gyroid_levelset(points: np.ndarray) -> np.ndarray:
    """Thick-gyroid level-set ``f^2 - (t/2)^2`` (negative inside the shell)."""
    k = 2.0 * np.pi / PERIOD
    sx, cx = np.sin(k * points[:, 0]), np.cos(k * points[:, 0])
    sy, cy = np.sin(k * points[:, 1]), np.cos(k * points[:, 1])
    sz, cz = np.sin(k * points[:, 2]), np.cos(k * points[:, 2])
    f = sx * cy + sy * cz + sz * cx
    return (f * f - HALF * HALF).reshape(-1, 1)


def is_periodic(points: np.ndarray, tol: float = 1e-9) -> bool:
    """Inline copy of ``microgen.mesh.is_periodic`` (mesh.py:246)."""
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


def face_node_counts(points: np.ndarray, tol: float) -> dict[str, int]:
    """Count nodes within *tol* of each cube face."""
    return {
        f"{axis}{sign}": int(
            (
                np.abs(
                    points[:, i] - (0.0 if sign == "-" else 1.0),
                )
                < tol
            ).sum(),
        )
        for i, axis in enumerate("xyz")
        for sign in "-+"
    }


def snap_to_cube(points: np.ndarray, tol: float) -> np.ndarray:
    """Snap nodes within *tol* of a cube face back to the face."""
    out = points.copy()
    for axis in range(3):
        out[np.abs(out[:, axis]) < tol, axis] = 0.0
        out[np.abs(out[:, axis] - 1.0) < tol, axis] = 1.0
    return out


def main() -> None:
    """Periodic-gyroid mesh attempt with explicit residual-error reporting."""
    n = 14
    img = pv.ImageData(dimensions=(n + 1,) * 3, spacing=(1.0 / n,) * 3)
    bg = img.cast_to_unstructured_grid().triangulate()
    print(
        f"[1] Background: {bg.n_cells} tets, {bg.n_points} pts; "
        f"is_periodic(1e-9)={is_periodic(np.asarray(bg.points), 1e-9)}",
    )

    levelset = gyroid_levelset(np.asarray(bg.points))
    result = bg.mmg.remesh_levelset(
        levelset,
        ls=0.0,
        hmax=0.08,
        hmin=0.04,
        hausd=0.015,
        hgrad=1.3,
        verbose=-1,
    )
    refs = np.asarray(result.cell_data["refs"])
    solid = result.extract_cells(np.where(refs == 3)[0]).clean()
    print(
        f"[2] After mmg-LS: {result.n_cells} cells "
        f"(solid refs=3: {solid.n_cells}); "
        f"is_periodic(1e-7)={is_periodic(np.asarray(result.points), 1e-7)}",
    )

    snapped = result.copy()
    snap_tol = 0.02  # ~hausd
    snapped.points = snap_to_cube(np.asarray(result.points), snap_tol)
    print(
        f"[3] After snap (tol={snap_tol}): "
        f"is_periodic(1e-9)={is_periodic(np.asarray(snapped.points), 1e-9)}",
    )

    # Diagnostic: how close are opposite-face node counts?
    counts = face_node_counts(np.asarray(snapped.points), 1e-9)
    print("    Cube-face node counts (after snap):")
    for axis in "xyz":
        m, p = counts[f"{axis}-"], counts[f"{axis}+"]
        delta = abs(m - p)
        print(
            f"      {axis}- vs {axis}+: {m} vs {p} "
            f"(delta {delta}, {100 * delta / max(m, p):.1f}%)",
        )

    print(
        "\nNote: mmg-LS inserts iso/cube-face crossing nodes per face "
        "independently, so opposite faces drift apart by a few percent. "
        "For strict periodicity, see examples/mmg3d/periodic_remesh.py "
        "(quality remesh with required_triangles on a periodic input).",
    )

    # Visualization: the solid gyroid + a translucent unit cube outline.
    pl = pv.Plotter(window_size=(1100, 800))
    pl.add_mesh(
        solid,
        show_edges=True,
        color="steelblue",
        edge_color="navy",
        line_width=0.2,
    )
    pl.add_mesh(
        pv.Cube(center=(0.5, 0.5, 0.5)),
        opacity=0.1,
        color="white",
        show_edges=True,
        edge_color="gray",
    )
    pl.add_title(
        f"Periodic-attempt gyroid: {solid.n_cells} solid tets",
        font_size=10,
    )
    pl.camera_position = "iso"
    pl.show()


if __name__ == "__main__":
    main()
