"""Compare benchmark results against calibrated thresholds.

This script compares current benchmark results against per-benchmark
thresholds from calibration, reporting any regressions.

Usage:
    python benchmarks/scripts/compare_benchmarks.py \
        --results benchmark-results.json \
        --thresholds benchmarks/thresholds.json
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


def load_thresholds(thresholds_path: Path) -> dict[str, dict[str, float]]:
    """Load calibrated thresholds."""
    with thresholds_path.open() as f:
        return json.load(f)


def compare_results(
    results: dict[str, float],
    thresholds: dict[str, dict[str, float]],
) -> tuple[list[dict], list[dict], list[str]]:
    """Compare results against thresholds.

    Returns:
        Tuple of (regressions, passes, missing_thresholds).

    """
    regressions: list[dict] = []
    passes: list[dict] = []
    missing: list[str] = []

    for name, current_time in results.items():
        if name not in thresholds:
            missing.append(name)
            continue

        threshold_data = thresholds[name]
        threshold = threshold_data["threshold_seconds"]
        baseline = threshold_data["baseline_mean"]

        if current_time > threshold:
            ratio = current_time / baseline if baseline > 0 else float("inf")
            regressions.append(
                {
                    "name": name,
                    "current": current_time,
                    "baseline": baseline,
                    "threshold": threshold,
                    "ratio": ratio,
                    "cv_percent": threshold_data.get("cv_percent", 0),
                },
            )
        else:
            passes.append(
                {
                    "name": name,
                    "current": current_time,
                    "baseline": baseline,
                    "threshold": threshold,
                },
            )

    return regressions, passes, missing


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
    missing: list[str],
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
    if missing:
        print(f"Missing thresholds: {len(missing)}")
    print()

    if regressions:
        print("-" * 70)
        print("REGRESSIONS (exceeding 3-sigma threshold)")
        print("-" * 70)
        for r in sorted(regressions, key=lambda x: -x["ratio"]):
            print(f"\n  {r['name']}")
            print(f"    Current:   {format_time(r['current'])}")
            print(f"    Baseline:  {format_time(r['baseline'])}")
            print(f"    Threshold: {format_time(r['threshold'])}")
            print(f"    Ratio:     {r['ratio']:.2f}x (CV: {r['cv_percent']:.1f}%)")

    if missing:
        print()
        print("-" * 70)
        print("MISSING THRESHOLDS (new benchmarks without calibration)")
        print("-" * 70)
        for name in missing:
            print(f"  {name}")

    print()
    print("=" * 70)


def generate_github_output(
    regressions: list[dict],
    passes: list[dict],
    missing: list[str],
) -> str:
    """Generate markdown summary for GitHub Actions."""
    lines = ["### Benchmark Comparison Results\n"]

    total = len(regressions) + len(passes)
    status = "PASS" if not regressions else "FAIL"
    status_emoji = "white_check_mark" if not regressions else "x"

    lines.append(f"**Status**: :{status_emoji}: {status}")
    lines.append(f"**Compared**: {total} benchmarks")
    lines.append("")

    if regressions:
        lines.append("#### Regressions")
        lines.append("")
        lines.append("| Benchmark | Current | Baseline | Ratio |")
        lines.append("|-----------|---------|----------|-------|")
        for r in sorted(regressions, key=lambda x: -x["ratio"]):
            short_name = r["name"].split("::")[-1]
            lines.append(
                f"| `{short_name}` | {format_time(r['current'])} | "
                f"{format_time(r['baseline'])} | {r['ratio']:.2f}x |",
            )
        lines.append("")

    if missing:
        lines.append(
            f"<details><summary>{len(missing)} benchmarks without "
            "thresholds</summary>\n",
        )
        lines.extend(f"- `{name}`" for name in missing)
        lines.append("</details>")

    return "\n".join(lines)


def main() -> None:
    """Compare benchmarks against thresholds."""
    parser = argparse.ArgumentParser(
        description="Compare benchmark results against calibrated thresholds",
    )
    parser.add_argument(
        "--results",
        type=Path,
        required=True,
        help="Path to benchmark results JSON file",
    )
    parser.add_argument(
        "--thresholds",
        type=Path,
        default=Path("benchmarks/thresholds.json"),
        help="Path to calibrated thresholds file",
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

    if not args.results.exists():
        print(f"Error: Results file not found: {args.results}")
        sys.exit(1)

    if not args.thresholds.exists():
        print(f"Warning: Thresholds file not found: {args.thresholds}")
        print("Run calibration first to generate thresholds.")
        print("Skipping comparison.")
        sys.exit(0)

    results = load_benchmark_results(args.results)
    thresholds = load_thresholds(args.thresholds)

    regressions, passes, missing = compare_results(results, thresholds)

    print_report(regressions, passes, missing)

    if args.github_output:
        github_md = generate_github_output(regressions, passes, missing)
        with args.github_output.open("w") as f:
            f.write(github_md)
        print(f"\nGitHub output written to {args.github_output}")

    if args.fail_on_regression and regressions:
        sys.exit(1)


if __name__ == "__main__":
    main()
