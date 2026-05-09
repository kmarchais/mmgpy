#!/usr/bin/env python3
"""Generate level-set sol files for the implicit domain meshing examples.

Run once and commit the produced files into ``assets/``. The sol files
are Medit-format scalar fields whose zero level-set partitions the mesh
into two regions; ``mmg2d.remesh(ls=0)`` and ``mmgs.remesh(ls=0)`` then
discretize that interface.
"""

from __future__ import annotations

from pathlib import Path

import numpy as np
import pyvista as pv

import mmgpy  # noqa: F401  -- registers the Medit reader

ASSETS = Path(__file__).resolve().parent.parent / "assets"


def write_medit_sol(path: Path, dim: int, scalar: np.ndarray) -> None:
    """Write a Medit-format scalar sol (one value per vertex)."""
    lines = [
        "MeshVersionFormatted 2",
        "",
        f"Dimension {dim}",
        "",
        "SolAtVertices",
        str(len(scalar)),
        "1 1",
        "",
        *(f"{v}" for v in scalar),
        "",
        "End",
        "",
    ]
    path.write_text("\n".join(lines))


def make_multi_mat_levelset() -> None:
    """Signed distance to a circle on the 2D ``multi-mat`` rectangle.

    The mesh covers ``[-0.3, 1.0] x [0, 1]``. A circle of radius 0.3
    centered at ``(0.35, 0.5)`` sits inside the domain and produces a
    clean inside/outside partition.
    """
    mesh = pv.read(ASSETS / "multi-mat.mesh")
    pts = np.asarray(mesh.points)[:, :2]
    center = np.array([0.35, 0.5])
    radius = 0.3
    sol = np.linalg.norm(pts - center, axis=1) - radius

    out = ASSETS / "multi-mat-ls.sol"
    write_medit_sol(out, dim=2, scalar=sol)
    rel = out.relative_to(ASSETS.parent)
    print(f"wrote {rel}: range [{sol.min():.3f}, {sol.max():.3f}]")


def make_cube_levelset() -> None:
    """Signed distance to a sphere inside the 3D unit ``cube``.

    The mesh covers ``[0, 1]^3``. A sphere of radius 0.3 centered at
    ``(0.5, 0.5, 0.5)`` sits strictly inside the domain and gives mmg3d
    a clean inside/outside partition for ``iso=1`` remeshing.
    """
    mesh = pv.read(ASSETS / "cube.mesh")
    pts = np.asarray(mesh.points)
    center = np.array([0.5, 0.5, 0.5])
    radius = 0.3
    sol = np.linalg.norm(pts - center, axis=1) - radius

    out = ASSETS / "cube-ls.sol"
    write_medit_sol(out, dim=3, scalar=sol)
    rel = out.relative_to(ASSETS.parent)
    print(f"wrote {rel}: range [{sol.min():.3f}, {sol.max():.3f}]")


def make_teapot_levelset() -> None:
    """Plane level-set for the 3D ``teapot`` surface.

    The teapot bounds are roughly ``[-3.0, 3.4] x [-2, 2] x [0, 3.15]``.
    A horizontal plane at ``z = 1.5`` splits the surface into a lower
    region (body + spout) and an upper region (lid + handle top), giving
    mmgs a well-formed interface to discretize.
    """
    mesh = pv.read(ASSETS / "teapot.mesh")
    pts = np.asarray(mesh.points)
    sol = pts[:, 2] - 1.5

    out = ASSETS / "teapot-ls.sol"
    write_medit_sol(out, dim=3, scalar=sol)
    rel = out.relative_to(ASSETS.parent)
    print(f"wrote {rel}: range [{sol.min():.3f}, {sol.max():.3f}]")


if __name__ == "__main__":
    make_multi_mat_levelset()
    make_cube_levelset()
    make_teapot_levelset()
