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

set(USE_VTK ON CACHE BOOL "Use VTK" FORCE)
set(USE_ELAS OFF CACHE BOOL "Do not use ELAS" FORCE)

# Make MMG available
FetchContent_MakeAvailable(mmg)

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
