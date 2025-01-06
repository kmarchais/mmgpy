#include "bindings.h"
#include "mmg/common/mmgversion.h"
#include "mmg_mesh.hpp"

PYBIND11_MODULE(_mmgpy, m) {
  // Add the new MmgMesh class
  py::class_<MmgMesh>(m, "MmgMesh")
      .def(py::init<>())
      .def(py::init<const py::array_t<double> &, const py::array_t<int> &>())
      .def(py::init([](const py::object &path) {
        // Handle both str and Path objects
        if (py::isinstance<py::str>(path)) {
          return new MmgMesh(std::variant<std::string, std::filesystem::path>(
              path.cast<std::string>()));
        } else {
          // Assume it's a Path object
          return new MmgMesh(std::variant<std::string, std::filesystem::path>(
              std::filesystem::path(
                  path.attr("__str__")().cast<std::string>())));
        }
      }))
      .def("set_vertices_and_elements", &MmgMesh::set_vertices_and_elements)
      .def("get_vertices", &MmgMesh::get_vertices)
      .def("get_elements", &MmgMesh::get_elements)
      .def("set_field", &MmgMesh::set_field)
      .def("get_field", &MmgMesh::get_field)
      .def("__getitem__", &MmgMesh::getitem)
      .def("__setitem__", &MmgMesh::setitem)
      .def("save", [](const MmgMesh &self, const py::object &path) {
        // Handle both str and Path objects
        if (py::isinstance<py::str>(path)) {
          self.save(std::variant<std::string, std::filesystem::path>(
              path.cast<std::string>()));
        } else {
          // Assume it's a Path object
          self.save(std::variant<std::string, std::filesystem::path>(
              std::filesystem::path(
                  path.attr("__str__")().cast<std::string>())));
        }
      });

  py::class_<mmg3d>(m, "mmg3d")
      .def_static("remesh", remesh_3d, py::arg("input_mesh"),
                  py::arg("input_sol") = py::none(),
                  py::arg("output_mesh") = py::none(),
                  py::arg("output_sol") = py::none(),
                  py::arg("options") = py::dict());

  py::class_<mmg2d>(m, "mmg2d")
      .def_static("remesh", remesh_2d, py::arg("input_mesh"),
                  py::arg("input_sol") = py::none(),
                  py::arg("output_mesh") = py::none(),
                  py::arg("output_sol") = py::none(),
                  py::arg("options") = py::dict());

  py::class_<mmgs>(m, "mmgs").def_static(
      "remesh", remesh_s, py::arg("input_mesh"),
      py::arg("input_sol") = py::none(), py::arg("output_mesh") = py::none(),
      py::arg("output_sol") = py::none(), py::arg("options") = py::dict());

  m.attr("MMG_VERSION") = MMG_VERSION_RELEASE;
}
