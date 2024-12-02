#include "bindings.h"

#include "mmg/common/mmgversion.h"

#include <pybind11/pybind11.h>
#include <pybind11/stl.h>

PYBIND11_MODULE(_mmgpy, m) {
    py::class_<mmg3d>(m, "mmg3d")
        .def_static("remesh", remesh_3d,
                    py::arg("input_mesh"),
                    py::arg("input_sol") = "",
                    py::arg("output_mesh") = "output.mesh",
                    py::arg("output_sol") = "",
                    py::arg("options") = py::dict());

    py::class_<mmg2d>(m, "mmg2d")
        .def_static("remesh", remesh_2d,
                    py::arg("input_mesh"),
                    py::arg("input_sol") = "",
                    py::arg("output_mesh") = "output.mesh",
                    py::arg("output_sol") = "",
                    py::arg("options") = py::dict());

    py::class_<mmgs>(m, "mmgs")
        .def_static("remesh", remesh_s,
                    py::arg("input_mesh"),
                    py::arg("input_sol") = "",
                    py::arg("output_mesh") = "output.mesh",
                    py::arg("output_sol") = "",
                    py::arg("options") = py::dict());

    m.attr("MMG_VERSION") = MMG_VERSION_RELEASE;
}
