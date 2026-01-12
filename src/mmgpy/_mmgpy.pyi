"""Type stubs for the mmgpy C++ extension module.

This module provides type information for the pybind11 C++ bindings.
All element indices in this API are 0-based (Python convention), though
MMG internally uses 1-based indexing. The bindings handle this conversion.

Supported solution fields for set_field/get_field:
    - "metric": Isotropic sizing field (Nx1 array)
    - "displacement": Lagrangian motion field (Nx2 or Nx3 array)
    - "levelset": Implicit surface definition (Nx1 array)
    - "tensor": Anisotropic metric (Nx6 array, stored as xx, xy, xz, yy, yz, zz)
"""

from pathlib import Path
from typing import Any, overload

import numpy as np
from numpy.typing import NDArray

MMG_VERSION: str

class mmg3d:  # noqa: N801
    """Static methods for file-based 3D mesh remeshing."""

    @staticmethod
    def remesh(
        input_mesh: str | Path,
        input_sol: str | Path | None = None,
        output_mesh: str | Path | None = None,
        output_sol: str | Path | None = None,
        options: dict[str, float | int] | None = None,
    ) -> bool:
        """Remesh a 3D mesh file using MMG3D.

        Parameters
        ----------
        input_mesh : str | Path
            Path to input mesh file (.mesh format).
        input_sol : str | Path | None
            Path to input solution file (.sol format).
        output_mesh : str | Path | None
            Path for output mesh file. If None, modifies input in place.
        output_sol : str | Path | None
            Path for output solution file.
        options : dict[str, float | int] | None
            Remeshing options (hmin, hmax, hsiz, hausd, hgrad, verbose, etc.).

        Returns
        -------
        bool
            True if remeshing succeeded.

        """

class mmg2d:  # noqa: N801
    """Static methods for file-based 2D mesh remeshing."""

    @staticmethod
    def remesh(
        input_mesh: str | Path,
        input_sol: str | Path | None = None,
        output_mesh: str | Path | None = None,
        output_sol: str | Path | None = None,
        options: dict[str, float | int] | None = None,
    ) -> bool:
        """Remesh a 2D mesh file using MMG2D.

        Parameters
        ----------
        input_mesh : str | Path
            Path to input mesh file (.mesh format).
        input_sol : str | Path | None
            Path to input solution file (.sol format).
        output_mesh : str | Path | None
            Path for output mesh file. If None, modifies input in place.
        output_sol : str | Path | None
            Path for output solution file.
        options : dict[str, float | int] | None
            Remeshing options (hmin, hmax, hsiz, hausd, hgrad, verbose, etc.).

        Returns
        -------
        bool
            True if remeshing succeeded.

        """

class mmgs:  # noqa: N801
    """Static methods for file-based surface mesh remeshing."""

    @staticmethod
    def remesh(
        input_mesh: str | Path,
        input_sol: str | Path | None = None,
        output_mesh: str | Path | None = None,
        output_sol: str | Path | None = None,
        options: dict[str, float | int] | None = None,
    ) -> bool:
        """Remesh a surface mesh file using MMGS.

        Parameters
        ----------
        input_mesh : str | Path
            Path to input mesh file (.mesh format).
        input_sol : str | Path | None
            Path to input solution file (.sol format).
        output_mesh : str | Path | None
            Path for output mesh file. If None, modifies input in place.
        output_sol : str | Path | None
            Path for output solution file.
        options : dict[str, float | int] | None
            Remeshing options (hmin, hmax, hsiz, hausd, hgrad, verbose, etc.).

        Returns
        -------
        bool
            True if remeshing succeeded.

        """

