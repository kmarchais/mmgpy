window.BENCHMARK_DATA = {
  "lastUpdate": 1773935603709,
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
          "id": "1c59cee666b9303d3f10531761e479475146b099",
          "message": "fix: skip conda/pixi code blocks in pytest-codeblocks (#199)\n\n* fix: skip conda/pixi code blocks in pytest-codeblocks\n\n* docs: add ELAS/Lagrangian motion to PyPI vs conda-forge comparison",
          "timestamp": "2026-03-19T16:44:20+01:00",
          "tree_id": "8aed5dbf2c1efaf0faa6381ae94615897b93e267",
          "url": "https://github.com/kmarchais/mmgpy/commit/1c59cee666b9303d3f10531761e479475146b099"
        },
        "date": 1773935603052,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 1.1563143276811858,
            "unit": "iter/sec",
            "range": "stddev: 0.0071649469064434465",
            "extra": "mean: 864.8167510000064 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.5608729228294932,
            "unit": "iter/sec",
            "range": "stddev: 0.01503810287518913",
            "extra": "mean: 1.782935063000006 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.20289450049748,
            "unit": "iter/sec",
            "range": "stddev: 0.0030173506925887162",
            "extra": "mean: 831.3281003333467 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.2601920362285304,
            "unit": "iter/sec",
            "range": "stddev: 0.0056203358025919215",
            "extra": "mean: 793.5298519999966 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 1.1631099664011948,
            "unit": "iter/sec",
            "range": "stddev: 0.020173141760697504",
            "extra": "mean: 859.7639336666703 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.5610558829040855,
            "unit": "iter/sec",
            "range": "stddev: 0.0010527705317466562",
            "extra": "mean: 1.7823536486666758 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.249086960629379,
            "unit": "iter/sec",
            "range": "stddev: 0.0036991925290846247",
            "extra": "mean: 800.584772333328 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.2580146087416302,
            "unit": "iter/sec",
            "range": "stddev: 0.004572878107327091",
            "extra": "mean: 794.9033286666539 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 28.20065621376031,
            "unit": "iter/sec",
            "range": "stddev: 0.0011427657499005648",
            "extra": "mean: 35.46016774999927 msec\nrounds: 32"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.0554785835484517,
            "unit": "iter/sec",
            "range": "stddev: 0.009017514058696571",
            "extra": "mean: 947.4375090000061 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 117.17430404499868,
            "unit": "iter/sec",
            "range": "stddev: 0.00011689126341713742",
            "extra": "mean: 8.534294341666993 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 12.097036456097614,
            "unit": "iter/sec",
            "range": "stddev: 0.0013050852301690844",
            "extra": "mean: 82.66487446154149 msec\nrounds: 13"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 0.9689457336593301,
            "unit": "iter/sec",
            "range": "stddev: 0.0009410237706037186",
            "extra": "mean: 1.0320495413333315 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 16.907375865356997,
            "unit": "iter/sec",
            "range": "stddev: 0.00179309163643383",
            "extra": "mean: 59.145783944449214 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 380.0535402136218,
            "unit": "iter/sec",
            "range": "stddev: 0.0002077050216939809",
            "extra": "mean: 2.6312082224991684 msec\nrounds: 400"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 28.753826975530913,
            "unit": "iter/sec",
            "range": "stddev: 0.0019105553905492093",
            "extra": "mean: 34.77797932257801 msec\nrounds: 31"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 150.34416526099997,
            "unit": "iter/sec",
            "range": "stddev: 0.0001213923189964803",
            "extra": "mean: 6.651405448718169 msec\nrounds: 156"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 247.67761828621366,
            "unit": "iter/sec",
            "range": "stddev: 0.0001264030062256264",
            "extra": "mean: 4.037506525294549 msec\nrounds: 257"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 272.0341150796749,
            "unit": "iter/sec",
            "range": "stddev: 0.00028317964880105037",
            "extra": "mean: 3.67600953177183 msec\nrounds: 299"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 70.92067330057448,
            "unit": "iter/sec",
            "range": "stddev: 0.00025591856712477515",
            "extra": "mean: 14.100260945941972 msec\nrounds: 74"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 878.0712073742269,
            "unit": "iter/sec",
            "range": "stddev: 0.00002465789057144458",
            "extra": "mean: 1.1388598004373556 msec\nrounds: 912"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 33.9306058713556,
            "unit": "iter/sec",
            "range": "stddev: 0.0004014272247970508",
            "extra": "mean: 29.471916999991013 msec\nrounds: 35"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 1725.0844943110903,
            "unit": "iter/sec",
            "range": "stddev: 0.00001783540326432278",
            "extra": "mean: 579.6817508346734 usec\nrounds: 1798"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 77.01993096743315,
            "unit": "iter/sec",
            "range": "stddev: 0.0004996306766691395",
            "extra": "mean: 12.983652249997947 msec\nrounds: 84"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 92760.28779834195,
            "unit": "iter/sec",
            "range": "stddev: 0.0000010562529853835613",
            "extra": "mean: 10.780475392378792 usec\nrounds: 94787"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
            "value": 27074.059887864354,
            "unit": "iter/sec",
            "range": "stddev: 0.000002118835011848825",
            "extra": "mean: 36.935723867857696 usec\nrounds: 27581"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
            "value": 6382.378469656798,
            "unit": "iter/sec",
            "range": "stddev: 0.000005071008246559463",
            "extra": "mean: 156.6814009470318 usec\nrounds: 6547"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 34.7770586203757,
            "unit": "iter/sec",
            "range": "stddev: 0.0005955118241999272",
            "extra": "mean: 28.75458821621289 msec\nrounds: 37"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 34.45589374888246,
            "unit": "iter/sec",
            "range": "stddev: 0.0020944796834576665",
            "extra": "mean: 29.022610972975674 msec\nrounds: 37"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 34.96788533345626,
            "unit": "iter/sec",
            "range": "stddev: 0.00036588142706980853",
            "extra": "mean: 28.597668702694726 msec\nrounds: 37"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 4072.7319820010584,
            "unit": "iter/sec",
            "range": "stddev: 0.000007101473131083761",
            "extra": "mean: 245.53543037434773 usec\nrounds: 4201"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 3480.6985263964325,
            "unit": "iter/sec",
            "range": "stddev: 0.000013227345915805855",
            "extra": "mean: 287.2986535364498 usec\nrounds: 3605"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 2417.696022643881,
            "unit": "iter/sec",
            "range": "stddev: 0.00002358292279853697",
            "extra": "mean: 413.61692728701524 usec\nrounds: 2503"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 122.19125528152757,
            "unit": "iter/sec",
            "range": "stddev: 0.0006001252144148058",
            "extra": "mean: 8.183891700727756 msec\nrounds: 137"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 120.42207917658646,
            "unit": "iter/sec",
            "range": "stddev: 0.0005347548488446377",
            "extra": "mean: 8.304125014596401 msec\nrounds: 137"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 128.26520838803242,
            "unit": "iter/sec",
            "range": "stddev: 0.000505835217320846",
            "extra": "mean: 7.796346433826115 msec\nrounds: 136"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 36.000366448707226,
            "unit": "iter/sec",
            "range": "stddev: 0.00027364186945696213",
            "extra": "mean: 27.777495027023818 msec\nrounds: 37"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 35.453335816351704,
            "unit": "iter/sec",
            "range": "stddev: 0.0002989451909922955",
            "extra": "mean: 28.20609054053476 msec\nrounds: 37"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 9868.471084327308,
            "unit": "iter/sec",
            "range": "stddev: 0.000004350179452581095",
            "extra": "mean: 101.3328195882499 usec\nrounds: 10149"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 981780.7227724914,
            "unit": "iter/sec",
            "range": "stddev: 1.198457390312975e-7",
            "extra": "mean: 1.018557379264953 usec\nrounds: 101338"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3222669.0897976244,
            "unit": "iter/sec",
            "range": "stddev: 9.212862624842969e-8",
            "extra": "mean: 310.3017939898997 nsec\nrounds: 198808"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1559911.3932491457,
            "unit": "iter/sec",
            "range": "stddev: 7.857862619199428e-8",
            "extra": "mean: 641.0620528369217 nsec\nrounds: 162049"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 154675.2065980154,
            "unit": "iter/sec",
            "range": "stddev: 8.547635414697254e-7",
            "extra": "mean: 6.465160267080781 usec\nrounds: 174490"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 1193.9703719275626,
            "unit": "iter/sec",
            "range": "stddev: 0.000028185819847771007",
            "extra": "mean: 837.5417208934472 usec\nrounds: 1254"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 115.32431202328746,
            "unit": "iter/sec",
            "range": "stddev: 0.0001334950096536368",
            "extra": "mean: 8.67119848760138 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 18.288230851882908,
            "unit": "iter/sec",
            "range": "stddev: 0.00017639695069777557",
            "extra": "mean: 54.67997468421297 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 115.95566133805988,
            "unit": "iter/sec",
            "range": "stddev: 0.0005556102813085598",
            "extra": "mean: 8.623985999998537 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 107.46841060601479,
            "unit": "iter/sec",
            "range": "stddev: 0.00011720819141719387",
            "extra": "mean: 9.305059918174988 msec\nrounds: 110"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 117.13019226865828,
            "unit": "iter/sec",
            "range": "stddev: 0.00008348684458875002",
            "extra": "mean: 8.53750839669355 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 159.20061318319074,
            "unit": "iter/sec",
            "range": "stddev: 0.00008784997447249864",
            "extra": "mean: 6.281382841467506 msec\nrounds: 164"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 1250.3575046677097,
            "unit": "iter/sec",
            "range": "stddev: 0.00003219017973385749",
            "extra": "mean: 799.7712624324644 usec\nrounds: 1307"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 115.83344150914766,
            "unit": "iter/sec",
            "range": "stddev: 0.00012497738332365035",
            "extra": "mean: 8.633085462811078 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 116.66449852183368,
            "unit": "iter/sec",
            "range": "stddev: 0.0001475296938895472",
            "extra": "mean: 8.571587866662375 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 28066.640215193478,
            "unit": "iter/sec",
            "range": "stddev: 0.0000027489242142624947",
            "extra": "mean: 35.629487260775306 usec\nrounds: 29280"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 47.62541933826566,
            "unit": "iter/sec",
            "range": "stddev: 0.017232308793395226",
            "extra": "mean: 20.997190447760083 msec\nrounds: 67"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 3.2773837524498677,
            "unit": "iter/sec",
            "range": "stddev: 0.00139626835319648",
            "extra": "mean: 305.1214247499985 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.256137407293264,
            "unit": "iter/sec",
            "range": "stddev: 0.0026915421073385685",
            "extra": "mean: 796.0912510000071 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.12333066102375512,
            "unit": "iter/sec",
            "range": "stddev: 0.09984691891421792",
            "extra": "mean: 8.108283793333328 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.185418557980552,
            "unit": "iter/sec",
            "range": "stddev: 0.012326103254573286",
            "extra": "mean: 843.5838913333479 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 2.9889201656026163,
            "unit": "iter/sec",
            "range": "stddev: 0.005059244715571132",
            "extra": "mean: 334.56898966666887 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 0.923696757707076,
            "unit": "iter/sec",
            "range": "stddev: 0.013797365279082869",
            "extra": "mean: 1.0826063766666607 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 2.304286522581121,
            "unit": "iter/sec",
            "range": "stddev: 0.005961251281817094",
            "extra": "mean: 433.97380933333807 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 3.1573520569867863,
            "unit": "iter/sec",
            "range": "stddev: 0.002401973887362436",
            "extra": "mean: 316.7210947499939 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.167772144784899,
            "unit": "iter/sec",
            "range": "stddev: 0.006661910561017106",
            "extra": "mean: 856.3314380000028 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.2327615813472153,
            "unit": "iter/sec",
            "range": "stddev: 0.007280941538727663",
            "extra": "mean: 811.1868630000268 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 11430.80695070956,
            "unit": "iter/sec",
            "range": "stddev: 0.0000037971354333009293",
            "extra": "mean: 87.48288763094942 usec\nrounds: 11560"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 286.7179471663925,
            "unit": "iter/sec",
            "range": "stddev: 0.00004013359882888013",
            "extra": "mean: 3.4877481855702075 msec\nrounds: 291"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 25.50214889768502,
            "unit": "iter/sec",
            "range": "stddev: 0.0021829268886315485",
            "extra": "mean: 39.21238182758692 msec\nrounds: 29"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 16.79559451779201,
            "unit": "iter/sec",
            "range": "stddev: 0.0018212770839091934",
            "extra": "mean: 59.5394226111302 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.479882943744636,
            "unit": "iter/sec",
            "range": "stddev: 0.0019366170386895577",
            "extra": "mean: 182.4856498333626 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 16.572544419782034,
            "unit": "iter/sec",
            "range": "stddev: 0.0018579481829866151",
            "extra": "mean: 60.340764500008646 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 20.904163626691123,
            "unit": "iter/sec",
            "range": "stddev: 0.002276028553886162",
            "extra": "mean: 47.837359956519244 msec\nrounds: 23"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 16.719330281367697,
            "unit": "iter/sec",
            "range": "stddev: 0.0019838610332800133",
            "extra": "mean: 59.81100816666185 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 16.549042508255994,
            "unit": "iter/sec",
            "range": "stddev: 0.001724675089792351",
            "extra": "mean: 60.42645666666936 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 26.806640467031624,
            "unit": "iter/sec",
            "range": "stddev: 0.0017442762900781535",
            "extra": "mean: 37.30418965516617 msec\nrounds: 29"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 16.81476532791977,
            "unit": "iter/sec",
            "range": "stddev: 0.0020513193339868115",
            "extra": "mean: 59.47154066667634 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 16.83926122026191,
            "unit": "iter/sec",
            "range": "stddev: 0.0017497063414121685",
            "extra": "mean: 59.38502805555067 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 21779.348014839252,
            "unit": "iter/sec",
            "range": "stddev: 0.0000026617744237099764",
            "extra": "mean: 45.91505674635691 usec\nrounds: 22310"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 44.61257857915895,
            "unit": "iter/sec",
            "range": "stddev: 0.017251812626628314",
            "extra": "mean: 22.415202883322156 msec\nrounds: 60"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 172.30991627873223,
            "unit": "iter/sec",
            "range": "stddev: 0.00004626600412931797",
            "extra": "mean: 5.80349652298814 msec\nrounds: 174"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.192035511227,
            "unit": "iter/sec",
            "range": "stddev: 0.0008562868736439819",
            "extra": "mean: 70.46205593333828 msec\nrounds: 15"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
            "value": 1.0974152509091866,
            "unit": "iter/sec",
            "range": "stddev: 0.0016497500344463756",
            "extra": "mean: 911.2320966667085 msec\nrounds: 3"
          }
        ]
      }
    ]
  }
}