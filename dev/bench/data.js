window.BENCHMARK_DATA = {
  "lastUpdate": 1773931863380,
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
          "id": "8a0714be349ad1c2e7e9d0d02fbc9eb0b4208433",
          "message": "docs: add conda-forge badge and install instructions (#198)\n\nAdd conda-forge badge, installation instructions, and a comparison\ntable explaining when to use PyPI vs conda-forge. Update both the\nREADME and the docs installation page.",
          "timestamp": "2026-03-19T15:40:30+01:00",
          "tree_id": "0061edb31836ec02b5e458b09ad121f8c9e2e7e4",
          "url": "https://github.com/kmarchais/mmgpy/commit/8a0714be349ad1c2e7e9d0d02fbc9eb0b4208433"
        },
        "date": 1773931862296,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 1.108000037417905,
            "unit": "iter/sec",
            "range": "stddev: 0.019244322560683955",
            "extra": "mean: 902.5270453333292 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.5593236873349657,
            "unit": "iter/sec",
            "range": "stddev: 0.016352507057436738",
            "extra": "mean: 1.7878735026666657 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.1697221008856395,
            "unit": "iter/sec",
            "range": "stddev: 0.001598301449443223",
            "extra": "mean: 854.9039120000069 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.2026497197146904,
            "unit": "iter/sec",
            "range": "stddev: 0.011080013081739316",
            "extra": "mean: 831.4973043333301 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 1.0929054492311647,
            "unit": "iter/sec",
            "range": "stddev: 0.005398757454486287",
            "extra": "mean: 914.9922353333295 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.5445227079026858,
            "unit": "iter/sec",
            "range": "stddev: 0.029393128510451783",
            "extra": "mean: 1.836470702666664 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.2124616272566515,
            "unit": "iter/sec",
            "range": "stddev: 0.000907643557288132",
            "extra": "mean: 824.7683699999868 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.2073624527719584,
            "unit": "iter/sec",
            "range": "stddev: 0.003825221092082808",
            "extra": "mean: 828.2516966666643 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 29.234340439764214,
            "unit": "iter/sec",
            "range": "stddev: 0.000809349041498731",
            "extra": "mean: 34.206347225806105 msec\nrounds: 31"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.0488493710725957,
            "unit": "iter/sec",
            "range": "stddev: 0.002634202233473379",
            "extra": "mean: 953.4257516666665 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 117.38662416863762,
            "unit": "iter/sec",
            "range": "stddev: 0.000295431203424356",
            "extra": "mean: 8.518858150000122 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 11.568898252990888,
            "unit": "iter/sec",
            "range": "stddev: 0.002149362984994143",
            "extra": "mean: 86.43865458333266 msec\nrounds: 12"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 0.9994833970165714,
            "unit": "iter/sec",
            "range": "stddev: 0.005793458912883663",
            "extra": "mean: 1.0005168700000127 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 16.488928913147575,
            "unit": "iter/sec",
            "range": "stddev: 0.001957545183403065",
            "extra": "mean: 60.64675305881404 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 367.93703944009656,
            "unit": "iter/sec",
            "range": "stddev: 0.0002328445952112762",
            "extra": "mean: 2.7178562982453114 msec\nrounds: 399"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 27.88024063082627,
            "unit": "iter/sec",
            "range": "stddev: 0.0010427211183128772",
            "extra": "mean: 35.86769616666553 msec\nrounds: 30"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 145.3851612843499,
            "unit": "iter/sec",
            "range": "stddev: 0.0007734104638281296",
            "extra": "mean: 6.878281051283917 msec\nrounds: 156"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 232.05213995006227,
            "unit": "iter/sec",
            "range": "stddev: 0.0005388817466269576",
            "extra": "mean: 4.309376333332674 msec\nrounds: 240"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 268.8348855718943,
            "unit": "iter/sec",
            "range": "stddev: 0.00025041266961058875",
            "extra": "mean: 3.719755335594535 msec\nrounds: 295"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 69.33183482351852,
            "unit": "iter/sec",
            "range": "stddev: 0.0006289678201271832",
            "extra": "mean: 14.423388657540379 msec\nrounds: 73"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 878.2056938221305,
            "unit": "iter/sec",
            "range": "stddev: 0.00004063760853097278",
            "extra": "mean: 1.138685398004875 msec\nrounds: 902"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 30.533251540100174,
            "unit": "iter/sec",
            "range": "stddev: 0.00048228402047217303",
            "extra": "mean: 32.75117943749528 msec\nrounds: 32"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 1697.4179750096384,
            "unit": "iter/sec",
            "range": "stddev: 0.00002510823197613859",
            "extra": "mean: 589.1300874166375 usec\nrounds: 1796"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 69.92692585898344,
            "unit": "iter/sec",
            "range": "stddev: 0.00034665424401963046",
            "extra": "mean: 14.300642960004097 msec\nrounds: 75"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 92794.50121084967,
            "unit": "iter/sec",
            "range": "stddev: 0.0000011505520090878726",
            "extra": "mean: 10.776500621817863 usec\nrounds: 94886"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
            "value": 26936.54369033411,
            "unit": "iter/sec",
            "range": "stddev: 0.000002149565977228498",
            "extra": "mean: 37.12428778896526 usec\nrounds: 27475"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
            "value": 6256.86840030099,
            "unit": "iter/sec",
            "range": "stddev: 0.00001854427028420852",
            "extra": "mean: 159.82436196866382 usec\nrounds: 6542"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 32.027252584554404,
            "unit": "iter/sec",
            "range": "stddev: 0.0006573599825780782",
            "extra": "mean: 31.22340879411755 msec\nrounds: 34"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 30.95280172066547,
            "unit": "iter/sec",
            "range": "stddev: 0.0016921354975269027",
            "extra": "mean: 32.30725312120471 msec\nrounds: 33"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 31.08437664237031,
            "unit": "iter/sec",
            "range": "stddev: 0.0007252010319128492",
            "extra": "mean: 32.17050196969129 msec\nrounds: 33"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 2894.6397244026357,
            "unit": "iter/sec",
            "range": "stddev: 0.000011055188909365701",
            "extra": "mean: 345.4661357576612 usec\nrounds: 3079"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 2580.44672999428,
            "unit": "iter/sec",
            "range": "stddev: 0.000011687968317192924",
            "extra": "mean: 387.5297979905273 usec\nrounds: 2787"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 1994.4000204928718,
            "unit": "iter/sec",
            "range": "stddev: 0.000011824095016446978",
            "extra": "mean: 501.40392585479026 usec\nrounds: 2077"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 119.40569456909162,
            "unit": "iter/sec",
            "range": "stddev: 0.00019771048218012547",
            "extra": "mean: 8.374809958677229 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 118.88918644532599,
            "unit": "iter/sec",
            "range": "stddev: 0.0001630583888196801",
            "extra": "mean: 8.41119390164112 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 121.72375035665273,
            "unit": "iter/sec",
            "range": "stddev: 0.00020675161432399456",
            "extra": "mean: 8.215323608334302 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 34.431012239194416,
            "unit": "iter/sec",
            "range": "stddev: 0.0010323649878806716",
            "extra": "mean: 29.043584111118687 msec\nrounds: 36"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 32.104204597784396,
            "unit": "iter/sec",
            "range": "stddev: 0.0017240877305891836",
            "extra": "mean: 31.148568000000004 msec\nrounds: 35"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 8899.476158363683,
            "unit": "iter/sec",
            "range": "stddev: 0.000005226917007957041",
            "extra": "mean: 112.36616427813058 usec\nrounds: 9210"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 972817.9769958446,
            "unit": "iter/sec",
            "range": "stddev: 1.0072406982106727e-7",
            "extra": "mean: 1.0279415303241992 usec\nrounds: 101338"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3352858.6847360884,
            "unit": "iter/sec",
            "range": "stddev: 4.4108150876575897e-8",
            "extra": "mean: 298.2529518922186 nsec\nrounds: 193462"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1523401.5951269178,
            "unit": "iter/sec",
            "range": "stddev: 7.389035331900577e-8",
            "extra": "mean: 656.4257272664125 nsec\nrounds: 157953"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 155674.74722026283,
            "unit": "iter/sec",
            "range": "stddev: 9.220490776299475e-7",
            "extra": "mean: 6.423649421990766 usec\nrounds: 169463"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 1179.8458289837488,
            "unit": "iter/sec",
            "range": "stddev: 0.000022567881133476928",
            "extra": "mean: 847.5683648102925 usec\nrounds: 1239"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 112.92661919839021,
            "unit": "iter/sec",
            "range": "stddev: 0.00021072049581796862",
            "extra": "mean: 8.855308049585666 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 18.14944521611608,
            "unit": "iter/sec",
            "range": "stddev: 0.00030560345878356593",
            "extra": "mean: 55.09810289473942 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 110.94204258574958,
            "unit": "iter/sec",
            "range": "stddev: 0.00019364631578280665",
            "extra": "mean: 9.013715420167046 msec\nrounds: 119"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 101.03540077898829,
            "unit": "iter/sec",
            "range": "stddev: 0.0001712236355559906",
            "extra": "mean: 9.89752099056318 msec\nrounds: 106"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 111.66090885722242,
            "unit": "iter/sec",
            "range": "stddev: 0.00015194568211261995",
            "extra": "mean: 8.955685657893678 msec\nrounds: 114"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 153.3206649578097,
            "unit": "iter/sec",
            "range": "stddev: 0.0001445275497277307",
            "extra": "mean: 6.522278000002001 msec\nrounds: 158"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 1009.7567386255524,
            "unit": "iter/sec",
            "range": "stddev: 0.000037859178139885626",
            "extra": "mean: 990.3375355149074 usec\nrounds: 1253"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 111.2849545191022,
            "unit": "iter/sec",
            "range": "stddev: 0.00019320998473692954",
            "extra": "mean: 8.985940681032032 msec\nrounds: 116"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 113.49839397008598,
            "unit": "iter/sec",
            "range": "stddev: 0.00022767262600662536",
            "extra": "mean: 8.810697358973762 msec\nrounds: 117"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 28213.808837261633,
            "unit": "iter/sec",
            "range": "stddev: 0.000002311820922549747",
            "extra": "mean: 35.443637041990314 usec\nrounds: 29075"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 45.22107322677875,
            "unit": "iter/sec",
            "range": "stddev: 0.018842228564276933",
            "extra": "mean: 22.113583969692826 msec\nrounds: 66"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 2.988346574220093,
            "unit": "iter/sec",
            "range": "stddev: 0.0039113781884375235",
            "extra": "mean: 334.63320775000227 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.1514278829349984,
            "unit": "iter/sec",
            "range": "stddev: 0.01578435050282067",
            "extra": "mean: 868.4868716666756 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.11318351932517455,
            "unit": "iter/sec",
            "range": "stddev: 0.3004772643937118",
            "extra": "mean: 8.83520857066668 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.1390970334530308,
            "unit": "iter/sec",
            "range": "stddev: 0.009488907823034312",
            "extra": "mean: 877.8883366666529 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 2.6601346787704863,
            "unit": "iter/sec",
            "range": "stddev: 0.007895504377866689",
            "extra": "mean: 375.92081633332936 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 0.9204201292410226,
            "unit": "iter/sec",
            "range": "stddev: 0.013225793229013747",
            "extra": "mean: 1.0864603763333587 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 2.2117759748029235,
            "unit": "iter/sec",
            "range": "stddev: 0.002456047316967812",
            "extra": "mean: 452.12535599999154 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 2.940321341544983,
            "unit": "iter/sec",
            "range": "stddev: 0.011634119523224148",
            "extra": "mean: 340.0988816666389 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.178576334858407,
            "unit": "iter/sec",
            "range": "stddev: 0.010895053264946638",
            "extra": "mean: 848.4813163333532 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.1649017877787442,
            "unit": "iter/sec",
            "range": "stddev: 0.006469590012466167",
            "extra": "mean: 858.4414673333262 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 11331.284395345305,
            "unit": "iter/sec",
            "range": "stddev: 0.0000053558240961852205",
            "extra": "mean: 88.25124894145121 usec\nrounds: 11569"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 287.4695540674417,
            "unit": "iter/sec",
            "range": "stddev: 0.00003823536396789693",
            "extra": "mean: 3.4786292525621527 msec\nrounds: 293"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 24.161583478158597,
            "unit": "iter/sec",
            "range": "stddev: 0.002094401898278452",
            "extra": "mean: 41.38801585185724 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 15.5648021691201,
            "unit": "iter/sec",
            "range": "stddev: 0.002034820383366089",
            "extra": "mean: 64.2475239411624 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.343576870446094,
            "unit": "iter/sec",
            "range": "stddev: 0.0021961024469209552",
            "extra": "mean: 187.14056600003914 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 15.638179104186607,
            "unit": "iter/sec",
            "range": "stddev: 0.0023095729158349367",
            "extra": "mean: 63.94606388235336 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 20.37141312265521,
            "unit": "iter/sec",
            "range": "stddev: 0.0021728749703166694",
            "extra": "mean: 49.0883962727108 msec\nrounds: 22"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 15.781293375055357,
            "unit": "iter/sec",
            "range": "stddev: 0.0024905577390857314",
            "extra": "mean: 63.36616247060245 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 15.197657719113115,
            "unit": "iter/sec",
            "range": "stddev: 0.0020188659082934256",
            "extra": "mean: 65.79961323529245 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 24.827117539416008,
            "unit": "iter/sec",
            "range": "stddev: 0.0019834904102812184",
            "extra": "mean: 40.27853811109489 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 16.157962553460333,
            "unit": "iter/sec",
            "range": "stddev: 0.0023938051414897003",
            "extra": "mean: 61.88899105882897 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 15.860500294477548,
            "unit": "iter/sec",
            "range": "stddev: 0.002209098792754391",
            "extra": "mean: 63.049713529414255 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 21717.28242668351,
            "unit": "iter/sec",
            "range": "stddev: 0.000002730655146676421",
            "extra": "mean: 46.04627689380342 usec\nrounds: 22236"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 41.40973864214417,
            "unit": "iter/sec",
            "range": "stddev: 0.020244258682403125",
            "extra": "mean: 24.148908754093515 msec\nrounds: 61"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 170.86781689073177,
            "unit": "iter/sec",
            "range": "stddev: 0.00003202589716542015",
            "extra": "mean: 5.852477184977963 msec\nrounds: 173"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 13.934574280933468,
            "unit": "iter/sec",
            "range": "stddev: 0.0007268964403260095",
            "extra": "mean: 71.76394339999965 msec\nrounds: 15"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
            "value": 1.0593739795082935,
            "unit": "iter/sec",
            "range": "stddev: 0.020360744608373775",
            "extra": "mean: 943.9537116667225 msec\nrounds: 3"
          }
        ]
      }
    ]
  }
}