class MmgMesh3D:
    """3D tetrahedral mesh class for in-memory remeshing.

    All element indices in this class are 0-based (Python convention).
    The underlying MMG library uses 1-based indexing, but the bindings
    handle this conversion automatically.
    """

    @overload
    def __init__(self) -> None:
        """Create an empty 3D mesh."""

    @overload
    def __init__(
        self,
        vertices: NDArray[np.float64],
        elements: NDArray[np.int32],
    ) -> None:
        """Create a 3D mesh from vertices and tetrahedra.

        Parameters
        ----------
        vertices : NDArray[np.float64]
            Vertex coordinates, shape (n_vertices, 3).
        elements : NDArray[np.int32]
            Tetrahedra connectivity, shape (n_tetrahedra, 4).

        """

    @overload
    def __init__(
        self,
        filename: str | Path,
    ) -> None:
        """Load a 3D mesh from file.

        Parameters
        ----------
        filename : str | Path
            Path to mesh file (.mesh, .vtk, .vtu format).

        """

    def set_vertices_and_elements(
        self,
        vertices: NDArray[np.float64],
        elements: NDArray[np.int32],
    ) -> None:
        """Set mesh vertices and tetrahedra.

        Parameters
        ----------
        vertices : NDArray[np.float64]
            Vertex coordinates, shape (n_vertices, 3).
        elements : NDArray[np.int32]
            Tetrahedra connectivity, shape (n_tetrahedra, 4).

        """

    def get_vertices(self) -> NDArray[np.float64]:
        """Get vertex coordinates.

        Returns
        -------
        NDArray[np.float64]
            Vertex coordinates, shape (n_vertices, 3).

        """

    def get_elements(self) -> NDArray[np.int32]:
        """Get tetrahedra connectivity (alias for get_tetrahedra).

        Returns
        -------
        NDArray[np.int32]
            Tetrahedra connectivity, shape (n_tetrahedra, 4).

        """

    def set_mesh_size(
        self,
        vertices: int = 0,
        tetrahedra: int = 0,
        prisms: int = 0,
        triangles: int = 0,
        quadrilaterals: int = 0,
        edges: int = 0,
    ) -> None:
        """Allocate mesh storage for the specified element counts.

        Call this before using single-element setters (set_vertex, etc.).

        Parameters
        ----------
        vertices : int
            Number of vertices.
        tetrahedra : int
            Number of tetrahedra.
        prisms : int
            Number of prisms.
        triangles : int
            Number of triangles (boundary faces).
        quadrilaterals : int
            Number of quadrilaterals.
        edges : int
            Number of edges.

        """

    def get_mesh_size(
        self,
    ) -> tuple[int, int, int, int, int, int]:
        """Get current mesh element counts.

        Returns
        -------
        tuple[int, int, int, int, int, int]
            Tuple of (vertices, tetrahedra, prisms, triangles, quadrilaterals, edges).

        """

    def set_vertices(
        self,
        vertices: NDArray[np.float64],
        refs: NDArray[np.int64] | None = None,
    ) -> None:
        """Set all vertex coordinates.

        Parameters
        ----------
        vertices : NDArray[np.float64]
            Vertex coordinates, shape (n_vertices, 3).
        refs : NDArray[np.int64] | None
            Reference markers for each vertex.

        """

    def set_tetrahedra(
        self,
        tetrahedra: NDArray[np.int32],
        refs: NDArray[np.int64] | None = None,
    ) -> None:
        """Set all tetrahedra.

        Parameters
        ----------
        tetrahedra : NDArray[np.int32]
            Tetrahedra connectivity, shape (n_tetrahedra, 4).
        refs : NDArray[np.int64] | None
            Reference markers for each tetrahedron.

        """

    def set_triangles(
        self,
        triangles: NDArray[np.int32],
        refs: NDArray[np.int64] | None = None,
    ) -> None:
        """Set all triangles (boundary faces).

        Parameters
        ----------
        triangles : NDArray[np.int32]
            Triangle connectivity, shape (n_triangles, 3).
        refs : NDArray[np.int64] | None
            Reference markers for each triangle.

        """

    def set_edges(
        self,
        edges: NDArray[np.int32],
        refs: NDArray[np.int64] | None = None,
    ) -> None:
        """Set all edges.

        Parameters
        ----------
        edges : NDArray[np.int32]
            Edge connectivity, shape (n_edges, 2).
        refs : NDArray[np.int64] | None
            Reference markers for each edge.

        """

    def get_vertices_with_refs(
        self,
    ) -> tuple[NDArray[np.float64], NDArray[np.int64]]:
        """Get vertex coordinates with reference markers.

        Returns
        -------
        tuple[NDArray[np.float64], NDArray[np.int64]]
            Tuple of (vertices, refs).

        """

    def get_triangles(self) -> NDArray[np.int32]:
        """Get triangle connectivity.

        Returns
        -------
        NDArray[np.int32]
            Triangle connectivity, shape (n_triangles, 3).

        """

    def get_triangles_with_refs(
        self,
    ) -> tuple[NDArray[np.int32], NDArray[np.int64]]:
        """Get triangle connectivity with reference markers.

        Returns
        -------
        tuple[NDArray[np.int32], NDArray[np.int64]]
            Tuple of (triangles, refs).

        """

    def get_elements_with_refs(
        self,
    ) -> tuple[NDArray[np.int32], NDArray[np.int64]]:
        """Get tetrahedra connectivity with reference markers.

        Returns
        -------
        tuple[NDArray[np.int32], NDArray[np.int64]]
            Tuple of (tetrahedra, refs).

        """

    def get_edges(self) -> NDArray[np.int32]:
        """Get edge connectivity.

        Returns
        -------
        NDArray[np.int32]
            Edge connectivity, shape (n_edges, 2).

        """

    def get_edges_with_refs(
        self,
    ) -> tuple[NDArray[np.int32], NDArray[np.int64]]:
        """Get edge connectivity with reference markers.

        Returns
        -------
        tuple[NDArray[np.int32], NDArray[np.int64]]
            Tuple of (edges, refs).

        """

    def set_vertex(
        self,
        x: float,
        y: float,
        z: float,
        ref: int,
        idx: int,
    ) -> None:
        """Set a single vertex.

        Parameters
        ----------
        x, y, z : float
            Vertex coordinates.
        ref : int
            Reference marker.
        idx : int
            Vertex index (0-based).

        """

    def set_tetrahedron(
        self,
        v0: int,
        v1: int,
        v2: int,
        v3: int,
        ref: int,
        idx: int,
    ) -> None:
        """Set a single tetrahedron.

        Parameters
        ----------
        v0, v1, v2, v3 : int
            Vertex indices (0-based).
        ref : int
            Reference marker.
        idx : int
            Tetrahedron index (0-based).

        """

    def set_triangle(
        self,
        v0: int,
        v1: int,
        v2: int,
        ref: int,
        idx: int,
    ) -> None:
        """Set a single triangle.

        Parameters
        ----------
        v0, v1, v2 : int
            Vertex indices (0-based).
        ref : int
            Reference marker.
        idx : int
            Triangle index (0-based).

        """

    def set_edge(self, v0: int, v1: int, ref: int, idx: int) -> None:
        """Set a single edge.

        Parameters
        ----------
        v0, v1 : int
            Vertex indices (0-based).
        ref : int
            Reference marker.
        idx : int
            Edge index (0-based).

        """

    def get_vertex(self, idx: int) -> tuple[float, float, float, int]:
        """Get a single vertex.

        Parameters
        ----------
        idx : int
            Vertex index (0-based).

        Returns
        -------
        tuple[float, float, float, int]
            Tuple of (x, y, z, ref).

        """

    def get_tetrahedron(
        self,
        idx: int,
    ) -> tuple[int, int, int, int, int]:
        """Get a single tetrahedron.

        Parameters
        ----------
        idx : int
            Tetrahedron index (0-based).

        Returns
        -------
        tuple[int, int, int, int, int]
            Tuple of (v0, v1, v2, v3, ref).

        """

    def get_triangle(self, idx: int) -> tuple[int, int, int, int]:
        """Get a single triangle.

        Parameters
        ----------
        idx : int
            Triangle index (0-based).

        Returns
        -------
        tuple[int, int, int, int]
            Tuple of (v0, v1, v2, ref).

        """

    def get_edge(self, idx: int) -> tuple[int, int, int]:
        """Get a single edge.

        Parameters
        ----------
        idx : int
            Edge index (0-based).

        Returns
        -------
        tuple[int, int, int]
            Tuple of (v0, v1, ref).

        """

    def set_corners(self, vertex_indices: NDArray[np.int32]) -> None:
        """Mark vertices as corners (preserved during remeshing).

        Parameters
        ----------
        vertex_indices : NDArray[np.int32]
            Indices of corner vertices (0-based).

        """

    def set_required_vertices(self, vertex_indices: NDArray[np.int32]) -> None:
        """Mark vertices as required (cannot be removed).

        Parameters
        ----------
        vertex_indices : NDArray[np.int32]
            Indices of required vertices (0-based).

        """

    def set_ridge_edges(self, edge_indices: NDArray[np.int32]) -> None:
        """Mark edges as ridges (sharp features preserved).

        Parameters
        ----------
        edge_indices : NDArray[np.int32]
            Indices of ridge edges (0-based).

        """

    def get_adjacent_elements(self, idx: int) -> NDArray[np.int32]:
        """Get indices of tetrahedra sharing faces with element idx.

        Parameters
        ----------
        idx : int
            Element index (0-based).

        Returns
        -------
        NDArray[np.int32]
            Array of 4 indices (-1 indicates boundary).

        """

    def get_vertex_neighbors(self, idx: int) -> NDArray[np.int32]:
        """Get indices of vertices connected to vertex idx by an edge.

        Parameters
        ----------
        idx : int
            Vertex index (0-based).

        Returns
        -------
        NDArray[np.int32]
            Array of neighbor vertex indices.

        """

    def get_element_quality(self, idx: int) -> float:
        """Get quality metric for a tetrahedron.

        Parameters
        ----------
        idx : int
            Tetrahedron index (0-based).

        Returns
        -------
        float
            Quality metric (0-1, higher is better).

        """

    def get_element_qualities(self) -> NDArray[np.float64]:
        """Get quality metrics for all tetrahedra.

        Returns
        -------
        NDArray[np.float64]
            Quality metrics for all elements.

        """

    def set_prism(
        self,
        v0: int,
        v1: int,
        v2: int,
        v3: int,
        v4: int,
        v5: int,
        ref: int,
        idx: int,
    ) -> None:
        """Set a single prism element.

        Parameters
        ----------
        v0, v1, v2, v3, v4, v5 : int
            Vertex indices (0-based).
        ref : int
            Reference marker.
        idx : int
            Prism index (0-based).

        """

    def set_quadrilateral(
        self,
        v0: int,
        v1: int,
        v2: int,
        v3: int,
        ref: int,
        idx: int,
    ) -> None:
        """Set a single quadrilateral.

        Parameters
        ----------
        v0, v1, v2, v3 : int
            Vertex indices (0-based).
        ref : int
            Reference marker.
        idx : int
            Quadrilateral index (0-based).

        """

    def set_prisms(
        self,
        prisms: NDArray[np.int32],
        refs: NDArray[np.int64] | None = None,
    ) -> None:
        """Set all prisms.

        Parameters
        ----------
        prisms : NDArray[np.int32]
            Prism connectivity, shape (n_prisms, 6).
        refs : NDArray[np.int64] | None
            Reference markers for each prism.

        """

    def set_quadrilaterals(
        self,
        quads: NDArray[np.int32],
        refs: NDArray[np.int64] | None = None,
    ) -> None:
        """Set all quadrilaterals.

        Parameters
        ----------
        quads : NDArray[np.int32]
            Quadrilateral connectivity, shape (n_quads, 4).
        refs : NDArray[np.int64] | None
            Reference markers for each quadrilateral.

        """

    def get_prism(self, idx: int) -> tuple[int, int, int, int, int, int, int]:
        """Get a single prism.

        Parameters
        ----------
        idx : int
            Prism index (0-based).

        Returns
        -------
        tuple[int, int, int, int, int, int, int]
            Tuple of (v0, v1, v2, v3, v4, v5, ref).

        """

    def get_quadrilateral(self, idx: int) -> tuple[int, int, int, int, int]:
        """Get a single quadrilateral.

        Parameters
        ----------
        idx : int
            Quadrilateral index (0-based).

        Returns
        -------
        tuple[int, int, int, int, int]
            Tuple of (v0, v1, v2, v3, ref).

        """

    def get_prisms(self) -> NDArray[np.int32]:
        """Get all prism connectivity.

        Returns
        -------
        NDArray[np.int32]
            Prism connectivity, shape (n_prisms, 6).

        """

    def get_prisms_with_refs(
        self,
    ) -> tuple[NDArray[np.int32], NDArray[np.int64]]:
        """Get prism connectivity with reference markers.

        Returns
        -------
        tuple[NDArray[np.int32], NDArray[np.int64]]
            Tuple of (prisms, refs).

        """

    def get_quadrilaterals(self) -> NDArray[np.int32]:
        """Get all quadrilateral connectivity.

        Returns
        -------
        NDArray[np.int32]
            Quadrilateral connectivity, shape (n_quads, 4).

        """

    def get_quadrilaterals_with_refs(
        self,
    ) -> tuple[NDArray[np.int32], NDArray[np.int64]]:
        """Get quadrilateral connectivity with reference markers.

        Returns
        -------
        tuple[NDArray[np.int32], NDArray[np.int64]]
            Tuple of (quadrilaterals, refs).

        """

    def get_tetrahedra(self) -> NDArray[np.int32]:
        """Get all tetrahedra connectivity.

        Returns
        -------
        NDArray[np.int32]
            Tetrahedra connectivity, shape (n_tetrahedra, 4).

        """

    def get_tetrahedra_with_refs(
        self,
    ) -> tuple[NDArray[np.int32], NDArray[np.int64]]:
        """Get tetrahedra connectivity with reference markers.

        Returns
        -------
        tuple[NDArray[np.int32], NDArray[np.int64]]
            Tuple of (tetrahedra, refs).

        """

    def set_field(self, key: str, value: NDArray[np.float64]) -> None:
        """Set a solution field on vertices.

        Parameters
        ----------
        key : str
            Field name: "metric", "displacement", "levelset", or "tensor".
        value : NDArray[np.float64]
            Field values (one row per vertex). Shape depends on field type:
            - "metric": (n_vertices, 1) - isotropic sizing
            - "displacement": (n_vertices, 3) - motion vectors
            - "levelset": (n_vertices, 1) - signed distance
            - "tensor": (n_vertices, 6) - anisotropic metric

        """

    def get_field(self, key: str) -> NDArray[np.float64]:
        """Get a solution field from vertices.

        Parameters
        ----------
        key : str
            Field name: "metric", "displacement", "levelset", or "tensor".

        Returns
        -------
        NDArray[np.float64]
            Field values (one row per vertex).

        """

    def __setitem__(self, key: str, value: NDArray[np.float64]) -> None:
        """Set a solution field using dictionary syntax.

        Equivalent to set_field(key, value).
        """

    def __getitem__(self, key: str) -> NDArray[np.float64]:
        """Get a solution field using dictionary syntax.

        Equivalent to get_field(key).
        """

    def save(self, filename: str | Path) -> None:
        """Save mesh to file.

        Parameters
        ----------
        filename : str | Path
            Output file path. Format determined by extension
            (.mesh, .vtk, .vtu).

        """

    def remesh(
        self,
        *,
        hmin: float | None = None,
        hmax: float | None = None,
        hsiz: float | None = None,
        hausd: float | None = None,
        hgrad: float | None = None,
        verbose: int | bool | None = None,
        optim: int | None = None,
        noinsert: int | None = None,
        noswap: int | None = None,
        nomove: int | None = None,
        nosurf: int | None = None,
        **kwargs: float | None,
    ) -> dict[str, Any]:
        """Remesh the mesh in-place.

        Parameters
        ----------
        hmin : float | None
            Minimum edge size.
        hmax : float | None
            Maximum edge size.
        hsiz : float | None
            Uniform target edge size.
        hausd : float | None
            Hausdorff distance for geometry approximation.
        hgrad : float | None
            Gradation parameter (controls size transition).
        verbose : int | bool | None
            Verbosity level. True/False converted to 1/-1.
        optim : int | None
            Optimization mode (1 = optimize without topology changes).
        noinsert : int | None
            Disable vertex insertion (1 = disabled).
        noswap : int | None
            Disable edge/face swapping (1 = disabled).
        nomove : int | None
            Disable vertex relocation (1 = disabled).
        nosurf : int | None
            Disable surface modifications (1 = disabled).
        **kwargs : float | int | None
            Additional MMG options.

        Returns
        -------
        dict[str, Any]
            Statistics dictionary with before/after metrics.

        """

    def remesh_lagrangian(
        self,
        displacement: NDArray[np.float64],
        *,
        hmin: float | None = None,
        hmax: float | None = None,
        hsiz: float | None = None,
        hausd: float | None = None,
        hgrad: float | None = None,
        verbose: int | bool | None = None,
        lag: int | None = None,
        **kwargs: float | None,
    ) -> dict[str, Any]:
        """Remesh following Lagrangian motion.

        Moves the mesh according to a displacement field while
        maintaining mesh quality.

        Parameters
        ----------
        displacement : NDArray[np.float64]
            Displacement vectors, shape (n_vertices, 3).
        hmin : float | None
            Minimum edge size.
        hmax : float | None
            Maximum edge size.
        hsiz : float | None
            Uniform target edge size.
        hausd : float | None
            Hausdorff distance for geometry approximation.
        hgrad : float | None
            Gradation parameter.
        verbose : int | bool | None
            Verbosity level.
        lag : int | None
            Lagrangian mode: 0=velocity, 1=displacement (default), 2=final position.
        **kwargs : float | int | None
            Additional MMG options.

        Returns
        -------
        dict[str, Any]
            Statistics dictionary with before/after metrics.

        """

    def remesh_levelset(
        self,
        levelset: NDArray[np.float64],
        *,
        ls: float | None = None,
        hmin: float | None = None,
        hmax: float | None = None,
        hsiz: float | None = None,
        hausd: float | None = None,
        hgrad: float | None = None,
        verbose: int | bool | None = None,
        iso: int | None = None,
        **kwargs: float | None,
    ) -> dict[str, Any]:
        """Remesh to conform to a level-set isosurface.

        Discretizes the zero level-set (or specified isovalue) and
        creates a mesh that conforms to this surface.

        Parameters
        ----------
        levelset : NDArray[np.float64]
            Level-set values, shape (n_vertices, 1).
        ls : float | None
            Isovalue to discretize (default 0.0).
        hmin : float | None
            Minimum edge size.
        hmax : float | None
            Maximum edge size.
        hsiz : float | None
            Uniform target edge size.
        hausd : float | None
            Hausdorff distance for geometry approximation.
        hgrad : float | None
            Gradation parameter.
        verbose : int | bool | None
            Verbosity level.
        iso : int | None
            Enable level-set mode (default 1).
        **kwargs : float | int | None
            Additional MMG options.

        Returns
        -------
        dict[str, Any]
            Statistics dictionary with before/after metrics.

        """

