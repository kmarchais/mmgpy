window.BENCHMARK_DATA = {
  "lastUpdate": 1767828127882,
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
          "id": "056c25ffe498c63d018fc7aeb7d6380cf713bc49",
          "message": "refactor: reduce per-file ignores by fixing violations (#103)\n\n- Fix RUF005 in __init__.py: use list unpacking instead of concatenation\n- Fix E501 in benchmarks: extract calculations to variables\n- Remove RUF005 from __init__.py ignores (9 → 8 rules)\n- Remove E501 from benchmarks ignores (11 → 10 rules)",
          "timestamp": "2026-01-08T00:15:48+01:00",
          "tree_id": "f2357b0897577ed842fd436a05eb7919598e5350",
          "url": "https://github.com/kmarchais/mmgpy/commit/056c25ffe498c63d018fc7aeb7d6380cf713bc49"
        },
        "date": 1767828127318,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 0.6333645838459215,
            "unit": "iter/sec",
            "range": "stddev: 0.020187921849367664",
            "extra": "mean: 1.5788694623999846 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.628629094543097,
            "unit": "iter/sec",
            "range": "stddev: 0.013601480312448051",
            "extra": "mean: 1.590763152199986 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.1784482412185315,
            "unit": "iter/sec",
            "range": "stddev: 0.002664357938265783",
            "extra": "mean: 848.5735436000027 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.2462786188985087,
            "unit": "iter/sec",
            "range": "stddev: 0.0019730105894634614",
            "extra": "mean: 802.3887955999953 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 0.6290714438805387,
            "unit": "iter/sec",
            "range": "stddev: 0.008172503918657795",
            "extra": "mean: 1.5896445621999988 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.6298832171975018,
            "unit": "iter/sec",
            "range": "stddev: 0.006439343593296815",
            "extra": "mean: 1.587595879200012 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.251965898513194,
            "unit": "iter/sec",
            "range": "stddev: 0.001232151933323981",
            "extra": "mean: 798.743800599982 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.250653224933952,
            "unit": "iter/sec",
            "range": "stddev: 0.0021231155153922433",
            "extra": "mean: 799.5821544000023 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 1.3567490708231573,
            "unit": "iter/sec",
            "range": "stddev: 0.004968540292761652",
            "extra": "mean: 737.0559681999907 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.354112218547868,
            "unit": "iter/sec",
            "range": "stddev: 0.006273559814413654",
            "extra": "mean: 738.4912315999827 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 119.3856340829584,
            "unit": "iter/sec",
            "range": "stddev: 0.0001956698632372756",
            "extra": "mean: 8.376217186274877 msec\nrounds: 102"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 1.284146737551283,
            "unit": "iter/sec",
            "range": "stddev: 0.004166069759314929",
            "extra": "mean: 778.7272051999935 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 1.25523241655848,
            "unit": "iter/sec",
            "range": "stddev: 0.00972335843535683",
            "extra": "mean: 796.6652126000213 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 16.626977907393023,
            "unit": "iter/sec",
            "range": "stddev: 0.0007782039739312531",
            "extra": "mean: 60.143220588232076 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 377.9682697010163,
            "unit": "iter/sec",
            "range": "stddev: 0.00020327991201309805",
            "extra": "mean: 2.645724734489032 msec\nrounds: 403"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 22.9417525878704,
            "unit": "iter/sec",
            "range": "stddev: 0.00022616428933077058",
            "extra": "mean: 43.58864895651925 msec\nrounds: 23"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 166.8421940297207,
            "unit": "iter/sec",
            "range": "stddev: 0.0002681134174856962",
            "extra": "mean: 5.993687662857415 msec\nrounds: 175"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 253.03464027391277,
            "unit": "iter/sec",
            "range": "stddev: 0.00003882796437912599",
            "extra": "mean: 3.952028065870701 msec\nrounds: 167"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 274.0932681439871,
            "unit": "iter/sec",
            "range": "stddev: 0.00044173421903655815",
            "extra": "mean: 3.6483931428577754 msec\nrounds: 301"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 66.557506439892,
            "unit": "iter/sec",
            "range": "stddev: 0.00018622183851994847",
            "extra": "mean: 15.024601333331182 msec\nrounds: 63"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 930.6947585867993,
            "unit": "iter/sec",
            "range": "stddev: 0.000021385741834284874",
            "extra": "mean: 1.074466134867286 msec\nrounds: 608"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 27.06264469111867,
            "unit": "iter/sec",
            "range": "stddev: 0.0002960208078942259",
            "extra": "mean: 36.95130359259296 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 1981.8977906559464,
            "unit": "iter/sec",
            "range": "stddev: 0.00002600893620183876",
            "extra": "mean: 504.56688771474495 usec\nrounds: 1042"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 69.70943364282098,
            "unit": "iter/sec",
            "range": "stddev: 0.0002094809618651861",
            "extra": "mean: 14.345260716416462 msec\nrounds: 67"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 90900.66455381515,
            "unit": "iter/sec",
            "range": "stddev: 9.597293420175323e-7",
            "extra": "mean: 11.001019683502738 usec\nrounds: 45723"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_elements_3d",
            "value": 27563.199300881013,
            "unit": "iter/sec",
            "range": "stddev: 0.0000020478920673588256",
            "extra": "mean: 36.2802586551713 usec\nrounds: 19122"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_with_refs",
            "value": 83456.97091113594,
            "unit": "iter/sec",
            "range": "stddev: 0.0000010754572785647204",
            "extra": "mean: 11.98222256430549 usec\nrounds: 24375"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 27.89346321896565,
            "unit": "iter/sec",
            "range": "stddev: 0.0003697959848415764",
            "extra": "mean: 35.85069348147735 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 27.88179382463622,
            "unit": "iter/sec",
            "range": "stddev: 0.0002972231942691284",
            "extra": "mean: 35.86569810714276 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 26.794862897219595,
            "unit": "iter/sec",
            "range": "stddev: 0.0004419686750084276",
            "extra": "mean: 37.32058655555824 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 3828.410516072697,
            "unit": "iter/sec",
            "range": "stddev: 0.000011651447588254558",
            "extra": "mean: 261.20500813633515 usec\nrounds: 1352"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 3011.7628367085763,
            "unit": "iter/sec",
            "range": "stddev: 0.00003413255522209089",
            "extra": "mean: 332.03145606672547 usec\nrounds: 3107"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 2078.806872032179,
            "unit": "iter/sec",
            "range": "stddev: 0.000014326487987254439",
            "extra": "mean: 481.0451675207472 usec\nrounds: 1367"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 99.1140179619518,
            "unit": "iter/sec",
            "range": "stddev: 0.000163850808470929",
            "extra": "mean: 10.089390184785799 msec\nrounds: 92"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 96.76767431409935,
            "unit": "iter/sec",
            "range": "stddev: 0.000143643402096592",
            "extra": "mean: 10.334029489580251 msec\nrounds: 96"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 95.76817694902073,
            "unit": "iter/sec",
            "range": "stddev: 0.00010939728866032622",
            "extra": "mean: 10.441881968081313 msec\nrounds: 94"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 25.61335634552625,
            "unit": "iter/sec",
            "range": "stddev: 0.00031635496433378023",
            "extra": "mean: 39.04213046154199 msec\nrounds: 26"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 25.812644828605457,
            "unit": "iter/sec",
            "range": "stddev: 0.00023139696857024102",
            "extra": "mean: 38.74070273077187 msec\nrounds: 26"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 7105.820376166315,
            "unit": "iter/sec",
            "range": "stddev: 0.000008225531761805476",
            "extra": "mean: 140.72970425119487 usec\nrounds: 2164"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 906098.7384973313,
            "unit": "iter/sec",
            "range": "stddev: 3.0679883940080465e-7",
            "extra": "mean: 1.1036324823257053 usec\nrounds: 160746"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3418976.1924015814,
            "unit": "iter/sec",
            "range": "stddev: 4.246123029925405e-8",
            "extra": "mean: 292.4852188858247 nsec\nrounds: 88559"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1354277.2417477132,
            "unit": "iter/sec",
            "range": "stddev: 1.6169244340263487e-7",
            "extra": "mean: 738.4012439797677 nsec\nrounds: 3377"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 168753.04597281932,
            "unit": "iter/sec",
            "range": "stddev: 8.493800127294122e-7",
            "extra": "mean: 5.92581896365336 usec\nrounds: 48714"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 1102.6649568892258,
            "unit": "iter/sec",
            "range": "stddev: 0.00003342573418051813",
            "extra": "mean: 906.8937883191118 usec\nrounds: 548"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 118.75149041851222,
            "unit": "iter/sec",
            "range": "stddev: 0.00008945511288637175",
            "extra": "mean: 8.420946941177165 msec\nrounds: 119"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 18.23548087437305,
            "unit": "iter/sec",
            "range": "stddev: 0.00022646240470758185",
            "extra": "mean: 54.838148052642495 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 117.58044517855888,
            "unit": "iter/sec",
            "range": "stddev: 0.0003670613007971961",
            "extra": "mean: 8.504815562497571 msec\nrounds: 112"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 109.34098384904783,
            "unit": "iter/sec",
            "range": "stddev: 0.00017370193961059875",
            "extra": "mean: 9.14570150000263 msec\nrounds: 108"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 119.01315214348553,
            "unit": "iter/sec",
            "range": "stddev: 0.0001135290560489908",
            "extra": "mean: 8.402432689072652 msec\nrounds: 119"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 160.75873723840465,
            "unit": "iter/sec",
            "range": "stddev: 0.00004992478823178364",
            "extra": "mean: 6.220501710690868 msec\nrounds: 159"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 1149.286119940245,
            "unit": "iter/sec",
            "range": "stddev: 0.00002786224852289702",
            "extra": "mean: 870.1053485723756 usec\nrounds: 1050"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 119.73963603746583,
            "unit": "iter/sec",
            "range": "stddev: 0.0000701890015801729",
            "extra": "mean: 8.351453479340007 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 119.61136827093328,
            "unit": "iter/sec",
            "range": "stddev: 0.00008535984036534499",
            "extra": "mean: 8.360409336133392 msec\nrounds: 119"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 27960.24370681888,
            "unit": "iter/sec",
            "range": "stddev: 0.0000025842374183026146",
            "extra": "mean: 35.76506737515032 usec\nrounds: 25692"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 4.573754978705926,
            "unit": "iter/sec",
            "range": "stddev: 0.0006772235907539387",
            "extra": "mean: 218.63873440000816 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 3.2126157848975447,
            "unit": "iter/sec",
            "range": "stddev: 0.002733261407703429",
            "extra": "mean: 311.2728278000077 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.2409433352514472,
            "unit": "iter/sec",
            "range": "stddev: 0.004195066202882857",
            "extra": "mean: 805.838567800015 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.12687692079046514,
            "unit": "iter/sec",
            "range": "stddev: 0.3614708216961158",
            "extra": "mean: 7.8816540767999985 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.2431529763332143,
            "unit": "iter/sec",
            "range": "stddev: 0.0020267865154882467",
            "extra": "mean: 804.406230799998 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 2.9533312597874835,
            "unit": "iter/sec",
            "range": "stddev: 0.0015605151175403184",
            "extra": "mean: 338.6006892000182 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 1.025389782428002,
            "unit": "iter/sec",
            "range": "stddev: 0.001457941552082519",
            "extra": "mean: 975.2388966000012 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 2.3313882480358292,
            "unit": "iter/sec",
            "range": "stddev: 0.0009591672740887963",
            "extra": "mean: 428.92898720000403 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 3.1041266630491178,
            "unit": "iter/sec",
            "range": "stddev: 0.0014999984263373216",
            "extra": "mean: 322.15180260000125 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.24493365472425,
            "unit": "iter/sec",
            "range": "stddev: 0.0017802562793370884",
            "extra": "mean: 803.2556564000174 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.2525195282023251,
            "unit": "iter/sec",
            "range": "stddev: 0.0015926103149145852",
            "extra": "mean: 798.3907455999883 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 11471.064032664426,
            "unit": "iter/sec",
            "range": "stddev: 0.0000029805365935391493",
            "extra": "mean: 87.17587114433763 usec\nrounds: 10050"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 3.9740082754651502,
            "unit": "iter/sec",
            "range": "stddev: 0.001006601869484979",
            "extra": "mean: 251.63510760000918 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 27.52789053853087,
            "unit": "iter/sec",
            "range": "stddev: 0.0012235127270581762",
            "extra": "mean: 36.32679367858925 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 17.005302208824855,
            "unit": "iter/sec",
            "range": "stddev: 0.0012232502661107757",
            "extra": "mean: 58.80518838889278 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.46437561292529,
            "unit": "iter/sec",
            "range": "stddev: 0.0011263535273194102",
            "extra": "mean: 183.00352516664967 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 16.739539956285345,
            "unit": "iter/sec",
            "range": "stddev: 0.0008239951397800718",
            "extra": "mean: 59.7387982352837 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 20.66346397734523,
            "unit": "iter/sec",
            "range": "stddev: 0.0014389096021600978",
            "extra": "mean: 48.39459642857405 msec\nrounds: 21"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 16.87591942645479,
            "unit": "iter/sec",
            "range": "stddev: 0.0007613195276226962",
            "extra": "mean: 59.25603072223692 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 16.326470684489422,
            "unit": "iter/sec",
            "range": "stddev: 0.001077958281131764",
            "extra": "mean: 61.25022482354539 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 26.430013625834434,
            "unit": "iter/sec",
            "range": "stddev: 0.0008203109194953375",
            "extra": "mean: 37.83577315384106 msec\nrounds: 26"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 16.711099579977382,
            "unit": "iter/sec",
            "range": "stddev: 0.0008948247342210712",
            "extra": "mean: 59.840466823509495 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 16.78975975327925,
            "unit": "iter/sec",
            "range": "stddev: 0.0014100203044432116",
            "extra": "mean: 59.56011370589669 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 21592.60173652863,
            "unit": "iter/sec",
            "range": "stddev: 0.0000024261220841374705",
            "extra": "mean: 46.312158775581004 usec\nrounds: 17635"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 25.67412804039505,
            "unit": "iter/sec",
            "range": "stddev: 0.014607625269874112",
            "extra": "mean: 38.949716166664906 msec\nrounds: 12"
          }
        ]
      }
    ]
  }
}