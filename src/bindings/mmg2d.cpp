#include "bindings.h"
#include "mmg/mmg2d/libmmg2d.h"
#include "mmg_common.hpp"
#include <pybind11/pybind11.h>
#include <pybind11/stl.h>

namespace py = pybind11;

// Helper function to initialize MMG2D structures
std::tuple<MMG5_pMesh, MMG5_pSol, MMG5_pSol, MMG5_pSol>
init_mmg2d_structures() {
  MMG5_pMesh mesh = nullptr;
  MMG5_pSol met = nullptr, disp = nullptr, ls = nullptr;

  MMG2D_Init_mesh(MMG5_ARG_start, MMG5_ARG_ppMesh, &mesh, MMG5_ARG_ppMet, &met,
                  MMG5_ARG_ppLs, &ls, MMG5_ARG_ppDisp, &disp, MMG5_ARG_end);

  return std::make_tuple(mesh, met, disp, ls);
}

// Helper function to cleanup MMG2D structures
void cleanup_mmg2d_structures(MMG5_pMesh &mesh, MMG5_pSol &met, MMG5_pSol &disp,
                              MMG5_pSol &ls) {
  MMG2D_Free_all(MMG5_ARG_start, MMG5_ARG_ppMesh, &mesh, MMG5_ARG_ppMet, &met,
                 MMG5_ARG_ppDisp, &disp, MMG5_ARG_ppLs, &ls, MMG5_ARG_end);
}

// Helper function to load mesh based on format
int mmg2d_load_mesh(MMG5_pMesh mesh, MMG5_pSol met, MMG5_pSol sol,
                    const std::string &filename) {
  std::string ext = get_file_extension(filename);
  if (ext == ".vtk") {
    return MMG2D_loadVtkMesh(mesh, met, sol, filename.c_str());
  } else if (ext == ".vtu") {
    return MMG2D_loadVtuMesh(mesh, met, sol, filename.c_str());
  } else if (ext == ".vtp") {
    return MMG2D_loadVtpMesh(mesh, met, sol, filename.c_str());
  } else {
    return MMG2D_loadMesh(mesh, filename.c_str());
  }
}

// Helper function to save mesh based on format
int mmg2d_save_mesh(MMG5_pMesh mesh, MMG5_pSol met,
                    const std::string &filename) {
  std::string ext = get_file_extension(filename);
  if (ext == ".vtk") {
    return MMG2D_saveVtkMesh(mesh, met, filename.c_str());
  } else if (ext == ".vtu") {
    return MMG2D_saveVtuMesh(mesh, met, filename.c_str());
  } else if (ext == ".vtp") {
    return MMG2D_saveVtpMesh(mesh, met, filename.c_str());
  } else {
    return MMG2D_saveMesh(mesh, filename.c_str());
  }
}

bool remesh_2d(const py::object &input_mesh, const py::object &input_sol,
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
  auto [mesh, met, disp, ls] = init_mmg2d_structures();

  // Set mesh names
  MMG2D_Set_inputMeshName(mesh, input_mesh_str.c_str());
  if (output_mesh_str.empty()) {
    // First get the filename without path
    size_t last_slash = input_mesh_str.find_last_of(
        "/\\"); // Handle both Unix and Windows paths
    std::string filename = (last_slash != std::string::npos)
                               ? input_mesh_str.substr(last_slash + 1)
                               : input_mesh_str;

    // Now handle the extension
    size_t dot_pos = filename.find_last_of(".");
    std::string base_name;
    std::string extension;

    if (dot_pos != std::string::npos) {
      base_name = filename.substr(0, dot_pos);
      extension = filename.substr(dot_pos); // Includes the dot
    } else {
      base_name = filename; // No extension found, use the whole string
      extension = "";
    }

    output_mesh_str = base_name + ".o" + extension;
  }
  MMG2D_Set_outputMeshName(mesh, output_mesh_str.c_str());

  if (!input_sol_str.empty()) {
    MMG2D_Set_inputSolName(mesh, met, input_sol_str.c_str());
  }
  if (!output_sol_str.empty()) {
    MMG2D_Set_outputSolName(mesh, met, output_sol_str.c_str());
  }

  try {
    // Load mesh
    if (mmg2d_load_mesh(mesh, met,
                        (mesh->info.iso || mesh->info.isosurf) ? ls : met,
                        input_mesh_str) != 1) {
      throw std::runtime_error("Failed to load input mesh");
    }

    // Load solution if provided
    if (!input_sol_str.empty()) {
      if (MMG2D_loadSol(mesh, met, input_sol_str.c_str()) != 1) {
        throw std::runtime_error("Failed to load solution file");
      }
    }

    // Set all mesh options
    set_mesh_options_2D(mesh, met, options);

    // Process mesh based on mode
    int ret;
    if (mesh->info.lag > -1) {
      ret = MMG2D_mmg2dmov(mesh, met, disp);
    } else if (mesh->info.iso || mesh->info.isosurf) {
      ret = MMG2D_mmg2dls(mesh, ls, met);
    } else if (!mesh->nt) {
      // Mesh generation mode (no triangles in input mesh)
      ret = MMG2D_mmg2dmesh(mesh, met);
    } else {
      // Standard remeshing mode
      ret = MMG2D_mmg2dlib(mesh, met);
    }

    if (ret != MMG5_SUCCESS) {
      throw std::runtime_error("Remeshing failed");
    }

    // Save mesh
    if (mmg2d_save_mesh(mesh, met, output_mesh_str) != 1) {
      throw std::runtime_error("Failed to save output mesh");
    }

    // Save solution if requested
    if (!output_sol_str.empty()) {
      if (MMG2D_saveSol(mesh, met, output_sol_str.c_str()) != 1) {
        throw std::runtime_error("Failed to save output solution");
      }
    }

    cleanup_mmg2d_structures(mesh, met, disp, ls);
    return true;
  } catch (const std::exception &e) {
    cleanup_mmg2d_structures(mesh, met, disp, ls);
    throw;
  }
}