class MmgMesh2D:
    """2D triangular mesh class for in-memory remeshing.

    All element indices in this class are 0-based (Python convention).
    The underlying MMG library uses 1-based indexing, but the bindings
    handle this conversion automatically.
    """

    @overload
    def __init__(self) -> None:
        """Create an empty 2D mesh."""

    @overload
    def __init__(
        self,
        vertices: NDArray[np.float64],
        triangles: NDArray[np.int32],
    ) -> None:
        """Create a 2D mesh from vertices and triangles.

        Parameters
        ----------
        vertices : NDArray[np.float64]
            Vertex coordinates, shape (n_vertices, 2).
        triangles : NDArray[np.int32]
            Triangle connectivity, shape (n_triangles, 3).

        """

    @overload
    def __init__(
        self,
        filename: str | Path,
    ) -> None:
        """Load a 2D mesh from file.

        Parameters
        ----------
        filename : str | Path
            Path to mesh file (.mesh, .vtk, .vtu format).

        """

    def set_mesh_size(
        self,
        vertices: int = 0,
        triangles: int = 0,
        quadrilaterals: int = 0,
        edges: int = 0,
    ) -> None:
        """Allocate mesh storage for the specified element counts.

        Parameters
        ----------
        vertices : int
            Number of vertices.
        triangles : int
            Number of triangles.
        quadrilaterals : int
            Number of quadrilaterals.
        edges : int
            Number of edges (boundary edges).

        """

    def get_mesh_size(self) -> tuple[int, int, int, int]:
        """Get current mesh element counts.

        Returns
        -------
        tuple[int, int, int, int]
            Tuple of (vertices, triangles, quadrilaterals, edges).

        """

    def set_vertices(
        self,
        vertices: NDArray[np.float64],
        refs: NDArray[np.int64] | None = None,
    ) -> None:
        """Set all vertex coordinates.

        Parameters
        ----------
        vertices : NDArray[np.float64]
            Vertex coordinates, shape (n_vertices, 2).
        refs : NDArray[np.int64] | None
            Reference markers for each vertex.

        """

    def set_triangles(
        self,
        triangles: NDArray[np.int32],
        refs: NDArray[np.int64] | None = None,
    ) -> None:
        """Set all triangles.

        Parameters
        ----------
        triangles : NDArray[np.int32]
            Triangle connectivity, shape (n_triangles, 3).
        refs : NDArray[np.int64] | None
            Reference markers for each triangle.

        """

    def set_quadrilaterals(
        self,
        quads: NDArray[np.int32],
        refs: NDArray[np.int64] | None = None,
    ) -> None:
        """Set all quadrilaterals.

        Parameters
        ----------
        quads : NDArray[np.int32]
            Quadrilateral connectivity, shape (n_quads, 4).
        refs : NDArray[np.int64] | None
            Reference markers for each quadrilateral.

        """

    def set_edges(
        self,
        edges: NDArray[np.int32],
        refs: NDArray[np.int64] | None = None,
    ) -> None:
        """Set all edges.

        Parameters
        ----------
        edges : NDArray[np.int32]
            Edge connectivity, shape (n_edges, 2).
        refs : NDArray[np.int64] | None
            Reference markers for each edge.

        """

    def get_vertices(self) -> NDArray[np.float64]:
        """Get vertex coordinates.

        Returns
        -------
        NDArray[np.float64]
            Vertex coordinates, shape (n_vertices, 2).

        """

    def get_vertices_with_refs(
        self,
    ) -> tuple[NDArray[np.float64], NDArray[np.int64]]:
        """Get vertex coordinates with reference markers.

        Returns
        -------
        tuple[NDArray[np.float64], NDArray[np.int64]]
            Tuple of (vertices, refs).

        """

    def get_triangles(self) -> NDArray[np.int32]:
        """Get triangle connectivity.

        Returns
        -------
        NDArray[np.int32]
            Triangle connectivity, shape (n_triangles, 3).

        """

    def get_triangles_with_refs(
        self,
    ) -> tuple[NDArray[np.int32], NDArray[np.int64]]:
        """Get triangle connectivity with reference markers.

        Returns
        -------
        tuple[NDArray[np.int32], NDArray[np.int64]]
            Tuple of (triangles, refs).

        """

    def get_quadrilaterals(self) -> NDArray[np.int32]:
        """Get quadrilateral connectivity.

        Returns
        -------
        NDArray[np.int32]
            Quadrilateral connectivity, shape (n_quads, 4).

        """

    def get_quadrilaterals_with_refs(
        self,
    ) -> tuple[NDArray[np.int32], NDArray[np.int64]]:
        """Get quadrilateral connectivity with reference markers.

        Returns
        -------
        tuple[NDArray[np.int32], NDArray[np.int64]]
            Tuple of (quadrilaterals, refs).

        """

    def get_edges(self) -> NDArray[np.int32]:
        """Get edge connectivity.

        Returns
        -------
        NDArray[np.int32]
            Edge connectivity, shape (n_edges, 2).

        """

    def get_edges_with_refs(
        self,
    ) -> tuple[NDArray[np.int32], NDArray[np.int64]]:
        """Get edge connectivity with reference markers.

        Returns
        -------
        tuple[NDArray[np.int32], NDArray[np.int64]]
            Tuple of (edges, refs).

        """

    def set_vertex(self, x: float, y: float, ref: int, idx: int) -> None:
        """Set a single vertex.

        Parameters
        ----------
        x, y : float
            Vertex coordinates.
        ref : int
            Reference marker.
        idx : int
            Vertex index (0-based).

        """

    def set_triangle(
        self,
        v0: int,
        v1: int,
        v2: int,
        ref: int,
        idx: int,
    ) -> None:
        """Set a single triangle.

        Parameters
        ----------
        v0, v1, v2 : int
            Vertex indices (0-based).
        ref : int
            Reference marker.
        idx : int
            Triangle index (0-based).

        """

    def set_quadrilateral(
        self,
        v0: int,
        v1: int,
        v2: int,
        v3: int,
        ref: int,
        idx: int,
    ) -> None:
        """Set a single quadrilateral.

        Parameters
        ----------
        v0, v1, v2, v3 : int
            Vertex indices (0-based).
        ref : int
            Reference marker.
        idx : int
            Quadrilateral index (0-based).

        """

    def set_edge(self, v0: int, v1: int, ref: int, idx: int) -> None:
        """Set a single edge.

        Parameters
        ----------
        v0, v1 : int
            Vertex indices (0-based).
        ref : int
            Reference marker.
        idx : int
            Edge index (0-based).

        """

    def get_vertex(self, idx: int) -> tuple[float, float, int]:
        """Get a single vertex.

        Parameters
        ----------
        idx : int
            Vertex index (0-based).

        Returns
        -------
        tuple[float, float, int]
            Tuple of (x, y, ref).

        """

    def get_triangle(self, idx: int) -> tuple[int, int, int, int]:
        """Get a single triangle.

        Parameters
        ----------
        idx : int
            Triangle index (0-based).

        Returns
        -------
        tuple[int, int, int, int]
            Tuple of (v0, v1, v2, ref).

        """

    def get_quadrilateral(self, idx: int) -> tuple[int, int, int, int, int]:
        """Get a single quadrilateral.

        Parameters
        ----------
        idx : int
            Quadrilateral index (0-based).

        Returns
        -------
        tuple[int, int, int, int, int]
            Tuple of (v0, v1, v2, v3, ref).

        """

    def get_edge(self, idx: int) -> tuple[int, int, int]:
        """Get a single edge.

        Parameters
        ----------
        idx : int
            Edge index (0-based).

        Returns
        -------
        tuple[int, int, int]
            Tuple of (v0, v1, ref).

        """

    def set_corners(self, vertex_indices: NDArray[np.int32]) -> None:
        """Mark vertices as corners (preserved during remeshing).

        Parameters
        ----------
        vertex_indices : NDArray[np.int32]
            Indices of corner vertices (0-based).

        """

    def set_required_vertices(self, vertex_indices: NDArray[np.int32]) -> None:
        """Mark vertices as required (cannot be removed).

        Parameters
        ----------
        vertex_indices : NDArray[np.int32]
            Indices of required vertices (0-based).

        """

    def set_required_edges(self, edge_indices: NDArray[np.int32]) -> None:
        """Mark edges as required (cannot be modified).

        Parameters
        ----------
        edge_indices : NDArray[np.int32]
            Indices of required edges (0-based).

        """

    def get_adjacent_elements(self, idx: int) -> NDArray[np.int32]:
        """Get indices of triangles sharing edges with element idx.

        Parameters
        ----------
        idx : int
            Element index (0-based).

        Returns
        -------
        NDArray[np.int32]
            Array of 3 indices (-1 indicates boundary).

        """

    def get_vertex_neighbors(self, idx: int) -> NDArray[np.int32]:
        """Get indices of vertices connected to vertex idx by an edge.

        Parameters
        ----------
        idx : int
            Vertex index (0-based).

        Returns
        -------
        NDArray[np.int32]
            Array of neighbor vertex indices.

        """

    def get_element_quality(self, idx: int) -> float:
        """Get quality metric for a triangle.

        Parameters
        ----------
        idx : int
            Triangle index (0-based).

        Returns
        -------
        float
            Quality metric (0-1, higher is better).

        """

    def get_element_qualities(self) -> NDArray[np.float64]:
        """Get quality metrics for all triangles.

        Returns
        -------
        NDArray[np.float64]
            Quality metrics for all elements.

        """

    def set_field(self, key: str, value: NDArray[np.float64]) -> None:
        """Set a solution field on vertices.

        Parameters
        ----------
        key : str
            Field name: "metric", "displacement", "levelset", or "tensor".
        value : NDArray[np.float64]
            Field values (one row per vertex).

        """

    def get_field(self, key: str) -> NDArray[np.float64]:
        """Get a solution field from vertices.

        Parameters
        ----------
        key : str
            Field name.

        Returns
        -------
        NDArray[np.float64]
            Field values (one row per vertex).

        """

    def __setitem__(self, key: str, value: NDArray[np.float64]) -> None:
        """Set a solution field using dictionary syntax."""

    def __getitem__(self, key: str) -> NDArray[np.float64]:
        """Get a solution field using dictionary syntax."""

    def save(self, filename: str | Path) -> None:
        """Save mesh to file.

        Parameters
        ----------
        filename : str | Path
            Output file path. Format determined by extension.

        """

    def remesh(
        self,
        *,
        hmin: float | None = None,
        hmax: float | None = None,
        hsiz: float | None = None,
        hausd: float | None = None,
        hgrad: float | None = None,
        verbose: int | bool | None = None,
        optim: int | None = None,
        noinsert: int | None = None,
        noswap: int | None = None,
        nomove: int | None = None,
        **kwargs: float | None,
    ) -> dict[str, Any]:
        """Remesh the mesh in-place.

        Parameters
        ----------
        hmin : float | None
            Minimum edge size.
        hmax : float | None
            Maximum edge size.
        hsiz : float | None
            Uniform target edge size.
        hausd : float | None
            Hausdorff distance for geometry approximation.
        hgrad : float | None
            Gradation parameter.
        verbose : int | bool | None
            Verbosity level. True/False converted to 1/-1.
        optim : int | None
            Optimization mode.
        noinsert : int | None
            Disable vertex insertion.
        noswap : int | None
            Disable edge swapping.
        nomove : int | None
            Disable vertex relocation.
        **kwargs : float | int | None
            Additional MMG options.

        Returns
        -------
        dict[str, Any]
            Statistics dictionary with before/after metrics.

        """

    def remesh_lagrangian(
        self,
        displacement: NDArray[np.float64],
        *,
        hmin: float | None = None,
        hmax: float | None = None,
        hsiz: float | None = None,
        hausd: float | None = None,
        hgrad: float | None = None,
        verbose: int | bool | None = None,
        lag: int | None = None,
        **kwargs: float | None,
    ) -> dict[str, Any]:
        """Remesh following Lagrangian motion.

        Parameters
        ----------
        displacement : NDArray[np.float64]
            Displacement vectors, shape (n_vertices, 2).
        hmin : float | None
            Minimum edge size.
        hmax : float | None
            Maximum edge size.
        hsiz : float | None
            Uniform target edge size.
        hausd : float | None
            Hausdorff distance for geometry approximation.
        hgrad : float | None
            Gradation parameter.
        verbose : int | bool | None
            Verbosity level.
        lag : int | None
            Lagrangian mode: 0=velocity, 1=displacement (default), 2=final position.
        **kwargs : float | int | None
            Additional MMG options.

        Returns
        -------
        dict[str, Any]
            Statistics dictionary with before/after metrics.

        """

    def remesh_levelset(
        self,
        levelset: NDArray[np.float64],
        *,
        ls: float | None = None,
        hmin: float | None = None,
        hmax: float | None = None,
        hsiz: float | None = None,
        hausd: float | None = None,
        hgrad: float | None = None,
        verbose: int | bool | None = None,
        iso: int | None = None,
        **kwargs: float | None,
    ) -> dict[str, Any]:
        """Remesh to conform to a level-set isoline.

        Parameters
        ----------
        levelset : NDArray[np.float64]
            Level-set values, shape (n_vertices, 1).
        ls : float | None
            Isovalue to discretize (default 0.0).
        hmin : float | None
            Minimum edge size.
        hmax : float | None
            Maximum edge size.
        hsiz : float | None
            Uniform target edge size.
        hausd : float | None
            Hausdorff distance for geometry approximation.
        hgrad : float | None
            Gradation parameter.
        verbose : int | bool | None
            Verbosity level.
        iso : int | None
            Enable level-set mode (default 1).
        **kwargs : float | int | None
            Additional MMG options.

        Returns
        -------
        dict[str, Any]
            Statistics dictionary with before/after metrics.

        """

