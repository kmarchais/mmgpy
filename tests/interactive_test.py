"""Tests for interactive sizing editor."""

import numpy as np
import pytest

from mmgpy import Mesh
from mmgpy.interactive import SizingEditor
from mmgpy.interactive.sizing_editor import ConstraintMode
from mmgpy.sizing import BoxSize, CylinderSize, PointSize, SphereSize


def create_simple_3d_mesh() -> Mesh:
    """Create a simple 3D mesh (unit cube with one tetrahedron)."""
    vertices = np.array(
        [
            [0.0, 0.0, 0.0],
            [1.0, 0.0, 0.0],
            [0.0, 1.0, 0.0],
            [0.0, 0.0, 1.0],
        ],
        dtype=np.float64,
    )
    elements = np.array([[0, 1, 2, 3]], dtype=np.int32)
    return Mesh(vertices, elements)


def create_simple_2d_mesh() -> Mesh:
    """Create a simple 2D mesh (unit square with two triangles)."""
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


def create_simple_surface_mesh() -> Mesh:
    """Create a simple surface mesh (single triangle)."""
    vertices = np.array(
        [
            [0.0, 0.0, 0.0],
            [1.0, 0.0, 0.0],
            [0.5, 1.0, 0.5],
        ],
        dtype=np.float64,
    )
    triangles = np.array([[0, 1, 2]], dtype=np.int32)
    return Mesh(vertices, triangles)


