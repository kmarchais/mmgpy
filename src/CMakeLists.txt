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
)

# Set include directories
target_include_directories(${PROJECT_NAME}
    PRIVATE
        ${MMG_INCLUDE_DIRS}
        ${mmg_BINARY_DIR}/include
        ${mmg_SOURCE_DIR}/include
)

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

# Set the output name
set_target_properties(${PROJECT_NAME} PROPERTIES
    OUTPUT_NAME "_${PROJECT_NAME}"
    PREFIX ""
    SUFFIX "${PYTHON_MODULE_EXTENSION}"
)

# Install the Python module
install(TARGETS ${PROJECT_NAME} DESTINATION ${PROJECT_NAME})
install(FILES "${CMAKE_CURRENT_BINARY_DIR}/${PROJECT_NAME}/_version.py" DESTINATION ${PROJECT_NAME})

# SKBUILD_SCRIPTS_DIR is defined by scikit-build
# But if we run cmake directly, we need to define it
if(NOT DEFINED SKBUILD_SCRIPTS_DIR)
    set(SKBUILD_SCRIPTS_DIR "${CMAKE_INSTALL_PREFIX}/bin")
endif()

if(WIN32)  # Windows-specific installation
    # Get list of VTK modules from MMG's dependencies
    get_property(vtk_libs TARGET mmgs PROPERTY INTERFACE_LINK_LIBRARIES)
    message(STATUS "VTK libs: ${vtk_libs}")

    if(CMAKE_BUILD_TYPE)
        set(MMG_EXE_DIR "${mmg_BINARY_DIR}/bin/${CMAKE_BUILD_TYPE}")
    else()
        set(MMG_EXE_DIR "${mmg_BINARY_DIR}/bin/Release")
    endif()

    # Install MMG shared libraries to the package directory
    install(TARGETS libmmg2d_so libmmg3d_so libmmgs_so
            DESTINATION ${PROJECT_NAME})

    # Install MMG shared libraries to scripts directory for executables
    install(TARGETS libmmg2d_so libmmg3d_so libmmgs_so
            DESTINATION "${SKBUILD_SCRIPTS_DIR}")

    # Install executables if not skipped
    if(NOT MMGPY_SKIP_EXECUTABLES)
        install(FILES
            "${MMG_EXE_DIR}/mmg2d.exe"
            "${MMG_EXE_DIR}/mmg3d.exe"
            "${MMG_EXE_DIR}/mmgs.exe"
            DESTINATION "${SKBUILD_SCRIPTS_DIR}"
        )
    endif()
else()  # Unix-specific installation
    # Define the rpath prefix based on platform
    if(APPLE)
        set(RPATH_PREFIX "@loader_path")
    else() # Linux
        set(RPATH_PREFIX "$ORIGIN")
    endif()

    # Set RPATH for Python module
    set_target_properties(${PROJECT_NAME} PROPERTIES
        INSTALL_RPATH "${RPATH_PREFIX}/lib"
        BUILD_WITH_INSTALL_RPATH TRUE
        SKIP_BUILD_RPATH FALSE
    )

    # Skip installing executables if requested (e.g., for wheel builds)
    if(NOT MMGPY_SKIP_EXECUTABLES)
        foreach(exe mmg2d mmg3d mmgs)
            # Set RPATH for executables - use a simpler relative path
            if(APPLE)
                set_target_properties(${exe} PROPERTIES
                    INSTALL_RPATH "@executable_path/../lib/python${Python_VERSION_MAJOR}.${Python_VERSION_MINOR}/site-packages/${PROJECT_NAME}/lib;@executable_path/../${PROJECT_NAME}/lib"
                    BUILD_WITH_INSTALL_RPATH TRUE
                    SKIP_BUILD_RPATH FALSE
                )
            else()
                set_target_properties(${exe} PROPERTIES
                    INSTALL_RPATH "${RPATH_PREFIX}/../lib/python${Python_VERSION_MAJOR}.${Python_VERSION_MINOR}/site-packages/${PROJECT_NAME}/lib"
                    BUILD_WITH_INSTALL_RPATH TRUE
                    SKIP_BUILD_RPATH FALSE
                )
            endif()

            # Install executable
            install(TARGETS ${exe}
                DESTINATION "${SKBUILD_SCRIPTS_DIR}"
                RENAME "${exe}_O3"
                PERMISSIONS OWNER_READ OWNER_WRITE OWNER_EXECUTE
                        GROUP_READ GROUP_EXECUTE
                        WORLD_READ WORLD_EXECUTE
            )
        endforeach()
    endif()

    # Install shared libraries
    install(TARGETS libmmg2d_so libmmg3d_so libmmgs_so
            DESTINATION ${PROJECT_NAME}/lib)
endif()
