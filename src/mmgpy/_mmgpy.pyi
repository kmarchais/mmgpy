from pathlib import Path
from typing import overload

import numpy as np
from numpy.typing import NDArray

class mmg3d:  # noqa: N801
    @staticmethod
    def remesh(
        input_mesh: str | Path,
        input_sol: str | Path | None = None,
        output_mesh: str | Path | None = None,
        output_sol: str | Path | None = None,
        options: dict[str, float | int] = ...,
    ) -> bool: ...

class mmg2d:  # noqa: N801
    @staticmethod
    def remesh(
        input_mesh: str | Path,
        input_sol: str | Path | None = None,
        output_mesh: str | Path | None = None,
        output_sol: str | Path | None = None,
        options: dict[str, float | int] = ...,
    ) -> bool: ...

class mmgs:  # noqa: N801
    @staticmethod
    def remesh(
        input_mesh: str | Path,
        input_sol: str | Path | None = None,
        output_mesh: str | Path | None = None,
        output_sol: str | Path | None = None,
        options: dict[str, float | int] = ...,
    ) -> bool: ...

class MmgMesh:
    @overload
    def __init__(self) -> None: ...
    @overload
    def __init__(
        self,
        vertices: NDArray[np.float64],
        elements: NDArray[np.int32],
    ) -> None: ...
    @overload
    def __init__(
        self,
        filename: str | Path,
    ) -> None: ...
    def set_vertices_and_elements(
        self,
        vertices: NDArray[np.float64],
        elements: NDArray[np.int32],
    ) -> None: ...
    def get_vertices(self) -> NDArray[np.float64]: ...
    def get_elements(self) -> NDArray[np.int32]: ...
    def set_field(self, key: str, value: NDArray[np.float64]) -> None: ...
    def get_field(self, key: str) -> NDArray[np.float64]: ...
    def __setitem__(self, key: str, value: NDArray[np.float64]) -> None: ...
    def __getitem__(self, key: str) -> NDArray[np.float64]: ...
    def save(self, filename: str | Path) -> None: ...
