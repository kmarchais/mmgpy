"""Tests for multi-block .sol I/O (PR #8 / gap #02).

Covers:

* C++ bindings ``MmgMesh{3D,2D,S}.{load,save}_all_sols`` round-trip vertex
  blocks (scalar, vector, tensor) through MMG's text format.
* ``Mesh.{load,save}_all_sols`` translates between the explicit tuple form
  the bindings expose and a more ergonomic dict keyed by positional names.
* ``dataset.mmg.{load,save}_all_sols`` collects point_data + cell_data,
  writes a single multi-block file, and reads it back into the matching
  ``point_data`` / ``cell_data`` slots.
* Binary ``.solb`` is explicitly unsupported here because MMG itself emits
  stray newlines in its binary writer (even the existing single-channel
  ``.solb`` round-trip is broken at the library level).
"""

from __future__ import annotations

from pathlib import Path
from typing import TYPE_CHECKING

import numpy as np
import pytest
import pyvista as pv

from mmgpy._io import _read_mesh_internal
from mmgpy._mmgpy import MmgMesh2D, MmgMesh3D, MmgMeshS

if TYPE_CHECKING:
    from numpy.typing import NDArray


_RNG = np.random.default_rng(0)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _make_3d_impl() -> MmgMesh3D:
    """Return a 2-tet mesh via the raw C++ bindings."""
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
    elements = np.array([[0, 1, 2, 3], [1, 2, 3, 4]], dtype=np.int32)
    return MmgMesh3D(vertices, elements)


def _make_2d_impl() -> MmgMesh2D:
    vertices = np.array(
        [[0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0]],
        dtype=np.float64,
    )
    triangles = np.array([[0, 1, 2], [0, 2, 3]], dtype=np.int32)
    return MmgMesh2D(vertices, triangles)


def _make_s_impl() -> MmgMeshS:
    vertices = np.array(
        [
            [0.0, 0.0, 0.0],
            [1.0, 0.0, 0.0],
            [0.5, 1.0, 0.0],
            [0.5, 0.5, 1.0],
        ],
        dtype=np.float64,
    )
    triangles = np.array([[0, 1, 2], [0, 1, 3], [1, 2, 3], [0, 2, 3]], dtype=np.int32)
    return MmgMeshS(vertices, triangles)


def _tet_pv_dataset() -> pv.UnstructuredGrid:
    """Build a small unit-cube tet mesh via PyVista delaunay."""
    pts = np.array(
        [
            [0.0, 0.0, 0.0],
            [1.0, 0.0, 0.0],
            [0.0, 1.0, 0.0],
            [0.0, 0.0, 1.0],
            [1.0, 1.0, 0.0],
            [1.0, 0.0, 1.0],
            [0.0, 1.0, 1.0],
            [1.0, 1.0, 1.0],
        ],
        dtype=np.float64,
    )
    return pv.PolyData(pts).delaunay_3d()


# ---------------------------------------------------------------------------
# C++ binding round-trip (low-level)
# ---------------------------------------------------------------------------


@pytest.mark.parametrize(
    ("make_impl", "dim", "include_vector"),
    [
        (_make_3d_impl, 3, True),
        # MMG2D_Set_vectorSols / Get_vectorSols are off by one row vs the rest
        # of the multi-sol API (they index ``met->m[j..j+1]`` while every other
        # MMG entry point uses ``met->m[j+size..j+2*size-1]``). The round-trip
        # is broken at the library level, so the 2D vector slot is skipped
        # here. Re-enable once MMG fixes the upstream divergence.
        (_make_2d_impl, 2, False),
        (_make_s_impl, 3, True),
    ],
    ids=["mmg3d", "mmg2d", "mmgs"],
)
def test_cpp_binding_roundtrips_scalar_vector_tensor(
    make_impl,
    dim: int,
    include_vector: bool,  # noqa: FBT001  -- parametrized fixture, not a flag
    tmp_path: Path,
) -> None:
    """C++ bindings round-trip every supported sol type for the mesh kind."""
    impl = make_impl()
    n_pts = impl.get_mesh_size()[0]
    tensor_size = dim * (dim + 1) // 2
    scalar: NDArray[np.float64] = _RNG.standard_normal(n_pts).astype(np.float64)
    tensor: NDArray[np.float64] = _RNG.standard_normal((n_pts, tensor_size)).astype(
        np.float64,
    )

    entries: list[tuple[int, NDArray[np.float64]]] = [(1, scalar)]
    if include_vector:
        vector = _RNG.standard_normal((n_pts, dim)).astype(np.float64)
        entries.append((2, vector))
    entries.append((3, tensor))

    path = tmp_path / "multi.sol"
    impl.save_all_sols(path, entries)
    loaded = impl.load_all_sols(path)

    assert [t for t, _ in loaded] == [t for t, _ in entries]
    for (_, expected), (_, actual) in zip(entries, loaded, strict=True):
        np.testing.assert_array_almost_equal(actual, expected)


