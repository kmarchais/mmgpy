"""Unified mesh I/O for mmgpy.

This module provides a unified `read()` function that can load meshes from
any file format supported by meshio, or directly from PyVista objects.

For Medit format (.mesh) files, native MMG loading is used to preserve
MMG-specific keywords like Ridges, RequiredVertices, Tangents, and reference
markers that meshio does not understand.

Example:
    >>> import mmgpy
    >>>
    >>> # Read from various file formats
    >>> mesh = mmgpy.read("mesh.vtk")
    >>> mesh = mmgpy.read("mesh.msh")   # Gmsh
    >>> mesh = mmgpy.read("mesh.stl")   # STL surface
    >>> mesh = mmgpy.read("mesh.mesh")  # Medit (native MMG loading)
    >>>
    >>> # Read from PyVista object
    >>> import pyvista as pv
    >>> pv_mesh = pv.read("mesh.vtk")
    >>> mesh = mmgpy.read(pv_mesh)

"""

from __future__ import annotations

import logging
import re
from pathlib import Path
from typing import TYPE_CHECKING

import meshio
import numpy as np
import pyvista as pv

from mmgpy._mesh import _DIMS_2D, _DIMS_3D, MeshKind, _is_2d_points
from mmgpy._mmgpy import MmgMesh2D, MmgMesh3D, MmgMeshS

logger = logging.getLogger("mmgpy")

_MEDIT_KEYWORD_ONLY_PATTERN = re.compile(r"^\s*(\w+)\s*$", re.IGNORECASE)
_MEDIT_DIMENSION_INLINE_PATTERN = re.compile(
    r"^\s*dimension\s+(\d+)\s*$",
    re.IGNORECASE,
)
_MEDIT_DIMENSION_VALUE_PATTERN = re.compile(r"^\s*(\d+)\s*$")


def _parse_medit_header(path: Path) -> tuple[int | None, bool, bool]:
    """Parse Medit file header to extract dimension and element types.

    Handles both inline format ("Dimension 3") and multi-line format.

    Returns
    -------
    tuple[int | None, bool, bool]
        (dimension, has_tetrahedra, has_triangles)

    """
    dimension = None
    has_tetrahedra = False
    has_triangles = False

    with path.open(encoding="utf-8", errors="replace") as f:
        for raw_line in f:
            stripped = raw_line.strip()
            if not stripped or stripped.startswith("#"):
                continue

            # Check for inline "Dimension N" format first
            dim_inline = _MEDIT_DIMENSION_INLINE_PATTERN.match(stripped)
            if dim_inline:
                dimension = int(dim_inline.group(1))
                continue

            # Check for keyword-only format
            keyword_match = _MEDIT_KEYWORD_ONLY_PATTERN.match(stripped)
            if not keyword_match:
                continue

            keyword = keyword_match.group(1).lower()
            if keyword == "dimension":
                next_line = next(f, "").strip()
                val_match = _MEDIT_DIMENSION_VALUE_PATTERN.match(next_line)
                if val_match:
                    dimension = int(val_match.group(1))
            elif keyword == "tetrahedra":
                has_tetrahedra = True
            elif keyword == "triangles":
                has_triangles = True

            # Stop early only if we found tetrahedra (volumetric mesh)
            # Continue scanning if only triangles found (might have tetrahedra later)
            if dimension is not None and has_tetrahedra:
                break

    return dimension, has_tetrahedra, has_triangles


def _detect_medit_mesh_kind(path: Path) -> MeshKind:
    """Detect mesh kind from Medit (.mesh) file header.

    Parses the file to find the Dimension keyword and check for element types.

    Parameters
    ----------
    path : Path
        Path to the .mesh file.

    Returns
    -------
    MeshKind
        Detected mesh kind.

    Raises
    ------
    ValueError
        If mesh kind cannot be determined.

    """
    dimension, has_tetrahedra, has_triangles = _parse_medit_header(path)

    if dimension == _DIMS_3D and has_tetrahedra:
        return MeshKind.TETRAHEDRAL
    if dimension == _DIMS_2D and has_triangles:
        return MeshKind.TRIANGULAR_2D
    if dimension == _DIMS_3D and has_triangles:
        return MeshKind.TRIANGULAR_SURFACE

    msg = f"Cannot determine mesh kind from file: {path}"
    raise ValueError(msg)


