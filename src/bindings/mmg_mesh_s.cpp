#include "mmg_mesh_s.hpp"
#include "mmg_common.hpp"
#include <chrono>
#include <cmath>
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

// Compute triangle quality manually since MMGS_Get_triangleQuality
// is not properly exported on Windows DLL.
// Uses threshold 1e-30 for near-zero detection (well above denormal range
// ~2e-308, but catches degenerate triangles with area or edge sum near zero).
double compute_triangle_quality(MMG5_pMesh mesh, MMG5_int k) {
  MMG5_pTria pt = &mesh->tria[k];
  MMG5_pPoint p0 = &mesh->point[pt->v[0]];
  MMG5_pPoint p1 = &mesh->point[pt->v[1]];
  MMG5_pPoint p2 = &mesh->point[pt->v[2]];

  // Compute edge vectors
  double ax = p1->c[0] - p0->c[0];
  double ay = p1->c[1] - p0->c[1];
  double az = p1->c[2] - p0->c[2];
  double bx = p2->c[0] - p0->c[0];
  double by = p2->c[1] - p0->c[1];
  double bz = p2->c[2] - p0->c[2];
  double cx = p2->c[0] - p1->c[0];
  double cy = p2->c[1] - p1->c[1];
  double cz = p2->c[2] - p1->c[2];

  // Compute edge lengths squared
  double a2 = ax * ax + ay * ay + az * az;
  double b2 = bx * bx + by * by + bz * bz;
  double c2 = cx * cx + cy * cy + cz * cz;

  // Compute cross product for area
  double nx = ay * bz - az * by;
  double ny = az * bx - ax * bz;
  double nz = ax * by - ay * bx;
  double area2 = nx * nx + ny * ny + nz * nz;

  if (area2 < 1e-30) {
    return 0.0;
  }

  // Quality = 4 * sqrt(3) * area / (a^2 + b^2 + c^2)
  // This is the standard triangle quality metric (ratio to equilateral)
  double sum_edges = a2 + b2 + c2;
  if (sum_edges < 1e-30) {
    return 0.0;
  }

  return 4.0 * std::sqrt(3.0) * std::sqrt(area2) / (2.0 * sum_edges);
}

// Collect mesh statistics for surface mesh
RemeshStats collect_mesh_stats_surface(MMG5_pMesh mesh) {
  RemeshStats stats;
  stats.vertices = mesh->np;
  stats.elements = mesh->nt; // triangles are primary elements for surface mesh
  stats.triangles = mesh->nt;
  stats.edges = mesh->na;

  stats.quality_min = 1.0;
  double quality_sum = 0.0;
  if (stats.triangles > 0) {
    for (MMG5_int i = 1; i <= stats.triangles; i++) {
      double q = compute_triangle_quality(mesh, i);
      quality_sum += q;
      if (q < stats.quality_min)
        stats.quality_min = q;
    }
    stats.quality_mean = quality_sum / stats.triangles;
  } else {
    stats.quality_mean = 0.0;
  }

  return stats;
}
} // namespace

MmgMeshS::MmgMeshS() {
  mesh = nullptr;
  met = nullptr;
  ls = nullptr;

  if (!MMGS_Init_mesh(MMG5_ARG_start, MMG5_ARG_ppMesh, &mesh, MMG5_ARG_ppMet,
                      &met, MMG5_ARG_ppLs, &ls, MMG5_ARG_end)) {
    throw std::runtime_error("Failed to initialize MMGS mesh");
  }
}

MmgMeshS::MmgMeshS(const py::array_t<double> &vertices,
                   const py::array_t<int> &triangles)
    : MmgMeshS() {
  py::buffer_info vert_buf = vertices.request();
  py::buffer_info tri_buf = triangles.request();

  if (vert_buf.ndim != 2 || vert_buf.shape[1] != 3) {
    throw std::runtime_error("Vertices must be an Nx3 array for surface mesh");
  }
  if (tri_buf.ndim != 2 || tri_buf.shape[1] != 3) {
    throw std::runtime_error("Triangles must be an Nx3 array");
  }

  MMG5_int nvert = vert_buf.shape[0];
  MMG5_int ntri = tri_buf.shape[0];

  set_mesh_size(nvert, ntri, 0);
  set_vertices(vertices);
  set_triangles(triangles);
}

