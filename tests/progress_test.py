"""Tests for the mmgpy progress module."""

from __future__ import annotations

import numpy as np
import pytest

from mmgpy import CancellationError, ProgressEvent
from mmgpy._mmgpy import MmgMesh2D, MmgMesh3D
from mmgpy._progress import _emit_event, remesh_mesh, rich_progress
from mmgpy.progress import LoggingProgressReporter


class CallbackTracker:
    """Track callback invocations for testing."""

    def __init__(self, *, cancel_at_phase: str | None = None) -> None:
        """Initialize the tracker.

        Parameters
        ----------
        cancel_at_phase : str | None
            If provided, return False when this phase is encountered.

        """
        self.events: list[ProgressEvent] = []
        self.cancel_at_phase = cancel_at_phase

    def __call__(self, event: ProgressEvent) -> bool:
        """Record a progress event and return whether to continue."""
        self.events.append(event)
        return not (self.cancel_at_phase and event.phase == self.cancel_at_phase)


class LegacyCallbackTracker:
    """Track callback invocations using legacy None return (for backwards compat)."""

    def __init__(self) -> None:
        """Initialize the tracker with empty events list."""
        self.events: list[ProgressEvent] = []

    def __call__(self, event: ProgressEvent) -> None:
        """Record a progress event without returning a value."""
        self.events.append(event)


def test_progress_event_dataclass() -> None:
    """Test ProgressEvent dataclass creation."""
    event = ProgressEvent(
        phase="remesh",
        status="complete",
        message="Remeshing complete",
        progress=1.0,
        details={"vertices": 100},
    )

    assert event.phase == "remesh"
    assert event.status == "complete"
    assert event.message == "Remeshing complete"
    assert event.progress == 1.0
    assert event.details == {"vertices": 100}


def test_progress_event_without_details() -> None:
    """Test ProgressEvent with default details."""
    event = ProgressEvent(
        phase="init",
        status="start",
        message="Initializing",
    )

    assert event.details is None
    assert event.progress is None


def test_progress_event_progress_percent() -> None:
    """Test ProgressEvent.progress_percent property."""
    event_with_progress = ProgressEvent(
        phase="remesh",
        status="progress",
        message="Remeshing",
        progress=0.75,
    )
    assert event_with_progress.progress_percent == 75.0

    event_without_progress = ProgressEvent(
        phase="init",
        status="start",
        message="Starting",
    )
    assert event_without_progress.progress_percent == 0.0


def test_emit_event_with_callback() -> None:
    """Test that _emit_event calls the callback."""
    tracker = CallbackTracker()

    result = _emit_event(
        tracker,
        "test",
        "start",
        "Test message",
        progress=0.5,
        details={"key": "value"},
    )

    assert result is True
    assert len(tracker.events) == 1
    assert tracker.events[0].phase == "test"
    assert tracker.events[0].status == "start"
    assert tracker.events[0].message == "Test message"
    assert tracker.events[0].progress == 0.5
    assert tracker.events[0].details == {"key": "value"}


def test_emit_event_returns_false_on_cancel() -> None:
    """Test that _emit_event returns False when callback returns False."""
    tracker = CallbackTracker(cancel_at_phase="test")

    result = _emit_event(tracker, "test", "start", "Test message")

    assert result is False
    assert len(tracker.events) == 1


def test_emit_event_without_callback() -> None:
    """Test that _emit_event handles None callback gracefully."""
    result = _emit_event(None, "test", "start", "Test message")
    assert result is True


def test_emit_event_with_legacy_callback() -> None:
    """Test that _emit_event handles callbacks that return None (backwards compat)."""
    tracker = LegacyCallbackTracker()

    result = _emit_event(tracker, "test", "start", "Test message")

    assert result is True  # None is treated as continue
    assert len(tracker.events) == 1


def test_logging_progress_reporter() -> None:
    """Test LoggingProgressReporter returns True."""
    reporter = LoggingProgressReporter()

    event = ProgressEvent(
        phase="remesh",
        status="complete",
        message="Done",
        progress=1.0,
        details={"vertices": 50},
    )

    result = reporter(event)
    assert result is True


def test_logging_progress_reporter_logs_progress() -> None:
    """Test LoggingProgressReporter logs progress percentage."""
    reporter = LoggingProgressReporter()

    event = ProgressEvent(
        phase="remesh",
        status="progress",
        message="Processing",
        progress=0.5,
    )

    result = reporter(event)
    assert result is True


def test_rich_progress_context_manager() -> None:
    """Test rich_progress context manager returns callback that returns True."""
    with rich_progress() as callback:
        if callback is not None:
            event = ProgressEvent(
                phase="test",
                status="start",
                message="Testing",
                progress=0.0,
            )
            result = callback(event)
            assert result is True


def test_rich_progress_transient_option() -> None:
    """Test rich_progress with transient=False."""
    with rich_progress(transient=False) as callback:
        result = callback(
            ProgressEvent(phase="test", status="start", message="Test", progress=0.0),
        )
        assert result is True


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


