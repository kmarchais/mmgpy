"""Scoped warning filter for tests that target the deprecated Mesh class.

These tests will be removed in 0.13 along with ``mmgpy.Mesh``. Until then,
they assert behavior of the legacy class itself; the ``DeprecationWarning``
is the *subject under test*'s emitted warning, not a real signal.

Filters are attached per-item in ``pytest_collection_modifyitems`` so the
suppression is scoped to tests under ``tests/deprecated/`` and does not
leak into the rest of the suite. Module-scope code paths that need the
silent ``Mesh`` constructor (e.g. the ``_lagrangian_available()`` helper
used by ``skipif`` markers) must call ``Mesh._from_arrays(...)`` directly.
"""

from __future__ import annotations

from typing import TYPE_CHECKING

import pytest

if TYPE_CHECKING:
    from collections.abc import Iterable

_FILTERS = (
    r"ignore:mmgpy\.Mesh is deprecated:DeprecationWarning",
    r"ignore:Mesh\.checkpoint\(\) is deprecated:DeprecationWarning",
)


def pytest_collection_modifyitems(items: Iterable[pytest.Item]) -> None:
    """Apply the Mesh-deprecation filter to every test under tests/deprecated/."""
    for item in items:
        for spec in _FILTERS:
            item.add_marker(pytest.mark.filterwarnings(spec))
