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
      // Low-level mesh construction API (Phase 1 of Issue #50)
      .def("set_mesh_size", &MmgMesh::set_mesh_size, py::arg("vertices") = 0,
           py::arg("tetrahedra") = 0, py::arg("prisms") = 0,
           py::arg("triangles") = 0, py::arg("quadrilaterals") = 0,
           py::arg("edges") = 0)
      .def("get_mesh_size", &MmgMesh::get_mesh_size)
      .def("set_vertices", &MmgMesh::set_vertices, py::arg("vertices"),
           py::arg("refs") = py::none())
      .def("set_tetrahedra", &MmgMesh::set_tetrahedra, py::arg("tetrahedra"),
           py::arg("refs") = py::none())
      .def("set_triangles", &MmgMesh::set_triangles, py::arg("triangles"),
           py::arg("refs") = py::none())
      .def("set_edges", &MmgMesh::set_edges, py::arg("edges"),
           py::arg("refs") = py::none())
      .def("get_vertices_with_refs", &MmgMesh::get_vertices_with_refs)
      .def("get_triangles", &MmgMesh::get_triangles)
      .def("get_triangles_with_refs", &MmgMesh::get_triangles_with_refs)
      .def("get_elements_with_refs", &MmgMesh::get_elements_with_refs)
      .def("get_edges", &MmgMesh::get_edges)
      .def("get_edges_with_refs", &MmgMesh::get_edges_with_refs)
      // Phase 2: Single element operations
      .def("set_vertex", &MmgMesh::set_vertex, py::arg("x"), py::arg("y"),
           py::arg("z"), py::arg("ref"), py::arg("idx"))
      .def("set_tetrahedron", &MmgMesh::set_tetrahedron, py::arg("v0"),
           py::arg("v1"), py::arg("v2"), py::arg("v3"), py::arg("ref"),
           py::arg("idx"))
      .def("set_triangle", &MmgMesh::set_triangle, py::arg("v0"), py::arg("v1"),
           py::arg("v2"), py::arg("ref"), py::arg("idx"))
      .def("set_edge", &MmgMesh::set_edge, py::arg("v0"), py::arg("v1"),
           py::arg("ref"), py::arg("idx"))
      .def("get_vertex", &MmgMesh::get_vertex, py::arg("idx"))
      .def("get_tetrahedron", &MmgMesh::get_tetrahedron, py::arg("idx"))
      .def("get_triangle", &MmgMesh::get_triangle, py::arg("idx"))
      .def("get_edge", &MmgMesh::get_edge, py::arg("idx"))
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
