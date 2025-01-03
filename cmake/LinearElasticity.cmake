include(FetchContent)

set(LinearElasticity_GIT_TAG "v1.0.0" CACHE STRING "LinearElasticity version to build")
set(LinearElasticity_REPOSITORY "https://github.com/ISCDtoolbox/LinearElasticity" CACHE STRING "LinearElasticity repository URL")

# Configure LinearElasticity build options
set(BUILD_SHARED_LIBS ON CACHE BOOL "Build shared libraries" FORCE)
set(CMAKE_POSITION_INDEPENDENT_CODE ON CACHE BOOL "Position independent code" FORCE)

# Set proper RPATH
if(APPLE)
    set(CMAKE_INSTALL_RPATH "@loader_path")
else()
    set(CMAKE_INSTALL_RPATH "$ORIGIN")
endif()

# Fetch LinearElasticity
FetchContent_Declare(
    LinearElasticity
    GIT_REPOSITORY ${LinearElasticity_REPOSITORY}
    GIT_TAG ${LinearElasticity_GIT_TAG}
)

# Make LinearElasticity available
FetchContent_MakeAvailable(LinearElasticity)
FetchContent_GetProperties(LinearElasticity)

# Set target properties
if(TARGET Elas)
    set_target_properties(Elas PROPERTIES
        INSTALL_RPATH "$ORIGIN"
        BUILD_WITH_INSTALL_RPATH TRUE
        INSTALL_NAME_DIR "@rpath"
    )
endif()

# Define ELAS paths for MMG to find
set(ELAS_INCLUDE_DIR ${linearelasticity_SOURCE_DIR}/sources CACHE PATH "Path to Elas headers")
set(ELAS_LIBRARY ${linearelasticity_BINARY_DIR}/libElas.so CACHE FILEPATH "Path to Elas library")
set(ELAS_DIR ${linearelasticity_BINARY_DIR} CACHE PATH "Path to Elas build directory")

# Export variables for the main project
set(LinearElasticity_BINARY_DIR ${linearelasticity_BINARY_DIR} CACHE PATH "Path to LinearElasticity binary directory")
set(LinearElasticity_LIBRARIES ${ELAS_LIBRARY} CACHE INTERNAL "")
set(LinearElasticity_INCLUDE_DIRS ${ELAS_INCLUDE_DIR} CACHE INTERNAL "")

# Add install rules
install(FILES ${ELAS_LIBRARY}
    DESTINATION ${PROJECT_NAME}/lib
)
