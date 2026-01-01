"""Test the MmgMesh3D class."""

from pathlib import Path

import numpy as np
import numpy.testing as npt
import pytest

from mmgpy import MmgMesh2D, MmgMesh3D, MmgMeshS


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
    mesh1 = MmgMesh3D()
    mesh1.set_vertices_and_elements(vertices, elements)
    npt.assert_array_almost_equal(mesh1.get_vertices(), vertices)
    npt.assert_array_equal(mesh1.get_elements(), elements)

    # Test constructor with data
    mesh2 = MmgMesh3D(vertices, elements)
    npt.assert_array_almost_equal(mesh2.get_vertices(), vertices)
    npt.assert_array_equal(mesh2.get_elements(), elements)


def test_mmg_mesh() -> None:
    """Test the MmgMesh3D class."""
    vertices, elements = create_test_mesh()

    mesh = MmgMesh3D(vertices, elements)

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


def test_load_mesh(tmp_path: Path) -> None:
    """Test loading a mesh from file."""
    vertices, elements = create_test_mesh()

    # Save mesh to file
    mesh = MmgMesh3D(vertices, elements)
    mesh_file = tmp_path / "test_mesh.mesh"
    mesh.save(mesh_file)

    # Load mesh from file
    loaded = MmgMesh3D(mesh_file)
    npt.assert_array_almost_equal(loaded.get_vertices(), vertices)
    npt.assert_array_equal(loaded.get_elements(), elements)


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
            MmgMesh3D(nonexistent_file)


# Tests for low-level mesh construction API (Phase 1 of Issue #50)


def test_set_mesh_size_and_get_mesh_size() -> None:
    """Test set_mesh_size and get_mesh_size methods."""
    mesh = MmgMesh3D()

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
    mesh = MmgMesh3D()

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

    mesh = MmgMesh3D()
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
    mesh = MmgMesh3D()

    mesh.set_mesh_size(vertices=len(vertices), tetrahedra=len(elements))
    mesh.set_vertices(vertices)
    mesh.set_tetrahedra(elements)

    # Verify elements
    npt.assert_array_equal(mesh.get_elements(), elements)


def test_set_tetrahedra_with_refs() -> None:
    """Test bulk tetrahedra setting with reference IDs (material IDs)."""
    vertices, elements = create_test_mesh()
    elem_refs = np.array([10, 20, 30, 40, 50], dtype=np.int64)

    mesh = MmgMesh3D()
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

    mesh = MmgMesh3D()
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

    mesh = MmgMesh3D()
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
    mesh = MmgMesh3D()
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


# Tests for Phase 2: Single element operations


def test_set_vertex_single() -> None:
    """Test setting a single vertex."""
    mesh = MmgMesh3D()
    mesh.set_mesh_size(vertices=3, tetrahedra=0)

    # Define vertex refs for testing
    vertex_refs = [1, 2, 3]
    mesh.set_vertex(0.0, 0.0, 0.0, ref=vertex_refs[0], idx=0)
    mesh.set_vertex(1.0, 0.0, 0.0, ref=vertex_refs[1], idx=1)
    mesh.set_vertex(0.5, 1.0, 0.0, ref=vertex_refs[2], idx=2)

    # Verify with get_vertex
    x, y, z, ref = mesh.get_vertex(0)
    assert (x, y, z) == (0.0, 0.0, 0.0)
    assert ref == vertex_refs[0]

    x, y, z, ref = mesh.get_vertex(1)
    assert (x, y, z) == (1.0, 0.0, 0.0)
    assert ref == vertex_refs[1]

    x, y, z, ref = mesh.get_vertex(2)
    assert (x, y, z) == (0.5, 1.0, 0.0)
    assert ref == vertex_refs[2]


def test_set_tetrahedron_single() -> None:
    """Test setting a single tetrahedron."""
    vertices, _ = create_test_mesh()
    mesh = MmgMesh3D()
    mesh.set_mesh_size(vertices=len(vertices), tetrahedra=1)
    mesh.set_vertices(vertices)

    # Set a single tetrahedron with a material ID
    tet_ref = 100
    mesh.set_tetrahedron(0, 1, 3, 4, ref=tet_ref, idx=0)

    # Verify with get_tetrahedron
    v0, v1, v2, v3, ref = mesh.get_tetrahedron(0)
    assert (v0, v1, v2, v3) == (0, 1, 3, 4)
    assert ref == tet_ref


def test_set_triangle_single() -> None:
    """Test setting a single triangle."""
    vertices, elements = create_test_mesh()
    mesh = MmgMesh3D()
    mesh.set_mesh_size(vertices=len(vertices), tetrahedra=len(elements), triangles=1)
    mesh.set_vertices(vertices)
    mesh.set_tetrahedra(elements)

    # Set a single triangle with a boundary marker
    tri_ref = 50
    mesh.set_triangle(0, 1, 2, ref=tri_ref, idx=0)

    # Verify with get_triangle
    v0, v1, v2, ref = mesh.get_triangle(0)
    assert (v0, v1, v2) == (0, 1, 2)
    assert ref == tri_ref


def test_set_edge_single() -> None:
    """Test setting a single edge."""
    vertices, elements = create_test_mesh()
    mesh = MmgMesh3D()
    mesh.set_mesh_size(vertices=len(vertices), tetrahedra=len(elements), edges=1)
    mesh.set_vertices(vertices)
    mesh.set_tetrahedra(elements)

    # Set a single edge with a ridge marker
    edge_ref = 25
    mesh.set_edge(0, 1, ref=edge_ref, idx=0)

    # Verify with get_edge
    v0, v1, ref = mesh.get_edge(0)
    assert (v0, v1) == (0, 1)
    assert ref == edge_ref


def test_single_element_mixed_construction() -> None:
    """Test building a mesh using a mix of single and bulk operations."""
    # Define expected counts
    expected_vertices = 4
    expected_tetrahedra = 1
    expected_triangles = 4

    # Define reference IDs for verification
    tet_ref = 100
    tri_refs = [10, 20, 30, 40]

    # Build a simple tetrahedron using single-element setters
    mesh = MmgMesh3D()
    mesh.set_mesh_size(
        vertices=expected_vertices,
        tetrahedra=expected_tetrahedra,
        triangles=expected_triangles,
    )

    # Set vertices one by one with different refs
    mesh.set_vertex(0.0, 0.0, 0.0, ref=1, idx=0)
    mesh.set_vertex(1.0, 0.0, 0.0, ref=2, idx=1)
    mesh.set_vertex(0.5, 1.0, 0.0, ref=3, idx=2)
    mesh.set_vertex(0.5, 0.5, 1.0, ref=4, idx=3)

    # Set the tetrahedron
    mesh.set_tetrahedron(0, 1, 2, 3, ref=tet_ref, idx=0)

    # Set boundary triangles one by one
    mesh.set_triangle(0, 1, 2, ref=tri_refs[0], idx=0)  # bottom
    mesh.set_triangle(0, 1, 3, ref=tri_refs[1], idx=1)  # front
    mesh.set_triangle(1, 2, 3, ref=tri_refs[2], idx=2)  # right
    mesh.set_triangle(0, 2, 3, ref=tri_refs[3], idx=3)  # left

    # Verify mesh construction
    np_v, ne, _, nt, _, _ = mesh.get_mesh_size()
    assert np_v == expected_vertices
    assert ne == expected_tetrahedra
    assert nt == expected_triangles

    # Verify element by index
    _, _, _, _, ref = mesh.get_tetrahedron(0)
    assert ref == tet_ref

    # Verify triangles by index
    _, _, _, ref = mesh.get_triangle(0)
    assert ref == tri_refs[0]
    _, _, _, ref = mesh.get_triangle(3)
    assert ref == tri_refs[3]


