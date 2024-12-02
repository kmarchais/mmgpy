from pathlib import Path

from mmgpy import MMG_VERSION, mmg3d


def test_version():
    assert MMG_VERSION == "5.8.0"


def test_mmg3d():
    mmg3d.remesh(
        input_mesh="tests/Mesh.mesh",
        output_mesh="tests/test_output.mesh",
    )

    folder = Path(__file__).parent
    test_path = folder / "test_output.mesh"
    ref_path = folder / "output_exe.mesh"
    with test_path.open("r") as test, ref_path.open("r") as ref:
        assert test.read() == ref.read()
