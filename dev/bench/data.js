window.BENCHMARK_DATA = {
  "lastUpdate": 1775036137523,
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
          "id": "a46145b33ed8deecf16469a555c98eea0b0291c1",
          "message": "feat: add advanced topology queries (#211)\n\n* feat: add advanced topology queries\n\nExpose tet-from-tria, tri-from-edge, and non-boundary element queries:\n\n- MmgMesh3D: get_tet_from_tria, get_tets_from_tria,\n  get_non_boundary_triangles\n- MmgMesh2D: get_tri_from_edge, get_tris_from_edge,\n  get_non_boundary_edges\n- MmgMeshS: get_non_boundary_edges\n\nNote: get_tet_from_tria and get_tri_from_edge require remesh() to be\ncalled first to build adjacency tables.\n\nPartial fix for #207 (priority 4: advanced topology queries).\n\n* fix: improve topology query tests and docstrings\n\n- Replace silent `if` guards with `assert` in topology tests to catch\n  unexpected zero-element meshes\n- Add missing `get_tris_from_edge` invalid index test for 2D\n- Clarify local face/edge index ranges in type stub docstrings",
          "timestamp": "2026-04-01T11:27:09+02:00",
          "tree_id": "f92cf43d74409d8c05ef103486a32687e9ba6909",
          "url": "https://github.com/kmarchais/mmgpy/commit/a46145b33ed8deecf16469a555c98eea0b0291c1"
        },
        "date": 1775036137035,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 1.2089008755404567,
            "unit": "iter/sec",
            "range": "stddev: 0.012520492995260613",
            "extra": "mean: 827.1976803333322 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.6080737564603362,
            "unit": "iter/sec",
            "range": "stddev: 0.027162658012117043",
            "extra": "mean: 1.6445373433333306 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.2139325235372187,
            "unit": "iter/sec",
            "range": "stddev: 0.0029197183255760344",
            "extra": "mean: 823.7690156666607 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.2711356124892006,
            "unit": "iter/sec",
            "range": "stddev: 0.0020926090895620523",
            "extra": "mean: 786.6981226666686 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 1.2069796266751431,
            "unit": "iter/sec",
            "range": "stddev: 0.006921032404799173",
            "extra": "mean: 828.5143989999995 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.6001186559407492,
            "unit": "iter/sec",
            "range": "stddev: 0.025785599377368407",
            "extra": "mean: 1.6663371319999953 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.2787700319245534,
            "unit": "iter/sec",
            "range": "stddev: 0.0011523017606794935",
            "extra": "mean: 782.0014350000027 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.2779185807401996,
            "unit": "iter/sec",
            "range": "stddev: 0.00038046847075781133",
            "extra": "mean: 782.522466666677 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 59.768693391978545,
            "unit": "iter/sec",
            "range": "stddev: 0.0004963539979953394",
            "extra": "mean: 16.73116715872876 msec\nrounds: 63"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.2357834025327217,
            "unit": "iter/sec",
            "range": "stddev: 0.01901444405773752",
            "extra": "mean: 809.2032939999948 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 118.50284185072363,
            "unit": "iter/sec",
            "range": "stddev: 0.00006111791758257254",
            "extra": "mean: 8.438616191666409 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 16.098670836916046,
            "unit": "iter/sec",
            "range": "stddev: 0.0008937234383255846",
            "extra": "mean: 62.11692941176787 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 1.1723005029530154,
            "unit": "iter/sec",
            "range": "stddev: 0.0018169513814495742",
            "extra": "mean: 853.0236040000053 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 18.10726167913801,
            "unit": "iter/sec",
            "range": "stddev: 0.001259616577687822",
            "extra": "mean: 55.22646205263239 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 369.7023614470572,
            "unit": "iter/sec",
            "range": "stddev: 0.00015240055979426605",
            "extra": "mean: 2.704878584182924 msec\nrounds: 392"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 29.84428800496756,
            "unit": "iter/sec",
            "range": "stddev: 0.00030971941300403074",
            "extra": "mean: 33.50724935483636 msec\nrounds: 31"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 166.26783940200824,
            "unit": "iter/sec",
            "range": "stddev: 0.00025968654328115457",
            "extra": "mean: 6.014392221589918 msec\nrounds: 176"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 257.4251071607149,
            "unit": "iter/sec",
            "range": "stddev: 0.000028907798804072526",
            "extra": "mean: 3.8846249731798026 msec\nrounds: 261"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 281.01378888851815,
            "unit": "iter/sec",
            "range": "stddev: 0.00010617378541355458",
            "extra": "mean: 3.5585442406767918 msec\nrounds: 295"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 76.1755511398636,
            "unit": "iter/sec",
            "range": "stddev: 0.0001624919976358697",
            "extra": "mean: 13.127571576921454 msec\nrounds: 78"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 866.8666465962768,
            "unit": "iter/sec",
            "range": "stddev: 0.000015970169748717406",
            "extra": "mean: 1.1535799697986615 msec\nrounds: 894"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 33.716103327674794,
            "unit": "iter/sec",
            "range": "stddev: 0.00037642827595691557",
            "extra": "mean: 29.65941794285527 msec\nrounds: 35"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 1568.7552918536453,
            "unit": "iter/sec",
            "range": "stddev: 0.00006370884235688324",
            "extra": "mean: 637.4480489040437 usec\nrounds: 1779"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 80.96023111819821,
            "unit": "iter/sec",
            "range": "stddev: 0.00041864364803675854",
            "extra": "mean: 12.351743395347354 msec\nrounds: 86"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 90459.17068240647,
            "unit": "iter/sec",
            "range": "stddev: 0.0000011272285626761742",
            "extra": "mean: 11.054711119460787 usec\nrounds: 92585"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_tetrahedra",
            "value": 26832.24161019786,
            "unit": "iter/sec",
            "range": "stddev: 0.000002422881603789528",
            "extra": "mean: 37.26859703066851 usec\nrounds: 27481"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_triangles_3d",
            "value": 5918.951930452003,
            "unit": "iter/sec",
            "range": "stddev: 0.000005448238467761252",
            "extra": "mean: 168.94882941271572 usec\nrounds: 6589"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 35.559280955127186,
            "unit": "iter/sec",
            "range": "stddev: 0.00028620579104010006",
            "extra": "mean: 28.122053459458744 msec\nrounds: 37"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 35.37974566492713,
            "unit": "iter/sec",
            "range": "stddev: 0.00028493609444763505",
            "extra": "mean: 28.264759432437817 msec\nrounds: 37"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 34.83918392861937,
            "unit": "iter/sec",
            "range": "stddev: 0.00036132324427207163",
            "extra": "mean: 28.7033129722229 msec\nrounds: 36"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 3144.294601632348,
            "unit": "iter/sec",
            "range": "stddev: 0.00001256205393395262",
            "extra": "mean: 318.0363568607261 usec\nrounds: 3287"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 2830.8351826681683,
            "unit": "iter/sec",
            "range": "stddev: 0.000011515488238638958",
            "extra": "mean: 353.2526394056833 usec\nrounds: 2959"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 2111.104935443537,
            "unit": "iter/sec",
            "range": "stddev: 0.000013921525802003372",
            "extra": "mean: 473.6855962064732 usec\nrounds: 2214"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 140.24250427857118,
            "unit": "iter/sec",
            "range": "stddev: 0.00040405944772059043",
            "extra": "mean: 7.130505870129404 msec\nrounds: 154"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 138.00356445345952,
            "unit": "iter/sec",
            "range": "stddev: 0.00041271476595907",
            "extra": "mean: 7.246189647059741 msec\nrounds: 153"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 137.56987806928043,
            "unit": "iter/sec",
            "range": "stddev: 0.0004066353193743031",
            "extra": "mean: 7.269033120000283 msec\nrounds: 150"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 35.378714238614855,
            "unit": "iter/sec",
            "range": "stddev: 0.0003201785671534135",
            "extra": "mean: 28.2655834594613 msec\nrounds: 37"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 35.38090026609542,
            "unit": "iter/sec",
            "range": "stddev: 0.0003029317100176542",
            "extra": "mean: 28.26383705556168 msec\nrounds: 36"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 7429.616408341512,
            "unit": "iter/sec",
            "range": "stddev: 0.000006728891704079223",
            "extra": "mean: 134.59645088503655 usec\nrounds: 7798"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 974583.5940109158,
            "unit": "iter/sec",
            "range": "stddev: 1.1335102617871313e-7",
            "extra": "mean: 1.0260792467113902 usec\nrounds: 100919"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3409181.2957913964,
            "unit": "iter/sec",
            "range": "stddev: 4.5847834520402e-8",
            "extra": "mean: 293.3255562661015 nsec\nrounds: 197668"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1572443.9502462114,
            "unit": "iter/sec",
            "range": "stddev: 8.342607999498113e-8",
            "extra": "mean: 635.9527154169288 nsec\nrounds: 163106"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 165002.27328429418,
            "unit": "iter/sec",
            "range": "stddev: 0.0000012153603667580516",
            "extra": "mean: 6.060522561874215 usec\nrounds: 172414"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 1060.6774617478752,
            "unit": "iter/sec",
            "range": "stddev: 0.000019701249010898645",
            "extra": "mean: 942.7936729720968 usec\nrounds: 1110"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 119.15588748205266,
            "unit": "iter/sec",
            "range": "stddev: 0.00006469030688458275",
            "extra": "mean: 8.39236752066171 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 18.346293900466588,
            "unit": "iter/sec",
            "range": "stddev: 0.0001368260690094462",
            "extra": "mean: 54.50692142103794 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 119.04582937789698,
            "unit": "iter/sec",
            "range": "stddev: 0.00008789589711259115",
            "extra": "mean: 8.400126280994 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 107.41968653366855,
            "unit": "iter/sec",
            "range": "stddev: 0.0002850195459097621",
            "extra": "mean: 9.309280563638305 msec\nrounds: 110"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 116.17512061488809,
            "unit": "iter/sec",
            "range": "stddev: 0.0004939981752260025",
            "extra": "mean: 8.607694958328693 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 157.65948875485714,
            "unit": "iter/sec",
            "range": "stddev: 0.00027350706829086833",
            "extra": "mean: 6.342783475309171 msec\nrounds: 162"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 1082.4122360942597,
            "unit": "iter/sec",
            "range": "stddev: 0.000024703266458514088",
            "extra": "mean: 923.8624312012278 usec\nrounds: 1141"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 118.93345919182815,
            "unit": "iter/sec",
            "range": "stddev: 0.00005594305742247563",
            "extra": "mean: 8.408062851237656 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 118.10695375101461,
            "unit": "iter/sec",
            "range": "stddev: 0.0005299347105283332",
            "extra": "mean: 8.466901975205753 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 28427.31549003559,
            "unit": "iter/sec",
            "range": "stddev: 0.0000026352149693921743",
            "extra": "mean: 35.17743349175979 usec\nrounds: 29237"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 48.9474071229501,
            "unit": "iter/sec",
            "range": "stddev: 0.014688383621397152",
            "extra": "mean: 20.43009137313685 msec\nrounds: 67"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 3.433216048035673,
            "unit": "iter/sec",
            "range": "stddev: 0.0014437718231242883",
            "extra": "mean: 291.2720859999922 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.273290466849655,
            "unit": "iter/sec",
            "range": "stddev: 0.002356742896667421",
            "extra": "mean: 785.366753333335 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.12909233366666836,
            "unit": "iter/sec",
            "range": "stddev: 0.045600811679444485",
            "extra": "mean: 7.746393388333331 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.2704693517074654,
            "unit": "iter/sec",
            "range": "stddev: 0.003720827796312395",
            "extra": "mean: 787.1106836666589 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 3.130773184887618,
            "unit": "iter/sec",
            "range": "stddev: 0.0007622380950344193",
            "extra": "mean: 319.4099159999979 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 1.0317070145791774,
            "unit": "iter/sec",
            "range": "stddev: 0.0011670975588210346",
            "extra": "mean: 969.267423666679 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 2.4419344057543,
            "unit": "iter/sec",
            "range": "stddev: 0.001617978483654594",
            "extra": "mean: 409.51140933333363 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 3.362624341336767,
            "unit": "iter/sec",
            "range": "stddev: 0.002390189218012006",
            "extra": "mean: 297.38677249997636 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.275240618648635,
            "unit": "iter/sec",
            "range": "stddev: 0.0033013493737852795",
            "extra": "mean: 784.1657373333154 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.2749609555638466,
            "unit": "iter/sec",
            "range": "stddev: 0.0019168068869008339",
            "extra": "mean: 784.3377443333187 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 11368.347981360152,
            "unit": "iter/sec",
            "range": "stddev: 0.0000036916931270051316",
            "extra": "mean: 87.96352835430679 usec\nrounds: 11568"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 286.6203530807671,
            "unit": "iter/sec",
            "range": "stddev: 0.00006591042725875414",
            "extra": "mean: 3.488935762067842 msec\nrounds: 290"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 29.917729525402255,
            "unit": "iter/sec",
            "range": "stddev: 0.0012595508636652332",
            "extra": "mean: 33.42499634375429 msec\nrounds: 32"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 17.947775513689635,
            "unit": "iter/sec",
            "range": "stddev: 0.0014836220251675165",
            "extra": "mean: 55.71721126315915 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.548298042652916,
            "unit": "iter/sec",
            "range": "stddev: 0.0037577950012815955",
            "extra": "mean: 180.23545100000624 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 17.93469488823636,
            "unit": "iter/sec",
            "range": "stddev: 0.0014863479664773804",
            "extra": "mean: 55.75784847368188 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 22.182839917373453,
            "unit": "iter/sec",
            "range": "stddev: 0.0017087013123301747",
            "extra": "mean: 45.07989075000296 msec\nrounds: 24"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 18.060585370491722,
            "unit": "iter/sec",
            "range": "stddev: 0.0008897411032799343",
            "extra": "mean: 55.36919094736815 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 17.766295323447306,
            "unit": "iter/sec",
            "range": "stddev: 0.001379314918657106",
            "extra": "mean: 56.286354684211325 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 29.70596535135005,
            "unit": "iter/sec",
            "range": "stddev: 0.0013393980686664108",
            "extra": "mean: 33.66327228125421 msec\nrounds: 32"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 18.0452019125422,
            "unit": "iter/sec",
            "range": "stddev: 0.0015139043631948435",
            "extra": "mean: 55.416392947366056 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 17.989273836770305,
            "unit": "iter/sec",
            "range": "stddev: 0.001959235397213287",
            "extra": "mean: 55.58868073685038 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 21314.61872328042,
            "unit": "iter/sec",
            "range": "stddev: 0.000002949556573242438",
            "extra": "mean: 46.91615707428875 usec\nrounds: 21875"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 46.59915371798186,
            "unit": "iter/sec",
            "range": "stddev: 0.014016569597794558",
            "extra": "mean: 21.4596171864408 msec\nrounds: 59"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_10k",
            "value": 171.50493794627658,
            "unit": "iter/sec",
            "range": "stddev: 0.000037516289582608447",
            "extra": "mean: 5.830735907517993 msec\nrounds: 173"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_100k",
            "value": 14.295589474700806,
            "unit": "iter/sec",
            "range": "stddev: 0.00010874661273248707",
            "extra": "mean: 69.95164499999949 msec\nrounds: 15"
          },
          {
            "name": "benchmarks/bench_validation.py::TestDuplicateVertexDetectionBenchmarks::test_duplicate_detection_1m",
            "value": 1.176774573104451,
            "unit": "iter/sec",
            "range": "stddev: 0.0035043437017608205",
            "extra": "mean: 849.7804276667011 msec\nrounds: 3"
          }
        ]
      }
    ]
  }
}