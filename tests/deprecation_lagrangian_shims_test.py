"""Tests for the remesh_lagrangian deprecation shims.

The bound MMG ELAS-driven Lagrangian path is gone (the bundled MMG is built
``USE_ELAS=OFF``), but the public-facing wrappers
``dataset.mmg.remesh_lagrangian`` and ``mmgpy.progress.remesh_mesh_lagrangian``
survive as deprecation shims that route through ``mmgpy.move_mesh``. These
tests pin down that the shims warn and forward correctly.
"""

from __future__ import annotations

import warnings

import numpy as np
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
