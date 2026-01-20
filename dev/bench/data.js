window.BENCHMARK_DATA = {
  "lastUpdate": 1768939906015,
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
          "id": "60196215cf904727623f6705c46d71b017223424",
          "message": "feat(build): enable editable install with automatic C++ rebuild (#170)\n\nAdd scikit-build-core editable rebuild configuration and uv no-build-isolation\nsetting to simplify the development workflow:\n\n- Add `editable.rebuild = true` for automatic C++ rebuilds on import\n- Add `no-build-isolation-package` to allow `uv pip install -e .` without flags\n- Add build dependencies to dev group (required for no-build-isolation)\n- Update CONTRIBUTING.md to reflect simplified workflow\n- Update CI to install build deps before sdist build\n\nCloses #169",
          "timestamp": "2026-01-20T21:00:32+01:00",
          "tree_id": "ee6d08154bed87db809e04ab77422ff0c3fcd382",
          "url": "https://github.com/kmarchais/mmgpy/commit/60196215cf904727623f6705c46d71b017223424"
        },
        "date": 1768939904955,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 1.0356441796432372,
            "unit": "iter/sec",
            "range": "stddev: 0.03575149661636005",
            "extra": "mean: 965.5826003333345 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.52224154469322,
            "unit": "iter/sec",
            "range": "stddev: 0.02173488673184196",
            "extra": "mean: 1.914822767666692 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.1100892262856459,
            "unit": "iter/sec",
            "range": "stddev: 0.02306363505204836",
            "extra": "mean: 900.8284886666237 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.1580460246655013,
            "unit": "iter/sec",
            "range": "stddev: 0.029948201074488853",
            "extra": "mean: 863.5235376666893 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 1.0616684433699768,
            "unit": "iter/sec",
            "range": "stddev: 0.019936459497334552",
            "extra": "mean: 941.9136513333418 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.5282799531536932,
            "unit": "iter/sec",
            "range": "stddev: 0.03441282181982888",
            "extra": "mean: 1.8929357323333231 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.1832095027417218,
            "unit": "iter/sec",
            "range": "stddev: 0.004919939078872119",
            "extra": "mean: 845.1588646666627 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.1537315621211917,
            "unit": "iter/sec",
            "range": "stddev: 0.01512398856616037",
            "extra": "mean: 866.7527463333423 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 27.45836659251564,
            "unit": "iter/sec",
            "range": "stddev: 0.0007138521690553229",
            "extra": "mean: 36.41877227586331 msec\nrounds: 29"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 0.9711635957678979,
            "unit": "iter/sec",
            "range": "stddev: 0.014302362105429577",
            "extra": "mean: 1.0296926330000058 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 113.66052785562832,
            "unit": "iter/sec",
            "range": "stddev: 0.00017091262680458334",
            "extra": "mean: 8.798129120693517 msec\nrounds: 116"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 10.99539147774702,
            "unit": "iter/sec",
            "range": "stddev: 0.0015826946929203927",
            "extra": "mean: 90.94719383332972 msec\nrounds: 12"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 0.9290034275519656,
            "unit": "iter/sec",
            "range": "stddev: 0.013711443844562628",
            "extra": "mean: 1.0764222933333183 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 15.161069496711498,
            "unit": "iter/sec",
            "range": "stddev: 0.00220866897633801",
            "extra": "mean: 65.95840750000548 msec\nrounds: 16"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 361.3958336746946,
            "unit": "iter/sec",
            "range": "stddev: 0.0006856912002360239",
            "extra": "mean: 2.7670490548602618 msec\nrounds: 401"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 22.31006615692698,
            "unit": "iter/sec",
            "range": "stddev: 0.0006962350137517637",
            "extra": "mean: 44.82281643479184 msec\nrounds: 23"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 160.67428889728873,
            "unit": "iter/sec",
            "range": "stddev: 0.0009217481562150444",
            "extra": "mean: 6.223771126438601 msec\nrounds: 174"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 250.64503404963622,
            "unit": "iter/sec",
            "range": "stddev: 0.00015865232276987456",
            "extra": "mean: 3.989706015088917 msec\nrounds: 265"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 264.002153761682,
            "unit": "iter/sec",
            "range": "stddev: 0.0008795265281243632",
            "extra": "mean: 3.787847885902902 msec\nrounds: 298"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 58.39080672160807,
            "unit": "iter/sec",
            "range": "stddev: 0.0009613788738835909",
            "extra": "mean: 17.125983629028035 msec\nrounds: 62"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 903.7148964818582,
            "unit": "iter/sec",
            "range": "stddev: 0.00004209549414768584",
            "extra": "mean: 1.1065436720064894 msec\nrounds: 936"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 23.497983096196396,
            "unit": "iter/sec",
            "range": "stddev: 0.0011039587666490042",
            "extra": "mean: 42.55684396001925 msec\nrounds: 25"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 1927.7215832000174,
            "unit": "iter/sec",
            "range": "stddev: 0.00001870378921857396",
            "extra": "mean: 518.7471099120031 usec\nrounds: 2038"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 69.00402380002521,
            "unit": "iter/sec",
            "range": "stddev: 0.0005661785281809262",
            "extra": "mean: 14.491908513886328 msec\nrounds: 72"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 91144.91344929373,
            "unit": "iter/sec",
            "range": "stddev: 9.909521161250823e-7",
            "extra": "mean: 10.971539301052998 usec\nrounds: 92937"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
            "value": 25594.728149492727,
            "unit": "iter/sec",
            "range": "stddev: 0.0000021961018927601114",
            "extra": "mean: 39.07054586238375 usec\nrounds: 26122"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
            "value": 6375.402521945366,
            "unit": "iter/sec",
            "range": "stddev: 0.000004968677239985104",
            "extra": "mean: 156.8528413002641 usec\nrounds: 6547"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 25.171150280761506,
            "unit": "iter/sec",
            "range": "stddev: 0.0008881346293589075",
            "extra": "mean: 39.728021518520244 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 25.116116491654246,
            "unit": "iter/sec",
            "range": "stddev: 0.0005765583868698449",
            "extra": "mean: 39.81507253847492 msec\nrounds: 26"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 25.14353999719834,
            "unit": "iter/sec",
            "range": "stddev: 0.0006620888469570864",
            "extra": "mean: 39.7716471153794 msec\nrounds: 26"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 3160.4391446579007,
            "unit": "iter/sec",
            "range": "stddev: 0.000019698451187218056",
            "extra": "mean: 316.41172451945573 usec\nrounds: 4160"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 2895.090974266528,
            "unit": "iter/sec",
            "range": "stddev: 0.000027619436132186705",
            "extra": "mean: 345.4122889016813 usec\nrounds: 3586"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 2100.4328291332395,
            "unit": "iter/sec",
            "range": "stddev: 0.000016633920478767726",
            "extra": "mean: 476.092349219593 usec\nrounds: 2497"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 98.1527274691467,
            "unit": "iter/sec",
            "range": "stddev: 0.0006398987620387736",
            "extra": "mean: 10.188203891882065 msec\nrounds: 111"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 95.46685854514425,
            "unit": "iter/sec",
            "range": "stddev: 0.0014077708897467917",
            "extra": "mean: 10.474839281813399 msec\nrounds: 110"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 94.56309568129329,
            "unit": "iter/sec",
            "range": "stddev: 0.0006611468539193269",
            "extra": "mean: 10.574949908263445 msec\nrounds: 109"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 25.404619943678366,
            "unit": "iter/sec",
            "range": "stddev: 0.0008390754572220532",
            "extra": "mean: 39.36291911538074 msec\nrounds: 26"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 25.18567641063614,
            "unit": "iter/sec",
            "range": "stddev: 0.0008472694499704552",
            "extra": "mean: 39.7051079230769 msec\nrounds: 26"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 7796.359112523969,
            "unit": "iter/sec",
            "range": "stddev: 0.000015524118615207147",
            "extra": "mean: 128.264999798895 usec\nrounds: 9959"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 1035829.5424312558,
            "unit": "iter/sec",
            "range": "stddev: 1.0649087714781415e-7",
            "extra": "mean: 965.4098083096198 nsec\nrounds: 108969"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3336247.540096763,
            "unit": "iter/sec",
            "range": "stddev: 4.342545489053371e-8",
            "extra": "mean: 299.73795049122657 nsec\nrounds: 193837"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1637083.232988021,
            "unit": "iter/sec",
            "range": "stddev: 7.259051843290189e-8",
            "extra": "mean: 610.8424909922202 nsec\nrounds: 169177"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 161000.22897773332,
            "unit": "iter/sec",
            "range": "stddev: 9.140954857004975e-7",
            "extra": "mean: 6.2111712905594825 usec\nrounds: 174826"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 1121.1205886557132,
            "unit": "iter/sec",
            "range": "stddev: 0.00003120647068834222",
            "extra": "mean: 891.9647093441183 usec\nrounds: 1359"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 115.15941420595124,
            "unit": "iter/sec",
            "range": "stddev: 0.00013879551855259896",
            "extra": "mean: 8.683614855938732 msec\nrounds: 118"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 18.120024943302628,
            "unit": "iter/sec",
            "range": "stddev: 0.0002598896262274077",
            "extra": "mean: 55.187561999996674 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 114.69413699861174,
            "unit": "iter/sec",
            "range": "stddev: 0.00010729724203050046",
            "extra": "mean: 8.71884148718172 msec\nrounds: 117"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 104.13764529325553,
            "unit": "iter/sec",
            "range": "stddev: 0.00014668328505949122",
            "extra": "mean: 9.602675355141383 msec\nrounds: 107"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 113.14831233521022,
            "unit": "iter/sec",
            "range": "stddev: 0.00012281681500272458",
            "extra": "mean: 8.837957715510827 msec\nrounds: 116"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 151.15971247706594,
            "unit": "iter/sec",
            "range": "stddev: 0.00018332305322287605",
            "extra": "mean: 6.6155193312617655 msec\nrounds: 160"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 1149.4588447726944,
            "unit": "iter/sec",
            "range": "stddev: 0.00004375186043552382",
            "extra": "mean: 869.9746011330664 usec\nrounds: 1414"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 114.44303270677148,
            "unit": "iter/sec",
            "range": "stddev: 0.00016188206710019893",
            "extra": "mean: 8.737971865550108 msec\nrounds: 119"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 112.88862889983167,
            "unit": "iter/sec",
            "range": "stddev: 0.00024234258377417485",
            "extra": "mean: 8.858288117639553 msec\nrounds: 119"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 27525.362898026062,
            "unit": "iter/sec",
            "range": "stddev: 0.0000025804968705842676",
            "extra": "mean: 36.330129550143496 usec\nrounds: 28406"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 42.88680894477925,
            "unit": "iter/sec",
            "range": "stddev: 0.021538143374114967",
            "extra": "mean: 23.317192969231936 msec\nrounds: 65"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 2.968156172125193,
            "unit": "iter/sec",
            "range": "stddev: 0.006763889333353943",
            "extra": "mean: 336.9094960000041 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.1478867580220735,
            "unit": "iter/sec",
            "range": "stddev: 0.005239356592106271",
            "extra": "mean: 871.1660736666241 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.11260020362213956,
            "unit": "iter/sec",
            "range": "stddev: 0.05348578474349036",
            "extra": "mean: 8.880978611333338 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.1807363655416545,
            "unit": "iter/sec",
            "range": "stddev: 0.005599181945632432",
            "extra": "mean: 846.9291106666788 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 2.7092438644777626,
            "unit": "iter/sec",
            "range": "stddev: 0.013478718788008763",
            "extra": "mean: 369.10667699999067 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 0.9523642869129715,
            "unit": "iter/sec",
            "range": "stddev: 0.014124602516983303",
            "extra": "mean: 1.0500183739999709 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 2.2043973817162943,
            "unit": "iter/sec",
            "range": "stddev: 0.006869120167302602",
            "extra": "mean: 453.6387170000277 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 2.8846804147427494,
            "unit": "iter/sec",
            "range": "stddev: 0.012092842296789008",
            "extra": "mean: 346.65885166665095 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.1879661481157688,
            "unit": "iter/sec",
            "range": "stddev: 0.0003105662139865093",
            "extra": "mean: 841.774828000022 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.182275688904516,
            "unit": "iter/sec",
            "range": "stddev: 0.007039469704122392",
            "extra": "mean: 845.8264086666532 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 11318.936408953341,
            "unit": "iter/sec",
            "range": "stddev: 0.0000037074921596537728",
            "extra": "mean: 88.34752346598523 usec\nrounds: 11506"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 284.93353458962304,
            "unit": "iter/sec",
            "range": "stddev: 0.000035943389868619144",
            "extra": "mean: 3.509590408304361 msec\nrounds: 289"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 23.81613488067608,
            "unit": "iter/sec",
            "range": "stddev: 0.001960687906365865",
            "extra": "mean: 41.98834130769805 msec\nrounds: 26"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 15.372530845959526,
            "unit": "iter/sec",
            "range": "stddev: 0.0017938661604767273",
            "extra": "mean: 65.05109731250514 msec\nrounds: 16"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.183965124272736,
            "unit": "iter/sec",
            "range": "stddev: 0.0017940961849490452",
            "extra": "mean: 192.90253233335383 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 15.155939875481721,
            "unit": "iter/sec",
            "range": "stddev: 0.0020626383189838054",
            "extra": "mean: 65.98073152940742 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 19.768624237642314,
            "unit": "iter/sec",
            "range": "stddev: 0.0019222691993161112",
            "extra": "mean: 50.58520957143065 msec\nrounds: 21"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 15.788538083793872,
            "unit": "iter/sec",
            "range": "stddev: 0.0019289222620929515",
            "extra": "mean: 63.33708635294416 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 15.005304572110315,
            "unit": "iter/sec",
            "range": "stddev: 0.0020293492466587834",
            "extra": "mean: 66.64309912500244 msec\nrounds: 16"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 22.710169468365855,
            "unit": "iter/sec",
            "range": "stddev: 0.002012379865067654",
            "extra": "mean: 44.033136846158314 msec\nrounds: 26"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 15.289438505390848,
            "unit": "iter/sec",
            "range": "stddev: 0.0017517265060300903",
            "extra": "mean: 65.404625529408 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 14.858294545841384,
            "unit": "iter/sec",
            "range": "stddev: 0.0024095243908598325",
            "extra": "mean: 67.30247518749621 msec\nrounds: 16"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 21839.045267192567,
            "unit": "iter/sec",
            "range": "stddev: 0.000002625093894207338",
            "extra": "mean: 45.789547471758645 usec\nrounds: 22350"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 41.75502774448868,
            "unit": "iter/sec",
            "range": "stddev: 0.01875718930762747",
            "extra": "mean: 23.949211724137623 msec\nrounds: 58"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 171.84710921099068,
            "unit": "iter/sec",
            "range": "stddev: 0.000027050662571050895",
            "extra": "mean: 5.819126109198722 msec\nrounds: 174"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 13.886163857807045,
            "unit": "iter/sec",
            "range": "stddev: 0.0006235278996638065",
            "extra": "mean: 72.0141293333351 msec\nrounds: 15"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
            "value": 1.0480144263657334,
            "unit": "iter/sec",
            "range": "stddev: 0.005884121042792527",
            "extra": "mean: 954.1853383333319 msec\nrounds: 3"
          }
        ]
      }
    ]
  }
}