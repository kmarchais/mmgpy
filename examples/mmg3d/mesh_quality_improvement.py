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

import mmgpy

INPUT_FILE = Path(__file__).parent.parent.parent / "assets" / "cube.mesh"

mesh = mmgpy.read(INPUT_FILE)
mesh.remesh(optim=1, verbose=-1)

pv_mesh = mesh.to_pyvista()

center = (0.5, 0.5, 0.5)

pl = pv.Plotter()
pl.add_mesh(
    pv_mesh.extract_cells(pv_mesh.cell_centers().points[:, 0] < center[0]),
    show_edges=True,
)
pl.add_mesh(pv.Cube(center), opacity=0.2)
pl.camera.elevation = -35
pl.show()
