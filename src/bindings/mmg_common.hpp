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

// Statistics collected before and after remeshing operations
struct RemeshStats {
  MMG5_int vertices;
  MMG5_int elements; // tetrahedra for 3D, triangles for 2D/surface
  MMG5_int triangles;
  MMG5_int edges;
  double quality_min;
  double quality_mean;
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

// Build the remesh result dictionary from before/after stats
py::dict build_remesh_result(const RemeshStats &before,
                             const RemeshStats &after, double duration_seconds,
                             int return_code);

#endif // MMG_COMMON_HPP
