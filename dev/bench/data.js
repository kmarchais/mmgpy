window.BENCHMARK_DATA = {
  "lastUpdate": 1768166103583,
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
          "id": "edafc518acc5747c0789393bccc427c1bede8422",
          "message": "build: centralize MMG version in pyproject.toml (#146)\n\n* build: centralize MMG version in pyproject.toml\n\n- Add mmg_version to [tool.mmgpy] section in pyproject.toml\n- Update CMakeLists.txt to read MMG version and pass to extern\n- Update extern/CMakeLists.txt to use version from parent with fallback\n- Add workflow to check for MMG and VTK updates weekly\n\nAddresses #113 with a more conservative approach: pin versions for\nstability and automatically create issues when updates are available.\n\n* build: add validation and label fallback to dependency check workflow\n\n- Validate parsed versions fail workflow if empty\n- Fall back to no label if \"build\" label doesn't exist",
          "timestamp": "2026-01-11T22:04:34+01:00",
          "tree_id": "3ac226ea6faee057cd1ef1ab05858393a129ef61",
          "url": "https://github.com/kmarchais/mmgpy/commit/edafc518acc5747c0789393bccc427c1bede8422"
        },
        "date": 1768166102420,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 0.5887889764936992,
            "unit": "iter/sec",
            "range": "stddev: 0.009265370083787371",
            "extra": "mean: 1.6984013626666485 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.5704283138630017,
            "unit": "iter/sec",
            "range": "stddev: 0.03308886311304222",
            "extra": "mean: 1.7530686603333077 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.0796917660100491,
            "unit": "iter/sec",
            "range": "stddev: 0.0013589461332595594",
            "extra": "mean: 926.190262333345 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.120710944236203,
            "unit": "iter/sec",
            "range": "stddev: 0.005639266022232702",
            "extra": "mean: 892.2907419999623 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 0.590220087152561,
            "unit": "iter/sec",
            "range": "stddev: 0.005431273388812471",
            "extra": "mean: 1.6942832373333279 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.6016419341437504,
            "unit": "iter/sec",
            "range": "stddev: 0.011150289435515912",
            "extra": "mean: 1.6621181856666756 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.1385233521989684,
            "unit": "iter/sec",
            "range": "stddev: 0.0029787859002379834",
            "extra": "mean: 878.3306886666651 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.1327979432956652,
            "unit": "iter/sec",
            "range": "stddev: 0.004945276686864228",
            "extra": "mean: 882.7699643333441 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 1.3350338923853282,
            "unit": "iter/sec",
            "range": "stddev: 0.003921352701998487",
            "extra": "mean: 749.044653999969 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.3347111811934689,
            "unit": "iter/sec",
            "range": "stddev: 0.004422824962506046",
            "extra": "mean: 749.2257606666802 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 118.1267914395826,
            "unit": "iter/sec",
            "range": "stddev: 0.0002356771640644239",
            "extra": "mean: 8.465480081302829 msec\nrounds: 123"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 1.1918948489958137,
            "unit": "iter/sec",
            "range": "stddev: 0.010832406954169012",
            "extra": "mean: 839.000186000059 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 1.1853324234911082,
            "unit": "iter/sec",
            "range": "stddev: 0.012903757907652094",
            "extra": "mean: 843.6451920000158 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 12.667549102613346,
            "unit": "iter/sec",
            "range": "stddev: 0.0017550397632999984",
            "extra": "mean: 78.94186885714915 msec\nrounds: 14"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 422.6395477906663,
            "unit": "iter/sec",
            "range": "stddev: 0.00005004537904917808",
            "extra": "mean: 2.366082410478304 msec\nrounds: 458"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 11.799308545269866,
            "unit": "iter/sec",
            "range": "stddev: 0.0016062219989824865",
            "extra": "mean: 84.75072892308442 msec\nrounds: 13"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 251.26414402229514,
            "unit": "iter/sec",
            "range": "stddev: 0.0000689459615097584",
            "extra": "mean: 3.9798754569265884 msec\nrounds: 267"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 231.8344384661372,
            "unit": "iter/sec",
            "range": "stddev: 0.00021105122413034956",
            "extra": "mean: 4.313423004003198 msec\nrounds: 250"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 303.73577714144756,
            "unit": "iter/sec",
            "range": "stddev: 0.00006543079549208367",
            "extra": "mean: 3.2923352310067413 msec\nrounds: 329"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 38.299318227007,
            "unit": "iter/sec",
            "range": "stddev: 0.0006026477726700889",
            "extra": "mean: 26.11012535713609 msec\nrounds: 42"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 1019.6552080868998,
            "unit": "iter/sec",
            "range": "stddev: 0.00003891694010501168",
            "extra": "mean: 980.723672148179 usec\nrounds: 1095"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 12.274404216422244,
            "unit": "iter/sec",
            "range": "stddev: 0.003040587747351235",
            "extra": "mean: 81.4703493846222 msec\nrounds: 13"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 2144.801699002286,
            "unit": "iter/sec",
            "range": "stddev: 0.000011338646081204743",
            "extra": "mean: 466.2435694941764 usec\nrounds: 2216"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 40.11741138536297,
            "unit": "iter/sec",
            "range": "stddev: 0.0006154610080574897",
            "extra": "mean: 24.92683265114296 msec\nrounds: 43"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 93168.35529657455,
            "unit": "iter/sec",
            "range": "stddev: 7.074544806158292e-7",
            "extra": "mean: 10.733258055450145 usec\nrounds: 97944"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
            "value": 27705.463048046407,
            "unit": "iter/sec",
            "range": "stddev: 0.000001934124994226771",
            "extra": "mean: 36.09396451038608 usec\nrounds: 31756"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
            "value": 5560.9299436833935,
            "unit": "iter/sec",
            "range": "stddev: 0.000011241684812008745",
            "extra": "mean: 179.8260381136235 usec\nrounds: 5851"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 12.529416733269645,
            "unit": "iter/sec",
            "range": "stddev: 0.0019373357609264769",
            "extra": "mean: 79.81217492308937 msec\nrounds: 13"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 12.704320384227316,
            "unit": "iter/sec",
            "range": "stddev: 0.0013468162422134453",
            "extra": "mean: 78.71338015385075 msec\nrounds: 13"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 12.56117571576885,
            "unit": "iter/sec",
            "range": "stddev: 0.001174671758574503",
            "extra": "mean: 79.61038223075215 msec\nrounds: 13"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 1457.040005577657,
            "unit": "iter/sec",
            "range": "stddev: 0.0000064616253627125466",
            "extra": "mean: 686.3229535029415 usec\nrounds: 1484"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 1394.296407535348,
            "unit": "iter/sec",
            "range": "stddev: 0.000007671849015950754",
            "extra": "mean: 717.2076142458598 usec\nrounds: 1418"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 1236.1795873446188,
            "unit": "iter/sec",
            "range": "stddev: 0.000006577071049372083",
            "extra": "mean: 808.9439513785005 usec\nrounds: 1234"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 49.97680072283025,
            "unit": "iter/sec",
            "range": "stddev: 0.0005558866248846018",
            "extra": "mean: 20.009284018518276 msec\nrounds: 54"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 49.26762458575209,
            "unit": "iter/sec",
            "range": "stddev: 0.0007621523255120278",
            "extra": "mean: 20.297304942304734 msec\nrounds: 52"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 51.060121957349615,
            "unit": "iter/sec",
            "range": "stddev: 0.000587387266032127",
            "extra": "mean: 19.58475541510256 msec\nrounds: 53"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 12.555550137038123,
            "unit": "iter/sec",
            "range": "stddev: 0.0018269670998855355",
            "extra": "mean: 79.64605207143093 msec\nrounds: 14"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 12.614239244549529,
            "unit": "iter/sec",
            "range": "stddev: 0.0014874572613534597",
            "extra": "mean: 79.27549023077937 msec\nrounds: 13"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 3578.933256195076,
            "unit": "iter/sec",
            "range": "stddev: 0.0000044360934379376794",
            "extra": "mean: 279.41286646489317 usec\nrounds: 3632"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 1014041.9801874382,
            "unit": "iter/sec",
            "range": "stddev: 8.413708018146387e-8",
            "extra": "mean: 986.152466602179 nsec\nrounds: 107922"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3460853.384582659,
            "unit": "iter/sec",
            "range": "stddev: 3.1249940573731116e-8",
            "extra": "mean: 288.9460745302821 nsec\nrounds: 198217"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1602850.1777659524,
            "unit": "iter/sec",
            "range": "stddev: 5.6005387041270197e-8",
            "extra": "mean: 623.8886290631336 nsec\nrounds: 165536"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 138066.20337213718,
            "unit": "iter/sec",
            "range": "stddev: 6.109284499720938e-7",
            "extra": "mean: 7.242902140972521 usec\nrounds: 140529"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 719.9369139059163,
            "unit": "iter/sec",
            "range": "stddev: 0.000011395197681367998",
            "extra": "mean: 1.3890105934069152 msec\nrounds: 728"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 112.06653947792324,
            "unit": "iter/sec",
            "range": "stddev: 0.00021321304551951138",
            "extra": "mean: 8.923270091667252 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 19.295175934337884,
            "unit": "iter/sec",
            "range": "stddev: 0.0001915745941025039",
            "extra": "mean: 51.82642560000659 msec\nrounds: 20"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 111.13759995215408,
            "unit": "iter/sec",
            "range": "stddev: 0.0002116606317391663",
            "extra": "mean: 8.997854915262797 msec\nrounds: 118"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 104.50206080167622,
            "unit": "iter/sec",
            "range": "stddev: 0.00017624485743281715",
            "extra": "mean: 9.569189280370248 msec\nrounds: 107"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 117.15217237483036,
            "unit": "iter/sec",
            "range": "stddev: 0.0002309581924548292",
            "extra": "mean: 8.535906588231954 msec\nrounds: 119"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 147.8234129953075,
            "unit": "iter/sec",
            "range": "stddev: 0.00018119740467095882",
            "extra": "mean: 6.764828248362416 msec\nrounds: 153"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 725.364206303287,
            "unit": "iter/sec",
            "range": "stddev: 0.000014050830117987144",
            "extra": "mean: 1.3786177913249322 msec\nrounds: 738"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 111.98333413956077,
            "unit": "iter/sec",
            "range": "stddev: 0.00018132979057475777",
            "extra": "mean: 8.929900218489086 msec\nrounds: 119"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 111.46982861751137,
            "unit": "iter/sec",
            "range": "stddev: 0.00014388729346488083",
            "extra": "mean: 8.971037386549861 msec\nrounds: 119"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 28557.65173307749,
            "unit": "iter/sec",
            "range": "stddev: 0.0000016697833732350243",
            "extra": "mean: 35.016884768635556 usec\nrounds: 29827"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 44.073766721135186,
            "unit": "iter/sec",
            "range": "stddev: 0.017763173742971948",
            "extra": "mean: 22.68923385485132 msec\nrounds: 62"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 1.9125695296721255,
            "unit": "iter/sec",
            "range": "stddev: 0.004810362176400422",
            "extra": "mean: 522.8568083333585 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.0793152357880063,
            "unit": "iter/sec",
            "range": "stddev: 0.02187610164137819",
            "extra": "mean: 926.5133733333263 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.10865864090308087,
            "unit": "iter/sec",
            "range": "stddev: 0.06835532145102913",
            "extra": "mean: 9.203133700999993 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.0805211044257474,
            "unit": "iter/sec",
            "range": "stddev: 0.004663857907921162",
            "extra": "mean: 925.4793783333449 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 1.8174376336460896,
            "unit": "iter/sec",
            "range": "stddev: 0.00315074618199921",
            "extra": "mean: 550.2252080000289 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 0.9323636862465846,
            "unit": "iter/sec",
            "range": "stddev: 0.007778985247535712",
            "extra": "mean: 1.0725428443333083 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 1.6337185551284779,
            "unit": "iter/sec",
            "range": "stddev: 0.005537817848556413",
            "extra": "mean: 612.100534000092 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 1.8969902560631489,
            "unit": "iter/sec",
            "range": "stddev: 0.0033961546075233847",
            "extra": "mean: 527.1508363334002 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.0874266075935595,
            "unit": "iter/sec",
            "range": "stddev: 0.0014040447516170274",
            "extra": "mean: 919.6022913334522 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.0816211518670993,
            "unit": "iter/sec",
            "range": "stddev: 0.005022709482866856",
            "extra": "mean: 924.5381326666878 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 12805.68020837961,
            "unit": "iter/sec",
            "range": "stddev: 0.000004046734633948719",
            "extra": "mean: 78.09034613761739 usec\nrounds: 13252"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 296.69183085016437,
            "unit": "iter/sec",
            "range": "stddev: 0.00008018142231843466",
            "extra": "mean: 3.3705006205749597 msec\nrounds: 311"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 15.591011022771129,
            "unit": "iter/sec",
            "range": "stddev: 0.0017755317703623446",
            "extra": "mean: 64.1395223529424 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 12.181534386653537,
            "unit": "iter/sec",
            "range": "stddev: 0.0019715267478738045",
            "extra": "mean: 82.09146469229941 msec\nrounds: 13"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.253367939440759,
            "unit": "iter/sec",
            "range": "stddev: 0.0019055055897232687",
            "extra": "mean: 190.3540759999487 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 12.441064357399835,
            "unit": "iter/sec",
            "range": "stddev: 0.001466007886647565",
            "extra": "mean: 80.3789749230908 msec\nrounds: 13"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 16.242023401314622,
            "unit": "iter/sec",
            "range": "stddev: 0.0027856461383002633",
            "extra": "mean: 61.568683611123255 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 12.296210784177932,
            "unit": "iter/sec",
            "range": "stddev: 0.001737183159750918",
            "extra": "mean: 81.32586676919556 msec\nrounds: 13"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 11.580991940743449,
            "unit": "iter/sec",
            "range": "stddev: 0.0012983771121804115",
            "extra": "mean: 86.34838924996302 msec\nrounds: 12"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 15.934386127165045,
            "unit": "iter/sec",
            "range": "stddev: 0.0018135913483506671",
            "extra": "mean: 62.75735958821743 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 12.140788120420542,
            "unit": "iter/sec",
            "range": "stddev: 0.0018952844081164696",
            "extra": "mean: 82.36697569229644 msec\nrounds: 13"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 12.26756102445742,
            "unit": "iter/sec",
            "range": "stddev: 0.0018240115863431164",
            "extra": "mean: 81.51579584616158 msec\nrounds: 13"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 24289.84209491646,
            "unit": "iter/sec",
            "range": "stddev: 0.000001850599465116856",
            "extra": "mean: 41.16947306994995 usec\nrounds: 24842"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 43.827912299384245,
            "unit": "iter/sec",
            "range": "stddev: 0.0165655675994706",
            "extra": "mean: 22.81651001692931 msec\nrounds: 59"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 184.41248864006016,
            "unit": "iter/sec",
            "range": "stddev: 0.00003084160019756133",
            "extra": "mean: 5.422626240632863 msec\nrounds: 187"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.737060410238664,
            "unit": "iter/sec",
            "range": "stddev: 0.0002502928933306667",
            "extra": "mean: 67.85613766672517 msec\nrounds: 15"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
            "value": 1.1231211938707129,
            "unit": "iter/sec",
            "range": "stddev: 0.003538062965564674",
            "extra": "mean: 890.3758610000144 msec\nrounds: 3"
          }
        ]
      }
    ]
  }
}