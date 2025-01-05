#ifndef MMG_MESH_HPP
#define MMG_MESH_HPP

#include "mmg/mmg3d/libmmg3d.h"
#include <pybind11/numpy.h>
#include <pybind11/pybind11.h>
#include <stdexcept>

namespace py = pybind11;

class MmgMesh {
public:
  MmgMesh() {
    // Initialize MMG3D structures
    mesh = nullptr;
    met = nullptr;
    disp = nullptr;
    ls = nullptr;

    if (!MMG3D_Init_mesh(MMG5_ARG_start, MMG5_ARG_ppMesh, &mesh, MMG5_ARG_ppMet,
                         &met, MMG5_ARG_ppDisp, &disp, MMG5_ARG_ppLs, &ls,
                         MMG5_ARG_end)) {
      throw std::runtime_error("Failed to initialize MMG3D mesh");
    }
  }

  MmgMesh(const py::array_t<double> &vertices, const py::array_t<int> &elements)
      : MmgMesh() {
    set_vertices_and_elements(vertices, elements);
  }

  ~MmgMesh() {
    MMG3D_Free_all(MMG5_ARG_start, MMG5_ARG_ppMesh, &mesh, MMG5_ARG_ppMet, &met,
                   MMG5_ARG_ppDisp, &disp, MMG5_ARG_ppLs, &ls, MMG5_ARG_end);
  }

  void set_vertices_and_elements(const py::array_t<double> &vertices,
                                 const py::array_t<int> &elements) {
    py::buffer_info vert_buf = vertices.request();
    py::buffer_info elem_buf = elements.request();

    if (vert_buf.ndim != 2 || vert_buf.shape[1] != 3) {
      throw std::runtime_error("Vertices must be an Nx3 array");
    }
    if (elem_buf.ndim != 2 || elem_buf.shape[1] != 4) {
      throw std::runtime_error(
          "Elements must be an Nx4 array for tetrahedral mesh");
    }

    const double *vert_ptr = static_cast<double *>(vert_buf.ptr);
    const int *elem_ptr = static_cast<int *>(elem_buf.ptr);

    MMG5_int nvert = vert_buf.shape[0];
    MMG5_int nelem = elem_buf.shape[0];

    if (!MMG3D_Set_meshSize(mesh, nvert, nelem, 0, 0, 0, 0)) {
      throw std::runtime_error("Failed to set mesh size");
    }

    for (MMG5_int i = 0; i < nvert; i++) {
      if (!MMG3D_Set_vertex(mesh, vert_ptr[i * 3], vert_ptr[i * 3 + 1],
                            vert_ptr[i * 3 + 2],
                            0,        // Reference (tag)
                            i + 1)) { // 1-based vertex index
        throw std::runtime_error("Failed to set vertex");
      }
    }

    for (MMG5_int i = 0; i < nelem; i++) {
      if (!MMG3D_Set_tetrahedron(
              mesh,
              elem_ptr[i * 4] + 1, // Convert to 1-based indexing
              elem_ptr[i * 4 + 1] + 1, elem_ptr[i * 4 + 2] + 1,
              elem_ptr[i * 4 + 3] + 1,
              0,        // Reference (tag)
              i + 1)) { // 1-based element index
        throw std::runtime_error("Failed to set tetrahedron");
      }
    }
  }

  py::array_t<double> get_vertices() const {
    MMG5_int np = mesh->np;
    py::array_t<double> vertices({np, 3});
    auto buf = vertices.request();
    double *ptr = static_cast<double *>(buf.ptr);

    // Reset internal counter by setting npi = np (it will be reset in first
    // Get_vertex call)
    mesh->npi = mesh->np;

    for (MMG5_int i = 0; i < np; i++) {
      double x, y, z;
      MMG5_int ref;
      int corner, required;

      if (!MMG3D_Get_vertex(mesh, &x, &y, &z, &ref, &corner, &required)) {
        throw std::runtime_error("Failed to get vertex");
      }

      ptr[i * 3] = x;
      ptr[i * 3 + 1] = y;
      ptr[i * 3 + 2] = z;
    }
    return vertices;
  }

