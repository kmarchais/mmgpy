"""Tests for ``.github/scripts/sync_versions.py``.

The script lives outside the importable package, so we load it via
``importlib`` from its path.
"""

from __future__ import annotations

import importlib.util
import sys
from pathlib import Path
from types import ModuleType

import pytest

REPO_ROOT = Path(__file__).resolve().parent.parent
SCRIPT_PATH = REPO_ROOT / ".github" / "scripts" / "sync_versions.py"


def _load_module() -> ModuleType:
    spec = importlib.util.spec_from_file_location("sync_versions", SCRIPT_PATH)
    assert spec is not None
    assert spec.loader is not None
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


@pytest.fixture(scope="module")
def sv() -> ModuleType:
    """Load the sync_versions script as a module for read-only tests."""
    return _load_module()


@pytest.mark.parametrize(
    ("pep440", "semver"),
    [
        ("0.14.0", "0.14.0"),
        ("0.14.0.dev0", "0.14.0-dev.0"),
        ("0.14.0.dev17", "0.14.0-dev.17"),
        ("0.6.0a1", "0.6.0-alpha.1"),
        ("0.6.0b2", "0.6.0-beta.2"),
        ("0.6.0rc1", "0.6.0-rc.1"),
        ("0.6.0.post1", "0.6.0-post.1"),
    ],
)
def test_python_to_semver(sv: ModuleType, pep440: str, semver: str) -> None:
    """Common PEP 440 forms map to the expected SemVer string."""
    assert sv.python_to_semver(pep440) == semver


def test_read_pyproject_version_matches_file(sv: ModuleType) -> None:
    """The script reads the live version straight out of pyproject.toml."""
    expected = None
    for line in (REPO_ROOT / "pyproject.toml").read_text(encoding="utf-8").splitlines():
        if line.startswith("version = "):
            expected = line.split('"')[1]
            break
    assert expected is not None
    assert sv.read_pyproject_version() == expected


def _stage_repo(
    tmp_path: Path, *, py_version: str, conda_version: str, blender_version: str
) -> None:
    """Create a minimal repo layout matching the script's path expectations."""
    (tmp_path / "pyproject.toml").write_text(
        f'[project]\nname = "demo"\nversion = "{py_version}"\n',
    )
    (tmp_path / "conda").mkdir()
    (tmp_path / "conda" / "recipe.yaml").write_text(
        f'context:\n  version: "{conda_version}"\n',
    )
    (tmp_path / "blender_mmgpy").mkdir()
    (tmp_path / "blender_mmgpy" / "blender_manifest.toml").write_text(
        f'schema_version = "1.0.0"\nversion = "{blender_version}"\n',
    )


def _patch_paths(sv: ModuleType, root: Path) -> None:
    sv.PYPROJECT = root / "pyproject.toml"
    sv.CONDA_RECIPE = root / "conda" / "recipe.yaml"
    sv.BLENDER_MANIFEST = root / "blender_mmgpy" / "blender_manifest.toml"


def test_set_rewrites_all_files(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    """``--set X.Y.Z`` rewrites pyproject, conda recipe, and Blender manifest."""
    sv = _load_module()
    _stage_repo(
        tmp_path,
        py_version="0.13.0.dev0",
        conda_version="0.13.0.dev0",
        blender_version="0.13.0-dev.0",
    )
    _patch_paths(sv, tmp_path)
    monkeypatch.setattr(sys, "argv", ["sync_versions.py", "--set", "0.14.0"])
    assert sv.main() == 0
    assert 'version = "0.14.0"' in sv.PYPROJECT.read_text()
    assert 'version: "0.14.0"' in sv.CONDA_RECIPE.read_text()
    assert 'version = "0.14.0"' in sv.BLENDER_MANIFEST.read_text()


def test_set_dev_version_converts_blender_to_semver(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """Setting a ``.devN`` PEP 440 version writes SemVer to the Blender manifest."""
    sv = _load_module()
    _stage_repo(
        tmp_path, py_version="0.13.0", conda_version="0.13.0", blender_version="0.13.0"
    )
    _patch_paths(sv, tmp_path)
    monkeypatch.setattr(sys, "argv", ["sync_versions.py", "--set", "0.15.0.dev0"])
    assert sv.main() == 0
    assert 'version = "0.15.0.dev0"' in sv.PYPROJECT.read_text()
    assert 'version: "0.15.0.dev0"' in sv.CONDA_RECIPE.read_text()
    assert 'version = "0.15.0-dev.0"' in sv.BLENDER_MANIFEST.read_text()


def test_default_sync_pulls_from_pyproject(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """No-argument run rewrites downstream files but leaves pyproject alone."""
    sv = _load_module()
    _stage_repo(
        tmp_path,
        py_version="0.14.0.dev0",
        conda_version="0.13.0",
        blender_version="0.13.0",
    )
    _patch_paths(sv, tmp_path)
    monkeypatch.setattr(sys, "argv", ["sync_versions.py"])
    assert sv.main() == 0
    assert 'version = "0.14.0.dev0"' in sv.PYPROJECT.read_text()
    assert 'version: "0.14.0.dev0"' in sv.CONDA_RECIPE.read_text()
    assert 'version = "0.14.0-dev.0"' in sv.BLENDER_MANIFEST.read_text()


def test_check_passes_when_in_sync(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """``--check`` exits 0 when downstream files match pyproject."""
    sv = _load_module()
    _stage_repo(
        tmp_path,
        py_version="0.14.0.dev0",
        conda_version="0.14.0.dev0",
        blender_version="0.14.0-dev.0",
    )
    _patch_paths(sv, tmp_path)
    monkeypatch.setattr(sys, "argv", ["sync_versions.py", "--check"])
    assert sv.main() == 0


def test_check_fails_on_drift(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """``--check`` exits 1 when the conda recipe drifts from pyproject."""
    sv = _load_module()
    _stage_repo(
        tmp_path,
        py_version="0.14.0.dev0",
        conda_version="0.13.0",
        blender_version="0.14.0-dev.0",
    )
    _patch_paths(sv, tmp_path)
    monkeypatch.setattr(sys, "argv", ["sync_versions.py", "--check"])
    assert sv.main() == 1


def test_check_rejects_invalid_pep440(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    """``--check`` exits 1 if pyproject's version is not valid PEP 440."""
    pytest.importorskip("packaging")
    sv = _load_module()
    _stage_repo(
        tmp_path,
        py_version="not-a-version",
        conda_version="not-a-version",
        blender_version="not-a-version",
    )
    _patch_paths(sv, tmp_path)
    monkeypatch.setattr(sys, "argv", ["sync_versions.py", "--check"])
    assert sv.main() == 1
