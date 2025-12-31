"""Test the MmgMesh class."""

from pathlib import Path

import numpy as np
import numpy.testing as npt
import pytest

from mmgpy import MmgMesh


def create_test_mesh() -> tuple[np.ndarray, np.ndarray]:
    """Create a cube mesh made of tetrahedra for testing."""
    vertices = np.array(
        [
            # Bottom square
            [0.0, 0.0, 0.0],  # 0
            [1.0, 0.0, 0.0],  # 1
            [1.0, 1.0, 0.0],  # 2
            [0.0, 1.0, 0.0],  # 3
            # Top square
            [0.0, 0.0, 1.0],  # 4
            [1.0, 0.0, 1.0],  # 5
            [1.0, 1.0, 1.0],  # 6
            [0.0, 1.0, 1.0],  # 7
        ],
        dtype=np.float64,
    )

    # Split cube into 5 tetrahedra
    elements = np.array(
        [
            [0, 1, 3, 4],  # Front-left
            [1, 2, 3, 6],  # Front-right
            [1, 4, 5, 6],  # Right-back
            [3, 4, 6, 7],  # Left-back
            [1, 3, 4, 6],  # Center diagonal
        ],
        dtype=np.int32,
    )

    return vertices, elements


def test_mesh_construction() -> None:
    """Test basic mesh construction and geometry."""
    vertices, elements = create_test_mesh()

    # Test empty constructor and setter
    mesh1 = MmgMesh()
    mesh1.set_vertices_and_elements(vertices, elements)
    npt.assert_array_almost_equal(mesh1.get_vertices(), vertices)
    npt.assert_array_equal(mesh1.get_elements(), elements)

    # Test constructor with data
    mesh2 = MmgMesh(vertices, elements)
    npt.assert_array_almost_equal(mesh2.get_vertices(), vertices)
    npt.assert_array_equal(mesh2.get_elements(), elements)


def test_mmg_mesh() -> None:
    """Test the MmgMesh class."""
    vertices, elements = create_test_mesh()

    mesh = MmgMesh(vertices, elements)

    # Test scalar field (one value per vertex)
    metric = np.array(
        [
            [0.1],  # vertex 0
            [0.2],  # vertex 1
            [0.15],  # vertex 2
            [0.1],  # vertex 3
            [0.2],  # vertex 4
            [0.15],  # vertex 5
            [0.1],  # vertex 6
            [0.2],  # vertex 7
        ],
        dtype=np.float64,
    )
    mesh["metric"] = metric
    npt.assert_array_almost_equal(mesh["metric"], metric)

    # Test vector field (3D displacement per vertex)
    displacement = np.array(
        [
            [0.1, 0.0, 0.0],  # vertex 0
            [0.0, 0.1, 0.0],  # vertex 1
            [0.0, 0.0, 0.1],  # vertex 2
            [0.1, 0.1, 0.1],  # vertex 3
            [0.1, 0.0, 0.1],  # vertex 4
            [0.0, 0.1, 0.1],  # vertex 5
            [0.1, 0.1, 0.0],  # vertex 6
            [0.0, 0.0, 0.2],  # vertex 7
        ],
        dtype=np.float64,
    )
    mesh["displacement"] = displacement
    npt.assert_array_almost_equal(mesh["displacement"], displacement)

    # Test tensor field (symmetric 3x3 matrix stored as 6 components per vertex)
    tensor = np.array(
        [
            [1.0, 0.0, 0.0, 1.0, 0.0, 1.0],  # vertex 0: xx, xy, xz, yy, yz, zz
            [1.0, 0.1, 0.0, 1.0, 0.0, 1.0],  # vertex 1
            [1.0, 0.0, 0.1, 1.0, 0.1, 1.0],  # vertex 2
            [1.0, 0.1, 0.1, 1.0, 0.1, 1.0],  # vertex 3
            [1.1, 0.0, 0.0, 1.1, 0.0, 1.1],  # vertex 4
            [1.1, 0.1, 0.0, 1.1, 0.0, 1.1],  # vertex 5
            [1.1, 0.0, 0.1, 1.1, 0.1, 1.1],  # vertex 6
            [1.1, 0.1, 0.1, 1.1, 0.1, 1.1],  # vertex 7
        ],
        dtype=np.float64,
    )
    mesh["tensor"] = tensor
    npt.assert_array_almost_equal(mesh["tensor"], tensor)


def test_load_mesh() -> None:
    """Test loading a mesh from file."""
    vertices, elements = create_test_mesh()

    # Save mesh to file
    mesh = MmgMesh(vertices, elements)
    mesh.save(Path(__file__).parent / "test_mesh.mesh")

    # Load mesh from file
    mesh = MmgMesh(Path(__file__).parent / "test_mesh.mesh")
    npt.assert_array_almost_equal(mesh.get_vertices(), vertices)
    npt.assert_array_equal(mesh.get_elements(), elements)


