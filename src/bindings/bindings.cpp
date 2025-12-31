#include "bindings.h"
#include "mmg/common/mmgversion.h"
#include "mmg_mesh.hpp"
#include "mmg_mesh_2d.hpp"
#include "mmg_mesh_s.hpp"

PYBIND11_MODULE(_mmgpy, m) {
  // MmgMesh3D class for 3D volumetric meshes (MMG3D)
  py::class_<MmgMesh>(m, "MmgMesh3D")
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
      // Phase 3: Advanced element types
      .def("set_prism", &MmgMesh::set_prism, py::arg("v0"), py::arg("v1"),
           py::arg("v2"), py::arg("v3"), py::arg("v4"), py::arg("v5"),
           py::arg("ref"), py::arg("idx"))
      .def("set_quadrilateral", &MmgMesh::set_quadrilateral, py::arg("v0"),
           py::arg("v1"), py::arg("v2"), py::arg("v3"), py::arg("ref"),
           py::arg("idx"))
      .def("set_prisms", &MmgMesh::set_prisms, py::arg("prisms"),
           py::arg("refs") = py::none())
      .def("set_quadrilaterals", &MmgMesh::set_quadrilaterals, py::arg("quads"),
           py::arg("refs") = py::none())
      .def("get_prism", &MmgMesh::get_prism, py::arg("idx"))
      .def("get_quadrilateral", &MmgMesh::get_quadrilateral, py::arg("idx"))
      .def("get_prisms", &MmgMesh::get_prisms)
      .def("get_prisms_with_refs", &MmgMesh::get_prisms_with_refs)
      .def("get_quadrilaterals", &MmgMesh::get_quadrilaterals)
      .def("get_quadrilaterals_with_refs",
           &MmgMesh::get_quadrilaterals_with_refs)
      .def("get_tetrahedra", &MmgMesh::get_tetrahedra)
      .def("get_tetrahedra_with_refs", &MmgMesh::get_tetrahedra_with_refs)
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

  // Phase 4: MmgMesh2D class for 2D planar meshes
  py::class_<MmgMesh2D>(m, "MmgMesh2D")
      .def(py::init<>())
      .def(py::init<const py::array_t<double> &, const py::array_t<int> &>())
      .def(py::init([](const py::object &path) {
        if (py::isinstance<py::str>(path)) {
          return new MmgMesh2D(std::variant<std::string, std::filesystem::path>(
              path.cast<std::string>()));
        } else {
          return new MmgMesh2D(std::variant<std::string, std::filesystem::path>(
              std::filesystem::path(
                  path.attr("__str__")().cast<std::string>())));
        }
      }))
      // Mesh sizing
      .def("set_mesh_size", &MmgMesh2D::set_mesh_size, py::arg("vertices") = 0,
           py::arg("triangles") = 0, py::arg("quadrilaterals") = 0,
           py::arg("edges") = 0)
      .def("get_mesh_size", &MmgMesh2D::get_mesh_size)
      // Bulk setters
      .def("set_vertices", &MmgMesh2D::set_vertices, py::arg("vertices"),
           py::arg("refs") = py::none())
      .def("set_triangles", &MmgMesh2D::set_triangles, py::arg("triangles"),
           py::arg("refs") = py::none())
      .def("set_quadrilaterals", &MmgMesh2D::set_quadrilaterals,
           py::arg("quads"), py::arg("refs") = py::none())
      .def("set_edges", &MmgMesh2D::set_edges, py::arg("edges"),
           py::arg("refs") = py::none())
      // Bulk getters
      .def("get_vertices", &MmgMesh2D::get_vertices)
      .def("get_vertices_with_refs", &MmgMesh2D::get_vertices_with_refs)
      .def("get_triangles", &MmgMesh2D::get_triangles)
      .def("get_triangles_with_refs", &MmgMesh2D::get_triangles_with_refs)
      .def("get_quadrilaterals", &MmgMesh2D::get_quadrilaterals)
      .def("get_edges", &MmgMesh2D::get_edges)
      .def("get_edges_with_refs", &MmgMesh2D::get_edges_with_refs)
      // Single element setters
      .def("set_vertex", &MmgMesh2D::set_vertex, py::arg("x"), py::arg("y"),
           py::arg("ref"), py::arg("idx"))
      .def("set_triangle", &MmgMesh2D::set_triangle, py::arg("v0"),
           py::arg("v1"), py::arg("v2"), py::arg("ref"), py::arg("idx"))
      .def("set_quadrilateral", &MmgMesh2D::set_quadrilateral, py::arg("v0"),
           py::arg("v1"), py::arg("v2"), py::arg("v3"), py::arg("ref"),
           py::arg("idx"))
      .def("set_edge", &MmgMesh2D::set_edge, py::arg("v0"), py::arg("v1"),
           py::arg("ref"), py::arg("idx"))
      // Single element getters
      .def("get_vertex", &MmgMesh2D::get_vertex, py::arg("idx"))
      .def("get_triangle", &MmgMesh2D::get_triangle, py::arg("idx"))
      .def("get_quadrilateral", &MmgMesh2D::get_quadrilateral, py::arg("idx"))
      .def("get_edge", &MmgMesh2D::get_edge, py::arg("idx"))
      // Solution fields
      .def("set_field", &MmgMesh2D::set_field)
      .def("get_field", &MmgMesh2D::get_field)
      .def("__getitem__", &MmgMesh2D::getitem)
      .def("__setitem__", &MmgMesh2D::setitem)
      // File I/O
      .def("save", [](const MmgMesh2D &self, const py::object &path) {
        if (py::isinstance<py::str>(path)) {
          self.save(std::variant<std::string, std::filesystem::path>(
              path.cast<std::string>()));
        } else {
          self.save(std::variant<std::string, std::filesystem::path>(
              std::filesystem::path(
                  path.attr("__str__")().cast<std::string>())));
        }
      });

  // Phase 4: MmgMeshS class for surface meshes
  py::class_<MmgMeshS>(m, "MmgMeshS")
      .def(py::init<>())
      .def(py::init<const py::array_t<double> &, const py::array_t<int> &>())
      .def(py::init([](const py::object &path) {
        if (py::isinstance<py::str>(path)) {
          return new MmgMeshS(std::variant<std::string, std::filesystem::path>(
              path.cast<std::string>()));
        } else {
          return new MmgMeshS(std::variant<std::string, std::filesystem::path>(
              std::filesystem::path(
                  path.attr("__str__")().cast<std::string>())));
        }
      }))
      // Mesh sizing
      .def("set_mesh_size", &MmgMeshS::set_mesh_size, py::arg("vertices") = 0,
           py::arg("triangles") = 0, py::arg("edges") = 0)
      .def("get_mesh_size", &MmgMeshS::get_mesh_size)
      // Bulk setters
      .def("set_vertices", &MmgMeshS::set_vertices, py::arg("vertices"),
           py::arg("refs") = py::none())
      .def("set_triangles", &MmgMeshS::set_triangles, py::arg("triangles"),
           py::arg("refs") = py::none())
      .def("set_edges", &MmgMeshS::set_edges, py::arg("edges"),
           py::arg("refs") = py::none())
      // Bulk getters
      .def("get_vertices", &MmgMeshS::get_vertices)
      .def("get_vertices_with_refs", &MmgMeshS::get_vertices_with_refs)
      .def("get_triangles", &MmgMeshS::get_triangles)
      .def("get_triangles_with_refs", &MmgMeshS::get_triangles_with_refs)
      .def("get_edges", &MmgMeshS::get_edges)
      .def("get_edges_with_refs", &MmgMeshS::get_edges_with_refs)
      // Single element setters
      .def("set_vertex", &MmgMeshS::set_vertex, py::arg("x"), py::arg("y"),
           py::arg("z"), py::arg("ref"), py::arg("idx"))
      .def("set_triangle", &MmgMeshS::set_triangle, py::arg("v0"),
           py::arg("v1"), py::arg("v2"), py::arg("ref"), py::arg("idx"))
      .def("set_edge", &MmgMeshS::set_edge, py::arg("v0"), py::arg("v1"),
           py::arg("ref"), py::arg("idx"))
      // Single element getters
      .def("get_vertex", &MmgMeshS::get_vertex, py::arg("idx"))
      .def("get_triangle", &MmgMeshS::get_triangle, py::arg("idx"))
      .def("get_edge", &MmgMeshS::get_edge, py::arg("idx"))
      // Solution fields
      .def("set_field", &MmgMeshS::set_field)
      .def("get_field", &MmgMeshS::get_field)
      .def("__getitem__", &MmgMeshS::getitem)
      .def("__setitem__", &MmgMeshS::setitem)
      // File I/O
      .def("save", [](const MmgMeshS &self, const py::object &path) {
        if (py::isinstance<py::str>(path)) {
          self.save(std::variant<std::string, std::filesystem::path>(
              path.cast<std::string>()));
        } else {
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
