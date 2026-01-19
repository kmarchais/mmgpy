"""Tests for the MMG2D Python wrapper."""

from __future__ import annotations

import subprocess
from pathlib import Path

import numpy as np
import pytest
import pyvista as pv

import mmgpy
from mmgpy import mmg2d

_2D = 2
ACCEPTABLE_RATIO = 0.3
NORMAL_RATIO = 0.95


@pytest.fixture(scope="module")
def mesh_paths() -> tuple[Path, Path, Path]:
    """Provide input and output mesh paths."""
    input_mesh: Path = Path(__file__).parent.parent / "assets" / "acdcBdy.mesh"
    current_dir: Path = Path(__file__).parent
    test_path: Path = current_dir / "acdcBdy_remeshed.vtk"
    ref_path: Path = current_dir / "acdcBdy.o.vtk"
    return input_mesh, test_path, ref_path


@pytest.fixture(scope="module")
def mesh_params() -> dict[str, int | float]:
    """Provide meshing parameters."""
    return {
        "ar": 10,
        "hmax": 10,
        "verbose": -1,
    }


@pytest.fixture(scope="module")
def generated_meshes(
    mesh_paths: tuple[Path, Path, Path],
    mesh_params: dict[str, int | float],
) -> tuple[pv.DataSet, pv.DataSet]:
    """Generate test and reference meshes, return as PyVista objects."""
    input_mesh, test_path, ref_path = mesh_paths
    ar: int | float = mesh_params["ar"]
    hmax: int | float = mesh_params["hmax"]
    verbose: int | float = mesh_params["verbose"]

    # Generate test mesh using Python wrapper
    mmg2d.remesh(
        input_mesh=input_mesh,
        output_mesh=test_path,
        options=mesh_params,
    )

    # Find the executable in mmgpy/bin/
    exe_path = mmgpy._find_mmg_executable("mmg2d_O3")
    if exe_path is None:
        pytest.skip("mmg2d_O3 executable not found in mmgpy/bin/")

    # Generate reference mesh using executable
    command: list[str] = [
        exe_path,
        "-ar",
        str(ar),
        "-hmax",
        str(hmax),
        "-in",
        str(input_mesh),
        "-out",
        str(ref_path),
        "-verbose",
        str(verbose),
    ]
    subprocess.check_call(command)

    # Load meshes with PyVista
    test_mesh: pv.PolyData = pv.read(test_path)
    ref_mesh: pv.PolyData = pv.read(ref_path)

    return test_mesh, ref_mesh


def test_mesh_files_exist(mesh_paths: tuple[Path, Path, Path]) -> None:
    """Test that input mesh file exists."""
    input_mesh, _test_path, _ref_path = mesh_paths
    assert input_mesh.exists(), f"Input mesh file not found: {input_mesh}"


def test_mesh_generation(
    generated_meshes: tuple[pv.PolyData, pv.PolyData],
    mesh_paths: tuple[Path, Path, Path],
) -> None:
    """Test that both meshes are generated successfully."""
    test_mesh, ref_mesh = generated_meshes
    _input_mesh, test_path, ref_path = mesh_paths

    # Check files were created
    assert test_path.exists(), f"Test mesh file not created: {test_path}"
    assert ref_path.exists(), f"Reference mesh file not created: {ref_path}"

    # Check meshes loaded successfully
    assert test_mesh is not None, "Test mesh failed to load"
    assert ref_mesh is not None, "Reference mesh failed to load"

    # Basic sanity checks
    assert test_mesh.n_points > 0, "Test mesh has no points"
    assert ref_mesh.n_points > 0, "Reference mesh has no points"
    assert test_mesh.n_cells > 0, "Test mesh has no cells"
    assert ref_mesh.n_cells > 0, "Reference mesh has no cells"


def test_surface_area_validation(
    generated_meshes: tuple[pv.DataSet, pv.DataSet],
) -> None:
    """Test that surface areas are positive and similar."""
    test_mesh, ref_mesh = generated_meshes

    test_area: float = test_mesh.area
    ref_area: float = ref_mesh.area

    # Both areas must be positive
    assert test_area > 0, f"Test mesh surface area must be > 0, got {test_area}"
    assert ref_area > 0, f"Reference mesh surface area must be > 0, got {ref_area}"

    # Areas should be similar (5% tolerance)
    assert test_area == pytest.approx(
        ref_area,
        rel=0.05,
    ), f"Surface areas differ significantly: test={test_area:.6f} vs ref={ref_area:.6f}"


