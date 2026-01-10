window.BENCHMARK_DATA = {
  "lastUpdate": 1768079896164,
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
          "id": "63720deda0533eac3d9cec3dcfe5bf6b2906714b",
          "message": "feat(validation): improve duplicate vertex detection with KD-tree (#137)\n\nReplace the O(n²) worst-case algorithm with scipy.spatial.cKDTree\nfor O(n log n) duplicate vertex detection. This removes the 10,000\nvertex limit that was previously skipping validation on large meshes.\n\nPerformance benchmarks:\n- 10k vertices: 2.66ms\n- 100k vertices: 31.9ms\n- 1M vertices: 472ms\n\nCloses #119",
          "timestamp": "2026-01-10T22:08:13+01:00",
          "tree_id": "a3d1618506f4b66e6a54e8e90fae0875c71f1338",
          "url": "https://github.com/kmarchais/mmgpy/commit/63720deda0533eac3d9cec3dcfe5bf6b2906714b"
        },
        "date": 1768079895511,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 0.6124630044095473,
            "unit": "iter/sec",
            "range": "stddev: 0.008680055119910633",
            "extra": "mean: 1.632751681000002 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.6110551157855727,
            "unit": "iter/sec",
            "range": "stddev: 0.016499014093299312",
            "extra": "mean: 1.636513587999995 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.1753881018871022,
            "unit": "iter/sec",
            "range": "stddev: 0.004225472618300907",
            "extra": "mean: 850.7828166666703 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.2330633548790308,
            "unit": "iter/sec",
            "range": "stddev: 0.002005364866771085",
            "extra": "mean: 810.9883373333275 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 0.6121737161485356,
            "unit": "iter/sec",
            "range": "stddev: 0.006041419952048294",
            "extra": "mean: 1.6335232526666725 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.6079113015068004,
            "unit": "iter/sec",
            "range": "stddev: 0.011887047280318154",
            "extra": "mean: 1.64497682066668 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.2256223174632848,
            "unit": "iter/sec",
            "range": "stddev: 0.002769680407846137",
            "extra": "mean: 815.9120356666941 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.2410183915562638,
            "unit": "iter/sec",
            "range": "stddev: 0.002013638127103408",
            "extra": "mean: 805.789830999989 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 1.2523236118441619,
            "unit": "iter/sec",
            "range": "stddev: 0.0029663406088446553",
            "extra": "mean: 798.5156476666665 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.265673427869077,
            "unit": "iter/sec",
            "range": "stddev: 0.004845585371020194",
            "extra": "mean: 790.0932246666722 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 117.84550542719282,
            "unit": "iter/sec",
            "range": "stddev: 0.00013908755162375194",
            "extra": "mean: 8.485686377049134 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 1.2060675284228326,
            "unit": "iter/sec",
            "range": "stddev: 0.011882661502485929",
            "extra": "mean: 829.140969666677 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 1.1957194468220456,
            "unit": "iter/sec",
            "range": "stddev: 0.005870383534431345",
            "extra": "mean: 836.3165813333353 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 16.820735806923242,
            "unit": "iter/sec",
            "range": "stddev: 0.0014907628087492382",
            "extra": "mean: 59.45043138888195 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 363.29680233434874,
            "unit": "iter/sec",
            "range": "stddev: 0.00028347651875248206",
            "extra": "mean: 2.7525703325064823 msec\nrounds: 403"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 23.297059116610036,
            "unit": "iter/sec",
            "range": "stddev: 0.00025226278327914516",
            "extra": "mean: 42.92387270833823 msec\nrounds: 24"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 162.03788076874963,
            "unit": "iter/sec",
            "range": "stddev: 0.0002967398101194704",
            "extra": "mean: 6.171396436782197 msec\nrounds: 174"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 252.3463968038277,
            "unit": "iter/sec",
            "range": "stddev: 0.00008051169971823197",
            "extra": "mean: 3.9628067318012588 msec\nrounds: 261"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 261.8201515435663,
            "unit": "iter/sec",
            "range": "stddev: 0.0003978448352883167",
            "extra": "mean: 3.819415709999703 msec\nrounds: 300"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 65.92544254950641,
            "unit": "iter/sec",
            "range": "stddev: 0.00048389742461629303",
            "extra": "mean: 15.16865054412118 msec\nrounds: 68"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 903.0032348186602,
            "unit": "iter/sec",
            "range": "stddev: 0.00014351170848085455",
            "extra": "mean: 1.1074157449732929 msec\nrounds: 945"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 27.27402600340144,
            "unit": "iter/sec",
            "range": "stddev: 0.0003757896640943817",
            "extra": "mean: 36.66492067857113 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 1957.7066790454144,
            "unit": "iter/sec",
            "range": "stddev: 0.00003865645477465045",
            "extra": "mean: 510.8017512039158 usec\nrounds: 2078"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 67.26209156217297,
            "unit": "iter/sec",
            "range": "stddev: 0.0002390016295138633",
            "extra": "mean: 14.867215347825768 msec\nrounds: 69"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 90968.2359130822,
            "unit": "iter/sec",
            "range": "stddev: 9.696656769169936e-7",
            "extra": "mean: 10.992848107502867 usec\nrounds: 92842"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_elements_3d",
            "value": 27524.54535434302,
            "unit": "iter/sec",
            "range": "stddev: 0.000001945040602756939",
            "extra": "mean: 36.331208640371344 usec\nrounds: 28101"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_with_refs",
            "value": 83950.98204805315,
            "unit": "iter/sec",
            "range": "stddev: 0.000003365475609472728",
            "extra": "mean: 11.91171294967824 usec\nrounds: 87253"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 26.694619721609065,
            "unit": "iter/sec",
            "range": "stddev: 0.0005563741667471685",
            "extra": "mean: 37.46073217857112 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 26.586977064535283,
            "unit": "iter/sec",
            "range": "stddev: 0.00030420903335072214",
            "extra": "mean: 37.61239939285588 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 25.797643181781748,
            "unit": "iter/sec",
            "range": "stddev: 0.00027141086149738795",
            "extra": "mean: 38.763230925924205 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 2983.9179683684492,
            "unit": "iter/sec",
            "range": "stddev: 0.000013410020221967777",
            "extra": "mean: 335.12985631665384 usec\nrounds: 3111"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 2646.43725050208,
            "unit": "iter/sec",
            "range": "stddev: 0.000019335250125914037",
            "extra": "mean: 377.86650705973886 usec\nrounds: 3258"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 2013.0920399558356,
            "unit": "iter/sec",
            "range": "stddev: 0.00004811029081524333",
            "extra": "mean: 496.7482758622097 usec\nrounds: 2262"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 92.95441131002735,
            "unit": "iter/sec",
            "range": "stddev: 0.0013444583039011165",
            "extra": "mean: 10.757961735293419 msec\nrounds: 102"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 97.14504705312315,
            "unit": "iter/sec",
            "range": "stddev: 0.00015142203156731516",
            "extra": "mean: 10.293885589999832 msec\nrounds: 100"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 95.49750502458255,
            "unit": "iter/sec",
            "range": "stddev: 0.00020753631538983166",
            "extra": "mean: 10.471477759995764 msec\nrounds: 100"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 26.61611122324414,
            "unit": "iter/sec",
            "range": "stddev: 0.00026499089136780183",
            "extra": "mean: 37.57122862962374 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 26.390128691430704,
            "unit": "iter/sec",
            "range": "stddev: 0.00030835185033274313",
            "extra": "mean: 37.8929565555592 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 7105.961105589207,
            "unit": "iter/sec",
            "range": "stddev: 0.000009435474312461115",
            "extra": "mean: 140.72691718132938 usec\nrounds: 8899"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 1049046.9807647727,
            "unit": "iter/sec",
            "range": "stddev: 9.958049030180988e-8",
            "extra": "mean: 953.2461542103514 nsec\nrounds: 108144"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3390022.350787639,
            "unit": "iter/sec",
            "range": "stddev: 3.874139466938947e-8",
            "extra": "mean: 294.98330586748483 nsec\nrounds: 198453"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1583476.7285878186,
            "unit": "iter/sec",
            "range": "stddev: 6.829356672383795e-8",
            "extra": "mean: 631.5217533331376 nsec\nrounds: 163106"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 164601.60799879825,
            "unit": "iter/sec",
            "range": "stddev: 8.696042505671928e-7",
            "extra": "mean: 6.075274793228636 usec\nrounds: 172981"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 1121.0643461846655,
            "unit": "iter/sec",
            "range": "stddev: 0.00002136084149673875",
            "extra": "mean: 892.0094581576112 usec\nrounds: 1183"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 119.19004032942024,
            "unit": "iter/sec",
            "range": "stddev: 0.00011152832734433173",
            "extra": "mean: 8.389962762292692 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 18.284348250781854,
            "unit": "iter/sec",
            "range": "stddev: 0.00026730068985197453",
            "extra": "mean: 54.69158573684677 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 119.37152017896028,
            "unit": "iter/sec",
            "range": "stddev: 0.0000934068085869331",
            "extra": "mean: 8.377207549177664 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 108.46482835538224,
            "unit": "iter/sec",
            "range": "stddev: 0.00023029133236747673",
            "extra": "mean: 9.21957850450402 msec\nrounds: 111"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 118.7753818852816,
            "unit": "iter/sec",
            "range": "stddev: 0.00012949712098443646",
            "extra": "mean: 8.41925308197151 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 159.87714883905238,
            "unit": "iter/sec",
            "range": "stddev: 0.00011457871592625979",
            "extra": "mean: 6.254802560975713 msec\nrounds: 164"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 1141.1862465353468,
            "unit": "iter/sec",
            "range": "stddev: 0.0001462863234087804",
            "extra": "mean: 876.2811530861071 usec\nrounds: 1215"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 117.50390009412463,
            "unit": "iter/sec",
            "range": "stddev: 0.0010309263174442986",
            "extra": "mean: 8.510355819670375 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 119.88866658867936,
            "unit": "iter/sec",
            "range": "stddev: 0.0002720050524486081",
            "extra": "mean: 8.341071999998592 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 28047.339162251523,
            "unit": "iter/sec",
            "range": "stddev: 0.00000216452485957617",
            "extra": "mean: 35.65400604367791 usec\nrounds: 28790"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 46.35981677378224,
            "unit": "iter/sec",
            "range": "stddev: 0.016667210506203133",
            "extra": "mean: 21.570404492312996 msec\nrounds: 65"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 3.220835536126631,
            "unit": "iter/sec",
            "range": "stddev: 0.0008746490376587316",
            "extra": "mean: 310.47844224998755 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.232573976963925,
            "unit": "iter/sec",
            "range": "stddev: 0.0021247065255721423",
            "extra": "mean: 811.3103299999883 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.12744612067665786,
            "unit": "iter/sec",
            "range": "stddev: 0.09296883613439083",
            "extra": "mean: 7.846453031999999 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.2476720669445196,
            "unit": "iter/sec",
            "range": "stddev: 0.003672025483627026",
            "extra": "mean: 801.492656999964 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 2.9752615039156467,
            "unit": "iter/sec",
            "range": "stddev: 0.004061620562132222",
            "extra": "mean: 336.1049099999889 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 1.0148513636091443,
            "unit": "iter/sec",
            "range": "stddev: 0.006647073059691764",
            "extra": "mean: 985.3659716667001 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 2.326516575658189,
            "unit": "iter/sec",
            "range": "stddev: 0.0005736425099280985",
            "extra": "mean: 429.8271546666683 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 3.17210577572621,
            "unit": "iter/sec",
            "range": "stddev: 0.003005128845196845",
            "extra": "mean: 315.24799949997373 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.243895602543828,
            "unit": "iter/sec",
            "range": "stddev: 0.003340495118015922",
            "extra": "mean: 803.9259869999947 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.2461253124914327,
            "unit": "iter/sec",
            "range": "stddev: 0.002517530558279378",
            "extra": "mean: 802.4875106666892 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 11436.48044195161,
            "unit": "iter/sec",
            "range": "stddev: 0.0000029784943911641393",
            "extra": "mean: 87.43948849261113 usec\nrounds: 11601"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 282.74441187748937,
            "unit": "iter/sec",
            "range": "stddev: 0.00006999683428228251",
            "extra": "mean: 3.5367630905939573 msec\nrounds: 287"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 26.010209094393254,
            "unit": "iter/sec",
            "range": "stddev: 0.0015999871575607509",
            "extra": "mean: 38.44644217856593 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 16.326989781994584,
            "unit": "iter/sec",
            "range": "stddev: 0.00134445562146845",
            "extra": "mean: 61.24827744443135 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.448599521719841,
            "unit": "iter/sec",
            "range": "stddev: 0.0023245775296387946",
            "extra": "mean: 183.53340083331204 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 16.622835343557384,
            "unit": "iter/sec",
            "range": "stddev: 0.0016231914114893222",
            "extra": "mean: 60.158208833343 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 20.381666965904532,
            "unit": "iter/sec",
            "range": "stddev: 0.002103416944231986",
            "extra": "mean: 49.063700318175634 msec\nrounds: 22"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 16.300385341203853,
            "unit": "iter/sec",
            "range": "stddev: 0.002296895681456315",
            "extra": "mean: 61.34824294443004 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 16.048835822801003,
            "unit": "iter/sec",
            "range": "stddev: 0.001638009509593487",
            "extra": "mean: 62.309815555547885 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 26.47282637929803,
            "unit": "iter/sec",
            "range": "stddev: 0.0016359616600965952",
            "extra": "mean: 37.77458385712862 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 16.54344157073182,
            "unit": "iter/sec",
            "range": "stddev: 0.0016978328866350738",
            "extra": "mean: 60.44691461111521 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 15.727377697595676,
            "unit": "iter/sec",
            "range": "stddev: 0.0064625147612665575",
            "extra": "mean: 63.58339064705459 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 21543.32689074308,
            "unit": "iter/sec",
            "range": "stddev: 0.0000028188323852818736",
            "extra": "mean: 46.41808598418885 usec\nrounds: 22039"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 44.682860437799576,
            "unit": "iter/sec",
            "range": "stddev: 0.015942160945043107",
            "extra": "mean: 22.379945916668476 msec\nrounds: 60"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 163.01704568649544,
            "unit": "iter/sec",
            "range": "stddev: 0.00003388021171383095",
            "extra": "mean: 6.134327829269706 msec\nrounds: 164"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 13.338235045792693,
            "unit": "iter/sec",
            "range": "stddev: 0.0007737807085548883",
            "extra": "mean: 74.97243799999102 msec\nrounds: 14"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
            "value": 1.0627560723376175,
            "unit": "iter/sec",
            "range": "stddev: 0.01240730700517313",
            "extra": "mean: 940.9496930000311 msec\nrounds: 3"
          }
        ]
      }
    ]
  }
}