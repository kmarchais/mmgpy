# MMGPy Wheel Size Optimization Strategy

## Executive Summary

Successfully re-enabled wheel optimization script that was incorrectly disabled.
**Result**: macOS Python 3.9 wheel optimized from 113MB → 59MB (48% reduction) by removing 410 VTK duplicates.

## Current Status

| Platform | Python Version | Before | After | Status                    |
| -------- | -------------- | ------ | ----- | ------------------------- |
| Windows  | 3.9-3.13       | ~113MB | ~18MB | ✅ Optimized (delvewheel) |
| macOS    | 3.10-3.13      | ~113MB | ~26MB | ✅ Optimized              |
| macOS    | 3.9            | 113MB  | 59MB  | ✅ **FIXED**              |
| Linux    | All versions   | ~161MB | TBD   | ⏳ Testing in CI          |

## Root Cause Identified

The optimization script was working correctly but was disabled in commit `8bc00b7` due to incorrect assessment. Evidence shows the script successfully:

- Filtered VTK libraries from 465 → 55 essential modules
- Removed development directories (`include/`, `cmake/`)
- Achieved 77% size reduction on macOS

## Next Steps

1. **✅ Re-enabled optimization script** in `pyproject.toml`
2. **✅ Tested Python 3.9 optimization** - 113MB → 59MB
3. **⏳ Test Linux optimization** in CI
4. **📋 Future**: Close macOS-Windows gap (59MB → 18MB target)

## Implementation

Re-enabled in `pyproject.toml`:

```toml
repair-wheel-command = "python3 scripts/optimize_wheels.py {wheel} && cp {wheel} {dest_dir}/"
```

The optimization script filters VTK to Windows-compatible 55 essential modules and removes development files.
