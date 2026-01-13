window.BENCHMARK_DATA = {
  "lastUpdate": 1768292137752,
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
          "id": "f8e12ab89c7f65719c89d83a7877f2c4f376e63b",
          "message": "feat: add solution field transfer during remeshing (#156)\n\n* feat: add solution field transfer during remeshing (#123)\n\nAdd support for transferring user-defined solution fields (temperature,\nvelocity, etc.) to the new mesh after remeshing via barycentric\ninterpolation.\n\nNew features:\n- `Mesh.set_user_field()` / `get_user_field()` for arbitrary field storage\n- `transfer_fields` parameter on `Mesh.remesh()` to enable field transfer\n- `interpolate_field()` and `transfer_fields()` standalone functions\n- Linear (barycentric) and nearest-neighbor interpolation methods\n\nImplementation:\n- Point location using scipy.spatial.Delaunay.find_simplex()\n- Vectorized barycentric coordinate computation for tetrahedra/triangles\n- Fallback to nearest-neighbor for points outside the mesh\n\nCloses #123\n\n* fix: improve field transfer robustness and documentation\n\n- Clear user fields when transfer_fields=False to avoid stale data\n- Add validation for interpolation parameter (linear/nearest only)\n- Optimize KDTree construction to avoid repeated builds\n- Document memory implications for large meshes\n- Document surface mesh limitations for field transfer\n- Add test for invalid interpolation method",
          "timestamp": "2026-01-13T09:05:19+01:00",
          "tree_id": "9d33dff544f192fbe13547439aa1f7d7550065a1",
          "url": "https://github.com/kmarchais/mmgpy/commit/f8e12ab89c7f65719c89d83a7877f2c4f376e63b"
        },
        "date": 1768292137177,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 0.5943202482723813,
            "unit": "iter/sec",
            "range": "stddev: 0.008239306290296745",
            "extra": "mean: 1.6825945320000149 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.5986091558102944,
            "unit": "iter/sec",
            "range": "stddev: 0.048854991781373064",
            "extra": "mean: 1.6705390993333065 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.143692946691496,
            "unit": "iter/sec",
            "range": "stddev: 0.0009691289594506937",
            "extra": "mean: 874.3605553333396 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.1957297339257966,
            "unit": "iter/sec",
            "range": "stddev: 0.013655151651770881",
            "extra": "mean: 836.309386333331 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 0.6018993441808654,
            "unit": "iter/sec",
            "range": "stddev: 0.030488909991448175",
            "extra": "mean: 1.6614073593333387 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.5991554417534305,
            "unit": "iter/sec",
            "range": "stddev: 0.021738404731252547",
            "extra": "mean: 1.6690159686666561 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.177505833355065,
            "unit": "iter/sec",
            "range": "stddev: 0.013535346473911098",
            "extra": "mean: 849.2526930000016 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.2019750469339319,
            "unit": "iter/sec",
            "range": "stddev: 0.002656187624904391",
            "extra": "mean: 831.9640266666587 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 1.2451310266632345,
            "unit": "iter/sec",
            "range": "stddev: 0.013421154822402796",
            "extra": "mean: 803.1283283333247 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.2308802054136359,
            "unit": "iter/sec",
            "range": "stddev: 0.017512789517873516",
            "extra": "mean: 812.4267459999904 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 117.94920202630071,
            "unit": "iter/sec",
            "range": "stddev: 0.00011845243565490443",
            "extra": "mean: 8.478226073772136 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 1.188208100661239,
            "unit": "iter/sec",
            "range": "stddev: 0.023161296589318887",
            "extra": "mean: 841.6034190000042 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 1.1884911164902248,
            "unit": "iter/sec",
            "range": "stddev: 0.014238689230631044",
            "extra": "mean: 841.4030076666753 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 15.354513978546805,
            "unit": "iter/sec",
            "range": "stddev: 0.003646376472054993",
            "extra": "mean: 65.12742776470759 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 366.75637488056344,
            "unit": "iter/sec",
            "range": "stddev: 0.00018985381283816307",
            "extra": "mean: 2.7266056393039015 msec\nrounds: 402"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 24.40136971291081,
            "unit": "iter/sec",
            "range": "stddev: 0.00028098244754075385",
            "extra": "mean: 40.98130604000062 msec\nrounds: 25"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 163.81718729424534,
            "unit": "iter/sec",
            "range": "stddev: 0.00014065949721830376",
            "extra": "mean: 6.104365582860478 msec\nrounds: 175"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 261.8561984209184,
            "unit": "iter/sec",
            "range": "stddev: 0.000047508947716539746",
            "extra": "mean: 3.818889932834658 msec\nrounds: 268"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 272.7330006161441,
            "unit": "iter/sec",
            "range": "stddev: 0.0004453546791243515",
            "extra": "mean: 3.666589660000265 msec\nrounds: 300"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 64.25773614541774,
            "unit": "iter/sec",
            "range": "stddev: 0.0002176098259472934",
            "extra": "mean: 15.562328522389295 msec\nrounds: 67"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 882.3847943139855,
            "unit": "iter/sec",
            "range": "stddev: 0.00003504722885800603",
            "extra": "mean: 1.1332924212247504 msec\nrounds: 914"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 26.522720436500194,
            "unit": "iter/sec",
            "range": "stddev: 0.00042831131230489593",
            "extra": "mean: 37.703522999994156 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 1943.5150517731004,
            "unit": "iter/sec",
            "range": "stddev: 0.000020001614800424156",
            "extra": "mean: 514.5316467128381 usec\nrounds: 2038"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 67.25102841253997,
            "unit": "iter/sec",
            "range": "stddev: 0.0005986762778233713",
            "extra": "mean: 14.869661083331998 msec\nrounds: 72"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 90632.34087202704,
            "unit": "iter/sec",
            "range": "stddev: 9.594416015460105e-7",
            "extra": "mean: 11.033589007835527 usec\nrounds: 92593"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
            "value": 25635.990009567624,
            "unit": "iter/sec",
            "range": "stddev: 0.0000019147794553823985",
            "extra": "mean: 39.007660699929644 usec\nrounds: 26089"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
            "value": 6376.323435805258,
            "unit": "iter/sec",
            "range": "stddev: 0.000005102687354884671",
            "extra": "mean: 156.83018750031636 usec\nrounds: 6512"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 26.44762381910053,
            "unit": "iter/sec",
            "range": "stddev: 0.002136006849198094",
            "extra": "mean: 37.81058014284814 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 25.6485648863493,
            "unit": "iter/sec",
            "range": "stddev: 0.0049955419443049945",
            "extra": "mean: 38.98853617857664 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 26.549621119548537,
            "unit": "iter/sec",
            "range": "stddev: 0.00041165469219849775",
            "extra": "mean: 37.66532092857996 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 3968.751503138979,
            "unit": "iter/sec",
            "range": "stddev: 0.00001678728484469405",
            "extra": "mean: 251.96840850556566 usec\nrounds: 4115"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 3407.918681734592,
            "unit": "iter/sec",
            "range": "stddev: 0.000027751291336129414",
            "extra": "mean: 293.43423167920525 usec\nrounds: 3548"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 2384.0810926546,
            "unit": "iter/sec",
            "range": "stddev: 0.000015420354614827992",
            "extra": "mean: 419.4488195393266 usec\nrounds: 2477"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 98.01822454566539,
            "unit": "iter/sec",
            "range": "stddev: 0.000658467439468582",
            "extra": "mean: 10.202184385967053 msec\nrounds: 114"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 97.42583366909754,
            "unit": "iter/sec",
            "range": "stddev: 0.0006400117329359554",
            "extra": "mean: 10.264218045045988 msec\nrounds: 111"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 93.33409480669634,
            "unit": "iter/sec",
            "range": "stddev: 0.001137364591466223",
            "extra": "mean: 10.71419830096487 msec\nrounds: 103"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 26.516204354099248,
            "unit": "iter/sec",
            "range": "stddev: 0.0005748062837182345",
            "extra": "mean: 37.71278825000479 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 25.813249657103935,
            "unit": "iter/sec",
            "range": "stddev: 0.001438714219243761",
            "extra": "mean: 38.73979499999896 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 9331.099266931466,
            "unit": "iter/sec",
            "range": "stddev: 0.000005034994575232898",
            "extra": "mean: 107.16850945353305 usec\nrounds: 9626"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 1036711.0440024913,
            "unit": "iter/sec",
            "range": "stddev: 9.06851856576003e-8",
            "extra": "mean: 964.5889332279525 nsec\nrounds: 106987"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3320700.397211642,
            "unit": "iter/sec",
            "range": "stddev: 4.11299867368624e-8",
            "extra": "mean: 301.1412896025458 nsec\nrounds: 194213"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1592949.912857008,
            "unit": "iter/sec",
            "range": "stddev: 6.928163245615812e-8",
            "extra": "mean: 627.7661286954511 nsec\nrounds: 164691"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 162658.2549137656,
            "unit": "iter/sec",
            "range": "stddev: 8.857768588208235e-7",
            "extra": "mean: 6.147858899200394 usec\nrounds: 169177"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 1297.4570036130203,
            "unit": "iter/sec",
            "range": "stddev: 0.00003840424963753252",
            "extra": "mean: 770.7384500721846 usec\nrounds: 1382"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 116.65567405073423,
            "unit": "iter/sec",
            "range": "stddev: 0.00023015201184034412",
            "extra": "mean: 8.572236268294109 msec\nrounds: 123"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 18.257851510608376,
            "unit": "iter/sec",
            "range": "stddev: 0.00022793848555007493",
            "extra": "mean: 54.77095700000458 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 115.91737948106167,
            "unit": "iter/sec",
            "range": "stddev: 0.0004324566710234321",
            "extra": "mean: 8.626834081971099 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 104.36786062392515,
            "unit": "iter/sec",
            "range": "stddev: 0.0002531345072300598",
            "extra": "mean: 9.581493709096508 msec\nrounds: 110"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 110.1595410614652,
            "unit": "iter/sec",
            "range": "stddev: 0.0016507205862284166",
            "extra": "mean: 9.077742975000547 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 156.38482961844298,
            "unit": "iter/sec",
            "range": "stddev: 0.0003198000647574525",
            "extra": "mean: 6.3944821402425 msec\nrounds: 164"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 1320.3264575541923,
            "unit": "iter/sec",
            "range": "stddev: 0.00006789009642097024",
            "extra": "mean: 757.3884430464467 usec\nrounds: 1431"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 118.41153235456625,
            "unit": "iter/sec",
            "range": "stddev: 0.00014049673882124224",
            "extra": "mean: 8.445123377051182 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 117.5878496559492,
            "unit": "iter/sec",
            "range": "stddev: 0.00022807672635522577",
            "extra": "mean: 8.504280016395438 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 27038.838814065748,
            "unit": "iter/sec",
            "range": "stddev: 0.000003673251390969792",
            "extra": "mean: 36.98383672747791 usec\nrounds: 28284"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 46.577474157236196,
            "unit": "iter/sec",
            "range": "stddev: 0.01752901460962416",
            "extra": "mean: 21.46960559999885 msec\nrounds: 65"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 3.01489934312344,
            "unit": "iter/sec",
            "range": "stddev: 0.00365931736629009",
            "extra": "mean: 331.68603199999325 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.1745651970572473,
            "unit": "iter/sec",
            "range": "stddev: 0.013273980637374526",
            "extra": "mean: 851.378878333359 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.11831309088533953,
            "unit": "iter/sec",
            "range": "stddev: 0.1421595503842309",
            "extra": "mean: 8.452150074999963 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.193784771602826,
            "unit": "iter/sec",
            "range": "stddev: 0.0040341644610959355",
            "extra": "mean: 837.6719353333328 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 2.7448999030120778,
            "unit": "iter/sec",
            "range": "stddev: 0.017869423885675997",
            "extra": "mean: 364.31200966660526 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 0.9595563039285595,
            "unit": "iter/sec",
            "range": "stddev: 0.035781011409802756",
            "extra": "mean: 1.0421483303333616 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 2.18595356240835,
            "unit": "iter/sec",
            "range": "stddev: 0.02457940526735328",
            "extra": "mean: 457.4662596666788 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 2.9779739302698207,
            "unit": "iter/sec",
            "range": "stddev: 0.004952728107497639",
            "extra": "mean: 335.7987757499927 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.1905925009695149,
            "unit": "iter/sec",
            "range": "stddev: 0.0024654052825597663",
            "extra": "mean: 839.9179393333043 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.185519736630233,
            "unit": "iter/sec",
            "range": "stddev: 0.022166397365509842",
            "extra": "mean: 843.511895333298 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 11350.928726078602,
            "unit": "iter/sec",
            "range": "stddev: 0.000004442054857983642",
            "extra": "mean: 88.09851811530748 usec\nrounds: 11592"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 284.2522892543102,
            "unit": "iter/sec",
            "range": "stddev: 0.0000699226783295501",
            "extra": "mean: 3.5180015704476397 msec\nrounds: 291"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 23.800614543843768,
            "unit": "iter/sec",
            "range": "stddev: 0.004513568195929855",
            "extra": "mean: 42.015721827597034 msec\nrounds: 29"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 15.774098158770295,
            "unit": "iter/sec",
            "range": "stddev: 0.0033895410730782967",
            "extra": "mean: 63.395066388882995 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.3291365553985415,
            "unit": "iter/sec",
            "range": "stddev: 0.002979302666312255",
            "extra": "mean: 187.64765916665738 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 15.76554914611657,
            "unit": "iter/sec",
            "range": "stddev: 0.0022425526896316704",
            "extra": "mean: 63.4294429411819 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 19.64270798104962,
            "unit": "iter/sec",
            "range": "stddev: 0.002879682934086574",
            "extra": "mean: 50.90947749998391 msec\nrounds: 22"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 15.65937944792986,
            "unit": "iter/sec",
            "range": "stddev: 0.004815049153380697",
            "extra": "mean: 63.85949094120701 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 15.424098242544966,
            "unit": "iter/sec",
            "range": "stddev: 0.0055592297689123155",
            "extra": "mean: 64.83361194119318 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 24.353649101709884,
            "unit": "iter/sec",
            "range": "stddev: 0.0022201483561172363",
            "extra": "mean: 41.06160829630207 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 15.492509200477567,
            "unit": "iter/sec",
            "range": "stddev: 0.004123927916620328",
            "extra": "mean: 64.54732329409714 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 16.096535826269875,
            "unit": "iter/sec",
            "range": "stddev: 0.002091526310472792",
            "extra": "mean: 62.125168470595995 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 21658.40037232428,
            "unit": "iter/sec",
            "range": "stddev: 0.0000024631412419485454",
            "extra": "mean: 46.171461548832966 usec\nrounds: 22132"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 44.40216623843285,
            "unit": "iter/sec",
            "range": "stddev: 0.018512637672618282",
            "extra": "mean: 22.521423721314694 msec\nrounds: 61"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 172.97122123787,
            "unit": "iter/sec",
            "range": "stddev: 0.00013597312208964672",
            "extra": "mean: 5.781308548575258 msec\nrounds: 175"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.037631344667162,
            "unit": "iter/sec",
            "range": "stddev: 0.0009066215124828073",
            "extra": "mean: 71.23708946665677 msec\nrounds: 15"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
            "value": 1.1149328274786885,
            "unit": "iter/sec",
            "range": "stddev: 0.009126610661060157",
            "extra": "mean: 896.9150206666731 msec\nrounds: 3"
          }
        ]
      }
    ]
  }
}