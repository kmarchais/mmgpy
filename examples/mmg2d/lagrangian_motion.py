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

"""Implicit domain meshing tutorial."""

from pathlib import Path

import pyvista as pv

from mmgpy import mmg2d

INPUT_FILE = Path(__file__).parent.parent.parent / "assets" / "lag-mot2D.mesh"
SOL_FILE = Path(__file__).parent.parent.parent / "assets" / "lag-mot2D.sol"
OUTPUT_FILE = Path(__file__).parent / "output.vtk"

mmg2d.remesh(
    input_mesh=str(INPUT_FILE),
    input_sol=str(SOL_FILE),
    output_mesh=str(OUTPUT_FILE),
    options={"lag": 0},
)

pl = pv.Plotter()
pl.add_mesh(pv.read(OUTPUT_FILE), show_edges=True)
pl.link_views()
pl.show()