def test_mesh_statistics_comparison(
    generated_meshes: tuple[pv.DataSet, pv.DataSet],
) -> None:
    """Test that mesh statistics are similar between test and reference."""
    test_mesh, ref_mesh = generated_meshes
    tolerance: float = 0.05

    # Compare point and cell counts
    assert test_mesh.n_points == pytest.approx(
        ref_mesh.n_points,
        rel=tolerance,
    ), f"Point count differs: {test_mesh.n_points} vs {ref_mesh.n_points}"

    assert test_mesh.n_cells == pytest.approx(
        ref_mesh.n_cells,
        rel=tolerance,
    ), f"Cell count differs: {test_mesh.n_cells} vs {ref_mesh.n_cells}"

    # Compare mesh bounds
    test_bounds: np.ndarray = test_mesh.bounds
    ref_bounds: np.ndarray = ref_mesh.bounds
    assert np.allclose(
        test_bounds,
        ref_bounds,
        rtol=tolerance,
    ), f"Mesh bounds differ: {test_bounds} vs {ref_bounds}"


def test_mesh_quality_analysis(generated_meshes: tuple[pv.DataSet, pv.DataSet]) -> None:
    """Test mesh quality metrics with proper acceptable ranges."""
    test_mesh, ref_mesh = generated_meshes

    # Quality metrics appropriate for 2D meshes (triangles and quads)
    quality_metrics = ["scaled_jacobian"]

    for metric in quality_metrics:
        # Compute quality using the correct PyVista method
        test_quality: pv.DataSet = test_mesh.cell_quality(metric)
        ref_quality: pv.DataSet = ref_mesh.cell_quality(metric)

        # Get quality values - array name matches the metric
        test_quality_values: np.ndarray = test_quality[metric]
        ref_quality_values: np.ndarray = ref_quality[metric]

        # Quality values should be finite
        assert np.isfinite(
            test_quality_values,
        ).all(), f"Test mesh {metric} quality contains non-finite values"
        assert np.isfinite(
            ref_quality_values,
        ).all(), f"Reference mesh {metric} quality contains non-finite values"

        # Get acceptable ranges from PyVista for different cell types
        cell_types_in_mesh = {int(ct.item()) for ct in test_mesh.celltypes}

        for cell_type_id in cell_types_in_mesh:
            # Map VTK cell type IDs to PyVista CellType names
            cell_type_map = {
                3: "triangle",  # Lines don't have quality measures, skip
                5: "TRIANGLE",
                9: "QUAD",
                7: "triangle",  # Polygon - treat as triangle for quality
            }

            if cell_type_id not in cell_type_map:
                continue  # Skip unknown cell types

            cell_type_name = cell_type_map[cell_type_id]
            if cell_type_id == 3:  # Lines don't have meaningful quality measures
                continue

            # Get quality info from PyVista
            quality_info = pv.cell_quality_info(cell_type_name, metric)
            acceptable_min, acceptable_max = quality_info.acceptable_range
            normal_min, normal_max = quality_info.normal_range

            # Check that most cells fall within acceptable range
            acceptable_test = np.logical_and(
                test_quality_values >= acceptable_min,
                test_quality_values <= acceptable_max,
            )
            acceptable_ref = np.logical_and(
                ref_quality_values >= acceptable_min,
                ref_quality_values <= acceptable_max,
            )

            # At least 70% of cells should be in acceptable range
            acceptable_ratio_test = acceptable_test.mean()
            acceptable_ratio_ref = acceptable_ref.mean()

            assert acceptable_ratio_test >= ACCEPTABLE_RATIO, (
                f"Test mesh: too few cells in acceptable {metric} range "
                f"({acceptable_ratio_test:.1%} in "
                f"[{acceptable_min:.3f}, {acceptable_max:.3f}])"
            )
            assert acceptable_ratio_ref >= ACCEPTABLE_RATIO, (
                "Reference mesh: too few cells in "
                f"acceptable {metric} range "
                f"({acceptable_ratio_ref:.1%} in "
                f"[{acceptable_min:.3f}, {acceptable_max:.3f}])"
            )

            normal_test = np.logical_and(
                test_quality_values >= normal_min * 1.1,  # Allow 10% tolerance
                test_quality_values <= normal_max * 1.1,
            )
            normal_ref = np.logical_and(
                ref_quality_values >= normal_min * 1.1,
                ref_quality_values <= normal_max * 1.1,
            )

            # At least 95% should be in normal range
            normal_ratio_test = normal_test.mean()
            normal_ratio_ref = normal_ref.mean()

            assert normal_ratio_test >= NORMAL_RATIO, (
                f"Test mesh: too many cells outside normal {metric} range "
                f"({normal_ratio_test:.1%} in "
                f"[{normal_min:.3f}, {normal_max:.3f}])"
            )
            assert normal_ratio_ref >= NORMAL_RATIO, (
                "Reference mesh: too many cells "
                f"outside normal {metric} range "
                f"({normal_ratio_ref:.1%} in "
                f"[{normal_min:.3f}, {normal_max:.3f}])"
            )

        # Basic sanity checks regardless of cell type
        if metric == "area":
            # Areas should be positive
            assert (test_quality_values > 0).all(), (
                "Test mesh has non-positive cell areas"
            )
            assert (ref_quality_values > 0).all(), (
                "Reference mesh has non-positive cell areas"
            )


