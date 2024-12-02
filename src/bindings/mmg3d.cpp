#include <pybind11/pybind11.h>
#include <pybind11/stl.h>
#include "mmg/mmg3d/libmmg3d.h"
#include "mmg_common.hpp"
#include "bindings.h"


namespace py = pybind11;

// Helper function to initialize MMG3D structures
std::tuple<MMG5_pMesh, MMG5_pSol, MMG5_pSol, MMG5_pSol> init_mmg3d_structures() {
    MMG5_pMesh mesh = nullptr;
    MMG5_pSol met = nullptr, disp = nullptr, ls = nullptr;

    MMG3D_Init_mesh(MMG5_ARG_start,
                    MMG5_ARG_ppMesh, &mesh,
                    MMG5_ARG_ppMet, &met,
                    MMG5_ARG_ppDisp, &disp,
                    MMG5_ARG_ppLs, &ls,
                    MMG5_ARG_end);

    return std::make_tuple(mesh, met, disp, ls);
}

// Helper function to cleanup MMG3D structures
void cleanup_mmg3d_structures(MMG5_pMesh& mesh, MMG5_pSol& met, MMG5_pSol& disp, MMG5_pSol& ls) {
    MMG3D_Free_all(MMG5_ARG_start,
                   MMG5_ARG_ppMesh, &mesh,
                   MMG5_ARG_ppMet, &met,
                   MMG5_ARG_ppDisp, &disp,
                   MMG5_ARG_ppLs, &ls,
                   MMG5_ARG_end);
}

// Helper function to load mesh based on format
int mmg3d_load_mesh(MMG5_pMesh mesh, MMG5_pSol met, MMG5_pSol sol, const std::string& filename) {
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
int mmg3d_save_mesh(MMG5_pMesh mesh, MMG5_pSol met, const std::string& filename) {
    std::string ext = get_file_extension(filename);
    if (ext == ".vtk") {
        return MMG3D_saveVtkMesh(mesh, met, filename.c_str());
    } else if (ext == ".vtu") {
        return MMG3D_saveVtuMesh(mesh, met, filename.c_str());
    } else {
        return MMG3D_saveMesh(mesh, filename.c_str());
    }
}

bool remesh_3d(const std::string& input_mesh, const std::string& input_sol, const std::string& output_mesh, const std::string& output_sol, py::dict options) {
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
        set_mesh_options(mesh, met, options);

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
    } catch (const std::exception& e) {
        cleanup_mmg3d_structures(mesh, met, disp, ls);
        throw;
    }
}