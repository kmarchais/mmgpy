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

  ~MmgMesh() {
    MMG3D_Free_all(MMG5_ARG_start, MMG5_ARG_ppMesh, &mesh, MMG5_ARG_ppMet, &met,
                   MMG5_ARG_ppDisp, &disp, MMG5_ARG_ppLs, &ls, MMG5_ARG_end);
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
