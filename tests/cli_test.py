"""Test CLI command functionality."""

from __future__ import annotations

import subprocess
from pathlib import Path

import pytest

from mmgpy._cli import _default_output_path, _parse_args


@pytest.fixture
def test_mesh_3d(tmp_path: Path) -> Path:
    """Create a simple 3D tetrahedral mesh file for testing."""
    mesh_file = tmp_path / "test.mesh"
    mesh_file.write_text("""\
MeshVersionFormatted 2
Dimension 3
Vertices
4
0.0 0.0 0.0 0
1.0 0.0 0.0 0
0.5 1.0 0.0 0
0.5 0.5 1.0 0
Tetrahedra
1
1 2 3 4 0
End
""")
    return mesh_file


@pytest.fixture
def test_mesh_surface(tmp_path: Path) -> Path:
    """Create a simple surface mesh file for testing."""
    mesh_file = tmp_path / "surface.mesh"
    mesh_file.write_text("""\
MeshVersionFormatted 2
Dimension 3
Vertices
4
0.0 0.0 0.0 0
1.0 0.0 0.0 0
0.5 1.0 0.0 0
0.5 0.5 1.0 0
Triangles
4
1 2 3 0
1 2 4 0
2 3 4 0
1 3 4 0
End
""")
    return mesh_file


@pytest.fixture
def test_mesh_2d(tmp_path: Path) -> Path:
    """Create a simple 2D mesh file for testing."""
    mesh_file = tmp_path / "test2d.mesh"
    mesh_file.write_text("""\
MeshVersionFormatted 2
Dimension 2
Vertices
3
0.0 0.0 0
1.0 0.0 0
0.5 1.0 0
Triangles
1
1 2 3 0
End
""")
    return mesh_file


class TestParseArgs:
    """Test _parse_args() argument parsing."""

    def test_positional_input(self, test_mesh_3d: Path) -> None:
        """Positional argument is detected as input file."""
        result = _parse_args([str(test_mesh_3d)])
        assert result.input_mesh == str(test_mesh_3d)

    def test_explicit_input_flag(self, test_mesh_3d: Path) -> None:
        """The -in flag sets the input file."""
        result = _parse_args(["-in", str(test_mesh_3d)])
        assert result.input_mesh == str(test_mesh_3d)

    def test_output_flag_short(
        self,
        test_mesh_3d: Path,
        tmp_path: Path,
    ) -> None:
        """The -o flag sets the output file."""
        out = str(tmp_path / "out.mesh")
        result = _parse_args([str(test_mesh_3d), "-o", out])
        assert result.output_mesh == out

    def test_output_flag_long(
        self,
        test_mesh_3d: Path,
        tmp_path: Path,
    ) -> None:
        """The -out flag sets the output file."""
        out = str(tmp_path / "out.mesh")
        result = _parse_args([str(test_mesh_3d), "-out", out])
        assert result.output_mesh == out

    def test_numeric_options(self, test_mesh_3d: Path) -> None:
        """Numeric flags are parsed into remesh_options."""
        result = _parse_args(
            [
                str(test_mesh_3d),
                "-hmax",
                "0.5",
                "-hmin",
                "0.01",
                "-hausd",
                "0.001",
                "-hgrad",
                "1.3",
            ],
        )
        assert result.remesh_options["hmax"] == 0.5
        assert result.remesh_options["hmin"] == 0.01
        assert result.remesh_options["hausd"] == 0.001
        assert result.remesh_options["hgrad"] == 1.3

    def test_verbose_flag(self, test_mesh_3d: Path) -> None:
        """The -v flag maps to verbose."""
        result = _parse_args([str(test_mesh_3d), "-v", "1"])
        assert result.remesh_options["verbose"] == 1

    def test_memory_flag(self, test_mesh_3d: Path) -> None:
        """The -m flag maps to mem."""
        result = _parse_args([str(test_mesh_3d), "-m", "512"])
        assert result.remesh_options["mem"] == 512

    def test_boolean_flags(self, test_mesh_3d: Path) -> None:
        """Boolean flags (no value) are parsed as 1."""
        result = _parse_args(
            [
                str(test_mesh_3d),
                "-noinsert",
                "-noswap",
                "-nomove",
            ],
        )
        assert result.remesh_options["noinsert"] == 1
        assert result.remesh_options["noswap"] == 1
        assert result.remesh_options["nomove"] == 1

    def test_levelset_flag(self, test_mesh_3d: Path) -> None:
        """The -ls flag triggers level-set mode."""
        result = _parse_args([str(test_mesh_3d), "-ls", "0.5"])
        assert result.ls_value == 0.5

    def test_lagrangian_flag(self, test_mesh_3d: Path) -> None:
        """The -lag flag triggers Lagrangian mode."""
        result = _parse_args([str(test_mesh_3d), "-lag", "1"])
        assert result.lag_value == 1

    def test_sol_and_met_flags(self, test_mesh_3d: Path) -> None:
        """The -sol and -met flags are parsed."""
        result = _parse_args(
            [
                str(test_mesh_3d),
                "-sol",
                "input.sol",
                "-met",
                "metric.sol",
            ],
        )
        assert result.sol_file == "input.sol"
        assert result.met_file == "metric.sol"

    def test_output_before_input(
        self,
        test_mesh_3d: Path,
        tmp_path: Path,
    ) -> None:
        """Input is detected even when -o comes before the positional arg."""
        out = str(tmp_path / "out.mesh")
        result = _parse_args(["-o", out, str(test_mesh_3d)])
        assert result.input_mesh == str(test_mesh_3d)
        assert result.output_mesh == out

    def test_mixed_flags_order(
        self,
        test_mesh_3d: Path,
        tmp_path: Path,
    ) -> None:
        """Flags in any order are parsed correctly."""
        out = str(tmp_path / "out.mesh")
        result = _parse_args(
            [
                "-hmax",
                "0.5",
                str(test_mesh_3d),
                "-o",
                out,
                "-noinsert",
                "-v",
                "-1",
            ],
        )
        assert result.input_mesh == str(test_mesh_3d)
        assert result.output_mesh == out
        assert result.remesh_options["hmax"] == 0.5
        assert result.remesh_options["noinsert"] == 1
        assert result.remesh_options["verbose"] == -1

    def test_no_input_returns_none(self) -> None:
        """No input file results in input_mesh=None."""
        result = _parse_args(["-hmax", "0.5"])
        assert result.input_mesh is None

    def test_nonexistent_positional_ignored(self) -> None:
        """A positional arg that doesn't exist as a file is ignored."""
        result = _parse_args(["nonexistent_file.mesh"])
        assert result.input_mesh is None

    def test_angle_detection(self, test_mesh_3d: Path) -> None:
        """The -ar flag is parsed as a numeric option."""
        result = _parse_args([str(test_mesh_3d), "-ar", "30"])
        assert result.remesh_options["ar"] == 30.0

    def test_optim_flag(self, test_mesh_3d: Path) -> None:
        """The -optim flag is parsed as boolean."""
        result = _parse_args([str(test_mesh_3d), "-optim"])
        assert result.remesh_options["optim"] == 1

    def test_hsiz_flag(self, test_mesh_3d: Path) -> None:
        """The -hsiz flag is parsed as a numeric option."""
        result = _parse_args([str(test_mesh_3d), "-hsiz", "0.1"])
        assert result.remesh_options["hsiz"] == 0.1


