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

import mmgpy

INPUT_FILE = Path(__file__).parent.parent.parent / "assets" / "hole.mesh"
SOL_FILE = Path(__file__).parent.parent.parent / "assets" / "hole.sol"

mesh = mmgpy.read(INPUT_FILE)
mesh.remesh(input_sol=SOL_FILE, verbose=-1)

pl = pv.Plotter()
pl.add_mesh(mesh.to_pyvista(), show_edges=True)
pl.view_xy()
pl.show()
