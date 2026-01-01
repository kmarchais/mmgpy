"""Tests for options dataclasses and convenience methods."""

import numpy as np
import pytest

from mmgpy import (
    Mmg2DOptions,
    Mmg3DOptions,
    MmgMesh2D,
    MmgMesh3D,
    MmgMeshS,
    MmgSOptions,
)


class TestMmg3DOptions:
    """Tests for Mmg3DOptions dataclass."""

    def test_default_values(self) -> None:
        """Test that default values are None/False."""
        opts = Mmg3DOptions()
        assert opts.hmin is None
        assert opts.hmax is None
        assert opts.hsiz is None
        assert opts.hausd is None
        assert opts.hgrad is None
        assert opts.verbose is None
        assert opts.optim is False
        assert opts.noinsert is False
        assert opts.noswap is False
        assert opts.nomove is False
        assert opts.nosurf is False

    def test_set_values(self) -> None:
        """Test setting values."""
        opts = Mmg3DOptions(hmin=0.01, hmax=0.1, verbose=1)
        assert opts.hmin == 0.01
        assert opts.hmax == 0.1
        assert opts.verbose == 1

    def test_validation_hmin_positive(self) -> None:
        """Test that hmin must be positive."""
        with pytest.raises(ValueError, match="hmin must be positive"):
            Mmg3DOptions(hmin=-0.1)

    def test_validation_hmax_positive(self) -> None:
        """Test that hmax must be positive."""
        with pytest.raises(ValueError, match="hmax must be positive"):
            Mmg3DOptions(hmax=0)

    def test_validation_hsiz_positive(self) -> None:
        """Test that hsiz must be positive."""
        with pytest.raises(ValueError, match="hsiz must be positive"):
            Mmg3DOptions(hsiz=-1)

    def test_validation_hmin_le_hmax(self) -> None:
        """Test that hmin must be <= hmax."""
        with pytest.raises(ValueError, match="hmin must be less than or equal"):
            Mmg3DOptions(hmin=0.5, hmax=0.1)

    def test_validation_hausd_positive(self) -> None:
        """Test that hausd must be positive."""
        with pytest.raises(ValueError, match="hausd must be positive"):
            Mmg3DOptions(hausd=0)

    def test_validation_hgrad_ge_1(self) -> None:
        """Test that hgrad must be >= 1.0."""
        with pytest.raises(ValueError, match=r"hgrad must be >= 1\.0"):
            Mmg3DOptions(hgrad=0.5)

    def test_validation_mem_positive(self) -> None:
        """Test that mem must be positive."""
        with pytest.raises(ValueError, match="mem must be positive"):
            Mmg3DOptions(mem=0)

    def test_to_dict_empty(self) -> None:
        """Test to_dict with default values."""
        opts = Mmg3DOptions()
        assert opts.to_dict() == {}

    def test_to_dict_with_values(self) -> None:
        """Test to_dict with set values."""
        opts = Mmg3DOptions(hmin=0.01, hmax=0.1, verbose=1)
        d = opts.to_dict()
        assert d == {"hmin": 0.01, "hmax": 0.1, "verbose": 1}

    def test_to_dict_bool_conversion(self) -> None:
        """Test that booleans are converted to 1."""
        opts = Mmg3DOptions(optim=True, noinsert=True)
        d = opts.to_dict()
        assert d == {"optim": 1, "noinsert": 1}

    def test_to_dict_false_bools_excluded(self) -> None:
        """Test that False booleans are excluded."""
        opts = Mmg3DOptions(optim=False, noinsert=False)
        d = opts.to_dict()
        assert "optim" not in d
        assert "noinsert" not in d

    def test_fine_preset(self) -> None:
        """Test fine() factory method."""
        opts = Mmg3DOptions.fine(hmax=0.1)
        assert opts.hmax == 0.1
        assert opts.hausd == 0.01  # hmax/10
        assert opts.hgrad == 1.2

    def test_fine_preset_custom_hausd(self) -> None:
        """Test fine() with custom hausd."""
        opts = Mmg3DOptions.fine(hmax=0.1, hausd=0.005)
        assert opts.hausd == 0.005

    def test_coarse_preset(self) -> None:
        """Test coarse() factory method."""
        opts = Mmg3DOptions.coarse(hmax=0.5)
        assert opts.hmax == 0.5
        assert opts.hgrad == 1.5

    def test_optimize_only_preset(self) -> None:
        """Test optimize_only() factory method."""
        opts = Mmg3DOptions.optimize_only()
        assert opts.optim is True
        assert opts.noinsert is True

    def test_optimize_only_with_verbose(self) -> None:
        """Test optimize_only() with verbose."""
        opts = Mmg3DOptions.optimize_only(verbose=1)
        assert opts.optim is True
        assert opts.noinsert is True
        assert opts.verbose == 1


