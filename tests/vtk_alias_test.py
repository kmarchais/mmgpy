"""Auto-detect VTK / VTU solution arrays (``:metric``, ``:ls``) on import.

MMG's VTK reader uses substring matching on point_data names to populate
solution slots (see ``mmg-src/src/common/vtkparser.cpp``). ``from_pyvista``
mirrors that behaviour so a ``.vtu`` produced by stand-alone MMG can be
round-tripped through PyVista without manually re-assigning fields.
"""

from __future__ import annotations

import logging

import numpy as np
import pytest
import pyvista as pv

from mmgpy import from_pyvista
from mmgpy._mmgpy import MmgMesh2D, MmgMesh3D, MmgMeshS


@pytest.fixture
def tetra_grid() -> pv.UnstructuredGrid:
    """Two-tetra UnstructuredGrid for 3D conversion tests."""
    vertices = np.array(
        [
            [0.0, 0.0, 0.0],
            [1.0, 0.0, 0.0],
            [0.5, 1.0, 0.0],
            [0.5, 0.5, 1.0],
            [1.0, 1.0, 0.0],
            [1.0, 0.5, 1.0],
        ],
        dtype=np.float64,
    )
    cells = np.array([[0, 1, 2, 3], [1, 4, 2, 5]], dtype=np.int32)
    return pv.UnstructuredGrid({pv.CellType.TETRA: cells}, vertices)


@pytest.fixture
def triangle_polydata_2d() -> pv.PolyData:
    """Planar PolyData (z=0) for MmgMesh2D conversion tests."""
    vertices = np.array(
        [
            [0.0, 0.0, 0.0],
            [1.0, 0.0, 0.0],
            [1.0, 1.0, 0.0],
            [0.0, 1.0, 0.0],
        ],
        dtype=np.float64,
    )
    faces = np.array([3, 0, 1, 2, 3, 0, 2, 3])
    return pv.PolyData(vertices, faces=faces)


@pytest.fixture
def triangle_polydata_3d() -> pv.PolyData:
    """Non-planar PolyData for MmgMeshS conversion tests."""
    vertices = np.array(
        [
            [0.0, 0.0, 0.0],
            [1.0, 0.0, 0.0],
            [0.5, 1.0, 0.0],
            [0.5, 0.5, 1.0],
        ],
        dtype=np.float64,
    )
    faces = np.array([3, 0, 1, 2, 3, 0, 1, 3, 3, 1, 2, 3, 3, 0, 2, 3])
    return pv.PolyData(vertices, faces=faces)


class TestMetricAlias:
    """``point_data[*:metric]`` should populate ``mesh["metric"]``."""

    def test_unstructured_grid_metric(self, tetra_grid: pv.UnstructuredGrid) -> None:
        """``sol:metric`` on an UnstructuredGrid routes to ``mesh["metric"]``."""
        sizes = np.linspace(0.1, 0.4, tetra_grid.n_points)
        tetra_grid.point_data["sol:metric"] = sizes

        mesh = from_pyvista(tetra_grid)

        assert isinstance(mesh, MmgMesh3D)
        np.testing.assert_array_almost_equal(
            mesh["metric"].reshape(-1),
            sizes,
        )

    def test_polydata_2d_metric(
        self,
        triangle_polydata_2d: pv.PolyData,
    ) -> None:
        """Hint matching works for 2D PolyData inputs."""
        sizes = np.linspace(0.05, 0.2, triangle_polydata_2d.n_points)
        triangle_polydata_2d.point_data["mymesh:metric"] = sizes

        mesh = from_pyvista(triangle_polydata_2d)

        assert isinstance(mesh, MmgMesh2D)
        np.testing.assert_array_almost_equal(
            mesh["metric"].reshape(-1),
            sizes,
        )

    def test_polydata_3d_metric(
        self,
        triangle_polydata_3d: pv.PolyData,
    ) -> None:
        """Hint matching works for surface PolyData inputs."""
        sizes = np.full(triangle_polydata_3d.n_points, 0.1)
        triangle_polydata_3d.point_data["foo:metric:0"] = sizes

        mesh = from_pyvista(triangle_polydata_3d)

        assert isinstance(mesh, MmgMeshS)
        np.testing.assert_array_almost_equal(
            mesh["metric"].reshape(-1),
            sizes,
        )


