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

from mmgpy import mmgs

INPUT_FILE = Path(__file__).parent.parent.parent / "assets" / "linkrods.mesh"
OUTPUT_DIR = Path(__file__).parent

hausorff_parameters = [0.1, 0.01, 0.001]
hmax_parameters = [0.2, 0.1, 0.05]

pl = pv.Plotter(shape=(2, len(hausorff_parameters)))
for i, hausd in enumerate(hausorff_parameters):
    pl.subplot(0, i)

    out_file = f"{OUTPUT_DIR!r}/hausd_{hausd}.vtk"
    mmgs.remesh(
        input_mesh=str(INPUT_FILE),
        output_mesh=out_file,
        options={"hausd": hausd},
    )

    pl.add_mesh(pv.read(out_file), show_edges=True)
    pl.add_text(f"Hausdorff parameter: {hausd}")

for i, hmax in enumerate(hmax_parameters):
    pl.subplot(1, i)

    out_file = f"{OUTPUT_DIR!r}/hmax_{hmax}.vtk"
    mmgs.remesh(
        input_mesh=str(INPUT_FILE),
        output_mesh=out_file,
        options={"hmax": hmax},
    )

    pl.add_mesh(pv.read(out_file), show_edges=True)
    pl.add_text(f"Hmax parameter: {hmax}")

pl.link_views()
pl.show()
