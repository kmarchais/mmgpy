@echo on

set CMAKE_ARGS=%CMAKE_ARGS% -DMMGPY_CONDA_BUILD=ON

%PYTHON% -m pip install . -vv --no-deps --no-build-isolation
if errorlevel 1 exit 1