class TestLevelsetAlias:
    """``point_data[*:ls]`` should populate ``mesh["levelset"]``."""

    def test_unstructured_grid_levelset(
        self,
        tetra_grid: pv.UnstructuredGrid,
    ) -> None:
        """``foo:ls`` routes to ``mesh["levelset"]``."""
        values = np.linspace(-1.0, 1.0, tetra_grid.n_points)
        tetra_grid.point_data["foo:ls"] = values

        mesh = from_pyvista(tetra_grid)

        np.testing.assert_array_almost_equal(
            mesh["levelset"].reshape(-1),
            values,
        )

    def test_polydata_2d_levelset(
        self,
        triangle_polydata_2d: pv.PolyData,
    ) -> None:
        """Hint matching populates levelset on a 2D PolyData."""
        values = np.array([-0.5, 0.5, 0.5, -0.5], dtype=np.float64)
        triangle_polydata_2d.point_data["sol:ls"] = values

        mesh = from_pyvista(triangle_polydata_2d)

        np.testing.assert_array_almost_equal(
            mesh["levelset"].reshape(-1),
            values,
        )


class TestMultipleHints:
    """Both metric and levelset coexist; first match wins on duplicates."""

    def test_metric_and_levelset_together(
        self,
        tetra_grid: pv.UnstructuredGrid,
    ) -> None:
        """Both slots populate independently when both hints are present."""
        metric = np.full(tetra_grid.n_points, 0.2)
        ls = np.linspace(-1.0, 1.0, tetra_grid.n_points)
        tetra_grid.point_data["sol:metric"] = metric
        tetra_grid.point_data["sol:ls"] = ls

        mesh = from_pyvista(tetra_grid)

        np.testing.assert_array_almost_equal(mesh["metric"].reshape(-1), metric)
        np.testing.assert_array_almost_equal(mesh["levelset"].reshape(-1), ls)

    def test_first_metric_match_wins(
        self,
        tetra_grid: pv.UnstructuredGrid,
    ) -> None:
        """When multiple arrays match a hint, the first key wins."""
        first = np.full(tetra_grid.n_points, 0.1)
        second = np.full(tetra_grid.n_points, 0.5)
        tetra_grid.point_data["a:metric"] = first
        tetra_grid.point_data["b:metric"] = second

        mesh = from_pyvista(tetra_grid)

        np.testing.assert_array_almost_equal(mesh["metric"].reshape(-1), first)


class TestExplicitOverride:
    """Caller can still override the auto-populated slot after conversion."""

    def test_explicit_metric_after_conversion(
        self,
        tetra_grid: pv.UnstructuredGrid,
    ) -> None:
        """An explicit assignment overrides the auto-populated value."""
        auto = np.full(tetra_grid.n_points, 0.2)
        explicit = np.full(tetra_grid.n_points, 0.05)
        tetra_grid.point_data["sol:metric"] = auto

        mesh = from_pyvista(tetra_grid)
        mesh["metric"] = explicit.reshape(-1, 1)

        np.testing.assert_array_almost_equal(
            mesh["metric"].reshape(-1),
            explicit,
        )


class TestNoMatch:
    """Arrays whose names do not contain ``:metric`` or ``:ls`` are ignored."""

    def test_ref_field_does_not_match(
        self,
        tetra_grid: pv.UnstructuredGrid,
    ) -> None:
        """``medit:ref`` does not contain ``:metric`` or ``:ls`` and is ignored."""
        sentinel = np.arange(tetra_grid.n_points, dtype=np.float64)
        tetra_grid.point_data["medit:ref"] = sentinel

        mesh = from_pyvista(tetra_grid)
        explicit = np.full(tetra_grid.n_points, 0.3)
        mesh["metric"] = explicit.reshape(-1, 1)

        np.testing.assert_array_almost_equal(
            mesh["metric"].reshape(-1),
            explicit,
        )

    def test_no_point_data(self, tetra_grid: pv.UnstructuredGrid) -> None:
        """Conversion with empty point_data does not raise."""
        from_pyvista(tetra_grid)


class TestSizeMismatch:
    """Bad-shape point_data is skipped with a warning, not a hard error."""

    def test_wrong_inner_dim_emits_warning(
        self,
        tetra_grid: pv.UnstructuredGrid,
        caplog: pytest.LogCaptureFixture,
    ) -> None:
        """An (N, k) array with unsupported ``k`` is logged and skipped."""
        # MmgMesh3D["metric"] accepts (N, 1) or (N, 6); (N, 7) is rejected by
        # the C++ setter, which is exactly the runtime path we want to cover.
        bogus = np.zeros((tetra_grid.n_points, 7), dtype=np.float64)
        tetra_grid.point_data["sol:metric"] = bogus

        with caplog.at_level(logging.WARNING, logger="mmgpy"):
            mesh = from_pyvista(tetra_grid)

        assert "sol:metric" in caplog.text
        assert "metric" in caplog.text
        # Slot remained at its default (N, 1) instead of being overwritten.
        assert mesh["metric"].shape == (tetra_grid.n_points, 1)
