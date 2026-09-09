"""Exercise selective CI and merge-gate failure cases without native dependencies."""

# unittest keeps these checks independent of the native test environment.
# ruff: noqa: PT009

import copy
import unittest

from check_ci_result import failures
from select_ci import CHECKS, select, tool_lock_only


class SelectionTests(unittest.TestCase):
    """Choose checks for representative changes."""

    def test_tool_update_skips_native_work(self) -> None:
        """Tool update skips native work."""
        self.assertFalse(any(select(["uv.lock"], tools_only=True).values()))

    def test_mixed_tool_and_source_change_keeps_tests(self) -> None:
        """Mixed tool and source change keeps tests."""
        result = select(["uv.lock", "src/mmgpy/metrics.py"], tools_only=True)
        self.assertTrue(result["tests"])
        self.assertTrue(result["benchmarks"])
        self.assertTrue(result["wheels"])
        self.assertFalse(result["full_wheels"])

    def test_native_packaging_and_unknown_changes_run_full(self) -> None:
        """Native packaging and unknown changes run full."""
        for path in [
            "uv.lock",
            "pyproject.toml",
            "extern/CMakeLists.txt",
            ".github/workflows/ci.yml",
            "unknown",
        ]:
            with self.subTest(path=path):
                self.assertTrue(all(select([path]).values()))
        self.assertTrue(select(["src/bindings/mmg3d.cpp"])["full_wheels"])

    def test_docs_select_only_docs_and_examples(self) -> None:
        """Docs select only docs and examples."""
        result = select(["docs/tutorial.md"])
        self.assertEqual({k for k, v in result.items() if v}, {"docs", "examples"})

    def test_renamed_source_to_docs_still_runs_tests(self) -> None:
        """Renamed source to docs still runs tests."""
        self.assertTrue(select(["src/mmgpy/old.py", "docs/new.md"])["tests"])

    def test_full_runs_ignore_paths(self) -> None:
        """Full runs ignore paths."""
        self.assertTrue(all(select(["docs/index.md"], full=True).values()))
        self.assertTrue(all(select([]).values()))

    def test_lock_comparison_rejects_runtime_and_metadata_changes(self) -> None:
        """Lock comparison rejects runtime and metadata changes."""
        old = (
            b'version = 1\n[[package]]\nname = "ty"\nversion = "1"\n'
            b'[[package]]\nname = "numpy"\nversion = "1"\n'
        )
        self.assertTrue(
            tool_lock_only(
                old,
                old.replace(
                    b'name = "ty"\nversion = "1"', b'name = "ty"\nversion = "2"'
                ),
            )
        )
        self.assertFalse(
            tool_lock_only(
                old,
                old.replace(
                    b'name = "numpy"\nversion = "1"', b'name = "numpy"\nversion = "2"'
                ),
            )
        )
        self.assertFalse(
            tool_lock_only(old, old.replace(b"version = 1", b"version = 2"))
        )
        self.assertFalse(
            tool_lock_only(old, old + b'[[package]]\nname = "numpy"\nversion = "2"\n')
        )


class GateTests(unittest.TestCase):
    """Fail closed when expected checks do not succeed."""

    def setUp(self) -> None:
        """Create a successful minimal CI run."""
        self.needs = {
            "select": {"result": "success", "outputs": dict.fromkeys(CHECKS, "false")},
            "lint": {"result": "success"},
        }
        self.needs.update({name: {"result": "skipped"} for name in CHECKS})

    def test_intentional_skips_pass(self) -> None:
        """Intentional skips pass."""
        self.assertEqual(failures(self.needs), [])

    def test_missing_outputs_or_jobs_fail(self) -> None:
        """Reject an incomplete selection or dependency list."""
        needs = copy.deepcopy(self.needs)
        del needs["select"]["outputs"]["tests"]
        self.assertEqual(failures(needs), ["select"])
        del self.needs["tests"]
        self.assertEqual(failures(self.needs), ["missing jobs"])

    def test_selected_jobs_must_succeed(self) -> None:
        """Selected jobs must succeed."""
        for outcome in ["skipped", "cancelled", "failure"]:
            with self.subTest(outcome=outcome):
                needs = copy.deepcopy(self.needs)
                needs["select"]["outputs"]["tests"] = "true"
                needs["tests"]["result"] = outcome
                self.assertEqual(failures(needs), ["tests"])

    def test_selection_failure_and_lint_skip_fail_closed(self) -> None:
        """Selection failure and lint skip fail closed."""
        self.needs["select"]["result"] = "failure"
        self.assertEqual(failures(self.needs), ["select"])
        self.needs["select"]["result"] = "success"
        self.needs["lint"]["result"] = "skipped"
        self.assertEqual(failures(self.needs), ["lint"])

    def test_unselected_failure_is_not_hidden(self) -> None:
        """Unselected failure is not hidden."""
        self.needs["docs"]["result"] = "failure"
        self.assertEqual(failures(self.needs), ["docs"])


if __name__ == "__main__":
    unittest.main()
