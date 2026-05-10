"""Tests for the constraint-marker plumbing on the ``.mmg`` accessor.

The accessor exposes MMG's ``set_required_*`` / ``set_corners`` /
``set_ridge_edges`` / ``set_parallel_*`` API two ways: per-call kwargs on
``remesh()`` (and friends), and reserved ``point_data`` / ``cell_data`` tags.
These tests cover the three internal helpers that do the wiring plus an
end-to-end check that the kwargs reach ``mesh._impl``.
"""

from __future__ import annotations

from pathlib import Path

import numpy as np
import pytest
import pyvista as pv

import mmgpy  # noqa: F401  -- registers the .mmg accessor and Medit reader
from mmgpy._pv_plugin import (
    _CONSTRAINT_KWARGS,
    _apply_constraint_markers,
    _collect_constraints_from_data,
    _per_type_indices_marked,
    _split_constraint_kwargs,
)

_ASSETS = Path(__file__).resolve().parents[2] / "assets"


def _grid_with_tets_and_tris() -> pv.UnstructuredGrid:
    """Return a small mixed-cell UnstructuredGrid: 2 tets + 2 triangles.

    The exact geometry doesn't matter for the index-mapping tests — only
    that the dataset has multiple cell types in a mixed order so that
    per-type index translation is non-trivial.
    """
    points = np.array(
        [
            [0.0, 0.0, 0.0],
            [1.0, 0.0, 0.0],
            [0.0, 1.0, 0.0],
            [0.0, 0.0, 1.0],
            [1.0, 1.0, 0.0],
        ],
        dtype=np.float64,
    )
    # Cells are interleaved: tet, tri, tet, tri so per-type indexing is
    # not the same as global indexing.
    tet0 = [4, 0, 1, 2, 3]
    tri0 = [3, 0, 1, 4]
    tet1 = [4, 1, 2, 3, 4]
    tri1 = [3, 1, 2, 4]
    cells = np.array(tet0 + tri0 + tet1 + tri1, dtype=np.int64)
    cell_types = np.array(
        [
            pv.CellType.TETRA,
            pv.CellType.TRIANGLE,
            pv.CellType.TETRA,
            pv.CellType.TRIANGLE,
        ],
        dtype=np.uint8,
    )
    return pv.UnstructuredGrid(cells, cell_types, points)


class TestSplitConstraintKwargs:
    """Reserved kwargs are popped; unknown kwargs are left for the remesher."""

    def test_pops_only_known_names(self) -> None:
        """Reserved kwargs disappear; the rest stays put for the remesher."""
        idx = np.array([1, 2, 3], dtype=np.int32)
        opts = {
            "hmax": 0.1,
            "required_triangles": idx,
            "verbose": False,
        }
        got = _split_constraint_kwargs(opts)
        assert "required_triangles" in got
        assert "required_triangles" not in opts
        assert opts == {"hmax": 0.1, "verbose": False}

    def test_normalizes_dtype_and_layout(self) -> None:
        """Lists / non-int32 inputs are coerced to a contiguous int32 array."""
        opts = {"required_triangles": [3, 1, 4]}  # list, not int32
        got = _split_constraint_kwargs(opts)
        arr = got["required_triangles"]
        assert arr.dtype == np.int32
        assert arr.flags["C_CONTIGUOUS"]
        assert arr.tolist() == [3, 1, 4]

    def test_none_value_is_dropped(self) -> None:
        """``required_triangles=None`` is treated as no constraint."""
        opts = {"required_triangles": None, "hmax": 0.1}
        got = _split_constraint_kwargs(opts)
        assert got == {}
        assert opts == {"hmax": 0.1}

    def test_all_reserved_names_recognized(self) -> None:
        """Every name in ``_CONSTRAINT_KWARGS`` should be popped."""
        opts = {name: np.array([0], dtype=np.int32) for name in _CONSTRAINT_KWARGS}
        got = _split_constraint_kwargs(opts)
        assert set(got.keys()) == set(_CONSTRAINT_KWARGS)
        assert opts == {}


