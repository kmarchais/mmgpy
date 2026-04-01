window.BENCHMARK_DATA = {
  "lastUpdate": 1775032413979,
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
          "id": "ccaecf7937f62dde8c7163a283bd31656d108402",
          "message": "feat: add set/get normal vectors at vertices for 3D and surface meshes (#209)\n\nExpose MMG3D_Set/Get_normalAtVertex and MMGS_Set/Get_normalAtVertex as\nbatch Python APIs on MmgMesh3D and MmgMeshS.\n\nset_normal_at_vertices(vertex_indices, normals) takes a 1D index array\nand an Nx3 normals array. get_normal_at_vertices(vertex_indices) returns\nthe Nx3 array. Both validate shapes and bounds.\n\nPartial fix for #207 (priority 2: normal vectors).",
          "timestamp": "2026-04-01T10:24:54+02:00",
          "tree_id": "97a473f8be7be5cce0543af20678773cab406536",
          "url": "https://github.com/kmarchais/mmgpy/commit/ccaecf7937f62dde8c7163a283bd31656d108402"
        },
        "date": 1775032412826,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 1.197710759372761,
            "unit": "iter/sec",
            "range": "stddev: 0.013339865693188001",
            "extra": "mean: 834.9261223333239 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.6024621044141931,
            "unit": "iter/sec",
            "range": "stddev: 0.009963387307768098",
            "extra": "mean: 1.659855437666664 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.1962377671469753,
            "unit": "iter/sec",
            "range": "stddev: 0.002239652333713337",
            "extra": "mean: 835.9542120000091 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.257741152582769,
            "unit": "iter/sec",
            "range": "stddev: 0.0008064870413777468",
            "extra": "mean: 795.0761553333147 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 1.207799819534908,
            "unit": "iter/sec",
            "range": "stddev: 0.005909525116876179",
            "extra": "mean: 827.9517713333272 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.5945531103637084,
            "unit": "iter/sec",
            "range": "stddev: 0.008211396763214992",
            "extra": "mean: 1.6819355286666753 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.2614179224729898,
            "unit": "iter/sec",
            "range": "stddev: 0.000378054266676529",
            "extra": "mean: 792.7586743333374 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.258817654712151,
            "unit": "iter/sec",
            "range": "stddev: 0.002754056534433647",
            "extra": "mean: 794.3962306666776 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 59.597245560598225,
            "unit": "iter/sec",
            "range": "stddev: 0.0006333003950892171",
            "extra": "mean: 16.779298952385382 msec\nrounds: 63"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.256137371001993,
            "unit": "iter/sec",
            "range": "stddev: 0.0037631998529071187",
            "extra": "mean: 796.0912740000102 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 119.26030191409019,
            "unit": "iter/sec",
            "range": "stddev: 0.00005440572318584917",
            "extra": "mean: 8.385019859503252 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 16.148263215534488,
            "unit": "iter/sec",
            "range": "stddev: 0.0004287525463519013",
            "extra": "mean: 61.92616423529738 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 1.1751421678964726,
            "unit": "iter/sec",
            "range": "stddev: 0.0033640930120693497",
            "extra": "mean: 850.9608686666562 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 17.941758923959682,
            "unit": "iter/sec",
            "range": "stddev: 0.0014663896104569344",
            "extra": "mean: 55.73589547369214 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 367.0723287327689,
            "unit": "iter/sec",
            "range": "stddev: 0.0002426738790861346",
            "extra": "mean: 2.7242587406472873 msec\nrounds: 401"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 29.88571503013301,
            "unit": "iter/sec",
            "range": "stddev: 0.00020647797824383148",
            "extra": "mean: 33.46080222580338 msec\nrounds: 31"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 165.4005941143513,
            "unit": "iter/sec",
            "range": "stddev: 0.0002574269006730385",
            "extra": "mean: 6.0459274971445405 msec\nrounds: 175"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 259.0399359457061,
            "unit": "iter/sec",
            "range": "stddev: 0.000040481662085727126",
            "extra": "mean: 3.8604086136339872 msec\nrounds: 264"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 270.43629919367794,
            "unit": "iter/sec",
            "range": "stddev: 0.00014183344175142104",
            "extra": "mean: 3.6977284594618403 msec\nrounds: 296"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 73.84288960793252,
            "unit": "iter/sec",
            "range": "stddev: 0.0012518620342727058",
            "extra": "mean: 13.542265278478157 msec\nrounds: 79"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 870.1661169888016,
            "unit": "iter/sec",
            "range": "stddev: 0.000019724907792301338",
            "extra": "mean: 1.149205859061126 msec\nrounds: 894"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 33.44338712672614,
            "unit": "iter/sec",
            "range": "stddev: 0.00018404609177459229",
            "extra": "mean: 29.9012775294179 msec\nrounds: 34"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 1692.9459514314794,
            "unit": "iter/sec",
            "range": "stddev: 0.000020062724432334435",
            "extra": "mean: 590.6863117245089 usec\nrounds: 1774"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 80.86435022816593,
            "unit": "iter/sec",
            "range": "stddev: 0.0005089063380334939",
            "extra": "mean: 12.366388862068531 msec\nrounds: 87"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 90124.21635057882,
            "unit": "iter/sec",
            "range": "stddev: 0.000001177161460237839",
            "extra": "mean: 11.095796895587403 usec\nrounds: 91997"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
            "value": 26893.7624020359,
            "unit": "iter/sec",
            "range": "stddev: 0.0000023696622665425632",
            "extra": "mean: 37.18334329912495 usec\nrounds: 27460"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
            "value": 5502.9017631869665,
            "unit": "iter/sec",
            "range": "stddev: 0.000005362132628404952",
            "extra": "mean: 181.7223063456719 usec\nrounds: 6114"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 35.545162722113275,
            "unit": "iter/sec",
            "range": "stddev: 0.00032291527715465633",
            "extra": "mean: 28.133223297297842 msec\nrounds: 37"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 35.07576403517332,
            "unit": "iter/sec",
            "range": "stddev: 0.0002442781379390926",
            "extra": "mean: 28.509713972223633 msec\nrounds: 36"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 34.749592835543076,
            "unit": "iter/sec",
            "range": "stddev: 0.00017627370312364932",
            "extra": "mean: 28.77731560000224 msec\nrounds: 35"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 3133.579037442343,
            "unit": "iter/sec",
            "range": "stddev: 0.000016212111979656213",
            "extra": "mean: 319.12391168413274 usec\nrounds: 3295"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 2822.6380450632855,
            "unit": "iter/sec",
            "range": "stddev: 0.00001508166016541984",
            "extra": "mean: 354.2785096902424 usec\nrounds: 2941"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 2110.9783703590865,
            "unit": "iter/sec",
            "range": "stddev: 0.000017777732035047298",
            "extra": "mean: 473.71399633521384 usec\nrounds: 2183"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 138.4570275889918,
            "unit": "iter/sec",
            "range": "stddev: 0.00040644312128364267",
            "extra": "mean: 7.2224575192274765 msec\nrounds: 156"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 138.12365980196577,
            "unit": "iter/sec",
            "range": "stddev: 0.0004301128977192574",
            "extra": "mean: 7.239889251658592 msec\nrounds: 151"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 136.79151827148397,
            "unit": "iter/sec",
            "range": "stddev: 0.00041148606094838764",
            "extra": "mean: 7.310394771811401 msec\nrounds: 149"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 34.96077468087984,
            "unit": "iter/sec",
            "range": "stddev: 0.00027515943087068876",
            "extra": "mean: 28.60348516667462 msec\nrounds: 36"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 35.22832091772113,
            "unit": "iter/sec",
            "range": "stddev: 0.00012309855280444093",
            "extra": "mean: 28.386252138885325 msec\nrounds: 36"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 7414.199685694329,
            "unit": "iter/sec",
            "range": "stddev: 0.000007984754941317004",
            "extra": "mean: 134.8763241337425 usec\nrounds: 7790"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 987636.2835942295,
            "unit": "iter/sec",
            "range": "stddev: 1.0522857485056318e-7",
            "extra": "mean: 1.0125184914843106 usec\nrounds: 102166"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3271019.502009872,
            "unit": "iter/sec",
            "range": "stddev: 4.534665903745359e-8",
            "extra": "mean: 305.7150834428079 nsec\nrounds: 189754"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1602494.6456506648,
            "unit": "iter/sec",
            "range": "stddev: 8.65116829368267e-8",
            "extra": "mean: 624.0270460273317 nsec\nrounds: 165810"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 161588.47394579725,
            "unit": "iter/sec",
            "range": "stddev: 9.355660798816818e-7",
            "extra": "mean: 6.188560208418313 usec\nrounds: 174826"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 1058.054349836573,
            "unit": "iter/sec",
            "range": "stddev: 0.000026382927726465317",
            "extra": "mean: 945.1310324034488 usec\nrounds: 1111"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 119.39866192107128,
            "unit": "iter/sec",
            "range": "stddev: 0.000041989037029724624",
            "extra": "mean: 8.37530323967158 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 18.37666577559677,
            "unit": "iter/sec",
            "range": "stddev: 0.0001894376687996983",
            "extra": "mean: 54.41683557895179 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 119.2205269331539,
            "unit": "iter/sec",
            "range": "stddev: 0.000047294084824029045",
            "extra": "mean: 8.38781731404939 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 108.21153078682015,
            "unit": "iter/sec",
            "range": "stddev: 0.000053769427317028726",
            "extra": "mean: 9.24115935454262 msec\nrounds: 110"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 117.35723546584194,
            "unit": "iter/sec",
            "range": "stddev: 0.00030612718668324184",
            "extra": "mean: 8.520991449999352 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 156.55661283448177,
            "unit": "iter/sec",
            "range": "stddev: 0.00011191810724806677",
            "extra": "mean: 6.387465734566205 msec\nrounds: 162"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 1090.6201496264057,
            "unit": "iter/sec",
            "range": "stddev: 0.00002359004945497391",
            "extra": "mean: 916.9095219289247 usec\nrounds: 1140"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 118.98236265344991,
            "unit": "iter/sec",
            "range": "stddev: 0.00008524944526738386",
            "extra": "mean: 8.40460701652578 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 119.46112920963134,
            "unit": "iter/sec",
            "range": "stddev: 0.00006352698285509197",
            "extra": "mean: 8.370923719004798 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 27384.53628817901,
            "unit": "iter/sec",
            "range": "stddev: 0.000002589735234808411",
            "extra": "mean: 36.51695940645402 usec\nrounds: 28502"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 50.354678211450945,
            "unit": "iter/sec",
            "range": "stddev: 0.013970273201450063",
            "extra": "mean: 19.859127999999696 msec\nrounds: 67"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 3.4086857577375755,
            "unit": "iter/sec",
            "range": "stddev: 0.001403217794698518",
            "extra": "mean: 293.36819849997653 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.24471163361677,
            "unit": "iter/sec",
            "range": "stddev: 0.0054025706620848095",
            "extra": "mean: 803.3989343333209 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.1275276496108479,
            "unit": "iter/sec",
            "range": "stddev: 0.04641408530067344",
            "extra": "mean: 7.841436763333377 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.2498526064444486,
            "unit": "iter/sec",
            "range": "stddev: 0.0037662422108751727",
            "extra": "mean: 800.094342999993 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 3.175447561392263,
            "unit": "iter/sec",
            "range": "stddev: 0.0007022941297772589",
            "extra": "mean: 314.91623800002344 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 1.0189785079980962,
            "unit": "iter/sec",
            "range": "stddev: 0.0022732738747704958",
            "extra": "mean: 981.3749673333328 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 2.4398168983126816,
            "unit": "iter/sec",
            "range": "stddev: 0.0013695051252248251",
            "extra": "mean: 409.86682266672386 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 3.350013620652731,
            "unit": "iter/sec",
            "range": "stddev: 0.0017501235086300135",
            "extra": "mean: 298.5062490000132 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.2469731374132444,
            "unit": "iter/sec",
            "range": "stddev: 0.006205176305744538",
            "extra": "mean: 801.9418943333676 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.2477286379068728,
            "unit": "iter/sec",
            "range": "stddev: 0.005238610917823814",
            "extra": "mean: 801.4563180000019 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 11375.809304072298,
            "unit": "iter/sec",
            "range": "stddev: 0.000003618405224857784",
            "extra": "mean: 87.90583362205459 usec\nrounds: 11552"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 288.9694702996016,
            "unit": "iter/sec",
            "range": "stddev: 0.00006310558056354427",
            "extra": "mean: 3.4605731842993888 msec\nrounds: 293"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 29.914647024301345,
            "unit": "iter/sec",
            "range": "stddev: 0.0013293730400297504",
            "extra": "mean: 33.42844056249916 msec\nrounds: 32"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 17.98182838193701,
            "unit": "iter/sec",
            "range": "stddev: 0.0013603346898205563",
            "extra": "mean: 55.61169747368479 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.577603844208999,
            "unit": "iter/sec",
            "range": "stddev: 0.0016917238993558361",
            "extra": "mean: 179.2884593333497 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 17.998112907329755,
            "unit": "iter/sec",
            "range": "stddev: 0.0012777179172597556",
            "extra": "mean: 55.56138052632999 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 21.983641898786725,
            "unit": "iter/sec",
            "range": "stddev: 0.001713708710903142",
            "extra": "mean: 45.48836833332833 msec\nrounds: 24"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 18.04204994298712,
            "unit": "iter/sec",
            "range": "stddev: 0.0014186348529421438",
            "extra": "mean: 55.426074263179636 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 17.682644208858203,
            "unit": "iter/sec",
            "range": "stddev: 0.0013679554611666998",
            "extra": "mean: 56.552628000004965 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 29.723635746768114,
            "unit": "iter/sec",
            "range": "stddev: 0.001539766488708928",
            "extra": "mean: 33.64325981247873 msec\nrounds: 32"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 17.997128395242324,
            "unit": "iter/sec",
            "range": "stddev: 0.0013274081297564896",
            "extra": "mean: 55.56441994737103 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 18.006178660991843,
            "unit": "iter/sec",
            "range": "stddev: 0.0014187110024364632",
            "extra": "mean: 55.53649215790445 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 21599.25842191767,
            "unit": "iter/sec",
            "range": "stddev: 0.000002745537189135063",
            "extra": "mean: 46.297885810063654 usec\nrounds: 22270"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 48.2981592131162,
            "unit": "iter/sec",
            "range": "stddev: 0.013875273280715503",
            "extra": "mean: 20.704722836071 msec\nrounds: 61"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 171.4013989708418,
            "unit": "iter/sec",
            "range": "stddev: 0.00003841032270337326",
            "extra": "mean: 5.834258098267427 msec\nrounds: 173"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.44974115547767,
            "unit": "iter/sec",
            "range": "stddev: 0.0001419001087897938",
            "extra": "mean: 69.20539193332995 msec\nrounds: 15"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
            "value": 1.1641120004401753,
            "unit": "iter/sec",
            "range": "stddev: 0.0015016449900313428",
            "extra": "mean: 859.023873666691 msec\nrounds: 3"
          }
        ]
      }
    ]
  }
}