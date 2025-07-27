"""Tests for the MMG3D Python wrapper."""

import platform
import subprocess
from pathlib import Path

from mmgpy import mmg3d


def test_mmg3d() -> None:
    """Test that the Python wrapper produces the same output as the executable."""
    verbose = -1
    input_file = Path(__file__).parent / "Mesh.mesh"

    mmg3d.remesh(
        input_mesh=input_file,
        output_mesh="tests/test_output.mesh",
        options={
            "verbose": verbose,
        },
    )

    exe = "mmg3d_O3.exe" if platform.system() == "Windows" else "mmg3d_O3"

    # Add debugging for CI - run RPATH fix before executing
    if platform.system() == "Darwin":
        print("=== Running RPATH fix before test ===")
        try:
            import mmgpy

            mmgpy._fix_rpath()
        except Exception as e:
            print(f"RPATH fix failed: {e}")

    subprocess.run(  # noqa: S603
        [
            exe,
            "-in",
            str(input_file),
            "-out",
            "tests/output_exe.mesh",
            "-v",
            str(verbose),
        ],
        check=True,
    )

    folder = Path(__file__).parent
    test_path = folder / "test_output.mesh"
    ref_path = folder / "output_exe.mesh"
    with test_path.open("r") as test, ref_path.open("r") as ref:
        assert test.read() == ref.read()
