# /// script
# requires-python = ">=3.9"
# dependencies = [
#     "mmgpy",
#     "pyvista",
# ]
#
# [tool.uv.sources]
# mmgpy = { path = "../.." }
# ///

"""Open boundary remeshing."""

from pathlib import Path

import pyvista as pv

import mmgpy  # noqa: F401  -- registers the .mmg accessor and Medit reader

INPUT_FILE = Path(__file__).parent.parent.parent / "assets" / "island.mesh"

pl = pv.Plotter(shape=(1, 2), window_size=(800, 400))
for open_boundary in [False, True]:
    pl.subplot(0, int(open_boundary))

    mesh = pv.read(INPUT_FILE)
    pv_mesh = mesh.mmg.remesh(opnbdy=open_boundary, verbose=-1)
    pl.add_mesh(
        pv_mesh.extract_cells(pv_mesh.cell_centers().points[:, 0] < 0),
        show_edges=True,
    )
    pl.add_text(f"Open boundary: {open_boundary}")
pl.show()
