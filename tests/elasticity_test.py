"""Tests for elasticity-based displacement propagation (fedoo integration)."""

import numpy as np
import numpy.testing as npt
import pytest

fedoo = pytest.importorskip("fedoo", reason="fedoo not installed")
import fedoo as fd  # noqa: E402

from mmgpy._mmgpy import MmgMesh2D, MmgMesh3D  # noqa: E402
from mmgpy.lagrangian import (  # noqa: E402
    move_mesh,
    propagate_displacement_elasticity,
)


def create_2d_test_mesh():
    """Unit-square tri3 mesh built with fedoo (3x3 nodes, 8 triangles)."""
    m = fd.mesh.rectangle_mesh(
        nx=3,
        ny=3,
        x_min=0,
        x_max=1,
        y_min=0,
        y_max=1,
        elm_type="tri3",
    )
    vertices = np.asarray(m.nodes, dtype=np.float64)
    triangles = np.asarray(m.elements, dtype=np.int32)
    return vertices, triangles


def create_3d_hex_mesh():
    """Unit-cube hex8 mesh built with fedoo (3x3x3 nodes, 8 hexes)."""
    m = fd.mesh.box_mesh(
        nx=3,
        ny=3,
        nz=3,
        x_min=0,
        x_max=1,
        y_min=0,
        y_max=1,
        z_min=0,
        z_max=1,
        elm_type="hex8",
    )
    vertices = np.asarray(m.nodes, dtype=np.float64)
    elements = np.asarray(m.elements, dtype=np.int32)
    return vertices, elements


def create_3d_test_mesh():
    """Hand-rolled tet4 mesh on the unit cube.

    Used by tests that round-trip through MMG3D or pv.CellType.TETRA.
    fedoo's mesh module ships no tetrahedral generator (box_mesh is hex-only,
    and there is no hex2tet helper), so we keep the explicit connectivity here.
    """
    vertices = np.array(
        [
            [0.0, 0.0, 0.0],
            [1.0, 0.0, 0.0],
            [1.0, 1.0, 0.0],
            [0.0, 1.0, 0.0],
            [0.0, 0.0, 1.0],
            [1.0, 0.0, 1.0],
            [1.0, 1.0, 1.0],
            [0.0, 1.0, 1.0],
            [0.5, 0.5, 0.5],  # interior point
        ],
        dtype=np.float64,
    )
    elements = np.array(
        [
            [0, 1, 3, 8],
            [1, 2, 3, 8],
            [0, 1, 4, 8],
            [1, 5, 4, 8],
            [1, 2, 5, 8],
            [2, 6, 5, 8],
            [2, 3, 6, 8],
            [3, 7, 6, 8],
            [0, 3, 4, 8],
            [3, 7, 4, 8],
            [4, 5, 6, 8],
            [4, 6, 7, 8],
        ],
        dtype=np.int32,
    )
    return vertices, elements


def box_boundary_mask(vertices, atol=1e-9):
    """Mark vertices that sit on the bounding box of the point cloud.

    Avoids hard-coded indices in tests so the same assertions work for any
    structured grid resolution.
    """
    n_dims = vertices.shape[1]
    mask = np.zeros(len(vertices), dtype=bool)
    for d in range(n_dims):
        col = vertices[:, d]
        mask |= np.isclose(col, col.min(), atol=atol)
        mask |= np.isclose(col, col.max(), atol=atol)
    return mask


