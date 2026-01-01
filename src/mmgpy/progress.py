"""Progress tracking utilities for mmgpy.

This module provides progress callbacks and Rich integration for monitoring
mesh operations like remeshing.

Examples
--------
Basic usage with logging:

>>> from mmgpy import MmgMesh3D
>>> from mmgpy.progress import LoggingProgressReporter
>>> mesh = MmgMesh3D(vertices, elements)
>>> reporter = LoggingProgressReporter()
>>> # Progress events are logged during remeshing

Using Rich progress display:

>>> from mmgpy import MmgMesh3D
>>> from mmgpy.progress import rich_progress
>>> mesh = MmgMesh3D(vertices, elements)
>>> with rich_progress() as callback:
...     # A nice progress bar is shown during operations
...     pass

Creating a custom callback:

>>> from mmgpy.progress import ProgressEvent
>>> def my_callback(event: ProgressEvent) -> None:
...     print(f"{event.phase}: {event.message}")

"""

from ._progress import (
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
