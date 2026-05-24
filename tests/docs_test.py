"""Run every Python code block in ``docs/`` via pytest-examples discovery.

Replacement for the previous ``pytest --codeblocks docs/`` invocation
(``pytest-codeblocks`` is dormant since Sep 2023).

Design notes:

- ``pytest-examples`` is used only for DISCOVERY (``find_examples``). Each
  block is exec'd directly into a per-file shared ``globals`` dict, which
  matches pytest-codeblocks semantics: a function defined in block N closes
  over the same dict that later blocks add names to. pytest-examples'
  ``EvalExample.run`` builds a fresh module per block, breaking that.
- ``<!-- mmgpy-test:skip -->`` (replaces ``<!-- pytest-codeblocks:skip -->``)
  is recognised when it appears alone on a line OUTSIDE any code fence
  immediately before a Python fence. Marker matching is whitespace-tolerant.
  Intervening non-Python fences (bash, yaml) do NOT consume the skip — the
  marker still applies to the next ``python``/``py`` block.
- ``docs/conftest.py`` monkeypatches mmgpy / pv I/O. Patches are applied and
  reverted by a session-scoped autouse fixture so they cannot leak into
  other test files when the full suite runs in one pytest invocation.
"""

from __future__ import annotations

import importlib.util
import re
from collections import defaultdict
from pathlib import Path
from typing import TYPE_CHECKING

import pytest
from pytest_examples import find_examples

if TYPE_CHECKING:
    from pytest_examples import CodeExample

_DOCS = Path(__file__).resolve().parent.parent / "docs"
_DOCS_CONFTEST = _DOCS / "conftest.py"

if not _DOCS_CONFTEST.exists():
    pytest.skip(
        f"docs/conftest.py not found at {_DOCS_CONFTEST}",
        allow_module_level=True,
    )

# Marker matching tolerates optional whitespace around the inner directive
# so contributors who copy-paste `<!--mmgpy-test:skip-->` (no inner spaces)
# still get the intended skip behaviour.
_SKIP_RE = re.compile(r"^\s*<!--\s*mmgpy-test:skip\s*-->\s*$")
# Opening fence for python/py blocks (the only language pytest-examples runs).
_FENCE_PY_OPEN_RE = re.compile(r"^\s*```\s*(?:py|python)\b")
# Any fence line — used for tracking in-fence / out-of-fence state.
_FENCE_ANY_RE = re.compile(r"^\s*```")


def _skipped_lines(path: Path) -> set[int]:
    """Return the set of opening-fence line numbers that should be skipped.

    A state machine tracks whether we are inside a code fence, so a marker
    appearing as data inside a code block is ignored. Outside a fence, a
    marker sets a pending flag that attaches to the next OPENING PYTHON
    fence — non-Python fences (bash, yaml) are passed through, so a marker
    placed before docs-only blocks still skips the python block following.
    """
    lines = path.read_text(encoding="utf-8").splitlines()
    skip_at: set[int] = set()
    pending_skip = False
    in_fence = False
    for idx, raw in enumerate(lines, start=1):
        if in_fence:
            if _FENCE_ANY_RE.match(raw):
                in_fence = False
            continue
        if _FENCE_ANY_RE.match(raw):
            in_fence = True
            if pending_skip and _FENCE_PY_OPEN_RE.match(raw):
                skip_at.add(idx)
                pending_skip = False
            continue
        if _SKIP_RE.match(raw):
            pending_skip = True
            continue
        if raw.strip():
            # any other non-blank content line clears the pending skip
            pending_skip = False
    return skip_at


# Load docs/conftest.py to access ``apply_patches`` / ``restore_patches``.
# This import is now a no-op for side effects — the helpers must be invoked
# explicitly (see the session-scoped autouse fixture below).
_spec = importlib.util.spec_from_file_location(
    "_mmgpy_docs_conftest",
    _DOCS_CONFTEST,
)
assert _spec is not None
assert _spec.loader is not None
_docs_conftest = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_docs_conftest)


@pytest.fixture(scope="session", autouse=True)
def _docs_io_patches():
    """Apply docs I/O patches for this session, then revert at teardown.

    Without this scoping, monkeypatches installed at import time would leak
    into every other test in ``tests/`` whenever the full suite runs in a
    single pytest invocation (``uv run pytest`` without ``--ignore``).
    """
    _docs_conftest.apply_patches()
    try:
        yield
    finally:
        _docs_conftest.restore_patches()


# Group examples by file; sort within each file by line number.
_EXAMPLES_BY_FILE: dict[Path, list[CodeExample]] = defaultdict(list)
for _ex in find_examples(str(_DOCS)):
    _EXAMPLES_BY_FILE[_ex.path].append(_ex)
for _examples in _EXAMPLES_BY_FILE.values():
    _examples.sort(key=lambda e: e.start_line)

_SKIPS_BY_FILE: dict[Path, set[int]] = {p: _skipped_lines(p) for p in _EXAMPLES_BY_FILE}

# Single sort: keys and IDs derived from the SAME ordered list, so they can
# never desync if the dict is mutated between two list comprehensions.
_FILE_PATHS = sorted(_EXAMPLES_BY_FILE)
_FILE_IDS = [str(p.relative_to(_DOCS)) for p in _FILE_PATHS]


@pytest.mark.parametrize("doc_path", _FILE_PATHS, ids=_FILE_IDS)
def test_doc_file(doc_path: Path) -> None:
    """Run every non-skipped Python block in ``doc_path`` with shared globals."""
    module_globals: dict[str, object] = {"__name__": "__doc_example__"}
    skip_lines = _SKIPS_BY_FILE[doc_path]
    for example in _EXAMPLES_BY_FILE[doc_path]:
        if example.start_line in skip_lines:
            continue
        # Pad with blank lines so traceback line numbers match the doc file.
        # ``example.start_line`` is the opening fence; first code line is
        # ``start_line + 1``, so prepending ``start_line`` newlines aligns
        # source line 1 with doc-file line ``start_line + 1``.
        padded = "\n" * example.start_line + example.source
        code = compile(padded, str(example.path), "exec")
        exec(code, module_globals)  # noqa: S102
