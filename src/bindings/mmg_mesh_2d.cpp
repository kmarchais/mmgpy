#include "mmg_mesh_2d.hpp"
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

// Collect mesh statistics for 2D triangular mesh
RemeshStats collect_mesh_stats_2d(MMG5_pMesh mesh, MMG5_pSol met) {
  RemeshStats stats;
  stats.vertices = mesh->np;
  stats.elements = mesh->nt; // triangles are primary elements in 2D
  stats.triangles = mesh->nt;
  stats.edges = mesh->na;

  stats.quality_min = 1.0;
  double quality_sum = 0.0;
  if (stats.triangles > 0) {
    for (MMG5_int i = 1; i <= stats.triangles; i++) {
      double q = MMG2D_Get_triangleQuality(mesh, met, i);
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

MmgMesh2D::MmgMesh2D() {
  mesh = nullptr;
  met = nullptr;
  disp = nullptr;
  ls = nullptr;

  if (!MMG2D_Init_mesh(MMG5_ARG_start, MMG5_ARG_ppMesh, &mesh, MMG5_ARG_ppMet,
                       &met, MMG5_ARG_ppLs, &ls, MMG5_ARG_ppDisp, &disp,
                       MMG5_ARG_end)) {
    throw std::runtime_error("Failed to initialize MMG2D mesh");
  }
}

MmgMesh2D::MmgMesh2D(const py::array_t<double> &vertices,
                     const py::array_t<int> &triangles)
    : MmgMesh2D() {
  py::buffer_info vert_buf = vertices.request();
  py::buffer_info tri_buf = triangles.request();

  if (vert_buf.ndim != 2 || vert_buf.shape[1] != 2) {
    throw std::runtime_error("Vertices must be an Nx2 array for 2D mesh");
  }
  if (tri_buf.ndim != 2 || tri_buf.shape[1] != 3) {
    throw std::runtime_error("Triangles must be an Nx3 array");
  }

  MMG5_int nvert = vert_buf.shape[0];
  MMG5_int ntri = tri_buf.shape[0];

  set_mesh_size(nvert, ntri, 0, 0);
  set_vertices(vertices);
  set_triangles(triangles);
}

MmgMesh2D::MmgMesh2D(
    const std::variant<std::string, std::filesystem::path> &filename) {
  mesh = nullptr;
  met = nullptr;
  disp = nullptr;
  ls = nullptr;

  if (!MMG2D_Init_mesh(MMG5_ARG_start, MMG5_ARG_ppMesh, &mesh, MMG5_ARG_ppMet,
                       &met, MMG5_ARG_ppLs, &ls, MMG5_ARG_ppDisp, &disp,
                       MMG5_ARG_end)) {
    throw std::runtime_error("Failed to initialize MMG2D mesh");
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
    ret = MMG2D_loadVtkMesh(mesh, met, nullptr, fname.c_str());
  } else if (ext == ".vtu") {
    ret = MMG2D_loadVtuMesh(mesh, met, nullptr, fname.c_str());
  } else {
    ret = MMG2D_loadMesh(mesh, fname.c_str());
  }

  if (!ret) {
    cleanup();
    throw std::runtime_error("Failed to load mesh from file: " + fname);
  }
}

MmgMesh2D::~MmgMesh2D() { cleanup(); }

void MmgMesh2D::set_mesh_size(MMG5_int vertices, MMG5_int triangles,
                              MMG5_int quadrilaterals, MMG5_int edges) {
  if (!MMG2D_Set_meshSize(mesh, vertices, triangles, quadrilaterals, edges)) {
    throw std::runtime_error("Failed to set mesh size");
  }
}

py::tuple MmgMesh2D::get_mesh_size() const {
  MMG5_int np, nt, nquad, na;
  if (!MMG2D_Get_meshSize(mesh, &np, &nt, &nquad, &na)) {
    throw std::runtime_error("Failed to get mesh size");
  }
  // MMG2D_Get_meshSize may not always return edges correctly,
  // so read directly from mesh structure
  na = mesh->na;
  return py::make_tuple(np, nt, nquad, na);
}

void MmgMesh2D::set_vertices(const py::array_t<double> &vertices,
                             const std::optional<py::array_t<MMG5_int>> &refs) {
  ensure_c_contiguous(vertices, "Vertices");
  py::buffer_info vert_buf = vertices.request();

  if (vert_buf.ndim != 2 || vert_buf.shape[1] != 2) {
    throw std::runtime_error("Vertices must be an Nx2 array for 2D mesh");
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
    if (!MMG2D_Set_vertex(mesh, vert_ptr[i * 2], vert_ptr[i * 2 + 1], ref,
                          i + 1)) {
      throw std::runtime_error("Failed to set vertex at index " +
                               std::to_string(i));
    }
  }
}

void MmgMesh2D::set_triangles(
    const py::array_t<int> &triangles,
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
    if (!MMG2D_Set_triangle(mesh, tri_ptr[i * 3] + 1, tri_ptr[i * 3 + 1] + 1,
                            tri_ptr[i * 3 + 2] + 1, ref, i + 1)) {
      throw std::runtime_error("Failed to set triangle at index " +
                               std::to_string(i));
    }
  }
}

void MmgMesh2D::set_quadrilaterals(
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
    if (!MMG2D_Set_quadrilateral(
            mesh, quad_ptr[i * 4] + 1, quad_ptr[i * 4 + 1] + 1,
            quad_ptr[i * 4 + 2] + 1, quad_ptr[i * 4 + 3] + 1, ref, i + 1)) {
      throw std::runtime_error("Failed to set quadrilateral at index " +
                               std::to_string(i));
    }
  }
}

void MmgMesh2D::set_edges(const py::array_t<int> &edges,
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
    if (!MMG2D_Set_edge(mesh, edge_ptr[i * 2] + 1, edge_ptr[i * 2 + 1] + 1, ref,
                        i + 1)) {
      throw std::runtime_error("Failed to set edge at index " +
                               std::to_string(i));
    }
  }
}

