"""Lagrangian motion implementation for mesh movement.

This module provides mesh motion capabilities with two propagation methods:

- **Laplacian smoothing** (default): Solves the Laplace equation to propagate
  boundary displacements. No external dependencies required.
- **Elasticity** (via fedoo): Solves a linear elasticity problem for physically
  meaningful displacement propagation. Requires ``fedoo`` (optional dependency).

Key functions:
- propagate_displacement: Propagate boundary displacement to interior nodes
  using Laplacian smoothing.
- propagate_displacement_elasticity: Propagate boundary displacement using
  a finite element elasticity solve (requires fedoo).
- move_mesh: Apply displacement and remesh, with configurable propagation method.
"""

from __future__ import annotations

from typing import TYPE_CHECKING, Any, cast

import numpy as np
from scipy import sparse
from scipy.sparse.linalg import spsolve

from mmgpy._topology import vertex_adjacency

if TYPE_CHECKING:
    from numpy.typing import NDArray

    from ._mesh import Mesh
    from ._mmgpy import MmgMesh2D, MmgMesh3D, MmgMeshS

# Type alias for mesh union
MeshType = "MmgMesh2D | MmgMesh3D | MmgMeshS"

# Mesh dimensions supported by MMG.
_DIM_2D = 2
_DIM_3D = 3


def _check_fedoo_available() -> None:
    """Check that fedoo is installed and importable.

    Raises
    ------
    ImportError
        If the optional ``fedoo`` dependency is not installed.

    """
    try:
        import fedoo  # noqa: F401, PLC0415
    except ImportError:
        msg = (
            "fedoo is required for elasticity-based displacement propagation. "
            "Install it with: pip install fedoo"
        )
        raise ImportError(msg) from None


def _detect_fedoo_elm_type(n_dims: int, n_nodes_per_elm: int) -> tuple[str, str]:
    """Map ``(n_dims, n_nodes_per_elm)`` to fedoo element type and modeling space.

    Returns
    -------
    tuple[str, str]
        ``(elm_type, modeling_space)`` strings to pass to ``fedoo.Mesh`` and
        ``fedoo.ModelingSpace`` respectively. ``"2Dplane"`` enables plane-strain
        elasticity, the standard assumption for fictitious-mesh deformation in 2D.

    Raises
    ------
    ValueError
        If ``n_nodes_per_elm`` is not a supported element width for ``n_dims``.

    """
    if n_dims == _DIM_2D:
        elm_type_map = {3: "tri3", 6: "tri6", 4: "quad4"}
        if n_nodes_per_elm not in elm_type_map:
            msg = f"Unsupported 2D element with {n_nodes_per_elm} nodes"
            raise ValueError(msg)
        return elm_type_map[n_nodes_per_elm], "2Dplane"
    elm_type_map = {4: "tet4", 10: "tet10", 8: "hex8"}
    if n_nodes_per_elm not in elm_type_map:
        msg = f"Unsupported 3D element with {n_nodes_per_elm} nodes"
        raise ValueError(msg)
    return elm_type_map[n_nodes_per_elm], "3D"


