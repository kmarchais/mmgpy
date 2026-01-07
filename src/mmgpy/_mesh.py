"""Unified Mesh class for mmgpy.

This module provides a single `Mesh` class that wraps the underlying
MmgMesh3D, MmgMesh2D, and MmgMeshS implementations with auto-detection
of mesh type.

Example:
    >>> from mmgpy import Mesh, MeshKind
    >>>
    >>> # Auto-detect mesh type from data
    >>> mesh = Mesh(vertices, cells)
    >>> mesh.kind  # MeshKind.TETRAHEDRAL
    >>>
    >>> # Remesh and save
    >>> mesh.remesh(hmax=0.1)
    >>> mesh.save("output.vtk")

    >>> # Context manager usage
    >>> with Mesh(vertices, cells) as mesh:
    ...     mesh.remesh(hmax=0.1)
    ...     mesh.save("output.vtk")

    >>> # Transactional modifications with checkpoint
    >>> mesh = Mesh(vertices, cells)
    >>> with mesh.checkpoint() as snapshot:
    ...     mesh.remesh(hmax=0.01)
    ...     if mesh.validate():
    ...         snapshot.commit()
    ...     else:
    ...         snapshot.rollback()

"""

from __future__ import annotations

from contextlib import contextmanager
from dataclasses import dataclass, field
from enum import Enum
from pathlib import Path
from typing import TYPE_CHECKING, Any, Self, cast

import numpy as np
import pyvista as pv

from mmgpy._mmgpy import MmgMesh2D, MmgMesh3D, MmgMeshS

if TYPE_CHECKING:
    from collections.abc import Generator
    from types import TracebackType

    from numpy.typing import NDArray

    from mmgpy._options import Mmg2DOptions, Mmg3DOptions, MmgSOptions
    from mmgpy._result import RemeshResult
    from mmgpy._validation import ValidationReport

_DIMS_2D = 2
_DIMS_3D = 3
_TETRA_VERTS = 4
_TRI_VERTS = 3
_2D_DETECTION_TOLERANCE = 1e-8


class MeshKind(Enum):
    """Enumeration of mesh types.

    Attributes
    ----------
    TETRAHEDRAL
        3D volumetric mesh with tetrahedral elements.
    TRIANGULAR_2D
        2D planar mesh with triangular elements.
    TRIANGULAR_SURFACE
        3D surface mesh with triangular elements.

    """

    TETRAHEDRAL = "tetrahedral"
    TRIANGULAR_2D = "triangular_2d"
    TRIANGULAR_SURFACE = "triangular_surface"


def _is_2d_points(points: NDArray[np.floating]) -> bool:
    """Check if points are essentially 2D (z coordinates are zero or near-zero)."""
    if points.shape[1] == _DIMS_2D:
        return True
    if points.shape[1] == _DIMS_3D:
        z_coords = points[:, 2]
        return bool(np.allclose(z_coords, 0, atol=_2D_DETECTION_TOLERANCE))
    return False


def _detect_mesh_kind(
    vertices: NDArray[np.floating],
    cells: NDArray[np.integer],
) -> MeshKind:
    """Detect mesh kind from vertices and cells arrays.

    Parameters
    ----------
    vertices : ndarray
        Vertex coordinates (Nx2 or Nx3).
    cells : ndarray
        Cell connectivity (NxM where M is vertices per cell).

    Returns
    -------
    MeshKind
        Detected mesh kind.

    Raises
    ------
    ValueError
        If mesh type cannot be determined.

    """
    n_cell_verts = cells.shape[1]

    if n_cell_verts == _TETRA_VERTS:
        return MeshKind.TETRAHEDRAL

    if n_cell_verts == _TRI_VERTS:
        if _is_2d_points(vertices):
            return MeshKind.TRIANGULAR_2D
        return MeshKind.TRIANGULAR_SURFACE

    msg = f"Cannot determine mesh type from cells with {n_cell_verts} vertices per cell"
    raise ValueError(msg)