py::array_t<double> MmgMesh2D::get_vertices() const {
  MMG5_int np = mesh->np;
  py::array_t<double> vertices({static_cast<py::ssize_t>(np), py::ssize_t{2}});
  auto buf = vertices.request();
  double *ptr = static_cast<double *>(buf.ptr);

  mesh->npi = mesh->np;

  for (MMG5_int i = 0; i < np; i++) {
    double x, y;
    MMG5_int ref;
    int corner, required;

    if (!MMG2D_Get_vertex(mesh, &x, &y, &ref, &corner, &required)) {
      throw std::runtime_error("Failed to get vertex at index " +
                               std::to_string(i));
    }

    ptr[i * 2] = x;
    ptr[i * 2 + 1] = y;
  }
  return vertices;
}

py::tuple MmgMesh2D::get_vertices_with_refs() const {
  MMG5_int np = mesh->np;
  py::array_t<double> vertices({static_cast<py::ssize_t>(np), py::ssize_t{2}});
  py::array_t<MMG5_int> refs(static_cast<py::ssize_t>(np));

  auto vert_buf = vertices.request();
  auto refs_buf = refs.request();
  double *vert_ptr = static_cast<double *>(vert_buf.ptr);
  MMG5_int *refs_ptr = static_cast<MMG5_int *>(refs_buf.ptr);

  mesh->npi = mesh->np;

  for (MMG5_int i = 0; i < np; i++) {
    double x, y;
    MMG5_int ref;
    int corner, required;

    if (!MMG2D_Get_vertex(mesh, &x, &y, &ref, &corner, &required)) {
      throw std::runtime_error("Failed to get vertex at index " +
                               std::to_string(i));
    }

    vert_ptr[i * 2] = x;
    vert_ptr[i * 2 + 1] = y;
    refs_ptr[i] = ref;
  }
  return py::make_tuple(vertices, refs);
}

