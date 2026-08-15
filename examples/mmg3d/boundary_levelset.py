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

LEVELSET_CENTER = np.array([0.5, -0.15, 0.5])
LEVELSET_RADIUS = 0.45


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


def sphere_levelset(points: np.ndarray) -> np.ndarray:
    """Signed distance from a sphere that intersects the cube's front face."""
    return np.linalg.norm(points - LEVELSET_CENTER, axis=1) - LEVELSET_RADIUS


def boundary_patch_curve(surface: pv.PolyData) -> pv.PolyData:
    """Extract mesh edges separating the two level-set patches."""
    faces = surface.regular_faces
    centers = surface.points[faces].mean(axis=1)
    negative = sphere_levelset(centers) < 0.0
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
    background = background_mesh(resolution=7)
    levelset = sphere_levelset(background.points).reshape(-1, 1)

    full = background.mmg.remesh_levelset(
        levelset,
        hmax=0.15,
        verbose=False,
    )
    boundary = background.mmg.remesh_levelset(
        levelset,
        surface_only=True,
        hmax=0.15,
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
    negative_region = full.extract_cells(
        np.flatnonzero(full_cell_refs == 3),
    ).extract_surface(algorithm="dataset_surface")
    positive_region = full.extract_cells(
        np.flatnonzero(full_cell_refs == 2),
    ).extract_surface(algorithm="dataset_surface")
    negative_region.translate((-0.18, -0.2, 0.0), inplace=True)
    positive_region.translate((0.08, 0.08, 0.0), inplace=True)

    surface = boundary.extract_surface(algorithm="dataset_surface")
    boundary_trace = boundary_patch_curve(surface)

    plotter = pv.Plotter(shape=(1, 2), window_size=(1400, 700))

    plotter.subplot(0, 0)
    plotter.add_mesh(
        negative_region,
        color="coral",
        show_edges=False,
    )
    plotter.add_mesh(
        positive_region,
        color="steelblue",
        show_edges=False,
    )
    plotter.add_point_labels(
        np.array([[0.32, -0.21, 0.5], [0.8, 0.07, 0.75]]),
        ["ref 3\n(curved cap)", "ref 2\n(main volume)"],
        font_size=17,
        shape=None,
        show_points=False,
        always_visible=True,
    )
    plotter.add_title("DEFAULT: SPLITS THE VOLUME", font_size=10)
    plotter.add_text(
        "Tetrahedra become TWO material regions",
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
    plotter.add_point_labels(
        np.array([[0.65, -0.01, 0.5]]),
        ["ref 0\n(one volume)"],
        font_size=20,
        shape=None,
        show_points=False,
        always_visible=True,
    )
    plotter.add_title("surface_only=True: SPLITS ONLY THE SURFACE", font_size=10)
    plotter.add_text(
        "All tetrahedra stay ONE material; orange curve is on the skin",
        position=(20, 30),
        font_size=10,
    )

    plotter.link_views()
    plotter.camera_position = [(1.3, -3.0, 1.8), (0.5, 0.5, 0.5), (0, 0, 1)]
    plotter.enable_parallel_projection()
    plotter.camera.parallel_scale = 0.85
    plotter.show()


if __name__ == "__main__":
    main()