MmgMeshS::MmgMeshS(
    const std::variant<std::string, std::filesystem::path> &filename) {
  mesh = nullptr;
  met = nullptr;
  ls = nullptr;

  if (!MMGS_Init_mesh(MMG5_ARG_start, MMG5_ARG_ppMesh, &mesh, MMG5_ARG_ppMet,
                      &met, MMG5_ARG_ppLs, &ls, MMG5_ARG_end)) {
    throw std::runtime_error("Failed to initialize MMGS mesh");
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
    ret = MMGS_loadVtkMesh(mesh, met, nullptr, fname.c_str());
  } else if (ext == ".vtu") {
    ret = MMGS_loadVtuMesh(mesh, met, nullptr, fname.c_str());
  } else {
    ret = MMGS_loadMesh(mesh, fname.c_str());
  }

  if (!ret) {
    cleanup();
    throw std::runtime_error("Failed to load mesh from file: " + fname);
  }
}

MmgMeshS::~MmgMeshS() { cleanup(); }

void MmgMeshS::set_mesh_size(MMG5_int vertices, MMG5_int triangles,
                             MMG5_int edges) {
  if (!MMGS_Set_meshSize(mesh, vertices, triangles, edges)) {
    throw std::runtime_error("Failed to set mesh size");
  }
}

py::tuple MmgMeshS::get_mesh_size() const {
  MMG5_int np, nt, na;
  if (!MMGS_Get_meshSize(mesh, &np, &nt, &na)) {
    throw std::runtime_error("Failed to get mesh size");
  }
  return py::make_tuple(np, nt, na);
}

void MmgMeshS::set_vertices(const py::array_t<double> &vertices,
                            const std::optional<py::array_t<MMG5_int>> &refs) {
  ensure_c_contiguous(vertices, "Vertices");
  py::buffer_info vert_buf = vertices.request();

  if (vert_buf.ndim != 2 || vert_buf.shape[1] != 3) {
    throw std::runtime_error("Vertices must be an Nx3 array for surface mesh");
  }

  const double *vert_ptr = static_cast<double *>(vert_buf.ptr);
  MMG5_int nvert = vert_buf.shape[0];

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
    if (!MMGS_Set_vertex(mesh, vert_ptr[i * 3], vert_ptr[i * 3 + 1],
                         vert_ptr[i * 3 + 2], ref, i + 1)) {
      throw std::runtime_error("Failed to set vertex at index " +
                               std::to_string(i));
    }
  }
}

void MmgMeshS::set_triangles(const py::array_t<int> &triangles,
                             const std::optional<py::array_t<MMG5_int>> &refs) {
  ensure_c_contiguous(triangles, "Triangles");
  py::buffer_info tri_buf = triangles.request();

  if (tri_buf.ndim != 2 || tri_buf.shape[1] != 3) {
    throw std::runtime_error("Triangles must be an Nx3 array");
  }

  const int *tri_ptr = static_cast<int *>(tri_buf.ptr);
  MMG5_int ntri = tri_buf.shape[0];

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
    if (!MMGS_Set_triangle(mesh, tri_ptr[i * 3] + 1, tri_ptr[i * 3 + 1] + 1,
                           tri_ptr[i * 3 + 2] + 1, ref, i + 1)) {
      throw std::runtime_error("Failed to set triangle at index " +
                               std::to_string(i));
    }
  }
}

