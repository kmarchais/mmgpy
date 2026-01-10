window.BENCHMARK_DATA = {
  "lastUpdate": 1768087312092,
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
          "id": "c901cb770edc0c7371611f27bad29e1031d8b427",
          "message": "feat(mesh): add geometry convenience methods (#139)\n\n* feat(mesh): add geometry convenience methods\n\nAdd five new methods to the Mesh class for common geometric computations:\n\n- get_bounds(): Returns bounding box as (min_coords, max_coords)\n- get_center_of_mass(): Element-weighted centroid (volume or area weighted)\n- compute_volume(): Total volume for tetrahedral meshes\n- compute_surface_area(): Total area for triangular elements\n- get_diagonal(): Bounding box diagonal length\n\nCloses #120\n\n* refactor(mesh): extract geometry helper methods and improve coverage\n\n- Extract _compute_tetrahedra_volumes() and _compute_triangle_areas()\n  private helper methods to reduce code duplication\n- Add empty mesh validation in get_bounds() with clear error message\n- Update get_diagonal() docstring to document ValueError\n- Clarify compute_surface_area() docstring for tetrahedral meshes\n- Add 6 new tests using mocking for edge cases:\n  - Empty vertices validation for get_bounds/get_diagonal\n  - Empty tetrahedra/triangles fallback paths\n  - Empty elements returning 0.0 for volume/area\n\n* fix(deps): cap scipy<1.17 for manylinux wheel availability\n\nscipy 1.17.0 doesn't have pre-built wheels for manylinux_2_17 yet,\ncausing CI to fail when building from source due to missing OpenBLAS.\n\n* chore: update uv.lock for scipy<1.17 cap",
          "timestamp": "2026-01-11T00:11:48+01:00",
          "tree_id": "8a06cb3e5ba5f88ca0c81cfac0da1aba517f7395",
          "url": "https://github.com/kmarchais/mmgpy/commit/c901cb770edc0c7371611f27bad29e1031d8b427"
        },
        "date": 1768087311525,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 0.6223601137120393,
            "unit": "iter/sec",
            "range": "stddev: 0.007156163742215162",
            "extra": "mean: 1.6067867749999987 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.6263534796657709,
            "unit": "iter/sec",
            "range": "stddev: 0.0180473906290293",
            "extra": "mean: 1.5965425793333357 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.181947992014275,
            "unit": "iter/sec",
            "range": "stddev: 0.0025392314118092133",
            "extra": "mean: 846.0609153333394 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.2429035381557496,
            "unit": "iter/sec",
            "range": "stddev: 0.004227878634287926",
            "extra": "mean: 804.5676669999864 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 0.6322968940016533,
            "unit": "iter/sec",
            "range": "stddev: 0.01058894693415536",
            "extra": "mean: 1.5815355246666531 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.6229807422542057,
            "unit": "iter/sec",
            "range": "stddev: 0.030934529118070816",
            "extra": "mean: 1.6051860549999997 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.2396858165886426,
            "unit": "iter/sec",
            "range": "stddev: 0.0012332093296364267",
            "extra": "mean: 806.6559983333453 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.2243200531878486,
            "unit": "iter/sec",
            "range": "stddev: 0.010785245174720688",
            "extra": "mean: 816.77989133334 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 1.2828013387350974,
            "unit": "iter/sec",
            "range": "stddev: 0.013207769630916612",
            "extra": "mean: 779.5439323333161 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.3082988265410762,
            "unit": "iter/sec",
            "range": "stddev: 0.001997882563342494",
            "extra": "mean: 764.3513696666938 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 120.69755020113918,
            "unit": "iter/sec",
            "range": "stddev: 0.00013925262211469946",
            "extra": "mean: 8.285172303278129 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 1.2350540942557313,
            "unit": "iter/sec",
            "range": "stddev: 0.005608736569390896",
            "extra": "mean: 809.6811343333267 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 1.2236255387121526,
            "unit": "iter/sec",
            "range": "stddev: 0.004270187702130777",
            "extra": "mean: 817.2434853333357 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 16.99698983404264,
            "unit": "iter/sec",
            "range": "stddev: 0.0007171192485554164",
            "extra": "mean: 58.83394705556258 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 365.54155757251516,
            "unit": "iter/sec",
            "range": "stddev: 0.0002482670117040417",
            "extra": "mean: 2.7356670651643284 msec\nrounds: 399"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 24.04924792677317,
            "unit": "iter/sec",
            "range": "stddev: 0.00024355411245955658",
            "extra": "mean: 41.58134187999849 msec\nrounds: 25"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 165.66379454522473,
            "unit": "iter/sec",
            "range": "stddev: 0.00022042899129771261",
            "extra": "mean: 6.036321954022422 msec\nrounds: 174"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 257.0297463282214,
            "unit": "iter/sec",
            "range": "stddev: 0.000034132863791724445",
            "extra": "mean: 3.8906002682001706 msec\nrounds: 261"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 271.512111375441,
            "unit": "iter/sec",
            "range": "stddev: 0.00035565168438386497",
            "extra": "mean: 3.6830769534889067 msec\nrounds: 301"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 65.93833413530304,
            "unit": "iter/sec",
            "range": "stddev: 0.00021440302170623138",
            "extra": "mean: 15.165684925373409 msec\nrounds: 67"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 883.4395538195754,
            "unit": "iter/sec",
            "range": "stddev: 0.000022008705054998583",
            "extra": "mean: 1.1319393564352789 msec\nrounds: 909"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 25.917082068302914,
            "unit": "iter/sec",
            "range": "stddev: 0.00027472530780971817",
            "extra": "mean: 38.584590555547884 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 1975.4187479733082,
            "unit": "iter/sec",
            "range": "stddev: 0.000018369937665720313",
            "extra": "mean: 506.22178260986715 usec\nrounds: 2070"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 69.04722086145163,
            "unit": "iter/sec",
            "range": "stddev: 0.0001753982953586086",
            "extra": "mean: 14.482842140838285 msec\nrounds: 71"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 91070.38651365583,
            "unit": "iter/sec",
            "range": "stddev: 9.648738873026649e-7",
            "extra": "mean: 10.98051779817638 usec\nrounds: 92679"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_elements_3d",
            "value": 24829.2248036457,
            "unit": "iter/sec",
            "range": "stddev: 0.00000818324948442765",
            "extra": "mean: 40.27511965871641 usec\nrounds: 26233"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_with_refs",
            "value": 85461.56777760609,
            "unit": "iter/sec",
            "range": "stddev: 0.0000010783061053058152",
            "extra": "mean: 11.701166103133845 usec\nrounds: 87253"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 27.12460260083998,
            "unit": "iter/sec",
            "range": "stddev: 0.0002567549653669636",
            "extra": "mean: 36.8668995714257 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 27.15215640317296,
            "unit": "iter/sec",
            "range": "stddev: 0.00021966666279522287",
            "extra": "mean: 36.829487321424736 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 26.690793720679512,
            "unit": "iter/sec",
            "range": "stddev: 0.00021845173643430293",
            "extra": "mean: 37.466102000002316 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 3097.467018939087,
            "unit": "iter/sec",
            "range": "stddev: 0.000011254457698559669",
            "extra": "mean: 322.8444383380423 usec\nrounds: 3203"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 2785.2689942107068,
            "unit": "iter/sec",
            "range": "stddev: 0.00001096117662480827",
            "extra": "mean: 359.0317495647781 usec\nrounds: 2871"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 2094.82980803237,
            "unit": "iter/sec",
            "range": "stddev: 0.000012755817819666191",
            "extra": "mean: 477.3657488382215 usec\nrounds: 2150"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 92.10744425863093,
            "unit": "iter/sec",
            "range": "stddev: 0.00017333812879290488",
            "extra": "mean: 10.85688576041773 msec\nrounds: 96"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 91.64267889000702,
            "unit": "iter/sec",
            "range": "stddev: 0.0005071830777401889",
            "extra": "mean: 10.911946399998167 msec\nrounds: 95"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 90.87025872557221,
            "unit": "iter/sec",
            "range": "stddev: 0.0002192687114825127",
            "extra": "mean: 11.004700702129567 msec\nrounds: 94"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 26.868524517660894,
            "unit": "iter/sec",
            "range": "stddev: 0.0003008867390583853",
            "extra": "mean: 37.21827000000287 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 26.95738614138713,
            "unit": "iter/sec",
            "range": "stddev: 0.00035581728367781054",
            "extra": "mean: 37.095584666672124 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 7202.769654105655,
            "unit": "iter/sec",
            "range": "stddev: 0.0000061742445527723305",
            "extra": "mean: 138.83548246333123 usec\nrounds: 7470"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 1058989.2230308172,
            "unit": "iter/sec",
            "range": "stddev: 9.104262084220875e-8",
            "extra": "mean: 944.2966729519771 nsec\nrounds: 109076"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3397106.6182344332,
            "unit": "iter/sec",
            "range": "stddev: 4.503526848704077e-8",
            "extra": "mean: 294.3681527781211 nsec\nrounds: 194213"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1650524.3173411717,
            "unit": "iter/sec",
            "range": "stddev: 6.824300670680935e-8",
            "extra": "mean: 605.8680805205579 nsec\nrounds: 170620"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 157086.735644383,
            "unit": "iter/sec",
            "range": "stddev: 8.44533838146476e-7",
            "extra": "mean: 6.365909864368343 usec\nrounds: 165262"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 1144.0027699795055,
            "unit": "iter/sec",
            "range": "stddev: 0.00003855272376100123",
            "extra": "mean: 874.1237576006173 usec\nrounds: 1184"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 120.22818497475582,
            "unit": "iter/sec",
            "range": "stddev: 0.00018923114260272525",
            "extra": "mean: 8.317517229507947 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 18.407371633058077,
            "unit": "iter/sec",
            "range": "stddev: 0.0002317703880275105",
            "extra": "mean: 54.32606131578747 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 120.25332028240857,
            "unit": "iter/sec",
            "range": "stddev: 0.0003619155714150443",
            "extra": "mean: 8.31577870491686 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 110.43619030400781,
            "unit": "iter/sec",
            "range": "stddev: 0.00011989419671182856",
            "extra": "mean: 9.055002687499528 msec\nrounds: 112"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 120.72098530493504,
            "unit": "iter/sec",
            "range": "stddev: 0.00006718591131720742",
            "extra": "mean: 8.283563934423258 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 162.1835898420398,
            "unit": "iter/sec",
            "range": "stddev: 0.00006171174840364206",
            "extra": "mean: 6.165851927275497 msec\nrounds: 165"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 1188.8758704461075,
            "unit": "iter/sec",
            "range": "stddev: 0.00001844190541291348",
            "extra": "mean: 841.130705785765 usec\nrounds: 1227"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 120.85732673882005,
            "unit": "iter/sec",
            "range": "stddev: 0.00007062565539293316",
            "extra": "mean: 8.27421908943146 msec\nrounds: 123"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 121.17108508615563,
            "unit": "iter/sec",
            "range": "stddev: 0.000050506098332601116",
            "extra": "mean: 8.252793967215654 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 28145.646275250187,
            "unit": "iter/sec",
            "range": "stddev: 0.0000021550877379189327",
            "extra": "mean: 35.52947373176319 usec\nrounds: 28856"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 47.30880331357898,
            "unit": "iter/sec",
            "range": "stddev: 0.015125506705819733",
            "extra": "mean: 21.13771496969934 msec\nrounds: 66"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 3.3378301582575465,
            "unit": "iter/sec",
            "range": "stddev: 0.0012035506731881244",
            "extra": "mean: 299.59583099999065 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.2547356378830803,
            "unit": "iter/sec",
            "range": "stddev: 0.002652283787554224",
            "extra": "mean: 796.9806306666669 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.12353060688990157,
            "unit": "iter/sec",
            "range": "stddev: 0.10342898552119502",
            "extra": "mean: 8.095159776000003 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.232219258367596,
            "unit": "iter/sec",
            "range": "stddev: 0.003066305306242646",
            "extra": "mean: 811.543881666618 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 3.0726763168037037,
            "unit": "iter/sec",
            "range": "stddev: 0.0019418785235597107",
            "extra": "mean: 325.44918400003553 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 0.937483514352405,
            "unit": "iter/sec",
            "range": "stddev: 0.0018053005632604304",
            "extra": "mean: 1.0666854239999946 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 2.3178524301746006,
            "unit": "iter/sec",
            "range": "stddev: 0.0013120336392254213",
            "extra": "mean: 431.43385100002735 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 3.0576632699462465,
            "unit": "iter/sec",
            "range": "stddev: 0.0025663928475751652",
            "extra": "mean: 327.0471310000005 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.1857481210087302,
            "unit": "iter/sec",
            "range": "stddev: 0.016675961611701835",
            "extra": "mean: 843.3494283333024 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.2071996071135729,
            "unit": "iter/sec",
            "range": "stddev: 0.0012439108337946373",
            "extra": "mean: 828.3634239999552 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 11436.821101787804,
            "unit": "iter/sec",
            "range": "stddev: 0.000003753043263359172",
            "extra": "mean: 87.4368839994953 usec\nrounds: 11612"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 285.24264248502243,
            "unit": "iter/sec",
            "range": "stddev: 0.00003999025390144119",
            "extra": "mean: 3.50578718275795 msec\nrounds: 290"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 25.994903209034074,
            "unit": "iter/sec",
            "range": "stddev: 0.0020799345395110776",
            "extra": "mean: 38.46907957143181 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 16.425980230847447,
            "unit": "iter/sec",
            "range": "stddev: 0.0019466092386875395",
            "extra": "mean: 60.879167388868105 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.432053208611809,
            "unit": "iter/sec",
            "range": "stddev: 0.001915919645746922",
            "extra": "mean: 184.09245300002416 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 16.52077051845658,
            "unit": "iter/sec",
            "range": "stddev: 0.002050746245418283",
            "extra": "mean: 60.52986444444741 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 19.701576760079554,
            "unit": "iter/sec",
            "range": "stddev: 0.004808581570046956",
            "extra": "mean: 50.75735877273824 msec\nrounds: 22"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 16.262987777890597,
            "unit": "iter/sec",
            "range": "stddev: 0.00331016751885124",
            "extra": "mean: 61.489316333342636 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 16.338478327524253,
            "unit": "iter/sec",
            "range": "stddev: 0.002052054826664238",
            "extra": "mean: 61.2052101764809 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 25.940206057400758,
            "unit": "iter/sec",
            "range": "stddev: 0.0020697928898002786",
            "extra": "mean: 38.550194928567244 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 16.458035345369048,
            "unit": "iter/sec",
            "range": "stddev: 0.0020138243353941977",
            "extra": "mean: 60.76059377776093 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 16.86277823248118,
            "unit": "iter/sec",
            "range": "stddev: 0.002165253936171137",
            "extra": "mean: 59.30220905555138 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 21243.31043183842,
            "unit": "iter/sec",
            "range": "stddev: 0.000002559037959298815",
            "extra": "mean: 47.07364246305272 usec\nrounds: 21746"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 43.1452766032649,
            "unit": "iter/sec",
            "range": "stddev: 0.01715348930069385",
            "extra": "mean: 23.177508147539093 msec\nrounds: 61"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 171.32876862292846,
            "unit": "iter/sec",
            "range": "stddev: 0.00016099886627764356",
            "extra": "mean: 5.836731379310064 msec\nrounds: 174"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.108068709229846,
            "unit": "iter/sec",
            "range": "stddev: 0.0009823381286407113",
            "extra": "mean: 70.88142399999622 msec\nrounds: 15"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
            "value": 1.1095614893161798,
            "unit": "iter/sec",
            "range": "stddev: 0.010060047590383146",
            "extra": "mean: 901.2569466666491 msec\nrounds: 3"
          }
        ]
      }
    ]
  }
}