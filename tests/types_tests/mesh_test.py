"""Tests for the mesh type."""

import pytest

from mmgpy import Mesh


def test_mesh_creation() -> None:
    """Test basic mesh creation."""
    mesh = Mesh()
    assert isinstance(mesh, Mesh)


def test_mesh_properties() -> None:
    """Test basic mesh properties."""
    mesh = Mesh()

    # Test dimension
    dim = 3
    mesh.dim = dim
    assert mesh.dim == dim

    # Test version
    ver = 2
    mesh.ver = ver
    assert mesh.ver == ver

    # Test counts
    n_points = 10
    n_tetra = 5
    mesh.np = n_points  # number of points
    mesh.ne = n_tetra  # number of tetrahedra
    assert mesh.np == n_points
    assert mesh.ne == n_tetra


def test_mesh_names() -> None:
    """Test input/output names."""
    mesh = Mesh()

    mesh.namein = "input.mesh"
    assert mesh.namein == "input.mesh"

    mesh.nameout = "output.mesh"
    assert mesh.nameout == "output.mesh"


def test_point_access() -> None:
    """Test point access."""
    mesh = Mesh()

    # This might need to be modified based on how points are actually allocated
    with pytest.raises(Exception):  # noqa: B017, PT011
        # Should raise exception for invalid index
        mesh.get_point(1)


def test_tetra_access() -> None:
    """Test tetrahedron access."""
    mesh = Mesh()

    # This might need to be modified based on how tetrahedra are actually allocated
    with pytest.raises(Exception):  # noqa: B017, PT011
        # Should raise exception for invalid index
        mesh.get_tetra(1)


def test_representation() -> None:
    """Test string representation."""
    mesh = Mesh()
    mesh.np = 10
    mesh.ne = 5
    mesh.nt = 8
    mesh.na = 12

    expected = "<MMG5_Mesh: 10 points, 5 tetrahedra, 8 triangles, 12 edges>"
    assert str(mesh) == expected
