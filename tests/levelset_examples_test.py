"""Check geometric invariants independently of example screenshot baselines."""

import runpy
from pathlib import Path

import numpy as np
import pytest
import pyvista as pv


@pytest.mark.parametrize("shape", ["ellipsoid", "cube"])
def test_delaunay_volume_is_preserved(shape):
    """VTK may change connectivity while preserving valid example geometry."""
    directory = Path(__file__).resolve().parents[1] / "examples" / "mmg3d"
    if shape == "ellipsoid":
        functions = runpy.run_path(str(directory / "ellipsoid_levelset.py"))
        grid = functions["create_ellipsoid_sdf_grid"](
            (0.0, 0.0, 0.0),
            (1.0, 0.6, 0.4),
            resolution=50,
        )
        mesh = grid.contour([0.0], scalars="sdf", method="flying_edges").delaunay_3d()
        expected_volume = 4.0 * np.pi * 0.6 * 0.4 / 3.0
    else:
        functions = runpy.run_path(str(directory / "levelset_discretization.py"))
        points, cells = functions["create_volumetric_cube_mesh"](resolution=20)
        mesh = pv.UnstructuredGrid({pv.CellType.TETRA: cells}, points)
        expected_volume = 1.0

    volumes = mesh.compute_cell_sizes(length=False, area=False).cell_data["Volume"]
    assert mesh.n_cells > 0
    assert np.isfinite(mesh.points).all()
    assert np.isfinite(volumes).all()
    assert np.all(volumes > 0.0)
    assert np.sum(volumes) == pytest.approx(expected_volume, rel=0.01)
