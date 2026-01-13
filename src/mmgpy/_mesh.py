"""Unified Mesh class for mmgpy.

This module provides a single `Mesh` class that wraps the underlying
MmgMesh3D, MmgMesh2D, and MmgMeshS implementations with auto-detection
of mesh type.

The Mesh class is the primary public API for mmgpy. The underlying C++
bindings (MmgMesh3D, MmgMesh2D, MmgMeshS) are implementation details
and should not be used directly.

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
from typing import TYPE_CHECKING, Any, cast

import numpy as np
import pyvista as pv

from mmgpy._mmgpy import MmgMesh2D, MmgMesh3D, MmgMeshS

if TYPE_CHECKING:
    from collections.abc import Callable, Generator, Sequence
    from types import TracebackType

    from numpy.typing import NDArray

    from mmgpy._options import Mmg2DOptions, Mmg3DOptions, MmgSOptions
    from mmgpy._progress import (
        ProgressCallback,
        ProgressEvent,
        RichProgressReporter,
    )
    from mmgpy._result import RemeshResult
    from mmgpy._validation import ValidationReport
    from mmgpy.sizing import SizingConstraint

    # Progress can be True (default rich), False (disabled), or a callback
    ProgressParam = bool | Callable[[ProgressEvent], bool] | None

    # Field transfer can be True (all fields), False (no transfer), or list of names
    FieldTransferParam = bool | Sequence[str] | None

_DIMS_2D = 2
_DIMS_3D = 3
_TETRA_VERTS = 4
_TRI_VERTS = 3
_2D_DETECTION_TOLERANCE = 1e-8


def _is_interactive_terminal() -> bool:  # pragma: no cover
    """Check if we're running in an interactive terminal.

    Returns False in CI environments, pytest, or when stdout is not a TTY.
    """
    import os  # noqa: PLC0415
    import sys  # noqa: PLC0415

    # Check for common CI environment variables
    ci_vars = ("CI", "GITHUB_ACTIONS", "GITLAB_CI", "TRAVIS", "CIRCLECI", "JENKINS_URL")
    if any(os.environ.get(var) for var in ci_vars):
        return False

    # Check if running under pytest
    if "pytest" in sys.modules:
        return False

    # Check if stdout is a TTY
    return hasattr(sys.stdout, "isatty") and sys.stdout.isatty()


def _resolve_progress_callback(
    progress: ProgressParam,
) -> tuple[ProgressCallback | None, RichProgressReporter | None]:
    """Resolve progress parameter to callback and optional context manager.

    Parameters
    ----------
    progress : bool | Callable | None
        The progress parameter from remesh methods.

    Returns
    -------
    tuple[ProgressCallback | None, RichProgressReporter | None]
        A tuple of (callback, reporter_ctx). If reporter_ctx is not None,
        it must be used as a context manager to manage the Rich display.

    """
    from mmgpy._progress import RichProgressReporter  # noqa: PLC0415

    if progress is True:
        # Only show progress bar in interactive terminals
        if _is_interactive_terminal():  # pragma: no cover
            reporter = RichProgressReporter(transient=True)
            return reporter, reporter
        return None, None
    if callable(progress):
        return progress, None
    return None, None


def _dict_to_remesh_result(stats: dict[str, Any]) -> RemeshResult:
    """Convert C++ remesh statistics dict to RemeshResult dataclass."""
    from mmgpy._result import RemeshResult as _RemeshResult  # noqa: PLC0415

    return _RemeshResult(
        vertices_before=stats["vertices_before"],
        vertices_after=stats["vertices_after"],
        elements_before=stats["elements_before"],
        elements_after=stats["elements_after"],
        triangles_before=stats["triangles_before"],
        triangles_after=stats["triangles_after"],
        edges_before=stats["edges_before"],
        edges_after=stats["edges_after"],
        quality_min_before=stats["quality_min_before"],
        quality_min_after=stats["quality_min_after"],
        quality_mean_before=stats["quality_mean_before"],
        quality_mean_after=stats["quality_mean_after"],
        duration_seconds=stats["duration_seconds"],
        warnings=tuple(stats["warnings"]),
        return_code=stats["return_code"],
    )


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

    Notes
    -----
    The checkpoint stores a complete copy of the mesh data including vertices,
    elements, reference markers, and solution fields (metric, displacement,
    levelset). For large meshes, this may consume significant memory.

    Note: The tensor field is not saved because it shares memory with metric
    in MMG's internal representation. Only one of metric or tensor can be
    set at a time.

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
    _fields: dict[str, NDArray[np.float64]] = field(default_factory=dict, repr=False)
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

        # Restore solution fields
        for field_name, field_data in self._fields.items():
            mesh._impl.set_field(field_name, field_data)  # noqa: SLF001

    def __enter__(self) -> MeshCheckpoint:  # noqa: PYI034
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

    __slots__ = ("_impl", "_kind", "_sizing_constraints", "_user_fields")

    _impl: MmgMesh3D | MmgMesh2D | MmgMeshS
    _kind: MeshKind
    _sizing_constraints: list[SizingConstraint]
    _user_fields: dict[str, NDArray[np.float64]]

    def __init__(
        self,
        source: NDArray[np.floating] | str | Path | pv.UnstructuredGrid | pv.PolyData,
        cells: NDArray[np.integer] | None = None,
    ) -> None:
        """Initialize a Mesh from various sources."""
        # Import here to avoid circular imports
        from mmgpy._io import read as _read_mesh  # noqa: PLC0415

        self._sizing_constraints = []
        self._user_fields = {}

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
        mesh._sizing_constraints = []  # noqa: SLF001
        mesh._user_fields = {}  # noqa: SLF001
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

    def _try_get_field(self, key: str) -> NDArray[np.float64] | None:
        """Try to get a field, returning None if not set or contains garbage.

        The underlying C++ bindings may return uninitialized memory for fields
        that haven't been explicitly set. This method filters out such garbage
        by checking for subnormal (denormalized) floating point values.
        """
        try:
            data = self._impl.get_field(key)
        except RuntimeError:
            return None
        # Check for uninitialized memory: subnormal values indicate garbage
        if np.any(~np.isfinite(data)) or np.any(
            (data != 0) & (np.abs(data) < np.finfo(np.float64).tiny),
        ):
            return None
        return data

    def __setitem__(self, key: str, value: NDArray[np.float64]) -> None:
        """Set a solution field using dictionary syntax."""
        self._impl[key] = value

    def __getitem__(self, key: str) -> NDArray[np.float64]:
        """Get a solution field using dictionary syntax."""
        return self._impl[key]

    # =========================================================================
    # User field operations (arbitrary fields for transfer)
    # =========================================================================

    def set_user_field(self, name: str, values: NDArray[np.float64]) -> None:
        """Set a user-defined field for transfer during remeshing.

        Unlike MMG's built-in fields (metric, displacement, levelset), user fields
        are arbitrary data arrays that can be transferred to the new mesh after
        remeshing via interpolation.

        Parameters
        ----------
        name : str
            Field name (any string except reserved names like "metric").
        values : ndarray
            Field values, shape (n_vertices,) for scalars or
            (n_vertices, n_components) for vectors/tensors.

        Examples
        --------
        >>> mesh.set_user_field("temperature", temperature_array)
        >>> mesh.set_user_field("velocity", velocity_array)  # (N, 3) vector
        >>> mesh.remesh(hmax=0.1, transfer_fields=True)
        >>> new_temp = mesh.get_user_field("temperature")

        """
        n_vertices = len(self.get_vertices())
        values = np.asarray(values, dtype=np.float64)
        if values.shape[0] != n_vertices:
            msg = (
                f"Field '{name}' has {values.shape[0]} values but mesh "
                f"has {n_vertices} vertices"
            )
            raise ValueError(msg)
        self._user_fields[name] = values

    def get_user_field(self, name: str) -> NDArray[np.float64]:
        """Get a user-defined field.

        Parameters
        ----------
        name : str
            Field name.

        Returns
        -------
        ndarray
            Field values at vertices.

        Raises
        ------
        KeyError
            If the field does not exist.

        """
        if name not in self._user_fields:
            msg = f"User field '{name}' not found. Available: {list(self._user_fields)}"
            raise KeyError(msg)
        return self._user_fields[name]

    def get_user_fields(self) -> dict[str, NDArray[np.float64]]:
        """Get all user-defined fields.

        Returns
        -------
        dict[str, ndarray]
            Dictionary mapping field names to values.

        """
        return dict(self._user_fields)

    def clear_user_fields(self) -> None:
        """Remove all user-defined fields."""
        self._user_fields.clear()

    def has_user_field(self, name: str) -> bool:
        """Check if a user field exists.

        Parameters
        ----------
        name : str
            Field name.

        Returns
        -------
        bool
            True if the field exists.

        """
        return name in self._user_fields

    # =========================================================================
    # Geometry operations
    # =========================================================================

    def _compute_tetrahedra_volumes(
        self,
        vertices: NDArray[np.float64],
        tetrahedra: NDArray[np.int32],
    ) -> NDArray[np.float64]:
        """Compute volumes for an array of tetrahedra.

        Parameters
        ----------
        vertices : ndarray
            Vertex coordinates, shape (N, 3).
        tetrahedra : ndarray
            Tetrahedra connectivity, shape (M, 4).

        Returns
        -------
        ndarray
            Volume of each tetrahedron, shape (M,).

        """
        v0 = vertices[tetrahedra[:, 0]]
        v1 = vertices[tetrahedra[:, 1]]
        v2 = vertices[tetrahedra[:, 2]]
        v3 = vertices[tetrahedra[:, 3]]
        return np.abs(np.einsum("ij,ij->i", v1 - v0, np.cross(v2 - v0, v3 - v0))) / 6

    def _compute_triangle_areas(
        self,
        vertices: NDArray[np.float64],
        triangles: NDArray[np.int32],
    ) -> NDArray[np.float64]:
        """Compute areas for an array of triangles.

        Automatically handles 2D (shoelace formula) and 3D (cross product) cases.

        Parameters
        ----------
        vertices : ndarray
            Vertex coordinates, shape (N, 2) or (N, 3).
        triangles : ndarray
            Triangle connectivity, shape (M, 3).

        Returns
        -------
        ndarray
            Area of each triangle, shape (M,).

        """
        v0 = vertices[triangles[:, 0]]
        v1 = vertices[triangles[:, 1]]
        v2 = vertices[triangles[:, 2]]

        if self._kind == MeshKind.TRIANGULAR_2D:
            # 2D: use shoelace formula
            return 0.5 * np.abs(
                (v1[:, 0] - v0[:, 0]) * (v2[:, 1] - v0[:, 1])
                - (v2[:, 0] - v0[:, 0]) * (v1[:, 1] - v0[:, 1]),
            )
        # 3D: use cross product magnitude
        return 0.5 * np.linalg.norm(np.cross(v1 - v0, v2 - v0), axis=1)

    def get_bounds(self) -> tuple[NDArray[np.float64], NDArray[np.float64]]:
        """Get the bounding box of the mesh.

        Returns
        -------
        tuple[ndarray, ndarray]
            Tuple of (min_coords, max_coords), each shape (3,) for 3D
            or (2,) for 2D meshes.

        Raises
        ------
        ValueError
            If the mesh has no vertices.

        Examples
        --------
        >>> mesh = Mesh(vertices, cells)
        >>> min_pt, max_pt = mesh.get_bounds()
        >>> print(f"Size: {max_pt - min_pt}")

        """
        vertices = self.get_vertices()
        if len(vertices) == 0:
            msg = "Cannot compute bounds for mesh with no vertices"
            raise ValueError(msg)
        return vertices.min(axis=0), vertices.max(axis=0)

    def get_center_of_mass(self) -> NDArray[np.float64]:
        """Get the centroid (center of mass) of the mesh.

        For volume meshes, computes volume-weighted centroid.
        For surface meshes, computes area-weighted centroid.
        For 2D meshes, computes area-weighted centroid.

        Returns
        -------
        ndarray
            Centroid coordinates, shape (3,) for 3D or (2,) for 2D.

        Examples
        --------
        >>> mesh = Mesh(vertices, cells)
        >>> center = mesh.get_center_of_mass()
        >>> print(f"Center: {center}")

        """
        vertices = self.get_vertices()

        if self._kind == MeshKind.TETRAHEDRAL:
            tetrahedra = self.get_tetrahedra()
            if len(tetrahedra) == 0:
                return vertices.mean(axis=0)

            volumes = self._compute_tetrahedra_volumes(vertices, tetrahedra)
            v0 = vertices[tetrahedra[:, 0]]
            v1 = vertices[tetrahedra[:, 1]]
            v2 = vertices[tetrahedra[:, 2]]
            v3 = vertices[tetrahedra[:, 3]]
            centroids = (v0 + v1 + v2 + v3) / 4
            total_volume = volumes.sum()

            if total_volume < np.finfo(np.float64).tiny:
                return vertices.mean(axis=0)

            return (centroids * volumes[:, np.newaxis]).sum(axis=0) / total_volume

        triangles = self.get_triangles()
        if len(triangles) == 0:
            return vertices.mean(axis=0)

        areas = self._compute_triangle_areas(vertices, triangles)
        v0 = vertices[triangles[:, 0]]
        v1 = vertices[triangles[:, 1]]
        v2 = vertices[triangles[:, 2]]
        centroids = (v0 + v1 + v2) / 3
        total_area = areas.sum()

        if total_area < np.finfo(np.float64).tiny:
            return vertices.mean(axis=0)

        return (centroids * areas[:, np.newaxis]).sum(axis=0) / total_area

    def compute_volume(self) -> float:
        """Compute the total volume of the mesh.

        Only available for 3D volume meshes (TETRAHEDRAL).

        Returns
        -------
        float
            Total volume in mesh units cubed.

        Raises
        ------
        TypeError
            If mesh is not a 3D volume mesh.

        Examples
        --------
        >>> mesh = Mesh(vertices, cells)
        >>> volume = mesh.compute_volume()
        >>> print(f"Volume: {volume:.2f} mm^3")

        """
        if self._kind != MeshKind.TETRAHEDRAL:
            msg = "compute_volume() is only available for TETRAHEDRAL meshes"
            raise TypeError(msg)

        vertices = self.get_vertices()
        tetrahedra = self.get_tetrahedra()

        if len(tetrahedra) == 0:
            return 0.0

        volumes = self._compute_tetrahedra_volumes(vertices, tetrahedra)
        return float(volumes.sum())

    def compute_surface_area(self) -> float:
        """Compute the total surface area of the mesh.

        For volume meshes (TETRAHEDRAL), computes boundary surface area
        (triangles stored in the mesh represent boundary faces).
        For surface meshes (TRIANGULAR_SURFACE), computes total area.
        For 2D meshes (TRIANGULAR_2D), computes total area.

        Returns
        -------
        float
            Total surface area in mesh units squared.

        Examples
        --------
        >>> mesh = Mesh(vertices, cells)
        >>> area = mesh.compute_surface_area()
        >>> print(f"Surface area: {area:.2f} mm^2")

        """
        vertices = self.get_vertices()
        triangles = self.get_triangles()

        if len(triangles) == 0:
            return 0.0

        areas = self._compute_triangle_areas(vertices, triangles)
        return float(areas.sum())

    def get_diagonal(self) -> float:
        """Get the diagonal length of the bounding box.

        Returns
        -------
        float
            The diagonal length of the bounding box.

        Raises
        ------
        ValueError
            If the mesh has no vertices.

        Examples
        --------
        >>> mesh = Mesh(vertices, cells)
        >>> diagonal = mesh.get_diagonal()
        >>> print(f"Bounding box diagonal: {diagonal:.2f}")

        """
        min_pt, max_pt = self.get_bounds()
        return float(np.linalg.norm(max_pt - min_pt))

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

    def _prepare_field_transfer(
        self,
        transfer_fields: FieldTransferParam,
    ) -> tuple[
        dict[str, NDArray[np.float64]],
        NDArray[np.float64] | None,
        NDArray[np.int32] | None,
    ]:
        """Prepare for field transfer before remeshing.

        Returns fields to transfer, old vertices, and old elements.
        """
        fields_to_transfer: dict[str, NDArray[np.float64]] = {}
        if not transfer_fields:
            return fields_to_transfer, None, None

        if transfer_fields is True:
            fields_to_transfer = dict(self._user_fields)
        else:
            for name in transfer_fields:
                if name in self._user_fields:
                    fields_to_transfer[name] = self._user_fields[name]
                else:
                    msg = f"User field '{name}' not found for transfer"
                    raise KeyError(msg)

        if not fields_to_transfer:
            return fields_to_transfer, None, None

        old_vertices = self._impl.get_vertices().copy()
        if self._kind == MeshKind.TETRAHEDRAL:
            impl_3d = cast("MmgMesh3D", self._impl)
            old_elements = impl_3d.get_tetrahedra().copy()
        else:
            old_elements = self._impl.get_triangles().copy()

        return fields_to_transfer, old_vertices, old_elements

    def _execute_field_transfer(
        self,
        fields_to_transfer: dict[str, NDArray[np.float64]],
        old_vertices: NDArray[np.float64],
        old_elements: NDArray[np.int32],
        interpolation: str,
    ) -> None:
        """Execute field transfer after remeshing."""
        from mmgpy._transfer import transfer_fields as _transfer  # noqa: PLC0415

        new_vertices = self._impl.get_vertices()
        self._user_fields = _transfer(
            source_vertices=old_vertices,
            source_elements=old_elements,
            target_points=new_vertices,
            fields=fields_to_transfer,
            method=interpolation,
        )

    def remesh(  # noqa: C901, PLR0912
        self,
        options: Mmg3DOptions | Mmg2DOptions | MmgSOptions | None = None,
        *,
        progress: ProgressParam = True,
        transfer_fields: FieldTransferParam = False,
        interpolation: str = "linear",
        **kwargs: Any,  # noqa: ANN401
    ) -> RemeshResult:
        """Remesh the mesh in-place.

        Parameters
        ----------
        options : Mmg3DOptions | Mmg2DOptions | MmgSOptions, optional
            Options object for remeshing parameters.
        progress : bool | Callable[[ProgressEvent], bool] | None, default=True
            Progress reporting option:
            - True: Show Rich progress bar (default)
            - False or None: No progress reporting
            - Callable: Custom callback that receives ProgressEvent and returns
              True to continue or False to cancel
        transfer_fields : bool | Sequence[str] | None, default=False
            Transfer user-defined fields to the new mesh via interpolation:
            - False or None: No field transfer (default), clears existing user fields
            - True: Transfer all user fields
            - List of field names: Transfer only specified fields
        interpolation : str, default="linear"
            Interpolation method for field transfer:
            - "linear": Barycentric interpolation (recommended)
            - "nearest": Nearest vertex value
        **kwargs : float
            Individual remeshing parameters (hmin, hmax, hsiz, hausd, etc.).

        Notes
        -----
        Memory: When ``transfer_fields`` is enabled, the original mesh vertices
        and elements are copied before remeshing, temporarily doubling memory
        usage for large meshes.

        Surface meshes (TRIANGULAR_SURFACE): Field transfer uses 3D Delaunay
        triangulation for point location, which may not work well for nearly
        planar surface meshes. Consider using volumetric meshes for field transfer.

        Returns
        -------
        RemeshResult
            Statistics from the remeshing operation.

        Raises
        ------
        CancellationError
            If the progress callback returns False to cancel the operation.

        Examples
        --------
        >>> mesh.remesh(hmax=0.1)  # Shows progress bar by default

        >>> mesh.remesh(hmax=0.1, progress=False)  # No progress bar

        >>> # Transfer fields during remeshing
        >>> mesh.set_user_field("temperature", temperature_array)
        >>> mesh.remesh(hmax=0.1, transfer_fields=True)
        >>> new_temp = mesh.get_user_field("temperature")

        >>> # Transfer specific fields
        >>> mesh.remesh(hmax=0.1, transfer_fields=["temperature", "velocity"])

        >>> def my_callback(event):
        ...     print(f"{event.phase}: {event.message}")
        ...     return True  # Continue
        >>> mesh.remesh(hmax=0.1, progress=my_callback)

        """
        from mmgpy._options import (  # noqa: PLC0415
            Mmg2DOptions,
            Mmg3DOptions,
            MmgSOptions,
        )
        from mmgpy._progress import CancellationError, _emit_event  # noqa: PLC0415

        # Validate interpolation method
        valid_methods = ("linear", "nearest")
        if interpolation not in valid_methods:
            msg = (
                f"Invalid interpolation method: {interpolation!r}. "
                f"Must be one of {valid_methods}"
            )
            raise ValueError(msg)

        # Validate and convert options object
        if options is not None:
            if kwargs:
                msg = (
                    "Cannot pass both options object and keyword arguments. "
                    "Use one or the other."
                )
                raise TypeError(msg)

            # Validate options type matches mesh type
            options_type_map = {
                MeshKind.TETRAHEDRAL: Mmg3DOptions,
                MeshKind.TRIANGULAR_2D: Mmg2DOptions,
                MeshKind.TRIANGULAR_SURFACE: MmgSOptions,
            }
            expected_type = options_type_map[self._kind]
            if not isinstance(options, expected_type):
                msg = (
                    f"Expected {expected_type.__name__} for {self._kind.value} mesh, "
                    f"got {type(options).__name__}"
                )
                raise TypeError(msg)
            kwargs = options.to_dict()

        # Apply sizing constraints before remeshing
        if self._sizing_constraints:
            self._apply_sizing_to_metric()

        # Prepare field transfer
        fields_to_transfer, old_vertices, old_elements = self._prepare_field_transfer(
            transfer_fields,
        )

        # Resolve progress callback
        callback, reporter_ctx = _resolve_progress_callback(progress)
        if reporter_ctx is not None:  # pragma: no cover
            reporter_ctx.__enter__()

        try:
            # Emit progress events
            if not _emit_event(callback, "init", "start", "Initializing", progress=0.0):
                raise CancellationError.for_phase("init")  # noqa: EM101

            initial_vertices = len(self._impl.get_vertices())

            if not _emit_event(callback, "options", "start", "Options", progress=0.0):
                raise CancellationError.for_phase("options")  # noqa: EM101

            _emit_event(callback, "options", "complete", "Options set", progress=1.0)

            if not _emit_event(callback, "remesh", "start", "Remeshing", progress=0.0):
                raise CancellationError.for_phase("remesh")  # noqa: EM101

            # Call raw C++ method and convert result
            stats = self._impl.remesh(**kwargs)  # type: ignore[arg-type]
            final_vertices = len(self._impl.get_vertices())

            # Transfer fields to new mesh if captured, otherwise clear stale fields
            if (
                fields_to_transfer
                and old_vertices is not None
                and old_elements is not None
            ):
                self._execute_field_transfer(
                    fields_to_transfer,
                    old_vertices,
                    old_elements,
                    interpolation,
                )
            else:
                # Clear user fields as they have incorrect vertex count after remeshing
                self._user_fields.clear()

            _emit_event(
                callback,
                "remesh",
                "complete",
                "Remeshing complete",
                progress=1.0,
                details={
                    "initial_vertices": initial_vertices,
                    "final_vertices": final_vertices,
                    "vertex_change": final_vertices - initial_vertices,
                },
            )
            return _dict_to_remesh_result(stats)
        finally:
            if reporter_ctx is not None:  # pragma: no cover
                reporter_ctx.__exit__(None, None, None)

    def remesh_lagrangian(
        self,
        displacement: NDArray[np.float64],
        *,
        progress: ProgressParam = True,
        **kwargs: Any,  # noqa: ANN401
    ) -> RemeshResult:
        """Remesh with Lagrangian motion.

        Only available for TETRAHEDRAL and TRIANGULAR_2D meshes.

        Parameters
        ----------
        displacement : ndarray
            Displacement field for each vertex.
        progress : bool | Callable[[ProgressEvent], bool] | None, default=True
            Progress reporting option:
            - True: Show Rich progress bar (default)
            - False or None: No progress reporting
            - Callable: Custom callback that receives ProgressEvent and returns
              True to continue or False to cancel
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
        CancellationError
            If the progress callback returns False to cancel the operation.

        """
        from mmgpy._progress import CancellationError, _emit_event  # noqa: PLC0415

        if self._kind == MeshKind.TRIANGULAR_SURFACE:
            msg = "remesh_lagrangian() is not available for TRIANGULAR_SURFACE meshes"
            raise TypeError(msg)

        callback, reporter_ctx = _resolve_progress_callback(progress)
        if reporter_ctx is not None:  # pragma: no cover
            reporter_ctx.__enter__()

        try:
            if not _emit_event(callback, "init", "start", "Initializing", progress=0.0):
                raise CancellationError.for_phase("init")  # noqa: EM101

            initial_vertices = len(self._impl.get_vertices())

            if not _emit_event(
                callback,
                "options",
                "start",
                "Displacement",
                progress=0.0,
            ):
                raise CancellationError.for_phase("options")  # noqa: EM101

            _emit_event(
                callback,
                "options",
                "complete",
                "Displacement set",
                progress=1.0,
            )

            if not _emit_event(
                callback,
                "remesh",
                "start",
                "Lagrangian remeshing",
                progress=0.0,
            ):
                raise CancellationError.for_phase("remesh")  # noqa: EM101

            impl = cast("MmgMesh3D | MmgMesh2D", self._impl)
            stats = impl.remesh_lagrangian(displacement, **kwargs)  # type: ignore[arg-type]
            final_vertices = len(self._impl.get_vertices())

            _emit_event(
                callback,
                "remesh",
                "complete",
                "Lagrangian complete",
                progress=1.0,
                details={
                    "initial_vertices": initial_vertices,
                    "final_vertices": final_vertices,
                    "vertex_change": final_vertices - initial_vertices,
                },
            )
            return _dict_to_remesh_result(stats)
        finally:
            if reporter_ctx is not None:  # pragma: no cover
                reporter_ctx.__exit__(None, None, None)

    def remesh_levelset(
        self,
        levelset: NDArray[np.float64],
        *,
        progress: ProgressParam = True,
        **kwargs: Any,  # noqa: ANN401
    ) -> RemeshResult:
        """Remesh with level-set discretization.

        Parameters
        ----------
        levelset : ndarray
            Level-set field for each vertex.
        progress : bool | Callable[[ProgressEvent], bool] | None, default=True
            Progress reporting option:
            - True: Show Rich progress bar (default)
            - False or None: No progress reporting
            - Callable: Custom callback that receives ProgressEvent and returns
              True to continue or False to cancel
        **kwargs : float
            Additional remeshing parameters.

        Returns
        -------
        RemeshResult
            Statistics from the remeshing operation.

        Raises
        ------
        CancellationError
            If the progress callback returns False to cancel the operation.

        """
        from mmgpy._progress import CancellationError, _emit_event  # noqa: PLC0415

        callback, reporter_ctx = _resolve_progress_callback(progress)
        if reporter_ctx is not None:  # pragma: no cover
            reporter_ctx.__enter__()

        try:
            if not _emit_event(callback, "init", "start", "Initializing", progress=0.0):
                raise CancellationError.for_phase("init")  # noqa: EM101

            initial_vertices = len(self._impl.get_vertices())

            if not _emit_event(callback, "options", "start", "Level-set", progress=0.0):
                raise CancellationError.for_phase("options")  # noqa: EM101

            _emit_event(callback, "options", "complete", "Level-set set", progress=1.0)

            if not _emit_event(
                callback,
                "remesh",
                "start",
                "Level-set remeshing",
                progress=0.0,
            ):
                raise CancellationError.for_phase("remesh")  # noqa: EM101

            stats = self._impl.remesh_levelset(levelset, **kwargs)  # type: ignore[arg-type]
            final_vertices = len(self._impl.get_vertices())

            _emit_event(
                callback,
                "remesh",
                "complete",
                "Level-set complete",
                progress=1.0,
                details={
                    "initial_vertices": initial_vertices,
                    "final_vertices": final_vertices,
                    "vertex_change": final_vertices - initial_vertices,
                },
            )
            return _dict_to_remesh_result(stats)
        finally:
            if reporter_ctx is not None:  # pragma: no cover
                reporter_ctx.__exit__(None, None, None)

    def remesh_optimize(
        self,
        *,
        progress: ProgressParam = True,
        verbose: int | None = None,
    ) -> RemeshResult:
        """Optimize mesh quality without changing topology.

        Only moves vertices to improve element quality.
        No points are inserted or removed.

        Parameters
        ----------
        progress : bool | Callable[[ProgressEvent], bool] | None, default=True
            Progress reporting option:
            - True: Show Rich progress bar (default)
            - False or None: No progress reporting
            - Callable: Custom callback
        verbose : int | None
            Verbosity level (-1=silent, 0=errors, 1=info).

        Returns
        -------
        RemeshResult
            Statistics from the remeshing operation.

        """
        opts: dict[str, int | float] = {"optim": 1, "noinsert": 1}
        if verbose is not None:
            opts["verbose"] = verbose
        return self.remesh(progress=progress, **opts)  # type: ignore[arg-type]

    def remesh_uniform(
        self,
        size: float,
        *,
        progress: ProgressParam = True,
        verbose: int | None = None,
    ) -> RemeshResult:
        """Remesh with uniform element size.

        Parameters
        ----------
        size : float
            Target edge size for all elements.
        progress : bool | Callable[[ProgressEvent], bool] | None, default=True
            Progress reporting option:
            - True: Show Rich progress bar (default)
            - False or None: No progress reporting
            - Callable: Custom callback
        verbose : int | None
            Verbosity level (-1=silent, 0=errors, 1=info).

        Returns
        -------
        RemeshResult
            Statistics from the remeshing operation.

        """
        opts: dict[str, int | float] = {"hsiz": size}
        if verbose is not None:
            opts["verbose"] = verbose
        return self.remesh(progress=progress, **opts)  # type: ignore[arg-type]

    # =========================================================================
    # Local sizing constraints
    # =========================================================================

    def set_size_sphere(
        self,
        center: Sequence[float] | NDArray[np.float64],
        radius: float,
        size: float,
    ) -> None:
        """Set target edge size within a spherical region.

        Parameters
        ----------
        center : array-like
            Center point of the sphere.
        radius : float
            Radius of the sphere.
        size : float
            Target edge size within the sphere.

        """
        from mmgpy.sizing import SphereSize  # noqa: PLC0415

        center_arr = np.asarray(center, dtype=np.float64)
        self._sizing_constraints.append(SphereSize(center_arr, radius, size))

    def set_size_box(
        self,
        bounds: Sequence[Sequence[float]] | NDArray[np.float64],
        size: float,
    ) -> None:
        """Set target edge size within a box region.

        Parameters
        ----------
        bounds : array-like
            Bounding box as [[xmin, ymin, zmin], [xmax, ymax, zmax]].
        size : float
            Target edge size within the box.

        """
        from mmgpy.sizing import BoxSize  # noqa: PLC0415

        bounds_arr = np.asarray(bounds, dtype=np.float64)
        self._sizing_constraints.append(BoxSize(bounds_arr, size))

    def set_size_cylinder(
        self,
        point1: Sequence[float] | NDArray[np.float64],
        point2: Sequence[float] | NDArray[np.float64],
        radius: float,
        size: float,
    ) -> None:
        """Set target edge size within a cylindrical region.

        Only available for TETRAHEDRAL and TRIANGULAR_SURFACE meshes.

        Parameters
        ----------
        point1 : array-like
            First endpoint of the cylinder axis.
        point2 : array-like
            Second endpoint of the cylinder axis.
        radius : float
            Radius of the cylinder.
        size : float
            Target edge size within the cylinder.

        Raises
        ------
        TypeError
            If mesh is TRIANGULAR_2D.

        """
        if self._kind == MeshKind.TRIANGULAR_2D:
            msg = "set_size_cylinder() is not available for TRIANGULAR_2D meshes"
            raise TypeError(msg)

        from mmgpy.sizing import CylinderSize  # noqa: PLC0415

        point1_arr = np.asarray(point1, dtype=np.float64)
        point2_arr = np.asarray(point2, dtype=np.float64)
        self._sizing_constraints.append(
            CylinderSize(point1_arr, point2_arr, radius, size),
        )

    def set_size_from_point(
        self,
        point: Sequence[float] | NDArray[np.float64],
        near_size: float,
        far_size: float,
        influence_radius: float,
    ) -> None:
        """Set target edge size based on distance from a point.

        Parameters
        ----------
        point : array-like
            Reference point.
        near_size : float
            Target edge size at the reference point.
        far_size : float
            Target edge size at the influence radius.
        influence_radius : float
            Radius of influence.

        """
        from mmgpy.sizing import PointSize  # noqa: PLC0415

        point_arr = np.asarray(point, dtype=np.float64)
        self._sizing_constraints.append(
            PointSize(point_arr, near_size, far_size, influence_radius),
        )

    def clear_local_sizing(self) -> None:
        """Clear all local sizing constraints."""
        self._sizing_constraints.clear()

    def get_local_sizing_count(self) -> int:
        """Get the number of local sizing constraints.

        Returns
        -------
        int
            Number of sizing constraints.

        """
        return len(self._sizing_constraints)

    def apply_local_sizing(self) -> None:
        """Apply local sizing constraints to the metric field.

        This is called automatically before remeshing if sizing
        constraints have been added.
        """
        self._apply_sizing_to_metric()

    def _apply_sizing_to_metric(self) -> None:
        """Apply sizing constraints to the metric field."""
        if not self._sizing_constraints:
            return

        from mmgpy.sizing import apply_sizing_constraints  # noqa: PLC0415

        # apply_sizing_constraints expects a mesh object and sets the field directly
        apply_sizing_constraints(self._impl, self._sizing_constraints)

    # =========================================================================
    # PyVista conversion
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
        from mmgpy._pyvista import to_pyvista as _to_pyvista  # noqa: PLC0415

        return _to_pyvista(self._impl, include_refs=include_refs)

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
        from mmgpy._validation import (  # noqa: PLC0415
            ValidationError,
            validate_mesh_2d,
            validate_mesh_3d,
            validate_mesh_surface,
        )

        # Dispatch to the correct validation function based on mesh kind
        if self._kind == MeshKind.TETRAHEDRAL:
            report = validate_mesh_3d(
                cast("MmgMesh3D", self._impl),
                check_geometry=check_geometry,
                check_topology=check_topology,
                check_quality=check_quality,
                min_quality=min_quality,
            )
        elif self._kind == MeshKind.TRIANGULAR_2D:
            report = validate_mesh_2d(
                cast("MmgMesh2D", self._impl),
                check_geometry=check_geometry,
                check_topology=check_topology,
                check_quality=check_quality,
                min_quality=min_quality,
            )
        else:  # TRIANGULAR_SURFACE
            report = validate_mesh_surface(
                cast("MmgMeshS", self._impl),
                check_geometry=check_geometry,
                check_topology=check_topology,
                check_quality=check_quality,
                min_quality=min_quality,
            )

        # Handle strict mode - raise on any issues
        if strict and (report.errors or report.warnings):
            raise ValidationError(report)

        # Return report or boolean based on detailed flag
        if detailed:
            return report
        return report.is_valid

    # =========================================================================
    # Interactive editing
    # =========================================================================

    def edit_sizing(
        self,
        *,
        mode: str = "sphere",
        default_size: float = 0.01,
        default_radius: float = 0.1,
    ) -> None:
        """Launch interactive sizing editor.

        Opens a PyVista window for visually defining local sizing
        constraints by clicking on the mesh.

        Parameters
        ----------
        mode : str
            Initial interaction mode: "sphere", "box", "cylinder", or "point".
        default_size : float
            Default target edge size for constraints.
        default_radius : float
            Default radius for sphere and cylinder constraints.

        Examples
        --------
        >>> mesh = Mesh(vertices, cells)
        >>> mesh.edit_sizing()  # Opens interactive editor
        >>> mesh.remesh()  # Uses interactively defined sizing

        """
        from mmgpy.interactive import SizingEditor  # noqa: PLC0415

        editor = SizingEditor(self._impl)
        editor._current_size = default_size  # noqa: SLF001
        editor._current_radius = default_radius  # noqa: SLF001

        mode_map = {
            "sphere": editor.add_sphere_tool,
            "box": editor.add_box_tool,
            "cylinder": editor.add_cylinder_tool,
            "point": editor.add_point_tool,
        }

        if mode in mode_map:
            mode_map[mode]()

        editor.run()
        editor.apply_to_mesh()

    # =========================================================================
    # Context manager support
    # =========================================================================

    def __enter__(self) -> Mesh:  # noqa: PYI034
        """Enter the context manager.

        Returns
        -------
        Mesh
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

        Notes
        -----
        The checkpoint stores a complete copy of the mesh data including
        vertices, elements, reference markers, and solution fields
        (metric, displacement, levelset). For large meshes, this may
        consume significant memory.

        Note: The tensor field is not saved because it shares memory with
        metric in MMG's internal representation.

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

        # Save solution fields (metric, displacement, levelset)
        # Note: tensor is not saved because it shares memory with metric in MMG
        fields: dict[str, NDArray[np.float64]] = {}
        for field_name in ("metric", "displacement", "levelset"):
            field_data = self._try_get_field(field_name)
            if field_data is not None:
                fields[field_name] = field_data.copy()

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
            _fields=fields,
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
            # No cleanup needed - working mesh is garbage collected automatically
            # when it goes out of scope. The finally block is kept for future
            # extensibility (e.g., releasing resources or logging).
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
