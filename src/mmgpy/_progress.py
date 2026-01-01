"""Progress callback utilities for mmgpy with Rich integration."""

from __future__ import annotations

import sys
from contextlib import contextmanager
from dataclasses import dataclass
from typing import TYPE_CHECKING, Protocol

if sys.version_info >= (3, 11):
    from typing import Self
else:
    from typing_extensions import Self

if TYPE_CHECKING:
    from collections.abc import Callable, Generator
    from pathlib import Path
    from typing import Any

    import numpy as np
    from numpy.typing import NDArray

    from ._mmgpy import MmgMesh2D, MmgMesh3D, MmgMeshS

    MeshType = MmgMesh3D | MmgMesh2D | MmgMeshS
    ProgressCallback = Callable[["ProgressEvent"], None]


@dataclass
class ProgressEvent:
    """Event emitted during mesh operations.

    Attributes
    ----------
    phase : str
        The current phase of the operation. One of:
        - "init": Initializing mesh structures
        - "load": Loading mesh from file
        - "options": Setting remeshing options
        - "remesh": Performing remeshing (status="start" or "complete")
        - "save": Saving mesh to file
    status : str
        Status within the phase ("start", "complete", or "progress").
    message : str
        Human-readable description of what's happening.
    details : dict[str, Any] | None
        Optional additional details (e.g., vertex/element counts after remesh).

    """

    phase: str
    status: str
    message: str
    details: dict[str, Any] | None = None


class ProgressReporter(Protocol):
    """Protocol for progress reporters."""

    def __call__(self, event: ProgressEvent) -> None:
        """Report a progress event."""
        ...


def _emit_event(
    callback: ProgressCallback | None,
    phase: str,
    status: str,
    message: str,
    details: dict[str, Any] | None = None,
) -> None:
    """Emit a progress event if callback is provided."""
    if callback is not None:
        event = ProgressEvent(
            phase=phase,
            status=status,
            message=message,
            details=details,
        )
        callback(event)


class LoggingProgressReporter:
    """Progress reporter that logs events using mmgpy's logger."""

    def __init__(self) -> None:
        from ._logging import get_logger

        self._logger = get_logger()

    def __call__(self, event: ProgressEvent) -> None:
        """Log the progress event."""
        msg = f"[{event.phase}] {event.message}"
        if event.details:
            details_str = ", ".join(f"{k}={v}" for k, v in event.details.items())
            msg = f"{msg} ({details_str})"
        self._logger.info(msg)


class RichProgressReporter:
    """Progress reporter using Rich's progress display.

    This reporter creates a Rich Progress display with multiple tasks
    corresponding to the phases of remeshing operations.

    Examples
    --------
    >>> from mmgpy import MmgMesh3D
    >>> from mmgpy.progress import RichProgressReporter
    >>> mesh = MmgMesh3D(vertices, elements)
    >>> with RichProgressReporter() as reporter:
    ...     mesh.remesh(hmax=0.1, progress=reporter)

    """

    def __init__(self, *, transient: bool = True) -> None:
        """Initialize the Rich progress reporter.

        Parameters
        ----------
        transient : bool, default=True
            If True, the progress display is removed after completion.

        """
        self._transient = transient
        self._progress = None
        self._tasks: dict[str, Any] = {}
        self._phase_names = {
            "init": "Initializing",
            "load": "Loading mesh",
            "options": "Setting options",
            "remesh": "Remeshing",
            "save": "Saving mesh",
        }

    def __enter__(self) -> Self:
        """Start the progress display."""
        from rich.progress import (
            BarColumn,
            Progress,
            SpinnerColumn,
            TextColumn,
            TimeElapsedColumn,
        )

        self._progress = Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            BarColumn(),
            TimeElapsedColumn(),
            transient=self._transient,
        )
        self._progress.start()
        return self

    def __exit__(self, *args: object) -> None:
        """Stop the progress display."""
        if self._progress is not None:
            self._progress.stop()

    def __call__(self, event: ProgressEvent) -> None:
        """Update the progress display with the event."""
        if self._progress is None:
            return

        phase_desc = self._phase_names.get(event.phase, event.phase.capitalize())

        if event.phase not in self._tasks:
            task_id = self._progress.add_task(
                description=phase_desc,
                total=1.0 if event.status == "start" else None,
            )
            self._tasks[event.phase] = task_id

        task_id = self._tasks[event.phase]

        if event.status == "complete":
            self._progress.update(task_id, completed=1.0, description=f"{phase_desc}")
        elif event.status == "start":
            self._progress.update(task_id, description=f"{phase_desc}...")


