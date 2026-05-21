"""Regression test for the heavy-dep-free import subset.

The Blender add-on ships mmgpy without bundling pyvista/vtk/scipy/matplotlib
wheels. This test pins the contract that ``import mmgpy`` plus access to the
headless public API does not pull any of those heavy deps into
``sys.modules``. The heavy deps load only on first access to the lazy names
exposed via the module's ``__getattr__``.

Runs in a subprocess because ``tests/conftest.py`` imports pyvista at
collection time, so any in-process check would observe it already loaded.
"""

from __future__ import annotations

import subprocess
import sys
import textwrap

HEADLESS_PROBE = textwrap.dedent(
    """
    import sys

    import mmgpy

    # Touch the headless public API surface. Any name that should remain
    # available in the slim Blender subset (no pyvista, no scipy) goes here.
    _ = mmgpy.MMG_VERSION
    _ = mmgpy.__version__
    _ = mmgpy.mmg2d
    _ = mmgpy.mmg3d
    _ = mmgpy.mmgs
    _ = mmgpy.SolPaths
    _ = mmgpy.Mmg2DOptions
    _ = mmgpy.Mmg3DOptions
    _ = mmgpy.MmgSOptions
    _ = mmgpy.MmgMesh2D
    _ = mmgpy.MmgMesh3D
    _ = mmgpy.MmgMeshS
    _ = mmgpy.RemeshResult
    _ = mmgpy.CancellationError
    _ = mmgpy.ProgressEvent
    _ = mmgpy.rich_progress
    _ = mmgpy.progress
    _ = mmgpy.sizing
    _ = mmgpy.apply_sizing_constraints
    _ = mmgpy.BoxSize
    _ = mmgpy.CylinderSize
    _ = mmgpy.PointSize
    _ = mmgpy.SphereSize
    _ = mmgpy.SizingConstraint
    _ = mmgpy.configure_logging
    _ = mmgpy.enable_debug

    heavy_deps = ("pyvista", "vtk", "vtkmodules", "scipy", "rich", "matplotlib")
    leaked = sorted(
        m for m in sys.modules
        if any(m == d or m.startswith(d + ".") for d in heavy_deps)
    )
    if leaked:
        print("LEAKED:" + ",".join(leaked))
        raise SystemExit(1)

    # Scipy-coupled lazy access. None loaded yet.
    _ = mmgpy.move_mesh
    _ = mmgpy.propagate_displacement
    _ = mmgpy.propagate_displacement_elasticity
    _ = mmgpy.detect_boundary_vertices
    _ = mmgpy.transfer_fields
    _ = mmgpy.interpolate_field
    _ = mmgpy.lagrangian
    _ = mmgpy.metrics
    _ = mmgpy.repair
    _ = mmgpy.IssueSeverity
    _ = mmgpy.QualityStats
    _ = mmgpy.ValidationError
    _ = mmgpy.ValidationIssue
    _ = mmgpy.ValidationReport
    if "scipy" not in sys.modules:
        print("LAZY FAILED: scipy not loaded after move_mesh access")
        raise SystemExit(2)
    if "pyvista" in sys.modules:
        print("LEAKED: pyvista loaded via scipy-only path")
        raise SystemExit(3)

    # PyVista-coupled lazy access.
    _ = mmgpy.read
    _ = mmgpy.MeshKind
    _ = mmgpy.from_pyvista
    _ = mmgpy.to_pyvista
    _ = mmgpy.polydata_from_2d_triangles
    _ = mmgpy.reorder_cuthill_mckee
    _ = mmgpy.interactive
    if "pyvista" not in sys.modules:
        print("LAZY FAILED: pyvista not loaded after read access")
        raise SystemExit(4)

    print("OK")
    """
)


def test_headless_subset_does_not_import_heavy_deps() -> None:
    """``import mmgpy`` + headless attr access must not load heavy deps."""
    result = subprocess.run(
        [sys.executable, "-c", HEADLESS_PROBE],
        capture_output=True,
        text=True,
        check=False,
    )
    assert result.returncode == 0, (
        f"headless probe failed (rc={result.returncode})\n"
        f"--- stdout ---\n{result.stdout}\n"
        f"--- stderr ---\n{result.stderr}"
    )
    assert result.stdout.strip().endswith("OK"), result.stdout
