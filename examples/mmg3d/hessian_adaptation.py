# /// script
# requires-python = ">=3.10"
# dependencies = [
#     "mmgpy",
#     "numpy",
#     "pyvista",
# ]
#
# [tool.uv.sources]
# mmgpy = { path = "../.." }
# ///
"""Solution-adaptive 3D remeshing via patch-based Hessian recovery.

Given a scalar field defined on a tetrahedral mesh,
``mmgpy.metrics.compute_hessian`` recovers the Hessian by least-squares
on a 2-ring patch around each vertex, and ``create_metric_from_hessian``
turns the Hessian into an anisotropic metric that MMG can use for
adaptive remeshing.

This example uses an analytic field with a sharp spherical front,
``f(p) = tanh(40 * (||p - 0.5|| - 0.3))``, computes the Hessian on the
initial uniform mesh, and runs anisotropic remeshing so the new mesh
refines on the front and stays coarse elsewhere.
"""

from __future__ import annotations

import numpy as np
import pyvista as pv

import mmgpy  # noqa: F401  -- registers the .mmg accessor
from mmgpy.metrics import compute_hessian, create_metric_from_hessian


def make_unit_cube() -> tuple[np.ndarray, np.ndarray]:
    """Tetrahedralized unit cube on [0, 1]^3 with a structured initial seeding."""
    cube = pv.Cube().triangulate().subdivide(3)
    tetra = cube.delaunay_3d()
    vertices = np.asarray(tetra.points, dtype=np.float64) + 0.5
    elements = tetra.cells_dict[pv.CellType.TETRA].astype(np.int32)
    return vertices, elements


def front_field(vertices: np.ndarray) -> np.ndarray:
    """Analytic field with a thin transition along a sphere of radius 0.3."""
    r = np.linalg.norm(vertices - 0.5, axis=1)
    return np.tanh(40.0 * (r - 0.3))


def main() -> None:
    """Build a uniform mesh, recover the Hessian, and remesh adaptively."""
    vertices, elements = make_unit_cube()
    field = front_field(vertices)

    hessian = compute_hessian(vertices, elements, field)
    metric = create_metric_from_hessian(
        hessian,
        target_error=1e-2,
        hmin=1e-2,
        hmax=0.15,
    )

    original = pv.UnstructuredGrid({pv.CellType.TETRA: elements}, vertices)
    original.point_data["solution"] = field
    original.point_data["metric"] = metric

    adapted = original.mmg.remesh(hgrad=2.0, verbose=False)
    n_tets_in = elements.shape[0]
    n_tets_out = adapted.cells_dict.get(pv.CellType.TETRA, np.empty((0, 4))).shape[0]
    print(
        f"Initial: {len(vertices)} vertices, {n_tets_in} tetrahedra\n"
        f"Adapted: {adapted.n_points} vertices, {n_tets_out} tetrahedra",
    )

    # Slice both meshes through the centre to expose interior refinement.
    plane = (np.array([1.0, 0.0, 0.0]), np.array([0.5, 0.5, 0.5]))
    original_slice = original.slice(normal=plane[0], origin=plane[1])
    adapted_slice = adapted.slice(normal=plane[0], origin=plane[1])

    pl = pv.Plotter(shape=(1, 2))
    pl.subplot(0, 0)
    pl.add_mesh(
        original_slice,
        scalars="solution",
        cmap="RdBu_r",
        show_edges=True,
        line_width=0.5,
    )
    pl.add_title(f"Uniform mesh slice ({len(vertices)} verts)", font_size=10)

    pl.subplot(0, 1)
    pl.add_mesh(adapted_slice, color="white", show_edges=True, line_width=0.5)
    pl.add_title(f"Adapted mesh slice ({adapted.n_points} verts)", font_size=10)

    pl.link_views()
    pl.show()


if __name__ == "__main__":
    main()
