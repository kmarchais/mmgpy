"""Tests for the format-converting wrappers in ``mmgpy._remesh``.

The wrappers translate non-native input/output paths into PyVista-backed
``Mesh`` objects, route the input ``.sol`` to the right channel
(``metric`` vs ``levelset``) based on the user's options, and call into
the appropriate C++ remesh entry point.
"""

from __future__ import annotations

from pathlib import Path
from tempfile import TemporaryDirectory
from typing import Any

import numpy as np
import pytest
import pyvista as pv

from mmgpy import SolPaths, mmg2d, mmg3d, mmgs
from mmgpy._io import _read_mesh_internal as read
from mmgpy._remesh import _is_iso_mode, _is_native, _load_sol, _save_sol

_ASSETS = Path(__file__).resolve().parents[2] / "assets"


class TestIsIsoMode:
    """Tests for the ``_is_iso_mode`` predicate.

    Decides whether to route the input sol into the level-set channel
    rather than the metric channel.
    """

    @pytest.mark.parametrize(
        ("options", "expected"),
        [
            (None, False),
            ({}, False),
            ({"hmax": 0.1}, False),
            ({"iso": 0}, False),
            ({"iso": 1}, True),
            ({"iso": True}, True),
            ({"iso": False}, False),
            ({"isosurf": 1}, True),
            ({"isosurf": 0}, False),
            ({"iso": 0, "isosurf": 1}, True),
            # String values: bool("0") is True in Python, so the predicate
            # has to coerce numeric strings through int first.
            ({"iso": "0"}, False),
            ({"iso": "1"}, True),
            ({"iso": "0", "isosurf": "0"}, False),
            ({"iso": "1", "isosurf": "0"}, True),
            # Non-numeric strings fall back to plain truthiness.
            ({"iso": ""}, False),
            ({"iso": "yes"}, True),
        ],
    )
    def test_predicate(
        self,
        options: dict[str, Any] | None,
        expected: bool,  # noqa: FBT001
    ) -> None:
        """Verify the predicate handles ints, bools, and string values."""
        assert _is_iso_mode(options) is expected


class TestIsNative:
    """Tests for the ``_is_native`` extension check.

    Decides whether the wrapper can short-circuit to the C++ remesh
    function or has to convert via PyVista.
    """

    @pytest.mark.parametrize(
        ("path", "expected"),
        [
            (None, True),
            ("foo.mesh", True),
            ("foo.meshb", True),
            ("FOO.MESH", True),
            (Path("dir/foo.mesh"), True),
            ("foo.vtk", False),
            ("foo.vtu", False),
            ("foo.sol", False),
            ("foo", False),
        ],
    )
    def test_native_detection(
        self,
        path: object,
        expected: bool,  # noqa: FBT001
    ) -> None:
        """Verify only ``.mesh`` / ``.meshb`` (and ``None``) are native."""
        assert _is_native(path) is expected  # type: ignore[arg-type]


