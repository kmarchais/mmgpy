"""High-level multi-material / local-parameter / LS-base-references tests.

These tests exercise the methods surfaced on :class:`mmgpy.Mesh` and the
PyVista ``.mmg`` accessor. The C++ bindings on ``MmgMesh{3D,2D,S}``
already cover the configuration plumbing (see ``tests/topology_test.py``);
here we focus on input validation, integration with the existing remesh
paths, and the accessor's ``user_dict``-based persistence across rebuilds
of the underlying ``Mesh``.
"""

from __future__ import annotations

import numpy as np
import pytest
import pyvista as pv

import mmgpy  # noqa: F401  -- registers the .mmg accessor
from mmgpy._mesh import Mesh

# ---------------------------------------------------------------------------
# High-level Mesh wiring
# ---------------------------------------------------------------------------


class TestMeshLocalParameters:
    """``Mesh.set_local_parameters`` on each mesh kind."""

    def test_3d_set_local_parameters(
        self,
        dense_3d_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Configure tet-level params and remesh end to end."""
        vertices, elements = dense_3d_mesh
        mesh = Mesh(vertices, elements)
        mesh.set_local_parameters(
            [
                {
                    "type": "tetrahedron",
                    "ref": 0,
                    "hmin": 0.02,
                    "hmax": 0.05,
                    "hausd": 0.01,
                },
            ],
        )
        mesh.remesh(verbose=False)
        assert mesh.get_vertices().shape[0] > 0

    def test_2d_set_local_parameters(
        self,
        dense_2d_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Configure triangle-level params and remesh a 2D mesh end to end."""
        vertices, triangles = dense_2d_mesh
        mesh = Mesh(vertices, triangles)
        mesh.set_local_parameters(
            [
                {
                    "type": "triangle",
                    "ref": 0,
                    "hmin": 0.02,
                    "hmax": 0.1,
                    "hausd": 0.01,
                },
            ],
        )
        mesh.remesh(verbose=False)
        assert mesh.get_vertices().shape[0] > 0

    def test_surface_set_local_parameters(
        self,
        tetrahedron_surface_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Configure triangle-level params on a surface mesh and remesh."""
        vertices, triangles = tetrahedron_surface_mesh
        mesh = Mesh(vertices, triangles)
        mesh.set_local_parameters(
            [
                {
                    "type": "triangle",
                    "ref": 0,
                    "hmin": 0.05,
                    "hmax": 0.2,
                    "hausd": 0.01,
                },
            ],
        )
        mesh.remesh(verbose=False)
        assert mesh.get_vertices().shape[0] > 0

    def test_local_parameters_drives_refinement(
        self,
        dense_3d_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """A local ``hmax`` override yields strictly more elements than the baseline.

        Same input mesh + global ``hmax=0.2``; the second pass also sets a
        local override of ``hmax=0.05`` on ref 0 (the only ref present).
        """
        vertices, elements = dense_3d_mesh
        baseline = Mesh(vertices.copy(), elements.copy())
        baseline.remesh(hmax=0.2, verbose=False)
        n_baseline = baseline.get_tetrahedra().shape[0]

        refined = Mesh(vertices.copy(), elements.copy())
        refined.set_local_parameters(
            [
                {
                    "type": "tetrahedron",
                    "ref": 0,
                    "hmin": 0.01,
                    "hmax": 0.05,
                    "hausd": 0.01,
                },
            ],
        )
        refined.remesh(hmax=0.2, verbose=False)
        n_refined = refined.get_tetrahedra().shape[0]

        assert n_refined > n_baseline, (
            f"local refinement should produce more elements: "
            f"baseline={n_baseline}, refined={n_refined}"
        )

    def test_invalid_entity_type_raises_value_error(
        self,
        dense_3d_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Unknown entity types fail at the Python boundary, not deep in MMG."""
        vertices, elements = dense_3d_mesh
        mesh = Mesh(vertices, elements)
        with pytest.raises(ValueError, match="must be one of"):
            mesh.set_local_parameters(
                [
                    {
                        "type": "pentagon",
                        "ref": 1,
                        "hmin": 0.01,
                        "hmax": 0.1,
                        "hausd": 0.01,
                    },
                ],
            )

    def test_missing_key_raises_value_error(
        self,
        dense_3d_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Missing required keys are reported by name."""
        vertices, elements = dense_3d_mesh
        mesh = Mesh(vertices, elements)
        with pytest.raises(ValueError, match="missing keys"):
            mesh.set_local_parameters([{"type": "triangle", "ref": 1}])

    def test_2d_rejects_tetrahedron_entity(
        self,
        dense_2d_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """2D meshes reject ``type='tetrahedron'`` upfront."""
        vertices, triangles = dense_2d_mesh
        mesh = Mesh(vertices, triangles)
        with pytest.raises(ValueError, match="must be one of"):
            mesh.set_local_parameters(
                [
                    {
                        "type": "tetrahedron",
                        "ref": 0,
                        "hmin": 0.01,
                        "hmax": 0.1,
                        "hausd": 0.01,
                    },
                ],
            )


class TestMeshMultiMaterials:
    """``Mesh.set_multi_materials`` configuration and validation."""

    def test_3d_set_multi_materials_with_levelset(
        self,
        dense_3d_mesh_fine: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Configuring multi-mat before ls-remesh produces split refs in output."""
        vertices, elements = dense_3d_mesh_fine
        mesh = Mesh(vertices, elements)

        center = np.array([0.5, 0.5, 0.5])
        radius = 0.3
        levelset = (np.linalg.norm(vertices - center, axis=1) - radius).reshape(-1, 1)

        mesh.set_multi_materials(
            [{"ref": 0, "split": True, "ref_minus": 10, "ref_plus": 20}],
        )
        mesh.remesh_levelset(levelset, hmax=0.15, verbose=False)

        _, elem_refs = mesh.get_elements_with_refs()
        unique_refs = set(np.unique(elem_refs).tolist())
        assert 10 in unique_refs, f"expected ref_minus=10 in output, got {unique_refs}"
        assert 20 in unique_refs, f"expected ref_plus=20 in output, got {unique_refs}"

    def test_split_accepts_bool_and_int(
        self,
        dense_3d_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """``split`` accepts both ``True``/``False`` and ``1``/``0``."""
        vertices, elements = dense_3d_mesh
        mesh = Mesh(vertices, elements)
        mesh.set_multi_materials(
            [
                {"ref": 1, "split": True, "ref_minus": 10, "ref_plus": 20},
                {"ref": 2, "split": 0, "ref_minus": 0, "ref_plus": 0},
            ],
        )

    def test_missing_key_raises_value_error(
        self,
        dense_3d_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Missing required keys are reported by name."""
        vertices, elements = dense_3d_mesh
        mesh = Mesh(vertices, elements)
        with pytest.raises(ValueError, match="missing keys"):
            mesh.set_multi_materials([{"ref": 1, "split": True}])

    def test_non_mapping_raises_type_error(
        self,
        dense_3d_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Non-mapping entries fail at the Python boundary."""
        vertices, elements = dense_3d_mesh
        mesh = Mesh(vertices, elements)
        with pytest.raises(TypeError, match="must be a mapping"):
            mesh.set_multi_materials([(1, True, 10, 20)])  # type: ignore[list-item]

    def test_invalid_split_type_raises_type_error(
        self,
        dense_3d_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Non-bool/int ``split`` values are rejected upfront."""
        vertices, elements = dense_3d_mesh
        mesh = Mesh(vertices, elements)
        with pytest.raises(TypeError, match="must be bool or int"):
            mesh.set_multi_materials(
                [{"ref": 1, "split": "yes", "ref_minus": 10, "ref_plus": 20}],
            )
        with pytest.raises(TypeError, match="must be bool or int"):
            mesh.set_multi_materials(
                [{"ref": 1, "split": 1.5, "ref_minus": 10, "ref_plus": 20}],
            )
        with pytest.raises(ValueError, match="must be 0 or 1"):
            mesh.set_multi_materials(
                [{"ref": 1, "split": 2, "ref_minus": 10, "ref_plus": 20}],
            )


class TestMeshLsBaseReferences:
    """``Mesh.set_ls_base_references`` configuration and validation."""

    def test_3d_set_ls_base_references(
        self,
        dense_3d_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Accept a plain list of ints."""
        vertices, elements = dense_3d_mesh
        mesh = Mesh(vertices, elements)
        mesh.set_ls_base_references([1, 2, 3])

    def test_empty_list_is_allowed(
        self,
        dense_3d_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """An empty list clears the configured references."""
        vertices, elements = dense_3d_mesh
        mesh = Mesh(vertices, elements)
        mesh.set_ls_base_references([])

    def test_non_integer_raises_value_error(
        self,
        dense_3d_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Non-integer entries fail at the Python boundary."""
        vertices, elements = dense_3d_mesh
        mesh = Mesh(vertices, elements)
        with pytest.raises(ValueError, match="not an integer"):
            mesh.set_ls_base_references(["hello"])  # type: ignore[list-item]


# ---------------------------------------------------------------------------
# PyVista accessor wiring
# ---------------------------------------------------------------------------


class TestAccessorPersistence:
    """The accessor stores its config in ``dataset.user_dict``."""

    def test_stash_into_user_dict(self) -> None:
        """The three setters land under stable user_dict keys."""
        pts = np.random.RandomState(0).rand(20, 3)
        dataset = pv.PolyData(pts).delaunay_3d()

        dataset.mmg.set_local_parameters(
            [
                {
                    "type": "tetrahedron",
                    "ref": 0,
                    "hmin": 0.01,
                    "hmax": 0.1,
                    "hausd": 0.01,
                },
            ],
        )
        dataset.mmg.set_multi_materials(
            [{"ref": 1, "split": True, "ref_minus": 10, "ref_plus": 20}],
        )
        dataset.mmg.set_ls_base_references([1, 2])

        assert "mmg_local_parameters" in dataset.user_dict
        assert "mmg_multi_materials" in dataset.user_dict
        assert "mmg_ls_base_references" in dataset.user_dict

        materials = list(dataset.user_dict["mmg_multi_materials"])
        assert materials[0]["split"] == 1

    def test_empty_clears_user_dict_key(self) -> None:
        """Passing an empty list removes the stash key."""
        pts = np.random.RandomState(0).rand(20, 3)
        dataset = pv.PolyData(pts).delaunay_3d()
        dataset.mmg.set_ls_base_references([1, 2])
        assert "mmg_ls_base_references" in dataset.user_dict
        dataset.mmg.set_ls_base_references([])
        assert "mmg_ls_base_references" not in dataset.user_dict


class TestAccessorLocalParametersDrivesRefinement:
    """Local parameters set via the accessor are picked up by ``remesh``."""

    def test_local_hmax_produces_more_cells(
        self,
        dense_3d_mesh: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Configured local ``hmax`` yields more cells than the baseline."""
        from pyvista import CellType

        vertices, elements = dense_3d_mesh
        cells_padded = np.column_stack(
            [np.full(len(elements), 4, dtype=np.int32), elements.astype(np.int32)],
        ).ravel()
        cell_types = np.full(len(elements), CellType.TETRA, dtype=np.uint8)
        dataset = pv.UnstructuredGrid(cells_padded, cell_types, vertices)

        baseline_pv = dataset.copy()
        baseline = baseline_pv.mmg.remesh(hmax=0.2, verbose=False)

        refined_pv = dataset.copy()
        refined_pv.mmg.set_local_parameters(
            [
                {
                    "type": "tetrahedron",
                    "ref": 0,
                    "hmin": 0.01,
                    "hmax": 0.05,
                    "hausd": 0.01,
                },
            ],
        )
        refined = refined_pv.mmg.remesh(hmax=0.2, verbose=False)

        assert refined.n_cells > baseline.n_cells, (
            f"local refinement should produce more cells: "
            f"baseline={baseline.n_cells}, refined={refined.n_cells}"
        )


class TestAccessorMultiMaterialsViaLevelset:
    """Multi-material config flows through ``remesh_levelset`` on the accessor."""

    def test_multi_materials_apply_during_remesh_levelset(
        self,
        dense_3d_mesh_fine: tuple[np.ndarray, np.ndarray],
    ) -> None:
        """Custom ``ref_minus``/``ref_plus`` appear in output ``cell_data["refs"]``."""
        from pyvista import CellType

        vertices, elements = dense_3d_mesh_fine
        cells_padded = np.column_stack(
            [np.full(len(elements), 4, dtype=np.int32), elements.astype(np.int32)],
        ).ravel()
        cell_types = np.full(len(elements), CellType.TETRA, dtype=np.uint8)
        dataset = pv.UnstructuredGrid(cells_padded, cell_types, vertices)

        center = np.array([0.5, 0.5, 0.5])
        radius = 0.3
        levelset = (np.linalg.norm(vertices - center, axis=1) - radius).reshape(-1, 1)
        dataset.point_data["levelset"] = levelset

        dataset.mmg.set_multi_materials(
            [{"ref": 0, "split": True, "ref_minus": 10, "ref_plus": 20}],
        )

        out = dataset.mmg.remesh_levelset(levelset, hmax=0.15, verbose=False)
        refs = np.unique(out.cell_data["refs"]).tolist()
        assert 10 in refs, f"expected ref_minus=10 in output, got {refs}"
        assert 20 in refs, f"expected ref_plus=20 in output, got {refs}"
