"""Progress callback utilities for mmgpy with Rich integration.

This module provides progress callbacks for remeshing operations with support
for cancellation and Rich progress bar integration.

Example usage with a simple callback:

    >>> def my_progress(event: ProgressEvent) -> bool:
    ...     print(f"{event.phase}: {event.progress_percent:.0f}% - {event.message}")
    ...     return True  # Return False to cancel
    >>> mesh.remesh(hmax=0.1, progress=my_progress)

Example with Rich progress:

    >>> with rich_progress() as callback:
    ...     mesh.remesh(hmax=0.1, progress=callback)

Example with cancellation:

    >>> import threading
    >>> cancel_flag = threading.Event()
    >>> def check_cancel(event: ProgressEvent) -> bool:
    ...     return not cancel_flag.is_set()  # Return False to cancel
    >>> # In another thread: cancel_flag.set()

"""

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
    ProgressCallback = Callable[["ProgressEvent"], bool]


class CancellationError(Exception):
    """Exception raised when a remeshing operation is cancelled via callback.

    This exception is raised when a progress callback returns False, indicating
    the user wants to cancel the operation.

    Parameters
    ----------
    phase : str, optional
        The phase during which cancellation occurred.
    message : str, optional
        Custom message describing the cancellation.

    Attributes
    ----------
    phase : str | None
        The phase during which cancellation occurred.

    Examples
    --------
    >>> def cancel_callback(event: ProgressEvent) -> bool:
    ...     return False  # Cancel immediately
    >>> try:
    ...     remesh_mesh(mesh, progress=cancel_callback, hmax=0.1)
    ... except CancellationError as e:
    ...     print(f"Operation was cancelled at phase: {e.phase}")

    """

    def __init__(self, phase: str | None = None, message: str | None = None) -> None:
        """Initialize the CancellationError.

        Parameters
        ----------
        phase : str | None
            The phase during which cancellation occurred.
        message : str | None
            Custom message. If not provided, a default message based on phase is used.

        """
        self.phase = phase
        if message is None and phase is not None:
            phase_messages = {
                "init": "Operation cancelled during init phase",
                "load": "Operation cancelled during load phase",
                "options": "Operation cancelled during options phase",
                "remesh": "Operation cancelled before remeshing",
                "save": "Operation cancelled during save phase",
            }
            message = phase_messages.get(phase, f"Operation cancelled at {phase}")
        elif message is None:
            message = "Operation cancelled"
        super().__init__(message)

    @classmethod
    def for_phase(cls, phase: str) -> Self:
        """Create a CancellationError for a specific phase.

        Parameters
        ----------
        phase : str
            The phase during which cancellation occurred.

        Returns
        -------
        CancellationError
            A new CancellationError with appropriate message for the phase.

        """
        return cls(phase=phase)


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
    progress : float | None
        Progress within the current phase as a value from 0.0 to 1.0.
        None indicates indeterminate progress.
    details : dict[str, Any] | None
        Optional additional details (e.g., vertex/element counts after remesh).

    Notes
    -----
    Due to limitations in the underlying MMG library, fine-grained progress
    during the actual remeshing phase is not available. Progress events are
    emitted at phase boundaries (start/complete) with progress values of
    0.0 at start and 1.0 at complete.

    """

    phase: str
    status: str
    message: str
    progress: float | None = None
    details: dict[str, Any] | None = None

    @property
    def progress_percent(self) -> float:
        """Return progress as a percentage (0-100).

        Returns 0 if progress is None (indeterminate).
        """
        return (self.progress or 0.0) * 100


class ProgressReporter(Protocol):
    """Protocol for progress reporters.

    A progress reporter is a callable that receives ProgressEvent instances
    and returns a boolean indicating whether to continue the operation.

    Returns
    -------
    bool
        True to continue the operation, False to cancel.

    """

    def __call__(self, event: ProgressEvent) -> bool:  # pragma: no cover
        """Report a progress event and return whether to continue."""
        ...


def _emit_event(  # noqa: PLR0913
    callback: ProgressCallback | None,
    phase: str,
    status: str,
    message: str,
    progress: float | None = None,
    details: dict[str, Any] | None = None,
) -> bool:
    """Emit a progress event if callback is provided.

    Parameters
    ----------
    callback : ProgressCallback | None
        The progress callback to invoke.
    phase : str
        The current phase of the operation.
    status : str
        Status within the phase.
    message : str
        Human-readable description.
    progress : float | None
        Progress value from 0.0 to 1.0.
    details : dict[str, Any] | None
        Optional additional details.

    Returns
    -------
    bool
        True if operation should continue, False if cancelled.
        Always returns True if callback is None.

    """
    if callback is None:
        return True

    event = ProgressEvent(
        phase=phase,
        status=status,
        message=message,
        progress=progress,
        details=details,
    )
    result = callback(event)
    # Handle callbacks that return None (treat as continue)
    return result if result is not None else True


class LoggingProgressReporter:
    """Progress reporter that logs events using mmgpy's logger.

    This reporter logs all progress events using mmgpy's configured logger.
    It always returns True, so it cannot be used for cancellation.

    Examples
    --------
    >>> from mmgpy.progress import LoggingProgressReporter, remesh_mesh
    >>> reporter = LoggingProgressReporter()
    >>> remesh_mesh(mesh, progress=reporter, hmax=0.1)

    """

    def __init__(self) -> None:
        """Initialize the logging progress reporter."""
        from ._logging import get_logger

        self._logger = get_logger()

    def __call__(self, event: ProgressEvent) -> bool:
        """Log the progress event.

        Parameters
        ----------
        event : ProgressEvent
            The progress event to log.

        Returns
        -------
        bool
            Always returns True (never cancels).

        """
        msg = f"[{event.phase}] {event.message}"
        if event.progress is not None:
            msg = f"{msg} ({event.progress_percent:.0f}%)"
        if event.details:
            details_str = ", ".join(f"{k}={v}" for k, v in event.details.items())
            msg = f"{msg} ({details_str})"
        self._logger.info(msg)
        return True


class RichProgressReporter:
    """Progress reporter using Rich's progress display.

    This reporter creates a Rich Progress display with multiple tasks
    corresponding to the phases of remeshing operations. It always returns
    True, so it cannot be used for cancellation.

    Examples
    --------
    >>> from mmgpy import MmgMesh3D
    >>> from mmgpy.progress import RichProgressReporter
    >>> mesh = MmgMesh3D(vertices, elements)
    >>> with RichProgressReporter() as reporter:
    ...     mesh.remesh(hmax=0.1, progress=reporter)

    """

    def __init__(self, *, transient: bool = True) -> None:  # pragma: no cover
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

    def __enter__(self) -> Self:  # pragma: no cover
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

    def __exit__(self, *args: object) -> None:  # pragma: no cover
        """Stop the progress display."""
        if self._progress is not None:
            self._progress.stop()

    def __call__(self, event: ProgressEvent) -> bool:  # pragma: no cover
        """Update the progress display with the event.

        Parameters
        ----------
        event : ProgressEvent
            The progress event to display.

        Returns
        -------
        bool
            Always returns True (never cancels).

        """
        if self._progress is None:
            return True

        phase_desc = self._phase_names.get(event.phase, event.phase.capitalize())

        if event.phase not in self._tasks:
            task_id = self._progress.add_task(
                description=phase_desc,
                total=1.0,
            )
            self._tasks[event.phase] = task_id

        task_id = self._tasks[event.phase]

        if event.status == "complete":
            self._progress.update(task_id, completed=1.0, description=f"{phase_desc}")
        elif event.status == "start":
            self._progress.update(
                task_id,
                completed=event.progress or 0.0,
                description=f"{phase_desc}...",
            )
        elif event.status == "progress" and event.progress is not None:
            self._progress.update(task_id, completed=event.progress)

        return True


@contextmanager
def rich_progress(
    *,
    transient: bool = True,
) -> Generator[ProgressCallback, None, None]:
    """Context manager for Rich progress display.

    This is a convenience function for using Rich progress with remeshing.
    The yielded callback always returns True, so it cannot be used for
    cancellation on its own.

    Parameters
    ----------
    transient : bool, default=True
        If True, the progress display is removed after completion.

    Yields
    ------
    ProgressCallback
        A progress callback function that always returns True.

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

        def callback(event: ProgressEvent) -> bool:
            phase_desc = phase_names.get(event.phase, event.phase.capitalize())

            if event.phase not in tasks:
                task_id = progress.add_task(
                    description=phase_desc,
                    total=1.0,
                )
                tasks[event.phase] = task_id

            task_id = tasks[event.phase]

            if event.status == "complete":
                progress.update(task_id, completed=1.0, description=f"{phase_desc}")
            elif event.status == "start":
                progress.update(
                    task_id,
                    completed=event.progress or 0.0,
                    description=f"{phase_desc}...",
                )
            elif event.status == "progress" and event.progress is not None:
                progress.update(task_id, completed=event.progress)

            return True

        yield callback


