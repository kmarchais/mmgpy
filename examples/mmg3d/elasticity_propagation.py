# /// script
# requires-python = ">=3.10"
# dependencies = [
#     "mmgpy[fem]",
#     "numpy",
#     "pyvista",
# ]
#
# [tool.uv.sources]
# mmgpy = { path = "../.." }
# ///
"""Compare Laplacian vs elasticity propagation for 3D Lagrangian motion.

This example pins the bottom face of a unit cube and pushes the top face
upward, then propagates the prescribed boundary displacement to the
interior using two methods:

* ``"laplacian"``: solves a Laplace equation on the mesh graph (default,
  no extra dependency).
* ``"elasticity"``: solves a fictitious linear elasticity problem on the
  mesh via the optional ``fedoo`` backend. It tends to produce smoother,
  physically meaningful interior displacements for large deformations.

Run with ``uv run examples/mmg3d/elasticity_propagation.py``. ``fedoo``
is required for the elasticity panel, hence the ``mmgpy[fem]`` extra.
"""

from __future__ import annotations

import numpy as np
import pyvista as pv

import mmgpy  # noqa: F401  -- registers the .mmg accessor


def make_unit_cube() -> tuple[np.ndarray, np.ndarray]:
    """Tetrahedralized unit cube on [0, 1]^3."""
    cube = pv.Cube().triangulate().subdivide(2)
    tetra = cube.delaunay_3d()
    vertices = np.asarray(tetra.points, dtype=np.float64)
    # delaunay_3d returns coords in [-0.5, 0.5]; shift so we work on [0, 1]^3.
    vertices = vertices + 0.5
    elements = tetra.cells_dict[pv.CellType.TETRA].astype(np.int32)
    return vertices, elements


def stretch_displacement(
    vertices: np.ndarray,
    *,
    stretch: float = 0.4,
) -> tuple[np.ndarray, np.ndarray]:
    """Pin z=0, push z=1 up by ``stretch`` and shear in x by 0.2.

    Returns a ``(displacement, boundary_mask)`` pair: only entries where
    ``boundary_mask`` is ``True`` are honored, the rest will be filled
    by the propagator.
    """
    z = vertices[:, 2]
    on_bottom = np.isclose(z, 0.0)
    on_top = np.isclose(z, 1.0)
    boundary = on_bottom | on_top

    disp = np.zeros_like(vertices)
    disp[on_top, 0] = 0.2
    disp[on_top, 2] = stretch
    return disp, boundary


def main() -> None:
    """Run both propagation methods on the same boundary problem and plot."""
    vertices, elements = make_unit_cube()
    displacement, boundary = stretch_displacement(vertices)

    original = pv.UnstructuredGrid({pv.CellType.TETRA: elements}, vertices)
    print(
        f"Initial mesh: {len(vertices)} vertices, {len(elements)} tetrahedra",
    )

    deformed_lap = original.mmg.move(
        displacement,
        boundary_mask=boundary,
        propagation_method="laplacian",
        hmax=0.25,
        verbose=False,
    )
    n_tets_lap = deformed_lap.cells_dict.get(
        pv.CellType.TETRA,
        np.empty((0, 4)),
    ).shape[0]
    print(
        f"Laplacian: {deformed_lap.n_points} vertices, {n_tets_lap} tetrahedra",
    )

    try:
        deformed_ela = original.mmg.move(
            displacement,
            boundary_mask=boundary,
            propagation_method="elasticity",
            hmax=0.25,
            verbose=False,
        )
    except ImportError as exc:
        print(f"Elasticity propagation unavailable ({exc}); skipping that panel.")
        deformed_ela = None
    else:
        n_tets_ela = deformed_ela.cells_dict.get(
            pv.CellType.TETRA,
            np.empty((0, 4)),
        ).shape[0]
        print(
            f"Elasticity: {deformed_ela.n_points} vertices, {n_tets_ela} tetrahedra",
        )

    pl = pv.Plotter(shape=(1, 3))
    pl.subplot(0, 0)
    pl.add_mesh(original, show_edges=True, opacity=0.6, color="lightgray")
    pl.add_title("Initial mesh", font_size=10)

    pl.subplot(0, 1)
    pl.add_mesh(deformed_lap, show_edges=True, opacity=0.6, color="lightblue")
    pl.add_title("Laplacian propagation", font_size=10)

    pl.subplot(0, 2)
    if deformed_ela is None:
        pl.add_text("fedoo not installed\n(run: uv add fedoo)", font_size=10)
    else:
        pl.add_mesh(deformed_ela, show_edges=True, opacity=0.6, color="lightcoral")
        pl.add_title("Elasticity propagation (fedoo)", font_size=10)

    pl.link_views()
    pl.show()


if __name__ == "__main__":
    main()
