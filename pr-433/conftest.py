"""Run documentation against real mesh files in isolated working directories."""

import os
import shutil
from pathlib import Path

os.environ.setdefault("PYVISTA_OFF_SCREEN", "true")
os.environ.setdefault("MPLBACKEND", "Agg")

import pytest
import pyvista as pv

from mmgpy import MeshKind

pv.OFF_SCREEN = True


@pytest.fixture(scope="session")
def doc_meshes(tmp_path_factory: pytest.TempPathFactory) -> Path:
    """Create the explicitly named inputs used by the documentation."""
    directory = tmp_path_factory.mktemp("doc_meshes")
    volume = (
        pv
        .ImageData(
            dimensions=(4, 4, 4), spacing=(0.1, 0.1, 0.1), origin=(0.35, 0.35, 0.35)
        )
        .cast_to_unstructured_grid()
        .triangulate()
    )
    background = (
        pv
        .ImageData(dimensions=(6, 6, 6), spacing=(0.2, 0.2, 0.2))
        .cast_to_unstructured_grid()
        .triangulate()
    )
    plane = pv.Plane(center=(0.5, 0.5, 0), i_resolution=8, j_resolution=8).triangulate()
    surface = pv.Sphere(theta_resolution=12, phi_resolution=12)
    assert volume.mmg.kind == MeshKind.TETRAHEDRAL
    inputs = {
        "input.mesh": volume,
        "input.meshb": volume,
        "input.vtu": volume,
        "input.vtk": volume,
        "volume.mesh": volume,
        "simulation.vtu": volume,
        "background.mesh": background,
        "unit_cube.mesh": background,
        "domain.mesh": background,
        "domain_with_holes.mesh": background,
        "planar.mesh": plane,
        "domain_2d.mesh": plane,
        "background_2d.mesh": plane,
        "surface.mesh": surface,
        "background_surface.mesh": surface,
        "model.stl": surface,
        "model.obj": surface,
        "input.stl": surface,
        "surface.stl": surface,
        "mechanical_part.stl": surface,
        "part.stl": surface,
    }
    for name, mesh in inputs.items():
        mesh.save(directory / name)
    # PyVista delegates Gmsh I/O to meshio.
    pv.save_meshio(directory / "domain.msh", volume, file_format="gmsh22")
    return directory


@pytest.fixture(autouse=True)
def doc_files(
    doc_meshes: Path, tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    """Keep real reads/writes local to each example, without replacing the API."""
    for source in doc_meshes.iterdir():
        shutil.copy2(source, tmp_path / source.name)
    monkeypatch.chdir(tmp_path)
