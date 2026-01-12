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
#define pipe(fds) _pipe(fds, 65536, _O_BINARY)
#define read _read
#define write _write
#define close _close
#define dup _dup
#define dup2 _dup2
#define fileno _fileno
#else
#include <fcntl.h>
#include <unistd.h>
#endif

// StderrCapture implementation
StderrCapture::StderrCapture()
    : original_stderr_fd(INVALID_FD), pipe_read_fd(INVALID_FD),
      pipe_write_fd(INVALID_FD), capturing(false) {
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
    return; // Silently fail - don't break remeshing if capture fails
  }

  // Create a pipe
  int pipe_fds[2];
  if (pipe(pipe_fds) != 0) {
    close(original_stderr_fd);
    original_stderr_fd = INVALID_FD;
    return;
  }

  pipe_read_fd = pipe_fds[0];
  pipe_write_fd = pipe_fds[1];

// Set the read end to non-blocking to avoid deadlocks
#ifndef _WIN32
  int flags = fcntl(pipe_read_fd, F_GETFL, 0);
  fcntl(pipe_read_fd, F_SETFL, flags | O_NONBLOCK);
#endif

  // Redirect stderr to the write end of the pipe
  if (dup2(pipe_write_fd, fileno(stderr)) == INVALID_FD) {
    close(original_stderr_fd);
    close(pipe_read_fd);
    close(pipe_write_fd);
    original_stderr_fd = INVALID_FD;
    pipe_read_fd = INVALID_FD;
    pipe_write_fd = INVALID_FD;
    return;
  }

  capturing = true;
}

void StderrCapture::stop_capture() {
  if (!capturing) {
    return;
  }

  // Flush stderr to ensure all output is in the pipe
  fflush(stderr);

  // Restore original stderr
  dup2(original_stderr_fd, fileno(stderr));
  close(original_stderr_fd);
  original_stderr_fd = INVALID_FD;

  // Close the write end so read knows when to stop
  close(pipe_write_fd);
  pipe_write_fd = INVALID_FD;

  // Read all available data from the pipe
  char buffer[4096];
  ssize_t bytes_read;

#ifdef _WIN32
  // On Windows, read in a loop until no more data
  while ((bytes_read = read(pipe_read_fd, buffer, sizeof(buffer) - 1)) > 0) {
    buffer[bytes_read] = '\0';
    captured_output += buffer;
  }
#else
  // On POSIX with non-blocking, read until EAGAIN or EOF
  while ((bytes_read = read(pipe_read_fd, buffer, sizeof(buffer) - 1)) > 0) {
    buffer[bytes_read] = '\0';
    captured_output += buffer;
  }
#endif

  close(pipe_read_fd);
  pipe_read_fd = INVALID_FD;

  capturing = false;
}

std::string StderrCapture::get() const {
  if (capturing) {
    // Still capturing - need to stop first to get complete output
    // But this is const, so we can't modify. Return what we have.
    return captured_output;
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
