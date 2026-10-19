# SPDX-FileCopyrightText: 2026 Kevin Marchais
# SPDX-License-Identifier: GPL-3.0-or-later
r"""Render the marketplace featured image: one Suzanne, split down the middle.

Left half = Suzanne's stock triangulation (varied quality with bad
triangles in the feature regions). Right half = the same surface
re-triangulated via ``mesh.mmg.remesh`` (uniformly high quality). Per-face
coloring with MMG's in-radius-ratio on a RdYlBu colormap (red = poor,
blue = excellent) so the seam *is* the value proposition.

Run (downloads bpy ~370 MB on first call)::

    uv run --no-project --with bpy --with mmgpy==0.14.0 --with pyvista \\
           --with matplotlib --with pillow \\
           python scripts/render_featured_image.py

Output: ``docs/assets/blender/featured-image.png`` (1920 x 1080).
"""

from __future__ import annotations

import tempfile
from pathlib import Path

# bpy must be imported before bmesh (bmesh ships inside the bpy package);
# the ``scripts/**`` ruff ignore list disables import-order linting here.
import bpy
import bmesh
import matplotlib as mpl
import mmgpy  # noqa: F401  registers the pv.PolyData.mmg accessor
import numpy as np
import pyvista as pv
from PIL import Image, ImageDraw, ImageFont

WIDTH, HEIGHT = 1920, 1080
HEADER_H = 80
FOOTER_H = 160
BODY_H = HEIGHT - HEADER_H - FOOTER_H
EEVEE_SAMPLES = 256
CYCLES_SAMPLES = 256
EXPOSURE_STOPS = -0.2  # slight EV cut; lighting alone is enough
WIRE_RADIUS = 0.0018
SPLIT_X = 0.0  # mesh-space plane separating original-left / remeshed-right
# RdYlBu: red -> yellow -> blue, no purple tail at the high end, which
# keeps "good = blue" reading cleanly. Linear mapping (no sigmoid) so
# bar height in the histogram corresponds directly to the in-radius ratio.
CMAP = mpl.colormaps["RdYlBu"]
# Colour-mapping window: any in-radius ratio at or below QUALITY_FLOOR maps
# to the colormap's red end; QUALITY_CEIL maps to blue; linear in between.
# Pushing the floor to 0.5 stretches the visible range into the band where
# triangles actually live, so the original side shows real colour variation.
QUALITY_FLOOR = 0.5
QUALITY_CEIL = 1.0
BG_RGBA = (24, 28, 34, 255)
TEXT_RGBA = (244, 246, 248, 255)
OUT_PATH = (
    Path(__file__).resolve().parent.parent
    / "docs"
    / "assets"
    / "blender"
    / "featured-image.png"
)


def setup_scene(engine: str = "BLENDER_EEVEE") -> bpy.types.Scene:
    """Blank scene; ``engine`` is ``BLENDER_EEVEE`` or ``CYCLES``."""
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    scene.render.engine = engine
    scene.render.resolution_x = WIDTH
    scene.render.resolution_y = BODY_H
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.film_transparent = True
    scene.view_settings.view_transform = "Standard"
    # Push brightness back up after switching off Emission. View-transform
    # exposure is the cleanest knob: it scales linear-light values before
    # the display transform, so it doesn't affect colour saturation.
    scene.view_settings.exposure = EXPOSURE_STOPS
    if engine == "BLENDER_EEVEE":
        scene.eevee.taa_render_samples = EEVEE_SAMPLES
    elif engine == "CYCLES":
        scene.cycles.samples = CYCLES_SAMPLES
        scene.cycles.use_denoising = True
    return scene


def setup_world() -> None:
    """Subtle dark backdrop with a gentle gradient so the scene isn't black."""
    world = bpy.data.worlds.new("featured-world")
    bpy.context.scene.world = world
    world.use_nodes = True
    nt = world.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputWorld")
    bg = nt.nodes.new("ShaderNodeBackground")
    # ~0.5% ambient, just enough to wash the world without competing.
    bg.inputs["Color"].default_value = (0.04, 0.05, 0.07, 1.0)
    bg.inputs["Strength"].default_value = 0.6
    nt.links.new(bg.outputs["Background"], out.inputs["Surface"])


