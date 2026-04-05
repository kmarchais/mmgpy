"""Rich progress bar example for mmgpy remeshing.

Demonstrates a two-level progress display:
  - One bar per remeshing phase (Adaptation, Optimization)
  - Per-iteration operation counts shown as status text

Usage:
    uv run python examples/progress_rich.py
"""

from __future__ import annotations

import numpy as np
from rich.progress import (
    BarColumn,
    Progress,
    SpinnerColumn,
    TextColumn,
    TimeElapsedColumn,
)

from mmgpy._mmgpy import (
    MMG5_PHASE_ADAPTATION,
    MMG5_PHASE_OPTIMIZATION,
    MmgMesh3D,
)

PHASE_NAMES = {
    MMG5_PHASE_ADAPTATION: "Adaptation",
    MMG5_PHASE_OPTIMIZATION: "Optimization",
}


def _cube_arrays() -> tuple[np.ndarray, np.ndarray]:
    """Return (vertices, elements) arrays for a simple cube mesh."""
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
    return vertices, elements


def make_cube_mesh() -> MmgMesh3D:
    """Create a simple cube mesh with a center vertex for testing."""
    vertices, elements = _cube_arrays()
    return MmgMesh3D(vertices, elements)


def remesh_with_rich_progress(mesh: MmgMesh3D, **kwargs: float | bool) -> dict:
    """Remesh with a two-level Rich progress display.

    - Main bar: overall remeshing progress (stays visible at the end).
    - Secondary bar: iteration detail for the current phase (disappears
      when the phase changes or remeshing completes).
    """
    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        BarColumn(),
        TextColumn("{task.fields[status]}"),
        TimeElapsedColumn(),
    ) as progress:
        n_callbacks = 0
        total_ops = 0
        peak = 0.0
        main_task = progress.add_task(
            "[bold cyan]Remeshing",
            total=1.0,
            status="",
        )
        sub_task: int | None = None
        active_phase: int | None = None

        def on_progress(
            phase: int,
            iteration: int,
            max_iterations: int,
            n_split: int,
            n_collapse: int,
            n_swap: int,
            n_move: int,
        ) -> bool:
            nonlocal active_phase, sub_task, n_callbacks, total_ops, peak
            n_callbacks += 1
            total_ops += n_split + n_collapse + n_swap + n_move
            name = PHASE_NAMES.get(phase, f"Phase {phase}")

            # --- Main bar: monotonically increasing ---
            peak = max(peak, 1.0 - 1.0 / (n_callbacks + 1))
            progress.update(
                main_task,
                completed=peak,
                status=f"{name} | {total_ops:,} ops",
            )

            # --- Secondary bar: one per phase, hidden on phase change ---
            if active_phase != phase:
                # Hide previous secondary bar
                if sub_task is not None:
                    progress.update(sub_task, visible=False)
                # Create new secondary bar for this phase
                sub_task = progress.add_task(
                    f"  [dim]{name}",
                    total=max_iterations,
                    status="",
                )
                active_phase = phase
            else:
                # Phase may restart with a different max_iterations
                progress.update(sub_task, total=max_iterations)

            ops = (
                f"split={n_split}  collapse={n_collapse}  swap={n_swap}  move={n_move}"
            )
            progress.update(sub_task, completed=iteration + 1, status=ops)
            return True

        result = mesh.remesh(**kwargs, _progress_callback=on_progress)

        # Hide secondary bar, complete main bar
        if sub_task is not None:
            progress.update(sub_task, visible=False)
        progress.update(
            main_task,
            completed=1.0,
            status=f"[green]✓ {total_ops:,} total operations",
        )

    return result


def remesh_with_single_bar(mesh: MmgMesh3D, **kwargs: float | bool) -> dict:
    """Remesh with a single cumulative progress bar."""
    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        BarColumn(),
        TextColumn("{task.fields[status]}"),
        TimeElapsedColumn(),
    ) as progress:
        task = progress.add_task("[cyan]Remeshing", total=1.0, status="starting...")
        total_ops = 0
        n_callbacks = 0
        peak = 0.0  # monotonically increasing progress

        def on_progress(
            phase: int,
            iteration: int,
            max_iterations: int,
            n_split: int,
            n_collapse: int,
            n_swap: int,
            n_move: int,
        ) -> bool:
            nonlocal total_ops, n_callbacks, peak
            total_ops += n_split + n_collapse + n_swap + n_move
            n_callbacks += 1
            name = PHASE_NAMES.get(phase, f"Phase {phase}")

            # Simple monotonic progress: each callback advances by a small
            # step.  We don't know the total count upfront, so we use
            # 1 - 1/(n+1) which approaches 1.0 asymptotically.
            frac = 1.0 - 1.0 / (n_callbacks + 1)
            peak = max(peak, frac)

            status = (
                f"{name} iter {iteration + 1}/{max_iterations} "
                f"| {total_ops:,} total ops"
            )
            progress.update(task, completed=peak, status=status)
            return True

        result = mesh.remesh(**kwargs, _progress_callback=on_progress)
        progress.update(
            task,
            completed=1.0,
            status=f"[green]✓ {total_ops:,} total operations",
        )

    return result


if __name__ == "__main__":
    from rich.console import Console

    from mmgpy import Mesh

    console = Console()

    # Use hmax=0.03 so remeshing takes a few seconds and progress is visible
    hmax = 0.03

    # --- Example 1: Just pass progress=True (the default!) ---
    console.print(
        f"\n[bold]Example 1: mesh.remesh(hmax={hmax}, progress=True)[/bold]\n",
    )
    mesh = Mesh(*_cube_arrays())
    result = mesh.remesh(hmax=hmax)  # progress=True is the default
    console.print(
        f"  vertices: {result.vertices_before} → {result.vertices_after}\n",
    )

    # --- Example 2: Two-level bars (main + secondary) ---
    console.print(
        f"[bold]Example 2: Two-level bars  hmax={hmax}[/bold]\n",
    )
    mesh2 = make_cube_mesh()
    result2 = remesh_with_rich_progress(mesh2, hmax=hmax, verbose=False)
    console.print(
        f"  vertices: {result2['vertices_before']} → {result2['vertices_after']}\n",
    )

    # --- Example 3: Single cumulative bar ---
    console.print(
        f"[bold]Example 3: Single cumulative bar  hmax={hmax}[/bold]\n",
    )
    mesh3 = make_cube_mesh()
    result3 = remesh_with_single_bar(mesh3, hmax=hmax, verbose=False)
    console.print(
        f"  vertices: {result3['vertices_before']} → {result3['vertices_after']}\n",
    )
