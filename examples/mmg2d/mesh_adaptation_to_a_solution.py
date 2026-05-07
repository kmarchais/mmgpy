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

import mmgpy  # noqa: F401  -- registers the .mmg accessor and Medit reader

INPUT_FILE = Path(__file__).parent.parent.parent / "assets" / "hole.mesh"
SOL_FILE = Path(__file__).parent.parent.parent / "assets" / "hole.sol"

mesh = pv.read(INPUT_FILE)
result = mesh.mmg.remesh(input_sol=SOL_FILE, verbose=-1)

pl = pv.Plotter()
pl.add_mesh(result, show_edges=True)
pl.view_xy()
pl.show()
