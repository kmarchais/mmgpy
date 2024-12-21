# /// script
# requires-python = ">=3.13"
# dependencies = [
#     "mmgpy",
#     "pyvista",
# ]
#
# [tool.uv.sources]
# mmgpy = { path = ".." }
# ///
"""MMG2D meshing tutorial."""

import subprocess
import sys
from pathlib import Path

import pyvista as pv

from mmgpy import mmg2d

EXE = "mmg2d" if sys.platform == "win32" else "mmg2d_O3"
INPUT_MESH = Path(__file__).parent.parent / "assets" / "acdcBdy.mesh"

ar = 10
hmax = 10

mmg2d.remesh(
    input_mesh=str(INPUT_MESH),
    output_mesh="acdcBdy_remeshed.vtk",
    options={
        "ar": ar,
        "hmax": hmax,
    },
)

subprocess.call(  # noqa: S603
    [
        EXE,
        "-ar",
        str(ar),
        "-hmax",
        str(hmax),
        "-in",
        str(INPUT_MESH),
        "-out",
        "acdcBdy.o.vtk",
    ],
)

pl = pv.Plotter(shape=(1, 2))
pl.subplot(0, 0)
pl.add_mesh(pv.read("acdcBdy_remeshed.vtk"), show_edges=True)
pl.subplot(0, 1)
pl.add_mesh(pv.read("acdcBdy.o.vtk"), show_edges=True)
pl.link_views()
pl.view_xy()
pl.show()
