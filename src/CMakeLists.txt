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
    # Enable RPATH
    SET(CMAKE_SKIP_BUILD_RPATH FALSE)
    SET(CMAKE_BUILD_WITH_INSTALL_RPATH TRUE)
    SET(CMAKE_INSTALL_RPATH_USE_LINK_PATH TRUE)
    SET(CMAKE_INSTALL_RPATH "$ORIGIN/../lib")

    # Install executables
    foreach(EXE_NAME mmg2d mmg3d mmgs)
        # Install the actual executable to site-packages/bin
        install(PROGRAMS ${mmg_BINARY_DIR}/bin/${EXE_NAME}_O3
                DESTINATION mmgpy/bin)

        # Create symlink after installation
        install(CODE "
            message(STATUS \"Creating symlink for ${EXE_NAME}_O3\")
            execute_process(
                COMMAND \"${CMAKE_COMMAND}\" -E create_symlink 
                    \"${CMAKE_INSTALL_PREFIX}/mmgpy/bin/${EXE_NAME}_O3\"
                    \"${SKBUILD_SCRIPTS_DIR}/${EXE_NAME}_O3\"
                RESULT_VARIABLE result
                ERROR_VARIABLE error
            )
            if(result)
                message(STATUS \"Failed to create symlink for ${EXE_NAME}_O3: \${error}\")
            endif()
        ")
    endforeach()
endif()