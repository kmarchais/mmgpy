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
"""Periodic-preserving remesh via the ``required_triangles`` tag.

A periodic FEM cube must keep matching node positions on opposite faces so
that periodic boundary conditions can be glued. MMG's standard remesh
adapts boundary nodes independently on each face and breaks periodicity.
microgen's ``remesh_keeping_boundaries_for_fem`` works around this by
writing every boundary triangle into the MEDIT file's ``RequiredTriangles``
section: required triangles are locked, so the boundary doesn't move.

This example reproduces that recipe in pure Python via the ``.mmg``
accessor's new constraint-marker support — set
``cell_data["mmg_required_triangles"]`` to a length-``n_cells`` bool mask
and ``mesh.mmg.remesh(...)`` will route those indices to MMG's
``set_required_triangles``. The output stays periodic; the same call
without the tag drifts.

Run::

    uv run examples/mmg3d/periodic_remesh.py
"""

from __future__ import annotations

import numpy as np
import pyvista as pv

import mmgpy  # noqa: F401  -- registers the .mmg accessor


def _attach_boundary_triangles(
    volume: pv.UnstructuredGrid,
) -> pv.UnstructuredGrid:
    """Return a copy of *volume* with its boundary triangles added as cells.

    MMG's required-triangles API operates on triangles that are explicitly
    in the mesh; for a tet-only ``UnstructuredGrid`` we have to splice the
    boundary surface back in using the original vertex numbering.
    """
    bnd = volume.extract_surface(
        algorithm="dataset_surface",
        pass_pointid=True,
    )
    faces = np.asarray(bnd.faces).reshape(-1, 4)
    if not (faces[:, 0] == 3).all():
        msg = "Expected pure triangles after extract_surface"
        raise ValueError(msg)
    orig_ids = np.asarray(
        bnd.point_data["vtkOriginalPointIds"],
        dtype=np.int64,
    )
    tris = orig_ids[faces[:, 1:]]
    tets = np.asarray(
        volume.cells_dict[pv.CellType.TETRA],
        dtype=np.int64,
    )

    flat: list[int] = []
    for t in tets:
        flat.extend([4, *t])
    for t in tris:
        flat.extend([3, *t])
    cells = np.asarray(flat, dtype=np.int64)
    cell_types = np.concatenate(
        [
            np.full(len(tets), pv.CellType.TETRA, dtype=np.uint8),
            np.full(len(tris), pv.CellType.TRIANGLE, dtype=np.uint8),
        ],
    )
    return pv.UnstructuredGrid(cells, cell_types, np.asarray(volume.points))


def is_periodic(points: np.ndarray, tol: float = 1e-9) -> bool:
    """Inline copy of ``microgen.mesh.is_periodic`` (mesh.py:246).

    Sorts opposite-face nodes by their lateral coordinates and checks the
    componentwise difference is below *tol*.
    """
    dim = points.shape[1]
    axes = "xyz"[:dim]
    pmin = points.min(axis=0)
    pmax = points.max(axis=0)

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
        diff = points[p][:, slc] - points[m][:, slc]
        if (np.abs(diff) > tol).any():
            return False
    return True


def main() -> None:
    """Demonstrate periodic-preserving remesh via ``mmg_required_triangles``."""
    # Voxel-grid triangulation of [0, 1]^3 — periodic boundary by construction.
    n = 7
    img = pv.ImageData(dimensions=(n + 1,) * 3, spacing=(1.0 / n,) * 3)
    volume = img.cast_to_unstructured_grid().triangulate()
    print(
        f"Background tet box: {volume.n_cells} tets, {volume.n_points} points",
    )
    print(f"  periodic? {is_periodic(np.asarray(volume.points), tol=1e-9)}")

    # Attach explicit boundary triangles so MMG sees them and we can lock them.
    ds = _attach_boundary_triangles(volume)
    n_tri = int((np.asarray(ds.celltypes) == pv.CellType.TRIANGLE).sum())
    print(
        f"With boundary triangles: {ds.n_cells} cells "
        f"({ds.n_cells - n_tri} tets + {n_tri} tris)",
    )

    # ---------------------------------------------------------------
    # 1. Refine WITHOUT required triangles → MMG drifts the boundary.
    # ---------------------------------------------------------------
    drifted = ds.mmg.remesh(hmax=0.08, hmin=0.05, hausd=0.02, verbose=-1)
    print(
        f"\nNo constraints: {drifted.n_cells} cells, "
        f"periodic? {is_periodic(np.asarray(drifted.points), tol=1e-7)}",
    )

    # ---------------------------------------------------------------
    # 2. Refine WITH every boundary triangle locked → periodicity holds.
    # ---------------------------------------------------------------
    tri_mask = np.asarray(ds.celltypes) == pv.CellType.TRIANGLE
    ds.cell_data["mmg_required_triangles"] = tri_mask
    locked = ds.mmg.remesh(hmax=0.08, hmin=0.05, hausd=0.02, verbose=-1)
    print(
        f"All boundary triangles required: {locked.n_cells} cells, "
        f"periodic? {is_periodic(np.asarray(locked.points), tol=1e-7)}",
    )

    # Visual check.
    pl = pv.Plotter(shape=(1, 2), window_size=(1400, 700))
    pl.subplot(0, 0)
    pl.add_mesh(drifted, show_edges=True, color="lightcoral", line_width=0.4)
    pl.add_title(
        f"No constraint\n{drifted.n_cells} cells (periodicity broken)",
        font_size=10,
    )
    pl.subplot(0, 1)
    pl.add_mesh(locked, show_edges=True, color="lightgreen", line_width=0.4)
    pl.add_title(
        f"required_triangles=all boundary\n{locked.n_cells} cells (still periodic)",
        font_size=10,
    )
    pl.link_views()
    pl.camera_position = [(2.4, 2.4, 2.4), (0.5, 0.5, 0.5), (0, 0, 1)]
    pl.show()


if __name__ == "__main__":
    main()
