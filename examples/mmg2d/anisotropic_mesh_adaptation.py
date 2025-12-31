# /// script
# requires-python = ">=3.9"
# dependencies = [
#     "mmgpy",
#     "matplotlib",
#     "numpy",
# ]
#
# [tool.uv.sources]
# mmgpy = { path = "../.." }
# ///

"""Anisotropic Mesh Adaptation with Tensor Metrics.

This example demonstrates the power of tensor metrics for controlling mesh
element size AND shape during adaptation. Unlike scalar metrics that only
control element size, tensor metrics enable:

- Stretched elements aligned with flow direction (CFD boundary layers)
- Anisotropic refinement along geometric features
- Solution-adaptive meshes that capture directional gradients efficiently

The key insight: a metric tensor M defines an ellipsoid at each vertex.
Elements are sized to be "unit" with respect to this ellipsoid, creating
stretched elements when the ellipsoid is elongated.
"""

from __future__ import annotations

import tempfile
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
from matplotlib.patches import Ellipse
from matplotlib.tri import Triangulation

from mmgpy import MmgMesh2D, metrics, mmg2d


def create_unit_square_mesh(n: int = 8) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    """Create a simple triangulated unit square with boundary edges.

    Returns (vertices, triangles, edges) for a regular grid triangulation.
    """
    # Create grid of points
    x = np.linspace(0, 1, n)
    y = np.linspace(0, 1, n)
    xx, yy = np.meshgrid(x, y)
    vertices = np.column_stack([xx.ravel(), yy.ravel()]).astype(np.float64)

    # Create triangles (two per grid cell)
    triangles = []
    for i in range(n - 1):
        for j in range(n - 1):
            bl = i * n + j  # bottom-left
            br = bl + 1  # bottom-right
            tl = bl + n  # top-left
            tr = tl + 1  # top-right
            triangles.append([bl, br, tr])
            triangles.append([bl, tr, tl])

    # Create boundary edges (required for MMG to preserve domain boundary)
    edges = []
    # Bottom edge
    for j in range(n - 1):
        edges.append([j, j + 1])
    # Right edge
    for i in range(n - 1):
        edges.append([i * n + (n - 1), (i + 1) * n + (n - 1)])
    # Top edge
    for j in range(n - 1, 0, -1):
        edges.append([(n - 1) * n + j, (n - 1) * n + j - 1])
    # Left edge
    for i in range(n - 1, 0, -1):
        edges.append([i * n, (i - 1) * n])

    return (
        vertices,
        np.array(triangles, dtype=np.int32),
        np.array(edges, dtype=np.int32),
    )


def remesh_with_metric(
    vertices: np.ndarray,
    triangles: np.ndarray,
    edges: np.ndarray,
    metric_tensor: np.ndarray,
) -> tuple[np.ndarray, np.ndarray]:
    """Remesh a 2D domain with given anisotropic metric tensor field."""
    with tempfile.TemporaryDirectory() as tmpdir:
        input_path = Path(tmpdir) / "input.mesh"
        output_path = Path(tmpdir) / "output.mesh"
        sol_path = Path(tmpdir) / "input.sol"

        # Create mesh with boundary edges
        mesh = MmgMesh2D()
        mesh.set_mesh_size(
            vertices=len(vertices),
            triangles=len(triangles),
            edges=len(edges),
        )
        mesh.set_vertices(vertices)
        mesh.set_triangles(triangles)
        # Mark boundary edges with ref=1 to preserve them
        mesh.set_edges(edges, refs=np.ones(len(edges), dtype=np.int64))
        mesh.save(str(input_path))

        # Write metric solution file
        write_sol_file(sol_path, metric_tensor, dim=2)

        # Remesh with the metric
        mmg2d.remesh(
            input_mesh=str(input_path),
            input_sol=str(sol_path),
            output_mesh=str(output_path),
            options={
                "verbose": -1,
                "hgrad": 2.0,  # Allow gradation for smooth transitions
            },
        )

        # Load result
        result = MmgMesh2D(str(output_path))
        return result.get_vertices(), result.get_triangles()


def write_sol_file(path: Path, metric: np.ndarray, dim: int = 2) -> None:
    """Write a metric tensor field to MMG .sol file format."""
    n_vertices = len(metric)
    n_components = metric.shape[1] if metric.ndim > 1 else 1

    # Determine solution type: 1=scalar, 2=vector, 3=tensor
    if n_components == 1:
        sol_type = 1
    elif n_components == dim:
        sol_type = 2
    else:
        sol_type = 3  # Tensor

    with open(path, "w") as f:
        f.write("MeshVersionFormatted 2\n\n")
        f.write(f"Dimension {dim}\n\n")
        f.write("SolAtVertices\n")
        f.write(f"{n_vertices}\n")
        f.write(f"1 {sol_type}\n\n")

        for i in range(n_vertices):
            if metric.ndim == 1:
                f.write(f"{metric[i]}\n")
            else:
                f.write(" ".join(f"{v}" for v in metric[i]) + "\n")

        f.write("\nEnd\n")


