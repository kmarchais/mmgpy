#ifndef MMG_MESH_HPP
#define MMG_MESH_HPP

#include "mmg/mmg3d/libmmg3d.h"
#include <filesystem>
#include <optional>
#include <pybind11/numpy.h>
#include <pybind11/pybind11.h>
#include <string>
#include <variant>

namespace py = pybind11;

class MmgMesh {
public:
  MmgMesh();
  MmgMesh(const py::array_t<double> &vertices,
          const py::array_t<int> &elements);
  explicit MmgMesh(
      const std::variant<std::string, std::filesystem::path> &filename);
  ~MmgMesh();

  void set_vertices_and_elements(const py::array_t<double> &vertices,
                                 const py::array_t<int> &elements);
  py::array_t<double> get_vertices() const;
  py::array_t<int> get_elements() const;

  // Low-level mesh construction API (Phase 1 of Issue #50)
  void set_mesh_size(MMG5_int vertices, MMG5_int tetrahedra, MMG5_int prisms,
                     MMG5_int triangles, MMG5_int quadrilaterals,
                     MMG5_int edges);
  py::tuple get_mesh_size() const;

  // Bulk setters with optional reference arrays
  void
  set_vertices(const py::array_t<double> &vertices,
               const std::optional<py::array_t<MMG5_int>> &refs = std::nullopt);
  void set_tetrahedra(
      const py::array_t<int> &tetrahedra,
      const std::optional<py::array_t<MMG5_int>> &refs = std::nullopt);
  void set_triangles(
      const py::array_t<int> &triangles,
      const std::optional<py::array_t<MMG5_int>> &refs = std::nullopt);
  void
  set_edges(const py::array_t<int> &edges,
            const std::optional<py::array_t<MMG5_int>> &refs = std::nullopt);

  // Bulk getters
  py::tuple get_vertices_with_refs() const;
  py::array_t<int> get_tetrahedra() const; // Alias for get_elements()
  py::array_t<int> get_triangles() const;
  py::tuple get_triangles_with_refs() const;
  py::tuple get_elements_with_refs() const;
  py::tuple
  get_tetrahedra_with_refs() const; // Alias for get_elements_with_refs()
  py::array_t<int> get_edges() const;
  py::tuple get_edges_with_refs() const;

  // Phase 2: Single element operations
  void set_vertex(double x, double y, double z, MMG5_int ref, MMG5_int idx);
  void set_tetrahedron(int v0, int v1, int v2, int v3, MMG5_int ref,
                       MMG5_int idx);
  void set_triangle(int v0, int v1, int v2, MMG5_int ref, MMG5_int idx);
  void set_edge(int v0, int v1, MMG5_int ref, MMG5_int idx);
  py::tuple get_vertex(MMG5_int idx) const;
  py::tuple get_tetrahedron(MMG5_int idx) const;
  py::tuple get_triangle(MMG5_int idx) const;
  py::tuple get_edge(MMG5_int idx) const;

  // Element attributes
  void set_corners(const py::array_t<int> &vertex_indices);
  void set_required_vertices(const py::array_t<int> &vertex_indices);
  void set_ridge_edges(const py::array_t<int> &edge_indices);

  // Topology queries
  py::array_t<int> get_adjacent_elements(MMG5_int idx) const;
  py::array_t<int> get_vertex_neighbors(MMG5_int idx) const;
  double get_element_quality(MMG5_int idx) const;
  py::array_t<double> get_element_qualities() const;

  // Phase 3: Advanced element types (prisms and quadrilaterals)
  void set_prism(int v0, int v1, int v2, int v3, int v4, int v5, MMG5_int ref,
                 MMG5_int idx);
  void set_quadrilateral(int v0, int v1, int v2, int v3, MMG5_int ref,
                         MMG5_int idx);
  void
  set_prisms(const py::array_t<int> &prisms,
             const std::optional<py::array_t<MMG5_int>> &refs = std::nullopt);
  void set_quadrilaterals(
      const py::array_t<int> &quads,
      const std::optional<py::array_t<MMG5_int>> &refs = std::nullopt);
  py::tuple get_prism(MMG5_int idx) const;
  py::tuple get_quadrilateral(MMG5_int idx) const;
  py::array_t<int> get_prisms() const;
  py::tuple get_prisms_with_refs() const;
  py::array_t<int> get_quadrilaterals() const;
  py::tuple get_quadrilaterals_with_refs() const;

  void set_field(const std::string &field_name,
                 const py::array_t<double> &values);
  py::array_t<double> get_field(const std::string &field_name) const;

  // Dictionary-like interface
  py::array_t<double> getitem(const std::string &key) const;
  void setitem(const std::string &key, const py::array_t<double> &value);

  void
  save(const std::variant<std::string, std::filesystem::path> &filename) const;

  // In-memory remeshing
  py::dict remesh(const py::dict &options = py::dict());
  py::dict remesh_lagrangian(const py::array_t<double> &displacement,
                             const py::dict &options = py::dict());
  py::dict remesh_levelset(const py::array_t<double> &levelset,
                           const py::dict &options = py::dict());

  // Delete copy constructor and assignment operator
  MmgMesh(const MmgMesh &) = delete;
  MmgMesh &operator=(const MmgMesh &) = delete;

private:
  MMG5_pMesh mesh;
  MMG5_pSol met;
  MMG5_pSol disp;
  MMG5_pSol ls;

  enum class SolutionType { SCALAR, VECTOR, TENSOR };

  struct SolutionField {
    const MMG5_pSol *sol_ptr;
    SolutionType type;
    int components;
  };

  SolutionField get_solution_field(const std::string &field_name) const;
  int get_mmg_type(SolutionType type) const;
  static std::string get_file_extension(const std::string &filename);
  void cleanup();
};

#endif // MMG_MESH_HPP