class TestLoadSolChannel:
    """Tests for the ``_load_sol`` channel argument.

    The C++ ``load_sol`` now takes a ``channel`` argument so callers can
    route a sol into the level-set channel without a Python parser.
    """

    def test_default_channel_is_metric(self) -> None:
        """Without an explicit channel the sol lands in ``metric``."""
        mesh = read(_ASSETS / "hole.mesh")
        _load_sol(mesh, _ASSETS / "hole.sol")
        metric = mesh["metric"]
        assert metric is not None
        assert len(metric) == len(mesh.get_vertices())

    def test_explicit_metric_channel(self) -> None:
        """Passing ``channel='metric'`` matches the default behavior."""
        mesh = read(_ASSETS / "hole.mesh")
        _load_sol(mesh, _ASSETS / "hole.sol", channel="metric")
        assert len(mesh["metric"]) == len(mesh.get_vertices())

    def test_levelset_channel_2d(self) -> None:
        """Loading a sol into the level-set channel on a 2D mesh."""
        mesh = read(_ASSETS / "multi-mat.mesh")
        _load_sol(mesh, _ASSETS / "multi-mat-ls.sol", channel="levelset")

        ls = mesh["levelset"]
        assert ls is not None
        assert ls.shape == (len(mesh.get_vertices()), 1)
        # The asset is a signed distance field — straddles zero.
        assert ls.min() < 0.0 < ls.max()

    def test_levelset_channel_surface(self) -> None:
        """Loading a sol into the level-set channel on a surface mesh."""
        mesh = read(_ASSETS / "teapot.mesh")
        _load_sol(mesh, _ASSETS / "teapot-ls.sol", channel="levelset")

        ls = mesh["levelset"]
        assert ls is not None
        assert ls.shape == (len(mesh.get_vertices()), 1)
        assert ls.min() < 0.0 < ls.max()

    def test_unknown_channel_raises(self) -> None:
        """An invalid channel name surfaces the C++ error."""
        mesh = read(_ASSETS / "hole.mesh")
        with pytest.raises(RuntimeError, match="Unknown field"):
            _load_sol(mesh, _ASSETS / "hole.sol", channel="not-a-channel")


class TestMeshLoadSolChannel:
    """Tests for ``Mesh.load_sol`` exposing the channel argument."""

    def test_default_loads_metric(self) -> None:
        """Default call still populates the metric field."""
        mesh = read(_ASSETS / "hole.mesh")
        mesh.load_sol(_ASSETS / "hole.sol")
        assert mesh["metric"] is not None

    def test_levelset_via_public_api(self) -> None:
        """Public API forwards the channel through to the C++ binding."""
        mesh = read(_ASSETS / "multi-mat.mesh")
        mesh.load_sol(_ASSETS / "multi-mat-ls.sol", channel="levelset")
        ls = mesh["levelset"]
        assert ls is not None
        assert ls.shape == (len(mesh.get_vertices()), 1)


class TestSaveSolRoundtrip:
    """Tests that ``_save_sol`` round-trips through ``_load_sol``."""

    def test_roundtrip(self) -> None:
        """Write a metric out and read it back into a fresh mesh."""
        mesh = read(_ASSETS / "cube.mesh")
        n_verts = len(mesh.get_vertices())
        mesh["metric"] = np.full((n_verts, 1), 0.25)

        with TemporaryDirectory() as tmpdir:
            sol_path = Path(tmpdir) / "cube.sol"
            _save_sol(mesh, sol_path)
            assert sol_path.exists()

            roundtrip = read(_ASSETS / "cube.mesh")
            _load_sol(roundtrip, sol_path)
            np.testing.assert_allclose(roundtrip["metric"], mesh["metric"])


