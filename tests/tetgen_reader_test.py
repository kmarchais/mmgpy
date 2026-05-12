"""Tests for the Tetgen ``.node`` / ``.ele`` reader registration."""

from __future__ import annotations

import importlib.metadata
from pathlib import Path
from textwrap import dedent

import numpy as np
import pytest
import pyvista as pv

import mmgpy  # noqa: F401 -- ensures accessor + readers are registered

# A small cube split into five tetrahedra. Boundary markers on the node
# corners (1..8) and a region attribute on the tets (42) exercise the
# tetgen:ref → refs auto-routing path used by ``mesh.mmg.remesh``.
_NODE_CONTENT = dedent(
    """\
    8 3 0 1
    1  0.0 0.0 0.0  1
    2  1.0 0.0 0.0  2
    3  1.0 1.0 0.0  3
    4  0.0 1.0 0.0  4
    5  0.0 0.0 1.0  5
    6  1.0 0.0 1.0  6
    7  1.0 1.0 1.0  7
    8  0.0 1.0 1.0  8
    """,
)

_ELE_CONTENT = dedent(
    """\
    5 4 1
    1  1 2 3 6  42
    2  1 3 4 8  42
    3  1 3 6 8  42
    4  1 5 6 8  42
    5  3 6 7 8  42
    """,
)


@pytest.fixture
def tetgen_pair(tmp_path: Path) -> Path:
    """Drop a ``.node`` / ``.ele`` pair on disk and return the ``.node`` path."""
    node = tmp_path / "cube.node"
    ele = tmp_path / "cube.ele"
    node.write_text(_NODE_CONTENT)
    ele.write_text(_ELE_CONTENT)
    return node


def test_entry_points_register_node_and_ele() -> None:
    """``pyproject.toml`` exposes ``.node`` / ``.ele`` under ``pyvista.readers``."""
    readers = importlib.metadata.entry_points(group="pyvista.readers")
    names = {ep.name for ep in readers}
    assert "node" in names
    assert "ele" in names


def test_pv_read_node_returns_unstructured_grid(tetgen_pair: Path) -> None:
    """``pv.read("foo.node")`` produces an UnstructuredGrid with the tets."""
    loaded = pv.read(str(tetgen_pair))

    assert isinstance(loaded, pv.UnstructuredGrid)
    assert loaded.n_points == 8
    assert loaded.n_cells == 5
    assert pv.CellType.TETRA in loaded.cells_dict


def test_pv_read_ele_returns_same_mesh(tetgen_pair: Path) -> None:
    """Passing the ``.ele`` sibling produces the same UnstructuredGrid.

    meshio pairs ``.node`` and ``.ele`` internally regardless of which
    extension the user opens.
    """
    via_node = pv.read(str(tetgen_pair))
    via_ele = pv.read(str(tetgen_pair.with_suffix(".ele")))

    assert via_node.n_points == via_ele.n_points
    assert via_node.n_cells == via_ele.n_cells
    np.testing.assert_array_equal(via_node.points, via_ele.points)
    np.testing.assert_array_equal(
        np.asarray(via_node.point_data["tetgen:ref"]),
        np.asarray(via_ele.point_data["tetgen:ref"]),
    )
    np.testing.assert_array_equal(
        np.asarray(via_node.cell_data["tetgen:ref"]),
        np.asarray(via_ele.cell_data["tetgen:ref"]),
    )


def test_tetgen_refs_preserved(tetgen_pair: Path) -> None:
    """Boundary markers and region attributes survive as ``tetgen:ref``."""
    loaded = pv.read(str(tetgen_pair))

    point_refs = np.asarray(loaded.point_data["tetgen:ref"])
    cell_refs = np.asarray(loaded.cell_data["tetgen:ref"])

    np.testing.assert_array_equal(point_refs, np.arange(1, 9, dtype=point_refs.dtype))
    np.testing.assert_array_equal(cell_refs, np.full(5, 42, dtype=cell_refs.dtype))


def test_tetgen_dataset_remeshable_via_accessor(tetgen_pair: Path) -> None:
    """``mesh.mmg.remesh()`` accepts a Tetgen-loaded dataset directly."""
    loaded = pv.read(str(tetgen_pair))

    remeshed = loaded.mmg.remesh(hsiz=0.4)

    assert isinstance(remeshed, pv.UnstructuredGrid)
    assert remeshed.n_cells > 0


def test_tetgen_refs_route_into_remesh(tetgen_pair: Path) -> None:
    """The tetgen:ref cell array is honored by from_pyvista → refs.

    The cube tets all carry ref 42; after a remesh that preserves the
    domain, the output's cell refs are still 42 (no zeros introduced
    from missing-ref defaults). The output also contains boundary
    triangles (MMG emits them alongside the tets), so the assertion
    filters on TETRA cells only.
    """
    loaded = pv.read(str(tetgen_pair))

    remeshed = loaded.mmg.remesh(hsiz=0.4)

    cell_refs = np.asarray(remeshed.cell_data["refs"])
    tet_mask = np.asarray(remeshed.celltypes) == pv.CellType.TETRA
    tet_refs = cell_refs[tet_mask]
    assert tet_refs.size > 0
    assert np.all(tet_refs == 42)
