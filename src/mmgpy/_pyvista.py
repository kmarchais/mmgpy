"""PyVista integration for mmgpy mesh classes.

This module provides conversion functions between PyVista mesh types
and mmgpy mesh classes.

Example:
    >>> import pyvista as pv
    >>> from mmgpy import MmgMesh3D, from_pyvista, to_pyvista
    >>>
    >>> # Load mesh and convert to mmgpy
    >>> grid = pv.read("mesh.vtk")
    >>> mesh = from_pyvista(grid)
    >>>
    >>> # Remesh and convert back
    >>> mesh.remesh(hmax=0.1)
    >>> result = to_pyvista(mesh)

"""

from __future__ import annotations

from typing import TYPE_CHECKING, overload

import numpy as np
import pyvista as pv

from mmgpy._mmgpy import MmgMesh2D, MmgMesh3D, MmgMeshS

if TYPE_CHECKING:
    from numpy.typing import NDArray

_DIMS_2D = 2
_DIMS_3D = 3
_TRIANGLE_VERTS = 3
_2D_DETECTION_TOLERANCE = 1e-8


def _is_2d_mesh(points: NDArray[np.floating]) -> bool:
    """Check if points are essentially 2D (z coordinates are zero or near-zero)."""
    if points.shape[1] == _DIMS_2D:
        return True
    if points.shape[1] == _DIMS_3D:
        z_coords = points[:, 2]
        return bool(np.allclose(z_coords, 0, atol=_2D_DETECTION_TOLERANCE))
    return False


def _extract_triangles_from_polydata(mesh: pv.PolyData) -> NDArray[np.int32]:
    """Extract triangle connectivity from PolyData faces array."""
    if hasattr(mesh, "cells_dict") and pv.CellType.TRIANGLE in mesh.cells_dict:
        return mesh.cells_dict[pv.CellType.TRIANGLE].astype(np.int32)

    faces = mesh.faces
    if len(faces) == 0:
        msg = "PolyData has no faces"
        raise ValueError(msg)

    triangles = []
    i = 0
    while i < len(faces):
        n_verts = faces[i]
        if n_verts != _TRIANGLE_VERTS:
            msg = f"Expected triangles (3 vertices), got {n_verts}-vertex polygon"
            raise ValueError(msg)
        triangles.append(faces[i + 1 : i + 4])
        i += n_verts + 1

    return np.array(triangles, dtype=np.int32)


def _from_pyvista_to_mmg3d(mesh: pv.UnstructuredGrid) -> MmgMesh3D:
    """Convert UnstructuredGrid with tetrahedra to MmgMesh3D."""
    if pv.CellType.TETRA not in mesh.cells_dict:
        msg = "UnstructuredGrid must contain tetrahedra (CellType.TETRA)"
        raise ValueError(msg)

    vertices = np.array(mesh.points, dtype=np.float64)
    elements = mesh.cells_dict[pv.CellType.TETRA].astype(np.int32)

    return MmgMesh3D(vertices, elements)


def _from_pyvista_to_mmg2d(mesh: pv.PolyData) -> MmgMesh2D:
    """Convert PolyData with 2D triangles to MmgMesh2D."""
    points = np.array(mesh.points, dtype=np.float64)
    if points.shape[1] == _DIMS_3D:
        vertices = np.ascontiguousarray(points[:, :2])
    else:
        vertices = points
    triangles = _extract_triangles_from_polydata(mesh)

    return MmgMesh2D(vertices, triangles)


def _from_pyvista_to_mmgs(mesh: pv.PolyData) -> MmgMeshS:
    """Convert PolyData with 3D surface triangles to MmgMeshS."""
    vertices = np.array(mesh.points, dtype=np.float64)
    triangles = _extract_triangles_from_polydata(mesh)

    return MmgMeshS(vertices, triangles)


