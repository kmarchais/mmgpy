"""Pure Python Lagrangian motion implementation using Laplacian smoothing.

This module provides a Python-only implementation of mesh motion that works
without the ELAS library. It uses Laplacian smoothing to propagate boundary
displacements smoothly into the mesh interior, then remeshes to maintain
mesh quality.

Key functions:
- propagate_displacement: Propagate boundary displacement to interior nodes
- move_mesh: Apply displacement and remesh
"""

from __future__ import annotations

from typing import TYPE_CHECKING, Any, cast

import numpy as np
from scipy import sparse
from scipy.sparse.linalg import spsolve

if TYPE_CHECKING:
    from numpy.typing import NDArray

    from ._mmgpy import MmgMesh2D, MmgMesh3D, MmgMeshS

# Type alias for mesh union
MeshType = "MmgMesh2D | MmgMesh3D | MmgMeshS"


def _build_adjacency_from_elements(
    n_vertices: int,
    elements: NDArray[np.int32],
) -> list[list[int]]:
    """Build adjacency list from element connectivity.

    Args:
        n_vertices: Number of vertices in the mesh.
        elements: Element connectivity array (M x nodes_per_element).

    Returns:
        List of neighbor indices for each vertex.

    """
    adjacency: list[set[int]] = [set() for _ in range(n_vertices)]
    nodes_per_elem = elements.shape[1]

    for elem in elements:
        for i in range(nodes_per_elem):
            for j in range(i + 1, nodes_per_elem):
                v_i, v_j = elem[i], elem[j]
                adjacency[v_i].add(v_j)
                adjacency[v_j].add(v_i)

    return [list(neighbors) for neighbors in adjacency]


def _build_laplacian_system(
    adjacency: list[list[int]],
    boundary_mask: NDArray[np.bool_],
) -> tuple[sparse.csr_matrix, sparse.csr_matrix, NDArray[np.intp], NDArray[np.intp]]:
    """Build sparse Laplacian matrices for interior-interior and interior-boundary.

    Constructs the system L_II @ u_I = -L_IB @ u_B where:
    - L_II: Laplacian submatrix for interior-to-interior connections
    - L_IB: Laplacian submatrix for interior-to-boundary connections
    - u_I: Unknown interior displacements
    - u_B: Known boundary displacements

    Args:
        adjacency: Adjacency list for each vertex.
        boundary_mask: Boolean array, True for boundary vertices.

    Returns:
        Tuple of (L_II, L_IB, interior_indices, boundary_indices).

    """
    interior_mask = ~boundary_mask
    interior_indices = np.where(interior_mask)[0]
    boundary_indices = np.where(boundary_mask)[0]

    n_interior = len(interior_indices)
    n_boundary = len(boundary_indices)

    if n_interior == 0:
        # All vertices are boundary - return empty matrices
        return (
            sparse.csr_matrix((0, 0)),
            sparse.csr_matrix((0, n_boundary)),
            interior_indices,
            boundary_indices,
        )

    # Create mappings from global to local indices
    interior_map = {idx: i for i, idx in enumerate(interior_indices)}
    boundary_map = {idx: i for i, idx in enumerate(boundary_indices)}

    # Build sparse matrix data
    rows_ii: list[int] = []
    cols_ii: list[int] = []
    vals_ii: list[float] = []

    rows_ib: list[int] = []
    cols_ib: list[int] = []
    vals_ib: list[float] = []

    for idx in interior_indices:
        local_i = interior_map[idx]
        neighbors = adjacency[idx]
        degree = len(neighbors)

        # Diagonal entry (degree of vertex)
        rows_ii.append(local_i)
        cols_ii.append(local_i)
        vals_ii.append(float(degree))

        # Off-diagonal entries
        for neighbor in neighbors:
            if interior_mask[neighbor]:
                # Neighbor is interior
                local_j = interior_map[neighbor]
                rows_ii.append(local_i)
                cols_ii.append(local_j)
                vals_ii.append(-1.0)
            else:
                # Neighbor is boundary
                local_j = boundary_map[neighbor]
                rows_ib.append(local_i)
                cols_ib.append(local_j)
                vals_ib.append(-1.0)

    l_ii = sparse.csr_matrix(
        (vals_ii, (rows_ii, cols_ii)),
        shape=(n_interior, n_interior),
    )
    l_ib = sparse.csr_matrix(
        (vals_ib, (rows_ib, cols_ib)),
        shape=(n_interior, n_boundary),
    )

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

    Args:
        vertices: Nx2 or Nx3 array of vertex coordinates.
        elements: Mx(nodes_per_element) array of element connectivity.
        boundary_mask: N boolean array, True for vertices with prescribed displacement.
        boundary_displacement: Nxdim array of displacement vectors.
            Only values at boundary vertices (where boundary_mask is True) are used.

    Returns:
        Nxdim array of displacement for all vertices.

    Raises:
        ValueError: If array dimensions don't match.

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
    adjacency = _build_adjacency_from_elements(n_vertices, elements)
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
    """Get elements from mesh based on mesh type."""
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
    """Validate displacement array dimensions."""
    if displacement.shape[0] != n_vertices:
        msg = f"Displacement rows {displacement.shape[0]} != n_vertices {n_vertices}"
        raise ValueError(msg)

    if displacement.shape[1] != n_dims:
        msg = f"Displacement columns {displacement.shape[1]} != n_dims {n_dims}"
        raise ValueError(msg)


