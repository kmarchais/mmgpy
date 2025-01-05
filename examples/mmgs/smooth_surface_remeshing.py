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

from mmgpy import mmgs

INPUT_FILE = Path(__file__).parent.parent.parent / "assets" / "rodin.mesh"
OUTPUT_FILE = Path(__file__).parent / "output.vtk"

SCREENSHOT = False

mmgs.remesh(
    input_mesh=str(INPUT_FILE),
    output_mesh=str(OUTPUT_FILE),
    options={
        "hausd": 0.001,
        "angle": 0,
        "verbose": -1,
    },
)

mesh = pv.read(OUTPUT_FILE)

pl = pv.Plotter(off_screen=SCREENSHOT)
pl.add_mesh(
    mesh,
    show_edges=True,
    scalars="medit:ref",
    cmap="tab10",
    show_scalar_bar=False,
)
pl.camera.elevation = -30
if SCREENSHOT:
    pl.show(screenshot="smooth_surface_remeshing.png")
else:
    pl.show()
