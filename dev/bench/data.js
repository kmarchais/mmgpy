window.BENCHMARK_DATA = {
  "lastUpdate": 1768156585661,
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
          "id": "0a37136c38ab6bdfa1c1e7d060dd1c3e7d2106bd",
          "message": "docs(stubs): improve type stubs with comprehensive documentation (#143)\n\n- Add MMG_VERSION constant\n- Replace ellipsis defaults with actual None defaults in static methods\n- Add comprehensive docstrings explaining all parameters and return types\n- Document 0-based indexing convention (Python) vs 1-based (MMG internal)\n- Document supported solution fields (metric, displacement, levelset, tensor)\n- Correctly document MmgMeshS as not supporting remesh_lagrangian\n- Add mypy to dev dependencies for stub validation\n- Configure ruff to allow docstrings in stubs for IDE support\n\nCloses #111",
          "timestamp": "2026-01-11T19:26:14+01:00",
          "tree_id": "313eb157be2b459d70d688c78ffb4686b6ab2daf",
          "url": "https://github.com/kmarchais/mmgpy/commit/0a37136c38ab6bdfa1c1e7d060dd1c3e7d2106bd"
        },
        "date": 1768156584565,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 0.5981461550941387,
            "unit": "iter/sec",
            "range": "stddev: 0.01131197752516244",
            "extra": "mean: 1.6718321960000158 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.6000449125216372,
            "unit": "iter/sec",
            "range": "stddev: 0.014880200308916937",
            "extra": "mean: 1.6665419190000061 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.1853461492216109,
            "unit": "iter/sec",
            "range": "stddev: 0.0030069098083818535",
            "extra": "mean: 843.6354230000044 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.2463383705570765,
            "unit": "iter/sec",
            "range": "stddev: 0.005183113818970768",
            "extra": "mean: 802.3503276666588 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 0.605471923567681,
            "unit": "iter/sec",
            "range": "stddev: 0.008122618233115582",
            "extra": "mean: 1.6516042463333445 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.5993182586998222,
            "unit": "iter/sec",
            "range": "stddev: 0.022449938104072448",
            "extra": "mean: 1.668562546666654 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.2564453510552172,
            "unit": "iter/sec",
            "range": "stddev: 0.004811592535873336",
            "extra": "mean: 795.8961359999913 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.2387945238789257,
            "unit": "iter/sec",
            "range": "stddev: 0.0030393396949450467",
            "extra": "mean: 807.2363743333236 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 1.2513806514011292,
            "unit": "iter/sec",
            "range": "stddev: 0.006090929091564301",
            "extra": "mean: 799.1173580000085 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.2577916366104778,
            "unit": "iter/sec",
            "range": "stddev: 0.006760096185652722",
            "extra": "mean: 795.0442433333554 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 119.57590776907468,
            "unit": "iter/sec",
            "range": "stddev: 0.0001756186739712383",
            "extra": "mean: 8.362888634148636 msec\nrounds: 123"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 1.1868346807283654,
            "unit": "iter/sec",
            "range": "stddev: 0.004874728720491101",
            "extra": "mean: 842.5773329999894 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 1.1763825385395699,
            "unit": "iter/sec",
            "range": "stddev: 0.006307463947562253",
            "extra": "mean: 850.0636206666741 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 16.071375451481423,
            "unit": "iter/sec",
            "range": "stddev: 0.0010494820552026099",
            "extra": "mean: 62.22242788235168 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 368.7533960947672,
            "unit": "iter/sec",
            "range": "stddev: 0.0002634456910150773",
            "extra": "mean: 2.7118394314204677 msec\nrounds: 401"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 24.705551586968983,
            "unit": "iter/sec",
            "range": "stddev: 0.00033894082615774126",
            "extra": "mean: 40.476732384613214 msec\nrounds: 26"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 163.85104111635084,
            "unit": "iter/sec",
            "range": "stddev: 0.000268272031335",
            "extra": "mean: 6.1031043390801445 msec\nrounds: 174"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 256.8198561250049,
            "unit": "iter/sec",
            "range": "stddev: 0.00006852381702822712",
            "extra": "mean: 3.893779924529116 msec\nrounds: 265"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 276.3557519698147,
            "unit": "iter/sec",
            "range": "stddev: 0.0002226715423166147",
            "extra": "mean: 3.6185242857157034 msec\nrounds: 301"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 61.79937983656624,
            "unit": "iter/sec",
            "range": "stddev: 0.00015214629353321613",
            "extra": "mean: 16.18139215384662 msec\nrounds: 65"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 930.313429600091,
            "unit": "iter/sec",
            "range": "stddev: 0.000025319541876226767",
            "extra": "mean: 1.07490655104255 msec\nrounds: 960"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 24.682673331614932,
            "unit": "iter/sec",
            "range": "stddev: 0.00041899594933537016",
            "extra": "mean: 40.51425008000024 msec\nrounds: 25"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 1968.9905304871877,
            "unit": "iter/sec",
            "range": "stddev: 0.000022022678207339406",
            "extra": "mean: 507.874458772826 usec\nrounds: 2086"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 61.75184354940949,
            "unit": "iter/sec",
            "range": "stddev: 0.0002493841434130961",
            "extra": "mean: 16.19384851562966 msec\nrounds: 64"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 90559.76345848684,
            "unit": "iter/sec",
            "range": "stddev: 0.0000010451405917666132",
            "extra": "mean: 11.04243166953949 usec\nrounds: 92499"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
            "value": 27599.790932610256,
            "unit": "iter/sec",
            "range": "stddev: 0.0000019844938746841763",
            "extra": "mean: 36.23215851314511 usec\nrounds: 28086"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
            "value": 5705.543985262091,
            "unit": "iter/sec",
            "range": "stddev: 0.000005548973129837842",
            "extra": "mean: 175.26812563062973 usec\nrounds: 6543"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 25.392752835172956,
            "unit": "iter/sec",
            "range": "stddev: 0.0007214601508271962",
            "extra": "mean: 39.38131507407273 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 25.657404275302817,
            "unit": "iter/sec",
            "range": "stddev: 0.0004234077115236515",
            "extra": "mean: 38.975104000001096 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 25.63809925679773,
            "unit": "iter/sec",
            "range": "stddev: 0.00036931285432181333",
            "extra": "mean: 39.004451538460216 msec\nrounds: 26"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 3011.721779677519,
            "unit": "iter/sec",
            "range": "stddev: 0.000013591047855409074",
            "extra": "mean: 332.0359824562132 usec\nrounds: 3192"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 2672.2213591620407,
            "unit": "iter/sec",
            "range": "stddev: 0.00005895156744136146",
            "extra": "mean: 374.2204950841279 usec\nrounds: 2848"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 2060.256771273327,
            "unit": "iter/sec",
            "range": "stddev: 0.000013845778618206277",
            "extra": "mean: 485.37639285706956 usec\nrounds: 2128"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 91.3732300681089,
            "unit": "iter/sec",
            "range": "stddev: 0.0003609639621972458",
            "extra": "mean: 10.944124436168096 msec\nrounds: 94"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 89.42584342715418,
            "unit": "iter/sec",
            "range": "stddev: 0.0004949248740599777",
            "extra": "mean: 11.182449744682527 msec\nrounds: 94"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 87.77646626804115,
            "unit": "iter/sec",
            "range": "stddev: 0.00024776424380933766",
            "extra": "mean: 11.392575282608451 msec\nrounds: 92"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 25.876177702598643,
            "unit": "iter/sec",
            "range": "stddev: 0.00030227396906152654",
            "extra": "mean: 38.64558403846384 msec\nrounds: 26"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 25.8967579953202,
            "unit": "iter/sec",
            "range": "stddev: 0.00036932614791169337",
            "extra": "mean: 38.614872185186655 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 7029.362171929483,
            "unit": "iter/sec",
            "range": "stddev: 0.000010504695102528066",
            "extra": "mean: 142.2604178787833 usec\nrounds: 7495"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 1042244.318364658,
            "unit": "iter/sec",
            "range": "stddev: 8.878054962780034e-8",
            "extra": "mean: 959.4679312515306 nsec\nrounds: 106861"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3514124.3618826936,
            "unit": "iter/sec",
            "range": "stddev: 3.924982492284886e-8",
            "extra": "mean: 284.5659108843403 nsec\nrounds: 191608"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1620405.0952563945,
            "unit": "iter/sec",
            "range": "stddev: 6.818654142116355e-8",
            "extra": "mean: 617.1296319219309 nsec\nrounds: 166918"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 151954.89711121086,
            "unit": "iter/sec",
            "range": "stddev: 8.691392340016396e-7",
            "extra": "mean: 6.58090011582932 usec\nrounds: 157953"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 1121.5723065805848,
            "unit": "iter/sec",
            "range": "stddev: 0.000038516874681757154",
            "extra": "mean: 891.605466836792 usec\nrounds: 1176"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 118.36035297382332,
            "unit": "iter/sec",
            "range": "stddev: 0.0001408761571314859",
            "extra": "mean: 8.448775074379517 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 18.358255865397492,
            "unit": "iter/sec",
            "range": "stddev: 0.0002519281402762992",
            "extra": "mean: 54.47140552631948 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 118.51036158127235,
            "unit": "iter/sec",
            "range": "stddev: 0.00016430325204210816",
            "extra": "mean: 8.43808074380245 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 110.03265168386993,
            "unit": "iter/sec",
            "range": "stddev: 0.00011630720095894116",
            "extra": "mean: 9.088211405402252 msec\nrounds: 111"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 120.0021582289762,
            "unit": "iter/sec",
            "range": "stddev: 0.00007887667713378933",
            "extra": "mean: 8.333183459016622 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 162.36581149580863,
            "unit": "iter/sec",
            "range": "stddev: 0.00005516303707747332",
            "extra": "mean: 6.15893204848617 msec\nrounds: 165"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 1187.2081188241846,
            "unit": "iter/sec",
            "range": "stddev: 0.00002834525480953836",
            "extra": "mean: 842.3122990351548 usec\nrounds: 1244"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 121.09836095242353,
            "unit": "iter/sec",
            "range": "stddev: 0.00005359178077694842",
            "extra": "mean: 8.257750081298578 msec\nrounds: 123"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 120.9076684942452,
            "unit": "iter/sec",
            "range": "stddev: 0.00007772409045406845",
            "extra": "mean: 8.270773991871298 msec\nrounds: 123"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 28364.507829976563,
            "unit": "iter/sec",
            "range": "stddev: 0.0000021792788130142223",
            "extra": "mean: 35.2553270444258 usec\nrounds: 29152"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 47.355935612289144,
            "unit": "iter/sec",
            "range": "stddev: 0.015760758497359976",
            "extra": "mean: 21.116677076917348 msec\nrounds: 65"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 3.205537412013531,
            "unit": "iter/sec",
            "range": "stddev: 0.0028288142220984193",
            "extra": "mean: 311.96017124999287 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.258655710289131,
            "unit": "iter/sec",
            "range": "stddev: 0.001053528843888344",
            "extra": "mean: 794.4984413333221 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.12719468204580076,
            "unit": "iter/sec",
            "range": "stddev: 0.01878919831161637",
            "extra": "mean: 7.8619639116666535 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.2504840086931852,
            "unit": "iter/sec",
            "range": "stddev: 0.00281507490287853",
            "extra": "mean: 799.690354333317 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 2.925980003310332,
            "unit": "iter/sec",
            "range": "stddev: 0.0020425941551963298",
            "extra": "mean: 341.76583533333843 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 1.0209609330449576,
            "unit": "iter/sec",
            "range": "stddev: 0.011078111622602558",
            "extra": "mean: 979.4694073333025 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 2.3390045763499563,
            "unit": "iter/sec",
            "range": "stddev: 0.0018477639938543574",
            "extra": "mean: 427.53229733330045 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 3.132384940101003,
            "unit": "iter/sec",
            "range": "stddev: 0.0025541994550445646",
            "extra": "mean: 319.2455649999886 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.2543650686610217,
            "unit": "iter/sec",
            "range": "stddev: 0.0008563487248678333",
            "extra": "mean: 797.2160776666518 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.2237993987284608,
            "unit": "iter/sec",
            "range": "stddev: 0.039063586676390594",
            "extra": "mean: 817.1273830000322 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 11192.791153919268,
            "unit": "iter/sec",
            "range": "stddev: 0.000009880210010851468",
            "extra": "mean: 89.34321977854826 usec\nrounds: 11548"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 263.4991209810625,
            "unit": "iter/sec",
            "range": "stddev: 0.00002727561313198716",
            "extra": "mean: 3.7950790738002853 msec\nrounds: 271"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 26.4896736287169,
            "unit": "iter/sec",
            "range": "stddev: 0.0016814370007060795",
            "extra": "mean: 37.750559482768445 msec\nrounds: 29"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 16.738721500134996,
            "unit": "iter/sec",
            "range": "stddev: 0.0013969417360323768",
            "extra": "mean: 59.74171922221987 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.337101616464302,
            "unit": "iter/sec",
            "range": "stddev: 0.008007301738091003",
            "extra": "mean: 187.36761483332506 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 16.751795382042623,
            "unit": "iter/sec",
            "range": "stddev: 0.001504339839207771",
            "extra": "mean: 59.69509400001193 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 20.289198790389783,
            "unit": "iter/sec",
            "range": "stddev: 0.0020623919894597583",
            "extra": "mean: 49.287308500011434 msec\nrounds: 22"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 16.914865616023068,
            "unit": "iter/sec",
            "range": "stddev: 0.0016021273966884346",
            "extra": "mean: 59.11959472221421 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 16.37229957246777,
            "unit": "iter/sec",
            "range": "stddev: 0.001583669591156861",
            "extra": "mean: 61.07877488887602 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 26.92405941200427,
            "unit": "iter/sec",
            "range": "stddev: 0.0012928686861078075",
            "extra": "mean: 37.14150175861458 msec\nrounds: 29"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 16.509750673885218,
            "unit": "iter/sec",
            "range": "stddev: 0.0016573703293492085",
            "extra": "mean: 60.570266611099065 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 16.43731740098314,
            "unit": "iter/sec",
            "range": "stddev: 0.001456962369179082",
            "extra": "mean: 60.83717772221083 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 21664.102759745903,
            "unit": "iter/sec",
            "range": "stddev: 0.000002588740038322402",
            "extra": "mean: 46.15930837708642 usec\nrounds: 22132"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 42.82724603931281,
            "unit": "iter/sec",
            "range": "stddev: 0.017554488062299412",
            "extra": "mean: 23.349621852454874 msec\nrounds: 61"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 173.16465072468532,
            "unit": "iter/sec",
            "range": "stddev: 0.00002789574124251108",
            "extra": "mean: 5.774850674286297 msec\nrounds: 175"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.599419691753637,
            "unit": "iter/sec",
            "range": "stddev: 0.00014160698682704243",
            "extra": "mean: 68.4958732000041 msec\nrounds: 15"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
            "value": 1.1298151847567641,
            "unit": "iter/sec",
            "range": "stddev: 0.007557035639958364",
            "extra": "mean: 885.1005133333274 msec\nrounds: 3"
          }
        ]
      }
    ]
  }
}