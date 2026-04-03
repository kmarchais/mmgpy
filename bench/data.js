window.BENCHMARK_DATA = {
"lastUpdate": 1775214607806,
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
"id": "c76cf9d9145faf4807bdca7a1f8515725134bc6b",
"message": "feat: add Python 3.14 support, manylinux_2_28, and VTK 9.6 (#195)\n\n## Summary\n\nFixes #140.\n\nAdds Python 3.14 support (including free-threaded cp314t on Linux), switches Linux x86_64 wheels to manylinux_2_28, upgrades build-time VTK to 9.6.0, and adds upper bounds to all dependencies.\n\n### Python 3.14 support\n- Widen VTK constraint: `>=9.5,<9.7` (Python <3.14) / `>=9.6,<9.7` (Python >=3.14)\n- Add `cp314-*` and `cp314t-*` (free-threaded, Linux only) to cibuildwheel\n- Bump pyvista lower bound to `>=0.47` (first version compatible with VTK 9.6)\n- Update CI matrices to test 3.10 + 3.14\n\n### manylinux_2_28 migration\n- Switch Linux x86_64 cibuildwheel image from manylinux2014 to manylinux_2_28\n- Remove `scipy<1.17` cap (scipy 1.17+ dropped manylinux2014)\n\n### VTK 9.6.0 build adaptations\n- Add `vtkWrapJavaScript` stub, `vtkscn` module, `NOMINMAX` on MSVC\n- Parameterize all VTK version paths in cibuildwheel config ($VTK_MAJOR_MINOR)\n\n### Dependency bounds & maintenance\n- Add upper bounds to all runtime and optional dependencies\n- Bump cibuildwheel from v3.0 to v3.4, setup-uv from v4 to v6\n- Update vtk_modules.py fallback from 9.4 to 9.6\n- Add missing v0.7.0 and v0.7.1 entries to CHANGELOG",
"timestamp": "2026-03-18T17:05:01+01:00",
"tree_id": "d3b873c0a640547c711d0fb74ad3bc5b473d0d63",
"url": "https://github.com/kmarchais/mmgpy/commit/c76cf9d9145faf4807bdca7a1f8515725134bc6b"
},
"date": 1773850448834,
"tool": "pytest",
"benches": [
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
"value": 1.1805202063263003,
"unit": "iter/sec",
"range": "stddev: 0.006472887963459706",
"extra": "mean: 847.0841876666668 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
"value": 0.5731368139995323,
"unit": "iter/sec",
"range": "stddev: 0.023974444716415175",
"extra": "mean: 1.7447840996666741 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
"value": 1.178388784748839,
"unit": "iter/sec",
"range": "stddev: 0.0030093767711719403",
"extra": "mean: 848.6163590000046 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
"value": 1.2409695786487969,
"unit": "iter/sec",
"range": "stddev: 0.0009717174102339977",
"extra": "mean: 805.8215263333276 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
"value": 1.1858938636455656,
"unit": "iter/sec",
"range": "stddev: 0.00799997284587741",
"extra": "mean: 843.245783333335 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
"value": 0.570376606080923,
"unit": "iter/sec",
"range": "stddev: 0.019446380075043356",
"extra": "mean: 1.7532275856666597 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
"value": 1.2408947702050555,
"unit": "iter/sec",
"range": "stddev: 0.0006939303474140452",
"extra": "mean: 805.8701060000052 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
"value": 1.2499967963623702,
"unit": "iter/sec",
"range": "stddev: 0.0005929039643138396",
"extra": "mean: 800.0020503333379 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
"value": 30.42461440993844,
"unit": "iter/sec",
"range": "stddev: 0.0006984105677903128",
"extra": "mean: 32.86812403030298 msec\nrounds: 33"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
"value": 1.086488095780916,
"unit": "iter/sec",
"range": "stddev: 0.005201462884461327",
"extra": "mean: 920.39664666666 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
"value": 120.07682451716148,
"unit": "iter/sec",
"range": "stddev: 0.00005695984143394779",
"extra": "mean: 8.328001710747099 msec\nrounds: 121"
},
{
"name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
"value": 12.542091367165401,
"unit": "iter/sec",
"range": "stddev: 0.0007210988646414964",
"extra": "mean: 79.73151930769316 msec\nrounds: 13"
},
{
"name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
"value": 1.0315931516604766,
"unit": "iter/sec",
"range": "stddev: 0.001993613700589727",
"extra": "mean: 969.3744073333335 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
"value": 17.897237564115258,
"unit": "iter/sec",
"range": "stddev: 0.0014492923498982085",
"extra": "mean: 55.874544684205546 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
"value": 365.7828365115916,
"unit": "iter/sec",
"range": "stddev: 0.0003163311646381935",
"extra": "mean: 2.7338625549980122 msec\nrounds: 400"
},
{
"name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
"value": 31.228594049149187,
"unit": "iter/sec",
"range": "stddev: 0.00019768383337271286",
"extra": "mean: 32.021934718743594 msec\nrounds: 32"
},
{
"name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
"value": 145.6266846142413,
"unit": "iter/sec",
"range": "stddev: 0.0004381494994925173",
"extra": "mean: 6.866873352565542 msec\nrounds: 156"
},
{
"name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
"value": 255.41296048626984,
"unit": "iter/sec",
"range": "stddev: 0.00004257759012545187",
"extra": "mean: 3.915228099999869 msec\nrounds: 260"
},
{
"name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
"value": 268.9947120348603,
"unit": "iter/sec",
"range": "stddev: 0.000528566316861222",
"extra": "mean: 3.7175451979532053 msec\nrounds: 293"
},
{
"name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
"value": 76.88267436652251,
"unit": "iter/sec",
"range": "stddev: 0.00014807839527646147",
"extra": "mean: 13.006831620251702 msec\nrounds: 79"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
"value": 878.535141985057,
"unit": "iter/sec",
"range": "stddev: 0.000027836756467934347",
"extra": "mean: 1.1382583942407725 msec\nrounds: 903"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
"value": 35.2536449419241,
"unit": "iter/sec",
"range": "stddev: 0.00021719863870385352",
"extra": "mean: 28.365861222218943 msec\nrounds: 36"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
"value": 1744.259504230277,
"unit": "iter/sec",
"range": "stddev: 0.00001626594828738242",
"extra": "mean: 573.3091879819164 usec\nrounds: 1814"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
"value": 82.14336877197005,
"unit": "iter/sec",
"range": "stddev: 0.00039974005917195243",
"extra": "mean: 12.173837218388249 msec\nrounds: 87"
},
{
"name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
"value": 92464.67903727248,
"unit": "iter/sec",
"range": "stddev: 9.368450473393073e-7",
"extra": "mean: 10.814940476859281 usec\nrounds: 94518"
},
{
"name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
"value": 26455.90620310182,
"unit": "iter/sec",
"range": "stddev: 0.0000037031986907846037",
"extra": "mean: 37.798743022560124 usec\nrounds: 27302"
},
{
"name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
"value": 6378.813278528644,
"unit": "iter/sec",
"range": "stddev: 0.0000053866502966226824",
"extra": "mean: 156.7689719600419 usec\nrounds: 6562"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
"value": 36.91639634069155,
"unit": "iter/sec",
"range": "stddev: 0.00026563270732267246",
"extra": "mean: 27.088234473681222 msec\nrounds: 38"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
"value": 36.571573933810136,
"unit": "iter/sec",
"range": "stddev: 0.000320490124842964",
"extra": "mean: 27.343641315790016 msec\nrounds: 38"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
"value": 35.57395480665164,
"unit": "iter/sec",
"range": "stddev: 0.0009438086595197507",
"extra": "mean: 28.110453432437016 msec\nrounds: 37"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
"value": 4068.492084582388,
"unit": "iter/sec",
"range": "stddev: 0.000010181210975231442",
"extra": "mean: 245.79131019807434 usec\nrounds: 4236"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
"value": 3506.6148331606637,
"unit": "iter/sec",
"range": "stddev: 0.000010748973553201771",
"extra": "mean: 285.1753179571926 usec\nrounds: 3642"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
"value": 2445.3366074383366,
"unit": "iter/sec",
"range": "stddev: 0.000012378440800191664",
"extra": "mean: 408.94165529528914 usec\nrounds: 2521"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
"value": 140.3266108795819,
"unit": "iter/sec",
"range": "stddev: 0.0004621723263409449",
"extra": "mean: 7.126232107594528 msec\nrounds: 158"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
"value": 128.35875016560436,
"unit": "iter/sec",
"range": "stddev: 0.0006000675936759061",
"extra": "mean: 7.790664825809165 msec\nrounds: 155"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
"value": 134.25548193693984,
"unit": "iter/sec",
"range": "stddev: 0.00044675464077812284",
"extra": "mean: 7.448485421769986 msec\nrounds: 147"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
"value": 35.946170504742106,
"unit": "iter/sec",
"range": "stddev: 0.00026291788276336305",
"extra": "mean: 27.819375081083468 msec\nrounds: 37"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
"value": 35.676532022935575,
"unit": "iter/sec",
"range": "stddev: 0.0004076566825601999",
"extra": "mean: 28.02963021621957 msec\nrounds: 37"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
"value": 9816.365107183054,
"unit": "iter/sec",
"range": "stddev: 0.0000065311669758162175",
"extra": "mean: 101.87070153577083 usec\nrounds: 10219"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
"value": 997260.3779139066,
"unit": "iter/sec",
"range": "stddev: 1.0212479508224979e-7",
"extra": "mean: 1.0027471482340693 usec\nrounds: 102691"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
"value": 3264656.292725803,
"unit": "iter/sec",
"range": "stddev: 4.559370739563625e-8",
"extra": "mean: 306.31095905200385 nsec\nrounds: 199641"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
"value": 1590184.163951184,
"unit": "iter/sec",
"range": "stddev: 7.130163353858193e-8",
"extra": "mean: 628.8579792640284 nsec\nrounds: 164990"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
"value": 152773.53619349422,
"unit": "iter/sec",
"range": "stddev: 0.0000010192275954106561",
"extra": "mean: 6.5456362725901505 usec\nrounds: 170911"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
"value": 1214.9823291153118,
"unit": "iter/sec",
"range": "stddev: 0.00001892893986156355",
"extra": "mean: 823.0572379831639 usec\nrounds: 1269"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
"value": 120.10279783541169,
"unit": "iter/sec",
"range": "stddev: 0.00009320992708369579",
"extra": "mean: 8.326200704919424 msec\nrounds: 122"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
"value": 18.215964591402436,
"unit": "iter/sec",
"range": "stddev: 0.0020756229511872722",
"extra": "mean: 54.896900736839356 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
"value": 120.26273543380753,
"unit": "iter/sec",
"range": "stddev: 0.00005893178834476374",
"extra": "mean: 8.31512767768698 msec\nrounds: 121"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
"value": 107.95061680580069,
"unit": "iter/sec",
"range": "stddev: 0.00022251466584237352",
"extra": "mean: 9.263495009009205 msec\nrounds: 111"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
"value": 118.64521007456034,
"unit": "iter/sec",
"range": "stddev: 0.00005765388692083321",
"extra": "mean: 8.428490280994646 msec\nrounds: 121"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
"value": 160.49250106767792,
"unit": "iter/sec",
"range": "stddev: 0.00009895012530728302",
"extra": "mean: 6.2308207134133395 msec\nrounds: 164"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
"value": 1260.2594174986432,
"unit": "iter/sec",
"range": "stddev: 0.000018773894838754017",
"extra": "mean: 793.4874249817511 usec\nrounds: 1313"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
"value": 120.30423398510914,
"unit": "iter/sec",
"range": "stddev: 0.00005198256267938195",
"extra": "mean: 8.312259401641482 msec\nrounds: 122"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
"value": 119.83175982376699,
"unit": "iter/sec",
"range": "stddev: 0.00008787654747611926",
"extra": "mean: 8.34503308196984 msec\nrounds: 122"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
"value": 28340.345547267938,
"unit": "iter/sec",
"range": "stddev: 0.000002519622066049561",
"extra": "mean: 35.285384870559625 usec\nrounds: 29228"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
"value": 50.90462583987648,
"unit": "iter/sec",
"range": "stddev: 0.013912288917652628",
"extra": "mean: 19.644580104479296 msec\nrounds: 67"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
"value": 3.361008335304197,
"unit": "iter/sec",
"range": "stddev: 0.002830921932461325",
"extra": "mean: 297.52975899998546 msec\nrounds: 4"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
"value": 1.2257269221008256,
"unit": "iter/sec",
"range": "stddev: 0.0036327762663173743",
"extra": "mean: 815.8424050000121 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
"value": 0.13331849276903895,
"unit": "iter/sec",
"range": "stddev: 0.09727732985434842",
"extra": "mean: 7.500834874666642 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
"value": 1.2251941410270548,
"unit": "iter/sec",
"range": "stddev: 0.004391695529932511",
"extra": "mean: 816.1971776666519 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
"value": 3.1384018684615573,
"unit": "iter/sec",
"range": "stddev: 0.002542029296992333",
"extra": "mean: 318.6335089999801 msec\nrounds: 4"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
"value": 1.0066147142567419,
"unit": "iter/sec",
"range": "stddev: 0.002051709393816822",
"extra": "mean: 993.4287526666784 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
"value": 2.3872240068158734,
"unit": "iter/sec",
"range": "stddev: 0.0010269392858181336",
"extra": "mean: 418.8965916666613 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
"value": 3.289407433488978,
"unit": "iter/sec",
"range": "stddev: 0.0010748061503280725",
"extra": "mean: 304.00612274999617 msec\nrounds: 4"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
"value": 1.2301749651650227,
"unit": "iter/sec",
"range": "stddev: 0.0043333099344703",
"extra": "mean: 812.8924976666667 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
"value": 1.2305496784935768,
"unit": "iter/sec",
"range": "stddev: 0.003015240612167919",
"extra": "mean: 812.6449646666742 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
"value": 11340.288153023605,
"unit": "iter/sec",
"range": "stddev: 0.000003901612356037798",
"extra": "mean: 88.18118080477302 usec\nrounds: 11565"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
"value": 289.9681597601042,
"unit": "iter/sec",
"range": "stddev: 0.0000361988219127315",
"extra": "mean: 3.448654503402435 msec\nrounds: 294"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
"value": 29.059860165978122,
"unit": "iter/sec",
"range": "stddev: 0.0014305240464714",
"extra": "mean: 34.41172787096724 msec\nrounds: 31"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
"value": 17.507499547066608,
"unit": "iter/sec",
"range": "stddev: 0.0015048070308531347",
"extra": "mean: 57.11837931576874 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
"value": 5.556985316422843,
"unit": "iter/sec",
"range": "stddev: 0.0017268460334128875",
"extra": "mean: 179.95368766670103 msec\nrounds: 6"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
"value": 17.708757879435854,
"unit": "iter/sec",
"range": "stddev: 0.0013752567744382536",
"extra": "mean: 56.469234421079385 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
"value": 21.79128680872875,
"unit": "iter/sec",
"range": "stddev: 0.0018542199232643233",
"extra": "mean: 45.889901260876364 msec\nrounds: 23"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
"value": 17.984320296518906,
"unit": "iter/sec",
"range": "stddev: 0.0009299816638097145",
"extra": "mean: 55.603991894737476 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
"value": 17.289304949014454,
"unit": "iter/sec",
"range": "stddev: 0.001270773975868798",
"extra": "mean: 57.839225055545285 msec\nrounds: 18"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
"value": 29.239188523779085,
"unit": "iter/sec",
"range": "stddev: 0.0014959498998395528",
"extra": "mean: 34.20067554839079 msec\nrounds: 31"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
"value": 17.817677672357135,
"unit": "iter/sec",
"range": "stddev: 0.001383783754696893",
"extra": "mean: 56.124036947386756 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
"value": 17.759150933424944,
"unit": "iter/sec",
"range": "stddev: 0.0016959277377017507",
"extra": "mean: 56.308998315785175 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
"value": 21634.88649122908,
"unit": "iter/sec",
"range": "stddev: 0.0000026757751667644047",
"extra": "mean: 46.22164301187373 usec\nrounds: 22152"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
"value": 46.327834405448435,
"unit": "iter/sec",
"range": "stddev: 0.015185615721961138",
"extra": "mean: 21.585295596773978 msec\nrounds: 62"
},
{
"name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
"value": 172.17513332387918,
"unit": "iter/sec",
"range": "stddev: 0.00002677128999104223",
"extra": "mean: 5.80803964367431 msec\nrounds: 174"
},
{
"name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
"value": 14.300997857463418,
"unit": "iter/sec",
"range": "stddev: 0.00013719820272666488",
"extra": "mean: 69.92519053333885 msec\nrounds: 15"
},
{
"name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
"value": 1.1763978144211313,
"unit": "iter/sec",
"range": "stddev: 0.00895820682968673",
"extra": "mean: 850.052582333357 msec\nrounds: 3"
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
"id": "4b9f86443ecd7c6f321ab72177fdfb0345b7a725",
"message": "chore: release v0.8.0 (#196)\n\nchore: release v0.8.0",
"timestamp": "2026-03-18T17:46:16+01:00",
"tree_id": "51b2a9f5cf35a86a92a729f932c5c216a88c1b32",
"url": "https://github.com/kmarchais/mmgpy/commit/4b9f86443ecd7c6f321ab72177fdfb0345b7a725"
},
"date": 1773852920072,
"tool": "pytest",
"benches": [
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
"value": 1.144932681620197,
"unit": "iter/sec",
"range": "stddev: 0.015118442659666229",
"extra": "mean: 873.4137963333334 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
"value": 0.5641856850973391,
"unit": "iter/sec",
"range": "stddev: 0.01823781491285781",
"extra": "mean: 1.7724660983333347 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
"value": 1.1921107915057931,
"unit": "iter/sec",
"range": "stddev: 0.002078818634667729",
"extra": "mean: 838.8482070000123 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
"value": 1.2470284227174266,
"unit": "iter/sec",
"range": "stddev: 0.001381645203985583",
"extra": "mean: 801.9063413333262 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
"value": 1.1505136031361167,
"unit": "iter/sec",
"range": "stddev: 0.011533740750059251",
"extra": "mean: 869.1770330000091 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
"value": 0.5661752143009455,
"unit": "iter/sec",
"range": "stddev: 0.0071111940128193475",
"extra": "mean: 1.7662376853333228 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
"value": 1.2413715131619414,
"unit": "iter/sec",
"range": "stddev: 0.005316213756159681",
"extra": "mean: 805.5606153333296 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
"value": 1.2540192214762163,
"unit": "iter/sec",
"range": "stddev: 0.008225229323601554",
"extra": "mean: 797.4359426666618 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
"value": 31.02840961281299,
"unit": "iter/sec",
"range": "stddev: 0.0006909626899238172",
"extra": "mean: 32.228529031248065 msec\nrounds: 32"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
"value": 1.0739973498513844,
"unit": "iter/sec",
"range": "stddev: 0.0014187229651666656",
"extra": "mean: 931.1009940000096 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
"value": 119.43690827988779,
"unit": "iter/sec",
"range": "stddev: 0.00004128570364357892",
"extra": "mean: 8.372621280991345 msec\nrounds: 121"
},
{
"name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
"value": 12.366960484306627,
"unit": "iter/sec",
"range": "stddev: 0.0010733692405110321",
"extra": "mean: 80.86061253846293 msec\nrounds: 13"
},
{
"name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
"value": 1.0237175841963975,
"unit": "iter/sec",
"range": "stddev: 0.005089779202545956",
"extra": "mean: 976.8319069999999 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
"value": 17.731073458374475,
"unit": "iter/sec",
"range": "stddev: 0.0010755718084001999",
"extra": "mean: 56.398164631577615 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
"value": 371.48748433004056,
"unit": "iter/sec",
"range": "stddev: 0.00008989627270160268",
"extra": "mean: 2.6918807286427184 msec\nrounds: 398"
},
{
"name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
"value": 30.874625608379507,
"unit": "iter/sec",
"range": "stddev: 0.000238908780438652",
"extra": "mean: 32.38905671875081 msec\nrounds: 32"
},
{
"name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
"value": 149.3117556457806,
"unit": "iter/sec",
"range": "stddev: 0.00008958862798134552",
"extra": "mean: 6.697396301282182 msec\nrounds: 156"
},
{
"name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
"value": 248.7006759971866,
"unit": "iter/sec",
"range": "stddev: 0.00004949823247483384",
"extra": "mean: 4.02089779607721 msec\nrounds: 255"
},
{
"name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
"value": 274.5487717462425,
"unit": "iter/sec",
"range": "stddev: 0.0001449425760129616",
"extra": "mean: 3.6423400973152815 msec\nrounds: 298"
},
{
"name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
"value": 68.8355120142849,
"unit": "iter/sec",
"range": "stddev: 0.00021505255649822668",
"extra": "mean: 14.527385222216083 msec\nrounds: 72"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
"value": 872.7048486527796,
"unit": "iter/sec",
"range": "stddev: 0.000023925101579943823",
"extra": "mean: 1.1458627754202693 msec\nrounds: 895"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
"value": 31.915340339185736,
"unit": "iter/sec",
"range": "stddev: 0.0003926899514132085",
"extra": "mean: 31.3328947575783 msec\nrounds: 33"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
"value": 1714.9862443287811,
"unit": "iter/sec",
"range": "stddev: 0.00001642926937588452",
"extra": "mean: 583.0950558973052 usec\nrounds: 1789"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
"value": 80.97600820918225,
"unit": "iter/sec",
"range": "stddev: 0.00044172401406160377",
"extra": "mean: 12.349336823528494 msec\nrounds: 85"
},
{
"name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
"value": 81135.41683083827,
"unit": "iter/sec",
"range": "stddev: 0.0000010021274304149594",
"extra": "mean: 12.325073797117858 usec\nrounds: 83174"
},
{
"name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
"value": 27000.474330137604,
"unit": "iter/sec",
"range": "stddev: 0.0000022293461141013773",
"extra": "mean: 37.03638638984249 usec\nrounds: 27436"
},
{
"name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
"value": 6234.7871718317665,
"unit": "iter/sec",
"range": "stddev: 0.000004493081709036085",
"extra": "mean: 160.3903986519242 usec\nrounds: 6379"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
"value": 33.3138811948026,
"unit": "iter/sec",
"range": "stddev: 0.00025499248771025033",
"extra": "mean: 30.017517147056797 msec\nrounds: 34"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
"value": 32.87344193783988,
"unit": "iter/sec",
"range": "stddev: 0.000441492850497658",
"extra": "mean: 30.419692647058127 msec\nrounds: 34"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
"value": 32.48113732465225,
"unit": "iter/sec",
"range": "stddev: 0.0003508905859738076",
"extra": "mean: 30.787099294119503 msec\nrounds: 34"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
"value": 3139.7729675822634,
"unit": "iter/sec",
"range": "stddev: 0.000010235291883877302",
"extra": "mean: 318.4943657789485 usec\nrounds: 3267"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
"value": 2805.1033642424945,
"unit": "iter/sec",
"range": "stddev: 0.000010265251319644995",
"extra": "mean: 356.49310208932195 usec\nrounds: 2919"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
"value": 2104.356568821453,
"unit": "iter/sec",
"range": "stddev: 0.000014714590258962298",
"extra": "mean: 475.20463728257374 usec\nrounds: 2178"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
"value": 133.21271330180483,
"unit": "iter/sec",
"range": "stddev: 0.0004677181633884099",
"extra": "mean: 7.5067910202715735 msec\nrounds: 148"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
"value": 133.7203426206991,
"unit": "iter/sec",
"range": "stddev: 0.0004187943887623784",
"extra": "mean: 7.47829373154183 msec\nrounds: 149"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
"value": 133.80147429070774,
"unit": "iter/sec",
"range": "stddev: 0.0004486797858483777",
"extra": "mean: 7.4737592040826115 msec\nrounds: 147"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
"value": 33.09276492715183,
"unit": "iter/sec",
"range": "stddev: 0.0001825638644577933",
"extra": "mean: 30.218085499997724 msec\nrounds: 34"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
"value": 32.92849118979026,
"unit": "iter/sec",
"range": "stddev: 0.00029975136987140386",
"extra": "mean: 30.368837558826808 msec\nrounds: 34"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
"value": 7424.1006557689,
"unit": "iter/sec",
"range": "stddev: 0.000006522118344243072",
"extra": "mean: 134.696449626252 usec\nrounds: 7762"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
"value": 987829.4366475535,
"unit": "iter/sec",
"range": "stddev: 9.848785534368554e-8",
"extra": "mean: 1.0123205109110236 usec\nrounds: 102365"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
"value": 3388159.602601417,
"unit": "iter/sec",
"range": "stddev: 4.6125149654495234e-8",
"extra": "mean: 295.14548229434166 nsec\nrounds: 195351"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
"value": 1601177.8084903113,
"unit": "iter/sec",
"range": "stddev: 7.511303081452902e-8",
"extra": "mean: 624.5402569892356 nsec\nrounds: 164990"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
"value": 155073.66999186666,
"unit": "iter/sec",
"range": "stddev: 0.0000010554977645556043",
"extra": "mean: 6.4485479711188125 usec\nrounds: 173281"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
"value": 1061.5885638984244,
"unit": "iter/sec",
"range": "stddev: 0.00002064128083246241",
"extra": "mean: 941.9845258390357 usec\nrounds: 1103"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
"value": 118.26184853357775,
"unit": "iter/sec",
"range": "stddev: 0.00009514301270524962",
"extra": "mean: 8.455812355377422 msec\nrounds: 121"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
"value": 18.37961178993981,
"unit": "iter/sec",
"range": "stddev: 0.000159262097936497",
"extra": "mean: 54.4081132631624 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
"value": 118.69368682862128,
"unit": "iter/sec",
"range": "stddev: 0.0000883829339467754",
"extra": "mean: 8.425047925622817 msec\nrounds: 121"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
"value": 107.94947203567115,
"unit": "iter/sec",
"range": "stddev: 0.00007480124537590749",
"extra": "mean: 9.26359324545429 msec\nrounds: 110"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
"value": 118.13575319434729,
"unit": "iter/sec",
"range": "stddev: 0.00008051741091237094",
"extra": "mean: 8.464837891665885 msec\nrounds: 120"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
"value": 159.63061522940825,
"unit": "iter/sec",
"range": "stddev: 0.00004206470987054851",
"extra": "mean: 6.264462481478761 msec\nrounds: 162"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
"value": 1090.9248229449681,
"unit": "iter/sec",
"range": "stddev: 0.000020432121451235675",
"extra": "mean: 916.6534475771526 usec\nrounds: 1135"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
"value": 118.59408255868269,
"unit": "iter/sec",
"range": "stddev: 0.00007171915636992312",
"extra": "mean: 8.432123917356334 msec\nrounds: 121"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
"value": 119.23800333143987,
"unit": "iter/sec",
"range": "stddev: 0.000060569362794266196",
"extra": "mean: 8.386587933885059 msec\nrounds: 121"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
"value": 28248.81497251927,
"unit": "iter/sec",
"range": "stddev: 0.0000048872245410911615",
"extra": "mean: 35.39971503133176 usec\nrounds: 29126"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
"value": 49.94203870204795,
"unit": "iter/sec",
"range": "stddev: 0.014776387082244774",
"extra": "mean: 20.02321142646893 msec\nrounds: 68"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
"value": 3.2337237914145716,
"unit": "iter/sec",
"range": "stddev: 0.0028401472766460614",
"extra": "mean: 309.2410064999882 msec\nrounds: 4"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
"value": 1.2447223967459111,
"unit": "iter/sec",
"range": "stddev: 0.0028906232255479975",
"extra": "mean: 803.3919873333275 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
"value": 0.12846241022794255,
"unit": "iter/sec",
"range": "stddev: 0.070044038110796",
"extra": "mean: 7.784378311333323 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
"value": 1.247480703882207,
"unit": "iter/sec",
"range": "stddev: 0.0025994622510815114",
"extra": "mean: 801.6156056666546 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
"value": 3.081840665765064,
"unit": "iter/sec",
"range": "stddev: 0.005982140615772605",
"extra": "mean: 324.48140849999163 msec\nrounds: 4"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
"value": 0.9967631876429616,
"unit": "iter/sec",
"range": "stddev: 0.020581016158294555",
"extra": "mean: 1.003247323333331 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
"value": 2.2770682514910567,
"unit": "iter/sec",
"range": "stddev: 0.016900121040645696",
"extra": "mean: 439.1611886666927 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
"value": 3.1211266087271503,
"unit": "iter/sec",
"range": "stddev: 0.001995714262960841",
"extra": "mean: 320.3971275000015 msec\nrounds: 4"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
"value": 1.2411111895851812,
"unit": "iter/sec",
"range": "stddev: 0.0015640427470255205",
"extra": "mean: 805.7295820000073 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
"value": 1.218398401671177,
"unit": "iter/sec",
"range": "stddev: 0.009229079071508892",
"extra": "mean: 820.7495993333396 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
"value": 11387.940062388521,
"unit": "iter/sec",
"range": "stddev: 0.000003522434314884359",
"extra": "mean: 87.81219382272185 usec\nrounds: 11526"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
"value": 285.15698974727434,
"unit": "iter/sec",
"range": "stddev: 0.000039069687369378655",
"extra": "mean: 3.506840217685944 msec\nrounds: 294"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
"value": 26.263410327118837,
"unit": "iter/sec",
"range": "stddev: 0.0010613476782806348",
"extra": "mean: 38.075786333331926 msec\nrounds: 27"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
"value": 16.14726871712492,
"unit": "iter/sec",
"range": "stddev: 0.0007040615357779417",
"extra": "mean: 61.92997822222739 msec\nrounds: 18"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
"value": 5.443095606041918,
"unit": "iter/sec",
"range": "stddev: 0.0011708595897534963",
"extra": "mean: 183.71898500000347 msec\nrounds: 6"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
"value": 16.844449301258997,
"unit": "iter/sec",
"range": "stddev: 0.0014781995632688393",
"extra": "mean: 59.36673750000586 msec\nrounds: 18"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
"value": 20.97520883148417,
"unit": "iter/sec",
"range": "stddev: 0.0017995539293251483",
"extra": "mean: 47.675329863652266 msec\nrounds: 22"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
"value": 16.430726050312668,
"unit": "iter/sec",
"range": "stddev: 0.0011793230473889256",
"extra": "mean: 60.86158316667757 msec\nrounds: 18"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
"value": 16.152301656148925,
"unit": "iter/sec",
"range": "stddev: 0.0008676431281523777",
"extra": "mean: 61.91068129410001 msec\nrounds: 17"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
"value": 26.595481555338715,
"unit": "iter/sec",
"range": "stddev: 0.0007959628038092043",
"extra": "mean: 37.60037200000473 msec\nrounds: 27"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
"value": 16.91385280599657,
"unit": "iter/sec",
"range": "stddev: 0.0006035669599501883",
"extra": "mean: 59.123134833328095 msec\nrounds: 18"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
"value": 16.874981580834817,
"unit": "iter/sec",
"range": "stddev: 0.0007347449241682711",
"extra": "mean: 59.25932394117193 msec\nrounds: 17"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
"value": 21814.671675790614,
"unit": "iter/sec",
"range": "stddev: 0.0000027349479226197696",
"extra": "mean: 45.84070825644263 usec\nrounds: 22345"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
"value": 40.94547680927193,
"unit": "iter/sec",
"range": "stddev: 0.020059645625836595",
"extra": "mean: 24.422722066666815 msec\nrounds: 60"
},
{
"name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
"value": 170.41694704663206,
"unit": "iter/sec",
"range": "stddev: 0.00002479880603139327",
"extra": "mean: 5.867961005816898 msec\nrounds: 172"
},
{
"name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
"value": 14.090587938962702,
"unit": "iter/sec",
"range": "stddev: 0.0008086650546893676",
"extra": "mean: 70.96935942856167 msec\nrounds: 14"
},
{
"name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
"value": 1.0791291208284783,
"unit": "iter/sec",
"range": "stddev: 0.01610969268347986",
"extra": "mean: 926.6731669999521 msec\nrounds: 3"
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
"id": "8a0714be349ad1c2e7e9d0d02fbc9eb0b4208433",
"message": "docs: add conda-forge badge and install instructions (#198)\n\nAdd conda-forge badge, installation instructions, and a comparison\ntable explaining when to use PyPI vs conda-forge. Update both the\nREADME and the docs installation page.",
"timestamp": "2026-03-19T15:40:30+01:00",
"tree_id": "0061edb31836ec02b5e458b09ad121f8c9e2e7e4",
"url": "https://github.com/kmarchais/mmgpy/commit/8a0714be349ad1c2e7e9d0d02fbc9eb0b4208433"
},
"date": 1773931862296,
"tool": "pytest",
"benches": [
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
"value": 1.108000037417905,
"unit": "iter/sec",
"range": "stddev: 0.019244322560683955",
"extra": "mean: 902.5270453333292 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
"value": 0.5593236873349657,
"unit": "iter/sec",
"range": "stddev: 0.016352507057436738",
"extra": "mean: 1.7878735026666657 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
"value": 1.1697221008856395,
"unit": "iter/sec",
"range": "stddev: 0.001598301449443223",
"extra": "mean: 854.9039120000069 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
"value": 1.2026497197146904,
"unit": "iter/sec",
"range": "stddev: 0.011080013081739316",
"extra": "mean: 831.4973043333301 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
"value": 1.0929054492311647,
"unit": "iter/sec",
"range": "stddev: 0.005398757454486287",
"extra": "mean: 914.9922353333295 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
"value": 0.5445227079026858,
"unit": "iter/sec",
"range": "stddev: 0.029393128510451783",
"extra": "mean: 1.836470702666664 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
"value": 1.2124616272566515,
"unit": "iter/sec",
"range": "stddev: 0.000907643557288132",
"extra": "mean: 824.7683699999868 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
"value": 1.2073624527719584,
"unit": "iter/sec",
"range": "stddev: 0.003825221092082808",
"extra": "mean: 828.2516966666643 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
"value": 29.234340439764214,
"unit": "iter/sec",
"range": "stddev: 0.000809349041498731",
"extra": "mean: 34.206347225806105 msec\nrounds: 31"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
"value": 1.0488493710725957,
"unit": "iter/sec",
"range": "stddev: 0.002634202233473379",
"extra": "mean: 953.4257516666665 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
"value": 117.38662416863762,
"unit": "iter/sec",
"range": "stddev: 0.000295431203424356",
"extra": "mean: 8.518858150000122 msec\nrounds: 120"
},
{
"name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
"value": 11.568898252990888,
"unit": "iter/sec",
"range": "stddev: 0.002149362984994143",
"extra": "mean: 86.43865458333266 msec\nrounds: 12"
},
{
"name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
"value": 0.9994833970165714,
"unit": "iter/sec",
"range": "stddev: 0.005793458912883663",
"extra": "mean: 1.0005168700000127 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
"value": 16.488928913147575,
"unit": "iter/sec",
"range": "stddev: 0.001957545183403065",
"extra": "mean: 60.64675305881404 msec\nrounds: 17"
},
{
"name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
"value": 367.93703944009656,
"unit": "iter/sec",
"range": "stddev: 0.0002328445952112762",
"extra": "mean: 2.7178562982453114 msec\nrounds: 399"
},
{
"name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
"value": 27.88024063082627,
"unit": "iter/sec",
"range": "stddev: 0.0010427211183128772",
"extra": "mean: 35.86769616666553 msec\nrounds: 30"
},
{
"name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
"value": 145.3851612843499,
"unit": "iter/sec",
"range": "stddev: 0.0007734104638281296",
"extra": "mean: 6.878281051283917 msec\nrounds: 156"
},
{
"name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
"value": 232.05213995006227,
"unit": "iter/sec",
"range": "stddev: 0.0005388817466269576",
"extra": "mean: 4.309376333332674 msec\nrounds: 240"
},
{
"name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
"value": 268.8348855718943,
"unit": "iter/sec",
"range": "stddev: 0.00025041266961058875",
"extra": "mean: 3.719755335594535 msec\nrounds: 295"
},
{
"name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
"value": 69.33183482351852,
"unit": "iter/sec",
"range": "stddev: 0.0006289678201271832",
"extra": "mean: 14.423388657540379 msec\nrounds: 73"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
"value": 878.2056938221305,
"unit": "iter/sec",
"range": "stddev: 0.00004063760853097278",
"extra": "mean: 1.138685398004875 msec\nrounds: 902"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
"value": 30.533251540100174,
"unit": "iter/sec",
"range": "stddev: 0.00048228402047217303",
"extra": "mean: 32.75117943749528 msec\nrounds: 32"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
"value": 1697.4179750096384,
"unit": "iter/sec",
"range": "stddev: 0.00002510823197613859",
"extra": "mean: 589.1300874166375 usec\nrounds: 1796"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
"value": 69.92692585898344,
"unit": "iter/sec",
"range": "stddev: 0.00034665424401963046",
"extra": "mean: 14.300642960004097 msec\nrounds: 75"
},
{
"name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
"value": 92794.50121084967,
"unit": "iter/sec",
"range": "stddev: 0.0000011505520090878726",
"extra": "mean: 10.776500621817863 usec\nrounds: 94886"
},
{
"name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
"value": 26936.54369033411,
"unit": "iter/sec",
"range": "stddev: 0.000002149565977228498",
"extra": "mean: 37.12428778896526 usec\nrounds: 27475"
},
{
"name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
"value": 6256.86840030099,
"unit": "iter/sec",
"range": "stddev: 0.00001854427028420852",
"extra": "mean: 159.82436196866382 usec\nrounds: 6542"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
"value": 32.027252584554404,
"unit": "iter/sec",
"range": "stddev: 0.0006573599825780782",
"extra": "mean: 31.22340879411755 msec\nrounds: 34"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
"value": 30.95280172066547,
"unit": "iter/sec",
"range": "stddev: 0.0016921354975269027",
"extra": "mean: 32.30725312120471 msec\nrounds: 33"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
"value": 31.08437664237031,
"unit": "iter/sec",
"range": "stddev: 0.0007252010319128492",
"extra": "mean: 32.17050196969129 msec\nrounds: 33"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
"value": 2894.6397244026357,
"unit": "iter/sec",
"range": "stddev: 0.000011055188909365701",
"extra": "mean: 345.4661357576612 usec\nrounds: 3079"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
"value": 2580.44672999428,
"unit": "iter/sec",
"range": "stddev: 0.000011687968317192924",
"extra": "mean: 387.5297979905273 usec\nrounds: 2787"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
"value": 1994.4000204928718,
"unit": "iter/sec",
"range": "stddev: 0.000011824095016446978",
"extra": "mean: 501.40392585479026 usec\nrounds: 2077"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
"value": 119.40569456909162,
"unit": "iter/sec",
"range": "stddev: 0.00019771048218012547",
"extra": "mean: 8.374809958677229 msec\nrounds: 121"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
"value": 118.88918644532599,
"unit": "iter/sec",
"range": "stddev: 0.0001630583888196801",
"extra": "mean: 8.41119390164112 msec\nrounds: 122"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
"value": 121.72375035665273,
"unit": "iter/sec",
"range": "stddev: 0.00020675161432399456",
"extra": "mean: 8.215323608334302 msec\nrounds: 120"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
"value": 34.431012239194416,
"unit": "iter/sec",
"range": "stddev: 0.0010323649878806716",
"extra": "mean: 29.043584111118687 msec\nrounds: 36"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
"value": 32.104204597784396,
"unit": "iter/sec",
"range": "stddev: 0.0017240877305891836",
"extra": "mean: 31.148568000000004 msec\nrounds: 35"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
"value": 8899.476158363683,
"unit": "iter/sec",
"range": "stddev: 0.000005226917007957041",
"extra": "mean: 112.36616427813058 usec\nrounds: 9210"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
"value": 972817.9769958446,
"unit": "iter/sec",
"range": "stddev: 1.0072406982106727e-7",
"extra": "mean: 1.0279415303241992 usec\nrounds: 101338"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
"value": 3352858.6847360884,
"unit": "iter/sec",
"range": "stddev: 4.4108150876575897e-8",
"extra": "mean: 298.2529518922186 nsec\nrounds: 193462"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
"value": 1523401.5951269178,
"unit": "iter/sec",
"range": "stddev: 7.389035331900577e-8",
"extra": "mean: 656.4257272664125 nsec\nrounds: 157953"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
"value": 155674.74722026283,
"unit": "iter/sec",
"range": "stddev: 9.220490776299475e-7",
"extra": "mean: 6.423649421990766 usec\nrounds: 169463"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
"value": 1179.8458289837488,
"unit": "iter/sec",
"range": "stddev: 0.000022567881133476928",
"extra": "mean: 847.5683648102925 usec\nrounds: 1239"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
"value": 112.92661919839021,
"unit": "iter/sec",
"range": "stddev: 0.00021072049581796862",
"extra": "mean: 8.855308049585666 msec\nrounds: 121"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
"value": 18.14944521611608,
"unit": "iter/sec",
"range": "stddev: 0.00030560345878356593",
"extra": "mean: 55.09810289473942 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
"value": 110.94204258574958,
"unit": "iter/sec",
"range": "stddev: 0.00019364631578280665",
"extra": "mean: 9.013715420167046 msec\nrounds: 119"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
"value": 101.03540077898829,
"unit": "iter/sec",
"range": "stddev: 0.0001712236355559906",
"extra": "mean: 9.89752099056318 msec\nrounds: 106"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
"value": 111.66090885722242,
"unit": "iter/sec",
"range": "stddev: 0.00015194568211261995",
"extra": "mean: 8.955685657893678 msec\nrounds: 114"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
"value": 153.3206649578097,
"unit": "iter/sec",
"range": "stddev: 0.0001445275497277307",
"extra": "mean: 6.522278000002001 msec\nrounds: 158"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
"value": 1009.7567386255524,
"unit": "iter/sec",
"range": "stddev: 0.000037859178139885626",
"extra": "mean: 990.3375355149074 usec\nrounds: 1253"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
"value": 111.2849545191022,
"unit": "iter/sec",
"range": "stddev: 0.00019320998473692954",
"extra": "mean: 8.985940681032032 msec\nrounds: 116"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
"value": 113.49839397008598,
"unit": "iter/sec",
"range": "stddev: 0.00022767262600662536",
"extra": "mean: 8.810697358973762 msec\nrounds: 117"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
"value": 28213.808837261633,
"unit": "iter/sec",
"range": "stddev: 0.000002311820922549747",
"extra": "mean: 35.443637041990314 usec\nrounds: 29075"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
"value": 45.22107322677875,
"unit": "iter/sec",
"range": "stddev: 0.018842228564276933",
"extra": "mean: 22.113583969692826 msec\nrounds: 66"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
"value": 2.988346574220093,
"unit": "iter/sec",
"range": "stddev: 0.0039113781884375235",
"extra": "mean: 334.63320775000227 msec\nrounds: 4"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
"value": 1.1514278829349984,
"unit": "iter/sec",
"range": "stddev: 0.01578435050282067",
"extra": "mean: 868.4868716666756 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
"value": 0.11318351932517455,
"unit": "iter/sec",
"range": "stddev: 0.3004772643937118",
"extra": "mean: 8.83520857066668 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
"value": 1.1390970334530308,
"unit": "iter/sec",
"range": "stddev: 0.009488907823034312",
"extra": "mean: 877.8883366666529 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
"value": 2.6601346787704863,
"unit": "iter/sec",
"range": "stddev: 0.007895504377866689",
"extra": "mean: 375.92081633332936 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
"value": 0.9204201292410226,
"unit": "iter/sec",
"range": "stddev: 0.013225793229013747",
"extra": "mean: 1.0864603763333587 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
"value": 2.2117759748029235,
"unit": "iter/sec",
"range": "stddev: 0.002456047316967812",
"extra": "mean: 452.12535599999154 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
"value": 2.940321341544983,
"unit": "iter/sec",
"range": "stddev: 0.011634119523224148",
"extra": "mean: 340.0988816666389 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
"value": 1.178576334858407,
"unit": "iter/sec",
"range": "stddev: 0.010895053264946638",
"extra": "mean: 848.4813163333532 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
"value": 1.1649017877787442,
"unit": "iter/sec",
"range": "stddev: 0.006469590012466167",
"extra": "mean: 858.4414673333262 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
"value": 11331.284395345305,
"unit": "iter/sec",
"range": "stddev: 0.0000053558240961852205",
"extra": "mean: 88.25124894145121 usec\nrounds: 11569"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
"value": 287.4695540674417,
"unit": "iter/sec",
"range": "stddev: 0.00003823536396789693",
"extra": "mean: 3.4786292525621527 msec\nrounds: 293"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
"value": 24.161583478158597,
"unit": "iter/sec",
"range": "stddev: 0.002094401898278452",
"extra": "mean: 41.38801585185724 msec\nrounds: 27"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
"value": 15.5648021691201,
"unit": "iter/sec",
"range": "stddev: 0.002034820383366089",
"extra": "mean: 64.2475239411624 msec\nrounds: 17"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
"value": 5.343576870446094,
"unit": "iter/sec",
"range": "stddev: 0.0021961024469209552",
"extra": "mean: 187.14056600003914 msec\nrounds: 6"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
"value": 15.638179104186607,
"unit": "iter/sec",
"range": "stddev: 0.0023095729158349367",
"extra": "mean: 63.94606388235336 msec\nrounds: 17"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
"value": 20.37141312265521,
"unit": "iter/sec",
"range": "stddev: 0.0021728749703166694",
"extra": "mean: 49.0883962727108 msec\nrounds: 22"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
"value": 15.781293375055357,
"unit": "iter/sec",
"range": "stddev: 0.0024905577390857314",
"extra": "mean: 63.36616247060245 msec\nrounds: 17"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
"value": 15.197657719113115,
"unit": "iter/sec",
"range": "stddev: 0.0020188659082934256",
"extra": "mean: 65.79961323529245 msec\nrounds: 17"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
"value": 24.827117539416008,
"unit": "iter/sec",
"range": "stddev: 0.0019834904102812184",
"extra": "mean: 40.27853811109489 msec\nrounds: 27"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
"value": 16.157962553460333,
"unit": "iter/sec",
"range": "stddev: 0.0023938051414897003",
"extra": "mean: 61.88899105882897 msec\nrounds: 17"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
"value": 15.860500294477548,
"unit": "iter/sec",
"range": "stddev: 0.002209098792754391",
"extra": "mean: 63.049713529414255 msec\nrounds: 17"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
"value": 21717.28242668351,
"unit": "iter/sec",
"range": "stddev: 0.000002730655146676421",
"extra": "mean: 46.04627689380342 usec\nrounds: 22236"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
"value": 41.40973864214417,
"unit": "iter/sec",
"range": "stddev: 0.020244258682403125",
"extra": "mean: 24.148908754093515 msec\nrounds: 61"
},
{
"name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
"value": 170.86781689073177,
"unit": "iter/sec",
"range": "stddev: 0.00003202589716542015",
"extra": "mean: 5.852477184977963 msec\nrounds: 173"
},
{
"name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
"value": 13.934574280933468,
"unit": "iter/sec",
"range": "stddev: 0.0007268964403260095",
"extra": "mean: 71.76394339999965 msec\nrounds: 15"
},
{
"name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
"value": 1.0593739795082935,
"unit": "iter/sec",
"range": "stddev: 0.020360744608373775",
"extra": "mean: 943.9537116667225 msec\nrounds: 3"
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
"id": "874d5e80afd307cdfec5a25efead0a42cfdcf99a",
"message": "ci: add daily docs test against latest PyPI release (#197)\n\n* ci: add daily docs test against latest PyPI release\n\nScheduled workflow that installs the latest released mmgpy from PyPI\nand runs documentation code blocks and examples to catch breakage\nfrom upstream dependency updates.\n\n* ci: test on Python 3.10 and 3.14",
"timestamp": "2026-03-19T15:40:52+01:00",
"tree_id": "743fec4ada5dec596e9c73895a21a544918944ca",
"url": "https://github.com/kmarchais/mmgpy/commit/874d5e80afd307cdfec5a25efead0a42cfdcf99a"
},
"date": 1773932252075,
"tool": "pytest",
"benches": [
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
"value": 1.0985957830363602,
"unit": "iter/sec",
"range": "stddev: 0.004646597046431664",
"extra": "mean: 910.2529023333261 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
"value": 0.536359796836907,
"unit": "iter/sec",
"range": "stddev: 0.019608477951344752",
"extra": "mean: 1.8644201259999988 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
"value": 1.1273782222569788,
"unit": "iter/sec",
"range": "stddev: 0.01317019093410963",
"extra": "mean: 887.0137636666678 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
"value": 1.1957966265787798,
"unit": "iter/sec",
"range": "stddev: 0.007783655831183794",
"extra": "mean: 836.2626033333432 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
"value": 1.1357781607909343,
"unit": "iter/sec",
"range": "stddev: 0.002806389642944868",
"extra": "mean: 880.4536260000096 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
"value": 0.5410552790858209,
"unit": "iter/sec",
"range": "stddev: 0.012893141472861934",
"extra": "mean: 1.8482399833333527 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
"value": 1.1929349572375567,
"unit": "iter/sec",
"range": "stddev: 0.007285066363713076",
"extra": "mean: 838.2686699999718 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
"value": 1.1893296733673868,
"unit": "iter/sec",
"range": "stddev: 0.002826362393503246",
"extra": "mean: 840.8097623333219 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
"value": 27.925206229237872,
"unit": "iter/sec",
"range": "stddev: 0.0006336858952620807",
"extra": "mean: 35.80994144827456 msec\nrounds: 29"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
"value": 0.9894009963145365,
"unit": "iter/sec",
"range": "stddev: 0.013617399905933036",
"extra": "mean: 1.0107125459999982 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
"value": 113.95608827292999,
"unit": "iter/sec",
"range": "stddev: 0.0002386073578469706",
"extra": "mean: 8.77530999137979 msec\nrounds: 116"
},
{
"name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
"value": 11.652248628352343,
"unit": "iter/sec",
"range": "stddev: 0.001298447243988326",
"extra": "mean: 85.82034523077307 msec\nrounds: 13"
},
{
"name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
"value": 0.9293847995498787,
"unit": "iter/sec",
"range": "stddev: 0.019225084521263282",
"extra": "mean: 1.0759805846666761 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
"value": 16.679964521271923,
"unit": "iter/sec",
"range": "stddev: 0.001782208064881653",
"extra": "mean: 59.952165888884366 msec\nrounds: 18"
},
{
"name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
"value": 359.59952593483575,
"unit": "iter/sec",
"range": "stddev: 0.00033979286780941754",
"extra": "mean: 2.780871296758087 msec\nrounds: 401"
},
{
"name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
"value": 28.82426317633182,
"unit": "iter/sec",
"range": "stddev: 0.0005183423442194975",
"extra": "mean: 34.6929943666737 msec\nrounds: 30"
},
{
"name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
"value": 145.64816193742047,
"unit": "iter/sec",
"range": "stddev: 0.00032638033480289453",
"extra": "mean: 6.8658607612889915 msec\nrounds: 155"
},
{
"name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
"value": 228.38707162708383,
"unit": "iter/sec",
"range": "stddev: 0.00006640048332797987",
"extra": "mean: 4.378531555555059 msec\nrounds: 243"
},
{
"name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
"value": 269.73493815625164,
"unit": "iter/sec",
"range": "stddev: 0.00026641712271237023",
"extra": "mean: 3.70734324161122 msec\nrounds: 298"
},
{
"name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
"value": 71.34641458597754,
"unit": "iter/sec",
"range": "stddev: 0.0002085198700794616",
"extra": "mean: 14.016121283781239 msec\nrounds: 74"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
"value": 862.182237430699,
"unit": "iter/sec",
"range": "stddev: 0.00006754451313202251",
"extra": "mean: 1.1598476013377375 msec\nrounds: 898"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
"value": 34.103621991098294,
"unit": "iter/sec",
"range": "stddev: 0.0007859044114950579",
"extra": "mean: 29.322398666658327 msec\nrounds: 36"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
"value": 1694.479643047422,
"unit": "iter/sec",
"range": "stddev: 0.000022607120530871907",
"extra": "mean: 590.1516752373365 usec\nrounds: 1789"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
"value": 74.8856294822533,
"unit": "iter/sec",
"range": "stddev: 0.00024036049950563448",
"extra": "mean: 13.353696923079001 msec\nrounds: 78"
},
{
"name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
"value": 93187.97171709215,
"unit": "iter/sec",
"range": "stddev: 0.0000010485462000898154",
"extra": "mean: 10.730998664032347 usec\nrounds: 95058"
},
{
"name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
"value": 27109.99384994084,
"unit": "iter/sec",
"range": "stddev: 0.000002258970168876855",
"extra": "mean: 36.88676602197688 usec\nrounds: 27665"
},
{
"name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
"value": 6391.959494105561,
"unit": "iter/sec",
"range": "stddev: 0.000005385354896447386",
"extra": "mean: 156.44654834283048 usec\nrounds: 6547"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
"value": 35.97098896186063,
"unit": "iter/sec",
"range": "stddev: 0.0007719737939007252",
"extra": "mean: 27.800180891892673 msec\nrounds: 37"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
"value": 35.28945968966404,
"unit": "iter/sec",
"range": "stddev: 0.000843023899596988",
"extra": "mean: 28.337073131581292 msec\nrounds: 38"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
"value": 33.10924830028518,
"unit": "iter/sec",
"range": "stddev: 0.0007233938644308714",
"extra": "mean: 30.20304148648964 msec\nrounds: 37"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
"value": 3143.871296823015,
"unit": "iter/sec",
"range": "stddev: 0.00004109494142074868",
"extra": "mean: 318.07917868983145 usec\nrounds: 3923"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
"value": 2864.8052570722884,
"unit": "iter/sec",
"range": "stddev: 0.000040627834827532206",
"extra": "mean: 349.0638665687029 usec\nrounds: 3410"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
"value": 2010.5076475251803,
"unit": "iter/sec",
"range": "stddev: 0.00002136628022087808",
"extra": "mean: 497.38681731996525 usec\nrounds: 2425"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
"value": 116.76941866398299,
"unit": "iter/sec",
"range": "stddev: 0.00023275784544156945",
"extra": "mean: 8.563886087997162 msec\nrounds: 125"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
"value": 117.17468409276137,
"unit": "iter/sec",
"range": "stddev: 0.00011310471717466",
"extra": "mean: 8.53426666128965 msec\nrounds: 124"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
"value": 114.12220415644482,
"unit": "iter/sec",
"range": "stddev: 0.00021761756821437442",
"extra": "mean: 8.762536680672119 msec\nrounds: 119"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
"value": 33.68854934399661,
"unit": "iter/sec",
"range": "stddev: 0.0007828387822756198",
"extra": "mean: 29.683676485707824 msec\nrounds: 35"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
"value": 34.17283207614552,
"unit": "iter/sec",
"range": "stddev: 0.0003370413411437793",
"extra": "mean: 29.26301214285526 msec\nrounds: 35"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
"value": 8524.913701632215,
"unit": "iter/sec",
"range": "stddev: 0.000015885964149309118",
"extra": "mean: 117.3032402437735 usec\nrounds: 9353"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
"value": 964903.1269873374,
"unit": "iter/sec",
"range": "stddev: 1.2848289467135528e-7",
"extra": "mean: 1.036373468000092 usec\nrounds: 100211"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
"value": 3269494.835960484,
"unit": "iter/sec",
"range": "stddev: 4.5050105367324646e-8",
"extra": "mean: 305.8576477935402 nsec\nrounds: 191571"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
"value": 1557644.170418125,
"unit": "iter/sec",
"range": "stddev: 2.223573883498144e-7",
"extra": "mean: 641.9951481804511 nsec\nrounds: 178222"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
"value": 153577.96494104876,
"unit": "iter/sec",
"range": "stddev: 9.658554006447964e-7",
"extra": "mean: 6.51135076821634 usec\nrounds: 170329"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
"value": 996.8329420515705,
"unit": "iter/sec",
"range": "stddev: 0.0000204419657654074",
"extra": "mean: 1.003177120071806 msec\nrounds: 1116"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
"value": 113.6461066230465,
"unit": "iter/sec",
"range": "stddev: 0.00015924626766800867",
"extra": "mean: 8.799245567795001 msec\nrounds: 118"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
"value": 17.66222593469364,
"unit": "iter/sec",
"range": "stddev: 0.0033049071327865332",
"extra": "mean: 56.618005210527585 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
"value": 116.25109710496054,
"unit": "iter/sec",
"range": "stddev: 0.00006643678308362245",
"extra": "mean: 8.602069355931516 msec\nrounds: 118"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
"value": 105.08322724409065,
"unit": "iter/sec",
"range": "stddev: 0.00016051448249107566",
"extra": "mean: 9.516266546298281 msec\nrounds: 108"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
"value": 113.20490802219294,
"unit": "iter/sec",
"range": "stddev: 0.0001283338288893475",
"extra": "mean: 8.833539264957999 msec\nrounds: 117"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
"value": 154.7520241302369,
"unit": "iter/sec",
"range": "stddev: 0.00009560897802302106",
"extra": "mean: 6.461951018866258 msec\nrounds: 159"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
"value": 1021.5893603849925,
"unit": "iter/sec",
"range": "stddev: 0.000018928431850287957",
"extra": "mean: 978.8668899440609 usec\nrounds: 1054"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
"value": 113.5153788056572,
"unit": "iter/sec",
"range": "stddev: 0.00008728317663947672",
"extra": "mean: 8.809379050851245 msec\nrounds: 118"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
"value": 114.18894101446453,
"unit": "iter/sec",
"range": "stddev: 0.00009064160043538475",
"extra": "mean: 8.757415482759649 msec\nrounds: 116"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
"value": 28511.09536257551,
"unit": "iter/sec",
"range": "stddev: 0.000002476903962668791",
"extra": "mean: 35.074064580227564 usec\nrounds: 29297"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
"value": 47.998873928956385,
"unit": "iter/sec",
"range": "stddev: 0.016479958967168768",
"extra": "mean: 20.83382209091217 msec\nrounds: 66"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
"value": 3.306595860281221,
"unit": "iter/sec",
"range": "stddev: 0.0018098351787175268",
"extra": "mean: 302.4258307499821 msec\nrounds: 4"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
"value": 1.217519237881468,
"unit": "iter/sec",
"range": "stddev: 0.002908758012710375",
"extra": "mean: 821.3422579999966 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
"value": 0.11732746933812004,
"unit": "iter/sec",
"range": "stddev: 0.14314978718522392",
"extra": "mean: 8.523153236333352 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
"value": 1.2079696279390943,
"unit": "iter/sec",
"range": "stddev: 0.004492683334112678",
"extra": "mean: 827.8353833333464 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
"value": 3.0192591567120837,
"unit": "iter/sec",
"range": "stddev: 0.0007810886659373191",
"extra": "mean: 331.2070769999688 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
"value": 0.9517796841478859,
"unit": "iter/sec",
"range": "stddev: 0.013835388652901674",
"extra": "mean: 1.0506633169999684 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
"value": 2.3624701600234643,
"unit": "iter/sec",
"range": "stddev: 0.0006930101533677881",
"extra": "mean: 423.28576966663906 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
"value": 3.1581032431289606,
"unit": "iter/sec",
"range": "stddev: 0.0059047580209758465",
"extra": "mean: 316.6457595000054 msec\nrounds: 4"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
"value": 1.2208423967096378,
"unit": "iter/sec",
"range": "stddev: 0.0037330892534445164",
"extra": "mean: 819.1065469999709 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
"value": 1.2031605878421574,
"unit": "iter/sec",
"range": "stddev: 0.0025611404188169537",
"extra": "mean: 831.1442463333 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
"value": 11415.816619829011,
"unit": "iter/sec",
"range": "stddev: 0.0000036887503292690963",
"extra": "mean: 87.59776311254186 usec\nrounds: 11592"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
"value": 285.9803479591263,
"unit": "iter/sec",
"range": "stddev: 0.000043039627873997625",
"extra": "mean: 3.496743769760448 msec\nrounds: 291"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
"value": 24.794611994091795,
"unit": "iter/sec",
"range": "stddev: 0.0011398041341729652",
"extra": "mean: 40.33134296428135 msec\nrounds: 28"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
"value": 16.24402820313194,
"unit": "iter/sec",
"range": "stddev: 0.0015735426441115864",
"extra": "mean: 61.561084941184376 msec\nrounds: 17"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
"value": 5.414149354165598,
"unit": "iter/sec",
"range": "stddev: 0.0007895253379739002",
"extra": "mean: 184.70122166663336 msec\nrounds: 6"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
"value": 16.383113820122478,
"unit": "iter/sec",
"range": "stddev: 0.001000793539100633",
"extra": "mean: 61.038457705869995 msec\nrounds: 17"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
"value": 20.793471008885696,
"unit": "iter/sec",
"range": "stddev: 0.0023222256135994",
"extra": "mean: 48.09201886364566 msec\nrounds: 22"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
"value": 16.702296857816474,
"unit": "iter/sec",
"range": "stddev: 0.0012555165355546975",
"extra": "mean: 59.87200494116544 msec\nrounds: 17"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
"value": 16.101805983206383,
"unit": "iter/sec",
"range": "stddev: 0.0009400056734839032",
"extra": "mean: 62.10483476468198 msec\nrounds: 17"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
"value": 25.73124106878371,
"unit": "iter/sec",
"range": "stddev: 0.0011887527371793763",
"extra": "mean: 38.863263428562995 msec\nrounds: 28"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
"value": 16.328233923427398,
"unit": "iter/sec",
"range": "stddev: 0.0009870507318919157",
"extra": "mean: 61.24361058823524 msec\nrounds: 17"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
"value": 16.661313648851195,
"unit": "iter/sec",
"range": "stddev: 0.0017469868374013137",
"extra": "mean: 60.01927705556101 msec\nrounds: 18"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
"value": 21579.789422881466,
"unit": "iter/sec",
"range": "stddev: 0.0000028378313903560345",
"extra": "mean: 46.339655146944146 usec\nrounds: 22137"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
"value": 44.29357239995051,
"unit": "iter/sec",
"range": "stddev: 0.017151155810205602",
"extra": "mean: 22.576639133336585 msec\nrounds: 60"
},
{
"name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
"value": 172.06220839529934,
"unit": "iter/sec",
"range": "stddev: 0.000074309916697089",
"extra": "mean: 5.81185147701103 msec\nrounds: 174"
},
{
"name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
"value": 14.100300040284527,
"unit": "iter/sec",
"range": "stddev: 0.0008308920774568643",
"extra": "mean: 70.92047666666683 msec\nrounds: 15"
},
{
"name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
"value": 1.104559502739856,
"unit": "iter/sec",
"range": "stddev: 0.006566300325438569",
"extra": "mean: 905.3382796666938 msec\nrounds: 3"
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
"id": "1c59cee666b9303d3f10531761e479475146b099",
"message": "fix: skip conda/pixi code blocks in pytest-codeblocks (#199)\n\n* fix: skip conda/pixi code blocks in pytest-codeblocks\n\n* docs: add ELAS/Lagrangian motion to PyPI vs conda-forge comparison",
"timestamp": "2026-03-19T16:44:20+01:00",
"tree_id": "8aed5dbf2c1efaf0faa6381ae94615897b93e267",
"url": "https://github.com/kmarchais/mmgpy/commit/1c59cee666b9303d3f10531761e479475146b099"
},
"date": 1773935603052,
"tool": "pytest",
"benches": [
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
"value": 1.1563143276811858,
"unit": "iter/sec",
"range": "stddev: 0.0071649469064434465",
"extra": "mean: 864.8167510000064 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
"value": 0.5608729228294932,
"unit": "iter/sec",
"range": "stddev: 0.01503810287518913",
"extra": "mean: 1.782935063000006 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
"value": 1.20289450049748,
"unit": "iter/sec",
"range": "stddev: 0.0030173506925887162",
"extra": "mean: 831.3281003333467 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
"value": 1.2601920362285304,
"unit": "iter/sec",
"range": "stddev: 0.0056203358025919215",
"extra": "mean: 793.5298519999966 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
"value": 1.1631099664011948,
"unit": "iter/sec",
"range": "stddev: 0.020173141760697504",
"extra": "mean: 859.7639336666703 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
"value": 0.5610558829040855,
"unit": "iter/sec",
"range": "stddev: 0.0010527705317466562",
"extra": "mean: 1.7823536486666758 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
"value": 1.249086960629379,
"unit": "iter/sec",
"range": "stddev: 0.0036991925290846247",
"extra": "mean: 800.584772333328 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
"value": 1.2580146087416302,
"unit": "iter/sec",
"range": "stddev: 0.004572878107327091",
"extra": "mean: 794.9033286666539 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
"value": 28.20065621376031,
"unit": "iter/sec",
"range": "stddev: 0.0011427657499005648",
"extra": "mean: 35.46016774999927 msec\nrounds: 32"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
"value": 1.0554785835484517,
"unit": "iter/sec",
"range": "stddev: 0.009017514058696571",
"extra": "mean: 947.4375090000061 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
"value": 117.17430404499868,
"unit": "iter/sec",
"range": "stddev: 0.00011689126341713742",
"extra": "mean: 8.534294341666993 msec\nrounds: 120"
},
{
"name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
"value": 12.097036456097614,
"unit": "iter/sec",
"range": "stddev: 0.0013050852301690844",
"extra": "mean: 82.66487446154149 msec\nrounds: 13"
},
{
"name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
"value": 0.9689457336593301,
"unit": "iter/sec",
"range": "stddev: 0.0009410237706037186",
"extra": "mean: 1.0320495413333315 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
"value": 16.907375865356997,
"unit": "iter/sec",
"range": "stddev: 0.00179309163643383",
"extra": "mean: 59.145783944449214 msec\nrounds: 18"
},
{
"name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
"value": 380.0535402136218,
"unit": "iter/sec",
"range": "stddev: 0.0002077050216939809",
"extra": "mean: 2.6312082224991684 msec\nrounds: 400"
},
{
"name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
"value": 28.753826975530913,
"unit": "iter/sec",
"range": "stddev: 0.0019105553905492093",
"extra": "mean: 34.77797932257801 msec\nrounds: 31"
},
{
"name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
"value": 150.34416526099997,
"unit": "iter/sec",
"range": "stddev: 0.0001213923189964803",
"extra": "mean: 6.651405448718169 msec\nrounds: 156"
},
{
"name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
"value": 247.67761828621366,
"unit": "iter/sec",
"range": "stddev: 0.0001264030062256264",
"extra": "mean: 4.037506525294549 msec\nrounds: 257"
},
{
"name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
"value": 272.0341150796749,
"unit": "iter/sec",
"range": "stddev: 0.00028317964880105037",
"extra": "mean: 3.67600953177183 msec\nrounds: 299"
},
{
"name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
"value": 70.92067330057448,
"unit": "iter/sec",
"range": "stddev: 0.00025591856712477515",
"extra": "mean: 14.100260945941972 msec\nrounds: 74"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
"value": 878.0712073742269,
"unit": "iter/sec",
"range": "stddev: 0.00002465789057144458",
"extra": "mean: 1.1388598004373556 msec\nrounds: 912"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
"value": 33.9306058713556,
"unit": "iter/sec",
"range": "stddev: 0.0004014272247970508",
"extra": "mean: 29.471916999991013 msec\nrounds: 35"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
"value": 1725.0844943110903,
"unit": "iter/sec",
"range": "stddev: 0.00001783540326432278",
"extra": "mean: 579.6817508346734 usec\nrounds: 1798"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
"value": 77.01993096743315,
"unit": "iter/sec",
"range": "stddev: 0.0004996306766691395",
"extra": "mean: 12.983652249997947 msec\nrounds: 84"
},
{
"name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
"value": 92760.28779834195,
"unit": "iter/sec",
"range": "stddev: 0.0000010562529853835613",
"extra": "mean: 10.780475392378792 usec\nrounds: 94787"
},
{
"name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
"value": 27074.059887864354,
"unit": "iter/sec",
"range": "stddev: 0.000002118835011848825",
"extra": "mean: 36.935723867857696 usec\nrounds: 27581"
},
{
"name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
"value": 6382.378469656798,
"unit": "iter/sec",
"range": "stddev: 0.000005071008246559463",
"extra": "mean: 156.6814009470318 usec\nrounds: 6547"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
"value": 34.7770586203757,
"unit": "iter/sec",
"range": "stddev: 0.0005955118241999272",
"extra": "mean: 28.75458821621289 msec\nrounds: 37"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
"value": 34.45589374888246,
"unit": "iter/sec",
"range": "stddev: 0.0020944796834576665",
"extra": "mean: 29.022610972975674 msec\nrounds: 37"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
"value": 34.96788533345626,
"unit": "iter/sec",
"range": "stddev: 0.00036588142706980853",
"extra": "mean: 28.597668702694726 msec\nrounds: 37"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
"value": 4072.7319820010584,
"unit": "iter/sec",
"range": "stddev: 0.000007101473131083761",
"extra": "mean: 245.53543037434773 usec\nrounds: 4201"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
"value": 3480.6985263964325,
"unit": "iter/sec",
"range": "stddev: 0.000013227345915805855",
"extra": "mean: 287.2986535364498 usec\nrounds: 3605"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
"value": 2417.696022643881,
"unit": "iter/sec",
"range": "stddev: 0.00002358292279853697",
"extra": "mean: 413.61692728701524 usec\nrounds: 2503"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
"value": 122.19125528152757,
"unit": "iter/sec",
"range": "stddev: 0.0006001252144148058",
"extra": "mean: 8.183891700727756 msec\nrounds: 137"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
"value": 120.42207917658646,
"unit": "iter/sec",
"range": "stddev: 0.0005347548488446377",
"extra": "mean: 8.304125014596401 msec\nrounds: 137"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
"value": 128.26520838803242,
"unit": "iter/sec",
"range": "stddev: 0.000505835217320846",
"extra": "mean: 7.796346433826115 msec\nrounds: 136"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
"value": 36.000366448707226,
"unit": "iter/sec",
"range": "stddev: 0.00027364186945696213",
"extra": "mean: 27.777495027023818 msec\nrounds: 37"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
"value": 35.453335816351704,
"unit": "iter/sec",
"range": "stddev: 0.0002989451909922955",
"extra": "mean: 28.20609054053476 msec\nrounds: 37"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
"value": 9868.471084327308,
"unit": "iter/sec",
"range": "stddev: 0.000004350179452581095",
"extra": "mean: 101.3328195882499 usec\nrounds: 10149"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
"value": 981780.7227724914,
"unit": "iter/sec",
"range": "stddev: 1.198457390312975e-7",
"extra": "mean: 1.018557379264953 usec\nrounds: 101338"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
"value": 3222669.0897976244,
"unit": "iter/sec",
"range": "stddev: 9.212862624842969e-8",
"extra": "mean: 310.3017939898997 nsec\nrounds: 198808"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
"value": 1559911.3932491457,
"unit": "iter/sec",
"range": "stddev: 7.857862619199428e-8",
"extra": "mean: 641.0620528369217 nsec\nrounds: 162049"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
"value": 154675.2065980154,
"unit": "iter/sec",
"range": "stddev: 8.547635414697254e-7",
"extra": "mean: 6.465160267080781 usec\nrounds: 174490"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
"value": 1193.9703719275626,
"unit": "iter/sec",
"range": "stddev: 0.000028185819847771007",
"extra": "mean: 837.5417208934472 usec\nrounds: 1254"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
"value": 115.32431202328746,
"unit": "iter/sec",
"range": "stddev: 0.0001334950096536368",
"extra": "mean: 8.67119848760138 msec\nrounds: 121"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
"value": 18.288230851882908,
"unit": "iter/sec",
"range": "stddev: 0.00017639695069777557",
"extra": "mean: 54.67997468421297 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
"value": 115.95566133805988,
"unit": "iter/sec",
"range": "stddev: 0.0005556102813085598",
"extra": "mean: 8.623985999998537 msec\nrounds: 121"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
"value": 107.46841060601479,
"unit": "iter/sec",
"range": "stddev: 0.00011720819141719387",
"extra": "mean: 9.305059918174988 msec\nrounds: 110"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
"value": 117.13019226865828,
"unit": "iter/sec",
"range": "stddev: 0.00008348684458875002",
"extra": "mean: 8.53750839669355 msec\nrounds: 121"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
"value": 159.20061318319074,
"unit": "iter/sec",
"range": "stddev: 0.00008784997447249864",
"extra": "mean: 6.281382841467506 msec\nrounds: 164"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
"value": 1250.3575046677097,
"unit": "iter/sec",
"range": "stddev: 0.00003219017973385749",
"extra": "mean: 799.7712624324644 usec\nrounds: 1307"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
"value": 115.83344150914766,
"unit": "iter/sec",
"range": "stddev: 0.00012497738332365035",
"extra": "mean: 8.633085462811078 msec\nrounds: 121"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
"value": 116.66449852183368,
"unit": "iter/sec",
"range": "stddev: 0.0001475296938895472",
"extra": "mean: 8.571587866662375 msec\nrounds: 120"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
"value": 28066.640215193478,
"unit": "iter/sec",
"range": "stddev: 0.0000027489242142624947",
"extra": "mean: 35.629487260775306 usec\nrounds: 29280"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
"value": 47.62541933826566,
"unit": "iter/sec",
"range": "stddev: 0.017232308793395226",
"extra": "mean: 20.997190447760083 msec\nrounds: 67"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
"value": 3.2773837524498677,
"unit": "iter/sec",
"range": "stddev: 0.00139626835319648",
"extra": "mean: 305.1214247499985 msec\nrounds: 4"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
"value": 1.256137407293264,
"unit": "iter/sec",
"range": "stddev: 0.0026915421073385685",
"extra": "mean: 796.0912510000071 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
"value": 0.12333066102375512,
"unit": "iter/sec",
"range": "stddev: 0.09984691891421792",
"extra": "mean: 8.108283793333328 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
"value": 1.185418557980552,
"unit": "iter/sec",
"range": "stddev: 0.012326103254573286",
"extra": "mean: 843.5838913333479 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
"value": 2.9889201656026163,
"unit": "iter/sec",
"range": "stddev: 0.005059244715571132",
"extra": "mean: 334.56898966666887 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
"value": 0.923696757707076,
"unit": "iter/sec",
"range": "stddev: 0.013797365279082869",
"extra": "mean: 1.0826063766666607 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
"value": 2.304286522581121,
"unit": "iter/sec",
"range": "stddev: 0.005961251281817094",
"extra": "mean: 433.97380933333807 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
"value": 3.1573520569867863,
"unit": "iter/sec",
"range": "stddev: 0.002401973887362436",
"extra": "mean: 316.7210947499939 msec\nrounds: 4"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
"value": 1.167772144784899,
"unit": "iter/sec",
"range": "stddev: 0.006661910561017106",
"extra": "mean: 856.3314380000028 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
"value": 1.2327615813472153,
"unit": "iter/sec",
"range": "stddev: 0.007280941538727663",
"extra": "mean: 811.1868630000268 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
"value": 11430.80695070956,
"unit": "iter/sec",
"range": "stddev: 0.0000037971354333009293",
"extra": "mean: 87.48288763094942 usec\nrounds: 11560"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
"value": 286.7179471663925,
"unit": "iter/sec",
"range": "stddev: 0.00004013359882888013",
"extra": "mean: 3.4877481855702075 msec\nrounds: 291"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
"value": 25.50214889768502,
"unit": "iter/sec",
"range": "stddev: 0.0021829268886315485",
"extra": "mean: 39.21238182758692 msec\nrounds: 29"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
"value": 16.79559451779201,
"unit": "iter/sec",
"range": "stddev: 0.0018212770839091934",
"extra": "mean: 59.5394226111302 msec\nrounds: 18"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
"value": 5.479882943744636,
"unit": "iter/sec",
"range": "stddev: 0.0019366170386895577",
"extra": "mean: 182.4856498333626 msec\nrounds: 6"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
"value": 16.572544419782034,
"unit": "iter/sec",
"range": "stddev: 0.0018579481829866151",
"extra": "mean: 60.340764500008646 msec\nrounds: 18"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
"value": 20.904163626691123,
"unit": "iter/sec",
"range": "stddev: 0.002276028553886162",
"extra": "mean: 47.837359956519244 msec\nrounds: 23"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
"value": 16.719330281367697,
"unit": "iter/sec",
"range": "stddev: 0.0019838610332800133",
"extra": "mean: 59.81100816666185 msec\nrounds: 18"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
"value": 16.549042508255994,
"unit": "iter/sec",
"range": "stddev: 0.001724675089792351",
"extra": "mean: 60.42645666666936 msec\nrounds: 18"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
"value": 26.806640467031624,
"unit": "iter/sec",
"range": "stddev: 0.0017442762900781535",
"extra": "mean: 37.30418965516617 msec\nrounds: 29"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
"value": 16.81476532791977,
"unit": "iter/sec",
"range": "stddev: 0.0020513193339868115",
"extra": "mean: 59.47154066667634 msec\nrounds: 18"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
"value": 16.83926122026191,
"unit": "iter/sec",
"range": "stddev: 0.0017497063414121685",
"extra": "mean: 59.38502805555067 msec\nrounds: 18"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
"value": 21779.348014839252,
"unit": "iter/sec",
"range": "stddev: 0.0000026617744237099764",
"extra": "mean: 45.91505674635691 usec\nrounds: 22310"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
"value": 44.61257857915895,
"unit": "iter/sec",
"range": "stddev: 0.017251812626628314",
"extra": "mean: 22.415202883322156 msec\nrounds: 60"
},
{
"name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
"value": 172.30991627873223,
"unit": "iter/sec",
"range": "stddev: 0.00004626600412931797",
"extra": "mean: 5.80349652298814 msec\nrounds: 174"
},
{
"name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
"value": 14.192035511227,
"unit": "iter/sec",
"range": "stddev: 0.0008562868736439819",
"extra": "mean: 70.46205593333828 msec\nrounds: 15"
},
{
"name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
"value": 1.0974152509091866,
"unit": "iter/sec",
"range": "stddev: 0.0016497500344463756",
"extra": "mean: 911.2320966667085 msec\nrounds: 3"
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
"id": "ec7504dfab06aa78aa58fb468f29eb4e518c6ef7",
"message": "ci: add skip-existing to PyPI publish step (#201)\n\n* ci: add skip-existing to PyPI publish step\n\nThe v0.8.0 release deployment failed because the last wheel was\nalready uploaded to PyPI (400 Bad Request on duplicate). Adding\nskip-existing prevents this from marking the workflow as failed.\n\n* ci: add manual PyPI publish option to workflow dispatch",
"timestamp": "2026-03-19T19:21:35+01:00",
"tree_id": "3c6faa2806ec079e4ff0b20a508ed3735e0ef01d",
"url": "https://github.com/kmarchais/mmgpy/commit/ec7504dfab06aa78aa58fb468f29eb4e518c6ef7"
},
"date": 1773945450156,
"tool": "pytest",
"benches": [
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
"value": 1.1109776900970594,
"unit": "iter/sec",
"range": "stddev: 0.01720428407750174",
"extra": "mean: 900.108083999991 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
"value": 0.5508529915056098,
"unit": "iter/sec",
"range": "stddev: 0.017482474481822524",
"extra": "mean: 1.8153663779999931 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
"value": 1.163448632836735,
"unit": "iter/sec",
"range": "stddev: 0.003147028647580154",
"extra": "mean: 859.5136663333278 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
"value": 1.2406315953720262,
"unit": "iter/sec",
"range": "stddev: 0.002557358903007126",
"extra": "mean: 806.0410549999991 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
"value": 1.1527033858767641,
"unit": "iter/sec",
"range": "stddev: 0.02314359924987249",
"extra": "mean: 867.5258633333366 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
"value": 0.5540316812590094,
"unit": "iter/sec",
"range": "stddev: 0.007282203900308759",
"extra": "mean: 1.8049509329999864 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
"value": 1.2568388682309963,
"unit": "iter/sec",
"range": "stddev: 0.003025321662352859",
"extra": "mean: 795.646940333332 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
"value": 1.2595269114646863,
"unit": "iter/sec",
"range": "stddev: 0.0038110750370775846",
"extra": "mean: 793.948895333339 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
"value": 28.783926398856718,
"unit": "iter/sec",
"range": "stddev: 0.0008609265992307332",
"extra": "mean: 34.74161190322247 msec\nrounds: 31"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
"value": 1.0478668244452687,
"unit": "iter/sec",
"range": "stddev: 0.0034017409848990207",
"extra": "mean: 954.3197443333421 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
"value": 117.7646474012092,
"unit": "iter/sec",
"range": "stddev: 0.00020584811069245196",
"extra": "mean: 8.491512708335353 msec\nrounds: 120"
},
{
"name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
"value": 11.93246583413378,
"unit": "iter/sec",
"range": "stddev: 0.0014980910620242865",
"extra": "mean: 83.80497492307242 msec\nrounds: 13"
},
{
"name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
"value": 0.9898055812197687,
"unit": "iter/sec",
"range": "stddev: 0.0021194325619495417",
"extra": "mean: 1.010299415333331 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
"value": 16.80004601196595,
"unit": "iter/sec",
"range": "stddev: 0.0023727866117910328",
"extra": "mean: 59.52364650000024 msec\nrounds: 18"
},
{
"name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
"value": 343.45917012257917,
"unit": "iter/sec",
"range": "stddev: 0.0005127382104626355",
"extra": "mean: 2.911554231156804 msec\nrounds: 398"
},
{
"name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
"value": 28.972834892303524,
"unit": "iter/sec",
"range": "stddev: 0.0004005432796629975",
"extra": "mean: 34.515089866668326 msec\nrounds: 30"
},
{
"name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
"value": 145.53808721875166,
"unit": "iter/sec",
"range": "stddev: 0.0003387254380990598",
"extra": "mean: 6.871053612907153 msec\nrounds: 155"
},
{
"name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
"value": 252.5455406691911,
"unit": "iter/sec",
"range": "stddev: 0.00009270395782351355",
"extra": "mean: 3.959681875000509 msec\nrounds: 256"
},
{
"name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
"value": 267.70970950093266,
"unit": "iter/sec",
"range": "stddev: 0.00021810114191251825",
"extra": "mean: 3.7353893583621254 msec\nrounds: 293"
},
{
"name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
"value": 73.09390207475569,
"unit": "iter/sec",
"range": "stddev: 0.0002148411341218045",
"extra": "mean: 13.681031818184573 msec\nrounds: 77"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
"value": 872.5456299792926,
"unit": "iter/sec",
"range": "stddev: 0.000022251455208455742",
"extra": "mean: 1.1460718679248123 msec\nrounds: 901"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
"value": 32.24255064885335,
"unit": "iter/sec",
"range": "stddev: 0.0002967579274236186",
"extra": "mean: 31.0149160000021 msec\nrounds: 35"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
"value": 1637.4712604512113,
"unit": "iter/sec",
"range": "stddev: 0.000044875979724108034",
"extra": "mean: 610.6977411771161 usec\nrounds: 1785"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
"value": 74.3627789251582,
"unit": "iter/sec",
"range": "stddev: 0.00024184539210019552",
"extra": "mean: 13.447587818180406 msec\nrounds: 77"
},
{
"name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
"value": 93044.80419869893,
"unit": "iter/sec",
"range": "stddev: 0.000001003431536114153",
"extra": "mean: 10.747510391493558 usec\nrounds: 94886"
},
{
"name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
"value": 27079.590666415475,
"unit": "iter/sec",
"range": "stddev: 0.000002226988545988766",
"extra": "mean: 36.928180057027795 usec\nrounds: 27619"
},
{
"name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
"value": 6412.2140299032835,
"unit": "iter/sec",
"range": "stddev: 0.000004826599506384295",
"extra": "mean: 155.95237391274088 usec\nrounds: 6555"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
"value": 34.231081825621594,
"unit": "iter/sec",
"range": "stddev: 0.00037660142583912016",
"extra": "mean: 29.21321637142975 msec\nrounds: 35"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
"value": 34.053522292654065,
"unit": "iter/sec",
"range": "stddev: 0.00037385407232667017",
"extra": "mean: 29.365537914288456 msec\nrounds: 35"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
"value": 33.79513865678783,
"unit": "iter/sec",
"range": "stddev: 0.00029762132641668917",
"extra": "mean: 29.59005465714069 msec\nrounds: 35"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
"value": 3088.4439310432736,
"unit": "iter/sec",
"range": "stddev: 0.000007920876029381767",
"extra": "mean: 323.78764916162845 usec\nrounds: 3161"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
"value": 2754.8795948245865,
"unit": "iter/sec",
"range": "stddev: 0.000010500443060525818",
"extra": "mean: 362.9922708341356 usec\nrounds: 2832"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
"value": 2083.438884862105,
"unit": "iter/sec",
"range": "stddev: 0.000011129995131225629",
"extra": "mean: 479.97568215982784 usec\nrounds: 2130"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
"value": 121.42349013081764,
"unit": "iter/sec",
"range": "stddev: 0.00019344502347815124",
"extra": "mean: 8.23563874603368 msec\nrounds: 126"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
"value": 122.51073665766393,
"unit": "iter/sec",
"range": "stddev: 0.00015481143916356064",
"extra": "mean: 8.162549889764644 msec\nrounds: 127"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
"value": 116.63611869518674,
"unit": "iter/sec",
"range": "stddev: 0.0003075337337572658",
"extra": "mean: 8.573673500001911 msec\nrounds: 124"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
"value": 33.749551541983244,
"unit": "iter/sec",
"range": "stddev: 0.0005431058714317332",
"extra": "mean: 29.6300233428594 msec\nrounds: 35"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
"value": 34.58311684960644,
"unit": "iter/sec",
"range": "stddev: 0.00024345469166650905",
"extra": "mean: 28.915843657145096 msec\nrounds: 35"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
"value": 7162.707805823211,
"unit": "iter/sec",
"range": "stddev: 0.000005521530537748476",
"extra": "mean: 139.612005279206 usec\nrounds: 7387"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
"value": 1006009.5034488863,
"unit": "iter/sec",
"range": "stddev: 1.1246041047948107e-7",
"extra": "mean: 994.0263949512563 nsec\nrounds: 103660"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
"value": 3364920.939826752,
"unit": "iter/sec",
"range": "stddev: 4.2263082842459193e-8",
"extra": "mean: 297.1838024971507 nsec\nrounds: 194213"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
"value": 1638528.8054916225,
"unit": "iter/sec",
"range": "stddev: 7.592749091029026e-8",
"extra": "mean: 610.303582487194 nsec\nrounds: 169463"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
"value": 154479.27326104147,
"unit": "iter/sec",
"range": "stddev: 8.71117075174754e-7",
"extra": "mean: 6.473360334303131 usec\nrounds: 173883"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
"value": 1047.5430214728597,
"unit": "iter/sec",
"range": "stddev: 0.000023204719278963078",
"extra": "mean: 954.6147313300665 usec\nrounds: 1098"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
"value": 116.47775769672215,
"unit": "iter/sec",
"range": "stddev: 0.00018152419536961146",
"extra": "mean: 8.585330107433391 msec\nrounds: 121"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
"value": 18.219989810190945,
"unit": "iter/sec",
"range": "stddev: 0.00017694467659663723",
"extra": "mean: 54.8847727368471 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
"value": 115.12262943272336,
"unit": "iter/sec",
"range": "stddev: 0.00015166142707667693",
"extra": "mean: 8.68638950419727 msec\nrounds: 119"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
"value": 105.26878924125288,
"unit": "iter/sec",
"range": "stddev: 0.00022750536672680978",
"extra": "mean: 9.499491798164604 msec\nrounds: 109"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
"value": 113.97077491667437,
"unit": "iter/sec",
"range": "stddev: 0.00017633395070694113",
"extra": "mean: 8.774179176469703 msec\nrounds: 119"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
"value": 156.99761929004538,
"unit": "iter/sec",
"range": "stddev: 0.00011741486171062172",
"extra": "mean: 6.369523337500738 msec\nrounds: 160"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
"value": 1078.8318182330456,
"unit": "iter/sec",
"range": "stddev: 0.000022412724514463335",
"extra": "mean: 926.9285379790155 usec\nrounds: 1119"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
"value": 118.39700974300123,
"unit": "iter/sec",
"range": "stddev: 0.00005350089999991437",
"extra": "mean: 8.446159258334754 msec\nrounds: 120"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
"value": 117.33680592916858,
"unit": "iter/sec",
"range": "stddev: 0.00016497922533956154",
"extra": "mean: 8.522475041664753 msec\nrounds: 120"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
"value": 28603.22981122216,
"unit": "iter/sec",
"range": "stddev: 0.000002275134075156015",
"extra": "mean: 34.96108679334042 usec\nrounds: 29288"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
"value": 49.089819322239165,
"unit": "iter/sec",
"range": "stddev: 0.015782884756628944",
"extra": "mean: 20.370822582086177 msec\nrounds: 67"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
"value": 3.365734507758909,
"unit": "iter/sec",
"range": "stddev: 0.002510141119464717",
"extra": "mean: 297.1119669999922 msec\nrounds: 4"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
"value": 1.2840182685393886,
"unit": "iter/sec",
"range": "stddev: 0.0027155887092021693",
"extra": "mean: 778.8051186666772 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
"value": 0.13406379715785646,
"unit": "iter/sec",
"range": "stddev: 0.020417969804042955",
"extra": "mean: 7.459135286333321 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
"value": 1.2902789642215162,
"unit": "iter/sec",
"range": "stddev: 0.0030121126664876905",
"extra": "mean: 775.0261980000156 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
"value": 3.1421848223638613,
"unit": "iter/sec",
"range": "stddev: 0.001270105096979246",
"extra": "mean: 318.24989825000216 msec\nrounds: 4"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
"value": 1.0301864205052442,
"unit": "iter/sec",
"range": "stddev: 0.0015047805656252364",
"extra": "mean: 970.6980989999465 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
"value": 2.3869812381930005,
"unit": "iter/sec",
"range": "stddev: 0.007376890936123818",
"extra": "mean: 418.9391956666668 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
"value": 3.199801082445677,
"unit": "iter/sec",
"range": "stddev: 0.011196482954085379",
"extra": "mean: 312.5194267500149 msec\nrounds: 4"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
"value": 1.2842493467042368,
"unit": "iter/sec",
"range": "stddev: 0.0009479460004377017",
"extra": "mean: 778.6649863332968 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
"value": 1.2677601501954656,
"unit": "iter/sec",
"range": "stddev: 0.0115822634854029",
"extra": "mean: 788.7927380000216 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
"value": 11429.48664291325,
"unit": "iter/sec",
"range": "stddev: 0.000004098140662447459",
"extra": "mean: 87.49299345128865 usec\nrounds: 11605"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
"value": 290.21187312666774,
"unit": "iter/sec",
"range": "stddev: 0.000029497759248259406",
"extra": "mean: 3.4457584013578026 msec\nrounds: 294"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
"value": 28.850429431261286,
"unit": "iter/sec",
"range": "stddev: 0.0017365573195348288",
"extra": "mean: 34.661529124985435 msec\nrounds: 32"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
"value": 17.29038451204723,
"unit": "iter/sec",
"range": "stddev: 0.0014912418724321603",
"extra": "mean: 57.835613736828186 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
"value": 5.544005380080569,
"unit": "iter/sec",
"range": "stddev: 0.0017020048234298293",
"extra": "mean: 180.37500533332226 msec\nrounds: 6"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
"value": 17.123432593864838,
"unit": "iter/sec",
"range": "stddev: 0.0014346758959096506",
"extra": "mean: 58.39950573685153 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
"value": 21.453848012491775,
"unit": "iter/sec",
"range": "stddev: 0.0018579383256376605",
"extra": "mean: 46.611684739154356 msec\nrounds: 23"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
"value": 17.54299136014145,
"unit": "iter/sec",
"range": "stddev: 0.0016927889697246888",
"extra": "mean: 57.00282121052911 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
"value": 17.360815853330536,
"unit": "iter/sec",
"range": "stddev: 0.0019349970236254026",
"extra": "mean: 57.60097961111418 msec\nrounds: 18"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
"value": 28.272949170851188,
"unit": "iter/sec",
"range": "stddev: 0.001618731686798376",
"extra": "mean: 35.3694973225849 msec\nrounds: 31"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
"value": 17.23857849498525,
"unit": "iter/sec",
"range": "stddev: 0.0019341763158199203",
"extra": "mean: 58.00942347368738 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
"value": 17.24209863946314,
"unit": "iter/sec",
"range": "stddev: 0.001670184175849142",
"extra": "mean: 57.99758027779944 msec\nrounds: 18"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
"value": 21703.622381791152,
"unit": "iter/sec",
"range": "stddev: 0.0000023952652227630636",
"extra": "mean: 46.07525796426395 usec\nrounds: 22162"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
"value": 45.50713375186348,
"unit": "iter/sec",
"range": "stddev: 0.016517900533910584",
"extra": "mean: 21.974576677421503 msec\nrounds: 62"
},
{
"name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
"value": 172.70886736708042,
"unit": "iter/sec",
"range": "stddev: 0.000037423269347093095",
"extra": "mean: 5.790090660918824 msec\nrounds: 174"
},
{
"name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
"value": 14.503205740254424,
"unit": "iter/sec",
"range": "stddev: 0.000262784237817651",
"extra": "mean: 68.95027333332564 msec\nrounds: 15"
},
{
"name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
"value": 1.1355988333474032,
"unit": "iter/sec",
"range": "stddev: 0.0079440457792872",
"extra": "mean: 880.5926623333183 msec\nrounds: 3"
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
"id": "1f4e165b4e6cdc2c3b2d09ec973231c029e3ba0c",
"message": "fix(ci): install GL libraries for VTK in daily docs test (#202)\n\n* fix(ci): install GL libraries for VTK in daily docs test\n\n* fix(ci): use mesa-dev packages and xvfb for VTK rendering\n\n* fix(ci): use persistent Xvfb, osmesa, and add import verification step\n\n* fix(ci): add faulthandler and direct test to diagnose segfault\n\n* fix(ci): add exec() simulation and collect-only diagnostics\n\n* fix(ci): step-by-step isolation of conftest segfault\n\n* fix(ci): instrument conftest with catchsegv for C-level backtrace\n\n* fix(ci): use python faulthandler instead of catchsegv\n\n* fix(ci): standalone conftest reproduction script\n\n* fix(ci): test without conftest and without faulthandler plugin\n\n* fix(ci): isolate conftest vs code block vs collection\n\n* fix(ci): remove VTK object creation from conftest module level\n\n* fix(ci): fetch fixed conftest from PR branch, not HEAD\n\n* fix(ci): clean up workflow, use origin/main for conftest patch\n\n* fix(ci): re-add PR trigger to verify fix\n\n* fix(ci): use PR branch for conftest during PR, main otherwise\n\n* fix(ci): lazy mesh init in conftest to avoid VTK module-level objects\n\n* fix(ci): numpy UV sphere and scipy Delaunay, no VTK objects in conftest\n\n* fix(ci): remove PR trigger, use origin/main for conftest patch\n\n* fix(ci): jitter grid points to avoid degenerate tetrahedra in conftest\n\n* fix(ci): use smaller cube to avoid slow remeshing in doc tests\n\n* fix(ci): unit cube with resolution 3 to keep doc tests fast\n\n* fix(ci): 0.3-cube centered at (0.5,0.5,0.5) for fast tests with valid coords\n\n* fix(ci): add larger mesh for levelset domain tests\n\n* fix(ci): skip complex levelset example, remove slow large mesh\n\n* fix(ci): denser domain mesh for levelset, unskip the test\n\n* fix(ci): skip complex levelset example that needs VTK-quality mesh",
"timestamp": "2026-03-24T10:43:00+01:00",
"tree_id": "131b48446a241e13dae5c25564d2fed86047c0e6",
"url": "https://github.com/kmarchais/mmgpy/commit/1f4e165b4e6cdc2c3b2d09ec973231c029e3ba0c"
},
"date": 1774345906289,
"tool": "pytest",
"benches": [
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
"value": 1.1798513184718957,
"unit": "iter/sec",
"range": "stddev: 0.009222021231164392",
"extra": "mean: 847.5644213333311 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
"value": 0.5726065414229605,
"unit": "iter/sec",
"range": "stddev: 0.01200261267748698",
"extra": "mean: 1.7463998883333431 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
"value": 1.2200101928679636,
"unit": "iter/sec",
"range": "stddev: 0.0050947696665555615",
"extra": "mean: 819.6652829999967 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
"value": 1.2964835771104142,
"unit": "iter/sec",
"range": "stddev: 0.0011209675348920276",
"extra": "mean: 771.3171363333325 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
"value": 1.183269212303403,
"unit": "iter/sec",
"range": "stddev: 0.0051258230243434915",
"extra": "mean: 845.1162166666677 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
"value": 0.5769813848865069,
"unit": "iter/sec",
"range": "stddev: 0.016010849101977115",
"extra": "mean: 1.7331581679999981 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
"value": 1.303586441487622,
"unit": "iter/sec",
"range": "stddev: 0.0028334460656250417",
"extra": "mean: 767.1144530000049 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
"value": 1.2912357153298917,
"unit": "iter/sec",
"range": "stddev: 0.0015963649868590147",
"extra": "mean: 774.4519363333401 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
"value": 30.683740974641612,
"unit": "iter/sec",
"range": "stddev: 0.0008782262160593982",
"extra": "mean: 32.590550181819225 msec\nrounds: 33"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
"value": 1.0864166958472408,
"unit": "iter/sec",
"range": "stddev: 0.006961715278900703",
"extra": "mean: 920.457135666671 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
"value": 119.99692113684428,
"unit": "iter/sec",
"range": "stddev: 0.00007804796971157649",
"extra": "mean: 8.333547148760607 msec\nrounds: 121"
},
{
"name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
"value": 12.497064163251236,
"unit": "iter/sec",
"range": "stddev: 0.0009738883652396925",
"extra": "mean: 80.01879376922716 msec\nrounds: 13"
},
{
"name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
"value": 1.0301952692139171,
"unit": "iter/sec",
"range": "stddev: 0.001480934040537003",
"extra": "mean: 970.6897613333467 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
"value": 17.66246413958573,
"unit": "iter/sec",
"range": "stddev: 0.0017792725805918128",
"extra": "mean: 56.61724163157762 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
"value": 360.3884592965863,
"unit": "iter/sec",
"range": "stddev: 0.00029213720069305043",
"extra": "mean: 2.7747836374999935 msec\nrounds: 400"
},
{
"name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
"value": 29.91624683243256,
"unit": "iter/sec",
"range": "stddev: 0.0002028828581647715",
"extra": "mean: 33.42665293548414 msec\nrounds: 31"
},
{
"name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
"value": 148.02408442567082,
"unit": "iter/sec",
"range": "stddev: 0.0001919715411064794",
"extra": "mean: 6.755657391025056 msec\nrounds: 156"
},
{
"name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
"value": 255.61852074665097,
"unit": "iter/sec",
"range": "stddev: 0.00003751963356969282",
"extra": "mean: 3.9120795984541417 msec\nrounds: 259"
},
{
"name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
"value": 271.6072400305676,
"unit": "iter/sec",
"range": "stddev: 0.0004646622909305601",
"extra": "mean: 3.681786979932702 msec\nrounds: 299"
},
{
"name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
"value": 72.97131316884219,
"unit": "iter/sec",
"range": "stddev: 0.0003894091642186382",
"extra": "mean: 13.704015407893015 msec\nrounds: 76"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
"value": 885.2089618137198,
"unit": "iter/sec",
"range": "stddev: 0.000021509056074037558",
"extra": "mean: 1.1296767691450873 msec\nrounds: 901"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
"value": 33.632850361918884,
"unit": "iter/sec",
"range": "stddev: 0.00034828225443497824",
"extra": "mean: 29.732835285713982 msec\nrounds: 35"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
"value": 1715.9086844141107,
"unit": "iter/sec",
"range": "stddev: 0.000016647823618665614",
"extra": "mean: 582.7815950132833 usec\nrounds: 1805"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
"value": 79.9230923964942,
"unit": "iter/sec",
"range": "stddev: 0.000453560084645355",
"extra": "mean: 12.512028376467883 msec\nrounds: 85"
},
{
"name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
"value": 92933.1657701298,
"unit": "iter/sec",
"range": "stddev: 0.0000010365681311117826",
"extra": "mean: 10.760421123213431 usec\nrounds: 94787"
},
{
"name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
"value": 27036.977623855044,
"unit": "iter/sec",
"range": "stddev: 0.0000020393069644336897",
"extra": "mean: 36.98638264647185 usec\nrounds: 27626"
},
{
"name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
"value": 6197.584134732305,
"unit": "iter/sec",
"range": "stddev: 0.00000487300079005964",
"extra": "mean: 161.35319477081907 usec\nrounds: 6387"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
"value": 35.45289594410385,
"unit": "iter/sec",
"range": "stddev: 0.0001794639274291144",
"extra": "mean: 28.206440499998408 msec\nrounds: 36"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
"value": 35.344799074227936,
"unit": "iter/sec",
"range": "stddev: 0.00018022880152298917",
"extra": "mean: 28.292705749999907 msec\nrounds: 36"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
"value": 33.79817760170278,
"unit": "iter/sec",
"range": "stddev: 0.002620979661611519",
"extra": "mean: 29.587394083331258 msec\nrounds: 36"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
"value": 3172.8077803397487,
"unit": "iter/sec",
"range": "stddev: 0.000013393784798041898",
"extra": "mean: 315.1782488042558 usec\nrounds: 4180"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
"value": 2824.030902088992,
"unit": "iter/sec",
"range": "stddev: 0.000014084847274934772",
"extra": "mean: 354.10377388585937 usec\nrounds: 2941"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
"value": 2107.8978775502405,
"unit": "iter/sec",
"range": "stddev: 0.000015769683792508467",
"extra": "mean: 474.40628440794364 usec\nrounds: 2187"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
"value": 140.26502451152115,
"unit": "iter/sec",
"range": "stddev: 0.0003829529147049668",
"extra": "mean: 7.129361032677548 msec\nrounds: 153"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
"value": 136.80854359772226,
"unit": "iter/sec",
"range": "stddev: 0.0004355708918855004",
"extra": "mean: 7.309485019740018 msec\nrounds: 152"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
"value": 135.491568409798,
"unit": "iter/sec",
"range": "stddev: 0.00043484591427718657",
"extra": "mean: 7.38053306000173 msec\nrounds: 150"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
"value": 35.29527001237751,
"unit": "iter/sec",
"range": "stddev: 0.0001895478048770301",
"extra": "mean: 28.332408270267248 msec\nrounds: 37"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
"value": 34.8959213829346,
"unit": "iter/sec",
"range": "stddev: 0.00028490773850064447",
"extra": "mean: 28.65664411110913 msec\nrounds: 36"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
"value": 7474.141439560037,
"unit": "iter/sec",
"range": "stddev: 0.0000068794340527288846",
"extra": "mean: 133.79463154217012 usec\nrounds: 10069"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
"value": 979311.5359997371,
"unit": "iter/sec",
"range": "stddev: 1.1522119849437757e-7",
"extra": "mean: 1.0211255185298544 usec\nrounds: 101534"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
"value": 3293891.2011050843,
"unit": "iter/sec",
"range": "stddev: 4.261544201930492e-8",
"extra": "mean: 303.59229827157156 nsec\nrounds: 192345"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
"value": 1575891.9051194577,
"unit": "iter/sec",
"range": "stddev: 8.681031682392184e-8",
"extra": "mean: 634.5612898647365 nsec\nrounds: 163908"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
"value": 157170.14945400404,
"unit": "iter/sec",
"range": "stddev: 9.818532098585302e-7",
"extra": "mean: 6.3625313297335175 usec\nrounds: 171498"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
"value": 1063.1364496700344,
"unit": "iter/sec",
"range": "stddev: 0.000028978929962805916",
"extra": "mean: 940.6130326077804 usec\nrounds: 1104"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
"value": 119.76724662928628,
"unit": "iter/sec",
"range": "stddev: 0.000049440175365955936",
"extra": "mean: 8.349528173552196 msec\nrounds: 121"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
"value": 18.368218813606433,
"unit": "iter/sec",
"range": "stddev: 0.00042346218589561676",
"extra": "mean: 54.44186015789622 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
"value": 119.39368394284715,
"unit": "iter/sec",
"range": "stddev: 0.00007166529334847423",
"extra": "mean: 8.375652438019188 msec\nrounds: 121"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
"value": 108.41953942574995,
"unit": "iter/sec",
"range": "stddev: 0.00010913440946563637",
"extra": "mean: 9.223429700002002 msec\nrounds: 110"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
"value": 118.52576819834833,
"unit": "iter/sec",
"range": "stddev: 0.00009423044565988548",
"extra": "mean: 8.436983916666444 msec\nrounds: 120"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
"value": 159.48584315945016,
"unit": "iter/sec",
"range": "stddev: 0.00004634909050058236",
"extra": "mean: 6.2701489999975974 msec\nrounds: 162"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
"value": 1087.6697010266946,
"unit": "iter/sec",
"range": "stddev: 0.000020711309534841462",
"extra": "mean: 919.3967608512586 usec\nrounds: 1129"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
"value": 119.12266515464799,
"unit": "iter/sec",
"range": "stddev: 0.00026666122357135643",
"extra": "mean: 8.394708082645526 msec\nrounds: 121"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
"value": 119.56148038617816,
"unit": "iter/sec",
"range": "stddev: 0.000048786351103358935",
"extra": "mean: 8.363897776859615 msec\nrounds: 121"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
"value": 28100.966218423695,
"unit": "iter/sec",
"range": "stddev: 0.0000022863892861708247",
"extra": "mean: 35.58596498879013 usec\nrounds: 28848"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
"value": 49.2665949712653,
"unit": "iter/sec",
"range": "stddev: 0.014639675417995447",
"extra": "mean: 20.297729132351225 msec\nrounds: 68"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
"value": 3.493643302037307,
"unit": "iter/sec",
"range": "stddev: 0.0012149814598978576",
"extra": "mean: 286.23414400000513 msec\nrounds: 4"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
"value": 1.288576839466303,
"unit": "iter/sec",
"range": "stddev: 0.0007417142415986772",
"extra": "mean: 776.0499563333573 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
"value": 0.13178710920552747,
"unit": "iter/sec",
"range": "stddev: 0.05328946233725545",
"extra": "mean: 7.5879955636666905 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
"value": 1.2913624467840248,
"unit": "iter/sec",
"range": "stddev: 0.00456635673464928",
"extra": "mean: 774.3759333333363 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
"value": 3.2326882975266495,
"unit": "iter/sec",
"range": "stddev: 0.0019065076462672901",
"extra": "mean: 309.3400625000271 msec\nrounds: 4"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
"value": 1.060422012047849,
"unit": "iter/sec",
"range": "stddev: 0.0003865272879131721",
"extra": "mean: 943.0207866666555 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
"value": 2.4888015420573333,
"unit": "iter/sec",
"range": "stddev: 0.0021580124777349553",
"extra": "mean: 401.7998153333527 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
"value": 3.416812004395484,
"unit": "iter/sec",
"range": "stddev: 0.002792458259598691",
"extra": "mean: 292.67047725001305 msec\nrounds: 4"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
"value": 1.2973562845110498,
"unit": "iter/sec",
"range": "stddev: 0.002875168019203355",
"extra": "mean: 770.7982856666717 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
"value": 1.2945142472871982,
"unit": "iter/sec",
"range": "stddev: 0.0008388881850717676",
"extra": "mean: 772.490532333355 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
"value": 11426.884389845458,
"unit": "iter/sec",
"range": "stddev: 0.000003353199037054606",
"extra": "mean: 87.51291829719163 usec\nrounds: 11603"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
"value": 292.37980823343236,
"unit": "iter/sec",
"range": "stddev: 0.00002604066596014907",
"extra": "mean: 3.42020882372839 msec\nrounds: 295"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
"value": 29.78759146196207,
"unit": "iter/sec",
"range": "stddev: 0.001571138742837897",
"extra": "mean: 33.571025749999706 msec\nrounds: 32"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
"value": 17.78772032703388,
"unit": "iter/sec",
"range": "stddev: 0.001434613044182532",
"extra": "mean: 56.21855873684916 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
"value": 5.504867777962084,
"unit": "iter/sec",
"range": "stddev: 0.0016255884728602018",
"extra": "mean: 181.6574058333155 msec\nrounds: 6"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
"value": 17.538274040821097,
"unit": "iter/sec",
"range": "stddev: 0.001820939695912419",
"extra": "mean: 57.018153421052524 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
"value": 22.18258131269225,
"unit": "iter/sec",
"range": "stddev: 0.002039383909210369",
"extra": "mean: 45.08041629167062 msec\nrounds: 24"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
"value": 17.713639799860335,
"unit": "iter/sec",
"range": "stddev: 0.0018443040127406245",
"extra": "mean: 56.453671368426754 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
"value": 17.459295254313812,
"unit": "iter/sec",
"range": "stddev: 0.0019757434886391776",
"extra": "mean: 57.27608047369047 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
"value": 29.66696528568155,
"unit": "iter/sec",
"range": "stddev: 0.0016063879158596307",
"extra": "mean: 33.70752587500547 msec\nrounds: 32"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
"value": 17.73043687261942,
"unit": "iter/sec",
"range": "stddev: 0.0017416608633606283",
"extra": "mean: 56.40018952630941 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
"value": 17.709258894541303,
"unit": "iter/sec",
"range": "stddev: 0.0015608472667275964",
"extra": "mean: 56.467636842117635 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
"value": 21815.407679727756,
"unit": "iter/sec",
"range": "stddev: 0.0000024184446007519645",
"extra": "mean: 45.83916169163608 usec\nrounds: 22345"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
"value": 47.82365621020453,
"unit": "iter/sec",
"range": "stddev: 0.013908926902268937",
"extra": "mean: 20.91015366128827 msec\nrounds: 62"
},
{
"name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
"value": 172.61285205072878,
"unit": "iter/sec",
"range": "stddev: 0.00002952790854599456",
"extra": "mean: 5.79331137930629 msec\nrounds: 174"
},
{
"name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
"value": 14.476122320953706,
"unit": "iter/sec",
"range": "stddev: 0.00024117137371501272",
"extra": "mean: 69.07927259999269 msec\nrounds: 15"
},
{
"name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
"value": 1.1471568282413132,
"unit": "iter/sec",
"range": "stddev: 0.004284381418442742",
"extra": "mean: 871.7203920000051 msec\nrounds: 3"
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
"id": "28a6af449894321a4acb2e7cbcd2dd25605d8cf1",
"message": "Add set_required_triangles API and tests (#206)\n\n* Add set_required_triangles API and tests\n\nExpose a new set_required_triangles method for MmgMesh, MmgMesh2D and MmgMeshS in the pybind11 bindings and implement the corresponding C++ methods and headers. The implementations validate a 1D int array, check bounds against mesh->nt, and call the underlying MMG*_Set_requiredTriangle API (converting to 1-based indices). Updated type stubs (_mmgpy.pyi) to include the new method signatures and added unit tests for 3D, 2D and surface meshes to exercise setting required triangles.\n\n* fix: resolve ty type checker errors and clang-format issue\n\n- Use cast(\"MmgMesh3D\", self._impl) for tetrahedra-only methods\n  instead of type: ignore suppression comments\n- Preserve dict[str, Any] type for kwargs by using update() instead\n  of reassignment from options.to_dict()\n- Pass named arguments directly in remesh_optimize/remesh_uniform\n  instead of dict spreading\n- Use dict[str, Any] for filtered_options in lagrangian.py\n- Fix clang-format: join split function signature in mmg_mesh.cpp\n\n---------\n\nCo-authored-by: Kevin Marchais <kevinmarchais@gmail.com>",
"timestamp": "2026-03-31T11:32:19+02:00",
"tree_id": "17b415ddf7a993b88914e8f99b8cb42df26bc9ec",
"url": "https://github.com/kmarchais/mmgpy/commit/28a6af449894321a4acb2e7cbcd2dd25605d8cf1"
},
"date": 1774950085765,
"tool": "pytest",
"benches": [
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
"value": 1.1536459150809704,
"unit": "iter/sec",
"range": "stddev: 0.013693892080915421",
"extra": "mean: 866.817094333328 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
"value": 0.5689899638951791,
"unit": "iter/sec",
"range": "stddev: 0.019365735865570388",
"extra": "mean: 1.75750024333333 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
"value": 1.1707637654560463,
"unit": "iter/sec",
"range": "stddev: 0.0023839328993145795",
"extra": "mean: 854.1432776666701 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
"value": 1.1868510082333812,
"unit": "iter/sec",
"range": "stddev: 0.03018621630798407",
"extra": "mean: 842.5657416666752 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
"value": 1.1313253846107643,
"unit": "iter/sec",
"range": "stddev: 0.006878888880430754",
"extra": "mean: 883.918997666664 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
"value": 0.5600058559289697,
"unit": "iter/sec",
"range": "stddev: 0.01471686672576504",
"extra": "mean: 1.785695612666662 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
"value": 1.2371832694998675,
"unit": "iter/sec",
"range": "stddev: 0.0019486172189241452",
"extra": "mean: 808.2876843333414 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
"value": 1.2129797748888385,
"unit": "iter/sec",
"range": "stddev: 0.034750319962281166",
"extra": "mean: 824.4160543333408 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
"value": 27.002203973892367,
"unit": "iter/sec",
"range": "stddev: 0.0007812456036455976",
"extra": "mean: 37.03401400000053 msec\nrounds: 31"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
"value": 1.0620452424051292,
"unit": "iter/sec",
"range": "stddev: 0.0010058982086671307",
"extra": "mean: 941.579473333339 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
"value": 115.88002022510035,
"unit": "iter/sec",
"range": "stddev: 0.00013652164536466887",
"extra": "mean: 8.629615338843319 msec\nrounds: 121"
},
{
"name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
"value": 12.967259087939281,
"unit": "iter/sec",
"range": "stddev: 0.0006446821836733622",
"extra": "mean: 77.11729928571336 msec\nrounds: 14"
},
{
"name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
"value": 1.0194242777129294,
"unit": "iter/sec",
"range": "stddev: 0.0039126951379455",
"extra": "mean: 980.945835666669 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
"value": 19.560366639065172,
"unit": "iter/sec",
"range": "stddev: 0.0012724509076981981",
"extra": "mean: 51.12378609523814 msec\nrounds: 21"
},
{
"name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
"value": 410.1935528225422,
"unit": "iter/sec",
"range": "stddev: 0.00010546364011424",
"extra": "mean: 2.4378735187791203 msec\nrounds: 426"
},
{
"name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
"value": 36.02885338979629,
"unit": "iter/sec",
"range": "stddev: 0.00014535384879840114",
"extra": "mean: 27.755532189187278 msec\nrounds: 37"
},
{
"name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
"value": 154.8601828888999,
"unit": "iter/sec",
"range": "stddev: 0.0032792680579267577",
"extra": "mean: 6.457437808383721 msec\nrounds: 167"
},
{
"name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
"value": 274.1942827218867,
"unit": "iter/sec",
"range": "stddev: 0.0003873577385408884",
"extra": "mean: 3.647049056140579 msec\nrounds: 285"
},
{
"name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
"value": 278.96126944399896,
"unit": "iter/sec",
"range": "stddev: 0.0012245368454842922",
"extra": "mean: 3.584727019607818 msec\nrounds: 306"
},
{
"name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
"value": 81.16545283404498,
"unit": "iter/sec",
"range": "stddev: 0.0018667710827335714",
"extra": "mean: 12.320512793104857 msec\nrounds: 87"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
"value": 896.3685152565366,
"unit": "iter/sec",
"range": "stddev: 0.00004056704433685703",
"extra": "mean: 1.1156125889961725 msec\nrounds: 927"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
"value": 41.13363337719797,
"unit": "iter/sec",
"range": "stddev: 0.00014541469599349408",
"extra": "mean: 24.311005809526673 msec\nrounds: 42"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
"value": 1921.746883770214,
"unit": "iter/sec",
"range": "stddev: 0.000040747043916623045",
"extra": "mean: 520.3598915368771 usec\nrounds: 2056"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
"value": 90.96495760633766,
"unit": "iter/sec",
"range": "stddev: 0.00028214422319513025",
"extra": "mean: 10.993244281249778 msec\nrounds: 96"
},
{
"name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
"value": 82729.28547604298,
"unit": "iter/sec",
"range": "stddev: 0.0000010776181338401206",
"extra": "mean: 12.087617997010058 usec\nrounds: 84481"
},
{
"name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
"value": 24865.805232167735,
"unit": "iter/sec",
"range": "stddev: 0.0000021349558115328763",
"extra": "mean: 40.21587037552866 usec\nrounds: 25273"
},
{
"name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
"value": 8774.247347742827,
"unit": "iter/sec",
"range": "stddev: 0.000014434694403560318",
"extra": "mean: 113.96988942387746 usec\nrounds: 9134"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
"value": 43.68328590289516,
"unit": "iter/sec",
"range": "stddev: 0.0010110326875833518",
"extra": "mean: 22.892050800000003 msec\nrounds: 45"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
"value": 43.19779403725698,
"unit": "iter/sec",
"range": "stddev: 0.0013921683215853537",
"extra": "mean: 23.149330244445487 msec\nrounds: 45"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
"value": 41.58884806380713,
"unit": "iter/sec",
"range": "stddev: 0.003146782542148768",
"extra": "mean: 24.044907386368664 msec\nrounds: 44"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
"value": 3484.44325811302,
"unit": "iter/sec",
"range": "stddev: 0.000036146000715721627",
"extra": "mean: 286.98989362838535 usec\nrounds: 3751"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
"value": 3115.504547205117,
"unit": "iter/sec",
"range": "stddev: 0.000008899258684224483",
"extra": "mean: 320.97529785250623 usec\nrounds: 3260"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
"value": 2212.1142860997725,
"unit": "iter/sec",
"range": "stddev: 0.000009733766870507097",
"extra": "mean: 452.0562098819596 usec\nrounds: 2287"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
"value": 163.75688806794662,
"unit": "iter/sec",
"range": "stddev: 0.0002899215791141111",
"extra": "mean: 6.106613357143647 msec\nrounds: 182"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
"value": 156.57896247649578,
"unit": "iter/sec",
"range": "stddev: 0.0012636142661247116",
"extra": "mean: 6.386554005619439 msec\nrounds: 178"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
"value": 155.376415964778,
"unit": "iter/sec",
"range": "stddev: 0.0004345387749555678",
"extra": "mean: 6.435983181814981 msec\nrounds: 176"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
"value": 43.7507088343995,
"unit": "iter/sec",
"range": "stddev: 0.0001938054339850249",
"extra": "mean: 22.8567725333341 msec\nrounds: 45"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
"value": 37.66045992158588,
"unit": "iter/sec",
"range": "stddev: 0.007151861040074152",
"extra": "mean: 26.55304800000143 msec\nrounds: 45"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
"value": 8616.281840214313,
"unit": "iter/sec",
"range": "stddev: 0.000010977792769574884",
"extra": "mean: 116.05934189997748 usec\nrounds: 9611"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
"value": 992426.5142204666,
"unit": "iter/sec",
"range": "stddev: 1.1046440008796438e-7",
"extra": "mean: 1.0076312811790222 usec\nrounds: 104232"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
"value": 3748270.3266801992,
"unit": "iter/sec",
"range": "stddev: 4.46510614423562e-8",
"extra": "mean: 266.7897224172966 nsec\nrounds: 197707"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
"value": 1748649.0732327863,
"unit": "iter/sec",
"range": "stddev: 1.0585121781265644e-7",
"extra": "mean: 571.8700311614075 nsec\nrounds: 183554"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
"value": 154789.0283365555,
"unit": "iter/sec",
"range": "stddev: 8.148415211226474e-7",
"extra": "mean: 6.460406210611485 usec\nrounds: 158504"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
"value": 1131.8221191931045,
"unit": "iter/sec",
"range": "stddev: 0.00007905834081996532",
"extra": "mean: 883.5310629137706 usec\nrounds: 1208"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
"value": 119.01094789186008,
"unit": "iter/sec",
"range": "stddev: 0.00038880316637031375",
"extra": "mean: 8.40258831404868 msec\nrounds: 121"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
"value": 17.95729221162866,
"unit": "iter/sec",
"range": "stddev: 0.00012702976943269664",
"extra": "mean: 55.687683210524746 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
"value": 117.57284366665398,
"unit": "iter/sec",
"range": "stddev: 0.0001169374036398304",
"extra": "mean: 8.50536542975204 msec\nrounds: 121"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
"value": 108.14717022830895,
"unit": "iter/sec",
"range": "stddev: 0.00008465333927723482",
"extra": "mean: 9.246658954542267 msec\nrounds: 110"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
"value": 113.88772402268957,
"unit": "iter/sec",
"range": "stddev: 0.0002754468965569676",
"extra": "mean: 8.78057761344649 msec\nrounds: 119"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
"value": 156.4980297220059,
"unit": "iter/sec",
"range": "stddev: 0.00004992595617948714",
"extra": "mean: 6.389856803797098 msec\nrounds: 158"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
"value": 1173.6081177833307,
"unit": "iter/sec",
"range": "stddev: 0.00004480709004660706",
"extra": "mean: 852.0731791535017 usec\nrounds: 1228"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
"value": 118.17699947882352,
"unit": "iter/sec",
"range": "stddev: 0.00009436673466844187",
"extra": "mean: 8.46188348333546 msec\nrounds: 120"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
"value": 118.52886680331966,
"unit": "iter/sec",
"range": "stddev: 0.00006003892022218752",
"extra": "mean: 8.436763355371864 msec\nrounds: 121"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
"value": 29253.430531898583,
"unit": "iter/sec",
"range": "stddev: 0.0000021194141623121828",
"extra": "mean: 34.18402497818429 usec\nrounds: 29746"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
"value": 46.18214496040971,
"unit": "iter/sec",
"range": "stddev: 0.01961501347804262",
"extra": "mean: 21.65339008955223 msec\nrounds: 67"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
"value": 3.968495945719412,
"unit": "iter/sec",
"range": "stddev: 0.012966195818982616",
"extra": "mean: 251.98463440000296 msec\nrounds: 5"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
"value": 1.2269994565349527,
"unit": "iter/sec",
"range": "stddev: 0.003256560926837487",
"extra": "mean: 814.996285999996 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
"value": 0.11630966534949706,
"unit": "iter/sec",
"range": "stddev: 0.09528873491503427",
"extra": "mean: 8.597737746000007 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
"value": 1.2406146663078603,
"unit": "iter/sec",
"range": "stddev: 0.0022497850790321426",
"extra": "mean: 806.0520540000198 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
"value": 3.8471928693696413,
"unit": "iter/sec",
"range": "stddev: 0.0031029242162765513",
"extra": "mean: 259.92978099999675 msec\nrounds: 4"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
"value": 0.9362548594482513,
"unit": "iter/sec",
"range": "stddev: 0.02004117250672729",
"extra": "mean: 1.0680852440000308 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
"value": 2.6864998268604765,
"unit": "iter/sec",
"range": "stddev: 0.0020865326332728",
"extra": "mean: 372.23155199999763 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
"value": 4.0165792986360405,
"unit": "iter/sec",
"range": "stddev: 0.0013604306531611384",
"extra": "mean: 248.96807100001297 msec\nrounds: 5"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
"value": 1.2389093260426742,
"unit": "iter/sec",
"range": "stddev: 0.0035220531927995205",
"extra": "mean: 807.1615726666627 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
"value": 1.2423688389607996,
"unit": "iter/sec",
"range": "stddev: 0.0013727600672816323",
"extra": "mean: 804.9139423333145 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
"value": 11489.667572665081,
"unit": "iter/sec",
"range": "stddev: 0.000003412863072230721",
"extra": "mean: 87.03471999303854 usec\nrounds: 11664"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
"value": 289.052803312872,
"unit": "iter/sec",
"range": "stddev: 0.00011657177663552582",
"extra": "mean: 3.4595755119440774 msec\nrounds: 293"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
"value": 34.929527628182086,
"unit": "iter/sec",
"range": "stddev: 0.0012980862464071628",
"extra": "mean: 28.62907310527649 msec\nrounds: 38"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
"value": 19.742745408806062,
"unit": "iter/sec",
"range": "stddev: 0.0011942596660046035",
"extra": "mean: 50.65151676189674 msec\nrounds: 21"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
"value": 5.597263841753112,
"unit": "iter/sec",
"range": "stddev: 0.000927682551580926",
"extra": "mean: 178.65872116666046 msec\nrounds: 6"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
"value": 19.028864832741505,
"unit": "iter/sec",
"range": "stddev: 0.004350115478658842",
"extra": "mean: 52.551742249983135 msec\nrounds: 20"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
"value": 22.835449441142565,
"unit": "iter/sec",
"range": "stddev: 0.0019026017932289086",
"extra": "mean: 43.79156200001489 msec\nrounds: 25"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
"value": 19.368093164267954,
"unit": "iter/sec",
"range": "stddev: 0.000592252467949631",
"extra": "mean: 51.63130885000555 msec\nrounds: 20"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
"value": 19.380914595986493,
"unit": "iter/sec",
"range": "stddev: 0.0014004525385625957",
"extra": "mean: 51.59715219048979 msec\nrounds: 21"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
"value": 34.645400890120285,
"unit": "iter/sec",
"range": "stddev: 0.0013441764944850617",
"extra": "mean: 28.863859972974552 msec\nrounds: 37"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
"value": 19.041871442240506,
"unit": "iter/sec",
"range": "stddev: 0.001336431309749839",
"extra": "mean: 52.515846619030526 msec\nrounds: 21"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
"value": 18.67085075702457,
"unit": "iter/sec",
"range": "stddev: 0.0027756451678898992",
"extra": "mean: 53.55942334999213 msec\nrounds: 20"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
"value": 20585.212393984133,
"unit": "iter/sec",
"range": "stddev: 0.0000038513263543417985",
"extra": "mean: 48.57856119532885 usec\nrounds: 20982"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
"value": 42.371186964440355,
"unit": "iter/sec",
"range": "stddev: 0.021240327802814814",
"extra": "mean: 23.600943746023475 msec\nrounds: 63"
},
{
"name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
"value": 161.69714691213025,
"unit": "iter/sec",
"range": "stddev: 0.00036427901313085823",
"extra": "mean: 6.184401018178891 msec\nrounds: 165"
},
{
"name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
"value": 13.690971686064263,
"unit": "iter/sec",
"range": "stddev: 0.0005999368902017275",
"extra": "mean: 73.04083471430138 msec\nrounds: 14"
},
{
"name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
"value": 0.999562857510432,
"unit": "iter/sec",
"range": "stddev: 0.03566433195343142",
"extra": "mean: 1.0004373336666958 sec\nrounds: 3"
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
"id": "3537af2aedad0aa39ade53cd6ac4be4d12b6fb0e",
"message": "Remove VTK bundling and CI build steps (#204)\n\n* Remove VTK bundling and CI build steps\n\nRemove VTK C++ bundling and related CI plumbing. Deleted VTK helper scripts (.github/scripts/*) and VTK module/filter/optimization logic, removed VTK download/cache/install steps from GitHub workflows, and simplified cibuildwheel repair commands. CMake and extern build files no longer install or expect VTK (USE_VTK set OFF) and VTK RPATH/install logic removed. Python packaging no longer declares VTK in pyproject.toml and tool.mmgpy vtk_version was removed. Native bindings and mesh code were simplified to stop selecting VTK/VTU/VTP load/save paths and always use the MMG loaders. Conda recipe no longer requires VTK. Overall this shifts format conversion out of the C++ build (handled in Python via meshio) and slimmed CI/wheel production by not bundling VTK libraries.\n\n* fix: resolve CI failures from VTK removal\n\n- Add --exclude flags for MMG libs in auditwheel repair command\n- Skip delocate on macOS (RPATH already set by CMake)\n- Add mmgsuite back to conda run dependencies\n- Restore cast() calls and dict[str, Any] for ty type checker\n- Replace .celltypes with .distinct_cell_types (PyVista compat)\n- Update uv.lock to remove stale VTK entries\n\n* fix: mock pyvista .plot() in docs conftest to prevent CI segfaults\n\nVTK rendering can crash in CI environments without proper GL\nlibraries, especially now that VTK is an indirect dependency.\n\n* fix: robust VTK rendering mocks in docs conftest\n\n- Mock Mesh.plot, pv.Plotter with chainable no-op objects\n- Skip bash pip install blocks that fail in managed environments\n\n* fix(ci): install GL libraries for offscreen VTK rendering\n\nPreviously bundled via the VTK apt cache step that was removed\nwith VTK unbundling. Needed for examples and docs that use\nPyVista .plot() in offscreen mode.\n\n* fix: update examples to use .mesh output format\n\nThe low-level mmg*.remesh() API can no longer write .vtk files\nsince VTK was removed from the C++ bindings. Switch to .mesh\noutput and use mmgpy.read().to_pyvista() for visualization.\n\n* test: add coverage for meshio save path\n\n* refactor: in-memory meshio conversion for save(), no temp files\n\nReplace the temp-file round-trip (save .mesh, meshio read, meshio write)\nwith direct in-memory conversion. The new _to_meshio() method extracts\narrays from the C++ impl and builds a meshio.Mesh with geometry,\nreference markers, and user fields (point data).\n\n* test: improve coverage for meshio save with real mesh data\n\nUse cube.mesh asset (has tets, triangles, edges) and test\nround-trip with user fields and surface mesh export.\n\n* fix: in-memory format conversion for remesh() and offscreen doc tests\n\nWrap mmg3d/mmg2d/mmgs.remesh() in Python to handle non-native formats\n(.vtk, .vtu, etc.) via the in-memory path: mmgpy.read() \u2192 Mesh.remesh()\n\u2192 Mesh.save(). No temporary files are created. Native formats (.mesh,\n.meshb) still pass through directly to the C++ API.\n\nReplace _FakePlotter/_FakeObj no-op patches in docs/conftest.py with\npv.OFF_SCREEN = True so doc code blocks exercise real PyVista code paths\nand catch typos/API misuse.\n\n* fix: warn when sol params are ignored for non-native formats\n\nAdd warnings.warn() in _wrapped_remesh() when input_sol or output_sol\nare provided but the non-native (meshio) path is taken, since these\nparameters are silently discarded.\n\nAlso remove unreferenced example PNG files.\n\n* feat: support input_sol/output_sol for non-native format remeshing\n\nReplace the warnings that discarded sol params with actual\nimplementations:\n- _load_sol: parses .sol files via parse_sol_file and sets the\n  metric/displacement/tensor field on the Mesh object\n- _save_sol: writes the metric field back to Medit .sol format\n\nThis allows workflows like:\n  mmg3d.remesh(\"input.vtk\", input_sol=\"metric.sol\", output_mesh=\"out.vtk\")\n\nNo temporary mesh files are created \u2014 the entire pipeline is in-memory.\n\n* feat: lazy field loading for non-native mesh formats\n\nWhen reading non-native formats (VTK, VTU, etc.), point_data fields\nare now preserved as a _LazyFieldSource on the Mesh object. Fields are\nmaterialized on demand when accessed via mesh[\"field_name\"], avoiding\nunnecessary copies.\n\nKey behaviors:\n- mesh[\"temperature\"] works after read(\"mesh.vtk\") if field exists\n- \"temperature\" in mesh returns True without materializing\n- Fields are invalidated after remesh (vertex count changes)\n- transfer_fields=True on remesh preserves fields via interpolation\n- save() materializes all fields for export\n\nAlso adds transfer_fields parameter to mmg3d/mmg2d/mmgs.remesh() for\nnon-native format workflows.\n\n* feat: add input_sol parameter to Mesh.remesh() and load_sol() method\n\nMesh.remesh() now accepts input_sol as a file path (.sol) or numpy\narray to set the metric before remeshing. Also adds Mesh.load_sol()\nfor explicit .sol file loading.\n\nSimplifies the mesh_adaptation_to_a_solution example to use the\nMesh object API instead of the file-based mmg2d.remesh().\n\n* refactor: simplify examples to use Mesh object API\n\nReplace file-based mmgXd.remesh() + mmgpy.read() pattern with\ndirect Mesh object usage: mmgpy.read() -> mesh.remesh() ->\nmesh.to_pyvista(). Removes intermediate output files and unused\nimports.\n\n* refactor: move parse_sol_file to _sol.py and enable musllinux builds\n\nMove parse_sol_file from ui/parsers.py to core _sol.py module to\ndecouple core remeshing from the UI package. Enable musllinux builds\nnow that VTK C++ bundling has been removed.\n\n* fix: expose load_sol on C++ mesh classes and clean up remesh helpers\n\n- Add load_sol() to MmgMesh, MmgMesh2D, MmgMeshS C++ classes,\n  delegating to MMG3D_loadSol/MMG2D_loadSol/MMGS_loadSol which\n  handle both .sol (text) and .solb (binary) natively\n- _load_sol now routes through C++ instead of Python text parsing\n- Remove .sol/.solb from Mesh._NATIVE_EXTENSIONS (save() should\n  not pass sol files to MMG*_saveMesh)\n- _to_meshio: build tuples directly, deduplicate triangle branch,\n  add quad support for 2D meshes\n- _save_sol: use {v:.15g} for full float precision\n- Re-add *-musllinux* to cibuildwheel skip (pyvista -> vtk has\n  no musllinux wheels)\n\n* refactor: review cleanup for PR #204\n\n- Extract path_to_variant() helper in bindings.cpp to deduplicate\n  str/Path conversion across 9 lambdas (constructors, save, load_sol)\n- Use keyword arguments in _wrapped_remesh C++ call for clarity\n- Add warning when _save_sol finds no metric field to write\n\n* refactor: use PyVista for non-native I/O, expose save_sol in C++, fix error handling\n\n- Replace meshio with PyVista for non-native format save/read in Mesh.save()\n  and mmgpy.read(), giving consistent round-trip behavior\n- Add save_sol() to C++ mesh classes (MmgMesh, MmgMesh2D, MmgMeshS) via\n  MMG3D_saveSol/MMG2D_saveSol/MMGS_saveSol, replacing hand-written Python\n  .sol writer in _remesh._save_sol\n- Add variant_to_string() helper in mmg_common.hpp to eliminate duplicated\n  std::visit boilerplate across all C++ mesh classes\n- Fix _wrapped_remesh to propagate remesh success/failure via\n  RemeshResult.success instead of always returning True\n- Consolidate _NATIVE_EXTENSIONS / _NATIVE_MESH_EXTENSIONS into single\n  NATIVE_MESH_EXTENSIONS constant in _remesh.py\n- Handle UnstructuredGrid with triangles/quads in from_pyvista auto-detection\n  (enables .vtu round-trip for 2D and surface meshes)\n\n* test: improve coverage for _remesh, _sol, and non-native I/O paths\n\n- Add test for surface mesh save to .vtu (PolyData \u2192 UnstructuredGrid cast)\n- Add test for non-native remesh with output .sol via C++ save_sol\n- Add test for non-native remesh without output files (in-memory only)\n- Add test for Dimension keyword at EOF in .sol parser\n- Add test for multi-solution tensor+scalar parsing in .sol files\n- _remesh.py reaches 100% branch coverage\n\n* refactor: remove dead meshio conversion code from _io.py\n\nThe read() path now uses PyVista for all non-native formats, making\nthe meshio-based conversion functions (_convert_meshio, _meshio_to_mmg3d,\n_meshio_to_mmg2d, _meshio_to_mmgs, _detect_mesh_kind, etc.) dead code.\n\n- Remove ~220 lines of unused meshio conversion helpers and constants\n- Update _cli.py to use mmgpy.read() instead of meshio for mesh type detection\n- Remove test for deleted _meshio_to_pyvista_polydata\n- _io.py coverage rises from 59% to 94%\n\n* fix: clean up stale meshio references, add surface extraction warning\n\n- Replace \"meshio\" with \"PyVista\" in _remesh.py docstrings\n- Update _LazyFieldSource docstring to drop meshio reference\n- Add logging warning when extracting surface from non-tet UnstructuredGrid\n- Document meshio as PyVista fallback reader in _io.py format list\n- Remove extra blank line in CMakeLists.txt\n\n---------\n\nCo-authored-by: Kevin Marchais <kevinmarchais@gmail.com>",
"timestamp": "2026-03-31T21:59:59+02:00",
"tree_id": "053e05e55cb02668aafc3e0f0c7d6d644e05ddec",
"url": "https://github.com/kmarchais/mmgpy/commit/3537af2aedad0aa39ade53cd6ac4be4d12b6fb0e"
},
"date": 1774987759979,
"tool": "pytest",
"benches": [
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
"value": 1.0370822306223733,
"unit": "iter/sec",
"range": "stddev: 0.033027652686495844",
"extra": "mean: 964.243693000005 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
"value": 0.5292610267134573,
"unit": "iter/sec",
"range": "stddev: 0.02259484302664659",
"extra": "mean: 1.8894268603333255 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
"value": 1.0541869567142987,
"unit": "iter/sec",
"range": "stddev: 0.004538908123635015",
"extra": "mean: 948.5983426666659 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
"value": 1.1103448165057275,
"unit": "iter/sec",
"range": "stddev: 0.006692411963212063",
"extra": "mean: 900.6211270000032 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
"value": 1.0508117959837897,
"unit": "iter/sec",
"range": "stddev: 0.008307175038146566",
"extra": "mean: 951.6451983333335 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
"value": 0.544688965109144,
"unit": "iter/sec",
"range": "stddev: 0.00552425617060003",
"extra": "mean: 1.835910150666668 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
"value": 1.142527657031776,
"unit": "iter/sec",
"range": "stddev: 0.011340253653165051",
"extra": "mean: 875.2523353333478 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
"value": 1.141493040844305,
"unit": "iter/sec",
"range": "stddev: 0.008916871733075468",
"extra": "mean: 876.0456386666627 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
"value": 55.24273715822616,
"unit": "iter/sec",
"range": "stddev: 0.0008701106197530941",
"extra": "mean: 18.10192708474603 msec\nrounds: 59"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
"value": 1.1635686434335792,
"unit": "iter/sec",
"range": "stddev: 0.00949647851095737",
"extra": "mean: 859.4250159999982 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
"value": 114.18048467377784,
"unit": "iter/sec",
"range": "stddev: 0.00024390426500831624",
"extra": "mean: 8.758064067227203 msec\nrounds: 119"
},
{
"name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
"value": 13.678573867823626,
"unit": "iter/sec",
"range": "stddev: 0.0017574523907787024",
"extra": "mean: 73.10703657143084 msec\nrounds: 14"
},
{
"name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
"value": 1.0886502343071285,
"unit": "iter/sec",
"range": "stddev: 0.008358830496656172",
"extra": "mean: 918.5686720000111 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
"value": 15.133094034536192,
"unit": "iter/sec",
"range": "stddev: 0.0024386156230666233",
"extra": "mean: 66.08034006250385 msec\nrounds: 16"
},
{
"name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
"value": 346.7208861081726,
"unit": "iter/sec",
"range": "stddev: 0.000533991156708408",
"extra": "mean: 2.8841642948732322 msec\nrounds: 390"
},
{
"name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
"value": 25.639163356345673,
"unit": "iter/sec",
"range": "stddev: 0.001246964316023958",
"extra": "mean: 39.002832740737645 msec\nrounds: 27"
},
{
"name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
"value": 158.67087581073253,
"unit": "iter/sec",
"range": "stddev: 0.0006620257071571867",
"extra": "mean: 6.302353818181672 msec\nrounds: 176"
},
{
"name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
"value": 245.904052512317,
"unit": "iter/sec",
"range": "stddev: 0.00014077281387210927",
"extra": "mean: 4.066626758621277 msec\nrounds: 261"
},
{
"name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
"value": 261.06079841021227,
"unit": "iter/sec",
"range": "stddev: 0.00038613915049181836",
"extra": "mean: 3.830525326244776 msec\nrounds: 282"
},
{
"name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
"value": 67.32384502908327,
"unit": "iter/sec",
"range": "stddev: 0.0005842837290939428",
"extra": "mean: 14.853578246578302 msec\nrounds: 73"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
"value": 848.9519175022774,
"unit": "iter/sec",
"range": "stddev: 0.00005400574716581181",
"extra": "mean: 1.1779230123445916 msec\nrounds: 891"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
"value": 29.15373060975904,
"unit": "iter/sec",
"range": "stddev: 0.0006038677049335977",
"extra": "mean: 34.30092750000426 msec\nrounds: 30"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
"value": 1665.9597406862501,
"unit": "iter/sec",
"range": "stddev: 0.000019658941918839638",
"extra": "mean: 600.2546013435326 usec\nrounds: 1786"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
"value": 63.80754082220923,
"unit": "iter/sec",
"range": "stddev: 0.0007673507725511925",
"extra": "mean: 15.672128828571529 msec\nrounds: 70"
},
{
"name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
"value": 90701.70186835989,
"unit": "iter/sec",
"range": "stddev: 0.0000011082010076272992",
"extra": "mean: 11.025151451417662 usec\nrounds: 94796"
},
{
"name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
"value": 26656.405731249193,
"unit": "iter/sec",
"range": "stddev: 0.0000023095269947914802",
"extra": "mean: 37.51443499480143 usec\nrounds: 27444"
},
{
"name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
"value": 5848.950310573885,
"unit": "iter/sec",
"range": "stddev: 0.000008931808687337513",
"extra": "mean: 170.97084893885557 usec\nrounds: 6600"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
"value": 30.44719520623299,
"unit": "iter/sec",
"range": "stddev: 0.0006575162931283651",
"extra": "mean: 32.84374778124999 msec\nrounds: 32"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
"value": 29.51998995427101,
"unit": "iter/sec",
"range": "stddev: 0.0013702442756067903",
"extra": "mean: 33.87535028125299 msec\nrounds: 32"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
"value": 30.091557716987513,
"unit": "iter/sec",
"range": "stddev: 0.000714619617143521",
"extra": "mean: 33.2319120666682 msec\nrounds: 30"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
"value": 3992.2261310292156,
"unit": "iter/sec",
"range": "stddev: 0.00000837323402321197",
"extra": "mean: 250.48681291562886 usec\nrounds: 4212"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
"value": 3458.430631231632,
"unit": "iter/sec",
"range": "stddev: 0.000009660993604187307",
"extra": "mean: 289.1484915063557 usec\nrounds: 3591"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
"value": 2435.1503109835166,
"unit": "iter/sec",
"range": "stddev: 0.000010065828772855458",
"extra": "mean: 410.65226876944473 usec\nrounds: 2504"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
"value": 102.25218987426031,
"unit": "iter/sec",
"range": "stddev: 0.0008891317218808661",
"extra": "mean: 9.779741648855655 msec\nrounds: 131"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
"value": 108.16455423697617,
"unit": "iter/sec",
"range": "stddev: 0.0008447687095661833",
"extra": "mean: 9.24517284848338 msec\nrounds: 132"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
"value": 100.0465692178169,
"unit": "iter/sec",
"range": "stddev: 0.0009648987713915231",
"extra": "mean: 9.995345245900886 msec\nrounds: 122"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
"value": 29.138094682488546,
"unit": "iter/sec",
"range": "stddev: 0.0010100781741280206",
"extra": "mean: 34.31933387878588 msec\nrounds: 33"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
"value": 28.605395672819036,
"unit": "iter/sec",
"range": "stddev: 0.0010780739937363202",
"extra": "mean: 34.958439709687504 msec\nrounds: 31"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
"value": 9409.721681050332,
"unit": "iter/sec",
"range": "stddev: 0.000005084120646293671",
"extra": "mean: 106.27306884260342 usec\nrounds: 10110"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
"value": 913959.6560781621,
"unit": "iter/sec",
"range": "stddev: 1.2515896884722168e-7",
"extra": "mean: 1.0941401990226138 usec\nrounds: 95970"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
"value": 3344141.8606527904,
"unit": "iter/sec",
"range": "stddev: 4.680291486126997e-8",
"extra": "mean: 299.03037660154644 nsec\nrounds: 198060"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
"value": 1599388.4475294643,
"unit": "iter/sec",
"range": "stddev: 8.22205604796942e-8",
"extra": "mean: 625.2389790264367 nsec\nrounds: 166918"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
"value": 159898.41804797234,
"unit": "iter/sec",
"range": "stddev: 0.0000010124326539551842",
"extra": "mean: 6.253970565862524 usec\nrounds: 172385"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
"value": 1181.9049574183573,
"unit": "iter/sec",
"range": "stddev: 0.00003296813914782029",
"extra": "mean: 846.0917214395196 usec\nrounds: 1278"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
"value": 112.96604083905699,
"unit": "iter/sec",
"range": "stddev: 0.00022856673614082948",
"extra": "mean: 8.85221782203293 msec\nrounds: 118"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
"value": 18.05243563280757,
"unit": "iter/sec",
"range": "stddev: 0.00027784733124166714",
"extra": "mean: 55.39418726316638 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
"value": 115.52347393382342,
"unit": "iter/sec",
"range": "stddev: 0.00017411726930119007",
"extra": "mean: 8.656249383331744 msec\nrounds: 120"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
"value": 106.15394480133854,
"unit": "iter/sec",
"range": "stddev: 0.00023782657896630503",
"extra": "mean: 9.420281100918547 msec\nrounds: 109"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
"value": 115.18240641590135,
"unit": "iter/sec",
"range": "stddev: 0.0002009728489322785",
"extra": "mean: 8.681881470588431 msec\nrounds: 119"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
"value": 155.02105173992638,
"unit": "iter/sec",
"range": "stddev: 0.0001514516081394047",
"extra": "mean: 6.4507367791418835 msec\nrounds: 163"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
"value": 1222.2510707570123,
"unit": "iter/sec",
"range": "stddev: 0.000035604959567394916",
"extra": "mean: 818.1625068085569 usec\nrounds: 1322"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
"value": 115.13484318430513,
"unit": "iter/sec",
"range": "stddev: 0.00026862190661696464",
"extra": "mean: 8.685468033332219 msec\nrounds: 120"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
"value": 113.65746483065365,
"unit": "iter/sec",
"range": "stddev: 0.00032063437990948504",
"extra": "mean: 8.798366226890343 msec\nrounds: 119"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
"value": 27648.373063162566,
"unit": "iter/sec",
"range": "stddev: 0.0000024937580326064247",
"extra": "mean: 36.16849344862011 usec\nrounds: 28773"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
"value": 44.78454132740005,
"unit": "iter/sec",
"range": "stddev: 0.020478365875103925",
"extra": "mean: 22.329133454542735 msec\nrounds: 66"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
"value": 2.513771418104389,
"unit": "iter/sec",
"range": "stddev: 0.01939324796612847",
"extra": "mean: 397.8086443333382 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
"value": 1.117189465072279,
"unit": "iter/sec",
"range": "stddev: 0.012254245941597202",
"extra": "mean: 895.1033206666542 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
"value": 0.12523674645489505,
"unit": "iter/sec",
"range": "stddev: 0.05234868491260386",
"extra": "mean: 7.984876869666664 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
"value": 1.1037389082301725,
"unit": "iter/sec",
"range": "stddev: 0.00607450264786081",
"extra": "mean: 906.0113696666576 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
"value": 2.392909899854588,
"unit": "iter/sec",
"range": "stddev: 0.00843897692976188",
"extra": "mean: 417.90123399997964 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
"value": 0.9026472949085341,
"unit": "iter/sec",
"range": "stddev: 0.03705850722593207",
"extra": "mean: 1.1078524310000073 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
"value": 1.9190368952563233,
"unit": "iter/sec",
"range": "stddev: 0.002903413385172263",
"extra": "mean: 521.0947233333059 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
"value": 2.4305270030521657,
"unit": "iter/sec",
"range": "stddev: 0.007681297204894963",
"extra": "mean: 411.4334046666575 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
"value": 1.0850118228132273,
"unit": "iter/sec",
"range": "stddev: 0.009098275369988333",
"extra": "mean: 921.6489433333473 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
"value": 1.104939365474441,
"unit": "iter/sec",
"range": "stddev: 0.0041792388423387335",
"extra": "mean: 905.0270370000059 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
"value": 11353.477590188782,
"unit": "iter/sec",
"range": "stddev: 0.000004076002932898691",
"extra": "mean: 88.07873993287834 usec\nrounds: 11597"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
"value": 282.7144946853049,
"unit": "iter/sec",
"range": "stddev: 0.000051135531192343113",
"extra": "mean: 3.5371373551721135 msec\nrounds: 290"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
"value": 21.804628238143415,
"unit": "iter/sec",
"range": "stddev: 0.003546902319216183",
"extra": "mean: 45.861822961543254 msec\nrounds: 26"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
"value": 14.424962791145948,
"unit": "iter/sec",
"range": "stddev: 0.0030242722431846627",
"extra": "mean: 69.32426894118582 msec\nrounds: 17"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
"value": 5.120267864014316,
"unit": "iter/sec",
"range": "stddev: 0.004130999530571325",
"extra": "mean: 195.3022823333299 msec\nrounds: 6"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
"value": 14.769675513698534,
"unit": "iter/sec",
"range": "stddev: 0.002239822426531864",
"extra": "mean: 67.70629450000598 msec\nrounds: 16"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
"value": 18.030956984016733,
"unit": "iter/sec",
"range": "stddev: 0.002514830559194922",
"extra": "mean: 55.46017335000215 msec\nrounds: 20"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
"value": 13.919217536420108,
"unit": "iter/sec",
"range": "stddev: 0.0036282324073344703",
"extra": "mean: 71.84311886666515 msec\nrounds: 15"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
"value": 13.876064398903871,
"unit": "iter/sec",
"range": "stddev: 0.004013346016128406",
"extra": "mean: 72.06654359999902 msec\nrounds: 15"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
"value": 21.46444542843711,
"unit": "iter/sec",
"range": "stddev: 0.0022468595227210487",
"extra": "mean: 46.588671639992754 msec\nrounds: 25"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
"value": 14.416784092126893,
"unit": "iter/sec",
"range": "stddev: 0.0024634977935461813",
"extra": "mean: 69.36359687498594 msec\nrounds: 16"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
"value": 14.746805344996407,
"unit": "iter/sec",
"range": "stddev: 0.002636962550350291",
"extra": "mean: 67.81129719999322 msec\nrounds: 15"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
"value": 21560.878169172556,
"unit": "iter/sec",
"range": "stddev: 0.000002554522359189542",
"extra": "mean: 46.380300104370804 usec\nrounds: 22049"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
"value": 41.12648586581677,
"unit": "iter/sec",
"range": "stddev: 0.022260812116932416",
"extra": "mean: 24.315230901631036 msec\nrounds: 61"
},
{
"name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
"value": 171.5851170178854,
"unit": "iter/sec",
"range": "stddev: 0.000030954384392927253",
"extra": "mean: 5.828011294801073 msec\nrounds: 173"
},
{
"name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
"value": 14.19073334232756,
"unit": "iter/sec",
"range": "stddev: 0.00048330129643060614",
"extra": "mean: 70.46852166668789 msec\nrounds: 15"
},
{
"name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
"value": 1.094606550035284,
"unit": "iter/sec",
"range": "stddev: 0.014735077447468922",
"extra": "mean: 913.5702686666415 msec\nrounds: 3"
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
"id": "0bbf713719b19256a00ae3b272234dbe6166ddf4",
"message": "feat: complete constraint marker coverage and add unset variants (#208)\n\n* feat: complete constraint marker coverage and add unset variants\n\nAdd missing set_* constraint methods to fill coverage gaps across\nMMG3D, MMG2D, and MMGS bindings, and expose all unset_* counterparts\nfrom the MMG C API.\n\nNew setters: set_required_edges (3D, Surface), set_required_tetrahedra\n(3D), set_parallel_triangles (3D), set_parallel_edges (2D).\n\nNew unset methods for all three mesh classes: unset_corners,\nunset_required_vertices, unset_required_triangles, unset_required_edges,\nunset_required_tetrahedra, unset_ridge_edges, unset_parallel_triangles.\n\nCloses #207 (priority 1)\n\n* refactor: reduce constraint method boilerplate and add round-trip test assertions\n\nExtract common validation/iteration pattern into apply_attribute_to_indices\ntemplate helper in mmg_common.hpp, replacing ~740 lines of duplicated code\nacross the three mesh classes with ~90 lines.\n\nMove ensure_c_contiguous to mmg_common.hpp to eliminate triple duplication.\n\nAdd get_vertex_flags(idx) method to all mesh classes to query corner and\nrequired flags via the existing MMG GetByIdx_vertex API.\n\nAdd round-trip assertions to set/unset corner and required vertex tests\nacross all three mesh types, verifying flags are actually applied and\nremoved rather than just checking for no-throw.",
"timestamp": "2026-04-01T09:48:46+02:00",
"tree_id": "52f4750c19459d64c73f8b86cf6477e0d6b98957",
"url": "https://github.com/kmarchais/mmgpy/commit/0bbf713719b19256a00ae3b272234dbe6166ddf4"
},
"date": 1775030263624,
"tool": "pytest",
"benches": [
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
"value": 1.111821208668871,
"unit": "iter/sec",
"range": "stddev: 0.024772053840561064",
"extra": "mean: 899.4251883333391 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
"value": 0.5459455924456802,
"unit": "iter/sec",
"range": "stddev: 0.033543524072277855",
"extra": "mean: 1.831684354333343 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
"value": 1.0906780103471796,
"unit": "iter/sec",
"range": "stddev: 0.0044081573933101035",
"extra": "mean: 916.8608796666623 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
"value": 1.1628713860746962,
"unit": "iter/sec",
"range": "stddev: 0.013321244519748138",
"extra": "mean: 859.9403269999849 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
"value": 1.1160103145512363,
"unit": "iter/sec",
"range": "stddev: 0.017853957386742864",
"extra": "mean: 896.0490659999986 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
"value": 0.5574608052476074,
"unit": "iter/sec",
"range": "stddev: 0.014072128551328406",
"extra": "mean: 1.793848088666664 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
"value": 1.143499291110861,
"unit": "iter/sec",
"range": "stddev: 0.01463732545341468",
"extra": "mean: 874.5086313333369 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
"value": 1.220925343249029,
"unit": "iter/sec",
"range": "stddev: 0.009320657024754752",
"extra": "mean: 819.0508989999993 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
"value": 54.33897456739601,
"unit": "iter/sec",
"range": "stddev: 0.0023520390956995154",
"extra": "mean: 18.402997258619802 msec\nrounds: 58"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
"value": 1.1589941589452923,
"unit": "iter/sec",
"range": "stddev: 0.004988858527277345",
"extra": "mean: 862.8171179999905 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
"value": 116.80055311291024,
"unit": "iter/sec",
"range": "stddev: 0.00016343122251654953",
"extra": "mean: 8.561603291666842 msec\nrounds: 120"
},
{
"name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
"value": 15.209513679325703,
"unit": "iter/sec",
"range": "stddev: 0.0009900367019034782",
"extra": "mean: 65.74832181250478 msec\nrounds: 16"
},
{
"name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
"value": 1.069624466783153,
"unit": "iter/sec",
"range": "stddev: 0.011760880409494358",
"extra": "mean: 934.9075596666694 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
"value": 16.551576429380834,
"unit": "iter/sec",
"range": "stddev: 0.0016372303996388669",
"extra": "mean: 60.41720583333029 msec\nrounds: 18"
},
{
"name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
"value": 342.47672148505364,
"unit": "iter/sec",
"range": "stddev: 0.0005166672549134873",
"extra": "mean: 2.9199064849248217 msec\nrounds: 398"
},
{
"name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
"value": 28.990274704050687,
"unit": "iter/sec",
"range": "stddev: 0.0004339029309300317",
"extra": "mean: 34.494326466671055 msec\nrounds: 30"
},
{
"name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
"value": 163.26612172537347,
"unit": "iter/sec",
"range": "stddev: 0.00034013469958165695",
"extra": "mean: 6.1249694022993895 msec\nrounds: 174"
},
{
"name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
"value": 245.14322663674622,
"unit": "iter/sec",
"range": "stddev: 0.0007055155024983361",
"extra": "mean: 4.0792479307690686 msec\nrounds: 260"
},
{
"name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
"value": 254.29918994324288,
"unit": "iter/sec",
"range": "stddev: 0.0005487734962360819",
"extra": "mean: 3.93237587671117 msec\nrounds: 292"
},
{
"name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
"value": 71.86815395045726,
"unit": "iter/sec",
"range": "stddev: 0.00018401757655736535",
"extra": "mean: 13.914368813332203 msec\nrounds: 75"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
"value": 849.1165362169467,
"unit": "iter/sec",
"range": "stddev: 0.0000599878021964643",
"extra": "mean: 1.1776946477279568 msec\nrounds: 880"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
"value": 32.75755018055912,
"unit": "iter/sec",
"range": "stddev: 0.0002547230272286188",
"extra": "mean: 30.527313382350485 msec\nrounds: 34"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
"value": 1670.9164607199198,
"unit": "iter/sec",
"range": "stddev: 0.000019268994658679998",
"extra": "mean: 598.4739653406411 usec\nrounds: 1760"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
"value": 72.19448975916154,
"unit": "iter/sec",
"range": "stddev: 0.002057462715281862",
"extra": "mean: 13.851472644740165 msec\nrounds: 76"
},
{
"name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
"value": 89041.21073577102,
"unit": "iter/sec",
"range": "stddev: 0.000001418826288577684",
"extra": "mean: 11.230754745322264 usec\nrounds: 92251"
},
{
"name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
"value": 26889.86233985644,
"unit": "iter/sec",
"range": "stddev: 0.0000022842709061106255",
"extra": "mean: 37.18873631114836 usec\nrounds: 27559"
},
{
"name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
"value": 5910.999785322726,
"unit": "iter/sec",
"range": "stddev: 0.0000053078436196211",
"extra": "mean: 169.17611847712197 usec\nrounds: 6592"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
"value": 34.53692200874608,
"unit": "iter/sec",
"range": "stddev: 0.0004990013052846297",
"extra": "mean: 28.95452002777669 msec\nrounds: 36"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
"value": 34.24338802315188,
"unit": "iter/sec",
"range": "stddev: 0.00038282438315067463",
"extra": "mean: 29.20271788889295 msec\nrounds: 36"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
"value": 33.82293114948537,
"unit": "iter/sec",
"range": "stddev: 0.0004246581338972631",
"extra": "mean: 29.565740342856575 msec\nrounds: 35"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
"value": 3047.1767473157984,
"unit": "iter/sec",
"range": "stddev: 0.000012871653285609548",
"extra": "mean: 328.17262762354744 usec\nrounds: 3859"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
"value": 2745.727545400392,
"unit": "iter/sec",
"range": "stddev: 0.000011539658090155713",
"extra": "mean: 364.20219539815133 usec\nrounds: 2825"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
"value": 2051.5252524095386,
"unit": "iter/sec",
"range": "stddev: 0.000012204033170019635",
"extra": "mean: 487.4422085838276 usec\nrounds: 2330"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
"value": 124.32246832766582,
"unit": "iter/sec",
"range": "stddev: 0.00010598862269200614",
"extra": "mean: 8.043598341084959 msec\nrounds: 129"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
"value": 122.68359367952702,
"unit": "iter/sec",
"range": "stddev: 0.00013468332209974602",
"extra": "mean: 8.15104913385722 msec\nrounds: 127"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
"value": 121.14103019325867,
"unit": "iter/sec",
"range": "stddev: 0.00011614339445519",
"extra": "mean: 8.254841471999043 msec\nrounds: 125"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
"value": 34.95843309753785,
"unit": "iter/sec",
"range": "stddev: 0.00018149549335239287",
"extra": "mean: 28.605401083334907 msec\nrounds: 36"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
"value": 34.92414745833954,
"unit": "iter/sec",
"range": "stddev: 0.00024211753449814808",
"extra": "mean: 28.633483500001944 msec\nrounds: 36"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
"value": 6957.531648317089,
"unit": "iter/sec",
"range": "stddev: 0.0000063464296360606275",
"extra": "mean: 143.72913420262822 usec\nrounds: 8897"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
"value": 965221.2487436135,
"unit": "iter/sec",
"range": "stddev: 1.5250786255726044e-7",
"extra": "mean: 1.036031895590422 usec\nrounds: 100412"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
"value": 3279229.8991483026,
"unit": "iter/sec",
"range": "stddev: 4.699274612897651e-8",
"extra": "mean: 304.9496469459871 nsec\nrounds: 199204"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
"value": 1580045.5216720637,
"unit": "iter/sec",
"range": "stddev: 8.928546049105945e-8",
"extra": "mean: 632.8931580032975 nsec\nrounds: 164718"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
"value": 159401.26319566858,
"unit": "iter/sec",
"range": "stddev: 9.572867613281478e-7",
"extra": "mean: 6.273476006099637 usec\nrounds: 172981"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
"value": 1033.4578671168565,
"unit": "iter/sec",
"range": "stddev: 0.00003249188638512121",
"extra": "mean: 967.6253206043152 usec\nrounds: 1126"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
"value": 115.5328101117341,
"unit": "iter/sec",
"range": "stddev: 0.00010654077816114034",
"extra": "mean: 8.655549873952516 msec\nrounds: 119"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
"value": 18.06317741758035,
"unit": "iter/sec",
"range": "stddev: 0.00047261359321566055",
"extra": "mean: 55.361245526312 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
"value": 112.61403242781941,
"unit": "iter/sec",
"range": "stddev: 0.0014110947132220148",
"extra": "mean: 8.87988804273531 msec\nrounds: 117"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
"value": 104.78741129560909,
"unit": "iter/sec",
"range": "stddev: 0.00008829826966053929",
"extra": "mean: 9.543131065419335 msec\nrounds: 107"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
"value": 114.61693826045118,
"unit": "iter/sec",
"range": "stddev: 0.00021174670413655363",
"extra": "mean: 8.724713948715312 msec\nrounds: 117"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
"value": 156.89071563633016,
"unit": "iter/sec",
"range": "stddev: 0.0000757282405032649",
"extra": "mean: 6.373863462500751 msec\nrounds: 160"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
"value": 1208.8612159569182,
"unit": "iter/sec",
"range": "stddev: 0.000038761365443705764",
"extra": "mean: 827.2248185317233 usec\nrounds: 1295"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
"value": 115.63901967121053,
"unit": "iter/sec",
"range": "stddev: 0.00023765961442135522",
"extra": "mean: 8.647600116666846 msec\nrounds: 120"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
"value": 115.73872357376578,
"unit": "iter/sec",
"range": "stddev: 0.0001661957104939397",
"extra": "mean: 8.640150583332229 msec\nrounds: 120"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
"value": 27982.242810848245,
"unit": "iter/sec",
"range": "stddev: 0.000002796578459748516",
"extra": "mean: 35.7369495633251 usec\nrounds: 28749"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
"value": 47.62184387083649,
"unit": "iter/sec",
"range": "stddev: 0.01635608114291313",
"extra": "mean: 20.998766925368837 msec\nrounds: 67"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
"value": 3.1843148243159365,
"unit": "iter/sec",
"range": "stddev: 0.004821419816771225",
"extra": "mean: 314.0393005000135 msec\nrounds: 4"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
"value": 1.2223607378773622,
"unit": "iter/sec",
"range": "stddev: 0.0019211220781484826",
"extra": "mean: 818.0891033333637 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
"value": 0.11688839445636627,
"unit": "iter/sec",
"range": "stddev: 0.30251485373929077",
"extra": "mean: 8.555169267666637 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
"value": 1.215650747235888,
"unit": "iter/sec",
"range": "stddev: 0.0012328987992777775",
"extra": "mean: 822.6046850000065 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
"value": 2.9635157223057402,
"unit": "iter/sec",
"range": "stddev: 0.001986410765243404",
"extra": "mean: 337.43704900001603 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
"value": 0.9663680528287473,
"unit": "iter/sec",
"range": "stddev: 0.009916324315118278",
"extra": "mean: 1.0348024203333352 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
"value": 2.2535524098768045,
"unit": "iter/sec",
"range": "stddev: 0.014164644307247176",
"extra": "mean: 443.7438400000057 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
"value": 3.1878692496001073,
"unit": "iter/sec",
"range": "stddev: 0.0033015384845212423",
"extra": "mean: 313.6891515000002 msec\nrounds: 4"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
"value": 1.1990599993116833,
"unit": "iter/sec",
"range": "stddev: 0.005161501811865716",
"extra": "mean: 833.9866233333169 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
"value": 1.1851486889263851,
"unit": "iter/sec",
"range": "stddev: 0.004980523953413955",
"extra": "mean: 843.7759829999815 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
"value": 11377.517607049414,
"unit": "iter/sec",
"range": "stddev: 0.0000040098468595140134",
"extra": "mean: 87.89263480290361 usec\nrounds: 11591"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
"value": 285.5518527937355,
"unit": "iter/sec",
"range": "stddev: 0.00004960580839851427",
"extra": "mean: 3.50199093515368 msec\nrounds: 293"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
"value": 26.752671792913134,
"unit": "iter/sec",
"range": "stddev: 0.0015856549619977576",
"extra": "mean: 37.37944410714533 msec\nrounds: 28"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
"value": 16.87007288433741,
"unit": "iter/sec",
"range": "stddev: 0.0014562763323799077",
"extra": "mean: 59.2765666666695 msec\nrounds: 18"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
"value": 5.476635563666615,
"unit": "iter/sec",
"range": "stddev: 0.0016116358173154295",
"extra": "mean: 182.59385500000272 msec\nrounds: 6"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
"value": 16.99451567341253,
"unit": "iter/sec",
"range": "stddev: 0.0016392309153789456",
"extra": "mean: 58.84251244443956 msec\nrounds: 18"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
"value": 20.997391142616674,
"unit": "iter/sec",
"range": "stddev: 0.002086401640759645",
"extra": "mean: 47.62496413044297 msec\nrounds: 23"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
"value": 16.63105432824804,
"unit": "iter/sec",
"range": "stddev: 0.001913622562785992",
"extra": "mean: 60.128478944446016 msec\nrounds: 18"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
"value": 15.765294093100978,
"unit": "iter/sec",
"range": "stddev: 0.006293430967961035",
"extra": "mean: 63.43046911110958 msec\nrounds: 18"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
"value": 26.28085194281883,
"unit": "iter/sec",
"range": "stddev: 0.0017366834674469517",
"extra": "mean: 38.05051686207787 msec\nrounds: 29"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
"value": 16.566972348811504,
"unit": "iter/sec",
"range": "stddev: 0.001754194247035587",
"extra": "mean: 60.36105927778282 msec\nrounds: 18"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
"value": 16.60223612456138,
"unit": "iter/sec",
"range": "stddev: 0.0018442416329256478",
"extra": "mean: 60.232850111112334 msec\nrounds: 18"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
"value": 21390.975677924085,
"unit": "iter/sec",
"range": "stddev: 0.0000030274728418737906",
"extra": "mean: 46.74868575686428 usec\nrounds: 22088"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
"value": 42.984547127926966,
"unit": "iter/sec",
"range": "stddev: 0.017714538702014757",
"extra": "mean: 23.26417437931554 msec\nrounds: 58"
},
{
"name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
"value": 170.9524954656043,
"unit": "iter/sec",
"range": "stddev: 0.00008991027273939869",
"extra": "mean: 5.849578254335575 msec\nrounds: 173"
},
{
"name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
"value": 13.689765045209043,
"unit": "iter/sec",
"range": "stddev: 0.0005671105604618889",
"extra": "mean: 73.0472726666676 msec\nrounds: 15"
},
{
"name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
"value": 1.0431012586774275,
"unit": "iter/sec",
"range": "stddev: 0.008389014424242525",
"extra": "mean: 958.6796983333367 msec\nrounds: 3"
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
"id": "ccaecf7937f62dde8c7163a283bd31656d108402",
"message": "feat: add set/get normal vectors at vertices for 3D and surface meshes (#209)\n\nExpose MMG3D_Set/Get_normalAtVertex and MMGS_Set/Get_normalAtVertex as\nbatch Python APIs on MmgMesh3D and MmgMeshS.\n\nset_normal_at_vertices(vertex_indices, normals) takes a 1D index array\nand an Nx3 normals array. get_normal_at_vertices(vertex_indices) returns\nthe Nx3 array. Both validate shapes and bounds.\n\nPartial fix for #207 (priority 2: normal vectors).",
"timestamp": "2026-04-01T10:24:54+02:00",
"tree_id": "97a473f8be7be5cce0543af20678773cab406536",
"url": "https://github.com/kmarchais/mmgpy/commit/ccaecf7937f62dde8c7163a283bd31656d108402"
},
"date": 1775032412826,
"tool": "pytest",
"benches": [
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
"value": 1.197710759372761,
"unit": "iter/sec",
"range": "stddev: 0.013339865693188001",
"extra": "mean: 834.9261223333239 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
"value": 0.6024621044141931,
"unit": "iter/sec",
"range": "stddev: 0.009963387307768098",
"extra": "mean: 1.659855437666664 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
"value": 1.1962377671469753,
"unit": "iter/sec",
"range": "stddev: 0.002239652333713337",
"extra": "mean: 835.9542120000091 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
"value": 1.257741152582769,
"unit": "iter/sec",
"range": "stddev: 0.0008064870413777468",
"extra": "mean: 795.0761553333147 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
"value": 1.207799819534908,
"unit": "iter/sec",
"range": "stddev: 0.005909525116876179",
"extra": "mean: 827.9517713333272 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
"value": 0.5945531103637084,
"unit": "iter/sec",
"range": "stddev: 0.008211396763214992",
"extra": "mean: 1.6819355286666753 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
"value": 1.2614179224729898,
"unit": "iter/sec",
"range": "stddev: 0.000378054266676529",
"extra": "mean: 792.7586743333374 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
"value": 1.258817654712151,
"unit": "iter/sec",
"range": "stddev: 0.002754056534433647",
"extra": "mean: 794.3962306666776 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
"value": 59.597245560598225,
"unit": "iter/sec",
"range": "stddev: 0.0006333003950892171",
"extra": "mean: 16.779298952385382 msec\nrounds: 63"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
"value": 1.256137371001993,
"unit": "iter/sec",
"range": "stddev: 0.0037631998529071187",
"extra": "mean: 796.0912740000102 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
"value": 119.26030191409019,
"unit": "iter/sec",
"range": "stddev: 0.00005440572318584917",
"extra": "mean: 8.385019859503252 msec\nrounds: 121"
},
{
"name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
"value": 16.148263215534488,
"unit": "iter/sec",
"range": "stddev: 0.0004287525463519013",
"extra": "mean: 61.92616423529738 msec\nrounds: 17"
},
{
"name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
"value": 1.1751421678964726,
"unit": "iter/sec",
"range": "stddev: 0.0033640930120693497",
"extra": "mean: 850.9608686666562 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
"value": 17.941758923959682,
"unit": "iter/sec",
"range": "stddev: 0.0014663896104569344",
"extra": "mean: 55.73589547369214 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
"value": 367.0723287327689,
"unit": "iter/sec",
"range": "stddev: 0.0002426738790861346",
"extra": "mean: 2.7242587406472873 msec\nrounds: 401"
},
{
"name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
"value": 29.88571503013301,
"unit": "iter/sec",
"range": "stddev: 0.00020647797824383148",
"extra": "mean: 33.46080222580338 msec\nrounds: 31"
},
{
"name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
"value": 165.4005941143513,
"unit": "iter/sec",
"range": "stddev: 0.0002574269006730385",
"extra": "mean: 6.0459274971445405 msec\nrounds: 175"
},
{
"name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
"value": 259.0399359457061,
"unit": "iter/sec",
"range": "stddev: 0.000040481662085727126",
"extra": "mean: 3.8604086136339872 msec\nrounds: 264"
},
{
"name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
"value": 270.43629919367794,
"unit": "iter/sec",
"range": "stddev: 0.00014183344175142104",
"extra": "mean: 3.6977284594618403 msec\nrounds: 296"
},
{
"name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
"value": 73.84288960793252,
"unit": "iter/sec",
"range": "stddev: 0.0012518620342727058",
"extra": "mean: 13.542265278478157 msec\nrounds: 79"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
"value": 870.1661169888016,
"unit": "iter/sec",
"range": "stddev: 0.000019724907792301338",
"extra": "mean: 1.149205859061126 msec\nrounds: 894"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
"value": 33.44338712672614,
"unit": "iter/sec",
"range": "stddev: 0.00018404609177459229",
"extra": "mean: 29.9012775294179 msec\nrounds: 34"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
"value": 1692.9459514314794,
"unit": "iter/sec",
"range": "stddev: 0.000020062724432334435",
"extra": "mean: 590.6863117245089 usec\nrounds: 1774"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
"value": 80.86435022816593,
"unit": "iter/sec",
"range": "stddev: 0.0005089063380334939",
"extra": "mean: 12.366388862068531 msec\nrounds: 87"
},
{
"name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
"value": 90124.21635057882,
"unit": "iter/sec",
"range": "stddev: 0.000001177161460237839",
"extra": "mean: 11.095796895587403 usec\nrounds: 91997"
},
{
"name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
"value": 26893.7624020359,
"unit": "iter/sec",
"range": "stddev: 0.0000023696622665425632",
"extra": "mean: 37.18334329912495 usec\nrounds: 27460"
},
{
"name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
"value": 5502.9017631869665,
"unit": "iter/sec",
"range": "stddev: 0.000005362132628404952",
"extra": "mean: 181.7223063456719 usec\nrounds: 6114"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
"value": 35.545162722113275,
"unit": "iter/sec",
"range": "stddev: 0.00032291527715465633",
"extra": "mean: 28.133223297297842 msec\nrounds: 37"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
"value": 35.07576403517332,
"unit": "iter/sec",
"range": "stddev: 0.0002442781379390926",
"extra": "mean: 28.509713972223633 msec\nrounds: 36"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
"value": 34.749592835543076,
"unit": "iter/sec",
"range": "stddev: 0.00017627370312364932",
"extra": "mean: 28.77731560000224 msec\nrounds: 35"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
"value": 3133.579037442343,
"unit": "iter/sec",
"range": "stddev: 0.000016212111979656213",
"extra": "mean: 319.12391168413274 usec\nrounds: 3295"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
"value": 2822.6380450632855,
"unit": "iter/sec",
"range": "stddev: 0.00001508166016541984",
"extra": "mean: 354.2785096902424 usec\nrounds: 2941"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
"value": 2110.9783703590865,
"unit": "iter/sec",
"range": "stddev: 0.000017777732035047298",
"extra": "mean: 473.71399633521384 usec\nrounds: 2183"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
"value": 138.4570275889918,
"unit": "iter/sec",
"range": "stddev: 0.00040644312128364267",
"extra": "mean: 7.2224575192274765 msec\nrounds: 156"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
"value": 138.12365980196577,
"unit": "iter/sec",
"range": "stddev: 0.0004301128977192574",
"extra": "mean: 7.239889251658592 msec\nrounds: 151"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
"value": 136.79151827148397,
"unit": "iter/sec",
"range": "stddev: 0.00041148606094838764",
"extra": "mean: 7.310394771811401 msec\nrounds: 149"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
"value": 34.96077468087984,
"unit": "iter/sec",
"range": "stddev: 0.00027515943087068876",
"extra": "mean: 28.60348516667462 msec\nrounds: 36"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
"value": 35.22832091772113,
"unit": "iter/sec",
"range": "stddev: 0.00012309855280444093",
"extra": "mean: 28.386252138885325 msec\nrounds: 36"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
"value": 7414.199685694329,
"unit": "iter/sec",
"range": "stddev: 0.000007984754941317004",
"extra": "mean: 134.8763241337425 usec\nrounds: 7790"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
"value": 987636.2835942295,
"unit": "iter/sec",
"range": "stddev: 1.0522857485056318e-7",
"extra": "mean: 1.0125184914843106 usec\nrounds: 102166"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
"value": 3271019.502009872,
"unit": "iter/sec",
"range": "stddev: 4.534665903745359e-8",
"extra": "mean: 305.7150834428079 nsec\nrounds: 189754"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
"value": 1602494.6456506648,
"unit": "iter/sec",
"range": "stddev: 8.65116829368267e-8",
"extra": "mean: 624.0270460273317 nsec\nrounds: 165810"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
"value": 161588.47394579725,
"unit": "iter/sec",
"range": "stddev: 9.355660798816818e-7",
"extra": "mean: 6.188560208418313 usec\nrounds: 174826"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
"value": 1058.054349836573,
"unit": "iter/sec",
"range": "stddev: 0.000026382927726465317",
"extra": "mean: 945.1310324034488 usec\nrounds: 1111"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
"value": 119.39866192107128,
"unit": "iter/sec",
"range": "stddev: 0.000041989037029724624",
"extra": "mean: 8.37530323967158 msec\nrounds: 121"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
"value": 18.37666577559677,
"unit": "iter/sec",
"range": "stddev: 0.0001894376687996983",
"extra": "mean: 54.41683557895179 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
"value": 119.2205269331539,
"unit": "iter/sec",
"range": "stddev: 0.000047294084824029045",
"extra": "mean: 8.38781731404939 msec\nrounds: 121"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
"value": 108.21153078682015,
"unit": "iter/sec",
"range": "stddev: 0.000053769427317028726",
"extra": "mean: 9.24115935454262 msec\nrounds: 110"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
"value": 117.35723546584194,
"unit": "iter/sec",
"range": "stddev: 0.00030612718668324184",
"extra": "mean: 8.520991449999352 msec\nrounds: 120"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
"value": 156.55661283448177,
"unit": "iter/sec",
"range": "stddev: 0.00011191810724806677",
"extra": "mean: 6.387465734566205 msec\nrounds: 162"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
"value": 1090.6201496264057,
"unit": "iter/sec",
"range": "stddev: 0.00002359004945497391",
"extra": "mean: 916.9095219289247 usec\nrounds: 1140"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
"value": 118.98236265344991,
"unit": "iter/sec",
"range": "stddev: 0.00008524944526738386",
"extra": "mean: 8.40460701652578 msec\nrounds: 121"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
"value": 119.46112920963134,
"unit": "iter/sec",
"range": "stddev: 0.00006352698285509197",
"extra": "mean: 8.370923719004798 msec\nrounds: 121"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
"value": 27384.53628817901,
"unit": "iter/sec",
"range": "stddev: 0.000002589735234808411",
"extra": "mean: 36.51695940645402 usec\nrounds: 28502"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
"value": 50.354678211450945,
"unit": "iter/sec",
"range": "stddev: 0.013970273201450063",
"extra": "mean: 19.859127999999696 msec\nrounds: 67"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
"value": 3.4086857577375755,
"unit": "iter/sec",
"range": "stddev: 0.001403217794698518",
"extra": "mean: 293.36819849997653 msec\nrounds: 4"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
"value": 1.24471163361677,
"unit": "iter/sec",
"range": "stddev: 0.0054025706620848095",
"extra": "mean: 803.3989343333209 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
"value": 0.1275276496108479,
"unit": "iter/sec",
"range": "stddev: 0.04641408530067344",
"extra": "mean: 7.841436763333377 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
"value": 1.2498526064444486,
"unit": "iter/sec",
"range": "stddev: 0.0037662422108751727",
"extra": "mean: 800.094342999993 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
"value": 3.175447561392263,
"unit": "iter/sec",
"range": "stddev: 0.0007022941297772589",
"extra": "mean: 314.91623800002344 msec\nrounds: 4"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
"value": 1.0189785079980962,
"unit": "iter/sec",
"range": "stddev: 0.0022732738747704958",
"extra": "mean: 981.3749673333328 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
"value": 2.4398168983126816,
"unit": "iter/sec",
"range": "stddev: 0.0013695051252248251",
"extra": "mean: 409.86682266672386 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
"value": 3.350013620652731,
"unit": "iter/sec",
"range": "stddev: 0.0017501235086300135",
"extra": "mean: 298.5062490000132 msec\nrounds: 4"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
"value": 1.2469731374132444,
"unit": "iter/sec",
"range": "stddev: 0.006205176305744538",
"extra": "mean: 801.9418943333676 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
"value": 1.2477286379068728,
"unit": "iter/sec",
"range": "stddev: 0.005238610917823814",
"extra": "mean: 801.4563180000019 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
"value": 11375.809304072298,
"unit": "iter/sec",
"range": "stddev: 0.000003618405224857784",
"extra": "mean: 87.90583362205459 usec\nrounds: 11552"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
"value": 288.9694702996016,
"unit": "iter/sec",
"range": "stddev: 0.00006310558056354427",
"extra": "mean: 3.4605731842993888 msec\nrounds: 293"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
"value": 29.914647024301345,
"unit": "iter/sec",
"range": "stddev: 0.0013293730400297504",
"extra": "mean: 33.42844056249916 msec\nrounds: 32"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
"value": 17.98182838193701,
"unit": "iter/sec",
"range": "stddev: 0.0013603346898205563",
"extra": "mean: 55.61169747368479 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
"value": 5.577603844208999,
"unit": "iter/sec",
"range": "stddev: 0.0016917238993558361",
"extra": "mean: 179.2884593333497 msec\nrounds: 6"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
"value": 17.998112907329755,
"unit": "iter/sec",
"range": "stddev: 0.0012777179172597556",
"extra": "mean: 55.56138052632999 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
"value": 21.983641898786725,
"unit": "iter/sec",
"range": "stddev: 0.001713708710903142",
"extra": "mean: 45.48836833332833 msec\nrounds: 24"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
"value": 18.04204994298712,
"unit": "iter/sec",
"range": "stddev: 0.0014186348529421438",
"extra": "mean: 55.426074263179636 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
"value": 17.682644208858203,
"unit": "iter/sec",
"range": "stddev: 0.0013679554611666998",
"extra": "mean: 56.552628000004965 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
"value": 29.723635746768114,
"unit": "iter/sec",
"range": "stddev: 0.001539766488708928",
"extra": "mean: 33.64325981247873 msec\nrounds: 32"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
"value": 17.997128395242324,
"unit": "iter/sec",
"range": "stddev: 0.0013274081297564896",
"extra": "mean: 55.56441994737103 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
"value": 18.006178660991843,
"unit": "iter/sec",
"range": "stddev: 0.0014187110024364632",
"extra": "mean: 55.53649215790445 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
"value": 21599.25842191767,
"unit": "iter/sec",
"range": "stddev: 0.000002745537189135063",
"extra": "mean: 46.297885810063654 usec\nrounds: 22270"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
"value": 48.2981592131162,
"unit": "iter/sec",
"range": "stddev: 0.013875273280715503",
"extra": "mean: 20.704722836071 msec\nrounds: 61"
},
{
"name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
"value": 171.4013989708418,
"unit": "iter/sec",
"range": "stddev: 0.00003841032270337326",
"extra": "mean: 5.834258098267427 msec\nrounds: 173"
},
{
"name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
"value": 14.44974115547767,
"unit": "iter/sec",
"range": "stddev: 0.0001419001087897938",
"extra": "mean: 69.20539193332995 msec\nrounds: 15"
},
{
"name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
"value": 1.1641120004401753,
"unit": "iter/sec",
"range": "stddev: 0.0015016449900313428",
"extra": "mean: 859.023873666691 msec\nrounds: 3"
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
"id": "79bbf2bbee28ffb12258b35c489c9e0dd22079de",
"message": "feat: add set_local_parameters for region-specific mesh sizing (#210)\n\n* feat: add set_local_parameters for region-specific mesh sizing\n\nExpose MMG3D/MMG2D/MMGS_Set_localParameter as a batch Python API.\nset_local_parameters() accepts a list of dicts specifying entity type,\nreference, hmin, hmax, and hausd. Automatically sets numberOfLocalParam.\n\nPartial fix for #207 (priority 3: local parameters).\n\n* feat: add LocalParameter TypedDict for set_local_parameters type stubs",
"timestamp": "2026-04-01T10:59:45+02:00",
"tree_id": "e53e3e81cd151fd1ee71e1dfb167ea6e84088293",
"url": "https://github.com/kmarchais/mmgpy/commit/79bbf2bbee28ffb12258b35c489c9e0dd22079de"
},
"date": 1775034534345,
"tool": "pytest",
"benches": [
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
"value": 1.0757067424313942,
"unit": "iter/sec",
"range": "stddev: 0.003990183081363487",
"extra": "mean: 929.6213926666704 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
"value": 0.5746813662594771,
"unit": "iter/sec",
"range": "stddev: 0.025381736375104578",
"extra": "mean: 1.740094700666674 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
"value": 1.054499375210704,
"unit": "iter/sec",
"range": "stddev: 0.02482574220298564",
"extra": "mean: 948.3172996666648 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
"value": 1.1031539793344909,
"unit": "iter/sec",
"range": "stddev: 0.011938455787055723",
"extra": "mean: 906.4917669999962 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
"value": 1.072953519263357,
"unit": "iter/sec",
"range": "stddev: 0.002447183669377835",
"extra": "mean: 932.0068223333257 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
"value": 0.5706142560840333,
"unit": "iter/sec",
"range": "stddev: 0.013300495669469855",
"extra": "mean: 1.7524973996666706 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
"value": 1.1192734091308236,
"unit": "iter/sec",
"range": "stddev: 0.01458677548448217",
"extra": "mean: 893.4367526666733 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
"value": 1.1371409333559799,
"unit": "iter/sec",
"range": "stddev: 0.0013500919924021232",
"extra": "mean: 879.3984726666698 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
"value": 60.43128861046113,
"unit": "iter/sec",
"range": "stddev: 0.0005033585064275794",
"extra": "mean: 16.547719285716042 msec\nrounds: 63"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
"value": 1.2660173406927033,
"unit": "iter/sec",
"range": "stddev: 0.013005775704712617",
"extra": "mean: 789.8785963333239 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
"value": 116.03209924649961,
"unit": "iter/sec",
"range": "stddev: 0.0002578229028718342",
"extra": "mean: 8.618304818183038 msec\nrounds: 121"
},
{
"name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
"value": 12.022078576900055,
"unit": "iter/sec",
"range": "stddev: 0.002106048580999038",
"extra": "mean: 83.18029146153313 msec\nrounds: 13"
},
{
"name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
"value": 1.1442734722514551,
"unit": "iter/sec",
"range": "stddev: 0.022026555537631783",
"extra": "mean: 873.916964999997 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
"value": 12.760044442213957,
"unit": "iter/sec",
"range": "stddev: 0.0025752298829397925",
"extra": "mean: 78.3696330000002 msec\nrounds: 14"
},
{
"name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
"value": 398.5005326368386,
"unit": "iter/sec",
"range": "stddev: 0.00014556680104399488",
"extra": "mean: 2.509406934497926 msec\nrounds: 458"
},
{
"name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
"value": 14.297270319970558,
"unit": "iter/sec",
"range": "stddev: 0.001905236085252158",
"extra": "mean: 69.94342120000283 msec\nrounds: 15"
},
{
"name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
"value": 245.22843972559102,
"unit": "iter/sec",
"range": "stddev: 0.00026865936998894587",
"extra": "mean: 4.0778304552236815 msec\nrounds: 268"
},
{
"name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
"value": 215.20964218244356,
"unit": "iter/sec",
"range": "stddev: 0.0002806784060930261",
"extra": "mean: 4.64663195319219 msec\nrounds: 235"
},
{
"name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
"value": 288.1808274368174,
"unit": "iter/sec",
"range": "stddev: 0.00017413603183411675",
"extra": "mean: 3.4700434754607197 msec\nrounds: 326"
},
{
"name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
"value": 44.69095461894042,
"unit": "iter/sec",
"range": "stddev: 0.0010108455539986046",
"extra": "mean: 22.37589258333254 msec\nrounds: 48"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
"value": 986.6768069766493,
"unit": "iter/sec",
"range": "stddev: 0.00003271191525839733",
"extra": "mean: 1.0135030973963757 msec\nrounds: 1037"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
"value": 14.66359528010184,
"unit": "iter/sec",
"range": "stddev: 0.002396652003217068",
"extra": "mean: 68.19609931249104 msec\nrounds: 16"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
"value": 1872.443502226645,
"unit": "iter/sec",
"range": "stddev: 0.000014866073843468515",
"extra": "mean: 534.0615077628962 usec\nrounds: 1932"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
"value": 45.373879076266796,
"unit": "iter/sec",
"range": "stddev: 0.0007878445725853092",
"extra": "mean: 22.039111937490457 msec\nrounds: 48"
},
{
"name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
"value": 95153.21422463736,
"unit": "iter/sec",
"range": "stddev: 6.578547911804663e-7",
"extra": "mean: 10.509366479614695 usec\nrounds: 100584"
},
{
"name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
"value": 26875.010638726817,
"unit": "iter/sec",
"range": "stddev: 0.0000020740808558094813",
"extra": "mean: 37.2092875959276 usec\nrounds: 31586"
},
{
"name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
"value": 5574.3821518258965,
"unit": "iter/sec",
"range": "stddev: 0.000004643268163663958",
"extra": "mean: 179.3920783978631 usec\nrounds: 5842"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
"value": 14.66037323965381,
"unit": "iter/sec",
"range": "stddev: 0.002970084138293068",
"extra": "mean: 68.2110873749906 msec\nrounds: 16"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
"value": 14.824884411648497,
"unit": "iter/sec",
"range": "stddev: 0.0038846464893440855",
"extra": "mean: 67.454151562508 msec\nrounds: 16"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
"value": 14.879000785228543,
"unit": "iter/sec",
"range": "stddev: 0.0026285483174221806",
"extra": "mean: 67.20881424999803 msec\nrounds: 16"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
"value": 1432.030796109299,
"unit": "iter/sec",
"range": "stddev: 0.000037709400139232594",
"extra": "mean: 698.3090047482998 usec\nrounds: 1474"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
"value": 1386.01539445422,
"unit": "iter/sec",
"range": "stddev: 0.000007749630878535032",
"extra": "mean: 721.4927078019766 usec\nrounds: 1410"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
"value": 1205.4839459769387,
"unit": "iter/sec",
"range": "stddev: 0.00001820697498391214",
"extra": "mean: 829.542362083958 usec\nrounds: 1229"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
"value": 59.984782469751224,
"unit": "iter/sec",
"range": "stddev: 0.0008151417358253628",
"extra": "mean: 16.67089483077269 msec\nrounds: 65"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
"value": 60.73065097429633,
"unit": "iter/sec",
"range": "stddev: 0.00038975536611024155",
"extra": "mean: 16.466149859372337 msec\nrounds: 64"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
"value": 59.03311836839383,
"unit": "iter/sec",
"range": "stddev: 0.00045018755530218786",
"extra": "mean: 16.939643841267877 msec\nrounds: 63"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
"value": 15.149132620457369,
"unit": "iter/sec",
"range": "stddev: 0.0007392830301198818",
"extra": "mean: 66.01037993750225 msec\nrounds: 16"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
"value": 14.979397252755225,
"unit": "iter/sec",
"range": "stddev: 0.0020825038138139814",
"extra": "mean: 66.75836037501881 msec\nrounds: 16"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
"value": 3465.942918800842,
"unit": "iter/sec",
"range": "stddev: 0.000007940436049890313",
"extra": "mean: 288.5217741398878 usec\nrounds: 3542"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
"value": 978714.9054644688,
"unit": "iter/sec",
"range": "stddev: 7.701408326442499e-8",
"extra": "mean: 1.0217480028317643 usec\nrounds: 101369"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
"value": 3388712.5524071422,
"unit": "iter/sec",
"range": "stddev: 3.000604324918679e-8",
"extra": "mean: 295.09732222334964 nsec\nrounds: 194440"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
"value": 1558726.1064758697,
"unit": "iter/sec",
"range": "stddev: 6.56752464777096e-8",
"extra": "mean: 641.5495293531102 nsec\nrounds: 183790"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
"value": 137403.20326053165,
"unit": "iter/sec",
"range": "stddev: 5.913788097377459e-7",
"extra": "mean: 7.277850707045669 usec\nrounds: 140529"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
"value": 670.679613937074,
"unit": "iter/sec",
"range": "stddev: 0.00002916383006902043",
"extra": "mean: 1.4910248935847694 msec\nrounds: 686"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
"value": 113.63426055616557,
"unit": "iter/sec",
"range": "stddev: 0.00024525889093876085",
"extra": "mean: 8.800162865544708 msec\nrounds: 119"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
"value": 19.18522547934576,
"unit": "iter/sec",
"range": "stddev: 0.00022378319548646252",
"extra": "mean: 52.12344265000013 msec\nrounds: 20"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
"value": 111.94303849864707,
"unit": "iter/sec",
"range": "stddev: 0.0003262952176043874",
"extra": "mean: 8.93311467521123 msec\nrounds: 117"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
"value": 105.15536850999547,
"unit": "iter/sec",
"range": "stddev: 0.00021103735066892382",
"extra": "mean: 9.509737963639447 msec\nrounds: 110"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
"value": 113.32233285747455,
"unit": "iter/sec",
"range": "stddev: 0.0001910924731105167",
"extra": "mean: 8.82438593333319 msec\nrounds: 120"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
"value": 141.64380540337396,
"unit": "iter/sec",
"range": "stddev: 0.00034963775736055353",
"extra": "mean: 7.059962821192178 msec\nrounds: 151"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
"value": 682.6518707499288,
"unit": "iter/sec",
"range": "stddev: 0.00002003894227383414",
"extra": "mean: 1.464875499281131 msec\nrounds: 695"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
"value": 112.38497242240408,
"unit": "iter/sec",
"range": "stddev: 0.0008893781873262058",
"extra": "mean: 8.897986789919333 msec\nrounds: 119"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
"value": 116.83106940039758,
"unit": "iter/sec",
"range": "stddev: 0.00017160239952183375",
"extra": "mean: 8.559366999995953 msec\nrounds: 121"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
"value": 29458.69757308521,
"unit": "iter/sec",
"range": "stddev: 0.000001536236120680294",
"extra": "mean: 33.94583204227077 usec\nrounds: 30335"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
"value": 44.01554820079794,
"unit": "iter/sec",
"range": "stddev: 0.017826945646387128",
"extra": "mean: 22.71924446875051 msec\nrounds: 64"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
"value": 1.962264335569101,
"unit": "iter/sec",
"range": "stddev: 0.007672872058344287",
"extra": "mean: 509.61533666664616 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
"value": 1.1163763633694672,
"unit": "iter/sec",
"range": "stddev: 0.012099361278230681",
"extra": "mean: 895.755260333336 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
"value": 0.11095422792708587,
"unit": "iter/sec",
"range": "stddev: 0.07372468019303392",
"extra": "mean: 9.01272550566667 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
"value": 1.117255434198763,
"unit": "iter/sec",
"range": "stddev: 0.009578392708548522",
"extra": "mean: 895.0504686666818 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
"value": 1.8394652640631528,
"unit": "iter/sec",
"range": "stddev: 0.004989163365161825",
"extra": "mean: 543.6362509999905 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
"value": 0.987313188760211,
"unit": "iter/sec",
"range": "stddev: 0.002343872344175411",
"extra": "mean: 1.0128498346666674 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
"value": 1.651355194879042,
"unit": "iter/sec",
"range": "stddev: 0.005670910675715328",
"extra": "mean: 605.5632386666806 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
"value": 1.9671935292464064,
"unit": "iter/sec",
"range": "stddev: 0.0010452064270737318",
"extra": "mean: 508.3383943333123 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
"value": 1.119183496904268,
"unit": "iter/sec",
"range": "stddev: 0.008542152141761017",
"extra": "mean: 893.5085289999923 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
"value": 1.1218329824748268,
"unit": "iter/sec",
"range": "stddev: 0.00842872236002582",
"extra": "mean: 891.3982880000049 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
"value": 12934.160334982513,
"unit": "iter/sec",
"range": "stddev: 0.0000027034098259174567",
"extra": "mean: 77.3146438656199 usec\nrounds: 13245"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
"value": 300.6200546027533,
"unit": "iter/sec",
"range": "stddev: 0.00006956166661967375",
"extra": "mean: 3.3264580479217343 msec\nrounds: 313"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
"value": 16.463772831631456,
"unit": "iter/sec",
"range": "stddev: 0.002230506132701921",
"extra": "mean: 60.739419222228555 msec\nrounds: 18"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
"value": 12.354485788789416,
"unit": "iter/sec",
"range": "stddev: 0.003022883466604974",
"extra": "mean: 80.94225992856862 msec\nrounds: 14"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
"value": 5.288699730394014,
"unit": "iter/sec",
"range": "stddev: 0.002894582277086721",
"extra": "mean: 189.0823928333513 msec\nrounds: 6"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
"value": 12.510561861411187,
"unit": "iter/sec",
"range": "stddev: 0.0036907089151019014",
"extra": "mean: 79.93246115384304 msec\nrounds: 13"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
"value": 16.937199727682174,
"unit": "iter/sec",
"range": "stddev: 0.002550519492138254",
"extra": "mean: 59.041637111098076 msec\nrounds: 18"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
"value": 12.583015161759628,
"unit": "iter/sec",
"range": "stddev: 0.0018682380232407265",
"extra": "mean: 79.47220814285012 msec\nrounds: 14"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
"value": 11.738452636504505,
"unit": "iter/sec",
"range": "stddev: 0.0036125687481083704",
"extra": "mean: 85.19010392308246 msec\nrounds: 13"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
"value": 16.307031484896466,
"unit": "iter/sec",
"range": "stddev: 0.0033812584751977694",
"extra": "mean: 61.323239666655304 msec\nrounds: 18"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
"value": 12.609005891670929,
"unit": "iter/sec",
"range": "stddev: 0.0021243178375588124",
"extra": "mean: 79.30839342858624 msec\nrounds: 14"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
"value": 12.500297591220907,
"unit": "iter/sec",
"range": "stddev: 0.0026122034826094247",
"extra": "mean: 79.99809546152811 msec\nrounds: 13"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
"value": 24332.841684750496,
"unit": "iter/sec",
"range": "stddev: 0.0000016028903554526605",
"extra": "mean: 41.09672075936386 usec\nrounds: 24692"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
"value": 42.509942336994,
"unit": "iter/sec",
"range": "stddev: 0.01816118160498779",
"extra": "mean: 23.523908644066932 msec\nrounds: 59"
},
{
"name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
"value": 185.5203139632867,
"unit": "iter/sec",
"range": "stddev: 0.00002924549992219916",
"extra": "mean: 5.39024529787015 msec\nrounds: 188"
},
{
"name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
"value": 14.906307610921711,
"unit": "iter/sec",
"range": "stddev: 0.00043679051589935156",
"extra": "mean: 67.08569460000338 msec\nrounds: 15"
},
{
"name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
"value": 1.1582194854926786,
"unit": "iter/sec",
"range": "stddev: 0.0075278646158185485",
"extra": "mean: 863.3942120000029 msec\nrounds: 3"
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
"id": "a46145b33ed8deecf16469a555c98eea0b0291c1",
"message": "feat: add advanced topology queries (#211)\n\n* feat: add advanced topology queries\n\nExpose tet-from-tria, tri-from-edge, and non-boundary element queries:\n\n- MmgMesh3D: get_tet_from_tria, get_tets_from_tria,\n  get_non_boundary_triangles\n- MmgMesh2D: get_tri_from_edge, get_tris_from_edge,\n  get_non_boundary_edges\n- MmgMeshS: get_non_boundary_edges\n\nNote: get_tet_from_tria and get_tri_from_edge require remesh() to be\ncalled first to build adjacency tables.\n\nPartial fix for #207 (priority 4: advanced topology queries).\n\n* fix: improve topology query tests and docstrings\n\n- Replace silent `if` guards with `assert` in topology tests to catch\n  unexpected zero-element meshes\n- Add missing `get_tris_from_edge` invalid index test for 2D\n- Clarify local face/edge index ranges in type stub docstrings",
"timestamp": "2026-04-01T11:27:09+02:00",
"tree_id": "f92cf43d74409d8c05ef103486a32687e9ba6909",
"url": "https://github.com/kmarchais/mmgpy/commit/a46145b33ed8deecf16469a555c98eea0b0291c1"
},
"date": 1775036137035,
"tool": "pytest",
"benches": [
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
"value": 1.2089008755404567,
"unit": "iter/sec",
"range": "stddev: 0.012520492995260613",
"extra": "mean: 827.1976803333322 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
"value": 0.6080737564603362,
"unit": "iter/sec",
"range": "stddev: 0.027162658012117043",
"extra": "mean: 1.6445373433333306 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
"value": 1.2139325235372187,
"unit": "iter/sec",
"range": "stddev: 0.0029197183255760344",
"extra": "mean: 823.7690156666607 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
"value": 1.2711356124892006,
"unit": "iter/sec",
"range": "stddev: 0.0020926090895620523",
"extra": "mean: 786.6981226666686 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
"value": 1.2069796266751431,
"unit": "iter/sec",
"range": "stddev: 0.006921032404799173",
"extra": "mean: 828.5143989999995 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
"value": 0.6001186559407492,
"unit": "iter/sec",
"range": "stddev: 0.025785599377368407",
"extra": "mean: 1.6663371319999953 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
"value": 1.2787700319245534,
"unit": "iter/sec",
"range": "stddev: 0.0011523017606794935",
"extra": "mean: 782.0014350000027 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
"value": 1.2779185807401996,
"unit": "iter/sec",
"range": "stddev: 0.00038046847075781133",
"extra": "mean: 782.522466666677 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
"value": 59.768693391978545,
"unit": "iter/sec",
"range": "stddev: 0.0004963539979953394",
"extra": "mean: 16.73116715872876 msec\nrounds: 63"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
"value": 1.2357834025327217,
"unit": "iter/sec",
"range": "stddev: 0.01901444405773752",
"extra": "mean: 809.2032939999948 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
"value": 118.50284185072363,
"unit": "iter/sec",
"range": "stddev: 0.00006111791758257254",
"extra": "mean: 8.438616191666409 msec\nrounds: 120"
},
{
"name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
"value": 16.098670836916046,
"unit": "iter/sec",
"range": "stddev: 0.0008937234383255846",
"extra": "mean: 62.11692941176787 msec\nrounds: 17"
},
{
"name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
"value": 1.1723005029530154,
"unit": "iter/sec",
"range": "stddev: 0.0018169513814495742",
"extra": "mean: 853.0236040000053 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
"value": 18.10726167913801,
"unit": "iter/sec",
"range": "stddev: 0.001259616577687822",
"extra": "mean: 55.22646205263239 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
"value": 369.7023614470572,
"unit": "iter/sec",
"range": "stddev: 0.00015240055979426605",
"extra": "mean: 2.704878584182924 msec\nrounds: 392"
},
{
"name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
"value": 29.84428800496756,
"unit": "iter/sec",
"range": "stddev: 0.00030971941300403074",
"extra": "mean: 33.50724935483636 msec\nrounds: 31"
},
{
"name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
"value": 166.26783940200824,
"unit": "iter/sec",
"range": "stddev: 0.00025968654328115457",
"extra": "mean: 6.014392221589918 msec\nrounds: 176"
},
{
"name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
"value": 257.4251071607149,
"unit": "iter/sec",
"range": "stddev: 0.000028907798804072526",
"extra": "mean: 3.8846249731798026 msec\nrounds: 261"
},
{
"name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
"value": 281.01378888851815,
"unit": "iter/sec",
"range": "stddev: 0.00010617378541355458",
"extra": "mean: 3.5585442406767918 msec\nrounds: 295"
},
{
"name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
"value": 76.1755511398636,
"unit": "iter/sec",
"range": "stddev: 0.0001624919976358697",
"extra": "mean: 13.127571576921454 msec\nrounds: 78"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
"value": 866.8666465962768,
"unit": "iter/sec",
"range": "stddev: 0.000015970169748717406",
"extra": "mean: 1.1535799697986615 msec\nrounds: 894"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
"value": 33.716103327674794,
"unit": "iter/sec",
"range": "stddev: 0.00037642827595691557",
"extra": "mean: 29.65941794285527 msec\nrounds: 35"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
"value": 1568.7552918536453,
"unit": "iter/sec",
"range": "stddev: 0.00006370884235688324",
"extra": "mean: 637.4480489040437 usec\nrounds: 1779"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
"value": 80.96023111819821,
"unit": "iter/sec",
"range": "stddev: 0.00041864364803675854",
"extra": "mean: 12.351743395347354 msec\nrounds: 86"
},
{
"name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
"value": 90459.17068240647,
"unit": "iter/sec",
"range": "stddev: 0.0000011272285626761742",
"extra": "mean: 11.054711119460787 usec\nrounds: 92585"
},
{
"name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
"value": 26832.24161019786,
"unit": "iter/sec",
"range": "stddev: 0.000002422881603789528",
"extra": "mean: 37.26859703066851 usec\nrounds: 27481"
},
{
"name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
"value": 5918.951930452003,
"unit": "iter/sec",
"range": "stddev: 0.000005448238467761252",
"extra": "mean: 168.94882941271572 usec\nrounds: 6589"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
"value": 35.559280955127186,
"unit": "iter/sec",
"range": "stddev: 0.00028620579104010006",
"extra": "mean: 28.122053459458744 msec\nrounds: 37"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
"value": 35.37974566492713,
"unit": "iter/sec",
"range": "stddev: 0.00028493609444763505",
"extra": "mean: 28.264759432437817 msec\nrounds: 37"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
"value": 34.83918392861937,
"unit": "iter/sec",
"range": "stddev: 0.00036132324427207163",
"extra": "mean: 28.7033129722229 msec\nrounds: 36"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
"value": 3144.294601632348,
"unit": "iter/sec",
"range": "stddev: 0.00001256205393395262",
"extra": "mean: 318.0363568607261 usec\nrounds: 3287"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
"value": 2830.8351826681683,
"unit": "iter/sec",
"range": "stddev: 0.000011515488238638958",
"extra": "mean: 353.2526394056833 usec\nrounds: 2959"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
"value": 2111.104935443537,
"unit": "iter/sec",
"range": "stddev: 0.000013921525802003372",
"extra": "mean: 473.6855962064732 usec\nrounds: 2214"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
"value": 140.24250427857118,
"unit": "iter/sec",
"range": "stddev: 0.00040405944772059043",
"extra": "mean: 7.130505870129404 msec\nrounds: 154"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
"value": 138.00356445345952,
"unit": "iter/sec",
"range": "stddev: 0.00041271476595907",
"extra": "mean: 7.246189647059741 msec\nrounds: 153"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
"value": 137.56987806928043,
"unit": "iter/sec",
"range": "stddev: 0.0004066353193743031",
"extra": "mean: 7.269033120000283 msec\nrounds: 150"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
"value": 35.378714238614855,
"unit": "iter/sec",
"range": "stddev: 0.0003201785671534135",
"extra": "mean: 28.2655834594613 msec\nrounds: 37"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
"value": 35.38090026609542,
"unit": "iter/sec",
"range": "stddev: 0.0003029317100176542",
"extra": "mean: 28.26383705556168 msec\nrounds: 36"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
"value": 7429.616408341512,
"unit": "iter/sec",
"range": "stddev: 0.000006728891704079223",
"extra": "mean: 134.59645088503655 usec\nrounds: 7798"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
"value": 974583.5940109158,
"unit": "iter/sec",
"range": "stddev: 1.1335102617871313e-7",
"extra": "mean: 1.0260792467113902 usec\nrounds: 100919"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
"value": 3409181.2957913964,
"unit": "iter/sec",
"range": "stddev: 4.5847834520402e-8",
"extra": "mean: 293.3255562661015 nsec\nrounds: 197668"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
"value": 1572443.9502462114,
"unit": "iter/sec",
"range": "stddev: 8.342607999498113e-8",
"extra": "mean: 635.9527154169288 nsec\nrounds: 163106"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
"value": 165002.27328429418,
"unit": "iter/sec",
"range": "stddev: 0.0000012153603667580516",
"extra": "mean: 6.060522561874215 usec\nrounds: 172414"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
"value": 1060.6774617478752,
"unit": "iter/sec",
"range": "stddev: 0.000019701249010898645",
"extra": "mean: 942.7936729720968 usec\nrounds: 1110"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
"value": 119.15588748205266,
"unit": "iter/sec",
"range": "stddev: 0.00006469030688458275",
"extra": "mean: 8.39236752066171 msec\nrounds: 121"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
"value": 18.346293900466588,
"unit": "iter/sec",
"range": "stddev: 0.0001368260690094462",
"extra": "mean: 54.50692142103794 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
"value": 119.04582937789698,
"unit": "iter/sec",
"range": "stddev: 0.00008789589711259115",
"extra": "mean: 8.400126280994 msec\nrounds: 121"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
"value": 107.41968653366855,
"unit": "iter/sec",
"range": "stddev: 0.0002850195459097621",
"extra": "mean: 9.309280563638305 msec\nrounds: 110"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
"value": 116.17512061488809,
"unit": "iter/sec",
"range": "stddev: 0.0004939981752260025",
"extra": "mean: 8.607694958328693 msec\nrounds: 120"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
"value": 157.65948875485714,
"unit": "iter/sec",
"range": "stddev: 0.00027350706829086833",
"extra": "mean: 6.342783475309171 msec\nrounds: 162"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
"value": 1082.4122360942597,
"unit": "iter/sec",
"range": "stddev: 0.000024703266458514088",
"extra": "mean: 923.8624312012278 usec\nrounds: 1141"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
"value": 118.93345919182815,
"unit": "iter/sec",
"range": "stddev: 0.00005594305742247563",
"extra": "mean: 8.408062851237656 msec\nrounds: 121"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
"value": 118.10695375101461,
"unit": "iter/sec",
"range": "stddev: 0.0005299347105283332",
"extra": "mean: 8.466901975205753 msec\nrounds: 121"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
"value": 28427.31549003559,
"unit": "iter/sec",
"range": "stddev: 0.0000026352149693921743",
"extra": "mean: 35.17743349175979 usec\nrounds: 29237"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
"value": 48.9474071229501,
"unit": "iter/sec",
"range": "stddev: 0.014688383621397152",
"extra": "mean: 20.43009137313685 msec\nrounds: 67"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
"value": 3.433216048035673,
"unit": "iter/sec",
"range": "stddev: 0.0014437718231242883",
"extra": "mean: 291.2720859999922 msec\nrounds: 4"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
"value": 1.273290466849655,
"unit": "iter/sec",
"range": "stddev: 0.002356742896667421",
"extra": "mean: 785.366753333335 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
"value": 0.12909233366666836,
"unit": "iter/sec",
"range": "stddev: 0.045600811679444485",
"extra": "mean: 7.746393388333331 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
"value": 1.2704693517074654,
"unit": "iter/sec",
"range": "stddev: 0.003720827796312395",
"extra": "mean: 787.1106836666589 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
"value": 3.130773184887618,
"unit": "iter/sec",
"range": "stddev: 0.0007622380950344193",
"extra": "mean: 319.4099159999979 msec\nrounds: 4"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
"value": 1.0317070145791774,
"unit": "iter/sec",
"range": "stddev: 0.0011670975588210346",
"extra": "mean: 969.267423666679 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
"value": 2.4419344057543,
"unit": "iter/sec",
"range": "stddev: 0.001617978483654594",
"extra": "mean: 409.51140933333363 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
"value": 3.362624341336767,
"unit": "iter/sec",
"range": "stddev: 0.002390189218012006",
"extra": "mean: 297.38677249997636 msec\nrounds: 4"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
"value": 1.275240618648635,
"unit": "iter/sec",
"range": "stddev: 0.0033013493737852795",
"extra": "mean: 784.1657373333154 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
"value": 1.2749609555638466,
"unit": "iter/sec",
"range": "stddev: 0.0019168068869008339",
"extra": "mean: 784.3377443333187 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
"value": 11368.347981360152,
"unit": "iter/sec",
"range": "stddev: 0.0000036916931270051316",
"extra": "mean: 87.96352835430679 usec\nrounds: 11568"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
"value": 286.6203530807671,
"unit": "iter/sec",
"range": "stddev: 0.00006591042725875414",
"extra": "mean: 3.488935762067842 msec\nrounds: 290"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
"value": 29.917729525402255,
"unit": "iter/sec",
"range": "stddev: 0.0012595508636652332",
"extra": "mean: 33.42499634375429 msec\nrounds: 32"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
"value": 17.947775513689635,
"unit": "iter/sec",
"range": "stddev: 0.0014836220251675165",
"extra": "mean: 55.71721126315915 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
"value": 5.548298042652916,
"unit": "iter/sec",
"range": "stddev: 0.0037577950012815955",
"extra": "mean: 180.23545100000624 msec\nrounds: 6"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
"value": 17.93469488823636,
"unit": "iter/sec",
"range": "stddev: 0.0014863479664773804",
"extra": "mean: 55.75784847368188 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
"value": 22.182839917373453,
"unit": "iter/sec",
"range": "stddev: 0.0017087013123301747",
"extra": "mean: 45.07989075000296 msec\nrounds: 24"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
"value": 18.060585370491722,
"unit": "iter/sec",
"range": "stddev: 0.0008897411032799343",
"extra": "mean: 55.36919094736815 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
"value": 17.766295323447306,
"unit": "iter/sec",
"range": "stddev: 0.001379314918657106",
"extra": "mean: 56.286354684211325 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
"value": 29.70596535135005,
"unit": "iter/sec",
"range": "stddev: 0.0013393980686664108",
"extra": "mean: 33.66327228125421 msec\nrounds: 32"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
"value": 18.0452019125422,
"unit": "iter/sec",
"range": "stddev: 0.0015139043631948435",
"extra": "mean: 55.416392947366056 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
"value": 17.989273836770305,
"unit": "iter/sec",
"range": "stddev: 0.001959235397213287",
"extra": "mean: 55.58868073685038 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
"value": 21314.61872328042,
"unit": "iter/sec",
"range": "stddev: 0.000002949556573242438",
"extra": "mean: 46.91615707428875 usec\nrounds: 21875"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
"value": 46.59915371798186,
"unit": "iter/sec",
"range": "stddev: 0.014016569597794558",
"extra": "mean: 21.4596171864408 msec\nrounds: 59"
},
{
"name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
"value": 171.50493794627658,
"unit": "iter/sec",
"range": "stddev: 0.000037516289582608447",
"extra": "mean: 5.830735907517993 msec\nrounds: 173"
},
{
"name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
"value": 14.295589474700806,
"unit": "iter/sec",
"range": "stddev: 0.00010874661273248707",
"extra": "mean: 69.95164499999949 msec\nrounds: 15"
},
{
"name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
"value": 1.176774573104451,
"unit": "iter/sec",
"range": "stddev: 0.0035043437017608205",
"extra": "mean: 849.7804276667011 msec\nrounds: 3"
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
"id": "6a7bf00e38adfd7430e4625fd835b19a64c42344",
"message": "feat: add multi-material and level-set base reference support (#212)\n\n* feat: add multi-material and level-set base reference support\n\nExpose set_multi_materials() and set_ls_base_references() on all three\nmesh classes. Both batch APIs automatically set the required count\nparameter (numberOfMat / numberOfLSBaseReferences) before applying\nentries.\n\nCloses #207 (priority 5: multi-material / level-set).\n\n* test: add empty material list tests for 2D and surface meshes",
"timestamp": "2026-04-01T11:46:32+02:00",
"tree_id": "4db6ef131a20bf069920073bef7867955b751bef",
"url": "https://github.com/kmarchais/mmgpy/commit/6a7bf00e38adfd7430e4625fd835b19a64c42344"
},
"date": 1775037302652,
"tool": "pytest",
"benches": [
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
"value": 1.1751230198293783,
"unit": "iter/sec",
"range": "stddev: 0.02071754030138169",
"extra": "mean: 850.9747346666691 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
"value": 0.5966670683535422,
"unit": "iter/sec",
"range": "stddev: 0.014226636300436423",
"extra": "mean: 1.6759765253333399 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
"value": 1.1965780433423694,
"unit": "iter/sec",
"range": "stddev: 0.0012278463776566359",
"extra": "mean: 835.7164880000028 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
"value": 1.2535412823272298,
"unit": "iter/sec",
"range": "stddev: 0.0017538231672566084",
"extra": "mean: 797.739982000015 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
"value": 1.1920910736790344,
"unit": "iter/sec",
"range": "stddev: 0.00770626063312972",
"extra": "mean: 838.8620819999915 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
"value": 0.5942636654239405,
"unit": "iter/sec",
"range": "stddev: 0.022144398353567477",
"extra": "mean: 1.682754740333337 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
"value": 1.263427149947422,
"unit": "iter/sec",
"range": "stddev: 0.0014215813570014864",
"extra": "mean: 791.4979506666574 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
"value": 1.2666631880436328,
"unit": "iter/sec",
"range": "stddev: 0.002896417040418568",
"extra": "mean: 789.47585233333 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
"value": 59.95473520270496,
"unit": "iter/sec",
"range": "stddev: 0.0005815135805734467",
"extra": "mean: 16.679249714289178 msec\nrounds: 63"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
"value": 1.2559035315379452,
"unit": "iter/sec",
"range": "stddev: 0.0020508218592345416",
"extra": "mean: 796.2394999999939 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
"value": 119.93484520704287,
"unit": "iter/sec",
"range": "stddev: 0.00005572003194944709",
"extra": "mean: 8.337860429750048 msec\nrounds: 121"
},
{
"name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
"value": 16.164542814042026,
"unit": "iter/sec",
"range": "stddev: 0.000564393225951031",
"extra": "mean: 61.86379729411877 msec\nrounds: 17"
},
{
"name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
"value": 1.1812369869470332,
"unit": "iter/sec",
"range": "stddev: 0.003919987743539185",
"extra": "mean: 846.5701726666642 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
"value": 18.073229411513733,
"unit": "iter/sec",
"range": "stddev: 0.0013337460544035316",
"extra": "mean: 55.330454631585646 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
"value": 367.0099291185762,
"unit": "iter/sec",
"range": "stddev: 0.00008926264036883088",
"extra": "mean: 2.7247219234684867 msec\nrounds: 392"
},
{
"name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
"value": 31.179547559082366,
"unit": "iter/sec",
"range": "stddev: 0.0001307000786930641",
"extra": "mean: 32.072306312498355 msec\nrounds: 32"
},
{
"name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
"value": 164.60269451171703,
"unit": "iter/sec",
"range": "stddev: 0.0004045672775416398",
"extra": "mean: 6.07523469142734 msec\nrounds: 175"
},
{
"name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
"value": 258.6288799369451,
"unit": "iter/sec",
"range": "stddev: 0.00017200582769647273",
"extra": "mean: 3.866544216731729 msec\nrounds: 263"
},
{
"name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
"value": 274.009812000626,
"unit": "iter/sec",
"range": "stddev: 0.00015131331078748066",
"extra": "mean: 3.6495043469381865 msec\nrounds: 294"
},
{
"name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
"value": 75.00098092629528,
"unit": "iter/sec",
"range": "stddev: 0.0002580760317070108",
"extra": "mean: 13.333158948717173 msec\nrounds: 78"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
"value": 856.9873033225776,
"unit": "iter/sec",
"range": "stddev: 0.00012394580299797964",
"extra": "mean: 1.1668784311307248 msec\nrounds: 893"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
"value": 34.93362140813849,
"unit": "iter/sec",
"range": "stddev: 0.00020174101166072574",
"extra": "mean: 28.625718138888107 msec\nrounds: 36"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
"value": 1723.000816876708,
"unit": "iter/sec",
"range": "stddev: 0.00001712554744065142",
"extra": "mean: 580.3827776545718 usec\nrounds: 1799"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
"value": 79.41069094877159,
"unit": "iter/sec",
"range": "stddev: 0.00012475538975015085",
"extra": "mean: 12.592762864198061 msec\nrounds: 81"
},
{
"name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
"value": 92591.76380454189,
"unit": "iter/sec",
"range": "stddev: 0.0000012155311530598531",
"extra": "mean: 10.800096670703525 usec\nrounds: 94796"
},
{
"name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
"value": 27025.3550087263,
"unit": "iter/sec",
"range": "stddev: 0.000002183999712156756",
"extra": "mean: 37.00228913467028 usec\nrounds: 27565"
},
{
"name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
"value": 5815.335173799932,
"unit": "iter/sec",
"range": "stddev: 0.000005606974682400938",
"extra": "mean: 171.95913393012 usec\nrounds: 6481"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
"value": 36.700454698839906,
"unit": "iter/sec",
"range": "stddev: 0.00018491709634708395",
"extra": "mean: 27.247618815785675 msec\nrounds: 38"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
"value": 36.535636244736594,
"unit": "iter/sec",
"range": "stddev: 0.0002101263145626472",
"extra": "mean: 27.370537447368587 msec\nrounds: 38"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
"value": 36.10138187542084,
"unit": "iter/sec",
"range": "stddev: 0.0001778766632924087",
"extra": "mean: 27.699770702706456 msec\nrounds: 37"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
"value": 3806.81224135372,
"unit": "iter/sec",
"range": "stddev: 0.000008184568238231091",
"extra": "mean: 262.68697708201006 usec\nrounds: 3927"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
"value": 3318.6182424163844,
"unit": "iter/sec",
"range": "stddev: 0.000008056151061788213",
"extra": "mean: 301.3302305214445 usec\nrounds: 3414"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
"value": 2357.743981748764,
"unit": "iter/sec",
"range": "stddev: 0.000009416487849048028",
"extra": "mean: 424.1342604375091 usec\nrounds: 2419"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
"value": 136.5872724786846,
"unit": "iter/sec",
"range": "stddev: 0.00010775521505552788",
"extra": "mean: 7.321326371430814 msec\nrounds: 140"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
"value": 136.4510949144641,
"unit": "iter/sec",
"range": "stddev: 0.00008457482522422383",
"extra": "mean: 7.328633021426916 msec\nrounds: 140"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
"value": 130.73373580572826,
"unit": "iter/sec",
"range": "stddev: 0.0001740078827851183",
"extra": "mean: 7.649135044117539 msec\nrounds: 136"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
"value": 36.62536857252162,
"unit": "iter/sec",
"range": "stddev: 0.0002365725684186193",
"extra": "mean: 27.30347950000578 msec\nrounds: 38"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
"value": 35.97404032970169,
"unit": "iter/sec",
"range": "stddev: 0.00028348219019443897",
"extra": "mean: 27.797822842110893 msec\nrounds: 38"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
"value": 8779.526455292153,
"unit": "iter/sec",
"range": "stddev: 0.0000050995726064589235",
"extra": "mean: 113.9013596111686 usec\nrounds: 9057"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
"value": 994004.9486425725,
"unit": "iter/sec",
"range": "stddev: 1.0944241374077466e-7",
"extra": "mean: 1.0060312087637133 usec\nrounds: 103221"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
"value": 3405536.7991402606,
"unit": "iter/sec",
"range": "stddev: 4.327466999547202e-8",
"extra": "mean: 293.63946390256405 nsec\nrounds: 195695"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
"value": 1599441.6709372464,
"unit": "iter/sec",
"range": "stddev: 8.108575717654988e-8",
"extra": "mean: 625.2181734229898 nsec\nrounds: 166639"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
"value": 151675.8365201058,
"unit": "iter/sec",
"range": "stddev: 9.921656425346636e-7",
"extra": "mean: 6.593007976372309 usec\nrounds: 169751"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
"value": 1203.5779713768802,
"unit": "iter/sec",
"range": "stddev: 0.00002652221461751522",
"extra": "mean: 830.8560174593515 usec\nrounds: 1260"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
"value": 119.51817517926538,
"unit": "iter/sec",
"range": "stddev: 0.00008665298514327888",
"extra": "mean: 8.366928280992404 msec\nrounds: 121"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
"value": 18.10701979843127,
"unit": "iter/sec",
"range": "stddev: 0.001442564406723727",
"extra": "mean: 55.22719978947814 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
"value": 118.1585353575845,
"unit": "iter/sec",
"range": "stddev: 0.00008201722085090845",
"extra": "mean: 8.463205785123256 msec\nrounds: 121"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
"value": 108.02652456568636,
"unit": "iter/sec",
"range": "stddev: 0.000049208754971697837",
"extra": "mean: 9.256985763639396 msec\nrounds: 110"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
"value": 118.70305140991162,
"unit": "iter/sec",
"range": "stddev: 0.000054201089594804935",
"extra": "mean: 8.424383266667235 msec\nrounds: 120"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
"value": 161.288574706026,
"unit": "iter/sec",
"range": "stddev: 0.00003934300394704188",
"extra": "mean: 6.200067189028476 msec\nrounds: 164"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
"value": 1241.5744814224622,
"unit": "iter/sec",
"range": "stddev: 0.000017590109471656508",
"extra": "mean: 805.428925097033 usec\nrounds: 1295"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
"value": 118.36728942999771,
"unit": "iter/sec",
"range": "stddev: 0.00044615762874725004",
"extra": "mean: 8.44827996666595 msec\nrounds: 120"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
"value": 119.39543001109492,
"unit": "iter/sec",
"range": "stddev: 0.000047661973481811895",
"extra": "mean: 8.375529950409947 msec\nrounds: 121"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
"value": 28224.22531223123,
"unit": "iter/sec",
"range": "stddev: 0.000002454456492168966",
"extra": "mean: 35.4305561600885 usec\nrounds: 29229"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
"value": 48.93607059814888,
"unit": "iter/sec",
"range": "stddev: 0.01519079455362409",
"extra": "mean: 20.43482420588602 msec\nrounds: 68"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
"value": 3.4082321982108197,
"unit": "iter/sec",
"range": "stddev: 0.0010389292825125705",
"extra": "mean: 293.40723925000134 msec\nrounds: 4"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
"value": 1.2669141570521991,
"unit": "iter/sec",
"range": "stddev: 0.0028149277168974963",
"extra": "mean: 789.3194613333208 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
"value": 0.13828393826579646,
"unit": "iter/sec",
"range": "stddev: 0.009423067059860962",
"extra": "mean: 7.231497833666651 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
"value": 1.26797598619333,
"unit": "iter/sec",
"range": "stddev: 0.0014189918232574874",
"extra": "mean: 788.6584690000026 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
"value": 3.129681801034069,
"unit": "iter/sec",
"range": "stddev: 0.0013013065879995817",
"extra": "mean: 319.5213007499973 msec\nrounds: 4"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
"value": 1.0280975940174368,
"unit": "iter/sec",
"range": "stddev: 0.0015032405228224592",
"extra": "mean: 972.6703046666595 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
"value": 2.417600415333488,
"unit": "iter/sec",
"range": "stddev: 0.0003844577586016972",
"extra": "mean: 413.6332843333245 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
"value": 3.3029155645727366,
"unit": "iter/sec",
"range": "stddev: 0.0006137041152071892",
"extra": "mean: 302.76281075001066 msec\nrounds: 4"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
"value": 1.265420882332516,
"unit": "iter/sec",
"range": "stddev: 0.0006383145117836436",
"extra": "mean: 790.2509069999913 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
"value": 1.2663967997318852,
"unit": "iter/sec",
"range": "stddev: 0.0020164290639777915",
"extra": "mean: 789.6419196666594 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
"value": 11338.392168652988,
"unit": "iter/sec",
"range": "stddev: 0.00000355772735102667",
"extra": "mean: 88.19592629408945 usec\nrounds: 11573"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
"value": 288.98113602210685,
"unit": "iter/sec",
"range": "stddev: 0.000024332816105490627",
"extra": "mean: 3.4604334863002983 msec\nrounds: 292"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
"value": 28.191163901838376,
"unit": "iter/sec",
"range": "stddev: 0.0014526605773582148",
"extra": "mean: 35.47210762499908 msec\nrounds: 32"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
"value": 17.409837262571575,
"unit": "iter/sec",
"range": "stddev: 0.0013517801727256215",
"extra": "mean: 57.438790777777314 msec\nrounds: 18"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
"value": 5.578881395897151,
"unit": "iter/sec",
"range": "stddev: 0.002053561675111518",
"extra": "mean: 179.24740266667527 msec\nrounds: 6"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
"value": 17.766237262259107,
"unit": "iter/sec",
"range": "stddev: 0.0014567585127369016",
"extra": "mean: 56.28653863158206 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
"value": 21.66404861662769,
"unit": "iter/sec",
"range": "stddev: 0.001876990208825471",
"extra": "mean: 46.15942373912859 msec\nrounds: 23"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
"value": 18.213677424365198,
"unit": "iter/sec",
"range": "stddev: 0.0014479407059259386",
"extra": "mean: 54.90379436841558 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
"value": 17.534291802937233,
"unit": "iter/sec",
"range": "stddev: 0.0020188504374641487",
"extra": "mean: 57.031102894756565 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
"value": 29.201512868469095,
"unit": "iter/sec",
"range": "stddev: 0.001774152091930871",
"extra": "mean: 34.24480110000635 msec\nrounds: 30"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
"value": 17.735882081273683,
"unit": "iter/sec",
"range": "stddev: 0.001428638901764044",
"extra": "mean: 56.38287373684354 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
"value": 17.68387849264089,
"unit": "iter/sec",
"range": "stddev: 0.0013859672823476447",
"extra": "mean: 56.54868078946301 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
"value": 21513.38429294635,
"unit": "iter/sec",
"range": "stddev: 0.0000027982228732190597",
"extra": "mean: 46.48269125782654 usec\nrounds: 21986"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
"value": 46.26684833867332,
"unit": "iter/sec",
"range": "stddev: 0.015833879182710398",
"extra": "mean: 21.61374798386958 msec\nrounds: 62"
},
{
"name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
"value": 172.30858037769136,
"unit": "iter/sec",
"range": "stddev: 0.000027519561660092298",
"extra": "mean: 5.803541517248024 msec\nrounds: 174"
},
{
"name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
"value": 14.347964679559912,
"unit": "iter/sec",
"range": "stddev: 0.00008617516205697566",
"extra": "mean: 69.69629646667576 msec\nrounds: 15"
},
{
"name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
"value": 1.1757677336497367,
"unit": "iter/sec",
"range": "stddev: 0.0029918225408342627",
"extra": "mean: 850.5081159999767 msec\nrounds: 3"
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
"id": "dae574bdf87df5bfbf0c5d90be9b4ce9f51ef925",
"message": "ci: skip free-threaded Python 3.14 wheel builds (#214)\n\n* ci: skip free-threaded Python 3.14 wheel builds\n\nVTK has no free-threaded (cp314t) wheels on any platform, causing\npyvista dependency resolution to fail during wheel testing on Windows\nand macOS.\n\n* ci: only skip free-threaded builds on Windows and macOS\n\nVTK 9.6.1 has manylinux wheels that work with free-threaded Python,\nbut no Windows or macOS wheels. Keep cp314t for Linux.",
"timestamp": "2026-04-01T12:05:22+02:00",
"tree_id": "a988db53c267b86d35453705a37a8677863169d4",
"url": "https://github.com/kmarchais/mmgpy/commit/dae574bdf87df5bfbf0c5d90be9b4ce9f51ef925"
},
"date": 1775038444090,
"tool": "pytest",
"benches": [
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
"value": 1.1608338997667549,
"unit": "iter/sec",
"range": "stddev: 0.022200774613543802",
"extra": "mean: 861.4496873333289 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
"value": 0.5831672353497769,
"unit": "iter/sec",
"range": "stddev: 0.011763364885344914",
"extra": "mean: 1.7147739780000013 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
"value": 1.1475605261233652,
"unit": "iter/sec",
"range": "stddev: 0.018817741609288327",
"extra": "mean: 871.4137313333291 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
"value": 1.227037382450957,
"unit": "iter/sec",
"range": "stddev: 0.002664892965765417",
"extra": "mean: 814.9710956666544 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
"value": 1.1787451031067795,
"unit": "iter/sec",
"range": "stddev: 0.01401608562386826",
"extra": "mean: 848.3598340000166 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
"value": 0.5876220233147741,
"unit": "iter/sec",
"range": "stddev: 0.01931584111602473",
"extra": "mean: 1.701774202333335 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
"value": 1.250726270167153,
"unit": "iter/sec",
"range": "stddev: 0.008986963084636139",
"extra": "mean: 799.5354569999998 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
"value": 1.2110275573547093,
"unit": "iter/sec",
"range": "stddev: 0.011402947645054699",
"extra": "mean: 825.7450410000047 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
"value": 60.42885031387857,
"unit": "iter/sec",
"range": "stddev: 0.000450792070120323",
"extra": "mean: 16.548386984127877 msec\nrounds: 63"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
"value": 1.2084462124478,
"unit": "iter/sec",
"range": "stddev: 0.003257552415714778",
"extra": "mean: 827.5089033333339 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
"value": 117.30352211861165,
"unit": "iter/sec",
"range": "stddev: 0.00008283153282829221",
"extra": "mean: 8.524893216666147 msec\nrounds: 120"
},
{
"name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
"value": 15.311552176343422,
"unit": "iter/sec",
"range": "stddev: 0.0007246546827312286",
"extra": "mean: 65.31016506249543 msec\nrounds: 16"
},
{
"name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
"value": 1.1728249469749228,
"unit": "iter/sec",
"range": "stddev: 0.006885966436826638",
"extra": "mean: 852.6421633333333 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
"value": 17.586249395270563,
"unit": "iter/sec",
"range": "stddev: 0.0017027793387589913",
"extra": "mean: 56.8626076842131 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
"value": 376.95563482310075,
"unit": "iter/sec",
"range": "stddev: 0.00005172181649040388",
"extra": "mean: 2.6528320778897068 msec\nrounds: 398"
},
{
"name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
"value": 30.049754260234955,
"unit": "iter/sec",
"range": "stddev: 0.0005194409715541514",
"extra": "mean: 33.27814235483805 msec\nrounds: 31"
},
{
"name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
"value": 168.05484829439865,
"unit": "iter/sec",
"range": "stddev: 0.00007578243005467536",
"extra": "mean: 5.9504382655369685 msec\nrounds: 177"
},
{
"name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
"value": 256.4521094642913,
"unit": "iter/sec",
"range": "stddev: 0.00004607084389948469",
"extra": "mean: 3.8993635189389666 msec\nrounds: 264"
},
{
"name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
"value": 279.7485079688847,
"unit": "iter/sec",
"range": "stddev: 0.000052300491818118204",
"extra": "mean: 3.57463926174443 msec\nrounds: 298"
},
{
"name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
"value": 72.44372346260013,
"unit": "iter/sec",
"range": "stddev: 0.00020403737784104118",
"extra": "mean: 13.803818360002728 msec\nrounds: 75"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
"value": 869.8964980683935,
"unit": "iter/sec",
"range": "stddev: 0.000033262708874703567",
"extra": "mean: 1.149562048152282 msec\nrounds: 893"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
"value": 31.441629286936188,
"unit": "iter/sec",
"range": "stddev: 0.0011302960883445698",
"extra": "mean: 31.80496757575773 msec\nrounds: 33"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
"value": 1721.2901024138541,
"unit": "iter/sec",
"range": "stddev: 0.00001729099116491898",
"extra": "mean: 580.959594549256 usec\nrounds: 1798"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
"value": 78.57601612596726,
"unit": "iter/sec",
"range": "stddev: 0.00035024013337351436",
"extra": "mean: 12.726529662650163 msec\nrounds: 83"
},
{
"name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
"value": 92654.48715234877,
"unit": "iter/sec",
"range": "stddev: 0.0000011715239750259088",
"extra": "mean: 10.792785441202998 usec\nrounds: 94706"
},
{
"name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
"value": 26945.770781343715,
"unit": "iter/sec",
"range": "stddev: 0.000002128991089582933",
"extra": "mean: 37.11157524921737 usec\nrounds: 27482"
},
{
"name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
"value": 5886.029585291509,
"unit": "iter/sec",
"range": "stddev: 0.000004765499662769107",
"extra": "mean: 169.89381135611035 usec\nrounds: 6340"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
"value": 33.58587818610205,
"unit": "iter/sec",
"range": "stddev: 0.000285480454690033",
"extra": "mean: 29.774418714285794 msec\nrounds: 35"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
"value": 33.490967374621086,
"unit": "iter/sec",
"range": "stddev: 0.00034699010081835246",
"extra": "mean: 29.858797114286517 msec\nrounds: 35"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
"value": 32.96471631672356,
"unit": "iter/sec",
"range": "stddev: 0.00028450982993354676",
"extra": "mean: 30.33546505882361 msec\nrounds: 34"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
"value": 3010.119206786471,
"unit": "iter/sec",
"range": "stddev: 0.000013009103179841899",
"extra": "mean: 332.21275680559353 usec\nrounds: 3306"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
"value": 2701.0137323661506,
"unit": "iter/sec",
"range": "stddev: 0.000013036828541688836",
"extra": "mean: 370.2313646232286 usec\nrounds: 2951"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
"value": 2039.1497072859358,
"unit": "iter/sec",
"range": "stddev: 0.000013446400033914637",
"extra": "mean: 490.4004823319119 usec\nrounds: 2179"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
"value": 124.78444764844946,
"unit": "iter/sec",
"range": "stddev: 0.000528133241206997",
"extra": "mean: 8.013819180554153 msec\nrounds: 144"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
"value": 123.18429597249973,
"unit": "iter/sec",
"range": "stddev: 0.000477061271717213",
"extra": "mean: 8.11791788965734 msec\nrounds: 145"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
"value": 120.83992815749525,
"unit": "iter/sec",
"range": "stddev: 0.0010486021133521632",
"extra": "mean: 8.27541041481473 msec\nrounds: 135"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
"value": 32.36846401100222,
"unit": "iter/sec",
"range": "stddev: 0.0015928936967581021",
"extra": "mean: 30.89426794116936 msec\nrounds: 34"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
"value": 33.16948395223363,
"unit": "iter/sec",
"range": "stddev: 0.0004395738866073798",
"extra": "mean: 30.148192882351434 msec\nrounds: 34"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
"value": 7020.878898141095,
"unit": "iter/sec",
"range": "stddev: 0.000005533404581447153",
"extra": "mean: 142.43231004379925 usec\nrounds: 7786"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
"value": 982784.2974023953,
"unit": "iter/sec",
"range": "stddev: 1.101587581306729e-7",
"extra": "mean: 1.0175172747907222 usec\nrounds: 102062"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
"value": 3349373.7246800945,
"unit": "iter/sec",
"range": "stddev: 4.831205998332316e-8",
"extra": "mean: 298.5632784515595 nsec\nrounds: 191976"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
"value": 1607169.919880327,
"unit": "iter/sec",
"range": "stddev: 8.848353345179274e-8",
"extra": "mean: 622.2117447758492 nsec\nrounds: 165810"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
"value": 151057.71516036836,
"unit": "iter/sec",
"range": "stddev: 0.000001072779949346001",
"extra": "mean: 6.619986267754438 usec\nrounds: 156202"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
"value": 1011.0752166242698,
"unit": "iter/sec",
"range": "stddev: 0.000022800067968675913",
"extra": "mean: 989.0461001890174 usec\nrounds: 1058"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
"value": 118.10630872073095,
"unit": "iter/sec",
"range": "stddev: 0.00009860338541528694",
"extra": "mean: 8.466948216666026 msec\nrounds: 120"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
"value": 18.365117129495573,
"unit": "iter/sec",
"range": "stddev: 0.0001641050740805617",
"extra": "mean: 54.451054842113415 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
"value": 119.88855360529213,
"unit": "iter/sec",
"range": "stddev: 0.00007525093334516656",
"extra": "mean: 8.341079860653668 msec\nrounds: 122"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
"value": 107.20556181517306,
"unit": "iter/sec",
"range": "stddev: 0.00015512673376719092",
"extra": "mean: 9.327874254547003 msec\nrounds: 110"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
"value": 118.50129305354086,
"unit": "iter/sec",
"range": "stddev: 0.00007668304444355661",
"extra": "mean: 8.438726483331987 msec\nrounds: 120"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
"value": 157.15467625595457,
"unit": "iter/sec",
"range": "stddev: 0.00009997419621067987",
"extra": "mean: 6.363157774391139 msec\nrounds: 164"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
"value": 1081.3148547302033,
"unit": "iter/sec",
"range": "stddev: 0.00004557042548537999",
"extra": "mean: 924.8000206651263 usec\nrounds: 1355"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
"value": 119.68210245676032,
"unit": "iter/sec",
"range": "stddev: 0.00004203919490971472",
"extra": "mean: 8.355468190085379 msec\nrounds: 121"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
"value": 119.27049704668293,
"unit": "iter/sec",
"range": "stddev: 0.00012197069265276182",
"extra": "mean: 8.384303115703426 msec\nrounds: 121"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
"value": 28485.180932393214,
"unit": "iter/sec",
"range": "stddev: 0.0000024176469207819286",
"extra": "mean: 35.10597325582737 usec\nrounds: 28941"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
"value": 49.74466479337867,
"unit": "iter/sec",
"range": "stddev: 0.015251951963798638",
"extra": "mean: 20.10265832835819 msec\nrounds: 67"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
"value": 3.234829502415601,
"unit": "iter/sec",
"range": "stddev: 0.004544721775454996",
"extra": "mean: 309.13530349999974 msec\nrounds: 4"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
"value": 1.24368290184352,
"unit": "iter/sec",
"range": "stddev: 0.008170229331359063",
"extra": "mean: 804.0634783333379 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
"value": 0.11787636195848075,
"unit": "iter/sec",
"range": "stddev: 0.10775285747774281",
"extra": "mean: 8.483465076333346 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
"value": 1.2202202695994766,
"unit": "iter/sec",
"range": "stddev: 0.01373604166362659",
"extra": "mean: 819.5241669999783 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
"value": 2.88633620438368,
"unit": "iter/sec",
"range": "stddev: 0.013003561588346327",
"extra": "mean: 346.4599856666837 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
"value": 1.0139879793854316,
"unit": "iter/sec",
"range": "stddev: 0.005196504837413289",
"extra": "mean: 986.20498500001 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
"value": 2.3807132704250025,
"unit": "iter/sec",
"range": "stddev: 0.0021153129059700974",
"extra": "mean: 420.04218333335075 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
"value": 3.1700738661528014,
"unit": "iter/sec",
"range": "stddev: 0.010250523699470835",
"extra": "mean: 315.45006274998855 msec\nrounds: 4"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
"value": 1.258601706216257,
"unit": "iter/sec",
"range": "stddev: 0.0019409516394046649",
"extra": "mean: 794.5325316666754 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
"value": 1.2561203138130697,
"unit": "iter/sec",
"range": "stddev: 0.0021341192758558957",
"extra": "mean: 796.1020843333131 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
"value": 10907.570482690344,
"unit": "iter/sec",
"range": "stddev: 0.000026623411019708488",
"extra": "mean: 91.67944425268117 usec\nrounds: 11570"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
"value": 289.29370901803543,
"unit": "iter/sec",
"range": "stddev: 0.00003317383718371623",
"extra": "mean: 3.456694593858787 msec\nrounds: 293"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
"value": 28.784624532729463,
"unit": "iter/sec",
"range": "stddev: 0.0014729821853842074",
"extra": "mean: 34.740769290318624 msec\nrounds: 31"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
"value": 17.860942873459148,
"unit": "iter/sec",
"range": "stddev: 0.0013276613119909725",
"extra": "mean: 55.988085684209395 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
"value": 5.583276596231449,
"unit": "iter/sec",
"range": "stddev: 0.0016034619174283545",
"extra": "mean: 179.1062976666732 msec\nrounds: 6"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
"value": 17.77514654050464,
"unit": "iter/sec",
"range": "stddev: 0.0015060916920333605",
"extra": "mean: 56.2583266315851 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
"value": 21.2915821034443,
"unit": "iter/sec",
"range": "stddev: 0.003472062106487762",
"extra": "mean: 46.96691843478517 msec\nrounds: 23"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
"value": 17.775426598192002,
"unit": "iter/sec",
"range": "stddev: 0.0015417740677112265",
"extra": "mean: 56.25744026316158 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
"value": 17.62340877911618,
"unit": "iter/sec",
"range": "stddev: 0.0014312733454556156",
"extra": "mean: 56.742711500002464 msec\nrounds: 18"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
"value": 29.506348744130168,
"unit": "iter/sec",
"range": "stddev: 0.0013575394327829146",
"extra": "mean: 33.89101134375139 msec\nrounds: 32"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
"value": 17.652447940998286,
"unit": "iter/sec",
"range": "stddev: 0.002293640842274472",
"extra": "mean: 56.64936689474512 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
"value": 17.905075940220677,
"unit": "iter/sec",
"range": "stddev: 0.0014186500439055004",
"extra": "mean: 55.85008426318215 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
"value": 21450.973514799505,
"unit": "iter/sec",
"range": "stddev: 0.0000026879555097629114",
"extra": "mean: 46.61793085102071 usec\nrounds: 21938"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
"value": 46.46630230542203,
"unit": "iter/sec",
"range": "stddev: 0.015063562083084209",
"extra": "mean: 21.52097219673347 msec\nrounds: 61"
},
{
"name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
"value": 172.05322974916845,
"unit": "iter/sec",
"range": "stddev: 0.00005518074325377522",
"extra": "mean: 5.812154770113131 msec\nrounds: 174"
},
{
"name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
"value": 14.529155910941105,
"unit": "iter/sec",
"range": "stddev: 0.0002593619123743843",
"extra": "mean: 68.82712293333952 msec\nrounds: 15"
},
{
"name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
"value": 1.170500961266739,
"unit": "iter/sec",
"range": "stddev: 0.002680578522237235",
"extra": "mean: 854.3350523333023 msec\nrounds: 3"
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
"id": "8e7273f4074b88f133a1dda8d9a3c693858e161d",
"message": "chore: update uv.lock for v0.10.0.dev0 (#216)",
"timestamp": "2026-04-01T15:28:44+02:00",
"tree_id": "919f1b19f8b53f32893e89bcc71e76f7f04f7be3",
"url": "https://github.com/kmarchais/mmgpy/commit/8e7273f4074b88f133a1dda8d9a3c693858e161d"
},
"date": 1775050649635,
"tool": "pytest",
"benches": [
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
"value": 1.1027909045868804,
"unit": "iter/sec",
"range": "stddev: 0.02457600414060033",
"extra": "mean: 906.7902136666722 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
"value": 0.5410417343074054,
"unit": "iter/sec",
"range": "stddev: 0.00774097254286944",
"extra": "mean: 1.8482862533333275 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
"value": 1.0709019966779199,
"unit": "iter/sec",
"range": "stddev: 0.0015586271828458538",
"extra": "mean: 933.7922640000045 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
"value": 1.154141984407393,
"unit": "iter/sec",
"range": "stddev: 0.003889680274552048",
"extra": "mean: 866.4445220000042 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
"value": 1.1163652656276966,
"unit": "iter/sec",
"range": "stddev: 0.007420673620857831",
"extra": "mean: 895.7641650000028 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
"value": 0.5561670728905059,
"unit": "iter/sec",
"range": "stddev: 0.024375811229816753",
"extra": "mean: 1.7980208623333453 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
"value": 1.1661857799829276,
"unit": "iter/sec",
"range": "stddev: 0.0028122133440328123",
"extra": "mean: 857.4963073333303 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
"value": 1.1561322938459997,
"unit": "iter/sec",
"range": "stddev: 0.007276999551684049",
"extra": "mean: 864.9529170000013 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
"value": 54.95437178305776,
"unit": "iter/sec",
"range": "stddev: 0.0005281097248156442",
"extra": "mean: 18.196914413791852 msec\nrounds: 58"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
"value": 1.1152007712490728,
"unit": "iter/sec",
"range": "stddev: 0.005725256481626084",
"extra": "mean: 896.699523333325 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
"value": 111.35703767630217,
"unit": "iter/sec",
"range": "stddev: 0.00008740952095845245",
"extra": "mean: 8.98012394067851 msec\nrounds: 118"
},
{
"name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
"value": 14.211679089129397,
"unit": "iter/sec",
"range": "stddev: 0.0021860803893468087",
"extra": "mean: 70.3646623124854 msec\nrounds: 16"
},
{
"name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
"value": 1.0326442800502575,
"unit": "iter/sec",
"range": "stddev: 0.015770365745276637",
"extra": "mean: 968.3876813333351 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
"value": 16.732940996497682,
"unit": "iter/sec",
"range": "stddev: 0.0011222602550918902",
"extra": "mean: 59.76235738889576 msec\nrounds: 18"
},
{
"name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
"value": 353.18507727815927,
"unit": "iter/sec",
"range": "stddev: 0.0003946875681573498",
"extra": "mean: 2.831376703983522 msec\nrounds: 402"
},
{
"name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
"value": 30.063897507122707,
"unit": "iter/sec",
"range": "stddev: 0.0003911607770560642",
"extra": "mean: 33.26248699999995 msec\nrounds: 31"
},
{
"name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
"value": 164.86867267179676,
"unit": "iter/sec",
"range": "stddev: 0.00019102475495381307",
"extra": "mean: 6.065433679997503 msec\nrounds: 175"
},
{
"name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
"value": 243.7604994365437,
"unit": "iter/sec",
"range": "stddev: 0.00009402716197616084",
"extra": "mean: 4.10238739382105 msec\nrounds: 259"
},
{
"name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
"value": 270.66700149304114,
"unit": "iter/sec",
"range": "stddev: 0.0002973496862787279",
"extra": "mean: 3.694576710436976 msec\nrounds: 297"
},
{
"name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
"value": 71.4705051607854,
"unit": "iter/sec",
"range": "stddev: 0.00016366541889437745",
"extra": "mean: 13.9917858108086 msec\nrounds: 74"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
"value": 829.3999987662907,
"unit": "iter/sec",
"range": "stddev: 0.00012911603539312864",
"extra": "mean: 1.2056908626567062 msec\nrounds: 881"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
"value": 33.47950763770168,
"unit": "iter/sec",
"range": "stddev: 0.0005060885720600126",
"extra": "mean: 29.86901751428052 msec\nrounds: 35"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
"value": 1683.3549770829445,
"unit": "iter/sec",
"range": "stddev: 0.00004865318229642683",
"extra": "mean: 594.0517678171968 usec\nrounds: 1796"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
"value": 73.51611385664866,
"unit": "iter/sec",
"range": "stddev: 0.00019372805112470755",
"extra": "mean: 13.602460025973773 msec\nrounds: 77"
},
{
"name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
"value": 92615.31828996738,
"unit": "iter/sec",
"range": "stddev: 0.0000012925946012475453",
"extra": "mean: 10.79734992508605 usec\nrounds: 94706"
},
{
"name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
"value": 27053.00228036296,
"unit": "iter/sec",
"range": "stddev: 0.0000028083618240982165",
"extra": "mean: 36.964474021645756 usec\nrounds: 27619"
},
{
"name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
"value": 6278.412814377405,
"unit": "iter/sec",
"range": "stddev: 0.000012292323460280248",
"extra": "mean: 159.27592363949464 usec\nrounds: 6561"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
"value": 34.15062448481402,
"unit": "iter/sec",
"range": "stddev: 0.0003602748484626579",
"extra": "mean: 29.282041399994796 msec\nrounds: 35"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
"value": 34.1222339885838,
"unit": "iter/sec",
"range": "stddev: 0.00023950571171070048",
"extra": "mean: 29.306404742859673 msec\nrounds: 35"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
"value": 33.414857853339434,
"unit": "iter/sec",
"range": "stddev: 0.0008999359931225199",
"extra": "mean: 29.92680694286004 msec\nrounds: 35"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
"value": 3084.1156309260205,
"unit": "iter/sec",
"range": "stddev: 0.00002659165387780035",
"extra": "mean: 324.24205823299343 usec\nrounds: 3984"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
"value": 2716.7984876046426,
"unit": "iter/sec",
"range": "stddev: 0.000014100419646635067",
"extra": "mean: 368.0802991324115 usec\nrounds: 3460"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
"value": 2008.9787179825846,
"unit": "iter/sec",
"range": "stddev: 0.000021067502436865445",
"extra": "mean: 497.76535263857824 usec\nrounds: 2141"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
"value": 126.31323335315513,
"unit": "iter/sec",
"range": "stddev: 0.0001614993251742329",
"extra": "mean: 7.916826871212552 msec\nrounds: 132"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
"value": 119.91371087451529,
"unit": "iter/sec",
"range": "stddev: 0.0002446364562939764",
"extra": "mean: 8.33932994573455 msec\nrounds: 129"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
"value": 123.01297461924014,
"unit": "iter/sec",
"range": "stddev: 0.00015149986270776436",
"extra": "mean: 8.129223792004723 msec\nrounds: 125"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
"value": 34.423038012905806,
"unit": "iter/sec",
"range": "stddev: 0.00022266522187506624",
"extra": "mean: 29.050312166668217 msec\nrounds: 36"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
"value": 33.95486517531319,
"unit": "iter/sec",
"range": "stddev: 0.0003387111831943062",
"extra": "mean: 29.450860571434337 msec\nrounds: 35"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
"value": 7014.239230722349,
"unit": "iter/sec",
"range": "stddev: 0.000005894752075079271",
"extra": "mean: 142.56713623624393 usec\nrounds: 9278"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
"value": 996998.9316434729,
"unit": "iter/sec",
"range": "stddev: 1.0829177976930217e-7",
"extra": "mean: 1.0030101018780233 usec\nrounds: 102575"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
"value": 3367571.801959658,
"unit": "iter/sec",
"range": "stddev: 4.9549514466943013e-8",
"extra": "mean: 296.94986738458846 nsec\nrounds: 193837"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
"value": 1602609.3241379708,
"unit": "iter/sec",
"range": "stddev: 8.421189863589896e-8",
"extra": "mean: 623.9823923013122 nsec\nrounds: 166058"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
"value": 148089.40909294985,
"unit": "iter/sec",
"range": "stddev: 0.0000024122241875726033",
"extra": "mean: 6.75267735974515 usec\nrounds: 170329"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
"value": 1029.899814945957,
"unit": "iter/sec",
"range": "stddev: 0.0000509262385454737",
"extra": "mean: 970.9682296160761 usec\nrounds: 1067"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
"value": 117.3647007552977,
"unit": "iter/sec",
"range": "stddev: 0.00007287736096564172",
"extra": "mean: 8.52044945000093 msec\nrounds: 120"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
"value": 18.28738166372333,
"unit": "iter/sec",
"range": "stddev: 0.00016651703223389825",
"extra": "mean: 54.6825137894781 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
"value": 117.9907533950113,
"unit": "iter/sec",
"range": "stddev: 0.00004911240721729981",
"extra": "mean: 8.475240400001383 msec\nrounds: 120"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
"value": 107.74897226086992,
"unit": "iter/sec",
"range": "stddev: 0.00006514937880645345",
"extra": "mean: 9.280830981653454 msec\nrounds: 109"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
"value": 117.68374788566304,
"unit": "iter/sec",
"range": "stddev: 0.00006829901023160883",
"extra": "mean: 8.497350041668977 msec\nrounds: 120"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
"value": 157.9289033860485,
"unit": "iter/sec",
"range": "stddev: 0.00011271032125786755",
"extra": "mean: 6.331963171779615 msec\nrounds: 163"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
"value": 1210.6462020278861,
"unit": "iter/sec",
"range": "stddev: 0.000019006049495724038",
"extra": "mean: 826.0051518973551 usec\nrounds: 1264"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
"value": 119.47858208614545,
"unit": "iter/sec",
"range": "stddev: 0.0000685524391241354",
"extra": "mean: 8.369700933335386 msec\nrounds: 120"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
"value": 119.37788058517161,
"unit": "iter/sec",
"range": "stddev: 0.00006556204511407663",
"extra": "mean: 8.3767612148763 msec\nrounds: 121"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
"value": 27873.967294116657,
"unit": "iter/sec",
"range": "stddev: 0.0000032038759163448977",
"extra": "mean: 35.87576857819839 usec\nrounds: 28999"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
"value": 49.84580486692895,
"unit": "iter/sec",
"range": "stddev: 0.014663032540781568",
"extra": "mean: 20.06186885074188 msec\nrounds: 67"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
"value": 3.353946939977478,
"unit": "iter/sec",
"range": "stddev: 0.0020707601388121537",
"extra": "mean: 298.1561777500019 msec\nrounds: 4"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
"value": 1.2283979127919262,
"unit": "iter/sec",
"range": "stddev: 0.00331414534372786",
"extra": "mean: 814.0684623333337 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
"value": 0.13203520669405336,
"unit": "iter/sec",
"range": "stddev: 0.25833847065755106",
"extra": "mean: 7.5737375283333295 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
"value": 1.2250606466783445,
"unit": "iter/sec",
"range": "stddev: 0.0068963408866349225",
"extra": "mean: 816.2861183333424 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
"value": 3.118092161573207,
"unit": "iter/sec",
"range": "stddev: 0.0015879371337507026",
"extra": "mean: 320.70892974999765 msec\nrounds: 4"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
"value": 0.9788823271618481,
"unit": "iter/sec",
"range": "stddev: 0.010884692062892066",
"extra": "mean: 1.0215732496666685 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
"value": 2.381633412807202,
"unit": "iter/sec",
"range": "stddev: 0.005462036605416146",
"extra": "mean: 419.87990033332306 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
"value": 3.2833856203327634,
"unit": "iter/sec",
"range": "stddev: 0.0022833452050510855",
"extra": "mean: 304.5636777499965 msec\nrounds: 4"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
"value": 1.2272756565565683,
"unit": "iter/sec",
"range": "stddev: 0.005619390499128529",
"extra": "mean: 814.8128700000067 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
"value": 1.2294029447136512,
"unit": "iter/sec",
"range": "stddev: 0.004448482677153088",
"extra": "mean: 813.4029646666553 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
"value": 11407.86016046163,
"unit": "iter/sec",
"range": "stddev: 0.0000036916029433470295",
"extra": "mean: 87.65885853561637 usec\nrounds: 11593"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
"value": 289.9097806207149,
"unit": "iter/sec",
"range": "stddev: 0.00003093482909154201",
"extra": "mean: 3.4493489590414566 msec\nrounds: 293"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
"value": 30.31139559635759,
"unit": "iter/sec",
"range": "stddev: 0.0010723906179417127",
"extra": "mean: 32.9908927096767 msec\nrounds: 31"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
"value": 17.976920527382326,
"unit": "iter/sec",
"range": "stddev: 0.0014034240585827076",
"extra": "mean: 55.62687994736399 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
"value": 5.594943741917565,
"unit": "iter/sec",
"range": "stddev: 0.0011072409549281114",
"extra": "mean: 178.7328069999982 msec\nrounds: 6"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
"value": 18.143887508176046,
"unit": "iter/sec",
"range": "stddev: 0.0013887086622699379",
"extra": "mean: 55.11498015788387 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
"value": 21.826312774483938,
"unit": "iter/sec",
"range": "stddev: 0.002339150642640541",
"extra": "mean: 45.81625904165776 msec\nrounds: 24"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
"value": 18.303937375288385,
"unit": "iter/sec",
"range": "stddev: 0.0020490261005280705",
"extra": "mean: 54.63305405262537 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
"value": 18.003865784372096,
"unit": "iter/sec",
"range": "stddev: 0.000898507656058252",
"extra": "mean: 55.54362668422192 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
"value": 30.479313556429023,
"unit": "iter/sec",
"range": "stddev: 0.0009548299921423861",
"extra": "mean: 32.80913784848246 msec\nrounds: 33"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
"value": 18.247540251496496,
"unit": "iter/sec",
"range": "stddev: 0.0010236567178132882",
"extra": "mean: 54.801906789491206 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
"value": 17.77563600282389,
"unit": "iter/sec",
"range": "stddev: 0.001482042934886713",
"extra": "mean: 56.25677752633644 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
"value": 21532.842477635804,
"unit": "iter/sec",
"range": "stddev: 0.0000028525864699218293",
"extra": "mean: 46.44068710569023 usec\nrounds: 22049"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
"value": 46.58671527728999,
"unit": "iter/sec",
"range": "stddev: 0.014765761223937994",
"extra": "mean: 21.46534680644201 msec\nrounds: 62"
},
{
"name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
"value": 172.15399937867835,
"unit": "iter/sec",
"range": "stddev: 0.00003100667460867838",
"extra": "mean: 5.808752649424955 msec\nrounds: 174"
},
{
"name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
"value": 14.333219763266628,
"unit": "iter/sec",
"range": "stddev: 0.0001462944549931295",
"extra": "mean: 69.76799466668429 msec\nrounds: 15"
},
{
"name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
"value": 1.1696166867397788,
"unit": "iter/sec",
"range": "stddev: 0.007441327721908065",
"extra": "mean: 854.9809619999754 msec\nrounds: 3"
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
"id": "f70de70c84da08f1f59dce98c632d7755067be25",
"message": "fix: use MMGS_Get_triangleQuality directly and add API coverage docs (#217)\n\n* fix: use MMGS_Get_triangleQuality directly and add API coverage docs\n\nReplace the manual C++ reimplementation of triangle quality computation\nfor surface meshes with the official MMGS_Get_triangleQuality C API\nfunction. The workaround was needed because MMG v5.8.0 is missing\nLIBMMGS_EXPORT on this function's declaration, causing Windows DLL\nlink failures. Fixed by enabling WINDOWS_EXPORT_ALL_SYMBOLS on the\nlibmmgs target.\n\nAlso adds a comprehensive MMG C API binding coverage reference page\ndocumenting all 371 public functions and their binding status.\n\n* fix: use #ifdef _WIN32 fallback for MMGS_Get_triangleQuality\n\nThe conda-forge mmgsuite package has the same missing DLL export as\nthe MMG source (missing LIBMMGS_EXPORT on MMGS_Get_triangleQuality).\nSince the conda build uses pre-built system MMG libraries, the\nWINDOWS_EXPORT_ALL_SYMBOLS CMake fix only helps pip/FetchContent builds.\n\nUse a wrapper function with #ifdef _WIN32 that calls the C API on\nLinux/macOS and falls back to manual computation on Windows.\n\nAlso remove the lucide/check-square icon from the API coverage page\nfrontmatter since it doesn't exist in mkdocs-material (only in zensical).\n\n* build: switch docs from mkdocs-material to zensical\n\nUpdate docs dependency group to use zensical (Material for MkDocs fork)\nand restore the lucide/check-square icon which is available in zensical.\n\n* fix: fix infinite recursion in get_triangle_quality on non-Windows\n\nThe #else branch was calling get_triangle_quality (itself) instead of\nMMGS_Get_triangleQuality (the MMG C API function).\n\n* fix: pin mike git dependency to specific commit",
"timestamp": "2026-04-03T13:00:18+02:00",
"tree_id": "e9ce2c25da7b729e9f6e814307e47876657c6276",
"url": "https://github.com/kmarchais/mmgpy/commit/f70de70c84da08f1f59dce98c632d7755067be25"
},
"date": 1775214607373,
"tool": "pytest",
"benches": [
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
"value": 1.176294974776227,
"unit": "iter/sec",
"range": "stddev: 0.011995403593868465",
"extra": "mean: 850.1268996666719 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
"value": 0.5930529721467961,
"unit": "iter/sec",
"range": "stddev: 0.020368532329079425",
"extra": "mean: 1.6861900149999987 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
"value": 1.168178573608312,
"unit": "iter/sec",
"range": "stddev: 0.016624405864641395",
"extra": "mean: 856.033505999998 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
"value": 1.240100284595153,
"unit": "iter/sec",
"range": "stddev: 0.00197388213192307",
"extra": "mean: 806.3863966666721 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
"value": 1.1729210994637609,
"unit": "iter/sec",
"range": "stddev: 0.01826330875676664",
"extra": "mean: 852.5722663333303 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
"value": 0.5942308461288136,
"unit": "iter/sec",
"range": "stddev: 0.009826412852054833",
"extra": "mean: 1.6828476786666613 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
"value": 1.2480910608436004,
"unit": "iter/sec",
"range": "stddev: 0.0026262829848766127",
"extra": "mean: 801.2235896666766 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
"value": 1.2097879105530338,
"unit": "iter/sec",
"range": "stddev: 0.00640647693112717",
"extra": "mean: 826.5911663333346 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
"value": 58.861522346456404,
"unit": "iter/sec",
"range": "stddev: 0.0006534209362468304",
"extra": "mean: 16.989027129030795 msec\nrounds: 62"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
"value": 1.2453395709127084,
"unit": "iter/sec",
"range": "stddev: 0.0007689412001091114",
"extra": "mean: 802.9938366666537 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
"value": 118.64601698829361,
"unit": "iter/sec",
"range": "stddev: 0.0000751372513768875",
"extra": "mean: 8.428432958677968 msec\nrounds: 121"
},
{
"name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
"value": 15.79308861462508,
"unit": "iter/sec",
"range": "stddev: 0.0007963329233922877",
"extra": "mean: 63.31883676470712 msec\nrounds: 17"
},
{
"name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
"value": 1.1656883409022742,
"unit": "iter/sec",
"range": "stddev: 0.007840569211081365",
"extra": "mean: 857.8622303333437 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
"value": 17.637083965927705,
"unit": "iter/sec",
"range": "stddev: 0.001196098679205933",
"extra": "mean: 56.69871515789432 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
"value": 359.01777856931534,
"unit": "iter/sec",
"range": "stddev: 0.00023447333057878886",
"extra": "mean: 2.7853773815463865 msec\nrounds: 401"
},
{
"name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
"value": 31.000735768556883,
"unit": "iter/sec",
"range": "stddev: 0.00023778553870670141",
"extra": "mean: 32.25729890624951 msec\nrounds: 32"
},
{
"name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
"value": 163.4231511984064,
"unit": "iter/sec",
"range": "stddev: 0.0003736934743293127",
"extra": "mean: 6.119084062856765 msec\nrounds: 175"
},
{
"name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
"value": 254.5191459144413,
"unit": "iter/sec",
"range": "stddev: 0.0001439024778848578",
"extra": "mean: 3.9289775093625297 msec\nrounds: 267"
},
{
"name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
"value": 268.03181310433325,
"unit": "iter/sec",
"range": "stddev: 0.0002754911908325229",
"extra": "mean: 3.730900404761815 msec\nrounds: 294"
},
{
"name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
"value": 73.94667451768765,
"unit": "iter/sec",
"range": "stddev: 0.0003280978667193544",
"extra": "mean: 13.523258571429135 msec\nrounds: 77"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
"value": 878.3813288036479,
"unit": "iter/sec",
"range": "stddev: 0.00002448387097020251",
"extra": "mean: 1.1384577144439036 msec\nrounds: 900"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
"value": 33.52792169917196,
"unit": "iter/sec",
"range": "stddev: 0.0002750138188080015",
"extra": "mean: 29.82588688235624 msec\nrounds: 34"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
"value": 1716.0347024318103,
"unit": "iter/sec",
"range": "stddev: 0.000017553279897137354",
"extra": "mean: 582.7387981040767 usec\nrounds: 1793"
},
{
"name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
"value": 79.17077570062348,
"unit": "iter/sec",
"range": "stddev: 0.0004434189638643721",
"extra": "mean: 12.6309233571413 msec\nrounds: 84"
},
{
"name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
"value": 90726.04545951741,
"unit": "iter/sec",
"range": "stddev: 0.000001106002593750083",
"extra": "mean: 11.022193185375933 usec\nrounds: 92507"
},
{
"name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
"value": 27062.907864748875,
"unit": "iter/sec",
"range": "stddev: 0.0000020558223755988953",
"extra": "mean: 36.95094425911867 usec\nrounds: 27574"
},
{
"name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
"value": 5867.890227883823,
"unit": "iter/sec",
"range": "stddev: 0.000005739775744412438",
"extra": "mean: 170.4190025996169 usec\nrounds: 6539"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
"value": 34.643200640505746,
"unit": "iter/sec",
"range": "stddev: 0.0003408602946344624",
"extra": "mean: 28.86569316666352 msec\nrounds: 36"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
"value": 35.07773568234042,
"unit": "iter/sec",
"range": "stddev: 0.0002603922873277535",
"extra": "mean: 28.508111500008855 msec\nrounds: 36"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
"value": 34.68026007756078,
"unit": "iter/sec",
"range": "stddev: 0.0002767081740513787",
"extra": "mean: 28.834847194442798 msec\nrounds: 36"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
"value": 3155.6169761743527,
"unit": "iter/sec",
"range": "stddev: 0.000020935277177080576",
"extra": "mean: 316.89524031282446 usec\nrounds: 3200"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
"value": 2723.3774662297274,
"unit": "iter/sec",
"range": "stddev: 0.000026875875240797473",
"extra": "mean: 367.1911119189844 usec\nrounds: 3574"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
"value": 2100.4700331228146,
"unit": "iter/sec",
"range": "stddev: 0.000011150601054957926",
"extra": "mean: 476.08391656665447 usec\nrounds: 2505"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
"value": 134.4076053368879,
"unit": "iter/sec",
"range": "stddev: 0.0004690593370198415",
"extra": "mean: 7.440055177633254 msec\nrounds: 152"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
"value": 131.45915959124673,
"unit": "iter/sec",
"range": "stddev: 0.0006837446040548722",
"extra": "mean: 7.606925246664862 msec\nrounds: 150"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
"value": 133.95969507584823,
"unit": "iter/sec",
"range": "stddev: 0.000435178991883315",
"extra": "mean: 7.464931891893291 msec\nrounds: 148"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
"value": 34.75925386902067,
"unit": "iter/sec",
"range": "stddev: 0.00042452952371853267",
"extra": "mean: 28.769317194442262 msec\nrounds: 36"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
"value": 34.90977458210795,
"unit": "iter/sec",
"range": "stddev: 0.000280643190894177",
"extra": "mean: 28.645272333340206 msec\nrounds: 36"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
"value": 7398.760614501777,
"unit": "iter/sec",
"range": "stddev: 0.00000557899750092782",
"extra": "mean: 135.15777197061522 usec\nrounds: 9911"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
"value": 977910.8431785917,
"unit": "iter/sec",
"range": "stddev: 1.0395099053625892e-7",
"extra": "mean: 1.022588109105744 usec\nrounds: 101338"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
"value": 3329556.8043772867,
"unit": "iter/sec",
"range": "stddev: 4.747393263851696e-8",
"extra": "mean: 300.34027312143303 nsec\nrounds: 198453"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
"value": 1602092.409839688,
"unit": "iter/sec",
"range": "stddev: 7.875383235814964e-8",
"extra": "mean: 624.1837199016904 nsec\nrounds: 166639"
},
{
"name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
"value": 148598.71772350365,
"unit": "iter/sec",
"range": "stddev: 8.877608373552307e-7",
"extra": "mean: 6.729533170405221 usec\nrounds: 166639"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
"value": 1064.1107418187444,
"unit": "iter/sec",
"range": "stddev: 0.00001990498717260199",
"extra": "mean: 939.7518140741928 usec\nrounds: 1151"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
"value": 118.48297539574301,
"unit": "iter/sec",
"range": "stddev: 0.00012656634146757106",
"extra": "mean: 8.440031123964575 msec\nrounds: 121"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
"value": 17.914147256356504,
"unit": "iter/sec",
"range": "stddev: 0.0009731114441904259",
"extra": "mean: 55.82180305262191 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
"value": 115.42718015621817,
"unit": "iter/sec",
"range": "stddev: 0.00047647632397362433",
"extra": "mean: 8.663470758330996 msec\nrounds: 120"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
"value": 106.7522572443876,
"unit": "iter/sec",
"range": "stddev: 0.00011227252869404027",
"extra": "mean: 9.367483422019857 msec\nrounds: 109"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
"value": 118.34354551181802,
"unit": "iter/sec",
"range": "stddev: 0.0000622125138626477",
"extra": "mean: 8.449974991666426 msec\nrounds: 120"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
"value": 160.20600992418926,
"unit": "iter/sec",
"range": "stddev: 0.00006170267399914293",
"extra": "mean: 6.241963085362452 msec\nrounds: 164"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
"value": 1049.3135349278004,
"unit": "iter/sec",
"range": "stddev: 0.000019008776065829796",
"extra": "mean: 953.004003773578 usec\nrounds: 1325"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
"value": 118.55699866603086,
"unit": "iter/sec",
"range": "stddev: 0.00007355455603906487",
"extra": "mean: 8.434761433333431 msec\nrounds: 120"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
"value": 119.4229387665207,
"unit": "iter/sec",
"range": "stddev: 0.00007182115137963279",
"extra": "mean: 8.373600669424677 msec\nrounds: 121"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
"value": 27959.509127730707,
"unit": "iter/sec",
"range": "stddev: 0.000009244323455766535",
"extra": "mean: 35.766007029364594 usec\nrounds: 29306"
},
{
"name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
"value": 49.54528029462362,
"unit": "iter/sec",
"range": "stddev: 0.014943104650578612",
"extra": "mean: 20.183557223885852 msec\nrounds: 67"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
"value": 3.3914266891939575,
"unit": "iter/sec",
"range": "stddev: 0.0014853019003163268",
"extra": "mean: 294.861157750006 msec\nrounds: 4"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
"value": 1.2571935572925188,
"unit": "iter/sec",
"range": "stddev: 0.0029101848019894767",
"extra": "mean: 795.4224663333397 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
"value": 0.1306219921946534,
"unit": "iter/sec",
"range": "stddev: 0.014539666362657215",
"extra": "mean: 7.655678673999982 sec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
"value": 1.2529255037876352,
"unit": "iter/sec",
"range": "stddev: 0.0038397313397686033",
"extra": "mean: 798.1320493333138 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
"value": 3.1522530351085902,
"unit": "iter/sec",
"range": "stddev: 0.001660123632787354",
"extra": "mean: 317.23341650000236 msec\nrounds: 4"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
"value": 1.0130315815350825,
"unit": "iter/sec",
"range": "stddev: 0.0029583816574859827",
"extra": "mean: 987.1360560000161 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
"value": 2.4082297514181707,
"unit": "iter/sec",
"range": "stddev: 0.0014833168267642384",
"extra": "mean: 415.2427730000075 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
"value": 3.2874636489115483,
"unit": "iter/sec",
"range": "stddev: 0.0024001031204999696",
"extra": "mean: 304.18587300002287 msec\nrounds: 4"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
"value": 1.2581402106737494,
"unit": "iter/sec",
"range": "stddev: 0.0022221070984382914",
"extra": "mean: 794.8239723333282 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
"value": 1.216267662694721,
"unit": "iter/sec",
"range": "stddev: 0.020715093939523227",
"extra": "mean: 822.1874433333483 msec\nrounds: 3"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
"value": 11387.920358260424,
"unit": "iter/sec",
"range": "stddev: 0.0000035040794918709983",
"extra": "mean: 87.8123457611497 usec\nrounds: 11560"
},
{
"name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
"value": 279.536690124952,
"unit": "iter/sec",
"range": "stddev: 0.0005420846544617029",
"extra": "mean: 3.5773479307957867 msec\nrounds: 289"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
"value": 28.392676141138555,
"unit": "iter/sec",
"range": "stddev: 0.001446535737253673",
"extra": "mean: 35.22035031249082 msec\nrounds: 32"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
"value": 17.635967257956388,
"unit": "iter/sec",
"range": "stddev: 0.0016602884316481207",
"extra": "mean: 56.7023053157946 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
"value": 5.577707410206167,
"unit": "iter/sec",
"range": "stddev: 0.001438038939858952",
"extra": "mean: 179.28513033333124 msec\nrounds: 6"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
"value": 17.564400526261643,
"unit": "iter/sec",
"range": "stddev: 0.0018413125311519773",
"extra": "mean: 56.9333407368408 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
"value": 21.443430054075943,
"unit": "iter/sec",
"range": "stddev: 0.001840343296503886",
"extra": "mean: 46.634330304349845 msec\nrounds: 23"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
"value": 17.671818759555393,
"unit": "iter/sec",
"range": "stddev: 0.001624517525473373",
"extra": "mean: 56.587271157887265 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
"value": 17.238511569750926,
"unit": "iter/sec",
"range": "stddev: 0.0016649638612800585",
"extra": "mean: 58.009648684213445 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
"value": 29.043305324891914,
"unit": "iter/sec",
"range": "stddev: 0.0015565873297294919",
"extra": "mean: 34.43134274193433 msec\nrounds: 31"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
"value": 17.666901428485147,
"unit": "iter/sec",
"range": "stddev: 0.0014834299223452693",
"extra": "mean: 56.603021421043 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
"value": 17.06429963539276,
"unit": "iter/sec",
"range": "stddev: 0.0015552406239270763",
"extra": "mean: 58.601877684210244 msec\nrounds: 19"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
"value": 17441.613972325802,
"unit": "iter/sec",
"range": "stddev: 0.000005838736778620915",
"extra": "mean: 57.334143593974524 usec\nrounds: 18037"
},
{
"name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
"value": 45.62223408993879,
"unit": "iter/sec",
"range": "stddev: 0.016106709194613118",
"extra": "mean: 21.919137016144788 msec\nrounds: 62"
},
{
"name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
"value": 172.50108613970448,
"unit": "iter/sec",
"range": "stddev: 0.000029860418729201552",
"extra": "mean: 5.797064948275885 msec\nrounds: 174"
},
{
"name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
"value": 14.530434690500421,
"unit": "iter/sec",
"range": "stddev: 0.00011878186485815536",
"extra": "mean: 68.82106566665698 msec\nrounds: 15"
},
{
"name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
"value": 1.1257521427281965,
"unit": "iter/sec",
"range": "stddev: 0.007682249781324232",
"extra": "mean: 888.2950003333386 msec\nrounds: 3"
}
]
}
]
}
};