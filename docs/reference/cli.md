# CLI Tools

Installing mmgpy gives you access to the MMG command-line executables:

| Command              | Description                      |
| -------------------- | -------------------------------- |
| `mmg`                | Auto-detect mesh type and remesh |
| `mmg2d` / `mmg2d_O3` | 2D remeshing                     |
| `mmg3d` / `mmg3d_O3` | 3D remeshing                     |
| `mmgs` / `mmgs_O3`   | Surface remeshing                |

## Installation

The executables are included with mmgpy:

```bash
pip install mmgpy
```

If you only need the CLI tools (no Python API):

```bash
uv tool install mmgpy
```

## Unified `mmg` Command

The `mmg` command automatically detects the mesh type and delegates to the appropriate executable:

```bash
mmg input.mesh -o output.mesh -hmax 0.1
```

This is equivalent to running `mmg3d`, `mmg2d`, or `mmgs` depending on the input mesh:

- **Tetrahedra** → `mmg3d`
- **2D triangles** (z ≈ 0) → `mmg2d`
- **3D surface triangles** → `mmgs`

### Version Information

```bash
mmg --version
# mmgpy 0.4.0
# MMG   5.8.0

mmg --help
```

## Quick Examples

```bash
# Auto-detect mesh type
mmg input.mesh -o output.mesh -hmax 0.1

# Specific commands (with or without _O3 suffix)
mmg3d input.mesh -o output.mesh -hmax 0.1
mmg3d_O3 input.mesh -o output.mesh -hmax 0.1  # Same as above

mmgs surface.stl -o refined.mesh -hausd 0.001
mmg2d domain.mesh -o refined.mesh -hmax 0.05
```

## Documentation

For complete documentation on MMG command-line options, parameters, and usage, refer to the official MMG documentation:

- [MMG Official Documentation](https://www.mmgtools.org/mmg-remesher-downloads/mmg-remesher-documentation)
- [MMG GitHub Wiki](https://github.com/MmgTools/mmg/wiki)
- [MMG Tutorials](https://www.mmgtools.org/mmg-remesher-try-mmg/mmg-remesher-tutorials)

## Troubleshooting

RPATH issues on macOS and Linux are automatically fixed when you `import mmgpy`. If executables still fail to find libraries, ensure you've imported mmgpy at least once in your Python environment.
