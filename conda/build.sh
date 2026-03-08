#!/bin/bash
set -exuo pipefail

cmake -B build \
    ${CMAKE_ARGS} \
    -DMMGPY_CONDA_BUILD=ON \
    -DMMG_SOURCE_DIR=$SRC_DIR/mmg-src \
    -GNinja

cmake --build build
cmake --install build
