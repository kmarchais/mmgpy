#include <pybind11/pybind11.h>
#include <pybind11/stl.h>
#include "mmg/mmg3d/libmmg3d.h"

namespace py = pybind11;

class MMG3DMesh {
 private:
    MMG5_pMesh mesh;
    MMG5_pSol sol;
    MMG5_pSol met;

 public:
    MMG3DMesh() {
        // Initialize mesh and solution structures
        MMG3D_Init_mesh(MMG5_ARG_start,
                        MMG5_ARG_ppMesh, &mesh,
                        MMG5_ARG_ppMet, &met,
                        MMG5_ARG_end);
    }

    ~MMG3DMesh() {
        // Free the mesh structure
        MMG3D_Free_all(MMG5_ARG_start,
                       MMG5_ARG_ppMesh, &mesh,
                       MMG5_ARG_ppMet, &met,
                       MMG5_ARG_end);
    }

    bool load_mesh(const std::string& filename) {
        return MMG3D_loadMesh(mesh, filename.c_str()) > 0;
    }

    bool load_sol(const std::string& filename) {
        return MMG3D_loadSol(mesh, met, filename.c_str()) > 0;
    }

    bool set_option(const std::string& option, double val) {
        if (option == "hmin")
            mesh->info.hmin = val;
        else if (option == "hmax")
            mesh->info.hmax = val;
        else if (option == "hausd")
            mesh->info.hausd = val;
        else
            return false;
        return true;
    }

    bool remesh() {
        return MMG3D_mmg3dlib(mesh, met) == MMG5_SUCCESS;
    }

    bool save_mesh(const std::string& filename) {
        return MMG3D_saveMesh(mesh, filename.c_str()) > 0;
    }

    bool save_sol(const std::string& filename) {
        return MMG3D_saveSol(mesh, met, filename.c_str()) > 0;
    }
};

PYBIND11_MODULE(_core, m) {
    m.doc() = "Python bindings for MMG3D mesh modification library";

    py::class_<MMG3DMesh>(m, "MMG3DMesh")
        .def(py::init<>())
        .def("load_mesh", &MMG3DMesh::load_mesh, "Load a mesh from a file")
        .def("load_sol", &MMG3DMesh::load_sol, "Load a solution from a file")
        .def("set_option", &MMG3DMesh::set_option, "Set a meshing option")
        .def("remesh", &MMG3DMesh::remesh, "Perform remeshing")
        .def("save_mesh", &MMG3DMesh::save_mesh, "Save the mesh to a file")
        .def("save_sol", &MMG3DMesh::save_sol, "Save the solution to a file");

    m.def("version", []() {
        return MMG_VERSION_RELEASE;
    }, "Get MMG version");
}
