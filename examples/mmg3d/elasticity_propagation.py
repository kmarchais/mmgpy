# /// script
# requires-python = ">=3.10"
# dependencies = [
#     "mmgpy[fem]",
#     "numpy",
#     "pyvista",
#     "scipy",
# ]
#
# [tool.uv.sources]
# mmgpy = { path = "../.." }
# ///
"""Animate Laplacian vs elasticity propagation on a 3D L-bracket.

The geometry is a 3D L-bracket: the 2D L from
``examples/mmg2d/elasticity_propagation.py`` extruded in z. The free
tip of the foot is pinned and the top of the post is pulled upward.
The prescribed boundary displacement is propagated to the interior
using two methods:

* ``"laplacian"``: solves a Laplace equation on the mesh graph (default,
  no extra dependency). Has no notion of bending: along each component
  the field is harmonic, which produces a rigid-looking pivot of the
  bracket.
* ``"elasticity"``: solves a linear elasticity problem on the mesh via
  the optional ``fedoo`` backend. Captures the cantilever bending
  through the corner: the post curves backward at the re-entrant corner
  and the foot bows visibly.

``fedoo`` is required for the elasticity panel, hence the
``mmgpy[fem]`` extra. The committed ``elasticity_propagation.gif``
next to this file is rendered at higher fidelity by a separate script
and is the canonical artefact; this example drives the animation
interactively in a PyVista window instead of overwriting it.
"""

from __future__ import annotations

import numpy as np
import pyvista as pv
from scipy.spatial import Delaunay

import mmgpy  # noqa: F401  -- registers the .mmg accessor
from mmgpy import polydata_from_2d_triangles
from mmgpy.lagrangian import (
    propagate_displacement,
    propagate_displacement_elasticity,
)

FOOT_LEN = 1.4
POST_LEN = 1.0
ARM_W = 0.3
DEPTH = 0.3
LIFT = 0.45


def _interp(a: np.ndarray, b: np.ndarray, n: int) -> np.ndarray:
    return np.column_stack(
        [
            np.linspace(a[0], b[0], n, endpoint=False),
            np.linspace(a[1], b[1], n, endpoint=False),
        ],
    )


def _make_2d_l(target_h: float) -> tuple[np.ndarray, np.ndarray]:
    """Triangulated 2D L, remeshed by MMG for clean grading."""
    corners = [
        np.array([0.0, 0.0]),
        np.array([FOOT_LEN, 0.0]),
        np.array([FOOT_LEN, ARM_W]),
        np.array([ARM_W, ARM_W]),
        np.array([ARM_W, POST_LEN]),
        np.array([0.0, POST_LEN]),
    ]
    edges = [
        _interp(a, b, max(2, round(np.linalg.norm(b - a) / target_h)))
        for a, b in zip(corners, [*corners[1:], corners[0]], strict=True)
    ]
    seed = np.vstack(edges).astype(np.float64)
    tri = Delaunay(seed)
    cx, cy = seed[tri.simplices].mean(axis=1).T
    in_foot = (cx >= 0.0) & (cx <= FOOT_LEN) & (cy >= 0.0) & (cy <= ARM_W)
    in_post = (cx >= 0.0) & (cx <= ARM_W) & (cy >= 0.0) & (cy <= POST_LEN)
    triangles = tri.simplices[in_foot | in_post].astype(np.int32)

    pv_mesh = polydata_from_2d_triangles(seed, triangles)
    remeshed = pv_mesh.mmg.remesh(
        hmax=target_h,
        hmin=target_h * 0.45,
        verbose=False,
    )
    return (
        np.asarray(remeshed.points[:, :2], dtype=np.float64),
        np.asarray(remeshed.regular_faces, dtype=np.int32),
    )


def make_l_bracket_3d(
    target_h: float = 0.07,
) -> tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    """3D L-bracket as the 2D L extruded in z, decomposed into tetrahedra."""
    verts2d, tris2d = _make_2d_l(target_h)
    n2d = len(verts2d)

    n_layers = max(2, round(DEPTH / target_h) + 1)
    z_levels = np.linspace(0.0, DEPTH, n_layers)
    vertices = np.vstack(
        [np.column_stack([verts2d, np.full(n2d, z)]) for z in z_levels],
    ).astype(np.float64)

    # Standard prism→3-tets decomposition. Sort each triangle's vertex indices
    # so adjacent prisms agree on the diagonal of each shared quad face,
    # which keeps the tet mesh conformal.
    tets: list[list[int]] = []
    for k in range(n_layers - 1):
        lo = k * n2d
        hi = (k + 1) * n2d
        for raw in tris2d:
            a, b, c = sorted(int(i) for i in raw)
            tets.append([a + lo, b + lo, c + lo, c + hi])
            tets.append([a + lo, b + lo, c + hi, b + hi])
            tets.append([a + lo, b + hi, c + hi, a + hi])
    elements = np.asarray(tets, dtype=np.int32)

    fixed_2d = np.isclose(verts2d[:, 0], FOOT_LEN)
    loaded_2d = np.isclose(verts2d[:, 1], POST_LEN) & (verts2d[:, 0] <= ARM_W + 1e-9)
    fixed_mask = np.tile(fixed_2d, n_layers)
    loaded_mask = np.tile(loaded_2d, n_layers)
    return vertices, elements, fixed_mask, loaded_mask


