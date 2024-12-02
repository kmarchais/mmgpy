"""Type stubs for mmgpy"""

class mmg3d:
    @staticmethod
    def remesh(
        input_mesh: str,
        input_sol: str = "",
        output_mesh: str = "output.mesh",
        output_sol: str = "",
        options: dict[str, float | int] = ...,
    ) -> bool: ...

class mmg2d:
    @staticmethod
    def remesh(
        input_mesh: str,
        input_sol: str = "",
        output_mesh: str = "output.mesh",
        output_sol: str = "",
        options: dict[str, float | int] = ...,
    ) -> bool: ...

class mmgs:
    @staticmethod
    def remesh(
        input_mesh: str,
        input_sol: str = "",
        output_mesh: str = "output.mesh",
        output_sol: str = "",
        options: dict[str, float | int] = ...,
    ) -> bool: ...
