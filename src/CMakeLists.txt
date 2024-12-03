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
    SET(CMAKE_INSTALL_RPATH "$ORIGIN")

    # Install executables and create symlinks
    foreach(EXE_NAME mmg2d_O3 mmg3d_O3 mmgs_O3)
        # Install the executable
        install(PROGRAMS ${mmg_BINARY_DIR}/bin/${EXE_NAME}
                DESTINATION mmgpy/bin)

        # Copy the corresponding library to bin directory
        if(APPLE)
            string(REPLACE "_O3" "" BASE_NAME ${EXE_NAME})
            install(FILES 
                "${mmg_BINARY_DIR}/lib/lib${BASE_NAME}.dylib"
                "${mmg_BINARY_DIR}/lib/lib${BASE_NAME}.5.dylib"
                DESTINATION mmgpy/bin)

            # Create symlinks for both executable and libraries
            install(CODE "
                file(MAKE_DIRECTORY \"${SKBUILD_SCRIPTS_DIR}\")
                execute_process(COMMAND ${CMAKE_COMMAND} -E create_symlink 
                    \"${CMAKE_INSTALL_PREFIX}/mmgpy/bin/${EXE_NAME}\"
                    \"${SKBUILD_SCRIPTS_DIR}/${EXE_NAME}\"
                )
                execute_process(COMMAND ${CMAKE_COMMAND} -E create_symlink 
                    \"${CMAKE_INSTALL_PREFIX}/mmgpy/bin/lib${BASE_NAME}.dylib\"
                    \"${SKBUILD_SCRIPTS_DIR}/lib${BASE_NAME}.dylib\"
                )
                execute_process(COMMAND ${CMAKE_COMMAND} -E create_symlink 
                    \"${CMAKE_INSTALL_PREFIX}/mmgpy/bin/lib${BASE_NAME}.5.dylib\"
                    \"${SKBUILD_SCRIPTS_DIR}/lib${BASE_NAME}.5.dylib\"
                )
                execute_process(
                    COMMAND install_name_tool -change 
                        \"@rpath/lib${BASE_NAME}.5.dylib\"
                        \"@loader_path/lib${BASE_NAME}.5.dylib\"
                        \"\${CMAKE_INSTALL_PREFIX}/mmgpy/bin/${EXE_NAME}\"
                )
            ")
        else()
            # For Linux, just create the executable symlink
            install(CODE "
                file(MAKE_DIRECTORY \"${SKBUILD_SCRIPTS_DIR}\")
                execute_process(COMMAND ${CMAKE_COMMAND} -E create_symlink 
                    \"${CMAKE_INSTALL_PREFIX}/mmgpy/bin/${EXE_NAME}\"
                    \"${SKBUILD_SCRIPTS_DIR}/${EXE_NAME}\"
                )")
        endif()
    endforeach()

    # Also install and symlink libmmg
    if(APPLE)
        install(FILES 
            "${mmg_BINARY_DIR}/lib/libmmg.dylib"
            "${mmg_BINARY_DIR}/lib/libmmg.5.dylib"
            DESTINATION mmgpy/bin)
            
        install(CODE "
            execute_process(COMMAND ${CMAKE_COMMAND} -E create_symlink 
                \"${CMAKE_INSTALL_PREFIX}/mmgpy/bin/libmmg.dylib\"
                \"${SKBUILD_SCRIPTS_DIR}/libmmg.dylib\"
            )
            execute_process(COMMAND ${CMAKE_COMMAND} -E create_symlink 
                \"${CMAKE_INSTALL_PREFIX}/mmgpy/bin/libmmg.5.dylib\"
                \"${SKBUILD_SCRIPTS_DIR}/libmmg.5.dylib\"
            )
        ")
    endif()
endif()