def move_mesh(
    mesh: MmgMesh2D | MmgMesh3D | MmgMeshS,
    displacement: NDArray[np.float64],
    *,
    boundary_mask: NDArray[np.bool_] | None = None,
    propagate: bool = True,
    n_steps: int = 1,
    **remesh_options: float | bool | None,
) -> None:
    """Move mesh vertices by displacement and remesh to maintain quality.

    This is a pure Python implementation of Lagrangian motion that works
    without the ELAS library. For large displacements, consider using
    multiple steps (n_steps > 1) to avoid mesh inversion.

    Args:
        mesh: MmgMesh2D, MmgMesh3D, or MmgMeshS mesh object.
        displacement: Nxdim array of displacement vectors for each vertex.
            If boundary_mask is provided and propagate=True, only boundary
            values need to be correct; interior values will be computed.
        boundary_mask: Optional boolean array indicating which vertices have
            prescribed displacement. If None, all vertices are treated as
            having prescribed displacement (no propagation needed).
        propagate: If True and boundary_mask is provided, propagate boundary
            displacement to interior using Laplacian smoothing.
        n_steps: Number of incremental steps to apply the displacement.
            Use more steps for large displacements to avoid mesh inversion.
        **remesh_options: Options passed to mesh.remesh() (hmax, hmin, etc.).

    Raises:
        ValueError: If displacement dimensions don't match mesh.
        RuntimeError: If remeshing fails.

    """
    vertices = mesh.get_vertices()
    n_vertices = len(vertices)
    n_dims = vertices.shape[1]
    is_3d = hasattr(mesh, "get_tetrahedra")

    _validate_displacement(displacement, n_vertices, n_dims)

    elements = _get_elements(mesh, is_3d=is_3d)

    # Propagate displacement if needed
    if boundary_mask is not None and propagate:
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
    filtered_options: dict[str, float | int | bool] = {
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
        mesh.remesh(**filtered_options)  # type: ignore[arg-type]

        # Break if topology changed (can't continue incremental steps)
        if len(mesh.get_vertices()) != len(current_vertices):
            break


def detect_boundary_vertices(
    mesh: MmgMesh2D | MmgMesh3D | MmgMeshS,
) -> NDArray[np.bool_]:
    """Detect boundary vertices in a mesh.

    Boundary vertices are those that lie on the exterior surface of the mesh.
    For 3D meshes, these are vertices on surface triangles.
    For 2D/surface meshes, these are vertices on boundary edges.

    Args:
        mesh: MmgMesh2D, MmgMesh3D, or MmgMeshS mesh object.

    Returns:
        Boolean array of length n_vertices, True for boundary vertices.

    """
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
]
