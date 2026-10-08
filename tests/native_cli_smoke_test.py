"""Check installed wheel launchers against their bundled native executables."""

from __future__ import annotations

import shutil
import subprocess

from mmgpy._cli import _find_mmg_executable


def test_installed_native_commands() -> None:
    """Require all compatibility commands on PATH and preserve native help output."""
    for name in ("mmg2d", "mmg3d", "mmgs"):
        native = _find_mmg_executable(f"{name}_O3")
        assert native is not None, f"Missing native executable for {name}"
        expected = subprocess.run([native, "-h"], capture_output=True, check=False)
        assert b"MMG" in expected.stdout
        for command in (name, f"{name}_O3"):
            launcher = shutil.which(command)
            assert launcher is not None, f"{command} is missing from PATH"
            actual = subprocess.run(
                [launcher, "-h"],
                capture_output=True,
                check=False,
                timeout=30,
            )
            assert actual.returncode == expected.returncode
            # MMG prints elapsed time, which can differ between invocations.
            assert (
                actual.stdout.split(b"ELAPSED TIME")[0]
                == expected.stdout.split(b"ELAPSED TIME")[0]
            )
            assert actual.stderr == expected.stderr


if __name__ == "__main__":
    test_installed_native_commands()
