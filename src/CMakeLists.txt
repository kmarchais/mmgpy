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

# Install the module
install(TARGETS mmgpy DESTINATION mmgpy)

if(WIN32)
    # Determine build type dependent path for executables
    if(CMAKE_BUILD_TYPE)
        set(MMG_EXE_DIR "${mmg_BINARY_DIR}/bin/${CMAKE_BUILD_TYPE}")
    else()
        set(MMG_EXE_DIR "${mmg_BINARY_DIR}/bin/Release")
    endif()

    # Install shared libraries with the module
    install(FILES 
        $<TARGET_FILE:libmmg2d_so>
        $<TARGET_FILE:libmmg3d_so>
        $<TARGET_FILE:libmmgs_so>
        DESTINATION mmgpy
    )
    
    # Install shared libraries alongside executables
    install(FILES 
        $<TARGET_FILE:libmmg2d_so>
        $<TARGET_FILE:libmmg3d_so>
        $<TARGET_FILE:libmmgs_so>
        DESTINATION "${SKBUILD_SCRIPTS_DIR}"
    )
    
    # Install executables
    install(FILES 
        "${MMG_EXE_DIR}/mmg2d.exe"
        "${MMG_EXE_DIR}/mmg3d.exe"
        "${MMG_EXE_DIR}/mmgs.exe"
        DESTINATION "${SKBUILD_SCRIPTS_DIR}"
    )
else()
    # Install executables on Unix with appropriate permissions
    install(FILES 
        "${mmg_BINARY_DIR}/bin/mmg2d"
        "${mmg_BINARY_DIR}/bin/mmg3d"
        "${mmg_BINARY_DIR}/bin/mmgs"
        DESTINATION "${SKBUILD_SCRIPTS_DIR}"
        PERMISSIONS OWNER_READ OWNER_WRITE OWNER_EXECUTE
                   GROUP_READ GROUP_EXECUTE
                   WORLD_READ WORLD_EXECUTE
    )
endif()