class TestMmg2DOptions:
    """Tests for Mmg2DOptions dataclass."""

    def test_default_values(self) -> None:
        """Test that default values are None/False."""
        opts = Mmg2DOptions()
        assert opts.hmin is None
        assert opts.hmax is None
        assert opts.optim is False

    def test_validation(self) -> None:
        """Test validation works."""
        with pytest.raises(ValueError, match="hmin must be positive"):
            Mmg2DOptions(hmin=-0.1)

    def test_to_dict(self) -> None:
        """Test to_dict conversion."""
        opts = Mmg2DOptions(hmax=0.1, optim=True)
        d = opts.to_dict()
        assert d == {"hmax": 0.1, "optim": 1}

    def test_presets(self) -> None:
        """Test factory presets exist."""
        fine = Mmg2DOptions.fine(hmax=0.1)
        coarse = Mmg2DOptions.coarse(hmax=0.5)
        optimize = Mmg2DOptions.optimize_only()

        assert fine.hmax == 0.1
        assert coarse.hmax == 0.5
        assert optimize.optim is True


class TestMmgSOptions:
    """Tests for MmgSOptions dataclass."""

    def test_default_values(self) -> None:
        """Test that default values are None/False."""
        opts = MmgSOptions()
        assert opts.hmin is None
        assert opts.hmax is None
        assert opts.optim is False

    def test_validation(self) -> None:
        """Test validation works."""
        with pytest.raises(ValueError, match="hmax must be positive"):
            MmgSOptions(hmax=0)

    def test_to_dict(self) -> None:
        """Test to_dict conversion."""
        opts = MmgSOptions(hmax=0.1, nomove=True)
        d = opts.to_dict()
        assert d == {"hmax": 0.1, "nomove": 1}


