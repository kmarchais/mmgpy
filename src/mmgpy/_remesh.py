"""Python wrappers for C++ remesh functions with format conversion.

The C++ remesh functions only support native MMG formats (.mesh, .meshb).
These wrappers transparently convert non-native formats (e.g. .vtk, .vtu)
by reading via ``mmgpy.read()``, remeshing in-memory, and saving
via ``Mesh.save()`` (PyVista).  No temporary files are created.
"""

from __future__ import annotations

from collections.abc import Sequence
from pathlib import Path
from typing import TYPE_CHECKING, Any, NamedTuple

from mmgpy._generate import generate as _generate_2d
from mmgpy._mmgpy import mmg2d as _mmg2d_cpp
from mmgpy._mmgpy import mmg3d as _mmg3d_cpp
from mmgpy._mmgpy import mmgs as _mmgs_cpp

if TYPE_CHECKING:
    from collections.abc import Callable

    from mmgpy._mesh import Mesh

FieldTransferParam = bool | Sequence[str] | None

NATIVE_MESH_EXTENSIONS = frozenset({".mesh", ".meshb"})


class SolPaths(NamedTuple):
    """Pair of input/output ``.sol`` paths consumed by the file-based remesh API."""

    in_path: str | Path | None = None
    out_path: str | Path | None = None


def _is_native(path: str | Path | None) -> bool:
    if path is None:
        return True
    return Path(path).suffix.lower() in NATIVE_MESH_EXTENSIONS


def _load_sol(mesh: Mesh, sol_path: str | Path, channel: str = "metric") -> None:
    """Load a .sol/.solb file into ``channel`` on *mesh*.

    Delegates to the C++ ``impl.load_sol()`` which handles both text
    (.sol) and binary (.solb) formats natively via the MMG library.
    """
    mesh._impl.load_sol(str(sol_path), channel=channel)  # noqa: SLF001


def _is_iso_mode(options: dict[str, Any] | None) -> bool:
    if not options:
        return False

    def _truthy(value: object) -> bool:
        # `bool("0")` is True, so coerce strings through int first.
        if isinstance(value, str):
            try:
                return int(value) != 0
            except ValueError:
                return bool(value)
        return bool(value)

    return _truthy(options.get("iso")) or _truthy(options.get("isosurf"))


def _save_sol(mesh: Mesh, sol_path: str | Path) -> None:
    """Save the metric/solution field to a Medit .sol file via the MMG C library."""
    mesh._impl.save_sol(str(sol_path))  # noqa: SLF001


def _renum_is_truthy(raw: object) -> bool:
    """Peek at the ``renum`` kwarg without consuming it or warning.

    The pop + ``FutureWarning`` happens inside ``Mesh.remesh`` via
    ``_pop_renum_redirect``; here we only need to decide whether the native
    fast path is safe to take. Bad strings fall through to ``False`` and
    the precise ``ValueError`` is raised by ``_pop_renum_redirect`` once
    the kwarg actually reaches ``Mesh.remesh``.

    Returns
    -------
    bool
        ``True`` when ``raw`` should trigger the renum path.

    """
    if isinstance(raw, str):
        try:
            return int(raw) != 0
        except ValueError:
            return False
    return bool(raw)


