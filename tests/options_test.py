"""Tests for options dataclasses and convenience methods."""

import numpy as np
import pytest

from mmgpy import Mesh, Mmg2DOptions, Mmg3DOptions, MmgSOptions
from mmgpy._mmgpy import MmgMesh2D, MmgMesh3D, MmgMeshS


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

    def test_validation_ar_range(self) -> None:
        """Test that ar (angle detection) must be between 0 and 180."""
        with pytest.raises(ValueError, match=r"ar.*must be between 0 and 180"):
            Mmg3DOptions(ar=-1)
        with pytest.raises(ValueError, match=r"ar.*must be between 0 and 180"):
            Mmg3DOptions(ar=181)
        # Valid angles should not raise
        Mmg3DOptions(ar=0)
        Mmg3DOptions(ar=90)
        Mmg3DOptions(ar=180)

    def test_validation_hgradreq(self) -> None:
        """Test that hgradreq must be >= 1.0 or -1."""
        with pytest.raises(ValueError, match=r"hgradreq must be >= 1\.0 or -1"):
            Mmg3DOptions(hgradreq=0.5)
        with pytest.raises(ValueError, match=r"hgradreq must be >= 1\.0 or -1"):
            Mmg3DOptions(hgradreq=0)
        # Valid values should not raise
        Mmg3DOptions(hgradreq=-1)  # Disable
        Mmg3DOptions(hgradreq=1.0)
        Mmg3DOptions(hgradreq=1.5)

    def test_validation_hmin_equals_hmax(self) -> None:
        """Test that hmin == hmax is valid (edge case)."""
        # This is a valid edge case for uniform mesh sizing
        opts = Mmg3DOptions(hmin=0.1, hmax=0.1)
        assert opts.hmin == 0.1
        assert opts.hmax == 0.1

    def test_frozen_immutable(self) -> None:
        """Test that options are immutable (frozen)."""
        opts = Mmg3DOptions(hmax=0.1)
        with pytest.raises(AttributeError):
            opts.hmax = 0.2  # type: ignore[misc]

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
        assert opts.nosurf is False

    def test_validation(self) -> None:
        """Test validation works."""
        with pytest.raises(ValueError, match="hmin must be positive"):
            Mmg2DOptions(hmin=-0.1)

    def test_to_dict(self) -> None:
        """Test to_dict conversion."""
        opts = Mmg2DOptions(hmax=0.1, optim=True)
        d = opts.to_dict()
        assert d == {"hmax": 0.1, "optim": 1}

    def test_nosurf_option(self) -> None:
        """Test nosurf option is available for 2D meshes."""
        opts = Mmg2DOptions(nosurf=True)
        assert opts.nosurf is True
        d = opts.to_dict()
        assert d == {"nosurf": 1}

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

    def test_no_nosurf_option(self) -> None:
        """Test that MmgSOptions does NOT have nosurf (unlike 3D and 2D)."""
        from dataclasses import fields

        # Surface remeshing doesn't have nosurf because the whole mesh is a surface
        field_names = [f.name for f in fields(MmgSOptions)]
        assert "nosurf" not in field_names


