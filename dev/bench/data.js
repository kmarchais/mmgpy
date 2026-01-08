window.BENCHMARK_DATA = {
  "lastUpdate": 1767889695723,
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
          "id": "c80fbfe8e51a8b9c747f6d5eb2ff931061cde8be",
          "message": "refactor(tests): split mesh_test.py into focused test modules (#133)\n\n* refactor(tests): split mesh_test.py into focused test modules\n\nSplit the 2062-line tests/mesh_test.py into smaller, more maintainable files:\n\n- conftest.py (241 lines): Shared fixtures for mesh creation\n- mesh_3d_test.py (650 lines): MmgMesh3D construction, operations, remeshing\n- mesh_2d_test.py (231 lines): MmgMesh2D construction and operations\n- mesh_surface_test.py (169 lines): MmgMeshS construction and operations\n- levelset_test.py (270 lines): Level-set discretization tests\n- topology_test.py (361 lines): Topology queries and element attributes\n- quality_test.py (205 lines): Quality computation and C-contiguity tests\n\nBenefits:\n- Easier navigation and maintenance\n- Better test organization by functionality\n- Improved contributor experience\n- Parallel test execution benefits from file-level splitting\n\nAll 84 tests pass (3 skipped for optional ELAS feature).\n\nCloses #107\n\n* ci: add Codecov Test Analytics for test performance tracking\n\nEnable Codecov Test Analytics to track:\n- Test run times and failure rates across branches\n- Flaky test detection on main branch\n- PR failure diagnostics with stack traces\n\nChanges:\n- Generate JUnit XML output with `--junitxml=junit.xml`\n- Add codecov/test-results-action to upload test results\n- Upload runs on all matrix jobs (not just coverage upload)\n\n* ci: add benchmark summary comment on PRs\n\nPost a formatted markdown comment with benchmark results on pull requests:\n- Groups results by benchmark category\n- Shows mean, stddev, min, max, and rounds\n- Auto-formats times (µs/ms/s based on magnitude)\n- Updates existing comment on re-runs to avoid spam\n\n* ci: only post benchmark comment on failures\n\nChange benchmark PR comments to only appear when tests fail:\n- No comment spam on successful benchmark runs\n- Shows only failed benchmarks with error messages\n- Includes collapsible stack traces for debugging\n- Updates existing failure comment on re-runs\n\n* revert: remove benchmark comment changes (will address in separate PR)",
          "timestamp": "2026-01-08T17:20:23+01:00",
          "tree_id": "e12c13928dbc7c04966e4c9f78dc51a49559393a",
          "url": "https://github.com/kmarchais/mmgpy/commit/c80fbfe8e51a8b9c747f6d5eb2ff931061cde8be"
        },
        "date": 1767889694728,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 0.6598551631457067,
            "unit": "iter/sec",
            "range": "stddev: 0.017755641771576236",
            "extra": "mean: 1.5154840878000129 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.6611713166725728,
            "unit": "iter/sec",
            "range": "stddev: 0.010447895394921474",
            "extra": "mean: 1.512467305799993 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.222046531552456,
            "unit": "iter/sec",
            "range": "stddev: 0.0022980112522683945",
            "extra": "mean: 818.2994461999954 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.2884158163404396,
            "unit": "iter/sec",
            "range": "stddev: 0.004909892301362113",
            "extra": "mean: 776.1469452000028 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 0.6553530431931947,
            "unit": "iter/sec",
            "range": "stddev: 0.013818395105934217",
            "extra": "mean: 1.5258951040000057 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.6595272113522916,
            "unit": "iter/sec",
            "range": "stddev: 0.01837240961338021",
            "extra": "mean: 1.5162376665999944 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.2954394310032906,
            "unit": "iter/sec",
            "range": "stddev: 0.002381950212139351",
            "extra": "mean: 771.9388310000113 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.289959427938078,
            "unit": "iter/sec",
            "range": "stddev: 0.0042042182329589265",
            "extra": "mean: 775.2181800000017 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 1.4209664437716956,
            "unit": "iter/sec",
            "range": "stddev: 0.0018356786981068233",
            "extra": "mean: 703.7463864000074 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.410432819635031,
            "unit": "iter/sec",
            "range": "stddev: 0.0019678886624427245",
            "extra": "mean: 709.0022197999929 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 121.61996656078252,
            "unit": "iter/sec",
            "range": "stddev: 0.0000505289337906947",
            "extra": "mean: 8.22233411403074 msec\nrounds: 114"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 1.32992866665067,
            "unit": "iter/sec",
            "range": "stddev: 0.0017001873300165967",
            "extra": "mean: 751.9200278000085 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 1.3152928135797315,
            "unit": "iter/sec",
            "range": "stddev: 0.001510928857242128",
            "extra": "mean: 760.2869791999979 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 18.028489501559676,
            "unit": "iter/sec",
            "range": "stddev: 0.0010081151646092292",
            "extra": "mean: 55.46776394736167 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 375.18530660704204,
            "unit": "iter/sec",
            "range": "stddev: 0.00018355050291914813",
            "extra": "mean: 2.6653495816331914 msec\nrounds: 392"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 24.507283107235672,
            "unit": "iter/sec",
            "range": "stddev: 0.00011966443325650982",
            "extra": "mean: 40.804196679996494 msec\nrounds: 25"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 167.40759477922276,
            "unit": "iter/sec",
            "range": "stddev: 0.00004568604234238835",
            "extra": "mean: 5.973444641617368 msec\nrounds: 173"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 243.93638816041812,
            "unit": "iter/sec",
            "range": "stddev: 0.000022203964193049205",
            "extra": "mean: 4.0994293944467906 msec\nrounds: 180"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 275.57606845654334,
            "unit": "iter/sec",
            "range": "stddev: 0.00009381083125953177",
            "extra": "mean: 3.62876212582913 msec\nrounds: 302"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 66.15407361891148,
            "unit": "iter/sec",
            "range": "stddev: 0.00005194908357561593",
            "extra": "mean: 15.116227093748158 msec\nrounds: 64"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 924.9182919415829,
            "unit": "iter/sec",
            "range": "stddev: 0.00001547135334025823",
            "extra": "mean: 1.0811765846913959 msec\nrounds: 614"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 26.97641387390859,
            "unit": "iter/sec",
            "range": "stddev: 0.00013644107023383747",
            "extra": "mean: 37.06941940741773 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 1969.6476466448664,
            "unit": "iter/sec",
            "range": "stddev: 0.000016760483136108217",
            "extra": "mean: 507.70502110030594 usec\nrounds: 1090"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 70.14398619715018,
            "unit": "iter/sec",
            "range": "stddev: 0.00006982686921609066",
            "extra": "mean: 14.256389666668646 msec\nrounds: 69"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 90758.79729645867,
            "unit": "iter/sec",
            "range": "stddev: 9.84576668421704e-7",
            "extra": "mean: 11.018215641769189 usec\nrounds: 45084"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_elements_3d",
            "value": 27432.146094711705,
            "unit": "iter/sec",
            "range": "stddev: 0.0000019332620816359597",
            "extra": "mean: 36.45358247026751 usec\nrounds: 20765"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_with_refs",
            "value": 85397.26822082055,
            "unit": "iter/sec",
            "range": "stddev: 0.0000010603061906610824",
            "extra": "mean: 11.70997645280873 usec\nrounds: 38391"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 27.064421096468003,
            "unit": "iter/sec",
            "range": "stddev: 0.00007756588619624853",
            "extra": "mean: 36.94887824999528 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 27.01784007471514,
            "unit": "iter/sec",
            "range": "stddev: 0.00011213639528071244",
            "extra": "mean: 37.012581214286556 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 27.886099505427204,
            "unit": "iter/sec",
            "range": "stddev: 0.00008990162706882077",
            "extra": "mean: 35.86016035714782 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 3089.9477088523895,
            "unit": "iter/sec",
            "range": "stddev: 0.000007632424784344966",
            "extra": "mean: 323.6300721643608 usec\nrounds: 1358"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 2774.996130324399,
            "unit": "iter/sec",
            "range": "stddev: 0.000007297876349615077",
            "extra": "mean: 360.3608628755455 usec\nrounds: 2567"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 2091.7257562781374,
            "unit": "iter/sec",
            "range": "stddev: 0.000008233883603125014",
            "extra": "mean: 478.07414380139693 usec\nrounds: 1815"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 103.72564965013885,
            "unit": "iter/sec",
            "range": "stddev: 0.00004433189649101243",
            "extra": "mean: 9.640816937497595 msec\nrounds: 96"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 103.14382197474377,
            "unit": "iter/sec",
            "range": "stddev: 0.000039937714910980276",
            "extra": "mean: 9.695200166664991 msec\nrounds: 102"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 101.67111266817811,
            "unit": "iter/sec",
            "range": "stddev: 0.00004322755955254503",
            "extra": "mean: 9.835635449999245 msec\nrounds: 100"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 27.61580029023816,
            "unit": "iter/sec",
            "range": "stddev: 0.0002176517489357618",
            "extra": "mean: 36.21115410345315 msec\nrounds: 29"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 27.643919283864527,
            "unit": "iter/sec",
            "range": "stddev: 0.0001451867937036657",
            "extra": "mean: 36.174320642865204 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 7112.3157692209015,
            "unit": "iter/sec",
            "range": "stddev: 0.000004590425642838404",
            "extra": "mean: 140.60118145029185 usec\nrounds: 2221"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 923812.0773814454,
            "unit": "iter/sec",
            "range": "stddev: 2.813692486615561e-7",
            "extra": "mean: 1.0824712346633418 usec\nrounds: 173281"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3442064.5683684163,
            "unit": "iter/sec",
            "range": "stddev: 4.2935183632357154e-8",
            "extra": "mean: 290.52331242990397 nsec\nrounds: 162023"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1367125.1069802418,
            "unit": "iter/sec",
            "range": "stddev: 1.6154305650714107e-7",
            "extra": "mean: 731.4619524535235 nsec\nrounds: 2786"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 168341.51888707516,
            "unit": "iter/sec",
            "range": "stddev: 7.970901262000267e-7",
            "extra": "mean: 5.940305199876496 usec\nrounds: 52618"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 1140.6565173484346,
            "unit": "iter/sec",
            "range": "stddev: 0.000016925471158282523",
            "extra": "mean: 876.6881044300662 usec\nrounds: 632"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 120.57566878010735,
            "unit": "iter/sec",
            "range": "stddev: 0.00004974505287327071",
            "extra": "mean: 8.293547198346378 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 18.400638753963843,
            "unit": "iter/sec",
            "range": "stddev: 0.0004779502113293938",
            "extra": "mean: 54.34593947368165 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 120.40468327097416,
            "unit": "iter/sec",
            "range": "stddev: 0.000038227391294929094",
            "extra": "mean: 8.305324783334811 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 110.87442296328648,
            "unit": "iter/sec",
            "range": "stddev: 0.000029431358051785517",
            "extra": "mean: 9.019212666668192 msec\nrounds: 111"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 120.46593041582439,
            "unit": "iter/sec",
            "range": "stddev: 0.00003315373166661252",
            "extra": "mean: 8.301102200001273 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 160.72556848514466,
            "unit": "iter/sec",
            "range": "stddev: 0.00033153240901778",
            "extra": "mean: 6.221785428573094 msec\nrounds: 161"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 1170.3524002970437,
            "unit": "iter/sec",
            "range": "stddev: 0.000014367359019211117",
            "extra": "mean: 854.4434990231941 usec\nrounds: 1024"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 120.54543305672505,
            "unit": "iter/sec",
            "range": "stddev: 0.0000385331128909836",
            "extra": "mean: 8.295627421483733 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 120.47836779280449,
            "unit": "iter/sec",
            "range": "stddev: 0.00005593882668817963",
            "extra": "mean: 8.300245250000177 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 27948.16306482374,
            "unit": "iter/sec",
            "range": "stddev: 0.0000018773930252792191",
            "extra": "mean: 35.78052688760161 usec\nrounds: 25495"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 4.603453667458834,
            "unit": "iter/sec",
            "range": "stddev: 0.0005827592701467507",
            "extra": "mean: 217.22820999999612 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 3.443593543805216,
            "unit": "iter/sec",
            "range": "stddev: 0.00020648303725481583",
            "extra": "mean: 290.3943184000127 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.287741607165256,
            "unit": "iter/sec",
            "range": "stddev: 0.0004260298522590414",
            "extra": "mean: 776.5533042000015 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.1417040485914561,
            "unit": "iter/sec",
            "range": "stddev: 0.2836957258211915",
            "extra": "mean: 7.056961392000017 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.289444317991638,
            "unit": "iter/sec",
            "range": "stddev: 0.0021743287808805183",
            "extra": "mean: 775.5278658000066 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 3.1486267064053113,
            "unit": "iter/sec",
            "range": "stddev: 0.00044561071383824046",
            "extra": "mean: 317.59877979999374 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 1.038835620363578,
            "unit": "iter/sec",
            "range": "stddev: 0.0042383301519144725",
            "extra": "mean: 962.6162025999975 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 2.4598635345540334,
            "unit": "iter/sec",
            "range": "stddev: 0.0007874979934057714",
            "extra": "mean: 406.52661660001286 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 3.3375448499026366,
            "unit": "iter/sec",
            "range": "stddev: 0.0003265813257519451",
            "extra": "mean: 299.62144180000223 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.2849344687506945,
            "unit": "iter/sec",
            "range": "stddev: 0.002197456921737401",
            "extra": "mean: 778.2498052000051 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.2851479931088796,
            "unit": "iter/sec",
            "range": "stddev: 0.001367373196080346",
            "extra": "mean: 778.1205008000029 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 11388.878795618888,
            "unit": "iter/sec",
            "range": "stddev: 0.0000034280164310646896",
            "extra": "mean: 87.80495586489894 usec\nrounds: 10196"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 3.988426311143441,
            "unit": "iter/sec",
            "range": "stddev: 0.0014063558150793467",
            "extra": "mean: 250.72545459998992 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 28.79194708699822,
            "unit": "iter/sec",
            "range": "stddev: 0.001102291368615983",
            "extra": "mean: 34.731933793097895 msec\nrounds: 29"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 17.682897097800264,
            "unit": "iter/sec",
            "range": "stddev: 0.0011157439857787837",
            "extra": "mean: 56.551819222224566 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.5639362138706066,
            "unit": "iter/sec",
            "range": "stddev: 0.0015521971086531975",
            "extra": "mean: 179.7288756666641 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 17.52683620551898,
            "unit": "iter/sec",
            "range": "stddev: 0.0012067857477052163",
            "extra": "mean: 57.055362888888794 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 21.424965495581972,
            "unit": "iter/sec",
            "range": "stddev: 0.0016139627201183517",
            "extra": "mean: 46.67452090908662 msec\nrounds: 22"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 17.84153415204986,
            "unit": "iter/sec",
            "range": "stddev: 0.0010690225621646495",
            "extra": "mean: 56.048991722222915 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 17.415877125988622,
            "unit": "iter/sec",
            "range": "stddev: 0.0011043675346599515",
            "extra": "mean: 57.418870882349225 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 28.809949324705016,
            "unit": "iter/sec",
            "range": "stddev: 0.001056502813249889",
            "extra": "mean: 34.71023113332876 msec\nrounds: 30"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 17.661344115140334,
            "unit": "iter/sec",
            "range": "stddev: 0.0010240705828345432",
            "extra": "mean: 56.62083211111558 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 17.698251258211528,
            "unit": "iter/sec",
            "range": "stddev: 0.001091621350940169",
            "extra": "mean: 56.50275755555375 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 21505.66808628114,
            "unit": "iter/sec",
            "range": "stddev: 0.0000024704170428632234",
            "extra": "mean: 46.4993691889962 usec\nrounds: 17812"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 25.976015320343787,
            "unit": "iter/sec",
            "range": "stddev: 0.011875207899574655",
            "extra": "mean: 38.49705151724422 msec\nrounds: 29"
          }
        ]
      }
    ]
  }
}