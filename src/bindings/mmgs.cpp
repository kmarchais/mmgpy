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
  for (auto item : options) {
    std::string key = py::str(item.first);

    if (key == "hmin") {
      if (!MMGS_Set_dparameter(mesh, met, MMGS_DPARAM_hmin,
                               item.second.cast<double>()))
        throw std::runtime_error("Failed to set hmin parameter");
    } else if (key == "hmax") {
      if (!MMGS_Set_dparameter(mesh, met, MMGS_DPARAM_hmax,
                               item.second.cast<double>()))
        throw std::runtime_error("Failed to set hmax parameter");
    } else if (key == "hsiz") {
      if (!MMGS_Set_dparameter(mesh, met, MMGS_DPARAM_hsiz,
                               item.second.cast<double>()))
        throw std::runtime_error("Failed to set hsiz parameter");
    } else if (key == "hausd") {
      if (!MMGS_Set_dparameter(mesh, met, MMGS_DPARAM_hausd,
                               item.second.cast<double>()))
        throw std::runtime_error("Failed to set hausd parameter");
    } else if (key == "hgrad") {
      if (!MMGS_Set_dparameter(mesh, met, MMGS_DPARAM_hgrad,
                               item.second.cast<double>()))
        throw std::runtime_error("Failed to set hgrad parameter");
    } else if (key == "hgradreq") {
      if (!MMGS_Set_dparameter(mesh, met, MMGS_DPARAM_hgradreq,
                               item.second.cast<double>()))
        throw std::runtime_error("Failed to set hgradreq parameter");
    } else if (key == "ls") {
      if (!MMGS_Set_dparameter(mesh, met, MMGS_DPARAM_ls,
                               item.second.cast<double>()))
        throw std::runtime_error("Failed to set ls parameter");
    } else if (key == "xreg_val") {
      if (!MMGS_Set_dparameter(mesh, met, MMGS_DPARAM_xreg,
                               item.second.cast<double>()))
        throw std::runtime_error("Failed to set xreg value parameter");
    } else if (key == "rmc") {
      if (!MMGS_Set_dparameter(mesh, met, MMGS_DPARAM_rmc,
                               item.second.cast<double>()))
        throw std::runtime_error("Failed to set rmc parameter");
    } else if (key == "ar") {
      if (!MMGS_Set_dparameter(mesh, met, MMGS_DPARAM_angleDetection,
                               item.second.cast<double>()))
        throw std::runtime_error("Failed to set angle detection parameter");
    } else if (key == "debug") {
      if (!MMGS_Set_iparameter(mesh, met, MMGS_IPARAM_debug,
                               item.second.cast<int>()))
        throw std::runtime_error("Failed to set debug parameter");
    } else if (key == "angle") {
      if (!MMGS_Set_iparameter(mesh, met, MMGS_IPARAM_angle,
                               item.second.cast<int>()))
        throw std::runtime_error("Failed to set angle parameter");
    } else if (key == "iso") {
      if (!MMGS_Set_iparameter(mesh, met, MMGS_IPARAM_iso,
                               item.second.cast<int>()))
        throw std::runtime_error("Failed to set iso parameter");
    } else if (key == "isosurf") {
      if (!MMGS_Set_iparameter(mesh, met, MMGS_IPARAM_isosurf,
                               item.second.cast<int>()))
        throw std::runtime_error("Failed to set isosurf parameter");
    } else if (key == "keepRef") {
      if (!MMGS_Set_iparameter(mesh, met, MMGS_IPARAM_keepRef,
                               item.second.cast<int>()))
        throw std::runtime_error("Failed to set keepRef parameter");
    } else if (key == "optim") {
      if (!MMGS_Set_iparameter(mesh, met, MMGS_IPARAM_optim,
                               item.second.cast<int>()))
        throw std::runtime_error("Failed to set optim parameter");
    } else if (key == "noinsert") {
      if (!MMGS_Set_iparameter(mesh, met, MMGS_IPARAM_noinsert,
                               item.second.cast<int>()))
        throw std::runtime_error("Failed to set noinsert parameter");
    } else if (key == "noswap") {
      if (!MMGS_Set_iparameter(mesh, met, MMGS_IPARAM_noswap,
                               item.second.cast<int>()))
        throw std::runtime_error("Failed to set noswap parameter");
    } else if (key == "nomove") {
      if (!MMGS_Set_iparameter(mesh, met, MMGS_IPARAM_nomove,
                               item.second.cast<int>()))
        throw std::runtime_error("Failed to set nomove parameter");
    } else if (key == "nreg") {
      if (!MMGS_Set_iparameter(mesh, met, MMGS_IPARAM_nreg,
                               item.second.cast<int>()))
        throw std::runtime_error("Failed to set nreg parameter");
    } else if (key == "xreg") {
      if (!MMGS_Set_iparameter(mesh, met, MMGS_IPARAM_xreg,
                               item.second.cast<int>()))
        throw std::runtime_error("Failed to set xreg parameter");
    } else if (key == "renum") {
      if (!MMGS_Set_iparameter(mesh, met, MMGS_IPARAM_renum,
                               item.second.cast<int>()))
        throw std::runtime_error("Failed to set renum parameter");
    } else if (key == "anisosize") {
      if (!MMGS_Set_iparameter(mesh, met, MMGS_IPARAM_anisosize,
                               item.second.cast<int>()))
        throw std::runtime_error("Failed to set anisosize parameter");
    } else if (key == "nosizreq") {
      if (!MMGS_Set_iparameter(mesh, met, MMGS_IPARAM_nosizreq,
                               item.second.cast<int>()))
        throw std::runtime_error("Failed to set nosizreq parameter");
    } else if (key == "verbose") {
      if (!MMGS_Set_iparameter(mesh, met, MMGS_IPARAM_verbose,
                               item.second.cast<int>()))
        throw std::runtime_error("Failed to set verbose parameter");
    } else if (key == "mem") {
      if (!MMGS_Set_iparameter(mesh, met, MMGS_IPARAM_mem,
                               item.second.cast<int>()))
        throw std::runtime_error("Failed to set memory parameter");
    } else if (key == "numberOfLocalParam") {
      if (!MMGS_Set_iparameter(mesh, met, MMGS_IPARAM_numberOfLocalParam,
                               item.second.cast<int>()))
        throw std::runtime_error("Failed to set numberOfLocalParam parameter");
    } else if (key == "numberOfLSBaseReferences") {
      if (!MMGS_Set_iparameter(mesh, met, MMGS_IPARAM_numberOfLSBaseReferences,
                               item.second.cast<int>()))
        throw std::runtime_error(
            "Failed to set numberOfLSBaseReferences parameter");
    } else if (key == "numberOfMat") {
      if (!MMGS_Set_iparameter(mesh, met, MMGS_IPARAM_numberOfMat,
                               item.second.cast<int>()))
        throw std::runtime_error("Failed to set numberOfMat parameter");
    } else if (key == "numsubdomain") {
      if (!MMGS_Set_iparameter(mesh, met, MMGS_IPARAM_numsubdomain,
                               item.second.cast<int>()))
        throw std::runtime_error("Failed to set numsubdomain parameter");
    } else if (key == "isoref") {
      if (!MMGS_Set_iparameter(mesh, met, MMGS_IPARAM_isoref,
                               item.second.cast<int>()))
        throw std::runtime_error("Failed to set isoref parameter");
    } else {
      throw std::runtime_error("Unknown option: " + key);
    }
  }
}