# Tests for Phase 3: Prisms and Quadrilaterals


def test_set_prism_single() -> None:
    """Test setting a single prism."""
    # Create a simple mesh with vertices for a prism
    vertices = np.array(
        [
            [0.0, 0.0, 0.0],  # 0
            [1.0, 0.0, 0.0],  # 1
            [0.5, 1.0, 0.0],  # 2
            [0.0, 0.0, 1.0],  # 3
            [1.0, 0.0, 1.0],  # 4
            [0.5, 1.0, 1.0],  # 5
        ],
        dtype=np.float64,
    )

    mesh = MmgMesh3D()
    mesh.set_mesh_size(vertices=len(vertices), prisms=1)
    mesh.set_vertices(vertices)

    # Set a single prism with a material ID
    prism_ref = 42
    mesh.set_prism(0, 1, 2, 3, 4, 5, ref=prism_ref, idx=0)

    # Verify with get_prism
    v0, v1, v2, v3, v4, v5, ref = mesh.get_prism(0)
    assert (v0, v1, v2, v3, v4, v5) == (0, 1, 2, 3, 4, 5)
    assert ref == prism_ref


def test_set_prisms_bulk() -> None:
    """Test bulk prism setting."""
    # Create vertices for 2 prisms (stacked)
    vertices = np.array(
        [
            [0.0, 0.0, 0.0],  # 0
            [1.0, 0.0, 0.0],  # 1
            [0.5, 1.0, 0.0],  # 2
            [0.0, 0.0, 1.0],  # 3
            [1.0, 0.0, 1.0],  # 4
            [0.5, 1.0, 1.0],  # 5
            [0.0, 0.0, 2.0],  # 6
            [1.0, 0.0, 2.0],  # 7
            [0.5, 1.0, 2.0],  # 8
        ],
        dtype=np.float64,
    )

    prisms = np.array(
        [
            [0, 1, 2, 3, 4, 5],  # bottom prism
            [3, 4, 5, 6, 7, 8],  # top prism
        ],
        dtype=np.int32,
    )
    prism_refs = np.array([10, 20], dtype=np.int64)

    mesh = MmgMesh3D()
    mesh.set_mesh_size(vertices=len(vertices), prisms=len(prisms))
    mesh.set_vertices(vertices)
    mesh.set_prisms(prisms, refs=prism_refs)

    # Verify prisms
    prisms_out = mesh.get_prisms()
    npt.assert_array_equal(prisms_out, prisms)

    # Verify prisms with refs
    prisms_out, refs_out = mesh.get_prisms_with_refs()
    npt.assert_array_equal(prisms_out, prisms)
    npt.assert_array_equal(refs_out, prism_refs)


def test_set_quadrilateral_single() -> None:
    """Test setting a single quadrilateral."""
    vertices, elements = create_test_mesh()

    mesh = MmgMesh3D()
    mesh.set_mesh_size(
        vertices=len(vertices),
        tetrahedra=len(elements),
        quadrilaterals=1,
    )
    mesh.set_vertices(vertices)
    mesh.set_tetrahedra(elements)

    # Set a single quadrilateral (bottom face of cube)
    quad_ref = 77
    mesh.set_quadrilateral(0, 1, 2, 3, ref=quad_ref, idx=0)

    # Verify with get_quadrilateral
    v0, v1, v2, v3, ref = mesh.get_quadrilateral(0)
    assert (v0, v1, v2, v3) == (0, 1, 2, 3)
    assert ref == quad_ref


def test_set_quadrilaterals_bulk() -> None:
    """Test bulk quadrilateral setting."""
    vertices, elements = create_test_mesh()

    # Define quadrilateral faces of the cube
    quads = np.array(
        [
            [0, 1, 2, 3],  # bottom face
            [4, 5, 6, 7],  # top face
        ],
        dtype=np.int32,
    )
    quad_refs = np.array([100, 200], dtype=np.int64)

    mesh = MmgMesh3D()
    mesh.set_mesh_size(
        vertices=len(vertices),
        tetrahedra=len(elements),
        quadrilaterals=len(quads),
    )
    mesh.set_vertices(vertices)
    mesh.set_tetrahedra(elements)
    mesh.set_quadrilaterals(quads, refs=quad_refs)

    # Verify quadrilaterals
    quads_out = mesh.get_quadrilaterals()
    npt.assert_array_equal(quads_out, quads)

    # Verify quadrilaterals with refs
    quads_out, refs_out = mesh.get_quadrilaterals_with_refs()
    npt.assert_array_equal(quads_out, quads)
    npt.assert_array_equal(refs_out, quad_refs)


def test_get_tetrahedra_alias() -> None:
    """Test that get_tetrahedra() works as an alias for get_elements()."""
    vertices, elements = create_test_mesh()
    mesh = MmgMesh3D(vertices, elements)

    # Both methods should return the same result
    npt.assert_array_equal(mesh.get_tetrahedra(), mesh.get_elements())

    # Test with refs
    elem_refs = np.array([1, 2, 3, 4, 5], dtype=np.int64)
    mesh2 = MmgMesh3D()
    mesh2.set_mesh_size(vertices=len(vertices), tetrahedra=len(elements))
    mesh2.set_vertices(vertices)
    mesh2.set_tetrahedra(elements, refs=elem_refs)

    elems1, refs1 = mesh2.get_elements_with_refs()
    elems2, refs2 = mesh2.get_tetrahedra_with_refs()
    npt.assert_array_equal(elems1, elems2)
    npt.assert_array_equal(refs1, refs2)


# Phase 4: Tests for MmgMesh2D (2D planar meshes)


def create_2d_test_mesh() -> tuple[np.ndarray, np.ndarray]:
    """Create a simple 2D square mesh for testing."""
    vertices = np.array(
        [
            [0.0, 0.0],  # 0
            [1.0, 0.0],  # 1
            [1.0, 1.0],  # 2
            [0.0, 1.0],  # 3
        ],
        dtype=np.float64,
    )

    triangles = np.array(
        [
            [0, 1, 2],
            [0, 2, 3],
        ],
        dtype=np.int32,
    )

    return vertices, triangles


def test_mmg_mesh_2d_construction() -> None:
    """Test MmgMesh2D construction."""
    vertices, triangles = create_2d_test_mesh()

    # Test constructor with data
    mesh = MmgMesh2D(vertices, triangles)
    npt.assert_array_almost_equal(mesh.get_vertices(), vertices)
    npt.assert_array_equal(mesh.get_triangles(), triangles)


def test_mmg_mesh_2d_mesh_size() -> None:
    """Test MmgMesh2D set_mesh_size and get_mesh_size."""
    mesh = MmgMesh2D()

    expected_vertices = 4
    expected_triangles = 2
    expected_edges = 4
    mesh.set_mesh_size(
        vertices=expected_vertices,
        triangles=expected_triangles,
        edges=expected_edges,
    )

    nv, nt, nquad, ne = mesh.get_mesh_size()
    assert nv == expected_vertices
    assert nt == expected_triangles
    assert nquad == 0
    assert ne == expected_edges


def test_mmg_mesh_2d_bulk_operations() -> None:
    """Test MmgMesh2D bulk set/get operations."""
    vertices, triangles = create_2d_test_mesh()

    # Define edges (boundary edges)
    edges = np.array(
        [
            [0, 1],  # bottom
            [1, 2],  # right
            [2, 3],  # top
            [3, 0],  # left
        ],
        dtype=np.int32,
    )

    mesh = MmgMesh2D()
    mesh.set_mesh_size(
        vertices=len(vertices),
        triangles=len(triangles),
        edges=len(edges),
    )
    mesh.set_vertices(vertices)
    mesh.set_triangles(triangles)
    mesh.set_edges(edges)

    npt.assert_array_almost_equal(mesh.get_vertices(), vertices)
    npt.assert_array_equal(mesh.get_triangles(), triangles)
    npt.assert_array_equal(mesh.get_edges(), edges)


