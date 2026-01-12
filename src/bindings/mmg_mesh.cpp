#include "mmg_mesh.hpp"
#include "mmg_common.hpp"
#include <chrono>
#include <set>
#include <stdexcept>

namespace {
// Helper to ensure array is C-contiguous for safe memory access
// This is critical because we use raw pointer arithmetic to access elements.
// Non-contiguous arrays (e.g., Fortran-order or sliced views) will have
// incorrect data access patterns if we assume C-contiguous layout.
template <typename T>
void ensure_c_contiguous(const py::array_t<T> &arr, const std::string &name) {
  // Check if array is C-contiguous by examining its flags
  // PyArray_CHKFLAGS checks the NPY_ARRAY_C_CONTIGUOUS flag
  py::object flags = arr.attr("flags");
  py::object c_contiguous_obj = flags.attr("c_contiguous");
  bool c_contiguous = c_contiguous_obj.template cast<bool>();
  if (!c_contiguous) {
    throw std::runtime_error(
        name +
        " array must be C-contiguous. Use numpy.ascontiguousarray() to fix.");
  }
}

// Collect mesh statistics for 3D tetrahedral mesh
RemeshStats collect_mesh_stats_3d(MMG5_pMesh mesh, MMG5_pSol met) {
  RemeshStats stats;
  stats.vertices = mesh->np;
  stats.elements = mesh->ne; // tetrahedra
  stats.triangles = mesh->nt;
  stats.edges = mesh->na;

  stats.quality_min = 1.0;
  double quality_sum = 0.0;
  if (stats.elements > 0) {
    for (MMG5_int i = 1; i <= stats.elements; i++) {
      double q = MMG3D_Get_tetrahedronQuality(mesh, met, i);
      quality_sum += q;
      if (q < stats.quality_min)
        stats.quality_min = q;
    }
    stats.quality_mean = quality_sum / stats.elements;
  } else {
    stats.quality_mean = 0.0;
  }

  return stats;
}
} // namespace

