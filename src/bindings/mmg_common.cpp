#include "mmg_common.hpp"

#include "mmg/mmgs/libmmgs.h"

#include <algorithm>
#include <cctype>
#include <cstdio>
#include <fstream>
#include <regex>
#include <sstream>

#ifdef _WIN32
#include <BaseTsd.h>
#include <fcntl.h>
#include <io.h>
typedef SSIZE_T ssize_t;
#define read _read
#define write _write
#define close _close
#define dup _dup
#define dup2 _dup2
#define fileno _fileno
#define lseek _lseek
#else
#include <cstdlib>
#include <unistd.h>
#endif

namespace {

std::string lowercase(std::string value) {
  std::transform(value.begin(), value.end(), value.begin(),
                 [](unsigned char c) { return std::tolower(c); });
  return value;
}

template <typename T>
T read_parameter_value(std::istream &input, const std::string &filename,
                       const char *description) {
  T value{};
  if (!(input >> value)) {
    throw std::runtime_error("Invalid MMG parameter file '" + filename +
                             "': expected " + description);
  }
  return value;
}

void require_mmgs_success(int success, const std::string &filename,
                          const std::string &operation) {
  if (!success) {
    throw std::runtime_error("Invalid MMGS parameter file '" + filename +
                             "': failed to " + operation);
  }
}

} // namespace

void validate_parameter_file(const std::string &filename) {
  std::error_code error;
  bool is_file = std::filesystem::is_regular_file(filename, error);
  if (error || !is_file) {
    throw std::runtime_error("MMG parameter file not found: " + filename);
  }

  std::ifstream input(filename);
  if (!input.is_open()) {
    throw std::runtime_error("MMG parameter file is not readable: " + filename);
  }
}

void parse_mmgs_parameter_file(MMG5_pMesh mesh, MMG5_pSol met,
                               const std::string &filename) {
  validate_parameter_file(filename);
  std::ifstream input(filename);
  std::string section;

  while (input >> section) {
    section = lowercase(section);
    if (section == "parameters") {
      int count = read_parameter_value<int>(input, filename, "parameter count");
      require_mmgs_success(
          MMGS_Set_iparameter(mesh, met, MMGS_IPARAM_numberOfLocalParam, count),
          filename, "set the local-parameter count");
      for (int i = 0; i < count; ++i) {
        MMG5_int ref =
            read_parameter_value<MMG5_int>(input, filename, "entity reference");
        std::string entity = lowercase(
            read_parameter_value<std::string>(input, filename, "entity type"));
        double hmin =
            read_parameter_value<double>(input, filename, "minimum size");
        double hmax =
            read_parameter_value<double>(input, filename, "maximum size");
        double hausd =
            read_parameter_value<double>(input, filename, "Hausdorff distance");
        if (entity != "triangle" && entity != "triangles") {
          throw std::runtime_error(
              "Invalid MMGS parameter file '" + filename +
              "': local parameters only support triangle references");
        }
        require_mmgs_success(MMGS_Set_localParameter(mesh, met, MMG5_Triangle,
                                                     ref, hmin, hmax, hausd),
                             filename,
                             "set local parameter for reference " +
                                 std::to_string(ref));
      }
    } else if (section == "lsbasereferences") {
      int count =
          read_parameter_value<int>(input, filename, "LS base-reference count");
      require_mmgs_success(
          MMGS_Set_iparameter(mesh, met, MMGS_IPARAM_numberOfLSBaseReferences,
                              count),
          filename, "set the LS base-reference count");
      for (int i = 0; i < count; ++i) {
        MMG5_int ref = read_parameter_value<MMG5_int>(input, filename,
                                                      "LS base reference");
        require_mmgs_success(MMGS_Set_lsBaseReference(mesh, met, ref), filename,
                             "set LS base reference " + std::to_string(ref));
      }
    } else if (section == "lsreferences") {
      int count =
          read_parameter_value<int>(input, filename, "LS reference count");
      require_mmgs_success(
          MMGS_Set_iparameter(mesh, met, MMGS_IPARAM_numberOfMat, count),
          filename, "set the LS reference count");
      for (int i = 0; i < count; ++i) {
        MMG5_int ref =
            read_parameter_value<MMG5_int>(input, filename, "LS reference");
        std::string split_token = read_parameter_value<std::string>(
            input, filename, "'nosplit' or inside reference");
        int split = MMG5_MMAT_NoSplit;
        MMG5_int ref_minus = ref;
        MMG5_int ref_plus = ref;
        if (lowercase(split_token) != "nosplit") {
          try {
            ref_minus = static_cast<MMG5_int>(std::stoll(split_token));
          } catch (const std::exception &) {
            throw std::runtime_error("Invalid MMGS parameter file '" +
                                     filename +
                                     "': expected 'nosplit' or "
                                     "an inside reference");
          }
          ref_plus = read_parameter_value<MMG5_int>(input, filename,
                                                    "outside reference");
          split = MMG5_MMAT_Split;
        }
        require_mmgs_success(
            MMGS_Set_multiMat(mesh, met, ref, split, ref_minus, ref_plus),
            filename, "set LS reference " + std::to_string(ref));
      }
    } else {
      throw std::runtime_error("Invalid MMGS parameter file '" + filename +
                               "': unknown section '" + section + "'");
    }
  }
}

// StderrCapture implementation using temporary files.
// Unlike pipes, temp files have no buffer limit, so MMG can write
// any amount of stderr output without blocking (avoiding deadlock
// when GIL is released and nobody is reading the pipe).
StderrCapture::StderrCapture()
    : original_stderr_fd(INVALID_FD), temp_fd(INVALID_FD), capturing(false) {
  start_capture();
}

