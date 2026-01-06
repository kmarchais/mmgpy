"""Unified mesh I/O for mmgpy.

This module provides a unified `read()` function that can load meshes from
any file format supported by meshio, or directly from PyVista objects.

Example:
    >>> import mmgpy
    >>>
    >>> # Read from various file formats
    >>> mesh = mmgpy.read("mesh.vtk")
    >>> mesh = mmgpy.read("mesh.msh")   # Gmsh
    >>> mesh = mmgpy.read("mesh.stl")   # STL surface
    >>>
    >>> # Read from PyVista object
    >>> import pyvista as pv
    >>> pv_mesh = pv.read("mesh.vtk")
    >>> mesh = mmgpy.read(pv_mesh)

"""

from __future__ import annotations

from pathlib import Path
from typing import TYPE_CHECKING, Literal

import meshio
import numpy as np
import pyvista as pv

from mmgpy._mmgpy import MmgMesh2D, MmgMesh3D, MmgMeshS

if TYPE_CHECKING:
    from numpy.typing import NDArray

    from mmgpy._mesh import Mesh, MeshKind

# Element types that indicate volumetric 3D meshes
_VOLUME_CELL_TYPES = frozenset(
    {
        "tetra",
        "tetra10",
        "hexahedron",
        "hexahedron20",
        "hexahedron27",
        "wedge",
        "wedge15",
        "pyramid",
        "pyramid13",
    },
)

# Element types that indicate surface meshes
_SURFACE_CELL_TYPES = frozenset(
    {
        "triangle",
        "triangle6",
        "quad",
        "quad8",
        "quad9",
    },
)

_DIMS_2D = 2
_DIMS_3D = 3
_2D_DETECTION_TOLERANCE = 1e-8

MeshType = Literal["2d", "3d", "surface"]


def _is_2d_points(points: NDArray[np.floating]) -> bool:
    """Check if points are essentially 2D (z coordinates are zero or near-zero)."""
    if points.shape[1] == _DIMS_2D:
        return True
    if points.shape[1] == _DIMS_3D:
        z_coords = points[:, 2]
        return bool(np.allclose(z_coords, 0, atol=_2D_DETECTION_TOLERANCE))
    return False


def _detect_mesh_type(mesh: meshio.Mesh) -> MeshType:
    """Detect mesh type from meshio mesh based on cell types and point dimensions.

    Returns:
        "3d" for volumetric meshes (tetrahedra, hexahedra, etc.)
        "surface" for 3D surface meshes (triangles in 3D space)
        "2d" for planar 2D meshes (triangles with 2D or z≈0 coordinates)

    """
    cell_types = {block.type for block in mesh.cells}

    # Check for volumetric elements
    if cell_types & _VOLUME_CELL_TYPES:
        return "3d"

    # Check for surface elements
    if cell_types & _SURFACE_CELL_TYPES:
        if _is_2d_points(mesh.points):
            return "2d"
        return "surface"

    msg = f"Cannot determine mesh type from cell types: {cell_types}"
    raise ValueError(msg)


def _meshio_to_mmg3d(mesh: meshio.Mesh) -> MmgMesh3D:
    """Convert meshio mesh to MmgMesh3D."""
    vertices = np.ascontiguousarray(mesh.points, dtype=np.float64)

    # Find tetrahedra
    tetrahedra = None
    for block in mesh.cells:
        if block.type == "tetra":
            tetrahedra = np.ascontiguousarray(block.data, dtype=np.int32)
            break

    if tetrahedra is None:
        msg = "No tetrahedra found in mesh"
        raise ValueError(msg)

    return MmgMesh3D(vertices, tetrahedra)


def _meshio_to_mmg2d(mesh: meshio.Mesh) -> MmgMesh2D:
    """Convert meshio mesh to MmgMesh2D."""
    points = mesh.points

    # Extract 2D vertices (drop z if present)
    if points.shape[1] == _DIMS_3D:
        vertices = np.ascontiguousarray(points[:, :2], dtype=np.float64)
    else:
        vertices = np.ascontiguousarray(points, dtype=np.float64)

    # Find triangles
    triangles = None
    for block in mesh.cells:
        if block.type == "triangle":
            triangles = np.ascontiguousarray(block.data, dtype=np.int32)
            break

    if triangles is None:
        msg = "No triangles found in mesh"
        raise ValueError(msg)

    return MmgMesh2D(vertices, triangles)


def _meshio_to_mmgs(mesh: meshio.Mesh) -> MmgMeshS:
    """Convert meshio mesh to MmgMeshS."""
    vertices = np.ascontiguousarray(mesh.points, dtype=np.float64)

    # Find triangles
    triangles = None
    for block in mesh.cells:
        if block.type == "triangle":
            triangles = np.ascontiguousarray(block.data, dtype=np.int32)
            break

    if triangles is None:
        msg = "No triangles found in mesh"
        raise ValueError(msg)

    return MmgMeshS(vertices, triangles)


