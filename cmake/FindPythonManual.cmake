cmake_minimum_required(VERSION 3.15)

# Helper function to find Python paths using Python itself
function(find_python_details)
    execute_process(
        COMMAND ${Python_EXECUTABLE} -c "import sys, os, sysconfig;print(';'.join([str(x) for x in [sys.executable, sysconfig.get_config_var('LIBDIR'), sysconfig.get_config_var('LIBRARY'), sysconfig.get_path('include'), sysconfig.get_config_var('LDLIBRARY')]]))"
        OUTPUT_VARIABLE python_info
        OUTPUT_STRIP_TRAILING_WHITESPACE
    )

    list(GET python_info 0 PYTHON_EXECUTABLE)
    list(GET python_info 1 PYTHON_LIBDIR)
    list(GET python_info 2 PYTHON_LIBRARY_NAME)
    list(GET python_info 3 PYTHON_INCLUDE_DIR)
    list(GET python_info 4 PYTHON_LDLIBRARY)

    message(STATUS "Python executable: ${PYTHON_EXECUTABLE}")
    message(STATUS "Python lib dir: ${PYTHON_LIBDIR}")
    message(STATUS "Python library name: ${PYTHON_LIBRARY_NAME}")
    message(STATUS "Python include dir: ${PYTHON_INCLUDE_DIR}")
    message(STATUS "Python dynamic library: ${PYTHON_LDLIBRARY}")

    # Try to find the actual library file
    find_library(PYTHON_LIBRARY
        NAMES "${PYTHON_LDLIBRARY}"
        PATHS "${PYTHON_LIBDIR}"
              "${PYTHON_LIBDIR}/python${Python_VERSION_MAJOR}.${Python_VERSION_MINOR}/config"
              "/opt/_internal/cpython-${Python_VERSION_MAJOR}.${Python_VERSION_MINOR}.${Python_VERSION_PATCH}/lib"
        NO_DEFAULT_PATH
    )

    if(NOT PYTHON_LIBRARY)
        # If we can't find the shared library, try to find any Python library
        execute_process(
            COMMAND find /opt -name "libpython${Python_VERSION_MAJOR}.${Python_VERSION_MINOR}*.so*"
            OUTPUT_VARIABLE found_libraries
            OUTPUT_STRIP_TRAILING_WHITESPACE
        )
        message(STATUS "Found Python libraries: ${found_libraries}")

        if(found_libraries)
            string(REPLACE "\n" ";" found_libraries_list "${found_libraries}")
            list(GET found_libraries_list 0 PYTHON_LIBRARY)
        endif()
    endif()

    message(STATUS "Found Python Library: ${PYTHON_LIBRARY}")
    set(Python_LIBRARY ${PYTHON_LIBRARY} PARENT_SCOPE)
    set(Python_INCLUDE_DIR ${PYTHON_INCLUDE_DIR} PARENT_SCOPE)
endfunction()

# First try normal find_package
find_package(Python COMPONENTS Interpreter Development)

if(NOT Python_FOUND)
    message(STATUS "Standard find_package failed, trying manual detection...")
    # Find the Python interpreter first
    find_program(Python_EXECUTABLE python)

    if(Python_EXECUTABLE)
        # Get Python version
        execute_process(
            COMMAND ${Python_EXECUTABLE} -c "import sys; print(f'{sys.version_info[0]}.{sys.version_info[1]}.{sys.version_info[2]}')"
            OUTPUT_VARIABLE Python_VERSION
            OUTPUT_STRIP_TRAILING_WHITESPACE
        )

        # Parse version components
        string(REPLACE "." ";" version_list ${Python_VERSION})
        list(GET version_list 0 Python_VERSION_MAJOR)
        list(GET version_list 1 Python_VERSION_MINOR)
        list(GET version_list 2 Python_VERSION_PATCH)

        # Try to find Python details
        find_python_details()

        if(Python_LIBRARY AND Python_INCLUDE_DIR)
            set(Python_Development_FOUND TRUE)
            set(Python_FOUND TRUE)
            message(STATUS "Successfully found Python manually!")
        else()
            message(FATAL_ERROR "Could not find Python Development components even with manual detection")
        endif()
    else()
        message(FATAL_ERROR "Could not find Python interpreter")
    endif()
endif()
