window.BENCHMARK_DATA = {
  "lastUpdate": 1768339882799,
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
          "id": "dd1d6d51d430f084123b1f54ab9368403e704d58",
          "message": "feat(io): use native MMG loading for Medit (.mesh) files (#159)\n\n* feat(io): use native MMG loading for Medit (.mesh) files\n\nUse native MMG loading functions (MMG*_loadMesh) for .mesh files instead\nof routing through meshio. This preserves MMG-specific keywords like\nRidges, RequiredVertices, Tangents, and reference markers that meshio\ndoes not understand.\n\nChanges:\n- Add Medit file header parser to auto-detect mesh kind\n- Add native loading function for .mesh files\n- Update read() to use native loading for .mesh extension\n- Add comprehensive tests for native Medit loading\n\nCloses #157\n\n* test(io): add coverage tests for Medit header parsing edge cases\n\n- Test comments and empty lines in .mesh files\n- Test multi-line dimension format (Dimension\\n3)\n- Test error when mesh kind cannot be determined",
          "timestamp": "2026-01-13T22:21:22+01:00",
          "tree_id": "074c7c6feb3f8a3b1c2ac84ba599c67215f6bc5d",
          "url": "https://github.com/kmarchais/mmgpy/commit/dd1d6d51d430f084123b1f54ab9368403e704d58"
        },
        "date": 1768339882321,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 0.6162392127646653,
            "unit": "iter/sec",
            "range": "stddev: 0.01236243698883797",
            "extra": "mean: 1.6227464583333624 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.6037591929876595,
            "unit": "iter/sec",
            "range": "stddev: 0.017234329806387942",
            "extra": "mean: 1.656289480333328 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.1469031642465448,
            "unit": "iter/sec",
            "range": "stddev: 0.0014480275127265313",
            "extra": "mean: 871.9131929999927 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.2238923541145708,
            "unit": "iter/sec",
            "range": "stddev: 0.0010589165218695211",
            "extra": "mean: 817.0653216666702 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 0.6107493967940743,
            "unit": "iter/sec",
            "range": "stddev: 0.007371108053352723",
            "extra": "mean: 1.637332767333324 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.6066256678210261,
            "unit": "iter/sec",
            "range": "stddev: 0.009340932653056865",
            "extra": "mean: 1.6484630523333408 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.2176973335709997,
            "unit": "iter/sec",
            "range": "stddev: 0.007180325242212317",
            "extra": "mean: 821.2221316666728 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.2310972223428016,
            "unit": "iter/sec",
            "range": "stddev: 0.00016044601226682914",
            "extra": "mean: 812.2835319999998 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 1.2517460637136462,
            "unit": "iter/sec",
            "range": "stddev: 0.005473126164438792",
            "extra": "mean: 798.8840779999956 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.2818904875153827,
            "unit": "iter/sec",
            "range": "stddev: 0.0023848526274798205",
            "extra": "mean: 780.0978396666665 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 120.09039519037681,
            "unit": "iter/sec",
            "range": "stddev: 0.00005440640557240864",
            "extra": "mean: 8.32706061475375 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 1.2115507582194898,
            "unit": "iter/sec",
            "range": "stddev: 0.008339782862744552",
            "extra": "mean: 825.3884479999934 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 1.1892232654283559,
            "unit": "iter/sec",
            "range": "stddev: 0.005682520129165658",
            "extra": "mean: 840.8849953333212 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 18.596132122166097,
            "unit": "iter/sec",
            "range": "stddev: 0.000430242568463002",
            "extra": "mean: 53.77462331578224 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 397.826208539779,
            "unit": "iter/sec",
            "range": "stddev: 0.00048670101852083566",
            "extra": "mean: 2.513660433963111 msec\nrounds: 424"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 28.09126899405082,
            "unit": "iter/sec",
            "range": "stddev: 0.00022283737036366504",
            "extra": "mean: 35.5982494137869 msec\nrounds: 29"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 162.06511680313403,
            "unit": "iter/sec",
            "range": "stddev: 0.00008070312139510742",
            "extra": "mean: 6.170359295854726 msec\nrounds: 169"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 281.6915281158512,
            "unit": "iter/sec",
            "range": "stddev: 0.00003356731190438469",
            "extra": "mean: 3.549982517006085 msec\nrounds: 294"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 285.09671929721276,
            "unit": "iter/sec",
            "range": "stddev: 0.00022251605850880657",
            "extra": "mean: 3.5075815760527993 msec\nrounds: 309"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 71.06983897553725,
            "unit": "iter/sec",
            "range": "stddev: 0.00021509737890569036",
            "extra": "mean: 14.070666465759226 msec\nrounds: 73"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 958.1720714509768,
            "unit": "iter/sec",
            "range": "stddev: 0.00003565176568459632",
            "extra": "mean: 1.04365387991917 msec\nrounds: 991"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 29.770147628753715,
            "unit": "iter/sec",
            "range": "stddev: 0.00032768917701637566",
            "extra": "mean: 33.59069670968453 msec\nrounds: 31"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 2274.7120456851194,
            "unit": "iter/sec",
            "range": "stddev: 0.000015612341734844225",
            "extra": "mean: 439.6160832299152 usec\nrounds: 2415"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 71.16174977008093,
            "unit": "iter/sec",
            "range": "stddev: 0.0007151317959577546",
            "extra": "mean: 14.052493133332671 msec\nrounds: 75"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 83865.20665786159,
            "unit": "iter/sec",
            "range": "stddev: 0.0000015860426522947034",
            "extra": "mean: 11.92389597368576 usec\nrounds: 85786"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
            "value": 23368.67763137803,
            "unit": "iter/sec",
            "range": "stddev: 0.0000021034074872801064",
            "extra": "mean: 42.792322945020274 usec\nrounds: 23713"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
            "value": 9028.900252573047,
            "unit": "iter/sec",
            "range": "stddev: 0.000004209076985364904",
            "extra": "mean: 110.75545991495709 usec\nrounds: 9193"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 32.029633024466015,
            "unit": "iter/sec",
            "range": "stddev: 0.0002875054704664734",
            "extra": "mean: 31.221088272729958 msec\nrounds: 33"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 32.09188155422293,
            "unit": "iter/sec",
            "range": "stddev: 0.00025382690014920286",
            "extra": "mean: 31.160528818180534 msec\nrounds: 33"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 30.71165070702315,
            "unit": "iter/sec",
            "range": "stddev: 0.00028005736232549096",
            "extra": "mean: 32.56093296773917 msec\nrounds: 31"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 3550.426190602931,
            "unit": "iter/sec",
            "range": "stddev: 0.000009264632898455921",
            "extra": "mean: 281.6563269634344 usec\nrounds: 3768"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 3104.326412291347,
            "unit": "iter/sec",
            "range": "stddev: 0.000010495598437407503",
            "extra": "mean: 322.1310736012087 usec\nrounds: 3288"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 2197.363681670267,
            "unit": "iter/sec",
            "range": "stddev: 0.000011355291339143893",
            "extra": "mean: 455.0908019194514 usec\nrounds: 2292"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 113.84085149256849,
            "unit": "iter/sec",
            "range": "stddev: 0.00007486657393378946",
            "extra": "mean: 8.784192905174113 msec\nrounds: 116"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 112.93371611974024,
            "unit": "iter/sec",
            "range": "stddev: 0.00009493062910100893",
            "extra": "mean: 8.854751568962186 msec\nrounds: 116"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 112.0467731167858,
            "unit": "iter/sec",
            "range": "stddev: 0.00011966298487435017",
            "extra": "mean: 8.92484426086689 msec\nrounds: 115"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 31.0484129335451,
            "unit": "iter/sec",
            "range": "stddev: 0.00024457144507894713",
            "extra": "mean: 32.20776540625003 msec\nrounds: 32"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 30.96735460380252,
            "unit": "iter/sec",
            "range": "stddev: 0.00022938266290776891",
            "extra": "mean: 32.29207056250161 msec\nrounds: 32"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 8869.766462833693,
            "unit": "iter/sec",
            "range": "stddev: 0.000005947705436859727",
            "extra": "mean: 112.74253997444282 usec\nrounds: 9606"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 1053710.3333602964,
            "unit": "iter/sec",
            "range": "stddev: 1.0199261208746105e-7",
            "extra": "mean: 949.0274208576722 nsec\nrounds: 109362"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3610139.485802295,
            "unit": "iter/sec",
            "range": "stddev: 5.2908154697390445e-8",
            "extra": "mean: 276.99760741454185 nsec\nrounds: 198926"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1747505.8276968757,
            "unit": "iter/sec",
            "range": "stddev: 7.876716584675054e-8",
            "extra": "mean: 572.2441574446418 nsec\nrounds: 183892"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 155631.82415367488,
            "unit": "iter/sec",
            "range": "stddev: 8.064605890843501e-7",
            "extra": "mean: 6.425421056637968 usec\nrounds: 160026"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 1263.947833362235,
            "unit": "iter/sec",
            "range": "stddev: 0.000019597638959623945",
            "extra": "mean: 791.171893020216 usec\nrounds: 1318"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 120.3119821053292,
            "unit": "iter/sec",
            "range": "stddev: 0.00003554084838083605",
            "extra": "mean: 8.311724090161967 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 17.951687799878993,
            "unit": "iter/sec",
            "range": "stddev: 0.00016610599832016286",
            "extra": "mean: 55.70506857894112 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 120.92763477615514,
            "unit": "iter/sec",
            "range": "stddev: 0.000048106327559897924",
            "extra": "mean: 8.269408409840022 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 109.44566924119395,
            "unit": "iter/sec",
            "range": "stddev: 0.00006467480967951794",
            "extra": "mean: 9.136953585584296 msec\nrounds: 111"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 118.79333375864798,
            "unit": "iter/sec",
            "range": "stddev: 0.00016227547574708775",
            "extra": "mean: 8.417980776864944 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 157.74157704155877,
            "unit": "iter/sec",
            "range": "stddev: 0.00005425495323347574",
            "extra": "mean: 6.3394827080785365 msec\nrounds: 161"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 1262.4836592164204,
            "unit": "iter/sec",
            "range": "stddev: 0.000017030065942126537",
            "extra": "mean: 792.0894600890637 usec\nrounds: 1328"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 120.33015034633331,
            "unit": "iter/sec",
            "range": "stddev: 0.00005665202171980862",
            "extra": "mean: 8.310469131151317 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 120.62706687437966,
            "unit": "iter/sec",
            "range": "stddev: 0.00006263998135211445",
            "extra": "mean: 8.290013393440082 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 29214.290292517577,
            "unit": "iter/sec",
            "range": "stddev: 0.000002123285571202624",
            "extra": "mean: 34.22982348662846 usec\nrounds: 29737"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 48.53677643127641,
            "unit": "iter/sec",
            "range": "stddev: 0.018235705256655486",
            "extra": "mean: 20.602933971437256 msec\nrounds: 70"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 3.9582710790067073,
            "unit": "iter/sec",
            "range": "stddev: 0.0007988997150309637",
            "extra": "mean: 252.63555224998413 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.2316405309247966,
            "unit": "iter/sec",
            "range": "stddev: 0.0008947553631821107",
            "extra": "mean: 811.9252126666652 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.11963926910263872,
            "unit": "iter/sec",
            "range": "stddev: 0.0275819663142756",
            "extra": "mean: 8.358459622000018 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.2358869012756604,
            "unit": "iter/sec",
            "range": "stddev: 0.0023744481809689346",
            "extra": "mean: 809.1355276666642 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 3.6566032611840096,
            "unit": "iter/sec",
            "range": "stddev: 0.0007671943177554276",
            "extra": "mean: 273.47785050002926 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 0.9602774793220689,
            "unit": "iter/sec",
            "range": "stddev: 0.0007805105827507696",
            "extra": "mean: 1.041365669333383 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 2.6145540880658142,
            "unit": "iter/sec",
            "range": "stddev: 0.0008453469559415231",
            "extra": "mean: 382.4743976667075 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 3.830780331647986,
            "unit": "iter/sec",
            "range": "stddev: 0.0008262165204227311",
            "extra": "mean: 261.0434202500471 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.2010433280832777,
            "unit": "iter/sec",
            "range": "stddev: 0.018251521752786843",
            "extra": "mean: 832.6094293333123 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.2264517537924848,
            "unit": "iter/sec",
            "range": "stddev: 0.0021528385206470166",
            "extra": "mean: 815.3602429999864 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 11607.82056670566,
            "unit": "iter/sec",
            "range": "stddev: 0.000003252571725698979",
            "extra": "mean: 86.14881615832931 usec\nrounds: 11771"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 282.40512693076874,
            "unit": "iter/sec",
            "range": "stddev: 0.00012283818566472988",
            "extra": "mean: 3.5410122006926192 msec\nrounds: 289"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 30.625871194664796,
            "unit": "iter/sec",
            "range": "stddev: 0.0022896211157147355",
            "extra": "mean: 32.652132363640504 msec\nrounds: 33"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 18.75088890933046,
            "unit": "iter/sec",
            "range": "stddev: 0.0006156648829297399",
            "extra": "mean: 53.33080499999117 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.540756866039509,
            "unit": "iter/sec",
            "range": "stddev: 0.00042498535620993125",
            "extra": "mean: 180.48075816667128 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 18.50346937274566,
            "unit": "iter/sec",
            "range": "stddev: 0.0006089310242392407",
            "extra": "mean: 54.04391900001907 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 22.02904161730571,
            "unit": "iter/sec",
            "range": "stddev: 0.0018483804023958549",
            "extra": "mean: 45.394621217403014 msec\nrounds: 23"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 18.310903603978062,
            "unit": "iter/sec",
            "range": "stddev: 0.0013197440407330542",
            "extra": "mean: 54.612269368440614 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 18.23532479533529,
            "unit": "iter/sec",
            "range": "stddev: 0.0006815112748248349",
            "extra": "mean: 54.838617421051154 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 31.985767798845405,
            "unit": "iter/sec",
            "range": "stddev: 0.0006387784847098436",
            "extra": "mean: 31.263904818195332 msec\nrounds: 33"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 18.538655383067844,
            "unit": "iter/sec",
            "range": "stddev: 0.00048270902744209623",
            "extra": "mean: 53.941344684218215 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 18.38748781080946,
            "unit": "iter/sec",
            "range": "stddev: 0.0007694574650434965",
            "extra": "mean: 54.384808315801 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 20082.44464078982,
            "unit": "iter/sec",
            "range": "stddev: 0.0000027394354866093544",
            "extra": "mean: 49.79473454984069 usec\nrounds: 20437"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 43.851248268935166,
            "unit": "iter/sec",
            "range": "stddev: 0.020227432735600192",
            "extra": "mean: 22.80436793650898 msec\nrounds: 63"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 162.6766366232171,
            "unit": "iter/sec",
            "range": "stddev: 0.00004702079228634407",
            "extra": "mean: 6.1471642195071095 msec\nrounds: 164"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 13.650312957656034,
            "unit": "iter/sec",
            "range": "stddev: 0.00012399969339400158",
            "extra": "mean: 73.25839364284548 msec\nrounds: 14"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
            "value": 1.0746385801945513,
            "unit": "iter/sec",
            "range": "stddev: 0.0058656346230134574",
            "extra": "mean: 930.5454116666473 msec\nrounds: 3"
          }
        ]
      }
    ]
  }
}