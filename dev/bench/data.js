window.BENCHMARK_DATA = {
  "lastUpdate": 1773945451330,
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
          "id": "ec7504dfab06aa78aa58fb468f29eb4e518c6ef7",
          "message": "ci: add skip-existing to PyPI publish step (#201)\n\n* ci: add skip-existing to PyPI publish step\n\nThe v0.8.0 release deployment failed because the last wheel was\nalready uploaded to PyPI (400 Bad Request on duplicate). Adding\nskip-existing prevents this from marking the workflow as failed.\n\n* ci: add manual PyPI publish option to workflow dispatch",
          "timestamp": "2026-03-19T19:21:35+01:00",
          "tree_id": "3c6faa2806ec079e4ff0b20a508ed3735e0ef01d",
          "url": "https://github.com/kmarchais/mmgpy/commit/ec7504dfab06aa78aa58fb468f29eb4e518c6ef7"
        },
        "date": 1773945450156,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 1.1109776900970594,
            "unit": "iter/sec",
            "range": "stddev: 0.01720428407750174",
            "extra": "mean: 900.108083999991 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.5508529915056098,
            "unit": "iter/sec",
            "range": "stddev: 0.017482474481822524",
            "extra": "mean: 1.8153663779999931 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.163448632836735,
            "unit": "iter/sec",
            "range": "stddev: 0.003147028647580154",
            "extra": "mean: 859.5136663333278 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.2406315953720262,
            "unit": "iter/sec",
            "range": "stddev: 0.002557358903007126",
            "extra": "mean: 806.0410549999991 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 1.1527033858767641,
            "unit": "iter/sec",
            "range": "stddev: 0.02314359924987249",
            "extra": "mean: 867.5258633333366 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.5540316812590094,
            "unit": "iter/sec",
            "range": "stddev: 0.007282203900308759",
            "extra": "mean: 1.8049509329999864 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.2568388682309963,
            "unit": "iter/sec",
            "range": "stddev: 0.003025321662352859",
            "extra": "mean: 795.646940333332 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.2595269114646863,
            "unit": "iter/sec",
            "range": "stddev: 0.0038110750370775846",
            "extra": "mean: 793.948895333339 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 28.783926398856718,
            "unit": "iter/sec",
            "range": "stddev: 0.0008609265992307332",
            "extra": "mean: 34.74161190322247 msec\nrounds: 31"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.0478668244452687,
            "unit": "iter/sec",
            "range": "stddev: 0.0034017409848990207",
            "extra": "mean: 954.3197443333421 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 117.7646474012092,
            "unit": "iter/sec",
            "range": "stddev: 0.00020584811069245196",
            "extra": "mean: 8.491512708335353 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 11.93246583413378,
            "unit": "iter/sec",
            "range": "stddev: 0.0014980910620242865",
            "extra": "mean: 83.80497492307242 msec\nrounds: 13"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 0.9898055812197687,
            "unit": "iter/sec",
            "range": "stddev: 0.0021194325619495417",
            "extra": "mean: 1.010299415333331 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 16.80004601196595,
            "unit": "iter/sec",
            "range": "stddev: 0.0023727866117910328",
            "extra": "mean: 59.52364650000024 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 343.45917012257917,
            "unit": "iter/sec",
            "range": "stddev: 0.0005127382104626355",
            "extra": "mean: 2.911554231156804 msec\nrounds: 398"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 28.972834892303524,
            "unit": "iter/sec",
            "range": "stddev: 0.0004005432796629975",
            "extra": "mean: 34.515089866668326 msec\nrounds: 30"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 145.53808721875166,
            "unit": "iter/sec",
            "range": "stddev: 0.0003387254380990598",
            "extra": "mean: 6.871053612907153 msec\nrounds: 155"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 252.5455406691911,
            "unit": "iter/sec",
            "range": "stddev: 0.00009270395782351355",
            "extra": "mean: 3.959681875000509 msec\nrounds: 256"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 267.70970950093266,
            "unit": "iter/sec",
            "range": "stddev: 0.00021810114191251825",
            "extra": "mean: 3.7353893583621254 msec\nrounds: 293"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 73.09390207475569,
            "unit": "iter/sec",
            "range": "stddev: 0.0002148411341218045",
            "extra": "mean: 13.681031818184573 msec\nrounds: 77"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 872.5456299792926,
            "unit": "iter/sec",
            "range": "stddev: 0.000022251455208455742",
            "extra": "mean: 1.1460718679248123 msec\nrounds: 901"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 32.24255064885335,
            "unit": "iter/sec",
            "range": "stddev: 0.0002967579274236186",
            "extra": "mean: 31.0149160000021 msec\nrounds: 35"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 1637.4712604512113,
            "unit": "iter/sec",
            "range": "stddev: 0.000044875979724108034",
            "extra": "mean: 610.6977411771161 usec\nrounds: 1785"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 74.3627789251582,
            "unit": "iter/sec",
            "range": "stddev: 0.00024184539210019552",
            "extra": "mean: 13.447587818180406 msec\nrounds: 77"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 93044.80419869893,
            "unit": "iter/sec",
            "range": "stddev: 0.000001003431536114153",
            "extra": "mean: 10.747510391493558 usec\nrounds: 94886"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
            "value": 27079.590666415475,
            "unit": "iter/sec",
            "range": "stddev: 0.000002226988545988766",
            "extra": "mean: 36.928180057027795 usec\nrounds: 27619"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
            "value": 6412.2140299032835,
            "unit": "iter/sec",
            "range": "stddev: 0.000004826599506384295",
            "extra": "mean: 155.95237391274088 usec\nrounds: 6555"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 34.231081825621594,
            "unit": "iter/sec",
            "range": "stddev: 0.00037660142583912016",
            "extra": "mean: 29.21321637142975 msec\nrounds: 35"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 34.053522292654065,
            "unit": "iter/sec",
            "range": "stddev: 0.00037385407232667017",
            "extra": "mean: 29.365537914288456 msec\nrounds: 35"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 33.79513865678783,
            "unit": "iter/sec",
            "range": "stddev: 0.00029762132641668917",
            "extra": "mean: 29.59005465714069 msec\nrounds: 35"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 3088.4439310432736,
            "unit": "iter/sec",
            "range": "stddev: 0.000007920876029381767",
            "extra": "mean: 323.78764916162845 usec\nrounds: 3161"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 2754.8795948245865,
            "unit": "iter/sec",
            "range": "stddev: 0.000010500443060525818",
            "extra": "mean: 362.9922708341356 usec\nrounds: 2832"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 2083.438884862105,
            "unit": "iter/sec",
            "range": "stddev: 0.000011129995131225629",
            "extra": "mean: 479.97568215982784 usec\nrounds: 2130"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 121.42349013081764,
            "unit": "iter/sec",
            "range": "stddev: 0.00019344502347815124",
            "extra": "mean: 8.23563874603368 msec\nrounds: 126"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 122.51073665766393,
            "unit": "iter/sec",
            "range": "stddev: 0.00015481143916356064",
            "extra": "mean: 8.162549889764644 msec\nrounds: 127"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 116.63611869518674,
            "unit": "iter/sec",
            "range": "stddev: 0.0003075337337572658",
            "extra": "mean: 8.573673500001911 msec\nrounds: 124"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 33.749551541983244,
            "unit": "iter/sec",
            "range": "stddev: 0.0005431058714317332",
            "extra": "mean: 29.6300233428594 msec\nrounds: 35"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 34.58311684960644,
            "unit": "iter/sec",
            "range": "stddev: 0.00024345469166650905",
            "extra": "mean: 28.915843657145096 msec\nrounds: 35"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 7162.707805823211,
            "unit": "iter/sec",
            "range": "stddev: 0.000005521530537748476",
            "extra": "mean: 139.612005279206 usec\nrounds: 7387"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 1006009.5034488863,
            "unit": "iter/sec",
            "range": "stddev: 1.1246041047948107e-7",
            "extra": "mean: 994.0263949512563 nsec\nrounds: 103660"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3364920.939826752,
            "unit": "iter/sec",
            "range": "stddev: 4.2263082842459193e-8",
            "extra": "mean: 297.1838024971507 nsec\nrounds: 194213"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1638528.8054916225,
            "unit": "iter/sec",
            "range": "stddev: 7.592749091029026e-8",
            "extra": "mean: 610.303582487194 nsec\nrounds: 169463"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 154479.27326104147,
            "unit": "iter/sec",
            "range": "stddev: 8.71117075174754e-7",
            "extra": "mean: 6.473360334303131 usec\nrounds: 173883"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 1047.5430214728597,
            "unit": "iter/sec",
            "range": "stddev: 0.000023204719278963078",
            "extra": "mean: 954.6147313300665 usec\nrounds: 1098"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 116.47775769672215,
            "unit": "iter/sec",
            "range": "stddev: 0.00018152419536961146",
            "extra": "mean: 8.585330107433391 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 18.219989810190945,
            "unit": "iter/sec",
            "range": "stddev: 0.00017694467659663723",
            "extra": "mean: 54.8847727368471 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 115.12262943272336,
            "unit": "iter/sec",
            "range": "stddev: 0.00015166142707667693",
            "extra": "mean: 8.68638950419727 msec\nrounds: 119"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 105.26878924125288,
            "unit": "iter/sec",
            "range": "stddev: 0.00022750536672680978",
            "extra": "mean: 9.499491798164604 msec\nrounds: 109"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 113.97077491667437,
            "unit": "iter/sec",
            "range": "stddev: 0.00017633395070694113",
            "extra": "mean: 8.774179176469703 msec\nrounds: 119"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 156.99761929004538,
            "unit": "iter/sec",
            "range": "stddev: 0.00011741486171062172",
            "extra": "mean: 6.369523337500738 msec\nrounds: 160"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 1078.8318182330456,
            "unit": "iter/sec",
            "range": "stddev: 0.000022412724514463335",
            "extra": "mean: 926.9285379790155 usec\nrounds: 1119"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 118.39700974300123,
            "unit": "iter/sec",
            "range": "stddev: 0.00005350089999991437",
            "extra": "mean: 8.446159258334754 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 117.33680592916858,
            "unit": "iter/sec",
            "range": "stddev: 0.00016497922533956154",
            "extra": "mean: 8.522475041664753 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 28603.22981122216,
            "unit": "iter/sec",
            "range": "stddev: 0.000002275134075156015",
            "extra": "mean: 34.96108679334042 usec\nrounds: 29288"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 49.089819322239165,
            "unit": "iter/sec",
            "range": "stddev: 0.015782884756628944",
            "extra": "mean: 20.370822582086177 msec\nrounds: 67"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 3.365734507758909,
            "unit": "iter/sec",
            "range": "stddev: 0.002510141119464717",
            "extra": "mean: 297.1119669999922 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.2840182685393886,
            "unit": "iter/sec",
            "range": "stddev: 0.0027155887092021693",
            "extra": "mean: 778.8051186666772 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.13406379715785646,
            "unit": "iter/sec",
            "range": "stddev: 0.020417969804042955",
            "extra": "mean: 7.459135286333321 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.2902789642215162,
            "unit": "iter/sec",
            "range": "stddev: 0.0030121126664876905",
            "extra": "mean: 775.0261980000156 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 3.1421848223638613,
            "unit": "iter/sec",
            "range": "stddev: 0.001270105096979246",
            "extra": "mean: 318.24989825000216 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 1.0301864205052442,
            "unit": "iter/sec",
            "range": "stddev: 0.0015047805656252364",
            "extra": "mean: 970.6980989999465 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 2.3869812381930005,
            "unit": "iter/sec",
            "range": "stddev: 0.007376890936123818",
            "extra": "mean: 418.9391956666668 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 3.199801082445677,
            "unit": "iter/sec",
            "range": "stddev: 0.011196482954085379",
            "extra": "mean: 312.5194267500149 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.2842493467042368,
            "unit": "iter/sec",
            "range": "stddev: 0.0009479460004377017",
            "extra": "mean: 778.6649863332968 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.2677601501954656,
            "unit": "iter/sec",
            "range": "stddev: 0.0115822634854029",
            "extra": "mean: 788.7927380000216 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 11429.48664291325,
            "unit": "iter/sec",
            "range": "stddev: 0.000004098140662447459",
            "extra": "mean: 87.49299345128865 usec\nrounds: 11605"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 290.21187312666774,
            "unit": "iter/sec",
            "range": "stddev: 0.000029497759248259406",
            "extra": "mean: 3.4457584013578026 msec\nrounds: 294"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 28.850429431261286,
            "unit": "iter/sec",
            "range": "stddev: 0.0017365573195348288",
            "extra": "mean: 34.661529124985435 msec\nrounds: 32"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 17.29038451204723,
            "unit": "iter/sec",
            "range": "stddev: 0.0014912418724321603",
            "extra": "mean: 57.835613736828186 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.544005380080569,
            "unit": "iter/sec",
            "range": "stddev: 0.0017020048234298293",
            "extra": "mean: 180.37500533332226 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 17.123432593864838,
            "unit": "iter/sec",
            "range": "stddev: 0.0014346758959096506",
            "extra": "mean: 58.39950573685153 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 21.453848012491775,
            "unit": "iter/sec",
            "range": "stddev: 0.0018579383256376605",
            "extra": "mean: 46.611684739154356 msec\nrounds: 23"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 17.54299136014145,
            "unit": "iter/sec",
            "range": "stddev: 0.0016927889697246888",
            "extra": "mean: 57.00282121052911 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 17.360815853330536,
            "unit": "iter/sec",
            "range": "stddev: 0.0019349970236254026",
            "extra": "mean: 57.60097961111418 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 28.272949170851188,
            "unit": "iter/sec",
            "range": "stddev: 0.001618731686798376",
            "extra": "mean: 35.3694973225849 msec\nrounds: 31"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 17.23857849498525,
            "unit": "iter/sec",
            "range": "stddev: 0.0019341763158199203",
            "extra": "mean: 58.00942347368738 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 17.24209863946314,
            "unit": "iter/sec",
            "range": "stddev: 0.001670184175849142",
            "extra": "mean: 57.99758027779944 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 21703.622381791152,
            "unit": "iter/sec",
            "range": "stddev: 0.0000023952652227630636",
            "extra": "mean: 46.07525796426395 usec\nrounds: 22162"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 45.50713375186348,
            "unit": "iter/sec",
            "range": "stddev: 0.016517900533910584",
            "extra": "mean: 21.974576677421503 msec\nrounds: 62"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 172.70886736708042,
            "unit": "iter/sec",
            "range": "stddev: 0.000037423269347093095",
            "extra": "mean: 5.790090660918824 msec\nrounds: 174"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.503205740254424,
            "unit": "iter/sec",
            "range": "stddev: 0.000262784237817651",
            "extra": "mean: 68.95027333332564 msec\nrounds: 15"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
            "value": 1.1355988333474032,
            "unit": "iter/sec",
            "range": "stddev: 0.0079440457792872",
            "extra": "mean: 880.5926623333183 msec\nrounds: 3"
          }
        ]
      }
    ]
  }
}