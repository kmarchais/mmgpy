"""Run benchmarks multiple times to collect variance statistics.

This script is used to calibrate benchmark thresholds by running the
benchmark suite multiple times and collecting timing statistics.

Usage:
    python scripts/calibrate_benchmarks.py --runs 10 --output calibration.json
"""

from __future__ import annotations

import argparse
import json
import statistics
import subprocess
import sys
import tempfile
from pathlib import Path


def run_benchmarks(benchmark_dir: Path) -> dict | None:
    """Run pytest benchmarks and return results as dict."""
    with tempfile.NamedTemporaryFile(
        mode="w",
        suffix=".json",
        delete=False,
    ) as tmp_file:
        tmp_path = Path(tmp_file.name)

    try:
        result = subprocess.run(
            [
                sys.executable,
                "-m",
                "pytest",
                str(benchmark_dir),
                "--benchmark-only",
                f"--benchmark-json={tmp_path}",
                "--benchmark-disable-gc",
                "-q",
            ],
            capture_output=True,
            text=True,
            check=False,
        )

        if result.returncode != 0 and not tmp_path.exists():
            print(f"Benchmark run failed: {result.stderr}")
            return None

        if tmp_path.exists():
            with tmp_path.open() as f:
                return json.load(f)

    finally:
        tmp_path.unlink(missing_ok=True)

    return None


def collect_calibration_data(
    benchmark_dir: Path,
    num_runs: int,
) -> dict[str, list[float]]:
    """Collect timing data from multiple benchmark runs."""
    all_timings: dict[str, list[float]] = {}

    for i in range(num_runs):
        print(f"Running benchmark iteration {i + 1}/{num_runs}...")
        results = run_benchmarks(benchmark_dir)

        if results is None:
            print(f"  Warning: Run {i + 1} failed, skipping")
            continue

        benchmarks = results.get("benchmarks", [])
        print(f"  Collected {len(benchmarks)} benchmark results")

        for bench in benchmarks:
            name = bench.get("name", "unknown")
            group = bench.get("group", "default")
            full_name = f"{group}::{name}"

            mean_time = bench.get("stats", {}).get("mean", 0)
            if full_name not in all_timings:
                all_timings[full_name] = []
            all_timings[full_name].append(mean_time)

    return all_timings


def calculate_statistics(
    timings: dict[str, list[float]],
) -> dict[str, dict[str, float]]:
    """Calculate mean, std, and coefficient of variation for each benchmark."""
    stats: dict[str, dict[str, float]] = {}

    for name, values in timings.items():
        if len(values) < 2:
            continue

        mean = statistics.mean(values)
        std = statistics.stdev(values)
        cv = (std / mean * 100) if mean > 0 else 0

        stats[name] = {
            "mean": mean,
            "std": std,
            "cv_percent": cv,
            "min": min(values),
            "max": max(values),
            "n_samples": len(values),
            "threshold_3sigma": mean + 3 * std,
            "threshold_ratio_3sigma": (mean + 3 * std) / mean if mean > 0 else 0,
        }

    return stats


def categorize_variance(stats: dict[str, dict[str, float]]) -> dict[str, list[str]]:
    """Categorize benchmarks by variance level."""
    categories: dict[str, list[str]] = {
        "low": [],
        "medium": [],
        "high": [],
    }

    for name, s in stats.items():
        cv = s["cv_percent"]
        if cv < 5:
            categories["low"].append(name)
        elif cv < 15:
            categories["medium"].append(name)
        else:
            categories["high"].append(name)

    return categories


def generate_thresholds(
    stats: dict[str, dict[str, float]],
) -> dict[str, dict[str, float]]:
    """Generate per-benchmark thresholds for comparison."""
    thresholds: dict[str, dict[str, float]] = {}

    for name, s in stats.items():
        thresholds[name] = {
            "threshold_seconds": s["threshold_3sigma"],
            "baseline_mean": s["mean"],
            "baseline_std": s["std"],
            "cv_percent": s["cv_percent"],
        }

    return thresholds


def main() -> None:
    """Run benchmark calibration."""
    parser = argparse.ArgumentParser(
        description="Calibrate benchmark thresholds by collecting variance statistics",
    )
    parser.add_argument(
        "--runs",
        type=int,
        default=10,
        help="Number of benchmark runs to perform (default: 10)",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("calibration-results.json"),
        help="Output file for calibration results (default: calibration-results.json)",
    )
    parser.add_argument(
        "--thresholds-output",
        type=Path,
        default=Path("benchmarks/thresholds.json"),
        help="Output file for thresholds (default: benchmarks/thresholds.json)",
    )
    parser.add_argument(
        "--benchmark-dir",
        type=Path,
        default=Path("benchmarks"),
        help="Directory containing benchmark files (default: benchmarks)",
    )

    args = parser.parse_args()

    print(f"Starting benchmark calibration with {args.runs} runs...")
    print(f"Benchmark directory: {args.benchmark_dir}")
    print()

    timings = collect_calibration_data(args.benchmark_dir, args.runs)

    if not timings:
        print("Error: No timing data collected")
        sys.exit(1)

    stats = calculate_statistics(timings)
    categories = categorize_variance(stats)

    results = {
        "metadata": {
            "num_runs": args.runs,
            "num_benchmarks": len(stats),
        },
        "statistics": stats,
        "variance_categories": categories,
        "raw_timings": timings,
    }

    with args.output.open("w") as f:
        json.dump(results, f, indent=2)

    thresholds = generate_thresholds(stats)
    with args.thresholds_output.open("w") as f:
        json.dump(thresholds, f, indent=2)

    print()
    print(f"Results saved to {args.output}")
    print(f"Thresholds saved to {args.thresholds_output}")
    print()
    print("=" * 70)
    print("CALIBRATION SUMMARY")
    print("=" * 70)
    print(f"Total benchmarks analyzed: {len(stats)}")
    print(f"Low variance (<5% CV): {len(categories['low'])} benchmarks")
    print(f"Medium variance (5-15% CV): {len(categories['medium'])} benchmarks")
    print(f"High variance (>15% CV): {len(categories['high'])} benchmarks")
    print()

    if stats:
        cv_values = [s["cv_percent"] for s in stats.values()]
        threshold_ratios = [s["threshold_ratio_3sigma"] for s in stats.values()]
        print(f"CV range: {min(cv_values):.1f}% - {max(cv_values):.1f}%")
        max_ratio = max(threshold_ratios)
        print(
            f"Recommended threshold (max 3-sigma): "
            f"{max_ratio * 100:.0f}% ({max_ratio:.2f}x)",
        )
        print()

        print("-" * 70)
        print("Top 10 highest variance benchmarks:")
        sorted_by_cv = sorted(
            stats.items(),
            key=lambda x: x[1]["cv_percent"],
            reverse=True,
        )
        for name, s in sorted_by_cv[:10]:
            print(f"  {name}")
            ratio = s["threshold_ratio_3sigma"]
            print(
                f"    CV: {s['cv_percent']:.1f}%, "
                f"Mean: {s['mean'] * 1000:.2f}ms, "
                f"3-sigma threshold: {ratio * 100:.0f}%",
            )


if __name__ == "__main__":
    main()
