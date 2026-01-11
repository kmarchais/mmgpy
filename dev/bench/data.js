window.BENCHMARK_DATA = {
  "lastUpdate": 1768132443360,
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
          "id": "e13f26e38d54ef17065ac75483ba6cfc7f4f4a3e",
          "message": "fix(bindings): standardize array initialization types to py::ssize_t (#141)\n\nUse py::ssize_t for all py::array_t shape dimensions to ensure\nconsistent types and eliminate implicit conversion warnings with\nstrict compilers.\n\nFixes #109",
          "timestamp": "2026-01-11T12:43:46+01:00",
          "tree_id": "f43f97a990117a9227068902894f5e20ae59c950",
          "url": "https://github.com/kmarchais/mmgpy/commit/e13f26e38d54ef17065ac75483ba6cfc7f4f4a3e"
        },
        "date": 1768132442376,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 0.6147741273993803,
            "unit": "iter/sec",
            "range": "stddev: 0.03002261342749981",
            "extra": "mean: 1.6266136706666618 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.6048863722844974,
            "unit": "iter/sec",
            "range": "stddev: 0.017064026524204176",
            "extra": "mean: 1.6532030573333334 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.1518009018706854,
            "unit": "iter/sec",
            "range": "stddev: 0.004523258071853983",
            "extra": "mean: 868.2056060000131 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.205850720651289,
            "unit": "iter/sec",
            "range": "stddev: 0.0016473816382681628",
            "extra": "mean: 829.290046333341 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 0.6202736752198553,
            "unit": "iter/sec",
            "range": "stddev: 0.014383214821531438",
            "extra": "mean: 1.6121915856666835 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.6119801416115832,
            "unit": "iter/sec",
            "range": "stddev: 0.016532335388464214",
            "extra": "mean: 1.6340399500000256 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.202887490040511,
            "unit": "iter/sec",
            "range": "stddev: 0.004231986514035969",
            "extra": "mean: 831.3329453333344 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.1936106770047492,
            "unit": "iter/sec",
            "range": "stddev: 0.0017620425399859415",
            "extra": "mean: 837.7941143333297 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 1.2922227617022366,
            "unit": "iter/sec",
            "range": "stddev: 0.005972781981927868",
            "extra": "mean: 773.8603820000094 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.284670487456256,
            "unit": "iter/sec",
            "range": "stddev: 0.008950148255306444",
            "extra": "mean: 778.4097243333387 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 119.20839147814134,
            "unit": "iter/sec",
            "range": "stddev: 0.00014500638946717483",
            "extra": "mean: 8.388671196719947 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 1.21760129956182,
            "unit": "iter/sec",
            "range": "stddev: 0.005254565557637613",
            "extra": "mean: 821.2869026666377 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 1.1960449744533936,
            "unit": "iter/sec",
            "range": "stddev: 0.0034544936255508653",
            "extra": "mean: 836.0889609999921 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 16.372762813048883,
            "unit": "iter/sec",
            "range": "stddev: 0.002309320983339547",
            "extra": "mean: 61.07704676470442 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 363.0902348900892,
            "unit": "iter/sec",
            "range": "stddev: 0.0004994283845530177",
            "extra": "mean: 2.7541363107788044 msec\nrounds: 399"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 23.95493402339521,
            "unit": "iter/sec",
            "range": "stddev: 0.0004658759306204761",
            "extra": "mean: 41.74505339999541 msec\nrounds: 25"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 164.10744543947885,
            "unit": "iter/sec",
            "range": "stddev: 0.0002241086255467439",
            "extra": "mean: 6.0935687428562755 msec\nrounds: 175"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 236.7286949250701,
            "unit": "iter/sec",
            "range": "stddev: 0.00004978651125168915",
            "extra": "mean: 4.224244975103344 msec\nrounds: 241"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 268.58483596710454,
            "unit": "iter/sec",
            "range": "stddev: 0.00042447153130165956",
            "extra": "mean: 3.723218387960209 msec\nrounds: 299"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 61.16588081535571,
            "unit": "iter/sec",
            "range": "stddev: 0.00020467137227369765",
            "extra": "mean: 16.34898388888973 msec\nrounds: 63"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 891.1287056515913,
            "unit": "iter/sec",
            "range": "stddev: 0.00003087946053910813",
            "extra": "mean: 1.122172356987201 msec\nrounds: 916"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 26.20900547893041,
            "unit": "iter/sec",
            "range": "stddev: 0.0004243613557478355",
            "extra": "mean: 38.15482433333483 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 1980.4455667280777,
            "unit": "iter/sec",
            "range": "stddev: 0.000018231490117527013",
            "extra": "mean: 504.9368772362243 usec\nrounds: 2069"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 68.64190432595349,
            "unit": "iter/sec",
            "range": "stddev: 0.000213565821021903",
            "extra": "mean: 14.568360388887116 msec\nrounds: 72"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 89470.21042971258,
            "unit": "iter/sec",
            "range": "stddev: 9.355568414467396e-7",
            "extra": "mean: 11.176904527184451 usec\nrounds: 91492"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_elements_3d",
            "value": 27278.492513105666,
            "unit": "iter/sec",
            "range": "stddev: 0.0000021672155046615726",
            "extra": "mean: 36.65891725943288 usec\nrounds: 27967"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_with_refs",
            "value": 83632.36513549589,
            "unit": "iter/sec",
            "range": "stddev: 9.826523006124712e-7",
            "extra": "mean: 11.95709338579464 usec\nrounds: 85602"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 27.785468204535572,
            "unit": "iter/sec",
            "range": "stddev: 0.00036400735240207775",
            "extra": "mean: 35.99003596551829 msec\nrounds: 29"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 27.706696698565057,
            "unit": "iter/sec",
            "range": "stddev: 0.0003897759517918267",
            "extra": "mean: 36.09235741378692 msec\nrounds: 29"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 27.236247043440798,
            "unit": "iter/sec",
            "range": "stddev: 0.00048677943339925774",
            "extra": "mean: 36.715777999995275 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 3735.319639586194,
            "unit": "iter/sec",
            "range": "stddev: 0.000008236106981892712",
            "extra": "mean: 267.71470623348904 usec\nrounds: 3850"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 3240.2207875948516,
            "unit": "iter/sec",
            "range": "stddev: 0.000008788104121099724",
            "extra": "mean: 308.6209445444238 usec\nrounds: 3336"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 2289.388576730455,
            "unit": "iter/sec",
            "range": "stddev: 0.000015021349079821517",
            "extra": "mean: 436.79784644864884 usec\nrounds: 2351"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 102.00397136873819,
            "unit": "iter/sec",
            "range": "stddev: 0.00018759720357615936",
            "extra": "mean: 9.803539867923968 msec\nrounds: 106"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 102.72646066667932,
            "unit": "iter/sec",
            "range": "stddev: 0.00018243227726267067",
            "extra": "mean: 9.734590226414403 msec\nrounds: 106"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 100.834277702083,
            "unit": "iter/sec",
            "range": "stddev: 0.00018889325507628584",
            "extra": "mean: 9.91726249038567 msec\nrounds: 104"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 28.16883404201783,
            "unit": "iter/sec",
            "range": "stddev: 0.00043411508502694463",
            "extra": "mean: 35.50022689999726 msec\nrounds: 30"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 28.21483665101525,
            "unit": "iter/sec",
            "range": "stddev: 0.0005271505340232963",
            "extra": "mean: 35.44234589655217 msec\nrounds: 29"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 9903.452871652658,
            "unit": "iter/sec",
            "range": "stddev: 0.000004957187172491184",
            "extra": "mean: 100.97488350374944 usec\nrounds: 10275"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 1053457.1574729728,
            "unit": "iter/sec",
            "range": "stddev: 8.9025580466509e-8",
            "extra": "mean: 949.2554992922488 nsec\nrounds: 108614"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3500887.8463171073,
            "unit": "iter/sec",
            "range": "stddev: 3.9317388838301234e-8",
            "extra": "mean: 285.64182684457836 nsec\nrounds: 191608"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1624766.9731360222,
            "unit": "iter/sec",
            "range": "stddev: 6.958136441978196e-8",
            "extra": "mean: 615.4728749008625 nsec\nrounds: 168862"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 150436.07976901144,
            "unit": "iter/sec",
            "range": "stddev: 9.438020835950898e-7",
            "extra": "mean: 6.647341525619785 usec\nrounds: 156937"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 1299.3355159529551,
            "unit": "iter/sec",
            "range": "stddev: 0.00001639905672894233",
            "extra": "mean: 769.6241561338239 usec\nrounds: 1345"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 118.7752447412532,
            "unit": "iter/sec",
            "range": "stddev: 0.00014271174328294784",
            "extra": "mean: 8.419262803275693 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 18.377317207773235,
            "unit": "iter/sec",
            "range": "stddev: 0.00015176628052310272",
            "extra": "mean: 54.41490663158495 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 119.27373320503871,
            "unit": "iter/sec",
            "range": "stddev: 0.0001877198143639804",
            "extra": "mean: 8.384075631144537 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 110.32080406266336,
            "unit": "iter/sec",
            "range": "stddev: 0.00010442754726416939",
            "extra": "mean: 9.064473455360147 msec\nrounds: 112"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 119.91469378765139,
            "unit": "iter/sec",
            "range": "stddev: 0.00010286374928897224",
            "extra": "mean: 8.33926159016701 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 163.16122185999993,
            "unit": "iter/sec",
            "range": "stddev: 0.00006117226446788897",
            "extra": "mean: 6.128907277110534 msec\nrounds: 166"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 1341.7955661783524,
            "unit": "iter/sec",
            "range": "stddev: 0.00001676089152308209",
            "extra": "mean: 745.2700137086898 usec\nrounds: 1386"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 119.08649504830234,
            "unit": "iter/sec",
            "range": "stddev: 0.00014493170442214586",
            "extra": "mean: 8.397257804878654 msec\nrounds: 123"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 119.44660516017697,
            "unit": "iter/sec",
            "range": "stddev: 0.00009598177721494057",
            "extra": "mean: 8.371941577234512 msec\nrounds: 123"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 28679.450181983244,
            "unit": "iter/sec",
            "range": "stddev: 0.000002228057681684357",
            "extra": "mean: 34.86817193685991 usec\nrounds: 29348"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 47.496219264406875,
            "unit": "iter/sec",
            "range": "stddev: 0.015811201354792446",
            "extra": "mean: 21.054307384617214 msec\nrounds: 65"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 3.1294561671051864,
            "unit": "iter/sec",
            "range": "stddev: 0.0022001076183884435",
            "extra": "mean: 319.5443382499974 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.1999140991096013,
            "unit": "iter/sec",
            "range": "stddev: 0.004743566046826979",
            "extra": "mean: 833.3929909999824 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.11778243508144484,
            "unit": "iter/sec",
            "range": "stddev: 0.07456239156094666",
            "extra": "mean: 8.4902303073333 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.1759477429613931,
            "unit": "iter/sec",
            "range": "stddev: 0.0023387453919392546",
            "extra": "mean: 850.377923666656 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 2.8537475254118134,
            "unit": "iter/sec",
            "range": "stddev: 0.002718030049609354",
            "extra": "mean: 350.4164230000318 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 0.9634746462913575,
            "unit": "iter/sec",
            "range": "stddev: 0.003819504376263251",
            "extra": "mean: 1.037910031000024 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 2.2288934108199014,
            "unit": "iter/sec",
            "range": "stddev: 0.0005478911024427855",
            "extra": "mean: 448.6531276666786 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 3.064195509529663,
            "unit": "iter/sec",
            "range": "stddev: 0.0034025939559662074",
            "extra": "mean: 326.3499332500146 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.1907188362947037,
            "unit": "iter/sec",
            "range": "stddev: 0.0031053959268739083",
            "extra": "mean: 839.8288239999753 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.1909384816034505,
            "unit": "iter/sec",
            "range": "stddev: 0.003059315455125364",
            "extra": "mean: 839.6739340000371 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 11383.57042707071,
            "unit": "iter/sec",
            "range": "stddev: 0.000003411358736986388",
            "extra": "mean: 87.84590093297521 usec\nrounds: 11578"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 287.0399095443388,
            "unit": "iter/sec",
            "range": "stddev: 0.000022953294016473604",
            "extra": "mean: 3.483836103444462 msec\nrounds: 290"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 25.840324491568616,
            "unit": "iter/sec",
            "range": "stddev: 0.0013821000378540927",
            "extra": "mean: 38.69920442857782 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 15.817731262875563,
            "unit": "iter/sec",
            "range": "stddev: 0.0014840614155500786",
            "extra": "mean: 63.22019152942711 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.393879457641367,
            "unit": "iter/sec",
            "range": "stddev: 0.0010170610548992693",
            "extra": "mean: 185.39531849999472 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 15.652835445906799,
            "unit": "iter/sec",
            "range": "stddev: 0.001795854261210035",
            "extra": "mean: 63.88618876470072 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 19.657062389193275,
            "unit": "iter/sec",
            "range": "stddev: 0.0021177953918081753",
            "extra": "mean: 50.87230127273559 msec\nrounds: 22"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 16.35273387178956,
            "unit": "iter/sec",
            "range": "stddev: 0.0016364983692479518",
            "extra": "mean: 61.151854352936105 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 15.92322037443491,
            "unit": "iter/sec",
            "range": "stddev: 0.0012030289518189523",
            "extra": "mean: 62.801366588226244 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 25.39394573234059,
            "unit": "iter/sec",
            "range": "stddev: 0.0016741790606934425",
            "extra": "mean: 39.379465111105006 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 16.274929449872413,
            "unit": "iter/sec",
            "range": "stddev: 0.0015923981976818063",
            "extra": "mean: 61.44419876473501 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 15.95859830426946,
            "unit": "iter/sec",
            "range": "stddev: 0.0017187430155595727",
            "extra": "mean: 62.66214494116733 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 21596.19143908684,
            "unit": "iter/sec",
            "range": "stddev: 0.000002486725552128476",
            "extra": "mean: 46.304460803681565 usec\nrounds: 22068"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 44.002513559170055,
            "unit": "iter/sec",
            "range": "stddev: 0.017419499201348963",
            "extra": "mean: 22.72597447541952 msec\nrounds: 61"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 172.41250162336766,
            "unit": "iter/sec",
            "range": "stddev: 0.00018038990991959823",
            "extra": "mean: 5.800043445715346 msec\nrounds: 175"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.28974114838067,
            "unit": "iter/sec",
            "range": "stddev: 0.000381349642393156",
            "extra": "mean: 69.980273933326 msec\nrounds: 15"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
            "value": 1.1352643495734152,
            "unit": "iter/sec",
            "range": "stddev: 0.001594993020966877",
            "extra": "mean: 880.8521119999568 msec\nrounds: 3"
          }
        ]
      }
    ]
  }
}