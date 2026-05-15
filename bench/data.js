window.BENCHMARK_DATA = {
  "lastUpdate": 1778888698284,
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
          "id": "c6af64fbe546a1356e7dde41e1c76871a4e97b47",
          "message": "fix: use same-job relative benchmark comparison for PRs (#219)\n\n* fix: use same-job relative benchmark comparison for PRs\n\nRun baseline (main) and PR benchmarks in the same CI job so hardware\nvariance cancels out. Compare by ratio (threshold: 1.3x) instead of\nabsolute times against historical data from different machines.\n\nCloses #213\n\n* fix: read benchmark summary from file to avoid JS template literal breakage\n\nBenchmark names with backticks in the markdown broke the JS template\nliteral in the github-script step. Write to a file and read with\nfs.readFileSync instead.\n\n* fix: store benchmark data outside mike's deployment path\n\nMove benchmark-data-dir-path from dev/bench to bench so docs deploys\nvia mike don't overwrite the accumulated trend data.\n\nCloses #220\n\n* feat: add benchmark trends page to docs\n\nIntegrate benchmark trend charts into the docs site using Chart.js.\nLoads data from bench/data.js on gh-pages and renders interactive\nline charts grouped by benchmark category. Supports dark mode.\n\n* feat: deploy PR docs previews at /pr-XXX/ and clean up on close\n\n* refactor: simplify PR docs preview with inline cleanup\n\nInstead of a separate cleanup job triggered on PR close, the build job\nnow cleans up stale previews on every PR run by checking versions.json\nfor pr-* entries whose PRs are closed or merged.\n\n* fix: resolve benchmark data URL from canonical link\n\n* fix: remove continue-on-error, use uv run python, pin chart.js\n\n- Remove continue-on-error on compare step so regressions fail the check\n- Use uv run python instead of bare python3 for consistency\n- Pin chart.js to 4.4.8 with full UMD path",
          "timestamp": "2026-04-03T16:11:55Z",
          "tree_id": "de35108fa89845c28a6bc7bc1fced90ea96a2290",
          "url": "https://github.com/kmarchais/mmgpy/commit/c6af64fbe546a1356e7dde41e1c76871a4e97b47"
        },
        "date": 1775233333573,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 1.15777272517065,
            "unit": "iter/sec",
            "range": "stddev: 0.0061980625396864195",
            "extra": "mean: 863.7273777999951 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.5826745033209866,
            "unit": "iter/sec",
            "range": "stddev: 0.017340812747927998",
            "extra": "mean: 1.7162240569999938 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.168286361275761,
            "unit": "iter/sec",
            "range": "stddev: 0.0038218950890069447",
            "extra": "mean: 855.954527199998 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.229910041801644,
            "unit": "iter/sec",
            "range": "stddev: 0.003568360223568941",
            "extra": "mean: 813.0675952000047 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 1.1720565881007143,
            "unit": "iter/sec",
            "range": "stddev: 0.02023504629582309",
            "extra": "mean: 853.2011253999883 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.5879647402056187,
            "unit": "iter/sec",
            "range": "stddev: 0.02927938636508205",
            "extra": "mean: 1.7007822605999934 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.2245948446631505,
            "unit": "iter/sec",
            "range": "stddev: 0.006683742814571529",
            "extra": "mean: 816.5966109999999 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.2343413980641498,
            "unit": "iter/sec",
            "range": "stddev: 0.004835934870177417",
            "extra": "mean: 810.1486359999967 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 59.88877103906332,
            "unit": "iter/sec",
            "range": "stddev: 0.0004014124178985248",
            "extra": "mean: 16.69762098386917 msec\nrounds: 62"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.2320842812555581,
            "unit": "iter/sec",
            "range": "stddev: 0.004016755081934952",
            "extra": "mean: 811.6327877999936 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 118.52180365027625,
            "unit": "iter/sec",
            "range": "stddev: 0.00008003233190255941",
            "extra": "mean: 8.437266133332837 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 15.494325699029655,
            "unit": "iter/sec",
            "range": "stddev: 0.0005020060957913701",
            "extra": "mean: 64.53975600000624 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 1.1577752331349964,
            "unit": "iter/sec",
            "range": "stddev: 0.0010781204446903647",
            "extra": "mean: 863.7255067999888 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 17.36381140273708,
            "unit": "iter/sec",
            "range": "stddev: 0.0014082393046845223",
            "extra": "mean: 57.591042473679984 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 367.14322987117043,
            "unit": "iter/sec",
            "range": "stddev: 0.00023377270601618154",
            "extra": "mean: 2.723732643390693 msec\nrounds: 401"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 28.847387349342142,
            "unit": "iter/sec",
            "range": "stddev: 0.000339859765786806",
            "extra": "mean: 34.66518433333287 msec\nrounds: 30"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 166.76756826893975,
            "unit": "iter/sec",
            "range": "stddev: 0.00007883083854664034",
            "extra": "mean: 5.996369740112405 msec\nrounds: 177"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 259.6255414717835,
            "unit": "iter/sec",
            "range": "stddev: 0.000060042767404337164",
            "extra": "mean: 3.85170116287916 msec\nrounds: 264"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 272.38592480222036,
            "unit": "iter/sec",
            "range": "stddev: 0.0002798601505223031",
            "extra": "mean: 3.671261651005282 msec\nrounds: 298"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 74.31055097845932,
            "unit": "iter/sec",
            "range": "stddev: 0.00026714549030544527",
            "extra": "mean: 13.457039233767407 msec\nrounds: 77"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 812.1989140383484,
            "unit": "iter/sec",
            "range": "stddev: 0.00003730796204952817",
            "extra": "mean: 1.2312254827181222 msec\nrounds: 839"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 32.75938843050896,
            "unit": "iter/sec",
            "range": "stddev: 0.0003019137423458904",
            "extra": "mean: 30.525600382353158 msec\nrounds: 34"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 1693.7244361706805,
            "unit": "iter/sec",
            "range": "stddev: 0.000017624001784477557",
            "extra": "mean: 590.4148152109601 usec\nrounds: 1775"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 79.37009811399025,
            "unit": "iter/sec",
            "range": "stddev: 0.0004066196089482754",
            "extra": "mean: 12.599203273804875 msec\nrounds: 84"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 89352.50101939763,
            "unit": "iter/sec",
            "range": "stddev: 0.0000012260530411717984",
            "extra": "mean: 11.19162853407885 usec\nrounds: 92851"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
            "value": 26388.215811647628,
            "unit": "iter/sec",
            "range": "stddev: 0.000002451954517974922",
            "extra": "mean: 37.89570341313508 usec\nrounds: 27422"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
            "value": 6116.296369706226,
            "unit": "iter/sec",
            "range": "stddev: 0.000008389389572207498",
            "extra": "mean: 163.49763640508993 usec\nrounds: 6565"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 34.023362972362996,
            "unit": "iter/sec",
            "range": "stddev: 0.00031519197238915074",
            "extra": "mean: 29.391568399993112 msec\nrounds: 35"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 34.29674355849596,
            "unit": "iter/sec",
            "range": "stddev: 0.00021242847660205035",
            "extra": "mean: 29.157287142857058 msec\nrounds: 35"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 33.83794657789329,
            "unit": "iter/sec",
            "range": "stddev: 0.00016504590763911862",
            "extra": "mean: 29.552620685715933 msec\nrounds: 35"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 3182.344196482838,
            "unit": "iter/sec",
            "range": "stddev: 0.000011901464459754807",
            "extra": "mean: 314.2337655069527 usec\nrounds: 3305"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 2863.9896581757034,
            "unit": "iter/sec",
            "range": "stddev: 0.00001090059306857418",
            "extra": "mean: 349.1632719920425 usec\nrounds: 2967"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 2150.0564174520423,
            "unit": "iter/sec",
            "range": "stddev: 0.000018155573938248647",
            "extra": "mean: 465.104074424738 usec\nrounds: 2217"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 136.16363389541647,
            "unit": "iter/sec",
            "range": "stddev: 0.0004655155426263528",
            "extra": "mean: 7.34410481999968 msec\nrounds: 150"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 133.08390948131552,
            "unit": "iter/sec",
            "range": "stddev: 0.0005171879524982222",
            "extra": "mean: 7.514056386661802 msec\nrounds: 150"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 132.85593814104524,
            "unit": "iter/sec",
            "range": "stddev: 0.000423263000355709",
            "extra": "mean: 7.526949972972676 msec\nrounds: 148"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 34.52519994632307,
            "unit": "iter/sec",
            "range": "stddev: 0.0002246390079083325",
            "extra": "mean: 28.9643507222179 msec\nrounds: 36"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 34.6186884404127,
            "unit": "iter/sec",
            "range": "stddev: 0.0002892845816545699",
            "extra": "mean: 28.886131885708114 msec\nrounds: 35"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 7472.7532561590715,
            "unit": "iter/sec",
            "range": "stddev: 0.000005955764015809648",
            "extra": "mean: 133.81948603425334 usec\nrounds: 7769"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 1008917.5751983089,
            "unit": "iter/sec",
            "range": "stddev: 1.1511327240641174e-7",
            "extra": "mean: 991.1612450634966 nsec\nrounds: 106758"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3434059.3074684143,
            "unit": "iter/sec",
            "range": "stddev: 4.552083470148597e-8",
            "extra": "mean: 291.20056191958986 nsec\nrounds: 195313"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1668714.5927919452,
            "unit": "iter/sec",
            "range": "stddev: 8.237501887100309e-8",
            "extra": "mean: 599.2636513874363 nsec\nrounds: 177905"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 136454.81953648914,
            "unit": "iter/sec",
            "range": "stddev: 0.0000015130525116318478",
            "extra": "mean: 7.328432981677072 usec\nrounds: 158203"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 1058.3580529526757,
            "unit": "iter/sec",
            "range": "stddev: 0.000020376674047227406",
            "extra": "mean: 944.8598205589642 usec\nrounds: 1109"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 118.41597694884838,
            "unit": "iter/sec",
            "range": "stddev: 0.00007384879385332651",
            "extra": "mean: 8.444806400000951 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 18.222477149346744,
            "unit": "iter/sec",
            "range": "stddev: 0.0004185208262005605",
            "extra": "mean: 54.87728105263937 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 118.60029696667375,
            "unit": "iter/sec",
            "range": "stddev: 0.00005501193461464906",
            "extra": "mean: 8.431682091664545 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 107.45382509754414,
            "unit": "iter/sec",
            "range": "stddev: 0.00016492342817970497",
            "extra": "mean: 9.30632296330282 msec\nrounds: 109"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 116.34184206861406,
            "unit": "iter/sec",
            "range": "stddev: 0.00006334843668099771",
            "extra": "mean: 8.595359865543795 msec\nrounds: 119"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 157.816708631284,
            "unit": "iter/sec",
            "range": "stddev: 0.00011058190025920454",
            "extra": "mean: 6.336464679011625 msec\nrounds: 162"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 1088.8908162107314,
            "unit": "iter/sec",
            "range": "stddev: 0.00001932759578545916",
            "extra": "mean: 918.36572144114 usec\nrounds: 1138"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 117.6486957551994,
            "unit": "iter/sec",
            "range": "stddev: 0.00015517099941992726",
            "extra": "mean: 8.499881733332398 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 118.11072610092236,
            "unit": "iter/sec",
            "range": "stddev: 0.0001109729215029096",
            "extra": "mean: 8.466631550004422 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 28021.512391488526,
            "unit": "iter/sec",
            "range": "stddev: 0.0000032530913366585543",
            "extra": "mean: 35.68686750482989 usec\nrounds: 29186"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 67.91298229265047,
            "unit": "iter/sec",
            "range": "stddev: 0.00012448594807792747",
            "extra": "mean: 14.724725173911557 msec\nrounds: 69"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 3.279938876003711,
            "unit": "iter/sec",
            "range": "stddev: 0.002054749042117715",
            "extra": "mean: 304.8837304000017 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.2364581398214605,
            "unit": "iter/sec",
            "range": "stddev: 0.0027392127189296753",
            "extra": "mean: 808.7617103999946 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.12331666780839681,
            "unit": "iter/sec",
            "range": "stddev: 0.1110628274187096",
            "extra": "mean: 8.109203871400007 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.242455051612326,
            "unit": "iter/sec",
            "range": "stddev: 0.004274163560193272",
            "extra": "mean: 804.8580901999685 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 3.0624574451629947,
            "unit": "iter/sec",
            "range": "stddev: 0.0038473559965397633",
            "extra": "mean: 326.5351496000221 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 1.0141927951095744,
            "unit": "iter/sec",
            "range": "stddev: 0.002526045130534809",
            "extra": "mean: 986.0058214000219 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 2.376872588942374,
            "unit": "iter/sec",
            "range": "stddev: 0.005327369646123075",
            "extra": "mean: 420.72091059999366 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 3.114202179335471,
            "unit": "iter/sec",
            "range": "stddev: 0.002157342448577139",
            "extra": "mean: 321.10953060002885 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.2193323896911692,
            "unit": "iter/sec",
            "range": "stddev: 0.006119193988664362",
            "extra": "mean: 820.12091900001 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.2307840295649606,
            "unit": "iter/sec",
            "range": "stddev: 0.0025941739872819055",
            "extra": "mean: 812.490230599974 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 11339.700763764591,
            "unit": "iter/sec",
            "range": "stddev: 0.000004240503280768882",
            "extra": "mean: 88.18574853363386 usec\nrounds: 11592"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 287.6028136750245,
            "unit": "iter/sec",
            "range": "stddev: 0.0000328085035926051",
            "extra": "mean: 3.4770174436817074 msec\nrounds: 293"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 27.2963270815667,
            "unit": "iter/sec",
            "range": "stddev: 0.0019426739356264466",
            "extra": "mean: 36.63496546666541 msec\nrounds: 30"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 17.110043631541966,
            "unit": "iter/sec",
            "range": "stddev: 0.001767741481243084",
            "extra": "mean: 58.445204555558426 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.491789055479145,
            "unit": "iter/sec",
            "range": "stddev: 0.0020764621411740064",
            "extra": "mean: 182.09002383336306 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 16.537710992862028,
            "unit": "iter/sec",
            "range": "stddev: 0.0020087644275103393",
            "extra": "mean: 60.467860421047256 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 20.798644660485362,
            "unit": "iter/sec",
            "range": "stddev: 0.0023790758136258846",
            "extra": "mean: 48.080055999988595 msec\nrounds: 23"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 16.822333547586076,
            "unit": "iter/sec",
            "range": "stddev: 0.001224731116134166",
            "extra": "mean: 59.44478494444638 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 16.411812627889553,
            "unit": "iter/sec",
            "range": "stddev: 0.0017048590182293902",
            "extra": "mean: 60.931721722233256 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 27.333916189192905,
            "unit": "iter/sec",
            "range": "stddev: 0.0014732808030494399",
            "extra": "mean: 36.58458572414052 msec\nrounds: 29"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 16.779142072213197,
            "unit": "iter/sec",
            "range": "stddev: 0.0017175093318600768",
            "extra": "mean: 59.59780277777327 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 16.815391345172397,
            "unit": "iter/sec",
            "range": "stddev: 0.0016196612673004295",
            "extra": "mean: 59.46932661112846 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 17684.439644722253,
            "unit": "iter/sec",
            "range": "stddev: 0.0000033846091482607937",
            "extra": "mean: 56.546886420483226 usec\nrounds: 18093"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 60.32080663657179,
            "unit": "iter/sec",
            "range": "stddev: 0.0004231506571089897",
            "extra": "mean: 16.57802764516932 msec\nrounds: 62"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 172.049615110467,
            "unit": "iter/sec",
            "range": "stddev: 0.00002574336409041812",
            "extra": "mean: 5.812276879305631 msec\nrounds: 174"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.379265816504928,
            "unit": "iter/sec",
            "range": "stddev: 0.000152113002284414",
            "extra": "mean: 69.54457986666966 msec\nrounds: 15"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
            "value": 1.1429200975085037,
            "unit": "iter/sec",
            "range": "stddev: 0.0030473205490857314",
            "extra": "mean: 874.951802999999 msec\nrounds: 5"
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
          "id": "7651d9e34f2a7276caf919de813d8894d411205b",
          "message": "refactor: rewrite unified mmg CLI to use Python API directly (#221)\n\n* refactor: rewrite unified `mmg` CLI to use Python API directly\n\nThe `mmg` command now reads the mesh once, auto-detects its type, and\nremeshes via the Python API instead of spawning a subprocess that\nre-reads the same file. This eliminates the double-read overhead and\nsubprocess startup cost.\n\n- Add `_parse_args()` for structured CLI argument parsing\n- Add `_default_output_path()` for MMG output naming convention\n- Remove `mmg3d`, `mmg2d`, `mmgs` entry points (only `mmg` remains)\n- Remove `_run_mmg3d`, `_run_mmg2d`, `_run_mmgs` subprocess wrappers\n- Support all MMG flags: sizing, geometry, modes, boolean options\n\n* fix: improve CLI error handling and fix Windows path test\n\n- Error if both -sol and -met are specified (second overwrites first)\n- Clear error messages for missing 'levelset' and 'displacement' fields\n- Add docstring notes on _find_mmg_executable/_ensure_executable retention\n- Simplify `if arg in (\"-in\",)` to `if arg == \"-in\"`\n- Add inline comment for intentionally unhandled -nr flag\n- Fix Windows CI: use Path comparison in test_path_with_directory\n- Move removed CLI commands to [Unreleased] changelog section",
          "timestamp": "2026-04-04T10:00:13Z",
          "tree_id": "05fb28bec6cb90676e0a2d770893b6183a06c273",
          "url": "https://github.com/kmarchais/mmgpy/commit/7651d9e34f2a7276caf919de813d8894d411205b"
        },
        "date": 1775297425752,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 1.154175550221215,
            "unit": "iter/sec",
            "range": "stddev: 0.026325769691158633",
            "extra": "mean: 866.419324000006 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.5925646104802215,
            "unit": "iter/sec",
            "range": "stddev: 0.04717884624044027",
            "extra": "mean: 1.6875796871999966 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.1632573007376528,
            "unit": "iter/sec",
            "range": "stddev: 0.020226817271088146",
            "extra": "mean: 859.6550387999912 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.2161088894793408,
            "unit": "iter/sec",
            "range": "stddev: 0.02692508499656325",
            "extra": "mean: 822.2947868000006 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 1.1713958961499795,
            "unit": "iter/sec",
            "range": "stddev: 0.0264419451297172",
            "extra": "mean: 853.6823488000039 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.5946688983448628,
            "unit": "iter/sec",
            "range": "stddev: 0.027490810615435707",
            "extra": "mean: 1.681608039000008 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.2300388329532543,
            "unit": "iter/sec",
            "range": "stddev: 0.015328706835404491",
            "extra": "mean: 812.9824630000144 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.2185849313458357,
            "unit": "iter/sec",
            "range": "stddev: 0.02682050048048205",
            "extra": "mean: 820.6239665999931 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 60.403980382609355,
            "unit": "iter/sec",
            "range": "stddev: 0.00048194813764640144",
            "extra": "mean: 16.555200396825267 msec\nrounds: 63"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.1807754577321248,
            "unit": "iter/sec",
            "range": "stddev: 0.031180051954362267",
            "extra": "mean: 846.9010711999942 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 118.98706734384089,
            "unit": "iter/sec",
            "range": "stddev: 0.0000483950317757413",
            "extra": "mean: 8.40427470247894 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 14.817335833590318,
            "unit": "iter/sec",
            "range": "stddev: 0.005472994962201817",
            "extra": "mean: 67.48851556249669 msec\nrounds: 16"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 1.1599702279071915,
            "unit": "iter/sec",
            "range": "stddev: 0.01985945386869448",
            "extra": "mean: 862.09109159999 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 17.642476810122737,
            "unit": "iter/sec",
            "range": "stddev: 0.001385911330502819",
            "extra": "mean: 56.68138384210483 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 363.3066751618189,
            "unit": "iter/sec",
            "range": "stddev: 0.00015254081486368144",
            "extra": "mean: 2.752495531645804 msec\nrounds: 395"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 28.924720618528816,
            "unit": "iter/sec",
            "range": "stddev: 0.00027495144222854854",
            "extra": "mean: 34.572503333339455 msec\nrounds: 30"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 163.5938206766396,
            "unit": "iter/sec",
            "range": "stddev: 0.0006584392123328183",
            "extra": "mean: 6.112700319999281 msec\nrounds: 175"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 259.8106269076917,
            "unit": "iter/sec",
            "range": "stddev: 0.000041451552727899074",
            "extra": "mean: 3.8489572651517854 msec\nrounds: 264"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 275.8052106011611,
            "unit": "iter/sec",
            "range": "stddev: 0.00027145543095359587",
            "extra": "mean: 3.625747308473041 msec\nrounds: 295"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 73.25868106284808,
            "unit": "iter/sec",
            "range": "stddev: 0.00037349502441142975",
            "extra": "mean: 13.650259402597042 msec\nrounds: 77"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 851.079090116282,
            "unit": "iter/sec",
            "range": "stddev: 0.00002123653628409244",
            "extra": "mean: 1.1749789315859833 msec\nrounds: 877"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 31.08618148082685,
            "unit": "iter/sec",
            "range": "stddev: 0.0031312122309011294",
            "extra": "mean: 32.16863417646758 msec\nrounds: 34"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 1715.1358728342675,
            "unit": "iter/sec",
            "range": "stddev: 0.000019036303697079453",
            "extra": "mean: 583.0441866669705 usec\nrounds: 1800"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 78.84492145023363,
            "unit": "iter/sec",
            "range": "stddev: 0.00035869983482122764",
            "extra": "mean: 12.68312507142509 msec\nrounds: 84"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 90575.53005132794,
            "unit": "iter/sec",
            "range": "stddev: 0.0000011670298488752644",
            "extra": "mean: 11.040509500008593 usec\nrounds: 92422"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
            "value": 26963.037003029804,
            "unit": "iter/sec",
            "range": "stddev: 0.0000023244693484972796",
            "extra": "mean: 37.08781024510077 usec\nrounds: 27467"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
            "value": 6434.372640233202,
            "unit": "iter/sec",
            "range": "stddev: 0.00000457064006582284",
            "extra": "mean: 155.41530711901024 usec\nrounds: 6574"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 34.1693158112787,
            "unit": "iter/sec",
            "range": "stddev: 0.00025871523236494604",
            "extra": "mean: 29.266023514287554 msec\nrounds: 35"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 31.591642458067327,
            "unit": "iter/sec",
            "range": "stddev: 0.0031509929230342892",
            "extra": "mean: 31.65394142857037 msec\nrounds: 35"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 33.45379230556543,
            "unit": "iter/sec",
            "range": "stddev: 0.00021429421565982533",
            "extra": "mean: 29.891977294114977 msec\nrounds: 34"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 3098.7258315362924,
            "unit": "iter/sec",
            "range": "stddev: 0.000017679744103814187",
            "extra": "mean: 322.7132874495767 usec\nrounds: 4199"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 3534.3975867327,
            "unit": "iter/sec",
            "range": "stddev: 0.00000929198553780727",
            "extra": "mean: 282.9336472370187 usec\nrounds: 2968"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 2465.528198722226,
            "unit": "iter/sec",
            "range": "stddev: 0.000009936252474424049",
            "extra": "mean: 405.59260304475754 usec\nrounds: 2562"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 122.68035888383073,
            "unit": "iter/sec",
            "range": "stddev: 0.0017620042150178125",
            "extra": "mean: 8.15126405806268 msec\nrounds: 155"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 121.66384619326212,
            "unit": "iter/sec",
            "range": "stddev: 0.0014467413398569352",
            "extra": "mean: 8.21936862337483 msec\nrounds: 154"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 128.2070866886838,
            "unit": "iter/sec",
            "range": "stddev: 0.0013395967686371548",
            "extra": "mean: 7.799880847680668 msec\nrounds: 151"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 36.00647758478493,
            "unit": "iter/sec",
            "range": "stddev: 0.00022309963340524127",
            "extra": "mean: 27.77278054053709 msec\nrounds: 37"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 33.611995245372874,
            "unit": "iter/sec",
            "range": "stddev: 0.0005240011357322944",
            "extra": "mean: 29.751283513514803 msec\nrounds: 37"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 7334.503371491389,
            "unit": "iter/sec",
            "range": "stddev: 0.000007007005275853934",
            "extra": "mean: 136.34188292651382 usec\nrounds: 7790"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 975018.2701356034,
            "unit": "iter/sec",
            "range": "stddev: 1.2152580393723118e-7",
            "extra": "mean: 1.0256218069235998 usec\nrounds: 100624"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3388992.838034529,
            "unit": "iter/sec",
            "range": "stddev: 4.565055661877769e-8",
            "extra": "mean: 295.07291628859184 nsec\nrounds: 189754"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1573794.3210325923,
            "unit": "iter/sec",
            "range": "stddev: 8.463821792635159e-8",
            "extra": "mean: 635.4070456575823 nsec\nrounds: 163079"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 153039.5003033988,
            "unit": "iter/sec",
            "range": "stddev: 9.799695143259765e-7",
            "extra": "mean: 6.534260749790174 usec\nrounds: 170911"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 1062.052665274035,
            "unit": "iter/sec",
            "range": "stddev: 0.000022211671101694755",
            "extra": "mean: 941.5728924723107 usec\nrounds: 1116"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 119.22976456651246,
            "unit": "iter/sec",
            "range": "stddev: 0.00008006453846067154",
            "extra": "mean: 8.38716744628099 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 18.197334029842725,
            "unit": "iter/sec",
            "range": "stddev: 0.0004771837325882921",
            "extra": "mean: 54.953104578948185 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 119.14289033997197,
            "unit": "iter/sec",
            "range": "stddev: 0.00006069421210671298",
            "extra": "mean: 8.393283033058196 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 108.34796910833771,
            "unit": "iter/sec",
            "range": "stddev: 0.00006769621158880064",
            "extra": "mean: 9.229522327272186 msec\nrounds: 110"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 118.1420085135451,
            "unit": "iter/sec",
            "range": "stddev: 0.00004135872391006886",
            "extra": "mean: 8.464389700005388 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 158.26543240855557,
            "unit": "iter/sec",
            "range": "stddev: 0.00012494836131745596",
            "extra": "mean: 6.318499149065868 msec\nrounds: 161"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 1084.3472713229849,
            "unit": "iter/sec",
            "range": "stddev: 0.000023039701348284747",
            "extra": "mean: 922.2137837631344 usec\nrounds: 1318"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 119.01136776816321,
            "unit": "iter/sec",
            "range": "stddev: 0.00004076072324722915",
            "extra": "mean: 8.402558669420742 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 109.91758828900302,
            "unit": "iter/sec",
            "range": "stddev: 0.0003344640045092148",
            "extra": "mean: 9.097725082638547 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 28489.263971155564,
            "unit": "iter/sec",
            "range": "stddev: 0.0000025429335798713087",
            "extra": "mean: 35.100941920172694 usec\nrounds: 29270"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 67.08604988972589,
            "unit": "iter/sec",
            "range": "stddev: 0.00011975135190774468",
            "extra": "mean: 14.906228666671703 msec\nrounds: 69"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 3.311010110263441,
            "unit": "iter/sec",
            "range": "stddev: 0.0025433734438487805",
            "extra": "mean: 302.02263559999665 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.2211768286148985,
            "unit": "iter/sec",
            "range": "stddev: 0.018239072540476117",
            "extra": "mean: 818.8822261999803 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.1338110112711908,
            "unit": "iter/sec",
            "range": "stddev: 0.08169507075854757",
            "extra": "mean: 7.473226534200012 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.230091107657351,
            "unit": "iter/sec",
            "range": "stddev: 0.009790798423066606",
            "extra": "mean: 812.9479140000058 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 3.0216811667075154,
            "unit": "iter/sec",
            "range": "stddev: 0.012629957463683063",
            "extra": "mean: 330.9415999999828 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 1.015322638028885,
            "unit": "iter/sec",
            "range": "stddev: 0.008397333431129684",
            "extra": "mean: 984.9086020000186 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 2.357525525196776,
            "unit": "iter/sec",
            "range": "stddev: 0.010232327786332259",
            "extra": "mean: 424.1735621999396 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 3.1792684250155334,
            "unit": "iter/sec",
            "range": "stddev: 0.009173224515152307",
            "extra": "mean: 314.5377698000175 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.2441394716875427,
            "unit": "iter/sec",
            "range": "stddev: 0.0046437872758971115",
            "extra": "mean: 803.7684060000174 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.2401268423758882,
            "unit": "iter/sec",
            "range": "stddev: 0.01666193066111226",
            "extra": "mean: 806.36912760001 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 11323.625291371553,
            "unit": "iter/sec",
            "range": "stddev: 0.0000036057707668976066",
            "extra": "mean: 88.31094055734839 usec\nrounds: 11507"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 289.25329198456274,
            "unit": "iter/sec",
            "range": "stddev: 0.00001849420013659382",
            "extra": "mean: 3.457177593862508 msec\nrounds: 293"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 28.843597868312344,
            "unit": "iter/sec",
            "range": "stddev: 0.0015553751729918952",
            "extra": "mean: 34.66973865623757 msec\nrounds: 32"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 17.333156059538542,
            "unit": "iter/sec",
            "range": "stddev: 0.0021065266699055204",
            "extra": "mean: 57.692897736860445 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.621691750352087,
            "unit": "iter/sec",
            "range": "stddev: 0.0017112871804445472",
            "extra": "mean: 177.88239633334038 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 17.246108907038522,
            "unit": "iter/sec",
            "range": "stddev: 0.005834102081102551",
            "extra": "mean: 57.98409400000238 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 21.116261208849608,
            "unit": "iter/sec",
            "range": "stddev: 0.002699348169228852",
            "extra": "mean: 47.356868249996374 msec\nrounds: 24"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 18.191665304138233,
            "unit": "iter/sec",
            "range": "stddev: 0.0015820596006856187",
            "extra": "mean: 54.97022857893722 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 16.943157747844722,
            "unit": "iter/sec",
            "range": "stddev: 0.004833003193722279",
            "extra": "mean: 59.02087526318443 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 23.90437450000984,
            "unit": "iter/sec",
            "range": "stddev: 0.004777813534657128",
            "extra": "mean: 41.83334728125132 msec\nrounds: 32"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 17.078156303727113,
            "unit": "iter/sec",
            "range": "stddev: 0.001964057376712952",
            "extra": "mean: 58.55432999999898 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 17.52806341304601,
            "unit": "iter/sec",
            "range": "stddev: 0.0021990355568761106",
            "extra": "mean: 57.05136822221372 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 17648.02520041158,
            "unit": "iter/sec",
            "range": "stddev: 0.000002772570027641552",
            "extra": "mean: 56.66356369304586 usec\nrounds: 18079"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 60.71895110844144,
            "unit": "iter/sec",
            "range": "stddev: 0.0007473420575213731",
            "extra": "mean: 16.469322703121847 msec\nrounds: 64"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 172.3433299216583,
            "unit": "iter/sec",
            "range": "stddev: 0.00004938942313097235",
            "extra": "mean: 5.802371350574274 msec\nrounds: 174"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.35232843110981,
            "unit": "iter/sec",
            "range": "stddev: 0.0001242702298225771",
            "extra": "mean: 69.67510566664714 msec\nrounds: 15"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
            "value": 1.163288691282927,
            "unit": "iter/sec",
            "range": "stddev: 0.014276934370121014",
            "extra": "mean: 859.6318416000031 msec\nrounds: 5"
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
          "id": "42dad8021901c0a2c05acd17860f6c0136b0b322",
          "message": "refactor: redesign benchmarks with diagnostic feature isolation matrix (#222)\n\n* refactor: redesign benchmarks with diagnostic feature isolation matrix\n\nReplace 82 benchmarks across 7 files with 16 focused benchmarks in 3\nfiles, designed for low noise and fast regression diagnosis.\n\nTier 1 (bench_operations.py, 5 benchmarks):\n  Cheap operations at scale — construction, I/O, PyVista, quality, metrics\n\nTier 2 (bench_remesh.py, 9 benchmarks):\n  Feature isolation matrix covering 8 remesh options across 3D/2D/surface.\n  Each feature has a unique signature enabling cross-check diagnosis.\n\nTier 3 (bench_validation.py, 2 benchmarks):\n  KD-tree duplicate vertex detection (10k, 100k vertices)\n\nAdditional changes:\n- Vectorize mesh generation (NumPy instead of Python loops)\n- Increase mesh sizes to target 0.3-5s per benchmark\n- Remove subprocess-based comparison benchmarks (noisy, redundant with tests)\n- Remove sub-millisecond small-mesh benchmarks (noise-dominated)\n\nRelates to #136\n\n* fix: address review findings on benchmark suite\n\n- Remove unused mesh_file_3d_medium fixture and MmgMesh3D import from conftest\n- Remove unused pyvista_tetra_grid_medium fixture from conftest\n- Balance large mesh sizes: 2D 320K→80K, surface 328K→82K (matching 3D ~40K)\n- Split B9 (optimize+uniform) into B9 (optimize) and B10 (uniform)\n- Split test_quality_and_validate into test_quality_3d and test_validate_3d\n- Update README: 16→18 benchmarks, updated isolation matrix",
          "timestamp": "2026-04-04T13:57:00Z",
          "tree_id": "fcac97b00e8ee7e04f1149170ffb7250532114f6",
          "url": "https://github.com/kmarchais/mmgpy/commit/42dad8021901c0a2c05acd17860f6c0136b0b322"
        },
        "date": 1775311406210,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_construction_3d",
            "value": 36.969529552592746,
            "unit": "iter/sec",
            "range": "stddev: 0.0006301489938673562",
            "extra": "mean: 27.049302820513386 msec\nrounds: 39"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_io_roundtrip_3d",
            "value": 18.185025515662748,
            "unit": "iter/sec",
            "range": "stddev: 0.0003502342123301111",
            "extra": "mean: 54.990299526316356 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_pyvista_roundtrip_3d",
            "value": 28.697287807454305,
            "unit": "iter/sec",
            "range": "stddev: 0.00020922431141572054",
            "extra": "mean: 34.84649862068999 msec\nrounds: 29"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_quality_3d",
            "value": 3397.1996823918084,
            "unit": "iter/sec",
            "range": "stddev: 0.000006975618417796347",
            "extra": "mean: 294.36008874696086 usec\nrounds: 3448"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_validate_3d",
            "value": 74.56967994895253,
            "unit": "iter/sec",
            "range": "stddev: 0.00005656097590896801",
            "extra": "mean: 13.410276142858072 msec\nrounds: 77"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_metric_field_set_get",
            "value": 8788.341118446391,
            "unit": "iter/sec",
            "range": "stddev: 0.0000059654180607509705",
            "extra": "mean: 113.78711710461924 usec\nrounds: 18650"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_adaptive_hmin_hmax_hausd",
            "value": 0.13888597527717225,
            "unit": "iter/sec",
            "range": "stddev: 0.06796641310124381",
            "extra": "mean: 7.200151044800009 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_metric_hgrad",
            "value": 0.11121044533862248,
            "unit": "iter/sec",
            "range": "stddev: 0.039424276503874624",
            "extra": "mean: 8.991961114399999 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_optimize",
            "value": 0.40853964237333645,
            "unit": "iter/sec",
            "range": "stddev: 0.00301284234802958",
            "extra": "mean: 2.447742877999997 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_adaptive_hmax_hgrad_angle",
            "value": 5.371621088180007,
            "unit": "iter/sec",
            "range": "stddev: 0.00011720496731513187",
            "extra": "mean: 186.16354049999018 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_metric_hmin_hausd",
            "value": 5.342080855401231,
            "unit": "iter/sec",
            "range": "stddev: 0.0009676137993368532",
            "extra": "mean: 187.19297350000375 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_uniform_angle",
            "value": 5.359846962147488,
            "unit": "iter/sec",
            "range": "stddev: 0.00019890340086991198",
            "extra": "mean: 186.57249116667649 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_adaptive_hmin_hgrad",
            "value": 5.264832711914952,
            "unit": "iter/sec",
            "range": "stddev: 0.0020689857372025834",
            "extra": "mean: 189.93955833333112 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_metric_hmax_hausd_angle",
            "value": 2.1150243479127973,
            "unit": "iter/sec",
            "range": "stddev: 0.0015972321022836716",
            "extra": "mean: 472.80779580000853 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_optimize",
            "value": 2.12433863384861,
            "unit": "iter/sec",
            "range": "stddev: 0.0019266138415381029",
            "extra": "mean: 470.7347426000183 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_uniform",
            "value": 2.8870181148798415,
            "unit": "iter/sec",
            "range": "stddev: 0.0011784374372026736",
            "extra": "mean: 346.37815219999766 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 172.07954716883685,
            "unit": "iter/sec",
            "range": "stddev: 0.00003073861693122232",
            "extra": "mean: 5.811265873560465 msec\nrounds: 174"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.331559264962163,
            "unit": "iter/sec",
            "range": "stddev: 0.00008302546267391738",
            "extra": "mean: 69.77607820000458 msec\nrounds: 15"
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
          "id": "8ee3c42a021c51ccf088164e8205895a8e9eb477",
          "message": "feat: add refs parameter to Mesh constructor (#224)\n\n* feat: add `refs` parameter to `Mesh` constructor\n\nAllow passing cell reference markers when creating a mesh from arrays:\n\n    mesh = Mesh(vertices, cells, refs=refs)\n\nThis enables users working with Medit-style data to preserve region/boundary\nmarkers without file I/O.\n\nCloses #223\n\n* fix: validate refs parameter and deduplicate _create_impl paths\n\n- Raise ValueError when refs is passed with file/PyVista sources\n- Validate refs length matches cells length\n- Collapse duplicated refs/no-refs branches into single code path\n- Remove redundant int64 dtype conversion in __init__\n- Expand tests to multi-cell meshes with varying ref values",
          "timestamp": "2026-04-09T20:31:37+02:00",
          "tree_id": "5f9a2e702de31969f2ec43e32c12ffdc438c299c",
          "url": "https://github.com/kmarchais/mmgpy/commit/8ee3c42a021c51ccf088164e8205895a8e9eb477"
        },
        "date": 1775759916985,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_construction_3d",
            "value": 34.98171930171181,
            "unit": "iter/sec",
            "range": "stddev: 0.0002674944656519858",
            "extra": "mean: 28.586359388889885 msec\nrounds: 36"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_io_roundtrip_3d",
            "value": 18.03999230254431,
            "unit": "iter/sec",
            "range": "stddev: 0.0010305298331381367",
            "extra": "mean: 55.43239615789431 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_pyvista_roundtrip_3d",
            "value": 28.234147781466863,
            "unit": "iter/sec",
            "range": "stddev: 0.0012384480723648314",
            "extra": "mean: 35.41810462068944 msec\nrounds: 29"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_quality_3d",
            "value": 3389.5904985693537,
            "unit": "iter/sec",
            "range": "stddev: 0.00000808035066321862",
            "extra": "mean: 295.0208883409575 usec\nrounds: 3448"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_validate_3d",
            "value": 74.49317721671555,
            "unit": "iter/sec",
            "range": "stddev: 0.00012006178818540568",
            "extra": "mean: 13.424048179483604 msec\nrounds: 78"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_metric_field_set_get",
            "value": 9154.43696318682,
            "unit": "iter/sec",
            "range": "stddev: 0.000006014516666152609",
            "extra": "mean: 109.23664710580763 usec\nrounds: 18830"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_adaptive_hmin_hmax_hausd",
            "value": 0.11684479686991264,
            "unit": "iter/sec",
            "range": "stddev: 0.0660632421522929",
            "extra": "mean: 8.55836140579999 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_metric_hgrad",
            "value": 0.09841299962071129,
            "unit": "iter/sec",
            "range": "stddev: 0.19576472538688952",
            "extra": "mean: 10.161259222399996 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_optimize",
            "value": 0.4170850965498386,
            "unit": "iter/sec",
            "range": "stddev: 0.0037064740906086286",
            "extra": "mean: 2.3975922618000025 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_adaptive_hmax_hgrad_angle",
            "value": 5.322336359794748,
            "unit": "iter/sec",
            "range": "stddev: 0.0002927073167142092",
            "extra": "mean: 187.8874111666562 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_metric_hmin_hausd",
            "value": 5.292439971606511,
            "unit": "iter/sec",
            "range": "stddev: 0.0005543774323202856",
            "extra": "mean: 188.9487656666707 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_uniform_angle",
            "value": 5.309907606864507,
            "unit": "iter/sec",
            "range": "stddev: 0.0006314156107552856",
            "extra": "mean: 188.327193999991 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_adaptive_hmin_hgrad",
            "value": 4.893746542782067,
            "unit": "iter/sec",
            "range": "stddev: 0.008386656741548473",
            "extra": "mean: 204.3424176666709 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_metric_hmax_hausd_angle",
            "value": 2.0151599856994324,
            "unit": "iter/sec",
            "range": "stddev: 0.023809942126228844",
            "extra": "mean: 496.2385155999982 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_optimize",
            "value": 1.9983150439354187,
            "unit": "iter/sec",
            "range": "stddev: 0.011562857500535808",
            "extra": "mean: 500.42159419999734 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_uniform",
            "value": 2.8235799210253227,
            "unit": "iter/sec",
            "range": "stddev: 0.015025741344647122",
            "extra": "mean: 354.16033120000066 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 172.04083432755777,
            "unit": "iter/sec",
            "range": "stddev: 0.00003444806131849718",
            "extra": "mean: 5.8125735317933085 msec\nrounds: 173"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.076036598888665,
            "unit": "iter/sec",
            "range": "stddev: 0.0014111242027605806",
            "extra": "mean: 71.04272520000072 msec\nrounds: 15"
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
          "id": "18110ab79752bcc502d962de3d8f2412f0e6a3fd",
          "message": "Merge pull request #225 from kmarchais/release/v0.10.0\n\nRelease v0.10.0",
          "timestamp": "2026-04-09T21:05:46+02:00",
          "tree_id": "bf2f4a990d536098c6e5457801ce75387f32737f",
          "url": "https://github.com/kmarchais/mmgpy/commit/18110ab79752bcc502d962de3d8f2412f0e6a3fd"
        },
        "date": 1775762001863,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_construction_3d",
            "value": 39.56183087718657,
            "unit": "iter/sec",
            "range": "stddev: 0.00036166730125156843",
            "extra": "mean: 25.27688880487714 msec\nrounds: 41"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_io_roundtrip_3d",
            "value": 19.889326015864107,
            "unit": "iter/sec",
            "range": "stddev: 0.00040208327733241226",
            "extra": "mean: 50.27822457142996 msec\nrounds: 21"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_pyvista_roundtrip_3d",
            "value": 31.62129746005886,
            "unit": "iter/sec",
            "range": "stddev: 0.00036835892584543553",
            "extra": "mean: 31.62425581249817 msec\nrounds: 32"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_quality_3d",
            "value": 3416.2449729243576,
            "unit": "iter/sec",
            "range": "stddev: 0.0000075031849673922065",
            "extra": "mean: 292.7190549640194 usec\nrounds: 3475"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_validate_3d",
            "value": 69.75972168829274,
            "unit": "iter/sec",
            "range": "stddev: 0.00013420319235831653",
            "extra": "mean: 14.334919575343182 msec\nrounds: 73"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_metric_field_set_get",
            "value": 8580.787787665095,
            "unit": "iter/sec",
            "range": "stddev: 0.000004929907680758721",
            "extra": "mean: 116.53941628034462 usec\nrounds: 16388"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_adaptive_hmin_hmax_hausd",
            "value": 0.11608567239785911,
            "unit": "iter/sec",
            "range": "stddev: 0.07300227089696318",
            "extra": "mean: 8.614327499199998 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_metric_hgrad",
            "value": 0.08682456090174663,
            "unit": "iter/sec",
            "range": "stddev: 0.12063941406918376",
            "extra": "mean: 11.517478344999995 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_optimize",
            "value": 0.39885182461432067,
            "unit": "iter/sec",
            "range": "stddev: 0.006085526402662683",
            "extra": "mean: 2.5071967539999944 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_adaptive_hmax_hgrad_angle",
            "value": 5.275291634672765,
            "unit": "iter/sec",
            "range": "stddev: 0.00014993096182123222",
            "extra": "mean: 189.56297950000098 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_metric_hmin_hausd",
            "value": 5.26961616064947,
            "unit": "iter/sec",
            "range": "stddev: 0.00015003466932485675",
            "extra": "mean: 189.76714233333306 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_uniform_angle",
            "value": 5.270658953233784,
            "unit": "iter/sec",
            "range": "stddev: 0.0004957610270295172",
            "extra": "mean: 189.72959716667978 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_adaptive_hmin_hgrad",
            "value": 5.412468301078924,
            "unit": "iter/sec",
            "range": "stddev: 0.0009520980412776584",
            "extra": "mean: 184.7585878333291 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_metric_hmax_hausd_angle",
            "value": 2.0282921720766174,
            "unit": "iter/sec",
            "range": "stddev: 0.005970177522865892",
            "extra": "mean: 493.0256171999986 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_optimize",
            "value": 2.0836119999430975,
            "unit": "iter/sec",
            "range": "stddev: 0.003100399235732085",
            "extra": "mean: 479.9358037999923 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_uniform",
            "value": 2.799481595581458,
            "unit": "iter/sec",
            "range": "stddev: 0.0018214321931720133",
            "extra": "mean: 357.2089924000011 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 163.5661015329604,
            "unit": "iter/sec",
            "range": "stddev: 0.000025689230482000246",
            "extra": "mean: 6.113736224241359 msec\nrounds: 165"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 13.48272673513583,
            "unit": "iter/sec",
            "range": "stddev: 0.00019650755930199936",
            "extra": "mean: 74.16897335714826 msec\nrounds: 14"
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
          "id": "61fdb9e19ce2d00183c717400b83c38dbef401a7",
          "message": "feat: add edges parameter to Mesh constructor (#226) (#227)\n\n* feat: add edges parameter to Mesh constructor and pyvista bridge\n\nCloses #226. Edge markers (refs) can now be passed to the Mesh\nconstructor and survive PyVista round-trips, unlocking the .msh\nboundary-condition workflow that previously dropped them.\n\n- Mesh(vertices, cells, edges=..., edge_refs=...) wires through\n  _create_impl using set_mesh_size + set_edges\n- _from_pyvista_to_mmg{3d,2d,s} extracts LINE cells and recognises\n  refs/gmsh:physical/medit:ref aliases (so .msh files preserve markers)\n- _mmg{3d,2d,s}_to_pyvista emits LINE cells in the output, with refs\n  concatenated in the appropriate cell ordering\n- Triangulation now strips line cells first (PyVista corrupts cell_data\n  when triangulating a mesh with mixed lines + faces)\n\n* fix: make LINE cells in to_pyvista opt-in via include_edges\n\nMMG auto-generates ridge/boundary edges during remeshing, so the\nprevious unconditional line emission broke any downstream code that\ntreated to_pyvista output as triangle-only (e.g. matplotlib tripcolor\non cell-data computed via compute_cell_sizes).\n\n- to_pyvista(include_edges=False) is the new default and matches the\n  pre-edge-PR behaviour (only the primary cell type)\n- to_pyvista(include_edges=True) emits LINE cells for round-trip and\n  external compatibility\n- mesh.save() always passes include_edges=True so .vtu/.vtk files keep\n  edge markers across the file round-trip\n- round-trip tests updated to opt in explicitly\n\n* refactor: dedupe _create_impl and recognise ref aliases on elements\n\n- Collapse the three near-identical mesh-kind branches in _create_impl\n  behind a small _KIND_CONFIG table.\n- Recognise gmsh:physical and medit:ref cell_data fields when\n  extracting element refs in _from_pyvista_to_mmg{3d,2d,s}, matching\n  the alias support already in place for edges. .msh files now keep\n  triangle/tetra refs across read.\n- Make _strip_lines also trim per-cell cell_data so post-strip\n  PolyData has consistent cell_data lengths; clarify the no-copy\n  fast path in the docstring.",
          "timestamp": "2026-05-04T13:58:32+02:00",
          "tree_id": "3b55717fafc778f230d51a38fd5ef0946905b796",
          "url": "https://github.com/kmarchais/mmgpy/commit/61fdb9e19ce2d00183c717400b83c38dbef401a7"
        },
        "date": 1777896365640,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_construction_3d",
            "value": 33.082157152462635,
            "unit": "iter/sec",
            "range": "stddev: 0.0005158565398208572",
            "extra": "mean: 30.227774911756622 msec\nrounds: 34"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_io_roundtrip_3d",
            "value": 18.01262893666295,
            "unit": "iter/sec",
            "range": "stddev: 0.00030121019725155753",
            "extra": "mean: 55.516604684205625 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_pyvista_roundtrip_3d",
            "value": 25.438496051218024,
            "unit": "iter/sec",
            "range": "stddev: 0.000402365719022862",
            "extra": "mean: 39.310500038469016 msec\nrounds: 26"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_quality_3d",
            "value": 3380.2662939096617,
            "unit": "iter/sec",
            "range": "stddev: 0.000009810145984494954",
            "extra": "mean: 295.8346807769948 usec\nrounds: 3449"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_validate_3d",
            "value": 73.60921851107784,
            "unit": "iter/sec",
            "range": "stddev: 0.00027247772754314734",
            "extra": "mean: 13.585254948053887 msec\nrounds: 77"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_metric_field_set_get",
            "value": 9154.77283044692,
            "unit": "iter/sec",
            "range": "stddev: 0.000006946659032263644",
            "extra": "mean: 109.2326394680382 usec\nrounds: 18040"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_adaptive_hmin_hmax_hausd",
            "value": 0.1191204380861436,
            "unit": "iter/sec",
            "range": "stddev: 0.06808288076622968",
            "extra": "mean: 8.394865029600009 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_metric_hgrad",
            "value": 0.09806158539707396,
            "unit": "iter/sec",
            "range": "stddev: 0.07822328989457933",
            "extra": "mean: 10.197673186199973 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_optimize",
            "value": 0.4036722988755574,
            "unit": "iter/sec",
            "range": "stddev: 0.01515903093612956",
            "extra": "mean: 2.4772569304000625 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_adaptive_hmax_hgrad_angle",
            "value": 5.160939862578513,
            "unit": "iter/sec",
            "range": "stddev: 0.002505786412489061",
            "extra": "mean: 193.76315683329418 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_metric_hmin_hausd",
            "value": 5.156302441609493,
            "unit": "iter/sec",
            "range": "stddev: 0.00235336252378054",
            "extra": "mean: 193.9374215000195 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_uniform_angle",
            "value": 5.202494657578428,
            "unit": "iter/sec",
            "range": "stddev: 0.0019285118804701355",
            "extra": "mean: 192.21547849997478 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_adaptive_hmin_hgrad",
            "value": 5.060903361473796,
            "unit": "iter/sec",
            "range": "stddev: 0.0020676850858915735",
            "extra": "mean: 197.59318219994384 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_metric_hmax_hausd_angle",
            "value": 1.9793100770007952,
            "unit": "iter/sec",
            "range": "stddev: 0.012990940044154435",
            "extra": "mean: 505.2265492000515 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_optimize",
            "value": 1.9493627884512452,
            "unit": "iter/sec",
            "range": "stddev: 0.003972529391517827",
            "extra": "mean: 512.9881446000581 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_uniform",
            "value": 2.734881800946356,
            "unit": "iter/sec",
            "range": "stddev: 0.006700164466675177",
            "extra": "mean: 365.6465152000237 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 171.09237815498037,
            "unit": "iter/sec",
            "range": "stddev: 0.0000372429294124682",
            "extra": "mean: 5.844795722543358 msec\nrounds: 173"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 13.972452122055458,
            "unit": "iter/sec",
            "range": "stddev: 0.0009640068435809473",
            "extra": "mean: 71.5693989333128 msec\nrounds: 15"
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
          "id": "70e4c7593cefae9e811fa294afcb010777f92b22",
          "message": "Release v0.11.0 (#228)\n\n* chore: bump version to 0.11.0\n\n* chore: bump version to 0.12.0.dev0",
          "timestamp": "2026-05-04T16:53:13+02:00",
          "tree_id": "878921c5c2311b526042e8774d994ce1a52eb9be",
          "url": "https://github.com/kmarchais/mmgpy/commit/70e4c7593cefae9e811fa294afcb010777f92b22"
        },
        "date": 1777906907089,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_construction_3d",
            "value": 35.79910921560245,
            "unit": "iter/sec",
            "range": "stddev: 0.0002859148748416924",
            "extra": "mean: 27.93365594594646 msec\nrounds: 37"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_io_roundtrip_3d",
            "value": 18.9898502592587,
            "unit": "iter/sec",
            "range": "stddev: 0.0005899646802316389",
            "extra": "mean: 52.659709599997484 msec\nrounds: 20"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_pyvista_roundtrip_3d",
            "value": 25.93272057618744,
            "unit": "iter/sec",
            "range": "stddev: 0.0002676802261425111",
            "extra": "mean: 38.56132244444278 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_quality_3d",
            "value": 3424.941219310529,
            "unit": "iter/sec",
            "range": "stddev: 0.000008185102016038599",
            "extra": "mean: 291.97581388018943 usec\nrounds: 3487"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_validate_3d",
            "value": 69.54290309081871,
            "unit": "iter/sec",
            "range": "stddev: 0.00020665935962023923",
            "extra": "mean: 14.3796125205481 msec\nrounds: 73"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_metric_field_set_get",
            "value": 8709.492202742407,
            "unit": "iter/sec",
            "range": "stddev: 0.00000539736431388196",
            "extra": "mean: 114.81725647393361 usec\nrounds: 13245"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_adaptive_hmin_hmax_hausd",
            "value": 0.08855741301950242,
            "unit": "iter/sec",
            "range": "stddev: 0.14434748158290722",
            "extra": "mean: 11.292109445199992 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_metric_hgrad",
            "value": 0.07889782576341646,
            "unit": "iter/sec",
            "range": "stddev: 1.2588936686823589",
            "extra": "mean: 12.67462050219998 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_optimize",
            "value": 0.3965637635361955,
            "unit": "iter/sec",
            "range": "stddev: 0.00252053511528732",
            "extra": "mean: 2.521662572200012 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_adaptive_hmax_hgrad_angle",
            "value": 5.158490085604199,
            "unit": "iter/sec",
            "range": "stddev: 0.0012263126889970693",
            "extra": "mean: 193.855175333321 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_metric_hmin_hausd",
            "value": 5.165286592624876,
            "unit": "iter/sec",
            "range": "stddev: 0.000598828506009523",
            "extra": "mean: 193.60009983334217 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_uniform_angle",
            "value": 5.159190769371296,
            "unit": "iter/sec",
            "range": "stddev: 0.0006801202060871903",
            "extra": "mean: 193.82884733333108 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_adaptive_hmin_hgrad",
            "value": 5.284697417448724,
            "unit": "iter/sec",
            "range": "stddev: 0.0015348344428038887",
            "extra": "mean: 189.2255925000086 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_metric_hmax_hausd_angle",
            "value": 1.9627309672320528,
            "unit": "iter/sec",
            "range": "stddev: 0.005491405604571236",
            "extra": "mean: 509.4941776000269 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_optimize",
            "value": 1.944173010565661,
            "unit": "iter/sec",
            "range": "stddev: 0.0020081061868989307",
            "extra": "mean: 514.3575158000203 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_uniform",
            "value": 2.8030696604218184,
            "unit": "iter/sec",
            "range": "stddev: 0.0016509514998113773",
            "extra": "mean: 356.7517475999921 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 159.83697803681173,
            "unit": "iter/sec",
            "range": "stddev: 0.000030005745340111483",
            "extra": "mean: 6.256374540375082 msec\nrounds: 161"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 13.256991533507989,
            "unit": "iter/sec",
            "range": "stddev: 0.00015754383319598023",
            "extra": "mean: 75.43189550000307 msec\nrounds: 14"
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
          "id": "59fa90a203924925ada4dbb9d3299a73a319e49b",
          "message": "feat: adopt PyVista 0.48 reader/writer/accessor registries (#230)\n\n* feat: adopt PyVista 0.48 reader/writer/accessor registries\n\nRegister a Medit reader and writer for .mesh/.meshb plus an `mmg` dataset\naccessor via PyVista 0.48's plugin registries. Once mmgpy is installed,\n`pv.read(\"foo.mesh\")`, `mesh.save(\"out.mesh\")`, and `mesh.mmg.remesh(...)`\nwork transparently for any PyVista user, with no explicit `import mmgpy`\nrequired.\n\nReading a .mesh/.meshb auto-loads a sibling .sol into point_data /\ncell_data. Binary .solb auto-pair is intentionally skipped for now.\n\nThe Mesh class is unchanged in this PR; deprecation lands separately\nonce the accessor has had time to stabilize.\n\nAlso fixes pre-existing inability to auto-detect mesh kind from binary\n.meshb files: when the text header parser doesn't apply, fall through\nto a trial-load across MmgMesh3D/MmgMeshS/MmgMesh2D and pick the one\nthat yields a non-empty mesh.\n\n* fix: address review feedback and CI failures for pyvista 0.48 plugin\n\n- _load_meshb_by_trial: catch construction errors per candidate so\n  corrupt .meshb produces a friendly ValueError; discriminate\n  tetrahedral vs surface by element count rather than vertex count\n  so a surface .meshb no longer routes to MmgMesh3D.\n- _attach_sol_fields: strict UTF-8 decode wrapped in try/except,\n  parse errors caught and logged so a malformed .sol does not abort\n  pv.read; promote .solb skip log from debug to info.\n- docs/tutorials/pyvista-integration.md: replace deprecated\n  compute_cell_quality with cell_quality and update plot scalar key\n  (fixes ubuntu 3.14 docs codeblock CI failure).\n- _pyvista.py from_pyvista: bypass mesh.cells_dict for the\n  all-tetrahedra fast path (PyVista 0.48 made cells_dict O(n_cells)\n  due to per-cell CellType enum lookup); cache cells_dict for the\n  mixed-cell-type fallback. Fixes the test_pyvista_roundtrip_3d\n  benchmark regression.\n\n* fix(examples): use 1D mask for extract_cells in open_boundary_remeshing\n\nPyVista 0.48 rejects 2D boolean masks in extract_cells(). The\n`points[:, :] < 0` expression produced a (n_cells, 3) mask, matching\nthe buggy pattern that 0.47 silently tolerated. Switch to\n`points[:, 0] < 0` to match the slicing pattern used in\nmesh_quality_improvement.py and ellipsoid_levelset.py.\n\n* chore: minor cleanups in pyvista plugin\n\n- Demote .solb auto-pair skip from info to debug\n- Align accessor docstring example with hsiz parameter\n- Drop unused tmp_path/out in tetrahedral remesh test",
          "timestamp": "2026-05-05T11:06:11+02:00",
          "tree_id": "5fc1dde64d24e1822f712eeaa78e40d561760e49",
          "url": "https://github.com/kmarchais/mmgpy/commit/59fa90a203924925ada4dbb9d3299a73a319e49b"
        },
        "date": 1777972394178,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_construction_3d",
            "value": 35.414219068659186,
            "unit": "iter/sec",
            "range": "stddev: 0.00024971162481447285",
            "extra": "mean: 28.237245555556473 msec\nrounds: 36"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_io_roundtrip_3d",
            "value": 18.17517509444744,
            "unit": "iter/sec",
            "range": "stddev: 0.00027061979837696067",
            "extra": "mean: 55.020102684210315 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_pyvista_roundtrip_3d",
            "value": 30.903273062415696,
            "unit": "iter/sec",
            "range": "stddev: 0.00020023993197524495",
            "extra": "mean: 32.35903193750023 msec\nrounds: 32"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_quality_3d",
            "value": 3194.735076592982,
            "unit": "iter/sec",
            "range": "stddev: 0.000005985423428628668",
            "extra": "mean: 313.0150000000776 usec\nrounds: 3246"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_validate_3d",
            "value": 75.34985679616193,
            "unit": "iter/sec",
            "range": "stddev: 0.00005500303796758215",
            "extra": "mean: 13.27142535526274 msec\nrounds: 76"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_metric_field_set_get",
            "value": 9233.299622829772,
            "unit": "iter/sec",
            "range": "stddev: 0.0000061590483293011246",
            "extra": "mean: 108.30364450942893 usec\nrounds: 20189"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_adaptive_hmin_hmax_hausd",
            "value": 0.1306382681365247,
            "unit": "iter/sec",
            "range": "stddev: 0.23624147073352178",
            "extra": "mean: 7.65472486939999 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_metric_hgrad",
            "value": 0.10067292315776122,
            "unit": "iter/sec",
            "range": "stddev: 0.04902107608969861",
            "extra": "mean: 9.933157483000002 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_optimize",
            "value": 0.3427902800733951,
            "unit": "iter/sec",
            "range": "stddev: 0.006493485890821353",
            "extra": "mean: 2.9172355756000115 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_adaptive_hmax_hgrad_angle",
            "value": 5.339660570058449,
            "unit": "iter/sec",
            "range": "stddev: 0.00021423991221500443",
            "extra": "mean: 187.2778216666783 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_metric_hmin_hausd",
            "value": 5.339939778668976,
            "unit": "iter/sec",
            "range": "stddev: 0.00019734645597166046",
            "extra": "mean: 187.26802949999902 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_uniform_angle",
            "value": 5.334067092343817,
            "unit": "iter/sec",
            "range": "stddev: 0.00027752986848218335",
            "extra": "mean: 187.47420733333797 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_adaptive_hmin_hgrad",
            "value": 5.208808741126779,
            "unit": "iter/sec",
            "range": "stddev: 0.0017765622958996969",
            "extra": "mean: 191.98247616664807 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_metric_hmax_hausd_angle",
            "value": 2.098345847277708,
            "unit": "iter/sec",
            "range": "stddev: 0.0015136739566826824",
            "extra": "mean: 476.5658631999827 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_optimize",
            "value": 2.1085050043142313,
            "unit": "iter/sec",
            "range": "stddev: 0.0026930917410894423",
            "extra": "mean: 474.2696829999886 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_uniform",
            "value": 2.857650454244844,
            "unit": "iter/sec",
            "range": "stddev: 0.002008130050454062",
            "extra": "mean: 349.9378303999947 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 172.1266238306077,
            "unit": "iter/sec",
            "range": "stddev: 0.000032543185869869114",
            "extra": "mean: 5.8096764913260275 msec\nrounds: 173"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.209131128681182,
            "unit": "iter/sec",
            "range": "stddev: 0.0004576669988858044",
            "extra": "mean: 70.37728000000622 msec\nrounds: 15"
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
          "id": "9bca8c8695b6bf566775ed31d17341974614a322",
          "message": "feat(pv-plugin): expand .mmg accessor to a full Mesh-equivalent surface (#231)\n\n* feat(pv-plugin): expand .mmg accessor with full Mesh-equivalent surface\n\nBrings the dataset accessor up to a real superset of mmgpy.Mesh so the\nclass can be deprecated in a follow-up. Adds:\n\n- remesh_lagrangian, remesh_levelset, remesh_optimize, remesh_uniform\n- save_sol (companion to load_sol)\n- validate, element_quality, element_qualities (MMG in-radius ratio)\n- kind property (returns MeshKind enum)\n- local_sizing kwarg on remesh variants taking a list of dict specs\n  (sphere / box / cylinder / from_point), stateless replacement for\n  Mesh.set_size_*\n\nAdds _build_mesh_with_mmg_fields helper that pushes point_data[\"metric\"],\n[\"displacement\"], [\"levelset\"], and [\"tensor\"] into the C++ impl, since\nmmgpy._io.read deliberately strips these into a lazy source instead of\nforwarding them to MMG. Reshapes scalar (n,) arrays to (n,1) for MMG.\n\nTests cover each new method including a sphere-densified region, sol\nround-trip, validation, kind detection, and unknown-shape error path.\nLagrangian test is conditionally skipped when MMG is built without\nELAS support, mirroring the existing tests/progress_test.py pattern.\n\nTutorial doc gains a .mmg accessor section showing the full surface.\n\n* feat(pv-plugin): close remaining Mesh gaps on .mmg accessor\n\nAdds the MMG-specific operations that have no native PyVista equivalent\nand would otherwise block deprecation:\n\n- adjacent_elements(idx): MMG's 1-based element adjacency, distinct from\n  PyVista's cell_neighbors which uses VTK 0-based topology.\n- vertex_neighbors(idx): MMG's 1-based vertex adjacency, distinct from\n  PyVista's point_neighbors.\n- center_of_mass(): volume-weighted (3D) or area-weighted (2D/surface)\n  centroid; PyVista's dataset.center is the unweighted arithmetic mean.\n\nMesh.checkpoint() and Mesh.update_from() are intentionally NOT mirrored:\nthe accessor's stateless return-a-new-dataset model makes them moot —\nusers keep snapshots via Python variable assignment and dataset.copy().\nThe migration guide in the deprecation PR will cover this.\n\n* chore: revert unrelated example png artifacts swept in by git add -u\n\n* fix(docs): mark new accessor code blocks as pytest-codeblocks:skip\n\nThe new .mmg accessor section in docs/tutorials/pyvista-integration.md\nreferences undefined names (displacement, levelset, my_metric) and\nrelies on shared 'mesh' state across blocks, which pytest-codeblocks\nre-initializes per block. Mark the six affected blocks as skipped so\nubuntu-3.14 build-and-test stops failing on doctest discovery.",
          "timestamp": "2026-05-05T12:44:45+02:00",
          "tree_id": "711ae9662c00c887971205187ddce73085b622f7",
          "url": "https://github.com/kmarchais/mmgpy/commit/9bca8c8695b6bf566775ed31d17341974614a322"
        },
        "date": 1777978304414,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_construction_3d",
            "value": 35.37124094335612,
            "unit": "iter/sec",
            "range": "stddev: 0.00042173516210925957",
            "extra": "mean: 28.27155545945958 msec\nrounds: 37"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_io_roundtrip_3d",
            "value": 18.441401627627823,
            "unit": "iter/sec",
            "range": "stddev: 0.00040757687027949196",
            "extra": "mean: 54.22581321052402 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_pyvista_roundtrip_3d",
            "value": 31.021550937058652,
            "unit": "iter/sec",
            "range": "stddev: 0.00045038740144974076",
            "extra": "mean: 32.23565456249933 msec\nrounds: 32"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_quality_3d",
            "value": 3384.9452017033423,
            "unit": "iter/sec",
            "range": "stddev: 0.000007705899318990225",
            "extra": "mean: 295.4257574086543 usec\nrounds: 3442"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_validate_3d",
            "value": 75.00721696062291,
            "unit": "iter/sec",
            "range": "stddev: 0.0001102917017463576",
            "extra": "mean: 13.332050441559208 msec\nrounds: 77"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_metric_field_set_get",
            "value": 8749.35191164542,
            "unit": "iter/sec",
            "range": "stddev: 0.0000049757655182505315",
            "extra": "mean: 114.29417974021553 usec\nrounds: 18332"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_adaptive_hmin_hmax_hausd",
            "value": 0.12582855913628602,
            "unit": "iter/sec",
            "range": "stddev: 0.03726893902002125",
            "extra": "mean: 7.947321393999999 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_metric_hgrad",
            "value": 0.0979202197213417,
            "unit": "iter/sec",
            "range": "stddev: 0.0693550813215402",
            "extra": "mean: 10.2123953852 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_optimize",
            "value": 0.4206276438948593,
            "unit": "iter/sec",
            "range": "stddev: 0.009188862830415747",
            "extra": "mean: 2.3773996181999903 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_adaptive_hmax_hgrad_angle",
            "value": 5.318710434899803,
            "unit": "iter/sec",
            "range": "stddev: 0.0004582616793596443",
            "extra": "mean: 188.0154996666666 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_metric_hmin_hausd",
            "value": 5.292948297786001,
            "unit": "iter/sec",
            "range": "stddev: 0.00019651987356729465",
            "extra": "mean: 188.93061933332925 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_uniform_angle",
            "value": 5.2315683541766145,
            "unit": "iter/sec",
            "range": "stddev: 0.0019722022711315184",
            "extra": "mean: 191.14726833333862 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_adaptive_hmin_hgrad",
            "value": 5.174311735108172,
            "unit": "iter/sec",
            "range": "stddev: 0.0011939123405950765",
            "extra": "mean: 193.26241850001225 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_metric_hmax_hausd_angle",
            "value": 2.1151249220550046,
            "unit": "iter/sec",
            "range": "stddev: 0.003119386138674587",
            "extra": "mean: 472.7853138000114 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_optimize",
            "value": 2.117296276834012,
            "unit": "iter/sec",
            "range": "stddev: 0.0017664269447668784",
            "extra": "mean: 472.30045739999014 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_uniform",
            "value": 2.8785498063199633,
            "unit": "iter/sec",
            "range": "stddev: 0.0030744950829057257",
            "extra": "mean: 347.39715039999055 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 171.90396838113534,
            "unit": "iter/sec",
            "range": "stddev: 0.000044354588682346545",
            "extra": "mean: 5.817201367817518 msec\nrounds: 174"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.298303737892375,
            "unit": "iter/sec",
            "range": "stddev: 0.00022927177815781766",
            "extra": "mean: 69.93836600000805 msec\nrounds: 15"
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
          "id": "892af5976f4e2194d4057c2512e698035d58d725",
          "message": "feat: deprecate mmgpy.Mesh in favor of the .mmg PyVista accessor (#232)\n\n* feat: deprecate mmgpy.Mesh in favor of the .mmg PyVista accessor\n\nMesh is scheduled for removal in 0.13. This PR adds the deprecation\nrunway:\n\n- DeprecationWarning on Mesh.__init__ and Mesh.checkpoint(). Internal\n  paths through Mesh._from_impl (used by mmgpy.read and the .mmg\n  accessor) stay silent so users only see the warning when they\n  actually instantiate Mesh themselves.\n- src/mmgpy/_pv_plugin.py: every accessor method now builds Mesh via\n  mmgpy._io.read instead of Mesh(...), bypassing the warning.\n- src/mmgpy/repair/_vertices.py: wraps the raw-array Mesh construction\n  with warnings.catch_warnings since _io.read doesn't accept that\n  shape; revisit when Mesh is removed.\n- pyproject.toml: filterwarnings rule so the existing 48+ Mesh-based\n  tests don't blow up. tests/deprecation_test.py overrides this with\n  pytest.warns when it actually wants to assert the warning fires.\n\nExamples:\n- 3 trivial migrations to dataset.mmg.<method>: mmg2d/local_sizing,\n  mmg2d/anisotropic_mesh_adaptation, mmgs/ellipsoid_sdf.\n- 6 examples that depend on Mesh-only patterns (move_mesh in-place\n  mutation, ELAS-bound lagrangian, slider-callback caching) get a\n  module-level warning filter and a TODO(0.13) comment until those\n  patterns have an accessor equivalent.\n\nDocs:\n- New docs/migrating-from-mesh.md: method-by-method mapping plus three\n  worked migrations (read+remesh+save, local sizing, checkpoint).\n- docs/tutorials/pyvista-integration.md: rewrites the four code blocks\n  that used to call mmgpy.Mesh(sphere)/Mesh(torus) etc. to use the\n  accessor. Field-transfer block marked skip pending follow-up.\n- docs/conftest.py: filter the deprecation so doc-block tests stay\n  green while the rest of the tutorial pages migrate.\n- CHANGELOG.md: Unreleased \"Deprecated\" entry.\n\nVerification: 938 tests pass, 91 doc-blocks pass, ruff/format clean,\nmypy clean on touched files.\n\n* Drop Mesh-deprecation suppression scaffolding\n\nRemoves the warning suppressions added alongside the initial deprecation:\n\n- Examples: port the six examples that still used Mesh to the .mmg\n  accessor. levelset_discretization (2D + 3D) and ellipsoid_levelset use\n  dataset.mmg.remesh_levelset(); lagrangian_motion (2D + 3D) use a new\n  dataset.mmg.move() accessor method that wraps the pure-Python\n  lagrangian path. interactive_remesh_preview rewritten to cache a\n  PolyData and rebuild the metric per slider tick.\n- Docs: port every tutorial and API page (concepts, quickstart,\n  installation, basic-remeshing, surface-remeshing, adaptive-sizing,\n  levelset-extraction, pyvista-integration, options, io, lagrangian,\n  api/index, examples/index). mesh-classes.md kept as the legacy\n  reference with a deprecation banner. docs/conftest.py filter dropped;\n  the doc-block harness uses Mesh._from_arrays for fixture meshes.\n- Tests: move the 16 test files that exercise Mesh behavior into\n  tests/deprecated/, each with a per-file pytestmark + an import-time\n  conftest filter so collection-time skipif predicates also stay quiet.\n  Drop the global pyproject.toml filter.\n- Internal: add Mesh._from_arrays as the silent array-construction path\n  used by repair/_vertices.py and the doc-test harness; switch\n  src/mmgpy/ui/app.py to mmgpy.read so the UI itself stays silent.\n- Accessor: extend MmgAccessor.remesh to accept a positional Options\n  object and copy non-MMG point_data through to the returned dataset\n  so transfer_fields=True survives the round-trip.\n\nFull suite (938 tests, 27 skipped) and doc-blocks (84 passed, 42\nskipped) both pass under -W error::DeprecationWarning for the Mesh\nfilters. Only suppressions left are scoped to tests/deprecated/ and\ntests/deprecation_test.py; both die in 0.13 with Mesh itself.\n\n* Address PR review: add helper, tighten conftest, log dropped fields\n\n- Add mmgpy.polydata_from_2d_triangles helper and port the four 2D\n  examples (lagrangian_motion, local_sizing, anisotropic_mesh_adaptation,\n  levelset_discretization, interactive_remesh_preview) to use it instead\n  of inlining the embed-with-z=0 PolyData construction.\n- Log a debug message in MmgAccessor's user-field round-trip when an\n  array shape no longer matches the remeshed vertex count, pointing at\n  transfer_fields=True as the fix.\n- Add a deprecation_test for dataset.mmg.move() to cover the new\n  accessor method's silent-path guarantee alongside the existing\n  remesh() check.\n- Tighten tests/deprecated/conftest.py: drop the module-level\n  warnings.filterwarnings calls now that the only collection-time Mesh\n  use (_lagrangian_available) goes through the silent _from_arrays\n  path. Filters now attach per-item and stay scoped to the directory.\n- Add a shared _ASSETS constant in tests/deprecated/mesh_unified_test.py\n  in place of nine repeated parent.parent.parent expressions.\n- CHANGELOG: document the new public API surface (accessor move(),\n  positional opts on remesh(), user-field round-trip preservation,\n  polydata_from_2d_triangles).\n\n* Address review: typed remesh opts, dedupe deprecation filters, rename ndim constant\n\n- _pv_plugin.MmgAccessor.remesh: type opts as Mmg2DOptions | Mmg3DOptions\n  | MmgSOptions | None instead of Any, drop the ANN401 noqa.\n- tests/deprecated: drop the per-file pytestmark blocks. The conftest\n  pytest_collection_modifyitems hook is now the single source of truth\n  for the Mesh-deprecation filter.\n- _pyvista.polydata_from_2d_triangles: stop reusing _DIMS_2D for both\n  ndarray rank and 2D coordinate count; introduce _NDIM_2D_ARRAY for the\n  rank check.",
          "timestamp": "2026-05-05T20:51:49+02:00",
          "tree_id": "d43a17b4d20e9919504fd7af1148a365144a9db8",
          "url": "https://github.com/kmarchais/mmgpy/commit/892af5976f4e2194d4057c2512e698035d58d725"
        },
        "date": 1778007553175,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_construction_3d",
            "value": 38.86278464309174,
            "unit": "iter/sec",
            "range": "stddev: 0.00037928643287475893",
            "extra": "mean: 25.731558075001715 msec\nrounds: 40"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_io_roundtrip_3d",
            "value": 20.30658385206087,
            "unit": "iter/sec",
            "range": "stddev: 0.00020611567400770925",
            "extra": "mean: 49.24511219047374 msec\nrounds: 21"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_pyvista_roundtrip_3d",
            "value": 33.79044532871958,
            "unit": "iter/sec",
            "range": "stddev: 0.00018409688488282448",
            "extra": "mean: 29.594164571428955 msec\nrounds: 35"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_quality_3d",
            "value": 3407.325500340894,
            "unit": "iter/sec",
            "range": "stddev: 0.000009146899566077109",
            "extra": "mean: 293.4853156529814 usec\nrounds: 3469"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_validate_3d",
            "value": 71.63840605096671,
            "unit": "iter/sec",
            "range": "stddev: 0.00015945672125965583",
            "extra": "mean: 13.958992880000096 msec\nrounds: 75"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_metric_field_set_get",
            "value": 8435.72639531728,
            "unit": "iter/sec",
            "range": "stddev: 0.000014288648686282129",
            "extra": "mean: 118.54343694161366 usec\nrounds: 16453"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_adaptive_hmin_hmax_hausd",
            "value": 0.1115460077196682,
            "unit": "iter/sec",
            "range": "stddev: 0.13147013975828797",
            "extra": "mean: 8.964910716600002 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_metric_hgrad",
            "value": 0.09198695801417853,
            "unit": "iter/sec",
            "range": "stddev: 0.050812705568685654",
            "extra": "mean: 10.871106313200006 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_optimize",
            "value": 0.3966290273364104,
            "unit": "iter/sec",
            "range": "stddev: 0.011536721161265867",
            "extra": "mean: 2.5212476421999894 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_adaptive_hmax_hgrad_angle",
            "value": 5.08155082375969,
            "unit": "iter/sec",
            "range": "stddev: 0.0013378405783992001",
            "extra": "mean: 196.790317499989 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_metric_hmin_hausd",
            "value": 5.081129970340315,
            "unit": "iter/sec",
            "range": "stddev: 0.0019679843983538294",
            "extra": "mean: 196.80661700000238 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_uniform_angle",
            "value": 5.118404136732077,
            "unit": "iter/sec",
            "range": "stddev: 0.0013786897639412959",
            "extra": "mean: 195.3733963333472 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_adaptive_hmin_hgrad",
            "value": 5.026891014165072,
            "unit": "iter/sec",
            "range": "stddev: 0.0016250106565036874",
            "extra": "mean: 198.93011350000242 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_metric_hmax_hausd_angle",
            "value": 1.8425221298138912,
            "unit": "iter/sec",
            "range": "stddev: 0.011484246644520376",
            "extra": "mean: 542.7343225999721 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_optimize",
            "value": 1.8940896842161463,
            "unit": "iter/sec",
            "range": "stddev: 0.01128696733052011",
            "extra": "mean: 527.9581048000068 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_uniform",
            "value": 2.6621758897225534,
            "unit": "iter/sec",
            "range": "stddev: 0.008671875221193778",
            "extra": "mean: 375.63258079999287 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 159.63684625993682,
            "unit": "iter/sec",
            "range": "stddev: 0.0005031374141122924",
            "extra": "mean: 6.264217963637913 msec\nrounds: 165"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 13.349237347723019,
            "unit": "iter/sec",
            "range": "stddev: 0.0005349332068046307",
            "extra": "mean: 74.91064650000924 msec\nrounds: 14"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "yves.chemisky@gmail.com",
            "name": "Yves Chemisky",
            "username": "chemiskyy"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "a8cd4389e2de3fdbf5a54f6ab25cbe0b88fb3e1a",
          "message": "Add elasticity propagation & Hessian recovery (#205)\n\n* Add elasticity propagation & Hessian recovery\n\nIntroduce elasticity-based displacement propagation and Hessian recovery for adaptive remeshing.\n\n- Add propagate_displacement_elasticity in lagrangian.py: a fedoo-backed linear elasticity solver (optional dependency) to propagate boundary displacements; includes element-type handling, input validation, and extraction of displacement components.\n- Extend move_mesh to accept propagation_method (\"laplacian\" or \"elasticity\"), validate the option, and call the appropriate propagator while keeping laplacian as the default.\n- Export propagate_displacement_elasticity from package __init__.\n- Add compute_hessian in metrics.py: patch-based least-squares Hessian recovery for 2D/3D scalar fields, returning tensor components suitable for metric creation.\n- Add tests: tests/elasticity_test.py (fedoo-dependent tests for propagation and move_mesh integration) and tests/hessian_test.py (unit tests for Hessian recovery and metric pipeline).\n\nThese changes enable physically meaningful displacement propagation for large deformations (via fedoo) and provide Hessian computation to support solution-adaptive remeshing.\n\n* fix(lagrangian, metrics): unblock CI and add examples for elasticity & Hessian\n\nPre-commit / CI fixes:\n- pyproject.toml: extend ruff per-file-ignores for lagrangian.py\n  (C901, PLR0912/13/15, PLR2004) and metrics.py (PLR0912), matching\n  the existing math-heavy module pattern.\n- Drop unused noqa: N803 (lagrangian) and N806 (metrics) directives,\n  reword inline comments that ruff's ERA001 was flagging as\n  commented-out code.\n- tests/elasticity_test.py: tag the post-importorskip imports with\n  noqa: E402, the standard pytest.importorskip pattern.\n\nHessian recovery bugs surfaced by tests/hessian_test.py:\n- compute_hessian was producing zeroed second derivatives on interior\n  patches because the linear (h) and quadratic (h^2) monomial columns\n  have wildly different magnitudes; lstsq's default rcond was\n  truncating the small singular values that carry the H signal. Scale\n  the centered patch coords by the patch radius and unscale the\n  recovered Hessian.\n- The 1-ring around boundary vertices on a structured grid often spans\n  only two distinct values along an axis, making y and y^2 colinear\n  (rank 4 with 5 unknowns) and steering the min-norm lstsq solution\n  away from the truth even on a linear field. Always use the 2-ring\n  patch.\n\nElasticity propagation:\n- lagrangian.py: fedoo's ModelingSpace does not accept \"2Dstrain\";\n  use \"2Dplane\" (plane strain), the standard fictitious-elasticity\n  assumption for 2D mesh motion. Verified the full elasticity test\n  suite with fedoo installed.\n\nAPI surface:\n- _pv_plugin.PvMeshAccessor.move now forwards propagation_method so the\n  elasticity option is reachable from the high-level .mmg.move() API.\n- pyproject.toml: pin fedoo>=0.8.3,<1 in the fem extra so users get\n  a fedoo new enough to expose the \"2Dplane\" dimension name.\n\nExamples:\n- examples/mmg2d/elasticity_propagation.py: side-by-side comparison of\n  Laplacian and elasticity propagation under a sheared boundary; the\n  elasticity panel auto-skips with a hint when fedoo is missing.\n- examples/mmg2d/hessian_adaptation.py: solution-adaptive remeshing on\n  a sharp circular front via compute_hessian +\n  create_metric_from_hessian; the adapted mesh refines along the front\n  and coarsens elsewhere.\n\nVerification: 946 tests pass, 10 elasticity tests pass with fedoo\ninstalled locally, both new examples run end-to-end, full pre-commit\nclean.\n\n* docs(examples): add 3D counterparts for elasticity & Hessian demos\n\n- examples/mmg3d/elasticity_propagation.py: tetrahedral unit cube with\n  z=0 pinned and z=1 stretched + sheared, run through both\n  propagation_method=\"laplacian\" and \"elasticity\" to compare interior\n  fields side by side. Falls back gracefully when fedoo is missing.\n- examples/mmg3d/hessian_adaptation.py: solution-adaptive 3D remeshing\n  on a sharp spherical front via compute_hessian +\n  create_metric_from_hessian; visualizes a centre slice of both the\n  uniform and adapted meshes so interior refinement is visible.\n\nBoth verified end-to-end locally (Laplacian + elasticity with fedoo\ninstalled; adapted mesh refines on the front and coarsens elsewhere).\n\n* feat(examples): add animated demos and Hessian visualisations\n\nReplaces the static-plot motion examples with proper side-by-side\nanimations comparing Laplacian and elasticity propagation on a\ncantilever, plus polished single-image Hessian-adaptation demos.\n\n- examples/mmg2d/elasticity_propagation.py: L-bracket cantilever\n  animation. The free tip of the foot is pinned, the post top is\n  pulled upward; Laplacian shows a rigid 90-degree pivot, elasticity\n  shows actual cantilever bending. Triangles coloured by displacement\n  magnitude with the matplotlib viridis cmap.\n- examples/mmg3d/elasticity_propagation.py: 3D L-bracket animation\n  rendered via PyVista as a tilted-top-down side-by-side view. The\n  camera frame is sized to the worst-case deformed bounding box so\n  the bracket stays in frame across every step of the loop.\n- examples/mmg3d/elasticity_propagation_blender.gif: Blender-rendered\n  counterpart to the PyVista 3D animation. Curve-bevel wireframe gives\n  a continuous, gap-free triangulation that the Wireframe modifier\n  never produced cleanly, EEVEE PBR keeps the viridis colours\n  saturated, the camera frames both panels with identical perspective\n  via separate render passes, and pill-style text labels stay legible\n  on light or dark backgrounds. The script that generated it is not\n  committed.\n- examples/mmg2d/hessian_adaptation.py and\n  examples/mmg3d/hessian_adaptation.py: write the rendered output\n  alongside the script so the static visualisation is browsable in\n  the repo. The 3D version clips a corner of the cube so the\n  spherical front and the interior refinement of the adapted mesh\n  are visible.\n\nsrc/mmgpy/lagrangian.py: drop the bounding-box auto-pin from\npropagate_displacement_elasticity. The previous behaviour silently\nfixed every node on the mesh's axis-aligned bounding faces to zero\nunless they were in boundary_mask, which forced \"constrained box\"\nsemantics on every problem and made the 3D demo fall flat. Now the\nsolver only constrains what the caller marks; matches the Laplacian\nvariant. Callers must ensure boundary_mask removes rigid body modes.\n\ntests/elasticity_test.py: add coverage for the previously-missed\nnew lines:\n- TestFedooMissing: verifies the helpful ImportError when fedoo is\n  uninstalled (monkeypatch __import__).\n- TestUnsupportedElementType: 2D and 3D unsupported element-shape\n  checks reach the per-dimension element-type lookup.\n- TestPvAccessorMove: drives propagation_method=\"elasticity\" through\n  the dataset.mmg.move() accessor, covering the new parameter\n  forwarding path in src/mmgpy/_pv_plugin.py.\n\n* docs(examples): drop redundant PyVista 3D L-bracket demo\n\nThe animated 3D L-bracket GIF supersedes the PyVista variant; remove\nthe old PyVista script + GIF and rename the rendered output to the\nneutral elasticity_propagation.gif slot.\n\n* docs(examples): transparent backgrounds + Blender-rendered 3D Hessian\n\n- Restore the 3D L-bracket PyVista example so users have a runnable\n  script for the case (the canonical animated GIF is rendered\n  separately at higher fidelity); the script now drives the animation\n  interactively rather than overwriting the committed GIF.\n- Switch the 2D elasticity GIF to a transparent-background pipeline:\n  matplotlib renders each frame to a transparent PNG, then PIL stitches\n  them into a GIF whose palette reserves one slot for fully transparent\n  pixels (matplotlib's PillowWriter bakes in the figure facecolour and\n  cannot do this).\n- Save the 2D Hessian PNG with transparent figure + axes backgrounds.\n- Replace the 3D Hessian PNG with a Blender render: the cube is sliced\n  in half along x=0.5 so the cut face passes through the sphere's\n  centre, exposing the analytic front clearly. Uniform mesh shows a\n  blocky cross-section, the Hessian-adapted mesh shows refinement\n  concentrating along the front. Pill-style labels stay legible on\n  light or dark themes; rendering script not committed.\n\n* ci: install fedoo extra so elasticity tests actually run on coverage\n\nThe elasticity tests (and the matching new branches in\nsrc/mmgpy/lagrangian.py and src/mmgpy/_pv_plugin.py) all guard on\n``pytest.importorskip(\\\"fedoo\\\")`` because fedoo is an optional\ndependency. CI was running ``uv sync`` without ``--extra fem``, so\nfedoo wasn't installed, the entire elasticity test module was skipped,\nand codecov saw the new propagation_method / propagate_displacement_\nelasticity branches as untested (lagrangian.py patch coverage at\n6.89%). Adding ``--extra fem`` brings fedoo in, the elasticity tests\nrun, and the patch climbs above the 70% codecov threshold.\n\n* docs: add Hessian adaptation and elasticity propagation tutorials\n\nMove the rendered PNGs and GIFs from examples/ into docs/assets/ and\nadd tutorial pages that walk through both new features (compute_hessian\n+ create_metric_from_hessian for solution-adaptive remeshing, and\npropagate_displacement_elasticity for fedoo-backed mesh motion). Wire\nthe pages into mkdocs nav, the API references, and the examples gallery.\n\nRe-rendered the 3D Hessian PNG with a half-cube cell-centroid filter\n(no clipping) so the uniform mesh keeps its regular tetrahedral grid\nstructure on the cut face, and bumped 2D Hessian edge thickness for\nreadability.\n\n* docs: skip new code blocks in pytest, embed assets on API pages\n\nThe new tutorial and gallery snippets reference undefined variables\n(vertices, triangles, field, ...), which broke pytest-codeblocks on\nUbuntu 3.14. Mark them as skip. Also embed the rendered Hessian PNGs\nand elasticity GIFs directly on the metrics and lagrangian API pages\nso the visual context shows up next to the function reference.\n\n* docs: bump 3D Hessian render to a 19^3 grid for finer detail\n\n* test: build elasticity test meshes with fedoo\n\nAddress PR review by Yves Chemisky:\n\n- create_2d_test_mesh now uses fd.mesh.rectangle_mesh(elm_type='tri3') to\n  build a 3x3 grid (9 nodes, 8 triangles) instead of a hand-rolled 5-node\n  fan. Tests use a new box_boundary_mask helper instead of hard-coded\n  index 4 for the interior point.\n- create_3d_hex_mesh added for the propagation-only test, using\n  fd.mesh.box_mesh(elm_type='hex8'). The pre-existing tet helper stays\n  (with a comment) for tests that round-trip through MMG3D or\n  pv.CellType.TETRA, since fedoo ships no tet generator.\n- TestUnsupportedElementType now uses real fedoo elements (quad9 in 2D,\n  hex20 in 3D) instead of fabricated 5-node connectivity.\n\n* perf: vectorize vertex adjacency in compute_hessian\n\nReplace the per-element nested-loop set construction in compute_hessian\nwith a vectorized scipy.sparse build, plus a closed 2-ring computed as\nthe nonzero pattern of (I + A + A @ A).\n\nOn the 19^3 tetrahedral grid used by the docs gallery (6859 verts,\n~35k tets), the topology-setup portion drops from ~68 ms to ~13 ms\n(adjacency 38 ms -> 6 ms, 2-ring 30 ms -> 7 ms). The remaining\ncompute_hessian time is the per-vertex LSQ loop, which is unchanged.\n\nThe new helpers live in src/mmgpy/_topology.py so the same primitives\ncan be shared with lagrangian.py in a follow-up.\n\n* refactor: share vertex adjacency helper with lagrangian\n\nDrop the duplicate _build_adjacency_from_elements (the same per-element\nnested-loop set construction lived here and in metrics.py) and call\nmmgpy._topology.vertex_adjacency from propagate_displacement instead.\n\n_build_laplacian_system now consumes the CSR adjacency directly:\npermute the matrix into [interior | boundary] blocks, then read the\ngraph Laplacian D - A as two CSR slices. This removes ~60 lines of\nmanual COO assembly and the int->local-index dictionaries.\n\nPure refactor: behaviour is unchanged (laplacian smoothing tests pass).\n\n* test: drop TestBuildAdjacency from deprecated lagrangian_test\n\nThe previous commit removed _build_adjacency_from_elements from\nmmgpy.lagrangian; CI surfaced that this deprecated test file still\nimported it, breaking collection. The class only exercised the now\ninlined helper, and the file is slated for removal in 0.13, so just\ndrop the import and the class. Adjacency behaviour stays covered by\nTestPropagateDisplacement (same file) and tests/elasticity_test.py.\n\n* test: build the 3D tet test mesh from fedoo via pv.triangulate\n\nDrop the hand-rolled 9-vertex / 12-tet table for create_3d_test_mesh.\nThe mesh now comes from fd.mesh.box_mesh(elm_type='hex8') run through\npv.UnstructuredGrid(...).triangulate(), which leans on VTK's\nvtkDataSetTriangleFilter for a face-conforming 6-tet split (no Steiner\npoints: 27 nodes -> 27 nodes, 8 hexes -> 48 tets).\n\nThis finishes addressing the review comment about leaning on fedoo for\ntest mesh construction: every test mesh in the file is now built from\nfedoo primitives. The two tests that round-trip through MMG3D /\npv.CellType.TETRA also pick up box_boundary_mask in place of hard-coded\nindices into the old 9-node fan structure.\n\n* docs: drop ELAS / iscd-linearelasticity install caveats\n\nPyPI and conda-forge now expose the same Lagrangian motion surface via\nmove_mesh: Laplacian propagator out of the box, elasticity propagator\nthrough the optional [fem] extra (fedoo). Remove the comparison-table\nrow and the conda-forge ELAS pitch from README and installation.md, and\nmention Hessian recovery alongside anisotropic adaptation.\n\n* review: address PR #205 feedback\n\n- lagrangian: clarify propagate_displacement_elasticity docstring (vertices outside the mask are free DOFs, not zero) and note that E does not affect a Dirichlet-only solve\n- metrics: drop the unreachable LinAlgError catch around lstsq, skip vertices whose patch is too small to determine the quadratic fit\n- _topology: drop redundant setdiag/eliminate_zeros, document the duplicate-edge collapse\n- examples: switch the 2D animation/plot scripts to ImageFont.load_default so they work off Debian/Ubuntu\n- tests: add a 2D cantilever case asserting elasticity and Laplacian fields differ in the interior\n\n---------\n\nCo-authored-by: Kevin Marchais <kevinmarchais@gmail.com>",
          "timestamp": "2026-05-07T10:38:11+02:00",
          "tree_id": "c14ebccdf67e1fd216de0c9ac968142fac2ef228",
          "url": "https://github.com/kmarchais/mmgpy/commit/a8cd4389e2de3fdbf5a54f6ab25cbe0b88fb3e1a"
        },
        "date": 1778143526831,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_construction_3d",
            "value": 41.281304687377876,
            "unit": "iter/sec",
            "range": "stddev: 0.00035344622097632344",
            "extra": "mean: 24.224040581395645 msec\nrounds: 43"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_io_roundtrip_3d",
            "value": 21.7200763904563,
            "unit": "iter/sec",
            "range": "stddev: 0.00023319313183002905",
            "extra": "mean: 46.04035372727304 msec\nrounds: 22"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_pyvista_roundtrip_3d",
            "value": 35.21297177020939,
            "unit": "iter/sec",
            "range": "stddev: 0.00016375665678474474",
            "extra": "mean: 28.398625555540647 msec\nrounds: 36"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_quality_3d",
            "value": 3413.85244329816,
            "unit": "iter/sec",
            "range": "stddev: 0.000007363764386352385",
            "extra": "mean: 292.92420120943746 usec\nrounds: 3474"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_validate_3d",
            "value": 70.51434515348322,
            "unit": "iter/sec",
            "range": "stddev: 0.00013659986263670122",
            "extra": "mean: 14.181511546670057 msec\nrounds: 75"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_metric_field_set_get",
            "value": 8728.391020550103,
            "unit": "iter/sec",
            "range": "stddev: 0.000006086977676392013",
            "extra": "mean: 114.56865276150008 usec\nrounds: 16493"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_adaptive_hmin_hmax_hausd",
            "value": 0.11244073100084966,
            "unit": "iter/sec",
            "range": "stddev: 0.11787744782139829",
            "extra": "mean: 8.89357434000001 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_metric_hgrad",
            "value": 0.09294452319484797,
            "unit": "iter/sec",
            "range": "stddev: 0.10014541867862488",
            "extra": "mean: 10.75910624559997 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_optimize",
            "value": 0.40058238500196475,
            "unit": "iter/sec",
            "range": "stddev: 0.005278600659091915",
            "extra": "mean: 2.4963653856000065 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_adaptive_hmax_hgrad_angle",
            "value": 5.276974425605238,
            "unit": "iter/sec",
            "range": "stddev: 0.00020184599393068445",
            "extra": "mean: 189.50252916666463 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_metric_hmin_hausd",
            "value": 5.2734659895922364,
            "unit": "iter/sec",
            "range": "stddev: 0.0003377944503366502",
            "extra": "mean: 189.6286051666228 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_uniform_angle",
            "value": 5.263971016645965,
            "unit": "iter/sec",
            "range": "stddev: 0.00024346984058328154",
            "extra": "mean: 189.97065083332623 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_adaptive_hmin_hgrad",
            "value": 5.266755074593142,
            "unit": "iter/sec",
            "range": "stddev: 0.0013016630057930145",
            "extra": "mean: 189.87023049999152 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_metric_hmax_hausd_angle",
            "value": 2.0205069967526366,
            "unit": "iter/sec",
            "range": "stddev: 0.00971600358127212",
            "extra": "mean: 494.9252844000057 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_optimize",
            "value": 2.0662371810030042,
            "unit": "iter/sec",
            "range": "stddev: 0.0019417341913035798",
            "extra": "mean: 483.97154460001275 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_uniform",
            "value": 2.8195438070714927,
            "unit": "iter/sec",
            "range": "stddev: 0.0043707403062812926",
            "extra": "mean: 354.6673037999881 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 164.22787558122923,
            "unit": "iter/sec",
            "range": "stddev: 0.000017588281618015117",
            "extra": "mean: 6.089100260603367 msec\nrounds: 165"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 13.54108374820221,
            "unit": "iter/sec",
            "range": "stddev: 0.0002668254437425594",
            "extra": "mean: 73.8493327856986 msec\nrounds: 14"
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
          "id": "6bb9ce356f646c3ad915f4e6a2becd2775a6406f",
          "message": "ci(daily-docs): drop main-conftest overlay, bound runtime, skip Trame (#234)\n\n* fix(ci): unblock daily docs test against released package\n\nThe patched conftest from main calls ``Mesh._from_arrays``, which only\nexists on main; against the latest PyPI build (v0.11.0) every code-block\ntest fails with ``type object 'Mesh' has no attribute '_from_arrays'``.\nFall back to the public ``Mesh(vertices, cells)`` constructor when the\nprivate factory is absent so the conftest stays compatible with both\nAPIs until the next release ships.\n\nAlso stop the examples loop from burning the full 6h job budget when an\nexample hangs: ``examples/mmg2d/interactive_remesh_preview.py`` calls\n``app.run()`` (Trame server) which never returns headlessly, so skip it,\nwrap each remaining example in a 5-minute ``timeout``, and cap the whole\njob at 30 minutes.\n\n* ci(daily-docs): drop main-conftest overlay, bound runtime, skip Trame\n\nThe Daily Docs Test mixed v0.11.0 (checkout + install) with main's\nconftest.py, which caused two failure modes:\n\n* the conftest overlay drifted from the released API and broke the\n  job today (``Mesh._from_arrays`` doesn't exist in v0.11.0);\n* the examples loop had no per-step timeout, so the Trame-based\n  ``interactive_remesh_preview.py`` hung jobs at the full 6h budget.\n\nv0.12 will ship with the VTK-safe conftest already in main, so the\noverlay is no longer needed. Drop the patch step entirely; the daily\njob now runs with a coherent (released-tag, released-binary,\nreleased-conftest) triple. Skip the Trame example permanently — it\ncalls ``app.run()`` and has no headless contract — wrap every other\nexample in a 5-minute ``timeout``, and cap the whole job at 30 minutes.\n\n* ci(daily-docs): drop VTK dev headers and Xvfb\n\nModern ``vtk`` wheels (9.2+) ship their own OSMesa, so the off-screen\npath under ``PYVISTA_OFF_SCREEN=true`` no longer needs a fake X\ndisplay. ``libgl1-mesa-dev`` is the dev (header) package, of no use\nat runtime — runtime ``libgl1`` is already on ubuntu-24.04 runners,\nand the project no longer compiles against system VTK headers\n(#204), so nothing in this job needs them.\n\n* Revert \"ci(daily-docs): drop VTK dev headers and Xvfb\"\n\nThis reverts commit 79f550dfe8477e485c3520697872606f552d75b1.",
          "timestamp": "2026-05-07T10:23:10Z",
          "tree_id": "5b0fbfae97dedf8e5a19a3f49b901d5f003e19e9",
          "url": "https://github.com/kmarchais/mmgpy/commit/6bb9ce356f646c3ad915f4e6a2becd2775a6406f"
        },
        "date": 1778149820038,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_construction_3d",
            "value": 32.214242471267255,
            "unit": "iter/sec",
            "range": "stddev: 0.00024005468217105748",
            "extra": "mean: 31.04217027272725 msec\nrounds: 33"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_io_roundtrip_3d",
            "value": 17.99676396777123,
            "unit": "iter/sec",
            "range": "stddev: 0.0003070287783655511",
            "extra": "mean: 55.565545105264995 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_pyvista_roundtrip_3d",
            "value": 28.839961712258194,
            "unit": "iter/sec",
            "range": "stddev: 0.00034130611922861774",
            "extra": "mean: 34.67410983333442 msec\nrounds: 30"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_quality_3d",
            "value": 3367.8635610506185,
            "unit": "iter/sec",
            "range": "stddev: 0.000006184401817162477",
            "extra": "mean: 296.9241425231745 usec\nrounds: 3424"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_validate_3d",
            "value": 73.6743039762307,
            "unit": "iter/sec",
            "range": "stddev: 0.00011953391884028486",
            "extra": "mean: 13.57325344156121 msec\nrounds: 77"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_metric_field_set_get",
            "value": 7633.612218661208,
            "unit": "iter/sec",
            "range": "stddev: 0.000017764232300965347",
            "extra": "mean: 130.999580716897 usec\nrounds: 17995"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_adaptive_hmin_hmax_hausd",
            "value": 0.12003173786932322,
            "unit": "iter/sec",
            "range": "stddev: 0.32940752354137304",
            "extra": "mean: 8.331129897400013 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_metric_hgrad",
            "value": 0.09887800630759659,
            "unit": "iter/sec",
            "range": "stddev: 0.13290258344641526",
            "extra": "mean: 10.113472523799988 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_optimize",
            "value": 0.338352576538818,
            "unit": "iter/sec",
            "range": "stddev: 0.05116366986262213",
            "extra": "mean: 2.955496926400008 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_adaptive_hmax_hgrad_angle",
            "value": 5.241189494943681,
            "unit": "iter/sec",
            "range": "stddev: 0.0013490417969444978",
            "extra": "mean: 190.7963833333497 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_metric_hmin_hausd",
            "value": 5.270312325226262,
            "unit": "iter/sec",
            "range": "stddev: 0.0017492912774713814",
            "extra": "mean: 189.74207566665768 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_uniform_angle",
            "value": 5.278044884235071,
            "unit": "iter/sec",
            "range": "stddev: 0.0009852463201348825",
            "extra": "mean: 189.46409549999998 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_adaptive_hmin_hgrad",
            "value": 5.1153013956937805,
            "unit": "iter/sec",
            "range": "stddev: 0.0016392037489786813",
            "extra": "mean: 195.4919021666702 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_metric_hmax_hausd_angle",
            "value": 2.059249667994214,
            "unit": "iter/sec",
            "range": "stddev: 0.009866312926005882",
            "extra": "mean: 485.61377260001564 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_optimize",
            "value": 2.0675098970221235,
            "unit": "iter/sec",
            "range": "stddev: 0.005103208967796632",
            "extra": "mean: 483.6736217999828 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_uniform",
            "value": 2.818963986432216,
            "unit": "iter/sec",
            "range": "stddev: 0.0036601880908335572",
            "extra": "mean: 354.7402537999915 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 169.4512977154638,
            "unit": "iter/sec",
            "range": "stddev: 0.00011611016968799224",
            "extra": "mean: 5.901400658961976 msec\nrounds: 173"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 13.69637056105738,
            "unit": "iter/sec",
            "range": "stddev: 0.0062092217522417125",
            "extra": "mean: 73.01204326665054 msec\nrounds: 15"
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
          "id": "83437128c2ca90f18917518732e89a5878ffd9d5",
          "message": "chore: route remesh_lagrangian through move_mesh, drop ELAS-bound code (#233)\n\n* chore: drop the dead -lag / ELAS surface\n\nmmgpy ships its wheels with USE_ELAS=OFF (extern/CMakeLists.txt:42), so\nremesh_lagrangian and the -lag CLI flag could never succeed against the\nbundled MMG. Now that mmgpy.move_mesh covers Lagrangian motion via the\nLaplacian and (optional) fedoo elasticity propagators, the bound ELAS\nsurface is dead code in every shipped artifact.\n\n- C++ bindings: drop MmgMesh*.remesh_lagrangian methods, MMG3D_mmg3dmov /\n  MMG2D_mmg2dmov callsites, the MMG3D/2D_IPARAM_lag table entries, and the\n  lag>-1 branches in MmgMesh{,_2D}::remesh.\n- Python wrappers: remove Mesh.remesh_lagrangian, the .mmg.remesh_lagrangian\n  accessor, _progress.remesh_mesh_lagrangian, the -lag CLI flag, and the\n  related .pyi stubs. Drop the UI's \"Lagrangian Motion\" mode.\n- Tests: drop TestLagrangianRemeshing in mesh_{2,3}d_test, the deprecated\n  lagrangian_test module entirely, and the lag-only entries in\n  pv_plugin_test, cli_test, and the deprecated progress / remesh_result /\n  warning_capture / mesh_unified suites.\n- Docs: rewrite docs/api/lagrangian.md around dataset.mmg.move(...), strip\n  the ELAS-bound path from getting-started, examples, tutorials, the\n  migration table, and update the MMG API coverage table to flag\n  MMG{3,2}D_mmg{3,2}dmov as skipped.\n- Add a conda-forge install note (mmgpy[fem] is not available there;\n  install fedoo from PyPI or the set3MAH channel).\n\nSweep verified: only extern/CMakeLists.txt's \"USE_ELAS OFF\" line and the\ntwo deliberate doc table entries reference the removed surface.\nFull test suite passes (937 passed, 15 skipped).\n\n* shim: keep remesh_lagrangian alive as deprecation forwards\n\nPR #205 stopped at hard deletion of every remesh_lagrangian entry point,\nwhich would break callers on upgrade. The Python wrappers now survive as\nthin deprecation shims that route through the no-ELAS code path\n(mmgpy.move_mesh / dataset.mmg.move). The C++ side stays removed: the\nELAS-bound MMG3D_mmg3dmov / MMG2D_mmg2dmov implementations could never\nsucceed against the wheels we ship (USE_ELAS=OFF) and there is no\nin-process replacement for them.\n\nShims and their behaviour:\n\n- `Mesh.remesh_lagrangian(displacement, **opts)` and\n  `dataset.mmg.remesh_lagrangian(displacement, **opts)` emit a\n  DeprecationWarning, forward through `move_mesh` / `move`, and return\n  the same object types they used to (RemeshResult / dataset).\n- `mmgpy.progress.remesh_mesh_lagrangian(...)` is restored as a\n  deprecation alias that wraps `move_mesh` and continues to emit the\n  init/options/remesh progress events.\n- The `mmg -lag <val>` CLI flag is restored. Internally it now calls\n  `mmgpy.move_mesh` on the mesh's `displacement` field; externally the\n  invocation, the help line, and the output behave the same way they\n  did when MMG was built with USE_ELAS=ON, so users get the feature\n  back without noticing the implementation change.\n\nTests:\n- New `tests/deprecation_lagrangian_shims_test.py` pins each shim down:\n  warns + forwards (accessor / Mesh / progress), and the surface-mesh\n  rejection path still raises TypeError.\n- Restore `tests/cli_test.py::TestParseArgs::test_lagrangian_flag` and\n  the `hasattr(progress, 'remesh_mesh_lagrangian')` assertion in the\n  deprecated progress smoke test.\n- `<!-- pytest-codeblocks:skip -->` markers on the install-instruction\n  bash blocks in docs/tutorials/elasticity-propagation.md so the doc\n  smoke run doesn't try to invoke conda / pip in the test sandbox.\n\nDocs:\n- docs/api/lagrangian.md gets a \"Deprecated: remesh_lagrangian\" warning\n  block calling out the shim status and pointing at move / move_mesh.\n- docs/api/mesh-classes.md restores `remesh_lagrangian` in the rendered\n  member list.\n\nVerified: full pytest run (942 passed, 15 skipped), `pytest --codeblocks\ndocs/` (84 passed, 50 skipped), ruff clean. Sweep matches only the\nintentional docstring / docstring-test references plus\n`extern/CMakeLists.txt`'s \"USE_ELAS OFF\" line.\n\n* fix(_mesh): narrow self._impl with cast() in remesh_lagrangian shim\n\nThe previous version relied on a `# type: ignore[union-attr]` comment\nthat mypy honors but ty does not, so CI's ty hook flagged the\nget_tetrahedra/get_triangles conditional as unresolved-attribute. Match\nthe existing pattern in this file (cast(\"MmgMesh3D\", self._impl) in the\n3D branch) so the shim type-checks under ty without ignore comments.",
          "timestamp": "2026-05-07T13:21:40+02:00",
          "tree_id": "f75b24c9154b51d1cbcc812dfbcce573d2798542",
          "url": "https://github.com/kmarchais/mmgpy/commit/83437128c2ca90f18917518732e89a5878ffd9d5"
        },
        "date": 1778153321629,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_construction_3d",
            "value": 33.243404099732174,
            "unit": "iter/sec",
            "range": "stddev: 0.00047204348490066",
            "extra": "mean: 30.081155257143372 msec\nrounds: 35"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_io_roundtrip_3d",
            "value": 17.72680162409054,
            "unit": "iter/sec",
            "range": "stddev: 0.0004734653921697398",
            "extra": "mean: 56.41175555555438 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_pyvista_roundtrip_3d",
            "value": 27.79518986680446,
            "unit": "iter/sec",
            "range": "stddev: 0.0006728182985454232",
            "extra": "mean: 35.97744806896573 msec\nrounds: 29"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_quality_3d",
            "value": 3397.1339851095463,
            "unit": "iter/sec",
            "range": "stddev: 0.000006662661672789829",
            "extra": "mean: 294.36578138608604 usec\nrounds: 3449"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_validate_3d",
            "value": 75.5098325147736,
            "unit": "iter/sec",
            "range": "stddev: 0.00005612027789836346",
            "extra": "mean: 13.243308410257017 msec\nrounds: 78"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_metric_field_set_get",
            "value": 7170.819662751425,
            "unit": "iter/sec",
            "range": "stddev: 0.00000672880954759865",
            "extra": "mean: 139.45407178407586 usec\nrounds: 16675"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_adaptive_hmin_hmax_hausd",
            "value": 0.12698754936872803,
            "unit": "iter/sec",
            "range": "stddev: 0.026490276432799064",
            "extra": "mean: 7.874787764399997 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_metric_hgrad",
            "value": 0.10365970122815045,
            "unit": "iter/sec",
            "range": "stddev: 0.10329985842117193",
            "extra": "mean: 9.646950436400004 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_optimize",
            "value": 0.33903385034644296,
            "unit": "iter/sec",
            "range": "stddev: 0.009025490816826614",
            "extra": "mean: 2.9495579836000045 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_adaptive_hmax_hgrad_angle",
            "value": 5.173685427000069,
            "unit": "iter/sec",
            "range": "stddev: 0.0013349193755195204",
            "extra": "mean: 193.2858141666808 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_metric_hmin_hausd",
            "value": 5.2404086784765385,
            "unit": "iter/sec",
            "range": "stddev: 0.001799307178059502",
            "extra": "mean: 190.82481183332334 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_uniform_angle",
            "value": 5.313974204107399,
            "unit": "iter/sec",
            "range": "stddev: 0.00026198609656649007",
            "extra": "mean: 188.18307383333868 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_adaptive_hmin_hgrad",
            "value": 5.070677168907111,
            "unit": "iter/sec",
            "range": "stddev: 0.0016834149816345489",
            "extra": "mean: 197.21231833331862 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_metric_hmax_hausd_angle",
            "value": 2.0925574249872705,
            "unit": "iter/sec",
            "range": "stddev: 0.002607121945366838",
            "extra": "mean: 477.8841373999967 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_optimize",
            "value": 2.0722305405447643,
            "unit": "iter/sec",
            "range": "stddev: 0.003833961972922258",
            "extra": "mean: 482.5717893999922 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_uniform",
            "value": 2.8503743435675117,
            "unit": "iter/sec",
            "range": "stddev: 0.0022959158608428796",
            "extra": "mean: 350.83111180000515 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 171.86162123017812,
            "unit": "iter/sec",
            "range": "stddev: 0.00003695010048496201",
            "extra": "mean: 5.818634741381135 msec\nrounds: 174"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.262295596346611,
            "unit": "iter/sec",
            "range": "stddev: 0.0005175537880828828",
            "extra": "mean: 70.1149399999925 msec\nrounds: 15"
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
          "id": "875b4d6c927683fa938b80f63b3b512551d59dc3",
          "message": "Merge pull request #235 from kmarchais/release/v0.12.0\n\nRelease v0.12.0",
          "timestamp": "2026-05-07T13:56:19+02:00",
          "tree_id": "dff895dded2acea13bc8b93001527cb8901fb70d",
          "url": "https://github.com/kmarchais/mmgpy/commit/875b4d6c927683fa938b80f63b3b512551d59dc3"
        },
        "date": 1778155450275,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_construction_3d",
            "value": 15.354186582702607,
            "unit": "iter/sec",
            "range": "stddev: 0.000873573396689053",
            "extra": "mean: 65.12881647058781 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_io_roundtrip_3d",
            "value": 11.410241657764816,
            "unit": "iter/sec",
            "range": "stddev: 0.0006295634058095582",
            "extra": "mean: 87.64056274999987 msec\nrounds: 12"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_pyvista_roundtrip_3d",
            "value": 14.462205825440495,
            "unit": "iter/sec",
            "range": "stddev: 0.0008697117060610451",
            "extra": "mean: 69.1457452666659 msec\nrounds: 15"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_quality_3d",
            "value": 3797.1328881445434,
            "unit": "iter/sec",
            "range": "stddev: 0.000010621976295963238",
            "extra": "mean: 263.35659811175236 usec\nrounds: 3919"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_validate_3d",
            "value": 80.15821044258325,
            "unit": "iter/sec",
            "range": "stddev: 0.0001660315752351216",
            "extra": "mean: 12.475328409636749 msec\nrounds: 83"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_metric_field_set_get",
            "value": 3460.3765756759767,
            "unit": "iter/sec",
            "range": "stddev: 0.000004917579573769844",
            "extra": "mean: 288.9858887120261 usec\nrounds: 16965"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_adaptive_hmin_hmax_hausd",
            "value": 0.10849053699297684,
            "unit": "iter/sec",
            "range": "stddev: 0.05567982486316649",
            "extra": "mean: 9.217393771999998 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_metric_hgrad",
            "value": 0.10048858610517925,
            "unit": "iter/sec",
            "range": "stddev: 0.06635510877312219",
            "extra": "mean: 9.95137894520002 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_optimize",
            "value": 0.20992703572820834,
            "unit": "iter/sec",
            "range": "stddev: 0.014843747508629337",
            "extra": "mean: 4.763559855599999 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_adaptive_hmax_hgrad_angle",
            "value": 5.50057035184792,
            "unit": "iter/sec",
            "range": "stddev: 0.0003443919546819663",
            "extra": "mean: 181.7993291666653 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_metric_hmin_hausd",
            "value": 5.379147185647685,
            "unit": "iter/sec",
            "range": "stddev: 0.002734648893872757",
            "extra": "mean: 185.90307450001356 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_uniform_angle",
            "value": 5.522487803662206,
            "unit": "iter/sec",
            "range": "stddev: 0.00041483972360581596",
            "extra": "mean: 181.07781049998076 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_adaptive_hmin_hgrad",
            "value": 4.736056641236942,
            "unit": "iter/sec",
            "range": "stddev: 0.0010702233502535928",
            "extra": "mean: 211.14612339999894 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_metric_hmax_hausd_angle",
            "value": 2.1925752468342368,
            "unit": "iter/sec",
            "range": "stddev: 0.0032858708802101905",
            "extra": "mean: 456.08468919999723 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_optimize",
            "value": 2.237782268260926,
            "unit": "iter/sec",
            "range": "stddev: 0.002184356616402497",
            "extra": "mean: 446.87099999998736 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_uniform",
            "value": 2.9200503699345877,
            "unit": "iter/sec",
            "range": "stddev: 0.0029570665929088288",
            "extra": "mean: 342.45984599998565 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 180.343637529687,
            "unit": "iter/sec",
            "range": "stddev: 0.0005669243213232508",
            "extra": "mean: 5.544969668449693 msec\nrounds: 187"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 15.076708762959283,
            "unit": "iter/sec",
            "range": "stddev: 0.0003301123311428579",
            "extra": "mean: 66.32747343749301 msec\nrounds: 16"
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
          "id": "1bb7a0f2f40a7783e78a1375fa0222f4bccf9466",
          "message": "chore(deps): bump vulnerable transitive deps to clear Dependabot alerts (#236)\n\n* chore(deps): bump vulnerable transitive deps to clear Dependabot alerts\n\n- pillow 12.1.0 -> 12.2.0 (6 alerts: OOB writes, DoS)\n- aiohttp 3.13.3 -> 3.13.5 (9 alerts: header injection, DoS)\n- pytest 9.0.2 -> 9.0.3 (tmpdir handling)\n- requests 2.32.5 -> 2.33.1 (insecure temp file)\n- pygments 2.19.2 -> 2.20.0 (ReDoS)\n\n* chore(deps): raise pytest lower bound to >=9.0.3",
          "timestamp": "2026-05-07T12:26:17Z",
          "tree_id": "6037d6681af118d241c0236322083118ae43ed0d",
          "url": "https://github.com/kmarchais/mmgpy/commit/1bb7a0f2f40a7783e78a1375fa0222f4bccf9466"
        },
        "date": 1778157182955,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_construction_3d",
            "value": 36.18764391911573,
            "unit": "iter/sec",
            "range": "stddev: 0.0002808532534288549",
            "extra": "mean: 27.63374156756751 msec\nrounds: 37"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_io_roundtrip_3d",
            "value": 17.68172841119189,
            "unit": "iter/sec",
            "range": "stddev: 0.0002902054455246598",
            "extra": "mean: 56.55555705555552 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_pyvista_roundtrip_3d",
            "value": 29.832603535626664,
            "unit": "iter/sec",
            "range": "stddev: 0.00039916275441154316",
            "extra": "mean: 33.520373064515844 msec\nrounds: 31"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_quality_3d",
            "value": 3383.095184849368,
            "unit": "iter/sec",
            "range": "stddev: 0.00000983084314995135",
            "extra": "mean: 295.587308473712 usec\nrounds: 3446"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_validate_3d",
            "value": 74.19111069582604,
            "unit": "iter/sec",
            "range": "stddev: 0.00024879341584042",
            "extra": "mean: 13.478703723682889 msec\nrounds: 76"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_metric_field_set_get",
            "value": 9192.969820511991,
            "unit": "iter/sec",
            "range": "stddev: 0.000005750023455306832",
            "extra": "mean: 108.77877546913412 usec\nrounds: 17904"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_adaptive_hmin_hmax_hausd",
            "value": 0.12967377013096595,
            "unit": "iter/sec",
            "range": "stddev: 0.050353614361050326",
            "extra": "mean: 7.711659798200015 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_metric_hgrad",
            "value": 0.10486932497308275,
            "unit": "iter/sec",
            "range": "stddev: 0.13825490634104912",
            "extra": "mean: 9.535676903199999 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_optimize",
            "value": 0.4091556504924888,
            "unit": "iter/sec",
            "range": "stddev: 0.003616549254182891",
            "extra": "mean: 2.444057655800009 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_adaptive_hmax_hgrad_angle",
            "value": 5.356706725560175,
            "unit": "iter/sec",
            "range": "stddev: 0.00022996910315485112",
            "extra": "mean: 186.6818646666578 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_metric_hmin_hausd",
            "value": 5.344209160005619,
            "unit": "iter/sec",
            "range": "stddev: 0.0004559006554151595",
            "extra": "mean: 187.11842483331034 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_uniform_angle",
            "value": 5.351258870895883,
            "unit": "iter/sec",
            "range": "stddev: 0.00009937375328599631",
            "extra": "mean: 186.87191633332154 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_adaptive_hmin_hgrad",
            "value": 5.254234669477968,
            "unit": "iter/sec",
            "range": "stddev: 0.0009057469940476885",
            "extra": "mean: 190.3226755000181 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_metric_hmax_hausd_angle",
            "value": 2.1201290996474933,
            "unit": "iter/sec",
            "range": "stddev: 0.0016711990180462348",
            "extra": "mean: 471.66939039998397 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_optimize",
            "value": 2.1265935556503757,
            "unit": "iter/sec",
            "range": "stddev: 0.001265041593909717",
            "extra": "mean: 470.23560160002944 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_uniform",
            "value": 2.8846885669452176,
            "unit": "iter/sec",
            "range": "stddev: 0.0019144363947408282",
            "extra": "mean: 346.6578720000143 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 171.2826409381445,
            "unit": "iter/sec",
            "range": "stddev: 0.00005069796478923578",
            "extra": "mean: 5.838303254333468 msec\nrounds: 173"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.281780947225327,
            "unit": "iter/sec",
            "range": "stddev: 0.00009419488013713522",
            "extra": "mean: 70.01927866666242 msec\nrounds: 15"
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
            "email": "kevinmarchais@gmail.com",
            "name": "Kevin Marchais",
            "username": "kmarchais"
          },
          "distinct": true,
          "id": "f453aa9544cdeff4d1c368742f24c0b61b99091d",
          "message": "chore(deps): bump vulnerable transitive deps to clear Dependabot alerts (#236)\n\n* chore(deps): bump vulnerable transitive deps to clear Dependabot alerts\n\n- pillow 12.1.0 -> 12.2.0 (6 alerts: OOB writes, DoS)\n- aiohttp 3.13.3 -> 3.13.5 (9 alerts: header injection, DoS)\n- pytest 9.0.2 -> 9.0.3 (tmpdir handling)\n- requests 2.32.5 -> 2.33.1 (insecure temp file)\n- pygments 2.19.2 -> 2.20.0 (ReDoS)\n\n* chore(deps): raise pytest lower bound to >=9.0.3",
          "timestamp": "2026-05-07T14:27:46+02:00",
          "tree_id": "6037d6681af118d241c0236322083118ae43ed0d",
          "url": "https://github.com/kmarchais/mmgpy/commit/f453aa9544cdeff4d1c368742f24c0b61b99091d"
        },
        "date": 1778157311291,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_construction_3d",
            "value": 33.300945910716536,
            "unit": "iter/sec",
            "range": "stddev: 0.00015600176871445308",
            "extra": "mean: 30.029177029418594 msec\nrounds: 34"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_io_roundtrip_3d",
            "value": 17.84400745485724,
            "unit": "iter/sec",
            "range": "stddev: 0.00023681785662687415",
            "extra": "mean: 56.04122294444539 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_pyvista_roundtrip_3d",
            "value": 29.058157272013407,
            "unit": "iter/sec",
            "range": "stddev: 0.0003625265026320645",
            "extra": "mean: 34.41374450000391 msec\nrounds: 30"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_quality_3d",
            "value": 3312.9485146526144,
            "unit": "iter/sec",
            "range": "stddev: 0.00003879084319107265",
            "extra": "mean: 301.8459223187949 usec\nrounds: 3450"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_validate_3d",
            "value": 72.69361015985407,
            "unit": "iter/sec",
            "range": "stddev: 0.00014172040061044935",
            "extra": "mean: 13.756367276312025 msec\nrounds: 76"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_metric_field_set_get",
            "value": 9175.593632341206,
            "unit": "iter/sec",
            "range": "stddev: 0.000005685909920208466",
            "extra": "mean: 108.98477418129121 usec\nrounds: 18382"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_adaptive_hmin_hmax_hausd",
            "value": 0.11759990807288567,
            "unit": "iter/sec",
            "range": "stddev: 0.1595470672241788",
            "extra": "mean: 8.503408007600001 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_metric_hgrad",
            "value": 0.09936772586708444,
            "unit": "iter/sec",
            "range": "stddev: 0.07017309963130922",
            "extra": "mean: 10.063629727600016 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_optimize",
            "value": 0.3613260627914861,
            "unit": "iter/sec",
            "range": "stddev: 0.16944142652775254",
            "extra": "mean: 2.7675833629999715 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_adaptive_hmax_hgrad_angle",
            "value": 4.826381879825482,
            "unit": "iter/sec",
            "range": "stddev: 0.0013021887317978787",
            "extra": "mean: 207.1945455000256 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_metric_hmin_hausd",
            "value": 5.1161929316392305,
            "unit": "iter/sec",
            "range": "stddev: 0.0009832233942916903",
            "extra": "mean: 195.45783620001203 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_uniform_angle",
            "value": 5.074173464290152,
            "unit": "iter/sec",
            "range": "stddev: 0.001265585572687624",
            "extra": "mean: 197.07643166666836 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_adaptive_hmin_hgrad",
            "value": 4.899104428719273,
            "unit": "iter/sec",
            "range": "stddev: 0.0012956082290073588",
            "extra": "mean: 204.11893939999572 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_metric_hmax_hausd_angle",
            "value": 1.857837121161153,
            "unit": "iter/sec",
            "range": "stddev: 0.010808147878885024",
            "extra": "mean: 538.2603182000139 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_optimize",
            "value": 1.9404300215844312,
            "unit": "iter/sec",
            "range": "stddev: 0.0015928581697673683",
            "extra": "mean: 515.3496848000032 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_uniform",
            "value": 2.719672558299053,
            "unit": "iter/sec",
            "range": "stddev: 0.0029294662007540257",
            "extra": "mean: 367.69132260003516 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 170.5485384768652,
            "unit": "iter/sec",
            "range": "stddev: 0.00003334631221727331",
            "extra": "mean: 5.863433418607978 msec\nrounds: 172"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 13.752207607508478,
            "unit": "iter/sec",
            "range": "stddev: 0.0008439506829774645",
            "extra": "mean: 72.71559799999068 msec\nrounds: 15"
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
          "id": "accfce67fb4a27a654e667bb5e3c694d64480124",
          "message": "chore: remove deprecated Mesh / MeshCheckpoint public API for v0.13 (#237)\n\n* chore: remove deprecated Mesh / MeshCheckpoint public API for v0.13\n\nv0.12 deprecated `mmgpy.Mesh`, `mmgpy.MeshCheckpoint`, and\n`Mesh.checkpoint()` for removal in 0.13. This commit follows through:\n\n- Remove `Mesh` and `MeshCheckpoint` from the public API (no longer\n  exported from `mmgpy`).\n- Delete `MeshCheckpoint` class and `Mesh.checkpoint()` method outright.\n- Strip the `Mesh.__init__` `DeprecationWarning`; the class is now a\n  private internal helper that the `.mmg` accessor, `repair`, `ui`,\n  `interactive`, and `lagrangian.move_mesh` continue to use.\n- `MeshKind` stays public (still returned by `dataset.mmg.kind`).\n\nIn addition, deprecate `mmgpy.read()` for removal in 0.14:\n- It now emits `DeprecationWarning` and returns a PyVista dataset\n  (`UnstructuredGrid` / `PolyData`) instead of a `Mesh`.\n- Internal callers route through a new `_read_mesh_internal` helper\n  that returns the private `Mesh` without firing the warning.\n- New code should use `pv.read(\"foo.mesh\")`; mmgpy's registered Medit\n  reader plugin handles `.mesh` / `.meshb` natively.\n\nCleanup:\n- Delete `tests/deprecated/`, `docs/migrating-from-mesh.md`, and\n  `docs/api/mesh-classes.md`.\n- Rewrite `tests/deprecation_test.py` to assert removal of the public\n  classes and the new `mmgpy.read()` warning.\n- Prune `tests/deprecation_lagrangian_shims_test.py` of the\n  Mesh-based cases (the `dataset.mmg.remesh_lagrangian` and\n  `mmgpy.progress.remesh_mesh_lagrangian` shims keep their tests; both\n  still survive with TBD removal).\n- Migrate `tests/mmg2d_test.py` and `tests/mmgs_test.py` from\n  `mmgpy.read(...).to_pyvista()` to plain `pv.read(...)`.\n- Update `docs/changelog.md`, `docs/index.md`, `docs/api/index.md`,\n  and `docs/api/io.md`. Other docs continue to use the deprecated\n  `mmgpy.read()` style and pass through monkeypatching in\n  `docs/conftest.py`; their migration to the accessor pattern is a\n  follow-up.\n\nNote: the private `Mesh` class lives on as an internal helper since\nthe accessor and several internal modules still build a `Mesh` to\nbundle a C++ impl with sizing constraints, user fields, and lazy\npoint_data. Replacing those consumers with helpers that operate on\nimpls / PyVista datasets directly is a follow-up and out of scope\nfor v0.13.\n\n* test: keep internal Mesh regression tests under tests/internal/\n\nThe previous commit deleted tests/deprecated/, which left the still-live\ninternal `_mesh.Mesh` helper and its consumers (repair, transfer,\nprogress, validation, options, sizing, ui, etc.) without coverage and\ndropped the suite to 52% (CI gate is 70%).\n\nRestore those tests under tests/internal/ with the public Mesh\nreferences rewritten to internal ones:\n\n- `from mmgpy import Mesh` -> `from mmgpy._mesh import Mesh`.\n- `from mmgpy import read` / `mmgpy.read(...)` -> `_read_mesh_internal`\n  from `mmgpy._io` so the tests still get a `Mesh` without emitting the\n  new DeprecationWarning.\n- Drop checkpoint-specific tests in context_manager_test.py and the\n  obsolete `Mesh`-deprecation warning filter conftest (both targeted\n  APIs that no longer exist).\n- `test_mesh_exported` now asserts `Mesh` is NOT on the public module.\n\nAlso fix benchmarks/bench_operations.py which still imported the public\n`Mesh` (now `from mmgpy._mesh import Mesh`). This was breaking the\nbenchmark-pr CI job.\n\nCoverage back to 89%; 916 tests pass, 15 skipped.\n\n* examples: migrate off deprecated mmgpy.read / Mesh.remesh API\n\nFive examples still used the v0.12 deprecated entry points:\n- mmgpy.read(path)           -> now returns a PyVista dataset (warns)\n- mesh.remesh(...)           -> Mesh is no longer public\n- mesh.to_pyvista()          -> Mesh is no longer public\n\nAfter v0.13 these scripts crashed with AttributeError on the returned\nPolyData/UnstructuredGrid (the \"examples\" CI job was failing on\nexamples/mmg2d/mesh_adaptation_to_a_solution.py).\n\nSwitch them to the supported pattern:\n  mesh = pv.read(path)\n  result = mesh.mmg.remesh(...)\n\nThe bare `import mmgpy` is kept (with a noqa: F401 hint) because it\nstill has to run to register the .mmg accessor and the Medit reader\nplugin.\n\n* remove dead Mesh.remesh_lagrangian shim, add user-data test for read()\n\nThe deprecated Mesh.remesh_lagrangian shim and its private helpers\n(_collect_shim_stats, _shim_stats_to_remesh_result) were only reachable\nthrough the removed public mmgpy.Mesh API. The accessor's\nremesh_lagrangian forwards straight to .move() and never touches them,\nso they were dead code dragging codecov/patch down to 56%.\n\nDrop the method and the two helpers, then add a deprecation_test.py\ncase that calls mmgpy.read() on a dataset carrying user point_data so\nthe user-field forwarding branch in _io.read() (the last uncovered\npatch lines) is exercised.\n\nDiff coverage now at 96% (only one defensive return remains).\n\n* keep mmgpy.read() return contract while deprecating it\n\nread() now stays a soft deprecation: it still hands back the internal\nMesh wrapper (same as 0.12) so existing mesh = mmgpy.read(...);\nmesh.remesh(...) code keeps running, with the DeprecationWarning nudging\nusers toward pv.read(...).mmg.remesh(...). Reverts the breaking\nreturn-type change introduced earlier in the branch.\n\nAlso tightens the deprecation copy (\"works for any PyVista-supported\nformat; mmgpy adds the Medit plugin\"), drops a stale comment in\n_remesh.py, and extends the deprecation tests to assert the Mesh-shaped\nreturn and the to_pyvista() -> .mmg bridge.",
          "timestamp": "2026-05-07T19:16:42+02:00",
          "tree_id": "273d5674bf94efd77c25443a883ebe26413a83b0",
          "url": "https://github.com/kmarchais/mmgpy/commit/accfce67fb4a27a654e667bb5e3c694d64480124"
        },
        "date": 1778174636420,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_construction_3d",
            "value": 34.24287265594082,
            "unit": "iter/sec",
            "range": "stddev: 0.00033333921963359743",
            "extra": "mean: 29.203157400011797 msec\nrounds: 35"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_io_roundtrip_3d",
            "value": 18.66875088793902,
            "unit": "iter/sec",
            "range": "stddev: 0.0004980941798186044",
            "extra": "mean: 53.565447736840916 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_pyvista_roundtrip_3d",
            "value": 29.562008086625482,
            "unit": "iter/sec",
            "range": "stddev: 0.0003081166092513925",
            "extra": "mean: 33.82720135485054 msec\nrounds: 31"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_quality_3d",
            "value": 3387.214595356609,
            "unit": "iter/sec",
            "range": "stddev: 0.00000760947625696526",
            "extra": "mean: 295.22782565086317 usec\nrounds: 3688"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_validate_3d",
            "value": 73.51025513631737,
            "unit": "iter/sec",
            "range": "stddev: 0.0002013097877503429",
            "extra": "mean: 13.603544133340316 msec\nrounds: 75"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_metric_field_set_get",
            "value": 7132.772308997761,
            "unit": "iter/sec",
            "range": "stddev: 0.000012874841392056452",
            "extra": "mean: 140.19794221365126 usec\nrounds: 14519"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_adaptive_hmin_hmax_hausd",
            "value": 0.11476113262772464,
            "unit": "iter/sec",
            "range": "stddev: 0.10522839547274977",
            "extra": "mean: 8.713751573399986 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_metric_hgrad",
            "value": 0.09735717048742258,
            "unit": "iter/sec",
            "range": "stddev: 0.09071153609331202",
            "extra": "mean: 10.271457099599957 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_optimize",
            "value": 0.35799285479268733,
            "unit": "iter/sec",
            "range": "stddev: 0.03055129276870229",
            "extra": "mean: 2.7933518410000033 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_adaptive_hmax_hgrad_angle",
            "value": 5.256970201018251,
            "unit": "iter/sec",
            "range": "stddev: 0.0004271661242853745",
            "extra": "mean: 190.22363866668002 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_metric_hmin_hausd",
            "value": 5.256338358239319,
            "unit": "iter/sec",
            "range": "stddev: 0.0005054279252690029",
            "extra": "mean: 190.246504666599 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_uniform_angle",
            "value": 5.221779933401478,
            "unit": "iter/sec",
            "range": "stddev: 0.0012106172257542827",
            "extra": "mean: 191.50558099996337 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_adaptive_hmin_hgrad",
            "value": 5.119349799437033,
            "unit": "iter/sec",
            "range": "stddev: 0.0016982329128703416",
            "extra": "mean: 195.33730633330984 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_metric_hmax_hausd_angle",
            "value": 1.9939833236134297,
            "unit": "iter/sec",
            "range": "stddev: 0.01897733167649761",
            "extra": "mean: 501.5087077999396 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_optimize",
            "value": 2.019399504311556,
            "unit": "iter/sec",
            "range": "stddev: 0.005178881562626758",
            "extra": "mean: 495.1967146000243 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_uniform",
            "value": 2.8496804396857045,
            "unit": "iter/sec",
            "range": "stddev: 0.0015646552034335477",
            "extra": "mean: 350.9165399999347 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 171.20426279894954,
            "unit": "iter/sec",
            "range": "stddev: 0.00007269805867258216",
            "extra": "mean: 5.840976057788531 msec\nrounds: 173"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.2069737976912,
            "unit": "iter/sec",
            "range": "stddev: 0.0003334058411187225",
            "extra": "mean: 70.38796679997479 msec\nrounds: 15"
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
          "id": "b037f9f2149e5f6b80c486db16ffbe1c4330731d",
          "message": "fix(examples): drop explicit off_screen=False in smooth_surface_remeshing (#239)\n\n* fix(examples): drop explicit off_screen=False in smooth_surface_remeshing\n\n* ci: temporarily run daily-docs-test on PRs to verify fix\n\n* ci: revert temporary PR trigger on daily-docs-test",
          "timestamp": "2026-05-09T08:43:47Z",
          "tree_id": "eb299b8f8f8e1c97f7027672609539cc8b228639",
          "url": "https://github.com/kmarchais/mmgpy/commit/b037f9f2149e5f6b80c486db16ffbe1c4330731d"
        },
        "date": 1778316646658,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_construction_3d",
            "value": 41.81407526050081,
            "unit": "iter/sec",
            "range": "stddev: 0.00014222957009445202",
            "extra": "mean: 23.91539197674518 msec\nrounds: 43"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_io_roundtrip_3d",
            "value": 20.95631714749274,
            "unit": "iter/sec",
            "range": "stddev: 0.0001890497406128952",
            "extra": "mean: 47.71830818181917 msec\nrounds: 22"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_pyvista_roundtrip_3d",
            "value": 35.29875480351261,
            "unit": "iter/sec",
            "range": "stddev: 0.0005497526570331702",
            "extra": "mean: 28.32961121621461 msec\nrounds: 37"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_quality_3d",
            "value": 3396.654142158507,
            "unit": "iter/sec",
            "range": "stddev: 0.000012304088994010948",
            "extra": "mean: 294.40736623379604 usec\nrounds: 3465"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_validate_3d",
            "value": 73.16107512630639,
            "unit": "iter/sec",
            "range": "stddev: 0.000051803077914709114",
            "extra": "mean: 13.668470539471775 msec\nrounds: 76"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_metric_field_set_get",
            "value": 8582.863003106491,
            "unit": "iter/sec",
            "range": "stddev: 0.0000050452400769325076",
            "extra": "mean: 116.51123869017353 usec\nrounds: 18325"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_adaptive_hmin_hmax_hausd",
            "value": 0.12142164224757074,
            "unit": "iter/sec",
            "range": "stddev: 0.02584471710318716",
            "extra": "mean: 8.235764082000026 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_metric_hgrad",
            "value": 0.0998399553973481,
            "unit": "iter/sec",
            "range": "stddev: 0.015771370366394692",
            "extra": "mean: 10.016030115600007 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_optimize",
            "value": 0.4013106868674412,
            "unit": "iter/sec",
            "range": "stddev: 0.0023099241856927026",
            "extra": "mean: 2.4918349616 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_adaptive_hmax_hgrad_angle",
            "value": 5.2794307954237025,
            "unit": "iter/sec",
            "range": "stddev: 0.0007338445190851895",
            "extra": "mean: 189.4143589999923 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_metric_hmin_hausd",
            "value": 5.274468594739984,
            "unit": "iter/sec",
            "range": "stddev: 0.00011875991392379769",
            "extra": "mean: 189.59255933332506 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_uniform_angle",
            "value": 5.276436663184132,
            "unit": "iter/sec",
            "range": "stddev: 0.00012538034108352462",
            "extra": "mean: 189.5218428333294 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_adaptive_hmin_hgrad",
            "value": 5.345381271551601,
            "unit": "iter/sec",
            "range": "stddev: 0.001619724115877129",
            "extra": "mean: 187.07739433331957 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_metric_hmax_hausd_angle",
            "value": 2.0449354324601696,
            "unit": "iter/sec",
            "range": "stddev: 0.007594967915597794",
            "extra": "mean: 489.01299480000944 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_optimize",
            "value": 2.0911886316139836,
            "unit": "iter/sec",
            "range": "stddev: 0.0021716880417618823",
            "extra": "mean: 478.1969378000099 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_uniform",
            "value": 2.8381154596841163,
            "unit": "iter/sec",
            "range": "stddev: 0.001725914969378354",
            "extra": "mean: 352.34648279999874 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 163.99723138481687,
            "unit": "iter/sec",
            "range": "stddev: 0.000028536469308027467",
            "extra": "mean: 6.097663915151812 msec\nrounds: 165"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 13.598584895513383,
            "unit": "iter/sec",
            "range": "stddev: 0.00007329840899464916",
            "extra": "mean: 73.53706342855811 msec\nrounds: 14"
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
          "id": "0ff847c2fb0245e3bfb6ded87e03901e1a987cf3",
          "message": "drop unused PNG artifacts from examples/ and assets/ (#240)\n\n* drop unused PNG artifacts from examples/ and assets/\n\n* ignore gifs globally, allow only in docs/assets/",
          "timestamp": "2026-05-09T10:06:37Z",
          "tree_id": "e50b13534f0edc024cb79267f68b1bfff6cced91",
          "url": "https://github.com/kmarchais/mmgpy/commit/0ff847c2fb0245e3bfb6ded87e03901e1a987cf3"
        },
        "date": 1778321603066,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_construction_3d",
            "value": 36.49895871923485,
            "unit": "iter/sec",
            "range": "stddev: 0.0002276276927102612",
            "extra": "mean: 27.39804189189109 msec\nrounds: 37"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_io_roundtrip_3d",
            "value": 17.707437770932433,
            "unit": "iter/sec",
            "range": "stddev: 0.00015459194514752915",
            "extra": "mean: 56.473444263152835 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_pyvista_roundtrip_3d",
            "value": 29.261954686283218,
            "unit": "iter/sec",
            "range": "stddev: 0.00018801899309436401",
            "extra": "mean: 34.17406699999977 msec\nrounds: 30"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_quality_3d",
            "value": 3398.168026294171,
            "unit": "iter/sec",
            "range": "stddev: 0.00000803646086326265",
            "extra": "mean: 294.2762077278849 usec\nrounds: 3442"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_validate_3d",
            "value": 74.10633329768889,
            "unit": "iter/sec",
            "range": "stddev: 0.0003280018894672171",
            "extra": "mean: 13.494123315789347 msec\nrounds: 76"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_metric_field_set_get",
            "value": 7237.901535946569,
            "unit": "iter/sec",
            "range": "stddev: 0.000005553765190974314",
            "extra": "mean: 138.16159214567438 usec\nrounds: 19225"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_adaptive_hmin_hmax_hausd",
            "value": 0.12945334519528967,
            "unit": "iter/sec",
            "range": "stddev: 0.013738179542785101",
            "extra": "mean: 7.7247907228000035 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_metric_hgrad",
            "value": 0.108889814885842,
            "unit": "iter/sec",
            "range": "stddev: 0.2919878906406097",
            "extra": "mean: 9.183595371600006 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_optimize",
            "value": 0.4197894964730364,
            "unit": "iter/sec",
            "range": "stddev: 0.003414203614654069",
            "extra": "mean: 2.382146309999996 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_adaptive_hmax_hgrad_angle",
            "value": 5.377509767271633,
            "unit": "iter/sec",
            "range": "stddev: 0.00022882005177172986",
            "extra": "mean: 185.95968083333977 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_metric_hmin_hausd",
            "value": 5.374973328150628,
            "unit": "iter/sec",
            "range": "stddev: 0.00033710170752600504",
            "extra": "mean: 186.04743483333172 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_uniform_angle",
            "value": 5.370050978135735,
            "unit": "iter/sec",
            "range": "stddev: 0.00016033349524253855",
            "extra": "mean: 186.2179714999949 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_adaptive_hmin_hgrad",
            "value": 5.294062317878966,
            "unit": "iter/sec",
            "range": "stddev: 0.002475390698547249",
            "extra": "mean: 188.89086300001168 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_metric_hmax_hausd_angle",
            "value": 2.122586991688212,
            "unit": "iter/sec",
            "range": "stddev: 0.004338673299627986",
            "extra": "mean: 471.12321139999267 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_optimize",
            "value": 2.1287193306646293,
            "unit": "iter/sec",
            "range": "stddev: 0.0020936462224437485",
            "extra": "mean: 469.76601640000126 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_uniform",
            "value": 2.8941280825218514,
            "unit": "iter/sec",
            "range": "stddev: 0.0030944042098206164",
            "extra": "mean: 345.5272094000179 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 172.0301510364201,
            "unit": "iter/sec",
            "range": "stddev: 0.000027857887190146117",
            "extra": "mean: 5.812934500001063 msec\nrounds: 174"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.322739166649932,
            "unit": "iter/sec",
            "range": "stddev: 0.0005807277254030003",
            "extra": "mean: 69.81904706667214 msec\nrounds: 15"
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
          "id": "970a5b214383b9176a2610dc717e85211c06def5",
          "message": "switch screenshot examples to .show() and clarify CI skip-list comments (#241)",
          "timestamp": "2026-05-09T12:46:08+02:00",
          "tree_id": "b2eda0385442666a5dc8e5e43f88596d23620c72",
          "url": "https://github.com/kmarchais/mmgpy/commit/970a5b214383b9176a2610dc717e85211c06def5"
        },
        "date": 1778323964381,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_construction_3d",
            "value": 36.788310160504,
            "unit": "iter/sec",
            "range": "stddev: 0.0002849867838237877",
            "extra": "mean: 27.18254781578965 msec\nrounds: 38"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_io_roundtrip_3d",
            "value": 18.637030596835015,
            "unit": "iter/sec",
            "range": "stddev: 0.0003926279146802409",
            "extra": "mean: 53.6566163157892 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_pyvista_roundtrip_3d",
            "value": 31.202480937340326,
            "unit": "iter/sec",
            "range": "stddev: 0.00029000044813126994",
            "extra": "mean: 32.04873362500127 msec\nrounds: 32"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_quality_3d",
            "value": 3388.323066850478,
            "unit": "iter/sec",
            "range": "stddev: 0.000009741086184920105",
            "extra": "mean: 295.131243470689 usec\nrounds: 3446"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_validate_3d",
            "value": 75.28680166856896,
            "unit": "iter/sec",
            "range": "stddev: 0.00009548820194596065",
            "extra": "mean: 13.282540602564662 msec\nrounds: 78"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_metric_field_set_get",
            "value": 9194.356325656654,
            "unit": "iter/sec",
            "range": "stddev: 0.000005859231130810063",
            "extra": "mean: 108.76237167462408 usec\nrounds: 18005"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_adaptive_hmin_hmax_hausd",
            "value": 0.13560864062459543,
            "unit": "iter/sec",
            "range": "stddev: 0.013752071410777868",
            "extra": "mean: 7.374161376400002 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_metric_hgrad",
            "value": 0.10803150670401057,
            "unit": "iter/sec",
            "range": "stddev: 0.08295085462160007",
            "extra": "mean: 9.25655885499999 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_optimize",
            "value": 0.4140211065048713,
            "unit": "iter/sec",
            "range": "stddev: 0.004434760883841354",
            "extra": "mean: 2.4153357987999926 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_adaptive_hmax_hgrad_angle",
            "value": 5.3676695616594925,
            "unit": "iter/sec",
            "range": "stddev: 0.00011220088777368008",
            "extra": "mean: 186.30058883334755 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_metric_hmin_hausd",
            "value": 5.341158805155314,
            "unit": "iter/sec",
            "range": "stddev: 0.0004814678834665584",
            "extra": "mean: 187.22528883335107 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_uniform_angle",
            "value": 5.359048582667714,
            "unit": "iter/sec",
            "range": "stddev: 0.00020549030669089676",
            "extra": "mean: 186.60028633332595 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_adaptive_hmin_hgrad",
            "value": 5.2346445608164665,
            "unit": "iter/sec",
            "range": "stddev: 0.0016193801174220943",
            "extra": "mean: 191.03493816665681 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_metric_hmax_hausd_angle",
            "value": 2.122611476884483,
            "unit": "iter/sec",
            "range": "stddev: 0.002008807189232512",
            "extra": "mean: 471.1177768000084 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_optimize",
            "value": 2.127904300666972,
            "unit": "iter/sec",
            "range": "stddev: 0.000977087679158824",
            "extra": "mean: 469.945946200005 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_uniform",
            "value": 2.897813411712813,
            "unit": "iter/sec",
            "range": "stddev: 0.0006122242686414121",
            "extra": "mean: 345.0877809999952 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 171.901599750404,
            "unit": "iter/sec",
            "range": "stddev: 0.00011994622955992476",
            "extra": "mean: 5.817281522987396 msec\nrounds: 174"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.295254448411038,
            "unit": "iter/sec",
            "range": "stddev: 0.00015251529244636374",
            "extra": "mean: 69.95328439999564 msec\nrounds: 15"
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
          "id": "aad690f81a281bbd872d04ed45300cc5b12a6f60",
          "message": "add image regression tests for examples via pytest-pyvista (#244)\n\n* add image regression tests for examples via pytest-pyvista\n\n* exclude examples_test.py from main test step (run only in dedicated step with offscreen env)\n\n* demote CI-fragile examples to smoke-only\n\n* generate example image baselines in CI to match build-and-test renderer\n\n* back out re-promotion until baseline workflow lands on main",
          "timestamp": "2026-05-09T13:25:46+02:00",
          "tree_id": "5d905300b7f31c706d2378d5ca9eb5c8ce2b3609",
          "url": "https://github.com/kmarchais/mmgpy/commit/aad690f81a281bbd872d04ed45300cc5b12a6f60"
        },
        "date": 1778326369423,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_construction_3d",
            "value": 41.97023497680884,
            "unit": "iter/sec",
            "range": "stddev: 0.00009359964789813035",
            "extra": "mean: 23.82640937208386 msec\nrounds: 43"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_io_roundtrip_3d",
            "value": 20.563090867560962,
            "unit": "iter/sec",
            "range": "stddev: 0.00023889494659845313",
            "extra": "mean: 48.63082142857896 msec\nrounds: 21"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_pyvista_roundtrip_3d",
            "value": 37.40275917476603,
            "unit": "iter/sec",
            "range": "stddev: 0.00010758893769911436",
            "extra": "mean: 26.735995473688348 msec\nrounds: 38"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_quality_3d",
            "value": 3404.970116916253,
            "unit": "iter/sec",
            "range": "stddev: 0.000007756683744484135",
            "extra": "mean: 293.68833371896386 usec\nrounds: 3464"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_validate_3d",
            "value": 73.40626246151217,
            "unit": "iter/sec",
            "range": "stddev: 0.00005041776909020328",
            "extra": "mean: 13.622815907897676 msec\nrounds: 76"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_metric_field_set_get",
            "value": 8749.318704728335,
            "unit": "iter/sec",
            "range": "stddev: 0.000004923009986312872",
            "extra": "mean: 114.29461352911706 usec\nrounds: 17577"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_adaptive_hmin_hmax_hausd",
            "value": 0.12144295443917667,
            "unit": "iter/sec",
            "range": "stddev: 0.04329691417609656",
            "extra": "mean: 8.234318776399983 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_metric_hgrad",
            "value": 0.09926646734245921,
            "unit": "iter/sec",
            "range": "stddev: 0.07087333113214875",
            "extra": "mean: 10.07389531199999 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_optimize",
            "value": 0.4022713878677117,
            "unit": "iter/sec",
            "range": "stddev: 0.0017542427998366759",
            "extra": "mean: 2.4858839832000514 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_adaptive_hmax_hgrad_angle",
            "value": 5.286511574355635,
            "unit": "iter/sec",
            "range": "stddev: 0.000640378724956889",
            "extra": "mean: 189.16065650000746 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_metric_hmin_hausd",
            "value": 5.286625489616342,
            "unit": "iter/sec",
            "range": "stddev: 0.000304629356595246",
            "extra": "mean: 189.15658050000653 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_uniform_angle",
            "value": 5.287732618164564,
            "unit": "iter/sec",
            "range": "stddev: 0.00023939645898755782",
            "extra": "mean: 189.11697550000403 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_adaptive_hmin_hgrad",
            "value": 5.386124293526342,
            "unit": "iter/sec",
            "range": "stddev: 0.0010940505877333057",
            "extra": "mean: 185.66225833330918 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_metric_hmax_hausd_angle",
            "value": 2.0643561161283053,
            "unit": "iter/sec",
            "range": "stddev: 0.0013208288807343472",
            "extra": "mean: 484.4125449999865 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_optimize",
            "value": 2.0709937005028864,
            "unit": "iter/sec",
            "range": "stddev: 0.006290710444192347",
            "extra": "mean: 482.85999119996177 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_uniform",
            "value": 2.834324513810716,
            "unit": "iter/sec",
            "range": "stddev: 0.001183780375890422",
            "extra": "mean: 352.8177507999999 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 163.7799778864738,
            "unit": "iter/sec",
            "range": "stddev: 0.000027265962109538066",
            "extra": "mean: 6.105752442421032 msec\nrounds: 165"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 13.59922234983874,
            "unit": "iter/sec",
            "range": "stddev: 0.00011143426976761846",
            "extra": "mean: 73.53361642857895 msec\nrounds: 14"
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
          "id": "d7a0b80c34529ab3efa9c239675b2ec0686b3eb2",
          "message": "fix file-based level-set remesh and unskip implicit domain examples (#245)\n\n* fix file-based level-set remesh and unskip implicit domain examples (#243)\n\n* route level-set sol load via C++ load_sol channel arg\n\n* force pyvista off-screen during tests\n\n* force matplotlib agg backend during tests\n\n* drop unnecessary const_cast in load_sol bindings and add mmg3d iso e2e test",
          "timestamp": "2026-05-09T14:01:27Z",
          "tree_id": "33d4a396e3b5a929f6aade7fefaee38c381ff594",
          "url": "https://github.com/kmarchais/mmgpy/commit/d7a0b80c34529ab3efa9c239675b2ec0686b3eb2"
        },
        "date": 1778335703349,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_construction_3d",
            "value": 34.14351667867365,
            "unit": "iter/sec",
            "range": "stddev: 0.00021908543229164933",
            "extra": "mean: 29.28813717142995 msec\nrounds: 35"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_io_roundtrip_3d",
            "value": 17.902045882452615,
            "unit": "iter/sec",
            "range": "stddev: 0.0002828170549768183",
            "extra": "mean: 55.85953731579857 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_pyvista_roundtrip_3d",
            "value": 29.25222299564259,
            "unit": "iter/sec",
            "range": "stddev: 0.0003197479427500266",
            "extra": "mean: 34.185436099983235 msec\nrounds: 30"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_quality_3d",
            "value": 3392.98598943923,
            "unit": "iter/sec",
            "range": "stddev: 0.000008223130113119847",
            "extra": "mean: 294.7256496527041 usec\nrounds: 3448"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_validate_3d",
            "value": 74.16504679687071,
            "unit": "iter/sec",
            "range": "stddev: 0.00022824553190894142",
            "extra": "mean: 13.483440558446375 msec\nrounds: 77"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_metric_field_set_get",
            "value": 7132.253740699438,
            "unit": "iter/sec",
            "range": "stddev: 0.000007704947073064893",
            "extra": "mean: 140.2081356547381 usec\nrounds: 18901"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_adaptive_hmin_hmax_hausd",
            "value": 0.12373322401625053,
            "unit": "iter/sec",
            "range": "stddev: 0.05163169497164087",
            "extra": "mean: 8.081903692000015 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_metric_hgrad",
            "value": 0.10240268993653509,
            "unit": "iter/sec",
            "range": "stddev: 0.24914350416617068",
            "extra": "mean: 9.76536847440002 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_optimize",
            "value": 0.3393267364025807,
            "unit": "iter/sec",
            "range": "stddev: 0.02198572302320116",
            "extra": "mean: 2.947012105799968 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_adaptive_hmax_hgrad_angle",
            "value": 5.348090388072056,
            "unit": "iter/sec",
            "range": "stddev: 0.000322856999758353",
            "extra": "mean: 186.98262883333427 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_metric_hmin_hausd",
            "value": 5.351531270122282,
            "unit": "iter/sec",
            "range": "stddev: 0.00024518774806569935",
            "extra": "mean: 186.86240433332082 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_uniform_angle",
            "value": 5.344640326137565,
            "unit": "iter/sec",
            "range": "stddev: 0.0002121144568745111",
            "extra": "mean: 187.10332949994304 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_adaptive_hmin_hgrad",
            "value": 5.092028299594471,
            "unit": "iter/sec",
            "range": "stddev: 0.0017313188888866905",
            "extra": "mean: 196.38539716671252 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_metric_hmax_hausd_angle",
            "value": 2.109126020869777,
            "unit": "iter/sec",
            "range": "stddev: 0.0018285372795748987",
            "extra": "mean: 474.1300378000233 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_optimize",
            "value": 2.1165785875418437,
            "unit": "iter/sec",
            "range": "stddev: 0.0011731031366984234",
            "extra": "mean: 472.4606049999693 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_uniform",
            "value": 2.856829255648915,
            "unit": "iter/sec",
            "range": "stddev: 0.0023115823415079933",
            "extra": "mean: 350.0384204000511 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 172.3861462398665,
            "unit": "iter/sec",
            "range": "stddev: 0.00004257309272202293",
            "extra": "mean: 5.800930189648484 msec\nrounds: 174"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.29693683648659,
            "unit": "iter/sec",
            "range": "stddev: 0.00010815975899495149",
            "extra": "mean: 69.94505266666238 msec\nrounds: 15"
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
          "id": "b326ec7b0ef8a2d946ca04f0fef195d6efd95913",
          "message": "gate releases on examples + docs, retire daily-docs-test (#247)\n\n* gate releases on examples + docs codeblocks, retire daily-docs-test\n\n* simplify validate-release setup and bump setup-uv to v8.1.0",
          "timestamp": "2026-05-10T13:36:57+02:00",
          "tree_id": "1377803e1134bfe1cf336b0483443378ac8ac4a0",
          "url": "https://github.com/kmarchais/mmgpy/commit/b326ec7b0ef8a2d946ca04f0fef195d6efd95913"
        },
        "date": 1778413455219,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_construction_3d",
            "value": 35.945030535508806,
            "unit": "iter/sec",
            "range": "stddev: 0.0002403695559700521",
            "extra": "mean: 27.820257351350307 msec\nrounds: 37"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_io_roundtrip_3d",
            "value": 18.54738740046515,
            "unit": "iter/sec",
            "range": "stddev: 0.0002004950725795139",
            "extra": "mean: 53.91594936842269 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_pyvista_roundtrip_3d",
            "value": 30.962460548734512,
            "unit": "iter/sec",
            "range": "stddev: 0.0003341326107247395",
            "extra": "mean: 32.29717478124883 msec\nrounds: 32"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_quality_3d",
            "value": 3368.8796326097213,
            "unit": "iter/sec",
            "range": "stddev: 0.000014983690289341821",
            "extra": "mean: 296.83458866274316 usec\nrounds: 3440"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_validate_3d",
            "value": 73.79669151414464,
            "unit": "iter/sec",
            "range": "stddev: 0.00009027022087292852",
            "extra": "mean: 13.550742987012223 msec\nrounds: 77"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_metric_field_set_get",
            "value": 9195.43926861631,
            "unit": "iter/sec",
            "range": "stddev: 0.000005279769022510405",
            "extra": "mean: 108.74956277651276 usec\nrounds: 18295"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_adaptive_hmin_hmax_hausd",
            "value": 0.11985055374898093,
            "unit": "iter/sec",
            "range": "stddev: 0.017605156750709002",
            "extra": "mean: 8.343724486199989 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_metric_hgrad",
            "value": 0.09446705852522043,
            "unit": "iter/sec",
            "range": "stddev: 0.035671711780687454",
            "extra": "mean: 10.585700619999978 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_optimize",
            "value": 0.3418242562912759,
            "unit": "iter/sec",
            "range": "stddev: 0.004140791918733254",
            "extra": "mean: 2.92547992599998 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_adaptive_hmax_hgrad_angle",
            "value": 5.230369930649232,
            "unit": "iter/sec",
            "range": "stddev: 0.0005020199438695672",
            "extra": "mean: 191.19106550000234 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_metric_hmin_hausd",
            "value": 5.205279311917484,
            "unit": "iter/sec",
            "range": "stddev: 0.0017080465153392226",
            "extra": "mean: 192.1126494999991 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_uniform_angle",
            "value": 5.206167680559038,
            "unit": "iter/sec",
            "range": "stddev: 0.0008987670892551963",
            "extra": "mean: 192.07986783334263 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_adaptive_hmin_hgrad",
            "value": 4.976790352489973,
            "unit": "iter/sec",
            "range": "stddev: 0.0009131260882961902",
            "extra": "mean: 200.9327154999975 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_metric_hmax_hausd_angle",
            "value": 1.9967099012930167,
            "unit": "iter/sec",
            "range": "stddev: 0.0020894332250443863",
            "extra": "mean: 500.8238800000072 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_optimize",
            "value": 1.985442524950178,
            "unit": "iter/sec",
            "range": "stddev: 0.0031468066147523777",
            "extra": "mean: 503.6660529999949 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_uniform",
            "value": 2.7957952101145995,
            "unit": "iter/sec",
            "range": "stddev: 0.0009680787072408901",
            "extra": "mean: 357.67998899998474 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 171.35611600652206,
            "unit": "iter/sec",
            "range": "stddev: 0.00008322255440630758",
            "extra": "mean: 5.835799872832893 msec\nrounds: 173"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.019702042431271,
            "unit": "iter/sec",
            "range": "stddev: 0.0004951057496464821",
            "extra": "mean: 71.32819206666834 msec\nrounds: 15"
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
          "id": "66739042d89c2efb32ec8f4cf8c89a82b6ee725f",
          "message": "feat(.mmg): expose constraint markers via kwargs and data tags (#246)\n\n* feat(.mmg): expose constraint markers via kwargs and data tags\n\n* feat(.mmg): preserve TRIANGLE cells through PV→MMG3D + 2 examples\n\n* fix(examples/required_edges): drop unmarked-interior remesh that aborts mmg2d on linux py3.14\n\n* fix(examples/required_edges): use polydata_from_2d_triangles for the baseline\n\n* fix(examples): move required_edges to mmg3d/ to dodge linux+3.14 mmg2d crash\n\n* fix(examples/required_edges): use optim=1 path matching mesh_quality_improvement\n\n* feat(examples): add periodic_gyroid showing mmg-LS limits + post-process\n\n* feat(examples): rewrite periodic_gyroid via Tpms.grid_sheet (strict periodic)\n\n* feat(examples): drop microgen — pyvista clip_scalar gives strict periodicity directly\n\n* remove periodic_gyroid example: not achievable mmgpy-only\n\n* examples: rewrite required_{edges,triangles} demos with partial locking + clear visual contrast\n\n* address PR review nits on constraint markers",
          "timestamp": "2026-05-10T12:11:40Z",
          "tree_id": "ce158a227dc57f00c783060491d778eace266941",
          "url": "https://github.com/kmarchais/mmgpy/commit/66739042d89c2efb32ec8f4cf8c89a82b6ee725f"
        },
        "date": 1778415513914,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_construction_3d",
            "value": 32.592737412279604,
            "unit": "iter/sec",
            "range": "stddev: 0.00040727080514994476",
            "extra": "mean: 30.68168185294068 msec\nrounds: 34"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_io_roundtrip_3d",
            "value": 17.40785373367191,
            "unit": "iter/sec",
            "range": "stddev: 0.0008109982678191065",
            "extra": "mean: 57.4453356111159 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_pyvista_roundtrip_3d",
            "value": 28.172736776953016,
            "unit": "iter/sec",
            "range": "stddev: 0.004075549943891848",
            "extra": "mean: 35.49530909677401 msec\nrounds: 31"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_quality_3d",
            "value": 3384.4902309390723,
            "unit": "iter/sec",
            "range": "stddev: 0.000007533510017923812",
            "extra": "mean: 295.4654709470196 usec\nrounds: 3442"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_validate_3d",
            "value": 73.92584295979918,
            "unit": "iter/sec",
            "range": "stddev: 0.00011981819199991993",
            "extra": "mean: 13.527069289474307 msec\nrounds: 76"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_metric_field_set_get",
            "value": 9166.554187081276,
            "unit": "iter/sec",
            "range": "stddev: 0.0000059406049263003255",
            "extra": "mean: 109.09224770735906 usec\nrounds: 18865"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_adaptive_hmin_hmax_hausd",
            "value": 0.12302716751073078,
            "unit": "iter/sec",
            "range": "stddev: 0.08145948422670163",
            "extra": "mean: 8.128285973200002 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_metric_hgrad",
            "value": 0.10255169766673226,
            "unit": "iter/sec",
            "range": "stddev: 0.023594353762639898",
            "extra": "mean: 9.751179383200007 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_optimize",
            "value": 0.41104877056487327,
            "unit": "iter/sec",
            "range": "stddev: 0.003914804728159563",
            "extra": "mean: 2.4328013404000104 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_adaptive_hmax_hgrad_angle",
            "value": 5.314991091201952,
            "unit": "iter/sec",
            "range": "stddev: 0.0004767847749666775",
            "extra": "mean: 188.14706983334872 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_metric_hmin_hausd",
            "value": 5.298395145869502,
            "unit": "iter/sec",
            "range": "stddev: 0.00037362247583667366",
            "extra": "mean: 188.7363951666714 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_uniform_angle",
            "value": 5.2864993288502715,
            "unit": "iter/sec",
            "range": "stddev: 0.0009317306918821462",
            "extra": "mean: 189.16109466668254 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_adaptive_hmin_hgrad",
            "value": 5.067909737081928,
            "unit": "iter/sec",
            "range": "stddev: 0.0018400060654517078",
            "extra": "mean: 197.3200099999796 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_metric_hmax_hausd_angle",
            "value": 2.080251824235569,
            "unit": "iter/sec",
            "range": "stddev: 0.004457624856081017",
            "extra": "mean: 480.7110313999942 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_optimize",
            "value": 2.0713045660637532,
            "unit": "iter/sec",
            "range": "stddev: 0.004399051881985765",
            "extra": "mean: 482.787522600006 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_uniform",
            "value": 2.826791610162365,
            "unit": "iter/sec",
            "range": "stddev: 0.003135791398586935",
            "extra": "mean: 353.75794819999555 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 171.8607761614975,
            "unit": "iter/sec",
            "range": "stddev: 0.00003355356549467748",
            "extra": "mean: 5.81866335259827 msec\nrounds: 173"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.202989568149112,
            "unit": "iter/sec",
            "range": "stddev: 0.0001999583433462267",
            "extra": "mean: 70.4077120666587 msec\nrounds: 15"
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
          "id": "25ffc34c3656d7d4a8997dc90423b9429bcb777a",
          "message": "replace SCOTCH renum with scipy reverse Cuthill-McKee (#248)\n\n* replace SCOTCH renum with scipy reverse Cuthill-McKee\n\n* drop deprecation warning on renum kwarg\n\n* wire -rn CLI flag to renum kwarg (RCM redirect)\n\n* apply renum redirect at Mesh level and warn once",
          "timestamp": "2026-05-10T18:23:46+02:00",
          "tree_id": "b82e9af32e342a4e43b79a8105454d12bd38f704",
          "url": "https://github.com/kmarchais/mmgpy/commit/25ffc34c3656d7d4a8997dc90423b9429bcb777a"
        },
        "date": 1778430645433,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_construction_3d",
            "value": 35.06066327199559,
            "unit": "iter/sec",
            "range": "stddev: 0.00023782999482333588",
            "extra": "mean: 28.52199321621909 msec\nrounds: 37"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_io_roundtrip_3d",
            "value": 18.05359723250515,
            "unit": "iter/sec",
            "range": "stddev: 0.00037679465215471506",
            "extra": "mean: 55.39062310526788 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_pyvista_roundtrip_3d",
            "value": 31.129164072562553,
            "unit": "iter/sec",
            "range": "stddev: 0.0003700665199649202",
            "extra": "mean: 32.12421630304575 msec\nrounds: 33"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_quality_3d",
            "value": 3389.18057313672,
            "unit": "iter/sec",
            "range": "stddev: 0.000007956360865484245",
            "extra": "mean: 295.05657146927706 usec\nrounds: 3449"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_validate_3d",
            "value": 73.4183300837343,
            "unit": "iter/sec",
            "range": "stddev: 0.00007255470181439257",
            "extra": "mean: 13.620576753237104 msec\nrounds: 77"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_metric_field_set_get",
            "value": 9147.681135443469,
            "unit": "iter/sec",
            "range": "stddev: 0.000006558006251481269",
            "extra": "mean: 109.31732153686632 usec\nrounds: 18847"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_adaptive_hmin_hmax_hausd",
            "value": 0.12353416741158864,
            "unit": "iter/sec",
            "range": "stddev: 0.04267562011868713",
            "extra": "mean: 8.094926455999985 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_metric_hgrad",
            "value": 0.10286020052013707,
            "unit": "iter/sec",
            "range": "stddev: 0.013776541780948472",
            "extra": "mean: 9.721933215600028 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_optimize",
            "value": 0.41841269636319434,
            "unit": "iter/sec",
            "range": "stddev: 0.00235021317980296",
            "extra": "mean: 2.389984837199995 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_adaptive_hmax_hgrad_angle",
            "value": 5.260136361670347,
            "unit": "iter/sec",
            "range": "stddev: 0.0007999929426254633",
            "extra": "mean: 190.10914000002307 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_metric_hmin_hausd",
            "value": 5.271762849881872,
            "unit": "iter/sec",
            "range": "stddev: 0.0011186737131368908",
            "extra": "mean: 189.68986816666225 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_uniform_angle",
            "value": 5.2178960972282304,
            "unit": "iter/sec",
            "range": "stddev: 0.0006038238389059349",
            "extra": "mean: 191.6481243333313 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_adaptive_hmin_hgrad",
            "value": 5.085157009702139,
            "unit": "iter/sec",
            "range": "stddev: 0.0017287643892240228",
            "extra": "mean: 196.6507618333253 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_metric_hmax_hausd_angle",
            "value": 2.0627332793282718,
            "unit": "iter/sec",
            "range": "stddev: 0.0032067245287292793",
            "extra": "mean: 484.7936521999827 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_optimize",
            "value": 1.9986755121152076,
            "unit": "iter/sec",
            "range": "stddev: 0.00476850895832213",
            "extra": "mean: 500.3313414000331 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_uniform",
            "value": 2.825007748290099,
            "unit": "iter/sec",
            "range": "stddev: 0.0013524590633656561",
            "extra": "mean: 353.9813299999878 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 167.5929592493649,
            "unit": "iter/sec",
            "range": "stddev: 0.000516099619319219",
            "extra": "mean: 5.966837774563549 msec\nrounds: 173"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.12059295340545,
            "unit": "iter/sec",
            "range": "stddev: 0.0003383267878960904",
            "extra": "mean: 70.81855580001199 msec\nrounds: 15"
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
          "id": "b21190dd63339cc21642f081772a8ea11350445d",
          "message": "promote 6 high-value MMG flags to typed options (#249)\n\n* promote 6 high-value MMG flags to typed options\n\n* address review: drop stale PR1 refs, dedupe renum tests, doc anisosize",
          "timestamp": "2026-05-10T17:42:59Z",
          "tree_id": "f3900c6fc7630707afb15ed2c658c525fe18e1ec",
          "url": "https://github.com/kmarchais/mmgpy/commit/b21190dd63339cc21642f081772a8ea11350445d"
        },
        "date": 1778435418942,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_construction_3d",
            "value": 32.6410559616632,
            "unit": "iter/sec",
            "range": "stddev: 0.00037710171837097986",
            "extra": "mean: 30.636263764704683 msec\nrounds: 34"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_io_roundtrip_3d",
            "value": 17.449240327110143,
            "unit": "iter/sec",
            "range": "stddev: 0.0003791831946892871",
            "extra": "mean: 57.30908516666725 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_pyvista_roundtrip_3d",
            "value": 28.018446301602093,
            "unit": "iter/sec",
            "range": "stddev: 0.0003721220414956507",
            "extra": "mean: 35.69077275861724 msec\nrounds: 29"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_quality_3d",
            "value": 3387.562297794126,
            "unit": "iter/sec",
            "range": "stddev: 0.00000871467796073042",
            "extra": "mean: 295.19752320161564 usec\nrounds: 3448"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_validate_3d",
            "value": 71.7699950554572,
            "unit": "iter/sec",
            "range": "stddev: 0.0001294222536419269",
            "extra": "mean: 13.93339931579057 msec\nrounds: 76"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_metric_field_set_get",
            "value": 7179.188357867833,
            "unit": "iter/sec",
            "range": "stddev: 0.000010219501003294877",
            "extra": "mean: 139.29151181889213 usec\nrounds: 16076"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_adaptive_hmin_hmax_hausd",
            "value": 0.11518368870551939,
            "unit": "iter/sec",
            "range": "stddev: 0.062336813520863385",
            "extra": "mean: 8.681784819 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_metric_hgrad",
            "value": 0.09652836413507573,
            "unit": "iter/sec",
            "range": "stddev: 0.043247905843563826",
            "extra": "mean: 10.359649300600006 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_optimize",
            "value": 0.40806099998968137,
            "unit": "iter/sec",
            "range": "stddev: 0.07585446374924082",
            "extra": "mean: 2.450614001400004 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_adaptive_hmax_hgrad_angle",
            "value": 5.115103136898663,
            "unit": "iter/sec",
            "range": "stddev: 0.0015815324807663823",
            "extra": "mean: 195.49947933333556 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_metric_hmin_hausd",
            "value": 5.097185616996241,
            "unit": "iter/sec",
            "range": "stddev: 0.0005606831797995524",
            "extra": "mean: 196.18669499999442 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_uniform_angle",
            "value": 5.084673624981937,
            "unit": "iter/sec",
            "range": "stddev: 0.002824111560937626",
            "extra": "mean: 196.66945683333856 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_adaptive_hmin_hgrad",
            "value": 4.786813360080749,
            "unit": "iter/sec",
            "range": "stddev: 0.0018392064660714",
            "extra": "mean: 208.9072468000154 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_metric_hmax_hausd_angle",
            "value": 1.8432651819149366,
            "unit": "iter/sec",
            "range": "stddev: 0.025883801471100885",
            "extra": "mean: 542.5155370000084 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_optimize",
            "value": 1.9776171315434894,
            "unit": "iter/sec",
            "range": "stddev: 0.0051338041532105515",
            "extra": "mean: 505.659049999997 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_uniform",
            "value": 2.7803156236204423,
            "unit": "iter/sec",
            "range": "stddev: 0.006518183472033558",
            "extra": "mean: 359.67139540000517 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 171.03196290996289,
            "unit": "iter/sec",
            "range": "stddev: 0.00004209827067511361",
            "extra": "mean: 5.846860335260459 msec\nrounds: 173"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 13.715123324296243,
            "unit": "iter/sec",
            "range": "stddev: 0.0007117272201801188",
            "extra": "mean: 72.91221350000602 msec\nrounds: 14"
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
          "id": "bc0d3cb7db35c09d4f42fa31ac2c75c74b6a3211",
          "message": "add mmg2d.generate() for boundary-edge triangulation (#250)\n\n* add mmg2d.generate() for boundary-edge triangulation\n\n* fix io.md codeblock chain in mmg2d.generate doc section\n\n* address PR #250 review: planarity guard, doc note, stricter tests",
          "timestamp": "2026-05-11T00:33:24+02:00",
          "tree_id": "10d61493061642672a3fff08bcc78e28a15fb814",
          "url": "https://github.com/kmarchais/mmgpy/commit/bc0d3cb7db35c09d4f42fa31ac2c75c74b6a3211"
        },
        "date": 1778452844549,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_construction_3d",
            "value": 43.927054631563315,
            "unit": "iter/sec",
            "range": "stddev: 0.0002700988115523563",
            "extra": "mean: 22.765013688886405 msec\nrounds: 45"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_io_roundtrip_3d",
            "value": 21.154134256882042,
            "unit": "iter/sec",
            "range": "stddev: 0.00015731122729356435",
            "extra": "mean: 47.27208345454608 msec\nrounds: 22"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_pyvista_roundtrip_3d",
            "value": 37.51319071996803,
            "unit": "iter/sec",
            "range": "stddev: 0.0006821258545342773",
            "extra": "mean: 26.657289897436172 msec\nrounds: 39"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_quality_3d",
            "value": 3395.666037003219,
            "unit": "iter/sec",
            "range": "stddev: 0.000009605777982533849",
            "extra": "mean: 294.49303585888885 usec\nrounds: 3458"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_validate_3d",
            "value": 72.10848036705892,
            "unit": "iter/sec",
            "range": "stddev: 0.0002825838750630772",
            "extra": "mean: 13.86799437333347 msec\nrounds: 75"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_metric_field_set_get",
            "value": 8594.49596176492,
            "unit": "iter/sec",
            "range": "stddev: 0.0000047684637804615445",
            "extra": "mean: 116.35353654813345 usec\nrounds: 15760"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_adaptive_hmin_hmax_hausd",
            "value": 0.11381154664983323,
            "unit": "iter/sec",
            "range": "stddev: 0.06420089971487206",
            "extra": "mean: 8.786454708999997 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_metric_hgrad",
            "value": 0.09109974132384063,
            "unit": "iter/sec",
            "range": "stddev: 0.0934087015103406",
            "extra": "mean: 10.976979577199984 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_optimize",
            "value": 0.39861624732198453,
            "unit": "iter/sec",
            "range": "stddev: 0.018001138607835473",
            "extra": "mean: 2.5086784763999956 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_adaptive_hmax_hgrad_angle",
            "value": 5.267423542111297,
            "unit": "iter/sec",
            "range": "stddev: 0.0005678769336023034",
            "extra": "mean: 189.84613483334556 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_metric_hmin_hausd",
            "value": 5.29277901607065,
            "unit": "iter/sec",
            "range": "stddev: 0.0004677836599252987",
            "extra": "mean: 188.9366619999938 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_uniform_angle",
            "value": 5.241814257052548,
            "unit": "iter/sec",
            "range": "stddev: 0.0022689811435148",
            "extra": "mean: 190.77364266667018 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_adaptive_hmin_hgrad",
            "value": 5.252737877341277,
            "unit": "iter/sec",
            "range": "stddev: 0.008188017349136467",
            "extra": "mean: 190.37690883333389 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_metric_hmax_hausd_angle",
            "value": 2.065319944092762,
            "unit": "iter/sec",
            "range": "stddev: 0.0022435214632457734",
            "extra": "mean: 484.18648299998495 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_optimize",
            "value": 2.0797628303024,
            "unit": "iter/sec",
            "range": "stddev: 0.004797856358974374",
            "extra": "mean: 480.8240562000037 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_uniform",
            "value": 2.848255429450509,
            "unit": "iter/sec",
            "range": "stddev: 0.0014064760693151674",
            "extra": "mean: 351.09210700001086 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 164.07585699320546,
            "unit": "iter/sec",
            "range": "stddev: 0.00003519497362451933",
            "extra": "mean: 6.094741897593202 msec\nrounds: 166"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 13.631497771440696,
            "unit": "iter/sec",
            "range": "stddev: 0.0001837594700947484",
            "extra": "mean: 73.35951021428448 msec\nrounds: 14"
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
          "id": "b0752fb571b3c7e46e46de14029119c359ccbc2e",
          "message": "auto-route VTK :metric/:ls point_data arrays into mesh solutions (#251)\n\n* auto-route VTK :metric/:ls point_data arrays into mesh solutions\n\n* address review feedback on VTK solution alias routing",
          "timestamp": "2026-05-11T07:47:09Z",
          "tree_id": "c2c6e3599fae7ef12b21220919aa56edaafb6956",
          "url": "https://github.com/kmarchais/mmgpy/commit/b0752fb571b3c7e46e46de14029119c359ccbc2e"
        },
        "date": 1778486076663,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_construction_3d",
            "value": 16.01412038470817,
            "unit": "iter/sec",
            "range": "stddev: 0.0012155161876210028",
            "extra": "mean: 62.44489088235509 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_io_roundtrip_3d",
            "value": 11.898586276978024,
            "unit": "iter/sec",
            "range": "stddev: 0.001970951618916307",
            "extra": "mean: 84.04359784614493 msec\nrounds: 13"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_pyvista_roundtrip_3d",
            "value": 15.403090221292258,
            "unit": "iter/sec",
            "range": "stddev: 0.0016205337624589432",
            "extra": "mean: 64.9220374375048 msec\nrounds: 16"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_quality_3d",
            "value": 3779.6674598713585,
            "unit": "iter/sec",
            "range": "stddev: 0.000005436371272388632",
            "extra": "mean: 264.5735400314913 usec\nrounds: 3872"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_validate_3d",
            "value": 84.53498146640652,
            "unit": "iter/sec",
            "range": "stddev: 0.000087801814512915",
            "extra": "mean: 11.829422360462589 msec\nrounds: 86"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_metric_field_set_get",
            "value": 3749.8485294251095,
            "unit": "iter/sec",
            "range": "stddev: 0.000004657255338130593",
            "extra": "mean: 266.67743834263894 usec\nrounds: 20322"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_adaptive_hmin_hmax_hausd",
            "value": 0.12092941439719367,
            "unit": "iter/sec",
            "range": "stddev: 0.048160308716243216",
            "extra": "mean: 8.269286715599993 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_metric_hgrad",
            "value": 0.1067756462260118,
            "unit": "iter/sec",
            "range": "stddev: 0.1211793414923939",
            "extra": "mean: 9.365431494399967 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_optimize",
            "value": 0.21400236850656676,
            "unit": "iter/sec",
            "range": "stddev: 0.014212871116202105",
            "extra": "mean: 4.6728454781999975 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_adaptive_hmax_hgrad_angle",
            "value": 5.556018896664474,
            "unit": "iter/sec",
            "range": "stddev: 0.0005015558282488327",
            "extra": "mean: 179.98498900000945 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_metric_hmin_hausd",
            "value": 5.559892276679203,
            "unit": "iter/sec",
            "range": "stddev: 0.0005537870266232208",
            "extra": "mean: 179.85959983334018 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_uniform_angle",
            "value": 5.557295668324261,
            "unit": "iter/sec",
            "range": "stddev: 0.0004193432820781357",
            "extra": "mean: 179.94363800001642 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_adaptive_hmin_hgrad",
            "value": 4.863460486757215,
            "unit": "iter/sec",
            "range": "stddev: 0.0013268802089108933",
            "extra": "mean: 205.61491199998727 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_metric_hmax_hausd_angle",
            "value": 2.20389131409834,
            "unit": "iter/sec",
            "range": "stddev: 0.0046016544220892274",
            "extra": "mean: 453.74288360001174 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_optimize",
            "value": 2.3233821412492817,
            "unit": "iter/sec",
            "range": "stddev: 0.0016903479983075953",
            "extra": "mean: 430.4070270000011 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_uniform",
            "value": 2.978766511696699,
            "unit": "iter/sec",
            "range": "stddev: 0.001577678571252997",
            "extra": "mean: 335.7094274000019 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 185.29246122625813,
            "unit": "iter/sec",
            "range": "stddev: 0.000026474387037181876",
            "extra": "mean: 5.39687364171235 msec\nrounds: 187"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 15.35646220526713,
            "unit": "iter/sec",
            "range": "stddev: 0.0001449665798858607",
            "extra": "mean: 65.11916524998895 msec\nrounds: 16"
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
          "id": "ca5dc26ee5aeff7c0be8efcc087e6ebba5f9a2b4",
          "message": "add Dosol + Clean_isoSurf bindings (#252)\n\n* add Dosol + Clean_isoSurf bindings\n\n* warn on cell_data loss in clean_iso_surface and tighten dosol tests",
          "timestamp": "2026-05-12T11:03:02Z",
          "tree_id": "d5069d7556c4a506d2246af0bbefb702751fdcf9",
          "url": "https://github.com/kmarchais/mmgpy/commit/ca5dc26ee5aeff7c0be8efcc087e6ebba5f9a2b4"
        },
        "date": 1778584221082,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_construction_3d",
            "value": 34.39753427309897,
            "unit": "iter/sec",
            "range": "stddev: 0.0003599207327557422",
            "extra": "mean: 29.07185125714266 msec\nrounds: 35"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_io_roundtrip_3d",
            "value": 18.256490775566515,
            "unit": "iter/sec",
            "range": "stddev: 0.00021078990843943781",
            "extra": "mean: 54.77503931578927 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_pyvista_roundtrip_3d",
            "value": 31.27704734593808,
            "unit": "iter/sec",
            "range": "stddev: 0.00011856892020444017",
            "extra": "mean: 31.972327468752226 msec\nrounds: 32"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_quality_3d",
            "value": 3387.1732611274697,
            "unit": "iter/sec",
            "range": "stddev: 0.000011716063659889483",
            "extra": "mean: 295.231428364292 usec\nrounds: 3448"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_validate_3d",
            "value": 74.94887160750703,
            "unit": "iter/sec",
            "range": "stddev: 0.000054956403324896654",
            "extra": "mean: 13.342429025973994 msec\nrounds: 77"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_metric_field_set_get",
            "value": 6899.100549490756,
            "unit": "iter/sec",
            "range": "stddev: 0.0000061933916085692704",
            "extra": "mean: 144.94643074506473 usec\nrounds: 19060"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_adaptive_hmin_hmax_hausd",
            "value": 0.11356580455415279,
            "unit": "iter/sec",
            "range": "stddev: 0.05938864113476858",
            "extra": "mean: 8.805467490200005 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_metric_hgrad",
            "value": 0.10530091305605427,
            "unit": "iter/sec",
            "range": "stddev: 0.026714566818267924",
            "extra": "mean: 9.496593818399992 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_optimize",
            "value": 0.34845139827410676,
            "unit": "iter/sec",
            "range": "stddev: 0.0049581153937719195",
            "extra": "mean: 2.8698406863999937 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_adaptive_hmax_hgrad_angle",
            "value": 5.375434004814101,
            "unit": "iter/sec",
            "range": "stddev: 0.00015418532959764943",
            "extra": "mean: 186.03149050000903 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_metric_hmin_hausd",
            "value": 5.370592580793213,
            "unit": "iter/sec",
            "range": "stddev: 0.00008605920751903543",
            "extra": "mean: 186.19919216666858 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_uniform_angle",
            "value": 5.370425251806793,
            "unit": "iter/sec",
            "range": "stddev: 0.00016824005530843787",
            "extra": "mean: 186.2049936666684 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_adaptive_hmin_hgrad",
            "value": 5.281341116722628,
            "unit": "iter/sec",
            "range": "stddev: 0.001464195282971418",
            "extra": "mean: 189.34584566666976 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_metric_hmax_hausd_angle",
            "value": 2.1256247554976104,
            "unit": "iter/sec",
            "range": "stddev: 0.0012634640579438146",
            "extra": "mean: 470.44992180000236 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_optimize",
            "value": 2.132766220899186,
            "unit": "iter/sec",
            "range": "stddev: 0.0008532369834236427",
            "extra": "mean: 468.8746427999945 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_uniform",
            "value": 2.8981786119447444,
            "unit": "iter/sec",
            "range": "stddev: 0.0009048979430281811",
            "extra": "mean: 345.044296399999 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 171.82302243396646,
            "unit": "iter/sec",
            "range": "stddev: 0.00006941565870547558",
            "extra": "mean: 5.819941855488611 msec\nrounds: 173"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.28852494743611,
            "unit": "iter/sec",
            "range": "stddev: 0.00051690473055493",
            "extra": "mean: 69.98623046666808 msec\nrounds: 15"
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
          "id": "687027f5d0c3a56417d1b5064cca86870547fc5d",
          "message": "register tetgen .node/.ele as pyvista readers (#253)\n\n* register tetgen .node/.ele as pyvista readers\n\n* address review: drop em dash, strengthen tetgen reader tests",
          "timestamp": "2026-05-12T12:25:44Z",
          "tree_id": "23799cb7f5b4cce85a59ad879415745370abb6cf",
          "url": "https://github.com/kmarchais/mmgpy/commit/687027f5d0c3a56417d1b5064cca86870547fc5d"
        },
        "date": 1778589170134,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_construction_3d",
            "value": 33.73848504782427,
            "unit": "iter/sec",
            "range": "stddev: 0.00026201918570897364",
            "extra": "mean: 29.639742228570753 msec\nrounds: 35"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_io_roundtrip_3d",
            "value": 18.508568160742715,
            "unit": "iter/sec",
            "range": "stddev: 0.0002645066728367424",
            "extra": "mean: 54.02903084210658 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_pyvista_roundtrip_3d",
            "value": 30.81693737360628,
            "unit": "iter/sec",
            "range": "stddev: 0.0003115022069529082",
            "extra": "mean: 32.4496879062508 msec\nrounds: 32"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_quality_3d",
            "value": 3382.113173004081,
            "unit": "iter/sec",
            "range": "stddev: 0.00001171829042931304",
            "extra": "mean: 295.67313358463815 usec\nrounds: 3451"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_validate_3d",
            "value": 74.69066407992358,
            "unit": "iter/sec",
            "range": "stddev: 0.00006879892140486594",
            "extra": "mean: 13.388554142856982 msec\nrounds: 77"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_metric_field_set_get",
            "value": 7138.805099716982,
            "unit": "iter/sec",
            "range": "stddev: 0.000007241173391667455",
            "extra": "mean: 140.0794651250032 usec\nrounds: 18595"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_adaptive_hmin_hmax_hausd",
            "value": 0.12245697500866444,
            "unit": "iter/sec",
            "range": "stddev: 0.0973249109476623",
            "extra": "mean: 8.1661334516 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_metric_hgrad",
            "value": 0.10108842841494457,
            "unit": "iter/sec",
            "range": "stddev: 0.028578922343758237",
            "extra": "mean: 9.892329079399985 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_optimize",
            "value": 0.34230983565545026,
            "unit": "iter/sec",
            "range": "stddev: 0.016302940334726113",
            "extra": "mean: 2.921330022799998 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_adaptive_hmax_hgrad_angle",
            "value": 5.334313438747062,
            "unit": "iter/sec",
            "range": "stddev: 0.00058956296491402",
            "extra": "mean: 187.4655495000089 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_metric_hmin_hausd",
            "value": 5.329398967313985,
            "unit": "iter/sec",
            "range": "stddev: 0.0003359264837929496",
            "extra": "mean: 187.6384196666739 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_uniform_angle",
            "value": 5.3251411976497405,
            "unit": "iter/sec",
            "range": "stddev: 0.0002757201541169579",
            "extra": "mean: 187.78844783333662 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_adaptive_hmin_hgrad",
            "value": 5.171602105694774,
            "unit": "iter/sec",
            "range": "stddev: 0.0022877289314504794",
            "extra": "mean: 193.36367716666322 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_metric_hmax_hausd_angle",
            "value": 2.049243464724057,
            "unit": "iter/sec",
            "range": "stddev: 0.007295385192185053",
            "extra": "mean: 487.9849648000004 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_optimize",
            "value": 2.0592830498237937,
            "unit": "iter/sec",
            "range": "stddev: 0.0045862551271596205",
            "extra": "mean: 485.60590060000095 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_uniform",
            "value": 2.8517752425220966,
            "unit": "iter/sec",
            "range": "stddev: 0.0015186010651872424",
            "extra": "mean: 350.65877040001396 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 172.22846302382982,
            "unit": "iter/sec",
            "range": "stddev: 0.00003100725997983767",
            "extra": "mean: 5.806241212648099 msec\nrounds: 174"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.27949329526427,
            "unit": "iter/sec",
            "range": "stddev: 0.00027229863211486894",
            "extra": "mean: 70.03049613333587 msec\nrounds: 15"
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
          "id": "f07503ce01656b0ebcaf5698473c6b51c6bff025",
          "message": "add multi-block .sol I/O via MMG's multi-sol C API (#254)\n\n* add multi-block .sol I/O via MMG's multi-sol C API\n\n* address review: skip pv-reserved arrays, validate explicit keys, simplify infer_sol_type",
          "timestamp": "2026-05-12T14:01:27Z",
          "tree_id": "0ada0f874fc20828971e20869474d1d69ebe7899",
          "url": "https://github.com/kmarchais/mmgpy/commit/f07503ce01656b0ebcaf5698473c6b51c6bff025"
        },
        "date": 1778594933960,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_construction_3d",
            "value": 35.111095999036905,
            "unit": "iter/sec",
            "range": "stddev: 0.0003708960081068279",
            "extra": "mean: 28.481024916665376 msec\nrounds: 36"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_io_roundtrip_3d",
            "value": 18.714247402986494,
            "unit": "iter/sec",
            "range": "stddev: 0.00031997816822261087",
            "extra": "mean: 53.43522389473252 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_pyvista_roundtrip_3d",
            "value": 31.643058688320973,
            "unit": "iter/sec",
            "range": "stddev: 0.0002778177001004427",
            "extra": "mean: 31.602507515150126 msec\nrounds: 33"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_quality_3d",
            "value": 3365.220563050318,
            "unit": "iter/sec",
            "range": "stddev: 0.000012363165605009174",
            "extra": "mean: 297.15734266569905 usec\nrounds: 3429"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_validate_3d",
            "value": 74.15325807272943,
            "unit": "iter/sec",
            "range": "stddev: 0.00013231701216235764",
            "extra": "mean: 13.485584126582827 msec\nrounds: 79"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_metric_field_set_get",
            "value": 9181.643141274297,
            "unit": "iter/sec",
            "range": "stddev: 0.000005674344941552701",
            "extra": "mean: 108.91296738649032 usec\nrounds: 19777"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_adaptive_hmin_hmax_hausd",
            "value": 0.11693967627624503,
            "unit": "iter/sec",
            "range": "stddev: 0.36910140764484056",
            "extra": "mean: 8.551417549999996 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_metric_hgrad",
            "value": 0.09619941033115363,
            "unit": "iter/sec",
            "range": "stddev: 0.06376149695396177",
            "extra": "mean: 10.3950741128 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_optimize",
            "value": 0.33278856869626505,
            "unit": "iter/sec",
            "range": "stddev: 0.04499234038120913",
            "extra": "mean: 3.004910907600004 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_adaptive_hmax_hgrad_angle",
            "value": 5.2793157267714745,
            "unit": "iter/sec",
            "range": "stddev: 0.0009152460882214802",
            "extra": "mean: 189.41848749999698 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_metric_hmin_hausd",
            "value": 5.268834199313019,
            "unit": "iter/sec",
            "range": "stddev: 0.0010870652980635555",
            "extra": "mean: 189.79530616666315 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_uniform_angle",
            "value": 5.293913717717356,
            "unit": "iter/sec",
            "range": "stddev: 0.0018726638956427118",
            "extra": "mean: 188.89616516666288 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_adaptive_hmin_hgrad",
            "value": 5.1035124375725545,
            "unit": "iter/sec",
            "range": "stddev: 0.0024927644722605056",
            "extra": "mean: 195.94348249999408 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_metric_hmax_hausd_angle",
            "value": 2.0512200552071542,
            "unit": "iter/sec",
            "range": "stddev: 0.0017545435115320861",
            "extra": "mean: 487.51473419998774 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_optimize",
            "value": 2.0117558028641342,
            "unit": "iter/sec",
            "range": "stddev: 0.008057198561242677",
            "extra": "mean: 497.0782232000033 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_uniform",
            "value": 2.8060782193171003,
            "unit": "iter/sec",
            "range": "stddev: 0.0037777838794054463",
            "extra": "mean: 356.369253399987 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 171.02917150965305,
            "unit": "iter/sec",
            "range": "stddev: 0.0001274859516340914",
            "extra": "mean: 5.846955763003033 msec\nrounds: 173"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.246887920489112,
            "unit": "iter/sec",
            "range": "stddev: 0.00022914032669515546",
            "extra": "mean: 70.19076766666026 msec\nrounds: 15"
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
          "id": "de184069513a95796d2de31f859954b957d078a9",
          "message": "Add aniso flag to build_size_map for mesh-implied metric (closes #255) (#256)\n\n* add aniso flag to build_size_map for mesh-implied metric tensor\n\n* use hessian-adapted source mesh in mesh_implied_metric examples\n\n* extend hessian_adaptation examples with implied-metric refinement family\n\n* simplify build_size_map: reuse validate_metric_tensor, guard Set_solSize\n\n* clarify build_size_map comments; reset MMGS info.ani on iso path\n\n* tighten hessian_adaptation examples: drop helpers and family wording\n\n* split hessian_adaptation examples into mesh-processing and visualization sections\n\n* add metric= kwarg to .mmg.remesh accessor\n\n* cover line-only error path and 1D scalar reshape in remesh(metric=) tests\n\n* validate metric= shape in .mmg.remesh and hoist numpy import",
          "timestamp": "2026-05-12T18:53:48Z",
          "tree_id": "46f5e4b33bce5f30a39376e5933793010aa475c5",
          "url": "https://github.com/kmarchais/mmgpy/commit/de184069513a95796d2de31f859954b957d078a9"
        },
        "date": 1778612435705,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_construction_3d",
            "value": 36.42792795102558,
            "unit": "iter/sec",
            "range": "stddev: 0.0001645295742158901",
            "extra": "mean: 27.451465297296615 msec\nrounds: 37"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_io_roundtrip_3d",
            "value": 19.212647473724296,
            "unit": "iter/sec",
            "range": "stddev: 0.00022086984448856813",
            "extra": "mean: 52.049047450000074 msec\nrounds: 20"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_pyvista_roundtrip_3d",
            "value": 32.8565403192712,
            "unit": "iter/sec",
            "range": "stddev: 0.00019827769938397872",
            "extra": "mean: 30.435340735295693 msec\nrounds: 34"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_quality_3d",
            "value": 3388.9413235071606,
            "unit": "iter/sec",
            "range": "stddev: 0.00000896223112028823",
            "extra": "mean: 295.07740162497595 usec\nrounds: 3446"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_validate_3d",
            "value": 74.53818120125955,
            "unit": "iter/sec",
            "range": "stddev: 0.00010570930192814205",
            "extra": "mean: 13.41594312986942 msec\nrounds: 77"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_metric_field_set_get",
            "value": 9237.162623434595,
            "unit": "iter/sec",
            "range": "stddev: 0.000005035499934743233",
            "extra": "mean: 108.25835170022984 usec\nrounds: 18675"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_adaptive_hmin_hmax_hausd",
            "value": 0.1277015965010145,
            "unit": "iter/sec",
            "range": "stddev: 0.14685972213617893",
            "extra": "mean: 7.830755663199994 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_metric_hgrad",
            "value": 0.10582643029426332,
            "unit": "iter/sec",
            "range": "stddev: 0.11010091111380177",
            "extra": "mean: 9.44943524240001 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_optimize",
            "value": 0.41811772877402265,
            "unit": "iter/sec",
            "range": "stddev: 0.0024334243877693965",
            "extra": "mean: 2.3916708887999905 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_adaptive_hmax_hgrad_angle",
            "value": 5.353067394872397,
            "unit": "iter/sec",
            "range": "stddev: 0.00021978501814928794",
            "extra": "mean: 186.8087819999952 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_metric_hmin_hausd",
            "value": 5.349889977862809,
            "unit": "iter/sec",
            "range": "stddev: 0.00015301645698073685",
            "extra": "mean: 186.91973183334198 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_uniform_angle",
            "value": 5.342404532030324,
            "unit": "iter/sec",
            "range": "stddev: 0.0002251867277261126",
            "extra": "mean: 187.18163216666048 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_adaptive_hmin_hgrad",
            "value": 5.278271507538838,
            "unit": "iter/sec",
            "range": "stddev: 0.0013274696323645003",
            "extra": "mean: 189.45596083333763 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_metric_hmax_hausd_angle",
            "value": 2.1132697675735654,
            "unit": "iter/sec",
            "range": "stddev: 0.0010188897356137837",
            "extra": "mean: 473.20035299998153 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_optimize",
            "value": 2.0959481184629634,
            "unit": "iter/sec",
            "range": "stddev: 0.0019198906429391948",
            "extra": "mean: 477.1110464000117 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_uniform",
            "value": 2.849803837115752,
            "unit": "iter/sec",
            "range": "stddev: 0.006629474055161852",
            "extra": "mean: 350.9013451999863 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 172.09606815557032,
            "unit": "iter/sec",
            "range": "stddev: 0.00005019095027961308",
            "extra": "mean: 5.810707999999316 msec\nrounds: 174"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.303731852126463,
            "unit": "iter/sec",
            "range": "stddev: 0.00008615865162331798",
            "extra": "mean: 69.91182513333645 msec\nrounds: 15"
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
          "id": "6316f080b67d513b135e1a4e5b879e6b57b056f5",
          "message": "run MMGS_analys to enable aniso build_size_map on surface meshes (#257)",
          "timestamp": "2026-05-12T19:46:43Z",
          "tree_id": "d04f95cf69488a6a1c7f174b8ccba9cd138d0490",
          "url": "https://github.com/kmarchais/mmgpy/commit/6316f080b67d513b135e1a4e5b879e6b57b056f5"
        },
        "date": 1778615618995,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_construction_3d",
            "value": 34.399480268109706,
            "unit": "iter/sec",
            "range": "stddev: 0.001704434149905976",
            "extra": "mean: 29.07020664864688 msec\nrounds: 37"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_io_roundtrip_3d",
            "value": 17.966147407781733,
            "unit": "iter/sec",
            "range": "stddev: 0.0004505120236032376",
            "extra": "mean: 55.660235736842886 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_pyvista_roundtrip_3d",
            "value": 30.2743196978144,
            "unit": "iter/sec",
            "range": "stddev: 0.00041407506007407746",
            "extra": "mean: 33.031295500000724 msec\nrounds: 32"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_quality_3d",
            "value": 3380.5397405916115,
            "unit": "iter/sec",
            "range": "stddev: 0.00000846237320800225",
            "extra": "mean: 295.8107511627699 usec\nrounds: 3440"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_validate_3d",
            "value": 72.68059328587528,
            "unit": "iter/sec",
            "range": "stddev: 0.00009495662636382496",
            "extra": "mean: 13.758830999998727 msec\nrounds: 77"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_metric_field_set_get",
            "value": 9210.949405467336,
            "unit": "iter/sec",
            "range": "stddev: 0.000005433856827426675",
            "extra": "mean: 108.56644152300204 usec\nrounds: 18255"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_adaptive_hmin_hmax_hausd",
            "value": 0.12697959021217958,
            "unit": "iter/sec",
            "range": "stddev: 0.07428926681745321",
            "extra": "mean: 7.8752813608 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_metric_hgrad",
            "value": 0.10208394674611386,
            "unit": "iter/sec",
            "range": "stddev: 0.04860030449504957",
            "extra": "mean: 9.795859504600003 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_optimize",
            "value": 0.40687254856883537,
            "unit": "iter/sec",
            "range": "stddev: 0.00772853269865755",
            "extra": "mean: 2.457772104600019 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_adaptive_hmax_hgrad_angle",
            "value": 5.319122623489251,
            "unit": "iter/sec",
            "range": "stddev: 0.0020738314306729434",
            "extra": "mean: 188.00092999999643 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_metric_hmin_hausd",
            "value": 5.297724492150373,
            "unit": "iter/sec",
            "range": "stddev: 0.0023697648686579567",
            "extra": "mean: 188.76028783333254 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_uniform_angle",
            "value": 5.338330637174308,
            "unit": "iter/sec",
            "range": "stddev: 0.00038455893437367946",
            "extra": "mean: 187.32447799998417 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_adaptive_hmin_hgrad",
            "value": 5.004109170115972,
            "unit": "iter/sec",
            "range": "stddev: 0.0020984034831687173",
            "extra": "mean: 199.83576816666945 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_metric_hmax_hausd_angle",
            "value": 2.099655101120773,
            "unit": "iter/sec",
            "range": "stddev: 0.003409435791772344",
            "extra": "mean: 476.26869739997346 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_optimize",
            "value": 2.110021835501872,
            "unit": "iter/sec",
            "range": "stddev: 0.004404056451912613",
            "extra": "mean: 473.92874480000273 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_uniform",
            "value": 2.85141461772978,
            "unit": "iter/sec",
            "range": "stddev: 0.004910508043750316",
            "extra": "mean: 350.7031189999907 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 171.5115651145802,
            "unit": "iter/sec",
            "range": "stddev: 0.00009624944064517064",
            "extra": "mean: 5.83051060919384 msec\nrounds: 174"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.330616679922748,
            "unit": "iter/sec",
            "range": "stddev: 0.00014212933970539116",
            "extra": "mean: 69.78066766666112 msec\nrounds: 15"
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
          "id": "3c599d47a6243e4e3c073ec9d64a432f3672478b",
          "message": "surface multiMat / localParameter / lsBaseReference on Mesh + .mmg accessor (#258)\n\n* surface multiMat / localParameter / lsBaseReference on Mesh + .mmg accessor\n\n* tighten split validation and skip redundant normalization on accessor path",
          "timestamp": "2026-05-12T21:58:34Z",
          "tree_id": "4dca1f721aa91c6fb59a2661de2fa9f0972d174c",
          "url": "https://github.com/kmarchais/mmgpy/commit/3c599d47a6243e4e3c073ec9d64a432f3672478b"
        },
        "date": 1778623558226,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_construction_3d",
            "value": 40.607078727478964,
            "unit": "iter/sec",
            "range": "stddev: 0.00021364430418224344",
            "extra": "mean: 24.626248214287234 msec\nrounds: 42"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_io_roundtrip_3d",
            "value": 20.331502711937908,
            "unit": "iter/sec",
            "range": "stddev: 0.0003602956450498699",
            "extra": "mean: 49.18475599999979 msec\nrounds: 21"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_pyvista_roundtrip_3d",
            "value": 35.311753721640756,
            "unit": "iter/sec",
            "range": "stddev: 0.00022674118510055639",
            "extra": "mean: 28.319182555556605 msec\nrounds: 36"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_quality_3d",
            "value": 3369.2624970334423,
            "unit": "iter/sec",
            "range": "stddev: 0.000013474515065560759",
            "extra": "mean: 296.80085801580515 usec\nrounds: 3437"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_validate_3d",
            "value": 72.70649453306807,
            "unit": "iter/sec",
            "range": "stddev: 0.00010176162740315184",
            "extra": "mean: 13.753929500000638 msec\nrounds: 76"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_metric_field_set_get",
            "value": 8581.003455902033,
            "unit": "iter/sec",
            "range": "stddev: 0.00000573600903304707",
            "extra": "mean: 116.53648726970245 usec\nrounds: 17046"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_adaptive_hmin_hmax_hausd",
            "value": 0.11386997244221557,
            "unit": "iter/sec",
            "range": "stddev: 0.14737908227131025",
            "extra": "mean: 8.78194644780001 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_metric_hgrad",
            "value": 0.09029871435077468,
            "unit": "iter/sec",
            "range": "stddev: 0.06258115308729002",
            "extra": "mean: 11.074354792199994 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_optimize",
            "value": 0.3955620369784168,
            "unit": "iter/sec",
            "range": "stddev: 0.005977704218119637",
            "extra": "mean: 2.5280484640000056 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_adaptive_hmax_hgrad_angle",
            "value": 4.997680330839183,
            "unit": "iter/sec",
            "range": "stddev: 0.0031704042741438564",
            "extra": "mean: 200.092829833333 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_metric_hmin_hausd",
            "value": 5.063914637469261,
            "unit": "iter/sec",
            "range": "stddev: 0.003920977377075895",
            "extra": "mean: 197.47568266667295 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_uniform_angle",
            "value": 5.1730130286892,
            "unit": "iter/sec",
            "range": "stddev: 0.0006104512086448874",
            "extra": "mean: 193.31093783334077 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_adaptive_hmin_hgrad",
            "value": 5.223258863546583,
            "unit": "iter/sec",
            "range": "stddev: 0.0011354291231697171",
            "extra": "mean: 191.45135750001904 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_metric_hmax_hausd_angle",
            "value": 1.9278365803128523,
            "unit": "iter/sec",
            "range": "stddev: 0.0033023600568467056",
            "extra": "mean: 518.7161661999994 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_optimize",
            "value": 1.9547904279934272,
            "unit": "iter/sec",
            "range": "stddev: 0.004093909515838564",
            "extra": "mean: 511.56378999997963 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_uniform",
            "value": 2.7594285498533533,
            "unit": "iter/sec",
            "range": "stddev: 0.00198647534446041",
            "extra": "mean: 362.39387319999423 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 160.37924680246232,
            "unit": "iter/sec",
            "range": "stddev: 0.0005590579854880376",
            "extra": "mean: 6.235220703035793 msec\nrounds: 165"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 13.380500527958716,
            "unit": "iter/sec",
            "range": "stddev: 0.00021568495700105732",
            "extra": "mean: 74.7356197857089 msec\nrounds: 14"
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
          "id": "c60940221e41ce95a97c9e4f637acfd1329d72d4",
          "message": "drop windows fallbacks for MMGS_analys and MMGS_Get_triangleQuality (#259)\n\n* drop windows fallbacks for MMGS_analys and MMGS_Get_triangleQuality\n\n* guard mmgs surface aniso fallback by build kind, not platform\n\n* restore RuntimeError assertion for conda-windows surface aniso",
          "timestamp": "2026-05-13T09:02:55Z",
          "tree_id": "fad7991e4632a7a727a5c7e33132dc16893e129e",
          "url": "https://github.com/kmarchais/mmgpy/commit/c60940221e41ce95a97c9e4f637acfd1329d72d4"
        },
        "date": 1778663419142,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_construction_3d",
            "value": 40.8609675546171,
            "unit": "iter/sec",
            "range": "stddev: 0.00042181985318420014",
            "extra": "mean: 24.473233499998333 msec\nrounds: 42"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_io_roundtrip_3d",
            "value": 21.67537335214725,
            "unit": "iter/sec",
            "range": "stddev: 0.0002229168605481376",
            "extra": "mean: 46.13530681818387 msec\nrounds: 22"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_pyvista_roundtrip_3d",
            "value": 37.20995612773927,
            "unit": "iter/sec",
            "range": "stddev: 0.00013525878874214364",
            "extra": "mean: 26.874527789472996 msec\nrounds: 38"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_quality_3d",
            "value": 3374.4449711589978,
            "unit": "iter/sec",
            "range": "stddev: 0.000010456897329345883",
            "extra": "mean: 296.3450311227143 usec\nrounds: 3438"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_validate_3d",
            "value": 71.7480925389377,
            "unit": "iter/sec",
            "range": "stddev: 0.00017167740996604426",
            "extra": "mean: 13.937652759999157 msec\nrounds: 75"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_metric_field_set_get",
            "value": 8772.89462927918,
            "unit": "iter/sec",
            "range": "stddev: 0.000004742662433579301",
            "extra": "mean: 113.98746277682858 usec\nrounds: 18201"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_adaptive_hmin_hmax_hausd",
            "value": 0.11619843394527389,
            "unit": "iter/sec",
            "range": "stddev: 0.0687755389699126",
            "extra": "mean: 8.605967964000024 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_metric_hgrad",
            "value": 0.09235244893521236,
            "unit": "iter/sec",
            "range": "stddev: 0.06619228566115616",
            "extra": "mean: 10.828083191400003 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_optimize",
            "value": 0.39993932827604334,
            "unit": "iter/sec",
            "range": "stddev: 0.004085081623314304",
            "extra": "mean: 2.500379255799987 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_adaptive_hmax_hgrad_angle",
            "value": 5.276911651151184,
            "unit": "iter/sec",
            "range": "stddev: 0.0002036502468540501",
            "extra": "mean: 189.5047834999938 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_metric_hmin_hausd",
            "value": 5.269998121157546,
            "unit": "iter/sec",
            "range": "stddev: 0.00023811218638874893",
            "extra": "mean: 189.75338833334376 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_uniform_angle",
            "value": 5.2676781864248845,
            "unit": "iter/sec",
            "range": "stddev: 0.00012276553617014387",
            "extra": "mean: 189.8369574999966 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_adaptive_hmin_hgrad",
            "value": 5.405734629254084,
            "unit": "iter/sec",
            "range": "stddev: 0.001384195662837059",
            "extra": "mean: 184.9887330000115 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_metric_hmax_hausd_angle",
            "value": 2.0609284588144328,
            "unit": "iter/sec",
            "range": "stddev: 0.0006799782148329253",
            "extra": "mean: 485.21820139999363 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_optimize",
            "value": 2.083244445632926,
            "unit": "iter/sec",
            "range": "stddev: 0.0027672145969564826",
            "extra": "mean: 480.02048060000106 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_uniform",
            "value": 2.8303012568809343,
            "unit": "iter/sec",
            "range": "stddev: 0.0017897141643423804",
            "extra": "mean: 353.3192791999909 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 163.9958931080953,
            "unit": "iter/sec",
            "range": "stddev: 0.000023139845499625313",
            "extra": "mean: 6.09771367470078 msec\nrounds: 166"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 13.514812996699405,
            "unit": "iter/sec",
            "range": "stddev: 0.0004092925173475891",
            "extra": "mean: 73.99288471429243 msec\nrounds: 14"
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
          "id": "5c08343c01c1f6bd4bd2d9f7f92b6d757f585c87",
          "message": "drop meshio runtime dep; remove tetgen reader shim (#260)",
          "timestamp": "2026-05-13T15:38:57+02:00",
          "tree_id": "c1aede298a326bd2471a45abdf58107d99bab04a",
          "url": "https://github.com/kmarchais/mmgpy/commit/5c08343c01c1f6bd4bd2d9f7f92b6d757f585c87"
        },
        "date": 1778679984726,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_construction_3d",
            "value": 43.410429033371635,
            "unit": "iter/sec",
            "range": "stddev: 0.00007512642416505071",
            "extra": "mean: 23.035939111112054 msec\nrounds: 45"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_io_roundtrip_3d",
            "value": 21.18871187362767,
            "unit": "iter/sec",
            "range": "stddev: 0.00039382918203359783",
            "extra": "mean: 47.19494068181844 msec\nrounds: 22"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_pyvista_roundtrip_3d",
            "value": 35.97059607150839,
            "unit": "iter/sec",
            "range": "stddev: 0.00013763532417843675",
            "extra": "mean: 27.800484540540616 msec\nrounds: 37"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_quality_3d",
            "value": 3356.3523921489204,
            "unit": "iter/sec",
            "range": "stddev: 0.00000881805446924892",
            "extra": "mean: 297.94249326714623 usec\nrounds: 3416"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_validate_3d",
            "value": 73.10677989333628,
            "unit": "iter/sec",
            "range": "stddev: 0.00005826012845600973",
            "extra": "mean: 13.678621893332092 msec\nrounds: 75"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_metric_field_set_get",
            "value": 8575.27291632497,
            "unit": "iter/sec",
            "range": "stddev: 0.000005397904745901624",
            "extra": "mean: 116.61436431909637 usec\nrounds: 16244"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_adaptive_hmin_hmax_hausd",
            "value": 0.11120428941998074,
            "unit": "iter/sec",
            "range": "stddev: 0.1885277308987436",
            "extra": "mean: 8.992458881 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_metric_hgrad",
            "value": 0.09246440369667729,
            "unit": "iter/sec",
            "range": "stddev: 0.1523534149180733",
            "extra": "mean: 10.814972681600011 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_optimize",
            "value": 0.3979764273122562,
            "unit": "iter/sec",
            "range": "stddev: 0.01140356598963859",
            "extra": "mean: 2.5127116365999997 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_adaptive_hmax_hgrad_angle",
            "value": 5.281151486637934,
            "unit": "iter/sec",
            "range": "stddev: 0.00021681797321126915",
            "extra": "mean: 189.35264450000014 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_metric_hmin_hausd",
            "value": 5.246434644994817,
            "unit": "iter/sec",
            "range": "stddev: 0.000975041344379408",
            "extra": "mean: 190.60563366666847 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_uniform_angle",
            "value": 5.254105439773141,
            "unit": "iter/sec",
            "range": "stddev: 0.0012075214058490326",
            "extra": "mean: 190.32735666667122 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_adaptive_hmin_hgrad",
            "value": 5.206791820129101,
            "unit": "iter/sec",
            "range": "stddev: 0.003945670185163029",
            "extra": "mean: 192.0568431666633 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_metric_hmax_hausd_angle",
            "value": 2.0101564279208035,
            "unit": "iter/sec",
            "range": "stddev: 0.0059436676483616245",
            "extra": "mean: 497.47372200000655 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_optimize",
            "value": 1.9423791470127927,
            "unit": "iter/sec",
            "range": "stddev: 0.00658817192397881",
            "extra": "mean: 514.8325451999995 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_uniform",
            "value": 2.8218597403297356,
            "unit": "iter/sec",
            "range": "stddev: 0.0011095470493341186",
            "extra": "mean: 354.37622419998434 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 160.52781001525472,
            "unit": "iter/sec",
            "range": "stddev: 0.0000564118141529505",
            "extra": "mean: 6.229450211181299 msec\nrounds: 161"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 13.5005992781019,
            "unit": "iter/sec",
            "range": "stddev: 0.00010327413993325627",
            "extra": "mean: 74.07078599999701 msec\nrounds: 14"
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
          "id": "642a2c3fbb2a52a703458b557d042b22ac3ff2bc",
          "message": "Merge pull request #261 from kmarchais/release/v0.13.0\n\nRelease v0.13.0",
          "timestamp": "2026-05-13T16:54:14+02:00",
          "tree_id": "3d6247e99e4d2bc6ba0ce2231ca8c2ba7dcdc15a",
          "url": "https://github.com/kmarchais/mmgpy/commit/642a2c3fbb2a52a703458b557d042b22ac3ff2bc"
        },
        "date": 1778684497943,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_construction_3d",
            "value": 43.53652599158558,
            "unit": "iter/sec",
            "range": "stddev: 0.0002316451041165847",
            "extra": "mean: 22.96921900000181 msec\nrounds: 45"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_io_roundtrip_3d",
            "value": 21.20864819957543,
            "unit": "iter/sec",
            "range": "stddev: 0.0001622271009217977",
            "extra": "mean: 47.150577000000354 msec\nrounds: 22"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_pyvista_roundtrip_3d",
            "value": 37.516899812186104,
            "unit": "iter/sec",
            "range": "stddev: 0.00009820332842946037",
            "extra": "mean: 26.654654435897278 msec\nrounds: 39"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_quality_3d",
            "value": 3378.732716603563,
            "unit": "iter/sec",
            "range": "stddev: 0.000010158594371585742",
            "extra": "mean: 295.96895755792127 usec\nrounds: 3440"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_validate_3d",
            "value": 72.58040963880792,
            "unit": "iter/sec",
            "range": "stddev: 0.00011892120119444371",
            "extra": "mean: 13.777822486486924 msec\nrounds: 74"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_metric_field_set_get",
            "value": 8589.448650508195,
            "unit": "iter/sec",
            "range": "stddev: 0.000005214984985232743",
            "extra": "mean: 116.42190793478171 usec\nrounds: 18639"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_adaptive_hmin_hmax_hausd",
            "value": 0.1102195489491699,
            "unit": "iter/sec",
            "range": "stddev: 0.08099943598533992",
            "extra": "mean: 9.072800692199996 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_metric_hgrad",
            "value": 0.09405944284896071,
            "unit": "iter/sec",
            "range": "stddev: 0.02806484695784069",
            "extra": "mean: 10.631574775599995 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_optimize",
            "value": 0.401357885847484,
            "unit": "iter/sec",
            "range": "stddev: 0.00978130963948363",
            "extra": "mean: 2.4915419262 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_adaptive_hmax_hgrad_angle",
            "value": 4.016432310625974,
            "unit": "iter/sec",
            "range": "stddev: 0.007036778808394824",
            "extra": "mean: 248.97718240000586 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_metric_hmin_hausd",
            "value": 4.0731250320192105,
            "unit": "iter/sec",
            "range": "stddev: 0.0007086932180290613",
            "extra": "mean: 245.51173660000813 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_uniform_angle",
            "value": 4.075162652048415,
            "unit": "iter/sec",
            "range": "stddev: 0.0001143173714884132",
            "extra": "mean: 245.38897840000118 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_adaptive_hmin_hgrad",
            "value": 5.406568572619923,
            "unit": "iter/sec",
            "range": "stddev: 0.0007112810090334054",
            "extra": "mean: 184.96019916666265 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_metric_hmax_hausd_angle",
            "value": 2.056127113429839,
            "unit": "iter/sec",
            "range": "stddev: 0.0012017722219962927",
            "extra": "mean: 486.3512539999988 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_optimize",
            "value": 2.0863261429755626,
            "unit": "iter/sec",
            "range": "stddev: 0.0017847687367028222",
            "extra": "mean: 479.31144580002183 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_uniform",
            "value": 2.838520143972031,
            "unit": "iter/sec",
            "range": "stddev: 0.0010506750484008357",
            "extra": "mean: 352.29624920000333 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 163.97933832120265,
            "unit": "iter/sec",
            "range": "stddev: 0.00003447501290199548",
            "extra": "mean: 6.098329278785114 msec\nrounds: 165"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 13.584036388964483,
            "unit": "iter/sec",
            "range": "stddev: 0.00012214824532437454",
            "extra": "mean: 73.61582164285048 msec\nrounds: 14"
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
          "id": "e270a58a0e7f853d7fed5188a9b8493dfc4919fa",
          "message": "fix(ci): allow PyPI for transitive deps in validate-release (#262)",
          "timestamp": "2026-05-13T18:19:01+02:00",
          "tree_id": "9899da24a053b973514a9301a45cd9399ae03590",
          "url": "https://github.com/kmarchais/mmgpy/commit/e270a58a0e7f853d7fed5188a9b8493dfc4919fa"
        },
        "date": 1778689591379,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_construction_3d",
            "value": 16.107057295878754,
            "unit": "iter/sec",
            "range": "stddev: 0.0007124456142984102",
            "extra": "mean: 62.08458700000191 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_io_roundtrip_3d",
            "value": 11.905615238644039,
            "unit": "iter/sec",
            "range": "stddev: 0.0007867785553700965",
            "extra": "mean: 83.99397930769116 msec\nrounds: 13"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_pyvista_roundtrip_3d",
            "value": 15.351819204680497,
            "unit": "iter/sec",
            "range": "stddev: 0.0004649999870805831",
            "extra": "mean: 65.1388598749989 msec\nrounds: 16"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_quality_3d",
            "value": 3805.535183315134,
            "unit": "iter/sec",
            "range": "stddev: 0.000006212117080609995",
            "extra": "mean: 262.77512933906587 usec\nrounds: 3889"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_validate_3d",
            "value": 84.28471857376846,
            "unit": "iter/sec",
            "range": "stddev: 0.00012507298076051233",
            "extra": "mean: 11.864546941860766 msec\nrounds: 86"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_metric_field_set_get",
            "value": 3601.4212869315193,
            "unit": "iter/sec",
            "range": "stddev: 0.000004621805573098815",
            "extra": "mean: 277.66815385600705 usec\nrounds: 23535"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_adaptive_hmin_hmax_hausd",
            "value": 0.1202842387471559,
            "unit": "iter/sec",
            "range": "stddev: 0.032091819569873885",
            "extra": "mean: 8.313641175400004 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_metric_hgrad",
            "value": 0.10794631418830863,
            "unit": "iter/sec",
            "range": "stddev: 0.018539605951193767",
            "extra": "mean: 9.263864241399983 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_optimize",
            "value": 0.21990049343200374,
            "unit": "iter/sec",
            "range": "stddev: 0.0028307163837153434",
            "extra": "mean: 4.547511396599998 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_adaptive_hmax_hgrad_angle",
            "value": 5.604842396255137,
            "unit": "iter/sec",
            "range": "stddev: 0.0005505275904373597",
            "extra": "mean: 178.41714883332807 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_metric_hmin_hausd",
            "value": 5.600786370569183,
            "unit": "iter/sec",
            "range": "stddev: 0.0001288768628752818",
            "extra": "mean: 178.54635650000242 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_uniform_angle",
            "value": 5.6084792691182725,
            "unit": "iter/sec",
            "range": "stddev: 0.00013389045238561685",
            "extra": "mean: 178.30145250001314 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_adaptive_hmin_hgrad",
            "value": 4.855188978170944,
            "unit": "iter/sec",
            "range": "stddev: 0.0011920006978884872",
            "extra": "mean: 205.96520640000335 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_metric_hmax_hausd_angle",
            "value": 2.2397219662903725,
            "unit": "iter/sec",
            "range": "stddev: 0.0013556197997493427",
            "extra": "mean: 446.4839900000129 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_optimize",
            "value": 2.331612907050234,
            "unit": "iter/sec",
            "range": "stddev: 0.001070797987508489",
            "extra": "mean: 428.8876584000036 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_uniform",
            "value": 3.003356181455387,
            "unit": "iter/sec",
            "range": "stddev: 0.0014753490426871855",
            "extra": "mean: 332.9608410000219 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 185.3301328768697,
            "unit": "iter/sec",
            "range": "stddev: 0.000029469551204622112",
            "extra": "mean: 5.395776631015441 msec\nrounds: 187"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 15.399741410430932,
            "unit": "iter/sec",
            "range": "stddev: 0.0001134194918787366",
            "extra": "mean: 64.93615531249475 msec\nrounds: 16"
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
          "id": "56f445e915777a80efbf7cacd8893471c86c24d5",
          "message": "chore: replace pre-commit with prek (#263)\n\n* chore: replace pre-commit with prek\n\n* ci: add setup-uv for ty hook and bump action versions\n\n* chore: bump pre-commit hook versions and fix surfaced lint issues\n\n* fix(validation): simplify errors-or-warnings expression",
          "timestamp": "2026-05-14T14:36:57Z",
          "tree_id": "f86f93298afdaf452595f3e4cecaa6e925091607",
          "url": "https://github.com/kmarchais/mmgpy/commit/56f445e915777a80efbf7cacd8893471c86c24d5"
        },
        "date": 1778769844915,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_construction_3d",
            "value": 43.61357846504548,
            "unit": "iter/sec",
            "range": "stddev: 0.00026624878909257564",
            "extra": "mean: 22.928639088889707 msec\nrounds: 45"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_io_roundtrip_3d",
            "value": 20.65259978953478,
            "unit": "iter/sec",
            "range": "stddev: 0.00017071078543222593",
            "extra": "mean: 48.4200541428555 msec\nrounds: 21"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_pyvista_roundtrip_3d",
            "value": 37.639660548980224,
            "unit": "iter/sec",
            "range": "stddev: 0.0002428794490227253",
            "extra": "mean: 26.56772099999964 msec\nrounds: 38"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_quality_3d",
            "value": 3400.331670397044,
            "unit": "iter/sec",
            "range": "stddev: 0.000007641408011614988",
            "extra": "mean: 294.08895864656455 usec\nrounds: 3458"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_validate_3d",
            "value": 72.65886672053685,
            "unit": "iter/sec",
            "range": "stddev: 0.00013944482647945601",
            "extra": "mean: 13.762945186665737 msec\nrounds: 75"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_metric_field_set_get",
            "value": 8745.136135939476,
            "unit": "iter/sec",
            "range": "stddev: 0.000005226447617220053",
            "extra": "mean: 114.34927763906921 usec\nrounds: 17620"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_adaptive_hmin_hmax_hausd",
            "value": 0.11882172519299797,
            "unit": "iter/sec",
            "range": "stddev: 0.005217078433723104",
            "extra": "mean: 8.415969372399996 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_metric_hgrad",
            "value": 0.09773810302120621,
            "unit": "iter/sec",
            "range": "stddev: 0.01370693614378491",
            "extra": "mean: 10.23142427659999 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_optimize",
            "value": 0.4025834679057672,
            "unit": "iter/sec",
            "range": "stddev: 0.004768110763138766",
            "extra": "mean: 2.4839569424000048 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_adaptive_hmax_hgrad_angle",
            "value": 5.259532711066061,
            "unit": "iter/sec",
            "range": "stddev: 0.0006493829471935708",
            "extra": "mean: 190.13095933332616 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_metric_hmin_hausd",
            "value": 5.264835382127886,
            "unit": "iter/sec",
            "range": "stddev: 0.00011130434274243707",
            "extra": "mean: 189.93946200001233 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_uniform_angle",
            "value": 5.262087673805174,
            "unit": "iter/sec",
            "range": "stddev: 0.00016470152361787042",
            "extra": "mean: 190.03864283334337 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_adaptive_hmin_hgrad",
            "value": 5.446457984328354,
            "unit": "iter/sec",
            "range": "stddev: 0.0008072203273679904",
            "extra": "mean: 183.605565833318 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_metric_hmax_hausd_angle",
            "value": 2.035198113128448,
            "unit": "iter/sec",
            "range": "stddev: 0.0006491098084977585",
            "extra": "mean: 491.3526567999952 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_optimize",
            "value": 2.03904862534142,
            "unit": "iter/sec",
            "range": "stddev: 0.0006890873729415325",
            "extra": "mean: 490.4247929999997 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_uniform",
            "value": 2.8156852687735747,
            "unit": "iter/sec",
            "range": "stddev: 0.00112447381003538",
            "extra": "mean: 355.1533301999939 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 163.37918713461818,
            "unit": "iter/sec",
            "range": "stddev: 0.00002744321814747514",
            "extra": "mean: 6.120730660607574 msec\nrounds: 165"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 13.573101143827083,
            "unit": "iter/sec",
            "range": "stddev: 0.00007949942435030847",
            "extra": "mean: 73.67513064284432 msec\nrounds: 14"
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
          "id": "b2d6c036bca419759d103860f8153e64a75d1a89",
          "message": "docs: switch README and lagging docs to pv.read + .mmg accessor (#264)\n\n* docs: switch README and lagging docs to pv.read + .mmg accessor\n\n* ci: add manual redeploy-docs workflow for versioned doc slots\n\n* ci: clarify redeploy-docs intent for backport-branch workflow\n\n* docs: drop unsupported default_size kwarg in sizing examples",
          "timestamp": "2026-05-14T18:34:30+02:00",
          "tree_id": "040de09979a615124e56719613227f77a97bc30b",
          "url": "https://github.com/kmarchais/mmgpy/commit/b2d6c036bca419759d103860f8153e64a75d1a89"
        },
        "date": 1778776905517,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_construction_3d",
            "value": 34.75790893319948,
            "unit": "iter/sec",
            "range": "stddev: 0.00014243853938992237",
            "extra": "mean: 28.770430405404415 msec\nrounds: 37"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_io_roundtrip_3d",
            "value": 18.286708519483415,
            "unit": "iter/sec",
            "range": "stddev: 0.0002644382457250427",
            "extra": "mean: 54.68452668420666 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_pyvista_roundtrip_3d",
            "value": 30.73202053027917,
            "unit": "iter/sec",
            "range": "stddev: 0.0002060230587518223",
            "extra": "mean: 32.53935090322927 msec\nrounds: 31"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_quality_3d",
            "value": 3386.7872230442676,
            "unit": "iter/sec",
            "range": "stddev: 0.000007751633857192996",
            "extra": "mean: 295.2650798951385 usec\nrounds: 3442"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_validate_3d",
            "value": 75.29801438225074,
            "unit": "iter/sec",
            "range": "stddev: 0.00012470385826479153",
            "extra": "mean: 13.280562684209642 msec\nrounds: 76"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_metric_field_set_get",
            "value": 7175.919013410648,
            "unit": "iter/sec",
            "range": "stddev: 0.0000067038421455513795",
            "extra": "mean: 139.35497294927097 usec\nrounds: 19408"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_adaptive_hmin_hmax_hausd",
            "value": 0.12250267447410158,
            "unit": "iter/sec",
            "range": "stddev: 0.31943166733470657",
            "extra": "mean: 8.163087085999996 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_metric_hgrad",
            "value": 0.10077508455716422,
            "unit": "iter/sec",
            "range": "stddev: 0.25222972132870247",
            "extra": "mean: 9.923087679800005 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_optimize",
            "value": 0.3420884771175853,
            "unit": "iter/sec",
            "range": "stddev: 0.012369192450736765",
            "extra": "mean: 2.923220356399997 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_adaptive_hmax_hgrad_angle",
            "value": 5.334323971823507,
            "unit": "iter/sec",
            "range": "stddev: 0.0009272934492860124",
            "extra": "mean: 187.4651793333347 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_metric_hmin_hausd",
            "value": 5.341857385019699,
            "unit": "iter/sec",
            "range": "stddev: 0.00040818093608296164",
            "extra": "mean: 187.20080450000864 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_uniform_angle",
            "value": 5.3406371031856485,
            "unit": "iter/sec",
            "range": "stddev: 0.00016003938037041158",
            "extra": "mean: 187.24357799999325 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_adaptive_hmin_hgrad",
            "value": 5.166182699819271,
            "unit": "iter/sec",
            "range": "stddev: 0.001812785964276749",
            "extra": "mean: 193.56651866667107 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_metric_hmax_hausd_angle",
            "value": 2.095542774943476,
            "unit": "iter/sec",
            "range": "stddev: 0.0023521664730925002",
            "extra": "mean: 477.2033346000171 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_optimize",
            "value": 2.1166694905083845,
            "unit": "iter/sec",
            "range": "stddev: 0.0016678842857665603",
            "extra": "mean: 472.4403145999986 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_uniform",
            "value": 2.852465718004293,
            "unit": "iter/sec",
            "range": "stddev: 0.001680990070867407",
            "extra": "mean: 350.57388900002024 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 171.41028136051483,
            "unit": "iter/sec",
            "range": "stddev: 0.00008271476172333075",
            "extra": "mean: 5.833955770113768 msec\nrounds: 174"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.24416334225752,
            "unit": "iter/sec",
            "range": "stddev: 0.00011681714900701212",
            "extra": "mean: 70.20419353331513 msec\nrounds: 15"
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
          "id": "501e0b954248a0d58647421ffc37aa944700c6e6",
          "message": "fix(docs): pin pygments<2.20 to keep zensical builds rendering (#265)",
          "timestamp": "2026-05-14T19:40:16+02:00",
          "tree_id": "96226fc7a2e2a8d296311406419ff78957b598a0",
          "url": "https://github.com/kmarchais/mmgpy/commit/501e0b954248a0d58647421ffc37aa944700c6e6"
        },
        "date": 1778780858673,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_construction_3d",
            "value": 35.01293072270346,
            "unit": "iter/sec",
            "range": "stddev: 0.000325505405228626",
            "extra": "mean: 28.560876777777683 msec\nrounds: 36"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_io_roundtrip_3d",
            "value": 18.14549336979719,
            "unit": "iter/sec",
            "range": "stddev: 0.000561653614754494",
            "extra": "mean: 55.110102526309916 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_pyvista_roundtrip_3d",
            "value": 28.96330310349809,
            "unit": "iter/sec",
            "range": "stddev: 0.0024212856310130066",
            "extra": "mean: 34.52644874193315 msec\nrounds: 31"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_quality_3d",
            "value": 3388.621427216333,
            "unit": "iter/sec",
            "range": "stddev: 0.000007243259744988588",
            "extra": "mean: 295.10525783975663 usec\nrounds: 3444"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_validate_3d",
            "value": 73.1633359412506,
            "unit": "iter/sec",
            "range": "stddev: 0.0001616438884941678",
            "extra": "mean: 13.668048171053732 msec\nrounds: 76"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_metric_field_set_get",
            "value": 9206.914399602634,
            "unit": "iter/sec",
            "range": "stddev: 0.000005288665734514765",
            "extra": "mean: 108.61402165780531 usec\nrounds: 17130"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_adaptive_hmin_hmax_hausd",
            "value": 0.117679187575939,
            "unit": "iter/sec",
            "range": "stddev: 0.39136331832429905",
            "extra": "mean: 8.497679331399997 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_metric_hgrad",
            "value": 0.09482760952974724,
            "unit": "iter/sec",
            "range": "stddev: 0.21487395983445823",
            "extra": "mean: 10.545451951799986 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_optimize",
            "value": 0.3888625692357333,
            "unit": "iter/sec",
            "range": "stddev: 0.09385040694090224",
            "extra": "mean: 2.5716026151999927 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_adaptive_hmax_hgrad_angle",
            "value": 5.07269994457075,
            "unit": "iter/sec",
            "range": "stddev: 0.0021414280625816676",
            "extra": "mean: 197.13367850000432 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_metric_hmin_hausd",
            "value": 5.076171901881495,
            "unit": "iter/sec",
            "range": "stddev: 0.0013401007170533647",
            "extra": "mean: 196.9988446666567 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_uniform_angle",
            "value": 5.074808895532097,
            "unit": "iter/sec",
            "range": "stddev: 0.0012322080713329303",
            "extra": "mean: 197.0517551666641 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_adaptive_hmin_hgrad",
            "value": 4.935045284355914,
            "unit": "iter/sec",
            "range": "stddev: 0.0016527787776910907",
            "extra": "mean: 202.63238579998415 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_metric_hmax_hausd_angle",
            "value": 2.063562397887276,
            "unit": "iter/sec",
            "range": "stddev: 0.006569982002525521",
            "extra": "mean: 484.59886700001107 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_optimize",
            "value": 2.013696933760046,
            "unit": "iter/sec",
            "range": "stddev: 0.003519786301401576",
            "extra": "mean: 496.599057800006 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_uniform",
            "value": 2.7584623211968307,
            "unit": "iter/sec",
            "range": "stddev: 0.004292913382134294",
            "extra": "mean: 362.5208118000046 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 171.7336136640345,
            "unit": "iter/sec",
            "range": "stddev: 0.000029641695303708438",
            "extra": "mean: 5.822971861270664 msec\nrounds: 173"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.051550970010227,
            "unit": "iter/sec",
            "range": "stddev: 0.00021901569607261882",
            "extra": "mean: 71.16652119999192 msec\nrounds: 15"
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
          "id": "32df0793a7f298840ae3f31e8550e1b9d20d392b",
          "message": "docs: add Returns/Raises sections and fix section order (#266)\n\n* docs: add Returns/Raises sections and fix section order\n\n* ci(prek): keep ruff-check on stable rules to match preview-disabled CI\n\n* ci(ruff): scope preview rules to src/mmgpy/ via per-file-ignores\n\n* docs: convert remaining Google-style docstrings and drop CancellationError.for_phase",
          "timestamp": "2026-05-14T21:30:50Z",
          "tree_id": "3f4680f44a10a075438ad6bc1bbd228e6c9c79ba",
          "url": "https://github.com/kmarchais/mmgpy/commit/32df0793a7f298840ae3f31e8550e1b9d20d392b"
        },
        "date": 1778794692904,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_construction_3d",
            "value": 39.934181926581466,
            "unit": "iter/sec",
            "range": "stddev: 0.003338349742704112",
            "extra": "mean: 25.041204095240726 msec\nrounds: 42"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_io_roundtrip_3d",
            "value": 21.504070229321822,
            "unit": "iter/sec",
            "range": "stddev: 0.0006373937469787157",
            "extra": "mean: 46.50282431818198 msec\nrounds: 22"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_pyvista_roundtrip_3d",
            "value": 37.25539398765947,
            "unit": "iter/sec",
            "range": "stddev: 0.00029537764033502626",
            "extra": "mean: 26.841750763157723 msec\nrounds: 38"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_quality_3d",
            "value": 3377.2389064854065,
            "unit": "iter/sec",
            "range": "stddev: 0.000007287161952586554",
            "extra": "mean: 296.09986965377897 usec\nrounds: 3437"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_validate_3d",
            "value": 71.92979139764591,
            "unit": "iter/sec",
            "range": "stddev: 0.0009594062071562981",
            "extra": "mean: 13.902445434211666 msec\nrounds: 76"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_metric_field_set_get",
            "value": 8449.26408460821,
            "unit": "iter/sec",
            "range": "stddev: 0.000015158123852698718",
            "extra": "mean: 118.35350274134196 usec\nrounds: 15503"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_adaptive_hmin_hmax_hausd",
            "value": 0.11297873017006108,
            "unit": "iter/sec",
            "range": "stddev: 0.021070812803089718",
            "extra": "mean: 8.851223575400002 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_metric_hgrad",
            "value": 0.09209190074838959,
            "unit": "iter/sec",
            "range": "stddev: 0.06671527560662775",
            "extra": "mean: 10.8587182138 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_optimize",
            "value": 0.39745888032138005,
            "unit": "iter/sec",
            "range": "stddev: 0.013762471986062997",
            "extra": "mean: 2.5159835382000098 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_adaptive_hmax_hgrad_angle",
            "value": 5.263941293873699,
            "unit": "iter/sec",
            "range": "stddev: 0.0002638320083337458",
            "extra": "mean: 189.97172349999877 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_metric_hmin_hausd",
            "value": 5.238331516364393,
            "unit": "iter/sec",
            "range": "stddev: 0.00035860937849547234",
            "extra": "mean: 190.9004798333266 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_uniform_angle",
            "value": 5.18624965652419,
            "unit": "iter/sec",
            "range": "stddev: 0.0007038538176778952",
            "extra": "mean: 192.81755916667484 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_adaptive_hmin_hgrad",
            "value": 5.319556325525105,
            "unit": "iter/sec",
            "range": "stddev: 0.0006158792695977027",
            "extra": "mean: 187.98560233334646 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_metric_hmax_hausd_angle",
            "value": 2.0297878264814933,
            "unit": "iter/sec",
            "range": "stddev: 0.0035392010594150454",
            "extra": "mean: 492.662329999996 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_optimize",
            "value": 2.0064994353137378,
            "unit": "iter/sec",
            "range": "stddev: 0.0059188031032089295",
            "extra": "mean: 498.38040439998395 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_uniform",
            "value": 2.8071813051640273,
            "unit": "iter/sec",
            "range": "stddev: 0.0030782120052972825",
            "extra": "mean: 356.22921760002555 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 160.85090652067035,
            "unit": "iter/sec",
            "range": "stddev: 0.0004606064848832478",
            "extra": "mean: 6.216937296971302 msec\nrounds: 165"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 13.451854458580383,
            "unit": "iter/sec",
            "range": "stddev: 0.0006040691775218688",
            "extra": "mean: 74.3391926428509 msec\nrounds: 14"
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
          "id": "e9678c7ee8b72dbf96f1a5ca2c97e4213854efb9",
          "message": "chore: enforce ruff CPY/FURB/ISC/PLC/RUF preview rules for src/mmgpy (#267)\n\n* chore: enforce ruff CPY/FURB/ISC/PLC/RUF preview rules for src/mmgpy\n\n* fix(ui): preserve numeric zero in to_float by narrowing val type",
          "timestamp": "2026-05-15T07:33:32Z",
          "tree_id": "96a9c80d5ab8b934d00072a78224a3b73cbb10e2",
          "url": "https://github.com/kmarchais/mmgpy/commit/e9678c7ee8b72dbf96f1a5ca2c97e4213854efb9"
        },
        "date": 1778830841814,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_construction_3d",
            "value": 32.895529345564675,
            "unit": "iter/sec",
            "range": "stddev: 0.0003847125625611373",
            "extra": "mean: 30.399267617647585 msec\nrounds: 34"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_io_roundtrip_3d",
            "value": 17.43400504369134,
            "unit": "iter/sec",
            "range": "stddev: 0.00043983545252675925",
            "extra": "mean: 57.359166611108655 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_pyvista_roundtrip_3d",
            "value": 29.006867988041936,
            "unit": "iter/sec",
            "range": "stddev: 0.0008797287478281295",
            "extra": "mean: 34.47459409999899 msec\nrounds: 30"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_quality_3d",
            "value": 3388.5860613961613,
            "unit": "iter/sec",
            "range": "stddev: 0.000007295738202291983",
            "extra": "mean: 295.1083377790857 usec\nrounds: 3449"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_validate_3d",
            "value": 72.81046178039976,
            "unit": "iter/sec",
            "range": "stddev: 0.0002444110546752227",
            "extra": "mean: 13.734290039473356 msec\nrounds: 76"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_metric_field_set_get",
            "value": 6968.853309333285,
            "unit": "iter/sec",
            "range": "stddev: 0.00001952265277681507",
            "extra": "mean: 143.49563057393019 usec\nrounds: 18591"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_adaptive_hmin_hmax_hausd",
            "value": 0.11814279031936412,
            "unit": "iter/sec",
            "range": "stddev: 0.13065606008005373",
            "extra": "mean: 8.464333687200002 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_metric_hgrad",
            "value": 0.10518565766242312,
            "unit": "iter/sec",
            "range": "stddev: 0.15326766779869105",
            "extra": "mean: 9.506999549400007 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_optimize",
            "value": 0.4131631458266703,
            "unit": "iter/sec",
            "range": "stddev: 0.01906471159672257",
            "extra": "mean: 2.4203514037999865 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_adaptive_hmax_hgrad_angle",
            "value": 5.191148563240574,
            "unit": "iter/sec",
            "range": "stddev: 0.007963231253617323",
            "extra": "mean: 192.63559650000653 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_metric_hmin_hausd",
            "value": 5.2754108694410595,
            "unit": "iter/sec",
            "range": "stddev: 0.00143571053807122",
            "extra": "mean: 189.55869499998812 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_uniform_angle",
            "value": 5.243568419879484,
            "unit": "iter/sec",
            "range": "stddev: 0.0013353259120567895",
            "extra": "mean: 190.70982199999284 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_adaptive_hmin_hgrad",
            "value": 5.031589830432215,
            "unit": "iter/sec",
            "range": "stddev: 0.0019274428702533077",
            "extra": "mean: 198.74434000000747 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_metric_hmax_hausd_angle",
            "value": 2.0447936814277963,
            "unit": "iter/sec",
            "range": "stddev: 0.0029906164765106965",
            "extra": "mean: 489.0468946000169 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_optimize",
            "value": 1.9603826005794671,
            "unit": "iter/sec",
            "range": "stddev: 0.0035619085805949284",
            "extra": "mean: 510.10450700001684 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_uniform",
            "value": 2.799456441860341,
            "unit": "iter/sec",
            "range": "stddev: 0.003968512403304683",
            "extra": "mean: 357.2122019999938 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 171.57975101304797,
            "unit": "iter/sec",
            "range": "stddev: 0.00003939418789787845",
            "extra": "mean: 5.828193560695597 msec\nrounds: 173"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 13.998883195230896,
            "unit": "iter/sec",
            "range": "stddev: 0.00038399722485540954",
            "extra": "mean: 71.43426986666175 msec\nrounds: 15"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Kevin Marchais",
            "username": "kmarchais",
            "email": "kevinmarchais@gmail.com"
          },
          "committer": {
            "name": "Kevin Marchais",
            "username": "kmarchais",
            "email": "kevinmarchais@gmail.com"
          },
          "id": "ceb30b487ba7b6df44d9f352dc1e70c472cc9464",
          "message": "chore: enforce ruff PLR6104/PLR6201/PLR1702 preview rules for src/mmgpy",
          "timestamp": "2026-05-15T07:53:11Z",
          "url": "https://github.com/kmarchais/mmgpy/commit/ceb30b487ba7b6df44d9f352dc1e70c472cc9464"
        },
        "date": 1778837861492,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_construction_3d",
            "value": 41.52205837334509,
            "unit": "iter/sec",
            "range": "stddev: 0.00016966530018644175",
            "extra": "mean: 24.0835844651176 msec\nrounds: 43"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_io_roundtrip_3d",
            "value": 21.219477958365523,
            "unit": "iter/sec",
            "range": "stddev: 0.0001729057271080202",
            "extra": "mean: 47.12651281817996 msec\nrounds: 22"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_pyvista_roundtrip_3d",
            "value": 37.19546932598237,
            "unit": "iter/sec",
            "range": "stddev: 0.00014516718375183759",
            "extra": "mean: 26.884994815792364 msec\nrounds: 38"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_quality_3d",
            "value": 3375.97020651789,
            "unit": "iter/sec",
            "range": "stddev: 0.000007654755719314909",
            "extra": "mean: 296.2111448937933 usec\nrounds: 3437"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_validate_3d",
            "value": 73.48012626387562,
            "unit": "iter/sec",
            "range": "stddev: 0.00006224323827826007",
            "extra": "mean: 13.609121960526911 msec\nrounds: 76"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_metric_field_set_get",
            "value": 8573.731229193427,
            "unit": "iter/sec",
            "range": "stddev: 0.000005987327915217754",
            "extra": "mean: 116.63533335346634 usec\nrounds: 16670"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_adaptive_hmin_hmax_hausd",
            "value": 0.11226093591893156,
            "unit": "iter/sec",
            "range": "stddev: 0.023911492561630412",
            "extra": "mean: 8.907818127599995 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_metric_hgrad",
            "value": 0.09289430567838253,
            "unit": "iter/sec",
            "range": "stddev: 0.01765130821484055",
            "extra": "mean: 10.764922485800014 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_optimize",
            "value": 0.3991869985139467,
            "unit": "iter/sec",
            "range": "stddev: 0.002156119031265704",
            "extra": "mean: 2.505091608000009 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_adaptive_hmax_hgrad_angle",
            "value": 5.2485259022955795,
            "unit": "iter/sec",
            "range": "stddev: 0.0007154395520466865",
            "extra": "mean: 190.52968749999386 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_metric_hmin_hausd",
            "value": 5.238577574304886,
            "unit": "iter/sec",
            "range": "stddev: 0.0004988431791220699",
            "extra": "mean: 190.89151316666175 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_uniform_angle",
            "value": 5.23423846550291,
            "unit": "iter/sec",
            "range": "stddev: 0.001057933303121444",
            "extra": "mean: 191.0497595000038 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_adaptive_hmin_hgrad",
            "value": 5.311415952452827,
            "unit": "iter/sec",
            "range": "stddev: 0.002729848258283865",
            "extra": "mean: 188.27371249999678 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_metric_hmax_hausd_angle",
            "value": 2.0432063525671533,
            "unit": "iter/sec",
            "range": "stddev: 0.0017223983064143782",
            "extra": "mean: 489.42682600001035 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_optimize",
            "value": 2.046185287887387,
            "unit": "iter/sec",
            "range": "stddev: 0.0018872878658886588",
            "extra": "mean: 488.7142947999905 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_uniform",
            "value": 2.818938756336378,
            "unit": "iter/sec",
            "range": "stddev: 0.0019294530288042544",
            "extra": "mean: 354.74342880000904 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 163.7643155384605,
            "unit": "iter/sec",
            "range": "stddev: 0.000028134602827744932",
            "extra": "mean: 6.106336393932823 msec\nrounds: 165"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 13.513361018628784,
            "unit": "iter/sec",
            "range": "stddev: 0.0001799377702326298",
            "extra": "mean: 74.00083507141224 msec\nrounds: 14"
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
          "id": "bc75a39ff7666b949400f5897f0f1d22f19899cb",
          "message": "chore: enforce ruff PLR6104/PLR6201/PLR1702 preview rules for src/mmgpy (#268)",
          "timestamp": "2026-05-15T10:23:05Z",
          "tree_id": "bc27591e6756099e15defb9847b86168a634b6ba",
          "url": "https://github.com/kmarchais/mmgpy/commit/bc75a39ff7666b949400f5897f0f1d22f19899cb"
        },
        "date": 1778840992252,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_construction_3d",
            "value": 37.23193701002248,
            "unit": "iter/sec",
            "range": "stddev: 0.0002696466075699531",
            "extra": "mean: 26.858661684209704 msec\nrounds: 38"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_io_roundtrip_3d",
            "value": 18.77757743677832,
            "unit": "iter/sec",
            "range": "stddev: 0.00045903889880757464",
            "extra": "mean: 53.25500605000144 msec\nrounds: 20"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_pyvista_roundtrip_3d",
            "value": 32.11153734717035,
            "unit": "iter/sec",
            "range": "stddev: 0.00035113420522430827",
            "extra": "mean: 31.14145514705852 msec\nrounds: 34"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_quality_3d",
            "value": 3388.6704762272207,
            "unit": "iter/sec",
            "range": "stddev: 0.000008475465582255714",
            "extra": "mean: 295.1009863648208 usec\nrounds: 3447"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_validate_3d",
            "value": 74.38567996498729,
            "unit": "iter/sec",
            "range": "stddev: 0.00008521395865476181",
            "extra": "mean: 13.443447723684068 msec\nrounds: 76"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_metric_field_set_get",
            "value": 9247.910897773263,
            "unit": "iter/sec",
            "range": "stddev: 0.000005490385900817702",
            "extra": "mean: 108.13252971985085 usec\nrounds: 19852"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_adaptive_hmin_hmax_hausd",
            "value": 0.13060521292053284,
            "unit": "iter/sec",
            "range": "stddev: 0.06005016701239503",
            "extra": "mean: 7.656662223800003 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_metric_hgrad",
            "value": 0.1066546856810941,
            "unit": "iter/sec",
            "range": "stddev: 0.03598263878342251",
            "extra": "mean: 9.3760531346 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_optimize",
            "value": 0.4141184672916763,
            "unit": "iter/sec",
            "range": "stddev: 0.0012841449730698264",
            "extra": "mean: 2.4147679444000003 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_adaptive_hmax_hgrad_angle",
            "value": 5.343032913806503,
            "unit": "iter/sec",
            "range": "stddev: 0.0008250050808212709",
            "extra": "mean: 187.1596181666746 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_metric_hmin_hausd",
            "value": 5.351408984868996,
            "unit": "iter/sec",
            "range": "stddev: 0.00017989134929948783",
            "extra": "mean: 186.86667433333545 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_uniform_angle",
            "value": 5.337059606677806,
            "unit": "iter/sec",
            "range": "stddev: 0.0008785906645748541",
            "extra": "mean: 187.36908966667443 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_adaptive_hmin_hgrad",
            "value": 5.213127831614062,
            "unit": "iter/sec",
            "range": "stddev: 0.0011600382186780717",
            "extra": "mean: 191.82341816666812 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_metric_hmax_hausd_angle",
            "value": 2.1125085962939263,
            "unit": "iter/sec",
            "range": "stddev: 0.0008793961472535874",
            "extra": "mean: 473.37085479999814 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_optimize",
            "value": 2.1190589256598766,
            "unit": "iter/sec",
            "range": "stddev: 0.0012145169712990062",
            "extra": "mean: 471.90759439999965 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_uniform",
            "value": 2.8680092591224904,
            "unit": "iter/sec",
            "range": "stddev: 0.0015872842820513898",
            "extra": "mean: 348.673909199988 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 171.8643888641227,
            "unit": "iter/sec",
            "range": "stddev: 0.000022524599449992787",
            "extra": "mean: 5.8185410404630575 msec\nrounds: 173"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.304088500425193,
            "unit": "iter/sec",
            "range": "stddev: 0.0001674901698423444",
            "extra": "mean: 69.91008200000124 msec\nrounds: 15"
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
          "id": "b720c4c67952a48d2cbb9c2f9fb874dc81b977db",
          "message": "chore: scope PLR ignores per-file and fix PLR6301 in src/mmgpy (#269)",
          "timestamp": "2026-05-15T11:27:19Z",
          "tree_id": "1848b491ccb555efc81c0d25a8535f80f20aea8f",
          "url": "https://github.com/kmarchais/mmgpy/commit/b720c4c67952a48d2cbb9c2f9fb874dc81b977db"
        },
        "date": 1778844864493,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_construction_3d",
            "value": 34.05523129369626,
            "unit": "iter/sec",
            "range": "stddev: 0.00038913950208950706",
            "extra": "mean: 29.36406425714405 msec\nrounds: 35"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_io_roundtrip_3d",
            "value": 17.588841568553732,
            "unit": "iter/sec",
            "range": "stddev: 0.00037482913829018353",
            "extra": "mean: 56.85422749999939 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_pyvista_roundtrip_3d",
            "value": 29.562926258714548,
            "unit": "iter/sec",
            "range": "stddev: 0.000346051849433811",
            "extra": "mean: 33.82615074193545 msec\nrounds: 31"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_quality_3d",
            "value": 3345.8514718661654,
            "unit": "iter/sec",
            "range": "stddev: 0.00003320552911728381",
            "extra": "mean: 298.8775827046037 usec\nrounds: 3446"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_validate_3d",
            "value": 72.85872674286603,
            "unit": "iter/sec",
            "range": "stddev: 0.0003827056397126746",
            "extra": "mean: 13.725191815789112 msec\nrounds: 76"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_metric_field_set_get",
            "value": 7019.1466077858795,
            "unit": "iter/sec",
            "range": "stddev: 0.000013008329384523025",
            "extra": "mean: 142.46746162713933 usec\nrounds: 17317"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_adaptive_hmin_hmax_hausd",
            "value": 0.1255547471334822,
            "unit": "iter/sec",
            "range": "stddev: 0.07424885341606641",
            "extra": "mean: 7.964653052400007 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_metric_hgrad",
            "value": 0.10313262004683833,
            "unit": "iter/sec",
            "range": "stddev: 0.03255408385138531",
            "extra": "mean: 9.696253227599993 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_optimize",
            "value": 0.3436088935674734,
            "unit": "iter/sec",
            "range": "stddev: 0.005915425875450786",
            "extra": "mean: 2.9102855563999923 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_adaptive_hmax_hgrad_angle",
            "value": 5.347498972190623,
            "unit": "iter/sec",
            "range": "stddev: 0.00032225345635591155",
            "extra": "mean: 187.00330850000077 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_metric_hmin_hausd",
            "value": 5.321852526894954,
            "unit": "iter/sec",
            "range": "stddev: 0.0019541889132533834",
            "extra": "mean: 187.90449283333524 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_uniform_angle",
            "value": 5.320160492998,
            "unit": "iter/sec",
            "range": "stddev: 0.0018635407028535186",
            "extra": "mean: 187.96425433332806 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_adaptive_hmin_hgrad",
            "value": 5.213942585097019,
            "unit": "iter/sec",
            "range": "stddev: 0.002058168681800297",
            "extra": "mean: 191.7934429999851 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_metric_hmax_hausd_angle",
            "value": 2.1082762077166226,
            "unit": "iter/sec",
            "range": "stddev: 0.0014939600482148862",
            "extra": "mean: 474.3211522000024 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_optimize",
            "value": 2.1009360690821874,
            "unit": "iter/sec",
            "range": "stddev: 0.004446284254911443",
            "extra": "mean: 475.9783102000142 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_uniform",
            "value": 2.877649329941685,
            "unit": "iter/sec",
            "range": "stddev: 0.0013692790985126565",
            "extra": "mean: 347.50585819998605 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 172.03410830575856,
            "unit": "iter/sec",
            "range": "stddev: 0.000027866565492129005",
            "extra": "mean: 5.812800786124844 msec\nrounds: 173"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.278791533213322,
            "unit": "iter/sec",
            "range": "stddev: 0.0001566251537758629",
            "extra": "mean: 70.03393793332862 msec\nrounds: 15"
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
          "id": "c5a1a6e349c590d5ae959c983b3b7ad9ef821d95",
          "message": "feat(blender): add Blender extension for mesh remeshing (#270)\n\n* feat(blender): add Blender extension for mesh remeshing\n\nCreate a Blender 4.2+ extension that integrates mmgpy functionality\ndirectly into Blender's UI, allowing users to remesh models without\nleaving Blender.\n\nFeatures:\n- Remesh selected mesh objects with customizable parameters\n- Presets (Fine, Medium, Coarse) for quick remeshing\n- Size control (hmin, hmax, hsiz, hausd)\n- Local refinement via Empty objects (spheres and boxes)\n- Batch processing support\n- Full undo/redo support\n\nThe extension uses the new Blender Extensions system with:\n- blender_manifest.toml for metadata and wheel bundling\n- blender-extension-builder for dependency management\n- Platform-specific builds via --split-platforms flag\n\nCloses #125\n\n* feat(blender): add version sync and CI workflow for releases\n\n- Add sync_version.py to sync extension version from pyproject.toml\n- Update build.sh to run version sync before building\n- Add GitHub Actions workflow to build extension for all platforms\n  (linux-x64, windows-x64, macos-arm64) on release\n- Workflow uploads packages as release assets automatically\n\nThe extension version is now derived from mmgpy's version:\n- 0.6.0.dev0 -> 0.6.0 (dev suffix stripped for Blender manifest)\n\n* fix(blender): support prerelease versions in manifest\n\nConvert Python PEP 440 versions to SemVer format for Blender:\n- 0.6.0.dev0 -> 0.6.0-dev.0\n- 0.6.0a1 -> 0.6.0-alpha.1\n- 0.6.0b1 -> 0.6.0-beta.1\n- 0.6.0rc1 -> 0.6.0-rc.1\n\nKeep Python format for dependency specifier (PEP 508 compatible).\n\n* fix(blender): Blender 5.1 compat, in-place remesh, auto-fit sizing, triangle warning\n\n* chore(blender): GPL-3.0 license, copyright, and tags for extensions platform\n\n* fix(blender): port to the .mmg PyVista accessor (mmgpy 0.13+)\n\nThe original branch was written against ``mmgpy.Mesh``, which v0.13\nremoved (#237) in favor of the ``.mmg`` accessor registered on\nPyVista datasets. Rework the remesh operator to drive MMG through\nthe accessor:\n\n- Build a ``pv.PolyData`` from Blender's triangulated mesh and call\n  ``polydata.mmg.remesh(...)``; extract the resulting points and\n  triangle faces back into Blender.\n- Replace ``Mesh.set_size_sphere`` / ``set_size_box`` mutations with\n  ``local_sizing=[{\"shape\": ...}]`` specs forwarded through the\n  accessor's kwarg.\n- Count vertex / element deltas locally since ``polydata.mmg.remesh``\n  returns a dataset rather than a ``RemeshResult``.\n\nBump the manifest's ``mmgpy`` dependency to ``>=0.13.0`` (the first\nrelease with the ``.mmg`` accessor and without the legacy ``Mesh``\npublic API).\n\nSuppress a handful of lint rules under ``blender_mmgpy/**/*.py`` that\nwere enabled on main since the branch was first written and conflict\nwith Blender's add-on patterns (``__init__.py`` as entry point,\n``set[str]`` return-type docstrings, ``Operator`` methods that need\n``self``).\n\n* refactor(blender): fix lint errors instead of accumulating per-file ignores\n\nStrip the bulk of the ``blender_mmgpy/**/*.py`` ruff ignore block and\nfix the code instead. Only seven rules remain ignored, all of them\ngenuinely Blender-API-mandated patterns that cannot be addressed in\ncode (N801/N802 naming, RUF012 mutable bl_options, TC002 runtime bpy\nimports, ARG002 fixed-signature callbacks, RUF067 add-on entry point).\n\nCode changes that replaced the rest of the ignores:\n\n- ``operators.py``: hoist ``import mmgpy`` and ``from . import utils``\n  to module level (PLC0415); convert ``except Exception`` to a\n  ``_REMESH_EXC_TYPES`` tuple of expected mmgpy/PyVista errors so\n  truly unexpected failures still surface a traceback (BLE001); make\n  three settings-translation helpers ``@staticmethod`` and type their\n  ``settings`` argument as ``MMGPYSettings`` (PLR6301, ANN001);\n  restructure ``_build_remesh_options`` around a couple of\n  ``(flag, name)`` tables to drop complexity below the C901 / PLR0912\n  threshold; extract a ``_ROUND_TO_2SF_ABOVE`` constant (PLR2004);\n  rewrap the long warning message (E501); add ``Returns`` sections to\n  every public/protected docstring (DOC201).\n\n- ``utils.py``: hoist ``import pyvista as pv`` to module level\n  (PLC0415); make ``apply_modifiers`` keyword-only (FBT001/FBT002);\n  drop the unnecessary ``obj`` temporary before ``return`` (RET504);\n  convert the empties-collection loop into a list comprehension\n  (PERF401).\n\n- ``preferences.py``: replace the in-function ``try: import mmgpy``\n  with a module-level try/except that exposes a single\n  ``_MMGPY_IMPORT_ERROR`` sentinel (PLC0415); the ``draw()`` body\n  branches on that.\n\n- ``sync_version.py``: route every user-visible print through\n  ``sys.stdout.write`` / ``sys.stderr.write`` helpers (T201); narrow\n  the top-level ``except Exception`` to ``(OSError, ValueError,\n  re.error)`` (BLE001); split it so the ``get_mmgpy_version`` call\n  sits outside the success-path ``try`` (TRY300); add ``Returns``\n  sections and unify the docstring style on NumPy (DOC201/D416/D420);\n  reword ``main()``'s summary in the imperative mood (D401);\n  document the ``ValueError`` ``get_mmgpy_version`` can raise\n  (DOC501).\n\n* refactor(blender): drop five more ignores after testing each against Blender\n\nAfter auditing every rule left in ``blender_mmgpy/**/*.py``, only two\nare genuinely Blender-API-mandated. The other five were avoidable:\n\n- ``RUF012``: declare ``bl_options`` with a ``ClassVar[set[str]]``\n  annotation. Runtime value is still a ``set`` (Blender's own\n  requirement), so ``register_class()`` is unaffected.\n- ``ARG002``: rename the unused ``event`` / ``context`` parameters\n  on ``invoke()`` / ``draw()`` to ``_event`` / ``_context``. Blender\n  calls these callbacks positionally, so the rename does not break\n  the operator / preferences contract.\n- ``RUF067``: move ``bl_info`` plus the registration helpers out of\n  ``__init__.py`` into a new ``_register.py`` and re-export them.\n  Blender resolves ``register`` / ``unregister`` / ``bl_info`` as\n  attributes of the package, so the re-export is transparent.\n- ``N802``: never actually fired — all our method names (``poll``,\n  ``execute``, ``invoke``, ``draw``) are already lowercase.\n\nWhat remains, with the reason each cannot be addressed in code:\n\n- ``N801``: ``bpy.utils.register_class()`` rejects operators / panels\n  unless the class name matches ``UPPER_TYPE_lowercase``\n  (``MMGPY_OT_remesh``, ``MMGPY_PT_main_panel``); the registration\n  helper validates the name against ``cls.bl_rna.identifier`` and\n  raises on a mismatch.\n- ``TC002``: ``bpy.props.<Property>`` callables only appear in class\n  annotations (``radius: FloatProperty(default=0.1)``) but Blender's\n  add-on metaclass evaluates those annotations at registration to\n  materialise RNA property descriptors — so the names must stay in\n  module globals. ``flake8-type-checking.exempt-modules`` would be a\n  surgical fix but it is a global setting; tweaking it disrupts\n  preview TC rules already passing in ``src/mmgpy/``, so the\n  per-file ignore is the smaller blast radius.\n\n* feat(blender): add wireframe overlay and per-triangle quality colouring\n\nTwo new toggles in the N-panel's \"Visualization\" sub-panel that operate\non the active mesh object:\n\n- **Wireframe on Surface**: flips ``obj.show_wire`` and\n  ``obj.show_all_edges`` so the mesh sits on top of the shaded surface\n  in every viewport shading mode. Purely a display-time change.\n\n- **Color by Quality**: computes MMG's in-radius-ratio quality per\n  triangle via ``polydata.mmg.element_qualities()``, stores it on the\n  mesh as a FACE-domain float attribute (``mmgpy_quality``) and\n  attaches a shared ``MMGpy_Quality`` material whose shader graph is\n  ``Attribute -> ColorRamp(red->yellow->green) -> Principled BSDF``.\n  Keeping the ColorRamp in the shader (instead of baking RGB into a\n  COLOR attribute) means users can re-grade the palette in the shader\n  editor without recomputing.\n\nThe remesh operator now refreshes the quality colouring at the end of\nevery successful run when the toggle is on, so the colours stay live\nacross iterations. Failures (non-triangle mesh, mmgpy errors) are\nreported as a WARNING without aborting the remesh — the underlying\ngeometry is already correct.\n\nBoth toggles are saved on the scene ``mmgpy`` settings group so they\nround-trip through ``.blend`` files.\n\n* feat(blender): refresh wireframe, show quality stats, rework release CI\n\nThree independent improvements bundled together:\n\n**Wireframe refresh after remesh.** ``replace_mesh_data`` calls\n``mesh.clear_geometry()`` + ``mesh.from_pydata()`` which invalidates the\nviewport's overlay cache, so a previously-on ``show_wire`` flag stops\ndrawing edges until something writes the property again. The remesh\noperator now re-applies the wireframe overlay at the end of each\nsuccessful run when the setting is on.\n\n**Quality stats in the panel.** ``apply_quality_visualization`` now\nstashes ``min`` / ``max`` / ``mean`` / ``n`` of the just-computed\nquality array as ID properties on the mesh (``mmgpy_quality_min``\netc.). The Visualization sub-panel reads them back via\n``utils.get_quality_stats`` so users see exactly what the colour\nramp is mapping. The legend is rewritten as a column of\n``SEQUENCE_COLOR_*`` swatches (red/yellow/green) with the matching\nquality value next to each, plus a stats block for the current mesh:\n\n    Quality (MMG in-radius ratio)\n    ▮ 0.0  poor\n    ▮ 0.5  fair\n    ▮ 1.0  excellent\n\n    This mesh (12,345 triangles):\n        min:  0.234\n        mean: 0.654\n        max:  0.987\n\n**Release CI consumes wheels directly.** The ``Build Blender\nExtension`` workflow now triggers via ``workflow_run`` after the\n``Build Wheels`` workflow succeeds on a release, and pulls the freshly\nbuilt mmgpy wheel out of that run's artifacts via\n``actions/download-artifact`` with ``run-id``. This drops the dependency\non ``pip download mmgpy`` against PyPI (which racy: the publish job\nhasn't finished yet by the time the extension built before).\n\nThe matrix expands to six packages — three platforms (linux-x64,\nwindows-x64, macos-arm64) crossed with two Blender Python ABIs\n(cp311 for Blender 4.2–4.5, cp313 for Blender 5.x). Each one runs:\n\n1. Download the wheels artifact for its platform.\n2. Drop every mmgpy wheel except the matching ABI.\n3. ``pip download mmgpy --find-links wheels`` to fill in transitive\n   deps for the target Python / platform.\n4. Inject ``wheels = [...]`` into the manifest (mirrors what bbext\n   would do; needed because the source manifest carries bbext-only\n   keys).\n5. Zip the eight Python source files + manifest + wheels via Python's\n   ``zipfile`` (no Blender binary required in CI).\n\nOutput zips are named\n``mmgpy-<version>-<platform>-py<X.YY>.zip`` and attached to the\nrelease page automatically; one of the six matches every Blender 4.2+\ninstall. ``bbext`` is no longer in the loop.\n\nAlso: gitignore ``blender_mmgpy/mmgpy-*.zip`` so local builds don't\nsneak into commits.\n\n* feat(blender): show the actual ColorRamp + axis hints in the panel\n\nThe previous \"Quality (MMG in-radius ratio)\" header + emoji-swatch\nlegend was getting clipped on narrow N-panels and didn't convey the\nmapping at a glance.\n\nReplace it with ``layout.template_color_ramp`` pointing at the\n``ColorRamp`` node inside the ``MMGpy_Quality`` material. The widget\ndraws the actual gradient that's lit on the mesh, shrinks to fit the\navailable panel width, and stays interactive — dragging a stop\nre-grades the colormap in place. Short axis hints (``0 — poor`` left,\n``best — 1`` right) sit underneath since the widget itself carries no\nlabels.\n\nThe stats block below keeps the same content (triangle count + min /\nmean / max) but loses the surrounding ``box`` (whose internal padding\nate horizontal space that the gradient now needs).\n\n* feat(blender): add Absolute vs Auto colormap range for quality coloring\n\nNew ``quality_colormap_mode`` enum on the scene settings:\n\n- ``Absolute [0, 1]`` — ramp stops at 0 / 0.5 / 1. Quality reads as an\n  absolute value: a perfect equilateral triangle is solid green, half\n  the ramp lit is genuinely poor.\n- ``Auto [min, max]`` — stops stretched across the current mesh's\n  actual ``min``..``max``. Useful when every triangle in the mesh\n  clusters near one quality value: the relative variation pops out\n  because the worst-in-this-mesh paints solid red and the\n  best-in-this-mesh paints solid green.\n\nImplementation:\n\n- ``utils.refresh_quality_ramp(obj, mode=...)`` rebuilds the\n  ``MMGpy_Quality`` material's ColorRamp with three red/yellow/green\n  stops at the right positions.\n- ``apply_quality_visualization`` calls it after caching the new\n  stats, reading the active mode through ``bpy.context.scene.mmgpy``\n  so the gradient redraws automatically after every remesh.\n- ``_update_quality_colormap_mode`` on the property fires the same\n  refresh when the user picks a different range.\n\nThe panel adds a one-row dropdown above the ramp widget, and the\naxis-hint labels switch from ``0 — poor`` / ``best — 1`` to the\nmesh-specific ``<min> — poor`` / ``best — <max>`` numbers in AUTO\nmode so users don't have to read them off the stats block.\n\nTrade-off worth flagging: ``_set_ramp_stops`` rebuilds the three\nstops from scratch on every refresh, so user-side colour edits in\nthe ramp widget get reverted whenever the mode or stats change.\nPredictable beats clever here — anyone who wants a permanent custom\npalette can fork the material.\n\n* docs(blender): label the quality ramp as MMG's in-radius ratio\n\nReplace the bare ``In-radius ratio`` heading above the ColorRamp\nwidget with a two-line ``Mesh quality`` / ``(MMG in-radius ratio)``\ncolumn so the metric is named even on narrow N-panels where the\ncombined \"Mesh quality: In-radius ratio\" string was getting clipped.\n\nMMG itself only exposes the in-radius ratio (``area/sum(edge^2)`` for\ntriangles, ``volume/(sum(edge^2))^(3/2)`` for tetrahedra), so it's\nnot gaining a peer here — calling it out gives users a search term\nwhen they want the formula.\n\n* chore: clear pre-existing prek failures (ty + prettier)\n\nThree small fixes so ``prek run --all-files`` is clean again — no\nbehavioural changes:\n\n- ``src/mmgpy/_io.py``: replace the mypy-only ``# type: ignore`` on\n  ``pv.read(...)`` with ``typing.cast``. ty doesn't honor mypy's\n  ignore comment and was flagging the wider ``DataSet | MultiBlock``\n  union as a mismatch.\n\n- ``src/mmgpy/_mesh.py`` (two ``Mesh`` constructors): the public API\n  accepts ``NDArray[np.integer]`` for refs / edges / edge_refs, but\n  ``_create_impl`` pins each to a concrete dtype (``int64`` for refs\n  and edge_refs, ``int32`` for edges). Add the explicit dtype to the\n  ``np.asarray`` calls so the narrowing happens at the call site\n  instead of leaking past the type checker.\n\n- ``.github/workflows/build-blender-extension.yml``: apply prettier's\n  preferred multi-line matrix-entry layout. The compact\n  ``{ key: val, key: val }`` form on the original commit tripped CI's\n  prettier hook.\n\n* feat(blender): add Range label + Custom [min, max] colormap mode\n\nTwo follow-ups to the colormap ramp:\n\n- The ``quality_colormap_mode`` dropdown now sits to the right of a\n  ``Range`` label (via ``layout.prop(..., text=\"Range\")``) instead of\n  appearing as a bare unlabeled dropdown.\n\n- New ``CUSTOM`` enum value exposes two sliders (``Custom Min`` /\n  ``Custom Max``, both clamped to ``[0, 1]``) so users can pin the\n  ramp endpoints at fixed values — useful for visually comparing two\n  meshes that would otherwise auto-scale to different ranges.\n\n  ``refresh_quality_ramp`` accepts ``custom_min`` / ``custom_max``\n  kwargs and, for the new mode, stretches the three stops to\n  ``(custom_min, midpoint, custom_max)``. Reverse-ordered values are\n  normalised; equal values fall back to the absolute ``[0, 1]`` ramp\n  to avoid a zero-width gradient.\n\nThe axis hints under the ramp pick up the active mode: AUTO shows\nthe mesh's measured min/max, CUSTOM shows the user-set bounds,\nABSOLUTE keeps the static ``0 — poor`` / ``best — 1``.\n\nRefactored ``MMGPY_PT_visualization.draw`` to push the quality\nsection into a static helper plus two module-level helpers\n(``_find_quality_ramp_node``, ``_quality_axis_labels``,\n``_draw_quality_ramp_controls``) so the draw method stays under the\nPLR0914/PLR0915 thresholds.\n\n* feat(blender): use RdYlBu palette + auto-switch to Material Preview\n\nTwo quality-of-life fixes on the quality colouring:\n\n- Swap the red/yellow/green ramp for ColorBrewer's 5-class **RdYlBu**\n  endpoints (``#d7191c`` / ``#ffffbf`` / ``#2c7bb6``). Follows the\n  scientific-colormap convention of warm = bad, cool = good.\n\n- When the user toggles **Color by Quality** on, walk the current\n  screen's 3D viewports and flip any that are still on ``SOLID`` /\n  ``WIREFRAME`` shading over to ``MATERIAL`` (Material Preview).\n  Without this, the colour material is invisible. Viewports already\n  on a material-aware mode (``MATERIAL`` / ``RENDERED``) are left\n  alone, and the toggle never auto-reverts on disable.\n\n* chore(blender): auto-sync extension version via prek hook\n\nAdd a local prek hook that runs ``blender_mmgpy/sync_version.py``\nwhenever any of ``pyproject.toml`` /\n``blender_mmgpy/blender_manifest.toml`` /\n``blender_mmgpy/_register.py`` is modified. ``sync_version.py``\nrewrites the manifest's ``version`` field and the ``bl_info`` tuple\nin ``_register.py`` from the project version, so the three files\ncan no longer drift past a commit.\n\nFix a stale reference at the same time: ``sync_version.py`` used to\ntarget ``__init__.py``'s ``bl_info`` tuple, but the previous\nRUF067 refactor moved ``bl_info`` to ``_register.py``. The script\nnow updates the right file (and renames ``update_init`` ->\n``update_register`` so the function name reflects reality). One\nside-effect of fixing it: the cached ``(0, 9, 0)`` bl_info version\nthat had been hiding for several commits now correctly reads\n``(0, 14, 0)``.\n\n* chore(blender): apply PR review feedback\n\nAddress the items flagged in the PR review:\n\n- **README rewrite**. Fix the license claim (was wrongly \"MIT\" — the\n  manifest is GPL-3.0-or-later). Update the package size from\n  \"~50-80MB\" to the actual ~150MB. Drop the stale ``bbext`` build\n  instructions and document the dev-build pipeline that the CI\n  workflow actually uses. Document the per-platform / per-Python-ABI\n  zip naming. Add the new **Visualization** features (wireframe\n  overlay, quality coloring with Range / Custom modes, ColorBrewer\n  RdYlBu, auto-switch to Material Preview). Add a **TODOs / Known\n  limitations** section flagging the long-running-remesh UI lockup\n  (and the planned ``wm.progress_*`` wiring), the palette reset on\n  refresh, the missing unit tests, and the single-quality-metric\n  limitation.\n\n- **Strip dead bbext keys from the manifest**. ``wheel-path`` and the\n  ``dependencies = [...]`` block are bbext-only conventions; Blender\n  itself reads ``wheels = [...]`` (which the CI generates per build).\n  Leave only a comment explaining how the wheels block is filled.\n\n- **Quality coloring uses ``direct_triangle_arrays``** instead of\n  ``blender_to_arrays``. The latter runs ``bmesh.ops.triangulate``,\n  which is documented to reorder faces — even on an all-triangle\n  input the round-trip order isn't guaranteed, and the i-th quality\n  value must line up with ``mesh.polygons[i]``. The new helper goes\n  through ``foreach_get`` (~100x faster than the per-vertex Python\n  loop too) and preserves order.\n\n- **Drop ``OSError``** from ``_REMESH_EXC_TYPES``. The surface remesh\n  path is in-memory only; no file I/O happens. Keeping ``OSError`` in\n  the tuple was conservative but misleading.\n\n- **CI gains a zip-structure validation step**. Pure Python check\n  (no Blender required) that confirms ``blender_manifest.toml`` is at\n  the zip root, parses as TOML with the required schema keys, has a\n  non-empty ``wheels = [...]`` block, and every declared wheel is\n  actually inside the zip.\n\n- **sync_version.py** no longer rewrites a manifest dependency line\n  that doesn't exist anymore — the ``dependencies = [...]`` block was\n  removed above. The script keeps updating the manifest ``version``\n  and ``_register.py``'s ``bl_info`` tuple.",
          "timestamp": "2026-05-15T22:18:22Z",
          "tree_id": "10efa85bf7e59d838930c7a00095e531c7aafe90",
          "url": "https://github.com/kmarchais/mmgpy/commit/c5a1a6e349c590d5ae959c983b3b7ad9ef821d95"
        },
        "date": 1778883913461,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_construction_3d",
            "value": 35.584636183679415,
            "unit": "iter/sec",
            "range": "stddev: 0.0002653498714888662",
            "extra": "mean: 28.102015567567932 msec\nrounds: 37"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_io_roundtrip_3d",
            "value": 18.417097465517898,
            "unit": "iter/sec",
            "range": "stddev: 0.00033139064631365877",
            "extra": "mean: 54.29737242104992 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_pyvista_roundtrip_3d",
            "value": 31.45409564365178,
            "unit": "iter/sec",
            "range": "stddev: 0.0001965966281168337",
            "extra": "mean: 31.792362156240372 msec\nrounds: 32"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_quality_3d",
            "value": 3384.7691466623282,
            "unit": "iter/sec",
            "range": "stddev: 0.000009267003834617007",
            "extra": "mean: 295.44112365420415 usec\nrounds: 3437"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_validate_3d",
            "value": 74.53089901569462,
            "unit": "iter/sec",
            "range": "stddev: 0.00009717207236434908",
            "extra": "mean: 13.41725396052745 msec\nrounds: 76"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_metric_field_set_get",
            "value": 7140.910949871567,
            "unit": "iter/sec",
            "range": "stddev: 0.00000574118840786525",
            "extra": "mean: 140.03815577870853 usec\nrounds: 19027"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_adaptive_hmin_hmax_hausd",
            "value": 0.13005248259715893,
            "unit": "iter/sec",
            "range": "stddev: 0.03499623312415353",
            "extra": "mean: 7.6892034663999995 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_metric_hgrad",
            "value": 0.10216611938563701,
            "unit": "iter/sec",
            "range": "stddev: 0.2889055468067699",
            "extra": "mean: 9.78798065359997 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_optimize",
            "value": 0.3467978181569034,
            "unit": "iter/sec",
            "range": "stddev: 0.008338808920420234",
            "extra": "mean: 2.8835244849999753 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_adaptive_hmax_hgrad_angle",
            "value": 5.317465468087509,
            "unit": "iter/sec",
            "range": "stddev: 0.0003153344101370148",
            "extra": "mean: 188.0595193333079 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_metric_hmin_hausd",
            "value": 5.335618215792865,
            "unit": "iter/sec",
            "range": "stddev: 0.00016101412888937315",
            "extra": "mean: 187.41970650000894 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_uniform_angle",
            "value": 5.32071148951356,
            "unit": "iter/sec",
            "range": "stddev: 0.0006270145215602872",
            "extra": "mean: 187.9447893333198 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_adaptive_hmin_hgrad",
            "value": 5.163583917708703,
            "unit": "iter/sec",
            "range": "stddev: 0.0019287569189537438",
            "extra": "mean: 193.66393883334845 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_metric_hmax_hausd_angle",
            "value": 2.115189280745988,
            "unit": "iter/sec",
            "range": "stddev: 0.0015985275260417538",
            "extra": "mean: 472.7709283999957 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_optimize",
            "value": 2.091748576434712,
            "unit": "iter/sec",
            "range": "stddev: 0.004885456143758669",
            "extra": "mean: 478.0689281999912 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_uniform",
            "value": 2.8799918269059805,
            "unit": "iter/sec",
            "range": "stddev: 0.0018794625712876222",
            "extra": "mean: 347.22320759997274 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 171.21977574406077,
            "unit": "iter/sec",
            "range": "stddev: 0.0000946341559735708",
            "extra": "mean: 5.840446850571744 msec\nrounds: 174"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.210136295414548,
            "unit": "iter/sec",
            "range": "stddev: 0.00035817582065073966",
            "extra": "mean: 70.37230179999672 msec\nrounds: 15"
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
          "id": "ee05a8b23e3e1313f7e7a410ac33be9b04283ae7",
          "message": "docs(blender): prep manifest + docs page for extensions.blender.org submission (#272)\n\n* docs(blender): prep manifest + docs page for extensions.blender.org\n\nPre-flight cleanup ahead of submitting the Blender add-on to\n[extensions.blender.org](https://extensions.blender.org) once the\nnext mmgpy release is tagged.\n\n- **Drop the unused ``[permissions]`` block from the manifest.** The\n  remesh path is fully in-memory (Blender mesh -> NumPy -> PyVista ->\n  MMG -> Blender mesh); we never touch the filesystem, so declaring\n  ``files = \"...\"`` permission is misleading and a review-board flag.\n\n- **Rephrase the tagline** from \"Powerful mesh remeshing using MMG\n  library\" to \"Adaptive surface remeshing via the MMG library\" — more\n  descriptive, less marketing.\n\n- **Point ``website``** at a dedicated docs page\n  (``https://kmarchais.github.io/mmgpy/latest/blender-extension``)\n  instead of the bare GitHub repo. The platform shows the website\n  link in the add-on listing, and a focused docs page is a better\n  landing than the project root.\n\n- **Add ``docs/blender-extension.md``** plus a nav entry under\n  ``mkdocs.yml`` so the new website URL actually resolves. Covers\n  install (extensions.blender.org + GitHub releases), basic remesh,\n  presets, local refinement, the visualization toggles + three\n  colormap modes, building from source, troubleshooting, TODOs and\n  licensing.\n\nID availability check came back clean:\n``GET https://extensions.blender.org/api/v1/extensions/?search=mmgpy``\nreturned no hits, so the manifest id can stay as ``mmgpy``.\n\n* docs(blender): skip the build-pipeline bash block under pytest-codeblocks\n\nThe build-from-source code block calls ``blender --command extension\nbuild`` as its last line. CI runners don't have Blender installed,\nso ``pytest --codeblocks`` (which is the project's ``daily-docs-test``\njob) fails on it with ``bash: line 14: blender: command not found``.\n\nMark the block with ``<!-- pytest-codeblocks:skip -->`` (the same\nconvention every other docs page uses for non-runnable snippets, e.g.\n``docs/api/lagrangian.md``). The block is documentation about how the\nrelease CI builds the extension; it isn't intended to be executed by\nthe docs harness.\n\n* docs(blender): wire in the two screenshots\n\nReplace the three ``<!-- TODO: screenshot -->`` markers in\n``docs/blender-extension.md``:\n\n- **overview.png** (1.4 MB) — full N-panel with the four sub-panels\n  visible next to a remeshed Suzanne. Sits at the bottom of the\n  *Where the UI lives* section.\n- **quality.png** (23 KB) — Visualization sub-panel showing the\n  ColorRamp widget + stats block. Sits at the bottom of the\n  *Quality visualisation* section.\n\nThe third planned screenshot (a separate *Local refinement workflow*\nshot) is dropped: the local refinement section is short and\ntext-heavy, and the overview screenshot already shows enough of the\npanel context. Easier than ginning up a third capture for marginal\nbenefit.\n\nImages live under ``docs/assets/blender/`` (the existing\n``docs/assets/`` convention — see e.g. the elasticity-propagation\ntutorial), where the project ``.gitignore`` allowlists\n``!docs/assets/**/*.png``.\n\n* chore(blender): drop legacy bl_info, inject platforms in CI\n\nCleanup pass following the Blender extensions spec audit against\nhttps://docs.blender.org/manual/en/dev/advanced/extensions/.\n\n- **Remove the legacy ``bl_info`` dict from ``_register.py``** and\n  the matching re-export from ``__init__.py``. The upstream\n  conversion guide is explicit: \"Remove the bl_info information\n  (this is now in the manifest).\" Blender 4.2+ reads every piece of\n  add-on metadata from ``blender_manifest.toml`` instead, so the\n  duplicate was dead weight and a drift target.\n\n- **Simplify ``sync_version.py`` accordingly.** Drop\n  ``update_register()`` and the ``version_to_tuple()`` helper it\n  depended on; the script now only rewrites the manifest version\n  field. The prek ``sync-blender-version`` hook's ``files:``\n  pattern loses ``_register.py``.\n\n- **Inject ``platforms = [\"<matrix.platform>\"]`` in the CI workflow**\n  next to the existing ``wheels = [...]`` injection. Each CI zip\n  targets exactly one Blender platform identifier (linux-x64,\n  windows-x64, macos-arm64), so declaring it makes the manifest in\n  the zip self-describing and lets Blender catch any\n  platform/zip mismatch at install time with a clearer error\n  message.\n\n  Fixes a regression at the same time: the previous injection\n  regex anchored on ``[permissions]``, which was removed from the\n  source manifest in the previous PR commit; the injection has\n  been silently no-op'ing since. The replacement appends both\n  blocks to the end of the manifest, which is location-independent\n  and lint-stable.\n\n* fix(blender): three small follow-ups from the PR review\n\n- ``docs/blender-extension.md``: relabel the Absolute-mode endpoint\n  from \"0 = inverted\" to \"0 = degenerate, 1 = equilateral\". MMG's\n  in-radius ratio at 0 is a sliver/zero-area triangle, not a\n  winding-order flip — \"inverted\" would suggest a different failure\n  mode entirely.\n- CI ``Validate zip structure`` step: add an explicit\n  ``platforms`` check so a future regex slip in the injection\n  step can't silently produce zips with the wrong ``platforms``\n  field. Compares against ``${{ matrix.platform }}`` directly.\n- Same step: swap ``str.lstrip(\"./\")`` for ``str.removeprefix(\"./\")``.\n  ``lstrip`` strips *any* leading ``.``/``/`` characters in any\n  order rather than the literal ``./`` prefix — produces the right\n  answer for current inputs by accident.",
          "timestamp": "2026-05-15T23:37:49Z",
          "tree_id": "b6b88eebe5ad723ce7dad9ace28e550aae4215d0",
          "url": "https://github.com/kmarchais/mmgpy/commit/ee05a8b23e3e1313f7e7a410ac33be9b04283ae7"
        },
        "date": 1778888697441,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_construction_3d",
            "value": 43.18372359448067,
            "unit": "iter/sec",
            "range": "stddev: 0.00014896067885813928",
            "extra": "mean: 23.156872931814767 msec\nrounds: 44"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_io_roundtrip_3d",
            "value": 21.362857724546622,
            "unit": "iter/sec",
            "range": "stddev: 0.00033792093778949863",
            "extra": "mean: 46.81021672727648 msec\nrounds: 22"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_pyvista_roundtrip_3d",
            "value": 35.5748911149731,
            "unit": "iter/sec",
            "range": "stddev: 0.0001102970497201978",
            "extra": "mean: 28.109713583328737 msec\nrounds: 36"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_quality_3d",
            "value": 3377.2540091224378,
            "unit": "iter/sec",
            "range": "stddev: 0.000007566653248380492",
            "extra": "mean: 296.0985455339928 usec\nrounds: 3437"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_validate_3d",
            "value": 72.78832715815908,
            "unit": "iter/sec",
            "range": "stddev: 0.00006418681096605128",
            "extra": "mean: 13.738466578949351 msec\nrounds: 76"
          },
          {
            "name": "benchmarks/bench_operations.py::TestOperations::test_metric_field_set_get",
            "value": 8613.663090936381,
            "unit": "iter/sec",
            "range": "stddev: 0.000004684430231473457",
            "extra": "mean: 116.09462657672755 usec\nrounds: 13636"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_adaptive_hmin_hmax_hausd",
            "value": 0.10994985060739515,
            "unit": "iter/sec",
            "range": "stddev: 0.05604980137825523",
            "extra": "mean: 9.095055559200011 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_metric_hgrad",
            "value": 0.09553630972528403,
            "unit": "iter/sec",
            "range": "stddev: 0.2546011846580096",
            "extra": "mean: 10.467224481200015 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh3D::test_3d_optimize",
            "value": 0.4003527358383766,
            "unit": "iter/sec",
            "range": "stddev: 0.008301423671054952",
            "extra": "mean: 2.4977973433999523 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_adaptive_hmax_hgrad_angle",
            "value": 5.2765446133916205,
            "unit": "iter/sec",
            "range": "stddev: 0.0004882396574024048",
            "extra": "mean: 189.51796550000685 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_metric_hmin_hausd",
            "value": 5.281203080031985,
            "unit": "iter/sec",
            "range": "stddev: 0.00047453021808710103",
            "extra": "mean: 189.35079466664698 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemesh2D::test_2d_uniform_angle",
            "value": 5.2831422003862185,
            "unit": "iter/sec",
            "range": "stddev: 0.00029766861492508975",
            "extra": "mean: 189.28129550003328 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_adaptive_hmin_hgrad",
            "value": 5.336754221252278,
            "unit": "iter/sec",
            "range": "stddev: 0.002512124495083219",
            "extra": "mean: 187.3798114999848 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_metric_hmax_hausd_angle",
            "value": 2.034078572436658,
            "unit": "iter/sec",
            "range": "stddev: 0.002608607303809295",
            "extra": "mean: 491.62309340001684 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_optimize",
            "value": 2.031223502943284,
            "unit": "iter/sec",
            "range": "stddev: 0.003407237599075037",
            "extra": "mean: 492.31411440000556 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh.py::TestRemeshSurface::test_surface_uniform",
            "value": 2.81252599582634,
            "unit": "iter/sec",
            "range": "stddev: 0.002522892315392859",
            "extra": "mean: 355.55226919998404 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 164.24896429388335,
            "unit": "iter/sec",
            "range": "stddev: 0.000027303718123498088",
            "extra": "mean: 6.08831845180311 msec\nrounds: 166"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 13.607919849784174,
            "unit": "iter/sec",
            "range": "stddev: 0.000215266229680517",
            "extra": "mean: 73.4866174285896 msec\nrounds: 14"
          }
        ]
      }
    ]
  }
}