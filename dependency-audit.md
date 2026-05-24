# mmgpy Dependency Audit

**Date:** 2026-05-24

**Scope:** Every declared dependency (Python runtime, optional, dev, docs, build, C++, GitHub Actions). Pulled current minimums from `pyproject.toml`, `CMakeLists.txt`, `extern/CMakeLists.txt`, and every workflow under `.github/workflows/`.

---

## 1. Executive summary — top-priority moves

Sorted by urgency. The full per-dep details are in sections 4-10.

| #   | Item                                                                                                                                                      | Why now                                                                                                                                                       |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Pin `awalsh128/cache-apt-pkgs-action`** off `@latest` to `v1.6.0` (or a SHA)                                                                            | Supply-chain risk: mutable tag executes whatever the maintainer ships next, with full job-secret access.                                                      |
| 2   | **Bump `codecov/codecov-action` v5 → v6**                                                                                                                 | v6.0.1 patches a template-injection vulnerability (VULN-1652).                                                                                                |
| 3   | **Standardize action versions** across workflows (checkout/setup-python/upload-artifact/download-artifact/setup-uv all pinned to multiple versions today) | Reduces audit surface and prevents drift; add a `dependabot.yml` for `github-actions`.                                                                        |
| 4   | **Remove `pygments<2.20` cap** in `[dependency-groups].docs`                                                                                              | `pymdown-extensions 10.21.2` (Mar 2025) shipped the `filename=None` fix. The justifying comment is stale.                                                     |
| 5   | **Bump `pybind11` to `>=3.0.4`** in `build-system.requires` + dev group                                                                                   | 3.0.2/3.0.3 contain free-threaded (cp314t) hardening and 10+ stability fixes; mmgpy ships `cp314t-*` wheels. ABI-compatible with 3.0.0.                       |
| 6   | **Bump `pytest-benchmark` to `>=5.2.3`**                                                                                                                  | First release with explicit pytest 9 compat; mmgpy already pins `pytest>=9.0.3`.                                                                              |
| 7   | **Bump `scikit-build-core` to `>=0.12.2`** (build-system + dev)                                                                                           | 32-bit Windows wheel regression fix + `_PYTHON_HOST_PLATFORM` for cibuildwheel cross-builds.                                                                  |
| 8   | **Bump `trame-vtklocal` to `>=0.17.1`**                                                                                                                   | Adds asset versioning (kills stale-WASM browser cache after upgrade) + fixes a missing `packaging` runtime dep. Highest-value runtime fix in the Trame stack. |
| 9   | **Bump `pywebview` to `>=6.2.1`**                                                                                                                         | Fixes a macOS-ARM64 use-after-free crash that hits the desktop UI.                                                                                            |
| 10  | **Bump `cibuildwheel` to `v3.4.1`**                                                                                                                       | CPython 3.14.2 support + deployment-target fixes; v3.4 deprecates `cpython-freethreading` enable flag — review before v4.                                     |
| 11  | **Swap `mypy` → `ty`** (Astral)                                                                                                                           | `[tool.ty]` is already configured in `pyproject.toml:346-356`; finish the swap so we run a single, faster type-checker. ty is pre-1.0, budget triage time.    |
| 12  | **Bump `mkdocstrings-python` to `>=2.0.0,<3`**                                                                                                            | Currently on the 0.x line; 25+ releases of features and the v2 cleanup are missed.                                                                            |

---

## 2. Full inventory and version gap matrix

Legend: ✅ on latest · 🟢 patch behind · 🟡 minor behind · 🟠 major behind · 🔴 security/critical

### Python runtime (always-installed)

| Dep                         | Current min | Latest              | Gap       | Status                        |
| --------------------------- | ----------- | ------------------- | --------- | ----------------------------- |
| numpy                       | 2.0.2       | 2.4.0 (2025-12-20)  | 4 minors  | 🟡                            |
| scipy                       | 1.11.0      | 1.17.1 (2026-02-22) | 6 minors  | 🟡                            |
| rich                        | 13.0.0      | 15.0.0 (2026-04-12) | 2 majors  | 🟠 (compatible; cap is `<15`) |
| typing-extensions (py<3.11) | 4.0.0       | 4.15.0 (2025-08-25) | 15 minors | 🟡                            |
| patchelf (linux)            | 0.17.2.4    | 0.17.2.4            | none      | ✅                            |

