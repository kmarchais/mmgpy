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
"""Mesh quality improvement with mean edge lengths preservation."""

from pathlib import Path

import pyvista as pv

from mmgpy import mmg3d

INPUT_FILE = Path(__file__).parent.parent.parent / "assets" / "cube.mesh"
OUTPUT_FILE = Path(__file__).parent / "output.vtk"

mmg3d.remesh(
    input_mesh=INPUT_FILE,
    output_mesh=OUTPUT_FILE,
    options={
        "optim": 1,
        "verbose": -1,
    },
)

pl = pv.Plotter()
pl.add_mesh(
    pv.read(OUTPUT_FILE).clip(crinkle=True),
    show_edges=True,
    scalars="mesh.sol:metric",
)
pl.add_mesh(pv.Cube((0.5, 0.5, 0.5)), opacity=0.2)
pl.camera.elevation = -35
pl.show()
