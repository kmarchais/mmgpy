window.BENCHMARK_DATA = {
  "lastUpdate": 1775030264900,
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
          "id": "0bbf713719b19256a00ae3b272234dbe6166ddf4",
          "message": "feat: complete constraint marker coverage and add unset variants (#208)\n\n* feat: complete constraint marker coverage and add unset variants\n\nAdd missing set_* constraint methods to fill coverage gaps across\nMMG3D, MMG2D, and MMGS bindings, and expose all unset_* counterparts\nfrom the MMG C API.\n\nNew setters: set_required_edges (3D, Surface), set_required_tetrahedra\n(3D), set_parallel_triangles (3D), set_parallel_edges (2D).\n\nNew unset methods for all three mesh classes: unset_corners,\nunset_required_vertices, unset_required_triangles, unset_required_edges,\nunset_required_tetrahedra, unset_ridge_edges, unset_parallel_triangles.\n\nCloses #207 (priority 1)\n\n* refactor: reduce constraint method boilerplate and add round-trip test assertions\n\nExtract common validation/iteration pattern into apply_attribute_to_indices\ntemplate helper in mmg_common.hpp, replacing ~740 lines of duplicated code\nacross the three mesh classes with ~90 lines.\n\nMove ensure_c_contiguous to mmg_common.hpp to eliminate triple duplication.\n\nAdd get_vertex_flags(idx) method to all mesh classes to query corner and\nrequired flags via the existing MMG GetByIdx_vertex API.\n\nAdd round-trip assertions to set/unset corner and required vertex tests\nacross all three mesh types, verifying flags are actually applied and\nremoved rather than just checking for no-throw.",
          "timestamp": "2026-04-01T09:48:46+02:00",
          "tree_id": "52f4750c19459d64c73f8b86cf6477e0d6b98957",
          "url": "https://github.com/kmarchais/mmgpy/commit/0bbf713719b19256a00ae3b272234dbe6166ddf4"
        },
        "date": 1775030263624,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 1.111821208668871,
            "unit": "iter/sec",
            "range": "stddev: 0.024772053840561064",
            "extra": "mean: 899.4251883333391 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.5459455924456802,
            "unit": "iter/sec",
            "range": "stddev: 0.033543524072277855",
            "extra": "mean: 1.831684354333343 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.0906780103471796,
            "unit": "iter/sec",
            "range": "stddev: 0.0044081573933101035",
            "extra": "mean: 916.8608796666623 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.1628713860746962,
            "unit": "iter/sec",
            "range": "stddev: 0.013321244519748138",
            "extra": "mean: 859.9403269999849 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 1.1160103145512363,
            "unit": "iter/sec",
            "range": "stddev: 0.017853957386742864",
            "extra": "mean: 896.0490659999986 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.5574608052476074,
            "unit": "iter/sec",
            "range": "stddev: 0.014072128551328406",
            "extra": "mean: 1.793848088666664 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.143499291110861,
            "unit": "iter/sec",
            "range": "stddev: 0.01463732545341468",
            "extra": "mean: 874.5086313333369 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.220925343249029,
            "unit": "iter/sec",
            "range": "stddev: 0.009320657024754752",
            "extra": "mean: 819.0508989999993 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 54.33897456739601,
            "unit": "iter/sec",
            "range": "stddev: 0.0023520390956995154",
            "extra": "mean: 18.402997258619802 msec\nrounds: 58"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.1589941589452923,
            "unit": "iter/sec",
            "range": "stddev: 0.004988858527277345",
            "extra": "mean: 862.8171179999905 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 116.80055311291024,
            "unit": "iter/sec",
            "range": "stddev: 0.00016343122251654953",
            "extra": "mean: 8.561603291666842 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 15.209513679325703,
            "unit": "iter/sec",
            "range": "stddev: 0.0009900367019034782",
            "extra": "mean: 65.74832181250478 msec\nrounds: 16"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 1.069624466783153,
            "unit": "iter/sec",
            "range": "stddev: 0.011760880409494358",
            "extra": "mean: 934.9075596666694 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 16.551576429380834,
            "unit": "iter/sec",
            "range": "stddev: 0.0016372303996388669",
            "extra": "mean: 60.41720583333029 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 342.47672148505364,
            "unit": "iter/sec",
            "range": "stddev: 0.0005166672549134873",
            "extra": "mean: 2.9199064849248217 msec\nrounds: 398"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 28.990274704050687,
            "unit": "iter/sec",
            "range": "stddev: 0.0004339029309300317",
            "extra": "mean: 34.494326466671055 msec\nrounds: 30"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 163.26612172537347,
            "unit": "iter/sec",
            "range": "stddev: 0.00034013469958165695",
            "extra": "mean: 6.1249694022993895 msec\nrounds: 174"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 245.14322663674622,
            "unit": "iter/sec",
            "range": "stddev: 0.0007055155024983361",
            "extra": "mean: 4.0792479307690686 msec\nrounds: 260"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 254.29918994324288,
            "unit": "iter/sec",
            "range": "stddev: 0.0005487734962360819",
            "extra": "mean: 3.93237587671117 msec\nrounds: 292"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 71.86815395045726,
            "unit": "iter/sec",
            "range": "stddev: 0.00018401757655736535",
            "extra": "mean: 13.914368813332203 msec\nrounds: 75"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 849.1165362169467,
            "unit": "iter/sec",
            "range": "stddev: 0.0000599878021964643",
            "extra": "mean: 1.1776946477279568 msec\nrounds: 880"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 32.75755018055912,
            "unit": "iter/sec",
            "range": "stddev: 0.0002547230272286188",
            "extra": "mean: 30.527313382350485 msec\nrounds: 34"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 1670.9164607199198,
            "unit": "iter/sec",
            "range": "stddev: 0.000019268994658679998",
            "extra": "mean: 598.4739653406411 usec\nrounds: 1760"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 72.19448975916154,
            "unit": "iter/sec",
            "range": "stddev: 0.002057462715281862",
            "extra": "mean: 13.851472644740165 msec\nrounds: 76"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 89041.21073577102,
            "unit": "iter/sec",
            "range": "stddev: 0.000001418826288577684",
            "extra": "mean: 11.230754745322264 usec\nrounds: 92251"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
            "value": 26889.86233985644,
            "unit": "iter/sec",
            "range": "stddev: 0.0000022842709061106255",
            "extra": "mean: 37.18873631114836 usec\nrounds: 27559"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
            "value": 5910.999785322726,
            "unit": "iter/sec",
            "range": "stddev: 0.0000053078436196211",
            "extra": "mean: 169.17611847712197 usec\nrounds: 6592"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 34.53692200874608,
            "unit": "iter/sec",
            "range": "stddev: 0.0004990013052846297",
            "extra": "mean: 28.95452002777669 msec\nrounds: 36"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 34.24338802315188,
            "unit": "iter/sec",
            "range": "stddev: 0.00038282438315067463",
            "extra": "mean: 29.20271788889295 msec\nrounds: 36"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 33.82293114948537,
            "unit": "iter/sec",
            "range": "stddev: 0.0004246581338972631",
            "extra": "mean: 29.565740342856575 msec\nrounds: 35"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 3047.1767473157984,
            "unit": "iter/sec",
            "range": "stddev: 0.000012871653285609548",
            "extra": "mean: 328.17262762354744 usec\nrounds: 3859"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 2745.727545400392,
            "unit": "iter/sec",
            "range": "stddev: 0.000011539658090155713",
            "extra": "mean: 364.20219539815133 usec\nrounds: 2825"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 2051.5252524095386,
            "unit": "iter/sec",
            "range": "stddev: 0.000012204033170019635",
            "extra": "mean: 487.4422085838276 usec\nrounds: 2330"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 124.32246832766582,
            "unit": "iter/sec",
            "range": "stddev: 0.00010598862269200614",
            "extra": "mean: 8.043598341084959 msec\nrounds: 129"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 122.68359367952702,
            "unit": "iter/sec",
            "range": "stddev: 0.00013468332209974602",
            "extra": "mean: 8.15104913385722 msec\nrounds: 127"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 121.14103019325867,
            "unit": "iter/sec",
            "range": "stddev: 0.00011614339445519",
            "extra": "mean: 8.254841471999043 msec\nrounds: 125"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 34.95843309753785,
            "unit": "iter/sec",
            "range": "stddev: 0.00018149549335239287",
            "extra": "mean: 28.605401083334907 msec\nrounds: 36"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 34.92414745833954,
            "unit": "iter/sec",
            "range": "stddev: 0.00024211753449814808",
            "extra": "mean: 28.633483500001944 msec\nrounds: 36"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 6957.531648317089,
            "unit": "iter/sec",
            "range": "stddev: 0.0000063464296360606275",
            "extra": "mean: 143.72913420262822 usec\nrounds: 8897"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 965221.2487436135,
            "unit": "iter/sec",
            "range": "stddev: 1.5250786255726044e-7",
            "extra": "mean: 1.036031895590422 usec\nrounds: 100412"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3279229.8991483026,
            "unit": "iter/sec",
            "range": "stddev: 4.699274612897651e-8",
            "extra": "mean: 304.9496469459871 nsec\nrounds: 199204"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1580045.5216720637,
            "unit": "iter/sec",
            "range": "stddev: 8.928546049105945e-8",
            "extra": "mean: 632.8931580032975 nsec\nrounds: 164718"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 159401.26319566858,
            "unit": "iter/sec",
            "range": "stddev: 9.572867613281478e-7",
            "extra": "mean: 6.273476006099637 usec\nrounds: 172981"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 1033.4578671168565,
            "unit": "iter/sec",
            "range": "stddev: 0.00003249188638512121",
            "extra": "mean: 967.6253206043152 usec\nrounds: 1126"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 115.5328101117341,
            "unit": "iter/sec",
            "range": "stddev: 0.00010654077816114034",
            "extra": "mean: 8.655549873952516 msec\nrounds: 119"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 18.06317741758035,
            "unit": "iter/sec",
            "range": "stddev: 0.00047261359321566055",
            "extra": "mean: 55.361245526312 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 112.61403242781941,
            "unit": "iter/sec",
            "range": "stddev: 0.0014110947132220148",
            "extra": "mean: 8.87988804273531 msec\nrounds: 117"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 104.78741129560909,
            "unit": "iter/sec",
            "range": "stddev: 0.00008829826966053929",
            "extra": "mean: 9.543131065419335 msec\nrounds: 107"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 114.61693826045118,
            "unit": "iter/sec",
            "range": "stddev: 0.00021174670413655363",
            "extra": "mean: 8.724713948715312 msec\nrounds: 117"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 156.89071563633016,
            "unit": "iter/sec",
            "range": "stddev: 0.0000757282405032649",
            "extra": "mean: 6.373863462500751 msec\nrounds: 160"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 1208.8612159569182,
            "unit": "iter/sec",
            "range": "stddev: 0.000038761365443705764",
            "extra": "mean: 827.2248185317233 usec\nrounds: 1295"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 115.63901967121053,
            "unit": "iter/sec",
            "range": "stddev: 0.00023765961442135522",
            "extra": "mean: 8.647600116666846 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 115.73872357376578,
            "unit": "iter/sec",
            "range": "stddev: 0.0001661957104939397",
            "extra": "mean: 8.640150583332229 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 27982.242810848245,
            "unit": "iter/sec",
            "range": "stddev: 0.000002796578459748516",
            "extra": "mean: 35.7369495633251 usec\nrounds: 28749"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 47.62184387083649,
            "unit": "iter/sec",
            "range": "stddev: 0.01635608114291313",
            "extra": "mean: 20.998766925368837 msec\nrounds: 67"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 3.1843148243159365,
            "unit": "iter/sec",
            "range": "stddev: 0.004821419816771225",
            "extra": "mean: 314.0393005000135 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.2223607378773622,
            "unit": "iter/sec",
            "range": "stddev: 0.0019211220781484826",
            "extra": "mean: 818.0891033333637 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.11688839445636627,
            "unit": "iter/sec",
            "range": "stddev: 0.30251485373929077",
            "extra": "mean: 8.555169267666637 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.215650747235888,
            "unit": "iter/sec",
            "range": "stddev: 0.0012328987992777775",
            "extra": "mean: 822.6046850000065 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 2.9635157223057402,
            "unit": "iter/sec",
            "range": "stddev: 0.001986410765243404",
            "extra": "mean: 337.43704900001603 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 0.9663680528287473,
            "unit": "iter/sec",
            "range": "stddev: 0.009916324315118278",
            "extra": "mean: 1.0348024203333352 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 2.2535524098768045,
            "unit": "iter/sec",
            "range": "stddev: 0.014164644307247176",
            "extra": "mean: 443.7438400000057 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 3.1878692496001073,
            "unit": "iter/sec",
            "range": "stddev: 0.0033015384845212423",
            "extra": "mean: 313.6891515000002 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.1990599993116833,
            "unit": "iter/sec",
            "range": "stddev: 0.005161501811865716",
            "extra": "mean: 833.9866233333169 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.1851486889263851,
            "unit": "iter/sec",
            "range": "stddev: 0.004980523953413955",
            "extra": "mean: 843.7759829999815 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 11377.517607049414,
            "unit": "iter/sec",
            "range": "stddev: 0.0000040098468595140134",
            "extra": "mean: 87.89263480290361 usec\nrounds: 11591"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 285.5518527937355,
            "unit": "iter/sec",
            "range": "stddev: 0.00004960580839851427",
            "extra": "mean: 3.50199093515368 msec\nrounds: 293"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 26.752671792913134,
            "unit": "iter/sec",
            "range": "stddev: 0.0015856549619977576",
            "extra": "mean: 37.37944410714533 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 16.87007288433741,
            "unit": "iter/sec",
            "range": "stddev: 0.0014562763323799077",
            "extra": "mean: 59.2765666666695 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.476635563666615,
            "unit": "iter/sec",
            "range": "stddev: 0.0016116358173154295",
            "extra": "mean: 182.59385500000272 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 16.99451567341253,
            "unit": "iter/sec",
            "range": "stddev: 0.0016392309153789456",
            "extra": "mean: 58.84251244443956 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 20.997391142616674,
            "unit": "iter/sec",
            "range": "stddev: 0.002086401640759645",
            "extra": "mean: 47.62496413044297 msec\nrounds: 23"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 16.63105432824804,
            "unit": "iter/sec",
            "range": "stddev: 0.001913622562785992",
            "extra": "mean: 60.128478944446016 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 15.765294093100978,
            "unit": "iter/sec",
            "range": "stddev: 0.006293430967961035",
            "extra": "mean: 63.43046911110958 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 26.28085194281883,
            "unit": "iter/sec",
            "range": "stddev: 0.0017366834674469517",
            "extra": "mean: 38.05051686207787 msec\nrounds: 29"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 16.566972348811504,
            "unit": "iter/sec",
            "range": "stddev: 0.001754194247035587",
            "extra": "mean: 60.36105927778282 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 16.60223612456138,
            "unit": "iter/sec",
            "range": "stddev: 0.0018442416329256478",
            "extra": "mean: 60.232850111112334 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 21390.975677924085,
            "unit": "iter/sec",
            "range": "stddev: 0.0000030274728418737906",
            "extra": "mean: 46.74868575686428 usec\nrounds: 22088"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 42.984547127926966,
            "unit": "iter/sec",
            "range": "stddev: 0.017714538702014757",
            "extra": "mean: 23.26417437931554 msec\nrounds: 58"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 170.9524954656043,
            "unit": "iter/sec",
            "range": "stddev: 0.00008991027273939869",
            "extra": "mean: 5.849578254335575 msec\nrounds: 173"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 13.689765045209043,
            "unit": "iter/sec",
            "range": "stddev: 0.0005671105604618889",
            "extra": "mean: 73.0472726666676 msec\nrounds: 15"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
            "value": 1.0431012586774275,
            "unit": "iter/sec",
            "range": "stddev: 0.008389014424242525",
            "extra": "mean: 958.6796983333367 msec\nrounds: 3"
          }
        ]
      }
    ]
  }
}