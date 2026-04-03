"""Compare benchmark results between baseline and current runs.

Compares two pytest-benchmark JSON result files from the same CI job,
reporting regressions based on time ratios. Since both runs execute on
the same machine, hardware variance cancels out.

Usage:
    python benchmarks/scripts/compare_benchmarks.py \
        --baseline baseline-results.json \
        --current current-results.json \
        --threshold 1.3
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path


def load_benchmark_results(results_path: Path) -> dict[str, float]:
    """Load benchmark results from pytest-benchmark JSON output."""
    with results_path.open() as f:
        data = json.load(f)

    results: dict[str, float] = {}
    for bench in data.get("benchmarks", []):
        name = bench.get("name", "unknown")
        group = bench.get("group", "default")
        full_name = f"{group}::{name}"
        mean_time = bench.get("stats", {}).get("mean", 0)
        results[full_name] = mean_time

    return results


def compare_results(
    baseline: dict[str, float],
    current: dict[str, float],
    threshold: float,
) -> tuple[list[dict], list[dict], list[str], list[str]]:
    """Compare current results against baseline using ratios.

    Returns:
        Tuple of (regressions, passes, new_benchmarks, removed_benchmarks).

    """
    regressions: list[dict] = []
    passes: list[dict] = []
    new_benchmarks: list[str] = []
    removed_benchmarks: list[str] = []

    for name, current_time in current.items():
        if name not in baseline:
            new_benchmarks.append(name)
            continue

        baseline_time = baseline[name]
        ratio = current_time / baseline_time if baseline_time > 0 else float("inf")

        entry = {
            "name": name,
            "current": current_time,
            "baseline": baseline_time,
            "ratio": ratio,
        }

        if ratio > threshold:
            regressions.append(entry)
        else:
            passes.append(entry)

    removed_benchmarks = [name for name in baseline if name not in current]

    return regressions, passes, new_benchmarks, removed_benchmarks


def format_time(seconds: float) -> str:
    """Format time in appropriate units."""
    if seconds < 0.001:
        return f"{seconds * 1_000_000:.1f}us"
    if seconds < 1:
        return f"{seconds * 1000:.2f}ms"
    return f"{seconds:.2f}s"


def print_report(
    regressions: list[dict],
    passes: list[dict],
    new_benchmarks: list[str],
    removed_benchmarks: list[str],
    threshold: float,
) -> None:
    """Print comparison report to stdout."""
    total = len(regressions) + len(passes)

    print("=" * 70)
    print("BENCHMARK COMPARISON REPORT")
    print("=" * 70)
    print()
    print(f"Total benchmarks compared: {total}")
    print(f"Passed: {len(passes)}")
    print(f"Regressions: {len(regressions)}")
    print(f"Threshold: {threshold:.1f}x")
    if new_benchmarks:
        print(f"New benchmarks (no baseline): {len(new_benchmarks)}")
    if removed_benchmarks:
        print(f"Removed benchmarks: {len(removed_benchmarks)}")
    print()

    if regressions:
        print("-" * 70)
        print(f"REGRESSIONS (>{threshold:.1f}x slower than baseline)")
        print("-" * 70)
        for r in sorted(regressions, key=lambda x: -x["ratio"]):
            print(f"\n  {r['name']}")
            print(f"    Baseline: {format_time(r['baseline'])}")
            print(f"    Current:  {format_time(r['current'])}")
            print(f"    Ratio:    {r['ratio']:.2f}x")

    if new_benchmarks:
        print()
        print("-" * 70)
        print("NEW BENCHMARKS (no baseline to compare)")
        print("-" * 70)
        for name in new_benchmarks:
            print(f"  {name}")

    if removed_benchmarks:
        print()
        print("-" * 70)
        print("REMOVED BENCHMARKS (in baseline but not current)")
        print("-" * 70)
        for name in removed_benchmarks:
            print(f"  {name}")

    print()
    print("=" * 70)


def generate_github_output(
    regressions: list[dict],
    passes: list[dict],
    new_benchmarks: list[str],
    removed_benchmarks: list[str],
    threshold: float,
) -> str:
    """Generate markdown summary for GitHub Actions."""
    lines = ["### Benchmark Comparison Results\n"]

    total = len(regressions) + len(passes)
    status = "PASS" if not regressions else "FAIL"
    status_emoji = "white_check_mark" if not regressions else "x"

    lines.append(f"**Status**: :{status_emoji}: {status}")
    lines.append(
        f"**Compared**: {total} benchmarks (threshold: {threshold:.1f}x)",
    )
    lines.append("")

    if regressions:
        lines.append("#### Regressions")
        lines.append("")
        lines.append("| Benchmark | Baseline | Current | Ratio |")
        lines.append("|-----------|----------|---------|-------|")
        for r in sorted(regressions, key=lambda x: -x["ratio"]):
            short_name = r["name"].split("::")[-1]
            lines.append(
                f"| `{short_name}` | {format_time(r['baseline'])} | "
                f"{format_time(r['current'])} | **{r['ratio']:.2f}x** |",
            )
        lines.append("")

    if passes:
        lines.append(
            f"<details><summary>{len(passes)} benchmarks passed</summary>\n",
        )
        lines.append("| Benchmark | Baseline | Current | Ratio |")
        lines.append("|-----------|----------|---------|-------|")
        for p in sorted(passes, key=lambda x: -x["ratio"]):
            short_name = p["name"].split("::")[-1]
            lines.append(
                f"| `{short_name}` | {format_time(p['baseline'])} | "
                f"{format_time(p['current'])} | {p['ratio']:.2f}x |",
            )
        lines.append("</details>")

    if new_benchmarks:
        lines.append(
            f"\n<details><summary>{len(new_benchmarks)} new benchmarks "
            "(no baseline)</summary>\n",
        )
        lines.extend(f"- `{name}`" for name in new_benchmarks)
        lines.append("</details>")

    if removed_benchmarks:
        lines.append(
            f"\n<details><summary>{len(removed_benchmarks)} removed "
            "benchmarks</summary>\n",
        )
        lines.extend(f"- `{name}`" for name in removed_benchmarks)
        lines.append("</details>")

    return "\n".join(lines)


def main() -> None:
    """Compare benchmarks between baseline and current runs."""
    parser = argparse.ArgumentParser(
        description="Compare benchmark results between baseline and current runs",
    )
    parser.add_argument(
        "--baseline",
        type=Path,
        required=True,
        help="Path to baseline (main branch) benchmark results JSON",
    )
    parser.add_argument(
        "--current",
        type=Path,
        required=True,
        help="Path to current (PR branch) benchmark results JSON",
    )
    parser.add_argument(
        "--threshold",
        type=float,
        default=1.3,
        help="Ratio threshold for regression detection (default: 1.3)",
    )
    parser.add_argument(
        "--github-output",
        type=Path,
        help="Write GitHub-formatted output to this file",
    )
    parser.add_argument(
        "--fail-on-regression",
        action="store_true",
        help="Exit with non-zero code if regressions found",
    )

    args = parser.parse_args()

    for path, label in [(args.baseline, "Baseline"), (args.current, "Current")]:
        if not path.exists():
            print(f"Error: {label} file not found: {path}")
            sys.exit(1)

    baseline = load_benchmark_results(args.baseline)
    current = load_benchmark_results(args.current)

    regressions, passes, new_benchmarks, removed_benchmarks = compare_results(
        baseline,
        current,
        args.threshold,
    )

    print_report(
        regressions,
        passes,
        new_benchmarks,
        removed_benchmarks,
        args.threshold,
    )

    if args.github_output:
        github_md = generate_github_output(
            regressions,
            passes,
            new_benchmarks,
            removed_benchmarks,
            args.threshold,
        )
        with args.github_output.open("w") as f:
            f.write(github_md)
        print(f"\nGitHub output written to {args.github_output}")

    if args.fail_on_regression and regressions:
        sys.exit(1)


if __name__ == "__main__":
    main()
