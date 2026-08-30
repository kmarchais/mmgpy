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

"""Smooth surface remeshing."""

from pathlib import Path

import pyvista as pv

from mmgpy import MmgSOptions

INPUT_FILE = Path(__file__).parent.parent.parent / "assets" / "rodin.mesh"

mesh = pv.read(INPUT_FILE)
result = mesh.mmg.remesh(
    MmgSOptions(detect_ridges=False, hausd=0.001, verbose=-1),
)

pl = pv.Plotter()
pl.add_mesh(result, show_edges=True)
pl.camera.elevation = -30
pl.show()
