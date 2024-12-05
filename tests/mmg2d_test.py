"""Tests for the MMG3D Python wrapper."""

import platform
import subprocess
from pathlib import Path

from mmgpy import mmg2d

DIRECTORY = Path(__file__).parent

MESH_FILE = DIRECTORY / "data" / "acdcBdy.mesh"
OUTPUT = DIRECTORY / "output"
EXE = "mmg2d"


def compare_files(file1: Path, file2: Path) -> bool:
    """Compare two files."""
    with file1.open("r") as f1, file2.open("r") as f2:
        return f1.read() == f2.read()


def test_mmg2d() -> None:
    """Test that the Python wrapper produces the same output as the executable."""
    wrapper_output = OUTPUT / "2D_test.mesh"
    exe_output = OUTPUT / "2D_exe.mesh"

    mmg2d.remesh(
        input_mesh=MESH_FILE,
        output_mesh=wrapper_output,
        options={"imprim": 0},
    )

    exe = f"{EXE}.exe" if platform.system() == "Windows" else f"{EXE}_O3"
    subprocess.run(  # noqa: S603
        [exe, "-in", MESH_FILE, "-out", str(exe_output)],
        check=True,
    )

    compare_files(wrapper_output, exe_output)


# def test_options_mmg2d() -> None:
#     """Test that the Python wrapper can handle both int and double options."""
#     wrapper_output = OUTPUT / "2D_wrapper.mesh"
#     exe_output = OUTPUT / "2D_exe_2.mesh"

#     ar = 10
#     hmax = 10

#     mmg2d.remesh(
#         input_mesh=MESH_FILE,
#         output_mesh=wrapper_output,
#         options={"ar": ar, "hmax": hmax},
#     )

#     exe = f"{EXE}.exe" if platform.system() == "Windows" else f"{EXE}_O3"
#     subprocess.run(  # noqa: S603
#         [exe, "-ar", str(ar), "-hmax", str(hmax), MESH_FILE, "-out", exe_output],
#         check=True,
#     )

#     assert compare_files(wrapper_output, exe_output)
