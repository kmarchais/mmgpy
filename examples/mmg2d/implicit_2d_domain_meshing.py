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

from mmgpy import SolPaths, mmg2d

INPUT_FILE = Path(__file__).parent.parent.parent / "assets" / "multi-mat.mesh"
SOL_FILE = Path(__file__).parent.parent.parent / "assets" / "multi-mat-ls.sol"
OUTPUT_FILE = Path(__file__).parent / "output.vtk"

mmg2d.remesh(
    INPUT_FILE,
    OUTPUT_FILE,
    sol=SolPaths(in_path=SOL_FILE),
    options={"iso": 1, "ls": 0.0},
)

mesh = pv.read(OUTPUT_FILE)

pl = pv.Plotter()
pl.add_mesh(
    mesh,
    show_edges=True,
    scalars="refs",
)
pl.link_views()
pl.show()
