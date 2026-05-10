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
"""Anchoring FEM-tagged edges through 3D remesh with ``required_edges``.

Issue #226 added an ``edges`` parameter to ``Mesh`` so users can attach
edges with reference markers (``refs`` 1, 2, 3, ... that encode FEM
boundary conditions, material interfaces, or feature ridges). Once those
markers exist, the natural follow-up is *preserving* them through a
refinement: if MMG is allowed to coarsen, move, or drop the marked
edges, the BC tags are lost and the FEM problem can no longer be
reapplied.

This example loads ``assets/cube.mesh`` — a tetrahedral cube whose 120
ridge edges already carry refs 1..12 (one ref per cube edge group, 10
edges each). We pick a *subset* — refs ``(1, 4, 7)`` — and lock them
via ``cell_data["mmg_required_edges"]``. A full ``mesh.mmg.remesh()``
with ``hmax=0.07`` then refines the rest of the mesh roughly 1.5x, so
the **locked refs stay at 10 segments per cube edge while the free refs
get subdivided to ~14-16**. That gap is what makes the constraint
visually obvious.

Run::

    uv run examples/mmg3d/required_edges.py
"""

from __future__ import annotations

from pathlib import Path

import numpy as np
import pyvista as pv

import mmgpy  # noqa: F401  -- registers the .mmg accessor and Medit reader

_ASSETS = Path(__file__).resolve().parents[1].parent / "assets"
_LOCKED_REFS = (1, 4, 7)


def _line_count_for_ref(mesh: pv.UnstructuredGrid, ref: int) -> int:
    """Count the LINE cells whose ``refs`` array equals *ref*."""
    celltypes = np.asarray(mesh.celltypes)
    refs = np.asarray(mesh.cell_data["refs"])
    return int(((refs == ref) & (celltypes == pv.CellType.LINE)).sum())


def _line_subset(
    mesh: pv.UnstructuredGrid,
    ref_subset: tuple[int, ...],
) -> pv.UnstructuredGrid:
    """Extract the LINE cells whose ref is in *ref_subset*."""
    celltypes = np.asarray(mesh.celltypes)
    refs = np.asarray(mesh.cell_data["refs"])
    keep = (celltypes == pv.CellType.LINE) & np.isin(refs, ref_subset)
    return mesh.extract_cells(np.where(keep)[0])


def main() -> None:
    """Compare locked-vs-free edges in a cube remesh."""
    ds = pv.read(_ASSETS / "cube.mesh")
    print(f"Input: {ds.n_cells} cells, 120 LINE cells (refs 1..12, 10 each)")

    # Lock a subset; leave the rest free.
    celltypes = np.asarray(ds.celltypes)
    refs = np.asarray(ds.cell_data["refs"])
    lock_mask = (celltypes == pv.CellType.LINE) & np.isin(refs, _LOCKED_REFS)
    ds.cell_data["mmg_required_edges"] = lock_mask
    print(
        f"Locking {int(lock_mask.sum())} edges with refs in {_LOCKED_REFS}; "
        f"the other 9 ref groups are free.",
    )

    # Full remesh — refines everywhere except locked edges.
    out = ds.mmg.remesh(hmax=0.07, hmin=0.035, hausd=0.01, verbose=-1)
    print(f"\nOutput: {out.n_cells} cells")
    print("  segments per ref (locked refs marked with *):")
    for r in range(1, 13):
        marker = "*" if r in _LOCKED_REFS else " "
        print(f"   {marker} ref={r:2d}: {_line_count_for_ref(out, r):3d}")

    # Visualize: full output volume (translucent) + the LINE cells split into
    # "locked" (green, original 10-segment positions) and "free" (red,
    # heavily subdivided). The colour split makes the constraint immediate.
    free_refs = tuple(r for r in range(1, 13) if r not in _LOCKED_REFS)
    locked_lines = _line_subset(out, _LOCKED_REFS)
    free_lines = _line_subset(out, free_refs)

    pl = pv.Plotter(window_size=(1100, 800))
    pl.add_mesh(
        out,
        opacity=0.12,
        color="lightsteelblue",
        show_edges=False,
    )
    pl.add_mesh(
        locked_lines,
        color="seagreen",
        line_width=8.0,
        label=f"locked (refs {_LOCKED_REFS}): {locked_lines.n_cells} segments",
    )
    pl.add_mesh(
        free_lines,
        color="firebrick",
        line_width=2.5,
        label=f"free (refs {free_refs}): {free_lines.n_cells} segments",
    )
    pl.add_legend(face=None, bcolor="white")
    pl.add_title(
        "required_edges: locked refs keep their 10 segments;\n"
        "free refs get refined by mmg's full remesh",
        font_size=10,
    )
    pl.camera_position = "iso"
    pl.show()


if __name__ == "__main__":
    main()