def test_cpp_binding_rejects_wrong_row_count(tmp_path: Path) -> None:
    """Saving an array with too few rows raises a clear ValueError."""
    impl = _make_3d_impl()
    bad = _RNG.standard_normal(impl.get_mesh_size()[0] - 1)
    with pytest.raises(ValueError, match="match vertex count"):
        impl.save_all_sols(tmp_path / "bad.sol", [(1, bad)])


def test_cpp_binding_rejects_wrong_column_count(tmp_path: Path) -> None:
    """Saving a tensor with the wrong width raises a clear ValueError."""
    impl = _make_3d_impl()
    bad = _RNG.standard_normal((impl.get_mesh_size()[0], 5))
    with pytest.raises(ValueError, match="expects 6 components"):
        impl.save_all_sols(tmp_path / "bad.sol", [(3, bad)])


# ---------------------------------------------------------------------------
# Mesh-level wrapper
# ---------------------------------------------------------------------------


def test_mesh_save_load_roundtrip_with_positional_names(tmp_path: Path) -> None:
    """Mesh.save/load_all_sols regenerates positional names on read."""
    grid = _tet_pv_dataset()
    mesh = _read_mesh_internal(grid)
    scalar = _RNG.standard_normal(grid.n_points)
    vector = _RNG.standard_normal((grid.n_points, 3))

    path = tmp_path / "named.sol"
    mesh.save_all_sols(path, {"density": scalar, "velocity": vector})

    out = mesh.load_all_sols(path)

    assert list(out) == ["solution_0", "vector_0"]
    np.testing.assert_array_almost_equal(out["solution_0"], scalar)
    np.testing.assert_array_almost_equal(out["vector_0"], vector)


def test_mesh_save_rejects_solb(tmp_path: Path) -> None:
    """Mesh-level writer refuses .solb (MMG library bug)."""
    mesh = _read_mesh_internal(_tet_pv_dataset())
    with pytest.raises(NotImplementedError, match="\\.solb"):
        mesh.save_all_sols(
            tmp_path / "x.solb",
            {"f": np.zeros(mesh._impl.get_mesh_size()[0])},
        )


def test_mesh_load_rejects_solb(tmp_path: Path) -> None:
    """Mesh-level reader refuses .solb (MMG library bug)."""
    mesh = _read_mesh_internal(_tet_pv_dataset())
    with pytest.raises(NotImplementedError, match="\\.solb"):
        mesh.load_all_sols(tmp_path / "x.solb")


def test_mesh_save_rejects_empty(tmp_path: Path) -> None:
    """Saving an empty arrays dict surfaces a clear error message."""
    mesh = _read_mesh_internal(_tet_pv_dataset())
    with pytest.raises(ValueError, match="at least one block"):
        mesh.save_all_sols(tmp_path / "x.sol", {})


# ---------------------------------------------------------------------------
# PyVista accessor (high-level)
# ---------------------------------------------------------------------------


def test_accessor_save_load_combines_point_and_cell_data(tmp_path: Path) -> None:
    """Accessor round-trip preserves point_data + cell_data through one .sol."""
    grid = _tet_pv_dataset()
    grid.point_data["scalar_field"] = np.arange(grid.n_points, dtype=np.float64)
    grid.point_data["vec3_field"] = _RNG.standard_normal((grid.n_points, 3))
    grid.cell_data["cell_scalar"] = np.arange(grid.n_cells, dtype=np.float64)

    path = tmp_path / "combined.sol"
    grid.mmg.save_all_sols(path)

    fresh = grid.copy(deep=True)
    for key in list(fresh.point_data.keys()):
        del fresh.point_data[key]
    for key in list(fresh.cell_data.keys()):
        del fresh.cell_data[key]
    fresh.mmg.load_all_sols(path)

    np.testing.assert_array_equal(
        fresh.point_data["solution_0@vertices"],
        grid.point_data["scalar_field"],
    )
    np.testing.assert_array_almost_equal(
        fresh.point_data["vector_1@vertices"],
        grid.point_data["vec3_field"],
    )
    np.testing.assert_array_equal(
        fresh.cell_data["solution@tetrahedra"],
        grid.cell_data["cell_scalar"],
    )


def test_accessor_save_respects_explicit_point_keys(tmp_path: Path) -> None:
    """``point_keys`` restricts the write to the requested point_data arrays."""
    grid = _tet_pv_dataset()
    grid.point_data["keep"] = np.arange(grid.n_points, dtype=np.float64)
    grid.point_data["drop"] = np.full(grid.n_points, -1.0)

    path = tmp_path / "selected.sol"
    grid.mmg.save_all_sols(path, point_keys=["keep"])

    fresh = grid.copy(deep=True)
    for key in list(fresh.point_data.keys()):
        del fresh.point_data[key]
    fresh.mmg.load_all_sols(path)

    # Single-block writes round-trip back through the parser as the un-indexed
    # ``solution@vertices`` name (the parser only adds positional indices when
    # the file holds 2+ blocks).
    assert "solution@vertices" in fresh.point_data
    assert all(not np.allclose(fresh.point_data[k], -1.0) for k in fresh.point_data)


