window.BENCHMARK_DATA = {
  "lastUpdate": 1768833190946,
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
          "id": "a636e1e98bbecf8891623f3362a6ebaa87ab08d9",
          "message": "chore: update dependencies to fix security alerts (#167)",
          "timestamp": "2026-01-19T15:23:40+01:00",
          "tree_id": "4c77c3767e8ea71610b36e9186c03936862361ab",
          "url": "https://github.com/kmarchais/mmgpy/commit/a636e1e98bbecf8891623f3362a6ebaa87ab08d9"
        },
        "date": 1768833190561,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 1.1488608221024135,
            "unit": "iter/sec",
            "range": "stddev: 0.01239231002801318",
            "extra": "mean: 870.4274536666693 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.6154783312085035,
            "unit": "iter/sec",
            "range": "stddev: 0.0165250020216967",
            "extra": "mean: 1.6247525693333198 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.2171909219813541,
            "unit": "iter/sec",
            "range": "stddev: 0.0022503794843965223",
            "extra": "mean: 821.563800666695 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.2718237591083044,
            "unit": "iter/sec",
            "range": "stddev: 0.007031496803639795",
            "extra": "mean: 786.2724633333755 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 1.159196571860677,
            "unit": "iter/sec",
            "range": "stddev: 0.013119625340144242",
            "extra": "mean: 862.6664573333377 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.6248562756364386,
            "unit": "iter/sec",
            "range": "stddev: 0.004356688301492434",
            "extra": "mean: 1.6003680189999916 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.2680253936067103,
            "unit": "iter/sec",
            "range": "stddev: 0.0016666880885153948",
            "extra": "mean: 788.6277396666704 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.2673896672119493,
            "unit": "iter/sec",
            "range": "stddev: 0.0014578347854018175",
            "extra": "mean: 789.023317666647 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 30.085548539317298,
            "unit": "iter/sec",
            "range": "stddev: 0.0007031194613621037",
            "extra": "mean: 33.238549687506946 msec\nrounds: 32"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.2804655567890073,
            "unit": "iter/sec",
            "range": "stddev: 0.0026183406995799754",
            "extra": "mean: 780.9659499999952 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 119.31424706439202,
            "unit": "iter/sec",
            "range": "stddev: 0.00005904232528630239",
            "extra": "mean: 8.381228768600582 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 12.174427765256636,
            "unit": "iter/sec",
            "range": "stddev: 0.0013943991732177675",
            "extra": "mean: 82.13938423075608 msec\nrounds: 13"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 1.182304009452545,
            "unit": "iter/sec",
            "range": "stddev: 0.008686640878536123",
            "extra": "mean: 845.8061479999893 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 16.78433373563196,
            "unit": "iter/sec",
            "range": "stddev: 0.001936608635483539",
            "extra": "mean: 59.57936822222917 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 368.2050135245599,
            "unit": "iter/sec",
            "range": "stddev: 0.0002574058015532444",
            "extra": "mean: 2.715878283208923 msec\nrounds: 399"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 23.8508225991817,
            "unit": "iter/sec",
            "range": "stddev: 0.00027929321121008546",
            "extra": "mean: 41.927275079992796 msec\nrounds: 25"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 166.30296336011983,
            "unit": "iter/sec",
            "range": "stddev: 0.00047545150127325804",
            "extra": "mean: 6.013121954024088 msec\nrounds: 174"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 255.96807292115753,
            "unit": "iter/sec",
            "range": "stddev: 0.00007310936532463249",
            "extra": "mean: 3.906737229326318 msec\nrounds: 266"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 271.0758241628274,
            "unit": "iter/sec",
            "range": "stddev: 0.0002992778458778766",
            "extra": "mean: 3.6890047391291114 msec\nrounds: 299"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 63.097151803162376,
            "unit": "iter/sec",
            "range": "stddev: 0.00016330922161111834",
            "extra": "mean: 15.848575909093267 msec\nrounds: 66"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 946.37107360589,
            "unit": "iter/sec",
            "range": "stddev: 0.000022041464589010862",
            "extra": "mean: 1.0566679687173568 msec\nrounds: 959"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 26.197354197235086,
            "unit": "iter/sec",
            "range": "stddev: 0.0003463477199375918",
            "extra": "mean: 38.17179370371462 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 1972.1310473761891,
            "unit": "iter/sec",
            "range": "stddev: 0.000015992478093066122",
            "extra": "mean: 507.06569491436403 usec\nrounds: 2065"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 66.04637112813167,
            "unit": "iter/sec",
            "range": "stddev: 0.0001399284901921607",
            "extra": "mean: 15.14087727938866 msec\nrounds: 68"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 90697.91833132769,
            "unit": "iter/sec",
            "range": "stddev: 9.263185765338261e-7",
            "extra": "mean: 11.025611374529124 usec\nrounds: 92593"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
            "value": 25758.92342266864,
            "unit": "iter/sec",
            "range": "stddev: 0.00000195033302874095",
            "extra": "mean: 38.82149822767707 usec\nrounds: 26233"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
            "value": 6380.662954131286,
            "unit": "iter/sec",
            "range": "stddev: 0.000005033792257694811",
            "extra": "mean: 156.72352656592372 usec\nrounds: 6531"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 27.27247631281707,
            "unit": "iter/sec",
            "range": "stddev: 0.0002848767267238608",
            "extra": "mean: 36.66700407142847 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 27.214994928796155,
            "unit": "iter/sec",
            "range": "stddev: 0.00024351603879109248",
            "extra": "mean: 36.744449249994204 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 26.80562336753399,
            "unit": "iter/sec",
            "range": "stddev: 0.000327941709978793",
            "extra": "mean: 37.305605107141965 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 3199.4171222635446,
            "unit": "iter/sec",
            "range": "stddev: 0.000028079149362085756",
            "extra": "mean: 312.55693202407866 usec\nrounds: 3972"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 2770.5569469586812,
            "unit": "iter/sec",
            "range": "stddev: 0.000009888467937982337",
            "extra": "mean: 360.9382586767358 usec\nrounds: 3429"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 2081.261979809792,
            "unit": "iter/sec",
            "range": "stddev: 0.00001264633539166829",
            "extra": "mean: 480.4777148196359 usec\nrounds: 2146"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 100.31022358520501,
            "unit": "iter/sec",
            "range": "stddev: 0.00012452333626325772",
            "extra": "mean: 9.96907358252058 msec\nrounds: 103"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 99.77173901895725,
            "unit": "iter/sec",
            "range": "stddev: 0.00011664129812652371",
            "extra": "mean: 10.022878320382826 msec\nrounds: 103"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 98.75870226238544,
            "unit": "iter/sec",
            "range": "stddev: 0.00012654080202345873",
            "extra": "mean: 10.125689960396263 msec\nrounds: 101"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 27.032361065026688,
            "unit": "iter/sec",
            "range": "stddev: 0.00042358153170463076",
            "extra": "mean: 36.99269914287129 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 26.419273918610525,
            "unit": "iter/sec",
            "range": "stddev: 0.00027007399647226626",
            "extra": "mean: 37.8511537857053 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 7112.737127671048,
            "unit": "iter/sec",
            "range": "stddev: 0.00000735438914034991",
            "extra": "mean: 140.59285223822604 usec\nrounds: 9204"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 1044162.7370607816,
            "unit": "iter/sec",
            "range": "stddev: 8.752607802537646e-8",
            "extra": "mean: 957.7051205781432 nsec\nrounds: 108484"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3321688.322657223,
            "unit": "iter/sec",
            "range": "stddev: 3.867551925161894e-8",
            "extra": "mean: 301.0517251660862 nsec\nrounds: 191205"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1611802.061554072,
            "unit": "iter/sec",
            "range": "stddev: 6.768453234292584e-8",
            "extra": "mean: 620.4235767236934 nsec\nrounds: 166639"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 166513.63577202402,
            "unit": "iter/sec",
            "range": "stddev: 7.767046489143898e-7",
            "extra": "mean: 6.005514175242158 usec\nrounds: 173612"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 1110.0724177146533,
            "unit": "iter/sec",
            "range": "stddev: 0.000020661347046921458",
            "extra": "mean: 900.8421288934794 usec\nrounds: 1156"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 118.14835119218903,
            "unit": "iter/sec",
            "range": "stddev: 0.00010865295029029829",
            "extra": "mean: 8.463935297525435 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 18.29791829832377,
            "unit": "iter/sec",
            "range": "stddev: 0.00024875728107581844",
            "extra": "mean: 54.65102552630852 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 118.26039633330367,
            "unit": "iter/sec",
            "range": "stddev: 0.0000903708146167966",
            "extra": "mean: 8.455916190079494 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 108.21734391819992,
            "unit": "iter/sec",
            "range": "stddev: 0.00008294549395792433",
            "extra": "mean: 9.240662945450657 msec\nrounds: 110"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 117.84269572143337,
            "unit": "iter/sec",
            "range": "stddev: 0.000056450475170138734",
            "extra": "mean: 8.485888699999578 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 159.62641245965202,
            "unit": "iter/sec",
            "range": "stddev: 0.000051837934731665535",
            "extra": "mean: 6.264627417174869 msec\nrounds: 163"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 1144.385703672457,
            "unit": "iter/sec",
            "range": "stddev: 0.000023386690178768953",
            "extra": "mean: 873.831258806268 usec\nrounds: 1306"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 119.25821010901282,
            "unit": "iter/sec",
            "range": "stddev: 0.00005988117416599377",
            "extra": "mean: 8.38516693388161 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 118.64606515226032,
            "unit": "iter/sec",
            "range": "stddev: 0.00012083941285036541",
            "extra": "mean: 8.428429537184268 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 27828.43702814785,
            "unit": "iter/sec",
            "range": "stddev: 0.0000021199636497757867",
            "extra": "mean: 35.93446512962701 usec\nrounds: 28405"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 47.8975180699918,
            "unit": "iter/sec",
            "range": "stddev: 0.016121419275786284",
            "extra": "mean: 20.87790850746625 msec\nrounds: 67"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 3.362803771406838,
            "unit": "iter/sec",
            "range": "stddev: 0.0034734977948329337",
            "extra": "mean: 297.3709047500108 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.2521273455782387,
            "unit": "iter/sec",
            "range": "stddev: 0.007386161173525227",
            "extra": "mean: 798.6408119999927 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.12479696941202485,
            "unit": "iter/sec",
            "range": "stddev: 0.07812877133333765",
            "extra": "mean: 8.013015097333323 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.2682376870266001,
            "unit": "iter/sec",
            "range": "stddev: 0.0028119752796910867",
            "extra": "mean: 788.4957293332869 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 3.0625860561798586,
            "unit": "iter/sec",
            "range": "stddev: 0.0011117639054333203",
            "extra": "mean: 326.5214369999967 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 1.0172920606604832,
            "unit": "iter/sec",
            "range": "stddev: 0.006056164725330727",
            "extra": "mean: 983.0018720000074 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 2.390207501522066,
            "unit": "iter/sec",
            "range": "stddev: 0.0024600666641827786",
            "extra": "mean: 418.3737183333278 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 3.278747052912532,
            "unit": "iter/sec",
            "range": "stddev: 0.003320703522121903",
            "extra": "mean: 304.9945555000022 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.2664091851635277,
            "unit": "iter/sec",
            "range": "stddev: 0.002824054708589152",
            "extra": "mean: 789.634196999979 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.2550383813892205,
            "unit": "iter/sec",
            "range": "stddev: 0.009978343493287108",
            "extra": "mean: 796.7883810000179 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 11444.095076050726,
            "unit": "iter/sec",
            "range": "stddev: 0.000003367875247730124",
            "extra": "mean: 87.38130829520273 usec\nrounds: 11622"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 288.3688807188568,
            "unit": "iter/sec",
            "range": "stddev: 0.00007004383531718354",
            "extra": "mean: 3.4677805646266764 msec\nrounds: 294"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 27.057033807048214,
            "unit": "iter/sec",
            "range": "stddev: 0.0009310451275071957",
            "extra": "mean: 36.958966275878524 msec\nrounds: 29"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 16.96418717305664,
            "unit": "iter/sec",
            "range": "stddev: 0.0008412930698369873",
            "extra": "mean: 58.947710833340096 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.497712493460007,
            "unit": "iter/sec",
            "range": "stddev: 0.0003673787993090108",
            "extra": "mean: 181.89383333333353 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 17.01182855594721,
            "unit": "iter/sec",
            "range": "stddev: 0.0008363836328055034",
            "extra": "mean: 58.782628611102915 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 20.81211193624393,
            "unit": "iter/sec",
            "range": "stddev: 0.0013993876002491967",
            "extra": "mean: 48.048943954530515 msec\nrounds: 22"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 17.218700665255685,
            "unit": "iter/sec",
            "range": "stddev: 0.0007089396134805714",
            "extra": "mean: 58.076391444438336 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 16.561801125177816,
            "unit": "iter/sec",
            "range": "stddev: 0.0008492711502026414",
            "extra": "mean: 60.37990629411471 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 26.593736712282155,
            "unit": "iter/sec",
            "range": "stddev: 0.0009337505344759563",
            "extra": "mean: 37.6028389999874 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 16.84679427574174,
            "unit": "iter/sec",
            "range": "stddev: 0.0007059712589144719",
            "extra": "mean: 59.35847400000208 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 16.812258490151024,
            "unit": "iter/sec",
            "range": "stddev: 0.001080302575470701",
            "extra": "mean: 59.48040833334921 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 21679.091037169517,
            "unit": "iter/sec",
            "range": "stddev: 0.0000029594814052092552",
            "extra": "mean: 46.127395206997704 usec\nrounds: 22196"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 47.60423893480856,
            "unit": "iter/sec",
            "range": "stddev: 0.014707017262991416",
            "extra": "mean: 21.006532661291907 msec\nrounds: 62"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 173.12521508108907,
            "unit": "iter/sec",
            "range": "stddev: 0.0000290926853502723",
            "extra": "mean: 5.7761661092037695 msec\nrounds: 174"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.489820729473022,
            "unit": "iter/sec",
            "range": "stddev: 0.0003230616099538177",
            "extra": "mean: 69.01396633334116 msec\nrounds: 15"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
            "value": 1.138525033850824,
            "unit": "iter/sec",
            "range": "stddev: 0.007230081390663952",
            "extra": "mean: 878.3293913333713 msec\nrounds: 3"
          }
        ]
      }
    ]
  }
}