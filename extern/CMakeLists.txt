cmake_minimum_required(VERSION 3.15)

include(FetchContent)

set(Commons_GIT_TAG "master" CACHE STRING "Commons version to build")
set(Commons_REPOSITORY "https://github.com/ISCDtoolbox/Commons" CACHE STRING "Commons repository URL")

set(LinearElasticity_GIT_TAG "v1.0.0" CACHE STRING "LinearElasticity version to build")
set(LinearElasticity_REPOSITORY "https://github.com/ISCDtoolbox/LinearElasticity" CACHE STRING "LinearElasticity repository URL")

set(MMG_GIT_TAG "v5.8.0" CACHE STRING "MMG version to build")
set(MMG_REPOSITORY "https://github.com/MmgTools/mmg.git" CACHE STRING "MMG repository URL")

# First fetch and build Commons
FetchContent_Declare(
    Commons
    GIT_REPOSITORY ${Commons_REPOSITORY}
    GIT_TAG ${Commons_GIT_TAG}
)

# Configure Commons build options
set(BUILD_SHARED_LIBS ON CACHE BOOL "Build shared libraries" FORCE)
set(CMAKE_POSITION_INDEPENDENT_CODE ON CACHE BOOL "Position independent code" FORCE)

# Make Commons available and get properties
FetchContent_MakeAvailable(Commons)
FetchContent_GetProperties(Commons)

# Set the Commons paths for other dependencies
set(Commons_BINARY_DIR ${commons_BINARY_DIR} CACHE PATH "Path to Commons binary directory")
set(Commons_SOURCE_DIR ${commons_SOURCE_DIR} CACHE PATH "Path to Commons source directory")
set(Commons_LIBRARIES Commons CACHE INTERNAL "")

FetchContent_Declare(
    LinearElasticity
    GIT_REPOSITORY ${LinearElasticity_REPOSITORY}
    GIT_TAG ${LinearElasticity_GIT_TAG}
)

set(BUILD_SHARED_LIBS ON CACHE BOOL "Build shared libraries" FORCE)
set(CMAKE_POSITION_INDEPENDENT_CODE ON CACHE BOOL "Position independent code" FORCE)

FetchContent_MakeAvailable(LinearElasticity)
FetchContent_GetProperties(LinearElasticity)

set(LinearElasticity_BINARY_DIR ${linearelasticity_BINARY_DIR} CACHE PATH "Path to LinearElasticity binary directory")
set(LinearElasticity_LIBRARIES
    Elas
    CACHE INTERNAL ""
)
set(LinearElasticity_INCLUDE_DIRS
    ${LinearElasticity_SOURCE_DIR}/sources
    CACHE INTERNAL ""
)

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

set(USE_VTK ON CACHE BOOL "Use VTK" FORCE)

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
