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
"""Volumetric mesh from SDF: Ellipsoid using Flying Edges + Level-set.

This example demonstrates how to generate a volumetric tetrahedral mesh
of an ellipsoid using a signed distance field (SDF):

1. Define SDF on a 3D grid (ImageData)
2. Extract isosurface using Flying Edges (fast VTK algorithm)
3. Tetrahedralize the interior with delaunay_3d
4. Refine with MMG3D level-set discretization for clean interior/exterior regions

An ellipsoid is defined by: (x/a)² + (y/b)² + (z/c)² = 1
where a, b, c are the semi-axes.

After level-set discretization, MMG creates:
- Element refs: 2 (exterior), 3 (interior/solid ellipsoid)

For a surface-only mesh, see examples/mmgs/ellipsoid_sdf.py.
"""

from pathlib import Path

import numpy as np
import pyvista as pv

from mmgpy import Mesh


def create_ellipsoid_sdf_grid(
    center: tuple[float, float, float],
    semi_axes: tuple[float, float, float],
    resolution: int = 50,
    margin: float = 0.2,
) -> pv.ImageData:
    """Create a regular grid with ellipsoid SDF values.

    Args:
        center: Center of the ellipsoid (cx, cy, cz)
        semi_axes: Semi-axes lengths (a, b, c)
        resolution: Number of points along each axis
        margin: Extra space around the ellipsoid

    Returns:
        PyVista ImageData with SDF values at each grid point.

    """
    cx, cy, cz = center
    a, b, c = semi_axes

    # Grid bounds
    x = np.linspace(cx - a - margin, cx + a + margin, resolution)
    y = np.linspace(cy - b - margin, cy + b + margin, resolution)
    z = np.linspace(cz - c - margin, cz + c + margin, resolution)

    xx, yy, zz = np.meshgrid(x, y, z, indexing="ij")

    # Ellipsoid SDF: negative inside, zero on surface, positive outside
    sdf = ((xx - cx) / a) ** 2 + ((yy - cy) / b) ** 2 + ((zz - cz) / c) ** 2 - 1.0

    # Create ImageData grid
    grid = pv.ImageData(
        dimensions=(resolution, resolution, resolution),
        spacing=(
            (2 * (a + margin)) / (resolution - 1),
            (2 * (b + margin)) / (resolution - 1),
            (2 * (c + margin)) / (resolution - 1),
        ),
        origin=(cx - a - margin, cy - b - margin, cz - c - margin),
    )
    grid["sdf"] = sdf.ravel(order="F")

    return grid


def ellipsoid_sdf(
    vertices: np.ndarray,
    center: tuple[float, float, float],
    semi_axes: tuple[float, float, float],
) -> np.ndarray:
    """Compute ellipsoid SDF at given vertices.

    Returns:
        Nx1 array as required by remesh_levelset.

    """
    cx, cy, cz = center
    a, b, c = semi_axes

    x = vertices[:, 0] - cx
    y = vertices[:, 1] - cy
    z = vertices[:, 2] - cz

    f = (x / a) ** 2 + (y / b) ** 2 + (z / c) ** 2 - 1.0
    return f.reshape(-1, 1)


def extract_volume_surface(mesh: Mesh, element_ref: int = 3) -> pv.PolyData:
    """Extract the surface of a volume region (tetrahedra with given ref).

    After level-set discretization, MMG assigns:
    - Element ref 2: exterior (where level-set > 0, void)
    - Element ref 3: interior (where level-set < 0, solid material)
    """
    vertices = mesh.get_vertices()
    elements, elem_refs = mesh.get_elements_with_refs()

    target_tets = elements[elem_refs == element_ref]

    if len(target_tets) == 0:
        msg = (
            f"No elements with ref {element_ref}. "
            f"Available refs: {np.unique(elem_refs)}"
        )
        raise ValueError(msg)

    grid = pv.UnstructuredGrid({pv.CellType.TETRA: target_tets}, vertices)
    return grid.extract_surface()


