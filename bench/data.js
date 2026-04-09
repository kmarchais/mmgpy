window.BENCHMARK_DATA = {
  "lastUpdate": 1775762002755,
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
      }
    ]
  }
}