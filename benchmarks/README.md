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

## Variance Expectations

GitHub Actions runner variability affects benchmark timing. Expected variance by operation type:

| Operation Type         | Expected CV | Notes                                 |
| ---------------------- | ----------- | ------------------------------------- |
| Field access (get/set) | <5%         | Very stable                           |
| Mesh construction      | 5-10%       | Memory allocation variance            |
| File I/O               | 5-15%       | Depends on disk cache state           |
| Remeshing              | 10-30%      | Algorithm-dependent, highest variance |

**CV** = Coefficient of Variation (standard deviation / mean × 100%)

## How Benchmark Comparison Works

The benchmark system uses **per-benchmark thresholds** based on statistical analysis:

1. **Calibration** runs benchmarks 10+ times on CI to measure variance
2. Each benchmark gets a threshold: `mean + 3σ` (captures 99.7% of normal variance)
3. **PR comparisons** check each benchmark against its specific threshold
4. Regressions are reported only when a benchmark exceeds its calibrated threshold

This approach reduces false positives because high-variance benchmarks (like remeshing) get appropriately higher thresholds.

## Calibration Workflow

### Initial Setup (run once, then periodically)

1. Go to **Actions → Benchmarks → Run workflow**
2. Select **"calibrate"** mode
3. Set runs to **10+** (more runs = better statistics)
4. Wait for calibration to complete
5. Download `calibration-results` artifact
6. Copy `benchmarks/thresholds.json` to your repo and commit it

### For PRs (automatic)

Once `benchmarks/thresholds.json` is committed:

- PRs automatically run benchmarks once
- Each benchmark is compared against its calibrated threshold
- PR comment shows summary + any regressions

### Recalibration

Recalibrate when:

- Adding new benchmarks (they won't have thresholds)
- Significant changes to benchmark infrastructure
- Periodically (every few months) as CI runners change

## Local Calibration

```bash
# Run calibration (10 iterations)
uv run python benchmarks/scripts/calibrate_benchmarks.py --runs 10

# Analyze results
uv run python benchmarks/scripts/analyze_benchmark_variance.py calibration-results.json

# Compare current results against thresholds
uv run python benchmarks/scripts/compare_benchmarks.py \
    --results benchmark-results.json \
    --thresholds benchmarks/thresholds.json
```

## Scripts

| Script                                  | Purpose                                                |
| --------------------------------------- | ------------------------------------------------------ |
| `scripts/calibrate_benchmarks.py`       | Run benchmarks N times, collect variance statistics    |
| `scripts/analyze_benchmark_variance.py` | Analyze calibration results, show recommendations      |
| `scripts/compare_benchmarks.py`         | Compare results against thresholds, report regressions |

## Best Practices

1. **Warmup**: Benchmarks use `--benchmark-warmup=on` to stabilize cache state
2. **Minimum rounds**: At least 3 rounds per benchmark for reliable statistics
3. **GC disabled**: Garbage collection disabled during benchmark runs
4. **Isolated tests**: Each benchmark creates fresh mesh instances

## Adding New Benchmarks

1. Create benchmark functions in appropriate `bench_*.py` file
2. Use `@pytest.mark.benchmark(group="group-name")` decorator
3. Use fixtures from `conftest.py` for consistent test data
4. Follow existing patterns for setup/teardown
5. **Run calibration** to generate thresholds for new benchmarks
