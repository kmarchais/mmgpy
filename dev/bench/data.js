window.BENCHMARK_DATA = {
  "lastUpdate": 1768827205453,
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
          "id": "58d41a982db7d85c1d054df71cadd42b3bbd2f49",
          "message": "chore: bump version to 0.6.0.dev0 (#166)",
          "timestamp": "2026-01-19T13:42:35+01:00",
          "tree_id": "5e65bd664aa2d11b103d185ddf7938d4fa3cf6e9",
          "url": "https://github.com/kmarchais/mmgpy/commit/58d41a982db7d85c1d054df71cadd42b3bbd2f49"
        },
        "date": 1768827204308,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 1.131292588197693,
            "unit": "iter/sec",
            "range": "stddev: 0.007700584231316067",
            "extra": "mean: 883.944622666661 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.6132117034242515,
            "unit": "iter/sec",
            "range": "stddev: 0.015386658404461384",
            "extra": "mean: 1.630758177666659 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.1458205201953866,
            "unit": "iter/sec",
            "range": "stddev: 0.008049844361614286",
            "extra": "mean: 872.7370319999844 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.2306691378606807,
            "unit": "iter/sec",
            "range": "stddev: 0.004165388997648249",
            "extra": "mean: 812.5660823333382 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 1.1611544537255185,
            "unit": "iter/sec",
            "range": "stddev: 0.0034869982185330283",
            "extra": "mean: 861.2118713333435 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.6176245076270395,
            "unit": "iter/sec",
            "range": "stddev: 0.03008493720427212",
            "extra": "mean: 1.6191067350000026 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.209223763944497,
            "unit": "iter/sec",
            "range": "stddev: 0.0064601125285486775",
            "extra": "mean: 826.9768010000007 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.2144704346605213,
            "unit": "iter/sec",
            "range": "stddev: 0.0034810239909240006",
            "extra": "mean: 823.4041533333235 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 28.9919099450115,
            "unit": "iter/sec",
            "range": "stddev: 0.0005939496580444114",
            "extra": "mean: 34.49238087096312 msec\nrounds: 31"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.2746208693439691,
            "unit": "iter/sec",
            "range": "stddev: 0.002535146718560484",
            "extra": "mean: 784.5470163333251 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 118.04155822445884,
            "unit": "iter/sec",
            "range": "stddev: 0.00025781277503358403",
            "extra": "mean: 8.47159267500075 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 11.889080584900947,
            "unit": "iter/sec",
            "range": "stddev: 0.0009098880017390201",
            "extra": "mean: 84.1107933333376 msec\nrounds: 12"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 1.1982300450333947,
            "unit": "iter/sec",
            "range": "stddev: 0.0022916061356444387",
            "extra": "mean: 834.5642843333394 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 16.48355615806062,
            "unit": "iter/sec",
            "range": "stddev: 0.0010744969227725089",
            "extra": "mean: 60.666520647062576 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 364.74489241053396,
            "unit": "iter/sec",
            "range": "stddev: 0.00046554007975688227",
            "extra": "mean: 2.741642229425554 msec\nrounds: 401"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 24.549925479680272,
            "unit": "iter/sec",
            "range": "stddev: 0.00034908546388255206",
            "extra": "mean: 40.733321200004866 msec\nrounds: 25"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 163.4567438387959,
            "unit": "iter/sec",
            "range": "stddev: 0.0005746028823664038",
            "extra": "mean: 6.117826505746492 msec\nrounds: 174"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 255.04906804820308,
            "unit": "iter/sec",
            "range": "stddev: 0.00007166323920429315",
            "extra": "mean: 3.9208141698090997 msec\nrounds: 265"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 256.0653371210997,
            "unit": "iter/sec",
            "range": "stddev: 0.0008297606823745568",
            "extra": "mean: 3.90525328903488 msec\nrounds: 301"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 61.86149865599821,
            "unit": "iter/sec",
            "range": "stddev: 0.0002380605544964718",
            "extra": "mean: 16.165143453132913 msec\nrounds: 64"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 912.8520465969651,
            "unit": "iter/sec",
            "range": "stddev: 0.000020665019764749268",
            "extra": "mean: 1.0954677745730155 msec\nrounds: 936"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 25.574186068138243,
            "unit": "iter/sec",
            "range": "stddev: 0.00046258786859702583",
            "extra": "mean: 39.10192869230181 msec\nrounds: 26"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 1944.9413337229896,
            "unit": "iter/sec",
            "range": "stddev: 0.0000195557560810295",
            "extra": "mean: 514.1543257172744 usec\nrounds: 2057"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 64.66354706529216,
            "unit": "iter/sec",
            "range": "stddev: 0.00019764249845674166",
            "extra": "mean: 15.464663560603606 msec\nrounds: 66"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 87863.99245651203,
            "unit": "iter/sec",
            "range": "stddev: 0.0000025343496957531893",
            "extra": "mean: 11.3812265074905 usec\nrounds: 92593"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
            "value": 25778.896008356,
            "unit": "iter/sec",
            "range": "stddev: 0.000002181916636955089",
            "extra": "mean: 38.79142069062456 usec\nrounds: 26302"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
            "value": 6390.8189210113405,
            "unit": "iter/sec",
            "range": "stddev: 0.0000049216856876245065",
            "extra": "mean: 156.474469447454 usec\nrounds: 6546"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 25.918661021241434,
            "unit": "iter/sec",
            "range": "stddev: 0.00030708140585333294",
            "extra": "mean: 38.58223999999297 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 25.786274189153662,
            "unit": "iter/sec",
            "range": "stddev: 0.0004962762277406122",
            "extra": "mean: 38.78032137037558 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 25.669176707779545,
            "unit": "iter/sec",
            "range": "stddev: 0.0002769159816012749",
            "extra": "mean: 38.95722918518577 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 2964.1385281064827,
            "unit": "iter/sec",
            "range": "stddev: 0.000010223957236909428",
            "extra": "mean: 337.3661488887325 usec\nrounds: 3150"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 2659.564120702574,
            "unit": "iter/sec",
            "range": "stddev: 0.000009344800157759286",
            "extra": "mean: 376.00146287724436 usec\nrounds: 2815"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 2040.1894496860127,
            "unit": "iter/sec",
            "range": "stddev: 0.000012087382705974778",
            "extra": "mean: 490.1505593776603 usec\nrounds: 2122"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 98.44549068839842,
            "unit": "iter/sec",
            "range": "stddev: 0.00019002381235483094",
            "extra": "mean: 10.157905588232776 msec\nrounds: 102"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 95.51661614168499,
            "unit": "iter/sec",
            "range": "stddev: 0.00015345213759693555",
            "extra": "mean: 10.469382610002071 msec\nrounds: 100"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 95.5108876062064,
            "unit": "iter/sec",
            "range": "stddev: 0.00016511494177437371",
            "extra": "mean: 10.47001054081942 msec\nrounds: 98"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 25.763497150578086,
            "unit": "iter/sec",
            "range": "stddev: 0.00045037233984794974",
            "extra": "mean: 38.814606346156 msec\nrounds: 26"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 25.83161591515546,
            "unit": "iter/sec",
            "range": "stddev: 0.0004672037391510433",
            "extra": "mean: 38.712251037044034 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 7661.3782489705645,
            "unit": "iter/sec",
            "range": "stddev: 0.000021462318147728938",
            "extra": "mean: 130.5248177942875 usec\nrounds: 7272"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 1047072.8701196469,
            "unit": "iter/sec",
            "range": "stddev: 2.9097896764537175e-7",
            "extra": "mean: 955.0433675984098 nsec\nrounds: 107910"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3313384.6870746613,
            "unit": "iter/sec",
            "range": "stddev: 3.913995373935448e-8",
            "extra": "mean: 301.8061874617056 nsec\nrounds: 192716"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1589005.4345795207,
            "unit": "iter/sec",
            "range": "stddev: 7.147372975602707e-8",
            "extra": "mean: 629.3244681473465 nsec\nrounds: 164990"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 166818.35257512238,
            "unit": "iter/sec",
            "range": "stddev: 8.440060848973597e-7",
            "extra": "mean: 5.994544272637362 usec\nrounds: 174521"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 1264.879983002214,
            "unit": "iter/sec",
            "range": "stddev: 0.000021214115994029835",
            "extra": "mean: 790.5888411851399 usec\nrounds: 1316"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 118.41217775734249,
            "unit": "iter/sec",
            "range": "stddev: 0.0001436585948692339",
            "extra": "mean: 8.445077347105814 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 18.306899750266453,
            "unit": "iter/sec",
            "range": "stddev: 0.0005600213169257199",
            "extra": "mean: 54.62421347369017 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 115.52427855151599,
            "unit": "iter/sec",
            "range": "stddev: 0.00015317928801538574",
            "extra": "mean: 8.656189093222233 msec\nrounds: 118"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 105.43899633962177,
            "unit": "iter/sec",
            "range": "stddev: 0.0005537064686710687",
            "extra": "mean: 9.484157045453788 msec\nrounds: 110"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 116.62823651935096,
            "unit": "iter/sec",
            "range": "stddev: 0.00022107187766343047",
            "extra": "mean: 8.574252941174155 msec\nrounds: 119"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 163.51618457775393,
            "unit": "iter/sec",
            "range": "stddev: 0.0000723095512737008",
            "extra": "mean: 6.115602578315346 msec\nrounds: 166"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 1382.468779191354,
            "unit": "iter/sec",
            "range": "stddev: 0.00001787346940199142",
            "extra": "mean: 723.3436407764152 usec\nrounds: 1442"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 118.02986300675337,
            "unit": "iter/sec",
            "range": "stddev: 0.0002000471032242945",
            "extra": "mean: 8.472432099178006 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 117.16869691308855,
            "unit": "iter/sec",
            "range": "stddev: 0.00009055530690927857",
            "extra": "mean: 8.534702752064941 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 27797.61817875208,
            "unit": "iter/sec",
            "range": "stddev: 0.000002165826224540767",
            "extra": "mean: 35.97430519296718 usec\nrounds: 28405"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 47.42387933130891,
            "unit": "iter/sec",
            "range": "stddev: 0.01632035214886935",
            "extra": "mean: 21.086423424239086 msec\nrounds: 66"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 3.276882658730711,
            "unit": "iter/sec",
            "range": "stddev: 0.0040048331142178975",
            "extra": "mean: 305.16808324999545 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.231811065488889,
            "unit": "iter/sec",
            "range": "stddev: 0.009973175625963681",
            "extra": "mean: 811.8128079999943 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.12704696679620323,
            "unit": "iter/sec",
            "range": "stddev: 0.017353937706483077",
            "extra": "mean: 7.871104877333323 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.236923106670141,
            "unit": "iter/sec",
            "range": "stddev: 0.0007580050242490626",
            "extra": "mean: 808.4576919999904 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 2.9944124025016103,
            "unit": "iter/sec",
            "range": "stddev: 0.002309518744021351",
            "extra": "mean: 333.9553360000025 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 0.9946769178414376,
            "unit": "iter/sec",
            "range": "stddev: 0.00483932497584053",
            "extra": "mean: 1.0053515690000268 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 2.362326730214349,
            "unit": "iter/sec",
            "range": "stddev: 0.0014825793122265332",
            "extra": "mean: 423.3114696667144 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 3.2393031308874964,
            "unit": "iter/sec",
            "range": "stddev: 0.0007327968598994959",
            "extra": "mean: 308.70837325002753 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.240188471111219,
            "unit": "iter/sec",
            "range": "stddev: 0.002049078226090735",
            "extra": "mean: 806.3290566666789 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.23630422284953,
            "unit": "iter/sec",
            "range": "stddev: 0.001983438451578819",
            "extra": "mean: 808.8623993333309 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 11470.052962459476,
            "unit": "iter/sec",
            "range": "stddev: 0.0000029245982034902486",
            "extra": "mean: 87.18355558365043 usec\nrounds: 11604"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 287.4937199791057,
            "unit": "iter/sec",
            "range": "stddev: 0.000023004084883707876",
            "extra": "mean: 3.478336848793349 msec\nrounds: 291"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 26.46779585060719,
            "unit": "iter/sec",
            "range": "stddev: 0.001372180563130003",
            "extra": "mean: 37.78176337932799 msec\nrounds: 29"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 16.697042335317448,
            "unit": "iter/sec",
            "range": "stddev: 0.0011128745463349912",
            "extra": "mean: 59.890846529436416 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.417998385838242,
            "unit": "iter/sec",
            "range": "stddev: 0.0016222730572314846",
            "extra": "mean: 184.57000699997175 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 16.700981988788005,
            "unit": "iter/sec",
            "range": "stddev: 0.0010850642822509793",
            "extra": "mean: 59.87671866668305 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 20.175733722113566,
            "unit": "iter/sec",
            "range": "stddev: 0.0035185852844919862",
            "extra": "mean: 49.56449236361364 msec\nrounds: 22"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 16.703217172330785,
            "unit": "iter/sec",
            "range": "stddev: 0.0020240489061451247",
            "extra": "mean: 59.868706111090994 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 16.490548418808824,
            "unit": "iter/sec",
            "range": "stddev: 0.0015616179733573398",
            "extra": "mean: 60.64079705556777 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 26.10468291479218,
            "unit": "iter/sec",
            "range": "stddev: 0.001377503532373191",
            "extra": "mean: 38.3073030714099 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 16.577109630050035,
            "unit": "iter/sec",
            "range": "stddev: 0.0011326979099772535",
            "extra": "mean: 60.32414711110176 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 16.691238859410824,
            "unit": "iter/sec",
            "range": "stddev: 0.0011699122715822842",
            "extra": "mean: 59.911670333336694 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 21911.144052376127,
            "unit": "iter/sec",
            "range": "stddev: 0.0000024774976504131595",
            "extra": "mean: 45.63887661956913 usec\nrounds: 22305"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 45.99678493052477,
            "unit": "iter/sec",
            "range": "stddev: 0.015391760059047506",
            "extra": "mean: 21.740649950000567 msec\nrounds: 60"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 173.2532762349184,
            "unit": "iter/sec",
            "range": "stddev: 0.000051043829586530634",
            "extra": "mean: 5.771896622861407 msec\nrounds: 175"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.503884843316506,
            "unit": "iter/sec",
            "range": "stddev: 0.00031719627698106233",
            "extra": "mean: 68.9470449333309 msec\nrounds: 15"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
            "value": 1.1444840751473027,
            "unit": "iter/sec",
            "range": "stddev: 0.002031792727958966",
            "extra": "mean: 873.7561506666603 msec\nrounds: 3"
          }
        ]
      }
    ]
  }
}