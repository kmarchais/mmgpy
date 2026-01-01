from collections.abc import Sequence
from pathlib import Path
from typing import overload

import numpy as np
import pyvista as pv
from numpy.typing import NDArray

from ._options import Mmg2DOptions, Mmg3DOptions, MmgSOptions

class mmg3d:  # noqa: N801
    @staticmethod
    def remesh(
        input_mesh: str | Path,
        input_sol: str | Path | None = None,
        output_mesh: str | Path | None = None,
        output_sol: str | Path | None = None,
        options: dict[str, float | int] = ...,
    ) -> bool: ...

class mmg2d:  # noqa: N801
    @staticmethod
    def remesh(
        input_mesh: str | Path,
        input_sol: str | Path | None = None,
        output_mesh: str | Path | None = None,
        output_sol: str | Path | None = None,
        options: dict[str, float | int] = ...,
    ) -> bool: ...

class mmgs:  # noqa: N801
    @staticmethod
    def remesh(
        input_mesh: str | Path,
        input_sol: str | Path | None = None,
        output_mesh: str | Path | None = None,
        output_sol: str | Path | None = None,
        options: dict[str, float | int] = ...,
    ) -> bool: ...

class MmgMesh3D:
    @overload
    def __init__(self) -> None: ...
    @overload
    def __init__(
        self,
        vertices: NDArray[np.float64],
        elements: NDArray[np.int32],
    ) -> None: ...
    @overload
    def __init__(
        self,
        filename: str | Path,
    ) -> None: ...
    def set_vertices_and_elements(
        self,
        vertices: NDArray[np.float64],
        elements: NDArray[np.int32],
    ) -> None: ...
    def get_vertices(self) -> NDArray[np.float64]: ...
    def get_elements(self) -> NDArray[np.int32]: ...

    # Low-level mesh construction API (Phase 1 of Issue #50)
    def set_mesh_size(
        self,
        vertices: int = 0,
        tetrahedra: int = 0,
        prisms: int = 0,
        triangles: int = 0,
        quadrilaterals: int = 0,
        edges: int = 0,
    ) -> None: ...
    def get_mesh_size(
        self,
    ) -> tuple[int, int, int, int, int, int]: ...
    def set_vertices(
        self,
        vertices: NDArray[np.float64],
        refs: NDArray[np.int64] | None = None,
    ) -> None: ...
    def set_tetrahedra(
        self,
        tetrahedra: NDArray[np.int32],
        refs: NDArray[np.int64] | None = None,
    ) -> None: ...
    def set_triangles(
        self,
        triangles: NDArray[np.int32],
        refs: NDArray[np.int64] | None = None,
    ) -> None: ...
    def set_edges(
        self,
        edges: NDArray[np.int32],
        refs: NDArray[np.int64] | None = None,
    ) -> None: ...
    def get_vertices_with_refs(
        self,
    ) -> tuple[NDArray[np.float64], NDArray[np.int64]]: ...
    def get_triangles(self) -> NDArray[np.int32]: ...
    def get_triangles_with_refs(
        self,
    ) -> tuple[NDArray[np.int32], NDArray[np.int64]]: ...
    def get_elements_with_refs(
        self,
    ) -> tuple[NDArray[np.int32], NDArray[np.int64]]: ...
    def get_edges(self) -> NDArray[np.int32]: ...
    def get_edges_with_refs(
        self,
    ) -> tuple[NDArray[np.int32], NDArray[np.int64]]: ...

    # Phase 2: Single element operations
    def set_vertex(
        self,
        x: float,
        y: float,
        z: float,
        ref: int,
        idx: int,
    ) -> None: ...
    def set_tetrahedron(
        self,
        v0: int,
        v1: int,
        v2: int,
        v3: int,
        ref: int,
        idx: int,
    ) -> None: ...
    def set_triangle(
        self,
        v0: int,
        v1: int,
        v2: int,
        ref: int,
        idx: int,
    ) -> None: ...
    def set_edge(self, v0: int, v1: int, ref: int, idx: int) -> None: ...
    def get_vertex(self, idx: int) -> tuple[float, float, float, int]: ...
    def get_tetrahedron(
        self,
        idx: int,
    ) -> tuple[int, int, int, int, int]: ...
    def get_triangle(self, idx: int) -> tuple[int, int, int, int]: ...
    def get_edge(self, idx: int) -> tuple[int, int, int]: ...

    # Element attributes
    def set_corners(self, vertex_indices: NDArray[np.int32]) -> None: ...
    def set_required_vertices(self, vertex_indices: NDArray[np.int32]) -> None: ...
    def set_ridge_edges(self, edge_indices: NDArray[np.int32]) -> None: ...

    # Topology queries
    def get_adjacent_elements(self, idx: int) -> NDArray[np.int32]: ...
    def get_vertex_neighbors(self, idx: int) -> NDArray[np.int32]: ...
    def get_element_quality(self, idx: int) -> float: ...
    def get_element_qualities(self) -> NDArray[np.float64]: ...

    # Phase 3: Advanced element types (prisms and quadrilaterals)
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
    ) -> None: ...
    def set_quadrilateral(
        self,
        v0: int,
        v1: int,
        v2: int,
        v3: int,
        ref: int,
        idx: int,
    ) -> None: ...
    def set_prisms(
        self,
        prisms: NDArray[np.int32],
        refs: NDArray[np.int64] | None = None,
    ) -> None: ...
    def set_quadrilaterals(
        self,
        quads: NDArray[np.int32],
        refs: NDArray[np.int64] | None = None,
    ) -> None: ...
    def get_prism(self, idx: int) -> tuple[int, int, int, int, int, int, int]: ...
    def get_quadrilateral(self, idx: int) -> tuple[int, int, int, int, int]: ...
    def get_prisms(self) -> NDArray[np.int32]: ...
    def get_prisms_with_refs(
        self,
    ) -> tuple[NDArray[np.int32], NDArray[np.int64]]: ...
    def get_quadrilaterals(self) -> NDArray[np.int32]: ...
    def get_quadrilaterals_with_refs(
        self,
    ) -> tuple[NDArray[np.int32], NDArray[np.int64]]: ...
    def get_tetrahedra(self) -> NDArray[np.int32]: ...
    def get_tetrahedra_with_refs(
        self,
    ) -> tuple[NDArray[np.int32], NDArray[np.int64]]: ...
    def set_field(self, key: str, value: NDArray[np.float64]) -> None: ...
    def get_field(self, key: str) -> NDArray[np.float64]: ...
    def __setitem__(self, key: str, value: NDArray[np.float64]) -> None: ...
    def __getitem__(self, key: str) -> NDArray[np.float64]: ...
    def save(self, filename: str | Path) -> None: ...
    def remesh(
        self,
        options: Mmg3DOptions | None = None,
        *,
        hmin: float | None = None,
        hmax: float | None = None,
        hsiz: float | None = None,
        hausd: float | None = None,
        hgrad: float | None = None,
        verbose: bool | int | None = None,
        optim: int | None = None,
        noinsert: int | None = None,
        noswap: int | None = None,
        nomove: int | None = None,
        nosurf: int | None = None,
        **kwargs: float,
    ) -> None: ...
    def remesh_lagrangian(
        self,
        displacement: NDArray[np.float64],
        *,
        hmin: float | None = None,
        hmax: float | None = None,
        hsiz: float | None = None,
        hausd: float | None = None,
        hgrad: float | None = None,
        verbose: bool | int | None = None,
        lag: int | None = None,
        **kwargs: float,
    ) -> None: ...
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
        verbose: bool | int | None = None,
        iso: int | None = None,
        **kwargs: float,
    ) -> None: ...
    # PyVista integration (added by mmgpy._pyvista.add_pyvista_methods)
    @classmethod
    def from_pyvista(
        cls,
        mesh: pv.UnstructuredGrid | pv.PolyData,
    ) -> MmgMesh3D: ...
    def to_pyvista(
        self,
        *,
        include_refs: bool = True,
    ) -> pv.UnstructuredGrid: ...
    # Convenience methods (added by mmgpy._add_convenience_methods)
    def remesh_optimize(self, *, verbose: int | None = None) -> None: ...
    def remesh_uniform(self, size: float, *, verbose: int | None = None) -> None: ...
    # Local sizing methods (added by mmgpy._add_sizing_methods)
    def set_size_sphere(
        self,
        center: Sequence[float] | NDArray[np.float64],
        radius: float,
        size: float,
    ) -> None: ...
    def set_size_box(
        self,
        bounds: Sequence[Sequence[float]] | NDArray[np.float64],
        size: float,
    ) -> None: ...
    def set_size_cylinder(
        self,
        point1: Sequence[float] | NDArray[np.float64],
        point2: Sequence[float] | NDArray[np.float64],
        radius: float,
        size: float,
    ) -> None: ...
    def set_size_from_point(
        self,
        point: Sequence[float] | NDArray[np.float64],
        near_size: float,
        far_size: float,
        influence_radius: float,
    ) -> None: ...
    def clear_local_sizing(self) -> None: ...
    def get_local_sizing_count(self) -> int: ...
    def apply_local_sizing(self) -> None: ...

