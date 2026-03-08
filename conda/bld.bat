@echo on

cmake -B build %CMAKE_ARGS% -DMMGPY_CONDA_BUILD=ON -DFETCHCONTENT_SOURCE_DIR_MMG=%SRC_DIR%\mmg-src -GNinja
if errorlevel 1 exit 1

cmake --build build
if errorlevel 1 exit 1

cmake --install build
if errorlevel 1 exit 1