def make_suzanne() -> tuple[np.ndarray, np.ndarray]:
    """Add Suzanne, triangulate, return (vertices, faces) and discard the object."""
    bpy.ops.mesh.primitive_monkey_add(size=1)
    obj = bpy.context.object
    me = obj.data
    bm = bmesh.new()
    bm.from_mesh(me)
    bmesh.ops.triangulate(bm, faces=bm.faces)
    bm.to_mesh(me)
    bm.free()
    verts = np.array([(v.co.x, v.co.y, v.co.z) for v in me.vertices], dtype=np.float64)
    faces = np.array(
        [tuple(p.vertices) for p in me.polygons],
        dtype=np.int64,
    )
    bpy.data.objects.remove(obj, do_unlink=True)
    return verts, faces


def remesh(
    verts: np.ndarray, faces: np.ndarray, **opts
) -> tuple[np.ndarray, np.ndarray]:
    """Run MMG surface remesh via the PyVista accessor."""
    faces_pv = np.column_stack([np.full(len(faces), 3, np.int64), faces]).ravel()
    mesh = pv.PolyData(verts, faces_pv)
    out = mesh.mmg.remesh(**opts)
    new_verts = np.asarray(out.points, dtype=np.float64)
    new_faces = out.faces.reshape(-1, 4)[:, 1:].astype(np.int64)
    return new_verts, new_faces


def split_at_plane(
    verts_a: np.ndarray,
    faces_a: np.ndarray,
    verts_b: np.ndarray,
    faces_b: np.ndarray,
    split_x: float,
) -> tuple[np.ndarray, np.ndarray]:
    """Take left-of-plane triangles from mesh A, right-of-plane from mesh B.

    Selection is by face centroid X, so each output triangle stays
    intact (no clipping). The two meshes don't share vertices; we just
    concatenate vertex lists and reindex.
    """
    cx_a = verts_a[faces_a][:, :, 0].mean(axis=1)
    cx_b = verts_b[faces_b][:, :, 0].mean(axis=1)
    left = faces_a[cx_a < split_x]
    right = faces_b[cx_b >= split_x]

    combined_verts = np.vstack([verts_a, verts_b])
    combined_faces = np.vstack([left, right + len(verts_a)])
    return combined_verts, combined_faces


def srgb_to_linear(c: np.ndarray) -> np.ndarray:
    """Convert sRGB-encoded floats in [0, 1] to linear-light floats.

    matplotlib colormaps emit values intended for direct sRGB display.
    Blender stores vertex colours as linear; if we hand it sRGB-encoded
    floats, the scene's sRGB output transform re-applies the curve and
    the result desaturates into pastel. This inverse-encodes so the
    final pixels match what matplotlib intends.
    """
    a = 0.055
    return np.where(c <= 0.04045, c / 12.92, ((c + a) / (1.0 + a)) ** 2.4)


def sigmoid_stretch(q: np.ndarray) -> np.ndarray:
    """Linear windowed remap into ``[QUALITY_FLOOR, QUALITY_CEIL]``.

    Name is historical (used to be a true sigmoid); kept so every call
    site that drives a colormap goes through one place. Anything below
    the floor clamps to colormap position 0 (red); anything above the
    ceiling clamps to 1 (blue).
    """
    return np.clip((q - QUALITY_FLOOR) / (QUALITY_CEIL - QUALITY_FLOOR), 0.0, 1.0)


