window.BENCHMARK_DATA = {
  "lastUpdate": 1773852920587,
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
          "id": "4b9f86443ecd7c6f321ab72177fdfb0345b7a725",
          "message": "chore: release v0.8.0 (#196)\n\nchore: release v0.8.0",
          "timestamp": "2026-03-18T17:46:16+01:00",
          "tree_id": "51b2a9f5cf35a86a92a729f932c5c216a88c1b32",
          "url": "https://github.com/kmarchais/mmgpy/commit/4b9f86443ecd7c6f321ab72177fdfb0345b7a725"
        },
        "date": 1773852920072,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 1.144932681620197,
            "unit": "iter/sec",
            "range": "stddev: 0.015118442659666229",
            "extra": "mean: 873.4137963333334 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.5641856850973391,
            "unit": "iter/sec",
            "range": "stddev: 0.01823781491285781",
            "extra": "mean: 1.7724660983333347 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.1921107915057931,
            "unit": "iter/sec",
            "range": "stddev: 0.002078818634667729",
            "extra": "mean: 838.8482070000123 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.2470284227174266,
            "unit": "iter/sec",
            "range": "stddev: 0.001381645203985583",
            "extra": "mean: 801.9063413333262 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 1.1505136031361167,
            "unit": "iter/sec",
            "range": "stddev: 0.011533740750059251",
            "extra": "mean: 869.1770330000091 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.5661752143009455,
            "unit": "iter/sec",
            "range": "stddev: 0.0071111940128193475",
            "extra": "mean: 1.7662376853333228 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.2413715131619414,
            "unit": "iter/sec",
            "range": "stddev: 0.005316213756159681",
            "extra": "mean: 805.5606153333296 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.2540192214762163,
            "unit": "iter/sec",
            "range": "stddev: 0.008225229323601554",
            "extra": "mean: 797.4359426666618 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 31.02840961281299,
            "unit": "iter/sec",
            "range": "stddev: 0.0006909626899238172",
            "extra": "mean: 32.228529031248065 msec\nrounds: 32"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.0739973498513844,
            "unit": "iter/sec",
            "range": "stddev: 0.0014187229651666656",
            "extra": "mean: 931.1009940000096 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 119.43690827988779,
            "unit": "iter/sec",
            "range": "stddev: 0.00004128570364357892",
            "extra": "mean: 8.372621280991345 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 12.366960484306627,
            "unit": "iter/sec",
            "range": "stddev: 0.0010733692405110321",
            "extra": "mean: 80.86061253846293 msec\nrounds: 13"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 1.0237175841963975,
            "unit": "iter/sec",
            "range": "stddev: 0.005089779202545956",
            "extra": "mean: 976.8319069999999 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 17.731073458374475,
            "unit": "iter/sec",
            "range": "stddev: 0.0010755718084001999",
            "extra": "mean: 56.398164631577615 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 371.48748433004056,
            "unit": "iter/sec",
            "range": "stddev: 0.00008989627270160268",
            "extra": "mean: 2.6918807286427184 msec\nrounds: 398"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 30.874625608379507,
            "unit": "iter/sec",
            "range": "stddev: 0.000238908780438652",
            "extra": "mean: 32.38905671875081 msec\nrounds: 32"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 149.3117556457806,
            "unit": "iter/sec",
            "range": "stddev: 0.00008958862798134552",
            "extra": "mean: 6.697396301282182 msec\nrounds: 156"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 248.7006759971866,
            "unit": "iter/sec",
            "range": "stddev: 0.00004949823247483384",
            "extra": "mean: 4.02089779607721 msec\nrounds: 255"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 274.5487717462425,
            "unit": "iter/sec",
            "range": "stddev: 0.0001449425760129616",
            "extra": "mean: 3.6423400973152815 msec\nrounds: 298"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 68.8355120142849,
            "unit": "iter/sec",
            "range": "stddev: 0.00021505255649822668",
            "extra": "mean: 14.527385222216083 msec\nrounds: 72"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 872.7048486527796,
            "unit": "iter/sec",
            "range": "stddev: 0.000023925101579943823",
            "extra": "mean: 1.1458627754202693 msec\nrounds: 895"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 31.915340339185736,
            "unit": "iter/sec",
            "range": "stddev: 0.0003926899514132085",
            "extra": "mean: 31.3328947575783 msec\nrounds: 33"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 1714.9862443287811,
            "unit": "iter/sec",
            "range": "stddev: 0.00001642926937588452",
            "extra": "mean: 583.0950558973052 usec\nrounds: 1789"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 80.97600820918225,
            "unit": "iter/sec",
            "range": "stddev: 0.00044172401406160377",
            "extra": "mean: 12.349336823528494 msec\nrounds: 85"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 81135.41683083827,
            "unit": "iter/sec",
            "range": "stddev: 0.0000010021274304149594",
            "extra": "mean: 12.325073797117858 usec\nrounds: 83174"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
            "value": 27000.474330137604,
            "unit": "iter/sec",
            "range": "stddev: 0.0000022293461141013773",
            "extra": "mean: 37.03638638984249 usec\nrounds: 27436"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
            "value": 6234.7871718317665,
            "unit": "iter/sec",
            "range": "stddev: 0.000004493081709036085",
            "extra": "mean: 160.3903986519242 usec\nrounds: 6379"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 33.3138811948026,
            "unit": "iter/sec",
            "range": "stddev: 0.00025499248771025033",
            "extra": "mean: 30.017517147056797 msec\nrounds: 34"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 32.87344193783988,
            "unit": "iter/sec",
            "range": "stddev: 0.000441492850497658",
            "extra": "mean: 30.419692647058127 msec\nrounds: 34"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 32.48113732465225,
            "unit": "iter/sec",
            "range": "stddev: 0.0003508905859738076",
            "extra": "mean: 30.787099294119503 msec\nrounds: 34"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 3139.7729675822634,
            "unit": "iter/sec",
            "range": "stddev: 0.000010235291883877302",
            "extra": "mean: 318.4943657789485 usec\nrounds: 3267"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 2805.1033642424945,
            "unit": "iter/sec",
            "range": "stddev: 0.000010265251319644995",
            "extra": "mean: 356.49310208932195 usec\nrounds: 2919"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 2104.356568821453,
            "unit": "iter/sec",
            "range": "stddev: 0.000014714590258962298",
            "extra": "mean: 475.20463728257374 usec\nrounds: 2178"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 133.21271330180483,
            "unit": "iter/sec",
            "range": "stddev: 0.0004677181633884099",
            "extra": "mean: 7.5067910202715735 msec\nrounds: 148"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 133.7203426206991,
            "unit": "iter/sec",
            "range": "stddev: 0.0004187943887623784",
            "extra": "mean: 7.47829373154183 msec\nrounds: 149"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 133.80147429070774,
            "unit": "iter/sec",
            "range": "stddev: 0.0004486797858483777",
            "extra": "mean: 7.4737592040826115 msec\nrounds: 147"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 33.09276492715183,
            "unit": "iter/sec",
            "range": "stddev: 0.0001825638644577933",
            "extra": "mean: 30.218085499997724 msec\nrounds: 34"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 32.92849118979026,
            "unit": "iter/sec",
            "range": "stddev: 0.00029975136987140386",
            "extra": "mean: 30.368837558826808 msec\nrounds: 34"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 7424.1006557689,
            "unit": "iter/sec",
            "range": "stddev: 0.000006522118344243072",
            "extra": "mean: 134.696449626252 usec\nrounds: 7762"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 987829.4366475535,
            "unit": "iter/sec",
            "range": "stddev: 9.848785534368554e-8",
            "extra": "mean: 1.0123205109110236 usec\nrounds: 102365"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3388159.602601417,
            "unit": "iter/sec",
            "range": "stddev: 4.6125149654495234e-8",
            "extra": "mean: 295.14548229434166 nsec\nrounds: 195351"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1601177.8084903113,
            "unit": "iter/sec",
            "range": "stddev: 7.511303081452902e-8",
            "extra": "mean: 624.5402569892356 nsec\nrounds: 164990"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 155073.66999186666,
            "unit": "iter/sec",
            "range": "stddev: 0.0000010554977645556043",
            "extra": "mean: 6.4485479711188125 usec\nrounds: 173281"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 1061.5885638984244,
            "unit": "iter/sec",
            "range": "stddev: 0.00002064128083246241",
            "extra": "mean: 941.9845258390357 usec\nrounds: 1103"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 118.26184853357775,
            "unit": "iter/sec",
            "range": "stddev: 0.00009514301270524962",
            "extra": "mean: 8.455812355377422 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 18.37961178993981,
            "unit": "iter/sec",
            "range": "stddev: 0.000159262097936497",
            "extra": "mean: 54.4081132631624 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 118.69368682862128,
            "unit": "iter/sec",
            "range": "stddev: 0.0000883829339467754",
            "extra": "mean: 8.425047925622817 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 107.94947203567115,
            "unit": "iter/sec",
            "range": "stddev: 0.00007480124537590749",
            "extra": "mean: 9.26359324545429 msec\nrounds: 110"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 118.13575319434729,
            "unit": "iter/sec",
            "range": "stddev: 0.00008051741091237094",
            "extra": "mean: 8.464837891665885 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 159.63061522940825,
            "unit": "iter/sec",
            "range": "stddev: 0.00004206470987054851",
            "extra": "mean: 6.264462481478761 msec\nrounds: 162"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 1090.9248229449681,
            "unit": "iter/sec",
            "range": "stddev: 0.000020432121451235675",
            "extra": "mean: 916.6534475771526 usec\nrounds: 1135"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 118.59408255868269,
            "unit": "iter/sec",
            "range": "stddev: 0.00007171915636992312",
            "extra": "mean: 8.432123917356334 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 119.23800333143987,
            "unit": "iter/sec",
            "range": "stddev: 0.000060569362794266196",
            "extra": "mean: 8.386587933885059 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 28248.81497251927,
            "unit": "iter/sec",
            "range": "stddev: 0.0000048872245410911615",
            "extra": "mean: 35.39971503133176 usec\nrounds: 29126"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 49.94203870204795,
            "unit": "iter/sec",
            "range": "stddev: 0.014776387082244774",
            "extra": "mean: 20.02321142646893 msec\nrounds: 68"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 3.2337237914145716,
            "unit": "iter/sec",
            "range": "stddev: 0.0028401472766460614",
            "extra": "mean: 309.2410064999882 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.2447223967459111,
            "unit": "iter/sec",
            "range": "stddev: 0.0028906232255479975",
            "extra": "mean: 803.3919873333275 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.12846241022794255,
            "unit": "iter/sec",
            "range": "stddev: 0.070044038110796",
            "extra": "mean: 7.784378311333323 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.247480703882207,
            "unit": "iter/sec",
            "range": "stddev: 0.0025994622510815114",
            "extra": "mean: 801.6156056666546 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 3.081840665765064,
            "unit": "iter/sec",
            "range": "stddev: 0.005982140615772605",
            "extra": "mean: 324.48140849999163 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 0.9967631876429616,
            "unit": "iter/sec",
            "range": "stddev: 0.020581016158294555",
            "extra": "mean: 1.003247323333331 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 2.2770682514910567,
            "unit": "iter/sec",
            "range": "stddev: 0.016900121040645696",
            "extra": "mean: 439.1611886666927 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 3.1211266087271503,
            "unit": "iter/sec",
            "range": "stddev: 0.001995714262960841",
            "extra": "mean: 320.3971275000015 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.2411111895851812,
            "unit": "iter/sec",
            "range": "stddev: 0.0015640427470255205",
            "extra": "mean: 805.7295820000073 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.218398401671177,
            "unit": "iter/sec",
            "range": "stddev: 0.009229079071508892",
            "extra": "mean: 820.7495993333396 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 11387.940062388521,
            "unit": "iter/sec",
            "range": "stddev: 0.000003522434314884359",
            "extra": "mean: 87.81219382272185 usec\nrounds: 11526"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 285.15698974727434,
            "unit": "iter/sec",
            "range": "stddev: 0.000039069687369378655",
            "extra": "mean: 3.506840217685944 msec\nrounds: 294"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 26.263410327118837,
            "unit": "iter/sec",
            "range": "stddev: 0.0010613476782806348",
            "extra": "mean: 38.075786333331926 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 16.14726871712492,
            "unit": "iter/sec",
            "range": "stddev: 0.0007040615357779417",
            "extra": "mean: 61.92997822222739 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.443095606041918,
            "unit": "iter/sec",
            "range": "stddev: 0.0011708595897534963",
            "extra": "mean: 183.71898500000347 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 16.844449301258997,
            "unit": "iter/sec",
            "range": "stddev: 0.0014781995632688393",
            "extra": "mean: 59.36673750000586 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 20.97520883148417,
            "unit": "iter/sec",
            "range": "stddev: 0.0017995539293251483",
            "extra": "mean: 47.675329863652266 msec\nrounds: 22"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 16.430726050312668,
            "unit": "iter/sec",
            "range": "stddev: 0.0011793230473889256",
            "extra": "mean: 60.86158316667757 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 16.152301656148925,
            "unit": "iter/sec",
            "range": "stddev: 0.0008676431281523777",
            "extra": "mean: 61.91068129410001 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 26.595481555338715,
            "unit": "iter/sec",
            "range": "stddev: 0.0007959628038092043",
            "extra": "mean: 37.60037200000473 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 16.91385280599657,
            "unit": "iter/sec",
            "range": "stddev: 0.0006035669599501883",
            "extra": "mean: 59.123134833328095 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 16.874981580834817,
            "unit": "iter/sec",
            "range": "stddev: 0.0007347449241682711",
            "extra": "mean: 59.25932394117193 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 21814.671675790614,
            "unit": "iter/sec",
            "range": "stddev: 0.0000027349479226197696",
            "extra": "mean: 45.84070825644263 usec\nrounds: 22345"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 40.94547680927193,
            "unit": "iter/sec",
            "range": "stddev: 0.020059645625836595",
            "extra": "mean: 24.422722066666815 msec\nrounds: 60"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 170.41694704663206,
            "unit": "iter/sec",
            "range": "stddev: 0.00002479880603139327",
            "extra": "mean: 5.867961005816898 msec\nrounds: 172"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.090587938962702,
            "unit": "iter/sec",
            "range": "stddev: 0.0008086650546893676",
            "extra": "mean: 70.96935942856167 msec\nrounds: 14"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
            "value": 1.0791291208284783,
            "unit": "iter/sec",
            "range": "stddev: 0.01610969268347986",
            "extra": "mean: 926.6731669999521 msec\nrounds: 3"
          }
        ]
      }
    ]
  }
}