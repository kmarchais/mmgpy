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
