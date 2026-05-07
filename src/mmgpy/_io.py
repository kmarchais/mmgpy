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


def _load_meshb_by_trial(
    path: Path,
) -> tuple[MmgMesh3D | MmgMesh2D | MmgMeshS, MeshKind]:
    """Detect mesh kind for a binary .meshb file by trial loading.

    The text header parser does not handle binary files, so we trial-load
    the file with each MMG class in priority order. A class is considered
    a match when it yields a non-empty population of its primary element
    type (tetrahedra for 3D, triangles for surface and 2D). Vertex count
    alone is insufficient: a surface ``.meshb`` will load non-empty under
    ``MmgMesh3D`` with zero tetrahedra, so falling back to triangle/vertex
    counts on later candidates is required to route it to ``MmgMeshS``.

    Construction errors from a candidate class (corrupt or unsupported
    binary content) are caught so the next candidate gets a chance; if
    every candidate either errors or returns empty, a ``ValueError`` is
    raised describing the file.
    """
    path_str = str(path)
    candidates: tuple[
        tuple[
            type[MmgMesh3D | MmgMesh2D | MmgMeshS],
            MeshKind,
            str,
        ],
        ...,
    ] = (
        (MmgMesh3D, MeshKind.TETRAHEDRAL, "get_tetrahedra"),
        (MmgMeshS, MeshKind.TRIANGULAR_SURFACE, "get_triangles"),
        (MmgMesh2D, MeshKind.TRIANGULAR_2D, "get_vertices"),
    )
    last_error: Exception | None = None
    for cls, kind, probe_attr in candidates:
        try:
            impl = cls(path_str)
        except (RuntimeError, OSError, ValueError) as exc:
            last_error = exc
            continue
        if getattr(impl, probe_attr)().shape[0] > 0:
            return impl, kind

    msg = f"Cannot determine mesh kind from binary file: {path}"
    if last_error is not None:
        raise ValueError(msg) from last_error
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
        if path.suffix.lower() == ".meshb":
            impl, _ = _load_meshb_by_trial(path)
            return impl
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


def _read_mesh_internal(
    source: str | Path | pv.UnstructuredGrid | pv.PolyData,
    mesh_kind: MeshKind | None = None,
) -> Mesh:
    """Read a mesh and return the internal :class:`Mesh` wrapper.

    Internal entry point used by the ``.mmg`` accessor and other in-package
    consumers that need a :class:`Mesh` to drive sizing / user-field state.
    External users should construct a PyVista dataset (``pv.read`` or any
    other PyVista path) and use the ``.mmg`` accessor.
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


def read(
    source: str | Path | pv.UnstructuredGrid | pv.PolyData,
    mesh_kind: MeshKind | None = None,
) -> pv.UnstructuredGrid | pv.PolyData:
    """Read a mesh and return a PyVista dataset.

    .. deprecated:: 0.13
        Use :func:`pyvista.read` instead. With ``mmgpy`` installed,
        ``pv.read('foo.mesh')`` works for Medit files via the registered
        reader plugin and returns the same PyVista dataset. ``mmgpy.read``
        will be removed in 0.14.

    The returned dataset carries the ``.mmg`` accessor for MMG operations,
    e.g. ``dataset.mmg.remesh(hsiz=0.1)``.
    """
    import warnings  # noqa: PLC0415

    warnings.warn(
        "mmgpy.read() is deprecated and will be removed in 0.14. "
        "Use pyvista.read() instead; with mmgpy installed it handles .mesh "
        "and .meshb via the registered reader plugin and returns the same "
        "PyVista dataset.",
        DeprecationWarning,
        stacklevel=2,
    )

    mesh = _read_mesh_internal(source, mesh_kind)
    pv_mesh = mesh.to_pyvista(include_refs=True, include_edges=True)

    # Forward any user point_data from the source / lazy field cache.
    user_fields = mesh.get_user_fields()
    for name, arr in user_fields.items():
        if arr.shape[0] == pv_mesh.n_points:
            pv_mesh.point_data[name] = arr

    return pv_mesh


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
