"""Unit tests for the mmgpy UI modules (parsers, utils, samples)."""

import numpy as np
import pytest

from mmgpy.ui.parsers import (
    SafeFormulaEvaluator,
    evaluate_levelset_formula,
    parse_sol_file,
)
from mmgpy.ui.samples import (
    create_2d_disc,
    create_2d_rectangle,
    create_tetra_cube,
    create_tetra_sphere,
    get_sample_mesh,
    list_samples_by_category,
)
from mmgpy.ui.utils import (
    compute_preset_values,
    get_mesh_diagonal,
    reset_solution_state,
    round_to_significant,
    to_float,
)


class TestParseSolFile:
    """Tests for parse_sol_file function."""

    def test_parse_scalar_at_vertices(self):
        """Test parsing scalar solution at vertices."""
        content = """
MeshVersionFormatted 2
Dimension 3
SolAtVertices
3
1 1
0.5
0.3
0.1
End
"""
        fields = parse_sol_file(content)

        assert "solution@vertices" in fields
        assert fields["solution@vertices"]["location"] == "vertices"
        np.testing.assert_array_almost_equal(
            fields["solution@vertices"]["data"],
            np.array([0.5, 0.3, 0.1]),
        )

    def test_parse_scalar_at_tetrahedra(self):
        """Test parsing scalar solution at tetrahedra."""
        content = """
MeshVersionFormatted 2
Dimension 3
SolAtTetrahedra
2
1 1
1.0
2.0
End
"""
        fields = parse_sol_file(content)

        assert "solution@tetrahedra" in fields
        assert fields["solution@tetrahedra"]["location"] == "tetrahedra"
        np.testing.assert_array_almost_equal(
            fields["solution@tetrahedra"]["data"],
            np.array([1.0, 2.0]),
        )

    def test_parse_vector_field(self):
        """Test parsing vector solution."""
        content = """
MeshVersionFormatted 2
Dimension 3
SolAtVertices
2
1 2
1.0 2.0 3.0
4.0 5.0 6.0
End
"""
        fields = parse_sol_file(content)

        assert "vector@vertices" in fields
        assert fields["vector@vertices"]["location"] == "vertices"
        expected = np.array([[1.0, 2.0, 3.0], [4.0, 5.0, 6.0]])
        np.testing.assert_array_almost_equal(
            fields["vector@vertices"]["data"],
            expected,
        )

    def test_parse_multiple_solutions(self):
        """Test parsing multiple solution fields."""
        content = """
MeshVersionFormatted 2
Dimension 3
SolAtVertices
2
2 1 1
0.5 1.0
0.3 2.0
End
"""
        fields = parse_sol_file(content)

        assert "solution_0@vertices" in fields
        assert "solution_1@vertices" in fields
        np.testing.assert_array_almost_equal(
            fields["solution_0@vertices"]["data"],
            np.array([0.5, 0.3]),
        )
        np.testing.assert_array_almost_equal(
            fields["solution_1@vertices"]["data"],
            np.array([1.0, 2.0]),
        )

    def test_parse_dimension_2d(self):
        """Test parsing 2D solution file."""
        content = """
MeshVersionFormatted 2
Dimension 2
SolAtVertices
2
1 2
1.0 2.0
3.0 4.0
End
"""
        fields = parse_sol_file(content)

        assert "vector@vertices" in fields
        expected = np.array([[1.0, 2.0], [3.0, 4.0]])
        np.testing.assert_array_almost_equal(
            fields["vector@vertices"]["data"],
            expected,
        )

    def test_parse_empty_content(self):
        """Test parsing empty content."""
        fields = parse_sol_file("")
        assert fields == {}

    def test_parse_no_solution_section(self):
        """Test parsing file without solution section."""
        content = """
MeshVersionFormatted 2
Dimension 3
End
"""
        fields = parse_sol_file(content)
        assert fields == {}

    def test_parse_dimension_on_separate_line(self):
        """Test parsing when dimension value is on a separate line."""
        content = """MeshVersionFormatted 2
Dimension
3
SolAtVertices
2
1 1
0.5
0.3
End
"""
        fields = parse_sol_file(content)
        assert "solution@vertices" in fields
        np.testing.assert_array_almost_equal(
            fields["solution@vertices"]["data"],
            np.array([0.5, 0.3]),
        )

    def test_parse_with_empty_lines_in_data(self):
        """Test parsing with empty lines between data values."""
        content = """MeshVersionFormatted 2
Dimension 3
SolAtVertices
3
1 1
0.5

0.3

0.1
End
"""
        fields = parse_sol_file(content)
        assert "solution@vertices" in fields
        np.testing.assert_array_almost_equal(
            fields["solution@vertices"]["data"],
            np.array([0.5, 0.3, 0.1]),
        )

    def test_parse_truncated_after_solat(self):
        """Test parsing file truncated right after SolAt keyword."""
        content = """MeshVersionFormatted 2
Dimension 3
SolAtVertices
"""
        fields = parse_sol_file(content)
        assert fields == {}

    def test_parse_truncated_after_count(self):
        """Test parsing file truncated after entity count."""
        content = """MeshVersionFormatted 2
Dimension 3
SolAtVertices
3
"""
        fields = parse_sol_file(content)
        assert fields == {}

    def test_parse_tensor_field_3d(self):
        """Test parsing symmetric tensor (type 3) in 3D."""
        content = """MeshVersionFormatted 2
Dimension 3
SolAtVertices
2
1 3
1.0 2.0 3.0 4.0 5.0 6.0
7.0 8.0 9.0 10.0 11.0 12.0
End
"""
        fields = parse_sol_file(content)
        assert "tensor@vertices" in fields
        assert fields["tensor@vertices"]["location"] == "vertices"
        # 3D tensor has 6 components (symmetric 3x3)
        assert fields["tensor@vertices"]["data"].shape == (2, 6)

    def test_parse_tensor_field_2d(self):
        """Test parsing symmetric tensor (type 3) in 2D."""
        content = """MeshVersionFormatted 2
Dimension 2
SolAtVertices
2
1 3
1.0 2.0 3.0
4.0 5.0 6.0
End
"""
        fields = parse_sol_file(content)
        assert "tensor@vertices" in fields
        # 2D tensor has 3 components (symmetric 2x2)
        assert fields["tensor@vertices"]["data"].shape == (2, 3)

    def test_parse_data_ends_with_mesh_keyword(self):
        """Test parsing stops when encountering Mesh keyword."""
        content = """MeshVersionFormatted 2
Dimension 3
SolAtVertices
3
1 1
0.5
0.3
MeshVersionFormatted
"""
        fields = parse_sol_file(content)
        assert "solution@vertices" in fields
        # Should only have 2 values since it stops at MeshVersionFormatted
        assert len(fields["solution@vertices"]["data"]) == 2

    def test_parse_single_entity_scalar(self):
        """Test parsing when there's only one entity (data.ndim == 1)."""
        content = """MeshVersionFormatted 2
Dimension 3
SolAtVertices
1
1 1
0.5
End
"""
        fields = parse_sol_file(content)
        assert "solution@vertices" in fields
        # Single value should still work
        assert fields["solution@vertices"]["data"].shape == (1,)


