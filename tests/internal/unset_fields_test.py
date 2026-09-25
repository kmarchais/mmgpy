"""Unset solution channels must never expose uninitialized memory."""

import numpy as np
import pytest

from mmgpy import MmgMesh2D, MmgMesh3D, MmgMeshS


@pytest.mark.parametrize("mesh_type", [MmgMesh2D, MmgMesh3D, MmgMeshS])
@pytest.mark.parametrize("field", ["metric", "levelset", "tensor"])
def test_unset_field_rejected(
    mesh_type: type[MmgMesh2D | MmgMesh3D | MmgMeshS],
    field: str,
) -> None:
    """Reject a channel until its solution storage has been populated."""
    mesh = mesh_type()
    mesh.set_mesh_size(vertices=4, triangles=1)
    with pytest.raises(RuntimeError, match="not set"):
        mesh.get_field(field)


@pytest.mark.parametrize("mesh_type", [MmgMesh2D, MmgMesh3D, MmgMeshS])
def test_zero_levelset_is_valid(
    mesh_type: type[MmgMesh2D | MmgMesh3D | MmgMeshS],
) -> None:
    """An explicitly populated zero field is different from an unset field."""
    mesh = mesh_type()
    mesh.set_mesh_size(vertices=4, triangles=1)
    values = np.zeros((4, 1))
    mesh.set_field("levelset", values)
    np.testing.assert_array_equal(mesh.get_field("levelset"), values)
