cmake_minimum_required(VERSION 3.15)
# Create the core binding module
pybind11_add_module(mmgpy
    bindings/mmgs.cpp
    bindings/mmg3d.cpp
    bindings/mmg2d.cpp
    bindings/bindings.cpp
)
# Set include directories
target_include_directories(mmgpy
    PRIVATE
        ${MMG_INCLUDE_DIRS}
        ${mmg_BINARY_DIR}/include
        ${mmg_SOURCE_DIR}/include
)
# Link against MMG libraries
target_link_libraries(mmgpy
    PRIVATE
        ${MMG_LIBRARIES}
)
# Handle compiler warnings
if(MSVC)
    target_compile_options(mmgpy PRIVATE /W4)
else()
    target_compile_options(mmgpy PRIVATE -Wall -Wextra -Wpedantic)
endif()
# Set the output name
set_target_properties(mmgpy PROPERTIES
    OUTPUT_NAME "_mmgpy"
    PREFIX ""
    SUFFIX "${PYTHON_MODULE_EXTENSION}"
)

if(UNIX)
    # Set RPATH settings
    set_target_properties(mmgpy PROPERTIES
        INSTALL_RPATH "$ORIGIN"
        BUILD_WITH_INSTALL_RPATH TRUE
        SKIP_BUILD_RPATH FALSE
    )
endif()

# Install the Python module
install(TARGETS mmgpy DESTINATION mmgpy)

if(WIN32)
    # Windows-specific installation
    if(CMAKE_BUILD_TYPE)
        set(MMG_EXE_DIR "${mmg_BINARY_DIR}/bin/${CMAKE_BUILD_TYPE}")
    else()
        set(MMG_EXE_DIR "${mmg_BINARY_DIR}/bin/Release")
    endif()
    
    install(TARGETS libmmg2d_so libmmg3d_so libmmgs_so 
            DESTINATION mmgpy)
    install(TARGETS libmmg2d_so libmmg3d_so libmmgs_so 
            DESTINATION "${SKBUILD_SCRIPTS_DIR}")
    install(FILES
        "${MMG_EXE_DIR}/mmg2d.exe"
        "${MMG_EXE_DIR}/mmg3d.exe"
        "${MMG_EXE_DIR}/mmgs.exe"
        DESTINATION "${SKBUILD_SCRIPTS_DIR}"
    )
else()
    # Set RPATH settings for Python module
    set_target_properties(mmgpy PROPERTIES
        INSTALL_RPATH "$ORIGIN"
        BUILD_WITH_INSTALL_RPATH TRUE
        SKIP_BUILD_RPATH FALSE
    )

    # Install libraries
    install(TARGETS libmmg2d_so libmmg3d_so libmmgs_so
            DESTINATION mmgpy)
    install(TARGETS libmmg2d_so libmmg3d_so libmmgs_so
            DESTINATION "${SKBUILD_SCRIPTS_DIR}")

    # Install executables with RPATH set
    install(FILES
        "${mmg_BINARY_DIR}/bin/mmg2d_O3"
        DESTINATION "${SKBUILD_SCRIPTS_DIR}"
        RENAME "mmg2d"
        PERMISSIONS OWNER_READ OWNER_WRITE OWNER_EXECUTE
                   GROUP_READ GROUP_EXECUTE
                   WORLD_READ WORLD_EXECUTE
    )
    install(CODE "
        execute_process(
            COMMAND patchelf --set-rpath \"$ORIGIN\"
            \"\${CMAKE_INSTALL_PREFIX}/${SKBUILD_SCRIPTS_DIR}/mmg2d\"
        )
    ")

    install(FILES
        "${mmg_BINARY_DIR}/bin/mmg3d_O3"
        DESTINATION "${SKBUILD_SCRIPTS_DIR}"
        RENAME "mmg3d"
        PERMISSIONS OWNER_READ OWNER_WRITE OWNER_EXECUTE
                   GROUP_READ GROUP_EXECUTE
                   WORLD_READ WORLD_EXECUTE
    )
    install(CODE "
        execute_process(
            COMMAND patchelf --set-rpath \"$ORIGIN\"
            \"\${CMAKE_INSTALL_PREFIX}/${SKBUILD_SCRIPTS_DIR}/mmg3d\"
        )
    ")

    install(FILES
        "${mmg_BINARY_DIR}/bin/mmgs_O3"
        DESTINATION "${SKBUILD_SCRIPTS_DIR}"
        RENAME "mmgs"
        PERMISSIONS OWNER_READ OWNER_WRITE OWNER_EXECUTE
                   GROUP_READ GROUP_EXECUTE
                   WORLD_READ WORLD_EXECUTE
    )
    install(CODE "
        execute_process(
            COMMAND patchelf --set-rpath \"$ORIGIN\"
            \"\${CMAKE_INSTALL_PREFIX}/${SKBUILD_SCRIPTS_DIR}/mmgs\"
        )
    ")
endif()