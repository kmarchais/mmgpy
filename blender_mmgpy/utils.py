# SPDX-FileCopyrightText: 2026 Kevin Marchais
# SPDX-License-Identifier: GPL-3.0-or-later
"""Utility functions for mesh conversion between Blender and mmgpy."""

from __future__ import annotations

from typing import TYPE_CHECKING

import bmesh
import bpy
import mathutils
import numpy as np
import pyvista as pv

if TYPE_CHECKING:
    from numpy.typing import NDArray


def blender_to_arrays(
    obj: bpy.types.Object,
    *,
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

    return bpy.data.objects.new(name, mesh)


def replace_mesh_data(
    obj: bpy.types.Object,
    vertices: NDArray[np.float64],
    triangles: NDArray[np.int32],
) -> None:
    """Replace mesh data of an existing object in-place.

    Parameters
    ----------
    obj : bpy.types.Object
        Blender mesh object to update.
    vertices : ndarray
        New vertex coordinates (Nx3), in world space.
    triangles : ndarray
        New triangle connectivity (Mx3), 0-indexed.

    """
    # Transform vertices from world space back to local space
    matrix_world_inv = obj.matrix_world.inverted()
    local_verts = [(matrix_world_inv @ mathutils.Vector(v))[:] for v in vertices]

    mesh = obj.data
    mesh.clear_geometry()
    mesh.from_pydata(local_verts, [], triangles.tolist())
    mesh.update()


def arrays_to_polydata(
    vertices: NDArray[np.float64],
    triangles: NDArray[np.int32],
) -> pv.PolyData:
    """Build a PyVista PolyData surface from vertex + triangle arrays.

    Parameters
    ----------
    vertices : ndarray
        Vertex coordinates (Nx3) in world space.
    triangles : ndarray
        Triangle connectivity (Mx3), 0-indexed.

    Returns
    -------
    pv.PolyData
        Triangle surface mesh ready for ``mesh.mmg.remesh()``.

    """
    faces = np.column_stack(
        [np.full(len(triangles), 3, dtype=np.int32), triangles.astype(np.int32)],
    ).ravel()
    return pv.PolyData(vertices.astype(np.float64), faces=faces)


def polydata_to_arrays(
    polydata: pv.PolyData,
) -> tuple[NDArray[np.float64], NDArray[np.int32]]:
    """Extract vertices and triangle connectivity from a PolyData.

    Handles the polygon stream produced by ``.mmg.remesh()`` — line cells
    (MMG ridges) sit in ``polydata.lines`` and are ignored here.

    Returns
    -------
    vertices : ndarray
        Vertex coordinates (Nx3).
    triangles : ndarray
        Triangle connectivity (Mx3), 0-indexed.

    """
    vertices = np.asarray(polydata.points, dtype=np.float64)
    faces = np.asarray(polydata.faces)
    if faces.size == 0:
        triangles = np.empty((0, 3), dtype=np.int32)
    else:
        triangles = faces.reshape(-1, 4)[:, 1:].astype(np.int32, copy=False)
    return vertices, triangles


QUALITY_ATTR_NAME = "mmgpy_quality"
QUALITY_MATERIAL_NAME = "MMGpy_Quality"

# Mesh ID-property keys that cache the last computed quality statistics so
# the panel can show them without recomputing on every redraw.
QUALITY_STAT_KEYS: tuple[str, str, str, str] = (
    "mmgpy_quality_min",
    "mmgpy_quality_max",
    "mmgpy_quality_mean",
    "mmgpy_quality_n",
)

_TRIANGLE_LOOP_COUNT = 3


def is_all_triangles(mesh: bpy.types.Mesh) -> bool:
    """Return True if every polygon in the mesh has exactly three vertices.

    Returns
    -------
    bool
        ``True`` when the mesh is fully triangulated, ``False`` otherwise.

    """
    return all(p.loop_total == _TRIANGLE_LOOP_COUNT for p in mesh.polygons)


def _ensure_quality_material() -> bpy.types.Material:
    """Create (or fetch) the ``MMGpy_Quality`` shader material.

    The graph is ``Attribute("mmgpy_quality") -> ColorRamp -> Principled
    BSDF`` so the ColorRamp stays user-editable in the shader editor for
    anyone who wants a different palette than the default red/yellow/green.

    Returns
    -------
    bpy.types.Material
        The freshly created (or pre-existing) material.

    """
    mat = bpy.data.materials.get(QUALITY_MATERIAL_NAME)
    if mat is not None:
        return mat

    mat = bpy.data.materials.new(QUALITY_MATERIAL_NAME)
    mat.use_nodes = True
    nt = mat.node_tree
    nt.nodes.clear()

    attr = nt.nodes.new("ShaderNodeAttribute")
    attr.attribute_name = QUALITY_ATTR_NAME
    attr.attribute_type = "GEOMETRY"
    attr.location = (-600, 0)

    ramp = nt.nodes.new("ShaderNodeValToRGB")
    elements = ramp.color_ramp.elements
    elements[0].position = 0.0
    elements[0].color = (1.0, 0.0, 0.0, 1.0)  # red — low quality
    elements[1].position = 1.0
    elements[1].color = (0.0, 1.0, 0.0, 1.0)  # green — high quality
    mid = elements.new(0.5)
    mid.color = (1.0, 1.0, 0.0, 1.0)  # yellow — middling
    ramp.location = (-300, 0)

    bsdf = nt.nodes.new("ShaderNodeBsdfPrincipled")
    bsdf.inputs["Roughness"].default_value = 1.0
    bsdf.location = (0, 0)

    output = nt.nodes.new("ShaderNodeOutputMaterial")
    output.location = (300, 0)

    links = nt.links
    links.new(attr.outputs["Fac"], ramp.inputs["Fac"])
    links.new(ramp.outputs["Color"], bsdf.inputs["Base Color"])
    links.new(bsdf.outputs["BSDF"], output.inputs["Surface"])

    return mat


def _write_quality_attribute(
    mesh: bpy.types.Mesh,
    qualities: NDArray[np.floating],
) -> None:
    """Write ``qualities`` to the mesh's FACE-domain float attribute."""
    attr = mesh.attributes.get(QUALITY_ATTR_NAME)
    if attr is not None and (attr.domain != "FACE" or attr.data_type != "FLOAT"):
        mesh.attributes.remove(attr)
        attr = None
    if attr is None:
        attr = mesh.attributes.new(QUALITY_ATTR_NAME, "FLOAT", "FACE")
    attr.data.foreach_set("value", qualities.astype(np.float32))
    mesh.update()


def apply_quality_visualization(obj: bpy.types.Object) -> int:
    """Compute MMG in-radius-ratio qualities and apply them as a color material.

    The mesh must already be all triangles (mmgpy's remesh output always
    is). Returns the per-face quality count so the caller can log it.

    Returns
    -------
    int
        Number of faces coloured.

    Raises
    ------
    ValueError
        If the mesh contains non-triangular faces or the computed quality
        count does not match the polygon count.

    """
    mesh = obj.data
    if not is_all_triangles(mesh):
        msg = (
            "Quality visualisation requires an all-triangle mesh; "
            "remesh or triangulate the object first."
        )
        raise ValueError(msg)
    if len(mesh.polygons) == 0:
        return 0

    vertices, triangles = blender_to_arrays(obj, apply_modifiers=False)
    polydata = arrays_to_polydata(vertices, triangles)
    qualities = polydata.mmg.element_qualities()

    if len(qualities) != len(mesh.polygons):
        msg = (
            f"quality count {len(qualities)} does not match polygon count "
            f"{len(mesh.polygons)}; the mesh may have changed between "
            "conversion and quality evaluation"
        )
        raise ValueError(msg)

    _write_quality_attribute(mesh, qualities)

    # Cache the min/max/mean on the mesh so the panel can display them
    # without re-running ``element_qualities()`` on every UI redraw.
    mesh[QUALITY_STAT_KEYS[0]] = float(qualities.min())
    mesh[QUALITY_STAT_KEYS[1]] = float(qualities.max())
    mesh[QUALITY_STAT_KEYS[2]] = float(qualities.mean())
    mesh[QUALITY_STAT_KEYS[3]] = len(qualities)

    mat = _ensure_quality_material()
    slot_names = [slot.name for slot in mesh.materials if slot is not None]
    if QUALITY_MATERIAL_NAME not in slot_names:
        mesh.materials.append(mat)
    # Point the active slot at the quality material so it appears in the
    # shader editor on click.
    for i, slot in enumerate(mesh.materials):
        if slot is not None and slot.name == QUALITY_MATERIAL_NAME:
            obj.active_material_index = i
            break

    return len(qualities)


def remove_quality_visualization(obj: bpy.types.Object) -> None:
    """Detach the ``MMGpy_Quality`` material from *obj*'s slots.

    Leaves the per-face attribute on the mesh and the material in
    ``bpy.data`` so a re-enable doesn't have to recompute / rebuild from
    scratch.
    """
    mesh = obj.data
    for i in reversed(range(len(mesh.materials))):
        slot = mesh.materials[i]
        if slot is not None and slot.name == QUALITY_MATERIAL_NAME:
            mesh.materials.pop(index=i)


def get_quality_stats(mesh: bpy.types.Mesh) -> dict[str, float] | None:
    """Return cached min/max/mean/n quality stats, or ``None`` if absent.

    Returns
    -------
    dict or None
        ``{"min": ..., "max": ..., "mean": ..., "n": ...}`` when
        :func:`apply_quality_visualization` has run on this mesh,
        otherwise ``None``.

    """
    keys = QUALITY_STAT_KEYS
    if not all(k in mesh for k in keys):
        return None
    return {
        "min": float(mesh[keys[0]]),
        "max": float(mesh[keys[1]]),
        "mean": float(mesh[keys[2]]),
        "n": int(mesh[keys[3]]),
    }


def set_wireframe_overlay(obj: bpy.types.Object, *, enabled: bool) -> None:
    """Toggle the per-object wireframe overlay on top of shaded surfaces."""
    obj.show_wire = enabled
    obj.show_all_edges = enabled


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
    return [
        constraint.empty_object
        for constraint in settings.sizing_constraints
        if constraint.empty_object is not None
    ]


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
