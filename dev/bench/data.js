window.BENCHMARK_DATA = {
  "lastUpdate": 1775034535534,
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
          "id": "79bbf2bbee28ffb12258b35c489c9e0dd22079de",
          "message": "feat: add set_local_parameters for region-specific mesh sizing (#210)\n\n* feat: add set_local_parameters for region-specific mesh sizing\n\nExpose MMG3D/MMG2D/MMGS_Set_localParameter as a batch Python API.\nset_local_parameters() accepts a list of dicts specifying entity type,\nreference, hmin, hmax, and hausd. Automatically sets numberOfLocalParam.\n\nPartial fix for #207 (priority 3: local parameters).\n\n* feat: add LocalParameter TypedDict for set_local_parameters type stubs",
          "timestamp": "2026-04-01T10:59:45+02:00",
          "tree_id": "e53e3e81cd151fd1ee71e1dfb167ea6e84088293",
          "url": "https://github.com/kmarchais/mmgpy/commit/79bbf2bbee28ffb12258b35c489c9e0dd22079de"
        },
        "date": 1775034534345,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 1.0757067424313942,
            "unit": "iter/sec",
            "range": "stddev: 0.003990183081363487",
            "extra": "mean: 929.6213926666704 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.5746813662594771,
            "unit": "iter/sec",
            "range": "stddev: 0.025381736375104578",
            "extra": "mean: 1.740094700666674 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.054499375210704,
            "unit": "iter/sec",
            "range": "stddev: 0.02482574220298564",
            "extra": "mean: 948.3172996666648 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.1031539793344909,
            "unit": "iter/sec",
            "range": "stddev: 0.011938455787055723",
            "extra": "mean: 906.4917669999962 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 1.072953519263357,
            "unit": "iter/sec",
            "range": "stddev: 0.002447183669377835",
            "extra": "mean: 932.0068223333257 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.5706142560840333,
            "unit": "iter/sec",
            "range": "stddev: 0.013300495669469855",
            "extra": "mean: 1.7524973996666706 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.1192734091308236,
            "unit": "iter/sec",
            "range": "stddev: 0.01458677548448217",
            "extra": "mean: 893.4367526666733 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.1371409333559799,
            "unit": "iter/sec",
            "range": "stddev: 0.0013500919924021232",
            "extra": "mean: 879.3984726666698 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 60.43128861046113,
            "unit": "iter/sec",
            "range": "stddev: 0.0005033585064275794",
            "extra": "mean: 16.547719285716042 msec\nrounds: 63"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.2660173406927033,
            "unit": "iter/sec",
            "range": "stddev: 0.013005775704712617",
            "extra": "mean: 789.8785963333239 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 116.03209924649961,
            "unit": "iter/sec",
            "range": "stddev: 0.0002578229028718342",
            "extra": "mean: 8.618304818183038 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 12.022078576900055,
            "unit": "iter/sec",
            "range": "stddev: 0.002106048580999038",
            "extra": "mean: 83.18029146153313 msec\nrounds: 13"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 1.1442734722514551,
            "unit": "iter/sec",
            "range": "stddev: 0.022026555537631783",
            "extra": "mean: 873.916964999997 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 12.760044442213957,
            "unit": "iter/sec",
            "range": "stddev: 0.0025752298829397925",
            "extra": "mean: 78.3696330000002 msec\nrounds: 14"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 398.5005326368386,
            "unit": "iter/sec",
            "range": "stddev: 0.00014556680104399488",
            "extra": "mean: 2.509406934497926 msec\nrounds: 458"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 14.297270319970558,
            "unit": "iter/sec",
            "range": "stddev: 0.001905236085252158",
            "extra": "mean: 69.94342120000283 msec\nrounds: 15"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 245.22843972559102,
            "unit": "iter/sec",
            "range": "stddev: 0.00026865936998894587",
            "extra": "mean: 4.0778304552236815 msec\nrounds: 268"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 215.20964218244356,
            "unit": "iter/sec",
            "range": "stddev: 0.0002806784060930261",
            "extra": "mean: 4.64663195319219 msec\nrounds: 235"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 288.1808274368174,
            "unit": "iter/sec",
            "range": "stddev: 0.00017413603183411675",
            "extra": "mean: 3.4700434754607197 msec\nrounds: 326"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 44.69095461894042,
            "unit": "iter/sec",
            "range": "stddev: 0.0010108455539986046",
            "extra": "mean: 22.37589258333254 msec\nrounds: 48"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 986.6768069766493,
            "unit": "iter/sec",
            "range": "stddev: 0.00003271191525839733",
            "extra": "mean: 1.0135030973963757 msec\nrounds: 1037"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 14.66359528010184,
            "unit": "iter/sec",
            "range": "stddev: 0.002396652003217068",
            "extra": "mean: 68.19609931249104 msec\nrounds: 16"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 1872.443502226645,
            "unit": "iter/sec",
            "range": "stddev: 0.000014866073843468515",
            "extra": "mean: 534.0615077628962 usec\nrounds: 1932"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 45.373879076266796,
            "unit": "iter/sec",
            "range": "stddev: 0.0007878445725853092",
            "extra": "mean: 22.039111937490457 msec\nrounds: 48"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 95153.21422463736,
            "unit": "iter/sec",
            "range": "stddev: 6.578547911804663e-7",
            "extra": "mean: 10.509366479614695 usec\nrounds: 100584"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
            "value": 26875.010638726817,
            "unit": "iter/sec",
            "range": "stddev: 0.0000020740808558094813",
            "extra": "mean: 37.2092875959276 usec\nrounds: 31586"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
            "value": 5574.3821518258965,
            "unit": "iter/sec",
            "range": "stddev: 0.000004643268163663958",
            "extra": "mean: 179.3920783978631 usec\nrounds: 5842"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 14.66037323965381,
            "unit": "iter/sec",
            "range": "stddev: 0.002970084138293068",
            "extra": "mean: 68.2110873749906 msec\nrounds: 16"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 14.824884411648497,
            "unit": "iter/sec",
            "range": "stddev: 0.0038846464893440855",
            "extra": "mean: 67.454151562508 msec\nrounds: 16"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 14.879000785228543,
            "unit": "iter/sec",
            "range": "stddev: 0.0026285483174221806",
            "extra": "mean: 67.20881424999803 msec\nrounds: 16"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 1432.030796109299,
            "unit": "iter/sec",
            "range": "stddev: 0.000037709400139232594",
            "extra": "mean: 698.3090047482998 usec\nrounds: 1474"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 1386.01539445422,
            "unit": "iter/sec",
            "range": "stddev: 0.000007749630878535032",
            "extra": "mean: 721.4927078019766 usec\nrounds: 1410"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 1205.4839459769387,
            "unit": "iter/sec",
            "range": "stddev: 0.00001820697498391214",
            "extra": "mean: 829.542362083958 usec\nrounds: 1229"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 59.984782469751224,
            "unit": "iter/sec",
            "range": "stddev: 0.0008151417358253628",
            "extra": "mean: 16.67089483077269 msec\nrounds: 65"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 60.73065097429633,
            "unit": "iter/sec",
            "range": "stddev: 0.00038975536611024155",
            "extra": "mean: 16.466149859372337 msec\nrounds: 64"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 59.03311836839383,
            "unit": "iter/sec",
            "range": "stddev: 0.00045018755530218786",
            "extra": "mean: 16.939643841267877 msec\nrounds: 63"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 15.149132620457369,
            "unit": "iter/sec",
            "range": "stddev: 0.0007392830301198818",
            "extra": "mean: 66.01037993750225 msec\nrounds: 16"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 14.979397252755225,
            "unit": "iter/sec",
            "range": "stddev: 0.0020825038138139814",
            "extra": "mean: 66.75836037501881 msec\nrounds: 16"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 3465.942918800842,
            "unit": "iter/sec",
            "range": "stddev: 0.000007940436049890313",
            "extra": "mean: 288.5217741398878 usec\nrounds: 3542"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 978714.9054644688,
            "unit": "iter/sec",
            "range": "stddev: 7.701408326442499e-8",
            "extra": "mean: 1.0217480028317643 usec\nrounds: 101369"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3388712.5524071422,
            "unit": "iter/sec",
            "range": "stddev: 3.000604324918679e-8",
            "extra": "mean: 295.09732222334964 nsec\nrounds: 194440"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1558726.1064758697,
            "unit": "iter/sec",
            "range": "stddev: 6.56752464777096e-8",
            "extra": "mean: 641.5495293531102 nsec\nrounds: 183790"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 137403.20326053165,
            "unit": "iter/sec",
            "range": "stddev: 5.913788097377459e-7",
            "extra": "mean: 7.277850707045669 usec\nrounds: 140529"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 670.679613937074,
            "unit": "iter/sec",
            "range": "stddev: 0.00002916383006902043",
            "extra": "mean: 1.4910248935847694 msec\nrounds: 686"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 113.63426055616557,
            "unit": "iter/sec",
            "range": "stddev: 0.00024525889093876085",
            "extra": "mean: 8.800162865544708 msec\nrounds: 119"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 19.18522547934576,
            "unit": "iter/sec",
            "range": "stddev: 0.00022378319548646252",
            "extra": "mean: 52.12344265000013 msec\nrounds: 20"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 111.94303849864707,
            "unit": "iter/sec",
            "range": "stddev: 0.0003262952176043874",
            "extra": "mean: 8.93311467521123 msec\nrounds: 117"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 105.15536850999547,
            "unit": "iter/sec",
            "range": "stddev: 0.00021103735066892382",
            "extra": "mean: 9.509737963639447 msec\nrounds: 110"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 113.32233285747455,
            "unit": "iter/sec",
            "range": "stddev: 0.0001910924731105167",
            "extra": "mean: 8.82438593333319 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 141.64380540337396,
            "unit": "iter/sec",
            "range": "stddev: 0.00034963775736055353",
            "extra": "mean: 7.059962821192178 msec\nrounds: 151"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 682.6518707499288,
            "unit": "iter/sec",
            "range": "stddev: 0.00002003894227383414",
            "extra": "mean: 1.464875499281131 msec\nrounds: 695"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 112.38497242240408,
            "unit": "iter/sec",
            "range": "stddev: 0.0008893781873262058",
            "extra": "mean: 8.897986789919333 msec\nrounds: 119"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 116.83106940039758,
            "unit": "iter/sec",
            "range": "stddev: 0.00017160239952183375",
            "extra": "mean: 8.559366999995953 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 29458.69757308521,
            "unit": "iter/sec",
            "range": "stddev: 0.000001536236120680294",
            "extra": "mean: 33.94583204227077 usec\nrounds: 30335"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 44.01554820079794,
            "unit": "iter/sec",
            "range": "stddev: 0.017826945646387128",
            "extra": "mean: 22.71924446875051 msec\nrounds: 64"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 1.962264335569101,
            "unit": "iter/sec",
            "range": "stddev: 0.007672872058344287",
            "extra": "mean: 509.61533666664616 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.1163763633694672,
            "unit": "iter/sec",
            "range": "stddev: 0.012099361278230681",
            "extra": "mean: 895.755260333336 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.11095422792708587,
            "unit": "iter/sec",
            "range": "stddev: 0.07372468019303392",
            "extra": "mean: 9.01272550566667 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.117255434198763,
            "unit": "iter/sec",
            "range": "stddev: 0.009578392708548522",
            "extra": "mean: 895.0504686666818 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 1.8394652640631528,
            "unit": "iter/sec",
            "range": "stddev: 0.004989163365161825",
            "extra": "mean: 543.6362509999905 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 0.987313188760211,
            "unit": "iter/sec",
            "range": "stddev: 0.002343872344175411",
            "extra": "mean: 1.0128498346666674 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 1.651355194879042,
            "unit": "iter/sec",
            "range": "stddev: 0.005670910675715328",
            "extra": "mean: 605.5632386666806 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 1.9671935292464064,
            "unit": "iter/sec",
            "range": "stddev: 0.0010452064270737318",
            "extra": "mean: 508.3383943333123 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.119183496904268,
            "unit": "iter/sec",
            "range": "stddev: 0.008542152141761017",
            "extra": "mean: 893.5085289999923 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.1218329824748268,
            "unit": "iter/sec",
            "range": "stddev: 0.00842872236002582",
            "extra": "mean: 891.3982880000049 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 12934.160334982513,
            "unit": "iter/sec",
            "range": "stddev: 0.0000027034098259174567",
            "extra": "mean: 77.3146438656199 usec\nrounds: 13245"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 300.6200546027533,
            "unit": "iter/sec",
            "range": "stddev: 0.00006956166661967375",
            "extra": "mean: 3.3264580479217343 msec\nrounds: 313"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 16.463772831631456,
            "unit": "iter/sec",
            "range": "stddev: 0.002230506132701921",
            "extra": "mean: 60.739419222228555 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 12.354485788789416,
            "unit": "iter/sec",
            "range": "stddev: 0.003022883466604974",
            "extra": "mean: 80.94225992856862 msec\nrounds: 14"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.288699730394014,
            "unit": "iter/sec",
            "range": "stddev: 0.002894582277086721",
            "extra": "mean: 189.0823928333513 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 12.510561861411187,
            "unit": "iter/sec",
            "range": "stddev: 0.0036907089151019014",
            "extra": "mean: 79.93246115384304 msec\nrounds: 13"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 16.937199727682174,
            "unit": "iter/sec",
            "range": "stddev: 0.002550519492138254",
            "extra": "mean: 59.041637111098076 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 12.583015161759628,
            "unit": "iter/sec",
            "range": "stddev: 0.0018682380232407265",
            "extra": "mean: 79.47220814285012 msec\nrounds: 14"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 11.738452636504505,
            "unit": "iter/sec",
            "range": "stddev: 0.0036125687481083704",
            "extra": "mean: 85.19010392308246 msec\nrounds: 13"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 16.307031484896466,
            "unit": "iter/sec",
            "range": "stddev: 0.0033812584751977694",
            "extra": "mean: 61.323239666655304 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 12.609005891670929,
            "unit": "iter/sec",
            "range": "stddev: 0.0021243178375588124",
            "extra": "mean: 79.30839342858624 msec\nrounds: 14"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 12.500297591220907,
            "unit": "iter/sec",
            "range": "stddev: 0.0026122034826094247",
            "extra": "mean: 79.99809546152811 msec\nrounds: 13"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 24332.841684750496,
            "unit": "iter/sec",
            "range": "stddev: 0.0000016028903554526605",
            "extra": "mean: 41.09672075936386 usec\nrounds: 24692"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 42.509942336994,
            "unit": "iter/sec",
            "range": "stddev: 0.01816118160498779",
            "extra": "mean: 23.523908644066932 msec\nrounds: 59"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 185.5203139632867,
            "unit": "iter/sec",
            "range": "stddev: 0.00002924549992219916",
            "extra": "mean: 5.39024529787015 msec\nrounds: 188"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.906307610921711,
            "unit": "iter/sec",
            "range": "stddev: 0.00043679051589935156",
            "extra": "mean: 67.08569460000338 msec\nrounds: 15"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
            "value": 1.1582194854926786,
            "unit": "iter/sec",
            "range": "stddev: 0.0075278646158185485",
            "extra": "mean: 863.3942120000029 msec\nrounds: 3"
          }
        ]
      }
    ]
  }
}