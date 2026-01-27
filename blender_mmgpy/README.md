# MMGpy Blender Extension

A Blender extension for powerful mesh remeshing using the [MMG library](https://www.mmgtools.org) through [mmgpy](https://github.com/kmarchais/mmgpy).

## Features

- **Easy Remeshing**: Remesh selected mesh objects directly in Blender
- **Presets**: Quick presets (Fine, Medium, Coarse) for common use cases
- **Size Control**: Precise control over min/max edge sizes
- **Geometry Preservation**: Hausdorff distance control for accurate surface approximation
- **Local Refinement**: Define spherical or box-shaped regions for finer mesh density
- **Full Undo Support**: All operations are undoable

## Requirements

- Blender 4.2 or later (uses the new Extensions system)
- The extension bundles mmgpy and all dependencies

## Installation

### From Pre-built Package (Recommended)

1. Download the appropriate package for your platform:
   - `mmgpy-x.x.x-windows-x64.zip` for Windows
   - `mmgpy-x.x.x-macos-arm64.zip` for macOS (Apple Silicon)
   - `mmgpy-x.x.x-linux-x64.zip` for Linux

2. In Blender, go to **Edit > Preferences > Get Extensions**

3. Click the dropdown menu (▼) and select **Install from Disk...**

4. Navigate to the downloaded `.zip` file and install

### Building from Source

If you need to build the extension yourself:

```bash
# Install blender-extension-builder
pip install blender-extension-builder

# Build for your current platform
cd blender_mmgpy
bbext -m blender_manifest.toml

# Or build for all platforms (creates separate packages)
bbext -m blender_manifest.toml --all-wheels --split-platforms
```

## Usage

### Basic Remeshing

1. Select a mesh object in Blender
2. Open the sidebar (N key) and go to the **MMGpy** tab
3. Choose a preset (Fine, Medium, Coarse) or use Custom
4. Click **Remesh**

### Size Control

Expand the **Size Control** section to adjust:

- **Uniform Size**: Set a constant edge size for the entire mesh
- **Min/Max Size**: Set bounds for adaptive sizing
- **Gradation**: Control how quickly element size changes

### Geometry Preservation

Expand the **Geometry** section to adjust:

- **Hausdorff Distance**: Maximum distance the remeshed surface can deviate from the original
- **Angle Detection**: Threshold angle for preserving sharp edges

### Local Refinement

Use local refinement to create finer mesh in specific areas:

1. Expand the **Local Refinement** section
2. Click **Add Sphere** or **Add Box** to create a refinement zone
3. Move/scale the created Empty object to position the zone
4. Set the **Target Size** for the zone
5. Remesh - the area inside the zone will have finer elements

## Presets

| Preset | Description                                              |
| ------ | -------------------------------------------------------- |
| Fine   | High quality, smaller elements, tight gradation (1.2)    |
| Medium | Balanced quality and performance                         |
| Coarse | Fast remeshing, larger elements, relaxed gradation (1.5) |
| Custom | Full manual control over all parameters                  |

## Tips

- Start with the **Medium** preset and adjust from there
- Lower **Hausdorff** values preserve geometry better but increase element count
- Use **Local Refinement** for areas that need more detail (e.g., around edges, holes)
- For quick quality improvement without changing topology, enable **Optimize Only**

## Troubleshooting

### "mmgpy is not installed" Error

The extension should include mmgpy bundled. If you see this error:

1. Make sure you installed the correct platform package
2. Try reinstalling the extension
3. Check the Blender console for detailed error messages

### Large File Sizes

Each platform-specific package is ~50-80MB due to bundled C++ libraries. This is normal.

### Slow Remeshing

- Reduce the mesh size before remeshing very dense meshes
- Use larger **Max Size** values for faster processing
- Enable **verbose** in advanced options to see progress

## License

MIT License - see the main mmgpy repository for details.

## Links

- [mmgpy on GitHub](https://github.com/kmarchais/mmgpy)
- [mmgpy Documentation](https://mmgpy.readthedocs.io)
- [MMG Project](https://www.mmgtools.org)