void MmgMeshS::set_edges(const py::array_t<int> &edges,
                         const std::optional<py::array_t<MMG5_int>> &refs) {
  ensure_c_contiguous(edges, "Edges");
  py::buffer_info edge_buf = edges.request();

  if (edge_buf.ndim != 2 || edge_buf.shape[1] != 2) {
    throw std::runtime_error("Edges must be an Nx2 array");
  }

  const int *edge_ptr = static_cast<int *>(edge_buf.ptr);
  MMG5_int nedge = edge_buf.shape[0];

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
    if (!MMGS_Set_edge(mesh, edge_ptr[i * 2] + 1, edge_ptr[i * 2 + 1] + 1, ref,
                       i + 1)) {
      throw std::runtime_error("Failed to set edge at index " +
                               std::to_string(i));
    }
  }
}

py::array_t<double> MmgMeshS::get_vertices() const {
  MMG5_int np = mesh->np;
  py::array_t<double> vertices({static_cast<py::ssize_t>(np), py::ssize_t{3}});
  auto buf = vertices.request();
  double *ptr = static_cast<double *>(buf.ptr);

  mesh->npi = mesh->np;

  for (MMG5_int i = 0; i < np; i++) {
    double x, y, z;
    MMG5_int ref;
    int corner, required;

    if (!MMGS_Get_vertex(mesh, &x, &y, &z, &ref, &corner, &required)) {
      throw std::runtime_error("Failed to get vertex at index " +
                               std::to_string(i));
    }

    ptr[i * 3] = x;
    ptr[i * 3 + 1] = y;
    ptr[i * 3 + 2] = z;
  }
  return vertices;
}

