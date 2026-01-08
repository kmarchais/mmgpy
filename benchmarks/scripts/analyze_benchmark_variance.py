"""Analyze benchmark calibration results and recommend thresholds.

This script processes the output from calibrate_benchmarks.py and generates
a detailed analysis with threshold recommendations.

Usage:
    python scripts/analyze_benchmark_variance.py calibration-results.json
"""

from __future__ import annotations

import argparse
import json
import statistics
import sys
from pathlib import Path


def analyze_by_group(stats: dict[str, dict[str, float]]) -> dict[str, dict[str, float]]:
    """Analyze statistics grouped by benchmark group."""
    groups: dict[str, list[dict[str, float]]] = {}

    for name, s in stats.items():
        group = name.split("::")[0] if "::" in name else "default"
        if group not in groups:
            groups[group] = []
        groups[group].append(s)

    group_stats: dict[str, dict[str, float]] = {}
    for group, benchmarks in groups.items():
        cv_values = [b["cv_percent"] for b in benchmarks]
        threshold_ratios = [b["threshold_ratio_3sigma"] for b in benchmarks]

        group_stats[group] = {
            "count": len(benchmarks),
            "mean_cv": statistics.mean(cv_values),
            "max_cv": max(cv_values),
            "min_cv": min(cv_values),
            "mean_threshold_ratio": statistics.mean(threshold_ratios),
            "max_threshold_ratio": max(threshold_ratios),
        }

    return group_stats


def recommend_threshold(stats: dict[str, dict[str, float]]) -> dict[str, float | str]:
    """Generate threshold recommendations based on analysis."""
    if not stats:
        return {"error": "No statistics available"}

    all_cv = [s["cv_percent"] for s in stats.values()]
    all_ratios = [s["threshold_ratio_3sigma"] for s in stats.values()]

    max_ratio = max(all_ratios)
    p95_ratio = sorted(all_ratios)[int(len(all_ratios) * 0.95)]

    recommended = max(2.0, p95_ratio * 1.1)

    return {
        "max_3sigma_ratio": max_ratio,
        "p95_3sigma_ratio": p95_ratio,
        "recommended_threshold_ratio": recommended,
        "recommended_threshold_percent": round(recommended * 100),
        "max_cv_percent": max(all_cv),
        "median_cv_percent": sorted(all_cv)[len(all_cv) // 2],
    }


def print_analysis(results: dict) -> None:
    """Print detailed analysis to stdout."""
    stats = results.get("statistics", {})
    categories = results.get("variance_categories", {})
    metadata = results.get("metadata", {})

    print("=" * 70)
    print("BENCHMARK VARIANCE ANALYSIS REPORT")
    print("=" * 70)
    print()
    print(f"Runs analyzed: {metadata.get('num_runs', 'N/A')}")
    print(f"Benchmarks: {metadata.get('num_benchmarks', len(stats))}")
    print()

    print("-" * 70)
    print("VARIANCE DISTRIBUTION")
    print("-" * 70)
    print(f"  Low variance (<5% CV):    {len(categories.get('low', []))} benchmarks")
    print(f"  Medium variance (5-15%):  {len(categories.get('medium', []))} benchmarks")
    print(f"  High variance (>15%):     {len(categories.get('high', []))} benchmarks")
    print()

    print("-" * 70)
    print("ANALYSIS BY BENCHMARK GROUP")
    print("-" * 70)
    group_stats = analyze_by_group(stats)
    for group, gs in sorted(group_stats.items(), key=lambda x: -x[1]["max_cv"]):
        print(f"\n  {group}:")
        print(f"    Benchmarks: {gs['count']}")
        print(f"    CV range: {gs['min_cv']:.1f}% - {gs['max_cv']:.1f}%")
        print(f"    Mean CV: {gs['mean_cv']:.1f}%")
        print(f"    Max 3-sigma threshold: {gs['max_threshold_ratio'] * 100:.0f}%")

    print()
    print("-" * 70)
    print("THRESHOLD RECOMMENDATIONS")
    print("-" * 70)
    rec = recommend_threshold(stats)
    print(f"  Max CV observed: {rec.get('max_cv_percent', 0):.1f}%")
    print(f"  Median CV: {rec.get('median_cv_percent', 0):.1f}%")
    print(f"  Max 3-sigma threshold ratio: {rec.get('max_3sigma_ratio', 0):.2f}x")
    print(f"  95th percentile 3-sigma ratio: {rec.get('p95_3sigma_ratio', 0):.2f}x")
    print()
    threshold = rec.get("recommended_threshold_percent", 200)
    print(f"  >>> RECOMMENDED ALERT THRESHOLD: {threshold}% <<<")
    print()

    high_var = categories.get("high", [])
    if high_var:
        print("-" * 70)
        print("HIGH VARIANCE BENCHMARKS (may need special attention)")
        print("-" * 70)
        for name in high_var:
            s = stats.get(name, {})
            print(f"  {name}")
            print(
                f"    CV: {s.get('cv_percent', 0):.1f}%, "
                f"Mean: {s.get('mean', 0) * 1000:.2f}ms, "
                f"Range: {s.get('min', 0) * 1000:.2f}-{s.get('max', 0) * 1000:.2f}ms",
            )

    print()
    print("=" * 70)


def main() -> None:
    """Analyze benchmark calibration results."""
    parser = argparse.ArgumentParser(
        description="Analyze benchmark calibration results and recommend thresholds",
    )
    parser.add_argument(
        "input_file",
        type=Path,
        help="Path to calibration results JSON file",
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="Output analysis as JSON instead of formatted report",
    )

    args = parser.parse_args()

    if not args.input_file.exists():
        print(f"Error: File not found: {args.input_file}")
        sys.exit(1)

    with args.input_file.open() as f:
        results = json.load(f)

    stats = results.get("statistics", {})

    if args.json:
        analysis = {
            "group_analysis": analyze_by_group(stats),
            "recommendations": recommend_threshold(stats),
            "variance_categories": results.get("variance_categories", {}),
        }
        print(json.dumps(analysis, indent=2))
    else:
        print_analysis(results)


if __name__ == "__main__":
    main()
