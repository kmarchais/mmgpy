window.BENCHMARK_DATA = {
  "lastUpdate": 1767829544054,
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
          "id": "16e96a93dcbdaf66b2863c0ec4842ca5e79bcefc",
          "message": "chore: remove unused NPY002 ignore from benchmarks (#105)",
          "timestamp": "2026-01-08T00:38:47+01:00",
          "tree_id": "9983c8733cda92fb28c22487e4a48e88bcababa6",
          "url": "https://github.com/kmarchais/mmgpy/commit/16e96a93dcbdaf66b2863c0ec4842ca5e79bcefc"
        },
        "date": 1767829543041,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 0.6407742803090333,
            "unit": "iter/sec",
            "range": "stddev: 0.011439036806120323",
            "extra": "mean: 1.560611951399983 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.6378304885604958,
            "unit": "iter/sec",
            "range": "stddev: 0.022155596258745927",
            "extra": "mean: 1.5678146748000017 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.200201165909381,
            "unit": "iter/sec",
            "range": "stddev: 0.0030675769007285927",
            "extra": "mean: 833.193658200048 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.2506046720487263,
            "unit": "iter/sec",
            "range": "stddev: 0.002691300057762474",
            "extra": "mean: 799.6131969999851 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 0.6414834200424551,
            "unit": "iter/sec",
            "range": "stddev: 0.01187266482634025",
            "extra": "mean: 1.5588867440000513 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.6430819117628861,
            "unit": "iter/sec",
            "range": "stddev: 0.009687975976195135",
            "extra": "mean: 1.555011860400009 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.255002232135647,
            "unit": "iter/sec",
            "range": "stddev: 0.0021718571332708077",
            "extra": "mean: 796.8113318000178 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.267586869732204,
            "unit": "iter/sec",
            "range": "stddev: 0.004974616198088969",
            "extra": "mean: 788.9005668000209 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 1.3919021405049188,
            "unit": "iter/sec",
            "range": "stddev: 0.0042245883196142895",
            "extra": "mean: 718.4413120000272 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.3836036172329027,
            "unit": "iter/sec",
            "range": "stddev: 0.002021094970155936",
            "extra": "mean: 722.7503510000361 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 119.35273794163298,
            "unit": "iter/sec",
            "range": "stddev: 0.00008826553500327948",
            "extra": "mean: 8.378525849059528 msec\nrounds: 106"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 1.2803721688306824,
            "unit": "iter/sec",
            "range": "stddev: 0.011150621889069807",
            "extra": "mean: 781.0229122000237 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 1.2871988489974604,
            "unit": "iter/sec",
            "range": "stddev: 0.006881017698464013",
            "extra": "mean: 776.8807444000231 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 17.096706521234353,
            "unit": "iter/sec",
            "range": "stddev: 0.0011539981445142272",
            "extra": "mean: 58.49079755554006 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 362.58123551364395,
            "unit": "iter/sec",
            "range": "stddev: 0.00048205143179139804",
            "extra": "mean: 2.7580026268688966 msec\nrounds: 402"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 24.673888326903906,
            "unit": "iter/sec",
            "range": "stddev: 0.00030647278587519957",
            "extra": "mean: 40.52867495998271 msec\nrounds: 25"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 164.12544387803086,
            "unit": "iter/sec",
            "range": "stddev: 0.0004353293186814167",
            "extra": "mean: 6.092900505683604 msec\nrounds: 176"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 255.88753987946797,
            "unit": "iter/sec",
            "range": "stddev: 0.00003370676642593979",
            "extra": "mean: 3.9079667594250007 msec\nrounds: 212"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 264.7668424405935,
            "unit": "iter/sec",
            "range": "stddev: 0.0004306487970799441",
            "extra": "mean: 3.7769079797987652 msec\nrounds: 297"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 66.0091211383264,
            "unit": "iter/sec",
            "range": "stddev: 0.00010762909358294952",
            "extra": "mean: 15.149421515618045 msec\nrounds: 64"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 929.3363571897245,
            "unit": "iter/sec",
            "range": "stddev: 0.000017154111301833966",
            "extra": "mean: 1.0760366709680438 msec\nrounds: 620"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 26.294011701967815,
            "unit": "iter/sec",
            "range": "stddev: 0.000267159230140855",
            "extra": "mean: 38.03147314812981 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 1946.217498040008,
            "unit": "iter/sec",
            "range": "stddev: 0.000015074218251228129",
            "extra": "mean: 513.8171869316136 usec\nrounds: 1102"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 73.48124423279175,
            "unit": "iter/sec",
            "range": "stddev: 0.0005626493626103806",
            "extra": "mean: 13.608914906665936 msec\nrounds: 75"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 90744.43908013479,
            "unit": "iter/sec",
            "range": "stddev: 0.0000010489296954856312",
            "extra": "mean: 11.019959020485187 usec\nrounds: 42875"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_elements_3d",
            "value": 27217.305790256894,
            "unit": "iter/sec",
            "range": "stddev: 0.000002195450047772464",
            "extra": "mean: 36.74132949477955 usec\nrounds: 20580"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_with_refs",
            "value": 83271.7266328988,
            "unit": "iter/sec",
            "range": "stddev: 0.00000105386048893701",
            "extra": "mean: 12.008877928140885 usec\nrounds: 37609"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 26.874914499816676,
            "unit": "iter/sec",
            "range": "stddev: 0.00021834458226350595",
            "extra": "mean: 37.20942070371317 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 26.63551718562108,
            "unit": "iter/sec",
            "range": "stddev: 0.0002905932796868242",
            "extra": "mean: 37.54385518520512 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 25.929133965545883,
            "unit": "iter/sec",
            "range": "stddev: 0.00024160611263254186",
            "extra": "mean: 38.56665638462049 msec\nrounds: 26"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 3129.542800452995,
            "unit": "iter/sec",
            "range": "stddev: 0.000011687808667648205",
            "extra": "mean: 319.5354924863951 usec\nrounds: 1464"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 2800.9617354194725,
            "unit": "iter/sec",
            "range": "stddev: 0.000013318305858049649",
            "extra": "mean: 357.02022892870394 usec\nrounds: 2551"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 2093.9130484548728,
            "unit": "iter/sec",
            "range": "stddev: 0.000014365855069695536",
            "extra": "mean: 477.5747496955109 usec\nrounds: 1642"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 113.54833288104273,
            "unit": "iter/sec",
            "range": "stddev: 0.0004451972709077995",
            "extra": "mean: 8.806822386794844 msec\nrounds: 106"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 112.00153018982536,
            "unit": "iter/sec",
            "range": "stddev: 0.000495304645307785",
            "extra": "mean: 8.928449444441998 msec\nrounds: 117"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 111.66214734525188,
            "unit": "iter/sec",
            "range": "stddev: 0.00047359106979472587",
            "extra": "mean: 8.955586326923008 msec\nrounds: 104"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 26.17703166239712,
            "unit": "iter/sec",
            "range": "stddev: 0.0002644792151681524",
            "extra": "mean: 38.201428370371104 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 26.255681900953455,
            "unit": "iter/sec",
            "range": "stddev: 0.00028450697400064784",
            "extra": "mean: 38.086994037038735 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 7387.797347315528,
            "unit": "iter/sec",
            "range": "stddev: 0.000006025331815364916",
            "extra": "mean: 135.35834200478791 usec\nrounds: 2383"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 927144.0453589414,
            "unit": "iter/sec",
            "range": "stddev: 2.9981759308428094e-7",
            "extra": "mean: 1.0785810522170292 usec\nrounds: 190840"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3418457.6975284135,
            "unit": "iter/sec",
            "range": "stddev: 4.762570280112518e-8",
            "extra": "mean: 292.52958160722955 nsec\nrounds: 161499"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1395638.9072513154,
            "unit": "iter/sec",
            "range": "stddev: 3.1244103993232596e-7",
            "extra": "mean: 716.517714434804 nsec\nrounds: 3415"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 166487.79241473795,
            "unit": "iter/sec",
            "range": "stddev: 8.938937621622385e-7",
            "extra": "mean: 6.006446391630317 usec\nrounds: 49983"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 1147.1319660596034,
            "unit": "iter/sec",
            "range": "stddev: 0.00002128348705842156",
            "extra": "mean: 871.7392850928899 usec\nrounds: 691"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 121.14984879407807,
            "unit": "iter/sec",
            "range": "stddev: 0.00005821202893286189",
            "extra": "mean: 8.25424059504795 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 18.208814943309477,
            "unit": "iter/sec",
            "range": "stddev: 0.0016070816367276767",
            "extra": "mean: 54.91845587499 msec\nrounds: 16"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 119.4480447963099,
            "unit": "iter/sec",
            "range": "stddev: 0.00017676424714332739",
            "extra": "mean: 8.371840675209553 msec\nrounds: 117"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 109.98594412622296,
            "unit": "iter/sec",
            "range": "stddev: 0.00008074363458815903",
            "extra": "mean: 9.092070881824425 msec\nrounds: 110"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 120.52043447362162,
            "unit": "iter/sec",
            "range": "stddev: 0.00020738951125870173",
            "extra": "mean: 8.297348116670378 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 161.8270669093408,
            "unit": "iter/sec",
            "range": "stddev: 0.000045939979681798774",
            "extra": "mean: 6.1794359812516575 msec\nrounds: 160"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 1184.1757827452732,
            "unit": "iter/sec",
            "range": "stddev: 0.000017449612867519207",
            "extra": "mean: 844.4692203396538 usec\nrounds: 1062"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 121.09306910556656,
            "unit": "iter/sec",
            "range": "stddev: 0.000051929920801229045",
            "extra": "mean: 8.258110950414673 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 121.34587725042468,
            "unit": "iter/sec",
            "range": "stddev: 0.00004657442493152773",
            "extra": "mean: 8.24090626446479 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 27763.235135310773,
            "unit": "iter/sec",
            "range": "stddev: 0.000002416802542738684",
            "extra": "mean: 36.01885713701089 usec\nrounds: 25913"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 4.571150219203056,
            "unit": "iter/sec",
            "range": "stddev: 0.0009342371615336444",
            "extra": "mean: 218.76332039998942 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 3.3186754628603317,
            "unit": "iter/sec",
            "range": "stddev: 0.001859013124159989",
            "extra": "mean: 301.32503499999075 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.244625231558669,
            "unit": "iter/sec",
            "range": "stddev: 0.003976908272409822",
            "extra": "mean: 803.454706399998 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.1263156335400932,
            "unit": "iter/sec",
            "range": "stddev: 0.01904270749528423",
            "extra": "mean: 7.916676439599973 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.2537396096865725,
            "unit": "iter/sec",
            "range": "stddev: 0.0011433954876994203",
            "extra": "mean: 797.613788600006 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 3.0799153767625445,
            "unit": "iter/sec",
            "range": "stddev: 0.0010655926528726767",
            "extra": "mean: 324.6842453999989 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 1.024283980894863,
            "unit": "iter/sec",
            "range": "stddev: 0.006969939118757982",
            "extra": "mean: 976.2917498000434 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 2.38264086209119,
            "unit": "iter/sec",
            "range": "stddev: 0.0010355572941082886",
            "extra": "mean: 419.7023629999876 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 3.2017030990903215,
            "unit": "iter/sec",
            "range": "stddev: 0.0017569564775381373",
            "extra": "mean: 312.3337702000299 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.2498854126926089,
            "unit": "iter/sec",
            "range": "stddev: 0.0025764016927437333",
            "extra": "mean: 800.0733426000352 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.246174661569002,
            "unit": "iter/sec",
            "range": "stddev: 0.0024884850714126643",
            "extra": "mean: 802.4557318000234 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 11281.569829267448,
            "unit": "iter/sec",
            "range": "stddev: 0.000004673273049404572",
            "extra": "mean: 88.64014628582355 usec\nrounds: 9960"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 3.9844026700577166,
            "unit": "iter/sec",
            "range": "stddev: 0.0014149573428837222",
            "extra": "mean: 250.9786492000103 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 27.42484798046608,
            "unit": "iter/sec",
            "range": "stddev: 0.0006181243988842584",
            "extra": "mean: 36.46328325000273 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 17.04487553619502,
            "unit": "iter/sec",
            "range": "stddev: 0.0005534068353567854",
            "extra": "mean: 58.66865955556477 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.4913802655142,
            "unit": "iter/sec",
            "range": "stddev: 0.0009744223814198582",
            "extra": "mean: 182.10357899998067 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 16.8720877405637,
            "unit": "iter/sec",
            "range": "stddev: 0.0008838549791151817",
            "extra": "mean: 59.269487888911954 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 20.87115593935221,
            "unit": "iter/sec",
            "range": "stddev: 0.0013549567042659204",
            "extra": "mean: 47.913014636363144 msec\nrounds: 22"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 17.111380513949484,
            "unit": "iter/sec",
            "range": "stddev: 0.0010143846685604426",
            "extra": "mean: 58.44063833334682 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 16.93667929440775,
            "unit": "iter/sec",
            "range": "stddev: 0.0008147554904314904",
            "extra": "mean: 59.04345135295711 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 26.69499631200167,
            "unit": "iter/sec",
            "range": "stddev: 0.0009033109290333733",
            "extra": "mean: 37.460203714297386 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 17.162769803752717,
            "unit": "iter/sec",
            "range": "stddev: 0.0006230493202694345",
            "extra": "mean: 58.265653588230585 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 17.114103785987567,
            "unit": "iter/sec",
            "range": "stddev: 0.0008852463459160341",
            "extra": "mean: 58.43133899998697 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 21279.03832989744,
            "unit": "iter/sec",
            "range": "stddev: 0.000002790653693283232",
            "extra": "mean: 46.99460494861657 usec\nrounds: 18185"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 25.44915324167618,
            "unit": "iter/sec",
            "range": "stddev: 0.014858109503899684",
            "extra": "mean: 39.29403821429998 msec\nrounds: 28"
          }
        ]
      }
    ]
  }
}