class TestWrappedRemeshIsoRouting:
    """End-to-end coverage of ``_wrapped_remesh`` paths.

    Goes through the public ``mmg2d.remesh`` / ``mmgs.remesh`` /
    ``mmg3d.remesh`` wrappers to exercise the format-conversion branch.
    """

    def test_mmg2d_iso_with_vtk_output(self) -> None:
        """2D iso remesh with .mesh in and .vtk out."""
        with TemporaryDirectory() as tmpdir:
            out = Path(tmpdir) / "out.vtk"
            ok = mmg2d.remesh(
                _ASSETS / "multi-mat.mesh",
                out,
                sol=SolPaths(in_path=_ASSETS / "multi-mat-ls.sol"),
                options={"iso": 1, "ls": 0.0, "verbose": -1},
            )
            assert ok
            assert out.exists()

            result = pv.read(out)
            # mmg2d in iso mode tags interior/exterior triangles via "refs".
            assert result.n_cells > 0
            arrays = list(result.point_data) + list(result.cell_data)
            assert "refs" in arrays

    def test_mmgs_iso_with_vtk_output(self) -> None:
        """Surface iso remesh with .mesh in and .vtk out."""
        with TemporaryDirectory() as tmpdir:
            out = Path(tmpdir) / "out.vtk"
            ok = mmgs.remesh(
                _ASSETS / "teapot.mesh",
                out,
                sol=SolPaths(in_path=_ASSETS / "teapot-ls.sol"),
                options={"iso": 1, "ls": 0.0, "verbose": -1},
            )
            assert ok
            assert out.exists()
            assert pv.read(out).n_cells > 0

    def test_mmg3d_iso_with_vtk_output(self) -> None:
        """3D iso remesh with .mesh in and .vtk out."""
        with TemporaryDirectory() as tmpdir:
            out = Path(tmpdir) / "out.vtk"
            ok = mmg3d.remesh(
                _ASSETS / "cube.mesh",
                out,
                sol=SolPaths(in_path=_ASSETS / "cube-ls.sol"),
                options={"iso": 1, "ls": 0.0, "verbose": -1},
            )
            assert ok
            assert out.exists()

            result = pv.read(out)
            # mmg3d in iso mode tags interior/exterior tetrahedra via "refs".
            assert result.n_cells > 0
            arrays = list(result.point_data) + list(result.cell_data)
            assert "refs" in arrays

    def test_native_path_short_circuits(self) -> None:
        """Native in + native out goes straight to C++ remesh."""
        with TemporaryDirectory() as tmpdir:
            out = Path(tmpdir) / "out.mesh"
            ok = mmg3d.remesh(
                input_mesh=_ASSETS / "cube.mesh",
                output_mesh=out,
                options={"hmax": 0.5, "verbose": -1},
            )
            assert ok
            assert out.exists()

    def test_non_native_without_sol(self) -> None:
        """Wrapper handles ``input_sol is None`` on the conversion path."""
        with TemporaryDirectory() as tmpdir:
            out = Path(tmpdir) / "out.vtk"
            ok = mmg3d.remesh(
                input_mesh=_ASSETS / "cube.mesh",
                output_mesh=out,
                options={"hmax": 0.5, "verbose": -1},
            )
            assert ok
            assert out.exists()

    def test_non_native_with_output_sol(self) -> None:
        """Wrapper writes ``output_sol`` after a non-native remesh."""
        with TemporaryDirectory() as tmpdir:
            out_mesh = Path(tmpdir) / "out.vtk"
            out_sol = Path(tmpdir) / "out.sol"
            ok = mmg3d.remesh(
                _ASSETS / "cube.mesh",
                out_mesh,
                sol=SolPaths(out_path=out_sol),
                options={"hmax": 0.5, "verbose": -1},
            )
            assert ok
            assert out_mesh.exists()
            assert out_sol.exists()
            assert out_sol.stat().st_size > 0

    def test_non_native_output_sol_only(self) -> None:
        """``output_mesh`` may be None while ``output_sol`` is provided."""
        with TemporaryDirectory() as tmpdir:
            input_vtk = Path(tmpdir) / "in.vtk"
            pv.read(_ASSETS / "cube.mesh").save(input_vtk)

            out_sol = Path(tmpdir) / "out.sol"
            ok = mmg3d.remesh(
                input_vtk,
                sol=SolPaths(out_path=out_sol),
                options={"hmax": 0.5, "verbose": -1},
            )
            assert ok
            assert out_sol.exists()

    def test_empty_sol_paths_is_equivalent_to_none(self) -> None:
        """``sol=SolPaths()`` (both fields ``None``) matches ``sol=None``."""
        with TemporaryDirectory() as tmpdir:
            out_a = Path(tmpdir) / "a.mesh"
            out_b = Path(tmpdir) / "b.mesh"
            ok_a = mmg3d.remesh(
                _ASSETS / "cube.mesh",
                out_a,
                sol=SolPaths(),
                options={"hmax": 0.5, "verbose": -1},
            )
            ok_b = mmg3d.remesh(
                _ASSETS / "cube.mesh",
                out_b,
                options={"hmax": 0.5, "verbose": -1},
            )
            assert ok_a is ok_b is True
            assert out_a.exists()
            assert out_b.exists()