class TestSafeFormulaEvaluator:
    """Tests for SafeFormulaEvaluator class."""

    @pytest.fixture
    def evaluator(self):
        """Create evaluator instance."""
        return SafeFormulaEvaluator()

    @pytest.fixture
    def coords(self):
        """Create sample coordinates."""
        x = np.array([0.0, 1.0, 2.0, 0.5])
        y = np.array([0.0, 0.0, 1.0, 0.5])
        z = np.array([0.0, 0.0, 0.0, 0.5])
        return x, y, z

    def test_simple_arithmetic(self, evaluator, coords):
        """Test simple arithmetic operations."""
        x, y, z = coords
        result = evaluator.evaluate("x + y + z", x, y, z)
        expected = x + y + z
        np.testing.assert_array_almost_equal(result, expected)

    def test_power_operation(self, evaluator, coords):
        """Test power operation."""
        x, y, z = coords
        result = evaluator.evaluate("x**2 + y**2 + z**2", x, y, z)
        expected = x**2 + y**2 + z**2
        np.testing.assert_array_almost_equal(result, expected)

    def test_sphere_formula(self, evaluator, coords):
        """Test sphere levelset formula."""
        x, y, z = coords
        result = evaluator.evaluate("x**2 + y**2 + z**2 - 0.25", x, y, z)
        expected = x**2 + y**2 + z**2 - 0.25
        np.testing.assert_array_almost_equal(result, expected)

    def test_numpy_functions(self, evaluator, coords):
        """Test numpy functions."""
        x, y, z = coords
        result = evaluator.evaluate("np.sin(x) + np.cos(y)", x, y, z)
        expected = np.sin(x) + np.cos(y)
        np.testing.assert_array_almost_equal(result, expected)

    def test_numpy_sqrt(self, evaluator, coords):
        """Test numpy sqrt."""
        x, y, z = coords
        result = evaluator.evaluate("np.sqrt(x**2 + y**2 + z**2)", x, y, z)
        expected = np.sqrt(x**2 + y**2 + z**2)
        np.testing.assert_array_almost_equal(result, expected)

    def test_numpy_constants(self, evaluator, coords):
        """Test numpy constants pi and e."""
        x, y, z = coords
        result = evaluator.evaluate("np.pi * x + np.e * y", x, y, z)
        expected = np.pi * x + np.e * y
        np.testing.assert_array_almost_equal(result, expected)

    def test_unary_minus(self, evaluator, coords):
        """Test unary minus."""
        x, y, z = coords
        result = evaluator.evaluate("-x + y", x, y, z)
        expected = -x + y
        np.testing.assert_array_almost_equal(result, expected)

    def test_comparison(self, evaluator, coords):
        """Test comparison operations."""
        x, y, z = coords
        result = evaluator.evaluate("x > 0.5", x, y, z)
        expected = x > 0.5
        np.testing.assert_array_equal(result, expected)

    def test_builtin_abs(self, evaluator, coords):
        """Test builtin abs function."""
        x, y, z = coords
        result = evaluator.evaluate("abs(x - 1)", x, y, z)
        expected = np.abs(x - 1)
        np.testing.assert_array_almost_equal(result, expected)

    def test_invalid_variable(self, evaluator, coords):
        """Test that unknown variables raise ValueError."""
        x, y, z = coords
        with pytest.raises(ValueError, match="Unknown variable"):
            evaluator.evaluate("w + x", x, y, z)

    def test_invalid_function(self, evaluator, coords):
        """Test that unsupported functions raise ValueError."""
        x, y, z = coords
        with pytest.raises(ValueError, match="Unsupported"):
            evaluator.evaluate("eval('x')", x, y, z)

    def test_invalid_numpy_function(self, evaluator, coords):
        """Test that unsupported numpy functions raise ValueError."""
        x, y, z = coords
        with pytest.raises(ValueError, match="Unsupported numpy function"):
            evaluator.evaluate("np.random()", x, y, z)

    def test_syntax_error(self, evaluator, coords):
        """Test that syntax errors raise ValueError."""
        x, y, z = coords
        with pytest.raises(ValueError, match="Invalid formula syntax"):
            evaluator.evaluate("x +", x, y, z)

    def test_unsupported_constant_type(self, evaluator, coords):
        """Test that string constants raise ValueError."""
        x, y, z = coords
        with pytest.raises(ValueError, match="Unsupported constant type"):
            evaluator.evaluate("'hello'", x, y, z)

    def test_unsupported_binary_operator(self, evaluator, coords):
        """Test that unsupported binary operators raise ValueError."""
        x, y, z = coords
        with pytest.raises(ValueError, match="Unsupported binary operator"):
            evaluator.evaluate("x @ y", x, y, z)  # Matrix multiplication

    def test_unsupported_unary_operator(self, evaluator, coords):
        """Test that unsupported unary operators raise ValueError."""
        x, y, z = coords
        with pytest.raises(ValueError, match="Unsupported unary operator"):
            evaluator.evaluate("~x", x, y, z)  # Bitwise not

    def test_complex_comparison(self, evaluator, coords):
        """Test that chained comparisons raise ValueError."""
        x, y, z = coords
        with pytest.raises(ValueError, match="Only simple comparisons"):
            evaluator.evaluate("0 < x < 1", x, y, z)

    def test_unsupported_comparison_operator(self, evaluator, coords):
        """Test that unsupported comparison operators raise ValueError."""
        x, y, z = coords
        with pytest.raises(ValueError, match="Unsupported comparison operator"):
            evaluator.evaluate("x is y", x, y, z)

    def test_ternary_expression(self, evaluator, coords):
        """Test ternary (if-else) expressions work."""
        x, y, z = coords
        result = evaluator.evaluate("1.0 if x > 0.5 else 0.0", x, y, z)
        expected = np.where(x > 0.5, 1.0, 0.0)
        np.testing.assert_array_almost_equal(result, expected)

    def test_unsupported_expression_type(self, evaluator, coords):
        """Test that unsupported expression types raise ValueError."""
        x, y, z = coords
        with pytest.raises(ValueError, match="Unsupported expression type"):
            evaluator.evaluate("[x, y]", x, y, z)  # List expression

    def test_non_np_attribute_call(self, evaluator, coords):
        """Test that non-np attribute calls raise ValueError."""
        x, y, z = coords
        with pytest.raises(ValueError, match=r"Only np\.function"):
            evaluator.evaluate("x.sum()", x, y, z)

    def test_direct_numpy_function_call(self, evaluator, coords):
        """Test direct numpy function call (sin instead of np.sin)."""
        x, y, z = coords
        result = evaluator.evaluate("sin(x)", x, y, z)
        expected = np.sin(x)
        np.testing.assert_array_almost_equal(result, expected)

    def test_invalid_function_call(self, evaluator, coords):
        """Test that lambda or other callable raises ValueError."""
        x, y, z = coords
        with pytest.raises(ValueError, match="Invalid function call"):
            evaluator.evaluate("(lambda a: a)(x)", x, y, z)

    def test_unsupported_numpy_attribute(self, evaluator, coords):
        """Test that unsupported numpy attributes raise ValueError."""
        x, y, z = coords
        with pytest.raises(ValueError, match="Unsupported numpy attribute"):
            evaluator.evaluate("np.inf + x", x, y, z)

    def test_non_np_attribute_access(self, evaluator, coords):
        """Test that non-np attribute access raises ValueError."""
        x, y, z = coords
        with pytest.raises(ValueError, match=r"Only np\.pi and np\.e"):
            evaluator.evaluate("x.shape", x, y, z)


