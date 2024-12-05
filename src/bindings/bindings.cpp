#include "bindings.h"
#include <pybind11/numpy.h>
#include <pybind11/operators.h>

#include "mmg/common/mmgversion.h"
#include "mmg/common/libmmgtypes.h"

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

  // Bind the MMG5_Point structure
  py::class_<MMG5_Point>(m, "Point")
        // Coordinates as a numpy array
        .def_property("c",
            [](MMG5_Point& p) -> py::array_t<double> {
                return py::array_t<double>({3}, {sizeof(double)}, p.c);
            },
            [](MMG5_Point& p, py::array_t<double> arr) {
                auto r = arr.unchecked<1>();
                if (r.shape(0) != 3)
                    throw std::runtime_error("Coordinates must be length 3");
                for (size_t i = 0; i < 3; i++)
                    p.c[i] = r(i);
            })
        // Normal as a numpy array
        .def_property("n",
            [](MMG5_Point& p) -> py::array_t<double> {
                return py::array_t<double>({3}, {sizeof(double)}, p.n);
            },
            [](MMG5_Point& p, py::array_t<double> arr) {
                auto r = arr.unchecked<1>();
                if (r.shape(0) != 3)
                    throw std::runtime_error("Normal must be length 3");
                for (size_t i = 0; i < 3; i++)
                    p.n[i] = r(i);
            })
        // Integer properties
        .def_readwrite("ref", &MMG5_Point::ref)
        .def_readwrite("xp", &MMG5_Point::xp)
        .def_readwrite("tmp", &MMG5_Point::tmp)
        .def_readwrite("flag", &MMG5_Point::flag)
        .def_readwrite("s", &MMG5_Point::s)
        // Tag as uint16_t
        .def_readwrite("tag", &MMG5_Point::tag)
        // Tagdel as int8_t
        .def_readwrite("tagdel", &MMG5_Point::tagdel)
        // Constructor
        .def(py::init<>())
        // String representation
        .def("__repr__",
            [](const MMG5_Point &p) {
                return "<MMG5_Point at (" +
                       std::to_string(p.c[0]) + "," +
                       std::to_string(p.c[1]) + "," +
                       std::to_string(p.c[2]) + ")>";
            });

  m.attr("MMG_VERSION") = MMG_VERSION_RELEASE;
}
