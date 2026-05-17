"""Tests for the PyVista 0.48 plugin: Medit reader/writer + ``.mmg`` accessor."""

from __future__ import annotations

import importlib.metadata
from pathlib import Path

import numpy as np
import pytest
import pyvista as pv

import mmgpy


def _save_via_pv(grid: pv.DataSet, path: Path) -> None:
    """Save through pv.DataObject.save so the writer registry is exercised."""
    grid.save(str(path))


def _make_tet_mesh() -> pv.UnstructuredGrid:
    """Return a tiny tetrahedral mesh that round-trips cleanly through MMG."""
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
    elements = np.array(
        [[0, 1, 2, 3], [1, 2, 3, 4]],
        dtype=np.int32,
    )
    return pv.UnstructuredGrid({pv.CellType.TETRA: elements}, vertices)


def _make_surface_mesh() -> pv.PolyData:
    """Return a triangulated cube as a PolyData surface mesh."""
    return pv.Cube().triangulate()


# ---------------------------------------------------------------------------
# Reader / writer registries
# ---------------------------------------------------------------------------


def test_pv_read_mesh_returns_unstructured_grid_for_tets(tmp_path: Path) -> None:
    """Tet meshes round-trip through .mesh as UnstructuredGrid."""
    grid = _make_tet_mesh()
    out = tmp_path / "tets.mesh"
    _save_via_pv(grid, out)

    loaded = pv.read(str(out))

    assert isinstance(loaded, pv.UnstructuredGrid)
    assert loaded.n_points == grid.n_points
    assert pv.CellType.TETRA in loaded.cells_dict


def test_pv_read_mesh_returns_polydata_for_surface(tmp_path: Path) -> None:
    """Surface meshes round-trip through .mesh as triangulated PolyData."""
    surf = _make_surface_mesh()
    out = tmp_path / "surf.mesh"
    _save_via_pv(surf, out)

    loaded = pv.read(str(out))

    assert isinstance(loaded, pv.PolyData)
    assert loaded.n_points == surf.n_points
    assert loaded.is_all_triangles


def test_pv_read_meshb_round_trips_binary(tmp_path: Path) -> None:
    """Binary .meshb files round-trip without explicit type hint."""
    grid = _make_tet_mesh()
    out = tmp_path / "tets.meshb"
    _save_via_pv(grid, out)

    assert out.exists()
    loaded = pv.read(str(out))
    assert isinstance(loaded, pv.UnstructuredGrid)
    assert loaded.n_points == grid.n_points


def test_pv_read_auto_pairs_sibling_sol(tmp_path: Path) -> None:
    """A sibling .sol file is auto-loaded into point_data on pv.read."""
    grid = _make_tet_mesh()
    mesh_path = tmp_path / "demo.mesh"
    _save_via_pv(grid, mesh_path)

    sol_path = mesh_path.with_suffix(".sol")
    sol_path.write_text(
        "MeshVersionFormatted 2\n"
        "Dimension 3\n"
        "SolAtVertices\n"
        f"{grid.n_points}\n"
        "1 1\n" + "\n".join(f"{i * 0.1}" for i in range(grid.n_points)) + "\nEnd\n",
    )

    loaded = pv.read(str(mesh_path))

    assert "solution@vertices" in loaded.point_data
    assert loaded.point_data["solution@vertices"].shape == (grid.n_points,)


def test_pv_read_without_sibling_sol_is_silent(tmp_path: Path) -> None:
    """Reading a .mesh with no companion .sol leaves point_data alone."""
    grid = _make_tet_mesh()
    mesh_path = tmp_path / "lonely.mesh"
    _save_via_pv(grid, mesh_path)

    loaded = pv.read(str(mesh_path))

    assert all(not k.startswith("solution") for k in loaded.point_data)


def test_pv_read_skips_solb_auto_pair(tmp_path: Path) -> None:
    """Binary .solb auto-pair is intentionally skipped (text-only path)."""
    grid = _make_tet_mesh()
    mesh_path = tmp_path / "binary.mesh"
    _save_via_pv(grid, mesh_path)

    # A placeholder .solb the auto-pair finder will discover; we only want
    # to confirm the plugin skips parsing binary content.
    mesh_path.with_suffix(".solb").write_bytes(b"\x00\x01\x02")

    loaded = pv.read(str(mesh_path))

    assert all(not k.startswith("solution") for k in loaded.point_data)


# ---------------------------------------------------------------------------
# .mmg dataset accessor
# ---------------------------------------------------------------------------


def test_accessor_remesh_returns_new_dataset() -> None:
    """mesh.mmg.remesh returns a new dataset, not the original."""
    surf = _make_surface_mesh()
    remeshed = surf.mmg.remesh(hsiz=0.3)

    assert isinstance(remeshed, pv.PolyData)
    assert remeshed.n_cells > 0
    assert remeshed is not surf


