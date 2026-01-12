window.BENCHMARK_DATA = {
  "lastUpdate": 1768215132518,
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
          "id": "a048becac3ff24f307cf59a247e05024c7b452be",
          "message": "feat(logging): add file logging support and external logger integration (#148)\n\n* feat(logging): add file logging support and external logger integration\n\nAdd the ability to log mmgpy output to a file with rotation support,\nand enable integration with external logging frameworks.\n\nNew functions:\n- set_log_file(): Enable file logging with RotatingFileHandler\n- get_log_file(): Get current log file path\n- configure_logging(): Disable Rich console handler for custom setups\n- get_logger(): Now publicly exported for external logger integration\n\nFeatures:\n- Log rotation with configurable max_bytes and backup_count\n- Different log levels for file and console handlers\n- Auto-creation of parent directories for log files\n- Full compatibility with external loggers (structlog, loguru, etc.)\n\nCloses #121\n\n* fix(logging): flush file handlers in tests for reliable assertions\n\nAdd handler.flush() calls after logging messages in tests to ensure\nfile content is written before reading. This fixes flaky test failures\nin CI where file content wasn't immediately available.\n\nAlso includes minor formatting fixes from pre-commit hooks.\n\n* fix(logging): use NOTSET level for file handler by default\n\nUse logging.NOTSET (0) as default file handler level instead of the\nlogger's current level. This allows the file handler to defer to the\nlogger's level, so changes to set_log_level() affect file output.\n\nPreviously, set_log_file() captured the logger's level at creation\ntime (default WARNING), so subsequent set_log_level(\"INFO\") calls\nwouldn't affect file output.",
          "timestamp": "2026-01-12T11:42:10+01:00",
          "tree_id": "0410343a86a091a51071eae14d993f1e3b76f850",
          "url": "https://github.com/kmarchais/mmgpy/commit/a048becac3ff24f307cf59a247e05024c7b452be"
        },
        "date": 1768215132101,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 0.6131829681643861,
            "unit": "iter/sec",
            "range": "stddev: 0.017144652091869644",
            "extra": "mean: 1.630834599000006 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.609596011453286,
            "unit": "iter/sec",
            "range": "stddev: 0.021941898500272596",
            "extra": "mean: 1.6404306806666682 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.164054508496017,
            "unit": "iter/sec",
            "range": "stddev: 0.0006256093891871781",
            "extra": "mean: 859.0663003333248 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.2311249382455596,
            "unit": "iter/sec",
            "range": "stddev: 0.003862268928077135",
            "extra": "mean: 812.2652453333217 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 0.6173969057948926,
            "unit": "iter/sec",
            "range": "stddev: 0.024567802995744115",
            "extra": "mean: 1.619703614666662 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.6014502094072361,
            "unit": "iter/sec",
            "range": "stddev: 0.02392264810950265",
            "extra": "mean: 1.662648020333317 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.1986455209721427,
            "unit": "iter/sec",
            "range": "stddev: 0.009234172129805913",
            "extra": "mean: 834.275006666663 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.215834801445418,
            "unit": "iter/sec",
            "range": "stddev: 0.002915711095474361",
            "extra": "mean: 822.4801583333298 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 1.197658937033912,
            "unit": "iter/sec",
            "range": "stddev: 0.010872210512817173",
            "extra": "mean: 834.96224933333 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.1751406037321759,
            "unit": "iter/sec",
            "range": "stddev: 0.003632338343760307",
            "extra": "mean: 850.9620013333384 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 115.44821938374442,
            "unit": "iter/sec",
            "range": "stddev: 0.00009706635734964497",
            "extra": "mean: 8.66189193162042 msec\nrounds: 117"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 1.116267934916923,
            "unit": "iter/sec",
            "range": "stddev: 0.010938563111354578",
            "extra": "mean: 895.8422693333242 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 1.1126928245666583,
            "unit": "iter/sec",
            "range": "stddev: 0.018315896254196745",
            "extra": "mean: 898.720633333331 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 15.406674005147316,
            "unit": "iter/sec",
            "range": "stddev: 0.0010232881118219406",
            "extra": "mean: 64.90693576471492 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 357.0317834574989,
            "unit": "iter/sec",
            "range": "stddev: 0.00023654079095738957",
            "extra": "mean: 2.80087108860727 msec\nrounds: 395"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 23.02724368071663,
            "unit": "iter/sec",
            "range": "stddev: 0.0024628301815090422",
            "extra": "mean: 43.426821458332654 msec\nrounds: 24"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 163.16933198869435,
            "unit": "iter/sec",
            "range": "stddev: 0.00024683980566628027",
            "extra": "mean: 6.128602647397538 msec\nrounds: 173"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 235.87274939241794,
            "unit": "iter/sec",
            "range": "stddev: 0.0000776045523307535",
            "extra": "mean: 4.239574103307351 msec\nrounds: 242"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 269.65461439260514,
            "unit": "iter/sec",
            "range": "stddev: 0.00022683767971954218",
            "extra": "mean: 3.7084475719152517 msec\nrounds: 292"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 59.11211956773079,
            "unit": "iter/sec",
            "range": "stddev: 0.00013841091679740944",
            "extra": "mean: 16.9170046229555 msec\nrounds: 61"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 922.9050491632979,
            "unit": "iter/sec",
            "range": "stddev: 0.000024140906360704882",
            "extra": "mean: 1.0835350840333966 msec\nrounds: 952"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 23.699038935144635,
            "unit": "iter/sec",
            "range": "stddev: 0.00039500912298600125",
            "extra": "mean: 42.195803920008075 msec\nrounds: 25"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 1940.890652295976,
            "unit": "iter/sec",
            "range": "stddev: 0.0000166385491484255",
            "extra": "mean: 515.227377089508 usec\nrounds: 2034"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 66.35315666423527,
            "unit": "iter/sec",
            "range": "stddev: 0.0016717154200405863",
            "extra": "mean: 15.070873041659006 msec\nrounds: 72"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 90613.37585222759,
            "unit": "iter/sec",
            "range": "stddev: 0.0000011331095926031837",
            "extra": "mean: 11.035898294207703 usec\nrounds: 92679"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
            "value": 27335.074120047837,
            "unit": "iter/sec",
            "range": "stddev: 0.000004586485840309339",
            "extra": "mean: 36.58303597818267 usec\nrounds: 28045"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
            "value": 6370.940880907521,
            "unit": "iter/sec",
            "range": "stddev: 0.000004638607881010126",
            "extra": "mean: 156.96268709647057 usec\nrounds: 6510"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 25.305468244233023,
            "unit": "iter/sec",
            "range": "stddev: 0.0003794586592410408",
            "extra": "mean: 39.517150615377155 msec\nrounds: 26"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 25.176303163305665,
            "unit": "iter/sec",
            "range": "stddev: 0.0003722661014841895",
            "extra": "mean: 39.71989030770391 msec\nrounds: 26"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 25.32041586348099,
            "unit": "iter/sec",
            "range": "stddev: 0.00030993846709099983",
            "extra": "mean: 39.49382211538932 msec\nrounds: 26"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 3080.540018236836,
            "unit": "iter/sec",
            "range": "stddev: 0.000008075401901271608",
            "extra": "mean: 324.61840913605647 usec\nrounds: 3984"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 2757.6196842260683,
            "unit": "iter/sec",
            "range": "stddev: 0.000008637640946586555",
            "extra": "mean: 362.6315861175948 usec\nrounds: 3414"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 2038.956328726101,
            "unit": "iter/sec",
            "range": "stddev: 0.00001218820449339907",
            "extra": "mean: 490.4469928616764 usec\nrounds: 2101"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 93.24191921171216,
            "unit": "iter/sec",
            "range": "stddev: 0.0004936041494775274",
            "extra": "mean: 10.724789970586421 msec\nrounds: 102"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 94.54380489606321,
            "unit": "iter/sec",
            "range": "stddev: 0.000457624676955242",
            "extra": "mean: 10.577107628568056 msec\nrounds: 105"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 94.76027385660556,
            "unit": "iter/sec",
            "range": "stddev: 0.00040625713736697764",
            "extra": "mean: 10.552945441179642 msec\nrounds: 102"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 25.36573836197443,
            "unit": "iter/sec",
            "range": "stddev: 0.0003458333589447163",
            "extra": "mean: 39.42325611538641 msec\nrounds: 26"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 25.362707643531397,
            "unit": "iter/sec",
            "range": "stddev: 0.00041101267578669195",
            "extra": "mean: 39.42796700000774 msec\nrounds: 26"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 7125.256647314865,
            "unit": "iter/sec",
            "range": "stddev: 0.000005141854196097669",
            "extra": "mean: 140.34582184163816 usec\nrounds: 9413"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 1058449.273788367,
            "unit": "iter/sec",
            "range": "stddev: 9.660531006052605e-8",
            "extra": "mean: 944.7783892569862 nsec\nrounds: 108969"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3455727.365675233,
            "unit": "iter/sec",
            "range": "stddev: 4.152783951467628e-8",
            "extra": "mean: 289.3746798236222 nsec\nrounds: 199243"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1645041.0345611756,
            "unit": "iter/sec",
            "range": "stddev: 7.008379560051438e-8",
            "extra": "mean: 607.8875717934635 nsec\nrounds: 169751"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 154580.45133836396,
            "unit": "iter/sec",
            "range": "stddev: 8.308913231091459e-7",
            "extra": "mean: 6.469123303379945 usec\nrounds: 159185"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 1138.5433385495903,
            "unit": "iter/sec",
            "range": "stddev: 0.0000184343396619437",
            "extra": "mean: 878.3152701713727 usec\nrounds: 1351"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 112.21669661964448,
            "unit": "iter/sec",
            "range": "stddev: 0.0006684275804347262",
            "extra": "mean: 8.911329865549986 msec\nrounds: 119"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 18.13849716720163,
            "unit": "iter/sec",
            "range": "stddev: 0.00031339050387819414",
            "extra": "mean: 55.1313590526242 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 119.20311315776037,
            "unit": "iter/sec",
            "range": "stddev: 0.00008503824832244611",
            "extra": "mean: 8.3890426475401 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 108.07313661994971,
            "unit": "iter/sec",
            "range": "stddev: 0.00008957557257019709",
            "extra": "mean: 9.25299321621989 msec\nrounds: 111"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 118.75869564303412,
            "unit": "iter/sec",
            "range": "stddev: 0.00009215862579473272",
            "extra": "mean: 8.420436032792146 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 156.64178863312765,
            "unit": "iter/sec",
            "range": "stddev: 0.0009208092961246054",
            "extra": "mean: 6.383992475610135 msec\nrounds: 164"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 1154.5851270996577,
            "unit": "iter/sec",
            "range": "stddev: 0.00017006020066525146",
            "extra": "mean: 866.111970896439 usec\nrounds: 1340"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 118.78530775216935,
            "unit": "iter/sec",
            "range": "stddev: 0.0002362956161909916",
            "extra": "mean: 8.418549557377707 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 117.25578824378279,
            "unit": "iter/sec",
            "range": "stddev: 0.0002818292863100067",
            "extra": "mean: 8.528363631149123 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 28617.546636873554,
            "unit": "iter/sec",
            "range": "stddev: 0.0000024223697519531047",
            "extra": "mean: 34.94359641268149 usec\nrounds: 28990"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 42.503662409807426,
            "unit": "iter/sec",
            "range": "stddev: 0.0199406054021492",
            "extra": "mean: 23.527384307693374 msec\nrounds: 65"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 2.8505171862583008,
            "unit": "iter/sec",
            "range": "stddev: 0.03502575137881659",
            "extra": "mean: 350.81353124996895 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.1602322129590883,
            "unit": "iter/sec",
            "range": "stddev: 0.009639903401983445",
            "extra": "mean: 861.8964280000228 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.11550079265208214,
            "unit": "iter/sec",
            "range": "stddev: 0.2628200271235821",
            "extra": "mean: 8.6579492403334 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.2287030985837681,
            "unit": "iter/sec",
            "range": "stddev: 0.0033321353893940213",
            "extra": "mean: 813.8662636666444 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 2.8453229898077916,
            "unit": "iter/sec",
            "range": "stddev: 0.0017847329453271532",
            "extra": "mean: 351.45394866666874 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 0.9910279651729894,
            "unit": "iter/sec",
            "range": "stddev: 0.008217592701211219",
            "extra": "mean: 1.0090532610000007 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 2.2604508804430563,
            "unit": "iter/sec",
            "range": "stddev: 0.003832440517780759",
            "extra": "mean: 442.38961733333326 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 2.9831158706869454,
            "unit": "iter/sec",
            "range": "stddev: 0.01989687387896099",
            "extra": "mean: 335.21996575001367 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.2389082014762947,
            "unit": "iter/sec",
            "range": "stddev: 0.006219755387406877",
            "extra": "mean: 807.1623053333497 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.2348788523686638,
            "unit": "iter/sec",
            "range": "stddev: 0.0009492066073655247",
            "extra": "mean: 809.7960363333337 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 11408.628522496538,
            "unit": "iter/sec",
            "range": "stddev: 0.000003125130286659829",
            "extra": "mean: 87.6529547813843 usec\nrounds: 11544"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 283.92394634588027,
            "unit": "iter/sec",
            "range": "stddev: 0.00016889887993942155",
            "extra": "mean: 3.5220699517249785 msec\nrounds: 290"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 24.52293437684605,
            "unit": "iter/sec",
            "range": "stddev: 0.0013247417691869161",
            "extra": "mean: 40.778154222203334 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 16.492465293049577,
            "unit": "iter/sec",
            "range": "stddev: 0.001007035356052225",
            "extra": "mean: 60.633748941186504 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.444941864083417,
            "unit": "iter/sec",
            "range": "stddev: 0.0006106920369374215",
            "extra": "mean: 183.65669000000176 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 16.539145991935786,
            "unit": "iter/sec",
            "range": "stddev: 0.004785765055910127",
            "extra": "mean: 60.46261399999634 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 20.23695267595885,
            "unit": "iter/sec",
            "range": "stddev: 0.00148996679783638",
            "extra": "mean: 49.4145544545342 msec\nrounds: 22"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 16.586030576813886,
            "unit": "iter/sec",
            "range": "stddev: 0.0015317600183979059",
            "extra": "mean: 60.291701222227964 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 16.783739825579747,
            "unit": "iter/sec",
            "range": "stddev: 0.0008434141344766691",
            "extra": "mean: 59.581476500006325 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 27.12335972148736,
            "unit": "iter/sec",
            "range": "stddev: 0.0007720673127099784",
            "extra": "mean: 36.86858893103096 msec\nrounds: 29"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 16.96412686661253,
            "unit": "iter/sec",
            "range": "stddev: 0.0011459872929079867",
            "extra": "mean: 58.94792038888378 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 16.885315033160367,
            "unit": "iter/sec",
            "range": "stddev: 0.0007706984008594088",
            "extra": "mean: 59.223058500012684 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 21621.69885983489,
            "unit": "iter/sec",
            "range": "stddev: 0.000002456123442541648",
            "extra": "mean: 46.249834783224635 usec\nrounds: 22074"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 47.542562732592806,
            "unit": "iter/sec",
            "range": "stddev: 0.01302559725209992",
            "extra": "mean: 21.033784098358037 msec\nrounds: 61"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 173.06418243141772,
            "unit": "iter/sec",
            "range": "stddev: 0.000017267489082312016",
            "extra": "mean: 5.778203126439998 msec\nrounds: 174"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.354023909836855,
            "unit": "iter/sec",
            "range": "stddev: 0.0000866437691657048",
            "extra": "mean: 69.66687573334032 msec\nrounds: 15"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
            "value": 1.1952578731947645,
            "unit": "iter/sec",
            "range": "stddev: 0.0024598689753923134",
            "extra": "mean: 836.6395423333491 msec\nrounds: 3"
          }
        ]
      }
    ]
  }
}