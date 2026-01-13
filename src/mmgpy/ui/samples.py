"""Sample mesh generators for the mmgpy UI."""

from __future__ import annotations

import numpy as np
import pyvista as pv

# =============================================================================
# Sample mesh generation constants
# =============================================================================

# Tetrahedral cube: points per axis for structured grid
TETRA_CUBE_POINTS_PER_AXIS = 5

# Tetrahedral sphere: concentric shells for point distribution
TETRA_SPHERE_NUM_SHELLS = 3
TETRA_SPHERE_BASE_PHI_POINTS = 4  # Base number of latitude points
TETRA_SPHERE_PHI_INCREMENT = 2  # Additional phi points per shell
TETRA_SPHERE_BASE_THETA_POINTS = 8  # Base number of longitude points
TETRA_SPHERE_THETA_INCREMENT = 4  # Additional theta points per shell

# 2D disc: ring and sector configuration
DISC_2D_NUM_RINGS = 5
DISC_2D_NUM_SECTORS = 16
DISC_2D_INNER_RADIUS = 0.1  # Avoid degenerate triangles at center

# 2D rectangle: grid resolution
RECT_2D_RESOLUTION = 10

# Surface mesh resolutions (for pyvista primitives)
SURFACE_SPHERE_RESOLUTION = 20
SURFACE_CYLINDER_RESOLUTION = 20
SURFACE_CONE_RESOLUTION = 20
SURFACE_TORUS_U_RESOLUTION = 30
SURFACE_TORUS_V_RESOLUTION = 30


# =============================================================================
# Sample mesh generator functions
# =============================================================================


def create_tetra_cube() -> pv.UnstructuredGrid:
    """Create a tetrahedral cube mesh from interior points.

    Uses a structured grid of points inside a unit cube, then applies
    Delaunay tetrahedralization.

    Returns
    -------
    pv.UnstructuredGrid
        A tetrahedral mesh of a unit cube centered at origin.

    """
    n = TETRA_CUBE_POINTS_PER_AXIS
    x = np.linspace(-0.5, 0.5, n)
    y = np.linspace(-0.5, 0.5, n)
    z = np.linspace(-0.5, 0.5, n)
    xx, yy, zz = np.meshgrid(x, y, z)
    points = np.column_stack([xx.ravel(), yy.ravel(), zz.ravel()])
    cloud = pv.PolyData(points)
    return cloud.delaunay_3d()


def create_tetra_sphere() -> pv.UnstructuredGrid:
    """Create a tetrahedral sphere mesh from structured interior points.

    Uses spherical shells to create a structured point distribution
    inside the sphere, then applies Delaunay tetrahedralization.
    Point density increases with shell radius for better quality.

    Returns
    -------
    pv.UnstructuredGrid
        A tetrahedral mesh of a unit sphere centered at origin.

    """
    points = [[0, 0, 0]]  # Center point
    for shell in range(1, TETRA_SPHERE_NUM_SHELLS + 1):
        r = shell / TETRA_SPHERE_NUM_SHELLS
        # Increase point density with shell radius
        n_phi = TETRA_SPHERE_BASE_PHI_POINTS + shell * TETRA_SPHERE_PHI_INCREMENT
        n_theta = TETRA_SPHERE_BASE_THETA_POINTS + shell * TETRA_SPHERE_THETA_INCREMENT
        for i in range(n_phi):
            phi = np.pi * (i + 0.5) / n_phi  # Offset to avoid poles
            for j in range(n_theta):
                theta = 2 * np.pi * j / n_theta
                x = r * np.sin(phi) * np.cos(theta)
                y = r * np.sin(phi) * np.sin(theta)
                z = r * np.cos(phi)
                points.append([x, y, z])
    points = np.array(points)
    cloud = pv.PolyData(points)
    return cloud.delaunay_3d()


