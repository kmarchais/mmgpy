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
quality remesh: if MMG is allowed to coarsen, move, or drop the marked
edges, the BC tags are lost and the FEM problem can no longer be
reapplied.

This example loads ``assets/cube.mesh`` — a tetrahedral cube whose 120
ridge edges already carry refs 1..12, one per cube corner triple. We
pick a few of those edges, lock them via the new
``cell_data["mmg_required_edges"]`` tag, and run a quality remesh
(``optim=1``). The locked refs survive byte-identically.

Run::

    uv run examples/mmg3d/required_edges.py
"""

from __future__ import annotations

from pathlib import Path

import numpy as np
import pyvista as pv

import mmgpy  # noqa: F401  -- registers the .mmg accessor and Medit reader

_ASSETS = Path(__file__).resolve().parents[1].parent / "assets"
_TARGET_REFS = (1, 4, 7)


def _line_count_for_ref(mesh: pv.UnstructuredGrid, ref: int) -> int:
    """Count the LINE cells whose ``refs`` array equals *ref*."""
    celltypes = np.asarray(mesh.celltypes)
    refs = np.asarray(mesh.cell_data["refs"])
    return int(((refs == ref) & (celltypes == pv.CellType.LINE)).sum())


def main() -> None:
    """Demonstrate FEM-edge preservation via ``mmg_required_edges``."""
    ds = pv.read(_ASSETS / "cube.mesh")
    celltypes = np.asarray(ds.celltypes)
    refs = np.asarray(ds.cell_data["refs"])
    is_line = celltypes == pv.CellType.LINE
    line_refs = np.unique(refs[is_line]).tolist()
    print(
        f"Input: {ds.n_cells} cells "
        f"({int(is_line.sum())} ridge LINE cells with refs {line_refs})",
    )
    for r in _TARGET_REFS:
        print(f"  input ref={r}: {_line_count_for_ref(ds, r)} edges")

    # Lock all LINE cells whose ref is in _TARGET_REFS via the data tag.
    mask = np.zeros(ds.n_cells, dtype=bool)
    mask[is_line & np.isin(refs, _TARGET_REFS)] = True
    ds.cell_data["mmg_required_edges"] = mask
    print(
        f"\nLocked {int(mask.sum())} edges via "
        f"cell_data['mmg_required_edges'] (refs {_TARGET_REFS})",
    )

    # Quality optimization keeps topology fixed but moves vertices for
    # better element quality; required edges must not budge.
    out = ds.mmg.remesh(optim=1, verbose=-1)
    out_celltypes = np.asarray(out.celltypes)
    out_n_lines = int((out_celltypes == pv.CellType.LINE).sum())
    print(
        f"\nAfter quality remesh: {out.n_cells} cells "
        f"({out_n_lines} LINE cells preserved)",
    )
    for r in _TARGET_REFS:
        print(f"  output ref={r}: {_line_count_for_ref(out, r)} edges")

    # Render: full volume + Cube outline, mirroring mesh_quality_improvement
    # so the smoke test exercises the same off-screen path.
    pl = pv.Plotter()
    pl.add_mesh(out, opacity=0.4, show_edges=True, color="lightsteelblue")
    pl.add_mesh(pv.Cube(center=(0.5, 0.5, 0.5)), opacity=0.15, color="white")
    pl.add_title(
        f"required_edges (refs {_TARGET_REFS}) survive quality remesh",
        font_size=10,
    )
    pl.camera.elevation = -35
    pl.show()


if __name__ == "__main__":
    main()
