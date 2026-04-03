window.BENCHMARK_DATA = {
  "lastUpdate": 1775214607806,
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
          "id": "f70de70c84da08f1f59dce98c632d7755067be25",
          "message": "fix: use MMGS_Get_triangleQuality directly and add API coverage docs (#217)\n\n* fix: use MMGS_Get_triangleQuality directly and add API coverage docs\n\nReplace the manual C++ reimplementation of triangle quality computation\nfor surface meshes with the official MMGS_Get_triangleQuality C API\nfunction. The workaround was needed because MMG v5.8.0 is missing\nLIBMMGS_EXPORT on this function's declaration, causing Windows DLL\nlink failures. Fixed by enabling WINDOWS_EXPORT_ALL_SYMBOLS on the\nlibmmgs target.\n\nAlso adds a comprehensive MMG C API binding coverage reference page\ndocumenting all 371 public functions and their binding status.\n\n* fix: use #ifdef _WIN32 fallback for MMGS_Get_triangleQuality\n\nThe conda-forge mmgsuite package has the same missing DLL export as\nthe MMG source (missing LIBMMGS_EXPORT on MMGS_Get_triangleQuality).\nSince the conda build uses pre-built system MMG libraries, the\nWINDOWS_EXPORT_ALL_SYMBOLS CMake fix only helps pip/FetchContent builds.\n\nUse a wrapper function with #ifdef _WIN32 that calls the C API on\nLinux/macOS and falls back to manual computation on Windows.\n\nAlso remove the lucide/check-square icon from the API coverage page\nfrontmatter since it doesn't exist in mkdocs-material (only in zensical).\n\n* build: switch docs from mkdocs-material to zensical\n\nUpdate docs dependency group to use zensical (Material for MkDocs fork)\nand restore the lucide/check-square icon which is available in zensical.\n\n* fix: fix infinite recursion in get_triangle_quality on non-Windows\n\nThe #else branch was calling get_triangle_quality (itself) instead of\nMMGS_Get_triangleQuality (the MMG C API function).\n\n* fix: pin mike git dependency to specific commit",
          "timestamp": "2026-04-03T13:00:18+02:00",
          "tree_id": "e9ce2c25da7b729e9f6e814307e47876657c6276",
          "url": "https://github.com/kmarchais/mmgpy/commit/f70de70c84da08f1f59dce98c632d7755067be25"
        },
        "date": 1775214607373,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 1.176294974776227,
            "unit": "iter/sec",
            "range": "stddev: 0.011995403593868465",
            "extra": "mean: 850.1268996666719 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.5930529721467961,
            "unit": "iter/sec",
            "range": "stddev: 0.020368532329079425",
            "extra": "mean: 1.6861900149999987 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.168178573608312,
            "unit": "iter/sec",
            "range": "stddev: 0.016624405864641395",
            "extra": "mean: 856.033505999998 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.240100284595153,
            "unit": "iter/sec",
            "range": "stddev: 0.00197388213192307",
            "extra": "mean: 806.3863966666721 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 1.1729210994637609,
            "unit": "iter/sec",
            "range": "stddev: 0.01826330875676664",
            "extra": "mean: 852.5722663333303 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.5942308461288136,
            "unit": "iter/sec",
            "range": "stddev: 0.009826412852054833",
            "extra": "mean: 1.6828476786666613 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.2480910608436004,
            "unit": "iter/sec",
            "range": "stddev: 0.0026262829848766127",
            "extra": "mean: 801.2235896666766 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.2097879105530338,
            "unit": "iter/sec",
            "range": "stddev: 0.00640647693112717",
            "extra": "mean: 826.5911663333346 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 58.861522346456404,
            "unit": "iter/sec",
            "range": "stddev: 0.0006534209362468304",
            "extra": "mean: 16.989027129030795 msec\nrounds: 62"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.2453395709127084,
            "unit": "iter/sec",
            "range": "stddev: 0.0007689412001091114",
            "extra": "mean: 802.9938366666537 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 118.64601698829361,
            "unit": "iter/sec",
            "range": "stddev: 0.0000751372513768875",
            "extra": "mean: 8.428432958677968 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 15.79308861462508,
            "unit": "iter/sec",
            "range": "stddev: 0.0007963329233922877",
            "extra": "mean: 63.31883676470712 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 1.1656883409022742,
            "unit": "iter/sec",
            "range": "stddev: 0.007840569211081365",
            "extra": "mean: 857.8622303333437 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 17.637083965927705,
            "unit": "iter/sec",
            "range": "stddev: 0.001196098679205933",
            "extra": "mean: 56.69871515789432 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 359.01777856931534,
            "unit": "iter/sec",
            "range": "stddev: 0.00023447333057878886",
            "extra": "mean: 2.7853773815463865 msec\nrounds: 401"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 31.000735768556883,
            "unit": "iter/sec",
            "range": "stddev: 0.00023778553870670141",
            "extra": "mean: 32.25729890624951 msec\nrounds: 32"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 163.4231511984064,
            "unit": "iter/sec",
            "range": "stddev: 0.0003736934743293127",
            "extra": "mean: 6.119084062856765 msec\nrounds: 175"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 254.5191459144413,
            "unit": "iter/sec",
            "range": "stddev: 0.0001439024778848578",
            "extra": "mean: 3.9289775093625297 msec\nrounds: 267"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 268.03181310433325,
            "unit": "iter/sec",
            "range": "stddev: 0.0002754911908325229",
            "extra": "mean: 3.730900404761815 msec\nrounds: 294"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 73.94667451768765,
            "unit": "iter/sec",
            "range": "stddev: 0.0003280978667193544",
            "extra": "mean: 13.523258571429135 msec\nrounds: 77"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 878.3813288036479,
            "unit": "iter/sec",
            "range": "stddev: 0.00002448387097020251",
            "extra": "mean: 1.1384577144439036 msec\nrounds: 900"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 33.52792169917196,
            "unit": "iter/sec",
            "range": "stddev: 0.0002750138188080015",
            "extra": "mean: 29.82588688235624 msec\nrounds: 34"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 1716.0347024318103,
            "unit": "iter/sec",
            "range": "stddev: 0.000017553279897137354",
            "extra": "mean: 582.7387981040767 usec\nrounds: 1793"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 79.17077570062348,
            "unit": "iter/sec",
            "range": "stddev: 0.0004434189638643721",
            "extra": "mean: 12.6309233571413 msec\nrounds: 84"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 90726.04545951741,
            "unit": "iter/sec",
            "range": "stddev: 0.000001106002593750083",
            "extra": "mean: 11.022193185375933 usec\nrounds: 92507"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
            "value": 27062.907864748875,
            "unit": "iter/sec",
            "range": "stddev: 0.0000020558223755988953",
            "extra": "mean: 36.95094425911867 usec\nrounds: 27574"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
            "value": 5867.890227883823,
            "unit": "iter/sec",
            "range": "stddev: 0.000005739775744412438",
            "extra": "mean: 170.4190025996169 usec\nrounds: 6539"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 34.643200640505746,
            "unit": "iter/sec",
            "range": "stddev: 0.0003408602946344624",
            "extra": "mean: 28.86569316666352 msec\nrounds: 36"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 35.07773568234042,
            "unit": "iter/sec",
            "range": "stddev: 0.0002603922873277535",
            "extra": "mean: 28.508111500008855 msec\nrounds: 36"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 34.68026007756078,
            "unit": "iter/sec",
            "range": "stddev: 0.0002767081740513787",
            "extra": "mean: 28.834847194442798 msec\nrounds: 36"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 3155.6169761743527,
            "unit": "iter/sec",
            "range": "stddev: 0.000020935277177080576",
            "extra": "mean: 316.89524031282446 usec\nrounds: 3200"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 2723.3774662297274,
            "unit": "iter/sec",
            "range": "stddev: 0.000026875875240797473",
            "extra": "mean: 367.1911119189844 usec\nrounds: 3574"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 2100.4700331228146,
            "unit": "iter/sec",
            "range": "stddev: 0.000011150601054957926",
            "extra": "mean: 476.08391656665447 usec\nrounds: 2505"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 134.4076053368879,
            "unit": "iter/sec",
            "range": "stddev: 0.0004690593370198415",
            "extra": "mean: 7.440055177633254 msec\nrounds: 152"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 131.45915959124673,
            "unit": "iter/sec",
            "range": "stddev: 0.0006837446040548722",
            "extra": "mean: 7.606925246664862 msec\nrounds: 150"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 133.95969507584823,
            "unit": "iter/sec",
            "range": "stddev: 0.000435178991883315",
            "extra": "mean: 7.464931891893291 msec\nrounds: 148"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 34.75925386902067,
            "unit": "iter/sec",
            "range": "stddev: 0.00042452952371853267",
            "extra": "mean: 28.769317194442262 msec\nrounds: 36"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 34.90977458210795,
            "unit": "iter/sec",
            "range": "stddev: 0.000280643190894177",
            "extra": "mean: 28.645272333340206 msec\nrounds: 36"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 7398.760614501777,
            "unit": "iter/sec",
            "range": "stddev: 0.00000557899750092782",
            "extra": "mean: 135.15777197061522 usec\nrounds: 9911"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 977910.8431785917,
            "unit": "iter/sec",
            "range": "stddev: 1.0395099053625892e-7",
            "extra": "mean: 1.022588109105744 usec\nrounds: 101338"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3329556.8043772867,
            "unit": "iter/sec",
            "range": "stddev: 4.747393263851696e-8",
            "extra": "mean: 300.34027312143303 nsec\nrounds: 198453"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1602092.409839688,
            "unit": "iter/sec",
            "range": "stddev: 7.875383235814964e-8",
            "extra": "mean: 624.1837199016904 nsec\nrounds: 166639"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 148598.71772350365,
            "unit": "iter/sec",
            "range": "stddev: 8.877608373552307e-7",
            "extra": "mean: 6.729533170405221 usec\nrounds: 166639"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 1064.1107418187444,
            "unit": "iter/sec",
            "range": "stddev: 0.00001990498717260199",
            "extra": "mean: 939.7518140741928 usec\nrounds: 1151"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 118.48297539574301,
            "unit": "iter/sec",
            "range": "stddev: 0.00012656634146757106",
            "extra": "mean: 8.440031123964575 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 17.914147256356504,
            "unit": "iter/sec",
            "range": "stddev: 0.0009731114441904259",
            "extra": "mean: 55.82180305262191 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 115.42718015621817,
            "unit": "iter/sec",
            "range": "stddev: 0.00047647632397362433",
            "extra": "mean: 8.663470758330996 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 106.7522572443876,
            "unit": "iter/sec",
            "range": "stddev: 0.00011227252869404027",
            "extra": "mean: 9.367483422019857 msec\nrounds: 109"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 118.34354551181802,
            "unit": "iter/sec",
            "range": "stddev: 0.0000622125138626477",
            "extra": "mean: 8.449974991666426 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 160.20600992418926,
            "unit": "iter/sec",
            "range": "stddev: 0.00006170267399914293",
            "extra": "mean: 6.241963085362452 msec\nrounds: 164"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 1049.3135349278004,
            "unit": "iter/sec",
            "range": "stddev: 0.000019008776065829796",
            "extra": "mean: 953.004003773578 usec\nrounds: 1325"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 118.55699866603086,
            "unit": "iter/sec",
            "range": "stddev: 0.00007355455603906487",
            "extra": "mean: 8.434761433333431 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 119.4229387665207,
            "unit": "iter/sec",
            "range": "stddev: 0.00007182115137963279",
            "extra": "mean: 8.373600669424677 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 27959.509127730707,
            "unit": "iter/sec",
            "range": "stddev: 0.000009244323455766535",
            "extra": "mean: 35.766007029364594 usec\nrounds: 29306"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 49.54528029462362,
            "unit": "iter/sec",
            "range": "stddev: 0.014943104650578612",
            "extra": "mean: 20.183557223885852 msec\nrounds: 67"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 3.3914266891939575,
            "unit": "iter/sec",
            "range": "stddev: 0.0014853019003163268",
            "extra": "mean: 294.861157750006 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.2571935572925188,
            "unit": "iter/sec",
            "range": "stddev: 0.0029101848019894767",
            "extra": "mean: 795.4224663333397 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.1306219921946534,
            "unit": "iter/sec",
            "range": "stddev: 0.014539666362657215",
            "extra": "mean: 7.655678673999982 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.2529255037876352,
            "unit": "iter/sec",
            "range": "stddev: 0.0038397313397686033",
            "extra": "mean: 798.1320493333138 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 3.1522530351085902,
            "unit": "iter/sec",
            "range": "stddev: 0.001660123632787354",
            "extra": "mean: 317.23341650000236 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 1.0130315815350825,
            "unit": "iter/sec",
            "range": "stddev: 0.0029583816574859827",
            "extra": "mean: 987.1360560000161 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 2.4082297514181707,
            "unit": "iter/sec",
            "range": "stddev: 0.0014833168267642384",
            "extra": "mean: 415.2427730000075 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 3.2874636489115483,
            "unit": "iter/sec",
            "range": "stddev: 0.0024001031204999696",
            "extra": "mean: 304.18587300002287 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.2581402106737494,
            "unit": "iter/sec",
            "range": "stddev: 0.0022221070984382914",
            "extra": "mean: 794.8239723333282 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.216267662694721,
            "unit": "iter/sec",
            "range": "stddev: 0.020715093939523227",
            "extra": "mean: 822.1874433333483 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 11387.920358260424,
            "unit": "iter/sec",
            "range": "stddev: 0.0000035040794918709983",
            "extra": "mean: 87.8123457611497 usec\nrounds: 11560"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 279.536690124952,
            "unit": "iter/sec",
            "range": "stddev: 0.0005420846544617029",
            "extra": "mean: 3.5773479307957867 msec\nrounds: 289"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 28.392676141138555,
            "unit": "iter/sec",
            "range": "stddev: 0.001446535737253673",
            "extra": "mean: 35.22035031249082 msec\nrounds: 32"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 17.635967257956388,
            "unit": "iter/sec",
            "range": "stddev: 0.0016602884316481207",
            "extra": "mean: 56.7023053157946 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.577707410206167,
            "unit": "iter/sec",
            "range": "stddev: 0.001438038939858952",
            "extra": "mean: 179.28513033333124 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 17.564400526261643,
            "unit": "iter/sec",
            "range": "stddev: 0.0018413125311519773",
            "extra": "mean: 56.9333407368408 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 21.443430054075943,
            "unit": "iter/sec",
            "range": "stddev: 0.001840343296503886",
            "extra": "mean: 46.634330304349845 msec\nrounds: 23"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 17.671818759555393,
            "unit": "iter/sec",
            "range": "stddev: 0.001624517525473373",
            "extra": "mean: 56.587271157887265 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 17.238511569750926,
            "unit": "iter/sec",
            "range": "stddev: 0.0016649638612800585",
            "extra": "mean: 58.009648684213445 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 29.043305324891914,
            "unit": "iter/sec",
            "range": "stddev: 0.0015565873297294919",
            "extra": "mean: 34.43134274193433 msec\nrounds: 31"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 17.666901428485147,
            "unit": "iter/sec",
            "range": "stddev: 0.0014834299223452693",
            "extra": "mean: 56.603021421043 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 17.06429963539276,
            "unit": "iter/sec",
            "range": "stddev: 0.0015552406239270763",
            "extra": "mean: 58.601877684210244 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 17441.613972325802,
            "unit": "iter/sec",
            "range": "stddev: 0.000005838736778620915",
            "extra": "mean: 57.334143593974524 usec\nrounds: 18037"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 45.62223408993879,
            "unit": "iter/sec",
            "range": "stddev: 0.016106709194613118",
            "extra": "mean: 21.919137016144788 msec\nrounds: 62"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 172.50108613970448,
            "unit": "iter/sec",
            "range": "stddev: 0.000029860418729201552",
            "extra": "mean: 5.797064948275885 msec\nrounds: 174"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.530434690500421,
            "unit": "iter/sec",
            "range": "stddev: 0.00011878186485815536",
            "extra": "mean: 68.82106566665698 msec\nrounds: 15"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
            "value": 1.1257521427281965,
            "unit": "iter/sec",
            "range": "stddev: 0.007682249781324232",
            "extra": "mean: 888.2950003333386 msec\nrounds: 3"
          }
        ]
      }
    ]
  }
}