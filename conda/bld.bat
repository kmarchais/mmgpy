@echo on

cmake -B build %CMAKE_ARGS% -DMMGPY_CONDA_BUILD=ON -DMMGPY_USE_SYSTEM_MMG=ON -DBUILD_TESTING=OFF -GNinja
if errorlevel 1 exit 1

cmake --build build
if errorlevel 1 exit 1

cmake --install build
if errorlevel 1 exit 1
