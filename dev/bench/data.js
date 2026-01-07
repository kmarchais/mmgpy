window.BENCHMARK_DATA = {
  "lastUpdate": 1767825156237,
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
          "id": "c5aa76962868fbcd7bd0117a567d6b7fb3e841c9",
          "message": "docs: add CONTRIBUTING.md and GitHub templates (#94)\n\nAdd comprehensive contribution guide covering development setup,\nproject architecture, coding standards, testing, and C++ bindings\ndevelopment. Include PR template and issue templates for bugs\nand feature requests.",
          "timestamp": "2026-01-07T23:24:55+01:00",
          "tree_id": "f0fc306c349fd24bfd3792134528ba8275b444fb",
          "url": "https://github.com/kmarchais/mmgpy/commit/c5aa76962868fbcd7bd0117a567d6b7fb3e841c9"
        },
        "date": 1767825155851,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 0.644835187267043,
            "unit": "iter/sec",
            "range": "stddev: 0.014361279395562847",
            "extra": "mean: 1.5507838587999914 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.6402085775371331,
            "unit": "iter/sec",
            "range": "stddev: 0.015762925197531582",
            "extra": "mean: 1.561990943400002 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.2012681383149146,
            "unit": "iter/sec",
            "range": "stddev: 0.002418384980598992",
            "extra": "mean: 832.4536113999955 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.2669787890874349,
            "unit": "iter/sec",
            "range": "stddev: 0.0019746351373476326",
            "extra": "mean: 789.2791960000125 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 0.6437095155572251,
            "unit": "iter/sec",
            "range": "stddev: 0.012141418471599677",
            "extra": "mean: 1.5534957552000037 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.6483363167423664,
            "unit": "iter/sec",
            "range": "stddev: 0.010903695281777176",
            "extra": "mean: 1.5424093547999973 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.2583846490051251,
            "unit": "iter/sec",
            "range": "stddev: 0.0013256210803433755",
            "extra": "mean: 794.6695796000029 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.2587435654284496,
            "unit": "iter/sec",
            "range": "stddev: 0.002504359090075618",
            "extra": "mean: 794.4429886000023 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 1.3986621240116262,
            "unit": "iter/sec",
            "range": "stddev: 0.00235771509756406",
            "extra": "mean: 714.9689570000021 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.3899984999803427,
            "unit": "iter/sec",
            "range": "stddev: 0.0032329588165169593",
            "extra": "mean: 719.425236799998 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 120.46273370160984,
            "unit": "iter/sec",
            "range": "stddev: 0.000054347597374614923",
            "extra": "mean: 8.301322485981705 msec\nrounds: 107"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 1.3011066867382868,
            "unit": "iter/sec",
            "range": "stddev: 0.011147512975835428",
            "extra": "mean: 768.5764820000088 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 1.2955531885798919,
            "unit": "iter/sec",
            "range": "stddev: 0.006419525148993878",
            "extra": "mean: 771.8710499999929 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 17.331420388719152,
            "unit": "iter/sec",
            "range": "stddev: 0.0011228923929879737",
            "extra": "mean: 57.69867544444828 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 381.4953837117945,
            "unit": "iter/sec",
            "range": "stddev: 0.0001691285864465417",
            "extra": "mean: 2.621263697270483 msec\nrounds: 403"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 23.482140351420853,
            "unit": "iter/sec",
            "range": "stddev: 0.0002930692278137789",
            "extra": "mean: 42.58555587499894 msec\nrounds: 24"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 165.6578770893977,
            "unit": "iter/sec",
            "range": "stddev: 0.00015335780501206202",
            "extra": "mean: 6.03653757714369 msec\nrounds: 175"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 256.6580699154927,
            "unit": "iter/sec",
            "range": "stddev: 0.000027581461810205673",
            "extra": "mean: 3.896234395938769 msec\nrounds: 197"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 272.2028432650693,
            "unit": "iter/sec",
            "range": "stddev: 0.0003334498117721762",
            "extra": "mean: 3.6737309133329177 msec\nrounds: 300"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 64.20259311448994,
            "unit": "iter/sec",
            "range": "stddev: 0.0003652087722035385",
            "extra": "mean: 15.575694866665895 msec\nrounds: 60"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 935.6520982984106,
            "unit": "iter/sec",
            "range": "stddev: 0.000017365446035249585",
            "extra": "mean: 1.0687733205735481 msec\nrounds: 627"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 27.23579128636331,
            "unit": "iter/sec",
            "range": "stddev: 0.00031491708063227506",
            "extra": "mean: 36.7163923928544 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 1967.2209087251777,
            "unit": "iter/sec",
            "range": "stddev: 0.000016088658814595294",
            "extra": "mean: 508.33131935753573 usec\nrounds: 1121"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 78.0616028384502,
            "unit": "iter/sec",
            "range": "stddev: 0.00035280148105865805",
            "extra": "mean: 12.81039542666728 msec\nrounds: 75"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 90761.8466274737,
            "unit": "iter/sec",
            "range": "stddev: 9.233950088814015e-7",
            "extra": "mean: 11.017845462140466 usec\nrounds: 46817"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_elements_3d",
            "value": 27467.82242008248,
            "unit": "iter/sec",
            "range": "stddev: 0.0000020132648016123976",
            "extra": "mean: 36.406235074130684 usec\nrounds: 20585"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_with_refs",
            "value": 83900.71368301586,
            "unit": "iter/sec",
            "range": "stddev: 9.67831084901815e-7",
            "extra": "mean: 11.91884974635718 usec\nrounds: 40039"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 28.13708457949514,
            "unit": "iter/sec",
            "range": "stddev: 0.000278363131347398",
            "extra": "mean: 35.54028482143273 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 27.99287388208257,
            "unit": "iter/sec",
            "range": "stddev: 0.00023985336999427187",
            "extra": "mean: 35.72337746429355 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 28.418724739850738,
            "unit": "iter/sec",
            "range": "stddev: 0.0003233377866942111",
            "extra": "mean: 35.18806734482809 msec\nrounds: 29"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 4103.830671482428,
            "unit": "iter/sec",
            "range": "stddev: 0.000008691707382878493",
            "extra": "mean: 243.67477122021938 usec\nrounds: 1508"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 3537.9329327392907,
            "unit": "iter/sec",
            "range": "stddev: 0.000008767401377540473",
            "extra": "mean: 282.6509204700319 usec\nrounds: 2892"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 2455.7580386266054,
            "unit": "iter/sec",
            "range": "stddev: 0.000012086503505569445",
            "extra": "mean: 407.206241116187 usec\nrounds: 1182"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 122.31558422618664,
            "unit": "iter/sec",
            "range": "stddev: 0.0004297284543997084",
            "extra": "mean: 8.17557309909745 msec\nrounds: 111"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 120.74719092115227,
            "unit": "iter/sec",
            "range": "stddev: 0.0004699459593762542",
            "extra": "mean: 8.28176616260165 msec\nrounds: 123"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 120.03111229850649,
            "unit": "iter/sec",
            "range": "stddev: 0.00045511398701839116",
            "extra": "mean: 8.33117331707375 msec\nrounds: 123"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 29.366681577952296,
            "unit": "iter/sec",
            "range": "stddev: 0.00024218174583060344",
            "extra": "mean: 34.052196103449866 msec\nrounds: 29"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 29.38495162893108,
            "unit": "iter/sec",
            "range": "stddev: 0.00020709938262513953",
            "extra": "mean: 34.03102420000058 msec\nrounds: 30"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 9886.71967865783,
            "unit": "iter/sec",
            "range": "stddev: 0.000005469411355146388",
            "extra": "mean: 101.14578267639877 usec\nrounds: 2586"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 912493.8484569556,
            "unit": "iter/sec",
            "range": "stddev: 2.8178236713980923e-7",
            "extra": "mean: 1.0958977988629939 usec\nrounds: 183824"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3318519.6096938206,
            "unit": "iter/sec",
            "range": "stddev: 3.792097610495971e-8",
            "extra": "mean: 301.33918662974656 nsec\nrounds: 159719"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1329506.3287920223,
            "unit": "iter/sec",
            "range": "stddev: 3.5214088250688865e-7",
            "extra": "mean: 752.1588866061218 nsec\nrounds: 3449"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 168947.21734850266,
            "unit": "iter/sec",
            "range": "stddev: 9.006018991190803e-7",
            "extra": "mean: 5.919008408035569 usec\nrounds: 56613"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 1341.480010368822,
            "unit": "iter/sec",
            "range": "stddev: 0.000035734957179928445",
            "extra": "mean: 745.4453232777306 usec\nrounds: 696"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 121.61774848428979,
            "unit": "iter/sec",
            "range": "stddev: 0.0000809508342742735",
            "extra": "mean: 8.222484073771328 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 18.480738179742144,
            "unit": "iter/sec",
            "range": "stddev: 0.00014059377418551572",
            "extra": "mean: 54.11039268421435 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 120.41622521930427,
            "unit": "iter/sec",
            "range": "stddev: 0.00006951525929227896",
            "extra": "mean: 8.304528714288972 msec\nrounds: 119"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 110.95916296086945,
            "unit": "iter/sec",
            "range": "stddev: 0.00003999984916833105",
            "extra": "mean: 9.01232465454572 msec\nrounds: 110"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 118.89088971685281,
            "unit": "iter/sec",
            "range": "stddev: 0.0006632311508843361",
            "extra": "mean: 8.411073400002067 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 164.9272916769657,
            "unit": "iter/sec",
            "range": "stddev: 0.00004319015353824504",
            "extra": "mean: 6.063277883436337 msec\nrounds: 163"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 1398.7585244475367,
            "unit": "iter/sec",
            "range": "stddev: 0.000015775802101635867",
            "extra": "mean: 714.9196823625914 usec\nrounds: 1168"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 121.4657747246422,
            "unit": "iter/sec",
            "range": "stddev: 0.000055592761757728984",
            "extra": "mean: 8.232771760332964 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 121.65488038657651,
            "unit": "iter/sec",
            "range": "stddev: 0.0000458629610822609",
            "extra": "mean: 8.219974380167494 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 27930.09412455262,
            "unit": "iter/sec",
            "range": "stddev: 0.000002289297420117045",
            "extra": "mean: 35.803674543328015 usec\nrounds: 25899"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 4.449066641076195,
            "unit": "iter/sec",
            "range": "stddev: 0.019952960188142757",
            "extra": "mean: 224.76624439999568 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 3.4170979633176333,
            "unit": "iter/sec",
            "range": "stddev: 0.0023738771412015426",
            "extra": "mean: 292.64598519999936 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.2689990218961442,
            "unit": "iter/sec",
            "range": "stddev: 0.0032613319377169203",
            "extra": "mean: 788.022672000011 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.13951477501515133,
            "unit": "iter/sec",
            "range": "stddev: 0.018537886745425176",
            "extra": "mean: 7.167699620999997 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.2551130053093609,
            "unit": "iter/sec",
            "range": "stddev: 0.0017584717041960476",
            "extra": "mean: 796.7410072000007 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 3.055656183746013,
            "unit": "iter/sec",
            "range": "stddev: 0.0012263175168891493",
            "extra": "mean: 327.26194959999475 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 1.0266712716240627,
            "unit": "iter/sec",
            "range": "stddev: 0.001803519790422231",
            "extra": "mean: 974.0216052000051 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 2.351880364429173,
            "unit": "iter/sec",
            "range": "stddev: 0.012299958002191554",
            "extra": "mean: 425.1916956000059 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 3.262443964645806,
            "unit": "iter/sec",
            "range": "stddev: 0.0015454750921649783",
            "extra": "mean: 306.5186745999995 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.2599334939468845,
            "unit": "iter/sec",
            "range": "stddev: 0.002435482463490166",
            "extra": "mean: 793.6926867999887 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.2638030014091295,
            "unit": "iter/sec",
            "range": "stddev: 0.0011248180304594916",
            "extra": "mean: 791.2625614000035 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 11387.998178649717,
            "unit": "iter/sec",
            "range": "stddev: 0.000006188951835477436",
            "extra": "mean: 87.81174569160062 usec\nrounds: 9980"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 4.000965077587706,
            "unit": "iter/sec",
            "range": "stddev: 0.0013188920253899153",
            "extra": "mean: 249.9396971999886 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 28.01014974956932,
            "unit": "iter/sec",
            "range": "stddev: 0.0012048345003699932",
            "extra": "mean: 35.701344296289456 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 17.09956341779114,
            "unit": "iter/sec",
            "range": "stddev: 0.003440110352814912",
            "extra": "mean: 58.48102525001053 msec\nrounds: 16"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.530319213748456,
            "unit": "iter/sec",
            "range": "stddev: 0.0011953713593145102",
            "extra": "mean: 180.82138866667682 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 17.245722381417348,
            "unit": "iter/sec",
            "range": "stddev: 0.0014767499556712555",
            "extra": "mean: 57.98539358823973 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 21.230948671185704,
            "unit": "iter/sec",
            "range": "stddev: 0.0015766629353789032",
            "extra": "mean: 47.10105118181476 msec\nrounds: 22"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 17.544655297532834,
            "unit": "iter/sec",
            "range": "stddev: 0.0011575747306071759",
            "extra": "mean: 56.99741505554812 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 17.044805067359945,
            "unit": "iter/sec",
            "range": "stddev: 0.0011834975451139817",
            "extra": "mean: 58.66890211111632 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 28.076692628348308,
            "unit": "iter/sec",
            "range": "stddev: 0.0010363081729984902",
            "extra": "mean: 35.61673068965131 msec\nrounds: 29"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 17.31613204059789,
            "unit": "iter/sec",
            "range": "stddev: 0.0012474600989355949",
            "extra": "mean: 57.74961738888843 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 17.215160777616187,
            "unit": "iter/sec",
            "range": "stddev: 0.001582082882025364",
            "extra": "mean: 58.08833347059055 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 21446.77361121806,
            "unit": "iter/sec",
            "range": "stddev: 0.0000025248212153219885",
            "extra": "mean: 46.62706000108729 usec\nrounds: 17733"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 25.547705581004163,
            "unit": "iter/sec",
            "range": "stddev: 0.014014558328763653",
            "extra": "mean: 39.142458285707804 msec\nrounds: 28"
          }
        ]
      }
    ]
  }
}