def mmg_quality(verts: np.ndarray, faces: np.ndarray) -> np.ndarray:
    """MMG in-radius-ratio quality per triangle, normalized to [0, 1].

    ``q = (12/sqrt(3)) * area / sum(edge**2)``; q == 1 for an equilateral
    triangle, q -> 0 as the triangle becomes degenerate.
    """
    p0, p1, p2 = verts[faces[:, 0]], verts[faces[:, 1]], verts[faces[:, 2]]
    e0 = np.linalg.norm(p1 - p0, axis=1)
    e1 = np.linalg.norm(p2 - p1, axis=1)
    e2 = np.linalg.norm(p0 - p2, axis=1)
    area = 0.5 * np.linalg.norm(np.cross(p1 - p0, p2 - p0), axis=1)
    sum_e2 = e0**2 + e1**2 + e2**2
    q = (area / np.maximum(sum_e2, 1e-18)) * (12.0 / np.sqrt(3.0))
    return np.clip(q, 0.0, 1.0)


def build_surface(
    name: str, verts: np.ndarray, faces: np.ndarray, face_quality: np.ndarray
) -> bpy.types.Object:
    """Per-face PBR coloring driven by vertex colors.

    Face-corner domain + per-face uniform color = sharp per-triangle reading
    (no vertex averaging). Principled BSDF picks up the lighting so the
    surface shades like a real 3D object, with shadows and highlights
    that the prior pure-Emission setup didn't have.
    """
    me = bpy.data.meshes.new(name)
    me.from_pydata(verts.tolist(), [], faces.tolist())
    me.update()

    rgba_face = CMAP(np.clip(sigmoid_stretch(face_quality), 0.0, 1.0))
    # Inverse-encode sRGB -> linear so Blender's output transform doesn't
    # gamma the colours a second time (the cause of the pastel look).
    rgba_face[..., :3] = srgb_to_linear(rgba_face[..., :3])
    rgba_face = rgba_face.astype(np.float32)
    corners = np.repeat(rgba_face, 3, axis=0)
    col = me.color_attributes.new(name="Col", type="FLOAT_COLOR", domain="CORNER")
    col.data.foreach_set("color", corners.ravel())

    mat = bpy.data.materials.new(name=f"{name}_mat")
    mat.use_nodes = True
    nt = mat.node_tree
    bsdf = nt.nodes["Principled BSDF"]
    vcol = nt.nodes.new("ShaderNodeVertexColor")
    vcol.layer_name = "Col"
    nt.links.new(vcol.outputs["Color"], bsdf.inputs["Base Color"])
    # High roughness keeps the surface matte so the colormap stays the
    # dominant signal and specular highlights don't blow out the top.
    bsdf.inputs["Roughness"].default_value = 0.85
    bsdf.inputs["Metallic"].default_value = 0.0
    # Knock down the default Specular IOR so the surface doesn't catch
    # bright glints from the key light.
    if "Specular IOR Level" in bsdf.inputs:
        bsdf.inputs["Specular IOR Level"].default_value = 0.2
    me.materials.append(mat)

    obj = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(obj)
    return obj


def _unique_edges(faces: np.ndarray) -> np.ndarray:
    pairs = np.concatenate([faces[:, [0, 1]], faces[:, [1, 2]], faces[:, [2, 0]]])
    pairs.sort(axis=1)
    return np.unique(pairs, axis=0)


def build_wire(
    name: str, verts: np.ndarray, faces: np.ndarray, radius: float = WIRE_RADIUS
) -> bpy.types.Object:
    """Curve-bevel wireframe (gap-free, uniform thickness)."""
    cu = bpy.data.curves.new(f"{name}_curve", type="CURVE")
    cu.dimensions = "3D"
    cu.bevel_depth = radius
    cu.bevel_resolution = 2
    cu.use_fill_caps = True
    for a, b in _unique_edges(faces):
        sp = cu.splines.new("POLY")
        sp.points.add(1)
        sp.points[0].co = (*verts[a], 1.0)
        sp.points[1].co = (*verts[b], 1.0)

    wmat = bpy.data.materials.new(name=f"{name}_wmat")
    wmat.use_nodes = True
    nodes, links = wmat.node_tree.nodes, wmat.node_tree.links
    nodes.clear()
    out_node = nodes.new("ShaderNodeOutputMaterial")
    emit = nodes.new("ShaderNodeEmission")
    # Slightly emissive dark gray so the wire stays visible against lit
    # surface (without the surface, it would be invisible against the bg).
    emit.inputs["Color"].default_value = (0.04, 0.05, 0.06, 1.0)
    emit.inputs["Strength"].default_value = 1.4
    links.new(emit.outputs["Emission"], out_node.inputs["Surface"])

    obj = bpy.data.objects.new(f"{name}_wire", cu)
    obj.data.materials.append(wmat)
    bpy.context.scene.collection.objects.link(obj)
    return obj