def propagate_displacement_elasticity(
    vertices: NDArray[np.float64],
    elements: NDArray[np.int32],
    boundary_mask: NDArray[np.bool_],
    boundary_displacement: NDArray[np.float64],
    *,
    youngs_modulus: float = 1e6,
    nu: float = 0.3,
) -> NDArray[np.float64]:
    """Propagate displacement from boundary to interior using linear elasticity.

    Solves a fictitious linear elasticity problem with prescribed displacements
    on the vertices flagged in ``boundary_mask``; vertices outside the mask are
    free DOFs whose displacement is computed by the elasticity solve. This
    produces a physically meaningful smooth field, superior to Laplacian
    smoothing for large deformations and complex geometries.

    Requires the ``fedoo`` package (optional dependency).

    Parameters
    ----------
    vertices : ndarray
        Nx2 or Nx3 array of vertex coordinates.
    elements : ndarray
        Mx(nodes_per_element) array of element connectivity.
    boundary_mask : ndarray of bool
        N boolean array, True for vertices with prescribed displacement.
    boundary_displacement : ndarray
        Nxdim array of displacement vectors. Only values at boundary
        vertices (where ``boundary_mask`` is True) are used.
    youngs_modulus : float
        Young's modulus for the fictitious elastic material. With only
        Dirichlet BCs (no body forces, no tractions) the displacement
        field is independent of this value; only ``nu`` affects the result.
        Default 1e6.
    nu : float
        Poisson's ratio. Default is 0.3.

    Returns
    -------
    ndarray
        Nxdim array of displacement for all vertices.

    Raises
    ------
    ValueError
        If array dimensions don't match or the element type is unsupported.

    """
    _check_fedoo_available()
    import fedoo as fd  # noqa: PLC0415

    n_vertices = len(vertices)
    n_dims = vertices.shape[1]

    if len(boundary_mask) != n_vertices:
        msg = f"boundary_mask length {len(boundary_mask)} != n_vertices {n_vertices}"
        raise ValueError(msg)

    if boundary_displacement.shape[0] != n_vertices:
        msg = (
            f"boundary_displacement rows {boundary_displacement.shape[0]} "
            f"!= n_vertices {n_vertices}"
        )
        raise ValueError(msg)

    if boundary_displacement.shape[1] != n_dims:
        msg = (
            f"boundary_displacement columns {boundary_displacement.shape[1]} "
            f"!= n_dims {n_dims}"
        )
        raise ValueError(msg)

    n_boundary = int(np.sum(boundary_mask))
    if n_boundary == 0:
        return np.zeros_like(vertices)
    if n_boundary == n_vertices:
        return boundary_displacement.copy()

    elm_type, modeling_space = _detect_fedoo_elm_type(n_dims, elements.shape[1])
    fd.ModelingSpace(modeling_space)

    # Build fedoo mesh and solve
    mesh = fd.Mesh(vertices, elements, elm_type)
    material = fd.constitutivelaw.ElasticIsotrop(youngs_modulus, nu)
    wf = fd.weakform.StressEquilibrium(material)
    assembly = fd.Assembly.create(wf, mesh)
    pb = fd.problem.Linear(assembly)

    # Prescribed displacement on every vertex flagged in boundary_mask. Vertices
    # outside the mask remain free; the elasticity solve then propagates the
    # prescribed values into the interior. The caller is responsible for making
    # the mask cover enough non-collinear nodes to remove rigid body modes,
    # otherwise the linear system is singular.
    moving_indices = np.where(boundary_mask)[0]
    disp_components = (
        ["DispX", "DispY"] if n_dims == _DIM_2D else ["DispX", "DispY", "DispZ"]
    )
    for i, comp in enumerate(disp_components):
        pb.bc.add(
            "Dirichlet",
            moving_indices,
            comp,
            boundary_displacement[moving_indices, i],
        )

    pb.solve()

    return np.column_stack([pb.get_disp(comp) for comp in disp_components])


