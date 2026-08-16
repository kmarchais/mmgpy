#include "mmg_common.hpp"

#include "mmg/mmg2d/libmmg2d.h"
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

using SetIntegerParameter = int (*)(MMG5_pMesh, MMG5_pSol, int, MMG5_int);
using SetLocalParameter = int (*)(MMG5_pMesh, MMG5_pSol, int, MMG5_int, double,
                                  double, double);
using SetMultiMaterial = int (*)(MMG5_pMesh, MMG5_pSol, MMG5_int, int, MMG5_int,
                                 MMG5_int);
using SetLsBaseReference = int (*)(MMG5_pMesh, MMG5_pSol, MMG5_int);

struct ParameterApi {
  const char *name;
  int local_parameter_count;
  int material_count;
  int base_reference_count;
  int secondary_entity_type;
  const char *secondary_entity;
  const char *secondary_entities;
  SetIntegerParameter set_integer;
  SetLocalParameter set_local;
  SetMultiMaterial set_material;
  SetLsBaseReference set_base_reference;
};

const ParameterApi &parameter_api(MmgParameterFileKind kind) {
  static const ParameterApi mmg2d{
      "MMG2D",
      MMG2D_IPARAM_numberOfLocalParam,
      MMG2D_IPARAM_numberOfMat,
      MMG2D_IPARAM_numberOfLSBaseReferences,
      MMG5_Edg,
      "edge",
      "edges",
      &MMG2D_Set_iparameter,
      &MMG2D_Set_localParameter,
      &MMG2D_Set_multiMat,
      &MMG2D_Set_lsBaseReference,
  };
  static const ParameterApi mmg3d{
      "MMG3D",
      MMG3D_IPARAM_numberOfLocalParam,
      MMG3D_IPARAM_numberOfMat,
      MMG3D_IPARAM_numberOfLSBaseReferences,
      MMG5_Tetrahedron,
      "tetrahedron",
      "tetrahedra",
      &MMG3D_Set_iparameter,
      &MMG3D_Set_localParameter,
      &MMG3D_Set_multiMat,
      &MMG3D_Set_lsBaseReference,
  };
  static const ParameterApi mmgs{
      "MMGS",
      MMGS_IPARAM_numberOfLocalParam,
      MMGS_IPARAM_numberOfMat,
      MMGS_IPARAM_numberOfLSBaseReferences,
      MMG5_Noentity,
      nullptr,
      nullptr,
      &MMGS_Set_iparameter,
      &MMGS_Set_localParameter,
      &MMGS_Set_multiMat,
      &MMGS_Set_lsBaseReference,
  };

  switch (kind) {
  case MmgParameterFileKind::Mmg2D:
    return mmg2d;
  case MmgParameterFileKind::Mmg3D:
    return mmg3d;
  case MmgParameterFileKind::MmgS:
    return mmgs;
  }
  throw std::logic_error("Unknown MMG parameter-file kind");
}

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

void require_parameter_success(const ParameterApi &api, int success,
                               const std::string &filename,
                               const std::string &operation) {
  if (!success) {
    throw std::runtime_error("Invalid " + std::string(api.name) +
                             " parameter file '" + filename + "': failed to " +
                             operation);
  }
}

int parameter_entity_type(const ParameterApi &api, const std::string &entity,
                          const std::string &filename) {
  if (entity == "triangle" || entity == "triangles") {
    return MMG5_Triangle;
  }
  if (api.secondary_entity != nullptr &&
      (entity == api.secondary_entity || entity == api.secondary_entities)) {
    return api.secondary_entity_type;
  }
  throw std::runtime_error("Invalid " + std::string(api.name) +
                           " parameter file '" + filename +
                           "': unsupported entity type '" + entity + "'");
}

void parse_local_parameters(std::istream &input, MMG5_pMesh mesh, MMG5_pSol met,
                            const std::string &filename,
                            const ParameterApi &api) {
  int count = read_parameter_value<int>(input, filename, "parameter count");
  require_parameter_success(
      api, api.set_integer(mesh, met, api.local_parameter_count, count),
      filename, "set the local-parameter count");
  for (int i = 0; i < count; ++i) {
    MMG5_int ref =
        read_parameter_value<MMG5_int>(input, filename, "entity reference");
    std::string entity = lowercase(
        read_parameter_value<std::string>(input, filename, "entity type"));
    double hmin = read_parameter_value<double>(input, filename, "minimum size");
    double hmax = read_parameter_value<double>(input, filename, "maximum size");
    double hausd =
        read_parameter_value<double>(input, filename, "Hausdorff distance");
    int entity_type = parameter_entity_type(api, entity, filename);
    require_parameter_success(
        api, api.set_local(mesh, met, entity_type, ref, hmin, hmax, hausd),
        filename, "set local parameter for reference " + std::to_string(ref));
  }
}

void parse_base_references(std::istream &input, MMG5_pMesh mesh, MMG5_pSol met,
                           const std::string &filename,
                           const ParameterApi &api) {
  int count =
      read_parameter_value<int>(input, filename, "LS base-reference count");
  require_parameter_success(
      api, api.set_integer(mesh, met, api.base_reference_count, count),
      filename, "set the LS base-reference count");
  for (int i = 0; i < count; ++i) {
    MMG5_int ref =
        read_parameter_value<MMG5_int>(input, filename, "LS base reference");
    require_parameter_success(api, api.set_base_reference(mesh, met, ref),
                              filename,
                              "set LS base reference " + std::to_string(ref));
  }
}

void parse_materials(std::istream &input, MMG5_pMesh mesh, MMG5_pSol met,
                     const std::string &filename, const ParameterApi &api) {
  int count = read_parameter_value<int>(input, filename, "LS reference count");
  require_parameter_success(
      api, api.set_integer(mesh, met, api.material_count, count), filename,
      "set the LS reference count");
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
        std::size_t parsed = 0;
        ref_minus = static_cast<MMG5_int>(std::stoll(split_token, &parsed, 10));
        if (parsed != split_token.size()) {
          throw std::invalid_argument("trailing characters");
        }
      } catch (const std::exception &) {
        throw std::runtime_error(
            "Invalid " + std::string(api.name) + " parameter file '" +
            filename + "': expected 'nosplit' or an inside reference");
      }
      ref_plus =
          read_parameter_value<MMG5_int>(input, filename, "outside reference");
      split = MMG5_MMAT_Split;
    }
    require_parameter_success(
        api, api.set_material(mesh, met, ref, split, ref_minus, ref_plus),
        filename, "set LS reference " + std::to_string(ref));
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

void parse_parameter_file(MMG5_pMesh mesh, MMG5_pSol met,
                          const std::string &filename,
                          MmgParameterFileKind kind) {
  validate_parameter_file(filename);
  const ParameterApi &api = parameter_api(kind);
  std::ifstream input(filename);
  std::string section;

  while (input >> section) {
    section = lowercase(section);
    if (section == "parameters") {
      parse_local_parameters(input, mesh, met, filename, api);
    } else if (section == "lsbasereferences") {
      parse_base_references(input, mesh, met, filename, api);
    } else if (section == "lsreferences") {
      parse_materials(input, mesh, met, filename, api);
    } else {
      throw std::runtime_error("Invalid " + std::string(api.name) +
                               " parameter file '" + filename +
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
