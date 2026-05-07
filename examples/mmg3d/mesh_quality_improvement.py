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
"""Mesh quality improvement with mean edge lengths preservation."""

from pathlib import Path

import pyvista as pv

import mmgpy  # noqa: F401  -- registers the .mmg accessor and Medit reader

INPUT_FILE = Path(__file__).parent.parent.parent / "assets" / "cube.mesh"

mesh = pv.read(INPUT_FILE)
pv_mesh = mesh.mmg.remesh(optim=1, verbose=-1)

center = (0.5, 0.5, 0.5)

pl = pv.Plotter()
pl.add_mesh(
    pv_mesh.extract_cells(pv_mesh.cell_centers().points[:, 0] < center[0]),
    show_edges=True,
)
pl.add_mesh(pv.Cube(center), opacity=0.2)
pl.camera.elevation = -35
pl.show()
