# Benchmarks

This directory contains performance benchmarks for mmgpy.

## Running Benchmarks

```bash
# Run all benchmarks
uv run pytest benchmarks/ --benchmark-only

# Run with detailed output
uv run pytest benchmarks/ --benchmark-only -v

# Run specific benchmark file
uv run pytest benchmarks/bench_remesh_3d.py --benchmark-only

# Save results to JSON
uv run pytest benchmarks/ --benchmark-only --benchmark-json=results.json
```

## Benchmark Categories

| File                      | Description                      |
| ------------------------- | -------------------------------- |
| `bench_remesh_3d.py`      | 3D mesh remeshing operations     |
| `bench_remesh_2d.py`      | 2D mesh remeshing operations     |
| `bench_remesh_surface.py` | Surface mesh remeshing           |
| `bench_mesh_creation.py`  | Mesh construction from arrays    |
| `bench_io.py`             | File I/O and PyVista conversions |
| `bench_comparison.py`     | Executable vs API comparison     |

## How Benchmark Comparison Works

PR benchmarks use **same-job relative comparison** to eliminate false positives
from GitHub runner hardware variance:

1. The CI job checks out `main`, builds, and runs all benchmarks
2. Then checks out the PR branch, rebuilds, and runs benchmarks again
3. Since both runs happen on the **same machine**, hardware differences cancel out
4. Each benchmark is compared by ratio: `PR_time / main_time`
5. Regressions are flagged when the ratio exceeds **1.3x** (30% slower)

Push-to-main runs store absolute results for long-term trend tracking via
[github-action-benchmark](https://github.com/benchmark-action/github-action-benchmark).

## Local Comparison

```bash
# Run benchmarks on current branch
uv run pytest benchmarks/ --benchmark-only --benchmark-json=current.json

# Switch to main branch, run again
git stash && git checkout main
uv run pytest benchmarks/ --benchmark-only --benchmark-json=baseline.json
git checkout - && git stash pop

# Compare
uv run python benchmarks/scripts/compare_benchmarks.py \
    --baseline baseline.json \
    --current current.json \
    --threshold 1.3
```

## Scripts

| Script                          | Purpose                                                 |
| ------------------------------- | ------------------------------------------------------- |
| `scripts/compare_benchmarks.py` | Compare two benchmark runs by ratio, report regressions |

## Best Practices

1. **Warmup**: Benchmarks use `--benchmark-warmup=on` to stabilize cache state
2. **Minimum rounds**: 5 rounds per benchmark for reliable statistics
3. **GC disabled**: `--benchmark-disable-gc` removes garbage collection jitter
4. **Isolated tests**: Each benchmark creates fresh mesh instances

## Adding New Benchmarks

1. Create benchmark functions in appropriate `bench_*.py` file
2. Use `@pytest.mark.benchmark(group="group-name")` decorator
3. Use fixtures from `conftest.py` for consistent test data
4. Follow existing patterns for setup/teardown
