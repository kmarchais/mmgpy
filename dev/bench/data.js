window.BENCHMARK_DATA = {
  "lastUpdate": 1768237946797,
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
          "id": "c1eba49b31f7117a9ff374114bb504289a8b8174",
          "message": "feat: capture MMG warnings from stderr during remeshing (#151)\n\n* feat(logging): add file logging support and external logger integration\n\nAdd the ability to log mmgpy output to a file with rotation support,\nand enable integration with external logging frameworks.\n\nNew functions:\n- set_log_file(): Enable file logging with RotatingFileHandler\n- get_log_file(): Get current log file path\n- configure_logging(): Disable Rich console handler for custom setups\n- get_logger(): Now publicly exported for external logger integration\n\nFeatures:\n- Log rotation with configurable max_bytes and backup_count\n- Different log levels for file and console handlers\n- Auto-creation of parent directories for log files\n- Full compatibility with external loggers (structlog, loguru, etc.)\n\nCloses #121\n\n* fix(logging): flush file handlers in tests for reliable assertions\n\nAdd handler.flush() calls after logging messages in tests to ensure\nfile content is written before reading. This fixes flaky test failures\nin CI where file content wasn't immediately available.\n\nAlso includes minor formatting fixes from pre-commit hooks.\n\n* fix(logging): use NOTSET level for file handler by default\n\nUse logging.NOTSET (0) as default file handler level instead of the\nlogger's current level. This allows the file handler to defer to the\nlogger's level, so changes to set_log_level() affect file output.\n\nPreviously, set_log_file() captured the logger's level at creation\ntime (default WARNING), so subsequent set_log_level(\"INFO\") calls\nwouldn't affect file output.\n\n* feat(progress): add progress callbacks with cancellation support\n\nAdd support for progress callbacks during remeshing operations with:\n\n- Progress percentage (0.0-1.0) in ProgressEvent via new progress field\n- Callback return value (bool) for cancellation support\n- CancellationError exception raised when callback returns False\n- Updated all progress reporters (Logging, Rich) to return True\n- Enhanced rich_progress with percentage display support\n- Backwards compatibility with callbacks that return None\n\nCloses #126\n\n🤖 Generated with [Claude Code](https://claude.com/claude-code)\n\n* feat(mesh): add default progress bar to remesh methods\n\nAdd progress parameter to Mesh.remesh(), remesh_lagrangian(),\nremesh_levelset(), remesh_optimize(), and remesh_uniform() methods.\n\n- progress=True (default): Shows Rich progress bar in interactive terminals\n- progress=False: No progress reporting\n- progress=callable: Uses custom callback for progress/cancellation\n\nThe progress bar is automatically disabled in:\n- CI environments (detected via CI, GITHUB_ACTIONS, etc. env vars)\n- pytest runs\n- Non-TTY outputs (piped commands, redirected output)\n\nThis allows users to see remeshing progress by default without any code\nchanges, while not affecting automated testing or CI pipelines.\n\n🤖 Generated with [Claude Code](https://claude.com/claude-code)\n\n* test(progress): add tests for Mesh.remesh progress parameter\n\nAdd tests for the new progress parameter in Mesh.remesh() and the\nhelper functions _is_interactive_terminal() and _resolve_progress_callback().\n\nTests cover:\n- progress=False disables progress bar\n- progress=None disables progress bar\n- progress=callable uses custom callback\n- Cancellation via callback returning False\n- Details reported in completion event\n- Interactive terminal detection in pytest environment\n- Progress callback resolution logic\n\n🤖 Generated with [Claude Code](https://claude.com/claude-code)\n\n* test(progress): add coverage for interactive terminal detection\n\nAdd tests that mock the environment to cover all branches in\n_is_interactive_terminal() and _resolve_progress_callback():\n\n- CI environment variable detection (CI, GITHUB_ACTIONS)\n- Non-TTY stdout detection\n- Interactive terminal with RichProgressReporter creation\n\nThese tests temporarily remove pytest from sys.modules to test\nthe non-pytest code paths.\n\n🤖 Generated with [Claude Code](https://claude.com/claude-code)\n\n* test(progress): add tests for remesh_levelset and remesh_lagrangian progress\n\nAdd coverage tests for progress parameter in:\n- Mesh.remesh_levelset() with callback\n- Mesh.remesh_levelset() cancellation\n- Mesh.remesh_lagrangian() with callback\n- Mesh.remesh_lagrangian() cancellation\n\n🤖 Generated with [Claude Code](https://claude.com/claude-code)\n\n* fix(test): fix levelset shape and remove lagrangian tests\n\n- Fix levelset array shape to Nx1 as required by the API\n- Remove lagrangian tests as they require complex setup (lag parameter)\n\n🤖 Generated with [Claude Code](https://claude.com/claude-code)\n\n* test(progress): restore lagrangian tests with skipif\n\n- Add back lagrangian progress tests\n- Use pytest.mark.skipif to skip if lagrangian not available\n- Add _lagrangian_available() helper to detect support\n\n🤖 Generated with [Claude Code](https://claude.com/claude-code)\n\n* test: exclude untestable interactive terminal code from coverage\n\nAdd pragma: no cover to _is_interactive_terminal() and its usage\nsince this code path can only be exercised in an actual interactive\nterminal, not during pytest runs.\n\nRemove tests that were attempting to mock sys.modules which is fragile\nand doesn't provide meaningful coverage.\n\n🤖 Generated with [Claude Code](https://claude.com/claude-code)\n\n* test: exclude interactive/file-based code from coverage\n\nAdd pragma: no cover to code that requires interactive terminals or\nfile I/O that cannot be easily tested in CI:\n\n- RichProgressReporter class methods (require Rich display)\n- ProgressReporter Protocol method (abstract)\n- remesh_2d, remesh_3d, remesh_surface (file-based wrappers)\n- remesh_mesh_lagrangian (requires lagrangian support)\n\n🤖 Generated with [Claude Code](https://claude.com/claude-code)\n\n* test: exclude rich reporter context manager from coverage\n\nAdd pragma: no cover to reporter_ctx branches in _mesh.py that\nonly execute in interactive terminals (Rich progress display).\nThese code paths cannot be tested in CI/pytest environments.\n\n* test: add comprehensive cancellation tests for all phases\n\nAdd tests for CancellationError at init, options, and remesh phases\nfor Mesh.remesh(), Mesh.remesh_levelset(), and Mesh.remesh_lagrangian()\nto improve patch coverage.\n\n* fix: replace abbreviations with full words in progress messages\n\n- 'Disp' -> 'Displacement'\n- 'Disp set' -> 'Displacement set'\n- 'Lagrangian' -> 'Lagrangian remeshing'\n- 'LS remesh' -> 'Level-set remeshing'\n\n* feat: capture MMG warnings from stderr during remeshing\n\nImplement warning capture from MMG library by redirecting stderr during\nremeshing operations:\n\n- Add StderrCapture class for cross-platform stderr capture (POSIX/Windows)\n- Add parse_mmg_warnings() function to extract warnings from MMG output\n- Update build_remesh_result() to accept and include warnings\n- Update remesh methods in MmgMesh, MmgMesh2D, and MmgMeshS classes\n- Add comprehensive tests for warning capture functionality\n\nThe RemeshResult.warnings field now contains actual warning messages from\nMMG, such as edge size clamping or geometric constraint violations.\n\nCloses #116\n\n* fix: add ssize_t typedef for Windows compatibility\n\nWindows MSVC does not define ssize_t by default (it's a POSIX type).\nUse SSIZE_T from BaseTsd.h and typedef it to ssize_t for portability.",
          "timestamp": "2026-01-12T18:02:12+01:00",
          "tree_id": "c1a58080e4964830a78f9824277cfa655023e6e8",
          "url": "https://github.com/kmarchais/mmgpy/commit/c1eba49b31f7117a9ff374114bb504289a8b8174"
        },
        "date": 1768237945637,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 0.6274858307419338,
            "unit": "iter/sec",
            "range": "stddev: 0.025889366786976342",
            "extra": "mean: 1.593661483666665 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.621761667953505,
            "unit": "iter/sec",
            "range": "stddev: 0.01249068808994964",
            "extra": "mean: 1.6083333076666595 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.1587820416633001,
            "unit": "iter/sec",
            "range": "stddev: 0.0018323031526652842",
            "extra": "mean: 862.9750583333285 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.2357347786337949,
            "unit": "iter/sec",
            "range": "stddev: 0.001240600381841307",
            "extra": "mean: 809.2351346666646 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 0.6194861686263833,
            "unit": "iter/sec",
            "range": "stddev: 0.026305941512659508",
            "extra": "mean: 1.6142410446666606 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.6268132164129167,
            "unit": "iter/sec",
            "range": "stddev: 0.03800306314585008",
            "extra": "mean: 1.5953715936666601 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.228415763562094,
            "unit": "iter/sec",
            "range": "stddev: 0.0019138776901957459",
            "extra": "mean: 814.0566326666582 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.225267568264695,
            "unit": "iter/sec",
            "range": "stddev: 0.008171872316419134",
            "extra": "mean: 816.1482650000002 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 1.2953913114575928,
            "unit": "iter/sec",
            "range": "stddev: 0.0043145020137636955",
            "extra": "mean: 771.96750600001 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.2756440393173516,
            "unit": "iter/sec",
            "range": "stddev: 0.009416612160287434",
            "extra": "mean: 783.917746000005 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 118.42436391580485,
            "unit": "iter/sec",
            "range": "stddev: 0.0001212050778211899",
            "extra": "mean: 8.444208327865383 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 1.2076716248231512,
            "unit": "iter/sec",
            "range": "stddev: 0.007626386527338434",
            "extra": "mean: 828.0396586666825 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 1.2117509778889677,
            "unit": "iter/sec",
            "range": "stddev: 0.010625113486516697",
            "extra": "mean: 825.2520676666867 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 16.314494784671606,
            "unit": "iter/sec",
            "range": "stddev: 0.000770273139423259",
            "extra": "mean: 61.29518647059526 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 357.59308282128677,
            "unit": "iter/sec",
            "range": "stddev: 0.0008011181632617999",
            "extra": "mean: 2.796474674818492 msec\nrounds: 409"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 24.678217213853333,
            "unit": "iter/sec",
            "range": "stddev: 0.0006218342615721674",
            "extra": "mean: 40.52156569229973 msec\nrounds: 26"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 163.46464781959997,
            "unit": "iter/sec",
            "range": "stddev: 0.0001779100652901333",
            "extra": "mean: 6.117530691428783 msec\nrounds: 175"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 255.5939289733967,
            "unit": "iter/sec",
            "range": "stddev: 0.00008099789335914382",
            "extra": "mean: 3.912455996183244 msec\nrounds: 262"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 264.40234245098014,
            "unit": "iter/sec",
            "range": "stddev: 0.0007838502840784458",
            "extra": "mean: 3.7821147525778778 msec\nrounds: 291"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 62.73588196972939,
            "unit": "iter/sec",
            "range": "stddev: 0.000391926548398018",
            "extra": "mean: 15.939841261536879 msec\nrounds: 65"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 933.5176610634473,
            "unit": "iter/sec",
            "range": "stddev: 0.00002633936701989663",
            "extra": "mean: 1.0712170124995999 msec\nrounds: 960"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 25.8160023864122,
            "unit": "iter/sec",
            "range": "stddev: 0.0005259773843548372",
            "extra": "mean: 38.735664222216386 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 1989.25832890326,
            "unit": "iter/sec",
            "range": "stddev: 0.000015734596109131887",
            "extra": "mean: 502.69991859294163 usec\nrounds: 2076"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 65.41330236209534,
            "unit": "iter/sec",
            "range": "stddev: 0.00020271482042649613",
            "extra": "mean: 15.28741041790705 msec\nrounds: 67"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 90776.46908825292,
            "unit": "iter/sec",
            "range": "stddev: 9.632499551675111e-7",
            "extra": "mean: 11.016070684879795 usec\nrounds: 92679"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
            "value": 27008.482306538976,
            "unit": "iter/sec",
            "range": "stddev: 0.000001934606014038747",
            "extra": "mean: 37.02540515421304 usec\nrounds: 27550"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
            "value": 6406.935274581131,
            "unit": "iter/sec",
            "range": "stddev: 0.000006056234123176704",
            "extra": "mean: 156.0808650537487 usec\nrounds: 6573"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 26.817520397002934,
            "unit": "iter/sec",
            "range": "stddev: 0.0006310717284566487",
            "extra": "mean: 37.28905525925349 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 26.697360596717147,
            "unit": "iter/sec",
            "range": "stddev: 0.0003167397396999169",
            "extra": "mean: 37.4568862857164 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 26.466321241572935,
            "unit": "iter/sec",
            "range": "stddev: 0.0003541239531529163",
            "extra": "mean: 37.78386844444454 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 3027.290635569317,
            "unit": "iter/sec",
            "range": "stddev: 0.000009244727795305225",
            "extra": "mean: 330.3283762221061 usec\nrounds: 3171"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 2708.0637101032244,
            "unit": "iter/sec",
            "range": "stddev: 0.00000805172842783744",
            "extra": "mean: 369.2675309924236 usec\nrounds: 2791"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 2060.3315833365623,
            "unit": "iter/sec",
            "range": "stddev: 0.000009412276870773537",
            "extra": "mean: 485.3587685049074 usec\nrounds: 2121"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 95.4152370220647,
            "unit": "iter/sec",
            "range": "stddev: 0.00034817816649297396",
            "extra": "mean: 10.480506376237903 msec\nrounds: 101"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 97.80864050347925,
            "unit": "iter/sec",
            "range": "stddev: 0.00014442001906703734",
            "extra": "mean: 10.224045594053912 msec\nrounds: 101"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 93.35367807464533,
            "unit": "iter/sec",
            "range": "stddev: 0.0002028846876378854",
            "extra": "mean: 10.711950730001263 msec\nrounds: 100"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 26.796177030762973,
            "unit": "iter/sec",
            "range": "stddev: 0.00045853458676588184",
            "extra": "mean: 37.318756285718074 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 26.656265352436044,
            "unit": "iter/sec",
            "range": "stddev: 0.0004481378024298614",
            "extra": "mean: 37.51463255555462 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 9026.375144952292,
            "unit": "iter/sec",
            "range": "stddev: 0.000008902982910554432",
            "extra": "mean: 110.78644349932848 usec\nrounds: 7407"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 1040682.6044765849,
            "unit": "iter/sec",
            "range": "stddev: 9.616281948367174e-8",
            "extra": "mean: 960.9077692837515 nsec\nrounds: 108015"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3437867.5191198285,
            "unit": "iter/sec",
            "range": "stddev: 3.952033556151745e-8",
            "extra": "mean: 290.87799178952145 nsec\nrounds: 197239"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1631793.1126194487,
            "unit": "iter/sec",
            "range": "stddev: 7.74875124756093e-8",
            "extra": "mean: 612.8227851107558 nsec\nrounds: 168891"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 151247.11568588394,
            "unit": "iter/sec",
            "range": "stddev: 7.66701584872495e-7",
            "extra": "mean: 6.6116963319607365 usec\nrounds: 172682"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 1096.7567962708033,
            "unit": "iter/sec",
            "range": "stddev: 0.000015758575298686813",
            "extra": "mean: 911.7791687274733 usec\nrounds: 1132"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 118.85412643185946,
            "unit": "iter/sec",
            "range": "stddev: 0.00007360394118150885",
            "extra": "mean: 8.413675065571343 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 18.20712256271593,
            "unit": "iter/sec",
            "range": "stddev: 0.0002336971289124326",
            "extra": "mean: 54.923560631583484 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 117.96284269350555,
            "unit": "iter/sec",
            "range": "stddev: 0.00005953330336262052",
            "extra": "mean: 8.477245691664356 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 106.26828451498355,
            "unit": "iter/sec",
            "range": "stddev: 0.00021313168021443304",
            "extra": "mean: 9.410145318182892 msec\nrounds: 110"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 114.87036744372585,
            "unit": "iter/sec",
            "range": "stddev: 0.0000911465622763551",
            "extra": "mean: 8.705465319329571 msec\nrounds: 119"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 158.1435055717077,
            "unit": "iter/sec",
            "range": "stddev: 0.00006131582649596378",
            "extra": "mean: 6.323370639754572 msec\nrounds: 161"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 1128.2126006168155,
            "unit": "iter/sec",
            "range": "stddev: 0.000016297992810412766",
            "extra": "mean: 886.3577657732956 usec\nrounds: 1157"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 116.14249542120638,
            "unit": "iter/sec",
            "range": "stddev: 0.0002722437052397101",
            "extra": "mean: 8.610112916666424 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 115.76777856890466,
            "unit": "iter/sec",
            "range": "stddev: 0.00009607279609626257",
            "extra": "mean: 8.63798210833598 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 28187.18755828557,
            "unit": "iter/sec",
            "range": "stddev: 0.0000037489252207982017",
            "extra": "mean: 35.477111646282424 usec\nrounds: 29271"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 44.63023923012451,
            "unit": "iter/sec",
            "range": "stddev: 0.01802157378004986",
            "extra": "mean: 22.406332953846686 msec\nrounds: 65"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 3.2139245802153207,
            "unit": "iter/sec",
            "range": "stddev: 0.0057244883102724655",
            "extra": "mean: 311.14606925001453 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.1965623839614703,
            "unit": "iter/sec",
            "range": "stddev: 0.0061716755819840215",
            "extra": "mean: 835.727425000016 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.11676603661696439,
            "unit": "iter/sec",
            "range": "stddev: 0.262924839913397",
            "extra": "mean: 8.56413413499996 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.194748857979617,
            "unit": "iter/sec",
            "range": "stddev: 0.0033741978961856693",
            "extra": "mean: 836.9959873333149 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 2.959327447461301,
            "unit": "iter/sec",
            "range": "stddev: 0.00507071161008921",
            "extra": "mean: 337.9146166666563 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 0.9123037237762275,
            "unit": "iter/sec",
            "range": "stddev: 0.011688658777526726",
            "extra": "mean: 1.096126184666635 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 2.333366096126774,
            "unit": "iter/sec",
            "range": "stddev: 0.0019133959206591661",
            "extra": "mean: 428.5654109999844 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 3.158878228639591,
            "unit": "iter/sec",
            "range": "stddev: 0.0035711085551891003",
            "extra": "mean: 316.568075000049 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.2158562710039056,
            "unit": "iter/sec",
            "range": "stddev: 0.0006440630130057542",
            "extra": "mean: 822.4656350000336 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.2164813486549344,
            "unit": "iter/sec",
            "range": "stddev: 0.004852402368448997",
            "extra": "mean: 822.0430186666666 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 11320.972353816067,
            "unit": "iter/sec",
            "range": "stddev: 0.000004204404271880676",
            "extra": "mean: 88.3316351941201 usec\nrounds: 11502"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 287.7797014692212,
            "unit": "iter/sec",
            "range": "stddev: 0.000026360822265773677",
            "extra": "mean: 3.4748802465727504 msec\nrounds: 292"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 26.501807342835153,
            "unit": "iter/sec",
            "range": "stddev: 0.0015330201513385953",
            "extra": "mean: 37.73327558621594 msec\nrounds: 29"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 16.448166857517684,
            "unit": "iter/sec",
            "range": "stddev: 0.0014537393232265064",
            "extra": "mean: 60.79704861110081 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.419267011620089,
            "unit": "iter/sec",
            "range": "stddev: 0.0019514989779668421",
            "extra": "mean: 184.5268000000336 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 16.260793643804227,
            "unit": "iter/sec",
            "range": "stddev: 0.001711089195511678",
            "extra": "mean: 61.49761333334583 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 20.41052001768976,
            "unit": "iter/sec",
            "range": "stddev: 0.0022038270880933688",
            "extra": "mean: 48.99434209090714 msec\nrounds: 22"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 16.33989184184724,
            "unit": "iter/sec",
            "range": "stddev: 0.002010343813004518",
            "extra": "mean: 61.19991549998834 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 16.052261479892618,
            "unit": "iter/sec",
            "range": "stddev: 0.001815319190104348",
            "extra": "mean: 62.29651823530409 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 25.237834481856023,
            "unit": "iter/sec",
            "range": "stddev: 0.0017227591557009798",
            "extra": "mean: 39.62305088889143 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 16.305922691681978,
            "unit": "iter/sec",
            "range": "stddev: 0.0016772882980373258",
            "extra": "mean: 61.32740961111772 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 16.293461996395607,
            "unit": "iter/sec",
            "range": "stddev: 0.001572830882089615",
            "extra": "mean: 61.37431076472373 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 21496.419670691983,
            "unit": "iter/sec",
            "range": "stddev: 0.0000030185642554151074",
            "extra": "mean: 46.51937463629772 usec\nrounds: 22000"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 44.989453393134106,
            "unit": "iter/sec",
            "range": "stddev: 0.016302406690063595",
            "extra": "mean: 22.227431644070855 msec\nrounds: 59"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 172.68301896846154,
            "unit": "iter/sec",
            "range": "stddev: 0.000029109035562557448",
            "extra": "mean: 5.790957362070662 msec\nrounds: 174"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 13.98501007744408,
            "unit": "iter/sec",
            "range": "stddev: 0.000598889942680461",
            "extra": "mean: 71.50513260000177 msec\nrounds: 15"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
            "value": 1.075022868540442,
            "unit": "iter/sec",
            "range": "stddev: 0.012287938858819321",
            "extra": "mean: 930.2127696666579 msec\nrounds: 3"
          }
        ]
      }
    ]
  }
}