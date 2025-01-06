#pragma once

#include <string>

#include <pybind11/pybind11.h>
#include <pybind11/stl.h>

namespace py = pybind11;

class mmg3d {};
class mmg2d {};
class mmgs {};

// MMG3D functions
bool remesh_3d(const py::object &input_mesh, const py::object &input_sol,
               const py::object &output_mesh, const py::object &output_sol,
               py::dict options);

// MMG2D functions
bool remesh_2d(const py::object &input_mesh, const py::object &input_sol,
               const py::object &output_mesh, const py::object &output_sol,
               py::dict options);

// MMGS functions
bool remesh_s(const py::object &input_mesh, const py::object &input_sol,
              const py::object &output_mesh, const py::object &output_sol,
              py::dict options);
