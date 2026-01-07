window.BENCHMARK_DATA = {
  "lastUpdate": 1767820573747,
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
          "id": "1e4ef6af304338c07f162a5a2b61c3cfc9da5aa3",
          "message": "feat: add performance benchmarks with pytest-benchmark (#92)\n\n* feat: add performance benchmarks with pytest-benchmark\n\nAdd comprehensive benchmark suite for tracking performance across versions\nand detecting regressions. Implements issue #78.\n\nBenchmarks included:\n- 3D remeshing (baseline, modes, options, quality)\n- 2D remeshing (baseline, modes, options, quality)\n- Surface remeshing (baseline, modes, options, quality)\n- File I/O (read/write .mesh files)\n- PyVista conversion (to/from UnstructuredGrid/PolyData)\n- Mesh construction (from arrays, low-level API)\n- Field operations (metric field get/set)\n- Topology queries (mesh size, neighbors, adjacency)\n\nChanges:\n- Add benchmarks/ directory with pytest-benchmark tests\n- Add benchmark dependency group in pyproject.toml\n- Add pytest configuration for benchmark markers\n- Add ruff lint exceptions for benchmarks directory\n- Add GitHub Actions workflow for CI benchmarking\n\n* fix: add python_files config to discover bench_*.py files\n\n* fix: add pytest-benchmark to dev deps and separate benchmarks from regular tests\n\n* feat: add comparison benchmarks for executable vs script vs API\n\n* feat: add timing comparison test parsing MMG internal elapsed time\n\nShows Python API has ~0% overhead vs MMG executable's internal timing.\nThe earlier 2x difference was entirely subprocess overhead.\n\n* fix: use matching verbosity level (verbose=1) in timing comparison\n\n* feat: add result validation to timing comparison (vertices, elements, quality)\n\n* fix: use same input file for exe and API to ensure identical results\n\nConfirms MMG is deterministic and API produces identical output to exe.\nEarlier differences were from floating-point precision in file I/O.\n\n* feat: add auto-detection overhead benchmarks (Mesh vs MmgMesh3D, mmg vs mmg3d_O3)\n\nResults show auto-detection overhead is negligible (<1ms).",
          "timestamp": "2026-01-07T22:09:47+01:00",
          "tree_id": "a9f2ff8fbd1c19772ab417fce4e189ed2e619031",
          "url": "https://github.com/kmarchais/mmgpy/commit/1e4ef6af304338c07f162a5a2b61c3cfc9da5aa3"
        },
        "date": 1767820573025,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 0.6298472342442365,
            "unit": "iter/sec",
            "range": "stddev: 0.01742393426863914",
            "extra": "mean: 1.587686578000006 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.6322504459520963,
            "unit": "iter/sec",
            "range": "stddev: 0.015896575944837815",
            "extra": "mean: 1.5816517116000057 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.190268832042587,
            "unit": "iter/sec",
            "range": "stddev: 0.00500900610761455",
            "extra": "mean: 840.1463375999924 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.253555698202394,
            "unit": "iter/sec",
            "range": "stddev: 0.006332379495347877",
            "extra": "mean: 797.730808 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 0.6319648818025161,
            "unit": "iter/sec",
            "range": "stddev: 0.016600494560557",
            "extra": "mean: 1.5823664080000128 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.6321916669197665,
            "unit": "iter/sec",
            "range": "stddev: 0.02220115399282614",
            "extra": "mean: 1.5817987682000136 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.247458439713912,
            "unit": "iter/sec",
            "range": "stddev: 0.005129014504317829",
            "extra": "mean: 801.6299126000035 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.2504804580384867,
            "unit": "iter/sec",
            "range": "stddev: 0.00396595416826093",
            "extra": "mean: 799.6926250000001 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 1.3616738860564495,
            "unit": "iter/sec",
            "range": "stddev: 0.0081854656079538",
            "extra": "mean: 734.3902312000012 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.3526057476858264,
            "unit": "iter/sec",
            "range": "stddev: 0.007325569923481029",
            "extra": "mean: 739.3137295999963 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 117.75570280772202,
            "unit": "iter/sec",
            "range": "stddev: 0.0001505881683609014",
            "extra": "mean: 8.492157714287986 msec\nrounds: 112"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 1.294618395767493,
            "unit": "iter/sec",
            "range": "stddev: 0.003064176689279118",
            "extra": "mean: 772.4283876000129 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 1.2668334751402734,
            "unit": "iter/sec",
            "range": "stddev: 0.007756641335001042",
            "extra": "mean: 789.3697313999951 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 16.808922962965813,
            "unit": "iter/sec",
            "range": "stddev: 0.0016581874156457238",
            "extra": "mean: 59.492211500001865 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 373.6389233265248,
            "unit": "iter/sec",
            "range": "stddev: 0.00023324565915439245",
            "extra": "mean: 2.6763806915429296 msec\nrounds: 402"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 24.900960042070015,
            "unit": "iter/sec",
            "range": "stddev: 0.000592696530910362",
            "extra": "mean: 40.15909420000298 msec\nrounds: 25"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 166.0788561788891,
            "unit": "iter/sec",
            "range": "stddev: 0.00007295528707349824",
            "extra": "mean: 6.021236074283089 msec\nrounds: 175"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 258.69232159605536,
            "unit": "iter/sec",
            "range": "stddev: 0.00005411629109526347",
            "extra": "mean: 3.865595986113135 msec\nrounds: 216"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 277.33075068850917,
            "unit": "iter/sec",
            "range": "stddev: 0.0000688462379321389",
            "extra": "mean: 3.6058028095239054 msec\nrounds: 294"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 65.63505891461074,
            "unit": "iter/sec",
            "range": "stddev: 0.000265036513050529",
            "extra": "mean: 15.235759920638912 msec\nrounds: 63"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 899.0311852776856,
            "unit": "iter/sec",
            "range": "stddev: 0.00001976845799787699",
            "extra": "mean: 1.112308467576826 msec\nrounds: 586"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 27.217725588177977,
            "unit": "iter/sec",
            "range": "stddev: 0.0007441575877674731",
            "extra": "mean: 36.74076280768846 msec\nrounds: 26"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 1952.669206718257,
            "unit": "iter/sec",
            "range": "stddev: 0.00003634163106260788",
            "extra": "mean: 512.1195113639574 usec\nrounds: 1056"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 72.91859457354711,
            "unit": "iter/sec",
            "range": "stddev: 0.0006738501455791154",
            "extra": "mean: 13.71392311999898 msec\nrounds: 75"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 91046.9718361101,
            "unit": "iter/sec",
            "range": "stddev: 9.451335964649573e-7",
            "extra": "mean: 10.98334167335141 usec\nrounds: 27658"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_elements_3d",
            "value": 27626.872165511773,
            "unit": "iter/sec",
            "range": "stddev: 0.000001924801010989681",
            "extra": "mean: 36.196641950960995 usec\nrounds: 19947"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_with_refs",
            "value": 84916.51085784244,
            "unit": "iter/sec",
            "range": "stddev: 0.0000010560792225431327",
            "extra": "mean: 11.77627283431471 usec\nrounds: 37356"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 27.82352466169905,
            "unit": "iter/sec",
            "range": "stddev: 0.0006379736968871874",
            "extra": "mean: 35.94080951852111 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 28.27347855958749,
            "unit": "iter/sec",
            "range": "stddev: 0.0004716367596691215",
            "extra": "mean: 35.368835068966135 msec\nrounds: 29"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 27.10356702940798,
            "unit": "iter/sec",
            "range": "stddev: 0.0006605311882309915",
            "extra": "mean: 36.895512642855365 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 3928.0017745459068,
            "unit": "iter/sec",
            "range": "stddev: 0.000008295197272656792",
            "extra": "mean: 254.58236971280496 usec\nrounds: 1466"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 3384.1117626124033,
            "unit": "iter/sec",
            "range": "stddev: 0.000020576502510267614",
            "extra": "mean: 295.49851486820836 usec\nrounds: 3094"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 2379.951263535222,
            "unit": "iter/sec",
            "range": "stddev: 0.000019422580764481273",
            "extra": "mean: 420.1766713972882 usec\nrounds: 916"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 105.13576486213623,
            "unit": "iter/sec",
            "range": "stddev: 0.000708111976393756",
            "extra": "mean: 9.511511152378 msec\nrounds: 105"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 111.53102897591161,
            "unit": "iter/sec",
            "range": "stddev: 0.000555709033178677",
            "extra": "mean: 8.966114714282599 msec\nrounds: 119"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 105.55861373118817,
            "unit": "iter/sec",
            "range": "stddev: 0.0006851666515290658",
            "extra": "mean: 9.473409745097301 msec\nrounds: 102"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 28.00254693328657,
            "unit": "iter/sec",
            "range": "stddev: 0.0006546019309518346",
            "extra": "mean: 35.71103737036512 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 28.089126453413883,
            "unit": "iter/sec",
            "range": "stddev: 0.0006182785653281579",
            "extra": "mean: 35.60096472414373 msec\nrounds: 29"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 9301.747751725343,
            "unit": "iter/sec",
            "range": "stddev: 0.000005609442037523051",
            "extra": "mean: 107.50667795893672 usec\nrounds: 2214"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 803177.5036130858,
            "unit": "iter/sec",
            "range": "stddev: 3.0445010023610826e-7",
            "extra": "mean: 1.2450547923734296 usec\nrounds: 149656"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3405100.482016744,
            "unit": "iter/sec",
            "range": "stddev: 3.6224569127503605e-8",
            "extra": "mean: 293.6770897896466 nsec\nrounds: 116878"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1365413.8323189253,
            "unit": "iter/sec",
            "range": "stddev: 3.1238313019328426e-7",
            "extra": "mean: 732.3786945249182 nsec\nrounds: 3417"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 164824.12585128797,
            "unit": "iter/sec",
            "range": "stddev: 9.048406720483284e-7",
            "extra": "mean: 6.067072977546058 usec\nrounds: 51742"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 1280.5513172533908,
            "unit": "iter/sec",
            "range": "stddev: 0.00013629189654906874",
            "extra": "mean: 780.9136475255553 usec\nrounds: 505"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 119.12994975120712,
            "unit": "iter/sec",
            "range": "stddev: 0.00009739742398216103",
            "extra": "mean: 8.394194760330345 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 18.12796122333376,
            "unit": "iter/sec",
            "range": "stddev: 0.00025146559794600427",
            "extra": "mean: 55.16340131579885 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 116.55587810004019,
            "unit": "iter/sec",
            "range": "stddev: 0.0005805713677083479",
            "extra": "mean: 8.57957587640237 msec\nrounds: 89"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 108.01608102629058,
            "unit": "iter/sec",
            "range": "stddev: 0.00016805719321007112",
            "extra": "mean: 9.257880775702324 msec\nrounds: 107"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 117.65023060697271,
            "unit": "iter/sec",
            "range": "stddev: 0.0002982402379177169",
            "extra": "mean: 8.499770844824281 msec\nrounds: 116"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 158.71036068701943,
            "unit": "iter/sec",
            "range": "stddev: 0.00006516893577139446",
            "extra": "mean: 6.300785882353475 msec\nrounds: 153"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 1321.7054066647606,
            "unit": "iter/sec",
            "range": "stddev: 0.000030091721392088474",
            "extra": "mean: 756.5982517416164 usec\nrounds: 1005"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 118.25758693688636,
            "unit": "iter/sec",
            "range": "stddev: 0.0001406606598096881",
            "extra": "mean: 8.456117073771313 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 118.46611131214244,
            "unit": "iter/sec",
            "range": "stddev: 0.00015888607273789094",
            "extra": "mean: 8.44123259321928 msec\nrounds: 118"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 27874.368205075978,
            "unit": "iter/sec",
            "range": "stddev: 0.000002650293880960045",
            "extra": "mean: 35.87525258484237 usec\nrounds: 25920"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 4.3862537932640455,
            "unit": "iter/sec",
            "range": "stddev: 0.020598176736909092",
            "extra": "mean: 227.98498380000183 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 3.3018157956259366,
            "unit": "iter/sec",
            "range": "stddev: 0.00191467374259618",
            "extra": "mean: 302.86365499999874 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.1097149986461856,
            "unit": "iter/sec",
            "range": "stddev: 0.20132588264320045",
            "extra": "mean: 901.132273799999 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.12982767385016125,
            "unit": "iter/sec",
            "range": "stddev: 0.06926114110054907",
            "extra": "mean: 7.7025180406 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.2440350714048314,
            "unit": "iter/sec",
            "range": "stddev: 0.00620524768307349",
            "extra": "mean: 803.8358587999824 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 3.0336024590722217,
            "unit": "iter/sec",
            "range": "stddev: 0.004373081778840902",
            "extra": "mean: 329.64108299999 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 1.009595147047679,
            "unit": "iter/sec",
            "range": "stddev: 0.010235033532485274",
            "extra": "mean: 990.4960447999997 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 2.402449299367015,
            "unit": "iter/sec",
            "range": "stddev: 0.0045803937615815",
            "extra": "mean: 416.2418746000071 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 3.262798984513125,
            "unit": "iter/sec",
            "range": "stddev: 0.003643678985780536",
            "extra": "mean: 306.4853227999947 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.255984663932906,
            "unit": "iter/sec",
            "range": "stddev: 0.0012355047488269945",
            "extra": "mean: 796.1880655999948 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.263200672189918,
            "unit": "iter/sec",
            "range": "stddev: 0.0026652871433248625",
            "extra": "mean: 791.6398573999913 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 11399.179592941216,
            "unit": "iter/sec",
            "range": "stddev: 0.000004065534366558205",
            "extra": "mean: 87.7256114658669 usec\nrounds: 9698"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 3.9525290510094835,
            "unit": "iter/sec",
            "range": "stddev: 0.0005871775372668635",
            "extra": "mean: 253.00256799999943 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 27.9271280969587,
            "unit": "iter/sec",
            "range": "stddev: 0.0013195118140934667",
            "extra": "mean: 35.80747710713946 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 17.296519703945997,
            "unit": "iter/sec",
            "range": "stddev: 0.0013788694843805411",
            "extra": "mean: 57.81509905555519 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.516869504258781,
            "unit": "iter/sec",
            "range": "stddev: 0.0019488904353001033",
            "extra": "mean: 181.26221749998686 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 17.245879774647374,
            "unit": "iter/sec",
            "range": "stddev: 0.0014741643157167377",
            "extra": "mean: 57.984864388888326 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 20.924387231030323,
            "unit": "iter/sec",
            "range": "stddev: 0.0018609207935026415",
            "extra": "mean: 47.791124727276404 msec\nrounds: 22"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 16.685559153661835,
            "unit": "iter/sec",
            "range": "stddev: 0.002355016162760904",
            "extra": "mean: 59.932064055554214 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 14.781585154429271,
            "unit": "iter/sec",
            "range": "stddev: 0.009235947764601883",
            "extra": "mean: 67.65174299999565 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 25.90419886973203,
            "unit": "iter/sec",
            "range": "stddev: 0.0031410047407813184",
            "extra": "mean: 38.60378022222714 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 16.87581712271998,
            "unit": "iter/sec",
            "range": "stddev: 0.0012468872728454733",
            "extra": "mean: 59.256389941183706 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 16.61355163456518,
            "unit": "iter/sec",
            "range": "stddev: 0.0017654986080029515",
            "extra": "mean: 60.191825444443715 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 21511.589516081567,
            "unit": "iter/sec",
            "range": "stddev: 0.000002620368271426949",
            "extra": "mean: 46.48656944910664 usec\nrounds: 17682"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 25.416791381310126,
            "unit": "iter/sec",
            "range": "stddev: 0.015021249442031296",
            "extra": "mean: 39.34406924138094 msec\nrounds: 29"
          }
        ]
      }
    ]
  }
}