class TestEvaluateLevelsetFormula:
    """Tests for evaluate_levelset_formula convenience function."""

    def test_returns_correct_shape(self):
        """Test that result has shape (-1, 1)."""
        x = np.array([0.0, 1.0, 2.0])
        y = np.array([0.0, 0.0, 0.0])
        z = np.array([0.0, 0.0, 0.0])

        result = evaluate_levelset_formula("x**2 - 0.5", x, y, z)

        assert result.shape == (3, 1)

    def test_correct_values(self):
        """Test correct computation."""
        x = np.array([0.0, 1.0])
        y = np.array([0.0, 0.0])
        z = np.array([0.0, 0.0])

        result = evaluate_levelset_formula("x**2 + y**2 + z**2 - 0.25", x, y, z)

        expected = np.array([[-0.25], [0.75]])
        np.testing.assert_array_almost_equal(result, expected)


class TestRoundToSignificant:
    """Tests for round_to_significant function."""

    def test_positive_small(self):
        """Test rounding small positive numbers."""
        assert round_to_significant(0.0123456, 2) == 0.012
        assert round_to_significant(0.0123456, 3) == 0.0123

    def test_positive_large(self):
        """Test rounding large positive numbers."""
        assert round_to_significant(1234.5678, 2) == 1200.0
        assert round_to_significant(1234.5678, 3) == 1230.0

    def test_zero(self):
        """Test that zero returns zero."""
        assert round_to_significant(0.0, 2) == 0.0
        assert round_to_significant(0, 3) == 0.0

    def test_one_sig_fig(self):
        """Test single significant figure."""
        assert round_to_significant(0.567, 1) == 0.6
        assert round_to_significant(567, 1) == 600.0


