# /// script
# requires-python = ">=3.9"
# dependencies = [
#     "mmgpy",
#     "numpy",
#     "pyvista",
# ]
#
# [tool.uv.sources]
# mmgpy = { path = "../.." }
# ///

"""Collapse feature-edge slivers on a CAD surface with the ``detect_ridges`` toggle.

CAD parts with thin or sharp features (here a compressor wheel with thin blades)
have near-90 degree dihedral angles at their blade rims. By default MMGS detects
these as ridges and marks them *required*, so it protects the degenerate slivers
sitting on them: raising ``hmin`` does not collapse them, because required
entities are pinned. Those slivers wreck downstream solvers (FEM, GPU collision).

``detect_ridges=False`` is the MMG ``-nr`` toggle: it stops treating feature
edges as required, so the very same sizing finally collapses the slivers. This
is a **trade-off**, not a free win: the slivers (highlighted in red below) all
but vanish and the worst-element quality jumps, but the sharp blade edges are
rounded, because nothing protects them any more. Reach for it when you need a
hard guarantee against degenerate triangles and can accept softened features
(the typical case for collision / FEM meshes), not when feature fidelity matters.

Note that ``ar`` only sets the detection *threshold*; it cannot turn detection
off, which is the common point of confusion this example clears up.
"""

from __future__ import annotations

from pathlib import Path

import numpy as np
import pyvista as pv

import mmgpy  # noqa: F401  -- registers the .mmg accessor and Medit reader
from mmgpy import MmgSOptions

INPUT_FILE = Path(__file__).parent.parent.parent / "assets" / "compressor_wheel.stl"

# A triangle is counted as a sliver below this in-radius style shape quality
# (4*sqrt(3)*area / sum(edge^2); 1.0 = equilateral, ->0 = degenerate).
SLIVER_THRESHOLD = 0.2


def shape_quality(mesh: pv.PolyData) -> tuple[pv.PolyData, np.ndarray]:
    """Return a triangle-only copy of ``mesh`` plus per-triangle shape quality."""
    surf = mesh.extract_surface(nonlinear_subdivision=0).triangulate()
    tri = surf.faces.reshape(-1, 4)[:, 1:]
    pts = surf.points
    tris_only = pv.PolyData(
        pts,
        np.hstack([np.full((len(tri), 1), 3), tri]).ravel(),
    )
    e0 = pts[tri[:, 1]] - pts[tri[:, 0]]
    e1 = pts[tri[:, 2]] - pts[tri[:, 1]]
    e2 = pts[tri[:, 0]] - pts[tri[:, 2]]
    area = 0.5 * np.linalg.norm(np.cross(e0, -e2), axis=1)
    sum_sq_edges = (e0**2).sum(1) + (e1**2).sum(1) + (e2**2).sum(1)
    quality = np.divide(
        4.0 * np.sqrt(3.0) * area,
        sum_sq_edges,
        out=np.zeros_like(area),
        where=sum_sq_edges > 0,
    )
    return tris_only, quality


# Scale the target edge length to the part so the recipe works for any CAD STL.
source = pv.read(INPUT_FILE).triangulate()
diag = float(np.linalg.norm(np.asarray(source.bounds[1::2]) - source.bounds[0::2]))
target = diag / 60.0  # roughly 60 elements across the part

# Identical sizing for both runs: the ONLY difference is detect_ridges, so the
# sliver count reflects the toggle, not a change in resolution.
sizing = {
    "hmin": target * 0.9,
    "hmax": target * 1.4,
    "hausd": target / 4,
    "verbose": -1,
}

ridges_kept = source.mmg.remesh(MmgSOptions(**sizing))
ridges_off = source.mmg.remesh(MmgSOptions(detect_ridges=False, **sizing))

# Quality check (numbers first: this is where -nr genuinely wins).
print(f"{'mesh':<28}{'tris':>8}{'min_quality':>14}{'slivers':>10}")
panels = []
for label, mesh in (
    ("ridges kept (default)", ridges_kept),
    ("detect_ridges=False (-nr)", ridges_off),
):
    tris, quality = shape_quality(mesh)
    sliver_ids = np.flatnonzero(quality < SLIVER_THRESHOLD)
    print(f"{label:<28}{tris.n_cells:>8}{quality.min():>14.3f}{sliver_ids.size:>10}")
    panels.append((label, tris, sliver_ids))

# Visual check: same geometry, sliver triangles highlighted in red.
pl = pv.Plotter(shape=(1, 2), window_size=(1900, 950))
captions = (
    "feature-edge slivers pinned by ridge detection",
    "slivers collapsed; sharp blade edges rounded (the -nr trade-off)",
)
for column, ((label, tris, sliver_ids), caption) in enumerate(
    zip(panels, captions, strict=True),
):
    pl.subplot(0, column)
    pl.add_mesh(
        tris,
        color="#dfe6ee",
        show_edges=True,
        line_width=0.4,
        edge_color="#9aa7b4",
    )
    if sliver_ids.size:
        pl.add_mesh(tris.extract_cells(sliver_ids), color="crimson")
    pl.add_text(
        f"{label}\n{sliver_ids.size} sliver triangles (red)\n{caption}",
        font_size=11,
    )
pl.link_views()
pl.camera_position = "iso"
pl.show()
