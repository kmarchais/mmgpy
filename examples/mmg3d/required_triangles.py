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
"""Anchoring boundary patches through 3D remesh with ``required_triangles``.

The ``required_triangles`` constraint locks specific boundary faces in
place during ``mesh.mmg.remesh()``. This is the analogue of microgen's
``RequiredTriangles`` MEDIT-file trick that makes
``remesh_keeping_boundaries_for_fem`` work — and the canonical
application is *periodic-preserving* quality remesh: lock every cube
boundary triangle so the periodic node-pair structure of the input
survives the refinement
(``mesh.mmg.remesh(..., required_triangles=...)`` on a periodic input
keeps it periodic).

To make the constraint visible at a glance, this example locks only the
``x = 0`` and ``x = 1`` faces of a tetrahedral unit cube and leaves the
``y`` / ``z`` faces free. After
``mesh.mmg.remesh(hmax=0.06, hmin=0.03, hausd=0.02)``:

- the locked **x faces keep their 81-vertex triangulation byte-identical
  to the input** — every original vertex survives, no new vertex
  appears;
- the free **y / z faces get refined ~5x** (81 -> ~370 vertices) by
  mmg's hmax-driven refinement.

Run::

    uv run examples/mmg3d/required_triangles.py
"""

from __future__ import annotations

import numpy as np
import pyvista as pv

import mmgpy  # noqa: F401  -- registers the .mmg accessor


def _attach_boundary_triangles(
    volume: pv.UnstructuredGrid,
) -> pv.UnstructuredGrid:
    """Return a copy of *volume* with its boundary triangles added as cells.

    MMG's required-triangles API operates on triangles that are
    explicitly in the mesh; for a tet-only ``UnstructuredGrid`` we have
    to splice the boundary surface back in using the original vertex
    numbering.
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


def _face_vertex_count(points: np.ndarray, axis: int, value: float) -> int:
    """Count vertices within 1e-6 of the cube face ``axis = value``."""
    return int(np.sum(np.abs(points[:, axis] - value) < 1e-6))


def main() -> None:
    """Lock x faces, leave y/z free, show the asymmetric refinement."""
    n = 8
    img = pv.ImageData(dimensions=(n + 1,) * 3, spacing=(1.0 / n,) * 3)
    volume = img.cast_to_unstructured_grid().triangulate()
    ds = _attach_boundary_triangles(volume)
    print(
        f"Input: {ds.n_cells} cells "
        f"({volume.n_cells} tets + "
        f"{ds.n_cells - volume.n_cells} boundary tris)",
    )

    # Lock only triangles on the x=0 and x=1 faces.
    centers = ds.cell_centers().points
    is_tri = np.asarray(ds.celltypes) == pv.CellType.TRIANGLE
    on_x_face = is_tri & (
        (np.abs(centers[:, 0]) < 1e-6) | (np.abs(centers[:, 0] - 1.0) < 1e-6)
    )
    ds.cell_data["mmg_required_triangles"] = on_x_face
    print(
        f"Locked {int(on_x_face.sum())} triangles on x faces; "
        f"{int(is_tri.sum() - on_x_face.sum())} y/z-face triangles are free.",
    )

    out = ds.mmg.remesh(hmax=0.06, hmin=0.03, hausd=0.02, verbose=-1)
    print(f"\nOutput: {out.n_cells} cells")

    in_pts = np.asarray(ds.points)
    out_pts = np.asarray(out.points)
    print("\nFace vertex counts (input -> output):")
    for axis, name in enumerate("xyz"):
        for value in (0.0, 1.0):
            n_in = _face_vertex_count(in_pts, axis, value)
            n_out = _face_vertex_count(out_pts, axis, value)
            marker = " (locked)" if axis == 0 else ""
            print(f"  {name}={value}: {n_in:3d} -> {n_out:4d}{marker}")

    # Render the output's boundary surface coloured by locked / free.
    bnd = out.extract_surface(algorithm="dataset_surface")
    bnd_centers = bnd.cell_centers().points
    label = np.zeros(bnd.n_cells, dtype=np.int32)
    on_x_bnd = (np.abs(bnd_centers[:, 0]) < 1e-6) | (
        np.abs(bnd_centers[:, 0] - 1.0) < 1e-6
    )
    label[on_x_bnd] = 0  # locked
    label[~on_x_bnd] = 1  # free
    bnd.cell_data["locked"] = label

    pl = pv.Plotter(window_size=(1100, 800))
    pl.add_mesh(
        bnd,
        scalars="locked",
        cmap=["seagreen", "firebrick"],
        clim=(0, 1),
        show_edges=True,
        edge_color="black",
        line_width=0.4,
        annotations={0: "locked (x faces)", 1: "free (y, z faces)"},
    )
    pl.add_title(
        "required_triangles: x faces locked -> preserved\n"
        "y, z faces free -> refined by mmg's hmax",
        font_size=10,
    )
    pl.camera_position = "iso"
    pl.show()


if __name__ == "__main__":
    main()
