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

## CI Alert Threshold

The CI uses a **200% alert threshold** to account for runner variability. This means:

- A benchmark is flagged only if it's >2x slower than baseline
- This reduces false positives from CI noise
- True regressions (actual code issues) will still trigger alerts

### Rationale

Based on statistical analysis using the μ + 3σ (mean plus 3 standard deviations) approach:

- Most benchmarks have CV < 15%
- Remeshing operations can have CV up to 25-30%
- A 200% threshold captures ~99.7% of normal variance

## Calibration

To recalibrate thresholds based on current CI runner behavior:

1. **Via GitHub Actions** (recommended):
   - Go to Actions → Benchmarks → Run workflow
   - Select "calibrate" mode
   - Set number of runs (10+ recommended)
   - Download `calibration-results.json` from artifacts

2. **Locally**:

   ```bash
   # Run calibration (10 iterations)
   uv run python scripts/calibrate_benchmarks.py --runs 10

   # Analyze results
   uv run python scripts/analyze_benchmark_variance.py calibration-results.json
   ```

The analysis script outputs:

- Variance distribution by benchmark group
- Recommended threshold based on statistical analysis
- High-variance benchmarks that may need attention

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
