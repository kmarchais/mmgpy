#include "bindings.h"
#include <pybind11/numpy.h>
#include <pybind11/operators.h>

#include "mmg/common/libmmgtypes.h"
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

  // Bind the MMG5_Point structure
  py::class_<MMG5_Point>(m, "Point")
      // Coordinates as a numpy array
      // .def_property(
      //     "c",
      //     [](MMG5_Point &p) -> py::array_t<double> {
      //       return py::array_t<double>({3}, {sizeof(double)}, p.c);
      //     },
      //     [](MMG5_Point &p, py::array_t<double> arr) {
      //       auto r = arr.unchecked<1>();
      //       if (r.shape(0) != 3)
      //         throw std::runtime_error("Coordinates must be length 3");
      //       for (size_t i = 0; i < 3; i++)
      //         p.c[i] = r(i);
      //     })
      // Normal as a numpy array
      // .def_property(
      //     "n",
      //     [](MMG5_Point &p) -> py::array_t<double> {
      //       return py::array_t<double>({3}, {sizeof(double)}, p.n);
      //     },
      //     [](MMG5_Point &p, py::array_t<double> arr) {
      //       auto r = arr.unchecked<1>();
      //       if (r.shape(0) != 3)
      //         throw std::runtime_error("Normal must be length 3");
      //       for (size_t i = 0; i < 3; i++)
      //         p.n[i] = r(i);
      //     })
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
      .def(py::init<>());
  // String representation
  // .def("__repr__", [](const MMG5_Point &p)
  //      { return "<MMG5_Point at (" + std::to_string(p.c[0]) + "," +
  //               std::to_string(p.c[1]) + "," + std::to_string(p.c[2]) + ")>";
  //               });

  py::class_<MMG5_Tetra>(m, "Tetra")
      // Quality
      .def_readwrite("qual", &MMG5_Tetra::qual)

      // Vertices as numpy array
      .def_property(
          "v",
          [](MMG5_Tetra &t) -> py::array_t<MMG5_int> {
            return py::array_t<MMG5_int>({4}, {sizeof(MMG5_int)}, t.v);
          },
          [](MMG5_Tetra &t, py::array_t<MMG5_int> arr) {
            auto r = arr.unchecked<1>();
            if (r.shape(0) != 4)
              throw std::runtime_error("Vertices array must have length 4");
            for (int i = 0; i < 4; i++)
              t.v[i] = r(i);
          })

      // Integer properties
      .def_readwrite("ref", &MMG5_Tetra::ref)
      .def_readwrite("base", &MMG5_Tetra::base)
      .def_readwrite("mark", &MMG5_Tetra::mark)
      .def_readwrite("xt", &MMG5_Tetra::xt)
      .def_readwrite("flag", &MMG5_Tetra::flag)

      // Tag as uint16_t
      .def_readwrite("tag", &MMG5_Tetra::tag)

      // Constructor
      .def(py::init<>())

      // String representation
      .def("__repr__", [](const MMG5_Tetra &t) {
        return "<MMG5_Tetra with vertices (" + std::to_string(t.v[0]) + "," +
               std::to_string(t.v[1]) + "," + std::to_string(t.v[2]) + "," +
               std::to_string(t.v[3]) + "), ref=" + std::to_string(t.ref) +
               ", qual=" + std::to_string(t.qual) + ">";
      });

  py::class_<MMG5_Mesh>(m, "Mesh")
      // Memory info
      .def_readwrite("memMax", &MMG5_Mesh::memMax)
      .def_readwrite("memCur", &MMG5_Mesh::memCur)
      .def_readwrite("gap", &MMG5_Mesh::gap)

      // Mesh properties
      .def_readwrite("ver", &MMG5_Mesh::ver)
      .def_readwrite("dim", &MMG5_Mesh::dim)
      .def_readwrite("type", &MMG5_Mesh::type)

      // Counts and maximums
      .def_readwrite("np", &MMG5_Mesh::np) // number of vertices
      .def_readwrite("ne", &MMG5_Mesh::ne) // number of tetrahedra
      .def_readwrite("nt", &MMG5_Mesh::nt) // number of triangles
      .def_readwrite("na", &MMG5_Mesh::na) // number of edges
      .def_readwrite("npmax", &MMG5_Mesh::npmax)
      .def_readwrite("nemax", &MMG5_Mesh::nemax)
      .def_readwrite("ntmax", &MMG5_Mesh::ntmax)
      .def_readwrite("namax", &MMG5_Mesh::namax)

      // Additional element counts
      .def_readwrite("nquad", &MMG5_Mesh::nquad)
      .def_readwrite("nprism", &MMG5_Mesh::nprism)

      // Points access
      .def(
          "get_point",
          [](MMG5_Mesh &mesh, MMG5_int idx) -> MMG5_Point & {
            if (idx < 1 || idx > mesh.np)
              throw std::out_of_range("Point index out of range");
            return mesh.point[idx];
          },
          py::return_value_policy::reference)

      // Tetrahedra access
      .def(
          "get_tetra",
          [](MMG5_Mesh &mesh, MMG5_int idx) -> MMG5_Tetra & {
            if (idx < 1 || idx > mesh.ne)
              throw std::out_of_range("Tetrahedron index out of range");
            return mesh.tetra[idx];
          },
          py::return_value_policy::reference)

      // Adjacency access as numpy arrays
      .def_property_readonly("adja",
                             [](MMG5_Mesh &mesh) -> py::array_t<MMG5_int> {
                               if (!mesh.adja)
                                 return py::array_t<MMG5_int>(0);
                               return py::array_t<MMG5_int>(
                                   {mesh.ne, 4},
                                   {4 * sizeof(MMG5_int), sizeof(MMG5_int)},
                                   &mesh.adja[4] // Skip first unused element
                               );
                             })

      // File names
      .def_property(
          "namein",
          [](MMG5_Mesh &mesh) -> std::string {
            return mesh.namein ? mesh.namein : "";
          },
          [](MMG5_Mesh &mesh, const std::string &name) {
            if (mesh.namein)
              free(mesh.namein);
            mesh.namein = strdup(name.c_str());
          })
      .def_property(
          "nameout",
          [](MMG5_Mesh &mesh) -> std::string {
            return mesh.nameout ? mesh.nameout : "";
          },
          [](MMG5_Mesh &mesh, const std::string &name) {
            if (mesh.nameout)
              free(mesh.nameout);
            mesh.nameout = strdup(name.c_str());
          })

      // Constructor
      .def(py::init<>())

      // String representation
      .def("__repr__", [](const MMG5_Mesh &mesh) {
        return "<MMG5_Mesh: " + std::to_string(mesh.np) + " points, " +
               std::to_string(mesh.ne) + " tetrahedra, " +
               std::to_string(mesh.nt) + " triangles, " +
               std::to_string(mesh.na) + " edges>";
      });

  m.attr("MMG_VERSION") = MMG_VERSION_RELEASE;
}
