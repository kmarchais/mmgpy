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

import mmgpy

INPUT_FILE = Path(__file__).parent.parent.parent / "assets" / "rodin.mesh"

SCREENSHOT = False

mesh = mmgpy.read(INPUT_FILE)
mesh.remesh(hausd=0.001, angle=0, verbose=-1)

pl = pv.Plotter(off_screen=SCREENSHOT)
pl.add_mesh(mesh.to_pyvista(), show_edges=True)
pl.camera.elevation = -30
if SCREENSHOT:
    pl.show(screenshot="smooth_surface_remeshing.png")
else:
    pl.show()
