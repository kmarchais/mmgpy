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

find_package(Python COMPONENTS Interpreter Development REQUIRED)

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
add_subdirectory(extern)

add_subdirectory(src)

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
