# /// script
# requires-python = ">=3.9"
# dependencies = [
#     "mmgpy",
#     "pyvista",
#     "meshio",
# ]
#
# [tool.uv.sources]
# mmgpy = { path = "../.." }
# ///

"""Open boundary remeshing."""

from pathlib import Path

import meshio
import pyvista as pv

from mmgpy import mmg3d

INPUT_FILE = Path(__file__).parent.parent.parent / "assets" / "island.mesh"
OUTPUT_FILE = Path(__file__).parent / "output.vtk"


pl = pv.Plotter(shape=(1, 3), window_size=(1800, 600))
pl.subplot(0, 0)
mesh = pv.wrap(meshio.read(INPUT_FILE))
pl.add_mesh(
    mesh.extract_cells(mesh.cell_centers().points < 0),
    show_edges=True,
    scalars="medit:ref",
)
pl.add_text("Input mesh")
for open_boundary in [False, True]:
    pl.subplot(0, int(open_boundary) + 1)
    mmg3d.remesh(
        input_mesh=INPUT_FILE,
        output_mesh=OUTPUT_FILE,
        options={
            "opnbdy": int(open_boundary),
            "hsiz": 0.1,
            "verbose": -1,
        },
    )

    mesh = pv.UnstructuredGrid(OUTPUT_FILE)
    pl.add_mesh(
        mesh.extract_cells(mesh.cell_centers().points < 0),
        show_edges=True,
        scalars="medit:ref",
    )
    pl.add_text(f"Open boundary: {open_boundary}")
pl.link_views()
pl.show()
