"""Progress tracking utilities for mmgpy.

This module provides progress callbacks and Rich integration for monitoring
mesh operations like remeshing, with support for cancellation.

Examples
--------
Basic usage with logging:

>>> from mmgpy import MmgMesh3D
>>> from mmgpy.progress import LoggingProgressReporter, remesh_mesh
>>> mesh = MmgMesh3D(vertices, elements)
>>> reporter = LoggingProgressReporter()
>>> remesh_mesh(mesh, progress=reporter, hmax=0.1)

Using Rich progress display:

>>> from mmgpy import MmgMesh3D
>>> from mmgpy.progress import rich_progress, remesh_mesh
>>> mesh = MmgMesh3D(vertices, elements)
>>> with rich_progress() as callback:
...     remesh_mesh(mesh, progress=callback, hmax=0.1)

Creating a custom callback with cancellation support:

>>> from mmgpy.progress import ProgressEvent, CancellationError
>>> def my_callback(event: ProgressEvent) -> bool:
...     print(f"{event.phase}: {event.progress_percent:.0f}% - {event.message}")
...     return True  # Return False to cancel
>>> # If callback returns False, CancellationError is raised

Cancellation example:

>>> import threading
>>> from mmgpy.progress import CancellationError, remesh_mesh
>>> cancel_flag = threading.Event()
>>> def check_cancel(event: ProgressEvent) -> bool:
...     return not cancel_flag.is_set()  # Return False when cancelled
>>> # In another thread: cancel_flag.set()

"""

from ._progress import (
    CancellationError,
    LoggingProgressReporter,
    ProgressEvent,
    ProgressReporter,
    RichProgressReporter,
    remesh_2d,
    remesh_3d,
    remesh_mesh,
    remesh_mesh_lagrangian,
    remesh_surface,
    rich_progress,
)

__all__ = [
    "CancellationError",
    "LoggingProgressReporter",
    "ProgressEvent",
    "ProgressReporter",
    "RichProgressReporter",
    "remesh_2d",
    "remesh_3d",
    "remesh_mesh",
    "remesh_mesh_lagrangian",
    "remesh_surface",
    "rich_progress",
]
