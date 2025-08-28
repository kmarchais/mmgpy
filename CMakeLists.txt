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

# Fix RPATH for MMG libraries to find VTK libraries on Linux
if(UNIX AND NOT APPLE)
    install(CODE "
        message(STATUS \"Fixing RPATH for MMG libraries on Linux...\")

        # Find MMG libraries in the install directory
        set(MMG_LIB_DIR \"\${CMAKE_INSTALL_PREFIX}/mmgpy/lib\")
        file(GLOB MMG_LIBS \"\${MMG_LIB_DIR}/libmmg*.so*\")

        foreach(mmg_lib \${MMG_LIBS})
            if(EXISTS \"\${mmg_lib}\")
                get_filename_component(lib_name \"\${mmg_lib}\" NAME)
                message(STATUS \"Setting RPATH for MMG library: \${lib_name}\")

                # Set RPATH to look in the same directory (where VTK libs are installed)
                execute_process(
                    COMMAND patchelf --set-rpath \"\\\$ORIGIN\" \"\${mmg_lib}\"
                    ERROR_VARIABLE PATCHELF_ERROR
                    RESULT_VARIABLE PATCHELF_RESULT
                )

                if(PATCHELF_RESULT)
                    message(WARNING \"patchelf failed for \${lib_name}: \${PATCHELF_ERROR}\")
                else()
                    message(STATUS \"Successfully set RPATH for \${lib_name}\")
                endif()
            endif()
        endforeach()
    ")
endif()

# Handle installation of executables if not skipped
if(NOT MMGPY_SKIP_EXECUTABLES)
    # For development installs, install to site-packages/bin and create symlinks
    # For wheel builds, install to site-packages/bin
    set(SCRIPTS_DIR "bin")

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
            DESTINATION "${SCRIPTS_DIR}"
            USE_SOURCE_PERMISSIONS
            FILES_MATCHING PATTERN "mmg*"
            PATTERN "genheader" EXCLUDE
        )

        # Set the correct RPATH for MMG executables after installation
        if(UNIX)
            if(APPLE)
                set(RPATH_PREFIX "@loader_path")
            else() # Linux
                set(RPATH_PREFIX "$ORIGIN")
            endif()

            # Use install CODE to fix RPATH after the executables are installed
            install(CODE "
                message(STATUS \"Fixing RPATH for MMG executables...\")

                # Define the executable install directory
                set(EXEC_DIR \"\${CMAKE_INSTALL_PREFIX}/${SCRIPTS_DIR}\")
                message(STATUS \"Looking for executables in: \${EXEC_DIR}\")

                # Find all MMG executables
                file(GLOB EXECS \"\${EXEC_DIR}/mmg*\")
                message(STATUS \"Found executables: \${EXECS}\")

                foreach(exec \${EXECS})
                    if(EXISTS \"\${exec}\")
                        get_filename_component(exec_name \"\${exec}\" NAME)
                        message(STATUS \"Setting RPATH for \${exec_name}\")

                        # Executables are in site-packages/bin/, libraries in site-packages/mmgpy/lib/
                        set(LIB_RPATH \"${RPATH_PREFIX}/../mmgpy/lib\")
                        message(STATUS \"Target RPATH: \${LIB_RPATH}\")

                        if(APPLE)
                            # First, check current RPATH
                            execute_process(
                                COMMAND otool -l \"\${exec}\"
                                OUTPUT_VARIABLE OTOOL_OUTPUT
                                ERROR_VARIABLE OTOOL_ERROR
                                RESULT_VARIABLE OTOOL_RESULT
                            )
                            if(OTOOL_RESULT)
                                message(WARNING \"otool failed for \${exec_name}: \${OTOOL_ERROR}\")
                            endif()

                            # Try to remove any existing @rpath entries (may fail if none exist)
                            execute_process(
                                COMMAND install_name_tool -delete_rpath \"@rpath\" \"\${exec}\"
                                ERROR_VARIABLE DELETE_ERROR
                                RESULT_VARIABLE DELETE_RESULT
                            )

                            # Add the correct RPATH - this is the critical step
                            execute_process(
                                COMMAND install_name_tool -add_rpath \"\${LIB_RPATH}\" \"\${exec}\"
                                ERROR_VARIABLE ADD_ERROR
                                RESULT_VARIABLE ADD_RESULT
                            )

                            if(ADD_RESULT)
                                message(WARNING \"Failed to add RPATH for \${exec_name}: \${ADD_ERROR}\")
                            else()
                                message(STATUS \"Successfully set RPATH for \${exec_name}\")

                                # Verify the RPATH was set correctly
                                execute_process(
                                    COMMAND otool -l \"\${exec}\"
                                    OUTPUT_VARIABLE VERIFY_OUTPUT
                                )
                                if(\"\${VERIFY_OUTPUT}\" MATCHES \"\${LIB_RPATH}\")
                                    message(STATUS \"RPATH verification successful for \${exec_name}\")
                                else()
                                    message(WARNING \"RPATH verification failed for \${exec_name}\")
                                endif()
                            endif()
                        else()
                            execute_process(
                                COMMAND patchelf --set-rpath \"\${LIB_RPATH}\" \"\${exec}\"
                                ERROR_VARIABLE PATCHELF_ERROR
                                RESULT_VARIABLE PATCHELF_RESULT
                            )
                            if(PATCHELF_RESULT)
                                message(WARNING \"patchelf failed for \${exec_name}: \${PATCHELF_ERROR}\")
                            else()
                                message(STATUS \"Successfully set RPATH for \${exec_name}\")
                            endif()
                        endif()
                    endif()
                endforeach()
            ")

            # Backup RPATH fix using Python utility (fallback mechanism)
            install(CODE "
                message(STATUS \"Running backup RPATH fix utility...\")
                execute_process(
                    COMMAND \"\${Python_EXECUTABLE}\" -c \"
try:
    import mmgpy
    mmgpy._fix_rpath()
    print('Backup RPATH fix completed successfully')
except Exception as e:
    print(f'Backup RPATH fix failed: {e}')
\"
                    ERROR_VARIABLE BACKUP_ERROR
                    RESULT_VARIABLE BACKUP_RESULT
                )
                if(BACKUP_RESULT)
                    message(STATUS \"Backup RPATH fix had issues: \${BACKUP_ERROR}\")
                else()
                    message(STATUS \"Backup RPATH fix completed\")
                endif()
            ")
        endif()
    endif()

    # For development installs, create symlinks in the virtual environment
    # We always create symlinks for easier access during development
    install(CODE "
            # Find the Python site-packages directory where executables are installed
            execute_process(
                COMMAND \"\${Python_EXECUTABLE}\" -c \"import site; print(site.getsitepackages()[0])\"
                OUTPUT_VARIABLE SITE_PACKAGES_DIR
                OUTPUT_STRIP_TRAILING_WHITESPACE
            )

            # Find virtual environment bin directory
            execute_process(
                COMMAND \"\${Python_EXECUTABLE}\" -c \"import sys; import os; print(os.path.join(sys.prefix, 'bin'))\"
                OUTPUT_VARIABLE VENV_BIN_DIR
                OUTPUT_STRIP_TRAILING_WHITESPACE
            )

            if(EXISTS \"\${SITE_PACKAGES_DIR}/bin\" AND EXISTS \"\${VENV_BIN_DIR}\")
                file(GLOB SITE_EXECS \"\${SITE_PACKAGES_DIR}/bin/mmg*\")
                foreach(exec \${SITE_EXECS})
                    get_filename_component(exec_name \"\${exec}\" NAME)
                    set(symlink_path \"\${VENV_BIN_DIR}/\${exec_name}\")

                    # Remove existing symlink if it exists
                    if(EXISTS \"\${symlink_path}\")
                        file(REMOVE \"\${symlink_path}\")
                    endif()

                    # Create symlink
                    execute_process(
                        COMMAND ln -sf \"\${exec}\" \"\${symlink_path}\"
                        RESULT_VARIABLE symlink_result
                    )

                    if(symlink_result EQUAL 0)
                        message(STATUS \"Created symlink: \${symlink_path} -> \${exec}\")
                    else()
                        message(WARNING \"Failed to create symlink: \${symlink_path}\")
                    endif()
                endforeach()
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
