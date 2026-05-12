# /// script
# requires-python = ">=3.9"
# dependencies = [
#     "mmgpy",
#     "numpy",
#     "pyvista",
# ]
#
# [tool.uv.sources]
# mmgpy = { path = "../.." }
# ///
"""Multi-material level-set discretization with custom output references.

Demonstrates ``dataset.mmg.set_multi_materials(...)`` on the PyVista
accessor: the level-set defines a sphere inside a unit cube, and the
multi-material configuration assigns custom references on each side of
the interface instead of MMG's default ``ref=2`` / ``ref=3``.

Pipeline:

1. Build a dense tetrahedral background mesh of the unit cube.
2. Define a sphere signed distance field at every vertex.
3. Configure multi-material output references via
   ``dataset.mmg.set_multi_materials(...)``: ``ref_minus`` for elements
   inside the sphere, ``ref_plus`` for elements outside.
4. Run ``dataset.mmg.remesh_levelset(...)``.

Run with::

    uv run python examples/mmg3d/multi_material_levelset.py
"""

from __future__ import annotations

import numpy as np
import pyvista as pv

import mmgpy  # noqa: F401  -- registers the .mmg accessor

# Custom output references picked far from MMG's defaults (2, 3) so the
# effect of set_multi_materials() is unambiguous in the output.
REF_INTERIOR = 42
REF_EXTERIOR = 17


def background_mesh(resolution: int = 8) -> pv.UnstructuredGrid:
    """Dense tetrahedralization of the unit cube via Delaunay on a regular grid."""
    x = np.linspace(0.0, 1.0, resolution)
    grid = np.stack(np.meshgrid(x, x, x, indexing="ij"), axis=-1).reshape(-1, 3)
    return pv.PolyData(grid).delaunay_3d()


def sphere_sdf(
    vertices: np.ndarray,
    center: tuple[float, float, float],
    radius: float,
) -> np.ndarray:
    """Signed-distance to a sphere; negative inside, positive outside."""
    return (np.linalg.norm(vertices - np.asarray(center), axis=1) - radius).reshape(
        -1,
        1,
    )


def main() -> None:
    """Run the multi-material level-set discretization demo."""
    print("Building background mesh...")
    dataset = background_mesh(resolution=10)
    print(f"  {dataset.n_points} vertices, {dataset.n_cells} tetrahedra")

    vertices = np.asarray(dataset.points, dtype=np.float64)
    levelset = sphere_sdf(vertices, center=(0.5, 0.5, 0.5), radius=0.3)

    # MMG's default behavior assigns ref=2 (exterior) and ref=3 (interior)
    # to elements on either side of the zero isosurface. ``set_multi_materials``
    # lets us pick the output references instead — useful when downstream
    # code already encodes materials with specific reference numbers.
    print(
        "\nConfiguring multi-material output: "
        f"ref_minus={REF_INTERIOR} (inside sphere), "
        f"ref_plus={REF_EXTERIOR} (outside sphere)",
    )
    dataset.mmg.set_multi_materials(
        [
            {
                "ref": 0,  # the input ref to split
                "split": True,
                "ref_minus": REF_INTERIOR,
                "ref_plus": REF_EXTERIOR,
            },
        ],
    )

    print("\nRunning level-set discretization...")
    result = dataset.mmg.remesh_levelset(
        levelset,
        ls=0.0,
        hmax=0.08,
        hausd=0.005,
        hgrad=1.3,
        verbose=False,
    )

    refs = np.asarray(result.cell_data["refs"])
    unique, counts = np.unique(refs, return_counts=True)
    counts_by_ref = dict(zip(unique.tolist(), counts.tolist(), strict=True))
    print(f"\nOutput element refs: {counts_by_ref}")
    if REF_INTERIOR not in unique or REF_EXTERIOR not in unique:
        msg = (
            f"expected custom refs {REF_INTERIOR}/{REF_EXTERIOR} in output, "
            f"got {sorted(unique.tolist())}"
        )
        raise RuntimeError(msg)

    pl = pv.Plotter(shape=(1, 2), window_size=(1400, 700))

    pl.subplot(0, 0)
    interior = result.extract_cells(np.where(refs == REF_INTERIOR)[0])
    pl.add_mesh(
        interior,
        show_edges=True,
        color="coral",
        edge_color="darkred",
        line_width=0.4,
    )
    pl.add_title(f"Interior (ref={REF_INTERIOR})\n{interior.n_cells} tetrahedra")

    pl.subplot(0, 1)
    centers = result.cell_centers().points
    half = result.extract_cells(np.where(centers[:, 0] < 0.5)[0])
    pl.add_mesh(
        half,
        scalars="refs",
        show_edges=True,
        cmap=["coral", "steelblue"],
        edge_color="black",
        line_width=0.4,
    )
    pl.add_title(f"Cut view by ref\n{half.n_cells} tetrahedra")

    pl.link_views()
    pl.camera_position = [(2.5, 2.0, 1.6), (0.5, 0.5, 0.5), (0, 0, 1)]
    pl.show()


if __name__ == "__main__":
    main()