def test_remesh_mesh_reports_progress_values(simple_3d_mesh: MmgMesh3D) -> None:
    """Test remesh_mesh reports progress values in events."""
    tracker = CallbackTracker()

    remesh_mesh(simple_3d_mesh, progress=tracker, hmax=0.5, verbose=False)

    # Start events should have progress=0.0
    start_events = [e for e in tracker.events if e.status == "start"]
    for event in start_events:
        assert event.progress == 0.0

    # Complete events should have progress=1.0
    complete_events = [e for e in tracker.events if e.status == "complete"]
    for event in complete_events:
        assert event.progress == 1.0


def test_remesh_mesh_without_callback(simple_3d_mesh: MmgMesh3D) -> None:
    """Test remesh_mesh works without callback."""
    remesh_mesh(simple_3d_mesh, progress=None, hmax=0.5, verbose=False)


def test_remesh_mesh_with_legacy_callback(simple_3d_mesh: MmgMesh3D) -> None:
    """Test remesh_mesh works with legacy callbacks that return None."""
    tracker = LegacyCallbackTracker()

    remesh_mesh(simple_3d_mesh, progress=tracker, hmax=0.5, verbose=False)

    # Should complete without error
    phases = [e.phase for e in tracker.events]
    assert "remesh" in phases


def test_remesh_mesh_cancellation_at_init(simple_3d_mesh: MmgMesh3D) -> None:
    """Test remesh_mesh raises CancellationError when cancelled at init."""
    tracker = CallbackTracker(cancel_at_phase="init")

    with pytest.raises(CancellationError, match="init phase"):
        remesh_mesh(simple_3d_mesh, progress=tracker, hmax=0.5, verbose=False)

    # Should only have the init event
    assert len(tracker.events) == 1
    assert tracker.events[0].phase == "init"


def test_remesh_mesh_cancellation_at_options(simple_3d_mesh: MmgMesh3D) -> None:
    """Test remesh_mesh raises CancellationError when cancelled at options."""
    tracker = CallbackTracker(cancel_at_phase="options")

    with pytest.raises(CancellationError, match="options phase"):
        remesh_mesh(simple_3d_mesh, progress=tracker, hmax=0.5, verbose=False)

    # Should have init and options events
    phases = [e.phase for e in tracker.events]
    assert "init" in phases
    assert "options" in phases


def test_remesh_mesh_cancellation_at_remesh(simple_3d_mesh: MmgMesh3D) -> None:
    """Test remesh_mesh raises CancellationError when cancelled before remesh."""
    tracker = CallbackTracker(cancel_at_phase="remesh")

    with pytest.raises(CancellationError, match="before remeshing"):
        remesh_mesh(simple_3d_mesh, progress=tracker, hmax=0.5, verbose=False)

    # The remesh phase start event should be recorded but operation was cancelled
    phases = [e.phase for e in tracker.events]
    assert "remesh" in phases


def test_cancellation_error_is_exception() -> None:
    """Test that CancellationError is a proper Exception subclass."""
    assert issubclass(CancellationError, Exception)

    # Test with phase
    error = CancellationError("init")
    assert error.phase == "init"
    assert str(error) == "Operation cancelled during init phase"

    # Test with custom message
    error2 = CancellationError(phase="options", message="Custom cancel message")
    assert error2.phase == "options"
    assert str(error2) == "Custom cancel message"

    # Test without any arguments
    error3 = CancellationError()
    assert error3.phase is None
    assert str(error3) == "Operation cancelled"


def test_progress_event_in_all() -> None:
    """Test that ProgressEvent and CancellationError are exported in mmgpy.__all__."""
    import mmgpy

    assert "ProgressEvent" in mmgpy.__all__
    assert "CancellationError" in mmgpy.__all__
    assert "rich_progress" in mmgpy.__all__
    assert "progress" in mmgpy.__all__


def test_progress_module_exports() -> None:
    """Test progress module exports all expected names."""
    from mmgpy import progress

    assert hasattr(progress, "ProgressEvent")
    assert hasattr(progress, "CancellationError")
    assert hasattr(progress, "LoggingProgressReporter")
    assert hasattr(progress, "RichProgressReporter")
    assert hasattr(progress, "ProgressReporter")
    assert hasattr(progress, "rich_progress")
    assert hasattr(progress, "remesh_3d")
    assert hasattr(progress, "remesh_2d")
    assert hasattr(progress, "remesh_surface")
    assert hasattr(progress, "remesh_mesh")
    assert hasattr(progress, "remesh_mesh_lagrangian")


def test_cancellation_error_import() -> None:
    """Test CancellationError can be imported from various locations."""
    from mmgpy import CancellationError as CancelErr1
    from mmgpy._progress import CancellationError as CancelErr3
    from mmgpy.progress import CancellationError as CancelErr2

    assert CancelErr1 is CancelErr2
    assert CancelErr2 is CancelErr3
