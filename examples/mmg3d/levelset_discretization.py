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
"""Level-set discretization example.

This example demonstrates how to use the level-set discretization feature
to extract an implicit surface (isosurface) from a 3D mesh.

A sphere defined by a signed distance function is extracted from a cube mesh,
creating a high-quality mesh that exactly conforms to the zero isovalue.
"""

from pathlib import Path

import numpy as np
import pyvista as pv

from mmgpy import MmgMesh3D


def create_cube_mesh(resolution: int = 3) -> tuple[np.ndarray, np.ndarray]:
    """Create a tetrahedral mesh of a unit cube using PyVista."""
    cube = pv.Cube(x_length=2, y_length=2, z_length=2).triangulate()
    cube = cube.subdivide(resolution)
    tetra = cube.delaunay_3d()
    vertices = np.array(tetra.points, dtype=np.float64)
    elements = tetra.cells_dict[pv.CellType.TETRA].astype(np.int32)
    return vertices, elements


def sphere_levelset(
    vertices: np.ndarray,
    center: tuple[float, float, float] = (0, 0, 0),
    radius: float = 0.7,
) -> np.ndarray:
    """Compute signed distance function for a sphere.

    Negative inside, positive outside.
    Returns Nx1 array as required by remesh_levelset.
    """
    distances = np.linalg.norm(vertices - np.array(center), axis=1)
    return (distances - radius).reshape(-1, 1)


def main() -> None:
    """Demonstrate level-set discretization on a 3D mesh."""
    print("Creating initial cube mesh...")
    vertices, elements = create_cube_mesh(resolution=3)
    print(f"Initial mesh: {len(vertices)} vertices, {len(elements)} tetrahedra")

    # Create mesh object
    mesh = MmgMesh3D(vertices, elements)

    # Compute sphere level-set function (signed distance)
    levelset = sphere_levelset(vertices, center=(0, 0, 0), radius=0.7)
    print(f"Level-set range: [{levelset.min():.3f}, {levelset.max():.3f}]")

    # Apply level-set discretization to extract the sphere
    print("Applying level-set discretization...")
    mesh.remesh_levelset(levelset, ls=0.0, hmax=0.15, verbose=False)

    # Get the result
    output_vertices = mesh.get_vertices()
    output_elements = mesh.get_elements()
    print(
        f"Output mesh: {len(output_vertices)} vertices, "
        f"{len(output_elements)} tetrahedra",
    )

    # Visualization
    original = pv.UnstructuredGrid(
        {pv.CellType.TETRA: elements},
        vertices,
    )
    result = pv.UnstructuredGrid(
        {pv.CellType.TETRA: output_elements},
        output_vertices,
    )

    pl = pv.Plotter(shape=(1, 2), window_size=(1200, 600))

    pl.subplot(0, 0)
    pl.add_mesh(
        original.extract_surface(),
        show_edges=True,
        opacity=0.5,
        color="lightblue",
    )
    pl.add_title("Original Cube Mesh")

    pl.subplot(0, 1)
    pl.add_mesh(
        result.extract_surface(),
        show_edges=True,
        color="lightcoral",
    )
    pl.add_title("After Level-Set Discretization\n(Sphere extracted)")

    pl.link_views()
    pl.show()


def create_animation_gif() -> None:
    """Create an animation showing level-set extraction at different isovalues."""
    output_path = Path(__file__).parent / "levelset_animation.gif"

    print("Creating animation of level-set discretization...")

    # Create initial mesh
    vertices, elements = create_cube_mesh(resolution=3)

    # Setup plotter for animation
    pl = pv.Plotter(off_screen=True, window_size=(800, 600))
    pl.set_background("white")

    # Isovalues to animate (from large radius to small)
    isovalues = np.linspace(-0.3, 0.3, 30)

    pl.open_gif(str(output_path), fps=10)

    for i, isovalue in enumerate(isovalues):
        print(f"  Frame {i + 1}/{len(isovalues)}: isovalue = {isovalue:.3f}")

        # Create fresh mesh for each frame
        mesh = MmgMesh3D(vertices.copy(), elements.copy())

        # Compute level-set (sphere with radius 0.5)
        levelset = sphere_levelset(vertices, center=(0, 0, 0), radius=0.5)

        # Apply level-set discretization with current isovalue
        mesh.remesh_levelset(levelset, ls=isovalue, hmax=0.12, verbose=False)

        # Create visualization
        output_vertices = mesh.get_vertices()
        output_elements = mesh.get_elements()

        result = pv.UnstructuredGrid(
            {pv.CellType.TETRA: output_elements},
            output_vertices,
        )

        pl.clear()
        pl.add_mesh(
            result.extract_surface(),
            show_edges=True,
            color="lightcoral",
            edge_color="darkred",
            line_width=0.5,
        )

        # Effective radius shown
        effective_radius = 0.5 + isovalue
        pl.add_title(
            f"Level-Set Discretization\nIsovalue: {isovalue:+.2f} "
            f"(Radius: {effective_radius:.2f})",
            font_size=12,
        )

        pl.camera_position = "iso"
        pl.camera.azimuth = 30
        pl.camera.elevation = 20
        pl.write_frame()

    pl.close()
    print(f"Animation saved to: {output_path}")


if __name__ == "__main__":
    import sys

    if "--gif" in sys.argv:
        create_animation_gif()
    else:
        main()