@contextmanager
def rich_progress(
    *,
    transient: bool = True,
) -> Generator[ProgressCallback, None, None]:
    """Context manager for Rich progress display.

    This is a convenience function for using Rich progress with remeshing.

    Parameters
    ----------
    transient : bool, default=True
        If True, the progress display is removed after completion.

    Yields
    ------
    ProgressCallback
        A progress callback function.

    Examples
    --------
    >>> from mmgpy import MmgMesh3D
    >>> from mmgpy.progress import rich_progress
    >>> mesh = MmgMesh3D(vertices, elements)
    >>> with rich_progress() as callback:
    ...     mesh.remesh(hmax=0.1, progress=callback)

    """
    from rich.progress import (
        BarColumn,
        Progress,
        SpinnerColumn,
        TextColumn,
        TimeElapsedColumn,
    )

    phase_names = {
        "init": "Initializing",
        "load": "Loading mesh",
        "options": "Setting options",
        "remesh": "Remeshing",
        "save": "Saving mesh",
    }
    tasks: dict[str, Any] = {}

    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        BarColumn(),
        TimeElapsedColumn(),
        transient=transient,
    ) as progress:

        def callback(event: ProgressEvent) -> None:
            phase_desc = phase_names.get(event.phase, event.phase.capitalize())

            if event.phase not in tasks:
                task_id = progress.add_task(
                    description=phase_desc,
                    total=1.0 if event.status == "start" else None,
                )
                tasks[event.phase] = task_id

            task_id = tasks[event.phase]

            if event.status == "complete":
                progress.update(task_id, completed=1.0, description=f"{phase_desc}")
            elif event.status == "start":
                progress.update(task_id, description=f"{phase_desc}...")

        yield callback


def remesh_3d(
    input_mesh: str | Path,
    output_mesh: str | Path,
    *,
    input_sol: str | Path | None = None,
    output_sol: str | Path | None = None,
    progress: ProgressCallback | None = None,
    **options: float,
) -> bool:
    """Remesh a 3D mesh with optional progress callback.

    This is a wrapper around mmg3d.remesh that adds progress callback support.

    Parameters
    ----------
    input_mesh : str | Path
        Path to the input mesh file.
    output_mesh : str | Path
        Path to the output mesh file.
    input_sol : str | Path | None, optional
        Path to the input solution file.
    output_sol : str | Path | None, optional
        Path to the output solution file.
    progress : ProgressCallback | None, optional
        Callback function to receive progress events.
    **options
        Additional options passed to mmg3d.remesh (hmin, hmax, hausd, etc.).

    Returns
    -------
    bool
        True if remeshing succeeded, False otherwise.

    Examples
    --------
    >>> from mmgpy.progress import remesh_3d, rich_progress
    >>> with rich_progress() as callback:
    ...     remesh_3d("input.mesh", "output.mesh", hmax=0.1, progress=callback)

    """
    from ._mmgpy import mmg3d

    _emit_event(progress, "load", "start", "Loading input mesh")
    _emit_event(progress, "options", "start", "Setting remesh options")
    _emit_event(progress, "remesh", "start", "Starting remeshing")

    result = mmg3d.remesh(
        input_mesh=input_mesh,
        input_sol=input_sol,
        output_mesh=output_mesh,
        output_sol=output_sol,
        options=options,
    )

    _emit_event(
        progress,
        "remesh",
        "complete",
        "Remeshing complete",
        {"success": result},
    )
    _emit_event(progress, "save", "complete", "Mesh saved")

    return result


def remesh_2d(
    input_mesh: str | Path,
    output_mesh: str | Path,
    *,
    input_sol: str | Path | None = None,
    output_sol: str | Path | None = None,
    progress: ProgressCallback | None = None,
    **options: float,
) -> bool:
    """Remesh a 2D mesh with optional progress callback.

    This is a wrapper around mmg2d.remesh that adds progress callback support.

    Parameters
    ----------
    input_mesh : str | Path
        Path to the input mesh file.
    output_mesh : str | Path
        Path to the output mesh file.
    input_sol : str | Path | None, optional
        Path to the input solution file.
    output_sol : str | Path | None, optional
        Path to the output solution file.
    progress : ProgressCallback | None, optional
        Callback function to receive progress events.
    **options
        Additional options passed to mmg2d.remesh (hmin, hmax, hausd, etc.).

    Returns
    -------
    bool
        True if remeshing succeeded, False otherwise.

    """
    from ._mmgpy import mmg2d

    _emit_event(progress, "load", "start", "Loading input mesh")
    _emit_event(progress, "options", "start", "Setting remesh options")
    _emit_event(progress, "remesh", "start", "Starting remeshing")

    result = mmg2d.remesh(
        input_mesh=input_mesh,
        input_sol=input_sol,
        output_mesh=output_mesh,
        output_sol=output_sol,
        options=options,
    )

    _emit_event(
        progress,
        "remesh",
        "complete",
        "Remeshing complete",
        {"success": result},
    )
    _emit_event(progress, "save", "complete", "Mesh saved")

    return result


