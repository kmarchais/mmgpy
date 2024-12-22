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

from mmgpy import mmgs

INPUT_FILE = Path(__file__).parent.parent.parent / "assets" / "teapot.mesh"
SOL_FILE = Path(__file__).parent.parent.parent / "assets" / "cube-distance.sol"
OUTPUT_FILE = Path(__file__).parent / "output.vtk"

mmgs.remesh(
    input_mesh=str(INPUT_FILE),
    input_sol=str(SOL_FILE),
    output_mesh=str(OUTPUT_FILE),
    options={"ls": 0},
)

pl = pv.Plotter()
pl.add_mesh(pv.read(OUTPUT_FILE), show_edges=True)
pl.link_views()
pl.show()
