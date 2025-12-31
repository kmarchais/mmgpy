#include "mmg_mesh.hpp"
#include <stdexcept>

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
  py::array_t<double> vertices({np, 3});
  auto buf = vertices.request();
  double *ptr = static_cast<double *>(buf.ptr);

  mesh->npi = mesh->np;

  for (MMG5_int i = 0; i < np; i++) {
    double x, y, z;
    MMG5_int ref;
    int corner, required;

    if (!MMG3D_Get_vertex(mesh, &x, &y, &z, &ref, &corner, &required)) {
      throw std::runtime_error("Failed to get vertex");
    }

    ptr[i * 3] = x;
    ptr[i * 3 + 1] = y;
    ptr[i * 3 + 2] = z;
  }
  return vertices;
}

py::array_t<int> MmgMesh::get_elements() const {
  MMG5_int ne = mesh->ne;
  py::array_t<int> elements({ne, 4});
  auto buf = elements.request();
  int *ptr = static_cast<int *>(buf.ptr);

  mesh->nti = mesh->nt;

  for (MMG5_int i = 0; i < ne; i++) {
    int v1, v2, v3, v4;
    MMG5_int ref;
    int required;

    if (!MMG3D_Get_tetrahedron(mesh, &v1, &v2, &v3, &v4, &ref, &required)) {
      throw std::runtime_error("Failed to get tetrahedron");
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

  py::array_t<double> values({np, field.components});
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
  py::buffer_info vert_buf = vertices.request();

  if (vert_buf.ndim != 2 || vert_buf.shape[1] != 3) {
    throw std::runtime_error("Vertices must be an Nx3 array");
  }

  const double *vert_ptr = static_cast<double *>(vert_buf.ptr);
  MMG5_int nvert = vert_buf.shape[0];

  // Validate refs array if provided
  const MMG5_int *refs_ptr = nullptr;
  if (refs.has_value()) {
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
  py::buffer_info elem_buf = tetrahedra.request();

  if (elem_buf.ndim != 2 || elem_buf.shape[1] != 4) {
    throw std::runtime_error("Tetrahedra must be an Nx4 array");
  }

  const int *elem_ptr = static_cast<int *>(elem_buf.ptr);
  MMG5_int nelem = elem_buf.shape[0];

  // Validate refs array if provided
  const MMG5_int *refs_ptr = nullptr;
  if (refs.has_value()) {
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
  py::buffer_info tri_buf = triangles.request();

  if (tri_buf.ndim != 2 || tri_buf.shape[1] != 3) {
    throw std::runtime_error("Triangles must be an Nx3 array");
  }

  const int *tri_ptr = static_cast<int *>(tri_buf.ptr);
  MMG5_int ntri = tri_buf.shape[0];

  // Validate refs array if provided
  const MMG5_int *refs_ptr = nullptr;
  if (refs.has_value()) {
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
  py::buffer_info edge_buf = edges.request();

  if (edge_buf.ndim != 2 || edge_buf.shape[1] != 2) {
    throw std::runtime_error("Edges must be an Nx2 array");
  }

  const int *edge_ptr = static_cast<int *>(edge_buf.ptr);
  MMG5_int nedge = edge_buf.shape[0];

  // Validate refs array if provided
  const MMG5_int *refs_ptr = nullptr;
  if (refs.has_value()) {
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
  py::array_t<double> vertices({np, static_cast<MMG5_int>(3)});
  py::array_t<MMG5_int> refs(np);

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
      throw std::runtime_error("Failed to get vertex");
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
  py::array_t<int> triangles({nt, static_cast<MMG5_int>(3)});
  auto buf = triangles.request();
  int *ptr = static_cast<int *>(buf.ptr);

  mesh->nti = mesh->nt;

  for (MMG5_int i = 0; i < nt; i++) {
    int v1, v2, v3;
    MMG5_int ref;
    int required;

    if (!MMG3D_Get_triangle(mesh, &v1, &v2, &v3, &ref, &required)) {
      throw std::runtime_error("Failed to get triangle");
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
  py::array_t<int> triangles({nt, static_cast<MMG5_int>(3)});
  py::array_t<MMG5_int> refs(nt);

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
      throw std::runtime_error("Failed to get triangle");
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
  py::array_t<int> elements({ne, static_cast<MMG5_int>(4)});
  py::array_t<MMG5_int> refs(ne);

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
      throw std::runtime_error("Failed to get tetrahedron");
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
  py::array_t<int> edges({na, static_cast<MMG5_int>(2)});
  auto buf = edges.request();
  int *ptr = static_cast<int *>(buf.ptr);

  mesh->nai = mesh->na;

  for (MMG5_int i = 0; i < na; i++) {
    MMG5_int v1, v2;
    MMG5_int ref;
    int corner, required;

    if (!MMG3D_Get_edge(mesh, &v1, &v2, &ref, &corner, &required)) {
      throw std::runtime_error("Failed to get edge");
    }

    // Convert from 1-based MMG indexing to 0-based Python indexing
    ptr[i * 2] = static_cast<int>(v1 - 1);
    ptr[i * 2 + 1] = static_cast<int>(v2 - 1);
  }
  return edges;
}

py::tuple MmgMesh::get_edges_with_refs() const {
  MMG5_int na = mesh->na;
  py::array_t<int> edges({na, static_cast<MMG5_int>(2)});
  py::array_t<MMG5_int> refs(na);

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
      throw std::runtime_error("Failed to get edge");
    }

    // Convert from 1-based MMG indexing to 0-based Python indexing
    edge_ptr[i * 2] = static_cast<int>(v1 - 1);
    edge_ptr[i * 2 + 1] = static_cast<int>(v2 - 1);
    refs_ptr[i] = ref;
  }
  return py::make_tuple(edges, refs);
}