def remesh_3d(  # pragma: no cover
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
    The callback can return False to request cancellation before the remeshing
    operation starts.

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
        Callback function to receive progress events. Return False to cancel.
    **options
        Additional options passed to mmg3d.remesh (hmin, hmax, hausd, etc.).

    Returns
    -------
    bool
        True if remeshing succeeded, False otherwise.

    Raises
    ------
    CancellationError
        If the callback returns False to cancel the operation.

    Examples
    --------
    >>> from mmgpy.progress import remesh_3d, rich_progress
    >>> with rich_progress() as callback:
    ...     remesh_3d("input.mesh", "output.mesh", hmax=0.1, progress=callback)

    """
    from ._mmgpy import mmg3d

    if not _emit_event(progress, "load", "start", "Loading input mesh", progress=0.0):
        raise CancellationError.for_phase("load")  # noqa: EM101

    if not _emit_event(
        progress,
        "options",
        "start",
        "Setting remesh options",
        progress=0.0,
    ):
        raise CancellationError.for_phase("options")  # noqa: EM101

    if not _emit_event(progress, "remesh", "start", "Starting remeshing", progress=0.0):
        raise CancellationError.for_phase("remesh")  # noqa: EM101

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
        progress=1.0,
        details={"success": result},
    )
    _emit_event(progress, "save", "complete", "Mesh saved", progress=1.0)

    return result


def remesh_2d(  # pragma: no cover
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
    The callback can return False to request cancellation before the remeshing
    operation starts.

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
        Callback function to receive progress events. Return False to cancel.
    **options
        Additional options passed to mmg2d.remesh (hmin, hmax, hausd, etc.).

    Returns
    -------
    bool
        True if remeshing succeeded, False otherwise.

    Raises
    ------
    CancellationError
        If the callback returns False to cancel the operation.

    """
    from ._mmgpy import mmg2d

    if not _emit_event(progress, "load", "start", "Loading input mesh", progress=0.0):
        raise CancellationError.for_phase("load")  # noqa: EM101

    if not _emit_event(
        progress,
        "options",
        "start",
        "Setting remesh options",
        progress=0.0,
    ):
        raise CancellationError.for_phase("options")  # noqa: EM101

    if not _emit_event(progress, "remesh", "start", "Starting remeshing", progress=0.0):
        raise CancellationError.for_phase("remesh")  # noqa: EM101

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
        progress=1.0,
        details={"success": result},
    )
    _emit_event(progress, "save", "complete", "Mesh saved", progress=1.0)

    return result


