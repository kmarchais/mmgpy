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

    full_cell_refs = np.asarray(full.cell_data["refs"])
    negative_region_surface = full.extract_cells(
        np.flatnonzero(full_cell_refs == 3),
    ).extract_surface(algorithm="dataset_surface")
    interface_centers = negative_region_surface.cell_centers().points
    interface = negative_region_surface.extract_cells(
        np.flatnonzero(np.isclose(interface_centers[:, 0], ISOVALUE_X)),
    )
    full_slice = full.slice(normal=(0, 1, 0), origin=(0.5, 0.5, 0.5))
    full_cross_section = full_slice.extract_cells(
        np.arange(full_slice.n_verts + full_slice.n_lines, full_slice.n_cells),
    )
    interface_line = interface.slice(
        normal=(0, 1, 0),
        origin=(0.5, 0.5, 0.5),
    )

    surface = boundary.extract_surface(algorithm="dataset_surface")
    surface_edges = surface.extract_all_edges()
    edge_vertices = surface_edges.lines.reshape(-1, 3)[:, 1:]
    edge_x = surface_edges.points[edge_vertices, 0]
    boundary_trace = surface_edges.extract_cells(
        np.flatnonzero(np.all(np.isclose(edge_x, ISOVALUE_X), axis=1)),
    )
    boundary_slice = boundary.slice(normal=(0, 1, 0), origin=(0.5, 0.5, 0.5))
    boundary_cross_section = boundary_slice.extract_cells(
        np.arange(
            boundary_slice.n_verts + boundary_slice.n_lines,
            boundary_slice.n_cells,
        ),
    )
    boundary_hits = boundary_trace.slice(
        normal=(0, 1, 0),
        origin=(0.5, 0.5, 0.5),
    )

    plotter = pv.Plotter(shape=(1, 2), window_size=(1400, 700))

    plotter.subplot(0, 0)
    plotter.add_mesh(
        full_cross_section,
        scalars="refs",
        categories=True,
        clim=(2, 3),
        cmap=["steelblue", "coral"],
        show_edges=True,
        edge_color="white",
        line_width=0.3,
        show_scalar_bar=False,
    )
    plotter.add_mesh(
        interface_line,
        color="black",
        line_width=7,
        render_lines_as_tubes=True,
    )
    plotter.add_point_labels(
        np.array([[0.18, 0.5, 0.5], [0.72, 0.5, 0.5]]),
        ["volume ref 3", "volume ref 2"],
        font_size=18,
        point_size=0,
        shape=None,
        show_points=False,
    )
    plotter.add_title("DEFAULT: VOLUME SPLIT", font_size=12)
    plotter.add_text(
        "black line = interface inside the volume",
        position="lower_left",
        font_size=10,
    )

    plotter.subplot(0, 1)
    plotter.add_mesh(
        boundary_cross_section,
        color="lightgray",
        show_edges=True,
        edge_color="white",
        line_width=0.3,
    )
    plotter.add_mesh(
        boundary_hits,
        color="coral",
        point_size=24,
        render_points_as_spheres=True,
    )
    plotter.add_point_labels(
        np.array([[0.5, 0.5, 0.5]]),
        ["one volume: ref 0\nNO interior interface"],
        font_size=18,
        point_size=0,
        shape=None,
        show_points=False,
    )
    plotter.add_title("surface_only=True: BOUNDARY ONLY", font_size=12)
    plotter.add_text(
        "orange points = boundary intersections",
        position="lower_left",
        font_size=10,
    )

    plotter.link_views()
    plotter.camera_position = [(0.5, -3.0, 0.5), (0.5, 0.5, 0.5), (0, 0, 1)]
    plotter.enable_parallel_projection()
    plotter.show()


if __name__ == "__main__":
    main()
