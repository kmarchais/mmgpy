window.BENCHMARK_DATA = {
  "lastUpdate": 1768248266736,
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
          "id": "ce56afa65970d3cb2982120ca408dca5eea651e8",
          "message": "fix(checkpoint): save displacement and levelset fields during checkpoint (#154)\n\n* fix(checkpoint): save displacement and levelset fields during checkpoint\n\nPreviously, MeshCheckpoint only saved the metric field. Now it also saves\ndisplacement and levelset fields to prevent data loss during rollback.\n\nThe tensor field is intentionally not saved because it shares memory with\nmetric in MMG's internal representation - only one can be set at a time.\n\nCloses #115\n\n* test(checkpoint): add test documenting tensor field exclusion\n\nAdd test that verifies tensor field is intentionally not saved during\ncheckpoint due to memory overlap with metric in MMG's internal\nrepresentation. This serves as documentation and regression prevention.",
          "timestamp": "2026-01-12T20:54:05+01:00",
          "tree_id": "c415a8843c1ccbc6478d6a59de116e814cbb09a1",
          "url": "https://github.com/kmarchais/mmgpy/commit/ce56afa65970d3cb2982120ca408dca5eea651e8"
        },
        "date": 1768248265661,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 0.6045451938445006,
            "unit": "iter/sec",
            "range": "stddev: 0.008840164507010717",
            "extra": "mean: 1.6541360516666639 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.6056920013641333,
            "unit": "iter/sec",
            "range": "stddev: 0.028687057949564224",
            "extra": "mean: 1.6510041370000106 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.1592530827745924,
            "unit": "iter/sec",
            "range": "stddev: 0.004142194516287655",
            "extra": "mean: 862.6244043333221 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.2074651824697515,
            "unit": "iter/sec",
            "range": "stddev: 0.0032009977955538703",
            "extra": "mean: 828.1812300000221 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 0.5984631755308496,
            "unit": "iter/sec",
            "range": "stddev: 0.005739985386280062",
            "extra": "mean: 1.6709465860000137 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.6160221447262797,
            "unit": "iter/sec",
            "range": "stddev: 0.00967195436200772",
            "extra": "mean: 1.6233182663333234 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.2362170610886563,
            "unit": "iter/sec",
            "range": "stddev: 0.0024647271961310223",
            "extra": "mean: 808.9194296666354 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.229691849183087,
            "unit": "iter/sec",
            "range": "stddev: 0.00439399258476575",
            "extra": "mean: 813.2118633333411 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 1.2478278172108566,
            "unit": "iter/sec",
            "range": "stddev: 0.001511258433153472",
            "extra": "mean: 801.3926169999953 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.244035272286344,
            "unit": "iter/sec",
            "range": "stddev: 0.017501389805365194",
            "extra": "mean: 803.8357289999946 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 117.89055537545777,
            "unit": "iter/sec",
            "range": "stddev: 0.0001217125353126734",
            "extra": "mean: 8.482443710738325 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 1.192729602207674,
            "unit": "iter/sec",
            "range": "stddev: 0.005177993627251617",
            "extra": "mean: 838.4129966666857 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 1.1669609157319414,
            "unit": "iter/sec",
            "range": "stddev: 0.008799042456011404",
            "extra": "mean: 856.9267286666408 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 15.969164692757946,
            "unit": "iter/sec",
            "range": "stddev: 0.0017550124733090736",
            "extra": "mean: 62.620683000000774 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 350.1235635003343,
            "unit": "iter/sec",
            "range": "stddev: 0.0008970447336689465",
            "extra": "mean: 2.856134531485326 msec\nrounds: 397"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 22.53394439904433,
            "unit": "iter/sec",
            "range": "stddev: 0.000422948877217423",
            "extra": "mean: 44.377494782600515 msec\nrounds: 23"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 158.30765319350047,
            "unit": "iter/sec",
            "range": "stddev: 0.0015202301304759656",
            "extra": "mean: 6.3168140000009565 msec\nrounds: 173"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 256.1040640489121,
            "unit": "iter/sec",
            "range": "stddev: 0.00005093063177101916",
            "extra": "mean: 3.904662753844526 msec\nrounds: 260"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 261.07692232647946,
            "unit": "iter/sec",
            "range": "stddev: 0.0008822322393828644",
            "extra": "mean: 3.830288755853684 msec\nrounds: 299"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 65.84923367423649,
            "unit": "iter/sec",
            "range": "stddev: 0.00017990128519951686",
            "extra": "mean: 15.186205582089409 msec\nrounds: 67"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 928.4757791963514,
            "unit": "iter/sec",
            "range": "stddev: 0.000019509140619009068",
            "extra": "mean: 1.0770340189870724 msec\nrounds: 948"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 26.690191889471386,
            "unit": "iter/sec",
            "range": "stddev: 0.00039430632425798356",
            "extra": "mean: 37.46694681481384 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 1960.6221835196518,
            "unit": "iter/sec",
            "range": "stddev: 0.0000185509702219026",
            "extra": "mean: 510.0421735537181 usec\nrounds: 2057"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 66.43507114284483,
            "unit": "iter/sec",
            "range": "stddev: 0.00023798583693354657",
            "extra": "mean: 15.052290647056854 msec\nrounds: 68"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 89913.96215985509,
            "unit": "iter/sec",
            "range": "stddev: 9.474508832189105e-7",
            "extra": "mean: 11.121743230735765 usec\nrounds: 91997"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
            "value": 25625.660144901114,
            "unit": "iter/sec",
            "range": "stddev: 0.0000022896732556976485",
            "extra": "mean: 39.023384933128284 usec\nrounds: 26137"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
            "value": 6338.661998452479,
            "unit": "iter/sec",
            "range": "stddev: 0.0000069514619736566406",
            "extra": "mean: 157.7620009150417 usec\nrounds: 6554"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 27.30227211624763,
            "unit": "iter/sec",
            "range": "stddev: 0.00047455123086148876",
            "extra": "mean: 36.62698824999617 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 27.44736830363831,
            "unit": "iter/sec",
            "range": "stddev: 0.0004908227849341523",
            "extra": "mean: 36.433365448280306 msec\nrounds: 29"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 26.23481502671214,
            "unit": "iter/sec",
            "range": "stddev: 0.0011780359823139314",
            "extra": "mean: 38.11728800000326 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 3957.3328436422694,
            "unit": "iter/sec",
            "range": "stddev: 0.000008126167212991093",
            "extra": "mean: 252.69544905897152 usec\nrounds: 4093"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 3420.0317284854978,
            "unit": "iter/sec",
            "range": "stddev: 0.0000075951725378164995",
            "extra": "mean: 292.39494817284424 usec\nrounds: 3531"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 2393.914710035239,
            "unit": "iter/sec",
            "range": "stddev: 0.00000991516347603537",
            "extra": "mean: 417.72582615747405 usec\nrounds: 2462"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 99.07422143259926,
            "unit": "iter/sec",
            "range": "stddev: 0.00020430169929183678",
            "extra": "mean: 10.093442931371461 msec\nrounds: 102"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 96.38767171982236,
            "unit": "iter/sec",
            "range": "stddev: 0.0002905992769986806",
            "extra": "mean: 10.374770778847928 msec\nrounds: 104"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 96.15973058908097,
            "unit": "iter/sec",
            "range": "stddev: 0.00026017566355177496",
            "extra": "mean: 10.39936357843281 msec\nrounds: 102"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 27.0637307751065,
            "unit": "iter/sec",
            "range": "stddev: 0.0008672095665569516",
            "extra": "mean: 36.94982071429008 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 26.872328324330326,
            "unit": "iter/sec",
            "range": "stddev: 0.0006100419306017525",
            "extra": "mean: 37.213001714280026 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 9419.900757566968,
            "unit": "iter/sec",
            "range": "stddev: 0.0000051510096156899746",
            "extra": "mean: 106.15823093430194 usec\nrounds: 9795"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 1013291.4181284438,
            "unit": "iter/sec",
            "range": "stddev: 9.708269735698907e-8",
            "extra": "mean: 986.8829263816395 nsec\nrounds: 105619"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3289087.714510651,
            "unit": "iter/sec",
            "range": "stddev: 4.1124008927687e-8",
            "extra": "mean: 304.0356739615804 nsec\nrounds: 192716"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1548930.615633872,
            "unit": "iter/sec",
            "range": "stddev: 7.353353088374216e-8",
            "extra": "mean: 645.6067107891517 nsec\nrounds: 158178"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 157796.4727820718,
            "unit": "iter/sec",
            "range": "stddev: 8.246729662507814e-7",
            "extra": "mean: 6.337277268428373 usec\nrounds: 176367"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 1253.9499565042042,
            "unit": "iter/sec",
            "range": "stddev: 0.000024867341057332533",
            "extra": "mean: 797.4799909781306 usec\nrounds: 1330"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 113.47232917632232,
            "unit": "iter/sec",
            "range": "stddev: 0.00018808898715716278",
            "extra": "mean: 8.812721191667094 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 18.139736302287684,
            "unit": "iter/sec",
            "range": "stddev: 0.00015098832985670267",
            "extra": "mean: 55.1275930000088 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 116.97812207018652,
            "unit": "iter/sec",
            "range": "stddev: 0.00012023788384790446",
            "extra": "mean: 8.54860705833526 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 106.42959787226346,
            "unit": "iter/sec",
            "range": "stddev: 0.00012720310308468813",
            "extra": "mean: 9.395882536361713 msec\nrounds: 110"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 116.3179996661546,
            "unit": "iter/sec",
            "range": "stddev: 0.00017993912634357555",
            "extra": "mean: 8.59712170833499 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 159.14133201361287,
            "unit": "iter/sec",
            "range": "stddev: 0.00013021548813838246",
            "extra": "mean: 6.28372269697014 msec\nrounds: 165"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 1369.1665102676366,
            "unit": "iter/sec",
            "range": "stddev: 0.00001988110779768484",
            "extra": "mean: 730.3713554931503 usec\nrounds: 1429"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 118.86855653888645,
            "unit": "iter/sec",
            "range": "stddev: 0.00016108531918865342",
            "extra": "mean: 8.41265368333855 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 119.28890040416329,
            "unit": "iter/sec",
            "range": "stddev: 0.0001459721701951674",
            "extra": "mean: 8.383009622956498 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 27680.289128416647,
            "unit": "iter/sec",
            "range": "stddev: 0.0000022060051211899895",
            "extra": "mean: 36.126790271615974 usec\nrounds: 28413"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 46.21550767175021,
            "unit": "iter/sec",
            "range": "stddev: 0.017318055442594286",
            "extra": "mean: 21.63775863077367 msec\nrounds: 65"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 3.0700211922486496,
            "unit": "iter/sec",
            "range": "stddev: 0.00303465965609058",
            "extra": "mean: 325.73065050002015 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.2280989712712735,
            "unit": "iter/sec",
            "range": "stddev: 0.0050344335567218575",
            "extra": "mean: 814.2666213333314 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.12739317853213722,
            "unit": "iter/sec",
            "range": "stddev: 0.2789525018333654",
            "extra": "mean: 7.84971386633337 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.2313298877237364,
            "unit": "iter/sec",
            "range": "stddev: 0.00024488603483962385",
            "extra": "mean: 812.1300473333122 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 2.8840786021245015,
            "unit": "iter/sec",
            "range": "stddev: 0.0033470968619489215",
            "extra": "mean: 346.7311879999973 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 1.0092790725943148,
            "unit": "iter/sec",
            "range": "stddev: 0.0017589561995651239",
            "extra": "mean: 990.8062369999774 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 2.286897032269053,
            "unit": "iter/sec",
            "range": "stddev: 0.001422468919313958",
            "extra": "mean: 437.2737319999942 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 3.0845476207042832,
            "unit": "iter/sec",
            "range": "stddev: 0.004098736558630517",
            "extra": "mean: 324.19664825005157 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.2310302576675005,
            "unit": "iter/sec",
            "range": "stddev: 0.007995249152364476",
            "extra": "mean: 812.3277180000059 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.2274916929878203,
            "unit": "iter/sec",
            "range": "stddev: 0.0027785386233794033",
            "extra": "mean: 814.66946433333 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 11400.35526651704,
            "unit": "iter/sec",
            "range": "stddev: 0.000005532778951327281",
            "extra": "mean: 87.7165646703143 usec\nrounds: 11605"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 288.4209008225195,
            "unit": "iter/sec",
            "range": "stddev: 0.00003125741318106966",
            "extra": "mean: 3.467155109592256 msec\nrounds: 292"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 24.125835942569882,
            "unit": "iter/sec",
            "range": "stddev: 0.001612541057640158",
            "extra": "mean: 41.449340962959404 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 15.859438268806533,
            "unit": "iter/sec",
            "range": "stddev: 0.001052283187125453",
            "extra": "mean: 63.0539356470696 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.4024367323515365,
            "unit": "iter/sec",
            "range": "stddev: 0.0015305227929929186",
            "extra": "mean: 185.1016586666674 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 16.07181636308637,
            "unit": "iter/sec",
            "range": "stddev: 0.001887154151502657",
            "extra": "mean: 62.22072088235109 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 19.89238496334241,
            "unit": "iter/sec",
            "range": "stddev: 0.0023509014653732186",
            "extra": "mean: 50.27049304760567 msec\nrounds: 21"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 15.892587022633725,
            "unit": "iter/sec",
            "range": "stddev: 0.002203059050968137",
            "extra": "mean: 62.92241776469944 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 15.462805586888287,
            "unit": "iter/sec",
            "range": "stddev: 0.0013665223939874705",
            "extra": "mean: 64.67131688236135 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 25.045913565792905,
            "unit": "iter/sec",
            "range": "stddev: 0.0014809063220163551",
            "extra": "mean: 39.926672962960936 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 15.856139571235644,
            "unit": "iter/sec",
            "range": "stddev: 0.0012778106086746243",
            "extra": "mean: 63.06705333333992 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 16.20438997418171,
            "unit": "iter/sec",
            "range": "stddev: 0.0016757332837006793",
            "extra": "mean: 61.71167205882418 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 21844.075865439096,
            "unit": "iter/sec",
            "range": "stddev: 0.0000027180294515931868",
            "extra": "mean: 45.77900233271775 usec\nrounds: 22295"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 45.39178110232849,
            "unit": "iter/sec",
            "range": "stddev: 0.015944688804519914",
            "extra": "mean: 22.030419950820182 msec\nrounds: 61"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 173.2649994920183,
            "unit": "iter/sec",
            "range": "stddev: 0.000029794773415065122",
            "extra": "mean: 5.771506091431158 msec\nrounds: 175"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.361471306731346,
            "unit": "iter/sec",
            "range": "stddev: 0.0005620789596679674",
            "extra": "mean: 69.63074873333426 msec\nrounds: 15"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
            "value": 1.1358984803425347,
            "unit": "iter/sec",
            "range": "stddev: 0.00999168799151726",
            "extra": "mean: 880.3603643333039 msec\nrounds: 3"
          }
        ]
      }
    ]
  }
}