#include <pybind11/pybind11.h>
#include <pybind11/stl.h>
#include "mmg/mmgs/libmmgs.h"
#include "mmg_common.hpp"
#include "bindings.h"


namespace py = pybind11;

// Helper function to initialize MMGS structures
std::tuple<MMG5_pMesh, MMG5_pSol, MMG5_pSol> init_mmgs_structures() {
    MMG5_pMesh mesh = nullptr;
    MMG5_pSol met = nullptr, ls = nullptr;

    MMGS_Init_mesh(MMG5_ARG_start,
                   MMG5_ARG_ppMesh, &mesh,
                   MMG5_ARG_ppMet, &met,
                   MMG5_ARG_ppLs, &ls,
                   MMG5_ARG_end);

    return std::make_tuple(mesh, met, ls);
}

// Helper function to cleanup MMGS structures
void cleanup_mmgs_structures(MMG5_pMesh& mesh, MMG5_pSol& met, MMG5_pSol& ls) {
    MMGS_Free_all(MMG5_ARG_start,
                  MMG5_ARG_ppMesh, &mesh,
                  MMG5_ARG_ppMet, &met,
                  MMG5_ARG_ppLs, &ls,
                  MMG5_ARG_end);
}

// Helper function to load mesh based on format
int mmgs_load_mesh(MMG5_pMesh mesh, MMG5_pSol met, MMG5_pSol sol, const std::string& filename) {
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
int mmgs_save_mesh(MMG5_pMesh mesh, MMG5_pSol met, const std::string& filename) {
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

bool remesh_s(const std::string& input_mesh,
                 const std::string& input_sol,
                 const std::string& output_mesh,
                 const std::string& output_sol,
                 py::dict options) {
    // Initialize structures
    auto [mesh, met, ls] = init_mmgs_structures();

    // Set mesh names
    MMGS_Set_inputMeshName(mesh, input_mesh.c_str());
    MMGS_Set_outputMeshName(mesh, output_mesh.c_str());

    if (!input_sol.empty()) {
        MMGS_Set_inputSolName(mesh, met, input_sol.c_str());
    }
    if (!output_sol.empty()) {
        MMGS_Set_outputSolName(mesh, met, output_sol.c_str());
    }

    try {
        // Load mesh
        if (mmgs_load_mesh(mesh, met,
                     mesh->info.iso ? ls : met,
                     input_mesh) != 1) {
            throw std::runtime_error("Failed to load input mesh");
        }

        // Load solution if provided
        if (!input_sol.empty()) {
            // In iso mode, solution goes to ls structure
            if (mesh->info.iso) {
                if (MMGS_loadSol(mesh, ls, input_sol.c_str()) != 1) {
                    throw std::runtime_error("Failed to load level-set");
                }
                // Load optional metric if provided
                if (met->namein) {
                    if (MMGS_loadSol(mesh, met, met->namein) != 1) {
                        throw std::runtime_error("Failed to load metric");
                    }
                }
            } else {
                if (MMGS_loadSol(mesh, met, input_sol.c_str()) != 1) {
                    throw std::runtime_error("Failed to load solution");
                }
            }
        }

        // Set all mesh options
        set_mesh_options(mesh, met, options);

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
        if (mmgs_save_mesh(mesh, met, output_mesh) != 1) {
            throw std::runtime_error("Failed to save output mesh");
        }

        // Save solution if requested
        if (!output_sol.empty()) {
            if (MMGS_saveSol(mesh, met, output_sol.c_str()) != 1) {
                throw std::runtime_error("Failed to save output solution");
            }
        }

        cleanup_mmgs_structures(mesh, met, ls);
        return true;
    } catch (const std::exception& e) {
        cleanup_mmgs_structures(mesh, met, ls);
        throw;
    }
}