def test_mmg_mesh_2d_single_element() -> None:
    """Test MmgMesh2D single element setters/getters."""
    mesh = MmgMesh2D()
    mesh.set_mesh_size(vertices=3, triangles=1, edges=1)

    # Set vertices one by one
    vertex_ref = 1
    mesh.set_vertex(0.0, 0.0, ref=vertex_ref, idx=0)
    mesh.set_vertex(1.0, 0.0, ref=vertex_ref, idx=1)
    mesh.set_vertex(0.5, 1.0, ref=vertex_ref, idx=2)

    # Set triangle
    tri_ref = 10
    mesh.set_triangle(0, 1, 2, ref=tri_ref, idx=0)

    # Set edge
    edge_ref = 100
    mesh.set_edge(0, 1, ref=edge_ref, idx=0)

    # Verify vertex
    x, y, ref = mesh.get_vertex(0)
    assert (x, y) == (0.0, 0.0)
    assert ref == vertex_ref

    # Verify triangle
    v0, v1, v2, ref = mesh.get_triangle(0)
    assert (v0, v1, v2) == (0, 1, 2)
    assert ref == tri_ref

    # Verify edge
    v0, v1, ref = mesh.get_edge(0)
    assert (v0, v1) == (0, 1)
    assert ref == edge_ref


def test_mmg_mesh_2d_with_refs() -> None:
    """Test MmgMesh2D with reference IDs."""
    vertices, triangles = create_2d_test_mesh()
    vertex_refs = np.array([1, 2, 3, 4], dtype=np.int64)
    tri_refs = np.array([10, 20], dtype=np.int64)

    mesh = MmgMesh2D()
    mesh.set_mesh_size(vertices=len(vertices), triangles=len(triangles))
    mesh.set_vertices(vertices, refs=vertex_refs)
    mesh.set_triangles(triangles, refs=tri_refs)

    # Verify vertices with refs
    verts_out, refs_out = mesh.get_vertices_with_refs()
    npt.assert_array_almost_equal(verts_out, vertices)
    npt.assert_array_equal(refs_out, vertex_refs)

    # Verify triangles with refs
    tris_out, refs_out = mesh.get_triangles_with_refs()
    npt.assert_array_equal(tris_out, triangles)
    npt.assert_array_equal(refs_out, tri_refs)


def test_mmg_mesh_2d_file_io(tmp_path: Path) -> None:
    """Test MmgMesh2D file I/O."""
    vertices, triangles = create_2d_test_mesh()
    mesh = MmgMesh2D(vertices, triangles)

    # Save and reload
    mesh_file = tmp_path / "test_2d.mesh"
    mesh.save(mesh_file)

    loaded = MmgMesh2D(mesh_file)
    npt.assert_array_almost_equal(loaded.get_vertices(), vertices)
    npt.assert_array_equal(loaded.get_triangles(), triangles)


# Phase 4: Tests for MmgMeshS (surface meshes)


def create_surface_test_mesh() -> tuple[np.ndarray, np.ndarray]:
    """Create a simple surface mesh (unit triangle in 3D) for testing."""
    vertices = np.array(
        [
            [0.0, 0.0, 0.0],  # 0
            [1.0, 0.0, 0.0],  # 1
            [0.5, 1.0, 0.0],  # 2
            [0.5, 0.5, 1.0],  # 3
        ],
        dtype=np.float64,
    )

    triangles = np.array(
        [
            [0, 1, 2],  # bottom
            [0, 1, 3],  # front
            [1, 2, 3],  # right
            [0, 2, 3],  # left
        ],
        dtype=np.int32,
    )

    return vertices, triangles


def test_mmg_mesh_s_construction() -> None:
    """Test MmgMeshS construction."""
    vertices, triangles = create_surface_test_mesh()

    # Test constructor with data
    mesh = MmgMeshS(vertices, triangles)
    npt.assert_array_almost_equal(mesh.get_vertices(), vertices)
    npt.assert_array_equal(mesh.get_triangles(), triangles)


def test_mmg_mesh_s_mesh_size() -> None:
    """Test MmgMeshS set_mesh_size and get_mesh_size."""
    mesh = MmgMeshS()

    expected_vertices = 4
    expected_triangles = 4
    expected_edges = 6
    mesh.set_mesh_size(
        vertices=expected_vertices,
        triangles=expected_triangles,
        edges=expected_edges,
    )

    nv, nt, ne = mesh.get_mesh_size()
    assert nv == expected_vertices
    assert nt == expected_triangles
    assert ne == expected_edges


def test_mmg_mesh_s_bulk_operations() -> None:
    """Test MmgMeshS bulk set/get operations."""
    vertices, triangles = create_surface_test_mesh()

    # Define edges (boundary edges of the surface)
    edges = np.array(
        [
            [0, 1],
            [1, 2],
            [2, 0],
            [0, 3],
            [1, 3],
            [2, 3],
        ],
        dtype=np.int32,
    )

    mesh = MmgMeshS()
    mesh.set_mesh_size(
        vertices=len(vertices),
        triangles=len(triangles),
        edges=len(edges),
    )
    mesh.set_vertices(vertices)
    mesh.set_triangles(triangles)
    mesh.set_edges(edges)

    npt.assert_array_almost_equal(mesh.get_vertices(), vertices)
    npt.assert_array_equal(mesh.get_triangles(), triangles)
    npt.assert_array_equal(mesh.get_edges(), edges)


def test_mmg_mesh_s_single_element() -> None:
    """Test MmgMeshS single element setters/getters."""
    mesh = MmgMeshS()
    mesh.set_mesh_size(vertices=3, triangles=1, edges=1)

    # Set vertices one by one
    vertex_ref = 1
    mesh.set_vertex(0.0, 0.0, 0.0, ref=vertex_ref, idx=0)
    mesh.set_vertex(1.0, 0.0, 0.0, ref=vertex_ref, idx=1)
    mesh.set_vertex(0.5, 1.0, 0.5, ref=vertex_ref, idx=2)

    # Set triangle
    tri_ref = 10
    mesh.set_triangle(0, 1, 2, ref=tri_ref, idx=0)

    # Set edge
    edge_ref = 100
    mesh.set_edge(0, 1, ref=edge_ref, idx=0)

    # Verify vertex
    x, y, z, ref = mesh.get_vertex(0)
    assert (x, y, z) == (0.0, 0.0, 0.0)
    assert ref == vertex_ref

    # Verify triangle
    v0, v1, v2, ref = mesh.get_triangle(0)
    assert (v0, v1, v2) == (0, 1, 2)
    assert ref == tri_ref

    # Verify edge
    v0, v1, ref = mesh.get_edge(0)
    assert (v0, v1) == (0, 1)
    assert ref == edge_ref


def test_mmg_mesh_s_with_refs() -> None:
    """Test MmgMeshS with reference IDs."""
    vertices, triangles = create_surface_test_mesh()
    vertex_refs = np.array([1, 2, 3, 4], dtype=np.int64)
    tri_refs = np.array([10, 20, 30, 40], dtype=np.int64)

    mesh = MmgMeshS()
    mesh.set_mesh_size(vertices=len(vertices), triangles=len(triangles))
    mesh.set_vertices(vertices, refs=vertex_refs)
    mesh.set_triangles(triangles, refs=tri_refs)

    # Verify vertices with refs
    verts_out, refs_out = mesh.get_vertices_with_refs()
    npt.assert_array_almost_equal(verts_out, vertices)
    npt.assert_array_equal(refs_out, vertex_refs)

    # Verify triangles with refs
    tris_out, refs_out = mesh.get_triangles_with_refs()
    npt.assert_array_equal(tris_out, triangles)
    npt.assert_array_equal(refs_out, tri_refs)