def _create_impl(
    vertices: NDArray[np.floating],
    cells: NDArray[np.integer],
    kind: MeshKind,
) -> MmgMesh3D | MmgMesh2D | MmgMeshS:
    """Create the appropriate mesh implementation.

    Parameters
    ----------
    vertices : ndarray
        Vertex coordinates.
    cells : ndarray
        Cell connectivity.
    kind : MeshKind
        Mesh kind to create.

    Returns
    -------
    MmgMesh3D | MmgMesh2D | MmgMeshS
        The mesh implementation.

    """
    vertices = np.ascontiguousarray(vertices, dtype=np.float64)
    cells = np.ascontiguousarray(cells, dtype=np.int32)

    if kind == MeshKind.TETRAHEDRAL:
        return MmgMesh3D(vertices, cells)

    if kind == MeshKind.TRIANGULAR_2D:
        # Ensure 2D vertices
        if vertices.shape[1] == _DIMS_3D:
            vertices = np.ascontiguousarray(vertices[:, :2])
        return MmgMesh2D(vertices, cells)

    if kind == MeshKind.TRIANGULAR_SURFACE:
        return MmgMeshS(vertices, cells)

    msg = f"Unknown mesh kind: {kind}"
    raise ValueError(msg)


@dataclass
class MeshCheckpoint:
    """Snapshot of mesh state for rollback.

    This class is returned by `Mesh.checkpoint()` and provides transactional
    semantics for mesh modifications. Changes are automatically rolled back
    on context exit unless `commit()` is called.

    Parameters
    ----------
    mesh : Mesh
        The mesh to checkpoint.

    Examples
    --------
    >>> mesh = Mesh(vertices, cells)
    >>> with mesh.checkpoint() as snapshot:
    ...     mesh.remesh(hmax=0.01)
    ...     if mesh.validate():
    ...         snapshot.commit()  # Keep changes
    ...     # Otherwise, changes are automatically rolled back

    >>> # Automatic rollback on exception
    >>> with mesh.checkpoint():
    ...     mesh.remesh(hmax=0.01)
    ...     raise ValueError("Something went wrong")
    >>> # mesh is restored to original state

    """

    _mesh: Mesh
    _vertices: NDArray[np.float64] = field(repr=False)
    _vertex_refs: NDArray[np.int64] = field(repr=False)
    _triangles: NDArray[np.int32] = field(repr=False)
    _triangle_refs: NDArray[np.int64] = field(repr=False)
    _edges: NDArray[np.int32] = field(repr=False)
    _edge_refs: NDArray[np.int64] = field(repr=False)
    _tetrahedra: NDArray[np.int32] | None = field(default=None, repr=False)
    _tetrahedra_refs: NDArray[np.int64] | None = field(default=None, repr=False)
    _committed: bool = field(default=False, repr=False)

    def commit(self) -> None:
        """Keep the current mesh state.

        Call this method to prevent rollback when the context manager exits.
        """
        self._committed = True

    def rollback(self) -> None:
        """Restore the mesh to its checkpoint state.

        This is called automatically on context exit if `commit()` was not called,
        or if an exception occurred. Can also be called manually.
        """
        mesh = self._mesh
        kind = mesh._kind  # noqa: SLF001

        if kind == MeshKind.TETRAHEDRAL:
            if self._tetrahedra is None or self._tetrahedra_refs is None:
                msg = "Tetrahedra data missing in checkpoint"
                raise RuntimeError(msg)
            impl = cast("MmgMesh3D", mesh._impl)  # noqa: SLF001
            impl.set_mesh_size(
                vertices=len(self._vertices),
                tetrahedra=len(self._tetrahedra),
                triangles=len(self._triangles),
                edges=len(self._edges),
            )
            impl.set_vertices(self._vertices, self._vertex_refs)
            impl.set_tetrahedra(self._tetrahedra, self._tetrahedra_refs)
            if len(self._triangles) > 0:
                impl.set_triangles(self._triangles, self._triangle_refs)
            if len(self._edges) > 0:
                impl.set_edges(self._edges, self._edge_refs)
        elif kind == MeshKind.TRIANGULAR_2D:
            impl_2d = cast("MmgMesh2D", mesh._impl)  # noqa: SLF001
            impl_2d.set_mesh_size(
                vertices=len(self._vertices),
                triangles=len(self._triangles),
                edges=len(self._edges),
            )
            impl_2d.set_vertices(self._vertices, self._vertex_refs)
            impl_2d.set_triangles(self._triangles, self._triangle_refs)
            if len(self._edges) > 0:
                impl_2d.set_edges(self._edges, self._edge_refs)
        else:  # TRIANGULAR_SURFACE
            impl_s = cast("MmgMeshS", mesh._impl)  # noqa: SLF001
            impl_s.set_mesh_size(
                vertices=len(self._vertices),
                triangles=len(self._triangles),
                edges=len(self._edges),
            )
            impl_s.set_vertices(self._vertices, self._vertex_refs)
            impl_s.set_triangles(self._triangles, self._triangle_refs)
            if len(self._edges) > 0:
                impl_s.set_edges(self._edges, self._edge_refs)

    def __enter__(self) -> Self:
        """Enter the context manager."""
        return self

    def __exit__(
        self,
        exc_type: type[BaseException] | None,
        exc_val: BaseException | None,
        exc_tb: TracebackType | None,
    ) -> bool:
        """Exit the context manager, rolling back if not committed or on exception."""
        if exc_type is not None or not self._committed:
            self.rollback()
        return False


