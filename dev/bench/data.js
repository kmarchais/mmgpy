window.BENCHMARK_DATA = {
  "lastUpdate": 1775050650118,
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
          "id": "8e7273f4074b88f133a1dda8d9a3c693858e161d",
          "message": "chore: update uv.lock for v0.10.0.dev0 (#216)",
          "timestamp": "2026-04-01T15:28:44+02:00",
          "tree_id": "919f1b19f8b53f32893e89bcc71e76f7f04f7be3",
          "url": "https://github.com/kmarchais/mmgpy/commit/8e7273f4074b88f133a1dda8d9a3c693858e161d"
        },
        "date": 1775050649635,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 1.1027909045868804,
            "unit": "iter/sec",
            "range": "stddev: 0.02457600414060033",
            "extra": "mean: 906.7902136666722 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.5410417343074054,
            "unit": "iter/sec",
            "range": "stddev: 0.00774097254286944",
            "extra": "mean: 1.8482862533333275 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.0709019966779199,
            "unit": "iter/sec",
            "range": "stddev: 0.0015586271828458538",
            "extra": "mean: 933.7922640000045 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.154141984407393,
            "unit": "iter/sec",
            "range": "stddev: 0.003889680274552048",
            "extra": "mean: 866.4445220000042 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 1.1163652656276966,
            "unit": "iter/sec",
            "range": "stddev: 0.007420673620857831",
            "extra": "mean: 895.7641650000028 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.5561670728905059,
            "unit": "iter/sec",
            "range": "stddev: 0.024375811229816753",
            "extra": "mean: 1.7980208623333453 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.1661857799829276,
            "unit": "iter/sec",
            "range": "stddev: 0.0028122133440328123",
            "extra": "mean: 857.4963073333303 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.1561322938459997,
            "unit": "iter/sec",
            "range": "stddev: 0.007276999551684049",
            "extra": "mean: 864.9529170000013 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 54.95437178305776,
            "unit": "iter/sec",
            "range": "stddev: 0.0005281097248156442",
            "extra": "mean: 18.196914413791852 msec\nrounds: 58"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.1152007712490728,
            "unit": "iter/sec",
            "range": "stddev: 0.005725256481626084",
            "extra": "mean: 896.699523333325 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 111.35703767630217,
            "unit": "iter/sec",
            "range": "stddev: 0.00008740952095845245",
            "extra": "mean: 8.98012394067851 msec\nrounds: 118"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 14.211679089129397,
            "unit": "iter/sec",
            "range": "stddev: 0.0021860803893468087",
            "extra": "mean: 70.3646623124854 msec\nrounds: 16"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 1.0326442800502575,
            "unit": "iter/sec",
            "range": "stddev: 0.015770365745276637",
            "extra": "mean: 968.3876813333351 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 16.732940996497682,
            "unit": "iter/sec",
            "range": "stddev: 0.0011222602550918902",
            "extra": "mean: 59.76235738889576 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 353.18507727815927,
            "unit": "iter/sec",
            "range": "stddev: 0.0003946875681573498",
            "extra": "mean: 2.831376703983522 msec\nrounds: 402"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 30.063897507122707,
            "unit": "iter/sec",
            "range": "stddev: 0.0003911607770560642",
            "extra": "mean: 33.26248699999995 msec\nrounds: 31"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 164.86867267179676,
            "unit": "iter/sec",
            "range": "stddev: 0.00019102475495381307",
            "extra": "mean: 6.065433679997503 msec\nrounds: 175"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 243.7604994365437,
            "unit": "iter/sec",
            "range": "stddev: 0.00009402716197616084",
            "extra": "mean: 4.10238739382105 msec\nrounds: 259"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 270.66700149304114,
            "unit": "iter/sec",
            "range": "stddev: 0.0002973496862787279",
            "extra": "mean: 3.694576710436976 msec\nrounds: 297"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 71.4705051607854,
            "unit": "iter/sec",
            "range": "stddev: 0.00016366541889437745",
            "extra": "mean: 13.9917858108086 msec\nrounds: 74"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 829.3999987662907,
            "unit": "iter/sec",
            "range": "stddev: 0.00012911603539312864",
            "extra": "mean: 1.2056908626567062 msec\nrounds: 881"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 33.47950763770168,
            "unit": "iter/sec",
            "range": "stddev: 0.0005060885720600126",
            "extra": "mean: 29.86901751428052 msec\nrounds: 35"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 1683.3549770829445,
            "unit": "iter/sec",
            "range": "stddev: 0.00004865318229642683",
            "extra": "mean: 594.0517678171968 usec\nrounds: 1796"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 73.51611385664866,
            "unit": "iter/sec",
            "range": "stddev: 0.00019372805112470755",
            "extra": "mean: 13.602460025973773 msec\nrounds: 77"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 92615.31828996738,
            "unit": "iter/sec",
            "range": "stddev: 0.0000012925946012475453",
            "extra": "mean: 10.79734992508605 usec\nrounds: 94706"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
            "value": 27053.00228036296,
            "unit": "iter/sec",
            "range": "stddev: 0.0000028083618240982165",
            "extra": "mean: 36.964474021645756 usec\nrounds: 27619"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
            "value": 6278.412814377405,
            "unit": "iter/sec",
            "range": "stddev: 0.000012292323460280248",
            "extra": "mean: 159.27592363949464 usec\nrounds: 6561"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 34.15062448481402,
            "unit": "iter/sec",
            "range": "stddev: 0.0003602748484626579",
            "extra": "mean: 29.282041399994796 msec\nrounds: 35"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 34.1222339885838,
            "unit": "iter/sec",
            "range": "stddev: 0.00023950571171070048",
            "extra": "mean: 29.306404742859673 msec\nrounds: 35"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 33.414857853339434,
            "unit": "iter/sec",
            "range": "stddev: 0.0008999359931225199",
            "extra": "mean: 29.92680694286004 msec\nrounds: 35"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 3084.1156309260205,
            "unit": "iter/sec",
            "range": "stddev: 0.00002659165387780035",
            "extra": "mean: 324.24205823299343 usec\nrounds: 3984"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 2716.7984876046426,
            "unit": "iter/sec",
            "range": "stddev: 0.000014100419646635067",
            "extra": "mean: 368.0802991324115 usec\nrounds: 3460"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 2008.9787179825846,
            "unit": "iter/sec",
            "range": "stddev: 0.000021067502436865445",
            "extra": "mean: 497.76535263857824 usec\nrounds: 2141"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 126.31323335315513,
            "unit": "iter/sec",
            "range": "stddev: 0.0001614993251742329",
            "extra": "mean: 7.916826871212552 msec\nrounds: 132"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 119.91371087451529,
            "unit": "iter/sec",
            "range": "stddev: 0.0002446364562939764",
            "extra": "mean: 8.33932994573455 msec\nrounds: 129"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 123.01297461924014,
            "unit": "iter/sec",
            "range": "stddev: 0.00015149986270776436",
            "extra": "mean: 8.129223792004723 msec\nrounds: 125"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 34.423038012905806,
            "unit": "iter/sec",
            "range": "stddev: 0.00022266522187506624",
            "extra": "mean: 29.050312166668217 msec\nrounds: 36"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 33.95486517531319,
            "unit": "iter/sec",
            "range": "stddev: 0.0003387111831943062",
            "extra": "mean: 29.450860571434337 msec\nrounds: 35"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 7014.239230722349,
            "unit": "iter/sec",
            "range": "stddev: 0.000005894752075079271",
            "extra": "mean: 142.56713623624393 usec\nrounds: 9278"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 996998.9316434729,
            "unit": "iter/sec",
            "range": "stddev: 1.0829177976930217e-7",
            "extra": "mean: 1.0030101018780233 usec\nrounds: 102575"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3367571.801959658,
            "unit": "iter/sec",
            "range": "stddev: 4.9549514466943013e-8",
            "extra": "mean: 296.94986738458846 nsec\nrounds: 193837"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1602609.3241379708,
            "unit": "iter/sec",
            "range": "stddev: 8.421189863589896e-8",
            "extra": "mean: 623.9823923013122 nsec\nrounds: 166058"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 148089.40909294985,
            "unit": "iter/sec",
            "range": "stddev: 0.0000024122241875726033",
            "extra": "mean: 6.75267735974515 usec\nrounds: 170329"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 1029.899814945957,
            "unit": "iter/sec",
            "range": "stddev: 0.0000509262385454737",
            "extra": "mean: 970.9682296160761 usec\nrounds: 1067"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 117.3647007552977,
            "unit": "iter/sec",
            "range": "stddev: 0.00007287736096564172",
            "extra": "mean: 8.52044945000093 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 18.28738166372333,
            "unit": "iter/sec",
            "range": "stddev: 0.00016651703223389825",
            "extra": "mean: 54.6825137894781 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 117.9907533950113,
            "unit": "iter/sec",
            "range": "stddev: 0.00004911240721729981",
            "extra": "mean: 8.475240400001383 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 107.74897226086992,
            "unit": "iter/sec",
            "range": "stddev: 0.00006514937880645345",
            "extra": "mean: 9.280830981653454 msec\nrounds: 109"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 117.68374788566304,
            "unit": "iter/sec",
            "range": "stddev: 0.00006829901023160883",
            "extra": "mean: 8.497350041668977 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 157.9289033860485,
            "unit": "iter/sec",
            "range": "stddev: 0.00011271032125786755",
            "extra": "mean: 6.331963171779615 msec\nrounds: 163"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 1210.6462020278861,
            "unit": "iter/sec",
            "range": "stddev: 0.000019006049495724038",
            "extra": "mean: 826.0051518973551 usec\nrounds: 1264"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 119.47858208614545,
            "unit": "iter/sec",
            "range": "stddev: 0.0000685524391241354",
            "extra": "mean: 8.369700933335386 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 119.37788058517161,
            "unit": "iter/sec",
            "range": "stddev: 0.00006556204511407663",
            "extra": "mean: 8.3767612148763 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 27873.967294116657,
            "unit": "iter/sec",
            "range": "stddev: 0.0000032038759163448977",
            "extra": "mean: 35.87576857819839 usec\nrounds: 28999"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 49.84580486692895,
            "unit": "iter/sec",
            "range": "stddev: 0.014663032540781568",
            "extra": "mean: 20.06186885074188 msec\nrounds: 67"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 3.353946939977478,
            "unit": "iter/sec",
            "range": "stddev: 0.0020707601388121537",
            "extra": "mean: 298.1561777500019 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.2283979127919262,
            "unit": "iter/sec",
            "range": "stddev: 0.00331414534372786",
            "extra": "mean: 814.0684623333337 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.13203520669405336,
            "unit": "iter/sec",
            "range": "stddev: 0.25833847065755106",
            "extra": "mean: 7.5737375283333295 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.2250606466783445,
            "unit": "iter/sec",
            "range": "stddev: 0.0068963408866349225",
            "extra": "mean: 816.2861183333424 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 3.118092161573207,
            "unit": "iter/sec",
            "range": "stddev: 0.0015879371337507026",
            "extra": "mean: 320.70892974999765 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 0.9788823271618481,
            "unit": "iter/sec",
            "range": "stddev: 0.010884692062892066",
            "extra": "mean: 1.0215732496666685 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 2.381633412807202,
            "unit": "iter/sec",
            "range": "stddev: 0.005462036605416146",
            "extra": "mean: 419.87990033332306 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 3.2833856203327634,
            "unit": "iter/sec",
            "range": "stddev: 0.0022833452050510855",
            "extra": "mean: 304.5636777499965 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.2272756565565683,
            "unit": "iter/sec",
            "range": "stddev: 0.005619390499128529",
            "extra": "mean: 814.8128700000067 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.2294029447136512,
            "unit": "iter/sec",
            "range": "stddev: 0.004448482677153088",
            "extra": "mean: 813.4029646666553 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 11407.86016046163,
            "unit": "iter/sec",
            "range": "stddev: 0.0000036916029433470295",
            "extra": "mean: 87.65885853561637 usec\nrounds: 11593"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 289.9097806207149,
            "unit": "iter/sec",
            "range": "stddev: 0.00003093482909154201",
            "extra": "mean: 3.4493489590414566 msec\nrounds: 293"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 30.31139559635759,
            "unit": "iter/sec",
            "range": "stddev: 0.0010723906179417127",
            "extra": "mean: 32.9908927096767 msec\nrounds: 31"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 17.976920527382326,
            "unit": "iter/sec",
            "range": "stddev: 0.0014034240585827076",
            "extra": "mean: 55.62687994736399 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.594943741917565,
            "unit": "iter/sec",
            "range": "stddev: 0.0011072409549281114",
            "extra": "mean: 178.7328069999982 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 18.143887508176046,
            "unit": "iter/sec",
            "range": "stddev: 0.0013887086622699379",
            "extra": "mean: 55.11498015788387 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 21.826312774483938,
            "unit": "iter/sec",
            "range": "stddev: 0.002339150642640541",
            "extra": "mean: 45.81625904165776 msec\nrounds: 24"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 18.303937375288385,
            "unit": "iter/sec",
            "range": "stddev: 0.0020490261005280705",
            "extra": "mean: 54.63305405262537 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 18.003865784372096,
            "unit": "iter/sec",
            "range": "stddev: 0.000898507656058252",
            "extra": "mean: 55.54362668422192 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 30.479313556429023,
            "unit": "iter/sec",
            "range": "stddev: 0.0009548299921423861",
            "extra": "mean: 32.80913784848246 msec\nrounds: 33"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 18.247540251496496,
            "unit": "iter/sec",
            "range": "stddev: 0.0010236567178132882",
            "extra": "mean: 54.801906789491206 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 17.77563600282389,
            "unit": "iter/sec",
            "range": "stddev: 0.001482042934886713",
            "extra": "mean: 56.25677752633644 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 21532.842477635804,
            "unit": "iter/sec",
            "range": "stddev: 0.0000028525864699218293",
            "extra": "mean: 46.44068710569023 usec\nrounds: 22049"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 46.58671527728999,
            "unit": "iter/sec",
            "range": "stddev: 0.014765761223937994",
            "extra": "mean: 21.46534680644201 msec\nrounds: 62"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 172.15399937867835,
            "unit": "iter/sec",
            "range": "stddev: 0.00003100667460867838",
            "extra": "mean: 5.808752649424955 msec\nrounds: 174"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.333219763266628,
            "unit": "iter/sec",
            "range": "stddev: 0.0001462944549931295",
            "extra": "mean: 69.76799466668429 msec\nrounds: 15"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
            "value": 1.1696166867397788,
            "unit": "iter/sec",
            "range": "stddev: 0.007441327721908065",
            "extra": "mean: 854.9809619999754 msec\nrounds: 3"
          }
        ]
      }
    ]
  }
}