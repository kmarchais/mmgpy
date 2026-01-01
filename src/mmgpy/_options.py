"""Typed options dataclasses for mmgpy remeshing operations.

This module provides structured configuration objects for mesh remeshing,
offering better IDE support, validation, and preset configurations.

Example:
    >>> from mmgpy import MmgMesh3D, Mmg3DOptions
    >>>
    >>> mesh = MmgMesh3D(vertices, elements)
    >>>
    >>> # Using options dataclass
    >>> options = Mmg3DOptions(hmax=0.1, hausd=0.001)
    >>> mesh.remesh(options)
    >>>
    >>> # Using factory presets
    >>> mesh.remesh(Mmg3DOptions.fine(hmax=0.05))

"""

from __future__ import annotations

from dataclasses import dataclass, fields
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from typing import Self


@dataclass(slots=True, kw_only=True)
class Mmg3DOptions:
    """Options for 3D tetrahedral mesh remeshing (MMG3D).

    All parameters are optional. When None, MMG uses its internal defaults.

    Attributes:
    ----------
    hmin : float | None
        Minimum edge size.
    hmax : float | None
        Maximum edge size.
    hsiz : float | None
        Constant edge size (overrides hmin/hmax).
    hausd : float | None
        Hausdorff distance for surface approximation.
    hgrad : float | None
        Gradation parameter (default ~1.3). Controls size transition.
    verbose : int | None
        Verbosity level (-1=silent, 0=errors, 1=info, higher=debug).
    optim : bool
        Enable mesh optimization mode.
    noinsert : bool
        Disable point insertion.
    noswap : bool
        Disable edge/face swapping.
    nomove : bool
        Disable point relocation.
    nosurf : bool
        Disable surface modifications.
    angle : float | None
        Ridge detection angle (degrees).
    hgradreq : float | None
        Required gradation value.
    mem : int | None
        Maximum memory usage in MB.

    Example:
    -------
    >>> opts = Mmg3DOptions(hmax=0.1, hausd=0.01)
    >>> mesh.remesh(opts)  # Pass options directly

    """

    hmin: float | None = None
    hmax: float | None = None
    hsiz: float | None = None
    hausd: float | None = None
    hgrad: float | None = None
    verbose: int | None = None
    optim: bool = False
    noinsert: bool = False
    noswap: bool = False
    nomove: bool = False
    nosurf: bool = False
    angle: float | None = None
    hgradreq: float | None = None
    mem: int | None = None

    def __post_init__(self) -> None:
        """Validate options after initialization."""
        if self.hmin is not None and self.hmin <= 0:
            msg = "hmin must be positive"
            raise ValueError(msg)
        if self.hmax is not None and self.hmax <= 0:
            msg = "hmax must be positive"
            raise ValueError(msg)
        if self.hsiz is not None and self.hsiz <= 0:
            msg = "hsiz must be positive"
            raise ValueError(msg)
        if self.hmin is not None and self.hmax is not None and self.hmin > self.hmax:
            msg = "hmin must be less than or equal to hmax"
            raise ValueError(msg)
        if self.hausd is not None and self.hausd <= 0:
            msg = "hausd must be positive"
            raise ValueError(msg)
        if self.hgrad is not None and self.hgrad < 1.0:
            msg = "hgrad must be >= 1.0"
            raise ValueError(msg)
        if self.mem is not None and self.mem <= 0:
            msg = "mem must be positive"
            raise ValueError(msg)

    def to_dict(self) -> dict[str, float | int]:
        """Convert options to dictionary for passing to remesh().

        Returns
        -------
        dict[str, float | int]
            Dictionary with non-None values, booleans converted to int.

        """
        result: dict[str, float | int] = {}
        for f in fields(self):
            value = getattr(self, f.name)
            if value is None:
                continue
            if isinstance(value, bool):
                if value:
                    result[f.name] = 1
            else:
                result[f.name] = value
        return result

    @classmethod
    def fine(cls, *, hmax: float, hausd: float | None = None) -> Self:
        """Create options for fine mesh with tight quality control.

        Parameters
        ----------
        hmax : float
            Maximum edge size.
        hausd : float | None
            Hausdorff distance. Defaults to hmax/10.

        """
        return cls(
            hmax=hmax,
            hausd=hausd if hausd is not None else hmax / 10,
            hgrad=1.2,
        )

    @classmethod
    def coarse(cls, *, hmax: float) -> Self:
        """Create options for coarse mesh with relaxed constraints.

        Parameters
        ----------
        hmax : float
            Maximum edge size.

        """
        return cls(
            hmax=hmax,
            hgrad=1.5,
        )

    @classmethod
    def optimize_only(cls, *, verbose: int | None = None) -> Self:
        """Create options for optimization without topology changes.

        Only moves vertices to improve quality, no insertion/deletion.

        """
        return cls(
            optim=True,
            noinsert=True,
            verbose=verbose,
        )


