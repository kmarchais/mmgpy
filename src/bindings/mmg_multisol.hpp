#ifndef MMG_MULTISOL_HPP
#define MMG_MULTISOL_HPP

#include "mmg/common/libmmgtypes.h"
#include "mmg_common.hpp"
#include <pybind11/numpy.h>
#include <pybind11/pybind11.h>
#include <pybind11/stl.h>
#include <string>
#include <vector>

namespace py = pybind11;

// Function pointer signatures shared by MMG3D/MMG2D/MMGS multi-sol API.
using SetSolsAtVerticesSizeFn = int (*)(MMG5_pMesh, MMG5_pSol *, int, MMG5_int,
                                        int *);
using GetSolsAtVerticesSizeFn = int (*)(MMG5_pMesh, MMG5_pSol *, int *,
                                        MMG5_int *, int *);
using SetIthSolsFn = int (*)(MMG5_pSol, int, double *);
using GetIthSolsFn = int (*)(MMG5_pSol, int, double *);
using LoadAllSolsFn = int (*)(MMG5_pMesh, MMG5_pSol *, const char *);
using SaveAllSolsFn = int (*)(MMG5_pMesh, MMG5_pSol *, const char *);
using FreeAllSolsFn = int (*)(MMG5_pMesh, MMG5_pSol *);

// Functions bundled into one struct so each call-site passes a single argument.
struct MultiSolApi {
  SetSolsAtVerticesSizeFn set_sols_size;
  GetSolsAtVerticesSizeFn get_sols_size;
  SetIthSolsFn set_ith_sols;
  GetIthSolsFn get_ith_sols;
  LoadAllSolsFn load_all_sols;
  SaveAllSolsFn save_all_sols;
  FreeAllSolsFn free_all_sols;
  int dim; // 2 for MMG2D, 3 for MMG3D/MMGS
};

// Number of doubles per vertex for a given MMG5_type value at dimension `dim`.
inline int components_for_type(int type, int dim) {
  switch (type) {
  case MMG5_Scalar:
    return 1;
  case MMG5_Vector:
    return dim;
  case MMG5_Tensor:
    return dim * (dim + 1) / 2;
  default:
    throw std::runtime_error(
        "Unknown MMG5 solution type: " + std::to_string(type) +
        " (expected 1=scalar, 2=vector, 3=tensor)");
  }
}

// Load every solution block from `filename` and return them as a Python list
// of (type_int, ndarray) tuples. `type_int` matches MMG5_type:
// 1=scalar (1D ndarray), 2=vector (Nxdim), 3=tensor (NxT where T=3 or 6).
inline py::list load_all_sols_vertices(MMG5_pMesh mesh,
                                       const std::string &fname,
                                       const MultiSolApi &api) {
  MMG5_pSol sols = nullptr;
  int ret = api.load_all_sols(mesh, &sols, fname.c_str());
  if (ret != 1) {
    // Free in case MMG allocated partway through.
    if (sols) {
      api.free_all_sols(mesh, &sols);
    }
    if (ret == 0) {
      throw std::runtime_error("Solution file not found: " + fname);
    }
    throw std::runtime_error("Failed to load solution file: " + fname);
  }

  int nsols = 0;
  MMG5_int nentities = 0;
  std::vector<int> typSol(MMG5_NSOLS_MAX, 0);
  if (api.get_sols_size(mesh, &sols, &nsols, &nentities, typSol.data()) != 1) {
    api.free_all_sols(mesh, &sols);
    throw std::runtime_error("Failed to query solution array size");
  }

  py::list out;
  try {
    for (int i = 0; i < nsols; ++i) {
      int type = typSol[i];
      int ncomp = components_for_type(type, api.dim);
      std::vector<py::ssize_t> shape;
      if (type == MMG5_Scalar) {
        shape = {nentities};
      } else {
        shape = {nentities, ncomp};
      }
      py::array_t<double> arr(shape);
      py::buffer_info buf = arr.request();
      double *ptr = static_cast<double *>(buf.ptr);
      if (api.get_ith_sols(sols, i + 1, ptr) != 1) {
        throw std::runtime_error("Failed to read solution block " +
                                 std::to_string(i + 1));
      }
      out.append(py::make_tuple(type, std::move(arr)));
    }
  } catch (...) {
    api.free_all_sols(mesh, &sols);
    throw;
  }

  api.free_all_sols(mesh, &sols);
  return out;
}