class TestConvenienceMethods:
    """Tests for convenience remeshing methods."""

    @pytest.fixture
    def mesh3d(self) -> MmgMesh3D:
        """Create a simple 3D mesh."""
        vertices = np.array(
            [
                [0.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [0.5, 1.0, 0.0],
                [0.5, 0.5, 1.0],
            ],
            dtype=np.float64,
        )
        elements = np.array([[0, 1, 2, 3]], dtype=np.int32)
        return MmgMesh3D(vertices, elements)

    @pytest.fixture
    def mesh2d(self) -> MmgMesh2D:
        """Create a simple 2D mesh."""
        vertices = np.array(
            [
                [0.0, 0.0],
                [1.0, 0.0],
                [1.0, 1.0],
                [0.0, 1.0],
            ],
            dtype=np.float64,
        )
        triangles = np.array([[0, 1, 2], [0, 2, 3]], dtype=np.int32)
        return MmgMesh2D(vertices, triangles)

    @pytest.fixture
    def meshs(self) -> MmgMeshS:
        """Create a simple surface mesh."""
        vertices = np.array(
            [
                [0.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [0.5, 1.0, 0.0],
                [0.5, 0.5, 1.0],
            ],
            dtype=np.float64,
        )
        triangles = np.array(
            [[0, 1, 2], [0, 1, 3], [1, 2, 3], [0, 2, 3]],
            dtype=np.int32,
        )
        return MmgMeshS(vertices, triangles)

    def test_remesh_optimize_exists_3d(self, mesh3d: MmgMesh3D) -> None:
        """Test remesh_optimize method exists on MmgMesh3D."""
        assert hasattr(mesh3d, "remesh_optimize")
        assert callable(mesh3d.remesh_optimize)

    def test_remesh_uniform_exists_3d(self, mesh3d: MmgMesh3D) -> None:
        """Test remesh_uniform method exists on MmgMesh3D."""
        assert hasattr(mesh3d, "remesh_uniform")
        assert callable(mesh3d.remesh_uniform)

    def test_remesh_optimize_exists_2d(self, mesh2d: MmgMesh2D) -> None:
        """Test remesh_optimize method exists on MmgMesh2D."""
        assert hasattr(mesh2d, "remesh_optimize")
        assert callable(mesh2d.remesh_optimize)

    def test_remesh_uniform_exists_2d(self, mesh2d: MmgMesh2D) -> None:
        """Test remesh_uniform method exists on MmgMesh2D."""
        assert hasattr(mesh2d, "remesh_uniform")
        assert callable(mesh2d.remesh_uniform)

    def test_remesh_optimize_exists_s(self, meshs: MmgMeshS) -> None:
        """Test remesh_optimize method exists on MmgMeshS."""
        assert hasattr(meshs, "remesh_optimize")
        assert callable(meshs.remesh_optimize)

    def test_remesh_uniform_exists_s(self, meshs: MmgMeshS) -> None:
        """Test remesh_uniform method exists on MmgMeshS."""
        assert hasattr(meshs, "remesh_uniform")
        assert callable(meshs.remesh_uniform)

    def test_remesh_optimize_runs_3d(self, mesh3d: MmgMesh3D) -> None:
        """Test remesh_optimize actually runs on 3D mesh."""
        mesh3d.remesh_optimize(verbose=-1)
        # Just verify it doesn't crash

    def test_remesh_uniform_runs_3d(self, mesh3d: MmgMesh3D) -> None:
        """Test remesh_uniform actually runs on 3D mesh."""
        mesh3d.remesh_uniform(0.5, verbose=-1)
        # Just verify it doesn't crash

    def test_remesh_optimize_runs_2d(self, mesh2d: MmgMesh2D) -> None:
        """Test remesh_optimize actually runs on 2D mesh."""
        mesh2d.remesh_optimize(verbose=-1)

    def test_remesh_uniform_runs_2d(self, mesh2d: MmgMesh2D) -> None:
        """Test remesh_uniform actually runs on 2D mesh."""
        mesh2d.remesh_uniform(0.5, verbose=-1)

    def test_remesh_optimize_runs_s(self, meshs: MmgMeshS) -> None:
        """Test remesh_optimize actually runs on surface mesh."""
        meshs.remesh_optimize(verbose=-1)

    def test_remesh_uniform_runs_s(self, meshs: MmgMeshS) -> None:
        """Test remesh_uniform actually runs on surface mesh."""
        meshs.remesh_uniform(0.5, verbose=-1)


class TestModuleExports:
    """Test that options are properly exported."""

    def test_mmg3doptions_importable(self) -> None:
        """Test Mmg3DOptions can be imported from mmgpy."""
        from mmgpy import Mmg3DOptions

        assert Mmg3DOptions is not None

    def test_mmg2doptions_importable(self) -> None:
        """Test Mmg2DOptions can be imported from mmgpy."""
        from mmgpy import Mmg2DOptions

        assert Mmg2DOptions is not None

    def test_mmgsoptions_importable(self) -> None:
        """Test MmgSOptions can be imported from mmgpy."""
        from mmgpy import MmgSOptions

        assert MmgSOptions is not None