def _load_medit_native(
    path: Path,
    mesh_kind: MeshKind | None,
) -> MmgMesh3D | MmgMesh2D | MmgMeshS:
    """Load a Medit (.mesh) file using native MMG loading.

    Uses the native MMG*_loadMesh functions which preserve MMG-specific
    keywords like Ridges, RequiredVertices, Tangents, and reference markers.

    Parameters
    ----------
    path : Path
        Path to the .mesh file.
    mesh_kind : MeshKind | None
        Force a specific mesh kind, or None for auto-detection.

    Returns
    -------
    MmgMesh3D | MmgMesh2D | MmgMeshS
        The loaded mesh implementation.

    Raises
    ------
    ValueError
        If mesh kind cannot be determined.
    RuntimeError
        If loading fails.

    """
    if mesh_kind is None:
        mesh_kind = _detect_medit_mesh_kind(path)

    path_str = str(path)

    if mesh_kind == MeshKind.TETRAHEDRAL:
        return MmgMesh3D(path_str)
    if mesh_kind == MeshKind.TRIANGULAR_2D:
        return MmgMesh2D(path_str)
    if mesh_kind == MeshKind.TRIANGULAR_SURFACE:
        return MmgMeshS(path_str)

    msg = f"Unknown mesh_kind: {mesh_kind}"
    raise ValueError(msg)


if TYPE_CHECKING:
    from mmgpy._mesh import Mesh

# Element types that indicate volumetric 3D meshes (only tetrahedra supported by MMG)
_VOLUME_CELL_TYPES = frozenset(
    {
        "tetra",
        "tetra10",
    },
)

