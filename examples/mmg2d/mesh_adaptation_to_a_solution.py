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

"""Mesh adaptation to a solution."""

from pathlib import Path

import pyvista as pv

from mmgpy import mmg2d

INPUT_FILE = Path(__file__).parent.parent.parent / "assets" / "hole.mesh"
SOL_FILE = Path(__file__).parent.parent.parent / "assets" / "hole.sol"
OUTPUT_FILE = Path(__file__).parent / "output.vtk"

mmg2d.remesh(
    input_mesh=str(INPUT_FILE),
    input_sol=str(SOL_FILE),
    output_mesh=str(OUTPUT_FILE),
    options={"verbose": -1},
)

mesh = pv.read(OUTPUT_FILE)

pl = pv.Plotter()
pl.add_mesh(mesh, show_edges=True, scalars=mesh.array_names[1])
pl.view_xy()
pl.show()
