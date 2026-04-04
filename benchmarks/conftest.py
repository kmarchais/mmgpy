"""Shared fixtures and configuration for mmgpy benchmarks."""

from __future__ import annotations

from pathlib import Path
from tempfile import TemporaryDirectory
from typing import TYPE_CHECKING

import numpy as np
import pytest
import pyvista as pv

from mmgpy._mmgpy import MmgMesh3D

if TYPE_CHECKING:
    from collections.abc import Generator

    from numpy.typing import NDArray


def _generate_cube_mesh_3d(
    n_cells_per_edge: int,
) -> tuple[NDArray[np.float64], NDArray[np.int32]]:
    """Generate a regular tetrahedral cube mesh (vectorized).

    Args:
        n_cells_per_edge: Number of cells along each edge.

    Returns:
        Tuple of (vertices, tetrahedra).

    """
    n = n_cells_per_edge + 1
    x = np.linspace(0, 1, n, dtype=np.float64)
    xx, yy, zz = np.meshgrid(x, x, x, indexing="ij")
    vertices = np.column_stack([xx.ravel(), yy.ravel(), zz.ravel()])

    # Vectorized tetrahedra connectivity: 5 tets per hex cell
    i, j, k = np.mgrid[:n_cells_per_edge, :n_cells_per_edge, :n_cells_per_edge]
    v0 = (i * n * n + j * n + k).ravel()
    v1 = v0 + 1
    v2 = v0 + n
    v3 = v0 + n + 1
    v4 = v0 + n * n
    v5 = v4 + 1
    v6 = v4 + n
    v7 = v4 + n + 1

    tetrahedra = np.column_stack(
        [
            v0,
            v1,
            v3,
            v5,
            v0,
            v3,
            v2,
            v6,
            v0,
            v5,
            v4,
            v6,
            v3,
            v5,
            v6,
            v7,
            v0,
            v3,
            v5,
            v6,
        ],
    ).reshape(-1, 4)

    return vertices, tetrahedra.astype(np.int32)


def _generate_square_mesh_2d(
    n_cells_per_edge: int,
) -> tuple[NDArray[np.float64], NDArray[np.int32]]:
    """Generate a regular triangular 2D mesh (vectorized).

    Args:
        n_cells_per_edge: Number of cells along each edge.

    Returns:
        Tuple of (vertices, triangles).

    """
    n = n_cells_per_edge + 1
    x = np.linspace(0, 1, n, dtype=np.float64)
    xx, yy = np.meshgrid(x, x, indexing="ij")
    vertices = np.column_stack([xx.ravel(), yy.ravel()])

    # Vectorized triangle connectivity: 2 triangles per quad cell
    i, j = np.mgrid[:n_cells_per_edge, :n_cells_per_edge]
    v0 = (i * n + j).ravel()
    v1 = v0 + 1
    v2 = v0 + n
    v3 = v0 + n + 1

    triangles = np.column_stack(
        [
            v0,
            v1,
            v3,
            v0,
            v3,
            v2,
        ],
    ).reshape(-1, 3)

    return vertices, triangles.astype(np.int32)


def _generate_sphere_surface(
    n_subdivisions: int = 3,
) -> tuple[NDArray[np.float64], NDArray[np.int32]]:
    """Generate a triangulated sphere surface mesh.

    Args:
        n_subdivisions: Number of subdivisions for icosahedron.

    Returns:
        Tuple of (vertices, triangles).

    """
    sphere = pv.Icosphere(radius=1.0, nsub=n_subdivisions)
    vertices = np.asarray(sphere.points, dtype=np.float64)
    faces = sphere.faces.reshape(-1, 4)[:, 1:4]
    triangles = np.asarray(faces, dtype=np.int32)
    return vertices, triangles


# -- Medium fixtures (used by Tier 1 operations benchmarks) ------------------


@pytest.fixture(scope="session")
def mesh_3d_medium() -> tuple[NDArray[np.float64], NDArray[np.int32]]:
    """Medium 3D mesh (~16,875 elements)."""
    return _generate_cube_mesh_3d(n_cells_per_edge=15)


@pytest.fixture(scope="session")
def mesh_2d_medium() -> tuple[NDArray[np.float64], NDArray[np.int32]]:
    """Medium 2D mesh (~20,000 elements)."""
    return _generate_square_mesh_2d(n_cells_per_edge=100)


@pytest.fixture(scope="session")
def mesh_surface_medium() -> tuple[NDArray[np.float64], NDArray[np.int32]]:
    """Medium surface mesh (~20,480 elements)."""
    return _generate_sphere_surface(n_subdivisions=5)


# -- Large fixtures (used by Tier 2 remesh isolation benchmarks) -------------


@pytest.fixture(scope="session")
def mesh_3d_large() -> tuple[NDArray[np.float64], NDArray[np.int32]]:
    """Large 3D mesh (~40,000 elements)."""
    return _generate_cube_mesh_3d(n_cells_per_edge=20)


@pytest.fixture(scope="session")
def mesh_2d_large() -> tuple[NDArray[np.float64], NDArray[np.int32]]:
    """Large 2D mesh (~320,000 elements)."""
    return _generate_square_mesh_2d(n_cells_per_edge=400)


@pytest.fixture(scope="session")
def mesh_surface_large() -> tuple[NDArray[np.float64], NDArray[np.int32]]:
    """Large surface mesh (~327,680 elements)."""
    return _generate_sphere_surface(n_subdivisions=7)


# -- Derived fixtures for Tier 1 operations benchmarks -----------------------


@pytest.fixture(scope="session")
def mesh_file_3d_medium(
    mesh_3d_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
    tmp_path_factory: pytest.TempPathFactory,
) -> Path:
    """Pre-written medium 3D mesh file for I/O benchmarks."""
    vertices, tetrahedra = mesh_3d_medium
    mesh = MmgMesh3D(vertices, tetrahedra)
    path = tmp_path_factory.mktemp("bench") / "medium_3d.mesh"
    mesh.save(str(path))
    return path


@pytest.fixture(scope="session")
def pyvista_tetra_grid_medium(
    mesh_3d_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
) -> pv.UnstructuredGrid:
    """PyVista UnstructuredGrid for conversion benchmarks."""
    vertices, tetrahedra = mesh_3d_medium
    return pv.UnstructuredGrid({pv.CellType.TETRA: tetrahedra}, vertices)


@pytest.fixture
def tmp_mesh_dir() -> Generator[Path, None, None]:
    """Provide a temporary directory for mesh I/O benchmarks."""
    with TemporaryDirectory() as tmpdir:
        yield Path(tmpdir)