# Element types that would be volumetric but are NOT supported by MMG
_UNSUPPORTED_VOLUME_TYPES = frozenset(
    {
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

# Non-triangular surface cell types that need triangulation
_NON_TRIANGLE_SURFACE_TYPES = frozenset(
    {
        "quad",
        "quad8",
        "quad9",
    },
)

_TRIANGULATION_WARNING = (
    "Input mesh contains non-triangular elements (quads, polygons). "
    "Converting to triangles. Note: output will always be triangular "
    "as MMG only supports triangular elements."
)


def _has_non_triangle_cells(mesh: meshio.Mesh) -> bool:
    """Check if meshio mesh has non-triangular surface cells."""
    cell_types = {block.type for block in mesh.cells}
    return bool(cell_types & _NON_TRIANGLE_SURFACE_TYPES)


def _meshio_to_pyvista_polydata(mesh: meshio.Mesh) -> pv.PolyData:
    """Convert meshio mesh to PyVista PolyData for triangulation."""
    # Ensure points are in native byte order (meshio may use big-endian)
    points = np.ascontiguousarray(mesh.points, dtype=np.float64)
    cells = []
    for block in mesh.cells:
        if block.type in _SURFACE_CELL_TYPES:
            n_verts = block.data.shape[1]
            for cell in block.data:
                cells.extend([n_verts, *cell])
    if not cells:
        msg = "No surface cells found in mesh"
        raise ValueError(msg)
    return pv.PolyData(points, faces=cells)


def _detect_mesh_kind(mesh: meshio.Mesh) -> MeshKind:
    """Detect mesh kind from meshio mesh based on cell types and point dimensions.

    Returns:
        MeshKind.TETRAHEDRAL for volumetric meshes with tetrahedra
        MeshKind.TRIANGULAR_SURFACE for 3D surface meshes (triangles in 3D space)
        MeshKind.TRIANGULAR_2D for planar 2D meshes (triangles with z~=0)

    Raises:
        ValueError: If mesh contains unsupported element types (hexahedra, etc.)

    """
    cell_types = {block.type for block in mesh.cells}

    # Check for unsupported volumetric elements
    unsupported = cell_types & _UNSUPPORTED_VOLUME_TYPES
    if unsupported:
        msg = (
            f"Unsupported element types: {unsupported}. "
            "MMG only supports tetrahedral (3D), triangular (2D/surface) meshes."
        )
        raise ValueError(msg)

    # Check for supported volumetric elements (tetrahedra)
    if cell_types & _VOLUME_CELL_TYPES:
        return MeshKind.TETRAHEDRAL

    # Check for surface elements
    if cell_types & _SURFACE_CELL_TYPES:
        if _is_2d_points(mesh.points):
            return MeshKind.TRIANGULAR_2D
        return MeshKind.TRIANGULAR_SURFACE

    msg = f"Cannot determine mesh kind from cell types: {cell_types}"
    raise ValueError(msg)


def _meshio_to_mmg3d(mesh: meshio.Mesh) -> MmgMesh3D:
    """Convert meshio mesh to MmgMesh3D."""
    vertices = np.ascontiguousarray(mesh.points, dtype=np.float64)

    # Collect all tetrahedra blocks
    tetra_blocks = [block.data for block in mesh.cells if block.type == "tetra"]

    if not tetra_blocks:
        msg = "No tetrahedra found in mesh"
        raise ValueError(msg)

    # Concatenate all tetrahedra blocks
    tetrahedra = np.ascontiguousarray(
        np.vstack(tetra_blocks) if len(tetra_blocks) > 1 else tetra_blocks[0],
        dtype=np.int32,
    )

    return MmgMesh3D(vertices, tetrahedra)


def _extract_triangles_from_polydata(pv_mesh: pv.PolyData) -> np.ndarray:
    """Extract triangle connectivity from triangulated PolyData."""
    faces = pv_mesh.faces
    n_triangles = pv_mesh.n_cells
    triangles = np.empty((n_triangles, 3), dtype=np.int32)
    idx = 0
    for i in range(n_triangles):
        n_verts = faces[idx]
        triangles[i] = faces[idx + 1 : idx + 4]
        idx += n_verts + 1
    return triangles


def _meshio_to_mmg2d(mesh: meshio.Mesh) -> MmgMesh2D:
    """Convert meshio mesh to MmgMesh2D."""
    if _has_non_triangle_cells(mesh):
        logger.warning(_TRIANGULATION_WARNING)
        pv_mesh = _meshio_to_pyvista_polydata(mesh)
        pv_mesh = pv_mesh.triangulate()
        points = np.array(pv_mesh.points, dtype=np.float64)
        if points.shape[1] == _DIMS_3D:
            vertices = np.ascontiguousarray(points[:, :2])
        else:
            vertices = np.ascontiguousarray(points)
        triangles = _extract_triangles_from_polydata(pv_mesh)
        return MmgMesh2D(vertices, triangles)

    points = mesh.points

    # Extract 2D vertices (drop z if present)
    if points.shape[1] == _DIMS_3D:
        vertices = np.ascontiguousarray(points[:, :2], dtype=np.float64)
    else:
        vertices = np.ascontiguousarray(points, dtype=np.float64)

    # Collect all triangle blocks
    tri_blocks = [block.data for block in mesh.cells if block.type == "triangle"]

    if not tri_blocks:
        msg = "No triangles found in mesh"
        raise ValueError(msg)

    # Concatenate all triangle blocks
    triangles = np.ascontiguousarray(
        np.vstack(tri_blocks) if len(tri_blocks) > 1 else tri_blocks[0],
        dtype=np.int32,
    )

    return MmgMesh2D(vertices, triangles)


def _meshio_to_mmgs(mesh: meshio.Mesh) -> MmgMeshS:
    """Convert meshio mesh to MmgMeshS."""
    if _has_non_triangle_cells(mesh):
        logger.warning(_TRIANGULATION_WARNING)
        pv_mesh = _meshio_to_pyvista_polydata(mesh)
        pv_mesh = pv_mesh.triangulate()
        vertices = np.array(pv_mesh.points, dtype=np.float64)
        triangles = _extract_triangles_from_polydata(pv_mesh)
        return MmgMeshS(vertices, triangles)

    vertices = np.ascontiguousarray(mesh.points, dtype=np.float64)

    # Collect all triangle blocks
    tri_blocks = [block.data for block in mesh.cells if block.type == "triangle"]

    if not tri_blocks:
        msg = "No triangles found in mesh"
        raise ValueError(msg)

    # Concatenate all triangle blocks
    triangles = np.ascontiguousarray(
        np.vstack(tri_blocks) if len(tri_blocks) > 1 else tri_blocks[0],
        dtype=np.int32,
    )

    return MmgMeshS(vertices, triangles)


def _convert_meshio(
    mesh: meshio.Mesh,
    mesh_kind: MeshKind | None,
) -> MmgMesh3D | MmgMesh2D | MmgMeshS:
    """Convert meshio mesh to appropriate mmgpy mesh type."""
    if mesh_kind is None:
        mesh_kind = _detect_mesh_kind(mesh)

    if mesh_kind == MeshKind.TETRAHEDRAL:
        return _meshio_to_mmg3d(mesh)
    if mesh_kind == MeshKind.TRIANGULAR_2D:
        return _meshio_to_mmg2d(mesh)
    if mesh_kind == MeshKind.TRIANGULAR_SURFACE:
        return _meshio_to_mmgs(mesh)

    msg = f"Unknown mesh_kind: {mesh_kind}"
    raise ValueError(msg)


def read(
    source: str | Path | pv.UnstructuredGrid | pv.PolyData,
    mesh_kind: MeshKind | None = None,
) -> Mesh:
    """Read a mesh from a file or PyVista object.

    This function provides unified mesh loading from any format supported by
    meshio (40+ formats including VTK, Gmsh, STL, OBJ, etc.) or directly from
    PyVista mesh objects.

    For Medit format (.mesh) files, native MMG loading is used to preserve
    MMG-specific keywords like Ridges, RequiredVertices, Tangents, and
    reference markers that meshio does not understand.

    Args:
        source: File path (str or Path) or PyVista mesh object.
        mesh_kind: Force a specific mesh kind instead of auto-detection.
            - MeshKind.TETRAHEDRAL: 3D volumetric mesh
            - MeshKind.TRIANGULAR_2D: 2D planar mesh
            - MeshKind.TRIANGULAR_SURFACE: 3D surface mesh
            - None: Auto-detect based on element types and coordinates

    Returns:
        A Mesh instance with the appropriate kind.

    Raises:
        ValueError: If mesh kind cannot be determined or file cannot be read.
        TypeError: If source type is not supported.
        FileNotFoundError: If file does not exist.

    Auto-detection logic:
        - Has tetrahedra → TETRAHEDRAL
        - Has triangles + 3D coords → TRIANGULAR_SURFACE
        - Has triangles + 2D coords (or z~=0) -> TRIANGULAR_2D

    Supported file formats:
        - Medit: .mesh (native MMG loading, preserves all MMG keywords)
        - VTK: .vtk, .vtu, .vtp (via meshio)
        - Gmsh: .msh (via meshio)
        - STL: .stl (via meshio)
        - OBJ: .obj (via meshio)
        - PLY: .ply (via meshio)
        - And many more via meshio...

    Example:
        >>> import mmgpy
        >>>
        >>> # Auto-detect mesh kind from file
        >>> mesh = mmgpy.read("tetra_mesh.vtk")
        >>> mesh.kind  # MeshKind.TETRAHEDRAL
        >>>
        >>> # Force specific mesh kind
        >>> mesh = mmgpy.read("mesh.vtk", mesh_kind=MeshKind.TRIANGULAR_SURFACE)
        >>>
        >>> # Read Medit file with native loading (preserves Ridges, etc.)
        >>> mesh = mmgpy.read("mesh.mesh")
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
        mesh_class = _mesh_kind_to_class(mesh_kind) if mesh_kind else None
        impl = from_pyvista(source, mesh_class)
        kind = _impl_to_kind(impl)
        return Mesh._from_impl(impl, kind)  # noqa: SLF001

    # Handle file paths
    if isinstance(source, str | Path):
        path = Path(source)
        if not path.exists():
            msg = f"File not found: {path}"
            raise FileNotFoundError(msg)

        # Use native MMG loading for Medit format to preserve MMG-specific
        # keywords (Ridges, RequiredVertices, Tangents, reference markers)
        suffix = path.suffix.lower()
        if suffix == ".mesh":
            impl = _load_medit_native(path, mesh_kind)
            kind = _impl_to_kind(impl)
            return Mesh._from_impl(impl, kind)  # noqa: SLF001

        # Use meshio for other formats
        meshio_mesh = meshio.read(path)
        impl = _convert_meshio(meshio_mesh, mesh_kind)
        kind = _impl_to_kind(impl)
        return Mesh._from_impl(impl, kind)  # noqa: SLF001

    msg = f"Unsupported source type: {type(source)}"
    raise TypeError(msg)


def _mesh_kind_to_class(
    mesh_kind: MeshKind,
) -> type[MmgMesh3D | MmgMesh2D | MmgMeshS]:
    """Convert MeshKind enum to mesh class."""
    if mesh_kind == MeshKind.TETRAHEDRAL:
        return MmgMesh3D
    if mesh_kind == MeshKind.TRIANGULAR_2D:
        return MmgMesh2D
    if mesh_kind == MeshKind.TRIANGULAR_SURFACE:
        return MmgMeshS
    msg = f"Unknown mesh_kind: {mesh_kind}"
    raise ValueError(msg)


def _impl_to_kind(
    impl: MmgMesh3D | MmgMesh2D | MmgMeshS,
) -> MeshKind:
    """Convert implementation type to MeshKind."""
    if isinstance(impl, MmgMesh3D):
        return MeshKind.TETRAHEDRAL
    if isinstance(impl, MmgMesh2D):
        return MeshKind.TRIANGULAR_2D
    if isinstance(impl, MmgMeshS):
        return MeshKind.TRIANGULAR_SURFACE
    msg = f"Unknown implementation type: {type(impl)}"
    raise TypeError(msg)


__all__ = ["read"]
