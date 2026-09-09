"""Fail the required check if selected jobs fail, cancel, or unexpectedly skip."""

import json
import os


def failures(needs: dict) -> list[str]:
    """Validate job outcomes against the successful selection job's outputs."""
    if needs["select"]["result"] != "success":
        return ["select"]
    selected = needs["select"]["outputs"]
    expected = {"tests", "examples", "docs", "wheels", "conda", "benchmarks"}
    if any(selected.get(name) not in {"true", "false"} for name in expected):
        return ["select"]
    if not expected.union({"select", "lint"}).issubset(needs):
        return ["missing jobs"]
    bad = []
    for name, job in needs.items():
        required = name in {"select", "lint"} or selected.get(name) == "true"
        if job["result"] != "success" and (required or job["result"] != "skipped"):
            bad.append(name)
    return bad


if __name__ == "__main__":
    failed = failures(json.loads(os.environ["CI_NEEDS"]))
    if failed:
        message = f"CI did not pass: {', '.join(failed)}"
        raise SystemExit(message)
    print("All selected CI checks passed.")