def test_mmg_mesh_s_file_io(tmp_path: Path) -> None:
    """Test MmgMeshS file I/O."""
    vertices, triangles = create_surface_test_mesh()
    mesh = MmgMeshS(vertices, triangles)

    # Save and reload
    mesh_file = tmp_path / "test_s.mesh"
    mesh.save(mesh_file)

    loaded = MmgMeshS(mesh_file)
    npt.assert_array_almost_equal(loaded.get_vertices(), vertices)
    npt.assert_array_equal(loaded.get_triangles(), triangles)


# Tests for C-contiguity validation


def test_non_contiguous_array_rejected() -> None:
    """Test that non-contiguous arrays are rejected with clear error message."""
    mesh = MmgMesh3D()
    mesh.set_mesh_size(vertices=4, tetrahedra=1)

    # Create a Fortran-order (column-major) array which is not C-contiguous
    vertices_f = np.array(
        [
            [0.0, 0.0, 0.0],
            [1.0, 0.0, 0.0],
            [0.5, 1.0, 0.0],
            [0.5, 0.5, 1.0],
        ],
        dtype=np.float64,
        order="F",  # Fortran order (column-major)
    )

    # Verify it's not C-contiguous
    assert not vertices_f.flags["C_CONTIGUOUS"]

    # Should raise RuntimeError about C-contiguity
    with pytest.raises(RuntimeError, match="C-contiguous"):
        mesh.set_vertices(vertices_f)


def test_sliced_array_rejected() -> None:
    """Test that sliced arrays (non-contiguous) are rejected."""
    mesh = MmgMesh3D()
    mesh.set_mesh_size(vertices=4, tetrahedra=1)

    # Create a larger array and slice it (non-contiguous view)
    large_vertices = np.array(
        [
            [0.0, 0.0, 0.0],
            [1.0, 0.0, 0.0],
            [0.5, 1.0, 0.0],
            [0.5, 0.5, 1.0],
            [2.0, 0.0, 0.0],
            [2.5, 1.0, 0.0],
            [2.5, 0.5, 1.0],
            [3.0, 0.0, 0.0],
        ],
        dtype=np.float64,
    )

    # Slice every other row - this creates a non-contiguous view
    vertices_sliced = large_vertices[::2]

    # Verify it's not C-contiguous
    assert not vertices_sliced.flags["C_CONTIGUOUS"]

    # Should raise RuntimeError about C-contiguity
    with pytest.raises(RuntimeError, match="C-contiguous"):
        mesh.set_vertices(vertices_sliced)


def test_contiguous_copy_accepted() -> None:
    """Test that making a contiguous copy of non-contiguous data works."""
    mesh = MmgMesh3D()
    mesh.set_mesh_size(vertices=4, tetrahedra=1)

    # Create a Fortran-order array
    vertices_f = np.array(
        [
            [0.0, 0.0, 0.0],
            [1.0, 0.0, 0.0],
            [0.5, 1.0, 0.0],
            [0.5, 0.5, 1.0],
        ],
        dtype=np.float64,
        order="F",
    )

    # Make a C-contiguous copy
    vertices_c = np.ascontiguousarray(vertices_f)

    # Verify it's now C-contiguous
    assert vertices_c.flags["C_CONTIGUOUS"]

    # Should work now
    mesh.set_vertices(vertices_c)

    # Verify vertices were set correctly
    npt.assert_array_almost_equal(mesh.get_vertices(), vertices_c)


def visualize_mmg_mesh() -> None:
    """Visualize a simple MmgMesh3D using PyVista."""
    import pyvista as pv

    vertices, elements = create_test_mesh()
    mesh = MmgMesh3D(vertices, elements)

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


# Tests for In-Memory Remeshing API


def test_mmg_mesh_3d_remesh() -> None:
    """Test in-memory remeshing for MmgMesh3D."""
    vertices, elements = create_test_mesh()
    mesh = MmgMesh3D(vertices, elements)

    # Remesh with kwargs
    mesh.remesh(hmax=0.5, verbose=False)

    # Verify mesh still has valid data after remeshing
    output_vertices = mesh.get_vertices()
    output_elements = mesh.get_elements()

    assert output_vertices.shape[0] > 0, "Mesh should have vertices after remeshing"
    assert output_vertices.shape[1] == 3, "Vertices should be 3D"
    assert output_elements.shape[0] > 0, "Mesh should have elements after remeshing"
    assert output_elements.shape[1] == 4, "Elements should be tetrahedra"

    # Remeshing with hmax should generally increase element count
    # (finer mesh) but this depends on initial mesh size
    # Just verify that we got a valid mesh back
    assert not np.isnan(output_vertices).any(), "Vertices should not contain NaN"


def test_mmg_mesh_3d_remesh_with_metric() -> None:
    """Test in-memory remeshing with a metric field."""
    vertices, elements = create_test_mesh()
    mesh = MmgMesh3D(vertices, elements)

    # Set a scalar metric (target edge size at each vertex)
    metric = np.ones((len(vertices), 1), dtype=np.float64) * 0.3
    mesh["metric"] = metric

    # Remesh
    mesh.remesh(verbose=False)

    # Verify mesh is valid
    output_vertices = mesh.get_vertices()
    output_elements = mesh.get_elements()

    assert output_vertices.shape[0] > 0
    assert output_elements.shape[0] > 0


def test_mmg_mesh_2d_remesh() -> None:
    """Test in-memory remeshing for MmgMesh2D."""
    vertices, triangles = create_2d_test_mesh()
    mesh = MmgMesh2D(vertices, triangles)

    # Remesh
    mesh.remesh(hmax=0.3, verbose=False)

    # Verify mesh is valid after remeshing
    output_vertices = mesh.get_vertices()
    output_triangles = mesh.get_triangles()

    assert output_vertices.shape[0] > 0, "Mesh should have vertices after remeshing"
    assert output_vertices.shape[1] == 2, "Vertices should be 2D"
    assert output_triangles.shape[0] > 0, "Mesh should have triangles after remeshing"
    assert output_triangles.shape[1] == 3, "Triangles should have 3 vertices"


def test_mmg_mesh_s_remesh() -> None:
    """Test in-memory remeshing for MmgMeshS."""
    vertices, triangles = create_surface_test_mesh()
    mesh = MmgMeshS(vertices, triangles)

    # Remesh
    mesh.remesh(hmax=0.5, verbose=False)

    # Verify mesh is valid after remeshing
    output_vertices = mesh.get_vertices()
    output_triangles = mesh.get_triangles()

    assert output_vertices.shape[0] > 0, "Mesh should have vertices after remeshing"
    assert output_vertices.shape[1] == 3, "Vertices should be 3D"
    assert output_triangles.shape[0] > 0, "Mesh should have triangles after remeshing"
    assert output_triangles.shape[1] == 3, "Triangles should have 3 vertices"


def test_mmg_mesh_3d_remesh_no_options() -> None:
    """Test remeshing with default options."""
    vertices, elements = create_test_mesh()
    mesh = MmgMesh3D(vertices, elements)

    # Remesh with default options (just suppress output)
    mesh.remesh(verbose=False)

    # Should still produce valid output
    assert mesh.get_vertices().shape[0] > 0
    assert mesh.get_elements().shape[0] > 0