@dataclass(slots=True, kw_only=True)
class Mmg2DOptions:
    """Options for 2D triangular mesh remeshing (MMG2D).

    All parameters are optional. When None, MMG uses its internal defaults.

    Attributes
    ----------
    hmin : float | None
        Minimum edge size.
    hmax : float | None
        Maximum edge size.
    hsiz : float | None
        Constant edge size (overrides hmin/hmax).
    hausd : float | None
        Hausdorff distance for boundary approximation.
    hgrad : float | None
        Gradation parameter (default ~1.3). Controls size transition.
    verbose : int | None
        Verbosity level (-1=silent, 0=errors, 1=info, higher=debug).
    optim : bool
        Enable mesh optimization mode.
    noinsert : bool
        Disable point insertion.
    noswap : bool
        Disable edge swapping.
    nomove : bool
        Disable point relocation.
    angle : float | None
        Ridge detection angle (degrees).
    hgradreq : float | None
        Required gradation value.
    mem : int | None
        Maximum memory usage in MB.

    """

    hmin: float | None = None
    hmax: float | None = None
    hsiz: float | None = None
    hausd: float | None = None
    hgrad: float | None = None
    verbose: int | None = None
    optim: bool = False
    noinsert: bool = False
    noswap: bool = False
    nomove: bool = False
    angle: float | None = None
    hgradreq: float | None = None
    mem: int | None = None

    def __post_init__(self) -> None:
        """Validate options after initialization."""
        if self.hmin is not None and self.hmin <= 0:
            msg = "hmin must be positive"
            raise ValueError(msg)
        if self.hmax is not None and self.hmax <= 0:
            msg = "hmax must be positive"
            raise ValueError(msg)
        if self.hsiz is not None and self.hsiz <= 0:
            msg = "hsiz must be positive"
            raise ValueError(msg)
        if self.hmin is not None and self.hmax is not None and self.hmin > self.hmax:
            msg = "hmin must be less than or equal to hmax"
            raise ValueError(msg)
        if self.hausd is not None and self.hausd <= 0:
            msg = "hausd must be positive"
            raise ValueError(msg)
        if self.hgrad is not None and self.hgrad < 1.0:
            msg = "hgrad must be >= 1.0"
            raise ValueError(msg)
        if self.mem is not None and self.mem <= 0:
            msg = "mem must be positive"
            raise ValueError(msg)

    def to_dict(self) -> dict[str, float | int]:
        """Convert options to dictionary for passing to remesh().

        Returns
        -------
        dict[str, float | int]
            Dictionary with non-None values, booleans converted to int.

        """
        result: dict[str, float | int] = {}
        for f in fields(self):
            value = getattr(self, f.name)
            if value is None:
                continue
            if isinstance(value, bool):
                if value:
                    result[f.name] = 1
            else:
                result[f.name] = value
        return result

    @classmethod
    def fine(cls, *, hmax: float, hausd: float | None = None) -> Self:
        """Create options for fine mesh with tight quality control.

        Parameters
        ----------
        hmax : float
            Maximum edge size.
        hausd : float | None
            Hausdorff distance. Defaults to hmax/10.

        """
        return cls(
            hmax=hmax,
            hausd=hausd if hausd is not None else hmax / 10,
            hgrad=1.2,
        )

    @classmethod
    def coarse(cls, *, hmax: float) -> Self:
        """Create options for coarse mesh with relaxed constraints.

        Parameters
        ----------
        hmax : float
            Maximum edge size.

        """
        return cls(
            hmax=hmax,
            hgrad=1.5,
        )

    @classmethod
    def optimize_only(cls, *, verbose: int | None = None) -> Self:
        """Create options for optimization without topology changes.

        Only moves vertices to improve quality, no insertion/deletion.

        """
        return cls(
            optim=True,
            noinsert=True,
            verbose=verbose,
        )


