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

This example builds two 2D meshes of ``[0, 1]^2``:

- a **baseline** triangulation (no explicit edge cells) — refine and
  observe that MMG infers boundary edges from the triangle skin only;
- a **constrained** version that adds an interior interface at
  ``y = 0.5`` as ``LINE`` cells with ``ref = 10`` and locks them via
  ``cell_data["mmg_required_edges"]``. After remesh, every refined
  sub-segment of the interface keeps its ref=10 tag, so an FEM solver
  still has the interface boundary it needs.

Run::

    uv run examples/mmg2d/required_edges.py
"""

from __future__ import annotations

import numpy as np
import pyvista as pv

import mmgpy  # noqa: F401  -- registers the .mmg accessor
from mmgpy import polydata_from_2d_triangles

_INTERFACE_REF = 10
_PALETTE = ("#dddddd", "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#e377c2")


def _grid_points_and_triangles(n: int = 6) -> tuple[np.ndarray, np.ndarray]:
    """Regular n x n triangulation of ``[0, 1]^2``."""
    coord = np.linspace(0.0, 1.0, n + 1)
    xs, ys = np.meshgrid(coord, coord, indexing="ij")
    points = np.column_stack([xs.ravel(), ys.ravel()]).astype(np.float64)
    tris = []
    for i in range(n):
        for j in range(n):
            v00 = i * (n + 1) + j
            v10 = (i + 1) * (n + 1) + j
            v01 = i * (n + 1) + j + 1
            v11 = (i + 1) * (n + 1) + j + 1
            tris.append([v00, v10, v11])
            tris.append([v00, v11, v01])
    return points, np.asarray(tris, dtype=np.int32)


def _with_required_interface(
    points: np.ndarray,
    triangles: np.ndarray,
    n: int,
) -> pv.PolyData:
    """Return ``pv.PolyData`` with horizontal interface lines marked required.

    The interface segments are added as ``LINE`` cells with
    ``ref = _INTERFACE_REF``; the same indices are flagged in
    ``cell_data["mmg_required_edges"]`` so the accessor routes them to
    ``MmgMesh2D.set_required_edges`` before the remesh runs. mmg2d
    aborts on unanchored interior edges, so the required tag is what
    keeps the example portable.
    """
    j_int = n // 2
    edges = np.array(
        [[i * (n + 1) + j_int, (i + 1) * (n + 1) + j_int] for i in range(n)],
        dtype=np.int64,
    )
    lines_flat = np.column_stack(
        [np.full(len(edges), 2, dtype=np.int64), edges],
    ).ravel()

    verts3d = np.column_stack([points, np.zeros(len(points))])
    faces_flat = np.column_stack(
        [np.full(len(triangles), 3, dtype=np.int32), triangles],
    ).ravel()

    pd = pv.PolyData(verts3d, faces=faces_flat, lines=lines_flat)
    pd.cell_data["refs"] = np.concatenate(
        [
            np.full(len(edges), _INTERFACE_REF, dtype=np.int64),
            np.zeros(len(triangles), dtype=np.int64),
        ],
    )
    # Lock every interface segment so mmg2d preserves them through the
    # remesh (and they retain their ref=10 tag in the output).
    mask = np.zeros(pd.n_cells, dtype=bool)
    mask[: pd.n_lines] = True
    pd.cell_data["mmg_required_edges"] = mask
    return pd


def _interface_edge_count(mesh: pv.PolyData) -> int:
    refs = np.asarray(mesh.cell_data.get("refs", []))
    if refs.size == 0:
        return 0
    return int((refs[: mesh.n_lines] == _INTERFACE_REF).sum())


def main() -> None:
    """Demonstrate FEM-edge preservation via ``mmg_required_edges``."""
    n = 6
    points, tris = _grid_points_and_triangles(n=n)

    # ----- Baseline: no explicit LINE cells, just the triangulation. ----
    baseline = polydata_from_2d_triangles(points, tris)
    baseline_out = baseline.mmg.remesh(hsiz=0.07, verbose=-1)
    print(
        f"Baseline (triangulation only): "
        f"{baseline.n_cells} -> {baseline_out.n_cells} cells, "
        f"{_interface_edge_count(baseline_out)} ref={_INTERFACE_REF} segments",
    )

    # ----- Constrained: same domain + interior interface, all required.
    pd = _with_required_interface(points, tris, n=n)
    locked = pd.mmg.remesh(hsiz=0.07, verbose=-1)
    print(
        f"Constrained (interface required): "
        f"{pd.n_cells} -> {locked.n_cells} cells, "
        f"{_interface_edge_count(pd)} -> {_interface_edge_count(locked)} "
        f"ref={_INTERFACE_REF} segments",
    )

    # ----- Visualization ----------------------------------------------
    pl = pv.Plotter(shape=(1, 3), window_size=(1800, 600))
    bar = {"title": "edge ref", "n_labels": 5, "fmt": "%d", "vertical": True}
    panels = [
        (
            pd,
            f"Input (with interface)\n"
            f"{_interface_edge_count(pd)} ref={_INTERFACE_REF} segments",
        ),
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