# Phase 4: 2D planar mesh class (MMG2D)
class MmgMesh2D:
    @overload
    def __init__(self) -> None: ...
    @overload
    def __init__(
        self,
        vertices: NDArray[np.float64],
        triangles: NDArray[np.int32],
    ) -> None: ...
    @overload
    def __init__(
        self,
        filename: str | Path,
    ) -> None: ...

    # Mesh sizing
    def set_mesh_size(
        self,
        vertices: int = 0,
        triangles: int = 0,
        quadrilaterals: int = 0,
        edges: int = 0,
    ) -> None: ...
    def get_mesh_size(self) -> tuple[int, int, int, int]: ...

    # Bulk setters
    def set_vertices(
        self,
        vertices: NDArray[np.float64],
        refs: NDArray[np.int64] | None = None,
    ) -> None: ...
    def set_triangles(
        self,
        triangles: NDArray[np.int32],
        refs: NDArray[np.int64] | None = None,
    ) -> None: ...
    def set_quadrilaterals(
        self,
        quads: NDArray[np.int32],
        refs: NDArray[np.int64] | None = None,
    ) -> None: ...
    def set_edges(
        self,
        edges: NDArray[np.int32],
        refs: NDArray[np.int64] | None = None,
    ) -> None: ...

    # Bulk getters
    def get_vertices(self) -> NDArray[np.float64]: ...
    def get_vertices_with_refs(
        self,
    ) -> tuple[NDArray[np.float64], NDArray[np.int64]]: ...
    def get_triangles(self) -> NDArray[np.int32]: ...
    def get_triangles_with_refs(
        self,
    ) -> tuple[NDArray[np.int32], NDArray[np.int64]]: ...
    def get_quadrilaterals(self) -> NDArray[np.int32]: ...
    def get_quadrilaterals_with_refs(
        self,
    ) -> tuple[NDArray[np.int32], NDArray[np.int64]]: ...
    def get_edges(self) -> NDArray[np.int32]: ...
    def get_edges_with_refs(
        self,
    ) -> tuple[NDArray[np.int32], NDArray[np.int64]]: ...

    # Single element setters
    def set_vertex(self, x: float, y: float, ref: int, idx: int) -> None: ...
    def set_triangle(
        self,
        v0: int,
        v1: int,
        v2: int,
        ref: int,
        idx: int,
    ) -> None: ...
    def set_quadrilateral(
        self,
        v0: int,
        v1: int,
        v2: int,
        v3: int,
        ref: int,
        idx: int,
    ) -> None: ...
    def set_edge(self, v0: int, v1: int, ref: int, idx: int) -> None: ...

    # Single element getters
    def get_vertex(self, idx: int) -> tuple[float, float, int]: ...
    def get_triangle(self, idx: int) -> tuple[int, int, int, int]: ...
    def get_quadrilateral(self, idx: int) -> tuple[int, int, int, int, int]: ...
    def get_edge(self, idx: int) -> tuple[int, int, int]: ...

    # Element attributes
    def set_corners(self, vertex_indices: NDArray[np.int32]) -> None: ...
    def set_required_vertices(self, vertex_indices: NDArray[np.int32]) -> None: ...
    def set_required_edges(self, edge_indices: NDArray[np.int32]) -> None: ...

    # Topology queries
    def get_adjacent_elements(self, idx: int) -> NDArray[np.int32]: ...
    def get_vertex_neighbors(self, idx: int) -> NDArray[np.int32]: ...
    def get_element_quality(self, idx: int) -> float: ...
    def get_element_qualities(self) -> NDArray[np.float64]: ...

    # Solution fields
    def set_field(self, key: str, value: NDArray[np.float64]) -> None: ...
    def get_field(self, key: str) -> NDArray[np.float64]: ...
    def __setitem__(self, key: str, value: NDArray[np.float64]) -> None: ...
    def __getitem__(self, key: str) -> NDArray[np.float64]: ...

    # File I/O
    def save(self, filename: str | Path) -> None: ...
    def remesh(
        self,
        options: Mmg2DOptions | None = None,
        *,
        hmin: float | None = None,
        hmax: float | None = None,
        hsiz: float | None = None,
        hausd: float | None = None,
        hgrad: float | None = None,
        verbose: bool | int | None = None,
        optim: int | None = None,
        noinsert: int | None = None,
        noswap: int | None = None,
        nomove: int | None = None,
        **kwargs: float,
    ) -> None: ...
    def remesh_lagrangian(
        self,
        displacement: NDArray[np.float64],
        *,
        hmin: float | None = None,
        hmax: float | None = None,
        hsiz: float | None = None,
        hausd: float | None = None,
        hgrad: float | None = None,
        verbose: bool | int | None = None,
        lag: int | None = None,
        **kwargs: float,
    ) -> None: ...
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
        verbose: bool | int | None = None,
        iso: int | None = None,
        **kwargs: float,
    ) -> None: ...
    # PyVista integration (added by mmgpy._pyvista.add_pyvista_methods)
    @classmethod
    def from_pyvista(
        cls,
        mesh: pv.UnstructuredGrid | pv.PolyData,
    ) -> MmgMesh2D: ...
    def to_pyvista(self, *, include_refs: bool = True) -> pv.PolyData: ...
    # Convenience methods (added by mmgpy._add_convenience_methods)
    def remesh_optimize(self, *, verbose: int | None = None) -> None: ...
    def remesh_uniform(self, size: float, *, verbose: int | None = None) -> None: ...
    # Local sizing methods (added by mmgpy._add_sizing_methods)
    def set_size_sphere(
        self,
        center: Sequence[float] | NDArray[np.float64],
        radius: float,
        size: float,
    ) -> None: ...
    def set_size_box(
        self,
        bounds: Sequence[Sequence[float]] | NDArray[np.float64],
        size: float,
    ) -> None: ...
    def set_size_from_point(
        self,
        point: Sequence[float] | NDArray[np.float64],
        near_size: float,
        far_size: float,
        influence_radius: float,
    ) -> None: ...
    def clear_local_sizing(self) -> None: ...
    def get_local_sizing_count(self) -> int: ...
    def apply_local_sizing(self) -> None: ...