def test_mmg_mesh_3d_remesh_verbose_int() -> None:
    """Test that verbose accepts both bool and int."""
    vertices, elements = create_test_mesh()
    mesh = MmgMesh3D(vertices, elements)

    # Test with integer verbose level (MMG native)
    mesh.remesh(hmax=0.5, verbose=-1)

    assert mesh.get_vertices().shape[0] > 0
    assert mesh.get_elements().shape[0] > 0


# Tests for Lagrangian Motion Remeshing
# Note: Lagrangian motion requires the optional ELAS library.
# The feature is disabled by default (USE_ELAS=OFF in CMake).
# Tests are skipped if the feature is not available.


def _lagrangian_available_3d() -> bool:
    """Check if Lagrangian motion is available for 3D meshes."""
    try:
        vertices, elements = create_test_mesh()
        mesh = MmgMesh3D(vertices, elements)
        displacement = np.zeros((vertices.shape[0], 3), dtype=np.float64)
        mesh.remesh_lagrangian(displacement, verbose=False)
    except RuntimeError as e:
        if "lagrangian motion" in str(e).lower() or "lag" in str(e).lower():
            return False
        raise
    else:
        return True


def _lagrangian_available_2d() -> bool:
    """Check if Lagrangian motion is available for 2D meshes."""
    try:
        vertices, triangles = create_2d_test_mesh()
        mesh = MmgMesh2D(vertices, triangles)
        displacement = np.zeros((vertices.shape[0], 2), dtype=np.float64)
        mesh.remesh_lagrangian(displacement, verbose=False)
    except RuntimeError as e:
        if "lagrangian motion" in str(e).lower() or "lag" in str(e).lower():
            return False
        raise
    else:
        return True


@pytest.mark.skipif(
    not _lagrangian_available_3d(),
    reason="Lagrangian motion requires USE_ELAS=ON at build time",
)
def test_mmg_mesh_3d_remesh_lagrangian() -> None:
    """Test Lagrangian motion remeshing for MmgMesh3D."""
    vertices, elements = create_test_mesh()
    mesh = MmgMesh3D(vertices, elements)

    n_vertices = vertices.shape[0]
    displacement = np.zeros((n_vertices, 3), dtype=np.float64)
    displacement[:, 0] = 0.1

    mesh.remesh_lagrangian(displacement, verbose=False)

    output_vertices = mesh.get_vertices()
    output_elements = mesh.get_elements()

    assert output_vertices.shape[0] > 0, "Should have vertices after remeshing"
    assert output_vertices.shape[1] == 3, "Vertices should be 3D"
    assert output_elements.shape[0] > 0, "Should have elements after remeshing"
    assert output_elements.shape[1] == 4, "Elements should be tetrahedra"


@pytest.mark.skipif(
    not _lagrangian_available_3d(),
    reason="Lagrangian motion requires USE_ELAS=ON at build time",
)
def test_mmg_mesh_3d_remesh_lagrangian_with_options() -> None:
    """Test Lagrangian motion remeshing with additional options."""
    vertices, elements = create_test_mesh()
    mesh = MmgMesh3D(vertices, elements)

    n_vertices = vertices.shape[0]
    displacement = np.zeros((n_vertices, 3), dtype=np.float64)
    displacement[:, 1] = 0.05

    mesh.remesh_lagrangian(displacement, hmax=0.3, verbose=False)

    output_vertices = mesh.get_vertices()
    assert output_vertices.shape[0] > 0


@pytest.mark.skipif(
    not _lagrangian_available_2d(),
    reason="Lagrangian motion requires USE_ELAS=ON at build time",
)
def test_mmg_mesh_2d_remesh_lagrangian() -> None:
    """Test Lagrangian motion remeshing for MmgMesh2D."""
    vertices, triangles = create_2d_test_mesh()
    mesh = MmgMesh2D(vertices, triangles)

    n_vertices = vertices.shape[0]
    displacement = np.zeros((n_vertices, 2), dtype=np.float64)
    displacement[:, 0] = 0.05

    mesh.remesh_lagrangian(displacement, verbose=False)

    output_vertices = mesh.get_vertices()
    output_triangles = mesh.get_triangles()

    assert output_vertices.shape[0] > 0, "Should have vertices after remeshing"
    assert output_vertices.shape[1] == 2, "Vertices should be 2D"
    assert output_triangles.shape[0] > 0, "Should have triangles after remeshing"
    assert output_triangles.shape[1] == 3, "Triangles should have 3 vertices"


def test_mmg_mesh_2d_displacement_field() -> None:
    """Test setting and getting displacement field for MmgMesh2D."""
    vertices, triangles = create_2d_test_mesh()
    mesh = MmgMesh2D(vertices, triangles)

    n_vertices = vertices.shape[0]
    displacement = np.random.rand(n_vertices, 2).astype(np.float64) * 0.1

    mesh["displacement"] = displacement
    retrieved = mesh["displacement"]

    npt.assert_array_almost_equal(retrieved, displacement)


# Element Attributes Tests


def test_set_corners_3d() -> None:
    """Test setting corner vertices for MmgMesh3D."""
    vertices, elements = create_test_mesh()

    mesh = MmgMesh3D()
    mesh.set_mesh_size(vertices=len(vertices), tetrahedra=len(elements))
    mesh.set_vertices(vertices)
    mesh.set_tetrahedra(elements)

    corner_indices = np.array([0, 2, 4, 6], dtype=np.int32)
    mesh.set_corners(corner_indices)


def test_set_required_vertices_3d() -> None:
    """Test setting required vertices for MmgMesh3D."""
    vertices, elements = create_test_mesh()

    mesh = MmgMesh3D()
    mesh.set_mesh_size(vertices=len(vertices), tetrahedra=len(elements))
    mesh.set_vertices(vertices)
    mesh.set_tetrahedra(elements)

    required_indices = np.array([0, 1, 2, 3], dtype=np.int32)
    mesh.set_required_vertices(required_indices)


def test_set_ridge_edges_3d() -> None:
    """Test setting ridge edges for MmgMesh3D."""
    vertices, elements = create_test_mesh()

    edges = np.array(
        [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 0],
        ],
        dtype=np.int32,
    )

    mesh = MmgMesh3D()
    mesh.set_mesh_size(
        vertices=len(vertices),
        tetrahedra=len(elements),
        edges=len(edges),
    )
    mesh.set_vertices(vertices)
    mesh.set_tetrahedra(elements)
    mesh.set_edges(edges)

    ridge_indices = np.array([0, 2], dtype=np.int32)
    mesh.set_ridge_edges(ridge_indices)


def test_set_corners_2d() -> None:
    """Test setting corner vertices for MmgMesh2D."""
    vertices, triangles = create_2d_test_mesh()

    mesh = MmgMesh2D()
    mesh.set_mesh_size(vertices=len(vertices), triangles=len(triangles))
    mesh.set_vertices(vertices)
    mesh.set_triangles(triangles)

    corner_indices = np.array([0, 1, 2, 3], dtype=np.int32)
    mesh.set_corners(corner_indices)


def test_set_required_vertices_2d() -> None:
    """Test setting required vertices for MmgMesh2D."""
    vertices, triangles = create_2d_test_mesh()

    mesh = MmgMesh2D()
    mesh.set_mesh_size(vertices=len(vertices), triangles=len(triangles))
    mesh.set_vertices(vertices)
    mesh.set_triangles(triangles)

    required_indices = np.array([0, 2], dtype=np.int32)
    mesh.set_required_vertices(required_indices)


def test_set_required_edges_2d() -> None:
    """Test setting required edges for MmgMesh2D."""
    vertices, triangles = create_2d_test_mesh()

    edges = np.array(
        [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 0],
        ],
        dtype=np.int32,
    )

    mesh = MmgMesh2D()
    mesh.set_mesh_size(
        vertices=len(vertices),
        triangles=len(triangles),
        edges=len(edges),
    )
    mesh.set_vertices(vertices)
    mesh.set_triangles(triangles)
    mesh.set_edges(edges)

    required_edge_indices = np.array([0, 1], dtype=np.int32)
    mesh.set_required_edges(required_edge_indices)


