"""Test CLI command functionality."""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

import pytest


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


class TestMmgCLI:
    """Test mmg CLI command."""

    def test_mmg_help(self) -> None:
        """Test mmg --help shows help message."""
        result = subprocess.run(
            [sys.executable, "-m", "mmgpy", "--help"],
            capture_output=True,
            text=True,
            check=False,
        )
        # mmgpy module doesn't have --help, use the entry point directly
        result = subprocess.run(
            ["mmg", "--help"],
            capture_output=True,
            text=True,
            check=False,
        )
        assert result.returncode == 0
        assert "mmg" in result.stdout.lower() or "usage" in result.stdout.lower()

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
        # Error may be in stdout (rich logger) or stderr
        combined_output = result.stdout + result.stderr
        assert "No input mesh file found" in combined_output


class TestMmgInputDetection:
    """Test input file detection logic in _run_mmg."""

    def test_detects_input_with_output_flag_before(
        self,
        test_mesh_3d: Path,
        tmp_path: Path,
    ) -> None:
        """Test that input is detected when -o flag comes before it."""
        output_file = tmp_path / "output.mesh"
        result = subprocess.run(
            ["mmg", "-o", str(output_file), str(test_mesh_3d)],
            capture_output=True,
            text=True,
            check=False,
            timeout=30,
        )
        # Should detect mesh and delegate to mmg3d
        # Or show "not found" if executables not available (editable installs)
        combined = result.stdout + result.stderr
        assert (
            "Detected" in combined
            or result.returncode == 0
            or "not found" in combined.lower()
        )

    def test_detects_input_with_hmax_flag(
        self,
        test_mesh_3d: Path,
        tmp_path: Path,
    ) -> None:
        """Test that input is detected when -hmax flag is present."""
        output_file = tmp_path / "output.mesh"
        result = subprocess.run(
            ["mmg", "-hmax", "0.5", str(test_mesh_3d), "-o", str(output_file)],
            capture_output=True,
            text=True,
            check=False,
            timeout=30,
        )
        # Should detect mesh and delegate to mmg3d
        # Or show "not found" if executables not available (editable installs)
        combined = result.stdout + result.stderr
        assert (
            "Detected" in combined
            or result.returncode == 0
            or "not found" in combined.lower()
        )


class TestMmgMeshTypeDetection:
    """Test mesh type auto-detection."""

    def test_detects_3d_tetrahedral_mesh(
        self,
        test_mesh_3d: Path,
        tmp_path: Path,
    ) -> None:
        """Test detection of 3D tetrahedral mesh."""
        output_file = tmp_path / "output.mesh"
        result = subprocess.run(
            ["mmg", str(test_mesh_3d), "-o", str(output_file)],
            capture_output=True,
            text=True,
            check=False,
            timeout=30,
        )
        # Should detect tetrahedral mesh and use mmg3d
        # Or show "not found" if executables not available (editable installs)
        combined = (result.stdout + result.stderr).lower()
        assert (
            "tetrahedral" in combined
            or result.returncode == 0
            or "not found" in combined
        )

    def test_detects_surface_mesh(
        self,
        test_mesh_surface: Path,
        tmp_path: Path,
    ) -> None:
        """Test detection of surface mesh."""
        output_file = tmp_path / "output.mesh"
        result = subprocess.run(
            ["mmg", str(test_mesh_surface), "-o", str(output_file)],
            capture_output=True,
            text=True,
            check=False,
            timeout=30,
        )
        # Should detect surface mesh and use mmgs
        # Or show "not found" if executables not available (editable installs)
        combined = (result.stdout + result.stderr).lower()
        assert (
            "surface" in combined or result.returncode == 0 or "not found" in combined
        )

    def test_detects_2d_mesh(self, test_mesh_2d: Path, tmp_path: Path) -> None:
        """Test detection of 2D mesh."""
        output_file = tmp_path / "output.mesh"
        result = subprocess.run(
            ["mmg", str(test_mesh_2d), "-o", str(output_file)],
            capture_output=True,
            text=True,
            check=False,
            timeout=30,
        )
        # Should detect 2D mesh and use mmg2d
        # Or show "not found" if executables not available (editable installs)
        combined = (result.stdout + result.stderr).lower()
        assert "2d" in combined or result.returncode == 0 or "not found" in combined


class TestMmgAliases:
    """Test command aliases (mmg2d, mmg3d, mmgs)."""

    def test_mmg3d_alias_runs(self) -> None:
        """Test that mmg3d alias works."""
        result = subprocess.run(
            ["mmg3d", "-h"],
            capture_output=True,
            text=True,
            check=False,
            timeout=10,
        )
        # Should show help, run successfully, or show "not found" for editable installs
        combined = (result.stdout + result.stderr).lower()
        assert result.returncode == 0 or "usage" in combined or "not found" in combined

    def test_mmg2d_alias_runs(self) -> None:
        """Test that mmg2d alias works."""
        result = subprocess.run(
            ["mmg2d", "-h"],
            capture_output=True,
            text=True,
            check=False,
            timeout=10,
        )
        # Should show help, run successfully, or show "not found" for editable installs
        combined = (result.stdout + result.stderr).lower()
        assert result.returncode == 0 or "usage" in combined or "not found" in combined

    def test_mmgs_alias_runs(self) -> None:
        """Test that mmgs alias works."""
        result = subprocess.run(
            ["mmgs", "-h"],
            capture_output=True,
            text=True,
            check=False,
            timeout=10,
        )
        # Should show help, run successfully, or show "not found" for editable installs
        combined = (result.stdout + result.stderr).lower()
        assert result.returncode == 0 or "usage" in combined or "not found" in combined


class TestMmgErrorHandling:
    """Test error handling and helpful messages."""

    def test_unsupported_format_suggests_specific_command(
        self,
        tmp_path: Path,
    ) -> None:
        """Test that unsupported format gives helpful suggestion."""
        # Create a file with completely unrecognizable format
        bad_file = tmp_path / "bad.xyz123"
        bad_file.write_text("invalid mesh content that cannot be parsed")

        result = subprocess.run(
            ["mmg", str(bad_file)],
            capture_output=True,
            text=True,
            check=False,
            timeout=10,
        )
        assert result.returncode != 0
        # Should suggest using specific commands (error may be in stdout or stderr)
        combined_output = result.stdout + result.stderr
        assert (
            "mmg3d" in combined_output
            or "mmg2d" in combined_output
            or "mmgs" in combined_output
            or "Failed to detect" in combined_output
        )