# Phase 4: Surface mesh class (MMGS)
class MmgMeshS:
    @overload
    def __init__(self) -> None: ...
    @overload
    def __init__(
        self,
        vertices: NDArray[np.float64],
        triangles: NDArray[np.int32],
    ) -> None: ...
    @overload
    def __init__(
        self,
        filename: str | Path,
    ) -> None: ...

    # Mesh sizing
    def set_mesh_size(
        self,
        vertices: int = 0,
        triangles: int = 0,
        edges: int = 0,
    ) -> None: ...
    def get_mesh_size(self) -> tuple[int, int, int]: ...

    # Bulk setters
    def set_vertices(
        self,
        vertices: NDArray[np.float64],
        refs: NDArray[np.int64] | None = None,
    ) -> None: ...
    def set_triangles(
        self,
        triangles: NDArray[np.int32],
        refs: NDArray[np.int64] | None = None,
    ) -> None: ...
    def set_edges(
        self,
        edges: NDArray[np.int32],
        refs: NDArray[np.int64] | None = None,
    ) -> None: ...

    # Bulk getters
    def get_vertices(self) -> NDArray[np.float64]: ...
    def get_vertices_with_refs(
        self,
    ) -> tuple[NDArray[np.float64], NDArray[np.int64]]: ...
    def get_triangles(self) -> NDArray[np.int32]: ...
    def get_triangles_with_refs(
        self,
    ) -> tuple[NDArray[np.int32], NDArray[np.int64]]: ...
    def get_edges(self) -> NDArray[np.int32]: ...
    def get_edges_with_refs(
        self,
    ) -> tuple[NDArray[np.int32], NDArray[np.int64]]: ...

    # Single element setters
    def set_vertex(
        self,
        x: float,
        y: float,
        z: float,
        ref: int,
        idx: int,
    ) -> None: ...
    def set_triangle(
        self,
        v0: int,
        v1: int,
        v2: int,
        ref: int,
        idx: int,
    ) -> None: ...
    def set_edge(self, v0: int, v1: int, ref: int, idx: int) -> None: ...

    # Single element getters
    def get_vertex(self, idx: int) -> tuple[float, float, float, int]: ...
    def get_triangle(self, idx: int) -> tuple[int, int, int, int]: ...
    def get_edge(self, idx: int) -> tuple[int, int, int]: ...

    # Element attributes
    def set_corners(self, vertex_indices: NDArray[np.int32]) -> None: ...
    def set_required_vertices(self, vertex_indices: NDArray[np.int32]) -> None: ...
    def set_ridge_edges(self, edge_indices: NDArray[np.int32]) -> None: ...

    # Topology queries
    def get_adjacent_elements(self, idx: int) -> NDArray[np.int32]: ...
    def get_vertex_neighbors(self, idx: int) -> NDArray[np.int32]: ...
    def get_element_quality(self, idx: int) -> float: ...
    def get_element_qualities(self) -> NDArray[np.float64]: ...

    # Solution fields
    def set_field(self, key: str, value: NDArray[np.float64]) -> None: ...
    def get_field(self, key: str) -> NDArray[np.float64]: ...
    def __setitem__(self, key: str, value: NDArray[np.float64]) -> None: ...
    def __getitem__(self, key: str) -> NDArray[np.float64]: ...

    # File I/O
    def save(self, filename: str | Path) -> None: ...
    def remesh(
        self,
        options: MmgSOptions | None = None,
        *,
        hmin: float | None = None,
        hmax: float | None = None,
        hsiz: float | None = None,
        hausd: float | None = None,
        hgrad: float | None = None,
        verbose: bool | int | None = None,
        optim: int | None = None,
        noinsert: int | None = None,
        noswap: int | None = None,
        nomove: int | None = None,
        **kwargs: float,
    ) -> None: ...
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
        verbose: bool | int | None = None,
        iso: int | None = None,
        **kwargs: float,
    ) -> None: ...
    # PyVista integration (added by mmgpy._pyvista.add_pyvista_methods)
    @classmethod
    def from_pyvista(
        cls,
        mesh: pv.UnstructuredGrid | pv.PolyData,
    ) -> MmgMeshS: ...
    def to_pyvista(self, *, include_refs: bool = True) -> pv.PolyData: ...
    # Convenience methods (added by mmgpy._add_convenience_methods)
    def remesh_optimize(self, *, verbose: int | None = None) -> None: ...
    def remesh_uniform(self, size: float, *, verbose: int | None = None) -> None: ...
    # Local sizing methods (added by mmgpy._add_sizing_methods)
    def set_size_sphere(
        self,
        center: Sequence[float] | NDArray[np.float64],
        radius: float,
        size: float,
    ) -> None: ...
    def set_size_box(
        self,
        bounds: Sequence[Sequence[float]] | NDArray[np.float64],
        size: float,
    ) -> None: ...
    def set_size_cylinder(
        self,
        point1: Sequence[float] | NDArray[np.float64],
        point2: Sequence[float] | NDArray[np.float64],
        radius: float,
        size: float,
    ) -> None: ...
    def set_size_from_point(
        self,
        point: Sequence[float] | NDArray[np.float64],
        near_size: float,
        far_size: float,
        influence_radius: float,
    ) -> None: ...
    def clear_local_sizing(self) -> None: ...
    def get_local_sizing_count(self) -> int: ...
    def apply_local_sizing(self) -> None: ...