### Optional (extras)

| Dep            | Current min | Latest              | Gap               | Status               |
| -------------- | ----------- | ------------------- | ----------------- | -------------------- |
| pyvista        | 0.48        | 0.48.4 (2026-05-18) | 4 patches         | 🟢                   |
| fedoo          | 0.8.3       | 0.8.3 (2026-05-04)  | none              | ✅                   |
| pywebview      | 6.1         | 6.2.1 (2026-04-15)  | 1 minor + 1 patch | 🟡 (macOS crash fix) |
| trame          | 3.12.0      | 3.13.2 (2026-05-15) | 1 minor + 2 patch | 🟡                   |
| trame-vtk      | 2.10.2      | 2.11.8 (2026-04-24) | 1 minor + 8 patch | 🟡                   |
| trame-vtklocal | 0.16.0      | 0.17.1 (2026-04-24) | 1 minor + 5 patch | 🟡                   |
| trame-vuetify  | 3.2.0       | 3.2.2 (2026-04-28)  | 2 patch           | 🟢                   |

### C++ / build-system

| Dep           | Current min | Latest             | Gap                                         | Status                                                     |
| ------------- | ----------- | ------------------ | ------------------------------------------- | ---------------------------------------------------------- |
| **MMG**       | 5.8.0       | 5.8.0 (2024-10-31) | none on tags; `develop` is 94 commits ahead | ✅ (but Windows-export workaround still required upstream) |
| pybind11      | 3.0.0       | 3.0.4 (2026-04-19) | 4 patches                                   | 🟢 (free-threaded fixes — bump)                            |
| CMake (floor) | 3.15        | 4.3.3 (2026-05-21) | very old                                    | 🟠 (cosmetic; raise to 3.25 for ergonomics)                |

### Dev tooling

| Dep               | Current min                 | Latest               | Gap               | Status                                                     |
| ----------------- | --------------------------- | -------------------- | ----------------- | ---------------------------------------------------------- |
| scikit-build-core | 0.11.5                      | 0.12.2 (2026-03-05)  | 1 minor + 2 patch | 🟡                                                         |
| build             | 1.4.0                       | 1.5.0 (2026-04-30)   | 1 minor           | 🟢 (1.5 drops py3.9 — hold)                                |
| imageio           | 2.37.2                      | 2.37.3 (2026-03-09)  | 1 patch           | 🟢                                                         |
| meshio            | 5.3.5                       | 5.3.5 (2024-01-31)   | none              | ✅ (project dormant)                                       |
| ~~mypy~~ → **ty** | mypy 1.19.1 (to be removed) | ty (preview, Astral) | n/a               | 🟠 (swap planned; `[tool.ty]` already in `pyproject.toml`) |
| prek              | 0.4                         | 0.4.1 (2026-05-20)   | 1 patch           | 🟢                                                         |
| pytest            | 9.0.3                       | 9.0.3 (2026-04-07)   | none              | ✅ (CVE-patched)                                           |
| pytest-benchmark  | 5.0.0                       | 5.2.3 (2025-11-09)   | 2 minor + 3 patch | 🟡 (**needed for pytest 9**)                               |
| pytest-cov        | 4.1.0                       | 7.1.0 (2026-03-21)   | 3 majors          | 🟠                                                         |
| ruff              | 0.15                        | 0.15.14 (2026-05-21) | 14 patches        | 🟢                                                         |
| pytest-codeblocks | 0.17.0                      | 0.17.0 (2023-09-17)  | none              | ✅ (project dormant — plan replacement)                    |
| pytest-pyvista    | 0.2                         | 0.3.3 (2026-04-13)   | 1 minor + 3 patch | 🟡                                                         |

### Docs

