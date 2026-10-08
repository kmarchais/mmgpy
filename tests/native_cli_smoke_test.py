"""Check installed wheel launchers against their bundled native executables."""

from __future__ import annotations

import os
import shutil
import subprocess
from pathlib import Path

import mmgpy
from mmgpy._cli import _find_mmg_executable

if __name__ != "__main__":
    import pytest

    pytestmark = pytest.mark.skipif(
        Path(mmgpy.__file__).parent.parent.name == "src",
        reason="Wheel smoke check requires an installed wheel, not an editable build",
    )


def test_installed_native_commands() -> None:
    """Require all compatibility commands on PATH and preserve native help output."""
    environment = os.environ.copy()
    # Free-threaded Python warns when importing the GIL-dependent extension.
    # Ignore only that interpreter warning when comparing native stderr.
    gil_warning = (
        "ignore:The global interpreter lock (GIL) has been enabled to load module "
        "'mmgpy._mmgpy':RuntimeWarning"
    )
    environment["PYTHONWARNINGS"] = ",".join(
        filter(None, (environment.get("PYTHONWARNINGS", ""), gil_warning)),
    )
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
                env=environment,
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
