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
      .def("get_elements", &MmgMesh::get_elements);

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