class Mesh:
    """Unified mesh class with auto-detection of mesh type.

    This class provides a single interface for working with 2D planar,
    3D volumetric, and 3D surface meshes. The mesh type is automatically
    detected from the input data.

    Parameters
    ----------
    source : ndarray | str | Path | pv.UnstructuredGrid | pv.PolyData
        Either:
        - Vertex coordinates array (requires `cells` parameter)
        - File path to load mesh from
        - PyVista mesh object
    cells : ndarray, optional
        Cell connectivity array. Required when `source` is vertices.

    Attributes
    ----------
    kind : MeshKind
        The type of mesh (TETRAHEDRAL, TRIANGULAR_2D, or TRIANGULAR_SURFACE).

    Examples
    --------
    Create a mesh from vertices and cells:

    >>> vertices = np.array([[0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1]])
    >>> cells = np.array([[0, 1, 2, 3]])
    >>> mesh = Mesh(vertices, cells)
    >>> mesh.kind
    MeshKind.TETRAHEDRAL

    Load a mesh from file:

    >>> mesh = Mesh("mesh.vtk")

    Create from PyVista:

    >>> pv_mesh = pv.read("mesh.vtk")
    >>> mesh = Mesh(pv_mesh)

    """

    __slots__ = ("_impl", "_kind")

    _impl: MmgMesh3D | MmgMesh2D | MmgMeshS
    _kind: MeshKind

    def __init__(
        self,
        source: NDArray[np.floating] | str | Path | pv.UnstructuredGrid | pv.PolyData,
        cells: NDArray[np.integer] | None = None,
    ) -> None:
        """Initialize a Mesh from various sources."""
        # Import here to avoid circular imports
        from mmgpy._io import read as _read_mesh  # noqa: PLC0415

        # Handle PyVista objects
        if isinstance(source, pv.UnstructuredGrid | pv.PolyData):
            result = _read_mesh(source)
            self._impl = result._impl  # noqa: SLF001
            self._kind = result._kind  # noqa: SLF001
            return

        # Handle file paths
        if isinstance(source, str | Path):
            result = _read_mesh(source)
            self._impl = result._impl  # noqa: SLF001
            self._kind = result._kind  # noqa: SLF001
            return

        # Handle vertices + cells
        if cells is None:
            msg = "cells parameter is required when source is a vertices array"
            raise ValueError(msg)

        vertices = np.asarray(source)
        cells = np.asarray(cells)

        self._kind = _detect_mesh_kind(vertices, cells)
        self._impl = _create_impl(vertices, cells, self._kind)

    @classmethod
    def _from_impl(
        cls,
        impl: MmgMesh3D | MmgMesh2D | MmgMeshS,
        kind: MeshKind,
    ) -> Mesh:
        """Create a Mesh from an existing implementation (internal use).

        Parameters
        ----------
        impl : MmgMesh3D | MmgMesh2D | MmgMeshS
            The underlying mesh implementation.
        kind : MeshKind
            The mesh kind.

        Returns
        -------
        Mesh
            A new Mesh wrapping the implementation.

        """
        mesh = object.__new__(cls)
        mesh._impl = impl  # noqa: SLF001
        mesh._kind = kind  # noqa: SLF001
        return mesh

    @property
    def kind(self) -> MeshKind:
        """Get the mesh kind.

        Returns
        -------
        MeshKind
            The type of mesh.

        """
        return self._kind

    # =========================================================================
    # Vertex operations
    # =========================================================================

    def get_vertices(self) -> NDArray[np.float64]:
        """Get vertex coordinates.

        Returns
        -------
        ndarray
            Vertex coordinates (Nx2 for 2D, Nx3 for 3D).

        """
        return self._impl.get_vertices()

    def get_vertices_with_refs(self) -> tuple[NDArray[np.float64], NDArray[np.int64]]:
        """Get vertex coordinates and reference markers.

        Returns
        -------
        vertices : ndarray
            Vertex coordinates.
        refs : ndarray
            Reference markers for each vertex.

        """
        return self._impl.get_vertices_with_refs()

    def set_vertices(
        self,
        vertices: NDArray[np.float64],
        refs: NDArray[np.int64] | None = None,
    ) -> None:
        """Set vertex coordinates.

        Parameters
        ----------
        vertices : ndarray
            Vertex coordinates.
        refs : ndarray, optional
            Reference markers for each vertex.

        """
        self._impl.set_vertices(vertices, refs)

    # =========================================================================
    # Triangle operations (shared by all types)
    # =========================================================================

    def get_triangles(self) -> NDArray[np.int32]:
        """Get triangle connectivity.

        Returns
        -------
        ndarray
            Triangle connectivity (Nx3).

        """
        return self._impl.get_triangles()

    def get_triangles_with_refs(self) -> tuple[NDArray[np.int32], NDArray[np.int64]]:
        """Get triangle connectivity and reference markers.

        Returns
        -------
        triangles : ndarray
            Triangle connectivity.
        refs : ndarray
            Reference markers for each triangle.

        """
        return self._impl.get_triangles_with_refs()

    def set_triangles(
        self,
        triangles: NDArray[np.int32],
        refs: NDArray[np.int64] | None = None,
    ) -> None:
        """Set triangle connectivity.

        Parameters
        ----------
        triangles : ndarray
            Triangle connectivity (Nx3).
        refs : ndarray, optional
            Reference markers for each triangle.

        """
        self._impl.set_triangles(triangles, refs)

    # =========================================================================
    # Edge operations
    # =========================================================================

    def get_edges(self) -> NDArray[np.int32]:
        """Get edge connectivity.

        Returns
        -------
        ndarray
            Edge connectivity (Nx2).

        """
        return self._impl.get_edges()

    def get_edges_with_refs(self) -> tuple[NDArray[np.int32], NDArray[np.int64]]:
        """Get edge connectivity and reference markers.

        Returns
        -------
        edges : ndarray
            Edge connectivity.
        refs : ndarray
            Reference markers for each edge.

        """
        return self._impl.get_edges_with_refs()

    def set_edges(
        self,
        edges: NDArray[np.int32],
        refs: NDArray[np.int64] | None = None,
    ) -> None:
        """Set edge connectivity.

        Parameters
        ----------
        edges : ndarray
            Edge connectivity (Nx2).
        refs : ndarray, optional
            Reference markers for each edge.

        """
        self._impl.set_edges(edges, refs)

    # =========================================================================
    # Tetrahedra operations (TETRAHEDRAL only)
    # =========================================================================

    def get_tetrahedra(self) -> NDArray[np.int32]:
        """Get tetrahedra connectivity.

        Only available for TETRAHEDRAL meshes.

        Returns
        -------
        ndarray
            Tetrahedra connectivity (Nx4).

        Raises
        ------
        TypeError
            If mesh is not TETRAHEDRAL.

        """
        if self._kind != MeshKind.TETRAHEDRAL:
            msg = "get_tetrahedra() is only available for TETRAHEDRAL meshes"
            raise TypeError(msg)
        return self._impl.get_tetrahedra()  # type: ignore[union-attr]

    def get_tetrahedra_with_refs(
        self,
    ) -> tuple[NDArray[np.int32], NDArray[np.int64]]:
        """Get tetrahedra connectivity and reference markers.

        Only available for TETRAHEDRAL meshes.

        Returns
        -------
        tetrahedra : ndarray
            Tetrahedra connectivity.
        refs : ndarray
            Reference markers for each tetrahedron.

        Raises
        ------
        TypeError
            If mesh is not TETRAHEDRAL.

        """
        if self._kind != MeshKind.TETRAHEDRAL:
            msg = "get_tetrahedra_with_refs() is only available for TETRAHEDRAL meshes"
            raise TypeError(msg)
        return self._impl.get_tetrahedra_with_refs()  # type: ignore[union-attr]

    def get_elements(self) -> NDArray[np.int32]:
        """Get primary element connectivity (alias for get_tetrahedra).

        Only available for TETRAHEDRAL meshes.

        Returns
        -------
        ndarray
            Element connectivity (Nx4 tetrahedra).

        Raises
        ------
        TypeError
            If mesh is not TETRAHEDRAL.

        """
        if self._kind != MeshKind.TETRAHEDRAL:
            msg = "get_elements() is only available for TETRAHEDRAL meshes"
            raise TypeError(msg)
        return self._impl.get_elements()  # type: ignore[union-attr]

    def get_elements_with_refs(self) -> tuple[NDArray[np.int32], NDArray[np.int64]]:
        """Get primary element connectivity and reference markers.

        Only available for TETRAHEDRAL meshes.

        Returns
        -------
        elements : ndarray
            Element connectivity.
        refs : ndarray
            Reference markers for each element.

        Raises
        ------
        TypeError
            If mesh is not TETRAHEDRAL.

        """
        if self._kind != MeshKind.TETRAHEDRAL:
            msg = "get_elements_with_refs() is only available for TETRAHEDRAL meshes"
            raise TypeError(msg)
        return self._impl.get_elements_with_refs()  # type: ignore[union-attr]

    # =========================================================================
    # Field operations (solution data)
    # =========================================================================

    def set_field(self, key: str, value: NDArray[np.float64]) -> None:
        """Set a solution field.

        Parameters
        ----------
        key : str
            Field name.
        value : ndarray
            Field values (one per vertex).

        """
        self._impl.set_field(key, value)

    def get_field(self, key: str) -> NDArray[np.float64]:
        """Get a solution field.

        Parameters
        ----------
        key : str
            Field name.

        Returns
        -------
        ndarray
            Field values.

        """
        return self._impl.get_field(key)

    def __setitem__(self, key: str, value: NDArray[np.float64]) -> None:
        """Set a solution field using dictionary syntax."""
        self._impl[key] = value

    def __getitem__(self, key: str) -> NDArray[np.float64]:
        """Get a solution field using dictionary syntax."""
        return self._impl[key]

    # =========================================================================
    # Topology queries
    # =========================================================================

    def get_adjacent_elements(self, idx: int) -> NDArray[np.int32]:
        """Get indices of elements adjacent to a given element.

        Parameters
        ----------
        idx : int
            Element index (1-based for MMG).

        Returns
        -------
        ndarray
            Indices of adjacent elements.

        """
        return self._impl.get_adjacent_elements(idx)

    def get_vertex_neighbors(self, idx: int) -> NDArray[np.int32]:
        """Get indices of vertices connected to a given vertex.

        Parameters
        ----------
        idx : int
            Vertex index (1-based for MMG).

        Returns
        -------
        ndarray
            Indices of neighboring vertices.

        """
        return self._impl.get_vertex_neighbors(idx)

    def get_element_quality(self, idx: int) -> float:
        """Get quality metric for a single element.

        Parameters
        ----------
        idx : int
            Element index (1-based for MMG).

        Returns
        -------
        float
            Quality metric (0-1, higher is better).

        """
        return self._impl.get_element_quality(idx)

    def get_element_qualities(self) -> NDArray[np.float64]:
        """Get quality metrics for all elements.

        Returns
        -------
        ndarray
            Quality metrics for all elements.

        """
        return self._impl.get_element_qualities()

    # =========================================================================
    # File I/O
    # =========================================================================

    def save(self, filename: str | Path) -> None:
        """Save mesh to file.

        Parameters
        ----------
        filename : str or Path
            Output file path. Format determined by extension.

        """
        self._impl.save(filename)

    # =========================================================================
    # Remeshing operations
    # =========================================================================

    def remesh(
        self,
        options: Mmg3DOptions | Mmg2DOptions | MmgSOptions | None = None,
        **kwargs: Any,  # noqa: ANN401
    ) -> RemeshResult:
        """Remesh the mesh in-place.

        Parameters
        ----------
        options : Mmg3DOptions | Mmg2DOptions | MmgSOptions, optional
            Options object for remeshing parameters.
        **kwargs : float
            Individual remeshing parameters (hmin, hmax, hsiz, hausd, etc.).

        Returns
        -------
        RemeshResult
            Statistics from the remeshing operation.

        """
        return self._impl.remesh(options, **kwargs)  # type: ignore[arg-type, return-value]

    def remesh_lagrangian(
        self,
        displacement: NDArray[np.float64],
        **kwargs: Any,  # noqa: ANN401
    ) -> RemeshResult:
        """Remesh with Lagrangian motion.

        Only available for TETRAHEDRAL and TRIANGULAR_2D meshes.

        Parameters
        ----------
        displacement : ndarray
            Displacement field for each vertex.
        **kwargs : float
            Additional remeshing parameters.

        Returns
        -------
        RemeshResult
            Statistics from the remeshing operation.

        Raises
        ------
        TypeError
            If mesh is TRIANGULAR_SURFACE.

        """
        if self._kind == MeshKind.TRIANGULAR_SURFACE:
            msg = "remesh_lagrangian() is not available for TRIANGULAR_SURFACE meshes"
            raise TypeError(msg)
        return self._impl.remesh_lagrangian(displacement, **kwargs)  # type: ignore[union-attr, return-value]

    def remesh_levelset(
        self,
        levelset: NDArray[np.float64],
        **kwargs: Any,  # noqa: ANN401
    ) -> RemeshResult:
        """Remesh with level-set discretization.

        Parameters
        ----------
        levelset : ndarray
            Level-set field for each vertex.
        **kwargs : float
            Additional remeshing parameters.

        Returns
        -------
        RemeshResult
            Statistics from the remeshing operation.

        """
        return self._impl.remesh_levelset(levelset, **kwargs)  # type: ignore[return-value]

    # =========================================================================
    # PyVista conversion (will be monkey-patched)
    # =========================================================================

    def to_pyvista(
        self,
        *,
        include_refs: bool = True,
    ) -> pv.UnstructuredGrid | pv.PolyData:
        """Convert to PyVista mesh.

        Parameters
        ----------
        include_refs : bool
            Include reference markers as cell data.

        Returns
        -------
        pv.UnstructuredGrid | pv.PolyData
            PyVista mesh object.

        """
        return self._impl.to_pyvista(include_refs=include_refs)  # type: ignore[return-value]

    @property
    def vtk(self) -> pv.UnstructuredGrid | pv.PolyData:
        """Get the PyVista mesh representation.

        This property provides direct access to the PyVista mesh for use with
        custom plotters or other PyVista operations.

        Returns
        -------
        pv.UnstructuredGrid | pv.PolyData
            PyVista mesh object.

        Examples
        --------
        >>> plotter = pv.Plotter()
        >>> plotter.add_mesh(mesh.vtk, show_edges=True)
        >>> plotter.show()

        """
        return self.to_pyvista()

    def plot(
        self,
        *,
        show_edges: bool = True,
        **kwargs: Any,  # noqa: ANN401
    ) -> None:
        """Plot the mesh using PyVista.

        Parameters
        ----------
        show_edges : bool
            Show mesh edges (default: True).
        **kwargs : Any
            Additional arguments passed to PyVista's plot() method.

        Examples
        --------
        >>> mesh = Mesh(vertices, cells)
        >>> mesh.plot()  # Simple plot with edges

        >>> mesh.plot(color="blue", opacity=0.8)  # Custom styling

        """
        self.to_pyvista().plot(show_edges=show_edges, **kwargs)

    # =========================================================================
    # Validation
    # =========================================================================

    def validate(  # noqa: PLR0913
        self,
        *,
        detailed: bool = False,
        strict: bool = False,
        check_geometry: bool = True,
        check_topology: bool = True,
        check_quality: bool = True,
        min_quality: float = 0.1,
    ) -> bool | ValidationReport:
        """Validate the mesh and check for issues.

        Parameters
        ----------
        detailed : bool
            If True, return a ValidationReport with detailed information.
            If False, return a simple boolean.
        strict : bool
            If True, raise ValidationError on any issue (including warnings).
        check_geometry : bool
            Check for geometric issues (inverted/degenerate elements).
        check_topology : bool
            Check for topological issues (orphan vertices, non-manifold edges).
        check_quality : bool
            Check element quality against threshold.
        min_quality : float
            Minimum acceptable element quality (0-1).

        Returns
        -------
        bool | ValidationReport
            If detailed=False, returns True if valid, False otherwise.
            If detailed=True, returns full ValidationReport.

        Raises
        ------
        ValidationError
            If strict=True and any issues are found.

        Examples
        --------
        >>> mesh = Mesh(vertices, cells)
        >>> if mesh.validate():
        ...     print("Mesh is valid")

        >>> report = mesh.validate(detailed=True)
        >>> print(f"Quality: {report.quality.mean:.3f}")

        """
        return self._impl.validate(  # type: ignore[attr-defined, return-value]
            detailed=detailed,
            strict=strict,
            check_geometry=check_geometry,
            check_topology=check_topology,
            check_quality=check_quality,
            min_quality=min_quality,
        )

    # =========================================================================
    # Context manager support
    # =========================================================================

    def __enter__(self) -> Self:
        """Enter the context manager.

        Returns
        -------
        Self
            The mesh instance.

        Examples
        --------
        >>> with Mesh(vertices, cells) as mesh:
        ...     mesh.remesh(hmax=0.1)
        ...     mesh.save("output.vtk")

        """
        return self

    def __exit__(
        self,
        exc_type: type[BaseException] | None,
        exc_val: BaseException | None,
        exc_tb: TracebackType | None,
    ) -> bool:
        """Exit the context manager.

        Currently performs no cleanup, but provides a consistent API
        for resource management patterns.

        Returns
        -------
        bool
            False, to not suppress any exceptions.

        """
        return False

    def checkpoint(self) -> MeshCheckpoint:
        """Create a checkpoint for transactional modifications.

        Returns a context manager that captures the current mesh state.
        On exit, if `commit()` was not called or an exception occurred,
        the mesh is automatically rolled back to its checkpoint state.

        Returns
        -------
        MeshCheckpoint
            A context manager for transactional mesh modifications.

        Examples
        --------
        >>> mesh = Mesh(vertices, cells)
        >>> with mesh.checkpoint() as snapshot:
        ...     mesh.remesh(hmax=0.01)
        ...     if mesh.validate():
        ...         snapshot.commit()  # Keep changes
        ...     # If not committed, changes are rolled back

        >>> # Automatic rollback on exception
        >>> with mesh.checkpoint():
        ...     mesh.remesh(hmax=0.01)
        ...     raise ValueError("Simulated failure")
        >>> # mesh is restored to original state

        """
        vertices, vertex_refs = self._impl.get_vertices_with_refs()
        triangles, triangle_refs = self._impl.get_triangles_with_refs()
        edges, edge_refs = self._impl.get_edges_with_refs()

        tetrahedra = None
        tetrahedra_refs = None
        if self._kind == MeshKind.TETRAHEDRAL:
            impl_3d = cast("MmgMesh3D", self._impl)
            tetrahedra, tetrahedra_refs = impl_3d.get_tetrahedra_with_refs()

        return MeshCheckpoint(
            _mesh=self,
            _vertices=vertices.copy(),
            _vertex_refs=vertex_refs.copy(),
            _triangles=triangles.copy(),
            _triangle_refs=triangle_refs.copy(),
            _edges=edges.copy(),
            _edge_refs=edge_refs.copy(),
            _tetrahedra=tetrahedra.copy() if tetrahedra is not None else None,
            _tetrahedra_refs=(
                tetrahedra_refs.copy() if tetrahedra_refs is not None else None
            ),
        )

    @contextmanager
    def copy(self) -> Generator[Mesh, None, None]:
        """Create a working copy that is discarded on exit.

        Returns a context manager that yields a copy of the mesh.
        The copy can be freely modified without affecting the original.
        Use `update_from()` to apply changes from the copy to the original.

        Yields
        ------
        Mesh
            A copy of this mesh.

        Examples
        --------
        >>> original = Mesh(vertices, cells)
        >>> with original.copy() as working:
        ...     working.remesh(hmax=0.1)
        ...     if len(working.get_vertices()) < len(original.get_vertices()) * 2:
        ...         original.update_from(working)
        >>> # working is discarded on exit

        """
        vertices = self._impl.get_vertices().copy()

        if self._kind == MeshKind.TETRAHEDRAL:
            impl_3d = cast("MmgMesh3D", self._impl)
            cells = impl_3d.get_tetrahedra().copy()
        else:
            cells = self._impl.get_triangles().copy()

        working = Mesh(vertices, cells)

        try:
            yield working
        finally:
            pass

    def update_from(self, other: Mesh) -> None:
        """Update this mesh from another mesh's state.

        Replaces the vertices and elements of this mesh with those from
        the other mesh. Both meshes must be of the same kind.

        Parameters
        ----------
        other : Mesh
            The mesh to copy state from.

        Raises
        ------
        TypeError
            If the meshes are of different kinds.

        Examples
        --------
        >>> original = Mesh(vertices, cells)
        >>> with original.copy() as working:
        ...     working.remesh(hmax=0.1)
        ...     original.update_from(working)

        """
        if self._kind != other._kind:
            msg = f"Cannot update {self._kind.value} mesh from {other._kind.value} mesh"
            raise TypeError(msg)

        vertices, vertex_refs = other._impl.get_vertices_with_refs()
        triangles, triangle_refs = other._impl.get_triangles_with_refs()
        edges, edge_refs = other._impl.get_edges_with_refs()

        if self._kind == MeshKind.TETRAHEDRAL:
            other_impl = cast("MmgMesh3D", other._impl)
            self_impl = cast("MmgMesh3D", self._impl)
            tetrahedra, tetrahedra_refs = other_impl.get_tetrahedra_with_refs()
            self_impl.set_mesh_size(
                vertices=len(vertices),
                tetrahedra=len(tetrahedra),
                triangles=len(triangles),
                edges=len(edges),
            )
            self_impl.set_vertices(vertices, vertex_refs)
            self_impl.set_tetrahedra(tetrahedra, tetrahedra_refs)
            if len(triangles) > 0:
                self_impl.set_triangles(triangles, triangle_refs)
            if len(edges) > 0:
                self_impl.set_edges(edges, edge_refs)
        elif self._kind == MeshKind.TRIANGULAR_2D:
            impl_2d = cast("MmgMesh2D", self._impl)
            impl_2d.set_mesh_size(
                vertices=len(vertices),
                triangles=len(triangles),
                edges=len(edges),
            )
            impl_2d.set_vertices(vertices, vertex_refs)
            impl_2d.set_triangles(triangles, triangle_refs)
            if len(edges) > 0:
                impl_2d.set_edges(edges, edge_refs)
        else:  # TRIANGULAR_SURFACE
            impl_s = cast("MmgMeshS", self._impl)
            impl_s.set_mesh_size(
                vertices=len(vertices),
                triangles=len(triangles),
                edges=len(edges),
            )
            impl_s.set_vertices(vertices, vertex_refs)
            impl_s.set_triangles(triangles, triangle_refs)
            if len(edges) > 0:
                impl_s.set_edges(edges, edge_refs)


__all__ = [
    "Mesh",
    "MeshCheckpoint",
    "MeshKind",
]
