"""Tests for ``build_size_map`` and ``clean_iso_surface`` bindings.

``build_size_map`` wraps MMG's ``doSol`` entry point (isotropic size map
from mean incident edge length). ``clean_iso_surface`` wraps
``MMG{3D,S}_Clean_isoSurf`` (no 2D equivalent).
"""

from __future__ import annotations

import numpy as np
import pytest
import pyvista as pv

import mmgpy  # noqa: F401  -- registers the .mmg accessor
from mmgpy._mesh import Mesh
from mmgpy._mmgpy import MmgMesh2D, MmgMesh3D, MmgMeshS


class TestBuildSizeMap3D:
    """Tests for ``MmgMesh3D.build_size_map``."""

    def test_returns_per_vertex_sizes(
        self,
        cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Returned array has one positive, finite size per vertex."""
        vertices, elements = cube_mesh
        mesh = MmgMesh3D(vertices, elements)

        sizes = mesh.build_size_map()

        assert sizes.shape == (len(vertices), 1)
        assert sizes.dtype == np.float64
        assert np.all(np.isfinite(sizes))
        assert np.all(sizes > 0)

    def test_sizes_match_average_edge_length(
        self,
        cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Sizes should be in the same ballpark as the mean incident edge."""
        vertices, elements = cube_mesh
        mesh = MmgMesh3D(vertices, elements)

        sizes = mesh.build_size_map().ravel()

        # Compute mean incident edge length per vertex for the same mesh.
        edge_pairs: list[tuple[int, int]] = []
        for tet in elements:
            edge_pairs.extend(
                (tet[i], tet[j]) for i in range(4) for j in range(i + 1, 4)
            )
        edges = np.array(edge_pairs)
        lengths = np.linalg.norm(vertices[edges[:, 0]] - vertices[edges[:, 1]], axis=1)

        expected = np.zeros(len(vertices))
        counts = np.zeros(len(vertices))
        for (a, b), length in zip(edges, lengths, strict=True):
            expected[a] += length
            expected[b] += length
            counts[a] += 1
            counts[b] += 1
        expected /= np.maximum(counts, 1)

        # MMG truncates / clamps with hmin / hmax bookkeeping, so we only
        # assert the same order of magnitude rather than equality.
        assert np.allclose(sizes, expected, rtol=0.5)

    def test_populates_metric_channel(
        self,
        cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """The returned sizes are also written to the mesh metric channel."""
        vertices, elements = cube_mesh
        mesh = MmgMesh3D(vertices, elements)

        sizes = mesh.build_size_map()
        metric = mesh.get_field("metric")

        np.testing.assert_array_equal(sizes, metric)


class TestBuildSizeMap2D:
    """Tests for ``MmgMesh2D.build_size_map``."""

    def test_returns_per_vertex_sizes(
        self,
        square_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Returned array has one positive, finite size per vertex."""
        vertices, triangles = square_mesh
        mesh = MmgMesh2D(vertices, triangles)

        sizes = mesh.build_size_map()

        assert sizes.shape == (len(vertices), 1)
        assert np.all(np.isfinite(sizes))
        assert np.all(sizes > 0)


class TestBuildSizeMapSurface:
    """Tests for ``MmgMeshS.build_size_map``."""

    def test_returns_per_vertex_sizes(
        self,
        tetrahedron_surface_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Returned array has one positive, finite size per vertex."""
        vertices, triangles = tetrahedron_surface_mesh
        mesh = MmgMeshS(vertices, triangles)

        sizes = mesh.build_size_map()

        assert sizes.shape == (len(vertices), 1)
        assert np.all(np.isfinite(sizes))
        assert np.all(sizes > 0)


class TestCleanIsoSurface3D:
    """Tests for ``MmgMesh3D.clean_iso_surface``."""

    def test_runs_on_clean_mesh(
        self,
        dense_3d_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """No-op on a mesh with no level-set artifacts — should just succeed."""
        vertices, elements = dense_3d_mesh
        mesh = MmgMesh3D(vertices, elements)

        mesh.clean_iso_surface()

        assert mesh.get_vertices().shape[0] > 0

    def test_after_levelset_discretization(
        self,
        dense_3d_mesh_fine: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """After a level-set remesh, cleaning should leave a valid mesh."""
        vertices, elements = dense_3d_mesh_fine
        mesh = MmgMesh3D(vertices, elements)

        center = np.array([0.5, 0.5, 0.5])
        radius = 0.3
        levelset = (np.linalg.norm(vertices - center, axis=1) - radius).reshape(-1, 1)
        mesh.remesh_levelset(levelset, hmax=0.15, verbose=False)

        n_tri_before = mesh.get_triangles().shape[0]
        mesh.clean_iso_surface()
        n_tri_after = mesh.get_triangles().shape[0]

        # Clean_isoSurf may only drop triangles, never add them.
        assert n_tri_after <= n_tri_before


class TestCleanIsoSurfaceSurface:
    """Tests for ``MmgMeshS.clean_iso_surface``."""

    def test_runs_on_clean_mesh(
        self,
        tetrahedron_surface_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """No-op on a mesh with no level-set artifacts — should just succeed."""
        vertices, triangles = tetrahedron_surface_mesh
        mesh = MmgMeshS(vertices, triangles)

        mesh.clean_iso_surface()

        assert mesh.get_vertices().shape[0] > 0


class TestMeshWrapper:
    """Tests for the high-level :class:`mmgpy.Mesh` shims."""

    def test_build_size_map_3d(
        self,
        cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """High-level wrapper forwards ``build_size_map`` to the C++ impl."""
        vertices, elements = cube_mesh
        mesh = Mesh(vertices, elements)

        sizes = mesh.build_size_map()

        assert sizes.shape == (len(vertices), 1)
        assert np.all(sizes > 0)

    def test_clean_iso_surface_rejects_2d(
        self,
        square_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """MMG2D has no Clean_isoSurf entry point — the wrapper rejects 2D."""
        vertices, triangles = square_mesh
        mesh = Mesh(vertices, triangles)

        with pytest.raises(ValueError, match="not available for TRIANGULAR_2D"):
            mesh.clean_iso_surface()


class TestPyVistaAccessor:
    """Tests for the ``dataset.mmg`` accessor surface."""

    def test_build_size_map_populates_point_data(
        self,
        cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Accessor variant stores the result on the dataset as ``metric``."""
        vertices, elements = cube_mesh
        ug = pv.UnstructuredGrid(
            np.column_stack([np.full(len(elements), 4), elements]).ravel(),
            np.full(len(elements), pv.CellType.TETRA, dtype=np.uint8),
            vertices,
        )

        sizes = ug.mmg.build_size_map()

        assert sizes.shape == (ug.n_points, 1)
        np.testing.assert_allclose(
            ug.point_data["metric"],
            sizes.ravel(),
        )

    def test_clean_iso_surface_returns_fresh_dataset(
        self,
        cube_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Accessor returns a new dataset; the input is not modified."""
        vertices, elements = cube_mesh
        ug = pv.UnstructuredGrid(
            np.column_stack([np.full(len(elements), 4), elements]).ravel(),
            np.full(len(elements), pv.CellType.TETRA, dtype=np.uint8),
            vertices,
        )

        cleaned = ug.mmg.clean_iso_surface()

        assert cleaned is not ug
        assert cleaned.n_points > 0