class TestDefaultOutputPath:
    """Test _default_output_path() convention."""

    def test_mesh_extension(self) -> None:
        """Standard .mesh extension."""
        assert _default_output_path("input.mesh") == "input.o.mesh"

    def test_meshb_extension(self) -> None:
        """Binary .meshb extension."""
        assert _default_output_path("input.meshb") == "input.o.meshb"

    def test_vtk_extension(self) -> None:
        """VTK extension."""
        assert _default_output_path("model.vtk") == "model.o.vtk"

    def test_path_with_directory(self) -> None:
        """Full path is preserved."""
        result = Path(_default_output_path("/data/meshes/cube.mesh"))
        assert result == Path("/data/meshes/cube.o.mesh")


class TestMmgCLI:
    """Test mmg CLI command."""

    def test_mmg_help(self) -> None:
        """Test mmg --help shows help message."""
        result = subprocess.run(
            ["mmg", "--help"],
            capture_output=True,
            text=True,
            check=False,
        )
        assert result.returncode == 0
        assert "usage" in result.stdout.lower() or "mmg" in result.stdout.lower()

    def test_mmg_version(self) -> None:
        """Test mmg --version shows version info."""
        result = subprocess.run(
            ["mmg", "--version"],
            capture_output=True,
            text=True,
            check=False,
        )
        assert result.returncode == 0
        assert "mmgpy" in result.stdout
        assert "MMG" in result.stdout

    def test_mmg_no_args_shows_help(self) -> None:
        """Test mmg without arguments shows help."""
        result = subprocess.run(
            ["mmg"],
            capture_output=True,
            text=True,
            check=False,
        )
        assert result.returncode == 0
        assert "usage" in result.stdout.lower()

    def test_mmg_nonexistent_file(self) -> None:
        """Test mmg with nonexistent file shows error."""
        result = subprocess.run(
            ["mmg", "nonexistent.mesh"],
            capture_output=True,
            text=True,
            check=False,
        )
        assert result.returncode != 0
        combined_output = result.stdout + result.stderr
        assert "No input mesh file found" in combined_output


