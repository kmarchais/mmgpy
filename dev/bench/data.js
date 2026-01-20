window.BENCHMARK_DATA = {
  "lastUpdate": 1768946081297,
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
          "id": "a7a1a2865373f26d59034f80fe0e242ace0c440f",
          "message": "docs: add v0.5.1 to changelog (#173)",
          "timestamp": "2026-01-20T22:41:27+01:00",
          "tree_id": "a3a5bd9f937c5e2bc94b6458d4ed30ebcbf0c395",
          "url": "https://github.com/kmarchais/mmgpy/commit/a7a1a2865373f26d59034f80fe0e242ace0c440f"
        },
        "date": 1768946080721,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 1.1208937055292214,
            "unit": "iter/sec",
            "range": "stddev: 0.003352790105727387",
            "extra": "mean: 892.1452543333336 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.539822656651104,
            "unit": "iter/sec",
            "range": "stddev: 0.013431656507761458",
            "extra": "mean: 1.8524602249999969 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.1275008853315251,
            "unit": "iter/sec",
            "range": "stddev: 0.004246870885630704",
            "extra": "mean: 886.9172636666841 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.2036607613599928,
            "unit": "iter/sec",
            "range": "stddev: 0.00041281563295855175",
            "extra": "mean: 830.7988696666655 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 1.1190291191161366,
            "unit": "iter/sec",
            "range": "stddev: 0.006223932040996327",
            "extra": "mean: 893.6317946666558 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.5277687962279535,
            "unit": "iter/sec",
            "range": "stddev: 0.022960890505178248",
            "extra": "mean: 1.8947690866666562 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.1930865782154287,
            "unit": "iter/sec",
            "range": "stddev: 0.0030779470397609794",
            "extra": "mean: 838.1621403333194 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.1991575831638888,
            "unit": "iter/sec",
            "range": "stddev: 0.005776054573086934",
            "extra": "mean: 833.9187560000028 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 27.9423318831819,
            "unit": "iter/sec",
            "range": "stddev: 0.0005035675090327947",
            "extra": "mean: 35.78799379309806 msec\nrounds: 29"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 0.9689913053611595,
            "unit": "iter/sec",
            "range": "stddev: 0.019033732152533157",
            "extra": "mean: 1.0320010040000132 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 112.81077193612768,
            "unit": "iter/sec",
            "range": "stddev: 0.00008726274001243804",
            "extra": "mean: 8.864401713040222 msec\nrounds: 115"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 11.384097392130641,
            "unit": "iter/sec",
            "range": "stddev: 0.0009980455856848632",
            "extra": "mean: 87.84183458332488 msec\nrounds: 12"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 1.002496837671339,
            "unit": "iter/sec",
            "range": "stddev: 0.0010089002120931964",
            "extra": "mean: 997.5093810000052 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 16.32637233898641,
            "unit": "iter/sec",
            "range": "stddev: 0.0016100989773258512",
            "extra": "mean: 61.25059377777752 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 364.6720228520527,
            "unit": "iter/sec",
            "range": "stddev: 0.00042463200269366456",
            "extra": "mean: 2.74219007035179 msec\nrounds: 398"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 22.954075731101195,
            "unit": "iter/sec",
            "range": "stddev: 0.0010358828231271247",
            "extra": "mean: 43.56524792000528 msec\nrounds: 25"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 163.58579754125734,
            "unit": "iter/sec",
            "range": "stddev: 0.00038930643934048296",
            "extra": "mean: 6.11300011999999 msec\nrounds: 175"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 257.32102219574966,
            "unit": "iter/sec",
            "range": "stddev: 0.00007058377770463866",
            "extra": "mean: 3.886196283019886 msec\nrounds: 265"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 273.4530212448858,
            "unit": "iter/sec",
            "range": "stddev: 0.0003244102810556021",
            "extra": "mean: 3.656935277026866 msec\nrounds: 296"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 65.31813656126896,
            "unit": "iter/sec",
            "range": "stddev: 0.00021535882653797052",
            "extra": "mean: 15.309683537312669 msec\nrounds: 67"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 909.167505852861,
            "unit": "iter/sec",
            "range": "stddev: 0.00010110811030017403",
            "extra": "mean: 1.0999073257264425 msec\nrounds: 964"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 26.31023437926737,
            "unit": "iter/sec",
            "range": "stddev: 0.002680066602610798",
            "extra": "mean: 38.008023249994544 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 2000.0873939698604,
            "unit": "iter/sec",
            "range": "stddev: 0.000017976145369046084",
            "extra": "mean: 499.97815246220637 usec\nrounds: 2112"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 67.77036790776656,
            "unit": "iter/sec",
            "range": "stddev: 0.00012276330928171544",
            "extra": "mean: 14.755711542852623 msec\nrounds: 70"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 91301.35727207782,
            "unit": "iter/sec",
            "range": "stddev: 9.707991938161571e-7",
            "extra": "mean: 10.95273969498616 usec\nrounds: 93110"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
            "value": 25585.150737812895,
            "unit": "iter/sec",
            "range": "stddev: 0.000002339960831101189",
            "extra": "mean: 39.085171326431805 usec\nrounds: 26219"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
            "value": 6368.939185019842,
            "unit": "iter/sec",
            "range": "stddev: 0.000004584224055566359",
            "extra": "mean: 157.0120189484718 usec\nrounds: 6544"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 26.262373265480527,
            "unit": "iter/sec",
            "range": "stddev: 0.0004512225620525889",
            "extra": "mean: 38.07728988889241 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 26.579466930427234,
            "unit": "iter/sec",
            "range": "stddev: 0.0002331712839795645",
            "extra": "mean: 37.62302692591759 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 25.548582015424525,
            "unit": "iter/sec",
            "range": "stddev: 0.0005848927825708785",
            "extra": "mean: 39.14111551851555 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 3089.083620332175,
            "unit": "iter/sec",
            "range": "stddev: 0.00003306796297457414",
            "extra": "mean: 323.72059902103524 usec\nrounds: 3883"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 2738.8711910167312,
            "unit": "iter/sec",
            "range": "stddev: 0.00002363743440791395",
            "extra": "mean: 365.1139211219266 usec\nrounds: 3385"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 2051.803933762315,
            "unit": "iter/sec",
            "range": "stddev: 0.000020253891461569474",
            "extra": "mean: 487.3760029138544 usec\nrounds: 2403"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 95.99582572892784,
            "unit": "iter/sec",
            "range": "stddev: 0.00013028102516986716",
            "extra": "mean: 10.417119623761467 msec\nrounds: 101"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 95.37490790564797,
            "unit": "iter/sec",
            "range": "stddev: 0.00015590060341397354",
            "extra": "mean: 10.484938040404455 msec\nrounds: 99"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 94.36273088249848,
            "unit": "iter/sec",
            "range": "stddev: 0.00012873739726469342",
            "extra": "mean: 10.597404193878312 msec\nrounds: 98"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 26.319701797307808,
            "unit": "iter/sec",
            "range": "stddev: 0.00038078232942457163",
            "extra": "mean: 37.99435144444866 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 26.3219364154836,
            "unit": "iter/sec",
            "range": "stddev: 0.0004658566407996792",
            "extra": "mean: 37.991125888890174 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 6942.531245853227,
            "unit": "iter/sec",
            "range": "stddev: 0.00001068314280840276",
            "extra": "mean: 144.03968301868284 usec\nrounds: 9051"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 1022262.9555219229,
            "unit": "iter/sec",
            "range": "stddev: 9.415011593402852e-8",
            "extra": "mean: 978.2218895816718 nsec\nrounds: 105854"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3363539.161418219,
            "unit": "iter/sec",
            "range": "stddev: 3.9700649493715385e-8",
            "extra": "mean: 297.3058888300129 nsec\nrounds: 196117"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1634331.2133178532,
            "unit": "iter/sec",
            "range": "stddev: 7.209758036495091e-8",
            "extra": "mean: 611.8710772034401 nsec\nrounds: 168891"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 156405.3670736855,
            "unit": "iter/sec",
            "range": "stddev: 8.807174378853444e-7",
            "extra": "mean: 6.393642486251006 usec\nrounds: 172385"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 1165.0611193454633,
            "unit": "iter/sec",
            "range": "stddev: 0.00007297417105029797",
            "extra": "mean: 858.3240684933376 usec\nrounds: 1314"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 117.65203400507238,
            "unit": "iter/sec",
            "range": "stddev: 0.00008670603736020185",
            "extra": "mean: 8.499640558333965 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 18.104294829074963,
            "unit": "iter/sec",
            "range": "stddev: 0.000177048670161332",
            "extra": "mean: 55.2355123157865 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 117.98458317684026,
            "unit": "iter/sec",
            "range": "stddev: 0.00009149660913473037",
            "extra": "mean: 8.475683628098748 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 107.69986851186417,
            "unit": "iter/sec",
            "range": "stddev: 0.00010556785573673795",
            "extra": "mean: 9.28506240367267 msec\nrounds: 109"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 118.12852660907065,
            "unit": "iter/sec",
            "range": "stddev: 0.00010772203043088025",
            "extra": "mean: 8.465355733330663 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 158.99267095905446,
            "unit": "iter/sec",
            "range": "stddev: 0.00009997491372895571",
            "extra": "mean: 6.289598092590891 msec\nrounds: 162"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 1116.578904267566,
            "unit": "iter/sec",
            "range": "stddev: 0.000037624064169130293",
            "extra": "mean: 895.5927755557611 usec\nrounds: 1350"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 118.57494906872292,
            "unit": "iter/sec",
            "range": "stddev: 0.00010391650138366715",
            "extra": "mean: 8.433484541666777 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 116.54722829653129,
            "unit": "iter/sec",
            "range": "stddev: 0.00011974147229708549",
            "extra": "mean: 8.580212628100417 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 27200.2634480398,
            "unit": "iter/sec",
            "range": "stddev: 0.000002176861046518651",
            "extra": "mean: 36.764349797945265 usec\nrounds: 27959"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 47.45791484963438,
            "unit": "iter/sec",
            "range": "stddev: 0.016562469316964198",
            "extra": "mean: 21.071300818175413 msec\nrounds: 66"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 3.1560670567484443,
            "unit": "iter/sec",
            "range": "stddev: 0.001222720907347943",
            "extra": "mean: 316.850048500001 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.2328985738160425,
            "unit": "iter/sec",
            "range": "stddev: 0.0032260750579671212",
            "extra": "mean: 811.096728666674 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.12611589644689392,
            "unit": "iter/sec",
            "range": "stddev: 0.014497124790655097",
            "extra": "mean: 7.929214541333333 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.2554760002542962,
            "unit": "iter/sec",
            "range": "stddev: 0.002440548490705503",
            "extra": "mean: 796.5106459999637 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 2.9666712316816692,
            "unit": "iter/sec",
            "range": "stddev: 0.0022596018336735546",
            "extra": "mean: 337.07813299997724 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 1.026562672906847,
            "unit": "iter/sec",
            "range": "stddev: 0.002925091499395905",
            "extra": "mean: 974.1246456666582 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 2.3360053702208234,
            "unit": "iter/sec",
            "range": "stddev: 0.002452643750868603",
            "extra": "mean: 428.0812076666886 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 3.1392682956884093,
            "unit": "iter/sec",
            "range": "stddev: 0.003165896598634622",
            "extra": "mean: 318.5455672499984 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.2532540406965587,
            "unit": "iter/sec",
            "range": "stddev: 0.002274102952683741",
            "extra": "mean: 797.9228213333348 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.2440241950100175,
            "unit": "iter/sec",
            "range": "stddev: 0.0009310341158083364",
            "extra": "mean: 803.8428866666436 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 11410.668966198693,
            "unit": "iter/sec",
            "range": "stddev: 0.0000033742748729923918",
            "extra": "mean: 87.63728077313036 usec\nrounds: 11593"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 288.7612370404791,
            "unit": "iter/sec",
            "range": "stddev: 0.000028264564153505682",
            "extra": "mean: 3.4630686938767274 msec\nrounds: 294"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 26.795405791305562,
            "unit": "iter/sec",
            "range": "stddev: 0.0012180950397502504",
            "extra": "mean: 37.31983041378216 msec\nrounds: 29"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 16.94908324582912,
            "unit": "iter/sec",
            "range": "stddev: 0.001096248948893247",
            "extra": "mean: 59.00024122225508 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.46512466401115,
            "unit": "iter/sec",
            "range": "stddev: 0.0008803303412178044",
            "extra": "mean: 182.97844266667576 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 16.905931858979905,
            "unit": "iter/sec",
            "range": "stddev: 0.0007920153364999514",
            "extra": "mean: 59.15083583333095 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 20.637571350788175,
            "unit": "iter/sec",
            "range": "stddev: 0.0014316297943010041",
            "extra": "mean: 48.455314000007505 msec\nrounds: 22"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 17.02105161204457,
            "unit": "iter/sec",
            "range": "stddev: 0.0008917479853247355",
            "extra": "mean: 58.75077655556677 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 16.513992105885954,
            "unit": "iter/sec",
            "range": "stddev: 0.001275368709102295",
            "extra": "mean: 60.55470982353066 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 26.7269414942116,
            "unit": "iter/sec",
            "range": "stddev: 0.0008099679291386589",
            "extra": "mean: 37.415429678572664 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 16.991471305610325,
            "unit": "iter/sec",
            "range": "stddev: 0.000784524985116689",
            "extra": "mean: 58.85305527778605 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 16.813171050373256,
            "unit": "iter/sec",
            "range": "stddev: 0.0007836361988620154",
            "extra": "mean: 59.47717994445788 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 21699.938773108686,
            "unit": "iter/sec",
            "range": "stddev: 0.000002551001230227835",
            "extra": "mean: 46.08307933288892 usec\nrounds: 22147"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 45.866914029990674,
            "unit": "iter/sec",
            "range": "stddev: 0.01566968633574788",
            "extra": "mean: 21.802208000000547 msec\nrounds: 62"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 171.88681944402464,
            "unit": "iter/sec",
            "range": "stddev: 0.00019083564533696587",
            "extra": "mean: 5.817781742861631 msec\nrounds: 175"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.56225773166317,
            "unit": "iter/sec",
            "range": "stddev: 0.00019383487333527407",
            "extra": "mean: 68.67067033332812 msec\nrounds: 15"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
            "value": 1.1648445524923647,
            "unit": "iter/sec",
            "range": "stddev: 0.0006746530569504112",
            "extra": "mean: 858.4836473333249 msec\nrounds: 3"
          }
        ]
      }
    ]
  }
}