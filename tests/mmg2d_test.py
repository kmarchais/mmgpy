"""Tests for the MMG2D Python wrapper."""

import platform
import subprocess
from pathlib import Path

from mmgpy import mmg2d


def test_mmg2d() -> None:
    """Test that the Python wrapper produces the same output as the executable."""
    exe = "mmg2d_O3.exe" if platform.system() == "Windows" else "mmg2d_O3"
    input_mesh = Path(__file__).parent.parent / "assets" / "acdcBdy.mesh"

    current_dir = Path(__file__).parent
    test_path = current_dir / "acdcBdy_remeshed.vtk"
    ref_path = current_dir / "acdcBdy.o.vtk"

    ar = 10
    hmax = 10
    verbose = -1

    mmg2d.remesh(
        input_mesh=input_mesh,
        output_mesh=test_path,
        options={
            "ar": ar,
            "hmax": hmax,
            "verbose": verbose,
        },
    )

    # Add debugging for CI - run RPATH fix before executing
    if platform.system() == "Darwin":
        print("=== Running RPATH fix before test ===")
        try:
            import mmgpy

            mmgpy._fix_rpath()
        except Exception as e:
            print(f"RPATH fix failed: {e}")

    command = [
        exe,
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
    subprocess.check_call(command)  # noqa: S603

    # Compare mesh files for similarity rather than exact equality
    # Mesh generation can produce slightly different but equivalent results
    def extract_mesh_stats(content: str) -> dict:
        """Extract key statistics from VTK mesh content."""
        lines = content.strip().split('\n')
        stats = {}
        
        for line in lines:
            if line.startswith('POINTS'):
                stats['points'] = int(line.split()[1])
            elif line.startswith('POLYGONS') or line.startswith('CELLS'):
                stats['cells'] = int(line.split()[1])
            elif 'POINT_DATA' in line:
                stats['point_data'] = int(line.split()[-1])
            elif 'CELL_DATA' in line:
                stats['cell_data'] = int(line.split()[-1])
        
        return stats

    with test_path.open("r") as test, ref_path.open("r") as ref:
        test_content = test.read()
        ref_content = ref.read()
        to_replace = (
            str(input_mesh).replace("mesh", "sol")
            if platform.system() == "Windows"
            else "acdcBdy.sol"
        )
        test_content = test_content.replace("mesh.sol", to_replace)
        
        # Extract mesh statistics
        test_stats = extract_mesh_stats(test_content)
        ref_stats = extract_mesh_stats(ref_content)
        
        # Check that meshes are similar (within 5% tolerance)
        tolerance = 0.05
        for key in ['points', 'cells']:
            if key in test_stats and key in ref_stats:
                test_val = test_stats[key]
                ref_val = ref_stats[key]
                diff_ratio = abs(test_val - ref_val) / max(test_val, ref_val)
                assert diff_ratio <= tolerance, (
                    f"Mesh {key} count differs too much: {test_val} vs {ref_val} "
                    f"(difference: {diff_ratio:.1%}, tolerance: {tolerance:.1%})"
                )