// Validate one entry of the input list and return (type, ndarray, ncomp).
inline std::tuple<int, py::array_t<double>, int>
unpack_save_entry(const py::handle &entry, int dim, MMG5_int nentities,
                  int index) {
  py::tuple t;
  try {
    t = entry.cast<py::tuple>();
  } catch (const py::cast_error &) {
    throw std::invalid_argument("save_all_sols entry " + std::to_string(index) +
                                " must be a (type_int, ndarray) tuple; got " +
                                std::string(py::str(entry.get_type())));
  }
  if (py::len(t) != 2) {
    throw std::invalid_argument("save_all_sols entry " + std::to_string(index) +
                                " must be a 2-tuple (type_int, ndarray)");
  }
  int type;
  try {
    type = t[0].cast<int>();
  } catch (const py::cast_error &) {
    throw std::invalid_argument("save_all_sols entry " + std::to_string(index) +
                                ": type must be an int (1, 2, or 3)");
  }
  if (type < MMG5_Scalar || type > MMG5_Tensor) {
    throw std::invalid_argument(
        "save_all_sols entry " + std::to_string(index) +
        ": type must be 1=scalar, 2=vector, or 3=tensor; got " +
        std::to_string(type));
  }
  py::array_t<double> arr;
  try {
    arr = py::array_t<double, py::array::c_style | py::array::forcecast>(t[1]);
  } catch (const py::cast_error &) {
    throw std::invalid_argument("save_all_sols entry " + std::to_string(index) +
                                ": value must be a numpy array of floats");
  }

  int ncomp = components_for_type(type, dim);
  py::buffer_info buf = arr.request();
  py::ssize_t n_rows;
  if (buf.ndim == 1) {
    if (ncomp != 1) {
      throw std::invalid_argument("save_all_sols entry " +
                                  std::to_string(index) + ": type " +
                                  std::to_string(type) + " needs a 2D (N," +
                                  std::to_string(ncomp) + ") array, got 1D");
    }
    n_rows = buf.shape[0];
  } else if (buf.ndim == 2) {
    n_rows = buf.shape[0];
    if (buf.shape[1] != ncomp) {
      throw std::invalid_argument(
          "save_all_sols entry " + std::to_string(index) + ": type " +
          std::to_string(type) + " expects " + std::to_string(ncomp) +
          " components per row, got " + std::to_string(buf.shape[1]));
    }
  } else {
    throw std::invalid_argument("save_all_sols entry " + std::to_string(index) +
                                ": array must be 1D or 2D");
  }
  if (n_rows != nentities) {
    throw std::invalid_argument("save_all_sols entry " + std::to_string(index) +
                                ": array length " + std::to_string(n_rows) +
                                " does not match vertex count " +
                                std::to_string(nentities));
  }
  return {type, std::move(arr), ncomp};
}

// Write a list of (type_int, ndarray) tuples to `filename` as a multi-block
// .sol/.solb file. Validates shapes against `nentities` (mesh->np).
inline void save_all_sols_vertices(MMG5_pMesh mesh, MMG5_int nentities,
                                   const std::string &fname,
                                   const py::list &sols,
                                   const MultiSolApi &api) {
  int nsols = static_cast<int>(py::len(sols));
  if (nsols <= 0) {
    throw std::invalid_argument("save_all_sols: empty solution list");
  }
  if (nsols > MMG5_NSOLS_MAX) {
    throw std::invalid_argument("save_all_sols: " + std::to_string(nsols) +
                                " solutions exceeds MMG5_NSOLS_MAX (" +
                                std::to_string(MMG5_NSOLS_MAX) + ")");
  }

  std::vector<int> typSol(nsols);
  std::vector<py::array_t<double>> arrays;
  arrays.reserve(nsols);
  for (int i = 0; i < nsols; ++i) {
    auto [type, arr, ncomp] = unpack_save_entry(sols[i], api.dim, nentities, i);
    (void)ncomp;
    typSol[i] = type;
    arrays.push_back(std::move(arr));
  }

  MMG5_pSol sol_array = nullptr;
  if (api.set_sols_size(mesh, &sol_array, nsols, nentities, typSol.data()) !=
      1) {
    if (sol_array) {
      api.free_all_sols(mesh, &sol_array);
    }
    throw std::runtime_error("Failed to allocate multi-solution array");
  }

  try {
    for (int i = 0; i < nsols; ++i) {
      py::buffer_info buf = arrays[i].request();
      double *ptr = static_cast<double *>(buf.ptr);
      if (api.set_ith_sols(sol_array, i + 1, ptr) != 1) {
        throw std::runtime_error("Failed to set solution block " +
                                 std::to_string(i + 1));
      }
    }
    if (api.save_all_sols(mesh, &sol_array, fname.c_str()) != 1) {
      throw std::runtime_error("Failed to save solution file: " + fname);
    }
  } catch (...) {
    api.free_all_sols(mesh, &sol_array);
    throw;
  }
  api.free_all_sols(mesh, &sol_array);
}

#endif // MMG_MULTISOL_HPP
