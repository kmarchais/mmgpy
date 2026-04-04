"""tqdm progress bar example for mmgpy remeshing.

Demonstrates iteration-level progress with tqdm, with two styles:
  1. Two nested bars (phase + iteration)
  2. A single bar that updates with each callback

Usage:
    uv run python examples/progress_tqdm.py
"""

from __future__ import annotations

import numpy as np
from tqdm import tqdm

from mmgpy._mmgpy import (
    MMG5_PHASE_ADAPTATION,
    MMG5_PHASE_OPTIMIZATION,
    MmgMesh3D,
)

PHASE_NAMES = {
    MMG5_PHASE_ADAPTATION: "Adaptation",
    MMG5_PHASE_OPTIMIZATION: "Optimization",
}


def make_cube_mesh() -> MmgMesh3D:
    """Create a simple cube mesh for testing."""
    vertices = np.array(
        [
            [0, 0, 0],
            [1, 0, 0],
            [1, 1, 0],
            [0, 1, 0],
            [0, 0, 1],
            [1, 0, 1],
            [1, 1, 1],
            [0, 1, 1],
            [0.5, 0.5, 0.5],
        ],
        dtype=np.float64,
    )
    elements = np.array(
        [
            [0, 1, 2, 8],
            [0, 2, 3, 8],
            [0, 1, 5, 8],
            [1, 5, 6, 8],
            [1, 2, 6, 8],
            [2, 3, 7, 8],
            [2, 6, 7, 8],
            [0, 3, 7, 8],
            [0, 4, 5, 8],
            [0, 4, 7, 8],
            [4, 5, 6, 8],
            [4, 6, 7, 8],
        ],
        dtype=np.int32,
    )
    return MmgMesh3D(vertices, elements)


def remesh_with_tqdm_bars(mesh: MmgMesh3D, **kwargs: float | bool) -> dict:
    """Remesh with per-phase tqdm bars."""
    bars: dict[int, tqdm] = {}

    def on_progress(
        phase: int,
        iteration: int,
        max_iterations: int,
        n_split: int,
        n_collapse: int,
        n_swap: int,
        n_move: int,
    ) -> bool:
        name = PHASE_NAMES.get(phase, f"Phase {phase}")

        if phase not in bars:
            bars[phase] = tqdm(
                total=max_iterations,
                desc=name,
                unit="iter",
                leave=True,
            )

        bar = bars[phase]
        bar.total = max_iterations
        bar.n = iteration + 1
        bar.set_postfix(
            split=n_split,
            collapse=n_collapse,
            swap=n_swap,
            move=n_move,
            refresh=False,
        )
        bar.refresh()
        return True

    try:
        result = mesh.remesh(**kwargs, _progress_callback=on_progress)
    finally:
        for bar in bars.values():
            bar.close()

    return result


def remesh_with_single_tqdm(mesh: MmgMesh3D, **kwargs: float | bool) -> dict:
    """Remesh with a single tqdm bar counting total iterations."""
    bar = tqdm(desc="Remeshing", unit="iter", leave=True)

    def on_progress(
        phase: int,
        iteration: int,
        max_iterations: int,
        n_split: int,
        n_collapse: int,
        n_swap: int,
        n_move: int,
    ) -> bool:
        name = PHASE_NAMES.get(phase, f"Phase {phase}")
        bar.set_description(f"{name} [{iteration + 1}/{max_iterations}]")
        ops = n_split + n_collapse + n_swap + n_move
        bar.set_postfix(ops=ops, refresh=False)
        bar.update(1)
        return True

    try:
        result = mesh.remesh(**kwargs, _progress_callback=on_progress)
    finally:
        bar.close()

    return result


if __name__ == "__main__":
    print("\n=== Example 1: Per-phase tqdm bars ===\n")
    mesh = make_cube_mesh()
    result = remesh_with_tqdm_bars(mesh, hmax=0.1, verbose=False)
    print(f"\n  vertices: {result['vertices_before']} → {result['vertices_after']}")

    print("\n=== Example 2: Single tqdm bar ===\n")
    mesh2 = make_cube_mesh()
    result2 = remesh_with_single_tqdm(mesh2, hmax=0.1, verbose=False)
    print(f"\n  vertices: {result2['vertices_before']} → {result2['vertices_after']}")
