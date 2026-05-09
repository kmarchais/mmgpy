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
"""Anchoring FEM edges through 2D remesh with ``required_edges``.

Issue #226 added an ``edges`` parameter to ``Mesh`` so users can attach
edges with reference markers (``refs`` 1, 2, 3, ... that encode FEM
boundary conditions or material interfaces). Once those markers exist,
the natural follow-up is *preserving* them through a refinement: if MMG
is allowed to coarsen, move, or drop the marked edges, the BC tags are
lost and the FEM problem can no longer be reapplied.

This example builds two meshes of ``[0, 1]^2``:

- a **baseline** with only the four boundary edges (refs 1..4);
- the same mesh **plus an interior horizontal interface** at ``y = 0.5``
  with ``ref = 10`` — added as ``LINE`` cells *and* flagged via
  ``cell_data["mmg_required_edges"]`` so MMG locks them.

After remesh, the baseline only carries refs 1..4 (no interior
interface), while the constrained mesh keeps every refined sub-segment
of ref=10 — so an FEM solver still has the interface boundary it needs.

Run::

    uv run examples/mmg2d/required_edges.py
"""

from __future__ import annotations

import numpy as np
import pyvista as pv

import mmgpy  # noqa: F401  -- registers the .mmg accessor

_BOUNDARY_REFS = (1, 2, 3, 4)  # bottom, top, left, right
_INTERFACE_REF = 10
_PALETTE = ("#dddddd", "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#e377c2")


def _build(n: int = 6, *, with_interface: bool) -> pv.PolyData:
    """Build a regular n x n triangulation of ``[0, 1]^2`` with edge refs.

    ``with_interface=False`` returns just the triangulation + four boundary
    edges (refs 1..4). ``with_interface=True`` additionally adds n explicit
    ``LINE`` cells along ``y = 0.5`` with ``ref = _INTERFACE_REF``; those
    interior segments must be marked required when calling MMG, otherwise
    mmg2d may abort on the unanchored interior edges.
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
    if with_interface:
        j_int = n // 2
        for i in range(n):
            edges.append(
                [i * (n + 1) + j_int, (i + 1) * (n + 1) + j_int],
            )
            edge_refs.append(_INTERFACE_REF)

    edges = np.asarray(edges, dtype=np.int64)
    edge_refs = np.asarray(edge_refs, dtype=np.int64)

    lines_flat = np.empty((len(edges), 3), dtype=np.int64)
    lines_flat[:, 0] = 2
    lines_flat[:, 1:] = edges
    polys_flat = np.empty((len(tris), 4), dtype=np.int64)
    polys_flat[:, 0] = 3
    polys_flat[:, 1:] = tris

    pd = pv.PolyData(
        points,
        faces=polys_flat.flatten(),
        lines=lines_flat.flatten(),
    )
    # PolyData orders cells: verts (0) | lines | polys | strips.
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
    # ----- Baseline: refine without any interior interface ------------
    baseline = _build(n=6, with_interface=False)
    baseline_out = baseline.mmg.remesh(hsiz=0.07, verbose=-1)
    print(
        f"Baseline (boundary edges only): "
        f"{baseline.n_cells} -> {baseline_out.n_cells} cells, "
        f"{_interface_edge_count(baseline_out)} ref={_INTERFACE_REF} segments",
    )

    # ----- Constrained: same domain + interior interface, all required
    pd = _build(n=6, with_interface=True)
    n_int_in = _interface_edge_count(pd)

    refs = np.asarray(pd.cell_data["refs"])
    mask = np.zeros(pd.n_cells, dtype=bool)
    mask[: pd.n_lines] = refs[: pd.n_lines] == _INTERFACE_REF
    pd.cell_data["mmg_required_edges"] = mask

    locked = pd.mmg.remesh(hsiz=0.07, verbose=-1)
    print(
        f"Constrained (interface required): "
        f"{pd.n_cells} -> {locked.n_cells} cells, "
        f"{n_int_in} -> {_interface_edge_count(locked)} ref={_INTERFACE_REF} segments",
    )

    # ----- Visualization ----------------------------------------------
    pl = pv.Plotter(shape=(1, 3), window_size=(1800, 600))
    bar = {"title": "edge ref", "n_labels": 5, "fmt": "%d", "vertical": True}
    panels = [
        (pd, f"Input (with interface)\n{n_int_in} ref={_INTERFACE_REF} segments"),
        (
            baseline_out,
            f"Baseline remesh\n0 ref={_INTERFACE_REF} (no interface)",
        ),
        (
            locked,
            f"Constrained remesh\n"
            f"{_interface_edge_count(locked)} ref={_INTERFACE_REF} segments preserved",
        ),
    ]
    for col, (mesh, title) in enumerate(panels):
        pl.subplot(0, col)
        pl.add_mesh(
            mesh,
            scalars="refs",
            cmap=list(_PALETTE),
            clim=(0, _INTERFACE_REF),
            show_edges=True,
            line_width=2.0,
            scalar_bar_args=bar,
        )
        pl.add_title(title, font_size=10)
        pl.view_xy()
        pl.camera.zoom(1.3)
    pl.link_views()
    pl.show()


if __name__ == "__main__":
    main()
