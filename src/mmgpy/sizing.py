"""Local sizing parameters for per-region mesh control.

This module provides convenient APIs for specifying local mesh sizing parameters,
enabling different mesh densities in different regions without manually constructing
metric fields.

Sizing constraints are stored on mesh objects and combined (minimum size wins)
to produce per-vertex metric fields before remeshing.

Examples
--------
Fine mesh in a spherical region:

>>> from mmgpy import MmgMesh3D
>>> mesh = MmgMesh3D.from_file("model.mesh")
>>> mesh.set_size_sphere(center=[0.5, 0.5, 0.5], radius=0.2, size=0.01)
>>> mesh.remesh(hmax=0.1, verbose=-1)

Multiple sizing constraints (minimum size wins):

>>> mesh.set_size_sphere(center=[0, 0, 0], radius=0.3, size=0.01)
>>> mesh.set_size_sphere(center=[1, 1, 1], radius=0.3, size=0.01)
>>> mesh.set_size_box(bounds=[[0.4, 0.4, 0.4], [0.6, 0.6, 0.6]], size=0.005)
>>> mesh.remesh(hmax=0.1, verbose=-1)

Distance-based sizing from a point:

>>> mesh.set_size_from_point(
...     point=[0.5, 0.5, 0.5],
...     near_size=0.01,
...     far_size=0.1,
...     influence_radius=0.5,
... )
>>> mesh.remesh(verbose=-1)

"""

from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import TYPE_CHECKING

import numpy as np

if TYPE_CHECKING:
    from numpy.typing import NDArray

    from mmgpy import MmgMesh2D, MmgMesh3D, MmgMeshS

_BOUNDS_DIM_COUNT = 2
_ZERO_LENGTH_THRESHOLD = 1e-12


@dataclass
class SizingConstraint(ABC):
    """Base class for sizing constraints."""

    @abstractmethod
    def compute_sizes(
        self,
        vertices: NDArray[np.float64],
    ) -> NDArray[np.float64]:
        """Compute target size at each vertex.

        Parameters
        ----------
        vertices : NDArray[np.float64]
            Vertex coordinates, shape (n_vertices, dim).

        Returns
        -------
        NDArray[np.float64]
            Target size at each vertex, shape (n_vertices,).
            Use np.inf for vertices where this constraint doesn't apply.

        """


@dataclass
class SphereSize(SizingConstraint):
    """Uniform size within a spherical region.

    Parameters
    ----------
    center : array_like
        Center of the sphere, shape (dim,).
    radius : float
        Radius of the sphere. Must be positive.
    size : float
        Target edge size within the sphere. Must be positive.

    """

    center: NDArray[np.float64]
    radius: float
    size: float

    def __post_init__(self) -> None:  # noqa: D105
        self.center = np.asarray(self.center, dtype=np.float64)
        if self.radius <= 0:
            msg = f"radius must be positive, got {self.radius}"
            raise ValueError(msg)
        if self.size <= 0:
            msg = f"size must be positive, got {self.size}"
            raise ValueError(msg)

    def compute_sizes(  # noqa: D102
        self,
        vertices: NDArray[np.float64],
    ) -> NDArray[np.float64]:
        distances = np.linalg.norm(vertices - self.center, axis=1)

        sizes = np.full(len(vertices), np.inf, dtype=np.float64)

        inside_mask = distances <= self.radius
        sizes[inside_mask] = self.size

        return sizes


@dataclass
class BoxSize(SizingConstraint):
    """Uniform size within a box region.

    Parameters
    ----------
    bounds : array_like
        Box bounds as [[xmin, ymin, zmin], [xmax, ymax, zmax]] for 3D
        or [[xmin, ymin], [xmax, ymax]] for 2D.
    size : float
        Target edge size within the box. Must be positive.

    """

    bounds: NDArray[np.float64]
    size: float

    def __post_init__(self) -> None:  # noqa: D105
        self.bounds = np.asarray(self.bounds, dtype=np.float64)
        if self.bounds.shape[0] != _BOUNDS_DIM_COUNT:
            msg = f"bounds must have shape (2, dim), got {self.bounds.shape}"
            raise ValueError(msg)
        if self.size <= 0:
            msg = f"size must be positive, got {self.size}"
            raise ValueError(msg)

    def compute_sizes(  # noqa: D102
        self,
        vertices: NDArray[np.float64],
    ) -> NDArray[np.float64]:
        min_corner = self.bounds[0]
        max_corner = self.bounds[1]

        inside_mask = np.all(
            (vertices >= min_corner) & (vertices <= max_corner),
            axis=1,
        )

        sizes = np.full(len(vertices), np.inf, dtype=np.float64)
        sizes[inside_mask] = self.size

        return sizes