def remesh_surface(  # pragma: no cover
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
    The callback can return False to request cancellation before the remeshing
    operation starts.

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
        Callback function to receive progress events. Return False to cancel.
    **options
        Additional options passed to mmgs.remesh (hmin, hmax, hausd, etc.).

    Returns
    -------
    bool
        True if remeshing succeeded, False otherwise.

    Raises
    ------
    CancellationError
        If the callback returns False to cancel the operation.

    """
    from ._mmgpy import mmgs

    if not _emit_event(progress, "load", "start", "Loading input mesh", progress=0.0):
        raise CancellationError.for_phase("load")  # noqa: EM101

    if not _emit_event(
        progress,
        "options",
        "start",
        "Setting remesh options",
        progress=0.0,
    ):
        raise CancellationError.for_phase("options")  # noqa: EM101

    if not _emit_event(progress, "remesh", "start", "Starting remeshing", progress=0.0):
        raise CancellationError.for_phase("remesh")  # noqa: EM101

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
        progress=1.0,
        details={"success": result},
    )
    _emit_event(progress, "save", "complete", "Mesh saved", progress=1.0)

    return result


def remesh_mesh(
    mesh: MeshType,
    *,
    progress: ProgressCallback | None = None,
    **options: float | bool | None,
) -> None:
    """Remesh an in-memory mesh with optional progress callback.

    This is a wrapper around MmgMesh.remesh that adds progress callback support.
    The callback can return False to request cancellation before the remeshing
    operation starts.

    Parameters
    ----------
    mesh : MmgMesh3D | MmgMesh2D | MmgMeshS
        The mesh object to remesh.
    progress : ProgressCallback | None, optional
        Callback function to receive progress events. Return False to cancel.
    **options
        Additional options passed to mesh.remesh (hmin, hmax, hausd, etc.).

    Raises
    ------
    CancellationError
        If the callback returns False to cancel the operation.

    Examples
    --------
    >>> from mmgpy import MmgMesh3D
    >>> from mmgpy.progress import remesh_mesh, rich_progress
    >>> mesh = MmgMesh3D(vertices, elements)
    >>> with rich_progress() as callback:
    ...     remesh_mesh(mesh, hmax=0.1, progress=callback)

    """
    if not _emit_event(progress, "init", "start", "Initializing mesh", progress=0.0):
        raise CancellationError.for_phase("init")  # noqa: EM101

    initial_vertices = len(mesh.get_vertices())

    if not _emit_event(
        progress,
        "options",
        "start",
        "Setting remesh options",
        progress=0.0,
    ):
        raise CancellationError.for_phase("options")  # noqa: EM101

    if not _emit_event(progress, "remesh", "start", "Starting remeshing", progress=0.0):
        raise CancellationError.for_phase("remesh")  # noqa: EM101

    mesh.remesh(**options)

    final_vertices = len(mesh.get_vertices())

    _emit_event(
        progress,
        "remesh",
        "complete",
        "Remeshing complete",
        progress=1.0,
        details={
            "initial_vertices": initial_vertices,
            "final_vertices": final_vertices,
            "vertex_change": final_vertices - initial_vertices,
        },
    )


def remesh_mesh_lagrangian(  # pragma: no cover
    mesh: MeshType,
    displacement: NDArray[np.float64],
    *,
    progress: ProgressCallback | None = None,
    **options: float | bool | None,
) -> None:
    """Remesh an in-memory mesh with Lagrangian motion and progress callback.

    This is a wrapper around MmgMesh.remesh_lagrangian that adds progress
    callback support. The callback can return False to request cancellation
    before the remeshing operation starts.

    Parameters
    ----------
    mesh : MmgMesh3D | MmgMesh2D | MmgMeshS
        The mesh object to remesh.
    displacement : NDArray[np.float64]
        Displacement field for Lagrangian motion.
    progress : ProgressCallback | None, optional
        Callback function to receive progress events. Return False to cancel.
    **options
        Additional options passed to mesh.remesh_lagrangian.

    Raises
    ------
    CancellationError
        If the callback returns False to cancel the operation.

    """
    if not _emit_event(progress, "init", "start", "Initializing mesh", progress=0.0):
        raise CancellationError.for_phase("init")  # noqa: EM101

    initial_vertices = len(mesh.get_vertices())

    if not _emit_event(
        progress,
        "options",
        "start",
        "Setting displacement field",
        progress=0.0,
    ):
        raise CancellationError.for_phase("options")  # noqa: EM101

    if not _emit_event(
        progress,
        "remesh",
        "start",
        "Starting Lagrangian remeshing",
        progress=0.0,
    ):
        raise CancellationError.for_phase("remesh")  # noqa: EM101

    mesh.remesh_lagrangian(displacement, **options)

    final_vertices = len(mesh.get_vertices())

    _emit_event(
        progress,
        "remesh",
        "complete",
        "Lagrangian remeshing complete",
        progress=1.0,
        details={
            "initial_vertices": initial_vertices,
            "final_vertices": final_vertices,
            "vertex_change": final_vertices - initial_vertices,
        },
    )
