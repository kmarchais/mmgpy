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
"""Surface mesh from SDF: Comparing isosurface extraction methods.

This example compares different VTK isosurface extraction methods:
- flying_edges: Fastest, optimized for structured grids
- marching_cubes: Classic algorithm
- contour: General purpose (uses marching cubes internally for ImageData)

Each method is shown before and after MMGS remeshing, with timing information.

An ellipsoid is defined by: (x/a)² + (y/b)² + (z/c)² = 1
where a, b, c are the semi-axes.

For a volumetric mesh with tetrahedra, see examples/mmg3d/ellipsoid_levelset.py.
"""

import time
from dataclasses import dataclass
from pathlib import Path

import numpy as np
import pyvista as pv

from mmgpy import Mesh


@dataclass
class ExtractionResult:
    """Results from isosurface extraction and remeshing."""

    method: str
    surface: pv.PolyData
    remeshed: pv.PolyData
    extraction_time: float
    remesh_time: float


def create_ellipsoid_sdf_grid(
    center: tuple[float, float, float],
    semi_axes: tuple[float, float, float],
    resolution: int = 50,
    margin: float = 0.2,
) -> pv.ImageData:
    """Create a regular grid with ellipsoid SDF values."""
    cx, cy, cz = center
    a, b, c = semi_axes

    x = np.linspace(cx - a - margin, cx + a + margin, resolution)
    y = np.linspace(cy - b - margin, cy + b + margin, resolution)
    z = np.linspace(cz - c - margin, cz + c + margin, resolution)

    xx, yy, zz = np.meshgrid(x, y, z, indexing="ij")

    sdf = ((xx - cx) / a) ** 2 + ((yy - cy) / b) ** 2 + ((zz - cz) / c) ** 2 - 1.0

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


def extract_and_remesh(
    grid: pv.ImageData,
    method: str,
) -> ExtractionResult:
    """Extract isosurface and remesh with MMGS."""
    # Extract isosurface
    t0 = time.perf_counter()
    surface = grid.contour([0.0], scalars="sdf", method=method)
    extraction_time = time.perf_counter() - t0

    # Convert to mmgpy format
    faces = surface.faces.reshape(-1, 4)[:, 1:].astype(np.int32)
    mesh = Mesh(np.asarray(surface.points, dtype=np.float64), faces)

    # Remesh with optimized parameters for uniform sizing
    # - hmin/hmax: tight bounds for uniform element sizes
    # - hgrad=1.1: slow gradation (sizes change by max 10% between neighbors)
    # - hausd: geometric approximation tolerance
    t0 = time.perf_counter()
    mesh.remesh(
        hmin=0.03,
        hmax=0.06,
        hausd=0.002,
        hgrad=1.1,
        verbose=False,
        progress=False,
    )
    remesh_time = time.perf_counter() - t0

    # Get remeshed surface
    final_vertices = mesh.get_vertices()
    final_triangles, _ = mesh.get_triangles_with_refs()
    remeshed = pv.PolyData.from_regular_faces(final_vertices, final_triangles)

    return ExtractionResult(
        method=method,
        surface=surface,
        remeshed=remeshed,
        extraction_time=extraction_time,
        remesh_time=remesh_time,
    )


def main() -> None:
    """Compare isosurface extraction methods."""
    # Ellipsoid parameters
    center = (0.0, 0.0, 0.0)
    semi_axes = (1.0, 0.6, 0.4)

    # Create SDF grid
    print("Creating SDF grid...")
    grid = create_ellipsoid_sdf_grid(center, semi_axes, resolution=80)
    print(f"Grid: {grid.dimensions} = {grid.n_points} points\n")

    # Test all three methods
    methods = ["flying_edges", "marching_cubes", "contour"]
    results: list[ExtractionResult] = []

    for method in methods:
        print(f"Processing {method}...")
        result = extract_and_remesh(grid, method)
        results.append(result)

        print(f"  Extraction: {result.extraction_time * 1000:.1f} ms")
        print(f"  Remeshing:  {result.remesh_time * 1000:.1f} ms")
        print(f"  Triangles:  {result.surface.n_cells} -> {result.remeshed.n_cells}")
        print()

    # Visualization: 3 rows (methods) x 2 columns (before/after)
    pl = pv.Plotter(shape=(3, 2), window_size=(1200, 1400), off_screen=True)

    for row, result in enumerate(results):
        # Left: Original extraction
        pl.subplot(row, 0)
        pl.add_mesh(
            result.surface,
            show_edges=True,
            color="lightgray",
            edge_color="gray",
            line_width=0.5,
        )
        pl.add_title(
            f"{result.method}\n"
            f"{result.surface.n_cells} tri, {result.extraction_time * 1000:.1f} ms",
        )

        # Right: After MMGS remeshing
        pl.subplot(row, 1)
        pl.add_mesh(
            result.remeshed,
            show_edges=True,
            color="steelblue",
            edge_color="darkblue",
            line_width=0.5,
        )
        pl.add_title(
            f"After MMGS remesh\n"
            f"{result.remeshed.n_cells} tri, {result.remesh_time * 1000:.1f} ms",
        )

    pl.link_views()
    pl.camera_position = [(3, 2, 1.5), center, (0, 0, 1)]

    output_path = Path(__file__).parent / "ellipsoid_sdf.png"
    pl.screenshot(str(output_path))
    print(f"Image saved to: {output_path}")

    # Print summary table
    print("\n" + "=" * 70)
    print("Summary")
    print("=" * 70)
    header = (
        f"{'Method':<16} {'Extract':>10} {'Remesh':>10}"
        f" {'Tri Before':>12} {'Tri After':>12}"
    )
    print(header)
    print("-" * 70)
    for r in results:
        ext = f"{r.extraction_time * 1000:>8.1f}ms"
        rem = f"{r.remesh_time * 1000:>8.1f}ms"
        print(
            f"{r.method:<16} {ext} {rem} "
            f"{r.surface.n_cells:>12} {r.remeshed.n_cells:>12}",
        )


if __name__ == "__main__":
    main()
