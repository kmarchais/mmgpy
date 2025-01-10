"""Tests for the MMG3D Python wrapper."""

import platform
import subprocess
from pathlib import Path

from mmgpy import mmg3d


def test_mmg3d() -> None:
    """Test that the Python wrapper produces the same output as the executable."""
    verbose = -1
    input_file = Path(__file__).parent / "Mesh.mesh"

    folder = Path(__file__).parent
    test_path = folder / "test_output.mesh"
    ref_path = folder / "output_exe.mesh"

    mmg3d.remesh(
        input_mesh=input_file,
        output_mesh=test_path,
        options={
            "verbose": verbose,
        },
    )

    exe = "mmg3d.exe" if platform.system() == "Windows" else "mmg3d_O3"
    subprocess.run(  # noqa: S603
        [
            exe,
            "-in",
            str(input_file),
            "-out",
            str(ref_path),
            "-v",
            str(verbose),
        ],
        check=True,
    )

    with test_path.open("r") as test, ref_path.open("r") as ref:
        assert test.read() == ref.read()
