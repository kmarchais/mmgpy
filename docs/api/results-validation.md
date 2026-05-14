# Results & Validation

This page documents the result and validation classes returned by mmgpy operations.

## RemeshResult

`RemeshResult` is a dataclass that captures the before/after statistics emitted by MMG. It is returned by the lower-level `mmgpy.mmg3d.remesh(...)` / `mmgpy.mmg2d.remesh(...)` / `mmgpy.mmgs.remesh(...)` functions; the `.mmg` accessor does the same work and returns a fresh PyVista dataset, with quality numbers accessible via `dataset.mmg.element_qualities()` and validation via `dataset.mmg.validate(...)`.

::: mmgpy.RemeshResult
options:
show_root_heading: true

### Usage

```python
import pyvista as pv
import mmgpy  # noqa: F401  -- registers reader/writer + accessor

mesh = pv.read("input.mesh")
remeshed = mesh.mmg.remesh(hmax=0.1)

# Before/after sizes
print(f"Vertices: {mesh.n_points} -> {remeshed.n_points}")
print(f"Cells:    {mesh.n_cells} -> {remeshed.n_cells}")

# MMG in-radius-ratio quality (1.0 = equilateral)
q_before = mesh.mmg.element_qualities()
q_after = remeshed.mmg.element_qualities()
print(f"Min quality:  {q_before.min():.3f} -> {q_after.min():.3f}")
print(f"Mean quality: {q_before.mean():.3f} -> {q_after.mean():.3f}")
```

If you need the structured `RemeshResult` (return code, MMG warnings, duration), reach for the underlying module-level entry points:

<!-- pytest-codeblocks:skip -->

```python
from mmgpy import mmg3d
result = mmg3d.remesh("input.mesh", "output.mesh", hmax=0.1)
print(f"Return code: {result.return_code}")
print(f"Duration:    {result.duration_seconds:.2f}s")
for warning in result.warnings:
    print(f"Warning: {warning}")
```

## Validation Classes

### ValidationReport

::: mmgpy.ValidationReport
options:
show_root_heading: true

### ValidationIssue

::: mmgpy.ValidationIssue
options:
show_root_heading: true

### QualityStats

::: mmgpy.QualityStats
options:
show_root_heading: true

### IssueSeverity

::: mmgpy.IssueSeverity
options:
show_root_heading: true

### ValidationError

::: mmgpy.ValidationError
options:
show_root_heading: true

## Validation Usage

### Quick Validation

```python
import pyvista as pv
import mmgpy  # noqa: F401

mesh = pv.read("input.mesh")

# Returns True/False
if mesh.mmg.validate():
    print("Mesh is valid")
else:
    print("Mesh has issues")
```

### Detailed Validation

<!-- pytest-codeblocks:cont -->

```python
report = mesh.mmg.validate(detailed=True)

print(f"Valid: {report.is_valid}")
print(f"Quality min:  {report.quality.min:.3f}")
print(f"Quality max:  {report.quality.max:.3f}")
print(f"Quality mean: {report.quality.mean:.3f}")
print(f"Quality std:  {report.quality.std:.3f}")

for issue in report.issues:
    print(f"[{issue.severity.name}] {issue.message}")
```

### Strict Validation

<!-- pytest-codeblocks:cont -->

```python
from mmgpy import ValidationError

try:
    mesh.mmg.validate(strict=True)
    print("Mesh passed strict validation")
except ValidationError as e:
    print(f"Validation failed: {e}")
    for issue in e.report.issues:
        print(f"  - {issue.message}")
```

### Selective Validation

<!-- pytest-codeblocks:cont -->

```python
# Only check geometry
report = mesh.mmg.validate(
    detailed=True,
    check_geometry=True,
    check_topology=False,
    check_quality=False,
)

# Only check quality with a custom threshold
report = mesh.mmg.validate(
    detailed=True,
    check_geometry=False,
    check_topology=False,
    check_quality=True,
    min_quality=0.2,
)
```

## Complete Example

```python
import pyvista as pv
import mmgpy  # noqa: F401
from mmgpy import ValidationError

mesh = pv.read("input.mesh")

initial = mesh.mmg.validate(detailed=True)
print(f"Initial quality: {initial.quality.mean:.3f}")
if not initial.is_valid:
    for issue in initial.issues:
        print(f"  - {issue.message}")

remeshed = mesh.mmg.remesh(hmax=0.1, verbose=-1)

try:
    remeshed.mmg.validate(strict=True)
    print("Remeshed mesh is valid")
except ValidationError as e:
    print(f"Remeshed mesh has issues: {len(e.report.issues)}")

final = remeshed.mmg.validate(detailed=True)
print(f"Quality improved: {initial.quality.mean:.3f} -> {final.quality.mean:.3f}")
```