def test_set_corners_surface() -> None:
    """Test setting corner vertices for MmgMeshS."""
    vertices, triangles = create_surface_test_mesh()

    mesh = MmgMeshS()
    mesh.set_mesh_size(vertices=len(vertices), triangles=len(triangles))
    mesh.set_vertices(vertices)
    mesh.set_triangles(triangles)

    corner_indices = np.array([0, 1, 2, 3], dtype=np.int32)
    mesh.set_corners(corner_indices)


def test_set_required_vertices_surface() -> None:
    """Test setting required vertices for MmgMeshS."""
    vertices, triangles = create_surface_test_mesh()

    mesh = MmgMeshS()
    mesh.set_mesh_size(vertices=len(vertices), triangles=len(triangles))
    mesh.set_vertices(vertices)
    mesh.set_triangles(triangles)

    required_indices = np.array([0, 2], dtype=np.int32)
    mesh.set_required_vertices(required_indices)


def test_set_ridge_edges_surface() -> None:
    """Test setting ridge edges for MmgMeshS."""
    vertices, triangles = create_surface_test_mesh()

    edges = np.array(
        [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 0],
        ],
        dtype=np.int32,
    )

    mesh = MmgMeshS()
    mesh.set_mesh_size(
        vertices=len(vertices),
        triangles=len(triangles),
        edges=len(edges),
    )
    mesh.set_vertices(vertices)
    mesh.set_triangles(triangles)
    mesh.set_edges(edges)

    ridge_indices = np.array([0, 2], dtype=np.int32)
    mesh.set_ridge_edges(ridge_indices)


def test_element_attributes_invalid_indices() -> None:
    """Test that invalid indices raise errors."""
    vertices, elements = create_test_mesh()

    mesh = MmgMesh3D()
    mesh.set_mesh_size(vertices=len(vertices), tetrahedra=len(elements))
    mesh.set_vertices(vertices)
    mesh.set_tetrahedra(elements)

    with pytest.raises(RuntimeError, match="out of range"):
        mesh.set_corners(np.array([100], dtype=np.int32))

    with pytest.raises(RuntimeError, match="out of range"):
        mesh.set_required_vertices(np.array([-1], dtype=np.int32))


def test_element_attributes_empty_array() -> None:
    """Test that empty arrays work correctly."""
    vertices, elements = create_test_mesh()

    mesh = MmgMesh3D()
    mesh.set_mesh_size(vertices=len(vertices), tetrahedra=len(elements))
    mesh.set_vertices(vertices)
    mesh.set_tetrahedra(elements)

    mesh.set_corners(np.array([], dtype=np.int32))
    mesh.set_required_vertices(np.array([], dtype=np.int32))


# Topology Query Tests


def test_get_adjacent_elements_3d() -> None:
    """Test getting adjacent elements for MmgMesh3D."""
    vertices, elements = create_test_mesh()

    mesh = MmgMesh3D()
    mesh.set_mesh_size(vertices=len(vertices), tetrahedra=len(elements))
    mesh.set_vertices(vertices)
    mesh.set_tetrahedra(elements)

    # Test for the center tetrahedron (index 4) which shares faces with others
    adjacent = mesh.get_adjacent_elements(4)
    assert adjacent.shape == (4,), "Should return 4 adjacent elements (one per face)"
    assert adjacent.dtype == np.int32

    # -1 indicates boundary (no neighbor on that face)
    # Valid neighbors are 0-based indices
    for idx in adjacent:
        assert idx >= -1
        assert idx < len(elements)


def test_get_vertex_neighbors_3d() -> None:
    """Test getting vertex neighbors for MmgMesh3D."""
    vertices, elements = create_test_mesh()

    mesh = MmgMesh3D()
    mesh.set_mesh_size(vertices=len(vertices), tetrahedra=len(elements))
    mesh.set_vertices(vertices)
    mesh.set_tetrahedra(elements)

    # Test for vertex 3 which is connected to multiple tetrahedra
    neighbors = mesh.get_vertex_neighbors(3)
    assert neighbors.dtype == np.int32
    assert len(neighbors) > 0, "Vertex should have neighbors"

    # All neighbors should be valid vertex indices
    for idx in neighbors:
        assert idx >= 0
        assert idx < len(vertices)

    # Vertex 3 is not in its own neighbors
    assert 3 not in neighbors


def test_get_element_quality_3d() -> None:
    """Test getting element quality for MmgMesh3D."""
    vertices, elements = create_test_mesh()

    mesh = MmgMesh3D()
    mesh.set_mesh_size(vertices=len(vertices), tetrahedra=len(elements))
    mesh.set_vertices(vertices)
    mesh.set_tetrahedra(elements)

    # Test quality for each element
    for i in range(len(elements)):
        quality = mesh.get_element_quality(i)
        assert isinstance(quality, float)
        # Quality should be a positive value
        assert quality >= 0.0


def test_get_element_qualities_3d() -> None:
    """Test getting all element qualities for MmgMesh3D."""
    vertices, elements = create_test_mesh()

    mesh = MmgMesh3D()
    mesh.set_mesh_size(vertices=len(vertices), tetrahedra=len(elements))
    mesh.set_vertices(vertices)
    mesh.set_tetrahedra(elements)

    qualities = mesh.get_element_qualities()
    assert qualities.shape == (len(elements),)
    assert qualities.dtype == np.float64

    # All qualities should be non-negative
    assert np.all(qualities >= 0.0)


def test_get_adjacent_elements_2d() -> None:
    """Test getting adjacent elements for MmgMesh2D."""
    vertices, triangles = create_2d_test_mesh()

    mesh = MmgMesh2D()
    mesh.set_mesh_size(vertices=len(vertices), triangles=len(triangles))
    mesh.set_vertices(vertices)
    mesh.set_triangles(triangles)

    # Test for first triangle
    adjacent = mesh.get_adjacent_elements(0)
    assert adjacent.shape == (3,), "Should return 3 adjacent elements (one per edge)"
    assert adjacent.dtype == np.int32

    for idx in adjacent:
        assert idx >= -1
        assert idx < len(triangles)


def test_get_vertex_neighbors_2d() -> None:
    """Test getting vertex neighbors for MmgMesh2D."""
    vertices, triangles = create_2d_test_mesh()

    mesh = MmgMesh2D()
    mesh.set_mesh_size(vertices=len(vertices), triangles=len(triangles))
    mesh.set_vertices(vertices)
    mesh.set_triangles(triangles)

    # Test for vertex 0 at corner of square
    neighbors = mesh.get_vertex_neighbors(0)
    assert neighbors.dtype == np.int32
    assert len(neighbors) > 0

    for idx in neighbors:
        assert idx >= 0
        assert idx < len(vertices)

    assert 0 not in neighbors


def test_get_element_quality_2d() -> None:
    """Test getting element quality for MmgMesh2D."""
    vertices, triangles = create_2d_test_mesh()

    mesh = MmgMesh2D()
    mesh.set_mesh_size(vertices=len(vertices), triangles=len(triangles))
    mesh.set_vertices(vertices)
    mesh.set_triangles(triangles)

    for i in range(len(triangles)):
        quality = mesh.get_element_quality(i)
        assert isinstance(quality, float)
        assert quality >= 0.0