def test_accessor_save_skips_reserved_mmg_tags(tmp_path: Path) -> None:
    """Auto-collect drops ``mmg_*`` constraint tags from both point/cell data."""
    grid = _tet_pv_dataset()
    grid.point_data["density"] = np.arange(grid.n_points, dtype=np.float64)
    grid.point_data["mmg_required_vertices"] = np.zeros(grid.n_points, dtype=bool)
    grid.cell_data["mmg_required_tetrahedra"] = np.zeros(grid.n_cells, dtype=bool)

    path = tmp_path / "filtered.sol"
    grid.mmg.save_all_sols(path)

    fresh = grid.copy(deep=True)
    for key in list(fresh.point_data.keys()):
        del fresh.point_data[key]
    for key in list(fresh.cell_data.keys()):
        del fresh.cell_data[key]
    fresh.mmg.load_all_sols(path)

    # Single block → un-indexed name from the parser.
    assert "solution@vertices" in fresh.point_data
    # mmg_* tags are constraint markers, not solutions: they should be skipped.
    assert not any(k.startswith("mmg_") for k in fresh.point_data)
    assert not any(k.startswith("mmg_") for k in fresh.cell_data)


def test_accessor_save_explicit_keys_raise_on_missing(tmp_path: Path) -> None:
    """Explicit ``point_keys`` should not silently drop a missing entry."""
    grid = _tet_pv_dataset()
    grid.point_data["present"] = np.arange(grid.n_points, dtype=np.float64)
    with pytest.raises(ValueError, match="not found"):
        grid.mmg.save_all_sols(tmp_path / "x.sol", point_keys=["missing"])


def test_accessor_save_solb_raises(tmp_path: Path) -> None:
    """Accessor writer refuses .solb due to the upstream MMG bug."""
    grid = _tet_pv_dataset()
    grid.point_data["scalar"] = np.arange(grid.n_points, dtype=np.float64)
    with pytest.raises(NotImplementedError, match="\\.solb"):
        grid.mmg.save_all_sols(tmp_path / "x.solb")


def test_accessor_load_solb_raises(tmp_path: Path) -> None:
    """Accessor reader refuses .solb due to the upstream MMG bug."""
    grid = _tet_pv_dataset()
    with pytest.raises(NotImplementedError, match="\\.solb"):
        grid.mmg.load_all_sols(tmp_path / "x.solb")


def test_accessor_save_no_eligible_arrays_raises(tmp_path: Path) -> None:
    """When only reserved tags exist, the accessor refuses to write an empty file."""
    grid = _tet_pv_dataset()
    grid.point_data["mmg_required_vertices"] = np.zeros(grid.n_points, dtype=bool)
    with pytest.raises(ValueError, match="no eligible"):
        grid.mmg.save_all_sols(tmp_path / "x.sol")


def test_accessor_roundtrip_surface_mesh(tmp_path: Path) -> None:
    """Surface mesh round-trip survives the same accessor path as 3D tets."""
    surf = pv.Cube().triangulate()
    n_pts = surf.n_points
    surf.point_data["temperature"] = _RNG.standard_normal(n_pts)

    path = tmp_path / "surf.sol"
    surf.mmg.save_all_sols(path, point_keys=["temperature"])

    fresh = surf.copy(deep=True)
    for key in list(fresh.point_data.keys()):
        del fresh.point_data[key]
    fresh.mmg.load_all_sols(path)
    np.testing.assert_array_almost_equal(
        fresh.point_data["solution@vertices"],
        surf.point_data["temperature"],
    )


def test_accessor_roundtrip_2d_mesh(tmp_path: Path) -> None:
    """2D mesh round-trip uses the dim=2 helper for shape inference."""
    pts = np.array(
        [[0.0, 0.0, 0.0], [1.0, 0.0, 0.0], [1.0, 1.0, 0.0], [0.0, 1.0, 0.0]],
        dtype=np.float64,
    )
    tris = np.hstack([[3, 0, 1, 2], [3, 0, 2, 3]]).astype(np.int32)
    poly = pv.PolyData(pts, tris)
    poly.point_data["heat"] = np.arange(poly.n_points, dtype=np.float64)

    path = tmp_path / "two_d.sol"
    poly.mmg.save_all_sols(path)

    fresh = poly.copy(deep=True)
    for key in list(fresh.point_data.keys()):
        del fresh.point_data[key]
    fresh.mmg.load_all_sols(path)
    np.testing.assert_array_almost_equal(
        fresh.point_data["solution@vertices"],
        poly.point_data["heat"],
    )
