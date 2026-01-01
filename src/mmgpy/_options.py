"""Typed options dataclasses for mmgpy remeshing operations.

This module provides structured configuration objects for mesh remeshing,
offering better IDE support, validation, and preset configurations.

Example:
-------
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

# Maximum angle value for ridge detection (degrees)
_MAX_ANGLE_DEGREES = 180

# Minimum gradation value
_MIN_GRADATION = 1.0


def _validate_common_options(opts: Mmg3DOptions | Mmg2DOptions | MmgSOptions) -> None:
    """Validate options common to all mesh types.

    Parameters
    ----------
    opts : Mmg3DOptions | Mmg2DOptions | MmgSOptions
        Options object to validate.

    Raises
    ------
    ValueError
        If any option value is invalid.

    """
    if opts.hmin is not None and opts.hmin <= 0:
        msg = "hmin must be positive"
        raise ValueError(msg)
    if opts.hmax is not None and opts.hmax <= 0:
        msg = "hmax must be positive"
        raise ValueError(msg)
    if opts.hsiz is not None and opts.hsiz <= 0:
        msg = "hsiz must be positive"
        raise ValueError(msg)
    if opts.hmin is not None and opts.hmax is not None and opts.hmin > opts.hmax:
        msg = "hmin must be less than or equal to hmax"
        raise ValueError(msg)
    if opts.hausd is not None and opts.hausd <= 0:
        msg = "hausd must be positive"
        raise ValueError(msg)
    if opts.hgrad is not None and opts.hgrad < _MIN_GRADATION:
        msg = f"hgrad must be >= {_MIN_GRADATION}"
        raise ValueError(msg)
    # hgradreq can be -1 to disable, or >= 1.0 for gradation control
    if (
        opts.hgradreq is not None
        and opts.hgradreq != -1
        and opts.hgradreq < _MIN_GRADATION
    ):
        msg = f"hgradreq must be >= {_MIN_GRADATION} or -1 to disable"
        raise ValueError(msg)
    if opts.ar is not None and (opts.ar < 0 or opts.ar > _MAX_ANGLE_DEGREES):
        msg = f"ar (angle detection) must be between 0 and {_MAX_ANGLE_DEGREES} degrees"
        raise ValueError(msg)
    if opts.mem is not None and opts.mem <= 0:
        msg = "mem must be positive"
        raise ValueError(msg)


def _options_to_dict(
    opts: Mmg3DOptions | Mmg2DOptions | MmgSOptions,
) -> dict[str, float | int]:
    """Convert options to dictionary for passing to remesh().

    Parameters
    ----------
    opts : Mmg3DOptions | Mmg2DOptions | MmgSOptions
        Options object to convert.

    Returns
    -------
    dict[str, float | int]
        Dictionary with non-None values, booleans converted to int.

    """
    result: dict[str, float | int] = {}
    for f in fields(opts):
        value = getattr(opts, f.name)
        if value is None:
            continue
        if isinstance(value, bool):
            if value:
                result[f.name] = 1
        else:
            result[f.name] = value
    return result


@dataclass(slots=True, kw_only=True, frozen=True)
class Mmg3DOptions:
    """Options for 3D tetrahedral mesh remeshing (MMG3D).

    All parameters are optional. When None, MMG uses its internal defaults.
    Options are immutable after creation.

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
        Gradation parameter (default ~1.3). Controls size transition between
        adjacent elements. Must be >= 1.0.
    hgradreq : float | None
        Gradation on required entities (advanced usage). Must be >= 1.0,
        or -1 to disable gradation control on required entities.
    ar : float | None
        Angle detection threshold in degrees (0-180). Edges with angles
        sharper than this are preserved as ridges.
    verbose : int | None
        Verbosity level (-1=silent, 0=errors, 1=info, higher=debug).
    mem : int | None
        Maximum memory usage in MB.
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
    hgradreq: float | None = None
    ar: float | None = None
    verbose: int | None = None
    mem: int | None = None
    optim: bool = False
    noinsert: bool = False
    noswap: bool = False
    nomove: bool = False
    nosurf: bool = False

    def __post_init__(self) -> None:
        """Validate options after initialization."""
        _validate_common_options(self)

    def to_dict(self) -> dict[str, float | int]:
        """Convert options to dictionary for passing to remesh().

        Returns
        -------
        dict[str, float | int]
            Dictionary with non-None values, booleans converted to int.

        """
        return _options_to_dict(self)

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


