# MMGpy Blender Extension

A Blender 4.2+ extension that exposes [mmgpy](https://github.com/kmarchais/mmgpy)'s
remeshing pipeline (Python bindings for the [MMG library](https://www.mmgtools.org))
directly inside Blender's UI — drives MMG through PyVista's `.mmg`
accessor end-to-end.

## Features

### Remeshing

- **Remesh** the active mesh in place with Undo support
- **Presets** (Fine / Medium / Coarse) plus full manual control
- **Size control**: `hmin`, `hmax`, `hsiz`, `hgrad`, Hausdorff distance, angle detection
- **Local refinement**: drop **Sphere** or **Box** Empties into the scene as
  refinement zones (translates to `local_sizing=[{...}]` on the
  `.mmg.remesh` call)
- **Auto-fit** the size parameters to the active mesh's bounding box
- **High-triangle confirmation dialog** when the estimated triangle
  count exceeds 1,000,000

### Visualization

- **Wireframe on Surface** — overlay the mesh wireframe on top of the
  shaded surface (`obj.show_wire` + `show_all_edges`) for the active
  object. Survives a remesh.
- **Color by Quality** — apply a shader material driven by MMG's
  in-radius-ratio quality per triangle. The colormap is ColorBrewer
  **RdYlBu** (red = poor, blue = excellent), shown live in the panel via
  `template_color_ramp` so users can re-grade it without leaving the N-panel.
  - **Range** dropdown: `Absolute [0, 1]`, `Auto [min, max]` (stretches
    to this mesh's range), or `Custom [min, max]` (user-pinned bounds
    for cross-mesh comparison).
  - **Stats block**: triangle count plus min / mean / max per mesh.
  - Auto-switches the viewport to **Material Preview** if it isn't
    already on a material-aware shading mode.

## Requirements

- Blender **4.2+** (uses the new Extensions system)
- The released zips bundle mmgpy and every transitive dependency
  (numpy, pyvista, scipy, vtk, matplotlib, …) — no separate `pip
install` needed.

The CI release pipeline builds one zip per (platform, Python ABI) pair:

| Filename suffix                                                                  | Blender versions            |
| -------------------------------------------------------------------------------- | --------------------------- |
| `*-linux-x64-py3.11.zip` / `-windows-x64-py3.11.zip` / `-macos-arm64-py3.11.zip` | 4.2 LTS – 4.5 (Python 3.11) |
| `*-linux-x64-py3.13.zip` / `-windows-x64-py3.13.zip` / `-macos-arm64-py3.13.zip` | 5.x (Python 3.13)           |

## Installation

1. Download the zip that matches your OS and Blender Python ABI from
   the project's
   [GitHub releases](https://github.com/kmarchais/mmgpy/releases).
2. In Blender, go to **Edit > Preferences > Get Extensions**.
3. Click the dropdown menu (▼) at the top-right and select
   **Install from Disk…**.
4. Pick the downloaded `.zip` file. Confirm the version in
   **Add-ons → MMGpy** matches what you expected.

Each zip is ~150 MB — the bulk is VTK (60 MB), SciPy (40 MB), NumPy
(15 MB), and matplotlib (10 MB).

## Usage

### Basic remeshing

1. Select a mesh object in the 3D viewport.
2. Open the sidebar (`N` key) and switch to the **MMGpy** tab.
3. Pick a preset (or Custom), tweak the **Size Control** / **Geometry**
   sub-panels as needed.
4. Click **Remesh**.

### Local refinement zones

1. Expand **Local Refinement**.
2. Click **Add Sphere** or **Add Box** — an Empty is created at the
   active object's location.
3. Move / scale the Empty to position the zone. The Empty's
   `empty_display_size` is the radius / half-extent.
4. Set the per-zone **Target Size**.
5. Click **Remesh** — triangles inside each zone use the zone's target
   size; the rest follow the global parameters.

### Quality visualisation

1. With a mesh selected, open the **Visualization** sub-panel.
2. Toggle **Color by Quality**.
3. The active mesh shifts into Material Preview shading and triangles
   colour from red (poor in-radius ratio) to blue (excellent). The
   ColorRamp widget in the panel mirrors the shader exactly — drag
   stops to recolour live.
4. Switch **Range** to `Custom [min, max]` to pin the endpoints; useful
   when comparing two meshes that would otherwise auto-scale to
   different ranges.

Quality coloring requires the mesh to be all triangles (always the case
for a fresh remesh output).

### Presets

| Preset | Gradation   | Notes                                             |
| ------ | ----------- | ------------------------------------------------- |
| Fine   | `hgrad=1.2` | high quality, smaller elements, tight transitions |
| Medium | default     | balanced quality and performance                  |
| Coarse | `hgrad=1.5` | fast remeshing, larger elements                   |
| Custom | manual      | full control over every parameter                 |

## Tips

- Start with **Medium** and adjust from there.
- Lower **Hausdorff** preserves geometry better but raises element
  count.
- **Optimize Only** improves quality without changing topology — useful
  as a finishing pass.
- The estimated-triangle-count confirmation dialog at 1M elements is
  there to save you a Blender freeze (see TODOs below).

## Building from source

For most users the released zips are the right path. To build locally
against an unreleased mmgpy version (e.g. for testing on this branch),
the canonical pipeline lives in
[`.github/workflows/build-blender-extension.yml`](../.github/workflows/build-blender-extension.yml).
Roughly:

```bash
# 1. Build the mmgpy wheel into ./wheels (uses the project's local CMake)
uv build --wheel --out-dir blender_mmgpy/wheels

# 2. Fill in transitive deps for the target ABI + platform
cd blender_mmgpy
pip download mmgpy \
    --find-links wheels --dest wheels \
    --only-binary :all: \
    --python-version 3.13 \
    --platform win_amd64 --platform any   # adjust for your platform

# 3. Inject `wheels = [...]` into the manifest (see the CI workflow
#    for the snippet) and run Blender's extension builder
blender --command extension build --source-dir . --output-dir .
```

The `./build.sh` script in this directory wraps `bbext`
([blender-extension-builder](https://pypi.org/project/blender-extension-builder/)),
which is the upstream-recommended path — but `bbext`'s `pip download`
step fails for not-yet-published dev versions of mmgpy, so we use the
CI pipeline above for dev builds and reserve `bbext` for release
builds where the version is already on PyPI.

## Troubleshooting

### "mmgpy is not installed" in the Add-ons preferences box

The bundled wheels didn't match Blender's Python ABI. Make sure you
downloaded the `py3.11` zip for Blender 4.x and the `py3.13` zip for
Blender 5.x. If the version still looks wrong, the easiest fix is
**Disable → Re-enable** the add-on (forces a module reload).

### Slow remeshing on dense meshes

See the **TODOs / Known limitations** section below; the operator runs
synchronously and there's no progress reporting yet.

## TODOs / Known limitations

- **Long-running remeshes lock the UI.** The `mmgpy.remesh` operator
  runs synchronously on Blender's main thread, so a 1M-triangle remesh
  can lock the viewport for tens of seconds. mmgpy already exposes a
  progress callback API (the `progress=` kwarg + `ProgressEvent`
  stream); wiring it to Blender's `wm.progress_begin` /
  `progress_update` / `progress_end` (or a modal operator that polls
  on a `Timer`) would give a real progress bar. Not yet implemented.

- **Custom palette resets on every refresh.** When the colormap range
  or stats change, the ColorRamp is rebuilt from the canonical RdYlBu
  endpoints. Any colour edits the user made directly in the ramp
  widget are lost. Predictable beats clever for now — anyone wanting a
  permanent custom palette can fork the `MMGpy_Quality` material.

- **No unit tests for `blender_mmgpy/`.** The bpy-dependent code is
  hard to test without Blender installed; the pure helpers
  (`arrays_to_polydata`, `polydata_to_arrays`, `is_all_triangles`)
  could be split out and tested but haven't been yet.

- **Quality coloring is in-radius ratio only.** MMG itself exposes a
  single quality metric. PyVista's `cell_quality(quality_measure=…)`
  ships ~20 more (`scaled_jacobian`, `aspect_ratio`, `skew`, …) that
  could be surfaced as another panel dropdown without adding any
  dependency.

## License

GPL-3.0-or-later — the extension depends on MMG (LGPL/GPL) through
mmgpy, so the bundled binary is GPL-licensed. See the
[manifest](./blender_manifest.toml) and the SPDX headers on every
source file.

## Links

- [mmgpy on GitHub](https://github.com/kmarchais/mmgpy)
- [mmgpy Documentation](https://mmgpy.readthedocs.io)
- [MMG Project](https://www.mmgtools.org)
- [Blender Extensions documentation](https://docs.blender.org/manual/en/latest/extensions/)
