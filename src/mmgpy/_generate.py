"""mmg2d mesh generation from boundary edges.

The C entry point ``MMG2D_mmg2dmesh`` triangulates a vertex+edge input when
no triangles are supplied (see ``src/bindings/mmg_mesh_2d.cpp`` near the
``"mesh generation from edges"`` branch). This module exposes that mode as
a documented Python API.
"""

from __future__ import annotations

from typing import TYPE_CHECKING, Any

import numpy as np

from mmgpy._mmgpy import MmgMesh2D

if TYPE_CHECKING:
    import pyvista as pv
    from numpy.typing import ArrayLike


_DIMS_2D = 2
_EDGE_VERTS = 2


def generate(  # noqa: PLR0913  -- the standard MMG sizing knobs are explicit by design
    boundary_vertices: ArrayLike,
    boundary_edges: ArrayLike,
    *,
    refs: ArrayLike | None = None,
    hmin: float | None = None,
    hmax: float | None = None,
    hausd: float | None = None,
    hgrad: float | None = None,
    **opts: Any,  # noqa: ANN401  -- forwarded to MmgMesh2D.remesh
) -> pv.PolyData:
    """Triangulate a 2D domain from its boundary edges.

    When MMG2D is fed a vertex+edge input with no triangles, it switches to
    its mesh-generation path (``MMG2D_mmg2dmesh``) and produces a Delaunay
    triangulation that conforms to the supplied edges. ``generate`` exposes
    that path directly so callers can build a 2D mesh from a polygon outline
    without going through a ``.mesh`` file.

    Parameters
    ----------
    boundary_vertices : array_like, shape ``(n, 2)``
        Vertex coordinates in the plane.
    boundary_edges : array_like, shape ``(m, 2)``
        Edge connectivity (zero-indexed) into ``boundary_vertices``.
    refs : array_like, shape ``(m,)``, optional
        Per-edge reference markers. Useful for tagging different boundary
        segments so they can be distinguished in the output via
        ``cell_data["refs"]``.
    hmin, hmax, hausd, hgrad : float, optional
        Standard MMG sizing knobs. ``hmax`` is the most useful here as it
        caps element size; without it MMG falls back to its default.
    **opts : Any
        Additional MMG options forwarded to the C++ remesh call (e.g.
        ``verbose=-1``, ``hsiz=0.05``).

    Returns
    -------
    pv.PolyData
        Triangulated 2D mesh embedded at ``z=0``. Boundary edges are kept
        as ``LINE`` cells with their references in ``cell_data["refs"]``.

    Raises
    ------
    ValueError
        If ``boundary_vertices`` is not shape ``(n, 2)``, ``boundary_edges``
        is not shape ``(m, 2)``, or ``refs`` does not match ``len(edges)``.

    Examples
    --------
    >>> import numpy as np
    >>> from mmgpy import mmg2d
    >>> verts = np.array(
    ...     [[0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0]],
    ... )
    >>> edges = np.array([[0, 1], [1, 2], [2, 3], [3, 0]])
    >>> mesh = mmg2d.generate(verts, edges, hmax=0.2)
    >>> mesh.n_cells > 0
    True

    """
    verts = np.ascontiguousarray(np.asarray(boundary_vertices, dtype=np.float64))
    if verts.ndim != _DIMS_2D or verts.shape[1] != _DIMS_2D:
        msg = f"boundary_vertices must have shape (n, 2); got {verts.shape}"
        raise ValueError(msg)

    edges = np.ascontiguousarray(np.asarray(boundary_edges, dtype=np.int32))
    if edges.ndim != _DIMS_2D or edges.shape[1] != _EDGE_VERTS:
        msg = f"boundary_edges must have shape (m, 2); got {edges.shape}"
        raise ValueError(msg)
    if len(edges) == 0:
        msg = "boundary_edges must contain at least one edge"
        raise ValueError(msg)

    edge_refs = None
    if refs is not None:
        edge_refs = np.ascontiguousarray(np.asarray(refs, dtype=np.int64))
        if edge_refs.shape != (len(edges),):
            msg = (
                f"refs must have shape ({len(edges)},) matching boundary_edges; "
                f"got {edge_refs.shape}"
            )
            raise ValueError(msg)

    mesh = MmgMesh2D()
    mesh.set_mesh_size(
        vertices=len(verts),
        triangles=0,
        quadrilaterals=0,
        edges=len(edges),
    )
    mesh.set_vertices(verts)
    mesh.set_edges(edges, edge_refs)

    options: dict[str, Any] = dict(opts)
    for name, value in (
        ("hmin", hmin),
        ("hmax", hmax),
        ("hausd", hausd),
        ("hgrad", hgrad),
    ):
        if value is not None:
            options.setdefault(name, value)

    mesh.remesh(**options)
    from mmgpy._pyvista import to_pyvista  # noqa: PLC0415

    return to_pyvista(mesh, include_refs=True, include_edges=True)


__all__ = ["generate"]
