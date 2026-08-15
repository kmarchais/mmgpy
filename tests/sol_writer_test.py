"""Focused tests for the pure-Python Medit solution writer."""

from __future__ import annotations

import importlib.util
from pathlib import Path

import numpy as np
import pytest


def _load_sol_module():
    """Load ``_sol.py`` without importing the compiled mmgpy extension."""
    module_path = Path(__file__).parents[1] / "src" / "mmgpy" / "_sol.py"
    spec = importlib.util.spec_from_file_location("mmgpy_sol_writer_test", module_path)
    if spec is None or spec.loader is None:
        msg = f"Unable to load {module_path}"
        raise ImportError(msg)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


sol = _load_sol_module()


def test_write_sol_file_round_trips_multiple_locations(tmp_path: Path) -> None:
    """Writer preserves grouped scalar, vector, and cell data."""
    scalar = np.array([1.0, 2.0])
    vector = np.array([[3.0, 4.0, 5.0], [6.0, 7.0, 8.0]])
    cell_scalar = np.array([9.0])
    output = tmp_path / "combined.sol"

    sol.write_sol_file(
        output,
        [
            ("scalar", scalar, "vertices"),
            ("vector", vector, "vertices"),
            ("cell", cell_scalar, "tetrahedra"),
        ],
        dimension=3,
    )

    parsed = sol.parse_sol_file(output.read_text(encoding="utf-8"))
    np.testing.assert_array_equal(parsed["solution_0@vertices"]["data"], scalar)
    np.testing.assert_array_equal(parsed["vector_1@vertices"]["data"], vector)
    np.testing.assert_array_equal(
        parsed["solution@tetrahedra"]["data"],
        cell_scalar,
    )


def test_write_sol_file_rejects_mismatched_group_lengths(tmp_path: Path) -> None:
    """Fields at one entity location must have the same row count."""
    with pytest.raises(ValueError, match="must share length 2"):
        sol.write_sol_file(
            tmp_path / "bad.sol",
            [
                ("first", np.ones(2), "vertices"),
                ("second", np.ones(3), "vertices"),
            ],
            dimension=3,
        )


def test_write_sol_file_rejects_unknown_location(tmp_path: Path) -> None:
    """Unsupported entity locations produce a field-specific error."""
    with pytest.raises(ValueError, match="Unknown location 'edges' for field 'field'"):
        sol.write_sol_file(
            tmp_path / "bad.sol",
            [("field", np.ones(2), "edges")],
            dimension=3,
        )
