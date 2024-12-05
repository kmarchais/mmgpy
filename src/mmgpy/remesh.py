"""Python wrapper for the MMG remeshers."""

from __future__ import annotations

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from pathlib import Path

from ._mmgpy import (  # type: ignore[attr-defined]
    _remesh_2d,
    _remesh_3d,  # type: ignore[attr-defined]
    _remesh_s,
)


class mmg3d:  # noqa: N801
    """Wrapper for the MMG3D remesher."""

    @staticmethod
    def remesh(
        input_mesh: str | Path,
        input_sol: str | Path = "",
        output_mesh: str | Path = "output.mesh",
        output_sol: str | Path = "",
        options: dict[str, float | int] | None = None,
    ) -> bool:
        """Remesh a 3D mesh."""
        if options is None:
            options = {}
        return _remesh_3d(
            str(input_mesh),
            str(input_sol),
            str(output_mesh),
            str(output_sol),
            options,
        )


class mmg2d:  # noqa: N801
    """Wrapper for the MMG2D remesher."""

    @staticmethod
    def remesh(
        input_mesh: str | Path,
        input_sol: str | Path = "",
        output_mesh: str | Path = "output.mesh",
        output_sol: str | Path = "",
        options: dict[str, float | int] | None = None,
    ) -> bool:
        """Remesh a 2D mesh."""
        if options is None:
            options = {}
        return _remesh_2d(
            str(input_mesh),
            str(input_sol),
            str(output_mesh),
            str(output_sol),
            options,
        )


class mmgs:  # noqa: N801
    """Wrapper for the MMGS remesher."""

    @staticmethod
    def remesh(
        input_mesh: str | Path,
        input_sol: str | Path = "",
        output_mesh: str | Path = "output.mesh",
        output_sol: str | Path = "",
        options: dict[str, float | int] | None = None,
    ) -> bool:
        """Remesh a surface mesh."""
        if options is None:
            options = {}
        return _remesh_s(
            str(input_mesh),
            str(input_sol),
            str(output_mesh),
            str(output_sol),
            options,
        )
