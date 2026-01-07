window.BENCHMARK_DATA = {
  "lastUpdate": 1767824615781,
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
          "id": "71f4a191ef9fa45021014f36e4bf38a60829cf60",
          "message": "feat: add context manager support for mesh operations (#93)\n\n* feat: add context manager support for mesh operations\n\nAdd context manager (`with` statement) support to the Mesh class for\nautomatic resource cleanup and transactional mesh modifications.\n\n- Add basic __enter__/__exit__ methods to Mesh class\n- Add MeshCheckpoint class for transactional modifications with\n  commit/rollback semantics\n- Add mesh.checkpoint() for creating checkpoints\n- Add mesh.copy() context manager for working copies\n- Add mesh.update_from() for applying changes from another mesh\n- Export MeshCheckpoint from mmgpy package\n\nCloses #77\n\n* fix: remove Self type hint for Python 3.9/3.10 compatibility\n\n* feat: add metric field preservation to checkpoint rollback\n\n- Save and restore metric field when rolling back checkpoints\n- Add _try_get_field helper to detect uninitialized memory\n- Add documentation about memory usage for large meshes\n- Add comment explaining empty finally block in copy()\n- Add 5 new tests for field preservation across mesh types",
          "timestamp": "2026-01-07T23:17:12+01:00",
          "tree_id": "78475adaac43d0449145faf1d5af3218157d5624",
          "url": "https://github.com/kmarchais/mmgpy/commit/71f4a191ef9fa45021014f36e4bf38a60829cf60"
        },
        "date": 1767824615442,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 0.6094431846806208,
            "unit": "iter/sec",
            "range": "stddev: 0.04321327734843433",
            "extra": "mean: 1.640842042600002 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.5974300486615935,
            "unit": "iter/sec",
            "range": "stddev: 0.029807465992004106",
            "extra": "mean: 1.6738361289999943 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.1053841841866612,
            "unit": "iter/sec",
            "range": "stddev: 0.0073040084485215765",
            "extra": "mean: 904.6628441999985 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.1993001527133584,
            "unit": "iter/sec",
            "range": "stddev: 0.011546314336914946",
            "extra": "mean: 833.8196220000043 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 0.6287416553446816,
            "unit": "iter/sec",
            "range": "stddev: 0.018573629426725257",
            "extra": "mean: 1.5904783649999956 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.6269574095434264,
            "unit": "iter/sec",
            "range": "stddev: 0.01709982679979039",
            "extra": "mean: 1.5950046761999943 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.2173321100814203,
            "unit": "iter/sec",
            "range": "stddev: 0.018599523171377072",
            "extra": "mean: 821.4685143999986 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.2117456223856666,
            "unit": "iter/sec",
            "range": "stddev: 0.02489130976796799",
            "extra": "mean: 825.2557149999973 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 1.333482835961388,
            "unit": "iter/sec",
            "range": "stddev: 0.01756073141812938",
            "extra": "mean: 749.9159142000053 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.3147967910350098,
            "unit": "iter/sec",
            "range": "stddev: 0.026559632449992862",
            "extra": "mean: 760.5738063999979 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 113.69780671858764,
            "unit": "iter/sec",
            "range": "stddev: 0.00035774094692787037",
            "extra": "mean: 8.795244419051023 msec\nrounds: 105"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 1.2320339608643402,
            "unit": "iter/sec",
            "range": "stddev: 0.02073836082363031",
            "extra": "mean: 811.665937600003 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 1.2021550989257461,
            "unit": "iter/sec",
            "range": "stddev: 0.04400023291515332",
            "extra": "mean: 831.8394197999964 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 16.543744471845553,
            "unit": "iter/sec",
            "range": "stddev: 0.001336001325835091",
            "extra": "mean: 60.44580788235809 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 369.61519248004277,
            "unit": "iter/sec",
            "range": "stddev: 0.00034044682960956973",
            "extra": "mean: 2.705516494844823 msec\nrounds: 388"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 22.930284162778943,
            "unit": "iter/sec",
            "range": "stddev: 0.0012881723698500876",
            "extra": "mean: 43.6104495217389 msec\nrounds: 23"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 163.57791720352748,
            "unit": "iter/sec",
            "range": "stddev: 0.00012301398450156376",
            "extra": "mean: 6.113294612718272 msec\nrounds: 173"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 246.0805260554377,
            "unit": "iter/sec",
            "range": "stddev: 0.0000806925034348458",
            "extra": "mean: 4.063710428572139 msec\nrounds: 161"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 264.53642036020153,
            "unit": "iter/sec",
            "range": "stddev: 0.000137345366190655",
            "extra": "mean: 3.78019782167751 msec\nrounds: 286"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 65.11265322034448,
            "unit": "iter/sec",
            "range": "stddev: 0.0002772301025661733",
            "extra": "mean: 15.35799803174891 msec\nrounds: 63"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 933.6778640432556,
            "unit": "iter/sec",
            "range": "stddev: 0.000015811092546083435",
            "extra": "mean: 1.0710332101797284 msec\nrounds: 609"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 26.700377310447212,
            "unit": "iter/sec",
            "range": "stddev: 0.0006173087491060612",
            "extra": "mean: 37.45265425926113 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 1975.2877547807323,
            "unit": "iter/sec",
            "range": "stddev: 0.00001831634827193523",
            "extra": "mean: 506.2553532161219 usec\nrounds: 1073"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 66.76909578763208,
            "unit": "iter/sec",
            "range": "stddev: 0.0007894806100259393",
            "extra": "mean: 14.976988803032947 msec\nrounds: 66"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 90973.074576759,
            "unit": "iter/sec",
            "range": "stddev: 9.833506553678918e-7",
            "extra": "mean: 10.992263421373593 usec\nrounds: 40346"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_elements_3d",
            "value": 27499.022313477428,
            "unit": "iter/sec",
            "range": "stddev: 0.000002502175945039381",
            "extra": "mean: 36.36492921822512 usec\nrounds: 20429"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_with_refs",
            "value": 85652.11067887524,
            "unit": "iter/sec",
            "range": "stddev: 0.0000010398339522555284",
            "extra": "mean: 11.675135522919863 usec\nrounds: 36112"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 27.096584909816677,
            "unit": "iter/sec",
            "range": "stddev: 0.0006673065829536567",
            "extra": "mean: 36.90501970370869 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 26.297535474431765,
            "unit": "iter/sec",
            "range": "stddev: 0.0017125316243188128",
            "extra": "mean: 38.026377071428136 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 24.75762539194327,
            "unit": "iter/sec",
            "range": "stddev: 0.0021893900035211554",
            "extra": "mean: 40.39159588889426 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 3765.3770220015,
            "unit": "iter/sec",
            "range": "stddev: 0.000013615360614812868",
            "extra": "mean: 265.57765508125567 usec\nrounds: 1151"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 3306.7693928296376,
            "unit": "iter/sec",
            "range": "stddev: 0.000010057680165352828",
            "extra": "mean: 302.4099600559958 usec\nrounds: 2854"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 2236.871652446792,
            "unit": "iter/sec",
            "range": "stddev: 0.00004294358215219232",
            "extra": "mean: 447.05291826026524 usec\nrounds: 1517"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 92.92521429810098,
            "unit": "iter/sec",
            "range": "stddev: 0.0005768241766212271",
            "extra": "mean: 10.761341876404325 msec\nrounds: 89"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 93.98465575645308,
            "unit": "iter/sec",
            "range": "stddev: 0.0004568078152622099",
            "extra": "mean: 10.64003471578752 msec\nrounds: 95"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 89.75895959335273,
            "unit": "iter/sec",
            "range": "stddev: 0.0007097555348646787",
            "extra": "mean: 11.140949098902622 msec\nrounds: 91"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 25.369782902788973,
            "unit": "iter/sec",
            "range": "stddev: 0.0009838829595796505",
            "extra": "mean: 39.416971120003836 msec\nrounds: 25"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 25.492792244400288,
            "unit": "iter/sec",
            "range": "stddev: 0.0010125374192062194",
            "extra": "mean: 39.226773999998315 msec\nrounds: 26"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 8900.481310118137,
            "unit": "iter/sec",
            "range": "stddev: 0.00001229072819229495",
            "extra": "mean: 112.35347450965288 usec\nrounds: 1785"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 919114.9634496886,
            "unit": "iter/sec",
            "range": "stddev: 2.8798972251719813e-7",
            "extra": "mean: 1.088003176715487 usec\nrounds: 150785"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3407862.3873458817,
            "unit": "iter/sec",
            "range": "stddev: 3.870858135560393e-8",
            "extra": "mean: 293.43907891152315 nsec\nrounds: 163372"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1310690.402703461,
            "unit": "iter/sec",
            "range": "stddev: 3.2878398914049627e-7",
            "extra": "mean: 762.9566814080399 nsec\nrounds: 3278"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 168012.51703478105,
            "unit": "iter/sec",
            "range": "stddev: 9.246559753553695e-7",
            "extra": "mean: 5.9519374963770435 usec\nrounds: 51293"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 1261.4282100223468,
            "unit": "iter/sec",
            "range": "stddev: 0.00003946250736451937",
            "extra": "mean: 792.7522090078234 usec\nrounds: 555"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 115.14369381256097,
            "unit": "iter/sec",
            "range": "stddev: 0.00022254542935567424",
            "extra": "mean: 8.684800416667807 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 18.244580919437993,
            "unit": "iter/sec",
            "range": "stddev: 0.00026859575064196254",
            "extra": "mean: 54.81079584210061 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 120.33923098901465,
            "unit": "iter/sec",
            "range": "stddev: 0.00006860637981666205",
            "extra": "mean: 8.309842033902365 msec\nrounds: 118"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 109.37904729129185,
            "unit": "iter/sec",
            "range": "stddev: 0.0002170378115911022",
            "extra": "mean: 9.14251883486294 msec\nrounds: 109"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 116.29034411628805,
            "unit": "iter/sec",
            "range": "stddev: 0.0002474712030968263",
            "extra": "mean: 8.599166230001174 msec\nrounds: 100"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 151.71848962111534,
            "unit": "iter/sec",
            "range": "stddev: 0.00024076301025312944",
            "extra": "mean: 6.591154463093374 msec\nrounds: 149"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 1297.1662365841055,
            "unit": "iter/sec",
            "range": "stddev: 0.00004398814866746611",
            "extra": "mean: 770.9112153838905 usec\nrounds: 780"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 118.12509207853337,
            "unit": "iter/sec",
            "range": "stddev: 0.00021601102226445805",
            "extra": "mean: 8.46560186666494 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 121.20126803766631,
            "unit": "iter/sec",
            "range": "stddev: 0.000053193383857879744",
            "extra": "mean: 8.25073876033397 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 27824.191088926334,
            "unit": "iter/sec",
            "range": "stddev: 0.0000024258454212508946",
            "extra": "mean: 35.93994868724097 usec\nrounds: 25257"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 4.592564702593077,
            "unit": "iter/sec",
            "range": "stddev: 0.0009277835112383901",
            "extra": "mean: 217.74325780002073 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 2.8192498149569993,
            "unit": "iter/sec",
            "range": "stddev: 0.013323530569975081",
            "extra": "mean: 354.70428859999856 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.1940085664564806,
            "unit": "iter/sec",
            "range": "stddev: 0.025966657227605692",
            "extra": "mean: 837.514929200006 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.121915954174656,
            "unit": "iter/sec",
            "range": "stddev: 0.24605015175810693",
            "extra": "mean: 8.2023719272 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.2192153423546068,
            "unit": "iter/sec",
            "range": "stddev: 0.012755360261530482",
            "extra": "mean: 820.1996524000037 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 2.743691173800165,
            "unit": "iter/sec",
            "range": "stddev: 0.007710979284524999",
            "extra": "mean: 364.47250680000707 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 0.9945760763837121,
            "unit": "iter/sec",
            "range": "stddev: 0.023918385930216727",
            "extra": "mean: 1.0054535030000011 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 2.151888457629638,
            "unit": "iter/sec",
            "range": "stddev: 0.022094354679177607",
            "extra": "mean: 464.7081015999902 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 2.9716301983373556,
            "unit": "iter/sec",
            "range": "stddev: 0.006027490037166107",
            "extra": "mean: 336.51562720001493 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.1577547185470436,
            "unit": "iter/sec",
            "range": "stddev: 0.016410681580903634",
            "extra": "mean: 863.7408113999982 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.2318254444493326,
            "unit": "iter/sec",
            "range": "stddev: 0.008839027639590956",
            "extra": "mean: 811.803331800013 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 11463.068071522335,
            "unit": "iter/sec",
            "range": "stddev: 0.0000030876481234326293",
            "extra": "mean: 87.23667989761806 usec\nrounds: 10153"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 3.977405194752948,
            "unit": "iter/sec",
            "range": "stddev: 0.0013304342495286203",
            "extra": "mean: 251.42019759998675 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 23.387650487380906,
            "unit": "iter/sec",
            "range": "stddev: 0.002717429814587942",
            "extra": "mean: 42.75760836000018 msec\nrounds: 25"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 16.083043977340978,
            "unit": "iter/sec",
            "range": "stddev: 0.0025739072052732717",
            "extra": "mean: 62.17728443750303 msec\nrounds: 16"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.357350067007196,
            "unit": "iter/sec",
            "range": "stddev: 0.0017018341326291253",
            "extra": "mean: 186.6594468333176 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 15.748795476768295,
            "unit": "iter/sec",
            "range": "stddev: 0.0026513910752905237",
            "extra": "mean: 63.49691958824036 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 20.34721406550634,
            "unit": "iter/sec",
            "range": "stddev: 0.0018308377709030696",
            "extra": "mean: 49.14677738095124 msec\nrounds: 21"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 16.091677470557215,
            "unit": "iter/sec",
            "range": "stddev: 0.002566671221279794",
            "extra": "mean: 62.14392513332996 msec\nrounds: 15"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 15.455647161175317,
            "unit": "iter/sec",
            "range": "stddev: 0.0025750080674141456",
            "extra": "mean: 64.70127000000403 msec\nrounds: 16"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 25.821774872879203,
            "unit": "iter/sec",
            "range": "stddev: 0.0024986522383568387",
            "extra": "mean: 38.727004821434925 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 15.906131160848556,
            "unit": "iter/sec",
            "range": "stddev: 0.0028194629674310277",
            "extra": "mean: 62.8688390588282 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 16.283915000686136,
            "unit": "iter/sec",
            "range": "stddev: 0.002512169608460743",
            "extra": "mean: 61.410293529403965 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 21455.59541759693,
            "unit": "iter/sec",
            "range": "stddev: 0.000002626568258475774",
            "extra": "mean: 46.60788855012824 usec\nrounds: 12786"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 25.385762706620746,
            "unit": "iter/sec",
            "range": "stddev: 0.015037638180107754",
            "extra": "mean: 39.39215896551316 msec\nrounds: 29"
          }
        ]
      }
    ]
  }
}