@dataclass(slots=True, kw_only=True)
class MmgSOptions:
    """Options for surface mesh remeshing (MMGS).

    All parameters are optional. When None, MMG uses its internal defaults.

    Attributes
    ----------
    hmin : float | None
        Minimum edge size.
    hmax : float | None
        Maximum edge size.
    hsiz : float | None
        Constant edge size (overrides hmin/hmax).
    hausd : float | None
        Hausdorff distance for surface approximation.
    hgrad : float | None
        Gradation parameter (default ~1.3). Controls size transition.
    verbose : int | None
        Verbosity level (-1=silent, 0=errors, 1=info, higher=debug).
    optim : bool
        Enable mesh optimization mode.
    noinsert : bool
        Disable point insertion.
    noswap : bool
        Disable edge swapping.
    nomove : bool
        Disable point relocation.
    angle : float | None
        Ridge detection angle (degrees).
    hgradreq : float | None
        Required gradation value.
    mem : int | None
        Maximum memory usage in MB.

    """

    hmin: float | None = None
    hmax: float | None = None
    hsiz: float | None = None
    hausd: float | None = None
    hgrad: float | None = None
    verbose: int | None = None
    optim: bool = False
    noinsert: bool = False
    noswap: bool = False
    nomove: bool = False
    angle: float | None = None
    hgradreq: float | None = None
    mem: int | None = None

    def __post_init__(self) -> None:
        """Validate options after initialization."""
        if self.hmin is not None and self.hmin <= 0:
            msg = "hmin must be positive"
            raise ValueError(msg)
        if self.hmax is not None and self.hmax <= 0:
            msg = "hmax must be positive"
            raise ValueError(msg)
        if self.hsiz is not None and self.hsiz <= 0:
            msg = "hsiz must be positive"
            raise ValueError(msg)
        if self.hmin is not None and self.hmax is not None and self.hmin > self.hmax:
            msg = "hmin must be less than or equal to hmax"
            raise ValueError(msg)
        if self.hausd is not None and self.hausd <= 0:
            msg = "hausd must be positive"
            raise ValueError(msg)
        if self.hgrad is not None and self.hgrad < 1.0:
            msg = "hgrad must be >= 1.0"
            raise ValueError(msg)
        if self.mem is not None and self.mem <= 0:
            msg = "mem must be positive"
            raise ValueError(msg)

    def to_dict(self) -> dict[str, float | int]:
        """Convert options to dictionary for passing to remesh().

        Returns
        -------
        dict[str, float | int]
            Dictionary with non-None values, booleans converted to int.

        """
        result: dict[str, float | int] = {}
        for f in fields(self):
            value = getattr(self, f.name)
            if value is None:
                continue
            if isinstance(value, bool):
                if value:
                    result[f.name] = 1
            else:
                result[f.name] = value
        return result

    @classmethod
    def fine(cls, *, hmax: float, hausd: float | None = None) -> Self:
        """Create options for fine mesh with tight quality control.

        Parameters
        ----------
        hmax : float
            Maximum edge size.
        hausd : float | None
            Hausdorff distance. Defaults to hmax/10.

        """
        return cls(
            hmax=hmax,
            hausd=hausd if hausd is not None else hmax / 10,
            hgrad=1.2,
        )

    @classmethod
    def coarse(cls, *, hmax: float) -> Self:
        """Create options for coarse mesh with relaxed constraints.

        Parameters
        ----------
        hmax : float
            Maximum edge size.

        """
        return cls(
            hmax=hmax,
            hgrad=1.5,
        )

    @classmethod
    def optimize_only(cls, *, verbose: int | None = None) -> Self:
        """Create options for optimization without topology changes.

        Only moves vertices to improve quality, no insertion/deletion.

        """
        return cls(
            optim=True,
            noinsert=True,
            verbose=verbose,
        )


__all__ = ["Mmg2DOptions", "Mmg3DOptions", "MmgSOptions"]