def create_2d_disc() -> pv.PolyData:
    """Create a 2D triangular disc mesh with good quality.

    Uses concentric rings with a small inner radius to avoid
    degenerate center triangles, then applies 2D Delaunay triangulation.

    Returns
    -------
    pv.PolyData
        A 2D triangular mesh of a unit disc in the XY plane.

    """
    points = []
    for i in range(DISC_2D_NUM_RINGS + 1):
        # Start from inner radius to avoid center issues
        r = DISC_2D_INNER_RADIUS + (1 - DISC_2D_INNER_RADIUS) * i / DISC_2D_NUM_RINGS
        if i == 0:
            points.append([0, 0, 0])  # Center point
        else:
            for j in range(DISC_2D_NUM_SECTORS):
                theta = 2 * np.pi * j / DISC_2D_NUM_SECTORS
                points.append([r * np.cos(theta), r * np.sin(theta), 0])
    points = np.array(points)
    cloud = pv.PolyData(points)
    return cloud.delaunay_2d()


def create_2d_rectangle() -> pv.PolyData:
    """Create a 2D triangular rectangle mesh.

    Returns
    -------
    pv.PolyData
        A 2D triangular mesh of a unit rectangle in the XY plane.

    """
    plane = pv.Plane(i_resolution=RECT_2D_RESOLUTION, j_resolution=RECT_2D_RESOLUTION)
    return plane.triangulate()


# Sample mesh registry
SAMPLE_MESHES: dict[str, dict] = {
    # Surface meshes (mmgs)
    "sphere": {
        "create": lambda: pv.Sphere(
            theta_resolution=SURFACE_SPHERE_RESOLUTION,
            phi_resolution=SURFACE_SPHERE_RESOLUTION,
        ),
        "category": "surface",
        "icon": "mdi-sphere",
    },
    "cube": {
        "create": lambda: pv.Cube().triangulate(),
        "category": "surface",
        "icon": "mdi-cube-outline",
    },
    "cylinder": {
        "create": lambda: pv.Cylinder(
            resolution=SURFACE_CYLINDER_RESOLUTION,
        ).triangulate(),
        "category": "surface",
        "icon": "mdi-cylinder",
    },
    "cone": {
        "create": lambda: pv.Cone(resolution=SURFACE_CONE_RESOLUTION).triangulate(),
        "category": "surface",
        "icon": "mdi-cone",
    },
    "torus": {
        "create": lambda: pv.ParametricTorus(
            u_res=SURFACE_TORUS_U_RESOLUTION,
            v_res=SURFACE_TORUS_V_RESOLUTION,
        ),
        "category": "surface",
        "icon": "mdi-circle-double",
    },
    "bunny": {
        "create": lambda: pv.examples.download_bunny(),
        "category": "surface",
        "icon": "mdi-rabbit",
    },
    # Tetrahedral meshes (mmg3d)
    "tetra_cube": {
        "create": create_tetra_cube,
        "category": "tetrahedral",
        "icon": "mdi-cube",
    },
    "tetra_sphere": {
        "create": create_tetra_sphere,
        "category": "tetrahedral",
        "icon": "mdi-sphere",
    },
    # 2D meshes (mmg2d)
    "disc_2d": {
        "create": create_2d_disc,
        "category": "2d",
        "icon": "mdi-circle",
    },
    "rect_2d": {
        "create": create_2d_rectangle,
        "category": "2d",
        "icon": "mdi-rectangle",
    },
}


def get_sample_mesh(name: str) -> pv.DataSet | None:
    """Get a sample mesh by name.

    Parameters
    ----------
    name : str
        Name of the sample mesh.

    Returns
    -------
    pv.DataSet | None
        The sample mesh, or None if not found.

    """
    if name not in SAMPLE_MESHES:
        return None

    pv_mesh = SAMPLE_MESHES[name]["create"]()

    # Triangulate if needed (but not for tetrahedral meshes)
    if hasattr(pv_mesh, "triangulate") and pv_mesh.n_cells > 0:
        # Only triangulate if not already tetrahedral
        if not (hasattr(pv_mesh, "celltypes") and 10 in pv_mesh.celltypes):
            pv_mesh = pv_mesh.triangulate()

    return pv_mesh


def list_samples_by_category() -> dict[str, list[str]]:
    """List available sample meshes grouped by category.

    Returns
    -------
    dict[str, list[str]]
        Sample names grouped by category (surface, tetrahedral, 2d).

    """
    categories: dict[str, list[str]] = {
        "surface": [],
        "tetrahedral": [],
        "2d": [],
    }
    for name, info in SAMPLE_MESHES.items():
        category = info["category"]
        if category in categories:
            categories[category].append(name)
    return categories
