"""tqdm progress bar examples for mmgpy remeshing.

Usage:
    uv run python examples/progress_tqdm.py
"""

from __future__ import annotations

import sys
from pathlib import Path
from typing import Any

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


def remesh_with_two_bars(mesh: MmgMesh3D, **kwargs: Any) -> dict:
    """Show a main bar and a secondary bar per phase."""
    n_callbacks = 0
    total_ops = 0
    active_phase: int | None = None
    sub_bar: tqdm[None] | None = None

    main_bar: tqdm[None] = tqdm(
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
        nonlocal n_callbacks, total_ops, active_phase, sub_bar
        n_callbacks += 1
        total_ops += n_split + n_collapse + n_swap + n_move
        name = PHASE_NAMES.get(phase, f"Phase {phase}")

        pct = 100.0 * (1.0 - 1.0 / (n_callbacks + 1))
        main_bar.n = pct
        main_bar.set_postfix_str(f"{name}, {total_ops:,} ops")
        main_bar.display()

        if active_phase != phase:
            if sub_bar is not None:
                sub_bar.n = sub_bar.total
                sub_bar.display()
                sub_bar.close()
            sub_bar = tqdm(
                total=max_iterations,
                desc=f"  {name}",
                unit="iter",
                leave=False,
                position=1,
                file=sys.stderr,
                dynamic_ncols=True,
            )
            active_phase = phase
        else:
            assert sub_bar is not None
            sub_bar.total = max_iterations

        assert sub_bar is not None
        sub_bar.n = iteration + 1
        sub_bar.set_postfix_str(
            f"split={n_split} col={n_collapse} swap={n_swap} move={n_move}",
        )
        sub_bar.display()
        sys.stderr.flush()
        return True

    try:
        result = mesh.remesh(**kwargs, _progress_callback=on_progress)
    finally:
        if sub_bar is not None:
            sub_bar.n = sub_bar.total
            sub_bar.display()
            sub_bar.close()
        main_bar.n = 100
        main_bar.set_postfix_str(f"done, {total_ops:,} total ops")
        main_bar.display()
        main_bar.close()

    return result


def remesh_with_single_bar(mesh: MmgMesh3D, **kwargs: Any) -> dict:
    """Show a single cumulative progress bar."""
    n_callbacks = 0
    total_ops = 0

    bar: tqdm[None] = tqdm(
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
        nonlocal n_callbacks, total_ops
        n_callbacks += 1
        total_ops += n_split + n_collapse + n_swap + n_move
        name = PHASE_NAMES.get(phase, f"Phase {phase}")

        pct = 100.0 * (1.0 - 1.0 / (n_callbacks + 1))
        bar.n = pct
        bar.set_postfix_str(
            f"{name} {iteration + 1}/{max_iterations}, {total_ops:,} ops",
        )
        bar.display()
        sys.stderr.flush()
        return True

    try:
        result = mesh.remesh(**kwargs, _progress_callback=on_progress)
    finally:
        bar.n = 100
        bar.set_postfix_str(f"done, {total_ops:,} ops")
        bar.display()
        bar.close()

    return result


if __name__ == "__main__":
    mesh_path = ASSETS / "linkrods.mesh"

    print("\n=== Example 1: Two-level bars ===")
    mesh = MmgMesh3D(str(mesh_path))
    r = remesh_with_two_bars(mesh, hmax=0.05, verbose=-1)
    vb, va = r["vertices_before"], r["vertices_after"]
    print(f"\n  vertices: {vb} \u2192 {va}")

    print("\n=== Example 2: Single bar ===")
    mesh2 = MmgMesh3D(str(mesh_path))
    r2 = remesh_with_single_bar(mesh2, hmax=0.05, verbose=-1)
    vb2, va2 = r2["vertices_before"], r2["vertices_after"]
    print(f"\n  vertices: {vb2} \u2192 {va2}")
