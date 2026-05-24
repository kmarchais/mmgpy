"""Unit tests for ``.github/scripts/strip_blender_wheel_metadata.py``.

The script lives outside the package import path, so it is loaded by file
location. The tests cover the pure functions (METADATA rewrite, RECORD
rewrite, PEP 503 normalisation) without going through a real wheel
round-trip; the CI workflow's "verify slim contract" step already
exercises the integration path.
"""

from __future__ import annotations

import base64
import hashlib
import importlib.util
from pathlib import Path
from types import ModuleType

import pytest

_SCRIPT_PATH = (
    Path(__file__).resolve().parent.parent
    / ".github"
    / "scripts"
    / "strip_blender_wheel_metadata.py"
)


def _load_module() -> ModuleType:
    spec = importlib.util.spec_from_file_location(
        "strip_blender_wheel_metadata",
        _SCRIPT_PATH,
    )
    assert spec is not None
    assert spec.loader is not None
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


strip_mod = _load_module()


# Real METADATA stanza taken from an actual mmgpy wheel, plus extras at the
# bottom that should survive the rewrite unchanged. Keeping this realistic
# (Metadata-Version, mixed pkg name normalisations, environment markers)
# protects against regex regressions on punctuation we'd otherwise miss.
METADATA_INPUT = """\
Metadata-Version: 2.4
Name: mmgpy
Version: 0.15.0
Summary: Adaptive surface remeshing via the MMG library
Requires-Python: >=3.10
Requires-Dist: numpy<3,>=2.0.2
Requires-Dist: patchelf<1,>=0.17.2.4; sys_platform == "linux"
Requires-Dist: pyvista<1,>=0.48
Requires-Dist: rich<15,>=13.0.0
Requires-Dist: scipy<2,>=1.11.0
Requires-Dist: typing-extensions<5,>=4.0.0; python_version < "3.11"
Requires-Dist: trame<4,>=3.12.0; extra == "ui"
Requires-Dist: pywebview<7,>=6.1; extra == "ui"
"""


def test_rewrite_metadata_strips_heavy_deps() -> None:
    """``rich`` and ``patchelf`` are removed from ``Requires-Dist``."""
    result = strip_mod.rewrite_metadata(METADATA_INPUT)
    for forbidden in ("rich", "patchelf"):
        assert f"Requires-Dist: {forbidden}" not in result, forbidden


def test_rewrite_metadata_preserves_non_strip_deps() -> None:
    """Deps that aren't in ``STRIP_DEPS`` (pyvista/scipy/typing-extensions) survive.

    pyvista and scipy are no longer in the published wheel's Requires-Dist
    anyway (both opt-in via extras / direct install). typing-extensions is
    environment-conditional on ``python_version < '3.11'``. None of them
    needs stripping by this script, and stripping unknown deps would be a
    bug, so we explicitly pin the surviving-line contract.
    """
    result = strip_mod.rewrite_metadata(METADATA_INPUT)
    for kept in (
        "Requires-Dist: pyvista<1,>=0.48",
        "Requires-Dist: scipy<2,>=1.11.0",
        'Requires-Dist: typing-extensions<5,>=4.0.0; python_version < "3.11"',
    ):
        assert kept in result, kept


def test_rewrite_metadata_loosens_numpy() -> None:
    """The numpy pin is replaced with the Blender-friendly ``>=1.26,<3`` range."""
    result = strip_mod.rewrite_metadata(METADATA_INPUT)
    assert "Requires-Dist: numpy<3,>=2.0.2" not in result
    assert "Requires-Dist: numpy>=1.26,<3\n" in result


def test_rewrite_metadata_preserves_extras() -> None:
    """``extra == "..."`` lines are untouched (not installed by Blender anyway)."""
    result = strip_mod.rewrite_metadata(METADATA_INPUT)
    assert 'Requires-Dist: trame<4,>=3.12.0; extra == "ui"' in result
    assert 'Requires-Dist: pywebview<7,>=6.1; extra == "ui"' in result


def test_rewrite_metadata_preserves_headers() -> None:
    """Non-``Requires-Dist`` headers (Name, Version, etc.) pass through verbatim."""
    result = strip_mod.rewrite_metadata(METADATA_INPUT)
    for header in (
        "Metadata-Version: 2.4",
        "Name: mmgpy",
        "Version: 0.15.0",
        "Requires-Python: >=3.10",
    ):
        assert header in result, header


def test_rewrite_metadata_raises_when_numpy_missing() -> None:
    """Refuse to silently drop numpy from a wheel that depends on it."""
    no_numpy = "\n".join(
        line
        for line in METADATA_INPUT.splitlines()
        if not line.startswith("Requires-Dist: numpy")
    )
    with pytest.raises(SystemExit, match="numpy"):
        strip_mod.rewrite_metadata(no_numpy + "\n")


def _b64_sha256(data: bytes) -> str:
    return (
        "sha256="
        + base64
        .urlsafe_b64encode(
            hashlib.sha256(data).digest(),
        )
        .rstrip(b"=")
        .decode()
    )


def test_rewrite_record_updates_metadata_entry() -> None:
    """The METADATA line's hash and size are refreshed; other lines pass through."""
    new_metadata = b"a fresh metadata body"
    record = (
        "mmgpy/__init__.py,sha256=abc,123\n"
        "mmgpy-0.15.0.dist-info/METADATA,sha256=oldhash,999\n"
        "mmgpy-0.15.0.dist-info/RECORD,,\n"
    )
    result = strip_mod.rewrite_record(
        record,
        "mmgpy-0.15.0.dist-info/METADATA",
        new_metadata,
    )
    expected_hash = _b64_sha256(new_metadata)
    expected_size = str(len(new_metadata))
    assert f"mmgpy-0.15.0.dist-info/METADATA,{expected_hash},{expected_size}" in result
    # Other lines untouched.
    assert "mmgpy/__init__.py,sha256=abc,123" in result
    assert "mmgpy-0.15.0.dist-info/RECORD,," in result


def test_rewrite_record_raises_when_metadata_path_missing() -> None:
    """Refuse to silently produce a RECORD without an updated METADATA entry."""
    record = "mmgpy/__init__.py,sha256=abc,123\n"
    with pytest.raises(SystemExit, match="no entry"):
        strip_mod.rewrite_record(
            record,
            "mmgpy-0.15.0.dist-info/METADATA",
            b"body",
        )


@pytest.mark.parametrize(
    ("raw", "expected"),
    [
        ("typing_extensions", "typing-extensions"),
        ("typing-extensions", "typing-extensions"),
        ("Typing.Extensions", "typing-extensions"),
        ("PyVista", "pyvista"),
        ("numpy", "numpy"),
    ],
)
def test_normalize_pep503(raw: str, expected: str) -> None:
    """Names match PEP 503: lower-case, with ``-``/``_``/``.`` collapsed to ``-``."""
    assert strip_mod._normalize(raw) == expected