def _from_pyvista_with_explicit_type(
    mesh: pv.UnstructuredGrid | pv.PolyData,
    mesh_type: type[MmgMesh3D | MmgMesh2D | MmgMeshS],
) -> MmgMesh3D | MmgMesh2D | MmgMeshS:
    """Convert PyVista mesh to mmgpy mesh with explicit type."""
    if mesh_type is MmgMesh3D:
        if not isinstance(mesh, pv.UnstructuredGrid):
            msg = "MmgMesh3D requires UnstructuredGrid input"
            raise ValueError(msg)
        return _from_pyvista_to_mmg3d(mesh)

    if mesh_type is MmgMesh2D:
        if not isinstance(mesh, pv.PolyData):
            msg = "MmgMesh2D requires PolyData input"
            raise ValueError(msg)
        return _from_pyvista_to_mmg2d(mesh)

    if mesh_type is MmgMeshS:
        if not isinstance(mesh, pv.PolyData):
            msg = "MmgMeshS requires PolyData input"
            raise ValueError(msg)
        return _from_pyvista_to_mmgs(mesh)

    msg = f"Unknown mesh type: {mesh_type}"
    raise ValueError(msg)


def _from_pyvista_auto_detect(
    mesh: pv.UnstructuredGrid | pv.PolyData,
) -> MmgMesh3D | MmgMesh2D | MmgMeshS:
    """Convert PyVista mesh to mmgpy mesh with auto-detection."""
    if isinstance(mesh, pv.UnstructuredGrid):
        if pv.CellType.TETRA in mesh.cells_dict:
            return _from_pyvista_to_mmg3d(mesh)
        msg = "UnstructuredGrid must contain tetrahedra for auto-detection"
        raise ValueError(msg)

    if isinstance(mesh, pv.PolyData):
        if _is_2d_mesh(mesh.points):
            return _from_pyvista_to_mmg2d(mesh)
        return _from_pyvista_to_mmgs(mesh)

    msg = f"Unsupported PyVista mesh type: {type(mesh)}"
    raise TypeError(msg)


@overload
def from_pyvista(
    mesh: pv.UnstructuredGrid | pv.PolyData,
    mesh_type: type[MmgMesh3D],
) -> MmgMesh3D: ...


@overload
def from_pyvista(
    mesh: pv.UnstructuredGrid | pv.PolyData,
    mesh_type: type[MmgMesh2D],
) -> MmgMesh2D: ...


@overload
def from_pyvista(
    mesh: pv.UnstructuredGrid | pv.PolyData,
    mesh_type: type[MmgMeshS],
) -> MmgMeshS: ...


@overload
def from_pyvista(
    mesh: pv.UnstructuredGrid | pv.PolyData,
    mesh_type: None = None,
) -> MmgMesh3D | MmgMesh2D | MmgMeshS: ...


def from_pyvista(
    mesh: pv.UnstructuredGrid | pv.PolyData,
    mesh_type: type[MmgMesh3D | MmgMesh2D | MmgMeshS] | None = None,
) -> MmgMesh3D | MmgMesh2D | MmgMeshS:
    """Convert a PyVista mesh to an mmgpy mesh.

    Args:
        mesh: PyVista mesh (UnstructuredGrid or PolyData).
        mesh_type: Target mesh class. If None, auto-detects based on:
            - UnstructuredGrid with tetrahedra → MmgMesh3D
            - PolyData with 2D points (z≈0) → MmgMesh2D
            - PolyData with 3D points → MmgMeshS

    Returns:
        The appropriate mmgpy mesh instance.

    Raises:
        ValueError: If mesh type cannot be determined or is incompatible.

    Note:
        When auto-detecting mesh type for PolyData, a mesh is considered 2D
        (and converted to MmgMesh2D) if all z-coordinates are within 1e-8 of zero.
        For thin 3D meshes near z=0, explicitly specify ``mesh_type=MmgMeshS``.

    Example:
        >>> import pyvista as pv
        >>> from mmgpy import from_pyvista, MmgMeshS
        >>>
        >>> # Auto-detect mesh type
        >>> grid = pv.read("tetra_mesh.vtk")
        >>> mesh3d = from_pyvista(grid)
        >>>
        >>> # Explicit mesh type for thin 3D surfaces
        >>> surface = pv.read("surface.stl")
        >>> mesh_s = from_pyvista(surface, MmgMeshS)

    """
    if mesh_type is not None:
        return _from_pyvista_with_explicit_type(mesh, mesh_type)
    return _from_pyvista_auto_detect(mesh)


