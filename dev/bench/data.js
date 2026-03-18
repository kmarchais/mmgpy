window.BENCHMARK_DATA = {
  "lastUpdate": 1773850449550,
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
          "id": "c76cf9d9145faf4807bdca7a1f8515725134bc6b",
          "message": "feat: add Python 3.14 support, manylinux_2_28, and VTK 9.6 (#195)\n\n## Summary\n\nFixes #140.\n\nAdds Python 3.14 support (including free-threaded cp314t on Linux), switches Linux x86_64 wheels to manylinux_2_28, upgrades build-time VTK to 9.6.0, and adds upper bounds to all dependencies.\n\n### Python 3.14 support\n- Widen VTK constraint: `>=9.5,<9.7` (Python <3.14) / `>=9.6,<9.7` (Python >=3.14)\n- Add `cp314-*` and `cp314t-*` (free-threaded, Linux only) to cibuildwheel\n- Bump pyvista lower bound to `>=0.47` (first version compatible with VTK 9.6)\n- Update CI matrices to test 3.10 + 3.14\n\n### manylinux_2_28 migration\n- Switch Linux x86_64 cibuildwheel image from manylinux2014 to manylinux_2_28\n- Remove `scipy<1.17` cap (scipy 1.17+ dropped manylinux2014)\n\n### VTK 9.6.0 build adaptations\n- Add `vtkWrapJavaScript` stub, `vtkscn` module, `NOMINMAX` on MSVC\n- Parameterize all VTK version paths in cibuildwheel config ($VTK_MAJOR_MINOR)\n\n### Dependency bounds & maintenance\n- Add upper bounds to all runtime and optional dependencies\n- Bump cibuildwheel from v3.0 to v3.4, setup-uv from v4 to v6\n- Update vtk_modules.py fallback from 9.4 to 9.6\n- Add missing v0.7.0 and v0.7.1 entries to CHANGELOG",
          "timestamp": "2026-03-18T17:05:01+01:00",
          "tree_id": "d3b873c0a640547c711d0fb74ad3bc5b473d0d63",
          "url": "https://github.com/kmarchais/mmgpy/commit/c76cf9d9145faf4807bdca7a1f8515725134bc6b"
        },
        "date": 1773850448834,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 1.1805202063263003,
            "unit": "iter/sec",
            "range": "stddev: 0.006472887963459706",
            "extra": "mean: 847.0841876666668 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.5731368139995323,
            "unit": "iter/sec",
            "range": "stddev: 0.023974444716415175",
            "extra": "mean: 1.7447840996666741 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.178388784748839,
            "unit": "iter/sec",
            "range": "stddev: 0.0030093767711719403",
            "extra": "mean: 848.6163590000046 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.2409695786487969,
            "unit": "iter/sec",
            "range": "stddev: 0.0009717174102339977",
            "extra": "mean: 805.8215263333276 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 1.1858938636455656,
            "unit": "iter/sec",
            "range": "stddev: 0.00799997284587741",
            "extra": "mean: 843.245783333335 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.570376606080923,
            "unit": "iter/sec",
            "range": "stddev: 0.019446380075043356",
            "extra": "mean: 1.7532275856666597 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.2408947702050555,
            "unit": "iter/sec",
            "range": "stddev: 0.0006939303474140452",
            "extra": "mean: 805.8701060000052 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.2499967963623702,
            "unit": "iter/sec",
            "range": "stddev: 0.0005929039643138396",
            "extra": "mean: 800.0020503333379 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 30.42461440993844,
            "unit": "iter/sec",
            "range": "stddev: 0.0006984105677903128",
            "extra": "mean: 32.86812403030298 msec\nrounds: 33"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.086488095780916,
            "unit": "iter/sec",
            "range": "stddev: 0.005201462884461327",
            "extra": "mean: 920.39664666666 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 120.07682451716148,
            "unit": "iter/sec",
            "range": "stddev: 0.00005695984143394779",
            "extra": "mean: 8.328001710747099 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 12.542091367165401,
            "unit": "iter/sec",
            "range": "stddev: 0.0007210988646414964",
            "extra": "mean: 79.73151930769316 msec\nrounds: 13"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 1.0315931516604766,
            "unit": "iter/sec",
            "range": "stddev: 0.001993613700589727",
            "extra": "mean: 969.3744073333335 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 17.897237564115258,
            "unit": "iter/sec",
            "range": "stddev: 0.0014492923498982085",
            "extra": "mean: 55.874544684205546 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 365.7828365115916,
            "unit": "iter/sec",
            "range": "stddev: 0.0003163311646381935",
            "extra": "mean: 2.7338625549980122 msec\nrounds: 400"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 31.228594049149187,
            "unit": "iter/sec",
            "range": "stddev: 0.00019768383337271286",
            "extra": "mean: 32.021934718743594 msec\nrounds: 32"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 145.6266846142413,
            "unit": "iter/sec",
            "range": "stddev: 0.0004381494994925173",
            "extra": "mean: 6.866873352565542 msec\nrounds: 156"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 255.41296048626984,
            "unit": "iter/sec",
            "range": "stddev: 0.00004257759012545187",
            "extra": "mean: 3.915228099999869 msec\nrounds: 260"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 268.9947120348603,
            "unit": "iter/sec",
            "range": "stddev: 0.000528566316861222",
            "extra": "mean: 3.7175451979532053 msec\nrounds: 293"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 76.88267436652251,
            "unit": "iter/sec",
            "range": "stddev: 0.00014807839527646147",
            "extra": "mean: 13.006831620251702 msec\nrounds: 79"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 878.535141985057,
            "unit": "iter/sec",
            "range": "stddev: 0.000027836756467934347",
            "extra": "mean: 1.1382583942407725 msec\nrounds: 903"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 35.2536449419241,
            "unit": "iter/sec",
            "range": "stddev: 0.00021719863870385352",
            "extra": "mean: 28.365861222218943 msec\nrounds: 36"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 1744.259504230277,
            "unit": "iter/sec",
            "range": "stddev: 0.00001626594828738242",
            "extra": "mean: 573.3091879819164 usec\nrounds: 1814"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 82.14336877197005,
            "unit": "iter/sec",
            "range": "stddev: 0.00039974005917195243",
            "extra": "mean: 12.173837218388249 msec\nrounds: 87"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 92464.67903727248,
            "unit": "iter/sec",
            "range": "stddev: 9.368450473393073e-7",
            "extra": "mean: 10.814940476859281 usec\nrounds: 94518"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
            "value": 26455.90620310182,
            "unit": "iter/sec",
            "range": "stddev: 0.0000037031986907846037",
            "extra": "mean: 37.798743022560124 usec\nrounds: 27302"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
            "value": 6378.813278528644,
            "unit": "iter/sec",
            "range": "stddev: 0.0000053866502966226824",
            "extra": "mean: 156.7689719600419 usec\nrounds: 6562"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 36.91639634069155,
            "unit": "iter/sec",
            "range": "stddev: 0.00026563270732267246",
            "extra": "mean: 27.088234473681222 msec\nrounds: 38"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 36.571573933810136,
            "unit": "iter/sec",
            "range": "stddev: 0.000320490124842964",
            "extra": "mean: 27.343641315790016 msec\nrounds: 38"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 35.57395480665164,
            "unit": "iter/sec",
            "range": "stddev: 0.0009438086595197507",
            "extra": "mean: 28.110453432437016 msec\nrounds: 37"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 4068.492084582388,
            "unit": "iter/sec",
            "range": "stddev: 0.000010181210975231442",
            "extra": "mean: 245.79131019807434 usec\nrounds: 4236"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 3506.6148331606637,
            "unit": "iter/sec",
            "range": "stddev: 0.000010748973553201771",
            "extra": "mean: 285.1753179571926 usec\nrounds: 3642"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 2445.3366074383366,
            "unit": "iter/sec",
            "range": "stddev: 0.000012378440800191664",
            "extra": "mean: 408.94165529528914 usec\nrounds: 2521"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 140.3266108795819,
            "unit": "iter/sec",
            "range": "stddev: 0.0004621723263409449",
            "extra": "mean: 7.126232107594528 msec\nrounds: 158"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 128.35875016560436,
            "unit": "iter/sec",
            "range": "stddev: 0.0006000675936759061",
            "extra": "mean: 7.790664825809165 msec\nrounds: 155"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 134.25548193693984,
            "unit": "iter/sec",
            "range": "stddev: 0.00044675464077812284",
            "extra": "mean: 7.448485421769986 msec\nrounds: 147"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 35.946170504742106,
            "unit": "iter/sec",
            "range": "stddev: 0.00026291788276336305",
            "extra": "mean: 27.819375081083468 msec\nrounds: 37"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 35.676532022935575,
            "unit": "iter/sec",
            "range": "stddev: 0.0004076566825601999",
            "extra": "mean: 28.02963021621957 msec\nrounds: 37"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 9816.365107183054,
            "unit": "iter/sec",
            "range": "stddev: 0.0000065311669758162175",
            "extra": "mean: 101.87070153577083 usec\nrounds: 10219"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 997260.3779139066,
            "unit": "iter/sec",
            "range": "stddev: 1.0212479508224979e-7",
            "extra": "mean: 1.0027471482340693 usec\nrounds: 102691"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3264656.292725803,
            "unit": "iter/sec",
            "range": "stddev: 4.559370739563625e-8",
            "extra": "mean: 306.31095905200385 nsec\nrounds: 199641"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1590184.163951184,
            "unit": "iter/sec",
            "range": "stddev: 7.130163353858193e-8",
            "extra": "mean: 628.8579792640284 nsec\nrounds: 164990"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 152773.53619349422,
            "unit": "iter/sec",
            "range": "stddev: 0.0000010192275954106561",
            "extra": "mean: 6.5456362725901505 usec\nrounds: 170911"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 1214.9823291153118,
            "unit": "iter/sec",
            "range": "stddev: 0.00001892893986156355",
            "extra": "mean: 823.0572379831639 usec\nrounds: 1269"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 120.10279783541169,
            "unit": "iter/sec",
            "range": "stddev: 0.00009320992708369579",
            "extra": "mean: 8.326200704919424 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 18.215964591402436,
            "unit": "iter/sec",
            "range": "stddev: 0.0020756229511872722",
            "extra": "mean: 54.896900736839356 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 120.26273543380753,
            "unit": "iter/sec",
            "range": "stddev: 0.00005893178834476374",
            "extra": "mean: 8.31512767768698 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 107.95061680580069,
            "unit": "iter/sec",
            "range": "stddev: 0.00022251466584237352",
            "extra": "mean: 9.263495009009205 msec\nrounds: 111"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 118.64521007456034,
            "unit": "iter/sec",
            "range": "stddev: 0.00005765388692083321",
            "extra": "mean: 8.428490280994646 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 160.49250106767792,
            "unit": "iter/sec",
            "range": "stddev: 0.00009895012530728302",
            "extra": "mean: 6.2308207134133395 msec\nrounds: 164"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 1260.2594174986432,
            "unit": "iter/sec",
            "range": "stddev: 0.000018773894838754017",
            "extra": "mean: 793.4874249817511 usec\nrounds: 1313"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 120.30423398510914,
            "unit": "iter/sec",
            "range": "stddev: 0.00005198256267938195",
            "extra": "mean: 8.312259401641482 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 119.83175982376699,
            "unit": "iter/sec",
            "range": "stddev: 0.00008787654747611926",
            "extra": "mean: 8.34503308196984 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 28340.345547267938,
            "unit": "iter/sec",
            "range": "stddev: 0.000002519622066049561",
            "extra": "mean: 35.285384870559625 usec\nrounds: 29228"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 50.90462583987648,
            "unit": "iter/sec",
            "range": "stddev: 0.013912288917652628",
            "extra": "mean: 19.644580104479296 msec\nrounds: 67"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 3.361008335304197,
            "unit": "iter/sec",
            "range": "stddev: 0.002830921932461325",
            "extra": "mean: 297.52975899998546 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.2257269221008256,
            "unit": "iter/sec",
            "range": "stddev: 0.0036327762663173743",
            "extra": "mean: 815.8424050000121 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.13331849276903895,
            "unit": "iter/sec",
            "range": "stddev: 0.09727732985434842",
            "extra": "mean: 7.500834874666642 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.2251941410270548,
            "unit": "iter/sec",
            "range": "stddev: 0.004391695529932511",
            "extra": "mean: 816.1971776666519 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 3.1384018684615573,
            "unit": "iter/sec",
            "range": "stddev: 0.002542029296992333",
            "extra": "mean: 318.6335089999801 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 1.0066147142567419,
            "unit": "iter/sec",
            "range": "stddev: 0.002051709393816822",
            "extra": "mean: 993.4287526666784 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 2.3872240068158734,
            "unit": "iter/sec",
            "range": "stddev: 0.0010269392858181336",
            "extra": "mean: 418.8965916666613 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 3.289407433488978,
            "unit": "iter/sec",
            "range": "stddev: 0.0010748061503280725",
            "extra": "mean: 304.00612274999617 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.2301749651650227,
            "unit": "iter/sec",
            "range": "stddev: 0.0043333099344703",
            "extra": "mean: 812.8924976666667 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.2305496784935768,
            "unit": "iter/sec",
            "range": "stddev: 0.003015240612167919",
            "extra": "mean: 812.6449646666742 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 11340.288153023605,
            "unit": "iter/sec",
            "range": "stddev: 0.000003901612356037798",
            "extra": "mean: 88.18118080477302 usec\nrounds: 11565"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 289.9681597601042,
            "unit": "iter/sec",
            "range": "stddev: 0.0000361988219127315",
            "extra": "mean: 3.448654503402435 msec\nrounds: 294"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 29.059860165978122,
            "unit": "iter/sec",
            "range": "stddev: 0.0014305240464714",
            "extra": "mean: 34.41172787096724 msec\nrounds: 31"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 17.507499547066608,
            "unit": "iter/sec",
            "range": "stddev: 0.0015048070308531347",
            "extra": "mean: 57.11837931576874 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.556985316422843,
            "unit": "iter/sec",
            "range": "stddev: 0.0017268460334128875",
            "extra": "mean: 179.95368766670103 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 17.708757879435854,
            "unit": "iter/sec",
            "range": "stddev: 0.0013752567744382536",
            "extra": "mean: 56.469234421079385 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 21.79128680872875,
            "unit": "iter/sec",
            "range": "stddev: 0.0018542199232643233",
            "extra": "mean: 45.889901260876364 msec\nrounds: 23"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 17.984320296518906,
            "unit": "iter/sec",
            "range": "stddev: 0.0009299816638097145",
            "extra": "mean: 55.603991894737476 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 17.289304949014454,
            "unit": "iter/sec",
            "range": "stddev: 0.001270773975868798",
            "extra": "mean: 57.839225055545285 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 29.239188523779085,
            "unit": "iter/sec",
            "range": "stddev: 0.0014959498998395528",
            "extra": "mean: 34.20067554839079 msec\nrounds: 31"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 17.817677672357135,
            "unit": "iter/sec",
            "range": "stddev: 0.001383783754696893",
            "extra": "mean: 56.124036947386756 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 17.759150933424944,
            "unit": "iter/sec",
            "range": "stddev: 0.0016959277377017507",
            "extra": "mean: 56.308998315785175 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 21634.88649122908,
            "unit": "iter/sec",
            "range": "stddev: 0.0000026757751667644047",
            "extra": "mean: 46.22164301187373 usec\nrounds: 22152"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 46.327834405448435,
            "unit": "iter/sec",
            "range": "stddev: 0.015185615721961138",
            "extra": "mean: 21.585295596773978 msec\nrounds: 62"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 172.17513332387918,
            "unit": "iter/sec",
            "range": "stddev: 0.00002677128999104223",
            "extra": "mean: 5.80803964367431 msec\nrounds: 174"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.300997857463418,
            "unit": "iter/sec",
            "range": "stddev: 0.00013719820272666488",
            "extra": "mean: 69.92519053333885 msec\nrounds: 15"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
            "value": 1.1763978144211313,
            "unit": "iter/sec",
            "range": "stddev: 0.00895820682968673",
            "extra": "mean: 850.052582333357 msec\nrounds: 3"
          }
        ]
      }
    ]
  }
}