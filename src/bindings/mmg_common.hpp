#pragma once

#ifndef MMG_COMMON_HPP
#define MMG_COMMON_HPP

#include <string>
#include <tuple>

#include <pybind11/pybind11.h>
#include <pybind11/stl.h>
#include "mmg/mmg3d/libmmg3d.h"

namespace py = pybind11;

inline std::string get_file_extension(const std::string& filename) {
    size_t pos = filename.find_last_of(".");
    if (pos != std::string::npos) {
        return filename.substr(pos);
    }
    return "";
}

inline void set_mesh_options(MMG5_pMesh mesh, MMG5_pSol met, const py::dict& options) {
    for (auto item : options) {
        std::string key = py::str(item.first);
        if (key == "hmin") {
            mesh->info.hmin = item.second.cast<double>();
        } else if (key == "hmax") {
            mesh->info.hmax = item.second.cast<double>();
        } else if (key == "hsiz") {
            mesh->info.hsiz = item.second.cast<double>();
        } else if (key == "hgrad") {
            mesh->info.hgrad = item.second.cast<double>();
        } else if (key == "hausd") {
            mesh->info.hausd = item.second.cast<double>();
        } else if (key == "ls") {
            mesh->info.ls = item.second.cast<double>();
        } else if (key == "iso") {
            mesh->info.iso = item.second.cast<int>();
        } else if (key == "lag") {
            mesh->info.lag = item.second.cast<int>();
        } else if (key == "noinsert") {
            mesh->info.noinsert = item.second.cast<int>();
        } else if (key == "nofem") {
            mesh->info.setfem = item.second.cast<int>();
        } else if (key == "nr") {
            if (!MMG3D_Set_iparameter(mesh, met, MMG3D_IPARAM_angle, 0)) {
                throw std::runtime_error("Failed to set angle parameter");
            }
        } else if (key == "imprim") {
            mesh->info.imprim = item.second.cast<int>();
        }
    }
}

#endif  // MMG_COMMON_HPP
