"""Run the lockfile's development tools without compiling the native package."""

import subprocess
from pathlib import Path

import tomllib


def main() -> None:
    """Match hook isolation while testing the tool versions being updated."""
    packages = tomllib.loads(Path("uv.lock").read_text())["package"]
    versions = {p["name"]: p["version"] for p in packages}
    for tool, args in (
        ("prek", ["run", "--all-files"]),
        ("ty", ["check", "src/mmgpy/"]),
    ):
        subprocess.run(  # noqa: S603 - fixed tool commands, no shell
            ["uv", "tool", "run", "--from", f"{tool}=={versions[tool]}", tool, *args],  # noqa: S607
            check=True,
        )


if __name__ == "__main__":
    main()
