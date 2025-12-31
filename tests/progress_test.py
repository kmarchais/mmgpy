"""Tests for the mmgpy progress module."""

from __future__ import annotations

import numpy as np
import pytest

from mmgpy import MmgMesh2D, MmgMesh3D, ProgressEvent
from mmgpy._progress import _emit_event, remesh_mesh, rich_progress
from mmgpy.progress import LoggingProgressReporter


class CallbackTracker:
    """Track callback invocations for testing."""

    def __init__(self) -> None:
        """Initialize the tracker with empty events list."""
        self.events: list[ProgressEvent] = []

    def __call__(self, event: ProgressEvent) -> None:
        """Record a progress event."""
        self.events.append(event)


def test_progress_event_dataclass() -> None:
    """Test ProgressEvent dataclass creation."""
    event = ProgressEvent(
        phase="remesh",
        status="complete",
        message="Remeshing complete",
        details={"vertices": 100},
    )

    assert event.phase == "remesh"
    assert event.status == "complete"
    assert event.message == "Remeshing complete"
    assert event.details == {"vertices": 100}


def test_progress_event_without_details() -> None:
    """Test ProgressEvent with default details."""
    event = ProgressEvent(
        phase="init",
        status="start",
        message="Initializing",
    )

    assert event.details is None


def test_emit_event_with_callback() -> None:
    """Test that _emit_event calls the callback."""
    tracker = CallbackTracker()

    _emit_event(tracker, "test", "start", "Test message", {"key": "value"})

    assert len(tracker.events) == 1
    assert tracker.events[0].phase == "test"
    assert tracker.events[0].status == "start"
    assert tracker.events[0].message == "Test message"
    assert tracker.events[0].details == {"key": "value"}


def test_emit_event_without_callback() -> None:
    """Test that _emit_event handles None callback gracefully."""
    _emit_event(None, "test", "start", "Test message")


def test_logging_progress_reporter() -> None:
    """Test LoggingProgressReporter."""
    reporter = LoggingProgressReporter()

    event = ProgressEvent(
        phase="remesh",
        status="complete",
        message="Done",
        details={"vertices": 50},
    )

    reporter(event)


def test_rich_progress_context_manager() -> None:
    """Test rich_progress context manager."""
    with rich_progress() as callback:
        if callback is not None:
            event = ProgressEvent(
                phase="test",
                status="start",
                message="Testing",
            )
            callback(event)


def test_rich_progress_transient_option() -> None:
    """Test rich_progress with transient=False."""
    with rich_progress(transient=False) as _:
        pass


@pytest.fixture
def simple_2d_mesh() -> MmgMesh2D:
    """Create a simple 2D mesh for testing."""
    vertices = np.array(
        [
            [0.0, 0.0],
            [1.0, 0.0],
            [0.5, 1.0],
        ],
        dtype=np.float64,
    )
    triangles = np.array([[0, 1, 2]], dtype=np.int32)
    return MmgMesh2D(vertices, triangles)


@pytest.fixture
def simple_3d_mesh() -> MmgMesh3D:
    """Create a simple 3D mesh for testing."""
    vertices = np.array(
        [
            [0.0, 0.0, 0.0],
            [1.0, 0.0, 0.0],
            [0.5, 1.0, 0.0],
            [0.5, 0.5, 1.0],
        ],
        dtype=np.float64,
    )
    elements = np.array([[0, 1, 2, 3]], dtype=np.int32)
    return MmgMesh3D(vertices, elements)


def test_remesh_mesh_with_callback(simple_3d_mesh: MmgMesh3D) -> None:
    """Test remesh_mesh emits progress events."""
    tracker = CallbackTracker()

    remesh_mesh(simple_3d_mesh, progress=tracker, hmax=0.5, verbose=False)

    phases = [e.phase for e in tracker.events]
    assert "init" in phases
    assert "options" in phases
    assert "remesh" in phases

    complete_events = [e for e in tracker.events if e.status == "complete"]
    assert len(complete_events) >= 1


def test_remesh_mesh_reports_vertex_counts(simple_3d_mesh: MmgMesh3D) -> None:
    """Test remesh_mesh reports vertex count changes."""
    tracker = CallbackTracker()

    remesh_mesh(simple_3d_mesh, progress=tracker, hmax=0.3, verbose=False)

    remesh_complete = [
        e for e in tracker.events if e.phase == "remesh" and e.status == "complete"
    ]
    assert len(remesh_complete) == 1

    details = remesh_complete[0].details
    assert details is not None
    assert "initial_vertices" in details
    assert "final_vertices" in details
    assert "vertex_change" in details


def test_remesh_mesh_without_callback(simple_3d_mesh: MmgMesh3D) -> None:
    """Test remesh_mesh works without callback."""
    remesh_mesh(simple_3d_mesh, progress=None, hmax=0.5, verbose=False)


def test_progress_event_in_all() -> None:
    """Test that ProgressEvent is exported in mmgpy.__all__."""
    import mmgpy

    assert "ProgressEvent" in mmgpy.__all__
    assert "rich_progress" in mmgpy.__all__
    assert "progress" in mmgpy.__all__


def test_progress_module_exports() -> None:
    """Test progress module exports all expected names."""
    from mmgpy import progress

    assert hasattr(progress, "ProgressEvent")
    assert hasattr(progress, "LoggingProgressReporter")
    assert hasattr(progress, "RichProgressReporter")
    assert hasattr(progress, "rich_progress")
    assert hasattr(progress, "remesh_3d")
    assert hasattr(progress, "remesh_2d")
    assert hasattr(progress, "remesh_surface")
    assert hasattr(progress, "remesh_mesh")
    assert hasattr(progress, "remesh_mesh_lagrangian")