py::array_t<int> MmgMesh2D::get_triangles() const {
  MMG5_int nt = mesh->nt;
  py::array_t<int> triangles({static_cast<py::ssize_t>(nt), py::ssize_t{3}});
  auto buf = triangles.request();
  int *ptr = static_cast<int *>(buf.ptr);

  mesh->nti = mesh->nt;

  for (MMG5_int i = 0; i < nt; i++) {
    int v0, v1, v2;
    MMG5_int ref;
    int required;

    if (!MMG2D_Get_triangle(mesh, &v0, &v1, &v2, &ref, &required)) {
      throw std::runtime_error("Failed to get triangle at index " +
                               std::to_string(i));
    }

    ptr[i * 3] = v0 - 1;
    ptr[i * 3 + 1] = v1 - 1;
    ptr[i * 3 + 2] = v2 - 1;
  }
  return triangles;
}

py::tuple MmgMesh2D::get_triangles_with_refs() const {
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

    if (!MMG2D_Get_triangle(mesh, &v0, &v1, &v2, &ref, &required)) {
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

py::array_t<int> MmgMesh2D::get_quadrilaterals() const {
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

py::tuple MmgMesh2D::get_quadrilaterals_with_refs() const {
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

py::array_t<int> MmgMesh2D::get_edges() const {
  MMG5_int na = mesh->na;
  py::array_t<int> edges({static_cast<py::ssize_t>(na), py::ssize_t{2}});
  auto buf = edges.request();
  int *ptr = static_cast<int *>(buf.ptr);

  mesh->nai = mesh->na;

  for (MMG5_int i = 0; i < na; i++) {
    MMG5_int v0, v1;
    MMG5_int ref;
    int corner, required;

    if (!MMG2D_Get_edge(mesh, &v0, &v1, &ref, &corner, &required)) {
      throw std::runtime_error("Failed to get edge at index " +
                               std::to_string(i));
    }

    ptr[i * 2] = static_cast<int>(v0 - 1);
    ptr[i * 2 + 1] = static_cast<int>(v1 - 1);
  }
  return edges;
}

py::tuple MmgMesh2D::get_edges_with_refs() const {
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

    if (!MMG2D_Get_edge(mesh, &v0, &v1, &ref, &corner, &required)) {
      throw std::runtime_error("Failed to get edge at index " +
                               std::to_string(i));
    }

    edge_ptr[i * 2] = static_cast<int>(v0 - 1);
    edge_ptr[i * 2 + 1] = static_cast<int>(v1 - 1);
    refs_ptr[i] = ref;
  }
  return py::make_tuple(edges, refs);
}

void MmgMesh2D::set_vertex(double x, double y, MMG5_int ref, MMG5_int idx) {
  if (idx < 0 || idx >= mesh->npmax) {
    throw std::runtime_error("Vertex index out of range: " +
                             std::to_string(idx));
  }
  if (!MMG2D_Set_vertex(mesh, x, y, ref, idx + 1)) {
    throw std::runtime_error("Failed to set vertex at index " +
                             std::to_string(idx));
  }
}

void MmgMesh2D::set_triangle(int v0, int v1, int v2, MMG5_int ref,
                             MMG5_int idx) {
  if (idx < 0 || idx >= mesh->ntmax) {
    throw std::runtime_error("Triangle index out of range: " +
                             std::to_string(idx));
  }
  if (!MMG2D_Set_triangle(mesh, v0 + 1, v1 + 1, v2 + 1, ref, idx + 1)) {
    throw std::runtime_error("Failed to set triangle at index " +
                             std::to_string(idx));
  }
}

void MmgMesh2D::set_quadrilateral(int v0, int v1, int v2, int v3, MMG5_int ref,
                                  MMG5_int idx) {
  if (idx < 0 || idx >= mesh->nquad) {
    throw std::runtime_error("Quadrilateral index out of range: " +
                             std::to_string(idx));
  }
  if (!MMG2D_Set_quadrilateral(mesh, v0 + 1, v1 + 1, v2 + 1, v3 + 1, ref,
                               idx + 1)) {
    throw std::runtime_error("Failed to set quadrilateral at index " +
                             std::to_string(idx));
  }
}

void MmgMesh2D::set_edge(int v0, int v1, MMG5_int ref, MMG5_int idx) {
  if (idx < 0 || idx >= mesh->namax) {
    throw std::runtime_error("Edge index out of range: " + std::to_string(idx));
  }
  if (!MMG2D_Set_edge(mesh, v0 + 1, v1 + 1, ref, idx + 1)) {
    throw std::runtime_error("Failed to set edge at index " +
                             std::to_string(idx));
  }
}

py::tuple MmgMesh2D::get_vertex(MMG5_int idx) const {
  double x, y;
  MMG5_int ref;
  int corner, required;

  if (!MMG2D_GetByIdx_vertex(mesh, &x, &y, &ref, &corner, &required, idx + 1)) {
    throw std::runtime_error("Failed to get vertex at index " +
                             std::to_string(idx));
  }

  return py::make_tuple(x, y, ref);
}

py::tuple MmgMesh2D::get_triangle(MMG5_int idx) const {
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

py::tuple MmgMesh2D::get_quadrilateral(MMG5_int idx) const {
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

py::tuple MmgMesh2D::get_edge(MMG5_int idx) const {
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

void MmgMesh2D::set_corners(const py::array_t<int> &vertex_indices) {
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
    if (!MMG2D_Set_corner(mesh, idx + 1)) {
      throw std::runtime_error("Failed to set corner at vertex index " +
                               std::to_string(idx));
    }
  }
}

void MmgMesh2D::set_required_vertices(const py::array_t<int> &vertex_indices) {
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
    if (!MMG2D_Set_requiredVertex(mesh, idx + 1)) {
      throw std::runtime_error("Failed to set required vertex at index " +
                               std::to_string(idx));
    }
  }
}

void MmgMesh2D::set_required_edges(const py::array_t<int> &edge_indices) {
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
    if (!MMG2D_Set_requiredEdge(mesh, idx + 1)) {
      throw std::runtime_error("Failed to set required edge at index " +
                               std::to_string(idx));
    }
  }
}

// Topology queries

py::array_t<int> MmgMesh2D::get_adjacent_elements(MMG5_int idx) const {
  MMG5_int mmg_idx = idx + 1;

  if (mmg_idx < 1 || mmg_idx > mesh->nt) {
    throw std::runtime_error("Element index out of range: " +
                             std::to_string(idx));
  }

  MMG5_int listri[3];
  if (!MMG2D_Get_adjaTri(mesh, mmg_idx, listri)) {
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

py::array_t<int> MmgMesh2D::get_vertex_neighbors(MMG5_int idx) const {
  MMG5_int mmg_idx = idx + 1;

  if (mmg_idx < 1 || mmg_idx > mesh->np) {
    throw std::runtime_error("Vertex index out of range: " +
                             std::to_string(idx));
  }

  // Manual implementation: iterate through triangles to find neighbors
  // since MMG2D_Get_adjaVertices requires adjacency tables that may not exist
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

double MmgMesh2D::get_element_quality(MMG5_int idx) const {
  MMG5_int mmg_idx = idx + 1;

  if (mmg_idx < 1 || mmg_idx > mesh->nt) {
    throw std::runtime_error("Element index out of range: " +
                             std::to_string(idx));
  }

  return MMG2D_Get_triangleQuality(mesh, met, mmg_idx);
}

py::array_t<double> MmgMesh2D::get_element_qualities() const {
  MMG5_int nt = mesh->nt;
  py::array_t<double> result(static_cast<py::ssize_t>(nt));
  auto buf = result.request();
  double *ptr = static_cast<double *>(buf.ptr);

  for (MMG5_int i = 0; i < nt; i++) {
    ptr[i] = MMG2D_Get_triangleQuality(mesh, met, i + 1);
  }

  return result;
}

void MmgMesh2D::set_field(const std::string &field_name,
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

  if (!MMG2D_Set_solSize(mesh, *sol_ptr, MMG5_Vertex, np,
                         get_mmg_type(field.type))) {
    throw std::runtime_error("Failed to set " + field_name + " solution size");
  }

  const double *ptr = static_cast<double *>(buf.ptr);
  bool success = false;
  switch (field.type) {
  case SolutionType::SCALAR:
    success = MMG2D_Set_scalarSols(*sol_ptr, const_cast<double *>(ptr));
    break;
  case SolutionType::VECTOR:
    success = MMG2D_Set_vectorSols(*sol_ptr, const_cast<double *>(ptr));
    break;
  case SolutionType::TENSOR:
    success = MMG2D_Set_tensorSols(*sol_ptr, const_cast<double *>(ptr));
    break;
  }

  if (!success) {
    throw std::runtime_error("Failed to set " + field_name + " values");
  }
}

py::array_t<double> MmgMesh2D::get_field(const std::string &field_name) const {
  auto field = get_solution_field(field_name);
  MMG5_int np = mesh->np;

  py::array_t<double> values({static_cast<py::ssize_t>(np),
                              static_cast<py::ssize_t>(field.components)});
  auto buf = values.request();
  double *ptr = static_cast<double *>(buf.ptr);

  bool success = false;
  switch (field.type) {
  case SolutionType::SCALAR:
    success = MMG2D_Get_scalarSols(*field.sol_ptr, ptr);
    break;
  case SolutionType::VECTOR:
    success = MMG2D_Get_vectorSols(*field.sol_ptr, ptr);
    break;
  case SolutionType::TENSOR:
    success = MMG2D_Get_tensorSols(*field.sol_ptr, ptr);
    break;
  }

  if (!success) {
    throw std::runtime_error("Failed to get " + field_name + " values");
  }

  return values;
}

py::array_t<double> MmgMesh2D::getitem(const std::string &key) const {
  return get_field(key);
}

void MmgMesh2D::setitem(const std::string &key,
                        const py::array_t<double> &value) {
  set_field(key, value);
}

void MmgMesh2D::save(
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
    ret = MMG2D_saveVtkMesh(mesh, met, fname.c_str());
  } else if (ext == ".vtu") {
    ret = MMG2D_saveVtuMesh(mesh, met, fname.c_str());
  } else {
    ret = MMG2D_saveMesh(mesh, fname.c_str());
  }

  if (!ret) {
    throw std::runtime_error("Failed to save mesh to file: " + fname);
  }
}

MmgMesh2D::SolutionField
MmgMesh2D::get_solution_field(const std::string &field_name) const {
  if (field_name == "metric") {
    return {&met, SolutionType::SCALAR, 1};
  } else if (field_name == "displacement") {
    return {&disp, SolutionType::VECTOR, 2}; // 2D displacement has 2 components
  } else if (field_name == "levelset") {
    return {&ls, SolutionType::SCALAR, 1};
  } else if (field_name == "tensor") {
    return {&met, SolutionType::TENSOR, 3}; // 2D tensor has 3 components
  }
  throw std::runtime_error("Unknown field: " + field_name);
}

int MmgMesh2D::get_mmg_type(SolutionType type) const {
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

std::string MmgMesh2D::get_file_extension(const std::string &filename) {
  size_t pos = filename.find_last_of('.');
  if (pos != std::string::npos) {
    return filename.substr(pos);
  }
  return "";
}

void MmgMesh2D::cleanup() {
  if (mesh || met || disp || ls) {
    MMG2D_Free_all(MMG5_ARG_start, MMG5_ARG_ppMesh, &mesh, MMG5_ARG_ppMet, &met,
                   MMG5_ARG_ppLs, &ls, MMG5_ARG_ppDisp, &disp, MMG5_ARG_end);
    mesh = nullptr;
    met = nullptr;
    disp = nullptr;
    ls = nullptr;
  }
}

py::dict MmgMesh2D::remesh(const py::dict &options) {
  RemeshStats before = collect_mesh_stats_2d(mesh, met);

  set_mesh_options_2D(mesh, met, options);

  // Capture stderr to collect MMG warnings
  StderrCapture capture;

  auto start = std::chrono::high_resolution_clock::now();

  int ret;
  const char *mode_name;
  if (mesh->info.lag > -1) {
    ret = MMG2D_mmg2dmov(mesh, met, disp);
    mode_name = "MMG2D_mmg2dmov (lagrangian motion)";
  } else if (mesh->info.iso || mesh->info.isosurf) {
    ret = MMG2D_mmg2dls(mesh, ls, met);
    mode_name = "MMG2D_mmg2dls (level-set discretization)";
  } else if (!mesh->nt) {
    ret = MMG2D_mmg2dmesh(mesh, met);
    mode_name = "MMG2D_mmg2dmesh (mesh generation from edges)";
  } else {
    ret = MMG2D_mmg2dlib(mesh, met);
    mode_name = "MMG2D_mmg2dlib (standard remeshing)";
  }

  auto end = std::chrono::high_resolution_clock::now();
  double duration = std::chrono::duration<double>(end - start).count();

  // Stop capture and parse warnings before potentially throwing
  std::string captured = capture.get();
  std::vector<std::string> warnings = parse_mmg_warnings(captured);

  if (ret != MMG5_SUCCESS) {
    throw std::runtime_error(std::string("Remeshing failed in ") + mode_name);
  }

  RemeshStats after = collect_mesh_stats_2d(mesh, met);

  return build_remesh_result(before, after, duration, ret, warnings);
}

py::dict MmgMesh2D::remesh_lagrangian(const py::array_t<double> &displacement,
                                      const py::dict &options) {
  RemeshStats before = collect_mesh_stats_2d(mesh, met);

  set_field("displacement", displacement);

  py::dict lag_options =
      merge_options_with_default(options, "lag", py::int_(1));
  set_mesh_options_2D(mesh, met, lag_options);

  // Capture stderr to collect MMG warnings
  StderrCapture capture;

  auto start = std::chrono::high_resolution_clock::now();
  int ret = MMG2D_mmg2dmov(mesh, met, disp);
  auto end = std::chrono::high_resolution_clock::now();
  double duration = std::chrono::duration<double>(end - start).count();

  // Stop capture and parse warnings before potentially throwing
  std::string captured = capture.get();
  std::vector<std::string> warnings = parse_mmg_warnings(captured);

  if (ret != MMG5_SUCCESS) {
    throw std::runtime_error("MMG2D Lagrangian motion remeshing failed (ret=" +
                             std::to_string(ret) + ")");
  }

  RemeshStats after = collect_mesh_stats_2d(mesh, met);

  return build_remesh_result(before, after, duration, ret, warnings);
}

py::dict MmgMesh2D::remesh_levelset(const py::array_t<double> &levelset,
                                    const py::dict &options) {
  RemeshStats before = collect_mesh_stats_2d(mesh, met);

  set_field("levelset", levelset);
  py::dict ls_options = merge_options_with_default(options, "iso", py::int_(1));
  set_mesh_options_2D(mesh, met, ls_options);

  // Capture stderr to collect MMG warnings
  StderrCapture capture;

  auto start = std::chrono::high_resolution_clock::now();
  int ret = MMG2D_mmg2dls(mesh, ls, met);
  auto end = std::chrono::high_resolution_clock::now();
  double duration = std::chrono::duration<double>(end - start).count();

  // Stop capture and parse warnings before potentially throwing
  std::string captured = capture.get();
  std::vector<std::string> warnings = parse_mmg_warnings(captured);

  if (ret != MMG5_SUCCESS) {
    throw std::runtime_error("MMG2D level-set discretization failed (ret=" +
                             std::to_string(ret) + ")");
  }

  RemeshStats after = collect_mesh_stats_2d(mesh, met);

  return build_remesh_result(before, after, duration, ret, warnings);
}
