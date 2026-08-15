"""Tests for the final user-facing MMG C API candidates."""

from pathlib import Path

import numpy as np
import pytest

from mmgpy import MmgMesh2D, MmgMesh3D, MmgMeshS


@pytest.mark.parametrize("mesh_type", [MmgMesh3D, MmgMesh2D, MmgMeshS])
def test_set_input_parameter_name_validates_path(
    mesh_type: type[MmgMesh3D | MmgMesh2D | MmgMeshS], tmp_path: Path
) -> None:
    """All engines bind their native input-parameter filename setter."""
    mesh = mesh_type()
    with pytest.raises(RuntimeError, match="parameter file not found"):
        mesh.set_input_parameter_name(tmp_path / "missing.mmg")

    parameter_file = tmp_path / "local-parameters.mmg"
    parameter_file.write_text("", encoding="utf-8")
    mesh.set_input_parameter_name(parameter_file)


def test_integer_parameter_getters() -> None:
    """MMG3D and MMGS expose their native integer-parameter getter."""
    # In both public enums, zero is the verbosity parameter.
    assert isinstance(MmgMesh3D().get_iparameter(0), int)
    assert isinstance(MmgMeshS().get_iparameter(0), int)


def test_save_tetgen_3d(
    cube_mesh: tuple[np.ndarray, np.ndarray], tmp_path: Path
) -> None:
    """MMG3D writes the TetGen .node/.ele pair."""
    vertices, tetrahedra = cube_mesh
    MmgMesh3D(vertices, tetrahedra).save_tetgen(tmp_path / "mesh.node")
    assert (tmp_path / "mesh.node").is_file()
    assert (tmp_path / "mesh.ele").is_file()


def test_save_tetgen_2d(
    square_mesh: tuple[np.ndarray, np.ndarray], tmp_path: Path
) -> None:
    """MMG2D writes the Triangle .node/.ele pair."""
    vertices, triangles = square_mesh
    MmgMesh2D(vertices, triangles).save_tetgen(tmp_path / "mesh.node")
    assert (tmp_path / "mesh.node").is_file()
    assert (tmp_path / "mesh.ele").is_file()