@dataclass
class CylinderSize(SizingConstraint):
    """Uniform size within a cylindrical region.

    Parameters
    ----------
    point1 : array_like
        First endpoint of cylinder axis, shape (3,).
    point2 : array_like
        Second endpoint of cylinder axis, shape (3,).
    radius : float
        Radius of the cylinder. Must be positive.
    size : float
        Target edge size within the cylinder. Must be positive.

    """

    point1: NDArray[np.float64]
    point2: NDArray[np.float64]
    radius: float
    size: float

    def __post_init__(self) -> None:  # noqa: D105
        self.point1 = np.asarray(self.point1, dtype=np.float64)
        self.point2 = np.asarray(self.point2, dtype=np.float64)
        if self.radius <= 0:
            msg = f"radius must be positive, got {self.radius}"
            raise ValueError(msg)
        if self.size <= 0:
            msg = f"size must be positive, got {self.size}"
            raise ValueError(msg)

    def compute_sizes(  # noqa: D102
        self,
        vertices: NDArray[np.float64],
    ) -> NDArray[np.float64]:
        axis = self.point2 - self.point1
        axis_length = np.linalg.norm(axis)
        if axis_length < _ZERO_LENGTH_THRESHOLD:
            msg = "Cylinder axis has zero length"
            raise ValueError(msg)
        axis_unit = axis / axis_length

        v = vertices - self.point1
        proj_length = np.dot(v, axis_unit)
        proj_point = self.point1 + np.outer(proj_length, axis_unit)
        radial_dist = np.linalg.norm(vertices - proj_point, axis=1)

        in_height = (proj_length >= 0) & (proj_length <= axis_length)
        in_radius = radial_dist <= self.radius
        inside_mask = in_height & in_radius

        sizes = np.full(len(vertices), np.inf, dtype=np.float64)
        sizes[inside_mask] = self.size

        return sizes


@dataclass
class PointSize(SizingConstraint):
    """Distance-based sizing from a point.

    Size varies linearly from near_size at the point to far_size at
    influence_radius distance.

    Parameters
    ----------
    point : array_like
        Reference point, shape (dim,).
    near_size : float
        Target size at the reference point. Must be positive.
    far_size : float
        Target size at influence_radius distance and beyond. Must be positive.
    influence_radius : float
        Distance over which size transitions from near_size to far_size.
        Must be positive.

    """

    point: NDArray[np.float64]
    near_size: float
    far_size: float
    influence_radius: float

    def __post_init__(self) -> None:  # noqa: D105
        self.point = np.asarray(self.point, dtype=np.float64)
        if self.near_size <= 0:
            msg = f"near_size must be positive, got {self.near_size}"
            raise ValueError(msg)
        if self.far_size <= 0:
            msg = f"far_size must be positive, got {self.far_size}"
            raise ValueError(msg)
        if self.influence_radius <= 0:
            msg = f"influence_radius must be positive, got {self.influence_radius}"
            raise ValueError(msg)

    def compute_sizes(  # noqa: D102
        self,
        vertices: NDArray[np.float64],
    ) -> NDArray[np.float64]:
        distances = np.linalg.norm(vertices - self.point, axis=1)
        t = np.clip(distances / self.influence_radius, 0.0, 1.0)
        return self.near_size + t * (self.far_size - self.near_size)


def compute_sizes_from_constraints(
    vertices: NDArray[np.float64],
    constraints: list[SizingConstraint],
) -> NDArray[np.float64]:
    """Compute combined sizing from multiple constraints.

    Multiple constraints are combined by taking the minimum size at each vertex
    (finest mesh wins).

    Parameters
    ----------
    vertices : NDArray[np.float64]
        Vertex coordinates, shape (n_vertices, dim).
    constraints : list[SizingConstraint]
        List of sizing constraints.

    Returns
    -------
    NDArray[np.float64]
        Combined target size at each vertex, shape (n_vertices,).

    """
    if not constraints:
        msg = "No sizing constraints provided"
        raise ValueError(msg)

    n_vertices = len(vertices)
    combined = np.full(n_vertices, np.inf, dtype=np.float64)

    for constraint in constraints:
        sizes = constraint.compute_sizes(vertices)
        combined = np.minimum(combined, sizes)

    return combined


def sizes_to_metric(
    sizes: NDArray[np.float64],
) -> NDArray[np.float64]:
    """Convert scalar sizes to metric tensor format.

    Parameters
    ----------
    sizes : NDArray[np.float64]
        Target sizes at each vertex, shape (n_vertices,).

    Returns
    -------
    NDArray[np.float64]
        Metric field suitable for mesh["metric"], shape (n_vertices, 1).

    """
    return sizes.reshape(-1, 1)


def apply_sizing_constraints(
    mesh: MmgMesh3D | MmgMesh2D | MmgMeshS,
    constraints: list[SizingConstraint],
    existing_metric: NDArray[np.float64] | None = None,
) -> None:
    """Apply sizing constraints to a mesh by setting its metric field.

    Parameters
    ----------
    mesh : MmgMesh3D | MmgMesh2D | MmgMeshS
        Mesh to apply sizing to.
    constraints : list[SizingConstraint]
        List of sizing constraints.
    existing_metric : NDArray[np.float64] | None
        Existing metric field to combine with. If provided, minimum size wins.

    """
    if not constraints:
        return

    vertices = mesh.get_vertices()
    sizes = compute_sizes_from_constraints(vertices, constraints)

    if existing_metric is not None and existing_metric.shape[1] == 1:
        existing_sizes = existing_metric.ravel()
        sizes = np.minimum(sizes, existing_sizes)

    finite_mask = np.isfinite(sizes)
    if not np.any(finite_mask):
        # No constraints applied to any vertex (all sizes are inf).
        # This can happen if all region-based constraints are placed outside
        # the mesh bounds. Silently return without modifying the metric field,
        # allowing remeshing to proceed with global parameters only.
        return

    metric = sizes_to_metric(sizes)

    inf_mask = ~finite_mask
    if np.any(inf_mask):
        finite_sizes = sizes[finite_mask]
        if len(finite_sizes) > 0:
            max_size = np.max(finite_sizes) * 10
            metric[inf_mask] = max_size

    mesh["metric"] = metric
