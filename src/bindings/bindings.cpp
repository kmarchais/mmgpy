#include "bindings.h"

#include "mmg/common/mmgversion.h"

PYBIND11_MODULE(_mmgpy, m) {
  m.def("_remesh_3d", remesh_3d, py::arg("input_mesh"),
        py::arg("input_sol") = "", py::arg("output_mesh") = "output.mesh",
        py::arg("output_sol") = "", py::arg("options") = py::dict());

  m.def("_remesh_2d", remesh_2d, py::arg("input_mesh"),
        py::arg("input_sol") = "", py::arg("output_mesh") = "output.mesh",
        py::arg("output_sol") = "", py::arg("options") = py::dict());

  m.def("_remesh_s", remesh_s, py::arg("input_mesh"), py::arg("input_sol") = "",
        py::arg("output_mesh") = "output.mesh", py::arg("output_sol") = "",
        py::arg("options") = py::dict());

  m.attr("MMG_VERSION") = MMG_VERSION_RELEASE;
}