class TestPerTypeIndicesMarked:
    """Global cell-data masks → per-cell-type 0-indexed indices."""

    def test_mixed_cell_dataset(self) -> None:
        """Per-type rank is the cumulative count of same-type cells."""
        grid = _grid_with_tets_and_tris()
        # Mark global cells 1 (TRIANGLE) and 2 (TETRA).
        mask = np.array([False, True, True, False])

        tri_idx = _per_type_indices_marked(grid, pv.CellType.TRIANGLE, mask)
        tet_idx = _per_type_indices_marked(grid, pv.CellType.TETRA, mask)

        # Triangle 0 in the per-type ordering is global cell 1.
        assert tri_idx.tolist() == [0]
        # Tet 1 in the per-type ordering is global cell 2 (tet 0 is cell 0).
        assert tet_idx.tolist() == [1]

    def test_returns_int32(self) -> None:
        """Output dtype is int32 to match the C++ binding signature."""
        grid = _grid_with_tets_and_tris()
        mask = np.zeros(grid.n_cells, dtype=bool)
        mask[1] = True
        idx = _per_type_indices_marked(grid, pv.CellType.TRIANGLE, mask)
        assert idx.dtype == np.int32

    def test_no_match(self) -> None:
        """A cell type absent from the dataset returns an empty array."""
        grid = _grid_with_tets_and_tris()
        mask = np.zeros(grid.n_cells, dtype=bool)
        idx = _per_type_indices_marked(grid, pv.CellType.LINE, mask)
        assert idx.size == 0


class TestCollectConstraintsFromData:
    """Reserved point_data/cell_data tags translate to kwarg-name → index."""

    def test_point_tag(self) -> None:
        """``point_data["mmg_required_vertices"]`` becomes a vertex index list."""
        grid = _grid_with_tets_and_tris()
        mask = np.array([True, False, True, False, False])
        grid.point_data["mmg_required_vertices"] = mask

        got = _collect_constraints_from_data(grid)

        assert "required_vertices" in got
        assert got["required_vertices"].tolist() == [0, 2]
        assert got["required_vertices"].dtype == np.int32

    def test_cell_tag_dispatches_by_type(self) -> None:
        """``cell_data["mmg_required_triangles"]`` keeps only TRIANGLE cells."""
        grid = _grid_with_tets_and_tris()
        mask = np.array([False, True, False, True])  # both triangles
        grid.cell_data["mmg_required_triangles"] = mask

        got = _collect_constraints_from_data(grid)

        # Per-type triangle indices: global tri positions 0 and 1.
        assert got["required_triangles"].tolist() == [0, 1]

    def test_cell_tag_filters_out_wrong_type(self) -> None:
        """Tetrahedra flagged in a tag named for triangles are silently ignored."""
        grid = _grid_with_tets_and_tris()
        # Mask both a triangle AND a tet, but tag says "required_triangles".
        mask = np.array([True, True, False, False])  # cell 0 (TET), cell 1 (TRI)
        grid.cell_data["mmg_required_triangles"] = mask

        got = _collect_constraints_from_data(grid)

        # Only the triangle should make it through.
        assert got["required_triangles"].tolist() == [0]

    def test_no_tags_returns_empty(self) -> None:
        """A clean dataset produces an empty constraint dict."""
        grid = _grid_with_tets_and_tris()
        assert _collect_constraints_from_data(grid) == {}


class _RecordingImpl:
    """Stand-in for ``MmgMesh.*`` that records setter calls without invoking MMG."""

    def __init__(self, supported: set[str]) -> None:
        self._calls: dict[str, np.ndarray] = {}
        for name in supported:

            def make(n: str) -> object:
                def setter(arr: np.ndarray) -> None:
                    self._calls[n] = np.asarray(arr).copy()

                return setter

            setattr(self, f"set_{name}", make(name))


class _RecordingMesh:
    def __init__(self, supported: set[str]) -> None:
        self._impl = _RecordingImpl(supported)


