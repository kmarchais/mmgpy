"""RemeshResult dataclass for capturing remeshing statistics."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True, slots=True)
class RemeshResult:
    """Statistics from a remeshing operation.

    This class captures mesh topology changes, quality metrics, timing,
    and any warnings from the remeshing operation.

    Attributes
    ----------
    vertices_before : int
        Number of vertices before remeshing.
    vertices_after : int
        Number of vertices after remeshing.
    elements_before : int
        Number of primary elements (tetrahedra for 3D, triangles for 2D/surface).
    elements_after : int
        Number of primary elements after remeshing.
    triangles_before : int
        Number of triangles (boundary for 3D, all for 2D/surface).
    triangles_after : int
        Number of triangles after remeshing.
    edges_before : int
        Number of edges before remeshing.
    edges_after : int
        Number of edges after remeshing.
    quality_min_before : float
        Minimum element quality before remeshing (0-1 scale).
    quality_min_after : float
        Minimum element quality after remeshing.
    quality_mean_before : float
        Mean element quality before remeshing.
    quality_mean_after : float
        Mean element quality after remeshing.
    duration_seconds : float
        Wall-clock time for the remeshing operation in seconds.
        Measures only the MMG library call, excluding stats collection overhead.
    warnings : tuple[str, ...]
        Any warnings from MMG (non-fatal issues). Contains warning messages
        captured from MMG's stderr output during remeshing. Common warnings
        include edge size clamping, geometric constraint violations, etc.
    return_code : int
        MMG return code (0 = success). Note: If remeshing fails, an exception
        is raised before RemeshResult is created, so this will always be 0
        for successfully returned results. Included for completeness and
        potential future use with partial failure modes.

    Examples
    --------
    >>> mesh = MmgMesh3D(vertices, tetrahedra)
    >>> result = mesh.remesh(hmax=0.1)
    >>> print(result)
    RemeshResult(
      vertices: 100 -> 250 (+150)
      elements: 400 -> 1200 (+800)
      quality: 0.450 -> 0.780 (173.3%)
      duration: 0.15s
    )
    >>> result.success
    True
    >>> result.quality_improvement
    1.733...

    """

    vertices_before: int
    vertices_after: int
    elements_before: int
    elements_after: int
    triangles_before: int
    triangles_after: int
    edges_before: int
    edges_after: int
    quality_min_before: float
    quality_min_after: float
    quality_mean_before: float
    quality_mean_after: float
    duration_seconds: float
    warnings: tuple[str, ...]
    return_code: int

    @property
    def vertex_change(self) -> int:
        """Net change in vertex count."""
        return self.vertices_after - self.vertices_before

    @property
    def element_change(self) -> int:
        """Net change in element count."""
        return self.elements_after - self.elements_before

    @property
    def triangle_change(self) -> int:
        """Net change in triangle count."""
        return self.triangles_after - self.triangles_before

    @property
    def edge_change(self) -> int:
        """Net change in edge count."""
        return self.edges_after - self.edges_before

    @property
    def quality_improvement(self) -> float:
        """Quality improvement ratio (mean_after / mean_before).

        Returns 1.0 if both values are zero (no change), inf if only
        before is zero, and the actual ratio otherwise.
        """
        if self.quality_mean_before == 0:
            if self.quality_mean_after == 0:
                return 1.0  # No change (both zero)
            return float("inf")  # Improved from zero
        return self.quality_mean_after / self.quality_mean_before

    @property
    def success(self) -> bool:
        """Whether remeshing completed successfully."""
        return self.return_code == 0

    def __str__(self) -> str:
        """Return a readable string representation."""
        quality_pct = self.quality_improvement * 100
        q_before = self.quality_mean_before
        q_after = self.quality_mean_after
        return (
            f"RemeshResult(\n"
            f"  vertices: {self.vertices_before} -> {self.vertices_after} "
            f"({self.vertex_change:+d})\n"
            f"  elements: {self.elements_before} -> {self.elements_after} "
            f"({self.element_change:+d})\n"
            f"  quality: {q_before:.3f} -> {q_after:.3f} ({quality_pct:.1f}%)\n"
            f"  duration: {self.duration_seconds:.2f}s\n"
            f")"
        )


__all__ = ["RemeshResult"]