def plot_mesh(
    ax: plt.Axes,
    vertices: np.ndarray,
    triangles: np.ndarray,
    title: str,
    *,
    show_metric_ellipses: bool = False,
    metric: np.ndarray | None = None,
) -> None:
    """Plot a 2D triangular mesh with optional metric ellipses."""
    tri = Triangulation(vertices[:, 0], vertices[:, 1], triangles)
    ax.triplot(tri, "b-", linewidth=0.3, alpha=0.7)
    ax.set_aspect("equal")
    ax.set_title(title, fontsize=11, fontweight="bold")
    ax.set_xlim(-0.05, 1.05)
    ax.set_ylim(-0.05, 1.05)
    ax.set_xticks([0, 0.5, 1])
    ax.set_yticks([0, 0.5, 1])

    # Optionally show metric ellipses at a few sample points
    if show_metric_ellipses and metric is not None:
        # Sample a few vertices to show ellipses
        n_samples = min(25, len(vertices))
        indices = np.linspace(0, len(vertices) - 1, n_samples, dtype=int)

        for idx in indices:
            if idx >= len(metric):
                continue
            # Convert tensor to matrix and compute ellipse parameters
            m = metrics.tensor_to_matrix(metric[idx], dim=2)
            eigvals, eigvecs = np.linalg.eigh(m)

            # Ellipse semi-axes are 1/sqrt(eigenvalue) (the element sizes)
            sizes = 1.0 / np.sqrt(eigvals) * 0.3  # Scale for visibility

            # Rotation angle from first eigenvector
            angle = np.degrees(np.arctan2(eigvecs[1, 0], eigvecs[0, 0]))

            ellipse = Ellipse(
                xy=vertices[idx],
                width=2 * sizes[0],
                height=2 * sizes[1],
                angle=angle,
                fill=False,
                edgecolor="red",
                linewidth=1,
                alpha=0.6,
            )
            ax.add_patch(ellipse)