StderrCapture::~StderrCapture() {
  if (capturing) {
    stop_capture();
  }
}

void StderrCapture::start_capture() {
  // Flush stderr before redirecting
  fflush(stderr);

  // Save the original stderr file descriptor
  original_stderr_fd = dup(fileno(stderr));
  if (original_stderr_fd == INVALID_FD) {
    return; // Don't break remeshing if capture fails
  }

  // Create a temporary file for capturing stderr
#ifdef _WIN32
  // On Windows, use _tempnam + _open for temp file
  char *tmp = _tempnam(nullptr, "mmg");
  if (!tmp) {
    close(original_stderr_fd);
    original_stderr_fd = INVALID_FD;
    return;
  }
  temp_filename = tmp;
  free(tmp);
  temp_fd = _open(temp_filename.c_str(), _O_CREAT | _O_RDWR | _O_BINARY,
                  _S_IREAD | _S_IWRITE);
  if (temp_fd == INVALID_FD) {
    temp_filename.clear();
    close(original_stderr_fd);
    original_stderr_fd = INVALID_FD;
    return;
  }
#else
  // On POSIX, use mkstemp + immediate unlink (file stays open, no name on fs)
  char tmpl[] = "/tmp/mmg_stderr_XXXXXX";
  temp_fd = mkstemp(tmpl);
  if (temp_fd == INVALID_FD) {
    close(original_stderr_fd);
    original_stderr_fd = INVALID_FD;
    return;
  }
  unlink(tmpl);
#endif

  // Redirect stderr to the temp file
  if (dup2(temp_fd, fileno(stderr)) == INVALID_FD) {
    close(original_stderr_fd);
    close(temp_fd);
    original_stderr_fd = INVALID_FD;
    temp_fd = INVALID_FD;
#ifdef _WIN32
    if (!temp_filename.empty()) {
      _unlink(temp_filename.c_str());
      temp_filename.clear();
    }
#endif
    return;
  }

  capturing = true;
}

void StderrCapture::stop_capture() {
  if (!capturing) {
    return;
  }

  // Flush stderr to ensure all output is in the temp file
  fflush(stderr);

  // Restore original stderr
  dup2(original_stderr_fd, fileno(stderr));
  close(original_stderr_fd);
  original_stderr_fd = INVALID_FD;

  // Read all captured data from the temp file
  lseek(temp_fd, 0, SEEK_SET);
  char buffer[4096];
  ssize_t bytes_read;
  while ((bytes_read = read(temp_fd, buffer, sizeof(buffer) - 1)) > 0) {
    buffer[bytes_read] = '\0';
    captured_output += buffer;
  }

  close(temp_fd);
  temp_fd = INVALID_FD;

#ifdef _WIN32
  if (!temp_filename.empty()) {
    _unlink(temp_filename.c_str());
    temp_filename.clear();
  }
#endif

  capturing = false;
}

std::string StderrCapture::get() {
  if (capturing) {
    stop_capture();
  }
  return captured_output;
}

// Parse MMG warnings from captured stderr output
std::vector<std::string> parse_mmg_warnings(const std::string &output) {
  std::vector<std::string> warnings;

  if (output.empty()) {
    return warnings;
  }

  // Split output into lines and look for warning patterns
  std::istringstream stream(output);
  std::string line;

  // Regex patterns for MMG warnings
  // Pattern 1: "## Warning: message" or " ## Warning: message"
  // Pattern 2: " ** WARNING: message"
  // Pattern 3: "MMG5_warning: message"
  std::regex warning_pattern(
      R"(^\s*(?:##\s*[Ww]arning:|[\s*]*\*\*\s*WARNING:|MMG5_warning:)\s*(.+))",
      std::regex::ECMAScript);

  while (std::getline(stream, line)) {
    std::smatch match;
    if (std::regex_search(line, match, warning_pattern)) {
      std::string warning_msg = match[1].str();
      // Trim trailing whitespace
      warning_msg.erase(
          std::find_if(warning_msg.rbegin(), warning_msg.rend(),
                       [](unsigned char ch) { return !std::isspace(ch); })
              .base(),
          warning_msg.end());
      if (!warning_msg.empty()) {
        warnings.push_back(warning_msg);
      }
    }
  }

  return warnings;
}

std::string path_to_string(const py::object &path) {
  py::object filesystem_path = py::module_::import("os").attr("fspath")(path);
  return filesystem_path.cast<std::string>();
}

py::dict prepare_levelset_options(const py::dict &options) {
  py::dict merged;
  for (auto item : options) {
    merged[item.first] = item.second;
  }
  const bool has_iso = merged.contains("iso");
  const bool has_isosurf = merged.contains("isosurf");
  if (!has_iso) {
    merged["iso"] = py::int_(has_isosurf ? 0 : 1);
  }
  if (!has_isosurf) {
    merged["isosurf"] = py::int_(0);
  }
  return merged;
}

py::dict build_remesh_result(const RemeshStats &before,
                             const RemeshStats &after, double duration_seconds,
                             int return_code,
                             const std::vector<std::string> &warnings) {
  // Build dictionary with remeshing statistics.
  // Note: duration_seconds measures only the MMG library call itself,
  // excluding stats collection (before/after) and option setup overhead.
  // This provides the most accurate measure of actual remeshing time.
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
  // Convert warnings vector to Python tuple
  py::tuple warnings_tuple(warnings.size());
  for (size_t i = 0; i < warnings.size(); ++i) {
    warnings_tuple[i] = warnings[i];
  }
  result["warnings"] = warnings_tuple;
  result["return_code"] = return_code;
  return result;
}
