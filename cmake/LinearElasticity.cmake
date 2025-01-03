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

FetchContent_Declare(
   LinearElasticity
   GIT_REPOSITORY ${LinearElasticity_REPOSITORY}
   GIT_TAG ${LinearElasticity_GIT_TAG}
)

FetchContent_MakeAvailable(LinearElasticity)
FetchContent_GetProperties(LinearElasticity)

set(LinearElasticity_BINARY_DIR ${linearelasticity_BINARY_DIR} CACHE PATH "Path to LinearElasticity binary directory")
set(LinearElasticity_LIBRARIES Elas CACHE INTERNAL "")
set(LinearElasticity_INCLUDE_DIRS ${LinearElasticity_SOURCE_DIR}/sources CACHE INTERNAL "")

# Set RPATH for ELAS target
if(TARGET Elas)
   set_target_properties(Elas PROPERTIES
       INSTALL_RPATH "$ORIGIN"
       BUILD_WITH_INSTALL_RPATH TRUE
   )
endif()

# Add export set
install(TARGETS Elas
   EXPORT ElasTargets
   LIBRARY DESTINATION ${PROJECT_NAME}/lib
   ARCHIVE DESTINATION ${PROJECT_NAME}/lib
   RUNTIME DESTINATION ${PROJECT_NAME}/bin
)

# Install the export set
install(EXPORT ElasTargets
   FILE ElasTargets.cmake
   DESTINATION ${PROJECT_NAME}/lib/cmake/elas
)
