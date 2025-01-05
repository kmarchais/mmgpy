"""Tests for the mesh module."""

from mmgpy import MmgMesh


def test_mmg_mesh() -> None:
    """Test creating a simple tetrahedral mesh using MmgMesh."""
    MmgMesh()
