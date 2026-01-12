#pragma once

#ifndef MMG_COMMON_HPP
#define MMG_COMMON_HPP

#include <stdexcept>
#include <string>
#include <tuple>
#include <type_traits>
#include <vector>

#include "mmg/mmg3d/libmmg3d.h"
#include <pybind11/pybind11.h>
#include <pybind11/stl.h>

namespace py = pybind11;

// Cross-platform stderr capture for MMG warning collection.
// MMG outputs warnings to stderr (via fprintf), so we need to capture
// at the file descriptor level rather than C++ stream level.
class StderrCapture {
public:
  StderrCapture();
  ~StderrCapture();

  // Non-copyable
  StderrCapture(const StderrCapture &) = delete;
  StderrCapture &operator=(const StderrCapture &) = delete;

  // Get all captured output
  std::string get() const;

private:
  void start_capture();
  void stop_capture();

  int original_stderr_fd;
  int pipe_read_fd;
  int pipe_write_fd;
  bool capturing;
  std::string captured_output;

#ifdef _WIN32
  static constexpr int INVALID_FD = -1;
#else
  static constexpr int INVALID_FD = -1;
#endif
};

// Parse MMG warning messages from captured stderr output.
// Looks for patterns:
// - "## Warning: ..."
// - " ** WARNING: ..."
// - "MMG5_warning: ..."
std::vector<std::string> parse_mmg_warnings(const std::string &output);

template <typename T>
T safe_cast(const py::handle &obj, const std::string &param_name) {
  try {
    return obj.cast<T>();
  } catch (const py::cast_error &) {
    std::string type_name;
    if constexpr (std::is_same_v<T, double>) {
      type_name = "a number";
    } else if constexpr (std::is_same_v<T, int>) {
      type_name = "an integer";
    } else {
      type_name = "the correct type";
    }
    throw std::invalid_argument("Option '" + param_name + "' must be " +
                                type_name + ", got " +
                                std::string(py::str(obj.get_type())));
  }
}

enum class ParamType { Double, Integer };

struct ParamInfo {
  int param_type;
  ParamType type;
};

// Statistics collected before and after remeshing operations
struct RemeshStats {
  MMG5_int vertices;
  MMG5_int elements; // tetrahedra for 3D, triangles for 2D/surface
  MMG5_int triangles;
  MMG5_int edges;
  double quality_min;
  double quality_mean;
};

std::string get_file_extension(const std::string &filename);

void set_mesh_options_2D(MMG5_pMesh mesh, MMG5_pSol met,
                         const py::dict &options);
void set_mesh_options_3D(MMG5_pMesh mesh, MMG5_pSol met,
                         const py::dict &options);
void set_mesh_options_surface(MMG5_pMesh mesh, MMG5_pSol met,
                              const py::dict &options);

std::string path_to_string(const py::object &path);

// Helper to merge options with a default value
py::dict merge_options_with_default(const py::dict &options, const char *key,
                                    py::object default_value);

// Build the remesh result dictionary from before/after stats
py::dict build_remesh_result(const RemeshStats &before,
                             const RemeshStats &after, double duration_seconds,
                             int return_code,
                             const std::vector<std::string> &warnings = {});

#endif // MMG_COMMON_HPP
