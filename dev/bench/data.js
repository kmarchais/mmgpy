window.BENCHMARK_DATA = {
  "lastUpdate": 1774345906684,
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
          "id": "1f4e165b4e6cdc2c3b2d09ec973231c029e3ba0c",
          "message": "fix(ci): install GL libraries for VTK in daily docs test (#202)\n\n* fix(ci): install GL libraries for VTK in daily docs test\n\n* fix(ci): use mesa-dev packages and xvfb for VTK rendering\n\n* fix(ci): use persistent Xvfb, osmesa, and add import verification step\n\n* fix(ci): add faulthandler and direct test to diagnose segfault\n\n* fix(ci): add exec() simulation and collect-only diagnostics\n\n* fix(ci): step-by-step isolation of conftest segfault\n\n* fix(ci): instrument conftest with catchsegv for C-level backtrace\n\n* fix(ci): use python faulthandler instead of catchsegv\n\n* fix(ci): standalone conftest reproduction script\n\n* fix(ci): test without conftest and without faulthandler plugin\n\n* fix(ci): isolate conftest vs code block vs collection\n\n* fix(ci): remove VTK object creation from conftest module level\n\n* fix(ci): fetch fixed conftest from PR branch, not HEAD\n\n* fix(ci): clean up workflow, use origin/main for conftest patch\n\n* fix(ci): re-add PR trigger to verify fix\n\n* fix(ci): use PR branch for conftest during PR, main otherwise\n\n* fix(ci): lazy mesh init in conftest to avoid VTK module-level objects\n\n* fix(ci): numpy UV sphere and scipy Delaunay, no VTK objects in conftest\n\n* fix(ci): remove PR trigger, use origin/main for conftest patch\n\n* fix(ci): jitter grid points to avoid degenerate tetrahedra in conftest\n\n* fix(ci): use smaller cube to avoid slow remeshing in doc tests\n\n* fix(ci): unit cube with resolution 3 to keep doc tests fast\n\n* fix(ci): 0.3-cube centered at (0.5,0.5,0.5) for fast tests with valid coords\n\n* fix(ci): add larger mesh for levelset domain tests\n\n* fix(ci): skip complex levelset example, remove slow large mesh\n\n* fix(ci): denser domain mesh for levelset, unskip the test\n\n* fix(ci): skip complex levelset example that needs VTK-quality mesh",
          "timestamp": "2026-03-24T10:43:00+01:00",
          "tree_id": "131b48446a241e13dae5c25564d2fed86047c0e6",
          "url": "https://github.com/kmarchais/mmgpy/commit/1f4e165b4e6cdc2c3b2d09ec973231c029e3ba0c"
        },
        "date": 1774345906289,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 1.1798513184718957,
            "unit": "iter/sec",
            "range": "stddev: 0.009222021231164392",
            "extra": "mean: 847.5644213333311 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.5726065414229605,
            "unit": "iter/sec",
            "range": "stddev: 0.01200261267748698",
            "extra": "mean: 1.7463998883333431 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.2200101928679636,
            "unit": "iter/sec",
            "range": "stddev: 0.0050947696665555615",
            "extra": "mean: 819.6652829999967 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.2964835771104142,
            "unit": "iter/sec",
            "range": "stddev: 0.0011209675348920276",
            "extra": "mean: 771.3171363333325 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 1.183269212303403,
            "unit": "iter/sec",
            "range": "stddev: 0.0051258230243434915",
            "extra": "mean: 845.1162166666677 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.5769813848865069,
            "unit": "iter/sec",
            "range": "stddev: 0.016010849101977115",
            "extra": "mean: 1.7331581679999981 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.303586441487622,
            "unit": "iter/sec",
            "range": "stddev: 0.0028334460656250417",
            "extra": "mean: 767.1144530000049 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.2912357153298917,
            "unit": "iter/sec",
            "range": "stddev: 0.0015963649868590147",
            "extra": "mean: 774.4519363333401 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 30.683740974641612,
            "unit": "iter/sec",
            "range": "stddev: 0.0008782262160593982",
            "extra": "mean: 32.590550181819225 msec\nrounds: 33"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.0864166958472408,
            "unit": "iter/sec",
            "range": "stddev: 0.006961715278900703",
            "extra": "mean: 920.457135666671 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 119.99692113684428,
            "unit": "iter/sec",
            "range": "stddev: 0.00007804796971157649",
            "extra": "mean: 8.333547148760607 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 12.497064163251236,
            "unit": "iter/sec",
            "range": "stddev: 0.0009738883652396925",
            "extra": "mean: 80.01879376922716 msec\nrounds: 13"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 1.0301952692139171,
            "unit": "iter/sec",
            "range": "stddev: 0.001480934040537003",
            "extra": "mean: 970.6897613333467 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 17.66246413958573,
            "unit": "iter/sec",
            "range": "stddev: 0.0017792725805918128",
            "extra": "mean: 56.61724163157762 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 360.3884592965863,
            "unit": "iter/sec",
            "range": "stddev: 0.00029213720069305043",
            "extra": "mean: 2.7747836374999935 msec\nrounds: 400"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 29.91624683243256,
            "unit": "iter/sec",
            "range": "stddev: 0.0002028828581647715",
            "extra": "mean: 33.42665293548414 msec\nrounds: 31"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 148.02408442567082,
            "unit": "iter/sec",
            "range": "stddev: 0.0001919715411064794",
            "extra": "mean: 6.755657391025056 msec\nrounds: 156"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 255.61852074665097,
            "unit": "iter/sec",
            "range": "stddev: 0.00003751963356969282",
            "extra": "mean: 3.9120795984541417 msec\nrounds: 259"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 271.6072400305676,
            "unit": "iter/sec",
            "range": "stddev: 0.0004646622909305601",
            "extra": "mean: 3.681786979932702 msec\nrounds: 299"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 72.97131316884219,
            "unit": "iter/sec",
            "range": "stddev: 0.0003894091642186382",
            "extra": "mean: 13.704015407893015 msec\nrounds: 76"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 885.2089618137198,
            "unit": "iter/sec",
            "range": "stddev: 0.000021509056074037558",
            "extra": "mean: 1.1296767691450873 msec\nrounds: 901"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 33.632850361918884,
            "unit": "iter/sec",
            "range": "stddev: 0.00034828225443497824",
            "extra": "mean: 29.732835285713982 msec\nrounds: 35"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 1715.9086844141107,
            "unit": "iter/sec",
            "range": "stddev: 0.000016647823618665614",
            "extra": "mean: 582.7815950132833 usec\nrounds: 1805"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 79.9230923964942,
            "unit": "iter/sec",
            "range": "stddev: 0.000453560084645355",
            "extra": "mean: 12.512028376467883 msec\nrounds: 85"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 92933.1657701298,
            "unit": "iter/sec",
            "range": "stddev: 0.0000010365681311117826",
            "extra": "mean: 10.760421123213431 usec\nrounds: 94787"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
            "value": 27036.977623855044,
            "unit": "iter/sec",
            "range": "stddev: 0.0000020393069644336897",
            "extra": "mean: 36.98638264647185 usec\nrounds: 27626"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
            "value": 6197.584134732305,
            "unit": "iter/sec",
            "range": "stddev: 0.00000487300079005964",
            "extra": "mean: 161.35319477081907 usec\nrounds: 6387"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 35.45289594410385,
            "unit": "iter/sec",
            "range": "stddev: 0.0001794639274291144",
            "extra": "mean: 28.206440499998408 msec\nrounds: 36"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 35.344799074227936,
            "unit": "iter/sec",
            "range": "stddev: 0.00018022880152298917",
            "extra": "mean: 28.292705749999907 msec\nrounds: 36"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 33.79817760170278,
            "unit": "iter/sec",
            "range": "stddev: 0.002620979661611519",
            "extra": "mean: 29.587394083331258 msec\nrounds: 36"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 3172.8077803397487,
            "unit": "iter/sec",
            "range": "stddev: 0.000013393784798041898",
            "extra": "mean: 315.1782488042558 usec\nrounds: 4180"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 2824.030902088992,
            "unit": "iter/sec",
            "range": "stddev: 0.000014084847274934772",
            "extra": "mean: 354.10377388585937 usec\nrounds: 2941"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 2107.8978775502405,
            "unit": "iter/sec",
            "range": "stddev: 0.000015769683792508467",
            "extra": "mean: 474.40628440794364 usec\nrounds: 2187"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 140.26502451152115,
            "unit": "iter/sec",
            "range": "stddev: 0.0003829529147049668",
            "extra": "mean: 7.129361032677548 msec\nrounds: 153"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 136.80854359772226,
            "unit": "iter/sec",
            "range": "stddev: 0.0004355708918855004",
            "extra": "mean: 7.309485019740018 msec\nrounds: 152"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 135.491568409798,
            "unit": "iter/sec",
            "range": "stddev: 0.00043484591427718657",
            "extra": "mean: 7.38053306000173 msec\nrounds: 150"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 35.29527001237751,
            "unit": "iter/sec",
            "range": "stddev: 0.0001895478048770301",
            "extra": "mean: 28.332408270267248 msec\nrounds: 37"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 34.8959213829346,
            "unit": "iter/sec",
            "range": "stddev: 0.00028490773850064447",
            "extra": "mean: 28.65664411110913 msec\nrounds: 36"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 7474.141439560037,
            "unit": "iter/sec",
            "range": "stddev: 0.0000068794340527288846",
            "extra": "mean: 133.79463154217012 usec\nrounds: 10069"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 979311.5359997371,
            "unit": "iter/sec",
            "range": "stddev: 1.1522119849437757e-7",
            "extra": "mean: 1.0211255185298544 usec\nrounds: 101534"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3293891.2011050843,
            "unit": "iter/sec",
            "range": "stddev: 4.261544201930492e-8",
            "extra": "mean: 303.59229827157156 nsec\nrounds: 192345"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1575891.9051194577,
            "unit": "iter/sec",
            "range": "stddev: 8.681031682392184e-8",
            "extra": "mean: 634.5612898647365 nsec\nrounds: 163908"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 157170.14945400404,
            "unit": "iter/sec",
            "range": "stddev: 9.818532098585302e-7",
            "extra": "mean: 6.3625313297335175 usec\nrounds: 171498"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 1063.1364496700344,
            "unit": "iter/sec",
            "range": "stddev: 0.000028978929962805916",
            "extra": "mean: 940.6130326077804 usec\nrounds: 1104"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 119.76724662928628,
            "unit": "iter/sec",
            "range": "stddev: 0.000049440175365955936",
            "extra": "mean: 8.349528173552196 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 18.368218813606433,
            "unit": "iter/sec",
            "range": "stddev: 0.00042346218589561676",
            "extra": "mean: 54.44186015789622 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 119.39368394284715,
            "unit": "iter/sec",
            "range": "stddev: 0.00007166529334847423",
            "extra": "mean: 8.375652438019188 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 108.41953942574995,
            "unit": "iter/sec",
            "range": "stddev: 0.00010913440946563637",
            "extra": "mean: 9.223429700002002 msec\nrounds: 110"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 118.52576819834833,
            "unit": "iter/sec",
            "range": "stddev: 0.00009423044565988548",
            "extra": "mean: 8.436983916666444 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 159.48584315945016,
            "unit": "iter/sec",
            "range": "stddev: 0.00004634909050058236",
            "extra": "mean: 6.2701489999975974 msec\nrounds: 162"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 1087.6697010266946,
            "unit": "iter/sec",
            "range": "stddev: 0.000020711309534841462",
            "extra": "mean: 919.3967608512586 usec\nrounds: 1129"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 119.12266515464799,
            "unit": "iter/sec",
            "range": "stddev: 0.00026666122357135643",
            "extra": "mean: 8.394708082645526 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 119.56148038617816,
            "unit": "iter/sec",
            "range": "stddev: 0.000048786351103358935",
            "extra": "mean: 8.363897776859615 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 28100.966218423695,
            "unit": "iter/sec",
            "range": "stddev: 0.0000022863892861708247",
            "extra": "mean: 35.58596498879013 usec\nrounds: 28848"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 49.2665949712653,
            "unit": "iter/sec",
            "range": "stddev: 0.014639675417995447",
            "extra": "mean: 20.297729132351225 msec\nrounds: 68"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 3.493643302037307,
            "unit": "iter/sec",
            "range": "stddev: 0.0012149814598978576",
            "extra": "mean: 286.23414400000513 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.288576839466303,
            "unit": "iter/sec",
            "range": "stddev: 0.0007417142415986772",
            "extra": "mean: 776.0499563333573 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.13178710920552747,
            "unit": "iter/sec",
            "range": "stddev: 0.05328946233725545",
            "extra": "mean: 7.5879955636666905 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.2913624467840248,
            "unit": "iter/sec",
            "range": "stddev: 0.00456635673464928",
            "extra": "mean: 774.3759333333363 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 3.2326882975266495,
            "unit": "iter/sec",
            "range": "stddev: 0.0019065076462672901",
            "extra": "mean: 309.3400625000271 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 1.060422012047849,
            "unit": "iter/sec",
            "range": "stddev: 0.0003865272879131721",
            "extra": "mean: 943.0207866666555 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 2.4888015420573333,
            "unit": "iter/sec",
            "range": "stddev: 0.0021580124777349553",
            "extra": "mean: 401.7998153333527 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 3.416812004395484,
            "unit": "iter/sec",
            "range": "stddev: 0.002792458259598691",
            "extra": "mean: 292.67047725001305 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.2973562845110498,
            "unit": "iter/sec",
            "range": "stddev: 0.002875168019203355",
            "extra": "mean: 770.7982856666717 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.2945142472871982,
            "unit": "iter/sec",
            "range": "stddev: 0.0008388881850717676",
            "extra": "mean: 772.490532333355 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 11426.884389845458,
            "unit": "iter/sec",
            "range": "stddev: 0.000003353199037054606",
            "extra": "mean: 87.51291829719163 usec\nrounds: 11603"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 292.37980823343236,
            "unit": "iter/sec",
            "range": "stddev: 0.00002604066596014907",
            "extra": "mean: 3.42020882372839 msec\nrounds: 295"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 29.78759146196207,
            "unit": "iter/sec",
            "range": "stddev: 0.001571138742837897",
            "extra": "mean: 33.571025749999706 msec\nrounds: 32"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 17.78772032703388,
            "unit": "iter/sec",
            "range": "stddev: 0.001434613044182532",
            "extra": "mean: 56.21855873684916 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.504867777962084,
            "unit": "iter/sec",
            "range": "stddev: 0.0016255884728602018",
            "extra": "mean: 181.6574058333155 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 17.538274040821097,
            "unit": "iter/sec",
            "range": "stddev: 0.001820939695912419",
            "extra": "mean: 57.018153421052524 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 22.18258131269225,
            "unit": "iter/sec",
            "range": "stddev: 0.002039383909210369",
            "extra": "mean: 45.08041629167062 msec\nrounds: 24"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 17.713639799860335,
            "unit": "iter/sec",
            "range": "stddev: 0.0018443040127406245",
            "extra": "mean: 56.453671368426754 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 17.459295254313812,
            "unit": "iter/sec",
            "range": "stddev: 0.0019757434886391776",
            "extra": "mean: 57.27608047369047 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 29.66696528568155,
            "unit": "iter/sec",
            "range": "stddev: 0.0016063879158596307",
            "extra": "mean: 33.70752587500547 msec\nrounds: 32"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 17.73043687261942,
            "unit": "iter/sec",
            "range": "stddev: 0.0017416608633606283",
            "extra": "mean: 56.40018952630941 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 17.709258894541303,
            "unit": "iter/sec",
            "range": "stddev: 0.0015608472667275964",
            "extra": "mean: 56.467636842117635 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 21815.407679727756,
            "unit": "iter/sec",
            "range": "stddev: 0.0000024184446007519645",
            "extra": "mean: 45.83916169163608 usec\nrounds: 22345"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 47.82365621020453,
            "unit": "iter/sec",
            "range": "stddev: 0.013908926902268937",
            "extra": "mean: 20.91015366128827 msec\nrounds: 62"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 172.61285205072878,
            "unit": "iter/sec",
            "range": "stddev: 0.00002952790854599456",
            "extra": "mean: 5.79331137930629 msec\nrounds: 174"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.476122320953706,
            "unit": "iter/sec",
            "range": "stddev: 0.00024117137371501272",
            "extra": "mean: 69.07927259999269 msec\nrounds: 15"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
            "value": 1.1471568282413132,
            "unit": "iter/sec",
            "range": "stddev: 0.004284381418442742",
            "extra": "mean: 871.7203920000051 msec\nrounds: 3"
          }
        ]
      }
    ]
  }
}