class TestConvenienceMethods:
    """Tests for convenience remeshing methods."""

    @pytest.fixture
    def mesh3d(self) -> Mesh:
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
        return Mesh(vertices, elements)

    @pytest.fixture
    def mesh2d(self) -> Mesh:
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
        return Mesh(vertices, triangles)

    @pytest.fixture
    def meshs(self) -> Mesh:
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
        return Mesh(vertices, triangles)

    def test_remesh_optimize_exists_3d(self, mesh3d: Mesh) -> None:
        """Test remesh_optimize method exists on MmgMesh3D."""
        assert hasattr(mesh3d, "remesh_optimize")
        assert callable(mesh3d.remesh_optimize)

    def test_remesh_uniform_exists_3d(self, mesh3d: Mesh) -> None:
        """Test remesh_uniform method exists on MmgMesh3D."""
        assert hasattr(mesh3d, "remesh_uniform")
        assert callable(mesh3d.remesh_uniform)

    def test_remesh_optimize_exists_2d(self, mesh2d: Mesh) -> None:
        """Test remesh_optimize method exists on MmgMesh2D."""
        assert hasattr(mesh2d, "remesh_optimize")
        assert callable(mesh2d.remesh_optimize)

    def test_remesh_uniform_exists_2d(self, mesh2d: Mesh) -> None:
        """Test remesh_uniform method exists on MmgMesh2D."""
        assert hasattr(mesh2d, "remesh_uniform")
        assert callable(mesh2d.remesh_uniform)

    def test_remesh_optimize_exists_s(self, meshs: Mesh) -> None:
        """Test remesh_optimize method exists on MmgMeshS."""
        assert hasattr(meshs, "remesh_optimize")
        assert callable(meshs.remesh_optimize)

    def test_remesh_uniform_exists_s(self, meshs: Mesh) -> None:
        """Test remesh_uniform method exists on MmgMeshS."""
        assert hasattr(meshs, "remesh_uniform")
        assert callable(meshs.remesh_uniform)

    def test_remesh_optimize_runs_3d(self, mesh3d: Mesh) -> None:
        """Test remesh_optimize actually runs on 3D mesh."""
        mesh3d.remesh_optimize(verbose=-1)
        # Just verify it doesn't crash

    def test_remesh_uniform_runs_3d(self, mesh3d: Mesh) -> None:
        """Test remesh_uniform actually runs on 3D mesh."""
        mesh3d.remesh_uniform(0.5, verbose=-1)
        # Just verify it doesn't crash

    def test_remesh_optimize_runs_2d(self, mesh2d: Mesh) -> None:
        """Test remesh_optimize actually runs on 2D mesh."""
        mesh2d.remesh_optimize(verbose=-1)

    def test_remesh_uniform_runs_2d(self, mesh2d: Mesh) -> None:
        """Test remesh_uniform actually runs on 2D mesh."""
        mesh2d.remesh_uniform(0.5, verbose=-1)

    def test_remesh_optimize_runs_s(self, meshs: Mesh) -> None:
        """Test remesh_optimize actually runs on surface mesh."""
        meshs.remesh_optimize(verbose=-1)

    def test_remesh_uniform_runs_s(self, meshs: Mesh) -> None:
        """Test remesh_uniform actually runs on surface mesh."""
        meshs.remesh_uniform(0.5, verbose=-1)

    def test_remesh_with_options_object_3d(self, mesh3d: Mesh) -> None:
        """Test passing options object directly to remesh on 3D mesh."""
        opts = Mmg3DOptions(hsiz=0.5, verbose=-1)
        mesh3d.remesh(opts)  # Pass options directly without unpacking

    def test_remesh_with_options_object_2d(self, mesh2d: Mesh) -> None:
        """Test passing options object directly to remesh on 2D mesh."""
        opts = Mmg2DOptions(hsiz=0.5, verbose=-1)
        mesh2d.remesh(opts)

    def test_remesh_with_options_object_s(self, meshs: Mesh) -> None:
        """Test passing options object directly to remesh on surface mesh."""
        opts = MmgSOptions(hsiz=0.5, verbose=-1)
        meshs.remesh(opts)

    def test_remesh_with_preset_3d(self, mesh3d: Mesh) -> None:
        """Test passing preset options directly to remesh."""
        mesh3d.remesh(Mmg3DOptions.optimize_only(verbose=-1))

    def test_remesh_options_and_kwargs_conflict(self, mesh3d: Mesh) -> None:
        """Test that passing both options and kwargs raises TypeError."""
        opts = Mmg3DOptions(hsiz=0.5)
        with pytest.raises(TypeError, match="Cannot pass both options object"):
            mesh3d.remesh(opts, verbose=-1)

    def test_remesh_options_and_kwargs_conflict_2d(self, mesh2d: Mesh) -> None:
        """Test that passing both options and kwargs raises TypeError for 2D."""
        opts = Mmg2DOptions(hsiz=0.5)
        with pytest.raises(TypeError, match="Cannot pass both options object"):
            mesh2d.remesh(opts, hmax=0.2)

    def test_remesh_options_and_kwargs_conflict_s(self, meshs: Mesh) -> None:
        """Test that passing both options and kwargs raises TypeError for surface."""
        opts = MmgSOptions(hsiz=0.5)
        with pytest.raises(TypeError, match="Cannot pass both options object"):
            meshs.remesh(opts, optim=True)

    def test_remesh_wrong_options_type_3d(self, mesh3d: Mesh) -> None:
        """Test that passing wrong options type raises TypeError for 3D mesh."""
        opts_2d = Mmg2DOptions(hsiz=0.5)
        with pytest.raises(
            TypeError,
            match="Expected Mmg3DOptions for tetrahedral mesh",
        ):
            mesh3d.remesh(opts_2d)  # type: ignore[arg-type]
        opts_s = MmgSOptions(hsiz=0.5)
        with pytest.raises(
            TypeError,
            match="Expected Mmg3DOptions for tetrahedral mesh",
        ):
            mesh3d.remesh(opts_s)  # type: ignore[arg-type]

    def test_remesh_wrong_options_type_2d(self, mesh2d: Mesh) -> None:
        """Test that passing wrong options type raises TypeError for 2D mesh."""
        opts_3d = Mmg3DOptions(hsiz=0.5)
        with pytest.raises(
            TypeError,
            match="Expected Mmg2DOptions for triangular_2d mesh",
        ):
            mesh2d.remesh(opts_3d)  # type: ignore[arg-type]

    def test_remesh_wrong_options_type_s(self, meshs: Mesh) -> None:
        """Test that passing wrong options type raises TypeError for surface mesh."""
        opts_3d = Mmg3DOptions(hsiz=0.5)
        with pytest.raises(
            TypeError,
            match="Expected MmgSOptions for triangular_surface mesh",
        ):
            meshs.remesh(opts_3d)  # type: ignore[arg-type]


