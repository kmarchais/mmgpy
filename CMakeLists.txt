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

# Read VTK version from pyproject.toml [tool.mmgpy] section
string(REGEX MATCH "vtk_version = \"([0-9]+\\.[0-9]+\\.[0-9]+)\"" _ ${PYPROJECT_CONTENT})
if(CMAKE_MATCH_1)
    set(VTK_VERSION_FROM_TOML ${CMAKE_MATCH_1})
    message(STATUS "VTK version from pyproject.toml: ${VTK_VERSION_FROM_TOML}")
endif()

# Extract numeric version for CMake project() which doesn't support suffixes
string(REGEX MATCH "([0-9]+\\.[0-9]+\\.[0-9]+([.][0-9]+)?)" _ ${MMGPY_VERSION})
set(MMGPY_NUMERIC_VERSION ${CMAKE_MATCH_1})

project(mmgpy VERSION ${MMGPY_NUMERIC_VERSION})

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

# Set MMG version from pyproject.toml for extern/CMakeLists.txt
set(MMG_GIT_TAG "v${MMG_VERSION_FROM_TOML}" CACHE STRING "MMG version to build")

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

# Install VTK libraries if available
if(VTK_DIR OR ENV{VTK_DIR})
    message(STATUS "Installing VTK libraries for wheel...")

    # Find VTK library directory
    # Try common VTK library locations for both macOS and Linux
    set(VTK_LIB_SEARCH_PATHS
        "${VTK_DIR}/../../../lib"
        "${VTK_DIR}/../../../lib64"
        "${VTK_DIR}/../../lib"
        "${VTK_DIR}/../../lib64"
        "${VTK_DIR}/../lib"
        "${VTK_DIR}/../lib64"
        "/tmp/vtk/lib"
        "/tmp/vtk/lib64"
        "/tmp/lib"
        "/tmp/lib64"
    )

    foreach(search_path ${VTK_LIB_SEARCH_PATHS})
        if(EXISTS "${search_path}" AND IS_DIRECTORY "${search_path}")
            # Search for both .so and .dylib files
            file(GLOB VTK_LIBS_SO "${search_path}/libvtk*.so*")
            file(GLOB VTK_LIBS_DYLIB "${search_path}/libvtk*.dylib*")
            set(VTK_LIBS ${VTK_LIBS_SO} ${VTK_LIBS_DYLIB})
            if(VTK_LIBS)
                set(VTK_LIB_DIR "${search_path}")
                break()
            endif()
        endif()
    endforeach()

    if(VTK_LIB_DIR AND VTK_LIBS)
        message(STATUS "Found VTK libraries in: ${VTK_LIB_DIR}")
        list(LENGTH VTK_LIBS VTK_LIBS_COUNT)
        message(STATUS "Installing ${VTK_LIBS_COUNT} VTK libraries to wheel...")

        if(WIN32)
            install(FILES ${VTK_LIBS} DESTINATION mmgpy)
        else()
            install(FILES ${VTK_LIBS} DESTINATION mmgpy/lib)
        endif()
    else()
        message(WARNING "VTK libraries not found for wheel installation. VTK may not work in the built wheel.")
    endif()
endif()

# RPATH Configuration
# ===================
# Strategy: Set RPATH at install time so binaries can find shared libraries.
# - Python module (_mmgpy): looks in ./lib for MMG libraries
# - MMG libraries (libmmg*.so): look in same dir ($ORIGIN) for VTK libraries
# - MMG executables (mmg*_O3): look in ../mmgpy/lib for all libraries
#
# This is handled entirely by CMake; no Python fallback is needed.

# Fix RPATH for MMG libraries on Linux to find VTK libraries
if(UNIX AND NOT APPLE)
    install(CODE "
        set(MMG_LIB_DIR \"\${CMAKE_INSTALL_PREFIX}/mmgpy/lib\")
        file(GLOB MMG_LIBS \"\${MMG_LIB_DIR}/libmmg*.so*\")
        foreach(mmg_lib \${MMG_LIBS})
            if(EXISTS \"\${mmg_lib}\")
                get_filename_component(lib_name \"\${mmg_lib}\" NAME)
                execute_process(
                    COMMAND patchelf --set-rpath \"\\\$ORIGIN\" \"\${mmg_lib}\"
                    ERROR_VARIABLE PATCHELF_ERROR
                    RESULT_VARIABLE PATCHELF_RESULT
                )
                if(PATCHELF_RESULT)
                    message(WARNING \"Failed to set RPATH for \${lib_name}: \${PATCHELF_ERROR}\")
                else()
                    message(STATUS \"Set RPATH for \${lib_name}\")
                endif()
            endif()
        endforeach()
    ")
endif()

# Handle installation of executables if not skipped
if(NOT MMGPY_SKIP_EXECUTABLES)
    # Install executables to mmgpy/bin/ so they're included in the wheel
    # This location:
    # 1. Gets included in the wheel (part of the package directory)
    # 2. Has simple RPATH (../lib points to mmgpy/lib)
    # 3. Works for both wheel and dev installs
    set(SCRIPTS_DIR "mmgpy/bin")
    message(STATUS "Installing executables to ${SCRIPTS_DIR}")

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
