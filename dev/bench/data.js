window.BENCHMARK_DATA = {
  "lastUpdate": 1768080483907,
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
          "id": "81c5b0224b9aa8ee0b168a922d54b945ee1d815e",
          "message": "fix: add type validation for option casting in C++ bindings (#138)\n\nAdd safe_cast<T>() helper function that wraps pybind11 cast operations\nwith proper error handling. When users pass incorrect types to options\n(e.g., hmax=\"0.1\" instead of hmax=0.1), they now get clear error\nmessages indicating the parameter name, expected type, and actual type.\n\nCloses #108",
          "timestamp": "2026-01-10T22:18:26+01:00",
          "tree_id": "3575bbf2f9778a49ef53dafd85f627c107d615cf",
          "url": "https://github.com/kmarchais/mmgpy/commit/81c5b0224b9aa8ee0b168a922d54b945ee1d815e"
        },
        "date": 1768080483529,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 0.6318497716156546,
            "unit": "iter/sec",
            "range": "stddev: 0.01260724392527256",
            "extra": "mean: 1.582654683000006 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.6280958099224363,
            "unit": "iter/sec",
            "range": "stddev: 0.012256338002279026",
            "extra": "mean: 1.5921137893333348 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.191680505632508,
            "unit": "iter/sec",
            "range": "stddev: 0.00356656145554702",
            "extra": "mean: 839.1510940000065 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.2484980916496615,
            "unit": "iter/sec",
            "range": "stddev: 0.0009586477031491939",
            "extra": "mean: 800.9623776666596 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 0.6277840967816117,
            "unit": "iter/sec",
            "range": "stddev: 0.015957246888107977",
            "extra": "mean: 1.592904320333351 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.627941563079118,
            "unit": "iter/sec",
            "range": "stddev: 0.013417094443587444",
            "extra": "mean: 1.592504874333353 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.245166375675811,
            "unit": "iter/sec",
            "range": "stddev: 0.0036646968429821995",
            "extra": "mean: 803.105528333314 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.2441723955147592,
            "unit": "iter/sec",
            "range": "stddev: 0.0005970348227425017",
            "extra": "mean: 803.7471363333566 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 1.3219557764099006,
            "unit": "iter/sec",
            "range": "stddev: 0.0019520843386996293",
            "extra": "mean: 756.4549569999599 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.3164387430044402,
            "unit": "iter/sec",
            "range": "stddev: 0.0022044197111084087",
            "extra": "mean: 759.6251669999864 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 121.515608705193,
            "unit": "iter/sec",
            "range": "stddev: 0.00011095161766386424",
            "extra": "mean: 8.22939547154048 msec\nrounds: 123"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 1.24698453265076,
            "unit": "iter/sec",
            "range": "stddev: 0.002482037498844259",
            "extra": "mean: 801.9345659999999 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 1.2401574413769376,
            "unit": "iter/sec",
            "range": "stddev: 0.001263096036843832",
            "extra": "mean: 806.3492316666725 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 17.323551736132533,
            "unit": "iter/sec",
            "range": "stddev: 0.0008154247740736408",
            "extra": "mean: 57.72488316666921 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 372.5136119150561,
            "unit": "iter/sec",
            "range": "stddev: 0.00012046767425225498",
            "extra": "mean: 2.684465662500486 msec\nrounds: 400"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 24.362956013117795,
            "unit": "iter/sec",
            "range": "stddev: 0.00022743452323118504",
            "extra": "mean: 41.04592231999959 msec\nrounds: 25"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 164.9208315500812,
            "unit": "iter/sec",
            "range": "stddev: 0.00007877096257496787",
            "extra": "mean: 6.063515388571952 msec\nrounds: 175"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 258.8492407544987,
            "unit": "iter/sec",
            "range": "stddev: 0.00005092896069013436",
            "extra": "mean: 3.863252590910373 msec\nrounds: 264"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 272.84770247405754,
            "unit": "iter/sec",
            "range": "stddev: 0.00016358868394735605",
            "extra": "mean: 3.665048270271143 msec\nrounds: 296"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 64.12620465590528,
            "unit": "iter/sec",
            "range": "stddev: 0.0012787351527823595",
            "extra": "mean: 15.594248955881588 msec\nrounds: 68"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 920.0790219220199,
            "unit": "iter/sec",
            "range": "stddev: 0.000017182235647998896",
            "extra": "mean: 1.0868631673734146 msec\nrounds: 944"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 27.3521564341983,
            "unit": "iter/sec",
            "range": "stddev: 0.0002453022393635971",
            "extra": "mean: 36.56018867856809 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 1994.310731242804,
            "unit": "iter/sec",
            "range": "stddev: 0.000016392141846078728",
            "extra": "mean: 501.4263747038182 usec\nrounds: 2103"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 73.3621712343176,
            "unit": "iter/sec",
            "range": "stddev: 0.00038384600033632545",
            "extra": "mean: 13.631003324670095 msec\nrounds: 77"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 90783.45596395672,
            "unit": "iter/sec",
            "range": "stddev: 9.412034025463126e-7",
            "extra": "mean: 11.015222866124692 usec\nrounds: 92679"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_elements_3d",
            "value": 25718.21154855024,
            "unit": "iter/sec",
            "range": "stddev: 0.000002027263457495252",
            "extra": "mean: 38.882952576707105 usec\nrounds: 26253"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_with_refs",
            "value": 85489.82156376414,
            "unit": "iter/sec",
            "range": "stddev: 9.981436603989479e-7",
            "extra": "mean: 11.69729894984202 usec\nrounds: 87329"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 27.33743294394876,
            "unit": "iter/sec",
            "range": "stddev: 0.0003601193315403618",
            "extra": "mean: 36.579879392858416 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 27.46334253114823,
            "unit": "iter/sec",
            "range": "stddev: 0.0003187501159261578",
            "extra": "mean: 36.4121737500024 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 27.21352501774146,
            "unit": "iter/sec",
            "range": "stddev: 0.00026944443147923643",
            "extra": "mean: 36.746433964290354 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 3913.523365670355,
            "unit": "iter/sec",
            "range": "stddev: 0.00001245348413827427",
            "extra": "mean: 255.5242186036388 usec\nrounds: 4053"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 3391.247174797916,
            "unit": "iter/sec",
            "range": "stddev: 0.000012133995653161643",
            "extra": "mean: 294.87676611469345 usec\nrounds: 3506"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 2385.9297197839187,
            "unit": "iter/sec",
            "range": "stddev: 0.000012802857167052205",
            "extra": "mean: 419.1238290499876 usec\nrounds: 2451"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 104.31728652099723,
            "unit": "iter/sec",
            "range": "stddev: 0.0005847545757767643",
            "extra": "mean: 9.586138916666679 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 107.66977456187854,
            "unit": "iter/sec",
            "range": "stddev: 0.0004940351332286689",
            "extra": "mean: 9.287657600000761 msec\nrounds: 105"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 105.01454778648912,
            "unit": "iter/sec",
            "range": "stddev: 0.0005086455902157532",
            "extra": "mean: 9.522490179485944 msec\nrounds: 117"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 26.148490326670185,
            "unit": "iter/sec",
            "range": "stddev: 0.000633663527157186",
            "extra": "mean: 38.24312560714255 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 27.120084860063425,
            "unit": "iter/sec",
            "range": "stddev: 0.0003919308130165311",
            "extra": "mean: 36.87304096428485 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 9312.221903288331,
            "unit": "iter/sec",
            "range": "stddev: 0.00000531635718365648",
            "extra": "mean: 107.38575716788708 usec\nrounds: 9661"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 1061967.7749494126,
            "unit": "iter/sec",
            "range": "stddev: 9.248113065439712e-8",
            "extra": "mean: 941.6481588131387 nsec\nrounds: 109087"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3353195.247175888,
            "unit": "iter/sec",
            "range": "stddev: 3.93185100411561e-8",
            "extra": "mean: 298.22301604483516 nsec\nrounds: 193088"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1632384.8928670045,
            "unit": "iter/sec",
            "range": "stddev: 6.915001792275444e-8",
            "extra": "mean: 612.6006215627684 nsec\nrounds: 168606"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 153094.76690807217,
            "unit": "iter/sec",
            "range": "stddev: 9.870035648029102e-7",
            "extra": "mean: 6.531901907531977 usec\nrounds: 169177"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 1328.189212808922,
            "unit": "iter/sec",
            "range": "stddev: 0.000021928652030352593",
            "extra": "mean: 752.9047746782622 usec\nrounds: 1398"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 117.79518847777486,
            "unit": "iter/sec",
            "range": "stddev: 0.00008304108590660055",
            "extra": "mean: 8.489311090908235 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 17.87961938343378,
            "unit": "iter/sec",
            "range": "stddev: 0.0001243299300145118",
            "extra": "mean: 55.92960222221185 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 119.16714789431731,
            "unit": "iter/sec",
            "range": "stddev: 0.00006976955241246507",
            "extra": "mean: 8.391574504131324 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 104.29870413510848,
            "unit": "iter/sec",
            "range": "stddev: 0.00009745490078670744",
            "extra": "mean: 9.587846831774637 msec\nrounds: 107"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 117.58166066979706,
            "unit": "iter/sec",
            "range": "stddev: 0.00040898650343623407",
            "extra": "mean: 8.50472764463062 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 157.42383204113904,
            "unit": "iter/sec",
            "range": "stddev: 0.00013121402970661528",
            "extra": "mean: 6.3522783496889685 msec\nrounds: 163"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 1398.3370723613075,
            "unit": "iter/sec",
            "range": "stddev: 0.000019489667706049338",
            "extra": "mean: 715.135155725612 usec\nrounds: 1432"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 119.56897247142012,
            "unit": "iter/sec",
            "range": "stddev: 0.00005757883432717432",
            "extra": "mean: 8.363373702479748 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 119.33480218495643,
            "unit": "iter/sec",
            "range": "stddev: 0.00006747558371576976",
            "extra": "mean: 8.379785122952688 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 27867.404326300933,
            "unit": "iter/sec",
            "range": "stddev: 0.000002158108231090905",
            "extra": "mean: 35.884217571573814 usec\nrounds: 28478"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 48.20777618148751,
            "unit": "iter/sec",
            "range": "stddev: 0.0152349753758972",
            "extra": "mean: 20.74354137878724 msec\nrounds: 66"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 3.259829390863381,
            "unit": "iter/sec",
            "range": "stddev: 0.001898512390441205",
            "extra": "mean: 306.76452049999625 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.2455109631193253,
            "unit": "iter/sec",
            "range": "stddev: 0.006013248275909945",
            "extra": "mean: 802.8833383333259 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.13508376805979613,
            "unit": "iter/sec",
            "range": "stddev: 0.30811275825930295",
            "extra": "mean: 7.402813930666639 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.2489756474186053,
            "unit": "iter/sec",
            "range": "stddev: 0.003944982589447375",
            "extra": "mean: 800.6561233333969 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 3.01606673149535,
            "unit": "iter/sec",
            "range": "stddev: 0.00033159536953457624",
            "extra": "mean: 331.5576507500566 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 1.0182434701209373,
            "unit": "iter/sec",
            "range": "stddev: 0.0020534050460905835",
            "extra": "mean: 982.0833910000223 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 2.375229029083993,
            "unit": "iter/sec",
            "range": "stddev: 0.0013324472986751942",
            "extra": "mean: 421.01203199998355 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 3.181697425554387,
            "unit": "iter/sec",
            "range": "stddev: 0.003080449318395697",
            "extra": "mean: 314.29764249998016 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.2576256255568552,
            "unit": "iter/sec",
            "range": "stddev: 0.0010544135163613572",
            "extra": "mean: 795.1491919999777 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.2515721545395968,
            "unit": "iter/sec",
            "range": "stddev: 0.0026849826570233513",
            "extra": "mean: 798.9950850000014 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 11395.95539063854,
            "unit": "iter/sec",
            "range": "stddev: 0.0000036253949892708955",
            "extra": "mean: 87.75043124699067 usec\nrounds: 11585"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 289.1284977722311,
            "unit": "iter/sec",
            "range": "stddev: 0.000024791782032582975",
            "extra": "mean: 3.4586697876726675 msec\nrounds: 292"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 27.527095780603286,
            "unit": "iter/sec",
            "range": "stddev: 0.001308320270466649",
            "extra": "mean: 36.32784249999379 msec\nrounds: 30"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 17.123927814869173,
            "unit": "iter/sec",
            "range": "stddev: 0.0016716854845327072",
            "extra": "mean: 58.397816833336144 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.499435058159348,
            "unit": "iter/sec",
            "range": "stddev: 0.0013309546691179664",
            "extra": "mean: 181.83685950001896 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 17.183675934020258,
            "unit": "iter/sec",
            "range": "stddev: 0.001388538003433779",
            "extra": "mean: 58.19476599999184 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 21.02078767353865,
            "unit": "iter/sec",
            "range": "stddev: 0.0021026484169098672",
            "extra": "mean: 47.571956652167614 msec\nrounds: 23"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 17.47146125132884,
            "unit": "iter/sec",
            "range": "stddev: 0.001470194660767499",
            "extra": "mean: 57.236197111099806 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 17.029204926563978,
            "unit": "iter/sec",
            "range": "stddev: 0.001419573032517493",
            "extra": "mean: 58.72264761111031 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 27.85038892497005,
            "unit": "iter/sec",
            "range": "stddev: 0.0013668868066954042",
            "extra": "mean: 35.90614130000252 msec\nrounds: 30"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 17.32928721562038,
            "unit": "iter/sec",
            "range": "stddev: 0.0014044450120722913",
            "extra": "mean: 57.70577794443928 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 17.273822311802338,
            "unit": "iter/sec",
            "range": "stddev: 0.0013991761338377497",
            "extra": "mean: 57.89106672220138 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 21221.579747492604,
            "unit": "iter/sec",
            "range": "stddev: 0.000002528139508683101",
            "extra": "mean: 47.121845399758854 usec\nrounds: 21727"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 45.85987340063351,
            "unit": "iter/sec",
            "range": "stddev: 0.014975697631226264",
            "extra": "mean: 21.805555180319928 msec\nrounds: 61"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 173.14357947341813,
            "unit": "iter/sec",
            "range": "stddev: 0.00002594189220325317",
            "extra": "mean: 5.775553462861873 msec\nrounds: 175"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.585476371294693,
            "unit": "iter/sec",
            "range": "stddev: 0.0004967153709032183",
            "extra": "mean: 68.56135340002159 msec\nrounds: 15"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
            "value": 1.1664094023721012,
            "unit": "iter/sec",
            "range": "stddev: 0.00953026186128609",
            "extra": "mean: 857.3319093333112 msec\nrounds: 3"
          }
        ]
      }
    ]
  }
}