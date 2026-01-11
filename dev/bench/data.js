window.BENCHMARK_DATA = {
  "lastUpdate": 1768153790993,
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
          "id": "75d9958492377261cf0b055297aec96e6fca6116",
          "message": "refactor: replace monkey-patching with Mesh wrapper class (#110) (#142)\n\n* refactor: reduce type: ignore comments by 94% (#110)\n\nRemove 65 of 69 type: ignore comments from __init__.py and 8 from\n_pyvista.py by introducing a type-safe extension pattern.\n\nChanges:\n- Add _extensions.py with add_method() and replace_method() helpers\n  that use setattr() to avoid attr-defined and method-assign errors\n- Replace direct attribute assignment with helper function calls\n- Use typing.cast() for proper type narrowing where needed\n- Use Callable[..., Any] for original C++ method references to handle\n  the stub/runtime type mismatch\n- Keep only 4 unavoidable ignores:\n  - 2 for dynamically generated modules (_version and _mmgpy)\n  - 2 for union type narrowing in remesh_optimize/remesh_uniform\n\nThe stub file (_mmgpy.pyi) already declares all monkey-patched methods,\nso the helper functions satisfy the type checker while the stubs provide\nIDE autocompletion and type information.\n\n* refactor: replace monkey-patching with Mesh wrapper class\n\nAddresses issue #110 - Remove type: ignore comments by improving type safety.\n\nChanges:\n- Add unified Mesh class that wraps MmgMesh3D/2D/S with proper type safety\n- Move all extension methods (remesh, sizing, validation, pyvista) to Mesh\n- Update _mmgpy.pyi to reflect raw C++ API (dict returns, no extensions)\n- Remove _extensions.py entirely (monkey-patching no longer needed)\n- Clean up __init__.py to only expose public API\n- Update all tests to use Mesh class instead of raw MmgMesh* classes\n\nType safety improvements:\n- Reduced type: ignore comments from 69 to 9 (87% reduction)\n- Added explicit type casts in Mesh methods for union handling\n- Updated stub file with @overload decorators for __init__ signatures\n- Fixed validate() dispatch with proper casting per mesh kind\n- Convert Sequence inputs to np.ndarray in sizing methods\n\nThe underlying MmgMesh* classes are now hidden from the public API.\nUsers should use the Mesh class for all operations.\n\n* fix(types): correct integer option types in _mmgpy.pyi stubs\n\n* docs: update documentation to use Mesh class instead of MmgMesh*\n\nUpdate all documentation to reflect the new unified Mesh API:\n- Remove references to MmgMesh3D, MmgMesh2D, MmgMeshS\n- Update examples to use Mesh class with auto-detection\n- Update type references to use MeshKind enum\n- Simplify API reference to focus on public Mesh interface\n\n* fix: update benchmarks and add type annotations for ty checker\n\nBenchmark updates:\n- Import raw C++ classes from mmgpy._mmgpy\n- Use Mesh wrapper for remesh_optimize, remesh_uniform, validate methods\n- Use from_pyvista function instead of class methods\n- Fix np.random.rand deprecation warnings\n\nType annotation fixes:\n- Add type: ignore[arg-type] for remesh calls with union types\n- Update **kwargs type in stubs to float | int | None\n\n* docs: remove references to internal validate_mesh_* functions\n\n* fix(benchmarks): fix from_pyvista and field IO tests\n\n- Use Mesh constructor directly instead of from_pyvista with string type\n- Fix field tests to use Mesh wrapper with proper __setitem__/__getitem__\n- Remove scalar field tests (not supported by raw C++ classes)\n- Fix metric field tests to use isotropic format\n\n* fix(benchmarks): remove field IO tests\n\nField storage API has changed with the Mesh wrapper refactor.\nThese benchmarks were testing internal implementation details.",
          "timestamp": "2026-01-11T18:39:45+01:00",
          "tree_id": "69c50714f5d2c6d88b73cb3b2c0fa5ff61773a98",
          "url": "https://github.com/kmarchais/mmgpy/commit/75d9958492377261cf0b055297aec96e6fca6116"
        },
        "date": 1768153789892,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 0.6339148820706536,
            "unit": "iter/sec",
            "range": "stddev: 0.012829979429034202",
            "extra": "mean: 1.5774988539999981 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.6298735908769062,
            "unit": "iter/sec",
            "range": "stddev: 0.020201022894497683",
            "extra": "mean: 1.587620142333331 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.1899337629479145,
            "unit": "iter/sec",
            "range": "stddev: 0.0003525969467942023",
            "extra": "mean: 840.3829113333359 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.2598139808312694,
            "unit": "iter/sec",
            "range": "stddev: 0.0009539008470364493",
            "extra": "mean: 793.7679809999926 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 0.6352942362004382,
            "unit": "iter/sec",
            "range": "stddev: 0.005345414895894682",
            "extra": "mean: 1.5740737803333313 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.6314945445994635,
            "unit": "iter/sec",
            "range": "stddev: 0.008099999100106102",
            "extra": "mean: 1.5835449546666591 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.2574213858955383,
            "unit": "iter/sec",
            "range": "stddev: 0.0005045519681246179",
            "extra": "mean: 795.278345999975 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.254735694560095,
            "unit": "iter/sec",
            "range": "stddev: 0.0028911243571867044",
            "extra": "mean: 796.9805946666687 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 1.3179742773315382,
            "unit": "iter/sec",
            "range": "stddev: 0.0068684065612860615",
            "extra": "mean: 758.7401493333156 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.3216214028825453,
            "unit": "iter/sec",
            "range": "stddev: 0.005522383801930673",
            "extra": "mean: 756.6463420000105 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 120.35804461240198,
            "unit": "iter/sec",
            "range": "stddev: 0.00004061336959191335",
            "extra": "mean: 8.308543090911579 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 1.2438928618078524,
            "unit": "iter/sec",
            "range": "stddev: 0.009482091232866434",
            "extra": "mean: 803.927758333316 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 1.2372081002657103,
            "unit": "iter/sec",
            "range": "stddev: 0.0027552271200240682",
            "extra": "mean: 808.2714619999933 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 17.377294208569843,
            "unit": "iter/sec",
            "range": "stddev: 0.0006447750864779249",
            "extra": "mean: 57.5463583684298 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 362.7259903187582,
            "unit": "iter/sec",
            "range": "stddev: 0.00014822240820092038",
            "extra": "mean: 2.7569019774988135 msec\nrounds: 400"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 24.127425783568015,
            "unit": "iter/sec",
            "range": "stddev: 0.00014942455949501886",
            "extra": "mean: 41.44660972000793 msec\nrounds: 25"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 163.65257387868652,
            "unit": "iter/sec",
            "range": "stddev: 0.00017637090292095653",
            "extra": "mean: 6.110505788569429 msec\nrounds: 175"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 257.757263586517,
            "unit": "iter/sec",
            "range": "stddev: 0.00002508224079593758",
            "extra": "mean: 3.8796190884620674 msec\nrounds: 260"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 265.762097626921,
            "unit": "iter/sec",
            "range": "stddev: 0.0003457936965185882",
            "extra": "mean: 3.7627637986354556 msec\nrounds: 293"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 64.35289705409602,
            "unit": "iter/sec",
            "range": "stddev: 0.0008547362659783447",
            "extra": "mean: 15.539315955882838 msec\nrounds: 68"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 891.0565845806661,
            "unit": "iter/sec",
            "range": "stddev: 0.00005886138862519162",
            "extra": "mean: 1.1222631842966548 msec\nrounds: 917"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 26.051521720135405,
            "unit": "iter/sec",
            "range": "stddev: 0.00036106599667116095",
            "extra": "mean: 38.385473629630354 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 1977.4429177364154,
            "unit": "iter/sec",
            "range": "stddev: 0.000024675802655922454",
            "extra": "mean: 505.70359884001243 usec\nrounds: 2069"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 72.68901759309412,
            "unit": "iter/sec",
            "range": "stddev: 0.0005215102291575207",
            "extra": "mean: 13.757236417719941 msec\nrounds: 79"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 90994.26404122323,
            "unit": "iter/sec",
            "range": "stddev: 9.454441433124275e-7",
            "extra": "mean: 10.989703697663503 usec\nrounds: 92679"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
            "value": 27476.838119348875,
            "unit": "iter/sec",
            "range": "stddev: 0.000002103719507160156",
            "extra": "mean: 36.3942894614141 usec\nrounds: 27983"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
            "value": 6394.504921477929,
            "unit": "iter/sec",
            "range": "stddev: 0.000004468858874710343",
            "extra": "mean: 156.38427247763772 usec\nrounds: 6540"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 27.153034694573943,
            "unit": "iter/sec",
            "range": "stddev: 0.0007139875549922794",
            "extra": "mean: 36.82829603572202 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 27.141295838432267,
            "unit": "iter/sec",
            "range": "stddev: 0.0003014275753907588",
            "extra": "mean: 36.8442246071388 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 26.700794184563705,
            "unit": "iter/sec",
            "range": "stddev: 0.00020287445324290024",
            "extra": "mean: 37.45206951852095 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 3095.359824781687,
            "unit": "iter/sec",
            "range": "stddev: 0.00001164036157886527",
            "extra": "mean: 323.06421760530833 usec\nrounds: 3249"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 2794.651970964423,
            "unit": "iter/sec",
            "range": "stddev: 0.000010480752884645388",
            "extra": "mean: 357.82630910385024 usec\nrounds: 2889"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 2060.1947230101323,
            "unit": "iter/sec",
            "range": "stddev: 0.000012085839855551463",
            "extra": "mean: 485.3910112627164 usec\nrounds: 2131"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 114.21789275451735,
            "unit": "iter/sec",
            "range": "stddev: 0.0006070821901606362",
            "extra": "mean: 8.755195669291925 msec\nrounds: 127"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 119.89990879259427,
            "unit": "iter/sec",
            "range": "stddev: 0.0004272992005297744",
            "extra": "mean: 8.340289914063437 msec\nrounds: 128"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 116.13051744426339,
            "unit": "iter/sec",
            "range": "stddev: 0.00047604515567909974",
            "extra": "mean: 8.611000984129328 msec\nrounds: 126"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 27.154920701135158,
            "unit": "iter/sec",
            "range": "stddev: 0.00017442034185683215",
            "extra": "mean: 36.82573817857612 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 27.087031390296172,
            "unit": "iter/sec",
            "range": "stddev: 0.00018673420922094434",
            "extra": "mean: 36.918035999996896 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 7107.120296749457,
            "unit": "iter/sec",
            "range": "stddev: 0.000006025701622325016",
            "extra": "mean: 140.70396422829148 usec\nrounds: 7520"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 1053458.7107322796,
            "unit": "iter/sec",
            "range": "stddev: 1.1239554713058323e-7",
            "extra": "mean: 949.2540996740922 nsec\nrounds: 108496"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3506576.4380502636,
            "unit": "iter/sec",
            "range": "stddev: 3.910352730887728e-8",
            "extra": "mean: 285.1784404722752 nsec\nrounds: 190115"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1644283.2537342866,
            "unit": "iter/sec",
            "range": "stddev: 6.858666201241913e-8",
            "extra": "mean: 608.1677215461068 nsec\nrounds: 169751"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 152582.98878482034,
            "unit": "iter/sec",
            "range": "stddev: 8.500544471854453e-7",
            "extra": "mean: 6.553810539196127 usec\nrounds: 157679"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 1157.5736982271735,
            "unit": "iter/sec",
            "range": "stddev: 0.000026322234868105707",
            "extra": "mean: 863.8758824008372 usec\nrounds: 1199"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 119.74810162327164,
            "unit": "iter/sec",
            "range": "stddev: 0.000054988696001633676",
            "extra": "mean: 8.350863073771366 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 18.166764904882427,
            "unit": "iter/sec",
            "range": "stddev: 0.00020508232922719676",
            "extra": "mean: 55.045573894735874 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 120.3336932076555,
            "unit": "iter/sec",
            "range": "stddev: 0.00005526429863399807",
            "extra": "mean: 8.310224454545214 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 109.33968456321848,
            "unit": "iter/sec",
            "range": "stddev: 0.00008858233993721359",
            "extra": "mean: 9.14581017857076 msec\nrounds: 112"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 119.8977857224695,
            "unit": "iter/sec",
            "range": "stddev: 0.000058019042599643026",
            "extra": "mean: 8.340437598361707 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 161.02038161419267,
            "unit": "iter/sec",
            "range": "stddev: 0.0000736912376089977",
            "extra": "mean: 6.210393926378932 msec\nrounds: 163"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 1208.9881741626677,
            "unit": "iter/sec",
            "range": "stddev: 0.00001716694526611044",
            "extra": "mean: 827.137950040404 usec\nrounds: 1241"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 119.2362686728644,
            "unit": "iter/sec",
            "range": "stddev: 0.0003819779345745394",
            "extra": "mean: 8.386709942623176 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 120.71661889089499,
            "unit": "iter/sec",
            "range": "stddev: 0.000037717723786000154",
            "extra": "mean: 8.283863557376563 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 28179.700273475333,
            "unit": "iter/sec",
            "range": "stddev: 0.0000034054963454246032",
            "extra": "mean: 35.48653783735481 usec\nrounds: 29323"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 48.087186668046144,
            "unit": "iter/sec",
            "range": "stddev: 0.01425670283289641",
            "extra": "mean: 20.7955605076913 msec\nrounds: 65"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 3.3053015064551245,
            "unit": "iter/sec",
            "range": "stddev: 0.0030923909477121128",
            "extra": "mean: 302.5442604999995 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.2042355232131363,
            "unit": "iter/sec",
            "range": "stddev: 0.030813547896836182",
            "extra": "mean: 830.402342999984 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.1227995943371068,
            "unit": "iter/sec",
            "range": "stddev: 0.2129409506194421",
            "extra": "mean: 8.143349376666682 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.2385518715277581,
            "unit": "iter/sec",
            "range": "stddev: 0.005934121153169788",
            "extra": "mean: 807.3945249999875 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 2.9714891845440965,
            "unit": "iter/sec",
            "range": "stddev: 0.0011000956751542536",
            "extra": "mean: 336.53159675000666 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 0.9966192495779849,
            "unit": "iter/sec",
            "range": "stddev: 0.0086558857018418",
            "extra": "mean: 1.0033922186667041 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 2.38533500997392,
            "unit": "iter/sec",
            "range": "stddev: 0.0037808499079487637",
            "extra": "mean: 419.2283246666193 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 3.247557681552438,
            "unit": "iter/sec",
            "range": "stddev: 0.0027725550845098326",
            "extra": "mean: 307.9237070000147 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.2470911899375152,
            "unit": "iter/sec",
            "range": "stddev: 0.008576509123091736",
            "extra": "mean: 801.8659806666619 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.2379206600787422,
            "unit": "iter/sec",
            "range": "stddev: 0.002723578456771054",
            "extra": "mean: 807.8062126666433 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 11194.619601263497,
            "unit": "iter/sec",
            "range": "stddev: 0.000005516600326917524",
            "extra": "mean: 89.32862711003897 usec\nrounds: 11435"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 286.04445142665656,
            "unit": "iter/sec",
            "range": "stddev: 0.000030172790317421402",
            "extra": "mean: 3.49596013840669 msec\nrounds: 289"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 25.99395951113855,
            "unit": "iter/sec",
            "range": "stddev: 0.001777187854043614",
            "extra": "mean: 38.470476172415935 msec\nrounds: 29"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 17.038100991423555,
            "unit": "iter/sec",
            "range": "stddev: 0.0014393406768758242",
            "extra": "mean: 58.69198688887738 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.526224362453841,
            "unit": "iter/sec",
            "range": "stddev: 0.00112168837194551",
            "extra": "mean: 180.95537466668551 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 16.897928889477466,
            "unit": "iter/sec",
            "range": "stddev: 0.0018625528549803118",
            "extra": "mean: 59.17885005556577 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 21.26567238910647,
            "unit": "iter/sec",
            "range": "stddev: 0.0017555513189122366",
            "extra": "mean: 47.02414208695601 msec\nrounds: 23"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 17.196804977706005,
            "unit": "iter/sec",
            "range": "stddev: 0.0012649165305028119",
            "extra": "mean: 58.150336722222725 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 17.188381602832827,
            "unit": "iter/sec",
            "range": "stddev: 0.0010556396107472843",
            "extra": "mean: 58.17883400000786 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 26.901929612819895,
            "unit": "iter/sec",
            "range": "stddev: 0.0016470778421078258",
            "extra": "mean: 37.172054733332516 msec\nrounds: 30"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 17.20155356175444,
            "unit": "iter/sec",
            "range": "stddev: 0.0013479947031673442",
            "extra": "mean: 58.134283999985804 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 16.8762512369095,
            "unit": "iter/sec",
            "range": "stddev: 0.001341727426851043",
            "extra": "mean: 59.25486566666728 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 21653.120431141746,
            "unit": "iter/sec",
            "range": "stddev: 0.0000023495221885354694",
            "extra": "mean: 46.182720092471726 usec\nrounds: 22093"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 44.83942562328999,
            "unit": "iter/sec",
            "range": "stddev: 0.015371235755931759",
            "extra": "mean: 22.30180217742556 msec\nrounds: 62"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 173.02270808436728,
            "unit": "iter/sec",
            "range": "stddev: 0.00004324251795235078",
            "extra": "mean: 5.779588188576912 msec\nrounds: 175"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.584537130901598,
            "unit": "iter/sec",
            "range": "stddev: 0.00011468839778367522",
            "extra": "mean: 68.56576873332567 msec\nrounds: 15"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
            "value": 1.1737584435179205,
            "unit": "iter/sec",
            "range": "stddev: 0.006388771807219223",
            "extra": "mean: 851.9640523333388 msec\nrounds: 3"
          }
        ]
      }
    ]
  }
}