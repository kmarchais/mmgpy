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

The gyroid-like level set used here makes the distinction visible: standard
level-set remeshing creates a winding interface throughout the cube, whereas
boundary-only mode keeps only its contour network on the cube's outer faces.

Run with::

    uv run python examples/mmg3d/boundary_levelset.py
"""

from __future__ import annotations

import numpy as np
import pyvista as pv

import mmgpy  # noqa: F401  -- registers the .mmg accessor


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


def gyroid_levelset(points: np.ndarray) -> np.ndarray:
    """Evaluate a winding gyroid-like level set over the unit cube."""
    x, y, z = (2.0 * np.pi * points).T
    return np.sin(x) * np.cos(y) + np.sin(y) * np.cos(z) + np.sin(z) * np.cos(x) - 0.15


def boundary_patch_curve(surface: pv.PolyData) -> pv.PolyData:
    """Extract mesh edges separating the two level-set patches."""
    faces = surface.regular_faces
    centers = surface.points[faces].mean(axis=1)
    negative = gyroid_levelset(centers) < 0.0
    edge_sides: dict[tuple[int, int], bool] = {}
    curve_edges: list[tuple[int, int]] = []

    for triangle, side in zip(faces, negative, strict=True):
        for start, end in (
            (triangle[0], triangle[1]),
            (triangle[1], triangle[2]),
            (triangle[2], triangle[0]),
        ):
            edge = tuple(sorted((int(start), int(end))))
            previous_side = edge_sides.get(edge)
            if previous_side is not None and previous_side != side:
                curve_edges.append(edge)
            else:
                edge_sides[edge] = bool(side)

    lines = np.column_stack(
        (np.full(len(curve_edges), 2), np.asarray(curve_edges)),
    ).ravel()
    return pv.PolyData(surface.points, lines=lines)


def main() -> None:
    """Remesh a curved level set in both modes and compare the results."""
    background = background_mesh(resolution=10)
    levelset = gyroid_levelset(background.points).reshape(-1, 1)

    full = background.mmg.remesh_levelset(
        levelset,
        hmax=0.1,
        verbose=False,
    )
    boundary = background.mmg.remesh_levelset(
        levelset,
        surface_only=True,
        hmax=0.1,
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
    on_cube_boundary = np.any(
        np.isclose(interface_centers, 0.0) | np.isclose(interface_centers, 1.0),
        axis=1,
    )
    internal_interface = negative_region_surface.extract_cells(
        np.flatnonzero(~on_cube_boundary),
    )
    full_surface = full.extract_surface(algorithm="dataset_surface")

    surface = boundary.extract_surface(algorithm="dataset_surface")
    boundary_trace = boundary_patch_curve(surface)

    plotter = pv.Plotter(shape=(1, 2), window_size=(1400, 700))

    plotter.subplot(0, 0)
    plotter.add_mesh(
        full_surface,
        color="lightgray",
        opacity=0.12,
        show_edges=False,
    )
    plotter.add_mesh(
        internal_interface,
        color="coral",
        opacity=0.95,
        show_edges=False,
    )
    plotter.add_title("DEFAULT: INTERNAL LEVEL-SET SHEET", font_size=10)
    plotter.add_text(
        "Volume tetrahedra split into refs 2 and 3",
        position=(20, 30),
        font_size=10,
    )

    plotter.subplot(0, 1)
    plotter.add_mesh(
        surface,
        color="lightgray",
        show_edges=False,
    )
    plotter.add_mesh(
        boundary_trace,
        color="coral",
        line_width=10,
        render_lines_as_tubes=True,
    )
    plotter.add_title("surface_only=True: BOUNDARY CONTOURS ONLY", font_size=10)
    plotter.add_text(
        "Same level set; every tetrahedron remains ref 0",
        position=(20, 30),
        font_size=10,
    )

    plotter.link_views()
    plotter.camera_position = [(2.4, -3.0, 2.0), (0.5, 0.5, 0.5), (0, 0, 1)]
    plotter.show()


if __name__ == "__main__":
    main()
