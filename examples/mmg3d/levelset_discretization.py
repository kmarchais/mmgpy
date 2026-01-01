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

Key insight: The level-set discretization splits the mesh into two domains:
- Interior (ref 3): elements where level-set < 0 (inside the sphere)
- Exterior (ref 2): elements where level-set > 0 (outside the sphere)

To visualize the sphere, we extract the interior domain and show its surface.
"""

from pathlib import Path

import numpy as np
import pyvista as pv

from mmgpy import MmgMesh3D


def create_volumetric_cube_mesh(resolution: int = 10) -> tuple[np.ndarray, np.ndarray]:
    """Create a tetrahedral mesh of a unit cube WITH interior points.

    Unlike a surface mesh, this creates a grid of points throughout the volume,
    which is essential for level-set discretization to work properly.
    """
    x = np.linspace(-1, 1, resolution)
    y = np.linspace(-1, 1, resolution)
    z = np.linspace(-1, 1, resolution)
    xx, yy, zz = np.meshgrid(x, y, z, indexing="ij")
    points = np.column_stack([xx.ravel(), yy.ravel(), zz.ravel()])

    cloud = pv.PolyData(points)
    tetra = cloud.delaunay_3d()
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


def extract_interior_surface(
    mesh: MmgMesh3D,
    interior_ref: int = 3,
) -> pv.PolyData:
    """Extract the surface of the interior domain (where level-set < 0).

    After level-set discretization, MMG assigns:
    - ref 2: exterior elements (level-set > 0)
    - ref 3: interior elements (level-set < 0)

    The surface of the interior domain is the isosurface.
    """
    vertices = mesh.get_vertices()
    elements, refs = mesh.get_elements_with_refs()

    # Get only interior elements
    interior_elements = elements[refs == interior_ref]

    if len(interior_elements) == 0:
        msg = f"No elements with ref {interior_ref}. Refs: {np.unique(refs)}"
        raise ValueError(msg)

    # Create mesh and extract surface
    interior_mesh = pv.UnstructuredGrid(
        {pv.CellType.TETRA: interior_elements},
        vertices,
    )
    return interior_mesh.extract_surface()


def verify_sphere(
    surface: pv.PolyData,
    expected_radius: float,
    tolerance: float = 0.05,
) -> bool:
    """Verify that the surface is approximately a sphere of the expected radius."""
    points = np.array(surface.points)
    distances = np.linalg.norm(points, axis=1)

    mean_dist = distances.mean()
    std_dist = distances.std()

    is_sphere = std_dist < tolerance and abs(mean_dist - expected_radius) < tolerance

    print(f"Verification: mean radius = {mean_dist:.4f}, std = {std_dist:.4f}")
    if is_sphere:
        print(f"  SUCCESS: Surface is a sphere of radius ~{expected_radius}")
    else:
        print(f"  WARNING: Surface deviates from expected (r={expected_radius})")

    return is_sphere


def main() -> None:
    """Demonstrate level-set discretization on a 3D mesh."""
    radius = 0.7

    print("Creating volumetric cube mesh with interior points...")
    vertices, elements = create_volumetric_cube_mesh(resolution=10)
    print(f"Initial mesh: {len(vertices)} vertices, {len(elements)} tetrahedra")

    # Check we have interior points
    levelset = sphere_levelset(vertices, center=(0, 0, 0), radius=radius)
    n_inside = (levelset < 0).sum()
    n_outside = (levelset >= 0).sum()
    print(f"Level-set: {n_inside} vertices inside sphere, {n_outside} outside")

    if n_inside == 0:
        print("ERROR: No vertices inside the sphere! Need a denser mesh.")
        return

    # Create mesh object and apply level-set discretization
    mesh = MmgMesh3D(vertices, elements)
    print("\nApplying level-set discretization...")
    mesh.remesh_levelset(levelset, ls=0.0, hmax=0.1, verbose=False)

    # Get results and verify
    output_vertices = mesh.get_vertices()
    output_elements, elem_refs = mesh.get_elements_with_refs()
    n_verts, n_tets = len(output_vertices), len(output_elements)
    print(f"Output mesh: {n_verts} vertices, {n_tets} tetrahedra")
    ref_counts = dict(zip(*np.unique(elem_refs, return_counts=True), strict=False))
    print(f"Element refs: {ref_counts}")

    # Extract the sphere surface (interior domain boundary)
    print("\nExtracting sphere surface from interior domain...")
    sphere_surface = extract_interior_surface(mesh, interior_ref=3)
    n_tri, n_pts = sphere_surface.n_cells, sphere_surface.n_points
    print(f"Sphere surface: {n_tri} triangles, {n_pts} vertices")

    # Verify it's actually a sphere
    verify_sphere(sphere_surface, radius)

    # Visualization
    original = pv.UnstructuredGrid({pv.CellType.TETRA: elements}, vertices)

    pl = pv.Plotter(shape=(1, 2), window_size=(1200, 600))

    pl.subplot(0, 0)
    pl.add_mesh(
        original.extract_surface(),
        show_edges=True,
        opacity=0.3,
        color="lightblue",
    )
    pl.add_title("Original Cube Mesh")

    pl.subplot(0, 1)
    pl.add_mesh(
        sphere_surface,
        show_edges=True,
        color="coral",
    )
    pl.add_title(f"Extracted Sphere (r={radius})\nvia Level-Set Discretization")

    pl.link_views()
    pl.show()


def create_animation_gif() -> None:
    """Create animation showing sphere extraction at different isovalues."""
    output_path = Path(__file__).parent / "levelset_animation.gif"

    print("Creating animation of level-set discretization...")

    # Create initial mesh - use coarser mesh for speed
    vertices, elements = create_volumetric_cube_mesh(resolution=8)
    print(f"Base mesh: {len(vertices)} vertices, {len(elements)} tetrahedra")

    # Base sphere radius
    base_radius = 0.5

    # Fewer frames for faster generation
    isovalues = np.concatenate(
        [
            np.linspace(-0.25, 0.25, 10),  # Grow
            np.linspace(0.25, -0.25, 10),  # Shrink
        ],
    )

    # Setup plotter
    pl = pv.Plotter(off_screen=True, window_size=(500, 500))
    pl.set_background("white")
    pl.open_gif(str(output_path), fps=8)

    for i, isovalue in enumerate(isovalues):
        effective_radius = base_radius - isovalue
        print(f"  Frame {i + 1}/{len(isovalues)}: radius = {effective_radius:.2f}")

        if effective_radius <= 0.15 or effective_radius >= 0.9:
            continue

        mesh = MmgMesh3D(vertices.copy(), elements.copy())
        levelset = sphere_levelset(vertices, center=(0, 0, 0), radius=base_radius)

        n_inside = (levelset < isovalue).sum()
        if n_inside == 0 or n_inside == len(levelset):
            continue

        mesh.remesh_levelset(levelset, ls=isovalue, hmax=0.12, verbose=False)

        try:
            sphere_surface = extract_interior_surface(mesh, interior_ref=3)
        except ValueError:
            continue

        pl.clear()
        pl.add_mesh(
            sphere_surface,
            show_edges=True,
            color="coral",
            edge_color="darkred",
            line_width=0.5,
        )
        pl.add_title(
            f"Level-Set Sphere Extraction\nRadius: {effective_radius:.2f}",
            font_size=12,
        )
        pl.camera_position = "iso"
        pl.camera.azimuth = 30
        pl.camera.elevation = 20
        pl.camera.zoom(1.3)
        pl.write_frame()

    pl.close()
    print(f"\nAnimation saved to: {output_path}")


if __name__ == "__main__":
    import sys

    if "--gif" in sys.argv:
        create_animation_gif()
    else:
        main()
