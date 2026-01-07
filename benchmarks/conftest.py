"""Shared fixtures and configuration for mmgpy benchmarks."""

from __future__ import annotations

from pathlib import Path
from tempfile import TemporaryDirectory
from typing import TYPE_CHECKING

import numpy as np
import pytest
import pyvista as pv

if TYPE_CHECKING:
    from collections.abc import Generator

    from numpy.typing import NDArray


def _generate_cube_mesh_3d(
    n_cells_per_edge: int,
) -> tuple[NDArray[np.float64], NDArray[np.int32]]:
    """Generate a regular tetrahedral cube mesh.

    Args:
        n_cells_per_edge: Number of cells along each edge.

    Returns:
        Tuple of (vertices, tetrahedra).

    """
    n = n_cells_per_edge + 1
    x = np.linspace(0, 1, n, dtype=np.float64)
    y = np.linspace(0, 1, n, dtype=np.float64)
    z = np.linspace(0, 1, n, dtype=np.float64)

    xx, yy, zz = np.meshgrid(x, y, z, indexing="ij")
    vertices = np.column_stack([xx.ravel(), yy.ravel(), zz.ravel()])

    tetrahedra = []
    for i in range(n_cells_per_edge):
        for j in range(n_cells_per_edge):
            for k in range(n_cells_per_edge):
                v0 = i * n * n + j * n + k
                v1 = v0 + 1
                v2 = v0 + n
                v3 = v0 + n + 1
                v4 = v0 + n * n
                v5 = v4 + 1
                v6 = v4 + n
                v7 = v4 + n + 1

                tetrahedra.extend(
                    [
                        [v0, v1, v3, v5],
                        [v0, v3, v2, v6],
                        [v0, v5, v4, v6],
                        [v3, v5, v6, v7],
                        [v0, v3, v5, v6],
                    ],
                )

    return vertices, np.array(tetrahedra, dtype=np.int32)


def _generate_square_mesh_2d(
    n_cells_per_edge: int,
) -> tuple[NDArray[np.float64], NDArray[np.int32]]:
    """Generate a regular triangular 2D mesh.

    Args:
        n_cells_per_edge: Number of cells along each edge.

    Returns:
        Tuple of (vertices, triangles).

    """
    n = n_cells_per_edge + 1
    x = np.linspace(0, 1, n, dtype=np.float64)
    y = np.linspace(0, 1, n, dtype=np.float64)

    xx, yy = np.meshgrid(x, y, indexing="ij")
    vertices = np.column_stack([xx.ravel(), yy.ravel()])

    triangles = []
    for i in range(n_cells_per_edge):
        for j in range(n_cells_per_edge):
            v0 = i * n + j
            v1 = v0 + 1
            v2 = v0 + n
            v3 = v0 + n + 1

            triangles.extend([[v0, v1, v3], [v0, v3, v2]])

    return vertices, np.array(triangles, dtype=np.int32)


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


@pytest.fixture(scope="session")
def mesh_3d_small() -> tuple[NDArray[np.float64], NDArray[np.int32]]:
    """Small 3D mesh (~500 elements) for quick benchmarks."""
    return _generate_cube_mesh_3d(n_cells_per_edge=5)


@pytest.fixture(scope="session")
def mesh_3d_medium() -> tuple[NDArray[np.float64], NDArray[np.int32]]:
    """Medium 3D mesh (~5,000 elements) for standard benchmarks."""
    return _generate_cube_mesh_3d(n_cells_per_edge=10)


@pytest.fixture(scope="session")
def mesh_3d_large() -> tuple[NDArray[np.float64], NDArray[np.int32]]:
    """Large 3D mesh (~40,000 elements) for stress benchmarks."""
    return _generate_cube_mesh_3d(n_cells_per_edge=20)


@pytest.fixture(scope="session")
def mesh_2d_small() -> tuple[NDArray[np.float64], NDArray[np.int32]]:
    """Small 2D mesh (~200 elements) for quick benchmarks."""
    return _generate_square_mesh_2d(n_cells_per_edge=10)


@pytest.fixture(scope="session")
def mesh_2d_medium() -> tuple[NDArray[np.float64], NDArray[np.int32]]:
    """Medium 2D mesh (~5,000 elements) for standard benchmarks."""
    return _generate_square_mesh_2d(n_cells_per_edge=50)


@pytest.fixture(scope="session")
def mesh_2d_large() -> tuple[NDArray[np.float64], NDArray[np.int32]]:
    """Large 2D mesh (~20,000 elements) for stress benchmarks."""
    return _generate_square_mesh_2d(n_cells_per_edge=100)


@pytest.fixture(scope="session")
def mesh_surface_small() -> tuple[NDArray[np.float64], NDArray[np.int32]]:
    """Small surface mesh (~320 elements) for quick benchmarks."""
    return _generate_sphere_surface(n_subdivisions=2)


@pytest.fixture(scope="session")
def mesh_surface_medium() -> tuple[NDArray[np.float64], NDArray[np.int32]]:
    """Medium surface mesh (~5,120 elements) for standard benchmarks."""
    return _generate_sphere_surface(n_subdivisions=4)


@pytest.fixture(scope="session")
def mesh_surface_large() -> tuple[NDArray[np.float64], NDArray[np.int32]]:
    """Large surface mesh (~20,480 elements) for stress benchmarks."""
    return _generate_sphere_surface(n_subdivisions=5)


@pytest.fixture
def tmp_mesh_dir() -> Generator[Path, None, None]:
    """Provide a temporary directory for mesh I/O benchmarks."""
    with TemporaryDirectory() as tmpdir:
        yield Path(tmpdir)


@pytest.fixture(scope="session")
def pyvista_tetra_grid(
    mesh_3d_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
) -> pv.UnstructuredGrid:
    """PyVista UnstructuredGrid for conversion benchmarks."""
    vertices, tetrahedra = mesh_3d_medium
    return pv.UnstructuredGrid({pv.CellType.TETRA: tetrahedra}, vertices)


@pytest.fixture(scope="session")
def pyvista_surface_polydata(
    mesh_surface_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
) -> pv.PolyData:
    """PyVista PolyData for surface conversion benchmarks."""
    vertices, triangles = mesh_surface_medium
    n_cells = len(triangles)
    faces = np.hstack([np.full((n_cells, 1), 3), triangles]).ravel()
    return pv.PolyData(vertices, faces=faces)