def _make_wrapped_remesh(
    cpp_remesh: Callable[..., bool],
) -> Callable[..., bool]:
    """Build a wrapper bound to a specific C++ remesh entry point.

    Captures ``cpp_remesh`` in the closure so the returned callable stays
    within the ``PLR0913`` arg-count budget while still sharing one
    implementation across the three ``mmg{2d,3d,s}.remesh`` entry points.

    Returns
    -------
    Callable[..., bool]
        Wrapper accepting ``(input_mesh, output_mesh=None, *, sol, options,
        transfer_fields)`` and returning the C++ success flag.

    """

    def _wrapped(
        input_mesh: str | Path,
        output_mesh: str | Path | None = None,
        *,
        sol: SolPaths | None = None,
        options: dict[str, Any] | None = None,
        transfer_fields: FieldTransferParam = False,
    ) -> bool:
        sol = sol or SolPaths()
        forwarded = dict(options or {})
        do_rcm = _renum_is_truthy(forwarded.get("renum"))

        input_native = _is_native(input_mesh)
        output_native = _is_native(output_mesh)

        # Native fast path is only safe when no RCM is requested. With RCM the
        # reordering must run on the in-memory Mesh so the saved .sol stays
        # consistent with the saved mesh and no MMG-specific data is lost via
        # a pv.read round-trip.
        if not do_rcm and input_native and output_native:
            forwarded.pop("renum", None)  # cpp bindings do not accept renum
            return cpp_remesh(
                input_mesh=input_mesh,
                input_sol=sol.in_path,
                output_mesh=output_mesh,
                output_sol=sol.out_path,
                options=forwarded,
            )

        from mmgpy._io import _read_mesh_internal as _read  # noqa: PLC0415

        mesh = _read(input_mesh)

        if sol.in_path is not None:
            channel = "levelset" if _is_iso_mode(options) else "metric"
            _load_sol(mesh, sol.in_path, channel=channel)

        # Leave ``renum`` in forwarded so Mesh.remesh pops it (and emits the
        # one-time FutureWarning) and applies RCM in place.
        result = mesh.remesh(
            progress=False,
            transfer_fields=transfer_fields,
            **forwarded,
        )

        if output_mesh is not None:
            mesh.save(output_mesh)

        if sol.out_path is not None:
            _save_sol(mesh, sol.out_path)

        return result.success

    return _wrapped


_wrapped_3d = _make_wrapped_remesh(_mmg3d_cpp.remesh)
_wrapped_2d = _make_wrapped_remesh(_mmg2d_cpp.remesh)
_wrapped_s = _make_wrapped_remesh(_mmgs_cpp.remesh)


class mmg3d:
    """3D mesh remeshing."""

    @staticmethod
    def remesh(
        input_mesh: str | Path,
        output_mesh: str | Path | None = None,
        *,
        sol: SolPaths | None = None,
        options: dict[str, Any] | None = None,
        transfer_fields: FieldTransferParam = False,
    ) -> bool:
        """Remesh a 3D mesh.

        Parameters
        ----------
        input_mesh : str or Path
            Input mesh file. Any format supported by PyVista.
        output_mesh : str or Path, optional
            Output mesh file. Any format supported by PyVista.
        sol : SolPaths, optional
            ``(in_path, out_path)`` solution file paths (.sol/.solb).
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
        return _wrapped_3d(
            input_mesh,
            output_mesh,
            sol=sol,
            options=options,
            transfer_fields=transfer_fields,
        )


class mmg2d:
    """2D mesh remeshing."""

    generate = staticmethod(_generate_2d)

    @staticmethod
    def remesh(
        input_mesh: str | Path,
        output_mesh: str | Path | None = None,
        *,
        sol: SolPaths | None = None,
        options: dict[str, Any] | None = None,
        transfer_fields: FieldTransferParam = False,
    ) -> bool:
        """Remesh a 2D mesh.

        Parameters
        ----------
        input_mesh : str or Path
            Input mesh file. Any format supported by PyVista.
        output_mesh : str or Path, optional
            Output mesh file. Any format supported by PyVista.
        sol : SolPaths, optional
            ``(in_path, out_path)`` solution file paths (.sol/.solb).
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
        return _wrapped_2d(
            input_mesh,
            output_mesh,
            sol=sol,
            options=options,
            transfer_fields=transfer_fields,
        )


class mmgs:
    """Surface mesh remeshing."""

    @staticmethod
    def remesh(
        input_mesh: str | Path,
        output_mesh: str | Path | None = None,
        *,
        sol: SolPaths | None = None,
        options: dict[str, Any] | None = None,
        transfer_fields: FieldTransferParam = False,
    ) -> bool:
        """Remesh a surface mesh.

        Parameters
        ----------
        input_mesh : str or Path
            Input mesh file. Any format supported by PyVista.
        output_mesh : str or Path, optional
            Output mesh file. Any format supported by PyVista.
        sol : SolPaths, optional
            ``(in_path, out_path)`` solution file paths (.sol/.solb).
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
        return _wrapped_s(
            input_mesh,
            output_mesh,
            sol=sol,
            options=options,
            transfer_fields=transfer_fields,
        )