def _build_laplacian_system(
    adjacency: sparse.csr_matrix,
    boundary_mask: NDArray[np.bool_],
) -> tuple[sparse.csr_matrix, sparse.csr_matrix, NDArray[np.intp], NDArray[np.intp]]:
    """Build sparse Laplacian matrices for interior-interior and interior-boundary.

    Constructs the system L_II @ u_I = -L_IB @ u_B where:
    - L_II: Laplacian submatrix for interior-to-interior connections
    - L_IB: Laplacian submatrix for interior-to-boundary connections
    - u_I: Unknown interior displacements
    - u_B: Known boundary displacements

    Parameters
    ----------
    adjacency : scipy.sparse.csr_matrix
        Symmetric vertex-vertex CSR adjacency matrix.
    boundary_mask : ndarray of bool
        Boolean array, True for boundary vertices.

    Returns
    -------
    tuple
        ``(L_II, L_IB, interior_indices, boundary_indices)``.

    """
    interior_mask = ~boundary_mask
    interior_indices = np.where(interior_mask)[0]
    boundary_indices = np.where(boundary_mask)[0]

    n_interior = len(interior_indices)
    n_boundary = len(boundary_indices)

    if n_interior == 0:
        return (
            sparse.csr_matrix((0, 0)),
            sparse.csr_matrix((0, n_boundary)),
            interior_indices,
            boundary_indices,
        )

    # Reorder rows/columns into [interior | boundary] blocks and read the
    # graph Laplacian directly: degree on the diagonal, -1 on edges. The
    # adjacency is symmetric with unit weights, so D - A is the Laplacian.
    perm = np.concatenate([interior_indices, boundary_indices])
    a_perm = adjacency[perm][:, perm]
    degrees = np.asarray(a_perm.sum(axis=1)).ravel()
    laplacian = sparse.diags(degrees) - a_perm

    l_ii = laplacian[:n_interior, :n_interior].tocsr()
    l_ib = laplacian[:n_interior, n_interior:].tocsr()

    return l_ii, l_ib, interior_indices, boundary_indices


def propagate_displacement(
    vertices: NDArray[np.float64],
    elements: NDArray[np.int32],
    boundary_mask: NDArray[np.bool_],
    boundary_displacement: NDArray[np.float64],
) -> NDArray[np.float64]:
    """Propagate displacement from boundary to interior using Laplacian smoothing.

    Solves the Laplace equation nabla^2 u = 0 with Dirichlet boundary conditions
    u = boundary_displacement on the boundary. This produces a smooth displacement
    field that transitions from boundary values to interior.

    The complexity is O(n) for building the matrix and typically O(n^1.5) for
    solving due to the sparse structure.

    Parameters
    ----------
    vertices : ndarray
        Nx2 or Nx3 array of vertex coordinates.
    elements : ndarray
        Mx(nodes_per_element) array of element connectivity.
    boundary_mask : ndarray of bool
        N boolean array, True for vertices with prescribed displacement.
    boundary_displacement : ndarray
        Nxdim array of displacement vectors. Only values at boundary
        vertices (where ``boundary_mask`` is True) are used.

    Returns
    -------
    ndarray
        Nxdim array of displacement for all vertices.

    Raises
    ------
    ValueError
        If array dimensions don't match.

    """
    n_vertices = len(vertices)
    n_dims = vertices.shape[1]

    if len(boundary_mask) != n_vertices:
        msg = f"boundary_mask length {len(boundary_mask)} != n_vertices {n_vertices}"
        raise ValueError(msg)

    if boundary_displacement.shape[0] != n_vertices:
        msg = (
            f"boundary_displacement rows {boundary_displacement.shape[0]} "
            f"!= n_vertices {n_vertices}"
        )
        raise ValueError(msg)

    if boundary_displacement.shape[1] != n_dims:
        msg = (
            f"boundary_displacement columns {boundary_displacement.shape[1]} "
            f"!= n_dims {n_dims}"
        )
        raise ValueError(msg)

    n_boundary = np.sum(boundary_mask)
    if n_boundary == 0:
        # No boundary vertices - return zero displacement
        return np.zeros_like(vertices)

    if n_boundary == n_vertices:
        # All vertices are boundary - return boundary displacement directly
        return boundary_displacement.copy()

    # Build adjacency and Laplacian system
    adjacency = vertex_adjacency(n_vertices, elements)
    l_ii, l_ib, interior_indices, boundary_indices = _build_laplacian_system(
        adjacency,
        boundary_mask,
    )

    # Initialize result with boundary values
    result = np.zeros((n_vertices, n_dims), dtype=np.float64)
    result[boundary_mask] = boundary_displacement[boundary_mask]

    # Solve for each dimension independently
    u_b = boundary_displacement[boundary_indices]

    for dim in range(n_dims):
        rhs = -l_ib @ u_b[:, dim]
        u_i = spsolve(l_ii, rhs)
        result[interior_indices, dim] = u_i

    return result


