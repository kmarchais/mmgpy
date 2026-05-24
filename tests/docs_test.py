"""Run every Python code block in ``docs/`` via pytest-examples.

Replacement for the previous ``pytest --codeblocks docs/`` invocation
(``pytest-codeblocks`` is dormant since Sep 2023).

Semantic mapping:

- pytest-codeblocks ``<!-- pytest-codeblocks:cont -->`` (block depends on
  state from previous block in same file) is preserved here by running ALL
  blocks of a single doc file inside ONE test function with a shared
  ``module_globals`` dict. Reading a doc file top-to-bottom matches the test
  execution order, which is the natural reading semantics anyway.
- pytest-codeblocks ``<!-- pytest-codeblocks:skip -->`` (do not execute) is
  ported to ``<!-- mmgpy-test:skip -->``. The marker is recognised when it
  appears alone on the line immediately preceding a fenced code block.

The heavy ``docs/conftest.py`` monkeypatching (mmgpy/pv I/O fakes) still
applies at module load time — same as before.
"""

from __future__ import annotations

import importlib.util
import re
from collections import defaultdict
from pathlib import Path
from typing import TYPE_CHECKING

import pytest
from pytest_examples import EvalExample, find_examples

if TYPE_CHECKING:
    from pytest_examples import CodeExample

_DOCS = Path(__file__).resolve().parent.parent / "docs"
_SKIP_MARKER = "<!-- mmgpy-test:skip -->"
_FENCE_RE = re.compile(r"^\s*```")

# ``docs/conftest.py`` monkeypatches mmgpy/pv I/O so doc snippets that
# reference fake mesh files (``mmgpy.read("input.mesh")``) work without those
# files on disk. With pytest-codeblocks, that conftest was auto-loaded because
# ``--codeblocks docs/`` treated ``docs/`` as a test path. With pytest-examples
# called from ``tests/``, pytest never scans ``docs/``, so we load the patches
# explicitly here at module import time — same effect.
_DOCS_CONFTEST = _DOCS / "conftest.py"
_spec = importlib.util.spec_from_file_location("_mmgpy_docs_conftest", _DOCS_CONFTEST)
if _spec is None or _spec.loader is None:  # pragma: no cover
    msg = f"could not load {_DOCS_CONFTEST}"
    raise RuntimeError(msg)
_module = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_module)


def _skipped_lines(path: Path) -> set[int]:
    r"""Return the set of fenced-block start lines that should be skipped.

    A block is skipped when the most recent non-blank line above its opening
    fence (triple backticks) is the literal ``_SKIP_MARKER`` comment.
    """
    lines = path.read_text(encoding="utf-8").splitlines()
    skip_at: set[int] = set()
    pending_skip = False
    for idx, raw in enumerate(lines, start=1):
        stripped = raw.strip()
        if stripped == _SKIP_MARKER:
            pending_skip = True
            continue
        if not stripped:
            # blank line — preserve pending_skip
            continue
        if _FENCE_RE.match(raw) and pending_skip:
            # pytest-examples' ``CodeExample.start_line`` is the line of the
            # opening fence itself (1-indexed), not the first code line.
            skip_at.add(idx)
            pending_skip = False
            continue
        # any other content line clears the pending skip
        pending_skip = False
    return skip_at


# Group all examples by file so each test gets a clean namespace
_EXAMPLES_BY_FILE: dict[Path, list[CodeExample]] = defaultdict(list)
for _ex in find_examples(str(_DOCS)):
    _EXAMPLES_BY_FILE[_ex.path].append(_ex)
for _examples in _EXAMPLES_BY_FILE.values():
    _examples.sort(key=lambda e: e.start_line)

# Skip caches keyed by file path
_SKIPS_BY_FILE: dict[Path, set[int]] = {p: _skipped_lines(p) for p in _EXAMPLES_BY_FILE}

# Stable, human-readable IDs (file path relative to docs/)
_FILE_IDS = [str(p.relative_to(_DOCS)) for p in sorted(_EXAMPLES_BY_FILE)]
_FILE_PATHS = sorted(_EXAMPLES_BY_FILE)


@pytest.mark.parametrize("doc_path", _FILE_PATHS, ids=_FILE_IDS)
def test_doc_file(doc_path: Path, eval_example: EvalExample) -> None:
    """Run every non-skipped code block in ``doc_path`` with shared globals."""
    module_globals: dict[str, object] = {}
    skip_lines = _SKIPS_BY_FILE[doc_path]
    for example in _EXAMPLES_BY_FILE[doc_path]:
        if example.start_line in skip_lines:
            continue
        result = eval_example.run(example, module_globals=module_globals)
        module_globals.update(result)
