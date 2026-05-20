"""Regression test for the PyVista-free import subset.

The Blender add-on ships mmgpy without bundling pyvista/vtk wheels. This
test pins the contract that ``import mmgpy`` plus access to the headless
public API does not pull pyvista (or vtk) into ``sys.modules``. PyVista
is only loaded on first access to the pyvista-coupled names exposed via
the module's ``__getattr__``.

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
    # available in the PyVista-free Blender subset goes here.
    _ = mmgpy.MMG_VERSION
    _ = mmgpy.__version__
    _ = mmgpy.mmg2d
    _ = mmgpy.mmg3d
    _ = mmgpy.mmgs
    _ = mmgpy.SolPaths
    _ = mmgpy.Mmg2DOptions
    _ = mmgpy.Mmg3DOptions
    _ = mmgpy.MmgSOptions
    _ = mmgpy.RemeshResult
    _ = mmgpy.ValidationReport
    _ = mmgpy.QualityStats
    _ = mmgpy.IssueSeverity
    _ = mmgpy.ValidationError
    _ = mmgpy.ValidationIssue
    _ = mmgpy.CancellationError
    _ = mmgpy.ProgressEvent
    _ = mmgpy.rich_progress
    _ = mmgpy.transfer_fields
    _ = mmgpy.interpolate_field
    _ = mmgpy.lagrangian
    _ = mmgpy.metrics
    _ = mmgpy.progress
    _ = mmgpy.repair
    _ = mmgpy.sizing
    _ = mmgpy.move_mesh
    _ = mmgpy.propagate_displacement
    _ = mmgpy.propagate_displacement_elasticity
    _ = mmgpy.detect_boundary_vertices
    _ = mmgpy.apply_sizing_constraints
    _ = mmgpy.BoxSize
    _ = mmgpy.CylinderSize
    _ = mmgpy.PointSize
    _ = mmgpy.SphereSize
    _ = mmgpy.SizingConstraint
    _ = mmgpy.configure_logging
    _ = mmgpy.enable_debug

    leaked = sorted(
        m for m in sys.modules
        if m == "pyvista"
        or m.startswith("pyvista.")
        or m == "vtk"
        or m.startswith("vtk.")
        or m.startswith("vtkmodules")
    )
    if leaked:
        print("LEAKED:" + ",".join(leaked))
        raise SystemExit(1)

    # Lazy access must succeed and now pyvista is allowed.
    _ = mmgpy.read
    _ = mmgpy.MeshKind
    _ = mmgpy.from_pyvista
    _ = mmgpy.to_pyvista
    _ = mmgpy.polydata_from_2d_triangles
    _ = mmgpy.reorder_cuthill_mckee
    _ = mmgpy.interactive
    if "pyvista" not in sys.modules:
        print("LAZY FAILED: pyvista not loaded after read access")
        raise SystemExit(2)

    print("OK")
    """
)


def test_headless_subset_does_not_import_pyvista() -> None:
    """``import mmgpy`` + headless API access must not load pyvista or vtk."""
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
