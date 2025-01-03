include(FetchContent)

set(Commons_GIT_TAG "v1.0.0" CACHE STRING "Commons version to build")
set(Commons_REPOSITORY "https://github.com/ISCDtoolbox/Commons" CACHE STRING "Commons repository URL")

# Fetch and build Commons
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

install(TARGETS Commons
    EXPORT CommonsTargets
    LIBRARY DESTINATION ${PROJECT_NAME}/lib
    ARCHIVE DESTINATION ${PROJECT_NAME}/lib
    RUNTIME DESTINATION ${PROJECT_NAME}/bin
)

# Install the export set
install(EXPORT CommonsTargets
    FILE CommonsTargets.cmake
    DESTINATION ${PROJECT_NAME}/lib/cmake/commons
)