class TestMmgInputDetection:
    """Test input file detection logic in _run_mmg."""

    def test_detects_input_with_output_flag_before(
        self,
        test_mesh_3d: Path,
        tmp_path: Path,
    ) -> None:
        """Input is detected when -o flag comes before it."""
        output_file = tmp_path / "output.mesh"
        result = subprocess.run(
            ["mmg", "-o", str(output_file), str(test_mesh_3d)],
            capture_output=True,
            text=True,
            check=False,
            timeout=30,
        )
        combined = result.stdout + result.stderr
        assert result.returncode == 0 or "Detected" in combined

    def test_detects_input_with_hmax_flag(
        self,
        test_mesh_3d: Path,
        tmp_path: Path,
    ) -> None:
        """Input is detected when -hmax flag is present."""
        output_file = tmp_path / "output.mesh"
        result = subprocess.run(
            ["mmg", "-hmax", "0.5", str(test_mesh_3d), "-o", str(output_file)],
            capture_output=True,
            text=True,
            check=False,
            timeout=30,
        )
        combined = result.stdout + result.stderr
        assert result.returncode == 0 or "Detected" in combined


class TestMmgMeshTypeDetection:
    """Test mesh type auto-detection."""

    def test_detects_3d_tetrahedral_mesh(
        self,
        test_mesh_3d: Path,
        tmp_path: Path,
    ) -> None:
        """3D tetrahedral mesh is detected and remeshed."""
        output_file = tmp_path / "output.mesh"
        result = subprocess.run(
            ["mmg", str(test_mesh_3d), "-o", str(output_file)],
            capture_output=True,
            text=True,
            check=False,
            timeout=30,
        )
        combined = (result.stdout + result.stderr).lower()
        assert "tetrahedral" in combined or result.returncode == 0

    def test_detects_surface_mesh(
        self,
        test_mesh_surface: Path,
        tmp_path: Path,
    ) -> None:
        """Surface mesh is detected and remeshed."""
        output_file = tmp_path / "output.mesh"
        result = subprocess.run(
            ["mmg", str(test_mesh_surface), "-o", str(output_file)],
            capture_output=True,
            text=True,
            check=False,
            timeout=30,
        )
        combined = (result.stdout + result.stderr).lower()
        assert "surface" in combined or result.returncode == 0

    def test_detects_2d_mesh(self, test_mesh_2d: Path, tmp_path: Path) -> None:
        """2D mesh is detected and remeshed."""
        output_file = tmp_path / "output.mesh"
        result = subprocess.run(
            ["mmg", str(test_mesh_2d), "-o", str(output_file)],
            capture_output=True,
            text=True,
            check=False,
            timeout=30,
        )
        combined = (result.stdout + result.stderr).lower()
        assert "2d" in combined or result.returncode == 0


class TestMmgRemeshing:
    """Test that the mmg CLI actually produces output files."""

    def test_remesh_produces_output(
        self,
        test_mesh_3d: Path,
        tmp_path: Path,
    ) -> None:
        """Remeshing creates an output file."""
        output_file = tmp_path / "output.mesh"
        result = subprocess.run(
            ["mmg", str(test_mesh_3d), "-o", str(output_file), "-v", "-1"],
            capture_output=True,
            text=True,
            check=False,
            timeout=30,
        )
        assert result.returncode == 0
        assert output_file.exists()

    def test_default_output_naming(
        self,
        test_mesh_3d: Path,
    ) -> None:
        """Without -o, output follows the {stem}.o{ext} convention."""
        result = subprocess.run(
            ["mmg", str(test_mesh_3d), "-v", "-1"],
            capture_output=True,
            text=True,
            check=False,
            timeout=30,
        )
        assert result.returncode == 0
        expected_output = test_mesh_3d.with_name("test.o.mesh")
        assert expected_output.exists()

    def test_remesh_with_options(
        self,
        test_mesh_3d: Path,
        tmp_path: Path,
    ) -> None:
        """Remeshing with -hmax option works."""
        output_file = tmp_path / "output.mesh"
        result = subprocess.run(
            [
                "mmg",
                str(test_mesh_3d),
                "-o",
                str(output_file),
                "-hmax",
                "0.5",
                "-v",
                "-1",
            ],
            capture_output=True,
            text=True,
            check=False,
            timeout=30,
        )
        assert result.returncode == 0
        assert output_file.exists()


class TestMmgErrorHandling:
    """Test error handling and helpful messages."""

    def test_unsupported_format_shows_error(
        self,
        tmp_path: Path,
    ) -> None:
        """Unrecognizable file format gives a clear error."""
        bad_file = tmp_path / "bad.xyz123"
        bad_file.write_text("invalid mesh content that cannot be parsed")

        result = subprocess.run(
            ["mmg", str(bad_file)],
            capture_output=True,
            text=True,
            check=False,
            timeout=30,
        )
        assert result.returncode != 0
        combined_output = result.stdout + result.stderr
        assert "Failed to read" in combined_output or "Error" in combined_output
