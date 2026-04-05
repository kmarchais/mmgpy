"""tqdm progress bar example for mmgpy remeshing.

Demonstrates iteration-level progress with tqdm:
  1. Per-phase bars (one bar at a time, disappears on phase change)
  2. A single bar showing overall progress

Usage:
    uv run python examples/progress_tqdm.py
"""

from __future__ import annotations

import sys

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


def remesh_with_tqdm_bars(mesh: MmgMesh3D, **kwargs: float | int | bool) -> dict:
    """Remesh with per-phase tqdm bars (one visible at a time)."""
    bar: tqdm | None = None
    active_phase: int | None = None
    total_ops = 0

    def on_progress(
        phase: int,
        iteration: int,
        max_iterations: int,
        n_split: int,
        n_collapse: int,
        n_swap: int,
        n_move: int,
    ) -> bool:
        nonlocal bar, active_phase, total_ops
        total_ops += n_split + n_collapse + n_swap + n_move
        name = PHASE_NAMES.get(phase, f"Phase {phase}")

        # Phase changed: close old bar (leave=False hides it), open new one
        if active_phase != phase:
            if bar is not None:
                bar.n = bar.total  # force 100%
                bar.display()
                bar.close()
            bar = tqdm(
                total=max_iterations,
                desc=f"{name:<14s}",
                unit="iter",
                leave=False,
                file=sys.stderr,
                dynamic_ncols=True,
            )
            active_phase = phase

        bar.n = iteration + 1
        bar.set_postfix_str(
            f"split={n_split} col={n_collapse} swap={n_swap} move={n_move}",
        )
        bar.display()
        sys.stderr.flush()
        return True

    try:
        result = mesh.remesh(**kwargs, _progress_callback=on_progress)
    finally:
        if bar is not None:
            bar.n = bar.total
            bar.leave = True  # keep the final bar visible
            bar.set_postfix_str(f"done, {total_ops:,} total ops")
            bar.display()
            bar.close()

    return result


def remesh_with_single_tqdm(mesh: MmgMesh3D, **kwargs: float | int | bool) -> dict:
    """Remesh with a single tqdm bar showing overall progress."""
    state = {"n": 0, "ops": 0}

    bar = tqdm(
        total=100,
        desc="Remeshing",
        unit="%",
        leave=True,
        file=sys.stderr,
        bar_format="{l_bar}{bar}| {n:.0f}% [{elapsed}, {postfix}]",
    )

    def on_progress(
        phase: int,
        iteration: int,
        max_iterations: int,
        n_split: int,
        n_collapse: int,
        n_swap: int,
        n_move: int,
    ) -> bool:
        state["n"] += 1
        state["ops"] += n_split + n_collapse + n_swap + n_move
        name = PHASE_NAMES.get(phase, f"Phase {phase}")

        pct = 100.0 * (1.0 - 1.0 / (state["n"] + 1))
        bar.n = pct
        bar.set_postfix_str(f"{name} {iteration + 1}/{max_iterations}, {state['ops']:,} ops")
        bar.display()
        sys.stderr.flush()
        return True

    try:
        result = mesh.remesh(**kwargs, _progress_callback=on_progress)
    finally:
        bar.n = 100
        bar.set_postfix_str(f"done, {state['ops']:,} ops")
        bar.display()
        bar.close()

    return result


if __name__ == "__main__":
    # Use hmax=0.03 so remeshing takes a few seconds and progress is visible
    hmax = 0.03

    print(f"\n=== Example 1: Per-phase tqdm bars  (hmax={hmax}) ===\n")
    mesh = make_cube_mesh()
    result = remesh_with_tqdm_bars(mesh, hmax=hmax, verbose=-1)
    print(f"\n  vertices: {result['vertices_before']} → {result['vertices_after']}")

    print(f"\n=== Example 2: Single tqdm bar  (hmax={hmax}) ===\n")
    mesh2 = make_cube_mesh()
    result2 = remesh_with_single_tqdm(mesh2, hmax=hmax, verbose=-1)
    print(f"\n  vertices: {result2['vertices_before']} → {result2['vertices_after']}")