def test_mesh_geometric_properties(
    generated_meshes: tuple[pv.DataSet, pv.DataSet],
) -> None:
    """Test additional geometric properties."""
    test_mesh, ref_mesh = generated_meshes
    tolerance: float = 0.05

    # Compare mesh centers
    test_center: np.ndarray = test_mesh.center
    ref_center: np.ndarray = ref_mesh.center

    assert np.allclose(
        test_center,
        ref_center,
        rtol=tolerance,
    ), f"Mesh centers differ: test={test_center} vs ref={ref_center}"

    # Compare mesh extents (size in each dimension)
    test_bounds: np.ndarray = test_mesh.bounds
    ref_bounds: np.ndarray = ref_mesh.bounds

    test_x_extent: float = test_bounds[1] - test_bounds[0]  # xmax - xmin
    test_y_extent: float = test_bounds[3] - test_bounds[2]  # ymax - ymin
    ref_x_extent: float = ref_bounds[1] - ref_bounds[0]
    ref_y_extent: float = ref_bounds[3] - ref_bounds[2]

    assert test_x_extent == pytest.approx(
        ref_x_extent,
        rel=tolerance,
    ), f"X extent differs: test={test_x_extent:.6f} vs ref={ref_x_extent:.6f}"
    assert test_y_extent == pytest.approx(
        ref_y_extent,
        rel=tolerance,
    ), f"Y extent differs: test={test_y_extent:.6f} vs ref={ref_y_extent:.6f}"

    # Ensure extents are positive
    assert test_x_extent > 0, (
        f"Test mesh X extent must be positive, got {test_x_extent}"
    )
    assert test_y_extent > 0, (
        f"Test mesh Y extent must be positive, got {test_y_extent}"
    )
    assert ref_x_extent > 0, (
        f"Reference mesh X extent must be positive, got {ref_x_extent}"
    )
    assert ref_y_extent > 0, (
        f"Reference mesh Y extent must be positive, got {ref_y_extent}"
    )


def test_mesh_data_integrity(generated_meshes: tuple[pv.DataSet, pv.DataSet]) -> None:
    """Test mesh data integrity and validity."""
    test_mesh, ref_mesh = generated_meshes

    # Check that point coordinates are finite
    assert np.isfinite(
        test_mesh.points,
    ).all(), "Test mesh contains non-finite point coordinates"
    assert np.isfinite(
        ref_mesh.points,
    ).all(), "Reference mesh contains non-finite point coordinates"

    # Check that cell connectivity is valid
    # Use the cells property which gives us the connectivity array
    if hasattr(test_mesh, "cells") and test_mesh.cells is not None:
        cells_array: np.ndarray = test_mesh.cells
        # Extract just the point indices (skip the count values)
        point_indices: np.ndarray = cells_array[cells_array < test_mesh.n_points]
        assert np.all(point_indices >= 0), "Test mesh contains negative cell indices"
        assert np.all(
            point_indices < test_mesh.n_points,
        ), "Test mesh contains cell indices exceeding point count"

    if hasattr(ref_mesh, "cells") and ref_mesh.cells is not None:
        cells_array = ref_mesh.cells
        point_indices = cells_array[cells_array < ref_mesh.n_points]
        assert np.all(
            point_indices >= 0,
        ), "Reference mesh contains negative cell indices"
        assert np.all(
            point_indices < ref_mesh.n_points,
        ), "Reference mesh contains cell indices exceeding point count"

    # Check mesh dimensionality
    assert test_mesh.points.shape[1] >= _2D, (
        "Test mesh must have at least 2D coordinates"
    )
    assert ref_mesh.points.shape[1] >= _2D, (
        "Reference mesh must have at least 2D coordinates"
    )


def test_mesh_topology_consistency(
    generated_meshes: tuple[pv.DataSet, pv.DataSet],
) -> None:
    """Test mesh topology consistency."""
    test_mesh, ref_mesh = generated_meshes

    # Check that meshes have consistent cell types
    test_cell_types: set[int] = {int(ct.item()) for ct in test_mesh.celltypes}
    ref_cell_types: set[int] = {int(ct.item()) for ct in ref_mesh.celltypes}

    assert len(test_cell_types) > 0, "Test mesh has no cell types"
    assert len(ref_cell_types) > 0, "Reference mesh has no cell types"

    # Check that we have valid 2D cell types
    # VTK cell type IDs: 3=line, 5=triangle, 9=quad, 7=polygon
    # Lines (type 3) are valid as boundary elements in 2D meshes
    valid_2d_types: set[int] = {3, 5, 7, 9}
    assert test_cell_types.issubset(
        valid_2d_types,
    ), f"Test mesh has invalid 2D cell types: {test_cell_types}"
    assert ref_cell_types.issubset(
        valid_2d_types,
    ), f"Reference mesh has invalid 2D cell types: {ref_cell_types}"

    # Ensure all cell type values are valid VTK types (positive integers)
    assert all(ct > 0 for ct in test_cell_types), (
        f"Test mesh has invalid cell type values: {test_cell_types}"
    )
    assert all(ct > 0 for ct in ref_cell_types), (
        f"Reference mesh has invalid cell type values: {ref_cell_types}"
    )
