"""Tests for the MMG2D Python wrapper."""

# ruff: noqa: ERA001, RUF100

# import platform
# import subprocess
# from pathlib import Path

# from mmgpy import mmg2d


# def test_mmg2d() -> None:
#     """Test that the Python wrapper produces the same output as the executable."""
#     exe = "mmg2d.exe" if platform.system() == "Windows" else "mmg2d_O3"
#     input_mesh = Path(__file__).parent.parent / "assets" / "acdcBdy.mesh"

#     current_dir = Path(__file__).parent
#     test_path = current_dir / "acdcBdy_remeshed.vtk"
#     ref_path = current_dir / "acdcBdy.o.vtk"

#     ar = 10
#     hmax = 10
#     verbose = -1

#     mmg2d.remesh(
#         input_mesh=str(input_mesh),
#         output_mesh=str(test_path),
#         options={
#             "ar": ar,
#             "hmax": hmax,
#             "verbose": verbose,
#         },
#     )

#     command = [
#         exe,
#         "-ar",
#         str(ar),
#         "-hmax",
#         str(hmax),
#         "-in",
#         str(input_mesh),
#         "-out",
#         str(ref_path),
#         "-verbose",
#         str(verbose),
#     ]
#     subprocess.check_call(command)  # noqa: S603
#     # with test_path.open("r") as test, ref_path.open("r") as ref:
#     #     test_content = test.read()
#     #     ref_content = ref.read()
#     #     to_replace = (
#     #         str(input_mesh).replace("mesh", "sol")
#     #         if platform.system() == "Windows"
#     #         else "acdcBdy.sol"
#     #     )
#     #     test_content = test_content.replace("mesh.sol", to_replace)
#     #     assert test_content == ref_content