| Dep                        | Current pin                   | Latest                                              | Gap                  | Status                     |
| -------------------------- | ----------------------------- | --------------------------------------------------- | -------------------- | -------------------------- |
| mike (squidfunk fork, git) | commit `0f62791` (2026-03-29) | `2d4ad79` / tag `2.2.0+zensical-0.1.0` (2026-04-17) | 2 commits            | 🟢                         |
| mkdocstrings-python        | 0.24.0                        | 2.0.3 (2026-02-20)                                  | 2 majors             | 🟠                         |
| pygments                   | `<2.20` (cap)                 | 2.20.0 (2026-03-29)                                 | cap blocks 1 minor   | 🟢 (**cap can be lifted**) |
| zensical                   | 0.0.28                        | 0.0.43 (2026-05-19)                                 | 15 patches (pre-1.0) | 🟡                         |

### GitHub Actions

| Action                                   | Pinned           | Latest                                | Gap                              | Status                |
| ---------------------------------------- | ---------------- | ------------------------------------- | -------------------------------- | --------------------- |
| actions/checkout                         | v4 + v6 + v6.0.2 | v6.0.2 (2026-01-09)                   | up to 2 majors; **inconsistent** | 🟡                    |
| actions/setup-python                     | v5 + v6          | v6.0.0 (2025-09-04)                   | 1 major; **inconsistent**        | 🟡                    |
| actions/download-artifact                | v4 + v8          | v8.0.1 (2025-03-11)                   | 4 majors; **inconsistent**       | 🟠                    |
| actions/upload-artifact                  | v4 + v7          | v7.0.1 (2025-04-10)                   | 3 majors; **inconsistent**       | 🟠                    |
| actions/github-script                    | v7               | v9.0.0 (2025-04-09)                   | 2 majors                         | 🟠                    |
| astral-sh/setup-uv                       | v8.0.0 + v8.1.0  | v8.1.0 (2026-04-16)                   | patch/minor; **inconsistent**    | 🟢                    |
| awalsh128/cache-apt-pkgs-action          | **@latest**      | v1.6.0 (2025-10-15)                   | unpinned                         | 🔴 supply-chain       |
| benchmark-action/github-action-benchmark | v1               | v1.22.1 (2025-05-06)                  | floats correctly                 | ✅                    |
| codecov/codecov-action                   | v5               | v6.0.1 (2026-05-18)                   | 1 major                          | 🔴 VULN-1652          |
| codecov/test-results-action              | v1               | v1.2.1 (2025-12)                      | floats                           | ✅ (being deprecated) |
| j178/prek-action                         | v2.0.3           | v2.0.4 (2026-05-15)                   | 1 patch                          | 🟢                    |
| prefix-dev/rattler-build-action          | v0.2.36          | v0.2.38 (2026-05-21)                  | 2 patches                        | 🟢                    |
| pypa/cibuildwheel                        | v3.4             | v3.4.1 (2026-04-02); v4.0.0rc1 exists | 1 patch                          | 🟢                    |
| pypa/gh-action-pypi-publish              | release/v1       | v1.14.0 (2026-04-07)                  | floats correctly                 | ✅                    |

---

## 3. Hygiene findings (cross-cutting)

1. **`@latest` pin on `awalsh128/cache-apt-pkgs-action`** is the single highest-risk item in the audit. Pin to `v1.6.0`, ideally to a commit SHA.
2. **Five different actions pinned to two or three different versions** in different workflows. Drift came from copy-paste over time. Recommendation: pick one pin per action, add a `.github/dependabot.yml` block for `package-ecosystem: github-actions` to keep them in lockstep going forward.
3. **The `pygments<2.20` cap and its comment block are stale.** `pymdown-extensions 10.21.2` (2025-03-29) ships the exact `html.escape filename=None` fix the comment waits on. Remove the cap, optionally add `pymdown-extensions>=10.21.2` to the docs group as a belt-and-braces safeguard, delete the comment.
4. **Mixed pinning styles** in workflows (major-only, exact, branch ref, mutable tag). Adopt a documented policy, e.g. "major tag for first-party `actions/*`, exact version for third-party, SHA for unmaintained or security-sensitive."
5. **`patchelf` package name verification** — the audit assumed PyPI `patchelf` (mayeut wheel). Confirmed correct against `pyproject.toml` — no action.
6. **Two upstream MMG bugs remain worked around** in `extern/CMakeLists.txt:55-57` (`WINDOWS_EXPORT_ALL_SYMBOLS` on `libmmgs_so`). Upstream PR #325 (MmgTools/mmg) addresses `MMGS_Get_triangleQuality` but is still open. A companion PR for `MMGS_analys` would let us drop the workaround entirely once both land in a tagged release.
7. **MMG `develop` branch will break the Fortran C-API** (variadic functions removed). No impact on mmgpy (C++ pybind11 binding), but a heads-up that the next MMG release may be 5.9 / 6.0 with churn.
8. **Two dormant projects** in the dep set: `meshio` (last release 2024-01-31) and `pytest-codeblocks` (last release 2023-09-17). Both pinned at latest. Track replacements: `pytest-examples` is a viable swap for `pytest-codeblocks`.