def setup_camera(bbox: np.ndarray) -> None:
    """Front-facing orthographic camera so the x=0 split runs vertically.

    Camera looks down -Y with up = +Z, so the mesh's x axis maps directly
    to the image's horizontal axis and the original/remeshed split lands
    dead-center. We frame from the actual bbox extents (not the diagonal),
    accounting for the render aspect ratio so wide-eared Suzanne fits both
    axes with margin.
    """
    center = bbox.mean(axis=0)
    diag = float(np.linalg.norm(np.ptp(bbox, axis=0)))

    bpy.ops.object.empty_add(location=tuple(center))
    target = bpy.context.object

    bpy.ops.object.camera_add(
        location=(
            center[0],
            center[1] - 1.8 * diag,
            center[2] + 0.18 * diag,
        ),
    )
    cam = bpy.context.object
    track = cam.constraints.new(type="TRACK_TO")
    track.target = target
    track.track_axis = "TRACK_NEGATIVE_Z"
    track.up_axis = "UP_Y"
    cam.data.type = "ORTHO"

    extent_x = float(bbox[1, 0] - bbox[0, 0])
    extent_z = float(bbox[1, 2] - bbox[0, 2])
    aspect = WIDTH / BODY_H
    # ortho_scale is the visible width; vertical visible = ortho_scale / aspect.
    cam.data.ortho_scale = 1.15 * max(extent_x, extent_z * aspect)
    bpy.context.scene.camera = cam


def setup_lights(bbox: np.ndarray) -> None:
    """Three-point area lighting for a polished product render."""
    center = bbox.mean(axis=0)
    diag = float(np.linalg.norm(np.ptp(bbox, axis=0)))

    # Key — slightly warm, front-right, mostly level (not top-down so it
    # doesn't blow out Suzanne's forehead).
    bpy.ops.object.light_add(
        type="AREA",
        location=(
            center[0] + 1.2 * diag,
            center[1] - 0.9 * diag,
            center[2] + 0.4 * diag,
        ),
    )
    key = bpy.context.object
    key.data.energy = 220
    key.data.size = 5.5
    key.data.color = (1.0, 0.96, 0.92)

    # Fill — softer, cooler, front-left.
    bpy.ops.object.light_add(
        type="AREA",
        location=(
            center[0] - 1.4 * diag,
            center[1] - 0.7 * diag,
            center[2] + 0.2 * diag,
        ),
    )
    fill = bpy.context.object
    fill.data.energy = 120
    fill.data.size = 5.0
    fill.data.color = (0.88, 0.92, 1.0)

    # Rim — back, low energy, kept to one side so the top of the head
    # doesn't go pure white.
    bpy.ops.object.light_add(
        type="AREA",
        location=(
            center[0] - 0.4 * diag,
            center[1] + 1.4 * diag,
            center[2] + 0.8 * diag,
        ),
    )
    rim = bpy.context.object
    rim.data.energy = 130
    rim.data.size = 3.0
    rim.data.color = (1.0, 0.98, 0.95)

    bpy.ops.object.light_add(
        type="AREA", location=(center[0] + 2.5, center[1] - 3.0, center[2] + 4.0)
    )
    bpy.context.object.data.energy = 350
    bpy.context.object.data.size = 5

    bpy.ops.object.light_add(
        type="AREA", location=(center[0] - 2.5, center[1] - 1.5, center[2] + 1.5)
    )
    bpy.context.object.data.energy = 120
    bpy.context.object.data.size = 4


