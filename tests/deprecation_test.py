"""Tests for the 0.12 deprecation of ``mmgpy.Mesh`` and friends.

The class is scheduled for removal in 0.13. Until then, instantiation must
emit ``DeprecationWarning`` while the internal I/O fast path
(``mmgpy.read`` / ``Mesh._from_impl``) stays silent so the accessor doesn't
spam users on every call.
"""

from __future__ import annotations

import warnings
from pathlib import Path

import numpy as np
import pytest
import pyvista as pv

import mmgpy


def _tiny_tet_arrays() -> tuple[np.ndarray, np.ndarray]:
    """Return (vertices, tetrahedra) for a 5-vertex tet mesh."""
    vertices = np.array(
        [
            [0.0, 0.0, 0.0],
            [1.0, 0.0, 0.0],
            [0.0, 1.0, 0.0],
            [0.0, 0.0, 1.0],
            [1.0, 1.0, 1.0],
        ],
        dtype=np.float64,
    )
    tets = np.array([[0, 1, 2, 3], [1, 2, 3, 4]], dtype=np.int32)
    return vertices, tets


def test_mesh_init_emits_deprecation_warning() -> None:
    """``mmgpy.Mesh(verts, cells)`` triggers ``DeprecationWarning``."""
    vertices, tets = _tiny_tet_arrays()
    with pytest.warns(DeprecationWarning, match=r"mmgpy\.Mesh is deprecated"):
        mmgpy.Mesh(vertices, tets)


def test_mesh_init_from_pyvista_emits_deprecation_warning() -> None:
    """The PyVista-source overload of ``Mesh()`` warns too."""
    vertices, tets = _tiny_tet_arrays()
    grid = pv.UnstructuredGrid({pv.CellType.TETRA: tets}, vertices)
    with pytest.warns(DeprecationWarning, match=r"mmgpy\.Mesh is deprecated"):
        mmgpy.Mesh(grid)


def test_mesh_checkpoint_emits_deprecation_warning() -> None:
    """``Mesh.checkpoint()`` triggers its own ``DeprecationWarning``."""
    vertices, tets = _tiny_tet_arrays()
    with warnings.catch_warnings():
        warnings.simplefilter("ignore", DeprecationWarning)
        mesh = mmgpy.Mesh(vertices, tets)

    with pytest.warns(DeprecationWarning, match=r"Mesh\.checkpoint\(\) is deprecated"):
        mesh.checkpoint()


def test_mmgpy_read_does_not_warn(tmp_path: Path) -> None:
    """``mmgpy.read(path)`` returns a Mesh without firing the deprecation."""
    vertices, tets = _tiny_tet_arrays()
    grid = pv.UnstructuredGrid({pv.CellType.TETRA: tets}, vertices)
    path = tmp_path / "tiny.mesh"
    grid.save(str(path))

    with warnings.catch_warnings():
        warnings.simplefilter("error", DeprecationWarning)
        mesh = mmgpy.read(path)

    assert mesh is not None


def test_accessor_remesh_does_not_warn() -> None:
    """The .mmg accessor builds Mesh internally but must stay silent."""
    vertices, tets = _tiny_tet_arrays()
    grid = pv.UnstructuredGrid({pv.CellType.TETRA: tets}, vertices)

    with warnings.catch_warnings():
        warnings.simplefilter("error", DeprecationWarning)
        remeshed = grid.mmg.remesh(hsiz=0.5, verbose=-1)

    assert remeshed.n_cells > 0


def test_accessor_move_does_not_warn() -> None:
    """The .mmg accessor's move() builds Mesh internally but must stay silent."""
    vertices, tets = _tiny_tet_arrays()
    grid = pv.UnstructuredGrid({pv.CellType.TETRA: tets}, vertices)
    displacement = np.zeros_like(vertices)
    displacement[:, 0] = 0.01

    with warnings.catch_warnings():
        warnings.simplefilter("error", DeprecationWarning)
        moved = grid.mmg.move(displacement, hmax=0.5, verbose=False)

    assert moved.n_points > 0
