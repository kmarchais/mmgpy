#include "bindings.h"
#include "mmg/mmgs/libmmgs.h"
#include "mmg_common.hpp"
#include <pybind11/pybind11.h>
#include <pybind11/stl.h>

namespace py = pybind11;

// Helper function to initialize MMGS structures
std::tuple<MMG5_pMesh, MMG5_pSol, MMG5_pSol> init_mmgs_structures() {
  MMG5_pMesh mesh = nullptr;
  MMG5_pSol met = nullptr, ls = nullptr;

  MMGS_Init_mesh(MMG5_ARG_start, MMG5_ARG_ppMesh, &mesh, MMG5_ARG_ppMet, &met,
                 MMG5_ARG_ppLs, &ls, MMG5_ARG_end);

  return std::make_tuple(mesh, met, ls);
}

// Helper function to cleanup MMGS structures
void cleanup_mmgs_structures(MMG5_pMesh &mesh, MMG5_pSol &met, MMG5_pSol &ls) {
  MMGS_Free_all(MMG5_ARG_start, MMG5_ARG_ppMesh, &mesh, MMG5_ARG_ppMet, &met,
                MMG5_ARG_ppLs, &ls, MMG5_ARG_end);
}

// Helper function to load mesh based on format
int mmgs_load_mesh(MMG5_pMesh mesh, MMG5_pSol met, MMG5_pSol sol,
                   const std::string &filename) {
  std::string ext = get_file_extension(filename);
  if (ext == ".vtk") {
    return MMGS_loadVtkMesh(mesh, met, sol, filename.c_str());
  } else if (ext == ".vtu") {
    return MMGS_loadVtuMesh(mesh, met, sol, filename.c_str());
  } else if (ext == ".vtp") {
    return MMGS_loadVtpMesh(mesh, met, sol, filename.c_str());
  } else {
    return MMGS_loadMesh(mesh, filename.c_str());
  }
}

// Helper function to save mesh based on format
int mmgs_save_mesh(MMG5_pMesh mesh, MMG5_pSol met,
                   const std::string &filename) {
  std::string ext = get_file_extension(filename);
  if (ext == ".vtk") {
    return MMGS_saveVtkMesh(mesh, met, filename.c_str());
  } else if (ext == ".vtu") {
    return MMGS_saveVtuMesh(mesh, met, filename.c_str());
  } else if (ext == ".vtp") {
    return MMGS_saveVtpMesh(mesh, met, filename.c_str());
  } else {
    return MMGS_saveMesh(mesh, filename.c_str());
  }
}

bool remesh_s(const py::object &input_mesh, const py::object &input_sol,
              const py::object &output_mesh, const py::object &output_sol,
              py::dict options) {
  // Convert paths to strings
  std::string input_mesh_str = path_to_string(input_mesh);
  std::string input_sol_str =
      input_sol.is_none() ? "" : path_to_string(input_sol);
  std::string output_mesh_str =
      output_mesh.is_none() ? "" : path_to_string(output_mesh);
  std::string output_sol_str =
      output_sol.is_none() ? "" : path_to_string(output_sol);

  // Initialize structures
  auto [mesh, met, ls] = init_mmgs_structures();

  // Set mesh names
  MMGS_Set_inputMeshName(mesh, input_mesh_str.c_str());
  MMGS_Set_outputMeshName(mesh, output_mesh_str.c_str());

  if (!input_sol_str.empty()) {
    MMGS_Set_inputSolName(mesh, met, input_sol_str.c_str());
  }
  if (!output_sol_str.empty()) {
    MMGS_Set_outputSolName(mesh, met, output_sol_str.c_str());
  }

  try {
    // Load mesh
    if (mmgs_load_mesh(mesh, met, mesh->info.iso ? ls : met, input_mesh_str) !=
        1) {
      throw std::runtime_error("Failed to load input mesh");
    }

    // Load solution if provided
    if (!input_sol_str.empty()) {
      // In iso mode, solution goes to ls structure
      if (mesh->info.iso) {
        if (MMGS_loadSol(mesh, ls, input_sol_str.c_str()) != 1) {
          throw std::runtime_error("Failed to load level-set");
        }
        // Load optional metric if provided
        if (met->namein) {
          if (MMGS_loadSol(mesh, met, met->namein) != 1) {
            throw std::runtime_error("Failed to load metric");
          }
        }
      } else {
        if (MMGS_loadSol(mesh, met, input_sol_str.c_str()) != 1) {
          throw std::runtime_error("Failed to load solution");
        }
      }
    }

    // Set all mesh options
    set_mesh_options_surface(mesh, met, options);

    // Process mesh
    int ret;
    if (mesh->info.iso || mesh->info.isosurf) {
      ret = MMGS_mmgsls(mesh, ls, met);
    } else {
      ret = MMGS_mmgslib(mesh, met);
    }

    if (ret != MMG5_SUCCESS) {
      throw std::runtime_error("Remeshing failed");
    }

    // Save mesh
    if (mmgs_save_mesh(mesh, met, output_mesh_str) != 1) {
      throw std::runtime_error("Failed to save output mesh");
    }

    // Save solution if requested
    if (!output_sol_str.empty()) {
      if (MMGS_saveSol(mesh, met, output_sol_str.c_str()) != 1) {
        throw std::runtime_error("Failed to save output solution");
      }
    }

    cleanup_mmgs_structures(mesh, met, ls);
    return true;
  } catch (const std::exception &e) {
    cleanup_mmgs_structures(mesh, met, ls);
    throw;
  }
}