void set_mesh_options_2D(MMG5_pMesh mesh, MMG5_pSol met,
                         const py::dict &options) {
  for (auto item : options) {
    std::string key = py::str(item.first);

    if (key == "hmin") {
      if (!MMG2D_Set_dparameter(mesh, met, MMG2D_DPARAM_hmin,
                                item.second.cast<double>()))
        throw std::runtime_error("Failed to set hmin parameter");
    } else if (key == "hmax") {
      if (!MMG2D_Set_dparameter(mesh, met, MMG2D_DPARAM_hmax,
                                item.second.cast<double>()))
        throw std::runtime_error("Failed to set hmax parameter");
    } else if (key == "hsiz") {
      if (!MMG2D_Set_dparameter(mesh, met, MMG2D_DPARAM_hsiz,
                                item.second.cast<double>()))
        throw std::runtime_error("Failed to set hsiz parameter");
    } else if (key == "hausd") {
      if (!MMG2D_Set_dparameter(mesh, met, MMG2D_DPARAM_hausd,
                                item.second.cast<double>()))
        throw std::runtime_error("Failed to set hausd parameter");
    } else if (key == "hgrad") {
      if (!MMG2D_Set_dparameter(mesh, met, MMG2D_DPARAM_hgrad,
                                item.second.cast<double>()))
        throw std::runtime_error("Failed to set hgrad parameter");
    } else if (key == "hgradreq") {
      if (!MMG2D_Set_dparameter(mesh, met, MMG2D_DPARAM_hgradreq,
                                item.second.cast<double>()))
        throw std::runtime_error("Failed to set hgradreq parameter");
    } else if (key == "ls") {
      if (!MMG2D_Set_dparameter(mesh, met, MMG2D_DPARAM_ls,
                                item.second.cast<double>()))
        throw std::runtime_error("Failed to set ls parameter");
    } else if (key == "xreg_val") {
      if (!MMG2D_Set_dparameter(mesh, met, MMG2D_DPARAM_xreg,
                                item.second.cast<double>()))
        throw std::runtime_error("Failed to set xreg value parameter");
    } else if (key == "rmc") {
      if (!MMG2D_Set_dparameter(mesh, met, MMG2D_DPARAM_rmc,
                                item.second.cast<double>()))
        throw std::runtime_error("Failed to set rmc parameter");
    } else if (key == "ar") {
      if (!MMG2D_Set_dparameter(mesh, met, MMG2D_DPARAM_angleDetection,
                                item.second.cast<double>()))
        throw std::runtime_error("Failed to set angle detection parameter");
    } else if (key == "verbose") {
      if (!MMG2D_Set_iparameter(mesh, met, MMG2D_IPARAM_verbose,
                                item.second.cast<int>()))
        throw std::runtime_error("Failed to set verbose parameter");
    } else if (key == "mem") {
      if (!MMG2D_Set_iparameter(mesh, met, MMG2D_IPARAM_mem,
                                item.second.cast<int>()))
        throw std::runtime_error("Failed to set memory parameter");
    } else if (key == "debug") {
      if (!MMG2D_Set_iparameter(mesh, met, MMG2D_IPARAM_debug,
                                item.second.cast<int>()))
        throw std::runtime_error("Failed to set debug parameter");
    } else if (key == "angle") {
      if (!MMG2D_Set_iparameter(mesh, met, MMG2D_IPARAM_angle,
                                item.second.cast<int>()))
        throw std::runtime_error("Failed to set angle parameter");
    } else if (key == "iso") {
      if (!MMG2D_Set_iparameter(mesh, met, MMG2D_IPARAM_iso,
                                item.second.cast<int>()))
        throw std::runtime_error("Failed to set iso parameter");
    } else if (key == "isosurf") {
      if (!MMG2D_Set_iparameter(mesh, met, MMG2D_IPARAM_isosurf,
                                item.second.cast<int>()))
        throw std::runtime_error("Failed to set isosurf parameter");
    } else if (key == "opnbdy") {
      if (!MMG2D_Set_iparameter(mesh, met, MMG2D_IPARAM_opnbdy,
                                item.second.cast<int>()))
        throw std::runtime_error("Failed to set opnbdy parameter");
    } else if (key == "lag") {
      if (!MMG2D_Set_iparameter(mesh, met, MMG2D_IPARAM_lag,
                                item.second.cast<int>()))
        throw std::runtime_error("Failed to set lag parameter");
    } else if (key == "3dmedit") {
      if (!MMG2D_Set_iparameter(mesh, met, MMG2D_IPARAM_3dMedit,
                                item.second.cast<int>()))
        throw std::runtime_error("Failed to set 3dMedit parameter");
    } else if (key == "optim") {
      if (!MMG2D_Set_iparameter(mesh, met, MMG2D_IPARAM_optim,
                                item.second.cast<int>()))
        throw std::runtime_error("Failed to set optim parameter");
    } else if (key == "noinsert") {
      if (!MMG2D_Set_iparameter(mesh, met, MMG2D_IPARAM_noinsert,
                                item.second.cast<int>()))
        throw std::runtime_error("Failed to set noinsert parameter");
    } else if (key == "noswap") {
      if (!MMG2D_Set_iparameter(mesh, met, MMG2D_IPARAM_noswap,
                                item.second.cast<int>()))
        throw std::runtime_error("Failed to set noswap parameter");
    } else if (key == "nomove") {
      if (!MMG2D_Set_iparameter(mesh, met, MMG2D_IPARAM_nomove,
                                item.second.cast<int>()))
        throw std::runtime_error("Failed to set nomove parameter");
    } else if (key == "nosurf") {
      if (!MMG2D_Set_iparameter(mesh, met, MMG2D_IPARAM_nosurf,
                                item.second.cast<int>()))
        throw std::runtime_error("Failed to set nosurf parameter");
    } else if (key == "nreg") {
      if (!MMG2D_Set_iparameter(mesh, met, MMG2D_IPARAM_nreg,
                                item.second.cast<int>()))
        throw std::runtime_error("Failed to set nreg parameter");
    } else if (key == "xreg") {
      if (!MMG2D_Set_iparameter(mesh, met, MMG2D_IPARAM_xreg,
                                item.second.cast<int>()))
        throw std::runtime_error("Failed to set xreg parameter");
    } else if (key == "numsubdomain") {
      if (!MMG2D_Set_iparameter(mesh, met, MMG2D_IPARAM_numsubdomain,
                                item.second.cast<int>()))
        throw std::runtime_error("Failed to set numsubdomain parameter");
    } else if (key == "numberOfLocalParam") {
      if (!MMG2D_Set_iparameter(mesh, met, MMG2D_IPARAM_numberOfLocalParam,
                                item.second.cast<int>()))
        throw std::runtime_error("Failed to set numberOfLocalParam parameter");
    } else if (key == "numberOfLSBaseReferences") {
      if (!MMG2D_Set_iparameter(mesh, met,
                                MMG2D_IPARAM_numberOfLSBaseReferences,
                                item.second.cast<int>()))
        throw std::runtime_error(
            "Failed to set numberOfLSBaseReferences parameter");
    } else if (key == "numberOfMat") {
      if (!MMG2D_Set_iparameter(mesh, met, MMG2D_IPARAM_numberOfMat,
                                item.second.cast<int>()))
        throw std::runtime_error("Failed to set numberOfMat parameter");
    } else if (key == "anisosize") {
      if (!MMG2D_Set_iparameter(mesh, met, MMG2D_IPARAM_anisosize,
                                item.second.cast<int>()))
        throw std::runtime_error("Failed to set anisosize parameter");
    } else if (key == "nosizreq") {
      if (!MMG2D_Set_iparameter(mesh, met, MMG2D_IPARAM_nosizreq,
                                item.second.cast<int>()))
        throw std::runtime_error("Failed to set nosizreq parameter");
    } else if (key == "nofem") {
      if (!MMG2D_Set_iparameter(mesh, met, MMG2D_IPARAM_nofem,
                                item.second.cast<int>()))
        throw std::runtime_error("Failed to set nofem parameter");
    } else if (key == "isoref") {
      if (!MMG2D_Set_iparameter(mesh, met, MMG2D_IPARAM_isoref,
                                item.second.cast<int>()))
        throw std::runtime_error("Failed to set isoref parameter");
    } else {
      throw std::runtime_error("Unknown option: " + key);
    }
  }
}