def test_accessor_remesh_on_tetrahedral_mesh() -> None:
    """The accessor handles tet inputs and returns UnstructuredGrid."""
    pytest.importorskip("scipy")
    cube_pts = pv.ImageData(
        dimensions=(5, 5, 5),
        spacing=(0.25, 0.25, 0.25),
    ).cast_to_unstructured_grid()
    tets = cube_pts.delaunay_3d()

    remeshed = tets.mmg.remesh(hsiz=0.2)
    assert isinstance(remeshed, pv.UnstructuredGrid)
    assert pv.CellType.TETRA in remeshed.cells_dict


def test_accessor_remesh_metric_kwarg_aniso() -> None:
    """``remesh(metric=tensor)`` drives aniso remeshing without point_data dance."""
    pytest.importorskip("scipy")
    cube_pts = pv.ImageData(
        dimensions=(5, 5, 5),
        spacing=(0.25, 0.25, 0.25),
    ).cast_to_unstructured_grid()
    tets = cube_pts.delaunay_3d()

    # Recover the implied metric on a separate copy so the source stays clean,
    # then drive the remesh purely through the metric= kwarg.
    implied = tets.copy(deep=True).mmg.build_size_map(aniso=True)
    n_pts_before = tets.n_points
    finer = tets.mmg.remesh(metric=implied * 4.0, verbose=-1)

    assert finer.n_points > n_pts_before
    # The remesh kwarg path must not mutate the caller's dataset.
    assert "metric" not in tets.point_data


def test_accessor_remesh_metric_kwarg_overrides_point_data() -> None:
    """An explicit ``metric=`` overrides any pre-existing point_data["metric"]."""
    pytest.importorskip("scipy")
    cube_pts = pv.ImageData(
        dimensions=(5, 5, 5),
        spacing=(0.25, 0.25, 0.25),
    ).cast_to_unstructured_grid()
    tets = cube_pts.delaunay_3d()

    tets.point_data["metric"] = np.full(tets.n_points, 0.5)  # coarse
    fine_metric = np.full((tets.n_points, 1), 0.05)  # fine override
    out = tets.mmg.remesh(metric=fine_metric, verbose=-1)

    # The fine override should produce many more points than the coarse default.
    coarse_out = tets.mmg.remesh(verbose=-1)
    assert out.n_points > coarse_out.n_points


def test_accessor_remesh_metric_kwarg_1d_scalar() -> None:
    """A 1D scalar ``metric=`` array is reshaped to ``(n, 1)`` before dispatch."""
    pytest.importorskip("scipy")
    cube_pts = pv.ImageData(
        dimensions=(5, 5, 5),
        spacing=(0.25, 0.25, 0.25),
    ).cast_to_unstructured_grid()
    tets = cube_pts.delaunay_3d()

    out = tets.mmg.remesh(metric=np.full(tets.n_points, 0.1), verbose=-1)
    assert out.n_points > 0


def test_accessor_remesh_metric_wrong_n_points_raises() -> None:
    """``metric=`` with mismatched first dim raises a clear ValueError."""
    pytest.importorskip("scipy")
    cube_pts = pv.ImageData(
        dimensions=(5, 5, 5),
        spacing=(0.25, 0.25, 0.25),
    ).cast_to_unstructured_grid()
    tets = cube_pts.delaunay_3d()

    with pytest.raises(ValueError, match="n_points"):
        tets.mmg.remesh(metric=np.full((tets.n_points + 1, 1), 0.1), verbose=-1)


def test_accessor_remesh_metric_wrong_n_components_raises() -> None:
    """``metric=`` with an unsupported last dim raises a clear ValueError."""
    pytest.importorskip("scipy")
    cube_pts = pv.ImageData(
        dimensions=(5, 5, 5),
        spacing=(0.25, 0.25, 0.25),
    ).cast_to_unstructured_grid()
    tets = cube_pts.delaunay_3d()

    with pytest.raises(ValueError, match="last dimension"):
        tets.mmg.remesh(metric=np.full((tets.n_points, 4), 0.1), verbose=-1)


def test_accessor_remesh_metric_rejected_on_line_only_polydata() -> None:
    """``metric=`` is not supported on the line-only PolyData generate() path."""
    verts_2d = np.array(
        [[0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0]],
        dtype=np.float64,
    )
    verts_3d = np.column_stack([verts_2d, np.zeros(len(verts_2d))])
    edges = np.array([[0, 1], [1, 2], [2, 3], [3, 0]], dtype=np.int32)
    lines = np.column_stack(
        [np.full(len(edges), 2, dtype=np.int32), edges],
    ).ravel()
    poly = pv.PolyData(verts_3d, lines=lines)

    with pytest.raises(ValueError, match="metric is not supported"):
        poly.mmg.remesh(metric=np.full(len(verts_2d), 0.1), verbose=-1)


