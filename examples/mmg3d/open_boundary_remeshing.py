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

"""Open boundary remeshing."""

from pathlib import Path

import pyvista as pv

from mmgpy import mmg3d

INPUT_FILE = Path(__file__).parent.parent.parent / "assets" / "island.mesh"
OUTPUT_FILE = Path(__file__).parent / "output.vtk"


pl = pv.Plotter(shape=(1, 2), window_size=(800, 400))
for open_boundary in [False, True]:
    pl.subplot(0, int(open_boundary))
    mmg3d.remesh(
        input_mesh=str(INPUT_FILE),
        output_mesh=str(OUTPUT_FILE),
        options={
            "opnbdy": open_boundary,
            "verbose": -1,
        },
    )

    mesh = pv.read(OUTPUT_FILE)
    pl.add_mesh(
        mesh.extract_cells(mesh.cell_centers().points[:, :] < 0),
        show_edges=True,
    )
    pl.add_text(f"Open boundary: {open_boundary}")
pl.show()
