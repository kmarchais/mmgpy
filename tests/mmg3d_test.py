"""Tests for the MMG3D Python wrapper."""

import platform
import subprocess
from pathlib import Path

from mmgpy import mmg3d


def test_mmg3d() -> None:
    """Test that the Python wrapper produces the same output as the executable."""
    mmg3d.remesh(
        input_mesh="tests/Mesh.mesh",
        output_mesh="tests/test_output.mesh",
    )

    exe = "mmg3d.exe" if platform.system() == "Windows" else "mmg3d_O3"
    subprocess.run(  # noqa: S603
        [exe, "-in", "tests/Mesh.mesh", "-out", "tests/output_exe.mesh"],
        check=True,
    )

    folder = Path(__file__).parent
    test_path = folder / "test_output.mesh"
    ref_path = folder / "output_exe.mesh"
    with test_path.open("r") as test, ref_path.open("r") as ref:
        assert test.read() == ref.read()
