cmake_minimum_required(VERSION 3.15)

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
    # Unix-specific installation
    # Set RPATH for Python module
    set_target_properties(mmgpy PROPERTIES
        INSTALL_RPATH "$ORIGIN/lib"
        BUILD_WITH_INSTALL_RPATH TRUE
        SKIP_BUILD_RPATH FALSE
    )

    # Install shared libraries
    install(TARGETS libmmg2d_so libmmg3d_so libmmgs_so
            DESTINATION mmgpy/lib)
            
    # Install each executable separately to handle the renaming
    foreach(exe mmg2d mmg3d mmgs)
        install(TARGETS ${exe}
                DESTINATION "${SKBUILD_SCRIPTS_DIR}"
                RENAME "${exe}_O3"
                PERMISSIONS OWNER_READ OWNER_WRITE OWNER_EXECUTE 
                          GROUP_READ GROUP_EXECUTE 
                          WORLD_READ WORLD_EXECUTE
        )
        # Set RPATH for each executable
        set_target_properties(${exe} PROPERTIES
            INSTALL_RPATH "$ORIGIN/../lib/python${PYTHON_VERSION_MAJOR}.${PYTHON_VERSION_MINOR}/site-packages/mmgpy/lib"
            BUILD_WITH_INSTALL_RPATH TRUE
            SKIP_BUILD_RPATH FALSE
        )
    endforeach()
    
    message(STATUS "SKBUILD_SCRIPTS_DIR ${SKBUILD_SCRIPTS_DIR}")
    message(STATUS "SKBUILD_PLATLIB_DIR ${SKBUILD_PLATLIB_DIR}")
endif()