"""Tests for context manager support in Mesh class."""

import numpy as np
import numpy.testing as npt
import pytest

from mmgpy import Mesh, MeshKind


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


class TestCheckpointCommit:
    """Tests for checkpoint with commit (changes are kept)."""

    def test_checkpoint_commit_keeps_changes(self) -> None:
        """Test that committed changes are kept."""
        mesh = create_3d_mesh()
        original_vertex_count = len(mesh.get_vertices())

        with mesh.checkpoint() as snap:
            mesh.remesh(hsiz=0.3, verbose=-1)
            snap.commit()

        # Changes should be kept
        assert len(mesh.get_vertices()) != original_vertex_count

    def test_checkpoint_commit_2d(self) -> None:
        """Test checkpoint commit works for 2D meshes."""
        mesh = create_2d_mesh()
        original_vertex_count = len(mesh.get_vertices())

        with mesh.checkpoint() as snap:
            mesh.remesh(hsiz=0.3, verbose=-1)
            snap.commit()

        assert len(mesh.get_vertices()) != original_vertex_count

    def test_checkpoint_commit_surface(self) -> None:
        """Test checkpoint commit works for surface meshes."""
        mesh = create_surface_mesh()
        original_vertex_count = len(mesh.get_vertices())

        with mesh.checkpoint() as snap:
            mesh.remesh(hsiz=0.3, verbose=-1)
            snap.commit()

        assert len(mesh.get_vertices()) != original_vertex_count


class TestCheckpointRollback:
    """Tests for checkpoint with rollback (changes are reverted)."""

    def test_checkpoint_auto_rollback_without_commit(self) -> None:
        """Test that changes are rolled back when commit() is not called."""
        mesh = create_3d_mesh()
        original_verts = mesh.get_vertices().copy()
        original_tets = mesh.get_tetrahedra().copy()

        with mesh.checkpoint():
            mesh.remesh(hsiz=0.3, verbose=-1)
            # No commit() - should rollback

        npt.assert_array_equal(mesh.get_vertices(), original_verts)
        npt.assert_array_equal(mesh.get_tetrahedra(), original_tets)

    def test_checkpoint_explicit_rollback(self) -> None:
        """Test explicit rollback() restores original state."""
        mesh = create_3d_mesh()
        original_verts = mesh.get_vertices().copy()

        with mesh.checkpoint() as snap:
            mesh.remesh(hsiz=0.3, verbose=-1)
            snap.rollback()
            snap.commit()  # Commit after rollback to prevent double rollback

        npt.assert_array_equal(mesh.get_vertices(), original_verts)

    def test_checkpoint_auto_rollback_on_exception(self) -> None:
        """Test that exception causes automatic rollback."""
        mesh = create_3d_mesh()
        original_verts = mesh.get_vertices().copy()

        def failing_remesh() -> None:
            mesh.remesh(hsiz=0.3, verbose=-1)
            msg = "Simulated failure"
            raise ValueError(msg)

        with pytest.raises(ValueError, match="Simulated failure"), mesh.checkpoint():
            failing_remesh()

        npt.assert_array_equal(mesh.get_vertices(), original_verts)

    def test_checkpoint_rollback_2d(self) -> None:
        """Test rollback works for 2D meshes."""
        mesh = create_2d_mesh()
        original_verts = mesh.get_vertices().copy()
        original_tris = mesh.get_triangles().copy()

        with mesh.checkpoint():
            mesh.remesh(hsiz=0.3, verbose=-1)
            # No commit

        npt.assert_array_equal(mesh.get_vertices(), original_verts)
        npt.assert_array_equal(mesh.get_triangles(), original_tris)

    def test_checkpoint_rollback_surface(self) -> None:
        """Test rollback works for surface meshes."""
        mesh = create_surface_mesh()
        original_verts = mesh.get_vertices().copy()
        original_tris = mesh.get_triangles().copy()

        with mesh.checkpoint():
            mesh.remesh(hsiz=0.3, verbose=-1)
            # No commit

        npt.assert_array_equal(mesh.get_vertices(), original_verts)
        npt.assert_array_equal(mesh.get_triangles(), original_tris)


