# Benchmarks

Performance benchmarks for mmgpy using a diagnostic feature isolation matrix.

## Running Benchmarks

```bash
# Run all benchmarks
uv run pytest benchmarks/ --benchmark-only

# Run with detailed output
uv run pytest benchmarks/ --benchmark-only -v --benchmark-group-by=group

# Run specific benchmark file
uv run pytest benchmarks/bench_remesh.py --benchmark-only

# Save results to JSON
uv run pytest benchmarks/ --benchmark-only --benchmark-json=results.json
```

## Benchmark Structure

| File                  | Benchmarks | Description                                            |
| --------------------- | ---------- | ------------------------------------------------------ |
| `bench_remesh.py`     | 9          | Remesh isolation matrix (3D, 2D, surface)              |
| `bench_operations.py` | 5          | Cheap operations (construction, I/O, PyVista, quality) |
| `bench_validation.py` | 2          | KD-tree duplicate vertex detection                     |

**Total: 16 benchmarks** (designed for low noise and fast diagnosis).

## Isolation Matrix (bench_remesh.py)

Each benchmark exercises a unique combination of remesh options.
When benchmarks fail, the pattern of pass/fail identifies the culprit.

| Bench | Dim | hmin | hmax | hausd | hgrad | optimize | uniform | metric | angle |
| ----- | --- | :--: | :--: | :---: | :---: | :------: | :-----: | :----: | :---: |
| B1    | 3D  |  x   |  x   |   x   |       |          |         |        |       |
| B2    | 3D  |      |      |       |   x   |          |         |   x    |       |
| B3    | 3D  |      |      |       |       |    x     |         |        |       |
| B4    | 2D  |      |  x   |       |   x   |          |         |        |   x   |
| B5    | 2D  |  x   |      |   x   |       |          |         |   x    |       |
| B6    | 2D  |      |      |       |       |          |    x    |        |   x   |
| B7    | Srf |  x   |      |       |   x   |          |         |        |       |
| B8    | Srf |      |  x   |   x   |       |          |         |   x    |   x   |
| B9    | Srf |      |      |       |       |    x     |    x    |        |       |

**All feature signatures are unique** -- single-feature regressions can be
identified unambiguously.

### How to Diagnose a Regression

1. Look at which benchmarks regressed
2. Find the feature(s) present in **all** failing benchmarks
3. Check which passing benchmarks also have those features
4. The feature that appears in all failures and few passes is the culprit

**Example:** If B1, B5, B8 fail but others pass, the common feature is
`hausd` (signature {B1,B5,B8}).

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
