window.BENCHMARK_DATA = {
  "lastUpdate": 1773932253242,
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
      },
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
          "id": "874d5e80afd307cdfec5a25efead0a42cfdcf99a",
          "message": "ci: add daily docs test against latest PyPI release (#197)\n\n* ci: add daily docs test against latest PyPI release\n\nScheduled workflow that installs the latest released mmgpy from PyPI\nand runs documentation code blocks and examples to catch breakage\nfrom upstream dependency updates.\n\n* ci: test on Python 3.10 and 3.14",
          "timestamp": "2026-03-19T15:40:52+01:00",
          "tree_id": "743fec4ada5dec596e9c73895a21a544918944ca",
          "url": "https://github.com/kmarchais/mmgpy/commit/874d5e80afd307cdfec5a25efead0a42cfdcf99a"
        },
        "date": 1773932252075,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 1.0985957830363602,
            "unit": "iter/sec",
            "range": "stddev: 0.004646597046431664",
            "extra": "mean: 910.2529023333261 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.536359796836907,
            "unit": "iter/sec",
            "range": "stddev: 0.019608477951344752",
            "extra": "mean: 1.8644201259999988 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.1273782222569788,
            "unit": "iter/sec",
            "range": "stddev: 0.01317019093410963",
            "extra": "mean: 887.0137636666678 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.1957966265787798,
            "unit": "iter/sec",
            "range": "stddev: 0.007783655831183794",
            "extra": "mean: 836.2626033333432 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 1.1357781607909343,
            "unit": "iter/sec",
            "range": "stddev: 0.002806389642944868",
            "extra": "mean: 880.4536260000096 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.5410552790858209,
            "unit": "iter/sec",
            "range": "stddev: 0.012893141472861934",
            "extra": "mean: 1.8482399833333527 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.1929349572375567,
            "unit": "iter/sec",
            "range": "stddev: 0.007285066363713076",
            "extra": "mean: 838.2686699999718 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.1893296733673868,
            "unit": "iter/sec",
            "range": "stddev: 0.002826362393503246",
            "extra": "mean: 840.8097623333219 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 27.925206229237872,
            "unit": "iter/sec",
            "range": "stddev: 0.0006336858952620807",
            "extra": "mean: 35.80994144827456 msec\nrounds: 29"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 0.9894009963145365,
            "unit": "iter/sec",
            "range": "stddev: 0.013617399905933036",
            "extra": "mean: 1.0107125459999982 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 113.95608827292999,
            "unit": "iter/sec",
            "range": "stddev: 0.0002386073578469706",
            "extra": "mean: 8.77530999137979 msec\nrounds: 116"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 11.652248628352343,
            "unit": "iter/sec",
            "range": "stddev: 0.001298447243988326",
            "extra": "mean: 85.82034523077307 msec\nrounds: 13"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 0.9293847995498787,
            "unit": "iter/sec",
            "range": "stddev: 0.019225084521263282",
            "extra": "mean: 1.0759805846666761 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 16.679964521271923,
            "unit": "iter/sec",
            "range": "stddev: 0.001782208064881653",
            "extra": "mean: 59.952165888884366 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 359.59952593483575,
            "unit": "iter/sec",
            "range": "stddev: 0.00033979286780941754",
            "extra": "mean: 2.780871296758087 msec\nrounds: 401"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 28.82426317633182,
            "unit": "iter/sec",
            "range": "stddev: 0.0005183423442194975",
            "extra": "mean: 34.6929943666737 msec\nrounds: 30"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 145.64816193742047,
            "unit": "iter/sec",
            "range": "stddev: 0.00032638033480289453",
            "extra": "mean: 6.8658607612889915 msec\nrounds: 155"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 228.38707162708383,
            "unit": "iter/sec",
            "range": "stddev: 0.00006640048332797987",
            "extra": "mean: 4.378531555555059 msec\nrounds: 243"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 269.73493815625164,
            "unit": "iter/sec",
            "range": "stddev: 0.00026641712271237023",
            "extra": "mean: 3.70734324161122 msec\nrounds: 298"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 71.34641458597754,
            "unit": "iter/sec",
            "range": "stddev: 0.0002085198700794616",
            "extra": "mean: 14.016121283781239 msec\nrounds: 74"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 862.182237430699,
            "unit": "iter/sec",
            "range": "stddev: 0.00006754451313202251",
            "extra": "mean: 1.1598476013377375 msec\nrounds: 898"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 34.103621991098294,
            "unit": "iter/sec",
            "range": "stddev: 0.0007859044114950579",
            "extra": "mean: 29.322398666658327 msec\nrounds: 36"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 1694.479643047422,
            "unit": "iter/sec",
            "range": "stddev: 0.000022607120530871907",
            "extra": "mean: 590.1516752373365 usec\nrounds: 1789"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 74.8856294822533,
            "unit": "iter/sec",
            "range": "stddev: 0.00024036049950563448",
            "extra": "mean: 13.353696923079001 msec\nrounds: 78"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 93187.97171709215,
            "unit": "iter/sec",
            "range": "stddev: 0.0000010485462000898154",
            "extra": "mean: 10.730998664032347 usec\nrounds: 95058"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
            "value": 27109.99384994084,
            "unit": "iter/sec",
            "range": "stddev: 0.000002258970168876855",
            "extra": "mean: 36.88676602197688 usec\nrounds: 27665"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
            "value": 6391.959494105561,
            "unit": "iter/sec",
            "range": "stddev: 0.000005385354896447386",
            "extra": "mean: 156.44654834283048 usec\nrounds: 6547"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 35.97098896186063,
            "unit": "iter/sec",
            "range": "stddev: 0.0007719737939007252",
            "extra": "mean: 27.800180891892673 msec\nrounds: 37"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 35.28945968966404,
            "unit": "iter/sec",
            "range": "stddev: 0.000843023899596988",
            "extra": "mean: 28.337073131581292 msec\nrounds: 38"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 33.10924830028518,
            "unit": "iter/sec",
            "range": "stddev: 0.0007233938644308714",
            "extra": "mean: 30.20304148648964 msec\nrounds: 37"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 3143.871296823015,
            "unit": "iter/sec",
            "range": "stddev: 0.00004109494142074868",
            "extra": "mean: 318.07917868983145 usec\nrounds: 3923"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 2864.8052570722884,
            "unit": "iter/sec",
            "range": "stddev: 0.000040627834827532206",
            "extra": "mean: 349.0638665687029 usec\nrounds: 3410"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 2010.5076475251803,
            "unit": "iter/sec",
            "range": "stddev: 0.00002136628022087808",
            "extra": "mean: 497.38681731996525 usec\nrounds: 2425"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 116.76941866398299,
            "unit": "iter/sec",
            "range": "stddev: 0.00023275784544156945",
            "extra": "mean: 8.563886087997162 msec\nrounds: 125"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 117.17468409276137,
            "unit": "iter/sec",
            "range": "stddev: 0.00011310471717466",
            "extra": "mean: 8.53426666128965 msec\nrounds: 124"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 114.12220415644482,
            "unit": "iter/sec",
            "range": "stddev: 0.00021761756821437442",
            "extra": "mean: 8.762536680672119 msec\nrounds: 119"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 33.68854934399661,
            "unit": "iter/sec",
            "range": "stddev: 0.0007828387822756198",
            "extra": "mean: 29.683676485707824 msec\nrounds: 35"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 34.17283207614552,
            "unit": "iter/sec",
            "range": "stddev: 0.0003370413411437793",
            "extra": "mean: 29.26301214285526 msec\nrounds: 35"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 8524.913701632215,
            "unit": "iter/sec",
            "range": "stddev: 0.000015885964149309118",
            "extra": "mean: 117.3032402437735 usec\nrounds: 9353"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 964903.1269873374,
            "unit": "iter/sec",
            "range": "stddev: 1.2848289467135528e-7",
            "extra": "mean: 1.036373468000092 usec\nrounds: 100211"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3269494.835960484,
            "unit": "iter/sec",
            "range": "stddev: 4.5050105367324646e-8",
            "extra": "mean: 305.8576477935402 nsec\nrounds: 191571"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1557644.170418125,
            "unit": "iter/sec",
            "range": "stddev: 2.223573883498144e-7",
            "extra": "mean: 641.9951481804511 nsec\nrounds: 178222"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 153577.96494104876,
            "unit": "iter/sec",
            "range": "stddev: 9.658554006447964e-7",
            "extra": "mean: 6.51135076821634 usec\nrounds: 170329"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 996.8329420515705,
            "unit": "iter/sec",
            "range": "stddev: 0.0000204419657654074",
            "extra": "mean: 1.003177120071806 msec\nrounds: 1116"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 113.6461066230465,
            "unit": "iter/sec",
            "range": "stddev: 0.00015924626766800867",
            "extra": "mean: 8.799245567795001 msec\nrounds: 118"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 17.66222593469364,
            "unit": "iter/sec",
            "range": "stddev: 0.0033049071327865332",
            "extra": "mean: 56.618005210527585 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 116.25109710496054,
            "unit": "iter/sec",
            "range": "stddev: 0.00006643678308362245",
            "extra": "mean: 8.602069355931516 msec\nrounds: 118"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 105.08322724409065,
            "unit": "iter/sec",
            "range": "stddev: 0.00016051448249107566",
            "extra": "mean: 9.516266546298281 msec\nrounds: 108"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 113.20490802219294,
            "unit": "iter/sec",
            "range": "stddev: 0.0001283338288893475",
            "extra": "mean: 8.833539264957999 msec\nrounds: 117"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 154.7520241302369,
            "unit": "iter/sec",
            "range": "stddev: 0.00009560897802302106",
            "extra": "mean: 6.461951018866258 msec\nrounds: 159"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 1021.5893603849925,
            "unit": "iter/sec",
            "range": "stddev: 0.000018928431850287957",
            "extra": "mean: 978.8668899440609 usec\nrounds: 1054"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 113.5153788056572,
            "unit": "iter/sec",
            "range": "stddev: 0.00008728317663947672",
            "extra": "mean: 8.809379050851245 msec\nrounds: 118"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 114.18894101446453,
            "unit": "iter/sec",
            "range": "stddev: 0.00009064160043538475",
            "extra": "mean: 8.757415482759649 msec\nrounds: 116"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 28511.09536257551,
            "unit": "iter/sec",
            "range": "stddev: 0.000002476903962668791",
            "extra": "mean: 35.074064580227564 usec\nrounds: 29297"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 47.998873928956385,
            "unit": "iter/sec",
            "range": "stddev: 0.016479958967168768",
            "extra": "mean: 20.83382209091217 msec\nrounds: 66"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 3.306595860281221,
            "unit": "iter/sec",
            "range": "stddev: 0.0018098351787175268",
            "extra": "mean: 302.4258307499821 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.217519237881468,
            "unit": "iter/sec",
            "range": "stddev: 0.002908758012710375",
            "extra": "mean: 821.3422579999966 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.11732746933812004,
            "unit": "iter/sec",
            "range": "stddev: 0.14314978718522392",
            "extra": "mean: 8.523153236333352 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.2079696279390943,
            "unit": "iter/sec",
            "range": "stddev: 0.004492683334112678",
            "extra": "mean: 827.8353833333464 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 3.0192591567120837,
            "unit": "iter/sec",
            "range": "stddev: 0.0007810886659373191",
            "extra": "mean: 331.2070769999688 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 0.9517796841478859,
            "unit": "iter/sec",
            "range": "stddev: 0.013835388652901674",
            "extra": "mean: 1.0506633169999684 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 2.3624701600234643,
            "unit": "iter/sec",
            "range": "stddev: 0.0006930101533677881",
            "extra": "mean: 423.28576966663906 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 3.1581032431289606,
            "unit": "iter/sec",
            "range": "stddev: 0.0059047580209758465",
            "extra": "mean: 316.6457595000054 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.2208423967096378,
            "unit": "iter/sec",
            "range": "stddev: 0.0037330892534445164",
            "extra": "mean: 819.1065469999709 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.2031605878421574,
            "unit": "iter/sec",
            "range": "stddev: 0.0025611404188169537",
            "extra": "mean: 831.1442463333 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 11415.816619829011,
            "unit": "iter/sec",
            "range": "stddev: 0.0000036887503292690963",
            "extra": "mean: 87.59776311254186 usec\nrounds: 11592"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 285.9803479591263,
            "unit": "iter/sec",
            "range": "stddev: 0.000043039627873997625",
            "extra": "mean: 3.496743769760448 msec\nrounds: 291"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 24.794611994091795,
            "unit": "iter/sec",
            "range": "stddev: 0.0011398041341729652",
            "extra": "mean: 40.33134296428135 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 16.24402820313194,
            "unit": "iter/sec",
            "range": "stddev: 0.0015735426441115864",
            "extra": "mean: 61.561084941184376 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.414149354165598,
            "unit": "iter/sec",
            "range": "stddev: 0.0007895253379739002",
            "extra": "mean: 184.70122166663336 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 16.383113820122478,
            "unit": "iter/sec",
            "range": "stddev: 0.001000793539100633",
            "extra": "mean: 61.038457705869995 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 20.793471008885696,
            "unit": "iter/sec",
            "range": "stddev: 0.0023222256135994",
            "extra": "mean: 48.09201886364566 msec\nrounds: 22"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 16.702296857816474,
            "unit": "iter/sec",
            "range": "stddev: 0.0012555165355546975",
            "extra": "mean: 59.87200494116544 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 16.101805983206383,
            "unit": "iter/sec",
            "range": "stddev: 0.0009400056734839032",
            "extra": "mean: 62.10483476468198 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 25.73124106878371,
            "unit": "iter/sec",
            "range": "stddev: 0.0011887527371793763",
            "extra": "mean: 38.863263428562995 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 16.328233923427398,
            "unit": "iter/sec",
            "range": "stddev: 0.0009870507318919157",
            "extra": "mean: 61.24361058823524 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 16.661313648851195,
            "unit": "iter/sec",
            "range": "stddev: 0.0017469868374013137",
            "extra": "mean: 60.01927705556101 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 21579.789422881466,
            "unit": "iter/sec",
            "range": "stddev: 0.0000028378313903560345",
            "extra": "mean: 46.339655146944146 usec\nrounds: 22137"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 44.29357239995051,
            "unit": "iter/sec",
            "range": "stddev: 0.017151155810205602",
            "extra": "mean: 22.576639133336585 msec\nrounds: 60"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 172.06220839529934,
            "unit": "iter/sec",
            "range": "stddev: 0.000074309916697089",
            "extra": "mean: 5.81185147701103 msec\nrounds: 174"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.100300040284527,
            "unit": "iter/sec",
            "range": "stddev: 0.0008308920774568643",
            "extra": "mean: 70.92047666666683 msec\nrounds: 15"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
            "value": 1.104559502739856,
            "unit": "iter/sec",
            "range": "stddev: 0.006566300325438569",
            "extra": "mean: 905.3382796666938 msec\nrounds: 3"
          }
        ]
      }
    ]
  }
}