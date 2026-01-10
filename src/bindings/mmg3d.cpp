#include "bindings.h"
#include "mmg/mmg3d/libmmg3d.h"
#include "mmg_common.hpp"
#include <pybind11/pybind11.h>
#include <pybind11/stl.h>

namespace py = pybind11;

// Helper function to initialize MMG3D structures
std::tuple<MMG5_pMesh, MMG5_pSol, MMG5_pSol, MMG5_pSol>
init_mmg3d_structures() {
  MMG5_pMesh mesh = nullptr;
  MMG5_pSol met = nullptr, disp = nullptr, ls = nullptr;

  MMG3D_Init_mesh(MMG5_ARG_start, MMG5_ARG_ppMesh, &mesh, MMG5_ARG_ppMet, &met,
                  MMG5_ARG_ppDisp, &disp, MMG5_ARG_ppLs, &ls, MMG5_ARG_end);

  return std::make_tuple(mesh, met, disp, ls);
}

// Helper function to cleanup MMG3D structures
void cleanup_mmg3d_structures(MMG5_pMesh &mesh, MMG5_pSol &met, MMG5_pSol &disp,
                              MMG5_pSol &ls) {
  MMG3D_Free_all(MMG5_ARG_start, MMG5_ARG_ppMesh, &mesh, MMG5_ARG_ppMet, &met,
                 MMG5_ARG_ppDisp, &disp, MMG5_ARG_ppLs, &ls, MMG5_ARG_end);
}

// Helper function to load mesh based on format
int mmg3d_load_mesh(MMG5_pMesh mesh, MMG5_pSol met, MMG5_pSol sol,
                    const std::string &filename) {
  std::string ext = get_file_extension(filename);
  if (ext == ".vtk") {
    return MMG3D_loadVtkMesh(mesh, met, sol, filename.c_str());
  } else if (ext == ".vtu") {
    return MMG3D_loadVtuMesh(mesh, met, sol, filename.c_str());
  } else {
    return MMG3D_loadMesh(mesh, filename.c_str());
  }
}

// Helper function to save mesh based on format
int mmg3d_save_mesh(MMG5_pMesh mesh, MMG5_pSol met,
                    const std::string &filename) {
  std::string ext = get_file_extension(filename);
  if (ext == ".vtk") {
    return MMG3D_saveVtkMesh(mesh, met, filename.c_str());
  } else if (ext == ".vtu") {
    return MMG3D_saveVtuMesh(mesh, met, filename.c_str());
  } else {
    return MMG3D_saveMesh(mesh, filename.c_str());
  }
}

bool remesh_3d(const py::object &input_mesh, const py::object &input_sol,
               const py::object &output_mesh, const py::object &output_sol,
               py::dict options) {
  // Convert paths to strings
  std::string input_mesh_str = path_to_string(input_mesh);
  std::string output_mesh_str =
      output_mesh.is_none() ? "" : path_to_string(output_mesh);
  std::string input_sol_str =
      input_sol.is_none() ? "" : path_to_string(input_sol);
  std::string output_sol_str =
      output_sol.is_none() ? "" : path_to_string(output_sol);

  // Initialize structures
  auto [mesh, met, disp, ls] = init_mmg3d_structures();

  // Set mesh names
  MMG3D_Set_inputMeshName(mesh, input_mesh_str.c_str());
  MMG3D_Set_outputMeshName(mesh, output_mesh_str.c_str());

  if (!input_sol_str.empty()) {
    MMG3D_Set_inputSolName(mesh, met, input_sol_str.c_str());
  }
  if (!output_sol_str.empty()) {
    MMG3D_Set_outputSolName(mesh, met, output_sol_str.c_str());
  }

  try {
    // Rest of the implementation remains the same
    // Load mesh
    if (mmg3d_load_mesh(mesh, met,
                        (mesh->info.iso || mesh->info.isosurf) ? ls : met,
                        input_mesh_str) != 1) {
      throw std::runtime_error("Failed to load input mesh");
    }

    // Load solution if provided
    if (!input_sol_str.empty()) {
      if (MMG3D_loadSol(mesh, met, input_sol_str.c_str()) != 1) {
        throw std::runtime_error("Failed to load solution file");
      }
    }

    // Set all mesh options
    set_mesh_options_3D(mesh, met, options);

    // Process mesh
    int ret;
    if (mesh->info.lag > -1) {
      ret = MMG3D_mmg3dmov(mesh, met, disp);
    } else if (mesh->info.iso || mesh->info.isosurf) {
      ret = MMG3D_mmg3dls(mesh, ls, met);
    } else {
      ret = MMG3D_mmg3dlib(mesh, met);
    }

    if (ret != MMG5_SUCCESS) {
      throw std::runtime_error("Remeshing failed");
    }

    // Save mesh
    if (mmg3d_save_mesh(mesh, met, output_mesh_str) != 1) {
      throw std::runtime_error("Failed to save output mesh");
    }

    // Save solution if requested
    if (!output_sol_str.empty()) {
      if (MMG3D_saveSol(mesh, met, output_sol_str.c_str()) != 1) {
        throw std::runtime_error("Failed to save output solution");
      }
    }

    cleanup_mmg3d_structures(mesh, met, disp, ls);
    return true;
  } catch (const std::exception &e) {
    cleanup_mmg3d_structures(mesh, met, disp, ls);
    throw;
  }
}

