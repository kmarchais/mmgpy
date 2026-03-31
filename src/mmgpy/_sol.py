"""Parser for Medit .sol solution files."""

from __future__ import annotations

import re

import numpy as np


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
            i += 1
            if i >= len(lines):
                break

            n_entities = int(lines[i].strip())
            i += 1
            if i >= len(lines):
                break

            type_line = lines[i].strip().split()
            n_solutions = int(type_line[0])
            sol_types = [int(t) for t in type_line[1 : 1 + n_solutions]]

            i += 1
            values: list[list[float]] = []
            while len(values) < n_entities and i < len(lines):
                line = lines[i].strip()
                if line == "End" or line.startswith(("Mesh", "Sol")):
                    break
                if line == "":
                    i += 1
                    continue
                row_values = [float(v) for v in line.split()]
                values.append(row_values)
                i += 1

            if values:
                data = np.array(values, dtype=np.float64)
                col_idx = 0
                for sol_idx, sol_type in enumerate(sol_types):
                    if sol_type == 1:
                        base = f"solution_{sol_idx}" if n_solutions > 1 else "solution"
                        name = f"{base}@{location}"
                        if data.ndim == 1:
                            fields[name] = {"data": data, "location": location}
                        else:
                            fields[name] = {
                                "data": data[:, col_idx],
                                "location": location,
                            }
                        col_idx += 1
                    elif sol_type == 2:
                        base = f"vector_{sol_idx}" if n_solutions > 1 else "vector"
                        name = f"{base}@{location}"
                        fields[name] = {
                            "data": data[:, col_idx : col_idx + dimension],
                            "location": location,
                        }
                        col_idx += dimension
                    elif sol_type == 3:
                        tensor_size = 6 if dimension == 3 else 3
                        base = f"tensor_{sol_idx}" if n_solutions > 1 else "tensor"
                        name = f"{base}@{location}"
                        fields[name] = {
                            "data": data[:, col_idx : col_idx + tensor_size],
                            "location": location,
                        }
                        col_idx += tensor_size
            continue

        i += 1

    return fields