def _convert_meshio(
    mesh: meshio.Mesh,
    mesh_type: MeshType | None,
) -> MmgMesh3D | MmgMesh2D | MmgMeshS:
    """Convert meshio mesh to appropriate mmgpy mesh type."""
    if mesh_type is None:
        mesh_type = _detect_mesh_type(mesh)

    if mesh_type == "3d":
        return _meshio_to_mmg3d(mesh)
    if mesh_type == "2d":
        return _meshio_to_mmg2d(mesh)
    if mesh_type == "surface":
        return _meshio_to_mmgs(mesh)

    msg = f"Unknown mesh_type: {mesh_type}"
    raise ValueError(msg)


def read(
    source: str | Path | pv.UnstructuredGrid | pv.PolyData,
    mesh_type: MeshType | None = None,
) -> Mesh:
    """Read a mesh from a file or PyVista object.

    This function provides unified mesh loading from any format supported by
    meshio (40+ formats including VTK, Gmsh, STL, OBJ, etc.) or directly from
    PyVista mesh objects.

    Args:
        source: File path (str or Path) or PyVista mesh object.
        mesh_type: Force a specific mesh type instead of auto-detection.
            - "3d": Return Mesh with TETRAHEDRAL kind
            - "2d": Return Mesh with TRIANGULAR_2D kind
            - "surface": Return Mesh with TRIANGULAR_SURFACE kind
            - None: Auto-detect based on element types and coordinates

    Returns:
        A Mesh instance with the appropriate kind.

    Raises:
        ValueError: If mesh type cannot be determined or file cannot be read.
        TypeError: If source type is not supported.

    Auto-detection logic:
        - Has tetrahedra/hexahedra → TETRAHEDRAL
        - Has triangles + 3D coords → TRIANGULAR_SURFACE
        - Has triangles + 2D coords (or z≈0) → TRIANGULAR_2D

    Supported file formats (via meshio):
        - VTK: .vtk, .vtu, .vtp
        - Gmsh: .msh
        - Medit: .mesh
        - STL: .stl
        - OBJ: .obj
        - PLY: .ply
        - And many more...

    Example:
        >>> import mmgpy
        >>>
        >>> # Auto-detect mesh type from file
        >>> mesh = mmgpy.read("tetra_mesh.vtk")
        >>> mesh.kind  # MeshKind.TETRAHEDRAL
        >>>
        >>> # Read from PyVista object
        >>> import pyvista as pv
        >>> grid = pv.read("mesh.vtk")
        >>> mesh = mmgpy.read(grid)

    """
    # Import here to avoid circular imports
    from mmgpy._mesh import Mesh  # noqa: PLC0415
    from mmgpy._pyvista import from_pyvista  # noqa: PLC0415

    # Handle PyVista objects
    if isinstance(source, pv.UnstructuredGrid | pv.PolyData):
        mesh_class = _mesh_type_to_class(mesh_type) if mesh_type else None
        impl = from_pyvista(source, mesh_class)
        kind = _impl_to_kind(impl)
        return Mesh._from_impl(impl, kind)  # noqa: SLF001

    # Handle file paths
    if isinstance(source, str | Path):
        path = Path(source)
        if not path.exists():
            msg = f"File not found: {path}"
            raise FileNotFoundError(msg)

        meshio_mesh = meshio.read(path)
        impl = _convert_meshio(meshio_mesh, mesh_type)
        kind = _impl_to_kind(impl)
        return Mesh._from_impl(impl, kind)  # noqa: SLF001

    msg = f"Unsupported source type: {type(source)}"
    raise TypeError(msg)


def _mesh_type_to_class(
    mesh_type: MeshType,
) -> type[MmgMesh3D | MmgMesh2D | MmgMeshS]:
    """Convert mesh_type string to mesh class."""
    if mesh_type == "3d":
        return MmgMesh3D
    if mesh_type == "2d":
        return MmgMesh2D
    if mesh_type == "surface":
        return MmgMeshS
    msg = f"Unknown mesh_type: {mesh_type}"
    raise ValueError(msg)


def _impl_to_kind(
    impl: MmgMesh3D | MmgMesh2D | MmgMeshS,
) -> MeshKind:
    """Convert implementation type to MeshKind."""
    # Import here to avoid circular imports
    from mmgpy._mesh import MeshKind  # noqa: PLC0415

    if isinstance(impl, MmgMesh3D):
        return MeshKind.TETRAHEDRAL
    if isinstance(impl, MmgMesh2D):
        return MeshKind.TRIANGULAR_2D
    if isinstance(impl, MmgMeshS):
        return MeshKind.TRIANGULAR_SURFACE
    msg = f"Unknown implementation type: {type(impl)}"
    raise TypeError(msg)


__all__ = ["read"]
