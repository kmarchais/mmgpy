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

INPUT_FILE = Path(__file__).parent.parent.parent / "assets" / "multi-mat.mesh"
SOL_FILE = Path(__file__).parent.parent.parent / "assets" / "multi-mat-rmc.sol"
OUTPUT_FILE = Path(__file__).parent / "output.vtk"

mmg2d.remesh(
    input_mesh=str(INPUT_FILE),
    input_sol=str(SOL_FILE),
    output_mesh=str(OUTPUT_FILE),
    options={"ls": 0},
)

mesh = pv.read(OUTPUT_FILE)

pl = pv.Plotter()
pl.add_mesh(
    mesh,
    show_edges=True,
    scalars="medit:ref",
)
pl.link_views()
pl.show()
