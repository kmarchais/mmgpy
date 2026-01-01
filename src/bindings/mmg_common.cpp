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
