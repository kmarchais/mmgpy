window.BENCHMARK_DATA = {
  "lastUpdate": 1772998801116,
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
          "id": "c110677b8c3afcf3227979de128b8807a3668668",
          "message": "feat(build): add conda-forge package support (#179)\n\n* feat(build): add conda-forge package support\n\nAdd MMGPY_CONDA_BUILD CMake option that skips wheel-specific library\nbundling, RPATH patching, and venv symlinks — conda manages all of\nthese automatically. Add shutil.which() fallback for executable\ndiscovery so conda-installed binaries in PATH are found. Include\nconda-forge recipe files (recipe.yaml, build.sh, bld.bat) for\nlocal testing and future staged-recipes submission.\n\n* fix(build): fix CMake indentation, add conda CI and run_exports\n\n- Deduplicate include(GNUInstallDirs) to a single call after project()\n- Fix indentation in all if(NOT MMGPY_CONDA_BUILD) wrapper blocks\n- Add run_exports so downstream conda packages get compatible MMG libs\n- Pin VTK version in recipe to match pyproject.toml (>=9.5,<9.6)\n- Add conda-build CI workflow (3 platforms x 4 Python versions)\n- Add conda/variants.yaml for Python 3.10-3.13\n\n* fix(conda): move run_exports under requirements section\n\nrattler-build expects run_exports under requirements, not build.\n\n* chore(conda): reduce CI matrix to Python 3.10 and 3.13\n\n* fix(conda): use 'repository' instead of 'dev_url' in recipe\n\nrattler-build uses 'repository' not 'dev_url' in the about section.\n\n* fix(conda): use cmake directly instead of pip for conda builds\n\n- Build with cmake + ninja instead of pip/scikit-build-core (fixes\n  shared lib install paths and RPATH for conda environments)\n- Install Python module and _version.py to Python_SITEARCH for conda\n- Drop pip/scikit-build-core from conda host deps (no longer needed)\n- Fix mmg executable tests (MMG -h returns exit code 2)\n- Use pin_subpackage upper_bound instead of deprecated max_pin\n\n* fix(conda): use vs2022 compiler for Windows builds\n\nGitHub Actions windows-latest has VS2022, not VS2017. Use vs2022_win-64\nexplicitly for Windows while keeping ${{ compiler() }} for Unix.\n\n* refactor(cli): move entry points to lightweight _cli module\n\nCLI entry points (mmg2d, mmg3d, mmgs) previously imported the full\nmmgpy package (VTK, pyvista, numpy, etc.) just to find and run a\nnative executable. On slow Windows CI runners this exceeded the\n10-second subprocess timeout.\n\nMove all CLI functions to mmgpy._cli which only imports stdlib,\nmaking alias commands start instantly. The unified `mmg` command\nlazy-imports heavier deps only when needed for mesh type detection.\n\n* fix(tests): increase entry point timeouts for Windows Python 3.10\n\nWindows CI with Python 3.10 is slower at subprocess startup, causing\nthe 10-second timeout to be exceeded. Increase to 30 seconds for all\nentry point tests in wheel_executable_test.py.\n\n* fix(tests): increase all CLI test timeouts to 30s for Windows Python 3.10\n\n* fix(build): remove duplicate install rules for conda builds\n\nThe root CMakeLists.txt unconditionally installed the Python module\nand source files to ${Python_SITEARCH}, duplicating what\nsrc/CMakeLists.txt already handles. Gate the Python file install\nbehind MMGPY_CONDA_BUILD (needed there since scikit-build-core\nauto-discovers .py files for wheels) and remove the duplicate\ntarget install entirely.\n\n* chore: remove unused _logger from __init__.py",
          "timestamp": "2026-03-08T20:30:23+01:00",
          "tree_id": "4d13b95f1f88fd60ec6e2cdb28c03264f784a8b4",
          "url": "https://github.com/kmarchais/mmgpy/commit/c110677b8c3afcf3227979de128b8807a3668668"
        },
        "date": 1772998799976,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 1.158187759645706,
            "unit": "iter/sec",
            "range": "stddev: 0.013640699004909025",
            "extra": "mean: 863.4178626666748 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.5725062497778348,
            "unit": "iter/sec",
            "range": "stddev: 0.016208885227104584",
            "extra": "mean: 1.7467058226666647 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.199026265973299,
            "unit": "iter/sec",
            "range": "stddev: 0.003460485882938617",
            "extra": "mean: 834.010086666666 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.2849670458036833,
            "unit": "iter/sec",
            "range": "stddev: 0.002231400018082891",
            "extra": "mean: 778.2300746666616 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 1.1824035367802466,
            "unit": "iter/sec",
            "range": "stddev: 0.0004579863986286062",
            "extra": "mean: 845.7349533333248 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.5771994975404453,
            "unit": "iter/sec",
            "range": "stddev: 0.0009038938463624628",
            "extra": "mean: 1.7325032406666783 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.285189295801247,
            "unit": "iter/sec",
            "range": "stddev: 0.000660748426673627",
            "extra": "mean: 778.0954940000129 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.2642375269693082,
            "unit": "iter/sec",
            "range": "stddev: 0.0031206960957723515",
            "extra": "mean: 790.9906000000243 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 30.26360324755548,
            "unit": "iter/sec",
            "range": "stddev: 0.0008271142162459275",
            "extra": "mean: 33.04299199999505 msec\nrounds: 32"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.1038230682003924,
            "unit": "iter/sec",
            "range": "stddev: 0.0076878186838650366",
            "extra": "mean: 905.9422916666714 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 119.95353590860435,
            "unit": "iter/sec",
            "range": "stddev: 0.00006217885660762476",
            "extra": "mean: 8.336561256201113 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 12.467457992593495,
            "unit": "iter/sec",
            "range": "stddev: 0.0009005843802958166",
            "extra": "mean: 80.20881246153522 msec\nrounds: 13"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 1.0516629811055587,
            "unit": "iter/sec",
            "range": "stddev: 0.0015389282878837463",
            "extra": "mean: 950.8749646666766 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 17.790349291692966,
            "unit": "iter/sec",
            "range": "stddev: 0.000756504678800932",
            "extra": "mean: 56.21025105262776 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 380.6308074742552,
            "unit": "iter/sec",
            "range": "stddev: 0.00021389192855881254",
            "extra": "mean: 2.6272177142877147 msec\nrounds: 399"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 29.7006332907006,
            "unit": "iter/sec",
            "range": "stddev: 0.0004065699183404727",
            "extra": "mean: 33.66931574193417 msec\nrounds: 31"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 146.67014233001922,
            "unit": "iter/sec",
            "range": "stddev: 0.0004033602147019115",
            "extra": "mean: 6.818020246751534 msec\nrounds: 154"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 232.8691221314623,
            "unit": "iter/sec",
            "range": "stddev: 0.0005326524025265928",
            "extra": "mean: 4.294257610656802 msec\nrounds: 244"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 271.56026237501163,
            "unit": "iter/sec",
            "range": "stddev: 0.00025598498976539704",
            "extra": "mean: 3.682423898306035 msec\nrounds: 295"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 74.98800544938818,
            "unit": "iter/sec",
            "range": "stddev: 0.00009861374431919304",
            "extra": "mean: 13.335466038964487 msec\nrounds: 77"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 921.0586499546592,
            "unit": "iter/sec",
            "range": "stddev: 0.00003916542113596",
            "extra": "mean: 1.0857071914467409 msec\nrounds: 982"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 33.129853637443006,
            "unit": "iter/sec",
            "range": "stddev: 0.00020320570672634507",
            "extra": "mean: 30.184256499998863 msec\nrounds: 34"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 1972.27696454795,
            "unit": "iter/sec",
            "range": "stddev: 0.000024094217762134964",
            "extra": "mean: 507.0281801061354 usec\nrounds: 2071"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 81.20688217900637,
            "unit": "iter/sec",
            "range": "stddev: 0.00038936106001874737",
            "extra": "mean: 12.314227232559857 msec\nrounds: 86"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 90635.23089021971,
            "unit": "iter/sec",
            "range": "stddev: 0.0000015235254786642873",
            "extra": "mean: 11.033237187989647 usec\nrounds: 93546"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
            "value": 26945.14304311016,
            "unit": "iter/sec",
            "range": "stddev: 0.000002219546649732875",
            "extra": "mean: 37.1124398337792 usec\nrounds: 27474"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
            "value": 6378.851168824798,
            "unit": "iter/sec",
            "range": "stddev: 0.000005195385298351517",
            "extra": "mean: 156.76804075430937 usec\nrounds: 6576"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 34.798765144143466,
            "unit": "iter/sec",
            "range": "stddev: 0.00013758160755145254",
            "extra": "mean: 28.736651885714892 msec\nrounds: 35"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 34.789221569181606,
            "unit": "iter/sec",
            "range": "stddev: 0.0001065049441214704",
            "extra": "mean: 28.74453508571345 msec\nrounds: 35"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 33.210179957867155,
            "unit": "iter/sec",
            "range": "stddev: 0.00016541049189556134",
            "extra": "mean: 30.111249058832943 msec\nrounds: 34"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 3153.5818618412013,
            "unit": "iter/sec",
            "range": "stddev: 0.000010159288100997063",
            "extra": "mean: 317.0997436597874 usec\nrounds: 3273"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 2822.461234541078,
            "unit": "iter/sec",
            "range": "stddev: 0.000010638048106283434",
            "extra": "mean: 354.30070314591813 usec\nrounds: 2924"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 2118.9814290953514,
            "unit": "iter/sec",
            "range": "stddev: 0.000011456076247307403",
            "extra": "mean: 471.9248532663763 usec\nrounds: 2174"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 136.75096407559138,
            "unit": "iter/sec",
            "range": "stddev: 0.00040510033005100083",
            "extra": "mean: 7.312562706667525 msec\nrounds: 150"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 136.28956608197927,
            "unit": "iter/sec",
            "range": "stddev: 0.0004349995526852019",
            "extra": "mean: 7.337318833332347 msec\nrounds: 150"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 135.63589656689973,
            "unit": "iter/sec",
            "range": "stddev: 0.000435611153569449",
            "extra": "mean: 7.372679543624868 msec\nrounds: 149"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 34.820349682068496,
            "unit": "iter/sec",
            "range": "stddev: 0.00016918377947369457",
            "extra": "mean: 28.718838527775386 msec\nrounds: 36"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 34.73649078527549,
            "unit": "iter/sec",
            "range": "stddev: 0.00015503081460543057",
            "extra": "mean: 28.78816994444043 msec\nrounds: 36"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 7479.245891323546,
            "unit": "iter/sec",
            "range": "stddev: 0.000006031945207322366",
            "extra": "mean: 133.70331909532092 usec\nrounds: 9950"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 1019373.6763802178,
            "unit": "iter/sec",
            "range": "stddev: 9.848809398023061e-8",
            "extra": "mean: 980.9945294555639 nsec\nrounds: 106406"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3362296.568996537,
            "unit": "iter/sec",
            "range": "stddev: 4.481665867345251e-8",
            "extra": "mean: 297.41576314859276 nsec\nrounds: 196117"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1611528.7871335247,
            "unit": "iter/sec",
            "range": "stddev: 7.642434471126598e-8",
            "extra": "mean: 620.5287848309124 nsec\nrounds: 166890"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 154263.29700632294,
            "unit": "iter/sec",
            "range": "stddev: 8.840873087491551e-7",
            "extra": "mean: 6.482423359323197 usec\nrounds: 173883"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 1050.829152057758,
            "unit": "iter/sec",
            "range": "stddev: 0.000027951741801817425",
            "extra": "mean: 951.6294804362601 usec\nrounds: 1099"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 119.01043741896645,
            "unit": "iter/sec",
            "range": "stddev: 0.00016516244506547514",
            "extra": "mean: 8.402624355371305 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 18.3510276872002,
            "unit": "iter/sec",
            "range": "stddev: 0.00013327136554752112",
            "extra": "mean: 54.492860947373416 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 117.40807659570896,
            "unit": "iter/sec",
            "range": "stddev: 0.00010349727251272428",
            "extra": "mean: 8.517301611570291 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 107.56780799773392,
            "unit": "iter/sec",
            "range": "stddev: 0.0000857904364343974",
            "extra": "mean: 9.29646163302934 msec\nrounds: 109"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 117.58537641706567,
            "unit": "iter/sec",
            "range": "stddev: 0.00006411655979024441",
            "extra": "mean: 8.504458891665934 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 156.871604944998,
            "unit": "iter/sec",
            "range": "stddev: 0.0001259114984695124",
            "extra": "mean: 6.374639950618327 msec\nrounds: 162"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 1074.4001995551016,
            "unit": "iter/sec",
            "range": "stddev: 0.00002228698853809913",
            "extra": "mean: 930.7518747800774 usec\nrounds: 1134"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 119.32858715210912,
            "unit": "iter/sec",
            "range": "stddev: 0.00006341112460793098",
            "extra": "mean: 8.38022157025367 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 118.77902466080343,
            "unit": "iter/sec",
            "range": "stddev: 0.00008869611997900994",
            "extra": "mean: 8.418994876037198 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 28186.036335926365,
            "unit": "iter/sec",
            "range": "stddev: 0.0000023737063783902864",
            "extra": "mean: 35.478560663224016 usec\nrounds: 29194"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 49.092737052418464,
            "unit": "iter/sec",
            "range": "stddev: 0.014630156898673228",
            "extra": "mean: 20.369611882349446 msec\nrounds: 68"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 3.333553020033344,
            "unit": "iter/sec",
            "range": "stddev: 0.0032733005535444133",
            "extra": "mean: 299.9802294999938 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.2307824176876467,
            "unit": "iter/sec",
            "range": "stddev: 0.024795248038990265",
            "extra": "mean: 812.4912946666617 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.12841054196694163,
            "unit": "iter/sec",
            "range": "stddev: 0.22511640022827886",
            "extra": "mean: 7.787522618333337 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.24724514987373,
            "unit": "iter/sec",
            "range": "stddev: 0.030354996166621184",
            "extra": "mean: 801.766998333278 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 3.086139397801236,
            "unit": "iter/sec",
            "range": "stddev: 0.0010619430071548322",
            "extra": "mean: 324.02943324999 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 1.0383774701036141,
            "unit": "iter/sec",
            "range": "stddev: 0.00020782029822024372",
            "extra": "mean: 963.0409256666704 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 2.367177252360067,
            "unit": "iter/sec",
            "range": "stddev: 0.008737564730350304",
            "extra": "mean: 422.44407300002723 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 3.26160940636035,
            "unit": "iter/sec",
            "range": "stddev: 0.0033574399741195787",
            "extra": "mean: 306.59710449998556 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.2300438687273785,
            "unit": "iter/sec",
            "range": "stddev: 0.026204828621224075",
            "extra": "mean: 812.979134666648 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.2304317779763319,
            "unit": "iter/sec",
            "range": "stddev: 0.025374135222712448",
            "extra": "mean: 812.7228326666606 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 11421.824633467551,
            "unit": "iter/sec",
            "range": "stddev: 0.0000034271026304183434",
            "extra": "mean: 87.55168566236426 usec\nrounds: 11599"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 292.87088661523603,
            "unit": "iter/sec",
            "range": "stddev: 0.000028638211831406436",
            "extra": "mean: 3.4144739054031223 msec\nrounds: 296"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 30.48498887949244,
            "unit": "iter/sec",
            "range": "stddev: 0.001362118014982581",
            "extra": "mean: 32.80302984373762 msec\nrounds: 32"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 18.20981346111102,
            "unit": "iter/sec",
            "range": "stddev: 0.001405325751042883",
            "extra": "mean: 54.91544447369578 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.627486040439809,
            "unit": "iter/sec",
            "range": "stddev: 0.0015868635635631343",
            "extra": "mean: 177.69924133331946 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 18.122537869027198,
            "unit": "iter/sec",
            "range": "stddev: 0.0016374126148061326",
            "extra": "mean: 55.17990952630738 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 22.335763761000766,
            "unit": "iter/sec",
            "range": "stddev: 0.0018780805170918046",
            "extra": "mean: 44.77124716666481 msec\nrounds: 24"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 18.346657775395467,
            "unit": "iter/sec",
            "range": "stddev: 0.0014675694619126227",
            "extra": "mean: 54.50584036843434 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 17.931790135554674,
            "unit": "iter/sec",
            "range": "stddev: 0.001365609325055064",
            "extra": "mean: 55.76688063157881 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 30.405556601790394,
            "unit": "iter/sec",
            "range": "stddev: 0.00144118001189655",
            "extra": "mean: 32.88872534374576 msec\nrounds: 32"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 18.125801545605803,
            "unit": "iter/sec",
            "range": "stddev: 0.0018513070149329136",
            "extra": "mean: 55.1699739999872 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 18.221005706466354,
            "unit": "iter/sec",
            "range": "stddev: 0.0013881976030896877",
            "extra": "mean: 54.8817126842299 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 21641.93043906636,
            "unit": "iter/sec",
            "range": "stddev: 0.00000567211533926844",
            "extra": "mean: 46.20659893605777 usec\nrounds: 22176"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 48.761152224078245,
            "unit": "iter/sec",
            "range": "stddev: 0.013318407897676675",
            "extra": "mean: 20.508128999999315 msec\nrounds: 62"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 172.5081139488902,
            "unit": "iter/sec",
            "range": "stddev: 0.000029707520748051924",
            "extra": "mean: 5.796828781608932 msec\nrounds: 174"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.549879430096425,
            "unit": "iter/sec",
            "range": "stddev: 0.00018883234814336185",
            "extra": "mean: 68.72909186666523 msec\nrounds: 15"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
            "value": 1.1679329175398105,
            "unit": "iter/sec",
            "range": "stddev: 0.001963257690600262",
            "extra": "mean: 856.2135589999874 msec\nrounds: 3"
          }
        ]
      }
    ]
  }
}