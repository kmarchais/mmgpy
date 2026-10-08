"""Regression coverage for native MMG compatibility launchers."""

from __future__ import annotations

import subprocess
import sys
import zipfile
from pathlib import Path

import pytest

from mmgpy import _cli


@pytest.mark.parametrize(("returncode", "expected"), [(0, 0), (2, 2), (-15, 143)])
@pytest.mark.parametrize(
    ("runner", "base_name"),
    [
        (_cli._run_mmg2d, "mmg2d_O3"),
        (_cli._run_mmg3d, "mmg3d_O3"),
        (_cli._run_mmgs, "mmgs_O3"),
    ],
)
def test_native_arguments_and_exit_code(
    monkeypatch,
    returncode,
    expected,
    runner,
    base_name,
):
    """Forward unknown native options, paths with spaces, and failure status."""
    monkeypatch.setattr(_cli, "_find_mmg_executable", lambda name: f"/native/{name}")
    monkeypatch.setattr(
        _cli.sys, "argv", [base_name, "-in", "mesh with spaces.mesh", "-nofem"]
    )
    calls = []

    def run(command, *, check):
        calls.append((command, check))
        return subprocess.CompletedProcess(command, returncode)

    monkeypatch.setattr(_cli.subprocess, "run", run)
    assert runner() == expected
    assert calls == [
        ([f"/native/{base_name}", "-in", "mesh with spaces.mesh", "-nofem"], False)
    ]


def test_missing_binary_does_not_run_launcher(monkeypatch, tmp_path):
    """Avoid recursively invoking a console script when the native binary is absent."""
    launcher = tmp_path / "mmg3d_O3"
    launcher.write_text("#!/usr/bin/python\n" + "# launcher\n" * 200)
    launcher.chmod(0o755)
    for strategy in (
        "_find_in_package_bin",
        "_find_in_site_packages_bin",
        "_find_in_venv_bin",
        "_find_in_build_dir",
    ):
        monkeypatch.setattr(_cli, strategy, lambda _: None)
    monkeypatch.setattr(_cli.os, "get_exec_path", lambda: [str(tmp_path)])
    assert _cli._run_mmg3d() == 127


def test_windows_launcher_is_not_a_native_executable(tmp_path):
    """Recognize Windows entry-point executables regardless of their size."""
    launcher = tmp_path / "mmg3d_O3.exe"
    launcher.write_bytes(b"MZ" + b"\0" * 2048)
    with zipfile.ZipFile(launcher, "a") as archive:
        archive.writestr("__main__.py", "from mmgpy._cli import _run_mmg3d")
    assert _cli._is_cli_launcher(launcher)


def test_path_search_continues_past_own_launcher(monkeypatch, tmp_path):
    """Find a system MMG binary even when our launcher occurs first on PATH."""
    filename = "mmg3d_O3.exe" if sys.platform == "win32" else "mmg3d_O3"
    paths = [tmp_path / "scripts", tmp_path / "system"]
    for directory in paths:
        directory.mkdir()
    launcher = paths[0] / filename
    launcher.write_bytes(b"#!/usr/bin/python\n")
    native = paths[1] / filename
    native.write_bytes(b"native executable")
    for path in (launcher, native):
        path.chmod(0o755)
    for strategy in (
        "_find_in_package_bin",
        "_find_in_site_packages_bin",
        "_find_in_venv_bin",
        "_find_in_build_dir",
    ):
        monkeypatch.setattr(_cli, strategy, lambda _: None)
    monkeypatch.setattr(_cli.os, "get_exec_path", lambda: list(map(str, paths)))
    assert Path(_cli._find_mmg_executable("mmg3d_O3")) == native
