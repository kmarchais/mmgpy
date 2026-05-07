"""Tests for the 0.13 removal of ``mmgpy.Mesh`` / ``mmgpy.MeshCheckpoint``.

The classes were deprecated in 0.12 and removed from the public API in 0.13.
``MeshKind`` survives. The internal Mesh helper that the accessor uses is now
private and stripped of deprecation warnings; the accessor must stay silent
on every call.

``mmgpy.read()`` is now deprecated for removal in 0.14 and emits a warning.
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


def test_mesh_is_no_longer_public() -> None:
    """``mmgpy.Mesh`` is removed from the public API in 0.13."""
    assert not hasattr(mmgpy, "Mesh")


def test_mesh_checkpoint_is_no_longer_public() -> None:
    """``mmgpy.MeshCheckpoint`` is removed from the public API in 0.13."""
    assert not hasattr(mmgpy, "MeshCheckpoint")


def test_meshkind_is_still_public() -> None:
    """``MeshKind`` survives 0.13 because the accessor still returns it."""
    assert mmgpy.MeshKind.TETRAHEDRAL.value == "tetrahedral"


def test_mmgpy_read_emits_deprecation_warning(tmp_path: Path) -> None:
    """``mmgpy.read(path)`` emits a DeprecationWarning announcing 0.14 removal."""
    vertices, tets = _tiny_tet_arrays()
    grid = pv.UnstructuredGrid({pv.CellType.TETRA: tets}, vertices)
    path = tmp_path / "tiny.mesh"
    grid.save(str(path))

    with pytest.warns(DeprecationWarning, match=r"mmgpy\.read\(\) is deprecated"):
        result = mmgpy.read(path)

    assert isinstance(result, pv.UnstructuredGrid | pv.PolyData)


def test_accessor_remesh_does_not_warn() -> None:
    """The .mmg accessor builds the internal helper but must stay silent."""
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
