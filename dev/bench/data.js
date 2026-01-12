window.BENCHMARK_DATA = {
  "lastUpdate": 1768258033125,
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
          "id": "f63ec102c8df146afbde982e6650b8b27543591b",
          "message": "feat: auto-triangulate non-triangular meshes (quads, polygons) (#155)\n\n* feat: auto-triangulate non-triangular meshes (quads, polygons)\n\nMMG only supports triangular elements for 2D and surface meshes.\nThis change automatically triangulates input meshes containing quads\nor other polygons using PyVista's triangulate() method.\n\n- Add _triangulate_if_needed() helper using mesh.is_all_triangles\n- Update _from_pyvista_to_mmg2d() and _from_pyvista_to_mmgs()\n- Update _meshio_to_mmg2d() and _meshio_to_mmgs() for file input\n- Log warning when triangulation occurs to inform users that\n  output will always be triangular\n\nCloses #118\n\n* fix: ensure native byte order in meshio-to-pyvista conversion\n\nAdd tests for coverage: mixed cell types and no-surface-cells error path\n\n* test: add coverage for 2D file triangulation and empty mesh path",
          "timestamp": "2026-01-12T23:37:22+01:00",
          "tree_id": "ef473351969c3c3bec5fab483b4c831cc8d61511",
          "url": "https://github.com/kmarchais/mmgpy/commit/f63ec102c8df146afbde982e6650b8b27543591b"
        },
        "date": 1768258032386,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 0.6375032774043465,
            "unit": "iter/sec",
            "range": "stddev: 0.012271651728252274",
            "extra": "mean: 1.568619386666673 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.6404381625831933,
            "unit": "iter/sec",
            "range": "stddev: 0.0024242219206790606",
            "extra": "mean: 1.561430999 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.1923737065492706,
            "unit": "iter/sec",
            "range": "stddev: 0.0007733354245789852",
            "extra": "mean: 838.6632433333338 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.273433561505465,
            "unit": "iter/sec",
            "range": "stddev: 0.002581595597963836",
            "extra": "mean: 785.2785023333221 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 0.6332762279168618,
            "unit": "iter/sec",
            "range": "stddev: 0.001184729678666079",
            "extra": "mean: 1.5790897493333393 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.6334587641231444,
            "unit": "iter/sec",
            "range": "stddev: 0.007565954187710709",
            "extra": "mean: 1.5786347219999943 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.2599010690403336,
            "unit": "iter/sec",
            "range": "stddev: 0.0012949398792171042",
            "extra": "mean: 793.7131133333347 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.2570813972121886,
            "unit": "iter/sec",
            "range": "stddev: 0.0004482985328741446",
            "extra": "mean: 795.4934359999962 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 1.3160303614977509,
            "unit": "iter/sec",
            "range": "stddev: 0.001025525480464212",
            "extra": "mean: 759.8608886666701 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.2766118799685267,
            "unit": "iter/sec",
            "range": "stddev: 0.014640662750731342",
            "extra": "mean: 783.3234326666721 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 120.49345467212314,
            "unit": "iter/sec",
            "range": "stddev: 0.000046449089903649",
            "extra": "mean: 8.299205983603985 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 1.2251558751628604,
            "unit": "iter/sec",
            "range": "stddev: 0.0038580223966390463",
            "extra": "mean: 816.2226703333317 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 1.2238752202327283,
            "unit": "iter/sec",
            "range": "stddev: 0.002893344099545988",
            "extra": "mean: 817.0767603333312 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 16.58393615656846,
            "unit": "iter/sec",
            "range": "stddev: 0.0007260612894326124",
            "extra": "mean: 60.29931558823123 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 371.684956931167,
            "unit": "iter/sec",
            "range": "stddev: 0.0001265149993801279",
            "extra": "mean: 2.6904505586035645 msec\nrounds: 401"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 24.893823700927037,
            "unit": "iter/sec",
            "range": "stddev: 0.00017450916639254587",
            "extra": "mean: 40.17060665384083 msec\nrounds: 26"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 165.56980110972074,
            "unit": "iter/sec",
            "range": "stddev: 0.0001694825984243712",
            "extra": "mean: 6.039748754287108 msec\nrounds: 175"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 256.86558094450845,
            "unit": "iter/sec",
            "range": "stddev: 0.000053679074281482955",
            "extra": "mean: 3.8930867900749746 msec\nrounds: 262"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 274.78311808144065,
            "unit": "iter/sec",
            "range": "stddev: 0.00017680446567804462",
            "extra": "mean: 3.639233759999835 msec\nrounds: 300"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 66.03300912051593,
            "unit": "iter/sec",
            "range": "stddev: 0.00010191226327326796",
            "extra": "mean: 15.143941088235339 msec\nrounds: 68"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 928.7649482652853,
            "unit": "iter/sec",
            "range": "stddev: 0.000046217342078356027",
            "extra": "mean: 1.0766986866459216 msec\nrounds: 951"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 27.029666881005145,
            "unit": "iter/sec",
            "range": "stddev: 0.0003465879679078779",
            "extra": "mean: 36.996386392861574 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 1969.4481633224354,
            "unit": "iter/sec",
            "range": "stddev: 0.000020153454781920085",
            "extra": "mean: 507.75644600516523 usec\nrounds: 2065"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 67.44079228808044,
            "unit": "iter/sec",
            "range": "stddev: 0.00012691765142420922",
            "extra": "mean: 14.827821057148833 msec\nrounds: 70"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 90794.90113691767,
            "unit": "iter/sec",
            "range": "stddev: 9.058793956763015e-7",
            "extra": "mean: 11.013834339573886 usec\nrounds: 92593"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
            "value": 25819.729017848753,
            "unit": "iter/sec",
            "range": "stddev: 0.0000019596124862049596",
            "extra": "mean: 38.73007339886164 usec\nrounds: 26281"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
            "value": 6407.3008050542985,
            "unit": "iter/sec",
            "range": "stddev: 0.000004707711372941541",
            "extra": "mean: 156.07196078747634 usec\nrounds: 6554"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 28.006073822084186,
            "unit": "iter/sec",
            "range": "stddev: 0.00022990797552825283",
            "extra": "mean: 35.70654017241968 msec\nrounds: 29"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 27.723086951771943,
            "unit": "iter/sec",
            "range": "stddev: 0.00030413074594024404",
            "extra": "mean: 36.07101913793493 msec\nrounds: 29"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 27.639661921012994,
            "unit": "iter/sec",
            "range": "stddev: 0.00019505777315442096",
            "extra": "mean: 36.179892607143366 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 3879.340144242434,
            "unit": "iter/sec",
            "range": "stddev: 0.000006556958845189647",
            "extra": "mean: 257.77579764026655 usec\nrounds: 3983"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 3349.606951940451,
            "unit": "iter/sec",
            "range": "stddev: 0.000011339064222374112",
            "extra": "mean: 298.54249001384864 usec\nrounds: 3455"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 2382.1762154248663,
            "unit": "iter/sec",
            "range": "stddev: 0.000010418763562268356",
            "extra": "mean: 419.784226508889 usec\nrounds: 2437"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 103.54610063186031,
            "unit": "iter/sec",
            "range": "stddev: 0.00014290533039875203",
            "extra": "mean: 9.657534121495523 msec\nrounds: 107"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 104.22435442066086,
            "unit": "iter/sec",
            "range": "stddev: 0.00016263126031431212",
            "extra": "mean: 9.594686439254792 msec\nrounds: 107"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 103.05558281755026,
            "unit": "iter/sec",
            "range": "stddev: 0.000100308070107018",
            "extra": "mean: 9.70350147619272 msec\nrounds: 105"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 27.559756896672504,
            "unit": "iter/sec",
            "range": "stddev: 0.00032415566571362454",
            "extra": "mean: 36.28479031035057 msec\nrounds: 29"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 26.326447231090317,
            "unit": "iter/sec",
            "range": "stddev: 0.0038902775966941513",
            "extra": "mean: 37.98461642857173 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 9194.174744922324,
            "unit": "iter/sec",
            "range": "stddev: 0.000003980310086206442",
            "extra": "mean: 108.76451968158109 usec\nrounds: 9425"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 1044065.2112938293,
            "unit": "iter/sec",
            "range": "stddev: 8.594740010069217e-8",
            "extra": "mean: 957.7945794791663 nsec\nrounds: 107794"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3337838.492816955,
            "unit": "iter/sec",
            "range": "stddev: 3.9605946105548676e-8",
            "extra": "mean: 299.59508291129276 nsec\nrounds: 194553"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1600352.853240879,
            "unit": "iter/sec",
            "range": "stddev: 6.993013019049088e-8",
            "extra": "mean: 624.8621970929081 nsec\nrounds: 165810"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 155488.2420824536,
            "unit": "iter/sec",
            "range": "stddev: 8.661362032624973e-7",
            "extra": "mean: 6.43135446518015 usec\nrounds: 170911"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 1253.3421776034822,
            "unit": "iter/sec",
            "range": "stddev: 0.00002315885408833064",
            "extra": "mean: 797.8667102004831 usec\nrounds: 1294"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 115.66189516097086,
            "unit": "iter/sec",
            "range": "stddev: 0.0005161689272832158",
            "extra": "mean: 8.645889803277594 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 18.29967403657741,
            "unit": "iter/sec",
            "range": "stddev: 0.0003071495790724805",
            "extra": "mean: 54.645782105254916 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 120.19613996262646,
            "unit": "iter/sec",
            "range": "stddev: 0.00007970625502007563",
            "extra": "mean: 8.319734729509099 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 108.67586811871078,
            "unit": "iter/sec",
            "range": "stddev: 0.00006863476960385134",
            "extra": "mean: 9.201674827273171 msec\nrounds: 110"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 120.27480338972983,
            "unit": "iter/sec",
            "range": "stddev: 0.00003841412299157631",
            "extra": "mean: 8.314293366663605 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 163.2977859184234,
            "unit": "iter/sec",
            "range": "stddev: 0.000057931515922695426",
            "extra": "mean: 6.123781742512769 msec\nrounds: 167"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 1379.8723877781008,
            "unit": "iter/sec",
            "range": "stddev: 0.000052115291350637475",
            "extra": "mean: 724.7046965047404 usec\nrounds: 1430"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 119.14171194106449,
            "unit": "iter/sec",
            "range": "stddev: 0.00045153373189592744",
            "extra": "mean: 8.393366048782877 msec\nrounds: 123"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 118.53411336760702,
            "unit": "iter/sec",
            "range": "stddev: 0.00026202323183232846",
            "extra": "mean: 8.43638992682827 msec\nrounds: 123"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 27685.047380045275,
            "unit": "iter/sec",
            "range": "stddev: 0.000001976242434761356",
            "extra": "mean: 36.12058113076506 usec\nrounds: 28300"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 49.511480387859365,
            "unit": "iter/sec",
            "range": "stddev: 0.014629452685359968",
            "extra": "mean: 20.19733589394367 msec\nrounds: 66"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 3.1969932048723417,
            "unit": "iter/sec",
            "range": "stddev: 0.0053142386165171635",
            "extra": "mean: 312.7939085000122 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.2724215322739592,
            "unit": "iter/sec",
            "range": "stddev: 0.0024981715105428883",
            "extra": "mean: 785.9030789999982 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.13684595992671245,
            "unit": "iter/sec",
            "range": "stddev: 0.3073412040679657",
            "extra": "mean: 7.307486465333341 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.2523033098201586,
            "unit": "iter/sec",
            "range": "stddev: 0.006030984006963721",
            "extra": "mean: 798.5285930000524 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 2.989776141326173,
            "unit": "iter/sec",
            "range": "stddev: 0.003169349888926476",
            "extra": "mean: 334.47320224999544 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 1.0313616058954505,
            "unit": "iter/sec",
            "range": "stddev: 0.004986124572629393",
            "extra": "mean: 969.592036666692 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 2.282312822323922,
            "unit": "iter/sec",
            "range": "stddev: 0.0060426605129642865",
            "extra": "mean: 438.1520316666183 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 3.066986698243028,
            "unit": "iter/sec",
            "range": "stddev: 0.002521678830785542",
            "extra": "mean: 326.0529302500288 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.2358123388315232,
            "unit": "iter/sec",
            "range": "stddev: 0.00812394376331614",
            "extra": "mean: 809.1843466666736 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.2399711771841326,
            "unit": "iter/sec",
            "range": "stddev: 0.022917598007052037",
            "extra": "mean: 806.4703586666534 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 11458.0672221773,
            "unit": "iter/sec",
            "range": "stddev: 0.0000031968996071430247",
            "extra": "mean: 87.27475416311763 usec\nrounds: 11593"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 285.0336030048198,
            "unit": "iter/sec",
            "range": "stddev: 0.00004100852622077549",
            "extra": "mean: 3.5083582758594622 msec\nrounds: 290"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 26.09327949869994,
            "unit": "iter/sec",
            "range": "stddev: 0.001605221783817108",
            "extra": "mean: 38.32404432144391 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 16.509870227799823,
            "unit": "iter/sec",
            "range": "stddev: 0.0018919572838635831",
            "extra": "mean: 60.569827999990544 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.430229415436154,
            "unit": "iter/sec",
            "range": "stddev: 0.0019062456595805802",
            "extra": "mean: 184.1542821666735 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 16.472771665648285,
            "unit": "iter/sec",
            "range": "stddev: 0.002026555996787949",
            "extra": "mean: 60.7062381666689 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 20.122400464374696,
            "unit": "iter/sec",
            "range": "stddev: 0.0027197117702322036",
            "extra": "mean: 49.69586018181231 msec\nrounds: 22"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 16.323280895013884,
            "unit": "iter/sec",
            "range": "stddev: 0.002245068069996594",
            "extra": "mean: 61.26219394444535 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 16.231774834319,
            "unit": "iter/sec",
            "range": "stddev: 0.0020891900804933684",
            "extra": "mean: 61.60755741175576 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 25.98993545506359,
            "unit": "iter/sec",
            "range": "stddev: 0.0017849845481334135",
            "extra": "mean: 38.47643260711412 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 16.57969787680611,
            "unit": "iter/sec",
            "range": "stddev: 0.0019350799555600147",
            "extra": "mean: 60.31472994444206 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 16.823103255179937,
            "unit": "iter/sec",
            "range": "stddev: 0.0017646668230690624",
            "extra": "mean: 59.44206516666858 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 21690.529722132615,
            "unit": "iter/sec",
            "range": "stddev: 0.0000023165154483298637",
            "extra": "mean: 46.10306953359551 usec\nrounds: 22162"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 45.304975399448836,
            "unit": "iter/sec",
            "range": "stddev: 0.016056266142810152",
            "extra": "mean: 22.072630901641894 msec\nrounds: 61"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 172.8260309660492,
            "unit": "iter/sec",
            "range": "stddev: 0.000033291045718311715",
            "extra": "mean: 5.786165396556755 msec\nrounds: 174"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.096932157679424,
            "unit": "iter/sec",
            "range": "stddev: 0.00026956659593307437",
            "extra": "mean: 70.93742019998597 msec\nrounds: 15"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
            "value": 1.1375108604465793,
            "unit": "iter/sec",
            "range": "stddev: 0.001433654435368126",
            "extra": "mean: 879.112485666648 msec\nrounds: 3"
          }
        ]
      }
    ]
  }
}