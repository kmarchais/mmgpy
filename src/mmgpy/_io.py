"""Unified mesh I/O for mmgpy.

This module provides a unified `read()` function that can load meshes from
any file format supported by PyVista, or directly from PyVista objects.

For Medit format (.mesh) files, native MMG loading is used to preserve
MMG-specific keywords like Ridges, RequiredVertices, Tangents, and reference
markers.

Example:
    >>> import mmgpy
    >>>
    >>> # Read from various file formats
    >>> mesh = mmgpy.read("mesh.vtk")
    >>> mesh = mmgpy.read("mesh.vtu")
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

import numpy as np
import pyvista as pv

from mmgpy._mesh import _DIMS_2D, _DIMS_3D, MeshKind
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


def read(
    source: str | Path | pv.UnstructuredGrid | pv.PolyData,
    mesh_kind: MeshKind | None = None,
) -> Mesh:
    """Read a mesh from a file or PyVista object.

    This function provides unified mesh loading from any format supported by
    PyVista or directly from PyVista mesh objects.

    For Medit format (.mesh) files, native MMG loading is used to preserve
    MMG-specific keywords like Ridges, RequiredVertices, Tangents, and
    reference markers.

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
        - Medit: .mesh, .meshb (native MMG loading, preserves all MMG keywords)
        - VTK: .vtk, .vtu, .vtp (via PyVista)
        - STL: .stl (via PyVista)
        - OBJ: .obj (via PyVista)
        - PLY: .ply (via PyVista)
        - And many more via PyVista...

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
    from mmgpy._mesh import Mesh, _LazyFieldSource  # noqa: PLC0415
    from mmgpy._pyvista import from_pyvista  # noqa: PLC0415

    # MMG field names are routed to C++ — exclude from lazy source
    _mmg_fields = frozenset({"metric", "displacement", "levelset", "tensor"})

    # Handle PyVista objects
    if isinstance(source, pv.UnstructuredGrid | pv.PolyData):
        mesh_class = _mesh_kind_to_class(mesh_kind) if mesh_kind else None
        impl = from_pyvista(source, mesh_class)
        kind = _impl_to_kind(impl)
        point_data = {
            k: np.asarray(source.point_data[k])
            for k in source.point_data
            if k not in _mmg_fields
        }
        lazy = _LazyFieldSource(point_data) if point_data else None
        return Mesh._from_impl(impl, kind, lazy_source=lazy)  # noqa: SLF001

    # Handle file paths
    if isinstance(source, str | Path):
        path = Path(source)
        if not path.exists():
            msg = f"File not found: {path}"
            raise FileNotFoundError(msg)

        # Use native MMG loading for Medit format to preserve MMG-specific
        # keywords (Ridges, RequiredVertices, Tangents, reference markers)
        suffix = path.suffix.lower()
        if suffix in (".mesh", ".meshb"):
            impl = _load_medit_native(path, mesh_kind)
            kind = _impl_to_kind(impl)
            return Mesh._from_impl(impl, kind)  # noqa: SLF001

        # Use PyVista for other formats
        pv_mesh: pv.UnstructuredGrid | pv.PolyData = pv.read(path)  # type: ignore[assignment]
        mesh_class = _mesh_kind_to_class(mesh_kind) if mesh_kind else None
        impl = from_pyvista(pv_mesh, mesh_class)
        kind = _impl_to_kind(impl)
        point_data = {
            k: np.asarray(pv_mesh.point_data[k])
            for k in pv_mesh.point_data
            if k not in _mmg_fields
        }
        lazy = _LazyFieldSource(point_data) if point_data else None
        return Mesh._from_impl(impl, kind, lazy_source=lazy)  # noqa: SLF001

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
