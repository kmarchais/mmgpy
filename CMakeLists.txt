cmake_minimum_required(VERSION 3.15)

# Set CMP0177 policy
if(POLICY CMP0177)
    cmake_policy(SET CMP0177 NEW)
endif()

# Read version from pyproject.toml
file(READ "${CMAKE_CURRENT_SOURCE_DIR}/pyproject.toml" PYPROJECT_CONTENT)
string(REGEX MATCH "version = \"([0-9]+\\.[0-9]+\\.[0-9]+([.][0-9]+)?([.a-zA-Z0-9]+)?)\"" _ ${PYPROJECT_CONTENT})

if(NOT CMAKE_MATCH_1)
    message(FATAL_ERROR "Could not find version in pyproject.toml")
endif()

set(MMGPY_VERSION ${CMAKE_MATCH_1})

# Read MMG version from pyproject.toml [tool.mmgpy] section
string(REGEX MATCH "mmg_version = \"([0-9]+\\.[0-9]+\\.[0-9]+)\"" _ ${PYPROJECT_CONTENT})
if(CMAKE_MATCH_1)
    set(MMG_VERSION_FROM_TOML ${CMAKE_MATCH_1})
    message(STATUS "MMG version from pyproject.toml: ${MMG_VERSION_FROM_TOML}")
else()
    message(FATAL_ERROR "Could not find mmg_version in pyproject.toml")
endif()

# Extract numeric version for CMake project() which doesn't support suffixes
string(REGEX MATCH "([0-9]+\\.[0-9]+\\.[0-9]+([.][0-9]+)?)" _ ${MMGPY_VERSION})
set(MMGPY_NUMERIC_VERSION ${CMAKE_MATCH_1})

project(mmgpy VERSION ${MMGPY_NUMERIC_VERSION})

option(MMGPY_CONDA_BUILD "Building for conda-forge (use system MMG, skip wheel-specific bundling/RPATH)" OFF)

# Prevent Windows.h from defining min/max macros (conflicts with VTK 9.6 headers)
if(MSVC)
    add_definitions(-DNOMINMAX)
endif()

include(GNUInstallDirs)

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

if(MMGPY_CONDA_BUILD)
    # Find MMG libraries directly instead of using find_package(mmg), which
    # would pull in VTK and all its transitive dependencies via mmgConfig.cmake.
    # We only need the MMG shared libraries and headers for the pybind11 bindings.
    find_library(MMG2D_LIBRARY NAMES mmg2d REQUIRED)
    find_library(MMG3D_LIBRARY NAMES mmg3d REQUIRED)
    find_library(MMGS_LIBRARY NAMES mmgs REQUIRED)
    find_path(MMG_INCLUDE_DIR mmg/mmg3d/libmmg3d.h REQUIRED)

    set(MMG_LIBRARIES ${MMG2D_LIBRARY} ${MMG3D_LIBRARY} ${MMGS_LIBRARY} CACHE INTERNAL "")
    set(MMG_INCLUDE_DIRS ${MMG_INCLUDE_DIR} CACHE INTERNAL "")
    message(STATUS "Using system MMG: ${MMG_LIBRARIES}")
else()
    # Build MMG from source via FetchContent
    # Use our fork's progress-callback branch instead of the release tag
    set(MMG_GIT_TAG "feature/progress-callback" CACHE STRING "MMG version to build" FORCE)

    if(MMGPY_SKIP_EXECUTABLES)
        add_subdirectory(extern EXCLUDE_FROM_ALL)
    else()
        add_subdirectory(extern)
    endif()
endif()

add_subdirectory(src)

# Install the MMG libraries to the correct location (wheel builds only)
# Conda builds use system MMG — libraries are already installed.
if(NOT MMGPY_CONDA_BUILD)
    if(WIN32)
        install(TARGETS libmmg2d_so libmmg3d_so libmmgs_so
            RUNTIME DESTINATION mmgpy
            LIBRARY DESTINATION mmgpy
            ARCHIVE DESTINATION mmgpy
        )
    else() # UNIX
        install(TARGETS libmmg2d_so libmmg3d_so libmmgs_so
            LIBRARY DESTINATION mmgpy/lib
        )
    endif()
endif()

# RPATH Configuration
# ===================
# Strategy: Set RPATH at install time so binaries can find shared libraries.
# - Python module (_mmgpy): looks in ./lib for MMG libraries
# - MMG executables (mmg*_O3): look in ../mmgpy/lib for all libraries
#
# VTK C++ libraries are no longer bundled — format conversion is handled
# in Python via meshio.  Only MMG shared libraries need RPATH fixup.

