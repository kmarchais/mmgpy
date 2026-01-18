window.BENCHMARK_DATA = {
  "lastUpdate": 1768741086191,
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
          "id": "25c9b23bbd9fe8a61fe36f3a3dbad738ac5230ea",
          "message": "fix(ci): fix dependency check workflow issues (#162)\n\n- Add issues:write permission for creating/editing GitHub issues\n- Use proper semantic version comparison (only flag when latest > current)\n- Check VTK versions from official Kitware/VTK repo instead of vtk-builds\n- Filter out release candidate versions from VTK check\n- Link to correct Kitware release notes",
          "timestamp": "2026-01-18T13:48:05+01:00",
          "tree_id": "ce74533fcbb80ea5fc31c22ed819223798b774ae",
          "url": "https://github.com/kmarchais/mmgpy/commit/25c9b23bbd9fe8a61fe36f3a3dbad738ac5230ea"
        },
        "date": 1768741085758,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 0.6200820345630031,
            "unit": "iter/sec",
            "range": "stddev: 0.020696995175179797",
            "extra": "mean: 1.6126898446666662 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.6165722146678837,
            "unit": "iter/sec",
            "range": "stddev: 0.011284167032499027",
            "extra": "mean: 1.6218700359999996 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.1719176692476807,
            "unit": "iter/sec",
            "range": "stddev: 0.003953040796006198",
            "extra": "mean: 853.3022636666582 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.224030810343913,
            "unit": "iter/sec",
            "range": "stddev: 0.0013737137382808609",
            "extra": "mean: 816.9728993333365 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 0.5898499107496025,
            "unit": "iter/sec",
            "range": "stddev: 0.046220072949800114",
            "extra": "mean: 1.695346531000003 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.5836012136016002,
            "unit": "iter/sec",
            "range": "stddev: 0.05763548370792435",
            "extra": "mean: 1.7134988356666743 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.1986715219415864,
            "unit": "iter/sec",
            "range": "stddev: 0.0018735912969681879",
            "extra": "mean: 834.2569100000125 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.2161166609621679,
            "unit": "iter/sec",
            "range": "stddev: 0.004718109273455038",
            "extra": "mean: 822.2895320000134 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 1.1905730440657656,
            "unit": "iter/sec",
            "range": "stddev: 0.009533900954117406",
            "extra": "mean: 839.9316656666732 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.2113069989638685,
            "unit": "iter/sec",
            "range": "stddev: 0.00796993622108164",
            "extra": "mean: 825.5545463333268 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 113.23330026796793,
            "unit": "iter/sec",
            "range": "stddev: 0.00014201784489281956",
            "extra": "mean: 8.83132433333205 msec\nrounds: 117"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 1.1568741576011174,
            "unit": "iter/sec",
            "range": "stddev: 0.008169991726333098",
            "extra": "mean: 864.3982523333307 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 1.1370216441405099,
            "unit": "iter/sec",
            "range": "stddev: 0.01704106701810159",
            "extra": "mean: 879.4907336666521 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 16.390641340642848,
            "unit": "iter/sec",
            "range": "stddev: 0.0009096607081962918",
            "extra": "mean: 61.010425352933716 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 367.2515427471812,
            "unit": "iter/sec",
            "range": "stddev: 0.0002633642438828265",
            "extra": "mean: 2.7229293375314905 msec\nrounds: 397"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 24.192342305187392,
            "unit": "iter/sec",
            "range": "stddev: 0.00022348038845478556",
            "extra": "mean: 41.335393959996054 msec\nrounds: 25"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 164.4954406340929,
            "unit": "iter/sec",
            "range": "stddev: 0.0002312779145703609",
            "extra": "mean: 6.079195849716109 msec\nrounds: 173"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 234.00532755586738,
            "unit": "iter/sec",
            "range": "stddev: 0.00007482080002554798",
            "extra": "mean: 4.273406979425526 msec\nrounds: 243"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 270.90738263318326,
            "unit": "iter/sec",
            "range": "stddev: 0.00020587333270222962",
            "extra": "mean: 3.69129844406651 msec\nrounds: 295"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 61.250531152680445,
            "unit": "iter/sec",
            "range": "stddev: 0.0001938783257309983",
            "extra": "mean: 16.326389031750267 msec\nrounds: 63"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 906.7800610144735,
            "unit": "iter/sec",
            "range": "stddev: 0.00004495785137654669",
            "extra": "mean: 1.1028032518505484 msec\nrounds: 945"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 26.577643684794733,
            "unit": "iter/sec",
            "range": "stddev: 0.00040692141727868044",
            "extra": "mean: 37.62560789285122 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 1905.3014247420615,
            "unit": "iter/sec",
            "range": "stddev: 0.00003702945509412146",
            "extra": "mean: 524.8513369139896 usec\nrounds: 2048"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 64.37570447687654,
            "unit": "iter/sec",
            "range": "stddev: 0.00021178232427367317",
            "extra": "mean: 15.533810590906942 msec\nrounds: 66"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 90658.30349036785,
            "unit": "iter/sec",
            "range": "stddev: 0.0000010601008178983878",
            "extra": "mean: 11.030429221590794 usec\nrounds: 92507"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
            "value": 25828.59178596906,
            "unit": "iter/sec",
            "range": "stddev: 0.000002241416210251403",
            "extra": "mean: 38.716783643746034 usec\nrounds: 26253"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
            "value": 6383.32672555452,
            "unit": "iter/sec",
            "range": "stddev: 0.000004832626185775413",
            "extra": "mean: 156.65812561288408 usec\nrounds: 6528"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 27.039464684889282,
            "unit": "iter/sec",
            "range": "stddev: 0.00043310042733870106",
            "extra": "mean: 36.982980678564964 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 27.031325216470332,
            "unit": "iter/sec",
            "range": "stddev: 0.0003484194481411524",
            "extra": "mean: 36.994116714288744 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 26.80418252701826,
            "unit": "iter/sec",
            "range": "stddev: 0.00046524614909577424",
            "extra": "mean: 37.307610444452585 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 3923.75661030751,
            "unit": "iter/sec",
            "range": "stddev: 0.000008400727702464728",
            "extra": "mean: 254.85780574999237 usec\nrounds: 4000"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 3398.292947082736,
            "unit": "iter/sec",
            "range": "stddev: 0.000007853797943835397",
            "extra": "mean: 294.2653901743373 usec\nrounds: 3501"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 2370.907336108195,
            "unit": "iter/sec",
            "range": "stddev: 0.000010641474394330156",
            "extra": "mean: 421.7794532794703 usec\nrounds: 2440"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 97.72985803917425,
            "unit": "iter/sec",
            "range": "stddev: 0.00029162454250431544",
            "extra": "mean: 10.232287450976935 msec\nrounds: 102"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 97.25166115097997,
            "unit": "iter/sec",
            "range": "stddev: 0.00016087718326743077",
            "extra": "mean: 10.282600710002612 msec\nrounds: 100"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 96.2074387243859,
            "unit": "iter/sec",
            "range": "stddev: 0.00013348305759026694",
            "extra": "mean: 10.394206656564156 msec\nrounds: 99"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 27.04692531422192,
            "unit": "iter/sec",
            "range": "stddev: 0.00043624619347872116",
            "extra": "mean: 36.97277928571704 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 27.144851692546734,
            "unit": "iter/sec",
            "range": "stddev: 0.00042610633261513985",
            "extra": "mean: 36.839398178571514 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 9795.762121751633,
            "unit": "iter/sec",
            "range": "stddev: 0.000004557679351094201",
            "extra": "mean: 102.08496159573795 usec\nrounds: 10077"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 1046873.5994567721,
            "unit": "iter/sec",
            "range": "stddev: 9.755576275711294e-8",
            "extra": "mean: 955.2251585281213 nsec\nrounds: 108027"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3316843.1247066488,
            "unit": "iter/sec",
            "range": "stddev: 4.4229051857941995e-8",
            "extra": "mean: 301.4914973069288 nsec\nrounds: 194213"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1604703.2867219392,
            "unit": "iter/sec",
            "range": "stddev: 7.139164383869596e-8",
            "extra": "mean: 623.1681634071948 nsec\nrounds: 166362"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 165974.69940742795,
            "unit": "iter/sec",
            "range": "stddev: 9.330312122850546e-7",
            "extra": "mean: 6.025014677358991 usec\nrounds: 175439"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 1303.9333631651461,
            "unit": "iter/sec",
            "range": "stddev: 0.00003955335320619643",
            "extra": "mean: 766.9103561953631 usec\nrounds: 1356"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 115.28028417794714,
            "unit": "iter/sec",
            "range": "stddev: 0.00013894621433930166",
            "extra": "mean: 8.674510191668125 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 18.160508658336724,
            "unit": "iter/sec",
            "range": "stddev: 0.0003857513201330135",
            "extra": "mean: 55.064536947369156 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 114.13067194671626,
            "unit": "iter/sec",
            "range": "stddev: 0.00011226769520142425",
            "extra": "mean: 8.76188655462281 msec\nrounds: 119"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 103.93809483601703,
            "unit": "iter/sec",
            "range": "stddev: 0.00015797461943275955",
            "extra": "mean: 9.62111150466726 msec\nrounds: 107"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 112.6020318409179,
            "unit": "iter/sec",
            "range": "stddev: 0.0002940855817999494",
            "extra": "mean: 8.880834418803222 msec\nrounds: 117"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 154.78508647088904,
            "unit": "iter/sec",
            "range": "stddev: 0.00009835458854967163",
            "extra": "mean: 6.460570735851051 msec\nrounds: 159"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 1334.3938650968526,
            "unit": "iter/sec",
            "range": "stddev: 0.000020801248784534507",
            "extra": "mean: 749.4039250003733 usec\nrounds: 1400"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 116.10663870235989,
            "unit": "iter/sec",
            "range": "stddev: 0.00009788992088329667",
            "extra": "mean: 8.612771941176478 msec\nrounds: 119"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 115.20408942218968,
            "unit": "iter/sec",
            "range": "stddev: 0.00010631034341681192",
            "extra": "mean: 8.680247420170035 msec\nrounds: 119"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 27558.464327484464,
            "unit": "iter/sec",
            "range": "stddev: 0.000002446497032361159",
            "extra": "mean: 36.286492168675935 usec\nrounds: 28348"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 46.343618213772025,
            "unit": "iter/sec",
            "range": "stddev: 0.01684596062355886",
            "extra": "mean: 21.57794403076685 msec\nrounds: 65"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 3.2421395742429664,
            "unit": "iter/sec",
            "range": "stddev: 0.0010359797883745163",
            "extra": "mean: 308.4382942500241 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.218761822294402,
            "unit": "iter/sec",
            "range": "stddev: 0.0019861432871335493",
            "extra": "mean: 820.5048613333096 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.1220148282527002,
            "unit": "iter/sec",
            "range": "stddev: 0.045382716391170565",
            "extra": "mean: 8.195725177999995 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.2320963322173148,
            "unit": "iter/sec",
            "range": "stddev: 0.001989592462156393",
            "extra": "mean: 811.6248493333084 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 3.054600885443747,
            "unit": "iter/sec",
            "range": "stddev: 0.0009395435491470292",
            "extra": "mean: 327.3750114999814 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 0.9801223881047617,
            "unit": "iter/sec",
            "range": "stddev: 0.011855469880935625",
            "extra": "mean: 1.0202807446666686 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 2.366934734096543,
            "unit": "iter/sec",
            "range": "stddev: 0.0011739720760064684",
            "extra": "mean: 422.4873570000227 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 3.2276930434027578,
            "unit": "iter/sec",
            "range": "stddev: 0.0008327101033842099",
            "extra": "mean: 309.8188044999972 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.2327620955128924,
            "unit": "iter/sec",
            "range": "stddev: 0.0025930015977695437",
            "extra": "mean: 811.1865246667472 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.1906871698477832,
            "unit": "iter/sec",
            "range": "stddev: 0.004830650946615876",
            "extra": "mean: 839.8511593333448 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 11423.5752385627,
            "unit": "iter/sec",
            "range": "stddev: 0.0000036771618593882405",
            "extra": "mean: 87.5382688096007 usec\nrounds: 11603"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 284.1506617899329,
            "unit": "iter/sec",
            "range": "stddev: 0.000031378296767573566",
            "extra": "mean: 3.519259795844786 msec\nrounds: 289"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 25.33659223924108,
            "unit": "iter/sec",
            "range": "stddev: 0.0016162394410770603",
            "extra": "mean: 39.468606928567496 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 16.294501842094558,
            "unit": "iter/sec",
            "range": "stddev: 0.0015701846063362033",
            "extra": "mean: 61.370394117642824 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.413329441918599,
            "unit": "iter/sec",
            "range": "stddev: 0.0015819916227707157",
            "extra": "mean: 184.7291968333593 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 16.35020162155469,
            "unit": "iter/sec",
            "range": "stddev: 0.001482851780479273",
            "extra": "mean: 61.161325294098305 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 20.396340691034375,
            "unit": "iter/sec",
            "range": "stddev: 0.002105700403296094",
            "extra": "mean: 49.02840245454276 msec\nrounds: 22"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 16.217978669598647,
            "unit": "iter/sec",
            "range": "stddev: 0.002061636496389436",
            "extra": "mean: 61.65996517645855 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 15.66891888510981,
            "unit": "iter/sec",
            "range": "stddev: 0.0017509152079297422",
            "extra": "mean: 63.82061247060899 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 24.91479458607175,
            "unit": "iter/sec",
            "range": "stddev: 0.0016153260440777298",
            "extra": "mean: 40.13679488889044 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 16.21029100178591,
            "unit": "iter/sec",
            "range": "stddev: 0.0017665936885979234",
            "extra": "mean: 61.689207176467626 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 16.17011587397733,
            "unit": "iter/sec",
            "range": "stddev: 0.0016091557231736812",
            "extra": "mean: 61.84247582352247 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 21824.3257574027,
            "unit": "iter/sec",
            "range": "stddev: 0.0000027109713873975926",
            "extra": "mean: 45.820430427767285 usec\nrounds: 22315"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 43.17116762300557,
            "unit": "iter/sec",
            "range": "stddev: 0.0174161426640092",
            "extra": "mean: 23.163607913794483 msec\nrounds: 58"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 172.23205568830792,
            "unit": "iter/sec",
            "range": "stddev: 0.00013137731241984272",
            "extra": "mean: 5.806120097699592 msec\nrounds: 174"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.053001611344259,
            "unit": "iter/sec",
            "range": "stddev: 0.00039148931316980787",
            "extra": "mean: 71.15917493332896 msec\nrounds: 15"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
            "value": 1.0562809733753746,
            "unit": "iter/sec",
            "range": "stddev: 0.0008792095078887886",
            "extra": "mean: 946.7178006666851 msec\nrounds: 3"
          }
        ]
      }
    ]
  }
}