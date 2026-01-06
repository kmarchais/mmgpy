#include "mmg_common.hpp"

std::string get_file_extension(const std::string &filename) {
  size_t pos = filename.find_last_of(".");
  if (pos != std::string::npos) {
    return filename.substr(pos);
  }
  return "";
}

std::string path_to_string(const py::object &path) {
  if (py::isinstance<py::str>(path)) {
    return path.cast<std::string>();
  } else {
    // Assume it's a Path object and convert to string
    return path.attr("__str__")().cast<std::string>();
  }
}

py::dict merge_options_with_default(const py::dict &options, const char *key,
                                    py::object default_value) {
  py::dict merged;
  for (auto item : options) {
    merged[item.first] = item.second;
  }
  if (!merged.contains(key)) {
    merged[key] = default_value;
  }
  return merged;
}

py::dict build_remesh_result(const RemeshStats &before,
                             const RemeshStats &after, double duration_seconds,
                             int return_code) {
  py::dict result;
  result["vertices_before"] = before.vertices;
  result["vertices_after"] = after.vertices;
  result["elements_before"] = before.elements;
  result["elements_after"] = after.elements;
  result["triangles_before"] = before.triangles;
  result["triangles_after"] = after.triangles;
  result["edges_before"] = before.edges;
  result["edges_after"] = after.edges;
  result["quality_min_before"] = before.quality_min;
  result["quality_min_after"] = after.quality_min;
  result["quality_mean_before"] = before.quality_mean;
  result["quality_mean_after"] = after.quality_mean;
  result["duration_seconds"] = duration_seconds;
  result["warnings"] = py::tuple();
  result["return_code"] = return_code;
  return result;
}
