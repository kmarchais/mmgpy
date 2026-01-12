window.BENCHMARK_DATA = {
  "lastUpdate": 1768242833023,
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
          "id": "64b37e1f94664bb091b5acb7e09bbae6c084c409",
          "message": "fix(mmgs): add NotImplementedError for unsupported Lagrangian motion (#153)\n\n* fix(mmgs): add NotImplementedError for unsupported Lagrangian motion\n\nMmgMeshS.remesh_lagrangian() now raises NotImplementedError with a\nclear explanation of why Lagrangian motion is not supported for\nsurface meshes.\n\nLagrangian motion requires the ELAS library to solve elasticity PDEs\nthat propagate boundary displacements to interior vertices. Surface\nmeshes have no volumetric interior (all vertices are on the surface),\nand ELAS only supports 2D/3D volumetric elasticity, not shell/membrane\nelasticity needed for surfaces.\n\nThe error message suggests using mmgpy.move_mesh() as an alternative\nfor moving surface mesh vertices.\n\nCloses #117\n\n* refactor: implement remesh_lagrangian in C++ instead of Python\n\nMove the RuntimeError for unsupported Lagrangian motion from Python\nmonkey-patching to a proper C++ method in MmgMeshS. This is cleaner\nbecause:\n\n- The method is defined in C++ where it belongs\n- No monkey-patching or type ignore comments needed\n- Error raised at the C++ level with helpful message\n- Type stubs naturally match the implementation\n\nThe error message explains why Lagrangian motion is not supported\n(ELAS library requires volumetric interior) and suggests using\nmmgpy.move_mesh() as an alternative.",
          "timestamp": "2026-01-12T19:23:51+01:00",
          "tree_id": "7fb7edc295a03bc4462d23bdb90c5eee0cd99ce3",
          "url": "https://github.com/kmarchais/mmgpy/commit/64b37e1f94664bb091b5acb7e09bbae6c084c409"
        },
        "date": 1768242831464,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 0.6340433060446189,
            "unit": "iter/sec",
            "range": "stddev: 0.00610246208153737",
            "extra": "mean: 1.5771793353333312 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.618017579702878,
            "unit": "iter/sec",
            "range": "stddev: 0.012592885712099659",
            "extra": "mean: 1.6180769493333287 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.1889954834437038,
            "unit": "iter/sec",
            "range": "stddev: 0.006746416461219436",
            "extra": "mean: 841.0460880000036 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.2236396445561482,
            "unit": "iter/sec",
            "range": "stddev: 0.0038226670211392922",
            "extra": "mean: 817.23406433332 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 0.6221161858639491,
            "unit": "iter/sec",
            "range": "stddev: 0.006507864225529639",
            "extra": "mean: 1.6074167859999875 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.6337455012260631,
            "unit": "iter/sec",
            "range": "stddev: 0.013430701798949448",
            "extra": "mean: 1.577920471333319 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.2402819772806344,
            "unit": "iter/sec",
            "range": "stddev: 0.0016762484455827486",
            "extra": "mean: 806.2682666666964 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.2461621668553398,
            "unit": "iter/sec",
            "range": "stddev: 0.0020115858327813796",
            "extra": "mean: 802.4637776666547 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 1.3383404259211669,
            "unit": "iter/sec",
            "range": "stddev: 0.006728054186228672",
            "extra": "mean: 747.1940476666911 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.3207366246337084,
            "unit": "iter/sec",
            "range": "stddev: 0.007931859339844612",
            "extra": "mean: 757.1532290000201 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 90.94598909879296,
            "unit": "iter/sec",
            "range": "stddev: 0.00007121018357807378",
            "extra": "mean: 10.995537130435938 msec\nrounds: 92"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 1.2457971460460062,
            "unit": "iter/sec",
            "range": "stddev: 0.008620658639667343",
            "extra": "mean: 802.6989009999473 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 1.2406730275333853,
            "unit": "iter/sec",
            "range": "stddev: 0.002214473602836486",
            "extra": "mean: 806.0141373332877 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 16.747347010890564,
            "unit": "iter/sec",
            "range": "stddev: 0.0013407616340236107",
            "extra": "mean: 59.71095000000383 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 375.91902334491056,
            "unit": "iter/sec",
            "range": "stddev: 0.000051998089917576754",
            "extra": "mean: 2.6601473665845505 msec\nrounds: 401"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 23.76698550325387,
            "unit": "iter/sec",
            "range": "stddev: 0.00039029553774749814",
            "extra": "mean: 42.07517187499832 msec\nrounds: 24"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 166.5513762623963,
            "unit": "iter/sec",
            "range": "stddev: 0.00006786097869927713",
            "extra": "mean: 6.004153327586633 msec\nrounds: 174"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 262.68781894975353,
            "unit": "iter/sec",
            "range": "stddev: 0.00003744949789572881",
            "extra": "mean: 3.806800041197488 msec\nrounds: 267"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 275.03875084607284,
            "unit": "iter/sec",
            "range": "stddev: 0.00007051441292268144",
            "extra": "mean: 3.6358513006760136 msec\nrounds: 296"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 61.5077073242924,
            "unit": "iter/sec",
            "range": "stddev: 0.00020603924736952223",
            "extra": "mean: 16.258125095243976 msec\nrounds: 63"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 912.532329497628,
            "unit": "iter/sec",
            "range": "stddev: 0.00001915045874080955",
            "extra": "mean: 1.0958515853904325 msec\nrounds: 931"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 25.136585340515552,
            "unit": "iter/sec",
            "range": "stddev: 0.0004502205118033335",
            "extra": "mean: 39.78265092308238 msec\nrounds: 26"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 1975.0120761652295,
            "unit": "iter/sec",
            "range": "stddev: 0.000019387929869148348",
            "extra": "mean: 506.3260179865047 usec\nrounds: 2057"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 66.90687177440562,
            "unit": "iter/sec",
            "range": "stddev: 0.0002448809813837058",
            "extra": "mean: 14.946147884058414 msec\nrounds: 69"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 90527.69840418194,
            "unit": "iter/sec",
            "range": "stddev: 9.233931069449825e-7",
            "extra": "mean: 11.046342916344429 usec\nrounds: 92422"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
            "value": 25697.2983432234,
            "unit": "iter/sec",
            "range": "stddev: 0.00000225020081097361",
            "extra": "mean: 38.91459664917299 usec\nrounds: 26260"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
            "value": 6409.265570509035,
            "unit": "iter/sec",
            "range": "stddev: 0.000004494897690916842",
            "extra": "mean: 156.02411680385066 usec\nrounds: 6558"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 26.05349904619555,
            "unit": "iter/sec",
            "range": "stddev: 0.0005893714861086968",
            "extra": "mean: 38.38256037037085 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 26.099854388918708,
            "unit": "iter/sec",
            "range": "stddev: 0.00028823790581668576",
            "extra": "mean: 38.314389999990695 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 25.840539400905936,
            "unit": "iter/sec",
            "range": "stddev: 0.00017651895918243491",
            "extra": "mean: 38.69888257692257 msec\nrounds: 26"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 3111.2599833950885,
            "unit": "iter/sec",
            "range": "stddev: 0.00000938080343620092",
            "extra": "mean: 321.413191227039 usec\nrounds: 3488"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 2786.0483901507037,
            "unit": "iter/sec",
            "range": "stddev: 0.000012195733769251085",
            "extra": "mean: 358.93131057422437 usec\nrounds: 2856"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 2105.566636403277,
            "unit": "iter/sec",
            "range": "stddev: 0.000010969282335600026",
            "extra": "mean: 474.9315375305326 usec\nrounds: 2145"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 96.6252590044777,
            "unit": "iter/sec",
            "range": "stddev: 0.00031995605659627686",
            "extra": "mean: 10.349260745098329 msec\nrounds: 102"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 98.15255452780296,
            "unit": "iter/sec",
            "range": "stddev: 0.00021657235113835995",
            "extra": "mean: 10.18822184313845 msec\nrounds: 102"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 95.78207274368198,
            "unit": "iter/sec",
            "range": "stddev: 0.00024379092530954879",
            "extra": "mean: 10.44036708911128 msec\nrounds: 101"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 26.05175139309475,
            "unit": "iter/sec",
            "range": "stddev: 0.00041460027577657377",
            "extra": "mean: 38.38513522223534 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 25.84431144805095,
            "unit": "iter/sec",
            "range": "stddev: 0.0006767696320154325",
            "extra": "mean: 38.69323437035948 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 7290.635896924943,
            "unit": "iter/sec",
            "range": "stddev: 0.000005408703868904884",
            "extra": "mean: 137.16224676941854 usec\nrounds: 7505"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 1052134.0275272343,
            "unit": "iter/sec",
            "range": "stddev: 9.394629406095358e-8",
            "extra": "mean: 950.4492525065826 nsec\nrounds: 108496"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3337994.494313188,
            "unit": "iter/sec",
            "range": "stddev: 3.79080613249884e-8",
            "extra": "mean: 299.58108130605405 nsec\nrounds: 194553"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1609042.451095746,
            "unit": "iter/sec",
            "range": "stddev: 6.913058436360978e-8",
            "extra": "mean: 621.487642739946 nsec\nrounds: 166639"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 169265.60759391234,
            "unit": "iter/sec",
            "range": "stddev: 8.106183624022248e-7",
            "extra": "mean: 5.907874695957817 usec\nrounds: 177305"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 1097.404410875646,
            "unit": "iter/sec",
            "range": "stddev: 0.00002235839361211333",
            "extra": "mean: 911.2410977117136 usec\nrounds: 1136"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 117.9165587523485,
            "unit": "iter/sec",
            "range": "stddev: 0.00014268755425685941",
            "extra": "mean: 8.480573132228416 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 18.221009113890926,
            "unit": "iter/sec",
            "range": "stddev: 0.0003260737978018163",
            "extra": "mean: 54.88170242106088 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 118.82415925028324,
            "unit": "iter/sec",
            "range": "stddev: 0.00010172647136407033",
            "extra": "mean: 8.415796975206591 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 108.53141261678797,
            "unit": "iter/sec",
            "range": "stddev: 0.00010432343907821038",
            "extra": "mean: 9.213922272723803 msec\nrounds: 110"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 117.81083401644943,
            "unit": "iter/sec",
            "range": "stddev: 0.00021101514914585688",
            "extra": "mean: 8.488183691666034 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 159.86611855960402,
            "unit": "iter/sec",
            "range": "stddev: 0.0002236414186733973",
            "extra": "mean: 6.255234123465398 msec\nrounds: 162"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 1137.3150211280572,
            "unit": "iter/sec",
            "range": "stddev: 0.000021547514097410657",
            "extra": "mean: 879.2638639452242 usec\nrounds: 1176"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 119.01915644301494,
            "unit": "iter/sec",
            "range": "stddev: 0.00011751390532020781",
            "extra": "mean: 8.402008801656976 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 119.20331518409543,
            "unit": "iter/sec",
            "range": "stddev: 0.00014946872402197387",
            "extra": "mean: 8.389028429751457 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 27601.21221882056,
            "unit": "iter/sec",
            "range": "stddev: 0.000002066855309182384",
            "extra": "mean: 36.230292788304624 usec\nrounds: 28413"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 49.57691045836144,
            "unit": "iter/sec",
            "range": "stddev: 0.014587318327640148",
            "extra": "mean: 20.17068007575579 msec\nrounds: 66"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 3.188781928949257,
            "unit": "iter/sec",
            "range": "stddev: 0.0009082362988660781",
            "extra": "mean: 313.59936875003314 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.2179837161643337,
            "unit": "iter/sec",
            "range": "stddev: 0.005120941391978047",
            "extra": "mean: 821.0290389999576 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.12689999504832408,
            "unit": "iter/sec",
            "range": "stddev: 0.04139875107301898",
            "extra": "mean: 7.88022095366667 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.211421092470107,
            "unit": "iter/sec",
            "range": "stddev: 0.0034559150574279985",
            "extra": "mean: 825.4767943333263 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 2.8544911843538054,
            "unit": "iter/sec",
            "range": "stddev: 0.0018510855080297256",
            "extra": "mean: 350.3251316666365 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 0.9903356425951133,
            "unit": "iter/sec",
            "range": "stddev: 0.0033378989489117094",
            "extra": "mean: 1.0097586686666773 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 2.219531203403963,
            "unit": "iter/sec",
            "range": "stddev: 0.0008656950498372476",
            "extra": "mean: 450.5455919999501 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 2.958754127181257,
            "unit": "iter/sec",
            "range": "stddev: 0.003446317966618237",
            "extra": "mean: 337.9800946666289 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.198600418263571,
            "unit": "iter/sec",
            "range": "stddev: 0.009695658329643763",
            "extra": "mean: 834.3064000000217 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.2100077221886527,
            "unit": "iter/sec",
            "range": "stddev: 0.005555487054008783",
            "extra": "mean: 826.4410066666414 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 11430.150108470702,
            "unit": "iter/sec",
            "range": "stddev: 0.0000035039380622343565",
            "extra": "mean: 87.48791490139014 usec\nrounds: 11610"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 282.38716137320756,
            "unit": "iter/sec",
            "range": "stddev: 0.00004725102989982726",
            "extra": "mean: 3.5412374809716765 msec\nrounds: 289"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 23.89189002588638,
            "unit": "iter/sec",
            "range": "stddev: 0.0018947828211618757",
            "extra": "mean: 41.85520688888658 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 15.61052420880783,
            "unit": "iter/sec",
            "range": "stddev: 0.0021832337350948462",
            "extra": "mean: 64.05934782355202 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.30289304447286,
            "unit": "iter/sec",
            "range": "stddev: 0.002768739147568771",
            "extra": "mean: 188.57630950001672 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 15.811938679662763,
            "unit": "iter/sec",
            "range": "stddev: 0.0026101206775710297",
            "extra": "mean: 63.243351764714035 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 20.081233316985685,
            "unit": "iter/sec",
            "range": "stddev: 0.0026959521921308266",
            "extra": "mean: 49.7977382272707 msec\nrounds: 22"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 16.357682806529606,
            "unit": "iter/sec",
            "range": "stddev: 0.002330150684159762",
            "extra": "mean: 61.133353166673665 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 15.577876279951154,
            "unit": "iter/sec",
            "range": "stddev: 0.0027564771149211765",
            "extra": "mean: 64.19360264704424 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 24.65122552519111,
            "unit": "iter/sec",
            "range": "stddev: 0.002206591045330832",
            "extra": "mean: 40.56593450001498 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 15.930913420271477,
            "unit": "iter/sec",
            "range": "stddev: 0.00221877302601613",
            "extra": "mean: 62.77103977776556 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 15.7810687358584,
            "unit": "iter/sec",
            "range": "stddev: 0.0022456103904746837",
            "extra": "mean: 63.36706447059308 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 21764.291964040163,
            "unit": "iter/sec",
            "range": "stddev: 0.0000025089642305494547",
            "extra": "mean: 45.946819756518614 usec\nrounds: 22231"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 44.520513512978255,
            "unit": "iter/sec",
            "range": "stddev: 0.01751736017915534",
            "extra": "mean: 22.461555833323622 msec\nrounds: 60"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 172.49317705480811,
            "unit": "iter/sec",
            "range": "stddev: 0.000030834440790818915",
            "extra": "mean: 5.797330752869485 msec\nrounds: 174"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.054280336578248,
            "unit": "iter/sec",
            "range": "stddev: 0.001035739309300426",
            "extra": "mean: 71.15270053332854 msec\nrounds: 15"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
            "value": 1.1260021428923979,
            "unit": "iter/sec",
            "range": "stddev: 0.015616082243231154",
            "extra": "mean: 888.0977770000223 msec\nrounds: 3"
          }
        ]
      }
    ]
  }
}