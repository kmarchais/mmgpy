window.BENCHMARK_DATA = {
  "lastUpdate": 1772979828259,
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
          "id": "9036c717048e026034ebb62f1e6a130c0543a523",
          "message": "fix(bindings): release GIL during remeshing, detect mesh corruption, fix stderr capture (#177)\n\n* fix(bindings): release GIL during remeshing, detect mesh corruption, fix stderr capture\n\n- Release Python GIL during MMG library calls (mmg3dlib, mmg2dlib,\n  mmgslib, and all level-set/lagrangian variants) to allow other\n  Python threads to run during long remeshing operations\n\n- Add corrupted_ flag to MmgMesh, MmgMesh2D, and MmgMeshS that is\n  set when a bulk setter (set_vertices, set_tetrahedra, etc.) fails\n  partway through, leaving the mesh in an inconsistent state. Remesh\n  methods check this flag and raise a clear error instead of operating\n  on partially-constructed mesh data\n\n- Fix StderrCapture::get() which was const and returned empty string\n  when called while still capturing. Now stops capture before returning.\n  Add capture_failed() method and track failures in dup/pipe/dup2 calls\n  instead of silently ignoring them\n\n* fix(bindings): replace pipe with temp file, expose is_corrupted, add save guards\n\n- Replace pipe-based StderrCapture with temp file to eliminate ~64KB\n  buffer deadlock when GIL is released during long remeshing operations\n- Remove dead capture_failed_ field and method (set but never checked)\n- Add read-only is_corrupted property to all mesh classes (Python API)\n- Add corruption check to save() methods matching existing remesh() guards\n- Add GIL release threading test verifying main thread isn't blocked\n\n* refactor(bindings): deduplicate corruption checks, add corruption tests, harden GIL test\n\n- Extract check_not_corrupted() helper in all mesh classes to replace\n  12 duplicated inline corruption guards\n- Add corruption_test.py with 12 tests covering all mesh types (3D,\n  2D, Surface): flag detection, remesh/save blocking\n- Use dense_3d_mesh with finer hmax in GIL release test to avoid\n  timing-dependent failures on fast machines\n\n* fix(build): pin VTK to 9.5.x to prevent macOS import segfault\n\nThe macOS wheel bundles VTK 9.5 C libraries (delocate is skipped).\nWhen pip resolves vtk>=9.6.0 at runtime via pyvista, both VTK 9.5\nand 9.6 are loaded in the same process, causing symbol conflicts\nand SIGSEGV on import.\n\nPin vtk to the 9.5 series to match the build-time VTK version.\n\n* chore: update uv.lock after VTK pin",
          "timestamp": "2026-03-08T15:13:50+01:00",
          "tree_id": "0c0a6649fccdcc437fae5304c5584639d71af756",
          "url": "https://github.com/kmarchais/mmgpy/commit/9036c717048e026034ebb62f1e6a130c0543a523"
        },
        "date": 1772979827279,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 1.152228173330069,
            "unit": "iter/sec",
            "range": "stddev: 0.00840052250445643",
            "extra": "mean: 867.8836563333524 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.5610173251799527,
            "unit": "iter/sec",
            "range": "stddev: 0.0071278673608250005",
            "extra": "mean: 1.7824761466666625 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.1830730255744943,
            "unit": "iter/sec",
            "range": "stddev: 0.004428507123430843",
            "extra": "mean: 845.2563606666672 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.235564578808588,
            "unit": "iter/sec",
            "range": "stddev: 0.003038546900331691",
            "extra": "mean: 809.3466073333578 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 1.1672960191791286,
            "unit": "iter/sec",
            "range": "stddev: 0.01099724129213968",
            "extra": "mean: 856.6807250000087 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.5568714472196791,
            "unit": "iter/sec",
            "range": "stddev: 0.012576346728378191",
            "extra": "mean: 1.7957465856666772 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.2360537028944305,
            "unit": "iter/sec",
            "range": "stddev: 0.005384612068510827",
            "extra": "mean: 809.0263373333452 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.2355496954623038,
            "unit": "iter/sec",
            "range": "stddev: 0.0015126420711916964",
            "extra": "mean: 809.356356666683 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 28.920155401803957,
            "unit": "iter/sec",
            "range": "stddev: 0.000983752189023153",
            "extra": "mean: 34.5779608064493 msec\nrounds: 31"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.0514542372302649,
            "unit": "iter/sec",
            "range": "stddev: 0.01514464002531724",
            "extra": "mean: 951.0637406666357 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 117.70166913985014,
            "unit": "iter/sec",
            "range": "stddev: 0.00005963960335775068",
            "extra": "mean: 8.496056235292851 msec\nrounds: 119"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 12.434222056665373,
            "unit": "iter/sec",
            "range": "stddev: 0.0009512199862053834",
            "extra": "mean: 80.42320584615499 msec\nrounds: 13"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 1.0214786663062103,
            "unit": "iter/sec",
            "range": "stddev: 0.0012523955279594699",
            "extra": "mean: 978.9729663333256 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 17.694206554321195,
            "unit": "iter/sec",
            "range": "stddev: 0.0018357234072555813",
            "extra": "mean: 56.51567347368763 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 365.0072137943853,
            "unit": "iter/sec",
            "range": "stddev: 0.00020151382264459977",
            "extra": "mean: 2.7396718810147047 msec\nrounds: 395"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 29.906762795933307,
            "unit": "iter/sec",
            "range": "stddev: 0.00017161890744049127",
            "extra": "mean: 33.43725320000127 msec\nrounds: 30"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 144.20785290160987,
            "unit": "iter/sec",
            "range": "stddev: 0.0008340584563755382",
            "extra": "mean: 6.9344351217979785 msec\nrounds: 156"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 256.3329763154985,
            "unit": "iter/sec",
            "range": "stddev: 0.00005188097331891638",
            "extra": "mean: 3.9011757846137787 msec\nrounds: 260"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 269.1147007011609,
            "unit": "iter/sec",
            "range": "stddev: 0.0002784222400157974",
            "extra": "mean: 3.7158876768699916 msec\nrounds: 294"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 74.00670265657143,
            "unit": "iter/sec",
            "range": "stddev: 0.00036044427864257713",
            "extra": "mean: 13.512289618421542 msec\nrounds: 76"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 878.8760514375018,
            "unit": "iter/sec",
            "range": "stddev: 0.000021839925500734354",
            "extra": "mean: 1.1378168723159383 msec\nrounds: 932"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 32.92195073941802,
            "unit": "iter/sec",
            "range": "stddev: 0.00034447419334643754",
            "extra": "mean: 30.37487079411375 msec\nrounds: 34"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 1985.1685377429642,
            "unit": "iter/sec",
            "range": "stddev: 0.000016821083012015353",
            "extra": "mean: 503.735567528664 usec\nrounds: 2088"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 78.99107920310674,
            "unit": "iter/sec",
            "range": "stddev: 0.0005201181219636417",
            "extra": "mean: 12.659657395346358 msec\nrounds: 86"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 91324.89132638523,
            "unit": "iter/sec",
            "range": "stddev: 0.000001057833752015419",
            "extra": "mean: 10.949917218363927 usec\nrounds: 93197"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
            "value": 26607.244838057835,
            "unit": "iter/sec",
            "range": "stddev: 0.0000021525852817882703",
            "extra": "mean: 37.58374856496393 usec\nrounds: 27176"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
            "value": 4212.416774661018,
            "unit": "iter/sec",
            "range": "stddev: 0.000005285429519444161",
            "extra": "mean: 237.39341415961195 usec\nrounds: 4322"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 34.72832624234137,
            "unit": "iter/sec",
            "range": "stddev: 0.00028714557606028426",
            "extra": "mean: 28.794937971435633 msec\nrounds: 35"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 34.35218402784062,
            "unit": "iter/sec",
            "range": "stddev: 0.00032146892147775835",
            "extra": "mean: 29.110230638889018 msec\nrounds: 36"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 33.72694366145467,
            "unit": "iter/sec",
            "range": "stddev: 0.00035893211549776365",
            "extra": "mean: 29.649884971429078 msec\nrounds: 35"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 3159.585709687752,
            "unit": "iter/sec",
            "range": "stddev: 0.000010081831579274529",
            "extra": "mean: 316.4971904176721 usec\nrounds: 3298"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 2835.066633971143,
            "unit": "iter/sec",
            "range": "stddev: 0.000010544758835759253",
            "extra": "mean: 352.72539559300486 usec\nrounds: 2950"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 2120.4557140354295,
            "unit": "iter/sec",
            "range": "stddev: 0.000012857418927728828",
            "extra": "mean: 471.5967390315851 usec\nrounds: 2188"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 134.53346329677427,
            "unit": "iter/sec",
            "range": "stddev: 0.0004490305111853544",
            "extra": "mean: 7.433094900664593 msec\nrounds: 151"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 133.54106174834334,
            "unit": "iter/sec",
            "range": "stddev: 0.00046561997043970756",
            "extra": "mean: 7.488333452706023 msec\nrounds: 148"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 132.81804240492323,
            "unit": "iter/sec",
            "range": "stddev: 0.0004283780167420314",
            "extra": "mean: 7.529097567567615 msec\nrounds: 148"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 34.15535691148651,
            "unit": "iter/sec",
            "range": "stddev: 0.0003996384756232078",
            "extra": "mean: 29.27798420000402 msec\nrounds: 35"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 34.23531028396043,
            "unit": "iter/sec",
            "range": "stddev: 0.0002570043411958396",
            "extra": "mean: 29.209608200002485 msec\nrounds: 35"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 7411.22708128327,
            "unit": "iter/sec",
            "range": "stddev: 0.000006426296403972882",
            "extra": "mean: 134.9304223217578 usec\nrounds: 7795"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 1048253.1701641829,
            "unit": "iter/sec",
            "range": "stddev: 1.0140659533109752e-7",
            "extra": "mean: 953.9680188550011 nsec\nrounds: 108614"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3371344.576211403,
            "unit": "iter/sec",
            "range": "stddev: 4.625404321333037e-8",
            "extra": "mean: 296.6175593726359 nsec\nrounds: 193799"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1642253.4368991528,
            "unit": "iter/sec",
            "range": "stddev: 7.707835377194248e-8",
            "extra": "mean: 608.9194137344393 nsec\nrounds: 169751"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 157320.025752688,
            "unit": "iter/sec",
            "range": "stddev: 9.341804423413059e-7",
            "extra": "mean: 6.356469846833303 usec\nrounds: 172088"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 1057.4440605022921,
            "unit": "iter/sec",
            "range": "stddev: 0.000020703597477694437",
            "extra": "mean: 945.6765018141898 usec\nrounds: 1102"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 117.62734459594063,
            "unit": "iter/sec",
            "range": "stddev: 0.00026540521364811994",
            "extra": "mean: 8.501424591663445 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 18.044747653952204,
            "unit": "iter/sec",
            "range": "stddev: 0.002591841776400338",
            "extra": "mean: 55.41778799998777 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 118.27107255342627,
            "unit": "iter/sec",
            "range": "stddev: 0.00008440221179093758",
            "extra": "mean: 8.455152882360755 msec\nrounds: 119"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 107.19237131771067,
            "unit": "iter/sec",
            "range": "stddev: 0.00035951860391833805",
            "extra": "mean: 9.329022090910465 msec\nrounds: 110"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 115.41699201451276,
            "unit": "iter/sec",
            "range": "stddev: 0.00010340967519070487",
            "extra": "mean: 8.664235504199054 msec\nrounds: 119"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 154.13054094156246,
            "unit": "iter/sec",
            "range": "stddev: 0.00012188195034528799",
            "extra": "mean: 6.488006814815132 msec\nrounds: 162"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 1080.270835508587,
            "unit": "iter/sec",
            "range": "stddev: 0.000019776071602612367",
            "extra": "mean: 925.693786344981 usec\nrounds: 1128"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 116.37741860978944,
            "unit": "iter/sec",
            "range": "stddev: 0.00014042146684220712",
            "extra": "mean: 8.592732266669145 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 116.22026122508686,
            "unit": "iter/sec",
            "range": "stddev: 0.00009283970849959817",
            "extra": "mean: 8.60435168067015 msec\nrounds: 119"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 26295.721814404315,
            "unit": "iter/sec",
            "range": "stddev: 0.0000025251120635397366",
            "extra": "mean: 38.02899981441918 usec\nrounds: 26905"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 47.83667041057224,
            "unit": "iter/sec",
            "range": "stddev: 0.014714921095148324",
            "extra": "mean: 20.9044649516199 msec\nrounds: 62"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 3.3107534567603176,
            "unit": "iter/sec",
            "range": "stddev: 0.0038577545733307324",
            "extra": "mean: 302.0460487500429 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.243066578621063,
            "unit": "iter/sec",
            "range": "stddev: 0.004516039112676415",
            "extra": "mean: 804.4621400000173 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.12312602140022164,
            "unit": "iter/sec",
            "range": "stddev: 0.07831440966712991",
            "extra": "mean: 8.121760035999992 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.236844298405102,
            "unit": "iter/sec",
            "range": "stddev: 0.005876430334218658",
            "extra": "mean: 808.5092046666583 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 3.0416333102465694,
            "unit": "iter/sec",
            "range": "stddev: 0.0008242384629703781",
            "extra": "mean: 328.77072874998703 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 0.9983797913361846,
            "unit": "iter/sec",
            "range": "stddev: 0.00396798812011081",
            "extra": "mean: 1.001622838000003 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 2.3224341118553387,
            "unit": "iter/sec",
            "range": "stddev: 0.0031224019180295264",
            "extra": "mean: 430.5827213333184 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 3.231933765370368,
            "unit": "iter/sec",
            "range": "stddev: 0.0004419899401981619",
            "extra": "mean: 309.41228149995936 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.2400581474343222,
            "unit": "iter/sec",
            "range": "stddev: 0.0024034792239907904",
            "extra": "mean: 806.4137976666643 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.2361261751169617,
            "unit": "iter/sec",
            "range": "stddev: 0.003072039064138308",
            "extra": "mean: 808.9789053333334 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 11433.134797530845,
            "unit": "iter/sec",
            "range": "stddev: 0.000003807714850437571",
            "extra": "mean: 87.46507565151465 usec\nrounds: 11619"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 279.3322279489561,
            "unit": "iter/sec",
            "range": "stddev: 0.00003569481269259005",
            "extra": "mean: 3.579966434029716 msec\nrounds: 288"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 27.43631369918293,
            "unit": "iter/sec",
            "range": "stddev: 0.0015888173213862169",
            "extra": "mean: 36.44804513332929 msec\nrounds: 30"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 17.00402681049791,
            "unit": "iter/sec",
            "range": "stddev: 0.0012647499000942603",
            "extra": "mean: 58.80959911111302 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.508141832767843,
            "unit": "iter/sec",
            "range": "stddev: 0.001581193679300619",
            "extra": "mean: 181.54942816668532 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 17.3380656312053,
            "unit": "iter/sec",
            "range": "stddev: 0.0009181080490673958",
            "extra": "mean: 57.67656099998754 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 21.203453715152097,
            "unit": "iter/sec",
            "range": "stddev: 0.00210984911555559",
            "extra": "mean: 47.16212808696326 msec\nrounds: 23"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 17.150397715390604,
            "unit": "iter/sec",
            "range": "stddev: 0.0015106750808880367",
            "extra": "mean: 58.30768572221561 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 16.808240233050764,
            "unit": "iter/sec",
            "range": "stddev: 0.0012850215498900347",
            "extra": "mean: 59.49462800000068 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 27.911434602737042,
            "unit": "iter/sec",
            "range": "stddev: 0.0018543959930792588",
            "extra": "mean: 35.82761023333205 msec\nrounds: 30"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 17.75448387739812,
            "unit": "iter/sec",
            "range": "stddev: 0.0007268108948791038",
            "extra": "mean: 56.32380005554675 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 17.601292716011102,
            "unit": "iter/sec",
            "range": "stddev: 0.0008230304808029207",
            "extra": "mean: 56.8140088421088 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 21740.552516588752,
            "unit": "iter/sec",
            "range": "stddev: 0.000002507029403076809",
            "extra": "mean: 45.996991071729546 usec\nrounds: 22176"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 45.297610215457226,
            "unit": "iter/sec",
            "range": "stddev: 0.01461038892806244",
            "extra": "mean: 22.076219810350235 msec\nrounds: 58"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 172.84574166805373,
            "unit": "iter/sec",
            "range": "stddev: 0.000031568909022885366",
            "extra": "mean: 5.785505563223404 msec\nrounds: 174"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.440704816415831,
            "unit": "iter/sec",
            "range": "stddev: 0.000188455516382958",
            "extra": "mean: 69.24869753332436 msec\nrounds: 15"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
            "value": 1.1512451178557699,
            "unit": "iter/sec",
            "range": "stddev: 0.01909372307292944",
            "extra": "mean: 868.62474766671 msec\nrounds: 3"
          }
        ]
      }
    ]
  }
}