class TestPropagateDisplacementElasticity:
    """Tests for elasticity-based displacement propagation."""

    def test_all_boundary(self):
        """All-boundary case returns input displacement."""
        vertices, triangles = create_2d_test_mesh()
        n = len(vertices)

        boundary_mask = np.ones(n, dtype=bool)
        displacement = np.full((n, 2), [0.1, 0.0], dtype=np.float64)

        result = propagate_displacement_elasticity(
            vertices,
            triangles,
            boundary_mask,
            displacement,
        )
        npt.assert_array_almost_equal(result, displacement)

    def test_no_boundary(self):
        """No-boundary case returns zeros."""
        vertices, triangles = create_2d_test_mesh()
        n = len(vertices)

        boundary_mask = np.zeros(n, dtype=bool)
        displacement = np.full((n, 2), [0.1, 0.0], dtype=np.float64)

        result = propagate_displacement_elasticity(
            vertices,
            triangles,
            boundary_mask,
            displacement,
        )
        npt.assert_array_almost_equal(result, np.zeros_like(vertices))

    def test_uniform_boundary_2d(self):
        """Uniform boundary displacement propagates uniformly to interior."""
        vertices, triangles = create_2d_test_mesh()
        boundary_mask = box_boundary_mask(vertices)
        interior = np.where(~boundary_mask)[0]
        assert interior.size > 0  # sanity: helper must leave at least one interior node

        displacement = np.zeros_like(vertices)
        displacement[boundary_mask] = [0.1, 0.0]

        result = propagate_displacement_elasticity(
            vertices,
            triangles,
            boundary_mask,
            displacement,
        )

        b = boundary_mask
        npt.assert_array_almost_equal(result[b], displacement[b])
        for i in interior:
            assert abs(result[i, 0] - 0.1) < 0.05
            assert abs(result[i, 1]) < 0.05

    def test_non_uniform_propagation_2d(self):
        """Non-uniform boundary: interior gets intermediate values."""
        vertices, triangles = create_2d_test_mesh()
        boundary_mask = box_boundary_mask(vertices)
        interior = np.where(~boundary_mask)[0]
        assert interior.size > 0

        # Left edge moves right; the rest of the boundary stays fixed at zero.
        left = boundary_mask & np.isclose(vertices[:, 0], vertices[:, 0].min())
        displacement = np.zeros_like(vertices)
        displacement[left] = [0.1, 0.0]

        result = propagate_displacement_elasticity(
            vertices,
            triangles,
            boundary_mask,
            displacement,
        )

        for i in interior:
            assert 0.0 < result[i, 0] < 0.1

    def test_3d_propagation(self):
        """3D propagation on a fedoo hex8 cube: uniform boundary displacement."""
        vertices, elements = create_3d_hex_mesh()
        boundary_mask = box_boundary_mask(vertices)
        interior = np.where(~boundary_mask)[0]
        assert interior.size > 0

        displacement = np.zeros_like(vertices)
        displacement[boundary_mask] = [0.05, 0.0, 0.0]

        result = propagate_displacement_elasticity(
            vertices,
            elements,
            boundary_mask,
            displacement,
        )

        b = boundary_mask
        npt.assert_array_almost_equal(result[b], displacement[b])
        for i in interior:
            assert abs(result[i, 0] - 0.05) < 0.02
            assert abs(result[i, 1]) < 0.02
            assert abs(result[i, 2]) < 0.02

    def test_validation_errors(self):
        """Validation errors for invalid input."""
        vertices, triangles = create_2d_test_mesh()
        n = len(vertices)
        mask = np.ones(n, dtype=bool)
        disp = np.zeros((n, 2), dtype=np.float64)

        with pytest.raises(ValueError, match="boundary_mask length"):
            propagate_displacement_elasticity(
                vertices,
                triangles,
                np.ones(n + 1, dtype=bool),
                disp,
            )

        with pytest.raises(ValueError, match="boundary_displacement rows"):
            propagate_displacement_elasticity(
                vertices,
                triangles,
                mask,
                np.zeros((n + 1, 2)),
            )

        with pytest.raises(ValueError, match="boundary_displacement columns"):
            propagate_displacement_elasticity(
                vertices,
                triangles,
                mask,
                np.zeros((n, 3)),
            )


class TestMoveMeshPropagationMethod:
    """Tests for move_mesh with propagation_method parameter."""

    def test_invalid_method_raises(self):
        """Invalid propagation_method raises ValueError."""
        vertices, triangles = create_2d_test_mesh()
        mesh = MmgMesh2D(vertices, triangles)
        n = len(vertices)
        displacement = np.full((n, 2), [0.1, 0.0], dtype=np.float64)

        with pytest.raises(ValueError, match="propagation_method"):
            move_mesh(mesh, displacement, propagation_method="invalid")

    def test_elasticity_method_2d(self):
        """move_mesh with propagation_method='elasticity' works in 2D."""
        vertices, triangles = create_2d_test_mesh()
        mesh = MmgMesh2D(vertices, triangles)

        boundary_mask = box_boundary_mask(vertices)
        displacement = np.zeros_like(vertices)
        displacement[boundary_mask] = [0.05, 0.0]

        move_mesh(
            mesh,
            displacement,
            boundary_mask=boundary_mask,
            propagation_method="elasticity",
            hmax=0.5,
            verbose=False,
        )

        output_vertices = mesh.get_vertices()
        assert len(output_vertices) > 0
        assert len(mesh.get_triangles()) > 0

    def test_elasticity_method_3d(self):
        """move_mesh with propagation_method='elasticity' works in 3D."""
        vertices, elements = create_3d_test_mesh()
        mesh = MmgMesh3D(vertices, elements)

        n = len(vertices)
        boundary_mask = np.ones(n, dtype=bool)
        boundary_mask[8] = False

        displacement = np.zeros((n, 3), dtype=np.float64)
        displacement[:8] = [0.05, 0.0, 0.0]

        move_mesh(
            mesh,
            displacement,
            boundary_mask=boundary_mask,
            propagation_method="elasticity",
            hmax=0.5,
            verbose=False,
        )

        output_vertices = mesh.get_vertices()
        output_elements = mesh.get_elements()

        assert len(output_vertices) > 0
        assert len(output_elements) > 0

    def test_laplacian_still_default(self):
        """Default propagation_method is laplacian (backward compatible)."""
        vertices, triangles = create_2d_test_mesh()
        mesh = MmgMesh2D(vertices, triangles)

        n = len(vertices)
        displacement = np.full((n, 2), [0.1, 0.0], dtype=np.float64)

        # Should work without specifying propagation_method
        move_mesh(mesh, displacement, hmax=0.5, verbose=False)

        assert len(mesh.get_vertices()) > 0


