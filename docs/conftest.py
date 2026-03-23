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
# Mesh factories — use scipy/numpy only (no VTK objects) to avoid segfaults
# when pytest-codeblocks runs code via exec() with PyPI VTK wheels.
# ---------------------------------------------------------------------------


def _make_3d_mesh() -> tuple[np.ndarray, np.ndarray]:
    """Small tetrahedral mesh via scipy Delaunay.

    Uses a 0.3-unit cube centered at (0.5, 0.5, 0.5) so that:
    - hmax=0.1 produces a manageable mesh (~400 tetrahedra)
    - Coordinates like [0.5, 0.5, 0.5] used in docs are inside the mesh
    """
    resolution = 4
    x = np.linspace(0.35, 0.65, resolution)
    y = np.linspace(0.35, 0.65, resolution)
    z = np.linspace(0.35, 0.65, resolution)
    xx, yy, zz = np.meshgrid(x, y, z, indexing="ij")
    points = np.column_stack([xx.ravel(), yy.ravel(), zz.ravel()])
    # Add small jitter to avoid degenerate (zero-volume) tetrahedra
    # from coplanar grid points
    rng = np.random.default_rng(42)
    points += rng.uniform(-1e-6, 1e-6, points.shape)
    tri = Delaunay(points)
    return points.astype(np.float64), tri.simplices.astype(np.int32)


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
    """Triangulated UV sphere surface using numpy (no VTK dependency).

    Generates a sphere similar to pv.Sphere(theta_resolution=10, phi_resolution=10).
    """
    n_theta, n_phi = 10, 10
    theta = np.linspace(0, np.pi, n_theta + 1)
    phi = np.linspace(0, 2 * np.pi, n_phi + 1)[:-1]

    # Build vertices: north pole, grid rows, south pole
    grid = [
        [np.sin(t) * np.cos(p), np.sin(t) * np.sin(p), np.cos(t)]
        for t in theta[1:-1]
        for p in phi
    ]
    verts = np.array(
        [[0.0, 0.0, 1.0], *grid, [0.0, 0.0, -1.0]],
        dtype=np.float64,
    )

    # Build faces
    faces = [[0, 1 + j, 1 + (j + 1) % n_phi] for j in range(n_phi)]
    for i in range(n_theta - 2):
        for j in range(n_phi):
            c = 1 + i * n_phi + j
            n = 1 + i * n_phi + (j + 1) % n_phi
            c2 = 1 + (i + 1) * n_phi + j
            n2 = 1 + (i + 1) * n_phi + (j + 1) % n_phi
            faces.extend([[c, c2, n], [n, c2, n2]])
    south = len(verts) - 1
    base = 1 + (n_theta - 2) * n_phi
    faces.extend([south, base + (j + 1) % n_phi, base + j] for j in range(n_phi))

    return verts, np.array(faces, dtype=np.int32)


def _make_3d_mesh_large() -> tuple[np.ndarray, np.ndarray]:
    """Larger tetrahedral mesh for levelset tests that need more volume."""
    resolution = 4
    x = np.linspace(0, 1, resolution)
    y = np.linspace(0, 1, resolution)
    z = np.linspace(0, 1, resolution)
    xx, yy, zz = np.meshgrid(x, y, z, indexing="ij")
    points = np.column_stack([xx.ravel(), yy.ravel(), zz.ravel()])
    rng = np.random.default_rng(42)
    points += rng.uniform(-1e-6, 1e-6, points.shape)
    tri = Delaunay(points)
    return points.astype(np.float64), tri.simplices.astype(np.int32)


_VERTS_3D, _CELLS_3D = _make_3d_mesh()
_VERTS_3D_LARGE, _CELLS_3D_LARGE = _make_3d_mesh_large()
_VERTS_2D, _CELLS_2D = _make_2d_mesh()
_VERTS_SURF, _CELLS_SURF = _make_surface_mesh()


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
        return Mesh(_VERTS_2D.copy(), _CELLS_2D.copy())
    if kind == "surface":
        return Mesh(_VERTS_SURF.copy(), _CELLS_SURF.copy())
    # Levelset tests use "domain.mesh" and need a larger volume
    if "domain" in name.lower():
        return Mesh(_VERTS_3D_LARGE.copy(), _CELLS_3D_LARGE.copy())
    return Mesh(_VERTS_3D.copy(), _CELLS_3D.copy())


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
        faces = np.column_stack([np.full(len(_CELLS_SURF), 3), _CELLS_SURF]).ravel()
        return pv.PolyData(_VERTS_SURF.copy(), faces=faces)
    # 3D tetrahedral
    cells = np.column_stack(
        [np.full(len(_CELLS_3D), 4), _CELLS_3D],
    ).ravel()
    return pv.UnstructuredGrid(
        cells,
        np.full(len(_CELLS_3D), pv.CellType.TETRA),
        _VERTS_3D.copy(),
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
