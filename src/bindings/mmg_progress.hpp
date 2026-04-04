#ifndef MMG_PROGRESS_HPP
#define MMG_PROGRESS_HPP

#include "mmg/common/libmmgtypes.h"
#include <pybind11/pybind11.h>

namespace py = pybind11;

/**
 * Data passed through the MMG progress callback's user_data pointer.
 * Holds a reference to the Python callable.
 */
struct ProgressCallbackData {
  py::object py_callback; // Python callable or py::none()
};

/**
 * C callback that bridges MMG's progress reporting to a Python callable.
 *
 * The GIL must be re-acquired because MmgMesh::remesh() releases it
 * before calling MMG3D_mmg3dlib / MMG2D_mmg2dlib / MMGS_mmgslib.
 *
 * Returns 1 to continue, 0 to cancel.
 */
inline int progress_trampoline(void * /*mesh_ptr*/, int phase, int iteration,
                               int max_iterations, int64_t n_split,
                               int64_t n_collapse, int64_t n_swap,
                               int64_t n_move, void *user_data) {
  auto *data = static_cast<ProgressCallbackData *>(user_data);
  if (!data || data->py_callback.is_none())
    return 1;

  py::gil_scoped_acquire acquire;
  try {
    py::object result = data->py_callback(phase, iteration, max_iterations,
                                          n_split, n_collapse, n_swap, n_move);
    // None or True => continue; False => cancel
    if (result.is_none() || result.cast<bool>())
      return 1;
    return 0;
  } catch (py::error_already_set &e) {
    // Can't propagate Python exceptions across a C callback boundary.
    // Clear the error and request cancellation.
    e.restore();
    PyErr_Clear();
    return 0;
  }
}

#endif // MMG_PROGRESS_HPP
