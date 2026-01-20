window.BENCHMARK_DATA = {
  "lastUpdate": 1768945191823,
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
          "id": "f05c18e659353a0d5c8e74997d096ebd0f818543",
          "message": "fix(cli): use stdlib logging in error paths to fix Windows subprocess hang (#172)\n\n* feat(build): enable editable install with automatic C++ rebuild\n\nAdd scikit-build-core editable rebuild configuration and uv no-build-isolation\nsetting to simplify the development workflow:\n\n- Add `editable.rebuild = true` for automatic C++ rebuilds on import\n- Add `no-build-isolation-package` to allow `uv pip install -e .` without flags\n- Add build dependencies to dev group (required for no-build-isolation)\n- Update CONTRIBUTING.md to reflect simplified workflow\n- Update CI to install build deps before sdist build\n\nCloses #169\n\n* fix(cli): use stdlib logging in error paths to fix Windows subprocess hang\n\nWhen CLI entry points hit an error path on Windows, Rich's RichHandler\nkeeps pipe handles open, causing parent processes to wait forever for\npipe EOF.\n\nRoot cause: Rich's Console does TTY/pipe detection and uses internal\nbuffering that doesn't play well with captured subprocess output on\nWindows.\n\nSolution: Add _get_cli_logger() helper that uses plain stdlib StreamHandler\ninstead of Rich-based logging in CLI error paths.\n\nFixes #171",
          "timestamp": "2026-01-20T22:29:57+01:00",
          "tree_id": "bfc2a74a6f0992c84babc4ea4c62db6c072f9f0e",
          "url": "https://github.com/kmarchais/mmgpy/commit/f05c18e659353a0d5c8e74997d096ebd0f818543"
        },
        "date": 1768945190682,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 1.0704813376658324,
            "unit": "iter/sec",
            "range": "stddev: 0.0028818012293957847",
            "extra": "mean: 934.1592093333304 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.5806253772485154,
            "unit": "iter/sec",
            "range": "stddev: 0.016352602194867654",
            "extra": "mean: 1.7222809046666707 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.0921713049460042,
            "unit": "iter/sec",
            "range": "stddev: 0.004916657705795725",
            "extra": "mean: 915.6072819999963 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.1495184564878769,
            "unit": "iter/sec",
            "range": "stddev: 0.011224543975040026",
            "extra": "mean: 869.9294859999895 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 1.1002081578798666,
            "unit": "iter/sec",
            "range": "stddev: 0.0012477304492270358",
            "extra": "mean: 908.9189103333221 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.5663153668287497,
            "unit": "iter/sec",
            "range": "stddev: 0.046279865062794044",
            "extra": "mean: 1.7658005743333358 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.1482189759789458,
            "unit": "iter/sec",
            "range": "stddev: 0.008819811646967907",
            "extra": "mean: 870.9140163333586 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.1580120371228817,
            "unit": "iter/sec",
            "range": "stddev: 0.006947036716501035",
            "extra": "mean: 863.548881999994 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 34.246229294697834,
            "unit": "iter/sec",
            "range": "stddev: 0.0007141926556353622",
            "extra": "mean: 29.200295057150274 msec\nrounds: 35"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.2092846636883225,
            "unit": "iter/sec",
            "range": "stddev: 0.003194597980451603",
            "extra": "mean: 826.9351543333036 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 122.0238956147551,
            "unit": "iter/sec",
            "range": "stddev: 0.00006313961166722298",
            "extra": "mean: 8.195116169353637 msec\nrounds: 124"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 10.416104670472846,
            "unit": "iter/sec",
            "range": "stddev: 0.001886103792133353",
            "extra": "mean: 96.0051796363721 msec\nrounds: 11"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 1.1179251435140236,
            "unit": "iter/sec",
            "range": "stddev: 0.004410622502328178",
            "extra": "mean: 894.5142756666655 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 13.278163688688215,
            "unit": "iter/sec",
            "range": "stddev: 0.0015102765022973778",
            "extra": "mean: 75.31161864286317 msec\nrounds: 14"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 430.14906553412726,
            "unit": "iter/sec",
            "range": "stddev: 0.00004590836790876824",
            "extra": "mean: 2.3247754793057007 msec\nrounds: 459"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 12.22460569329881,
            "unit": "iter/sec",
            "range": "stddev: 0.002084103334060974",
            "extra": "mean: 81.80222946153364 msec\nrounds: 13"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 257.45100777448,
            "unit": "iter/sec",
            "range": "stddev: 0.00005469338658441016",
            "extra": "mean: 3.8842341641791998 msec\nrounds: 268"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 234.11350867241921,
            "unit": "iter/sec",
            "range": "stddev: 0.00020029612341772882",
            "extra": "mean: 4.27143228799855 msec\nrounds: 250"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 312.66192186525063,
            "unit": "iter/sec",
            "range": "stddev: 0.00006554623570629354",
            "extra": "mean: 3.1983427787889522 msec\nrounds: 330"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 42.30655112914282,
            "unit": "iter/sec",
            "range": "stddev: 0.0004587646290124306",
            "extra": "mean: 23.637001204552245 msec\nrounds: 44"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 1009.6102112604658,
            "unit": "iter/sec",
            "range": "stddev: 0.000027454421166936116",
            "extra": "mean: 990.4812657862605 usec\nrounds: 1061"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 12.90008115901791,
            "unit": "iter/sec",
            "range": "stddev: 0.0010359870343355753",
            "extra": "mean: 77.51889214285613 msec\nrounds: 14"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 2174.51607619007,
            "unit": "iter/sec",
            "range": "stddev: 0.000012178500747966439",
            "extra": "mean: 459.87243366445085 usec\nrounds: 2216"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 45.31088422861574,
            "unit": "iter/sec",
            "range": "stddev: 0.0005216369009547401",
            "extra": "mean: 22.069752489368934 msec\nrounds: 47"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 93776.88904975388,
            "unit": "iter/sec",
            "range": "stddev: 6.279081470569894e-7",
            "extra": "mean: 10.663608167567213 usec\nrounds: 100372"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
            "value": 26661.505209409795,
            "unit": "iter/sec",
            "range": "stddev: 0.000002020184858271553",
            "extra": "mean: 37.507259704417 usec\nrounds: 31532"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
            "value": 5541.761261438816,
            "unit": "iter/sec",
            "range": "stddev: 0.000004024577947420614",
            "extra": "mean: 180.44804761949786 usec\nrounds: 5796"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 12.877515449255435,
            "unit": "iter/sec",
            "range": "stddev: 0.0022728246488160422",
            "extra": "mean: 77.65473114286335 msec\nrounds: 14"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 13.253873860239075,
            "unit": "iter/sec",
            "range": "stddev: 0.0010062459385301978",
            "extra": "mean: 75.44963914285826 msec\nrounds: 14"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 13.195426087928631,
            "unit": "iter/sec",
            "range": "stddev: 0.0011604099261964228",
            "extra": "mean: 75.7838355000006 msec\nrounds: 14"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 1460.9498609209136,
            "unit": "iter/sec",
            "range": "stddev: 0.000008542382193940088",
            "extra": "mean: 684.4861872053893 usec\nrounds: 1485"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 1397.1920246895525,
            "unit": "iter/sec",
            "range": "stddev: 0.000007541047211755583",
            "extra": "mean: 715.7212339672451 usec\nrounds: 1419"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 1215.0619748021916,
            "unit": "iter/sec",
            "range": "stddev: 0.000008425037674215067",
            "extra": "mean: 823.0032876823398 usec\nrounds: 1234"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 56.23019007426206,
            "unit": "iter/sec",
            "range": "stddev: 0.0004948185532822997",
            "extra": "mean: 17.784040898302504 msec\nrounds: 59"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 56.87017717403363,
            "unit": "iter/sec",
            "range": "stddev: 0.00037123654882765557",
            "extra": "mean: 17.583908644065037 msec\nrounds: 59"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 57.967351132438885,
            "unit": "iter/sec",
            "range": "stddev: 0.0005711517073276872",
            "extra": "mean: 17.251090147543312 msec\nrounds: 61"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 12.87440163494056,
            "unit": "iter/sec",
            "range": "stddev: 0.0022086873472248656",
            "extra": "mean: 77.67351278571611 msec\nrounds: 14"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 13.08998016743754,
            "unit": "iter/sec",
            "range": "stddev: 0.0021761436109471077",
            "extra": "mean: 76.3943097857082 msec\nrounds: 14"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 3513.7975003711153,
            "unit": "iter/sec",
            "range": "stddev: 0.0000066199654657552736",
            "extra": "mean: 284.59238185876774 usec\nrounds: 3572"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 1060362.3137527197,
            "unit": "iter/sec",
            "range": "stddev: 6.132531058801195e-8",
            "extra": "mean: 943.0738786452227 nsec\nrounds: 109554"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 2772503.633135111,
            "unit": "iter/sec",
            "range": "stddev: 2.982810225002795e-8",
            "extra": "mean: 360.6848294258908 nsec\nrounds: 194629"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1576503.8179811775,
            "unit": "iter/sec",
            "range": "stddev: 4.932483939856262e-8",
            "extra": "mean: 634.3149877559887 nsec\nrounds: 162893"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 137800.5827044565,
            "unit": "iter/sec",
            "range": "stddev: 4.907814440956684e-7",
            "extra": "mean: 7.25686336279665 usec\nrounds: 140057"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 698.2172515301316,
            "unit": "iter/sec",
            "range": "stddev: 0.000013840663712893503",
            "extra": "mean: 1.4322189802794423 msec\nrounds: 710"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 121.80093604438045,
            "unit": "iter/sec",
            "range": "stddev: 0.00005495597896781166",
            "extra": "mean: 8.210117528453406 msec\nrounds: 123"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 19.467548531038638,
            "unit": "iter/sec",
            "range": "stddev: 0.00010294298124576999",
            "extra": "mean: 51.36753600000645 msec\nrounds: 20"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 122.02037540074502,
            "unit": "iter/sec",
            "range": "stddev: 0.00007076783181152429",
            "extra": "mean: 8.19535259349722 msec\nrounds: 123"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 111.05705508110137,
            "unit": "iter/sec",
            "range": "stddev: 0.000046399496616922404",
            "extra": "mean: 9.004380669645277 msec\nrounds: 112"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 120.83756773267102,
            "unit": "iter/sec",
            "range": "stddev: 0.00010271855506954138",
            "extra": "mean: 8.275572065570701 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 151.4320400989346,
            "unit": "iter/sec",
            "range": "stddev: 0.00004821822239845547",
            "extra": "mean: 6.60362232026111 msec\nrounds: 153"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 707.2615204282625,
            "unit": "iter/sec",
            "range": "stddev: 0.00001492911346881185",
            "extra": "mean: 1.4139041515993658 msec\nrounds: 719"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 121.78021164831708,
            "unit": "iter/sec",
            "range": "stddev: 0.00008096888763347923",
            "extra": "mean: 8.211514715443668 msec\nrounds: 123"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 121.86480991912158,
            "unit": "iter/sec",
            "range": "stddev: 0.00005288768364656398",
            "extra": "mean: 8.205814300811475 msec\nrounds: 123"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 29602.76260322839,
            "unit": "iter/sec",
            "range": "stddev: 0.0000018528514370111355",
            "extra": "mean: 33.78063099728884 usec\nrounds: 30222"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 48.250099852882165,
            "unit": "iter/sec",
            "range": "stddev: 0.015886786490286787",
            "extra": "mean: 20.725345710145014 msec\nrounds: 69"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 2.0642806635955036,
            "unit": "iter/sec",
            "range": "stddev: 0.0020447889107196664",
            "extra": "mean: 484.43025099999204 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.150147750241985,
            "unit": "iter/sec",
            "range": "stddev: 0.0013112847107242173",
            "extra": "mean: 869.4535113333094 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.11370067606793868,
            "unit": "iter/sec",
            "range": "stddev: 0.02732166974948208",
            "extra": "mean: 8.795022462333273 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.1417445534576978,
            "unit": "iter/sec",
            "range": "stddev: 0.0011869794230787555",
            "extra": "mean: 875.8526563332983 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 1.9275473613468748,
            "unit": "iter/sec",
            "range": "stddev: 0.0024109715375751238",
            "extra": "mean: 518.7939970000267 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 1.0047995153168734,
            "unit": "iter/sec",
            "range": "stddev: 0.002941025982578916",
            "extra": "mean: 995.2234099999941 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 1.7391335753049821,
            "unit": "iter/sec",
            "range": "stddev: 0.00008055407584068551",
            "extra": "mean: 574.9989616666653 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 2.0283794215958926,
            "unit": "iter/sec",
            "range": "stddev: 0.0002085503908809178",
            "extra": "mean: 493.004409999988 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.1458604089405942,
            "unit": "iter/sec",
            "range": "stddev: 0.0073404650976706814",
            "extra": "mean: 872.7066509999682 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.1435007290265278,
            "unit": "iter/sec",
            "range": "stddev: 0.003932612713569926",
            "extra": "mean: 874.5075316666467 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 12977.182503877928,
            "unit": "iter/sec",
            "range": "stddev: 0.0000021933699343107917",
            "extra": "mean: 77.05832908654658 usec\nrounds: 13422"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 297.5653426832114,
            "unit": "iter/sec",
            "range": "stddev: 0.0000738238376940015",
            "extra": "mean: 3.360606416670646 msec\nrounds: 312"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 17.82378068639579,
            "unit": "iter/sec",
            "range": "stddev: 0.0022266621932160386",
            "extra": "mean: 56.10481959998879 msec\nrounds: 20"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 12.748693116214456,
            "unit": "iter/sec",
            "range": "stddev: 0.0027469823669028872",
            "extra": "mean: 78.43941264286514 msec\nrounds: 14"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.439369258283207,
            "unit": "iter/sec",
            "range": "stddev: 0.002466012453008669",
            "extra": "mean: 183.8448453333399 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 12.963932545082102,
            "unit": "iter/sec",
            "range": "stddev: 0.0023932597419469466",
            "extra": "mean: 77.13708757142156 msec\nrounds: 14"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 16.95793234923168,
            "unit": "iter/sec",
            "range": "stddev: 0.0024407094146450628",
            "extra": "mean: 58.969453315769805 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 12.9838903613798,
            "unit": "iter/sec",
            "range": "stddev: 0.0021191917958176265",
            "extra": "mean: 77.01851850000756 msec\nrounds: 14"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 12.556100376212441,
            "unit": "iter/sec",
            "range": "stddev: 0.0026179359010402646",
            "extra": "mean: 79.64256178570395 msec\nrounds: 14"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 17.14604280025609,
            "unit": "iter/sec",
            "range": "stddev: 0.002392741035423998",
            "extra": "mean: 58.32249526316733 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 12.751527035892181,
            "unit": "iter/sec",
            "range": "stddev: 0.002497030061633682",
            "extra": "mean: 78.42198014286949 msec\nrounds: 14"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 12.813049829134973,
            "unit": "iter/sec",
            "range": "stddev: 0.0028704210682106474",
            "extra": "mean: 78.0454312856997 msec\nrounds: 14"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 24431.467685451746,
            "unit": "iter/sec",
            "range": "stddev: 0.0000012807101551069408",
            "extra": "mean: 40.93081974749605 usec\nrounds: 24732"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 46.0455917532421,
            "unit": "iter/sec",
            "range": "stddev: 0.01576688209724912",
            "extra": "mean: 21.717605571429957 msec\nrounds: 63"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 185.33710948999612,
            "unit": "iter/sec",
            "range": "stddev: 0.00002352259816423143",
            "extra": "mean: 5.395573518718207 msec\nrounds: 187"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 15.24742801452773,
            "unit": "iter/sec",
            "range": "stddev: 0.00020522228804218873",
            "extra": "mean: 65.58483168749518 msec\nrounds: 16"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
            "value": 1.2088228493529907,
            "unit": "iter/sec",
            "range": "stddev: 0.008791985911431722",
            "extra": "mean: 827.2510736666163 msec\nrounds: 3"
          }
        ]
      }
    ]
  }
}