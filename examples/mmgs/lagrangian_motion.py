# /// script
# requires-python = ">=3.9"
# dependencies = [
#     "mmgpy",
#     "numpy",
#     "pyvista",
#     "scipy",
#     "imageio",
# ]
#
# [tool.uv.sources]
# mmgpy = { path = "../.." }
# ///
"""Surface mesh Lagrangian motion remeshing example.

This example demonstrates how to use the `remesh_lagrangian` method on surface
meshes (MmgMeshS). Since MMGS does not natively support Lagrangian motion,
mmgpy provides a Python implementation using Laplacian smoothing for
displacement propagation combined with standard MMGS remeshing.

The example shows:
1. Creating a sphere surface mesh
2. Applying a "breathing" (radial expansion/contraction) displacement
3. Visualizing the deformation with an animated GIF

Use cases for surface mesh Lagrangian motion:
- Morphing between surface shapes
- Fluid-structure interaction simulations on surfaces
- Shape optimization with surface constraints
- Medical image registration with anatomical surfaces
"""

from pathlib import Path

import imageio.v3 as iio
import numpy as np
import pyvista as pv

from mmgpy import MmgMeshS


def create_sphere_mesh(radius: float = 1.0, n_subdivisions: int = 2) -> MmgMeshS:
    """Create a sphere surface mesh using PyVista.

    Args:
        radius: Sphere radius.
        n_subdivisions: Number of subdivisions for mesh refinement.

    Returns:
        MmgMeshS surface mesh object.

    """
    sphere = pv.Sphere(radius=radius, theta_resolution=16, phi_resolution=16)
    sphere = sphere.subdivide(n_subdivisions)
    sphere = sphere.triangulate()

    vertices = np.array(sphere.points, dtype=np.float64)
    triangles = sphere.cells_dict[pv.CellType.TRIANGLE].astype(np.int32)

    return MmgMeshS(vertices, triangles)


def create_radial_displacement(
    vertices: np.ndarray,
    scale: float,
    center: np.ndarray | None = None,
) -> np.ndarray:
    """Create radial displacement field (expansion/contraction from center).

    Args:
        vertices: Nx3 array of vertex positions.
        scale: Displacement magnitude (positive = expansion, negative = contraction).
        center: Center point for radial displacement. Defaults to origin.

    Returns:
        Nx3 array of displacement vectors.

    """
    if center is None:
        center = np.array([0.0, 0.0, 0.0])

    n_vertices = len(vertices)
    displacement = np.zeros((n_vertices, 3), dtype=np.float64)

    for i in range(n_vertices):
        r_vec = vertices[i] - center
        r = np.linalg.norm(r_vec)
        if r > 1e-10:
            direction = r_vec / r
            displacement[i] = direction * scale

    return displacement


def pyvista_mesh_from_mmgmeshs(mesh: MmgMeshS) -> pv.PolyData:
    """Convert MmgMeshS to PyVista PolyData for visualization."""
    vertices = mesh.get_vertices()
    triangles = mesh.get_triangles()
    faces = np.hstack([np.full((len(triangles), 1), 3), triangles]).ravel()
    return pv.PolyData(vertices, faces)


def generate_animation_frames(
    mesh: MmgMeshS,
    output_dir: Path,
    n_frames: int = 20,
    max_scale: float = 0.15,
) -> list[Path]:
    """Generate animation frames showing the breathing motion.

    Args:
        mesh: Initial MmgMeshS mesh.
        output_dir: Directory to save frame images.
        n_frames: Number of frames in the animation cycle.
        max_scale: Maximum radial displacement scale.

    Returns:
        List of paths to frame images.

    """
    output_dir.mkdir(parents=True, exist_ok=True)
    frame_paths = []

    original_vertices = mesh.get_vertices().copy()
    original_triangles = mesh.get_triangles().copy()

    # Generate frames for one complete breathing cycle
    for frame_idx in range(n_frames):
        # Sinusoidal breathing motion
        t = frame_idx / n_frames
        scale = max_scale * np.sin(2 * np.pi * t)

        # Reset mesh to original state
        mesh_copy = MmgMeshS(original_vertices, original_triangles)

        # Apply displacement
        displacement = create_radial_displacement(original_vertices, scale)

        # Use n_steps=2 for smoother deformation
        result = mesh_copy.remesh_lagrangian(
            displacement,
            n_steps=2,
            hausd=0.02,
            verbose=False,
        )

        # Create visualization
        pv_mesh = pyvista_mesh_from_mmgmeshs(mesh_copy)

        pl = pv.Plotter(off_screen=True, window_size=[800, 600])
        pl.add_mesh(
            pv_mesh,
            show_edges=True,
            edge_color="gray",
            color="lightblue",
            opacity=1.0,
        )
        pl.add_title(
            f"Surface Lagrangian Motion\n"
            f"Scale: {scale:.3f}, Vertices: {result['after']['vertices']}",
        )
        pl.camera_position = "iso"
        pl.camera.zoom(1.2)

        frame_path = output_dir / f"frame_{frame_idx:03d}.png"
        pl.screenshot(frame_path)
        pl.close()

        frame_paths.append(frame_path)
        print(
            f"  Frame {frame_idx + 1}/{n_frames} - Duration: {result['duration']:.3f}s",
        )

    return frame_paths


