window.BENCHMARK_DATA = {
  "lastUpdate": 1773579872135,
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
          "id": "ddf916d7c7580947289ea41a2711dd1aeec0621d",
          "message": "Merge pull request #184 from kmarchais/release/v0.7.0\n\nchore: release v0.7.0",
          "timestamp": "2026-03-15T13:48:00+01:00",
          "tree_id": "066e1aafffe7e6b193107dae96213f804cecc537",
          "url": "https://github.com/kmarchais/mmgpy/commit/ddf916d7c7580947289ea41a2711dd1aeec0621d"
        },
        "date": 1773579871057,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 1.143211935741717,
            "unit": "iter/sec",
            "range": "stddev: 0.015208092164549549",
            "extra": "mean: 874.7284459999966 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.56829958815401,
            "unit": "iter/sec",
            "range": "stddev: 0.008434237999741453",
            "extra": "mean: 1.7596352713333279 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.1864162092377502,
            "unit": "iter/sec",
            "range": "stddev: 0.005853443305558819",
            "extra": "mean: 842.8745260000122 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.2375165380008621,
            "unit": "iter/sec",
            "range": "stddev: 0.0026929344178523995",
            "extra": "mean: 808.0700089999956 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 1.1752991261151426,
            "unit": "iter/sec",
            "range": "stddev: 0.0016413646669839162",
            "extra": "mean: 850.8472250000049 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.5693014457601712,
            "unit": "iter/sec",
            "range": "stddev: 0.020861094483108016",
            "extra": "mean: 1.7565386623333268 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.2280728694426462,
            "unit": "iter/sec",
            "range": "stddev: 0.0010541233174032984",
            "extra": "mean: 814.2839280000089 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.2306600011741664,
            "unit": "iter/sec",
            "range": "stddev: 0.0027895930877284074",
            "extra": "mean: 812.5721150000041 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 29.756236693523626,
            "unit": "iter/sec",
            "range": "stddev: 0.0006627158050562621",
            "extra": "mean: 33.60640024138696 msec\nrounds: 29"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.0737476885003683,
            "unit": "iter/sec",
            "range": "stddev: 0.016275333426595477",
            "extra": "mean: 931.3174880000284 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 116.33927460311267,
            "unit": "iter/sec",
            "range": "stddev: 0.00042330794120416234",
            "extra": "mean: 8.595549554623448 msec\nrounds: 119"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 12.021429237007107,
            "unit": "iter/sec",
            "range": "stddev: 0.0037294561983533523",
            "extra": "mean: 83.18478446153239 msec\nrounds: 13"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 1.0140456764625474,
            "unit": "iter/sec",
            "range": "stddev: 0.003947895114165838",
            "extra": "mean: 986.1488719999821 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 17.1896812780411,
            "unit": "iter/sec",
            "range": "stddev: 0.0022249447457235874",
            "extra": "mean: 58.17443522221942 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 367.63624565238115,
            "unit": "iter/sec",
            "range": "stddev: 0.0001633569519596116",
            "extra": "mean: 2.7200800025184435 msec\nrounds: 397"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 31.045852539354858,
            "unit": "iter/sec",
            "range": "stddev: 0.0001882721287374891",
            "extra": "mean: 32.21042162499366 msec\nrounds: 32"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 146.08235948890052,
            "unit": "iter/sec",
            "range": "stddev: 0.00024599373355770163",
            "extra": "mean: 6.845453506492554 msec\nrounds: 154"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 254.10957029498792,
            "unit": "iter/sec",
            "range": "stddev: 0.0004101642305391185",
            "extra": "mean: 3.9353102633605297 msec\nrounds: 262"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 269.8442370243331,
            "unit": "iter/sec",
            "range": "stddev: 0.00030782291093583525",
            "extra": "mean: 3.7058416033907204 msec\nrounds: 295"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 73.48458396449618,
            "unit": "iter/sec",
            "range": "stddev: 0.00019606191412594327",
            "extra": "mean: 13.608296407898921 msec\nrounds: 76"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 924.4638783977757,
            "unit": "iter/sec",
            "range": "stddev: 0.00013420684808717226",
            "extra": "mean: 1.081708029234348 msec\nrounds: 992"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 32.78123659943688,
            "unit": "iter/sec",
            "range": "stddev: 0.0003303913414383016",
            "extra": "mean: 30.50525555882105 msec\nrounds: 34"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 2007.3737670211945,
            "unit": "iter/sec",
            "range": "stddev: 0.000018818203587694563",
            "extra": "mean: 498.1633298336521 usec\nrounds: 2095"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 79.74652112040329,
            "unit": "iter/sec",
            "range": "stddev: 0.0004148181872422927",
            "extra": "mean: 12.539731965111995 msec\nrounds: 86"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 93173.52868437796,
            "unit": "iter/sec",
            "range": "stddev: 9.564555330231816e-7",
            "extra": "mean: 10.732662099634164 usec\nrounds: 94886"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
            "value": 27022.19199270328,
            "unit": "iter/sec",
            "range": "stddev: 0.000002027539004966174",
            "extra": "mean: 37.00662034634448 usec\nrounds: 27504"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
            "value": 6407.928639805458,
            "unit": "iter/sec",
            "range": "stddev: 0.000005107584371360772",
            "extra": "mean: 156.05666920010515 usec\nrounds: 6578"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 34.26772506719101,
            "unit": "iter/sec",
            "range": "stddev: 0.00019870793487557917",
            "extra": "mean: 29.181978028574513 msec\nrounds: 35"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 34.45454289595854,
            "unit": "iter/sec",
            "range": "stddev: 0.00019041546044508482",
            "extra": "mean: 29.023748857144124 msec\nrounds: 35"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 34.013555892792496,
            "unit": "iter/sec",
            "range": "stddev: 0.0001762349758377706",
            "extra": "mean: 29.40004282856827 msec\nrounds: 35"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 3118.3266373182105,
            "unit": "iter/sec",
            "range": "stddev: 0.000021695301020085545",
            "extra": "mean: 320.68481474410555 usec\nrounds: 4205"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 2898.502072515296,
            "unit": "iter/sec",
            "range": "stddev: 0.00003349463355825571",
            "extra": "mean: 345.0057909160673 usec\nrounds: 3611"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 2082.1032745972484,
            "unit": "iter/sec",
            "range": "stddev: 0.00002804666831373068",
            "extra": "mean: 480.28357296226574 usec\nrounds: 2515"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 126.99846480432153,
            "unit": "iter/sec",
            "range": "stddev: 0.0004215784136544947",
            "extra": "mean: 7.874110931504518 msec\nrounds: 146"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 129.76300584471386,
            "unit": "iter/sec",
            "range": "stddev: 0.0003504975648896446",
            "extra": "mean: 7.706356626762256 msec\nrounds: 142"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 128.5386501217256,
            "unit": "iter/sec",
            "range": "stddev: 0.0003895087079218275",
            "extra": "mean: 7.779761177303512 msec\nrounds: 141"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 34.45619113207921,
            "unit": "iter/sec",
            "range": "stddev: 0.00013835802211665298",
            "extra": "mean: 29.02236048571792 msec\nrounds: 35"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 34.26770074290487,
            "unit": "iter/sec",
            "range": "stddev: 0.0002261974132603869",
            "extra": "mean: 29.181998742855544 msec\nrounds: 35"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 7437.263091920751,
            "unit": "iter/sec",
            "range": "stddev: 0.00001150750984003539",
            "extra": "mean: 134.45806443049193 usec\nrounds: 10166"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 1043832.3124950568,
            "unit": "iter/sec",
            "range": "stddev: 1.2746606210734456e-7",
            "extra": "mean: 958.0082816268783 nsec\nrounds: 108614"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3321147.1885380168,
            "unit": "iter/sec",
            "range": "stddev: 4.349870411113752e-8",
            "extra": "mean: 301.1007773010519 nsec\nrounds: 194932"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1621273.0512796247,
            "unit": "iter/sec",
            "range": "stddev: 6.93733958107499e-8",
            "extra": "mean: 616.7992487204598 nsec\nrounds: 167449"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 152356.00435923735,
            "unit": "iter/sec",
            "range": "stddev: 8.309824524893726e-7",
            "extra": "mean: 6.563574597572924 usec\nrounds: 172385"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 1047.20712262778,
            "unit": "iter/sec",
            "range": "stddev: 0.00003778954586355261",
            "extra": "mean: 954.9209305325176 usec\nrounds: 1238"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 118.84327491166097,
            "unit": "iter/sec",
            "range": "stddev: 0.0000571347779228159",
            "extra": "mean: 8.41444331404805 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 18.35494160461326,
            "unit": "iter/sec",
            "range": "stddev: 0.00012208489911212064",
            "extra": "mean: 54.48124115789417 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 119.13486247796654,
            "unit": "iter/sec",
            "range": "stddev: 0.00007683726521819763",
            "extra": "mean: 8.3938486115678 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 107.56727812278376,
            "unit": "iter/sec",
            "range": "stddev: 0.00013631292268106377",
            "extra": "mean: 9.296507427273003 msec\nrounds: 110"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 118.0835645602039,
            "unit": "iter/sec",
            "range": "stddev: 0.00007166471944033682",
            "extra": "mean: 8.46857904166806 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 158.62295193314733,
            "unit": "iter/sec",
            "range": "stddev: 0.00006696531576596186",
            "extra": "mean: 6.304257913580226 msec\nrounds: 162"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 1075.039185506647,
            "unit": "iter/sec",
            "range": "stddev: 0.00004263626331110787",
            "extra": "mean: 930.1986508786819 usec\nrounds: 1309"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 119.11859645631155,
            "unit": "iter/sec",
            "range": "stddev: 0.00007503670296293086",
            "extra": "mean: 8.394994818183275 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 118.89571923832071,
            "unit": "iter/sec",
            "range": "stddev: 0.0001373556541342147",
            "extra": "mean: 8.410731743802723 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 28454.91975255253,
            "unit": "iter/sec",
            "range": "stddev: 0.0000021955534746424044",
            "extra": "mean: 35.1433076844399 usec\nrounds: 29228"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 48.181452667210294,
            "unit": "iter/sec",
            "range": "stddev: 0.015918829367739598",
            "extra": "mean: 20.754874430769213 msec\nrounds: 65"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 3.302785438696274,
            "unit": "iter/sec",
            "range": "stddev: 0.0033436422490851414",
            "extra": "mean: 302.77473925001175 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.2261539230142278,
            "unit": "iter/sec",
            "range": "stddev: 0.0014544840176605076",
            "extra": "mean: 815.5582926666511 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.12149622147698914,
            "unit": "iter/sec",
            "range": "stddev: 0.03315525308897304",
            "extra": "mean: 8.230708641333308 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.2300255303361616,
            "unit": "iter/sec",
            "range": "stddev: 0.0005031962413421004",
            "extra": "mean: 812.9912553332966 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 2.9906873524855286,
            "unit": "iter/sec",
            "range": "stddev: 0.010323509199402236",
            "extra": "mean: 334.3712939999932 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 0.9895596437221189,
            "unit": "iter/sec",
            "range": "stddev: 0.0031238699635299278",
            "extra": "mean: 1.0105505073333536 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 2.3668346312692234,
            "unit": "iter/sec",
            "range": "stddev: 0.0021570786996391185",
            "extra": "mean: 422.5052256666307 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 3.2065668102590728,
            "unit": "iter/sec",
            "range": "stddev: 0.0016535872553137716",
            "extra": "mean: 311.8600232499773 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.2315890866135841,
            "unit": "iter/sec",
            "range": "stddev: 0.0007898696845726573",
            "extra": "mean: 811.9591273333148 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.218344075547554,
            "unit": "iter/sec",
            "range": "stddev: 0.007943191387188638",
            "extra": "mean: 820.7861966666314 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 11373.025476865609,
            "unit": "iter/sec",
            "range": "stddev: 0.00000647885884520596",
            "extra": "mean: 87.92735073302576 usec\nrounds: 11590"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 293.566692617991,
            "unit": "iter/sec",
            "range": "stddev: 0.00002846308239428851",
            "extra": "mean: 3.4063809864876875 msec\nrounds: 296"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 28.58820231048951,
            "unit": "iter/sec",
            "range": "stddev: 0.0015522141483909468",
            "extra": "mean: 34.97946422581047 msec\nrounds: 31"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 17.438883512161876,
            "unit": "iter/sec",
            "range": "stddev: 0.0014115283160268059",
            "extra": "mean: 57.34312057894074 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.507360935772048,
            "unit": "iter/sec",
            "range": "stddev: 0.0015129518406875712",
            "extra": "mean: 181.5751703333414 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 17.076061801521448,
            "unit": "iter/sec",
            "range": "stddev: 0.001441125901053323",
            "extra": "mean: 58.56151211111814 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 21.195436535892455,
            "unit": "iter/sec",
            "range": "stddev: 0.0019940990978355795",
            "extra": "mean: 47.17996717390535 msec\nrounds: 23"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 17.543135456169068,
            "unit": "iter/sec",
            "range": "stddev: 0.0006967264606195668",
            "extra": "mean: 57.00235300003619 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 17.043720266214656,
            "unit": "iter/sec",
            "range": "stddev: 0.001468672642002967",
            "extra": "mean: 58.67263627778937 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 28.59703741609501,
            "unit": "iter/sec",
            "range": "stddev: 0.0015074841767531142",
            "extra": "mean: 34.968657258082935 msec\nrounds: 31"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 17.4964139948416,
            "unit": "iter/sec",
            "range": "stddev: 0.0015044701940157843",
            "extra": "mean: 57.154568947375516 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 17.356895387034292,
            "unit": "iter/sec",
            "range": "stddev: 0.0017802038912995688",
            "extra": "mean: 57.61399015788309 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 21634.404098039486,
            "unit": "iter/sec",
            "range": "stddev: 0.000003665812067902627",
            "extra": "mean: 46.222673639095994 usec\nrounds: 22181"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 44.962775616577275,
            "unit": "iter/sec",
            "range": "stddev: 0.01656646137786681",
            "extra": "mean: 22.240619852465493 msec\nrounds: 61"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 173.15921674698487,
            "unit": "iter/sec",
            "range": "stddev: 0.000029285905411967478",
            "extra": "mean: 5.775031897153764 msec\nrounds: 175"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.185604435188688,
            "unit": "iter/sec",
            "range": "stddev: 0.0005970394312307579",
            "extra": "mean: 70.49400006667383 msec\nrounds: 15"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
            "value": 1.1251475919385423,
            "unit": "iter/sec",
            "range": "stddev: 0.012547371278479465",
            "extra": "mean: 888.7722883333709 msec\nrounds: 3"
          }
        ]
      }
    ]
  }
}