"""Test mesh corruption detection and guards."""

from pathlib import Path

import numpy as np
import pytest

from mmgpy._mmgpy import MmgMesh2D, MmgMesh3D, MmgMeshS

# --- MmgMesh3D ---


def test_3d_not_corrupted_after_valid_construction(
    cube_mesh: tuple[np.ndarray, np.ndarray],
) -> None:
    """Verify is_corrupted is False on a valid mesh."""
    vertices, elements = cube_mesh
    mesh = MmgMesh3D(vertices, elements)
    assert not mesh.is_corrupted


def test_3d_corrupted_after_failed_setter() -> None:
    """Verify corruption flag is set when a bulk setter fails partway."""
    mesh = MmgMesh3D()
    # Allocate space for 2 vertices but try to set 4
    mesh.set_mesh_size(
        vertices=2,
        tetrahedra=0,
        prisms=0,
        triangles=0,
        quadrilaterals=0,
        edges=0,
    )
    vertices = np.array(
        [[0.0, 0.0, 0.0], [1.0, 0.0, 0.0], [0.5, 1.0, 0.0], [0.5, 0.5, 1.0]],
        dtype=np.float64,
    )
    with pytest.raises(RuntimeError, match="Failed to set vertex"):
        mesh.set_vertices(vertices)
    assert mesh.is_corrupted


def test_3d_remesh_blocked_on_corrupted() -> None:
    """Verify remesh raises on a corrupted mesh."""
    mesh = MmgMesh3D()
    mesh.set_mesh_size(
        vertices=2,
        tetrahedra=0,
        prisms=0,
        triangles=0,
        quadrilaterals=0,
        edges=0,
    )
    vertices = np.array(
        [[0.0, 0.0, 0.0], [1.0, 0.0, 0.0], [0.5, 1.0, 0.0], [0.5, 0.5, 1.0]],
        dtype=np.float64,
    )
    with pytest.raises(RuntimeError):
        mesh.set_vertices(vertices)

    with pytest.raises(RuntimeError, match=r"Cannot remesh.*corrupted"):
        mesh.remesh()


def test_3d_save_blocked_on_corrupted(tmp_path: Path) -> None:
    """Verify save raises on a corrupted mesh."""
    mesh = MmgMesh3D()
    mesh.set_mesh_size(
        vertices=2,
        tetrahedra=0,
        prisms=0,
        triangles=0,
        quadrilaterals=0,
        edges=0,
    )
    vertices = np.array(
        [[0.0, 0.0, 0.0], [1.0, 0.0, 0.0], [0.5, 1.0, 0.0], [0.5, 0.5, 1.0]],
        dtype=np.float64,
    )
    with pytest.raises(RuntimeError):
        mesh.set_vertices(vertices)

    with pytest.raises(RuntimeError, match=r"Cannot save.*corrupted"):
        mesh.save(str(tmp_path / "out.mesh"))


# --- MmgMesh2D ---


def test_2d_not_corrupted_after_valid_construction(
    square_mesh: tuple[np.ndarray, np.ndarray],
) -> None:
    """Verify is_corrupted is False on a valid 2D mesh."""
    vertices, triangles = square_mesh
    mesh = MmgMesh2D(vertices, triangles)
    assert not mesh.is_corrupted


def test_2d_corrupted_after_failed_setter() -> None:
    """Verify corruption flag is set when a 2D bulk setter fails."""
    mesh = MmgMesh2D()
    mesh.set_mesh_size(vertices=2, triangles=0, quadrilaterals=0, edges=0)
    vertices = np.array(
        [[0.0, 0.0], [1.0, 0.0], [0.5, 1.0]],
        dtype=np.float64,
    )
    with pytest.raises(RuntimeError, match="Failed to set vertex"):
        mesh.set_vertices(vertices)
    assert mesh.is_corrupted


def test_2d_remesh_blocked_on_corrupted() -> None:
    """Verify remesh raises on a corrupted 2D mesh."""
    mesh = MmgMesh2D()
    mesh.set_mesh_size(vertices=2, triangles=0, quadrilaterals=0, edges=0)
    vertices = np.array(
        [[0.0, 0.0], [1.0, 0.0], [0.5, 1.0]],
        dtype=np.float64,
    )
    with pytest.raises(RuntimeError):
        mesh.set_vertices(vertices)

    with pytest.raises(RuntimeError, match=r"Cannot remesh.*corrupted"):
        mesh.remesh()


def test_2d_save_blocked_on_corrupted(tmp_path: Path) -> None:
    """Verify save raises on a corrupted 2D mesh."""
    mesh = MmgMesh2D()
    mesh.set_mesh_size(vertices=2, triangles=0, quadrilaterals=0, edges=0)
    vertices = np.array(
        [[0.0, 0.0], [1.0, 0.0], [0.5, 1.0]],
        dtype=np.float64,
    )
    with pytest.raises(RuntimeError):
        mesh.set_vertices(vertices)

    with pytest.raises(RuntimeError, match=r"Cannot save.*corrupted"):
        mesh.save(str(tmp_path / "out.mesh"))


# --- MmgMeshS ---


def test_surface_not_corrupted_after_valid_construction(
    tetrahedron_surface_mesh: tuple[np.ndarray, np.ndarray],
) -> None:
    """Verify is_corrupted is False on a valid surface mesh."""
    vertices, triangles = tetrahedron_surface_mesh
    mesh = MmgMeshS(vertices, triangles)
    assert not mesh.is_corrupted


def test_surface_corrupted_after_failed_setter() -> None:
    """Verify corruption flag is set when a surface bulk setter fails."""
    mesh = MmgMeshS()
    # MMGS requires at least 1 triangle; allocate 2 vertices but try to set 4
    mesh.set_mesh_size(vertices=2, triangles=1, edges=0)
    vertices = np.array(
        [[0.0, 0.0, 0.0], [1.0, 0.0, 0.0], [0.5, 1.0, 0.0], [0.5, 0.5, 1.0]],
        dtype=np.float64,
    )
    with pytest.raises(RuntimeError, match="Failed to set vertex"):
        mesh.set_vertices(vertices)
    assert mesh.is_corrupted


def test_surface_remesh_blocked_on_corrupted() -> None:
    """Verify remesh raises on a corrupted surface mesh."""
    mesh = MmgMeshS()
    mesh.set_mesh_size(vertices=2, triangles=1, edges=0)
    vertices = np.array(
        [[0.0, 0.0, 0.0], [1.0, 0.0, 0.0], [0.5, 1.0, 0.0], [0.5, 0.5, 1.0]],
        dtype=np.float64,
    )
    with pytest.raises(RuntimeError):
        mesh.set_vertices(vertices)

    with pytest.raises(RuntimeError, match=r"Cannot remesh.*corrupted"):
        mesh.remesh()


def test_surface_save_blocked_on_corrupted(tmp_path: Path) -> None:
    """Verify save raises on a corrupted surface mesh."""
    mesh = MmgMeshS()
    mesh.set_mesh_size(vertices=2, triangles=1, edges=0)
    vertices = np.array(
        [[0.0, 0.0, 0.0], [1.0, 0.0, 0.0], [0.5, 1.0, 0.0], [0.5, 0.5, 1.0]],
        dtype=np.float64,
    )
    with pytest.raises(RuntimeError):
        mesh.set_vertices(vertices)

    with pytest.raises(RuntimeError, match=r"Cannot save.*corrupted"):
        mesh.save(str(tmp_path / "out.mesh"))
