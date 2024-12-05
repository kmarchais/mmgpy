"""Tests for the MMG3D Python wrapper."""

import platform
import subprocess
from pathlib import Path

from mmgpy import mmg3d

DIRECTORY = Path(__file__).parent

MESH_FILE = DIRECTORY / "data" / "3D_MESH.mesh"
OUTPUT = DIRECTORY / "output"
EXE = "mmg3d"


def compare_files(file1: Path, file2: Path) -> bool:
    """Compare two files."""
    with file1.open("r") as f1, file2.open("r") as f2:
        return f1.read() == f2.read()


def test_mmg3d() -> None:
    """Test that the Python wrapper produces the same output as the executable."""
    wrapper_output = OUTPUT / "test.mesh"
    exe_output = OUTPUT / "exe.mesh"

    mmg3d.remesh(
        input_mesh=MESH_FILE,
        output_mesh=wrapper_output,
        options={"imprim": 0},
    )

    exe = f"{EXE}.exe" if platform.system() == "Windows" else f"{EXE}_O3"
    subprocess.run(  # noqa: S603
        [exe, "-in", MESH_FILE, "-out", exe_output],
        check=True,
    )

    compare_files(wrapper_output, exe_output)


def test_int_double_options() -> None:
    """Test that the Python wrapper can handle both int and double options."""
    int_output = OUTPUT / "int.mesh"
    double_output = OUTPUT / "double.mesh"

    mmg3d.remesh(
        input_mesh=MESH_FILE,
        output_mesh=int_output,
        options={"ls": 0, "imprim": 0},
    )
    mmg3d.remesh(
        input_mesh=MESH_FILE,
        output_mesh=double_output,
        options={"ls": 0.0, "imprim": 0},
    )

    assert compare_files(int_output, double_output)
