#!/bin/bash
cd /Users/kmarchais/dev/mmgpy
rm -rf build
echo "Testing MMG executable build..."
uvx cibuildwheel . --only=cp39-macosx_arm64
echo "Checking for executables..."
find build/_deps/mmg-build/bin -name "*mmg*" 2>/dev/null || echo "No executables found"