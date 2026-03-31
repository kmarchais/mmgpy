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

"""Mechanical piece remeshing tutorial."""

from pathlib import Path

import pyvista as pv

import mmgpy

INPUT_FILE = Path(__file__).parent.parent.parent / "assets" / "linkrods.mesh"

hausorff_parameters = [0.1, 0.01, 0.001]
hmax_parameters = [0.2, 0.1, 0.05]

pl = pv.Plotter(shape=(2, len(hausorff_parameters)))
for i, hausd in enumerate(hausorff_parameters):
    pl.subplot(0, i)

    mesh = mmgpy.read(INPUT_FILE)
    mesh.remesh(hausd=hausd)

    pl.add_mesh(mesh.to_pyvista(), show_edges=True)
    pl.add_text(f"Hausdorff parameter: {hausd}")

for i, hmax in enumerate(hmax_parameters):
    pl.subplot(1, i)

    mesh = mmgpy.read(INPUT_FILE)
    mesh.remesh(hmax=hmax)

    pl.add_mesh(mesh.to_pyvista(), show_edges=True)
    pl.add_text(f"Hmax parameter: {hmax}")

pl.link_views()
pl.show()
