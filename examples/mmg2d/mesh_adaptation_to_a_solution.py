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
OUTPUT_FILE = Path(__file__).parent / "output.mesh"

mmg2d.remesh(
    input_mesh=INPUT_FILE,
    input_sol=SOL_FILE,
    output_mesh=OUTPUT_FILE,
    options={"verbose": -1},
)

import mmgpy  # noqa: E402

mesh = mmgpy.read(OUTPUT_FILE)
pv_mesh = mesh.to_pyvista()

pl = pv.Plotter()
pl.add_mesh(pv_mesh, show_edges=True)
pl.view_xy()
pl.show()