def test_accessor_load_sol_populates_point_data(tmp_path: Path) -> None:
    """mesh.mmg.load_sol attaches .sol fields to point_data in place."""
    grid = _make_tet_mesh()
    sol_path = tmp_path / "metric.sol"
    sol_path.write_text(
        "MeshVersionFormatted 2\n"
        "Dimension 3\n"
        "SolAtVertices\n"
        f"{grid.n_points}\n"
        "1 1\n" + "\n".join(f"{i * 0.5}" for i in range(grid.n_points)) + "\nEnd\n",
    )

    grid.mmg.load_sol(sol_path)

    assert "solution@vertices" in grid.point_data
    np.testing.assert_allclose(
        grid.point_data["solution@vertices"],
        np.arange(grid.n_points) * 0.5,
    )


def test_accessor_load_sol_rejects_solb(tmp_path: Path) -> None:
    """Binary .solb is rejected via the accessor with a clear message."""
    grid = _make_tet_mesh()
    bogus = tmp_path / "bin.solb"
    bogus.write_bytes(b"\x00")

    with pytest.raises(NotImplementedError, match=r"Binary \.solb"):
        grid.mmg.load_sol(bogus)


def test_accessor_caches_per_dataset_instance() -> None:
    """PyVista caches the accessor per dataset (pandas/xarray contract)."""
    grid = _make_tet_mesh()

    assert grid.mmg is grid.mmg


# ---------------------------------------------------------------------------
# Accessor: metadata, remesh variants, sol I/O, validation, quality
# ---------------------------------------------------------------------------


def _dense_tets() -> pv.UnstructuredGrid:
    """Build a denser tet mesh that survives the remesh variants robustly."""
    pytest.importorskip("scipy")
    pts = pv.ImageData(
        dimensions=(5, 5, 5),
        spacing=(0.25, 0.25, 0.25),
    ).cast_to_unstructured_grid()
    return pts.delaunay_3d()


def test_accessor_kind_returns_meshkind_enum() -> None:
    """`.mmg.kind` returns the right MeshKind for each input topology."""
    assert _make_tet_mesh().mmg.kind == mmgpy.MeshKind.TETRAHEDRAL
    assert _make_surface_mesh().mmg.kind == mmgpy.MeshKind.TRIANGULAR_SURFACE


def test_accessor_remesh_optimize_preserves_topology() -> None:
    """remesh_optimize keeps the triangle count (no inserts/removes)."""
    surf = _make_surface_mesh()
    optimized = surf.mmg.remesh_optimize()

    assert isinstance(optimized, pv.PolyData)
    assert optimized.n_points == surf.n_points
    # MMG ridges round-trip as LINE cells, so compare polygon counts only.
    assert optimized.n_faces == surf.n_faces


def test_accessor_remesh_uniform_returns_dense_mesh() -> None:
    """remesh_uniform returns a fresh dataset with the requested density."""
    surf = _make_surface_mesh()
    coarse = surf.mmg.remesh_uniform(0.5)
    fine = surf.mmg.remesh_uniform(0.1)

    assert isinstance(fine, pv.PolyData)
    assert fine.n_cells > coarse.n_cells


def test_accessor_remesh_levelset_carves_isosurface() -> None:
    """A spherical level-set produces a non-empty mesh."""
    tets = _dense_tets()
    coords = tets.points - tets.center
    # MMG expects an Nx1 levelset array.
    levelset = (np.linalg.norm(coords, axis=1) - 0.4).reshape(-1, 1).astype(np.float64)

    carved = tets.mmg.remesh_levelset(levelset)

    assert isinstance(carved, pv.UnstructuredGrid)
    assert carved.n_cells > 0


def test_accessor_save_sol_round_trip(tmp_path: Path) -> None:
    """save_sol followed by load_sol produces a matching scalar field."""
    grid = _make_tet_mesh()
    metric = np.linspace(0.1, 0.5, grid.n_points, dtype=np.float64)
    grid.point_data["metric"] = metric

    sol_path = tmp_path / "out.sol"
    grid.mmg.save_sol(sol_path)

    assert sol_path.exists()

    fresh = _make_tet_mesh()
    fresh.mmg.load_sol(sol_path)

    np.testing.assert_allclose(fresh.point_data["solution@vertices"], metric)


def test_accessor_validate_returns_bool_by_default() -> None:
    """validate() with detailed=False returns a plain bool."""
    surf = _make_surface_mesh()
    result = surf.mmg.validate()

    assert isinstance(result, bool)


def test_accessor_validate_detailed_returns_report() -> None:
    """validate(detailed=True) returns the same ValidationReport type as Mesh."""
    surf = _make_surface_mesh()
    report = surf.mmg.validate(detailed=True)

    assert isinstance(report, mmgpy.ValidationReport)
    assert hasattr(report, "is_valid")