@overload
def to_pyvista(
    mesh: MmgMesh3D,
    *,
    include_refs: bool = True,
) -> pv.UnstructuredGrid: ...


@overload
def to_pyvista(
    mesh: MmgMesh2D,
    *,
    include_refs: bool = True,
) -> pv.PolyData: ...


@overload
def to_pyvista(
    mesh: MmgMeshS,
    *,
    include_refs: bool = True,
) -> pv.PolyData: ...


def to_pyvista(
    mesh: MmgMesh3D | MmgMesh2D | MmgMeshS,
    *,
    include_refs: bool = True,
) -> pv.UnstructuredGrid | pv.PolyData:
    """Convert an mmgpy mesh to a PyVista mesh.

    Args:
        mesh: mmgpy mesh instance (MmgMesh3D, MmgMesh2D, or MmgMeshS).
        include_refs: If True, include element references as cell_data.

    Returns:
        PyVista mesh:
            - MmgMesh3D → UnstructuredGrid with tetrahedra
            - MmgMesh2D → PolyData with triangular faces (z=0)
            - MmgMeshS → PolyData with triangular faces

    Raises:
        TypeError: If mesh is not an mmgpy mesh type.

    Example:
        >>> from mmgpy import MmgMesh3D, to_pyvista
        >>>
        >>> mesh = MmgMesh3D(vertices, elements)
        >>> mesh.remesh(hmax=0.1)
        >>> grid = to_pyvista(mesh)
        >>> grid.plot()

    """
    if isinstance(mesh, MmgMesh3D):
        return _mmg3d_to_pyvista(mesh, include_refs=include_refs)
    if isinstance(mesh, MmgMesh2D):
        return _mmg2d_to_pyvista(mesh, include_refs=include_refs)
    if isinstance(mesh, MmgMeshS):
        return _mmgs_to_pyvista(mesh, include_refs=include_refs)

    msg = f"Unsupported mesh type: {type(mesh)}"
    raise TypeError(msg)


def _mmg3d_to_pyvista(mesh: MmgMesh3D, *, include_refs: bool) -> pv.UnstructuredGrid:
    """Convert MmgMesh3D to PyVista UnstructuredGrid."""
    vertices = mesh.get_vertices()

    if include_refs:
        elements, refs = mesh.get_elements_with_refs()
    else:
        elements = mesh.get_elements()
        refs = None

    grid = pv.UnstructuredGrid({pv.CellType.TETRA: elements}, vertices)

    if refs is not None:
        grid.cell_data["refs"] = refs

    return grid


def _mmg2d_to_pyvista(mesh: MmgMesh2D, *, include_refs: bool) -> pv.PolyData:
    """Convert MmgMesh2D to PyVista PolyData."""
    vertices_2d = mesh.get_vertices()
    vertices_3d = np.column_stack([vertices_2d, np.zeros(len(vertices_2d))])

    if include_refs:
        triangles, refs = mesh.get_triangles_with_refs()
    else:
        triangles = mesh.get_triangles()
        refs = None

    faces = np.hstack(
        [np.full((len(triangles), 1), _TRIANGLE_VERTS), triangles],
    ).ravel()
    polydata = pv.PolyData(vertices_3d, faces=faces)

    if refs is not None:
        polydata.cell_data["refs"] = refs

    return polydata


