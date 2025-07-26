cmake_minimum_required(VERSION 3.15)

# Set CMP0177 policy
if(POLICY CMP0177)
    cmake_policy(SET CMP0177 NEW)
endif()

# Read version from pyproject.toml
file(READ "${CMAKE_CURRENT_SOURCE_DIR}/pyproject.toml" PYPROJECT_CONTENT)
string(REGEX MATCH "version = \"([0-9]+\\.[0-9]+\\.[0-9]+([.][0-9]+)?)\"" _ ${PYPROJECT_CONTENT})

if(NOT CMAKE_MATCH_1)
    message(FATAL_ERROR "Could not find version in pyproject.toml")
endif()

set(MMGPY_VERSION ${CMAKE_MATCH_1})
project(mmgpy VERSION ${MMGPY_VERSION})

# Find Python - let scikit-build-core handle it in wheel builds
if(DEFINED SKBUILD)
    # scikit-build-core provides Python info automatically
    find_package(Python COMPONENTS Interpreter Development.Module REQUIRED)
else()
    find_package(Python COMPONENTS Interpreter Development REQUIRED)
endif()

find_package(pybind11 QUIET)

if(NOT pybind11_FOUND)
    message(STATUS "pybind11 not found in system, trying to locate it via Python...")
    execute_process(
        COMMAND "${Python_EXECUTABLE}" -c "import pybind11; print(pybind11.get_cmake_dir())"
        OUTPUT_VARIABLE PYBIND11_CMAKE_DIR
        OUTPUT_STRIP_TRAILING_WHITESPACE
        RESULT_VARIABLE PYBIND11_RESULT
    )

    if(PYBIND11_RESULT EQUAL 0)
        message(STATUS "Found pybind11 via Python at: ${PYBIND11_CMAKE_DIR}")
        list(APPEND CMAKE_PREFIX_PATH "${PYBIND11_CMAKE_DIR}")
        find_package(pybind11 REQUIRED)
    else()
        message(FATAL_ERROR "Could not find pybind11. Please install it with: pip install pybind11")
    endif()
endif()

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# Build external dependencies (MMG)
# Don't use EXCLUDE_FROM_ALL if we want executables to be built
if(MMGPY_SKIP_EXECUTABLES)
    add_subdirectory(extern EXCLUDE_FROM_ALL)
else()
    add_subdirectory(extern)
endif()

add_subdirectory(src)

# Install the MMG libraries to the correct location for each platform
if(WIN32)
    # On Windows, install DLLs and LIBs right next to the .pyd module
    install(TARGETS libmmg2d_so libmmg3d_so libmmgs_so
        RUNTIME DESTINATION mmgpy  # This is for DLLs
        LIBRARY DESTINATION mmgpy  # This is for module libraries
        ARCHIVE DESTINATION mmgpy  # This is for .lib import libraries
    )
else() # UNIX
    # On Unix, install .so files to a 'lib' subdirectory inside the package
    install(TARGETS libmmg2d_so libmmg3d_so libmmgs_so
        LIBRARY DESTINATION mmgpy/lib
    )
endif()

# Handle installation of executables if not skipped
if(NOT MMGPY_SKIP_EXECUTABLES)
    # SKBUILD_SCRIPTS_DIR is defined by scikit-build
    if(NOT DEFINED SKBUILD_SCRIPTS_DIR)
        set(SKBUILD_SCRIPTS_DIR "${CMAKE_INSTALL_PREFIX}/bin")
    endif()

    # Check if executables exist and install them
    # Use file-based installation since target existence varies
    if(CMAKE_BUILD_TYPE STREQUAL "Release")
        set(MMG_EXE_SUFFIX "_O3")
    elseif(CMAKE_BUILD_TYPE STREQUAL "Debug")
        set(MMG_EXE_SUFFIX "_debug")
    elseif(CMAKE_BUILD_TYPE STREQUAL "RelWithDebInfo")
        set(MMG_EXE_SUFFIX "_O3d")
    elseif(CMAKE_BUILD_TYPE STREQUAL "MinSizeRel")
        set(MMG_EXE_SUFFIX "_Os")
    else()
        set(MMG_EXE_SUFFIX "")
    endif()

    # Install executables if they are built (files in build directory)
    if(EXISTS "${mmg_BINARY_DIR}/bin")
        install(DIRECTORY "${mmg_BINARY_DIR}/bin/"
            DESTINATION "${SKBUILD_SCRIPTS_DIR}"
            USE_SOURCE_PERMISSIONS
            FILES_MATCHING PATTERN "mmg*"
            PATTERN "genheader" EXCLUDE
        )
    endif()
    
    # On Windows, also copy the DLLs to the scripts dir for the executables
    if(WIN32)
        install(TARGETS libmmg2d_so libmmg3d_so libmmgs_so
            RUNTIME DESTINATION "${SKBUILD_SCRIPTS_DIR}"
        )
    endif()
endif()

option(BUILD_TESTING "Build tests" ON)
if(BUILD_TESTING)
    enable_testing()
    add_subdirectory(tests)
endif()

include(GNUInstallDirs)

install(
    DIRECTORY "${CMAKE_CURRENT_SOURCE_DIR}/src/mmgpy/"
    DESTINATION "${Python_SITEARCH}/mmgpy"
    FILES_MATCHING PATTERN "*.py"
)

install(
    TARGETS mmgpy
    LIBRARY DESTINATION "${Python_SITEARCH}/mmgpy"
)

message(STATUS "")
message(STATUS "MMGpy configuration summary:")
message(STATUS "  Python executable: ${Python_EXECUTABLE}")
message(STATUS "  Python version: ${Python_VERSION}")
message(STATUS "  Install path: ${Python_SITEARCH}/mmgpy")
message(STATUS "")