def test_load_nonexistent_file_no_crash(tmp_path: Path) -> None:
    """Test that loading a non-existent file raises and doesn't cause memory issues.

    This tests the cleanup() path in the constructor: when file loading fails,
    cleanup() is called before throwing. Previously, cleanup() didn't null
    pointers after freeing, which could cause double-free issues.
    """
    nonexistent_file = tmp_path / "does_not_exist.mesh"

    # Loading a non-existent file should raise an exception but not crash
    # (no double-free or memory corruption)
    # Run multiple times to increase chance of catching memory issues
    for _ in range(10):
        with pytest.raises(RuntimeError, match="Failed to load mesh"):
            MmgMesh(nonexistent_file)


# Tests for low-level mesh construction API (Phase 1 of Issue #50)


def test_set_mesh_size_and_get_mesh_size() -> None:
    """Test set_mesh_size and get_mesh_size methods."""
    mesh = MmgMesh()

    expected_vertices = 8
    expected_tetrahedra = 5
    mesh.set_mesh_size(vertices=expected_vertices, tetrahedra=expected_tetrahedra)

    # Get mesh size and verify
    np_v, ne, nprism, nt, nquad, na = mesh.get_mesh_size()
    assert np_v == expected_vertices
    assert ne == expected_tetrahedra
    assert nprism == 0
    assert nt == 0
    assert nquad == 0
    assert na == 0


def test_set_vertices_bulk() -> None:
    """Test bulk vertex setting."""
    vertices, elements = create_test_mesh()
    mesh = MmgMesh()

    # Set mesh size first
    mesh.set_mesh_size(vertices=len(vertices), tetrahedra=len(elements))

    # Set vertices in bulk
    mesh.set_vertices(vertices)

    # Set elements
    mesh.set_tetrahedra(elements)

    # Verify vertices
    npt.assert_array_almost_equal(mesh.get_vertices(), vertices)


def test_set_vertices_with_refs() -> None:
    """Test bulk vertex setting with reference IDs."""
    vertices, elements = create_test_mesh()
    refs = np.array([1, 2, 3, 4, 5, 6, 7, 8], dtype=np.int64)

    mesh = MmgMesh()
    mesh.set_mesh_size(vertices=len(vertices), tetrahedra=len(elements))
    mesh.set_vertices(vertices, refs=refs)
    mesh.set_tetrahedra(elements)

    # Verify vertices and refs
    verts_out, refs_out = mesh.get_vertices_with_refs()
    npt.assert_array_almost_equal(verts_out, vertices)
    npt.assert_array_equal(refs_out, refs)


def test_set_tetrahedra_bulk() -> None:
    """Test bulk tetrahedra setting."""
    vertices, elements = create_test_mesh()
    mesh = MmgMesh()

    mesh.set_mesh_size(vertices=len(vertices), tetrahedra=len(elements))
    mesh.set_vertices(vertices)
    mesh.set_tetrahedra(elements)

    # Verify elements
    npt.assert_array_equal(mesh.get_elements(), elements)


def test_set_tetrahedra_with_refs() -> None:
    """Test bulk tetrahedra setting with reference IDs (material IDs)."""
    vertices, elements = create_test_mesh()
    elem_refs = np.array([10, 20, 30, 40, 50], dtype=np.int64)

    mesh = MmgMesh()
    mesh.set_mesh_size(vertices=len(vertices), tetrahedra=len(elements))
    mesh.set_vertices(vertices)
    mesh.set_tetrahedra(elements, refs=elem_refs)

    # Verify elements and refs
    elems_out, refs_out = mesh.get_elements_with_refs()
    npt.assert_array_equal(elems_out, elements)
    npt.assert_array_equal(refs_out, elem_refs)


def test_set_triangles() -> None:
    """Test bulk triangle setting for boundary faces."""
    vertices, elements = create_test_mesh()

    # Define some boundary triangles (subset of cube faces)
    triangles = np.array(
        [
            [0, 1, 3],  # bottom face triangle 1
            [1, 2, 3],  # bottom face triangle 2
            [4, 5, 7],  # top face triangle 1
            [5, 6, 7],  # top face triangle 2
        ],
        dtype=np.int32,
    )
    tri_refs = np.array([1, 1, 2, 2], dtype=np.int64)  # boundary markers

    mesh = MmgMesh()
    mesh.set_mesh_size(
        vertices=len(vertices),
        tetrahedra=len(elements),
        triangles=len(triangles),
    )
    mesh.set_vertices(vertices)
    mesh.set_tetrahedra(elements)
    mesh.set_triangles(triangles, refs=tri_refs)

    # Verify triangles
    tris_out = mesh.get_triangles()
    npt.assert_array_equal(tris_out, triangles)

    # Verify triangles with refs
    tris_out, refs_out = mesh.get_triangles_with_refs()
    npt.assert_array_equal(tris_out, triangles)
    npt.assert_array_equal(refs_out, tri_refs)


