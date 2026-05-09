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
"""Preserving FEM boundary-condition edges through 2D remesh.

Issue #226 added an ``edges`` parameter to ``Mesh`` so users can attach
edges with reference markers (``refs`` 1, 2, 3, ... that encode FEM
boundary conditions or material interfaces). Once the mesh has those
markers, refining the rest of the mesh while *preserving the marked
edges* is the natural next request: if MMG is allowed to coarsen or
move those edges, the BC tags are lost and the FEM problem can no
longer be reapplied.

This example builds a 2D unit square with:

- four boundary edges (refs 1..4 — Dirichlet, Neumann, etc.)
- an interior horizontal interface at ``y = 0.5`` (ref 10 — material
  boundary)

Then it remeshes once *without* constraints (the interior interface is
re-tessellated and most of its segments lose their ref=10 tag) and once
*with* every interface segment marked via the new
``cell_data["mmg_required_edges"]`` tag (segments survive intact and
ref=10 is preserved on every refined sub-segment).

Run::

    uv run examples/mmg2d/required_edges.py
"""

from __future__ import annotations

import numpy as np
import pyvista as pv

import mmgpy  # noqa: F401  -- registers the .mmg accessor

_BOUNDARY_REFS = (1, 2, 3, 4)  # bottom, top, left, right
_INTERFACE_REF = 10


def _build_square_with_interface(n: int = 6) -> pv.PolyData:
    """2D triangulation of [0, 1]² with explicit boundary + interior edges.

    The triangulation is the regular ``n x n`` grid split into two triangles
    per quad. ``LINE`` cells are added along all four boundary sides
    (``refs`` 1..4) plus the horizontal interior interface at ``y = 0.5``
    (``ref`` 10).
    """
    coord = np.linspace(0.0, 1.0, n + 1)
    xs, ys = np.meshgrid(coord, coord, indexing="ij")
    points = np.column_stack([xs.ravel(), ys.ravel(), np.zeros(xs.size)])

    tris = []
    for i in range(n):
        for j in range(n):
            v00 = i * (n + 1) + j
            v10 = (i + 1) * (n + 1) + j
            v01 = i * (n + 1) + j + 1
            v11 = (i + 1) * (n + 1) + j + 1
            tris.append([v00, v10, v11])
            tris.append([v00, v11, v01])
    tris = np.asarray(tris, dtype=np.int64)

    j_int = n // 2  # row index of the y=0.5 line for even n
    edges: list[list[int]] = []
    edge_refs: list[int] = []
    for i in range(n):  # bottom (y = 0)
        edges.append([i * (n + 1), (i + 1) * (n + 1)])
        edge_refs.append(_BOUNDARY_REFS[0])
    for i in range(n):  # top (y = 1)
        edges.append([i * (n + 1) + n, (i + 1) * (n + 1) + n])
        edge_refs.append(_BOUNDARY_REFS[1])
    for j in range(n):  # left (x = 0)
        edges.append([j, j + 1])
        edge_refs.append(_BOUNDARY_REFS[2])
    for j in range(n):  # right (x = 1)
        edges.append([n * (n + 1) + j, n * (n + 1) + j + 1])
        edge_refs.append(_BOUNDARY_REFS[3])
    for i in range(n):  # interior interface (y = 0.5)
        edges.append([i * (n + 1) + j_int, (i + 1) * (n + 1) + j_int])
        edge_refs.append(_INTERFACE_REF)
    edges = np.asarray(edges, dtype=np.int64)
    edge_refs = np.asarray(edge_refs, dtype=np.int64)

    lines_flat = np.empty((len(edges), 3), dtype=np.int64)
    lines_flat[:, 0] = 2
    lines_flat[:, 1:] = edges
    polys_flat = np.empty((len(tris), 4), dtype=np.int64)
    polys_flat[:, 0] = 3
    polys_flat[:, 1:] = tris

    pd = pv.PolyData()
    pd.points = points
    pd.lines = lines_flat.flatten()
    pd.faces = polys_flat.flatten()
    # PolyData orders cells: verts (0) | lines | polys | strips. So edge refs
    # come first in the cell_data["refs"] array, triangle refs (=0) follow.
    pd.cell_data["refs"] = np.concatenate(
        [edge_refs, np.zeros(len(tris), dtype=np.int64)],
    )
    return pd


