#!/bin/bash
# Download and prepare VTK for wheel building
# Usage: ./download_vtk.sh <platform> <arch> <output_dir>
# Example: ./download_vtk.sh linux x86_64 ./vtk-cache

set -e

PLATFORM="${1:-linux}"
ARCH="${2:-x86_64}"
OUTPUT_DIR="${3:-./vtk-cache}"
VTK_VERSION="${VTK_VERSION:-9.6.0}"
VTK_MAJOR_MINOR="${VTK_VERSION%.*}"

echo "=== Downloading VTK ${VTK_VERSION} for ${PLATFORM}-${ARCH} ==="

RELEASE_TAG="VTK-${VTK_VERSION}-shared"

case "${PLATFORM}" in
    linux)
        # vtk-builds publishes manylinux2014 archives; these remain forward-compatible
        # with the manylinux_2_28 wheel image used in build-wheels.yml.
        VTK_FILE="vtk-manylinux2014_${ARCH}.tar.gz"
        LIB_EXT="so"
        LIB_DIR="lib64"
        ;;
    macos|darwin)
        VTK_FILE="vtk-macOS-${ARCH}.tar.gz"
        LIB_EXT="dylib"
        LIB_DIR="lib"
        ;;
    windows)
        VTK_FILE="vtk-Windows-x86_64.tar.gz"
        LIB_EXT="dll"
        LIB_DIR="bin"
        ;;
    *)
        echo "ERROR: Unknown platform: ${PLATFORM}"
        exit 1
        ;;
esac

VTK_URL="https://github.com/sanguinariojoe/vtk-builds/releases/download/${RELEASE_TAG}/${VTK_FILE}"

# Create output directory
mkdir -p "${OUTPUT_DIR}"
cd "${OUTPUT_DIR}"

# Download if not already present
if [ ! -f "vtk.tar.gz" ]; then
    echo "Downloading ${VTK_URL}..."
    curl -L -o vtk.tar.gz "${VTK_URL}"
else
    echo "Using cached vtk.tar.gz"
fi

# Extract
echo "Extracting VTK..."
rm -rf vtk
mkdir -p vtk
tar -xzf vtk.tar.gz -C vtk --strip-components=1

# Set up directory structure
cd vtk
mkdir -p "${LIB_DIR}"

# Move loose libraries to lib directory
if [ "${PLATFORM}" = "linux" ]; then
    mv lib*.so* "${LIB_DIR}/" 2>/dev/null || true
elif [ "${PLATFORM}" = "macos" ] || [ "${PLATFORM}" = "darwin" ]; then
    mv lib*.dylib "${LIB_DIR}/" 2>/dev/null || true
fi

# Fix versioned symlinks (e.g. 9.6.9.6 -> 9.6.0 -> 9.6)
# vtk-builds names libraries as lib*-MAJOR.MINOR.MAJOR.MINOR.{so,dylib},
# but CMake and linkers look for lib*-MAJOR.MINOR.{so,dylib}.
echo "Fixing VTK library symlinks..."
cd "${LIB_DIR}"

FULL_SUFFIX="${VTK_MAJOR_MINOR}.${VTK_MAJOR_MINOR}"
if [ "${PLATFORM}" = "linux" ]; then
    for lib in *.so; do
        [ -e "$lib" ] || continue  # Skip if no match
        if [[ "$lib" == *"-${FULL_SUFFIX}.so" ]]; then
            base=$(echo "$lib" | sed "s/-${FULL_SUFFIX}.so//g")
            rm -f "${base}-${VTK_VERSION}.so" "${base}-${VTK_MAJOR_MINOR}.so" 2>/dev/null || true
            ln -sf "${base}-${FULL_SUFFIX}.so" "${base}-${VTK_VERSION}.so"
            ln -sf "${base}-${FULL_SUFFIX}.so" "${base}-${VTK_MAJOR_MINOR}.so"
        fi
    done
elif [ "${PLATFORM}" = "macos" ] || [ "${PLATFORM}" = "darwin" ]; then
    for lib in *.dylib; do
        [ -e "$lib" ] || continue  # Skip if no match
        if [[ "$lib" == *"-${FULL_SUFFIX}.dylib" ]]; then
            base=$(echo "$lib" | sed "s/-${FULL_SUFFIX}.dylib//g")
            rm -f "${base}-${VTK_VERSION}.dylib" "${base}-${VTK_MAJOR_MINOR}.dylib" 2>/dev/null || true
            ln -sf "${base}-${FULL_SUFFIX}.dylib" "${base}-${VTK_VERSION}.dylib"
            ln -sf "${base}-${FULL_SUFFIX}.dylib" "${base}-${VTK_MAJOR_MINOR}.dylib"
        fi
    done
fi

# Note: VTK filtering happens in repair-wheel-command after the build,
# not here. CMake needs all VTK libraries during configuration.

LIB_COUNT=$(ls -1 libvtk*.${LIB_EXT}* 2>/dev/null | wc -l)
echo "VTK libraries available: ${LIB_COUNT}"

# Go back to vtk root
cd ..

# Set up include directory
mkdir -p "include/vtk-${VTK_MAJOR_MINOR}"
if [ -d "vtk-${VTK_MAJOR_MINOR}" ]; then
    cp -r "vtk-${VTK_MAJOR_MINOR}"/* "include/vtk-${VTK_MAJOR_MINOR}/"
fi

# Create bin directory with stub executables (needed by CMake)
mkdir -p bin
for exe in vtkWrapHierarchy vtkWrapPython vtkWrapPythonInit vtkParseJava vtkWrapJava vtkWrapJavaScript vtkWrapSerDes vtkProbeOpenGLVersion; do
    touch "bin/${exe}-${VTK_MAJOR_MINOR}"
    chmod +x "bin/${exe}-${VTK_MAJOR_MINOR}"
done

echo "=== VTK ${VTK_VERSION} prepared in ${OUTPUT_DIR}/vtk ==="
du -sh .