class TestToFloat:
    """Tests for to_float function."""

    def test_float_input(self):
        """Test float input."""
        assert to_float(3.14) == 3.14

    def test_int_input(self):
        """Test int input."""
        assert to_float(42) == 42.0

    def test_string_input(self):
        """Test string input."""
        assert to_float("2.5") == 2.5
        assert to_float("42") == 42.0

    def test_none_input(self):
        """Test None input."""
        assert to_float(None) is None

    def test_empty_string(self):
        """Test empty string input."""
        assert to_float("") is None

    def test_invalid_string(self):
        """Test invalid string input."""
        assert to_float("abc") is None

    def test_list_input(self):
        """Test list input returns None."""
        assert to_float([1, 2]) is None


class TestGetMeshDiagonal:
    """Tests for get_mesh_diagonal function."""

    def test_none_mesh(self):
        """Test with None mesh."""
        assert get_mesh_diagonal(None) == 1.0

    def test_with_real_mesh(self):
        """Test with a real mesh returns correct diagonal."""
        import pyvista as pv

        from mmgpy import Mesh

        # Create a unit cube mesh
        pv_mesh = pv.Cube().triangulate()
        mesh = Mesh(pv_mesh)

        diagonal = get_mesh_diagonal(mesh)

        # Unit cube from -0.5 to 0.5, so diagonal is sqrt(3)
        expected = np.sqrt(3)
        assert abs(diagonal - expected) < 0.01


