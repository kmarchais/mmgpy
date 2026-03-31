window.BENCHMARK_DATA = {
  "lastUpdate": 1774987760378,
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
          "id": "3537af2aedad0aa39ade53cd6ac4be4d12b6fb0e",
          "message": "Remove VTK bundling and CI build steps (#204)\n\n* Remove VTK bundling and CI build steps\n\nRemove VTK C++ bundling and related CI plumbing. Deleted VTK helper scripts (.github/scripts/*) and VTK module/filter/optimization logic, removed VTK download/cache/install steps from GitHub workflows, and simplified cibuildwheel repair commands. CMake and extern build files no longer install or expect VTK (USE_VTK set OFF) and VTK RPATH/install logic removed. Python packaging no longer declares VTK in pyproject.toml and tool.mmgpy vtk_version was removed. Native bindings and mesh code were simplified to stop selecting VTK/VTU/VTP load/save paths and always use the MMG loaders. Conda recipe no longer requires VTK. Overall this shifts format conversion out of the C++ build (handled in Python via meshio) and slimmed CI/wheel production by not bundling VTK libraries.\n\n* fix: resolve CI failures from VTK removal\n\n- Add --exclude flags for MMG libs in auditwheel repair command\n- Skip delocate on macOS (RPATH already set by CMake)\n- Add mmgsuite back to conda run dependencies\n- Restore cast() calls and dict[str, Any] for ty type checker\n- Replace .celltypes with .distinct_cell_types (PyVista compat)\n- Update uv.lock to remove stale VTK entries\n\n* fix: mock pyvista .plot() in docs conftest to prevent CI segfaults\n\nVTK rendering can crash in CI environments without proper GL\nlibraries, especially now that VTK is an indirect dependency.\n\n* fix: robust VTK rendering mocks in docs conftest\n\n- Mock Mesh.plot, pv.Plotter with chainable no-op objects\n- Skip bash pip install blocks that fail in managed environments\n\n* fix(ci): install GL libraries for offscreen VTK rendering\n\nPreviously bundled via the VTK apt cache step that was removed\nwith VTK unbundling. Needed for examples and docs that use\nPyVista .plot() in offscreen mode.\n\n* fix: update examples to use .mesh output format\n\nThe low-level mmg*.remesh() API can no longer write .vtk files\nsince VTK was removed from the C++ bindings. Switch to .mesh\noutput and use mmgpy.read().to_pyvista() for visualization.\n\n* test: add coverage for meshio save path\n\n* refactor: in-memory meshio conversion for save(), no temp files\n\nReplace the temp-file round-trip (save .mesh, meshio read, meshio write)\nwith direct in-memory conversion. The new _to_meshio() method extracts\narrays from the C++ impl and builds a meshio.Mesh with geometry,\nreference markers, and user fields (point data).\n\n* test: improve coverage for meshio save with real mesh data\n\nUse cube.mesh asset (has tets, triangles, edges) and test\nround-trip with user fields and surface mesh export.\n\n* fix: in-memory format conversion for remesh() and offscreen doc tests\n\nWrap mmg3d/mmg2d/mmgs.remesh() in Python to handle non-native formats\n(.vtk, .vtu, etc.) via the in-memory path: mmgpy.read() → Mesh.remesh()\n→ Mesh.save(). No temporary files are created. Native formats (.mesh,\n.meshb) still pass through directly to the C++ API.\n\nReplace _FakePlotter/_FakeObj no-op patches in docs/conftest.py with\npv.OFF_SCREEN = True so doc code blocks exercise real PyVista code paths\nand catch typos/API misuse.\n\n* fix: warn when sol params are ignored for non-native formats\n\nAdd warnings.warn() in _wrapped_remesh() when input_sol or output_sol\nare provided but the non-native (meshio) path is taken, since these\nparameters are silently discarded.\n\nAlso remove unreferenced example PNG files.\n\n* feat: support input_sol/output_sol for non-native format remeshing\n\nReplace the warnings that discarded sol params with actual\nimplementations:\n- _load_sol: parses .sol files via parse_sol_file and sets the\n  metric/displacement/tensor field on the Mesh object\n- _save_sol: writes the metric field back to Medit .sol format\n\nThis allows workflows like:\n  mmg3d.remesh(\"input.vtk\", input_sol=\"metric.sol\", output_mesh=\"out.vtk\")\n\nNo temporary mesh files are created — the entire pipeline is in-memory.\n\n* feat: lazy field loading for non-native mesh formats\n\nWhen reading non-native formats (VTK, VTU, etc.), point_data fields\nare now preserved as a _LazyFieldSource on the Mesh object. Fields are\nmaterialized on demand when accessed via mesh[\"field_name\"], avoiding\nunnecessary copies.\n\nKey behaviors:\n- mesh[\"temperature\"] works after read(\"mesh.vtk\") if field exists\n- \"temperature\" in mesh returns True without materializing\n- Fields are invalidated after remesh (vertex count changes)\n- transfer_fields=True on remesh preserves fields via interpolation\n- save() materializes all fields for export\n\nAlso adds transfer_fields parameter to mmg3d/mmg2d/mmgs.remesh() for\nnon-native format workflows.\n\n* feat: add input_sol parameter to Mesh.remesh() and load_sol() method\n\nMesh.remesh() now accepts input_sol as a file path (.sol) or numpy\narray to set the metric before remeshing. Also adds Mesh.load_sol()\nfor explicit .sol file loading.\n\nSimplifies the mesh_adaptation_to_a_solution example to use the\nMesh object API instead of the file-based mmg2d.remesh().\n\n* refactor: simplify examples to use Mesh object API\n\nReplace file-based mmgXd.remesh() + mmgpy.read() pattern with\ndirect Mesh object usage: mmgpy.read() -> mesh.remesh() ->\nmesh.to_pyvista(). Removes intermediate output files and unused\nimports.\n\n* refactor: move parse_sol_file to _sol.py and enable musllinux builds\n\nMove parse_sol_file from ui/parsers.py to core _sol.py module to\ndecouple core remeshing from the UI package. Enable musllinux builds\nnow that VTK C++ bundling has been removed.\n\n* fix: expose load_sol on C++ mesh classes and clean up remesh helpers\n\n- Add load_sol() to MmgMesh, MmgMesh2D, MmgMeshS C++ classes,\n  delegating to MMG3D_loadSol/MMG2D_loadSol/MMGS_loadSol which\n  handle both .sol (text) and .solb (binary) natively\n- _load_sol now routes through C++ instead of Python text parsing\n- Remove .sol/.solb from Mesh._NATIVE_EXTENSIONS (save() should\n  not pass sol files to MMG*_saveMesh)\n- _to_meshio: build tuples directly, deduplicate triangle branch,\n  add quad support for 2D meshes\n- _save_sol: use {v:.15g} for full float precision\n- Re-add *-musllinux* to cibuildwheel skip (pyvista -> vtk has\n  no musllinux wheels)\n\n* refactor: review cleanup for PR #204\n\n- Extract path_to_variant() helper in bindings.cpp to deduplicate\n  str/Path conversion across 9 lambdas (constructors, save, load_sol)\n- Use keyword arguments in _wrapped_remesh C++ call for clarity\n- Add warning when _save_sol finds no metric field to write\n\n* refactor: use PyVista for non-native I/O, expose save_sol in C++, fix error handling\n\n- Replace meshio with PyVista for non-native format save/read in Mesh.save()\n  and mmgpy.read(), giving consistent round-trip behavior\n- Add save_sol() to C++ mesh classes (MmgMesh, MmgMesh2D, MmgMeshS) via\n  MMG3D_saveSol/MMG2D_saveSol/MMGS_saveSol, replacing hand-written Python\n  .sol writer in _remesh._save_sol\n- Add variant_to_string() helper in mmg_common.hpp to eliminate duplicated\n  std::visit boilerplate across all C++ mesh classes\n- Fix _wrapped_remesh to propagate remesh success/failure via\n  RemeshResult.success instead of always returning True\n- Consolidate _NATIVE_EXTENSIONS / _NATIVE_MESH_EXTENSIONS into single\n  NATIVE_MESH_EXTENSIONS constant in _remesh.py\n- Handle UnstructuredGrid with triangles/quads in from_pyvista auto-detection\n  (enables .vtu round-trip for 2D and surface meshes)\n\n* test: improve coverage for _remesh, _sol, and non-native I/O paths\n\n- Add test for surface mesh save to .vtu (PolyData → UnstructuredGrid cast)\n- Add test for non-native remesh with output .sol via C++ save_sol\n- Add test for non-native remesh without output files (in-memory only)\n- Add test for Dimension keyword at EOF in .sol parser\n- Add test for multi-solution tensor+scalar parsing in .sol files\n- _remesh.py reaches 100% branch coverage\n\n* refactor: remove dead meshio conversion code from _io.py\n\nThe read() path now uses PyVista for all non-native formats, making\nthe meshio-based conversion functions (_convert_meshio, _meshio_to_mmg3d,\n_meshio_to_mmg2d, _meshio_to_mmgs, _detect_mesh_kind, etc.) dead code.\n\n- Remove ~220 lines of unused meshio conversion helpers and constants\n- Update _cli.py to use mmgpy.read() instead of meshio for mesh type detection\n- Remove test for deleted _meshio_to_pyvista_polydata\n- _io.py coverage rises from 59% to 94%\n\n* fix: clean up stale meshio references, add surface extraction warning\n\n- Replace \"meshio\" with \"PyVista\" in _remesh.py docstrings\n- Update _LazyFieldSource docstring to drop meshio reference\n- Add logging warning when extracting surface from non-tet UnstructuredGrid\n- Document meshio as PyVista fallback reader in _io.py format list\n- Remove extra blank line in CMakeLists.txt\n\n---------\n\nCo-authored-by: Kevin Marchais <kevinmarchais@gmail.com>",
          "timestamp": "2026-03-31T21:59:59+02:00",
          "tree_id": "053e05e55cb02668aafc3e0f0c7d6d644e05ddec",
          "url": "https://github.com/kmarchais/mmgpy/commit/3537af2aedad0aa39ade53cd6ac4be4d12b6fb0e"
        },
        "date": 1774987759979,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 1.0370822306223733,
            "unit": "iter/sec",
            "range": "stddev: 0.033027652686495844",
            "extra": "mean: 964.243693000005 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.5292610267134573,
            "unit": "iter/sec",
            "range": "stddev: 0.02259484302664659",
            "extra": "mean: 1.8894268603333255 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.0541869567142987,
            "unit": "iter/sec",
            "range": "stddev: 0.004538908123635015",
            "extra": "mean: 948.5983426666659 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.1103448165057275,
            "unit": "iter/sec",
            "range": "stddev: 0.006692411963212063",
            "extra": "mean: 900.6211270000032 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 1.0508117959837897,
            "unit": "iter/sec",
            "range": "stddev: 0.008307175038146566",
            "extra": "mean: 951.6451983333335 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.544688965109144,
            "unit": "iter/sec",
            "range": "stddev: 0.00552425617060003",
            "extra": "mean: 1.835910150666668 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.142527657031776,
            "unit": "iter/sec",
            "range": "stddev: 0.011340253653165051",
            "extra": "mean: 875.2523353333478 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.141493040844305,
            "unit": "iter/sec",
            "range": "stddev: 0.008916871733075468",
            "extra": "mean: 876.0456386666627 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 55.24273715822616,
            "unit": "iter/sec",
            "range": "stddev: 0.0008701106197530941",
            "extra": "mean: 18.10192708474603 msec\nrounds: 59"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.1635686434335792,
            "unit": "iter/sec",
            "range": "stddev: 0.00949647851095737",
            "extra": "mean: 859.4250159999982 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 114.18048467377784,
            "unit": "iter/sec",
            "range": "stddev: 0.00024390426500831624",
            "extra": "mean: 8.758064067227203 msec\nrounds: 119"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 13.678573867823626,
            "unit": "iter/sec",
            "range": "stddev: 0.0017574523907787024",
            "extra": "mean: 73.10703657143084 msec\nrounds: 14"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 1.0886502343071285,
            "unit": "iter/sec",
            "range": "stddev: 0.008358830496656172",
            "extra": "mean: 918.5686720000111 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 15.133094034536192,
            "unit": "iter/sec",
            "range": "stddev: 0.0024386156230666233",
            "extra": "mean: 66.08034006250385 msec\nrounds: 16"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 346.7208861081726,
            "unit": "iter/sec",
            "range": "stddev: 0.000533991156708408",
            "extra": "mean: 2.8841642948732322 msec\nrounds: 390"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 25.639163356345673,
            "unit": "iter/sec",
            "range": "stddev: 0.001246964316023958",
            "extra": "mean: 39.002832740737645 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 158.67087581073253,
            "unit": "iter/sec",
            "range": "stddev: 0.0006620257071571867",
            "extra": "mean: 6.302353818181672 msec\nrounds: 176"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 245.904052512317,
            "unit": "iter/sec",
            "range": "stddev: 0.00014077281387210927",
            "extra": "mean: 4.066626758621277 msec\nrounds: 261"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 261.06079841021227,
            "unit": "iter/sec",
            "range": "stddev: 0.00038613915049181836",
            "extra": "mean: 3.830525326244776 msec\nrounds: 282"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 67.32384502908327,
            "unit": "iter/sec",
            "range": "stddev: 0.0005842837290939428",
            "extra": "mean: 14.853578246578302 msec\nrounds: 73"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 848.9519175022774,
            "unit": "iter/sec",
            "range": "stddev: 0.00005400574716581181",
            "extra": "mean: 1.1779230123445916 msec\nrounds: 891"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 29.15373060975904,
            "unit": "iter/sec",
            "range": "stddev: 0.0006038677049335977",
            "extra": "mean: 34.30092750000426 msec\nrounds: 30"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 1665.9597406862501,
            "unit": "iter/sec",
            "range": "stddev: 0.000019658941918839638",
            "extra": "mean: 600.2546013435326 usec\nrounds: 1786"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 63.80754082220923,
            "unit": "iter/sec",
            "range": "stddev: 0.0007673507725511925",
            "extra": "mean: 15.672128828571529 msec\nrounds: 70"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 90701.70186835989,
            "unit": "iter/sec",
            "range": "stddev: 0.0000011082010076272992",
            "extra": "mean: 11.025151451417662 usec\nrounds: 94796"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
            "value": 26656.405731249193,
            "unit": "iter/sec",
            "range": "stddev: 0.0000023095269947914802",
            "extra": "mean: 37.51443499480143 usec\nrounds: 27444"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
            "value": 5848.950310573885,
            "unit": "iter/sec",
            "range": "stddev: 0.000008931808687337513",
            "extra": "mean: 170.97084893885557 usec\nrounds: 6600"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 30.44719520623299,
            "unit": "iter/sec",
            "range": "stddev: 0.0006575162931283651",
            "extra": "mean: 32.84374778124999 msec\nrounds: 32"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 29.51998995427101,
            "unit": "iter/sec",
            "range": "stddev: 0.0013702442756067903",
            "extra": "mean: 33.87535028125299 msec\nrounds: 32"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 30.091557716987513,
            "unit": "iter/sec",
            "range": "stddev: 0.000714619617143521",
            "extra": "mean: 33.2319120666682 msec\nrounds: 30"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 3992.2261310292156,
            "unit": "iter/sec",
            "range": "stddev: 0.00000837323402321197",
            "extra": "mean: 250.48681291562886 usec\nrounds: 4212"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 3458.430631231632,
            "unit": "iter/sec",
            "range": "stddev: 0.000009660993604187307",
            "extra": "mean: 289.1484915063557 usec\nrounds: 3591"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 2435.1503109835166,
            "unit": "iter/sec",
            "range": "stddev: 0.000010065828772855458",
            "extra": "mean: 410.65226876944473 usec\nrounds: 2504"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 102.25218987426031,
            "unit": "iter/sec",
            "range": "stddev: 0.0008891317218808661",
            "extra": "mean: 9.779741648855655 msec\nrounds: 131"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 108.16455423697617,
            "unit": "iter/sec",
            "range": "stddev: 0.0008447687095661833",
            "extra": "mean: 9.24517284848338 msec\nrounds: 132"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 100.0465692178169,
            "unit": "iter/sec",
            "range": "stddev: 0.0009648987713915231",
            "extra": "mean: 9.995345245900886 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 29.138094682488546,
            "unit": "iter/sec",
            "range": "stddev: 0.0010100781741280206",
            "extra": "mean: 34.31933387878588 msec\nrounds: 33"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 28.605395672819036,
            "unit": "iter/sec",
            "range": "stddev: 0.0010780739937363202",
            "extra": "mean: 34.958439709687504 msec\nrounds: 31"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 9409.721681050332,
            "unit": "iter/sec",
            "range": "stddev: 0.000005084120646293671",
            "extra": "mean: 106.27306884260342 usec\nrounds: 10110"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 913959.6560781621,
            "unit": "iter/sec",
            "range": "stddev: 1.2515896884722168e-7",
            "extra": "mean: 1.0941401990226138 usec\nrounds: 95970"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3344141.8606527904,
            "unit": "iter/sec",
            "range": "stddev: 4.680291486126997e-8",
            "extra": "mean: 299.03037660154644 nsec\nrounds: 198060"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1599388.4475294643,
            "unit": "iter/sec",
            "range": "stddev: 8.22205604796942e-8",
            "extra": "mean: 625.2389790264367 nsec\nrounds: 166918"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 159898.41804797234,
            "unit": "iter/sec",
            "range": "stddev: 0.0000010124326539551842",
            "extra": "mean: 6.253970565862524 usec\nrounds: 172385"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 1181.9049574183573,
            "unit": "iter/sec",
            "range": "stddev: 0.00003296813914782029",
            "extra": "mean: 846.0917214395196 usec\nrounds: 1278"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 112.96604083905699,
            "unit": "iter/sec",
            "range": "stddev: 0.00022856673614082948",
            "extra": "mean: 8.85221782203293 msec\nrounds: 118"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 18.05243563280757,
            "unit": "iter/sec",
            "range": "stddev: 0.00027784733124166714",
            "extra": "mean: 55.39418726316638 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 115.52347393382342,
            "unit": "iter/sec",
            "range": "stddev: 0.00017411726930119007",
            "extra": "mean: 8.656249383331744 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 106.15394480133854,
            "unit": "iter/sec",
            "range": "stddev: 0.00023782657896630503",
            "extra": "mean: 9.420281100918547 msec\nrounds: 109"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 115.18240641590135,
            "unit": "iter/sec",
            "range": "stddev: 0.0002009728489322785",
            "extra": "mean: 8.681881470588431 msec\nrounds: 119"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 155.02105173992638,
            "unit": "iter/sec",
            "range": "stddev: 0.0001514516081394047",
            "extra": "mean: 6.4507367791418835 msec\nrounds: 163"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 1222.2510707570123,
            "unit": "iter/sec",
            "range": "stddev: 0.000035604959567394916",
            "extra": "mean: 818.1625068085569 usec\nrounds: 1322"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 115.13484318430513,
            "unit": "iter/sec",
            "range": "stddev: 0.00026862190661696464",
            "extra": "mean: 8.685468033332219 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 113.65746483065365,
            "unit": "iter/sec",
            "range": "stddev: 0.00032063437990948504",
            "extra": "mean: 8.798366226890343 msec\nrounds: 119"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 27648.373063162566,
            "unit": "iter/sec",
            "range": "stddev: 0.0000024937580326064247",
            "extra": "mean: 36.16849344862011 usec\nrounds: 28773"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 44.78454132740005,
            "unit": "iter/sec",
            "range": "stddev: 0.020478365875103925",
            "extra": "mean: 22.329133454542735 msec\nrounds: 66"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 2.513771418104389,
            "unit": "iter/sec",
            "range": "stddev: 0.01939324796612847",
            "extra": "mean: 397.8086443333382 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.117189465072279,
            "unit": "iter/sec",
            "range": "stddev: 0.012254245941597202",
            "extra": "mean: 895.1033206666542 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.12523674645489505,
            "unit": "iter/sec",
            "range": "stddev: 0.05234868491260386",
            "extra": "mean: 7.984876869666664 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.1037389082301725,
            "unit": "iter/sec",
            "range": "stddev: 0.00607450264786081",
            "extra": "mean: 906.0113696666576 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 2.392909899854588,
            "unit": "iter/sec",
            "range": "stddev: 0.00843897692976188",
            "extra": "mean: 417.90123399997964 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 0.9026472949085341,
            "unit": "iter/sec",
            "range": "stddev: 0.03705850722593207",
            "extra": "mean: 1.1078524310000073 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 1.9190368952563233,
            "unit": "iter/sec",
            "range": "stddev: 0.002903413385172263",
            "extra": "mean: 521.0947233333059 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 2.4305270030521657,
            "unit": "iter/sec",
            "range": "stddev: 0.007681297204894963",
            "extra": "mean: 411.4334046666575 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.0850118228132273,
            "unit": "iter/sec",
            "range": "stddev: 0.009098275369988333",
            "extra": "mean: 921.6489433333473 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.104939365474441,
            "unit": "iter/sec",
            "range": "stddev: 0.0041792388423387335",
            "extra": "mean: 905.0270370000059 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 11353.477590188782,
            "unit": "iter/sec",
            "range": "stddev: 0.000004076002932898691",
            "extra": "mean: 88.07873993287834 usec\nrounds: 11597"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 282.7144946853049,
            "unit": "iter/sec",
            "range": "stddev: 0.000051135531192343113",
            "extra": "mean: 3.5371373551721135 msec\nrounds: 290"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 21.804628238143415,
            "unit": "iter/sec",
            "range": "stddev: 0.003546902319216183",
            "extra": "mean: 45.861822961543254 msec\nrounds: 26"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 14.424962791145948,
            "unit": "iter/sec",
            "range": "stddev: 0.0030242722431846627",
            "extra": "mean: 69.32426894118582 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.120267864014316,
            "unit": "iter/sec",
            "range": "stddev: 0.004130999530571325",
            "extra": "mean: 195.3022823333299 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 14.769675513698534,
            "unit": "iter/sec",
            "range": "stddev: 0.002239822426531864",
            "extra": "mean: 67.70629450000598 msec\nrounds: 16"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 18.030956984016733,
            "unit": "iter/sec",
            "range": "stddev: 0.002514830559194922",
            "extra": "mean: 55.46017335000215 msec\nrounds: 20"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 13.919217536420108,
            "unit": "iter/sec",
            "range": "stddev: 0.0036282324073344703",
            "extra": "mean: 71.84311886666515 msec\nrounds: 15"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 13.876064398903871,
            "unit": "iter/sec",
            "range": "stddev: 0.004013346016128406",
            "extra": "mean: 72.06654359999902 msec\nrounds: 15"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 21.46444542843711,
            "unit": "iter/sec",
            "range": "stddev: 0.0022468595227210487",
            "extra": "mean: 46.588671639992754 msec\nrounds: 25"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 14.416784092126893,
            "unit": "iter/sec",
            "range": "stddev: 0.0024634977935461813",
            "extra": "mean: 69.36359687498594 msec\nrounds: 16"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 14.746805344996407,
            "unit": "iter/sec",
            "range": "stddev: 0.002636962550350291",
            "extra": "mean: 67.81129719999322 msec\nrounds: 15"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 21560.878169172556,
            "unit": "iter/sec",
            "range": "stddev: 0.000002554522359189542",
            "extra": "mean: 46.380300104370804 usec\nrounds: 22049"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 41.12648586581677,
            "unit": "iter/sec",
            "range": "stddev: 0.022260812116932416",
            "extra": "mean: 24.315230901631036 msec\nrounds: 61"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 171.5851170178854,
            "unit": "iter/sec",
            "range": "stddev: 0.000030954384392927253",
            "extra": "mean: 5.828011294801073 msec\nrounds: 173"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.19073334232756,
            "unit": "iter/sec",
            "range": "stddev: 0.00048330129643060614",
            "extra": "mean: 70.46852166668789 msec\nrounds: 15"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
            "value": 1.094606550035284,
            "unit": "iter/sec",
            "range": "stddev: 0.014735077447468922",
            "extra": "mean: 913.5702686666415 msec\nrounds: 3"
          }
        ]
      }
    ]
  }
}