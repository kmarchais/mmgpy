window.BENCHMARK_DATA = {
  "lastUpdate": 1778323965065,
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
      }
    ]
  }
}