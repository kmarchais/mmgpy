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


def test_accessor_remesh_on_tetrahedral_mesh(tmp_path: Path) -> None:
    """The accessor handles tet inputs and returns UnstructuredGrid."""
    pytest.importorskip("scipy")
    cube_pts = pv.ImageData(
        dimensions=(5, 5, 5),
        spacing=(0.25, 0.25, 0.25),
    ).cast_to_unstructured_grid()
    tets = cube_pts.delaunay_3d()
    out = tmp_path / "dense.vtu"
    tets.save(str(out))

    remeshed = tets.mmg.remesh(hsiz=0.2)
    assert isinstance(remeshed, pv.UnstructuredGrid)
    assert pv.CellType.TETRA in remeshed.cells_dict


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
