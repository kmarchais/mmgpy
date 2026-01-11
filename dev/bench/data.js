window.BENCHMARK_DATA = {
  "lastUpdate": 1768161903242,
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
          "id": "2dc2c374a1e1ad90a47d3bb30de4fdadd9bdaec8",
          "message": "feat(repair): add mesh repair utilities module (#144)\n\n* feat(repair): add mesh repair utilities module\n\nAdd a new module with utilities for repairing common mesh issues:\n\n- remove_duplicate_vertices: Uses KD-tree for O(n log n) duplicate detection\n- remove_orphan_vertices: Removes vertices not referenced by elements\n- remove_degenerate_elements: Removes zero-volume tetra/zero-area triangles\n- fix_inverted_elements: Flips elements with negative volume/area\n- remove_duplicate_elements: Removes elements with same vertices\n- merge_close_vertices: Merges vertices within tolerance distance\n- auto_repair: Convenience function applying all safe repairs\n- RepairReport: Dataclass summarizing repair operations\n\nCloses #122\n\n* fix(repair): improve docs, add warning, expand test coverage\n\n- Add docstring note to fix_inverted_elements explaining that surface\n  meshes are skipped since orientation requires additional context\n- Add module-level note to _vertices.py clarifying when to use\n  merge_close_vertices vs remove_duplicate_vertices\n- Add warning when large number of vertex pairs found in duplicate\n  detection (may indicate tolerance is too large)\n- Rename test_empty_mesh to test_valid_mesh_no_repairs_needed\n- Add comprehensive tests for surface mesh operations\n- Add tests for 2D mesh auto_repair\n- Add tests for RepairReport formatting\n- Add tests for 3D triangle area computation\n- Add tests for inverted element detection at array level\n- Expand coverage from 82% to 92%",
          "timestamp": "2026-01-11T20:54:54+01:00",
          "tree_id": "42ce444c81880d5507f7a47d8695c9975ced9e30",
          "url": "https://github.com/kmarchais/mmgpy/commit/2dc2c374a1e1ad90a47d3bb30de4fdadd9bdaec8"
        },
        "date": 1768161902685,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 0.61950043880269,
            "unit": "iter/sec",
            "range": "stddev: 0.009342873839787621",
            "extra": "mean: 1.6142038606666727 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.6196001193852142,
            "unit": "iter/sec",
            "range": "stddev: 0.01611111119024516",
            "extra": "mean: 1.6139441693333272 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.1918188586044265,
            "unit": "iter/sec",
            "range": "stddev: 0.0032765023650327637",
            "extra": "mean: 839.0536806666754 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.2493915947072962,
            "unit": "iter/sec",
            "range": "stddev: 0.004818773311093827",
            "extra": "mean: 800.3895690000036 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 0.6061953461411361,
            "unit": "iter/sec",
            "range": "stddev: 0.022378457664604428",
            "extra": "mean: 1.6496332516666616 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.6092265067409703,
            "unit": "iter/sec",
            "range": "stddev: 0.01584629087507722",
            "extra": "mean: 1.641425625666642 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.2470509463829538,
            "unit": "iter/sec",
            "range": "stddev: 0.0019482260246067907",
            "extra": "mean: 801.8918576666655 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.2531773622773432,
            "unit": "iter/sec",
            "range": "stddev: 0.0011700272820956363",
            "extra": "mean: 797.971643999972 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 1.2367947292768775,
            "unit": "iter/sec",
            "range": "stddev: 0.0039257244327149015",
            "extra": "mean: 808.541608666682 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.22948845738491,
            "unit": "iter/sec",
            "range": "stddev: 0.009655884847385745",
            "extra": "mean: 813.3463913333306 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 121.8973853182526,
            "unit": "iter/sec",
            "range": "stddev: 0.000060103882775745316",
            "extra": "mean: 8.203621409837266 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 1.1610830536745664,
            "unit": "iter/sec",
            "range": "stddev: 0.000525001600070146",
            "extra": "mean: 861.2648310000092 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 1.18427240719808,
            "unit": "iter/sec",
            "range": "stddev: 0.011378010564888349",
            "extra": "mean: 844.4003203333447 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 16.86974945917907,
            "unit": "iter/sec",
            "range": "stddev: 0.001246652238073769",
            "extra": "mean: 59.2777031111085 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 370.26655383559955,
            "unit": "iter/sec",
            "range": "stddev: 0.00019165004275236474",
            "extra": "mean: 2.7007570347388317 msec\nrounds: 403"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 23.487889367276317,
            "unit": "iter/sec",
            "range": "stddev: 0.00037652093488633196",
            "extra": "mean: 42.57513241667491 msec\nrounds: 24"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 160.69848287529913,
            "unit": "iter/sec",
            "range": "stddev: 0.0006130533104678901",
            "extra": "mean: 6.222834105882585 msec\nrounds: 170"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 253.13088447479993,
            "unit": "iter/sec",
            "range": "stddev: 0.0004324071268883703",
            "extra": "mean: 3.950525444869425 msec\nrounds: 263"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 269.09053511335964,
            "unit": "iter/sec",
            "range": "stddev: 0.000628359628156938",
            "extra": "mean: 3.7162213809516955 msec\nrounds: 294"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 65.2671390528099,
            "unit": "iter/sec",
            "range": "stddev: 0.000177469739544138",
            "extra": "mean: 15.321646000001095 msec\nrounds: 67"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 881.6006104534504,
            "unit": "iter/sec",
            "range": "stddev: 0.000019936232866136737",
            "extra": "mean: 1.1343004849845228 msec\nrounds: 899"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 25.75280569414204,
            "unit": "iter/sec",
            "range": "stddev: 0.00020914276937834613",
            "extra": "mean: 38.83072049999852 msec\nrounds: 26"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 1967.326523420185,
            "unit": "iter/sec",
            "range": "stddev: 0.00001595271056201451",
            "extra": "mean: 508.3040299083175 usec\nrounds: 2073"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 65.54486229544966,
            "unit": "iter/sec",
            "range": "stddev: 0.0010647001402038785",
            "extra": "mean: 15.256725927539607 msec\nrounds: 69"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 90819.02730741604,
            "unit": "iter/sec",
            "range": "stddev: 9.525691538046902e-7",
            "extra": "mean: 11.010908502852272 usec\nrounds: 92593"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
            "value": 27503.318618899484,
            "unit": "iter/sec",
            "range": "stddev: 0.0000018674821239267122",
            "extra": "mean: 36.359248636738286 usec\nrounds: 28053"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
            "value": 6209.5591727528135,
            "unit": "iter/sec",
            "range": "stddev: 0.000005252984974251919",
            "extra": "mean: 161.04202765116437 usec\nrounds: 6365"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 26.12706805880355,
            "unit": "iter/sec",
            "range": "stddev: 0.0005470514850684546",
            "extra": "mean: 38.27448214814324 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 26.448632007150916,
            "unit": "iter/sec",
            "range": "stddev: 0.0008453908896254394",
            "extra": "mean: 37.80913885185555 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 26.24264291515343,
            "unit": "iter/sec",
            "range": "stddev: 0.000483754964840099",
            "extra": "mean: 38.10591803703448 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 2981.1856774859225,
            "unit": "iter/sec",
            "range": "stddev: 0.000011329275186699504",
            "extra": "mean: 335.43700667558375 usec\nrounds: 3146"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 2717.7063381357348,
            "unit": "iter/sec",
            "range": "stddev: 0.000010494285755147158",
            "extra": "mean: 367.9573418097741 usec\nrounds: 3382"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 2010.447034093581,
            "unit": "iter/sec",
            "range": "stddev: 0.000016646255118816246",
            "extra": "mean: 497.40181314990696 usec\nrounds: 2114"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 96.10492400322619,
            "unit": "iter/sec",
            "range": "stddev: 0.00021038820525391995",
            "extra": "mean: 10.405294113404954 msec\nrounds: 97"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 94.95401428288568,
            "unit": "iter/sec",
            "range": "stddev: 0.00016070357301471906",
            "extra": "mean: 10.53141362745143 msec\nrounds: 102"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 97.3206795532768,
            "unit": "iter/sec",
            "range": "stddev: 0.00014978420055588058",
            "extra": "mean: 10.275308439996707 msec\nrounds: 100"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 26.849520055383522,
            "unit": "iter/sec",
            "range": "stddev: 0.0005716069986890273",
            "extra": "mean: 37.24461360714315 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 26.72480691679576,
            "unit": "iter/sec",
            "range": "stddev: 0.0006659577780568591",
            "extra": "mean: 37.41841814286521 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 7027.462730448782,
            "unit": "iter/sec",
            "range": "stddev: 0.000011418175793803937",
            "extra": "mean: 142.2988692159366 usec\nrounds: 7348"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 1041787.5064003222,
            "unit": "iter/sec",
            "range": "stddev: 1.0426250200958927e-7",
            "extra": "mean: 959.8886470190929 nsec\nrounds: 107910"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3584339.815490931,
            "unit": "iter/sec",
            "range": "stddev: 5.349445666874956e-8",
            "extra": "mean: 278.9914046871793 nsec\nrounds: 192308"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1639489.0231607454,
            "unit": "iter/sec",
            "range": "stddev: 6.694381428751147e-8",
            "extra": "mean: 609.9461392380143 nsec\nrounds: 168891"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 149267.4051129389,
            "unit": "iter/sec",
            "range": "stddev: 8.730170719121938e-7",
            "extra": "mean: 6.6993862407092735 usec\nrounds: 155473"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 1121.703452809425,
            "unit": "iter/sec",
            "range": "stddev: 0.00002078391811192891",
            "extra": "mean: 891.5012229795622 usec\nrounds: 1175"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 118.45469937983775,
            "unit": "iter/sec",
            "range": "stddev: 0.00013038848764068098",
            "extra": "mean: 8.442045822035244 msec\nrounds: 118"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 18.242313569016193,
            "unit": "iter/sec",
            "range": "stddev: 0.00013417508957260267",
            "extra": "mean: 54.81760831578173 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 110.31639990347804,
            "unit": "iter/sec",
            "range": "stddev: 0.0009302147730731278",
            "extra": "mean: 9.064835336132756 msec\nrounds: 119"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 106.08818940277898,
            "unit": "iter/sec",
            "range": "stddev: 0.00019083565149152304",
            "extra": "mean: 9.42611996330107 msec\nrounds: 109"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 115.93336669076336,
            "unit": "iter/sec",
            "range": "stddev: 0.00009454613269333962",
            "extra": "mean: 8.625644441667646 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 158.1500787762811,
            "unit": "iter/sec",
            "range": "stddev: 0.00010354108730430291",
            "extra": "mean: 6.323107820986917 msec\nrounds: 162"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 1172.7060933297382,
            "unit": "iter/sec",
            "range": "stddev: 0.00002442139247605363",
            "extra": "mean: 852.7285785312474 usec\nrounds: 1388"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 120.74652011120885,
            "unit": "iter/sec",
            "range": "stddev: 0.000057762563183419835",
            "extra": "mean: 8.281812172135389 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 116.53172703401329,
            "unit": "iter/sec",
            "range": "stddev: 0.00009949077110326824",
            "extra": "mean: 8.58135398360757 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 28581.105934216674,
            "unit": "iter/sec",
            "range": "stddev: 0.000002296989884301118",
            "extra": "mean: 34.988149244526674 usec\nrounds: 29254"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 48.48964462275922,
            "unit": "iter/sec",
            "range": "stddev: 0.015331031823251134",
            "extra": "mean: 20.622959969697064 msec\nrounds: 66"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 3.169124748892769,
            "unit": "iter/sec",
            "range": "stddev: 0.0019096194645301487",
            "extra": "mean: 315.54453649998493 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.2325060094702525,
            "unit": "iter/sec",
            "range": "stddev: 0.007280016187950694",
            "extra": "mean: 811.3550703333393 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.12535713343176416,
            "unit": "iter/sec",
            "range": "stddev: 0.3826016466218476",
            "extra": "mean: 7.97720857699998 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.2327715060886282,
            "unit": "iter/sec",
            "range": "stddev: 0.017328974200362494",
            "extra": "mean: 811.180332333303 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 2.9206995320720153,
            "unit": "iter/sec",
            "range": "stddev: 0.003666732594917747",
            "extra": "mean: 342.3837299999756 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 1.0233188852372426,
            "unit": "iter/sec",
            "range": "stddev: 0.004844003754437089",
            "extra": "mean: 977.212494000014 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 2.3379210040279865,
            "unit": "iter/sec",
            "range": "stddev: 0.002811598600429139",
            "extra": "mean: 427.73044866661775 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 3.0811256493553274,
            "unit": "iter/sec",
            "range": "stddev: 0.0016743498108532924",
            "extra": "mean: 324.5567087500092 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.2565578144992313,
            "unit": "iter/sec",
            "range": "stddev: 0.0010653416241797658",
            "extra": "mean: 795.8249023333034 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.2546160345444235,
            "unit": "iter/sec",
            "range": "stddev: 0.0026326934594422006",
            "extra": "mean: 797.0566073333506 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 11425.045512475137,
            "unit": "iter/sec",
            "range": "stddev: 0.0000033094925518675765",
            "extra": "mean: 87.52700362620774 usec\nrounds: 11584"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 286.7750411632844,
            "unit": "iter/sec",
            "range": "stddev: 0.00006251936215852904",
            "extra": "mean: 3.4870538103440407 msec\nrounds: 290"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 26.959872998476555,
            "unit": "iter/sec",
            "range": "stddev: 0.0013862750822541785",
            "extra": "mean: 37.09216286206199 msec\nrounds: 29"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 16.85337227276299,
            "unit": "iter/sec",
            "range": "stddev: 0.00196542211449194",
            "extra": "mean: 59.33530594444392 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.476143523909337,
            "unit": "iter/sec",
            "range": "stddev: 0.0023112471742579867",
            "extra": "mean: 182.61026133334704 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 17.216708064531034,
            "unit": "iter/sec",
            "range": "stddev: 0.001490458233681617",
            "extra": "mean: 58.083112999990284 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 20.96178974414957,
            "unit": "iter/sec",
            "range": "stddev: 0.001924876846423028",
            "extra": "mean: 47.705850130430754 msec\nrounds: 23"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 17.37419263140102,
            "unit": "iter/sec",
            "range": "stddev: 0.001618757056242537",
            "extra": "mean: 57.5566313333411 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 17.035504681468197,
            "unit": "iter/sec",
            "range": "stddev: 0.0014939127400486671",
            "extra": "mean: 58.700931888905764 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 27.803040624486222,
            "unit": "iter/sec",
            "range": "stddev: 0.0013291287192562222",
            "extra": "mean: 35.96728910000214 msec\nrounds: 30"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 17.253945405056218,
            "unit": "iter/sec",
            "range": "stddev: 0.0013671328147907714",
            "extra": "mean: 57.95775844445138 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 17.268900512283196,
            "unit": "iter/sec",
            "range": "stddev: 0.0015039211111528945",
            "extra": "mean: 57.90756622222185 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 21637.316567972128,
            "unit": "iter/sec",
            "range": "stddev: 0.0000024276471769331757",
            "extra": "mean: 46.2164518811087 usec\nrounds: 22112"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 46.80937152255466,
            "unit": "iter/sec",
            "range": "stddev: 0.013666732479257069",
            "extra": "mean: 21.363243459018868 msec\nrounds: 61"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 173.44515661710764,
            "unit": "iter/sec",
            "range": "stddev: 0.000027747107416196706",
            "extra": "mean: 5.7655112400029145 msec\nrounds: 175"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.610891589390125,
            "unit": "iter/sec",
            "range": "stddev: 0.00010577967867208984",
            "extra": "mean: 68.44209293334038 msec\nrounds: 15"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
            "value": 1.136800119381612,
            "unit": "iter/sec",
            "range": "stddev: 0.00855154736916811",
            "extra": "mean: 879.6621173333202 msec\nrounds: 3"
          }
        ]
      }
    ]
  }
}