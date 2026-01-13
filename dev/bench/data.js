window.BENCHMARK_DATA = {
  "lastUpdate": 1768337925016,
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
          "id": "db1324da919b51216e59ed77056d65b816ee268e",
          "message": "feat(ui): add web-based mesh viewer and remeshing interface (#158)\n\n* feat(ui): add web-based mesh viewer and remeshing interface\n\nAdd a trame-based web UI for interactive mesh visualization and remeshing.\n\nFeatures:\n- Load meshes from files (VTK, STL, OBJ, PLY, Medit, Gmsh) or sample shapes\n- Auto-detect mesh type (2D, surface, 3D) and select appropriate MMG module\n- Interactive 3D viewer with PyVista/VTK rendering\n- Scalar field visualization (quality metrics, refs, solution fields)\n- View controls (XY/XZ/YZ planes, isometric, parallel projection)\n- Slice view for tetrahedral meshes to see internal structure\n\nRemeshing:\n- Standard remeshing with hmin/hmax/hausd/hgrad parameters\n- Adaptive presets (fine/medium/coarse) scaled to mesh size\n- Levelset discretization mode with formula or solution file input\n- Lagrangian motion mode with displacement field\n- Optimize-only mode for quality improvement\n- Options: optim, noinsert, noswap, nomove, nosurf\n- Remesh from original or current mesh\n\nSolution files (.sol):\n- Parse Medit solution files (SolAtVertices/Triangles/Tetrahedra)\n- Auto-detect solution type (levelset vs metric) based on values\n- Visualize solution fields with appropriate colormaps\n- Use solution as metric (sizing field) for standard remeshing\n- Use solution as levelset for iso-surface extraction\n- Transfer solution fields to remeshed mesh via interpolation\n\nUsage:\n  python -m mmgpy.ui [--port PORT] [--server] [--debug]\n  mmgpy-ui  # GUI script entry point\n\nDependencies: trame, trame-vtk, trame-vuetify (in [ui] optional group)\n\n* refactor(ui): split app into modules, add safe formula evaluator, tests\n\n- Replace eval() with SafeFormulaEvaluator using AST parsing\n- Split app.py into parsers.py, utils.py, samples.py modules\n- Implement _export_mesh() for browser download functionality\n- Add logging for exception handlers instead of silent pass\n- Use numpy.random.default_rng() instead of legacy API\n- Add 50 unit tests for parsers, utils, and samples\n- Update coverage config to test new modules\n\n* feat(ui): add face orientation visualization and improvements\n\n- Add face orientation scalar field (blue/red like Blender) to identify\n  flipped/inconsistent triangles in surface meshes\n- Use deterministic random seed (42) for reproducible Lagrangian motion\n- Remove empty components module placeholder\n- Consolidate magic numbers by reusing compute_preset_values()\n- Fix memory leak in _reset_mesh by clearing plotter instead of destroying\n- Add tests for DEFAULT_SCALAR_FIELD_OPTIONS\n\n* refactor(ui): split app.py into viewer and remeshing modules\n\nExtract functionality into mixin classes for better maintainability:\n\n- viewer.py (ViewerMixin): visualization, scalars, camera, constraints\n- remeshing.py (RemeshingMixin): remesh operations, presets, validation\n\nMmgpyApp now inherits from both mixins, reducing app.py from ~2100 to\n~1400 lines while keeping the same functionality.\n\n* refactor(ui): improve code quality and add safety measures\n\n- Fix tmp_path variable scope in file upload handlers to prevent\n  potential NameError if temp file creation fails\n- Add file size limits for uploads (50 MB for mesh, 10 MB for solution)\n- Split _build_remesh_panel into 7 smaller helper methods for better\n  maintainability\n- Add named constants in samples.py to replace magic numbers\n- Reduce and reorganize ruff exceptions in pyproject.toml with clearer\n  grouping and comments\n\n* chore(coverage): exclude UI mixin files from coverage\n\nThe viewer.py and remeshing.py files contain trame UI mixins that\nrequire a running browser to test. These are similar to app.py which\nwas already excluded.\n\n* test(ui): add tests for edge cases and improve coverage\n\n- Add tests for sol file parsing edge cases:\n  - Dimension on separate line\n  - Empty lines in data\n  - Truncated input\n  - Tensor fields (type 3) in 2D and 3D\n  - Data ending with Mesh keyword\n- Add test for get_mesh_diagonal with real mesh\n- Exclude UI __init__.py from coverage (requires trame server)\n\nCoverage improved:\n- parsers.py: 74% → 82%\n- utils.py: 94% → 100%\n\n* test(ui): add comprehensive tests for SafeFormulaEvaluator\n\nAdd tests for all error handling branches in SafeFormulaEvaluator:\n- Unsupported constant types (strings)\n- Unsupported binary operators (matrix multiplication)\n- Unsupported unary operators (bitwise not)\n- Complex/chained comparisons\n- Unsupported comparison operators (is)\n- Ternary expressions (if-else)\n- Unsupported expression types (lists)\n- Non-np attribute calls\n- Direct numpy function calls (sin instead of np.sin)\n- Invalid function calls (lambda)\n- Unsupported numpy attributes\n- Non-np attribute access\n- Single entity scalar parsing (data.ndim == 1)\n\nCoverage improved: parsers.py 82% → 97%",
          "timestamp": "2026-01-13T21:48:22+01:00",
          "tree_id": "edc430195ee9953a7bd1bcfb726ee1cd1f966b7b",
          "url": "https://github.com/kmarchais/mmgpy/commit/db1324da919b51216e59ed77056d65b816ee268e"
        },
        "date": 1768337923973,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 0.6314358512428844,
            "unit": "iter/sec",
            "range": "stddev: 0.01677862203623052",
            "extra": "mean: 1.5836921486666522 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.6290356860350693,
            "unit": "iter/sec",
            "range": "stddev: 0.026476763401642726",
            "extra": "mean: 1.5897349263333354 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.1758915239128533,
            "unit": "iter/sec",
            "range": "stddev: 0.008627099969164831",
            "extra": "mean: 850.4185799999959 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.2684946718718302,
            "unit": "iter/sec",
            "range": "stddev: 0.003022078181847719",
            "extra": "mean: 788.3359876666797 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 0.6224106287595911,
            "unit": "iter/sec",
            "range": "stddev: 0.019559910441527523",
            "extra": "mean: 1.6066563676666494 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.6221761803000081,
            "unit": "iter/sec",
            "range": "stddev: 0.003277027061508543",
            "extra": "mean: 1.6072617879999977 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.2509951410935451,
            "unit": "iter/sec",
            "range": "stddev: 0.003293961184385928",
            "extra": "mean: 799.3636163333614 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.2462616807480682,
            "unit": "iter/sec",
            "range": "stddev: 0.0012835972012238015",
            "extra": "mean: 802.399700999994 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 1.2796846136393683,
            "unit": "iter/sec",
            "range": "stddev: 0.001371475222479453",
            "extra": "mean: 781.442543999996 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.2542960161174976,
            "unit": "iter/sec",
            "range": "stddev: 0.004247431400889943",
            "extra": "mean: 797.2599666666914 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 118.43849690796004,
            "unit": "iter/sec",
            "range": "stddev: 0.00007856055676698932",
            "extra": "mean: 8.443200699998007 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 1.1929578239471588,
            "unit": "iter/sec",
            "range": "stddev: 0.008670684548582129",
            "extra": "mean: 838.2526020000304 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 1.183830423445334,
            "unit": "iter/sec",
            "range": "stddev: 0.006989971243681403",
            "extra": "mean: 844.7155776666667 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 16.446697238313046,
            "unit": "iter/sec",
            "range": "stddev: 0.0014755143975470762",
            "extra": "mean: 60.80248122221595 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 357.497130906805,
            "unit": "iter/sec",
            "range": "stddev: 0.0004032891709567479",
            "extra": "mean: 2.7972252461536184 msec\nrounds: 390"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 23.653484820708677,
            "unit": "iter/sec",
            "range": "stddev: 0.0002493684718599268",
            "extra": "mean: 42.277068583336096 msec\nrounds: 24"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 164.33012927926688,
            "unit": "iter/sec",
            "range": "stddev: 0.00035867097224407524",
            "extra": "mean: 6.085311344826938 msec\nrounds: 174"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 254.53461224640552,
            "unit": "iter/sec",
            "range": "stddev: 0.000041573325159937546",
            "extra": "mean: 3.9287387722025677 msec\nrounds: 259"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 273.52722497885395,
            "unit": "iter/sec",
            "range": "stddev: 0.0001709274627496227",
            "extra": "mean: 3.6559432066673025 msec\nrounds: 300"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 63.264179829368025,
            "unit": "iter/sec",
            "range": "stddev: 0.0002339618695752358",
            "extra": "mean: 15.806733015383017 msec\nrounds: 65"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 929.9937939815027,
            "unit": "iter/sec",
            "range": "stddev: 0.000023346730024476786",
            "extra": "mean: 1.07527599266957 msec\nrounds: 955"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 26.25288155638788,
            "unit": "iter/sec",
            "range": "stddev: 0.00024083716423547105",
            "extra": "mean: 38.09105670370417 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 1948.1828699259104,
            "unit": "iter/sec",
            "range": "stddev: 0.000015671331471031615",
            "extra": "mean: 513.2988362832849 usec\nrounds: 2034"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 66.64655058147301,
            "unit": "iter/sec",
            "range": "stddev: 0.00012929821462563592",
            "extra": "mean: 15.004527485297773 msec\nrounds: 68"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 90313.42508436045,
            "unit": "iter/sec",
            "range": "stddev: 9.731294266145034e-7",
            "extra": "mean: 11.072550942076603 usec\nrounds: 92507"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
            "value": 25729.152678265174,
            "unit": "iter/sec",
            "range": "stddev: 0.0000019943246070102776",
            "extra": "mean: 38.86641789197958 usec\nrounds: 26246"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
            "value": 6337.024821397486,
            "unit": "iter/sec",
            "range": "stddev: 0.000005957466367221562",
            "extra": "mean: 157.80275889458687 usec\nrounds: 6549"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 27.358422690792917,
            "unit": "iter/sec",
            "range": "stddev: 0.0006805072630726622",
            "extra": "mean: 36.55181482142008 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 27.2456192350287,
            "unit": "iter/sec",
            "range": "stddev: 0.0002614266211544375",
            "extra": "mean: 36.7031481785643 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 26.361770223331398,
            "unit": "iter/sec",
            "range": "stddev: 0.0032904702795832365",
            "extra": "mean: 37.93371960715116 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 3026.860596646027,
            "unit": "iter/sec",
            "range": "stddev: 0.000029960385800529684",
            "extra": "mean: 330.37530737559234 usec\nrounds: 3159"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 2735.2572723398857,
            "unit": "iter/sec",
            "range": "stddev: 0.000024810965632690607",
            "extra": "mean: 365.5963225516064 usec\nrounds: 3339"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 2053.568145332458,
            "unit": "iter/sec",
            "range": "stddev: 0.00002352386587600912",
            "extra": "mean: 486.9573002838468 usec\nrounds: 2118"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 99.19875288239936,
            "unit": "iter/sec",
            "range": "stddev: 0.0001235696931710469",
            "extra": "mean: 10.080771894234449 msec\nrounds: 104"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 99.4454396095867,
            "unit": "iter/sec",
            "range": "stddev: 0.0001516059109685165",
            "extra": "mean: 10.055765291258247 msec\nrounds: 103"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 98.15381469900962,
            "unit": "iter/sec",
            "range": "stddev: 0.00014615148157810754",
            "extra": "mean: 10.188091039217552 msec\nrounds: 102"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 26.953638850743143,
            "unit": "iter/sec",
            "range": "stddev: 0.00019402789220156482",
            "extra": "mean: 37.100741964286904 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 26.93935298075541,
            "unit": "iter/sec",
            "range": "stddev: 0.0002475016680019331",
            "extra": "mean: 37.12041639286464 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 7079.281584338143,
            "unit": "iter/sec",
            "range": "stddev: 0.000006825445943168349",
            "extra": "mean: 141.2572713892821 usec\nrounds: 7340"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 1049853.4596312388,
            "unit": "iter/sec",
            "range": "stddev: 9.801757549249347e-8",
            "extra": "mean: 952.5138873679097 nsec\nrounds: 108732"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3292927.595531236,
            "unit": "iter/sec",
            "range": "stddev: 3.827910649408464e-8",
            "extra": "mean: 303.6811381328516 nsec\nrounds: 193799"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1614721.8709216162,
            "unit": "iter/sec",
            "range": "stddev: 6.981990398565872e-8",
            "extra": "mean: 619.3017001926415 nsec\nrounds: 168039"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 168114.7220568355,
            "unit": "iter/sec",
            "range": "stddev: 8.808902605208387e-7",
            "extra": "mean: 5.9483190274194095 usec\nrounds: 174217"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 1104.931726644127,
            "unit": "iter/sec",
            "range": "stddev: 0.000020783059315117228",
            "extra": "mean: 905.0332938100863 usec\nrounds: 1147"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 119.52983467043506,
            "unit": "iter/sec",
            "range": "stddev: 0.00007753904674723442",
            "extra": "mean: 8.366112132231901 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 18.38190779880691,
            "unit": "iter/sec",
            "range": "stddev: 0.00021096955222618373",
            "extra": "mean: 54.40131736842384 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 119.86371326813212,
            "unit": "iter/sec",
            "range": "stddev: 0.000043090394801817455",
            "extra": "mean: 8.342808450819684 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 108.8711933103942,
            "unit": "iter/sec",
            "range": "stddev: 0.000172160244572712",
            "extra": "mean: 9.185166154549051 msec\nrounds: 110"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 118.32034555391382,
            "unit": "iter/sec",
            "range": "stddev: 0.0001842882106640065",
            "extra": "mean: 8.45163184166277 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 161.22499839095116,
            "unit": "iter/sec",
            "range": "stddev: 0.000035263180055586046",
            "extra": "mean: 6.2025120792690025 msec\nrounds: 164"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 1158.9130493165426,
            "unit": "iter/sec",
            "range": "stddev: 0.0000336866611536726",
            "extra": "mean: 862.8775045632111 usec\nrounds: 1205"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 120.65692421930734,
            "unit": "iter/sec",
            "range": "stddev: 0.000052288865002482055",
            "extra": "mean: 8.28796197541377 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 119.99753536851382,
            "unit": "iter/sec",
            "range": "stddev: 0.00006412930394125602",
            "extra": "mean: 8.333504491813006 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 27800.666165834366,
            "unit": "iter/sec",
            "range": "stddev: 0.000002165165030107366",
            "extra": "mean: 35.97036107102175 usec\nrounds: 28421"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 49.977323546674384,
            "unit": "iter/sec",
            "range": "stddev: 0.013943609778957448",
            "extra": "mean: 20.00907469696909 msec\nrounds: 66"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 3.373066246313409,
            "unit": "iter/sec",
            "range": "stddev: 0.0016263837281355281",
            "extra": "mean: 296.46616075001475 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.2774547802916654,
            "unit": "iter/sec",
            "range": "stddev: 0.0003338724325454877",
            "extra": "mean: 782.8065739999678 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.12820636095859847,
            "unit": "iter/sec",
            "range": "stddev: 0.03570730521107908",
            "extra": "mean: 7.79992500000003 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.2749452336756897,
            "unit": "iter/sec",
            "range": "stddev: 0.00017586729632691474",
            "extra": "mean: 784.3474163333136 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 3.1025770166034072,
            "unit": "iter/sec",
            "range": "stddev: 0.0007413316149450677",
            "extra": "mean: 322.31270799999834 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 1.023148907741396,
            "unit": "iter/sec",
            "range": "stddev: 0.004349084903928292",
            "extra": "mean: 977.3748400000765 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 2.3866987844724106,
            "unit": "iter/sec",
            "range": "stddev: 0.003809206594282183",
            "extra": "mean: 418.9887749999646 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 3.217980597884661,
            "unit": "iter/sec",
            "range": "stddev: 0.0016401442455503167",
            "extra": "mean: 310.75389349996385 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.2547814288093708,
            "unit": "iter/sec",
            "range": "stddev: 0.0018652729506694516",
            "extra": "mean: 796.9515463333513 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.241122900516378,
            "unit": "iter/sec",
            "range": "stddev: 0.002238307189978472",
            "extra": "mean: 805.7219793333464 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 11425.04143844362,
            "unit": "iter/sec",
            "range": "stddev: 0.0000032087684832430788",
            "extra": "mean: 87.52703483727805 usec\nrounds: 11597"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 287.13749674250494,
            "unit": "iter/sec",
            "range": "stddev: 0.000026436855859628074",
            "extra": "mean: 3.4826520790378193 msec\nrounds: 291"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 26.136687867509927,
            "unit": "iter/sec",
            "range": "stddev: 0.001716119126689864",
            "extra": "mean: 38.260394931030376 msec\nrounds: 29"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 16.57881856190583,
            "unit": "iter/sec",
            "range": "stddev: 0.0016621546866428917",
            "extra": "mean: 60.31792894445213 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.496041975448555,
            "unit": "iter/sec",
            "range": "stddev: 0.0017299148210817266",
            "extra": "mean: 181.94911983334805 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 16.59077938180664,
            "unit": "iter/sec",
            "range": "stddev: 0.0017267016170314168",
            "extra": "mean: 60.27444383333761 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 20.45286081072185,
            "unit": "iter/sec",
            "range": "stddev: 0.0021266451551173243",
            "extra": "mean: 48.89291572725989 msec\nrounds: 22"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 16.67440108760838,
            "unit": "iter/sec",
            "range": "stddev: 0.0012179340353644958",
            "extra": "mean: 59.97216900000998 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 16.37312396381386,
            "unit": "iter/sec",
            "range": "stddev: 0.0013789324987958744",
            "extra": "mean: 61.07569955557008 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 26.531392244627444,
            "unit": "iter/sec",
            "range": "stddev: 0.0014575383393024058",
            "extra": "mean: 37.691199571424605 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 16.707434415509564,
            "unit": "iter/sec",
            "range": "stddev: 0.0013675449922662091",
            "extra": "mean: 59.853594222204265 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 16.58126367059668,
            "unit": "iter/sec",
            "range": "stddev: 0.00159546225395746",
            "extra": "mean: 60.30903433332924 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 21909.934088619604,
            "unit": "iter/sec",
            "range": "stddev: 0.0000023539821158231825",
            "extra": "mean: 45.64139700079778 usec\nrounds: 22340"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 45.218507789931564,
            "unit": "iter/sec",
            "range": "stddev: 0.01573789847709922",
            "extra": "mean: 22.114838566668972 msec\nrounds: 60"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 172.78429284525774,
            "unit": "iter/sec",
            "range": "stddev: 0.00009118246675410699",
            "extra": "mean: 5.787563114290606 msec\nrounds: 175"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.42242089706908,
            "unit": "iter/sec",
            "range": "stddev: 0.00030524482591643565",
            "extra": "mean: 69.3364870666907 msec\nrounds: 15"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
            "value": 1.1325724932301053,
            "unit": "iter/sec",
            "range": "stddev: 0.0011017951361041237",
            "extra": "mean: 882.9456886666852 msec\nrounds: 3"
          }
        ]
      }
    ]
  }
}