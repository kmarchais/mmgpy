"""Parser and writer for Medit .sol solution files."""

from __future__ import annotations

import re
from typing import TYPE_CHECKING, Literal

import numpy as np

if TYPE_CHECKING:
    from collections.abc import Sequence
    from pathlib import Path

    from numpy.typing import NDArray

Location = Literal["vertices", "triangles", "tetrahedra"]

_LOCATION_TO_KEYWORD: dict[Location, str] = {
    "vertices": "SolAtVertices",
    "triangles": "SolAtTriangles",
    "tetrahedra": "SolAtTetrahedra",
}

# MMG5_type enum values; mirror libmmgtypes.h. 0 = MMG5_Notype (unused).
_TYPE_SCALAR = 1
_TYPE_VECTOR = 2
_TYPE_TENSOR = 3


def _parse_sol_block(
    lines: list[str],
    start: int,
    location: str,
    dimension: int,
) -> tuple[int, dict[str, dict]]:
    """Parse one ``SolAt*`` block.

    Returns
    -------
    tuple[int, dict[str, dict]]
        The line index just after the consumed block and the fields parsed
        from it (empty if the block contained no data rows).

    """
    i = start
    if i >= len(lines):
        return i, {}
    n_entities = int(lines[i].strip())
    i += 1
    if i >= len(lines):
        return i, {}

    type_line = lines[i].strip().split()
    n_solutions = int(type_line[0])
    sol_types = [int(t) for t in type_line[1 : 1 + n_solutions]]
    i += 1

    values: list[list[float]] = []
    while len(values) < n_entities and i < len(lines):
        line = lines[i].strip()
        if line == "End" or line.startswith(("Mesh", "Sol")):
            break
        if not line:
            i += 1
            continue
        values.append([float(v) for v in line.split()])
        i += 1

    if not values:
        return i, {}
    return i, _fields_from_block(values, sol_types, n_solutions, location, dimension)


def _fields_from_block(
    values: list[list[float]],
    sol_types: list[int],
    n_solutions: int,
    location: str,
    dimension: int,
) -> dict[str, dict]:
    """Build the field dict from a parsed ``SolAt*`` block's raw values.

    Returns
    -------
    dict[str, dict]
        Field names mapped to ``{"data": array, "location": location}``.

    """
    data = np.array(values, dtype=np.float64)
    fields: dict[str, dict] = {}
    col_idx = 0
    for sol_idx, sol_type in enumerate(sol_types):
        if sol_type == 1:
            base = f"solution_{sol_idx}" if n_solutions > 1 else "solution"
            payload = data if data.ndim == 1 else data[:, col_idx]
            fields[f"{base}@{location}"] = {"data": payload, "location": location}
            col_idx += 1
        elif sol_type == 2:
            base = f"vector_{sol_idx}" if n_solutions > 1 else "vector"
            fields[f"{base}@{location}"] = {
                "data": data[:, col_idx : col_idx + dimension],
                "location": location,
            }
            col_idx += dimension
        elif sol_type == 3:
            tensor_size = 6 if dimension == 3 else 3
            base = f"tensor_{sol_idx}" if n_solutions > 1 else "tensor"
            fields[f"{base}@{location}"] = {
                "data": data[:, col_idx : col_idx + tensor_size],
                "location": location,
            }
            col_idx += tensor_size
    return fields


def parse_sol_file(content: str) -> dict[str, dict]:
    """Parse a Medit .sol file and return solution fields.

    Parameters
    ----------
    content : str
        Content of the .sol file.

    Returns
    -------
    dict[str, dict]
        Dictionary mapping field names to dicts with:
        - "data": numpy array
        - "location": "vertices", "triangles", or "tetrahedra"

    Examples
    --------
    >>> content = '''
    ... MeshVersionFormatted 2
    ... Dimension 3
    ... SolAtVertices
    ... 3
    ... 1 1
    ... 0.5
    ... 0.3
    ... 0.1
    ... End
    ... '''
    >>> fields = parse_sol_file(content)
    >>> "solution@vertices" in fields
    True
    >>> len(fields["solution@vertices"]["data"])
    3

    """
    lines = content.strip().split("\n")
    fields: dict[str, dict] = {}

    i = 0
    dimension = 3

    # Map keyword to location name
    location_map = {
        "SolAtVertices": "vertices",
        "SolAtTriangles": "triangles",
        "SolAtTetrahedra": "tetrahedra",
    }

    while i < len(lines):
        line = lines[i].strip()

        if line.startswith("Dimension"):
            match = re.search(r"\d+", line)
            if match:
                dimension = int(match.group())
            elif i + 1 < len(lines):
                i += 1
                dimension = int(lines[i].strip())
            i += 1
            continue

        # Check for any SolAt* keyword
        location = None
        for keyword, loc_name in location_map.items():
            if line.startswith(keyword):
                location = loc_name
                break

        if location is not None:
            i, block_fields = _parse_sol_block(lines, i + 1, location, dimension)
            fields.update(block_fields)
            continue

        i += 1

    return fields


