window.BENCHMARK_DATA = {
  "lastUpdate": 1767880700665,
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
          "id": "a82060071926d196dbbbfe288d58b073e7a23a6d",
          "message": "feat: add interactive sizing editor for visual constraint definition (#132)\n\n* feat: add interactive sizing editor for visual constraint definition\n\nImplement PyVista-based interactive tool (SizingEditor) that allows users to\nvisually define mesh sizing constraints by clicking on the mesh. This addresses\nissue #124 for improving the workflow of defining local refinement regions.\n\nFeatures:\n- Four constraint placement modes: sphere, box, cylinder, and point\n- Visual feedback with transparent overlays for constraint regions\n- Sliders for adjusting size, radius, and influence parameters\n- Direct integration with mesh classes via edit_sizing() method\n- Support for 2D and 3D meshes (cylinder mode disabled for 2D)\n\nUsage:\n```python\nmesh = MmgMesh3D(vertices, elements)\nmesh.edit_sizing(mode=\"sphere\")  # Opens interactive PyVista window\nmesh.remesh()\n```\n\n* fix: improve interactive editor UX with help panel and status display\n\n- Add help panel in upper-left explaining how to use the editor\n- Show current mode and constraint count in upper-right status area\n- Update constraint count dynamically after each placement\n\n* feat: add interactive remesh preview example\n\nAdd example demonstrating real-time parameter exploration:\n- Live mesh updates while dragging sliders\n- Movable refinement region with draggable sphere widget\n- Custom metric field for local size control\n- Visual feedback showing influence radius\n\n* chore: exclude interactive module from coverage (requires display)\n\n* fix: improve interactive example with uniform base mesh\n\nUse two-pass remeshing approach for better refinement distribution:\n- First pass creates uniform mesh (cached for performance)\n- Second pass applies size gradient and remeshes\n- Fixes issue where refinement depended on initial vertex positions",
          "timestamp": "2026-01-08T14:51:28+01:00",
          "tree_id": "7a7d5ffa43c720258a6780875a7b02596cfa4c21",
          "url": "https://github.com/kmarchais/mmgpy/commit/a82060071926d196dbbbfe288d58b073e7a23a6d"
        },
        "date": 1767880699951,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg3d_executable_wallclock",
            "value": 0.6331890603954438,
            "unit": "iter/sec",
            "range": "stddev: 0.012823516074524567",
            "extra": "mean: 1.579307133599991 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_mmg_script",
            "value": 0.6244995401977911,
            "unit": "iter/sec",
            "range": "stddev: 0.012883547141986",
            "extra": "mean: 1.601282203799991 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_file_based",
            "value": 1.1577631269121407,
            "unit": "iter/sec",
            "range": "stddev: 0.002575572982451938",
            "extra": "mean: 863.7345384000014 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh3DComparison::test_python_api_in_memory",
            "value": 1.21325946479759,
            "unit": "iter/sec",
            "range": "stddev: 0.003972497322067878",
            "extra": "mean: 824.2260036000062 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg3d_executable_direct",
            "value": 0.6308351287384724,
            "unit": "iter/sec",
            "range": "stddev: 0.00512289940919409",
            "extra": "mean: 1.5852002440000035 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmg_script_autodetect",
            "value": 0.6344149388656749,
            "unit": "iter/sec",
            "range": "stddev: 0.011337595428118267",
            "extra": "mean: 1.5762554421999995 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mmgmesh3d_direct",
            "value": 1.2190275638754835,
            "unit": "iter/sec",
            "range": "stddev: 0.0017960254080731388",
            "extra": "mean: 820.3259956000011 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestAutoDetectionOverhead::test_mesh_autodetect",
            "value": 1.2244553821250634,
            "unit": "iter/sec",
            "range": "stddev: 0.0025163805591606756",
            "extra": "mean: 816.6896194000003 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg2d_executable",
            "value": 1.3492430216531175,
            "unit": "iter/sec",
            "range": "stddev: 0.003452846090887797",
            "extra": "mean: 741.1563253999873 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_mmg_script_2d",
            "value": 1.33780762486997,
            "unit": "iter/sec",
            "range": "stddev: 0.003993567036978535",
            "extra": "mean: 747.4916284000074 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemesh2DComparison::test_python_api_2d_in_memory",
            "value": 119.53067244055944,
            "unit": "iter/sec",
            "range": "stddev: 0.00010943364052951912",
            "extra": "mean: 8.366053495576903 msec\nrounds: 113"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmgs_executable",
            "value": 1.2584617980260784,
            "unit": "iter/sec",
            "range": "stddev: 0.0027995570031820226",
            "extra": "mean: 794.6208629999887 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_mmg_script_surface",
            "value": 1.2486378232273636,
            "unit": "iter/sec",
            "range": "stddev: 0.006793284563877192",
            "extra": "mean: 800.8727441999895 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_comparison.py::TestRemeshSurfaceComparison::test_python_api_surface_in_memory",
            "value": 16.63743979941217,
            "unit": "iter/sec",
            "range": "stddev: 0.0012657649303024104",
            "extra": "mean: 60.10540155555254 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_save_mesh_file",
            "value": 342.303215666198,
            "unit": "iter/sec",
            "range": "stddev: 0.0015599785198419447",
            "extra": "mean: 2.9213865200003397 msec\nrounds: 400"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO3D::test_read_mesh_file",
            "value": 24.827188886952644,
            "unit": "iter/sec",
            "range": "stddev: 0.0003620086852988439",
            "extra": "mean: 40.278422359992874 msec\nrounds: 25"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_save_mesh_file",
            "value": 152.9432992099403,
            "unit": "iter/sec",
            "range": "stddev: 0.0020267780224212818",
            "extra": "mean: 6.538370789473635 msec\nrounds: 171"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIO2D::test_read_mesh_file",
            "value": 255.50363588889462,
            "unit": "iter/sec",
            "range": "stddev: 0.00007072359146302066",
            "extra": "mean: 3.9138386290316767 msec\nrounds: 186"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_save_mesh_file",
            "value": 234.3850862603799,
            "unit": "iter/sec",
            "range": "stddev: 0.0025280457224704576",
            "extra": "mean: 4.266483059801397 msec\nrounds: 301"
          },
          {
            "name": "benchmarks/bench_io.py::TestFileIOSurface::test_read_mesh_file",
            "value": 65.39617177848729,
            "unit": "iter/sec",
            "range": "stddev: 0.00016628055288141382",
            "extra": "mean: 15.291414968252925 msec\nrounds: 63"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_to_pyvista",
            "value": 929.0063593430027,
            "unit": "iter/sec",
            "range": "stddev: 0.000017501963892640676",
            "extra": "mean: 1.076418896321877 msec\nrounds: 598"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversion3D::test_from_pyvista",
            "value": 27.305113531008217,
            "unit": "iter/sec",
            "range": "stddev: 0.0002813906606896446",
            "extra": "mean: 36.62317678571014 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_to_pyvista",
            "value": 1979.983127304282,
            "unit": "iter/sec",
            "range": "stddev: 0.000020025550128348466",
            "extra": "mean: 505.05480890712704 usec\nrounds: 1078"
          },
          {
            "name": "benchmarks/bench_io.py::TestPyVistaConversionSurface::test_from_pyvista",
            "value": 73.12589747050274,
            "unit": "iter/sec",
            "range": "stddev: 0.000451432106251863",
            "extra": "mean: 13.675045839996377 msec\nrounds: 75"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_3d",
            "value": 90727.76062132271,
            "unit": "iter/sec",
            "range": "stddev: 9.845505501148158e-7",
            "extra": "mean: 11.021984816464007 usec\nrounds: 42348"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_elements_3d",
            "value": 27428.359646445144,
            "unit": "iter/sec",
            "range": "stddev: 0.0000025032576894982535",
            "extra": "mean: 36.45861483844168 usec\nrounds: 20555"
          },
          {
            "name": "benchmarks/bench_io.py::TestDataAccessPerformance::test_get_vertices_with_refs",
            "value": 84883.0295103218,
            "unit": "iter/sec",
            "range": "stddev: 0.0000010334545926102972",
            "extra": "mean: 11.780917879214005 usec\nrounds: 38480"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_small",
            "value": 27.868222629027745,
            "unit": "iter/sec",
            "range": "stddev: 0.0003068750323292405",
            "extra": "mean: 35.88316389285597 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_medium",
            "value": 27.748911614606754,
            "unit": "iter/sec",
            "range": "stddev: 0.00044324688306749684",
            "extra": "mean: 36.03744946427412 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction3D::test_construct_from_arrays_large",
            "value": 27.101985258363747,
            "unit": "iter/sec",
            "range": "stddev: 0.0003733216876898426",
            "extra": "mean: 36.89766599999892 msec\nrounds: 27"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_small",
            "value": 4061.0092499982734,
            "unit": "iter/sec",
            "range": "stddev: 0.000011180377408883462",
            "extra": "mean: 246.244206412587 usec\nrounds: 1497"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_medium",
            "value": 3528.989158514012,
            "unit": "iter/sec",
            "range": "stddev: 0.000007520819006296062",
            "extra": "mean: 283.3672632820103 usec\nrounds: 2974"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstruction2D::test_construct_from_arrays_large",
            "value": 2458.8737599119654,
            "unit": "iter/sec",
            "range": "stddev: 0.000009920427793530792",
            "extra": "mean: 406.6902564513124 usec\nrounds: 1240"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_small",
            "value": 110.63792630625387,
            "unit": "iter/sec",
            "range": "stddev: 0.0005356558628387176",
            "extra": "mean: 9.038491893204206 msec\nrounds: 103"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_medium",
            "value": 107.04202996653586,
            "unit": "iter/sec",
            "range": "stddev: 0.00046420998043918555",
            "extra": "mean: 9.342124773910083 msec\nrounds: 115"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestMeshConstructionSurface::test_construct_from_arrays_large",
            "value": 107.83858054621633,
            "unit": "iter/sec",
            "range": "stddev: 0.0005426773121301085",
            "extra": "mean: 9.273119090912278 msec\nrounds: 110"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_mesh_size_and_data",
            "value": 28.053725661962336,
            "unit": "iter/sec",
            "range": "stddev: 0.00032698474451391466",
            "extra": "mean: 35.645889321427504 msec\nrounds: 28"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestLowLevelConstruction3D::test_set_vertices_with_refs",
            "value": 27.98486656773976,
            "unit": "iter/sec",
            "range": "stddev: 0.00030373437439370213",
            "extra": "mean: 35.73359899999575 msec\nrounds: 29"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_set_metric_field",
            "value": 9788.32595381403,
            "unit": "iter/sec",
            "range": "stddev: 0.00000567686742859371",
            "extra": "mean: 102.16251529816996 usec\nrounds: 2484"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestFieldOperations::test_get_metric_field",
            "value": 924176.6000065248,
            "unit": "iter/sec",
            "range": "stddev: 2.8294673501651004e-7",
            "extra": "mean: 1.0820442759456794 usec\nrounds: 184163"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_mesh_size",
            "value": 3392804.233717769,
            "unit": "iter/sec",
            "range": "stddev: 3.8320792101075425e-8",
            "extra": "mean: 294.74143838361675 nsec\nrounds: 164963"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_adjacent_elements",
            "value": 1331951.705222729,
            "unit": "iter/sec",
            "range": "stddev: 2.392540269912019e-7",
            "extra": "mean: 750.7779719631652 nsec\nrounds: 3441"
          },
          {
            "name": "benchmarks/bench_mesh_creation.py::TestTopologyQueries::test_get_vertex_neighbors",
            "value": 165211.42792875975,
            "unit": "iter/sec",
            "range": "stddev: 8.35443323798892e-7",
            "extra": "mean: 6.052850051215625 usec\nrounds: 51771"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_small",
            "value": 1309.5123568181614,
            "unit": "iter/sec",
            "range": "stddev: 0.000053461925922340335",
            "extra": "mean: 763.6430422312234 usec\nrounds: 663"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_medium",
            "value": 118.09677363401318,
            "unit": "iter/sec",
            "range": "stddev: 0.0005253818149007204",
            "extra": "mean: 8.467631834710756 msec\nrounds: 121"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DBaseline::test_remesh_large",
            "value": 18.28198283899415,
            "unit": "iter/sec",
            "range": "stddev: 0.0002410153423884865",
            "extra": "mean: 54.69866200000321 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_default",
            "value": 118.57386280085078,
            "unit": "iter/sec",
            "range": "stddev: 0.00007693914280351786",
            "extra": "mean: 8.43356180172301 msec\nrounds: 116"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_optimize",
            "value": 108.97488113929198,
            "unit": "iter/sec",
            "range": "stddev: 0.00008762082778251851",
            "extra": "mean: 9.176426618183665 msec\nrounds: 110"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DModes::test_remesh_uniform",
            "value": 119.3041486278573,
            "unit": "iter/sec",
            "range": "stddev: 0.00009185427837902879",
            "extra": "mean: 8.381938193275047 msec\nrounds: 119"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_fine",
            "value": 159.65391445067286,
            "unit": "iter/sec",
            "range": "stddev: 0.00019180633661559186",
            "extra": "mean: 6.263548272153158 msec\nrounds: 158"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_hmax_coarse",
            "value": 1380.3009989027169,
            "unit": "iter/sec",
            "range": "stddev: 0.000020302328849222836",
            "extra": "mean: 724.4796611717005 usec\nrounds: 1092"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_hausd",
            "value": 119.7744632719465,
            "unit": "iter/sec",
            "range": "stddev: 0.00012431187654452807",
            "extra": "mean: 8.349025098359338 msec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DOptions::test_remesh_with_angle_detection",
            "value": 117.16802105123821,
            "unit": "iter/sec",
            "range": "stddev: 0.00018100893603348978",
            "extra": "mean: 8.53475198290406 msec\nrounds: 117"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_get_element_qualities",
            "value": 27661.33110868073,
            "unit": "iter/sec",
            "range": "stddev: 0.0000022730971464337807",
            "extra": "mean: 36.15155019369904 usec\nrounds: 25302"
          },
          {
            "name": "benchmarks/bench_remesh_2d.py::TestRemesh2DQuality::test_validate_mesh",
            "value": 4.56330414191937,
            "unit": "iter/sec",
            "range": "stddev: 0.0005785528342882002",
            "extra": "mean: 219.139458799998 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_small",
            "value": 3.1105214422342358,
            "unit": "iter/sec",
            "range": "stddev: 0.01688933275188333",
            "extra": "mean: 321.4895054000067 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_medium",
            "value": 1.2103804447261493,
            "unit": "iter/sec",
            "range": "stddev: 0.002305548530711616",
            "extra": "mean: 826.1865138000076 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DBaseline::test_remesh_large",
            "value": 0.1260512247604495,
            "unit": "iter/sec",
            "range": "stddev: 0.01017957284066497",
            "extra": "mean: 7.933282694400009 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_default",
            "value": 1.2134513315768085,
            "unit": "iter/sec",
            "range": "stddev: 0.002678658332118647",
            "extra": "mean: 824.0956797999957 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_optimize",
            "value": 2.988753053868277,
            "unit": "iter/sec",
            "range": "stddev: 0.0030943129829974934",
            "extra": "mean: 334.58769659999916 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DModes::test_remesh_uniform",
            "value": 0.9834600313122864,
            "unit": "iter/sec",
            "range": "stddev: 0.001978438781680476",
            "extra": "mean: 1.0168181402000074 sec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_fine",
            "value": 2.308615404365271,
            "unit": "iter/sec",
            "range": "stddev: 0.0018464193988720272",
            "extra": "mean: 433.1600655999864 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_hmax_coarse",
            "value": 3.120663307820926,
            "unit": "iter/sec",
            "range": "stddev: 0.0027180360227968",
            "extra": "mean: 320.44469440000967 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hausd",
            "value": 1.2150290169135087,
            "unit": "iter/sec",
            "range": "stddev: 0.0016745143792372549",
            "extra": "mean: 823.0256118000057 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DOptions::test_remesh_with_hgrad",
            "value": 1.2167633904048605,
            "unit": "iter/sec",
            "range": "stddev: 0.0023297673392134437",
            "extra": "mean: 821.852471800014 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_get_element_qualities",
            "value": 11400.504747229825,
            "unit": "iter/sec",
            "range": "stddev: 0.000003665975291423647",
            "extra": "mean: 87.71541455153441 usec\nrounds: 10088"
          },
          {
            "name": "benchmarks/bench_remesh_3d.py::TestRemesh3DQuality::test_validate_mesh",
            "value": 3.9559489075461496,
            "unit": "iter/sec",
            "range": "stddev: 0.00143904886476913",
            "extra": "mean: 252.783851200013 msec\nrounds: 5"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_small",
            "value": 26.25140760425853,
            "unit": "iter/sec",
            "range": "stddev: 0.0014007519486167613",
            "extra": "mean: 38.09319542308195 msec\nrounds: 26"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_medium",
            "value": 16.60460771406654,
            "unit": "iter/sec",
            "range": "stddev: 0.0015400442524219741",
            "extra": "mean: 60.224247222224555 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceBaseline::test_remesh_large",
            "value": 5.469045634673395,
            "unit": "iter/sec",
            "range": "stddev: 0.0011949557985968316",
            "extra": "mean: 182.84725833334883 msec\nrounds: 6"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_default",
            "value": 16.67148425162178,
            "unit": "iter/sec",
            "range": "stddev: 0.001363599305015365",
            "extra": "mean: 59.982661705883885 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_optimize",
            "value": 20.716454896931754,
            "unit": "iter/sec",
            "range": "stddev: 0.0018784627233108479",
            "extra": "mean: 48.27080719047672 msec\nrounds: 21"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceModes::test_remesh_uniform",
            "value": 16.834758928774665,
            "unit": "iter/sec",
            "range": "stddev: 0.0014503297140552162",
            "extra": "mean: 59.400910000009496 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_fine",
            "value": 16.316585682652384,
            "unit": "iter/sec",
            "range": "stddev: 0.0010521111554279744",
            "extra": "mean: 61.28733176470793 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_hmax_coarse",
            "value": 26.382114938418557,
            "unit": "iter/sec",
            "range": "stddev: 0.0013766736444905132",
            "extra": "mean: 37.904466807691946 msec\nrounds: 26"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hausd",
            "value": 16.689318686228088,
            "unit": "iter/sec",
            "range": "stddev: 0.0011602496056938795",
            "extra": "mean: 59.918563411770265 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceOptions::test_remesh_with_hgrad",
            "value": 16.65263851663271,
            "unit": "iter/sec",
            "range": "stddev: 0.001244916773343324",
            "extra": "mean: 60.05054388235214 msec\nrounds: 17"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_get_element_qualities",
            "value": 21495.987124549756,
            "unit": "iter/sec",
            "range": "stddev: 0.0000027059263409667077",
            "extra": "mean: 46.52031070757098 usec\nrounds: 17959"
          },
          {
            "name": "benchmarks/bench_remesh_surface.py::TestRemeshSurfaceQuality::test_validate_mesh",
            "value": 25.067933428127073,
            "unit": "iter/sec",
            "range": "stddev: 0.015970473709431745",
            "extra": "mean: 39.891601071429605 msec\nrounds: 28"
          }
        ]
      }
    ]
  }
}