class TestComputePresetValues:
    """Tests for compute_preset_values function."""

    def test_medium_preset(self):
        """Test medium preset values."""
        values = compute_preset_values("medium", 10.0)

        assert "hmax" in values
        assert "hausd" in values
        assert "hgrad" in values
        assert values["hgrad"] == 1.3
        # hmax should be ~diagonal/25 = 0.4
        assert 0.3 < values["hmax"] < 0.5

    def test_fine_preset(self):
        """Test fine preset values."""
        values = compute_preset_values("fine", 10.0)

        assert values["hgrad"] == 1.2
        # hmax should be ~diagonal/50 = 0.2
        assert 0.15 < values["hmax"] < 0.25

    def test_coarse_preset(self):
        """Test coarse preset values."""
        values = compute_preset_values("coarse", 10.0)

        assert values["hgrad"] == 1.5
        # hmax should be ~diagonal/10 = 1.0
        assert 0.8 < values["hmax"] < 1.2

    def test_optimize_preset(self):
        """Test optimize preset values."""
        values = compute_preset_values("optimize", 10.0)

        assert values.get("optim") is True
        assert values.get("noinsert") is True

    def test_default_preset(self):
        """Test default preset clears all size parameters."""
        values = compute_preset_values("default", 10.0)

        # Default preset should clear all size parameters to None
        assert values.get("hsiz") is None
        assert values.get("hmin") is None
        assert values.get("hmax") is None
        assert values.get("hausd") is None
        assert values.get("hgrad") is None
        assert values.get("ar") is None

    def test_unknown_preset(self):
        """Test unknown preset returns empty dict."""
        values = compute_preset_values("unknown", 10.0)
        assert values == {}


class TestResetSolutionState:
    """Tests for reset_solution_state function."""

    def test_returns_dict(self):
        """Test that function returns a dict."""
        result = reset_solution_state()
        assert isinstance(result, dict)

    def test_contains_expected_keys(self):
        """Test that result contains expected keys."""
        result = reset_solution_state()

        expected_keys = {
            "sol_filename",
            "solution_fields",
            "use_solution_as_metric",
            "use_solution_as_levelset",
            "solution_type",
        }
        assert set(result.keys()) == expected_keys

    def test_default_values(self):
        """Test default values."""
        result = reset_solution_state()

        assert result["sol_filename"] == ""
        assert result["solution_fields"] == {}
        assert result["use_solution_as_metric"] is False
        assert result["use_solution_as_levelset"] is False
        assert result["solution_type"] == ""


class TestSampleMeshes:
    """Tests for sample mesh generation functions."""

    def test_create_tetra_cube(self):
        """Test tetrahedral cube creation."""
        mesh = create_tetra_cube()

        assert mesh is not None
        assert mesh.n_cells > 0
        assert mesh.n_points > 0
        # Check it's a 3D mesh with tetrahedra (cell type 10)
        assert 10 in mesh.celltypes

    def test_create_tetra_sphere(self):
        """Test tetrahedral sphere creation."""
        mesh = create_tetra_sphere()

        assert mesh is not None
        assert mesh.n_cells > 0
        assert mesh.n_points > 0
        assert 10 in mesh.celltypes

    def test_create_2d_disc(self):
        """Test 2D disc creation."""
        mesh = create_2d_disc()

        assert mesh is not None
        assert mesh.n_cells > 0
        assert mesh.n_points > 0

    def test_create_2d_rectangle(self):
        """Test 2D rectangle creation."""
        mesh = create_2d_rectangle()

        assert mesh is not None
        assert mesh.n_cells > 0
        assert mesh.n_points > 0

    def test_get_sample_mesh_sphere(self):
        """Test getting sphere sample mesh."""
        mesh = get_sample_mesh("sphere")

        assert mesh is not None
        assert mesh.n_cells > 0

    def test_get_sample_mesh_tetra_cube(self):
        """Test getting tetra_cube sample mesh."""
        mesh = get_sample_mesh("tetra_cube")

        assert mesh is not None
        assert 10 in mesh.celltypes

    def test_get_sample_mesh_unknown(self):
        """Test getting unknown sample mesh returns None."""
        mesh = get_sample_mesh("unknown_mesh_name")
        assert mesh is None

    def test_list_samples_by_category(self):
        """Test listing samples by category."""
        categories = list_samples_by_category()

        assert "surface" in categories
        assert "tetrahedral" in categories
        assert "2d" in categories

        assert "sphere" in categories["surface"]
        assert "tetra_cube" in categories["tetrahedral"]
        assert "disc_2d" in categories["2d"]


