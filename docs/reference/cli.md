# CLI Tools

Installing mmgpy gives you access to the MMG command-line executables:

| Command    | Description       |
| ---------- | ----------------- |
| `mmg2d_O3` | 2D remeshing      |
| `mmg3d_O3` | 3D remeshing      |
| `mmgs_O3`  | Surface remeshing |

## Installation

The executables are included with mmgpy:

```bash
pip install mmgpy
```

If you only need the CLI tools (no Python API):

```bash
uv tool install mmgpy
```

## Quick Examples

```text
mmg3d_O3 input.mesh -o output.mesh -hmax 0.1
mmgs_O3 surface.stl -o refined.mesh -hausd 0.001
mmg2d_O3 domain.mesh -o refined.mesh -hmax 0.05
```

## Documentation

For complete documentation on MMG command-line options, parameters, and usage, refer to the official MMG documentation:

- [MMG Official Documentation](https://www.mmgtools.org/mmg-remesher-downloads/mmg-remesher-documentation)
- [MMG GitHub Wiki](https://github.com/MmgTools/mmg/wiki)
- [MMG Tutorials](https://www.mmgtools.org/mmg-remesher-try-mmg/mmg-remesher-tutorials)

## Troubleshooting

On macOS and Linux, if the executables fail to find libraries:

```bash
fix-mmg-rpath
```
