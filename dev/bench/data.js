window.BENCHMARK_DATA = {
  "lastUpdate": 1767826966180,
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
          "id": "465a9ae3e1afb8b4cf480f0e13474ce29e457b0c",
          "message": "refactor(scripts): add type annotations and convert to pathlib (#101)\n\n- Add type annotations to all script functions\n- Convert from os.path to pathlib for cleaner path handling\n- Replace blanket ALL ignore for .github/scripts with specific rules\n- Reduce per-file ignores for scripts directory\n\nThis addresses #95, #96, #97, and #98 from issue #44.",
          "timestamp": "2026-01-07T23:56:06+01:00",
          "tree_id": "13001e394167bde8899f2f920da237370e38a36c",
          "url": "https://github.com/kmarchais/mmgpy/commit/465a9ae3e1afb8b4cf480f0e13474ce29e457b0c"
        },
        "date": 1767826965050,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 0.6443465906320518,
            "unit": "iter/sec",
            "range": "stddev: 0.01042248977354927",
            "extra": "mean: 1.551959790799981 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.6389414601829049,
            "unit": "iter/sec",
            "range": "stddev: 0.0023696347167034113",
            "extra": "mean: 1.5650886072000048 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.2099546670011758,
            "unit": "iter/sec",
            "range": "stddev: 0.0005283720937335614",
            "extra": "mean: 826.4772451999875 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.2710990461553489,
            "unit": "iter/sec",
            "range": "stddev: 0.003057918301124452",
            "extra": "mean: 786.7207539999868 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 0.6433681209287511,
            "unit": "iter/sec",
            "range": "stddev: 0.015025626076460716",
            "extra": "mean: 1.5543200967999837 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.646077624802146,
            "unit": "iter/sec",
            "range": "stddev: 0.009553464161633777",
            "extra": "mean: 1.547801628800005 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.262564722160917,
            "unit": "iter/sec",
            "range": "stddev: 0.0023365803898869786",
            "extra": "mean: 792.0386040000153 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.2661711604254198,
            "unit": "iter/sec",
            "range": "stddev: 0.0016423759024060596",
            "extra": "mean: 789.7826385999906 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 1.3993237616235212,
            "unit": "iter/sec",
            "range": "stddev: 0.006694214699846411",
            "extra": "mean: 714.6309006000024 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.3879474622456947,
            "unit": "iter/sec",
            "range": "stddev: 0.004477537914688372",
            "extra": "mean: 720.4883665999887 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 119.21081710562711,
            "unit": "iter/sec",
            "range": "stddev: 0.00040191630450485334",
            "extra": "mean: 8.388500509261226 msec\nrounds: 108"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 1.3178653432667047,
            "unit": "iter/sec",
            "range": "stddev: 0.0029391041252327488",
            "extra": "mean: 758.8028664000035 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 1.3080531472134032,
            "unit": "iter/sec",
            "range": "stddev: 0.004886691691293827",
            "extra": "mean: 764.494930599983 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 17.456825768808734,
            "unit": "iter/sec",
            "range": "stddev: 0.001162554782441695",
            "extra": "mean: 57.28418288889417 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 372.711803425224,
            "unit": "iter/sec",
            "range": "stddev: 0.00007867187210422498",
            "extra": "mean: 2.6830381834167665 msec\nrounds: 398"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 23.524976268810583,
            "unit": "iter/sec",
            "range": "stddev: 0.0006743990943062993",
            "extra": "mean: 42.508013125003664 msec\nrounds: 24"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 165.17969900889483,
            "unit": "iter/sec",
            "range": "stddev: 0.00010572148323404178",
            "extra": "mean: 6.054012726746467 msec\nrounds: 172"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 244.32578123792416,
            "unit": "iter/sec",
            "range": "stddev: 0.000032672870134466014",
            "extra": "mean: 4.0928959479155465 msec\nrounds: 192"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 276.17345955670544,
            "unit": "iter/sec",
            "range": "stddev: 0.00007524442574877677",
            "extra": "mean: 3.6209127466670075 msec\nrounds: 300"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 61.44972793573198,
            "unit": "iter/sec",
            "range": "stddev: 0.0001041906320909824",
            "extra": "mean: 16.273465051722663 msec\nrounds: 58"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 938.4478494939922,
            "unit": "iter/sec",
            "range": "stddev: 0.000020961758013261156",
            "extra": "mean: 1.065589313821963 msec\nrounds: 615"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 25.50607065671057,
            "unit": "iter/sec",
            "range": "stddev: 0.0002238023729450441",
            "extra": "mean: 39.20635261538818 msec\nrounds: 26"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 1992.3995677939367,
            "unit": "iter/sec",
            "range": "stddev: 0.00001725466852529835",
            "extra": "mean: 501.90735641809005 usec\nrounds: 1083"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 76.08616415495743,
            "unit": "iter/sec",
            "range": "stddev: 0.0004112313979372698",
            "extra": "mean: 13.142994013515983 msec\nrounds: 74"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 90618.61413547688,
            "unit": "iter/sec",
            "range": "stddev: 9.945177810322237e-7",
            "extra": "mean: 11.035260355063226 usec\nrounds: 42492"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_elements_3d",
            "value": 27399.271107416243,
            "unit": "iter/sec",
            "range": "stddev: 0.000001926440456756658",
            "extra": "mean: 36.49732126375169 usec\nrounds: 20189"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_with_refs",
            "value": 84522.88691503827,
            "unit": "iter/sec",
            "range": "stddev: 0.0000010444237092385874",
            "extra": "mean: 11.831115056507619 usec\nrounds: 37738"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 26.309176818511073,
            "unit": "iter/sec",
            "range": "stddev: 0.0002480163763600143",
            "extra": "mean: 38.00955107407247 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 26.06686892177102,
            "unit": "iter/sec",
            "range": "stddev: 0.00019993535637050574",
            "extra": "mean: 38.362873692313734 msec\nrounds: 26"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 26.428511635109643,
            "unit": "iter/sec",
            "range": "stddev: 0.00025968092465832493",
            "extra": "mean: 37.837923444448684 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 3201.6170549035273,
            "unit": "iter/sec",
            "range": "stddev: 0.000009373079820892858",
            "extra": "mean: 312.3421642411673 usec\nrounds: 1443"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 2860.4496869224504,
            "unit": "iter/sec",
            "range": "stddev: 0.000008467528923043129",
            "extra": "mean: 349.5953816533991 usec\nrounds: 2649"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 2136.6983914459374,
            "unit": "iter/sec",
            "range": "stddev: 0.00001011959199973365",
            "extra": "mean: 468.011771808039 usec\nrounds: 1135"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 117.15324784221731,
            "unit": "iter/sec",
            "range": "stddev: 0.00040268717243667685",
            "extra": "mean: 8.535828228567814 msec\nrounds: 105"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 117.71124475968669,
            "unit": "iter/sec",
            "range": "stddev: 0.0003891444019203108",
            "extra": "mean: 8.495365094826322 msec\nrounds: 116"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 116.24571033450333,
            "unit": "iter/sec",
            "range": "stddev: 0.00036125210050338134",
            "extra": "mean: 8.602467971699307 msec\nrounds: 106"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 26.717629310947256,
            "unit": "iter/sec",
            "range": "stddev: 0.000176214414831264",
            "extra": "mean: 37.42847048148321 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 26.724298269147337,
            "unit": "iter/sec",
            "range": "stddev: 0.00019579939428091496",
            "extra": "mean: 37.41913033332964 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 7501.521834530568,
            "unit": "iter/sec",
            "range": "stddev: 0.0000048425031341125024",
            "extra": "mean: 133.30628398585182 usec\nrounds: 2479"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 913320.4494763609,
            "unit": "iter/sec",
            "range": "stddev: 2.963805437482243e-7",
            "extra": "mean: 1.0949059561442378 usec\nrounds: 176960"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 2270417.848290295,
            "unit": "iter/sec",
            "range": "stddev: 3.924794637938505e-7",
            "extra": "mean: 440.44755935698595 nsec\nrounds: 186916"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1317924.9009938939,
            "unit": "iter/sec",
            "range": "stddev: 3.9114474087577773e-7",
            "extra": "mean: 758.768575694916 nsec\nrounds: 3055"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 170253.97205775767,
            "unit": "iter/sec",
            "range": "stddev: 9.093424121810801e-7",
            "extra": "mean: 5.8735780899182535 usec\nrounds: 48617"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 1159.368613658034,
            "unit": "iter/sec",
            "range": "stddev: 0.000017435978296731773",
            "extra": "mean: 862.538443959428 usec\nrounds: 687"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 120.75219804466634,
            "unit": "iter/sec",
            "range": "stddev: 0.00004363271012737511",
            "extra": "mean: 8.281422750003268 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 18.47412875230782,
            "unit": "iter/sec",
            "range": "stddev: 0.00014464637381449911",
            "extra": "mean: 54.129751578952174 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 119.3701162459258,
            "unit": "iter/sec",
            "range": "stddev: 0.000294447714494341",
            "extra": "mean: 8.377306074996227 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 110.88589663817666,
            "unit": "iter/sec",
            "range": "stddev: 0.000029205809627076362",
            "extra": "mean: 9.018279423424099 msec\nrounds: 111"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 120.39887174924111,
            "unit": "iter/sec",
            "range": "stddev: 0.0001599893303185799",
            "extra": "mean: 8.305725672269874 msec\nrounds: 119"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 162.4995689345944,
            "unit": "iter/sec",
            "range": "stddev: 0.0000339657118708736",
            "extra": "mean: 6.153862478259847 msec\nrounds: 161"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 1192.6493042079949,
            "unit": "iter/sec",
            "range": "stddev: 0.00001320189011270717",
            "extra": "mean: 838.4694448499864 usec\nrounds: 1097"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 120.6868096429926,
            "unit": "iter/sec",
            "range": "stddev: 0.00003907159630042145",
            "extra": "mean: 8.28590964462588 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 120.56049308648171,
            "unit": "iter/sec",
            "range": "stddev: 0.00004682277460876108",
            "extra": "mean: 8.294591158337994 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 27921.504779973933,
            "unit": "iter/sec",
            "range": "stddev: 0.000002079462952232422",
            "extra": "mean: 35.81468863802883 usec\nrounds: 25700"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 4.443062205817141,
            "unit": "iter/sec",
            "range": "stddev: 0.019132922685985005",
            "extra": "mean: 225.06999760001918 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 3.3163085042758795,
            "unit": "iter/sec",
            "range": "stddev: 0.0007957687979981789",
            "extra": "mean: 301.54010060000473 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.2716354779037842,
            "unit": "iter/sec",
            "range": "stddev: 0.0010087598522694162",
            "extra": "mean: 786.3888805999977 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.13600038566619446,
            "unit": "iter/sec",
            "range": "stddev: 0.007799186333943731",
            "extra": "mean: 7.3529203252 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.2722396106546587,
            "unit": "iter/sec",
            "range": "stddev: 0.0009910530762604899",
            "extra": "mean: 786.0154577999879 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 3.0503974086110954,
            "unit": "iter/sec",
            "range": "stddev: 0.0003959286842272525",
            "extra": "mean: 327.82613740001807 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 1.0370927897319107,
            "unit": "iter/sec",
            "range": "stddev: 0.0005518205836040417",
            "extra": "mean: 964.2338755999845 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 2.3954421676581785,
            "unit": "iter/sec",
            "range": "stddev: 0.0009317303272390723",
            "extra": "mean: 417.45946260001574 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 3.2265403354979076,
            "unit": "iter/sec",
            "range": "stddev: 0.0007413922375478336",
            "extra": "mean: 309.9294898000039 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.272654732749579,
            "unit": "iter/sec",
            "range": "stddev: 0.000821484805945445",
            "extra": "mean: 785.7590705999996 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.2708928312614876,
            "unit": "iter/sec",
            "range": "stddev: 0.0010416448517478242",
            "extra": "mean: 786.8484072000001 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 11367.95128803644,
            "unit": "iter/sec",
            "range": "stddev: 0.000004428434145049609",
            "extra": "mean: 87.9665979086657 usec\nrounds: 8988"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 4.006265148074116,
            "unit": "iter/sec",
            "range": "stddev: 0.0005811305272106982",
            "extra": "mean: 249.60904060000075 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 28.34701229435601,
            "unit": "iter/sec",
            "range": "stddev: 0.0007373529275499457",
            "extra": "mean: 35.277086333331276 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 17.546394744024965,
            "unit": "iter/sec",
            "range": "stddev: 0.0006904321899603912",
            "extra": "mean: 56.99176466667192 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.55099294260545,
            "unit": "iter/sec",
            "range": "stddev: 0.0006508226669714266",
            "extra": "mean: 180.14795016666577 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 17.52498534239546,
            "unit": "iter/sec",
            "range": "stddev: 0.0007150723484500752",
            "extra": "mean: 57.06138866666303 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 21.413860078890014,
            "unit": "iter/sec",
            "range": "stddev: 0.0012771448007866798",
            "extra": "mean: 46.698726727266205 msec\nrounds: 22"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 17.686264694736938,
            "unit": "iter/sec",
            "range": "stddev: 0.0007144405285415221",
            "extra": "mean: 56.54105133333095 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 17.278871084268772,
            "unit": "iter/sec",
            "range": "stddev: 0.0008077889870596448",
            "extra": "mean: 57.8741513333259 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 28.34404890900207,
            "unit": "iter/sec",
            "range": "stddev: 0.0007673577325277523",
            "extra": "mean: 35.28077457142688 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 17.516224902041483,
            "unit": "iter/sec",
            "range": "stddev: 0.0007088264725877665",
            "extra": "mean: 57.089926944444066 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 17.514733330429355,
            "unit": "iter/sec",
            "range": "stddev: 0.0007872964344002543",
            "extra": "mean: 57.09478877777959 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 21516.359501935756,
            "unit": "iter/sec",
            "range": "stddev: 0.0000029935075273108493",
            "extra": "mean: 46.476263789421864 usec\nrounds: 17332"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 26.132658066411583,
            "unit": "iter/sec",
            "range": "stddev: 0.012419040525045135",
            "extra": "mean: 38.266294896549546 msec\nrounds: 29"
          }
        ]
      }
    ]
  }
}