def _interface_edge_count(mesh: pv.PolyData) -> int:
    """Return the number of LINE cells with ref == _INTERFACE_REF."""
    refs = np.asarray(mesh.cell_data.get("refs", []))
    if refs.size == 0:
        return 0
    return int((refs[: mesh.n_lines] == _INTERFACE_REF).sum())


def main() -> None:
    """Demonstrate FEM-edge preservation via ``mmg_required_edges``."""
    pd = _build_square_with_interface(n=6)
    n_int_in = _interface_edge_count(pd)
    print(
        f"Input: {pd.n_cells} cells "
        f"({pd.n_lines} edges, {pd.n_cells - pd.n_lines} triangles); "
        f"{n_int_in} interface segments (ref={_INTERFACE_REF}).",
    )

    # 1. Refine WITHOUT constraints — MMG re-tessellates the interior, and the
    # interface segments are split / dropped (their ref=10 tag is lost).
    free = pd.mmg.remesh(hsiz=0.07, verbose=-1)
    print(
        f"\nNo constraints: {free.n_cells} cells, "
        f"{_interface_edge_count(free)} edges still tagged ref={_INTERFACE_REF}",
    )

    # 2. Refine WITH the interior interface marked — every refined sub-segment
    # inherits the ref=10 tag because the original lines are required.
    mask = np.zeros(pd.n_cells, dtype=bool)
    refs = np.asarray(pd.cell_data["refs"])
    mask[: pd.n_lines] = refs[: pd.n_lines] == _INTERFACE_REF
    pd.cell_data["mmg_required_edges"] = mask
    locked = pd.mmg.remesh(hsiz=0.07, verbose=-1)
    print(
        f"required_edges (ref={_INTERFACE_REF}): {locked.n_cells} cells, "
        f"{_interface_edge_count(locked)} segments still tagged "
        f"ref={_INTERFACE_REF}",
    )

    # ---------------- Visualization ----------------
    pl = pv.Plotter(shape=(1, 3), window_size=(1800, 600))
    bar = {"title": "edge ref", "n_labels": 5, "fmt": "%d", "vertical": True}

    pl.subplot(0, 0)
    pl.add_mesh(
        pd,
        scalars="refs",
        cmap=["#dddddd", "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#e377c2"],
        clim=(0, _INTERFACE_REF),
        show_edges=True,
        line_width=2.0,
        scalar_bar_args=bar,
    )
    pl.add_title(
        f"Input\n{pd.n_lines} edges, {n_int_in} marked ref={_INTERFACE_REF}",
        font_size=10,
    )
    pl.view_xy()
    pl.camera.zoom(1.3)

    pl.subplot(0, 1)
    pl.add_mesh(
        free,
        scalars="refs",
        cmap=["#dddddd", "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#e377c2"],
        clim=(0, _INTERFACE_REF),
        show_edges=True,
        line_width=2.0,
        scalar_bar_args=bar,
    )
    pl.add_title(
        f"No constraints\n{_interface_edge_count(free)} interface segments left",
        font_size=10,
    )
    pl.view_xy()
    pl.camera.zoom(1.3)

    pl.subplot(0, 2)
    pl.add_mesh(
        locked,
        scalars="refs",
        cmap=["#dddddd", "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#e377c2"],
        clim=(0, _INTERFACE_REF),
        show_edges=True,
        line_width=2.0,
        scalar_bar_args=bar,
    )
    pl.add_title(
        f"required_edges\n{_interface_edge_count(locked)} interface segments left",
        font_size=10,
    )
    pl.view_xy()
    pl.camera.zoom(1.3)

    pl.link_views()
    pl.show()


if __name__ == "__main__":
    main()
