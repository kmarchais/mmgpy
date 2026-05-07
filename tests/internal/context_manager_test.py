"""Tests for context manager support in Mesh class."""

import numpy as np
import numpy.testing as npt
import pytest

from mmgpy import MeshKind
from mmgpy._mesh import Mesh


def create_3d_mesh() -> Mesh:
    """Create a simple 3D tetrahedral mesh for testing."""
    vertices = np.array(
        [
            [0.0, 0.0, 0.0],
            [1.0, 0.0, 0.0],
            [1.0, 1.0, 0.0],
            [0.0, 1.0, 0.0],
            [0.0, 0.0, 1.0],
            [1.0, 0.0, 1.0],
            [1.0, 1.0, 1.0],
            [0.0, 1.0, 1.0],
        ],
        dtype=np.float64,
    )

    cells = np.array(
        [
            [0, 1, 3, 4],
            [1, 2, 3, 6],
            [1, 4, 5, 6],
            [3, 4, 6, 7],
            [1, 3, 4, 6],
        ],
        dtype=np.int32,
    )

    return Mesh(vertices, cells)


def create_2d_mesh() -> Mesh:
    """Create a simple 2D triangular mesh for testing."""
    vertices = np.array(
        [
            [0.0, 0.0, 0.0],
            [1.0, 0.0, 0.0],
            [1.0, 1.0, 0.0],
            [0.0, 1.0, 0.0],
        ],
        dtype=np.float64,
    )

    cells = np.array(
        [
            [0, 1, 2],
            [0, 2, 3],
        ],
        dtype=np.int32,
    )

    return Mesh(vertices, cells)


def create_surface_mesh() -> Mesh:
    """Create a simple surface mesh (tetrahedron surface) for testing."""
    vertices = np.array(
        [
            [0.0, 0.0, 0.0],
            [1.0, 0.0, 0.0],
            [0.5, 1.0, 0.0],
            [0.5, 0.5, 1.0],
        ],
        dtype=np.float64,
    )

    cells = np.array(
        [
            [0, 1, 2],
            [0, 1, 3],
            [1, 2, 3],
            [0, 2, 3],
        ],
        dtype=np.int32,
    )

    return Mesh(vertices, cells)


class TestBasicContextManager:
    """Tests for basic context manager protocol (__enter__/__exit__)."""

    def test_with_statement_returns_mesh(self) -> None:
        """Test that 'with' statement returns the mesh instance."""
        original = create_3d_mesh()
        with original as mesh:
            assert mesh is original
            assert isinstance(mesh, Mesh)

    def test_with_statement_no_exception(self) -> None:
        """Test that 'with' statement completes without exception."""
        with create_3d_mesh() as mesh:
            mesh.remesh(hsiz=0.5, verbose=-1)

    def test_with_statement_propagates_exception(self) -> None:
        """Test that exceptions are not suppressed by the context manager."""

        def failing_operation(mesh: Mesh) -> None:
            mesh.remesh(hsiz=0.5, verbose=-1)
            msg = "test exception"
            raise ValueError(msg)

        with (
            pytest.raises(ValueError, match="test exception"),
            create_3d_mesh() as mesh,
        ):
            failing_operation(mesh)

    def test_context_manager_2d_mesh(self) -> None:
        """Test context manager works with 2D meshes."""
        with create_2d_mesh() as mesh:
            assert mesh.kind == MeshKind.TRIANGULAR_2D
            mesh.remesh(hsiz=0.3, verbose=-1)

    def test_context_manager_surface_mesh(self) -> None:
        """Test context manager works with surface meshes."""
        with create_surface_mesh() as mesh:
            assert mesh.kind == MeshKind.TRIANGULAR_SURFACE
            mesh.remesh(hsiz=0.3, verbose=-1)


class TestCopyContextManager:
    """Tests for the copy() context manager."""

    def test_copy_creates_independent_mesh(self) -> None:
        """Test that copy creates an independent mesh."""
        original = create_3d_mesh()
        original_verts = original.get_vertices().copy()

        with original.copy() as working:
            working.remesh(hsiz=0.3, verbose=-1)
            assert len(working.get_vertices()) != len(original_verts)

        # Original should be unchanged
        npt.assert_array_equal(original.get_vertices(), original_verts)

    def test_copy_2d_mesh(self) -> None:
        """Test copy works for 2D meshes."""
        original = create_2d_mesh()
        original_verts = original.get_vertices().copy()

        with original.copy() as working:
            working.remesh(hsiz=0.3, verbose=-1)

        npt.assert_array_equal(original.get_vertices(), original_verts)

    def test_copy_surface_mesh(self) -> None:
        """Test copy works for surface meshes."""
        original = create_surface_mesh()
        original_verts = original.get_vertices().copy()

        with original.copy() as working:
            working.remesh(hsiz=0.3, verbose=-1)

        npt.assert_array_equal(original.get_vertices(), original_verts)


class TestUpdateFrom:
    """Tests for the update_from() method."""

    def test_update_from_copies_state(self) -> None:
        """Test that update_from copies all state from another mesh."""
        original = create_3d_mesh()
        original_vertex_count = len(original.get_vertices())

        with original.copy() as working:
            working.remesh(hsiz=0.3, verbose=-1)
            new_vertex_count = len(working.get_vertices())

            if new_vertex_count > original_vertex_count:
                # Working has more vertices, apply to original
                original.update_from(working)

        # Original should now have the same vertex count as working
        assert len(original.get_vertices()) == new_vertex_count

    def test_update_from_wrong_kind_raises(self) -> None:
        """Test that update_from raises when mesh kinds differ."""
        mesh_3d = create_3d_mesh()
        mesh_2d = create_2d_mesh()

        with pytest.raises(TypeError, match="Cannot update"):
            mesh_3d.update_from(mesh_2d)

    def test_update_from_2d(self) -> None:
        """Test update_from works for 2D meshes."""
        original = create_2d_mesh()

        with original.copy() as working:
            working.remesh(hsiz=0.3, verbose=-1)
            new_vertex_count = len(working.get_vertices())
            original.update_from(working)

        assert len(original.get_vertices()) == new_vertex_count
