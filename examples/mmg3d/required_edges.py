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
ridge edges already carry refs 1..12, one per cube corner triple. We
pick a few of those edges, lock them via the new
``cell_data["mmg_required_edges"]`` tag, and remesh.

The locked subset survives byte-identically; the remaining edges may be
re-tessellated by MMG, but their refs (1..12) are preserved by mmg3d's
default boundary handling. The takeaway is that the *tagged-edge*
identity needed for FEM BCs can be guaranteed across remesh.

Run::

    uv run examples/mmg3d/required_edges.py
"""

from __future__ import annotations

from pathlib import Path

import numpy as np
import pyvista as pv

import mmgpy  # noqa: F401  -- registers the .mmg accessor and Medit reader

_ASSETS = Path(__file__).resolve().parents[1].parent / "assets"


def _line_cells_with_ref(mesh: pv.UnstructuredGrid, ref: int) -> np.ndarray:
    """Return global cell indices of LINE cells whose ref equals *ref*."""
    celltypes = np.asarray(mesh.celltypes)
    is_line = celltypes == pv.CellType.LINE
    refs = np.asarray(mesh.cell_data["refs"])
    return np.where(is_line & (refs == ref))[0]


def main() -> None:
    """Demonstrate FEM-edge preservation via ``mmg_required_edges``."""
    ds = pv.read(_ASSETS / "cube.mesh")
    n_lines_in = int((np.asarray(ds.celltypes) == pv.CellType.LINE).sum())
    line_refs = np.unique(
        np.asarray(ds.cell_data["refs"])[np.asarray(ds.celltypes) == pv.CellType.LINE],
    )
    print(
        f"Input: {ds.n_cells} cells "
        f"({n_lines_in} ridge LINE cells with refs {line_refs.tolist()})",
    )

    # Pick the LINE cells whose ref is in {1, 4, 7} — a subset of the cube
    # edges. These are the edges we must preserve byte-identically because
    # they carry application-specific BC tags.
    target_refs = (1, 4, 7)
    locked_idx = np.concatenate(
        [_line_cells_with_ref(ds, r) for r in target_refs],
    )
    mask = np.zeros(ds.n_cells, dtype=bool)
    mask[locked_idx] = True
    ds.cell_data["mmg_required_edges"] = mask
    print(
        f"Locking {mask.sum()} edges with refs in {target_refs} "
        f"via cell_data['mmg_required_edges']",
    )

    out = ds.mmg.remesh(hmax=0.1, hmin=0.05, hausd=0.01, verbose=-1)
    n_lines_out = int((np.asarray(out.celltypes) == pv.CellType.LINE).sum())
    print(
        f"After remesh: {out.n_cells} cells "
        f"({n_lines_out} LINE cells preserved overall)",
    )

    # Verify each targeted ref is still present in the output.
    out_refs = np.asarray(out.cell_data["refs"])
    out_celltypes = np.asarray(out.celltypes)
    out_is_line = out_celltypes == pv.CellType.LINE
    for r in target_refs:
        n = int(((out_refs == r) & out_is_line).sum())
        print(f"  ref={r}: {n} edges in output")

    # Visualization: draw the volumetric mesh and overlay the locked edges.
    pl = pv.Plotter(window_size=(1100, 750))
    pl.add_mesh(
        out,
        opacity=0.25,
        color="lightsteelblue",
        show_edges=False,
    )
    locked_lines = out.extract_cells(
        np.where(out_is_line & np.isin(out_refs, target_refs))[0],
    )
    pl.add_mesh(
        locked_lines,
        scalars="refs",
        cmap=["#1f77b4", "#ff7f0e", "#2ca02c"],
        line_width=6.0,
        scalar_bar_args={
            "title": "edge ref",
            "n_labels": len(target_refs),
            "fmt": "%d",
        },
    )
    pl.add_title(
        f"required_edges with refs {target_refs} preserved\n"
        f"({out.n_cells} cells, {locked_lines.n_cells} locked LINE cells)",
        font_size=10,
    )
    pl.camera_position = "iso"
    pl.show()


if __name__ == "__main__":
    main()