# Handle installation of executables (wheel builds only)
# Conda builds use system MMG — executables are already installed.
if(NOT MMGPY_SKIP_EXECUTABLES AND NOT MMGPY_CONDA_BUILD)
    set(SCRIPTS_DIR "mmgpy/bin")
    message(STATUS "Installing executables to ${SCRIPTS_DIR}")

    # Install executables from MMG build directory
    # Note: We don't use if(EXISTS) here because the directory is created during build,
    # not during configure. The OPTIONAL keyword handles missing files gracefully.
    install(DIRECTORY "${mmg_BINARY_DIR}/bin/"
        DESTINATION "${SCRIPTS_DIR}"
        USE_SOURCE_PERMISSIONS
        OPTIONAL
        FILES_MATCHING PATTERN "mmg*"
        PATTERN "genheader" EXCLUDE
    )

    # Set RPATH for MMG executables (mmgpy/bin/ -> mmgpy/lib/)
    if(UNIX)
        if(APPLE)
            set(RPATH_PREFIX "@loader_path")
        else()
            set(RPATH_PREFIX "$ORIGIN")
        endif()

        install(CODE "
            set(EXEC_DIR \"\${CMAKE_INSTALL_PREFIX}/${SCRIPTS_DIR}\")
            file(GLOB EXECS \"\${EXEC_DIR}/mmg*\")
            set(LIB_RPATH \"${RPATH_PREFIX}/../lib\")

            foreach(exec \${EXECS})
                if(EXISTS \"\${exec}\")
                    get_filename_component(exec_name \"\${exec}\" NAME)

                    if(APPLE)
                        # Remove old @rpath (ignore failure if none exists)
                        execute_process(
                            COMMAND install_name_tool -delete_rpath \"@rpath\" \"\${exec}\"
                            ERROR_QUIET
                        )
                        # Add correct RPATH
                        execute_process(
                            COMMAND install_name_tool -add_rpath \"\${LIB_RPATH}\" \"\${exec}\"
                            ERROR_VARIABLE ADD_ERROR
                            RESULT_VARIABLE ADD_RESULT
                        )
                        if(ADD_RESULT)
                            message(WARNING \"Failed to set RPATH for \${exec_name}: \${ADD_ERROR}\")
                        else()
                            message(STATUS \"Set RPATH for \${exec_name}\")
                        endif()
                    else()
                        execute_process(
                            COMMAND patchelf --set-rpath \"\${LIB_RPATH}\" \"\${exec}\"
                            ERROR_VARIABLE PATCHELF_ERROR
                            RESULT_VARIABLE PATCHELF_RESULT
                        )
                        if(PATCHELF_RESULT)
                            message(WARNING \"Failed to set RPATH for \${exec_name}: \${PATCHELF_ERROR}\")
                        else()
                            message(STATUS \"Set RPATH for \${exec_name}\")
                        endif()
                    endif()
                endif()
            endforeach()
        ")
    endif()

    # For development installs, create symlinks (Unix) or copies (Windows) in the venv
    install(CODE "
        # Find virtual environment bin directory (bin on Unix, Scripts on Windows)
        execute_process(
            COMMAND \"\${Python_EXECUTABLE}\" -c \"import sys; import os; bin_name = 'Scripts' if sys.platform == 'win32' else 'bin'; print(os.path.join(sys.prefix, bin_name))\"
            OUTPUT_VARIABLE VENV_BIN_DIR
            OUTPUT_STRIP_TRAILING_WHITESPACE
        )

        # For editable installs, executables are in CMAKE_INSTALL_PREFIX/mmgpy/bin
        # For wheel installs, they go to site-packages/mmgpy/bin
        set(EXEC_SOURCE_DIR \"\${CMAKE_INSTALL_PREFIX}/${SCRIPTS_DIR}\")

        if(EXISTS \"\${EXEC_SOURCE_DIR}\" AND EXISTS \"\${VENV_BIN_DIR}\")
            file(GLOB SOURCE_EXECS \"\${EXEC_SOURCE_DIR}/mmg*\")
            foreach(exec \${SOURCE_EXECS})
                get_filename_component(exec_name \"\${exec}\" NAME)
                set(target_path \"\${VENV_BIN_DIR}/\${exec_name}\")

                # Remove existing file if it exists
                if(EXISTS \"\${target_path}\")
                    file(REMOVE \"\${target_path}\")
                endif()

                # On Windows, copy the file; on Unix, create symlink
                if(WIN32)
                    file(COPY \"\${exec}\" DESTINATION \"\${VENV_BIN_DIR}\")
                    message(STATUS \"Copied: \${exec} -> \${target_path}\")
                else()
                    execute_process(
                        COMMAND ln -sf \"\${exec}\" \"\${target_path}\"
                        RESULT_VARIABLE symlink_result
                    )
                    if(symlink_result EQUAL 0)
                        message(STATUS \"Created symlink: \${target_path} -> \${exec}\")
                    else()
                        message(WARNING \"Failed to create symlink: \${target_path}\")
                    endif()
                endif()
            endforeach()
        else()
            message(STATUS \"Skipping venv bin symlinks: source=\${EXEC_SOURCE_DIR} venv=\${VENV_BIN_DIR}\")
        endif()
    ")

    # On Windows, also copy the DLLs to the scripts dir for the executables
    if(WIN32)
        install(TARGETS libmmg2d_so libmmg3d_so libmmgs_so
            RUNTIME DESTINATION "${SCRIPTS_DIR}"
        )
    endif()
endif()

option(BUILD_TESTING "Build tests" ON)
if(BUILD_TESTING)
    enable_testing()
    add_subdirectory(tests)
endif()

# Conda: install Python source files to site-packages.
# (src/CMakeLists.txt already installs the extension module and _version.py;
#  for wheel builds, scikit-build-core auto-discovers .py files from src/.)
if(MMGPY_CONDA_BUILD)
    install(
        DIRECTORY "${CMAKE_CURRENT_SOURCE_DIR}/src/mmgpy/"
        DESTINATION "${Python_SITEARCH}/mmgpy"
        FILES_MATCHING PATTERN "*.py"
    )
endif()

message(STATUS "")
message(STATUS "MMGpy configuration summary:")
message(STATUS "  Python executable: ${Python_EXECUTABLE}")
message(STATUS "  Python version: ${Python_VERSION}")
message(STATUS "  Install path: ${Python_SITEARCH}/mmgpy")
message(STATUS "")