void set_mesh_options_3D(MMG5_pMesh mesh, MMG5_pSol met,
                         const py::dict &options) {
  const std::unordered_map<std::string, ParamInfo> param_map = {
      // Double parameters
      {"hmin", {MMG3D_DPARAM_hmin, ParamType::Double}},
      {"hmax", {MMG3D_DPARAM_hmax, ParamType::Double}},
      {"hsiz", {MMG3D_DPARAM_hsiz, ParamType::Double}},
      {"hausd", {MMG3D_DPARAM_hausd, ParamType::Double}},
      {"hgrad", {MMG3D_DPARAM_hgrad, ParamType::Double}},
      {"hgradreq", {MMG3D_DPARAM_hgradreq, ParamType::Double}},
      {"ls", {MMG3D_DPARAM_ls, ParamType::Double}},
      {"xreg_val", {MMG3D_DPARAM_xreg, ParamType::Double}},
      {"rmc", {MMG3D_DPARAM_rmc, ParamType::Double}},
      {"ar", {MMG3D_DPARAM_angleDetection, ParamType::Double}},

      // Integer parameters
      {"debug", {MMG3D_IPARAM_debug, ParamType::Integer}},
      {"angle", {MMG3D_IPARAM_angle, ParamType::Integer}},
      {"iso", {MMG3D_IPARAM_iso, ParamType::Integer}},
      {"isosurf", {MMG3D_IPARAM_isosurf, ParamType::Integer}},
      {"nofem", {MMG3D_IPARAM_nofem, ParamType::Integer}},
      {"opnbdy", {MMG3D_IPARAM_opnbdy, ParamType::Integer}},
      {"optim", {MMG3D_IPARAM_optim, ParamType::Integer}},
      {"optimLES", {MMG3D_IPARAM_optimLES, ParamType::Integer}},
      {"noinsert", {MMG3D_IPARAM_noinsert, ParamType::Integer}},
      {"noswap", {MMG3D_IPARAM_noswap, ParamType::Integer}},
      {"nomove", {MMG3D_IPARAM_nomove, ParamType::Integer}},
      {"nosurf", {MMG3D_IPARAM_nosurf, ParamType::Integer}},
      {"nreg", {MMG3D_IPARAM_nreg, ParamType::Integer}},
      {"xreg", {MMG3D_IPARAM_xreg, ParamType::Integer}},
      {"renum", {MMG3D_IPARAM_renum, ParamType::Integer}},
      {"anisosize", {MMG3D_IPARAM_anisosize, ParamType::Integer}},
      {"nosizreq", {MMG3D_IPARAM_nosizreq, ParamType::Integer}},
      {"verbose", {MMG3D_IPARAM_verbose, ParamType::Integer}},
      {"mem", {MMG3D_IPARAM_mem, ParamType::Integer}},
      {"lag", {MMG3D_IPARAM_lag, ParamType::Integer}},
      {"numberOfLocalParam",
       {MMG3D_IPARAM_numberOfLocalParam, ParamType::Integer}},
      {"numberOfLSBaseReferences",
       {MMG3D_IPARAM_numberOfLSBaseReferences, ParamType::Integer}},
      {"numberOfMat", {MMG3D_IPARAM_numberOfMat, ParamType::Integer}},
      {"numsubdomain", {MMG3D_IPARAM_numsubdomain, ParamType::Integer}},
      {"octree", {MMG3D_IPARAM_octree, ParamType::Integer}},
      {"isoref", {MMG3D_IPARAM_isoref, ParamType::Integer}}};

  for (auto item : options) {
    std::string key = py::str(item.first);

    auto it = param_map.find(key);
    if (it == param_map.end()) {
      throw std::runtime_error("Unknown option: " + key);
    }

    const ParamInfo &info = it->second;
    bool success = false;

    switch (info.type) {
    case ParamType::Double:
      success = MMG3D_Set_dparameter(mesh, met, info.param_type,
                                     safe_cast<double>(item.second, key));
      break;
    case ParamType::Integer:
      success = MMG3D_Set_iparameter(mesh, met, info.param_type,
                                     safe_cast<int>(item.second, key));
      break;
    }

    if (!success) {
      throw std::runtime_error("Failed to set " + key + " parameter");
    }
  }
}
