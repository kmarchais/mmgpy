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

from mmgpy import SolPaths, mmgs

INPUT_FILE = Path(__file__).parent.parent.parent / "assets" / "teapot.mesh"
SOL_FILE = Path(__file__).parent.parent.parent / "assets" / "teapot-ls.sol"
OUTPUT_FILE = Path(__file__).parent / "output.vtk"

mmgs.remesh(
    INPUT_FILE,
    OUTPUT_FILE,
    sol=SolPaths(in_path=SOL_FILE),
    options={"iso": 1, "ls": 0.0},
)

pl = pv.Plotter()
pl.add_mesh(pv.read(OUTPUT_FILE), show_edges=True)
pl.link_views()
pl.show()
