#include "bindings.h"
#include "mmg/common/mmgversion.h"
#include "mmg_mesh.hpp"

PYBIND11_MODULE(_mmgpy, m) {
  // Add the new MmgMesh class
  py::class_<MmgMesh>(m, "MmgMesh")
      .def(py::init<>())
      .def(py::init<const py::array_t<double> &, const py::array_t<int> &>())
      .def("set_vertices_and_elements", &MmgMesh::set_vertices_and_elements)
      .def("get_vertices", &MmgMesh::get_vertices)
      .def("get_elements", &MmgMesh::get_elements)
      .def("set_metric_field", &MmgMesh::set_metric_field)
      .def("get_metric_field", &MmgMesh::get_metric_field)
      .def("set_displacement_field", &MmgMesh::set_displacement_field)
      .def("get_displacement_field", &MmgMesh::get_displacement_field)
      .def("set_levelset_field", &MmgMesh::set_levelset_field)
      .def("get_levelset_field", &MmgMesh::get_levelset_field);

  // Keep existing bindings
  py::class_<mmg3d>(m, "mmg3d")
      .def_static("remesh", remesh_3d, py::arg("input_mesh"),
                  py::arg("input_sol") = "", py::arg("output_mesh") = "",
                  py::arg("output_sol") = "", py::arg("options") = py::dict());

  py::class_<mmg2d>(m, "mmg2d")
      .def_static("remesh", remesh_2d, py::arg("input_mesh"),
                  py::arg("input_sol") = "", py::arg("output_mesh") = "",
                  py::arg("output_sol") = "", py::arg("options") = py::dict());

  py::class_<mmgs>(m, "mmgs").def_static(
      "remesh", remesh_s, py::arg("input_mesh"), py::arg("input_sol") = "",
      py::arg("output_mesh") = "", py::arg("output_sol") = "",
      py::arg("options") = py::dict());

  m.attr("MMG_VERSION") = MMG_VERSION_RELEASE;
}