def create_gif(
    frame_paths: list[Path],
    output_path: Path,
    duration: float = 0.1,
) -> None:
    """Create animated GIF from frame images.

    Args:
        frame_paths: List of paths to frame images.
        output_path: Output GIF path.
        duration: Duration per frame in seconds.

    """
    images = [iio.imread(str(p)) for p in frame_paths]
    iio.imwrite(
        str(output_path),
        images,
        duration=int(duration * 1000),  # milliseconds
        loop=0,  # infinite loop
    )


def main() -> None:
    """Demonstrate surface mesh Lagrangian motion."""
    print("=" * 60)
    print("Surface Mesh Lagrangian Motion Example")
    print("=" * 60)

    # Create initial sphere mesh
    print("\n1. Creating sphere surface mesh...")
    mesh = create_sphere_mesh(radius=1.0, n_subdivisions=2)
    initial_vertices = mesh.get_vertices()
    initial_triangles = mesh.get_triangles()
    n_init_v, n_init_t = len(initial_vertices), len(initial_triangles)
    print(f"   Initial mesh: {n_init_v} vertices, {n_init_t} triangles")

    # Simple demonstration: single expansion
    print("\n2. Applying radial expansion...")
    displacement = create_radial_displacement(initial_vertices, scale=0.1)

    result = mesh.remesh_lagrangian(
        displacement,
        n_steps=2,
        hausd=0.02,
        verbose=False,
    )

    final_vertices = mesh.get_vertices()
    final_triangles = mesh.get_triangles()
    n_final_v, n_final_t = len(final_vertices), len(final_triangles)
    print(f"   Expanded mesh: {n_final_v} vertices, {n_final_t} triangles")
    print(f"   Duration: {result['duration']:.3f}s")
    print(
        f"   Quality - Before: min={result['before']['quality_min']:.3f}, "
        f"mean={result['before']['quality_mean']:.3f}",
    )
    print(
        f"   Quality - After:  min={result['after']['quality_min']:.3f}, "
        f"mean={result['after']['quality_mean']:.3f}",
    )

    # Visualization
    print("\n3. Creating visualization...")

    # Create PyVista meshes
    original_pv = pv.PolyData(
        initial_vertices,
        np.hstack([np.full((len(initial_triangles), 1), 3), initial_triangles]).ravel(),
    )
    expanded_pv = pyvista_mesh_from_mmgmeshs(mesh)

    # Side-by-side comparison
    pl = pv.Plotter(shape=(1, 2), window_size=[1200, 600])

    pl.subplot(0, 0)
    pl.add_mesh(original_pv, show_edges=True, color="lightblue")
    pl.add_title(f"Original Sphere\n{len(initial_vertices)} vertices")
    pl.camera_position = "iso"

    pl.subplot(0, 1)
    pl.add_mesh(expanded_pv, show_edges=True, color="lightgreen")
    pl.add_title(f"Expanded (10%)\n{len(final_vertices)} vertices")
    pl.camera_position = "iso"

    pl.link_views()

    # Generate animation
    print("\n4. Generating animation frames...")
    output_dir = Path(__file__).parent / "output"
    mesh_fresh = create_sphere_mesh(radius=1.0, n_subdivisions=2)
    frame_paths = generate_animation_frames(
        mesh_fresh,
        output_dir,
        n_frames=20,
        max_scale=0.15,
    )

    print("\n5. Creating animated GIF...")
    gif_path = output_dir / "surface_lagrangian_motion.gif"
    create_gif(frame_paths, gif_path, duration=0.1)
    print(f"   GIF saved to: {gif_path}")

    # Clean up frame files
    for p in frame_paths:
        p.unlink()
    print("   Frame files cleaned up.")

    print("\n" + "=" * 60)
    print("Example completed!")
    print("=" * 60)

    pl.show()


if __name__ == "__main__":
    main()