def _mmgs_to_pyvista(mesh: MmgMeshS, *, include_refs: bool) -> pv.PolyData:
    """Convert MmgMeshS to PyVista PolyData."""
    vertices = mesh.get_vertices()

    if include_refs:
        triangles, refs = mesh.get_triangles_with_refs()
    else:
        triangles = mesh.get_triangles()
        refs = None

    faces = np.hstack(
        [np.full((len(triangles), 1), _TRIANGLE_VERTS), triangles],
    ).ravel()
    polydata = pv.PolyData(vertices, faces=faces)

    if refs is not None:
        polydata.cell_data["refs"] = refs

    return polydata


def _mmg3d_from_pyvista(
    cls: type[MmgMesh3D],  # noqa: ARG001
    mesh: pv.UnstructuredGrid | pv.PolyData,
) -> MmgMesh3D:
    """Create MmgMesh3D from a PyVista mesh."""
    if not isinstance(mesh, pv.UnstructuredGrid):
        msg = "MmgMesh3D.from_pyvista requires UnstructuredGrid input"
        raise TypeError(msg)
    return _from_pyvista_to_mmg3d(mesh)


def _mmg2d_from_pyvista(
    cls: type[MmgMesh2D],  # noqa: ARG001
    mesh: pv.UnstructuredGrid | pv.PolyData,
) -> MmgMesh2D:
    """Create MmgMesh2D from a PyVista mesh."""
    if not isinstance(mesh, pv.PolyData):
        msg = "MmgMesh2D.from_pyvista requires PolyData input"
        raise TypeError(msg)
    return _from_pyvista_to_mmg2d(mesh)


def _mmgs_from_pyvista(
    cls: type[MmgMeshS],  # noqa: ARG001
    mesh: pv.UnstructuredGrid | pv.PolyData,
) -> MmgMeshS:
    """Create MmgMeshS from a PyVista mesh."""
    if not isinstance(mesh, pv.PolyData):
        msg = "MmgMeshS.from_pyvista requires PolyData input"
        raise TypeError(msg)
    return _from_pyvista_to_mmgs(mesh)


def _mmg3d_to_pyvista_method(
    self: MmgMesh3D,
    *,
    include_refs: bool = True,
) -> pv.UnstructuredGrid:
    """Convert MmgMesh3D to a PyVista UnstructuredGrid."""
    return _mmg3d_to_pyvista(self, include_refs=include_refs)


def _mmg2d_to_pyvista_method(
    self: MmgMesh2D,
    *,
    include_refs: bool = True,
) -> pv.PolyData:
    """Convert MmgMesh2D to a PyVista PolyData."""
    return _mmg2d_to_pyvista(self, include_refs=include_refs)


def _mmgs_to_pyvista_method(
    self: MmgMeshS,
    *,
    include_refs: bool = True,
) -> pv.PolyData:
    """Convert MmgMeshS to a PyVista PolyData."""
    return _mmgs_to_pyvista(self, include_refs=include_refs)


def add_pyvista_methods() -> None:
    """Add PyVista methods to mesh classes.

    Call this function to add `from_pyvista` classmethod and `to_pyvista`
    instance method to MmgMesh3D, MmgMesh2D, and MmgMeshS classes.

    These methods are automatically called at import time.
    """
    # Add classmethods - type ignores needed for monkey-patching pybind11 classes
    MmgMesh3D.from_pyvista = classmethod(_mmg3d_from_pyvista)  # type: ignore[attr-defined]
    MmgMesh2D.from_pyvista = classmethod(_mmg2d_from_pyvista)  # type: ignore[attr-defined]
    MmgMeshS.from_pyvista = classmethod(_mmgs_from_pyvista)  # type: ignore[attr-defined]

    # Add instance methods
    MmgMesh3D.to_pyvista = _mmg3d_to_pyvista_method  # type: ignore[attr-defined]
    MmgMesh2D.to_pyvista = _mmg2d_to_pyvista_method  # type: ignore[attr-defined]
    MmgMeshS.to_pyvista = _mmgs_to_pyvista_method  # type: ignore[attr-defined]


__all__ = ["add_pyvista_methods", "from_pyvista", "to_pyvista"]
