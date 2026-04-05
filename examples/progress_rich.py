"""Rich progress bar examples for mmgpy remeshing.

Usage:
    uv run python examples/progress_rich.py
"""

from __future__ import annotations

from pathlib import Path

from rich.console import Console
from rich.progress import (
    BarColumn,
    Progress,
    SpinnerColumn,
    TextColumn,
    TimeElapsedColumn,
)

from mmgpy import Mesh
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


def remesh_with_two_bars(mesh: MmgMesh3D, **kwargs: float | bool) -> dict:
    """Show a main bar and a secondary bar per phase."""
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
        main_task = progress.add_task("[bold cyan]Remeshing", total=1.0, status="")
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

            peak = max(peak, 1.0 - 1.0 / (n_callbacks + 1))
            progress.update(
                main_task,
                completed=peak,
                status=f"{name} | {total_ops:,} ops",
            )

            if active_phase != phase:
                if sub_task is not None:
                    progress.update(sub_task, visible=False)
                sub_task = progress.add_task(
                    f"  [dim]{name}",
                    total=max_iterations,
                    status="",
                )
                active_phase = phase
            else:
                progress.update(sub_task, total=max_iterations)

            ops = (
                f"split={n_split}  collapse={n_collapse}  swap={n_swap}  move={n_move}"
            )
            progress.update(sub_task, completed=iteration + 1, status=ops)
            return True

        result = mesh.remesh(**kwargs, _progress_callback=on_progress)

        if sub_task is not None:
            progress.update(sub_task, visible=False)
        progress.update(
            main_task,
            completed=1.0,
            status=f"[green]\u2713 {total_ops:,} total operations",
        )

    return result


def remesh_with_single_bar(mesh: MmgMesh3D, **kwargs: float | bool) -> dict:
    """Single cumulative progress bar."""
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
        peak = 0.0

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

            peak = max(peak, 1.0 - 1.0 / (n_callbacks + 1))
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
            status=f"[green]\u2713 {total_ops:,} total operations",
        )

    return result


if __name__ == "__main__":
    console = Console()
    mesh_path = ASSETS / "linkrods.mesh"

    # --- Example 1: Just use progress=True (the default!) ---
    console.print(
        "\n[bold]Example 1: mesh.remesh(hmax=0.05)  \u2014  built-in progress[/bold]\n",
    )
    mesh = Mesh(mesh_path)
    result = mesh.remesh(hmax=0.05)
    console.print(
        f"  vertices: {result.vertices_before} \u2192 {result.vertices_after}\n",
    )

    # --- Example 2: Two-level bars (main + secondary) ---
    console.print(
        "[bold]Example 2: Two-level bars[/bold]\n",
    )
    mesh2 = MmgMesh3D(str(mesh_path))
    r2 = remesh_with_two_bars(mesh2, hmax=0.05, verbose=-1)
    console.print(
        f"  vertices: {r2['vertices_before']} \u2192 {r2['vertices_after']}\n",
    )

    # --- Example 3: Single cumulative bar ---
    console.print("[bold]Example 3: Single bar[/bold]\n")
    mesh3 = MmgMesh3D(str(mesh_path))
    r3 = remesh_with_single_bar(mesh3, hmax=0.05, verbose=-1)
    console.print(
        f"  vertices: {r3['vertices_before']} \u2192 {r3['vertices_after']}\n",
    )
