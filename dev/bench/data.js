window.BENCHMARK_DATA = {
  "lastUpdate": 1769014009369,
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
          "id": "650fab97dd08d3ea380004873e251e8695a29a84",
          "message": "fix(cli): set execute permissions on bundled executables for uvx installs (#174)\n\nWheel extraction via uvx may strip execute permissions from bundled\nbinaries, causing PermissionError when running CLI commands. Added\n_ensure_executable() to restore execute bits before running mmg\nexecutables.",
          "timestamp": "2026-01-21T17:36:36+01:00",
          "tree_id": "c167de54421a8d07b9b5d8ba6b789345c929fecf",
          "url": "https://github.com/kmarchais/mmgpy/commit/650fab97dd08d3ea380004873e251e8695a29a84"
        },
        "date": 1769014008735,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 1.0987789376247663,
            "unit": "iter/sec",
            "range": "stddev: 0.005330816290625153",
            "extra": "mean: 910.1011730000058 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.5350251755811012,
            "unit": "iter/sec",
            "range": "stddev: 0.03207271154232686",
            "extra": "mean: 1.869070925333337 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.1156160783310651,
            "unit": "iter/sec",
            "range": "stddev: 0.003928567294590913",
            "extra": "mean: 896.3657116666658 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.213969051556965,
            "unit": "iter/sec",
            "range": "stddev: 0.006352544499017356",
            "extra": "mean: 823.7442286666692 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 1.0980266550077211,
            "unit": "iter/sec",
            "range": "stddev: 0.011630886807418304",
            "extra": "mean: 910.7247036666593 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.5360176393456627,
            "unit": "iter/sec",
            "range": "stddev: 0.02132590847051111",
            "extra": "mean: 1.8656102459999981 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.213232259342045,
            "unit": "iter/sec",
            "range": "stddev: 0.008443212106923515",
            "extra": "mean: 824.2444859999978 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.2116064311447239,
            "unit": "iter/sec",
            "range": "stddev: 0.005736184419172694",
            "extra": "mean: 825.3505216666781 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 28.100226123005488,
            "unit": "iter/sec",
            "range": "stddev: 0.0007636377938258009",
            "extra": "mean: 35.58690224137755 msec\nrounds: 29"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.0277136341731927,
            "unit": "iter/sec",
            "range": "stddev: 0.012621398415232661",
            "extra": "mean: 973.0337000000114 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 117.03102265407806,
            "unit": "iter/sec",
            "range": "stddev: 0.0002298357782473382",
            "extra": "mean: 8.544742900827366 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 11.488773894899726,
            "unit": "iter/sec",
            "range": "stddev: 0.002097538220497561",
            "extra": "mean: 87.04149016666918 msec\nrounds: 12"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 0.968534899688242,
            "unit": "iter/sec",
            "range": "stddev: 0.013257264154079882",
            "extra": "mean: 1.0324873170000235 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 16.28804017049302,
            "unit": "iter/sec",
            "range": "stddev: 0.001473717262479374",
            "extra": "mean: 61.39474052940841 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 356.8305198002589,
            "unit": "iter/sec",
            "range": "stddev: 0.0009089675241764864",
            "extra": "mean: 2.8024508681593843 msec\nrounds: 402"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 22.98623055064915,
            "unit": "iter/sec",
            "range": "stddev: 0.0006529394072393616",
            "extra": "mean: 43.50430566667048 msec\nrounds: 24"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 160.54395543814553,
            "unit": "iter/sec",
            "range": "stddev: 0.000565573616524765",
            "extra": "mean: 6.228823734103653 msec\nrounds: 173"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 249.31271957803162,
            "unit": "iter/sec",
            "range": "stddev: 0.0001960746467700524",
            "extra": "mean: 4.011026800768636 msec\nrounds: 261"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 266.1015360467858,
            "unit": "iter/sec",
            "range": "stddev: 0.0005485545211993704",
            "extra": "mean: 3.7579640270253107 msec\nrounds: 296"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 60.57347689726263,
            "unit": "iter/sec",
            "range": "stddev: 0.001213401653021255",
            "extra": "mean: 16.508875686566228 msec\nrounds: 67"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 921.2771467209752,
            "unit": "iter/sec",
            "range": "stddev: 0.000031897797381923934",
            "extra": "mean: 1.085449697259089 msec\nrounds: 948"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 25.91502734162831,
            "unit": "iter/sec",
            "range": "stddev: 0.002001308101029984",
            "extra": "mean: 38.58764981481078 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 1954.4265287685132,
            "unit": "iter/sec",
            "range": "stddev: 0.0000405316127493657",
            "extra": "mean: 511.6590392528602 usec\nrounds: 2089"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 64.77601544571907,
            "unit": "iter/sec",
            "range": "stddev: 0.0007296165848815521",
            "extra": "mean: 15.437812794119436 msec\nrounds: 68"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 90914.5899848264,
            "unit": "iter/sec",
            "range": "stddev: 9.790628872108022e-7",
            "extra": "mean: 10.99933465208279 usec\nrounds: 92765"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
            "value": 25593.84813462235,
            "unit": "iter/sec",
            "range": "stddev: 0.0000022904118448921636",
            "extra": "mean: 39.07188925792052 usec\nrounds: 26178"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
            "value": 6379.564152792011,
            "unit": "iter/sec",
            "range": "stddev: 0.000005284541812594937",
            "extra": "mean: 156.75052026279116 usec\nrounds: 6539"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 26.67778795045401,
            "unit": "iter/sec",
            "range": "stddev: 0.00037361386648193906",
            "extra": "mean: 37.48436721429828 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 27.226153013186195,
            "unit": "iter/sec",
            "range": "stddev: 0.0005716187372185367",
            "extra": "mean: 36.72939028571826 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 27.0407731361924,
            "unit": "iter/sec",
            "range": "stddev: 0.000543560596292597",
            "extra": "mean: 36.98119114285094 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 3721.8515470127395,
            "unit": "iter/sec",
            "range": "stddev: 0.000009418258529509736",
            "extra": "mean: 268.68347309624085 usec\nrounds: 3847"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 3253.044921012572,
            "unit": "iter/sec",
            "range": "stddev: 0.00001714598347650732",
            "extra": "mean: 307.4043009798743 usec\nrounds: 3369"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 2335.995877799402,
            "unit": "iter/sec",
            "range": "stddev: 0.0000174084768092296",
            "extra": "mean: 428.0829471933993 usec\nrounds: 2405"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 98.62566988809998,
            "unit": "iter/sec",
            "range": "stddev: 0.00022897017328820453",
            "extra": "mean: 10.139348114284985 msec\nrounds: 105"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 98.93735882629609,
            "unit": "iter/sec",
            "range": "stddev: 0.0002999137647043111",
            "extra": "mean: 10.107405451925352 msec\nrounds: 104"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 98.818027407315,
            "unit": "iter/sec",
            "range": "stddev: 0.00025232421548973235",
            "extra": "mean: 10.119611028847304 msec\nrounds: 104"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 27.521074350467146,
            "unit": "iter/sec",
            "range": "stddev: 0.0004138960142114887",
            "extra": "mean: 36.33579079310274 msec\nrounds: 29"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 26.626563462915556,
            "unit": "iter/sec",
            "range": "stddev: 0.002205004214389628",
            "extra": "mean: 37.55648006896426 msec\nrounds: 29"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 8733.850822638167,
            "unit": "iter/sec",
            "range": "stddev: 0.000007731520612982596",
            "extra": "mean: 114.49703232942758 usec\nrounds: 9527"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 1061352.599167396,
            "unit": "iter/sec",
            "range": "stddev: 1.3359830241748458e-7",
            "extra": "mean: 942.1939521177734 nsec\nrounds: 110303"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3308862.9768392523,
            "unit": "iter/sec",
            "range": "stddev: 4.025501789386235e-8",
            "extra": "mean: 302.218619205331 nsec\nrounds: 192308"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1633726.2006092758,
            "unit": "iter/sec",
            "range": "stddev: 7.38468574047264e-8",
            "extra": "mean: 612.0976695036559 nsec\nrounds: 168891"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 166984.30304516657,
            "unit": "iter/sec",
            "range": "stddev: 9.280188399046679e-7",
            "extra": "mean: 5.98858684177947 usec\nrounds: 174795"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 1255.6672017914184,
            "unit": "iter/sec",
            "range": "stddev: 0.00009238828846250866",
            "extra": "mean: 796.3893606310122 usec\nrounds: 1331"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 116.80776853615924,
            "unit": "iter/sec",
            "range": "stddev: 0.00032861751713717625",
            "extra": "mean: 8.561074426230805 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 18.276109949735275,
            "unit": "iter/sec",
            "range": "stddev: 0.00010751467240787963",
            "extra": "mean: 54.716239000000364 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 114.93652860549426,
            "unit": "iter/sec",
            "range": "stddev: 0.0003782295930154805",
            "extra": "mean: 8.700454173558512 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 104.39757986640929,
            "unit": "iter/sec",
            "range": "stddev: 0.0002811208458134909",
            "extra": "mean: 9.578766110092152 msec\nrounds: 109"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 114.45445983704863,
            "unit": "iter/sec",
            "range": "stddev: 0.00027883305713564987",
            "extra": "mean: 8.737099466667548 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 147.89223644379865,
            "unit": "iter/sec",
            "range": "stddev: 0.0003634099465079715",
            "extra": "mean: 6.761680153373133 msec\nrounds: 163"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 1308.4453517610832,
            "unit": "iter/sec",
            "range": "stddev: 0.00004713426887916239",
            "extra": "mean: 764.2657743818374 usec\nrounds: 1374"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 116.31106492280504,
            "unit": "iter/sec",
            "range": "stddev: 0.0003160294565736129",
            "extra": "mean: 8.597634289254371 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 114.07170617590302,
            "unit": "iter/sec",
            "range": "stddev: 0.0004732335536778711",
            "extra": "mean: 8.766415735537093 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 27737.003612255623,
            "unit": "iter/sec",
            "range": "stddev: 0.000002238318540932482",
            "extra": "mean: 36.052920999662305 usec\nrounds: 28405"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 44.44080358032409,
            "unit": "iter/sec",
            "range": "stddev: 0.018215893948132875",
            "extra": "mean: 22.501843338466188 msec\nrounds: 65"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 3.2138168800966436,
            "unit": "iter/sec",
            "range": "stddev: 0.008255290790114663",
            "extra": "mean: 311.15649625000685 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.2094979391269718,
            "unit": "iter/sec",
            "range": "stddev: 0.009063965563847969",
            "extra": "mean: 826.7893376666772 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.12526998717423443,
            "unit": "iter/sec",
            "range": "stddev: 0.05793306787091021",
            "extra": "mean: 7.982758061666668 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.1917550055495234,
            "unit": "iter/sec",
            "range": "stddev: 0.0019685138172274475",
            "extra": "mean: 839.098636333309 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 2.792852967116305,
            "unit": "iter/sec",
            "range": "stddev: 0.014447949239887199",
            "extra": "mean: 358.0568013333429 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 0.9650477531459224,
            "unit": "iter/sec",
            "range": "stddev: 0.03958155493238242",
            "extra": "mean: 1.036218152666682 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 2.251213937286971,
            "unit": "iter/sec",
            "range": "stddev: 0.005161815285490706",
            "extra": "mean: 444.2047836666916 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 2.951151862976709,
            "unit": "iter/sec",
            "range": "stddev: 0.010755301108430877",
            "extra": "mean: 338.85074250002845 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.2050494560732503,
            "unit": "iter/sec",
            "range": "stddev: 0.010155186473927847",
            "extra": "mean: 829.8414599999736 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.2240498249481406,
            "unit": "iter/sec",
            "range": "stddev: 0.007837741698880338",
            "extra": "mean: 816.9602083333226 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 11414.507439591727,
            "unit": "iter/sec",
            "range": "stddev: 0.000003472552054453541",
            "extra": "mean: 87.60781008661446 usec\nrounds: 11600"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 288.8377300505725,
            "unit": "iter/sec",
            "range": "stddev: 0.00003190384989662513",
            "extra": "mean: 3.4621515680271777 msec\nrounds: 294"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 24.84246064856651,
            "unit": "iter/sec",
            "range": "stddev: 0.0017625002546480632",
            "extra": "mean: 40.25366142857121 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 16.291331730840962,
            "unit": "iter/sec",
            "range": "stddev: 0.0012280674430347083",
            "extra": "mean: 61.382336111105616 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.385901701590784,
            "unit": "iter/sec",
            "range": "stddev: 0.005025896142350549",
            "extra": "mean: 185.66993149998248 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 15.998314261181392,
            "unit": "iter/sec",
            "range": "stddev: 0.00394259365909477",
            "extra": "mean: 62.506585611111454 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 20.215317314274273,
            "unit": "iter/sec",
            "range": "stddev: 0.00217306643563093",
            "extra": "mean: 49.467440181801564 msec\nrounds: 22"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 16.420871864860707,
            "unit": "iter/sec",
            "range": "stddev: 0.0009307100971700556",
            "extra": "mean: 60.898106277774225 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 15.777306020647933,
            "unit": "iter/sec",
            "range": "stddev: 0.001973669988458305",
            "extra": "mean: 63.38217682355207 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 23.377760547807902,
            "unit": "iter/sec",
            "range": "stddev: 0.007973338432036544",
            "extra": "mean: 42.77569692593025 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 15.3873276900703,
            "unit": "iter/sec",
            "range": "stddev: 0.0077174592207147116",
            "extra": "mean: 64.98854252940338 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 16.43293088102385,
            "unit": "iter/sec",
            "range": "stddev: 0.001013030546657023",
            "extra": "mean: 60.853417277788445 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 21825.3187378403,
            "unit": "iter/sec",
            "range": "stddev: 0.0000026461115955505886",
            "extra": "mean: 45.81834574842749 usec\nrounds: 22285"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 43.692084825430676,
            "unit": "iter/sec",
            "range": "stddev: 0.017473600731936368",
            "extra": "mean: 22.887440688523906 msec\nrounds: 61"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 171.59732497180843,
            "unit": "iter/sec",
            "range": "stddev: 0.00026781297280891283",
            "extra": "mean: 5.82759667240902 msec\nrounds: 174"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.470438347770349,
            "unit": "iter/sec",
            "range": "stddev: 0.0007059655928929063",
            "extra": "mean: 69.10640686666434 msec\nrounds: 15"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
            "value": 1.114391232552801,
            "unit": "iter/sec",
            "range": "stddev: 0.008202799077400838",
            "extra": "mean: 897.3509220000248 msec\nrounds: 3"
          }
        ]
      }
    ]
  }
}