window.BENCHMARK_DATA = {
  "lastUpdate": 1768826551723,
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
          "id": "427a32dadfd2a6f4ef5eda180aee7173dd57342d",
          "message": "fix(build): Windows executable support and uvx entry point (#164)\n\n* fix(build): Windows executable support and uvx entry point\n\n- Fix Windows symlink creation: use Scripts dir and copy instead of ln\n- Add _find_mmg_executable() helper that checks PATH first, then package dir\n- Add __main__.py for `uvx mmgpy` and `python -m mmgpy` support\n\nThe Windows CI was failing because:\n1. Symlink code used `ln -sf` which doesn't exist on Windows\n2. Venv bin directory is `Scripts` on Windows, not `bin`\n3. Executables weren't being found in editable installs\n\nNow the executable lookup:\n1. First checks PATH (for dev installs with symlinks/copies)\n2. Then checks package_dir/bin (for wheel installs)\n3. Falls back to site-packages/mmgpy/bin\n\n* fix: remove conflicting _O3 entry points and update tests\n\n- Remove mmg2d_O3, mmg3d_O3, mmgs_O3 Python entry points that\n  conflicted with native executable names in mmgpy/bin/\n- Keep shorter wrapper names (mmg2d, mmg3d, mmgs, mmg)\n- Update tests to use mmgpy._find_mmg_executable() to locate\n  executables instead of relying on PATH lookup\n- This fixes the infinite recursion issue on Windows where\n  shutil.which() found Python entry points instead of native exes\n\n* fix: update executable lookup for Windows editable installs\n\n- Fix CMakeLists.txt to use CMAKE_INSTALL_PREFIX for venv symlink source\n  instead of SITE_PACKAGES_DIR which doesn't exist for editable installs\n- Update _find_mmg_executable() to also check venv bin/Scripts directory\n  as fallback, with size check to avoid Python entry point scripts\n\n* fix: add build directory fallback for editable installs\n\nFor editable installs with scikit-build-core, executables are in\nthe build directory rather than site-packages. Add fallback to\nsearch build/*/mmgpy/bin/ for executables.\n\n* fix: update CLI tests to handle missing executables\n\nCLI tests now accept \"not found\" as a valid response when executables\naren't available (common for editable installs on Windows where\nbuild directory paths may not be accessible).\n\n* ci: add TestPyPI publishing and uvx verification workflow\n\nAdd workflow_dispatch option to publish to TestPyPI for testing.\nWhen enabled, builds all wheels, publishes to TestPyPI, then verifies\nuvx mmgpy works on Linux, macOS, and Windows.\n\n* chore: bump version to 0.5.0.dev1 for TestPyPI\n\n* chore: bump to 0.5.0.dev2, add verbose logging, disable attestations for TestPyPI\n\n* chore: bump to 0.5.0.dev3, restore all platforms for TestPyPI\n\n* fix: add mmgpy entry point for uvx support, remove duplicate mmgpy-ui\n\n- Added 'mmgpy' console script entry point pointing to _run_mmg\n- Removed duplicate mmgpy-ui from [project.scripts] (kept in gui-scripts)\n- Bump version to 0.5.0.dev4\n\n* feat(ui): make desktop app the default mode with maximized window\n\n- Change default exec_mode from browser to desktop app\n- Add pywebview dependency for desktop mode support\n- Open window maximized by default in desktop mode\n- Add --browser flag to run in browser mode instead\n- Update CLAUDE.md with new UI development workflow\n\n* fix: pin version in uvx test to avoid TestPyPI CDN cache\n\nUse --from \"mmgpy==$VERSION\" to ensure uvx installs the exact version\njust uploaded rather than a potentially cached older version.\n\n* fix: add --index-strategy unsafe-best-match for TestPyPI resolution\n\nuv's default index strategy prevents finding packages on TestPyPI when\nthe same package exists on PyPI. Using unsafe-best-match allows uv to\ncheck all indexes for the best matching version.\n\n* fix: use Python 3.12 in uvx tests (VTK doesn't support 3.14 yet)\n\n* fix: run uv from /tmp to avoid local project detection\n\n* docs: add uvx usage and update installation instructions\n\n- Add \"Try It\" section showing uvx commands for CLI and UI\n- Update installation section with UI support options\n\n* fix: use _find_mmg_executable in benchmarks for portable exe paths\n\nThe _O3 executables are installed inside the package at mmgpy/bin/,\nnot directly on PATH. Use the helper function to locate them.",
          "timestamp": "2026-01-19T13:32:54+01:00",
          "tree_id": "ac1165bc3ea7b249b93bbdb7ec0e6ee55531dcf7",
          "url": "https://github.com/kmarchais/mmgpy/commit/427a32dadfd2a6f4ef5eda180aee7173dd57342d"
        },
        "date": 1768826551311,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 1.0934794507447725,
            "unit": "iter/sec",
            "range": "stddev: 0.010845710076676868",
            "extra": "mean: 914.5119273333364 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.5783372457298646,
            "unit": "iter/sec",
            "range": "stddev: 0.03321678257055221",
            "extra": "mean: 1.7290949309999821 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.0943667142882818,
            "unit": "iter/sec",
            "range": "stddev: 0.025841221905221604",
            "extra": "mean: 913.7704820000371 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.1836878809246423,
            "unit": "iter/sec",
            "range": "stddev: 0.0031321625372533104",
            "extra": "mean: 844.8173003332992 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 1.088560918941864,
            "unit": "iter/sec",
            "range": "stddev: 0.0048832098043250045",
            "extra": "mean: 918.644039666655 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.6039554669377816,
            "unit": "iter/sec",
            "range": "stddev: 0.02504322978480793",
            "extra": "mean: 1.6557512180000156 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.2103315694055268,
            "unit": "iter/sec",
            "range": "stddev: 0.0037824514929592837",
            "extra": "mean: 826.2198766666605 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.2084083722708203,
            "unit": "iter/sec",
            "range": "stddev: 0.007419622745156345",
            "extra": "mean: 827.5348160000059 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 30.23081535327002,
            "unit": "iter/sec",
            "range": "stddev: 0.0013150486939458926",
            "extra": "mean: 33.07882993939267 msec\nrounds: 33"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.310710439114598,
            "unit": "iter/sec",
            "range": "stddev: 0.006350353945659343",
            "extra": "mean: 762.9450183333498 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 118.1295804539508,
            "unit": "iter/sec",
            "range": "stddev: 0.00010359671692822427",
            "extra": "mean: 8.465280213111562 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 11.629868142144659,
            "unit": "iter/sec",
            "range": "stddev: 0.0009158233810444743",
            "extra": "mean: 85.9854976666649 msec\nrounds: 12"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 1.195041341347769,
            "unit": "iter/sec",
            "range": "stddev: 0.007860910985617526",
            "extra": "mean: 836.7911346666878 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 15.774331654188831,
            "unit": "iter/sec",
            "range": "stddev: 0.002036757435823727",
            "extra": "mean: 63.39412799999376 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 365.0104407949144,
            "unit": "iter/sec",
            "range": "stddev: 0.0003168633004898711",
            "extra": "mean: 2.739647660001765 msec\nrounds: 400"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 22.399127588648895,
            "unit": "iter/sec",
            "range": "stddev: 0.00025475518541081887",
            "extra": "mean: 44.64459591304642 msec\nrounds: 23"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 164.23739796254165,
            "unit": "iter/sec",
            "range": "stddev: 0.0002956097688223314",
            "extra": "mean: 6.088747218389774 msec\nrounds: 174"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 257.68382549298695,
            "unit": "iter/sec",
            "range": "stddev: 0.000047756124561319844",
            "extra": "mean: 3.880724752851108 msec\nrounds: 263"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 268.8040954665975,
            "unit": "iter/sec",
            "range": "stddev: 0.0007000449009766156",
            "extra": "mean: 3.720181414141673 msec\nrounds: 297"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 59.72690401866683,
            "unit": "iter/sec",
            "range": "stddev: 0.0003747603561710725",
            "extra": "mean: 16.74287352459226 msec\nrounds: 61"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 868.4099096698201,
            "unit": "iter/sec",
            "range": "stddev: 0.000019337293591382425",
            "extra": "mean: 1.151529927128782 msec\nrounds: 892"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 24.62604094737305,
            "unit": "iter/sec",
            "range": "stddev: 0.00039540962924822855",
            "extra": "mean: 40.607420499992045 msec\nrounds: 26"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 1972.5950248501051,
            "unit": "iter/sec",
            "range": "stddev: 0.000013391645040345662",
            "extra": "mean: 506.94642711875883 usec\nrounds: 2065"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 65.97733848861418,
            "unit": "iter/sec",
            "range": "stddev: 0.0005066708768189464",
            "extra": "mean: 15.156719305562346 msec\nrounds: 72"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 90674.37174916695,
            "unit": "iter/sec",
            "range": "stddev: 9.880868634984656e-7",
            "extra": "mean: 11.028474537064408 usec\nrounds: 92507"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
            "value": 25682.067691785447,
            "unit": "iter/sec",
            "range": "stddev: 0.000001928071790466807",
            "extra": "mean: 38.937674800999595 usec\nrounds: 26144"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
            "value": 6362.716721311058,
            "unit": "iter/sec",
            "range": "stddev: 0.000005515112526417841",
            "extra": "mean: 157.16556996017684 usec\nrounds: 6518"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 25.434611701929946,
            "unit": "iter/sec",
            "range": "stddev: 0.0002420837612435502",
            "extra": "mean: 39.31650349999726 msec\nrounds: 26"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 25.34520490773774,
            "unit": "iter/sec",
            "range": "stddev: 0.0005005801688747793",
            "extra": "mean: 39.45519492307225 msec\nrounds: 26"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 24.41604614326012,
            "unit": "iter/sec",
            "range": "stddev: 0.0003124484317990492",
            "extra": "mean: 40.95667226923402 msec\nrounds: 26"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 3105.194751009135,
            "unit": "iter/sec",
            "range": "stddev: 0.000010669044625983356",
            "extra": "mean: 322.04099265433103 usec\nrounds: 3267"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 2797.098952631647,
            "unit": "iter/sec",
            "range": "stddev: 0.000011082997644624598",
            "extra": "mean: 357.5132724779548 usec\nrounds: 2925"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 2069.9887337531436,
            "unit": "iter/sec",
            "range": "stddev: 0.000016643492583585537",
            "extra": "mean: 483.09441674442223 usec\nrounds: 2150"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 107.81773135423283,
            "unit": "iter/sec",
            "range": "stddev: 0.0012055579128541008",
            "extra": "mean: 9.274912274999753 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 109.99338749755705,
            "unit": "iter/sec",
            "range": "stddev: 0.0004671233630091795",
            "extra": "mean: 9.09145561156765 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 104.86825724698285,
            "unit": "iter/sec",
            "range": "stddev: 0.000779863294976674",
            "extra": "mean: 9.535773991598118 msec\nrounds: 119"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 24.8806328195324,
            "unit": "iter/sec",
            "range": "stddev: 0.0003841224899349495",
            "extra": "mean: 40.191903769222286 msec\nrounds: 26"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 24.85404248468495,
            "unit": "iter/sec",
            "range": "stddev: 0.00041202558028038077",
            "extra": "mean: 40.23490346152742 msec\nrounds: 26"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 7330.484280379094,
            "unit": "iter/sec",
            "range": "stddev: 0.000005177155230298841",
            "extra": "mean: 136.416635211485 usec\nrounds: 9707"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 1039550.9824746414,
            "unit": "iter/sec",
            "range": "stddev: 9.041599387939321e-8",
            "extra": "mean: 961.9537827952502 nsec\nrounds: 107090"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3273114.931467138,
            "unit": "iter/sec",
            "range": "stddev: 4.1286171313602906e-8",
            "extra": "mean: 305.5193663950446 nsec\nrounds: 191939"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1573823.665481603,
            "unit": "iter/sec",
            "range": "stddev: 7.655294218710056e-8",
            "extra": "mean: 635.3951982886163 nsec\nrounds: 164150"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 162545.74364074907,
            "unit": "iter/sec",
            "range": "stddev: 8.732494531190604e-7",
            "extra": "mean: 6.152114337796212 usec\nrounds: 170040"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 1129.1454866398954,
            "unit": "iter/sec",
            "range": "stddev: 0.00002114607165356792",
            "extra": "mean: 885.6254679596641 usec\nrounds: 1186"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 118.05900117230868,
            "unit": "iter/sec",
            "range": "stddev: 0.00009675416262879796",
            "extra": "mean: 8.47034101652687 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 18.27091863317889,
            "unit": "iter/sec",
            "range": "stddev: 0.00034006108556584354",
            "extra": "mean: 54.73178552632051 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 118.92617335709359,
            "unit": "iter/sec",
            "range": "stddev: 0.00012199544625218467",
            "extra": "mean: 8.408577958674838 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 108.05874963247496,
            "unit": "iter/sec",
            "range": "stddev: 0.00011397210420810567",
            "extra": "mean: 9.254225163636999 msec\nrounds: 110"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 117.2630258911038,
            "unit": "iter/sec",
            "range": "stddev: 0.00012545405561255628",
            "extra": "mean: 8.527837247937377 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 159.3451464803133,
            "unit": "iter/sec",
            "range": "stddev: 0.00007777868129369912",
            "extra": "mean: 6.275685341464402 msec\nrounds: 164"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 1169.9606982124726,
            "unit": "iter/sec",
            "range": "stddev: 0.00001884696452314034",
            "extra": "mean: 854.7295661536772 usec\nrounds: 1300"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 117.58475273806943,
            "unit": "iter/sec",
            "range": "stddev: 0.0002216546678384688",
            "extra": "mean: 8.50450400000066 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 120.37899354293033,
            "unit": "iter/sec",
            "range": "stddev: 0.00007987438915446663",
            "extra": "mean: 8.30709719834444 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 27759.423104724072,
            "unit": "iter/sec",
            "range": "stddev: 0.000002141245037142128",
            "extra": "mean: 36.02380338479804 usec\nrounds: 28421"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 40.24506667481425,
            "unit": "iter/sec",
            "range": "stddev: 0.01936385301257243",
            "extra": "mean: 24.847766015152605 msec\nrounds: 66"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 3.0724617678986705,
            "unit": "iter/sec",
            "range": "stddev: 0.002567936204080651",
            "extra": "mean: 325.471910000014 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.2249208280589374,
            "unit": "iter/sec",
            "range": "stddev: 0.004942420098125035",
            "extra": "mean: 816.3792933333033 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.12415624440590763,
            "unit": "iter/sec",
            "range": "stddev: 0.14114484448202527",
            "extra": "mean: 8.054367339999999 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.238779459288852,
            "unit": "iter/sec",
            "range": "stddev: 0.005671930091983579",
            "extra": "mean: 807.246191000028 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 2.8306170130188946,
            "unit": "iter/sec",
            "range": "stddev: 0.004539016897135719",
            "extra": "mean: 353.27986633327174 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 1.0121700455083305,
            "unit": "iter/sec",
            "range": "stddev: 0.004410645400795112",
            "extra": "mean: 987.9762836666259 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 2.315007183694878,
            "unit": "iter/sec",
            "range": "stddev: 0.0022486728733021872",
            "extra": "mean: 431.96410233334365 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 3.036138654404568,
            "unit": "iter/sec",
            "range": "stddev: 0.001384828123992172",
            "extra": "mean: 329.36572199997727 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.2382515303606692,
            "unit": "iter/sec",
            "range": "stddev: 0.0010994913794464764",
            "extra": "mean: 807.5903606666467 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.2336784084406691,
            "unit": "iter/sec",
            "range": "stddev: 0.0024033092358144033",
            "extra": "mean: 810.5840169999965 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 11376.815594501502,
            "unit": "iter/sec",
            "range": "stddev: 0.000008770925175394847",
            "extra": "mean: 87.89805826538203 usec\nrounds: 11585"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 287.19522303855393,
            "unit": "iter/sec",
            "range": "stddev: 0.00004332018534787603",
            "extra": "mean: 3.4819520652882066 msec\nrounds: 291"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 25.05556640073912,
            "unit": "iter/sec",
            "range": "stddev: 0.0018711845670292956",
            "extra": "mean: 39.9112909285699 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 16.667278617240317,
            "unit": "iter/sec",
            "range": "stddev: 0.0017086353796793277",
            "extra": "mean: 59.99779705882033 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.390140885759752,
            "unit": "iter/sec",
            "range": "stddev: 0.0017327492074557518",
            "extra": "mean: 185.5239076666635 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 15.989495901950393,
            "unit": "iter/sec",
            "range": "stddev: 0.001993637443836178",
            "extra": "mean: 62.54105858822105 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 19.995745632442723,
            "unit": "iter/sec",
            "range": "stddev: 0.0030157631049077464",
            "extra": "mean: 50.010638181829975 msec\nrounds: 22"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 16.179375661231564,
            "unit": "iter/sec",
            "range": "stddev: 0.00278571349225382",
            "extra": "mean: 61.807082111095546 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 15.923564388128687,
            "unit": "iter/sec",
            "range": "stddev: 0.0018726640654534179",
            "extra": "mean: 62.800009823524086 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 25.68310149948562,
            "unit": "iter/sec",
            "range": "stddev: 0.004865962160425672",
            "extra": "mean: 38.93610746428067 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 16.77865588303751,
            "unit": "iter/sec",
            "range": "stddev: 0.0017666587238911475",
            "extra": "mean: 59.59952972222027 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 16.8853901768388,
            "unit": "iter/sec",
            "range": "stddev: 0.00141212710190308",
            "extra": "mean: 59.222794944452694 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 21721.706886910168,
            "unit": "iter/sec",
            "range": "stddev: 0.0000025589200037440515",
            "extra": "mean: 46.036897800265194 usec\nrounds: 22231"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 46.21361195118458,
            "unit": "iter/sec",
            "range": "stddev: 0.014507865056166086",
            "extra": "mean: 21.63864622951999 msec\nrounds: 61"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 173.3334357619517,
            "unit": "iter/sec",
            "range": "stddev: 0.000023650521324900535",
            "extra": "mean: 5.7692273599962265 msec\nrounds: 175"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.38692284879427,
            "unit": "iter/sec",
            "range": "stddev: 0.00012332435245653866",
            "extra": "mean: 69.50756673334126 msec\nrounds: 15"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
            "value": 1.1735306500466516,
            "unit": "iter/sec",
            "range": "stddev: 0.005830861679187688",
            "extra": "mean: 852.1294266666549 msec\nrounds: 3"
          }
        ]
      }
    ]
  }
}