class MmgMeshS:
    """Surface mesh class for in-memory remeshing.

    All element indices in this class are 0-based (Python convention).
    The underlying MMG library uses 1-based indexing, but the bindings
    handle this conversion automatically.

    Note: MmgMeshS does not support Lagrangian remeshing (remesh_lagrangian).
    """

    @overload
    def __init__(self) -> None:
        """Create an empty surface mesh."""

    @overload
    def __init__(
        self,
        vertices: NDArray[np.float64],
        triangles: NDArray[np.int32],
    ) -> None:
        """Create a surface mesh from vertices and triangles.

        Parameters
        ----------
        vertices : NDArray[np.float64]
            Vertex coordinates, shape (n_vertices, 3).
        triangles : NDArray[np.int32]
            Triangle connectivity, shape (n_triangles, 3).

        """

    @overload
    def __init__(
        self,
        filename: str | Path,
    ) -> None:
        """Load a surface mesh from file.

        Parameters
        ----------
        filename : str | Path
            Path to mesh file (.mesh, .vtk, .vtu format).

        """

    def set_mesh_size(
        self,
        vertices: int = 0,
        triangles: int = 0,
        edges: int = 0,
    ) -> None:
        """Allocate mesh storage for the specified element counts.

        Parameters
        ----------
        vertices : int
            Number of vertices.
        triangles : int
            Number of triangles.
        edges : int
            Number of edges.

        """

    def get_mesh_size(self) -> tuple[int, int, int]:
        """Get current mesh element counts.

        Returns
        -------
        tuple[int, int, int]
            Tuple of (vertices, triangles, edges).

        """

    def set_vertices(
        self,
        vertices: NDArray[np.float64],
        refs: NDArray[np.int64] | None = None,
    ) -> None:
        """Set all vertex coordinates.

        Parameters
        ----------
        vertices : NDArray[np.float64]
            Vertex coordinates, shape (n_vertices, 3).
        refs : NDArray[np.int64] | None
            Reference markers for each vertex.

        """

    def set_triangles(
        self,
        triangles: NDArray[np.int32],
        refs: NDArray[np.int64] | None = None,
    ) -> None:
        """Set all triangles.

        Parameters
        ----------
        triangles : NDArray[np.int32]
            Triangle connectivity, shape (n_triangles, 3).
        refs : NDArray[np.int64] | None
            Reference markers for each triangle.

        """

    def set_edges(
        self,
        edges: NDArray[np.int32],
        refs: NDArray[np.int64] | None = None,
    ) -> None:
        """Set all edges.

        Parameters
        ----------
        edges : NDArray[np.int32]
            Edge connectivity, shape (n_edges, 2).
        refs : NDArray[np.int64] | None
            Reference markers for each edge.

        """

    def get_vertices(self) -> NDArray[np.float64]:
        """Get vertex coordinates.

        Returns
        -------
        NDArray[np.float64]
            Vertex coordinates, shape (n_vertices, 3).

        """

    def get_vertices_with_refs(
        self,
    ) -> tuple[NDArray[np.float64], NDArray[np.int64]]:
        """Get vertex coordinates with reference markers.

        Returns
        -------
        tuple[NDArray[np.float64], NDArray[np.int64]]
            Tuple of (vertices, refs).

        """

    def get_triangles(self) -> NDArray[np.int32]:
        """Get triangle connectivity.

        Returns
        -------
        NDArray[np.int32]
            Triangle connectivity, shape (n_triangles, 3).

        """

    def get_triangles_with_refs(
        self,
    ) -> tuple[NDArray[np.int32], NDArray[np.int64]]:
        """Get triangle connectivity with reference markers.

        Returns
        -------
        tuple[NDArray[np.int32], NDArray[np.int64]]
            Tuple of (triangles, refs).

        """

    def get_edges(self) -> NDArray[np.int32]:
        """Get edge connectivity.

        Returns
        -------
        NDArray[np.int32]
            Edge connectivity, shape (n_edges, 2).

        """

    def get_edges_with_refs(
        self,
    ) -> tuple[NDArray[np.int32], NDArray[np.int64]]:
        """Get edge connectivity with reference markers.

        Returns
        -------
        tuple[NDArray[np.int32], NDArray[np.int64]]
            Tuple of (edges, refs).

        """

    def set_vertex(
        self,
        x: float,
        y: float,
        z: float,
        ref: int,
        idx: int,
    ) -> None:
        """Set a single vertex.

        Parameters
        ----------
        x, y, z : float
            Vertex coordinates.
        ref : int
            Reference marker.
        idx : int
            Vertex index (0-based).

        """

    def set_triangle(
        self,
        v0: int,
        v1: int,
        v2: int,
        ref: int,
        idx: int,
    ) -> None:
        """Set a single triangle.

        Parameters
        ----------
        v0, v1, v2 : int
            Vertex indices (0-based).
        ref : int
            Reference marker.
        idx : int
            Triangle index (0-based).

        """

    def set_edge(self, v0: int, v1: int, ref: int, idx: int) -> None:
        """Set a single edge.

        Parameters
        ----------
        v0, v1 : int
            Vertex indices (0-based).
        ref : int
            Reference marker.
        idx : int
            Edge index (0-based).

        """

    def get_vertex(self, idx: int) -> tuple[float, float, float, int]:
        """Get a single vertex.

        Parameters
        ----------
        idx : int
            Vertex index (0-based).

        Returns
        -------
        tuple[float, float, float, int]
            Tuple of (x, y, z, ref).

        """

    def get_triangle(self, idx: int) -> tuple[int, int, int, int]:
        """Get a single triangle.

        Parameters
        ----------
        idx : int
            Triangle index (0-based).

        Returns
        -------
        tuple[int, int, int, int]
            Tuple of (v0, v1, v2, ref).

        """

    def get_edge(self, idx: int) -> tuple[int, int, int]:
        """Get a single edge.

        Parameters
        ----------
        idx : int
            Edge index (0-based).

        Returns
        -------
        tuple[int, int, int]
            Tuple of (v0, v1, ref).

        """

    def set_corners(self, vertex_indices: NDArray[np.int32]) -> None:
        """Mark vertices as corners (preserved during remeshing).

        Parameters
        ----------
        vertex_indices : NDArray[np.int32]
            Indices of corner vertices (0-based).

        """

    def set_required_vertices(self, vertex_indices: NDArray[np.int32]) -> None:
        """Mark vertices as required (cannot be removed).

        Parameters
        ----------
        vertex_indices : NDArray[np.int32]
            Indices of required vertices (0-based).

        """

    def set_ridge_edges(self, edge_indices: NDArray[np.int32]) -> None:
        """Mark edges as ridges (sharp features preserved).

        Parameters
        ----------
        edge_indices : NDArray[np.int32]
            Indices of ridge edges (0-based).

        """

    def get_adjacent_elements(self, idx: int) -> NDArray[np.int32]:
        """Get indices of triangles sharing edges with element idx.

        Parameters
        ----------
        idx : int
            Element index (0-based).

        Returns
        -------
        NDArray[np.int32]
            Array of 3 indices (-1 indicates boundary).

        """

    def get_vertex_neighbors(self, idx: int) -> NDArray[np.int32]:
        """Get indices of vertices connected to vertex idx by an edge.

        Parameters
        ----------
        idx : int
            Vertex index (0-based).

        Returns
        -------
        NDArray[np.int32]
            Array of neighbor vertex indices.

        """

    def get_element_quality(self, idx: int) -> float:
        """Get quality metric for a triangle.

        Parameters
        ----------
        idx : int
            Triangle index (0-based).

        Returns
        -------
        float
            Quality metric (0-1, higher is better).

        """

    def get_element_qualities(self) -> NDArray[np.float64]:
        """Get quality metrics for all triangles.

        Returns
        -------
        NDArray[np.float64]
            Quality metrics for all elements.

        """

    def set_field(self, key: str, value: NDArray[np.float64]) -> None:
        """Set a solution field on vertices.

        Parameters
        ----------
        key : str
            Field name: "metric", "levelset", or "tensor".
        value : NDArray[np.float64]
            Field values (one row per vertex).

        """

    def get_field(self, key: str) -> NDArray[np.float64]:
        """Get a solution field from vertices.

        Parameters
        ----------
        key : str
            Field name.

        Returns
        -------
        NDArray[np.float64]
            Field values (one row per vertex).

        """

    def __setitem__(self, key: str, value: NDArray[np.float64]) -> None:
        """Set a solution field using dictionary syntax."""

    def __getitem__(self, key: str) -> NDArray[np.float64]:
        """Get a solution field using dictionary syntax."""

    def save(self, filename: str | Path) -> None:
        """Save mesh to file.

        Parameters
        ----------
        filename : str | Path
            Output file path. Format determined by extension.

        """

    def remesh(
        self,
        *,
        hmin: float | None = None,
        hmax: float | None = None,
        hsiz: float | None = None,
        hausd: float | None = None,
        hgrad: float | None = None,
        verbose: int | bool | None = None,
        optim: int | None = None,
        noinsert: int | None = None,
        noswap: int | None = None,
        nomove: int | None = None,
        **kwargs: float | None,
    ) -> dict[str, Any]:
        """Remesh the mesh in-place.

        Parameters
        ----------
        hmin : float | None
            Minimum edge size.
        hmax : float | None
            Maximum edge size.
        hsiz : float | None
            Uniform target edge size.
        hausd : float | None
            Hausdorff distance for geometry approximation.
        hgrad : float | None
            Gradation parameter.
        verbose : int | bool | None
            Verbosity level. True/False converted to 1/-1.
        optim : int | None
            Optimization mode.
        noinsert : int | None
            Disable vertex insertion.
        noswap : int | None
            Disable edge swapping.
        nomove : int | None
            Disable vertex relocation.
        **kwargs : float | int | None
            Additional MMG options.

        Returns
        -------
        dict[str, Any]
            Statistics dictionary with before/after metrics.

        """

    def remesh_lagrangian(
        self,
        displacement: NDArray[np.float64],
        **kwargs: float | None,
    ) -> None:
        """Not supported - raises RuntimeError.

        Lagrangian motion is not supported for surface meshes (MmgMeshS).

        Reason: Lagrangian motion requires solving elasticity PDEs to propagate
        boundary displacements to interior vertices. Surface meshes have no
        volumetric interior - the ELAS library only supports 2D/3D elasticity,
        not shell/membrane elasticity needed for surfaces.

        Alternative: Use mmgpy.move_mesh() to move vertices and remesh:
            mmgpy.move_mesh(mesh, displacement, hausd=0.01)

        Parameters
        ----------
        displacement : NDArray[np.float64]
            Not used - raises RuntimeError immediately.
        **kwargs : float | None
            Not used - raises RuntimeError immediately.

        Raises
        ------
        RuntimeError
            Always raised - Lagrangian motion is not supported for surface meshes.

        """

    def remesh_levelset(
        self,
        levelset: NDArray[np.float64],
        *,
        ls: float | None = None,
        hmin: float | None = None,
        hmax: float | None = None,
        hsiz: float | None = None,
        hausd: float | None = None,
        hgrad: float | None = None,
        verbose: int | bool | None = None,
        iso: int | None = None,
        **kwargs: float | None,
    ) -> dict[str, Any]:
        """Remesh to conform to a level-set isoline.

        Parameters
        ----------
        levelset : NDArray[np.float64]
            Level-set values, shape (n_vertices, 1).
        ls : float | None
            Isovalue to discretize (default 0.0).
        hmin : float | None
            Minimum edge size.
        hmax : float | None
            Maximum edge size.
        hsiz : float | None
            Uniform target edge size.
        hausd : float | None
            Hausdorff distance for geometry approximation.
        hgrad : float | None
            Gradation parameter.
        verbose : int | bool | None
            Verbosity level.
        iso : int | None
            Enable level-set mode (default 1).
        **kwargs : float | int | None
            Additional MMG options.

        Returns
        -------
        dict[str, Any]
            Statistics dictionary with before/after metrics.

        """
