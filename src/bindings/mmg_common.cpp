#include "mmg_common.hpp"

#include <algorithm>
#include <cstdio>
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
