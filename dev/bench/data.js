window.BENCHMARK_DATA = {
  "lastUpdate": 1774950086437,
  "repoUrl": "https://github.com/kmarchais/mmgpy",
  "entries": {
    "Benchmark": [
      {
        "commit": {
          "author": {
            "email": "yves.chemisky@gmail.com",
            "name": "Yves Chemisky",
            "username": "chemiskyy"
          },
          "committer": {
            "email": "noreply@github.com",
            "name": "GitHub",
            "username": "web-flow"
          },
          "distinct": true,
          "id": "28a6af449894321a4acb2e7cbcd2dd25605d8cf1",
          "message": "Add set_required_triangles API and tests (#206)\n\n* Add set_required_triangles API and tests\n\nExpose a new set_required_triangles method for MmgMesh, MmgMesh2D and MmgMeshS in the pybind11 bindings and implement the corresponding C++ methods and headers. The implementations validate a 1D int array, check bounds against mesh->nt, and call the underlying MMG*_Set_requiredTriangle API (converting to 1-based indices). Updated type stubs (_mmgpy.pyi) to include the new method signatures and added unit tests for 3D, 2D and surface meshes to exercise setting required triangles.\n\n* fix: resolve ty type checker errors and clang-format issue\n\n- Use cast(\"MmgMesh3D\", self._impl) for tetrahedra-only methods\n  instead of type: ignore suppression comments\n- Preserve dict[str, Any] type for kwargs by using update() instead\n  of reassignment from options.to_dict()\n- Pass named arguments directly in remesh_optimize/remesh_uniform\n  instead of dict spreading\n- Use dict[str, Any] for filtered_options in lagrangian.py\n- Fix clang-format: join split function signature in mmg_mesh.cpp\n\n---------\n\nCo-authored-by: Kevin Marchais <kevinmarchais@gmail.com>",
          "timestamp": "2026-03-31T11:32:19+02:00",
          "tree_id": "17b415ddf7a993b88914e8f99b8cb42df26bc9ec",
          "url": "https://github.com/kmarchais/mmgpy/commit/28a6af449894321a4acb2e7cbcd2dd25605d8cf1"
        },
        "date": 1774950085765,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 1.1536459150809704,
            "unit": "iter/sec",
            "range": "stddev: 0.013693892080915421",
            "extra": "mean: 866.817094333328 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.5689899638951791,
            "unit": "iter/sec",
            "range": "stddev: 0.019365735865570388",
            "extra": "mean: 1.75750024333333 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.1707637654560463,
            "unit": "iter/sec",
            "range": "stddev: 0.0023839328993145795",
            "extra": "mean: 854.1432776666701 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.1868510082333812,
            "unit": "iter/sec",
            "range": "stddev: 0.03018621630798407",
            "extra": "mean: 842.5657416666752 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 1.1313253846107643,
            "unit": "iter/sec",
            "range": "stddev: 0.006878888880430754",
            "extra": "mean: 883.918997666664 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.5600058559289697,
            "unit": "iter/sec",
            "range": "stddev: 0.01471686672576504",
            "extra": "mean: 1.785695612666662 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.2371832694998675,
            "unit": "iter/sec",
            "range": "stddev: 0.0019486172189241452",
            "extra": "mean: 808.2876843333414 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.2129797748888385,
            "unit": "iter/sec",
            "range": "stddev: 0.034750319962281166",
            "extra": "mean: 824.4160543333408 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 27.002203973892367,
            "unit": "iter/sec",
            "range": "stddev: 0.0007812456036455976",
            "extra": "mean: 37.03401400000053 msec\nrounds: 31"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.0620452424051292,
            "unit": "iter/sec",
            "range": "stddev: 0.0010058982086671307",
            "extra": "mean: 941.579473333339 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 115.88002022510035,
            "unit": "iter/sec",
            "range": "stddev: 0.00013652164536466887",
            "extra": "mean: 8.629615338843319 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 12.967259087939281,
            "unit": "iter/sec",
            "range": "stddev: 0.0006446821836733622",
            "extra": "mean: 77.11729928571336 msec\nrounds: 14"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 1.0194242777129294,
            "unit": "iter/sec",
            "range": "stddev: 0.0039126951379455",
            "extra": "mean: 980.945835666669 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 19.560366639065172,
            "unit": "iter/sec",
            "range": "stddev: 0.0012724509076981981",
            "extra": "mean: 51.12378609523814 msec\nrounds: 21"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 410.1935528225422,
            "unit": "iter/sec",
            "range": "stddev: 0.00010546364011424",
            "extra": "mean: 2.4378735187791203 msec\nrounds: 426"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 36.02885338979629,
            "unit": "iter/sec",
            "range": "stddev: 0.00014535384879840114",
            "extra": "mean: 27.755532189187278 msec\nrounds: 37"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 154.8601828888999,
            "unit": "iter/sec",
            "range": "stddev: 0.0032792680579267577",
            "extra": "mean: 6.457437808383721 msec\nrounds: 167"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 274.1942827218867,
            "unit": "iter/sec",
            "range": "stddev: 0.0003873577385408884",
            "extra": "mean: 3.647049056140579 msec\nrounds: 285"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 278.96126944399896,
            "unit": "iter/sec",
            "range": "stddev: 0.0012245368454842922",
            "extra": "mean: 3.584727019607818 msec\nrounds: 306"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 81.16545283404498,
            "unit": "iter/sec",
            "range": "stddev: 0.0018667710827335714",
            "extra": "mean: 12.320512793104857 msec\nrounds: 87"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 896.3685152565366,
            "unit": "iter/sec",
            "range": "stddev: 0.00004056704433685703",
            "extra": "mean: 1.1156125889961725 msec\nrounds: 927"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 41.13363337719797,
            "unit": "iter/sec",
            "range": "stddev: 0.00014541469599349408",
            "extra": "mean: 24.311005809526673 msec\nrounds: 42"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 1921.746883770214,
            "unit": "iter/sec",
            "range": "stddev: 0.000040747043916623045",
            "extra": "mean: 520.3598915368771 usec\nrounds: 2056"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 90.96495760633766,
            "unit": "iter/sec",
            "range": "stddev: 0.00028214422319513025",
            "extra": "mean: 10.993244281249778 msec\nrounds: 96"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 82729.28547604298,
            "unit": "iter/sec",
            "range": "stddev: 0.0000010776181338401206",
            "extra": "mean: 12.087617997010058 usec\nrounds: 84481"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
            "value": 24865.805232167735,
            "unit": "iter/sec",
            "range": "stddev: 0.0000021349558115328763",
            "extra": "mean: 40.21587037552866 usec\nrounds: 25273"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
            "value": 8774.247347742827,
            "unit": "iter/sec",
            "range": "stddev: 0.000014434694403560318",
            "extra": "mean: 113.96988942387746 usec\nrounds: 9134"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 43.68328590289516,
            "unit": "iter/sec",
            "range": "stddev: 0.0010110326875833518",
            "extra": "mean: 22.892050800000003 msec\nrounds: 45"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 43.19779403725698,
            "unit": "iter/sec",
            "range": "stddev: 0.0013921683215853537",
            "extra": "mean: 23.149330244445487 msec\nrounds: 45"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 41.58884806380713,
            "unit": "iter/sec",
            "range": "stddev: 0.003146782542148768",
            "extra": "mean: 24.044907386368664 msec\nrounds: 44"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 3484.44325811302,
            "unit": "iter/sec",
            "range": "stddev: 0.000036146000715721627",
            "extra": "mean: 286.98989362838535 usec\nrounds: 3751"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 3115.504547205117,
            "unit": "iter/sec",
            "range": "stddev: 0.000008899258684224483",
            "extra": "mean: 320.97529785250623 usec\nrounds: 3260"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 2212.1142860997725,
            "unit": "iter/sec",
            "range": "stddev: 0.000009733766870507097",
            "extra": "mean: 452.0562098819596 usec\nrounds: 2287"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 163.75688806794662,
            "unit": "iter/sec",
            "range": "stddev: 0.0002899215791141111",
            "extra": "mean: 6.106613357143647 msec\nrounds: 182"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 156.57896247649578,
            "unit": "iter/sec",
            "range": "stddev: 0.0012636142661247116",
            "extra": "mean: 6.386554005619439 msec\nrounds: 178"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 155.376415964778,
            "unit": "iter/sec",
            "range": "stddev: 0.0004345387749555678",
            "extra": "mean: 6.435983181814981 msec\nrounds: 176"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 43.7507088343995,
            "unit": "iter/sec",
            "range": "stddev: 0.0001938054339850249",
            "extra": "mean: 22.8567725333341 msec\nrounds: 45"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 37.66045992158588,
            "unit": "iter/sec",
            "range": "stddev: 0.007151861040074152",
            "extra": "mean: 26.55304800000143 msec\nrounds: 45"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 8616.281840214313,
            "unit": "iter/sec",
            "range": "stddev: 0.000010977792769574884",
            "extra": "mean: 116.05934189997748 usec\nrounds: 9611"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 992426.5142204666,
            "unit": "iter/sec",
            "range": "stddev: 1.1046440008796438e-7",
            "extra": "mean: 1.0076312811790222 usec\nrounds: 104232"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3748270.3266801992,
            "unit": "iter/sec",
            "range": "stddev: 4.46510614423562e-8",
            "extra": "mean: 266.7897224172966 nsec\nrounds: 197707"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1748649.0732327863,
            "unit": "iter/sec",
            "range": "stddev: 1.0585121781265644e-7",
            "extra": "mean: 571.8700311614075 nsec\nrounds: 183554"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 154789.0283365555,
            "unit": "iter/sec",
            "range": "stddev: 8.148415211226474e-7",
            "extra": "mean: 6.460406210611485 usec\nrounds: 158504"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 1131.8221191931045,
            "unit": "iter/sec",
            "range": "stddev: 0.00007905834081996532",
            "extra": "mean: 883.5310629137706 usec\nrounds: 1208"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 119.01094789186008,
            "unit": "iter/sec",
            "range": "stddev: 0.00038880316637031375",
            "extra": "mean: 8.40258831404868 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 17.95729221162866,
            "unit": "iter/sec",
            "range": "stddev: 0.00012702976943269664",
            "extra": "mean: 55.687683210524746 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 117.57284366665398,
            "unit": "iter/sec",
            "range": "stddev: 0.0001169374036398304",
            "extra": "mean: 8.50536542975204 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 108.14717022830895,
            "unit": "iter/sec",
            "range": "stddev: 0.00008465333927723482",
            "extra": "mean: 9.246658954542267 msec\nrounds: 110"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 113.88772402268957,
            "unit": "iter/sec",
            "range": "stddev: 0.0002754468965569676",
            "extra": "mean: 8.78057761344649 msec\nrounds: 119"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 156.4980297220059,
            "unit": "iter/sec",
            "range": "stddev: 0.00004992595617948714",
            "extra": "mean: 6.389856803797098 msec\nrounds: 158"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 1173.6081177833307,
            "unit": "iter/sec",
            "range": "stddev: 0.00004480709004660706",
            "extra": "mean: 852.0731791535017 usec\nrounds: 1228"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 118.17699947882352,
            "unit": "iter/sec",
            "range": "stddev: 0.00009436673466844187",
            "extra": "mean: 8.46188348333546 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 118.52886680331966,
            "unit": "iter/sec",
            "range": "stddev: 0.00006003892022218752",
            "extra": "mean: 8.436763355371864 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 29253.430531898583,
            "unit": "iter/sec",
            "range": "stddev: 0.0000021194141623121828",
            "extra": "mean: 34.18402497818429 usec\nrounds: 29746"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 46.18214496040971,
            "unit": "iter/sec",
            "range": "stddev: 0.01961501347804262",
            "extra": "mean: 21.65339008955223 msec\nrounds: 67"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 3.968495945719412,
            "unit": "iter/sec",
            "range": "stddev: 0.012966195818982616",
            "extra": "mean: 251.98463440000296 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.2269994565349527,
            "unit": "iter/sec",
            "range": "stddev: 0.003256560926837487",
            "extra": "mean: 814.996285999996 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.11630966534949706,
            "unit": "iter/sec",
            "range": "stddev: 0.09528873491503427",
            "extra": "mean: 8.597737746000007 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.2406146663078603,
            "unit": "iter/sec",
            "range": "stddev: 0.0022497850790321426",
            "extra": "mean: 806.0520540000198 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 3.8471928693696413,
            "unit": "iter/sec",
            "range": "stddev: 0.0031029242162765513",
            "extra": "mean: 259.92978099999675 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 0.9362548594482513,
            "unit": "iter/sec",
            "range": "stddev: 0.02004117250672729",
            "extra": "mean: 1.0680852440000308 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 2.6864998268604765,
            "unit": "iter/sec",
            "range": "stddev: 0.0020865326332728",
            "extra": "mean: 372.23155199999763 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 4.0165792986360405,
            "unit": "iter/sec",
            "range": "stddev: 0.0013604306531611384",
            "extra": "mean: 248.96807100001297 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.2389093260426742,
            "unit": "iter/sec",
            "range": "stddev: 0.0035220531927995205",
            "extra": "mean: 807.1615726666627 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.2423688389607996,
            "unit": "iter/sec",
            "range": "stddev: 0.0013727600672816323",
            "extra": "mean: 804.9139423333145 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 11489.667572665081,
            "unit": "iter/sec",
            "range": "stddev: 0.000003412863072230721",
            "extra": "mean: 87.03471999303854 usec\nrounds: 11664"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 289.052803312872,
            "unit": "iter/sec",
            "range": "stddev: 0.00011657177663552582",
            "extra": "mean: 3.4595755119440774 msec\nrounds: 293"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 34.929527628182086,
            "unit": "iter/sec",
            "range": "stddev: 0.0012980862464071628",
            "extra": "mean: 28.62907310527649 msec\nrounds: 38"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 19.742745408806062,
            "unit": "iter/sec",
            "range": "stddev: 0.0011942596660046035",
            "extra": "mean: 50.65151676189674 msec\nrounds: 21"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.597263841753112,
            "unit": "iter/sec",
            "range": "stddev: 0.000927682551580926",
            "extra": "mean: 178.65872116666046 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 19.028864832741505,
            "unit": "iter/sec",
            "range": "stddev: 0.004350115478658842",
            "extra": "mean: 52.551742249983135 msec\nrounds: 20"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 22.835449441142565,
            "unit": "iter/sec",
            "range": "stddev: 0.0019026017932289086",
            "extra": "mean: 43.79156200001489 msec\nrounds: 25"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 19.368093164267954,
            "unit": "iter/sec",
            "range": "stddev: 0.000592252467949631",
            "extra": "mean: 51.63130885000555 msec\nrounds: 20"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 19.380914595986493,
            "unit": "iter/sec",
            "range": "stddev: 0.0014004525385625957",
            "extra": "mean: 51.59715219048979 msec\nrounds: 21"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 34.645400890120285,
            "unit": "iter/sec",
            "range": "stddev: 0.0013441764944850617",
            "extra": "mean: 28.863859972974552 msec\nrounds: 37"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 19.041871442240506,
            "unit": "iter/sec",
            "range": "stddev: 0.001336431309749839",
            "extra": "mean: 52.515846619030526 msec\nrounds: 21"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 18.67085075702457,
            "unit": "iter/sec",
            "range": "stddev: 0.0027756451678898992",
            "extra": "mean: 53.55942334999213 msec\nrounds: 20"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 20585.212393984133,
            "unit": "iter/sec",
            "range": "stddev: 0.0000038513263543417985",
            "extra": "mean: 48.57856119532885 usec\nrounds: 20982"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 42.371186964440355,
            "unit": "iter/sec",
            "range": "stddev: 0.021240327802814814",
            "extra": "mean: 23.600943746023475 msec\nrounds: 63"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 161.69714691213025,
            "unit": "iter/sec",
            "range": "stddev: 0.00036427901313085823",
            "extra": "mean: 6.184401018178891 msec\nrounds: 165"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 13.690971686064263,
            "unit": "iter/sec",
            "range": "stddev: 0.0005999368902017275",
            "extra": "mean: 73.04083471430138 msec\nrounds: 14"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
            "value": 0.999562857510432,
            "unit": "iter/sec",
            "range": "stddev: 0.03566433195343142",
            "extra": "mean: 1.0004373336666958 sec\nrounds: 3"
          }
        ]
      }
    ]
  }
}