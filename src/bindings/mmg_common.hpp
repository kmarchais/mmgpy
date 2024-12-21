#pragma once

#ifndef MMG_COMMON_HPP
#define MMG_COMMON_HPP

#include <string>
#include <tuple>

#include "mmg/mmg3d/libmmg3d.h"
#include <pybind11/pybind11.h>
#include <pybind11/stl.h>

namespace py = pybind11;

inline std::string get_file_extension(const std::string &filename) {
  size_t pos = filename.find_last_of(".");
  if (pos != std::string::npos) {
    return filename.substr(pos);
  }
  return "";
}

void set_mesh_options_2D(MMG5_pMesh mesh, MMG5_pSol met,
                         const py::dict &options);
void set_mesh_options_3D(MMG5_pMesh mesh, MMG5_pSol met,
                         const py::dict &options);
void set_mesh_options_surface(MMG5_pMesh mesh, MMG5_pSol met,
                              const py::dict &options);

#endif // MMG_COMMON_HPP