class TestMeshChangeVerification:
    """Tests that verify mesh actually changes after remeshing."""

    @pytest.fixture
    def coarse_mesh3d(self) -> Mesh:
        """Create a coarse 3D mesh (single tetrahedron)."""
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
        return Mesh(vertices, elements)

    @pytest.fixture
    def coarse_mesh2d(self) -> Mesh:
        """Create a coarse 2D mesh (two triangles)."""
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
        return Mesh(vertices, triangles)

    def test_remesh_uniform_increases_vertices_3d(
        self,
        coarse_mesh3d: Mesh,
    ) -> None:
        """Test that remesh_uniform with small size increases vertex count."""
        initial_vertices = len(coarse_mesh3d.get_vertices())
        coarse_mesh3d.remesh_uniform(0.3, verbose=-1)
        final_vertices = len(coarse_mesh3d.get_vertices())
        assert final_vertices > initial_vertices

    def test_remesh_uniform_increases_elements_3d(
        self,
        coarse_mesh3d: Mesh,
    ) -> None:
        """Test that remesh_uniform with small size increases element count."""
        initial_elements = len(coarse_mesh3d.get_tetrahedra())
        coarse_mesh3d.remesh_uniform(0.3, verbose=-1)
        final_elements = len(coarse_mesh3d.get_tetrahedra())
        assert final_elements > initial_elements

    def test_remesh_uniform_increases_vertices_2d(
        self,
        coarse_mesh2d: Mesh,
    ) -> None:
        """Test that remesh_uniform with small size increases vertex count for 2D."""
        initial_vertices = len(coarse_mesh2d.get_vertices())
        coarse_mesh2d.remesh_uniform(0.3, verbose=-1)
        final_vertices = len(coarse_mesh2d.get_vertices())
        assert final_vertices > initial_vertices

    def test_remesh_with_options_changes_mesh(self, coarse_mesh3d: Mesh) -> None:
        """Test that remesh with options object actually modifies the mesh."""
        initial_vertices = len(coarse_mesh3d.get_vertices())
        opts = Mmg3DOptions(hsiz=0.3, verbose=-1)
        coarse_mesh3d.remesh(opts)
        final_vertices = len(coarse_mesh3d.get_vertices())
        assert final_vertices > initial_vertices

    def test_remesh_with_fine_preset(self, coarse_mesh3d: Mesh) -> None:
        """Test that remesh with fine preset creates more vertices."""
        initial_vertices = len(coarse_mesh3d.get_vertices())
        coarse_mesh3d.remesh(Mmg3DOptions.fine(hmax=0.3))
        final_vertices = len(coarse_mesh3d.get_vertices())
        assert final_vertices > initial_vertices


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