---

## 4. Python runtime — details

### numpy

- **Current min:** `2.0.2` · **Latest:** `2.4.0` (2025-12-20) · **Gap:** 4 minors
- **Notable since 2.0.2:**
  - 2.1: Python 3.13 + preliminary free-threading C-level fixes
  - 2.3: continued free-threading, Windows-on-ARM
  - 2.4: runtime signature introspection in annotations, `same_value` cast kwarg, hash-based `np.unique` for strings, improved `np.quantile/percentile` accuracy for fp16/fp32
  - Breaking: ndim>0 array → scalar now raises `TypeError`; setting `strides` deprecated
- **Recommendation:** Bump min to `>=2.1.0` for clean Py3.13 + free-threading. Re-check pybind11 bindings against the `strides`/scalar-conversion deprecations before going higher.

### scipy

- **Current min:** `1.11.0` · **Latest:** `1.17.1` (2026-02-22) · **Gap:** 6 minors
- **Notable since 1.11.0:**
  - 1.13: first stable NumPy-2.x release (matters: mmgpy floor is `numpy>=2.0.2`)
  - 1.14: Python 3.13
  - 1.15: `scipy.differentiate`, `scipy.optimize.elementwise`, full 1-D/2-D sparse-arrays
  - 1.17: initial ILP64 BLAS/LAPACK, raised Python to 3.11–3.14, NumPy>=1.26.4
- **Recommendation:** Bump min to `>=1.13.0` to align with the NumPy 2 floor — earlier SciPy versions don't officially support NumPy 2.

### rich

- **Current min:** `13.0.0` · **Latest:** `15.0.0` (2026-04-12) · **Gap:** 2 majors (but compatible)
- **Notable:** 14.x added Exception Groups rendering, exception notes (Py3.11+), TTY env-var overrides; 15.0 dropped Python 3.8 (mmgpy already past 3.10).
- **Recommendation:** No floor bump. Optionally widen cap from `<15` to `<16` since the only break was dropping 3.8.

### typing-extensions

- **Current min:** `4.0.0` (only py<3.11) · **Latest:** `4.15.0` · **Gap:** 15 minors
- **Notable:** backports of `Self`, `override`, `deprecated`, `Buffer`, `TypeIs`, PEP 696 TypeVar defaults.
- **Recommendation:** Bump to `>=4.12.0` for modern backports.

### patchelf

- **Current min:** `0.17.2.4` · **Latest:** `0.17.2.4` · **Gap:** none on stable channel (0.18.1.0a1 is alpha)
- **Recommendation:** No action.

---

## 5. Optional / viz — details

### pyvista

- **Current min:** `0.48` · **Latest:** `0.48.4` (2026-05-18) · **Gap:** 4 patches
- The `0.48` floor is correctly aligned to the entry-point registry release the mmgpy plugin targets.
- **Recommendation:** No action. Optionally tighten to `>=0.48.1` if a 0.48.0 bug bites.

### pywebview

- **Current min:** `6.1` · **Latest:** `6.2.1` (2026-04-15)
- **Notable:** macOS-ARM64 Cocoa+GTK use-after-free crash fixed in 6.2; DPI-aware `Screen` properties; WebView2 runtime bump; `REMOTE_DEBUGGING_PORT` setting honored by Qt backend.
- **Recommendation:** Bump min to `>=6.2.1,<7`.

### fedoo

- **Current min:** `0.8.3` · **Latest:** `0.8.3` (2026-05-04) · **Gap:** none
- **Note:** Rapid cadence (0.5 → 0.8 in 2 months). A 0.9 with API churn is plausible within the next quarter. Re-evaluate when it lands.

### Trame stack

