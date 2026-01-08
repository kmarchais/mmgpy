window.BENCHMARK_DATA = {
  "lastUpdate": 1767892392114,
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
          "id": "13118cb6d5f98c35e6bc130e3f65f62b9c17eae4",
          "message": "feat(benchmarks): calibrate thresholds based on CI variance (#135)\n\n* feat(benchmarks): calibrate thresholds based on CI variance\n\nAdd benchmark calibration tooling and increase alert threshold to 200%\nto reduce false positives from GitHub Actions runner variability.\n\n- Add calibration script to collect variance statistics across multiple runs\n- Add analysis script to recommend appropriate thresholds using μ+3σ approach\n- Update benchmark workflow with calibrated 200% threshold\n- Add calibration mode to benchmark workflow (via workflow_dispatch)\n- Add PR comments showing benchmark summary\n- Enable warmup and minimum rounds for more stable results\n- Add benchmarks/README.md documenting variance expectations\n\nCloses #134\n\n* feat(benchmarks): add per-benchmark threshold comparison\n\n- Move scripts to benchmarks/scripts/\n- Add compare_benchmarks.py for per-benchmark threshold comparison\n- Update calibrate_benchmarks.py to output thresholds.json\n- Update workflow to compare PR results against stored thresholds\n- Update README with clearer calibration workflow documentation\n\nThe workflow now:\n1. Calibration (manual): runs 10+ times, generates thresholds.json\n2. PR comparison: runs once, compares against stored thresholds\n3. Reports regressions only when benchmarks exceed their specific threshold",
          "timestamp": "2026-01-08T18:03:27+01:00",
          "tree_id": "71b71bc0f3a22feeb0e6296a76712f97d38f4162",
          "url": "https://github.com/kmarchais/mmgpy/commit/13118cb6d5f98c35e6bc130e3f65f62b9c17eae4"
        },
        "date": 1767892391525,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 0.6321233759357183,
            "unit": "iter/sec",
            "range": "stddev: 0.01260996119374784",
            "extra": "mean: 1.5819696566666626 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.6390084368060285,
            "unit": "iter/sec",
            "range": "stddev: 0.027423621773374037",
            "extra": "mean: 1.5649245649999937 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.187825173501067,
            "unit": "iter/sec",
            "range": "stddev: 0.0016933376667673174",
            "extra": "mean: 841.8747323333283 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.2475642602167103,
            "unit": "iter/sec",
            "range": "stddev: 0.005915828059590655",
            "extra": "mean: 801.5619170000056 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 0.6363784683594608,
            "unit": "iter/sec",
            "range": "stddev: 0.012993249699127496",
            "extra": "mean: 1.5713919463333355 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.6297133166713806,
            "unit": "iter/sec",
            "range": "stddev: 0.009635472186140333",
            "extra": "mean: 1.5880242223333123 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.2368112957296393,
            "unit": "iter/sec",
            "range": "stddev: 0.005248225030109223",
            "extra": "mean: 808.5307786666552 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.2201948504915483,
            "unit": "iter/sec",
            "range": "stddev: 0.008575442377167222",
            "extra": "mean: 819.5412393333376 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 1.3636165874769308,
            "unit": "iter/sec",
            "range": "stddev: 0.01017120338523839",
            "extra": "mean: 733.3439686666452 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.352447470427412,
            "unit": "iter/sec",
            "range": "stddev: 0.00155290614424621",
            "extra": "mean: 739.400251666685 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 120.24741947386693,
            "unit": "iter/sec",
            "range": "stddev: 0.00008829081049718991",
            "extra": "mean: 8.316186778688648 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 1.2667690730667347,
            "unit": "iter/sec",
            "range": "stddev: 0.0065831507987926885",
            "extra": "mean: 789.4098626666732 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 1.2631776024349064,
            "unit": "iter/sec",
            "range": "stddev: 0.012968952931300598",
            "extra": "mean: 791.6543153333274 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 15.996838422494198,
            "unit": "iter/sec",
            "range": "stddev: 0.004386996383271553",
            "extra": "mean: 62.512352352939615 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 368.7212679136109,
            "unit": "iter/sec",
            "range": "stddev: 0.0002535670123642613",
            "extra": "mean: 2.7120757250007443 msec\nrounds: 400"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 23.44409262078845,
            "unit": "iter/sec",
            "range": "stddev: 0.00023894549209354436",
            "extra": "mean: 42.654668541672436 msec\nrounds: 24"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 163.74297123834052,
            "unit": "iter/sec",
            "range": "stddev: 0.000168445373043069",
            "extra": "mean: 6.107132369941076 msec\nrounds: 173"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 261.46487846676615,
            "unit": "iter/sec",
            "range": "stddev: 0.0001282551437324576",
            "extra": "mean: 3.8246054531836724 msec\nrounds: 267"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 274.7662923038404,
            "unit": "iter/sec",
            "range": "stddev: 0.00010574287832585158",
            "extra": "mean: 3.6394566146206393 msec\nrounds: 301"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 65.48289727992521,
            "unit": "iter/sec",
            "range": "stddev: 0.000555440663461242",
            "extra": "mean: 15.271163029412344 msec\nrounds: 68"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 866.382341440317,
            "unit": "iter/sec",
            "range": "stddev: 0.00010478825317066127",
            "extra": "mean: 1.1542248175759797 msec\nrounds: 899"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 26.395862911548278,
            "unit": "iter/sec",
            "range": "stddev: 0.0006611747449220546",
            "extra": "mean: 37.88472471428455 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 1970.7931402908564,
            "unit": "iter/sec",
            "range": "stddev: 0.000020067977284318737",
            "extra": "mean: 507.4099252509153 usec\nrounds: 2087"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 68.69504953570308,
            "unit": "iter/sec",
            "range": "stddev: 0.00013390071479897967",
            "extra": "mean: 14.55708972857305 msec\nrounds: 70"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 90980.99342464142,
            "unit": "iter/sec",
            "range": "stddev: 9.68316431986185e-7",
            "extra": "mean: 10.991306671412522 usec\nrounds: 92679"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_elements_3d",
            "value": 27458.73732595204,
            "unit": "iter/sec",
            "range": "stddev: 0.0000020218810506270654",
            "extra": "mean: 36.41828056874528 usec\nrounds: 27929"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_with_refs",
            "value": 85539.33700002178,
            "unit": "iter/sec",
            "range": "stddev: 0.0000011056731525514363",
            "extra": "mean: 11.690527832823223 usec\nrounds: 87253"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 27.982627902139242,
            "unit": "iter/sec",
            "range": "stddev: 0.0004693096662524438",
            "extra": "mean: 35.7364577586207 msec\nrounds: 29"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 27.913947253024617,
            "unit": "iter/sec",
            "range": "stddev: 0.0005595427678031251",
            "extra": "mean: 35.82438524138305 msec\nrounds: 29"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 27.77778674436009,
            "unit": "iter/sec",
            "range": "stddev: 0.00033225417120406187",
            "extra": "mean: 35.99998837931308 msec\nrounds: 29"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 3789.162258780349,
            "unit": "iter/sec",
            "range": "stddev: 0.000008862929311854565",
            "extra": "mean: 263.9105775116315 usec\nrounds: 3922"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 3301.352554942897,
            "unit": "iter/sec",
            "range": "stddev: 0.00000853790165431654",
            "extra": "mean: 302.9061523595128 usec\nrounds: 3413"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 2346.9783330420787,
            "unit": "iter/sec",
            "range": "stddev: 0.000011995763756678782",
            "extra": "mean: 426.0797749691331 usec\nrounds: 2413"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 98.44741220845951,
            "unit": "iter/sec",
            "range": "stddev: 0.0002671575427076128",
            "extra": "mean: 10.157707323809888 msec\nrounds: 105"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 100.9408949809183,
            "unit": "iter/sec",
            "range": "stddev: 0.00021327861471603005",
            "extra": "mean: 9.906787533328671 msec\nrounds: 105"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 100.29108774606293,
            "unit": "iter/sec",
            "range": "stddev: 0.00015046382143330306",
            "extra": "mean: 9.970975711540794 msec\nrounds: 104"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 28.27551179517687,
            "unit": "iter/sec",
            "range": "stddev: 0.001010012574041926",
            "extra": "mean: 35.3662917666649 msec\nrounds: 30"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 28.131171609830044,
            "unit": "iter/sec",
            "range": "stddev: 0.000659297512280987",
            "extra": "mean: 35.547755133332736 msec\nrounds: 30"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 8917.296536199694,
            "unit": "iter/sec",
            "range": "stddev: 0.0000051320377072380635",
            "extra": "mean: 112.1416110746691 usec\nrounds: 9228"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 1031170.5492786248,
            "unit": "iter/sec",
            "range": "stddev: 9.464023552421396e-8",
            "extra": "mean: 969.7716839368319 nsec\nrounds: 108027"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3356514.412644119,
            "unit": "iter/sec",
            "range": "stddev: 4.0591151182063374e-8",
            "extra": "mean: 297.92811144589797 nsec\nrounds: 191242"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1625233.9054774623,
            "unit": "iter/sec",
            "range": "stddev: 7.663277043830758e-8",
            "extra": "mean: 615.2960485439905 nsec\nrounds: 168039"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 165124.7454352998,
            "unit": "iter/sec",
            "range": "stddev: 8.925927074721168e-7",
            "extra": "mean: 6.056027504319916 usec\nrounds: 172118"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 1309.152725799013,
            "unit": "iter/sec",
            "range": "stddev: 0.000019257715856971854",
            "extra": "mean: 763.8528189212391 usec\nrounds: 1353"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 120.74291371399929,
            "unit": "iter/sec",
            "range": "stddev: 0.00008607946964914443",
            "extra": "mean: 8.282059536584274 msec\nrounds: 123"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 18.264122065990527,
            "unit": "iter/sec",
            "range": "stddev: 0.000227494180870879",
            "extra": "mean: 54.752152684201114 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 120.82473119431452,
            "unit": "iter/sec",
            "range": "stddev: 0.000075850728645786",
            "extra": "mean: 8.276451270491679 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 109.074777320905,
            "unit": "iter/sec",
            "range": "stddev: 0.0000939736815014497",
            "extra": "mean: 9.168022383927823 msec\nrounds: 112"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 114.67842930461354,
            "unit": "iter/sec",
            "range": "stddev: 0.00024558589441645213",
            "extra": "mean: 8.720035721310404 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 152.9293754601132,
            "unit": "iter/sec",
            "range": "stddev: 0.00009925018894095593",
            "extra": "mean: 6.538966088047737 msec\nrounds: 159"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 1372.0990813813048,
            "unit": "iter/sec",
            "range": "stddev: 0.00002076327588597842",
            "extra": "mean: 728.8103414465454 usec\nrounds: 1438"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 113.45221747280328,
            "unit": "iter/sec",
            "range": "stddev: 0.0001034242260448608",
            "extra": "mean: 8.814283424999775 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 114.13823540211222,
            "unit": "iter/sec",
            "range": "stddev: 0.00010067644443076893",
            "extra": "mean: 8.761305941667766 msec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 28052.900431360667,
            "unit": "iter/sec",
            "range": "stddev: 0.0000026175464360323196",
            "extra": "mean: 35.64693791455832 usec\nrounds: 28799"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 4.373393944328218,
            "unit": "iter/sec",
            "range": "stddev: 0.02293274361196465",
            "extra": "mean: 228.65536760000396 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 3.250955193419852,
            "unit": "iter/sec",
            "range": "stddev: 0.004477154834105322",
            "extra": "mean: 307.60190175000446 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.2311403063066888,
            "unit": "iter/sec",
            "range": "stddev: 0.005654837120641579",
            "extra": "mean: 812.2551059999902 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.12430069610780078,
            "unit": "iter/sec",
            "range": "stddev: 0.09366917829880654",
            "extra": "mean: 8.045007239000029 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.2338410185795217,
            "unit": "iter/sec",
            "range": "stddev: 0.00936740651922932",
            "extra": "mean: 810.4771886667095 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 2.933465126294811,
            "unit": "iter/sec",
            "range": "stddev: 0.003979639479741474",
            "extra": "mean: 340.89377474995786 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 0.9755755376666264,
            "unit": "iter/sec",
            "range": "stddev: 0.01757972607171277",
            "extra": "mean: 1.0250359519999772 sec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 2.3076535178120174,
            "unit": "iter/sec",
            "range": "stddev: 0.0028671977731386153",
            "extra": "mean: 433.3406173332908 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 3.0570246425020886,
            "unit": "iter/sec",
            "range": "stddev: 0.0035059681206098697",
            "extra": "mean: 327.1154527500073 msec\nrounds: 4"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.2066439922600825,
            "unit": "iter/sec",
            "range": "stddev: 0.004820844271685836",
            "extra": "mean: 828.7448546666761 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.2295771306450651,
            "unit": "iter/sec",
            "range": "stddev: 0.0033938262186161794",
            "extra": "mean: 813.287735333347 msec\nrounds: 3"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 11403.301084775812,
            "unit": "iter/sec",
            "range": "stddev: 0.000003835289940952062",
            "extra": "mean: 87.69390482332072 usec\nrounds: 11589"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 3.964539820587455,
            "unit": "iter/sec",
            "range": "stddev: 0.0006255313593329944",
            "extra": "mean: 252.23608420001253 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 24.608911033099606,
            "unit": "iter/sec",
            "range": "stddev: 0.002002640483819021",
            "extra": "mean: 40.63568675001404 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 16.102464444483697,
            "unit": "iter/sec",
            "range": "stddev: 0.004654902531180989",
            "extra": "mean: 62.10229517647375 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.401617922309281,
            "unit": "iter/sec",
            "range": "stddev: 0.0022058001842988357",
            "extra": "mean: 185.12971749998997 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 16.217206766134268,
            "unit": "iter/sec",
            "range": "stddev: 0.0021416363389610256",
            "extra": "mean: 61.66290005552987 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 20.574951379332518,
            "unit": "iter/sec",
            "range": "stddev: 0.002682856867526626",
            "extra": "mean: 48.60278799999971 msec\nrounds: 23"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 16.36290123798328,
            "unit": "iter/sec",
            "range": "stddev: 0.0025228319411027193",
            "extra": "mean: 61.11385661111828 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 15.562603002000573,
            "unit": "iter/sec",
            "range": "stddev: 0.005068439377387453",
            "extra": "mean: 64.25660282354114 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 25.413434441988763,
            "unit": "iter/sec",
            "range": "stddev: 0.002292302786581891",
            "extra": "mean: 39.349266321429305 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 16.34634632438033,
            "unit": "iter/sec",
            "range": "stddev: 0.0020198485837459573",
            "extra": "mean: 61.17575023529967 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 16.318197689444332,
            "unit": "iter/sec",
            "range": "stddev: 0.00209530918060116",
            "extra": "mean: 61.281277444436455 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 21572.79797358942,
            "unit": "iter/sec",
            "range": "stddev: 0.0000025157257234550847",
            "extra": "mean: 46.354673196506724 usec\nrounds: 22001"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 24.694125453667205,
            "unit": "iter/sec",
            "range": "stddev: 0.016164648413776454",
            "extra": "mean: 40.4954612333313 msec\nrounds: 30"
          }
        ]
      }
    ]
  }
}