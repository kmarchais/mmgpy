"""Regression tests over example scripts.

Each example is run end to end. Examples that produce a single static
PyVista frame are checked against committed baselines in
``tests/image_cache/`` via the ``verify_image_cache`` fixture from
pytest-pyvista. The remaining examples (matplotlib-only, interactive
animations, widget-based) are smoke-tested only.

The skip set matches ``build-and-test.yml`` and ``daily-docs-test.yml``:
examples that need missing assets or a display server.
"""

from __future__ import annotations

import runpy
import subprocess
from pathlib import Path

import pytest

REPO = Path(__file__).resolve().parent.parent
EXAMPLES_DIR = REPO / "examples"

# Examples skipped in CI (matches the workflow skip lists).
SKIP_RELATIVE = frozenset(
    {
        "ui/basic_ui.py",
    },
)

# Examples that produce a single static PyVista frame via ``Plotter.show()``.
# These are diffed against committed baselines in ``tests/image_cache/``.
# Baselines are generated in CI (OSMesa, Python 3.14) via the
# ``update-image-baselines`` workflow, so they match the renderer used by
# build-and-test; locally-generated baselines often exceed the 500-pixel
# threshold across renderers.
#
# Examples kept out of the regression set:
#   - ``mmgs/ellipsoid_sdf.py``: runs MMG three times with different
#     extraction methods, producing compounded non-determinism above the
#     regression threshold across runs.
#   - ``mmg3d/hessian_adaptation.py``, ``mmg3d/lagrangian_motion.py``,
#     ``mmg3d/mesh_quality_improvement.py``,
#     ``mmgs/mechanical_piece_remeshing.py``: pending CI-rendered
#     baselines via the ``update-image-baselines`` workflow (locally
#     generated baselines exceeded the threshold under OSMesa).
STATIC_PYVISTA = frozenset(
    {
        "mmg2d/levelset_discretization.py",
        "mmg2d/mesh_adaptation_to_a_solution.py",
        "mmg3d/ellipsoid_levelset.py",
        "mmg3d/levelset_discretization.py",
        "mmg3d/open_boundary_remeshing.py",
        "mmgs/smooth_surface_remeshing.py",
    },
)


def _tracked_examples() -> list[str]:
    """Discover example scripts via git so untracked files aren't picked up."""
    result = subprocess.run(
        ["git", "-C", str(REPO), "ls-files", "examples/"],
        capture_output=True,
        text=True,
        check=True,
    )
    relative = [
        line[len("examples/") :]
        for line in result.stdout.splitlines()
        if line.endswith(".py")
    ]
    return sorted(r for r in relative if r not in SKIP_RELATIVE)


@pytest.fixture
def isolated_examples(tmp_path: Path) -> Path:
    """Mirror examples/ and assets/ into ``tmp_path`` via symlinks.

    Examples often write outputs next to themselves via
    ``Path(__file__).parent``, and reach into ``../../assets`` for input
    meshes. Running them in a tmp tree keeps the repo clean while
    preserving those relative references.
    """
    for src in EXAMPLES_DIR.rglob("*.py"):
        dst = tmp_path / src.relative_to(REPO)
        dst.parent.mkdir(parents=True, exist_ok=True)
        dst.symlink_to(src.resolve())
    (tmp_path / "assets").symlink_to((REPO / "assets").resolve())
    return tmp_path


def _run(rel: str, root: Path) -> None:
    runpy.run_path(
        str(root / "examples" / rel),
        run_name="__main__",
    )


_ALL = _tracked_examples()
_STATIC = [r for r in _ALL if r in STATIC_PYVISTA]
_SMOKE = [r for r in _ALL if r not in STATIC_PYVISTA]


def _id(rel: str) -> str:
    return Path(rel).with_suffix("").as_posix().replace("/", "-")


@pytest.mark.parametrize("rel", _STATIC, ids=[_id(r) for r in _STATIC])
def test_pyvista_example(
    rel: str,
    isolated_examples: Path,
    verify_image_cache,  # noqa: ARG001
) -> None:
    """Run a PyVista example and diff its show() against a baseline."""
    _run(rel, isolated_examples)


@pytest.mark.parametrize("rel", _SMOKE, ids=[_id(r) for r in _SMOKE])
def test_smoke_example(rel: str, isolated_examples: Path) -> None:
    """Run a non-static example end to end and assert it exits 0."""
    _run(rel, isolated_examples)
