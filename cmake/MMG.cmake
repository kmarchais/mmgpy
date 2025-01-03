include(FetchContent)

set(MMG_GIT_TAG "v5.8.0" CACHE STRING "MMG version to build")
set(MMG_REPOSITORY "https://github.com/MmgTools/mmg.git" CACHE STRING "MMG repository URL")

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
set(USE_ELAS ON CACHE BOOL "Use ELAS" FORCE)

# Set Elas directory for MMG to find it
set(ELAS_DIR ${LinearElasticity_BINARY_DIR} CACHE PATH "Path to Elas installation")
set(ELAS_INCLUDE_DIR ${LinearElasticity_SOURCE_DIR}/sources CACHE PATH "Path to Elas headers")
set(ELAS_LIBRARY ${LinearElasticity_BINARY_DIR}/libElas.so CACHE FILEPATH "Path to Elas library")

# Make MMG available
FetchContent_MakeAvailable(mmg)

# Add dependencies and linking
foreach(lib libmmg2d_so libmmg3d_so libmmgs_so)
    if(TARGET ${lib})
        target_link_libraries(${lib} PUBLIC Elas Commons)
    endif()
endforeach()

# For executables
foreach(exe mmg2d mmg3d mmgs)
    if(TARGET ${exe})
        target_link_libraries(${exe} PUBLIC ${MMG_LIBRARIES} Elas Commons)
        set_target_properties(${exe} PROPERTIES
            INSTALL_RPATH "$ORIGIN:$ORIGIN/../lib/python${Python_VERSION_MAJOR}.${Python_VERSION_MINOR}/site-packages/${PROJECT_NAME}/lib"
            BUILD_WITH_INSTALL_RPATH TRUE
            SKIP_BUILD_RPATH FALSE
        )
    endif()
endforeach()

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

# Add dependencies
add_dependencies(libmmg2d_so Elas Commons)
add_dependencies(libmmg3d_so Elas Commons)
add_dependencies(libmmgs_so Elas Commons)