class TestInvalidOptionTypes:
    """Tests for invalid option type handling (issue #108)."""

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

    def test_invalid_option_type_string_for_double_3d(
        self,
        mesh3d: Mesh,
    ) -> None:
        """Test that string instead of float raises ValueError with clear message."""
        with pytest.raises(ValueError, match=r"hmax.*must be a number.*str"):
            mesh3d.remesh(hmax="0.1")

    def test_invalid_option_type_string_for_double_2d(
        self,
        mesh2d: Mesh,
    ) -> None:
        """Test that string instead of float raises ValueError for 2D mesh."""
        with pytest.raises(ValueError, match=r"hmax.*must be a number.*str"):
            mesh2d.remesh(hmax="0.1")

    def test_invalid_option_type_string_for_double_surface(
        self,
        meshs: Mesh,
    ) -> None:
        """Test that string instead of float raises ValueError for surface mesh."""
        with pytest.raises(ValueError, match=r"hmax.*must be a number.*str"):
            meshs.remesh(hmax="0.1")

    def test_invalid_option_type_list_for_integer_3d(
        self,
        mesh3d: Mesh,
    ) -> None:
        """Test that list instead of int raises ValueError with clear message."""
        with pytest.raises(ValueError, match=r"verbose.*must be an integer.*list"):
            mesh3d.remesh(verbose=[1, 2])

    def test_invalid_option_type_list_for_integer_2d(
        self,
        mesh2d: Mesh,
    ) -> None:
        """Test that list instead of int raises ValueError for 2D mesh."""
        with pytest.raises(ValueError, match=r"verbose.*must be an integer.*list"):
            mesh2d.remesh(verbose=[1, 2])

    def test_invalid_option_type_list_for_integer_surface(
        self,
        meshs: Mesh,
    ) -> None:
        """Test that list instead of int raises ValueError for surface mesh."""
        with pytest.raises(ValueError, match=r"verbose.*must be an integer.*list"):
            meshs.remesh(verbose=[1, 2])

    def test_invalid_option_type_dict_for_double(
        self,
        mesh3d: Mesh,
    ) -> None:
        """Test that dict instead of float raises ValueError."""
        with pytest.raises(ValueError, match=r"hmin.*must be a number.*dict"):
            mesh3d.remesh(hmin={"value": 0.1})

    def test_invalid_option_type_none_for_double(
        self,
        mesh3d: Mesh,
    ) -> None:
        """Test that None instead of float raises ValueError."""
        with pytest.raises(ValueError, match=r"hausd.*must be a number.*NoneType"):
            mesh3d.remesh(hausd=None)

    def test_invalid_option_type_tuple_for_integer(
        self,
        mesh3d: Mesh,
    ) -> None:
        """Test that tuple instead of int raises ValueError."""
        with pytest.raises(ValueError, match=r"mem.*must be an integer.*tuple"):
            mesh3d.remesh(mem=(100,))

    def test_error_includes_parameter_name(
        self,
        mesh3d: Mesh,
    ) -> None:
        """Test that error message includes the parameter name."""
        with pytest.raises(ValueError, match="hgrad"):
            mesh3d.remesh(hgrad="invalid")

    def test_error_includes_actual_type(
        self,
        mesh3d: Mesh,
    ) -> None:
        """Test that error message includes actual type received."""
        with pytest.raises(ValueError, match="str"):
            mesh3d.remesh(hsiz="0.5")

    def test_valid_types_still_work_3d(self, mesh3d: Mesh) -> None:
        """Test that valid option types still work correctly."""
        mesh3d.remesh(hmax=0.5, verbose=-1)

    def test_valid_types_still_work_2d(self, mesh2d: Mesh) -> None:
        """Test that valid option types still work correctly for 2D."""
        mesh2d.remesh(hmax=0.5, verbose=-1)

    def test_valid_types_still_work_surface(self, meshs: Mesh) -> None:
        """Test that valid option types still work correctly for surface."""
        meshs.remesh(hmax=0.5, verbose=-1)