def _get_elements(
    mesh: MmgMesh2D | MmgMesh3D | MmgMeshS,
    *,
    is_3d: bool,
) -> NDArray[np.int32]:
    """Get elements from mesh based on mesh type.

    Returns
    -------
    ndarray of int32
        Tetrahedra for 3D meshes, triangles for 2D / surface meshes.

    """
    if is_3d:
        # Use cast since we've verified is_3d means mesh has get_tetrahedra
        return cast("Any", mesh).get_tetrahedra()
    return mesh.get_triangles()


def _set_mesh_data(
    mesh: MmgMesh2D | MmgMesh3D | MmgMeshS,
    vertices: NDArray[np.float64],
    elements: NDArray[np.int32],
    *,
    is_3d: bool,
) -> None:
    """Set vertices and elements on mesh, reinitializing internal structures."""
    # Ensure vertices is float64
    verts = np.asarray(vertices, dtype=np.float64)
    if is_3d:
        # MmgMesh3D has set_vertices_and_elements
        cast("Any", mesh).set_vertices_and_elements(verts, elements)
    else:
        # MmgMesh2D uses separate methods
        mesh.set_mesh_size(vertices=len(verts), triangles=len(elements))
        mesh.set_vertices(verts)
        mesh.set_triangles(elements)


def _validate_displacement(
    displacement: NDArray[np.float64],
    n_vertices: int,
    n_dims: int,
) -> None:
    """Validate displacement array dimensions.

    Raises
    ------
    ValueError
        If ``displacement.shape`` is not ``(n_vertices, n_dims)``.

    """
    if displacement.shape[0] != n_vertices:
        msg = f"Displacement rows {displacement.shape[0]} != n_vertices {n_vertices}"
        raise ValueError(msg)

    if displacement.shape[1] != n_dims:
        msg = f"Displacement columns {displacement.shape[1]} != n_dims {n_dims}"
        raise ValueError(msg)


