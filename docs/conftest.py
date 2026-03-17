"""Pytest-codeblocks fixtures for documentation code snippets.

Monkeypatches mmgpy I/O so that code blocks referencing files like
``mmgpy.read("input.mesh")`` work without real files on disk.

Since pytest-codeblocks' TestBlock inherits from pytest.Item (not
pytest.Function), autouse fixtures are not applied. Instead, we apply
patches at module level when this conftest is loaded, and use
pytest_runtest_setup/teardown hooks for per-test tmp_path management.
"""

from __future__ import annotations

import os
import tempfile
from pathlib import Path
from typing import TYPE_CHECKING

import numpy as np
import pyvista as pv
from scipy.spatial import Delaunay

if TYPE_CHECKING:
    from mmgpy._mesh import Mesh as MeshType
    from mmgpy._mesh import MeshKind

os.environ["PYVISTA_OFF_SCREEN"] = "true"

# ---------------------------------------------------------------------------
# Module-level mesh factories (created once at import time)
# ---------------------------------------------------------------------------


def _make_3d_mesh() -> tuple[np.ndarray, np.ndarray]:
    """Dense tetrahedral mesh of a unit cube via PyVista delaunay_3d."""
    resolution = 5
    x = np.linspace(0, 1, resolution)
    y = np.linspace(0, 1, resolution)
    z = np.linspace(0, 1, resolution)
    xx, yy, zz = np.meshgrid(x, y, z, indexing="ij")
    points = np.column_stack([xx.ravel(), yy.ravel(), zz.ravel()])
    cloud = pv.PolyData(points)
    tetra = cloud.delaunay_3d()
    vertices = np.array(tetra.points, dtype=np.float64)
    elements = tetra.cells_dict[pv.CellType.TETRA].astype(np.int32)
    return vertices, elements


def _make_2d_mesh() -> tuple[np.ndarray, np.ndarray]:
    """Dense triangular mesh of a unit square via scipy Delaunay."""
    resolution = 10
    x = np.linspace(0, 1, resolution)
    y = np.linspace(0, 1, resolution)
    xx, yy = np.meshgrid(x, y)
    points = np.column_stack([xx.ravel(), yy.ravel()])
    tri = Delaunay(points)
    return points.astype(np.float64), tri.simplices.astype(np.int32)


def _make_surface_mesh() -> tuple[np.ndarray, np.ndarray]:
    """Triangulated sphere surface via PyVista."""
    sphere = pv.Sphere(theta_resolution=10, phi_resolution=10)
    sphere = sphere.triangulate()
    vertices = np.array(sphere.points, dtype=np.float64)
    faces = sphere.faces.reshape(-1, 4)[:, 1:].astype(np.int32)
    return vertices, faces


_VERTS_3D, _CELLS_3D = _make_3d_mesh()
_VERTS_2D, _CELLS_2D = _make_2d_mesh()
_VERTS_SURF, _CELLS_SURF = _make_surface_mesh()

# ---------------------------------------------------------------------------
# Routing helpers
# ---------------------------------------------------------------------------

_SURFACE_EXTENSIONS = {".stl", ".obj", ".ply", ".off", ".vtp"}
_SURFACE_KEYWORDS = {"surface", "mechanical", "part", "torus", "sphere", "bunny"}
_2D_KEYWORDS = {"2d", "planar"}


def _classify_filename(name: str) -> str:
    """Return '2d', 'surface', or '3d' based on filename heuristics."""
    lower = name.lower()
    ext = Path(name).suffix.lower()
    if ext in _SURFACE_EXTENSIONS:
        return "surface"
    if any(kw in lower for kw in _2D_KEYWORDS):
        return "2d"
    if any(kw in lower for kw in _SURFACE_KEYWORDS):
        return "surface"
    return "3d"


# ---------------------------------------------------------------------------
# Module-level monkeypatches (applied once at import time)
# ---------------------------------------------------------------------------

import mmgpy  # noqa: E402
import mmgpy._io as _io_mod  # noqa: E402
from mmgpy import Mesh  # noqa: E402

_real_read = _io_mod.read
_real_save = Mesh.save

# Temp dir for save redirects (cleaned up at process exit)
_tmp_dir = tempfile.mkdtemp(prefix="mmgpy_docs_")


def _fake_read(
    source: str | Path | pv.UnstructuredGrid | pv.PolyData,
    mesh_kind: MeshKind | None = None,
) -> MeshType:
    if isinstance(source, (pv.UnstructuredGrid, pv.PolyData)):
        return _real_read(source, mesh_kind=mesh_kind)

    name = str(source)
    kind = _classify_filename(name)
    if kind == "2d":
        return Mesh(_VERTS_2D.copy(), _CELLS_2D.copy())
    if kind == "surface":
        return Mesh(_VERTS_SURF.copy(), _CELLS_SURF.copy())
    return Mesh(_VERTS_3D.copy(), _CELLS_3D.copy())


def _patched_save(self: MeshType, filename: str | Path) -> None:
    dest = Path(_tmp_dir) / Path(filename).name
    _real_save(self, str(dest))


_io_mod.read = _fake_read
mmgpy.read = _fake_read
Mesh.save = _patched_save

# Also patch pv.read so docs like `pv.read("mesh.vtk")` work
_real_pv_read = pv.read


def _fake_pv_read(filename: str | Path, **_kwargs: object) -> pv.UnstructuredGrid:
    kind = _classify_filename(str(filename))
    if kind == "2d":
        # Return a flat 2D-like UnstructuredGrid
        cells = np.column_stack(
            [np.full(len(_CELLS_2D), 3), _CELLS_2D],
        ).ravel()
        points_3d = np.column_stack(
            [_VERTS_2D, np.zeros(len(_VERTS_2D))],
        )
        return pv.UnstructuredGrid(
            cells,
            np.full(len(_CELLS_2D), pv.CellType.TRIANGLE),
            points_3d.copy(),
        )
    if kind == "surface":
        return pv.PolyData(_VERTS_SURF.copy(), faces=_make_surface_mesh_faces())
    # 3D tetrahedral
    cells = np.column_stack(
        [np.full(len(_CELLS_3D), 4), _CELLS_3D],
    ).ravel()
    return pv.UnstructuredGrid(
        cells,
        np.full(len(_CELLS_3D), pv.CellType.TETRA),
        _VERTS_3D.copy(),
    )


def _make_surface_mesh_faces() -> np.ndarray:
    """Return PyVista-style face array from surface mesh triangles."""
    n = len(_CELLS_SURF)
    return np.column_stack([np.full(n, 3), _CELLS_SURF]).ravel()


pv.read = _fake_pv_read  # type: ignore[assignment]

# Patch pv.PolyData.save and pv.UnstructuredGrid.save to redirect to tmp_dir
_real_pv_polydata_save = pv.PolyData.save
_real_pv_unstructured_save = pv.UnstructuredGrid.save


def _patched_pv_save(
    self: pv.PolyData | pv.UnstructuredGrid,
    filename: str,
    **kwargs: object,
) -> None:
    dest = str(Path(_tmp_dir) / Path(filename).name)
    if isinstance(self, pv.PolyData):
        _real_pv_polydata_save(self, dest, **kwargs)
    else:
        _real_pv_unstructured_save(self, dest, **kwargs)


pv.PolyData.save = _patched_pv_save  # type: ignore[assignment]
pv.UnstructuredGrid.save = _patched_pv_save  # type: ignore[assignment]
