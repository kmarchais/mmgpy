# src/CMakeLists.txt

cmake_minimum_required(VERSION 3.15)

configure_file(
    "${CMAKE_CURRENT_SOURCE_DIR}/${PROJECT_NAME}/_version.py.in"
    "${CMAKE_CURRENT_BINARY_DIR}/${PROJECT_NAME}/_version.py"
    @ONLY
)

pybind11_add_module(${PROJECT_NAME}
    bindings/mmg_common.cpp
    bindings/mmgs.cpp
    bindings/mmg3d.cpp
    bindings/mmg2d.cpp
    bindings/bindings.cpp
    bindings/mmg_mesh.cpp
    bindings/mmg_mesh_2d.cpp
    bindings/mmg_mesh_s.cpp
)

# Set include directories
target_include_directories(${PROJECT_NAME} PRIVATE ${MMG_INCLUDE_DIRS})
if(NOT MMGPY_CONDA_BUILD)
    target_include_directories(${PROJECT_NAME}
        PRIVATE
            ${mmg_BINARY_DIR}/include
            ${mmg_SOURCE_DIR}/include
    )
endif()

# Link against MMG libraries
target_link_libraries(${PROJECT_NAME}
    PRIVATE
        ${MMG_LIBRARIES}
)

# Handle compiler warnings
if(MSVC)
    target_compile_options(${PROJECT_NAME} PRIVATE /W4)
else()
    target_compile_options(${PROJECT_NAME} PRIVATE -Wall -Wextra -Wpedantic)
endif()

# Set the output name and Python module extension
set_target_properties(${PROJECT_NAME} PROPERTIES
    OUTPUT_NAME "_${PROJECT_NAME}"
    PREFIX ""
    SUFFIX "${PYTHON_MODULE_EXTENSION}"
)

# For Unix, set the RPATH so the module can find its .so dependencies in a 'lib' subdir
# Skip for conda builds — conda manages RPATH automatically
if(UNIX AND NOT MMGPY_CONDA_BUILD)
    if(APPLE)
        set(RPATH_PREFIX "@loader_path")
    else() # Linux
        set(RPATH_PREFIX "$ORIGIN")
    endif()
    set_target_properties(${PROJECT_NAME} PROPERTIES
        INSTALL_RPATH "${RPATH_PREFIX}/lib"
    )
endif()

# Install the Python module and its version file
# Conda: install directly to site-packages; Wheel: relative path for scikit-build-core
if(MMGPY_CONDA_BUILD)
    set(MMGPY_INSTALL_DIR "${Python_SITEARCH}/${PROJECT_NAME}")
else()
    set(MMGPY_INSTALL_DIR "${PROJECT_NAME}")
endif()

install(TARGETS ${PROJECT_NAME} DESTINATION "${MMGPY_INSTALL_DIR}")
install(FILES "${CMAKE_CURRENT_BINARY_DIR}/${PROJECT_NAME}/_version.py" DESTINATION "${MMGPY_INSTALL_DIR}")