def main() -> None:
    """Run the anisotropic mesh adaptation demonstration."""
    print("=" * 70)
    print("  Anisotropic Mesh Adaptation with Tensor Metrics")
    print("=" * 70)
    print()

    # Create initial mesh
    print("Creating initial mesh...")
    vertices, triangles, edges = create_unit_square_mesh(n=6)
    n_vertices = len(vertices)
    print(f"  Initial mesh: {n_vertices} vertices, {len(triangles)} triangles")
    print()

    # ==========================================================================
    # Example 1: Uniform Isotropic Refinement (baseline)
    # ==========================================================================
    print("1. Uniform Isotropic Refinement")
    print("   - All elements same size (h=0.05)")
    print("   - Metric tensor: M = (1/h²) * I")

    h_uniform = 0.05
    metric_iso = metrics.create_isotropic_metric(h_uniform, n_vertices, dim=2)
    verts_iso, tris_iso = remesh_with_metric(vertices, triangles, edges, metric_iso)
    print(f"   Result: {len(verts_iso)} vertices, {len(tris_iso)} triangles")
    print()

    # ==========================================================================
    # Example 2: Anisotropic Stretching (10:1 aspect ratio in x-direction)
    # ==========================================================================
    print("2. Anisotropic Stretching (Boundary Layer Style)")
    print("   - Elements stretched in x-direction (hx=0.2, hy=0.02)")
    print("   - 10:1 aspect ratio - like CFD boundary layers!")

    # Create anisotropic metric: small in y (perpendicular), large in x (tangent)
    sizes_aniso = np.array([0.2, 0.02])  # hx=0.2, hy=0.02 → 10:1 stretch
    single_tensor = metrics.create_anisotropic_metric(sizes_aniso)
    metric_aniso = np.tile(single_tensor, (n_vertices, 1))
    verts_aniso, tris_aniso = remesh_with_metric(
        vertices,
        triangles,
        edges,
        metric_aniso,
    )
    print(f"   Result: {len(verts_aniso)} vertices, {len(tris_aniso)} triangles")
    print()

    # ==========================================================================
    # Example 3: Rotated Anisotropic (45-degree shear layer)
    # ==========================================================================
    print("3. Rotated Anisotropic (45° Shear Layer)")
    print("   - Elements stretched at 45 degrees")
    print("   - Simulates mesh for diagonal flow features")

    theta = np.pi / 4  # 45 degrees
    rotation = np.array(
        [[np.cos(theta), -np.sin(theta)], [np.sin(theta), np.cos(theta)]],
    )
    sizes_rotated = np.array([0.15, 0.025])  # 6:1 aspect ratio
    single_tensor_rot = metrics.create_anisotropic_metric(sizes_rotated, rotation)
    metric_rotated = np.tile(single_tensor_rot, (n_vertices, 1))
    verts_rot, tris_rot = remesh_with_metric(vertices, triangles, edges, metric_rotated)
    print(f"   Result: {len(verts_rot)} vertices, {len(tris_rot)} triangles")
    print()

    # ==========================================================================
    # Example 4: Spatially-Varying Anisotropic (Radial Pattern)
    # ==========================================================================
    print("4. Spatially-Varying Anisotropic (Radial Refinement)")
    print("   - Elements stretched tangentially around center")
    print("   - Fine radially, coarse tangentially (like wheel spokes)")

    center = np.array([0.5, 0.5])
    metric_radial = np.zeros((n_vertices, 3), dtype=np.float64)

    for i, v in enumerate(vertices):
        r = v - center
        dist = np.linalg.norm(r)

        if dist < 0.01:
            # At center, use isotropic
            metric_radial[i] = metrics.create_isotropic_metric(0.03, 1, dim=2)[0]
        else:
            # Radial direction (fine: h=0.02)
            radial = r / dist
            # Tangential direction (coarse: h=0.1)
            tangent = np.array([-radial[1], radial[0]])

            # Build rotation matrix from directions
            R = np.column_stack([radial, tangent])
            sizes = np.array([0.02, 0.08])  # Fine radially, coarse tangentially
            metric_radial[i] = metrics.create_anisotropic_metric(sizes, R)

    verts_radial, tris_radial = remesh_with_metric(
        vertices,
        triangles,
        edges,
        metric_radial,
    )
    print(f"   Result: {len(verts_radial)} vertices, {len(tris_radial)} triangles")
    print()

    # ==========================================================================
    # Example 5: Solution-Adaptive (Gaussian Feature)
    # ==========================================================================
    print("5. Solution-Adaptive (Gaussian Feature)")
    print("   - Refine based on solution curvature (Hessian)")
    print("   - Elements align with principal curvature directions")

    # Define a solution field with anisotropic features: elongated Gaussian
    def solution(x: np.ndarray, y: np.ndarray) -> np.ndarray:
        # Elongated Gaussian centered at (0.5, 0.5)
        sigma_x, sigma_y = 0.15, 0.05  # Stretched in x-direction
        return np.exp(
            -((x - 0.5) ** 2) / (2 * sigma_x**2) - (y - 0.5) ** 2 / (2 * sigma_y**2),
        )

    def hessian(x: np.ndarray, y: np.ndarray) -> np.ndarray:
        """Compute Hessian tensor [H11, H12, H22] analytically."""
        sx, sy = 0.15, 0.05
        sx2, sy2 = sx**2, sy**2
        u = solution(x, y)
        dx, dy = x - 0.5, y - 0.5

        h11 = u * (dx**2 / sx2**2 - 1 / sx2)
        h22 = u * (dy**2 / sy2**2 - 1 / sy2)
        h12 = u * (dx * dy) / (sx2 * sy2)

        return np.column_stack([h11, h12, h22])

    hess = hessian(vertices[:, 0], vertices[:, 1])
    metric_adaptive = metrics.create_metric_from_hessian(
        hess,
        target_error=0.01,
        hmin=0.01,
        hmax=0.15,
    )
    verts_adapt, tris_adapt = remesh_with_metric(
        vertices,
        triangles,
        edges,
        metric_adaptive,
    )
    print(f"   Result: {len(verts_adapt)} vertices, {len(tris_adapt)} triangles")
    print()

    # ==========================================================================
    # Visualization
    # ==========================================================================
    print("Generating visualization...")

    fig, axes = plt.subplots(2, 3, figsize=(14, 9))
    fig.suptitle(
        "Anisotropic Mesh Adaptation with Tensor Metrics\n"
        "Demonstrating the power of directional element control",
        fontsize=14,
        fontweight="bold",
    )

    # Plot initial mesh
    plot_mesh(axes[0, 0], vertices, triangles, "Initial Mesh\n(coarse)")

    # Plot results
    plot_mesh(
        axes[0, 1],
        verts_iso,
        tris_iso,
        f"1. Isotropic (h={h_uniform})\n{len(tris_iso)} triangles",
    )
    plot_mesh(
        axes[0, 2],
        verts_aniso,
        tris_aniso,
        f"2. Anisotropic 10:1 (x-stretched)\n{len(tris_aniso)} triangles",
    )
    plot_mesh(
        axes[1, 0],
        verts_rot,
        tris_rot,
        f"3. Rotated 45° Anisotropic\n{len(tris_rot)} triangles",
    )
    plot_mesh(
        axes[1, 1],
        verts_radial,
        tris_radial,
        f"4. Radial Pattern\n{len(tris_radial)} triangles",
    )
    plot_mesh(
        axes[1, 2],
        verts_adapt,
        tris_adapt,
        f"5. Solution-Adaptive\n{len(tris_adapt)} triangles",
    )

    plt.tight_layout()

    # Save figure
    output_path = Path(__file__).parent / "anisotropic_mesh_adaptation.png"
    plt.savefig(output_path, dpi=150, bbox_inches="tight", facecolor="white")
    print(f"Figure saved to: {output_path}")

    plt.show()

    print()
    print("=" * 70)
    print("  Key Takeaways:")
    print("=" * 70)
    print("  - Tensor metrics control BOTH element size AND shape")
    print("  - Anisotropic meshes capture directional features efficiently")
    print("  - Solution-adaptive refinement automatically aligns with gradients")
    print("  - Use metrics.create_anisotropic_metric() for custom directions")
    print("  - Use metrics.create_metric_from_hessian() for adaptive refinement")
    print("=" * 70)


if __name__ == "__main__":
    main()
