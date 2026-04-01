window.BENCHMARK_DATA = {
  "lastUpdate": 1775037303386,
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
          "id": "6a7bf00e38adfd7430e4625fd835b19a64c42344",
          "message": "feat: add multi-material and level-set base reference support (#212)\n\n* feat: add multi-material and level-set base reference support\n\nExpose set_multi_materials() and set_ls_base_references() on all three\nmesh classes. Both batch APIs automatically set the required count\nparameter (numberOfMat / numberOfLSBaseReferences) before applying\nentries.\n\nCloses #207 (priority 5: multi-material / level-set).\n\n* test: add empty material list tests for 2D and surface meshes",
          "timestamp": "2026-04-01T11:46:32+02:00",
          "tree_id": "4db6ef131a20bf069920073bef7867955b751bef",
          "url": "https://github.com/kmarchais/mmgpy/commit/6a7bf00e38adfd7430e4625fd835b19a64c42344"
        },
        "date": 1775037302652,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 1.1751230198293783,
            "unit": "iter/sec",
            "range": "stddev: 0.02071754030138169",
            "extra": "mean: 850.9747346666691 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.5966670683535422,
            "unit": "iter/sec",
            "range": "stddev: 0.014226636300436423",
            "extra": "mean: 1.6759765253333399 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.1965780433423694,
            "unit": "iter/sec",
            "range": "stddev: 0.0012278463776566359",
            "extra": "mean: 835.7164880000028 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.2535412823272298,
            "unit": "iter/sec",
            "range": "stddev: 0.0017538231672566084",
            "extra": "mean: 797.739982000015 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 1.1920910736790344,
            "unit": "iter/sec",
            "range": "stddev: 0.00770626063312972",
            "extra": "mean: 838.8620819999915 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.5942636654239405,
            "unit": "iter/sec",
            "range": "stddev: 0.022144398353567477",
            "extra": "mean: 1.682754740333337 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.263427149947422,
            "unit": "iter/sec",
            "range": "stddev: 0.0014215813570014864",
            "extra": "mean: 791.4979506666574 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.2666631880436328,
            "unit": "iter/sec",
            "range": "stddev: 0.002896417040418568",
            "extra": "mean: 789.47585233333 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 59.95473520270496,
            "unit": "iter/sec",
            "range": "stddev: 0.0005815135805734467",
            "extra": "mean: 16.679249714289178 msec\nrounds: 63"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.2559035315379452,
            "unit": "iter/sec",
            "range": "stddev: 0.0020508218592345416",
            "extra": "mean: 796.2394999999939 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 119.93484520704287,
            "unit": "iter/sec",
            "range": "stddev: 0.00005572003194944709",
            "extra": "mean: 8.337860429750048 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 16.164542814042026,
            "unit": "iter/sec",
            "range": "stddev: 0.000564393225951031",
            "extra": "mean: 61.86379729411877 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 1.1812369869470332,
            "unit": "iter/sec",
            "range": "stddev: 0.003919987743539185",
            "extra": "mean: 846.5701726666642 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 18.073229411513733,
            "unit": "iter/sec",
            "range": "stddev: 0.0013337460544035316",
            "extra": "mean: 55.330454631585646 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 367.0099291185762,
            "unit": "iter/sec",
            "range": "stddev: 0.00008926264036883088",
            "extra": "mean: 2.7247219234684867 msec\nrounds: 392"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 31.179547559082366,
            "unit": "iter/sec",
            "range": "stddev: 0.0001307000786930641",
            "extra": "mean: 32.072306312498355 msec\nrounds: 32"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 164.60269451171703,
            "unit": "iter/sec",
            "range": "stddev: 0.0004045672775416398",
            "extra": "mean: 6.07523469142734 msec\nrounds: 175"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 258.6288799369451,
            "unit": "iter/sec",
            "range": "stddev: 0.00017200582769647273",
            "extra": "mean: 3.866544216731729 msec\nrounds: 263"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 274.009812000626,
            "unit": "iter/sec",
            "range": "stddev: 0.00015131331078748066",
            "extra": "mean: 3.6495043469381865 msec\nrounds: 294"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 75.00098092629528,
            "unit": "iter/sec",
            "range": "stddev: 0.0002580760317070108",
            "extra": "mean: 13.333158948717173 msec\nrounds: 78"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 856.9873033225776,
            "unit": "iter/sec",
            "range": "stddev: 0.00012394580299797964",
            "extra": "mean: 1.1668784311307248 msec\nrounds: 893"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 34.93362140813849,
            "unit": "iter/sec",
            "range": "stddev: 0.00020174101166072574",
            "extra": "mean: 28.625718138888107 msec\nrounds: 36"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 1723.000816876708,
            "unit": "iter/sec",
            "range": "stddev: 0.00001712554744065142",
            "extra": "mean: 580.3827776545718 usec\nrounds: 1799"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 79.41069094877159,
            "unit": "iter/sec",
            "range": "stddev: 0.00012475538975015085",
            "extra": "mean: 12.592762864198061 msec\nrounds: 81"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 92591.76380454189,
            "unit": "iter/sec",
            "range": "stddev: 0.0000012155311530598531",
            "extra": "mean: 10.800096670703525 usec\nrounds: 94796"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
            "value": 27025.3550087263,
            "unit": "iter/sec",
            "range": "stddev: 0.000002183999712156756",
            "extra": "mean: 37.00228913467028 usec\nrounds: 27565"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
            "value": 5815.335173799932,
            "unit": "iter/sec",
            "range": "stddev: 0.000005606974682400938",
            "extra": "mean: 171.95913393012 usec\nrounds: 6481"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 36.700454698839906,
            "unit": "iter/sec",
            "range": "stddev: 0.00018491709634708395",
            "extra": "mean: 27.247618815785675 msec\nrounds: 38"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 36.535636244736594,
            "unit": "iter/sec",
            "range": "stddev: 0.0002101263145626472",
            "extra": "mean: 27.370537447368587 msec\nrounds: 38"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 36.10138187542084,
            "unit": "iter/sec",
            "range": "stddev: 0.0001778766632924087",
            "extra": "mean: 27.699770702706456 msec\nrounds: 37"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 3806.81224135372,
            "unit": "iter/sec",
            "range": "stddev: 0.000008184568238231091",
            "extra": "mean: 262.68697708201006 usec\nrounds: 3927"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 3318.6182424163844,
            "unit": "iter/sec",
            "range": "stddev: 0.000008056151061788213",
            "extra": "mean: 301.3302305214445 usec\nrounds: 3414"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 2357.743981748764,
            "unit": "iter/sec",
            "range": "stddev: 0.000009416487849048028",
            "extra": "mean: 424.1342604375091 usec\nrounds: 2419"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 136.5872724786846,
            "unit": "iter/sec",
            "range": "stddev: 0.00010775521505552788",
            "extra": "mean: 7.321326371430814 msec\nrounds: 140"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 136.4510949144641,
            "unit": "iter/sec",
            "range": "stddev: 0.00008457482522422383",
            "extra": "mean: 7.328633021426916 msec\nrounds: 140"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 130.73373580572826,
            "unit": "iter/sec",
            "range": "stddev: 0.0001740078827851183",
            "extra": "mean: 7.649135044117539 msec\nrounds: 136"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 36.62536857252162,
            "unit": "iter/sec",
            "range": "stddev: 0.0002365725684186193",
            "extra": "mean: 27.30347950000578 msec\nrounds: 38"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 35.97404032970169,
            "unit": "iter/sec",
            "range": "stddev: 0.00028348219019443897",
            "extra": "mean: 27.797822842110893 msec\nrounds: 38"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 8779.526455292153,
            "unit": "iter/sec",
            "range": "stddev: 0.0000050995726064589235",
            "extra": "mean: 113.9013596111686 usec\nrounds: 9057"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 994004.9486425725,
            "unit": "iter/sec",
            "range": "stddev: 1.0944241374077466e-7",
            "extra": "mean: 1.0060312087637133 usec\nrounds: 103221"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3405536.7991402606,
            "unit": "iter/sec",
            "range": "stddev: 4.327466999547202e-8",
            "extra": "mean: 293.63946390256405 nsec\nrounds: 195695"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1599441.6709372464,
            "unit": "iter/sec",
            "range": "stddev: 8.108575717654988e-8",
            "extra": "mean: 625.2181734229898 nsec\nrounds: 166639"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 151675.8365201058,
            "unit": "iter/sec",
            "range": "stddev: 9.921656425346636e-7",
            "extra": "mean: 6.593007976372309 usec\nrounds: 169751"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 1203.5779713768802,
            "unit": "iter/sec",
            "range": "stddev: 0.00002652221461751522",
            "extra": "mean: 830.8560174593515 usec\nrounds: 1260"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 119.51817517926538,
            "unit": "iter/sec",
            "range": "stddev: 0.00008665298514327888",
            "extra": "mean: 8.366928280992404 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 18.10701979843127,
            "unit": "iter/sec",
            "range": "stddev: 0.001442564406723727",
            "extra": "mean: 55.22719978947814 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 118.1585353575845,
            "unit": "iter/sec",
            "range": "stddev: 0.00008201722085090845",
            "extra": "mean: 8.463205785123256 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 108.02652456568636,
            "unit": "iter/sec",
            "range": "stddev: 0.000049208754971697837",
            "extra": "mean: 9.256985763639396 msec\nrounds: 110"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 118.70305140991162,
            "unit": "iter/sec",
            "range": "stddev: 0.000054201089594804935",
            "extra": "mean: 8.424383266667235 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 161.288574706026,
            "unit": "iter/sec",
            "range": "stddev: 0.00003934300394704188",
            "extra": "mean: 6.200067189028476 msec\nrounds: 164"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 1241.5744814224622,
            "unit": "iter/sec",
            "range": "stddev: 0.000017590109471656508",
            "extra": "mean: 805.428925097033 usec\nrounds: 1295"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 118.36728942999771,
            "unit": "iter/sec",
            "range": "stddev: 0.00044615762874725004",
            "extra": "mean: 8.44827996666595 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 119.39543001109492,
            "unit": "iter/sec",
            "range": "stddev: 0.000047661973481811895",
            "extra": "mean: 8.375529950409947 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 28224.22531223123,
            "unit": "iter/sec",
            "range": "stddev: 0.000002454456492168966",
            "extra": "mean: 35.4305561600885 usec\nrounds: 29229"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 48.93607059814888,
            "unit": "iter/sec",
            "range": "stddev: 0.01519079455362409",
            "extra": "mean: 20.43482420588602 msec\nrounds: 68"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 3.4082321982108197,
            "unit": "iter/sec",
            "range": "stddev: 0.0010389292825125705",
            "extra": "mean: 293.40723925000134 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.2669141570521991,
            "unit": "iter/sec",
            "range": "stddev: 0.0028149277168974963",
            "extra": "mean: 789.3194613333208 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.13828393826579646,
            "unit": "iter/sec",
            "range": "stddev: 0.009423067059860962",
            "extra": "mean: 7.231497833666651 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.26797598619333,
            "unit": "iter/sec",
            "range": "stddev: 0.0014189918232574874",
            "extra": "mean: 788.6584690000026 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 3.129681801034069,
            "unit": "iter/sec",
            "range": "stddev: 0.0013013065879995817",
            "extra": "mean: 319.5213007499973 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 1.0280975940174368,
            "unit": "iter/sec",
            "range": "stddev: 0.0015032405228224592",
            "extra": "mean: 972.6703046666595 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 2.417600415333488,
            "unit": "iter/sec",
            "range": "stddev: 0.0003844577586016972",
            "extra": "mean: 413.6332843333245 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 3.3029155645727366,
            "unit": "iter/sec",
            "range": "stddev: 0.0006137041152071892",
            "extra": "mean: 302.76281075001066 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.265420882332516,
            "unit": "iter/sec",
            "range": "stddev: 0.0006383145117836436",
            "extra": "mean: 790.2509069999913 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.2663967997318852,
            "unit": "iter/sec",
            "range": "stddev: 0.0020164290639777915",
            "extra": "mean: 789.6419196666594 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 11338.392168652988,
            "unit": "iter/sec",
            "range": "stddev: 0.00000355772735102667",
            "extra": "mean: 88.19592629408945 usec\nrounds: 11573"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 288.98113602210685,
            "unit": "iter/sec",
            "range": "stddev: 0.000024332816105490627",
            "extra": "mean: 3.4604334863002983 msec\nrounds: 292"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 28.191163901838376,
            "unit": "iter/sec",
            "range": "stddev: 0.0014526605773582148",
            "extra": "mean: 35.47210762499908 msec\nrounds: 32"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 17.409837262571575,
            "unit": "iter/sec",
            "range": "stddev: 0.0013517801727256215",
            "extra": "mean: 57.438790777777314 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.578881395897151,
            "unit": "iter/sec",
            "range": "stddev: 0.002053561675111518",
            "extra": "mean: 179.24740266667527 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 17.766237262259107,
            "unit": "iter/sec",
            "range": "stddev: 0.0014567585127369016",
            "extra": "mean: 56.28653863158206 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 21.66404861662769,
            "unit": "iter/sec",
            "range": "stddev: 0.001876990208825471",
            "extra": "mean: 46.15942373912859 msec\nrounds: 23"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 18.213677424365198,
            "unit": "iter/sec",
            "range": "stddev: 0.0014479407059259386",
            "extra": "mean: 54.90379436841558 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 17.534291802937233,
            "unit": "iter/sec",
            "range": "stddev: 0.0020188504374641487",
            "extra": "mean: 57.031102894756565 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 29.201512868469095,
            "unit": "iter/sec",
            "range": "stddev: 0.001774152091930871",
            "extra": "mean: 34.24480110000635 msec\nrounds: 30"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 17.735882081273683,
            "unit": "iter/sec",
            "range": "stddev: 0.001428638901764044",
            "extra": "mean: 56.38287373684354 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 17.68387849264089,
            "unit": "iter/sec",
            "range": "stddev: 0.0013859672823476447",
            "extra": "mean: 56.54868078946301 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 21513.38429294635,
            "unit": "iter/sec",
            "range": "stddev: 0.0000027982228732190597",
            "extra": "mean: 46.48269125782654 usec\nrounds: 21986"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 46.26684833867332,
            "unit": "iter/sec",
            "range": "stddev: 0.015833879182710398",
            "extra": "mean: 21.61374798386958 msec\nrounds: 62"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 172.30858037769136,
            "unit": "iter/sec",
            "range": "stddev: 0.000027519561660092298",
            "extra": "mean: 5.803541517248024 msec\nrounds: 174"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.347964679559912,
            "unit": "iter/sec",
            "range": "stddev: 0.00008617516205697566",
            "extra": "mean: 69.69629646667576 msec\nrounds: 15"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
            "value": 1.1757677336497367,
            "unit": "iter/sec",
            "range": "stddev: 0.0029918225408342627",
            "extra": "mean: 850.5081159999767 msec\nrounds: 3"
          }
        ]
      }
    ]
  }
}