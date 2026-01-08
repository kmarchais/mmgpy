window.BENCHMARK_DATA = {
  "lastUpdate": 1767834995163,
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
          "id": "5894bd72273c650787dacfb67486935f64cc28ef",
          "message": "feat: add test coverage reporting with pytest-cov (#131)\n\nIntegrate pytest-cov for test coverage tracking:\n- Add pytest-cov to dev dependencies\n- Configure coverage.run and coverage.report settings with 70% threshold\n- Exclude TYPE_CHECKING blocks, NotImplementedError, and @overload from coverage\n- Integrate Codecov action in CI workflow (ubuntu-latest, Python 3.13)\n- Add coverage badge to README\n- Add coverage files to .gitignore\n\nExclude platform-specific and CLI wrapper code from coverage measurement:\n- Windows DLL handling (only runs on Windows)\n- CLI wrappers (_run_mmg*) - entry points for executables\n- RPATH fixing functions (platform-specific post-install utilities)\n\nCoverage is run explicitly in CI (not via pytest addopts) to avoid\nfailing benchmarks with the coverage threshold.\n\nCloses #106",
          "timestamp": "2026-01-08T02:08:59+01:00",
          "tree_id": "2c33967d8e15432aebc9105d3dd238abf4dd2b89",
          "url": "https://github.com/kmarchais/mmgpy/commit/5894bd72273c650787dacfb67486935f64cc28ef"
        },
        "date": 1767834994096,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 0.5250485322257675,
            "unit": "iter/sec",
            "range": "stddev: 0.01089042472637446",
            "extra": "mean: 1.9045858404 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.503145357453617,
            "unit": "iter/sec",
            "range": "stddev: 0.012788027891835797",
            "extra": "mean: 1.9874972215999946 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 0.8285881442293062,
            "unit": "iter/sec",
            "range": "stddev: 0.014579113826314336",
            "extra": "mean: 1.2068722041999878 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 0.865225940467944,
            "unit": "iter/sec",
            "range": "stddev: 0.0023736238443661196",
            "extra": "mean: 1.1557674743999997 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 0.5199805765623456,
            "unit": "iter/sec",
            "range": "stddev: 0.017580246581984586",
            "extra": "mean: 1.9231487580000022 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.5149860249354783,
            "unit": "iter/sec",
            "range": "stddev: 0.009432440345467813",
            "extra": "mean: 1.9418002656 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 0.866201010019794,
            "unit": "iter/sec",
            "range": "stddev: 0.003977612320463119",
            "extra": "mean: 1.1544664441999999 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 0.8600879645023206,
            "unit": "iter/sec",
            "range": "stddev: 0.007772022304079401",
            "extra": "mean: 1.1626717745999826 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 1.2748223154887364,
            "unit": "iter/sec",
            "range": "stddev: 0.011139780492608997",
            "extra": "mean: 784.4230430000152 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.2823099558627342,
            "unit": "iter/sec",
            "range": "stddev: 0.007485631891751311",
            "extra": "mean: 779.8426545999973 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 116.87904326582188,
            "unit": "iter/sec",
            "range": "stddev: 0.0002724314220505462",
            "extra": "mean: 8.55585374467574 msec\nrounds: 94"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 1.1447716191403683,
            "unit": "iter/sec",
            "range": "stddev: 0.010289711159680064",
            "extra": "mean: 873.5366803999909 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 1.1380515281763246,
            "unit": "iter/sec",
            "range": "stddev: 0.005108442041924502",
            "extra": "mean: 878.6948351999968 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 9.36486109216779,
            "unit": "iter/sec",
            "range": "stddev: 0.00229691239578904",
            "extra": "mean: 106.78214979999439 msec\nrounds: 10"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 415.9757820410253,
            "unit": "iter/sec",
            "range": "stddev: 0.00010988699856102057",
            "extra": "mean: 2.4039861048963083 msec\nrounds: 429"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 8.421847929826761,
            "unit": "iter/sec",
            "range": "stddev: 0.001130169439965068",
            "extra": "mean: 118.73878611111068 msec\nrounds: 9"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 249.34680023104625,
            "unit": "iter/sec",
            "range": "stddev: 0.00011030985527583348",
            "extra": "mean: 4.010478574713588 msec\nrounds: 261"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 223.00907679545276,
            "unit": "iter/sec",
            "range": "stddev: 0.000189978477404468",
            "extra": "mean: 4.484122414968853 msec\nrounds: 147"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 298.51351538215494,
            "unit": "iter/sec",
            "range": "stddev: 0.00016937684448512058",
            "extra": "mean: 3.3499320750010497 msec\nrounds: 320"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 28.37350300536194,
            "unit": "iter/sec",
            "range": "stddev: 0.0004862288749282951",
            "extra": "mean: 35.24415014286473 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 1040.9276197107365,
            "unit": "iter/sec",
            "range": "stddev: 0.000031734892492956585",
            "extra": "mean: 960.6815892519887 usec\nrounds: 521"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 8.268606148473793,
            "unit": "iter/sec",
            "range": "stddev: 0.00112301903411033",
            "extra": "mean: 120.9393677777939 msec\nrounds: 9"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 2148.9613849025063,
            "unit": "iter/sec",
            "range": "stddev: 0.000017140297291527417",
            "extra": "mean: 465.3410745420946 usec\nrounds: 872"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 31.213268962736855,
            "unit": "iter/sec",
            "range": "stddev: 0.000381098046651005",
            "extra": "mean: 32.03765684375526 msec\nrounds: 32"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 94944.42680931224,
            "unit": "iter/sec",
            "range": "stddev: 0.0000010057556200959035",
            "extra": "mean: 10.532477087974994 usec\nrounds: 26733"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_elements_3d",
            "value": 27264.532636078347,
            "unit": "iter/sec",
            "range": "stddev: 0.000002221131732363313",
            "extra": "mean: 36.67768721172684 usec\nrounds: 10400"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_with_refs",
            "value": 83000.31182968174,
            "unit": "iter/sec",
            "range": "stddev: 7.472870134800726e-7",
            "extra": "mean: 12.048147506385511 usec\nrounds: 21816"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 8.512309020636827,
            "unit": "iter/sec",
            "range": "stddev: 0.0010523954334928593",
            "extra": "mean: 117.47693811111048 msec\nrounds: 9"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 8.549811691680254,
            "unit": "iter/sec",
            "range": "stddev: 0.00111941744196688",
            "extra": "mean: 116.96164033332934 msec\nrounds: 9"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 8.360240053777257,
            "unit": "iter/sec",
            "range": "stddev: 0.0011497062819120125",
            "extra": "mean: 119.61379022223026 msec\nrounds: 9"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 1356.969571353321,
            "unit": "iter/sec",
            "range": "stddev: 0.000006885789023666516",
            "extra": "mean: 736.9362004209783 usec\nrounds: 474"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 1298.5480146265377,
            "unit": "iter/sec",
            "range": "stddev: 0.000017409512995157437",
            "extra": "mean: 770.0908928558948 usec\nrounds: 1232"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 1116.674835732294,
            "unit": "iter/sec",
            "range": "stddev: 0.0000328282386475407",
            "extra": "mean: 895.5158368409182 usec\nrounds: 570"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 35.477497968783354,
            "unit": "iter/sec",
            "range": "stddev: 0.00031841313710875266",
            "extra": "mean: 28.186880621623878 msec\nrounds: 37"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 35.499686657083544,
            "unit": "iter/sec",
            "range": "stddev: 0.00025285723621914136",
            "extra": "mean: 28.169262722223547 msec\nrounds: 36"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 35.45649783973957,
            "unit": "iter/sec",
            "range": "stddev: 0.00040658821333610225",
            "extra": "mean: 28.203575111109874 msec\nrounds: 36"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 8.457483736374055,
            "unit": "iter/sec",
            "range": "stddev: 0.0012478084642625028",
            "extra": "mean: 118.23847744444214 msec\nrounds: 9"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 8.677214242226672,
            "unit": "iter/sec",
            "range": "stddev: 0.0009522848575762693",
            "extra": "mean: 115.24435977777456 msec\nrounds: 9"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 3722.994132053362,
            "unit": "iter/sec",
            "range": "stddev: 0.00000835782341381317",
            "extra": "mean: 268.60101427247344 usec\nrounds: 1051"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 977051.5620041268,
            "unit": "iter/sec",
            "range": "stddev: 1.8154520848369289e-7",
            "extra": "mean: 1.0234874380107446 usec\nrounds: 73476"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 2230762.5305420747,
            "unit": "iter/sec",
            "range": "stddev: 4.7468221310118295e-7",
            "extra": "mean: 448.27720849202194 nsec\nrounds: 158379"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1436882.4135715785,
            "unit": "iter/sec",
            "range": "stddev: 1.4744511766428676e-7",
            "extra": "mean: 695.951172173063 nsec\nrounds: 3072"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 137980.39873761387,
            "unit": "iter/sec",
            "range": "stddev: 5.847364840569375e-7",
            "extra": "mean: 7.247406219644421 usec\nrounds: 38265"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 733.8411972747024,
            "unit": "iter/sec",
            "range": "stddev: 0.0000240073708239446",
            "extra": "mean: 1.362692642105326 msec\nrounds: 285"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 117.9981186835948,
            "unit": "iter/sec",
            "range": "stddev: 0.00027553491128723184",
            "extra": "mean: 8.474711386555601 msec\nrounds: 119"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 18.98340246383121,
            "unit": "iter/sec",
            "range": "stddev: 0.0001372605136086897",
            "extra": "mean: 52.67759569999555 msec\nrounds: 20"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 118.72626032653129,
            "unit": "iter/sec",
            "range": "stddev: 0.00022572814909515798",
            "extra": "mean: 8.422736446424851 msec\nrounds: 112"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 109.21097773280324,
            "unit": "iter/sec",
            "range": "stddev: 0.000241521711726327",
            "extra": "mean: 9.156588657658672 msec\nrounds: 111"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 120.20870232658757,
            "unit": "iter/sec",
            "range": "stddev: 0.0002011277336201871",
            "extra": "mean: 8.318865278847799 msec\nrounds: 104"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 150.71549225924372,
            "unit": "iter/sec",
            "range": "stddev: 0.00013193047867604533",
            "extra": "mean: 6.635017973334243 msec\nrounds: 150"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 747.2073387887726,
            "unit": "iter/sec",
            "range": "stddev: 0.00001614887801543389",
            "extra": "mean: 1.3383166198835865 msec\nrounds: 684"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 120.9528391207759,
            "unit": "iter/sec",
            "range": "stddev: 0.00016487884019612394",
            "extra": "mean: 8.267685217388431 msec\nrounds: 115"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 118.12427176873766,
            "unit": "iter/sec",
            "range": "stddev: 0.00032744618145713676",
            "extra": "mean: 8.465660655735414 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 28884.596470333934,
            "unit": "iter/sec",
            "range": "stddev: 0.0000017601736070984928",
            "extra": "mean: 34.62052866229428 usec\nrounds: 19381"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 5.052794829110749,
            "unit": "iter/sec",
            "range": "stddev: 0.0009080544036499783",
            "extra": "mean: 197.91027219998796 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 1.34803843359269,
            "unit": "iter/sec",
            "range": "stddev: 0.0027174769029378793",
            "extra": "mean: 741.8186122000066 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 0.8871235760568812,
            "unit": "iter/sec",
            "range": "stddev: 0.004538549692385292",
            "extra": "mean: 1.127238669999997 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.10031786740532823,
            "unit": "iter/sec",
            "range": "stddev: 0.06706589999893817",
            "extra": "mean: 9.968313978999982 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 0.8892772905869025,
            "unit": "iter/sec",
            "range": "stddev: 0.0011623573248374164",
            "extra": "mean: 1.1245086437999816 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 1.2960585803838152,
            "unit": "iter/sec",
            "range": "stddev: 0.002353756545039781",
            "extra": "mean: 771.5700625999943 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 0.7899806321617464,
            "unit": "iter/sec",
            "range": "stddev: 0.020284928070756904",
            "extra": "mean: 1.2658538188000192 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 1.2129763889987386,
            "unit": "iter/sec",
            "range": "stddev: 0.002590969903064844",
            "extra": "mean: 824.418355600028 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 1.3392580792930862,
            "unit": "iter/sec",
            "range": "stddev: 0.004010749719529125",
            "extra": "mean: 746.6820738000251 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 0.8847686714002376,
            "unit": "iter/sec",
            "range": "stddev: 0.002220050017751907",
            "extra": "mean: 1.130238933999999 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 0.8798597704274953,
            "unit": "iter/sec",
            "range": "stddev: 0.009694194324529042",
            "extra": "mean: 1.136544746799973 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 12883.94332688112,
            "unit": "iter/sec",
            "range": "stddev: 0.0000027430389515260373",
            "extra": "mean: 77.61598872556318 usec\nrounds: 8958"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 4.454530011176051,
            "unit": "iter/sec",
            "range": "stddev: 0.00045495452432988396",
            "extra": "mean: 224.49057419999008 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 11.512380848478012,
            "unit": "iter/sec",
            "range": "stddev: 0.0017614220591555677",
            "extra": "mean: 86.86300541666014 msec\nrounds: 12"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 9.493165170744387,
            "unit": "iter/sec",
            "range": "stddev: 0.0015006339771196663",
            "extra": "mean: 105.33894460003239 msec\nrounds: 10"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 4.64645717439814,
            "unit": "iter/sec",
            "range": "stddev: 0.0018994838352089857",
            "extra": "mean: 215.21773740000754 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 9.442597492833626,
            "unit": "iter/sec",
            "range": "stddev: 0.00176458397762273",
            "extra": "mean: 105.90306330000203 msec\nrounds: 10"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 12.94751655173626,
            "unit": "iter/sec",
            "range": "stddev: 0.0033266354608172673",
            "extra": "mean: 77.23488871430716 msec\nrounds: 14"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 9.541182472327828,
            "unit": "iter/sec",
            "range": "stddev: 0.0020013491124359823",
            "extra": "mean: 104.80881200001022 msec\nrounds: 10"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 8.931873621999154,
            "unit": "iter/sec",
            "range": "stddev: 0.0015078575849277454",
            "extra": "mean: 111.95859259998997 msec\nrounds: 10"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 11.595700043469277,
            "unit": "iter/sec",
            "range": "stddev: 0.0016256653326245773",
            "extra": "mean: 86.23886408334631 msec\nrounds: 12"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 9.451558900097927,
            "unit": "iter/sec",
            "range": "stddev: 0.0011297258647379555",
            "extra": "mean: 105.80265229999668 msec\nrounds: 10"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 9.490329413168674,
            "unit": "iter/sec",
            "range": "stddev: 0.0016610327943920155",
            "extra": "mean: 105.37042039999278 msec\nrounds: 10"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 24303.372516655796,
            "unit": "iter/sec",
            "range": "stddev: 0.000001923570592361471",
            "extra": "mean: 41.146552780469925 usec\nrounds: 14655"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 23.70637280755086,
            "unit": "iter/sec",
            "range": "stddev: 0.02507681094145159",
            "extra": "mean: 42.182750103444086 msec\nrounds: 29"
          }
        ]
      }
    ]
  }
}