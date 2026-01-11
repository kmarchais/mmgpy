window.BENCHMARK_DATA = {
  "lastUpdate": 1768164392324,
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
          "id": "6c840187b48137aea017acd6d5ee5c6a86d8858c",
          "message": "build: centralize VTK version in pyproject.toml (#145)\n\n* build: centralize VTK version in pyproject.toml\n\nDefine VTK version once in [tool.mmgpy] section of pyproject.toml\ninstead of hardcoding it in multiple locations.\n\nChanges:\n- Add [tool.mmgpy] with vtk_version = \"9.5.2\" in pyproject.toml\n- Update CMakeLists.txt to read VTK version from pyproject.toml\n- Update build-and-test.yml to extract version dynamically\n- Update build-wheels.yml to extract version dynamically\n- Use environment-pass in cibuildwheel.linux to pass VTK_VERSION\n\nCloses #114\n\n* fix(ci): use grep instead of tomllib for VTK version extraction\n\ntomllib is only available in Python 3.11+, which may not be available\non all CI runners. Switch to grep/sed for cross-platform compatibility.\n\n* fix(ci): use uv run python for VTK version extraction\n\nThe previous approach using python3 failed on Windows because:\n1. Windows uses 'python' not 'python3'\n2. The step ran before Python was available in PATH\n\nUsing 'uv run python' leverages uv's managed Python which is available\nafter setup-uv and guarantees Python 3.11+ with tomllib support.\n\nAlso moved setup-uv earlier in build-and-test.yml to enable this.\n\n* fix(ci): use --no-project to avoid triggering build during version extraction\n\nuv run python triggers a full project sync which tries to build mmgpy\nbefore VTK is downloaded. Using --no-project runs Python without\nattempting to build the project.\n\n* fix(ci): use grep for VTK version extraction (Python 3.10 compatibility)\n\ntomllib is only available in Python 3.11+, but the CI matrix includes\nPython 3.10. Using grep/sed works on all platforms and Python versions.",
          "timestamp": "2026-01-11T21:36:24+01:00",
          "tree_id": "b6c6328952b29a7ea20b6f4e46a3f54c71fe1fc1",
          "url": "https://github.com/kmarchais/mmgpy/commit/6c840187b48137aea017acd6d5ee5c6a86d8858c"
        },
        "date": 1768164391727,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 0.6063499056451777,
            "unit": "iter/sec",
            "range": "stddev: 0.024195977327045228",
            "extra": "mean: 1.6492127576666558 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.6093261648214239,
            "unit": "iter/sec",
            "range": "stddev: 0.010894466256832875",
            "extra": "mean: 1.6411571630000026 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.1939283447403939,
            "unit": "iter/sec",
            "range": "stddev: 0.0030310848055576287",
            "extra": "mean: 837.5712029999912 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.248933420226133,
            "unit": "iter/sec",
            "range": "stddev: 0.004100447261555546",
            "extra": "mean: 800.6831939999964 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 0.6083283632568105,
            "unit": "iter/sec",
            "range": "stddev: 0.008122643591017727",
            "extra": "mean: 1.643849046666664 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.6071632556236611,
            "unit": "iter/sec",
            "range": "stddev: 0.009617548150171582",
            "extra": "mean: 1.6470034883333444 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.2426818177791945,
            "unit": "iter/sec",
            "range": "stddev: 0.0011059877638969918",
            "extra": "mean: 804.7112186666633 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.2478570498887933,
            "unit": "iter/sec",
            "range": "stddev: 0.001123716060136816",
            "extra": "mean: 801.3738433333515 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 1.2483497030185982,
            "unit": "iter/sec",
            "range": "stddev: 0.0023323616261894573",
            "extra": "mean: 801.0575863333239 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.2436961302815106,
            "unit": "iter/sec",
            "range": "stddev: 0.0016133934044753418",
            "extra": "mean: 804.054926000011 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 120.5545442536292,
            "unit": "iter/sec",
            "range": "stddev: 0.00011277217306336684",
            "extra": "mean: 8.295000459676954 msec\nrounds: 124"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 1.17438178305746,
            "unit": "iter/sec",
            "range": "stddev: 0.011405909666477856",
            "extra": "mean: 851.511845999975 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 1.1486810841685628,
            "unit": "iter/sec",
            "range": "stddev: 0.007422260729920434",
            "extra": "mean: 870.5636523333359 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 16.633149468992478,
            "unit": "iter/sec",
            "range": "stddev: 0.0012916026496940232",
            "extra": "mean: 60.12090505554587 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 371.5207085647235,
            "unit": "iter/sec",
            "range": "stddev: 0.000523673841835599",
            "extra": "mean: 2.691639999996898 msec\nrounds: 402"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 23.93022066348288,
            "unit": "iter/sec",
            "range": "stddev: 0.00048002264651860296",
            "extra": "mean: 41.78816460000235 msec\nrounds: 25"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 165.1353451870562,
            "unit": "iter/sec",
            "range": "stddev: 0.0006129926243066458",
            "extra": "mean: 6.0556387784048 msec\nrounds: 176"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 256.02174763540216,
            "unit": "iter/sec",
            "range": "stddev: 0.00011994124775717237",
            "extra": "mean: 3.905918185606988 msec\nrounds: 264"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 271.79034406263855,
            "unit": "iter/sec",
            "range": "stddev: 0.0003244965259802015",
            "extra": "mean: 3.6793065752532166 msec\nrounds: 299"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 63.06652322478267,
            "unit": "iter/sec",
            "range": "stddev: 0.0006104211168694491",
            "extra": "mean: 15.856272850744993 msec\nrounds: 67"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 884.0203314166721,
            "unit": "iter/sec",
            "range": "stddev: 0.00011831682070394238",
            "extra": "mean: 1.1311957027022972 msec\nrounds: 925"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 25.508602185463907,
            "unit": "iter/sec",
            "range": "stddev: 0.0002867376605753748",
            "extra": "mean: 39.20246169230906 msec\nrounds: 26"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 1991.4839926743916,
            "unit": "iter/sec",
            "range": "stddev: 0.000014752687944692397",
            "extra": "mean: 502.1381058941308 usec\nrounds: 2087"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 63.20084106912392,
            "unit": "iter/sec",
            "range": "stddev: 0.0002546672167738728",
            "extra": "mean: 15.822574242426327 msec\nrounds: 66"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 90914.57932448432,
            "unit": "iter/sec",
            "range": "stddev: 9.321587589793393e-7",
            "extra": "mean: 10.999335941828294 usec\nrounds: 92516"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
            "value": 27522.2334416821,
            "unit": "iter/sec",
            "range": "stddev: 0.0000020031066728309164",
            "extra": "mean: 36.33426052136858 usec\nrounds: 28086"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
            "value": 6387.481261689304,
            "unit": "iter/sec",
            "range": "stddev: 0.0000048648416901147025",
            "extra": "mean: 156.5562322660386 usec\nrounds: 6527"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 26.390031061379982,
            "unit": "iter/sec",
            "range": "stddev: 0.000619182046038943",
            "extra": "mean: 37.89309674073981 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 26.460239454052036,
            "unit": "iter/sec",
            "range": "stddev: 0.0003008213718572716",
            "extra": "mean: 37.79255292592838 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 26.24012813579336,
            "unit": "iter/sec",
            "range": "stddev: 0.0002999016493415768",
            "extra": "mean: 38.10957000000052 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 3007.45296954053,
            "unit": "iter/sec",
            "range": "stddev: 0.00001170300388554899",
            "extra": "mean: 332.50727779552847 usec\nrounds: 3121"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 2697.8596716551056,
            "unit": "iter/sec",
            "range": "stddev: 0.000011440974301718913",
            "extra": "mean: 370.664201146723 usec\nrounds: 2789"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 2028.9382459795097,
            "unit": "iter/sec",
            "range": "stddev: 0.000016528522484171957",
            "extra": "mean: 492.868623272085 usec\nrounds: 2097"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 92.54824432728397,
            "unit": "iter/sec",
            "range": "stddev: 0.0002166747530419512",
            "extra": "mean: 10.805175260414876 msec\nrounds: 96"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 92.59478591372961,
            "unit": "iter/sec",
            "range": "stddev: 0.00022782348017445742",
            "extra": "mean: 10.799744177082479 msec\nrounds: 96"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 90.70088464151965,
            "unit": "iter/sec",
            "range": "stddev: 0.00019759421583747264",
            "extra": "mean: 11.02525078947505 msec\nrounds: 95"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 26.41399878072236,
            "unit": "iter/sec",
            "range": "stddev: 0.0002710390795762906",
            "extra": "mean: 37.85871303703651 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 26.531052842867982,
            "unit": "iter/sec",
            "range": "stddev: 0.00040444303467463246",
            "extra": "mean: 37.6916817407349 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 7046.527106120069,
            "unit": "iter/sec",
            "range": "stddev: 0.000005710238350558301",
            "extra": "mean: 141.9138796942223 usec\nrounds: 7323"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 1043918.2128770795,
            "unit": "iter/sec",
            "range": "stddev: 9.740631088177359e-8",
            "extra": "mean: 957.9294504729072 nsec\nrounds: 107910"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3532035.0135908686,
            "unit": "iter/sec",
            "range": "stddev: 3.8763667496141064e-8",
            "extra": "mean: 283.12290114682156 nsec\nrounds: 193088"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1642047.2560267898,
            "unit": "iter/sec",
            "range": "stddev: 7.812593587511303e-8",
            "extra": "mean: 608.9958716655137 nsec\nrounds: 169463"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 152303.71420440765,
            "unit": "iter/sec",
            "range": "stddev: 8.44858830082219e-7",
            "extra": "mean: 6.565828057600057 usec\nrounds: 157704"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 1140.653352725616,
            "unit": "iter/sec",
            "range": "stddev: 0.000025074757044094985",
            "extra": "mean: 876.6905367090519 usec\nrounds: 1185"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 119.21092883038784,
            "unit": "iter/sec",
            "range": "stddev: 0.0001067891942635221",
            "extra": "mean: 8.388492647538971 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 18.31901819688613,
            "unit": "iter/sec",
            "range": "stddev: 0.00013628567588707592",
            "extra": "mean: 54.58807831578988 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 119.40164258766404,
            "unit": "iter/sec",
            "range": "stddev: 0.00012840121872210046",
            "extra": "mean: 8.375094163933342 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 108.87589249458809,
            "unit": "iter/sec",
            "range": "stddev: 0.00010743046803164794",
            "extra": "mean: 9.184769714284613 msec\nrounds: 112"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 119.07974885080587,
            "unit": "iter/sec",
            "range": "stddev: 0.0001263473076192645",
            "extra": "mean: 8.39773353278476 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 161.3693661230516,
            "unit": "iter/sec",
            "range": "stddev: 0.00007980513475852498",
            "extra": "mean: 6.196963054545642 msec\nrounds: 165"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 1191.9625122015516,
            "unit": "iter/sec",
            "range": "stddev: 0.00002882278494695653",
            "extra": "mean: 838.9525591312455 usec\nrounds: 1243"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 120.12966268391597,
            "unit": "iter/sec",
            "range": "stddev: 0.0000975688215359369",
            "extra": "mean: 8.324338699186981 msec\nrounds: 123"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 120.21138762611555,
            "unit": "iter/sec",
            "range": "stddev: 0.0000877640664341224",
            "extra": "mean: 8.318679450820623 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 28188.529043998005,
            "unit": "iter/sec",
            "range": "stddev: 0.000002148959479765641",
            "extra": "mean: 35.475423298574825 usec\nrounds: 29126"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 47.00175898731837,
            "unit": "iter/sec",
            "range": "stddev: 0.01581510152730587",
            "extra": "mean: 21.275799492308614 msec\nrounds: 65"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 3.292571262687871,
            "unit": "iter/sec",
            "range": "stddev: 0.0012580449087729443",
            "extra": "mean: 303.714003500005 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.2308431303382945,
            "unit": "iter/sec",
            "range": "stddev: 0.004187043071517724",
            "extra": "mean: 812.4512176666675 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.12067808603340345,
            "unit": "iter/sec",
            "range": "stddev: 0.045024057665543925",
            "extra": "mean: 8.286508618666707 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.2365374152850976,
            "unit": "iter/sec",
            "range": "stddev: 0.001292239673890982",
            "extra": "mean: 808.7098600000218 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 3.0390284262590863,
            "unit": "iter/sec",
            "range": "stddev: 0.0007561710037208143",
            "extra": "mean: 329.0525324999862 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 1.0105596078353996,
            "unit": "iter/sec",
            "range": "stddev: 0.0035107438363876794",
            "extra": "mean: 989.5507323333277 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 2.334136328878338,
            "unit": "iter/sec",
            "range": "stddev: 0.0014838174631898447",
            "extra": "mean: 428.42399033330975 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 3.1719421391986398,
            "unit": "iter/sec",
            "range": "stddev: 0.004203849808495417",
            "extra": "mean: 315.2642627499631 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.225900074866993,
            "unit": "iter/sec",
            "range": "stddev: 0.004571984370820048",
            "extra": "mean: 815.7271710000487 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.2031998561139823,
            "unit": "iter/sec",
            "range": "stddev: 0.01408104463180171",
            "extra": "mean: 831.1171206666662 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 11380.212506488646,
            "unit": "iter/sec",
            "range": "stddev: 0.000003663578696759638",
            "extra": "mean: 87.87182132405971 usec\nrounds: 11574"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 287.99807948661953,
            "unit": "iter/sec",
            "range": "stddev: 0.00003450527072956434",
            "extra": "mean: 3.472245376714258 msec\nrounds: 292"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 26.25163781671895,
            "unit": "iter/sec",
            "range": "stddev: 0.0014950702758257568",
            "extra": "mean: 38.092861366658326 msec\nrounds: 30"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 16.342470635644293,
            "unit": "iter/sec",
            "range": "stddev: 0.0018958329840442435",
            "extra": "mean: 61.190258333334036 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.4591687799192865,
            "unit": "iter/sec",
            "range": "stddev: 0.0010039126101735328",
            "extra": "mean: 183.17806983333185 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 15.995968233987861,
            "unit": "iter/sec",
            "range": "stddev: 0.0019397077455143648",
            "extra": "mean: 62.515753055524534 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 20.42795958782885,
            "unit": "iter/sec",
            "range": "stddev: 0.0021067667863384418",
            "extra": "mean: 48.95251509092511 msec\nrounds: 22"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 16.71358142663973,
            "unit": "iter/sec",
            "range": "stddev: 0.0012645293109192015",
            "extra": "mean: 59.831580944470865 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 16.2591575301246,
            "unit": "iter/sec",
            "range": "stddev: 0.001411906286170076",
            "extra": "mean: 61.50380166667446 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 26.270980311750424,
            "unit": "iter/sec",
            "range": "stddev: 0.0015496007585403032",
            "extra": "mean: 38.06481479310166 msec\nrounds: 29"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 16.755733646129077,
            "unit": "iter/sec",
            "range": "stddev: 0.001499080958161728",
            "extra": "mean: 59.68106327776468 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 16.617802096531747,
            "unit": "iter/sec",
            "range": "stddev: 0.001440679442785246",
            "extra": "mean: 60.17642972223788 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 21636.65646693279,
            "unit": "iter/sec",
            "range": "stddev: 0.0000025684735657361874",
            "extra": "mean: 46.21786187382028 usec\nrounds: 22103"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 45.95792958579957,
            "unit": "iter/sec",
            "range": "stddev: 0.015457803369988027",
            "extra": "mean: 21.759030683335823 msec\nrounds: 60"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 173.12808872440218,
            "unit": "iter/sec",
            "range": "stddev: 0.00003261381000118639",
            "extra": "mean: 5.776070234286895 msec\nrounds: 175"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.167233174964991,
            "unit": "iter/sec",
            "range": "stddev: 0.0006818779625658245",
            "extra": "mean: 70.5854126666812 msec\nrounds: 15"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
            "value": 1.1164362037492965,
            "unit": "iter/sec",
            "range": "stddev: 0.01205287497640659",
            "extra": "mean: 895.7072483333377 msec\nrounds: 3"
          }
        ]
      }
    ]
  }
}