class TestFedooMissing:
    """Cover the import-error branch of the elasticity propagator."""

    def test_helpful_error_when_fedoo_absent(self, monkeypatch):
        """Without fedoo on sys.path, the helper raises an actionable ImportError."""
        import builtins

        original_import = builtins.__import__

        def shim(name, *args, **kwargs):
            if name == "fedoo":
                msg = "No module named 'fedoo'"
                raise ImportError(msg)
            return original_import(name, *args, **kwargs)

        monkeypatch.setattr(builtins, "__import__", shim)

        vertices, triangles = create_2d_test_mesh()
        n = len(vertices)
        mask = np.ones(n, dtype=bool)
        disp = np.zeros_like(vertices)

        with pytest.raises(ImportError, match="fedoo is required"):
            propagate_displacement_elasticity(vertices, triangles, mask, disp)


class TestUnsupportedElementType:
    """Reject element shapes whose node count isn't in the propagator's map.

    The propagator currently maps {3, 6, 4} -> tri3/tri6/quad4 in 2D and
    {4, 10, 8} -> tet4/tet10/hex8 in 3D. Genuine fedoo elements outside that
    map (quad9 in 2D, hex20 in 3D) must raise.
    """

    def test_unsupported_2d_element(self):
        """quad9 (9 nodes per element) is not in the 2D map and must raise."""
        m = fd.mesh.rectangle_mesh(nx=2, ny=2, elm_type="quad9")
        vertices = np.asarray(m.nodes, dtype=np.float64)
        elements = np.asarray(m.elements, dtype=np.int32)
        # Leave at least one vertex outside the mask so the element-type
        # check is reached (the all-boundary fast path returns early).
        mask = np.ones(len(vertices), dtype=bool)
        mask[-1] = False
        disp = np.zeros_like(vertices)

        with pytest.raises(ValueError, match="Unsupported 2D element"):
            propagate_displacement_elasticity(vertices, elements, mask, disp)

    def test_unsupported_3d_element(self):
        """hex20 (20 nodes per element) is not in the 3D map and must raise."""
        m = fd.mesh.box_mesh(nx=2, ny=2, nz=2, elm_type="hex20")
        vertices = np.asarray(m.nodes, dtype=np.float64)
        elements = np.asarray(m.elements, dtype=np.int32)
        mask = np.ones(len(vertices), dtype=bool)
        mask[-1] = False
        disp = np.zeros_like(vertices)

        with pytest.raises(ValueError, match="Unsupported 3D element"):
            propagate_displacement_elasticity(vertices, elements, mask, disp)


class TestPvAccessorMove:
    """Cover the propagation_method forwarding through the .mmg accessor."""

    def test_accessor_elasticity_forwards(self):
        """``propagation_method='elasticity'`` runs through dataset.mmg.move."""
        import pyvista as pv

        vertices, elements = create_3d_test_mesh()
        dataset = pv.UnstructuredGrid({pv.CellType.TETRA: elements}, vertices)

        n = len(vertices)
        boundary_mask = np.ones(n, dtype=bool)
        boundary_mask[8] = False
        displacement = np.zeros_like(vertices)
        displacement[:8, 0] = 0.05

        moved = dataset.mmg.move(
            displacement,
            boundary_mask=boundary_mask,
            propagation_method="elasticity",
            hmax=0.5,
            verbose=False,
        )

        assert isinstance(moved, pv.PolyData | pv.UnstructuredGrid)
        assert moved.n_points > 0
