#ifndef MMG_MESH_HPP
#define MMG_MESH_HPP

#include "mmg/mmg3d/libmmg3d.h"
#include <filesystem>
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

  void set_field(const std::string &field_name,
                 const py::array_t<double> &values);
  py::array_t<double> get_field(const std::string &field_name) const;

  // Dictionary-like interface
  py::array_t<double> getitem(const std::string &key) const;
  void setitem(const std::string &key, const py::array_t<double> &value);

  void
  save(const std::variant<std::string, std::filesystem::path> &filename) const;

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