class TestSizingEditorInit:
    """Tests for SizingEditor initialization."""

    def test_init_with_3d_mesh(self) -> None:
        """Test initialization with 3D mesh."""
        mesh = create_simple_3d_mesh()
        editor = SizingEditor(mesh)
        assert editor._is_3d is True
        assert len(editor.get_constraints()) == 0

    def test_init_with_2d_mesh(self) -> None:
        """Test initialization with 2D mesh."""
        mesh = create_simple_2d_mesh()
        editor = SizingEditor(mesh)
        assert editor._is_3d is False
        assert len(editor.get_constraints()) == 0

    def test_init_with_surface_mesh(self) -> None:
        """Test initialization with surface mesh."""
        mesh = create_simple_surface_mesh()
        editor = SizingEditor(mesh)
        assert editor._is_3d is True
        assert len(editor.get_constraints()) == 0

    def test_init_with_unified_mesh(self) -> None:
        """Test initialization with unified Mesh class."""
        vertices = np.array(
            [
                [0.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [0.0, 1.0, 0.0],
                [0.0, 0.0, 1.0],
            ],
            dtype=np.float64,
        )
        elements = np.array([[0, 1, 2, 3]], dtype=np.int32)
        mesh = Mesh(vertices, elements)
        editor = SizingEditor(mesh)
        assert editor._is_3d is True


class TestToolModes:
    """Tests for tool mode selection."""

    def test_add_sphere_tool(self) -> None:
        """Test sphere tool activation."""
        mesh = create_simple_3d_mesh()
        editor = SizingEditor(mesh)
        result = editor.add_sphere_tool()

        assert editor._state.mode == ConstraintMode.SPHERE
        assert result is editor

    def test_add_box_tool(self) -> None:
        """Test box tool activation."""
        mesh = create_simple_3d_mesh()
        editor = SizingEditor(mesh)
        result = editor.add_box_tool()

        assert editor._state.mode == ConstraintMode.BOX
        assert result is editor

    def test_add_cylinder_tool_3d(self) -> None:
        """Test cylinder tool activation on 3D mesh."""
        mesh = create_simple_3d_mesh()
        editor = SizingEditor(mesh)
        result = editor.add_cylinder_tool()

        assert editor._state.mode == ConstraintMode.CYLINDER
        assert result is editor

    def test_add_cylinder_tool_2d_raises(self) -> None:
        """Test cylinder tool raises on 2D mesh."""
        mesh = create_simple_2d_mesh()
        editor = SizingEditor(mesh)

        with pytest.raises(TypeError, match="not available for 2D"):
            editor.add_cylinder_tool()

    def test_add_point_tool(self) -> None:
        """Test point tool activation."""
        mesh = create_simple_3d_mesh()
        editor = SizingEditor(mesh)
        result = editor.add_point_tool()

        assert editor._state.mode == ConstraintMode.POINT
        assert result is editor

    def test_method_chaining(self) -> None:
        """Test that tool methods support chaining."""
        mesh = create_simple_3d_mesh()
        editor = SizingEditor(mesh)

        result = editor.add_sphere_tool()
        assert result is editor

        result = editor.add_box_tool()
        assert result is editor


class TestConstraintCreation:
    """Tests for constraint creation without GUI."""

    def test_add_sphere_constraint(self) -> None:
        """Test adding sphere constraint programmatically."""
        mesh = create_simple_3d_mesh()
        editor = SizingEditor(mesh)
        editor._current_size = 0.05
        editor._current_radius = 0.2

        editor._add_sphere_constraint(np.array([0.5, 0.5, 0.5]))

        constraints = editor.get_constraints()
        assert len(constraints) == 1
        assert isinstance(constraints[0], SphereSize)
        assert constraints[0].size == pytest.approx(0.05)
        assert constraints[0].radius == pytest.approx(0.2)
        assert np.allclose(constraints[0].center, [0.5, 0.5, 0.5])

    def test_add_box_constraint(self) -> None:
        """Test adding box constraint programmatically."""
        mesh = create_simple_3d_mesh()
        editor = SizingEditor(mesh)
        editor._current_size = 0.02

        point1 = np.array([0.1, 0.1, 0.1])
        point2 = np.array([0.4, 0.4, 0.4])
        editor._add_box_constraint(point1, point2)

        constraints = editor.get_constraints()
        assert len(constraints) == 1
        assert isinstance(constraints[0], BoxSize)
        assert constraints[0].size == pytest.approx(0.02)
        assert np.allclose(constraints[0].bounds[0], [0.1, 0.1, 0.1])
        assert np.allclose(constraints[0].bounds[1], [0.4, 0.4, 0.4])

    def test_add_box_constraint_2d(self) -> None:
        """Test adding box constraint on 2D mesh."""
        mesh = create_simple_2d_mesh()
        editor = SizingEditor(mesh)
        editor._current_size = 0.02

        point1 = np.array([0.1, 0.1, 0.0])
        point2 = np.array([0.4, 0.4, 0.0])
        editor._add_box_constraint(point1, point2)

        constraints = editor.get_constraints()
        assert len(constraints) == 1
        assert isinstance(constraints[0], BoxSize)
        assert constraints[0].bounds.shape == (2, 2)

    def test_add_cylinder_constraint(self) -> None:
        """Test adding cylinder constraint programmatically."""
        mesh = create_simple_3d_mesh()
        editor = SizingEditor(mesh)
        editor._current_size = 0.03
        editor._current_radius = 0.15

        point1 = np.array([0.0, 0.0, 0.0])
        point2 = np.array([0.0, 0.0, 1.0])
        editor._add_cylinder_constraint(point1, point2)

        constraints = editor.get_constraints()
        assert len(constraints) == 1
        assert isinstance(constraints[0], CylinderSize)
        assert constraints[0].size == pytest.approx(0.03)
        assert constraints[0].radius == pytest.approx(0.15)

    def test_add_point_constraint(self) -> None:
        """Test adding point constraint programmatically."""
        mesh = create_simple_3d_mesh()
        editor = SizingEditor(mesh)
        editor._current_near_size = 0.01
        editor._current_far_size = 0.1
        editor._current_influence_radius = 0.5

        editor._add_point_constraint(np.array([0.25, 0.25, 0.25]))

        constraints = editor.get_constraints()
        assert len(constraints) == 1
        assert isinstance(constraints[0], PointSize)
        assert constraints[0].near_size == pytest.approx(0.01)
        assert constraints[0].far_size == pytest.approx(0.1)
        assert constraints[0].influence_radius == pytest.approx(0.5)

    def test_add_point_constraint_2d(self) -> None:
        """Test adding point constraint on 2D mesh."""
        mesh = create_simple_2d_mesh()
        editor = SizingEditor(mesh)

        editor._add_point_constraint(np.array([0.5, 0.5, 0.0]))

        constraints = editor.get_constraints()
        assert len(constraints) == 1
        assert isinstance(constraints[0], PointSize)
        assert len(constraints[0].point) == 2


class TestConstraintManagement:
    """Tests for constraint list management."""

    def test_get_constraints_returns_copy(self) -> None:
        """Test that get_constraints returns a copy."""
        mesh = create_simple_3d_mesh()
        editor = SizingEditor(mesh)

        editor._add_sphere_constraint(np.array([0.5, 0.5, 0.5]))

        constraints1 = editor.get_constraints()
        constraints2 = editor.get_constraints()

        assert constraints1 is not constraints2
        assert constraints1[0] is constraints2[0]

    def test_clear_constraints(self) -> None:
        """Test clearing all constraints."""
        mesh = create_simple_3d_mesh()
        editor = SizingEditor(mesh)

        editor._add_sphere_constraint(np.array([0.5, 0.5, 0.5]))
        editor._add_sphere_constraint(np.array([0.2, 0.2, 0.2]))

        assert len(editor.get_constraints()) == 2

        editor.clear_constraints()

        assert len(editor.get_constraints()) == 0

    def test_remove_constraint_by_index(self) -> None:
        """Test removing constraint by index."""
        mesh = create_simple_3d_mesh()
        editor = SizingEditor(mesh)

        editor._add_sphere_constraint(np.array([0.1, 0.1, 0.1]))
        editor._add_sphere_constraint(np.array([0.5, 0.5, 0.5]))
        editor._add_sphere_constraint(np.array([0.9, 0.9, 0.9]))

        editor.remove_constraint(1)

        constraints = editor.get_constraints()
        assert len(constraints) == 2
        assert np.allclose(constraints[0].center, [0.1, 0.1, 0.1])
        assert np.allclose(constraints[1].center, [0.9, 0.9, 0.9])

    def test_remove_constraint_invalid_index(self) -> None:
        """Test removing constraint with invalid index."""
        mesh = create_simple_3d_mesh()
        editor = SizingEditor(mesh)

        editor._add_sphere_constraint(np.array([0.5, 0.5, 0.5]))

        with pytest.raises(IndexError, match="out of range"):
            editor.remove_constraint(5)

        with pytest.raises(IndexError, match="out of range"):
            editor.remove_constraint(-1)


class TestApplyToMesh:
    """Tests for applying constraints to mesh."""

    def test_apply_sphere_to_mesh(self) -> None:
        """Test applying sphere constraint to mesh."""
        mesh = create_simple_3d_mesh()
        editor = SizingEditor(mesh)

        editor._add_sphere_constraint(np.array([0.25, 0.25, 0.25]))
        editor.apply_to_mesh()

        assert mesh.get_local_sizing_count() == 1

    def test_apply_box_to_mesh(self) -> None:
        """Test applying box constraint to mesh."""
        mesh = create_simple_3d_mesh()
        editor = SizingEditor(mesh)

        editor._add_box_constraint(
            np.array([0.0, 0.0, 0.0]),
            np.array([0.5, 0.5, 0.5]),
        )
        editor.apply_to_mesh()

        assert mesh.get_local_sizing_count() == 1

    def test_apply_cylinder_to_mesh(self) -> None:
        """Test applying cylinder constraint to mesh."""
        mesh = create_simple_3d_mesh()
        editor = SizingEditor(mesh)

        editor._add_cylinder_constraint(
            np.array([0.0, 0.0, 0.0]),
            np.array([1.0, 0.0, 0.0]),
        )
        editor.apply_to_mesh()

        assert mesh.get_local_sizing_count() == 1

    def test_apply_point_to_mesh(self) -> None:
        """Test applying point constraint to mesh."""
        mesh = create_simple_3d_mesh()
        editor = SizingEditor(mesh)

        editor._add_point_constraint(np.array([0.5, 0.5, 0.5]))
        editor.apply_to_mesh()

        assert mesh.get_local_sizing_count() == 1

    def test_apply_multiple_constraints(self) -> None:
        """Test applying multiple constraints to mesh."""
        mesh = create_simple_3d_mesh()
        editor = SizingEditor(mesh)

        editor._add_sphere_constraint(np.array([0.1, 0.1, 0.1]))
        editor._add_box_constraint(
            np.array([0.5, 0.5, 0.5]),
            np.array([0.8, 0.8, 0.8]),
        )
        editor._add_point_constraint(np.array([0.3, 0.3, 0.3]))

        editor.apply_to_mesh()

        assert mesh.get_local_sizing_count() == 3


class TestMultiClickInteraction:
    """Tests for multi-click interaction modes."""

    def test_box_first_click_stores_point(self) -> None:
        """Test that first click in box mode stores the point."""
        mesh = create_simple_3d_mesh()
        editor = SizingEditor(mesh)
        editor.add_box_tool()

        editor._handle_box_click(np.array([0.1, 0.1, 0.1]))

        assert editor._state.first_point is not None
        assert np.allclose(editor._state.first_point, [0.1, 0.1, 0.1])
        assert len(editor.get_constraints()) == 0

    def test_box_second_click_creates_constraint(self) -> None:
        """Test that second click in box mode creates constraint."""
        mesh = create_simple_3d_mesh()
        editor = SizingEditor(mesh)
        editor.add_box_tool()

        editor._handle_box_click(np.array([0.1, 0.1, 0.1]))
        editor._handle_box_click(np.array([0.5, 0.5, 0.5]))

        assert editor._state.first_point is None
        assert len(editor.get_constraints()) == 1

    def test_cylinder_first_click_stores_point(self) -> None:
        """Test that first click in cylinder mode stores the point."""
        mesh = create_simple_3d_mesh()
        editor = SizingEditor(mesh)
        editor.add_cylinder_tool()

        editor._handle_cylinder_click(np.array([0.0, 0.0, 0.0]))

        assert editor._state.first_point is not None
        assert len(editor.get_constraints()) == 0

    def test_cylinder_second_click_creates_constraint(self) -> None:
        """Test that second click in cylinder mode creates constraint."""
        mesh = create_simple_3d_mesh()
        editor = SizingEditor(mesh)
        editor.add_cylinder_tool()

        editor._handle_cylinder_click(np.array([0.0, 0.0, 0.0]))
        editor._handle_cylinder_click(np.array([0.0, 0.0, 1.0]))

        assert editor._state.first_point is None
        assert len(editor.get_constraints()) == 1


class TestSliderCallbacks:
    """Tests for slider callback functions."""

    def test_on_size_changed(self) -> None:
        """Test size slider callback."""
        mesh = create_simple_3d_mesh()
        editor = SizingEditor(mesh)

        editor._on_size_changed(0.05)

        assert editor._current_size == pytest.approx(0.05)
        assert editor._current_near_size == pytest.approx(0.05)
        assert editor._current_far_size == pytest.approx(0.5)

    def test_on_radius_changed(self) -> None:
        """Test radius slider callback."""
        mesh = create_simple_3d_mesh()
        editor = SizingEditor(mesh)

        editor._on_radius_changed(0.25)

        assert editor._current_radius == pytest.approx(0.25)

    def test_on_influence_changed(self) -> None:
        """Test influence radius slider callback."""
        mesh = create_simple_3d_mesh()
        editor = SizingEditor(mesh)

        editor._on_influence_changed(0.75)

        assert editor._current_influence_radius == pytest.approx(0.75)


class TestPyVistaMesh:
    """Tests for PyVista mesh conversion."""

    def test_get_pyvista_mesh_3d(self) -> None:
        """Test getting PyVista mesh from 3D mesh."""
        mesh = create_simple_3d_mesh()
        editor = SizingEditor(mesh)

        pv_mesh = editor._get_pyvista_mesh()

        assert pv_mesh is not None
        assert pv_mesh.n_points > 0

    def test_get_pyvista_mesh_2d(self) -> None:
        """Test getting PyVista mesh from 2D mesh."""
        mesh = create_simple_2d_mesh()
        editor = SizingEditor(mesh)

        pv_mesh = editor._get_pyvista_mesh()

        assert pv_mesh is not None
        assert pv_mesh.n_points > 0

    def test_get_pyvista_mesh_caches_result(self) -> None:
        """Test that PyVista mesh is cached."""
        mesh = create_simple_3d_mesh()
        editor = SizingEditor(mesh)

        pv_mesh1 = editor._get_pyvista_mesh()
        pv_mesh2 = editor._get_pyvista_mesh()

        assert pv_mesh1 is pv_mesh2
