#!/bin/bash
set -exuo pipefail

cmake -B build \
    ${CMAKE_ARGS} \
    -DMMGPY_CONDA_BUILD=ON \
    -DMMGPY_USE_SYSTEM_MMG=ON \
    -DBUILD_TESTING=OFF \
    -GNinja

cmake --build build
cmake --install build