class TestApplyConstraintMarkers:
    """``_apply_constraint_markers`` dispatches to the right ``set_*`` method."""

    def test_explicit_kwargs_applied(self) -> None:
        """Each kwarg routes to the matching ``set_<name>`` setter."""
        grid = _grid_with_tets_and_tris()
        mesh = _RecordingMesh({"required_triangles", "required_vertices"})
        explicit = {
            "required_triangles": np.array([0, 1], dtype=np.int32),
            "required_vertices": np.array([3], dtype=np.int32),
        }

        _apply_constraint_markers(mesh, grid, explicit)

        assert mesh._impl._calls["required_triangles"].tolist() == [0, 1]
        assert mesh._impl._calls["required_vertices"].tolist() == [3]

    def test_data_tags_applied_when_no_kwarg(self) -> None:
        """Data tags drive the setters when no kwargs are passed."""
        grid = _grid_with_tets_and_tris()
        grid.cell_data["mmg_required_triangles"] = np.array(
            [False, True, False, True],
        )
        mesh = _RecordingMesh({"required_triangles"})

        _apply_constraint_markers(mesh, grid, {})

        assert mesh._impl._calls["required_triangles"].tolist() == [0, 1]

    def test_kwarg_overrides_data_tag(self) -> None:
        """When both are present, kwargs win and the tag is ignored."""
        grid = _grid_with_tets_and_tris()
        grid.cell_data["mmg_required_triangles"] = np.array(
            [False, True, False, True],
        )
        mesh = _RecordingMesh({"required_triangles"})
        explicit = {"required_triangles": np.array([1], dtype=np.int32)}

        _apply_constraint_markers(mesh, grid, explicit)

        # Kwarg wins; tag is ignored.
        assert mesh._impl._calls["required_triangles"].tolist() == [1]

    def test_empty_marker_skipped(self) -> None:
        """An empty index array is a no-op; the setter isn't called."""
        grid = _grid_with_tets_and_tris()
        mesh = _RecordingMesh({"required_triangles"})
        explicit = {"required_triangles": np.array([], dtype=np.int32)}

        _apply_constraint_markers(mesh, grid, explicit)

        # Empty arrays are no-ops; setter not called.
        assert "required_triangles" not in mesh._impl._calls

    def test_unsupported_marker_raises(self) -> None:
        """Asking for a marker the mesh kind doesn't expose raises clearly."""
        grid = _grid_with_tets_and_tris()
        # Mesh "kind" only supports vertices; user passes triangles.
        mesh = _RecordingMesh({"required_vertices"})
        explicit = {"required_triangles": np.array([0], dtype=np.int32)}

        with pytest.raises(ValueError, match="not supported for this mesh kind"):
            _apply_constraint_markers(mesh, grid, explicit)


class TestAccessorEndToEnd:
    """End-to-end: `mesh.mmg.remesh()` accepts and forwards constraint kwargs."""

    def test_remesh_with_required_edges_tag_runs(self) -> None:
        """Tag-driven required edges round-trip through ``mesh.mmg.remesh()``."""
        # cube.mesh is a small tet mesh that the remesh quality-improvement
        # example uses; remesh succeeds in <1s so it's safe in unit tests.
        ds = pv.read(_ASSETS / "cube.mesh")
        # cube.mesh has no triangles, only tets + edges. Mark some required
        # edges instead — same code path on the accessor.
        n_edges = ds.cells_dict[pv.CellType.LINE].shape[0]
        # Build a length-n_cells mask with the first 5 LINE cells flagged.
        edge_mask = np.zeros(ds.n_cells, dtype=bool)
        line_global = np.where(np.asarray(ds.celltypes) == pv.CellType.LINE)[0]
        edge_mask[line_global[: min(5, n_edges)]] = True
        ds.cell_data["mmg_required_edges"] = edge_mask

        out = ds.mmg.remesh(optim=1, verbose=-1)

        assert out.n_cells > 0  # remesh produced output
        # Required edges should have survived (their segment count cannot
        # decrease below the marked count).
        out_edges = out.cells_dict.get(pv.CellType.LINE)
        assert out_edges is not None
        assert out_edges.shape[0] >= int(edge_mask.sum())

    def test_remesh_required_vertices_kwarg_runs(self) -> None:
        """Vertex constraints reach MMG via the kwarg path."""
        ds = pv.read(_ASSETS / "cube.mesh")
        # Mark a handful of vertices as required via the kwarg path.
        required = np.array([0, 1, 2, 3], dtype=np.int32)

        out = ds.mmg.remesh(optim=1, required_vertices=required, verbose=-1)

        assert out.n_cells > 0

    def test_unknown_constraint_kwarg_falls_through_to_remesh(self) -> None:
        """A typo'd marker name is not silently swallowed by the accessor."""
        # A name that is NOT in _CONSTRAINT_KWARGS must not be popped, so
        # it reaches Mesh.remesh which forwards to MMG and is rejected
        # there. The exact exception type / message comes from
        # Mesh.remesh / pybind11 and is not a stable contract; assert only
        # that the typo is not silently swallowed.
        ds = pv.read(_ASSETS / "cube.mesh")
        with pytest.raises(Exception):  # noqa: B017, PT011
            ds.mmg.remesh(verbose=-1, required_traingles=np.array([0]))  # typo
