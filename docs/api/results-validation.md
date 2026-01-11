# Results & Validation

This page documents the result and validation classes returned by mmgpy operations.

## RemeshResult

Every remeshing operation returns a `RemeshResult` dataclass with statistics:

::: mmgpy.RemeshResult
options:
show_root_heading: true

### Usage

```python
import mmgpy

mesh = mmgpy.read("input.mesh")
result = mesh.remesh(hmax=0.1)

# Access statistics
print(f"Vertices: {result.vertices_before} -> {result.vertices_after}")
print(f"Elements: {result.elements_before} -> {result.elements_after}")
print(f"Triangles: {result.triangles_before} -> {result.triangles_after}")
print(f"Edges: {result.edges_before} -> {result.edges_after}")

# Quality metrics
print(f"Min quality: {result.quality_min_before:.3f} -> {result.quality_min_after:.3f}")
print(f"Mean quality: {result.quality_mean_before:.3f} -> {result.quality_mean_after:.3f}")

# Timing
print(f"Duration: {result.duration_seconds:.2f}s")

# Warnings from MMG
for warning in result.warnings:
    print(f"Warning: {warning}")

# Return code
print(f"Return code: {result.return_code}")
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
import mmgpy

mesh = mmgpy.read("input.mesh")

# Returns True/False
if mesh.validate():
    print("Mesh is valid")
else:
    print("Mesh has issues")
```

### Detailed Validation

```python
report = mesh.validate(detailed=True)

print(f"Valid: {report.is_valid}")
print(f"Vertices: {report.n_vertices}")
print(f"Elements: {report.n_elements}")
print(f"Triangles: {report.n_triangles}")

# Quality statistics
print(f"Quality min: {report.quality.min:.3f}")
print(f"Quality max: {report.quality.max:.3f}")
print(f"Quality mean: {report.quality.mean:.3f}")
print(f"Quality std: {report.quality.std:.3f}")

# Issues
for issue in report.issues:
    print(f"[{issue.severity.name}] {issue.message}")
```

### Strict Validation

```python
from mmgpy import ValidationError

try:
    mesh.validate(strict=True)
    print("Mesh passed strict validation")
except ValidationError as e:
    print(f"Validation failed: {e}")
    for issue in e.report.issues:
        print(f"  - {issue.message}")
```

### Selective Validation

```python
# Only check geometry
report = mesh.validate(
    detailed=True,
    check_geometry=True,
    check_topology=False,
    check_quality=False,
)

# Only check quality with custom threshold
report = mesh.validate(
    detailed=True,
    check_geometry=False,
    check_topology=False,
    check_quality=True,
    min_quality=0.2,  # Custom threshold
)
```

## Complete Example

```python
import mmgpy
from mmgpy import ValidationError

# Load mesh
mesh = mmgpy.read("input.mesh")

# Initial validation
initial = mesh.validate(detailed=True)
print(f"Initial quality: {initial.quality.mean:.3f}")

if not initial.is_valid:
    print("Initial mesh has issues:")
    for issue in initial.issues:
        print(f"  - {issue.message}")

# Remesh
result = mesh.remesh(hmax=0.1, verbose=-1)

# Post-remesh validation
try:
    mesh.validate(strict=True)
    print("Remeshed mesh is valid")
except ValidationError as e:
    print(f"Remeshed mesh has issues: {len(e.report.issues)}")

# Final report
final = mesh.validate(detailed=True)
print(f"\nQuality improved: {initial.quality.mean:.3f} -> {final.quality.mean:.3f}")
print(f"Elements: {initial.n_elements} -> {final.n_elements}")
```