py::tuple MmgMeshS::get_vertices_with_refs() const {
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

    if (!MMGS_Get_vertex(mesh, &x, &y, &z, &ref, &corner, &required)) {
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

py::array_t<int> MmgMeshS::get_triangles() const {
  MMG5_int nt = mesh->nt;
  py::array_t<int> triangles({static_cast<py::ssize_t>(nt), py::ssize_t{3}});
  auto buf = triangles.request();
  int *ptr = static_cast<int *>(buf.ptr);

  mesh->nti = mesh->nt;

  for (MMG5_int i = 0; i < nt; i++) {
    int v0, v1, v2;
    MMG5_int ref;
    int required;

    if (!MMGS_Get_triangle(mesh, &v0, &v1, &v2, &ref, &required)) {
      throw std::runtime_error("Failed to get triangle at index " +
                               std::to_string(i));
    }

    ptr[i * 3] = v0 - 1;
    ptr[i * 3 + 1] = v1 - 1;
    ptr[i * 3 + 2] = v2 - 1;
  }
  return triangles;
}

py::tuple MmgMeshS::get_triangles_with_refs() const {
  MMG5_int nt = mesh->nt;
  py::array_t<int> triangles({static_cast<py::ssize_t>(nt), py::ssize_t{3}});
  py::array_t<MMG5_int> refs(static_cast<py::ssize_t>(nt));

  auto tri_buf = triangles.request();
  auto refs_buf = refs.request();
  int *tri_ptr = static_cast<int *>(tri_buf.ptr);
  MMG5_int *refs_ptr = static_cast<MMG5_int *>(refs_buf.ptr);

  mesh->nti = mesh->nt;

  for (MMG5_int i = 0; i < nt; i++) {
    int v0, v1, v2;
    MMG5_int ref;
    int required;

    if (!MMGS_Get_triangle(mesh, &v0, &v1, &v2, &ref, &required)) {
      throw std::runtime_error("Failed to get triangle at index " +
                               std::to_string(i));
    }

    tri_ptr[i * 3] = v0 - 1;
    tri_ptr[i * 3 + 1] = v1 - 1;
    tri_ptr[i * 3 + 2] = v2 - 1;
    refs_ptr[i] = ref;
  }
  return py::make_tuple(triangles, refs);
}

py::array_t<int> MmgMeshS::get_edges() const {
  MMG5_int na = mesh->na;
  py::array_t<int> edges({static_cast<py::ssize_t>(na), py::ssize_t{2}});
  auto buf = edges.request();
  int *ptr = static_cast<int *>(buf.ptr);

  mesh->nai = mesh->na;

  for (MMG5_int i = 0; i < na; i++) {
    MMG5_int v0, v1;
    MMG5_int ref;
    int corner, required;

    if (!MMGS_Get_edge(mesh, &v0, &v1, &ref, &corner, &required)) {
      throw std::runtime_error("Failed to get edge at index " +
                               std::to_string(i));
    }

    ptr[i * 2] = static_cast<int>(v0 - 1);
    ptr[i * 2 + 1] = static_cast<int>(v1 - 1);
  }
  return edges;
}

py::tuple MmgMeshS::get_edges_with_refs() const {
  MMG5_int na = mesh->na;
  py::array_t<int> edges({static_cast<py::ssize_t>(na), py::ssize_t{2}});
  py::array_t<MMG5_int> refs(static_cast<py::ssize_t>(na));

  auto edge_buf = edges.request();
  auto refs_buf = refs.request();
  int *edge_ptr = static_cast<int *>(edge_buf.ptr);
  MMG5_int *refs_ptr = static_cast<MMG5_int *>(refs_buf.ptr);

  mesh->nai = mesh->na;

  for (MMG5_int i = 0; i < na; i++) {
    MMG5_int v0, v1;
    MMG5_int ref;
    int corner, required;

    if (!MMGS_Get_edge(mesh, &v0, &v1, &ref, &corner, &required)) {
      throw std::runtime_error("Failed to get edge at index " +
                               std::to_string(i));
    }

    edge_ptr[i * 2] = static_cast<int>(v0 - 1);
    edge_ptr[i * 2 + 1] = static_cast<int>(v1 - 1);
    refs_ptr[i] = ref;
  }
  return py::make_tuple(edges, refs);
}

void MmgMeshS::set_vertex(double x, double y, double z, MMG5_int ref,
                          MMG5_int idx) {
  if (idx < 0 || idx >= mesh->npmax) {
    throw std::runtime_error("Vertex index out of range: " +
                             std::to_string(idx));
  }
  if (!MMGS_Set_vertex(mesh, x, y, z, ref, idx + 1)) {
    throw std::runtime_error("Failed to set vertex at index " +
                             std::to_string(idx));
  }
}

void MmgMeshS::set_triangle(int v0, int v1, int v2, MMG5_int ref,
                            MMG5_int idx) {
  if (idx < 0 || idx >= mesh->ntmax) {
    throw std::runtime_error("Triangle index out of range: " +
                             std::to_string(idx));
  }
  if (!MMGS_Set_triangle(mesh, v0 + 1, v1 + 1, v2 + 1, ref, idx + 1)) {
    throw std::runtime_error("Failed to set triangle at index " +
                             std::to_string(idx));
  }
}

void MmgMeshS::set_edge(int v0, int v1, MMG5_int ref, MMG5_int idx) {
  if (idx < 0 || idx >= mesh->namax) {
    throw std::runtime_error("Edge index out of range: " + std::to_string(idx));
  }
  if (!MMGS_Set_edge(mesh, v0 + 1, v1 + 1, ref, idx + 1)) {
    throw std::runtime_error("Failed to set edge at index " +
                             std::to_string(idx));
  }
}

py::tuple MmgMeshS::get_vertex(MMG5_int idx) const {
  double x, y, z;
  MMG5_int ref;
  int corner, required;

  if (!MMGS_GetByIdx_vertex(mesh, &x, &y, &z, &ref, &corner, &required,
                            idx + 1)) {
    throw std::runtime_error("Failed to get vertex at index " +
                             std::to_string(idx));
  }

  return py::make_tuple(x, y, z, ref);
}

py::tuple MmgMeshS::get_triangle(MMG5_int idx) const {
  MMG5_int mmg_idx = idx + 1;

  if (!mesh->tria) {
    throw std::runtime_error("No triangles in mesh");
  }

  if (mmg_idx < 1 || mmg_idx > mesh->nt) {
    throw std::runtime_error("Triangle index out of range: " +
                             std::to_string(idx));
  }

  MMG5_pTria pt = &mesh->tria[mmg_idx];

  return py::make_tuple(static_cast<int>(pt->v[0] - 1),
                        static_cast<int>(pt->v[1] - 1),
                        static_cast<int>(pt->v[2] - 1), pt->ref);
}

py::tuple MmgMeshS::get_edge(MMG5_int idx) const {
  MMG5_int mmg_idx = idx + 1;

  if (!mesh->edge) {
    throw std::runtime_error("No edges in mesh");
  }

  if (mmg_idx < 1 || mmg_idx > mesh->na) {
    throw std::runtime_error("Edge index out of range: " + std::to_string(idx));
  }

  MMG5_pEdge pe = &mesh->edge[mmg_idx];

  return py::make_tuple(static_cast<int>(pe->a - 1),
                        static_cast<int>(pe->b - 1), pe->ref);
}

// Element attributes

void MmgMeshS::set_corners(const py::array_t<int> &vertex_indices) {
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
    if (!MMGS_Set_corner(mesh, idx + 1)) {
      throw std::runtime_error("Failed to set corner at vertex index " +
                               std::to_string(idx));
    }
  }
}

void MmgMeshS::set_required_vertices(const py::array_t<int> &vertex_indices) {
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
    if (!MMGS_Set_requiredVertex(mesh, idx + 1)) {
      throw std::runtime_error("Failed to set required vertex at index " +
                               std::to_string(idx));
    }
  }
}

