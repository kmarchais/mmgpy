#!/bin/bash
# Build script for MMGpy Blender Extension
#
# This script builds the Blender extension with all dependencies bundled.
# It uses blender-extension-builder for wheel management.
#
# Usage:
#   ./build.sh              # Build for current platform
#   ./build.sh --all        # Build for all platforms (split packages)
#   ./build.sh --install    # Build and install to Blender
#
# Requirements:
#   - Python 3.10+
#   - pip install blender-extension-builder
#   - Blender 4.2+ (for --install)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== MMGpy Blender Extension Builder ===${NC}"

# Check for blender-extension-builder
if ! command -v bbext &> /dev/null; then
    echo -e "${YELLOW}Installing blender-extension-builder...${NC}"
    pip install blender-extension-builder
fi

# Sync version from pyproject.toml
echo -e "${YELLOW}Syncing version from pyproject.toml...${NC}"
python3 sync_version.py

# Parse arguments
ALL_PLATFORMS=false
INSTALL=false
ENABLE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --all)
            ALL_PLATFORMS=true
            shift
            ;;
        --install|-I)
            INSTALL=true
            shift
            ;;
        --enable|-e)
            ENABLE=true
            shift
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            exit 1
            ;;
    esac
done

# Create wheels directory if it doesn't exist
mkdir -p wheels

# Build command
BUILD_CMD="bbext -m blender_manifest.toml"

if [ "$ALL_PLATFORMS" = true ]; then
    echo -e "${YELLOW}Building for all platforms (this may take a while)...${NC}"
    BUILD_CMD="$BUILD_CMD --all-wheels --split-platforms"
else
    echo -e "${YELLOW}Building for current platform...${NC}"
fi

if [ "$INSTALL" = true ]; then
    BUILD_CMD="$BUILD_CMD --install"
fi

if [ "$ENABLE" = true ]; then
    BUILD_CMD="$BUILD_CMD --enable"
fi

echo -e "${GREEN}Running: $BUILD_CMD${NC}"
$BUILD_CMD

# List built packages
echo ""
echo -e "${GREEN}Built packages:${NC}"
ls -lh *.zip 2>/dev/null || echo "No .zip files found in current directory"

echo ""
echo -e "${GREEN}Done!${NC}"

if [ "$ALL_PLATFORMS" = true ]; then
    echo -e "${YELLOW}Note: Platform-specific packages created.${NC}"
    echo "Upload the appropriate package for each platform."
fi
