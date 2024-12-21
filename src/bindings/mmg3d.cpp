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

bool remesh_3d(const std::string &input_mesh, const std::string &input_sol,
               const std::string &output_mesh, const std::string &output_sol,
               py::dict options) {
  // Initialize structures
  auto [mesh, met, disp, ls] = init_mmg3d_structures();

  // Set mesh names
  MMG3D_Set_inputMeshName(mesh, input_mesh.c_str());
  MMG3D_Set_outputMeshName(mesh, output_mesh.c_str());

  if (!input_sol.empty()) {
    MMG3D_Set_inputSolName(mesh, met, input_sol.c_str());
  }
  if (!output_sol.empty()) {
    MMG3D_Set_outputSolName(mesh, met, output_sol.c_str());
  }

  try {
    // Load mesh
    if (mmg3d_load_mesh(mesh, met,
                        (mesh->info.iso || mesh->info.isosurf) ? ls : met,
                        input_mesh) != 1) {
      throw std::runtime_error("Failed to load input mesh");
    }

    // Load solution if provided
    if (!input_sol.empty()) {
      if (MMG3D_loadSol(mesh, met, input_sol.c_str()) != 1) {
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
    if (mmg3d_save_mesh(mesh, met, output_mesh) != 1) {
      throw std::runtime_error("Failed to save output mesh");
    }

    // Save solution if requested
    if (!output_sol.empty()) {
      if (MMG3D_saveSol(mesh, met, output_sol.c_str()) != 1) {
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
  for (auto item : options) {
    std::string key = py::str(item.first);

    if (key == "hmin") {
      if (!MMG3D_Set_dparameter(mesh, met, MMG3D_DPARAM_hmin,
                                item.second.cast<double>()))
        throw std::runtime_error("Failed to set hmin parameter");
    } else if (key == "hmax") {
      if (!MMG3D_Set_dparameter(mesh, met, MMG3D_DPARAM_hmax,
                                item.second.cast<double>()))
        throw std::runtime_error("Failed to set hmax parameter");
    } else if (key == "hsiz") {
      if (!MMG3D_Set_dparameter(mesh, met, MMG3D_DPARAM_hsiz,
                                item.second.cast<double>()))
        throw std::runtime_error("Failed to set hsiz parameter");
    } else if (key == "hausd") {
      if (!MMG3D_Set_dparameter(mesh, met, MMG3D_DPARAM_hausd,
                                item.second.cast<double>()))
        throw std::runtime_error("Failed to set hausd parameter");
    } else if (key == "hgrad") {
      if (!MMG3D_Set_dparameter(mesh, met, MMG3D_DPARAM_hgrad,
                                item.second.cast<double>()))
        throw std::runtime_error("Failed to set hgrad parameter");
    } else if (key == "hgradreq") {
      if (!MMG3D_Set_dparameter(mesh, met, MMG3D_DPARAM_hgradreq,
                                item.second.cast<double>()))
        throw std::runtime_error("Failed to set hgradreq parameter");
    } else if (key == "ls") {
      if (!MMG3D_Set_dparameter(mesh, met, MMG3D_DPARAM_ls,
                                item.second.cast<double>()))
        throw std::runtime_error("Failed to set ls parameter");
    } else if (key == "xreg_val") {
      if (!MMG3D_Set_dparameter(mesh, met, MMG3D_DPARAM_xreg,
                                item.second.cast<double>()))
        throw std::runtime_error("Failed to set xreg value parameter");
    } else if (key == "rmc") {
      if (!MMG3D_Set_dparameter(mesh, met, MMG3D_DPARAM_rmc,
                                item.second.cast<double>()))
        throw std::runtime_error("Failed to set rmc parameter");
    } else if (key == "ar") {
      if (!MMG3D_Set_dparameter(mesh, met, MMG3D_DPARAM_angleDetection,
                                item.second.cast<double>()))
        throw std::runtime_error("Failed to set angle detection parameter");
    } else if (key == "debug") {
      if (!MMG3D_Set_iparameter(mesh, met, MMG3D_IPARAM_debug,
                                item.second.cast<int>()))
        throw std::runtime_error("Failed to set debug parameter");
    } else if (key == "angle") {
      if (!MMG3D_Set_iparameter(mesh, met, MMG3D_IPARAM_angle,
                                item.second.cast<int>()))
        throw std::runtime_error("Failed to set angle parameter");
    } else if (key == "iso") {
      if (!MMG3D_Set_iparameter(mesh, met, MMG3D_IPARAM_iso,
                                item.second.cast<int>()))
        throw std::runtime_error("Failed to set iso parameter");
    } else if (key == "isosurf") {
      if (!MMG3D_Set_iparameter(mesh, met, MMG3D_IPARAM_isosurf,
                                item.second.cast<int>()))
        throw std::runtime_error("Failed to set isosurf parameter");
    } else if (key == "nofem") {
      if (!MMG3D_Set_iparameter(mesh, met, MMG3D_IPARAM_nofem,
                                item.second.cast<int>()))
        throw std::runtime_error("Failed to set nofem parameter");
    } else if (key == "opnbdy") {
      if (!MMG3D_Set_iparameter(mesh, met, MMG3D_IPARAM_opnbdy,
                                item.second.cast<int>()))
        throw std::runtime_error("Failed to set opnbdy parameter");
    } else if (key == "optim") {
      if (!MMG3D_Set_iparameter(mesh, met, MMG3D_IPARAM_optim,
                                item.second.cast<int>()))
        throw std::runtime_error("Failed to set optim parameter");
    } else if (key == "optimLES") {
      if (!MMG3D_Set_iparameter(mesh, met, MMG3D_IPARAM_optimLES,
                                item.second.cast<int>()))
        throw std::runtime_error("Failed to set optimLES parameter");
    } else if (key == "noinsert") {
      if (!MMG3D_Set_iparameter(mesh, met, MMG3D_IPARAM_noinsert,
                                item.second.cast<int>()))
        throw std::runtime_error("Failed to set noinsert parameter");
    } else if (key == "noswap") {
      if (!MMG3D_Set_iparameter(mesh, met, MMG3D_IPARAM_noswap,
                                item.second.cast<int>()))
        throw std::runtime_error("Failed to set noswap parameter");
    } else if (key == "nomove") {
      if (!MMG3D_Set_iparameter(mesh, met, MMG3D_IPARAM_nomove,
                                item.second.cast<int>()))
        throw std::runtime_error("Failed to set nomove parameter");
    } else if (key == "nosurf") {
      if (!MMG3D_Set_iparameter(mesh, met, MMG3D_IPARAM_nosurf,
                                item.second.cast<int>()))
        throw std::runtime_error("Failed to set nosurf parameter");
    } else if (key == "nreg") {
      if (!MMG3D_Set_iparameter(mesh, met, MMG3D_IPARAM_nreg,
                                item.second.cast<int>()))
        throw std::runtime_error("Failed to set nreg parameter");
    } else if (key == "xreg") {
      if (!MMG3D_Set_iparameter(mesh, met, MMG3D_IPARAM_xreg,
                                item.second.cast<int>()))
        throw std::runtime_error("Failed to set xreg parameter");
    } else if (key == "renum") {
      if (!MMG3D_Set_iparameter(mesh, met, MMG3D_IPARAM_renum,
                                item.second.cast<int>()))
        throw std::runtime_error("Failed to set renum parameter");
    } else if (key == "anisosize") {
      if (!MMG3D_Set_iparameter(mesh, met, MMG3D_IPARAM_anisosize,
                                item.second.cast<int>()))
        throw std::runtime_error("Failed to set anisosize parameter");
    } else if (key == "nosizreq") {
      if (!MMG3D_Set_iparameter(mesh, met, MMG3D_IPARAM_nosizreq,
                                item.second.cast<int>()))
        throw std::runtime_error("Failed to set nosizreq parameter");
    } else if (key == "verbose") {
      if (!MMG3D_Set_iparameter(mesh, met, MMG3D_IPARAM_verbose,
                                item.second.cast<int>()))
        throw std::runtime_error("Failed to set verbose parameter");
    } else if (key == "mem") {
      if (!MMG3D_Set_iparameter(mesh, met, MMG3D_IPARAM_mem,
                                item.second.cast<int>()))
        throw std::runtime_error("Failed to set memory parameter");
    } else if (key == "lag") {
      if (!MMG3D_Set_iparameter(mesh, met, MMG3D_IPARAM_lag,
                                item.second.cast<int>()))
        throw std::runtime_error("Failed to set lag parameter");
    } else if (key == "numberOfLocalParam") {
      if (!MMG3D_Set_iparameter(mesh, met, MMG3D_IPARAM_numberOfLocalParam,
                                item.second.cast<int>()))
        throw std::runtime_error("Failed to set numberOfLocalParam parameter");
    } else if (key == "numberOfLSBaseReferences") {
      if (!MMG3D_Set_iparameter(mesh, met,
                                MMG3D_IPARAM_numberOfLSBaseReferences,
                                item.second.cast<int>()))
        throw std::runtime_error(
            "Failed to set numberOfLSBaseReferences parameter");
    } else if (key == "numberOfMat") {
      if (!MMG3D_Set_iparameter(mesh, met, MMG3D_IPARAM_numberOfMat,
                                item.second.cast<int>()))
        throw std::runtime_error("Failed to set numberOfMat parameter");
    } else if (key == "numsubdomain") {
      if (!MMG3D_Set_iparameter(mesh, met, MMG3D_IPARAM_numsubdomain,
                                item.second.cast<int>()))
        throw std::runtime_error("Failed to set numsubdomain parameter");
    } else if (key == "octree") {
      if (!MMG3D_Set_iparameter(mesh, met, MMG3D_IPARAM_octree,
                                item.second.cast<int>()))
        throw std::runtime_error("Failed to set octree parameter");
    } else if (key == "isoref") {
      if (!MMG3D_Set_iparameter(mesh, met, MMG3D_IPARAM_isoref,
                                item.second.cast<int>()))
        throw std::runtime_error("Failed to set isoref parameter");
    } else {
      throw std::runtime_error("Unknown option: " + key);
    }
  }
}
