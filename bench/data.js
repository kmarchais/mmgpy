window.BENCHMARK_DATA = {
  "lastUpdate": 1775233334412,
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
      }
    ]
  }
}