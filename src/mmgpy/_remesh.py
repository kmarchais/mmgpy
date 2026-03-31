"""Python wrappers for C++ remesh functions with format conversion.

The C++ remesh functions only support native MMG formats (.mesh, .meshb).
These wrappers transparently convert non-native formats (e.g. .vtk, .vtu)
by reading via ``mmgpy.read()`` (meshio), remeshing in-memory, and saving
via ``Mesh.save()`` (meshio).  No temporary files are created.
"""

from __future__ import annotations

from collections.abc import Sequence
from pathlib import Path
from typing import TYPE_CHECKING, Any

from mmgpy._mmgpy import mmg2d as _mmg2d_cpp
from mmgpy._mmgpy import mmg3d as _mmg3d_cpp
from mmgpy._mmgpy import mmgs as _mmgs_cpp

if TYPE_CHECKING:
    from collections.abc import Callable

    from mmgpy._mesh import Mesh

FieldTransferParam = bool | Sequence[str] | None

_NATIVE_MESH_EXTENSIONS = frozenset({".mesh", ".meshb"})

# Medit .sol type codes
_SOL_TYPE_SCALAR = 1
_SOL_TYPE_VECTOR = 2
_SOL_TYPE_TENSOR = 3


def _is_native(path: str | Path | None) -> bool:
    if path is None:
        return True
    return Path(path).suffix.lower() in _NATIVE_MESH_EXTENSIONS


def _load_sol(mesh: Mesh, sol_path: str | Path) -> None:
    """Load a .sol/.solb file and set the appropriate field on *mesh*.

    Delegates to the C++ ``impl.load_sol()`` which handles both text
    (.sol) and binary (.solb) formats natively via the MMG library.
    """
    mesh._impl.load_sol(str(sol_path))  # noqa: SLF001


def _save_sol(mesh: Mesh, sol_path: str | Path) -> None:
    """Write the metric field to a Medit .sol file."""
    from mmgpy._mesh import MeshKind  # noqa: PLC0415

    try:
        data = mesh["metric"]
    except KeyError:
        return

    n_vertices = len(mesh.get_vertices())
    dimension = 2 if mesh.kind == MeshKind.TRIANGULAR_2D else 3

    if data.ndim == 1 or (data.ndim == 2 and data.shape[1] == 1):  # noqa: PLR2004
        sol_type = _SOL_TYPE_SCALAR
        rows = data.reshape(-1, 1)
    elif data.ndim == 2 and data.shape[1] == dimension:  # noqa: PLR2004
        sol_type = _SOL_TYPE_VECTOR
        rows = data
    elif data.ndim == 2 and data.shape[1] in (3, 6):  # noqa: PLR2004
        sol_type = _SOL_TYPE_TENSOR
        rows = data
    else:
        sol_type = _SOL_TYPE_SCALAR
        rows = data.reshape(-1, 1)

    lines = [
        "MeshVersionFormatted 2",
        "",
        f"Dimension {dimension}",
        "",
        "SolAtVertices",
        str(n_vertices),
        f"1 {sol_type}",
        "",
    ]
    lines.extend(" ".join(f"{v:.15g}" for v in row) for row in rows)
    lines.append("")
    lines.append("End")

    Path(sol_path).write_text("\n".join(lines))


def _wrapped_remesh(
    cpp_remesh: Callable[..., bool],
    input_mesh: str | Path,
    input_sol: str | Path | None = None,
    output_mesh: str | Path | None = None,
    output_sol: str | Path | None = None,
    options: dict[str, Any] | None = None,
    transfer_fields: FieldTransferParam = False,
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
    from mmgpy._io import read as _read  # noqa: PLC0415

    mesh = _read(input_mesh)

    if input_sol is not None:
        _load_sol(mesh, input_sol)

    mesh.remesh(progress=False, transfer_fields=transfer_fields, **(options or {}))

    if output_mesh is not None:
        mesh.save(output_mesh)

    if output_sol is not None:
        _save_sol(mesh, output_sol)

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
        transfer_fields: FieldTransferParam = False,
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
        transfer_fields : bool | list[str] | None, default=False
            Transfer embedded fields through the remesh (non-native formats
            only).  True transfers all fields, a list transfers named fields.

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
            transfer_fields=transfer_fields,
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
        transfer_fields: FieldTransferParam = False,
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
        transfer_fields : bool | list[str] | None, default=False
            Transfer embedded fields through the remesh (non-native formats
            only).  True transfers all fields, a list transfers named fields.

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
            transfer_fields=transfer_fields,
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
        transfer_fields: FieldTransferParam = False,
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
        transfer_fields : bool | list[str] | None, default=False
            Transfer embedded fields through the remesh (non-native formats
            only).  True transfers all fields, a list transfers named fields.

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
            transfer_fields=transfer_fields,
        )
