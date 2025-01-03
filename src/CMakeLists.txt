cmake_minimum_required(VERSION 3.15)
project(mmgpy VERSION 0.1.2.0)

configure_file(
    "${CMAKE_CURRENT_SOURCE_DIR}/${PROJECT_NAME}/_version.py.in"
    "${CMAKE_CURRENT_BINARY_DIR}/${PROJECT_NAME}/_version.py"
    @ONLY
)

pybind11_add_module(${PROJECT_NAME}
    bindings/mmgs.cpp
    bindings/mmg3d.cpp
    bindings/mmg2d.cpp
    bindings/bindings.cpp
)

# Set include directories
target_include_directories(${PROJECT_NAME}
    PRIVATE
        ${MMG_INCLUDE_DIRS}
        ${mmg_BINARY_DIR}/include
        ${mmg_SOURCE_DIR}/include
        ${LinearElasticity_INCLUDE_DIRS}
)

# Link against MMG libraries
target_link_libraries(${PROJECT_NAME}
    PRIVATE
        ${MMG_LIBRARIES}
        ${LinearElasticity_LIBRARIES}
        ${Commons_LIBRARIES}
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
    if(CMAKE_BUILD_TYPE)
        set(MMG_EXE_DIR "${mmg_BINARY_DIR}/bin/${CMAKE_BUILD_TYPE}")
    else()
        set(MMG_EXE_DIR "${mmg_BINARY_DIR}/bin/Release")
    endif()

    install(TARGETS libmmg2d_so libmmg3d_so libmmgs_so
            DESTINATION ${PROJECT_NAME})
    install(TARGETS libmmg2d_so libmmg3d_so libmmgs_so
            DESTINATION "${SKBUILD_SCRIPTS_DIR}")
    install(FILES
        "${MMG_EXE_DIR}/mmg2d.exe"
        "${MMG_EXE_DIR}/mmg3d.exe"
        "${MMG_EXE_DIR}/mmgs.exe"
        DESTINATION "${SKBUILD_SCRIPTS_DIR}"
    )
else()  # Unix-specific installation
    # Define the rpath prefix based on platform
    if(APPLE)
        set(RPATH_PREFIX "@loader_path")
    else() # Linux
        set(RPATH_PREFIX "$ORIGIN")
    endif()

    # Install ELAS and Commons shared libraries
    install(FILES
        "${LinearElasticity_BINARY_DIR}/libElas.so"
        "${Commons_BINARY_DIR}/libCommons.so"
        DESTINATION ${PROJECT_NAME}/lib)

    # Set RPATH for Python module
    set_target_properties(${PROJECT_NAME} PROPERTIES
        INSTALL_RPATH "${RPATH_PREFIX}/lib"
        BUILD_WITH_INSTALL_RPATH TRUE
        SKIP_BUILD_RPATH FALSE
    )

    foreach(exe mmg2d mmg3d mmgs)
        # Set RPATH for executables
        set_target_properties(${exe} PROPERTIES
            INSTALL_RPATH "${RPATH_PREFIX}:${RPATH_PREFIX}/../lib/python${Python_VERSION_MAJOR}.${Python_VERSION_MINOR}/site-packages/${PROJECT_NAME}/lib"
            BUILD_WITH_INSTALL_RPATH TRUE
            SKIP_BUILD_RPATH FALSE
        )

        # Add ELAS library to executable link dependencies
        target_link_libraries(${exe} PRIVATE ${LinearElasticity_LIBRARIES} ${Commons_LIBRARIES})

        # Install executable
        install(TARGETS ${exe}
            DESTINATION "${SKBUILD_SCRIPTS_DIR}"
            RENAME "${exe}_O3"
            PERMISSIONS OWNER_READ OWNER_WRITE OWNER_EXECUTE
                    GROUP_READ GROUP_EXECUTE
                    WORLD_READ WORLD_EXECUTE
        )
    endforeach()

    # Install shared libraries
    install(TARGETS libmmg2d_so libmmg3d_so libmmgs_so
            DESTINATION ${PROJECT_NAME}/lib)
endif()
