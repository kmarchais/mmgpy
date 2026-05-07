"""Tests for the remesh_lagrangian deprecation shims.

The bound MMG ELAS-driven Lagrangian path is gone (the bundled MMG is built
``USE_ELAS=OFF``), but the Python wrappers ``Mesh.remesh_lagrangian``,
``dataset.mmg.remesh_lagrangian`` and ``mmgpy.progress.remesh_mesh_lagrangian``
survive as deprecation shims that route through ``mmgpy.move_mesh``. These
tests pin down that the shims warn and forward correctly.
"""

from __future__ import annotations

import warnings

import numpy as np
import pytest
import pyvista as pv


def _square_mesh() -> tuple[np.ndarray, np.ndarray]:
    """Build a 4-vertex unit square split into two triangles."""
    vertices = np.array(
        [[0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0]],
        dtype=np.float64,
    )
    triangles = np.array([[0, 1, 2], [0, 2, 3]], dtype=np.int32)
    return vertices, triangles


def _tet_grid() -> pv.UnstructuredGrid:
    """Build a small tet mesh from a 5x5x5 sample point cloud."""
    pts = pv.ImageData(
        dimensions=(5, 5, 5),
        spacing=(0.25, 0.25, 0.25),
    ).cast_to_unstructured_grid()
    return pts.delaunay_3d()


def test_accessor_remesh_lagrangian_warns_and_forwards_to_move() -> None:
    """``dataset.mmg.remesh_lagrangian`` emits DeprecationWarning and forwards."""
    import mmgpy  # noqa: F401  -- registers the .mmg accessor

    grid = _tet_grid()
    displacement = np.zeros((grid.n_points, 3), dtype=np.float64)

    with warnings.catch_warnings(record=True) as captured:
        warnings.simplefilter("always")
        moved = grid.mmg.remesh_lagrangian(displacement)

    assert any(issubclass(w.category, DeprecationWarning) for w in captured)
    assert isinstance(moved, pv.UnstructuredGrid | pv.PolyData)
    assert moved.n_points > 0


def test_mesh_remesh_lagrangian_warns_and_returns_remesh_result() -> None:
    """``Mesh.remesh_lagrangian`` emits DeprecationWarning and returns a result."""
    from mmgpy import Mesh
    from mmgpy._result import RemeshResult

    vertices, triangles = _square_mesh()
    with warnings.catch_warnings():
        # Mesh itself is deprecated (PR #232); silence that here so we only
        # observe the lagrangian-specific warning.
        warnings.simplefilter("ignore", DeprecationWarning)
        mesh = Mesh(vertices, triangles)

    displacement = np.zeros_like(vertices)
    displacement[:, 0] = 0.01

    with warnings.catch_warnings(record=True) as captured:
        warnings.simplefilter("always")
        result = mesh.remesh_lagrangian(displacement, verbose=-1)

    msgs = [
        str(w.message) for w in captured if issubclass(w.category, DeprecationWarning)
    ]
    assert any("remesh_lagrangian" in m for m in msgs)
    assert isinstance(result, RemeshResult)
    assert result.vertices_after > 0


def test_progress_remesh_mesh_lagrangian_warns_and_forwards() -> None:
    """``progress.remesh_mesh_lagrangian`` emits DeprecationWarning and runs."""
    from mmgpy._mmgpy import MmgMesh2D
    from mmgpy.progress import remesh_mesh_lagrangian

    vertices, triangles = _square_mesh()
    impl = MmgMesh2D(vertices, triangles)
    displacement = np.zeros_like(vertices)

    with warnings.catch_warnings(record=True) as captured:
        warnings.simplefilter("always")
        remesh_mesh_lagrangian(impl, displacement, verbose=-1)

    msgs = [
        str(w.message) for w in captured if issubclass(w.category, DeprecationWarning)
    ]
    assert any("remesh_mesh_lagrangian" in m for m in msgs)
    assert len(impl.get_vertices()) > 0


def test_mesh_remesh_lagrangian_rejects_surface() -> None:
    """The shim still rejects surface meshes (move_mesh has no surface path)."""
    from mmgpy import Mesh

    vertices = np.array(
        [[0.0, 0.0, 0.0], [1.0, 0.0, 0.0], [0.5, 1.0, 0.5]],
        dtype=np.float64,
    )
    triangles = np.array([[0, 1, 2]], dtype=np.int32)
    with warnings.catch_warnings():
        warnings.simplefilter("ignore", DeprecationWarning)
        mesh = Mesh(vertices, triangles)

    displacement = np.zeros_like(vertices)

    def _call() -> None:
        with warnings.catch_warnings():
            warnings.simplefilter("ignore", DeprecationWarning)
            mesh.remesh_lagrangian(displacement)

    with pytest.raises(TypeError, match="not available for TRIANGULAR_SURFACE"):
        _call()
