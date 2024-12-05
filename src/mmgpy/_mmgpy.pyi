class mmg3d:  # noqa: N801
    @staticmethod
    def remesh(
        input_mesh: str,
        input_sol: str = "",
        output_mesh: str = "output.mesh",
        output_sol: str = "",
        options: dict[str, float | int] = ...,
    ) -> bool: ...

class mmg2d:  # noqa: N801
    @staticmethod
    def remesh(
        input_mesh: str,
        input_sol: str = "",
        output_mesh: str = "output.mesh",
        output_sol: str = "",
        options: dict[str, float | int] = ...,
    ) -> bool: ...

class mmgs:  # noqa: N801
    @staticmethod
    def remesh(
        input_mesh: str,
        input_sol: str = "",
        output_mesh: str = "output.mesh",
        output_sol: str = "",
        options: dict[str, float | int] = ...,
    ) -> bool: ...