def infer_sol_type(array: NDArray[np.float64], dimension: int) -> int:
    """Return the MMG5_type code (1/2/3) inferred from *array*'s shape.

    A 1D array is scalar (type 1). A 2D ``(N, k)`` array is a vector when
    ``k == dimension`` and a symmetric tensor when ``k == dim * (dim + 1) / 2``.

    Returns
    -------
    int
        The MMG type code: ``1`` (scalar), ``2`` (vector), or ``3``
        (symmetric tensor).

    Raises
    ------
    ValueError
        If the array is neither 1D nor a 2D shape matching a scalar,
        vector, or tensor layout for ``dimension``.

    """
    if array.ndim == 1:
        return _TYPE_SCALAR
    if array.ndim != 2:
        msg = (
            f"Sol arrays must be 1D (scalar) or 2D (vector/tensor); "
            f"got shape {array.shape}"
        )
        raise ValueError(msg)
    n_cols = array.shape[1]
    if n_cols == 1:
        return _TYPE_SCALAR
    tensor_size = dimension * (dimension + 1) // 2
    # Vector width (dim) and tensor width (dim*(dim+1)/2) are disjoint for
    # dim in {2, 3}, so a plain equality check suffices for each.
    if n_cols == dimension:
        return _TYPE_VECTOR
    if n_cols == tensor_size:
        return _TYPE_TENSOR
    msg = (
        f"Cannot infer sol type from shape {array.shape} at dim={dimension}: "
        f"expected ({array.shape[0]},), ({array.shape[0]}, {dimension}) for "
        f"vector, or ({array.shape[0]}, {tensor_size}) for tensor"
    )
    raise ValueError(msg)


def write_sol_file(
    path: str | Path,
    fields: Sequence[tuple[str, NDArray[np.float64], Location]],
    dimension: int,
) -> None:
    """Write a Medit ``.sol`` text file with one or more solution blocks.

    Parameters
    ----------
    path : str | Path
        Destination file. The extension is expected to be ``.sol`` (the
        text format). ``.solb`` (binary) is not supported by this writer;
        route binary writes through the C++ binding.
    fields : sequence of (name, array, location) tuples
        Each tuple describes one solution block. ``name`` is preserved as
        a comment for human readability (the Medit format itself doesn't
        carry names) and used in error messages. ``array`` is the numeric
        data (1D for scalar, 2D ``(N, k)`` for vector/tensor). ``location``
        is ``"vertices"``, ``"triangles"``, or ``"tetrahedra"``; all
        blocks sharing one location must agree on ``N``.
    dimension : int
        Mesh dimension (2 or 3). Determines vector / tensor widths.

    Raises
    ------
    ValueError
        If shapes are inconsistent within a location group, or if a
        column count doesn't match a valid scalar / vector / tensor
        layout for the given dimension.

    """
    if dimension not in {2, 3}:
        msg = f"dimension must be 2 or 3, got {dimension}"
        raise ValueError(msg)
    if not fields:
        msg = "write_sol_file: no fields to write"
        raise ValueError(msg)

    by_location: dict[Location, list[tuple[str, NDArray[np.float64], int]]] = {}
    for name, raw, location in fields:
        if location not in _LOCATION_TO_KEYWORD:
            msg = (
                f"Unknown location {location!r} for field {name!r}; expected "
                f"one of {sorted(_LOCATION_TO_KEYWORD)}"
            )
            raise ValueError(msg)
        arr = np.ascontiguousarray(raw, dtype=np.float64)
        sol_type = infer_sol_type(arr, dimension)
        by_location.setdefault(location, []).append((name, arr, sol_type))

    lines: list[str] = ["MeshVersionFormatted 2", "", f"Dimension {dimension}", ""]

    for location, group in by_location.items():
        keyword = _LOCATION_TO_KEYWORD[location]
        n_entities = group[0][1].shape[0]
        for name, arr, _ in group:
            if arr.shape[0] != n_entities:
                msg = (
                    f"All sol blocks at {location!r} must share length "
                    f"{n_entities}; field {name!r} has length {arr.shape[0]}"
                )
                raise ValueError(msg)
        lines.extend((keyword, str(n_entities)))
        type_header = [str(len(group))] + [str(t) for _, _, t in group]
        lines.append(" ".join(type_header))

        # Concatenate each row across all blocks. This is the per-vertex
        # "all values" layout Medit expects.
        per_row_chunks = [
            arr if arr.ndim == 2 else arr.reshape(-1, 1) for _, arr, _ in group
        ]
        joined = np.concatenate(per_row_chunks, axis=1)
        # %.17g is the shortest round-trip-safe double format and matches
        # Medit's expectation of plain decimal / scientific notation.
        lines.extend(" ".join(f"{v:.17g}" for v in row.tolist()) for row in joined)
        lines.append("")

    lines.extend(("End", ""))

    from pathlib import Path as _Path  # noqa: PLC0415

    _Path(path).write_text("\n".join(lines), encoding="utf-8")
