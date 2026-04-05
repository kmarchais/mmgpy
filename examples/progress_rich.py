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
    MofNCompleteColumn,
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


def make_cube_mesh() -> MmgMesh3D:
    """Create a simple cube mesh with a center vertex for testing."""
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


def remesh_with_rich_progress(mesh: MmgMesh3D, **kwargs: float | bool) -> dict:
    """Remesh with a Rich two-level progress display."""
    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        BarColumn(),
        MofNCompleteColumn(),
        TimeElapsedColumn(),
        TextColumn("{task.fields[status]}"),
    ) as progress:
        tasks: dict[int, int] = {}  # phase -> task_id

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

            if phase not in tasks:
                task_id = progress.add_task(
                    f"[cyan]{name}",
                    total=max_iterations,
                    status="",
                )
                tasks[phase] = task_id
            else:
                task_id = tasks[phase]
                # Update total if max_iterations changed between calls
                progress.update(task_id, total=max_iterations)

            ops = f"split={n_split} collapse={n_collapse} swap={n_swap} move={n_move}"
            progress.update(task_id, completed=iteration + 1, status=ops)
            return True  # continue

        result = mesh.remesh(**kwargs, _progress_callback=on_progress)

        # Mark all tasks as fully complete
        for task_id in tasks.values():
            t = progress.tasks[task_id]
            progress.update(task_id, completed=t.total, status="[green]✓")

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

        def on_progress(
            phase: int,
            iteration: int,
            max_iterations: int,
            n_split: int,
            n_collapse: int,
            n_swap: int,
            n_move: int,
        ) -> bool:
            nonlocal total_ops
            total_ops += n_split + n_collapse + n_swap + n_move
            name = PHASE_NAMES.get(phase, f"Phase {phase}")

            # Estimate overall progress: adaptation is ~70% of work,
            # optimization is ~30%
            if phase == MMG5_PHASE_ADAPTATION:
                frac = 0.7 * (iteration + 1) / max(max_iterations, 1)
            else:
                frac = 0.7 + 0.3 * (iteration + 1) / max(max_iterations, 1)

            status = (
                f"{name} iter {iteration + 1}/{max_iterations} "
                f"| {total_ops:,} total ops"
            )
            progress.update(task, completed=frac, status=status)
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

    console = Console()

    # Use hmax=0.03 so remeshing takes a few seconds and progress is visible
    hmax = 0.03

    mesh = make_cube_mesh()
    console.print(
        f"\n[bold]Example 1: Two-level progress (one bar per phase)"
        f"  hmax={hmax}[/bold]\n",
    )
    result = remesh_with_rich_progress(mesh, hmax=hmax, verbose=False)
    console.print(
        f"  vertices: {result['vertices_before']} → {result['vertices_after']}\n",
    )

    mesh2 = make_cube_mesh()
    console.print(
        f"[bold]Example 2: Single cumulative progress bar  hmax={hmax}[/bold]\n",
    )
    result2 = remesh_with_single_bar(mesh2, hmax=hmax, verbose=False)
    console.print(
        f"  vertices: {result2['vertices_before']} → {result2['vertices_after']}\n",
    )
