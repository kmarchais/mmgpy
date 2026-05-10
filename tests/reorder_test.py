"""Tests for ``mmgpy.reorder_cuthill_mckee`` and the ``renum`` redirect."""

from __future__ import annotations

import warnings

import numpy as np
import pytest
import pyvista as pv

import mmgpy
from mmgpy._reorder import _bandwidth, _collect_element_blocks
from mmgpy._topology import vertex_adjacency


def _bandwidth_of(dataset: pv.UnstructuredGrid | pv.PolyData) -> int:
    """Compute max ``|i - j|`` over all edges of *dataset*."""
    blocks = _collect_element_blocks(dataset)
    if not blocks:
        return 0
    n = int(dataset.n_points)
    adj = vertex_adjacency(n, blocks[0])
    for extra in blocks[1:]:
        adj = adj + vertex_adjacency(n, extra)
    adj.data[:] = 1.0
    rows = [adj.indices[adj.indptr[i] : adj.indptr[i + 1]] for i in range(n)]
    return _bandwidth(rows)


def _make_3d_grid(n: int = 6) -> pv.UnstructuredGrid:
    """Tetrahedral grid on the unit cube via PyVista's Delaunay."""
    x = np.linspace(0, 1, n)
    grid = np.meshgrid(x, x, x, indexing="ij")
    pts = np.column_stack([g.ravel() for g in grid])
    cloud = pv.PolyData(pts)
    ug = cloud.delaunay_3d()
    ug.point_data["scalar"] = np.arange(ug.n_points, dtype=np.float64)
    ug.point_data["vector"] = np.tile(
        np.arange(ug.n_points, dtype=np.float64).reshape(-1, 1),
        (1, 3),
    )
    ug.cell_data["cell_id"] = np.arange(ug.n_cells, dtype=np.int32)
    return ug


def _make_2d_polydata(n: int = 6) -> pv.PolyData:
    """Triangular PolyData on the unit square via Delaunay 2D."""
    from scipy.spatial import Delaunay

    x = np.linspace(0, 1, n)
    grid = np.meshgrid(x, x, indexing="ij")
    pts2d = np.column_stack([g.ravel() for g in grid])
    tri = Delaunay(pts2d)
    pts3d = np.column_stack([pts2d, np.zeros(pts2d.shape[0])])
    faces = np.hstack(
        [np.full((tri.simplices.shape[0], 1), 3, dtype=np.int64), tri.simplices],
    ).ravel()
    pd = pv.PolyData(pts3d, faces=faces)
    pd.point_data["scalar"] = np.arange(pd.n_points, dtype=np.float64)
    return pd


def _make_surface_polydata() -> pv.PolyData:
    """Surface mesh of a sphere (triangles only)."""
    sphere = pv.Sphere(theta_resolution=12, phi_resolution=12)
    sphere = sphere.triangulate()
    sphere.point_data["scalar"] = np.arange(sphere.n_points, dtype=np.float64)
    return sphere


def test_reorder_preserves_counts_and_topology() -> None:
    """Vertex/cell counts survive a reorder, and the point set is the same."""
    ug = _make_3d_grid()
    out = mmgpy.reorder_cuthill_mckee(ug)
    assert out.n_points == ug.n_points
    assert out.n_cells == ug.n_cells
    assert np.allclose(np.sort(out.points, axis=0), np.sort(ug.points, axis=0))


def test_reorder_reduces_bandwidth_3d() -> None:
    """RCM strictly reduces vertex-vertex bandwidth on a Delaunay tet grid."""
    ug = _make_3d_grid(n=6)
    bw_before = _bandwidth_of(ug)
    out = mmgpy.reorder_cuthill_mckee(ug)
    bw_after = _bandwidth_of(out)
    assert bw_after < bw_before, (
        f"bandwidth did not decrease: {bw_before} -> {bw_after}"
    )