def move_mesh(
    mesh: MmgMesh2D | MmgMesh3D | MmgMeshS | Mesh,
    displacement: NDArray[np.float64],
    *,
    boundary_mask: NDArray[np.bool_] | None = None,
    propagate: bool = True,
    propagation_method: str = "laplacian",
    n_steps: int = 1,
    **remesh_options: float | bool | None,
) -> None:
    """Move mesh vertices by displacement and remesh to maintain quality.

    For large displacements, consider using multiple steps (``n_steps > 1``)
    to avoid mesh inversion.

    Parameters
    ----------
    mesh : Mesh or MmgMesh2D or MmgMesh3D or MmgMeshS
        The mesh to deform in place.
    displacement : ndarray
        Nxdim array of displacement vectors for each vertex. If
        ``boundary_mask`` is provided and ``propagate=True``, only
        boundary values need to be correct; interior values will be
        computed.
    boundary_mask : ndarray of bool, optional
        Boolean array indicating which vertices have prescribed
        displacement. If ``None``, all vertices are treated as having
        prescribed displacement (no propagation needed).
    propagate : bool
        If ``True`` and ``boundary_mask`` is provided, propagate boundary
        displacement to interior using the chosen ``propagation_method``.
    propagation_method : str
        Method for propagating boundary displacements to the interior.
        Options:

        - ``"laplacian"`` (default): Solves the Laplace equation. Fast,
          no extra dependencies.
        - ``"elasticity"``: Solves a linear elasticity problem using
          `fedoo <https://github.com/3MAH/fedoo>`_. Produces physically
          meaningful displacements, better for large deformations and
          complex geometries. Requires ``pip install fedoo``.
    n_steps : int
        Number of incremental steps to apply the displacement. Use more
        steps for large displacements to avoid mesh inversion.
    **remesh_options
        Options passed to ``mesh.remesh()`` (hmax, hmin, etc.).

    Raises
    ------
    ValueError
        If displacement dimensions don't match the mesh, or
        ``propagation_method`` is not recognized.

    """
    from ._mesh import Mesh  # noqa: PLC0415

    valid_methods = ("laplacian", "elasticity")
    if propagation_method not in valid_methods:
        msg = (
            f"propagation_method must be one of {valid_methods}, "
            f"got {propagation_method!r}"
        )
        raise ValueError(msg)

    # Unwrap Mesh to its underlying C++ impl; move_mesh mutates the impl
    # in-place, which the Mesh wrapper references, so changes are visible
    # to the caller.
    if isinstance(mesh, Mesh):
        mesh = mesh._impl_unwrap  # noqa: SLF001

    vertices = mesh.get_vertices()
    n_vertices = len(vertices)
    n_dims = vertices.shape[1]
    is_3d = hasattr(mesh, "get_tetrahedra")

    _validate_displacement(displacement, n_vertices, n_dims)

    elements = _get_elements(mesh, is_3d=is_3d)

    # Propagate displacement if needed
    if boundary_mask is not None and propagate:
        if propagation_method == "elasticity":
            full_displacement = propagate_displacement_elasticity(
                vertices,
                elements,
                boundary_mask,
                displacement,
            )
        else:
            full_displacement = propagate_displacement(
                vertices,
                elements,
                boundary_mask,
                displacement,
            )
    else:
        full_displacement = displacement.copy()

    # Apply displacement in steps
    step_displacement = full_displacement / n_steps

    # Filter out None values from remesh options
    filtered_options: dict[str, Any] = {
        k: v for k, v in remesh_options.items() if v is not None
    }

    for _ in range(n_steps):
        current_vertices = mesh.get_vertices()
        new_vertices = np.asarray(
            current_vertices + step_displacement,
            dtype=np.float64,
        )
        current_elements = _get_elements(mesh, is_3d=is_3d)

        _set_mesh_data(mesh, new_vertices, current_elements, is_3d=is_3d)
        mesh.remesh(**filtered_options)

        # Break if topology changed (can't continue incremental steps)
        if len(mesh.get_vertices()) != len(current_vertices):
            break


def detect_boundary_vertices(
    mesh: MmgMesh2D | MmgMesh3D | MmgMeshS | Mesh,
) -> NDArray[np.bool_]:
    """Detect boundary vertices in a mesh.

    Boundary vertices are those that lie on the exterior surface of the mesh.
    For 3D meshes, these are vertices on surface triangles.
    For 2D/surface meshes, these are vertices on boundary edges.

    Parameters
    ----------
    mesh : Mesh or MmgMesh2D or MmgMesh3D or MmgMeshS
        The mesh whose boundary vertices to detect.

    Returns
    -------
    ndarray of bool
        Boolean array of length ``n_vertices``, True for boundary
        vertices.

    """
    from ._mesh import Mesh  # noqa: PLC0415

    if isinstance(mesh, Mesh):
        mesh = mesh._impl_unwrap  # noqa: SLF001

    n_vertices = len(mesh.get_vertices())
    boundary_mask = np.zeros(n_vertices, dtype=bool)

    # Check if mesh has edges (2D/surface meshes)
    try:
        edges = mesh.get_edges()
        if len(edges) > 0:
            boundary_mask[edges.ravel()] = True
            return boundary_mask
    except (AttributeError, RuntimeError):
        pass

    # For 3D meshes, use surface triangles
    try:
        triangles = mesh.get_triangles()
        if len(triangles) > 0:
            boundary_mask[triangles.ravel()] = True
            return boundary_mask
    except (AttributeError, RuntimeError):
        pass

    # Fallback: treat all vertices as interior (no boundary)
    return boundary_mask


__all__ = [
    "detect_boundary_vertices",
    "move_mesh",
    "propagate_displacement",
    "propagate_displacement_elasticity",
]
