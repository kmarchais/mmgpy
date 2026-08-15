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

    boundary_triangle_mask = boundary.celltypes == pv.CellType.TRIANGLE
    boundary_triangle_refs = np.asarray(boundary.cell_data["refs"])[
        boundary_triangle_mask
    ]
    if not {2, 3}.issubset(set(boundary_triangle_refs)):
        msg = "boundary-only remeshing did not create both surface patch refs"
        raise RuntimeError(msg)

    full_tetrahedra = full.extract_cells(full.celltypes == pv.CellType.TETRA)
    cutaway = full_tetrahedra.clip(
        normal=(0.0, 1.0, 0.0),
        origin=(0.5, 0.5, 0.5),
        invert=False,
    )

    boundary_tetrahedra = boundary.extract_cells(
        boundary.celltypes == pv.CellType.TETRA
    )
    boundary_cutaway = boundary_tetrahedra.clip(
        normal=(0.0, 1.0, 0.0),
        origin=(0.5, 0.5, 0.5),
        invert=False,
    )

    boundary_patches = boundary.extract_cells(boundary_triangle_mask)
    boundary_patch_cutaway = boundary_patches.clip(
        normal=(0.0, 1.0, 0.0),
        origin=(0.5, 0.5, 0.5),
        invert=False,
    )

    plotter = pv.Plotter(shape=(1, 2), window_size=(1500, 700))
    plotter.set_background("#eeeeee")

    plotter.subplot(0, 0)
    plotter.add_mesh(
        cutaway,
        scalars="refs",
        categories=True,
        clim=(2, 3),
        cmap=["steelblue", "coral"],
        opacity=1.0,
        show_edges=True,
        edge_color="#dddddd",
        line_width=0.2,
        show_scalar_bar=False,
    )
    plotter.add_title("DEFAULT: INTERIOR CUT HAS TWO REFS", font_size=10)
    plotter.add_text(
        "Cut face: blue volume ref 2 + orange volume ref 3",
        position=(20, 30),
        font_size=10,
    )

    plotter.subplot(0, 1)
    plotter.add_mesh(
        boundary_cutaway,
        color="white",
        opacity=1.0,
        show_edges=True,
        edge_color="gray",
        line_width=0.2,
    )
    plotter.add_mesh(
        boundary_patch_cutaway,
        scalars="refs",
        categories=True,
        clim=(2, 3),
        cmap=["steelblue", "coral"],
        opacity=1.0,
        show_edges=False,
        show_scalar_bar=False,
    )
    plotter.add_title("surface_only=True: INTERIOR CUT STAYS REF 0", font_size=10)
    plotter.add_text(
        "Neutral cut face = one volume; colors exist only on outer walls",
        position=(20, 30),
        font_size=10,
    )

    plotter.link_views()
    plotter.camera_position = [(2.4, -3.0, 2.0), (0.5, 0.5, 0.5), (0, 0, 1)]
    plotter.show()


if __name__ == "__main__":
    main()
