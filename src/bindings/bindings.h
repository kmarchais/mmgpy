#pragma once

#include <string>

#include <pybind11/pybind11.h>
#include <pybind11/stl.h>

namespace py = pybind11;

class mmg3d {};
class mmg2d {};
class mmgs {};

bool remesh_2d(const std::string& input_mesh, const std::string& input_sol, const std::string& output_mesh, const std::string& output_sol, py::dict options);

bool remesh_3d(const std::string& input_mesh, const std::string& input_sol, const std::string& output_mesh, const std::string& output_sol, py::dict options);

bool remesh_s(const std::string& input_mesh, const std::string& input_sol, const std::string& output_mesh, const std::string& output_sol, py::dict options);
