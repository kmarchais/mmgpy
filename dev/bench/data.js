window.BENCHMARK_DATA = {
  "lastUpdate": 1768235372212,
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
          "id": "1f5fc27cb090682607f2d20328d654fd6fe216bc",
          "message": "feat(progress): add progress callbacks with cancellation support (#149)\n\n* feat(logging): add file logging support and external logger integration\n\nAdd the ability to log mmgpy output to a file with rotation support,\nand enable integration with external logging frameworks.\n\nNew functions:\n- set_log_file(): Enable file logging with RotatingFileHandler\n- get_log_file(): Get current log file path\n- configure_logging(): Disable Rich console handler for custom setups\n- get_logger(): Now publicly exported for external logger integration\n\nFeatures:\n- Log rotation with configurable max_bytes and backup_count\n- Different log levels for file and console handlers\n- Auto-creation of parent directories for log files\n- Full compatibility with external loggers (structlog, loguru, etc.)\n\nCloses #121\n\n* fix(logging): flush file handlers in tests for reliable assertions\n\nAdd handler.flush() calls after logging messages in tests to ensure\nfile content is written before reading. This fixes flaky test failures\nin CI where file content wasn't immediately available.\n\nAlso includes minor formatting fixes from pre-commit hooks.\n\n* fix(logging): use NOTSET level for file handler by default\n\nUse logging.NOTSET (0) as default file handler level instead of the\nlogger's current level. This allows the file handler to defer to the\nlogger's level, so changes to set_log_level() affect file output.\n\nPreviously, set_log_file() captured the logger's level at creation\ntime (default WARNING), so subsequent set_log_level(\"INFO\") calls\nwouldn't affect file output.\n\n* feat(progress): add progress callbacks with cancellation support\n\nAdd support for progress callbacks during remeshing operations with:\n\n- Progress percentage (0.0-1.0) in ProgressEvent via new progress field\n- Callback return value (bool) for cancellation support\n- CancellationError exception raised when callback returns False\n- Updated all progress reporters (Logging, Rich) to return True\n- Enhanced rich_progress with percentage display support\n- Backwards compatibility with callbacks that return None\n\nCloses #126\n\n🤖 Generated with [Claude Code](https://claude.com/claude-code)\n\n* feat(mesh): add default progress bar to remesh methods\n\nAdd progress parameter to Mesh.remesh(), remesh_lagrangian(),\nremesh_levelset(), remesh_optimize(), and remesh_uniform() methods.\n\n- progress=True (default): Shows Rich progress bar in interactive terminals\n- progress=False: No progress reporting\n- progress=callable: Uses custom callback for progress/cancellation\n\nThe progress bar is automatically disabled in:\n- CI environments (detected via CI, GITHUB_ACTIONS, etc. env vars)\n- pytest runs\n- Non-TTY outputs (piped commands, redirected output)\n\nThis allows users to see remeshing progress by default without any code\nchanges, while not affecting automated testing or CI pipelines.\n\n🤖 Generated with [Claude Code](https://claude.com/claude-code)\n\n* test(progress): add tests for Mesh.remesh progress parameter\n\nAdd tests for the new progress parameter in Mesh.remesh() and the\nhelper functions _is_interactive_terminal() and _resolve_progress_callback().\n\nTests cover:\n- progress=False disables progress bar\n- progress=None disables progress bar\n- progress=callable uses custom callback\n- Cancellation via callback returning False\n- Details reported in completion event\n- Interactive terminal detection in pytest environment\n- Progress callback resolution logic\n\n🤖 Generated with [Claude Code](https://claude.com/claude-code)\n\n* test(progress): add coverage for interactive terminal detection\n\nAdd tests that mock the environment to cover all branches in\n_is_interactive_terminal() and _resolve_progress_callback():\n\n- CI environment variable detection (CI, GITHUB_ACTIONS)\n- Non-TTY stdout detection\n- Interactive terminal with RichProgressReporter creation\n\nThese tests temporarily remove pytest from sys.modules to test\nthe non-pytest code paths.\n\n🤖 Generated with [Claude Code](https://claude.com/claude-code)\n\n* test(progress): add tests for remesh_levelset and remesh_lagrangian progress\n\nAdd coverage tests for progress parameter in:\n- Mesh.remesh_levelset() with callback\n- Mesh.remesh_levelset() cancellation\n- Mesh.remesh_lagrangian() with callback\n- Mesh.remesh_lagrangian() cancellation\n\n🤖 Generated with [Claude Code](https://claude.com/claude-code)\n\n* fix(test): fix levelset shape and remove lagrangian tests\n\n- Fix levelset array shape to Nx1 as required by the API\n- Remove lagrangian tests as they require complex setup (lag parameter)\n\n🤖 Generated with [Claude Code](https://claude.com/claude-code)\n\n* test(progress): restore lagrangian tests with skipif\n\n- Add back lagrangian progress tests\n- Use pytest.mark.skipif to skip if lagrangian not available\n- Add _lagrangian_available() helper to detect support\n\n🤖 Generated with [Claude Code](https://claude.com/claude-code)\n\n* test: exclude untestable interactive terminal code from coverage\n\nAdd pragma: no cover to _is_interactive_terminal() and its usage\nsince this code path can only be exercised in an actual interactive\nterminal, not during pytest runs.\n\nRemove tests that were attempting to mock sys.modules which is fragile\nand doesn't provide meaningful coverage.\n\n🤖 Generated with [Claude Code](https://claude.com/claude-code)\n\n* test: exclude interactive/file-based code from coverage\n\nAdd pragma: no cover to code that requires interactive terminals or\nfile I/O that cannot be easily tested in CI:\n\n- RichProgressReporter class methods (require Rich display)\n- ProgressReporter Protocol method (abstract)\n- remesh_2d, remesh_3d, remesh_surface (file-based wrappers)\n- remesh_mesh_lagrangian (requires lagrangian support)\n\n🤖 Generated with [Claude Code](https://claude.com/claude-code)\n\n* test: exclude rich reporter context manager from coverage\n\nAdd pragma: no cover to reporter_ctx branches in _mesh.py that\nonly execute in interactive terminals (Rich progress display).\nThese code paths cannot be tested in CI/pytest environments.\n\n* test: add comprehensive cancellation tests for all phases\n\nAdd tests for CancellationError at init, options, and remesh phases\nfor Mesh.remesh(), Mesh.remesh_levelset(), and Mesh.remesh_lagrangian()\nto improve patch coverage.\n\n* fix: replace abbreviations with full words in progress messages\n\n- 'Disp' -> 'Displacement'\n- 'Disp set' -> 'Displacement set'\n- 'Lagrangian' -> 'Lagrangian remeshing'\n- 'LS remesh' -> 'Level-set remeshing'",
          "timestamp": "2026-01-12T17:19:23+01:00",
          "tree_id": "20ebd6ef55f261b678e26cba5b2c7dab7abd22d0",
          "url": "https://github.com/kmarchais/mmgpy/commit/1f5fc27cb090682607f2d20328d654fd6fe216bc"
        },
        "date": 1768235371831,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 0.6335108058951776,
            "unit": "iter/sec",
            "range": "stddev: 0.02118884890195158",
            "extra": "mean: 1.5785050400000007 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.6252310676877366,
            "unit": "iter/sec",
            "range": "stddev: 0.014938967025838933",
            "extra": "mean: 1.5994086853333347 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.2041602213589335,
            "unit": "iter/sec",
            "range": "stddev: 0.004586112246941428",
            "extra": "mean: 830.4542720000067 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.2417671556768706,
            "unit": "iter/sec",
            "range": "stddev: 0.0068677367586103535",
            "extra": "mean: 805.3039536666707 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 0.6215056769100267,
            "unit": "iter/sec",
            "range": "stddev: 0.020534170086219567",
            "extra": "mean: 1.6089957616666577 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.6223078425988579,
            "unit": "iter/sec",
            "range": "stddev: 0.00838098523432538",
            "extra": "mean: 1.6069217380000207 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.24045769903727,
            "unit": "iter/sec",
            "range": "stddev: 0.0018532450331418483",
            "extra": "mean: 806.154051666662 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.2446846473387803,
            "unit": "iter/sec",
            "range": "stddev: 0.004623325688811572",
            "extra": "mean: 803.4163529999887 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 1.2942423056354493,
            "unit": "iter/sec",
            "range": "stddev: 0.007043568188165623",
            "extra": "mean: 772.6528453333307 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.2824232998975424,
            "unit": "iter/sec",
            "range": "stddev: 0.014826019999617688",
            "extra": "mean: 779.7737299999881 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 120.33591883271717,
            "unit": "iter/sec",
            "range": "stddev: 0.0000684797754532434",
            "extra": "mean: 8.310070756098453 msec\nrounds: 123"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 1.2219549341985492,
            "unit": "iter/sec",
            "range": "stddev: 0.009884626441156766",
            "extra": "mean: 818.3607856666791 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 1.2180505384369664,
            "unit": "iter/sec",
            "range": "stddev: 0.004009343830339197",
            "extra": "mean: 820.9839973333336 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 16.402756256638,
            "unit": "iter/sec",
            "range": "stddev: 0.0018345503037833046",
            "extra": "mean: 60.96536364705852 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 362.96546717597903,
            "unit": "iter/sec",
            "range": "stddev: 0.00035854650073238135",
            "extra": "mean: 2.7550830325000675 msec\nrounds: 400"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 23.840796440675422,
            "unit": "iter/sec",
            "range": "stddev: 0.0006777514897188373",
            "extra": "mean: 41.9449074399995 msec\nrounds: 25"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 164.34530426978517,
            "unit": "iter/sec",
            "range": "stddev: 0.00019129763242133898",
            "extra": "mean: 6.084749451425913 msec\nrounds: 175"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 236.92731626500367,
            "unit": "iter/sec",
            "range": "stddev: 0.00005622193733355617",
            "extra": "mean: 4.220703698350671 msec\nrounds: 242"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 270.62488023011565,
            "unit": "iter/sec",
            "range": "stddev: 0.00020339816607165673",
            "extra": "mean: 3.69515175082826 msec\nrounds: 301"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 62.74298403030314,
            "unit": "iter/sec",
            "range": "stddev: 0.0004638213117434653",
            "extra": "mean: 15.938036984613726 msec\nrounds: 65"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 911.9843787963697,
            "unit": "iter/sec",
            "range": "stddev: 0.000021407514405152243",
            "extra": "mean: 1.096510009655859 msec\nrounds: 932"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 26.04654552476007,
            "unit": "iter/sec",
            "range": "stddev: 0.0004642605860836947",
            "extra": "mean: 38.39280717857158 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 1974.4991906260607,
            "unit": "iter/sec",
            "range": "stddev: 0.00002198319663813113",
            "extra": "mean: 506.4575385735797 usec\nrounds: 2061"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 65.93943268778514,
            "unit": "iter/sec",
            "range": "stddev: 0.0002167384863180525",
            "extra": "mean: 15.165432264709848 msec\nrounds: 68"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 90764.55279579919,
            "unit": "iter/sec",
            "range": "stddev: 9.872114264658205e-7",
            "extra": "mean: 11.017516962263736 usec\nrounds: 92765"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
            "value": 27368.976203203645,
            "unit": "iter/sec",
            "range": "stddev: 0.0000033352024826472752",
            "extra": "mean: 36.5377203946323 usec\nrounds: 27968"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
            "value": 6412.505260612827,
            "unit": "iter/sec",
            "range": "stddev: 0.000004302254457907535",
            "extra": "mean: 155.9452911707136 usec\nrounds: 6546"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 27.86224920517699,
            "unit": "iter/sec",
            "range": "stddev: 0.0004522331299362558",
            "extra": "mean: 35.89085693104035 msec\nrounds: 29"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 27.38773133577755,
            "unit": "iter/sec",
            "range": "stddev: 0.00044354254564107025",
            "extra": "mean: 36.51269934482178 msec\nrounds: 29"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 26.87111717394613,
            "unit": "iter/sec",
            "range": "stddev: 0.000525478441520372",
            "extra": "mean: 37.21467900000773 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 3720.3920869674917,
            "unit": "iter/sec",
            "range": "stddev: 0.000007514270471673282",
            "extra": "mean: 268.78887402835664 usec\nrounds: 3858"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 3236.8851085744304,
            "unit": "iter/sec",
            "range": "stddev: 0.000007885471919231808",
            "extra": "mean: 308.9389849985791 usec\nrounds: 3333"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 2285.2005893821965,
            "unit": "iter/sec",
            "range": "stddev: 0.000011402996701696718",
            "extra": "mean: 437.59834679123276 usec\nrounds: 2353"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 101.63271312596113,
            "unit": "iter/sec",
            "range": "stddev: 0.00017628485280267355",
            "extra": "mean: 9.839351614677689 msec\nrounds: 109"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 101.30697645098067,
            "unit": "iter/sec",
            "range": "stddev: 0.0002451473855453798",
            "extra": "mean: 9.87098850476373 msec\nrounds: 105"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 98.46840696505365,
            "unit": "iter/sec",
            "range": "stddev: 0.00016055631573348603",
            "extra": "mean: 10.15554156730594 msec\nrounds: 104"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 27.420991693429613,
            "unit": "iter/sec",
            "range": "stddev: 0.0005405582831346814",
            "extra": "mean: 36.46841117856476 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 27.01845231955558,
            "unit": "iter/sec",
            "range": "stddev: 0.0005689270398986313",
            "extra": "mean: 37.011742500003 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 8873.253522417926,
            "unit": "iter/sec",
            "range": "stddev: 0.000004344279797734043",
            "extra": "mean: 112.69823379592832 usec\nrounds: 9149"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 1040347.3236182146,
            "unit": "iter/sec",
            "range": "stddev: 8.798639090593892e-8",
            "extra": "mean: 961.2174485364263 nsec\nrounds: 107562"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3472076.816379413,
            "unit": "iter/sec",
            "range": "stddev: 3.8085660664251944e-8",
            "extra": "mean: 288.012061047305 nsec\nrounds: 191242"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1546645.6423168185,
            "unit": "iter/sec",
            "range": "stddev: 7.055425786772229e-8",
            "extra": "mean: 646.5605130481192 nsec\nrounds: 167197"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 152962.86685785008,
            "unit": "iter/sec",
            "range": "stddev: 8.187536154739268e-7",
            "extra": "mean: 6.537534373811848 usec\nrounds: 157184"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 1304.0547882359276,
            "unit": "iter/sec",
            "range": "stddev: 0.000017042358040793483",
            "extra": "mean: 766.8389465083437 usec\nrounds: 1346"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 117.84075809450344,
            "unit": "iter/sec",
            "range": "stddev: 0.00012950749923624342",
            "extra": "mean: 8.486028231403951 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 18.28889847479522,
            "unit": "iter/sec",
            "range": "stddev: 0.00018447000580538384",
            "extra": "mean: 54.677978631580594 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 118.80365613711307,
            "unit": "iter/sec",
            "range": "stddev: 0.00009623685269927946",
            "extra": "mean: 8.417249371903884 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 108.41118339604972,
            "unit": "iter/sec",
            "range": "stddev: 0.00007311596752877503",
            "extra": "mean: 9.22414061607262 msec\nrounds: 112"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 120.56943509311955,
            "unit": "iter/sec",
            "range": "stddev: 0.00008337765272967181",
            "extra": "mean: 8.293975991740101 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 163.66089789277763,
            "unit": "iter/sec",
            "range": "stddev: 0.00010815255385465236",
            "extra": "mean: 6.110195000000242 msec\nrounds: 167"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 1433.2482441580216,
            "unit": "iter/sec",
            "range": "stddev: 0.000014845118967943287",
            "extra": "mean: 697.7158381850742 usec\nrounds: 1477"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 121.32874280296035,
            "unit": "iter/sec",
            "range": "stddev: 0.00008047112561206389",
            "extra": "mean: 8.242070072579708 msec\nrounds: 124"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 119.95140154337535,
            "unit": "iter/sec",
            "range": "stddev: 0.0000901467290090764",
            "extra": "mean: 8.336709593496431 msec\nrounds: 123"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 28487.435376819616,
            "unit": "iter/sec",
            "range": "stddev: 0.000002496132282672953",
            "extra": "mean: 35.10319503221078 usec\nrounds: 29067"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 46.28915077697411,
            "unit": "iter/sec",
            "range": "stddev: 0.016872421114690745",
            "extra": "mean: 21.60333432812589 msec\nrounds: 64"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 3.1182441753902372,
            "unit": "iter/sec",
            "range": "stddev: 0.005310950737282466",
            "extra": "mean: 320.69329524999546 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.2258730350254599,
            "unit": "iter/sec",
            "range": "stddev: 0.009941746104912635",
            "extra": "mean: 815.7451639999825 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.13686736659063023,
            "unit": "iter/sec",
            "range": "stddev: 0.1094389967546697",
            "extra": "mean: 7.306343542000017 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.2497960744198222,
            "unit": "iter/sec",
            "range": "stddev: 0.006398138365313836",
            "extra": "mean: 800.1305336666368 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 3.0040295173266722,
            "unit": "iter/sec",
            "range": "stddev: 0.0017276427857982174",
            "extra": "mean: 332.8862097500007 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 1.0202487306618628,
            "unit": "iter/sec",
            "range": "stddev: 0.0033015885978303775",
            "extra": "mean: 980.1531430000144 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 2.368548557210169,
            "unit": "iter/sec",
            "range": "stddev: 0.004811461056605042",
            "extra": "mean: 422.1994929999937 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 3.219133001982118,
            "unit": "iter/sec",
            "range": "stddev: 0.005270272313822815",
            "extra": "mean: 310.6426480000266 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.2518088455262064,
            "unit": "iter/sec",
            "range": "stddev: 0.005493146558748068",
            "extra": "mean: 798.844011666688 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.2564140150103849,
            "unit": "iter/sec",
            "range": "stddev: 0.003317228474358076",
            "extra": "mean: 795.9159863333222 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 11416.70692327757,
            "unit": "iter/sec",
            "range": "stddev: 0.00000312005274981695",
            "extra": "mean: 87.59093201920564 usec\nrounds: 11562"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 288.0128989064035,
            "unit": "iter/sec",
            "range": "stddev: 0.00005349407095132318",
            "extra": "mean: 3.4720667157514122 msec\nrounds: 292"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 26.972422752290598,
            "unit": "iter/sec",
            "range": "stddev: 0.0013132540663075589",
            "extra": "mean: 37.07490458620653 msec\nrounds: 29"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 16.834868183694052,
            "unit": "iter/sec",
            "range": "stddev: 0.0014594300187818086",
            "extra": "mean: 59.40052450001253 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.4467581748668445,
            "unit": "iter/sec",
            "range": "stddev: 0.001926491823837506",
            "extra": "mean: 183.5954466666673 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 17.099126208995468,
            "unit": "iter/sec",
            "range": "stddev: 0.0011848829294118376",
            "extra": "mean: 58.482520555578 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 20.500734178351447,
            "unit": "iter/sec",
            "range": "stddev: 0.0018014237648101912",
            "extra": "mean: 48.77874086363156 msec\nrounds: 22"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 16.564380141490425,
            "unit": "iter/sec",
            "range": "stddev: 0.0018732357745895687",
            "extra": "mean: 60.37050535294116 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 16.583027312448856,
            "unit": "iter/sec",
            "range": "stddev: 0.0015749636647041797",
            "extra": "mean: 60.30262033333934 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 26.373201564217656,
            "unit": "iter/sec",
            "range": "stddev: 0.0014846297387136162",
            "extra": "mean: 37.91727741378086 msec\nrounds: 29"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 16.465315449403025,
            "unit": "iter/sec",
            "range": "stddev: 0.0013659836363493418",
            "extra": "mean: 60.73372861108813 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 17.110645602899893,
            "unit": "iter/sec",
            "range": "stddev: 0.0012942491043651232",
            "extra": "mean: 58.44314838889078 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 21715.719814067364,
            "unit": "iter/sec",
            "range": "stddev: 0.0000023144132393378942",
            "extra": "mean: 46.049590276634696 usec\nrounds: 22132"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 46.787368505174086,
            "unit": "iter/sec",
            "range": "stddev: 0.01392869751680288",
            "extra": "mean: 21.3732900983609 msec\nrounds: 61"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 173.47906342597372,
            "unit": "iter/sec",
            "range": "stddev: 0.000024610853624366464",
            "extra": "mean: 5.764384359999245 msec\nrounds: 175"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.62835454061839,
            "unit": "iter/sec",
            "range": "stddev: 0.0001146985007384159",
            "extra": "mean: 68.36038853333169 msec\nrounds: 15"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
            "value": 1.1769919167267513,
            "unit": "iter/sec",
            "range": "stddev: 0.006190368318215715",
            "extra": "mean: 849.6235069999708 msec\nrounds: 3"
          }
        ]
      }
    ]
  }
}