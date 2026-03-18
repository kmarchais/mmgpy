window.BENCHMARK_DATA = {
  "lastUpdate": 1773836455242,
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
          "id": "e39986dec282d1bd1b8a4e612e9a3fb4ca0f435c",
          "message": "docs: add versioned documentation with mike (#194)\n\n* docs: add versioned documentation with mike\n\n- Add mike>=2.0.0 to docs dependency group in pyproject.toml\n- Add mike plugin and version selector config to mkdocs.yml\n- Update docs.yml workflow:\n  - Deploy 'dev' version on push to main\n  - Deploy versioned docs (e.g. 0.8) on release with 'latest' alias\n  - Add release trigger and git config for mike\n\nCloses #192\n\n* docs: set default version to latest on release\n\nEnsures the root URL redirects to the latest release version\ninstead of showing a directory listing.\n\n* docs: harden versioned docs workflow\n\n- Add concurrency group to prevent parallel gh-pages deploys (#1)\n- Add comment that set-default is idempotent (#2)\n- Skip pre-releases to avoid publishing unstable docs as latest (#3)\n- Gate mkdocs build --strict to PRs only; mike builds internally (#4)\n- Add comment noting dev version in selector is expected (#5)\n- Add comment that mike overrides site_url during deploy (#6)\n- Add comment that edit_uri always points to main branch (#7)\n- Add upper bound on mike dependency: >=2.0.0,<3 (#8)\n- Add one-time migration step to wipe legacy gh-pages (#9)\n- Add github-pages environment for deployment audit trail (#10)\n\n* ci: remove github-pages environment to fix PR branch protection\n\nThe github-pages environment has branch protection rules that block\nPR branches from running the job entirely (even the build-only step).\nThe workflow already gates deploys with proper 'if' conditions, so\nthe environment constraint is unnecessary.",
          "timestamp": "2026-03-18T13:11:51+01:00",
          "tree_id": "4a1ef872e7865b944378eda67941fbab5bf7d6f7",
          "url": "https://github.com/kmarchais/mmgpy/commit/e39986dec282d1bd1b8a4e612e9a3fb4ca0f435c"
        },
        "date": 1773836454063,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 1.1294619406672555,
            "unit": "iter/sec",
            "range": "stddev: 0.002795589534602774",
            "extra": "mean: 885.3773323333295 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.5524162691386939,
            "unit": "iter/sec",
            "range": "stddev: 0.03126049722821892",
            "extra": "mean: 1.8102290896666773 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.1856963295629335,
            "unit": "iter/sec",
            "range": "stddev: 0.0024671560605022177",
            "extra": "mean: 843.3862660000102 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.251028673965034,
            "unit": "iter/sec",
            "range": "stddev: 0.0021216272174006683",
            "extra": "mean: 799.342189999995 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 1.147318277781068,
            "unit": "iter/sec",
            "range": "stddev: 0.012951270502988027",
            "extra": "mean: 871.5977243333176 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.5570642610497247,
            "unit": "iter/sec",
            "range": "stddev: 0.014204242162955414",
            "extra": "mean: 1.7951250329999862 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.2811475326592991,
            "unit": "iter/sec",
            "range": "stddev: 0.0014085713244372025",
            "extra": "mean: 780.5502289999993 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.2661168246829777,
            "unit": "iter/sec",
            "range": "stddev: 0.006980286642988903",
            "extra": "mean: 789.816532333333 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 28.297421539421222,
            "unit": "iter/sec",
            "range": "stddev: 0.0005903205487671698",
            "extra": "mean: 35.338908833332994 msec\nrounds: 30"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.0520899254000324,
            "unit": "iter/sec",
            "range": "stddev: 0.008707205073343164",
            "extra": "mean: 950.4890939999958 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 115.79913676203104,
            "unit": "iter/sec",
            "range": "stddev: 0.00011765142322310351",
            "extra": "mean: 8.635642958677792 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 11.889414445414634,
            "unit": "iter/sec",
            "range": "stddev: 0.0007157960087674209",
            "extra": "mean: 84.10843146153996 msec\nrounds: 13"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 0.9772529298311623,
            "unit": "iter/sec",
            "range": "stddev: 0.013289728300274644",
            "extra": "mean: 1.0232765433333288 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 17.22107313353001,
            "unit": "iter/sec",
            "range": "stddev: 0.00181278780232224",
            "extra": "mean: 58.068390526312 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 379.3695650674188,
            "unit": "iter/sec",
            "range": "stddev: 0.0003099910138186507",
            "extra": "mean: 2.635952095477894 msec\nrounds: 398"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 31.62693753867133,
            "unit": "iter/sec",
            "range": "stddev: 0.0001811913797664026",
            "extra": "mean: 31.6186162121219 msec\nrounds: 33"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 149.07522532512766,
            "unit": "iter/sec",
            "range": "stddev: 0.00018687305583130342",
            "extra": "mean: 6.708022730262766 msec\nrounds: 152"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 242.9889443243966,
            "unit": "iter/sec",
            "range": "stddev: 0.00030465668376224733",
            "extra": "mean: 4.115413574804349 msec\nrounds: 254"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 275.48729085735863,
            "unit": "iter/sec",
            "range": "stddev: 0.00008904333004673522",
            "extra": "mean: 3.629931518393632 msec\nrounds: 299"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 72.0195260248564,
            "unit": "iter/sec",
            "range": "stddev: 0.0001383547081350601",
            "extra": "mean: 13.88512331579169 msec\nrounds: 76"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 927.592041020692,
            "unit": "iter/sec",
            "range": "stddev: 0.00003783553028281646",
            "extra": "mean: 1.0780601339567688 msec\nrounds: 963"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 33.55672827138193,
            "unit": "iter/sec",
            "range": "stddev: 0.00029578089957915053",
            "extra": "mean: 29.800283028570057 msec\nrounds: 35"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 1979.2078834459685,
            "unit": "iter/sec",
            "range": "stddev: 0.000020879895854477377",
            "extra": "mean: 505.25263584688 usec\nrounds: 2109"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 78.02146462049069,
            "unit": "iter/sec",
            "range": "stddev: 0.00040203579644964964",
            "extra": "mean: 12.816985746988541 msec\nrounds: 83"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 92207.9993636328,
            "unit": "iter/sec",
            "range": "stddev: 0.0000010055356254817183",
            "extra": "mean: 10.845046057841312 usec\nrounds: 94251"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
            "value": 27054.283895850527,
            "unit": "iter/sec",
            "range": "stddev: 0.0000021505798013258994",
            "extra": "mean: 36.962722940649556 usec\nrounds: 27597"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
            "value": 6352.063392498014,
            "unit": "iter/sec",
            "range": "stddev: 0.000007709887271052913",
            "extra": "mean: 157.4291593470291 usec\nrounds: 6558"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 35.36045943443455,
            "unit": "iter/sec",
            "range": "stddev: 0.0003370471226916532",
            "extra": "mean: 28.280175540541332 msec\nrounds: 37"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 35.21864877481982,
            "unit": "iter/sec",
            "range": "stddev: 0.0002434189640435764",
            "extra": "mean: 28.39404789189321 msec\nrounds: 37"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 34.48781709813794,
            "unit": "iter/sec",
            "range": "stddev: 0.000310990633141044",
            "extra": "mean: 28.99574644444493 msec\nrounds: 36"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 3166.7260453417357,
            "unit": "iter/sec",
            "range": "stddev: 0.000028201779573967517",
            "extra": "mean: 315.7835523761215 usec\nrounds: 4124"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 2817.498001059656,
            "unit": "iter/sec",
            "range": "stddev: 0.000025299077265173595",
            "extra": "mean: 354.92483033666815 usec\nrounds: 3560"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 2082.5474592777377,
            "unit": "iter/sec",
            "range": "stddev: 0.00002391502979758058",
            "extra": "mean: 480.1811337095851 usec\nrounds: 2483"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 123.23548023630158,
            "unit": "iter/sec",
            "range": "stddev: 0.00045472019478390394",
            "extra": "mean: 8.114546217392263 msec\nrounds: 138"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 124.38336072973793,
            "unit": "iter/sec",
            "range": "stddev: 0.0004499560053724387",
            "extra": "mean: 8.039660563383677 msec\nrounds: 142"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 124.27979922921652,
            "unit": "iter/sec",
            "range": "stddev: 0.00045209902140027253",
            "extra": "mean: 8.046359957145096 msec\nrounds: 140"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 35.23435234411755,
            "unit": "iter/sec",
            "range": "stddev: 0.0003189679624201013",
            "extra": "mean: 28.38139297221826 msec\nrounds: 36"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 35.205362615390655,
            "unit": "iter/sec",
            "range": "stddev: 0.00022599734052027284",
            "extra": "mean: 28.404763527782332 msec\nrounds: 36"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 7591.689886923908,
            "unit": "iter/sec",
            "range": "stddev: 0.000015743245056041206",
            "extra": "mean: 131.72297800551914 usec\nrounds: 9957"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 996930.6676713227,
            "unit": "iter/sec",
            "range": "stddev: 1.0608952363263882e-7",
            "extra": "mean: 1.0030787821342149 usec\nrounds: 102376"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3364504.5512646204,
            "unit": "iter/sec",
            "range": "stddev: 4.224012705521299e-8",
            "extra": "mean: 297.22058174185815 nsec\nrounds: 194591"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1584881.3825380178,
            "unit": "iter/sec",
            "range": "stddev: 7.29993274662368e-8",
            "extra": "mean: 630.9620461302959 nsec\nrounds: 164447"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 155044.97549827216,
            "unit": "iter/sec",
            "range": "stddev: 0.0000010008530632643527",
            "extra": "mean: 6.449741417200224 usec\nrounds: 168039"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 1043.7074547307539,
            "unit": "iter/sec",
            "range": "stddev: 0.00004766482177098494",
            "extra": "mean: 958.1228872778062 usec\nrounds: 1242"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 114.52091669000073,
            "unit": "iter/sec",
            "range": "stddev: 0.0001288937294202243",
            "extra": "mean: 8.732029300000477 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 18.1174324331021,
            "unit": "iter/sec",
            "range": "stddev: 0.00020073791713677154",
            "extra": "mean: 55.195459052625715 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 115.51596637224151,
            "unit": "iter/sec",
            "range": "stddev: 0.00011933464464696498",
            "extra": "mean: 8.656811966387187 msec\nrounds: 119"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 103.33522223355703,
            "unit": "iter/sec",
            "range": "stddev: 0.00013016213676572805",
            "extra": "mean: 9.67724245794732 msec\nrounds: 107"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 115.53808624119306,
            "unit": "iter/sec",
            "range": "stddev: 0.00017222572196533162",
            "extra": "mean: 8.65515461206824 msec\nrounds: 116"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 155.0059871885927,
            "unit": "iter/sec",
            "range": "stddev: 0.00010331160164941903",
            "extra": "mean: 6.45136370625039 msec\nrounds: 160"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 1067.076271125395,
            "unit": "iter/sec",
            "range": "stddev: 0.000028648058016102692",
            "extra": "mean: 937.1401342711399 usec\nrounds: 1281"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 117.00768706953711,
            "unit": "iter/sec",
            "range": "stddev: 0.00012396293855412608",
            "extra": "mean: 8.546447033054372 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 115.68726071158703,
            "unit": "iter/sec",
            "range": "stddev: 0.00016062382164746923",
            "extra": "mean: 8.643994108331773 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 28419.96224785412,
            "unit": "iter/sec",
            "range": "stddev: 0.000002684954467706252",
            "extra": "mean: 35.186535129036145 usec\nrounds: 29221"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 44.912458013192904,
            "unit": "iter/sec",
            "range": "stddev: 0.0167016401860212",
            "extra": "mean: 22.265537096772857 msec\nrounds: 62"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 3.3598162675065657,
            "unit": "iter/sec",
            "range": "stddev: 0.0023678687922746478",
            "extra": "mean: 297.6353230000086 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.2547611813691986,
            "unit": "iter/sec",
            "range": "stddev: 0.0026213578343578198",
            "extra": "mean: 796.9644063333211 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.13073410561345078,
            "unit": "iter/sec",
            "range": "stddev: 0.042939930013933064",
            "extra": "mean: 7.649113406999997 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.2763625700764236,
            "unit": "iter/sec",
            "range": "stddev: 0.0024314340005639583",
            "extra": "mean: 783.4764379999987 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 3.2126447280587502,
            "unit": "iter/sec",
            "range": "stddev: 0.002149241379879303",
            "extra": "mean: 311.27002350000055 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 1.036405145784133,
            "unit": "iter/sec",
            "range": "stddev: 0.0035449885642738505",
            "extra": "mean: 964.8736346666927 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 2.4441810757861266,
            "unit": "iter/sec",
            "range": "stddev: 0.0010929078670045907",
            "extra": "mean: 409.134990000022 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 3.3993408154661826,
            "unit": "iter/sec",
            "range": "stddev: 0.0020191834322709156",
            "extra": "mean: 294.174680999987 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.271038696432481,
            "unit": "iter/sec",
            "range": "stddev: 0.004734385797351477",
            "extra": "mean: 786.758107999996 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.272857796271464,
            "unit": "iter/sec",
            "range": "stddev: 0.004278856193277124",
            "extra": "mean: 785.633715666639 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 11438.033397230562,
            "unit": "iter/sec",
            "range": "stddev: 0.0000036024976980349534",
            "extra": "mean: 87.42761673017368 usec\nrounds: 11608"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 289.83503102412686,
            "unit": "iter/sec",
            "range": "stddev: 0.00003715216547065825",
            "extra": "mean: 3.4502385597300576 msec\nrounds: 293"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 29.31112740152044,
            "unit": "iter/sec",
            "range": "stddev: 0.0015914913883808704",
            "extra": "mean: 34.116736156253324 msec\nrounds: 32"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 17.26908230322706,
            "unit": "iter/sec",
            "range": "stddev: 0.0016775799465625397",
            "extra": "mean: 57.90695663157103 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.513965120668607,
            "unit": "iter/sec",
            "range": "stddev: 0.002330432424968351",
            "extra": "mean: 181.3576941666876 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 17.444554372987987,
            "unit": "iter/sec",
            "range": "stddev: 0.0016517217344417987",
            "extra": "mean: 57.32447952631279 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 21.63708102362146,
            "unit": "iter/sec",
            "range": "stddev: 0.0018968044862982232",
            "extra": "mean: 46.2169549999969 msec\nrounds: 23"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 17.608390286019954,
            "unit": "iter/sec",
            "range": "stddev: 0.0016264960756812601",
            "extra": "mean: 56.79110831578639 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 17.23043923574996,
            "unit": "iter/sec",
            "range": "stddev: 0.0016215004452419107",
            "extra": "mean: 58.036825777788984 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 28.812903808777282,
            "unit": "iter/sec",
            "range": "stddev: 0.0016539294960752854",
            "extra": "mean: 34.7066719354878 msec\nrounds: 31"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 17.41393982363413,
            "unit": "iter/sec",
            "range": "stddev: 0.001648633079805331",
            "extra": "mean: 57.42525873684276 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 17.48222032659735,
            "unit": "iter/sec",
            "range": "stddev: 0.0018313298403776885",
            "extra": "mean: 57.20097226315159 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 21779.254099613558,
            "unit": "iter/sec",
            "range": "stddev: 0.0000025705190459584247",
            "extra": "mean: 45.91525473857911 usec\nrounds: 22211"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 44.623991553565446,
            "unit": "iter/sec",
            "range": "stddev: 0.014953052277783756",
            "extra": "mean: 22.409470000002727 msec\nrounds: 57"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 172.66168957515325,
            "unit": "iter/sec",
            "range": "stddev: 0.00004589981359922679",
            "extra": "mean: 5.791672735628693 msec\nrounds: 174"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.471256020092111,
            "unit": "iter/sec",
            "range": "stddev: 0.0002523665056056417",
            "extra": "mean: 69.10250213330377 msec\nrounds: 15"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
            "value": 1.1426955639631922,
            "unit": "iter/sec",
            "range": "stddev: 0.0014618339962955348",
            "extra": "mean: 875.1237263332996 msec\nrounds: 3"
          }
        ]
      }
    ]
  }
}