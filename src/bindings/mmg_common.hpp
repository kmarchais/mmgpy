#pragma once

#ifndef MMG_COMMON_HPP
#define MMG_COMMON_HPP

#include <string>
#include <tuple>

#include "mmg/mmg3d/libmmg3d.h"
#include <pybind11/pybind11.h>
#include <pybind11/stl.h>

namespace py = pybind11;

enum class ParamType { Double, Integer };

struct ParamInfo {
  int param_type;
  ParamType type;
};

std::string get_file_extension(const std::string &filename);

void set_mesh_options_2D(MMG5_pMesh mesh, MMG5_pSol met,
                         const py::dict &options);
void set_mesh_options_3D(MMG5_pMesh mesh, MMG5_pSol met,
                         const py::dict &options);
void set_mesh_options_surface(MMG5_pMesh mesh, MMG5_pSol met,
                              const py::dict &options);

std::string path_to_string(const py::object &path);

// Helper to merge options with a default value
py::dict merge_options_with_default(const py::dict &options, const char *key,
                                    py::object default_value);

#endif // MMG_COMMON_HPP
