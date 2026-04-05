"""tqdm progress bar examples for mmgpy remeshing.

Usage:
    uv run python examples/progress_tqdm.py
"""

from __future__ import annotations

import sys
from pathlib import Path

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

ASSETS = Path(__file__).resolve().parent.parent / "assets"


def remesh_with_two_bars(mesh: MmgMesh3D, **kwargs: float | int | bool) -> dict:
    """Main bar (overall) + secondary bar (per-phase iterations)."""
    state = {"n": 0, "ops": 0, "phase": None, "sub": None}

    main_bar = tqdm(
        total=100,
        desc="Remeshing",
        unit="%",
        leave=True,
        position=0,
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
        main_bar.n = pct
        main_bar.set_postfix_str(f"{name}, {state['ops']:,} ops")
        main_bar.display()

        if state["phase"] != phase:
            if state["sub"] is not None:
                state["sub"].n = state["sub"].total
                state["sub"].display()
                state["sub"].close()
            state["sub"] = tqdm(
                total=max_iterations,
                desc=f"  {name}",
                unit="iter",
                leave=False,
                position=1,
                file=sys.stderr,
                dynamic_ncols=True,
            )
            state["phase"] = phase
        else:
            state["sub"].total = max_iterations

        sub = state["sub"]
        sub.n = iteration + 1
        sub.set_postfix_str(
            f"split={n_split} col={n_collapse} swap={n_swap} move={n_move}",
        )
        sub.display()
        sys.stderr.flush()
        return True

    try:
        result = mesh.remesh(**kwargs, _progress_callback=on_progress)
    finally:
        if state["sub"] is not None:
            state["sub"].n = state["sub"].total
            state["sub"].display()
            state["sub"].close()
        main_bar.n = 100
        main_bar.set_postfix_str(f"done, {state['ops']:,} total ops")
        main_bar.display()
        main_bar.close()

    return result


def remesh_with_single_bar(mesh: MmgMesh3D, **kwargs: float | int | bool) -> dict:
    """Single cumulative progress bar."""
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
        bar.set_postfix_str(
            f"{name} {iteration + 1}/{max_iterations}, {state['ops']:,} ops",
        )
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
    mesh_path = ASSETS / "linkrods.mesh"

    print(f"\n=== Example 1: Two-level bars (main + secondary) ===\n")
    mesh = MmgMesh3D(str(mesh_path))
    result = remesh_with_two_bars(mesh, hmax=0.05, verbose=-1)
    print(f"\n  vertices: {result['vertices_before']} \u2192 {result['vertices_after']}")

    print(f"\n=== Example 2: Single bar ===\n")
    mesh2 = MmgMesh3D(str(mesh_path))
    result2 = remesh_with_single_bar(mesh2, hmax=0.05, verbose=-1)
    print(f"\n  vertices: {result2['vertices_before']} \u2192 {result2['vertices_after']}")
