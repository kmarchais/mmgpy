window.BENCHMARK_DATA = {
  "lastUpdate": 1767828895652,
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
          "id": "cebda9f3d097c6a15e084894ebd508e345a71349",
          "message": "refactor: reduce more per-file ignores (#104)\n\n- Remove PTH207 from __init__.py (no violations)\n- Fix E501 in metrics.py (wrap long docstring line)\n- Fix NPY002 in tests (use modern numpy.random.Generator)\n\nIgnores removed:\n- __init__.py: PTH207 (8 → 7 rules)\n- metrics.py: E501 (5 → 4 rules)\n- tests/: NPY002 (11 → 10 rules)",
          "timestamp": "2026-01-08T00:28:03+01:00",
          "tree_id": "4ad8d219b771c6ef068ec5ef0dbfd91425757d02",
          "url": "https://github.com/kmarchais/mmgpy/commit/cebda9f3d097c6a15e084894ebd508e345a71349"
        },
        "date": 1767828894577,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 0.6230396453966583,
            "unit": "iter/sec",
            "range": "stddev: 0.012038643720614695",
            "extra": "mean: 1.605034298199996 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.6160935666494612,
            "unit": "iter/sec",
            "range": "stddev: 0.01684648993268435",
            "extra": "mean: 1.6231300797999892 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.1593332727862977,
            "unit": "iter/sec",
            "range": "stddev: 0.007254153677376441",
            "extra": "mean: 862.5647374000039 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.2358951629227146,
            "unit": "iter/sec",
            "range": "stddev: 0.005672293175313051",
            "extra": "mean: 809.1301187999989 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 0.6147900732049325,
            "unit": "iter/sec",
            "range": "stddev: 0.025746309065685036",
            "extra": "mean: 1.6265714811999943 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.6213690916170298,
            "unit": "iter/sec",
            "range": "stddev: 0.015370502116876563",
            "extra": "mean: 1.6093494406000048 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.2408702752347165,
            "unit": "iter/sec",
            "range": "stddev: 0.003283922894901764",
            "extra": "mean: 805.8860140000093 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.241391534712554,
            "unit": "iter/sec",
            "range": "stddev: 0.0017147696509182326",
            "extra": "mean: 805.547622999984 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 1.3289119444231998,
            "unit": "iter/sec",
            "range": "stddev: 0.006266558041818696",
            "extra": "mean: 752.4953057999937 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.3126117683998182,
            "unit": "iter/sec",
            "range": "stddev: 0.005764067470328339",
            "extra": "mean: 761.8398860000184 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 117.41952661210615,
            "unit": "iter/sec",
            "range": "stddev: 0.0001386616722566041",
            "extra": "mean: 8.516471057692872 msec\nrounds: 104"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 1.2353142662186072,
            "unit": "iter/sec",
            "range": "stddev: 0.005262688462110761",
            "extra": "mean: 809.5106057999942 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 1.2224517568814781,
            "unit": "iter/sec",
            "range": "stddev: 0.009157487016938234",
            "extra": "mean: 818.0281916000013 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 16.716938992846934,
            "unit": "iter/sec",
            "range": "stddev: 0.0008643433887315056",
            "extra": "mean: 59.819563882352696 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 366.31964137474375,
            "unit": "iter/sec",
            "range": "stddev: 0.00017707772418317424",
            "extra": "mean: 2.7298563523570483 msec\nrounds: 403"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 24.08157837730718,
            "unit": "iter/sec",
            "range": "stddev: 0.00027795144119291545",
            "extra": "mean: 41.52551732000802 msec\nrounds: 25"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 156.7151367329635,
            "unit": "iter/sec",
            "range": "stddev: 0.0010007829112316114",
            "extra": "mean: 6.381004546510152 msec\nrounds: 172"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 249.13154232861223,
            "unit": "iter/sec",
            "range": "stddev: 0.00009830531390671688",
            "extra": "mean: 4.013943761007063 msec\nrounds: 159"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 265.6460154775807,
            "unit": "iter/sec",
            "range": "stddev: 0.0003054797525214825",
            "extra": "mean: 3.7644080533344018 msec\nrounds: 300"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 65.7459661580274,
            "unit": "iter/sec",
            "range": "stddev: 0.00013612568946175984",
            "extra": "mean: 15.2100586307667 msec\nrounds: 65"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 925.4452664027958,
            "unit": "iter/sec",
            "range": "stddev: 0.00005865614648325966",
            "extra": "mean: 1.0805609324547072 msec\nrounds: 607"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 27.738509404706274,
            "unit": "iter/sec",
            "range": "stddev: 0.00015868853877683799",
            "extra": "mean: 36.050963857139855 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 1978.2263161441806,
            "unit": "iter/sec",
            "range": "stddev: 0.000018508809297353267",
            "extra": "mean: 505.5033349010995 usec\nrounds: 1063"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 68.44610978786689,
            "unit": "iter/sec",
            "range": "stddev: 0.0001825302808838614",
            "extra": "mean: 14.610034129028985 msec\nrounds: 62"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 90800.31936375918,
            "unit": "iter/sec",
            "range": "stddev: 9.955796842064158e-7",
            "extra": "mean: 11.01317712324178 usec\nrounds: 41920"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_elements_3d",
            "value": 27580.36739474583,
            "unit": "iter/sec",
            "range": "stddev: 0.0000020747312311425016",
            "extra": "mean: 36.257675095020815 usec\nrounds: 20803"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_with_refs",
            "value": 85261.40256232957,
            "unit": "iter/sec",
            "range": "stddev: 0.00000100590196229136",
            "extra": "mean: 11.728636521888776 usec\nrounds: 37342"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 28.55909498158196,
            "unit": "iter/sec",
            "range": "stddev: 0.0002143490599020807",
            "extra": "mean: 35.01511517241389 msec\nrounds: 29"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 28.422859596051257,
            "unit": "iter/sec",
            "range": "stddev: 0.00024792838648083525",
            "extra": "mean: 35.182948310342724 msec\nrounds: 29"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 27.52305028183868,
            "unit": "iter/sec",
            "range": "stddev: 0.00022422219923653986",
            "extra": "mean: 36.33318217857046 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 3808.9855936180493,
            "unit": "iter/sec",
            "range": "stddev: 0.000009413566215661564",
            "extra": "mean: 262.53709168013097 usec\nrounds: 1298"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 3301.4123008445017,
            "unit": "iter/sec",
            "range": "stddev: 0.000012629909651914976",
            "extra": "mean: 302.9006706445602 usec\nrounds: 2681"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 2331.508017967075,
            "unit": "iter/sec",
            "range": "stddev: 0.000017796509608047896",
            "extra": "mean: 428.9069530508995 usec\nrounds: 1065"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 103.17365272960522,
            "unit": "iter/sec",
            "range": "stddev: 0.0001719018066733321",
            "extra": "mean: 9.692396978720657 msec\nrounds: 94"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 102.27530815580518,
            "unit": "iter/sec",
            "range": "stddev: 0.0001379673994967169",
            "extra": "mean: 9.77753103883696 msec\nrounds: 103"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 99.63116842417308,
            "unit": "iter/sec",
            "range": "stddev: 0.0001710042429110748",
            "extra": "mean: 10.03701969791789 msec\nrounds: 96"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 28.013488069474242,
            "unit": "iter/sec",
            "range": "stddev: 0.00022045890129429298",
            "extra": "mean: 35.6970898275849 msec\nrounds: 29"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 27.703290774571254,
            "unit": "iter/sec",
            "range": "stddev: 0.0008447170050150376",
            "extra": "mean: 36.09679471429063 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 9258.375809263087,
            "unit": "iter/sec",
            "range": "stddev: 0.000005319689639321692",
            "extra": "mean: 108.01030554403408 usec\nrounds: 2327"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 914352.6771099493,
            "unit": "iter/sec",
            "range": "stddev: 3.2919693494048e-7",
            "extra": "mean: 1.0936698989724198 usec\nrounds: 191608"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3394930.2525500203,
            "unit": "iter/sec",
            "range": "stddev: 3.732980051796265e-8",
            "extra": "mean: 294.5568614403415 nsec\nrounds: 158203"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1394181.0196435594,
            "unit": "iter/sec",
            "range": "stddev: 2.0160624466363917e-7",
            "extra": "mean: 717.2669731622534 nsec\nrounds: 3476"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 170188.27442358842,
            "unit": "iter/sec",
            "range": "stddev: 8.694614945732006e-7",
            "extra": "mean: 5.875845462250003 usec\nrounds: 51159"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 1240.6995589148692,
            "unit": "iter/sec",
            "range": "stddev: 0.00005248562091753218",
            "extra": "mean: 805.9969013566927 usec\nrounds: 517"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 114.48983474686766,
            "unit": "iter/sec",
            "range": "stddev: 0.00011729708517795784",
            "extra": "mean: 8.734399889832657 msec\nrounds: 118"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 18.143182249177443,
            "unit": "iter/sec",
            "range": "stddev: 0.00025684412126091396",
            "extra": "mean: 55.11712257894212 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 116.16167479307065,
            "unit": "iter/sec",
            "range": "stddev: 0.0001791479496181307",
            "extra": "mean: 8.608691307020072 msec\nrounds: 114"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 107.6736035173914,
            "unit": "iter/sec",
            "range": "stddev: 0.0000990059785635777",
            "extra": "mean: 9.287327323808574 msec\nrounds: 105"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 116.78541383212449,
            "unit": "iter/sec",
            "range": "stddev: 0.0001248072836665451",
            "extra": "mean: 8.562713160716028 msec\nrounds: 112"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 153.70280031587188,
            "unit": "iter/sec",
            "range": "stddev: 0.00014244873417983142",
            "extra": "mean: 6.506062335526209 msec\nrounds: 152"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 1304.2938639067042,
            "unit": "iter/sec",
            "range": "stddev: 0.000023121321763189502",
            "extra": "mean: 766.6983857493098 usec\nrounds: 814"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 115.46651689527907,
            "unit": "iter/sec",
            "range": "stddev: 0.00011529990485203397",
            "extra": "mean: 8.660519316668552 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 116.5372768988547,
            "unit": "iter/sec",
            "range": "stddev: 0.00014291395993896566",
            "extra": "mean: 8.580945313042815 msec\nrounds: 115"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 27921.872711547818,
            "unit": "iter/sec",
            "range": "stddev: 0.0000023177983373277372",
            "extra": "mean: 35.814216701389945 usec\nrounds: 25016"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 4.498182604680051,
            "unit": "iter/sec",
            "range": "stddev: 0.001071321570867533",
            "extra": "mean: 222.31200639999997 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 3.2933496078638473,
            "unit": "iter/sec",
            "range": "stddev: 0.0016179408835892866",
            "extra": "mean: 303.64222420000715 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.2356993020235032,
            "unit": "iter/sec",
            "range": "stddev: 0.0032016792881789094",
            "extra": "mean: 809.2583676000004 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.12421185705447309,
            "unit": "iter/sec",
            "range": "stddev: 0.014274868232721174",
            "extra": "mean: 8.0507612052 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.2376621237750198,
            "unit": "iter/sec",
            "range": "stddev: 0.0027026188676143484",
            "extra": "mean: 807.9749560000096 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 3.0750684851423933,
            "unit": "iter/sec",
            "range": "stddev: 0.001294230154335903",
            "extra": "mean: 325.1960093999969 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 0.9872245040118875,
            "unit": "iter/sec",
            "range": "stddev: 0.011068147600498221",
            "extra": "mean: 1.0129408213999909 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 2.3708451171073373,
            "unit": "iter/sec",
            "range": "stddev: 0.001444854060458541",
            "extra": "mean: 421.79052219998994 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 3.2517808504646744,
            "unit": "iter/sec",
            "range": "stddev: 0.0004592077493441208",
            "extra": "mean: 307.5237988000026 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.2381956972281538,
            "unit": "iter/sec",
            "range": "stddev: 0.004428934104591919",
            "extra": "mean: 807.626776799998 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.2227792525174723,
            "unit": "iter/sec",
            "range": "stddev: 0.010019850406696852",
            "extra": "mean: 817.8091000000109 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 11393.139452033769,
            "unit": "iter/sec",
            "range": "stddev: 0.0000035507673172925926",
            "extra": "mean: 87.77211972258374 usec\nrounds: 10090"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 4.0262596681815985,
            "unit": "iter/sec",
            "range": "stddev: 0.0011702442558582141",
            "extra": "mean: 248.36947500001543 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 26.714514958082344,
            "unit": "iter/sec",
            "range": "stddev: 0.0013455867604345926",
            "extra": "mean: 37.432833857140835 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 17.049044644800865,
            "unit": "iter/sec",
            "range": "stddev: 0.0009809051788838116",
            "extra": "mean: 58.654312944447106 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.48618491636311,
            "unit": "iter/sec",
            "range": "stddev: 0.001455384351838127",
            "extra": "mean: 182.27602883333324 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 16.967060843727484,
            "unit": "iter/sec",
            "range": "stddev: 0.0009279646978814042",
            "extra": "mean: 58.937726999999995 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 21.173289300383185,
            "unit": "iter/sec",
            "range": "stddev: 0.0015374623161311587",
            "extra": "mean: 47.22931736364186 msec\nrounds: 22"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 17.234390880399477,
            "unit": "iter/sec",
            "range": "stddev: 0.0010696359077535457",
            "extra": "mean: 58.0235186111098 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 16.66708738716095,
            "unit": "iter/sec",
            "range": "stddev: 0.0009270289605996785",
            "extra": "mean: 59.998485444452854 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 26.817066377985302,
            "unit": "iter/sec",
            "range": "stddev: 0.0011757786452455102",
            "extra": "mean: 37.289686571418606 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 16.97027524582621,
            "unit": "iter/sec",
            "range": "stddev: 0.0011649010517280074",
            "extra": "mean: 58.926563388884766 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 16.99399499059902,
            "unit": "iter/sec",
            "range": "stddev: 0.0006786529933613078",
            "extra": "mean: 58.84431533333946 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 21449.531949601238,
            "unit": "iter/sec",
            "range": "stddev: 0.000002770637374451877",
            "extra": "mean: 46.62106391643621 usec\nrounds: 17695"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 25.60401077611715,
            "unit": "iter/sec",
            "range": "stddev: 0.01539784404909575",
            "extra": "mean: 39.056380999994644 msec\nrounds: 12"
          }
        ]
      }
    ]
  }
}