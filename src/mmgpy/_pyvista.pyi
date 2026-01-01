from typing import overload

import pyvista as pv

from mmgpy._mmgpy import MmgMesh2D, MmgMesh3D, MmgMeshS

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
) -> MmgMesh3D | MmgMesh2D | MmgMeshS: ...
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
) -> pv.UnstructuredGrid | pv.PolyData: ...
def add_pyvista_methods() -> None: ...

__all__: list[str] = ["add_pyvista_methods", "from_pyvista", "to_pyvista"]