def main() -> None:
    """Generate a volumetric ellipsoid mesh from SDF."""
    # Ellipsoid parameters
    center = (0.0, 0.0, 0.0)
    semi_axes = (1.0, 0.6, 0.4)  # a=1.0, b=0.6, c=0.4
    a, b, c = semi_axes

    # Step 1: Create SDF on regular grid
    print("Creating SDF grid...")
    grid = create_ellipsoid_sdf_grid(center, semi_axes, resolution=50)
    print(f"Grid: {grid.dimensions} = {grid.n_points} points")

    # Step 2: Extract isosurface using Flying Edges
    print("\nExtracting isosurface with Flying Edges...")
    surface = grid.contour([0.0], scalars="sdf", method="flying_edges")
    print(f"Surface: {surface.n_cells} triangles, {surface.n_points} vertices")

    # Step 3: Tetrahedralize the interior
    print("\nTetrahedralizing interior with delaunay_3d...")
    volume = surface.delaunay_3d()
    vertices = np.asarray(volume.points, dtype=np.float64)
    tetrahedra = volume.cells_dict[pv.CellType.TETRA].astype(np.int32)
    print(f"Volume mesh: {len(vertices)} vertices, {len(tetrahedra)} tetrahedra")

    # Step 4: Compute SDF at mesh vertices
    levelset = ellipsoid_sdf(vertices, center, semi_axes)

    # Step 5: Level-set discretization with MMG3D
    print("\nRunning MMG3D level-set discretization...")
    mesh = Mesh(vertices, tetrahedra)
    result = mesh.remesh_levelset(
        levelset,
        ls=0.0,
        hmax=0.08,
        hausd=0.002,
        hgrad=1.3,
        verbose=False,
    )

    print("\nRemeshing result:")
    print(f"  Tetrahedra: {result.elements_before} -> {result.elements_after}")
    print(f"  Vertices: {result.vertices_before} -> {result.vertices_after}")
    qb = result.quality_mean_before
    qa = result.quality_mean_after
    print(f"  Quality: {qb:.3f} -> {qa:.3f}")

    # Extract ellipsoid surface (interior region, ref=3)
    ellipsoid_surface = extract_volume_surface(mesh, element_ref=3)
    print(
        f"\nEllipsoid surface: {ellipsoid_surface.n_cells} triangles, "
        f"{ellipsoid_surface.n_points} vertices",
    )

    # Visualization
    pl = pv.Plotter(shape=(1, 2), window_size=(1400, 700), off_screen=True)

    # Left: Surface mesh
    pl.subplot(0, 0)
    pl.add_mesh(
        ellipsoid_surface,
        show_edges=True,
        color="steelblue",
        edge_color="darkblue",
        line_width=0.5,
    )
    pl.add_title(f"Ellipsoid Surface\na={a}, b={b}, c={c}")

    # Right: Cut view showing interior tetrahedra
    pl.subplot(0, 1)
    all_vertices = mesh.get_vertices()
    all_elements, all_refs = mesh.get_elements_with_refs()
    interior_tets = all_elements[all_refs == 3]
    interior_grid = pv.UnstructuredGrid(
        {pv.CellType.TETRA: interior_tets},
        all_vertices,
    )
    # Select cells with centers where x < 0 (half of the ellipsoid)
    cell_centers = interior_grid.cell_centers().points
    half_mesh = interior_grid.extract_cells(cell_centers[:, 0] < center[0])
    pl.add_mesh(
        half_mesh,
        show_edges=True,
        color="coral",
        edge_color="darkred",
        line_width=0.5,
    )
    pl.add_title(f"Interior Tetrahedra (cut)\n{len(interior_tets)} tetrahedra")

    pl.link_views()
    pl.camera_position = [(3, 2, 1.5), center, (0, 0, 1)]

    output_path = Path(__file__).parent / "ellipsoid_levelset.png"
    pl.screenshot(str(output_path))
    print(f"\nImage saved to: {output_path}")


if __name__ == "__main__":
    main()
