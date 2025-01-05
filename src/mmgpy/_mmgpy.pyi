from typing import overload

import numpy as np
from numpy.typing import NDArray

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
        vertices: NDArray[np.float64],
        elements: NDArray[np.int32],
    ) -> None: ...
    def set_vertices_and_elements(
        self,
        vertices: NDArray[np.float64],
        elements: NDArray[np.int32],
    ) -> None: ...
    def get_vertices(self) -> NDArray[np.float64]: ...
    def get_elements(self) -> NDArray[np.int32]: ...
    def set_metric_field(self, metric: NDArray[np.float64]) -> None: ...
    def get_metric_field(self) -> NDArray[np.float64]: ...
    def set_displacement_field(self, displacement: NDArray[np.float64]) -> None: ...
    def get_displacement_field(self) -> NDArray[np.float64]: ...
    def set_levelset_field(self, levelset: NDArray[np.float64]) -> None: ...
    def get_levelset_field(self) -> NDArray[np.float64]: ...
