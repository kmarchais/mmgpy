window.BENCHMARK_DATA = {
  "lastUpdate": 1775038444552,
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
          "id": "dae574bdf87df5bfbf0c5d90be9b4ce9f51ef925",
          "message": "ci: skip free-threaded Python 3.14 wheel builds (#214)\n\n* ci: skip free-threaded Python 3.14 wheel builds\n\nVTK has no free-threaded (cp314t) wheels on any platform, causing\npyvista dependency resolution to fail during wheel testing on Windows\nand macOS.\n\n* ci: only skip free-threaded builds on Windows and macOS\n\nVTK 9.6.1 has manylinux wheels that work with free-threaded Python,\nbut no Windows or macOS wheels. Keep cp314t for Linux.",
          "timestamp": "2026-04-01T12:05:22+02:00",
          "tree_id": "a988db53c267b86d35453705a37a8677863169d4",
          "url": "https://github.com/kmarchais/mmgpy/commit/dae574bdf87df5bfbf0c5d90be9b4ce9f51ef925"
        },
        "date": 1775038444090,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 1.1608338997667549,
            "unit": "iter/sec",
            "range": "stddev: 0.022200774613543802",
            "extra": "mean: 861.4496873333289 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.5831672353497769,
            "unit": "iter/sec",
            "range": "stddev: 0.011763364885344914",
            "extra": "mean: 1.7147739780000013 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.1475605261233652,
            "unit": "iter/sec",
            "range": "stddev: 0.018817741609288327",
            "extra": "mean: 871.4137313333291 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.227037382450957,
            "unit": "iter/sec",
            "range": "stddev: 0.002664892965765417",
            "extra": "mean: 814.9710956666544 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 1.1787451031067795,
            "unit": "iter/sec",
            "range": "stddev: 0.01401608562386826",
            "extra": "mean: 848.3598340000166 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.5876220233147741,
            "unit": "iter/sec",
            "range": "stddev: 0.01931584111602473",
            "extra": "mean: 1.701774202333335 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.250726270167153,
            "unit": "iter/sec",
            "range": "stddev: 0.008986963084636139",
            "extra": "mean: 799.5354569999998 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.2110275573547093,
            "unit": "iter/sec",
            "range": "stddev: 0.011402947645054699",
            "extra": "mean: 825.7450410000047 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 60.42885031387857,
            "unit": "iter/sec",
            "range": "stddev: 0.000450792070120323",
            "extra": "mean: 16.548386984127877 msec\nrounds: 63"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.2084462124478,
            "unit": "iter/sec",
            "range": "stddev: 0.003257552415714778",
            "extra": "mean: 827.5089033333339 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 117.30352211861165,
            "unit": "iter/sec",
            "range": "stddev: 0.00008283153282829221",
            "extra": "mean: 8.524893216666147 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 15.311552176343422,
            "unit": "iter/sec",
            "range": "stddev: 0.0007246546827312286",
            "extra": "mean: 65.31016506249543 msec\nrounds: 16"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 1.1728249469749228,
            "unit": "iter/sec",
            "range": "stddev: 0.006885966436826638",
            "extra": "mean: 852.6421633333333 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 17.586249395270563,
            "unit": "iter/sec",
            "range": "stddev: 0.0017027793387589913",
            "extra": "mean: 56.8626076842131 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 376.95563482310075,
            "unit": "iter/sec",
            "range": "stddev: 0.00005172181649040388",
            "extra": "mean: 2.6528320778897068 msec\nrounds: 398"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 30.049754260234955,
            "unit": "iter/sec",
            "range": "stddev: 0.0005194409715541514",
            "extra": "mean: 33.27814235483805 msec\nrounds: 31"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 168.05484829439865,
            "unit": "iter/sec",
            "range": "stddev: 0.00007578243005467536",
            "extra": "mean: 5.9504382655369685 msec\nrounds: 177"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 256.4521094642913,
            "unit": "iter/sec",
            "range": "stddev: 0.00004607084389948469",
            "extra": "mean: 3.8993635189389666 msec\nrounds: 264"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 279.7485079688847,
            "unit": "iter/sec",
            "range": "stddev: 0.000052300491818118204",
            "extra": "mean: 3.57463926174443 msec\nrounds: 298"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 72.44372346260013,
            "unit": "iter/sec",
            "range": "stddev: 0.00020403737784104118",
            "extra": "mean: 13.803818360002728 msec\nrounds: 75"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 869.8964980683935,
            "unit": "iter/sec",
            "range": "stddev: 0.000033262708874703567",
            "extra": "mean: 1.149562048152282 msec\nrounds: 893"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 31.441629286936188,
            "unit": "iter/sec",
            "range": "stddev: 0.0011302960883445698",
            "extra": "mean: 31.80496757575773 msec\nrounds: 33"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 1721.2901024138541,
            "unit": "iter/sec",
            "range": "stddev: 0.00001729099116491898",
            "extra": "mean: 580.959594549256 usec\nrounds: 1798"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 78.57601612596726,
            "unit": "iter/sec",
            "range": "stddev: 0.00035024013337351436",
            "extra": "mean: 12.726529662650163 msec\nrounds: 83"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 92654.48715234877,
            "unit": "iter/sec",
            "range": "stddev: 0.0000011715239750259088",
            "extra": "mean: 10.792785441202998 usec\nrounds: 94706"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
            "value": 26945.770781343715,
            "unit": "iter/sec",
            "range": "stddev: 0.000002128991089582933",
            "extra": "mean: 37.11157524921737 usec\nrounds: 27482"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
            "value": 5886.029585291509,
            "unit": "iter/sec",
            "range": "stddev: 0.000004765499662769107",
            "extra": "mean: 169.89381135611035 usec\nrounds: 6340"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 33.58587818610205,
            "unit": "iter/sec",
            "range": "stddev: 0.000285480454690033",
            "extra": "mean: 29.774418714285794 msec\nrounds: 35"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 33.490967374621086,
            "unit": "iter/sec",
            "range": "stddev: 0.00034699010081835246",
            "extra": "mean: 29.858797114286517 msec\nrounds: 35"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 32.96471631672356,
            "unit": "iter/sec",
            "range": "stddev: 0.00028450982993354676",
            "extra": "mean: 30.33546505882361 msec\nrounds: 34"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 3010.119206786471,
            "unit": "iter/sec",
            "range": "stddev: 0.000013009103179841899",
            "extra": "mean: 332.21275680559353 usec\nrounds: 3306"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 2701.0137323661506,
            "unit": "iter/sec",
            "range": "stddev: 0.000013036828541688836",
            "extra": "mean: 370.2313646232286 usec\nrounds: 2951"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 2039.1497072859358,
            "unit": "iter/sec",
            "range": "stddev: 0.000013446400033914637",
            "extra": "mean: 490.4004823319119 usec\nrounds: 2179"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 124.78444764844946,
            "unit": "iter/sec",
            "range": "stddev: 0.000528133241206997",
            "extra": "mean: 8.013819180554153 msec\nrounds: 144"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 123.18429597249973,
            "unit": "iter/sec",
            "range": "stddev: 0.000477061271717213",
            "extra": "mean: 8.11791788965734 msec\nrounds: 145"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 120.83992815749525,
            "unit": "iter/sec",
            "range": "stddev: 0.0010486021133521632",
            "extra": "mean: 8.27541041481473 msec\nrounds: 135"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 32.36846401100222,
            "unit": "iter/sec",
            "range": "stddev: 0.0015928936967581021",
            "extra": "mean: 30.89426794116936 msec\nrounds: 34"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 33.16948395223363,
            "unit": "iter/sec",
            "range": "stddev: 0.0004395738866073798",
            "extra": "mean: 30.148192882351434 msec\nrounds: 34"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 7020.878898141095,
            "unit": "iter/sec",
            "range": "stddev: 0.000005533404581447153",
            "extra": "mean: 142.43231004379925 usec\nrounds: 7786"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 982784.2974023953,
            "unit": "iter/sec",
            "range": "stddev: 1.101587581306729e-7",
            "extra": "mean: 1.0175172747907222 usec\nrounds: 102062"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3349373.7246800945,
            "unit": "iter/sec",
            "range": "stddev: 4.831205998332316e-8",
            "extra": "mean: 298.5632784515595 nsec\nrounds: 191976"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1607169.919880327,
            "unit": "iter/sec",
            "range": "stddev: 8.848353345179274e-8",
            "extra": "mean: 622.2117447758492 nsec\nrounds: 165810"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 151057.71516036836,
            "unit": "iter/sec",
            "range": "stddev: 0.000001072779949346001",
            "extra": "mean: 6.619986267754438 usec\nrounds: 156202"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 1011.0752166242698,
            "unit": "iter/sec",
            "range": "stddev: 0.000022800067968675913",
            "extra": "mean: 989.0461001890174 usec\nrounds: 1058"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 118.10630872073095,
            "unit": "iter/sec",
            "range": "stddev: 0.00009860338541528694",
            "extra": "mean: 8.466948216666026 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 18.365117129495573,
            "unit": "iter/sec",
            "range": "stddev: 0.0001641050740805617",
            "extra": "mean: 54.451054842113415 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 119.88855360529213,
            "unit": "iter/sec",
            "range": "stddev: 0.00007525093334516656",
            "extra": "mean: 8.341079860653668 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 107.20556181517306,
            "unit": "iter/sec",
            "range": "stddev: 0.00015512673376719092",
            "extra": "mean: 9.327874254547003 msec\nrounds: 110"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 118.50129305354086,
            "unit": "iter/sec",
            "range": "stddev: 0.00007668304444355661",
            "extra": "mean: 8.438726483331987 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 157.15467625595457,
            "unit": "iter/sec",
            "range": "stddev: 0.00009997419621067987",
            "extra": "mean: 6.363157774391139 msec\nrounds: 164"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 1081.3148547302033,
            "unit": "iter/sec",
            "range": "stddev: 0.00004557042548537999",
            "extra": "mean: 924.8000206651263 usec\nrounds: 1355"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 119.68210245676032,
            "unit": "iter/sec",
            "range": "stddev: 0.00004203919490971472",
            "extra": "mean: 8.355468190085379 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 119.27049704668293,
            "unit": "iter/sec",
            "range": "stddev: 0.00012197069265276182",
            "extra": "mean: 8.384303115703426 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 28485.180932393214,
            "unit": "iter/sec",
            "range": "stddev: 0.0000024176469207819286",
            "extra": "mean: 35.10597325582737 usec\nrounds: 28941"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 49.74466479337867,
            "unit": "iter/sec",
            "range": "stddev: 0.015251951963798638",
            "extra": "mean: 20.10265832835819 msec\nrounds: 67"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 3.234829502415601,
            "unit": "iter/sec",
            "range": "stddev: 0.004544721775454996",
            "extra": "mean: 309.13530349999974 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.24368290184352,
            "unit": "iter/sec",
            "range": "stddev: 0.008170229331359063",
            "extra": "mean: 804.0634783333379 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.11787636195848075,
            "unit": "iter/sec",
            "range": "stddev: 0.10775285747774281",
            "extra": "mean: 8.483465076333346 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.2202202695994766,
            "unit": "iter/sec",
            "range": "stddev: 0.01373604166362659",
            "extra": "mean: 819.5241669999783 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 2.88633620438368,
            "unit": "iter/sec",
            "range": "stddev: 0.013003561588346327",
            "extra": "mean: 346.4599856666837 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 1.0139879793854316,
            "unit": "iter/sec",
            "range": "stddev: 0.005196504837413289",
            "extra": "mean: 986.20498500001 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 2.3807132704250025,
            "unit": "iter/sec",
            "range": "stddev: 0.0021153129059700974",
            "extra": "mean: 420.04218333335075 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 3.1700738661528014,
            "unit": "iter/sec",
            "range": "stddev: 0.010250523699470835",
            "extra": "mean: 315.45006274998855 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.258601706216257,
            "unit": "iter/sec",
            "range": "stddev: 0.0019409516394046649",
            "extra": "mean: 794.5325316666754 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.2561203138130697,
            "unit": "iter/sec",
            "range": "stddev: 0.0021341192758558957",
            "extra": "mean: 796.1020843333131 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 10907.570482690344,
            "unit": "iter/sec",
            "range": "stddev: 0.000026623411019708488",
            "extra": "mean: 91.67944425268117 usec\nrounds: 11570"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 289.29370901803543,
            "unit": "iter/sec",
            "range": "stddev: 0.00003317383718371623",
            "extra": "mean: 3.456694593858787 msec\nrounds: 293"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 28.784624532729463,
            "unit": "iter/sec",
            "range": "stddev: 0.0014729821853842074",
            "extra": "mean: 34.740769290318624 msec\nrounds: 31"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 17.860942873459148,
            "unit": "iter/sec",
            "range": "stddev: 0.0013276613119909725",
            "extra": "mean: 55.988085684209395 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.583276596231449,
            "unit": "iter/sec",
            "range": "stddev: 0.0016034619174283545",
            "extra": "mean: 179.1062976666732 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 17.77514654050464,
            "unit": "iter/sec",
            "range": "stddev: 0.0015060916920333605",
            "extra": "mean: 56.2583266315851 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 21.2915821034443,
            "unit": "iter/sec",
            "range": "stddev: 0.003472062106487762",
            "extra": "mean: 46.96691843478517 msec\nrounds: 23"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 17.775426598192002,
            "unit": "iter/sec",
            "range": "stddev: 0.0015417740677112265",
            "extra": "mean: 56.25744026316158 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 17.62340877911618,
            "unit": "iter/sec",
            "range": "stddev: 0.0014312733454556156",
            "extra": "mean: 56.742711500002464 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 29.506348744130168,
            "unit": "iter/sec",
            "range": "stddev: 0.0013575394327829146",
            "extra": "mean: 33.89101134375139 msec\nrounds: 32"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 17.652447940998286,
            "unit": "iter/sec",
            "range": "stddev: 0.002293640842274472",
            "extra": "mean: 56.64936689474512 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 17.905075940220677,
            "unit": "iter/sec",
            "range": "stddev: 0.0014186500439055004",
            "extra": "mean: 55.85008426318215 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 21450.973514799505,
            "unit": "iter/sec",
            "range": "stddev: 0.0000026879555097629114",
            "extra": "mean: 46.61793085102071 usec\nrounds: 21938"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 46.46630230542203,
            "unit": "iter/sec",
            "range": "stddev: 0.015063562083084209",
            "extra": "mean: 21.52097219673347 msec\nrounds: 61"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 172.05322974916845,
            "unit": "iter/sec",
            "range": "stddev: 0.00005518074325377522",
            "extra": "mean: 5.812154770113131 msec\nrounds: 174"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.529155910941105,
            "unit": "iter/sec",
            "range": "stddev: 0.0002593619123743843",
            "extra": "mean: 68.82712293333952 msec\nrounds: 15"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
            "value": 1.170500961266739,
            "unit": "iter/sec",
            "range": "stddev: 0.002680578522237235",
            "extra": "mean: 854.3350523333023 msec\nrounds: 3"
          }
        ]
      }
    ]
  }
}