void set_mesh_options_surface(MMG5_pMesh mesh, MMG5_pSol met,
                              const py::dict &options) {
  const std::unordered_map<std::string, ParamInfo> param_map = {
      // Double parameters
      {"hmin", {MMGS_DPARAM_hmin, ParamType::Double}},
      {"hmax", {MMGS_DPARAM_hmax, ParamType::Double}},
      {"hsiz", {MMGS_DPARAM_hsiz, ParamType::Double}},
      {"hausd", {MMGS_DPARAM_hausd, ParamType::Double}},
      {"hgrad", {MMGS_DPARAM_hgrad, ParamType::Double}},
      {"hgradreq", {MMGS_DPARAM_hgradreq, ParamType::Double}},
      {"ls", {MMGS_DPARAM_ls, ParamType::Double}},
      {"xreg_val", {MMGS_DPARAM_xreg, ParamType::Double}},
      {"rmc", {MMGS_DPARAM_rmc, ParamType::Double}},
      {"ar", {MMGS_DPARAM_angleDetection, ParamType::Double}},

      // Integer parameters
      {"debug", {MMGS_IPARAM_debug, ParamType::Integer}},
      {"angle", {MMGS_IPARAM_angle, ParamType::Integer}},
      {"iso", {MMGS_IPARAM_iso, ParamType::Integer}},
      {"isosurf", {MMGS_IPARAM_isosurf, ParamType::Integer}},
      {"keepRef", {MMGS_IPARAM_keepRef, ParamType::Integer}},
      {"optim", {MMGS_IPARAM_optim, ParamType::Integer}},
      {"noinsert", {MMGS_IPARAM_noinsert, ParamType::Integer}},
      {"noswap", {MMGS_IPARAM_noswap, ParamType::Integer}},
      {"nomove", {MMGS_IPARAM_nomove, ParamType::Integer}},
      {"nreg", {MMGS_IPARAM_nreg, ParamType::Integer}},
      {"xreg", {MMGS_IPARAM_xreg, ParamType::Integer}},
      {"renum", {MMGS_IPARAM_renum, ParamType::Integer}},
      {"anisosize", {MMGS_IPARAM_anisosize, ParamType::Integer}},
      {"nosizreq", {MMGS_IPARAM_nosizreq, ParamType::Integer}},
      {"verbose", {MMGS_IPARAM_verbose, ParamType::Integer}},
      {"mem", {MMGS_IPARAM_mem, ParamType::Integer}},
      {"numberOfLocalParam",
       {MMGS_IPARAM_numberOfLocalParam, ParamType::Integer}},
      {"numberOfLSBaseReferences",
       {MMGS_IPARAM_numberOfLSBaseReferences, ParamType::Integer}},
      {"numberOfMat", {MMGS_IPARAM_numberOfMat, ParamType::Integer}},
      {"numsubdomain", {MMGS_IPARAM_numsubdomain, ParamType::Integer}},
      {"isoref", {MMGS_IPARAM_isoref, ParamType::Integer}}};

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
      success = MMGS_Set_dparameter(mesh, met, info.param_type,
                                    safe_cast<double>(item.second, key));
      break;
    case ParamType::Integer:
      success = MMGS_Set_iparameter(mesh, met, info.param_type,
                                    safe_cast<int>(item.second, key));
      break;
    }

    if (!success) {
      throw std::runtime_error("Failed to set " + key + " parameter");
    }
  }
}