def test_get_element_qualities_2d() -> None:
    """Test getting all element qualities for MmgMesh2D."""
    vertices, triangles = create_2d_test_mesh()

    mesh = MmgMesh2D()
    mesh.set_mesh_size(vertices=len(vertices), triangles=len(triangles))
    mesh.set_vertices(vertices)
    mesh.set_triangles(triangles)

    qualities = mesh.get_element_qualities()
    assert qualities.shape == (len(triangles),)
    assert qualities.dtype == np.float64
    assert np.all(qualities >= 0.0)


def test_get_adjacent_elements_surface() -> None:
    """Test getting adjacent elements for MmgMeshS."""
    vertices, triangles = create_surface_test_mesh()

    mesh = MmgMeshS()
    mesh.set_mesh_size(vertices=len(vertices), triangles=len(triangles))
    mesh.set_vertices(vertices)
    mesh.set_triangles(triangles)

    adjacent = mesh.get_adjacent_elements(0)
    assert adjacent.shape == (3,)
    assert adjacent.dtype == np.int32

    for idx in adjacent:
        assert idx >= -1
        assert idx < len(triangles)


def test_get_vertex_neighbors_surface() -> None:
    """Test getting vertex neighbors for MmgMeshS."""
    vertices, triangles = create_surface_test_mesh()

    mesh = MmgMeshS()
    mesh.set_mesh_size(vertices=len(vertices), triangles=len(triangles))
    mesh.set_vertices(vertices)
    mesh.set_triangles(triangles)

    neighbors = mesh.get_vertex_neighbors(0)
    assert neighbors.dtype == np.int32
    assert len(neighbors) > 0

    for idx in neighbors:
        assert idx >= 0
        assert idx < len(vertices)

    assert 0 not in neighbors


def test_get_element_quality_surface() -> None:
    """Test getting element quality for MmgMeshS."""
    vertices, triangles = create_surface_test_mesh()

    mesh = MmgMeshS()
    mesh.set_mesh_size(vertices=len(vertices), triangles=len(triangles))
    mesh.set_vertices(vertices)
    mesh.set_triangles(triangles)

    for i in range(len(triangles)):
        quality = mesh.get_element_quality(i)
        assert isinstance(quality, float)
        assert quality >= 0.0


def test_get_element_qualities_surface() -> None:
    """Test getting all element qualities for MmgMeshS."""
    vertices, triangles = create_surface_test_mesh()

    mesh = MmgMeshS()
    mesh.set_mesh_size(vertices=len(vertices), triangles=len(triangles))
    mesh.set_vertices(vertices)
    mesh.set_triangles(triangles)

    qualities = mesh.get_element_qualities()
    assert qualities.shape == (len(triangles),)
    assert qualities.dtype == np.float64
    assert np.all(qualities >= 0.0)


def test_topology_queries_invalid_indices() -> None:
    """Test that invalid indices raise errors for topology queries."""
    vertices, elements = create_test_mesh()

    mesh = MmgMesh3D()
    mesh.set_mesh_size(vertices=len(vertices), tetrahedra=len(elements))
    mesh.set_vertices(vertices)
    mesh.set_tetrahedra(elements)

    # Out of range element index
    with pytest.raises(RuntimeError, match="out of range"):
        mesh.get_adjacent_elements(100)

    with pytest.raises(RuntimeError, match="out of range"):
        mesh.get_element_quality(100)

    # Out of range vertex index
    with pytest.raises(RuntimeError, match="out of range"):
        mesh.get_vertex_neighbors(100)


# Level-Set Discretization Tests


def create_dense_3d_mesh(resolution: int = 5) -> tuple[np.ndarray, np.ndarray]:
    """Create a dense tetrahedral mesh of a unit cube for level-set testing.

    Level-set discretization requires interior points to work properly.
    Uses PyVista's delaunay_3d for better quality tetrahedra.
    """
    import pyvista as pv

    x = np.linspace(0, 1, resolution)
    y = np.linspace(0, 1, resolution)
    z = np.linspace(0, 1, resolution)
    xx, yy, zz = np.meshgrid(x, y, z, indexing="ij")
    points = np.column_stack([xx.ravel(), yy.ravel(), zz.ravel()])
    cloud = pv.PolyData(points)
    tetra = cloud.delaunay_3d()
    vertices = np.array(tetra.points, dtype=np.float64)
    elements = tetra.cells_dict[pv.CellType.TETRA].astype(np.int32)
    return vertices, elements


def create_dense_2d_mesh(resolution: int = 10) -> tuple[np.ndarray, np.ndarray]:
    """Create a dense triangular mesh of a unit square for level-set testing."""
    from scipy.spatial import Delaunay

    x = np.linspace(0, 1, resolution)
    y = np.linspace(0, 1, resolution)
    xx, yy = np.meshgrid(x, y)
    points = np.column_stack([xx.ravel(), yy.ravel()])
    tri = Delaunay(points)
    return points.astype(np.float64), tri.simplices.astype(np.int32)


def test_remesh_levelset_3d() -> None:
    """Test level-set discretization for MmgMesh3D with a sphere."""
    vertices, elements = create_dense_3d_mesh(resolution=5)

    mesh = MmgMesh3D(vertices, elements)

    center = np.array([0.5, 0.5, 0.5])
    radius = 0.3
    distances = np.linalg.norm(vertices - center, axis=1) - radius
    levelset = distances.reshape(-1, 1)

    mesh.remesh_levelset(levelset, hmax=0.2, verbose=False)

    new_vertices = mesh.get_vertices()
    new_elements = mesh.get_elements()

    assert len(new_vertices) > 0
    assert len(new_elements) > 0


def test_remesh_levelset_3d_element_refs() -> None:
    """Test that level-set discretization assigns correct element refs.

    After level-set discretization, MMG assigns:
    - ref=2: exterior elements (where level-set > 0)
    - ref=3: interior elements (where level-set < 0)
    """
    vertices, elements = create_dense_3d_mesh(resolution=6)
    mesh = MmgMesh3D(vertices, elements)

    # Sphere centered at (0.5, 0.5, 0.5) with radius 0.3
    center = np.array([0.5, 0.5, 0.5])
    radius = 0.3
    levelset = (np.linalg.norm(vertices - center, axis=1) - radius).reshape(-1, 1)

    mesh.remesh_levelset(levelset, hmax=0.15, verbose=False)

    new_vertices = mesh.get_vertices()
    _, elem_refs = mesh.get_elements_with_refs()

    # Should have both interior (ref=3) and exterior (ref=2) elements
    unique_refs = np.unique(elem_refs)
    assert 2 in unique_refs, "Expected exterior elements (ref=2)"
    assert 3 in unique_refs, "Expected interior elements (ref=3)"

    # Verify interior elements are actually inside the sphere
    # by checking their centroids
    elements = mesh.get_elements()
    interior_mask = elem_refs == 3
    interior_elements = elements[interior_mask]

    for tet in interior_elements[:10]:  # Check first 10 interior tets
        centroid = new_vertices[tet].mean(axis=0)
        dist_to_center = np.linalg.norm(centroid - center)
        # Centroid should be inside or near the sphere surface
        assert dist_to_center < radius + 0.1, (
            f"Interior element centroid at distance {dist_to_center} "
            f"should be inside sphere of radius {radius}"
        )


