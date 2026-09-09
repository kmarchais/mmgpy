"""Choose CI work from the complete PR diff; unknown changes run everything."""

import json
import os
import subprocess
from pathlib import Path

import tomllib

CHECKS = ("tests", "examples", "docs", "wheels", "conda", "benchmarks")
TOOLS = {"ty", "prek"}


def tool_lock_only(before: bytes, after: bytes) -> bool:
    """Allow only standalone development tool records to change."""
    old, new = (tomllib.loads(data.decode()) for data in (before, after))
    old_packages = old.pop("package")
    new_packages = new.pop("package")
    # Compare lists, rather than indexing by name: uv can lock multiple versions.
    return old == new and [p for p in old_packages if p["name"] not in TOOLS] == [
        p for p in new_packages if p["name"] not in TOOLS
    ]


def select(paths: list[str], *, tools_only: bool = False, full: bool = False) -> dict:
    """Select checks conservatively, including both sides of renamed paths."""
    result = dict.fromkeys(CHECKS, False)
    result["full_wheels"] = False
    if full or not paths:
        return dict.fromkeys(result, True)
    for path in paths:
        if path == "uv.lock" and tools_only:
            continue
        if path.startswith(("docs/", "examples/")) or path == "mkdocs.yml":
            result.update(docs=True, examples=True)
        elif path.endswith(".md") and not path.startswith(".github/"):
            result["docs"] = True
        elif path.startswith("src/"):
            result.update(tests=True, examples=True, docs=True, wheels=True)
            if not path.startswith(("src/mmgpy/ui/", "src/mmgpy/interactive/")):
                result["benchmarks"] = True
            if path.startswith("src/bindings/") or path.endswith("CMakeLists.txt"):
                result.update(full_wheels=True, conda=True)
        elif path.startswith("tests/"):
            result.update(tests=True, examples=True, wheels=True)
        elif path.startswith("benchmarks/"):
            result["benchmarks"] = True
        elif path.startswith("conda/"):
            result["conda"] = True
        elif path == ".pre-commit-config.yaml":
            continue
        else:
            # Includes manifests, runtime lock changes, native dependencies,
            # workflows, build scripts, and files not covered by this policy.
            return dict.fromkeys(result, True)
    return result


def git(*args: str) -> bytes:
    """Read the repository without relying on filenames in shell commands."""
    return subprocess.check_output(["git", *args])  # noqa: S603, S607 - fixed executable, no shell


def main() -> None:
    """Write the selection to GitHub job outputs and the run summary."""
    event = json.loads(Path(os.environ["GITHUB_EVENT_PATH"]).read_text())
    full = os.environ["GITHUB_EVENT_NAME"] != "pull_request"
    paths = []
    tools_only = False
    if not full:
        base = event["pull_request"]["base"]["sha"]
        head = event["pull_request"]["head"]["sha"]
        merge_base = git("merge-base", base, head).decode().strip()
        paths = (
            git("diff", "--name-only", "--no-renames", "-z", merge_base, head)
            .decode()
            .split("\0")[:-1]
        )
        if "uv.lock" in paths:
            try:
                tools_only = tool_lock_only(
                    git("show", f"{merge_base}:uv.lock"), git("show", f"{head}:uv.lock")
                )
            except (subprocess.CalledProcessError, ValueError, KeyError):
                tools_only = False
    result = select(paths, tools_only=tools_only, full=full)
    print(json.dumps(result, indent=2))
    with Path(os.environ["GITHUB_OUTPUT"]).open("a") as output:
        for key, value in result.items():
            print(f"{key}={str(value).lower()}", file=output)
    with Path(os.environ["GITHUB_STEP_SUMMARY"]).open("a") as summary:
        print("## Selected CI checks\n", file=summary)
        for key, value in result.items():
            print(f"- {key}: {'run' if value else 'not needed'}", file=summary)


if __name__ == "__main__":
    main()
