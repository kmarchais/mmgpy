"""Scoped warning filter for tests that target the deprecated Mesh class.

These tests will be removed in 0.13 along with ``mmgpy.Mesh``. Until then,
they assert behavior of the legacy class itself; the ``DeprecationWarning``
is the *subject under test*'s emitted warning, not a real signal.

We register the filter both:

* at module-import time via ``warnings.filterwarnings`` so that test-file
  collection (and any module-scope ``Mesh(...)`` calls in
  ``pytest.mark.skipif(...)`` predicates) doesn't blow up under ``-W error``;
* per-test via ``pytest.mark.filterwarnings`` so that pytest's CLI
  ``-W error`` flag composes correctly with the per-item filters once tests
  start running.
"""

from __future__ import annotations

import warnings
from typing import TYPE_CHECKING

import pytest

if TYPE_CHECKING:
    from collections.abc import Iterable

_FILTERS = (
    r"ignore:mmgpy\.Mesh is deprecated:DeprecationWarning",
    r"ignore:Mesh\.checkpoint\(\) is deprecated:DeprecationWarning",
)

# Suppress at import time: collection of test modules (and any module-scope
# evaluation like ``pytest.mark.skipif(_lagrangian_available(), ...)``)
# would otherwise hit Mesh() before pytest_collection_modifyitems runs.
warnings.filterwarnings(
    "ignore",
    message=r"mmgpy\.Mesh is deprecated.*",
    category=DeprecationWarning,
)
warnings.filterwarnings(
    "ignore",
    message=r"Mesh\.checkpoint\(\) is deprecated.*",
    category=DeprecationWarning,
)


def pytest_collection_modifyitems(items: Iterable[pytest.Item]) -> None:
    """Apply the Mesh-deprecation filter to every test under tests/deprecated/."""
    for item in items:
        for spec in _FILTERS:
            item.add_marker(pytest.mark.filterwarnings(spec))
