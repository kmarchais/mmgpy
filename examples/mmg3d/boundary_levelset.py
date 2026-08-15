# /// script
# requires-python = ">=3.9"
# dependencies = [
#     "mmgpy",
#     "numpy",
#     "pyvista",
# ]
#
# [tool.uv.sources]
# mmgpy = { path = "../.." }
# ///
"""Compare full-domain and boundary-only level-set splitting.

MMG3D normally discretizes a level set throughout a volume and assigns
different references to tetrahedra on either side. Passing
``surface_only=True`` selects MMG's ``-lssurf`` mode instead: boundary faces
conform to the isovalue, but the interior volume is not split into materials.

Run with::

    uv run python examples/mmg3d/boundary_levelset.py
"""

from __future__ import annotations

import numpy as np
import pyvista as pv

import mmgpy  # noqa: F401  -- registers the .mmg accessor

ISOVALUE_X = 0.37


def background_mesh(resolution: int = 6) -> pv.UnstructuredGrid:
    """Create a tetrahedral background mesh of the unit cube."""
    coordinates = np.linspace(0.0, 1.0, resolution)
    points = np.stack(
        np.meshgrid(coordinates, coordinates, coordinates, indexing="ij"),
        axis=-1,
    ).reshape(-1, 3)
    return pv.PolyData(points).delaunay_3d()


def volume_refs(mesh: pv.UnstructuredGrid) -> np.ndarray:
    """Return MMG references for tetrahedral cells only."""
    tetrahedra = mesh.celltypes == pv.CellType.TETRA
    return np.asarray(mesh.cell_data["refs"])[tetrahedra]


def main() -> None:
    """Remesh a plane in both level-set modes and compare the results."""
    background = background_mesh()
    levelset = (background.points[:, 0] - ISOVALUE_X).reshape(-1, 1)

    full = background.mmg.remesh_levelset(
        levelset,
        hmax=0.2,
        verbose=False,
    )
    boundary = background.mmg.remesh_levelset(
        levelset,
        surface_only=True,
        hmax=0.2,
        verbose=False,
    )

    full_refs = volume_refs(full)
    boundary_refs = volume_refs(boundary)
    print(f"Full-domain volume refs: {np.unique(full_refs).tolist()}")
    print(f"Boundary-only volume refs: {np.unique(boundary_refs).tolist()}")

    if not {2, 3}.issubset(set(full_refs)):
        msg = "full-domain level-set remeshing did not create both material refs"
        raise RuntimeError(msg)
    if set(boundary_refs) != {0}:
        msg = "boundary-only level-set remeshing unexpectedly split the volume refs"
        raise RuntimeError(msg)

    plotter = pv.Plotter(shape=(1, 2), window_size=(1400, 700))

    plotter.subplot(0, 0)
    full_cell_refs = np.asarray(full.cell_data["refs"])
    full_surface = full.extract_surface(algorithm="dataset_surface")
    negative_region_surface = full.extract_cells(
        np.flatnonzero(full_cell_refs == 3),
    ).extract_surface(algorithm="dataset_surface")
    interface_centers = negative_region_surface.cell_centers().points
    interface = negative_region_surface.extract_cells(
        np.flatnonzero(np.isclose(interface_centers[:, 0], ISOVALUE_X)),
    )
    plotter.add_mesh(
        full_surface,
        color="lightgray",
        opacity=0.18,
        show_edges=True,
        edge_color="gray",
        line_width=0.3,
    )
    plotter.add_mesh(
        interface,
        color="coral",
        opacity=1.0,
        show_edges=True,
        edge_color="darkred",
        line_width=1.5,
    )
    plotter.add_title("Default\ninterface crosses the volume", font_size=10)
    plotter.add_text("tetrahedron refs: {2, 3}", position="lower_left", font_size=9)

    plotter.subplot(0, 1)
    surface = boundary.extract_surface(algorithm="dataset_surface")
    surface_edges = surface.extract_all_edges()
    edge_vertices = surface_edges.lines.reshape(-1, 3)[:, 1:]
    edge_x = surface_edges.points[edge_vertices, 0]
    boundary_trace = surface_edges.extract_cells(
        np.flatnonzero(np.all(np.isclose(edge_x, ISOVALUE_X), axis=1)),
    )
    plotter.add_mesh(
        surface,
        color="lightgray",
        opacity=0.45,
        show_edges=True,
        edge_color="gray",
        line_width=0.3,
    )
    plotter.add_mesh(
        boundary_trace,
        color="coral",
        line_width=8,
        render_lines_as_tubes=True,
    )
    plotter.add_title(
        "surface_only=True\nintersection stays on boundary",
        font_size=10,
    )
    plotter.add_text("tetrahedron refs: {0}", position="lower_left", font_size=9)

    plotter.link_views()
    plotter.camera_position = [(2.4, 2.0, 1.7), (0.5, 0.5, 0.5), (0, 0, 1)]
    plotter.show()


if __name__ == "__main__":
    main()
