"""Benchmarks for file I/O and format conversion operations."""

from __future__ import annotations

from pathlib import Path
from typing import TYPE_CHECKING

import numpy as np
import pytest
import pyvista as pv

from mmgpy import Mesh
from mmgpy._mmgpy import MmgMesh2D, MmgMesh3D, MmgMeshS

if TYPE_CHECKING:
    from numpy.typing import NDArray
    from pytest_benchmark.fixture import BenchmarkFixture


class TestFileIO3D:
    """Benchmarks for 3D mesh file I/O operations."""

    @pytest.mark.benchmark(group="io-3d-write")
    def test_save_mesh_file(
        self,
        benchmark: BenchmarkFixture,
        mesh_3d_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
        tmp_mesh_dir: Path,
    ) -> None:
        """Benchmark saving 3D mesh to .mesh file."""
        vertices, tetrahedra = mesh_3d_medium
        mesh = MmgMesh3D(vertices, tetrahedra)
        output_path = tmp_mesh_dir / "test_3d.mesh"

        benchmark(mesh.save, str(output_path))
        assert output_path.exists()

    @pytest.mark.benchmark(group="io-3d-read")
    def test_read_mesh_file(
        self,
        benchmark: BenchmarkFixture,
        mesh_3d_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
        tmp_mesh_dir: Path,
    ) -> None:
        """Benchmark reading 3D mesh from .mesh file."""
        vertices, tetrahedra = mesh_3d_medium
        mesh = MmgMesh3D(vertices, tetrahedra)
        input_path = tmp_mesh_dir / "test_3d_read.mesh"
        mesh.save(str(input_path))

        def read_mesh() -> MmgMesh3D:
            return MmgMesh3D(str(input_path))

        result = benchmark(read_mesh)
        assert len(result.get_tetrahedra()) > 0


class TestFileIO2D:
    """Benchmarks for 2D mesh file I/O operations."""

    @pytest.mark.benchmark(group="io-2d-write")
    def test_save_mesh_file(
        self,
        benchmark: BenchmarkFixture,
        mesh_2d_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
        tmp_mesh_dir: Path,
    ) -> None:
        """Benchmark saving 2D mesh to .mesh file."""
        vertices, triangles = mesh_2d_medium
        mesh = MmgMesh2D(vertices, triangles)
        output_path = tmp_mesh_dir / "test_2d.mesh"

        benchmark(mesh.save, str(output_path))
        assert output_path.exists()

    @pytest.mark.benchmark(group="io-2d-read")
    def test_read_mesh_file(
        self,
        benchmark: BenchmarkFixture,
        mesh_2d_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
        tmp_mesh_dir: Path,
    ) -> None:
        """Benchmark reading 2D mesh from .mesh file."""
        vertices, triangles = mesh_2d_medium
        mesh = MmgMesh2D(vertices, triangles)
        input_path = tmp_mesh_dir / "test_2d_read.mesh"
        mesh.save(str(input_path))

        def read_mesh() -> MmgMesh2D:
            return MmgMesh2D(str(input_path))

        result = benchmark(read_mesh)
        assert len(result.get_triangles()) > 0


class TestFileIOSurface:
    """Benchmarks for surface mesh file I/O operations."""

    @pytest.mark.benchmark(group="io-surface-write")
    def test_save_mesh_file(
        self,
        benchmark: BenchmarkFixture,
        mesh_surface_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
        tmp_mesh_dir: Path,
    ) -> None:
        """Benchmark saving surface mesh to .mesh file."""
        vertices, triangles = mesh_surface_medium
        mesh = MmgMeshS(vertices, triangles)
        output_path = tmp_mesh_dir / "test_surface.mesh"

        benchmark(mesh.save, str(output_path))
        assert output_path.exists()

    @pytest.mark.benchmark(group="io-surface-read")
    def test_read_mesh_file(
        self,
        benchmark: BenchmarkFixture,
        mesh_surface_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
        tmp_mesh_dir: Path,
    ) -> None:
        """Benchmark reading surface mesh from .mesh file."""
        vertices, triangles = mesh_surface_medium
        mesh = MmgMeshS(vertices, triangles)
        input_path = tmp_mesh_dir / "test_surface_read.mesh"
        mesh.save(str(input_path))

        def read_mesh() -> MmgMeshS:
            return MmgMeshS(str(input_path))

        result = benchmark(read_mesh)
        assert len(result.get_triangles()) > 0