class TestDefaultScalarFieldOptions:
    """Tests for DEFAULT_SCALAR_FIELD_OPTIONS."""

    def test_contains_face_orientation(self):
        """Test that face orientation option is available."""
        from mmgpy.ui.utils import DEFAULT_SCALAR_FIELD_OPTIONS

        values = [
            opt.get("value") for opt in DEFAULT_SCALAR_FIELD_OPTIONS if "value" in opt
        ]
        assert "face_sides" in values

    def test_contains_quality_options(self):
        """Test that quality options are available."""
        from mmgpy.ui.utils import DEFAULT_SCALAR_FIELD_OPTIONS

        values = [
            opt.get("value") for opt in DEFAULT_SCALAR_FIELD_OPTIONS if "value" in opt
        ]
        assert "quality" in values
        assert "pv_quality" in values

    def test_contains_edge_length_option(self):
        """Test that edge length option is available for sizing visualization."""
        from mmgpy.ui.utils import DEFAULT_SCALAR_FIELD_OPTIONS

        values = [
            opt.get("value") for opt in DEFAULT_SCALAR_FIELD_OPTIONS if "value" in opt
        ]
        assert "edge_length" in values

    def test_has_section_headers(self):
        """Test that section headers exist."""
        from mmgpy.ui.utils import DEFAULT_SCALAR_FIELD_OPTIONS

        headers = [
            opt.get("title")
            for opt in DEFAULT_SCALAR_FIELD_OPTIONS
            if opt.get("type") == "subheader"
        ]
        assert any("Quality" in h for h in headers)
        assert any("Sizing" in h for h in headers)
        assert any("Orientation" in h for h in headers)

    def test_contains_refs_option(self):
        """Test that refs option is available."""
        from mmgpy.ui.utils import DEFAULT_SCALAR_FIELD_OPTIONS

        values = [
            opt.get("value") for opt in DEFAULT_SCALAR_FIELD_OPTIONS if "value" in opt
        ]
        assert "refs" in values


class TestDefaultState:
    """Tests for DEFAULT_STATE configuration."""

    def test_contains_viewer_settings(self):
        """Test that viewer settings are present."""
        from mmgpy.ui.utils import DEFAULT_STATE

        assert "show_edges" in DEFAULT_STATE
        assert "show_scalar" in DEFAULT_STATE
        assert "opacity" in DEFAULT_STATE
        assert "smooth_shading" in DEFAULT_STATE

    def test_contains_original_mesh_settings(self):
        """Test that original mesh toggle settings are present."""
        from mmgpy.ui.utils import DEFAULT_STATE

        assert "show_original_mesh" in DEFAULT_STATE
        assert DEFAULT_STATE["show_original_mesh"] is False
        assert "has_original_mesh" in DEFAULT_STATE
        assert DEFAULT_STATE["has_original_mesh"] is False

    def test_contains_slice_settings(self):
        """Test that slice view settings are present."""
        from mmgpy.ui.utils import DEFAULT_STATE

        assert "slice_enabled" in DEFAULT_STATE
        assert "slice_axis" in DEFAULT_STATE
        assert "slice_threshold" in DEFAULT_STATE

    def test_contains_theme_setting(self):
        """Test that theme setting is present."""
        from mmgpy.ui.utils import DEFAULT_STATE

        assert "theme_name" in DEFAULT_STATE
        assert DEFAULT_STATE["theme_name"] in ("light", "dark")
