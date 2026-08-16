"""Tests for the final user-facing MMG C API candidates."""

from pathlib import Path

import numpy as np
import pytest

from mmgpy import MmgMesh2D, MmgMesh3D, MmgMeshS, mmg3d


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


def _write_parameter_file(path: Path, entity: str, ref: int = 7) -> Path:
    path.write_text(
        f"parameters\n1\n{ref} {entity} 0.02 0.08 0.01\n",
        encoding="utf-8",
    )
    return path


def test_mmg3d_parameter_file_sizes_tetrahedron_reference(
    cube_mesh: tuple[np.ndarray, np.ndarray], tmp_path: Path
) -> None:
    """MMG3D applies native local sizing to a tetrahedron reference."""
    vertices, tetrahedra = cube_mesh
    mesh = MmgMesh3D(vertices, tetrahedra)
    mesh.set_tetrahedra(tetrahedra, np.full(len(tetrahedra), 7, dtype=np.int32))
    parameter_file = _write_parameter_file(tmp_path / "local.mmg3d", "tetrahedra")

    mesh.remesh(parameter_file=parameter_file, verbose=-1)

    assert len(mesh.get_tetrahedra()) > len(tetrahedra)


def test_mmg2d_parameter_file_sizes_triangle_reference(
    square_mesh: tuple[np.ndarray, np.ndarray], tmp_path: Path
) -> None:
    """MMG2D applies native local sizing to a triangle reference."""
    vertices, triangles = square_mesh
    mesh = MmgMesh2D(vertices, triangles)
    mesh.set_triangles(triangles, np.full(len(triangles), 7, dtype=np.int32))
    parameter_file = _write_parameter_file(tmp_path / "local.mmg2d", "triangles")

    mesh.remesh(parameter_file=parameter_file, verbose=-1)

    assert len(mesh.get_triangles()) > len(triangles)


def test_mmgs_parameter_file_sizes_triangle_reference(
    tetrahedron_surface_mesh: tuple[np.ndarray, np.ndarray], tmp_path: Path
) -> None:
    """MMGS applies native local sizing through mmgpy's public-API parser."""
    vertices, triangles = tetrahedron_surface_mesh
    mesh = MmgMeshS(vertices, triangles)
    mesh.set_triangles(triangles, np.full(len(triangles), 7, dtype=np.int32))
    parameter_file = _write_parameter_file(tmp_path / "local.mmgs", "triangles")

    mesh.remesh(parameter_file=parameter_file, verbose=-1)

    assert len(mesh.get_triangles()) > len(triangles)


def test_file_remesh_accepts_parameter_file(
    cube_mesh: tuple[np.ndarray, np.ndarray], tmp_path: Path
) -> None:
    """The public file wrapper forwards path-like parameter files to C++."""
    vertices, tetrahedra = cube_mesh
    source = MmgMesh3D(vertices, tetrahedra)
    source.set_tetrahedra(tetrahedra, np.full(len(tetrahedra), 7, dtype=np.int32))
    input_mesh = tmp_path / "input.mesh"
    output_mesh = tmp_path / "output.mesh"
    source.save(input_mesh)
    parameter_file = _write_parameter_file(tmp_path / "local.mmg3d", "tetrahedra")

    assert mmg3d.remesh(
        input_mesh,
        output_mesh,
        parameter_file=parameter_file,
        options={"verbose": -1},
    )
    assert len(MmgMesh3D(output_mesh).get_tetrahedra()) > len(tetrahedra)


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
