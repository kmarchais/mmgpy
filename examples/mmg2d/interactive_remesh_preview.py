# /// script
# requires-python = ">=3.10"
# dependencies = [
#     "mmgpy",
#     "pyvista",
# ]
#
# [tool.uv.sources]
# mmgpy = { path = "../.." }
# ///

"""Interactive remeshing preview with movable refinement region.

This example demonstrates an interactive PyVista-based tool for exploring
remeshing parameters in real-time.

Features demonstrated:
- Live mesh updates while dragging sliders
- Movable refinement region (drag the red sphere)
- Custom metric field for local size control
- Visual feedback with influence radius circle

Controls:
- Drag the red sphere to move the fine mesh region
- hmax slider: controls coarse mesh size (outside refinement region)
- local_size slider: controls fine mesh size (at sphere center)
- radius slider: controls the influence area of refinement
"""

import numpy as np
import pyvista as pv

from mmgpy import MmgMesh2D


def create_circle_mesh(n: int = 16) -> MmgMesh2D:
    """Create a circular mesh with n boundary segments."""
    vertices = [[0.0, 0.0]]
    for i in range(n):
        theta = 2 * np.pi * i / n
        vertices.append([np.cos(theta), np.sin(theta)])
    vertices = np.array(vertices, dtype=np.float64)

    triangles = []
    for i in range(n):
        triangles.append([0, 1 + i, 1 + (i + 1) % n])

    return MmgMesh2D(vertices, np.array(triangles, dtype=np.int32))


def mesh_to_pyvista(mesh: MmgMesh2D) -> pv.PolyData:
    """Convert MmgMesh2D to PyVista PolyData."""
    verts = mesh.get_vertices()
    verts_3d = np.column_stack([verts, np.zeros(len(verts))])
    tris = mesh.get_triangles()
    faces = np.column_stack([np.full(len(tris), 3), tris]).ravel()
    return pv.PolyData(verts_3d, faces)


def compute_size_field(
    vertices: np.ndarray,
    center: np.ndarray,
    local_size: float,
    far_size: float,
    radius: float,
) -> np.ndarray:
    """Compute size field based on distance from center.

    Returns sizes that vary linearly from local_size at center
    to far_size at radius distance.
    """
    distances = np.sqrt(
        (vertices[:, 0] - center[0]) ** 2 + (vertices[:, 1] - center[1]) ** 2,
    )
    t = np.clip(distances / radius, 0, 1)
    sizes = local_size + t * (far_size - local_size)
    return sizes.reshape(-1, 1)


class InteractiveRemeshPreview:
    """Interactive preview for exploring remeshing parameters."""

    def __init__(self) -> None:
        """Initialize the interactive preview with default parameters."""
        self.hmax = 0.15
        self.local_size = 0.03
        self.radius = 0.4
        self.center = np.array([0.0, 0.0, 0.0])
        self.plotter = pv.Plotter(title="Interactive Remesh Preview")

    def update(self, _: float | None = None) -> None:
        """Remesh and update the display."""
        mesh = create_circle_mesh()
        vertices = mesh.get_vertices()

        sizes = compute_size_field(
            vertices,
            self.center[:2],
            self.local_size,
            self.hmax,
            self.radius,
        )

        mesh["metric"] = sizes

        try:
            mesh.remesh(hausd=0.01, verbose=-1)
            n_verts = len(mesh.get_vertices())
            n_tris = len(mesh.get_triangles())
            status = f"{n_verts} verts | {n_tris} tris"
        except RuntimeError:
            status = "remesh failed"
            mesh = create_circle_mesh()

        pv_mesh = mesh_to_pyvista(mesh)
        self.plotter.add_mesh(
            pv_mesh,
            show_edges=True,
            color="lightblue",
            edge_color="darkblue",
            line_width=1,
            name="mesh",
        )

        theta = np.linspace(0, 2 * np.pi, 50)
        circle_pts = np.column_stack(
            [
                self.center[0] + self.radius * np.cos(theta),
                self.center[1] + self.radius * np.sin(theta),
                np.zeros(50),
            ],
        )
        circle = pv.lines_from_points(circle_pts, close=True)
        self.plotter.add_mesh(circle, color="red", line_width=2, name="circle")

        info = (
            f"hmax = {self.hmax:.3f}\n"
            f"local_size = {self.local_size:.3f}\n"
            f"radius = {self.radius:.2f}\n"
            f"\n{status}"
        )
        self.plotter.add_text(info, position="upper_right", font_size=11, name="info")

    def on_sphere_move(self, center: tuple[float, float, float]) -> None:
        """Handle sphere widget movement."""
        self.center = np.array(center)
        self.update()

    def on_hmax(self, value: float) -> None:
        """Handle hmax slider change."""
        self.hmax = value
        self.update()

    def on_local_size(self, value: float) -> None:
        """Handle local_size slider change."""
        self.local_size = value
        self.update()

    def on_radius(self, value: float) -> None:
        """Handle radius slider change."""
        self.radius = value
        self.update()

    def run(self) -> None:
        """Launch the interactive preview window."""
        self.update()

        self.plotter.add_sphere_widget(
            self.on_sphere_move,
            center=self.center,
            radius=0.06,
            color="red",
            interaction_event="always",
        )

        y = 0.08
        evt = "always"

        self.plotter.add_slider_widget(
            self.on_hmax,
            rng=[0.05, 0.25],
            value=self.hmax,
            title="hmax",
            pointa=(0.02, y),
            pointb=(0.32, y),
            interaction_event=evt,
        )
        self.plotter.add_slider_widget(
            self.on_local_size,
            rng=[0.01, 0.1],
            value=self.local_size,
            title="local_size",
            pointa=(0.35, y),
            pointb=(0.65, y),
            interaction_event=evt,
        )
        self.plotter.add_slider_widget(
            self.on_radius,
            rng=[0.15, 0.9],
            value=self.radius,
            title="radius",
            pointa=(0.68, y),
            pointb=(0.98, y),
            interaction_event=evt,
        )

        help_text = (
            "DRAG THE RED SPHERE!\n\n"
            "Move it to relocate\n"
            "the fine mesh region.\n\n"
            "hmax: coarse size\n"
            "local_size: fine size\n"
            "radius: influence area"
        )
        self.plotter.add_text(
            help_text,
            position="upper_left",
            font_size=10,
            name="help",
        )

        self.plotter.camera_position = "xy"
        self.plotter.show()


if __name__ == "__main__":
    print("Interactive Remesh Preview")
    print("=" * 40)
    print("- Drag the RED SPHERE to move the refinement region")
    print("- Adjust sliders for real-time parameter changes")
    print("- Close the window when done")
    print()

    app = InteractiveRemeshPreview()
    app.run()