MmgMesh::MmgMesh() {
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

MmgMesh::MmgMesh(const py::array_t<double> &vertices,
                 const py::array_t<int> &elements)
    : MmgMesh() {
  set_vertices_and_elements(vertices, elements);
}

MmgMesh::MmgMesh(
    const std::variant<std::string, std::filesystem::path> &filename) {
  mesh = nullptr;
  met = nullptr;
  disp = nullptr;
  ls = nullptr;

  if (!MMG3D_Init_mesh(MMG5_ARG_start, MMG5_ARG_ppMesh, &mesh, MMG5_ARG_ppMet,
                       &met, MMG5_ARG_ppDisp, &disp, MMG5_ARG_ppLs, &ls,
                       MMG5_ARG_end)) {
    throw std::runtime_error("Failed to initialize MMG3D mesh");
  }

  std::string fname = std::visit(
      [](auto &&arg) -> std::string {
        using T = std::decay_t<decltype(arg)>;
        if constexpr (std::is_same_v<T, std::string>) {
          return arg;
        } else if constexpr (std::is_same_v<T, std::filesystem::path>) {
          return arg.string();
        }
      },
      filename);

  std::string ext = get_file_extension(fname);
  int ret;

  if (ext == ".vtk") {
    ret = MMG3D_loadVtkMesh(mesh, met, met, fname.c_str());
  } else if (ext == ".vtu") {
    ret = MMG3D_loadVtuMesh(mesh, met, met, fname.c_str());
  } else {
    ret = MMG3D_loadMesh(mesh, fname.c_str());
  }

  if (!ret) {
    cleanup();
    throw std::runtime_error("Failed to load mesh from file: " + fname);
  }
}

MmgMesh::~MmgMesh() { cleanup(); }

void MmgMesh::set_vertices_and_elements(const py::array_t<double> &vertices,
                                        const py::array_t<int> &elements) {
  py::buffer_info vert_buf = vertices.request();
  py::buffer_info elem_buf = elements.request();

  if (vert_buf.ndim != 2 || vert_buf.shape[1] != 3) {
    throw std::runtime_error("Vertices must be an Nx3 array");
  }
  if (elem_buf.ndim != 2 || elem_buf.shape[1] != 4) {
    throw std::runtime_error(
        "Elements must be an Nx4 array for tetrahedral mesh");
  }

  const double *vert_ptr = static_cast<double *>(vert_buf.ptr);
  const int *elem_ptr = static_cast<int *>(elem_buf.ptr);

  MMG5_int nvert = vert_buf.shape[0];
  MMG5_int nelem = elem_buf.shape[0];

  if (!MMG3D_Set_meshSize(mesh, nvert, nelem, 0, 0, 0, 0)) {
    throw std::runtime_error("Failed to set mesh size");
  }

  for (MMG5_int i = 0; i < nvert; i++) {
    if (!MMG3D_Set_vertex(mesh, vert_ptr[i * 3], vert_ptr[i * 3 + 1],
                          vert_ptr[i * 3 + 2], 0, i + 1)) {
      throw std::runtime_error("Failed to set vertex");
    }
  }

  for (MMG5_int i = 0; i < nelem; i++) {
    if (!MMG3D_Set_tetrahedron(mesh, elem_ptr[i * 4] + 1,
                               elem_ptr[i * 4 + 1] + 1, elem_ptr[i * 4 + 2] + 1,
                               elem_ptr[i * 4 + 3] + 1, 0, i + 1)) {
      throw std::runtime_error("Failed to set tetrahedron");
    }
  }
}

py::array_t<double> MmgMesh::get_vertices() const {
  MMG5_int np = mesh->np;
  py::array_t<double> vertices({static_cast<py::ssize_t>(np), py::ssize_t{3}});
  auto buf = vertices.request();
  double *ptr = static_cast<double *>(buf.ptr);

  mesh->npi = mesh->np;

  for (MMG5_int i = 0; i < np; i++) {
    double x, y, z;
    MMG5_int ref;
    int corner, required;

    if (!MMG3D_Get_vertex(mesh, &x, &y, &z, &ref, &corner, &required)) {
      throw std::runtime_error("Failed to get vertex at index " +
                               std::to_string(i));
    }

    ptr[i * 3] = x;
    ptr[i * 3 + 1] = y;
    ptr[i * 3 + 2] = z;
  }
  return vertices;
}

py::array_t<int> MmgMesh::get_elements() const {
  MMG5_int ne = mesh->ne;
  py::array_t<int> elements({static_cast<py::ssize_t>(ne), py::ssize_t{4}});
  auto buf = elements.request();
  int *ptr = static_cast<int *>(buf.ptr);

  mesh->nti = mesh->nt;

  for (MMG5_int i = 0; i < ne; i++) {
    int v1, v2, v3, v4;
    MMG5_int ref;
    int required;

    if (!MMG3D_Get_tetrahedron(mesh, &v1, &v2, &v3, &v4, &ref, &required)) {
      throw std::runtime_error("Failed to get tetrahedron at index " +
                               std::to_string(i));
    }

    ptr[i * 4] = v1 - 1;
    ptr[i * 4 + 1] = v2 - 1;
    ptr[i * 4 + 2] = v3 - 1;
    ptr[i * 4 + 3] = v4 - 1;
  }
  return elements;
}

void MmgMesh::set_field(const std::string &field_name,
                        const py::array_t<double> &values) {
  auto field = get_solution_field(field_name);
  py::buffer_info buf = values.request();

  if (buf.ndim != 2 || buf.shape[1] != field.components) {
    throw std::runtime_error(field_name + " must be an Nx" +
                             std::to_string(field.components) + " array");
  }

  MMG5_int np = mesh->np;
  if (buf.shape[0] != np) {
    throw std::runtime_error(field_name +
                             " array size must match number of vertices");
  }

  MMG5_pSol *sol_ptr = const_cast<MMG5_pSol *>(field.sol_ptr);

  if (!MMG3D_Set_solSize(mesh, *sol_ptr, MMG5_Vertex, np,
                         get_mmg_type(field.type))) {
    throw std::runtime_error("Failed to set " + field_name + " solution size");
  }

  const double *ptr = static_cast<double *>(buf.ptr);
  bool success = false;
  switch (field.type) {
  case SolutionType::SCALAR:
    success = MMG3D_Set_scalarSols(*sol_ptr, const_cast<double *>(ptr));
    break;
  case SolutionType::VECTOR:
    success = MMG3D_Set_vectorSols(*sol_ptr, const_cast<double *>(ptr));
    break;
  case SolutionType::TENSOR:
    success = MMG3D_Set_tensorSols(*sol_ptr, const_cast<double *>(ptr));
    break;
  }

  if (!success) {
    throw std::runtime_error("Failed to set " + field_name + " values");
  }
}

py::array_t<double> MmgMesh::get_field(const std::string &field_name) const {
  auto field = get_solution_field(field_name);
  MMG5_int np = mesh->np;

  py::array_t<double> values({static_cast<py::ssize_t>(np),
                              static_cast<py::ssize_t>(field.components)});
  auto buf = values.request();
  double *ptr = static_cast<double *>(buf.ptr);

  bool success = false;
  switch (field.type) {
  case SolutionType::SCALAR:
    success = MMG3D_Get_scalarSols(*field.sol_ptr, ptr);
    break;
  case SolutionType::VECTOR:
    success = MMG3D_Get_vectorSols(*field.sol_ptr, ptr);
    break;
  case SolutionType::TENSOR:
    success = MMG3D_Get_tensorSols(*field.sol_ptr, ptr);
    break;
  }

  if (!success) {
    throw std::runtime_error("Failed to get " + field_name + " values");
  }

  return values;
}

py::array_t<double> MmgMesh::getitem(const std::string &key) const {
  return get_field(key);
}

void MmgMesh::setitem(const std::string &key,
                      const py::array_t<double> &value) {
  set_field(key, value);
}

void MmgMesh::save(
    const std::variant<std::string, std::filesystem::path> &filename) const {
  std::string fname = std::visit(
      [](auto &&arg) -> std::string {
        using T = std::decay_t<decltype(arg)>;
        if constexpr (std::is_same_v<T, std::string>) {
          return arg;
        } else if constexpr (std::is_same_v<T, std::filesystem::path>) {
          return arg.string();
        }
      },
      filename);

  std::string ext = get_file_extension(fname);
  int ret;

  if (ext == ".vtk") {
    ret = MMG3D_saveVtkMesh(mesh, met, fname.c_str());
  } else if (ext == ".vtu") {
    ret = MMG3D_saveVtuMesh(mesh, met, fname.c_str());
  } else {
    ret = MMG3D_saveMesh(mesh, fname.c_str());
  }

  if (!ret) {
    throw std::runtime_error("Failed to save mesh to file: " + fname);
  }
}

MmgMesh::SolutionField
MmgMesh::get_solution_field(const std::string &field_name) const {
  if (field_name == "metric") {
    return {&met, SolutionType::SCALAR, 1};
  } else if (field_name == "displacement") {
    return {&disp, SolutionType::VECTOR, 3};
  } else if (field_name == "levelset") {
    return {&ls, SolutionType::SCALAR, 1};
  } else if (field_name == "tensor") {
    return {&met, SolutionType::TENSOR, 6};
  }
  throw std::runtime_error("Unknown field: " + field_name);
}

int MmgMesh::get_mmg_type(SolutionType type) const {
  switch (type) {
  case SolutionType::SCALAR:
    return MMG5_Scalar;
  case SolutionType::VECTOR:
    return MMG5_Vector;
  case SolutionType::TENSOR:
    return MMG5_Tensor;
  default:
    throw std::runtime_error("Unknown solution type");
  }
}

std::string MmgMesh::get_file_extension(const std::string &filename) {
  size_t pos = filename.find_last_of('.');
  if (pos != std::string::npos) {
    return filename.substr(pos);
  }
  return "";
}

void MmgMesh::cleanup() {
  if (mesh || met || disp || ls) {
    MMG3D_Free_all(MMG5_ARG_start, MMG5_ARG_ppMesh, &mesh, MMG5_ARG_ppMet, &met,
                   MMG5_ARG_ppDisp, &disp, MMG5_ARG_ppLs, &ls, MMG5_ARG_end);
    // Null pointers to prevent double-free if cleanup() or destructor is called
    // again
    mesh = nullptr;
    met = nullptr;
    disp = nullptr;
    ls = nullptr;
  }
}

// Low-level mesh construction API (Phase 1 of Issue #50)

void MmgMesh::set_mesh_size(MMG5_int vertices, MMG5_int tetrahedra,
                            MMG5_int prisms, MMG5_int triangles,
                            MMG5_int quadrilaterals, MMG5_int edges) {
  if (!MMG3D_Set_meshSize(mesh, vertices, tetrahedra, prisms, triangles,
                          quadrilaterals, edges)) {
    throw std::runtime_error("Failed to set mesh size");
  }
}

py::tuple MmgMesh::get_mesh_size() const {
  MMG5_int np, ne, nprism, nt, nquad, na;
  if (!MMG3D_Get_meshSize(mesh, &np, &ne, &nprism, &nt, &nquad, &na)) {
    throw std::runtime_error("Failed to get mesh size");
  }
  return py::make_tuple(np, ne, nprism, nt, nquad, na);
}

void MmgMesh::set_vertices(const py::array_t<double> &vertices,
                           const std::optional<py::array_t<MMG5_int>> &refs) {
  ensure_c_contiguous(vertices, "Vertices");
  py::buffer_info vert_buf = vertices.request();

  if (vert_buf.ndim != 2 || vert_buf.shape[1] != 3) {
    throw std::runtime_error("Vertices must be an Nx3 array");
  }

  const double *vert_ptr = static_cast<double *>(vert_buf.ptr);
  MMG5_int nvert = vert_buf.shape[0];

  // Validate refs array if provided
  const MMG5_int *refs_ptr = nullptr;
  if (refs.has_value()) {
    ensure_c_contiguous(*refs, "References");
    py::buffer_info refs_buf = refs->request();
    if (refs_buf.ndim != 1 || refs_buf.shape[0] != nvert) {
      throw std::runtime_error(
          "References array must be 1D with same length as vertices");
    }
    refs_ptr = static_cast<MMG5_int *>(refs_buf.ptr);
  }

  for (MMG5_int i = 0; i < nvert; i++) {
    MMG5_int ref = refs_ptr ? refs_ptr[i] : 0;
    if (!MMG3D_Set_vertex(mesh, vert_ptr[i * 3], vert_ptr[i * 3 + 1],
                          vert_ptr[i * 3 + 2], ref, i + 1)) {
      throw std::runtime_error("Failed to set vertex at index " +
                               std::to_string(i));
    }
  }
}

void MmgMesh::set_tetrahedra(const py::array_t<int> &tetrahedra,
                             const std::optional<py::array_t<MMG5_int>> &refs) {
  ensure_c_contiguous(tetrahedra, "Tetrahedra");
  py::buffer_info elem_buf = tetrahedra.request();

  if (elem_buf.ndim != 2 || elem_buf.shape[1] != 4) {
    throw std::runtime_error("Tetrahedra must be an Nx4 array");
  }

  const int *elem_ptr = static_cast<int *>(elem_buf.ptr);
  MMG5_int nelem = elem_buf.shape[0];

  // Validate refs array if provided
  const MMG5_int *refs_ptr = nullptr;
  if (refs.has_value()) {
    ensure_c_contiguous(*refs, "References");
    py::buffer_info refs_buf = refs->request();
    if (refs_buf.ndim != 1 || refs_buf.shape[0] != nelem) {
      throw std::runtime_error(
          "References array must be 1D with same length as tetrahedra");
    }
    refs_ptr = static_cast<MMG5_int *>(refs_buf.ptr);
  }

  for (MMG5_int i = 0; i < nelem; i++) {
    MMG5_int ref = refs_ptr ? refs_ptr[i] : 0;
    // Convert from 0-based Python indexing to 1-based MMG indexing
    if (!MMG3D_Set_tetrahedron(mesh, elem_ptr[i * 4] + 1,
                               elem_ptr[i * 4 + 1] + 1, elem_ptr[i * 4 + 2] + 1,
                               elem_ptr[i * 4 + 3] + 1, ref, i + 1)) {
      throw std::runtime_error("Failed to set tetrahedron at index " +
                               std::to_string(i));
    }
  }
}

void MmgMesh::set_triangles(const py::array_t<int> &triangles,
                            const std::optional<py::array_t<MMG5_int>> &refs) {
  ensure_c_contiguous(triangles, "Triangles");
  py::buffer_info tri_buf = triangles.request();

  if (tri_buf.ndim != 2 || tri_buf.shape[1] != 3) {
    throw std::runtime_error("Triangles must be an Nx3 array");
  }

  const int *tri_ptr = static_cast<int *>(tri_buf.ptr);
  MMG5_int ntri = tri_buf.shape[0];

  // Validate refs array if provided
  const MMG5_int *refs_ptr = nullptr;
  if (refs.has_value()) {
    ensure_c_contiguous(*refs, "References");
    py::buffer_info refs_buf = refs->request();
    if (refs_buf.ndim != 1 || refs_buf.shape[0] != ntri) {
      throw std::runtime_error(
          "References array must be 1D with same length as triangles");
    }
    refs_ptr = static_cast<MMG5_int *>(refs_buf.ptr);
  }

  for (MMG5_int i = 0; i < ntri; i++) {
    MMG5_int ref = refs_ptr ? refs_ptr[i] : 0;
    // Convert from 0-based Python indexing to 1-based MMG indexing
    if (!MMG3D_Set_triangle(mesh, tri_ptr[i * 3] + 1, tri_ptr[i * 3 + 1] + 1,
                            tri_ptr[i * 3 + 2] + 1, ref, i + 1)) {
      throw std::runtime_error("Failed to set triangle at index " +
                               std::to_string(i));
    }
  }
}

void MmgMesh::set_edges(const py::array_t<int> &edges,
                        const std::optional<py::array_t<MMG5_int>> &refs) {
  ensure_c_contiguous(edges, "Edges");
  py::buffer_info edge_buf = edges.request();

  if (edge_buf.ndim != 2 || edge_buf.shape[1] != 2) {
    throw std::runtime_error("Edges must be an Nx2 array");
  }

  const int *edge_ptr = static_cast<int *>(edge_buf.ptr);
  MMG5_int nedge = edge_buf.shape[0];

  // Validate refs array if provided
  const MMG5_int *refs_ptr = nullptr;
  if (refs.has_value()) {
    ensure_c_contiguous(*refs, "References");
    py::buffer_info refs_buf = refs->request();
    if (refs_buf.ndim != 1 || refs_buf.shape[0] != nedge) {
      throw std::runtime_error(
          "References array must be 1D with same length as edges");
    }
    refs_ptr = static_cast<MMG5_int *>(refs_buf.ptr);
  }

  for (MMG5_int i = 0; i < nedge; i++) {
    MMG5_int ref = refs_ptr ? refs_ptr[i] : 0;
    // Convert from 0-based Python indexing to 1-based MMG indexing
    if (!MMG3D_Set_edge(mesh, edge_ptr[i * 2] + 1, edge_ptr[i * 2 + 1] + 1, ref,
                        i + 1)) {
      throw std::runtime_error("Failed to set edge at index " +
                               std::to_string(i));
    }
  }
}

py::tuple MmgMesh::get_vertices_with_refs() const {
  MMG5_int np = mesh->np;
  py::array_t<double> vertices({static_cast<py::ssize_t>(np), py::ssize_t{3}});
  py::array_t<MMG5_int> refs(static_cast<py::ssize_t>(np));

  auto vert_buf = vertices.request();
  auto refs_buf = refs.request();
  double *vert_ptr = static_cast<double *>(vert_buf.ptr);
  MMG5_int *refs_ptr = static_cast<MMG5_int *>(refs_buf.ptr);

  mesh->npi = mesh->np;

  for (MMG5_int i = 0; i < np; i++) {
    double x, y, z;
    MMG5_int ref;
    int corner, required;

    if (!MMG3D_Get_vertex(mesh, &x, &y, &z, &ref, &corner, &required)) {
      throw std::runtime_error("Failed to get vertex at index " +
                               std::to_string(i));
    }

    vert_ptr[i * 3] = x;
    vert_ptr[i * 3 + 1] = y;
    vert_ptr[i * 3 + 2] = z;
    refs_ptr[i] = ref;
  }
  return py::make_tuple(vertices, refs);
}

py::array_t<int> MmgMesh::get_triangles() const {
  MMG5_int nt = mesh->nt;
  py::array_t<int> triangles({static_cast<py::ssize_t>(nt), py::ssize_t{3}});
  auto buf = triangles.request();
  int *ptr = static_cast<int *>(buf.ptr);

  mesh->nti = mesh->nt;

  for (MMG5_int i = 0; i < nt; i++) {
    int v1, v2, v3;
    MMG5_int ref;
    int required;

    if (!MMG3D_Get_triangle(mesh, &v1, &v2, &v3, &ref, &required)) {
      throw std::runtime_error("Failed to get triangle at index " +
                               std::to_string(i));
    }

    // Convert from 1-based MMG indexing to 0-based Python indexing
    ptr[i * 3] = v1 - 1;
    ptr[i * 3 + 1] = v2 - 1;
    ptr[i * 3 + 2] = v3 - 1;
  }
  return triangles;
}

py::tuple MmgMesh::get_triangles_with_refs() const {
  MMG5_int nt = mesh->nt;
  py::array_t<int> triangles({static_cast<py::ssize_t>(nt), py::ssize_t{3}});
  py::array_t<MMG5_int> refs(static_cast<py::ssize_t>(nt));

  auto tri_buf = triangles.request();
  auto refs_buf = refs.request();
  int *tri_ptr = static_cast<int *>(tri_buf.ptr);
  MMG5_int *refs_ptr = static_cast<MMG5_int *>(refs_buf.ptr);

  mesh->nti = mesh->nt;

  for (MMG5_int i = 0; i < nt; i++) {
    int v1, v2, v3;
    MMG5_int ref;
    int required;

    if (!MMG3D_Get_triangle(mesh, &v1, &v2, &v3, &ref, &required)) {
      throw std::runtime_error("Failed to get triangle at index " +
                               std::to_string(i));
    }

    // Convert from 1-based MMG indexing to 0-based Python indexing
    tri_ptr[i * 3] = v1 - 1;
    tri_ptr[i * 3 + 1] = v2 - 1;
    tri_ptr[i * 3 + 2] = v3 - 1;
    refs_ptr[i] = ref;
  }
  return py::make_tuple(triangles, refs);
}

py::tuple MmgMesh::get_elements_with_refs() const {
  MMG5_int ne = mesh->ne;
  py::array_t<int> elements({static_cast<py::ssize_t>(ne), py::ssize_t{4}});
  py::array_t<MMG5_int> refs(static_cast<py::ssize_t>(ne));

  auto elem_buf = elements.request();
  auto refs_buf = refs.request();
  int *elem_ptr = static_cast<int *>(elem_buf.ptr);
  MMG5_int *refs_ptr = static_cast<MMG5_int *>(refs_buf.ptr);

  mesh->nei = mesh->ne;

  for (MMG5_int i = 0; i < ne; i++) {
    int v1, v2, v3, v4;
    MMG5_int ref;
    int required;

    if (!MMG3D_Get_tetrahedron(mesh, &v1, &v2, &v3, &v4, &ref, &required)) {
      throw std::runtime_error("Failed to get tetrahedron at index " +
                               std::to_string(i));
    }

    // Convert from 1-based MMG indexing to 0-based Python indexing
    elem_ptr[i * 4] = v1 - 1;
    elem_ptr[i * 4 + 1] = v2 - 1;
    elem_ptr[i * 4 + 2] = v3 - 1;
    elem_ptr[i * 4 + 3] = v4 - 1;
    refs_ptr[i] = ref;
  }
  return py::make_tuple(elements, refs);
}

py::array_t<int> MmgMesh::get_edges() const {
  MMG5_int na = mesh->na;
  py::array_t<int> edges({static_cast<py::ssize_t>(na), py::ssize_t{2}});
  auto buf = edges.request();
  int *ptr = static_cast<int *>(buf.ptr);

  mesh->nai = mesh->na;

  for (MMG5_int i = 0; i < na; i++) {
    MMG5_int v1, v2;
    MMG5_int ref;
    int corner, required;

    if (!MMG3D_Get_edge(mesh, &v1, &v2, &ref, &corner, &required)) {
      throw std::runtime_error("Failed to get edge at index " +
                               std::to_string(i));
    }

    // Convert from 1-based MMG indexing to 0-based Python indexing
    ptr[i * 2] = static_cast<int>(v1 - 1);
    ptr[i * 2 + 1] = static_cast<int>(v2 - 1);
  }
  return edges;
}

py::tuple MmgMesh::get_edges_with_refs() const {
  MMG5_int na = mesh->na;
  py::array_t<int> edges({static_cast<py::ssize_t>(na), py::ssize_t{2}});
  py::array_t<MMG5_int> refs(static_cast<py::ssize_t>(na));

  auto edge_buf = edges.request();
  auto refs_buf = refs.request();
  int *edge_ptr = static_cast<int *>(edge_buf.ptr);
  MMG5_int *refs_ptr = static_cast<MMG5_int *>(refs_buf.ptr);

  mesh->nai = mesh->na;

  for (MMG5_int i = 0; i < na; i++) {
    MMG5_int v1, v2;
    MMG5_int ref;
    int corner, required;

    if (!MMG3D_Get_edge(mesh, &v1, &v2, &ref, &corner, &required)) {
      throw std::runtime_error("Failed to get edge at index " +
                               std::to_string(i));
    }

    // Convert from 1-based MMG indexing to 0-based Python indexing
    edge_ptr[i * 2] = static_cast<int>(v1 - 1);
    edge_ptr[i * 2 + 1] = static_cast<int>(v2 - 1);
    refs_ptr[i] = ref;
  }
  return py::make_tuple(edges, refs);
}

// Phase 2: Single element operations

void MmgMesh::set_vertex(double x, double y, double z, MMG5_int ref,
                         MMG5_int idx) {
  // idx is 0-based Python index, convert to 1-based MMG index
  if (idx < 0 || idx >= mesh->npmax) {
    throw std::runtime_error("Vertex index out of range: " +
                             std::to_string(idx));
  }
  if (!MMG3D_Set_vertex(mesh, x, y, z, ref, idx + 1)) {
    throw std::runtime_error("Failed to set vertex at index " +
                             std::to_string(idx));
  }
}

void MmgMesh::set_tetrahedron(int v0, int v1, int v2, int v3, MMG5_int ref,
                              MMG5_int idx) {
  // Convert from 0-based Python indexing to 1-based MMG indexing
  if (idx < 0 || idx >= mesh->nemax) {
    throw std::runtime_error("Tetrahedron index out of range: " +
                             std::to_string(idx));
  }
  if (!MMG3D_Set_tetrahedron(mesh, v0 + 1, v1 + 1, v2 + 1, v3 + 1, ref,
                             idx + 1)) {
    throw std::runtime_error("Failed to set tetrahedron at index " +
                             std::to_string(idx));
  }
}

void MmgMesh::set_triangle(int v0, int v1, int v2, MMG5_int ref, MMG5_int idx) {
  // Convert from 0-based Python indexing to 1-based MMG indexing
  if (idx < 0 || idx >= mesh->ntmax) {
    throw std::runtime_error("Triangle index out of range: " +
                             std::to_string(idx));
  }
  if (!MMG3D_Set_triangle(mesh, v0 + 1, v1 + 1, v2 + 1, ref, idx + 1)) {
    throw std::runtime_error("Failed to set triangle at index " +
                             std::to_string(idx));
  }
}

void MmgMesh::set_edge(int v0, int v1, MMG5_int ref, MMG5_int idx) {
  // Convert from 0-based Python indexing to 1-based MMG indexing
  if (idx < 0 || idx >= mesh->namax) {
    throw std::runtime_error("Edge index out of range: " + std::to_string(idx));
  }
  if (!MMG3D_Set_edge(mesh, v0 + 1, v1 + 1, ref, idx + 1)) {
    throw std::runtime_error("Failed to set edge at index " +
                             std::to_string(idx));
  }
}

py::tuple MmgMesh::get_vertex(MMG5_int idx) const {
  double x, y, z;
  MMG5_int ref;
  int corner, required;

  // idx is 0-based Python index, convert to 1-based MMG index
  if (!MMG3D_GetByIdx_vertex(mesh, &x, &y, &z, &ref, &corner, &required,
                             idx + 1)) {
    throw std::runtime_error("Failed to get vertex at index " +
                             std::to_string(idx));
  }

  return py::make_tuple(x, y, z, ref);
}

py::tuple MmgMesh::get_tetrahedron(MMG5_int idx) const {
  // idx is 0-based Python index, convert to 1-based MMG index
  MMG5_int mmg_idx = idx + 1;

  if (!mesh->tetra) {
    throw std::runtime_error("No tetrahedra in mesh");
  }

  if (mmg_idx < 1 || mmg_idx > mesh->ne) {
    throw std::runtime_error("Tetrahedron index out of range: " +
                             std::to_string(idx));
  }

  // Access tetrahedron data directly from mesh structure
  MMG5_pTetra pt = &mesh->tetra[mmg_idx];

  // Convert from 1-based MMG indexing to 0-based Python indexing
  return py::make_tuple(
      static_cast<int>(pt->v[0] - 1), static_cast<int>(pt->v[1] - 1),
      static_cast<int>(pt->v[2] - 1), static_cast<int>(pt->v[3] - 1), pt->ref);
}

py::tuple MmgMesh::get_triangle(MMG5_int idx) const {
  // idx is 0-based Python index, convert to 1-based MMG index
  MMG5_int mmg_idx = idx + 1;

  if (!mesh->tria) {
    throw std::runtime_error("No triangles in mesh");
  }

  if (mmg_idx < 1 || mmg_idx > mesh->nt) {
    throw std::runtime_error("Triangle index out of range: " +
                             std::to_string(idx));
  }

  // Access triangle data directly from mesh structure
  MMG5_pTria pt = &mesh->tria[mmg_idx];

  // Convert from 1-based MMG indexing to 0-based Python indexing
  return py::make_tuple(static_cast<int>(pt->v[0] - 1),
                        static_cast<int>(pt->v[1] - 1),
                        static_cast<int>(pt->v[2] - 1), pt->ref);
}

py::tuple MmgMesh::get_edge(MMG5_int idx) const {
  // idx is 0-based Python index, convert to 1-based MMG index
  MMG5_int mmg_idx = idx + 1;

  if (!mesh->edge) {
    throw std::runtime_error("No edges in mesh");
  }

  if (mmg_idx < 1 || mmg_idx > mesh->na) {
    throw std::runtime_error("Edge index out of range: " + std::to_string(idx));
  }

  // Access edge data directly from mesh structure
  MMG5_pEdge pe = &mesh->edge[mmg_idx];

  // Convert from 1-based MMG indexing to 0-based Python indexing
  return py::make_tuple(static_cast<int>(pe->a - 1),
                        static_cast<int>(pe->b - 1), pe->ref);
}

// Element attributes

void MmgMesh::set_corners(const py::array_t<int> &vertex_indices) {
  ensure_c_contiguous(vertex_indices, "Vertex indices");
  py::buffer_info buf = vertex_indices.request();

  if (buf.ndim != 1) {
    throw std::runtime_error("Vertex indices must be a 1D array");
  }

  const int *idx_ptr = static_cast<int *>(buf.ptr);
  py::ssize_t n = buf.shape[0];

  for (py::ssize_t i = 0; i < n; i++) {
    int idx = idx_ptr[i];
    if (idx < 0 || idx >= mesh->np) {
      throw std::runtime_error("Vertex index out of range: " +
                               std::to_string(idx));
    }
    if (!MMG3D_Set_corner(mesh, idx + 1)) {
      throw std::runtime_error("Failed to set corner at vertex index " +
                               std::to_string(idx));
    }
  }
}

void MmgMesh::set_required_vertices(const py::array_t<int> &vertex_indices) {
  ensure_c_contiguous(vertex_indices, "Vertex indices");
  py::buffer_info buf = vertex_indices.request();

  if (buf.ndim != 1) {
    throw std::runtime_error("Vertex indices must be a 1D array");
  }

  const int *idx_ptr = static_cast<int *>(buf.ptr);
  py::ssize_t n = buf.shape[0];

  for (py::ssize_t i = 0; i < n; i++) {
    int idx = idx_ptr[i];
    if (idx < 0 || idx >= mesh->np) {
      throw std::runtime_error("Vertex index out of range: " +
                               std::to_string(idx));
    }
    if (!MMG3D_Set_requiredVertex(mesh, idx + 1)) {
      throw std::runtime_error("Failed to set required vertex at index " +
                               std::to_string(idx));
    }
  }
}

void MmgMesh::set_ridge_edges(const py::array_t<int> &edge_indices) {
  ensure_c_contiguous(edge_indices, "Edge indices");
  py::buffer_info buf = edge_indices.request();

  if (buf.ndim != 1) {
    throw std::runtime_error("Edge indices must be a 1D array");
  }

  const int *idx_ptr = static_cast<int *>(buf.ptr);
  py::ssize_t n = buf.shape[0];

  for (py::ssize_t i = 0; i < n; i++) {
    int idx = idx_ptr[i];
    if (idx < 0 || idx >= mesh->na) {
      throw std::runtime_error("Edge index out of range: " +
                               std::to_string(idx));
    }
    if (!MMG3D_Set_ridge(mesh, idx + 1)) {
      throw std::runtime_error("Failed to set ridge at edge index " +
                               std::to_string(idx));
    }
  }
}

// Topology queries

py::array_t<int> MmgMesh::get_adjacent_elements(MMG5_int idx) const {
  MMG5_int mmg_idx = idx + 1;

  if (mmg_idx < 1 || mmg_idx > mesh->ne) {
    throw std::runtime_error("Element index out of range: " +
                             std::to_string(idx));
  }

  MMG5_int listet[4];
  if (!MMG3D_Get_adjaTet(mesh, mmg_idx, listet)) {
    throw std::runtime_error("Failed to get adjacent elements for index " +
                             std::to_string(idx));
  }

  py::array_t<int> result(py::ssize_t{4});
  auto buf = result.request();
  int *ptr = static_cast<int *>(buf.ptr);

  for (int i = 0; i < 4; i++) {
    ptr[i] = listet[i] > 0 ? static_cast<int>(listet[i] - 1) : -1;
  }

  return result;
}

py::array_t<int> MmgMesh::get_vertex_neighbors(MMG5_int idx) const {
  MMG5_int mmg_idx = idx + 1;

  if (mmg_idx < 1 || mmg_idx > mesh->np) {
    throw std::runtime_error("Vertex index out of range: " +
                             std::to_string(idx));
  }

  std::set<MMG5_int> neighbors;

  for (MMG5_int k = 1; k <= mesh->ne; k++) {
    MMG5_pTetra pt = &mesh->tetra[k];
    if (!pt->v[0]) {
      continue;
    }

    bool found = false;
    for (int i = 0; i < 4; i++) {
      if (pt->v[i] == mmg_idx) {
        found = true;
        break;
      }
    }

    if (found) {
      for (int i = 0; i < 4; i++) {
        if (pt->v[i] != mmg_idx) {
          neighbors.insert(pt->v[i]);
        }
      }
    }
  }

  py::array_t<int> result(static_cast<py::ssize_t>(neighbors.size()));
  auto buf = result.request();
  int *ptr = static_cast<int *>(buf.ptr);

  py::ssize_t j = 0;
  for (MMG5_int v : neighbors) {
    ptr[j++] = static_cast<int>(v - 1);
  }

  return result;
}

double MmgMesh::get_element_quality(MMG5_int idx) const {
  MMG5_int mmg_idx = idx + 1;

  if (mmg_idx < 1 || mmg_idx > mesh->ne) {
    throw std::runtime_error("Element index out of range: " +
                             std::to_string(idx));
  }

  return MMG3D_Get_tetrahedronQuality(mesh, met, mmg_idx);
}

py::array_t<double> MmgMesh::get_element_qualities() const {
  MMG5_int ne = mesh->ne;
  py::array_t<double> result(ne);
  auto buf = result.request();
  double *ptr = static_cast<double *>(buf.ptr);

  for (MMG5_int i = 0; i < ne; i++) {
    ptr[i] = MMG3D_Get_tetrahedronQuality(mesh, met, i + 1);
  }

  return result;
}

// Phase 3: Advanced element types (prisms and quadrilaterals)

void MmgMesh::set_prism(int v0, int v1, int v2, int v3, int v4, int v5,
                        MMG5_int ref, MMG5_int idx) {
  // Convert from 0-based Python indexing to 1-based MMG indexing
  if (idx < 0 || idx >= mesh->nprism) {
    throw std::runtime_error("Prism index out of range: " +
                             std::to_string(idx));
  }
  if (!MMG3D_Set_prism(mesh, v0 + 1, v1 + 1, v2 + 1, v3 + 1, v4 + 1, v5 + 1,
                       ref, idx + 1)) {
    throw std::runtime_error("Failed to set prism at index " +
                             std::to_string(idx));
  }
}

void MmgMesh::set_quadrilateral(int v0, int v1, int v2, int v3, MMG5_int ref,
                                MMG5_int idx) {
  // Convert from 0-based Python indexing to 1-based MMG indexing
  if (idx < 0 || idx >= mesh->nquad) {
    throw std::runtime_error("Quadrilateral index out of range: " +
                             std::to_string(idx));
  }
  if (!MMG3D_Set_quadrilateral(mesh, v0 + 1, v1 + 1, v2 + 1, v3 + 1, ref,
                               idx + 1)) {
    throw std::runtime_error("Failed to set quadrilateral at index " +
                             std::to_string(idx));
  }
}

void MmgMesh::set_prisms(const py::array_t<int> &prisms,
                         const std::optional<py::array_t<MMG5_int>> &refs) {
  ensure_c_contiguous(prisms, "Prisms");
  py::buffer_info prism_buf = prisms.request();

  if (prism_buf.ndim != 2 || prism_buf.shape[1] != 6) {
    throw std::runtime_error("Prisms must be an Nx6 array");
  }

  const int *prism_ptr = static_cast<int *>(prism_buf.ptr);
  MMG5_int nprism = prism_buf.shape[0];

  const MMG5_int *refs_ptr = nullptr;
  if (refs.has_value()) {
    ensure_c_contiguous(*refs, "References");
    py::buffer_info refs_buf = refs->request();
    if (refs_buf.ndim != 1 || refs_buf.shape[0] != nprism) {
      throw std::runtime_error(
          "References array must be 1D with same length as prisms");
    }
    refs_ptr = static_cast<MMG5_int *>(refs_buf.ptr);
  }

  for (MMG5_int i = 0; i < nprism; i++) {
    MMG5_int ref = refs_ptr ? refs_ptr[i] : 0;
    if (!MMG3D_Set_prism(mesh, prism_ptr[i * 6] + 1, prism_ptr[i * 6 + 1] + 1,
                         prism_ptr[i * 6 + 2] + 1, prism_ptr[i * 6 + 3] + 1,
                         prism_ptr[i * 6 + 4] + 1, prism_ptr[i * 6 + 5] + 1,
                         ref, i + 1)) {
      throw std::runtime_error("Failed to set prism at index " +
                               std::to_string(i));
    }
  }
}

void MmgMesh::set_quadrilaterals(
    const py::array_t<int> &quads,
    const std::optional<py::array_t<MMG5_int>> &refs) {
  ensure_c_contiguous(quads, "Quadrilaterals");
  py::buffer_info quad_buf = quads.request();

  if (quad_buf.ndim != 2 || quad_buf.shape[1] != 4) {
    throw std::runtime_error("Quadrilaterals must be an Nx4 array");
  }

  const int *quad_ptr = static_cast<int *>(quad_buf.ptr);
  MMG5_int nquad = quad_buf.shape[0];

  const MMG5_int *refs_ptr = nullptr;
  if (refs.has_value()) {
    ensure_c_contiguous(*refs, "References");
    py::buffer_info refs_buf = refs->request();
    if (refs_buf.ndim != 1 || refs_buf.shape[0] != nquad) {
      throw std::runtime_error(
          "References array must be 1D with same length as quadrilaterals");
    }
    refs_ptr = static_cast<MMG5_int *>(refs_buf.ptr);
  }

  for (MMG5_int i = 0; i < nquad; i++) {
    MMG5_int ref = refs_ptr ? refs_ptr[i] : 0;
    if (!MMG3D_Set_quadrilateral(
            mesh, quad_ptr[i * 4] + 1, quad_ptr[i * 4 + 1] + 1,
            quad_ptr[i * 4 + 2] + 1, quad_ptr[i * 4 + 3] + 1, ref, i + 1)) {
      throw std::runtime_error("Failed to set quadrilateral at index " +
                               std::to_string(i));
    }
  }
}

py::tuple MmgMesh::get_prism(MMG5_int idx) const {
  MMG5_int mmg_idx = idx + 1;

  if (!mesh->prism) {
    throw std::runtime_error("No prisms in mesh");
  }

  if (mmg_idx < 1 || mmg_idx > mesh->nprism) {
    throw std::runtime_error("Prism index out of range: " +
                             std::to_string(idx));
  }

  MMG5_pPrism pp = &mesh->prism[mmg_idx];

  return py::make_tuple(
      static_cast<int>(pp->v[0] - 1), static_cast<int>(pp->v[1] - 1),
      static_cast<int>(pp->v[2] - 1), static_cast<int>(pp->v[3] - 1),
      static_cast<int>(pp->v[4] - 1), static_cast<int>(pp->v[5] - 1), pp->ref);
}

py::tuple MmgMesh::get_quadrilateral(MMG5_int idx) const {
  MMG5_int mmg_idx = idx + 1;

  if (!mesh->quadra) {
    throw std::runtime_error("No quadrilaterals in mesh");
  }

  if (mmg_idx < 1 || mmg_idx > mesh->nquad) {
    throw std::runtime_error("Quadrilateral index out of range: " +
                             std::to_string(idx));
  }

  MMG5_pQuad pq = &mesh->quadra[mmg_idx];

  return py::make_tuple(
      static_cast<int>(pq->v[0] - 1), static_cast<int>(pq->v[1] - 1),
      static_cast<int>(pq->v[2] - 1), static_cast<int>(pq->v[3] - 1), pq->ref);
}

py::array_t<int> MmgMesh::get_prisms() const {
  MMG5_int nprism = mesh->nprism;
  py::array_t<int> prisms({static_cast<py::ssize_t>(nprism), py::ssize_t{6}});
  auto buf = prisms.request();
  int *ptr = static_cast<int *>(buf.ptr);

  for (MMG5_int i = 0; i < nprism; i++) {
    MMG5_pPrism pp = &mesh->prism[i + 1];
    ptr[i * 6] = static_cast<int>(pp->v[0] - 1);
    ptr[i * 6 + 1] = static_cast<int>(pp->v[1] - 1);
    ptr[i * 6 + 2] = static_cast<int>(pp->v[2] - 1);
    ptr[i * 6 + 3] = static_cast<int>(pp->v[3] - 1);
    ptr[i * 6 + 4] = static_cast<int>(pp->v[4] - 1);
    ptr[i * 6 + 5] = static_cast<int>(pp->v[5] - 1);
  }
  return prisms;
}

py::array_t<int> MmgMesh::get_quadrilaterals() const {
  MMG5_int nquad = mesh->nquad;
  py::array_t<int> quads({static_cast<py::ssize_t>(nquad), py::ssize_t{4}});
  auto buf = quads.request();
  int *ptr = static_cast<int *>(buf.ptr);

  for (MMG5_int i = 0; i < nquad; i++) {
    MMG5_pQuad pq = &mesh->quadra[i + 1];
    ptr[i * 4] = static_cast<int>(pq->v[0] - 1);
    ptr[i * 4 + 1] = static_cast<int>(pq->v[1] - 1);
    ptr[i * 4 + 2] = static_cast<int>(pq->v[2] - 1);
    ptr[i * 4 + 3] = static_cast<int>(pq->v[3] - 1);
  }
  return quads;
}

py::tuple MmgMesh::get_prisms_with_refs() const {
  MMG5_int nprism = mesh->nprism;
  py::array_t<int> prisms({static_cast<py::ssize_t>(nprism), py::ssize_t{6}});
  py::array_t<MMG5_int> refs(static_cast<py::ssize_t>(nprism));

  auto prism_buf = prisms.request();
  auto refs_buf = refs.request();
  int *prism_ptr = static_cast<int *>(prism_buf.ptr);
  MMG5_int *refs_ptr = static_cast<MMG5_int *>(refs_buf.ptr);

  for (MMG5_int i = 0; i < nprism; i++) {
    MMG5_pPrism pp = &mesh->prism[i + 1];
    prism_ptr[i * 6] = static_cast<int>(pp->v[0] - 1);
    prism_ptr[i * 6 + 1] = static_cast<int>(pp->v[1] - 1);
    prism_ptr[i * 6 + 2] = static_cast<int>(pp->v[2] - 1);
    prism_ptr[i * 6 + 3] = static_cast<int>(pp->v[3] - 1);
    prism_ptr[i * 6 + 4] = static_cast<int>(pp->v[4] - 1);
    prism_ptr[i * 6 + 5] = static_cast<int>(pp->v[5] - 1);
    refs_ptr[i] = pp->ref;
  }
  return py::make_tuple(prisms, refs);
}

py::tuple MmgMesh::get_quadrilaterals_with_refs() const {
  MMG5_int nquad = mesh->nquad;
  py::array_t<int> quads({static_cast<py::ssize_t>(nquad), py::ssize_t{4}});
  py::array_t<MMG5_int> refs(static_cast<py::ssize_t>(nquad));

  auto quad_buf = quads.request();
  auto refs_buf = refs.request();
  int *quad_ptr = static_cast<int *>(quad_buf.ptr);
  MMG5_int *refs_ptr = static_cast<MMG5_int *>(refs_buf.ptr);

  for (MMG5_int i = 0; i < nquad; i++) {
    MMG5_pQuad pq = &mesh->quadra[i + 1];
    quad_ptr[i * 4] = static_cast<int>(pq->v[0] - 1);
    quad_ptr[i * 4 + 1] = static_cast<int>(pq->v[1] - 1);
    quad_ptr[i * 4 + 2] = static_cast<int>(pq->v[2] - 1);
    quad_ptr[i * 4 + 3] = static_cast<int>(pq->v[3] - 1);
    refs_ptr[i] = pq->ref;
  }
  return py::make_tuple(quads, refs);
}

py::array_t<int> MmgMesh::get_tetrahedra() const {
  // Alias for get_elements() for API symmetry with set_tetrahedra()
  return get_elements();
}

py::tuple MmgMesh::get_tetrahedra_with_refs() const {
  // Alias for get_elements_with_refs() for API symmetry with set_tetrahedra()
  return get_elements_with_refs();
}

py::dict MmgMesh::remesh(const py::dict &options) {
  RemeshStats before = collect_mesh_stats_3d(mesh, met);

  set_mesh_options_3D(mesh, met, options);

  // Capture stderr to collect MMG warnings
  StderrCapture capture;

  auto start = std::chrono::high_resolution_clock::now();

  int ret;
  const char *mode_name;
  if (mesh->info.lag > -1) {
    ret = MMG3D_mmg3dmov(mesh, met, disp);
    mode_name = "MMG3D_mmg3dmov (lagrangian motion)";
  } else if (mesh->info.iso || mesh->info.isosurf) {
    ret = MMG3D_mmg3dls(mesh, ls, met);
    mode_name = "MMG3D_mmg3dls (level-set discretization)";
  } else {
    ret = MMG3D_mmg3dlib(mesh, met);
    mode_name = "MMG3D_mmg3dlib (standard remeshing)";
  }

  auto end = std::chrono::high_resolution_clock::now();
  double duration = std::chrono::duration<double>(end - start).count();

  // Stop capture and parse warnings before potentially throwing
  std::string captured = capture.get();
  std::vector<std::string> warnings = parse_mmg_warnings(captured);

  if (ret != MMG5_SUCCESS) {
    throw std::runtime_error(std::string("Remeshing failed in ") + mode_name);
  }

  RemeshStats after = collect_mesh_stats_3d(mesh, met);

  return build_remesh_result(before, after, duration, ret, warnings);
}

py::dict MmgMesh::remesh_lagrangian(const py::array_t<double> &displacement,
                                    const py::dict &options) {
  RemeshStats before = collect_mesh_stats_3d(mesh, met);

  set_field("displacement", displacement);
  py::dict lag_options =
      merge_options_with_default(options, "lag", py::int_(1));
  set_mesh_options_3D(mesh, met, lag_options);

  // Capture stderr to collect MMG warnings
  StderrCapture capture;

  auto start = std::chrono::high_resolution_clock::now();
  int ret = MMG3D_mmg3dmov(mesh, met, disp);
  auto end = std::chrono::high_resolution_clock::now();
  double duration = std::chrono::duration<double>(end - start).count();

  // Stop capture and parse warnings before potentially throwing
  std::string captured = capture.get();
  std::vector<std::string> warnings = parse_mmg_warnings(captured);

  if (ret != MMG5_SUCCESS) {
    throw std::runtime_error("MMG3D Lagrangian motion remeshing failed (ret=" +
                             std::to_string(ret) + ")");
  }

  RemeshStats after = collect_mesh_stats_3d(mesh, met);

  return build_remesh_result(before, after, duration, ret, warnings);
}

py::dict MmgMesh::remesh_levelset(const py::array_t<double> &levelset,
                                  const py::dict &options) {
  RemeshStats before = collect_mesh_stats_3d(mesh, met);

  set_field("levelset", levelset);
  py::dict ls_options = merge_options_with_default(options, "iso", py::int_(1));
  set_mesh_options_3D(mesh, met, ls_options);

  // Capture stderr to collect MMG warnings
  StderrCapture capture;

  auto start = std::chrono::high_resolution_clock::now();
  int ret = MMG3D_mmg3dls(mesh, ls, met);
  auto end = std::chrono::high_resolution_clock::now();
  double duration = std::chrono::duration<double>(end - start).count();

  // Stop capture and parse warnings before potentially throwing
  std::string captured = capture.get();
  std::vector<std::string> warnings = parse_mmg_warnings(captured);

  if (ret != MMG5_SUCCESS) {
    throw std::runtime_error("MMG3D level-set discretization failed (ret=" +
                             std::to_string(ret) + ")");
  }

  RemeshStats after = collect_mesh_stats_3d(mesh, met);

  return build_remesh_result(before, after, duration, ret, warnings);
}
