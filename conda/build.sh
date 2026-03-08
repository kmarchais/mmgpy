#!/bin/bash
set -exuo pipefail

cmake -B build \
    ${CMAKE_ARGS} \
    -DMMGPY_CONDA_BUILD=ON \
    -GNinja

cmake --build build
cmake --install build
