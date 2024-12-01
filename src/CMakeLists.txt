cmake_minimum_required(VERSION 3.15)

# Create the core binding module
pybind11_add_module(mmgpy_core 
    bindings/common.cpp
)

# Set include directories
target_include_directories(mmgpy_core
    PRIVATE
        ${MMG_INCLUDE_DIRS}
        ${mmg_BINARY_DIR}/include
        ${mmg_SOURCE_DIR}/include
)

# Link against MMG libraries
target_link_libraries(mmgpy_core
    PRIVATE
        ${MMG_LIBRARIES}
)

# Handle compiler warnings
if(MSVC)
    target_compile_options(mmgpy_core PRIVATE /W4)
else()
    target_compile_options(mmgpy_core PRIVATE -Wall -Wextra -Wpedantic)
endif()

# Set the output name
set_target_properties(mmgpy_core PROPERTIES 
    OUTPUT_NAME "_core"
    PREFIX ""
    SUFFIX "${PYTHON_MODULE_EXTENSION}"
)

# Install the module
install(TARGETS mmgpy_core DESTINATION mmgpy)

if(WIN32)
    # Install shared libraries with both the module and executables
    install(FILES 
        $<TARGET_FILE:libmmg2d_so>
        $<TARGET_FILE:libmmg3d_so>
        $<TARGET_FILE:libmmgs_so>
        DESTINATION mmgpy
    )
    install(FILES 
        $<TARGET_FILE:libmmg2d_so>
        $<TARGET_FILE:libmmg3d_so>
        $<TARGET_FILE:libmmgs_so>
        DESTINATION "${SKBUILD_SCRIPTS_DIR}"
    )
    
    # Install executables to scripts directory
    install(FILES 
        "${mmg_BINARY_DIR}/bin/Release/mmg2d.exe"
        "${mmg_BINARY_DIR}/bin/Release/mmg3d.exe"
        "${mmg_BINARY_DIR}/bin/Release/mmgs.exe"
        DESTINATION "${SKBUILD_SCRIPTS_DIR}"
    )
else()
    # Install executables to bin directory on Unix
    install(FILES 
        ${mmg_BINARY_DIR}/bin/mmg2d
        ${mmg_BINARY_DIR}/bin/mmg3d
        ${mmg_BINARY_DIR}/bin/mmgs
        DESTINATION "${SKBUILD_SCRIPTS_DIR}"
        PERMISSIONS OWNER_READ OWNER_WRITE OWNER_EXECUTE
                   GROUP_READ GROUP_EXECUTE
                   WORLD_READ WORLD_EXECUTE
    )
endif()