def render(path: Path) -> None:
    bpy.context.scene.render.filepath = str(path)
    bpy.ops.render.render(write_still=True)


def _font(path: str, size: int) -> ImageFont.ImageFont:
    try:
        return ImageFont.truetype(path, size)
    except OSError:
        return ImageFont.load_default()


def render_distribution(
    qualities: np.ndarray,
    width: int,
    height: int,
    *,
    n_bins: int = 60,
) -> tuple[Image.Image, int]:
    """Histogram of triangle qualities, each bar coloured by the same
    colormap (with sigmoid stretch) used on the surface.

    Each bar's colour tells you *which* triangles it counts; its height
    tells you *how many*. Empty bins keep a thin baseline so the full
    quality range stays visible regardless of distribution. Returns the
    image and the pixel x-position of the mean (relative to the image).
    """
    img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    hist, edges = np.histogram(qualities, bins=n_bins, range=(0.0, 1.0))
    mean = float(qualities.mean()) if len(qualities) else 0.0
    mean_x = round(mean * width)
    if hist.max() == 0:
        return img, mean_x
    hist_norm = hist / hist.max()

    margin_top, margin_bot = 6, 6
    plot_h = height - margin_top - margin_bot
    bin_w = width / n_bins
    for i, count_norm in enumerate(hist_norm):
        bin_center = (edges[i] + edges[i + 1]) / 2
        rgba = CMAP(sigmoid_stretch(np.array([bin_center])))[0]
        colour = (int(rgba[0] * 255), int(rgba[1] * 255), int(rgba[2] * 255), 255)
        x0 = round(i * bin_w)
        x1 = max(round((i + 1) * bin_w) - 1, x0)
        bar_h = count_norm * plot_h
        if bar_h > 0:
            y0 = height - margin_bot - bar_h
            y1 = height - margin_bot
            draw.rectangle([x0, round(y0), x1, round(y1)], fill=colour)
        # Always draw a 1 px baseline tick so the whole quality range
        # remains readable even where the histogram is empty.
        draw.rectangle(
            [x0, height - margin_bot, x1, height - margin_bot + 1],
            fill=(*TEXT_RGBA[:3], 70),
        )

    # Vertical mean marker spanning the plot.
    draw.line(
        [(mean_x, margin_top - 2), (mean_x, height - margin_bot + 4)],
        fill=(*TEXT_RGBA[:3], 230),
        width=2,
    )
    return img, mean_x