def remesh_surface(
    input_mesh: str | Path,
    output_mesh: str | Path,
    *,
    input_sol: str | Path | None = None,
    output_sol: str | Path | None = None,
    progress: ProgressCallback | None = None,
    **options: float,
) -> bool:
    """Remesh a surface mesh with optional progress callback.

    This is a wrapper around mmgs.remesh that adds progress callback support.

    Parameters
    ----------
    input_mesh : str | Path
        Path to the input mesh file.
    output_mesh : str | Path
        Path to the output mesh file.
    input_sol : str | Path | None, optional
        Path to the input solution file.
    output_sol : str | Path | None, optional
        Path to the output solution file.
    progress : ProgressCallback | None, optional
        Callback function to receive progress events.
    **options
        Additional options passed to mmgs.remesh (hmin, hmax, hausd, etc.).

    Returns
    -------
    bool
        True if remeshing succeeded, False otherwise.

    """
    from ._mmgpy import mmgs

    _emit_event(progress, "load", "start", "Loading input mesh")
    _emit_event(progress, "options", "start", "Setting remesh options")
    _emit_event(progress, "remesh", "start", "Starting remeshing")

    result = mmgs.remesh(
        input_mesh=input_mesh,
        input_sol=input_sol,
        output_mesh=output_mesh,
        output_sol=output_sol,
        options=options,
    )

    _emit_event(
        progress,
        "remesh",
        "complete",
        "Remeshing complete",
        {"success": result},
    )
    _emit_event(progress, "save", "complete", "Mesh saved")

    return result


def remesh_mesh(
    mesh: MeshType,
    *,
    progress: ProgressCallback | None = None,
    **options: float | bool | None,
) -> None:
    """Remesh an in-memory mesh with optional progress callback.

    This is a wrapper around MmgMesh.remesh that adds progress callback support.

    Parameters
    ----------
    mesh : MmgMesh3D | MmgMesh2D | MmgMeshS
        The mesh object to remesh.
    progress : ProgressCallback | None, optional
        Callback function to receive progress events.
    **options
        Additional options passed to mesh.remesh (hmin, hmax, hausd, etc.).

    Examples
    --------
    >>> from mmgpy import MmgMesh3D
    >>> from mmgpy.progress import remesh_mesh, rich_progress
    >>> mesh = MmgMesh3D(vertices, elements)
    >>> with rich_progress() as callback:
    ...     remesh_mesh(mesh, hmax=0.1, progress=callback)

    """
    _emit_event(progress, "init", "start", "Initializing mesh")

    initial_vertices = len(mesh.get_vertices())

    _emit_event(progress, "options", "start", "Setting remesh options")
    _emit_event(progress, "remesh", "start", "Starting remeshing")

    mesh.remesh(**options)

    final_vertices = len(mesh.get_vertices())

    _emit_event(
        progress,
        "remesh",
        "complete",
        "Remeshing complete",
        {
            "initial_vertices": initial_vertices,
            "final_vertices": final_vertices,
            "vertex_change": final_vertices - initial_vertices,
        },
    )


def remesh_mesh_lagrangian(
    mesh: MeshType,
    displacement: NDArray[np.float64],
    *,
    progress: ProgressCallback | None = None,
    **options: float | bool | None,
) -> None:
    """Remesh an in-memory mesh with Lagrangian motion and progress callback.

    This is a wrapper around MmgMesh.remesh_lagrangian that adds progress
    callback support.

    Parameters
    ----------
    mesh : MmgMesh3D | MmgMesh2D | MmgMeshS
        The mesh object to remesh.
    displacement : NDArray[np.float64]
        Displacement field for Lagrangian motion.
    progress : ProgressCallback | None, optional
        Callback function to receive progress events.
    **options
        Additional options passed to mesh.remesh_lagrangian.

    """
    _emit_event(progress, "init", "start", "Initializing mesh")

    initial_vertices = len(mesh.get_vertices())

    _emit_event(progress, "options", "start", "Setting displacement field")
    _emit_event(progress, "remesh", "start", "Starting Lagrangian remeshing")

    mesh.remesh_lagrangian(displacement, **options)

    final_vertices = len(mesh.get_vertices())

    _emit_event(
        progress,
        "remesh",
        "complete",
        "Lagrangian remeshing complete",
        {
            "initial_vertices": initial_vertices,
            "final_vertices": final_vertices,
            "vertex_change": final_vertices - initial_vertices,
        },
    )
