window.BENCHMARK_DATA = {
  "lastUpdate": 1768391749092,
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
          "id": "b4de7570787301104da210c6eb92a171800fd3e7",
          "message": "feat(ui): enhance UI with dark mode, new options, and CLI entry point (#161)\n\n* feat(ui): enhance UI with dark mode, new options, and CLI entry point\n\n- Add dark/light theme toggle with system preference detection\n- Add mmgpy-ui CLI entry point for running via uvx\n- Add missing MMG options: hsiz, levelset isovalue, mem, nreg\n- Reorganize UI with section headers and icons\n- Add Default preset that uses MMG's internal defaults\n- Move sample mesh menu to drawer next to Import Mesh\n- Rename Upload to Import for mesh/solution files\n- Fix footer to show mmgpy version and GitHub link\n- Update viewer colors (axes, scalar bar) for dark mode\n- Make all size parameters clearable (hausd, hgrad, ar, hmax)\n\n* fix(ui): restore optimize preset for backwards compatibility\n\n* test(ui): add test for default preset\n\n* ci: add codecov config to exclude untestable UI files\n\n* revert: remove codecov.yml\n\n* feat(ui): add boundary refs visualization, opnbdy option, and right drawer\n\n- Add \"Boundary Refs\" visualization for tetrahedral meshes to show\n  boundary triangle refs separately from element refs\n- Add \"Open Boundary\" (opnbdy) option for tetrahedral meshes with\n  multiple boundary regions to preserve internal surfaces during remesh\n- Convert right info panel to navigation drawer to fix scroll isolation\n  (scrolling in info panel no longer zooms the 3D viewer)\n- Preserve boundary triangle refs during PyVista round-trip in remeshing\n- Fix mesh type detection for files with both Triangles and Tetrahedra\n- Add edge length statistics and colormap visualization\n- Preserve element refs during PyVista round-trip conversions\n- Add refs visualization option and auto-detect multi-material meshes\n\n* feat(ui): add toggle to view original mesh before remeshing\n\n- Add \"Show Original\" button in viewer toolbar (clock icon)\n- Button only appears when original mesh is available\n- Toggle switches between current and original mesh display\n- Useful for comparing before/after remeshing results\n\n* fix(ui): fix original mesh toggle tooltip and icon\n\n* refactor(ui): move original mesh toggle to drawer as switch\n\n- Remove toggle button from viewer toolbar\n- Add discrete switch in left drawer (after solution options)\n- Switch only appears after remeshing (when comparison is useful)\n- Uses warning color when enabled for visibility\n\n* test: add tests for new UI state and mesh type detection\n\n- Add tests for DEFAULT_STATE configuration (viewer settings, original\n  mesh toggle, slice settings, theme)\n- Add test for mesh type detection when Triangles appear before\n  Tetrahedra in Medit files (fixes island.mesh detection)\n\n* ci: add codecov config to exclude untestable UI files\n\n* ci: exclude ui entry points from coverage\n\n* fix: remove dead code branches in pyvista refs handling\n\n* ci: use glob patterns in codecov ignore\n\n* ci: lower patch coverage target to 70% for UI changes",
          "timestamp": "2026-01-14T12:45:34+01:00",
          "tree_id": "6a06e9db887ac4eba3d7e0582b5744866ea39cbc",
          "url": "https://github.com/kmarchais/mmgpy/commit/b4de7570787301104da210c6eb92a171800fd3e7"
        },
        "date": 1768391747937,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 0.6220054476841878,
            "unit": "iter/sec",
            "range": "stddev: 0.0016057408503480696",
            "extra": "mean: 1.607702961000001 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.6158344848127877,
            "unit": "iter/sec",
            "range": "stddev: 0.009342581406227284",
            "extra": "mean: 1.6238129313333236 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.1066304651839198,
            "unit": "iter/sec",
            "range": "stddev: 0.0066113525205084124",
            "extra": "mean: 903.6440179999943 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.1526492672300155,
            "unit": "iter/sec",
            "range": "stddev: 0.004919347867686037",
            "extra": "mean: 867.566595000009 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 0.626606625523363,
            "unit": "iter/sec",
            "range": "stddev: 0.0050606765106166835",
            "extra": "mean: 1.5958975843333387 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.6173640240014954,
            "unit": "iter/sec",
            "range": "stddev: 0.004513049776646591",
            "extra": "mean: 1.6197898826666612 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.1542858661721598,
            "unit": "iter/sec",
            "range": "stddev: 0.004178601421810663",
            "extra": "mean: 866.3365196666556 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.1539744709251332,
            "unit": "iter/sec",
            "range": "stddev: 0.0015811492258366233",
            "extra": "mean: 866.5702969999908 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 1.3905697838923856,
            "unit": "iter/sec",
            "range": "stddev: 0.005840239651922456",
            "extra": "mean: 719.129677333323 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.3746268029702382,
            "unit": "iter/sec",
            "range": "stddev: 0.007666089472460964",
            "extra": "mean: 727.4701743333102 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 121.75203997606052,
            "unit": "iter/sec",
            "range": "stddev: 0.00008611025285617323",
            "extra": "mean: 8.213414741934713 msec\nrounds: 124"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 1.2815634866753067,
            "unit": "iter/sec",
            "range": "stddev: 0.001250858868909716",
            "extra": "mean: 780.2968876666796 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 1.262403980701085,
            "unit": "iter/sec",
            "range": "stddev: 0.00834325743554939",
            "extra": "mean: 792.1394540000127 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 12.572760438481131,
            "unit": "iter/sec",
            "range": "stddev: 0.0022396287185666554",
            "extra": "mean: 79.53702807693091 msec\nrounds: 13"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 413.62260041548797,
            "unit": "iter/sec",
            "range": "stddev: 0.0001596807787712858",
            "extra": "mean: 2.4176628622214795 msec\nrounds: 450"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 12.119999465825789,
            "unit": "iter/sec",
            "range": "stddev: 0.0014402929207413596",
            "extra": "mean: 82.50825446153314 msec\nrounds: 13"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 250.4229564311822,
            "unit": "iter/sec",
            "range": "stddev: 0.00012399235040450485",
            "extra": "mean: 3.993244126861055 msec\nrounds: 268"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 227.39195875333053,
            "unit": "iter/sec",
            "range": "stddev: 0.0004105011316795098",
            "extra": "mean: 4.3976928888887254 msec\nrounds: 252"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 305.3786672313886,
            "unit": "iter/sec",
            "range": "stddev: 0.00006833112492163106",
            "extra": "mean: 3.274622975685101 msec\nrounds: 329"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 39.609430820503114,
            "unit": "iter/sec",
            "range": "stddev: 0.0010957521863799934",
            "extra": "mean: 25.246512744191417 msec\nrounds: 43"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 1019.0058137856498,
            "unit": "iter/sec",
            "range": "stddev: 0.00013537220790133612",
            "extra": "mean: 981.3486699206923 usec\nrounds: 1127"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 12.436978065174296,
            "unit": "iter/sec",
            "range": "stddev: 0.0007853261123025557",
            "extra": "mean: 80.40538423077018 msec\nrounds: 13"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 2210.1034646304247,
            "unit": "iter/sec",
            "range": "stddev: 0.00001630075706120646",
            "extra": "mean: 452.46750480399834 usec\nrounds: 2290"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 41.82916564718732,
            "unit": "iter/sec",
            "range": "stddev: 0.0006175179334218024",
            "extra": "mean: 23.906764204541144 msec\nrounds: 44"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 93472.12866991064,
            "unit": "iter/sec",
            "range": "stddev: 7.580110418342158e-7",
            "extra": "mean: 10.698376235031729 usec\nrounds: 100594"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
            "value": 26530.933282821457,
            "unit": "iter/sec",
            "range": "stddev: 0.0000018995201449464613",
            "extra": "mean: 37.691851596019475 usec\nrounds: 31704"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
            "value": 5594.133176675392,
            "unit": "iter/sec",
            "range": "stddev: 0.000003972094131282285",
            "extra": "mean: 178.7587045960001 usec\nrounds: 5853"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 12.759125419914799,
            "unit": "iter/sec",
            "range": "stddev: 0.001041815436417195",
            "extra": "mean: 78.37527785714623 msec\nrounds: 14"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 12.426816458518246,
            "unit": "iter/sec",
            "range": "stddev: 0.004879254857296602",
            "extra": "mean: 80.47113299999913 msec\nrounds: 14"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 12.598191955556759,
            "unit": "iter/sec",
            "range": "stddev: 0.0012736428814132156",
            "extra": "mean: 79.37646953846613 msec\nrounds: 13"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 1497.0379189164253,
            "unit": "iter/sec",
            "range": "stddev: 0.000006275372031662432",
            "extra": "mean: 667.9857519733451 usec\nrounds: 1520"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 1427.3158926060837,
            "unit": "iter/sec",
            "range": "stddev: 0.000008070660150783545",
            "extra": "mean: 700.6157537937427 usec\nrounds: 1450"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 1239.3015430408136,
            "unit": "iter/sec",
            "range": "stddev: 0.000006809575962172706",
            "extra": "mean: 806.9061203186666 usec\nrounds: 1255"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 53.00387236825566,
            "unit": "iter/sec",
            "range": "stddev: 0.0004286957632172068",
            "extra": "mean: 18.866546071432058 msec\nrounds: 56"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 52.760792210151614,
            "unit": "iter/sec",
            "range": "stddev: 0.0007054140327464493",
            "extra": "mean: 18.953468250000835 msec\nrounds: 56"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 50.80424775332155,
            "unit": "iter/sec",
            "range": "stddev: 0.00045858702213120344",
            "extra": "mean: 19.68339349999766 msec\nrounds: 54"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 12.829122324672552,
            "unit": "iter/sec",
            "range": "stddev: 0.0010514152158016532",
            "extra": "mean: 77.9476549285708 msec\nrounds: 14"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 12.903583764947639,
            "unit": "iter/sec",
            "range": "stddev: 0.0009882741815895974",
            "extra": "mean: 77.4978500714261 msec\nrounds: 14"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 3600.0559699243613,
            "unit": "iter/sec",
            "range": "stddev: 0.000004337564138997055",
            "extra": "mean: 277.7734591779167 usec\nrounds: 3650"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 1053181.6087628964,
            "unit": "iter/sec",
            "range": "stddev: 6.558533924922932e-8",
            "extra": "mean: 949.503857340079 nsec\nrounds: 110024"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3309797.7464538612,
            "unit": "iter/sec",
            "range": "stddev: 4.06042067301705e-8",
            "extra": "mean: 302.1332651130742 nsec\nrounds: 190513"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1607064.619186062,
            "unit": "iter/sec",
            "range": "stddev: 5.111999668080332e-8",
            "extra": "mean: 622.2525143428738 nsec\nrounds: 164258"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 137194.73426598584,
            "unit": "iter/sec",
            "range": "stddev: 5.503914675326939e-7",
            "extra": "mean: 7.288909485849896 usec\nrounds: 139978"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 712.5608960627135,
            "unit": "iter/sec",
            "range": "stddev: 0.000012252205418089352",
            "extra": "mean: 1.4033888268715615 msec\nrounds: 722"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 121.59866440300337,
            "unit": "iter/sec",
            "range": "stddev: 0.0000925985334534782",
            "extra": "mean: 8.223774536583653 msec\nrounds: 123"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 19.45699814288386,
            "unit": "iter/sec",
            "range": "stddev: 0.00011446260870413976",
            "extra": "mean: 51.395389600000385 msec\nrounds: 20"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 120.32417527998848,
            "unit": "iter/sec",
            "range": "stddev: 0.0001357279611313021",
            "extra": "mean: 8.310881813010967 msec\nrounds: 123"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 109.23877071863001,
            "unit": "iter/sec",
            "range": "stddev: 0.0001276240501855731",
            "extra": "mean: 9.15425900000041 msec\nrounds: 112"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 119.58940995393739,
            "unit": "iter/sec",
            "range": "stddev: 0.0001091631720729968",
            "extra": "mean: 8.361944426226142 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 150.79779672278553,
            "unit": "iter/sec",
            "range": "stddev: 0.0000908540737298645",
            "extra": "mean: 6.631396623375864 msec\nrounds: 154"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 724.2719158716167,
            "unit": "iter/sec",
            "range": "stddev: 0.000009625801092488701",
            "extra": "mean: 1.3806969151862827 msec\nrounds: 731"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 122.14847476320185,
            "unit": "iter/sec",
            "range": "stddev: 0.00005778309398377671",
            "extra": "mean: 8.186757975804522 msec\nrounds: 124"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 120.69619594293262,
            "unit": "iter/sec",
            "range": "stddev: 0.00021732269967973206",
            "extra": "mean: 8.285265266129999 msec\nrounds: 124"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 29671.297785552535,
            "unit": "iter/sec",
            "range": "stddev: 0.0000014300341964276153",
            "extra": "mean: 33.70260401912441 usec\nrounds: 30355"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 47.620275222963336,
            "unit": "iter/sec",
            "range": "stddev: 0.015224956284746677",
            "extra": "mean: 20.999458640629243 msec\nrounds: 64"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 2.050926822342243,
            "unit": "iter/sec",
            "range": "stddev: 0.003386453351203638",
            "extra": "mean: 487.58443700002846 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.1471857750211796,
            "unit": "iter/sec",
            "range": "stddev: 0.0014424450830230768",
            "extra": "mean: 871.6983960000183 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.11476012953097652,
            "unit": "iter/sec",
            "range": "stddev: 0.026162154778173283",
            "extra": "mean: 8.713827738666643 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.1458374639182323,
            "unit": "iter/sec",
            "range": "stddev: 0.003974432743436077",
            "extra": "mean: 872.7241266666775 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 1.9021234542223011,
            "unit": "iter/sec",
            "range": "stddev: 0.005652874294691093",
            "extra": "mean: 525.728231666676 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 1.0047138171555958,
            "unit": "iter/sec",
            "range": "stddev: 0.0034609193988038075",
            "extra": "mean: 995.3082986666383 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 1.74259535987601,
            "unit": "iter/sec",
            "range": "stddev: 0.003273966856242863",
            "extra": "mean: 573.8566869999886 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 2.024658418815003,
            "unit": "iter/sec",
            "range": "stddev: 0.004771412686711785",
            "extra": "mean: 493.91047433338525 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.148580398656187,
            "unit": "iter/sec",
            "range": "stddev: 0.0021357858176327474",
            "extra": "mean: 870.6399666666584 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.15275586847843,
            "unit": "iter/sec",
            "range": "stddev: 0.0033744099326310077",
            "extra": "mean: 867.4863666666397 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 12856.485570034274,
            "unit": "iter/sec",
            "range": "stddev: 0.0000018934979261651516",
            "extra": "mean: 77.78175416233397 usec\nrounds: 13395"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 298.1152421716273,
            "unit": "iter/sec",
            "range": "stddev: 0.00013755856661226272",
            "extra": "mean: 3.3544074858953103 msec\nrounds: 319"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 16.73521147411197,
            "unit": "iter/sec",
            "range": "stddev: 0.0013576848927053433",
            "extra": "mean: 59.754249388895964 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 12.914980426474953,
            "unit": "iter/sec",
            "range": "stddev: 0.0014698125663137106",
            "extra": "mean: 77.42946307143127 msec\nrounds: 14"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.398231977000721,
            "unit": "iter/sec",
            "range": "stddev: 0.0016270612878072025",
            "extra": "mean: 185.2458368333411 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 12.691941546532448,
            "unit": "iter/sec",
            "range": "stddev: 0.001388891475029144",
            "extra": "mean: 78.79015171427487 msec\nrounds: 14"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 17.009219851205362,
            "unit": "iter/sec",
            "range": "stddev: 0.0024607087129106284",
            "extra": "mean: 58.791644105248885 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 12.893822359631821,
            "unit": "iter/sec",
            "range": "stddev: 0.002030234707274341",
            "extra": "mean: 77.55652064284797 msec\nrounds: 14"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 12.286290026664725,
            "unit": "iter/sec",
            "range": "stddev: 0.0017056177037969582",
            "extra": "mean: 81.39153461538976 msec\nrounds: 13"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 17.271882828571645,
            "unit": "iter/sec",
            "range": "stddev: 0.0011342657136801603",
            "extra": "mean: 57.89756738887616 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 12.981960981028577,
            "unit": "iter/sec",
            "range": "stddev: 0.001723478190402309",
            "extra": "mean: 77.02996500000025 msec\nrounds: 14"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 12.952890351668907,
            "unit": "iter/sec",
            "range": "stddev: 0.0012903586074576063",
            "extra": "mean: 77.20284607142958 msec\nrounds: 14"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 24420.07841960143,
            "unit": "iter/sec",
            "range": "stddev: 0.0000017414105430901518",
            "extra": "mean: 40.94990944817455 usec\nrounds: 24693"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 46.35719665608019,
            "unit": "iter/sec",
            "range": "stddev: 0.014374767001305936",
            "extra": "mean: 21.57162365573804 msec\nrounds: 61"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 184.8286172467657,
            "unit": "iter/sec",
            "range": "stddev: 0.00004774447152592935",
            "extra": "mean: 5.410417579789035 msec\nrounds: 188"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 15.60874183389903,
            "unit": "iter/sec",
            "range": "stddev: 0.00014537708610901619",
            "extra": "mean: 64.06666281251461 msec\nrounds: 16"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
            "value": 1.2053025109604492,
            "unit": "iter/sec",
            "range": "stddev: 0.0020960658766401704",
            "extra": "mean: 829.667233666631 msec\nrounds: 3"
          }
        ]
      }
    ]
  }
}