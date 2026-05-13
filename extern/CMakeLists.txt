cmake_minimum_required(VERSION 3.15)

include(FetchContent)

# MMG version is set from pyproject.toml via parent CMakeLists.txt
# This provides a fallback default if called standalone
if(NOT DEFINED MMG_GIT_TAG)
    set(MMG_GIT_TAG "v5.8.0" CACHE STRING "MMG version to build")
endif()
set(MMG_REPOSITORY "https://github.com/MmgTools/mmg.git" CACHE STRING "MMG repository URL")
message(STATUS "Building MMG version: ${MMG_GIT_TAG}")

# Fetch MMG
FetchContent_Declare(
    mmg
    GIT_REPOSITORY ${MMG_REPOSITORY}
    GIT_TAG ${MMG_GIT_TAG}
)

# Configure MMG build options before making it available
set(BUILD_SHARED_LIBS ON CACHE BOOL "Build shared libraries" FORCE)
set(BUILD_TESTING OFF CACHE BOOL "Disable MMG testing" FORCE)
set(BUILD_MMG ON CACHE BOOL "Build all MMG libraries" FORCE)
set(BUILD_MMG2D ON CACHE BOOL "Build MMG2D library" FORCE)
set(BUILD_MMG3D ON CACHE BOOL "Build MMG3D library" FORCE)
set(BUILD_MMGS ON CACHE BOOL "Build MMGS library" FORCE)
set(LIBMMG2D_SHARED ON CACHE BOOL "Build MMG2D shared library" FORCE)
set(LIBMMG3D_SHARED ON CACHE BOOL "Build MMG3D shared library" FORCE)
set(LIBMMGS_SHARED ON CACHE BOOL "Build MMGS shared library" FORCE)
set(LIBMMG2D_STATIC OFF CACHE BOOL "Do not build static libraries" FORCE)
set(LIBMMG3D_STATIC OFF CACHE BOOL "Do not build static libraries" FORCE)
set(LIBMMGS_STATIC OFF CACHE BOOL "Do not build static libraries" FORCE)

# Force executable building by enabling all BUILD options
# MMG builds executables automatically when these are ON
set(BUILD_MMG ON CACHE BOOL "Build all MMG components" FORCE)
set(BUILD_MMG2D ON CACHE BOOL "Build MMG2D library and executable" FORCE)
set(BUILD_MMG3D ON CACHE BOOL "Build MMG3D library and executable" FORCE)
set(BUILD_MMGS ON CACHE BOOL "Build MMGS library and executable" FORCE)

set(USE_VTK OFF CACHE BOOL "Do not use VTK — I/O handled in Python via meshio" FORCE)
set(USE_ELAS OFF CACHE BOOL "Do not use ELAS" FORCE)

# Make MMG available
FetchContent_MakeAvailable(mmg)

# Work around two missing exports in MMG v5.8.0 on Windows:
#   - MMGS_Get_triangleQuality: public header drops LIBMMGS_EXPORT.
#   - MMGS_analys: declared only in libmmgs_private.h, no export macro.
# On POSIX both have default ELF visibility; on Windows only
# __declspec(dllexport) symbols escape the DLL. WINDOWS_EXPORT_ALL_SYMBOLS
# generates a .def file listing every extern symbol from the object files,
# so both become callable from mmgpy. See issue #218.
# https://cmake.org/cmake/help/latest/prop_tgt/WINDOWS_EXPORT_ALL_SYMBOLS.html
if(WIN32)
    set_target_properties(libmmgs_so PROPERTIES WINDOWS_EXPORT_ALL_SYMBOLS ON)
endif()

# Set the correct library targets
set(MMG_LIBRARIES
    libmmg2d_so
    libmmg3d_so
    libmmgs_so
    CACHE INTERNAL ""
)

# Export MMG include directories
set(MMG_INCLUDE_DIRS
    ${mmg_SOURCE_DIR}/src/common
    ${mmg_SOURCE_DIR}/src/mmg2d
    ${mmg_SOURCE_DIR}/src/mmg3d
    ${mmg_SOURCE_DIR}/src/mmgs
    ${mmg_BINARY_DIR}/src/common
    ${mmg_BINARY_DIR}/include/mmg/common
    ${mmg_BINARY_DIR}/include/mmg/mmg2d
    ${mmg_BINARY_DIR}/include/mmg/mmg3d
    ${mmg_BINARY_DIR}/include/mmg/mmgs
    CACHE INTERNAL ""
)
