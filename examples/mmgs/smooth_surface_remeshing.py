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
from mmgpy import mmgs

INPUT_FILE = Path(__file__).parent.parent.parent / "assets" / "rodin.mesh"
OUTPUT_FILE = Path(__file__).parent / "output.mesh"

SCREENSHOT = False

mmgs.remesh(
    input_mesh=INPUT_FILE,
    output_mesh=OUTPUT_FILE,
    options={
        "hausd": 0.001,
        "angle": 0,
        "verbose": -1,
    },
)

mesh = mmgpy.read(OUTPUT_FILE).to_pyvista()

pl = pv.Plotter(off_screen=SCREENSHOT)
pl.add_mesh(mesh, show_edges=True)
pl.camera.elevation = -30
if SCREENSHOT:
    pl.show(screenshot="smooth_surface_remeshing.png")
else:
    pl.show()
