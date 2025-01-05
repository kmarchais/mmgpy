from typing import overload

import numpy as np

class mmg3d:  # noqa: N801
    @staticmethod
    def remesh(
        input_mesh: str,
        input_sol: str = "",
        output_mesh: str = "",
        output_sol: str = "",
        options: dict[str, float | int] = ...,
    ) -> bool: ...

class mmg2d:  # noqa: N801
    @staticmethod
    def remesh(
        input_mesh: str,
        input_sol: str = "",
        output_mesh: str = "",
        output_sol: str = "",
        options: dict[str, float | int] = ...,
    ) -> bool: ...

class mmgs:  # noqa: N801
    @staticmethod
    def remesh(
        input_mesh: str,
        input_sol: str = "",
        output_mesh: str = "",
        output_sol: str = "",
        options: dict[str, float | int] = ...,
    ) -> bool: ...

class MmgMesh:
    @overload
    def __init__(self) -> None: ...
    @overload
    def __init__(
        self,
        vertices: np.ndarray[np.float64],
        elements: np.ndarray[np.int32],
    ) -> None: ...
    def set_vertices_and_elements(
        self,
        vertices: np.ndarray[np.float64],
        elements: np.ndarray[np.int32],
    ) -> None: ...