def compose(
    body_png: Path,
    out: Path,
    left_q: np.ndarray,
    right_q: np.ndarray,
) -> None:
    """PIL overlay: half labels, split line, per-half distribution histograms."""
    canvas = Image.new("RGBA", (WIDTH, HEIGHT), BG_RGBA)
    canvas.alpha_composite(Image.open(body_png).convert("RGBA"), (0, HEADER_H))

    draw = ImageDraw.Draw(canvas)
    f_title = _font("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 44)
    f_label = _font("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 32)
    f_cbtitle = _font("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 30)
    f_tick = _font("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 24)

    def centered(
        text: str, font: ImageFont.ImageFont, cx: int, cy: int, fill=TEXT_RGBA
    ) -> None:
        bb = draw.textbbox((0, 0), text, font=font)
        w, h = bb[2] - bb[0], bb[3] - bb[1]
        draw.text((cx - w // 2, cy - h // 2 - bb[1]), text, fill=fill, font=font)

    # Single brand title across the top.
    centered(
        "MMGpy — Adaptive Triangle Remeshing for Blender",
        f_title,
        WIDTH // 2,
        HEADER_H // 2,
    )

    # Half-labels inside the body, near the top. Pill-shaped backdrops
    # so the text stays legible over the wireframe.
    def pill(text: str, cx: int, cy: int) -> None:
        bb = draw.textbbox((0, 0), text, font=f_label)
        w, h = bb[2] - bb[0], bb[3] - bb[1]
        px, py = 18, 10  # padding
        x0, y0 = cx - w // 2 - px, cy - h // 2 - bb[1] - py
        x1, y1 = cx + w // 2 + px, cy + h // 2 - bb[1] + py
        draw.rounded_rectangle(
            (x0, y0, x1, y1),
            radius=(y1 - y0) // 2,
            fill=(*BG_RGBA[:3], 220),
            outline=(*TEXT_RGBA[:3], 100),
            width=1,
        )
        draw.text(
            (cx - w // 2, cy - h // 2 - bb[1]), text, fill=TEXT_RGBA, font=f_label
        )

    label_y = HEADER_H + 50
    pill("Original", WIDTH // 4, label_y)
    pill("Remeshed with MMGpy", 3 * WIDTH // 4, label_y)

    # Distribution histograms below the ears. A translucent pill-shaped
    # backdrop keeps them legible over the wireframe behind.
    hist_w, hist_h = 380, 110
    pad = 14
    bd_y = HEADER_H + BODY_H - hist_h - 120  # higher up than before
    for cx, qs in ((WIDTH // 4, left_q), (3 * WIDTH // 4, right_q)):
        title = "Triangle Shape distribution"
        x0 = cx - hist_w // 2 - pad
        y0 = bd_y - pad - 22
        x1 = cx + hist_w // 2 + pad
        y1 = bd_y + hist_h + pad + 18
        draw.rounded_rectangle(
            (x0, y0, x1, y1),
            radius=14,
            fill=(*BG_RGBA[:3], 200),
            outline=(*TEXT_RGBA[:3], 80),
            width=1,
        )
        bb = draw.textbbox((0, 0), title, font=f_tick)
        draw.text(
            (cx - (bb[2] - bb[0]) // 2, y0 + 8 - bb[1]),
            title,
            fill=TEXT_RGBA,
            font=f_tick,
        )
        hist_img, mean_px = render_distribution(qs, hist_w, hist_h)
        canvas.alpha_composite(hist_img, (cx - hist_w // 2, bd_y))

        # Mean value label next to the mean marker line. Snap to whichever
        # side has more room so the label never gets clipped.
        mean_value = float(qs.mean())
        mean_label = f"μ = {mean_value:.2f}"
        mb = draw.textbbox((0, 0), mean_label, font=f_tick)
        lw = mb[2] - mb[0]
        mean_canvas_x = cx - hist_w // 2 + mean_px
        # 8 px gap from the marker; flip to left if it would overflow right.
        if mean_canvas_x + 8 + lw <= cx + hist_w // 2:
            label_x = mean_canvas_x + 8
        else:
            label_x = mean_canvas_x - 8 - lw
        draw.text(
            (label_x, bd_y + 4 - mb[1]),
            mean_label,
            fill=TEXT_RGBA,
            font=f_tick,
        )

        # Semantic axis tick labels at the ends.
        draw.text(
            (cx - hist_w // 2, bd_y + hist_h + 4),
            "Thin",
            fill=(*TEXT_RGBA[:3], 200),
            font=f_tick,
        )
        eb = draw.textbbox((0, 0), "Equilateral", font=f_tick)
        draw.text(
            (cx + hist_w // 2 - (eb[2] - eb[0]), bd_y + hist_h + 4),
            "Equilateral",
            fill=(*TEXT_RGBA[:3], 200),
            font=f_tick,
        )

    # Vertical split: anchors the eye to the seam between the two halves.
    draw.line(
        [(WIDTH // 2, HEADER_H), (WIDTH // 2, HEADER_H + BODY_H)],
        fill=(*TEXT_RGBA[:3], 70),
        width=2,
    )

    # Single-line tagline at the bottom of the image describing the metric.
    centered(
        "Quality: MMG in-radius ratio",
        f_cbtitle,
        WIDTH // 2,
        HEIGHT - 40,
        fill=(*TEXT_RGBA[:3], 220),
    )

    out.parent.mkdir(parents=True, exist_ok=True)
    canvas.convert("RGB").save(out, "PNG", optimize=True)


def render_pass(engine: str, out_path: Path) -> None:
    """Build the scene from scratch for `engine` and render into `out_path`.

    We rebuild the whole scene per engine because EEVEE / Cycles share
    settings but a clean tree avoids cross-engine state surprises.
    """
    setup_scene(engine)
    setup_world()

    verts_a, faces_a = make_suzanne()
    # Tuned for Suzanne (~2 unit diameter):
    #   hmin/hmax bracket a uniform target size, hgrad=1.1 forces smooth
    #   size gradation between adjacent triangles, ar=90 raises the ridge-
    #   detection angle so MMG doesn't over-protect Suzanne's near-smooth
    #   creases (eyelids, mouth boundary), nreg regularises surface normals,
    #   optim runs a final quality pass.
    #
    # We run MMG twice: the second pass smooths out any remaining bad
    # triangles inherited from the first remesh's seed mesh. Sweep showed
    # two-stage cuts triangles below 0.5 quality from 166 (baseline) ->
    # 14 (two-stage), and lifts mean quality from 0.881 -> 0.955.
    mmg_opts = dict(hmin=0.04, hmax=0.08, hgrad=1.1, ar=90, nreg=True, optim=True)
    verts_b, faces_b = remesh(verts_a, faces_a, **mmg_opts)
    verts_b, faces_b = remesh(verts_b, faces_b, **mmg_opts)

    qa_face = mmg_quality(verts_a, faces_a)
    qb_face = mmg_quality(verts_b, faces_b)
    print(
        f"[{engine}] Original: {len(faces_a)} tris, "
        f"quality min={qa_face.min():.3f} mean={qa_face.mean():.3f}",
    )
    print(
        f"[{engine}] Remeshed: {len(faces_b)} tris, "
        f"quality min={qb_face.min():.3f} mean={qb_face.mean():.3f}",
    )

    verts_c, faces_c = split_at_plane(
        verts_a,
        faces_a,
        verts_b,
        faces_b,
        split_x=SPLIT_X,
    )
    qc_face = mmg_quality(verts_c, faces_c)
    print(f"[{engine}] Combined: {len(faces_c)} tris (halves of both meshes)")

    # Quality arrays for the rendered halves — used to render per-side
    # distribution histograms in the composite below.
    cx_a = verts_a[faces_a][:, :, 0].mean(axis=1)
    cx_b = verts_b[faces_b][:, :, 0].mean(axis=1)
    q_left = qa_face[cx_a < SPLIT_X]
    q_right = qb_face[cx_b >= SPLIT_X]
    print(
        f"[{engine}] Left half:  {len(q_left)} tris, mean q={q_left.mean():.3f}",
    )
    print(
        f"[{engine}] Right half: {len(q_right)} tris, mean q={q_right.mean():.3f}",
    )

    _surf = build_surface("Suzanne", verts_c, faces_c, qc_face)
    _wire = build_wire("Suzanne", verts_c, faces_c, radius=WIRE_RADIUS)

    bbox = np.vstack([verts_c.min(axis=0), verts_c.max(axis=0)])
    setup_camera(bbox)
    setup_lights(bbox)

    with tempfile.TemporaryDirectory() as tmp:
        body_png = Path(tmp) / "body.png"
        render(body_png)
        compose(body_png, out_path, q_left, q_right)
    print(f"[{engine}] Wrote {out_path}")


def main() -> None:
    """Render the marketplace featured image with Cycles."""
    render_pass("CYCLES", OUT_PATH)


if __name__ == "__main__":
    main()
