"""Entry point for running mmgpy as a module.

This enables usage like:
    python -m mmgpy mesh.stl -o remeshed.stl
    uvx mmgpy mesh.stl -o remeshed.stl
"""

from __future__ import annotations

from . import _run_mmg

if __name__ == "__main__":
    _run_mmg()