def main() -> None:
    """Compute both propagated displacement fields and save an animated GIF."""
    vertices, elements, fixed_mask, loaded_mask = make_l_bracket_3d()
    print(f"3D L mesh: {len(vertices)} vertices, {len(elements)} tetrahedra")

    boundary = fixed_mask | loaded_mask
    bdy_disp = np.zeros_like(vertices)
    bdy_disp[loaded_mask, 1] = LIFT

    full_lap = propagate_displacement(vertices, elements, boundary, bdy_disp)
    try:
        full_ela = propagate_displacement_elasticity(
            vertices,
            elements,
            boundary,
            bdy_disp,
            nu=0.3,
        )
        ela_available = True
    except ImportError as exc:
        print(f"Elasticity propagation unavailable ({exc}); right panel will skip.")
        full_ela = np.zeros_like(full_lap)
        ela_available = False

    mag_lap = np.linalg.norm(full_lap, axis=1)
    mag_ela = np.linalg.norm(full_ela, axis=1) if ela_available else mag_lap
    vmax = float(max(mag_lap.max(), mag_ela.max()))

    n_frames = 60
    phase = np.linspace(0.0, 2.0 * np.pi, n_frames, endpoint=False)
    ts = 0.5 * (1.0 - np.cos(phase))

    cells = {pv.CellType.TETRA: elements}
    grid_lap = pv.UnstructuredGrid(cells, vertices.copy())
    grid_lap["disp"] = np.zeros(len(vertices))
    grid_ela = pv.UnstructuredGrid(cells, vertices.copy())
    grid_ela["disp"] = np.zeros(len(vertices))

    pl = pv.Plotter(shape=(1, 2), window_size=(1300, 650))

    pl.subplot(0, 0)
    pl.add_mesh(
        grid_lap,
        scalars="disp",
        cmap="viridis",
        clim=[0.0, vmax],
        show_edges=True,
        edge_color="black",
        line_width=0.4,
        scalar_bar_args={"title": "|u|"},
    )
    pl.add_text("Laplacian propagation", font_size=10)
    pl.show_axes()

    pl.subplot(0, 1)
    if ela_available:
        pl.add_mesh(
            grid_ela,
            scalars="disp",
            cmap="viridis",
            clim=[0.0, vmax],
            show_edges=True,
            edge_color="black",
            line_width=0.4,
            show_scalar_bar=False,
        )
        pl.add_text("Elasticity propagation (fedoo)", font_size=10)
    else:
        pl.add_text("fedoo not installed\n(uv add fedoo)", font_size=12)
    pl.show_axes()
    pl.link_views()

    # Frame the camera around the worst-case deformed bounding box so the
    # bracket stays fully visible across every frame. Tracks both methods'
    # peak deflection.
    peak_pts = [vertices, vertices + full_lap]
    if ela_available:
        peak_pts.append(vertices + full_ela)
    all_pts = np.vstack(peak_pts)
    margin = 0.05 * float(np.ptp(all_pts, axis=0).max())
    bounds = (
        all_pts[:, 0].min() - margin,
        all_pts[:, 0].max() + margin,
        all_pts[:, 1].min() - margin,
        all_pts[:, 1].max() + margin,
        all_pts[:, 2].min() - margin,
        all_pts[:, 2].max() + margin,
    )
    cx, cy, cz = (
        0.5 * (bounds[0] + bounds[1]),
        0.5 * (bounds[2] + bounds[3]),
        0.5 * (bounds[4] + bounds[5]),
    )
    diag = float(
        np.linalg.norm(
            [bounds[1] - bounds[0], bounds[3] - bounds[2], bounds[5] - bounds[4]],
        ),
    )
    pl.camera_position = [
        (cx + 0.4 * diag, cy - 0.5 * diag, cz + 1.5 * diag),
        (cx, cy, cz),
        (0.0, 1.0, 0.0),
    ]
    for sp in (0, 1):
        pl.subplot(0, sp)
        pl.reset_camera(bounds=bounds)

    # Drive the animation interactively. The high-quality GIF that ships
    # next to this script (``elasticity_propagation.gif``) is generated
    # separately with a higher-fidelity renderer and committed as the
    # canonical artefact, so we don't overwrite it from here.
    pl.show(auto_close=False, interactive_update=True)
    for t in ts:
        grid_lap.points = vertices + t * full_lap
        grid_lap["disp"] = t * mag_lap
        if ela_available:
            grid_ela.points = vertices + t * full_ela
            grid_ela["disp"] = t * mag_ela
        pl.update()
    pl.close()


if __name__ == "__main__":
    main()
