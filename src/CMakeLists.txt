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
if(MMGPY_USE_SYSTEM_MMG)
    # Imported targets carry their own include directories
else()
    target_include_directories(${PROJECT_NAME}
        PRIVATE
            ${MMG_INCLUDE_DIRS}
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
if(MMGPY_CONDA_BUILD)
    # Conda: install directly to site-packages (no wheel staging)
    install(TARGETS ${PROJECT_NAME} DESTINATION "${Python_SITEARCH}/${PROJECT_NAME}")
    install(FILES "${CMAKE_CURRENT_BINARY_DIR}/${PROJECT_NAME}/_version.py" DESTINATION "${Python_SITEARCH}/${PROJECT_NAME}")
else()
    # Wheel: install to relative path (scikit-build-core staging area)
    install(TARGETS ${PROJECT_NAME} DESTINATION ${PROJECT_NAME})
    install(FILES "${CMAKE_CURRENT_BINARY_DIR}/${PROJECT_NAME}/_version.py" DESTINATION ${PROJECT_NAME})
endif()
