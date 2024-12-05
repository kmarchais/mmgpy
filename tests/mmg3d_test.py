"""Tests for the MMG3D Python wrapper."""

import platform
import subprocess
from pathlib import Path

from mmgpy import mmg3d

DIRECTORY = Path(__file__).parent

MESH_FILE = DIRECTORY / "Mesh.mesh"


def compare_files(file1: Path, file2: Path) -> bool:
    """Compare two files."""
    with file1.open("r") as f1, file2.open("r") as f2:
        return f1.read() == f2.read()


def test_mmg3d() -> None:
    """Test that the Python wrapper produces the same output as the executable."""
    mmg3d.remesh(
        input_mesh=MESH_FILE,
        output_mesh=DIRECTORY / "test_output.mesh",
        options={"imprim": 0},
    )

    exe = "mmg3d.exe" if platform.system() == "Windows" else "mmg3d_O3"
    subprocess.run(  # noqa: S603
        [exe, "-in", MESH_FILE, "-out", DIRECTORY / "output_exe.mesh"],
        check=True,
    )

    test_path = DIRECTORY / "test_output.mesh"
    ref_path = DIRECTORY / "output_exe.mesh"
    compare_files(test_path, ref_path)


def test_int_double_options() -> None:
    """Test that the Python wrapper can handle both int and double options."""
    mmg3d.remesh(
        input_mesh=str(MESH_FILE),
        output_mesh=str(DIRECTORY / "test_output_int.mesh"),
        options={"ls": 0, "imprim": 0},
    )
    mmg3d.remesh(
        input_mesh=MESH_FILE,
        output_mesh=DIRECTORY / "test_output_double.mesh",
        options={"ls": 0.0, "imprim": 0},
    )

    test_path = DIRECTORY / "test_output_int.mesh"
    ref_path = DIRECTORY / "test_output_double.mesh"
    assert compare_files(test_path, ref_path)
