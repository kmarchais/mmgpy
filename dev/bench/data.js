window.BENCHMARK_DATA = {
  "lastUpdate": 1768209834088,
  "repoUrl": "https://github.com/kmarchais/mmgpy",
  "entries": {
    "Benchmark": [
      {
        "commit": {
          "author": {
            "email": "kevinmarchais@gmail.com",
            "name": "Kevin Marchais",
            "username": "kmarchais"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "d57d2a81f4a0385753c63538b9652e0e63d1c228",
          "message": "refactor: simplify RPATH handling by removing Python runtime fixes (#147)\n\n* refactor(rpath): simplify RPATH fixing logic\n\n- Remove auto-fix RPATH on import (CMake handles this at install)\n- Consolidate RPATH handling into CMake only\n- Remove backup Python utility call from CMakeLists.txt\n- Replace complex helper functions with streamlined implementation\n- Add new `check_rpath()` diagnostic function for debugging\n- Remove unused ruff lint exceptions (S110, BLE001, C901)\n- Reduce codebase by ~200 lines while maintaining functionality\n\nCloses #112\n\n* fix(rpath): restore auto-fix fallback and improve error logging\n\n- Add warning logs for failed RPATH operations in CMake\n- Restore lightweight auto-fix RPATH on import as fallback\n- Improve type annotations for check_rpath() return type\n- Add test for RPATH status after import\n- Re-add lint exceptions for RPATH fixing code (S110, BLE001, S607)\n\nThe auto-fix is needed because CMake's patchelf call may fail silently\nin CI environments where patchelf isn't available during install.\n\n* refactor(rpath): use build-time patchelf instead of import-time fix\n\nMove RPATH fixing entirely to build time by adding patchelf as a build\ndependency. This is cleaner than running Python code at import time.\n\nChanges:\n- Add patchelf to build-system.requires for Linux\n- Remove _auto_fix_rpath_on_import() function from __init__.py\n- Remove unnecessary lint exceptions (S110, BLE001)\n- Simplify test to just check status without auto-fix expectation\n\n* fix(cmake): remove configure-time EXISTS check for executables\n\nThe if(EXISTS \"${mmg_BINARY_DIR}/bin\") check was running at configure\ntime, but the executables are only created during build time. This\ncaused the entire executable installation and RPATH fixing block to\nbe skipped.\n\nFix by removing the check and using OPTIONAL keyword for install().\n\n* fix(cmake): move OPTIONAL before PATTERN in install()\n\n* refactor: simplify Windows DLL loading code\n\n- Remove hardcoded vcpkg path (not useful in production)\n- Remove PATH fallback (Python 3.10+ always has os.add_dll_directory)\n- Remove verbose error handling (standard traceback is sufficient)\n- Only check essential directories: lib and .libs (delvewheel)\n- Delvewheel handles most cases; this is just a fallback\n\n* refactor: remove Windows DLL handling (delvewheel does this at build time)\n\ndelvewheel repair patches .pyd files at wheel build time to find DLLs\nin the .libs directory. The Python import-time code was:\n- Unnecessary for wheels (delvewheel handles it)\n- Ineffective for editable installs (directories don't exist)\n\n* refactor: remove Python RPATH utilities entirely\n\nCMake handles RPATH at install time, so Python fallback is unnecessary.\n\n- Remove check_rpath(), _get_rpath(), _fix_rpath() from __init__.py\n- Remove _fix_rpath() call from mmgs_test.py fixture\n- Simplify rpath_fix_test.py to just verify executables can run\n- Remove unused lint exceptions",
          "timestamp": "2026-01-12T10:13:41+01:00",
          "tree_id": "a3567dbb49ea68381daf59aaf74a53db5846ff10",
          "url": "https://github.com/kmarchais/mmgpy/commit/d57d2a81f4a0385753c63538b9652e0e63d1c228"
        },
        "date": 1768209833483,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 0.6149457308240256,
            "unit": "iter/sec",
            "range": "stddev: 0.007135829973676991",
            "extra": "mean: 1.626159756666662 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.6159148423853524,
            "unit": "iter/sec",
            "range": "stddev: 0.017332961998378523",
            "extra": "mean: 1.6236010746666523 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.2030638253198342,
            "unit": "iter/sec",
            "range": "stddev: 0.0019058084632092218",
            "extra": "mean: 831.2110953333255 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.2293234722282333,
            "unit": "iter/sec",
            "range": "stddev: 0.0024751530063576994",
            "extra": "mean: 813.4555489999968 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 0.61286873541899,
            "unit": "iter/sec",
            "range": "stddev: 0.01039107244608171",
            "extra": "mean: 1.6316707676666624 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.6284858284304982,
            "unit": "iter/sec",
            "range": "stddev: 0.013496647844925432",
            "extra": "mean: 1.591125773666647 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.2273786123329737,
            "unit": "iter/sec",
            "range": "stddev: 0.0027261136843206445",
            "extra": "mean: 814.7445213333336 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.2294518817786444,
            "unit": "iter/sec",
            "range": "stddev: 0.007507842724838359",
            "extra": "mean: 813.370587999998 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 1.3138234250930674,
            "unit": "iter/sec",
            "range": "stddev: 0.012532455846126164",
            "extra": "mean: 761.1372889999757 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.2836490630799224,
            "unit": "iter/sec",
            "range": "stddev: 0.010484903328094985",
            "extra": "mean: 779.0291200000183 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 121.41732155211925,
            "unit": "iter/sec",
            "range": "stddev: 0.00004483376262511571",
            "extra": "mean: 8.236057155739044 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 1.2385871189842226,
            "unit": "iter/sec",
            "range": "stddev: 0.0034992536011483944",
            "extra": "mean: 807.3715483333217 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 1.249554476557874,
            "unit": "iter/sec",
            "range": "stddev: 0.003797644401289642",
            "extra": "mean: 800.2852366666579 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 16.774873954109566,
            "unit": "iter/sec",
            "range": "stddev: 0.0014675053110974248",
            "extra": "mean: 59.612966555555936 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 375.254344070801,
            "unit": "iter/sec",
            "range": "stddev: 0.0002292371626016043",
            "extra": "mean: 2.664859223618542 msec\nrounds: 398"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 22.85999735235281,
            "unit": "iter/sec",
            "range": "stddev: 0.0003518075929639478",
            "extra": "mean: 43.74453700000439 msec\nrounds: 24"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 159.3396834596978,
            "unit": "iter/sec",
            "range": "stddev: 0.0004576552347200005",
            "extra": "mean: 6.275900505682456 msec\nrounds: 176"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 257.549532118626,
            "unit": "iter/sec",
            "range": "stddev: 0.0001959123661533108",
            "extra": "mean: 3.88274826894038 msec\nrounds: 264"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 275.0050572919935,
            "unit": "iter/sec",
            "range": "stddev: 0.0001103171763798884",
            "extra": "mean: 3.6362967643108646 msec\nrounds: 297"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 57.6241732576978,
            "unit": "iter/sec",
            "range": "stddev: 0.0003409194391617143",
            "extra": "mean: 17.353828150001505 msec\nrounds: 60"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 872.7864958240377,
            "unit": "iter/sec",
            "range": "stddev: 0.00003452855847081221",
            "extra": "mean: 1.14575558259051 msec\nrounds: 896"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 25.467731217442044,
            "unit": "iter/sec",
            "range": "stddev: 0.00024405954394108301",
            "extra": "mean: 39.2653743461503 msec\nrounds: 26"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 1985.5808923282857,
            "unit": "iter/sec",
            "range": "stddev: 0.000014526022992827682",
            "extra": "mean: 503.63095447972574 usec\nrounds: 2065"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 72.32530138022055,
            "unit": "iter/sec",
            "range": "stddev: 0.0006816580774650509",
            "extra": "mean: 13.826420089740257 msec\nrounds: 78"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 91103.41902521029,
            "unit": "iter/sec",
            "range": "stddev: 9.825240839798176e-7",
            "extra": "mean: 10.976536453843497 usec\nrounds: 92679"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
            "value": 27134.79046296692,
            "unit": "iter/sec",
            "range": "stddev: 0.000002032850062385439",
            "extra": "mean: 36.85305775125782 usec\nrounds: 27757"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
            "value": 6405.497001858184,
            "unit": "iter/sec",
            "range": "stddev: 0.000004561947603481669",
            "extra": "mean: 156.11591102297103 usec\nrounds: 6541"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 25.50080759782849,
            "unit": "iter/sec",
            "range": "stddev: 0.00038597266591345144",
            "extra": "mean: 39.214444333329844 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 25.641625892775956,
            "unit": "iter/sec",
            "range": "stddev: 0.00046486954004636166",
            "extra": "mean: 38.99908703846003 msec\nrounds: 26"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 26.198302979696074,
            "unit": "iter/sec",
            "range": "stddev: 0.0001940222096362835",
            "extra": "mean: 38.17041129629691 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 3164.3254885592505,
            "unit": "iter/sec",
            "range": "stddev: 0.000008185490417742064",
            "extra": "mean: 316.02311570524 usec\nrounds: 3241"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 2832.4393372495006,
            "unit": "iter/sec",
            "range": "stddev: 0.000008700490193835497",
            "extra": "mean: 353.05257445374656 usec\nrounds: 2928"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 2092.411939919446,
            "unit": "iter/sec",
            "range": "stddev: 0.000009092860566778007",
            "extra": "mean: 477.9173646077063 usec\nrounds: 2153"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 109.19812153787747,
            "unit": "iter/sec",
            "range": "stddev: 0.0004195631322280826",
            "extra": "mean: 9.157666688003701 msec\nrounds: 125"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 104.01312038001019,
            "unit": "iter/sec",
            "range": "stddev: 0.00046679021180790056",
            "extra": "mean: 9.614171715515473 msec\nrounds: 116"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 99.21756021957258,
            "unit": "iter/sec",
            "range": "stddev: 0.0004982105436106038",
            "extra": "mean: 10.078861018018971 msec\nrounds: 111"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 25.880268045521277,
            "unit": "iter/sec",
            "range": "stddev: 0.00033915496345388176",
            "extra": "mean: 38.6394761538436 msec\nrounds: 26"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 24.842986022043544,
            "unit": "iter/sec",
            "range": "stddev: 0.000825839276020144",
            "extra": "mean: 40.252810153847264 msec\nrounds: 26"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 7296.0206030897425,
            "unit": "iter/sec",
            "range": "stddev: 0.0000047678612347697745",
            "extra": "mean: 137.06101646375788 usec\nrounds: 7471"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 1054348.5559175399,
            "unit": "iter/sec",
            "range": "stddev: 8.684722826707721e-8",
            "extra": "mean: 948.452951718378 nsec\nrounds: 108614"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3519098.393386375,
            "unit": "iter/sec",
            "range": "stddev: 3.936664614110838e-8",
            "extra": "mean: 284.16369428014633 nsec\nrounds: 190877"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1627495.5248631933,
            "unit": "iter/sec",
            "range": "stddev: 7.047379390616259e-8",
            "extra": "mean: 614.4410136452202 nsec\nrounds: 168322"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 150436.08504845572,
            "unit": "iter/sec",
            "range": "stddev: 8.392815912927284e-7",
            "extra": "mean: 6.6473412923362 usec\nrounds: 157431"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 1165.2392276125063,
            "unit": "iter/sec",
            "range": "stddev: 0.000013490114421952181",
            "extra": "mean: 858.1928725905753 usec\nrounds: 1193"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 118.96332421569484,
            "unit": "iter/sec",
            "range": "stddev: 0.0002673695847850505",
            "extra": "mean: 8.405952057853389 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 18.29444545808784,
            "unit": "iter/sec",
            "range": "stddev: 0.00007834094097232852",
            "extra": "mean: 54.66139994737623 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 119.0730429142169,
            "unit": "iter/sec",
            "range": "stddev: 0.00008011068755217846",
            "extra": "mean: 8.398206474998915 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 108.37207617819915,
            "unit": "iter/sec",
            "range": "stddev: 0.00014563828925129784",
            "extra": "mean: 9.227469245450948 msec\nrounds: 110"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 117.18451549440996,
            "unit": "iter/sec",
            "range": "stddev: 0.00011742316346450437",
            "extra": "mean: 8.533550663933093 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 160.43894836382847,
            "unit": "iter/sec",
            "range": "stddev: 0.00005615172341081993",
            "extra": "mean: 6.232900490797865 msec\nrounds: 163"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 1181.0483051946244,
            "unit": "iter/sec",
            "range": "stddev: 0.00008251074673714018",
            "extra": "mean: 846.7054189076631 usec\nrounds: 1227"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 118.94809679940757,
            "unit": "iter/sec",
            "range": "stddev: 0.00027857229607991486",
            "extra": "mean: 8.407028165287809 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 119.10652575548751,
            "unit": "iter/sec",
            "range": "stddev: 0.00007299192373353809",
            "extra": "mean: 8.39584559835864 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 28531.279100672396,
            "unit": "iter/sec",
            "range": "stddev: 0.0000021987704213164957",
            "extra": "mean: 35.04925231257623 usec\nrounds: 29297"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 48.47512258582036,
            "unit": "iter/sec",
            "range": "stddev: 0.016015432383310876",
            "extra": "mean: 20.629138136362627 msec\nrounds: 66"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 3.190182903745116,
            "unit": "iter/sec",
            "range": "stddev: 0.0014655024760111234",
            "extra": "mean: 313.46165100002565 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.2285977876338074,
            "unit": "iter/sec",
            "range": "stddev: 0.0044899556046173635",
            "extra": "mean: 813.9360253333431 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.12021175596052486,
            "unit": "iter/sec",
            "range": "stddev: 0.025479407861419424",
            "extra": "mean: 8.318653962000022 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.219366496191687,
            "unit": "iter/sec",
            "range": "stddev: 0.0019182485679499475",
            "extra": "mean: 820.0979796666464 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 2.9220945002206773,
            "unit": "iter/sec",
            "range": "stddev: 0.0014043856964368537",
            "extra": "mean: 342.2202806666519 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 1.001838727379879,
            "unit": "iter/sec",
            "range": "stddev: 0.0012808988027181352",
            "extra": "mean: 998.1646473333209 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 2.3278950089926043,
            "unit": "iter/sec",
            "range": "stddev: 0.00025637882824932376",
            "extra": "mean: 429.5726380000057 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 3.1231496533886407,
            "unit": "iter/sec",
            "range": "stddev: 0.0006627400175754814",
            "extra": "mean: 320.1895877499794 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.2368478419044815,
            "unit": "iter/sec",
            "range": "stddev: 0.007162752369199559",
            "extra": "mean: 808.5068883333406 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.2127637809229368,
            "unit": "iter/sec",
            "range": "stddev: 0.0012869527290536235",
            "extra": "mean: 824.5628833332906 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 11378.232453614211,
            "unit": "iter/sec",
            "range": "stddev: 0.00000393058716402767",
            "extra": "mean: 87.8871128777438 usec\nrounds: 11570"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 287.40570568174866,
            "unit": "iter/sec",
            "range": "stddev: 0.00003173983169433511",
            "extra": "mean: 3.4794020446738254 msec\nrounds: 291"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 24.756306052112283,
            "unit": "iter/sec",
            "range": "stddev: 0.0009315331865244117",
            "extra": "mean: 40.39374848149758 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 16.13051892871524,
            "unit": "iter/sec",
            "range": "stddev: 0.0010943774013567678",
            "extra": "mean: 61.99428576472014 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.395834793787781,
            "unit": "iter/sec",
            "range": "stddev: 0.0011288767766355946",
            "extra": "mean: 185.32813516664723 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 16.049552316808278,
            "unit": "iter/sec",
            "range": "stddev: 0.001139530853893941",
            "extra": "mean: 62.30703388235484 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 20.26807293975537,
            "unit": "iter/sec",
            "range": "stddev: 0.0022931008665293593",
            "extra": "mean: 49.338681727285596 msec\nrounds: 22"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 16.586232224937074,
            "unit": "iter/sec",
            "range": "stddev: 0.0012298346306413364",
            "extra": "mean: 60.29096822221744 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 16.371795241662866,
            "unit": "iter/sec",
            "range": "stddev: 0.0007623056227608603",
            "extra": "mean: 61.08065641177853 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 25.864789872045133,
            "unit": "iter/sec",
            "range": "stddev: 0.0008276732523266832",
            "extra": "mean: 38.662599037033274 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 16.44848322909742,
            "unit": "iter/sec",
            "range": "stddev: 0.0008726869292140627",
            "extra": "mean: 60.7958792352961 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 16.488780849225847,
            "unit": "iter/sec",
            "range": "stddev: 0.0009764791272178206",
            "extra": "mean: 60.647297647051346 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 21745.769769314335,
            "unit": "iter/sec",
            "range": "stddev: 0.000002405589651669418",
            "extra": "mean: 45.98595545746601 usec\nrounds: 22181"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 44.45675026726134,
            "unit": "iter/sec",
            "range": "stddev: 0.017204413967085455",
            "extra": "mean: 22.493771901641132 msec\nrounds: 61"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 172.676913571564,
            "unit": "iter/sec",
            "range": "stddev: 0.00015313372588342437",
            "extra": "mean: 5.791162114937625 msec\nrounds: 174"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.298115885894243,
            "unit": "iter/sec",
            "range": "stddev: 0.0002098869580301873",
            "extra": "mean: 69.93928486665482 msec\nrounds: 15"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
            "value": 1.1232923803309889,
            "unit": "iter/sec",
            "range": "stddev: 0.00732467001484949",
            "extra": "mean: 890.2401703333377 msec\nrounds: 3"
          }
        ]
      }
    ]
  }
}