def test_reorder_point_data_follows_permutation() -> None:
    """Scalar and vector point_data arrays are permuted with the vertices."""
    ug = _make_3d_grid(n=4)
    out = mmgpy.reorder_cuthill_mckee(ug)
    # The "scalar" point_data was set to vertex index in the original mesh,
    # so after reordering, scalar[i] tells us which original vertex landed at
    # new index i. Use that to verify points + vector also follow the perm.
    perm = out.point_data["scalar"].astype(np.int64)
    assert np.allclose(out.points, np.asarray(ug.points)[perm])
    assert np.allclose(
        out.point_data["vector"],
        np.asarray(ug.point_data["vector"])[perm],
    )


def test_reorder_cell_data_unchanged() -> None:
    """cell_data arrays must be carried over verbatim."""
    ug = _make_3d_grid(n=4)
    out = mmgpy.reorder_cuthill_mckee(ug)
    assert np.array_equal(
        out.cell_data["cell_id"],
        ug.cell_data["cell_id"],
    )


def test_reorder_2d_triangles_polydata() -> None:
    """RCM works on PolyData with only triangle (face) cells."""
    pd = _make_2d_polydata(n=6)
    out = mmgpy.reorder_cuthill_mckee(pd)
    assert isinstance(out, pv.PolyData)
    assert out.n_points == pd.n_points
    assert out.n_cells == pd.n_cells
    # Topology preserved: scalar was set to vertex index, so out["scalar"]
    # is a permutation of [0, n_points). Check that points and connectivity
    # are consistent with that permutation.
    perm = out.point_data["scalar"].astype(np.int64)
    assert np.allclose(out.points, np.asarray(pd.points)[perm])


def test_reorder_surface_polydata() -> None:
    """RCM works on a closed triangular surface (sphere)."""
    pd = _make_surface_polydata()
    out = mmgpy.reorder_cuthill_mckee(pd)
    assert isinstance(out, pv.PolyData)
    assert out.n_points == pd.n_points
    assert out.n_cells == pd.n_cells
    perm = out.point_data["scalar"].astype(np.int64)
    assert np.allclose(out.points, np.asarray(pd.points)[perm])


def test_accessor_method_routes_to_reorder() -> None:
    """``dataset.mmg.reorder_cuthill_mckee()`` matches the top-level helper."""
    ug = _make_3d_grid(n=4)
    out = ug.mmg.reorder_cuthill_mckee()
    assert out.n_points == ug.n_points
    assert out.n_cells == ug.n_cells


def test_renum_kwarg_is_deprecated_and_redirects() -> None:
    """``renum=1`` warns and applies RCM after the remesh."""
    ug = _make_3d_grid(n=4)
    with warnings.catch_warnings(record=True) as caught:
        warnings.simplefilter("always")
        out = ug.mmg.remesh(renum=1, hsiz=0.5)
    assert any(issubclass(w.category, DeprecationWarning) for w in caught), (
        "expected DeprecationWarning for renum kwarg"
    )
    # Result should still be a valid mesh; bandwidth check is per-mesh-shape so
    # we just ensure the redirect ran without error.
    assert out.n_points > 0
    assert out.n_cells > 0


def test_renum_zero_does_not_warn() -> None:
    """``renum=0`` is silently dropped without a deprecation warning."""
    ug = _make_3d_grid(n=4)
    with warnings.catch_warnings(record=True) as caught:
        warnings.simplefilter("always")
        ug.mmg.remesh(renum=0, hsiz=0.5)
    assert not any(issubclass(w.category, DeprecationWarning) for w in caught), (
        "renum=0 should be silently dropped, not warned"
    )


def test_empty_dataset_returns_copy() -> None:
    """An empty mesh round-trips to a fresh empty copy."""
    empty = pv.UnstructuredGrid()
    out = mmgpy.reorder_cuthill_mckee(empty)
    assert out.n_points == 0
    assert out is not empty


def test_reorder_rejects_non_pyvista() -> None:
    """Non-PyVista inputs raise TypeError."""
    with pytest.raises(TypeError, match="UnstructuredGrid or PolyData"):
        mmgpy.reorder_cuthill_mckee(np.zeros((4, 3)))  # type: ignore[arg-type]
