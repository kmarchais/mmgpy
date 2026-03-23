"""Pytest-codeblocks fixtures for documentation code snippets.

Monkeypatches mmgpy I/O so that code blocks referencing files like
``mmgpy.read("input.mesh")`` work without real files on disk.

Since pytest-codeblocks' TestBlock inherits from pytest.Item (not
pytest.Function), autouse fixtures are not applied. Instead, we apply
patches at module level when this conftest is loaded, and use
pytest_runtest_setup/teardown hooks for per-test tmp_path management.
"""

from __future__ import annotations

import atexit
import os
import shutil
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
# Lazy mesh factories — deferred to first use to avoid creating VTK objects
# at module level, which causes segfaults under pytest with PyPI VTK wheels.
# ---------------------------------------------------------------------------

_VERTS_3D: np.ndarray | None = None
_CELLS_3D: np.ndarray | None = None
_VERTS_2D: np.ndarray | None = None
_CELLS_2D: np.ndarray | None = None
_VERTS_SURF: np.ndarray | None = None
_CELLS_SURF: np.ndarray | None = None


def _get_3d_mesh() -> tuple[np.ndarray, np.ndarray]:
    """Dense tetrahedral mesh of a unit cube via PyVista delaunay_3d (lazy)."""
    global _VERTS_3D, _CELLS_3D  # noqa: PLW0603
    if _VERTS_3D is None:
        resolution = 5
        x = np.linspace(0, 1, resolution)
        y = np.linspace(0, 1, resolution)
        z = np.linspace(0, 1, resolution)
        xx, yy, zz = np.meshgrid(x, y, z, indexing="ij")
        points = np.column_stack([xx.ravel(), yy.ravel(), zz.ravel()])
        cloud = pv.PolyData(points)
        tetra = cloud.delaunay_3d()
        _VERTS_3D = np.array(tetra.points, dtype=np.float64)
        _CELLS_3D = tetra.cells_dict[pv.CellType.TETRA].astype(np.int32)
    return _VERTS_3D, _CELLS_3D


def _get_2d_mesh() -> tuple[np.ndarray, np.ndarray]:
    """Dense triangular mesh of a unit square via scipy Delaunay (lazy)."""
    global _VERTS_2D, _CELLS_2D  # noqa: PLW0603
    if _VERTS_2D is None:
        resolution = 10
        x = np.linspace(0, 1, resolution)
        y = np.linspace(0, 1, resolution)
        xx, yy = np.meshgrid(x, y)
        points = np.column_stack([xx.ravel(), yy.ravel()])
        tri = Delaunay(points)
        _VERTS_2D = points.astype(np.float64)
        _CELLS_2D = tri.simplices.astype(np.int32)
    return _VERTS_2D, _CELLS_2D


def _get_surface_mesh() -> tuple[np.ndarray, np.ndarray]:
    """Triangulated sphere surface via PyVista (lazy)."""
    global _VERTS_SURF, _CELLS_SURF  # noqa: PLW0603
    if _VERTS_SURF is None:
        sphere = pv.Sphere(theta_resolution=10, phi_resolution=10)
        sphere = sphere.triangulate()
        _VERTS_SURF = np.array(sphere.points, dtype=np.float64)
        _CELLS_SURF = sphere.faces.reshape(-1, 4)[:, 1:].astype(np.int32)
    return _VERTS_SURF, _CELLS_SURF


# ---------------------------------------------------------------------------
# Routing helpers
# ---------------------------------------------------------------------------

_SURFACE_EXTENSIONS = {".stl", ".obj", ".ply", ".off", ".vtp"}
_SURFACE_KEYWORDS = {"surface", "mechanical", "part", "torus", "sphere", "bunny"}
_2D_KEYWORDS = {"2d", "planar"}


def _classify_filename(name: str) -> str:
    """Return '2d', 'surface', or '3d' based on filename heuristics.

    NOTE: Routing is based on filename keywords/extensions. This works because
    doc filenames are controlled, but e.g. "sphere_domain.mesh" would route to
    surface even if used in a 3D context.
    """
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
atexit.register(shutil.rmtree, _tmp_dir, ignore_errors=True)


def _fake_read(
    source: str | Path | pv.UnstructuredGrid | pv.PolyData,
    mesh_kind: MeshKind | None = None,
) -> MeshType:
    if isinstance(source, (pv.UnstructuredGrid, pv.PolyData)):
        return _real_read(source, mesh_kind=mesh_kind)

    name = str(source)
    kind = _classify_filename(name)
    if kind == "2d":
        v, c = _get_2d_mesh()
        return Mesh(v.copy(), c.copy())
    if kind == "surface":
        v, c = _get_surface_mesh()
        return Mesh(v.copy(), c.copy())
    v, c = _get_3d_mesh()
    return Mesh(v.copy(), c.copy())


def _patched_save(self: MeshType, filename: str | Path) -> None:
    dest = Path(_tmp_dir) / Path(filename).name
    _real_save(self, str(dest))


_io_mod.read = _fake_read
mmgpy.read = _fake_read
Mesh.save = _patched_save

# Also patch pv.read so docs like `pv.read("mesh.vtk")` work
_real_pv_read = pv.read


def _fake_pv_read(
    filename: str | Path,
    **_kwargs: object,
) -> pv.UnstructuredGrid | pv.PolyData:
    kind = _classify_filename(str(filename))
    if kind == "2d":
        v, c = _get_2d_mesh()
        # Return a flat 2D-like UnstructuredGrid
        cells = np.column_stack(
            [np.full(len(c), 3), c],
        ).ravel()
        points_3d = np.column_stack(
            [v, np.zeros(len(v))],
        )
        return pv.UnstructuredGrid(
            cells,
            np.full(len(c), pv.CellType.TRIANGLE),
            points_3d.copy(),
        )
    if kind == "surface":
        v, c = _get_surface_mesh()
        faces = np.column_stack([np.full(len(c), 3), c]).ravel()
        return pv.PolyData(v.copy(), faces=faces)
    # 3D tetrahedral
    v, c = _get_3d_mesh()
    cells = np.column_stack(
        [np.full(len(c), 4), c],
    ).ravel()
    return pv.UnstructuredGrid(
        cells,
        np.full(len(c), pv.CellType.TETRA),
        v.copy(),
    )


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


# ---------------------------------------------------------------------------
# Restore originals on pytest teardown (avoids polluting other test suites
# when running `pytest tests/ docs/` in a single invocation)
# ---------------------------------------------------------------------------


def pytest_unconfigure() -> None:
    """Restore all monkeypatched functions."""
    _io_mod.read = _real_read
    mmgpy.read = _real_read
    Mesh.save = _real_save
    pv.read = _real_pv_read  # type: ignore[assignment]
    pv.PolyData.save = _real_pv_polydata_save  # type: ignore[assignment]
    pv.UnstructuredGrid.save = _real_pv_unstructured_save  # type: ignore[assignment]
