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

mmg3d.remesh(
    input_mesh=str(INPUT_FILE),
    output_mesh=str(OUTPUT_FILE),
    options={
        "opnbdy": 1,
        "verbose": -1,
    },
)

mesh = pv.read(OUTPUT_FILE)

pl = pv.Plotter()
pl.add_mesh(
    mesh.extract_cells(mesh.cell_centers().points[:, :] < 0),
    scalars="mesh.sol:metric",
    show_edges=True,
)
pl.show()
