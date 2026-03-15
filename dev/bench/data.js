window.BENCHMARK_DATA = {
  "lastUpdate": 1773577465567,
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
          "id": "5f5ac42758845167f51aa875ead976a1e60a6d1c",
          "message": "feat: use system MMG from mmgsuite for conda builds\n\n* feat(build): add support for system-installed MMG via mmgsuite\n\nAdd MMGPY_USE_SYSTEM_MMG CMake option that uses find_package(mmg)\ninstead of building MMG from source via FetchContent. This enables\nconda-forge packaging where mmgpy depends on the mmgsuite package.\n\nUpdate conda recipe to depend on mmgsuite VTK variant, use proper\ncompiler jinja functions, and add stdlib requirement.\n\n* fix(conda): use space-separated matchspec for mmgsuite build string\n\nrattler-build rejects `*=vtk*` syntax — use `* vtk*` (three-part\nmatchspec: name version build) instead.\n\nAdd compiler/stdlib variants to variants.yaml for local testing.\n\n* fix(conda): update VTK constraint to 9.6 for mmgsuite VTK variant\n\nThe mmgsuite VTK variant on conda-forge was built against VTK 9.6.0,\nso update the constraint from >=9.5,<9.6 to >=9.6,<9.7.\n\n* fix(build): find MMG libraries directly instead of find_package(mmg)\n\nfind_package(mmg) loads mmgConfig.cmake which calls find_dependency(vtk),\ntriggering the full VTK transitive dependency resolution (LibXml2, etc.)\nthat fails in the conda build environment. Since we only need the MMG\nshared libraries and headers, find them directly with find_library/find_path.\n\n* fix(conda): disable BUILD_TESTING for conda builds\n\ntests/ has no CMakeLists.txt — tests are Python-only and run via pytest,\nnot cmake CTest.\n\n* fix(conda): require pyvista >=0.47.0 for VTK 9.6 support\n\n* fix(conda): remove platform-specific compiler overrides from variants\n\nThe gcc/gxx/sysroot settings only work on Linux. Removing them lets\nconda-forge's global pinning select the correct compilers per platform\n(clang/clangxx on macOS, gcc/gxx on Linux).\n\n* fix(conda): remove variants.yaml, pass python version directly\n\nThe variants.yaml only contained python versions (already passed via\n--variant) and Linux-specific compiler settings that broke macOS/Windows.\nRemoving it lets rattler-build use its built-in platform defaults.\n\n* fix(conda): set c_stdlib variant per platform in CI\n\nrattler-build requires c_stdlib to be defined for ${{ stdlib(\"c\") }}.\nSet it per-platform: sysroot on Linux, macosx_deployment_target on macOS.\n\n* fix(conda): use macos-13 (x86_64) and add Windows stdlib variant\n\n- Switch from macos-latest (arm64) to macos-13 (x86_64) since\n  mmgsuite has no osx-arm64 packages\n- Add c_stdlib=vs variant for Windows to fix stdlib resolution\n\n* fix(conda): use vs2022 compiler for Windows conda builds\n\nrattler-build defaults to vs2017 without explicit variant; GitHub\nrunners have VS 2022.\n\n* fix(conda): add PREFIX to CMake search path on Windows\n\nmmgsuite installs libraries to %PREFIX%\\Lib\\ but conda sets\nCMAKE_PREFIX_PATH to %PREFIX%\\Library. Add both paths so\nfind_library can locate MMG libraries.\n\n* fix(conda): restore macos-latest now that mmgsuite has osx-arm64 packages\n\n* refactor: remove MMGPY_USE_SYSTEM_MMG, use MMGPY_CONDA_BUILD directly\n\nMMGPY_USE_SYSTEM_MMG was always set alongside MMGPY_CONDA_BUILD and\nnever used independently. Merge both flags and remove dead code paths\nthat were unreachable in conda builds.\n\n* fix(ci): clean working tree before benchmark action switches branches\n\nuv sync can modify uv.lock during CI, causing git switch gh-pages to\nfail in the benchmark action.\n\n* chore: update uv.lock for version 0.7.0.dev0\n\n* revert: remove git checkout workaround in benchmark CI",
          "timestamp": "2026-03-15T13:14:32+01:00",
          "tree_id": "090e078b6a0fca435711b5500ef94579c3e05571",
          "url": "https://github.com/kmarchais/mmgpy/commit/5f5ac42758845167f51aa875ead976a1e60a6d1c"
        },
        "date": 1773577464850,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 1.1554769428957345,
            "unit": "iter/sec",
            "range": "stddev: 0.005717477232330888",
            "extra": "mean: 865.4434916666579 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.5689435873108054,
            "unit": "iter/sec",
            "range": "stddev: 0.008335688335573403",
            "extra": "mean: 1.7576435033333364 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.1667406343282125,
            "unit": "iter/sec",
            "range": "stddev: 0.010341262182607686",
            "extra": "mean: 857.088516999994 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.2252226505945858,
            "unit": "iter/sec",
            "range": "stddev: 0.008872862979715814",
            "extra": "mean: 816.1781856666721 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 1.1828877650297533,
            "unit": "iter/sec",
            "range": "stddev: 0.004600869017039742",
            "extra": "mean: 845.3887423333413 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.5666971490355572,
            "unit": "iter/sec",
            "range": "stddev: 0.01605650309377205",
            "extra": "mean: 1.764610959666669 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.2100341828082142,
            "unit": "iter/sec",
            "range": "stddev: 0.0060336101602481845",
            "extra": "mean: 826.4229343333321 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.2359321943967472,
            "unit": "iter/sec",
            "range": "stddev: 0.003050993608045976",
            "extra": "mean: 809.105875333311 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 28.87537061607859,
            "unit": "iter/sec",
            "range": "stddev: 0.0007283832856858463",
            "extra": "mean: 34.631590129034485 msec\nrounds: 31"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.081645111648301,
            "unit": "iter/sec",
            "range": "stddev: 0.005949957458175951",
            "extra": "mean: 924.5176529999904 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 118.87358561545182,
            "unit": "iter/sec",
            "range": "stddev: 0.00009614804981506717",
            "extra": "mean: 8.412297776857962 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 12.257748975513167,
            "unit": "iter/sec",
            "range": "stddev: 0.0011677410742427204",
            "extra": "mean: 81.58104738461046 msec\nrounds: 13"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 1.0282398193494722,
            "unit": "iter/sec",
            "range": "stddev: 0.0017360355295724882",
            "extra": "mean: 972.5357656666725 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 17.36357809097056,
            "unit": "iter/sec",
            "range": "stddev: 0.0018112049698776626",
            "extra": "mean: 57.59181631578701 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 362.15495070269156,
            "unit": "iter/sec",
            "range": "stddev: 0.0003650147316107042",
            "extra": "mean: 2.7612490125005706 msec\nrounds: 400"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 31.68480359777796,
            "unit": "iter/sec",
            "range": "stddev: 0.000263550654512039",
            "extra": "mean: 31.56087103125138 msec\nrounds: 32"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 147.51619786243558,
            "unit": "iter/sec",
            "range": "stddev: 0.0002143445452437464",
            "extra": "mean: 6.778916583333701 msec\nrounds: 156"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 248.59836230536928,
            "unit": "iter/sec",
            "range": "stddev: 0.000046033160483061",
            "extra": "mean: 4.022552645667215 msec\nrounds: 254"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 268.6941785356113,
            "unit": "iter/sec",
            "range": "stddev: 0.00020524871282578575",
            "extra": "mean: 3.721703259259357 msec\nrounds: 297"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 74.54365846223304,
            "unit": "iter/sec",
            "range": "stddev: 0.00015043543269486218",
            "extra": "mean: 13.414957363631975 msec\nrounds: 77"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 906.945920771542,
            "unit": "iter/sec",
            "range": "stddev: 0.00006326446321144743",
            "extra": "mean: 1.1026015742474442 msec\nrounds: 963"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 35.364738488506454,
            "unit": "iter/sec",
            "range": "stddev: 0.00020774040593431962",
            "extra": "mean: 28.27675370270305 msec\nrounds: 37"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 1967.9532579960658,
            "unit": "iter/sec",
            "range": "stddev: 0.000042226785072926826",
            "extra": "mean: 508.14215019430054 usec\nrounds: 2064"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 81.05263163227187,
            "unit": "iter/sec",
            "range": "stddev: 0.0004273045990934098",
            "extra": "mean: 12.337662329545392 msec\nrounds: 88"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 90689.75277835102,
            "unit": "iter/sec",
            "range": "stddev: 0.0000011782222579662587",
            "extra": "mean: 11.026604102053687 usec\nrounds: 93024"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
            "value": 26829.633119154594,
            "unit": "iter/sec",
            "range": "stddev: 0.00000368266988631315",
            "extra": "mean: 37.27222044218211 usec\nrounds: 27649"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
            "value": 6390.264700925472,
            "unit": "iter/sec",
            "range": "stddev: 0.00000565718898557554",
            "extra": "mean: 156.48804029278702 usec\nrounds: 6552"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 35.33262067765034,
            "unit": "iter/sec",
            "range": "stddev: 0.00026956090126832035",
            "extra": "mean: 28.302457638885258 msec\nrounds: 36"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 35.13146039757098,
            "unit": "iter/sec",
            "range": "stddev: 0.0002027568418623293",
            "extra": "mean: 28.46451552777296 msec\nrounds: 36"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 34.64899024076652,
            "unit": "iter/sec",
            "range": "stddev: 0.00019992927282934695",
            "extra": "mean: 28.86086991428231 msec\nrounds: 35"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 3071.946540712173,
            "unit": "iter/sec",
            "range": "stddev: 0.000018032448668641336",
            "extra": "mean: 325.52649818188854 usec\nrounds: 3300"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 3529.383236186343,
            "unit": "iter/sec",
            "range": "stddev: 0.000009122952547799859",
            "extra": "mean: 283.3356235579973 usec\nrounds: 2946"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 2458.983506609036,
            "unit": "iter/sec",
            "range": "stddev: 0.000011114773233872014",
            "extra": "mean: 406.6721054908622 usec\nrounds: 2531"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 134.67462002719128,
            "unit": "iter/sec",
            "range": "stddev: 0.00043767713845094193",
            "extra": "mean: 7.425304038712687 msec\nrounds: 155"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 133.8531970433213,
            "unit": "iter/sec",
            "range": "stddev: 0.0004712634557063441",
            "extra": "mean: 7.470871238707523 msec\nrounds: 155"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 137.87511883316697,
            "unit": "iter/sec",
            "range": "stddev: 0.0004320062036928254",
            "extra": "mean: 7.252940258278436 msec\nrounds: 151"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 37.271446171082204,
            "unit": "iter/sec",
            "range": "stddev: 0.00018545368678311164",
            "extra": "mean: 26.83019047368948 msec\nrounds: 38"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 37.22495882431863,
            "unit": "iter/sec",
            "range": "stddev: 0.00020144375802205513",
            "extra": "mean: 26.8636966052656 msec\nrounds: 38"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 9894.439738631449,
            "unit": "iter/sec",
            "range": "stddev: 0.000004295781227447602",
            "extra": "mean: 101.06686446283973 usec\nrounds: 10285"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 1052046.4786695642,
            "unit": "iter/sec",
            "range": "stddev: 9.159478116714641e-8",
            "extra": "mean: 950.528346679718 nsec\nrounds: 108496"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3400140.0204409068,
            "unit": "iter/sec",
            "range": "stddev: 4.371009603087857e-8",
            "extra": "mean: 294.10553506273743 nsec\nrounds: 189790"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1602015.650317507,
            "unit": "iter/sec",
            "range": "stddev: 7.292493849404041e-8",
            "extra": "mean: 624.2136272525227 nsec\nrounds: 165235"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 154679.80277684532,
            "unit": "iter/sec",
            "range": "stddev: 9.127349515227093e-7",
            "extra": "mean: 6.464968160340157 usec\nrounds: 170040"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 1192.7509996364477,
            "unit": "iter/sec",
            "range": "stddev: 0.00007367543835710603",
            "extra": "mean: 838.39795590597 usec\nrounds: 1270"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 116.74191432384801,
            "unit": "iter/sec",
            "range": "stddev: 0.00007742878246170883",
            "extra": "mean: 8.565903735533658 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 18.18911824953338,
            "unit": "iter/sec",
            "range": "stddev: 0.000283565783622594",
            "extra": "mean: 54.97792615789134 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 117.62441865997428,
            "unit": "iter/sec",
            "range": "stddev: 0.00008790318446301671",
            "extra": "mean: 8.501636066663801 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 106.99414103614976,
            "unit": "iter/sec",
            "range": "stddev: 0.000092022038106699",
            "extra": "mean: 9.346306165139765 msec\nrounds: 109"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 116.23288634200358,
            "unit": "iter/sec",
            "range": "stddev: 0.00011257673917595654",
            "extra": "mean: 8.603417083333891 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 159.22861406807573,
            "unit": "iter/sec",
            "range": "stddev: 0.00008341479155505959",
            "extra": "mean: 6.280278239264617 msec\nrounds: 163"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 1252.096488600408,
            "unit": "iter/sec",
            "range": "stddev: 0.000021739528708445148",
            "extra": "mean: 798.6604939031484 usec\nrounds: 1312"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 117.7682097519592,
            "unit": "iter/sec",
            "range": "stddev: 0.0001073572990885611",
            "extra": "mean: 8.491255849997023 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 116.29000681375858,
            "unit": "iter/sec",
            "range": "stddev: 0.00010461678320805444",
            "extra": "mean: 8.599191172131631 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 28598.092792232026,
            "unit": "iter/sec",
            "range": "stddev: 0.000002148334158801533",
            "extra": "mean: 34.967366784390094 usec\nrounds: 29227"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 48.41869008963761,
            "unit": "iter/sec",
            "range": "stddev: 0.015503788989371194",
            "extra": "mean: 20.653181615378237 msec\nrounds: 65"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 3.446947934292035,
            "unit": "iter/sec",
            "range": "stddev: 0.0014577758594095207",
            "extra": "mean: 290.11172174998023 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.2343340726451344,
            "unit": "iter/sec",
            "range": "stddev: 0.005079431336612711",
            "extra": "mean: 810.1534439999986 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.12189494831475113,
            "unit": "iter/sec",
            "range": "stddev: 0.362962291611693",
            "extra": "mean: 8.20378542200001 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.215945452933389,
            "unit": "iter/sec",
            "range": "stddev: 0.0051230535552411055",
            "extra": "mean: 822.4053123333496 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 3.1210935344830832,
            "unit": "iter/sec",
            "range": "stddev: 0.0018989945602678505",
            "extra": "mean: 320.400522749992 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 0.9869531589207937,
            "unit": "iter/sec",
            "range": "stddev: 0.004203284994937058",
            "extra": "mean: 1.013219311333349 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 2.4033258588324116,
            "unit": "iter/sec",
            "range": "stddev: 0.0012458234274943813",
            "extra": "mean: 416.0900596666579 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 3.2919669999830576,
            "unit": "iter/sec",
            "range": "stddev: 0.0029577021130708222",
            "extra": "mean: 303.76975224999114 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.2149441080028727,
            "unit": "iter/sec",
            "range": "stddev: 0.003888552141958794",
            "extra": "mean: 823.083130666646 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.226677094359712,
            "unit": "iter/sec",
            "range": "stddev: 0.002256052857332808",
            "extra": "mean: 815.2104613333222 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 11442.455204041516,
            "unit": "iter/sec",
            "range": "stddev: 0.0000037888176175093204",
            "extra": "mean: 87.393831320991 usec\nrounds: 11596"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 290.8994084616554,
            "unit": "iter/sec",
            "range": "stddev: 0.00004556895641865864",
            "extra": "mean: 3.4376144155405317 msec\nrounds: 296"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 28.306958975666134,
            "unit": "iter/sec",
            "range": "stddev: 0.001533992235437878",
            "extra": "mean: 35.327002129039805 msec\nrounds: 31"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 17.277362223571814,
            "unit": "iter/sec",
            "range": "stddev: 0.0020288728592187575",
            "extra": "mean: 57.879205578944344 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.467013077268448,
            "unit": "iter/sec",
            "range": "stddev: 0.0032654104032081932",
            "extra": "mean: 182.9152383333318 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 17.244890429501723,
            "unit": "iter/sec",
            "range": "stddev: 0.001833672270101522",
            "extra": "mean: 57.988190999998956 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 21.51348476543464,
            "unit": "iter/sec",
            "range": "stddev: 0.00209157570524959",
            "extra": "mean: 46.48247417390433 msec\nrounds: 23"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 17.555165775642,
            "unit": "iter/sec",
            "range": "stddev: 0.001992472739511728",
            "extra": "mean: 56.963290052635784 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 17.312053946519487,
            "unit": "iter/sec",
            "range": "stddev: 0.0016106769179635733",
            "extra": "mean: 57.76322111109443 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 28.805738162510035,
            "unit": "iter/sec",
            "range": "stddev: 0.0015887474165484207",
            "extra": "mean: 34.715305483873195 msec\nrounds: 31"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 17.545609528005922,
            "unit": "iter/sec",
            "range": "stddev: 0.001772100969040864",
            "extra": "mean: 56.99431521052726 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 17.55595852516809,
            "unit": "iter/sec",
            "range": "stddev: 0.0016755707650923405",
            "extra": "mean: 56.96071784211654 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 21787.068328631274,
            "unit": "iter/sec",
            "range": "stddev: 0.0000025479168673925368",
            "extra": "mean: 45.898786606633955 usec\nrounds: 22250"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 45.29099049242872,
            "unit": "iter/sec",
            "range": "stddev: 0.016229616428124538",
            "extra": "mean: 22.07944646666912 msec\nrounds: 60"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 172.51544268277854,
            "unit": "iter/sec",
            "range": "stddev: 0.000037821640630170165",
            "extra": "mean: 5.796582522984916 msec\nrounds: 174"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.28219197072246,
            "unit": "iter/sec",
            "range": "stddev: 0.0003740776389425419",
            "extra": "mean: 70.01726360000853 msec\nrounds: 15"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
            "value": 1.1366758609863765,
            "unit": "iter/sec",
            "range": "stddev: 0.002189185466356297",
            "extra": "mean: 879.7582796666651 msec\nrounds: 3"
          }
        ]
      }
    ]
  }
}