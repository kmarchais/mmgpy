#!/bin/bash
set -exuo pipefail

export CMAKE_ARGS="${CMAKE_ARGS:-} -DMMGPY_CONDA_BUILD=ON"

${PYTHON} -m pip install . -vv --no-deps --no-build-isolation
