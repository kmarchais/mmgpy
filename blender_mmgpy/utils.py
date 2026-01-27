# SPDX-FileCopyrightText: 2026 Kevin Marchais
# SPDX-License-Identifier: MIT
"""Utility functions for mesh conversion between Blender and mmgpy."""

from __future__ import annotations

from typing import TYPE_CHECKING

import bmesh
import bpy
import numpy as np

if TYPE_CHECKING:
    from numpy.typing import NDArray


def blender_to_arrays(
    obj: bpy.types.Object,
    apply_modifiers: bool = True,
) -> tuple[NDArray[np.float64], NDArray[np.int32]]:
    """Convert Blender mesh to numpy arrays.

    Parameters
    ----------
    obj : bpy.types.Object
        Blender mesh object to convert.
    apply_modifiers : bool
        Whether to apply modifiers before conversion.

    Returns
    -------
    vertices : ndarray
        Vertex coordinates (Nx3).
    triangles : ndarray
        Triangle connectivity (Mx3), 0-indexed.

    """
    # Get evaluated mesh (with modifiers applied)
    if apply_modifiers:
        depsgraph = bpy.context.evaluated_depsgraph_get()
        obj_eval = obj.evaluated_get(depsgraph)
        mesh = obj_eval.to_mesh()
    else:
        mesh = obj.data

    # Create bmesh for triangulation
    bm = bmesh.new()
    bm.from_mesh(mesh)

    # Triangulate (handles ngons)
    bmesh.ops.triangulate(bm, faces=bm.faces[:])

    # Ensure lookup table is valid
    bm.verts.ensure_lookup_table()
    bm.faces.ensure_lookup_table()

    # Extract vertices (in world space)
    matrix_world = obj.matrix_world
    vertices = np.array(
        [(matrix_world @ v.co)[:] for v in bm.verts],
        dtype=np.float64,
    )

    # Extract triangles
    triangles = np.array(
        [[v.index for v in f.verts] for f in bm.faces],
        dtype=np.int32,
    )

    # Cleanup
    bm.free()
    if apply_modifiers:
        obj_eval.to_mesh_clear()

    return vertices, triangles


def arrays_to_blender(
    vertices: NDArray[np.float64],
    triangles: NDArray[np.int32],
    name: str,
) -> bpy.types.Object:
    """Create a Blender mesh object from numpy arrays.

    Parameters
    ----------
    vertices : ndarray
        Vertex coordinates (Nx3).
    triangles : ndarray
        Triangle connectivity (Mx3), 0-indexed.
    name : str
        Name for the new object.

    Returns
    -------
    bpy.types.Object
        New Blender mesh object.

    """
    # Create new mesh data
    mesh = bpy.data.meshes.new(name)

    # Convert to lists for from_pydata
    verts_list = vertices.tolist()
    faces_list = triangles.tolist()

    # Create mesh from data
    mesh.from_pydata(verts_list, [], faces_list)
    mesh.update()

    # Create object
    obj = bpy.data.objects.new(name, mesh)

    return obj


def get_sizing_empties(context: bpy.types.Context) -> list[bpy.types.Object]:
    """Get all Empty objects used for sizing constraints.

    Parameters
    ----------
    context : bpy.types.Context
        Blender context.

    Returns
    -------
    list[bpy.types.Object]
        List of Empty objects referenced by sizing constraints.

    """
    settings = context.scene.mmgpy
    empties = []
    for constraint in settings.sizing_constraints:
        if constraint.empty_object is not None:
            empties.append(constraint.empty_object)
    return empties


def create_sizing_empty(
    context: bpy.types.Context,
    location: tuple[float, float, float],
    constraint_type: str = "SPHERE",
    radius: float = 0.1,
) -> bpy.types.Object:
    """Create an Empty object for sizing constraint visualization.

    Parameters
    ----------
    context : bpy.types.Context
        Blender context.
    location : tuple
        Location for the empty.
    constraint_type : str
        Type of constraint: "SPHERE" or "BOX".
    radius : float
        Display size for the empty.

    Returns
    -------
    bpy.types.Object
        New Empty object.

    """
    # Create empty
    bpy.ops.object.empty_add(
        type="SPHERE" if constraint_type == "SPHERE" else "CUBE",
        location=location,
    )
    empty = context.active_object
    empty.empty_display_size = radius
    empty.name = f"MMGpy_{constraint_type}_Sizing"

    # Set custom property for identification
    empty["mmgpy_sizing"] = True
    empty["mmgpy_type"] = constraint_type

    return empty