| Pkg            | min → latest    | Bump to                              | Reason                                              |
| -------------- | --------------- | ------------------------------------ | --------------------------------------------------- |
| trame          | 3.12.0 → 3.13.2 | `>=3.13.1,<4`                        | client/server pairing fix                           |
| trame-vtk      | 2.10.2 → 2.11.8 | `>=2.11.6,<3` (or 2.11.8 if VTK 9.7) | NumPy-array hashability fix + 9.7 compat            |
| trame-vtklocal | 0.16.0 → 0.17.1 | `>=0.17.1,<1`                        | WASM asset versioning + missing `packaging` dep fix |
| trame-vuetify  | 3.2.0 → 3.2.2   | `>=3.2.1,<4`                         | drawer-layout default-value fix                     |

None of the trame deltas touch the mmgpy UI patterns (`v_model=("var",)` tuples, `@state.change`, `server.trigger`, `VSelect items/groups`).

---

## 6. C++ / build — details

### MMG (the core dep) — 5.8.0

- **Status:** already on latest tag (released 2024-10-31).
- **`develop` (94 commits ahead) holds:**
  - `MMG5_split6()` uninitialized face-tag fix (eliminates spurious `MMG5_chkedg()` warnings in 3D splits)
  - `MMG5_swap23` tag-storage bug fix
  - Level-set non-0 LS splitting bug fix; non-manifold surfaces now warn instead of aborting
  - mmg3d-lag: split internal edges between boundary points; crash fix for non-manifold edges with two singular extremities
  - Barycentric point-in-triangle test fix
  - `CPACK_*` opt-out (PR #292) for conda-forge Windows
  - **Fortran API rewrite** (variadic functions removed) — breaks Fortran consumers, not mmgpy
- **Windows export workaround status:** PR #325 (the missing `LIBMMGS_EXPORT` on `MMGS_Get_triangleQuality`) is open as of 2026-05-14. `MMGS_analys` is also unexported on Windows. Our `WINDOWS_EXPORT_ALL_SYMBOLS` patch in `extern/CMakeLists.txt:55-57` remains necessary.
- **Recommendation:** Stay on 5.8.0. Push upstream PR #325 to closure; consider opening a companion PR for `MMGS_analys` so we can drop the all-symbols hack when the next MMG release ships.

### pybind11

- **Current min:** `3.0.0` · **Latest:** `3.0.4` (2026-04-19)
- **Notable patch-line wins:**
  - 3.0.1: subinterpreter stability, enum pointer-casting fix
  - **3.0.2: free-threaded Python 3.13t/3.14t hardening** — directly relevant to mmgpy's `cp314t-*` cibuildwheel targets
  - 3.0.3: 10 critical fixes incl. TSS key exhaustion, `pythonbuf` heap-buffer-overflow, virtual-inheritance crashes
  - 3.0.4: Eigen 5 compat, stream-redirection fix, Py3.13+ dict-traversal correctness
- **Recommendation:** Bump to `>=3.0.4` in both `build-system.requires` and `[dependency-groups].dev`. ABI-compatible.

### CMake

- **Current min:** `3.15` (2019) · **Latest:** `4.3.3` (2026-05-21)
- **Recommendation:** Raise floor to `>=3.25` (Nov 2022) for `block()`, `FetchContent` ergonomics (`SYSTEM`, `EXCLUDE_FROM_ALL`), and modern policy defaults. No need to require 4.x. Update `extern/CMakeLists.txt:1` and `pyproject.toml:67`.

---

## 7. Dev tooling — details

Priority-ordered:

1. **`pytest-benchmark>=5.2.3`** — first release with explicit pytest 9 hook support; current `5.0.0` may misbehave with the pinned `pytest>=9.0.3`.
2. **`scikit-build-core>=0.12.2`** — fixes 32-bit Windows wheel regression, adds `_PYTHON_HOST_PLATFORM` for cibuildwheel cross-builds. Bump both `[dependency-groups].dev` and `build-system.requires`.
3. **`ruff>=0.15.14`** — new preview rules (`RUF050`, `RUF071`–`RUF075`, `TID254`) plus `S603`/`S607` improvements. With `select=["ALL"]` + preview, expect new warnings; run `uv run ruff check src/ tests/` after bump and triage.
4. **`pytest-cov>=7.1.0`** — major jump (4 → 7). v7 removed subprocess measurement (use coverage's native patching). If no subprocess coverage runs, drop-in.
5. **Swap `mypy` → `ty`** (Astral, pre-1.0). `pyproject.toml:346-356` already has `[tool.ty.src]` excludes and `[tool.ty.rules]` set (`unresolved-import = "ignore"`) — so a meaningful config already exists. To complete the swap:
   - Remove `mypy>=1.19.1` from `[dependency-groups].dev`; add `ty` instead.
   - Grep `.github/workflows/` + `AGENTS.md` for `mypy` and replace `uv run mypy src/mmgpy/` with `uv run ty check src/mmgpy/`.
   - Run `uv run ty check src/mmgpy/` once on a branch and triage the diff vs. the last mypy run; silence noise in `[tool.ty.rules]`.
   - Risk: ty is preview; false positives or missing inference are expected. Worth it for the speed and to consolidate on the Astral toolchain (already using ruff).
6. **`prek>=0.4.1`** — rebase-aware pre-push range fix, faster meta-hook scanning.
7. **`pytest-pyvista>=0.3.3`** — `--ignore_image_cache` semantic fix + `from_build/` → `from_test/` directory rename for failed images. Check any test paths.
8. **`imageio>=2.37.3`** — patch only, dev-dep `black` security bump.
9. **`build` — hold at `>=1.4.0`** until Python 3.9 is dropped from the build matrix; `build 1.5.0` drops py3.9.
10. **`meshio`** — already on latest; project dormant.
11. **`pytest-codeblocks`** — already on latest; project dormant. Track replacements (`pytest-examples`).

---

## 8. Docs — details

### Diff to `[dependency-groups].docs`

```diff
- "mike @ git+https://github.com/squidfunk/mike.git@0f62791256ebeba60d20d2f1d8fe6ec3b7d1e2b3",
+ "mike @ git+https://github.com/squidfunk/mike.git@2d4ad79",  # or tag 2.2.0+zensical-0.1.0
  "mkdocstrings-python>=0.24.0",
- # Pygments 2.20 strictened html.escape to reject None; pymdownx 10.20 still
- # passes filename=None for separate-signature blocks rendered by
- # mkdocstrings, which silently kills the build. Pin until pymdownx
- # ships a fix.
- "pygments<2.20",
+ "pymdown-extensions>=10.21.2",
  "zensical>=0.0.28",
```

Then bump:

- `mkdocstrings-python` → `>=2.0.0,<3` (currently 25+ releases behind; 2.0 was a deprecation cleanup)
- `zensical` → `>=0.0.41,<0.1` (macros + table-reader parity; consider `--strict` in CI now that link validation is in)
- Stay on the squidfunk mike fork — upstream `jimporter/mike` has no Zensical adapter and has not released since Apr 2024.

---

## 9. GitHub Actions — details

### Standardization plan

| Action                          | Standardize on                                                   | Reason                                                                 |
| ------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------- |
| actions/checkout                | `v6` (floating major)                                            | Latest is 6.0.2; v6 hardens credential persistence                     |
| actions/setup-python            | `v6`                                                             | Node 24 runtime, new `pip-version` input                               |
| actions/download-artifact       | `v8`                                                             | **v4→v5 changed artifact path semantics** — must test the bump         |
| actions/upload-artifact         | `v7`                                                             | ESM, new `archive` param for single-file uploads                       |
| actions/github-script           | `v9`                                                             | v8 made `@actions/github` ESM-only; audit any inline `require()` calls |
| astral-sh/setup-uv              | `v8.1.0` (exact, by maintainer policy — floating majors removed) | Adds `no-project` input                                                |
| awalsh128/cache-apt-pkgs-action | **`v1.6.0` (or SHA)**                                            | Replace `@latest`                                                      |
| codecov/codecov-action          | `v6`                                                             | v6.0.1 patches template-injection vulnerability VULN-1652              |
| j178/prek-action                | `v2.0.4` or floating `v2`                                        | Known-prek-versions table updated                                      |
| prefix-dev/rattler-build-action | `v0.2.38`                                                        | `rattler-build` 0.65.0                                                 |
| pypa/cibuildwheel               | `v3.4.1`                                                         | CPython 3.14.2; review free-threaded-enable config before any v4 jump  |

### codecov/test-results-action

Being deprecated — functionality folding into `codecov-action@v6+`. Watch for migration path.

### cibuildwheel v4 (not yet stable)

v4.0.0rc1 drops Python 3.8 targets (non-issue here), adds `abi3audit`, changes Windows default repair tool to `delvewheel` (mmgpy already uses it). Plan ahead but don't move to v4 in production yet.

### Suggested `dependabot.yml` snippet

A fuller config is in §11 below — this is just the GitHub Actions slice.

```yaml
version: 2
updates:
  - package-ecosystem: github-actions
    directory: "/"
    schedule:
      interval: weekly
    groups:
      first-party-actions:
        patterns:
          - "actions/*"
```

---

## 10. Recommended sequencing (suggested PRs)

To keep PRs small and reviewable, group changes by blast radius:

1. **PR A — Workflow hygiene** (low risk, high value)
   - Pin `awalsh128/cache-apt-pkgs-action` to `v1.6.0` (or SHA)
   - Bump `codecov/codecov-action` v5 → v6
   - Standardize all `actions/*` pins (checkout v6, setup-python v6, upload-artifact v7, download-artifact v8, github-script v9)
   - Add `.github/dependabot.yml` for `github-actions`
2. **PR B — Build-system bumps** (build + test)
   - `pybind11>=3.0.4` (build-system + dev)
   - `scikit-build-core>=0.12.2` (build-system + dev)
   - `pypa/cibuildwheel` → `v3.4.1`
   - Raise CMake floor to `>=3.25`
3. **PR C — Docs un-pin** (docs-only)
   - Drop `pygments<2.20` cap, add `pymdown-extensions>=10.21.2`, remove stale comment
   - Bump `mkdocstrings-python` → `>=2.0.0,<3`
   - Bump `zensical` → `>=0.0.41,<0.1`
   - Bump mike pin to `2d4ad79`
4. **PR D — Runtime dep floors** (downstream-facing)
   - `numpy>=2.1.0`
   - `scipy>=1.13.0`
   - `typing-extensions>=4.12.0` (py<3.11)
   - Optionally widen `rich` upper cap to `<16`
5. **PR E — UI extra bumps** (optional users)
   - `pywebview>=6.2.1,<7` (macOS-ARM64 crash fix)
   - `trame>=3.13.1,<4`
   - `trame-vtk>=2.11.6,<3`
   - `trame-vtklocal>=0.17.1,<1`
   - `trame-vuetify>=3.2.1,<4`
6. **PR F — Dev tooling bumps** (CI-facing, may require code triage)
   - `pytest-benchmark>=5.2.3`
   - `pytest-cov>=7.1.0`
   - `pytest-pyvista>=0.3.3`
   - `ruff>=0.15.14` (expect new lints; budget triage time)
   - `prek>=0.4.1`, `imageio>=2.37.3`
7. **PR G — Swap `mypy` → `ty`** (its own PR; preview type-checker, expect triage)
   - Remove `mypy>=1.19.1` from `[dependency-groups].dev`; add `ty`.
   - Update `.github/workflows/` and `AGENTS.md`: replace `uv run mypy src/mmgpy/` with `uv run ty check src/mmgpy/`.
   - Triage initial findings; extend `[tool.ty.rules]` as needed.
8. **Track items (issues, not PRs)**
   - Push MMG PR #325 to closure; open companion PR for `MMGS_analys` export. When both land in a tagged MMG release, drop `WINDOWS_EXPORT_ALL_SYMBOLS` from `extern/CMakeLists.txt`.
   - Watch MMG `develop` for the 5.9 / 6.0 cut (Fortran API rewrite; not a blocker for mmgpy but worth tracking).
   - Plan replacement for `pytest-codeblocks` (dormant) → `pytest-examples`.
   - Watch `codecov/test-results-action` deprecation.

---

## 11. Dependabot — what it can and cannot automate from this audit

Dependabot can take roughly **70%** of the recurring churn off the table once configured, but it cannot replace the _judgment_ portion of an audit (deciding which caps to widen, which stale workarounds to delete, which preview rules to silence).

### What Dependabot handles

| Ecosystem        | Configurable in `dependabot.yml` | Notes                                                                                                                                                                  |
| ---------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `github-actions` | yes                              | Picks up every `uses:` in `.github/workflows/**` and opens a PR per outdated action. Resolves the `awalsh128 @latest` and the cross-workflow version drift.            |
| `uv`             | yes (shipped by GitHub in 2024)  | Reads `pyproject.toml` + `uv.lock` (`[project.dependencies]`, `[project.optional-dependencies]`, `[dependency-groups]`, `[build-system.requires]`) and refreshes both. |

### What Dependabot does NOT handle

- **`[tool.mmgpy].mmg_version = "5.8.0"`** — custom field, not a package ecosystem. Already covered by the existing `check-dependency-versions.yml` workflow.
- **`cmake_minimum_required(VERSION 3.15)`** in `CMakeLists.txt` / `extern/CMakeLists.txt` — not a package, not detected.
- **Upper-bound caps** like `rich<15`, `trame<4`, `pyvista<1` — Dependabot bumps the _floor_ only when the cap blocks an install, and it never widens a cap.
- **Removing stale workarounds** like the `pygments<2.20` cap or the `WINDOWS_EXPORT_ALL_SYMBOLS` patch — those need a human to read the upstream changelog and decide.
- **Git+SHA pins** like the squidfunk/mike entry — Dependabot's git-pin support is limited; manual bumps remain the norm.
- **Reading release notes and flagging breaking changes** — Dependabot opens a PR; reviewing the diff and the release notes is still on us. (For mypy, pytest-cov, mkdocstrings-python it would happily open a PR that breaks CI without warning.)

### Proposed `.github/dependabot.yml`

```yaml
version: 2
updates:
  # ---- GitHub Actions ---------------------------------------------------
  - package-ecosystem: github-actions
    directory: "/"
    schedule:
      interval: weekly
      day: monday
    open-pull-requests-limit: 5
    groups:
      # One PR per week for all first-party actions (low review cost).
      actions-core:
        patterns:
          - "actions/*"
      # Group all third-party actions into a single weekly PR too;
      # split out only when a real security/major issue lands.
      actions-third-party:
        patterns:
          - "*/*"
        exclude-patterns:
          - "actions/*"
    ignore:
      # cibuildwheel jumps are intentional choices (e.g. v4 will drop
      # Python 3.8 build targets and change the default Windows repair
      # tool). Track manually.
      - dependency-name: "pypa/cibuildwheel"
        update-types: ["version-update:semver-major"]

  # ---- Python (uv) ------------------------------------------------------
  - package-ecosystem: uv
    directory: "/"
    schedule:
      interval: weekly
      day: monday
    open-pull-requests-limit: 5
    groups:
      # Group safe rolling deps to avoid 15 weekly PRs.
      python-patches:
        update-types: ["patch"]
      python-minors:
        update-types: ["minor"]
    ignore:
      # `build` 1.5+ drops Python 3.9; hold until we drop 3.9 ourselves.
      - dependency-name: "build"
        update-types:
          ["version-update:semver-minor", "version-update:semver-major"]
      # Major bumps for these need staged migration PRs, not auto-merge:
      - dependency-name: "mypy" # being swapped out for ty — see PR G
      - dependency-name: "pytest-cov"
        update-types: ["version-update:semver-major"]
      - dependency-name: "mkdocstrings-python"
        update-types: ["version-update:semver-major"]
      # ruff ships rule churn in patch releases; let humans triage.
      - dependency-name: "ruff"
        update-types: ["version-update:semver-patch"]
```

### Operational notes

- **Auto-merge:** consider enabling auto-merge on the `actions-core` and `python-patches` groups once CI is green (via a separate workflow with `gh pr merge --auto --squash`). Keeps the noise level low.
- **Doesn't replace this audit:** Dependabot tells you a version is behind; it doesn't tell you a Windows MSVC workaround is no longer needed, or that an action is about to be deprecated, or that the comment justifying a cap is now stale. Plan a manual audit pass roughly every 6-12 months — the existing `check-dependency-versions.yml` workflow covers MMG, and this audit pattern can be repeated for the rest.