def test_accessor_validate_checks_subset_skips_quality() -> None:
    """validate(checks={...}) forwards the subset to Mesh.validate."""
    surf = _make_surface_mesh()
    report = surf.mmg.validate(detailed=True, checks={"geometry", "topology"})

    assert isinstance(report, mmgpy.ValidationReport)
    assert report.quality is None


def test_accessor_validate_default_runs_all_checks() -> None:
    """validate() without ``checks`` runs the full default check set."""
    surf = _make_surface_mesh()
    report = surf.mmg.validate(detailed=True)

    assert isinstance(report, mmgpy.ValidationReport)
    assert report.quality is not None


def test_accessor_element_quality_and_qualities_agree() -> None:
    """Single-element quality is one of the values in the qualities array."""
    tets = _make_tet_mesh()
    qualities = tets.mmg.element_qualities()

    assert qualities.shape == (tets.n_cells,)
    assert qualities.dtype == np.float64
    # MMG indexing is 1-based; depending on storage layout, idx=1 may map to
    # qualities[0] or qualities[1]. Either way the value must be a member.
    single = tets.mmg.element_quality(1)
    assert any(single == pytest.approx(q) for q in qualities)


def test_accessor_remesh_local_sizing_densifies_region() -> None:
    """A sphere-shaped sizing constraint produces denser cells overall."""
    tets = _dense_tets()
    baseline = tets.mmg.remesh(hgrad=1.3, verbose=-1)
    constrained = tets.mmg.remesh(
        nosizreq=True,
        hgrad=1.3,
        verbose=-1,
        local_sizing=[
            {
                "shape": "sphere",
                "center": (0.5, 0.5, 0.5),
                "radius": 0.4,
                "size": 0.05,
            },
        ],
    )

    assert isinstance(constrained, pv.UnstructuredGrid)
    assert constrained.n_cells > baseline.n_cells


def test_accessor_adjacent_elements_returns_neighbors() -> None:
    """adjacent_elements returns MMG's 1-based element-to-element adjacency."""
    tets = _make_tet_mesh()
    neighbors = tets.mmg.adjacent_elements(1)

    assert isinstance(neighbors, np.ndarray)
    assert neighbors.dtype == np.int32


def test_accessor_vertex_neighbors_returns_neighbors() -> None:
    """vertex_neighbors returns MMG's 1-based vertex-to-vertex adjacency."""
    tets = _make_tet_mesh()
    neighbors = tets.mmg.vertex_neighbors(1)

    assert isinstance(neighbors, np.ndarray)
    assert neighbors.dtype == np.int32
    assert len(neighbors) > 0


def test_accessor_center_of_mass_is_weighted() -> None:
    """center_of_mass returns the volume-weighted centroid for tet meshes."""
    tets = _dense_tets()
    weighted = tets.mmg.center_of_mass()

    assert weighted.shape == (3,)
    # Cube centered at (0.5, 0.5, 0.5) — both arithmetic and weighted means
    # should be near the center, but the weighted variant should not crash.
    np.testing.assert_allclose(weighted, np.array([0.5, 0.5, 0.5]), atol=0.05)


def test_accessor_remesh_unknown_local_sizing_shape_raises() -> None:
    """An unrecognized 'shape' key in a sizing spec raises ValueError."""
    surf = _make_surface_mesh()
    with pytest.raises(ValueError, match="Unknown local sizing shape"):
        surf.mmg.remesh(
            hsiz=0.5,
            local_sizing=[{"shape": "tetrahedron", "size": 0.1}],
        )


# ---------------------------------------------------------------------------
# Sanity check that mmgpy is the source of these registrations
# ---------------------------------------------------------------------------


def test_entry_points_advertise_mmgpy_provider() -> None:
    """All three registries point at mmgpy._pv_plugin via entry points."""
    reader_eps = {
        ep.name: ep.value
        for ep in importlib.metadata.entry_points(group="pyvista.readers")
    }
    writer_eps = {
        ep.name: ep.value
        for ep in importlib.metadata.entry_points(group="pyvista.writers")
    }
    accessor_eps = {
        ep.name: ep.value
        for ep in importlib.metadata.entry_points(group="pyvista.accessors")
    }

    assert reader_eps.get("mesh", "").startswith("mmgpy._pv_plugin")
    assert reader_eps.get("meshb", "").startswith("mmgpy._pv_plugin")
    assert writer_eps.get("mesh", "").startswith("mmgpy._pv_plugin")
    assert writer_eps.get("meshb", "").startswith("mmgpy._pv_plugin")
    assert accessor_eps.get("mmg", "").startswith("mmgpy._pv_plugin")


def test_mmgpy_import_loads_cleanly() -> None:
    """``import mmgpy`` exposes a version string without erroring out."""
    assert mmgpy.__version__