@dataclass(slots=True, kw_only=True, frozen=True)
class Mmg2DOptions:
    """Options for 2D triangular mesh remeshing (MMG2D).

    All parameters are optional. When None, MMG uses its internal defaults.
    Options are immutable after creation.

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
        Gradation parameter (default ~1.3). Controls size transition between
        adjacent elements. Must be >= 1.0.
    hgradreq : float | None
        Gradation on required entities (advanced usage). Must be >= 1.0,
        or -1 to disable gradation control on required entities.
    ar : float | None
        Angle detection threshold in degrees (0-180). Edges with angles
        sharper than this are preserved as ridges.
    verbose : int | None
        Verbosity level (-1=silent, 0=errors, 1=info, higher=debug).
    mem : int | None
        Maximum memory usage in MB.
    optim : bool
        Enable mesh optimization mode.
    noinsert : bool
        Disable point insertion.
    noswap : bool
        Disable edge swapping.
    nomove : bool
        Disable point relocation.

    """

    hmin: float | None = None
    hmax: float | None = None
    hsiz: float | None = None
    hausd: float | None = None
    hgrad: float | None = None
    hgradreq: float | None = None
    ar: float | None = None
    verbose: int | None = None
    mem: int | None = None
    optim: bool = False
    noinsert: bool = False
    noswap: bool = False
    nomove: bool = False

    def __post_init__(self) -> None:
        """Validate options after initialization."""
        _validate_common_options(self)

    def to_dict(self) -> dict[str, float | int]:
        """Convert options to dictionary for passing to remesh().

        Returns
        -------
        dict[str, float | int]
            Dictionary with non-None values, booleans converted to int.

        """
        return _options_to_dict(self)

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


@dataclass(slots=True, kw_only=True, frozen=True)
class MmgSOptions:
    """Options for surface mesh remeshing (MMGS).

    All parameters are optional. When None, MMG uses its internal defaults.
    Options are immutable after creation.

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
        Gradation parameter (default ~1.3). Controls size transition between
        adjacent elements. Must be >= 1.0.
    hgradreq : float | None
        Gradation on required entities (advanced usage). Must be >= 1.0,
        or -1 to disable gradation control on required entities.
    ar : float | None
        Angle detection threshold in degrees (0-180). Edges with angles
        sharper than this are preserved as ridges.
    verbose : int | None
        Verbosity level (-1=silent, 0=errors, 1=info, higher=debug).
    mem : int | None
        Maximum memory usage in MB.
    optim : bool
        Enable mesh optimization mode.
    noinsert : bool
        Disable point insertion.
    noswap : bool
        Disable edge swapping.
    nomove : bool
        Disable point relocation.

    """

    hmin: float | None = None
    hmax: float | None = None
    hsiz: float | None = None
    hausd: float | None = None
    hgrad: float | None = None
    hgradreq: float | None = None
    ar: float | None = None
    verbose: int | None = None
    mem: int | None = None
    optim: bool = False
    noinsert: bool = False
    noswap: bool = False
    nomove: bool = False

    def __post_init__(self) -> None:
        """Validate options after initialization."""
        _validate_common_options(self)

    def to_dict(self) -> dict[str, float | int]:
        """Convert options to dictionary for passing to remesh().

        Returns
        -------
        dict[str, float | int]
            Dictionary with non-None values, booleans converted to int.

        """
        return _options_to_dict(self)

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
