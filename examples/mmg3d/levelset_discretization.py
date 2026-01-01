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
"""Level-set discretization example: Thick Gyroid TPMS.

This example demonstrates how to use level-set discretization to create
a thick gyroid TPMS (Triply Periodic Minimal Surface) from a cube mesh.

A gyroid is defined by: sin(kx)cos(ky) + sin(ky)cos(kz) + sin(kz)cos(kx) = 0

For a "thick" gyroid shell, we use |f(x,y,z)| - thickness/2 as the level-set:
- Large thickness (>=2.0): fills most of the cube (nearly solid)
- Small thickness (~1.0): reveals the gyroid lattice structure

Key insight: After level-set discretization, MMG creates:
- Element refs: 2 (exterior/void), 3 (interior/solid)

To visualize the solid gyroid, extract the surface of ref=3 tetrahedra.
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
    x = np.linspace(-0.5, 0.5, resolution)
    y = np.linspace(-0.5, 0.5, resolution)
    z = np.linspace(-0.5, 0.5, resolution)
    xx, yy, zz = np.meshgrid(x, y, z, indexing="ij")
    points = np.column_stack([xx.ravel(), yy.ravel(), zz.ravel()])

    cloud = pv.PolyData(points)
    tetra = cloud.delaunay_3d(progress_bar=True)
    vertices = np.array(tetra.points, dtype=np.float64)
    elements = tetra.cells_dict[pv.CellType.TETRA].astype(np.int32)
    return vertices, elements


def gyroid_levelset(
    vertices: np.ndarray,
    thickness: float = 0.5,
    periods: float = 2.0,
) -> np.ndarray:
    """Compute level-set for a thick gyroid TPMS.

    The gyroid surface is: sin(kx)cos(ky) + sin(ky)cos(kz) + sin(kz)cos(kx) = 0

    For a thick shell, we use |f| - thickness/2 as the level-set:
    - Negative inside the thick shell (solid material)
    - Positive outside (void)

    Args:
        vertices: Nx3 array of vertex coordinates
        thickness: Shell thickness (larger = more solid, smaller = reveals structure)
        periods: Number of gyroid periods across the domain

    Returns:
        Nx1 array as required by remesh_levelset.

    """
    # Scale factor for the number of periods in [-1, 1] domain
    k = 2.0 * np.pi * periods
    x, y, z = vertices[:, 0] * k, vertices[:, 1] * k, vertices[:, 2] * k

    # Gyroid function (ranges roughly from -1.5 to 1.5)
    f = np.sin(x) * np.cos(y) + np.sin(y) * np.cos(z) + np.sin(z) * np.cos(x)

    # Thick gyroid: |f| - thickness/2
    # Negative inside the shell, positive outside
    return (np.abs(f) - thickness / 2).reshape(-1, 1)


def extract_volume_surface(mesh: MmgMesh3D, element_ref: int = 3) -> pv.PolyData:
    """Extract the surface of a volume region (tetrahedra with given ref).

    After level-set discretization, MMG assigns:
    - Element ref 2: exterior (where level-set > 0, void)
    - Element ref 3: interior (where level-set < 0, solid material)

    This extracts the boundary surface of the solid material.
    """
    vertices = mesh.get_vertices()
    elements, elem_refs = mesh.get_elements_with_refs()

    # Get only tetrahedra with the target ref
    target_tets = elements[elem_refs == element_ref]

    if len(target_tets) == 0:
        msg = f"No elements with ref {element_ref}. Refs: {np.unique(elem_refs)}"
        raise ValueError(msg)

    # Create unstructured grid and extract surface
    grid = pv.UnstructuredGrid({pv.CellType.TETRA: target_tets}, vertices)
    return grid.extract_surface()


def create_thick_gyroid(
    vertices: np.ndarray,
    elements: np.ndarray,
    thickness: float,
    periods: float = 2.0,
    hmax: float = 0.12,
) -> pv.PolyData:
    """Create a thick gyroid TPMS mesh at the given thickness.

    Returns the surface of the solid gyroid volume as a PyVista PolyData.
    """
    mesh = MmgMesh3D(vertices.copy(), elements.copy())
    levelset = gyroid_levelset(vertices, thickness=thickness, periods=periods)
    mesh.remesh_levelset(levelset, ls=0.0, hmax=hmax, verbose=True)
    # Extract the solid material (interior, ref=3)
    return extract_volume_surface(mesh, element_ref=3)


def main() -> None:
    """Demonstrate thick gyroid TPMS via level-set discretization.

    Shows two gyroid structures side by side:
    - Left: Large thickness (nearly solid cube)
    - Right: Small thickness (reveals gyroid lattice)
    """
    # Thickness values to compare
    thick = 2.0  # Large thickness - nearly solid cube
    thin = 1.0  # Small thickness - reveals gyroid lattice structure
    periods = 2.0  # Number of gyroid periods

    print("Creating volumetric cube mesh with interior points...")
    vertices, elements = create_volumetric_cube_mesh(resolution=20)
    print(f"Base mesh: {len(vertices)} vertices, {len(elements)} tetrahedra")

    # Create thick gyroid (nearly solid)
    print(f"\nCreating thick gyroid (thickness={thick})...")
    thick_surface = create_thick_gyroid(vertices, elements, thick, periods)
    n_tri, n_pts = thick_surface.n_cells, thick_surface.n_points
    print(f"  Result: {n_tri} triangles, {n_pts} vertices")

    # Create thin gyroid (lattice visible)
    print(f"\nCreating thin gyroid (thickness={thin})...")
    thin_surface = create_thick_gyroid(vertices, elements, thin, periods)
    n_tri, n_pts = thin_surface.n_cells, thin_surface.n_points
    print(f"  Result: {n_tri} triangles, {n_pts} vertices")

    # Visualization
    pl = pv.Plotter(shape=(1, 2), window_size=(1400, 700), off_screen=True)

    pl.subplot(0, 0)
    pl.add_mesh(
        thick_surface,
        show_edges=True,
        color="steelblue",
        edge_color="darkblue",
        line_width=0.5,
    )
    pl.add_title(f"Thick Gyroid (t={thick})\nNearly solid cube")

    pl.subplot(0, 1)
    pl.add_mesh(
        thin_surface,
        show_edges=True,
        color="coral",
        edge_color="darkred",
        line_width=0.5,
    )
    pl.add_title(f"Thin Gyroid (t={thin})\nLattice structure revealed")

    pl.link_views()
    pl.camera_position = [(2.5, 2.5, 2.5), (0, 0, 0), (0, 0, 1)]

    # Save image
    output_path = Path(__file__).parent / "levelset_discretization.png"
    pl.screenshot(str(output_path))
    print(f"\nImage saved to: {output_path}")


if __name__ == "__main__":
    main()