void MmgMeshS::set_ridge_edges(const py::array_t<int> &edge_indices) {
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
    if (!MMGS_Set_ridge(mesh, idx + 1)) {
      throw std::runtime_error("Failed to set ridge at edge index " +
                               std::to_string(idx));
    }
  }
}

// Topology queries

py::array_t<int> MmgMeshS::get_adjacent_elements(MMG5_int idx) const {
  MMG5_int mmg_idx = idx + 1;

  if (mmg_idx < 1 || mmg_idx > mesh->nt) {
    throw std::runtime_error("Element index out of range: " +
                             std::to_string(idx));
  }

  MMG5_int listri[3];
  if (!MMGS_Get_adjaTri(mesh, mmg_idx, listri)) {
    throw std::runtime_error("Failed to get adjacent elements for index " +
                             std::to_string(idx));
  }

  py::array_t<int> result(py::ssize_t{3});
  auto buf = result.request();
  int *ptr = static_cast<int *>(buf.ptr);

  for (int i = 0; i < 3; i++) {
    ptr[i] = listri[i] > 0 ? static_cast<int>(listri[i] - 1) : -1;
  }

  return result;
}

py::array_t<int> MmgMeshS::get_vertex_neighbors(MMG5_int idx) const {
  MMG5_int mmg_idx = idx + 1;

  if (mmg_idx < 1 || mmg_idx > mesh->np) {
    throw std::runtime_error("Vertex index out of range: " +
                             std::to_string(idx));
  }

  // Manual implementation: iterate through triangles to find neighbors
  // since MMGS_Get_adjaVerticesFast requires adjacency tables that may not
  // exist
  std::set<MMG5_int> neighbors;

  for (MMG5_int k = 1; k <= mesh->nt; k++) {
    MMG5_pTria pt = &mesh->tria[k];
    if (!pt->v[0])
      continue;

    bool found = false;
    for (int i = 0; i < 3; i++) {
      if (pt->v[i] == mmg_idx) {
        found = true;
        break;
      }
    }

    if (found) {
      for (int i = 0; i < 3; i++) {
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

double MmgMeshS::get_element_quality(MMG5_int idx) const {
  MMG5_int mmg_idx = idx + 1;

  if (mmg_idx < 1 || mmg_idx > mesh->nt) {
    throw std::runtime_error("Element index out of range: " +
                             std::to_string(idx));
  }

  return compute_triangle_quality(mesh, mmg_idx);
}

py::array_t<double> MmgMeshS::get_element_qualities() const {
  MMG5_int nt = mesh->nt;
  py::array_t<double> result(static_cast<py::ssize_t>(nt));
  auto buf = result.request();
  double *ptr = static_cast<double *>(buf.ptr);

  for (MMG5_int i = 0; i < nt; i++) {
    ptr[i] = compute_triangle_quality(mesh, i + 1);
  }

  return result;
}

void MmgMeshS::set_field(const std::string &field_name,
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

  if (!MMGS_Set_solSize(mesh, *sol_ptr, MMG5_Vertex, np,
                        get_mmg_type(field.type))) {
    throw std::runtime_error("Failed to set " + field_name + " solution size");
  }

  const double *ptr = static_cast<double *>(buf.ptr);
  bool success = false;
  switch (field.type) {
  case SolutionType::SCALAR:
    success = MMGS_Set_scalarSols(*sol_ptr, const_cast<double *>(ptr));
    break;
  case SolutionType::VECTOR:
    success = MMGS_Set_vectorSols(*sol_ptr, const_cast<double *>(ptr));
    break;
  case SolutionType::TENSOR:
    success = MMGS_Set_tensorSols(*sol_ptr, const_cast<double *>(ptr));
    break;
  }

  if (!success) {
    throw std::runtime_error("Failed to set " + field_name + " values");
  }
}

py::array_t<double> MmgMeshS::get_field(const std::string &field_name) const {
  auto field = get_solution_field(field_name);
  MMG5_int np = mesh->np;

  py::array_t<double> values({static_cast<py::ssize_t>(np),
                              static_cast<py::ssize_t>(field.components)});
  auto buf = values.request();
  double *ptr = static_cast<double *>(buf.ptr);

  bool success = false;
  switch (field.type) {
  case SolutionType::SCALAR:
    success = MMGS_Get_scalarSols(*field.sol_ptr, ptr);
    break;
  case SolutionType::VECTOR:
    success = MMGS_Get_vectorSols(*field.sol_ptr, ptr);
    break;
  case SolutionType::TENSOR:
    success = MMGS_Get_tensorSols(*field.sol_ptr, ptr);
    break;
  }

  if (!success) {
    throw std::runtime_error("Failed to get " + field_name + " values");
  }

  return values;
}

py::array_t<double> MmgMeshS::getitem(const std::string &key) const {
  return get_field(key);
}

void MmgMeshS::setitem(const std::string &key,
                       const py::array_t<double> &value) {
  set_field(key, value);
}

void MmgMeshS::save(
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
    ret = MMGS_saveVtkMesh(mesh, met, fname.c_str());
  } else if (ext == ".vtu") {
    ret = MMGS_saveVtuMesh(mesh, met, fname.c_str());
  } else {
    ret = MMGS_saveMesh(mesh, fname.c_str());
  }

  if (!ret) {
    throw std::runtime_error("Failed to save mesh to file: " + fname);
  }
}

MmgMeshS::SolutionField
MmgMeshS::get_solution_field(const std::string &field_name) const {
  if (field_name == "metric") {
    return {&met, SolutionType::SCALAR, 1};
  } else if (field_name == "levelset") {
    return {&ls, SolutionType::SCALAR, 1};
  } else if (field_name == "tensor") {
    return {&met, SolutionType::TENSOR, 6};
  }
  throw std::runtime_error("Unknown field: " + field_name);
}

int MmgMeshS::get_mmg_type(SolutionType type) const {
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

std::string MmgMeshS::get_file_extension(const std::string &filename) {
  size_t pos = filename.find_last_of('.');
  if (pos != std::string::npos) {
    return filename.substr(pos);
  }
  return "";
}

void MmgMeshS::cleanup() {
  if (mesh || met || ls) {
    MMGS_Free_all(MMG5_ARG_start, MMG5_ARG_ppMesh, &mesh, MMG5_ARG_ppMet, &met,
                  MMG5_ARG_ppLs, &ls, MMG5_ARG_end);
    mesh = nullptr;
    met = nullptr;
    ls = nullptr;
  }
}

py::dict MmgMeshS::remesh(const py::dict &options) {
  RemeshStats before = collect_mesh_stats_surface(mesh);

  set_mesh_options_surface(mesh, met, options);

  // Capture stderr to collect MMG warnings
  StderrCapture capture;

  auto start = std::chrono::high_resolution_clock::now();

  // Note: MMGS does not support lagrangian motion mode (mesh->info.lag).
  // Unlike MMG3D and MMG2D which have mmg3dmov/mmg2dmov functions,
  // MMGS only supports standard remeshing and level-set discretization.
  int ret;
  const char *mode_name;
  if (mesh->info.iso || mesh->info.isosurf) {
    ret = MMGS_mmgsls(mesh, ls, met);
    mode_name = "MMGS_mmgsls (level-set discretization)";
  } else {
    ret = MMGS_mmgslib(mesh, met);
    mode_name = "MMGS_mmgslib (standard remeshing)";
  }

  auto end = std::chrono::high_resolution_clock::now();
  double duration = std::chrono::duration<double>(end - start).count();

  // Stop capture and parse warnings before potentially throwing
  std::string captured = capture.get();
  std::vector<std::string> warnings = parse_mmg_warnings(captured);

  if (ret != MMG5_SUCCESS) {
    throw std::runtime_error(std::string("Remeshing failed in ") + mode_name);
  }

  RemeshStats after = collect_mesh_stats_surface(mesh);

  return build_remesh_result(before, after, duration, ret, warnings);
}

py::dict MmgMeshS::remesh_levelset(const py::array_t<double> &levelset,
                                   const py::dict &options) {
  RemeshStats before = collect_mesh_stats_surface(mesh);

  set_field("levelset", levelset);
  py::dict ls_options = merge_options_with_default(options, "iso", py::int_(1));
  set_mesh_options_surface(mesh, met, ls_options);

  // Capture stderr to collect MMG warnings
  StderrCapture capture;

  auto start = std::chrono::high_resolution_clock::now();
  int ret = MMGS_mmgsls(mesh, ls, met);
  auto end = std::chrono::high_resolution_clock::now();
  double duration = std::chrono::duration<double>(end - start).count();

  // Stop capture and parse warnings before potentially throwing
  std::string captured = capture.get();
  std::vector<std::string> warnings = parse_mmg_warnings(captured);

  if (ret != MMG5_SUCCESS) {
    throw std::runtime_error("MMGS level-set discretization failed (ret=" +
                             std::to_string(ret) + ")");
  }

  RemeshStats after = collect_mesh_stats_surface(mesh);

  return build_remesh_result(before, after, duration, ret, warnings);
}

void MmgMeshS::remesh_lagrangian(const py::array_t<double> & /*displacement*/,
                                 const py::dict & /*options*/) {
  // MMGS does not support Lagrangian motion because:
  // 1. Lagrangian motion requires the ELAS library to solve elasticity PDEs
  //    that propagate boundary displacements to interior vertices
  // 2. Surface meshes have no volumetric interior - all vertices are on the
  //    surface
  // 3. ELAS only supports 2D/3D volumetric elasticity, not shell/membrane
  //    elasticity needed for surfaces
  throw std::runtime_error(
      "Lagrangian motion is not supported for surface meshes (MmgMeshS).\n\n"
      "Reason: Lagrangian motion requires solving elasticity PDEs to propagate "
      "boundary displacements to interior vertices. Surface meshes have no "
      "volumetric interior - the ELAS library only supports 2D/3D elasticity, "
      "not shell/membrane elasticity needed for surfaces.\n\n"
      "Alternative: Use mmgpy.move_mesh() to move vertices and remesh:\n"
      "    mmgpy.move_mesh(mesh, displacement, hausd=0.01)");
}