def test_remesh_levelset_3d_interface_conformity() -> None:
    """Test that interface vertices lie on the level-set isosurface."""
    vertices, elements = create_dense_3d_mesh(resolution=6)
    mesh = MmgMesh3D(vertices, elements)

    center = np.array([0.5, 0.5, 0.5])
    radius = 0.3
    levelset = (np.linalg.norm(vertices - center, axis=1) - radius).reshape(-1, 1)

    mesh.remesh_levelset(levelset, hmax=0.1, verbose=False)

    new_vertices = mesh.get_vertices()
    elements, elem_refs = mesh.get_elements_with_refs()

    # Find interface: faces shared by elements with different refs
    # Build face-to-element mapping
    face_elements: dict[tuple[int, ...], list[int]] = {}
    for elem_idx, tet in enumerate(elements):
        # 4 faces per tetrahedron
        faces = [
            tuple(sorted([tet[0], tet[1], tet[2]])),
            tuple(sorted([tet[0], tet[1], tet[3]])),
            tuple(sorted([tet[0], tet[2], tet[3]])),
            tuple(sorted([tet[1], tet[2], tet[3]])),
        ]
        for face in faces:
            if face not in face_elements:
                face_elements[face] = []
            face_elements[face].append(elem_idx)

    # Find interface faces (shared by elements with different refs)
    interface_vertices = set()
    for face, elem_indices in face_elements.items():
        if len(elem_indices) == 2:
            ref1, ref2 = elem_refs[elem_indices[0]], elem_refs[elem_indices[1]]
            if ref1 != ref2:
                interface_vertices.update(face)

    # Check that interface vertices lie on the sphere surface
    tolerance = 0.05  # Allow small deviation due to mesh discretization
    for v_idx in list(interface_vertices)[:20]:  # Check first 20 vertices
        vertex = new_vertices[v_idx]
        dist_to_center = np.linalg.norm(vertex - center)
        assert abs(dist_to_center - radius) < tolerance, (
            f"Interface vertex at distance {dist_to_center:.4f} "
            f"should be on sphere surface at radius {radius}"
        )


def test_remesh_levelset_2d() -> None:
    """Test level-set discretization for MmgMesh2D with a circle."""
    vertices, triangles = create_dense_2d_mesh(resolution=10)

    mesh = MmgMesh2D(vertices, triangles)

    center = np.array([0.5, 0.5])
    radius = 0.3
    distances = np.linalg.norm(vertices - center, axis=1) - radius
    levelset = distances.reshape(-1, 1)

    mesh.remesh_levelset(levelset, hmax=0.15, verbose=False)

    new_vertices = mesh.get_vertices()
    new_triangles = mesh.get_triangles()

    assert len(new_vertices) > 0
    assert len(new_triangles) > 0


def test_remesh_levelset_2d_element_refs() -> None:
    """Test that 2D level-set discretization assigns correct triangle refs."""
    vertices, triangles = create_dense_2d_mesh(resolution=15)
    mesh = MmgMesh2D(vertices, triangles)

    # Circle centered at (0.5, 0.5) with radius 0.3
    center = np.array([0.5, 0.5])
    radius = 0.3
    levelset = (np.linalg.norm(vertices - center, axis=1) - radius).reshape(-1, 1)

    mesh.remesh_levelset(levelset, hmax=0.1, verbose=False)

    _, tri_refs = mesh.get_triangles_with_refs()

    # Should have both interior (ref=3) and exterior (ref=2) triangles
    unique_refs = np.unique(tri_refs)
    assert 2 in unique_refs, "Expected exterior triangles (ref=2)"
    assert 3 in unique_refs, "Expected interior triangles (ref=3)"


def test_remesh_levelset_2d_interface_conformity() -> None:
    """Test that 2D interface edges lie on the level-set isoline."""
    vertices, triangles = create_dense_2d_mesh(resolution=15)
    mesh = MmgMesh2D(vertices, triangles)

    center = np.array([0.5, 0.5])
    radius = 0.3
    levelset = (np.linalg.norm(vertices - center, axis=1) - radius).reshape(-1, 1)

    mesh.remesh_levelset(levelset, hmax=0.08, verbose=False)

    new_vertices = mesh.get_vertices()
    triangles, tri_refs = mesh.get_triangles_with_refs()

    # Build edge-to-triangle mapping
    edge_triangles: dict[tuple[int, int], list[int]] = {}
    for tri_idx, tri in enumerate(triangles):
        for i in range(3):
            v1, v2 = tri[i], tri[(i + 1) % 3]
            edge = (min(v1, v2), max(v1, v2))
            if edge not in edge_triangles:
                edge_triangles[edge] = []
            edge_triangles[edge].append(tri_idx)

    # Find interface edges
    interface_vertices = set()
    for edge, tri_indices in edge_triangles.items():
        if len(tri_indices) == 2:
            ref1, ref2 = tri_refs[tri_indices[0]], tri_refs[tri_indices[1]]
            if ref1 != ref2:
                interface_vertices.update(edge)

    # Check that interface vertices lie on the circle
    tolerance = 0.02
    for v_idx in interface_vertices:
        vertex = new_vertices[v_idx]
        dist_to_center = np.linalg.norm(vertex - center)
        assert abs(dist_to_center - radius) < tolerance, (
            f"Interface vertex at distance {dist_to_center:.4f} "
            f"should be on circle at radius {radius}"
        )


def test_remesh_levelset_surface() -> None:
    """Test level-set discretization for MmgMeshS."""
    vertices, triangles = create_surface_test_mesh()

    mesh = MmgMeshS()
    mesh.set_mesh_size(vertices=len(vertices), triangles=len(triangles))
    mesh.set_vertices(vertices)
    mesh.set_triangles(triangles)

    center = np.array([0.5, 0.5, 0.0])
    radius = 0.3
    distances = np.linalg.norm(vertices - center, axis=1) - radius
    levelset = distances.reshape(-1, 1)

    mesh.remesh_levelset(levelset, hmax=0.2, verbose=False)

    new_vertices = mesh.get_vertices()
    new_triangles = mesh.get_triangles()

    assert len(new_vertices) > 0
    assert len(new_triangles) > 0


def test_remesh_levelset_with_isovalue() -> None:
    """Test level-set discretization with custom isovalue."""
    vertices, elements = create_dense_3d_mesh(resolution=5)

    mesh = MmgMesh3D(vertices, elements)

    center = np.array([0.5, 0.5, 0.5])
    radius = 0.3
    distances = np.linalg.norm(vertices - center, axis=1) - radius
    levelset = distances.reshape(-1, 1)

    # Use ls=0.05 to extract a slightly larger sphere
    mesh.remesh_levelset(levelset, ls=0.05, hmax=0.2, verbose=False)

    new_vertices = mesh.get_vertices()
    assert len(new_vertices) > 0


def test_remesh_levelset_with_different_isovalues() -> None:
    """Test that different isovalues produce different mesh regions.

    With signed distance levelset = distance - radius:
    - Interior is where levelset < isovalue
    - Higher isovalue → larger interior region
    """
    vertices, elements = create_dense_3d_mesh(resolution=6)

    center = np.array([0.5, 0.5, 0.5])
    radius = 0.3
    levelset = (np.linalg.norm(vertices - center, axis=1) - radius).reshape(-1, 1)

    # Extract at default isovalue (0.0) - sphere surface
    mesh1 = MmgMesh3D(vertices.copy(), elements.copy())
    mesh1.remesh_levelset(levelset, ls=0.0, hmax=0.15, verbose=False)
    _, refs1 = mesh1.get_elements_with_refs()
    interior_count_1 = np.sum(refs1 == 3)

    # Extract at positive isovalue (larger interior - includes shell around sphere)
    mesh2 = MmgMesh3D(vertices.copy(), elements.copy())
    mesh2.remesh_levelset(levelset, ls=0.1, hmax=0.15, verbose=False)
    _, refs2 = mesh2.get_elements_with_refs()
    interior_count_2 = np.sum(refs2 == 3)

    # Higher isovalue means larger interior region
    assert interior_count_2 > interior_count_1, (
        f"Higher isovalue should yield more interior elements: "
        f"{interior_count_2} vs {interior_count_1}"
    )


if __name__ == "__main__":
    test_mesh_construction()
    test_mmg_mesh()
    visualize_mmg_mesh()