  py::array_t<int> get_elements() const {
    MMG5_int ne = mesh->ne;
    py::array_t<int> elements({ne, 4});
    auto buf = elements.request();
    int *ptr = static_cast<int *>(buf.ptr);

    // Reset internal counter
    mesh->nti = mesh->nt;

    for (MMG5_int i = 0; i < ne; i++) {
      int v1, v2, v3, v4;
      MMG5_int ref;
      int required;

      if (!MMG3D_Get_tetrahedron(mesh, &v1, &v2, &v3, &v4, &ref, &required)) {
        throw std::runtime_error("Failed to get tetrahedron");
      }

      ptr[i * 4] = v1 - 1; // Convert to 0-based indexing for Python
      ptr[i * 4 + 1] = v2 - 1;
      ptr[i * 4 + 2] = v3 - 1;
      ptr[i * 4 + 3] = v4 - 1;
    }
    return elements;
  }

  void set_metric_field(const py::array_t<double> &metric) {
    py::buffer_info buf = metric.request();

    if (buf.ndim != 2 || buf.shape[1] != 1) {
      throw std::runtime_error(
          "Metric must be an Nx1 array for isotropic metric");
    }

    MMG5_int np = mesh->np;
    if (buf.shape[0] != np) {
      throw std::runtime_error(
          "Metric array size must match number of vertices");
    }

    // Set solution field type as scalar
    if (!MMG3D_Set_solSize(mesh, met, MMG5_Vertex, np, MMG5_Scalar)) {
      throw std::runtime_error("Failed to set metric solution size");
    }

    const double *ptr = static_cast<double *>(buf.ptr);
    if (!MMG3D_Set_scalarSols(met, const_cast<double *>(ptr))) {
      throw std::runtime_error("Failed to set metric values");
    }
  }

  void set_displacement_field(const py::array_t<double> &displacement) {
    py::buffer_info buf = displacement.request();

    if (buf.ndim != 2 || buf.shape[1] != 3) {
      throw std::runtime_error("Displacement must be an Nx3 array");
    }

    MMG5_int np = mesh->np;
    if (buf.shape[0] != np) {
      throw std::runtime_error(
          "Displacement array size must match number of vertices");
    }

    // Set solution field type as vector
    if (!MMG3D_Set_solSize(mesh, disp, MMG5_Vertex, np, MMG5_Vector)) {
      throw std::runtime_error("Failed to set displacement solution size");
    }

    const double *ptr = static_cast<double *>(buf.ptr);
    if (!MMG3D_Set_vectorSols(disp, const_cast<double *>(ptr))) {
      throw std::runtime_error("Failed to set displacement values");
    }
  }

  void set_levelset_field(const py::array_t<double> &levelset) {
    py::buffer_info buf = levelset.request();

    if (buf.ndim != 2 || buf.shape[1] != 1) {
      throw std::runtime_error("Level set must be an Nx1 array");
    }

    MMG5_int np = mesh->np;
    if (buf.shape[0] != np) {
      throw std::runtime_error(
          "Level set array size must match number of vertices");
    }

    // Set solution field type as scalar
    if (!MMG3D_Set_solSize(mesh, ls, MMG5_Vertex, np, MMG5_Scalar)) {
      throw std::runtime_error("Failed to set level set solution size");
    }

    const double *ptr = static_cast<double *>(buf.ptr);
    if (!MMG3D_Set_scalarSols(ls, const_cast<double *>(ptr))) {
      throw std::runtime_error("Failed to set level set values");
    }
  }

  py::array_t<double> get_metric_field() const {
    MMG5_int np = mesh->np;
    py::array_t<double> metric({np, 1});
    auto buf = metric.request();
    double *ptr = static_cast<double *>(buf.ptr);

    if (!MMG3D_Get_scalarSols(met, ptr)) {
      throw std::runtime_error("Failed to get metric values");
    }
    return metric;
  }

  py::array_t<double> get_displacement_field() const {
    MMG5_int np = mesh->np;
    py::array_t<double> displacement({np, 3});
    auto buf = displacement.request();
    double *ptr = static_cast<double *>(buf.ptr);

    if (!MMG3D_Get_vectorSols(disp, ptr)) {
      throw std::runtime_error("Failed to get displacement values");
    }
    return displacement;
  }

  py::array_t<double> get_levelset_field() const {
    MMG5_int np = mesh->np;
    py::array_t<double> levelset({np, 1});
    auto buf = levelset.request();
    double *ptr = static_cast<double *>(buf.ptr);

    if (!MMG3D_Get_scalarSols(ls, ptr)) {
      throw std::runtime_error("Failed to get level set values");
    }
    return levelset;
  }

  // Delete copy constructor and assignment operator
  MmgMesh(const MmgMesh &) = delete;
  MmgMesh &operator=(const MmgMesh &) = delete;

private:
  MMG5_pMesh mesh;
  MMG5_pSol met;
  MMG5_pSol disp;
  MMG5_pSol ls;
};

#endif // MMG_MESH_HPP