def test_set_edges() -> None:
    """Test bulk edge setting for ridge edges."""
    vertices, elements = create_test_mesh()

    # Define some edges along cube edges
    edges = np.array(
        [
            [0, 1],  # bottom edge
            [1, 2],  # bottom edge
            [4, 5],  # top edge
            [5, 6],  # top edge
        ],
        dtype=np.int32,
    )
    edge_refs = np.array([100, 100, 200, 200], dtype=np.int64)  # edge markers

    mesh = MmgMesh()
    mesh.set_mesh_size(
        vertices=len(vertices),
        tetrahedra=len(elements),
        edges=len(edges),
    )
    mesh.set_vertices(vertices)
    mesh.set_tetrahedra(elements)
    mesh.set_edges(edges, refs=edge_refs)

    # Verify edges
    edges_out = mesh.get_edges()
    npt.assert_array_equal(edges_out, edges)

    # Verify edges with refs
    edges_out, refs_out = mesh.get_edges_with_refs()
    npt.assert_array_equal(edges_out, edges)
    npt.assert_array_equal(refs_out, edge_refs)


def test_programmatic_mesh_construction() -> None:
    """Test complete programmatic mesh construction workflow (Issue #50 use case)."""
    # Define vertices programmatically
    vertices = np.array(
        [
            [0.0, 0.0, 0.0],
            [1.0, 0.0, 0.0],
            [0.5, 1.0, 0.0],
            [0.5, 0.5, 1.0],
        ],
        dtype=np.float64,
    )

    # Single tetrahedron
    tetrahedra = np.array([[0, 1, 2, 3]], dtype=np.int32)

    # All 4 boundary triangles
    triangles = np.array(
        [
            [0, 1, 2],  # bottom
            [0, 1, 3],  # front
            [1, 2, 3],  # right
            [0, 2, 3],  # left
        ],
        dtype=np.int32,
    )

    # Construct mesh programmatically
    mesh = MmgMesh()
    mesh.set_mesh_size(
        vertices=len(vertices),
        tetrahedra=len(tetrahedra),
        triangles=len(triangles),
    )
    mesh.set_vertices(vertices)
    mesh.set_tetrahedra(tetrahedra)
    mesh.set_triangles(triangles)

    # Verify mesh construction
    np_v, ne, nprism, nt, nquad, na = mesh.get_mesh_size()
    assert np_v == len(vertices)
    assert ne == len(tetrahedra)
    assert nt == len(triangles)

    npt.assert_array_almost_equal(mesh.get_vertices(), vertices)
    npt.assert_array_equal(mesh.get_elements(), tetrahedra)
    npt.assert_array_equal(mesh.get_triangles(), triangles)


def visualize_mmg_mesh() -> None:
    """Visualize a simple MmgMesh using PyVista."""
    import pyvista as pv

    vertices, elements = create_test_mesh()
    mesh = MmgMesh(vertices, elements)

    # Create PyVista mesh
    cells = []
    for elem in mesh.get_elements():
        cells.extend([4, *elem])  # [4, v1, v2, v3, v4] for each tetrahedron
    celltypes = [pv.CellType.TETRA] * len(mesh.get_elements())
    pv_mesh = pv.UnstructuredGrid(cells, celltypes, mesh.get_vertices())

    # Add solution fields as point data
    metric = np.array(
        [[0.1], [0.2], [0.15], [0.1], [0.2], [0.15], [0.1], [0.2]],
        dtype=np.float64,
    )
    displacement = np.array(
        [
            [0.1, 0.0, 0.0],
            [0.0, 0.1, 0.0],
            [0.0, 0.0, 0.1],
            [0.1, 0.1, 0.1],
            [0.1, 0.0, 0.1],
            [0.0, 0.1, 0.1],
            [0.1, 0.1, 0.0],
            [0.0, 0.0, 0.2],
        ],
        dtype=np.float64,
    )
    levelset = np.array(
        [[1.0], [-1.0], [0.5], [-0.5], [0.8], [-0.8], [0.3], [-0.3]],
        dtype=np.float64,
    )

    mesh["metric"] = metric
    mesh["displacement"] = displacement
    mesh["levelset"] = levelset

    pv_mesh.point_data["metric"] = mesh["metric"]
    pv_mesh.point_data["displacement"] = mesh["displacement"]
    pv_mesh.point_data["levelset"] = mesh["levelset"]

    # Visualize
    plotter = pv.Plotter()
    plotter.add_mesh(pv_mesh, show_edges=True, scalars="levelset")
    plotter.show_axes()
    plotter.show()


if __name__ == "__main__":
    test_mesh_construction()
    test_mmg_mesh()
    visualize_mmg_mesh()