class TestPyVistaConversion3D:
    """Benchmarks for PyVista conversion operations (3D)."""

    @pytest.mark.benchmark(group="io-pyvista-3d")
    def test_to_pyvista(
        self,
        benchmark: BenchmarkFixture,
        mesh_3d_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Benchmark conversion to PyVista UnstructuredGrid."""
        vertices, tetrahedra = mesh_3d_medium
        mesh = Mesh(vertices, tetrahedra)

        result = benchmark(mesh.to_pyvista)
        assert isinstance(result, pv.UnstructuredGrid)
        assert result.n_cells > 0

    @pytest.mark.benchmark(group="io-pyvista-3d")
    def test_from_pyvista(
        self,
        benchmark: BenchmarkFixture,
        pyvista_tetra_grid: pv.UnstructuredGrid,
    ) -> None:
        """Benchmark conversion from PyVista UnstructuredGrid."""
        result = benchmark(Mesh, pyvista_tetra_grid)
        assert len(result.get_tetrahedra()) > 0


class TestPyVistaConversionSurface:
    """Benchmarks for PyVista conversion operations (surface)."""

    @pytest.mark.benchmark(group="io-pyvista-surface")
    def test_to_pyvista(
        self,
        benchmark: BenchmarkFixture,
        mesh_surface_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Benchmark conversion to PyVista PolyData."""
        vertices, triangles = mesh_surface_medium
        mesh = Mesh(vertices, triangles)

        result = benchmark(mesh.to_pyvista)
        assert isinstance(result, pv.PolyData)
        assert result.n_cells > 0

    @pytest.mark.benchmark(group="io-pyvista-surface")
    def test_from_pyvista(
        self,
        benchmark: BenchmarkFixture,
        pyvista_surface_polydata: pv.PolyData,
    ) -> None:
        """Benchmark conversion from PyVista PolyData."""
        result = benchmark(Mesh, pyvista_surface_polydata)
        assert len(result.get_triangles()) > 0


class TestDataAccessPerformance:
    """Benchmarks for mesh data access operations."""

    @pytest.mark.benchmark(group="io-data-access")
    def test_get_vertices_3d(
        self,
        benchmark: BenchmarkFixture,
        mesh_3d_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Benchmark vertex array access."""
        vertices, tetrahedra = mesh_3d_medium
        mesh = MmgMesh3D(vertices, tetrahedra)

        result = benchmark(mesh.get_vertices)
        assert len(result) == len(vertices)

    @pytest.mark.benchmark(group="io-data-access")
    def test_get_tetrahedra(
        self,
        benchmark: BenchmarkFixture,
        mesh_3d_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Benchmark tetrahedra array access."""
        vertices, tetrahedra = mesh_3d_medium
        mesh = MmgMesh3D(vertices, tetrahedra)

        result = benchmark(mesh.get_tetrahedra)
        assert len(result) == len(tetrahedra)

    @pytest.mark.benchmark(group="io-data-access")
    def test_get_triangles_3d(
        self,
        benchmark: BenchmarkFixture,
        mesh_3d_medium: tuple[NDArray[np.float64], NDArray[np.int32]],
    ) -> None:
        """Benchmark triangle array access (boundary faces)."""
        vertices, tetrahedra = mesh_3d_medium
        mesh = MmgMesh3D(vertices, tetrahedra)

        # First do a remesh to generate triangles
        mesh.remesh(hsiz=0.5, verbose=-1)

        result = benchmark(mesh.get_triangles)
        # Should have boundary triangles after remeshing
        assert result is not None
