"""Python wrappers for C++ remesh functions with format conversion.

The C++ remesh functions only support native MMG formats (.mesh, .meshb).
These wrappers transparently convert non-native formats (e.g. .vtk, .vtu)
by reading via ``mmgpy.read()`` (meshio), remeshing in-memory, and saving
via ``Mesh.save()`` (meshio).  No temporary files are created.
"""

from __future__ import annotations

import warnings
from pathlib import Path
from typing import TYPE_CHECKING, Any

from mmgpy._mmgpy import mmg2d as _mmg2d_cpp
from mmgpy._mmgpy import mmg3d as _mmg3d_cpp
from mmgpy._mmgpy import mmgs as _mmgs_cpp

if TYPE_CHECKING:
    from collections.abc import Callable

_NATIVE_MESH_EXTENSIONS = frozenset({".mesh", ".meshb"})


def _is_native(path: str | Path | None) -> bool:
    if path is None:
        return True
    return Path(path).suffix.lower() in _NATIVE_MESH_EXTENSIONS


def _wrapped_remesh(
    cpp_remesh: Callable[..., bool],
    input_mesh: str | Path,
    input_sol: str | Path | None = None,
    output_mesh: str | Path | None = None,
    output_sol: str | Path | None = None,
    options: dict[str, Any] | None = None,
) -> bool:
    input_native = _is_native(input_mesh)
    output_native = _is_native(output_mesh)

    if input_native and output_native:
        return cpp_remesh(
            input_mesh,
            input_sol,
            output_mesh,
            output_sol,
            options or {},
        )

    # Non-native format detected — use the in-memory remesh path.
    # mmgpy.read() handles any format via meshio, Mesh.remesh() works
    # in-memory, and Mesh.save() converts back via meshio.
    if input_sol is not None:
        warnings.warn(
            "input_sol is ignored for non-native formats; "
            "solution data must be embedded in the mesh file or set via Mesh API",
            stacklevel=3,
        )
    if output_sol is not None:
        warnings.warn(
            "output_sol is ignored for non-native formats; "
            "use Mesh.save() to write the result in the desired format",
            stacklevel=3,
        )

    from mmgpy._io import read as _read  # noqa: PLC0415

    mesh = _read(input_mesh)
    mesh.remesh(progress=False, **(options or {}))

    if output_mesh is not None:
        mesh.save(output_mesh)

    return True


class mmg3d:
    """3D mesh remeshing."""

    @staticmethod
    def remesh(
        input_mesh: str | Path,
        input_sol: str | Path | None = None,
        output_mesh: str | Path | None = None,
        output_sol: str | Path | None = None,
        options: dict[str, Any] | None = None,
    ) -> bool:
        """Remesh a 3D mesh.

        Parameters
        ----------
        input_mesh : str or Path
            Input mesh file. Any format supported by meshio.
        input_sol : str or Path, optional
            Input solution file (.sol/.solb).
        output_mesh : str or Path, optional
            Output mesh file. Any format supported by meshio.
        output_sol : str or Path, optional
            Output solution file (.sol/.solb).
        options : dict, optional
            Remeshing options (hmax, hmin, hausd, etc.).

        Returns
        -------
        bool
            True if remeshing succeeded.

        """
        return _wrapped_remesh(
            _mmg3d_cpp.remesh,
            input_mesh,
            input_sol,
            output_mesh,
            output_sol,
            options,
        )


class mmg2d:
    """2D mesh remeshing."""

    @staticmethod
    def remesh(
        input_mesh: str | Path,
        input_sol: str | Path | None = None,
        output_mesh: str | Path | None = None,
        output_sol: str | Path | None = None,
        options: dict[str, Any] | None = None,
    ) -> bool:
        """Remesh a 2D mesh.

        Parameters
        ----------
        input_mesh : str or Path
            Input mesh file. Any format supported by meshio.
        input_sol : str or Path, optional
            Input solution file (.sol/.solb).
        output_mesh : str or Path, optional
            Output mesh file. Any format supported by meshio.
        output_sol : str or Path, optional
            Output solution file (.sol/.solb).
        options : dict, optional
            Remeshing options (hmax, hmin, hausd, etc.).

        Returns
        -------
        bool
            True if remeshing succeeded.

        """
        return _wrapped_remesh(
            _mmg2d_cpp.remesh,
            input_mesh,
            input_sol,
            output_mesh,
            output_sol,
            options,
        )


class mmgs:
    """Surface mesh remeshing."""

    @staticmethod
    def remesh(
        input_mesh: str | Path,
        input_sol: str | Path | None = None,
        output_mesh: str | Path | None = None,
        output_sol: str | Path | None = None,
        options: dict[str, Any] | None = None,
    ) -> bool:
        """Remesh a surface mesh.

        Parameters
        ----------
        input_mesh : str or Path
            Input mesh file. Any format supported by meshio.
        input_sol : str or Path, optional
            Input solution file (.sol/.solb).
        output_mesh : str or Path, optional
            Output mesh file. Any format supported by meshio.
        output_sol : str or Path, optional
            Output solution file (.sol/.solb).
        options : dict, optional
            Remeshing options (hmax, hmin, hausd, etc.).

        Returns
        -------
        bool
            True if remeshing succeeded.

        """
        return _wrapped_remesh(
            _mmgs_cpp.remesh,
            input_mesh,
            input_sol,
            output_mesh,
            output_sol,
            options,
        )
