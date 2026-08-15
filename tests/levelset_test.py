"""Tests for level-set discretization functionality."""

import numpy as np
import pytest

from mmgpy._mmgpy import MmgMesh2D, MmgMesh3D, MmgMeshS


class TestLevelset3D:
    """Tests for 3D level-set discretization."""

    def test_remesh_levelset(
        self,
        dense_3d_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test level-set discretization for MmgMesh3D with a sphere."""
        vertices, elements = dense_3d_mesh
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

    def test_surface_only_splits_boundary_not_volume(
        self,
        dense_3d_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """``surface_only`` splits boundary faces without materializing an interior."""
        vertices, elements = dense_3d_mesh
        mesh = MmgMesh3D(vertices, elements)
        levelset = (vertices[:, 0] - 0.37).reshape(-1, 1)

        mesh.remesh_levelset(
            levelset,
            surface_only=True,
            hmax=0.25,
            verbose=False,
        )

        _, element_refs = mesh.get_elements_with_refs()
        _, boundary_refs = mesh.get_triangles_with_refs()

        assert set(element_refs) == {0}
        assert {2, 3}.issubset(set(boundary_refs))
        assert np.any(np.isclose(mesh.get_vertices()[:, 0], 0.37, atol=1e-8))

    def test_surface_only_mode_does_not_leak_into_next_call(
        self,
        dense_3d_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Each call resets MMG's mutable iso and isosurf mode flags."""
        vertices, elements = dense_3d_mesh
        mesh = MmgMesh3D(vertices, elements)

        mesh.remesh_levelset(
            (vertices[:, 0] - 0.37).reshape(-1, 1),
            surface_only=True,
            hmax=0.25,
            verbose=False,
        )
        _, surface_only_refs = mesh.get_elements_with_refs()
        assert set(surface_only_refs) == {0}

        remeshed_vertices = mesh.get_vertices()
        mesh.remesh_levelset(
            (remeshed_vertices[:, 0] - 0.63).reshape(-1, 1),
            hmax=0.25,
            verbose=False,
        )
        _, default_refs = mesh.get_elements_with_refs()
        assert {2, 3}.issubset(set(default_refs))

    def test_remesh_levelset_element_refs(
        self,
        dense_3d_mesh_fine: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test that level-set discretization assigns correct element refs.

        After level-set discretization, MMG assigns:
        - ref=2: exterior elements (where level-set > 0)
        - ref=3: interior elements (where level-set < 0)
        """
        vertices, elements = dense_3d_mesh_fine
        mesh = MmgMesh3D(vertices, elements)

        center = np.array([0.5, 0.5, 0.5])
        radius = 0.3
        levelset = (np.linalg.norm(vertices - center, axis=1) - radius).reshape(-1, 1)

        mesh.remesh_levelset(levelset, hmax=0.15, verbose=False)

        new_vertices = mesh.get_vertices()
        _, elem_refs = mesh.get_elements_with_refs()

        unique_refs = np.unique(elem_refs)
        assert 2 in unique_refs, "Expected exterior elements (ref=2)"
        assert 3 in unique_refs, "Expected interior elements (ref=3)"

        elements_arr = mesh.get_elements()
        interior_mask = elem_refs == 3
        interior_elements = elements_arr[interior_mask]

        for tet in interior_elements[:10]:
            centroid = new_vertices[tet].mean(axis=0)
            dist_to_center = np.linalg.norm(centroid - center)
            assert dist_to_center < radius + 0.1, (
                f"Interior element centroid at distance {dist_to_center} "
                f"should be inside sphere of radius {radius}"
            )

    def test_remesh_levelset_interface_conformity(
        self,
        dense_3d_mesh_fine: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test that interface vertices lie on the level-set isosurface."""
        vertices, elements = dense_3d_mesh_fine
        mesh = MmgMesh3D(vertices, elements)

        center = np.array([0.5, 0.5, 0.5])
        radius = 0.3
        levelset = (np.linalg.norm(vertices - center, axis=1) - radius).reshape(-1, 1)

        mesh.remesh_levelset(levelset, hmax=0.1, verbose=False)

        new_vertices = mesh.get_vertices()
        elements_arr, elem_refs = mesh.get_elements_with_refs()

        face_elements: dict[tuple[int, ...], list[int]] = {}
        for elem_idx, tet in enumerate(elements_arr):
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

        interface_vertices = set()
        for face, elem_indices in face_elements.items():
            if len(elem_indices) == 2:
                ref1, ref2 = elem_refs[elem_indices[0]], elem_refs[elem_indices[1]]
                if ref1 != ref2:
                    interface_vertices.update(face)

        tolerance = 0.05
        for v_idx in list(interface_vertices)[:20]:
            vertex = new_vertices[v_idx]
            dist_to_center = np.linalg.norm(vertex - center)
            assert abs(dist_to_center - radius) < tolerance, (
                f"Interface vertex at distance {dist_to_center:.4f} "
                f"should be on sphere surface at radius {radius}"
            )

    def test_remesh_levelset_with_isovalue(
        self,
        dense_3d_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test level-set discretization with custom isovalue."""
        vertices, elements = dense_3d_mesh
        mesh = MmgMesh3D(vertices, elements)

        center = np.array([0.5, 0.5, 0.5])
        radius = 0.3
        distances = np.linalg.norm(vertices - center, axis=1) - radius
        levelset = distances.reshape(-1, 1)

        mesh.remesh_levelset(levelset, ls=0.05, hmax=0.2, verbose=False)

        new_vertices = mesh.get_vertices()
        assert len(new_vertices) > 0

    def test_remesh_levelset_with_different_isovalues(
        self,
        dense_3d_mesh_fine: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test that different isovalues produce different mesh regions.

        With signed distance levelset = distance - radius:
        - Interior is where levelset < isovalue
        - Higher isovalue -> larger interior region
        """
        vertices, elements = dense_3d_mesh_fine

        center = np.array([0.5, 0.5, 0.5])
        radius = 0.3
        levelset = (np.linalg.norm(vertices - center, axis=1) - radius).reshape(-1, 1)

        mesh1 = MmgMesh3D(vertices.copy(), elements.copy())
        mesh1.remesh_levelset(levelset, ls=0.0, hmax=0.15, verbose=False)
        _, refs1 = mesh1.get_elements_with_refs()
        interior_count_1 = np.sum(refs1 == 3)

        mesh2 = MmgMesh3D(vertices.copy(), elements.copy())
        mesh2.remesh_levelset(levelset, ls=0.1, hmax=0.15, verbose=False)
        _, refs2 = mesh2.get_elements_with_refs()
        interior_count_2 = np.sum(refs2 == 3)

        assert interior_count_2 > interior_count_1, (
            f"Higher isovalue should yield more interior elements: "
            f"{interior_count_2} vs {interior_count_1}"
        )


class TestLevelset2D:
    """Tests for 2D level-set discretization."""

    def test_remesh_levelset(
        self,
        dense_2d_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test level-set discretization for MmgMesh2D with a circle."""
        vertices, triangles = dense_2d_mesh
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

    def test_surface_only_splits_reference_edges_not_triangles(self) -> None:
        """MMG2D ``lssurf`` preserves area refs and splits reference edges."""
        vertices = np.array(
            [[0.0, 0.0], [1.0, 0.0], [1.0, 1.0], [0.0, 1.0]],
            dtype=np.float64,
        )
        triangles = np.array([[0, 1, 2], [0, 2, 3]], dtype=np.int32)
        mesh = MmgMesh2D()
        mesh.set_mesh_size(vertices=4, triangles=2)
        mesh.set_vertices(vertices)
        mesh.set_triangles(triangles, refs=np.array([4, 8], dtype=np.int64))

        mesh.remesh_levelset(
            (vertices[:, 0] - 0.37).reshape(-1, 1),
            surface_only=True,
            hmax=0.3,
            verbose=False,
        )

        _, triangle_refs = mesh.get_triangles_with_refs()
        _, edge_refs = mesh.get_edges_with_refs()
        assert set(triangle_refs) == {4, 8}
        assert {2, 3}.issubset(set(edge_refs))

    def test_remesh_levelset_element_refs(
        self,
        dense_2d_mesh_fine: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test that 2D level-set discretization assigns correct triangle refs."""
        vertices, triangles = dense_2d_mesh_fine
        mesh = MmgMesh2D(vertices, triangles)

        center = np.array([0.5, 0.5])
        radius = 0.3
        levelset = (np.linalg.norm(vertices - center, axis=1) - radius).reshape(-1, 1)

        mesh.remesh_levelset(levelset, hmax=0.1, verbose=False)

        _, tri_refs = mesh.get_triangles_with_refs()

        unique_refs = np.unique(tri_refs)
        assert 2 in unique_refs, "Expected exterior triangles (ref=2)"
        assert 3 in unique_refs, "Expected interior triangles (ref=3)"

    def test_remesh_levelset_interface_conformity(
        self,
        dense_2d_mesh_fine: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test that 2D interface edges lie on the level-set isoline."""
        vertices, triangles = dense_2d_mesh_fine
        mesh = MmgMesh2D(vertices, triangles)

        center = np.array([0.5, 0.5])
        radius = 0.3
        levelset = (np.linalg.norm(vertices - center, axis=1) - radius).reshape(-1, 1)

        mesh.remesh_levelset(levelset, hmax=0.08, verbose=False)

        new_vertices = mesh.get_vertices()
        triangles_arr, tri_refs = mesh.get_triangles_with_refs()

        edge_triangles: dict[tuple[int, int], list[int]] = {}
        for tri_idx, tri in enumerate(triangles_arr):
            for i in range(3):
                v1, v2 = tri[i], tri[(i + 1) % 3]
                edge = (min(v1, v2), max(v1, v2))
                if edge not in edge_triangles:
                    edge_triangles[edge] = []
                edge_triangles[edge].append(tri_idx)

        interface_vertices = set()
        for edge, tri_indices in edge_triangles.items():
            if len(tri_indices) == 2:
                ref1, ref2 = tri_refs[tri_indices[0]], tri_refs[tri_indices[1]]
                if ref1 != ref2:
                    interface_vertices.update(edge)

        tolerance = 0.02
        for v_idx in interface_vertices:
            vertex = new_vertices[v_idx]
            dist_to_center = np.linalg.norm(vertex - center)
            assert abs(dist_to_center - radius) < tolerance, (
                f"Interface vertex at distance {dist_to_center:.4f} "
                f"should be on circle at radius {radius}"
            )


class TestLevelsetSurface:
    """Tests for surface mesh level-set discretization."""

    def test_remesh_levelset(
        self,
        tetrahedron_surface_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Test level-set discretization for MmgMeshS."""
        vertices, triangles = tetrahedron_surface_mesh

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

    def test_surface_only_splits_reference_edges_not_surface(self) -> None:
        """MMGS ``lssurf`` splits referenced edges without splitting faces."""
        vertices = np.array(
            [
                [0.0, 0.0, 0.0],
                [1.0, 0.0, 0.0],
                [1.0, 1.0, 0.0],
                [0.0, 1.0, 0.0],
            ],
            dtype=np.float64,
        )
        triangles = np.array([[0, 1, 2], [0, 2, 3]], dtype=np.int32)
        edges = np.array([[0, 1], [1, 2], [2, 3], [3, 0]], dtype=np.int32)
        mesh = MmgMeshS()
        mesh.set_mesh_size(vertices=4, triangles=2, edges=4)
        mesh.set_vertices(vertices)
        mesh.set_triangles(triangles, refs=np.ones(2, dtype=np.int64))
        mesh.set_edges(edges, refs=np.ones(4, dtype=np.int64))

        mesh.remesh_levelset(
            (vertices[:, 0] - 0.37).reshape(-1, 1),
            surface_only=True,
            hmax=0.3,
            verbose=False,
        )

        _, triangle_refs = mesh.get_triangles_with_refs()
        _, edge_refs = mesh.get_edges_with_refs()
        assert set(triangle_refs) == {1}
        assert {2, 3}.issubset(set(edge_refs))


@pytest.mark.parametrize("mesh_type", [MmgMesh3D, MmgMesh2D, MmgMeshS])
def test_surface_only_rejects_raw_mode_options(
    mesh_type: type[MmgMesh3D | MmgMesh2D | MmgMeshS],
) -> None:
    """The typed mode cannot be combined with MMG's mutually exclusive flags."""
    mesh = mesh_type()
    with pytest.raises(TypeError, match="surface_only cannot be combined"):
        mesh.remesh_levelset(
            np.empty((0, 1), dtype=np.float64),
            surface_only=True,
            iso=1,
        )