class TestCheckpointRefsPreservation:
    """Tests that reference markers are preserved during rollback."""

    def test_checkpoint_preserves_tetrahedra_refs(self) -> None:
        """Test that tetrahedra reference IDs are preserved on rollback."""
        from mmgpy._mmgpy import MmgMesh3D

        vertices = np.array(
            [
                [0.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [0.5, 1.0, 0.0],
                [0.5, 0.5, 1.0],
            ],
            dtype=np.float64,
        )
        tets = np.array([[0, 1, 2, 3]], dtype=np.int32)
        tet_refs = np.array([42], dtype=np.int64)

        impl = MmgMesh3D()
        impl.set_mesh_size(vertices=4, tetrahedra=1)
        impl.set_vertices(vertices)
        impl.set_tetrahedra(tets, refs=tet_refs)

        mesh = Mesh._from_impl(impl, MeshKind.TETRAHEDRAL)

        with mesh.checkpoint():
            mesh.remesh(hsiz=0.2, verbose=-1)
            # No commit - should rollback

        _, refs_after = mesh._impl.get_tetrahedra_with_refs()
        npt.assert_array_equal(refs_after, tet_refs)


class TestCheckpointFieldPreservation:
    """Tests that solution fields are preserved during rollback."""

    def test_checkpoint_preserves_metric_field(self) -> None:
        """Test that metric field is preserved on rollback."""
        mesh = create_3d_mesh()
        n_verts = len(mesh.get_vertices())

        # Set a metric field (scalar per vertex, shape (N, 1))
        original_metric = np.ones((n_verts, 1), dtype=np.float64) * 0.1
        mesh.set_field("metric", original_metric)

        with mesh.checkpoint():
            # Remesh using the metric (can't use hsiz with metric)
            mesh.remesh(verbose=-1)
            # No commit - should rollback

        # After rollback, metric should be restored
        restored_metric = mesh.get_field("metric")
        npt.assert_array_equal(restored_metric, original_metric)

    def test_checkpoint_preserves_vector_field(self) -> None:
        """Test that vector field (displacement) is preserved on rollback."""
        mesh = create_3d_mesh()
        n_verts = len(mesh.get_vertices())

        # Set a displacement field (3D vector per vertex)
        original_disp = np.zeros((n_verts, 3), dtype=np.float64)
        original_disp[:, 0] = 0.01  # Small x displacement
        mesh.set_field("displacement", original_disp)

        with mesh.checkpoint():
            mesh.remesh(hmax=0.5, verbose=-1)
            # No commit - should rollback

        restored_disp = mesh.get_field("displacement")
        npt.assert_array_equal(restored_disp, original_disp)

    def test_checkpoint_commit_does_not_restore_fields(self) -> None:
        """Test that commit keeps the new mesh state without restoring fields."""
        mesh = create_3d_mesh()
        n_verts = len(mesh.get_vertices())

        original_metric = np.ones((n_verts, 1), dtype=np.float64) * 0.1
        mesh.set_field("metric", original_metric)

        with mesh.checkpoint() as snap:
            # Remesh using the metric (can't use hsiz with metric)
            mesh.remesh(verbose=-1)
            snap.commit()

        # After commit, mesh should have different number of vertices
        assert len(mesh.get_vertices()) != n_verts

    def test_checkpoint_preserves_2d_metric(self) -> None:
        """Test that metric field is preserved on 2D mesh rollback."""
        mesh = create_2d_mesh()
        n_verts = len(mesh.get_vertices())

        original_metric = np.ones((n_verts, 1), dtype=np.float64) * 0.2
        mesh.set_field("metric", original_metric)

        with mesh.checkpoint():
            # Remesh using the metric
            mesh.remesh(verbose=-1)
            # No commit

        restored_metric = mesh.get_field("metric")
        npt.assert_array_equal(restored_metric, original_metric)

    def test_checkpoint_preserves_surface_metric(self) -> None:
        """Test that metric field is preserved on surface mesh rollback."""
        mesh = create_surface_mesh()
        n_verts = len(mesh.get_vertices())

        original_metric = np.ones((n_verts, 1), dtype=np.float64) * 0.15
        mesh.set_field("metric", original_metric)

        with mesh.checkpoint():
            # Remesh using the metric
            mesh.remesh(verbose=-1)
            # No commit

        restored_metric = mesh.get_field("metric")
        npt.assert_array_equal(restored_metric, original_metric)

    def test_checkpoint_preserves_levelset_field(self) -> None:
        """Test that levelset field is preserved on rollback."""
        mesh = create_3d_mesh()
        n_verts = len(mesh.get_vertices())
        rng = np.random.default_rng(42)

        original_ls = rng.random((n_verts, 1)) - 0.5  # Random values [-0.5, 0.5]
        mesh.set_field("levelset", original_ls)

        with mesh.checkpoint():
            mesh.remesh(hmax=0.5, verbose=-1)

        restored_ls = mesh.get_field("levelset")
        npt.assert_array_equal(restored_ls, original_ls)

    def test_checkpoint_preserves_all_fields(self) -> None:
        """Test that all fields are preserved together on rollback."""
        mesh = create_3d_mesh()
        n_verts = len(mesh.get_vertices())
        rng = np.random.default_rng(42)

        original_metric = np.ones((n_verts, 1), dtype=np.float64) * 0.1
        original_disp = rng.random((n_verts, 3))
        original_ls = rng.random((n_verts, 1)) - 0.5

        mesh.set_field("metric", original_metric)
        mesh.set_field("displacement", original_disp)
        mesh.set_field("levelset", original_ls)

        with mesh.checkpoint():
            mesh.remesh(hmax=0.5, verbose=-1)

        npt.assert_array_equal(mesh.get_field("metric"), original_metric)
        npt.assert_array_equal(mesh.get_field("displacement"), original_disp)
        npt.assert_array_equal(mesh.get_field("levelset"), original_ls)

    def test_checkpoint_restores_overwritten_field(self) -> None:
        """Test that rollback restores fields even if they were overwritten."""
        mesh = create_3d_mesh()
        n_verts = len(mesh.get_vertices())
        rng = np.random.default_rng(42)

        original_disp = rng.random((n_verts, 3))
        mesh.set_field("displacement", original_disp)

        with mesh.checkpoint():
            mesh.remesh(hmax=0.5, verbose=-1)
            new_n = len(mesh.get_vertices())
            # Overwrite with different data
            mesh.set_field("displacement", np.ones((new_n, 3)) * 999.0)

        restored_disp = mesh.get_field("displacement")
        npt.assert_array_equal(restored_disp, original_disp)

    def test_checkpoint_restores_overwritten_levelset(self) -> None:
        """Test that rollback restores levelset even if it was overwritten."""
        mesh = create_3d_mesh()
        n_verts = len(mesh.get_vertices())
        rng = np.random.default_rng(42)

        original_ls = rng.random((n_verts, 1)) - 0.5
        mesh.set_field("levelset", original_ls)

        with mesh.checkpoint():
            mesh.remesh(hmax=0.5, verbose=-1)
            new_n = len(mesh.get_vertices())
            mesh.set_field("levelset", np.ones((new_n, 1)) * 999.0)

        restored_ls = mesh.get_field("levelset")
        npt.assert_array_equal(restored_ls, original_ls)

    def test_checkpoint_does_not_save_tensor_field(self) -> None:
        """Test that tensor field is intentionally not saved due to memory overlap.

        The tensor field shares memory with metric in MMG's internal representation,
        so only one can be set at a time. Checkpoint intentionally saves metric but
        not tensor to avoid conflicts.
        """
        mesh = create_3d_mesh()
        n_verts = len(mesh.get_vertices())

        # Create a simple isotropic tensor (6 components: xx, xy, xz, yy, yz, zz)
        original_tensor = np.tile([0.1, 0.0, 0.0, 0.1, 0.0, 0.1], (n_verts, 1))
        mesh.set_field("tensor", original_tensor)

        # Verify tensor is set
        npt.assert_array_almost_equal(mesh.get_field("tensor"), original_tensor)

        with mesh.checkpoint():
            mesh.remesh(hmax=0.5, verbose=-1)
            # No commit - should rollback

        # After rollback, tensor is NOT restored (intentional behavior)
        # The mesh geometry is restored, but tensor field is lost
        # This documents the intentional design decision
        try:
            restored_tensor = mesh.get_field("tensor")
            # If we get here, check that tensor values have changed
            # (due to remeshing interpolation or being unset)
            assert not np.array_equal(restored_tensor, original_tensor)
        except RuntimeError:
            # Field not set - this is also acceptable behavior
            pass


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


class TestMeshCheckpointClass:
    """Tests for the MeshCheckpoint class directly."""

    def test_checkpoint_is_dataclass(self) -> None:
        """Test that MeshCheckpoint has expected attributes."""
        mesh = create_3d_mesh()
        checkpoint = mesh.checkpoint()

        assert hasattr(checkpoint, "commit")
        assert hasattr(checkpoint, "rollback")
        assert callable(checkpoint.commit)
        assert callable(checkpoint.rollback)

    def test_checkpoint_double_rollback_safe(self) -> None:
        """Test that calling rollback multiple times is safe."""
        mesh = create_3d_mesh()
        original_verts = mesh.get_vertices().copy()

        checkpoint = mesh.checkpoint()
        mesh.remesh(hsiz=0.3, verbose=-1)
        checkpoint.rollback()
        checkpoint.rollback()  # Second rollback should be safe

        npt.assert_array_equal(mesh.get_vertices(), original_verts)


class TestIntegrationScenarios:
    """Integration tests for common use cases."""

    def test_try_remesh_rollback_on_failure(self) -> None:
        """Test the common pattern: try remesh, rollback if validation fails."""
        mesh = create_3d_mesh()

        with mesh.checkpoint() as snap:
            mesh.remesh(hsiz=0.3, verbose=-1)
            if not mesh.validate():
                snap.rollback()
            snap.commit()

        # Either mesh is valid and modified, or rolled back
        # (in this test, the mesh should be valid after remesh)
        assert mesh.validate()

    def test_nested_operations_with_copy(self) -> None:
        """Test nested operations using copy for experimentation."""
        original = create_3d_mesh()
        original_verts = original.get_vertices().copy()

        best_result = None
        best_vertex_count = float("inf")

        for hsiz in [0.5, 0.3, 0.2]:
            with original.copy() as working:
                working.remesh(hsiz=hsiz, verbose=-1)
                vertex_count = len(working.get_vertices())

                if vertex_count < best_vertex_count:
                    best_vertex_count = vertex_count
                    best_result = working.get_vertices().copy()

        # Original should be unchanged
        npt.assert_array_equal(original.get_vertices(), original_verts)

        # We found a result
        assert best_result is not None

    def test_checkpoint_after_multiple_operations(self) -> None:
        """Test checkpoint after performing multiple operations."""
        mesh = create_3d_mesh()

        # First remesh with hmax
        mesh.remesh(hmax=0.5, verbose=-1)
        verts_after_first = mesh.get_vertices().copy()

        # Checkpoint for the second operation
        with mesh.checkpoint() as snap:
            mesh.remesh(hmax=0.3, verbose=-1)
            # Rollback to after first remesh
            snap.rollback()
            snap.commit()

        npt.assert_array_equal(mesh.get_vertices(), verts_after_first)
