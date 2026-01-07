window.BENCHMARK_DATA = {
  "lastUpdate": 1767827386160,
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
          "id": "91489f695c0567865b328bd6a72dd7599b3ef7e7",
          "message": "fix(tests): prefix unused unpacked variables with underscore (#102)\n\nRemove RUF059 ignore from tests by fixing 15 violations where unpacked\nvariables were unused. Variables are now prefixed with underscore to\nindicate they are intentionally unused.\n\nCloses #99",
          "timestamp": "2026-01-08T00:03:22+01:00",
          "tree_id": "c9d3df3103cb9d6fe3f8162887b9024e6d18984b",
          "url": "https://github.com/kmarchais/mmgpy/commit/91489f695c0567865b328bd6a72dd7599b3ef7e7"
        },
        "date": 1767827385485,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 0.6309460691166249,
            "unit": "iter/sec",
            "range": "stddev: 0.020143770698557308",
            "extra": "mean: 1.5849215154000091 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.6340976604621498,
            "unit": "iter/sec",
            "range": "stddev: 0.011697045707791247",
            "extra": "mean: 1.5770441405999975 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.180354963672319,
            "unit": "iter/sec",
            "range": "stddev: 0.0024296087661768067",
            "extra": "mean: 847.2027744000002 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.2398739743588576,
            "unit": "iter/sec",
            "range": "stddev: 0.0017384548074396006",
            "extra": "mean: 806.533583800001 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 0.6286346215027807,
            "unit": "iter/sec",
            "range": "stddev: 0.026185015970205658",
            "extra": "mean: 1.5907491661999984 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.630312131502905,
            "unit": "iter/sec",
            "range": "stddev: 0.007127102704559492",
            "extra": "mean: 1.586515553199996 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.2417785132247876,
            "unit": "iter/sec",
            "range": "stddev: 0.002650864164029283",
            "extra": "mean: 805.296588200008 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.2425271833841158,
            "unit": "iter/sec",
            "range": "stddev: 0.0028451947776786633",
            "extra": "mean: 804.8113661999935 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 1.3732355541830192,
            "unit": "iter/sec",
            "range": "stddev: 0.0022395384384617913",
            "extra": "mean: 728.2071869999982 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.3585133647833314,
            "unit": "iter/sec",
            "range": "stddev: 0.007048453107628537",
            "extra": "mean: 736.0987575999957 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 119.81005686329205,
            "unit": "iter/sec",
            "range": "stddev: 0.00014470116201104174",
            "extra": "mean: 8.34654474073941 msec\nrounds: 108"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 1.2792449185026145,
            "unit": "iter/sec",
            "range": "stddev: 0.001326364036831861",
            "extra": "mean: 781.7111371999999 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 1.2693771584721023,
            "unit": "iter/sec",
            "range": "stddev: 0.010173324045105046",
            "extra": "mean: 787.7879267999901 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 16.63921979600831,
            "unit": "iter/sec",
            "range": "stddev: 0.0017182956048866563",
            "extra": "mean: 60.0989717222136 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 371.7947913479903,
            "unit": "iter/sec",
            "range": "stddev: 0.0002235062211525047",
            "extra": "mean: 2.689655754386365 msec\nrounds: 399"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 23.0439188518863,
            "unit": "iter/sec",
            "range": "stddev: 0.0002881394289126248",
            "extra": "mean: 43.39539669565116 msec\nrounds: 23"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 159.34181159617427,
            "unit": "iter/sec",
            "range": "stddev: 0.0005076602302956291",
            "extra": "mean: 6.27581668604557 msec\nrounds: 172"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 251.57299736070846,
            "unit": "iter/sec",
            "range": "stddev: 0.00007645257125644481",
            "extra": "mean: 3.974989408605677 msec\nrounds: 186"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 267.8264078441234,
            "unit": "iter/sec",
            "range": "stddev: 0.00024709494446178146",
            "extra": "mean: 3.733761760274237 msec\nrounds: 292"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 65.04850901180494,
            "unit": "iter/sec",
            "range": "stddev: 0.0002491610335957315",
            "extra": "mean: 15.373142523812822 msec\nrounds: 63"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 930.7953318650701,
            "unit": "iter/sec",
            "range": "stddev: 0.00002119978599604118",
            "extra": "mean: 1.0743500378286834 msec\nrounds: 608"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 27.02344224163282,
            "unit": "iter/sec",
            "range": "stddev: 0.00038900539409620434",
            "extra": "mean: 37.004908222216834 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 1987.0172392864222,
            "unit": "iter/sec",
            "range": "stddev: 0.000015864485108694072",
            "extra": "mean: 503.2668968484239 usec\nrounds: 1047"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 73.30335729641709,
            "unit": "iter/sec",
            "range": "stddev: 0.0006458396391378039",
            "extra": "mean: 13.641939972221136 msec\nrounds: 72"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 90868.6924884401,
            "unit": "iter/sec",
            "range": "stddev: 9.443186552067771e-7",
            "extra": "mean: 11.004890382099592 usec\nrounds: 39957"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_elements_3d",
            "value": 27493.166957505884,
            "unit": "iter/sec",
            "range": "stddev: 0.0000022331202228867966",
            "extra": "mean: 36.372674037357164 usec\nrounds: 20803"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_with_refs",
            "value": 84076.05476616177,
            "unit": "iter/sec",
            "range": "stddev: 9.879350861541455e-7",
            "extra": "mean: 11.893992918450683 usec\nrounds: 36574"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 27.69003938818086,
            "unit": "iter/sec",
            "range": "stddev: 0.0005282546307105166",
            "extra": "mean: 36.11406925000032 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 27.804935531364936,
            "unit": "iter/sec",
            "range": "stddev: 0.00026409295764018374",
            "extra": "mean: 35.96483792857441 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 26.808586717646033,
            "unit": "iter/sec",
            "range": "stddev: 0.00029521834266281314",
            "extra": "mean: 37.30148144444246 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 4065.9911183293084,
            "unit": "iter/sec",
            "range": "stddev: 0.000014514894668876127",
            "extra": "mean: 245.9424949287381 usec\nrounds: 1479"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 3508.100033981089,
            "unit": "iter/sec",
            "range": "stddev: 0.000013989084384672472",
            "extra": "mean: 285.0545851924217 usec\nrounds: 3093"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 2437.3698991367423,
            "unit": "iter/sec",
            "range": "stddev: 0.000018214476261070897",
            "extra": "mean: 410.2783087434435 usec\nrounds: 1464"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 116.33452774873368,
            "unit": "iter/sec",
            "range": "stddev: 0.0005159699041661875",
            "extra": "mean: 8.595900283017096 msec\nrounds: 106"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 115.00338410982579,
            "unit": "iter/sec",
            "range": "stddev: 0.0005035768171971801",
            "extra": "mean: 8.695396294121409 msec\nrounds: 119"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 110.73170593506046,
            "unit": "iter/sec",
            "range": "stddev: 0.0005421681871344166",
            "extra": "mean: 9.03083711711674 msec\nrounds: 111"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 27.004188052522117,
            "unit": "iter/sec",
            "range": "stddev: 0.00038103457060267317",
            "extra": "mean: 37.0312929999983 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 27.025256403175792,
            "unit": "iter/sec",
            "range": "stddev: 0.0002877645408050601",
            "extra": "mean: 37.002424142865415 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 9773.639418111765,
            "unit": "iter/sec",
            "range": "stddev: 0.000008692798151797971",
            "extra": "mean: 102.3160316459881 usec\nrounds: 1738"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 918561.505166893,
            "unit": "iter/sec",
            "range": "stddev: 3.1055421773592174e-7",
            "extra": "mean: 1.0886587282125548 usec\nrounds: 158932"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 2293575.272276318,
            "unit": "iter/sec",
            "range": "stddev: 3.461755038551108e-7",
            "extra": "mean: 436.00051504196944 nsec\nrounds: 188324"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1395598.5415159806,
            "unit": "iter/sec",
            "range": "stddev: 2.0470437676371033e-7",
            "extra": "mean: 716.5384387072671 nsec\nrounds: 3408"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 168661.33664061272,
            "unit": "iter/sec",
            "range": "stddev: 0.0000010269470133591846",
            "extra": "mean: 5.929041118242896 usec\nrounds: 49856"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 1322.971182453344,
            "unit": "iter/sec",
            "range": "stddev: 0.00004405009692195831",
            "extra": "mean: 755.8743631479412 usec\nrounds: 559"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 119.03905047978387,
            "unit": "iter/sec",
            "range": "stddev: 0.0001497641599927053",
            "extra": "mean: 8.40060464166612 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 18.395804731003402,
            "unit": "iter/sec",
            "range": "stddev: 0.00019345948707147668",
            "extra": "mean: 54.360220421053306 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 119.79547031034603,
            "unit": "iter/sec",
            "range": "stddev: 0.00009449364312446364",
            "extra": "mean: 8.34756103389692 msec\nrounds: 118"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 109.05767058459908,
            "unit": "iter/sec",
            "range": "stddev: 0.00027143486624201673",
            "extra": "mean: 9.169460475723916 msec\nrounds: 103"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 119.80538282039257,
            "unit": "iter/sec",
            "range": "stddev: 0.00008689010367033287",
            "extra": "mean: 8.346870369749245 msec\nrounds: 119"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 162.0519015908483,
            "unit": "iter/sec",
            "range": "stddev: 0.00013756089254657317",
            "extra": "mean: 6.170862484075126 msec\nrounds: 157"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 1384.3204422857496,
            "unit": "iter/sec",
            "range": "stddev: 0.000026532037751857497",
            "extra": "mean: 722.3760983756254 usec\nrounds: 1108"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 119.86296279451349,
            "unit": "iter/sec",
            "range": "stddev: 0.0001717445807019868",
            "extra": "mean: 8.342860685951383 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 119.49615860295629,
            "unit": "iter/sec",
            "range": "stddev: 0.00009592283079638021",
            "extra": "mean: 8.368469846153367 msec\nrounds: 117"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 28035.36665070552,
            "unit": "iter/sec",
            "range": "stddev: 0.00000247843410975873",
            "extra": "mean: 35.66923209740988 usec\nrounds: 25653"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 4.507156803863393,
            "unit": "iter/sec",
            "range": "stddev: 0.0005645575973114073",
            "extra": "mean: 221.86936100000594 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 3.1805339698106514,
            "unit": "iter/sec",
            "range": "stddev: 0.0011661361832325048",
            "extra": "mean: 314.4126141999777 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.2401859537100721,
            "unit": "iter/sec",
            "range": "stddev: 0.0041318744405203734",
            "extra": "mean: 806.3306934000138 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.1327085019643126,
            "unit": "iter/sec",
            "range": "stddev: 0.09079114764849422",
            "extra": "mean: 7.535312246000001 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.2396734934564768,
            "unit": "iter/sec",
            "range": "stddev: 0.0020490438988744254",
            "extra": "mean: 806.66401699998 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 2.9550366667981707,
            "unit": "iter/sec",
            "range": "stddev: 0.0016094134625978126",
            "extra": "mean: 338.4052764000103 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 1.0103622701891786,
            "unit": "iter/sec",
            "range": "stddev: 0.003935523108417856",
            "extra": "mean: 989.7440051999979 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 2.3701316105450836,
            "unit": "iter/sec",
            "range": "stddev: 0.0021003553943613287",
            "extra": "mean: 421.9174984000233 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 3.2240150557274894,
            "unit": "iter/sec",
            "range": "stddev: 0.0020323118780753205",
            "extra": "mean: 310.17224879998366 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.2549846336205397,
            "unit": "iter/sec",
            "range": "stddev: 0.00105844932024991",
            "extra": "mean: 796.8225053999845 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.2501587839173263,
            "unit": "iter/sec",
            "range": "stddev: 0.0030805485911929663",
            "extra": "mean: 799.8983911999858 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 11314.771875839606,
            "unit": "iter/sec",
            "range": "stddev: 0.0000033369033994286808",
            "extra": "mean: 88.38004079740189 usec\nrounds: 9976"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 3.9636358700412044,
            "unit": "iter/sec",
            "range": "stddev: 0.0017401800996426039",
            "extra": "mean: 252.2936093999988 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 27.085093916686336,
            "unit": "iter/sec",
            "range": "stddev: 0.0012428487450355569",
            "extra": "mean: 36.92067685185057 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 16.873811696553023,
            "unit": "iter/sec",
            "range": "stddev: 0.001058228290875498",
            "extra": "mean: 59.263432470582785 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.5165775536809445,
            "unit": "iter/sec",
            "range": "stddev: 0.000902303739219281",
            "extra": "mean: 181.27181033333764 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 17.19886652934186,
            "unit": "iter/sec",
            "range": "stddev: 0.0007727161573046318",
            "extra": "mean: 58.14336649999379 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 21.021747192399747,
            "unit": "iter/sec",
            "range": "stddev: 0.0014069379735684657",
            "extra": "mean: 47.569785272726634 msec\nrounds: 22"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 17.10634948861734,
            "unit": "iter/sec",
            "range": "stddev: 0.0008667094820357468",
            "extra": "mean: 58.45782588888445 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 16.470381285238105,
            "unit": "iter/sec",
            "range": "stddev: 0.0012451199374901934",
            "extra": "mean: 60.71504858823573 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 26.687525293778116,
            "unit": "iter/sec",
            "range": "stddev: 0.0012389192242692672",
            "extra": "mean: 37.47069048148643 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 16.958585726095134,
            "unit": "iter/sec",
            "range": "stddev: 0.001138371344333002",
            "extra": "mean: 58.96718135293815 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 17.06880220810176,
            "unit": "iter/sec",
            "range": "stddev: 0.000902641985024744",
            "extra": "mean: 58.586419117643 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 21477.801052442006,
            "unit": "iter/sec",
            "range": "stddev: 0.0000028260980298610097",
            "extra": "mean: 46.55970122631808 usec\nrounds: 18181"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 25.3966754466241,
            "unit": "iter/sec",
            "range": "stddev: 0.014903520497041738",
            "extra": "mean: 39.37523248275895 msec\nrounds: 29"
          }
        ]
      }
    ]
  }
}